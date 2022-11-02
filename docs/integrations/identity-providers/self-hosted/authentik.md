---
id: using-netbird-with-authentik
title: Using NetBird with Authentik
sidebar_position: 3
tags:
- integrations
- idp
- authentik
- oidc
- how-to
---

This guide is a part of the [NetBird Self-hosting Guide](/getting-started/self-hosting) and explains how to integrate 
**self-hosted** NetBird with [Authentik](https://goauthentik.io).

Authentik is an open-source Identity Provider focused on flexibility and versatility powered by Python.

:::tip managed idp
If you prefer not to self-host an Identity and Access Management solution, then you could use a managed alternative like
[Auth0](/integrations/identity-providers/self-hosted/using-netbird-with-auth0).
:::


### Expected Result

After completing this guide, you can log in to your self-hosted NetBird Dashboard and add your machines 
to your network using setup keys. New Authentik releases should also support [Interactive SSO Login feature](/getting-started/installation#running-netbird-with-sso-login), but right now there is no integration guide. However, you can [create one](https://github.com/nolog-it/netbird-docs#contributing-to-the-docs).


### Step 1: Basic Authentik prerequisites

For this guide, we assume you have Authentik configured and running on public-facing domain with SSL. Use the official [Authentik "Get started" guide](https://goauthentik.io/docs/installation).

We also assume that you have at least one user created on your Authentik server and that it's configured properly. You can test your configuration with some other self-hosted application or use service like [OIDC Playground](https://openidconnect.net).

We will be using **https://authentik.example.com** as our Authentik base URL, pleace replace it to your needs.



Most of the OIDC software requires SSL for production use. 
We encourage you to comply with this requirement to make the world more secure 😊.



### Step 2: Create a provider

In this step we will create "provider" and "application" for Netbird in Authentik.



1. Log-in to Authentik with Admin account (e.g. the default _akadmin_)
1. Open the `Admin interface`
1. In the `Applications` section click on `Providers` and then `Create`
1. In the New Provider menu, select `OAuth2/OpenID Provider`
1. Fill in the `Name` column, for example `netbird-client`
1. Change the `Client type` to `Public`
1. Copy the generated `Client ID`, we will use it later
1. Fill the `Redirect URIs/Origins (RegEx)` with `https://YOUR_NETBIRD_DOMAIN/.*`
    * Replace the URL with your Authentik URL and keep the `/.*` on the end
1. For `Signing key` select `authentik Self-signed certificate`
    * If you see two certificates, it shouldn't matter which one
1. Click on `Advanced protocol settings` and change the `Subject mode` to `Based on the username`. 
    * This step is optional, but if you stay with Hashed UserID, you will end up with nonsense usernames in Netbird. But if you are the only user, it shouldn't matter.
1. Click on `Finish` to save the provider and continue with Step 3

### Step 3: Create a application

1. In the `Applications` section click on `Applications` and then `Create`
1. Fill in the `Name` and `Slug` with something sensible (e.g. netbird)
    * The Name is shown to users, while the Slug is used internally. Don't use any special characters here to stay safe.
1. In the `Provider` field, select the provider we created in Step 2 from the list (in our case `netbird-client`)
1. You can leave the rest unconfigured, the settings are mostly self-explanatory.


### Step 4: Continue with the self-hosting guide

Your authority OIDC configuration is visible in your Provider settings under `OpenID Configuration URL`. It should look like this:
```
https://authentik.example.com/application/o/netbird-client/.well-known/openid-configuration
```
:::caution
Double-check if the endpoint returns a JSON response by calling it from your browser.
:::

- Set properties in the `setup.env` file:
  - NETBIRD_AUTH_OIDC_CONFIGURATION_ENDPOINT=`https://authentik.example.com/application/o/netbird-client/.well-known/openid-configuration`.
  - NETBIRD_AUTH_CLIENT_ID=`ClientID generated in Step 2, Section 7`
  - NETBIRD_AUTH_AUDIENCE=`ClientID generated in Step 2, Section 7`


- You can now continue with the [NetBird Self-hosting Guide](/getting-started/self-hosting#step-3-configure-identity-provider).

:::note
Make sure that your Keycloak instance use HTTPS. Otherwise, the setup won't work.
:::