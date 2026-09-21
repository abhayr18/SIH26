import {
  MODEL_INFO,
  predictHeatRisk,
  type ModelContribution,
} from '@/lib/ml-model';

export { MODEL_INFO } from '@/lib/ml-model';
import { indiaForecastTime, nearestForecast } from '@/lib/forecast-time';
import {
  fetchMetNorwayForecast,
  fetchModelMeanForecast,
} from '@/lib/weather-ensemble';
import {
  generateThermalStressActionPlan,
  type RecommendedActionPlan,
} from '@/lib/action-engine';

export type { RecommendedActionPlan } from '@/lib/action-engine';

export type Risk = 'Low' | 'Moderate' | 'High' | 'Extreme' | 'Emergency';

export type DistrictConfig = {
  district: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
  fallbackTemp: number;
  fallbackHumidity: number;
};

export const DISTRICTS: DistrictConfig[] = [
  {
    district: 'Delhi',
    lat: 28.6139,
    lon: 77.209,
    x: 144,
    y: 75,
    fallbackTemp: 42.1,
    fallbackHumidity: 39,
  },
  {
    district: 'Jaipur',
    lat: 26.9124,
    lon: 75.7873,
    x: 120,
    y: 91,
    fallbackTemp: 43.6,
    fallbackHumidity: 31,
  },
  {
    district: 'Ahmedabad',
    lat: 23.0225,
    lon: 72.5714,
    x: 96,
    y: 118,
    fallbackTemp: 41.3,
    fallbackHumidity: 37,
  },
  {
    district: 'Nagpur',
    lat: 21.1458,
    lon: 79.0882,
    x: 165,
    y: 148,
    fallbackTemp: 41.1,
    fallbackHumidity: 35,
  },
  {
    district: 'Hyderabad',
    lat: 17.385,
    lon: 78.4867,
    x: 162,
    y: 184,
    fallbackTemp: 39.4,
    fallbackHumidity: 47,
  },
  {
    district: 'Patna',
    lat: 25.5941,
    lon: 85.1376,
    x: 208,
    y: 104,
    fallbackTemp: 40.2,
    fallbackHumidity: 58,
  },
  {
    district: 'Lucknow',
    lat: 26.8467,
    lon: 80.9462,
    x: 178,
    y: 91,
    fallbackTemp: 38.6,
    fallbackHumidity: 51,
  },
  {
    district: 'Bhopal',
    lat: 23.2599,
    lon: 77.4126,
    x: 150,
    y: 130,
    fallbackTemp: 38.8,
    fallbackHumidity: 44,
  },
  {
    district: 'Bhubaneswar',
    lat: 20.2961,
    lon: 85.8245,
    x: 215,
    y: 154,
    fallbackTemp: 37.4,
    fallbackHumidity: 66,
  },
  {
    district: 'Chandigarh',
    lat: 30.7333,
    lon: 76.7794,
    x: 142,
    y: 60,
    fallbackTemp: 38.1,
    fallbackHumidity: 39,
  },
  {
    district: 'Varanasi',
    lat: 25.3176,
    lon: 82.9739,
    x: 195,
    y: 100,
    fallbackTemp: 40.3,
    fallbackHumidity: 54,
  },
  {
    district: 'Kolkata',
    lat: 22.5726,
    lon: 88.3639,
    x: 239,
    y: 137,
    fallbackTemp: 37.6,
    fallbackHumidity: 68,
  },
  {
    district: 'Mumbai',
    lat: 19.076,
    lon: 72.8777,
    x: 112,
    y: 171,
    fallbackTemp: 35.4,
    fallbackHumidity: 70,
  },
  {
    district: 'Pune',
    lat: 18.5204,
    lon: 73.8567,
    x: 122,
    y: 178,
    fallbackTemp: 36.7,
    fallbackHumidity: 51,
  },
  {
    district: 'Bengaluru',
    lat: 12.9716,
    lon: 77.5946,
    x: 150,
    y: 235,
    fallbackTemp: 34.1,
    fallbackHumidity: 48,
  },
  {
    district: 'Chennai',
    lat: 13.0827,
    lon: 80.2707,
    x: 176,
    y: 232,
    fallbackTemp: 38.2,
    fallbackHumidity: 65,
  },
];

const actions: Record<Risk, string> = {
  Low: 'Continue routine monitoring and hydration messaging.',
  Moderate: 'Increase public advisories and check vulnerable residents.',
  High: 'Open cooling spaces, adjust outdoor work and alert health teams.',
  Extreme:
    'Activate district heat action plans and targeted outreach immediately.',
  Emergency:
    'Escalate emergency response, suspend unsafe exposure and mobilize medical support.',
};

export function riskFor(score: number): Risk {
  if (score >= 85) return 'Emergency';
  if (score >= 70) return 'Extreme';
  if (score >= 55) return 'High';
  if (score >= 38) return 'Moderate';
  return 'Low';
}

