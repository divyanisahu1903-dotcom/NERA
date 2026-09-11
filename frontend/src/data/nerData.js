// NER-SMART Logistics Intelligence Platform Data Engine
// Covers the 8 North Eastern Region (NER) states of India

export const NER_HUBS = [
  {
    id: "guwahati",
    name: "Guwahati",
    state: "Assam",
    coords: { x: 32, y: 44 }, // percentage for map canvas
    lat: 26.1445,
    lng: 91.7362,
    role: "Gateway Logistics Hub",
    elevation: "55m",
    hubsCount: 18,
    status: "Operational",
    weather: "Overcast, 28°C",
    roadIndex: 88,
  },
  {
    id: "shillong",
    name: "Shillong",
    state: "Meghalaya",
    coords: { x: 35, y: 56 },
    lat: 25.5788,
    lng: 91.8933,
    role: "Plateau Hub",
    elevation: "1,525m",
    hubsCount: 9,
    status: "Weather Alert",
    weather: "Heavy Rain, 19°C",
    roadIndex: 78,
  },
  {
    id: "silchar",
    name: "Silchar",
    state: "Assam",
    coords: { x: 48, y: 65 },
    lat: 24.8333,
    lng: 92.7789,
    role: "Barak Valley Gateway",
    elevation: "25m",
    hubsCount: 11,
    status: "Operational",
    weather: "Scattered Showers, 29°C",
    roadIndex: 72,
  },
  {
    id: "imphal",
    name: "Imphal",
    state: "Manipur",
    coords: { x: 67, y: 64 },
    lat: 24.817,
    lng: 93.9368,
    role: "Eastern Corridor Terminal",
    elevation: "786m",
    hubsCount: 8,
    status: "Caution",
    weather: "Light Fog, 22°C",
    roadIndex: 71,
  },
  {
    id: "agartala",
    name: "Agartala",
    state: "Tripura",
    coords: { x: 26, y: 78 },
    lat: 23.8315,
    lng: 91.2868,
    role: "Cross-Border Terminal",
    elevation: "15m",
    hubsCount: 7,
    status: "Operational",
    weather: "Clear, 31°C",
    roadIndex: 84,
  },
  {
    id: "aizawl",
    name: "Aizawl",
    state: "Mizoram",
    coords: { x: 46, y: 84 },
    lat: 23.7271,
    lng: 92.7176,
    role: "Southern Ridge Terminal",
    elevation: "1,132m",
    hubsCount: 5,
    status: "Operational",
    weather: "Mild Showers, 21°C",
    roadIndex: 68,
  },
  {
    id: "kohima",
    name: "Kohima",
    state: "Nagaland",
    coords: { x: 69, y: 51 },
    lat: 25.6751,
    lng: 94.1086,
    role: "Mountain Pass Transit",
    elevation: "1,444m",
    hubsCount: 6,
    status: "Caution",
    weather: "Cloudy, 18°C",
    roadIndex: 70,
  },
  {
    id: "dimapur",
    name: "Dimapur",
    state: "Nagaland",
    coords: { x: 60, y: 45 },
    lat: 25.9068,
    lng: 93.7274,
    role: "Rail & Multimodal Freight Hub",
    elevation: "145m",
    hubsCount: 12,
    status: "Operational",
    weather: "Humid, 27°C",
    roadIndex: 82,
  },
  {
    id: "itanagar",
    name: "Itanagar",
    state: "Arunachal Pradesh",
    coords: { x: 55, y: 22 },
    lat: 27.0844,
    lng: 93.6053,
    role: "Foothill Northern Hub",
    elevation: "320m",
    hubsCount: 6,
    status: "Operational",
    weather: "Partly Cloudy, 24°C",
    roadIndex: 75,
  },
  {
    id: "dibrugarh",
    name: "Dibrugarh",
    state: "Assam",
    coords: { x: 80, y: 24 },
    lat: 27.4728,
    lng: 94.912,
    role: "Upper Assam River-Rail Hub",
    elevation: "108m",
    hubsCount: 10,
    status: "Operational",
    weather: "Sunny, 30°C",
    roadIndex: 85,
  },
  {
    id: "tezpur",
    name: "Tezpur",
    state: "Assam",
    coords: { x: 44, y: 34 },
    lat: 26.6528,
    lng: 92.7926,
    role: "Central Brahmaputra Crossing",
    elevation: "48m",
    hubsCount: 7,
    status: "Operational",
    weather: "Clear, 29°C",
    roadIndex: 86,
  },
  {
    id: "gangtok",
    name: "Gangtok",
    state: "Sikkim",
    coords: { x: 10, y: 28 },
    lat: 27.3389,
    lng: 88.6065,
    role: "Himalayan Ridge Gateway",
    elevation: "1,650m",
    hubsCount: 4,
    status: "Caution",
    weather: "Mist & Drizzle, 16°C",
    roadIndex: 67,
  },
];

