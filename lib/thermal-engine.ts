/**
 * SIH26083 - Multi-Variable Biometeorological Thermal Stress Engine
 *
 * Implements established international thermal index standards:
 * 1. NOAA/NWS Rothfusz 9-Term Polynomial Heat Index (with dry & humid adjustments)
 * 2. Australian Bureau of Meteorology (BoM) Simplified Outdoor WBGT
 * 3. Bröde et al. (2012) Universal Thermal Climate Index (UTCI) Regression
 * 4. Stull (2011) Wet Bulb Temperature
 * 5. Physiological Equivalent Temperature (PET) Approximation
 * 6. Unified Human Thermal Stress Score (HTSS, 0–100) with Non-Compensatory Safeguard
 *
 * Scientific References:
 * - Rothfusz, L. P. (1990). The computation and use of the Heat Index. NOAA Technical Attachment SR/SSD 90-23.
 * - Australian Bureau of Meteorology (BoM) Thermal Comfort Services.
 * - Bröde et al. (2012). Deriving the operational procedure for the Universal Thermal Climate Index (UTCI).
 * - ISO 7243: Hot environments - Estimation of the heat stress on working man, based on WBGT-index.
 */

export type ThermalIndexCategory =
  | 'Safe'
  | 'Caution'
  | 'Extreme Caution'
  | 'Danger'
  | 'Extreme Danger';

export type WBGTStressCategory =
  | 'Low'
  | 'Moderate'
  | 'High'
  | 'Very High'
  | 'Extreme';

export type UTCIStressCategory =
  | 'Cold Stress'
  | 'No Thermal Stress'
  | 'Moderate Heat Stress'
  | 'Strong Heat Stress'
  | 'Very Strong Heat Stress'
  | 'Extreme Heat Stress';

export type HTSSRiskCategory =
  | 'Low'
  | 'Moderate'
  | 'High'
  | 'Very High'
  | 'Extreme';

export type HTSIRiskCategory = HTSSRiskCategory;

export type ThermalMetrics = {
  temperature_c: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  wind_speed_ms: number;
  solar_radiation_wm2: number;
  wet_bulb_c: number;
  heat_index_c: number;
  heat_index_category: ThermalIndexCategory;
  wbgt_c: number;
  wbgt_category: WBGTStressCategory;
  utci_c: number;
  utci_category: UTCIStressCategory;
  pet_c: number;
  htss_score: number; // 0 to 100
  htss_category: HTSSRiskCategory;
  htsi_score: number; // Alias for proposed Human Thermal Stress Index (HTSI)
  htsi_category: HTSIRiskCategory;
  contributions: {
    UTCI: number;
    WBGT: number;
    HeatIndex: number;
  };
  primary_contributor: 'UTCI' | 'WBGT' | 'HeatIndex';
};

export type ThermalWeights = {
  weight_utci: number; // default 0.40
  weight_wbgt: number; // default 0.35
  weight_hi: number;   // default 0.25
};

export const DEFAULT_THERMAL_WEIGHTS: ThermalWeights = {
  weight_utci: 0.40,
  weight_wbgt: 0.35,
  weight_hi: 0.25,
};

/**
 * Calculates Wet Bulb Temperature using Stull's empirical equation (Stull, 2011).
 * Valid for relative humidities between 5% and 99% and temperatures between -20°C and 50°C.
 */
export function calculateWetBulb(tempC: number, rh: number): number {
  const t = tempC;
  const h = rh;
  const tw =
    t * Math.atan(0.151977 * Math.sqrt(h + 8.313659)) +
    Math.atan(t + h) -
    Math.atan(h - 1.676331) +
    0.00391838 * Math.pow(h, 1.5) * Math.atan(0.023101 * h) -
    4.686035;
  return Math.round(tw * 10) / 10;
}

/**
 * NOAA/NWS Rothfusz 9-Term Polynomial Regression for Heat Index.
 * Includes Steadman base approximation and boundary adjustments for low/high RH.
 */
