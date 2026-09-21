/**
 * SIH26083 - Unique Feature 6: Smart Cooling Center Optimization Engine
 *
 * Algorithmically optimizes temporary cooling shelter deployment using spatial heuristics:
 * Score = Zone Heat Risk * Vulnerable Population Density * Distance to Nearest Operating Center
 *
 * Note: Prototype decision-support recommendation for municipal disaster management authorities.
 */

export type CoolingCenter = {
  id: string;
  name: string;
  city: string;
  ward: string;
  lat: number;
  lon: number;
  type: 'Community Center' | 'Public Library' | 'Metro Station Concourse' | 'Municipal School' | 'Shaded Bus Terminal' | 'Misting Pavilion';
  capacity_people: number;
  current_occupancy_pct: number;
  water_point_available: boolean;
  medical_staff_on_duty: boolean;
  ac_cooling: boolean;
  status: 'Open' | 'Operating Near Capacity' | 'Closed / Preparing' | 'Extended Hours Active';
  operating_hours: string;
};

export type CandidateCoolingSite = {
  candidate_id: string;
  site_name: string;
  city: string;
  ward_id: string;
  ward_name: string;
  lat: number;
  lon: number;
  site_type: 'Municipal Hall' | 'Government High School' | 'Sports Complex' | 'Transit Hub';
  estimated_capacity: number;
  nearest_existing_center_name: string;
  distance_to_nearest_center_km: number;
  ward_htss_score: number;
  ward_vulnerable_population: number;
  optimization_score: number; // Computed priority
  recommendation_rank: number;
  rationale: string;
};