export function heatIndex(tempC: number, humidity: number) {
  const t = (tempC * 9) / 5 + 32;
  const r = humidity;
  const hi =
    -42.379 +
    2.04901523 * t +
    10.14333127 * r -
    0.22475541 * t * r -
    0.00683783 * t * t -
    0.05481717 * r * r +
    0.00122874 * t * t * r +
    0.00085282 * t * r * r -
    0.00000199 * t * t * r * r;
  return Number((((hi - 32) * 5) / 9).toFixed(1));
}

function wetBulb(tempC: number, humidity: number) {
  const value =
    tempC * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659)) +
    Math.atan(tempC + humidity) -
    Math.atan(humidity - 1.676331) +
    0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity) -
    4.686035;
  return value;
}

export function computeHtsi(input: {
  temp: number;
  humidity: number;
  wind?: number;
  uv?: number;
  solar?: number;
  aqi?: number;
  multiplier?: number;
}) {
  const wind = input.wind ?? 1.6;
  const uv = input.uv ?? 7;
  const solar = input.solar ?? 650;
  const aqi = input.aqi ?? 85;
  const wbgt =
    0.7 * wetBulb(input.temp, input.humidity) +
    0.2 * (input.temp + solar / 180) +
    0.1 * input.temp;
  const hi = heatIndex(input.temp, input.humidity);
  const pet = input.temp + input.humidity * 0.035 + solar / 240 - wind * 0.7;
  const thermal = Math.max(0, Math.min(100, (wbgt - 18) * 5.25));
  const humidityStress = Math.max(
    0,
    Math.min(18, (input.humidity - 35) * 0.34),
  );
  const radiantStress = Math.max(0, Math.min(14, solar / 75));
  const uvStress = Math.max(0, Math.min(10, uv * 0.95));
  const airStress = Math.max(0, Math.min(8, (aqi - 40) / 16));
  const windRelief = Math.min(9, wind * 1.7);
  const raw =
    thermal * 0.66 +
    humidityStress +
    radiantStress +
    uvStress +
    airStress -
    windRelief;
  const score = Math.max(0, Math.min(100, raw * (input.multiplier ?? 1)));
  const htsi = Number(score.toFixed(1));
  const risk = riskFor(htsi);
  const actionPlan = generateThermalStressActionPlan({
    temp: input.temp,
    humidity: input.humidity,
    wind,
    solar,
    wbgt: Number(wbgt.toFixed(1)),
    heat_index: hi,
    pet: Number(pet.toFixed(1)),
    htsi,
    risk,
  });
  return {
    htsi,
    risk,
    wbgt: Number(wbgt.toFixed(1)),
    heat_index: hi,
    pet: Number(pet.toFixed(1)),
    action: actionPlan.summary,
    action_plan: actionPlan,
  };
}

function modelFields(
  config: DistrictConfig,
  input: {
    temp: number;
    humidity: number;
    wind: number;
    solar: number;
    timestamp: string | Date;
  },
) {
  const prediction = predictHeatRisk({
    temperature_c: input.temp,
    humidity_pct: input.humidity,
    wind_speed_ms: input.wind,
    shortwave_radiation_wm2: input.solar,
    latitude: config.lat,
    longitude: config.lon,
    timestamp: input.timestamp,
  });
  const actionPlan = generateThermalStressActionPlan({
    temp: input.temp,
    humidity: input.humidity,
    wind: input.wind,
    solar: input.solar,
    district: config.district,
    risk: prediction.predicted_class as Risk,
    htsi: Math.round(prediction.high_risk_probability_pct),
  });
  return {
    risk: prediction.predicted_class as Risk,
    probability: Math.round(prediction.confidence_pct),
    model_confidence: prediction.confidence_pct,
    high_risk_probability: prediction.high_risk_probability_pct,
    probabilities: prediction.probabilities,
    explanation: prediction.explanation as ModelContribution[],
    model_version: MODEL_INFO.model_version,
    action: actionPlan.summary,
    action_plan: actionPlan,
  };
}

function fallbackDistrict(config: DistrictConfig) {
  const timestamp = new Date();
  const hour = Number(
    new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(timestamp),
  );
  const solar = hour >= 7 && hour <= 18 ? 650 : 10;
  const result = computeHtsi({
    temp: config.fallbackTemp,
    humidity: config.fallbackHumidity,
    wind: 1.7,
    solar,
  });
  return {
    ...config,
    temp: config.fallbackTemp,
    humidity: config.fallbackHumidity,
    wind: 1.7,
    uv: 7.4,
    solar,
    aqi: 85,
    source: 'resilient-fallback',
    ...result,
    ...modelFields(config, {
      temp: config.fallbackTemp,
      humidity: config.fallbackHumidity,
      wind: 1.7,
      solar,
      timestamp,
    }),
  };
}

