# n8n-nodes-mixpost

[![npm version](https://img.shields.io/npm/v/n8n-nodes-mixpost.svg)](https://www.npmjs.com/package/n8n-nodes-mixpost)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is an n8n community node that lets you use [Mixpost](https://github.com/inovector/mixpost) in your n8n workflows.

Mixpost is a self-hosted social media management platform. This node allows you to automate social media posting, manage media, and control your social accounts through n8n's powerful workflow automation.

## Requirements

Before installing this n8n node, you need to have Mixpost installed and configured:

### Mixpost Installation

This node requires a working Mixpost installation with the REST API enabled. Choose one of the following:

#### Option 1: Mixpost (Official)
Install the official Mixpost application:
- **Repository**: https://github.com/inovector/mixpost
- **Documentation**: Follow the installation instructions in the repository
- **Requirements**: PHP, Laravel, Database (MySQL/PostgreSQL)

#### Option 2: Mixpost REST API Add-on
If you already have Mixpost installed, add the REST API capability:
- **Repository**: https://github.com/btafoya/mixpost-api
- **Installation**: Composer package for existing Mixpost installations
- **Purpose**: Adds REST API endpoints required by this n8n node

**Note**: The Mixpost REST API Add-on is required for this n8n integration to function. Ensure your Mixpost instance has API access enabled and you have generated an access token.

## Installation

### Method 1: Community Nodes (Recommended)

Install directly from n8n:

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-mixpost`
4. Agree to the risks and install

[Learn about community nodes](https://docs.n8n.io/integrations/community-nodes/installation/)

### Method 2: Manual Installation

Install via npm:

```bash
npm install n8n-nodes-mixpost
```

### Method 3: Local Development

For local testing and development:

```bash
# Clone the repository
git clone https://github.com/btafoya/n8n-nodes-mixpost.git
cd n8n-nodes-mixpost

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
npm link
cd $(npm root -g)/n8n
npm link n8n-nodes-mixpost --legacy-peer-deps

# Restart n8n
```

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed development setup instructions.

## Configuration

### Obtaining Access Token

1. Log into your Mixpost instance
2. Navigate to **Settings → API Tokens**
3. Click **Generate New Token**
4. Copy the token (you'll need this for n8n credentials)

### Setting up Credentials in n8n

1. In n8n, create new credentials for **Mixpost API**
2. Enter your credentials:
   - **Base URL**: Your Mixpost instance URL (e.g., `https://mixpost.example.com`)
   - **API Path**: Leave default `/api/mixpost` (unless using custom installation)
   - **Access Token**: Paste the token from Mixpost

## Features

### Posts
- **Create**: Create new social media posts with scheduling
- **List**: Retrieve posts with filtering options
- **Get**: Get details of a specific post
- **Update**: Modify existing posts
- **Delete**: Remove posts
- **Publish**: Immediately publish scheduled or draft posts

### Media
- **Upload**: Upload media files from workflow
- **Download from URL**: Import media from external URLs
- **List**: Browse media library

### Accounts
- **List**: Retrieve all connected social media accounts

## Usage Examples

### Example 1: Create and Schedule a Post

Create a scheduled social media post:

```
1. Add Mixpost node to your workflow
2. Select Resource: Posts
3. Select Operation: Create
4. Set Content: "Your post content here"
5. Select Accounts: Choose one or more connected social accounts
6. Set Schedule Time: (Optional) Choose when to publish
7. Set Status: Draft or Scheduled
```

### Example 2: Automated Content from RSS

Automatically post new RSS feed items to social media:

```
1. RSS Read node → Fetch latest articles
2. Mixpost node → Create post with article title and link
3. Set to publish immediately or schedule for later
```

### Example 3: Upload Media and Create Post

Download an image and attach it to a post:

```
1. HTTP Request node → Download image (Response Format: File)
2. Mixpost node → Upload media (Binary Property: data)
3. Mixpost node → Create post with media ID from step 2
```

### Example 4: Bulk Post Management

List and manage multiple posts:

```
1. Mixpost node → List Posts (with filters)
2. IF node → Check post status
3. Mixpost node → Update or Delete based on conditions
```

### Example 5: Multi-Platform Publishing

Post to multiple social platforms with one workflow:

```
1. Create content node (Manual Trigger, Webhook, etc.)
2. Mixpost node → Create post
3. Select multiple accounts (Facebook, Twitter, LinkedIn, etc.)
4. Set Status: Scheduled (posts go to all selected platforms)
```

## Supported Platforms

Mixpost supports posting to:
- Facebook (Pages & Groups)
- Twitter/X
- Instagram
- LinkedIn (Personal & Company Pages)
- Pinterest
- YouTube
- Mastodon
- TikTok

*Availability depends on your Mixpost instance configuration*

## Version Compatibility

| n8n-nodes-mixpost | n8n    | Mixpost API |
|-------------------|--------|-------------|
| 1.x               | >=1.0  | 1.x         |

## Development

This is a community-maintained project. Contributions are welcome!

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm run build`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Submit a pull request

### Development Setup

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for complete development setup instructions.

### Building

```bash
npm run build    # Build the project
npm run dev      # Watch mode for development
```

## Troubleshooting

### Node doesn't appear in n8n
- Verify the package is installed: `npm list n8n-nodes-mixpost`
- Restart n8n completely
- Check n8n logs for errors

### Credential test fails
- Verify your Mixpost instance is accessible
- Check that the API token is valid and not expired
- Test the API directly with curl:
  ```bash
  curl -H "Authorization: Bearer YOUR_TOKEN" \
       https://your-mixpost.com/api/mixpost/accounts
  ```

### Posts not publishing
- Check post status in Mixpost dashboard
- Verify social accounts are properly connected in Mixpost
- Check scheduled time is in the future

## Support

- **Issues**: [GitHub Issues](https://github.com/btafoya/n8n-nodes-mixpost/issues)
- **Discussions**: [GitHub Discussions](https://github.com/btafoya/n8n-nodes-mixpost/discussions)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)

## License

[MIT](LICENSE)

## Resources

- [Mixpost](https://github.com/inovector/mixpost) - Official Mixpost repository
- [Mixpost API Documentation](https://github.com/btafoya/mixpost-api) - REST API add-on
- [n8n Documentation](https://docs.n8n.io) - Learn about n8n
- [Community Nodes](https://docs.n8n.io/integrations/community-nodes/) - n8n community nodes guide

## Acknowledgments

This node is built for the n8n community and Mixpost users who want to automate their social media workflows.

Special thanks to:
- The [n8n team](https://n8n.io) for the excellent workflow automation platform
- The [Mixpost team](https://github.com/inovector/mixpost) for the powerful social media management tool
