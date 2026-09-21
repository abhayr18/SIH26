/**
 * SIH26083 - Comprehensive Multi-Condition Thermal Stress Action Engine
 *
 * Dynamically synthesizes actionable, localized disaster directives based on:
 * 1. Environmental Parameters (Dry bulb temp, relative humidity evaporative barrier, WBGT, Heat Index, PET, solar irradiance, wind)
 * 2. Outdoor Workers & Labor Parameters (ISO 7243 work-rest cycles, midday shift cutoffs, hydration quotas in L/hr)
 * 3. Vulnerable Populations / "People" (Elderly >65, infants/children, tin-roof/slum informal settlement dwellers, chronic illness)
 * 4. Civic & Healthcare Infrastructure (Hospital cold saline/ice baths, municipal cooling centers, water tankers, UHI misting)
 */

import { STATE_VULNERABILITY, HYPERLOCAL_WARDS } from './vulnerability-engine';

export interface ActionPlanPillar {
  headline: string;
  directive: string;
  key_metrics: string;
  badge: string;
  short_action: string;
}

export interface RecommendedActionPlan {
  headline: string;
  summary: string;
  urgency: 'Routine' | 'Advisory' | 'Urgent' | 'Emergency Immediate';
  urgency_color: string;
  condition_triggers: string[];
  environmental: ActionPlanPillar;
  workers: ActionPlanPillar;
  people: ActionPlanPillar;
  infrastructure: ActionPlanPillar;
  checklist: Array<{
    category: 'Environment' | 'Workers' | 'Vulnerable' | 'Civic';
    action: string;
    priority: 'Critical' | 'High' | 'Medium';
  }>;
}

export interface ActionEngineInput {
  temp: number;
  humidity: number;
  wind?: number;
  solar?: number;
  uv?: number;
  wbgt?: number;
  heat_index?: number;
  pet?: number;
  htsi?: number;
  risk?: string;
  district?: string;
  wardName?: string;
}

const DISTRICT_STATE_MAP: Record<string, string> = {
  Delhi: 'Delhi',
  Jaipur: 'Rajasthan',
  Ahmedabad: 'Gujarat',
  Nagpur: 'Maharashtra',
  Hyderabad: 'Telangana',
  Patna: 'Bihar',
  Lucknow: 'Uttar Pradesh',
  Bhopal: 'Madhya Pradesh',
  Bhubaneswar: 'Odisha',
  Chandigarh: 'Punjab',
  Pune: 'Maharashtra',
  Varanasi: 'Uttar Pradesh',
  Mumbai: 'Maharashtra',
  Kolkata: 'West Bengal',
  Bengaluru: 'Karnataka',
  Chennai: 'Tamil Nadu',
};