export async function fetchCurrentDistrict(
  config: DistrictConfig,
  metNorwayOnly = false,
) {
  try {
    if (metNorwayOnly) throw new Error('use MET Norway bulk path');
    const params = new URLSearchParams({
      latitude: String(config.lat),
      longitude: String(config.lon),
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,uv_index,shortwave_radiation',
      timezone: 'Asia/Kolkata',
    });
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
      { headers: { 'User-Agent': 'ThermoWatch-SIH26083/3.0' } },
    );
    if (!response.ok) throw new Error('weather unavailable');
    const payload = (await response.json()) as {
      current?: Record<string, number>;
    };
    const current = payload.current ?? {};
    const temp = Number(current.temperature_2m ?? config.fallbackTemp);
    const humidity = Number(
      current.relative_humidity_2m ?? config.fallbackHumidity,
    );
    const wind = Number(current.wind_speed_10m ?? 6) / 3.6;
    const uv = Number(current.uv_index ?? 6.5);
    const timestamp = new Date();
    const hour = Number(
      new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        hourCycle: 'h23',
      }).format(timestamp),
    );
    const solar = Number(
      current.shortwave_radiation ?? (hour >= 7 && hour <= 18 ? 680 : 10),
    );
    const result = computeHtsi({ temp, humidity, wind, uv, solar });
    return {
      ...config,
      temp: Number(temp.toFixed(1)),
      humidity: Math.round(humidity),
      wind: Number(wind.toFixed(1)),
      uv: Number(uv.toFixed(1)),
      solar: Number(solar.toFixed(1)),
      aqi: 85,
      source: 'open-meteo',
      ...result,
      ...modelFields(config, {
        temp,
        humidity,
        wind,
        solar,
        timestamp,
      }),
    };
  } catch {
    try {
      const points = await fetchMetNorwayForecast({
        latitude: config.lat,
        longitude: config.lon,
      });
      const point = nearestForecast(points, 0);
      const timestamp = new Date(point.time);
      const hour = Number(
        new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          hourCycle: 'h23',
        }).format(timestamp),
      );
      const solar =
        point.shortwave_radiation_wm2 || (hour >= 7 && hour <= 18 ? 650 : 10);
      const thermal = computeHtsi({
        temp: point.temperature_c,
        humidity: point.humidity_pct,
        wind: point.wind_speed_ms,
        solar,
      });
      return {
        ...config,
        temp: Number(point.temperature_c.toFixed(1)),
        humidity: Math.round(point.humidity_pct),
        wind: Number(point.wind_speed_ms.toFixed(1)),
        uv: Number((solar / 95).toFixed(1)),
        solar: Number(solar.toFixed(1)),
        aqi: 85,
        source: 'met-norway-live-forecast',
        ...thermal,
        ...modelFields(config, {
          temp: point.temperature_c,
          humidity: point.humidity_pct,
          wind: point.wind_speed_ms,
          solar,
          timestamp,
        }),
      };
    } catch {
      return fallbackDistrict(config);
    }
  }
}

let currentDistrictCache:
  | {
      expiresAt: number;
      data: Awaited<ReturnType<typeof fetchCurrentDistrict>>[];
    }
  | undefined;
let currentDistrictRequest:
  | Promise<Awaited<ReturnType<typeof fetchCurrentDistrict>>[]>
  | undefined;

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const index = nextIndex++;
        results[index] = await mapper(items[index]);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

export async function fetchAllDistricts() {
  if (currentDistrictCache && currentDistrictCache.expiresAt > Date.now())
    return currentDistrictCache.data;
  if (currentDistrictRequest) return currentDistrictRequest;
  // Limit provider concurrency so one dashboard request does not look like a
  // 30-request burst and trigger upstream rate limiting.
  currentDistrictRequest = mapWithConcurrency(
    DISTRICTS,
    10,
    (config) => fetchCurrentDistrict(config, true),
  );
  try {
    const data = await currentDistrictRequest;
    currentDistrictCache = { expiresAt: Date.now() + 5 * 60_000, data };
    return data;
  } finally {
    currentDistrictRequest = undefined;
  }
}

export type ForecastLayerPoint = DistrictConfig & {
  horizon_hours: 24 | 48 | 72;
  valid_at: string;
  temp: number;
  humidity: number;
  wind: number;
  uv: number;
  solar: number;
  htsi: number;
  risk: Risk;
  probability: number;
  model_confidence: number;
  high_risk_probability: number;
  source: string;
  model_version: string;
};

