import test from 'node:test';
import assert from 'node:assert/strict';

import { runWhatIfSimulation } from '../lib/simulation-engine';
import { optimizeCoolingCenters } from '../lib/cooling-optimizer';
import { assessHospitalReadiness } from '../lib/hospital-readiness';
import { evaluateWorkerSafety } from '../lib/worker-safety';
import { buildHeatRiskCascade } from '../lib/cascade-engine';
import { buildHeatRiskDigitalTwin } from '../lib/digital-twin';
import { compareCurrentAgainstHistorical } from '../lib/history-memory';
import { calculateThermalMetrics } from '../lib/thermal-engine';
import { queryHeatAssistant } from '../lib/assistant-engine';
import { generateThermalStressActionPlan } from '../lib/action-engine';

test('What-If simulation calculates accurate deltas and alert escalation', () => {
  const sim = runWhatIfSimulation({
    baseline_temp_c: 40,
    baseline_humidity_pct: 45,
    baseline_wind_kmh: 12,
    baseline_solar_wm2: 600,
    baseline_pvs_score: 60,
    total_population: 100000,
    delta_temp_c: 3.0,
    delta_humidity_pct: 10,
    delta_wind_kmh: -4,
    delta_solar_wm2: 150,
    worker_exposure_multiplier: 1.2,
    vulnerability_shift_pct: 10,
  });

  assert.ok(sim.scenario.thermal.temperature_c === 43, 'Scenario temperature should be 43°C');
  assert.ok(sim.deltas.delta_htss > 0, 'HTSS delta must be strictly positive');
  assert.ok(sim.deltas.delta_affected_population > 0, 'Affected vulnerable population must increase');
  assert.ok(typeof sim.narrative_summary === 'string');
});

test('Cooling Center Optimizer ranks candidate sites by spatial deficit', () => {
  const result = optimizeCoolingCenters('Pune', 82);
  assert.ok(result.existing_centers.length > 0, 'Must return active Pune cooling centers');
  assert.ok(result.ranked_recommendations.length > 0, 'Must produce candidate recommendations');
  assert.ok(result.top_recommendation.optimization_score > 0, 'Top recommendation must have positive optimization score');
  assert.strictEqual(result.top_recommendation.recommendation_rank, 1, 'Top recommendation rank must be 1');
});

test('Hospital Readiness Engine correctly escalates under high thermal stress', () => {
  const assessment = assessHospitalReadiness('Delhi', 88, 92);
  assert.strictEqual(assessment.readiness_level, 'CRITICAL', '88+ HTSS must trigger CRITICAL hospital readiness');
  assert.ok(assessment.surge_factor_index > 2.5, 'Surge factor should be elevated (>2.5x)');
  assert.ok(assessment.recommended_hospital_actions.length >= 4, 'Must provide emergency clinical actions');
});

test('Outdoor worker evaluation enforces rest intervals based on WBGT', () => {
  const extremeThermal = calculateThermalMetrics(44, 55, 8, 800);
  const guidance = evaluateWorkerSafety('Construction Worker', extremeThermal);

  assert.ok(
    guidance.occupational_risk_level === 'Critical' || guidance.occupational_risk_level === 'Very High',
    'Heavy construction in 44°C + 55% RH must be Critical or Very High risk'
  );
  assert.ok(guidance.max_continuous_exposure_minutes <= 30, 'Continuous work must be restricted to <= 30 mins');
  assert.ok(guidance.hydration_requirement_liters_per_hour >= 1.0, 'Hydration requirement must be >= 1.0 L/hr');
});

test('Heat risk cascade visual flow generates coherent multi-stage progression', () => {
  const thermal = calculateThermalMetrics(43, 62, 10, 700);
  const cascade = buildHeatRiskCascade('Pune Ward 14', thermal);

  assert.strictEqual(cascade.stages.length, 6, 'Must generate exactly 6 cascade stages');
  assert.strictEqual(cascade.stages[0].stage_name, 'Meteorological Forcing');
  assert.strictEqual(cascade.stages[5].stage_name, 'Command Action Trigger');
  assert.ok(cascade.executive_takeaway.includes('CASCADE'), 'Executive takeaway should summarize the causal chain');
});

