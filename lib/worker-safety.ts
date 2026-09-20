/**
 * SIH26083 - Unique Feature 8: Dedicated Outdoor Worker Occupational Safety Engine
 *
 * Provides occupational biometeorological work-rest regimens, hydration quotas,
 * and hazardous window cutoffs tailored to specific manual labor professions.
 *
 * Reference: ISO 7243 (WBGT screening), NIOSH Heat Stress Criteria, ACGIH TLVs.
 * Disclaimer: Occupational safety advisory for disaster preparedness, not individual medical advice.
 */

import { ThermalMetrics } from './thermal-engine';

export type WorkerCategory =
  | 'Construction Worker'
  | 'Street Vendor'
  | 'Traffic Police'
  | 'Delivery Executive'
  | 'Agricultural Worker'
  | 'General Outdoor Worker';

export type WorkerSafetyProfile = {
  category: WorkerCategory;
  metabolic_workload: 'Light' | 'Moderate' | 'Heavy' | 'Very Heavy';
  estimated_watts: number; // e.g., 200W (vendor) to 450W (construction digging)
  solar_radiation_exposure: 'High (Direct Sun)' | 'Moderate (Intermittent Shade)' | 'High Reflective (Asphalt/Road)';
  protective_clothing_factor: string;
};

export const WORKER_PROFILES: Record<WorkerCategory, WorkerSafetyProfile> = {
  'Construction Worker': {
    category: 'Construction Worker',
    metabolic_workload: 'Very Heavy',
    estimated_watts: 430,
    solar_radiation_exposure: 'High (Direct Sun)',
    protective_clothing_factor: 'Hardhat, heavy work boots, reflective vest (+2°C WBGT penalty)',
  },
  'Street Vendor': {
    category: 'Street Vendor',
    metabolic_workload: 'Moderate',
    estimated_watts: 220,
    solar_radiation_exposure: 'High (Direct Sun)',
    protective_clothing_factor: 'Cotton garments, prolonged standing on radiating pavement',
  },
  'Traffic Police': {
    category: 'Traffic Police',
    metabolic_workload: 'Moderate',
    estimated_watts: 260,
    solar_radiation_exposure: 'High Reflective (Asphalt/Road)',
    protective_clothing_factor: 'Uniform with synthetic blend, cap, traffic junction asphalt radiant heat',
  },
  'Delivery Executive': {
    category: 'Delivery Executive',
    metabolic_workload: 'Heavy',
    estimated_watts: 340,
    solar_radiation_exposure: 'High Reflective (Asphalt/Road)',
    protective_clothing_factor: 'Helmets, safety jacket, repetitive stair climbs and engine heat',
  },
  'Agricultural Worker': {
    category: 'Agricultural Worker',
    metabolic_workload: 'Heavy',
    estimated_watts: 380,
    solar_radiation_exposure: 'High (Direct Sun)',
    protective_clothing_factor: 'Field clothing, high humidity microclimate in irrigated crop canopies',
  },
  'General Outdoor Worker': {
    category: 'General Outdoor Worker',
    metabolic_workload: 'Moderate',
    estimated_watts: 280,
    solar_radiation_exposure: 'High (Direct Sun)',
    protective_clothing_factor: 'Standard outdoor attire',
  },
};

export type WorkerSafetyGuidance = {
  worker_type: WorkerCategory;
  current_wbgt: number;
  current_heat_index: number;
  current_htss: number;
  occupational_risk_level: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical';
  occupational_risk_color: 'green' | 'yellow' | 'orange' | 'red';
  safe_working_window: string;
  mandatory_rest_interval: string; // e.g. "45 min work / 15 min shade"
  hydration_requirement_liters_per_hour: number;
  peak_risk_hours: string;
  max_continuous_exposure_minutes: number;
  protective_measures: string[];
  warning_signs_to_halt_work: string[];
};

