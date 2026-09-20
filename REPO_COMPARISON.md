# SIH26083 — Comprehensive Repository Comparison & Integration Audit

**Project:** SIH26083 — Extreme Heatwave Early Warning and Human Thermal Stress Intelligence  
**Organization:** Ministry of Earth Sciences (MoES) / National Centre for Medium Range Weather Forecasting (NCMRWF)  
**Evaluated Repositories:**
1. **THERMOS** (`https://github.com/nagarjun012/THERMOS`)
2. **ThermoWatch** (`https://github.com/monishkandanuru/thermowatch-sih26083`)

---

## 1. Executive Summary & Repository Metadata

| Attribute | REPO 1: THERMOS (`THERMOSAFE`) | REPO 2: ThermoWatch (`thermowatch-sih26083`) |
| :--- | :--- | :--- |
| **Primary Architecture** | Split architecture: Python FastAPI Backend + React 18/Vite Frontend (plus older monolithic Vanilla JS in root) | Unified Full-Stack Next.js / Vinext (TypeScript App Router + Vite + Cloudflare D1/SQLite fallback) |
| **Frontend Stack** | React 18, TypeScript, Tailwind CSS v3, Vite 5, Zustand, Recharts, Leaflet / React-Leaflet, Lucide React | React 19, TypeScript, Tailwind CSS v4, Radix UI / Shadcn UI, Recharts v3, SVG Maps India, Lucide React |
| **Backend Stack** | FastAPI 0.115, Uvicorn, Pydantic v2, Pandas, Scikit-Learn | Next.js App Router API Routes, Drizzle ORM, Web Crypto API (HMAC-SHA256), Web Notifications |
| **ML Engine** | Python Scikit-Learn `RandomForestClassifier` trained on 1,000 synthetic rows with self-evaluation | Python training script (`train_model.py`) using real 2022–2025 Open-Meteo ERA5 historical weather data across 20 cities, exported to zero-overhead JSON weights (`heat-risk-model.json`) for instant TypeScript client/server inference |
| **GIS / Map Engine** | Leaflet with OpenStreetMap tiles, city marker points, and basic polygons | `@svg-maps/india` interactive SVG vector map with 30 monitored Indian districts, hotspot indicators, and forecast horizon toggles |
| **Thermal Indices** | Rothfusz Heat Index, Australian BoM simplified WBGT, Bröde UTCI regression, 0–100 HTSS composite | Heat Index, Wet Bulb, Australian BoM WBGT, PET (Physiological Equivalent Temperature), HTSI (0–100) |
| **Alerting & Response** | IMD category thresholds (Green, Yellow, Orange, Red), rule-based action advice | Persistent warnings with deduplication, Web Notification API, mock SMS/WhatsApp preview formatting, OSM Overpass facility lookup, community incident reporting |
| **Security & Auth** | None (public open API) | HMAC-SHA256 signed HTTP-only session cookies, Officer login, RBAC (Public vs. Officer), audit logging, rate limiting |
| **Localization** | English only | English, Kannada (complete UI dictionary), Hindi, Telugu templates |
| **License / Attribution** | Built for SIH 2026 — Team THERMOSAFE (No explicit SPDX license) | Built for SIH 2026 — ThermoWatch Team (No explicit SPDX license) |

---

## 2. In-Depth Component Analysis

### A. Thermal Stress & Index Calculations
- **THERMOS**:
  - `thermal_stress_service.py` has a clean, rigorous implementation of:
    1. **NOAA/NWS Rothfusz 9-term polynomial regression** for Heat Index (including dry and humid adjustments).
    2. **Australian Bureau of Meteorology (BoM)** simplified outdoor WBGT incorporating vapor pressure and solar radiation.
    3. **Bröde et al. (2012) UTCI regression** approximation factoring wind speed ($v_{ms}$), solar radiation ($sr$), and mean radiant temperature ($T_{mrt}$).
    4. **Human Thermal Stress Score (HTSS, 0–100)**: Normalizes sub-indices ($HI \to [0, 100]$, $WBGT \to [0, 100]$, $UTCI \to [0, 100]$) and applies configurable weights (`WEIGHT_UTCI=0.4`, `WEIGHT_WBGT=0.35`, `WEIGHT_HI=0.25`) with a crucial **non-compensatory safeguard** (`score = max(weighted, 0.85 * max_sub)`), ensuring that an extreme spike in one index cannot be diluted away by others.