export function generateThermalStressActionPlan(input: ActionEngineInput): RecommendedActionPlan {
  const temp = input.temp;
  const humidity = input.humidity;
  const wind = input.wind ?? 1.8;
  const solar = input.solar ?? 650;
  const wbgt = input.wbgt ?? (0.7 * (temp * 0.5 + humidity * 0.2) + 0.3 * temp);
  const heatIndex = input.heat_index ?? temp + (humidity > 50 ? (humidity - 50) * 0.25 : 0);
  const htsi = input.htsi ?? 50;
  const districtName = input.district ?? 'Delhi';
  const stateName = DISTRICT_STATE_MAP[districtName] ?? 'Delhi';
  const stateDemo = STATE_VULNERABILITY[stateName] ?? STATE_VULNERABILITY['Delhi'];

  // Look for matching real ward if available
  const cityWards = HYPERLOCAL_WARDS.filter(
    (w) => w.city.toLowerCase() === districtName.toLowerCase()
  );
  const matchedWard = input.wardName
    ? cityWards.find((w) => w.ward_name.toLowerCase().includes(input.wardName!.toLowerCase()))
    : cityWards[0];

  const outdoorLaborPct = matchedWard?.outdoor_workers_pct ?? stateDemo.outdoor_workers_pct;
  const elderlyPct = matchedWard?.elderly_pct ?? stateDemo.elderly_ratio_pct;
  const slumHousingPct = matchedWard?.slum_housing_pct ?? stateDemo.slum_density_pct;

  // 1. Evaluate Environmental Strain Mode
  const isLethalEvaporativeLimit = humidity >= 62 && temp >= 37;
  const isAridFurnaceHeat = temp >= 42 && humidity < 35;
  const isHighRadiantFlux = solar >= 700;
  const isStagnantAir = wind < 1.5;
  const isWbgtCritical = wbgt >= 32.0;
  const isWbgtHigh = wbgt >= 29.5;

  const conditionTriggers: string[] = [];
  if (temp >= 40) conditionTriggers.push(`Extreme Air Temp (${temp}°C)`);
  if (isLethalEvaporativeLimit) conditionTriggers.push(`Sweat Evaporation Constrained (${humidity}% RH)`);
  if (isAridFurnaceHeat) conditionTriggers.push(`Severe Dry Radiant Heat (${temp}°C, ${humidity}% RH)`);
  if (isWbgtCritical) conditionTriggers.push(`ISO 7243 Critical WBGT (${wbgt.toFixed(1)}°C)`);
  else if (isWbgtHigh) conditionTriggers.push(`High WBGT (${wbgt.toFixed(1)}°C)`);
  if (isHighRadiantFlux) conditionTriggers.push(`Peak Solar Radiation (${solar} W/m²)`);
  if (isStagnantAir) conditionTriggers.push(`Stagnant Airflow (${wind} m/s)`);
  if (outdoorLaborPct >= 45) conditionTriggers.push(`High Outdoor Labor (${outdoorLaborPct.toFixed(0)}% workforce)`);
  if (slumHousingPct >= 40) conditionTriggers.push(`Dense Tin-Roof Settlements (${slumHousingPct.toFixed(0)}%)`);

  // 2. Determine Urgency Level
  let urgency: 'Routine' | 'Advisory' | 'Urgent' | 'Emergency Immediate' = 'Routine';
  let urgencyColor = '#10b981'; // Emerald
  if (htsi >= 82 || wbgt >= 32.5 || (temp >= 44 && isHighRadiantFlux)) {
    urgency = 'Emergency Immediate';
    urgencyColor = '#ef4444'; // Red
  } else if (htsi >= 68 || wbgt >= 30.5 || temp >= 41) {
    urgency = 'Urgent';
    urgencyColor = '#f97316'; // Orange
  } else if (htsi >= 50 || wbgt >= 28.0 || temp >= 37) {
    urgency = 'Advisory';
    urgencyColor = '#eab308'; // Amber
  }

  // 3. Synthesize Multi-Condition Environmental Pillar
  let envDirective = '';
  if (isLethalEvaporativeLimit) {
    envDirective = `High ambient moisture (${humidity}%) combined with ${temp}°C suppresses the human body's evaporative cooling capacity. Heat dissipation through perspiration is severely constrained; prolonged exposure will induce rapid heat exhaustion even below 40°C.`;
  } else if (isAridFurnaceHeat) {
    envDirective = `Intense dry heat (${temp}°C) under high solar insolation (${solar} W/m²) causes rapid dehydration, corneal dryness, and extreme surface heat gain. Unshaded asphalt and paved surfaces can exceed 55°C.`;
  } else if (isWbgtCritical) {
    envDirective = `WBGT at ${wbgt.toFixed(1)}°C exceeds international human physiological threshold (ISO 7243). Ambient conditions represent acute thermal shock risk for anyone exposed during daytime peak hours.`;
  } else {
    envDirective = `Elevated heat index (${heatIndex.toFixed(1)}°C) with ${humidity}% humidity. Environmental conditions require sustained hydration and reduction of non-essential sun exposure.`;
  }

  // 4. Synthesize Workers / Occupational Labor Pillar
  let workerIsoRegimen = '';
  let workerHydration = '';
  let workerDirective = '';

  if (wbgt >= 32.0 || htsi >= 80) {
    workerIsoRegimen = 'STOP WORK: Mandatory cessation of heavy manual labor between 11:00 AM and 04:30 PM (ISO 7243). Essential tasks restricted to 15 min work / 45 min shaded rest.';
    workerHydration = '1.0 – 1.2 Liters/hour with mandatory oral rehydration salts (ORS) & cool drinking water.';
    workerDirective = `Full daytime work suspension for construction crews, road paving gangs, and agriculture workers across ${districtName}. Mandate shaded cool pavilions with fans for street vendors and gig delivery executives. Shift outdoor duty hours to pre-dawn (05:30 AM – 10:30 AM) and evening (05:00 PM – 07:30 PM).`;
  } else if (wbgt >= 29.5 || htsi >= 65) {
    workerIsoRegimen = 'ISO 7243 Regimen: 30 min work / 30 min mandatory shaded recovery per hour for moderate-to-heavy tasks.';
    workerHydration = '0.8 – 1.0 Liters/hour; enforce hydration whistle/alarm every 20 minutes.';
    workerDirective = `Mandate employer-provided shade canopies, cool water jars, and electrolyte sachets across all worksites. Relieve traffic police at high-radiation asphalt junctions with 30-minute rotation cycles.`;
  } else {
    workerIsoRegimen = 'Continuous work permitted with mandatory 15-minute shaded rest intervals every 45-60 minutes.';
    workerHydration = '0.5 – 0.7 Liters/hour regular clean drinking water.';
    workerDirective = `Provide accessible shaded rest sheds and promote light, breathable cotton workwear. Advise delivery platforms to pause midday penalties.`;
  }

  // 5. Synthesize Vulnerable People Pillar (Elderly, Children, Slum/Tin-Roofs)
  let peopleDirective = '';
  if (urgency === 'Emergency Immediate') {
    peopleDirective = `Deploy ASHA and municipal community health workers for direct doorstep check-ins on senior citizens (${elderlyPct.toFixed(0)}% population) living alone. Tin-roof informal homes (${slumHousingPct.toFixed(0)}% in dense wards) exceed 48°C indoor temperatures—open air-cooled municipal shelters for voluntary daytime evacuation. Order immediate suspension of afternoon school classes and outdoor student gatherings.`;
  } else if (urgency === 'Urgent') {
    peopleDirective = `Issue targeted SMS alerts to registered cardiac, diabetic, and hypertensive patients to remain indoors in well-ventilated rooms. Distribute ORS packets and water purification tablets across slum clusters. Reschedule school hours to end by 11:30 AM.`;
  } else {
    peopleDirective = `Advise elderly residents and parents of young children to complete shopping, errands, and outdoor exercise prior to 10:00 AM or after 5:30 PM. Ensure senior day-care centers have operable cooling.`;
  }

  // 6. Synthesize Civic & Healthcare Infrastructure Pillar
  let infraDirective = '';
  if (urgency === 'Emergency Immediate' || urgency === 'Urgent') {
    infraDirective = `Pre-position cold normal saline (0.9% IV bags at 4°C), ice-bath resuscitation immersion tubs, and oral rehydration buffers at all district trauma centers and primary health centers. Deploy municipal water tankers to bus stands, railway station approaches, and high-density informal markets. Dispatch high-pressure road-sprinkling tankers along main dark asphalt transit corridors to suppress urban heat island radiation.`;
  } else {
    infraDirective = `Maintain dedicated heat relief corners and drinking water kiosks at major transit interchanges. Verify backup power generators at cold storage pharmacies and clinics.`;
  }

  // 7. Synthesize Executive Headline & Holistic Summary
  let headline = '';
  let summary = '';

  if (urgency === 'Emergency Immediate') {
    headline = `CRITICAL MULTI-SECTOR HEAT DIRECTIVE: ${districtName.toUpperCase()}`;
    summary = `Severe biometeorological stress (${temp}°C dry bulb, ${wbgt.toFixed(1)}°C WBGT, ${solar} W/m² radiant flux) intersecting with ${outdoorLaborPct.toFixed(0)}% outdoor worker exposure and ${slumHousingPct.toFixed(0)}% tin-roof settlements. Enforce mandatory midday outdoor labor suspension, activate emergency community cooling centers, and stage cold saline IVs at district hospitals.`;
  } else if (urgency === 'Urgent') {
    headline = `ELEVATED THERMAL HAZARD ADVISORY: ${districtName.toUpperCase()}`;
    summary = `Elevated human thermal load (HTSI ${htsi}/100, WBGT ${wbgt.toFixed(1)}°C) compounded by ${isLethalEvaporativeLimit ? 'high humidity evaporative constraint' : 'intense solar radiation'}. Enforce ISO 7243 30m/30m work-rest regimens, conduct doorstep checks for ${elderlyPct.toFixed(0)}% elderly cohorts, and deploy municipal water tankers.`;
  } else {
    headline = `PREVENTATIVE HEAT STRESS GUIDANCE: ${districtName.toUpperCase()}`;
    summary = `Moderate thermal strain within manageable physiological thresholds (${temp}°C, ${humidity}% RH). Maintain routine worker hydration breaks (0.5–0.7 L/hr), monitor vulnerable populations, and keep civic drinking water stations active.`;
  }

  // 8. Action Checklist
  const checklist: RecommendedActionPlan['checklist'] = [];
  if (urgency === 'Emergency Immediate') {
    checklist.push({
      category: 'Workers',
      action: 'Suspend heavy outdoor construction & road labor between 11:00 AM – 04:30 PM under municipal authority order.',
      priority: 'Critical',
    });
    checklist.push({
      category: 'Civic',
      action: 'Open municipal cooling shelters & misting pavilions for tin-roof settlement residents.',
      priority: 'Critical',
    });
    checklist.push({
      category: 'Vulnerable',
      action: 'ASHA volunteer doorstep wellness visits for senior citizens & chronic patients.',
      priority: 'High',
    });
    checklist.push({
      category: 'Civic',
      action: 'Stage 4°C cold IV saline and ice-immersion tubs at district casualty wards.',
      priority: 'High',
    });
  } else if (urgency === 'Urgent') {
    checklist.push({
      category: 'Workers',
      action: 'Enforce ISO 7243: 30 min shaded rest per hour & 1.0 L/hr ORS hydration quota.',
      priority: 'Critical',
    });
    checklist.push({
      category: 'Vulnerable',
      action: 'Reschedule school afternoon sessions; close unshaded playgrounds.',
      priority: 'High',
    });
    checklist.push({
      category: 'Civic',
      action: 'Deploy drinking water tankers to transit hubs, tempo stands, and informal markets.',
      priority: 'High',
    });
    checklist.push({
      category: 'Environment',
      action: 'Operate road water-sprinkling tankers on dark asphalt corridors to suppress UHI.',
      priority: 'Medium',
    });
  } else {
    checklist.push({
      category: 'Workers',
      action: 'Mandate shaded hydration breaks every 45-60 minutes for outdoor staff.',
      priority: 'Medium',
    });
    checklist.push({
      category: 'Vulnerable',
      action: 'Advise morning/evening errand scheduling for senior citizens and young children.',
      priority: 'Medium',
    });
    checklist.push({
      category: 'Civic',
      action: 'Verify water fountain pressure and functional ORS booths at community centers.',
      priority: 'Medium',
    });
  }

  return {
    headline,
    summary,
    urgency,
    urgency_color: urgencyColor,
    condition_triggers: conditionTriggers,
    environmental: {
      headline: 'Biometeorological Triggers',
      directive: envDirective,
      key_metrics: `${temp}°C Dry Bulb · ${humidity}% Humidity · ${wbgt.toFixed(1)}°C WBGT · ${solar} W/m² Solar`,
      badge: isLethalEvaporativeLimit ? 'Evaporation Constrained' : isHighRadiantFlux ? 'Peak Solar Irradiance' : 'Standard Summer Ambient',
      short_action: isLethalEvaporativeLimit
        ? `Evaporative barrier (${humidity}% RH, ${temp}°C) · Sweat cooling suppressed`
        : isAridFurnaceHeat
        ? `Severe radiant heat (${temp}°C) · Pavement >55°C`
        : isWbgtCritical
        ? `Critical WBGT (${wbgt.toFixed(1)}°C) · Acute thermal shock risk`
        : `Heat Index ${heatIndex.toFixed(0)}°C · Restrict midday direct sun`,
    },
    workers: {
      headline: 'Outdoor Labor & Occupational Regimen',
      directive: `${workerDirective} ${workerIsoRegimen}`,
      key_metrics: `Quota: ${workerHydration} · Exposure: ${outdoorLaborPct.toFixed(0)}% workforce`,
      badge: wbgt >= 32.0 ? 'Mandatory Work Stoppage' : wbgt >= 29.5 ? 'ISO 7243 30m/30m Rest' : 'Regular Rest Regimen',
      short_action: wbgt >= 32.0 || htsi >= 80
        ? 'Midday work stoppage (11am–4:30pm) · 1.2 L/h ORS'
        : wbgt >= 29.5 || htsi >= 65
        ? 'ISO 7243: 30m work / 30m shaded rest · 1.0 L/h ORS'
        : '15m hourly shaded rest · 0.5–0.7 L/h hydration',
    },
    people: {
      headline: 'Vulnerable Populations & Residents',
      directive: peopleDirective,
      key_metrics: `Elderly: ${elderlyPct.toFixed(1)}% · Slum/Tin-Roofs: ${slumHousingPct.toFixed(1)}% · Children: ${stateDemo.children_ratio_pct}%`,
      badge: slumHousingPct >= 40 ? 'Tin-Roof Heat Trap Alert' : 'Vulnerable Cohort Advisory',
      short_action: urgency === 'Emergency Immediate'
        ? `Doorstep ASHA checks (${elderlyPct.toFixed(0)}% seniors) · Open cooling shelters`
        : urgency === 'Urgent'
        ? 'Targeted SMS alerts · Reschedule school afternoon sessions'
        : 'Senior morning errand schedule · Hydration advisories',
    },
    infrastructure: {
      headline: 'Civic, Water & Healthcare Logistics',
      directive: infraDirective,
      key_metrics: `Facilities: ${matchedWard?.hospital_count ?? 3} Clinics · Cooling Centers: ${matchedWard?.cooling_center_count ?? 2} Active`,
      badge: urgency === 'Emergency Immediate' ? 'Emergency Saline/Ice Buffers' : 'Civic Water Tankers Active',
      short_action: urgency === 'Emergency Immediate' || urgency === 'Urgent'
        ? '4°C IV cold saline & ice tubs ready · Deploy water tankers'
        : 'Transit water kiosks & cooling center standby',
    },
    checklist,
  };
}

