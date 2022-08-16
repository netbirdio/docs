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

### Step 2: Configure Auth0 properties in the setup.env file
1. Configure ```NETBIRD_AUTH0_DOMAIN``` and ```NETBIRD_AUTH0_CLIENT_ID``` properties.

    * To obtain these, please use [Auth0 React SDK Guide](https://auth0.com/docs/quickstart/spa/react/01-login#configure-auth0) up until "Install the Auth0 React SDK".

      > Use ```https://YOUR DOMAIN``` as ````Allowed Callback URLs````, ```Allowed Logout URLs```, ```Allowed Web Origins``` and ```Allowed Origins (CORS)```
    * set the variables in the ```setup.env```
    * :warning: Make sure that `Token Endpoint Authentication Method` is set to `None` in your Auth0 Default Application
2. Configure ```NETBIRD_AUTH0_AUDIENCE``` property.

    * Check [Auth0 Create An API](https://auth0.com/docs/quickstart/backend/golang#create-an-api) section to obtain AuthAudience.
    * set the property in the ```setup.env``` file.

### Step 3: Continue with the self-hosting guide
You can now continue with the [NetBird Self-hosting Guide](/getting-started/self-hosting#step-3-configure-identity-provider).