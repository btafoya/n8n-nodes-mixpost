# Mixpost n8n Node - Quick Start Checklist

**Use this checklist to get started immediately.**

---

## ⚡ Day 1 Setup (2 hours)

### Prerequisites
```bash
# Check Node.js version (need 18.x+)
node --version

# Install n8n-node-dev globally
npm install -g n8n-node-dev

# Install n8n for testing (if not already installed)
npm install -g n8n
```

---

## 🚀 Project Initialization

### Step 1: Create Project (5 minutes)
```bash
# Create directory
mkdir n8n-nodes-mixpost
cd n8n-nodes-mixpost

# Initialize n8n node
n8n-node-dev init

# Answer prompts:
# - Node name: Mixpost
# - Description: n8n community node for Mixpost social media management
# - Author: [Your Name]
# - License: MIT
```

### Step 2: Install Dependencies (2 minutes)
```bash
# Install required packages
npm install axios form-data

# Install dev dependencies (if not already present)
npm install --save-dev @types/node typescript
```

### Step 3: Git Setup (3 minutes)
```bash
# Initialize git
git init

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
*.log
.DS_Store
*.tgz
EOF

# Initial commit
git add .
git commit -m "Initial project setup"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/[username]/n8n-nodes-mixpost.git
```

---

## 📁 Create File Structure (10 minutes)

### Create Directories
```bash
mkdir -p credentials
mkdir -p nodes/Mixpost/descriptions
mkdir -p nodes/Mixpost/types
```

### Create Credential File
Create `credentials/MixpostApi.credentials.ts`:
```typescript
import {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MixpostApi implements ICredentialType {
  name = 'mixpostApi';
  displayName = 'Mixpost API';
  documentationUrl = 'https://github.com/btafoya/mixpost-api';
  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-mixpost-instance.com',
      description: 'The base URL of your Mixpost installation',
      required: true,
    },
    {
      displayName: 'API Path',
      name: 'apiPath',
      type: 'string',
      default: '/api/mixpost',
      description: 'API endpoint path (default: /api/mixpost)',
    },
    {
      displayName: 'Access Token',
      name: 'accessToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Personal access token from Mixpost',
      required: true,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{"Bearer " + $credentials.accessToken}}',
      },
    },
  };
}
```

### Create GenericFunctions File
Create `nodes/Mixpost/GenericFunctions.ts` - **Use template from roadmap.md**

### Create Type Definitions
Create `nodes/Mixpost/types/MixpostApi.types.ts` - **Use template from specification.md**

---

## 🧪 Test Setup (15 minutes)

### Link for Local Testing
```bash
# Build the project
npm run build

# Link globally
npm link

# In a separate terminal, go to n8n custom nodes directory
cd ~/.n8n/custom
npm link n8n-nodes-mixpost

# Start n8n
n8n start
```

### Verify in n8n
1. Open browser: http://localhost:5678
2. Create new workflow
3. Add node → search "Mixpost"
4. Should see your Mixpost node

### Test Credentials
1. Add Mixpost credentials
2. Enter your production Mixpost URL
3. Enter access token
4. Click "Test credentials"
5. Should see "Connection successful"

---

## ✅ Day 1 Completion Checklist

### Project Setup
- [ ] Node.js 18.x+ installed
- [ ] n8n-node-dev installed globally
- [ ] n8n installed for testing
- [ ] Project initialized with n8n-node-dev init

### Dependencies
- [ ] axios installed
- [ ] form-data installed
- [ ] TypeScript dev dependencies installed

### File Structure
- [ ] credentials/MixpostApi.credentials.ts created
- [ ] nodes/Mixpost/GenericFunctions.ts created
- [ ] nodes/Mixpost/types/MixpostApi.types.ts created
- [ ] Directory structure complete

### Version Control
- [ ] Git initialized
- [ ] .gitignore configured
- [ ] Initial commit created
- [ ] Remote repository added (optional for Day 1)

### Testing
- [ ] Project builds without errors (npm run build)
- [ ] Node linked for local testing
- [ ] Mixpost node appears in n8n
- [ ] Credentials test successful

---

## 📋 Week 1 Remaining Tasks

### Day 2-3: Complete API Client
- [ ] Finish GenericFunctions.ts implementation
- [ ] Add pagination helper
- [ ] Implement error handling
- [ ] Test API requests

### Day 4-5: Node Skeleton
- [ ] Create Mixpost.node.ts
- [ ] Implement resource selection
- [ ] Add credential testing method
- [ ] Test in n8n workflow

### Day 6-7: Type Definitions & Testing
- [ ] Complete all TypeScript interfaces
- [ ] Test connection validation
- [ ] Document authentication flow
- [ ] Git commit Week 1 progress

---

## 🔧 Troubleshooting

### "Cannot find module 'n8n-workflow'"
```bash
npm install n8n-workflow
```

### "tsc command not found"
```bash
npm install -g typescript
```

### Node doesn't appear in n8n
```bash
# Rebuild
npm run build

# Restart n8n
pkill -f n8n
n8n start
```

### Build errors
```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

---

## 📚 Reference Files

**Full implementation details**: See `implementation-roadmap.md`
**Technical specification**: See `mixpost-n8n-specification.md`
**Requirements**: See `mixpost-n8n-discovery-questionnaire.md`
**Project overview**: See `project-summary.md`

---

## 🎯 Success Indicator

**You've successfully completed Day 1 when**:
✅ n8n shows your Mixpost node in the node picker
✅ Credential configuration screen appears
✅ Connection test returns "Connection successful"
✅ No TypeScript compilation errors

**Next**: Move to Week 1, Day 2 tasks (API client completion)

---

## 💡 Pro Tips

1. **Keep n8n running**: Use `n8n start` in one terminal, develop in another
2. **Watch mode**: Use `npm run dev` for auto-rebuild during development
3. **Test frequently**: Reload n8n workflow after each build to see changes
4. **Commit often**: Commit working states to easily rollback if needed
5. **Use Mixpost docs**: Keep https://github.com/btafoya/mixpost-api open for API reference

---

**Ready? Let's build! 🚀**
