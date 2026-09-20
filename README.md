# ThermoWatch — Extreme Heatwave Early Warning & Heat-Health Intelligence Platform

[![SIH 2026](https://img.shields.io/badge/SIH-2026-orange.svg?style=for-the-badge)](https://www.sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/Problem%20ID-SIH26083-blue.svg?style=for-the-badge)](https://www.sih.gov.in/)
[![Ministry](https://img.shields.io/badge/Ministry-MoES%20%7C%20NCMRWF-green.svg?style=for-the-badge)](https://www.moes.gov.in/)
[![Tests](https://img.shields.io/badge/Tests-31%2F31%20Passing-brightgreen.svg?style=for-the-badge)](#-automated-testing--validation)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Zero--Error-blue.svg?style=for-the-badge)](#-tech-stack)

> **Ministry of Earth Sciences (MoES) | National Centre for Medium Range Weather Forecasting (NCMRWF)**  
> **Smart India Hackathon 2026 — Disaster Management Category (Software)**  
> **Problem Statement SIH26083:** *Extreme Heatwave Early Warning and Human Thermal Stress Index*

---

## 📌 Executive Summary & Solution Overview

**ThermoWatch** is an **AI-driven heat-health early warning and decision-support system** that goes beyond conventional meteorology and ambient temperature alerts by estimating how forecasted heat conditions will directly affect human health at a localized, actionable level.

Traditional early warnings rely almost solely on dry-bulb air temperature. However, 40°C in an arid desert with 15% relative humidity permits natural evaporative cooling through sweating, whereas 40°C in a coastal or river basin with 65% humidity disables perspiration, rapidly precipitating hyperthermia, heat syncope, and fatal heatstroke.

ThermoWatch bridges the **missing integration layer** between environmental heat and localized human health impact:

$$\mathbf{\text{"What will the weather be?"} \implies \text{"What will the weather do to people?"}}$$

The system integrates **weather forecasts, biometeorological thermal stress indices, demographic exposure, environmental heat vulnerability, and historical health surveillance** to generate spatially resolved **Heat-Health Risk** intelligence across India.

$$\mathbf{Weather\ Forecast \longrightarrow Thermal\ Stress \longrightarrow Exposure\ \&\ Vulnerability \longrightarrow Health\ Impact\ Prediction \longrightarrow 3–5\ Day\ Risk\ Forecast \longrightarrow GIS-Based\ Action}$$

---

## 🌟 What Differentiates Our Solution

Existing systems notify authorities that *“This area is experiencing extreme heat.”*  
**ThermoWatch answers the four decisive operational questions:**

1. **How severe is human thermal stress?**  
   Evaluates multi-variable physiological strain using **WBGT**, **UTCI**, **NOAA Heat Index**, and our proposed **Human Thermal Stress Index (HTSI/HTSS)** equipped with a non-compensatory safeguard against lethal wet-bulb spikes.
2. **Which populations are most vulnerable?**  
   Overlays ward-level demographic data: outdoor laborers (construction, hawkers, transit), informal settlements (uninsulated tin-roof housing), elderly (>60), infants (<5), and tree-canopy deficits.
3. **Where is health risk likely to increase over the next 3–5 days?**  
   An AI/ML-driven **Heat Risk Digital Twin** projects elevated health surge probabilities and peak windows **72 to 120 hours in advance** with transparent lead-time tracking.
4. **What should authorities and healthcare facilities prepare for?**  
   Automates targeted administrative advisories: spatial cooling center deployment algorithms, hospital triage surge levels (cooling beds, cold IV saline, ORS), and sector-specific occupational work-rest schedules.

---

## 🏗️ Core Architecture & End-to-End Pipeline

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │ 1. FORECAST WEATHER INGESTION                                          │
   │    Open-Meteo Global Ensembles (ECMWF IFS, GFS, hourly resolution)     │
   │    Variables: Temperature, Relative Humidity, Wind Speed, Solar Flux   │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
   ┌────────────────────────────────────────────────────────────────────────┐
   │ 2. MULTI-VARIABLE THERMAL STRESS ENGINE (lib/thermal-engine.ts)         │
   │    • NOAA Rothfusz Heat Index        • Australian BoM Simplified WBGT  │
   │    • Bröde et al. UTCI               • Stull Psychrometric Wet Bulb    │
   │    • Proposed Human Thermal Stress Index (HTSI, 0–100 non-compensatory)│
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
   ┌────────────────────────────────────────────────────────────────────────┐
   │ 3. POPULATION EXPOSURE & VULNERABILITY LAYER (lib/vulnerability.ts)    │
   │    • Census & NFHS-5 overlays        • Informal/slum housing density   │
   │    • Outdoor worker concentration    • Healthcare distance & canopy    │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
   ┌────────────────────────────────────────────────────────────────────────┐
   │ 4. HEAT-HEALTH RISK MODEL (lib/ml-runtime.ts)                          │
   │    • ERA5 2022–2025 multi-city training cohort                         │
   │    • Platt scaling temperature calibration for true probabilities     │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
   ┌────────────────────────────────────────────────────────────────────────┐
   │ 5. MORTALITY & HOSPITALIZATION SURGE ESTIMATION                        │
   │    • Relative mortality risk ratios (e.g. 2.8x baseline)               │
   │    • High+ surge probability (calibrated 0–100% confidence)            │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
   ┌────────────────────────────────────────────────────────────────────────┐
   │ 6. 3–5 DAY HEALTH-SURGE FORECAST (lib/digital-twin.ts)                 │
   │    • Multi-horizon trajectory: Current → +24h → +48h → +72h → Day 4/5  │
   │    • T-72h proactive early warning lead-time countdown                │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
   ┌────────────────────────────────────────────────────────────────────────┐
   │ 7. WARD/ZONE-LEVEL HYPERLOCAL GIS (components/hyperlocal-ward-gis.tsx) │
   │    • High-resolution municipal ward boundaries (Pune, Delhi, Ahmedabad)│
   │    • Spatial heat shadow & demographic vulnerability overlays          │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
   ┌────────────────────────────────────────────────────────────────────────┐
   │ 8. TARGETED GOVERNMENT & HEALTHCARE ACTIONS                            │
   │    • Smart Cooling Center Spatial Optimizer (lib/cooling-optimizer.ts) │
   │    • Hospital Surge Readiness Triage (lib/hospital-readiness.ts)       │
   │    • Occupational Work-Rest Cycles (lib/worker-safety.ts)              │
   │    • Multilingual Public Broadcasts & Alerts (lib/alerting.ts)         │
   └────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ 14 Differentiating Features Built for Evaluation

| # | Feature | Operational Capability | Code Reference |
|---|---|---|---|
| 1 | **National Heat-Health Command Center** | Real-time national heat stress overview, composite HTSI gauge (0–100), alert ticker, and multi-index quad comparison. | [`thermowatch-dashboard.tsx`](file:///d:/SIH/components/thermowatch-dashboard.tsx) |
| 2 | **Multi-Index Biometeorological Engine** | Computes Rothfusz HI, BoM WBGT, Bröde UTCI, Stull Wet Bulb, PET, and HTSI with non-compensatory protection. | [`thermal-engine.ts`](file:///d:/SIH/lib/thermal-engine.ts) |
| 3 | **Hyperlocal Ward/Zone GIS** | Ward-level microclimate drilldown for metros (Pune, Delhi NCR, Ahmedabad) tracking slum density, canopy buffers, and vulnerable cohorts. | [`hyperlocal-ward-gis.tsx`](file:///d:/SIH/components/hyperlocal-ward-gis.tsx) |
| 4 | **5-Day Heat Risk Digital Twin** | 6-stage synoptic temporal progression (+0h to +120h) tracking **T-72h Lead Time to Peak** for proactive resource deployment. | [`digital-twin-view.tsx`](file:///d:/SIH/components/digital-twin-view.tsx) |
| 5 | **Interactive What-If Scenario Simulator** | Live microclimate sliders ($\Delta T$, $\Delta RH$, $\Delta Wind$, $\Delta Solar$, worker exposure) with sub-millisecond client-side recalculation. | [`what-if-simulator.tsx`](file:///d:/SIH/components/what-if-simulator.tsx) |
| 6 | **6-Stage Heat Risk Cascade** | Visual causal domino chain: Weather $\to$ Thermal Strain $\to$ Population Exposure $\to$ Clinical Risk $\to$ Hospital Load $\to$ Action. | [`risk-cascade-view.tsx`](file:///d:/SIH/components/risk-cascade-view.tsx) |
| 7 | **Smart Cooling Center Spatial Optimizer** | Heuristic spatial algorithm deploying misting stations where $Risk \times Pop_{vuln} \times Distance$ is maximized. | [`cooling-center-view.tsx`](file:///d:/SIH/components/cooling-center-view.tsx) |
| 8 | **Hospital Surge Readiness Triage** | Clinical preparedness classification (`NORMAL`, `PREPARE`, `HIGH ALERT`, `CRITICAL`) with dedicated cooling bed, IV saline, and ORS tracking. | [`hospital-readiness-view.tsx`](file:///d:/SIH/components/hospital-readiness-view.tsx) |
| 9 | **Occupational Worker Safety** | Mandatory work-rest cycles and hourly hydration quotas tailored for Construction, Hawkers, Police, Delivery, and Agriculture. | [`worker-safety-view.tsx`](file:///d:/SIH/components/worker-safety-view.tsx) |
| 10 | **Heatwave Memory & Benchmarking** | Comparative historical benchmarking against landmark events (2024 North India 49.9°C, 2022 Spring, 2015 Coastal Crisis). | [`heatwave-memory-view.tsx`](file:///d:/SIH/components/heatwave-memory-view.tsx) |
| 11 | **Explainability Waterfall** | SHAP-like feature attribution isolating the exact physical factors driving risk (ambient heat vs moisture vs outdoor density). | [`thermowatch-dashboard.tsx`](file:///d:/SIH/components/thermowatch-dashboard.tsx) |
| 12 | **Calibrated ML Model Diagnostics** | Transparent evaluation of ERA5 2022–2025 model weights, ROC-AUC curves, confusion matrix, and Brier calibration score. | [`ml-runtime.ts`](file:///d:/SIH/lib/ml-runtime.ts) |
| 13 | **Grounded AI Heat Assistant** | Conversational assistant injected with active district telemetry, answering operational questions with voice playback. | [`grounded-assistant-modal.tsx`](file:///d:/SIH/components/grounded-assistant-modal.tsx) |
| 14 | **Multilingual Dynamic Localization** | Instant on-the-fly interface translation into **English**, **Hindi (हिंदी)**, **Marathi (मराठी)**, and **Kannada (ಕನ್ನಡ)**. | [`kannada-localizer.tsx`](file:///d:/SIH/components/kannada-localizer.tsx) |

---

## 🧮 Mathematical Formulations

### 1. Non-Compensatory Human Thermal Stress Index (HTSI)
Standard weighted averages fail in humid coastal climates because high humidity can cause lethal heatstroke even when dry-bulb temperature is moderate. ThermoWatch enforces a **non-compensatory physiological safeguard**:

$$\text{HTSI} = \max\left(\sum w_i \cdot I_{\text{norm}, i},\; 0.85 \times \max(HI_{\text{norm}}, WBGT_{\text{norm}}, UTCI_{\text{norm}})\right)$$

### 2. Australian Bureau of Meteorology Outdoor WBGT
$$WBGT_{\text{outdoor}} = 0.567 \cdot T_a + 0.393 \cdot e + 3.94 + \left(\frac{sr}{1000}\right) \times 0.004$$
Where $T_a$ is dry bulb (°C), $e$ is vapor pressure (hPa), and $sr$ is solar radiation ($W/m^2$).

### 3. Cooling Center Deficit Allocation Score
$$S_{\text{deficit}} = \left(\frac{\text{HTSI}}{100}\right) \times \left(\frac{\text{Population}_{\text{vulnerable}}}{5,000}\right) \times \text{DistanceToNearestCenter}_{\text{km}}$$

---

## 💻 Tech Stack & Engineering Standards

- **Core Framework**: Next.js 15+ / React 19 / TypeScript 5.9
- **Bundler & Server**: Vinext / Vite 8 / Node.js
- **Styling**: Tailwind CSS & Lucide React Iconography
- **Visualizations**: Recharts 3.8 & SVG Maps of India
- **Machine Learning Inference**: Pure zero-overhead TypeScript runtime with pre-serialized JSON weights (`heat-risk-model.json`), delivering **sub-millisecond execution (<1ms)** with zero Python dependency at runtime.
- **Code Quality & Verification**: Oxlint, Oxfmt, 31 automated unit tests.

---

## 🚀 Quick Start & Local Execution

### Prerequisites
- Node.js 20+ or 22+
- npm 10+

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/abhayr18/SIH26.git
cd SIH26

# Install dependencies
npm install

# Run automated unit test suite (31 tests)
npm test

# Run TypeScript typecheck (Zero errors)
npx tsc --noEmit

# Start development server
npm run dev
```

Open **`http://localhost:3000/`** in your browser.

---

## 🎯 5-Minute Hackathon Demonstration Script

1. **National Command Center (Overview)**: Open `http://localhost:3000`. Show the composite HTSI gauge, current alert status, and multi-index breakdown.
2. **Demo Scenarios**: Click **"High-Humidity Coastal Crisis"** on the top bar. Show evaluators how WBGT spikes to dangerous levels while dry-bulb temperature remains moderate, demonstrating the non-compensatory safeguard.
3. **Hyperlocal GIS**: Navigate to **Hyperlocal GIS**, choose **Pune** or **Delhi**, and inspect ward-level slum density, tree canopy deficit, and vulnerable population counts.
4. **What-If Simulator**: Move the **$\Delta$ Temperature** slider up by $+3^\circ\text{C}$ and **$\Delta$ Humidity** by $+15\%$. Watch the system recalculate risks and escalate alert tiers synchronously.
5. **5-Day Digital Twin**: Open the **Digital Twin** tab to reveal the **T-72h Lead-Time countdown**, demonstrating how authorities receive early warning before peak mortality occurs.
6. **Risk Cascade**: Walk through the **6-Stage Domino Chain** showing how atmospheric forcing translates into hospital bed shortages.
7. **Cooling Centers & Hospital Triage**: Show the spatial algorithm ranking candidate misting centers and hospital preparedness levels (cooling beds, IV saline, ORS).
8. **AI Assistant & Multilingual**: Open the **AI Heat Assistant** to ask for operational protocols, and toggle language to **Hindi** or **Marathi**.

---

## 📚 Technical Documentation Index

For deep-dive technical references, consult the dedicated documentation files:

- 📐 **[ARCHITECTURE.md](file:///d:/SIH/ARCHITECTURE.md)**: Full architectural blueprint and Mermaid dataflow diagrams.
- 🌡️ **[THERMAL_INDEX_METHODOLOGY.md](file:///d:/SIH/THERMAL_INDEX_METHODOLOGY.md)**: Detailed derivations for HI, WBGT, UTCI, PET, and HTSI.
- 🤖 **[ML_METHODOLOGY.md](file:///d:/SIH/ML_METHODOLOGY.md)**: ERA5 training cohort, Platt calibration, and validation metrics.
- 📡 **[DATA_SOURCES.md](file:///d:/SIH/DATA_SOURCES.md)**: Open-Meteo, OSM, Census 2011, and NFHS-5 integration details.
- 🔌 **[API_DOCUMENTATION.md](file:///d:/SIH/API_DOCUMENTATION.md)**: REST endpoints, payloads, and TypeScript types.
- 🎭 **[DEMO_GUIDE.md](file:///d:/SIH/DEMO_GUIDE.md)**: Comprehensive evaluation walkthrough with scenario keys.

---

## ⚖️ Scientific Integrity & Statutory Disclaimer

This platform is an operational decision-support prototype engineered for disaster management planning and municipal resource allocation. It is **NOT** an individual medical diagnostic tool or substitute for official India Meteorological Department (IMD) or National Disaster Management Authority (NDMA) statutory bulletins. All synthetic evaluation scenarios and baseline estimates are transparently badged in compliance with MoES scientific data integrity standards.

---

**SIH 2026 — Team SIH26083 | Ministry of Earth Sciences (MoES) & NCMRWF**