export const CARGO_PROFILES = {
  "Medical Supplies": {
    priority: "Urgent",
    safetyWeight: 1.35,
    delayTolerance: "Very Low",
    tempControlled: true,
    riskThreshold: "Strict",
    description: "Requires maximum route stability, climate-controlled corridor, and minimum delay volatility.",
  },
  "Food & Agriculture": {
    priority: "High",
    safetyWeight: 1.15,
    delayTolerance: "Low",
    tempControlled: true,
    riskThreshold: "Moderate",
    description: "Time-sensitive organic produce & staples. Bypasses prolonged mountain pass delays.",
  },
  "Electronics": {
    priority: "High",
    safetyWeight: 1.25,
    delayTolerance: "Medium",
    tempControlled: false,
    riskThreshold: "Low Vibration",
    description: "High-value fragile items. Demands smoother paved highways (NH-27 / NH-29).",
  },
  "General Cargo": {
    priority: "Standard",
    safetyWeight: 1.0,
    delayTolerance: "Standard",
    tempControlled: false,
    riskThreshold: "Standard",
    description: "Standard industrial goods and retail inventory with balanced cost vs speed optimization.",
  },
  "Heavy Machinery": {
    priority: "Standard",
    safetyWeight: 1.2,
    delayTolerance: "High",
    tempControlled: false,
    riskThreshold: "Bridge Load Limit",
    description: "Restricted by bridge weight capacities, overhead clearances, and steep hairpin turns.",
  },
};

export const VEHICLE_PROFILES = {
  "Heavy Truck": {
    speedMultiplier: 0.85,
    terrainPenalty: 1.3,
    fuelPerKm: "0.32 L",
    carbonKgPerKm: 0.84,
    hillCapability: "Moderate",
  },
  "Light Truck": {
    speedMultiplier: 1.0,
    terrainPenalty: 1.05,
    fuelPerKm: "0.18 L",
    carbonKgPerKm: 0.46,
    hillCapability: "High",
  },
  "Van": {
    speedMultiplier: 1.15,
    terrainPenalty: 0.95,
    fuelPerKm: "0.12 L",
    carbonKgPerKm: 0.31,
    hillCapability: "High",
  },
  "4x4 Hill Terrain Fleet": {
    speedMultiplier: 1.05,
    terrainPenalty: 0.8,
    fuelPerKm: "0.22 L",
    carbonKgPerKm: 0.55,
    hillCapability: "Maximum",
  },
};

// Distance matrix (approximate road km between hubs)
const DISTANCES = {
  "guwahati-imphal": 485,
  "guwahati-shillong": 98,
  "guwahati-silchar": 315,
  "guwahati-agartala": 550,
  "guwahati-aizawl": 470,
  "guwahati-kohima": 345,
  "guwahati-dimapur": 275,
  "guwahati-itanagar": 325,
  "guwahati-dibrugarh": 445,
  "guwahati-tezpur": 178,
  "guwahati-gangtok": 520,

  "shillong-silchar": 215,
  "shillong-agartala": 450,
  "shillong-imphal": 430,
  "shillong-aizawl": 380,

  "silchar-imphal": 255,
  "silchar-aizawl": 175,
  "silchar-agartala": 310,

  "imphal-kohima": 138,
  "dimapur-kohima": 74,
  "dimapur-imphal": 210,

  "tezpur-itanagar": 150,
  "tezpur-dibrugarh": 270,
  "dibrugarh-itanagar": 160,
};

export function getDistance(originId, destId) {
  if (originId === destId) return 25;
  const key1 = `${originId}-${destId}`;
  const key2 = `${destId}-${originId}`;
  if (DISTANCES[key1]) return DISTANCES[key1];
  if (DISTANCES[key2]) return DISTANCES[key2];

  // Fallback calculation via coordinates approximation
  const orig = NER_HUBS.find((h) => h.id === originId) || NER_HUBS[0];
  const dest = NER_HUBS.find((h) => h.id === destId) || NER_HUBS[3];
  const dx = orig.coords.x - dest.coords.x;
  const dy = orig.coords.y - dest.coords.y;
  const dist = Math.sqrt(dx * dx + dy * dy) * 8.8 + 45;
  return Math.round(dist);
}

