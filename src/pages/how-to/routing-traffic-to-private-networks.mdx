
# Routing traffic to private networks

<div className="videowrapper">
    <iframe src="https://www.youtube.com/embed/VQuPuBOAknQ" allow="fullscreen;"></iframe>
</div>
<br/><br/>

NetBird provides fast and reliable end-to-end encryption between peers in your network. You can install the agent on every desktop, VM, container, or physical server and have a fast, secure peer-to-peer mesh network. That is the desired configuration, but some cases do not allow for agent installation or can slow down migration from legacy systems:

- Side-by-side migrations where part of your network is already using NetBird but needs to access services that are not.
- Systems that have limited operating system access. e.g., IoT devices, printers, and managed services.
- Legacy networks where an administrator is unable to install the agent on all nodes.

In these cases, you can configure network routes assigning routing peers to connect existing infrastructure. Routing peers will forward packets between your NetBird peers and your other networks; they can masquerade traffic going to your data centers or embedded devices, reducing the need for external route configuration and agent installation.

<p>
    <img src="/docs-static/img/how-to-guides/netbird-network-routes.png" alt="high-level-dia" className="imagewrapper"/>
</p>

<Note>
    If you want to see the Network Routes feature in action, try our managed version at https://app.netbird.io/routes.

    It's free and simple! :)
</Note>

