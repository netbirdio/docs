---
id: using-netbird-with-azure-sso
title: Using NetBird with Azure SSO
sidebar_position: 4
tags:
- integrations
- idp
- azure
- oidc
- how-to
---

This guide is a part of the [NetBird Self-hosting Guide](/getting-started/self-hosting) and explains how to integrate
**self-hosted** NetBird with [Azure SSO](https://azure.microsoft.com/en-us/solutions/active-directory-sso/#overview).

This is an organized collection of instructions gathered from the [Netbird Slack](https://netbirdio.slack.com/)

There are five properties of the **`setup.env`** file that we will configure in this guide:
- `NETBIRD_AUTH_CLIENT_ID`
- `NETBIRD_AUTH_OIDC_CONFIGURATION_ENDPOINT`
- `NETBIRD_USE_AUTH0`
- `NETBIRD_AUTH_AUDIENCE`
- `NETBIRD_AUTH_DEVICE_AUTH_CLIENT_ID`
- `NETBIRD_AUTH_DEVICE_AUTH_PROVIDER`
- `NETBIRD_AUTH_REDIRECT_URI`
- `NETBIRD_AUTH_SILENT_REDIRECT_URI`


In Azure, Navigate to **Azure Active Directory**, and click on **App Registrations** in the left hand menu. Once there, Click on **New registration** across the top menu bar.
- Write a name for your application and choose who can access your application.
- For Redirect URI, Choose Single-page Application(SPA). for the next box, type your netbird.domainname + auth. E.g `https://netbird.mydomainname.com/auth`. Keep the `auth` in mind as this will be your value for `NETBIRD_AUTH_REDIRECT_URI`
- On this next page, copy the `Application (client) ID`. This will be the value for the following:
  - `NETBIRD_AUTH_AUDIENCE`
  - `NETBIRD_AUTH_CLIENT_ID`
  - `NETBIRD_AUTH_DEVICE_AUTH_CLIENT_ID`


### 1. Authentication
Within the same section (App Registrations), navigate to **Authentication** via the left hand menu. Once there, perform the following:
- Under the Single-page Application Section, Add another URI with the following value: `https://yournetbirddomain.com/silent-auth`. The `silent-auth` section of the url is the value for `NETBIRD_AUTH_SILENT_REDIRECT_URI`
- You should have two URI's listed similar to these:
  - `https://yournetbirddomain.com/auth`
  - `https://yournetbirddomain.com/silent-auth`
- Scroll down and check off the following two boxes:
  - `Access tokens (used for implicit flows)`
  - `ID tokens (used for implicit and hybrid flows)`


### 2. Expose API
Next, on the left hand menu, click on **Expose an API**. Next, set an `Application ID URI`. You can choose the default value as is, or set your own. Click on **Add a Scope**, and enter the following:
- **Scope Name:** `api`
- The rest you can choose as your work requires it.

Next under **Authorized client Applications**, click on **add a client application** and enter the following:
- **Client ID**: This is the same as your Application ID URI minus the `api://`. See the picture below as a reference
- **Authorized Scopes:** The correct scope will contain your **Client ID** used in the above step. The correct Authorized Scope will be similar to `api://YOUR_CLIENT_ID/api` (api is the value of the name of the scope we defined before.)

![](/img/integrations/identity-providers/self-hosted/azure_api_scope.png)


### 3. API permissions
Under **API Permissions**, click on **Add a permission**. On the next screen that pops up, click on **My APIs**, and select the API that matches with your **Application Client ID**. Next Select the scope we created in the earlier steps.

### 4. Manifest
On the left hand Menu, click on **Manifest**. On the next page, search for `accessTokenAcceptedVersion` and change the value from `null` to `2`.

### 5. Continue with the self-hosting guide
Your authority OIDC configuration will be available under:
```
https://login.microsoftonline.com/YOUR-DIRECTORY(TENANT)-ID/v2.0/.well-known/openid-configuration
```
:::caution
Double-check if the endpoint returns a JSON response by calling it from your browser.
:::

- Set properties in the `setup.env` file:
  - NETBIRD_AUTH_OIDC_CONFIGURATION_ENDPOINT=`https://login.microsoftonline.com/YOUR-DIRECTORY(TENANT)-ID/v2.0/.well-known/openid-configuration`
    - this can be grabbed by clicking on `Endpoints` in your App's **App Registration* Over Page.
  - NETBIRD_AUTH_CLIENT_ID=**YOUR APPLICATION (client) ID**
    - This can be grabbed from your App's **App Registration** Overview page
  - NETBIRD_AUTH_AUDIENCE=**YOUR APPLICATION (client) ID**
  - NETBIRD_AUTH_DEVICE_AUTH_CLIENT_ID=**YOUR Application (client) ID**. Optional,
  - NETBIRD_USE_AUTH0=`false`
  - NETBIRD_AUTH_DEVICE_AUTH_PROVIDER=`hosted`
  - NETBIRD_AUTH_REDIRECT_URI=`/auth`
  - NETBIRD_AUTH_SILENT_REDIRECT_URI=`/silent-auth`
- You can now continue with the [NetBird Self-hosting Guide](/getting-started/self-hosting#step-3-configure-identity-provider).

