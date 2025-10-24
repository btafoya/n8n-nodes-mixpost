# Mixpost n8n Community Node - Technical Specification

**Version**: 1.0.0-MVP
**Date**: 2025-10-24
**Status**: Specification Complete - Ready for Implementation

---

## Executive Summary

### Project Overview
Development of a comprehensive n8n community node integrating the Mixpost social media management API, targeting team/agency workflows with multi-client social media automation capabilities.

### Primary Goals
- Enable automated post creation, scheduling, and publishing workflows
- Support media management and upload automation
- Provide social account administration capabilities
- Deliver production-ready solution for team/agency environments
- Establish foundation for community-driven development and enhancement

### Key Requirements Met
✅ Single multi-operation node with resource-based operations
✅ Static token authentication with flexible URL configuration
✅ Core operations focus (Posts CRUD + Media + Accounts list) for MVP
✅ Programmatic implementation for UX flexibility
✅ Production-safe testing approach
✅ Community distribution with active maintenance

---

## Architecture Overview

### Node Structure

#### Single Multi-Operation Node Design
```
Mixpost Node
├── Resource Selection: Posts | Media | Accounts
└── Operation Selection (dynamic based on resource)
    ├── Posts: Create | List | Get | Update | Delete | Publish
    ├── Media: Upload | Download from URL | List
    └── Accounts: List (read-only for MVP)
```

#### File Structure
```
n8n-nodes-mixpost/
├── credentials/
│   └── MixpostApi.credentials.ts         # Authentication configuration
├── nodes/
│   └── Mixpost/
│       ├── Mixpost.node.ts               # Main node implementation
│       ├── Mixpost.node.json             # Node metadata & icon
│       ├── GenericFunctions.ts           # API client & helpers
│       ├── descriptions/                 # Operation field definitions
│       │   ├── PostDescription.ts
│       │   ├── MediaDescription.ts
│       │   └── AccountDescription.ts
│       └── types/                        # TypeScript interfaces
│           ├── MixpostApi.types.ts
│           └── NodeOperations.types.ts
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE (MIT)
```

### Technology Stack
- **Language**: TypeScript
- **Framework**: n8n INodeType (programmatic style)
- **HTTP Client**: axios
- **Build Tool**: n8n-node-dev
- **Testing**: Manual testing against production Mixpost instance
- **Distribution**: npm package

---

## Implementation Recommendation: Programmatic Approach

### Rationale
Based on requirement analysis, **programmatic implementation** is recommended over declarative:

**Key Drivers**:
1. **Complex UX Requirements**: Need for both simple and advanced modes with toggle
2. **Flexible Scheduling**: Support for datetime picker, relative scheduling, and bulk patterns
3. **Conditional Media Handling**: Both binary data and URL download methods
4. **Team/Agency Focus**: Polished, production-grade error handling and validation
5. **Future Extensibility**: Easier to add advanced features (post versions, analytics, triggers)

**MVP Scope**:
- Start with simple mode and datetime scheduling
- Implement both media input methods from the start
- Foundation enables incremental complexity addition in Phase 2+

---

## Credential Configuration

### MixpostApi Credentials

#### Fields
```typescript
{
  name: 'MixpostApi',
  displayName: 'Mixpost API',
  properties: [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-mixpost-instance.com',
      description: 'The base URL of your Mixpost installation',
      required: true
    },
    {
      displayName: 'API Path',
      name: 'apiPath',
      type: 'string',
      default: '/api/mixpost',
      description: 'API endpoint path (default: /api/mixpost)',
      required: false
    },
    {
      displayName: 'Access Token',
      name: 'accessToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Personal access token from Mixpost',
      required: true
    }
  ]
}
```

#### Token Generation Instructions
Users generate tokens via Mixpost UI or API:
```bash
POST {baseUrl}/api/mixpost/auth/tokens
{
  "email": "user@example.com",
  "password": "password",
  "device_name": "n8n-integration"
}
```

#### Connection Testing
Validate credentials with lightweight API call:
```typescript
async testConnection(): Promise<boolean> {
  const response = await this.makeRequest('GET', '/accounts');
  return response.status === 200;
}
```

---

## MVP Operations Specification

