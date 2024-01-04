# Introduction

This document provides step-by-step instructions and best practices for setting up NetBird activity event streaming integrations to different third-party services.

## Datadog

Before you start creating and configuring a Datadog event-streaming integration, ensure that you have the following:
- A Datadog account with the permissions to create and manage API keys. If you don't have the required permissions, ask your Datadog administrator to grant them to you.

#### Step 1: Create a Datdog API key
- Navigate to the [API Keys](https://app.datadoghq.eu/organization-settings/api-keys) page
- Click `+ New Key` at the top
- Give it a descriptive name like `NetBird Event Streaming`
- Click `Create Key`
- Copy the key. You will need this key when configuring an integration in NetBird.
#### Step 2: Create an event-streaming integration in NetBird
Use the NetBird API to create the integration. For this you can use the following cURL command with updated parameters:
- `platform`: A string representing the platform name. For Datadog use `datadog`.
- `config.api_url`: The URL of the Datadog HTTP API endpoint. This URL differs based on the region. To find the correct URL, refer to the [Datadog documentation](https://docs.datadoghq.com/api/latest/logs/#send-logs).
- `config.api_key`: The API key for the Datadog HTTP API endpoint. This key can be created in the [Datadog Console](https://app.datadoghq.com/organization-settings/api-keys).
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

>For further management of your event-streaming integration refer to the [event streaming API documentation](api.md).