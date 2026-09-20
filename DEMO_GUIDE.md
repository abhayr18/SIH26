# Demo Guide & Evaluator Pitch Script — SIH26083

## SIH26083: Extreme Heatwave Early Warning and Human Thermal Stress Index
**Target Audience**: Smart India Hackathon Evaluators, MoES / NCMRWF Officials, NDMA / SDMA Disaster Managers  
**Duration**: 5–7 Minutes Live Pitch + 3 Minutes Q&A  
**URL**: `http://localhost:3000/`

---

## 1. Executive Framing (1 Minute)

> **"Respected Judges, traditional heatwave alerts tell us: 'Tomorrow will be 42°C in Delhi and 42°C in coastal Odisha.' But 42°C in dry Rajasthan is survivable, whereas 42°C with 75% humidity in coastal Odisha or an informal tin-roof settlement in Delhi causes fatal heatstroke within 45 minutes.**
>
> **For SIH26083, our platform transforms heat early warnings from 'What will the weather be?' to 'What will the weather do to human beings?'**
>
> **We have engineered a unified biometeorological, epidemiological, and geospatial intelligence platform that calculates multi-variable thermal strain, predicts healthcare surges 5 days in advance, and issues targeted life-saving operational directives."**

---

## 2. Interactive Live Demo Walkthrough (4 Minutes)

### Step 1: The Evaluator Demo Scenario Bar
1. Look at the top **Quick Demo Presets** bar on the dashboard.
2. Click **"Coastal Humidity Trap (Odisha 38°C / 78% RH)"**.
   - *Point out*: "Notice ambient temperature is only 38°C — below traditional IMD 40°C heatwave criteria. But because of 78% humidity, the **WBGT spikes to 34.2°C** and **UTCI exceeds 46°C**, triggering an **EXTREME (RED) HTSS Alert of 94/100**."
   - *Key takeaway*: "This proves our non-compensatory safeguard: humidity is lethal even below traditional heatwave thresholds."
3. Click **"Dry Inland Oven (Nagpur 47°C / 18% RH)"**.
   - *Point out*: "Compare this: 47°C ambient temperature, but low humidity. The human body can still sweat, so WBGT is 31.8°C. Different physiological risk, different operational response."

### Step 2: Hyperlocal GIS & Demographic Vulnerability (Ward Level)
1. Click the **"Hyperlocal Ward GIS"** navigation tab (or select Pune / Delhi).
2. Switch city to **"Pune (PMC)"** or **"Delhi (MCD)"**.
3. Point to the ward ranking table:
   - "Notice **Bhavani Peth (Ward 07)**. Although Pune's ambient temperature is uniform across the city, Bhavani Peth has **68% tin roofs**, **4% green cover**, and high informal worker density. Its **Population Vulnerability Score (PVS) is 78.5**, giving it a **Critical Risk Score of 86.8**."
   - "Contrast this with **Kothrud (Ward 12)** with 38% green cover and PVS 34.2. Our system prevents uniform city-wide alerts and directs resources where mortality will concentrate."

### Step 3: 5-Day Digital Twin & ML Risk Horizon
1. Click **"5-Day Digital Twin"**.
2. Walk the timeline from **Current $\to$ +24h $\to$ +48h $\to$ +72h $\to$ Day 5**:
   - "Disaster management requires lead time. Our 5-day digital twin projects peak thermal load 72 hours out."
   - "Notice the ML Relative Risk curve spiking to **1.82x** at +72h. District magistrates can pre-position resources before hospitals are overwhelmed."

### Step 4: Causal Risk Domino Chain
1. Click **"Risk Cascade"**.
2. Trace the 6-stage domino effect:
   - **Stage 1 (Meteorology)** $\to$ **Stage 2 (Thermal Engine)** $\to$ **Stage 3 (Demographics)** $\to$ **Stage 4 (Clinical Risk)** $\to$ **Stage 5 (Hospital Load)** $\to$ **Stage 6 (Action Directives)**.
   - "Every alert is fully explainable. We don't just output a number; we show the exact causal chain from solar insolation to emergency room beds."