test('Digital Twin produces synchronized 5-day horizon trajectory', () => {
  const twin = buildHeatRiskDigitalTwin('Ahmedabad', 41.5, 40, 68);
  assert.strictEqual(twin.steps.length, 6, 'Must produce 6 horizon steps (Current to Day 5)');
  assert.strictEqual(twin.steps[0].horizon_label, 'CURRENT');
  assert.ok(twin.peak_htss >= twin.steps[0].htss_score, 'Peak HTSS must be >= current');
  assert.ok(typeof twin.evolution_summary === 'string');
});

test('Heatwave Memory compares current conditions with landmark 2024 heatwave', () => {
  const memory = compareCurrentAgainstHistorical('Delhi', 46.5, 91, 33.2, 5, 'HW-2024-NORTH');
  assert.ok(memory.comparison_table.length >= 4, 'Comparison table must have at least 4 key metrics');
  assert.ok(memory.historical_severity_percentile > 80, '46.5°C in Delhi should rank in high historical percentile');
});

test('Grounded AI Assistant provides structured, domain-informed responses', () => {
  const thermal = calculateThermalMetrics(42, 50, 12, 650);
  const context = {
    current_city: 'Pune',
    current_ward: 'Ward 12 - Shivajinagar',
    thermal,
    pvs_score: 72.4,
    health_risk_score: 78.5,
    alert_level: 'Extreme',
    language: 'en' as const,
  };

  const response = queryHeatAssistant('Why is Pune at high risk?', context);
  assert.ok(response.answer.includes('HTSS'), 'Response must explain risk using HTSS');
  assert.ok(response.answer.includes('WBGT'), 'Response must reference WBGT');
  assert.ok(response.structured_data_points, 'Must return structured data points');
});

test('Thermal stress action plan synthesizes workers, people, environmental and civic conditions', () => {
  // Extreme heatwave condition with high solar and WBGT
  const extremePlan = generateThermalStressActionPlan({
    temp: 43.5,
    humidity: 55,
    wbgt: 33.5,
    solar: 780,
    wind: 6,
    district: 'Delhi',
    ward_name: 'Ward 08 - Karol Bagh',
    population_density: 18000,
    informal_settlement_pct: 35,
    elderly_pct: 14,
  });

  assert.strictEqual(extremePlan.urgency, 'Emergency Immediate', 'Critical thermal profile must trigger Emergency Immediate urgency');
  assert.ok(extremePlan.headline.length > 0, 'Headline must be populated');
  assert.ok(extremePlan.summary.length > 0, 'Multi-condition summary must be populated');

  // Verify Worker directives
  assert.ok(extremePlan.workers.directive.includes('ISO 7243') || extremePlan.workers.directive.includes('suspension') || extremePlan.workers.directive.includes('rest'), 'Worker directive must mandate occupational rest or stoppage');
  assert.ok(extremePlan.workers.key_metrics.includes('Liters/hour') || extremePlan.workers.key_metrics.includes('Quota:'), 'Worker key metrics must specify hydration quota');
  assert.ok(extremePlan.workers.badge.length > 0, 'Worker badge must be populated');

  // Verify People (Vulnerable Cohorts) directives
  assert.ok(extremePlan.people.directive.includes('Senior') || extremePlan.people.directive.includes('elderly') || extremePlan.people.directive.includes('ASHA'), 'People directive must address senior/vulnerable cohorts');
  assert.ok(extremePlan.people.directive.includes('Tin-roof') || extremePlan.people.key_metrics.includes('Elderly:'), 'Tin-roof settlement or elderly metrics must be provided');
  assert.ok(extremePlan.people.badge.length > 0, 'People badge must be populated');

  // Verify Environmental directives
  assert.ok(extremePlan.environmental.directive.length > 0, 'Environmental directive must exist');
  assert.ok(extremePlan.environmental.key_metrics.includes('°C') && extremePlan.environmental.key_metrics.includes('WBGT'), 'Environmental key metrics must include temperature and WBGT');
  assert.ok(extremePlan.environmental.badge.length > 0, 'Environmental badge must be populated');

  // Verify Infrastructure & Civic Logistics
  assert.ok(extremePlan.infrastructure.directive.includes('saline') || extremePlan.infrastructure.directive.includes('water tankers'), 'Hospital cooling preparedness or water tankers must be present');
  assert.ok(extremePlan.infrastructure.badge.length > 0, 'Civic infrastructure badge must be populated');

  // Verify Action checklist and condition triggers
  assert.ok(extremePlan.checklist.length >= 4, 'Must produce at least 4 prioritized checklist action items');
  assert.ok(extremePlan.condition_triggers.length >= 3, 'Must record multiple active condition triggers');
});

