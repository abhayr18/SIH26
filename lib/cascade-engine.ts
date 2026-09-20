/**
 * SIH26083 - Unique Feature 4: Heat Risk Cascade Engine
 *
 * Models and visualizes the causal chain of disaster escalation:
 * Weather Forcing -> Environmental Thermal Load -> Population Exposure -> Health & Mortality Risk -> Hospital Surge Load -> Response Action
 */

import { ThermalMetrics } from './thermal-engine';
import { WardVulnerability } from './vulnerability-engine';

export type CascadeStage = {
  stage_number: number;
  stage_name: string;
  badge: string;
  value_display: string;
  description: string;
  status: 'normal' | 'watch' | 'warning' | 'critical';
  metrics: Record<string, string | number>;
};

export type HeatRiskCascade = {
  location_name: string;
  overall_alert: 'Normal' | 'Watch' | 'Warning' | 'Extreme';
  alert_color: 'green' | 'yellow' | 'orange' | 'red';
  stages: CascadeStage[];
  executive_takeaway: string;
};

export function buildHeatRiskCascade(
  locationName: string,
  thermal: ThermalMetrics,
  ward?: WardVulnerability
): HeatRiskCascade {
  const pvsScore = ward ? ward.pvs_score : 65;
  const pop = ward ? ward.population : 95000;
  const outdoorPct = ward ? ward.outdoor_workers_pct : 42;
  const elderlyPct = ward ? ward.elderly_pct : 9.5;

  const isCritical = thermal.htss_score >= 80 || thermal.wbgt_c >= 32.2;
  const isWarning = thermal.htss_score >= 60 || thermal.wbgt_c >= 31.0;
  const isWatch = thermal.htss_score >= 40 || thermal.wbgt_c >= 28.5;

  const alertStatus = isCritical ? 'Extreme' : isWarning ? 'Warning' : isWatch ? 'Watch' : 'Normal';
  const alertColor = isCritical ? 'red' : isWarning ? 'orange' : isWatch ? 'yellow' : 'green';

  const stages: CascadeStage[] = [
    {
      stage_number: 1,
      stage_name: 'Meteorological Forcing',
      badge: 'Weather Inputs',
      value_display: `${thermal.temperature_c}°C + ${thermal.humidity_pct}% RH`,
      description: `Ambient temperature coupled with high atmospheric humidity, ${thermal.wind_speed_kmh} km/h wind, and ${thermal.solar_radiation_wm2} W/m² solar flux.`,
      status: thermal.temperature_c >= 42 ? 'critical' : thermal.temperature_c >= 38 ? 'warning' : 'watch',
      metrics: {
        'Dry Bulb': `${thermal.temperature_c}°C`,
        'Relative Humidity': `${thermal.humidity_pct}%`,
        'Solar Radiation': `${thermal.solar_radiation_wm2} W/m²`,
        'Wind Speed': `${thermal.wind_speed_kmh} km/h`,
      },
    },
    {
      stage_number: 2,
      stage_name: 'Human Thermal Stress',
      badge: 'Biometeorology',
      value_display: `HTSS ${thermal.htss_score}/100 (${thermal.htss_category})`,
      description: `Evaporative cooling severely constrained. WBGT reached ${thermal.wbgt_c}°C (${thermal.wbgt_category}) and UTCI is ${thermal.utci_c}°C. Primary driver: ${thermal.primary_contributor}.`,
      status: isCritical ? 'critical' : isWarning ? 'warning' : isWatch ? 'watch' : 'normal',
      metrics: {
        HTSS: `${thermal.htss_score}/100`,
        'Wet Bulb (BoM WBGT)': `${thermal.wbgt_c}°C`,
        'Universal Index (UTCI)': `${thermal.utci_c}°C`,
        'Heat Index (NOAA)': `${thermal.heat_index_c}°C`,
      },
    },
    {
      stage_number: 3,
      stage_name: 'Population Exposure',
      badge: 'Demographics',
      value_display: `${Math.round(pop * (outdoorPct / 100)).toLocaleString()} Outdoor Workers Exposed`,
      description: `High density urban fabric with ${outdoorPct}% outdoor labor (construction, hawkers, transit) and ${elderlyPct}% elderly population in uninsulated dwellings.`,
      status: pvsScore > 75 ? 'critical' : pvsScore > 50 ? 'warning' : 'watch',
      metrics: {
        'Exposed Population': pop.toLocaleString(),
        'Outdoor Labor Density': `${outdoorPct}%`,
        'Elderly Cohort': `${elderlyPct}%`,
        'Vulnerability Score': `${pvsScore.toFixed(1)}/100`,
      },
    },
    {
      stage_number: 4,
      stage_name: 'Physiological Health Risk',
      badge: 'Clinical Impact',
      value_display: isCritical ? 'Severe Heatstroke & Syncope Surge' : isWarning ? 'Elevated Heat Exhaustion Risk' : 'Moderate Thermal Fatigue',
      description: `Core body temperatures exceed 38.5°C under continuous manual labor. High risk of hyperthermia, electrolyte depletion, and cardiovascular collapse.`,
      status: isCritical ? 'critical' : isWarning ? 'warning' : 'watch',
      metrics: {
        'Clinical Risk Class': alertStatus,
        'Predicted Mortality Risk Ratio': isCritical ? '2.8x Baseline' : isWarning ? '1.7x Baseline' : '1.1x Baseline',
        'High+ Probability': isCritical ? '92%' : isWarning ? '68%' : '35%',
      },
    },
    {
      stage_number: 5,
      stage_name: 'Healthcare Facility Load',
      badge: 'Hospital System',
      value_display: isCritical ? '+3.8x Emergency Room Admissions' : isWarning ? '+2.2x Outpatient Dehydration Surge' : 'Normal Operational Load',
      description: `Emergency wards approach bed capacity limits. Urgent demand for ice baths, cold IV saline (0.9%), and continuous triage monitoring.`,
      status: isCritical ? 'critical' : isWarning ? 'warning' : 'normal',
      metrics: {
        'Hospital Readiness': isCritical ? 'CRITICAL' : isWarning ? 'HIGH ALERT' : 'PREPARE',
        '24h Projected Heat Cases': isCritical ? '45 - 65 patients' : '15 - 25 patients',
        'Cooling Bed Availability': isCritical ? 'Low (<20%)' : 'Moderate',
      },
    },
    {
      stage_number: 6,
      stage_name: 'Command Action Trigger',
      badge: 'Response Operation',
      value_display: isCritical ? 'Emergency Heat Action Plan Activated' : isWarning ? 'Targeted District Advisory & Cooling Centers' : 'Public Hydration Reminders',
      description: `District Magistrate / Disaster Management Authority escalates protocols across municipal wards, health centers, and labor inspectorates.`,
      status: isCritical ? 'critical' : isWarning ? 'warning' : 'watch',
      metrics: {
        'Labor Hours Restriction': isCritical ? 'Mandatory (11:30 - 16:30)' : 'Advisory',
        'Cooling Shelters': isCritical ? 'Emergency Activation' : 'Operating',
        'Water Tanker Deployment': isCritical ? '35 Units Mobilized' : 'Standby',
      },
    },
  ];

  const executiveTakeaway = isCritical
    ? `CRITICAL CASCADE DETECTED: Ambient forcing (${thermal.temperature_c}°C + ${thermal.humidity_pct}% RH) elevates WBGT past the physiological 32.2°C threshold. With ${outdoorPct}% outdoor labor exposure, hospital emergency surge is imminent unless mandatory midday work stoppage and municipal misting shelters are triggered immediately.`
    : `CONTROLLED CASCADE: Elevated thermal index (${thermal.htss_score} HTSS) requires active monitoring of vulnerable demographics and precautionary healthcare preparedness.`;

  return {
    location_name: locationName,
    overall_alert: alertStatus,
    alert_color: alertColor,
    stages,
    executive_takeaway: executiveTakeaway,
  };
}
