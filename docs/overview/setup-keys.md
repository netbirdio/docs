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
