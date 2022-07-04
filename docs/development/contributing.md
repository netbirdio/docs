---
id: contributing
<!-- slug: / -->
sidebar_position: 5
---

# Contibuting to Netbird

# TODO
---

* prerequisites 
    * working go env
    * maybe makefile setup
    * contributors guide
    * signing license
* public roadmap
* code guide
* github issue template
* github PR template
* troubleshooting
* link to docs
* guide through code


### To start developing Netbird

**You have a working Go environment**

Clone the project into your preferred path. We recommend just cloning into the GOPATH.

```
mkdir -p $GOPATH/src/github.com/netbirdio
cd $GOPATH/src/github.com/netbirdio
git clone git@github.com:netbirdio/netbird.git
cd netbird
go build ./...
```
**_Sidenote_** 
_`libayatana-appindicator3-dev` might be needed for developing 
the client-ui [ui](https://github.com/netbirdio/netbird/tree/main/client/ui) on debian based distros._

**_Sidenote_** 
_The command won't produce a binary, but only check for working builds.
If you want to produce a binary, you need to `cd` into the specific subproject and use `go build`._

**To run the tests run**

```
go test -exec sudo ./...
```

The tests need to be executed with sudo permissions, as some tests need to create network interfaces.


### The process of developing and contributing to the Netbird project

* **Contributor Guide** (Please start here) to learn about how to contribute to Netbird

* **Public Roadmap** [](https://github.com/netbirdio/netbird/projects/2)

* **GitHub Issues** (/contributors/guide/issue-triage.md): How incoming issues are triaged.

* **Pull Request Process** (/contributors/guide/pull-requests.md): When and why pull requests are closed.

* **Getting Recent Builds** (getting-builds.md): How to get recent builds including the latest builds that pass CI.

* **Automated Tools** (automation.md): Descriptions of the automation that is running on our github repository.

### Support
---
If you need support, join our [slack](https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A) 
or create a [github issue](https://github.com/netbirdio/netbird/issues).

Github Issue `#TODO: create issue template` [template guide](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)


### Code Structure

The codebase is structured in 3 big components:
* Client
* Server
* Signal
* Dashboard (separate [repository](https://github.com/netbirdio/dashboard))

Refer to [architecture documentation](https://netbird.io/docs/overview/architecture) for more information.

---

### CLIENT
The Client consists of three different components.

##### Daemon

```
client/server     # daemon server that runs in the background
client/proto      # grpc daemon server listening to either the CLI or UI for requests
management/client # grpc client that connects to the management server
```
The Daemon runs in the background, and keeps the connection running.

##### CLI 
We use [Cobra](https://github.com/spf13/cobra) as our CLI framework
```
client/cmd          # All CLI commands are defined and implemented here
client/cmd/root.go  # All commands are registered in root.go
```

##### UI-App
We use [systray](https://github.com/getlantern/systray) and [fyne](https://github.com/fyne-io/fyne) to write a UI application for the Systemtray.
```
client/ui       # All UI elements implemented here 
```


---
### MANAGEMENT

```
management/cmd       # These are the CLI commands for starting the management server 
management/proto     # Management proto server for client
management/server    # This is the actual management server, responsible for IDP and managing
```


---
### SIGNAL

```
signal/server       
```


---
### DASHBOARD
The dashboard is written in React.js with typescript and is maintained in a [separate repository](https://github.com/netbirdio/dashboard).

