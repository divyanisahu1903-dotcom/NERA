// Stage 3: Weather Analysis Service for NERA Corridors

/**
 * Evaluates weather conditions, precipitation levels, fog visibility impact,
 * and rainfall severity along candidate routes.
 */
function analyzeWeather(corridorId, originState, destState) {
  // States known for intense monsoonal rainfall or mountain fog
  const highRainfallStates = ["Meghalaya", "Sikkim", "Arunachal Pradesh"];
  const moderateRainfallStates = ["Assam", "Manipur", "Nagaland", "Mizoram"];

  let weatherRiskScore = 15; // Base risk out of 100
  let precipitationMm = 12;
  let visibilityMeters = 800;
  let weatherTag = "Optimal";

  if (highRainfallStates.includes(destState) || highRainfallStates.includes(originState)) {
    weatherRiskScore += 35;
    precipitationMm += 38;
    visibilityMeters = 150;
    weatherTag = "Heavy Rain & Cloud";
  } else if (moderateRainfallStates.includes(destState) || moderateRainfallStates.includes(originState)) {
    weatherRiskScore += 18;
    precipitationMm += 15;
    visibilityMeters = 450;
    weatherTag = "Moderate Showers";
  }

  // Adjust by corridor type (Route B uses AI bypasses with radar coverage)
  const isBypass = corridorId.includes("route-b");
  const isContingency = corridorId.includes("route-c");

  if (isBypass) {
    weatherRiskScore = Math.max(10, Math.round(weatherRiskScore * 0.6));
    weatherTag = "Monsoonal Bypass Active";
  } else if (isContingency) {
    weatherRiskScore = Math.max(15, Math.round(weatherRiskScore * 0.45));
    weatherTag = "Low Altitude Weather Clearance";
  }

  let riskLevel = "Low";
  if (weatherRiskScore > 40) riskLevel = "High";
  else if (weatherRiskScore > 20) riskLevel = "Moderate";

  return {
    weatherRiskScore,
    riskLevel,
    precipitationMm,
    visibilityMeters,
    weatherTag,
    summary: `Precipitation ${precipitationMm}mm/hr; visibility ~${visibilityMeters}m. Risk Level: ${riskLevel}.`,
  };
}

module.exports = {
  analyzeWeather,
};
