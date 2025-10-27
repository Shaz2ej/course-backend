// Test script to verify Firebase Admin SDK configuration
import admin from "./firebaseAdmin.js";

console.log("Testing Firebase Admin SDK configuration...");

// Test connection by listing collections
admin.firestore().listCollections()
  .then(collections => {
    console.log("✅ Firebase Admin SDK is properly configured");
    console.log("Available collections:");
    collections.forEach(collection => {
      console.log(`  - ${collection.id}`);
    });
  })
  .catch(error => {
    console.error("❌ Firebase Admin SDK configuration error:", error.message);
    console.error("Please check your environment variables");
  })
  .finally(() => {
    // Exit the process
    process.exit(0);
  });