import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Service account key from environment variables
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECT_ID || "youthpargati-e975a",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID || "YOUR_PRIVATE_KEY_ID",
  "private_key": process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-xxxxx@youthpargati-e975a.iam.gserviceaccount.com",
  "client_id": process.env.FIREBASE_CLIENT_ID || "YOUR_CLIENT_ID",
  "auth_uri": process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
  "token_uri": process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40youthpargati-e975a.iam.gserviceaccount.com"
};

// Initialize Firebase Admin SDK
const adminApp = initializeApp({
  credential: cert(serviceAccount)
});

// Get Firestore instance
const db = getFirestore(adminApp);

export { db };