### Posts Resource

#### 1. Create Post
**Operation**: `posts.create`
**Method**: `POST /posts`
**Use Case**: Create new social media post with scheduling

**Fields**:
```typescript
{
  content: string;                    // Post text content
  accounts: number[];                 // Social account IDs (from List Accounts)
  media?: number[];                   // Media IDs (from Upload Media)
  scheduled_at?: string;              // ISO 8601 datetime (optional)
  status: 'draft' | 'scheduled';      // Post status
}
```

**UI Configuration**:
- Content: Multi-line text area
- Accounts: Multi-select dropdown (populated via GET /accounts)
- Media: Multi-select dropdown (populated via List Media or Upload output)
- Schedule: DateTime picker (optional)
- Status: Dropdown (draft/scheduled)

**Validation**:
- Content required, max length per Mixpost limits
- At least one account selected
- Valid ISO 8601 datetime if scheduled
- Media IDs must exist (optional pre-validation)

**Output**: Created post object with ID

---

#### 2. List Posts
**Operation**: `posts.list`
**Method**: `GET /posts`
**Use Case**: Retrieve posts with filtering for workflow conditionals

**Fields**:
```typescript
{
  filters?: {
    status?: 'draft' | 'scheduled' | 'published' | 'failed';
    tag_id?: number;
    account_id?: number;
    date_from?: string;               // ISO 8601 date
    date_to?: string;                 // ISO 8601 date
  };
  pagination?: {
    page?: number;
    per_page?: number;                // Default: 15
  };
}
```

**UI Configuration**:
- All filters optional with toggle to show/hide
- Status: Dropdown
- Tag: Dropdown (if tags are pre-loaded)
- Account: Dropdown (from List Accounts)
- Date range: Date pickers
- Pagination: Number inputs

**Output**: Array of post objects with pagination metadata

---

#### 3. Get Post
**Operation**: `posts.get`
**Method**: `GET /posts/{id}`
**Use Case**: Retrieve single post details for update workflows

**Fields**:
```typescript
{
  post_id: number;                    // Post ID to retrieve
}
```

**UI Configuration**:
- Post ID: Expression input (from previous node or manual)

**Output**: Single post object with full details

---

#### 4. Update Post
**Operation**: `posts.update`
**Method**: `PUT /posts/{id}`
**Use Case**: Modify existing post content, schedule, or accounts

**Fields**:
```typescript
{
  post_id: number;                    // Post ID to update
  content?: string;                   // Updated content
  accounts?: number[];                // Updated account list
  media?: number[];                   // Updated media attachments
  scheduled_at?: string;              // Updated schedule time
  status?: 'draft' | 'scheduled';     // Updated status
}
```

**UI Configuration**:
- Post ID: Expression input
- All update fields optional (only send changed fields)
- Same UI components as Create Post

**Output**: Updated post object

---

#### 5. Delete Post
**Operation**: `posts.delete`
**Method**: `DELETE /posts/{id}`
**Use Case**: Remove post from Mixpost

**Fields**:
```typescript
{
  post_id: number;                    // Post ID to delete
}
```

**UI Configuration**:
- Post ID: Expression input
- Confirmation warning in UI

**Output**: Success confirmation

---

#### 6. Publish Post
**Operation**: `posts.publish`
**Method**: `POST /posts/{id}/publish`
**Use Case**: Immediately publish scheduled/draft post

**Fields**:
```typescript
{
  post_id: number;                    // Post ID to publish
}
```

**UI Configuration**:
- Post ID: Expression input
- Warning about immediate publishing

**Output**: Published post object with timestamps

---

### Media Resource

#### 1. Upload Media
**Operation**: `media.upload`
**Method**: `POST /media/upload`
**Use Case**: Upload image/video from workflow for post attachments

**Fields**:
```typescript
{
  media: {
    type: 'binary';                   // n8n binary data
    property: string;                 // Binary property name
  }
}
```

**UI Configuration**:
- Binary property: Dropdown of available binary data from previous nodes
- File type validation (image/video per Mixpost limits)

**Output**: Media object with ID for use in post creation

---

#### 2. Download from URL
**Operation**: `media.downloadUrl`
**Method**: `POST /media/download`
**Use Case**: Import media from external URLs for post attachments

