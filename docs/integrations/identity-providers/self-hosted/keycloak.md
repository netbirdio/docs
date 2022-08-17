---
id: using-netbird-with-keycloak
title: Using NetBird with Keycloak
sidebar_position: 3
tags:
- integrations
- idp
- keycloak
- oidc
- how-to
---

This guide is a part of the [NetBird Self-hosting Guide](/getting-started/self-hosting) and explains how to integrate 
**self-hosted** NetBird with [Keycloak](https://www.keycloak.org/).

Keycloak is an open source software product to allow single sign-on with Identity and Access Management aimed at modern applications and services.

:::tip managed idp
If you prefer not to self-host an Identity and Access Management solution, then you could use a managed alternative like
[Auth0](/integrations/identity-providers/self-hosted/using-netbird-with-auth0).
:::

The following guide is an adapted version of the original
[Keycloak on Docker](https://www.keycloak.org/getting-started/getting-started-docker) guide from the official website.

### Step 1: Deploy Keycloak (Optional)

If you have a running instance of Keycloak, you can skip this step; run the Keycloak container on your server otherwise.

:::caution
We recommend setting the `KEYCLOAK_ADMIN` to something different than `admin` and choosing a secure password.
We also recommended running Keycloak with SSL in a production environment.

This step is for demonstration purposes; please refer to the official
[Keycloak Documentation](https://www.keycloak.org/documentation) for production setups.
:::

```bash
docker run -d --name netbird-keycloak -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

Disable SSL:
```bash
docker exec --workdir /opt/keycloak/bin netbird-keycloak ./kcadm.sh update --server http://localhost:8080/ --realm master --user admin --password admin realms/master -s sslRequired=NONE
```

### Step 2: Create a realm

To create a realm you need to:

- Open the Keycloak Admin Console
- Hover the mouse over the dropdown in the top-left corner where it says `Master`, then click on `Create Realm`
- Fill in the form with the following values:
  - Realm name: `netbird`
- Click `Create`
- Your newly created realm `http://YOUR-KEYCLOAK-HOST:8080/realms/netbird` will be used later to set `NETBIRD_AUTH_AUTHORITY` in the `setup.env` file.

![](/img/integrations/identity-providers/self-hosted/keycloak-create-realm.png)

### Step 3: Create a user

In this step we will create a NetBird administrator user.

- Open the Keycloak Admin Console
- Make sure, that the selected realm is `Netbird`
- Click `Users` (left-hand menu)
- Click `Create new user`
- Fill in the form with the following values:
  - Username: `netbird`
- Click `Create`

![](/img/integrations/identity-providers/self-hosted/keycloak-create-user.png)

The user will need an initial password set to be able to log in. To do this:
- Click `Credentials` tab
- Click `Set password` button
- Fill in the password form with a password
- Set the `Temporary` field to `Off` to prevent having to update password on first login
- Click `Save`

![](/img/integrations/identity-providers/self-hosted/keycloak-set-password.png)

### Step 4: Create a NetBird client

In this step we will create NetBird application client and register with the Keycloak instance.

- Open the Keycloak Admin Console
- Make sure, that the selected realm is `Netbird`
- Click `Clients`
- Click `Create client` button
- Fill in the form with the following values and click Next:
  - Client Type: `OpenID Connect`
  - Client ID: `netbird-client`
- Your newly client `netbird-client` will be used later to set `NETBIRD_AUTH_CLIENT_ID` in the `setup.env`

![](/img/integrations/identity-providers/self-hosted/keycloak-create-client.png)

- Check the checkboxes as on the screenshot below and click Save

![](/img/integrations/identity-providers/self-hosted/keycloak-enable-auth.png)

### Step 5: Adjust NetBird client access settings

In this step we will configure NetBird application client access with the NetBird URLs.

- Open the Keycloak Admin Console
- Make sure, that the selected realm is `Netbird`
- Click `Clients`
- Choose `netbird-client` from the list
- Go to `Access Settings` section
- Fill in the fields with the following values:
  - Root URL: `https://YOUR DOMAIN/` (this is the NetBird Dashboard root URL)
  - Valid redirect URIs: `https://YOUR DOMAIN/*`
  - Valid post logout redirect URIs: `https://YOUR DOMAIN/*`
  - Web origins: `+`

![](/img/integrations/identity-providers/self-hosted/keycloak-access-settings.png)

### Step 6: Create a NetBird client scope

In this step, we will create and configure the NetBird client audience for Keycloak to add it to the generated JWT tokens.

- Open the Keycloak Admin Console
- Make sure, that the selected realm is `Netbird`
- Click `Client scopes` (left-hand menu)
- Click `Create client scope` button
- Fill in the form with the following values:
  - Name: `netbird-client-audience`
  - Type: `Default`
  - Type: `OpenID Connect`
- Click `Save`

![](/img/integrations/identity-providers/self-hosted/keycloak-create-client-scope.png)

- Switch to the `Mappers` tab
- Click `Configure a new mapper`
- Choose the `Audience` mapping

![](/img/integrations/identity-providers/self-hosted/keycloak-configure-audience-mapper.png)

- Fill in the form with the following values:
  - Name: `Audience for NetBird Management API`
  - Included Client Audience: `netbird-client`
  - Add to access token: `On`
  - Click `Save`

![](/img/integrations/identity-providers/self-hosted/keycloak-configure-audience-mapper-2.png)

### Step 7: Add client scope to NetBird client

- Open the Keycloak Admin Console
- Make sure, that the selected realm is `Netbird`
- Click `Clients`
- Choose `netbird-client` from the list
- Switch to `Client scopes` tab
- Click `Add client scope` button
- Choose `netbird-client-audience`
- CLick `Add` choosing `Default`
- The value `netbird-client` will be used as audience 

![](/img/integrations/identity-providers/self-hosted/keycloack-add-client-scope.png)

### Step 8: Continue with the self-hosting guide

Your authority configuration will be available under:
```
http://YOUR-KEYCLOAK-HOST:8080/realms/netbird/.well-known/openid-configuration
```

:::tip
If you are running a demo Keycloak server, then you might need to disable SSL for the `netbird` 
realm to be able to get the openid-configuration.
```bash
docker exec --workdir /opt/keycloak/bin netbird-keycloak ./kcadm.sh update --server http://localhost:8080/ --realm master --user admin --password admin realms/netbird-s sslRequired=NONE
```
:::

- Set properties in the `setup.env` file:
  - NETBIRD_AUTH_AUTHORITY=`http://YOUR-KEYCLOAK-HOST:8080/realms/netbird`. This is the `issuer` field of the openid-configuration.
  - NETBIRD_AUTH_CLIENT_ID=`netbird-client`
  - NETBIRD_AUTH_AUDIENCE=`netbird-client`
  - NETBIRD_AUTH_SUPPORTED_SCOPES=`openid profile email offline_access netbird-client-audience`. Use the fields specified in the `scopes_supported` field of the openid-configuration. 

- You can now continue with the [NetBird Self-hosting Guide](/getting-started/self-hosting#step-3-configure-identity-provider).