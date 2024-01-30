# Event-Streaming Integration API Documentation

## Introduction
This reference provides detailed information on managing event-streaming integrations via NetBird Cloud API.

## Authentication
Authentication is required for all API requests. Please refer to the [authentication guideline](https://docs.netbird.io/how-to/access-netbird-public-api) for how to create and authenticate API calls using Personal Access Tokens (PAT).

## Event Streaming Endpoints

### Create Integration
Request:
- `platform`: A string representing the platform name. For Datadog, the value is `datadog`.
- `config`: A JSON object containing the configuration parameters for the respective platform.
  - Datadog
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

Response
```json
{
  "id": <ID>,
  "account_id": "<ACCOUNT_ID>",
  "enabled": true,
  "platform": "datadog",
  "created_at": "2024-01-04T14:03:26.634554Z",
  "updated_at": "2024-01-04T14:03:26.634554Z",
  "config": {
    "api_key": "****",
    "api_url": "https://http-intake.logs.datadoghq.eu/api/v2/logs"
  }
}
```

### Get Integration by ID
Request
```shell
curl --request GET \
  --url https://api.netbird.io/api/integrations/event-streaming/<ID> \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```

Response
```json
{
  "id": <ID>,
  "client_id": "<CLIENT_ID>",
  "tenant_id": "<TENANT_ID>",
  "sync_interval": 300,
  "enabled": true
}
```

### Get All Integrations By AccountID
Request
```shell
curl --request GET \
  --url https://api.netbird.io/api/integrations/event-streaming \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```

Response
```json
[
  {
    "id": <ID>,
    "account_id": "<ACCOUNT_ID>",
    "enabled": true,
    "platform": "datadog",
    "created_at": "2024-01-04T15:03:26.634554+01:00",
    "updated_at": "2024-01-04T15:03:26.634554+01:00",
    "config": {
      "api_key": "****",
      "api_url": "https://http-intake.logs.datadoghq.eu/api/v2/logs"
    }
  }
]
```

### Update Integration
Updates the selected parameters for a specific integration.

Request:
- `platform`: A string representing the platform name. For Datadog, the value is `datadog`.
- `config`: A JSON object containing the configuration parameters for the respective platform.
    - Datadog
        - `api_url`: The URL of the Datadog HTTP API endpoint. This URL differs based on the region. To find the correct URL, refer to the [Datadog documentation](https://docs.datadoghq.com/api/latest/logs/#send-logs).
        - `api_key`: The API key for the Datadog HTTP API endpoint. This key can be created in the [Datadog Console](https://app.datadoghq.com/organization-settings/api-keys).
- `enabled`: A flag to enable/disable the integration.

```shell
curl --request PUT \
  --url https://api.netbird.io/api/integrations/event-streaming/<ID> \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>' \
  --header 'Content-Type: application/json' \
  --data '{
      "platform": "datadog",
      "config": {
        "api_url": "https://http-intake.logs.datadoghq.com/api/v2/logs",
        "api_key": "<API_KEY>"
      },
      "enabled": true
  }'
```

Response
```json
{
  "id": <ID>,
  "account_id": "<ACCOUNT_ID>",
  "enabled": true,
  "platform": "datadog",
  "created_at": "2024-01-04T14:03:26.634554Z",
  "updated_at": "2024-01-04T14:03:26.634554Z",
  "config": {
    "api_key": "****",
    "api_url": "https://http-intake.logs.datadoghq.eu/api/v2/logs"
  }
}
```

### Delete Integration
Request
```shell
curl --request DELETE \
  --url https://api.netbird.io/api/integrations/event-streaming/<ID> \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```
Response
```json
{}
```
