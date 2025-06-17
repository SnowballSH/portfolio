# GitHub Pages Deployment Guide

This document explains how to deploy the SnowballSH Portfolio to GitHub Pages using GitHub Actions.

## 🚀 Deployment Setup

### Prerequisites
- Repository hosted on GitHub
- GitHub Pages enabled in repository settings
- Node.js v22.16.0 LTS
- pnpm package manager

### Configuration Files

#### 1. `astro.config.mjs`
```javascript
export default defineConfig({
  site: 'https://snowballsh.github.io',
  base: '/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

#### 2. `.github/workflows/deploy.yml`
Automated workflow that:
- Triggers on push to `main` branch
- Uses Node.js v22.16.0 LTS
- Installs dependencies with pnpm
- Runs type checking (`pnpm astro check`)
- Builds production site (`pnpm build`)
- Deploys to GitHub Pages

## 📋 Deployment Steps

### One-Time Setup

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"
   - Save settings

2. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "feat: add GitHub Pages deployment"
   git push origin main
   ```

3. **Monitor Deployment**
   - Go to Actions tab in GitHub
   - Watch the "Deploy to GitHub Pages" workflow
   - Site will be available at `https://snowballsh.github.io`

### Automatic Deployments

Every push to the `main` branch will automatically:
1. ✅ Run type checking
2. 🏗️ Build the static site
3. 🚀 Deploy to GitHub Pages
4. 🌐 Update live site

## 🛠️ Local Development

### Build and Preview
```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Type check
pnpm astro check
```

### Development Server
```bash
# Start development server
pnpm dev
```

## 📊 Build Information

- **Framework**: Astro 5.9.3
- **Styling**: Tailwind CSS 4.1.10
- **Package Manager**: pnpm
- **Output**: Static files in `./dist/`
- **Node Version**: v22.16.0 LTS

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check TypeScript errors: `pnpm astro check`
   - Verify dependencies: `pnpm install`

2. **Deployment Fails**
   - Check GitHub Actions logs
   - Verify repository permissions
   - Ensure GitHub Pages is enabled

3. **Assets Not Loading**
   - Verify `site` and `base` configuration in `astro.config.mjs`
   - Check asset paths in components

### Workflow Permissions

The deployment workflow requires these permissions:
- `contents: read` - To checkout code
- `pages: write` - To deploy to GitHub Pages
- `id-token: write` - For authentication

## 📈 Performance

The deployed site includes:
- ⚡ Static site generation for optimal performance
- 🎨 Optimized CSS and assets
- 📱 Responsive design
- ♿ Accessibility features
- 🔍 SEO optimization

## 🎯 Next Steps

After successful deployment:
1. Verify all pages load correctly
2. Test navigation and functionality
3. Check mobile responsiveness
4. Monitor Core Web Vitals
5. Set up custom domain (optional)