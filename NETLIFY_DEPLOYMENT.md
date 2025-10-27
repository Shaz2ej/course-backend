# Deploying to Netlify

This guide explains how to deploy the Course Admin Panel to Netlify with proper environment configuration.

## Prerequisites

1. A [Netlify](https://netlify.com) account
2. A GitHub/GitLab/Bitbucket account
3. A deployed backend API (on Render or similar platform)

## Deployment Steps

### 1. Prepare Your Repository

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Ensure your repository includes all necessary files:
   - Source code in the `src/` directory
   - [package.json](file:///c:/Users/xcore/Downloads/course-admin-panel/package.json) with build scripts
   - [netlify.toml](file:///c:/Users/xcore/Downloads/course-admin-panel/netlify.toml) configuration (we've already created this)
   - Environment configuration files ([.env.production](file:///c:/Users/xcore/Downloads/course-admin-panel/.env.production))

### 2. Connect Netlify to Your Repository

1. Log in to your Netlify account
2. Click "New site from Git"
3. Select your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select the repository containing your Course Admin Panel code
6. Netlify will automatically detect the build settings from [netlify.toml](file:///c:/Users/xcore/Downloads/course-admin-panel/netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`

### 3. Configure Environment Variables

In the Netlify deployment settings, configure the following environment variables:

1. In the Netlify dashboard, go to your site settings
2. Navigate to "Build & deploy" → "Environment"
3. Add the following variables:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `REACT_APP_API_URL` | Your backend API URL | `https://your-backend.onrender.com/api` |
| `REACT_APP_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyB12a7wA9cD5eFgHiJkLmNoPqRsTuVwXyz` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `your-project.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase Project ID | `your-project-id` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `your-project.appspot.com` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789012` |
| `REACT_APP_FIREBASE_APP_ID` | Firebase App ID | `1:123456789012:web:abcdef1234567890abcdef` |

### 4. Deploy Your Site

1. Click "Deploy site"
2. Netlify will automatically run the build process
3. Once complete, your site will be available at a Netlify URL (e.g., `https://your-site.netlify.app`)

## Custom Domain (Optional)

To use a custom domain:

1. In your Netlify site settings, go to "Domain management"
2. Add your custom domain
3. Follow the DNS configuration instructions provided by Netlify
4. Update your DNS records with your domain registrar

## Troubleshooting

### Build Issues

If your build fails:

1. Check the build logs in the Netlify dashboard
2. Ensure all dependencies are correctly listed in [package.json](file:///c:/Users/xcore/Downloads/course-admin-panel/package.json)
3. Verify environment variables are correctly configured

### API Connection Issues

If your frontend can't connect to your backend:

1. Ensure `REACT_APP_API_URL` is correctly set to your backend URL
2. Check that your backend is deployed and accessible
3. Verify CORS settings on your backend to allow requests from your Netlify domain

### Environment Variables Not Loading

If environment variables aren't being loaded:

1. Make sure all variable names start with `REACT_APP_`
2. Restart the build process after updating environment variables
3. Check that you're accessing variables correctly in your code with `process.env.REACT_APP_VARIABLE_NAME`

## Updating Your Deployment

To update your deployed site:

1. Push changes to your connected Git repository
2. Netlify will automatically trigger a new build
3. Monitor the build process in your Netlify dashboard

For manual deployments:

1. In your Netlify dashboard, go to "Deploys"
2. Drag and drop your built files to the deploy area
3. Or use the Netlify CLI to deploy from your local machine