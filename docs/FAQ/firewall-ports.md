---
id: firewall-ports
title: What firewall ports should I open to use NetBird?
sidebar_position: 1
---
### Incoming ports
NetBird's agent doesn't require any incoming port to be open; It negotiates the connection with the support of the signal and relay services.
### Outgoing ports
NetBird usually won't need open ports, but sometimes you or your IT team needs to secure and verify 
all outgoing traffic, and that may affect how NetBird clients connect to the [control layer](/overview/architecture) 
and negotiate the peer-to-peer connections.

Below is the list of NetBird hosted endpoints and ports they listen to:
* Management service: 
  * **Endpoint**: api.wiretrustee.com
  * **Port**: TCP/33073
* Signal service:
    * **Endpoint**: signal.wiretrustee.com
    * **Port**: TCP/10000
* Relay (TURN) service:
    * **Endpoint**: turn.netbird.io
    * **Port range**: UDP/5555-65535