**Fields**:
```typescript
{
  url: string;                        // Media file URL
}
```

**UI Configuration**:
- URL: Text input with expression support
- Format validation (must be accessible URL)

**Output**: Media object with ID for use in post creation

---

#### 3. List Media
**Operation**: `media.list`
**Method**: `GET /media`
**Use Case**: Retrieve media library for selection in posts

**Fields**:
```typescript
{
  pagination?: {
    page?: number;
    per_page?: number;                // Default: 15
  };
}
```

**UI Configuration**:
- Pagination controls

**Output**: Array of media objects with IDs and metadata

---

### Accounts Resource

#### 1. List Accounts
**Operation**: `accounts.list`
**Method**: `GET /accounts`
**Use Case**: Populate account selection dropdowns in post operations

**Fields**: None (returns all connected social accounts)

**Output**: Array of account objects with IDs, names, and platform types

**Note**: MVP implements read-only. Update/Delete deferred to Phase 3.

---

## API Integration Layer

### GenericFunctions.ts

#### HTTP Client Configuration
```typescript
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';

export async function mixpostApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: string,
  endpoint: string,
  body: any = {},
  qs: any = {},
): Promise<any> {
  const credentials = await this.getCredentials('mixpostApi');

  const baseUrl = credentials.baseUrl as string;
  const apiPath = (credentials.apiPath as string) || '/api/mixpost';
  const token = credentials.accessToken as string;

  const url = `${baseUrl}${apiPath}${endpoint}`;

  const options: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    params: qs,
    data: body,
  };

  try {
    const response: AxiosResponse = await axios(options);
    return response.data;
  } catch (error) {
    throw new Error(`Mixpost API Error: ${error.response?.data?.message || error.message}`);
  }
}
```

#### Pagination Helper
```typescript
export async function mixpostApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: string,
  endpoint: string,
  body: any = {},
  qs: any = {},
): Promise<any[]> {
  const returnData: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await mixpostApiRequest.call(this, method, endpoint, body, {
      ...qs,
      page,
      per_page: 50,
    });

    returnData.push(...response.data);

    if (response.meta && response.meta.current_page >= response.meta.last_page) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return returnData;
}
```

#### Media Upload Handler
```typescript
export async function uploadMedia(
  this: IExecuteFunctions,
  binaryPropertyName: string,
  itemIndex: number,
): Promise<any> {
  const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
  const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

  const formData = new FormData();
  formData.append('file', buffer, binaryData.fileName);

  const credentials = await this.getCredentials('mixpostApi');
  const baseUrl = credentials.baseUrl as string;
  const apiPath = (credentials.apiPath as string) || '/api/mixpost';
  const token = credentials.accessToken as string;

  const response = await axios.post(
    `${baseUrl}${apiPath}/media/upload`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders(),
      },
    },
  );

  return response.data;
}
```

---

## Error Handling Strategy

### Error Types & Responses

#### 1. Authentication Errors (401)
```typescript
{
  message: 'Invalid or expired access token',
  suggestion: 'Please verify your Mixpost API credentials and regenerate token if needed'
}
```

#### 2. Validation Errors (422)
```typescript
{
  message: 'Validation failed',
  errors: {
    content: ['The content field is required'],
    accounts: ['At least one account must be selected']
  }
}
```

#### 3. Rate Limiting (429)
```typescript
{
  message: 'Rate limit exceeded',
  retry_after: 60,
  suggestion: 'Wait 60 seconds before retrying or reduce request frequency'
}
```

#### 4. Resource Not Found (404)
```typescript
{
  message: 'Post not found',
  post_id: 123,
  suggestion: 'Verify the post ID exists in Mixpost'
}
```

#### 5. Server Errors (500)
```typescript
{
  message: 'Mixpost server error',
  suggestion: 'Contact Mixpost administrator or check server logs'
}
```