async function fetchDistrictForecastLayers(
  config: DistrictConfig,
  metNorwayOnly = false,
) {
  const horizons = [24, 48, 72] as const;
  try {
    if (metNorwayOnly) throw new Error('use MET Norway bulk path');
    const params = new URLSearchParams({
      latitude: String(config.lat),
      longitude: String(config.lon),
      hourly:
        'temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,shortwave_radiation',
      timezone: 'Asia/Kolkata',
      forecast_days: '5',
    });
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
      { headers: { 'User-Agent': 'ThermoWatch-SIH26083/4.0' } },
    );
    if (!response.ok) throw new Error('forecast layer unavailable');
    const payload = (await response.json()) as {
      hourly: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        wind_speed_10m: number[];
        uv_index: number[];
        shortwave_radiation: number[];
      };
    };
    const targetNow = Date.now();
    return horizons.map((horizon) => {
      const target = targetNow + horizon * 3_600_000;
      let index = 0;
      let distance = Number.POSITIVE_INFINITY;
      payload.hourly.time.forEach((time, position) => {
        const timestamp = new Date(`${time}+05:30`).getTime();
        const candidate = Math.abs(timestamp - target);
        if (candidate < distance) {
          index = position;
          distance = candidate;
        }
      });
      const time = payload.hourly.time[index];
      const temp = payload.hourly.temperature_2m[index];
      const humidity = payload.hourly.relative_humidity_2m[index];
      const wind = payload.hourly.wind_speed_10m[index] / 3.6;
      const solar = payload.hourly.shortwave_radiation[index] ?? 0;
      const uv = payload.hourly.uv_index[index] ?? solar / 95;
      const thermal = computeHtsi({ temp, humidity, wind, solar, uv });
      const prediction = modelFields(config, {
        temp,
        humidity,
        wind,
        solar,
        timestamp: time,
      });
      return {
        ...config,
        horizon_hours: horizon,
        valid_at: time,
        temp: Number(temp.toFixed(1)),
        humidity: Math.round(humidity),
        wind: Number(wind.toFixed(1)),
        uv: Number(uv.toFixed(1)),
        solar: Number(solar.toFixed(1)),
        source: 'open-meteo',
        ...thermal,
        ...prediction,
      } as ForecastLayerPoint;
    });
  } catch {
    try {
      const points = await fetchMetNorwayForecast({
        latitude: config.lat,
        longitude: config.lon,
      });
      return horizons.map((horizon) => {
        const point = nearestForecast(points, horizon);
        const solar = point.shortwave_radiation_wm2;
        const uv = solar / 95;
        const thermal = computeHtsi({
          temp: point.temperature_c,
          humidity: point.humidity_pct,
          wind: point.wind_speed_ms,
          solar,
          uv,
        });
        const prediction = modelFields(config, {
          temp: point.temperature_c,
          humidity: point.humidity_pct,
          wind: point.wind_speed_ms,
          solar,
          timestamp: point.time,
        });
        return {
          ...config,
          horizon_hours: horizon,
          valid_at: point.time,
          temp: Number(point.temperature_c.toFixed(1)),
          humidity: Math.round(point.humidity_pct),
          wind: Number(point.wind_speed_ms.toFixed(1)),
          uv: Number(uv.toFixed(1)),
          solar: Number(solar.toFixed(1)),
          source: 'met-norway-live-forecast',
          ...thermal,
          ...prediction,
        } as ForecastLayerPoint;
      });
    } catch {
      return horizons.map((horizon) => {
        const timestamp = new Date(Date.now() + horizon * 3_600_000);
        const hour = Number(
          new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            hourCycle: 'h23',
          }).format(timestamp),
        );
        const solar = hour >= 7 && hour <= 18 ? 620 : 10;
        const temp = config.fallbackTemp - (hour < 9 || hour > 19 ? 6 : 0);
        const humidity = config.fallbackHumidity + (hour < 8 ? 10 : 0);
        const wind = 1.7;
        const thermal = computeHtsi({ temp, humidity, wind, solar });
        const prediction = modelFields(config, {
          temp,
          humidity,
          wind,
          solar,
          timestamp,
        });
        return {
          ...config,
          horizon_hours: horizon,
          valid_at: timestamp.toISOString(),
          temp: Number(temp.toFixed(1)),
          humidity: Math.round(humidity),
          wind,
          uv: Number((solar / 95).toFixed(1)),
          solar,
          source: 'resilient-fallback',
          ...thermal,
          ...prediction,
        } as ForecastLayerPoint;
      });
    }
  }
}

export async function fetchAllForecastLayers() {
  const districtLayers = await mapWithConcurrency(
    DISTRICTS,
    10,
    (config) => fetchDistrictForecastLayers(config, true),
  );
  return {
    24: districtLayers.map((layers) => layers[0]),
    48: districtLayers.map((layers) => layers[1]),
    72: districtLayers.map((layers) => layers[2]),
  };
}

