/**
 * SIH26083 - Unique Feature 7: Hospital Surge Readiness Decision-Support Engine
 *
 * Models healthcare surge preparedness under extreme thermal stress.
 * Generates proactive hospital readiness triage levels:
 * NORMAL | PREPARE | HIGH ALERT | CRITICAL
 *
 * Disclaimer: Decision-support prototype for disaster management, NOT a medical diagnostic system.
 */

export type HospitalReadinessLevel = 'NORMAL' | 'PREPARE' | 'HIGH ALERT' | 'CRITICAL';

export type HospitalFacility = {
  id: string;
  name: string;
  city: string;
  type: 'Government Medical College' | 'District Civil Hospital' | 'Urban Community Health Centre' | 'Private Multi-Specialty';
  total_emergency_beds: number;
  dedicated_heatstroke_beds: number;
  current_heat_admissions_today: number;
  available_cooling_beds: number;
  ors_stock_packets: number;
  iv_fluid_saline_units: number;
  ice_bath_equipment_ready: boolean;
  backup_generator_tested: boolean;
  status: 'Normal Operations' | 'Surge Triage Active' | 'Diverting Non-Emergency' | 'Critical Surge Capacity';
};

export type HealthcareReadinessAssessment = {
  city: string;
  current_htss: number;
  forecast_peak_htss: number;
  readiness_level: HospitalReadinessLevel;
  readiness_color: 'green' | 'yellow' | 'orange' | 'red';
  surge_factor_index: number; // 1.0 to 4.5x normal emergency room load
  facilities: HospitalFacility[];
  total_dedicated_beds: number;
  available_dedicated_beds: number;
  admissions_surge_projection_24h: number;
  critical_shortages: string[];
  recommended_hospital_actions: string[];
};