### Step 5: Actionable Operational Modules
1. Click **"Hospital Readiness"**:
   - Show dynamic bed surge status, ORS packet buffers (e.g., 4,200 packs required), and cold saline reserves.
2. Click **"Worker Safety"**:
   - Select **"Construction & Masonry"** vs. **"Gig Delivery Couriers"**.
   - Show ISO 7243 work-rest cycles: "15 min work / 45 min rest per hour, mandatory 1.0L/hr hydration, stop outdoor activity from 12:00 PM to 4:00 PM."
3. Click **"Cooling Optimizer"**:
   - Show temporary misting shelter spatial rankings based on distance from vulnerable slums and high heat stress intersections.

### Step 6: What-If Microclimate Simulator
1. Click **"What-If Simulator"**.
2. Drag the **Cool Roof Adoption** slider to 50% and **Urban Green Cover** to +20%.
3. Watch the real-time recalculation:
   - "Within 20 milliseconds, the engine demonstrates that high-albedo coatings and shade reduce perceived UTCI by 4.2°C and decrease projected heat stroke risk by 22%."

### Step 7: Grounded Conversational AI Assistant
1. Click the floating **"Heat AI Assistant"** button at the bottom right.
2. Click the quick prompt: *"What are the recommended actions for outdoor construction workers right now?"*
3. Listen to the grounded voice response:
   - "The assistant doesn't hallucinate generic advice; it reads the live telemetry and demographic vulnerability of the currently selected district."

---

## 3. Anticipated Judge Questions & Answers

### Q1: "How is your HTSS different from standard Heat Index or WBGT?"
> **Answer**: "Heat Index ignores wind and solar radiation. WBGT is designed for fit military personnel and ignores chronic demographic vulnerability. Our Human Thermal Stress Score (HTSS, 0–100) incorporates five international indices (HI, WBGT, UTCI, Stull Wet-Bulb, and PET) and adds a **mathematical non-compensatory safeguard** ($\text{HTSS} \ge \max(\text{SubIndex})$). When extreme humidity paralyzes sweat evaporation, HTSS immediately registers emergency stress even if ambient temperature is mild."

### Q2: "Where do you get your data? Is this real or simulated?"
> **Answer**: "We practice strict scientific honesty. Our weather layer integrates **live Open-Meteo feeds** and **NCMRWF IMDAA reanalysis proxies** with real-time temperature, humidity, wind, and surface solar radiation. Our demographic layer is calibrated on official **Census 2011 and NFHS-5 state indicators**. Health outcome ratios are labeled **DEMO / SYNTHETIC DATA** based on published Lancet / Indian epidemiological literature, because real-time hospital heat admission feeds are not yet published as open APIs in India."

### Q3: "Can municipal corporations actually use this today?"
> **Answer**: "Yes. In the Pune PMC and Delhi MCD views, municipal commissioners get ward-by-ward priority lists for deploying water tankers and mobile misting shelters. Labor commissioners get enforceable work-rest schedules mapped to OSHA/ISO standards. It bridges the gap between scientific meteorology and on-the-ground disaster action."

### Q4: "What is your deployment and offline capability?"
> **Answer**: "The entire biometeorological engine and ML inference models run in client-side TypeScript and lightweight Node microservices. If internet connectivity drops during an extreme weather emergency, the application functions 100% offline from cached grid forecasts."

---

## 4. Evaluator Cheat Sheet (Metrics at a Glance)

| Metric | Scientific Basis | Normal Range | Dangerous Range | Extreme Danger |
|--------|------------------|--------------|-----------------|----------------|
| **HTSS** | 5-Index Ensemble + Safeguard | 0–40 | 60–79 | 80–100 |
| **WBGT** | Australian BoM & ISO 7243 | < 25°C | 28°C – 32°C | > 32.2°C |
| **UTCI** | Bröde et al. 2012 Multi-Node | 9°C – 26°C | 32°C – 38°C | > 46°C |
| **Wet Bulb** | Stull 2011 Equation | < 24°C | 28°C – 31°C | > 31°C (Survivability limit: 35°C) |
| **PVS** | Census 2011 / NFHS-5 Matrix | 0–30 | 50–70 | 75–100 |