export async function fetchDistrictForecast(name: string) {
  const config =
    DISTRICTS.find(
      (item) => item.district.toLowerCase() === name.toLowerCase(),
    ) ?? DISTRICTS[0];
  const current = await fetchCurrentDistrict(config);
  try {
    let liveSource = 'open-meteo-live-ensemble';
    let ensembleMetadata:
      | {
          systems: string[];
          requested_forecasts: number;
          available_forecasts: number;
          method: string;
        }
      | undefined;
    let ensemblePoints: Awaited<ReturnType<typeof fetchModelMeanForecast>>;
    try {
      ensemblePoints = await fetchModelMeanForecast({
        latitude: config.lat,
        longitude: config.lon,
      });
      ensembleMetadata = {
        systems: ['ECMWF IFS', 'DWD ICON'],
        requested_forecasts: 10,
        available_forecasts: ensemblePoints[0]?.model_count ?? 0,
        method: 'arithmetic mean of valid time-aligned ensemble forecasts',
      };
    } catch {
      ensemblePoints = await fetchMetNorwayForecast({
        latitude: config.lat,
        longitude: config.lon,
      });
      liveSource = 'met-norway-live-forecast';
    }
    const ensembleForecast = ensemblePoints.map((point) => {
      const temp = point.temperature_c;
      const humidity = point.humidity_pct;
      const wind = point.wind_speed_ms;
      const solar = point.shortwave_radiation_wm2;
      const uv = solar / 95;
      const result = computeHtsi({ temp, humidity, wind, uv, solar });
      return {
        time: indiaForecastTime(point.time),
        label: new Date(indiaForecastTime(point.time)).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          weekday: 'short',
          hour: 'numeric',
        }),
        temp: Number(temp.toFixed(1)),
        humidity: Math.round(humidity),
        wind: Number(wind.toFixed(1)),
        uv: Number(uv.toFixed(1)),
        solar: Number(solar.toFixed(1)),
        model_count: point.model_count,
        requested_model_count: point.requested_model_count,
        temperature_spread_c: Number(point.temperature_spread_c.toFixed(2)),
        ...result,
        ...modelFields(config, {
          temp,
          humidity,
          wind,
          solar,
          timestamp: point.time,
        }),
      };
    });
    const forecast = ensembleForecast.filter(
      (point, index) => index % 3 === 0 && Date.parse(point.time) >= Date.now(),
    );
    if (!forecast.length)
      throw new Error('ensemble forecast has no future points');
    const nearestCurrent = [...ensembleForecast].sort(
      (a, b) =>
        Math.abs(Date.parse(a.time) - Date.now()) -
        Math.abs(Date.parse(b.time) - Date.now()),
    )[0];
    const ensembleCurrent = {
      ...current,
      ...nearestCurrent,
      district: config.district,
      lat: config.lat,
      lon: config.lon,
      x: config.x,
      y: config.y,
      fallbackTemp: config.fallbackTemp,
      fallbackHumidity: config.fallbackHumidity,
      source: liveSource,
    };
    const horizons = [24, 48, 72].map((hours) => {
      const item = nearestForecast(forecast, hours);
      return {
        horizon_hours: hours,
        predicted_class: item.risk,
        probability: item.model_confidence,
        high_risk_probability: item.high_risk_probability,
        htsi: item.htsi,
        explanation: item.explanation,
        model_count: item.model_count,
        temperature_spread_c: item.temperature_spread_c,
      };
    });
    const peak = [...forecast].sort((a, b) => b.htsi - a.htsi)[0];
    return {
      district: config.district,
      current: ensembleCurrent,
      forecast,
      horizons,
      peak,
      profiles: vulnerabilityProfiles(ensembleCurrent),
      source: liveSource,
      ensemble: ensembleMetadata,
    };
  } catch {
    // Continue to the single best-match provider and resilient fallback below.
  }
  try {
    const params = new URLSearchParams({
      latitude: String(config.lat),
      longitude: String(config.lon),
      hourly:
        'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,uv_index,shortwave_radiation',
      timezone: 'Asia/Kolkata',
      forecast_days: '5',
    });
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
      { headers: { 'User-Agent': 'ThermoWatch-SIH26083/3.0' } },
    );
    if (!response.ok) throw new Error('forecast unavailable');
    const payload = (await response.json()) as {
      hourly: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        wind_speed_10m: number[];
        uv_index: number[];
        shortwave_radiation: number[];
      };
    };
    const forecast = payload.hourly.time
      .map((time, index) => {
        const hour = Number(time.slice(11, 13));
        const temp = payload.hourly.temperature_2m[index];
        const humidity = payload.hourly.relative_humidity_2m[index];
        const wind = payload.hourly.wind_speed_10m[index] / 3.6;
        const solar =
          payload.hourly.shortwave_radiation[index] ??
          (hour >= 7 && hour <= 18
            ? Math.max(120, 760 - Math.abs(13 - hour) * 90)
            : 10);
        const result = computeHtsi({
          temp,
          humidity,
          wind,
          uv: payload.hourly.uv_index[index] ?? 0,
          solar,
        });
        return {
          time: indiaForecastTime(time),
          label: new Date(indiaForecastTime(time)).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            weekday: 'short',
            hour: 'numeric',
          }),
          temp: Number(temp.toFixed(1)),
          humidity,
          wind: Number(wind.toFixed(1)),
          uv: Number((payload.hourly.uv_index[index] ?? solar / 95).toFixed(1)),
          solar: Number(solar.toFixed(1)),
          ...result,
          ...modelFields(config, {
            temp,
            humidity,
            wind,
            solar,
            timestamp: time,
          }),
        };
      })
      .filter(
        (point, index) =>
          index % 3 === 0 && Date.parse(point.time) >= Date.now(),
      );
    const horizons = [24, 48, 72].map((hours) => {
      const item = nearestForecast(forecast, hours);
      return {
        horizon_hours: hours,
        predicted_class: item.risk,
        probability: item.model_confidence,
        high_risk_probability: item.high_risk_probability,
        htsi: item.htsi,
        explanation: item.explanation,
      };
    });
    const peak = [...forecast].sort((a, b) => b.htsi - a.htsi)[0];
    return {
      district: config.district,
      current,
      forecast,
      horizons,
      peak,
      profiles: vulnerabilityProfiles(current),
      source: 'open-meteo',
    };
  } catch {
    const forecast = Array.from({ length: 40 }, (_, index) => {
      const time = new Date(Date.now() + index * 3 * 3600000);
      const hour = new Date(time.getTime() + 5.5 * 3600000).getUTCHours();
      const temp =
        config.fallbackTemp -
        6 +
        Math.max(0, 1 - Math.abs(14 - hour) / 9) * 7 +
        Math.sin(index / 4);
      const humidity = Math.max(
        24,
        config.fallbackHumidity + (hour < 8 ? 12 : 0),
      );
      const result = computeHtsi({
        temp,
        humidity,
        wind: 1.6,
        solar: hour >= 7 && hour <= 18 ? 640 : 10,
      });
      const solar = hour >= 7 && hour <= 18 ? 640 : 10;
      return {
        time: time.toISOString(),
        label: time.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          weekday: 'short',
          hour: 'numeric',
        }),
        temp: Number(temp.toFixed(1)),
        humidity: Math.round(humidity),
        wind: 1.6,
        uv: Number((solar / 95).toFixed(1)),
        solar,
        ...result,
        ...modelFields(config, {
          temp,
          humidity,
          wind: 1.6,
          solar,
          timestamp: time,
        }),
      };
    });
    const horizons = [24, 48, 72].map((hours) => {
      const item = forecast[Math.round(hours / 3)];
      return {
        horizon_hours: hours,
        predicted_class: item.risk,
        probability: item.model_confidence,
        high_risk_probability: item.high_risk_probability,
        htsi: item.htsi,
        explanation: item.explanation,
      };
    });
    return {
      district: config.district,
      current,
      forecast,
      horizons,
      peak: [...forecast].sort((a, b) => b.htsi - a.htsi)[0],
      profiles: vulnerabilityProfiles(current),
      source: 'resilient-fallback',
    };
  }
}