export const MONITORED_HOSPITALS: HospitalFacility[] = [
  // Pune Hospitals
  {
    id: 'HOSP-PUN-01',
    name: 'Sassoon General Hospital & B.J. Medical College',
    city: 'Pune',
    type: 'Government Medical College',
    total_emergency_beds: 120,
    dedicated_heatstroke_beds: 30,
    current_heat_admissions_today: 14,
    available_cooling_beds: 16,
    ors_stock_packets: 4500,
    iv_fluid_saline_units: 1200,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },
  {
    id: 'HOSP-PUN-02',
    name: 'Kamla Nehru General Hospital (PMC)',
    city: 'Pune',
    type: 'District Civil Hospital',
    total_emergency_beds: 65,
    dedicated_heatstroke_beds: 15,
    current_heat_admissions_today: 9,
    available_cooling_beds: 6,
    ors_stock_packets: 1800,
    iv_fluid_saline_units: 450,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },
  {
    id: 'HOSP-PUN-03',
    name: 'YCM Hospital, Pimpri-Chinchwad',
    city: 'Pune',
    type: 'District Civil Hospital',
    total_emergency_beds: 80,
    dedicated_heatstroke_beds: 20,
    current_heat_admissions_today: 5,
    available_cooling_beds: 15,
    ors_stock_packets: 2500,
    iv_fluid_saline_units: 800,
    ice_bath_equipment_ready: false,
    backup_generator_tested: true,
    status: 'Normal Operations',
  },

  // Delhi Hospitals
  {
    id: 'HOSP-DEL-01',
    name: 'AIIMS New Delhi - Emergency Medicine Centre',
    city: 'Delhi',
    type: 'Government Medical College',
    total_emergency_beds: 180,
    dedicated_heatstroke_beds: 45,
    current_heat_admissions_today: 28,
    available_cooling_beds: 17,
    ors_stock_packets: 8000,
    iv_fluid_saline_units: 3200,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },
  {
    id: 'HOSP-DEL-02',
    name: 'Guru Teg Bahadur (GTB) Hospital, Shahdara',
    city: 'Delhi',
    type: 'Government Medical College',
    total_emergency_beds: 110,
    dedicated_heatstroke_beds: 25,
    current_heat_admissions_today: 21,
    available_cooling_beds: 4,
    ors_stock_packets: 2100,
    iv_fluid_saline_units: 650,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Critical Surge Capacity',
  },
  {
    id: 'HOSP-DEL-03',
    name: 'Dr. Ram Manohar Lohia (RML) Hospital',
    city: 'Delhi',
    type: 'Government Medical College',
    total_emergency_beds: 130,
    dedicated_heatstroke_beds: 35,
    current_heat_admissions_today: 18,
    available_cooling_beds: 17,
    ors_stock_packets: 5200,
    iv_fluid_saline_units: 1800,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },

  // Ahmedabad Hospitals
  {
    id: 'HOSP-AHM-01',
    name: 'Civil Hospital Ahmedabad (Asarwa)',
    city: 'Ahmedabad',
    type: 'Government Medical College',
    total_emergency_beds: 200,
    dedicated_heatstroke_beds: 50,
    current_heat_admissions_today: 32,
    available_cooling_beds: 18,
    ors_stock_packets: 6000,
    iv_fluid_saline_units: 2400,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },

  // Mumbai Hospitals
  {
    id: 'HOSP-BOM-01',
    name: 'KEM Hospital & Seth GS Medical College, Parel',
    city: 'Mumbai',
    type: 'Government Medical College',
    total_emergency_beds: 220,
    dedicated_heatstroke_beds: 45,
    current_heat_admissions_today: 26,
    available_cooling_beds: 19,
    ors_stock_packets: 7500,
    iv_fluid_saline_units: 3000,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },
  {
    id: 'HOSP-BOM-02',
    name: 'Lokmanya Tilak Municipal General Hospital (Sion)',
    city: 'Mumbai',
    type: 'Government Medical College',
    total_emergency_beds: 180,
    dedicated_heatstroke_beds: 35,
    current_heat_admissions_today: 22,
    available_cooling_beds: 13,
    ors_stock_packets: 5200,
    iv_fluid_saline_units: 1900,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },

  // Kolkata Hospitals
  {
    id: 'HOSP-CCU-01',
    name: 'SSKM Hospital & IPGMER Kolkata',
    city: 'Kolkata',
    type: 'Government Medical College',
    total_emergency_beds: 190,
    dedicated_heatstroke_beds: 40,
    current_heat_admissions_today: 25,
    available_cooling_beds: 15,
    ors_stock_packets: 6800,
    iv_fluid_saline_units: 2600,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },

  // Bengaluru Hospitals
  {
    id: 'HOSP-BLR-01',
    name: 'Victoria Hospital (BMCRI), City Market',
    city: 'Bengaluru',
    type: 'Government Medical College',
    total_emergency_beds: 160,
    dedicated_heatstroke_beds: 30,
    current_heat_admissions_today: 12,
    available_cooling_beds: 18,
    ors_stock_packets: 4800,
    iv_fluid_saline_units: 1600,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Normal Operations',
  },

  // Chennai Hospitals
  {
    id: 'HOSP-MAA-01',
    name: 'Rajiv Gandhi Government General Hospital (MMC)',
    city: 'Chennai',
    type: 'Government Medical College',
    total_emergency_beds: 210,
    dedicated_heatstroke_beds: 45,
    current_heat_admissions_today: 29,
    available_cooling_beds: 16,
    ors_stock_packets: 7200,
    iv_fluid_saline_units: 2800,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },

  // Chandigarh Hospitals
  {
    id: 'HOSP-IXC-01',
    name: 'PGIMER Emergency Medicine Centre Chandigarh',
    city: 'Chandigarh',
    type: 'Government Medical College',
    total_emergency_beds: 170,
    dedicated_heatstroke_beds: 35,
    current_heat_admissions_today: 18,
    available_cooling_beds: 17,
    ors_stock_packets: 6100,
    iv_fluid_saline_units: 2200,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Normal Operations',
  },

  // Varanasi Hospitals
  {
    id: 'HOSP-VNS-01',
    name: 'Sir Sunderlal Hospital (Institute of Medical Sciences, BHU)',
    city: 'Varanasi',
    type: 'Government Medical College',
    total_emergency_beds: 150,
    dedicated_heatstroke_beds: 30,
    current_heat_admissions_today: 24,
    available_cooling_beds: 6,
    ors_stock_packets: 4400,
    iv_fluid_saline_units: 1500,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Critical Surge Capacity',
  },

  // Hyderabad Hospitals
  {
    id: 'HOSP-HYD-01',
    name: 'Osmania General Hospital, Afzal Gunj',
    city: 'Hyderabad',
    type: 'Government Medical College',
    total_emergency_beds: 180,
    dedicated_heatstroke_beds: 40,
    current_heat_admissions_today: 27,
    available_cooling_beds: 13,
    ors_stock_packets: 6400,
    iv_fluid_saline_units: 2500,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },

  // Jaipur Hospitals
  {
    id: 'HOSP-JAI-01',
    name: 'Sawai Man Singh (SMS) Medical College & Hospital',
    city: 'Jaipur',
    type: 'Government Medical College',
    total_emergency_beds: 240,
    dedicated_heatstroke_beds: 55,
    current_heat_admissions_today: 38,
    available_cooling_beds: 17,
    ors_stock_packets: 8500,
    iv_fluid_saline_units: 3500,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Critical Surge Capacity',
  },

  // Patna Hospitals
  {
    id: 'HOSP-PAT-01',
    name: 'Patna Medical College and Hospital (PMCH)',
    city: 'Patna',
    type: 'Government Medical College',
    total_emergency_beds: 190,
    dedicated_heatstroke_beds: 40,
    current_heat_admissions_today: 31,
    available_cooling_beds: 9,
    ors_stock_packets: 5900,
    iv_fluid_saline_units: 2100,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Critical Surge Capacity',
  },

  // Lucknow Hospitals
  {
    id: 'HOSP-LUK-01',
    name: 'King George Medical University (KGMU) Trauma Centre',
    city: 'Lucknow',
    type: 'Government Medical College',
    total_emergency_beds: 220,
    dedicated_heatstroke_beds: 50,
    current_heat_admissions_today: 34,
    available_cooling_beds: 16,
    ors_stock_packets: 7800,
    iv_fluid_saline_units: 3100,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },

  // Bhopal Hospitals
  {
    id: 'HOSP-BHO-01',
    name: 'Hamidia Hospital & Gandhi Medical College',
    city: 'Bhopal',
    type: 'Government Medical College',
    total_emergency_beds: 160,
    dedicated_heatstroke_beds: 35,
    current_heat_admissions_today: 23,
    available_cooling_beds: 12,
    ors_stock_packets: 5400,
    iv_fluid_saline_units: 1800,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },

  // Bhubaneswar Hospitals
  {
    id: 'HOSP-BHU-01',
    name: 'AIIMS Bhubaneswar Emergency & Critical Care',
    city: 'Bhubaneswar',
    type: 'Government Medical College',
    total_emergency_beds: 150,
    dedicated_heatstroke_beds: 35,
    current_heat_admissions_today: 20,
    available_cooling_beds: 15,
    ors_stock_packets: 5800,
    iv_fluid_saline_units: 2000,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Normal Operations',
  },

  // Nagpur Hospitals
  {
    id: 'HOSP-NAG-01',
    name: 'Government Medical College & Hospital (GMC Nagpur)',
    city: 'Nagpur',
    type: 'Government Medical College',
    total_emergency_beds: 180,
    dedicated_heatstroke_beds: 40,
    current_heat_admissions_today: 28,
    available_cooling_beds: 12,
    ors_stock_packets: 6200,
    iv_fluid_saline_units: 2400,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: 'Surge Triage Active',
  },
];

