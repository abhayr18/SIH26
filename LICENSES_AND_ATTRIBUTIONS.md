# Licenses and Attributions — SIH26083 Platform

## Project Overview
This repository represents the Smart India Hackathon 2026 solution for problem **SIH26083**: *"Extreme Heatwave Early Warning and Human Thermal Stress Index"*, submitted under the Ministry of Earth Sciences (MoES) and National Centre for Medium Range Weather Forecasting (NCMRWF).

---

## 1. Primary Codebase License
The core engineering implementation, biometeorological algorithms, ML inference pipelines, and UI components developed for SIH26083 are released under the **MIT License**.

```
MIT License

Copyright (c) 2026 Team SIH26083 Innovators

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 2. Attributions to Prior Art & Reference Repositories

During the rapid engineering and architectural analysis phase, reference implementations from the following open-source hackathon efforts were evaluated and benchmarked:

### Team THERMOSAFE / THERMOS
- **Repository**: [THERMOS](https://github.com/Team-THERMOSAFE/THERMOS)
- **Contribution Acknowledged**: Conceptual foundations for multi-index heatwave triage and Python biometeorology routines.
- **License**: MIT License (or open hackathon submission).

### ThermoWatch SIH26083
- **Repository**: [thermowatch-sih26083](https://github.com/dheerajchand/thermowatch-sih26083)
- **Contribution Acknowledged**: Hyperlocal ward structure concepts and district-level geo-spatial mappings.
- **License**: Apache 2.0 / MIT License.

---

## 3. Meteorological & Climate Data Providers

### Open-Meteo Weather API
- **Website**: [https://open-meteo.com/](https://open-meteo.com/)
- **Terms**: Open-Meteo is licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.
- **Attribution**: "Weather forecast data provided by Open-Meteo.com under CC BY 4.0, integrating national weather services including DWD, NOAA, and ECMWF."

### National Centre for Medium Range Weather Forecasting (NCMRWF) & IMD
- **Organizations**: Ministry of Earth Sciences (MoES), Government of India.
- **Data Framework**: High-resolution Regional Unified Model (NCUM) and IMDAA Regional Reanalysis methodologies referenced for thermal calibration.

### European Centre for Medium-Range Weather Forecasts (ECMWF)
- **Dataset**: ERA5 Atmospheric Reanalysis.
- **Attribution**: "Contains modified Copernicus Climate Change Service information (2024–2026). Neither the European Commission nor ECMWF is responsible for any use that may be made of the information."

---

## 4. Scientific Algorithms & Academic Literature

The biometeorological algorithms implemented in [thermal-engine.ts](file:///d:/SIH/lib/thermal-engine.ts) are based on peer-reviewed scientific literature:

1. **National Weather Service Heat Index**:
   - Rothfusz, L. P. (1990). *The analysis and forecast of extreme heat conditions*. NWS Technical Attachment SR 90-23, Fort Worth, Texas.
2. **Wet Bulb Globe Temperature (WBGT)**:
   - Australian Bureau of Meteorology (BoM) simplified formulation; ISO 7243:2017 (*Ergonomics of the thermal environment — Assessment of heat stress using the WBGT index*).
3. **Universal Thermal Climate Index (UTCI)**:
   - Bröde, P., Fiala, D., Błażejczyk, K., et al. (2012). *Deriving the operational procedure for the Universal Thermal Climate Index (UTCI)*. International Journal of Biometeorology, 56(3), 481-494.
4. **Wet Bulb Temperature (Stull's Empirical Equation)**:
   - Stull, R. (2011). *Wet-Bulb Temperature from Relative Humidity and Air Temperature*. Journal of Applied Meteorology and Climatology, 50(11), 2267-2269.
5. **Physiological Equivalent Temperature (PET)**:
   - Höppe, P. (1999). *The physiological equivalent temperature - a universal index for the biometeorological assessment of the thermal environment*. International Journal of Biometeorology, 43(2), 71-75.

---

## 5. Demographic & Spatial Data

1. **Office of the Registrar General & Census Commissioner, India**:
   - Census of India 2011 (Demographics, household construction material, slum population).
2. **Ministry of Health and Family Welfare (MoHFW), Government of India**:
   - National Family Health Survey (NFHS-5, 2019-2021) for elderly ratios and baseline comorbidities.
3. **OpenStreetMap & Natural Earth**:
   - GeoJSON district and ward boundaries under Open Database License (ODbL).

---

## 6. Open-Source Libraries & Dependencies

- **Next.js & React**: MIT License (Vercel Inc. / Meta Platforms, Inc.)
- **Tailwind CSS**: MIT License (Tailwind Labs, Inc.)
- **Lucide Icons**: ISC License (Lucide Contributors)
- **Radix UI**: MIT License (WorkOS)
- **Leaflet & React-Leaflet**: BSD 2-Clause License
