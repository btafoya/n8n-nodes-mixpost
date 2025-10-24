# Mixpost n8n Community Node - Discovery Questionnaire

**Project**: n8n Community Node for Mixpost API
**References**:
- Mixpost API: https://github.com/btafoya/mixpost-api
- n8n Community Node Docs: https://docs.n8n.io/integrations/community-nodes/build-community-nodes/

---

## 🔍 Discovery Questions

### **Scope & Objectives**

**🎯 Primary Use Case**: What's your main goal for this integration?
- [ ] **A)** Personal workflow automation (scheduling, content management)
- [X] **B)** Team/agency solution (multi-client social media management)
- [ ] **C)** Product offering (white-label or commercial integration)
- [ ] **D)** Other: _____

**📊 Feature Priority**: Which Mixpost capabilities are most critical?
- [X] **A)** Post creation and scheduling
- [X] **B)** Media management and uploads
- [X] **C)** Social account administration
- [ ] **D)** Analytics and reporting (future API features)
- [ ] **E)** All features with comprehensive coverage

---

### **Technical Architecture**

**🔧 Node Complexity**: Based on Mixpost's 5 resource categories (Posts, Media, Accounts, Tags, Auth), how would you prefer operations structured?
- [X] **A)** **Single multi-operation node** (one "Mixpost" node with dropdown for Posts/Media/Accounts/Tags)
- [ ] **B)** **Separate resource nodes** (MixpostPosts, MixpostMedia, MixpostAccounts, MixpostTags)
- [ ] **C)** **Hybrid approach** (Core node + specialized trigger nodes)

**🔐 Authentication Strategy**: Mixpost uses Laravel Sanctum tokens. Should the node:
- [X] **A)** Store static personal access tokens (simple, manual token management)
- [ ] **B)** Support dynamic token generation (email/password → auto-token creation)
- [ ] **C)** Both options with user preference

**🌐 Instance Configuration**: How should users configure their Mixpost installation?
- [X] **A)** Single base URL credential (assumes `/api/mixpost` path)
- [X] **B)** Flexible URL configuration (support custom installations)
- [ ] **C)** Multi-instance support (manage multiple Mixpost servers)

---

### **User Experience**

**📝 Post Creation UX**: Mixpost supports platform-specific post versions. Should the node:
- [ ] **A)** Simple mode (single content → all platforms)
- [ ] **B)** Advanced mode (per-platform customization with version editor)
- [X] **C)** Both modes with complexity toggle

**📅 Scheduling Interface**: How should users set publish times?
- [X] **A)** Standard n8n datetime picker
- [X] **B)** Relative scheduling ("in 2 hours", "tomorrow 9am")
- [X] **C)** Bulk scheduling patterns (series of posts)

**🖼️ Media Handling**: For file uploads, should the node:
- [ ] **A)** Accept n8n binary data (from previous nodes)
- [ ] **B)** Support URL downloads (Mixpost's download-from-URL feature)
- [X] **C)** Both methods

---

### **Development Approach**

**🛠️ Implementation Style**: n8n offers two approaches:
- [ ] **A)** **Declarative** (configuration-based, faster development, less code)
- [ ] **B)** **Programmatic** (full TypeScript control, more flexibility)
- [X] **C)** Undecided (need recommendation based on Mixpost API complexity)

**📦 Initial Release Scope**: For MVP launch, should we:
- [X] **A)** Core operations only (Posts CRUD, basic Media, basic Auth)
- [ ] **B)** Comprehensive coverage (all current API endpoints)
- [ ] **C)** Phased approach (v1: Posts/Media, v2: Accounts/Tags, v3: Analytics when available)

**🧪 Testing & Validation**: What's your Mixpost environment for development?
- [X] **A)** Production Mixpost instance (will test carefully)
- [ ] **B)** Dedicated test/staging Mixpost server
- [ ] **C)** Local development environment
- [ ] **D)** Need guidance on setting up test environment

---

### **Distribution & Maintenance**

**📢 Publishing Plan**: After development, do you plan to:
- [ ] **A)** Submit for official n8n verification (broader reach, quality standards)
- [X] **B)** Community distribution only (npm, no official verification)
- [ ] **C)** Private use (internal tooling)

**🔄 Maintenance Commitment**: How will you handle future Mixpost API changes?
- [X] **A)** Active maintenance (track API updates, add new features)
- [ ] **B)** Best-effort support (fix critical bugs only)
- [X] **C)** Community-driven (accept contributions)

---

## 💡 Initial Observations

Based on the API analysis, here are some preliminary considerations:

### ✅ Strengths for n8n Integration
- Clean RESTful structure maps well to n8n operations
- Token auth is straightforward to implement
- Pagination support handles large datasets
- Media URL download feature enables powerful workflows

### ⚠️ Design Considerations
- Post versions (platform-specific content) need thoughtful UX
- Rate limiting requires error handling strategy
- Future analytics endpoints suggest planning for extensibility
- Tag management could integrate with n8n workflow tagging

### 🎯 Recommended Architecture
Single node with resource-based operations, supporting both declarative UI and programmatic flexibility for complex post version handling.

---

## 📋 Mixpost API Summary

### API Purpose and Main Features
The Mixpost REST API is a Laravel package extending the Mixpost social media management platform with comprehensive REST capabilities. It enables seamless integration with automation tools like n8n.

**Core capabilities:**
- Complete post management (CRUD, scheduling, publishing)
- Media file handling and URL downloads
- Social account administration
- Content organization through tags
- Rate limiting and token-based security
- Pagination for large datasets

### Available Endpoints

**Authentication:**
- Token generation, listing, and revocation

**Posts:**
- List, create, retrieve, update, delete operations
- Scheduling and immediate publishing
- Duplication and bulk deletion

**Media:**
- Upload, download from URLs, retrieve details
- Library management and deletion

**Accounts:**
- List, retrieve, update, delete social media accounts

**Tags:**
- Full CRUD operations for content organization

### Authentication Methods
Laravel Sanctum Authentication with secure token-based access. Users generate personal access tokens via `POST /api/mixpost/auth/tokens` using email and password credentials. Tokens are passed in Authorization headers as `Bearer [token]`.

### Key Data Models
- **Posts:** Content with versions supporting platform-specific adaptations, media attachments, scheduling metadata
- **Media:** Files with upload timestamps and storage paths
- **Accounts:** Connected social media profiles with configuration details
- **Tags:** User-defined organizational categories
- **Tokens:** Personal access credentials with expiration and ability controls

---

## 📚 n8n Community Node Requirements Summary

### Node Structure and Requirements
- Must meet defined quality criteria for verification by n8n
- Tiered installation methods: verified, GUI, and manual
- Standards compliance required for official recognition

### Development Workflow
- Planning phase with node type selection and UI design
- Dedicated "n8n-node tool" for streamlined development
- Environment setup documentation
- Both "declarative-style" and "programmatic-style" tutorials

### Credential Handling
- Centralized credential management system
- Support for OAuth flows, API keys, and service accounts
- Per-integration credential configurations

### Operation Types
- **Core nodes** (Code, HTTP Request, triggers)
- **Action nodes** (service integrations)
- **Trigger nodes** (event-based activation)
- **Cluster nodes** (AI agents, chains, retrievers)

### Publishing Process
Development → Verification submission → Community review → Usage documentation

---

## ✍️ Instructions

Please review and answer the questions above by checking the boxes and adding any additional notes. Once completed, we'll generate a comprehensive specification document for your n8n-Mixpost community node.
