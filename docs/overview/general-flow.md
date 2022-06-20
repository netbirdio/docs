---
sidebar_position: 2
---

# General Flow Overview

Below is a high level, step-by-step overview of the flow of communications within NetBird.

1. Administrator creates an account at [app.netbird.io](https://app.netbird.io/).
2. The system automatically generates a new network with an allocated address block <em>100.64.0.0/10</em>.
3. The system automatically generates 2 [setup keys](/overview/setup-keys) that can be used for authenticating new machines.
4. Administrator (or a user) installs NetBird client and runs ```netbird up``` command providing one of the setup keys.
5. NetBird client generates Wireguard private and public keys along with the initial configuration.
6. NetBird client sends a registration request to the NetBird Management service calling Login gRPC endpoint, providing setup key, Wireguard public key and additional information about the machine.
7. NetBird Management service checks the provided setup key, registers the machine and returns initial configuration to the NetBird client.
8. NetBird client receives initial configuration and starts the engine configuring Wireguard, connecting to the Signal Service channel, and the Management Service network updates channel.
9. NetBird client receives network map update from the Management Service that includes a list of peers/machines to connect to, and a private IP address.
10. For each peer NetBird client initiates a connection process by sending a connection offer message through the Signal service indicating its intent to connect, and a Wireguard public key. 
11. If the client wasn't the initiator of the connection and receives an offer message, it checks whether the initiator is in the allowed peers list and sends an acknowledgement message through Signal.
12. Once the acknowledgement message has been received, NetBird Client (on both ends) starts a connection negotiation process using [Interactive Connectivity Establishment protocol (ICE)](https://datatracker.ietf.org/doc/html/rfc8445).
13. Once the direct connection between peers has been established successfully, NetBird Client starts proxying data to Wireguard.
14. In case a direct Wireguard connection is possible (e.g., peers are in the same network or one of the peers has a public IP), NetBird Client establishes a direct Wireguard connection avoiding proxy. 
15. NetBird Client keeps a connection to the Management service receiving network updates such as new peers joining the network or peers deleted from the network.
16. When a new peer joins the network, the NetBird client receives an update and triggers connection (see #10).
17. When network administrator removes a peer, the NetBird client receives an update and removes the connection.

