# Introduction

Welcome to our comprehensive guide on configuring Identity Provider (IdP) for users and groups synchronization. This document provides step-by-step instructions and best practices for setting up and managing your synchronization processes effectively.


## Google WorkSpace

Before you start creating and configuring an Google Workspace application, ensure that you have the following:
- User account with admin permissions: You must have an Google Workspace user account with the admin permissions to create and manage Google Workspace applications. If you don't have the required permissions, ask your workspace administrator to grant them to you.
- Create new `NetBird` project in Google cloud console https://console.cloud.google.com.
- Enable `Admin SDK API` for `Netbird` project at https://console.cloud.google.com/apis/library/admin.googleapis.com.

#### Step 1: Create a service account
- Navigate to [API Credentials](https://console.cloud.google.com/apis/credentials) page
- Click `CREATE CREDENTIALS` at the top and select `Service account`
- Fill in the form with the following values and click `CREATE`
    - Service account name: `NetBird`
    - Service account ID: `netbird`
- Click `DONE`
<p>
    <img src="media/google-service-account-create.png" alt="service-account-create"/>
</p>

#### Step 2: Create service account keys
- Navigate to [API Credentials](https://console.cloud.google.com/apis/credentials) page
- Under  `Service Accounts` click the `NetBird` to edit the service account
<p>
    <img src="media/google-edit-service-account.png" alt="edit-service-account"/>
</p>

- Take note of service account email address, we will use it in next steps
- Click the `Keys` tab
- Click the `Add key` drop-down menu, then select `Create new key`
- Select `JSON` as the Key type and click `Create`

>When you create a service account key by using the Google Cloud console, most browsers immediately download the new key and save it in a download folder on your computer.
Read how to manage and secure your service keys [here](https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys#temp-locations)

#### Step 3: Grant a user management admin role to a service account
- Navigate to [Admin Console](https://admin.google.com/ac/home) page
- Select `Account` on the left menu and then click `Admin Roles`
- Click `Create new role`
- Fill in the form with the following values and click `CREATE`
    - name: `User and Group Management ReadOnly`
    - description: `User and Group Management ReadOnly`
- Click `CONTINUE`
<p>
    <img src="media/google-new-admin-role.png" alt="new-admin-role"/>
</p>

- Scroll down to `Admin API privileges` and add the following privileges
  - Users: `Read`
  - Groups: `Read`
<p>
    <img src="media/google-privileges-review.png" alt="privileges-review"/>
</p>

- Verify preview of assigned Admin API privileges to ensure that everything is properly configured, and then click `CREATE ROLE`

- Click `Assign service accounts`, add service account email address and then click `ADD`
<p>
    <img src="media/google-assign-service-account.png" alt="assign-service-account" />
</p>

- Click `ASSIGN ROLE` to assign service account to `User and Group Management ReadOnly` admin role
<p>
    <img src="media/google-service-account-privileges.png" alt="service-account-privileges" />
</p>

- Navigate to [Account Settings](https://admin.google.com/ac/accountsettings/profile?hl=en_US) page and take note of `Customer ID`