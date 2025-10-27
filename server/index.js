import express from "express";
import admin from "./firebaseAdmin.js";

// Import routes
import studentsRouter from "./routes/students.js";
import packagesRouter from "./routes/packages.js";
import purchasesRouter from "./routes/purchases.js";
import withdrawalsRouter from "./routes/withdrawals.js";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// ✅ Test route — check if server is live
app.get("/", (req, res) => {
  res.send("✅ Server is live and working fine!");
});

// API Routes
app.use("/api/students", studentsRouter);
app.use("/api/packages", packagesRouter);
app.use("/api/purchases", purchasesRouter);
app.use("/api/withdrawals", withdrawalsRouter);

// ✅ Port setup for Render or local
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
  
  // Test Firebase connection
  admin.firestore().listCollections()
    .then(() => console.log("✅ Firebase Admin SDK connected successfully"))
    .catch(error => console.error("❌ Firebase Admin SDK connection failed:", error.message));
});