# NERA-SMART Backend Intelligence API

This directory contains the Node.js / Express REST API for the **NERA-SMART Logistics Intelligence Platform**.

## 🚀 Architecture

The backend executes a 13-stage AI Route Pipeline across modular services:

- `data/neraDatabase.js`: Hubs, profiles, distance matrix, and live hazard feeds.
- `services/weatherService.js`: Weather analysis (precipitation, cloud fog, monsoons).
- `services/terrainService.js`: Terrain analysis (elevation profile, slope grade, hill capability).
- `services/roadRiskService.js`: Road quality, active incidents, choke points.
- `services/routeEngine.js`: Master 13-stage pipeline orchestrator.

## 📡 API Endpoints

- `GET /api/health` — Health check status
- `POST /api/routes/analyze` — Main 13-stage AI Route Pipeline
- `GET /api/hubs` — List 12 NERA logistics hubs
- `GET /api/risks` — Real-time risk alerts with optional filters (`category`, `severity`, `search`)
- `GET /api/accessibility` — State accessibility metrics & vulnerable district status
- `GET /api/analytics` — Monthly performance analytics

## 📦 Commands

```bash
# Start backend server
npm start

# Start with auto-reload (Nodemon)


# NERA-SMART Frontend Application

This directory contains the React 18 client application for the **NERA-SMART Logistics Intelligence Platform**.

## 🚀 Features

- **Interactive Canvas Map**: Visualizes 12 NERA logistics hubs and animated transit corridors.
- **Smart Route Decision Engine UI**: Interactive route selection (`Route A`, `Route B`, `Route C`) updating spotlight scores, AI rationale, and checkpoint telemetry.
- **Live Regional Risk Feed**: Category and severity filter pills, hazard detail modal drawer, and real-time hazard submission form.
- **Accessibility Watch**: State connectivity leaderboard and emergency relief buffer stock dispatch allocation.
- **Analytics & Export**: Monthly delay trends, corridor leaderboard, CSV analytics export, and text dispatch ticket generator.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Icons**: Lucide React
- **Styling**: Modern CSS3 Tokens with HSL Palette, Glassmorphism, and responsive breakpoints.

## 📦 Commands

```bash
# Start Vite development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

npm run dev
```
