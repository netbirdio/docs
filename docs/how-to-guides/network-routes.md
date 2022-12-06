---
sidebar_position: 1
---
# Routing traffic to private networks

<div class="videowrapper">
<iframe src="https://www.youtube.com/embed/VQuPuBOAknQ" allow="fullscreen;"></iframe>
</div>
<br/><br/>

NetBird provides fast and reliable end-to-end encryption between peers in your network. You can install the agent on every desktop, VM, container, or physical server and have a fast, secure peer-to-peer mesh network. That is the desired configuration, but some cases do not allow for agent installation or can slow down migration from legacy systems:

- Side-by-side migrations where part of your network is already using NetBird but needs to access services that are not.
- Systems that have limited operating system access. e.g., IoT devices, printers, and managed services.
- Legacy networks where an administrator is unable to install the agent on all nodes.

In these cases, you can configure network routes assigning routing peers to connect existing infrastructure. Routing peers will forward packets between your NetBird peers and your other networks; they can masquerade traffic going to your data centers or embedded devices, reducing the need for external route configuration and agent installation.

<p align="center">
    <img src="/docs/img/how-to-guides/netbird-network-routes.png" alt="high-level-dia"  />
</p>

:::tip try it
If you want to see the Network Routes feature in action, try our managed version at https://app.netbird.io/routes. 

It's free and simple! :)
:::

## Concepts
### Network routes
A network route describes the network you want to connect with your NetBird peers. It has an identifier, a network range, a routing peer, and some parameters available for managing priority and masquerading.
:::info
Network routes is available for NetBird [v0.9.0](https://github.com/netbirdio/netbird/releases) or later.
:::
### Network identifiers and ranges
Network identifiers are names for each network you want to route traffic from your peers, and ranges are IP ranges declared in CIDR notation which refers to an external network. The combination of identifiers and these ranges makes a single network.
### Routing peer
A routing peer is a node that will route packets between your routed network and the other NetBird peers.
:::info
Only Linux OS nodes can be assigned as routing peers.
:::
### High availability routes
A highly available route is a combination of multiple routes with the same network identifier and ranges. They have different routing peers offering high-available paths for communication between your peers and external networks.
Nodes connected to routing peers will choose one of them to route packets to external networks based on connection type and defined metrics.
### Masquerade
Masquerade hides other NetBird network IPs behind the routing peer local address when accessing the target Network range. This option allows access to your private networks without configuring routes on your local routers or other devices.

If you don't enable this option, you must configure a route to your NetBird network in your external network infrastructure.
### Metric and priority
Metric defines prioritization when choosing the main routing peer in a high availability network. Lower metrics have higher priority.

### Distribution groups
Distribution groups defines that peers that belong to groups set in this field will receive the network route.
:::info
It doesn't remove the need for the routing peer to be connected to these peers
:::

## Managing network routes
A network route describes a network you want to connect with your NetBird peers. It has an identifier, a network range, a routing peer, and some parameters available for managing priority and masquerading.

### Creating a network route
Access the `Network Routes` tab and click the `Add Route` button to create a new route. 
That will open a route configuration screen where you can add the information about the network you want to route:
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-network-routes-add-button.png" alt="high-level-dia" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

Now you can enter the details of your route.
In the example below, we are creating a route with the following information:

- Network identifier: `aws-eu-central-1-vpc`
- Description: `Production VPC in Frankfurt`
- Network range: `172.31.0.0/16`
- Routing peer: `aws-nb-europe-router-az-a`
- Distribution Groups: `All`

<p align="center">
    <img src="/docs/img/how-to-guides/netbird-network-routes-create.png" alt="high-level-dia" width="300" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

Once you fill in the route information, you can click on the `Save` button to save your new route.
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-network-routes-saved-new.png" alt="high-level-dia" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>
Done! Now every peer connected to your routing peer will be able to send traffic to your external network.

### Creating highly available routes
To avoid a single point of failure when managing your network, we recommend installing NetBird on every resource. 
However, you still want to ensure a reliable connection to your private network when running NetBird on every machine is not feasible.
NetBird Network Routes feature has a High Availability (HA) mode, 
allowing one or more NetBird peers to serve as routing peers for the same private network.

To enable high-available mode, you can click on `Configure` and select a new peer in the `Add additional routing peer` field, then select the distribution groups and click on `Save`.

In the following screenshot, we are adding the peer `aws-nb-europe-router-az-b` to the `aws-eu-central-1-vpc` route:

<p align="center">
    <img src="/docs/img/how-to-guides/netbird-network-routes-create-ha.png" alt="high-level-dia" width="300" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

This way, nodes connected to both peer `aws-nb-europe-router-az-a` and peer `aws-nb-europe-router-az-b` would have a highly available connection with the network `172.31.0.0/16`.

<p align="center">
    <img src="/docs/img/how-to-guides/netbird-network-routes-saved-new-ha.png" alt="high-level-dia" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

:::info
Currently, there is no limitation in the number of routes that form a highly available route. Each connected peer will pick one routing peer to use as the router for a network; this decision is based on metric prioritization and connection attributes like direct or relayed connections.
:::

### Filtering routes distribution with groups
You can select as many distribution groups as you want for your network route. You can update them at the routing peer or high-availability group level. Keep in mind to link them to peers and, if required, to add access control rules ensuring connectivity between these peers and the routing peers of your route
### Routes without masquerading
If you want more transparency and would like to manage your external network routers, you may choose to disable masquerade for your network routes. 
In this case, the routing peer won't hide any NetBird peer  IP and will forward the packets to the target network transparently.

That will require a routing configuration on your external network router pointing your NetBird network back to your routing peer. 
This way, devices that don't have the agent installed can communicate with your NetBird peers.

<p align="center">
    <img src="/docs/img/how-to-guides/netbird-network-routes-masquerading.png" alt="high-level-dia" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

## Get started
<p float="center" >
    <button name="button" className="button-5" onClick={() => window.open("https://netbird.io/pricing")}>Use NetBird</button>
</p>

- Make sure to [star us on GitHub](https://github.com/netbirdio/netbird)
- Follow us [on Twitter](https://twitter.com/netbird)
- Join our [Slack Channel](https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A)
- NetBird [latest release](https://github.com/netbirdio/netbird/releases) on GitHub