export function evaluateWorkerSafety(
  workerType: WorkerCategory,
  thermal: ThermalMetrics
): WorkerSafetyGuidance {
  const profile = WORKER_PROFILES[workerType];
  const wbgt = thermal.wbgt_c;
  const watts = profile.estimated_watts;

  // Metabolic workload lowers threshold for heat strain
  const workloadThresholdPenalty = watts > 400 ? 2.5 : watts > 300 ? 1.5 : 0;
  const effectiveWbgt = wbgt + workloadThresholdPenalty;

  let occupational_risk_level: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical' = 'Low';
  let occupational_risk_color: 'green' | 'yellow' | 'orange' | 'red' = 'green';
  let restInterval = 'Continuous work permitted with routine water breaks';
  let maxContinuousMinutes = 120;
  let hydrationLiters = 0.5;

  if (effectiveWbgt >= 32.5) {
    occupational_risk_level = 'Critical';
    occupational_risk_color = 'red';
    restInterval = 'STOP WORK: Mandatory suspension of strenuous outdoor labor. 15 min work / 45 min deep shade only for essential tasks.';
    maxContinuousMinutes = 15;
    hydrationLiters = 1.2;
  } else if (effectiveWbgt >= 31.0) {
    occupational_risk_level = 'Very High';
    occupational_risk_color = 'red';
    restInterval = '20 minutes work / 40 minutes rest in shaded, ventilated area';
    maxContinuousMinutes = 30;
    hydrationLiters = 1.0;
  } else if (effectiveWbgt >= 29.5) {
    occupational_risk_level = 'High';
    occupational_risk_color = 'orange';
    restInterval = '30 minutes work / 30 minutes rest in shade';
    maxContinuousMinutes = 45;
    hydrationLiters = 0.8;
  } else if (effectiveWbgt >= 27.5) {
    occupational_risk_level = 'Moderate';
    occupational_risk_color = 'yellow';
    restInterval = '45 minutes work / 15 minutes rest in shade';
    maxContinuousMinutes = 60;
    hydrationLiters = 0.7;
  }

  const safeWorkingWindow =
    occupational_risk_level === 'Critical'
      ? '05:30 AM – 10:30 AM and 05:30 PM – 07:30 PM (Midday shift strictly prohibited)'
      : occupational_risk_level === 'Very High'
      ? '06:00 AM – 11:30 AM and 04:30 PM – 07:00 PM'
      : occupational_risk_level === 'High'
      ? '06:30 AM – 12:30 PM and 04:00 PM – 06:30 PM'
      : 'Standard daytime schedule with shade breaks during peak solar noon';

  const protectiveMeasures: string[] = [
    `Consume ${hydrationLiters}L of cool water or electrolyte/ORS solution every hour (small amounts every 15 mins).`,
    'Wear light-colored, loose-fitting cotton clothing; utilize neck flaps and broad-brimmed head coverings.',
    'Work in buddy pairs to observe each other for signs of cognitive confusion or slurred speech.',
    'Utilize mobile shade tarps and battery misting fans at the active work zone.',
  ];

  if (workerType === 'Construction Worker') {
    protectiveMeasures.push('Reschedule concrete pouring and rebar tying to night or early morning hours.');
  } else if (workerType === 'Traffic Police') {
    protectiveMeasures.push('Rotate traffic junction assignments every 45 minutes to air-conditioned booths or tree-shaded kiosks.');
  } else if (workerType === 'Street Vendor') {
    protectiveMeasures.push('Deploy reflective insulating awnings over carts and keep wet jute bags over produce/drinks.');
  }

  const warningSigns = [
    'Throbbing headache, sudden dizziness, or loss of balance',
    'Heavy sweating that suddenly stops despite feeling intensely hot',
    'Nausea, muscle cramping, or rapid shallow breathing',
    'Confusion, disorientation, or collapse (Requires IMMEDIATE 108 emergency transport & cold immersion)',
  ];

  return {
    worker_type: workerType,
    current_wbgt: thermal.wbgt_c,
    current_heat_index: thermal.heat_index_c,
    current_htss: thermal.htss_score,
    occupational_risk_level,
    occupational_risk_color,
    safe_working_window: safeWorkingWindow,
    mandatory_rest_interval: restInterval,
    hydration_requirement_liters_per_hour: hydrationLiters,
    peak_risk_hours: '11:30 AM to 04:30 PM',
    max_continuous_exposure_minutes: maxContinuousMinutes,
    protective_measures: protectiveMeasures,
    warning_signs_to_halt_work: warningSigns,
  };
}
