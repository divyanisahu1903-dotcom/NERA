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
npm run dev
```
