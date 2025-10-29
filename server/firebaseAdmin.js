// ⚠️ WARNING: This is a secure Firebase Admin SDK configuration.
// ⚠️ WARNING: NEVER store actual credentials in version control.
// ⚠️ WARNING: Always use environment variables for production.

import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables from .env file if it exists
dotenv.config();

// ⚠️ CRITICAL SECURITY WARNING: All Firebase credentials must be loaded from environment variables
// ⚠️ NEVER hardcode actual credentials in source code
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Check if required environment variables are present
const missingEnvVars = [];
if (!process.env.FIREBASE_PROJECT_ID) missingEnvVars.push('FIREBASE_PROJECT_ID');
if (!process.env.FIREBASE_PRIVATE_KEY) missingEnvVars.push('FIREBASE_PRIVATE_KEY');
if (!process.env.FIREBASE_CLIENT_EMAIL) missingEnvVars.push('FIREBASE_CLIENT_EMAIL');

// ⚠️ SECURITY CRITICAL: Fail fast if credentials are missing in production
if (missingEnvVars.length > 0) {
  console.warn("⚠️  Warning: Missing Firebase Admin SDK environment variables:", missingEnvVars.join(', '));
  
  // ⚠️ SECURITY WARNING: Only allow missing credentials in development, not production
  if (process.env.NODE_ENV === 'production') {
    console.error("❌ CRITICAL SECURITY ERROR: Firebase Admin SDK credentials are required in production");
    console.error("Please set all required Firebase environment variables");
    process.exit(1);
  } else {
    console.warn("⚠️  DEVELOPMENT ONLY: Running without Firebase credentials. Some features may not work.");
  }
} else {
  console.log("✅ Firebase Admin SDK credentials loaded from environment variables");
  // Log masked versions of sensitive data for debugging (without revealing the actual values)
  console.log("Firebase Project ID:", serviceAccount.project_id);
  console.log("Firebase Client Email:", serviceAccount.client_email);
  console.log("Firebase Private Key ID:", serviceAccount.private_key_id);
  console.log("Firebase Private Key length:", serviceAccount.private_key ? `${serviceAccount.private_key.length} characters` : 'undefined');
}

// ⚠️ SECURITY CRITICAL: Initialize Firebase Admin SDK with service account credentials
try {
  // ⚠️ WARNING: Never initialize with default credentials in production
  // ⚠️ WARNING: Always use service account credentials for server-side operations
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin SDK initialized successfully");
  
  // ⚠️ SECURITY WARNING: Log initialization status but never log actual credentials
  console.log("Firebase Admin SDK initialized with project:", serviceAccount.project_id);
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
  console.error("Please check your Firebase credentials and environment variables");
  
  // ⚠️ SECURITY CRITICAL: Don't expose sensitive error details in production
  if (process.env.NODE_ENV === 'development') {
    console.error("Debug info:", error);
  }
}

export default admin;