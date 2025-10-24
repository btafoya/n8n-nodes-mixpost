# 🧪 Testing Your Mixpost n8n Node

## 📋 Quick Reference

**Complete Testing Flow**:
1. ✅ Build the node module
2. ✅ Install in n8n (npm link or copy files)
3. ✅ Restart n8n
4. ✅ Access n8n web interface
5. ✅ Find and add Mixpost node
6. ✅ Configure credentials
7. ✅ Test operations

---

## 📦 Step 1: Install the Node Module in n8n

Before you can use your Mixpost node, you need to install it in n8n. There are two methods:

### Method A: Install via npm link (Development/Testing)

**Use this method for local testing before publishing to npm.**

```bash
# 1. Make sure you're in your project directory
cd /home/btafoya/projects/n8n-mixpost

# 2. Build the project
npm run build

# 3. Create a global npm link
npm link

# 4. Install in n8n
# For n8n installed globally:
cd $(npm root -g)/n8n
npm link n8n-nodes-mixpost

# OR if the above doesn't work:
cd ~/.n8n
mkdir -p nodes
cd nodes
npm link n8n-nodes-mixpost
```

### Method B: Install via npm (After Publishing)

**Use this method after you've published to npm.**

```bash
# Install using n8n's community nodes feature
n8n install n8n-nodes-mixpost

# OR manually in n8n's custom nodes directory:
cd ~/.n8n/nodes
npm install n8n-nodes-mixpost
```

### Method C: Manual Installation (Recommended for Development)

**✅ Use this method if npm link has dependency conflicts (most reliable):**

```bash
# 1. Build the project
cd /home/btafoya/projects/n8n-mixpost
npm run build

# 2. Create n8n custom directory
mkdir -p ~/.n8n/custom

# 3. Copy built files to custom directory
cp -r dist/* ~/.n8n/custom/
cp package.json ~/.n8n/custom/

# Note: n8n loads custom nodes from ~/.n8n/custom by default
```

**Common Issue**: If you get npm dependency conflicts with `npm link`, use this method instead.

---

## 🔄 Step 2: Restart n8n

After installing the node, restart n8n:

```bash
# Stop n8n
pkill -f n8n

# Start n8n in background
nohup n8n start > n8n.log 2>&1 &

# Wait a few seconds for startup
sleep 5

# Verify it's running
ps aux | grep n8n | grep -v grep
```

---

## ✅ n8n is Running Locally!

Your n8n instance is live at:
**http://localhost:5678**

---

## 🔗 Step 3: Access n8n

Open your browser and go to:
```
http://localhost:5678
```

**First Time Setup**:
1. Create your n8n account (owner account)
2. Set up your username and password
3. You'll see the n8n workflow editor

---

## 🔍 Step 4: Find Your Mixpost Node

1. In the workflow editor, click **"Add node"** (the big + button)
2. Search for **"Mixpost"**
3. You should see the **Mixpost** node in the results!

**If you don't see it**: The node wasn't installed properly. Try:
1. Verify the build succeeded: `npm run build` (should have no errors)
2. Check if linked: `npm list -g n8n-nodes-mixpost`
3. Restart n8n: `pkill -f n8n && nohup n8n start > n8n.log 2>&1 &`
4. See troubleshooting section at the bottom of this guide

---

## 🔐 Step 5: Configure Mixpost Credentials

### Create Mixpost Credentials

1. Click on the Mixpost node
2. Click **"Create New Credential"** under Mixpost API
3. Fill in the form:
   - **Base URL**: Your Mixpost instance URL (e.g., `https://mixpost.example.com`)
   - **API Path**: `/api/mixpost` (leave default)
   - **Access Token**: Your Mixpost API token

### Get Your Mixpost Access Token

In your Mixpost instance:
1. Log in to Mixpost
2. Go to **Settings → API Tokens**
3. Click **"Generate New Token"**
4. Copy the token
5. Paste it into n8n credentials

### Test Connection

1. Click **"Test"** button in credentials dialog
2. Should see: ✅ **"Connection successful"**
3. Click **"Save"**

---

---

## 🧪 Step 6: Test Operations

### Test 1: List Accounts (Safest - Read Only)

**This is the safest first test - it only reads data**

1. Add Mixpost node to workflow
2. Set **Resource**: `Account`
3. Set **Operation**: `List`
4. Click **"Execute node"**

**Expected Result**: JSON array of your connected social accounts
```json
[
  {
    "id": 1,
    "name": "My Facebook Page",
    "platform": "facebook",
    "username": "mypage",
    ...
  }
]
```

---

### Test 2: List Media

1. Resource: `Media`
2. Operation: `List`
3. Execute

**Expected Result**: Your media library files

---

### Test 3: List Posts

1. Resource: `Posts`
2. Operation: `List`
3. (Optional) Add filters
4. Execute

**Expected Result**: Your Mixpost posts

---

### Test 4: Create Draft Post (Safe - Won't Publish)

**This creates a draft that won't be published to social media**

