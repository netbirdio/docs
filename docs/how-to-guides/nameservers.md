---
sidebar_position: 3
---
# Adding DNS servers to your network
NetBird solves a significant network problem by managing and distributing the IP addresses for your peers. You don't need to design networks or configure [DHCP](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol) as it is done in a single place seamlessly. Once IPs are distributed in your network, your peers love them; they can communicate with one another and establish tunnels, and a person with a good memory can memorize and use them to connect to these peers. But let's face it, even though we trust our user's memory capacity, there is a limit to what we can remember; when it starts going above 100 nodes, you will need to look at our dashboard to get IPs for peers you need to access.

For that and many other reasons, [DNS](https://en.wikipedia.org/wiki/Domain_Name_System) was created to give us something easier than numbers to memorize, domain names; these are usually friendly and often mean something related to their purpose, making it much easier to remember them. For instance, an example of the DNS advantages is peer with IP 100.64.185.34, which runs your file storage service, and can easily be accessed using a domain name like files.netbird.cloud.

Having the domain name helps us humans, but we can't avoid that IP because computers still use them to communicate with one another. They do that seamlessly to you; once you issue a domain name in your browser, the computer resolves the name to an IP address by querying a  service called name server. The name server can resolve names to IPs, or they can forward the name queries to other name servers all the way to the top of the DNS hierarchy until it gets an acceptable answer.

You can configure name servers and set distribution groups to control domain name resolution within your NetBird network. To list the use cases for that, you might want a DNS service or resolver are:

- Resolve peer IPs within your network
- Use an internal active directory DNS server
- Use public and distributed servers available on the internet
- User a particular DNS server to resolve a specific domain name

## Concepts
### Local resolver
To minimize the number of changes in your system, NetBird will spin up a local DNS resolver.

This local resolver will be responsible for queries to the domain names of peers registered in your network and forwarding queries to upstream nameservers you configure in the system.

It listens on the peer's IP, and usually, it will use the default port 53, but if it is in use, it will use the 5053 port.
:::info
Custom port support is not builtin into most operating systems. At the time of release, the supported systems are:
- MacOS
- Linux with systemd-resolved
:::
### Nameserver
Nameserver is an upstream DNS server for name resolution, if a query comes and is not a peer domain name, it will be resolved by one of the upstream servers. You can assign private and public IPs and custom ports. Remember that you might need a network route for private addresses to allow peers to connect to it.
### Match domains
Match domains allow you to route queries of names, matching them to specific nameservers. This is useful when you have an internal DNS configuration that only internal servers can resolve.
### All domains option
The all domains option defines a default nameserver configuration to resolve all domains that don't have a match domain setting. Because not all operating systems support match domain configuration, we recommend configuring at least one nameserver set with this option enabled per distribution group. You may also consider using the group All for distribution, so you don't have to define multiple sets of nameservers to resolve all domains.
:::info
A nameserver set may only be configured with either All domains or match domains, you can have both settings in a single configuration as they overlap.
:::
### Distribution groups
Distribution defines that peers that belong to groups set in this field will receive the nameserver configuration.
:::info
When using private nameservers, you may use these groups to link routing peers and clients of the private servers.
:::

## Managing nameserver groups
A nameserver group defines up to 2 nameservers to resolve DNS to a set of peers in distribution groups.
### Creating a nameserver group
Access the `DNS` tab and click the `Add Nameserver` button to create a new nameserver.
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-nameserver-add-button.png" alt="high-level-dia" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>
That will open a nameserver selection configuration screen where you can choose between using 3 predefined public nameservers or using a custom setup:
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-nameserver-selection-view.png" alt="high-level-dia" width="300" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

#### Selecting predefined nameservers
If you choose to go with a predefined public nameserver, you can choose between the following:
- [Google DNS servers](https://developers.google.com/speed/public-dns/docs/using)
- [Cloudflare DNS servers](https://one.one.one.one/dns/)
- [Quad9 DNS servers](https://www.quad9.net/)
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-nameserver-selection-view-open.png" alt="high-level-dia" width="300" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>
After selecting one of the 3 options, you need to assign a group, and you will be done. In the example below, we chose the "All" group:
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-nameserver-all-group.png" alt="high-level-dia" width="300" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>
#### Entering custom nameservers
You can also enter your custom nameserver by clicking in Add custom button. Now you can enter the details of your nameserver. 

In the example below, we are creating a nameserver with the following information:

- Name: `Office resolver`
- Description: `Berlin office resolver`
- Add at least one nameserver: `192.168.0.32` with port `53`
- Match mode: `All domains`
- Distribution group: `Remote developers`
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-nameserver-custom.png" alt="high-level-dia" width="300" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

### Creating a nameserver for specific domains
Sometimes we want to forward DNS queries to specific nameservers but only for particular domains that match a setting. Taking the example from custom nameservers above, you could select a match mode for only domains listed there; below you can see the same nameserver setup but only for `berlinoffice.com` domain:
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-nameserver-remote-resolver.png" alt="high-level-dia" width="300" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

:::info
Currently, only MacOS, Windows 10+, and Linux running systemd-resolved support nameservers without an all domains resolver. For a better experience, we recommend setting at least one all domain resolver to be applied to all groups.
:::

### Distributing the settings with groups
You can select as many distribution groups as you want for your nameserver setup, keep in mind to link them to peers and if required, to access control rules when using private nameservers.
### Adding remote private DNS servers
To add a private DNS server that is running behind routing peers, you need to create resources to ensure communication between your nameserver clients can communicate. In the Berlin office example from previous steps, we have a peer from the `Office network` that can route traffic to the 192.168.0.32 IP, so we need to ensure that a similar network route exists:
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-nameserver-remote-route.png" alt="high-level-dia" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

Then we need to confirm that an access rule exists to connect `Remote developers` to `Office network` group:
<p align="center">
    <img src="/docs/img/how-to-guides/netbird-nameserver-remote-rule.png" alt="high-level-dia" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

## Get started
<p float="center" >
    <button name="button" className="button-5" onClick={() => window.open("https://netbird.io/pricing")}>Use NetBird</button>
</p>

- Make sure to [star us on GitHub](https://github.com/netbirdio/netbird)
- Follow us [on Twitter](https://twitter.com/netbird)
- Join our [Slack Channel](https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A)
- NetBird [latest release](https://github.com/netbirdio/netbird/releases) on GitHub