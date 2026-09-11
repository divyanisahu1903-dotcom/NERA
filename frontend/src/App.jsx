import React, { useState, useMemo, useEffect } from "react";
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
  Download,
  Share2,
  PlusCircle,
  PackageCheck,
  FileText,
  Filter,
  Zap,
} from "lucide-react";

import "./App.css";
import RegionalMap from "./components/RegionalMap";
import {
  NER_HUBS,
  CARGO_PROFILES,
  VEHICLE_PROFILES,
  calculateRoutes,
  LIVE_RISKS as INITIAL_LIVE_RISKS,
  STATE_ACCESSIBILITY,
  VULNERABLE_DISTRICTS,
  CRITICAL_CHOKEPOINTS,
  ANALYTICS_DATA,
} from "./data/nerData";
import { analyzeRouteAPI } from "./services/api";

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
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState("route-b");

  // Dynamic Live Hazards Feed State (Allowing reporting & updates)
  const [liveRisks, setLiveRisks] = useState(INITIAL_LIVE_RISKS);

  // Filter States
  const [riskCategoryFilter, setRiskCategoryFilter] = useState("All");
  const [riskSeverityFilter, setRiskSeverityFilter] = useState("All");

  // Modals & Interactive Drawers State
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState("Last 6 Months");
  const [toastMessage, setToastMessage] = useState(null);

  // Platform Settings State
  const [settings, setSettings] = useState({
    speedUnit: "km/h",
    autoRecalculate: true,
    radarOverlay: true,
    activeRegion: "All 8 NERA States",
    notificationAlerts: true,
  });

  // New Hazard Report Form State
  const [newHazard, setNewHazard] = useState({
    state: "Meghalaya",
    corridor: "",
    title: "",
    category: "Weather",
    severity: "Moderate",
    description: "",
    detourAdvice: "",
  });

  // Helper Toast Notification Trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Route Data fetched from Express Backend (with local fallback)
  const [routeData, setRouteData] = useState(() =>
    calculateRoutes(origin, destination, cargoType, vehicleType)
  );

  useEffect(() => {
    let isMounted = true;
    if (settings.autoRecalculate) {
      setIsCalculating(true);
      analyzeRouteAPI(origin, destination, cargoType, vehicleType).then((res) => {
        if (isMounted) {
          setIsCalculating(false);
          if (res && res.routes) {
            setRouteData(res);
            const rec = res.routes.find((r) => r.isRecommended) || res.routes[0];
            if (rec) setSelectedRouteId(rec.id);
          }
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [origin, destination, cargoType, vehicleType, settings.autoRecalculate]);

  // Determine currently focused route object
  const activeRoute = useMemo(() => {
    if (!routeData || !routeData.routes) {
      return calculateRoutes(origin, destination, cargoType, vehicleType).routes[0];
    }
    return (
      routeData.routes.find((r) => r.id === selectedRouteId) ||
      routeData.routes.find((r) => r.isRecommended) ||
      routeData.routes[0]
    );
  }, [routeData, selectedRouteId, origin, destination, cargoType, vehicleType]);

  const recommendedRoute = routeData?.routes?.find((r) => r.isRecommended) || routeData?.routes?.[0] || activeRoute;

  // Recalculate Button Handler
  const handleAnalyze = () => {
    setIsCalculating(true);
    setShowResult(true);
    analyzeRouteAPI(origin, destination, cargoType, vehicleType).then((res) => {
      setIsCalculating(false);
      if (res && res.routes) {
        setRouteData(res);
        const rec = res.routes.find((r) => r.isRecommended) || res.routes[0];
        if (rec) setSelectedRouteId(rec.id);
        showToast(`AI Corridor recalculated: ${origin.toUpperCase()} → ${destination.toUpperCase()}`);
      }
      setActivePage("Smart Routes");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  // Swap Locations Handler
  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    showToast(`Swapped origin & destination hubs`);
  };

  // Map Hub Selection Handler
  const handleSelectHubFromMap = (hub, type) => {
    if (type === "origin") {
      setOrigin(hub.id);
      showToast(`Selected ${hub.name} as Origin`);
    } else if (type === "dest") {
      setDestination(hub.id);
      showToast(`Selected ${hub.name} as Destination`);
    } else {
      if (origin === hub.id) {
        setOrigin(destination);
        setDestination(hub.id);
      } else {
        setDestination(hub.id);
      }
      showToast(`Updated transit route destination to ${hub.name}`);
    }
  };

  // Hazard Detour Bypass Handler
  const handleRouteAroundHazard = (risk) => {
    setSelectedRisk(null);
    // Find hubs matching risk state
    const stateHub = NER_HUBS.find((h) => h.state === risk.state);
    if (stateHub && origin === stateHub.id) {
      setOrigin("guwahati");
    }
    setActivePage("Smart Routes");
    showToast(`AI detour engaged around ${risk.state} corridor hazard`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit New Risk Incident Handler
  const handleAddHazardSubmit = (e) => {
    e.preventDefault();
    if (!newHazard.title || !newHazard.corridor) {
      showToast("Please enter a title and corridor for the hazard report.");
      return;
    }
    const created = {
      id: `risk-${Date.now()}`,
      state: newHazard.state,
      corridor: newHazard.corridor,
      title: newHazard.title,
      category: newHazard.category,
      severity: newHazard.severity,
      delayImpact: "+30 min",
      reported: "Just now",
      status: "Active Monitoring",
      description: newHazard.description || "Reported by NERA Control Center.",
      detourAdvice: newHazard.detourAdvice || "Exercise low speed and caution on mountain bends.",
    };
    setLiveRisks([created, ...liveRisks]);
    setReportModalOpen(false);
    setNewHazard({
      state: "Meghalaya",
      corridor: "",
      title: "",
      category: "Weather",
      severity: "Moderate",
      description: "",
      detourAdvice: "",
    });
    showToast("New hazard incident reported & synchronized to NERA telemetry radar.");
  };

  // Export Route Dispatch Ticket
  const handleExportDispatchTicket = () => {
    const content = `NERA-SMART LOGISTICS DISPATCH TICKET
==========================================
Date/Time: ${new Date().toLocaleString()}
Origin Terminal: ${routeData?.origin?.name || origin} (${routeData?.origin?.state})
Destination Hub: ${routeData?.dest?.name || destination} (${routeData?.dest?.state})
Cargo Category: ${cargoType}
Fleet Vehicle: ${vehicleType}
Selected Route: ${activeRoute.name} (${activeRoute.badge})
Transit Distance: ${activeRoute.distance}
Est. Travel Duration: ${activeRoute.duration}
Safety Index Score: ${activeRoute.safetyScore}/100
Accessibility Score: ${activeRoute.accessibilityScore}/100
Landslide Risk: ${activeRoute.landslideRisk}
Estimated Fuel Cost: ${activeRoute.estimatedCost}
Carbon Footprint: ${activeRoute.carbonKg} kg CO2

AI TRANSIT RATIONALE:
${activeRoute.aiRationale}

CHECKPOINT TELEMETRY TIMELINE:
${activeRoute.checkpoints.map((cp) => `- ${cp.name}: ${cp.status} (ETA ${cp.time})`).join("\n")}
==========================================
NERA Operations Control Center`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Dispatch-Ticket-${origin}-${destination}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Dispatch Ticket downloaded successfully!");
  };

  // Export Analytics CSV Handler
  const handleExportAnalyticsCSV = () => {
    let csv = "Corridor,Safety Score,Avg Speed,Status\n";
    ANALYTICS_DATA.corridorPerformance.forEach((c) => {
      csv += `"${c.corridor}",${c.safety},"${c.avgSpeed}","${c.status}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NERA-Corridor-Analytics-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Corridor Analytics CSV exported!");
  };

  // Dispatch Buffer Stock Handler
  const handleDispatchBufferStock = (district) => {
    setSelectedDistrict(district);
  };

  const confirmBufferDispatch = () => {
    showToast(`Emergency buffer stock allocated for ${selectedDistrict.district} (${selectedDistrict.state})!`);
    setSelectedDistrict(null);
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Smart Routes", icon: MapIcon },
    {
      name: "Risk Intelligence",
      icon: AlertTriangle,
      badge: liveRisks.filter((r) => r.severity === "High").length,
    },
    { name: "Accessibility", icon: Accessibility },
    { name: "Analytics", icon: BarChart3 },
  ];

  // Filtered live risks feed
  const filteredRisks = useMemo(() => {
    return liveRisks.filter((r) => {
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
  }, [liveRisks, riskCategoryFilter, riskSeverityFilter, searchQuery]);

  return (
    <div className="app">
      {/* TOAST NOTIFICATION FLOATER */}
      {toastMessage && (
        <div className="toast-notification">
          <Zap size={16} color="#34d399" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} aria-label="Close Toast">
            <X size={14} />
          </button>
        </div>
      )}

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
            <h2>NERA-SMART</h2>
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
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>

                {item.badge ? (
                  <span className="notification-dot" title="Active High Risk Alerts">
                    {item.badge}
                  </span>
                ) : null}
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
              <small>NERA Operations Control</small>
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
            <p className="breadcrumb">NERA / Intelligence Platform</p>
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
              {liveRisks.filter((r) => r.severity === "High").length > 0 && <span></span>}
            </button>
          </div>
        </header>

        {/* NOTIFICATIONS DROPDOWN */}
        {notificationsOpen && (
          <div className="notifications-dropdown">
            <div className="notif-header">
              <h4>Live Regional Alerts ({liveRisks.length})</h4>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--accent-text)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    showToast("All notifications marked as reviewed.");
                    setNotificationsOpen(false);
                  }}
                >
                  Mark all read
                </button>
                <button onClick={() => setNotificationsOpen(false)}>
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="notif-list">
              {liveRisks.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="notif-item clickable"
                  onClick={() => {
                    setSelectedRisk(r);
                    setNotificationsOpen(false);
                  }}
                >
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
              <div className="modal-header-row">
                <h3>Platform Settings</h3>
                <button onClick={() => setSettingsOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <p>Configure intelligence telemetry and dispatch parameters.</p>

              <div className="modal-field">
                <span>Speed Units</span>
                <select
                  value={settings.speedUnit}
                  onChange={(e) => setSettings({ ...settings, speedUnit: e.target.value })}
                  className="modal-select"
                >
                  <option value="km/h">Kilometers/hour (km/h)</option>
                  <option value="mph">Miles/hour (mph)</option>
                </select>
              </div>

              <div className="modal-field">
                <span>Auto-Recalculate Routes</span>
                <button
                  className={`toggle-btn ${settings.autoRecalculate ? "on" : "off"}`}
                  onClick={() =>
                    setSettings({ ...settings, autoRecalculate: !settings.autoRecalculate })
                  }
                >
                  {settings.autoRecalculate ? "Enabled (Live)" : "Disabled"}
                </button>
              </div>

              <div className="modal-field">
                <span>Monsoon Flood Radar Overlay</span>
                <button
                  className={`toggle-btn ${settings.radarOverlay ? "on" : "off"}`}
                  onClick={() =>
                    setSettings({ ...settings, radarOverlay: !settings.radarOverlay })
                  }
                >
                  {settings.radarOverlay ? "Active" : "Inactive"}
                </button>
              </div>

              <div className="modal-field">
                <span>Active Region Scope</span>
                <select
                  value={settings.activeRegion}
                  onChange={(e) => setSettings({ ...settings, activeRegion: e.target.value })}
                  className="modal-select"
                >
                  <option value="All 8 NERA States">All 8 NERA States (India)</option>
                  <option value="Assam & Meghalaya">Assam & Meghalaya Hubs</option>
                  <option value="Eastern Border Line">Eastern Border Line</option>
                </select>
              </div>

              <div className="modal-field">
                <span>Hazard Audio Alerts</span>
                <button
                  className={`toggle-btn ${settings.notificationAlerts ? "on" : "off"}`}
                  onClick={() =>
                    setSettings({ ...settings, notificationAlerts: !settings.notificationAlerts })
                  }
                >
                  {settings.notificationAlerts ? "Enabled" : "Muted"}
                </button>
              </div>

              <button
                className="modal-btn"
                onClick={() => {
                  setSettingsOpen(false);
                  showToast("Platform settings saved!");
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* HAZARD DETAIL MODAL */}
        {selectedRisk && (
          <div className="modal-overlay" onClick={() => setSelectedRisk(null)}>
            <div className="modal-content hazard-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <AlertTriangle
                    size={22}
                    color={selectedRisk.severity === "High" ? "#ef4444" : "#f59e0b"}
                  />
                  <div>
                    <h3 style={{ margin: 0 }}>{selectedRisk.title}</h3>
                    <small style={{ color: "var(--text-muted)" }}>
                      {selectedRisk.state} • {selectedRisk.corridor}
                    </small>
                  </div>
                </div>
                <button onClick={() => setSelectedRisk(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ margin: "16px 0", background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: "0.88rem", color: "var(--text-main)", marginBottom: "10px" }}>
                  {selectedRisk.description}
                </p>

                <div className="risk-detour-box" style={{ margin: 0 }}>
                  <Navigation size={16} />
                  <div>
                    <strong style={{ color: "#fff", display: "block" }}>AI Detour Recommendation:</strong>
                    <span style={{ fontSize: "0.82rem" }}>{selectedRisk.detourAdvice}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-dim)", marginBottom: "20px" }}>
                <span>Reported: <strong>{selectedRisk.reported}</strong></span>
                <span>Impact: <strong style={{ color: "#f87171" }}>{selectedRisk.delayImpact}</strong></span>
                <span>Status: <strong>{selectedRisk.status}</strong></span>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  className="analyze-btn"
                  style={{ flex: 1, marginTop: 0 }}
                  onClick={() => handleRouteAroundHazard(selectedRisk)}
                >
                  <Navigation size={16} /> Route Around Hazard
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => {
                    showToast(`Alert shared to NERA Operations Telemetry`);
                    setSelectedRisk(null);
                  }}
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REPORT NEW HAZARD MODAL */}
        {reportModalOpen && (
          <div className="modal-overlay" onClick={() => setReportModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3>Report New Hazard Incident</h3>
                <button onClick={() => setReportModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <p>Log a real-time landslide, weather alert or road blockade into the NERA radar.</p>

              <form onSubmit={handleAddHazardSubmit} className="route-form">
                <div className="form-row">
                  <div className="select-group">
                    <label>STATE</label>
                    <select
                      value={newHazard.state}
                      onChange={(e) => setNewHazard({ ...newHazard, state: e.target.value })}
                    >
                      {STATE_ACCESSIBILITY.map((s) => (
                        <option key={s.state} value={s.state}>
                          {s.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="select-group">
                    <label>HAZARD CATEGORY</label>
                    <select
                      value={newHazard.category}
                      onChange={(e) => setNewHazard({ ...newHazard, category: e.target.value })}
                    >
                      <option value="Weather">Weather</option>
                      <option value="Terrain">Terrain / Landslide</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Traffic">Traffic Congestion</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>CORRIDOR / HIGHWAY (E.G. NH-27)</label>
                  <div className="input-wrapper">
                    <input
                      placeholder="e.g. NH-06 / Shillong Pass"
                      value={newHazard.corridor}
                      onChange={(e) => setNewHazard({ ...newHazard, corridor: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>HAZARD TITLE</label>
                  <div className="input-wrapper">
                    <input
                      placeholder="e.g. Flash Flooding at Km 42"
                      value={newHazard.title}
                      onChange={(e) => setNewHazard({ ...newHazard, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="select-group">
                    <label>SEVERITY</label>
                    <select
                      value={newHazard.severity}
                      onChange={(e) => setNewHazard({ ...newHazard, severity: e.target.value })}
                    >
                      <option value="Low">Low Risk</option>
                      <option value="Moderate">Moderate Risk</option>
                      <option value="High">High Priority Alert</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>DESCRIPTION & DETOUR GUIDANCE</label>
                  <div className="input-wrapper">
                    <input
                      placeholder="Enter description & detour route advice..."
                      value={newHazard.description}
                      onChange={(e) =>
                        setNewHazard({
                          ...newHazard,
                          description: e.target.value,
                          detourAdvice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button type="submit" className="analyze-btn" style={{ marginTop: "8px" }}>
                  <PlusCircle size={18} /> Submit Hazard Alert
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DISPATCH BUFFER STOCK MODAL */}
        {selectedDistrict && (
          <div className="modal-overlay" onClick={() => setSelectedDistrict(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3>Emergency Relief Buffer Stock</h3>
                <button onClick={() => setSelectedDistrict(null)}>
                  <X size={18} />
                </button>
              </div>
              <p>
                Allocate buffer food & medical supplies to <strong>{selectedDistrict.district}</strong> ({selectedDistrict.state}).
              </p>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span>Isolation Cause:</span>
                  <strong>{selectedDistrict.cause}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Current Reserve:</span>
                  <strong style={{ color: "#34d399" }}>{selectedDistrict.bufferStockDays} Days Stock</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button className="analyze-btn" style={{ flex: 1, marginTop: 0 }} onClick={confirmBufferDispatch}>
                  <PackageCheck size={18} /> Confirm Emergency Dispatch
                </button>
                <button className="secondary-btn" onClick={() => setSelectedDistrict(null)}>
                  Cancel
                </button>
              </div>
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
                  onClick={() => {
                    setActivePage("Smart Routes");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
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
                onClick={() => {
                  setActivePage("Smart Routes");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
              <StatCard
                icon={<AlertTriangle />}
                label="Active High Risk Alerts"
                value={liveRisks.filter((r) => r.severity === "High").length.toString()}
                change="-8%"
                type="orange"
                onClick={() => {
                  setActivePage("Risk Intelligence");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
              <StatCard
                icon={<Accessibility />}
                label="Regional Accessibility"
                value="78%"
                change="+6%"
                type="blue"
                onClick={() => {
                  setActivePage("Accessibility");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
              <StatCard
                icon={<Truck />}
                label="Multimodal Terminals"
                value={NER_HUBS.length.toString()}
                change="+2 new"
                type="purple"
                onClick={() => {
                  showToast("12 Multimodal Terminals Online");
                }}
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
                    {isCalculating ? "Analyzing Pipeline..." : "Engine Active"}
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

                  <button className="analyze-btn" onClick={handleAnalyze} disabled={isCalculating}>
                    <Navigation size={18} />
                    {isCalculating ? "Recalculating AI Corridors..." : "Analyze Route with AI"}
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
                  {liveRisks.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="risk-item clickable"
                      onClick={() => setSelectedRisk(r)}
                      title="Click to view detailed hazard telemetry"
                    >
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
                  onClick={() => {
                    setActivePage("Risk Intelligence");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  View all live hazards across NERA
                  <ChevronRight size={16} />
                </button>
              </div>
            </section>

            {/* INTERACTIVE MAP PANEL */}
            <section className="panel map-panel">
              <RegionalMap
                originId={origin}
                destId={destination}
                activeRouteInfo={activeRoute}
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
            <div className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className="eyebrow">AI-POWERED DECISION SUPPORT</span>
                <h2>Smart Route Intelligence Engine</h2>
                <p>
                  Comparative corridor analysis factoring in road elevation gradients,
                  weather telemetry, landslide likelihood, and vehicle capabilities.
                </p>
              </div>
              <button className="secondary-btn" onClick={handleExportDispatchTicket}>
                <FileText size={16} /> Export Dispatch Ticket
              </button>
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
                  onClick={handleAnalyze}
                  style={{ marginTop: 0 }}
                  disabled={isCalculating}
                >
                  {isCalculating ? "Analyzing..." : "Recalculate"}
                </button>
              </div>
            </div>

            {/* ROUTE COMPARISON CARDS */}
            {showResult && (
              <div className="result-area">
                <div className="route-comparison">
                  {routeData.routes.map((rt) => {
                    const isSelected = selectedRouteId === rt.id;
                    return (
                      <div
                        key={rt.id}
                        className={`route-option ${isSelected ? "recommended-route selected" : ""}`}
                        onClick={() => {
                          setSelectedRouteId(rt.id);
                          showToast(`Selected ${rt.name} (${rt.badge})`);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="route-option-header">
                          <div>
                            <span className="eyebrow">{rt.badge}</span>
                            <h2>{rt.name}</h2>
                          </div>
                          <span
                            className={`route-status ${isSelected ? "recommended" : "neutral"}`}
                          >
                            {isSelected ? "Active Focus" : rt.tag}
                          </span>
                        </div>

                        <div className="route-line-visual">
                          <div className="route-point">
                            {routeData.origin?.name ? routeData.origin.name.charAt(0) : "O"}
                          </div>
                          <div
                            className={`route-line-track ${isSelected ? "recommended-track" : ""}`}
                          ></div>
                          <div className="route-point destination">
                            {routeData.dest?.name ? routeData.dest.name.charAt(0) : "D"}
                          </div>
                        </div>

                        <div className="route-cities">
                          <span>{routeData.origin?.name || origin}</span>
                          <span>{routeData.dest?.name || destination}</span>
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
                    );
                  })}
                </div>

                {/* AI RECOMMENDATION SPOTLIGHT FOR SELECTED ROUTE */}
                <div className="recommended-card">
                  <div className="recommend-header">
                    <div>
                      <span className="eyebrow">AI DECISION ENGINE ANALYSIS</span>
                      <h2>{activeRoute.name} Selected for {cargoType}</h2>
                    </div>
                    <div className="recommended-icon">
                      <ShieldCheck size={32} />
                    </div>
                  </div>

                  <p>{activeRoute.aiRationale}</p>

                  <div className="score-grid">
                    <Score label="Safety Score" value={`${activeRoute.safetyScore}/100`} />
                    <Score label="Accessibility" value={`${activeRoute.accessibilityScore}/100`} />
                    <Score label="Route Efficiency" value={`${activeRoute.efficiencyScore}%`} />
                    <Score label="Risk Classification" value={activeRoute.landslideRisk.toUpperCase()} />
                  </div>
                </div>

                {/* CHECKPOINTS TIMELINE */}
                <div className="route-details panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">WAYPOINT TELEMETRY</span>
                      <h3>Critical Corridor Checkpoints ({activeRoute.name})</h3>
                    </div>
                    <span className="ai-badge">
                      <Check size={12} /> Sensors Online
                    </span>
                  </div>

                  <div className="checkpoints-timeline">
                    {activeRoute.checkpoints.map((cp, idx) => (
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
                    activeRouteInfo={activeRoute}
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
            <div className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className="eyebrow">GEOTECHNICAL & CLIMATE RADAR</span>
                <h2>Real-Time Regional Risk Intelligence</h2>
                <p>
                  Live sensor telemetry, landslide slope displacement warnings, and
                  monsoonal precipitation tracking across all 8 NERA highway corridors.
                </p>
              </div>
              <button className="primary-btn" onClick={() => setReportModalOpen(true)}>
                <PlusCircle size={18} /> Report Hazard Alert
              </button>
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
                      className={`filter-pill ${riskCategoryFilter === cat ? "active" : ""}`}
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
                    className={`filter-pill ${riskSeverityFilter === sev ? "active" : ""}`}
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
                  className={`risk-detail-card ${risk.severity.toLowerCase()} clickable`}
                  onClick={() => setSelectedRisk(risk)}
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
                    <button
                      className="text-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRouteAroundHazard(risk);
                      }}
                      style={{ fontSize: "0.75rem", padding: 0 }}
                    >
                      Route Bypass <ChevronRight size={14} />
                    </button>
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
                    <h3>NERA Logistics Connectivity Index</h3>
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
                        <th>Action</th>
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
                            <button
                              className="table-action-btn"
                              onClick={() => {
                                const hub = NER_HUBS.find((h) => h.state === item.state);
                                if (hub) setDestination(hub.id);
                                setActivePage("Smart Routes");
                                showToast(`Set destination state to ${item.state}`);
                              }}
                            >
                              Route Here
                            </button>
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
                      <div className="district-stock" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <strong>{dist.bufferStockDays} Days</strong>
                        <button
                          className="action-pill-btn"
                          onClick={() => handleDispatchBufferStock(dist)}
                        >
                          Dispatch Stock
                        </button>
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
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>
                            {choke.description}
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <strong style={{ color: "#34d399" }}>{choke.flowScore}% Flow</strong>
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
            <div className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className="eyebrow">HISTORICAL & PREDICTIVE METRICS</span>
                <h2>Logistics Performance Analytics</h2>
                <p>
                  Corridor efficiency, fuel savings from AI bypass routing, on-time delivery
                  rates, and seasonal delay trends across North East India.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  value={analyticsTimeframe}
                  onChange={(e) => {
                    setAnalyticsTimeframe(e.target.value);
                    showToast(`Analytics timeframe set to ${e.target.value}`);
                  }}
                  className="modal-select"
                  style={{ padding: "8px 12px" }}
                >
                  <option value="Last 6 Months">Last 6 Months</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Monsoon Season">Monsoon Season</option>
                </select>
                <button className="secondary-btn" onClick={handleExportAnalyticsCSV}>
                  <Download size={16} /> Export CSV Report
                </button>
              </div>
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
                    <span className="eyebrow">SEASONAL PATTERNS ({analyticsTimeframe})</span>
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
function StatCard({ icon, label, value, change, type, onClick }) {
  return (
    <div
      className={`stat-card ${onClick ? "clickable" : ""}`}
      onClick={onClick}
      title={onClick ? "Click to view detailed metrics" : undefined}
    >
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