// Generate comparative route plans dynamically
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

  return {
    a: { name: `NH Main Corridor (${origin.name} → ${dest.name})`, via: `Via Direct NH Network`, summary: `Primary Direct Highway Connection` },
    b: { name: `AI Smart Bypass (${origin.name} → ${dest.name})`, via: `Via AI Weather-Radar Bypass`, summary: `Optimized via AI sensor telemetry & smart bypasses` },
    c: { name: `State Ridge Alternate (${origin.name} → ${dest.name})`, via: `Via Ridge Bypass Highway`, summary: `High-clearance mountain ridge alternate` },
  };
}

export function calculateRoutes(originId, destId, cargoType = "Medical Supplies", vehicleType = "Heavy Truck") {
  const origin = NER_HUBS.find((h) => h.id === originId) || NER_HUBS[0];
  const dest = NER_HUBS.find((h) => h.id === destId) || NER_HUBS[3];
  const baseDistance = getDistance(origin.id, dest.id);

  const cargo = CARGO_PROFILES[cargoType] || CARGO_PROFILES["Medical Supplies"];
  const vehicle = VEHICLE_PROFILES[vehicleType] || VEHICLE_PROFILES["Heavy Truck"];

  const baseSpeed = 48 * vehicle.speedMultiplier;
  const names = getDynamicCorridorNames(origin, dest);

  const distA = baseDistance;
  const hoursA = (distA / baseSpeed) * vehicle.terrainPenalty;
  const safetyA = Math.max(52, Math.min(88, Math.round(76 - (distA > 400 ? 8 : 2))));
  const accessA = Math.max(60, Math.min(92, Math.round(78 - (distA > 400 ? 5 : 0))));
  const delayA = Math.round(35 + (distA / 20));

  const distB = Math.round(distA * 0.94);
  const hoursB = (distB / (baseSpeed * 1.08)) * (vehicle.terrainPenalty * 0.92);
  const safetyB = Math.min(96, safetyA + 14);
  const accessB = Math.min(96, accessA + 12);
  const delayB = Math.max(12, Math.round(delayA * 0.35));

  const distC = Math.round(distA * 1.12);
  const hoursC = (distC / (baseSpeed * 0.95)) * vehicle.terrainPenalty;
  const safetyC = Math.min(90, safetyA + 6);
  const accessC = Math.max(50, accessA - 8);
  const delayC = Math.round(delayA * 0.65);

  const formatDuration = (decHours) => {
    const hrs = Math.floor(decHours);
    const mins = Math.round((decHours - hrs) * 60);
    return `${hrs}h ${mins}m`;
  };

  const fuelCostPerKm = 105;
  const estCostA = Math.round(distA * parseFloat(vehicle.fuelPerKm) * fuelCostPerKm * 1.4);
  const estCostB = Math.round(distB * parseFloat(vehicle.fuelPerKm) * fuelCostPerKm * 1.25);
  const estCostC = Math.round(distC * parseFloat(vehicle.fuelPerKm) * fuelCostPerKm * 1.55);

  // Dynamic Multi-Criteria Utility Weighting
  let wSafety = 0.40;
  let wAccess = 0.25;
  let wEfficiency = 0.35;

  if (cargoType === "Medical Supplies") {
    wSafety = 0.55; wAccess = 0.25; wEfficiency = 0.20;
  } else if (cargoType === "Food & Agriculture") {
    wSafety = 0.30; wAccess = 0.20; wEfficiency = 0.50;
  } else if (cargoType === "Heavy Machinery") {
    wSafety = 0.50; wAccess = 0.35; wEfficiency = 0.15;
  }

  const scoreB = safetyB * wSafety + accessB * wAccess + 92 * wEfficiency;
  const scoreA = safetyA * wSafety + accessA * wAccess + 78 * wEfficiency;
  const scoreC = safetyC * wSafety + accessC * wAccess + 68 * wEfficiency;

  let recommendedId = "route-b";
  const maxScore = Math.max(scoreB, scoreA, scoreC);
  if (maxScore === scoreA) recommendedId = "route-a";
  if (maxScore === scoreC) recommendedId = "route-c";

  const buildRouteObj = (id, nameObj, dist, hours, safety, access, eff, delay, cost, type, isRec) => {
    let badge = type === "direct" ? "STANDARD HIGHWAY" : type === "contingency" ? "CONTINGENCY MOUNTAIN ROUTE" : "AI OPTIMIZED BYPASS";
    let tag = type === "direct" ? "Direct Route" : type === "contingency" ? "Contingency" : "Alternative";

    if (isRec) {
      badge = "AI RECOMMENDED";
      tag = "Recommended";
    }

    let aiRationale = isRec
      ? `${nameObj.name} is dynamically recommended by the AI decision engine for ${cargoType}. It achieves optimal trade-offs between safety (${safety}/100), transit delay (${delay} min), and efficiency.`
      : type === "direct"
      ? `${nameObj.name} follows the standard highway path. Direct distance (${dist} km), but subject to traffic queues and rain risks.`
      : `${nameObj.name} provides high clearance mountain ridge bypass capabilities.`;

    return {
      id,
      name: nameObj.name,
      badge,
      tag,
      isRecommended: isRec,
      summary: nameObj.summary,
      distance: `${dist} km`,
      duration: formatDuration(hours),
      rawDurationHours: hours,
      safetyScore: safety,
      accessibilityScore: access,
      efficiencyScore: eff,
      weatherRisk: type === "direct" ? "High" : "Low",
      landslideRisk: type === "contingency" ? "Low" : "Low-Moderate",
      predictedDelay: `${delay} min`,
      estimatedCost: `₹${cost.toLocaleString("en-IN")}`,
      carbonKg: Math.round(dist * vehicle.carbonKgPerKm),
      via: nameObj.via,
      checkpoints: [
        { name: `${origin.name} Freight Terminal`, status: "Clear", time: "+0m" },
        { name: "Central Highway Patrol Post", status: isRec ? "Active FastPass" : "Moderate Queue", time: "+2h 15m" },
        { name: "Protected Hill Corridor Section", status: "Sensors Online", time: "+5h 00m" },
        { name: `${dest.name} Integrated Hub`, status: "Dock Open", time: `+${formatDuration(hours)}` },
      ],
      aiRationale,
    };
  };

  const routes = [
    buildRouteObj("route-b", names.b, distB, hoursB, safetyB, accessB, 92, delayB, estCostB, "bypass", recommendedId === "route-b"),
    buildRouteObj("route-a", names.a, distA, hoursA, safetyA, accessA, 78, delayA, estCostA, "direct", recommendedId === "route-a"),
    buildRouteObj("route-c", names.c, distC, hoursC, safetyC, accessC, 68, delayC, estCostC, "contingency", recommendedId === "route-c"),
  ];

  return {
    origin,
    dest,
    cargo,
    vehicle,
    routes,
    recommendedRoute: routes.find((r) => r.isRecommended) || routes[0],
  };
}

