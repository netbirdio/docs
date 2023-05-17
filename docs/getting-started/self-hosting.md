---
sidebar_position: 2
---

# Self-hosting Guide

NetBird is open-source and can be self-hosted on your servers.

It relies on components developed by NetBird Authors [Management Service](https://github.com/netbirdio/netbird/tree/main/management), [Management UI Dashboard](https://github.com/netbirdio/dashboard), [Signal Service](https://github.com/netbirdio/netbird/tree/main/signal),
a 3rd party open-source STUN/TURN service [Coturn](https://github.com/coturn/coturn), and an identity provider (available options will be listed later in this guide).

If you would like to learn more about the architecture please refer to the [Architecture section](/overview/architecture).

:::tip netbird as a service
It might be a good idea to try NetBird before self-hosting. 
We run NetBird in the cloud, and it will take less than 5 minutes to get started with our managed version. [Check it out!](https://netbird.io/pricing)
:::

### Requirements

- Virtual machine offered by any cloud provider (e.g., AWS, DigitalOcean, Hetzner, Google Cloud, Azure ...).
- Any Linux OS.
- Docker Compose installed (see [Install Docker Compose](https://docs.docker.com/compose/install/)).
- Domain name pointing to the public IP address of your server.
- Open TCP ports ```80, 443, 33073, 10000``` (Dashboard HTTP & HTTPS, Management gRCP & HTTP APIs, Signal gRPC API respectively) on your server.
- Coturn is used for relay using the STUN/TURN protocols. It requires a listening port, `UDP 3478`, and range of ports, `UDP 49152-65535`, for dynamic relay connections. These are set as defaults in setup file, but can be configured to your requirements.
- Maybe a cup of coffee or tea :)

For this tutorial we will be using domain ```demo.netbird.io``` which points to our Ubuntu 22.04 machine hosted at Hetzner.

### Step 1: Get the latest stable NetBird code

```bash 
#!/bin/bash
REPO="https://github.com/netbirdio/netbird/"
# this command will fetch the latest release e.g. v0.8.7
LATEST_TAG=$(basename $(curl -fs -o/dev/null -w %{redirect_url} ${REPO}releases/latest))
echo $LATEST_TAG

# this comman will clone the latest tag
git clone --depth 1 --branch $LATEST_TAG $REPO
```

Then switch to the infra folder that contains docker-compose file:

```bash 
cd netbird/infrastructure_files/
```
### Step 2:  Prepare configuration files

To simplify the setup we have prepared a script to substitute required properties in the [docker-compose.yml.tmpl](https://github.com/netbirdio/netbird/tree/main/infrastructure_files/docker-compose.yml.tmpl) and [management.json.tmpl](https://github.com/netbirdio/netbird/tree/main/infrastructure_files/management.json.tmpl) files.

The [setup.env.example](https://github.com/netbirdio/netbird/tree/main/infrastructure_files/setup.env.example) file contains multiple properties that have to be filled. You need to copy the example file to `setup.env` before updating it.

```bash
## example file, you can copy this file to setup.env and update its values
##
# Dashboard domain. e.g. app.mydomain.com
NETBIRD_DOMAIN=""
# OIDC configuration e.g., https://example.eu.auth0.com/.well-known/openid-configuration
NETBIRD_AUTH_OIDC_CONFIGURATION_ENDPOINT=""
NETBIRD_AUTH_AUDIENCE=""
# e.g. netbird-client
NETBIRD_AUTH_CLIENT_ID=""
# indicates whether to use Auth0 or not: true or false
NETBIRD_USE_AUTH0="false"
NETBIRD_AUTH_DEVICE_AUTH_PROVIDER="none"
# enables Interactive SSO Login feature (Oauth 2.0 Device Authorization Flow)
NETBIRD_AUTH_DEVICE_AUTH_CLIENT_ID=""
# e.g. hello@mydomain.com
NETBIRD_LETSENCRYPT_EMAIL=""
```

- Set ```NETBIRD_DOMAIN``` to your domain, e.g.  `demo.netbird.io`
- Configure ```NETBIRD_LETSENCRYPT_EMAIL``` property.
  This can be any email address. [Let's Encrypt](https://letsencrypt.org/) will create an account while generating a new certificate.

:::tip
Let's Encrypt will notify you via this email when certificates are about to expire. NetBird supports automatic renewal by default.
:::

:::info
If you want to setup netbird with your own reverse-Proxy and without using the integrated letsencrypt, follow [this step here instead](#advanced-running-netbird-behind-an-existing-reverse-proxy).
:::

### Step 3: Configure Identity Provider

NetBird supports generic OpenID (OIDC) protocol allowing for the integration with any IDP that follows the specification.
Pick the one that suits your needs, follow the steps, and continue with this guide:

- Continue with [Auth0](/integrations/identity-providers/self-hosted/using-netbird-with-auth0) (managed service).
- Continue with [Keycloak](/integrations/identity-providers/self-hosted/using-netbird-with-keycloak).

### Step 4: Disable single account mode (optional)

NetBird Management service runs in a single account mode by default since version v0.10.1. 
Management service was creating a separate account for each registered user before v0.10.1. 
Single account mode ensures that all the users signing up for your self-hosted installation will join the same account/network.
In most cases, this is the desired behavior. 

If you want to disable the single-account mode, set `--disable-single-account-mode` flag in the 
[docker-compose.yml.tmpl](https://github.com/netbirdio/netbird/tree/main/infrastructure_files/docker-compose.yml.tmpl) 
`command` section of the `management` service.

### Step 5: Run configuration script
Make sure all the required properties set in the ```setup.env``` file and run:

 ```bash
 ./configure.sh
 ```

This will export all the properties as environment variables and generate ```docker-compose.yml``` and ```management.json``` files substituting required variables.

### Step 6: Run docker compose:

```bash
docker-compose up -d
```
### Step 7: Check docker logs (Optional)

 ```bash
 docker-compose logs signal
 docker-compose logs management
 docker-compose logs coturn
 docker-compose logs dashboard
```

### Advanced: Running netbird behind an existing reverse-proxy

If you want to run netbird behind your own reverse-proxy, some additional configuration-steps have to be taken to [Step 2](#step-2--prepare-configuration-files).

:::info
Not all reverse-proxies are supported as netbird uses *gRPC* for various components.
:::

#### Service overview for reverse proxies

Depending on your port-mappings and choice of reverse-proxy, how you configure the forwards differs greatly.

The following endpoints have to be setup:

Endpoint                        | Protocol  | Target service and internal-port
------------------------------- | --------- | --------------------------------
/                               | HTTP      | dashboard:80
/signalexchange.SignalExchange/ | gRPC      | signal:80
/api                            | HTTP      | management:443
/management.ManagementService/  | gRPC      | management:443

Make sure your reverse-Proxy is setup to use the HTTP2-Protocol when forwarding.

:::tip
You can find helpful templates with the reverse-proxy-name as suffix (e.g. `docker-compose.yml.tmpl.traefik`)  
Simply replace the file `docker-compose.yml.tmpl` with the chosen version.
:::

#### General configuration for reverse proxies

In `setup.env`:
- Set ```NETBIRD_DOMAIN``` to your domain, e.g.  `demo.netbird.io`
- Set ```NETBIRD_DISABLE_LETSENCRYPT=true```
- Add ```NETBIRD_MGMT_API_PORT``` to your reverse-proxy TLS-port (default: 443)
- Add ```NETBIRD_SIGNAL_PORT``` to your reverse-proxy TLS-port

Optional:
- Add ```TURN_MIN_PORT``` and ```TURN_MAX_PORT``` to configure the port-range used by the Turn-server

:::tip info
The `coturn`-service still needs to be directly accessible under your set-domain as it uses UDP for communication.
:::

Now you can continue with [Step 3](#step-3-configure-identity-provider).

##### Furthor Modifications for Nginx
You can use the provided `nginx.tmp.conf` as a base for your configuration:
- Set ```server_name``` to your domain, e.g. `demo.netbird.io`
- Modify the exposed port of the ```dashboard``` service in the ```docker-compose.yml```
- Modify the internal port of the ```management``` service to `80` in the ```docker-compose.yml```
- Set the correct ports for the proxied ```dashboard```, ```signal``` and ```management``` service
- Provide your own ssl certificates, using ```Let's Encrypt``` or your certificate provider of choice

### Get in touch

Feel free to ping us on [Slack](https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A) if you have any questions

- NetBird managed version: [https://app.netbird.io](https://app.netbird.io)
- Make sure to [star us on GitHub](https://github.com/netbirdio/netbird) :pray:
- Follow us [on Twitter](https://twitter.com/netbird)
