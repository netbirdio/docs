# The NetBird documentation

This repository contains assets required to build the [documentation website for NetBird](https://netbird.io/docs/). It is built using [Next.js](https://nextjs.org/) with MDX support, a modern React framework for building static and dynamic websites.

We're glad that you want to contribute!

- [Contributing to the docs](#contributing-to-the-docs)

### Requirements
* node 16
* npm 8+

### Installation

```
$ npm install
```

### Local Development

```
$ npm run dev
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Contributing to the docs

You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called a _fork_. Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

Once your pull request is created, a NetBird reviewer will take responsibility for providing clear, actionable feedback. As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the NetBird reviewer.**

Also, note that you may end up having more than one NetBird reviewer provide you feedback or you may end up getting feedback from a NetBird reviewer that is different than the one initially assigned to provide you feedback.

Furthermore, in some cases, one of your reviewers might ask for a technical review from a NetBird author when needed. Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.

## Code of conduct

Participation in the NetBird community is governed by the [NetBirds' Code of Conduct](https://github.com/netbirdio/netbird/blob/main/CODE_OF_CONDUCT.md).

## Components and Use

This documentation uses several custom MDX components. Here's a guide to the most commonly used components:

### Alert Components

Use these components to highlight important information:

#### Note
Displays informational content with an orange theme:

```mdx
import {Note} from "@/components/mdx"

<Note>
    NetBird is an **[open-source](https://github.com/netbirdio/netbird)** project and can be self-hosted.
    See a comparison between the self-hosted and cloud-hosted versions [here](/selfhosted/self-hosted-vs-cloud-netbird).
</Note>
```

#### Warning
Displays warning content with a red theme:

```mdx
import {Warning} from "@/components/mdx"

<Warning>
    The API is still in Beta state so some errors might not be handled properly yet.
</Warning>
```

#### Success
Displays success messages with a green theme:

```mdx
import {Success} from "@/components/mdx"

<Success>
    Your configuration has been successfully applied.
</Success>
```

### Tiles Component

Displays a grid of clickable cards with hover effects. Perfect for listing related resources or guides:

```mdx
import {Tiles} from "@/components/Tiles"

<Tiles 
  title="About NetBird" 
  id="about-netbird" 
  items={[
    {
      href: '/about-netbird/how-netbird-works',
      name: 'How NetBird Works',
      description: 'Learn about NetBird concepts, architecture, protocols, and how it creates secure networks.',
    },
    {
      href: '/about-netbird/netbird-vs-traditional-vpn',
      name: 'NetBird vs. Traditional VPN',
      description: 'Discover how NetBird compares to traditional VPNs and understand the advantages of Zero Trust networking.',
    },
  ]} 
/>
```

**Props:**
- `title` (string, required): The heading title for the tiles section
- `id` (string, optional): Optional id for the heading anchor
- `items` (array, required): Array of objects with `href`, `name`, and `description`
- `buttonText` (string, optional): Button text (defaults to "Read more" - currently unused as cards are fully clickable)

### YouTube Component

Embeds YouTube videos with customizable parameters:

```mdx
import {YouTube} from "@/components/YouTube"

<YouTube videoId="CFa7SY4Up9k" />

// With custom parameters
<YouTube 
  videoId="CFa7SY4Up9k" 
  title="Video Title"
  start={175}
  color="white"
  modestbranding={1}
  rel={1}
/>

// Or use a URL instead of videoId
<YouTube url="https://www.youtube.com/watch?v=CFa7SY4Up9k" />
```

**Props:**
- `videoId` (string): YouTube video ID
- `url` (string): YouTube URL (alternative to videoId)
- `title` (string, optional): Video title
- `start` (number, optional): Start time in seconds
- `color` (string, optional): Progress bar color - `'white'` or `'red'` (default: `'white'`)
- `modestbranding` (number, optional): Reduces YouTube branding - `0` or `1` (default: `1`)
- `controls` (number, optional): Show/hide controls - `0`, `1`, or `2` (default: `1`)
- `rel` (number, optional): Show related videos - `0` or `1` (default: `1`)

### Button Component

Creates styled buttons with multiple variants:

```mdx
import {Button} from "@/components/Button"

// Primary button (default)
<Button href="https://app.netbird.io/install" arrow="right">
  Get started
</Button>

// Secondary button
<Button href="/path" variant="secondary">
  Learn more
</Button>

// Outline button
<Button href="/path" variant="outline">
  Explore
</Button>

// Text button
<Button href="/path" variant="text" arrow="right">
  Read more
</Button>

// With left arrow
<Button href="/path" arrow="left">
  Back
</Button>
```

**Props:**
- `variant` (string, optional): Button style - `'primary'`, `'secondary'`, `'filled'`, `'outline'`, or `'text'` (default: `'primary'`)
- `href` (string, optional): Link URL (creates a link if provided, otherwise renders as button)
- `arrow` (string, optional): Arrow icon - `'left'` or `'right'`
- `children` (required): Button text content

### Other Common Components

#### Row and Col
Create two-column layouts:

```mdx
import {Row, Col} from "@/components/mdx"

<Row>
  <Col>
    Left column content
  </Col>
  <Col sticky>
    Right column content (sticky on scroll)
  </Col>
</Row>
```

#### Properties and Property
Define API properties or configuration options:

```mdx
import {Properties, Property} from "@/components/mdx"

<Properties>
  <Property name="apiKey" type="string" required>
    Your API key for authentication.
  </Property>
  <Property name="timeout" type="number" min={0} max={300}>
    Request timeout in seconds (default: 30).
  </Property>
</Properties>
```

#### Badge
Displays small status badges:

```mdx
import {Badge} from "@/components/mdx"

<Badge>New</Badge>
<Badge variant="secondary">Beta</Badge>
```

#### Code Blocks
Code syntax highlighting (automatically available):

```mdx
\`\`\`bash
npm install
npm run dev
\`\`\`

// Or use code groups for multiple languages
<CodeGroup>
  ```bash title="Installation"
  npm install
  ```
  ```yarn title="Installation"
  yarn install
  ```
</CodeGroup>
```

## Thank you

NetBird thrives on community participation, and we appreciate your contributions to our website and our documentation!