import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables from .env file if it exists
dotenv.config();

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

if (missingEnvVars.length > 0) {
  console.warn("⚠️  Warning: Missing Firebase Admin SDK environment variables:", missingEnvVars.join(', '));
  console.warn("Using hardcoded development credentials for testing purposes only.");
  
  // Use development credentials only if environment variables are missing
  // NOTE: These should never be used in production!
  serviceAccount.type = "service_account";
  serviceAccount.project_id = "youthpargati-e975a";
  serviceAccount.private_key_id = "ec23b6334ff05110a5d41a7aecefe28c5cd564d5";
  serviceAccount.private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDbxngtnE0vlWW4\nA4d49SdNo4b/vyMFHb2sVuJwChXVZMz5BNLo+QfaTKdOWHralqN/tx+4Rm3zBqNT\nwpEt+heC5blCvNC6PZ6gS83h3rfR54xA0RYsa/cH/EhMqVNLvcMaDbU5xIj/ezQ+\nrWezEgJmeYAxPGuZOXqFeAAYphAu8mAKlriIop31eG+X7VV7KOYH5fUJ+hp/TNxe\nLHA5vrGl21b0AcdWI8v07mi/N5GFTu3hbaaeupZl0ozDqFb+Uhg2OUmDDyiT+5sX\nXcIXaRbDL1nuF+kuVGK8gMFt0YkVKzCjh7hShE/DrJNnq6fvbfKrLcjMUH7eGL0P\nNnnpx60pAgMBAAECggEAC7Dj2TdIktita8vCQ+C0qchiaM3j4MSLf7SygHfE4BBn\n5/JF/u8qaAYuWzhRNroPMf7NkOmsNSKcAxtlSi8U25l5UK/HIbUf8FJ//f0xRZj9\n6L/GoG/Q2QumU++o9u0+CO+EPbGzAPYumgvy6X9ygb2CYHwglCrO1fVDegwxbbHN\nQ15JVIA3zKe0y4+493RDxIz615i3EVqh+a3zqFRO9STM4+FXd2eqqOU73f8BuROD\nsKSAey1Rl29POUQ3Qfhu90MsZ+VT3ojCThtOvynbpkgQqv00xZGP+am+J5Pux4KR\nrownVw2OVBrAssPOemPGzw/UF1T6K4k1OiJYRHDSYQKBgQD0W+k2jVLi+M/nehID\nwYymafbTGLGy211jILxbUiBpwrDbOVAKmvhJ/VoGxe//t+5s8oHhlygWbh56SYwE\nT8BmxNa7zInnF4jm8om22ahP/CrpUQ7I4VOFLJIbzDfmjObHYRnkwxIaRBSIlJZd\nFrc/TPvq1h0sQvMQuxMoa1nAGQKBgQDmPr8UeXaETutbna5XKhJiG0NickLBxbL6\njEpCFMNAMu4eyeVaNHNM6I1n4u3SAwmwMXQ7kkMVH+7E1g0VjhR/VHrBVIJfXU3C\n27zLmMNzvBQjuhGR6mWzq+S/RZ74GjRs/vUrKseGyyFkR+4w0a6p6DxR3H6W84fe\nRgirhKC3kQKBgGOLlcP9aojAJ6H63p/dFzkr7bstUia0qqSZT2I8YKv0/iswe+T2\nILOznBsqQ4z/FwgW+sY118Tbc1sJ3xpaitzSz0+OEZesxL6gi22L2b9L0QdfWBCJ\nioa0E4lzdkpbmCAc9Hl25kcA+QRy05Z0jI4jBHU0aIoBdBeavkE3CkbxAoGAd5mi\nckVB7ip8kYOP+1EsaW/WCf5mdPd4KDPVowvb/K44CSBBFiFmv02RnqQ/ezb+wlp+\nES/BzuhehDrYYxkBxr6gYWq/qj/yU8UHBg9df/Hz2DcgR1al67XfxgepMyGRmAi8\nW+cF7Bv6RXgj35IcE8BCDRfnXgw0yJ5ChK4JOjECgYB2dEW9yxkGX5l16xIxvFlq\nW1Iz63grFuxoxjvbk7KNE+cPkb90blcjbdyyySxpH8Q9F59OIycBScCdh3GwIjDG\n9wKDM1e7dJqhV1GnJLV/krf8O0sLibBjNi3Z2L2g2Uy0ThuIXBpDVcKpQ1KRdbex\nayWL7Ve7MJpd1Jaw4wbgfw==\n-----END PRIVATE KEY-----\n";
  serviceAccount.client_email = "firebase-adminsdk-fbsvc@youthpargati-e975a.iam.gserviceaccount.com";
  serviceAccount.client_id = "106891753862855665340";
  serviceAccount.auth_uri = "https://accounts.google.com/o/oauth2/auth";
  serviceAccount.token_uri = "https://oauth2.googleapis.com/token";
  serviceAccount.auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs";
  serviceAccount.client_x509_cert_url = "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40youthpargati-e975a.iam.gserviceaccount.com";
} else {
  console.log("✅ Firebase Admin SDK credentials loaded from environment variables");
  // Log masked versions of sensitive data for debugging (without revealing the actual values)
  console.log("Firebase Project ID:", serviceAccount.project_id);
  console.log("Firebase Client Email:", serviceAccount.client_email);
  console.log("Firebase Private Key ID:", serviceAccount.private_key_id);
  console.log("Firebase Private Key length:", serviceAccount.private_key ? `${serviceAccount.private_key.length} characters` : 'undefined');
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin SDK initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
  console.error("Please check your Firebase credentials and environment variables");
}

export default admin;