# GitHub Pages Deployment Guide

## Quick Start

### 1. Create GitHub Repository
- Go to [GitHub.com](https://github.com)
- Click "+" → "New repository"
- Name: `icon-customizer`
- Description: "Web-based icon customization tool for Windows start menu"
- Public repository
- Don't initialize with README (we already have one)

### 2. Upload Files to GitHub

#### Option A: Using Git Commands (Recommended)
```bash
# Navigate to your project folder
cd IconMaker

# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Icon Customizer app"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/icon-customizer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Option B: Using GitHub Web Interface
1. Go to your new repository on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop all files from your IconMaker folder:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
   - `.nojekyll`
4. Click "Commit changes"

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **Deploy from a branch**
5. Select **main** branch and **/(root)** folder
6. Click **Save**

### 4. Access Your Live Site
- Your site will be available at: `https://YOUR_USERNAME.github.io/icon-customizer/`
- First deployment may take 1-5 minutes
- You'll see a green checkmark when it's live

## File Structure for GitHub Pages
```
icon-customizer/
├── index.html          # Main application
├── styles.css          # Styling
├── app.js             # Application logic
├── README.md          # Documentation
├── .nojekyll          # Prevents Jekyll processing
└── DEPLOYMENT.md      # This file
```

## Troubleshooting

### Common Issues

**1. 404 Error**
- Check if repository name matches URL exactly
- Ensure files are in root directory
- Wait a few minutes for deployment

**2. Page Not Loading Properly**
- Check browser console for errors
- Ensure all files are uploaded
- Verify `.nojekyll` file is present

**3. Custom Domain Not Working**
- Wait 24 hours for DNS propagation
- Check CNAME file configuration
- Verify DNS settings with domain provider

### Updating Your Site
```bash
# Make your changes locally
# Then commit and push
git add .
git commit -m "Update: description of changes"
git push origin main
```

## Features Checklist
- [x] Background customization
- [x] Screenshot processing with 3D effects
- [x] App icon watermark
- [x] Rich text formatting
- [x] Gradient overlay
- [x] Real-time preview
- [x] PNG export
- [x] Mobile responsive
- [x] GitHub Pages ready

## Support
If you encounter issues:
1. Check the browser console for errors
2. Verify all files are in the repository
3. Ensure GitHub Pages is enabled
4. Check repository settings

## Custom Domain (Optional)
To use a custom domain:
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. Add `CNAME` file with your domain name
3. Configure DNS records:
   - Type: CNAME
   - Name: www (or @ for root)
   - Value: YOUR_USERNAME.github.io
4. Wait for DNS propagation (up to 24 hours)