// Dynamic NERA AI Route Engine Service executing the 13-Stage Logistics Workflow Pipeline:
// 1. User Input -> 2. Origin+Destination -> 3. Cargo+Vehicle -> 4. Available Routes ->
// 5. Weather Analysis -> 6. Terrain Analysis -> 7. Road/Risk Analysis -> 8. Accessibility Analysis ->
// 9. AI Risk & Delay Prediction -> 10. Route Scoring -> 11. Routes Comparison ->
// 12. Dynamic AI Recommended Route Selection -> 13. Dashboard + Telemetry Explanation Payload.

const {
  NERA_HUBS,
  CARGO_PROFILES,
  VEHICLE_PROFILES,
  STATE_ACCESSIBILITY,
  VULNERABLE_DISTRICTS,
  getDistance,
} = require("../data/neraDatabase");

const { analyzeWeather } = require("./weatherService");
const { analyzeTerrain } = require("./terrainService");
const { analyzeRoadRisk } = require("./roadRiskService");

/**
 * Generates dynamic, context-aware highway corridor names based on origin and destination.
 */
function getDynamicCorridorNames(origin, dest) {
  const pair = [origin.id, dest.id].sort().join("-");

  if (pair === "aizawl-silchar") {
    return {
      a: { name: "NH-306 Direct Highway", via: "Via Silchar - Vairengte Asphalt Trunk", summary: "Primary direct inter-state National Highway" },
      b: { name: "AI Bypass via Kolasib Ridge", via: "Via AI Low-Displacement Ridge Bypass", summary: "Smart bypass routing around active mudslide sections" },
      c: { name: "NH-108 State Ridge Corridor", via: "Via Rengtekawn All-Terrain Alternate", summary: "High-clearance ridge detour for heavy weather clearance" },
    };
  }

  if (pair === "guwahati-imphal") {
    return {
      a: { name: "NH-27 Expressway via Dimapur", via: "Via Nagaon - Dimapur 4-Lane Trunk", summary: "High capacity national expressway corridor" },
      b: { name: "AI Bypass via Noney Creep Avoidance", via: "Via FastPass Hills & Awangkhul Bypass", summary: "Sensored corridor avoiding active Noney soil creep" },
      c: { name: "Old Cachar Mountain Highway", via: "Via Jiribam Inland Ridge Route", summary: "Heavy load contingency pass with single-lane regulation" },
    };
  }

  if (pair === "guwahati-shillong") {
    return {
      a: { name: "NH-06 Plateau Expressway", via: "Via Jorabat - Umiam Lake Highway", summary: "4-lane paved mountain ascent expressway" },
      b: { name: "AI Mawryngkneng Cloud Bypass", via: "Via AI Fog Radar Bypass & East Khasi Ridge", summary: "Low-visibility radar guided bypass corridor" },
      c: { name: "State Highway 1 Old Plateau Pass", via: "Via Mawlyndep Hinterland Spur", summary: "Secondary plateau road bypassing main toll plazas" },
    };
  }

  if (pair === "dimapur-kohima") {
    return {
      a: { name: "NH-29 Mountain Corridor", via: "Via Chumukedima Hairpin Curves", summary: "Direct national highway connecting Dimapur & Kohima" },
      b: { name: "AI Peducha Slope Bypass", via: "Via Regulated Smart Hill Bypass", summary: "Avoids loose gravel and silt subsidence bends" },
      c: { name: "Tsiesema Inland Ridge Track", via: "Via Inland State Highway Alternate", summary: "High elevation dry surface alternate route" },
    };
  }

  if (pair === "gangtok-guwahati" || pair === "gangtok-tezpur") {
    return {
      a: { name: "NH-10 Teesta River Highway", via: "Via Rangpo & Sevoke Bridge Transit", summary: "Primary Himalayan river valley corridor" },
      b: { name: "AI Lava-Algarah High Bypass", via: "Via High Altitude Flood-Safe Pass", summary: "Bypasses Teesta river inundation hazard zones" },
      c: { name: "Dooars Plain Circuit Highway", via: "Via Malbazar Foothill Detour", summary: "Longer lowland bypass for severe weather closures" },
    };
  }

  // Generic Dynamic Naming based on hub names
  return {
    a: { name: `NH Main Corridor (${origin.name} → ${dest.name})`, via: `Via Direct NH Network`, summary: `Primary Direct Highway Connection` },
    b: { name: `AI Smart Bypass (${origin.name} → ${dest.name})`, via: `Via AI Weather-Radar Bypass`, summary: `Optimized via AI sensor telemetry & smart bypasses` },
    c: { name: `State Ridge Alternate (${origin.name} → ${dest.name})`, via: `Via Ridge Bypass Highway`, summary: `High-clearance mountain ridge alternate` },
  };
}

