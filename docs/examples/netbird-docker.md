---
sidebar_position: 2
---

# NetBird Client in Docker

One of the simplest ways of running NetBird client application is to use a pre-built [Docker image](https://hub.docker.com/r/netbirdio/netbird).

**Prerequisites:**
* **Docker installed.** 
   If you don't have docker installed, please refer to the installation guide on the official [Docker website](https://docs.docker.com/get-docker/).
* **NetBird account.** 
   Register one at [app.netbird.io](https://app.netbird.io/).

You would need to obtain a [setup key](/overview/setup-keys) to associate NetBird client with your account.

The setup key could be found in the NetBird Management dashboard under the Setup Keys tab - [https://app.netbird.io/setup-keys](https://app.netbird.io/setup-keys).

Set the ```NB_SETUP_KEY``` environment variable and run the command. 

```bash
docker run --rm --name PEER_NAME --hostname PEER_NAME --cap-add=NET_ADMIN --device=/dev/net/tun -d -e NB_SETUP_KEY=<SETUP KEY> -v netbird-client:/etc/netbird netbirdio/netbird:latest
```

That is it! Enjoy using NetBird.

If you would like to learn how to run NetBird Client as an ECS agent on AWS, please refer to [this guide](/examples/aws-ecs-client-daemon).
