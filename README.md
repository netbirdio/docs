# The NetBird documentation

This repository builds [docs.netbird.io](https://docs.netbird.io/) with Next.js and MDX.

## Work on the docs locally

Use Node.js 20.9 or newer. Install the versions pinned in `package-lock.json`:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Before opening a pull request, run the checks used by docs CI:

```bash
npm run lint:mdx
npm run build
```

CI also runs Codespell. If you change JSX, JavaScript, navigation, or a component, run `npm run lint` and make sure your change introduces no new findings.

## Contributing to the docs

Fork the repository and create a focused branch from the current `main` branch. Keep the pull request limited to one problem, explain how you verified the change, and include screenshots for layout or interaction changes.

For the full workflow, start with [Contribute to NetBird](src/pages/contribute/index.mdx). The guide also covers the [repository map](src/pages/contribute/repositories.mdx), [local development and test safety](src/pages/contribute/development.mdx), [pull request review](src/pages/contribute/pull-requests.mdx), and [security and contribution policies](src/pages/contribute/policies.mdx).

## Code of conduct

Participation in the NetBird community is governed by the [NetBird Code of Conduct](https://github.com/netbirdio/netbird/blob/main/CODE_OF_CONDUCT.md).

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
    Compare the [self-hosted and cloud-hosted versions](/about-netbird/self-hosted-vs-cloud).
</Note>
```

#### Warning
Displays warning content with a red theme:

```mdx
import {Warning} from "@/components/mdx"

<Warning>
    Do not include setup keys, tokens, or unredacted logs in a public issue.
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

<Badge status="info" text="New" />
<Badge status="experimental" text="Beta" hoverText="This feature may change." />
```

`status` accepts `default`, `info`, or `experimental`. Set the visible label with `text`; use `hoverText` only when the badge needs a short explanation.

#### Code Blocks
Code syntax highlighting (automatically available):

````mdx
```bash
npm install
npm run dev
```

// Or use code groups for multiple languages
<CodeGroup>
  ```bash title="Installation"
  npm install
  ```
  ```yarn title="Installation"
  yarn install
  ```
</CodeGroup>
````

## Thank you

NetBird thrives on community participation, and we appreciate your contributions to our website and our documentation!