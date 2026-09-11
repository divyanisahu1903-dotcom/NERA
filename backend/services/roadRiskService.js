// Stage 5: Road & Infrastructure Risk Analysis Service for NERA Corridors

const { LIVE_RISKS, CRITICAL_CHOKEPOINTS } = require("../data/neraDatabase");

/**
 * Matches route corridors with active live hazards, pavement quality indices,
 * bridge weight limits, and critical chokepoints.
 */
function analyzeRoadRisk(corridorId, origin, dest, cargoProfile) {
  // Find risks related to origin state or dest state
  const relevantRisks = LIVE_RISKS.filter(
    (r) => r.state === origin.state || r.state === dest.state
  );

  const highSeverityCount = relevantRisks.filter((r) => r.severity === "High").length;
  const moderateSeverityCount = relevantRisks.filter((r) => r.severity === "Moderate").length;

  // Base road index calculated from hubs
  const avgRoadIndex = Math.round((origin.roadIndex + dest.roadIndex) / 2);

  let corridorHazardScore = highSeverityCount * 25 + moderateSeverityCount * 10;

  // Check critical chokepoints (e.g. Sonapur tunnel, Makru bridge, Siliguri corridor)
  const activeChokepoints = CRITICAL_CHOKEPOINTS.filter((cp) => {
    if (dest.state === "Manipur" || origin.state === "Manipur") return cp.name.includes("Makru");
    if (dest.state === "Meghalaya" || origin.state === "Meghalaya" || dest.state === "Mizoram" || origin.state === "Mizoram") return cp.name.includes("Sonapur");
    return cp.name.includes("Saraighat");
  });

  if (corridorId.includes("route-b")) {
    corridorHazardScore = Math.max(5, Math.round(corridorHazardScore * 0.3));
  }

  // Heavy machinery load limits check
  let restrictionWarning = null;
  if (cargoProfile.riskThreshold === "Bridge Load Limit") {
    restrictionWarning = "Bridge axle load weight check required at river crossings.";
  }

  return {
    avgRoadIndex,
    corridorHazardScore,
    activeIncidentsCount: relevantRisks.length,
    highSeverityCount,
    activeChokepoints,
    restrictionWarning,
    relevantRisks,
  };
}

module.exports = {
  analyzeRoadRisk,
};