export function vulnerabilityProfiles(weather: {
  temp: number;
  humidity: number;
  wind?: number;
  uv?: number;
}) {
  const profiles = [
    ['Healthy adult', 0.9],
    ['Child', 1.08],
    ['Older adult', 1.18],
    ['Outdoor worker', 1.24],
    ['Pregnant person', 1.15],
    ['Cardiac or respiratory condition', 1.3],
  ] as const;
  return profiles.map(([profile, multiplier]) => ({
    profile,
    multiplier,
    ...computeHtsi({
      temp: weather.temp,
      humidity: weather.humidity,
      wind: weather.wind,
      uv: weather.uv,
      multiplier,
    }),
  }));
}

const CURATED_FACILITIES: Record<string, Array<{ name: string; type: string; emergency: boolean; latOffset: number; lonOffset: number }>> = {
  delhi: [
    { name: 'AIIMS New Delhi (Apex Heat Emergency Trauma Center)', type: 'hospital', emergency: true, latOffset: 0.012, lonOffset: 0.014 },
    { name: 'Safdarjung Hospital & Vardhman Mahavir Medical College', type: 'hospital', emergency: true, latOffset: 0.008, lonOffset: 0.010 },
    { name: 'Lok Nayak Jai Prakash Hospital (LNJP Heat Ward)', type: 'hospital', emergency: true, latOffset: 0.045, lonOffset: 0.025 },
    { name: 'Dr. Ram Manohar Lohia Hospital (RML Emergency)', type: 'hospital', emergency: true, latOffset: 0.028, lonOffset: -0.012 },
    { name: 'Guru Teg Bahadur (GTB) Hospital East Delhi', type: 'hospital', emergency: true, latOffset: 0.082, lonOffset: 0.098 },
    { name: 'NDMC Central Primary Health Center', type: 'clinic', emergency: false, latOffset: -0.015, lonOffset: 0.005 },
    { name: 'MCD Public Hydration & Heat Recovery Station', type: 'drinking_water', emergency: false, latOffset: -0.008, lonOffset: -0.018 },
  ],
  mumbai: [
    { name: 'King Edward Memorial (KEM) Hospital Parel', type: 'hospital', emergency: true, latOffset: 0.015, lonOffset: 0.008 },
    { name: 'Lokmanya Tilak Municipal General Hospital (Sion)', type: 'hospital', emergency: true, latOffset: 0.045, lonOffset: 0.012 },
    { name: 'Sir JJ Group of Hospitals Byculla', type: 'hospital', emergency: true, latOffset: -0.022, lonOffset: 0.005 },
    { name: 'B.Y.L. Nair Charitable Hospital Mumbai Central', type: 'hospital', emergency: true, latOffset: -0.010, lonOffset: -0.006 },
    { name: 'Lilavati Hospital & Research Centre Bandra', type: 'hospital', emergency: true, latOffset: 0.065, lonOffset: -0.020 },
    { name: 'BMC Disaster Management Emergency Medical Cell', type: 'clinic', emergency: true, latOffset: 0.002, lonOffset: 0.003 },
  ],
  ahmedabad: [
    { name: 'Civil Hospital Asarwa (Asia Largest Civil Complex)', type: 'hospital', emergency: true, latOffset: 0.025, lonOffset: 0.030 },
    { name: 'Sardar Vallabhbhai Patel (SVP) Hospital Ellis Bridge', type: 'hospital', emergency: true, latOffset: -0.015, lonOffset: -0.010 },
    { name: 'Sheth Vadilal Sarabhai (VS) General Hospital', type: 'hospital', emergency: true, latOffset: -0.020, lonOffset: -0.015 },
    { name: 'Shardaben General Hospital Saraspur', type: 'hospital', emergency: true, latOffset: 0.010, lonOffset: 0.035 },
    { name: 'AMC Heat Action Plan Cooling & Rehydration Pavilion', type: 'community_centre', emergency: false, latOffset: 0.005, lonOffset: 0.008 },
  ],
  kolkata: [
    { name: 'SSKM Hospital & IPGMER Medical Institute', type: 'hospital', emergency: true, latOffset: -0.018, lonOffset: 0.010 },
    { name: 'Medical College & Hospital Kolkata (College Street)', type: 'hospital', emergency: true, latOffset: 0.022, lonOffset: 0.020 },
    { name: 'Nil Ratan Sircar (NRS) Medical College & Hospital', type: 'hospital', emergency: true, latOffset: 0.015, lonOffset: 0.035 },
    { name: 'R.G. Kar Medical College & Hospital', type: 'hospital', emergency: true, latOffset: 0.065, lonOffset: 0.032 },
  ],
  bengaluru: [
    { name: 'Victoria Hospital (Bangalore Medical College)', type: 'hospital', emergency: true, latOffset: -0.012, lonOffset: -0.008 },
    { name: 'Bowring and Lady Curzon Hospital Shivajinagar', type: 'hospital', emergency: true, latOffset: 0.020, lonOffset: 0.015 },
    { name: 'KC General Hospital Malleshwaram', type: 'hospital', emergency: true, latOffset: 0.035, lonOffset: -0.022 },
    { name: 'BBMP Urban Health Center & Heat Relief Kiosk', type: 'clinic', emergency: false, latOffset: 0.008, lonOffset: 0.005 },
  ],
  hyderabad: [
    { name: 'Osmania General Hospital Afzal Gunj', type: 'hospital', emergency: true, latOffset: -0.025, lonOffset: 0.010 },
    { name: 'Gandhi Hospital Musheerabad', type: 'hospital', emergency: true, latOffset: 0.038, lonOffset: 0.028 },
    { name: 'Nizam Institute of Medical Sciences (NIMS) Punjagutta', type: 'hospital', emergency: true, latOffset: 0.022, lonOffset: -0.018 },
  ],
  chennai: [
    { name: 'Rajiv Gandhi Government General Hospital (Park Town)', type: 'hospital', emergency: true, latOffset: 0.015, lonOffset: 0.022 },
    { name: 'Government Stanley Medical College Hospital', type: 'hospital', emergency: true, latOffset: 0.045, lonOffset: 0.028 },
    { name: 'Government Kilpauk Medical College Hospital', type: 'hospital', emergency: true, latOffset: 0.012, lonOffset: -0.018 },
  ],
  jaipur: [
    { name: 'Sawai Man Singh (SMS) Hospital Ashok Nagar', type: 'hospital', emergency: true, latOffset: -0.015, lonOffset: 0.010 },
    { name: 'Janana Hospital Station Road', type: 'hospital', emergency: true, latOffset: 0.020, lonOffset: -0.012 },
    { name: 'Jaipur Metro Civil Hospital & Emergency Unit', type: 'hospital', emergency: true, latOffset: 0.010, lonOffset: 0.025 },
  ],
  lucknow: [
    { name: 'King George Medical University (KGMU) Chowk', type: 'hospital', emergency: true, latOffset: 0.025, lonOffset: -0.018 },
    { name: 'Dr. Ram Manohar Lohia Institute of Medical Sciences Gomti Nagar', type: 'hospital', emergency: true, latOffset: 0.010, lonOffset: 0.045 },
    { name: 'Balrampur Hospital Golaganj', type: 'hospital', emergency: true, latOffset: 0.018, lonOffset: -0.005 },
  ],
  nagpur: [
    { name: 'Government Medical College & Hospital (GMCH) Nagpur', type: 'hospital', emergency: true, latOffset: -0.018, lonOffset: 0.012 },
    { name: 'Indira Gandhi Government Medical College (Mayo Hospital)', type: 'hospital', emergency: true, latOffset: 0.022, lonOffset: 0.015 },
    { name: 'AIIMS Nagpur MIHAN Complex', type: 'hospital', emergency: true, latOffset: -0.085, lonOffset: 0.045 },
  ],
  patna: [
    { name: 'Patna Medical College and Hospital (PMCH) Ashok Rajpath', type: 'hospital', emergency: true, latOffset: 0.022, lonOffset: 0.035 },
    { name: 'Nalanda Medical College and Hospital (NMCH) Kankarbagh', type: 'hospital', emergency: true, latOffset: -0.018, lonOffset: 0.042 },
    { name: 'AIIMS Patna Phulwari Sharif', type: 'hospital', emergency: true, latOffset: -0.065, lonOffset: -0.048 },
  ],
  bhopal: [
    { name: 'AIIMS Bhopal Saket Nagar', type: 'hospital', emergency: true, latOffset: -0.035, lonOffset: 0.042 },
    { name: 'Hamidia Hospital & Gandhi Medical College', type: 'hospital', emergency: true, latOffset: 0.028, lonOffset: -0.018 },
    { name: 'Jayaprakash (JP) District Hospital 1200 Quarters', type: 'hospital', emergency: true, latOffset: -0.012, lonOffset: 0.010 },
  ],
  pune: [
    { name: 'Sassoon General Hospital & B.J. Medical College Station', type: 'hospital', emergency: true, latOffset: 0.012, lonOffset: 0.018 },
    { name: 'Deenanath Mangeshkar Hospital Erandwane', type: 'hospital', emergency: true, latOffset: -0.025, lonOffset: -0.022 },
    { name: 'Bharati Vidyapeeth Medical College & Hospital Katraj', type: 'hospital', emergency: true, latOffset: -0.065, lonOffset: 0.010 },
  ],
  surat: [
    { name: 'New Civil Hospital (NCH) Majura Gate', type: 'hospital', emergency: true, latOffset: -0.015, lonOffset: 0.012 },
    { name: 'Surat Municipal Institute of Medical Education & Research (SMIMER)', type: 'hospital', emergency: true, latOffset: 0.022, lonOffset: 0.028 },
  ],
  varanasi: [
    { name: 'Sir Sunderlal Hospital (Banaras Hindu University)', type: 'hospital', emergency: true, latOffset: -0.042, lonOffset: 0.022 },
    { name: 'Pandit Deendayal Upadhyay Government Hospital Pandeypur', type: 'hospital', emergency: true, latOffset: 0.035, lonOffset: 0.018 },
    { name: 'Shiv Prasad Gupta (SPG) Divisional Hospital Kabirchaura', type: 'hospital', emergency: true, latOffset: 0.012, lonOffset: 0.008 },
  ],
  chandigarh: [
    { name: 'Post Graduate Institute of Medical Education and Research (PGIMER)', type: 'hospital', emergency: true, latOffset: 0.028, lonOffset: -0.015 },
    { name: 'Government Medical College and Hospital (GMCH) Sector 32', type: 'hospital', emergency: true, latOffset: -0.022, lonOffset: 0.018 },
  ],
};

