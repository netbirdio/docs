# Profile ownership and daemon access (preview)

> **Status: preview of unreleased client behavior.** This file consolidates every
> documentation change proposed in [netbirdio/docs#998](https://github.com/netbirdio/docs/pull/998),
> which documents the client changes in
> [netbirdio/netbird#7407](https://github.com/netbirdio/netbird/pull/7407).
> Both pull requests were open and unmerged when this file was written. The file
> exists to support early testing of the behavior. It is not part of the published
> documentation, it is not linked from the site navigation, and it will be removed
> once the pages land.

Rendered preview of the proposed pages: <https://docs-git-ipc-authz-profile-ownership-net-bird-77c7f821.vercel.app/client/profile-ownership>

Links in this file point to the published documentation at <https://docs.netbird.io>
for pages that already exist, and to sections of this file for content that the
pull request adds.

## Contents

- [What changes at a glance](#what-changes-at-a-glance)
- [Profile ownership and daemon access](#profile-ownership-and-daemon-access)
  - [How the daemon identifies a caller](#how-the-daemon-identifies-a-caller)
  - [Access levels](#access-levels)
  - [Profile ownership](#profile-ownership)
  - [Restrict daemon access to a group](#restrict-daemon-access-to-a-group)
  - [Environment variables](#environment-variables)
  - [Upgrade from an earlier version](#upgrade-from-an-earlier-version)
  - [Troubleshooting profile ownership](#troubleshooting-profile-ownership)
- [Daemon sockets: TCP is deprecated](#daemon-sockets-tcp-is-deprecated)
- [Profiles: storage layout and CLI changes](#profiles-storage-layout-and-cli-changes)
- [Configuration reference changes](#configuration-reference-changes)
- [Verification checklist for early testers](#verification-checklist-for-early-testers)
- [Files changed by the pull request](#files-changed-by-the-pull-request)

## What changes at a glance

| Area | Before | After |
| --- | --- | --- |
| Daemon authorization | Any local user with socket access could read status and configuration and perform every operation that did not require privileges. Only the SSH-related operations were gated on root or administrator (since 0.76.0). | The daemon identifies every caller from the operating system and applies four access levels: Identified, Profile owner, Session holder, Privileged. |
| Profile ownership | Profiles recorded no owner. | Each profile records one owner (`uid:<id>` on Linux and macOS, `sid:<SID>` on Windows). Only the owner, or a privileged user, can use it. |
| Active connection | Any local user could disconnect or switch profiles. | The connection belongs to the user who started it. Other users cannot connect, disconnect, or switch profiles until it stops. `sudo netbird down` stops it. |
| `netbird profile list` | Listed every profile. The active profile was marked with `✓`. | Lists only the profiles you own. The active profile is marked with `*`. New `--show-owner` flag. |
| `netbird profile claim` | Did not exist. | New privileged subcommand that assigns an owner to a profile. |
| Profile storage | New profiles were stored under `<state-dir>/<username>/<id>.json`. | New profiles are stored under `<state-dir>/profiles.v1/<id>.json`. Profiles from earlier versions stay in their per-user directory and are migrated in place. |
| TCP daemon sockets | `tcp://host:port` was a supported address for `--daemon-addr` and `--json-socket`. Only privileged operations were refused on it. | TCP is deprecated and the daemon refuses every request on a TCP socket. Use `unix://` on Linux and macOS, or `npipe://` on Windows. |
| Socket access restriction | Not available. The documented workaround was a custom socket in a restricted directory. | New `--allow-group` service flag and `allowGroups` MDM policy key restrict who can connect to the daemon sockets at the operating-system level. |
| Environment variables | None for this area. | `NB_DISABLE_PROFILE_OWNERSHIP` and `NB_DISABLE_DEFAULT_PROFILE_CLAIM`. |
| MDM policy keys | 20 keys. | 21 keys. Adds `allowGroups`. |
| Debug bundle | No profile inventory. | Includes `profiles.txt` and `active_profile.json`. |

## Profile ownership and daemon access

The NetBird daemon runs as root, or as LocalSystem on Windows. Each local user can connect to its socket. Without a check, one user can read or change the profile of another user, or stop that user's connection.

To prevent this, the daemon identifies each caller and gives each profile an owner. A user can use only the profiles that they own. A connection belongs to the user who started it.

### How the daemon identifies a caller

The daemon gets the identity of the caller from the operating system, not from the request. If the daemon cannot identify the caller, it refuses the request.

The identity is read from the kernel rather than supplied by the client: `SO_PEERCRED` on Linux, `LOCAL_PEERCRED` on macOS, and the named-pipe client token on Windows.

A TCP socket does not carry an identity, so the daemon refuses every request on it. TCP sockets are deprecated. For more information, see [Daemon sockets: TCP is deprecated](#daemon-sockets-tcp-is-deprecated).

### Access levels

The daemon gives each request one of four access levels. Each level can do all the operations of the levels above it in this table.

| Level | Who | Operations |
| --- | --- | --- |
| Identified | Any user that the daemon can identify | Read basic status. List your profiles. Add a profile. |
| Profile owner | The owner of the profile | Read and change the profile configuration. Rename, remove, or deregister the profile. |
| Session holder | The owner of the active profile and the connection is up | Disconnect. Log in. Switch profiles. Select networks. Read detailed status. Create a debug bundle. |
| Privileged | Root, an elevated administrator, or the user that the daemon runs as | All operations on all profiles. Claim a profile. |

The daemon lets the user that it runs as act as a privileged user only when the daemon itself is not privileged. An example is a rootless container.

The operations that decide who may obtain a shell on the machine (enabling the SSH server, enabling SSH root login, disabling SSH authentication, and changing the management URL or deregistering while the SSH server is enabled) keep their existing rule: they require root, or an administrator on Windows. See [Privileged operations](https://docs.netbird.io/client/grpc-socket#privileged-operations).

### Profile ownership

Each profile records one owner. On Linux and macOS, the owner is a user ID, for example `uid:1000`. On Windows, the owner is a security identifier (SID), for example `sid:S-1-5-21-...`.

When you add a profile, you become its owner. Root and administrators can see and use all profiles.

> **Warning:** If you add a profile with `sudo`, root becomes the owner. Run `netbird profile add` as your own user.

#### Commands and required access

| Command | Required level |
| --- | --- |
| `netbird status` | Identified. Detailed status requires session holder. |
| `netbird profile list`, `netbird profile add` | Identified |
| `netbird profile rename`, `netbird profile remove`, `netbird deregister` | Profile owner |
| `netbird up`, `netbird down`, `netbird login`, `netbird profile select` | Session holder |
| `netbird debug bundle` | Session holder |
| `netbird profile claim` | Privileged |

`netbird profile list` shows only the profiles that you own. To show the owner of each profile, add `--show-owner`:

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

To give a profile an owner, run `netbird profile claim` as root or as an administrator:

```shell
sudo netbird profile claim <profile> --owner <owner>
```

The `<owner>` value is an account name, a `uid:<id>` value, or a `sid:<SID>` value. The daemon does not check that a `uid` or `sid` value belongs to an existing account.

On Linux and macOS, if you do not set `--owner`, the owner is the user who ran `sudo`. If you run the command in a root shell without `sudo`, `--owner` is required. On Windows, `--owner` is required.

### Restrict daemon access to a group

By default, all local users can connect to the daemon socket. To let only one group connect, set `--allow-group` when you install the service:

```shell
sudo netbird service install --allow-group netbird-users
```

The operating system then refuses connections from users outside the group. This restriction also applies to the [HTTP/JSON daemon socket](https://docs.netbird.io/client/json-socket).

- On Linux and macOS, you can set only one group. The value is a group name or a group ID.
- On Windows, you can set a comma-separated list of groups or accounts. LocalSystem, elevated administrators, and the account that the daemon runs as always keep access.
- The installer resolves group names to IDs, including LDAP, SSSD, and Active Directory groups. If a name does not resolve, the installation stops.
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

### Environment variables

Set these variables on the daemon. For instructions, see [Client environment variables](https://docs.netbird.io/client/environment-variables#setting-environment-variables).

| Variable | Platform | Description |
| --- | --- | --- |
| `NB_DISABLE_PROFILE_OWNERSHIP` | Linux, macOS, Windows, FreeBSD | Set to `true` to turn off profile ownership. All identified local users can use all profiles and control all connections. Android and iOS always work this way. Use only on a device with one user or legacy use cases. |
| `NB_DISABLE_DEFAULT_PROFILE_CLAIM` | Linux, macOS, Windows, FreeBSD | Set to `true` to stop the [automatic claim](#automatic-claims) of the default profile. The default profile then has no owner until an administrator runs `netbird profile claim`. |

> **Warning:** `NB_DISABLE_PROFILE_OWNERSHIP` removes the isolation between local users. Use it only on a device with one user.

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
- **Default profile.** The daemon records the first user who is logged in at the console of the device as the owner. A console is a local graphical session, or a local seat on Linux. A user in a remote SSH session is not at the console.

Root and administrators never become owners through an automatic claim.

On a device with no console, for example a server, the default profile keeps no owner. To give it an owner, run:

```shell
sudo netbird profile claim default --owner <owner>
```

### Troubleshooting profile ownership

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

#### A profile is missing from the profile list

**Cause:** `netbird profile list` shows only the profiles that you own.

**Fix:** To see all profiles and their owners, run `sudo netbird profile list --show-owner`.

#### Detailed status is unavailable

**Symptom:** `netbird status` shows `Detailed status is unavailable: the connection belongs to another user.`

**Cause:** Another user holds the connection. You can see only the daemon status.

#### The daemon does not start after you set allowed groups

**Possible causes:**

- A group name does not resolve.
- You set more than one group on Linux or macOS.
- The daemon or the JSON socket uses a TCP socket.
- The daemon cannot read the MDM policy.

**Fix:** Read the daemon log. The log shows which of these causes stopped the daemon.

#### Collect information for support

A debug bundle includes `profiles.txt` and `active_profile.json`. These files show each profile, its owner, and the active profile. For instructions, see [Troubleshooting client issues](https://docs.netbird.io/help/troubleshooting-client).

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

> **Warning:** Reconfiguring the service restarts NetBird and can briefly interrupt tunnel connectivity, routes, and DNS.

The following documented examples were removed because they no longer work: `netbird service reconfigure --daemon-addr tcp://127.0.0.1:41731`, `netbird --daemon-addr tcp://127.0.0.1:41731 status`, `netbird service reconfigure --enable-json-socket --json-socket tcp://127.0.0.1:8080`, the `grpcurl` example against `127.0.0.1:41731`, and the `curl` example against `http://127.0.0.1:8080`.

### Who can use the default socket

The default Unix socket allows read and write access for local users. Each local user can read basic status and use the profiles that they own. Operations that decide who may obtain a shell on the machine are refused unless the caller is root, or an administrator on Windows. To let only one group connect, see [Restrict daemon access to a group](#restrict-daemon-access-to-a-group).

Most operations also require the caller to own the profile, or to hold the active connection. See [Access levels](#access-levels).

The earlier recommendation to place a custom socket inside a restricted directory for local-user isolation is replaced by `--allow-group`.

### Windows and grpcurl

`grpcurl` cannot connect to a Windows named pipe. Use a client that can open a named pipe. Do not use a TCP socket, because the daemon refuses every request on it.

### Build an integration

When you create a local gRPC channel for an integration, connect it to the configured Unix socket or named pipe without TLS. TCP is no longer an option for the channel.

### Troubleshooting daemon sockets

#### A client receives an Unavailable or connection-refused error

Confirm that the daemon is running and that the integration uses the same socket address as the service. For a Unix socket, also verify access to the socket and each parent directory. If the address uses `tcp://`, change it to a Unix socket or a named pipe. The daemon refuses every request on a TCP socket.

#### A call is refused with PermissionDenied (gRPC) or 403 (HTTP/JSON)

The operation is one of the [privileged operations](https://docs.netbird.io/client/grpc-socket#privileged-operations) and the caller is not root, or not an administrator on Windows. Check the `ErrorInfo` detail on the error: `PRIVILEGE_REQUIRED` in domain `daemon.netbird.io` means the daemon identified the caller and refused the change, rather than failing to reach it. On a TCP socket the daemon refuses every request, because TCP carries no caller identity. TCP sockets are deprecated.

#### A TCP request is refused

TCP sockets are deprecated, and the daemon refuses every request on them. Change `--daemon-addr` to a Unix socket or a named pipe, and `--json-socket` to a Unix socket.

## Profiles: storage layout and CLI changes

These changes apply to the [Profiles](https://docs.netbird.io/client/profiles) page.

### Storage layout

The default profile is stored as `default.json` in NetBird's state directory. New profiles are stored in the `profiles.v1` subdirectory as `<id>.json`:

| OS | Default state directory | Additional profile example |
| --- | --- | --- |
| Linux and macOS | `/var/lib/netbird/` | `/var/lib/netbird/profiles.v1/<id>.json` |
| FreeBSD | `/var/db/netbird/` | `/var/db/netbird/profiles.v1/<id>.json` |
| Windows | `%ProgramData%\Netbird\` | `%ProgramData%\Netbird\profiles.v1\<id>.json` |

Profiles from earlier versions stay in their per-user subdirectory, for example `/var/lib/netbird/<username>/<id>.json`.

Each profile has an owner, and only the owner can use it. See [Profile ownership](#profile-ownership).

`NB_STATE_DIR` overrides the default state directory. Treat profile files as credentials: stop the service before manual maintenance, restrict access, and prefer the GUI or CLI for normal profile management.

### Profile CLI commands

The `profile` command gains a `claim` subcommand:

```shell
netbird profile <add|list|select|rename|remove|claim> [name|handle]
```

### List profiles

```shell
netbird profile list
```

```text
NAME     ACTIVE
work     *
default
home
```

The list shows only the profiles that you own. A `*` in the `ACTIVE` column marks the active profile; inactive profiles are left blank. Earlier versions marked the active profile with `✓`.

With `--show-id`:

```shell
netbird profile list --show-id
```

```text
ID        NAME     ACTIVE
a1b2c3d4  work     *
default   default
e5f6a7b8  home
```

To show the owner of each profile, add `--show-owner`. To claim a profile for a user, see [Claim a profile](#claim-a-profile).

## Configuration reference changes

### Client environment variables

Two variables are added to the **Other** table of the [Client environment variables](https://docs.netbird.io/client/environment-variables) reference. See [Environment variables](#environment-variables) above for the full description.

| Variable | Platform |
| --- | --- |
| `NB_DISABLE_PROFILE_OWNERSHIP` | Linux, macOS, Windows, FreeBSD |
| `NB_DISABLE_DEFAULT_PROFILE_CLAIM` | Linux, macOS, Windows, FreeBSD |

### MDM policy key

The [MDM integration](https://docs.netbird.io/client/mdm-integration) policy keys reference grows from 20 to 21 keys with the addition of `allowGroups`. As with the other keys, the name is camelCase in the managed-configuration payload and the Windows ADMX template renders the PascalCase variant.

| Key | Type | Description |
| --- | --- | --- |
| `allowGroups` | string | Let only the listed groups connect to the daemon socket. Overrides `--allow-group`. An empty value removes the restriction. On macOS, set one `gid:<id>` value. On Windows, set comma-separated `sid:<SID>` values. See [Restrict daemon access to a group](#restrict-daemon-access-to-a-group). |

### CLI global flag `--daemon-addr`

The help text of the global `--daemon-addr` flag on the [CLI](https://docs.netbird.io/get-started/cli) page changes to:

```text
--daemon-addr string      Daemon service address to serve CLI requests [unix|npipe]://[path|name]. tcp://host:port is deprecated: it carries no caller identity, so the daemon refuses every request on it (default "unix:///var/run/netbird.sock", "npipe://netbird" on Windows)
```

The environment variable example on the same page changes from a TCP address to the default Unix socket:

```shell
# Set custom daemon address
export NB_DAEMON_ADDR="unix:///var/run/netbird.sock"
```

### Service flag `--allow-group`

New flag on `netbird service install` and `netbird service reconfigure`. See [Restrict daemon access to a group](#restrict-daemon-access-to-a-group).

## Verification checklist for early testers

Each item restates a behavior that the documentation above claims. Test on a device with at least two local user accounts.

Profile ownership

- [ ] `netbird profile add` run as a regular user records that user as the owner. `sudo netbird profile list --show-owner` shows the account name.
- [ ] `netbird profile add` run with `sudo` records root as the owner.
- [ ] `netbird profile list` run as user A does not show profiles owned by user B.
- [ ] User B cannot rename, remove, or deregister a profile owned by user A. The error says the profile belongs to another user.
- [ ] `sudo netbird profile claim <profile> --owner <user>` changes the owner. Without `--owner`, the owner becomes the user who ran `sudo` on Linux and macOS. In a root shell without `sudo`, and on Windows, the command requires `--owner`.
- [ ] A `uid:` or `sid:` value that matches no account is accepted by `claim`.

Session holder

- [ ] While user A is connected, `netbird down`, `netbird up`, `netbird login`, and `netbird profile select` run by user B fail with a message that another user has the machine connected.
- [ ] While user A is connected, `netbird status` run by user B shows `Detailed status is unavailable: the connection belongs to another user.` and only the daemon status.
- [ ] `sudo netbird down` stops user A's connection.
- [ ] `netbird debug bundle` requires the session holder. The bundle contains `profiles.txt` and `active_profile.json`.

Migration and automatic claims

- [ ] After upgrading a device with profiles under `<state-dir>/<username>/`, the profiles are still listed, the `profiles.v1` directory exists, and the owners of the last active user's profiles and of the default profile are recorded.
- [ ] Two profiles with the same ID in different user directories receive distinct IDs after migration.
- [ ] A profile left in a user directory with no owner is claimed by the user whose name matches the directory on their first request.
- [ ] The default profile is claimed by the first user logged in at the console. A user connected only over SSH does not claim it, and the error says the profile has no owner on record and shows the `claim` command to run.
- [ ] On a device with no console, the default profile stays unowned until an administrator claims it.
- [ ] With `NB_DISABLE_DEFAULT_PROFILE_CLAIM=true` on the daemon, the default profile is not claimed automatically.
- [ ] With `NB_DISABLE_PROFILE_OWNERSHIP=true` on the daemon, every identified user can use every profile and control the connection.

TCP sockets

- [ ] A daemon configured with `--daemon-addr tcp://127.0.0.1:41731` refuses every request, including `netbird status`, with a message about caller identity.
- [ ] An HTTP/JSON gateway configured with `--json-socket tcp://127.0.0.1:8080` refuses every request.
- [ ] A daemon configured with both a TCP socket and `--allow-group` does not start.

Group restriction

- [ ] `sudo netbird service install --allow-group <group>` lets members of the group connect and refuses everyone else at the operating-system level, on both the gRPC socket and the HTTP/JSON socket.
- [ ] A group name that does not resolve stops the installation.
- [ ] On Linux and macOS, more than one group is rejected. On Windows, a comma-separated list is accepted, and LocalSystem, elevated administrators, and the daemon's account keep access.
- [ ] `sudo netbird service reconfigure --allow-group ""` removes the restriction.
- [ ] The `allowGroups` MDM key overrides `--allow-group`, an empty MDM value removes an installer-set restriction, and an unreadable policy or unresolvable value stops the daemon from starting.

## Files changed by the pull request

| File | Change |
| --- | --- |
| `src/pages/client/profile-ownership.mdx` | New page. Reproduced in full under [Profile ownership and daemon access](#profile-ownership-and-daemon-access). |
| `src/pages/client/grpc-socket.mdx` | TCP sockets marked deprecated and refused for every request. Security warning reworded for per-user access. Privileged operations section links to profile ownership. TCP examples removed. |
| `src/pages/client/json-socket.mdx` | TCP sockets marked deprecated and refused for every request. TCP setup and `curl` examples removed. Troubleshooting updated. |
| `src/pages/client/profiles.mdx` | Storage layout moves new profiles to `profiles.v1`. `claim` subcommand added. `profile list` shows only owned profiles, marks the active profile with `*`, and gains `--show-owner`. |
| `src/pages/client/environment-variables.mdx` | Adds `NB_DISABLE_PROFILE_OWNERSHIP` and `NB_DISABLE_DEFAULT_PROFILE_CLAIM`. |
| `src/pages/client/mdm-integration.mdx` | Adds the `allowGroups` policy key. Key count becomes 21. |
| `src/pages/get-started/cli.mdx` | `--daemon-addr` help text documents the TCP deprecation. `NB_DAEMON_ADDR` example uses the Unix socket. |
| `src/components/NavigationDocs.jsx` | Adds **Profile Ownership** to the Client sidebar. |
