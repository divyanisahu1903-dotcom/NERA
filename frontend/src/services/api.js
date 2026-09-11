// Frontend API Client for NERA-SMART Express Backend Server
// Connects to http://localhost:5000/api with fallback to local data if backend is offline.

import {
  NER_HUBS as FALLBACK_HUBS,
  LIVE_RISKS as FALLBACK_RISKS,
  STATE_ACCESSIBILITY as FALLBACK_ACCESSIBILITY,
  ANALYTICS_DATA as FALLBACK_ANALYTICS,
  calculateRoutes as fallbackCalculateRoutes,
} from "../data/nerData";

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Executes full 13-stage AI Route Pipeline on the Express backend
 */
export async function analyzeRouteAPI(origin, destination, cargoType, vehicleType) {
  try {
    const response = await fetch(`${API_BASE_URL}/routes/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination, cargoType, vehicleType }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data && data.success) {
      return data;
    }
  } catch (err) {
    console.warn("Backend API offline or unreachable, using local pipeline fallback:", err.message);
  }

  // Fallback if backend is unavailable
  return fallbackCalculateRoutes(origin, destination, cargoType, vehicleType);
}

/**
 * Fetches NERA Hubs from backend
 */
export async function fetchHubsAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/hubs`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.hubs;
    }
  } catch (err) {
    console.warn("Backend hubs API offline, using local hubs fallback.");
  }
  return FALLBACK_HUBS;
}

/**
 * Fetches Live Hazard Alerts from backend
 */
export async function fetchRisksAPI(category = "All", severity = "All", search = "") {
  try {
    const query = new URLSearchParams({ category, severity, search }).toString();
    const res = await fetch(`${API_BASE_URL}/risks?${query}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.risks;
    }
  } catch (err) {
    console.warn("Backend risks API offline, using local risks fallback.");
  }
  
  // Local fallback filter
  return FALLBACK_RISKS.filter((r) => {
    const matchesCategory = category === "All" || r.category === category;
    const matchesSeverity = severity === "All" || r.severity === severity;
    const matchesSearch =
      !search ||
      r.state.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.corridor.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSeverity && matchesSearch;
  });
}

/**
 * Fetches State Accessibility metrics from backend
 */
export async function fetchAccessibilityAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/accessibility`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (err) {
    console.warn("Backend accessibility API offline, using local fallback.");
  }
  return { stateAccessibility: FALLBACK_ACCESSIBILITY };
}

/**
 * Fetches Analytics summary from backend
 */
export async function fetchAnalyticsAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.analytics;
    }
  } catch (err) {
    console.warn("Backend analytics API offline, using local fallback.");
  }
  return FALLBACK_ANALYTICS;
}
