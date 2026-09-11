// NERA-SMART Express Backend Server Entry Point

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Mount API routes
app.use("/api", apiRoutes);

// Root landing endpoint
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>NERA-SMART Backend API</title></head>
      <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 40px;">
        <h1 style="color: #38bdf8;">NERA-SMART Backend Intelligence API</h1>
        <p>Logistics Engine for North East Region of India</p>
        <ul>
          <li><strong>Health Check:</strong> <a style="color: #34d399;" href="/api/health">/api/health</a></li>
          <li><strong>Hubs API:</strong> <a style="color: #34d399;" href="/api/hubs">/api/hubs</a></li>
          <li><strong>Risks API:</strong> <a style="color: #34d399;" href="/api/risks">/api/risks</a></li>
          <li><strong>Accessibility API:</strong> <a style="color: #34d399;" href="/api/accessibility">/api/accessibility</a></li>
          <li><strong>Analytics API:</strong> <a style="color: #34d399;" href="/api/analytics">/api/analytics</a></li>
          <li><strong>Route Analysis:</strong> POST /api/routes/analyze</li>
        </ul>
      </body>
    </html>
  `);
});

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 NERA-SMART Backend Server running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`⚠️ Port ${PORT} is already in use by an active NERA-SMART backend instance. Using existing instance.`);
  } else {
    console.error("Server error:", err);
  }
});
