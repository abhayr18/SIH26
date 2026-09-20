# SIH26083 — Extreme Heatwave Early Warning & Human Thermal Stress Intelligence Platform

> **Ministry of Earth Sciences (MoES) | National Centre for Medium Range Weather Forecasting (NCMRWF)**  
> **Smart India Hackathon 2026 — Disaster Management Category (Software)**  
> **Target Problem:** SIH26083 — *Extreme Heatwave Early Warning and Human Thermal Stress Index*

## Executive Summary & Solution Overview

Our solution is an **AI-driven heat-health early warning and decision-support system** that goes beyond conventional heatwave and weather alerts by estimating how forecasted heat conditions may affect human health at a localized level.

The system integrates **weather forecasts, thermal stress indices, population exposure, demographic and environmental vulnerability, and historical health outcomes** to generate a spatially resolved **Heat-Health Risk** for different locations.

The solution follows a multi-stage pipeline:

$$\mathbf{Weather\ Forecast \longrightarrow Thermal\ Stress \longrightarrow Exposure\ \&\ Vulnerability \longrightarrow Health\ Impact\ Prediction \longrightarrow 3–5\ Day\ Risk\ Forecast \longrightarrow GIS-Based\ Action}$$

The system first collects forecasted **temperature, humidity, wind speed and solar/radiation-related parameters** and derives human thermal stress using metrics such as **WBGT, UTCI, Heat Index, and the proposed Human Thermal Stress Index (HTSI/HTSS)**.

It then combines this thermal exposure with spatial population and vulnerability factors such as **population density, age groups, outdoor-worker exposure, socioeconomic conditions, environmental heat characteristics and healthcare accessibility**. Where available, historical **heat-related hospitalization, mortality and other health surveillance data** are used to learn the relationship between heat exposure and health outcomes.

An AI/ML-based **heat-health risk model** then estimates the likelihood of elevated health impacts and identifies locations where an unusual increase or **health-surge/spike** may occur over the next **3–5 days**. The output is expressed as a risk level/probability rather than an unsupported exact prediction of deaths or hospital admissions.

The results are presented through a **ward/zone-level GIS dashboard**, allowing authorities to move from a broad heatwave warning to a localized understanding of:
- **Where thermal stress is highest**
- **Which populations are most vulnerable**
- **Which areas have elevated health-impact risk**
- **Where a hospitalization/mortality surge may occur**
- **Which healthcare facilities are located nearby**
- **What preventive actions should be initiated**

For high-risk areas, the system generates **location-specific advisories and administrative recommendations**, such as activating cooling centres, adjusting outdoor work hours, issuing targeted public-health warnings, increasing healthcare preparedness, and notifying relevant facilities.

---

## What Differentiates Our Solution

Existing meteorological and public-health systems already provide important heatwave warnings, forecasts and preparedness guidance. Our proposed system focuses on the **missing integration layer** between environmental heat and localized health impact.

Instead of stopping at:
> *“This area is experiencing extreme heat.”*

the system answers:
> *“How severe is the human thermal stress, which population is vulnerable, where is the health risk likely to increase over the next 3–5 days, and what should authorities and healthcare facilities prepare for?”*

Thus, the solution transforms **heat forecasting into actionable heat-health intelligence**, enabling earlier and more localized intervention before heat-related health impacts escalate.

---

## Core Architecture & End-to-End Pipeline

```
Forecast Weather (Temperature + Humidity + Wind + Solar/Radiation)
       │
       ▼
Thermal Stress Engine (WBGT / UTCI / Heat Index / HTSI)
       │
       ▼
Population Exposure + Vulnerability Layer (Age, Outdoor Workers, Housing, Health Access)
       │
       ▼
Heat-Health Risk Model (Calibrated Machine Learning / Health Surveillance)
       │
       ▼
Mortality & Hospitalization Risk (Surge Probability & Impact Levels)
       │
       ▼
3–5 Day Health-Surge Forecast (Multi-Horizon Early Warning Lead Time)
       │
       ▼
Ward/Zone-Level GIS (Spatial Thermal & Vulnerability Overlays)
       │
       ▼
Targeted Government & Healthcare Actions (Cooling Centers, Hospital Surge Triage, Worker Shifts)
```

---

## 1. Problem Statement & Paradigm Shift

Traditional heatwave early warnings in India have historically relied almost exclusively on dry-bulb ambient temperature. However, identical temperatures produce vastly different physiological impacts depending on **relative humidity, wind speed, incident solar flux, duration of exposure, and demographic vulnerability**. For instance, 40°C in an arid zone with 15% relative humidity permits active evaporative cooling through sweating, whereas 40°C in a coastal or irrigated river basin with 65% relative humidity severely constrains perspiration, rapidly triggering hyperthermia, heat syncope, and fatal heatstroke.

This platform executes a foundational shift in disaster management:
$$\text{"What will the weather be?"} \implies \mathbf{\text{"What will the weather do to people?"}}$$

---

## 3. Core Functional Capabilities

### A. Multi-Variable Biometeorological Calculations
- **NOAA/NWS Rothfusz Polynomial Heat Index**: 9-term regression with low/high humidity adjustments.
- **Australian Bureau of Meteorology (BoM) Simplified Outdoor WBGT**: Incorporates vapor pressure ($e$) and direct solar radiation ($sr$).
- **Bröde et al. (2012) Universal Thermal Climate Index (UTCI)**: Regression factoring mean radiant temperature ($T_{mrt}$), wind velocity, and vapor pressure.
- **Human Thermal Stress Score (HTSS, 0–100)**: Normalized composite with a **non-compensatory safeguard** ($\max(\text{weighted}, 0.85 \times \text{peak\_sub})$) ensuring life-threatening wet bulb spikes cannot be masked.