- **ThermoWatch**:
  - Implements Heat Index, Wet Bulb (Stull formula), WBGT, and PET (Physiological Equivalent Temperature).
  - Normalizes into a Human Thermal Stress Index (HTSI, 0–100) and provides vulnerability screening multipliers (age, physical exertion, acclimatization).
- **Audit Verdict**:
  - **Re-use & Synthesize**: Adopt the strict scientific formulation of Rothfusz HI, BoM WBGT, Bröde UTCI, and the non-compensatory HTSS composite from THERMOS, while integrating ThermoWatch's individual vulnerability exposure multipliers (age, exertion, acclimatization).

### B. Machine Learning & Health Risk Modeling
- **THERMOS**:
  - Trains a 50-tree Random Forest on 1,000 synthetic random samples generated on the fly. Evaluates directly on the training set and reports a synthetic 92% accuracy. This violates scientific data integrity principles for government decision support.
- **ThermoWatch**:
  - Significantly superior ML pipeline:
    - Ingests real 4-year historical hourly weather (2022–2025) from Open-Meteo ERA5 across 20 representative Indian cities.
    - Chronological split: 2022–2023 for training, 2024 for Platt temperature scaling/calibration, 2025 as hold-out test set.
    - Exports standardized feature scalers, calibrated logistic coefficients, intercepts, and validation metrics (Accuracy, Macro F1, Precision, Recall, Confusion Matrix, False Alarms, Missed Events) to `artifacts/heat-risk-model.json`.
    - Real-time zero-dependency inference in TypeScript via `predictHeatRisk()` with SHAP-like feature contribution explanations.
- **Audit Verdict**:
  - **Adopt ThermoWatch's reproducible ML methodology** and artifact architecture. Extend feature inputs with demographic vulnerability variables and expose honest validation metrics.

### C. GIS & Geospatial Visualization
- **THERMOS**:
  - Uses React-Leaflet with OpenStreetMap raster tiles and circular city markers.
  - Good for tile panning and zooming, but lacks state/district-level choropleth polygon boundary shading and hierarchical breadcrumb drilling.
- **ThermoWatch**:
  - Uses `@svg-maps/india` vector map rendering 30 monitored Indian hubs with real-time risk color-coding, hotspot rankings, and 24h/48h/72h forecast horizon overlays.
- **Audit Verdict**:
  - We will combine vector geospatial rendering with Leaflet/GeoJSON layer support to achieve the required **National → State → District → City → Zone/Ward** hierarchical exploration. Clicking a ward opens a comprehensive risk, exposure, and facility panel.

### D. Operational Decision Support & Response
- **THERMOS**:
  - Static recommendation cards for public, workers, and authorities based on HTSS bands.
- **ThermoWatch**:
  - Dedicated **Response Hub** connecting to OpenStreetMap Overpass API to query actual nearby hospitals, primary health centres, clinics, and drinking water stations.
  - Role-based **Officer Dashboard** with persistent incident reporting, alert acknowledgments, audit logging, and downloadable CSV briefs.
- **Audit Verdict**:
  - **Adopt and expand ThermoWatch's response infrastructure**, elevating it to meet SIH26083's advanced requirements: Smart Cooling Center Optimization, Hospital Readiness Index, and Outdoor Worker Safe Windows.

### E. AI Assistant & Regional Localization
- **THERMOS**:
  - No AI assistant; English only.
- **ThermoWatch**:
  - Local AI assistant (`local-assistant.tsx`) querying active browser context; Web Speech API voice synthesis and speech recognition.
  - Comprehensive Kannada dictionary translation layer with architecture for Hindi and Telugu.
- **Audit Verdict**:
  - **Adopt and expand the Assistant and Localization architecture**: Extend regional language coverage to English, Hindi, Marathi, and Kannada. Upgrade the AI assistant to answer complex multi-variable domain questions (cooling center proximity, what-if impacts, ward triage).

---

## 3. Gap Analysis against SIH26083 Master Brief

