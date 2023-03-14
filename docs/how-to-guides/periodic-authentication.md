---
sidebar_position: 4
---
# Configure periodic user authentication

To ensure a high level of security, NetBird offers a peer login expiration feature that requires users to periodically reauthenticate their devices.
Every new network has this feature enabled, and the expiration period is set to 24 hours by default. You can disable this feature and configure the expiration period in the account settings in the web UI https://app.netbird.io/settings.

:::tip
This feature is only applied to peers added with the interactive SSO login feature. Peers, added with a setup key, won't be affected.
:::
### Disabling expiration
Login expiration can be disabled globally for the whole network or individually for each peer.

Go to the Web UI Settings tab to disable expiration globally and use the switch under the Authentication section. 
You can configure the expiration period in the same section.

<p align="center">
    <img src="/docs/img/how-to-guides/peer-login-expiration.png" alt="peer-login-expiration" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

### Disabling expiration individually per peer
You can disable login expiration per peer without disabling expiration globally.
In the Peers tab of the web UI click on the peer you want to disable expiration for and use the Login Expiration switch.
Peers with expiration disabled will be marked with a corresponding label in the peers' table.

<p align="center">
    <img src="/docs/img/how-to-guides/individual-peer-login-expiration.png" alt="peer-login-expiration" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

## Get started
<p float="center" >
    <button name="button" className="button-5" onClick={() => window.open("https://netbird.io/pricing")}>Use NetBird</button>
</p>

- Make sure to [star us on GitHub](https://github.com/netbirdio/netbird)
- Follow us [on Twitter](https://twitter.com/netbird)
- Join our [Slack Channel](https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A)
- NetBird [latest release](https://github.com/netbirdio/netbird/releases) on GitHub