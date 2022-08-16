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
- Coturn is used for relay using the STUN/TURN protocols. It requires a listening port, UDP 3478, and range of ports, UDP 49152-65535, for dynamic relay connections. These are set as defaults in setup file, but can be configured to your requirements.
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
# Dashboard domain. e.g. app.mydomain.com
NETBIRD_DOMAIN=""
# e.g. dev-24vkclam.us.auth0.com
NETBIRD_AUTH0_DOMAIN=""
# e.g. 61u3JMXRO0oOevc7gCkZLCwePQvT4lL0
NETBIRD_AUTH0_CLIENT_ID=""
# e.g. https://app.mydomain.com/ or https://app.mydomain.com,
# Make sure you used the exact same value for Identifier
# you used when creating your Auth0 API
NETBIRD_AUTH0_AUDIENCE=""
# e.g. hello@mydomain.com
NETBIRD_LETSENCRYPT_EMAIL=""
```

- Set ```NETBIRD_DOMAIN``` to your domain, e.g.  `demo.netbird.io`
- Configure ```NETBIRD_LETSENCRYPT_EMAIL``` property:

This can be any email address. [Let's Encrypt](https://letsencrypt.org/) will create an account while generating a new certificate.

:::tip
Let's Encrypt will notify you via this email when certificates are about to expire. NetBird supports automatic renewal by default.
:::

### Step 3: Configure Identity Provider

NetBird supports generic OpenID (OIDC) protocol allowing for the integration with any IDP that follows the specification.

Check out the [Available Integrations](/integrations/identity-providers/self-hosted/available-idp-integrations) section,
pick the one that suits your needs, follow the steps, and continue with this guide.

### Step 4: Run configuration script
Make sure all the required properties set in the ```setup.env``` file and run:

 ```bash
 ./configure.sh
 ```

This will export all the properties as environment variables and generate ```docker-compose.yml``` and ```management.json``` files substituting required variables.

### Step 5: Run docker compose:

```bash
docker-compose up -d
```
### Step 5: Check docker logs (Optional)

 ```bash
 docker-compose logs signal
 docker-compose logs management
 docker-compose logs coturn
 docker-compose logs dashboard
```

### Get in touch

Feel free to ping us on [Slack](https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A) if you have any questions

- NetBird managed version: [https://app.netbird.io](https://app.netbird.io)
- Make sure to [star us on GitHub](https://github.com/netbirdio/netbird) :pray:
- Follow us [on Twitter](https://twitter.com/netbird)
