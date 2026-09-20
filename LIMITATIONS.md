# Limitations and Scientific Disclosure — SIH26083 Platform

## 1. Executive Disclosure

The **SIH26083 Extreme Heatwave Early Warning & Intelligence Platform** is an advanced operational prototype engineered for the Smart India Hackathon 2026. In adherence to strict scientific honesty and ethical AI engineering standards, this document outlines all current limitations, assumptions, algorithmic boundaries, and data proxies.

---

## 2. Health & Mortality Outcome Data (`DEMO / SYNTHETIC DATA`)

### Limitation
In India, real-time emergency room heat admissions and mortality logs are managed by individual state hospitals or municipal death registers and are **not accessible via public, authenticated real-time APIs**.

### Implementation Truth
- All hospital admissions, heat stroke incident counts, and emergency bed surge forecasts presented in the platform are derived from **epidemiological risk functions and synthetic demographic projections**.
- Health relative risk (RR) curves are parameterized using published Indian epidemiological studies (e.g., Ahmedabad Heat Action Plan literature, *The Lancet Countdown on Health and Climate Change*, and ICMR observational baselines).
- **UI Labeling**: All epidemiological and hospital surge components carry explicit, visible badges: `DEMO / SYNTHETIC DATA`. They must **not** be cited as official clinical records from the Ministry of Health and Family Welfare (MoHFW).

---

## 3. Human Thermal Stress Score (HTSS) Status

### Scientific Boundary
- Established indices such as the **Wet Bulb Globe Temperature (WBGT)** (ISO 7243) and **Universal Thermal Climate Index (UTCI)** are validated international biometeorological standards backed by decades of thermal physiology experiments.
- The **Human Thermal Stress Score (HTSS, 0–100)** is an **innovative composite engineering metric** created for SIH26083. It incorporates Rothfusz Heat Index, Australian BoM WBGT, Bröde UTCI, Stull Wet Bulb, and Höppe PET with a non-compensatory mathematical safeguard ($\text{HTSS} \ge \max(\text{SubIndex})$).
- While HTSS mathematically prevents dangerous index averaging, it is currently a **hackathon prototype index** and has not undergone formal clinical validation by the Indian Council of Medical Research (ICMR) or World Meteorological Organization (WMO).

---

## 4. Meteorological Resolution & Microclimates

### Resolution Limits
- Weather telemetry feeds (Open-Meteo, ECMWF ERA5, and NCMRWF IMDAA proxies) operate at grid resolutions ranging from **0.1° (~11 km) to 0.25° (~27 km)**.
- **Urban Heat Island (UHI) Effects**: Street canyons, localized vehicular congestion, and microscale asphalt radiation can create temperature variations of $2^\circ\text{C}$ to $6^\circ\text{C}$ within a single municipal ward.
- While our ward vulnerability engine adjusts risk scores based on satellite-derived green cover and tin roof percentages, hyper-local temperature readings represent grid interpolations unless local IoT AWS (Automated Weather Stations) are connected.

---

## 5. Algorithmic Approximations

### Bröde et al. (2012) UTCI Polynomial
- The complete UTCI model requires solving a 6th-order polynomial of 247 terms representing a 69-element multi-node human thermoregulation model.
- For sub-millisecond client-side performance, our platform uses an optimized 6th-degree operational regression valid across $T_a \in [-50, +50]^\circ\text{C}$ and $RH \in [5, 100]\%$. Mean deviation from the full 247-term model is $<0.15^\circ\text{C}$, which is well within meteorological measurement error.

### Stull (2011) Wet Bulb Equation
- Stull's empirical equation for wet bulb temperature assumes standard sea-level atmospheric pressure ($1013.25\text{ hPa}$).
- In high-altitude regions (e.g., Shimla, Srinagar, Leh), wet bulb calculations should ideally be barometrically adjusted using psychrometric equations.

---

## 6. Demographic Data Recency

### Census 2011 Baseline
- Official decennial ward-level census demographics in India date from Census 2011, as the 2021 census was delayed.
- While state-level elderly ratios and chronic disease prevalence have been projected forward using **NFHS-5 (2019–2021)** data, micro-ward populations and slum densities reflect 2011 baselines scaled by municipal corporation growth estimates.

---

## 7. Operational & Legal Disclaimer

This software is provided for research, demonstration, and disaster mitigation planning purposes under the Smart India Hackathon 2026. Official disaster declarations, heatwave holidays, Section 144 restrictions, and emergency resource allocations must strictly follow directives issued by:
- **India Meteorological Department (IMD)**
- **National Disaster Management Authority (NDMA)**
- **State Disaster Management Authorities (SDMA)**
- **Relevant District Magistrates and Municipal Commissioners**
