import express from "express";

const app = express();

// ✅ Test route — check if server is live
app.get("/", (req, res) => {
  res.send("✅ Server is live and working fine!");
});

// ✅ Port setup for Render or local
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});