---
sidebar_position: 2
---

# Self-hosting Guide

NetBird is open-source and can be self-hosted on your servers.

It relies on components developed by NetBird Authors [Management Service](https://github.com/netbirdio/netbird/tree/main/management), [Management UI Dashboard](https://github.com/netbirdio/dashboard), [Signal Service](https://github.com/netbirdio/netbird/tree/main/signal),
a 3rd party open-source STUN/TURN service [Coturn](https://github.com/coturn/coturn) and a 3rd party service [Auth0](https://auth0.com/).

:::info auth0
All the components can be self-hosted except for the Auth0 service.
This service offers excellent support for multiple features that we need, and it saved us lots of time. 
We couldn't find any suitable open-source solution that would be a good combination of effort and benefit.
There is a free plan that can fulfill most of the personal use-cases.

There were a few discussions about alternatives on [GitHub](https://github.com/netbirdio/dashboard/issues/9).
We'd greatly appreciate any help on integrating one of the open-source Auth0 alternatives.

:::



If you would like to learn more about the architecture please refer to the [Architecture section](/overview/architecture).

### Requirements

- Virtual machine offered by any cloud provider (e.g., AWS, DigitalOcean, Hetzner, Google Cloud, Azure ...).
- Any Linux OS.
- Docker Compose installed (see [Install Docker Compose](https://docs.docker.com/compose/install/)).
- Domain name pointing to the public IP address of your server.
- Open TCP ports ```80, 443, 33071, 33073, 10000``` (Dashboard, Management HTTP API, Management gRpc API, Signal gRpc respectively) on your server.
- Coturn is used for relay using the STUN/TURN protocols. It requires a listening port, UDP 3478, and range of ports, UDP 49152-65535, for dynamic relay connections. These are set as defaults in setup file, but can be configured to your requirements.
- Maybe a cup of coffee or tea :)

### Step-by-step guide

For this tutorial we will be using domain ```demo.netbird.io``` which points to our Ubuntu 22.04 machine hosted at Hetzner.

1. Create Auth0 account at [auth0.com](https://auth0.com/).
2. Get latest released NetBird code:

   ```bash 
   #!/bin/bash
   REPO="https://github.com/netbirdio/netbird/"
   # this command will fetch the latest release e.g. v0.6.1
   LATEST_TAG=$(basename $(curl -fs -o/dev/null -w %{redirect_url} ${REPO}releases/latest))
   echo $LATEST_TAG
   
   # this comman will clone the latest tag
   git clone --depth 1 --branch $LATEST_TAG $REPO
   ```

   and switch to the infra folder that contains docker-compose file:

   ```bash 
   cd netbird/infrastructure_files/
   ```
3. Prepare configuration files.

   To simplify the setup we have prepared a script to substitute required properties in the [docker-compose.yml.tmpl](https://github.com/netbirdio/netbird/tree/main/infrastructure_files/docker-compose.yml.tmpl) and [management.json.tmpl](https://github.com/netbirdio/netbird/tree/main/infrastructure_files/management.json.tmpl) files.

   The [setup.env.example](https://github.com/netbirdio/netbird/tree/main/infrastructure_files/setup.env.example) file contains multiple properties that have to be filled. You need to copy the example file to `setup.env` before updating it.
   :::tip
   You need to fill only the first 5 properties, the rest will be filled automatically at a later step.
   :::
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

   Please follow the steps to get the values.

4. Set ```NETBIRD_DOMAIN``` to your domain, e.g.  `demo.netbird.io`

5. Configure Auth0 ```NETBIRD_AUTH0_DOMAIN``` ```NETBIRD_AUTH0_CLIENT_ID``` properties.

    * To obtain these, please use [Auth0 React SDK Guide](https://auth0.com/docs/quickstart/spa/react/01-login#configure-auth0) up until "Install the Auth0 React SDK".

      > Use ```https://YOUR DOMAIN``` as ````Allowed Callback URLs````, ```Allowed Logout URLs```, ```Allowed Web Origins``` and ```Allowed Origins (CORS)```
    * set the variables in the ```setup.env```
    * :warning: Make sure that `Token Endpoint Authentication Method` is set to `None` in your Auth0 Default Application
6. Configure ```NETBIRD_AUTH0_AUDIENCE``` property.

    * Check [Auth0 Create An API](https://auth0.com/docs/quickstart/backend/golang#create-an-api) section to obtain AuthAudience.
    * set the property in the ```setup.env``` file.
7. Configure ```NETBIRD_LETSENCRYPT_EMAIL``` property.

   This can be any email address. [Let's Encrypt](https://letsencrypt.org/) will create an account while generating a new certificate.

   :::tip
   Let's Encrypt will notify you via this email when certificates are about to expire. NetBird supports automatic renewal by default.
   :::

8. Make sure all the required properties set in the ```setup.env``` file and run:

    ```bash
    ./configure.sh
    ```

   This will export all the properties as environment variables and generate ```docker-compose.yml``` and ```management.json``` files substituting required variables.

9. Run docker compose:

   ```bash
   docker-compose up -d
   ```
10. Optionally check the logs by running:

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
