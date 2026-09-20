/**
 * SIH26083 - Unique Feature 2: What-If Heat Scenario Simulator Engine
 *
 * Evaluates physiological and public health impacts of microclimatic shifts
 * and intervention policies in real time without server latency.
 */

import {
  calculateThermalMetrics,
  ThermalMetrics,
} from './thermal-engine';
import {
  calculateHumanHeatRisk,
  calculatePopulationVulnerabilityScore,
} from './vulnerability-engine';

export type SimulationInput = {
  baseline_temp_c: number;
  baseline_humidity_pct: number;
  baseline_wind_kmh: number;
  baseline_solar_wm2: number;
  baseline_pvs_score: number;
  total_population: number;
  // What-If Scenario Deltas
  delta_temp_c: number;          // e.g. +1, +2, +3, +5°C
  delta_humidity_pct: number;    // e.g. -15% or +20%
  delta_wind_kmh: number;        // e.g. -5 km/h
  delta_solar_wm2: number;       // e.g. +200 W/m² (intense midday sun)
  worker_exposure_multiplier: number; // e.g. 1.0 = normal, 1.5 = unshaded construction
  vulnerability_shift_pct: number;    // e.g. +10% elderly/slum, -15% cool roof intervention
};

export type SimulationResult = {
  baseline: {
    thermal: ThermalMetrics;
    risk_score: number;
    risk_category: 'Normal' | 'Watch' | 'Warning' | 'Extreme';
    alert_color: 'green' | 'yellow' | 'orange' | 'red';
    affected_population: number;
  };
  scenario: {
    thermal: ThermalMetrics;
    risk_score: number;
    risk_category: 'Normal' | 'Watch' | 'Warning' | 'Extreme';
    alert_color: 'green' | 'yellow' | 'orange' | 'red';
    affected_population: number;
  };
  deltas: {
    delta_temp: number;
    delta_heat_index: number;
    delta_wbgt: number;
    delta_utci: number;
    delta_htss: number;
    delta_risk_score: number;
    delta_affected_population: number;
    alert_escalated: boolean;
  };
  narrative_summary: string;
  recommended_policy_action: string;
};