### Error Handling Implementation
```typescript
try {
  const response = await mixpostApiRequest.call(this, method, endpoint, body, qs);
  return response;
} catch (error) {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    let message = `Mixpost API Error (${status}): `;

    switch (status) {
      case 401:
        message += 'Invalid or expired access token. Please check credentials.';
        break;
      case 422:
        message += 'Validation failed: ' + JSON.stringify(data.errors);
        break;
      case 429:
        message += `Rate limit exceeded. Retry after ${data.retry_after} seconds.`;
        break;
      case 404:
        message += 'Resource not found. Verify the ID is correct.';
        break;
      default:
        message += data.message || error.message;
    }

    throw new Error(message);
  }

  throw new Error(`Network error: ${error.message}`);
}
```

---

## Testing Strategy

### Production Instance Testing Approach

#### Phase 1: Read-Only Validation
1. **Test Credentials**: Verify connection with List Accounts
2. **List Operations**: Test List Posts and List Media (non-destructive)
3. **Get Operations**: Test Get Post with existing post IDs

#### Phase 2: Safe Write Operations
1. **Create Test Account**: Designate specific Mixpost workspace for testing
2. **Create Draft Posts**: Test Create Post with status='draft' (no publishing)
3. **Upload Test Media**: Small test files only
4. **Update Drafts**: Modify test draft posts only

#### Phase 3: Destructive Operations
1. **Delete Test Posts**: Remove only posts created during testing
2. **Publish Validation**: Test Publish with non-production social accounts
3. **Error Handling**: Validate error responses with invalid inputs

#### Safety Checklist
✅ Never test with production client accounts
✅ Always use 'draft' status initially
✅ Verify account selection before publishing
✅ Document all test post IDs for cleanup
✅ Use test media files only
✅ Test scheduling with future dates to allow cancellation

---

## Implementation Phases

### Phase 1: MVP Core (6 weeks)

#### Week 1-2: Project Setup & Authentication
- [ ] Initialize n8n-node-dev project
- [ ] Configure TypeScript and build system
- [ ] Implement MixpostApi credentials
- [ ] Create GenericFunctions.ts with API client
- [ ] Test connection validation
- [ ] Error handling framework

**Deliverable**: Working authentication and API connection

---

#### Week 3-4: Posts Operations
- [ ] Implement Create Post (simple mode)
- [ ] Implement List Posts with filters
- [ ] Implement Get Post
- [ ] Implement Update Post
- [ ] Implement Delete Post
- [ ] Implement Publish Post
- [ ] Create PostDescription.ts with all field definitions

**Deliverable**: Complete Posts CRUD workflow capability

---

#### Week 5: Media Operations
- [ ] Implement Upload Media (binary data)
- [ ] Implement Download from URL
- [ ] Implement List Media
- [ ] Create MediaDescription.ts
- [ ] Test media + post integration workflow

**Deliverable**: Media management integrated with Posts

---

#### Week 6: Testing, Documentation & Release
- [ ] Comprehensive testing against production instance
- [ ] User documentation (README.md)
- [ ] API reference documentation
- [ ] Example workflows
- [ ] npm package preparation
- [ ] Initial community release

**Deliverable**: v1.0.0 published to npm

---

### Phase 2: Enhanced UX (Post-MVP)

#### Features
- [ ] Simple/Advanced mode toggle for post creation
- [ ] Platform-specific post versions (advanced mode)
- [ ] Relative scheduling ("in 2 hours", "tomorrow at 9am")
- [ ] Bulk scheduling patterns
- [ ] Account listing with platform icons
- [ ] Enhanced validation and error messages

**Deliverable**: v1.1.0 with professional team/agency UX

---

### Phase 3: Complete API Coverage (Future)

#### Features
- [ ] Account management (Update, Delete)
- [ ] Tags resource (full CRUD)
- [ ] Duplicate Post operation
- [ ] Bulk Delete Posts
- [ ] Advanced filtering and search
- [ ] Workflow templates library

**Deliverable**: v1.2.0 with comprehensive Mixpost API coverage

---

### Phase 4: Advanced Features (Future API Expansion)

#### Features (when Mixpost API adds them)
- [ ] Analytics endpoints integration
- [ ] Calendar view data
- [ ] System monitoring
- [ ] Webhook triggers for real-time automation
- [ ] AI-powered content suggestions integration

**Deliverable**: v2.0.0 with next-generation capabilities

---

## Distribution & Maintenance Plan

### npm Package Configuration

