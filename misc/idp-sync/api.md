# Integration API Documentation

## Introduction
This reference provides detailed information on managing integrations via NetBird Cloud API.

## Authentication
Authentication is required for all API requests. Please refer to the [authentication guideline](https://docs.netbird.io/how-to/access-netbird-public-api) for how to create and authenticate API calls using Personal Access Tokens (PAT).

## Google Endpoints

### Create Integration
By default, for new integration synchronization is enabled.

Request:
- `service_account_key`: A Base64 encoded string derived from a service account key JSON. For the creation of the service account key JSON, refer to the provided [IdP guideline](idp.md).
  Encode service account JSON to base64 by using the command:
```shell
  base64 -i <SERVICE_ACCOUNT_KEY_PATH>
``` 

-  `sync_interval`: Optional. The default value is 300 seconds.

```shell
curl --request POST \
  --url https://api.netbird.io/api/integrations/google-idp \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>' \
  --header 'Content-Type: application/json' \
  --data '{
	"service_account_key": "<SERVICE_ACCOUNT_KEY>",
	"customerID": "<CUSTOMER_ID>"
}'
```

Response
```json
{
	"id": <ID>,
	"customer_id": "<CUSTOMER_ID",
	"sync_interval": 300,
	"enabled": true
}
```

### Get Integration by ID
Request
```shell
curl --request GET \
  --url https://api.netbird.io/api/integrations/google-idp/<ID> \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```

Response
```json
{
  "id": <ID>,
  "customer_id": "<CUSTOMER_ID",
  "sync_interval": 300,
  "enabled": true
}
```

### Get All Integrations By AccountID
Request
```shell
curl --request GET \
  --url https://api.netbird.io/api/integrations/google-idp \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```

Response
```json
[
  {
    "id": <ID>,
    "customer_id": "<CUSTOMER_ID>",
    "sync_interval": 300,
    "enabled": true
  }
]
```

### Force Integration Sync
Request
```shell
curl --request GET \
  --url https://api.netbird.io/api/integrations/google-idp/<ID>/sync \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```

Response
```json
{
  "result": "ok"
}
```

### Update Integration
Updates the selected parameters for a specific integration.

Request
- `service_account_key`: A Base64 encoded string derived from a service account key JSON.For the creation of the service account key JSON, refer to the provided [IdP guideline](idp.md).
  Encode service account JSON to base64 by using the command:
```shell
  base64 -i <SERVICE_ACCOUNT_KEY_PATH>
``` 
-  `sync_interval`: Optional. Should not be less than 300 seconds.
- `enabled`: Optional. Used to disable/enable the integration.

```shell
curl --request PUT \
  --url https://api.netbird.io/api/integrations/google-idp/<ID> \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>' \
  --header 'Content-Type: application/json' \
  --data '{
	"service_account_key": "<SERVICE_ACCOUNT_KEY>",
	"sync_interval": 300,
	"enabled": false
}'
```

Response
```json
{
  "id": <ID>,
  "customer_id": "<CUSTOMER_ID>",
  "sync_interval": 300,
  "enabled": false
}
```

### Delete Integration
Request
```shell
curl --request DELETE \
  --url https://api.netbird.io/api/integrations/google-idp/<ID> \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```
Response
```json
{}
```

### Get Integration sync logs
Request
```shell
curl --request GET \
  --url https://api.netbird.io/api/integrations/google-idp/<ID>/logs \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```
Response
```json
[
  {
    "id": <ID>,
    "level": "info",
    "timestamp": "timestamp UTC",
    "message": "message"
  }
]
```


## Azure Endpoints
Before proceeding with the setup, please ensure that you have configured Azure as per the guidelines outlined in the [IdP guideline](idp.md).

### Create Integration
By default, for new integration synchronization is enabled.

Request:
- `client_secret`: A Base64 encoded string derived from Azure Directory application client credential secret.
  Encode service account JSON to base64 by using the command:
```shell
  echo -n <CLIENT_SECRET> | base64
```  
- `client_id`: Azure Directory application client Id.
- `tenant_id`: Azure Directory ID.
- `sync_interval`: Optional. The default value is 300 seconds.

```shell
curl --request POST \
  --url https://api.netbird.io/api/integrations/azure-idp \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>' \
  --header 'Content-Type: application/json' \
  --data '{
	"client_secret": "<CLIENT_SECRET>",
	"client_id": "<CLIENT_ID>",
	"tenant_id": "<TENANT_ID>"
}'
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

### Get Integration by ID
Request
```shell
curl --request GET \
  --url https://api.netbird.io/api/integrations/azure-idp/<ID> \
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
  --url https://api.netbird.io/api/integrations/azure-idp \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```

Response
```json
[
  {
    "id": <ID>,
    "client_id": "<CLIENT_ID>",
    "tenant_id": "<TENANT_ID>",
    "sync_interval": 300,
    "enabled": true
  }
]
```

### Force Integration Sync
Request
```shell
curl --request GET \
  --url https://api.netbird.io/api/integrations/azure-idp/<ID>/sync \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```

Response
```json
{
  "result": "ok"
}
```

### Update Integration
Updates the selected parameters for a specific integration.

Request
- `client_secret`: A Base64 encoded string derived from Azure Directory application client credential secret.
  Encode service account JSON to base64 by using the command:
```shell
  echo -n <CLIENT_SECRET> | base64
``` 
-  `sync_interval`: Optional. Should not be less than 300 seconds.
- `enabled`: Optional. Used to disable/enable the integration.

```shell
curl --request PUT \
  --url https://api.netbird.io/api/integrations/azure-idp/<ID> \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>' \
  --header 'Content-Type: application/json' \
  --data '{
	"client_secret": "<CLIENT_SECRET>",
	"sync_interval": 300,
	"enabled": false
}'
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

### Delete Integration
Request
```shell
curl --request DELETE \
  --url https://api.netbird.io/api/integrations/azure-idp/<ID> \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```
Response
```json
{}
```

### Get Integration sync logs
Request
```shell
curl --request GET \
  --url https://api.netbird.io/api/integrations/azure-idp/<ID>/logs \
  --header 'Accept: application/json' \
  --header 'Authorization: Token <PAT>'
```
Response
```json
[
  {
    "id": <ID>,
    "level": "info",
    "timestamp": "timestamp UTC",
    "message": "message"
  }
]
```
