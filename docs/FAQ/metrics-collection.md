---
id: metrics-collection
title: Why and what are the anonymous usage metrics?
sidebar_position: 2
---
### Why we added metrics collection?
As an open-source project and business, making decisions based on data is essential. We will know our adoption rate, feature usage, and client type with anonymous metrics.

:::info
The collection is strict to our management system.
:::

If the metric collection infringes any internal regulation or policy, it can be disabled by setting the flag `--disable-anonymous-metrics=true` to the management service startup command.

### What are the metrics being collected?
We are collecting the following metrics:
* Number of accounts
* Number of users
* Number of peers
* Number of active peers in the last 24 hours
* Number of peers per operating system
* Number of setup keys usage
* Number of peers activated by users
* Number of rules
* Number of groups
* Number of routes
* Number of nameservers
* Service uptime
* Service version
* Metrics generation time


### Metrics UUID
We are using an installation ID for each management service which is generated once and stored in your management store database. It doesn't have any trace of any other private information, and it helps distinguish each deployment.

### Metrics pusher IP
We are not storing the pusher IP address; it gets discarded once the request is complete.
