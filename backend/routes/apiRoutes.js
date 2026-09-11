// Express API Router for NERA-SMART Logistics Backend

const express = require("express");
const router = express.Router();

const {
  NERA_HUBS,
  CARGO_PROFILES,
  VEHICLE_PROFILES,
  LIVE_RISKS,
  STATE_ACCESSIBILITY,
  VULNERABLE_DISTRICTS,
  CRITICAL_CHOKEPOINTS,
  ANALYTICS_DATA,
} = require("../data/neraDatabase");

const { executeRoutePipeline } = require("../services/routeEngine");

// GET /api/health - Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "online",
    service: "NERA-SMART Backend Engine",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// GET /api/hubs - List all 12 NERA hubs
router.get("/hubs", (req, res) => {
  res.json({
    success: true,
    count: NERA_HUBS.length,
    hubs: NERA_HUBS,
  });
});

// GET /api/profiles - Cargo & vehicle profiles metadata
router.get("/profiles", (req, res) => {
  res.json({
    success: true,
    cargoProfiles: CARGO_PROFILES,
    vehicleProfiles: VEHICLE_PROFILES,
  });
});

// POST /api/routes/analyze - Main 13-stage AI Route Pipeline execution
router.post("/routes/analyze", (req, res) => {
  try {
    const { origin, destination, cargoType, vehicleType } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameters: origin and destination are required.",
      });
    }

    const result = executeRoutePipeline(
      origin,
      destination,
      cargoType || "Medical Supplies",
      vehicleType || "Heavy Truck"
    );

    res.json(result);
  } catch (err) {
    console.error("Error executing route pipeline:", err);
    res.status(500).json({
      success: false,
      error: "Internal Route Pipeline Error",
      details: err.message,
    });
  }
});

// GET /api/risks - Real-time regional risk feed with optional query filters
router.get("/risks", (req, res) => {
  const { category, severity, search } = req.query;

  let filtered = [...LIVE_RISKS];

  if (category && category !== "All") {
    filtered = filtered.filter(
      (r) => r.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (severity && severity !== "All") {
    filtered = filtered.filter(
      (r) => r.severity.toLowerCase() === severity.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.state.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.corridor.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: filtered.length,
    totalCount: LIVE_RISKS.length,
    risks: filtered,
  });
});

// GET /api/accessibility - State accessibility metrics & vulnerable districts
router.get("/accessibility", (req, res) => {
  res.json({
    success: true,
    stateAccessibility: STATE_ACCESSIBILITY,
    vulnerableDistricts: VULNERABLE_DISTRICTS,
    criticalChokepoints: CRITICAL_CHOKEPOINTS,
  });
});

// GET /api/analytics - Analytics dashboard insights
router.get("/analytics", (req, res) => {
  res.json({
    success: true,
    analytics: ANALYTICS_DATA,
  });
});

module.exports = router;
