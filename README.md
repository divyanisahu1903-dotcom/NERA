# NERA-SMART — Logistics Intelligence Platform

[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)](#license)
[![Region](https://img.shields.io/badge/Region-8%20NERA%20States%20(India)-orange?style=for-the-badge)](#overview)

> **Intelligent Mobility, Geotechnical Landslide Risk Prediction & Multimodal Corridor Optimization across North Eastern India.**

---

## 🌟 Overview

**NERA-SMART** is an end-to-end AI-powered decision support platform built specifically for freight logistics and supply chain resilience across the **8 North Eastern Region (NERA) states of India**: Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim.

Mountainous topographies, monsoonal landslides, severe cloud fog, river chasm bottlenecks (e.g. Siliguri corridor, Sonapur tunnel, Makru suspension bridge), and remote hinterland vulnerabilities require a specialized multi-criteria corridor intelligence engine. NERA-SMART bridges real-time geotechnical telemetry with automated route calculation and fleet dispatch management.

---

## 🔄 13-Stage AI Route Analysis Pipeline

NERA-SMART processes dispatch telemetry through a dedicated 13-stage analysis workflow:

```
                  ┌─────────────────────────────────────────┐
                  │          USER DISPATCH INPUT            │
                  │   Origin, Destination, Cargo & Vehicle  │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │    [1] Candidate Corridor Discovery     │
                  │ (Route A: Standard NH | B: AI | C: Ridge)│
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ [2] Weather Analysis (Precipitation/Fog)│
                  │ [3] Terrain Analysis (Elevation/Slope) │
                  │ [4] Road & Risk Analysis (Incidents)    │
                  │ [5] Accessibility & Vulnerability       │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ [6] AI Risk & Delay Prediction          │
                  │ [7] Multi-Criteria Utility Scoring     │
                  │ [8] Route Comparison & Metric Matrix    │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ [9] AI Recommendation & Rationale       │
                  │[10] Waypoint Checkpoint Telemetry       │
                  │[11] Interactive Dashboard Response      │
                  └─────────────────────────────────────────┘
```

1. **User Input Validation**: Validates origin terminal, destination hub, cargo priority (e.g. Medical Supplies, Produce), and vehicle specs.
2. **Corridor Discovery**: Discovers candidate transit paths (Route A: Primary NH, Route B: AI Bypass Corridor, Route C: Contingency Ridge Bypass).
3. **Weather Analysis**: Calculates rainfall impact (mm/hr), cloud fog visibility, and monsoon flood risk along each corridor.
4. **Terrain Analysis**: Evaluates elevation profiles, steep grade percentages (%), and vehicle gradeability matching (Hill Capability).
5. **Road & Infrastructure Risk Analysis**: Matches active hazard alerts, pave quality indices, and critical choke points.
6. **Accessibility Analysis**: Computes state connectivity scores and remote district isolation penalties.
7. **AI Risk & Delay Prediction**: Predicts landslide likelihood and calculates expected delay minutes.
8. **Multi-Criteria Route Scoring**: Computes weighted Safety Score (/100), Accessibility Score (/100), and Efficiency Score (%).
9. **Routes Comparison Matrix**: Compares corridors across distance, transit time, delay impact, fuel cost (INR), and CO₂ emissions.
10. **AI Recommended Route**: Selects the optimal corridor using weighted utility scoring.
11. **AI Rationale Synthesis**: Generates natural language decision breakdowns explaining why a specific corridor is chosen.
12. **Waypoint & Checkpoint Telemetry**: Synthesizes step-by-step route checkpoints with ETA telemetry.
13. **Dashboard Payload Assembly**: Delivers structured JSON for real-time frontend UI rendering.

---

## ✨ Features & Functional Capabilities

- **Interactive AI Route Planner**: Real-time corridor recalculation, hub swap tool, map pin selection, and vehicle capability matching.
- **Live Regional Risk Telemetry**: Monsoonal landslide slope displacement alerts, traffic queue updates, and interactive **Route Bypass** shortcuts.
- **Hazard Incident Reporting**: Built-in modal form allowing operations admins to report live hazards into the NERA radar.
- **Accessibility & Hinterland Watch**: Regional state connectivity index (0-100) and **Emergency Relief Buffer Stock Dispatch** for remote districts (e.g. Tawang, Dima Hasao).
- **Logistics Analytics & Reporting**: Monthly delay trends, corridor leaderboard, and **One-Click CSV Export**.
- **Official Dispatch Ticket Generation**: Export printable/downloadable text dispatch tickets for fleet drivers.
- **Platform Settings Modal**: Toggle speed units (`km/h` vs `mph`), live auto-recalculate, monsoon radar overlay, and active region scopes.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Custom CSS Design Tokens, Canvas Map Component.
- **Backend**: Node.js, Express, CORS, Dotenv, RESTful API Architecture.
- **State Management & API Layer**: React Hooks with automatic client-side fallback when backend is offline.

---

## 📂 Project Structure

```
NERA/
├── backend/                     # Dedicated Express Backend API
│   ├── data/
│   │   └── neraDatabase.js       # Authoritative NERA Hubs, Risks & Distance Matrix
│   ├── routes/
│   │   └── apiRoutes.js          # REST Controllers & Endpoints
│   ├── services/
│   │   ├── weatherService.js     # Weather Analysis Module
│   │   ├── terrainService.js     # Terrain & Elevation Analysis Module
│   │   ├── roadRiskService.js    # Road & Infrastructure Risk Module
│   │   └── routeEngine.js        # 13-Stage NERA AI Pipeline Service
│   ├── package.json
│   └── server.js                 # Express Application Entry Point (Port 5000)
│
├── frontend/                    # Dedicated React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── RegionalMap.jsx   # Interactive Canvas Map Component
│   │   ├── data/
│   │   │   └── nerData.js        # Regional Logistics Data Structures
│   │   ├── services/
│   │   │   └── api.js            # Frontend API Client with Offline Fallback
│   │   ├── App.jsx               # Master React Application Component
│   │   ├── App.css               # Premium Dark Theme Stylesheet
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
├── package.json                 # Monorepo Scripts (`npm run dev`, `npm run backend`)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/divyanisahu1903-dotcom/NERA.git
   cd NERA
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

- **Run Frontend Application**:
  ```bash
  npm run dev
  ```
  *App will be available at `http://localhost:5173`*

- **Run Backend API Server**:
  ```bash
  npm run backend
  ```
  *API will be live at `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)*

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Backend server health status |
| `/api/routes/analyze` | `POST` | Executes full 13-stage AI Route Pipeline |
| `/api/hubs` | `GET` | Returns 12 NERA logistics hubs with coordinates & telemetry |
| `/api/risks` | `GET` | Returns live hazard alerts (supports `category`, `severity`, `search` query filters) |
| `/api/accessibility` | `GET` | Returns state accessibility metrics & vulnerable district status |
| `/api/analytics` | `GET` | Returns monthly delay statistics & corridor leaderboard |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
