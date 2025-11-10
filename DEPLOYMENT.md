# GitHub Pages Deployment Guide

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 2. Push Your Changes

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

(Replace `main` with `master` if that's your default branch)

### 3. Wait for Deployment

- Go to the **Actions** tab in your repository
- Wait for the deployment workflow to complete (usually takes 1-2 minutes)
- Once complete, your site will be available at: `https://[username].github.io/[repository-name]/`

## What Was Fixed

### Path Issues Resolved:

1. **Webpack Configuration**
   - Added `publicPath` to support subdirectory deployment
   - Configured to work with both local development and GitHub Pages

2. **Service Worker**
   - Changed from absolute paths (`/sw.js`) to dynamic paths
   - Now works correctly in subdirectories

3. **Manifest.json**
   - Changed icon paths from absolute to relative
   - Ensures PWA icons load correctly

4. **GitHub Actions Workflow**
   - Automatically builds the project on push
   - Deploys the `dist` folder to GitHub Pages
   - No need to commit the `dist` folder

## Local Development

To run locally:

```bash
npm install
npm run start-dev
```

To build for production:

```bash
npm run build
```

## Troubleshooting

If CSS/JS still don't load:

1. Check the browser console for errors
2. Verify the GitHub Actions workflow completed successfully
3. Clear your browser cache
4. Make sure GitHub Pages is set to use **GitHub Actions** as the source

## Notes

- The `dist` folder is gitignored and built automatically by GitHub Actions
- Changes take 1-2 minutes to appear after pushing
- Service worker caching may require a hard refresh (Ctrl+Shift+R)
