---
id: using-netbird-with-azure-ad
title: Using NetBird with Azure AD
sidebar_position: 4
tags:
- integrations
- idp
- azure
- oidc
- how-to
---

This guide is a part of the [NetBird Self-hosting Guide](/getting-started/self-hosting) and explains how to integrate **self-hosted** NetBird with [Azure AD](https://azure.microsoft.com/en-us/products/active-directory/).

Azure AD is a an enterprise identity service that provides single sign-on and multifactor authentication to your applications. 
It is a 3rd party managed service and can't be self-hosted.

:::tip self-hosted idp
If you prefer to have full control over authentication and authorization of your NetBird network, there are good
self-hosted alternatives to the managed Auth0 service like [Keycloak](/integrations/identity-providers/self-hosted/using-netbird-with-keycloak).
:::

Before you start creating and configuring an Azure AD application, ensure that you have the following:
- An Azure account: To create an Azure AD application, you must have an Azure account. If you don't have one, sign up for a free account at https://azure.microsoft.com/free/.

- User account with appropriate permissions: You must have an Azure AD user account with the appropriate permissions to create and manage Azure AD applications. If you don't have the required permissions, ask your Azure AD administrator to grant them to you.


### 1. Create and configure Azure AD application
In this step, we will create and configure Netbird application in azure AD.
- Navigate to [Azure Active Directory](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview)
- Click `App Registrations` in the left menu then click on the `+ New registration` button to create a new application.
- Fill in the form with the following values and click Register
  - Name: `Netbird`
  - Account Types: `Accounts in this organizational directory only (Default Directory only - Single tenant)`
  - Redirect URI: select `Single-page application (SPA)` and URI as `https://<yournetbirddomain.com>/silent-auth`

![](/img/integrations/identity-providers/self-hosted/azure-new-application.png)

### 2. Platform configurations
- Click `Authentication` on the left side menu
- Under the `Single-page application` Section, add another URI `https://<yournetbirddomain.com>/auth`
  ![](/img/integrations/identity-providers/self-hosted/azure-spa-uri-setup.png)

- Scroll down and setup other options as on the screenshot below and click Save

![](/img/integrations/identity-providers/self-hosted/azure-flows-setup.png)

### 3. Create a NetBird application scope
- Click `Expose an API` on the left menu
- Under `Application ID URI` click `Set` and then `Save`
- Click `+ Add a Scope`
- Fill in the form with the following values and click `Add scope`
  - Scope name: `api`

![](/img/integrations/identity-providers/self-hosted/azure-add-scope.png)

- Under `Authorized client Applications`, click on `+ add a client application` and enter the following:
- Fill in the form with the following values and click `Add application`
  - Client ID: same as your Application ID URI minus the `api://`

![](/img/integrations/identity-providers/self-hosted/azure-add-application-scope.png)


### 4. Add API permissions
- Add `Netbird` permissions
  - Click `API permissions` on the left menu
  - Click `Add a permission`
  - Click `My APIs` tab, and select `Netbird`. Next check `api` permission checkbox and click `Add permissions`.

  ![](/img/integrations/identity-providers/self-hosted/azure-netbird-api-permisssions.png)

- Add `Delagated permissions` to Microsoft Graph
  - Click `Add a permission`
  - Click `Microsoft Graph` and then click `Delagated permissions` tab  and check all permissions under the `OpenId permissions` section and click  `Add permissions`

  ![](/img/integrations/identity-providers/self-hosted/azure-openid-permissions.png)


- Add `Application permissions` to Microsoft Graph
  - Click `Add a permission`
  - Click `Microsoft Graph` and then click `Application permissions` tab 
  - Search for `User.ReadWrite.All` and under `User` sections  and check `User.ReadWrite.All` checkbox  section

  ![](/img/integrations/identity-providers/self-hosted/azure-user-permissions.png)

  - Search for `Application.ReadWrite.All` and under `Application` sections  and check `Application.ReadWrite.All` checkbox  section and click `Add permissions`

  ![](/img/integrations/identity-providers/self-hosted/azure-applications-permissions.png)

  - Click `Grant admin conset for Default Directory` and click `Yes`

  ![](/img/integrations/identity-providers/self-hosted/azure-grant-admin-conset.png)

### 4. Update token version
- Click `Manifest` on left menu
- Search for `accessTokenAcceptedVersion` and change the value from `null` to `2`
- Click `Save`

### 5. Generate client secret
- Click `Certificates & secrets` on left menu
- Click `New client secret`
- Fill in the form with the following values and click `Add`
  - Description: `Netbird`
- Copy `Value` and save it as it can be viewed only once after creation.

![](/img/integrations/identity-providers/self-hosted/azure-client-secret.png)

Your authority OIDC configuration will be available under:
```
https://login.microsoftonline.com/<tenant_id>/v2.0/.well-known/openid-configuration
```
:::caution
Double-check if the endpoint returns a JSON response by calling it from your browser.
:::

- Set properties in the `setup.env` file:
  ```json
  NETBIRD_AUTH_OIDC_CONFIGURATION_ENDPOINT="https://login.microsoftonline.com/<tenant_id>/v2.0/.well-known/openid-configuration"
  NETBIRD_USE_AUTH0=false
  NETBIRD_AUTH_CLIENT_ID="<application_id>"
  NETBIRD_AUTH_AUDIENCE="<application_id>"
  NETBIRD_AUTH_DEVICE_AUTH_CLIENT_ID="<application_id>"
  NETBIRD_AUTH_REDIRECT_URI="/auth"
  NETBIRD_AUTH_SILENT_REDIRECT_URI="/silent-auth"
  NETBIRD_AUTH_USER_ID_CLAIM="oid"
  ```

- You can now continue with the [NetBird Self-hosting Guide](/getting-started/self-hosting#step-3-configure-identity-provider).

- Set property `IdpManagerConfig` in the `management.json` file with:
  :::caution
  The file management.json is created automatically. Please refer [here](/getting-started/self-hosting#step-5-run-configuration-script) for more information.
  :::

  ```json
  {
    "ManagerType": "azure",
    "AzureClientCredentials": {
        "ClientID": "<application_id>",
        "ClientSecret": "<client_secret>",
        "GrantType": "client_credentials",
        "ObjectID": "<object_id>",
        "TokenEndpoint": "https://login.microsoftonline.com/<tenant_id>/oauth2/v2.0/token",
        "GraphAPIEndpoint": "https://graph.microsoft.com/v1.0"
    }
  }
  ```

- Modify the value of the `AUTH_SUPPORTED_SCOPES` environment variable for the dashboard service in the docker-compose.yml file to `openid profile email offline_access api://<application_id>/api`.

- Modify `Scope` value in `DeviceAuthorizationFlow` within the `management.json` to `api://<application_id>/api`.