function executeRoutePipeline(originId, destId, cargoType = "Medical Supplies", vehicleType = "Heavy Truck") {
  // STAGE 1: User Input Validation
  const origin = NERA_HUBS.find((h) => h.id === originId) || NERA_HUBS[0];
  const dest = NERA_HUBS.find((h) => h.id === destId) || NERA_HUBS[3];
  const cargo = CARGO_PROFILES[cargoType] || CARGO_PROFILES["Medical Supplies"];
  const vehicle = VEHICLE_PROFILES[vehicleType] || VEHICLE_PROFILES["Heavy Truck"];

  // STAGE 2: Base Distance & Speed Calculation
  const baseDistance = getDistance(origin.id, dest.id);
  const baseSpeed = 48 * vehicle.speedMultiplier;

  // Get Contextual Highway Names
  const names = getDynamicCorridorNames(origin, dest);

  // STAGE 3: Available Routes Candidate Discovery
  const candidateCorridors = [
    {
      id: "route-b",
      name: names.b.name,
      summary: names.b.summary,
      distanceKm: Math.round(baseDistance * 0.94),
      speedFactor: 1.08,
      terrainMultiplier: 0.92,
      via: names.b.via,
      type: "bypass",
    },
    {
      id: "route-a",
      name: names.a.name,
      summary: names.a.summary,
      distanceKm: baseDistance,
      speedFactor: 1.0,
      terrainMultiplier: 1.0,
      via: names.a.via,
      type: "direct",
    },
    {
      id: "route-c",
      name: names.c.name,
      summary: names.c.summary,
      distanceKm: Math.round(baseDistance * 1.12),
      speedFactor: 0.95,
      terrainMultiplier: 1.0,
      via: names.c.via,
      type: "contingency",
    },
  ];

  const formatDuration = (decHours) => {
    const hrs = Math.floor(decHours);
    const mins = Math.round((decHours - hrs) * 60);
    return `${hrs}h ${mins}m`;
  };

  const fuelCostPerKm = 105; // INR / Liter approx

  // Process candidate routes through Stage 4 to 9
  const processedRoutes = candidateCorridors.map((candidate) => {
    const dist = candidate.distanceKm;

    // STAGE 4: Weather Analysis
    const weather = analyzeWeather(candidate.id, origin.state, dest.state);

    // STAGE 5: Terrain Analysis
    const terrain = analyzeTerrain(candidate.id, origin, dest, vehicle);

    // STAGE 6: Road / Infrastructure Risk Analysis
    const roadRisk = analyzeRoadRisk(candidate.id, origin, dest, cargo);

    // STAGE 7: Accessibility Analysis
    const originStateAccess = STATE_ACCESSIBILITY.find((s) => s.state === origin.state) || STATE_ACCESSIBILITY[0];
    const destStateAccess = STATE_ACCESSIBILITY.find((s) => s.state === dest.state) || STATE_ACCESSIBILITY[0];
    const avgStateAccessScore = Math.round((originStateAccess.index + destStateAccess.index) / 2);

    const vulnerableDistrict = VULNERABLE_DISTRICTS.find(
      (v) => v.state === dest.state || v.state === origin.state
    );
    const isolationPenalty = vulnerableDistrict ? 6 : 0;
    const finalAccessScore = Math.max(45, Math.min(98, avgStateAccessScore - isolationPenalty + (candidate.type === "bypass" ? 8 : candidate.type === "contingency" ? -5 : 0)));

    // STAGE 8: AI Risk & Delay Prediction
    const rawHours = (dist / (baseSpeed * candidate.speedFactor)) * (vehicle.terrainPenalty * candidate.terrainMultiplier);
    
    let baseDelayMins = Math.round(35 + dist / 20);
    if (candidate.type === "bypass") {
      baseDelayMins = Math.max(12, Math.round(baseDelayMins * 0.35));
    } else if (candidate.type === "contingency") {
      baseDelayMins = Math.round(baseDelayMins * 0.65);
    }

    const predictedDelayText = `${baseDelayMins} min`;
    const landslideRisk = terrain.landslideLikelihood;

    // STAGE 9: Route Scoring
    let safetyScore = 78 - Math.round(roadRisk.corridorHazardScore * 0.4) - Math.round(weather.weatherRiskScore * 0.3);
    if (candidate.type === "bypass") safetyScore += 16;
    if (candidate.type === "contingency") safetyScore += 6;
    safetyScore = Math.max(48, Math.min(98, Math.round(safetyScore / cargo.safetyWeight)));

    let efficiencyScore = candidate.type === "bypass" ? 92 : candidate.type === "direct" ? 78 : 68;

    // Financial & Carbon metrics
    const fuelCostMultiplier = candidate.type === "bypass" ? 1.25 : candidate.type === "direct" ? 1.4 : 1.55;
    const estCost = Math.round(dist * parseFloat(vehicle.fuelPerKm) * fuelCostPerKm * fuelCostMultiplier);
    const carbonKg = Math.round(dist * vehicle.carbonKgPerKm);

    // Multi-Criteria AI Utility Function (Weights adapt by cargo profile)
    let wSafety = 0.40;
    let wAccess = 0.25;
    let wEfficiency = 0.35;

    if (cargoType === "Medical Supplies") {
      wSafety = 0.55;
      wAccess = 0.25;
      wEfficiency = 0.20;
    } else if (cargoType === "Food & Agriculture") {
      wSafety = 0.30;
      wAccess = 0.20;
      wEfficiency = 0.50;
    } else if (cargoType === "Heavy Machinery") {
      wSafety = 0.50;
      wAccess = 0.35;
      wEfficiency = 0.15;
    }

    // Calculated utility score for dynamic recommendation
    const aiUtilityScore = parseFloat(
      (safetyScore * wSafety + finalAccessScore * wAccess + efficiencyScore * wEfficiency).toFixed(2)
    );

    // Checkpoints telemetry
    const checkpoints = [
      { name: `${origin.name} Freight Terminal`, status: "Clear", time: "+0m" },
      { name: "Central Highway Patrol Post", status: candidate.type === "bypass" ? "Active FastPass" : "Moderate Queue", time: "+2h 15m" },
      { name: "Protected Hill Corridor Section", status: candidate.type === "bypass" ? "Sensors Online" : "Caution Wet Surface", time: "+5h 00m" },
      { name: `${dest.name} Integrated Hub`, status: "Dock Open", time: `+${formatDuration(rawHours)}` },
    ];

    return {
      id: candidate.id,
      name: candidate.name,
      type: candidate.type,
      summary: candidate.summary,
      distance: `${dist} km`,
      rawDistanceKm: dist,
      duration: formatDuration(rawHours),
      rawDurationHours: parseFloat(rawHours.toFixed(2)),
      safetyScore,
      accessibilityScore: finalAccessScore,
      efficiencyScore,
      aiUtilityScore,
      weatherRisk: weather.riskLevel,
      landslideRisk,
      predictedDelay: predictedDelayText,
      estimatedCost: `₹${estCost.toLocaleString("en-IN")}`,
      rawEstimatedCost: estCost,
      carbonKg,
      via: candidate.via,
      checkpoints,
      stageAnalysis: {
        weather,
        terrain,
        roadRisk,
        accessibility: {
          score: finalAccessScore,
          originState: originStateAccess,
          destState: destStateAccess,
          vulnerableDistrict,
        },
      },
    };
  });

  // STAGE 10 & 11: Dynamic Recommendation & Ranking
  // Find highest scoring route dynamically
  let maxScore = -1;
  let recommendedId = "route-b";
  processedRoutes.forEach((r) => {
    if (r.aiUtilityScore > maxScore) {
      maxScore = r.aiUtilityScore;
      recommendedId = r.id;
    }
  });

  // Format dynamic badges, tags, and AI rationale for each route
  const finalRoutes = processedRoutes.map((r) => {
    const isRecommended = r.id === recommendedId;
    let badge = r.type === "direct" ? "STANDARD HIGHWAY" : r.type === "contingency" ? "CONTINGENCY MOUNTAIN ROUTE" : "AI OPTIMIZED BYPASS";
    let tag = r.type === "direct" ? "Direct Route" : r.type === "contingency" ? "Contingency" : "Alternative";

    if (isRecommended) {
      badge = "AI RECOMMENDED";
      tag = "Recommended";
    }

    let aiRationale = "";
    if (isRecommended) {
      aiRationale = `${r.name} is dynamically recommended for ${cargoType} by the AI engine (Utility Score: ${r.aiUtilityScore}). It balances minimal delay risk (${r.predictedDelay}), high safety score (${r.safetyScore}/100), and fuel efficiency across ${origin.name} to ${dest.name}.`;
    } else if (r.type === "direct") {
      aiRationale = `${r.name} follows the standard national highway alignment. Direct distance (${r.distance}), but subject to moderate traffic and monsoon weather delays.`;
    } else {
      aiRationale = `${r.name} provides high clearance mountain ridge bypass capabilities for heavy weather or road closure conditions.`;
    }

    return {
      ...r,
      badge,
      tag,
      isRecommended,
      aiRationale,
    };
  });

  const recommendedRoute = finalRoutes.find((r) => r.isRecommended) || finalRoutes[0];

  // STAGE 12 & 13: Dashboard + Explanation Payload
  return {
    success: true,
    timestamp: new Date().toISOString(),
    pipelineMetadata: {
      stagesExecuted: 13,
      engineVersion: "NERA-AI-v2.4",
      recommendationAlgorithm: "Multi-Criteria Dynamic Weighted Utility",
    },
    origin,
    dest,
    cargo,
    vehicle,
    routes: finalRoutes,
    recommendedRoute,
  };
}

module.exports = {
  executeRoutePipeline,
};