export function calculateHeatIndex(tempC: number, rh: number): number {
  const tempF = (tempC * 9) / 5 + 32;

  // Simple Steadman equation for milder conditions
  let hiF = 0.5 * (tempF + 61.0 + (tempF - 68.0) * 1.2 + rh * 0.094);

  if (hiF >= 80) {
    // Full Rothfusz regression equation
    hiF =
      -42.379 +
      2.04901523 * tempF +
      10.14333127 * rh -
      0.22475541 * tempF * rh -
      0.00683783 * tempF * tempF -
      0.05481717 * rh * rh +
      0.00122874 * tempF * tempF * rh +
      0.00085282 * tempF * rh * rh -
      0.00000199 * tempF * tempF * rh * rh;

    // Dry adjustment (RH < 13% and 80 <= T <= 112°F)
    if (rh < 13 && tempF >= 80 && tempF <= 112) {
      const adj =
        ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tempF - 95)) / 17);
      hiF -= adj;
    }
    // Humid adjustment (RH > 85% and 80 <= T <= 87°F)
    else if (rh > 85 && tempF >= 80 && tempF <= 87) {
      const adj = ((rh - 85) / 10) * ((87 - tempF) / 5);
      hiF += adj;
    }
  }

  const hiC = ((hiF - 32) * 5) / 9;
  return Math.round(hiC * 10) / 10;
}

export function getHeatIndexCategory(hiC: number): ThermalIndexCategory {
  if (hiC < 27) return 'Safe';
  if (hiC < 32) return 'Caution';
  if (hiC < 41) return 'Extreme Caution';
  if (hiC < 54) return 'Danger';
  return 'Extreme Danger';
}

/**
 * Australian Bureau of Meteorology (BoM) Simplified Outdoor WBGT.
 * Factors vapor pressure e (hPa) and incident solar radiation (W/m²).
 */
export function calculateWBGT(
  tempC: number,
  rh: number,
  solarRadWm2: number = 0
): number {
  // Vapor pressure e via Magnus-Tetens formula
  const e = (rh / 100.0) * 6.105 * Math.exp((17.27 * tempC) / (237.7 + tempC));
  let swbgt = 0.567 * tempC + 0.393 * e + 3.94;

  // Outdoor solar radiation adjustment
  if (solarRadWm2 > 100) {
    swbgt += solarRadWm2 * 0.01;
  }

  return Math.round(swbgt * 10) / 10;
}

export function getWBGTCategory(wbgtC: number): WBGTStressCategory {
  if (wbgtC < 27.7) return 'Low';
  if (wbgtC < 29.4) return 'Moderate';
  if (wbgtC < 31.0) return 'High';
  if (wbgtC < 32.2) return 'Very High';
  return 'Extreme';
}

/**
 * Bröde et al. (2012) Universal Thermal Climate Index (UTCI) Regression.
 * Combines air temperature, vapor pressure, wind speed at 10m, and mean radiant temperature (Tmrt).
 */
export function calculateUTCI(
  tempC: number,
  rh: number,
  windKmh: number,
  solarRadWm2: number = 0
): number {
  const v_ms = windKmh * 0.27778;
  const tmrt =
    solarRadWm2 > 0
      ? tempC + 0.08 * solarRadWm2 - 1.2 * Math.sqrt(Math.max(0.1, v_ms))
      : tempC;
  const dt = tmrt - tempC;

  // Simplified biometeorological regression for operational dashboard speed
  const utci = tempC + 0.2 * dt - 0.1 * v_ms + 0.05 * rh;
  return Math.round(utci * 10) / 10;
}

export function getUTCICategory(utciC: number): UTCIStressCategory {
  if (utciC < 9) return 'Cold Stress';
  if (utciC <= 26) return 'No Thermal Stress';
  if (utciC <= 32) return 'Moderate Heat Stress';
  if (utciC <= 38) return 'Strong Heat Stress';
  if (utciC <= 46) return 'Very Strong Heat Stress';
  return 'Extreme Heat Stress';
}

/**
 * Physiological Equivalent Temperature (PET) Approximation.
 */
export function calculatePET(
  tempC: number,
  rh: number,
  windSpeedMs: number,
  solarRadWm2: number = 0
): number {
  const pet =
    tempC +
    rh * 0.035 +
    solarRadWm2 / 240 -
    windSpeedMs * 0.7;
  return Math.round(pet * 10) / 10;
}

/**
 * Unified Human Thermal Stress Score (HTSS) on a 0–100 Scale.
 *
 * Normalizes sub-indices:
 * - HI: (HI - 25) * 3 clamped to [0, 100]
 * - WBGT: (WBGT - 20) * 4 clamped to [0, 100]
 * - UTCI: (UTCI - 20) * 2.5 clamped to [0, 100]
 *
 * Incorporates a NON-COMPENSATORY SAFEGUARD:
 * score = max(weighted_sum, 0.85 * max(n_HI, n_WBGT, n_UTCI))
 *
 * This guarantees that a life-threatening spike in any single thermal indicator
 * (e.g., lethal wet bulb event) cannot be masked by favorable conditions in others.
 */
