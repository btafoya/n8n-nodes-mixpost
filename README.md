# n8n-nodes-mixpost

n8n community node for Mixpost social media management API.

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

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-mixpost`
4. Agree to the risks and install

### Manual Installation

```bash
npm install n8n-nodes-mixpost
```

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

### Create and Schedule a Post

```
1. Add Mixpost node
2. Select Resource: Post
3. Select Operation: Create
4. Enter content
5. Select social accounts
6. (Optional) Add media
7. (Optional) Set schedule time
```

### Upload Media and Attach to Post

```
1. HTTP Request node → Download image
2. Mixpost node → Upload media
3. Mixpost node → Create post with media ID from step 2
```

## Development

This is a community-maintained project. Contributions are welcome!

### Repository
https://github.com/btafoya/n8n-nodes-mixpost

### Issues
https://github.com/btafoya/n8n-nodes-mixpost/issues

## License

MIT

## Resources

- [Mixpost API Documentation](https://github.com/btafoya/mixpost-api)
- [n8n Documentation](https://docs.n8n.io)
- [Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