## Concepts
### Network routes
A network route describes the network you want to connect with your NetBird peers. It has an identifier, a network range, a routing peer, and some parameters available for managing priority and masquerading.
<Note>
    Network routes is available for NetBird [v0.9.0](https://github.com/netbirdio/netbird/releases) or later.
</Note>
#### Network identifiers and ranges
Network identifiers are names for each network you want to route traffic from your peers, and ranges are IP ranges declared in CIDR notation which refers to an external network. The combination of identifiers and these ranges makes a single network.
#### Routing peer
A routing peer is a peer that routes packets between your routed network and the other NetBird peers.
<Note>
    Only Linux OS machines can be assigned as routing peers.
</Note>
#### Routing group
A routing group is a set of routing peers. Each will route packets between your routed network and the other NetBird peers.
<Note>
    Only Linux OS machines can be assigned as routing peers.
</Note>
#### High availability routes
A highly available route is a combination of multiple routes with the same network identifier and ranges. They have different routing peers or routing peer groups offering highly available paths for communication between your peers and external networks. 
Nodes connected to routing peers will choose one of them to route packets to external networks based on connection type and defined metrics.
#### Masquerade
Masquerade hides other NetBird network IPs behind the routing peer local address when accessing the target Network range. This option allows access to your private networks without configuring routes on your local routers or other devices.

If you don't enable this option, you must configure a route to your NetBird network in your external network infrastructure.
### Metric and priority
Metric defines prioritization when choosing the main routing peer in a high availability network. Lower metrics have higher priority.

### Distribution groups
Distribution groups define that peers that belong to groups set in this field will receive the network route.
<Note>
    It doesn't remove the need for the routing peer to be connected to these peers
</Note>

## Managing network routes
A network route describes a network you want to connect with your NetBird peers. It has an identifier, a network range, a routing peer or set of peer groups, and some parameters available for managing priority and masquerading.

### Creating a network route
Access the `Network Routes` tab and click the `Add Route` button to create a new route.
That will open a route configuration screen where you can add the information about the network you want to route:
<p>
    <img src="/docs-static/img/how-to-guides/netbird-network-routes-add-button.png" alt="high-level-dia" className="imagewrapper"/>
</p>

Now you can enter the details of your route.
In the example below, we are creating a route with the following information:

- Network identifier: `aws-eu-central-1-vpc`
- Description: `Production VPC in Frankfurt`
- Network range: `172.31.0.0/16`
- Routing peer: `aws-nb-europe-router-az-a`
- Distribution Groups: `All`

<p>
    <img src="/docs-static/img/how-to-guides/netbird-network-routes-create.png" alt="high-level-dia" className="imagewrapper"/>
</p>

Once you fill in the route information, you can click on the `Save` button to save your new route.
<p>
    <img src="/docs-static/img/how-to-guides/netbird-network-routes-saved-new.png" alt="high-level-dia" className="imagewrapper"/>
</p>
Done! Now every peer connected to your routing peer will be able to send traffic to your external network.

### Creating a network route with routing group
You can use a peer group to automatically add any Linux peers from the groups as routing peers. To do so, follow the steps above but select the `Peer group` tab. The peer groups should have Linux peers to route traffic.
If groups have more than one peer, you get the [high availability route](#high-availability-routes) out of the box.

<p>
    <img src="/docs-static/img/how-to-guides/netbird-network-routes-groups-create.png" alt="high-level-dia" className="imagewrapper"/>
</p>

Once you fill in the route information, you can click on the `Save` button to save your new route.

<p>
    <img src="/docs-static/img/how-to-guides/netbird-network-routes-groups-saved-new.png" alt="high-level-dia" className="imagewrapper"/>
</p>

Done! Now every peer connected to the peer member of the groups will be able to send traffic to your external network.

### Creating highly available routes
To avoid a single point of failure when managing your network, we recommend installing NetBird on every resource.
However, you still want to ensure a reliable connection to your private network when running NetBird on every machine is not feasible.
NetBird Network Routes feature has a High Availability (HA) mode,
allowing one or more NetBird peers to serve as routing peers for the same private network.

To highly available routes you have two options:
1. Use a peer group with more than one peer in it. This is covered [above](#creating-a-network-route-with-group-routing).
2. Add more single peers to the route. 

Let's cover the second option here.

To enable high-available mode, click on `Configure` in the table and select a new peer in the `Routing Peer` field, then select the distribution groups and click on `Add Route`.

In the following example, we are adding the peer `aws-nb-europe-router-az-b` to the `aws-eu-central-1-vpc` route:

<p>
    <img src="/docs-static/img/how-to-guides/netbird-network-routes-create-ha.png" alt="high-level-dia" className="imagewrapper"/>
</p>

This way, peers connected to `aws-nb-europe-router-az-a` and `aws-nb-europe-router-az-b` will have highly available access to the `172.31.0.0/16` network.

<p>
    <img src="/docs-static/img/how-to-guides/netbird-network-routes-saved-new-ha.png" alt="high-level-dia" className="imagewrapper"/>
</p>

<Note>
    The number of routes that form a highly available route is unlimited.
    Each connected peer will pick one routing peer to use as the router for a network.
    NetBird agent bases this decision on metric prioritization (lower the metric, higher the priority) and connection attributes like direct or relayed connections.
</Note>

### Apply different routes to peers with group attribution
You can select as many distribution groups as you want for your network route.
Peers that belong to the specified group will use the route automatically to connect to the underlying network.

Remember to link groups to peers that need to access the route and, if required,
add access control rules ensuring connectivity between these peers and the routing peers.

In the following example (see column `Groups`), peers that belong to group `berlin-office` will use `aws-nb-europe-router-az-a` routing peer to access the `aws-eu-central-1-vpc` network. While peers that belong to group `london-office` will use `aws-nb-europe-router-az-b` routing peer.

<p>
    <img src="/docs-static/img/how-to-guides/netbird-network-routes-groups-attribution.png" alt="high-level-dia" className="imagewrapper"/>
</p>

### Routes without masquerading
If you want more transparency and would like to manage your external network routers, you may choose to disable masquerade for your network routes.
In this case, the routing peer won't hide any NetBird peer IP and will forward the packets to the target network transparently.

That will require a routing configuration on your external network router pointing your NetBird network back to your routing peer.
This way, devices that don't have the agent installed can communicate with your NetBird peers.

<p>
    <img src="/docs-static/img/how-to-guides/netbird-network-routes-masquerading.png" alt="high-level-dia" className="imagewrapper"/>
</p>

## Get started
<p float="center" >
    <Button name="button" className="button-5" onClick={() => window.open("https://netbird.io/pricing")}>Use NetBird</Button>
</p>

- Make sure to [star us on GitHub](https://github.com/netbirdio/netbird)
- Follow us [on Twitter](https://twitter.com/netbird)
- Join our [Slack Channel](https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A)
- NetBird [latest release](https://github.com/netbirdio/netbird/releases) on GitHub
