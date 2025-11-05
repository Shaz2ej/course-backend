#!/usr/bin/env node

/**
 * Netlify Cache Clearing Script
 * 
 * This script provides instructions for clearing Netlify's build cache
 * to resolve module import issues.
 * 
 * To clear Netlify cache:
 * 1. Go to your site settings in Netlify
 * 2. Navigate to "Build & deploy" > "Cache"
 * 3. Click "Clear cache"
 * 4. Trigger a new build
 * 
 * Alternatively, you can trigger a new build with the "Clear cache and deploy site" option
 */

console.log(`
========================================
Netlify Cache Clearing Instructions
========================================

To fix the Firebase import error:

1. Go to your Netlify dashboard
2. Select your site
3. Go to "Deploys" tab
4. Click "Trigger deploy" dropdown
5. Select "Clear cache and deploy site"

This will force Netlify to do a clean build without cached modules.

For future reference, to prevent such issues:
- Always check for unused imports before deploying
- Clear cache periodically on Netlify
- Use relative imports instead of absolute paths when possible
`);