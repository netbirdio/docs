# Daemon IPC authorization and profile ownership (preview)

> **Status:** preview of unreleased changes in
> [netbirdio/netbird#7407](https://github.com/netbirdio/netbird/pull/7407) and
> [netbirdio/netbird#7704](https://github.com/netbirdio/netbird/pull/7704).
> This file exists to support early testing of the behavior.

## Contents

- [What changes](#what-changes)
- [Profile ownership and daemon access](#profile-ownership-and-daemon-access)
  - [How the daemon identifies a caller](#how-the-daemon-identifies-a-caller)
  - [Access levels](#access-levels)
  - [Profile ownership](#profile-ownership)
  - [Upgrade from an earlier version](#upgrade-from-an-earlier-version)
  - [Environment variables](#environment-variables)
  - [Restrict daemon access to a group](#restrict-daemon-access-to-a-group)
- [Daemon sockets: TCP is deprecated](#daemon-sockets-tcp-is-deprecated)
- [Troubleshooting](#troubleshooting)
- [Configuration reference changes](#configuration-reference-changes)
- [Report a problem](#report-a-problem)

## What changes

| What | Before | After |
| --- | --- | --- |
| Daemon authorization | Any local user with socket access could read status and configuration and perform every operation that did not require privileges. Only the SSH-related operations were gated on root or administrator (since 0.76.0). | The daemon identifies every caller from the operating system and applies four access levels: Identified, Profile owner, Session holder, Privileged. |
| Profile ownership | Profiles recorded no owner. | Each profile records one owner (`uid:<id>` on Linux and macOS, `sid:<SID>` on Windows). Only the owner, or a privileged user, can use it. |
| Active connection | Any local user could disconnect or switch profiles. | The connection belongs to the user who started it. Other users cannot connect, disconnect, or switch profiles until it stops. `sudo netbird down` stops it. |
| `netbird profile list` | Listed every profile. | Lists only the profiles you own. New `--show-owner` flag. |
| `netbird profile claim` | Did not exist. | New privileged subcommand that assigns an owner to a profile. |
| Profile storage | New profiles were stored under `<state-dir>/<username>/<id>.json`. | New profiles are stored under `<state-dir>/profiles.v1/<id>.json`. Profiles from earlier versions stay in their per-user directory and are migrated in place. |
| TCP daemon sockets | `tcp://host:port` was a supported address for `--daemon-addr` and `--json-socket`. Only privileged operations were refused on it. | TCP is deprecated and the daemon refuses every request on a TCP socket. Use `unix://` on Linux and macOS, or `npipe://` on Windows. |
| Socket access restriction | Not available. The documented workaround was a custom socket in a restricted directory. | New `--allow-group` service flag and `allowGroups` MDM policy key restrict who can connect to the daemon sockets at the operating-system level. |
| Environment variables | N/A | `NB_DISABLE_PROFILE_OWNERSHIP` and `NB_DISABLE_DEFAULT_PROFILE_CLAIM`. |
| MDM policy keys | 20 keys. | 21 keys. Adds `allowGroups`. |
| Debug bundle | No profile inventory. | Includes `profiles.txt` and `active_profile.json`. |

## Profile ownership and daemon access

The NetBird daemon runs as root, or as LocalSystem on Windows. Each local user can connect to its socket. Without a check, one user can read or change the profile of another user, or stop that user's connection.

To prevent this, the daemon identifies each caller and gives each profile an owner. A user can use only the profiles that they own. A connection belongs to the user who started it.

### How the daemon identifies a caller

The daemon gets the identity of the caller from the operating system, not from the request. It reads the identity from the kernel: `SO_PEERCRED` on Linux, `LOCAL_PEERCRED` on macOS, and the named-pipe client token on Windows. If the daemon cannot identify the caller, it refuses the request.

A TCP socket does not carry an identity, so the daemon refuses every request on it. See [Daemon sockets: TCP is deprecated](#daemon-sockets-tcp-is-deprecated).

### Access levels

The daemon gives each request one of four access levels. Each level can do all the operations of the levels above it in this table.

| Level | Who | Operations |
| --- | --- | --- |
| Identified | Any user that the daemon can identify | Read basic status. List your profiles. Add a profile. |
| Profile owner | The owner of the profile | Read and change the profile configuration. Rename, remove, or deregister the profile. |
| Session holder | The owner of the active profile and the connection is up | Disconnect. Log in. Switch profiles. Select networks. Read detailed status. Create a debug bundle. |
| Privileged | Root, an elevated administrator, or the user that the daemon runs as | All operations on all profiles. Claim a profile. |

The daemon lets the user that it runs as act as a privileged user only when the daemon itself is not privileged. An example is a rootless container.

Operations that decide who may obtain a shell on the machine are refused unless the caller is root, or an administrator on Windows. See [privileged operations](https://docs.netbird.io/client/grpc-socket#privileged-operations).

#### Commands and required access

| Command | Required level |
| --- | --- |
| `netbird status` | Identified. Detailed status requires session holder. |
| `netbird profile list`, `netbird profile add` | Identified |
| `netbird profile rename`, `netbird profile remove`, `netbird deregister` | Profile owner |
| `netbird up`, `netbird down`, `netbird login`, `netbird profile select` | Session holder |
| `netbird debug bundle` | Session holder |
| `netbird profile claim` | Privileged |

### Profile ownership

Each profile records one owner. On Linux and macOS, the owner is a user ID, for example `uid:1000`. On Windows, the owner is a security identifier (SID), for example `sid:S-1-5-21-...`.

When you add a profile, you become its owner. Root and administrators can see and use all profiles.

> **Warning:** If you *add* a profile with `sudo`, root becomes the owner. Run `netbird profile add` as your own user.

#### List profiles

`netbird profile list` shows only the profiles that you own:

```shell
netbird profile list
```

```text
NAME     ACTIVE
work     *
default
home
```

A `*` in the `ACTIVE` column marks the active profile. Inactive profiles are left blank. Earlier versions marked the active profile with `✓`.

To show the ID of each profile, add `--show-id`:

```shell
netbird profile list --show-id
```

```text
ID        NAME     ACTIVE
a1b2c3d4  work     *
default   default
e5f6a7b8  home
```

To show the owner of each profile, add `--show-owner`:

```shell
sudo netbird profile list --show-owner
```

```text
NAME     ACTIVE  OWNER
default  *       alice
work             bob
lab              unowned
```

#### Connections of other users

When a user connects, the active profile and its connection belong to that user. Other users cannot connect, disconnect, or switch profiles until the connection stops. To stop the connection of another user, run:

```shell
sudo netbird down
```

#### Claim a profile

The `profile` command gains a `claim` subcommand:

```shell
netbird profile <add|list|select|rename|remove|claim> [name|handle]
```

To give a profile an owner, run `netbird profile claim` as root or as an administrator:

```shell
sudo netbird profile claim <profile> --owner <owner>
```

The `<owner>` value is an account name, a `uid:<id>` value, or a `sid:<SID>` value. The daemon does not check that a `uid` or `sid` value belongs to an existing account.

On Linux and macOS, if you do not set `--owner`, the owner is the user who ran `sudo`. If you run the command in a root shell without `sudo`, `--owner` is required. On Windows, `--owner` is required.

### Upgrade from an earlier version

Earlier versions kept profiles in one directory for each user, for example `/var/lib/netbird/<username>/`, and recorded no owner. When the new daemon starts for the first time, it migrates these profiles. Your profiles stay in their directories.

The migration does these steps:

1. Gives a new unique ID to profiles that have the same ID in different user directories.
2. Records the owner of the profiles of the last active user and of the default profile.
3. Creates the `profiles.v1` directory in the state directory. This directory shows that the migration is complete.

If the migration fails, the daemon writes the error to the log and tries again at the next start. The daemon saves new profiles in the `profiles.v1` directory.

#### Automatic claims

After the migration, some profiles can still have no owner. The daemon gives them an owner when a user sends a request:

- **Profiles in a user directory.** The daemon records the user whose name matches the directory as the owner.
- **Default profile.** The daemon records the first user who is logged in at the console of the device as the owner. A console is a local graphical session, or a local seat on Linux. A user in a remote SSH or RDP session is not at the console.

Root and administrators never become owners through an automatic claim.

On a device with no console, for example a headless server, the default profile keeps no owner. Only root and administrators can use it. To give it an owner, run:

```shell
sudo netbird profile claim default --owner <owner>
```

### Environment variables

Set these variables on the daemon. For instructions, see [Client environment variables](https://docs.netbird.io/client/environment-variables#setting-environment-variables).

| Variable | Platform | Description |
| --- | --- | --- |
| `NB_DISABLE_PROFILE_OWNERSHIP` | Linux, macOS, Windows, FreeBSD | Set to `true` to turn off profile ownership. All identified local users can use all profiles and control all connections. Android and iOS always work this way. |
| `NB_DISABLE_DEFAULT_PROFILE_CLAIM` | Linux, macOS, Windows, FreeBSD | Set to `true` to stop the [automatic claim](#automatic-claims) of the default profile. The default profile then has no owner until an administrator runs `netbird profile claim`. |

> **Warning:** `NB_DISABLE_PROFILE_OWNERSHIP` removes the isolation between local users. Use it only on a device with one user or for legacy use cases.

### Restrict daemon access to a group

By default, all local users can connect to the daemon socket. To let only one group connect, set `--allow-group` when you install the service:

```shell
sudo netbird service install --allow-group netbird-users
```

The operating system then refuses connections from users outside the group. This flag replaces the earlier recommendation to place a custom socket inside a restricted directory.

- On Linux and macOS, you can set only one group. The value is a group name or a group ID.
- On Windows, you can set a comma-separated list of groups or accounts. LocalSystem, elevated administrators, and the account that the daemon runs as always keep access.
- `netbird service reconfigure` resolves the names again.
- To remove the restriction, run `sudo netbird service reconfigure --allow-group ""`.

> **Note:** A TCP socket cannot carry the restriction. If you set `--allow-group` for a daemon on a TCP socket, the daemon does not start.

#### Set allowed groups with MDM

On managed Windows and macOS devices, use the `allowGroups` [MDM policy key](https://docs.netbird.io/client/mdm-integration). On Windows, the Group Policy name is **Restrict the daemon sockets**.

- The MDM value replaces the `--allow-group` value. An empty value removes a restriction that the installer set.
- On macOS, set exactly one group ID, for example `gid:1001`.
- On Windows, set a comma-separated list of SIDs, for example `sid:S-1-5-21-...`.
- Use IDs, not names. The daemon reads this value when it starts. It waits a maximum of 5 seconds to resolve names.

> **Warning:** If the daemon cannot read the MDM policy or resolve the value, it does not start. This behavior prevents an open socket on a device that must be restricted.

## Daemon sockets: TCP is deprecated

These changes apply to both the [gRPC daemon socket](https://docs.netbird.io/client/grpc-socket) and the [HTTP/JSON daemon socket](https://docs.netbird.io/client/json-socket).

### Supported address formats

The `--daemon-addr` option accepts these formats:

```text
unix:///path/to/netbird.sock
npipe://name
```

The `tcp://host:port` format is deprecated. A future release removes it.

A TCP connection does not carry a caller identity. The daemon cannot identify the caller, so it refuses every request on a TCP socket. Use a Unix socket on Linux and macOS, or a named pipe on Windows.

Before this change, the daemon accepted requests on a TCP socket and refused only the [privileged operations](https://docs.netbird.io/client/grpc-socket#privileged-operations). After this change, every request on a TCP socket is refused.

### Migrate a service that uses a TCP socket

If your service uses a TCP socket for the gRPC daemon socket, change it to the default address:

```shell
sudo netbird service reconfigure --daemon-addr unix:///var/run/netbird.sock
```

On Windows, use `--daemon-addr npipe://netbird`.

If the HTTP/JSON gateway uses a TCP socket, change `--json-socket` to a Unix socket:

```shell
sudo netbird service reconfigure \
  --enable-json-socket \
  --json-socket unix:///var/run/netbird-integration-http.sock
```

## Troubleshooting

### Profile ownership

#### Another user has this machine connected

**Symptom:** A command fails with a message that says another user has the machine connected.

**Cause:** Another user started the current connection.

**Fix:** Ask that user to disconnect, or run `sudo netbird down`.

#### The profile belongs to another user

**Symptom:** A command fails with a message that says the profile belongs to another user.

**Cause:** You do not own the profile.

**Fix:** Use a profile that you own. Or, ask an administrator to run `sudo netbird profile claim <profile> --owner <your-user>`.

#### The profile has no owner on record

**Symptom:** A command fails with a message that says the profile has no owner on record.

**Cause:** The profile was not claimed. This is usual on a device with no console, or when you connect over SSH.

**Fix:** Run the `netbird profile claim` command that the error message shows.

#### A headless machine cannot use the default profile

**Symptom:** On a server or other device with no console, a regular user cannot connect after a new install or an upgrade.

**Cause:** No user is logged in at the console, so the daemon cannot claim the default profile automatically. This happens both during the migration and on a new install. See [Automatic claims](#automatic-claims).

**Fix:** Claim the default profile once as root or as an administrator:

```shell
sudo netbird profile claim default --owner <owner>
```

#### A profile is missing from the profile list

**Cause:** `netbird profile list` shows only the profiles that you own.

**Fix:** To see all profiles and their owners, run `sudo netbird profile list --show-owner`.

#### Detailed status is unavailable

**Symptom:** `netbird status` shows `Detailed status is unavailable: the connection belongs to another user.`

**Cause:** Another user holds the connection. You can see only the daemon status.

### Daemon sockets

#### A client receives an Unavailable or connection-refused error

Confirm that the daemon is running and that the integration uses the same socket address as the service. For a Unix socket, also verify access to the socket and each parent directory. If the address uses `tcp://`, see [A TCP request is refused](#a-tcp-request-is-refused).

#### A call is refused with PermissionDenied (gRPC) or 403 (HTTP/JSON)

The operation is one of the [privileged operations](https://docs.netbird.io/client/grpc-socket#privileged-operations) and the caller is not root, or not an administrator on Windows. Check the `ErrorInfo` detail on the error: `PRIVILEGE_REQUIRED` in domain `daemon.netbird.io` means the daemon identified the caller and refused the change, rather than failing to reach it.

#### A TCP request is refused

TCP sockets are deprecated, and the daemon refuses every request on them. Change `--daemon-addr` to a Unix socket or a named pipe, and `--json-socket` to a Unix socket. See [Migrate a service that uses a TCP socket](#migrate-a-service-that-uses-a-tcp-socket).

#### The daemon does not start after you set allowed groups

**Possible causes:**

- A group name does not resolve.
- You set more than one group on Linux or macOS.
- The daemon or the JSON socket uses a TCP socket.
- The daemon cannot read the MDM policy.

**Fix:** Read the daemon log. The log shows which of these causes stopped the daemon.

### Collect information for support

A debug bundle includes `profiles.txt` and `active_profile.json`. These files show each profile, its owner, and the active profile. For instructions, see [Troubleshooting client issues](https://docs.netbird.io/help/troubleshooting-client).

## Configuration reference changes

These changes update existing reference pages. Each entry links to the section above that describes the behavior.

### Client environment variables

Two variables are added to the **Other** table of the [Client environment variables](https://docs.netbird.io/client/environment-variables) reference. See [Environment variables](#environment-variables).

| Variable | Platform |
| --- | --- |
| `NB_DISABLE_PROFILE_OWNERSHIP` | Linux, macOS, Windows, FreeBSD |
| `NB_DISABLE_DEFAULT_PROFILE_CLAIM` | Linux, macOS, Windows, FreeBSD |

### MDM policy key

The [MDM integration](https://docs.netbird.io/client/mdm-integration) policy keys reference grows from 20 to 21 keys with the addition of `allowGroups`. As with the other keys, the name is camelCase in the managed-configuration payload and the Windows ADMX template renders the PascalCase variant.

| Key | Type | Description |
| --- | --- | --- |
| `allowGroups` | string | Let only the listed groups connect to the daemon socket. Overrides `--allow-group`. An empty value removes the restriction. On macOS, set one `gid:<id>` value. On Windows, set comma-separated `sid:<SID>` values. See [Restrict daemon access to a group](#restrict-daemon-access-to-a-group). |

### Service flag `--allow-group`

New flag on `netbird service install` and `netbird service reconfigure`. See [Restrict daemon access to a group](#restrict-daemon-access-to-a-group).