export function assessHospitalReadiness(
  city: string,
  currentHtss: number,
  forecastPeakHtss: number = currentHtss
): HealthcareReadinessAssessment {
  const cityFacilities = MONITORED_HOSPITALS.filter(
    (h) => h.city.toLowerCase() === city.toLowerCase()
  );

  const fallbackFacility: HospitalFacility = {
    id: `HOSP-${city.toUpperCase()}-01`,
    name: `${city} District Civil Hospital`,
    city,
    type: 'District Civil Hospital',
    total_emergency_beds: 80,
    dedicated_heatstroke_beds: 20,
    current_heat_admissions_today: Math.round(currentHtss * 0.2),
    available_cooling_beds: Math.max(2, 20 - Math.round(currentHtss * 0.2)),
    ors_stock_packets: 2500,
    iv_fluid_saline_units: 800,
    ice_bath_equipment_ready: true,
    backup_generator_tested: true,
    status: currentHtss > 75 ? 'Critical Surge Capacity' : 'Normal Operations',
  };

  const facilities = cityFacilities.length > 0 ? cityFacilities : [fallbackFacility];

  const totalDedicated = facilities.reduce((acc, h) => acc + h.dedicated_heatstroke_beds, 0);
  const availableDedicated = facilities.reduce((acc, h) => acc + h.available_cooling_beds, 0);

  // Peak stress drives readiness
  const effectiveStress = Math.max(currentHtss, forecastPeakHtss);

  let readiness_level: HospitalReadinessLevel = 'NORMAL';
  let readiness_color: 'green' | 'yellow' | 'orange' | 'red' = 'green';
  let surge_factor = 1.0;

  if (effectiveStress >= 80) {
    readiness_level = 'CRITICAL';
    readiness_color = 'red';
    surge_factor = 3.8;
  } else if (effectiveStress >= 65) {
    readiness_level = 'HIGH ALERT';
    readiness_color = 'orange';
    surge_factor = 2.4;
  } else if (effectiveStress >= 45) {
    readiness_level = 'PREPARE';
    readiness_color = 'yellow';
    surge_factor = 1.5;
  }

  const projectedAdmissions24h = Math.round(totalDedicated * surge_factor * 0.65);

  const shortages: string[] = [];
  const actions: string[] = [];

  if (readiness_level === 'CRITICAL') {
    actions.push('Recall off-duty emergency medical officers and triage nurses.');
    actions.push('Designate orthopedic and elective recovery wards as secondary heatstroke units.');
    actions.push('Pre-mix continuous ORS hydration stations at outpatient registration entrances.');
    actions.push('Stage cold saline IV bags (4°C) in rapid evaporative cooling bays.');
    actions.push('Activate 108 ambulance dedicated heatwave transit protocols.');
    if (availableDedicated < 15) {
      shortages.push('Dedicated heatstroke bed availability critically low (<15 beds across district).');
    }
  } else if (readiness_level === 'HIGH ALERT') {
    actions.push('Inspect emergency air-conditioning and backup power generators.');
    actions.push('Replenish district buffer of Normal Saline (0.9%) and Ringer Lactate fluids.');
    actions.push('Ensure rapid-cooling immersion tubs or cold water spray misting fans are functional.');
    actions.push('Coordinate with 108 dispatch for real-time ER bed availability dashboard.');
  } else if (readiness_level === 'PREPARE') {
    actions.push('Conduct inventory audit of ORS packets, ice packs, and pediatric hydration salts.');
    actions.push('Brief triage staff on identifying early heat exhaustion vs. heatstroke signs.');
    actions.push('Distribute clinical heatwave management guidelines to primary health centres.');
  } else {
    actions.push('Maintain routine emergency preparedness and inventory monitoring.');
  }

  return {
    city,
    current_htss: currentHtss,
    forecast_peak_htss: forecastPeakHtss,
    readiness_level,
    readiness_color,
    surge_factor_index: surge_factor,
    facilities,
    total_dedicated_beds: totalDedicated,
    available_dedicated_beds: availableDedicated,
    admissions_surge_projection_24h: projectedAdmissions24h,
    critical_shortages: shortages,
    recommended_hospital_actions: actions,
  };
}
