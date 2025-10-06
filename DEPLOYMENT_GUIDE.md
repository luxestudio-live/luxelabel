# LuxeLabel - GitHub Pages Deployment Guide

## Overview
This guide will help you replace the older code in your GitHub repository (https://github.com/luxestudio-live/luxelabel) with the updated Next.js application and set up automated deployment to GitHub Pages.

## Prerequisites
- Git installed on your local machine
- Access to your GitHub repository
- Node.js and pnpm installed

## Step-by-Step Instructions

### Step 1: Backup and Clone Your Repository
```bash
# Clone your existing repository
git clone https://github.com/luxestudio-live/luxelabel.git luxelabel-backup

# Navigate to the cloned repository
cd luxelabel-backup

# Create a backup branch (optional but recommended)
git checkout -b backup-old-code
git push origin backup-old-code
```

### Step 2: Replace Repository Contents
```bash
# Remove all files except .git folder (keep your git history)
# On Windows PowerShell:
Get-ChildItem -Path . -Exclude .git | Remove-Item -Recurse -Force

# On Linux/macOS:
# find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
```

### Step 3: Copy New Code
Copy all files from your current project (`d:\Downloads\luxelabel\`) to the repository folder, excluding:
- `node_modules/` folder
- `.next/` folder
- Any temporary files

**Files to copy:**
- `.github/` (workflow files)
- `app/` (Next.js app directory)
- `components/` (React components)
- `hooks/` (Custom hooks)
- `lib/` (Utility functions)
- `public/` (Static assets)
- `styles/` (CSS files)
- All configuration files (package.json, next.config.mjs, tsconfig.json, etc.)

### Step 4: Update Repository
```bash
# Add all new files
git add .

# Commit the changes
git commit -m "feat: update to new Next.js application with LuxeLabel branding

- Replaced old codebase with modern Next.js 14 application
- Added GitHub Pages deployment configuration
- Implemented responsive design with Tailwind CSS
- Added luxury fashion components and sections
- Configured automated deployment with GitHub Actions"

# Push to main branch
git push origin main
```

### Step 5: Configure GitHub Pages
1. Go to your GitHub repository: https://github.com/luxestudio-live/luxelabel
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. The deployment will automatically trigger when you push to the main branch

### Step 6: Enable GitHub Actions (if needed)
1. Go to **Settings** > **Actions** > **General**
2. Ensure **Allow all actions and reusable workflows** is selected
3. Under **Workflow permissions**, select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**

## Configuration Details

### Next.js Configuration (`next.config.mjs`)
The application is configured for static export with GitHub Pages compatibility:
- `output: 'export'` - Enables static site generation
- `basePath` and `assetPrefix` - Handles GitHub Pages subdirectory routing
- `trailingSlash: true` - Ensures proper routing on GitHub Pages

### Package.json Scripts
- `npm run build` - Builds the application for production
- `npm run deploy` - Builds and prepares for deployment
- `npm run dev` - Starts development server

### GitHub Actions Workflow
The workflow automatically:
1. Checks out the code
2. Sets up Node.js and pnpm
3. Installs dependencies
4. Builds the project
5. Deploys to GitHub Pages

## Important Notes

### Asset Paths
If you have any hardcoded asset paths in your code, make sure they work with the `/luxelabel` base path. The configuration handles this automatically for most cases.

### Custom Domain (Optional)
If you want to use a custom domain:
1. Add a `CNAME` file to the `public/` folder with your domain name
2. Configure your DNS settings to point to GitHub Pages
3. Update the `basePath` and `assetPrefix` in `next.config.mjs` to empty strings

### Deployment URL
After successful deployment, your site will be available at:
`https://luxestudio-live.github.io/luxelabel/`

## Troubleshooting

### Build Fails
- Check the Actions tab in your GitHub repository for detailed error logs
- Ensure all dependencies are properly listed in `package.json`
- Verify that all import paths are correct

### Assets Not Loading
- Ensure images are in the `public/` folder
- Check that image paths start with `/` (not `./`)
- Verify the `basePath` configuration in `next.config.mjs`

### 404 Errors
- Make sure `trailingSlash: true` is set in `next.config.mjs`
- Check that all internal links use Next.js `Link` component
- Verify routing configuration

## Post-Deployment Checklist
- [ ] Verify the site loads correctly at the GitHub Pages URL
- [ ] Test all navigation links
- [ ] Check that images and assets load properly
- [ ] Verify responsive design on different screen sizes
- [ ] Test form submissions (if any)
- [ ] Check browser console for any errors

## Maintenance
- The site will automatically redeploy when you push changes to the main branch
- Monitor the Actions tab for deployment status
- Keep dependencies updated regularly for security

## Support
If you encounter any issues:
1. Check the GitHub Actions logs for detailed error messages
2. Verify all configuration files are correct
3. Test the build locally with `npm run build`
4. Check the GitHub Pages settings in your repository

---

**Project Structure:**
```
luxelabel/
├── .github/workflows/deploy.yml
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── collections-section.tsx
│   ├── footer.tsx
│   ├── header.tsx
│   ├── heritage-section.tsx
│   ├── hero-section.tsx
│   ├── newsletter.tsx
│   ├── theme-provider.tsx
│   ├── top-picks.tsx
│   └── winter-campaign.tsx
├── hooks/
├── lib/
├── public/
├── styles/
├── next.config.mjs
├── package.json
├── tailwind.config.js
└── tsconfig.json
```