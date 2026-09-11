// Stage 4: Terrain Analysis Service for NERA Corridors

/**
 * Analyzes elevation profile, slope gradient, hairpin curves,
 * and matches vehicle gradeability (Hill Capability).
 */
function analyzeTerrain(corridorId, origin, dest, vehicleProfile) {
  const parseElevation = (str) => parseInt(str.replace(/[^0-9]/g, "")) || 50;

  const origElev = parseElevation(origin.elevation);
  const destElev = parseElevation(dest.elevation);
  const maxElev = Math.max(origElev, destElev);

  let terrainPenalty = 1.0;
  let gradientPct = 4.5;
  let landslideLikelihood = "Low";

  if (maxElev > 1200) {
    terrainPenalty = 1.35;
    gradientPct = 8.2;
    landslideLikelihood = "Moderate";
  } else if (maxElev > 400) {
    terrainPenalty = 1.18;
    gradientPct = 6.1;
    landslideLikelihood = "Low-Moderate";
  }

  // Adjust terrain penalty by vehicle capability
  if (vehicleProfile.hillCapability === "Maximum") {
    terrainPenalty *= 0.82;
  } else if (vehicleProfile.hillCapability === "Moderate") {
    terrainPenalty *= 1.12;
  }

  // Route B AI corridor has optimized slope grading
  if (corridorId.includes("route-b")) {
    terrainPenalty *= 0.90;
    landslideLikelihood = "Low";
  } else if (corridorId.includes("route-c")) {
    gradientPct += 1.5; // Ridge ascent has steeper grade but bypasses mudslides
  }

  return {
    maxElevationMeters: maxElev,
    gradientPct,
    terrainPenalty: parseFloat(terrainPenalty.toFixed(2)),
    landslideLikelihood,
    vehicleHillCapability: vehicleProfile.hillCapability,
    summary: `Max elevation ${maxElev}m with ${gradientPct}% gradient. Landslide risk: ${landslideLikelihood}.`,
  };
}

module.exports = {
  analyzeTerrain,
};