1. Resource: `Posts`
2. Operation: `Create`
3. **Content**: "Test post from n8n - this is a draft"
4. **Accounts**: Select one or more social accounts
5. **Additional Fields**:
   - Status: `Draft` (IMPORTANT!)
6. Execute

**Expected Result**: Post created in Mixpost as draft
- ✅ Visible in Mixpost dashboard
- ✅ Status: Draft
- ✅ NOT published to social media

**Verify in Mixpost**: Check your Mixpost dashboard to see the draft post

---

### Test 5: Upload Media

**Requires binary data from a previous node**

Example workflow:
```
1. HTTP Request node:
   - Method: GET
   - URL: https://picsum.photos/400/300
   - Response Format: File

2. Mixpost node:
   - Resource: Media
   - Operation: Upload
   - Binary Property: data
   - Execute
```

**Expected Result**: Media uploaded to Mixpost library

---

### Test 6: Download Media from URL

1. Resource: `Media`
2. Operation: `Download from URL`
3. **URL**: `https://picsum.photos/400/300` (test image)
4. Execute

**Expected Result**: Media downloaded and added to Mixpost library

---

### Test 7: Update Post

1. Resource: `Posts`
2. Operation: `Update`
3. **Post ID**: (ID from a draft post)
4. **Update Fields**:
   - Content: "Updated content"
5. Execute

**Expected Result**: Post updated in Mixpost

---

### Test 8: Publish Post (Careful!)

**⚠️ WARNING: This will actually publish to social media!**

Only test this with:
- A test social account (not production)
- OR a draft post you're ready to publish

1. Resource: `Posts`
2. Operation: `Publish`
3. **Post ID**: (ID of draft post to publish)
4. Execute

**Expected Result**: Post immediately published to selected social accounts

---

## 🔴 Production Testing Safety

### Before Testing on Production

**Create a Test Workspace in Mixpost**:
1. Use a dedicated test account
2. Connect test social media accounts (not client accounts!)
3. Always use `Draft` status initially
4. Document all test post IDs for cleanup

### Safety Checklist

- [ ] Using test Mixpost workspace, not production
- [ ] Connected to test social accounts only
- [ ] Creating drafts first (status: draft)
- [ ] Verified post IDs before deletion
- [ ] NOT selecting production client accounts
- [ ] Have cleanup plan for test posts

---

## 🐛 Troubleshooting

### Node Doesn't Appear in n8n

If you don't see the Mixpost node:

1. **Check if linked**:
```bash
cd /home/btafoya/projects/n8n-mixpost
npm link
```

2. **Restart n8n**:
```bash
# Stop current n8n instance
pkill -f n8n

# Start fresh
n8n start
```

3. **Verify build**:
```bash
npm run build
# Should complete without errors
```

### Credential Test Fails

**Possible causes**:

1. **Invalid Token**:
   - Generate new token in Mixpost
   - Copy entire token (no spaces)
   - Paste carefully into n8n

2. **Wrong Base URL**:
   - Include `https://` or `http://`
   - No trailing slash
   - Example: `https://mixpost.example.com`

3. **API Path Wrong**:
   - Default: `/api/mixpost`
   - Don't change unless using custom installation

4. **Mixpost Not Accessible**:
   - Test direct API call:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://your-mixpost.com/api/mixpost/accounts
```

### Operation Fails

**Check Error Message**:
- `401`: Invalid token → regenerate token
- `404`: Wrong endpoint or ID doesn't exist
- `422`: Validation error → check required fields
- `429`: Rate limit → wait and retry

---

## 📊 Verification Checklist

After testing, verify:

- [ ] ✅ Node appears in n8n
- [ ] ✅ Credentials test successful
- [ ] ✅ List Accounts works
- [ ] ✅ List Media works
- [ ] ✅ List Posts works
- [ ] ✅ Create draft post works
- [ ] ✅ Post visible in Mixpost dashboard
- [ ] ✅ Upload media works
- [ ] ✅ Download from URL works
- [ ] ✅ Update post works
- [ ] ✅ Delete post works (test posts only!)
- [ ] ✅ Publish works (with test account)

---

## 🎯 Next Steps After Testing

### If All Tests Pass ✅

Your node is working! Time to:

1. **Clean up test data** in Mixpost
2. **Document any issues** you found
3. **Prepare for npm publication**

### Publishing to npm

```bash
# Make sure you're in the project directory
cd /home/btafoya/projects/n8n-mixpost

# Login to npm
npm login
# Username: btafoya

# Publish
npm publish
```

### Share with Community

After publishing:
1. Post on n8n community forum
2. Share on GitHub Discussions
3. Tweet about your new integration
4. Add to n8n community nodes showcase

---

## 🔧 Stop n8n When Done

When you're finished testing:

```bash
# Stop n8n
pkill -f n8n
```

---

## 📚 Additional Resources

- **Your Specification**: `claudedocs/mixpost-n8n-specification.md`
- **Mixpost API**: https://github.com/btafoya/mixpost-api
- **n8n Docs**: https://docs.n8n.io
- **Project README**: `README.md`

---

**Happy Testing! 🚀**
