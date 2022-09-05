---
sidebar_position: 1
---
# Network routes

NetBird provides fast and reliable end-to-end encryption between peers in your network. You can install the agent on every desktop, VM, container, or physical server and have a fast, secure peer-to-peer mesh network. That is the desired configuration, but some cases do not allow for agent installation or can slow down migration from legacy systems:

- Side-by-side migrations where part of your network is already using NetBird but needs to access services that are not
- Systems that we have limited operating system access. e.g., IoT devices, printers, and managed services.
- Legacy networks where an administrator is unable to install the agent on all nodes

In these cases, you can configure network routes assigning routing peers to connect existing infrastructure. Routing peers will forward packets between your NetBird peers and your other networks; they can masquerade traffic going to your data centers or embedded devices, reducing the need for external route configuration and agent installation.

<p align="center">
    <img src="/docs/img/how-to-guides/netbird-network-routes.png" alt="high-level-dia" width="600"  />
</p>

## Concepts
### Network routes
A network route describes the network you want to connect with your NetBird peers. It has an identifier, a network CIDR, a routing peer, and some parameters available for managing priority and masquerading.
:::info
Network routes is available for NetBird v0.9.0 or later.
:::
### Network identifiers and CIDRs
Network identifiers are names for each network you want to route traffic from your peers, and network CIDR are IP ranges in CIDR notation which refers to an external network. The combination of identifiers and these ranges makes a single network.
### Routing peer
A routing peer is a node that will route packets between your routed network and the other NetBird peers.
:::info
Only Linux OS nodes can be assigned as routing peers.
:::
### High availability routes
A highly available route is a combination of multiple routes with the same network identifier and CIDR. They have different routing peers offering high-available paths for communication between your peers and external networks.
Nodes connected to routing peers will choose one of them to route packets to external networks based on connection type and defined metrics.
### Masquerade
Masquerade hides other NetBird network IPs behind the routing peer local address when accessing the target Network CIDR. This option allows access to your private networks without configuring routes on your local routers or other devices.

If you don't enable this option, you must configure a route to your NetBird network in your external network infrastructure.
### Metric and priority
Metric defines prioritization when choosing the main routing peer in a high availability network. Lower metrics have higher priority.

## Managing network routes
The configuration and management of network routes are done through the management dashboard. There is no need to run any configuration commands on your peers.
### Creating a network route
After accessing the `Network routes` tab, you can click on the `Add Route` button to create a new route. That will open a route configuration screen where you can add the information about the network you want to route:
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-network-routes-add-button.png" alt="high-level-dia" width="600" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

Now you can enter the details for your route:

<p align="center">
    <img src="/docs/img/how-to-guides/netbird-network-routes-create.png" alt="high-level-dia" width="300" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

Once you are done filling the route information, you can click on the `create` button to save your new route.
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-network-routes-saved-new.png" alt="high-level-dia" width="600" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>
Done! Now every peer connected to your routing peer will be able to send traffic to your external network.

### Masquerading your NetBird traffic
Configuring a route is enough to route packets from your NetBird peers to your external networks, but in order to make the communication