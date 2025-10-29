# ⚠️ SECURITY WARNING

## ⚠️ CRITICAL: Firebase Admin SDK Security

This directory contains Firebase Admin SDK configuration. **IMPORTANT SECURITY REMINDERS**:

## 🔒 NEVER DO THESE THINGS

1. **Never commit actual credentials to version control**
   - The `.env` file is gitignored for this reason
   - Use `.env.example` as a template only

2. **Never hardcode credentials in source code**
   - All credentials must come from environment variables
   - The `firebaseAdmin.js` file safely loads from environment variables

3. **Never expose credentials in logs or error messages**
   - The configuration logs only non-sensitive information
   - Sensitive data like private keys are never logged

## ✅ DO THESE THINGS

1. **Always use environment variables for credentials**
   ```bash
   # Set in your deployment environment
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   ```

2. **Regularly rotate service account keys**
   - Generate new keys in Firebase Console
   - Update environment variables with new keys
   - Revoke old keys after transition

3. **Use minimal permissions**
   - Create service accounts with only required permissions
   - Review and restrict permissions regularly

## 🛡️ Security Features of This Implementation

- Credentials loaded from environment variables only
- No hardcoded credentials in source code
- Proper error handling without exposing sensitive data
- Development vs. production environment detection
- Fail-fast behavior in production for missing credentials

## 📋 Deployment Checklist

Before deploying to production:

- [ ] Remove any development credentials from `.env`
- [ ] Set all required environment variables in deployment platform
- [ ] Verify Firebase security rules
- [ ] Test with production configuration
- [ ] Monitor logs for security warnings