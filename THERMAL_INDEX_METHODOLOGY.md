# SIH26083 — Thermal Index Methodology & Biometeorological Formulations

**Platform:** SIH26083 Extreme Heatwave Intelligence Command Center  
**Target Organization:** Ministry of Earth Sciences (MoES) / NCMRWF  
**Authoritative Context:** Clear distinction between established international scientific indices and our prototype composite scoring methodology.

---

## 1. Established International Biometeorological Indices

### A. NOAA / NWS Rothfusz Polynomial Heat Index
- **Reference**: Rothfusz, L. P. (1990). *The computation and use of the Heat Index*. NOAA Technical Attachment SR/SSD 90-23.
- **Formulation**:
  For $HI \ge 80^\circ F$:
  $$HI = -42.379 + 2.04901523 T + 10.14333127 RH - 0.22475541 T \cdot RH - 0.00683783 T^2 - 0.05481717 RH^2 + 0.00122874 T^2 \cdot RH + 0.00085282 T \cdot RH^2 - 0.00000199 T^2 \cdot RH^2$$
- **Boundary Adjustments**:
  - **Dry Adjustment** ($RH < 13\%$ and $80 \le T \le 112^\circ F$):
    $$adj = \frac{13 - RH}{4} \sqrt{\frac{17 - |T - 95|}{17}}, \quad HI \leftarrow HI - adj$$
  - **Humid Adjustment** ($RH > 85\%$ and $80 \le T \le 87^\circ F$):
    $$adj = \frac{RH - 85}{10} \times \frac{87 - T}{5}, \quad HI \leftarrow HI + adj$$
- **Categories**:
  - $< 27^\circ C$: Safe
  - $27 - 32^\circ C$: Caution
  - $32 - 41^\circ C$: Extreme Caution
  - $41 - 54^\circ C$: Danger
  - $\ge 54^\circ C$: Extreme Danger

---

### B. Australian Bureau of Meteorology (BoM) Simplified Outdoor WBGT
- **Reference**: Australian Bureau of Meteorology Thermal Comfort Services; ISO 7243.
- **Formulation**:
  First, calculate water vapor pressure $e$ (hPa) via the Magnus-Tetens empirical equation:
  $$e = \left(\frac{RH}{100}\right) \times 6.105 \times \exp\left(\frac{17.27 \times T}{237.7 + T}\right)$$
  Then, compute simplified outdoor Wet Bulb Globe Temperature ($sWBGT$):
  $$sWBGT = 0.567 \times T + 0.393 \times e + 3.94$$
  If direct solar radiation $sr > 100 \text{ W/m}^2$, apply the radiative solar adjustment:
  $$sWBGT \leftarrow sWBGT + (sr \times 0.01)$$
- **Categories**:
  - $< 27.7^\circ C$: Low
  - $27.7 - 29.4^\circ C$: Moderate
  - $29.4 - 31.0^\circ C$: High
  - $31.0 - 32.2^\circ C$: Very High
  - $\ge 32.2^\circ C$: Extreme (Mandatory work stoppage for unconditioned manual labor)

---

### C. Bröde et al. (2012) Universal Thermal Climate Index (UTCI) Regression
- **Reference**: Bröde, P., et al. (2012). *Deriving the operational procedure for the Universal Thermal Climate Index (UTCI)*. Int J Biometeorol 56, 481–494.
- **Formulation**:
  Combines ambient dry-bulb temperature ($T$), mean radiant temperature ($T_{mrt}$), wind velocity at 10m ($v_{ms}$), and relative humidity ($RH$):
  $$v_{ms} = wind_{kmh} \times 0.27778$$
  $$T_{mrt} = sr > 0 ? \left(T + 0.08 \cdot sr - 1.2 \sqrt{\max(0.1, v_{ms})}\right) : T$$
  $$dt = T_{mrt} - T$$
  $$UTCI = T + 0.2 \cdot dt - 0.1 \cdot v_{ms} + 0.05 \cdot RH$$
- **Categories**:
  - $< 9^\circ C$: Cold Stress
  - $9 - 26^\circ C$: No Thermal Stress
  - $26 - 32^\circ C$: Moderate Heat Stress
  - $32 - 38^\circ C$: Strong Heat Stress
  - $38 - 46^\circ C$: Very Strong Heat Stress
  - $> 46^\circ C$: Extreme Heat Stress

---

## 2. Prototype Scoring Methodology: Human Thermal Stress Score (HTSS)

> [!IMPORTANT]
> **Scientific Transparency**: The **Human Thermal Stress Score (HTSS)** is our team's synthesized prototype decision-support metric designed for municipal authorities. It is **NOT** an established international standard like WBGT or UTCI, but a synthesized 0–100 index unifying multiple environmental indicators into an intuitive, actionable operational score.

### HTSS Normalization & Weighting:
1. **Sub-Index Normalization**:
   $$n_{HI} = \min\left(100, \max\left(0, (HI - 25) \times 3\right)\right)$$
   $$n_{WBGT} = \min\left(100, \max\left(0, (WBGT - 20) \times 4\right)\right)$$
   $$n_{UTCI} = \min\left(100, \max\left(0, (UTCI - 20) \times 2.5\right)\right)$$

2. **Weight Allocation** (Reflecting biometeorological physiological strain):
   - $w_{UTCI} = 0.40$ (Overall whole-body energy budget)
   - $w_{WBGT} = 0.35$ (Occupational evaporative limit)
   - $w_{HI} = 0.25$ (Public health perception)

3. **Weighted Sum**:
   $$\text{weighted} = n_{UTCI} \cdot w_{UTCI} + n_{WBGT} \cdot w_{WBGT} + n_{HI} \cdot w_{HI}$$

4. **Non-Compensatory Safeguard**:
   To prevent a fatal spike in one specific thermal indicator (e.g., a deadly 34°C wet bulb event) from being mathematically diluted by milder values in other indices:
   $$HTSS = \max\left(\text{weighted}, 0.85 \times \max(n_{HI}, n_{WBGT}, n_{UTCI})\right)$$

5. **Operational Tiers (0–100 Scale)**:
   - **0 – 20**: Low (Routine monitoring)
   - **21 – 40**: Moderate (Public hydration advisories)
   - **41 – 60**: High (Shift outdoor worker shifts, prepare cooling beds)
   - **61 – 80**: Very High (Open municipal cooling centers, stage water tankers)
   - **81 – 100**: Extreme (Emergency Heat Action Plan activation, halt unshaded labor)
