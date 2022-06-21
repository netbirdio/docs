---
sidebar_position: 1
title: Quickstart Guide
---

Step-by-step video guide on YouTube:

<div class="videowrapper">
<iframe src="https://www.youtube.com/embed/Tu9tPsUWaY0" allow="fullscreen;"></iframe>
</div>
<br/>
This guide describes how to quickly get started with NetBird and create a secure private network with 2 connected machines.

One machine is a Linux laptop, and the other one a EC2 node running on AWS.
Both machines are running Linux but NetBird also works on Windows and MacOS.

1. Sign-up at [https://app.netbird.io/](https://app.netbird.io/)

   You can use your Google, GitHub or Microsoft account.

   ![](/img/getting-started/auth.png)

2. After a successful login you will be redirected to the ```Peers``` screen which is empty because you don't have any peers yet.

   Click ```Add peer``` to add a new machine.

   ![](/img/getting-started/empty-peers.png)

3. Choose your machine operating system (in our case it is ```Linux```) and proceed with the installation steps.

   ![](/img/getting-started/add-peer.png)

4. If you installed NetBird Desktop UI you can use it to connect to the network instead of running `netbird up` command. Look for `NetBird` in your application list, run it, and click `Connect`.
   >

   ![](/img/getting-started/systray.png)

5. At this point a browser window pops up starting a device registration process. Click confirm and follow the steps if required.

   ![](/img/getting-started/device-confirmation.png)

6. On the EC2 node repeat the installation steps and run `netbird up` command.  

   ```bash
   sudo netbird up
   ```
7. Copy the verification URL from the terminal output and paste it in your browser. Repeat step #5

   ![](/img/getting-started/netbird-up.png)

8. Return to ```Peers``` and you should notice 2 new machines with status ```online```

   ![](/img/getting-started/peers.png)

9. To test the connection you could try pinging devices:

   On your laptop:
   ```bash
   ping 100.64.0.2
   ```

    On the EC2 node:
    ```bash
   ping 100.64.0.1
   ```
10. Done! You now have a secure peer-to-peer private network configured.

<br/>

- Make sure to [star us on GitHub](https://github.com/netbirdio/netbird)
- Follow us [on Twitter](https://twitter.com/netbird)
- Join our [Slack Channel](https://join.slack.com/t/wiretrustee/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A)
- NetBird release page on GitHub: [releases](https://github.com/netbirdio/netbird/releases/latest)