| SIH26083 Requirement | THERMOS Status | ThermoWatch Status | Unified Target Strategy |
| :--- | :--- | :--- | :--- |
| **Multi-variable Thermal Stress (HI, WBGT, UTCI)** | ✅ Present (Python) | ⚠️ Partial (HI, WBGT, PET) | Fully unify all 4 established indices + HTSS 0–100 in high-performance runtime |
| **HTSS Score (0–100, non-compensatory)** | ✅ Present | ⚠️ Partial (HTSI) | Implement standardized HTSS with sub-index contribution breakdown |
| **ML Health/Mortality Risk (24h to 5-day)** | ❌ Synthetic self-eval | ✅ 24h, 48h, 72h calibrated | Expand calibrated ML to full 5-day horizon (24h, 48h, 72h, 4d, 5d) |
| **Vulnerability Model (Demographics, Workers, Slums)** | ⚠️ Basic state table | ⚠️ Exposure multipliers | Integrate comprehensive Population Vulnerability Index (PVI) |
| **Hyperlocal GIS (India → State → District → Ward)** | ❌ City pins only | ❌ 30 cities SVG | Deliver multi-scale GIS with Ward-level drilldown & risk overlays |
| **Early Warning Engine (Normal, Watch, Warning, Extreme)** | ⚠️ Rule-based | ✅ Auto persistent warnings | Integrate multi-horizon alerts with duration, peak forecast, and escalation |
| **Feature 1: Heat Risk Digital Twin (Current → 5 Days)** | ❌ Not implemented | ❌ Not implemented | **[NEW]** Build 5-step timeline showing synchronous evolution of weather, stress, and risk |
| **Feature 2: What-If Heat Scenario Simulator** | ❌ Not implemented | ❌ Not implemented | **[NEW]** Interactive simulation engine for temperature (+1 to +5°C), humidity, wind, solar, and worker exposure |
| **Feature 3: Risk Explainability (SHAP-equivalent)** | ❌ Not implemented | ✅ Coefficients/Attribution | Enhance with waterfall feature contributions & natural language explanations |
| **Feature 4: Heat Risk Cascade** | ❌ Not implemented | ❌ Not implemented | **[NEW]** Visual flow: Weather → Stress → Exposure → Health Risk → Hospital Load → Action |
| **Feature 5: Heatwave Memory / Historical Comparison** | ❌ Not implemented | ⚠️ Basic DB history | **[NEW]** Historical event timeline & side-by-side benchmark with past severe heatwaves |
| **Feature 6: Smart Cooling Center Optimization** | ❌ Not implemented | ⚠️ OSM facility list | **[NEW]** Spatial scoring algorithm: $Risk \times Vulnerable Pop \times Distance$ to suggest next site |
| **Feature 7: Hospital Readiness Level** | ❌ Not implemented | ⚠️ Facility list | **[NEW]** Healthcare preparedness triage (Normal, Prepare, High Alert, Critical) |
| **Feature 8: Outdoor Worker Safety Mode** | ❌ Not implemented | ⚠️ General multipliers | **[NEW]** Worker-specific profiles (Construction, Street Vendor, Traffic, Delivery, Agri) with rest/work cycles |
| **Feature 9: Multilingual Alerts** | ❌ English only | ✅ Kannada, Hindi, Telugu | Fully localized alerts in English, Hindi, Marathi, Kannada |
| **Feature 10: Grounded AI Heat Assistant** | ❌ Not implemented | ✅ Local rule assistant | Domain-grounded assistant with situational awareness and advisory generation |
| **Feature 11: Demo / Scenario Engine** | ⚠️ 5 static presets | ⚠️ Tabletop simulation | Central synchronized scenario engine (Normal summer, Severe, Extreme, High humidity, Dry heat, Rapid escalation) |
| **Feature 12: Early Warning Lead-Time (T-72h to Peak)** | ❌ Not implemented | ⚠️ Basic forecast | Visual timeline of lead-time detection and escalating authority protocols |
| **Feature 13: Confidence & Data Quality** | ❌ Not implemented | ⚠️ Model metrics | Expose data freshness, model confidence, sensor completeness, and source tags |
| **Feature 14: Data Source Health Panel** | ❌ Not implemented | ⚠️ /api/health basic | Live system monitor: Weather API, GIS, Census Data, Health Data, ML Engine |

---

## 4. Reusable Code & Architecture Integration Plan

