# Introduction

Welcome to our comprehensive guide on configuring NetBird event-streaming to third-party services. This document provides step-by-step instructions and best practices for setting up streaming integrations to different third-party services.

## Datadog

Before you start creating and configuring a Datadog event-streaming integration, ensure that you have the following:
- User account with admin permissions: You must have a Datadog account with the admin permissions to create and manage API keys. If you don't have the required permissions, ask your workspace administrator to grant them to you.

#### Step 1: Create an API key
- Navigate to the [API Keys](https://app.datadoghq.eu/organization-settings/api-keys) page
- Click `+ New Key` at the top
- Give it a descriptive name like `NetBird Event Streaming`
- Click `Create Key`

#### Step 2: Create an event-streaming integration
Use the NetBird API to create the integration. For this you can use the following cURL command with updated parameters:
- `platform`: A string representing the platform name. For Datadog use `datadog`.
- `api_url`: The URL of the Datadog HTTP API endpoint. This URL differs based on the region. To find the correct URL, refer to the [Datadog documentation](https://docs.datadoghq.com/api/latest/logs/#send-logs).
- `api_key`: The API key for the Datadog HTTP API endpoint. This key can be created in the [Datadog Console](https://app.datadoghq.com/organization-settings/api-keys).
- `enabled`: A flag to enable/disable the integration.

```shell
curl --request POST \
  --url https://api.netbird.io/api/integrations/event-streaming \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>' \
  --header 'Content-Type: application/json' \
  --data '{
      "platform": "datadog",
      "config": {
        "api_url": "https://http-intake.logs.datadoghq.eu/api/v2/logs",
        "api_key": "<API_KEY>"
      },
      "enabled": true
}'
```

>For further management of your event-streaming integration refer to the [API Documentation](api.md).