function buildFallbackFacilities(districtName: string, baseLat: number, baseLon: number) {
  const cityKey = districtName.toLowerCase().trim();
  const list = CURATED_FACILITIES[cityKey] ?? [
    { name: `${districtName} District Civil Hospital (Apex Emergency)`, type: 'hospital', emergency: true, latOffset: 0.015, lonOffset: 0.012 },
    { name: `${districtName} Medical College & Trauma Center`, type: 'hospital', emergency: true, latOffset: -0.018, lonOffset: -0.014 },
    { name: `${districtName} Municipal Urban Primary Health Center`, type: 'clinic', emergency: false, latOffset: 0.008, lonOffset: -0.020 },
    { name: `${districtName} Red Cross Emergency Heat Rehydration Center`, type: 'community_centre', emergency: false, latOffset: -0.010, lonOffset: 0.018 },
    { name: `${districtName} Community Health Center (North Ward)`, type: 'clinic', emergency: true, latOffset: 0.032, lonOffset: 0.008 },
  ];

  return list.map((item, idx) => {
    const lat = Number((baseLat + item.latOffset).toFixed(4));
    const lon = Number((baseLon + item.lonOffset).toFixed(4));
    return {
      id: `fac-${cityKey}-${idx + 1}`,
      name: item.name,
      type: item.type,
      emergency: item.emergency,
      map_url: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`,
      google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + districtName)}`,
    };
  });
}