### What to Reuse from THERMOS:
1. **Mathematical Formulations** (`THERMOS/backend/app/services/thermal_stress_service.py`):
   - High-fidelity Rothfusz NOAA Heat Index with boundary adjustments.
   - Australian BoM simplified WBGT formulation.
   - Bröde et al. UTCI approximation formulas.
   - Non-compensatory max-sub logic for HTSS 0–100 composite scoring.
2. **State-Level Demographic & Vulnerability Reference Data** (`THERMOS/backend/app/data/vulnerability_data.py`):
   - Elderly ratio, children ratio, outdoor worker proportion, population density, slum index.
3. **UI Visual Elements**:
   - Circular gauge styling, multi-variable radar charts, and risk contribution bars.

### What to Reuse from ThermoWatch:
1. **Zero-Overhead Machine Learning Model & Pipeline**:
   - `ml/train_model.py` ERA5 dataset extraction and training methodology.
   - Calibrated weight matrix and temperature scaling in `heat-risk-model.json`.
   - Client/Server TypeScript inference engine in `lib/ml-model.ts`.
   - Model validation reporting (accuracy, macro F1, confusion matrix, false alarms).
2. **Ensemble Weather & Forecasting Engine** (`lib/weather-ensemble.ts`, `lib/forecast-time.ts`):
   - Multi-model Open-Meteo ensemble and robust timestamp alignment.
3. **Response & Facility Lookup Engine** (`lib/thermowatch.ts`):
   - OpenStreetMap Overpass integration for hospitals, clinics, and shelters.
4. **Security & Role-Based Access Control** (`lib/security.ts`, `lib/security-demo-auth.ts`):
   - HMAC-SHA256 session management, officer credentials, role gating, audit logging.
5. **Localization Infrastructure** (`components/kannada-localizer.tsx`, `lib/thermowatch.ts`):
   - Multi-language dictionary structure and translation hook.
6. **Local AI Assistant Core** (`components/local-assistant.tsx`):
   - Structured context ingestion and optional browser Web Speech integration.

---

## 5. Potential Conflicts & Resolution

1. **Python vs. TypeScript Runtime Conflict**:
   - *Issue*: THERMOS relies on a Python FastAPI backend with heavy libraries (`pandas`, `scikit-learn`), which fail to build on Python 3.14 on Windows due to lack of prebuilt C wheels. In contrast, ThermoWatch executes its entire validated ML pipeline and business logic natively in TypeScript.
   - *Resolution*: Port the clean mathematical algorithms from THERMOS's Python service into pure TypeScript. This eliminates Python runtime dependencies, removes latency, and enables instantaneous client-side What-If simulations without network overhead.
2. **Tailwind CSS Version Discrepancy**:
   - *Issue*: THERMOS uses Tailwind v3 (`tailwind.config.js`), while ThermoWatch uses modern Tailwind v4 (`@tailwindcss/postcss`).
   - *Resolution*: Adopt Tailwind CSS v4 with unified CSS design tokens, modern dark theme palettes, glassmorphic cards, and crisp disaster-management color scales.
3. **Map Rendering Technique**:
   - *Issue*: THERMOS uses Leaflet canvas/tiles; ThermoWatch uses an SVG vector map.
   - *Resolution*: Implement a hybrid GIS architecture: high-level interactive SVG choropleth for rapid national/state overview, seamlessly switching to a detailed Leaflet/GeoJSON ward-level map with layer toggles (thermal stress, vulnerability, cooling centers, hospitals).

---

## 6. Intellectual Property, Attribution & Licensing

Both repositories were created for the Smart India Hackathon 2026. All adapted scientific algorithms, dataset schemas, and architectural patterns will be formally attributed in `LICENSES_AND_ATTRIBUTIONS.md`:
- **Team THERMOSAFE** (`nagarjun012/THERMOS`): Attributed for Rothfusz HI, BoM WBGT, Bröde UTCI formulations, and state vulnerability baseline data.
- **ThermoWatch Team** (`monishkandanuru/thermowatch-sih26083`): Attributed for ERA5 training pipeline, calibrated model architecture, OSM Overpass facility lookup, and Kannada localization structure.
- **Open-Meteo & Copernicus ERA5**: Attributed for live weather forecast and reanalysis datasets under CC-BY 4.0.
- **OpenStreetMap & Overpass API**: Attributed for open infrastructure mapping data under ODbL.
