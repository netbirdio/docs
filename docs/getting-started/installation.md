---
sidebar_position: 2
title: Installation
tags:
- client
- how-to
- install
---

### Linux

**APT/Debian**
1. Add the repository:

    ```bash
    sudo apt-get update
    sudo apt-get install ca-certificates curl gnupg -y
    curl -sSL https://pkgs.wiretrustee.com/debian/public.key | sudo gpg --dearmor --output /usr/share/keyrings/wiretrustee-archive-keyring.gpg
    echo 'deb [signed-by=/usr/share/keyrings/wiretrustee-archive-keyring.gpg] https://pkgs.wiretrustee.com/debian stable main' | sudo tee /etc/apt/sources.list.d/wiretrustee.list
    ```
2. Update APT's cache

    ```bash
    sudo apt-get update
    ```
3. Install the package

    ```bash
    # for CLI only
    sudo apt-get install netbird
    # for GUI package
    sudo apt-get install netbird-ui
    ```
   
**RPM/Red hat**

1. Add the repository:
    ```bash
    cat <<EOF | sudo tee /etc/yum.repos.d/wiretrustee.repo
    [Wiretrustee]
    name=Wiretrustee
    baseurl=https://pkgs.wiretrustee.com/yum/
    enabled=1
    gpgcheck=0
    gpgkey=https://pkgs.wiretrustee.com/yum/repodata/repomd.xml.key
    repo_gpgcheck=1
    EOF
    ```
2. Install the package
    ```bash
    # for CLI only
    sudo yum install netbird
    # for GUI package
    sudo yum install netbird-ui
    ```

**NixOS 22.11+/unstable**

1. Edit your [`configuration.nix`](https://nixos.org/manual/nixos/stable/index.html#sec-changing-config)

    ```nix
    { config, pkgs, ... }:
    {
      services.netbird.enable = true; # for netbird service & CLI
      environment.systemPackages = [ pkgs.netbird-ui ]; # for GUI
    }
    ```
2. Build and apply new configuration

    ```bash
    sudo nixos-rebuild switch
    ```

### macOS
**Homebrew install**
1. Download and install homebrew at https://brew.sh/
2. If wiretrustee was previously installed with homebrew, you will need to run:
   ```bash
   # Stop and uninstall daemon service:
   sudo wiretrustee service stop
   sudo wiretrustee service uninstall 
   # unlik the app
   brew unlink wiretrustee
   ```
> netbird will copy any existing configuration from the Wiretrustee's default configuration paths to the new NetBird's default location

3. Install the client
  ```bash
  # for CLI only
  brew install netbirdio/tap/netbird
  # for GUI package
  brew install --cask netbirdio/tap/netbird-ui
  ```
4. If you installed CLI only, you need to install and start the client daemon service:
  ```bash
  sudo netbird service install
  sudo netbird service start
  ```

### Windows
1. Checkout NetBird [releases](https://github.com/netbirdio/netbird/releases/latest)
2. Download the latest Windows release installer ```netbird_installer_<VERSION>_windows_amd64.exe``` (**Switch VERSION to the latest**):
3. Proceed with the installation steps
4. This will install the UI client in the C:\\Program Files\\NetBird and add the daemon service
5. After installing, you can follow the steps from [Running NetBird with SSO Login](#Running-NetBird-with-SSO-Login) steps.
> To uninstall the client and service, you can use Add/Remove programs

### Binary Install
**Installation from binary (CLI only)**

1. Checkout NetBird [releases](https://github.com/netbirdio/netbird/releases/latest)
2. Download the latest release:
  ```bash
  curl -L -o ./netbird_<VERSION>.tar.gz https://github.com/netbirdio/netbird/releases/download/v<VERSION>/netbird_<VERSION>_<OS>_<Arch>.tar.gz
  ```
  
:::note

You need to replace some variables from the URL above:

- Replace **VERSION** with the latest released verion.
- Replace **OS** with "linux", "darwin" for MacOS or "windows"
- Replace **Arch** with your target system CPU archtecture

:::

3. Decompress
  ```bash
  tar xcf ./netbird_<VERSION>.tar.gz
  sudo mv netbird /usr/bin/netbird
  sudo chown root:root /usr/bin/netbird
  sudo chmod +x /usr/bin/netbird
  ```
After that you may need to add /usr/bin in your PATH environment variable:
  ````bash
  export PATH=$PATH:/usr/bin
  ````
4. Install and run the service
  ```bash
  sudo netbird service install
  sudo netbird service start
  ```

### Running NetBird with SSO Login
#### Desktop UI Application
If you installed the Desktop UI client, you can launch it and click on Connect.
> It will open your browser, and you will be prompt for email and password. Follow the instructions.

<p>
    <img src="/docs/img/getting-started/netbird-sso-login-ui.gif" alt="high-level-dia" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p> 

#### CLI
Alternatively, you could use command line. Simply run
   ```bash
  netbird up
   ```
> It will open your browser, and you will be prompt for email and password. Follow the instructions.

<p>
    <img src="/docs/img/getting-started/netbird-sso-login-cmd.gif" alt="high-level-dia" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p> 

Check connection status:
```bash
  netbird status
```

### Running NetBird with a Setup Key
In case you are activating a server peer, you can use a [setup key](/overview/setup-keys) as described in the steps below.
> This is especially helpful when you are running multiple server instances with infrastructure-as-code tools like ansible and terraform.

1. Login to the Management Service. You need to have a `setup key` in hand (see [setup keys](/overview/setup-keys)).

   For all systems:
     ```bash
     netbird up --setup-key <SETUP KEY>
     ```

   For **Docker**, you can run with the following command:
   ```bash
   docker run --network host --privileged --rm -d -e NB_SETUP_KEY=<SETUP KEY> -v netbird-client:/etc/netbird netbirdio/netbird:<TAG>
   ```
   > TAG > 0.6.0 version

   Alternatively, if you are hosting your own Management Service provide `--management-url` property pointing to your Management Service:
     ```bash
     netbird up --setup-key <SETUP KEY> --management-url http://localhost:33073
     ```
   
   > You could also omit the `--setup-key` property. In this case, the tool will prompt for the key.

2. Check connection status:
   ```bash
     netbird status
   ```

3. Check your IP:

   On **macOS** :
   ````bash
     sudo ifconfig utun100
   ````   
   On **Linux**:
     ```bash
     ip addr show wt0
     ```
   On **Windows**:
     ```bash
     netsh interface ip show config name="wt0"
     ```

### Running NetBird in Docker

Set the ```NB_SETUP_KEY``` environment variable and run the command.
:::tip Environment variables
You can pass other settings as environment variables. See [Environment variables](reference/netbird-commands.md#environment-variables) for details.
:::
```bash
docker run --rm --name PEER_NAME --hostname PEER_NAME --cap-add=NET_ADMIN -d -e NB_SETUP_KEY=<SETUP KEY> -v netbird-client:/etc/netbird netbirdio/netbird:latest
```

See [Docker example](examples/netbird-docker.md) for details.

### Troubleshooting
1. If you are using self-hosted version and haven't specified `--management-url`, the client app will use the default URL
   which is ```https://api.wiretrustee.com:33073```.

2. If you have specified a wrong `--management-url` (e.g., just by mistake when self-hosting)
   to override it you can do the following:

    ```bash
    netbird down
    netbird up --management-url https://<CORRECT HOST:PORT>/
    ```

   To override it see the solution #1 above.