export async function fetchNearbyFacilities(name: string) {
  const config =
    DISTRICTS.find(
      (item) => item.district.toLowerCase() === name.toLowerCase(),
    ) ?? DISTRICTS[0];

  const query = `[out:json][timeout:12];(nwr(around:12000,${config.lat},${config.lon})[amenity~"hospital|clinic|community_centre|drinking_water"];);out center 20;`;
  try {
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': 'ThermoWatch-SIH26083/3.0' } },
    );
    if (!response.ok) throw new Error('facilities unavailable');
    const payload = (await response.json()) as {
      elements: Array<{
        id: number;
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
        tags?: Record<string, string>;
      }>;
    };

    const parsed = payload.elements
      .filter((item) => item.tags?.name)
      .slice(0, 15)
      .map((item) => {
        const lat = item.lat ?? item.center?.lat ?? config.lat;
        const lon = item.lon ?? item.center?.lon ?? config.lon;
        const type = item.tags?.amenity ?? 'facility';
        return {
          id: String(item.id),
          name: item.tags?.name ?? type.replaceAll('_', ' '),
          type: type.replaceAll('_', ' '),
          emergency: item.tags?.emergency === 'yes' || type === 'hospital',
          map_url: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`,
          google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.tags?.name ?? type) + ' ' + config.district)}`,
        };
      });

    if (parsed.length >= 3) {
      return parsed;
    }
    return buildFallbackFacilities(config.district, config.lat, config.lon);
  } catch {
    return buildFallbackFacilities(config.district, config.lat, config.lon);
  }
}
