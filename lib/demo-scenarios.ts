/**
 * SIH26083 - Unique Feature 11: Controlled Demo Scenario Engine
 *
 * Provides instant switchable scenario configurations for live hackathon evaluation.
 * Every dashboard metric, map color, alert banner, hospital load, and AI response
 * reacts synchronously to the selected scenario.
 */

export type DemoScenarioId =
  | 'normal-summer'
  | 'severe-heatwave'
  | 'extreme-heatwave'
  | 'high-humidity-coastal'
  | 'dry-extreme-heat'
  | 'rapid-escalation'
  | 'vulnerable-population-crisis';

export type DemoScenario = {
  id: DemoScenarioId;
  name: string;
  badge: string;
  badgeColor: 'green' | 'yellow' | 'orange' | 'red';
  description: string;
  target_city: string;
  target_ward: string;
  temp_c: number;
  humidity_pct: number;
  wind_kmh: number;
  solar_wm2: number;
  pvs_multiplier: number;
  worker_exposure_multiplier: number;
  expected_alert: 'Normal' | 'Watch' | 'Warning' | 'Extreme';
  expected_hospital_status: 'NORMAL' | 'PREPARE' | 'HIGH ALERT' | 'CRITICAL';
  key_evaluator_takeaway: string;
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'normal-summer',
    name: 'Normal Summer Day',
    badge: 'Baseline Low Risk',
    badgeColor: 'green',
    description: 'Typical seasonal summer condition in central India. Tolerable thermal load with standard precautions.',
    target_city: 'Pune',
    target_ward: 'Ward 08 - Kothrud',
    temp_c: 32.5,
    humidity_pct: 42,
    wind_kmh: 14,
    solar_wm2: 420,
    pvs_multiplier: 1.0,
    worker_exposure_multiplier: 1.0,
    expected_alert: 'Normal',
    expected_hospital_status: 'NORMAL',
    key_evaluator_takeaway: 'Demonstrates baseline monitoring; system accurately reports safe physiological boundaries without triggering false alarms.',
  },
  {
    id: 'severe-heatwave',
    name: 'Severe Continental Heatwave',
    badge: 'Warning Level',
    badgeColor: 'orange',
    description: 'Intense dry continental heat advancing from Rajasthan across the Indo-Gangetic plains.',
    target_city: 'Delhi',
    target_ward: 'Ward 18 - Connaught Place',
    temp_c: 43.8,
    humidity_pct: 32,
    wind_kmh: 9,
    solar_wm2: 780,
    pvs_multiplier: 1.1,
    worker_exposure_multiplier: 1.3,
    expected_alert: 'Warning',
    expected_hospital_status: 'HIGH ALERT',
    key_evaluator_takeaway: 'Demonstrates how high temperature with moderate humidity pushes Heat Index to 48°C, triggering municipal work-rest advisories.',
  },
  {
    id: 'extreme-heatwave',
    name: 'Critical Mega-Heatwave Emergency',
    badge: 'Extreme Emergency',
    badgeColor: 'red',
    description: 'Multi-day extreme thermal forcing simulating the record 2024 North India 48°C+ crisis.',
    target_city: 'Delhi',
    target_ward: 'Ward 42 - Seelampur',
    temp_c: 47.6,
    humidity_pct: 38,
    wind_kmh: 7,
    solar_wm2: 850,
    pvs_multiplier: 1.35,
    worker_exposure_multiplier: 1.5,
    expected_alert: 'Extreme',
    expected_hospital_status: 'CRITICAL',
    key_evaluator_takeaway: 'Demonstrates full red-alert escalation: emergency cooling center mobilization, hospital bed diversion, and mandatory labor suspension.',
  },
  {
    id: 'high-humidity-coastal',
    name: 'High Humidity Coastal Heat (Lethal Wet Bulb)',
    badge: 'Subtle High Danger',
    badgeColor: 'red',
    description: 'Moderate dry-bulb temperature coupled with maritime humidity (37°C + 78% RH), halving human sweating capacity.',
    target_city: 'Bhubaneswar',
    target_ward: 'Coastal Urban Ward',
    temp_c: 37.2,
    humidity_pct: 78,
    wind_kmh: 11,
    solar_wm2: 650,
    pvs_multiplier: 1.2,
    worker_exposure_multiplier: 1.4,
    expected_alert: 'Extreme',
    expected_hospital_status: 'CRITICAL',
    key_evaluator_takeaway: 'Core differentiator: Shows why ambient temperature alone fails. At only 37.2°C, high humidity drives WBGT to a deadly 33.4°C.',
  },
  {
    id: 'dry-extreme-heat',
    name: 'Dry Desert Heat (Thar Incursion)',
    badge: 'Extreme Dehydration',
    badgeColor: 'orange',
    description: 'Arid desert heat with low humidity (45°C + 16% RH) causing rapid insensate dehydration and solar radiation burns.',
    target_city: 'Jaipur',
    target_ward: 'Walled City Ward',
    temp_c: 45.4,
    humidity_pct: 16,
    wind_kmh: 15,
    solar_wm2: 820,
    pvs_multiplier: 1.05,
    worker_exposure_multiplier: 1.25,
    expected_alert: 'Warning',
    expected_hospital_status: 'HIGH ALERT',
    key_evaluator_takeaway: 'Shows rapid water deficit calculations and heatstroke risks even when evaporative cooling partially functions.',
  },
  {
    id: 'rapid-escalation',
    name: 'Rapid Heat Escalation (+3.5°C in 24h)',
    badge: 'Rapid Escalation',
    badgeColor: 'orange',
    description: 'Sudden synoptic ridge formation causing temperature to jump +3.5°C overnight with rising humidity.',
    target_city: 'Pune',
    target_ward: 'Ward 12 - Shivajinagar',
    temp_c: 41.5,
    humidity_pct: 54,
    wind_kmh: 8,
    solar_wm2: 720,
    pvs_multiplier: 1.15,
    worker_exposure_multiplier: 1.35,
    expected_alert: 'Warning',
    expected_hospital_status: 'HIGH ALERT',
    key_evaluator_takeaway: 'Demonstrates early warning lead-time and sudden surge alert flags before hospitals experience influx.',
  },
  {
    id: 'vulnerable-population-crisis',
    name: 'High Vulnerability Urban Slum Crisis',
    badge: 'Socio-Physical Crisis',
    badgeColor: 'red',
    description: 'Severe thermal conditions over dense informal settlements with tin roofs, no tree canopy, and high street vendor density.',
    target_city: 'Pune',
    target_ward: 'Ward 14 - Bhavani Peth',
    temp_c: 42.0,
    humidity_pct: 48,
    wind_kmh: 6,
    solar_wm2: 740,
    pvs_multiplier: 1.5,
    worker_exposure_multiplier: 1.6,
    expected_alert: 'Extreme',
    expected_hospital_status: 'CRITICAL',
    key_evaluator_takeaway: 'Demonstrates equity in disaster management: Same temperature produces extreme risk in unshaded slums compared to affluent wards.',
  },
];