### B. Reproducible Machine Learning Health Risk Pipeline
- Trained on 4 years (2022–2025) of hourly Open-Meteo ERA5 reanalysis across 20 representative Indian cities.
- Chronological validation: 2022–2023 train, 2024 Platt temperature scaling calibration, 2025 hold-out evaluation.
- Zero-latency runtime execution in TypeScript via JSON-serialized weights (`heat-risk-model.json`).
- Exposes SHAP-like feature contributions explaining why an area is at risk.

### C. 14 Differentiating Features Built for Evaluation
1. **Heat Risk Digital Twin**: 6-step temporal progression (Current $\to$ 24h $\to$ 48h $\to$ 72h $\to$ Day 4 $\to$ Day 5) tracking synoptic evolution and early warning lead-time.
2. **What-If Heat Scenario Simulator**: Live interactive sliders for $\Delta T$, $\Delta RH$, $\Delta Wind$, $\Delta Solar$, and worker exposure with instant baseline vs. scenario recalculation.
3. **Risk Explainability Engine**: Feature attribution waterfall isolating temperature, moisture, and occupational density.
4. **Heat Risk Cascade**: 6-stage causal domino chain: Weather $\to$ Thermal Load $\to$ Demographics $\to$ Clinical Risk $\to$ Hospital Load $\to$ Command Action.
5. **Heatwave Memory & Benchmarking**: Real-time side-by-side comparison against landmark Indian heatwaves (2024 North India 49.9°C, 2022 Early Spring, 2015 Southeastern Coastal Crisis).
6. **Smart Cooling Center Optimization**: Spatial allocation algorithm deploying temporary shelters where $Risk \times Pop_{vuln} \times Distance$ is greatest.
7. **Hospital Surge Readiness Triage**: Healthcare preparedness classification (`NORMAL`, `PREPARE`, `HIGH ALERT`, `CRITICAL`) with dedicated bed and ORS tracking.
8. **Outdoor Worker Safety Mode**: Tailored work-rest cycles and hydration quotas for Construction, Vendors, Police, Delivery, and Agriculture.
9. **Multilingual Localization**: Native dynamic localization in **English**, **Hindi**, **Marathi**, and **Kannada**.
10. **Grounded AI Heat Assistant**: Conversational agent answering situational questions with live telemetry and voice synthesis.
11. **Controlled Demo Scenario Engine**: 7 instant presets (Normal summer, Severe continental, Coastal humid, Extreme emergency, Arid heat, Rapid escalation, Urban slum crisis).
12. **Early Warning Lead-Time**: T-72h to Peak countdown enabling proactive authority mobilization.
13. **Prediction Confidence & Data Quality**: Transparent audit of model confidence %, input completeness %, and variable freshness.
14. **Data Source Health Telemetry**: Live ping monitor for weather APIs, OSM GIS, census tables, and ML inferencing.

---

## 4. Quick Start & Local Execution

### Prerequisites
- Node.js 20+ or 22+
- npm 10+

```bash
# Clone repository
git clone https://github.com/monishkandanuru/thermowatch-sih26083.git
cd SIH

# Install dependencies
npm install

# Run automated test suite (31 tests)
npm test

# Run TypeScript typecheck
npx tsc --noEmit

# Run production build
npm run build

# Start development server
npm run dev
```

Open `http://localhost:3000/` in your browser.

---

## 5. Hackathon Demonstration Workflow (5–8 Minutes)

1. **Step 1 — Command Center Opening**: Review national overview, top alert ticker, and live HTSS status.
2. **Step 2 — Switch Demo Scenario**: Click `High Humidity Coastal Heat` on the top Demo Scenario Bar; observe instant shift in WBGT.
3. **Step 3 — Hyperlocal GIS Drilldown**: Navigate to `Hyperlocal GIS`, select **Pune** or **Delhi**, inspect `Ward 12 - Shivajinagar`.
4. **Step 4 — Explainability Waterfall**: Examine why HTSS reached 86/100 (high moisture + outdoor worker exposure).
5. **Step 5 — What-If Simulator**: Increase temperature by +2°C; observe alert escalation from Warning to Extreme.
6. **Step 6 — 5-Day Digital Twin**: Review T-72h lead-time peak detection.
7. **Step 7 — Cooling Center Optimization**: Check the top recommended temporary misting site.
8. **Step 8 — AI Heat Assistant**: Ask: *"What should authorities do today?"* and receive grounded protocols.
9. **Step 9 — Multilingual Switch**: Toggle interface to Marathi or Hindi to view localized public advisories.

---

## 6. Scientific & Decision-Support Disclaimer

This platform is an operational decision-support prototype built for disaster management planning and resource allocation. It is **NOT** an individual medical diagnostic tool, clinical triage system, or substitute for official India Meteorological Department (IMD) / National Disaster Management Authority (NDMA) statutory bulletins. All synthetic or estimated health datasets are clearly flagged with `DEMO / SYNTHETIC DATA` badges in compliance with MoES scientific data integrity guidelines.
#   S I H 2 6  
 