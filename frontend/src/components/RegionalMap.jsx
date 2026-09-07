import React, { useState } from "react";
import {
  MapPin,
  Layers,
  AlertTriangle,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import { NER_HUBS } from "../data/nerData";

export default function RegionalMap({
  originId,
  destId,
  onSelectHub,
  activeRouteInfo,
}) {
  const [activeLayer, setActiveLayer] = useState("all"); // 'all', 'routes', 'risks', 'hubs'
  const [selectedHub, setSelectedHub] = useState(null);
  const [hoveredHub, setHoveredHub] = useState(null);

  const originHub = NER_HUBS.find((h) => h.id === originId) || NER_HUBS[0];
  const destHub = NER_HUBS.find((h) => h.id === destId) || NER_HUBS[3];

  // Calculate curve control point for SVG bezier curve between origin and destination
  const getCurvePath = (p1, p2, curveOffset = 18) => {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2 - curveOffset;
    return `M ${p1.x} ${p1.y} Q ${mx} ${my} ${p2.x} ${p2.y}`;
  };

  const routePathB = getCurvePath(originHub.coords, destHub.coords, 8); // AI Route (flatter, direct)
  const routePathA = getCurvePath(originHub.coords, destHub.coords, 24); // Alternative Route (curves around ridge)

  // Risk pins mapping to hubs approximately
  const riskMapPoints = [
    { id: "r1", x: 37, y: 58, state: "Meghalaya", text: "Heavy Rain (NH-06)", level: "moderate" },
    { id: "r2", x: 63, y: 65, state: "Manipur", text: "Landslide Alert (NH-37)", level: "high" },
    { id: "r3", x: 50, y: 28, state: "Arunachal", text: "One-Way Traffic", level: "moderate" },
    { id: "r4", x: 12, y: 30, state: "Sikkim", text: "River Inundation (NH-10)", level: "high" },
    { id: "r5", x: 67, y: 49, state: "Nagaland", text: "Silt Runoff (NH-29)", level: "moderate" },
  ];

  return (
    <div className="ner-map-container">
      {/* Top Map Toolbar */}
      <div className="map-toolbar">
        <div className="map-title-area">
          <div className="map-live-dot"></div>
          <div>
            <h4>NER Spatial Logistics Grid</h4>
            <span className="map-subtext">Interactive Multi-Modal Corridor Visualizer</span>
          </div>
        </div>

        <div className="map-layer-toggles">
          <button
            className={`layer-btn ${activeLayer === "all" ? "active" : ""}`}
            onClick={() => setActiveLayer("all")}
          >
            <Layers size={14} />
            <span>All Layers</span>
          </button>
          <button
            className={`layer-btn ${activeLayer === "routes" ? "active" : ""}`}
            onClick={() => setActiveLayer("routes")}
          >
            <Navigation size={14} />
            <span>Corridors</span>
          </button>
          <button
            className={`layer-btn ${activeLayer === "risks" ? "active" : ""}`}
            onClick={() => setActiveLayer("risks")}
          >
            <AlertTriangle size={14} />
            <span>Hazard Radar</span>
          </button>
          <button
            className={`layer-btn ${activeLayer === "hubs" ? "active" : ""}`}
            onClick={() => setActiveLayer("hubs")}
          >
            <MapPin size={14} />
            <span>Terminals</span>
          </button>
        </div>
      </div>

      {/* Main Vector Map Board */}
      <div className="map-canvas-wrapper">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="map-vector-canvas"
        >
          <defs>
            {/* Gradient for AI Route B */}
            <linearGradient id="routeGradientB" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
            </linearGradient>

            {/* Gradient for Route A */}
            <linearGradient id="routeGradientA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Pattern */}
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* State / Topographic Region Outlines (Stylized Northeast India Geometry) */}
          <g className="region-contours">
            {/* Sikkim */}
            <path
              d="M 6 22 L 14 20 L 16 34 L 8 36 Z"
              className="state-boundary"
              data-state="Sikkim"
            />
            {/* Arunachal Pradesh & Upper Valley */}
            <path
              d="M 38 16 L 68 12 L 88 18 L 84 32 L 60 28 L 44 26 Z"
              className="state-boundary"
              data-state="Arunachal"
            />
            {/* Assam Brahmaputra Valley */}
            <path
              d="M 24 38 L 44 28 L 64 30 L 86 28 L 82 42 L 58 48 L 46 44 L 28 46 Z"
              className="state-boundary"
              data-state="Assam"
            />
            {/* Meghalaya Plateau */}
            <path
              d="M 28 50 L 46 50 L 48 60 L 26 62 Z"
              className="state-boundary"
              data-state="Meghalaya"
            />
            {/* Nagaland Ridge */}
            <path
              d="M 58 44 L 72 40 L 76 56 L 62 58 Z"
              className="state-boundary"
              data-state="Nagaland"
            />
            {/* Manipur Valley & Hills */}
            <path
              d="M 60 58 L 74 58 L 72 74 L 58 72 Z"
              className="state-boundary"
              data-state="Manipur"
            />
            {/* Mizoram Southern Spine */}
            <path
              d="M 42 70 L 54 70 L 52 92 L 40 90 Z"
              className="state-boundary"
              data-state="Mizoram"
            />
            {/* Tripura Basin */}
            <path
              d="M 22 70 L 34 68 L 32 86 L 20 84 Z"
              className="state-boundary"
              data-state="Tripura"
            />
          </g>

          {/* Connected Network Web (Standard Highways) */}
          <g className="network-mesh">
            <line x1="32" y1="44" x2="35" y2="56" className="mesh-link" />
            <line x1="32" y1="44" x2="44" y2="34" className="mesh-link" />
            <line x1="44" y1="34" x2="60" y2="45" className="mesh-link" />
            <line x1="60" y1="45" x2="80" y2="24" className="mesh-link" />
            <line x1="60" y1="45" x2="69" y2="51" className="mesh-link" />
            <line x1="69" y1="51" x2="67" y2="64" className="mesh-link" />
            <line x1="35" y1="56" x2="48" y2="65" className="mesh-link" />
            <line x1="48" y1="65" x2="67" y2="64" className="mesh-link" />
            <line x1="48" y1="65" x2="46" y2="84" className="mesh-link" />
            <line x1="48" y1="65" x2="26" y2="78" className="mesh-link" />
            <line x1="44" y1="34" x2="55" y2="22" className="mesh-link" />
            <line x1="32" y1="44" x2="10" y2="28" className="mesh-link dashed" />
          </g>

          {/* Active Corridors Layer */}
          {(activeLayer === "all" || activeLayer === "routes") && (
            <g className="active-routes-layer">
              {/* Route A (Alternative / Standard) */}
              <path
                d={routePathA}
                fill="none"
                stroke="url(#routeGradientA)"
                strokeWidth="1.6"
                strokeDasharray="3 3"
                className="route-path-a"
              />

              {/* Route B (AI Optimized Corridor - Glowing) */}
              <path
                d={routePathB}
                fill="none"
                stroke="url(#routeGradientB)"
                strokeWidth="2.8"
                filter="url(#glow)"
                className="route-path-b"
              />

              {/* Animated Transit Pulses along Route B */}
              <circle r="1.4" fill="#6ee7b7" className="pulse-dot">
                <animateMotion
                  path={routePathB}
                  dur="4s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
              </circle>
              <circle r="2.2" fill="none" stroke="#34d399" strokeWidth="0.8" opacity="0.6">
                <animateMotion
                  path={routePathB}
                  dur="4s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
              </circle>
            </g>
          )}

          {/* Weather / Hazard Radar Layer */}
          {(activeLayer === "all" || activeLayer === "risks") && (
            <g className="hazard-radar-layer">
              {/* Weather Cloud Zone (Meghalaya) */}
              <ellipse
                cx="36"
                cy="56"
                rx="8"
                ry="5"
                fill="rgba(59, 130, 246, 0.12)"
                stroke="rgba(59, 130, 246, 0.4)"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
              {/* Landslide Warning Zone (Manipur Hills) */}
              <ellipse
                cx="64"
                cy="66"
                rx="6"
                ry="4"
                fill="rgba(239, 68, 68, 0.15)"
                stroke="rgba(239, 68, 68, 0.5)"
                strokeWidth="0.8"
              />
            </g>
          )}
        </svg>

        {/* DOM Overlays: Interactive Hub Pins */}
        {(activeLayer === "all" || activeLayer === "hubs" || activeLayer === "routes") && (
          <div className="map-hubs-overlay">
            {NER_HUBS.map((hub) => {
              const isOrigin = hub.id === originHub.id;
              const isDest = hub.id === destHub.id;
              const isSelected = selectedHub?.id === hub.id;

              return (
                <div
                  key={hub.id}
                  className={`hub-pin-wrapper ${isOrigin ? "origin-pin" : ""} ${
                    isDest ? "dest-pin" : ""
                  } ${isSelected ? "selected" : ""}`}
                  style={{ left: `${hub.coords.x}%`, top: `${hub.coords.y}%` }}
                  onClick={() => {
                    setSelectedHub(hub);
                    if (onSelectHub) onSelectHub(hub);
                  }}
                  onMouseEnter={() => setHoveredHub(hub)}
                  onMouseLeave={() => setHoveredHub(null)}
                >
                  <div className="hub-marker">
                    {isOrigin ? (
                      <span className="marker-badge origin">FROM</span>
                    ) : isDest ? (
                      <span className="marker-badge dest">TO</span>
                    ) : (
                      <div className="marker-dot"></div>
                    )}
                  </div>
                  <span className="hub-city-name">{hub.name}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* DOM Overlays: Live Risk Badges */}
        {(activeLayer === "all" || activeLayer === "risks") && (
          <div className="map-risks-overlay">
            {riskMapPoints.map((r) => (
              <div
                key={r.id}
                className={`risk-badge-map ${r.level}`}
                style={{ left: `${r.x}%`, top: `${r.y}%` }}
                title={`${r.state}: ${r.text}`}
              >
                <AlertTriangle size={12} />
                <span>{r.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Hover / Selection Detail Flyout Card */}
        {(hoveredHub || selectedHub) && (
          <div className="map-hub-card">
            <div className="hub-card-header">
              <div>
                <strong>{(hoveredHub || selectedHub).name}</strong>
                <span>{(hoveredHub || selectedHub).state} • {(hoveredHub || selectedHub).elevation}</span>
              </div>
              <span className={`status-pill ${(hoveredHub || selectedHub).status.toLowerCase().replace(" ", "-")}`}>
                {(hoveredHub || selectedHub).status}
              </span>
            </div>

            <div className="hub-card-details">
              <div>
                <span>Weather</span>
                <strong>{(hoveredHub || selectedHub).weather}</strong>
              </div>
              <div>
                <span>Active Hubs</span>
                <strong>{(hoveredHub || selectedHub).hubsCount} Depots</strong>
              </div>
              <div>
                <span>Road Index</span>
                <strong>{(hoveredHub || selectedHub).roadIndex}/100</strong>
              </div>
            </div>

            <div className="hub-card-actions">
              <button
                className="hub-select-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectHub) onSelectHub(hoveredHub || selectedHub, "origin");
                }}
              >
                Set as Origin
              </button>
              <button
                className="hub-select-btn primary"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectHub) onSelectHub(hoveredHub || selectedHub, "dest");
                }}
              >
                Set as Destination
              </button>
            </div>
          </div>
        )}

        {/* Active Corridor Stats Card */}
        <div className="map-corridor-card">
          <div className="corridor-top">
            <span className="corridor-pill">RECOMMENDED CORRIDOR</span>
            <div className="corridor-safety">
              <CheckCircle2 size={14} />
              <span>Safety: {activeRouteInfo?.safetyScore || 84}/100</span>
            </div>
          </div>

          <div className="corridor-pair">
            <strong>{originHub.name}</strong>
            <span className="corridor-arrow">→</span>
            <strong>{destHub.name}</strong>
          </div>

          <div className="corridor-quick-stats">
            <span>{activeRouteInfo?.distance || "485 km"}</span>
            <span>•</span>
            <span>{activeRouteInfo?.duration || "8h 40m"}</span>
            <span>•</span>
            <span className="corridor-ai">AI Priority Path</span>
          </div>
        </div>

        {/* Bottom Map Legend */}
        <div className="map-floating-legend">
          <div className="legend-item">
            <span className="legend-swatch route-b"></span>
            <span>Route B (AI Optimal)</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch route-a"></span>
            <span>Route A (Standard NH)</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch hazard"></span>
            <span>Weather/Terrain Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