// Live Regional Risk Feeds across the 8 NER States
export const LIVE_RISKS = [
  {
    id: "risk-1",
    state: "Meghalaya",
    corridor: "NH-06 / Shillong - Dawki Pass",
    title: "Dense Cloud & Torrential Rainfall",
    category: "Weather",
    severity: "Moderate",
    delayImpact: "+35 min",
    reported: "14 mins ago",
    status: "Active Monitoring",
    description: "Sustained rainfall exceeding 45mm/hr causing localized water pooling and reduced visibility below 40 meters on mountain curves.",
    detourAdvice: "Route via Mawryngkneng bypass; keep heavy vehicles at max 35 km/h with fog illumination engaged.",
  },
  {
    id: "risk-2",
    state: "Manipur",
    corridor: "NH-37 / Imphal - Jiribam Highway",
    title: "Slope Instability & Soil Creep",
    category: "Terrain",
    severity: "High",
    delayImpact: "+1h 20 min",
    reported: "28 mins ago",
    status: "Emergency Crews Deployed",
    description: "Geotechnical sensors along Noney-Awangkhul stretch report micro-displacement of hillside soil following saturation.",
    detourAdvice: "Divert light cargo through Old Cachar Road; heavy trucks held in regulated batches with safety escorts.",
  },
  {
    id: "risk-3",
    state: "Arunachal Pradesh",
    corridor: "NH-13 / Bhalukpong - Bomdila Access",
    title: "Road Expansion & Single Lane Traffic",
    category: "Infrastructure",
    severity: "Moderate",
    delayImpact: "+45 min",
    reported: "1 hour ago",
    status: "Contractor Controlled",
    description: "Blasting debris clearance and culvert widening in progress. Alternating one-way traffic flow enforced.",
    detourAdvice: "Schedule transit between 12:00 - 14:00 window to clear construction halts.",
  },
  {
    id: "risk-4",
    state: "Assam",
    corridor: "NH-27 / Guwahati - Nagaon Expressway",
    title: "Clear High-Capacity Transit",
    category: "Infrastructure",
    severity: "Low",
    delayImpact: "None",
    reported: "8 mins ago",
    status: "Optimal",
    description: "Four-lane highway operating smoothly with automated tolling and zero reportable hazards.",
    detourAdvice: "Optimal priority corridor for emergency cargo and multi-axle freight.",
  },
  {
    id: "risk-5",
    state: "Nagaland",
    corridor: "NH-29 / Dimapur - Kohima Corridor",
    title: "Pavement Subsidence & Silt Runoff",
    category: "Terrain",
    severity: "Moderate",
    delayImpact: "+30 min",
    reported: "42 mins ago",
    status: "Warning Active",
    description: "Slow descent traffic due to loose gravel and silt deposit on hairpin bends 4 through 7.",
    detourAdvice: "Exercise low-gear engine braking; do not attempt overtaking on unsighted mountain bends.",
  },
  {
    id: "risk-6",
    state: "Mizoram",
    corridor: "NH-306 / Silchar - Vairengte Border",
    title: "Border Checkpoint Queue Congestion",
    category: "Traffic",
    severity: "Moderate",
    delayImpact: "+25 min",
    reported: "55 mins ago",
    status: "Queuing",
    description: "Inbound commercial vehicle document verification backlog extending 850 meters past entry gate.",
    detourAdvice: "Ensure digital e-Way and NER FASTag pre-validation for green-channel bypass.",
  },
  {
    id: "risk-7",
    state: "Sikkim",
    corridor: "NH-10 / Rangpo - Singtam - Gangtok",
    title: "Teesta River High Water Inundation",
    category: "Weather",
    severity: "High",
    delayImpact: "+2h 10 min",
    reported: "3 mins ago",
    status: "Strict Advisory",
    description: "Swelling river current washing over embankment road sections. Night cargo transit suspended by district administration.",
    detourAdvice: "Reroute essential medical cargo via Lava - Algarah mountain corridor.",
  },
  {
    id: "risk-8",
    state: "Tripura",
    corridor: "NH-08 / Churaibari - Agartala Corridor",
    title: "Smooth Operational Flow",
    category: "Infrastructure",
    severity: "Low",
    delayImpact: "+5 min",
    reported: "18 mins ago",
    status: "Optimal",
    description: "Repaved asphalt corridor operating with active weighing stations and high safety compliance.",
    detourAdvice: "Maintain standard cruising speeds; no diversions required.",
  },
];

