---
sidebar_position: 3
---

# Setup Keys

Setup key is a pre-authentication key that allows to register new machines in your network. 
It simply associates a machine with an account on a first run.

The setup key can be provided as a parameter to the ```netbird up``` command. 
This makes it possible to run automated deployments with infrastructure-as-code software like Ansible, Cloudformation or Terraform.

```bash
sudo netbird up --setup-key <SETUP KEY>
```

### Types of Setup Keys

There are 2 types of setup keys:
* **One-off key**. This type of key can be used only once to authenticate a machine.
* **Reusable key**. This type of key can be used multiple times to authenticate machines.

### Using Setup Keys

Setup keys are available in the NetBird Management dashboard under the Setup Keys tab [https://app.netbird.io/setup-keys](https://app.netbird.io/setup-keys).

By default, we generate 2 setup keys right after account creation. You can easily add new or revoke keys.

![](/img/architecture/setup-keys.png)

:::tip revoking a key
When revoking a key, all machines authenticated with this key will remain connected in the network. The same logic applies when the key expires.
:::
### Expiration

Setup keys are set to expire after 30 days. When expired, the setup key can't be used anymore.

### Peer Auto-grouping

<p align="center">
    <img src="/docs/img/architecture/peer-auto-tagging-setupkey.gif" alt="high-level-dia" width="800" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>

NetBird offers a powerful [Access Control feature](/overview/acls) that allows easy access management of your resources. 
In a basic scenario, you would create multiple groups of peers and create access rules to define what groups can access each other. 
Adding peers to groups might become time-consuming in large networks with dozens of machines.

Starting NetBird [v0.9.2](https://github.com/netbirdio/netbird/releases), when creating or updating a setup key, 
it is possible to specify a list of auto-assign groups. Every peer registered with this key will be automatically added 
to these groups. All the access control rules enabled for these groups will apply automatically.

To add `Auto-assign groups`, open the `Setup Keys` tab and create or update any existing setup key.

<p align="center">
    <img src="/docs/img/architecture/netbird-peer-auto-tagging-newkey.png" alt="high-level-dia" width="600" style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />
</p>
