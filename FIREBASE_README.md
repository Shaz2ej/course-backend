# ⚠️ Firebase Configuration Warning

## Important Security Notice

This project contains Firebase configuration files that are for development purposes only:

- `firebase.json` - Basic Firebase configuration
- `firestore.rules` - Development security rules

## ⚠️ WARNING: Security Risk

The current Firestore rules allow read/write access to all documents for authenticated users. This is insecure for production use.

For production deployment, you MUST:

1. Update `firestore.rules` with proper security rules
2. Replace development credentials with production credentials
3. Never commit actual credentials to version control

## Manual Configuration Required

Before deploying to production, you MUST:

1. Update Firebase project settings in `server/firebaseAdmin.js`
2. Set environment variables in your deployment environment:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - And other required Firebase credentials

See [USER ACTION NEEDED] section for details.