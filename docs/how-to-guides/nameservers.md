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
### Distribution groups
Distribution defines that peers that belong to groups set in this field will receive the nameserver configuration.
:::info
When using private nameservers, you may use these groups to link routing peers and clients of the private servers.
:::

## Managing nameserver groups

### Creating a nameserver group

### Creating a nameserver for specific domains

### Distributing the settings with groups

### Adding  the settings with groups

## Get started
<p float="center" >
    <button name="button" className="button-5" onClick={() => window.open("https://netbird.io/pricing")}>Use NetBird</button>
</p>

- Make sure to [star us on GitHub](https://github.com/netbirdio/netbird)
- Follow us [on Twitter](https://twitter.com/netbird)
- Join our [Slack Channel](https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A)
- NetBird [latest release](https://github.com/netbirdio/netbird/releases) on GitHub