#### package.json
```json
{
  "name": "n8n-nodes-mixpost",
  "version": "1.0.0",
  "description": "n8n community node for Mixpost social media management API",
  "keywords": ["n8n-community-node-package", "mixpost", "social-media", "automation"],
  "license": "MIT",
  "homepage": "https://github.com/[username]/n8n-nodes-mixpost",
  "author": {
    "name": "[Your Name]",
    "email": "[your-email]"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/[username]/n8n-nodes-mixpost.git"
  },
  "main": "index.js",
  "scripts": {
    "build": "tsc && gulp build:icons",
    "dev": "tsc --watch",
    "format": "prettier --write .",
    "lint": "eslint ."
  },
  "files": [
    "dist"
  ],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": ["mixpostApi"],
    "nodes": ["dist/nodes/Mixpost/Mixpost.node.js"]
  },
  "devDependencies": {
    "n8n-workflow": "^1.0.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

### Community Management

#### GitHub Repository Structure
```
n8n-nodes-mixpost/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── question.md
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── installation.md
│   ├── usage-examples.md
│   └── api-reference.md
├── examples/
│   ├── basic-post-workflow.json
│   ├── scheduled-content-calendar.json
│   └── media-automation.json
├── src/
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE (MIT)
└── README.md
```

#### Maintenance Commitment

**Active Maintenance** (Your commitment):
- Track Mixpost API updates and changes
- Release patches for bug fixes within 1 week
- Add new features from Mixpost API within 1 month
- Respond to issues within 3 business days
- Monthly dependency updates

**Community-Driven** (Collaborative):
- Accept pull requests with proper testing
- Community contributors for feature development
- Shared testing and validation
- Documentation improvements from users
- Example workflow contributions

#### Version Release Strategy
- **Patch** (1.0.x): Bug fixes, dependency updates
- **Minor** (1.x.0): New features, enhanced UX, non-breaking changes
- **Major** (x.0.0): Breaking API changes, architecture redesign

---

## Risk Mitigation

### Identified Risks & Mitigation Strategies

#### 1. Production Testing Risk
**Risk**: Testing on production Mixpost instance could affect real client data
**Mitigation**:
- Create dedicated test workspace in Mixpost
- Use draft status exclusively for initial testing
- Document all test post IDs for cleanup
- Never select production client accounts
- Implement dry-run mode for validation

#### 2. API Changes Risk
**Risk**: Mixpost API updates could break node functionality
**Mitigation**:
- Version pinning for tested API versions
- Monitor Mixpost GitHub releases
- Community issue reporting system
- Graceful degradation for deprecated endpoints
- Comprehensive error handling with version detection

#### 3. Rate Limiting Impact
**Risk**: Workflows could hit rate limits in high-volume scenarios
**Mitigation**:
- Implement retry logic with exponential backoff
- Document rate limits in user guide
- Batch operation support in future phases
- Queue management recommendations
- Clear rate limit error messages

#### 4. Token Security Risk
**Risk**: Access tokens could be exposed or compromised
**Mitigation**:
- Use n8n credential encryption
- Never log tokens in error messages
- Document token rotation procedures
- Support for token expiration handling
- Recommend Mixpost IP whitelisting

#### 5. Community Support Burden
**Risk**: High volume of support requests could overwhelm maintainer
**Mitigation**:
- Comprehensive documentation
- Example workflows library
- Clear issue templates
- Community contributor recruitment
- FAQ and troubleshooting guide

---

## Success Metrics

### MVP Launch Goals
- [ ] **Functionality**: All core operations working reliably
- [ ] **Documentation**: Complete user and developer documentation
- [ ] **Testing**: 100+ hours of production testing without critical bugs
- [ ] **Examples**: 5+ example workflows demonstrating common use cases
- [ ] **Community**: Published to npm with installation instructions

### Post-Launch Metrics (6 months)
- **Adoption**: 50+ npm downloads
- **Engagement**: 10+ GitHub stars
- **Quality**: <5 open critical bugs
- **Community**: 3+ community contributors
- **Coverage**: 80%+ of Mixpost API features supported

---

## Next Steps for Implementation

### Immediate Actions (Week 1)
1. **Environment Setup**
   ```bash
   npm install -g n8n-node-dev
   mkdir n8n-nodes-mixpost
   cd n8n-nodes-mixpost
   n8n-node-dev init
   ```

2. **Repository Initialization**
   ```bash
   git init
   git remote add origin [repository-url]
   ```

3. **Credential Implementation**
   - Create `credentials/MixpostApi.credentials.ts`
   - Test connection validation
   - Document token generation process

4. **API Client Foundation**
   - Implement `GenericFunctions.ts`
   - Test basic GET /accounts request
   - Validate error handling

### Development Workflow
1. Feature branch for each operation
2. Test against production Mixpost (safely)
3. Document as you build
4. Commit with descriptive messages
5. Prepare for npm publishing

---

## Appendix

### Mixpost API Endpoint Reference

#### Authentication
```
POST /api/mixpost/auth/tokens          # Generate token
GET  /api/mixpost/auth/tokens          # List tokens
DELETE /api/mixpost/auth/tokens/{id}   # Revoke token
```

#### Posts
```
GET    /api/mixpost/posts              # List posts
POST   /api/mixpost/posts              # Create post
GET    /api/mixpost/posts/{id}         # Get post
PUT    /api/mixpost/posts/{id}         # Update post
DELETE /api/mixpost/posts/{id}         # Delete post
POST   /api/mixpost/posts/{id}/publish # Publish post
POST   /api/mixpost/posts/{id}/duplicate # Duplicate post (Phase 3)
DELETE /api/mixpost/posts              # Bulk delete (Phase 3)
```

#### Media
```
GET    /api/mixpost/media              # List media
POST   /api/mixpost/media/upload       # Upload file
POST   /api/mixpost/media/download     # Download from URL
GET    /api/mixpost/media/{id}         # Get media (Phase 3)
DELETE /api/mixpost/media/{id}         # Delete media (Phase 3)
```

#### Accounts
```
GET    /api/mixpost/accounts           # List accounts
GET    /api/mixpost/accounts/{id}      # Get account
PUT    /api/mixpost/accounts/{id}      # Update account (Phase 3)
DELETE /api/mixpost/accounts/{id}      # Delete account (Phase 3)
```

#### Tags
```
GET    /api/mixpost/tags               # List tags (Phase 3)
POST   /api/mixpost/tags               # Create tag (Phase 3)
GET    /api/mixpost/tags/{id}          # Get tag (Phase 3)
PUT    /api/mixpost/tags/{id}          # Update tag (Phase 3)
DELETE /api/mixpost/tags/{id}          # Delete tag (Phase 3)
```

### TypeScript Type Definitions

```typescript
// Core Types
export interface MixpostCredentials {
  baseUrl: string;
  apiPath?: string;
  accessToken: string;
}

