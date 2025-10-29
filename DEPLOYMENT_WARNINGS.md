# ⚠️ Deployment Warnings and Instructions

## ⚠️ Critical Security Warnings

### Firebase Configuration
- **WARNING**: The current Firebase configuration contains development credentials
- **WARNING**: Never commit actual credentials to version control
- **WARNING**: Update `firestore.rules` with proper security rules for production

### Environment Variables
- **WARNING**: Ensure all required environment variables are set in your deployment environment
- **WARNING**: The `.env` file is gitignored for security - you must set variables in your deployment platform

## ⚠️ Build/Deployment Configuration Warnings

### Node.js Version
- **WARNING**: If changing Node version, update everywhere:
  - `.nvmrc`
  - `package.json` engines field
  - Netlify settings
  - Local development environment

### Package Manager
- **WARNING**: This project uses pnpm - ensure your deployment environment supports it
- **WARNING**: After major upgrades, run `pnpm install` to update lockfile

### Vite Configuration
- **WARNING**: If changing build settings, test both development and production builds
- **WARNING**: Ensure all aliases in `vite.config.js` match your project structure

## ⚠️ Error Handling
- **WARNING**: ErrorBoundary component prevents app crashes but should not expose debug info in production
- **WARNING**: Monitor error logs in production environment

## Manual Configuration Required

See [USER ACTION NEEDED] section for detailed instructions on:
1. Setting environment variables in Netlify UI
2. Updating Firebase credentials
3. Configuring production security rules