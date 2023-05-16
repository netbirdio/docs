---
id: using-netbird-with-okta
title: Using NetBird with Okta
sidebar_position: 6
tags:
- integrations
- idp
- okta
- oidc
- how-to
---

This guide is a part of the [NetBird Self-hosting Guide](/getting-started/self-hosting) and explains how to integrate 
**self-hosted** NetBird with [Okta](https://www.okta.com/).

:::tip self-hosted idp
If you prefer to have full control over authentication and authorization of your NetBird network, there are good
self-hosted alternatives to the managed Okta service like [Keycloak](/integrations/identity-providers/self-hosted/using-netbird-with-keycloak).
:::


Before you start creating and configuring an Okta application, ensure that you have an Okta workforce identity cloud account. If you don't have one, sign up for a free account at https://www.okta.com/free-trial/.

### 1. Create and configure Okta single-page application
In this step, we will create and configure Netbird single-page application in okta.
- Navigate to Okta Admin Dashboard
- Click `Applications` in the left menu and then click on `Applications`
- Click `Create App Intergration`
- Fill in the form with the following values and click `Next`
  - Sign-in method: `OIDC - OpenID Connect`
  - Application type: `Single-Page Application`

![](/img/integrations/identity-providers/self-hosted/okta-new-single-page-application.png)

- Fill in the form with the following values and click `Save`
    - App integration name: `Netbird`
    - Grant type: `Authorization Code` and `Refresh Token`
    - Sign-in redirect URIs: `https://<yournetbirddomain.com>/auth` and `https://<yournetbirddomain.com>/silent-auth`
    - Sign-out redirect URIs: `https://<yournetbirddomain.com>/`
- Click `Save`

![](/img/integrations/identity-providers/self-hosted/okta-single-page-application.png)

- Navigate to Okta Admin Dashboard
- Click `Applications` in the left menu and then click on `Applications`
- Select `Netbird` application on the list and take a note of the `Client ID`, we will use it later
- Click on `Sign On` tab on top menu
- Under `OpenID Connect ID Token` section, click `Edit` and update `Issuer`  to use the `Okta URL`
- Click `Save`

![](/img/integrations/identity-providers/self-hosted/okta-single-sign-on-configuration.png)

### 2. Create and configure Okta native application
In this step, we will create and configure Netbird native application in okta.
- Navigate to Okta Admin Dashboard
- Click `Applications` in the left menu and then click on `Applications`
- Click `Create App Intergration`
- Fill in the form with the following values and click `Next`
  - Sign-in method: `OIDC - OpenID Connect`
  - Application type: `Native Application`

![](/img/integrations/identity-providers/self-hosted/okta-new-native-application.png)


- Fill in the form with the following values and click `Save`
    - App integration name: `Netbird Native App`
    - Grant type: `Device Authorization`
- Click `Save`

![](/img/integrations/identity-providers/self-hosted/okta-native-application.png)

- Navigate to Okta Admin Dashboard
- Click `Applications` in the left menu and then click on `Applications`
- Select `Netbird Native App` application on the list and take a note of the `Client ID`, we will use it later
- Click on `Sign On` tab on top menu
- Under `OpenID Connect ID Token` section, click `Edit` and update `Issuer`  to use the `Okta URL`
- Click `Save`

![](/img/integrations/identity-providers/self-hosted/okta-native-sign-on-configuration.png)