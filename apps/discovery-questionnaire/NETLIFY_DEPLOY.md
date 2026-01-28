# Netlify Deployment Guide

## Option 1: Netlify Dashboard (Recommended - Git Integration)

### Step 1: Prepare Your Repository
1. Make sure your code is committed and pushed to GitHub/GitLab/Bitbucket
2. Your repository should be accessible to Netlify

### Step 2: Connect to Netlify
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Sign in (or create a free account)
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose your Git provider (GitHub, GitLab, or Bitbucket)
5. Authorize Netlify to access your repositories
6. Select the `Canterbury-Discovery` repository

### Step 3: Configure Build Settings
Since this is a monorepo, you need to configure the base directory:

**Build settings:**
- **Base directory:** `apps/discovery-questionnaire`
- **Build command:** `npm run build`
- **Publish directory:** `out`

**OR** if you created the `netlify.toml` file, Netlify will auto-detect these settings.

### Step 4: Deploy
1. Click **"Deploy site"**
2. Netlify will:
   - Install dependencies
   - Run the build command
   - Deploy the `out` folder
3. Wait for the build to complete (usually 2-3 minutes)

### Step 5: Access Your Site
- Netlify will assign a random URL like: `https://random-name-123.netlify.app`
- You can customize the site name in **Site settings** → **Change site name**

### Step 6: Custom Domain (Optional)
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the DNS configuration instructions

---

## Option 2: Netlify CLI (Quick Deploy)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Navigate to Project
```bash
cd apps/discovery-questionnaire
```

### Step 3: Build Locally
```bash
npm run build
```

### Step 4: Login to Netlify
```bash
netlify login
```
This will open your browser to authenticate.

### Step 5: Initialize Site (First Time Only)
```bash
netlify init
```
Follow the prompts:
- Create & configure a new site
- Choose a site name (or use auto-generated)
- Set publish directory: `out`

### Step 6: Deploy
```bash
netlify deploy --prod
```

For future deployments, you can just run:
```bash
npm run build && netlify deploy --prod
```

---

## Option 3: Drag & Drop (One-Time Deploy)

### Step 1: Build Locally
```bash
cd apps/discovery-questionnaire
npm run build
```

### Step 2: Go to Netlify Drop
1. Visit [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the `out` folder onto the page
3. Wait for upload and deployment (usually 30 seconds)

**Note:** This method doesn't set up continuous deployment. Use Option 1 or 2 for automatic deployments on git push.

---

## Troubleshooting

### Build Fails: "Cannot find module"
- Make sure you're building from `apps/discovery-questionnaire`
- Run `npm install` first
- Check that all dependencies are in `package.json`

### 404 Errors on Routes
- The `netlify.toml` includes redirect rules
- Make sure `trailingSlash: true` is in `next.config.js` (already configured)

### Build Timeout
- Free tier has 15-minute build limit
- If your build takes longer, consider optimizing dependencies
- Check Netlify build logs for specific errors

### Wrong Directory Deployed
- Verify **Base directory** is set to `apps/discovery-questionnaire`
- Verify **Publish directory** is set to `out`
- Check the `netlify.toml` file if using it

---

## Continuous Deployment

Once connected via Git (Option 1), Netlify will automatically:
- Deploy on every push to your main branch
- Create preview deployments for pull requests
- Show build status in your Git provider

You can configure branch settings in:
**Site settings** → **Build & deploy** → **Continuous Deployment**

---

## Environment Variables

This app doesn't require any environment variables! Everything runs client-side.

If you need to add variables in the future:
1. Go to **Site settings** → **Environment variables**
2. Add key-value pairs
3. Redeploy the site

---

## Quick Reference

**Build command:** `npm run build`  
**Publish directory:** `out`  
**Base directory:** `apps/discovery-questionnaire` (if monorepo)  
**Node version:** 18+ (auto-detected by Netlify)

---

## Next Steps After Deployment

1. ✅ Test the deployed site
2. ✅ Verify localStorage works (save some data, refresh)
3. ✅ Test export functionality
4. ✅ Set up custom domain (optional)
5. ✅ Configure branch protection (optional)

Your site is now live! 🎉