export function runWhatIfSimulation(input: SimulationInput): SimulationResult {
  // 1. Calculate Baseline
  const baseThermal = calculateThermalMetrics(
    input.baseline_temp_c,
    input.baseline_humidity_pct,
    input.baseline_wind_kmh,
    input.baseline_solar_wm2
  );
  const baseRisk = calculateHumanHeatRisk(
    baseThermal.htss_score,
    input.baseline_pvs_score,
    1.0
  );
  const baseAffectedPop = Math.round(
    input.total_population * (baseRisk.heat_risk_score / 100) * (input.baseline_pvs_score / 100)
  );

  // 2. Calculate Scenario
  const scenarioTemp = Math.max(10, Math.min(60, input.baseline_temp_c + input.delta_temp_c));
  const scenarioHumidity = Math.max(5, Math.min(100, input.baseline_humidity_pct + input.delta_humidity_pct));
  const scenarioWind = Math.max(0, input.baseline_wind_kmh + input.delta_wind_kmh);
  const scenarioSolar = Math.max(0, input.baseline_solar_wm2 + input.delta_solar_wm2);
  const scenarioPvs = Math.max(
    0,
    Math.min(100, input.baseline_pvs_score * (1 + input.vulnerability_shift_pct / 100))
  );

  const scenarioThermal = calculateThermalMetrics(
    scenarioTemp,
    scenarioHumidity,
    scenarioWind,
    scenarioSolar
  );
  const scenarioRisk = calculateHumanHeatRisk(
    scenarioThermal.htss_score,
    scenarioPvs,
    input.worker_exposure_multiplier
  );
  const scenarioAffectedPop = Math.round(
    input.total_population * (scenarioRisk.heat_risk_score / 100) * (scenarioPvs / 100)
  );

  // 3. Compute Deltas
  const delta_temp = Math.round((scenarioTemp - input.baseline_temp_c) * 10) / 10;
  const delta_heat_index = Math.round((scenarioThermal.heat_index_c - baseThermal.heat_index_c) * 10) / 10;
  const delta_wbgt = Math.round((scenarioThermal.wbgt_c - baseThermal.wbgt_c) * 10) / 10;
  const delta_utci = Math.round((scenarioThermal.utci_c - baseThermal.utci_c) * 10) / 10;
  const delta_htss = Math.round((scenarioThermal.htss_score - baseThermal.htss_score) * 10) / 10;
  const delta_risk_score = Math.round((scenarioRisk.heat_risk_score - baseRisk.heat_risk_score) * 10) / 10;
  const delta_affected_population = scenarioAffectedPop - baseAffectedPop;

  const severityRank = { Normal: 0, Watch: 1, Warning: 2, Extreme: 3 };
  const alert_escalated = severityRank[scenarioRisk.risk_category] > severityRank[baseRisk.risk_category];

  // 4. Generate Explainable Narrative
  let narrative_summary = '';
  if (delta_temp === 0 && delta_heat_index === 0) {
    narrative_summary = 'Simulation matches current baseline conditions.';
  } else if (alert_escalated) {
    narrative_summary = `Escalation detected: A ${delta_temp >= 0 ? '+' : ''}${delta_temp}°C temperature change combined with ${scenarioHumidity}% relative humidity elevates WBGT to ${scenarioThermal.wbgt_c}°C (${scenarioThermal.wbgt_category}) and HTSS by +${delta_htss} points, triggering an alert escalation from ${baseRisk.risk_category} to ${scenarioRisk.risk_category}.`;
  } else if (delta_risk_score > 0) {
    narrative_summary = `Moderate risk increase: Thermal stress index (HTSS) rises by +${delta_htss} points (+${delta_affected_population.toLocaleString()} vulnerable residents at risk), maintaining the ${scenarioRisk.risk_category} advisory level.`;
  } else {
    narrative_summary = `Mitigation effect: Cooler ambient temperatures or intervention measures lower HTSS by ${Math.abs(delta_htss)} points, reducing exposed population by ${Math.abs(delta_affected_population).toLocaleString()}.`;
  }

  // 5. Recommended Policy Action
  let recommended_policy_action = 'Maintain standard monitoring and hydration advisories.';
  if (scenarioRisk.risk_category === 'Extreme') {
    recommended_policy_action = 'Activate Emergency Heat Action Plan (HAP): Halt all unshaded outdoor labor between 11:30 AM and 4:30 PM, mobilize water tankers to informal settlements, and open municipal cooling centers.';
  } else if (scenarioRisk.risk_category === 'Warning') {
    recommended_policy_action = 'Issue District Warning: Enforce 20-minute rest breaks every hour for outdoor workers, place emergency hospitals on surge alert, and initiate SMS alerts.';
  } else if (scenarioRisk.risk_category === 'Watch') {
    recommended_policy_action = 'Issue Public Watch: Disseminate hydration guidance across media channels and inspect cooling shelters.';
  }

  return {
    baseline: {
      thermal: baseThermal,
      risk_score: baseRisk.heat_risk_score,
      risk_category: baseRisk.risk_category,
      alert_color: baseRisk.alert_color,
      affected_population: baseAffectedPop,
    },
    scenario: {
      thermal: scenarioThermal,
      risk_score: scenarioRisk.heat_risk_score,
      risk_category: scenarioRisk.risk_category,
      alert_color: scenarioRisk.alert_color,
      affected_population: scenarioAffectedPop,
    },
    deltas: {
      delta_temp,
      delta_heat_index,
      delta_wbgt,
      delta_utci,
      delta_htss,
      delta_risk_score,
      delta_affected_population,
      alert_escalated,
    },
    narrative_summary,
    recommended_policy_action,
  };
}