// State Accessibility Indices
export const STATE_ACCESSIBILITY = [
  { state: "Assam", index: 88, coverage: "94%", hubs: 18, rating: "High Connectivity", color: "#10b981" },
  { state: "Tripura", index: 82, coverage: "89%", hubs: 7, rating: "Stable Connectivity", color: "#34d399" },
  { state: "Meghalaya", index: 76, coverage: "81%", hubs: 9, rating: "Weather Vulnerable", color: "#f59e0b" },
  { state: "Nagaland", index: 71, coverage: "74%", hubs: 8, rating: "Terrain Constrained", color: "#f59e0b" },
  { state: "Manipur", index: 69, coverage: "70%", hubs: 8, rating: "Chokepoint Sensitive", color: "#f97316" },
  { state: "Mizoram", index: 66, coverage: "67%", hubs: 5, rating: "Ridge Limited", color: "#f97316" },
  { state: "Sikkim", index: 64, coverage: "65%", hubs: 4, rating: "Single Artery Risk", color: "#ef4444" },
  { state: "Arunachal Pradesh", index: 58, coverage: "54%", hubs: 6, rating: "High Remote Isolation", color: "#ef4444" },
];

// Remote Vulnerable Districts Monitor
export const VULNERABLE_DISTRICTS = [
  {
    district: "Tawang",
    state: "Arunachal Pradesh",
    score: 46,
    status: "High Isolation Risk",
    cause: "Sela Pass snow & elevation > 13,000 ft",
    bufferStockDays: 14,
  },
  {
    district: "Dima Hasao",
    state: "Assam",
    score: 61,
    status: "Seasonal Disruption",
    cause: "Barail hill slope instability & heavy runoff",
    bufferStockDays: 9,
  },
  {
    district: "Champhai",
    state: "Mizoram",
    score: 54,
    status: "Moderate Isolation",
    cause: "Single ridge-road link with steep gradient",
    bufferStockDays: 11,
  },
  {
    district: "Mon",
    state: "Nagaland",
    score: 51,
    status: "High Vulnerability",
    cause: "Unpaved hinterland stretches & river bridges",
    bufferStockDays: 12,
  },
  {
    district: "South Garo Hills",
    state: "Meghalaya",
    score: 59,
    status: "Moderate Vulnerability",
    cause: "River crossing dependency during monsoon",
    bufferStockDays: 8,
  },
];

