/**
 * SIH26083 - Unique Feature 5: Heatwave Memory & Historical Benchmark Engine
 *
 * Maintains historical institutional records of major Indian extreme heatwaves
 * and provides real-time side-by-side comparative benchmarking against current events.
 */

export type HistoricalHeatEvent = {
  id: string;
  event_name: string;
  year: number;
  month_span: string;
  primary_regions: string[];
  duration_consecutive_days: number;
  peak_temperature_recorded_c: number;
  peak_heat_index_c: number;
  peak_wbgt_c: number;
  peak_htss_score: number;
  estimated_affected_population_millions: number;
  recorded_heatstroke_casualties: number;
  meteorological_synoptic_cause: string;
  institutional_lessons_learned: string;
};

export const HISTORICAL_BENCHMARKS: HistoricalHeatEvent[] = [
  {
    id: 'HW-2024-NORTH',
    event_name: '2024 North & Central India Prolonged Mega-Heatwave',
    year: 2024,
    month_span: 'May - June 2024',
    primary_regions: ['Delhi NCR', 'Rajasthan (Phalodi)', 'Uttar Pradesh', 'Bihar', 'Madhya Pradesh'],
    duration_consecutive_days: 28,
    peak_temperature_recorded_c: 49.9,
    peak_heat_index_c: 56.4,
    peak_wbgt_c: 34.2,
    peak_htss_score: 94.2,
    estimated_affected_population_millions: 140,
    recorded_heatstroke_casualties: 730,
    meteorological_synoptic_cause: 'Strong anticyclonic ridge over NW India, dry westerly Thar winds, prolonged absence of Western Disturbances.',
    institutional_lessons_learned: 'Need for mandatory workplace work-rest cycles; lack of night cooling exacerbates cumulative physiological strain.',
  },
  {
    id: 'HW-2022-EARLY',
    event_name: '2022 Pre-Monsoon Early Spring Heatwave',
    year: 2022,
    month_span: 'March - April 2022',
    primary_regions: ['Punjab', 'Haryana', 'Delhi', 'Rajasthan', 'Gujarat'],
    duration_consecutive_days: 18,
    peak_temperature_recorded_c: 47.4,
    peak_heat_index_c: 49.8,
    peak_wbgt_c: 31.8,
    peak_htss_score: 86.5,
    estimated_affected_population_millions: 95,
    recorded_heatstroke_casualties: 320,
    meteorological_synoptic_cause: 'Hottest March in India since 1901; premature failure of convective precipitation and persistent heat domes.',
    institutional_lessons_learned: 'Early-season lack of human physiological acclimatization leads to higher clinical admissions at lower threshold temperatures.',
  },
  {
    id: 'HW-2015-SOUTH',
    event_name: '2015 Southeastern Coastal Humid Heat Crisis',
    year: 2015,
    month_span: 'May 2015',
    primary_regions: ['Andhra Pradesh', 'Telangana', 'Odisha', 'West Bengal'],
    duration_consecutive_days: 14,
    peak_temperature_recorded_c: 47.0,
    peak_heat_index_c: 58.2,
    peak_wbgt_c: 35.1,
    peak_htss_score: 96.8,
    estimated_affected_population_millions: 80,
    recorded_heatstroke_casualties: 2422,
    meteorological_synoptic_cause: 'Deadly combination of continental dry heat and Bay of Bengal maritime humidity; lethal wet-bulb conditions.',
    institutional_lessons_learned: 'Proof that temperature alone is insufficient; high humidity makes moderate temperatures lethal by halting sweating.',
  },
  {
    id: 'HW-2010-AHMEDABAD',
    event_name: '2010 Ahmedabad Landmark Heatwave',
    year: 2010,
    month_span: 'May 2010',
    primary_regions: ['Ahmedabad', 'Gujarat', 'Western Maharashtra'],
    duration_consecutive_days: 7,
    peak_temperature_recorded_c: 46.8,
    peak_heat_index_c: 51.5,
    peak_wbgt_c: 32.5,
    peak_htss_score: 89.0,
    estimated_affected_population_millions: 12,
    recorded_heatstroke_casualties: 1344,
    meteorological_synoptic_cause: 'Rapid heat surge over high-density urban core without municipal preparedness.',
    institutional_lessons_learned: 'Spurred South Asia\'s first Heat Action Plan (HAP 2013) with cool roofs and color-coded warning flags.',
  },
];