export interface Post {
  id: number;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_at?: string;
  published_at?: string;
  accounts: Account[];
  media: Media[];
  tags: Tag[];
  versions?: PostVersion[];
  created_at: string;
  updated_at: string;
}

export interface PostVersion {
  id: number;
  account_id: number;
  content: string;
  media: Media[];
}

export interface Media {
  id: number;
  name: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
}

export interface Account {
  id: number;
  name: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'mastodon';
  username: string;
  image: string;
}

export interface Tag {
  id: number;
  name: string;
  hex_color: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

// Operation Types
export type PostOperation =
  | 'create'
  | 'list'
  | 'get'
  | 'update'
  | 'delete'
  | 'publish';

export type MediaOperation =
  | 'upload'
  | 'downloadUrl'
  | 'list';

export type AccountOperation = 'list';

export type ResourceType = 'posts' | 'media' | 'accounts';
```

---

## Conclusion

This specification provides a comprehensive blueprint for implementing the Mixpost n8n community node. The phased approach ensures a solid MVP foundation while establishing clear paths for enhanced UX and complete API coverage.

**Key Strengths**:
✅ Clear scope and boundaries
✅ Production-safe testing strategy
✅ Realistic 6-week MVP timeline
✅ Community-ready distribution plan
✅ Extensible architecture for future growth

**Ready to Begin**: All requirements defined, architecture planned, implementation roadmap established. Proceed to Week 1 development tasks.