// Critical Logistic Chokepoints
export const CRITICAL_CHOKEPOINTS = [
  {
    name: "Siliguri Corridor ('Chicken's Neck')",
    type: "Strategic Artery",
    flowScore: 94,
    status: "Clear & Protected",
    description: "Main 22-km artery connecting Northeast India to mainland subcontinent.",
  },
  {
    name: "Saraighat & Bogibeel River Bridges",
    type: "Brahmaputra Crossings",
    flowScore: 91,
    status: "Dual-Deck Operating",
    description: "Vital rail-road links handling 68,000 metric tons of daily freight.",
  },
  {
    name: "Sonapur Tunnel (Meghalaya NH-06)",
    type: "Mountain Tunnel",
    flowScore: 72,
    status: "Caution: Wet Silt Surface",
    description: "Key transit choke connecting Barak Valley, Mizoram, Tripura, and Manipur.",
  },
  {
    name: "Makru & Barak Suspension Bridges (NH-37)",
    type: "River Chasm Crossings",
    flowScore: 68,
    status: "Load Regulated",
    description: "Critical Manipur lifeline; heavy multi-axle freight passes under spacing rules.",
  },
];

// Analytics & Insights Data
export const ANALYTICS_DATA = {
  monthlyDelays: [
    { month: "Oct", delaysMin: 32, onTimePercent: 91 },
    { month: "Nov", delaysMin: 24, onTimePercent: 94 },
    { month: "Dec", delaysMin: 22, onTimePercent: 96 },
    { month: "Jan", delaysMin: 28, onTimePercent: 93 },
    { month: "Feb", delaysMin: 20, onTimePercent: 97 },
    { month: "Mar", delaysMin: 25, onTimePercent: 94 },
  ],
  corridorPerformance: [
    { corridor: "Guwahati → Dimapur", safety: 89, efficiency: 94, avgSpeed: "54 km/h", status: "Optimal" },
    { corridor: "Guwahati → Shillong", safety: 84, efficiency: 88, avgSpeed: "46 km/h", status: "Good" },
    { corridor: "Silchar → Agartala", safety: 82, efficiency: 86, avgSpeed: "48 km/h", status: "Good" },
    { corridor: "Guwahati → Tezpur", safety: 91, efficiency: 95, avgSpeed: "62 km/h", status: "Optimal" },
    { corridor: "Dimapur → Kohima", safety: 72, efficiency: 75, avgSpeed: "32 km/h", status: "Moderate" },
    { corridor: "Silchar → Imphal", safety: 68, efficiency: 70, avgSpeed: "30 km/h", status: "Challenging" },
    { corridor: "Silchar → Aizawl", safety: 74, efficiency: 77, avgSpeed: "34 km/h", status: "Moderate" },
    { corridor: "Sevoke → Gangtok", safety: 66, efficiency: 68, avgSpeed: "28 km/h", status: "Challenging" },
  ],
  cargoSummary: [
    { type: "Medical Supplies", trips: 412, onTime: "98.1%", riskIncidents: 1 },
    { type: "Food & Agriculture", trips: 894, onTime: "92.4%", riskIncidents: 6 },
    { type: "Electronics", trips: 326, onTime: "95.7%", riskIncidents: 2 },
    { type: "General Cargo", trips: 1420, onTime: "91.8%", riskIncidents: 11 },
    { type: "Heavy Machinery", trips: 180, onTime: "88.3%", riskIncidents: 4 },
  ],
};