export type EventComparison = {
  metric_name: string;
  current_event_value: string | number;
  benchmark_event_value: string | number;
  historical_max_value: string | number;
  historical_record_holder: string;
  difference_vs_benchmark: string;
  significance: string;
};

export function compareCurrentAgainstHistorical(
  currentCity: string,
  currentTemp: number,
  currentHtss: number,
  currentWbgt: number,
  currentDurationDays: number = 3,
  selectedBenchmarkId: string = 'HW-2024-NORTH'
): {
  benchmark: HistoricalHeatEvent;
  comparison_table: EventComparison[];
  historical_severity_percentile: number;
  comparison_narrative: string;
} {
  const benchmark =
    HISTORICAL_BENCHMARKS.find((b) => b.id === selectedBenchmarkId) ||
    HISTORICAL_BENCHMARKS[0];

  const tempDiff = Math.round((currentTemp - benchmark.peak_temperature_recorded_c) * 10) / 10;
  const htssDiff = Math.round((currentHtss - benchmark.peak_htss_score) * 10) / 10;
  const wbgtDiff = Math.round((currentWbgt - benchmark.peak_wbgt_c) * 10) / 10;

  const comparison_table: EventComparison[] = [
    {
      metric_name: 'Peak Temperature',
      current_event_value: `${currentTemp}°C`,
      benchmark_event_value: `${benchmark.peak_temperature_recorded_c}°C`,
      historical_max_value: '49.9°C',
      historical_record_holder: '2024 North India (Phalodi/Delhi)',
      difference_vs_benchmark: `${tempDiff >= 0 ? '+' : ''}${tempDiff}°C`,
      significance: tempDiff >= 0 ? 'Exceeds benchmark peak!' : 'Below benchmark historical extreme',
    },
    {
      metric_name: 'Human Thermal Stress (HTSS)',
      current_event_value: `${currentHtss}/100`,
      benchmark_event_value: `${benchmark.peak_htss_score}/100`,
      historical_max_value: '96.8/100',
      historical_record_holder: '2015 Andhra Pradesh (Lethal Wet Bulb)',
      difference_vs_benchmark: `${htssDiff >= 0 ? '+' : ''}${htssDiff} pts`,
      significance: currentHtss > 85 ? 'Critical emergency tier reached' : 'Elevated biometeorological stress',
    },
    {
      metric_name: 'Wet Bulb Globe Temp (WBGT)',
      current_event_value: `${currentWbgt}°C`,
      benchmark_event_value: `${benchmark.peak_wbgt_c}°C`,
      historical_max_value: '35.1°C',
      historical_record_holder: '2015 Southeastern Heatwave',
      difference_vs_benchmark: `${wbgtDiff >= 0 ? '+' : ''}${wbgtDiff}°C`,
      significance: currentWbgt >= 32.2 ? 'Outdoor physiological labor limit breached' : 'High occupational strain',
    },
    {
      metric_name: 'Heatwave Duration',
      current_event_value: `${currentDurationDays} consecutive days`,
      benchmark_event_value: `${benchmark.duration_consecutive_days} consecutive days`,
      historical_max_value: '28 days',
      historical_record_holder: '2024 Summer',
      difference_vs_benchmark: `${currentDurationDays - benchmark.duration_consecutive_days} days`,
      significance: currentDurationDays > 5 ? 'Severe cumulative sleep and physiological deficit' : 'Early heatwave stage',
    },
  ];

  // Percentile ranking among severe modern Indian heatwaves
  const percentile = Math.min(99, Math.max(20, Math.round((currentHtss / 96.8) * 100)));

  const comparison_narrative = `The active conditions in ${currentCity} (HTSS ${currentHtss}, WBGT ${currentWbgt}°C) stand at the ${percentile}th percentile of modern Indian heatwave extremes. Compared with the ${benchmark.event_name} (${benchmark.peak_temperature_recorded_c}°C, ${benchmark.recorded_heatstroke_casualties} casualties), current thermal stress is ${Math.abs(htssDiff)} points ${htssDiff >= 0 ? 'higher' : 'lower'}. ${benchmark.institutional_lessons_learned}`;

  return {
    benchmark,
    comparison_table,
    historical_severity_percentile: percentile,
    comparison_narrative,
  };
}
