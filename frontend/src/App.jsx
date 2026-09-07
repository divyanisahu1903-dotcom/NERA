import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Map as MapIcon,
  AlertTriangle,
  Accessibility,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Navigation,
  Truck,
  CloudRain,
  Mountain,
  ShieldCheck,
  Clock3,
  Route,
  ChevronRight,
  ArrowRightLeft,
  CheckCircle2,
  TrendingUp,
  Fuel,
  Check,
} from "lucide-react";

import "./App.css";
import RegionalMap from "./components/RegionalMap";
import {
  NER_HUBS,
  CARGO_PROFILES,
  VEHICLE_PROFILES,
  calculateRoutes,
  LIVE_RISKS,
  STATE_ACCESSIBILITY,
  VULNERABLE_DISTRICTS,
  CRITICAL_CHOKEPOINTS,
  ANALYTICS_DATA,
} from "./data/nerData";

function App() {
  // Navigation & UI state
  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Route Engine State
  const [origin, setOrigin] = useState("guwahati");
  const [destination, setDestination] = useState("imphal");
  const [cargoType, setCargoType] = useState("Medical Supplies");
  const [vehicleType, setVehicleType] = useState("Heavy Truck");
  const [showResult, setShowResult] = useState(true);

  // Filter States
  const [riskCategoryFilter, setRiskCategoryFilter] = useState("All");
  const [riskSeverityFilter, setRiskSeverityFilter] = useState("All");

  // Calculate routes dynamically based on inputs
  const routeData = useMemo(() => {
    return calculateRoutes(origin, destination, cargoType, vehicleType);
  }, [origin, destination, cargoType, vehicleType]);

  const recommendedRoute = routeData.routes[0];

  const handleAnalyze = () => {
    setShowResult(true);
    setActivePage("Smart Routes");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSelectHubFromMap = (hub, type) => {
    if (type === "origin") {
      setOrigin(hub.id);
    } else if (type === "dest") {
      setDestination(hub.id);
    } else {
      // Default set as destination if different from origin
      if (origin === hub.id) {
        setOrigin(destination);
        setDestination(hub.id);
      } else {
        setDestination(hub.id);
      }
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Smart Routes", icon: MapIcon },
    { name: "Risk Intelligence", icon: AlertTriangle, badge: LIVE_RISKS.filter((r) => r.severity === "High").length },
    { name: "Accessibility", icon: Accessibility },
    { name: "Analytics", icon: BarChart3 },
  ];

  // Filtered live risks
  const filteredRisks = useMemo(() => {
    return LIVE_RISKS.filter((r) => {
      const matchesCategory =
        riskCategoryFilter === "All" || r.category === riskCategoryFilter;
      const matchesSeverity =
        riskSeverityFilter === "All" || r.severity === riskSeverityFilter;
      const matchesSearch =
        !searchQuery ||
        r.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.corridor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSeverity && matchesSearch;
    });
  }, [riskCategoryFilter, riskSeverityFilter, searchQuery]);

  return (
    <div className="app">
      {/* MOBILE BACKDROP */}
      <div
        className={`sidebar-backdrop ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Route size={24} />
          </div>
          <div>
            <h2>NER-SMART</h2>
            <span>Logistics Intelligence</span>
          </div>
        </div>

        <div className="menu-label">MAIN MENU</div>

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.name;

            return (
              <button
                key={item.name}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  setActivePage(item.name);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>

                {item.badge && (
                  <span className="notification-dot" title="High Priority Hazards Active">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="nav-item"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar">DS</div>
            <div>
              <strong>Project Admin</strong>
              <small>NER Operations Control</small>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <main className="main">
        {/* HEADER */}
        <header className="header">
          <button
            className="mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="breadcrumb">NER / Intelligence Platform</p>
            <h1>{activePage}</h1>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                placeholder="Search hub, route or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              className="icon-button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span></span>
            </button>
          </div>
        </header>

        {/* NOTIFICATIONS DROPDOWN */}
        {notificationsOpen && (
          <div className="notifications-dropdown">
            <div className="notif-header">
              <h4>Live Regional Alerts ({LIVE_RISKS.length})</h4>
              <button onClick={() => setNotificationsOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="notif-list">
              {LIVE_RISKS.slice(0, 4).map((r) => (
                <div key={r.id} className="notif-item">
                  <AlertTriangle
                    size={16}
                    color={r.severity === "High" ? "#ef4444" : "#f59e0b"}
                  />
                  <div>
                    <strong>{r.state}: {r.title}</strong>
                    <p>{r.corridor} • {r.delayImpact}</p>
                    <small>{r.reported}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS MODAL */}
        {settingsOpen && (
          <div className="modal-overlay" onClick={() => setSettingsOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Platform Settings</h3>
              <p>Configure intelligence telemetry and dispatch parameters.</p>

              <div className="modal-field">
                <span>Speed Units</span>
                <strong>Kilometers/hour (km/h)</strong>
              </div>

              <div className="modal-field">
                <span>Auto-Recalculate Routes</span>
                <strong style={{ color: "#10b981" }}>Enabled (Live)</strong>
              </div>

              <div className="modal-field">
                <span>Monsoon Flood Radar Overlay</span>
                <strong style={{ color: "#10b981" }}>Active</strong>
              </div>

              <div className="modal-field">
                <span>Active Region</span>
                <strong>8 NER States (India)</strong>
              </div>

              <button
                className="modal-btn"
                onClick={() => setSettingsOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            DASHBOARD PAGE
           ========================================================================= */}
        {activePage === "Dashboard" && (
          <>
            {/* HERO */}
            <section className="welcome">
              <div>
                <span className="eyebrow">
                  <ShieldCheck size={14} /> SMART LOGISTICS • NORTH EAST REGION
                </span>

                <h2>
                  Intelligent mobility for
                  <br />
                  <span>North Eastern India.</span>
                </h2>

                <p>
                  AI-powered route intelligence, geotechnical landslide risk prediction,
                  and multimodal accessibility insights across Assam, Meghalaya, Manipur,
                  Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => setActivePage("Smart Routes")}
                >
                  <Navigation size={18} />
                  Plan a Smart Route
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="hero-visual">
                <div className="map-glow"></div>
                <div className="floating-point point-one"></div>
                <div className="floating-point point-two"></div>
                <div className="floating-point point-three"></div>
                <div className="ner-label">NORTH EAST REGION</div>
                <div className="route-line line-one"></div>
                <div className="route-line line-two"></div>
              </div>
            </section>

            {/* STATS */}
            <section className="stats-grid">
              <StatCard
                icon={<Route />}
                label="Active Transit Routes"
                value="128"
                change="+12%"
                type="green"
              />
              <StatCard
                icon={<AlertTriangle />}
                label="Active High Risk Alerts"
                value={LIVE_RISKS.filter((r) => r.severity === "High").length.toString()}
                change="-8%"
                type="orange"
              />
              <StatCard
                icon={<Accessibility />}
                label="Regional Accessibility"
                value="78%"
                change="+6%"
                type="blue"
              />
              <StatCard
                icon={<Truck />}
                label="Multimodal Terminals"
                value={NER_HUBS.length.toString()}
                change="+2 new"
                type="purple"
              />
            </section>

            {/* CONTENT GRID */}
            <section className="content-grid">
              {/* ROUTE PLANNER QUICK PANEL */}
              <div className="panel route-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">AI ROUTE ENGINE</span>
                    <h3>Smart Route Planner</h3>
                  </div>
                  <div className="ai-badge">
                    <span></span>
                    Engine Active
                  </div>
                </div>

                <div className="route-form">
                  <div className="input-group">
                    <label>ORIGIN TERMINAL</label>
                    <div className="input-wrapper">
                      <div className="location-dot green-dot"></div>
                      <select
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                      >
                        {NER_HUBS.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.state})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      type="button"
                      className="layer-btn"
                      onClick={handleSwapLocations}
                      title="Swap Origin & Destination"
                    >
                      <ArrowRightLeft size={14} /> Swap Hubs
                    </button>
                  </div>

                  <div className="input-group">
                    <label>DESTINATION TERMINAL</label>
                    <div className="input-wrapper">
                      <div className="location-dot red-dot"></div>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      >
                        {NER_HUBS.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.state})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="select-group">
                      <label>CARGO CATEGORY</label>
                      <select
                        value={cargoType}
                        onChange={(e) => setCargoType(e.target.value)}
                      >
                        {Object.keys(CARGO_PROFILES).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="select-group">
                      <label>FLEET VEHICLE</label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                      >
                        {Object.keys(VEHICLE_PROFILES).map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button className="analyze-btn" onClick={handleAnalyze}>
                    <Navigation size={18} />
                    Analyze Route with AI
                  </button>
                </div>
              </div>

              {/* LIVE REGIONAL RISK MONITOR */}
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">LIVE SENSORS & RADAR</span>
                    <h3>Regional Risk Status</h3>
                  </div>
                  <span className="live-indicator">
                    <span></span> LIVE
                  </span>
                </div>

                <div className="risk-list">
                  {LIVE_RISKS.slice(0, 4).map((r) => (
                    <div key={r.id} className="risk-item">
                      <div className="risk-icon">
                        {r.category === "Weather" ? (
                          <CloudRain size={20} />
                        ) : r.category === "Terrain" ? (
                          <Mountain size={20} />
                        ) : (
                          <AlertTriangle size={20} />
                        )}
                      </div>
                      <div className="risk-info">
                        <strong>{r.title}</strong>
                        <span>{r.state} • {r.corridor}</span>
                      </div>
                      <span className={`risk-level ${r.severity.toLowerCase()}`}>
                        {r.severity}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className="text-button"
                  onClick={() => setActivePage("Risk Intelligence")}
                >
                  View all live hazards across NER
                  <ChevronRight size={16} />
                </button>
              </div>
            </section>

            {/* INTERACTIVE MAP PANEL */}
            <section className="panel map-panel">
              <RegionalMap
                originId={origin}
                destId={destination}
                activeRouteInfo={recommendedRoute}
                onSelectHub={handleSelectHubFromMap}
              />
            </section>
          </>
        )}

        {/* =========================================================================
            SMART ROUTES PAGE
           ========================================================================= */}
        {activePage === "Smart Routes" && (
          <section className="route-page">
            <div className="page-intro">
              <span className="eyebrow">AI-POWERED DECISION SUPPORT</span>
              <h2>Smart Route Intelligence Engine</h2>
              <p>
                Comparative corridor analysis factoring in road elevation gradients,
                weather telemetry, landslide likelihood, and vehicle capabilities.
              </p>
            </div>

            {/* ROUTE BUILDER CONTROLS */}
            <div className="route-builder panel">
              <div className="route-form-large">
                <div>
                  <label>ORIGIN TERMINAL</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  >
                    {NER_HUBS.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>DESTINATION TERMINAL</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  >
                    {NER_HUBS.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>CARGO TYPE</label>
                  <select
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value)}
                  >
                    {Object.keys(CARGO_PROFILES).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>VEHICLE TYPE</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    {Object.keys(VEHICLE_PROFILES).map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="analyze-btn"
                  onClick={() => setShowResult(true)}
                  style={{ marginTop: 0 }}
                >
                  Recalculate
                </button>
              </div>
            </div>

            {/* ROUTE COMPARISON CARDS */}
            {showResult && (
              <div className="result-area">
                <div className="route-comparison">
                  {routeData.routes.map((rt) => (
                    <div
                      key={rt.id}
                      className={`route-option ${
                        rt.isRecommended ? "recommended-route" : ""
                      }`}
                    >
                      <div className="route-option-header">
                        <div>
                          <span className="eyebrow">{rt.badge}</span>
                          <h2>{rt.name}</h2>
                        </div>
                        <span
                          className={`route-status ${
                            rt.isRecommended ? "recommended" : "neutral"
                          }`}
                        >
                          {rt.tag}
                        </span>
                      </div>

                      <div className="route-line-visual">
                        <div className="route-point">
                          {routeData.origin.name.charAt(0)}
                        </div>
                        <div
                          className={`route-line-track ${
                            rt.isRecommended ? "recommended-track" : ""
                          }`}
                        ></div>
                        <div className="route-point destination">
                          {routeData.dest.name.charAt(0)}
                        </div>
                      </div>

                      <div className="route-cities">
                        <span>{routeData.origin.name}</span>
                        <span>{routeData.dest.name}</span>
                      </div>

                      <div className="route-metrics">
                        <div>
                          <span>Distance</span>
                          <strong>{rt.distance}</strong>
                        </div>
                        <div>
                          <span>Travel Time</span>
                          <strong>{rt.duration}</strong>
                        </div>
                        <div>
                          <span>Safety Index</span>
                          <strong style={{ color: rt.safetyScore > 80 ? "#34d399" : "#fbbf24" }}>
                            {rt.safetyScore}/100
                          </strong>
                        </div>
                        <div>
                          <span>Accessibility</span>
                          <strong>{rt.accessibilityScore}/100</strong>
                        </div>
                      </div>

                      <div className="route-risks">
                        <div>
                          <span>Weather Risk</span>
                          <strong
                            style={{
                              color:
                                rt.weatherRisk === "Low"
                                  ? "#34d399"
                                  : rt.weatherRisk === "Moderate"
                                  ? "#fbbf24"
                                  : "#f87171",
                            }}
                          >
                            {rt.weatherRisk}
                          </strong>
                        </div>
                        <div>
                          <span>Landslide</span>
                          <strong
                            style={{
                              color:
                                rt.landslideRisk === "Low"
                                  ? "#34d399"
                                  : "#fbbf24",
                            }}
                          >
                            {rt.landslideRisk}
                          </strong>
                        </div>
                        <div>
                          <span>Predicted Delay</span>
                          <strong>{rt.predictedDelay}</strong>
                        </div>
                      </div>

                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span>Estimated Fuel Cost:</span>
                          <strong style={{ color: "#fff" }}>{rt.estimatedCost}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Carbon Emission:</span>
                          <span>{rt.carbonKg} kg CO₂</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI RECOMMENDATION SPOTLIGHT */}
                <div className="recommended-card">
                  <div className="recommend-header">
                    <div>
                      <span className="eyebrow">AI DECISION ENGINE ANALYSIS</span>
                      <h2>Route B is Recommended for {cargoType}</h2>
                    </div>
                    <div className="recommended-icon">
                      <ShieldCheck size={32} />
                    </div>
                  </div>

                  <p>{recommendedRoute.aiRationale}</p>

                  <div className="score-grid">
                    <Score label="Safety Score" value={recommendedRoute.safetyScore} />
                    <Score label="Accessibility" value={recommendedRoute.accessibilityScore} />
                    <Score label="Route Efficiency" value={`${recommendedRoute.efficiencyScore}%`} />
                    <Score label="Risk Classification" value={recommendedRoute.landslideRisk.toUpperCase()} />
                  </div>
                </div>

                {/* CHECKPOINTS TIMELINE */}
                <div className="route-details panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">WAYPOINT TELEMETRY</span>
                      <h3>Critical Corridor Checkpoints (Route B)</h3>
                    </div>
                    <span className="ai-badge">
                      <Check size={12} /> Sensors Online
                    </span>
                  </div>

                  <div className="checkpoints-timeline">
                    {recommendedRoute.checkpoints.map((cp, idx) => (
                      <div key={idx} className="checkpoint-item">
                        <div>
                          <strong>{cp.name}</strong>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                            Checkpoint Status: {cp.status}
                          </div>
                        </div>
                        <span>ETA {cp.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INTERACTIVE ROUTE MAP */}
                <div className="panel map-panel">
                  <RegionalMap
                    originId={origin}
                    destId={destination}
                    activeRouteInfo={recommendedRoute}
                    onSelectHub={handleSelectHubFromMap}
                  />
                </div>
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            RISK INTELLIGENCE PAGE
           ========================================================================= */}
        {activePage === "Risk Intelligence" && (
          <section className="risk-page">
            <div className="page-intro">
              <span className="eyebrow">GEOTECHNICAL & CLIMATE RADAR</span>
              <h2>Real-Time Regional Risk Intelligence</h2>
              <p>
                Live sensor telemetry, landslide slope displacement warnings, and
                monsoonal precipitation tracking across all 8 NER highway corridors.
              </p>
            </div>

            {/* FILTER BAR */}
            <div className="filter-bar">
              <div className="filter-pills">
                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", alignSelf: "center", marginRight: "6px" }}>
                  Category:
                </span>
                {["All", "Weather", "Terrain", "Infrastructure", "Traffic"].map(
                  (cat) => (
                    <button
                      key={cat}
                      className={`filter-pill ${
                        riskCategoryFilter === cat ? "active" : ""
                      }`}
                      onClick={() => setRiskCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              <div className="filter-pills">
                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", alignSelf: "center", marginRight: "6px" }}>
                  Severity:
                </span>
                {["All", "High", "Moderate", "Low"].map((sev) => (
                  <button
                    key={sev}
                    className={`filter-pill ${
                      riskSeverityFilter === sev ? "active" : ""
                    }`}
                    onClick={() => setRiskSeverityFilter(sev)}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* RISK CARDS GRID */}
            <div className="risk-cards-grid">
              {filteredRisks.map((risk) => (
                <div
                  key={risk.id}
                  className={`risk-detail-card ${risk.severity.toLowerCase()}`}
                >
                  <div className="risk-card-top">
                    <div>
                      <strong>{risk.title}</strong>
                      <span className="risk-corridor">
                        {risk.state} • {risk.corridor}
                      </span>
                    </div>
                    <span className={`risk-level ${risk.severity.toLowerCase()}`}>
                      {risk.severity} Risk
                    </span>
                  </div>

                  <p className="risk-description">{risk.description}</p>

                  <div className="risk-detour-box">
                    <Navigation size={16} />
                    <div>
                      <strong style={{ color: "#fff", display: "block", marginBottom: "2px" }}>
                        AI Detour Guidance:
                      </strong>
                      <span>{risk.detourAdvice}</span>
                    </div>
                  </div>

                  <div className="risk-meta-footer">
                    <span>Reported: {risk.reported}</span>
                    <span>Delay Impact: <strong style={{ color: "#fff" }}>{risk.delayImpact}</strong></span>
                    <span>Status: {risk.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            ACCESSIBILITY PAGE
           ========================================================================= */}
        {activePage === "Accessibility" && (
          <section className="accessibility-page">
            <div className="page-intro">
              <span className="eyebrow">REGIONAL CONNECTIVITY INDEX</span>
              <h2>Accessibility & Isolation Intelligence</h2>
              <p>
                Measuring road network resilience, last-mile reachability, and
                seasonal vulnerability for remote North Eastern communities.
              </p>
            </div>

            <div className="access-grid-layout">
              {/* STATE ACCESSIBILITY TABLE */}
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">STATE BREAKDOWN</span>
                    <h3>NER Logistics Connectivity Index</h3>
                  </div>
                  <span className="ai-badge">8 States Active</span>
                </div>

                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>State</th>
                        <th>Accessibility Score</th>
                        <th>Network Coverage</th>
                        <th>Logistics Hubs</th>
                        <th>Classification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STATE_ACCESSIBILITY.map((item) => (
                        <tr key={item.state}>
                          <td><strong>{item.state}</strong></td>
                          <td>
                            <strong>{item.index}/100</strong>
                            <div className="progress-track">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${item.index}%`,
                                  background: item.color,
                                }}
                              ></div>
                            </div>
                          </td>
                          <td>{item.coverage}</td>
                          <td>{item.hubs} Depots</td>
                          <td>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: "600",
                                color: item.color,
                              }}
                            >
                              {item.rating}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* VULNERABLE REMOTE DISTRICTS */}
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">MONSOON ISOLATION WATCH</span>
                    <h3>Vulnerable Hinterland Districts</h3>
                  </div>
                  <span className="live-indicator">
                    <span></span> Priority Alert
                  </span>
                </div>

                <div className="vulnerable-districts-list">
                  {VULNERABLE_DISTRICTS.map((dist) => (
                    <div key={dist.district} className="district-card">
                      <div className="district-info">
                        <strong>{dist.district} ({dist.state})</strong>
                        <span>{dist.cause}</span>
                      </div>
                      <div className="district-stock">
                        <strong>{dist.bufferStockDays} Days</strong>
                        <small>Buffer Supplies</small>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "24px" }}>
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">STRATEGIC INFRASTRUCTURE</span>
                      <h3>Critical Logistics Chokepoints</h3>
                    </div>
                  </div>

                  <div className="vulnerable-districts-list">
                    {CRITICAL_CHOKEPOINTS.map((choke) => (
                      <div key={choke.name} className="district-card">
                        <div>
                          <strong>{choke.name}</strong>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            {choke.description}
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <strong style={{ color: "#34d399" }}>{choke.flowScore}%</strong>
                          <small style={{ color: "var(--text-dim)", display: "block" }}>
                            {choke.status}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            ANALYTICS PAGE
           ========================================================================= */}
        {activePage === "Analytics" && (
          <section className="analytics-page">
            <div className="page-intro">
              <span className="eyebrow">HISTORICAL & PREDICTIVE METRICS</span>
              <h2>Logistics Performance Analytics</h2>
              <p>
                Corridor efficiency, fuel savings from AI bypass routing, on-time delivery
                rates, and seasonal delay trends across North East India.
              </p>
            </div>

            {/* SUMMARY STATS */}
            <div className="stats-grid">
              <StatCard
                icon={<TrendingUp />}
                label="On-Time Delivery Rate"
                value="94.2%"
                change="+3.4%"
                type="green"
              />
              <StatCard
                icon={<Fuel />}
                label="Fuel Saved via AI Routes"
                value="18.4%"
                change="+₹4.2L / mo"
                type="blue"
              />
              <StatCard
                icon={<Clock3 />}
                label="Avg Delay Reduction"
                value="-42 min"
                change="Faster Mountain Transit"
                type="orange"
              />
              <StatCard
                icon={<ShieldCheck />}
                label="Safety Compliance SLA"
                value="99.1%"
                change="Zero Incidents"
                type="purple"
              />
            </div>

            <div className="chart-panel-grid">
              {/* MONTHLY DELAY TRENDS */}
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">SEASONAL PATTERNS</span>
                    <h3>Average Delay per 100km (Minutes)</h3>
                  </div>
                  <span className="ai-badge">Monsoon vs Winter</span>
                </div>

                <div className="monthly-bars">
                  {ANALYTICS_DATA.monthlyDelays.map((m) => (
                    <div key={m.month} className="bar-col">
                      <div className="bar-val">{m.delaysMin}m</div>
                      <div
                        className="bar-tube"
                        style={{ height: `${(m.delaysMin / 40) * 100}%` }}
                      ></div>
                      <span>{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CORRIDOR LEADERBOARD */}
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">CORRIDOR RELIABILITY</span>
                    <h3>Corridor Safety & Speed Ranking</h3>
                  </div>
                </div>

                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Corridor</th>
                        <th>Safety</th>
                        <th>Avg Speed</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ANALYTICS_DATA.corridorPerformance.slice(0, 5).map((cp) => (
                        <tr key={cp.corridor}>
                          <td><strong>{cp.corridor}</strong></td>
                          <td>
                            <strong style={{ color: cp.safety > 80 ? "#34d399" : "#fbbf24" }}>
                              {cp.safety}/100
                            </strong>
                          </td>
                          <td>{cp.avgSpeed}</td>
                          <td>
                            <span className="status-pill operational">
                              {cp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* CARGO CATEGORY PERFORMANCE TABLE */}
            <div className="panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">CARGO CATEGORY BREAKDOWN</span>
                  <h3>Cargo Throughput & Safety Incident Adherence</h3>
                </div>
              </div>

              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cargo Category</th>
                      <th>Total Completed Trips</th>
                      <th>On-Time Rate</th>
                      <th>Reported En-Route Disruption</th>
                      <th>AI Priority Routing Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ANALYTICS_DATA.cargoSummary.map((cg) => (
                      <tr key={cg.type}>
                        <td><strong>{cg.type}</strong></td>
                        <td>{cg.trips} Dispatches</td>
                        <td><strong style={{ color: "#34d399" }}>{cg.onTime}</strong></td>
                        <td>{cg.riskIncidents} (Low)</td>
                        <td>
                          <span className="ai-badge" style={{ padding: "3px 8px" }}>
                            <CheckCircle2 size={11} /> Protected
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* REUSABLE STAT CARD */
function StatCard({ icon, label, value, change, type }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${type}`}>{icon}</div>
      <div className="stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{change}</small>
      </div>
    </div>
  );
}

/* REUSABLE SCORE BOX */
function Score({ label, value }) {
  return (
    <div className="score-box">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;