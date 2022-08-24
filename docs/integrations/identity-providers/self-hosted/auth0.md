---
id: using-netbird-with-auth0
title: Using NetBird with Auth0
sidebar_position: 2
tags:
- integrations
- idp
- auth0
- oidc
- how-to
---

This guide is a part of the [NetBird Self-hosting Guide](/getting-started/self-hosting) and explains how to integrate **self-hosted** NetBird with [Auth0](https://auth0.com/).

Auth0 is a flexible, drop-in solution to add authentication and authorization services to your applications. 
It is a 3rd party managed service and can't be self-hosted. Auth0 is the right choice if you don't want to manage an Identity Provider (IDP) 
instance on your own. 

:::tip self-hosted idp
If you prefer to have full control over authentication and authorization of your NetBird network, there are good
self-hosted alternatives to the managed Auth0 service like [Keycloak](/integrations/identity-providers/self-hosted/using-netbird-with-keycloak).
:::

### Step 1: Create Auth0 account
To create an Auth0 account, sign up at [https://auth0.com](https://auth0.com/).

There are five properties of the **`setup.env`** file that we will configure in this guide:
- `NETBIRD_AUTH_CLIENT_ID`
- `NETBIRD_AUTH_OIDC_CONFIGURATION_ENDPOINT`
- `NETBIRD_USE_AUTH0`
- `NETBIRD_AUTH_AUDIENCE`
- `NETBIRD_AUTH_DEVICE_AUTH_CLIENT_ID` (Optional)

### Step 2: Create and configure Auth0 application

This Auth0 application will be used to authorize access to NetBird Dashboard (Web UI).

- Follow the steps in the [Auth0 React SDK Guide](https://auth0.com/docs/quickstart/spa/react/01-login#configure-auth0) 
up until "Install the Auth0 React SDK".
- Use **`https://YOUR DOMAIN`** as: `Allowed Callback URLs`, `Allowed Logout URLs`, `Allowed Web Origins`, `Allowed Origins (CORS)`
  :::caution
  Make sure that **`Token Endpoint Authentication Method`** is set to **`None`**.
  :::

- Use **`Client ID`** to set  ```NETBIRD_AUTH_CLIENT_ID``` property in the `setup.env` file.
- Use **`Domain`** to configure   ```NETBIRD_AUTH_OIDC_CONFIGURATION_ENDPOINT``` property in the `setup.env` file like so:
     ```
   https://<DOMAIN>/.well-known/openid-configuration
    ``` 
  :::caution
  Double-check if the endpoint returns a JSON response by calling it from your browser.
  :::

### Step 3: Create and configure Auth0 API

This Auth0 API will be used to access NetBird Management Service API. 

- Follow the steps in the [Auth0 Create An API](https://auth0.com/docs/quickstart/backend/golang#create-an-api).
- Use API **`Identifier`** to set  ```NETBIRD_AUTH_AUDIENCE``` property in the `setup.env` file.
- Set ```NETBIRD_USE_AUTH0``` to `true`in the `setup.env` file.
  
### Step 4: Enable Interactive SSO Login (Optional)

The [Interactive SSO Login feature](/getting-started/installation#running-netbird-with-sso-login) allows for machine 
authorization with your Identity Provider. This feature can be used as an alternative to [setup keys](/overview/setup-keys) 
and is optional.

You can enable it by following these steps:
- Log in to your Auth0 account https://manage.auth0.com/
- Go to `Applications` (left-hand menu)
- Click `Create Application` button (top right)
- Fill in the form with the following values:
  - Name: `Interactive Login`
  - Application type: `Native`
- Click `Create`

![](/img/integrations/identity-providers/self-hosted/auth0-create-interactive-login-app.png)

- Click `Settings` tab
- Copy **`Client ID`** to `NETBIRD_AUTH_DEVICE_AUTH_CLIENT_ID` in the `setup.env` file

![](/img/integrations/identity-providers/self-hosted/auth0-interactive-login-settings.png)

### Step 4: Continue with the self-hosting guide
You can now continue with the [NetBird Self-hosting Guide](/getting-started/self-hosting#step-3-configure-identity-provider).