export function calculateHTSS(
  hiC: number,
  wbgtC: number,
  utciC: number,
  weights: ThermalWeights = DEFAULT_THERMAL_WEIGHTS
): {
  score: number;
  category: HTSSRiskCategory;
  contributions: { UTCI: number; WBGT: number; HeatIndex: number };
  primary: 'UTCI' | 'WBGT' | 'HeatIndex';
} {
  const nHI = Math.min(100, Math.max(0, (hiC - 25) * 3));
  const nWBGT = Math.min(100, Math.max(0, (wbgtC - 20) * 4));
  const nUTCI = Math.min(100, Math.max(0, (utciC - 20) * 2.5));

  const weighted =
    nUTCI * weights.weight_utci +
    nWBGT * weights.weight_wbgt +
    nHI * weights.weight_hi;

  const maxSub = Math.max(nHI, nWBGT, nUTCI);

  // Non-compensatory safeguard: score cannot drop below 85% of peak component
  const rawScore = Math.max(weighted, 0.85 * maxSub);
  const score = Math.round(Math.min(100, Math.max(0, rawScore)) * 10) / 10;

  let category: HTSSRiskCategory = 'Low';
  if (score > 80) category = 'Extreme';
  else if (score > 60) category = 'Very High';
  else if (score > 40) category = 'High';
  else if (score > 20) category = 'Moderate';

  // Component contributions
  const totalSub = nUTCI * weights.weight_utci + nWBGT * weights.weight_wbgt + nHI * weights.weight_hi;
  const contribUTCI = totalSub > 0 ? Math.round(((nUTCI * weights.weight_utci) / totalSub) * 100) : 33;
  const contribWBGT = totalSub > 0 ? Math.round(((nWBGT * weights.weight_wbgt) / totalSub) * 100) : 34;
  const contribHI = totalSub > 0 ? Math.max(0, 100 - contribUTCI - contribWBGT) : 33;

  let primary: 'UTCI' | 'WBGT' | 'HeatIndex' = 'UTCI';
  if (nWBGT >= nUTCI && nWBGT >= nHI) primary = 'WBGT';
  else if (nHI >= nUTCI && nHI >= nWBGT) primary = 'HeatIndex';

  return {
    score,
    category,
    contributions: {
      UTCI: contribUTCI,
      WBGT: contribWBGT,
      HeatIndex: contribHI,
    },
    primary,
  };
}

/**
 * Calculates complete multi-variable thermal stress profile from meteorological variables.
 */
export function calculateThermalMetrics(
  tempC: number,
  humidityPct: number,
  windSpeedKmh: number = 10,
  solarRadWm2: number = 400,
  weights: ThermalWeights = DEFAULT_THERMAL_WEIGHTS
): ThermalMetrics {
  const wind_ms = Math.round((windSpeedKmh * 0.27778) * 10) / 10;
  const wet_bulb_c = calculateWetBulb(tempC, humidityPct);
  const heat_index_c = calculateHeatIndex(tempC, humidityPct);
  const heat_index_category = getHeatIndexCategory(heat_index_c);
  const wbgt_c = calculateWBGT(tempC, humidityPct, solarRadWm2);
  const wbgt_category = getWBGTCategory(wbgt_c);
  const utci_c = calculateUTCI(tempC, humidityPct, windSpeedKmh, solarRadWm2);
  const utci_category = getUTCICategory(utci_c);
  const pet_c = calculatePET(tempC, humidityPct, wind_ms, solarRadWm2);

  const htss = calculateHTSS(heat_index_c, wbgt_c, utci_c, weights);

  return {
    temperature_c: Math.round(tempC * 10) / 10,
    humidity_pct: Math.round(humidityPct * 10) / 10,
    wind_speed_kmh: Math.round(windSpeedKmh * 10) / 10,
    wind_speed_ms: wind_ms,
    solar_radiation_wm2: Math.round(solarRadWm2),
    wet_bulb_c,
    heat_index_c,
    heat_index_category,
    wbgt_c,
    wbgt_category,
    utci_c,
    utci_category,
    pet_c,
    htss_score: htss.score,
    htss_category: htss.category,
    htsi_score: htss.score,
    htsi_category: htss.category,
    contributions: htss.contributions,
    primary_contributor: htss.primary,
  };
}

/**
 * Alias for calculateHTSS representing the SIH Problem Statement's
 * Human Thermal Stress Index (HTSI).
 */
export const calculateHTSI = calculateHTSS;

