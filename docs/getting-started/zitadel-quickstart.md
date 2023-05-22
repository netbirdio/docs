---
sidebar_position: 4
title: Zitadel Quickstart Guide
---

NetBird is open-source and can be self-hosted on your servers.

This guide describes how to quickly get started with a self-hosted NetBird instance with an auto-configured Zitadel identity provider. It explains the steps to set up and configure this configuration, enabling you to efficiently start using your own self-hosted NetBird instance.

### Step 1: Create Zitadel Service User

In this step we will create a `netbird` service user.

- Navigate to zitadel console
- Click `Users` in the top menu
- Select `Service Users` tab
- Click `New`
- Fill in the form with the following values:
  - User Name: `netbird`
  - Name: `netbird`
  - Description: `Netbird Service User`
  - Access Token Type: `JWT`
- Click `Create`

![](/img/getting-started/zitadel-create-user.png)

In this step we will generate `ClientSecret` for the `netbird` service user.

- Click `Actions` in the top right corner and click `Generate Client Secret`
- Copy `ClientSecret` from the dialog will be used later to set `ClientSecret` when prompted.

![](/img/getting-started/zitadel-service-user-secret.png)

### Step 2: Grant manage-organization role to netbird service user

In this step we will grant `Org User Manager` role to `netbird` service user.

- Click `Organization` in the top menu
- Click `+` in the top right corner
- Search for `netbird` service user
- Check `Org Owner` checkbox
- Click `Add`

![](/img/getting-started/zitadel-service-account-role.png)


### Step 3: Get the latest stable NetBird code

```bash 
#!/bin/bash
REPO="https://github.com/netbirdio/netbird/"
# this command will fetch the latest release e.g. v0.19.0
LATEST_TAG=$(basename $(curl -fs -o/dev/null -w %{redirect_url} ${REPO}releases/latest))
echo $LATEST_TAG

# this comman will clone the latest tag
git clone --depth 1 --branch $LATEST_TAG $REPO
```

Then switch to the infra folder that contains docker-compose file:

```bash 
cd netbird/infrastructure_files/
```

### Step 4:  Prepare configuration files

To simplify the setup we have prepared a script to substitute required properties in the [docker-compose.yml.tmpl](https://github.com/netbirdio/netbird/tree/main/infrastructure_files/docker-compose.yml.tmpl) and [management.json.zitadel.tmpl](https://github.com/netbirdio/netbird/tree/main/infrastructure_files/management.json.zitadel.tmpl) files.

The [setup.env.example](https://github.com/netbirdio/netbird/tree/main/infrastructure_files/setup.env.example) file contains multiple properties that have to be filled. You need to copy the example file to `setup.env` before updating it.

```bash
# Dashboard domain. e.g. app.mydomain.com
NETBIRD_DOMAIN=""

# OIDC configuration e.g., https://example.eu.auth0.com/.well-known/openid-configuration
NETBIRD_AUTH_OIDC_CONFIGURATION_ENDPOINT="https://<YOUR-ZITADEL-HOST-AND-PORT>/.well-known/openid-configuration"

# indicates whether to use Auth0 or not: true or false
NETBIRD_USE_AUTH0="false"
NETBIRD_IDP_PROVIDER="zitadel"
NETBIRD_AUTH_REDIRECT_URI="/auth"
NETBIRD_AUTH_SILENT_REDIRECT_URI="/silent-auth"

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
If you want to setup netbird with your own reverse-Proxy and without using the integrated letsencrypt, follow [this step here instead](self-hosting#advanced-running-netbird-behind-an-existing-reverse-proxy).
:::

### Step 5: Disable single account mode (optional)

NetBird Management service runs in a single account mode by default since version v0.10.1. 
Management service was creating a separate account for each registered user before v0.10.1. 
Single account mode ensures that all the users signing up for your self-hosted installation will join the same account/network.
In most cases, this is the desired behavior. 

If you want to disable the single-account mode, set `--disable-single-account-mode` flag in the 
[docker-compose.yml.tmpl](https://github.com/netbirdio/netbird/tree/main/infrastructure_files/docker-compose.yml.tmpl) 
`command` section of the `management` service.

### Step 6: Run configuration script
Make sure all the required properties set in the ```setup.env``` file and run:

 ```bash
 ./configure.sh
 ```

This will export all the properties as environment variables and generate ```docker-compose.yml``` and ```management.json``` files substituting required variables.

### Step 7: Run docker compose:

```bash
docker-compose up -d
```
### Step 8: Check docker logs (Optional)

 ```bash
 docker-compose logs signal
 docker-compose logs management
 docker-compose logs coturn
 docker-compose logs dashboard
```