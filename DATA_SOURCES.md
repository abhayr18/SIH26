# SIH26083 — Data Sources & Scientific Inventory

**Policy:** In strict compliance with SIH26083 guidelines and MoES scientific standards, every dataset utilized in this platform is cataloged below with its source, scope, refresh cadence, and legal usage terms. Synthetic or proxy data is explicitly labeled and never presented as genuine government statistical returns.

---

## 1. Meteorological Telemetry & Numerical Weather Prediction

### Open-Meteo Weather Forecast API
- **Source**: Open-Meteo / ECMWF IFS (Integrated Forecasting System) & GFS Seamless Ensemble
- **URL**: `https://open-meteo.com/`
- **Geographic Scope**: All 30 monitored Indian city/district coordinates
- **Variables Ingested**:
  - `temperature_2m` (°C) — Ambient dry-bulb air temperature at 2 meters
  - `relative_humidity_2m` (%) — Atmospheric relative humidity
  - `wind_speed_10m` (km/h & m/s) — Wind velocity at 10 meters above ground
  - `shortwave_radiation_instant` (W/m²) — Direct incident solar flux
  - `dew_point_2m` (°C) — Dew point temperature
  - `surface_pressure` (hPa) — Atmospheric barometric pressure
- **Refresh Cadence**: Hourly numerical update; platform queries with 15-minute client cache.
- **License**: Creative Commons Attribution 4.0 International (CC-BY 4.0).
- **UI Label**: `LIVE`

### Open-Meteo ERA5 Reanalysis Historical Weather Dataset
- **Source**: European Centre for Medium-Range Weather Forecasts (ECMWF) / Copernicus Climate Change Service via Open-Meteo Historical Archive
- **Geographic Scope**: 20 representative Indian cities across diverse agro-climatic zones
- **Temporal Span**: January 1, 2022 to December 31, 2025 (hourly resolution)
- **Role**: Training, calibration, and chronological hold-out validation for the ML health risk classifier.
- **License**: Copernicus Products License & CC-BY 4.0.
- **UI Label**: `HISTORICAL ARCHIVE (REANALYSIS)`

---

## 2. Geospatial & Critical Infrastructure

### OpenStreetMap & Overpass API
- **Source**: OpenStreetMap Foundation (OSMF)
- **Endpoint**: Overpass QL API (`https://overpass-api.de/api/interpreter`)
- **Query Nodes**:
  - `amenity=hospital`, `amenity=clinic` — Public and private emergency healthcare facilities
  - `amenity=drinking_water` — Municipal drinking water points and water kiosks
  - `amenity=community_centre`, `amenity=social_facility` — Candidate cooling shelters and relief halls
- **Geographic Scope**: Dynamic bounding boxes centered on selected Indian urban centers
- **License**: Open Database License (ODbL) 1.0.
- **UI Label**: `LIVE / OSM DATA`

### `@svg-maps/india` Vector GeoJSON
- **Source**: Open-source administrative boundary maps of India
- **Geographic Scope**: State and union territory polygons of India
- **License**: MIT License.
- **UI Label**: `ADMINISTRATIVE BOUNDARY LAYER`

---

## 3. Socio-Demographic & Vulnerability Data

### Census of India & National Family Health Survey (NFHS-5)
- **Source**: Ministry of Home Affairs (MHA) & Ministry of Health and Family Welfare (MoHFW) Public Demographic Returns
- **Geographic Scope**: 32 States & Union Territories + Metro Municipal Wards (Pune, Delhi NCR, Ahmedabad)
- **Variables**:
  - Total Population & Urban Density (people / km²)
  - Elderly Ratio (% aged $\ge 60$)
  - Child Ratio (% aged $< 5$)
  - Outdoor Manual Labor Ratio (% construction, street vending, agriculture, transit)
  - Informal Settlement / Slum Ratio (% uninsulated tin/asbestos roof dwellings)
  - Healthcare Infrastructure Access Score (0–100 index)
- **License**: Government Open Data License — India (GODL-India).
- **UI Label**: `DEMOGRAPHIC BASELINE (CENSUS/NFHS)`

---

## 4. Healthcare Surge & Hospital Admissions Telemetry

### Prototype Emergency Department Admissions & Bed Registry
- **Source**: Prototype Decision-Support Framework
- **Status**: **SYNTHETIC / ESTIMATED PROXY DATA**
- **Rationale**: Real-time hospital emergency room admissions and heatstroke casualty data are not currently available via public APIs during hackathon evaluation. A realistic synthetic telemetry pipeline was constructed to demonstrate how live MoHFW / IDSP (Integrated Disease Surveillance Programme) feeds will plug directly into the hospital readiness dashboard once deployed.
- **Variables Simulated**:
  - Dedicated heatstroke cooling beds
  - Current heat-related daily emergency admissions
  - Oral Rehydration Salts (ORS) packet buffers
  - Cold saline IV fluid reserve units
- **UI Label**: `DEMO / SYNTHETIC DATA` (Prominently displayed on all healthcare widgets).