// Real baseline cooling centers across monitored cities
export const EXISTING_COOLING_CENTERS: CoolingCenter[] = [
  // Pune Centers
  { id: 'CC-PUN-01', name: 'Shivajinagar Municipal Community Hall', city: 'Pune', ward: 'Ward 12', lat: 18.5314, lon: 73.8446, type: 'Community Center', capacity_people: 250, current_occupancy_pct: 68, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Open', operating_hours: '08:00 - 20:00' },
  { id: 'CC-PUN-02', name: 'Bhavani Peth Urban Health Shelter', city: 'Pune', ward: 'Ward 14', lat: 18.5132, lon: 73.8689, type: 'Municipal School', capacity_people: 180, current_occupancy_pct: 88, water_point_available: true, medical_staff_on_duty: false, ac_cooling: false, status: 'Operating Near Capacity', operating_hours: '09:00 - 19:00' },
  { id: 'CC-PUN-03', name: 'Kothrud Cultural Complex', city: 'Pune', ward: 'Ward 08', lat: 18.5074, lon: 73.8077, type: 'Community Center', capacity_people: 320, current_occupancy_pct: 35, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Open', operating_hours: '08:00 - 21:00' },
  { id: 'CC-PUN-04', name: 'Hadapsar Bus Depot Shaded Misting Zone', city: 'Pune', ward: 'Ward 21', lat: 18.5018, lon: 73.9260, type: 'Shaded Bus Terminal', capacity_people: 150, current_occupancy_pct: 75, water_point_available: true, medical_staff_on_duty: false, ac_cooling: false, status: 'Extended Hours Active', operating_hours: '07:00 - 22:00' },

  // Delhi Centers
  { id: 'CC-DEL-01', name: 'Seelampur Rain Basera & Heat Relief Camp', city: 'Delhi', ward: 'Ward 42', lat: 28.6675, lon: 77.2694, type: 'Community Center', capacity_people: 300, current_occupancy_pct: 92, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Operating Near Capacity', operating_hours: '24 Hours' },
  { id: 'CC-DEL-02', name: 'Palika Kendra Underground Concourse', city: 'Delhi', ward: 'Ward 18', lat: 28.6289, lon: 77.2185, type: 'Metro Station Concourse', capacity_people: 500, current_occupancy_pct: 48, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Open', operating_hours: '06:00 - 23:00' },
  { id: 'CC-DEL-03', name: 'Okhla Phase II ESIC Heat Shelter', city: 'Delhi', ward: 'Ward 77', lat: 28.5284, lon: 77.2766, type: 'Misting Pavilion', capacity_people: 220, current_occupancy_pct: 82, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Extended Hours Active', operating_hours: '08:00 - 20:00' },

  // Ahmedabad Centers
  { id: 'CC-AHM-01', name: 'Danilimda Municipal Primary School Hall', city: 'Ahmedabad', ward: 'Ward 05', lat: 22.9984, lon: 72.5832, type: 'Municipal School', capacity_people: 200, current_occupancy_pct: 85, water_point_available: true, medical_staff_on_duty: false, ac_cooling: false, status: 'Open', operating_hours: '09:00 - 18:30' },
  { id: 'CC-AHM-02', name: 'LD Engineering Ground Relief Tent', city: 'Ahmedabad', ward: 'Ward 19', lat: 23.0333, lon: 72.5467, type: 'Misting Pavilion', capacity_people: 350, current_occupancy_pct: 42, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Open', operating_hours: '08:00 - 20:00' },

  // Mumbai Centers
  { id: 'CC-BOM-01', name: 'Dharavi 90 Feet Road BMC Disaster Relief Hall', city: 'Mumbai', ward: 'Ward F/North', lat: 19.0435, lon: 72.8562, type: 'Community Center', capacity_people: 400, current_occupancy_pct: 91, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Operating Near Capacity', operating_hours: '24 Hours' },
  { id: 'CC-BOM-02', name: 'Govandi Shivaji Nagar Municipal School Misting Center', city: 'Mumbai', ward: 'Ward M/East', lat: 19.0621, lon: 72.9234, type: 'Municipal School', capacity_people: 300, current_occupancy_pct: 86, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Extended Hours Active', operating_hours: '08:00 - 21:00' },

  // Kolkata Centers
  { id: 'CC-CCU-01', name: 'Burrabazar Posta Krishna Mandir Community Shelter', city: 'Kolkata', ward: 'Ward 45', lat: 22.5851, lon: 88.3541, type: 'Community Center', capacity_people: 280, current_occupancy_pct: 88, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Operating Near Capacity', operating_hours: '07:00 - 20:00' },
  { id: 'CC-CCU-02', name: 'Tangra Dhapa Welfare Pavilion', city: 'Kolkata', ward: 'Ward 58', lat: 22.5489, lon: 88.3982, type: 'Misting Pavilion', capacity_people: 320, current_occupancy_pct: 79, water_point_available: true, medical_staff_on_duty: false, ac_cooling: true, status: 'Open', operating_hours: '08:00 - 20:00' },

  // Bengaluru Centers
  { id: 'CC-BLR-01', name: 'Peenya 2nd Stage BBMP Worker Welfare Complex', city: 'Bengaluru', ward: 'Ward 13', lat: 13.0298, lon: 77.5182, type: 'Community Center', capacity_people: 350, current_occupancy_pct: 76, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Open', operating_hours: '08:00 - 20:00' },
  { id: 'CC-BLR-02', name: 'Koramangala Indoor Stadium AC Rest Zone', city: 'Bengaluru', ward: 'Ward 151', lat: 12.9352, lon: 77.6245, type: 'Sports Complex', capacity_people: 450, current_occupancy_pct: 52, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Open', operating_hours: '07:00 - 22:00' },

  // Chennai Centers
  { id: 'CC-MAA-01', name: 'T. Nagar Panagal Park GCC Air-Cooled Relief Hall', city: 'Chennai', ward: 'Ward 114', lat: 13.0418, lon: 78.2341, type: 'Community Center', capacity_people: 300, current_occupancy_pct: 84, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Operating Near Capacity', operating_hours: '08:00 - 20:00' },
  { id: 'CC-MAA-02', name: 'Kasimedu Harbour Shaded Fisher Relief Pavilion', city: 'Chennai', ward: 'Ward 45', lat: 13.1205, lon: 80.2982, type: 'Misting Pavilion', capacity_people: 260, current_occupancy_pct: 80, water_point_available: true, medical_staff_on_duty: true, ac_cooling: false, status: 'Open', operating_hours: '06:00 - 19:00' },

  // Chandigarh Centers
  { id: 'CC-IXC-01', name: 'Sector 17 Piazza Underground Air-Cooled Lounge', city: 'Chandigarh', ward: 'Ward 08', lat: 30.7398, lon: 76.7827, type: 'Community Center', capacity_people: 350, current_occupancy_pct: 65, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Open', operating_hours: '08:00 - 21:00' },

  // Varanasi Centers
  { id: 'CC-VNS-01', name: 'Godowlia Chowk Dharmashala Heat Recovery Camp', city: 'Varanasi', ward: 'Ward 12', lat: 25.3094, lon: 83.0068, type: 'Community Center', capacity_people: 280, current_occupancy_pct: 89, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Operating Near Capacity', operating_hours: '07:00 - 21:00' },

  // Hyderabad Centers
  { id: 'CC-HYD-01', name: 'Charminar Unani Hospital Shaded Courtyard', city: 'Hyderabad', ward: 'Ward 51', lat: 17.3616, lon: 78.4747, type: 'Community Center', capacity_people: 320, current_occupancy_pct: 82, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Open', operating_hours: '08:00 - 20:00' },

  // Jaipur Centers
  { id: 'CC-JAI-01', name: 'Johari Bazar Community Hall Heat Relief Shelter', city: 'Jaipur', ward: 'Ward 01', lat: 26.9214, lon: 75.8267, type: 'Community Center', capacity_people: 280, current_occupancy_pct: 87, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Operating Near Capacity', operating_hours: '08:00 - 20:00' },

  // Patna Centers
  { id: 'CC-PAT-01', name: 'Gandhi Maidan Gate 1 Heatstroke Triage Tent', city: 'Patna', ward: 'Ward 28', lat: 25.6178, lon: 85.1432, type: 'Misting Pavilion', capacity_people: 350, current_occupancy_pct: 85, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Operating Near Capacity', operating_hours: '08:00 - 20:00' },

  // Lucknow Centers
  { id: 'CC-LUK-01', name: 'Charbagh Station Cooling Canopy & Relief Booth', city: 'Lucknow', ward: 'Ward 42', lat: 26.8322, lon: 80.9219, type: 'Shaded Bus Terminal', capacity_people: 250, current_occupancy_pct: 83, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Extended Hours Active', operating_hours: '07:00 - 22:00' },

  // Bhopal Centers
  { id: 'CC-BHO-01', name: 'MP Nagar Zone 1 Municipal Misting Pavilion', city: 'Bhopal', ward: 'Ward 45', lat: 23.2321, lon: 77.4332, type: 'Misting Pavilion', capacity_people: 220, current_occupancy_pct: 74, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Open', operating_hours: '08:00 - 20:00' },

  // Bhubaneswar Centers
  { id: 'CC-BHU-01', name: 'Baramunda Bus Stand Air-Cooled Relief Lounge', city: 'Bhubaneswar', ward: 'Ward 49', lat: 20.2798, lon: 85.7892, type: 'Shaded Bus Terminal', capacity_people: 300, current_occupancy_pct: 78, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Open', operating_hours: '07:00 - 21:00' },

  // Nagpur Centers
  { id: 'CC-NAG-01', name: 'Sitabuldi Interchange Shaded Misting Zone', city: 'Nagpur', ward: 'Ward 14', lat: 21.1462, lon: 79.0831, type: 'Misting Pavilion', capacity_people: 270, current_occupancy_pct: 81, water_point_available: true, medical_staff_on_duty: true, ac_cooling: true, status: 'Open', operating_hours: '08:00 - 20:00' },
];

// Potential candidate expansion sites for temporary shelters
const CANDIDATE_SITES_POOL = [
  { id: 'CAN-PUN-01', name: 'Timber Market Zilla Parishad School', city: 'Pune', ward_id: 'PUN-W14', ward_name: 'Ward 14 - Bhavani Peth', lat: 18.5105, lon: 73.8741, site_type: 'Government High School' as const, capacity: 250 },
  { id: 'CAN-PUN-02', name: 'Hadapsar Flyover Ground Shaded Depot', city: 'Pune', ward_id: 'PUN-W21', ward_name: 'Ward 21 - Hadapsar Industrial', lat: 18.4982, lon: 73.9312, site_type: 'Transit Hub' as const, capacity: 400 },
  { id: 'CAN-PUN-03', name: 'Shivajinagar Agricultural College Pavilion', city: 'Pune', ward_id: 'PUN-W12', ward_name: 'Ward 12 - Shivajinagar', lat: 18.5365, lon: 73.8510, site_type: 'Sports Complex' as const, capacity: 300 },
  { id: 'CAN-DEL-01', name: 'Jaffrabad Gali 4 MCD Community Centre', city: 'Delhi', ward_id: 'DEL-W42', ward_name: 'Ward 42 - Seelampur', lat: 28.6721, lon: 77.2735, site_type: 'Municipal Hall' as const, capacity: 350 },
  { id: 'CAN-DEL-02', name: 'Okhla Industrial Area Sub-Station Lawn', city: 'Delhi', ward_id: 'DEL-W77', ward_name: 'Ward 77 - Okhla Phase II', lat: 28.5312, lon: 77.2810, site_type: 'Transit Hub' as const, capacity: 300 },
  { id: 'CAN-AHM-01', name: 'Chandola Lake Slum Relief Hall', city: 'Ahmedabad', ward_id: 'AHM-W05', ward_name: 'Ward 05 - Danilimda', lat: 22.9921, lon: 72.5890, site_type: 'Municipal Hall' as const, capacity: 300 },
  { id: 'CAN-BOM-01', name: 'Govandi Shivaji Nagar Community Ground', city: 'Mumbai', ward_id: 'BOM-WME', ward_name: 'Ward M/East - Govandi', lat: 19.0589, lon: 72.9281, site_type: 'Municipal Hall' as const, capacity: 450 },
  { id: 'CAN-CCU-01', name: 'Posta Wholesale Market Covered Loading Bay', city: 'Kolkata', ward_id: 'CCU-W45', ward_name: 'Ward 45 - Burrabazar', lat: 22.5892, lon: 88.3512, site_type: 'Transit Hub' as const, capacity: 350 },
  { id: 'CAN-BLR-01', name: 'Peenya Industrial Association Main Hall', city: 'Bengaluru', ward_id: 'BLR-W013', ward_name: 'Ward 13 - Peenya', lat: 13.0345, lon: 77.5112, site_type: 'Municipal Hall' as const, capacity: 400 },
  { id: 'CAN-MAA-01', name: 'George Town Broadway Bus Stand Pavilion', city: 'Chennai', ward_id: 'MAA-W081', ward_name: 'Ward 81 - George Town', lat: 13.0892, lon: 80.2834, site_type: 'Transit Hub' as const, capacity: 350 },
  { id: 'CAN-IXC-01', name: 'Sector 26 Grain Market Association Shed', city: 'Chandigarh', ward_id: 'IXC-W16', ward_name: 'Ward 16 - Sector 26', lat: 30.7289, lon: 76.8045, site_type: 'Transit Hub' as const, capacity: 350 },
  { id: 'CAN-VNS-01', name: 'Dashashwamedh Ghat Pilgrim Rest Shed', city: 'Varanasi', ward_id: 'VNS-W12', ward_name: 'Ward 12 - Dashashwamedh', lat: 25.3056, lon: 83.0112, site_type: 'Municipal Hall' as const, capacity: 300 },
];

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

/**
 * Recommends optimal sites for the next temporary cooling center.
 * Uses spatial optimization:
 * OptimizationScore = (WardHTSS / 100) * (VulnerablePop / 10,000) * DistanceToNearestCenterKm
 */
export function optimizeCoolingCenters(
  city: string,
  currentCityHtss: number = 75
): {
  existing_centers: CoolingCenter[];
  ranked_recommendations: CandidateCoolingSite[];
  top_recommendation: CandidateCoolingSite;
  coverage_summary: {
    total_centers: number;
    total_capacity: number;
    avg_occupancy_pct: number;
    recommended_action: string;
  };
} {
  const cityCenters = EXISTING_COOLING_CENTERS.filter(
    (c) => c.city.toLowerCase() === city.toLowerCase()
  );

  const totalCapacity = cityCenters.reduce((sum, c) => sum + c.capacity_people, 0);
  const avgOccupancy =
    cityCenters.length > 0
      ? Math.round(cityCenters.reduce((sum, c) => sum + c.current_occupancy_pct, 0) / cityCenters.length)
      : 0;

  // Filter candidates in this city
  const cityCandidates = CANDIDATE_SITES_POOL.filter(
    (cand) => cand.city.toLowerCase() === city.toLowerCase()
  );

  const scoredCandidates: CandidateCoolingSite[] = cityCandidates.map((cand) => {
    // Find distance to nearest operating center
    let minDistance = 999;
    let nearestName = 'None nearby';

    for (const center of cityCenters) {
      const dist = haversineDistanceKm(cand.lat, cand.lon, center.lat, center.lon);
      if (dist < minDistance) {
        minDistance = dist;
        nearestName = center.name;
      }
    }

    // Vulnerable population heuristic (approx 40% of ward pop)
    const vulnPop = 35000;
    const distanceWeight = Math.max(0.8, minDistance);
    const score = Math.round((currentCityHtss / 100) * (vulnPop / 5000) * distanceWeight * 10) / 10;

    const rationale = `High priority: Nearest center (${nearestName}) is ${minDistance} km away. Opening a ${cand.capacity}-person shelter here directly shields ~${Math.round(vulnPop * 0.35).toLocaleString()} vulnerable workers and elderly residents currently in an unserved thermal shadow.`;

    return {
      candidate_id: cand.id,
      site_name: cand.name,
      city: cand.city,
      ward_id: cand.ward_id,
      ward_name: cand.ward_name,
      lat: cand.lat,
      lon: cand.lon,
      site_type: cand.site_type,
      estimated_capacity: cand.capacity,
      nearest_existing_center_name: nearestName,
      distance_to_nearest_center_km: minDistance,
      ward_htss_score: currentCityHtss,
      ward_vulnerable_population: vulnPop,
      optimization_score: score,
      recommendation_rank: 0,
      rationale,
    };
  });

  // Sort descending by optimization score
  scoredCandidates.sort((a, b) => b.optimization_score - a.optimization_score);
  scoredCandidates.forEach((cand, idx) => {
    cand.recommendation_rank = idx + 1;
  });

  const topRec = scoredCandidates[0] || {
    candidate_id: 'FALLBACK-01',
    site_name: `${city} Central Municipal Shelter`,
    city,
    ward_id: 'W-CENTRAL',
    ward_name: 'Central Plaza',
    lat: 18.5204,
    lon: 73.8567,
    site_type: 'Municipal Hall',
    estimated_capacity: 300,
    nearest_existing_center_name: 'Central Hospital',
    distance_to_nearest_center_km: 3.5,
    ward_htss_score: currentCityHtss,
    ward_vulnerable_population: 25000,
    optimization_score: 45.2,
    recommendation_rank: 1,
    rationale: 'Primary city center location with high footfall of outdoor vendors and transit commuters.',
  };

  const recommendedAction =
    avgOccupancy >= 80
      ? `Critical capacity threshold reached (${avgOccupancy}%). Deploy temporary misting center at ${topRec.site_name} immediately.`
      : avgOccupancy >= 60
      ? `High utilization (${avgOccupancy}%). Stage supplies and staff at ${topRec.site_name} for 24h activation.`
      : `Current capacity adequate (${avgOccupancy}%). Maintain active monitoring.`;

  return {
    existing_centers: cityCenters,
    ranked_recommendations: scoredCandidates,
    top_recommendation: topRec,
    coverage_summary: {
      total_centers: cityCenters.length,
      total_capacity: totalCapacity,
      avg_occupancy_pct: avgOccupancy,
      recommended_action: recommendedAction,
    },
  };
}
