'use client';
/* oxlint-disable next/no-html-link-for-pages -- Sites auth requires top-level anchor navigation. */
/* oxlint-disable typescript/no-deprecated -- Recharts 3.8 still uses Cell for per-bar risk colours. */

import {
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import {
  Activity,
  Bell,
  Building2,
  Check,
  ChevronRight,
  CloudSun,
  Download,
  ExternalLink,
  FileText,
  History,
  LayoutDashboard,
  LockKeyhole,
  Map,
  Menu,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  X,
  Clock,
  Sliders,
  HeartPulse,
  HardHat,
  Cpu,
  MapPin,
  ZoomIn,
  Play,
  Pause,
  Users,
  Sun,
  ListChecks,
} from 'lucide-react';
import {
  generateThermalStressActionPlan,
  type RecommendedActionPlan,
} from '@/lib/action-engine';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from 'recharts';
import indiaMap from '@svg-maps/india';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import type { AlertChannel } from '@/lib/alerting';
import { LocalAssistant } from '@/components/local-assistant';
import { KannadaLocalizer } from '@/components/kannada-localizer';

import { WhatIfSimulator } from '@/components/what-if-simulator';
import { DigitalTwinView } from '@/components/digital-twin-view';
import { RiskCascadeView } from '@/components/risk-cascade-view';
import { CoolingCenterView } from '@/components/cooling-center-view';
import { HospitalReadinessView } from '@/components/hospital-readiness-view';
import { WorkerSafetyView } from '@/components/worker-safety-view';
import { HeatwaveMemoryView } from '@/components/heatwave-memory-view';
import { DataTelemetryView } from '@/components/data-telemetry-view';
import { HyperlocalWardGis } from '@/components/hyperlocal-ward-gis';
import { GroundedAssistantModal } from '@/components/grounded-assistant-modal';
import { CityWardMap } from '@/components/city-ward-map';
import { LeafletIndiaMap } from '@/components/leaflet-india-map';

type Risk = 'Low' | 'Moderate' | 'High' | 'Extreme' | 'Emergency';
type Contribution = {
  feature: string;
  label: string;
  contribution_pct: number;
  direction: 'raises' | 'reduces';
  value: number;
};
type View =
  | 'overview'
  | 'hyperlocal-gis'
  | 'digital-twin'
  | 'what-if'
  | 'cascade'
  | 'forecast'
  | 'map'
  | 'cooling-centers'
  | 'hospitals'
  | 'worker-safety'
  | 'memory'
  | 'model'
  | 'telemetry'
  | 'authority'
  | 'response'
  | 'validation'
  | 'history'
  | 'alerts';
type District = {
  district: string;
  lat: number;
  lon: number;
  temp: number;
  humidity: number;
  htsi: number;
  risk: Risk;
  probability: number;
  x: number;
  y: number;
  source: string;
  wind?: number;
  uv?: number;
  wbgt?: number;
  heat_index?: number;
  pet?: number;
  solar?: number;
  model_confidence?: number;
  high_risk_probability?: number;
  explanation?: Contribution[];
  horizon_hours?: 24 | 48 | 72;
  valid_at?: string;
  action?: string;
  action_plan?: RecommendedActionPlan;
};
type ForecastPoint = {
  time: string;
  label: string;
  temp: number;
  humidity: number;
  htsi: number;
  risk: Risk;
  model_confidence?: number;
  high_risk_probability?: number;
  explanation?: Contribution[];
};
type Horizon = {
  horizon_hours: number;
  predicted_class: Risk;
  probability: number;
  high_risk_probability: number;
  htsi: number;
  explanation: Contribution[];
};
type Profile = {
  profile: string;
  multiplier: number;
  htsi: number;
  risk: Risk;
};
type DistrictDetail = {
  district: string;
  current: District;
  forecast: ForecastPoint[];
  horizons: Horizon[];
  peak?: ForecastPoint;
  profiles: Profile[];
  source: string;
  facilities?: Facility[];
};
type Facility = {
  id: string;
  name: string;
  type: string;
  emergency: boolean;
  map_url: string;
  google_maps_url?: string;
};
type AlertRow = {
  id: string;
  district: string;
  risk: Risk;
  channel: string;
  language: string;
  message: string;
  status: string;
  created_at: string;
};
type IncidentRow = {
  id: string;
  district: string;
  incident_type: string;
  severity: Risk;
  description: string;
  reporter: string;
  status: string;
  created_at: string;
};
type AutomaticWarning = {
  id: string;
  district: string;
  horizon_hours: number;
  risk: Risk;
  probability: number;
  htsi: number;
  model_version: string;
  status: string;
  valid_at: string;
  created_at: string;
};
type SessionData = {
  id: string | null;
  email: string | null;
  name: string | null;
  role: 'public' | 'officer' | 'admin';
  signed_in: boolean;
};
type ForecastMapData = {
  layers: Record<'24' | '48' | '72', District[]>;
  generated_at: string;
  warning_count: number;
  model_version: string;
};
type HistoryData = {
  observations: RecordRow[];
  predictions: RecordRow[];
  counts: { observations: number; predictions: number };
};
type RecordRow = Record<string, string | number | null>;
type DashboardData = {
  districts: District[];
  model: {
    model_version: string;
    model_type: string;
    data_source: string;
    train_samples: number;
    calibration_samples: number;
    test_samples: number;
    train_period: string;
    calibration_period: string;
    test_period: string;
    metrics: Record<string, number>;
    feature_names: string[];
    feature_importance: Array<{
      feature: string;
      label: string;
      importance_pct: number;
    }>;
    label_note: string;
    artifact_sha256: string;
  };
  authority: {
    coverage: number;
    high_risk_count: number;
    active_alerts: number;
    automatic_warnings: number;
    open_incidents: number;
    highest_risk_locations: District[];
    recommended_interventions: string[];
  } | null;
  validation: {
    accuracy_pct: number;
    macro_f1_pct: number;
    precision_pct: number;
    recall_pct: number;
    false_alarms: number;
    missed_events: number;
    class_support: Record<string, number>;
    confusion_matrix: number[][];
    labels: string[];
    brier_score: number;
    test_samples: number;
    test_period: string;
    methodology: string;
    caveat: string;
    district_accuracy_pct: Record<string, number>;
    replay: Array<{
      label: string;
      timestamp: string;
      district: string;
      actual_htsi: number;
      predicted_probability: number;
    }>;
    replay_cases: Array<{
      id: string;
      district: string;
      timestamp: string;
      observed: {
        temperature_c: number;
        humidity_pct: number;
        wind_speed_ms: number;
        shortwave_radiation_wm2: number;
        htsi: number;
        risk: Risk;
      };
      prediction: {
        risk: Risk;
        confidence_pct: number;
        high_risk_probability_pct: number;
        probabilities: Record<Risk, number>;
        correct: boolean;
        explanation: Contribution[];
      };
    }>;
  };
  generated_at: string;
};

const seedDistricts: District[] = [
  {
    district: 'Delhi',
    lat: 28.6139,
    lon: 77.209,
    temp: 42.1,
    humidity: 39,
    htsi: 73.5,
    risk: 'Extreme',
    probability: 81,
    x: 144,
    y: 75,
    source: 'resilient-fallback',
    wbgt: 34.4,
    heat_index: 53.2,
    pet: 45.1,
  },
  {
    district: 'Jaipur',
    lat: 26.9124,
    lon: 75.7873,
    temp: 43.6,
    humidity: 31,
    htsi: 71.1,
    risk: 'Extreme',
    probability: 78,
    x: 120,
    y: 91,
    source: 'resilient-fallback',
  },
  {
    district: 'Hyderabad',
    lat: 17.385,
    lon: 78.4867,
    temp: 39.4,
    humidity: 47,
    htsi: 63.8,
    risk: 'High',
    probability: 71,
    x: 162,
    y: 184,
    source: 'resilient-fallback',
  },
  {
    district: 'Patna',
    lat: 25.5941,
    lon: 85.1376,
    temp: 40.2,
    humidity: 58,
    htsi: 69.4,
    risk: 'High',
    probability: 76,
    x: 208,
    y: 104,
    source: 'resilient-fallback',
  },
  {
    district: 'Ahmedabad',
    lat: 23.0225,
    lon: 72.5714,
    temp: 41.3,
    humidity: 37,
    htsi: 67.2,
    risk: 'High',
    probability: 74,
    x: 96,
    y: 118,
    source: 'resilient-fallback',
  },
  {
    district: 'Bhopal',
    lat: 23.2599,
    lon: 77.4126,
    temp: 38.8,
    humidity: 44,
    htsi: 58.2,
    risk: 'High',
    probability: 63,
    x: 150,
    y: 130,
    source: 'resilient-fallback',
  },
  {
    district: 'Lucknow',
    lat: 26.8467,
    lon: 80.9462,
    temp: 38.6,
    humidity: 51,
    htsi: 52.8,
    risk: 'Moderate',
    probability: 48,
    x: 178,
    y: 91,
    source: 'resilient-fallback',
  },
  {
    district: 'Bhubaneswar',
    lat: 20.2961,
    lon: 85.8245,
    temp: 37.4,
    humidity: 66,
    htsi: 61.4,
    risk: 'High',
    probability: 66,
    x: 215,
    y: 154,
    source: 'resilient-fallback',
  },
];

const riskStyle: Record<
  Risk,
  { badge: string; color: string; soft: string; bar: string }
> = {
  Low: {
    badge: 'rounded-full border border-[#0e0f10]/8 bg-[#f4f4f8] text-[#7a7b7c] font-mono text-[10.5px] uppercase tracking-wider px-2.5 py-0.5',
    color: '#7a7b7c',
    soft: '#f4f4f8',
    bar: 'bg-[#ff5065]',
  },
  Moderate: {
    badge: 'rounded-full border border-[#0e0f10]/10 bg-[#f4f4f8] text-[#0e0f10] font-mono text-[10.5px] uppercase tracking-wider px-2.5 py-0.5',
    color: '#ff7a59',
    soft: '#ffe9eb',
    bar: 'bg-[#ff5065]',
  },
  High: {
    badge: 'rounded-full border border-[#ff5c35]/20 bg-[#ffe9eb] text-[#ff5c35] font-mono text-[10.5px] uppercase tracking-wider px-2.5 py-0.5',
    color: '#ff5c35',
    soft: '#ffe9eb',
    bar: 'bg-[#ff5065]',
  },
  Extreme: {
    badge: 'rounded-full border border-[#ff5065]/30 bg-[#ffe9eb] text-[#ff5065] font-mono text-[10.5px] uppercase tracking-wider px-2.5 py-0.5',
    color: '#ff5065',
    soft: '#ffe9eb',
    bar: 'bg-[#ff5065]',
  },
  Emergency: {
    badge: 'rounded-full bg-[#ff5065] text-white font-mono text-[10.5px] uppercase tracking-wider px-2.5 py-0.5',
    color: '#ff5065',
    soft: '#ffe9eb',
    bar: 'bg-[#ff5065]',
  },
};

const navigation: Array<{
  id: View;
  label: string;
  icon: typeof LayoutDashboard;
  group: 'core' | 'authority';
  authorityOnly?: boolean;
}> = [
  // 1. Core Public Decision Flow
  { id: 'overview', label: '1. Thermal Stress (HTSI)', icon: LayoutDashboard, group: 'core' },
  { id: 'hyperlocal-gis', label: '2. Exposure & Vulnerability', icon: MapPin, group: 'core' },
  { id: 'cascade', label: '3. Explainable Risk Cascade', icon: Activity, group: 'core' },

  // 2. Authority Operations (Confidential to Nodal Officers)
  { id: 'what-if', label: 'What-If Scenario Simulator', icon: Sliders, group: 'authority', authorityOnly: true },
  { id: 'response', label: 'Hospital & Facility Response', icon: HeartPulse, group: 'authority', authorityOnly: true },
  { id: 'alerts', label: 'Multichannel Alert Dispatch', icon: Bell, group: 'authority', authorityOnly: true },
  { id: 'cooling-centers', label: 'Authority Heat Action Plan', icon: ShieldCheck, group: 'authority', authorityOnly: true },
];

const officerViews = new Set<View>([
  'what-if',
  'response',
  'alerts',
  'cooling-centers',
  'authority',
  'hospitals',
  'history',
]);

function weatherSourceLabel(source: unknown) {
  switch (String(source)) {
    case 'open-meteo-live-ensemble':
      return 'Live ensemble';
    case 'met-norway-live-forecast':
      return 'MET Norway live';
    case 'open-meteo':
      return 'Open-Meteo live';
    case 'resilient-fallback':
      return 'Demonstration fallback (historical)';
    default:
      return String(source);
  }
}

type UiLanguage = 'en' | 'hi' | 'te' | 'kn';
function makeNav(overrides: Partial<Record<View, string>>): Record<View, string> {
  const base = Object.fromEntries(
    navigation.map((item) => [item.id, item.label]),
  ) as Record<View, string>;
  return { ...base, ...overrides };
}

const shellCopy: Record<
  UiLanguage,
  {
    nav: Record<View, string>;
    viewNote: string;
    operational: string;
    monitored: string;
    refresh: string;
    disasterManagement: string;
    decisionSupport: string;
  }
> = {
  en: {
    nav: makeNav({}),
    viewNote:
      'Use transparent signals to make an earlier, more targeted response decision.',
    operational: 'System operational',
    monitored: 'districts monitored',
    refresh: 'Refresh',
    disasterManagement: 'DISASTER MANAGEMENT',
    decisionSupport:
      'Decision support · not a medical diagnosis or official government warning',
  },
  hi: {
    nav: makeNav({
      overview: 'कमांड सेंटर',
      'hyperlocal-gis': 'हाइपरलोकल GIS',
      'digital-twin': 'डिजिटल ट्विन',
      'what-if': 'व्हाट-इफ सिम्युलेटर',
      cascade: 'जोखिम कैस्केड',
      forecast: 'पूर्वानुमान समयरेखा',
      map: 'जोखिम मानचित्र',
      'cooling-centers': 'शीतलन केंद्र',
      hospitals: 'अस्पताल तत्परता',
      'worker-safety': 'श्रमिक सुरक्षा',
      memory: 'उष्ण लहर स्मृति',
      model: 'व्याख्यात्मक AI',
      telemetry: 'डेटा टेलीमेट्री',
      authority: 'प्राधिकरण',
      response: 'प्रतिक्रिया केंद्र',
      validation: 'सत्यापन',
      history: 'इतिहास',
      alerts: 'चेतावनी केंद्र',
    }),
    viewNote: 'पहले और अधिक लक्षित निर्णय के लिए पारदर्शी संकेतों का उपयोग करें।',
    operational: 'सिस्टम चालू है',
    monitored: 'जिलों की निगरानी',
    refresh: 'रीफ़्रेश',
    disasterManagement: 'आपदा प्रबंधन',
    decisionSupport:
      'निर्णय सहायता · चिकित्सा निदान या आधिकारिक सरकारी चेतावनी नहीं',
  },
  te: {
    nav: makeNav({
      overview: 'కమాండ్ సెంటర్',
      'hyperlocal-gis': 'హైపర్‌లోకల్ GIS',
      'digital-twin': 'డిజిటల్ ట్విన్',
      'what-if': 'వాట్-ఇఫ్ సిమ్యులేటర్',
      cascade: 'ప్రమాద కాస్కేడ్',
      forecast: 'అంచనా కాలరేఖ',
      map: 'ప్రమాద పటం',
      'cooling-centers': 'శీతలీకరణ కేంద్రాలు',
      hospitals: 'ఆసుపత్రి సన్నద్ధత',
      'worker-safety': 'కార్మికుల భద్రత',
      memory: 'వేడి తరంగ జ్ఞాపకం',
      model: 'వివరణಾత్మక AI',
      telemetry: 'డేటా టెలిమెట్రీ',
      authority: 'అధికార విభాగం',
      response: 'ప్రతిస్పందన కేంద్రం',
      validation: 'ధృవీకరణ',
      history: 'చరిత్ర',
      alerts: 'హెచ్చరిక కేంద్రం',
    }),
    viewNote: 'ముందస్తు, లక్ష్యిత నిర్ణయాలకు పారదర్శక సంకేతాలను ఉపయోగించండి.',
    operational: 'వ్యవస్థ పనిచేస్తోంది',
    monitored: 'జిల్లాల పర్యవేక్షణ',
    refresh: 'రిఫ్రెష్',
    disasterManagement: 'విపత్తు నిర్వహణ',
    decisionSupport: 'నిర్ణయ సహాయం · వైద్య నిర్ధారణ లేదా అధికారిక ప్రభుత్వ హెచ్చరిక కాదు',
  },
  kn: {
    nav: makeNav({
      overview: 'ಕಮಾಂಡ್ ಕೇಂದ್ರ',
      'hyperlocal-gis': 'ಹೈಪರ್‌ಲೋಕಲ್ GIS',
      'digital-twin': 'ಡಿಜಿಟಲ್ ಟ್ವಿನ್',
      'what-if': 'ವಾಟ್-ಇಫ್ ಸಿಮ್ಯುಲೇಟರ್',
      cascade: 'ಅಪಾಯ ಕ್ಯಾಸ್ಕೇಡ್',
      forecast: 'ಮುನ್ಸೂಚನೆ ಅವಧಿ',
      map: 'ಅಪಾಯ ನಕ್ಷೆ',
      'cooling-centers': 'ಕೂಲಿಂಗ್ ಕೇಂದ್ರಗಳು',
      hospitals: 'ಆಸ್ಪತ್ರೆ ಸನ್ನದ್ಧತೆ',
      'worker-safety': 'ಕಾರ್ಮಿಕರ ಸುರಕ್ಷತೆ',
      memory: 'ಶಾಖದ ಅಲೆ ದಾಖಲೆ',
      model: 'ವಿವರಣಾತ್ಮಕ AI',
      telemetry: 'ಡೇಟಾ ಟೆಲಿಮೆಟ್ರಿ',
      authority: 'ಪ್ರಾಧಿಕಾರ',
      response: 'ಪ್ರತಿಕ್ರಿಯಾ ಕೇಂದ್ರ',
      validation: 'ಮೌಲ್ಯಮಾಪನ',
      history: 'ಇತಿಹಾಸ',
      alerts: 'ಎಚ್ಚರಿಕೆ ಕೇಂದ್ರ',
    }),
    viewNote: 'ಮುಂಚಿತ ಮತ್ತು ಗುರಿಯುಕ್ತ ನಿರ್ಧಾರಕ್ಕಾಗಿ ಪಾರದರ್ಶಕ ಸೂಚನೆಗಳನ್ನು ಬಳಸಿ.',
    operational: 'ವ್ಯವಸ್ಥೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ',
    monitored: 'ನಗರಗಳ ಮೇಲ್ವಿಚಾರಣೆ',
    refresh: 'ರಿಫ್ರೆಶ್',
    disasterManagement: 'ವಿಪತ್ತು ನಿರ್ವಹಣೆ',
    decisionSupport: 'ನಿರ್ಧಾರ ಸಹಾಯ · ವೈದ್ಯಕೀಯ ನಿರ್ಣಯ ಅಥವಾ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಎಚ್ಚರಿಕೆ ಅಲ್ಲ',
  },
};

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(path, {
      ...options,
      signal: controller.signal,
    });
    const payload = (await response.json()) as T & { error?: string };
    if (!response.ok)
      throw new Error(payload.error || `Request failed (${response.status})`);
    return payload;
  } catch (error) {
    if (controller.signal.aborted)
      throw new Error('The request took too long. Please try Refresh again.');
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function RiskBadge({ risk }: { risk: Risk }) {
  return (
    <Badge
      variant="outline"
      className={riskStyle[risk]?.badge ?? riskStyle.Low.badge}
    >
      {risk}
    </Badge>
  );
}

function PanelTitle({
  eyebrow,
  title,
  note,
  action,
}: {
  eyebrow: string;
  title: string;
  note?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="font-mono text-[10px] font-medium tracking-[0.025em] text-[#7a7876] uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-lg font-medium tracking-[-0.025em] text-[#222222]">
          {title}
        </h2>
        {note && (
          <p className="mt-1 text-xs leading-relaxed text-[#7a7876]">{note}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
  tone = 'blue',
}: {
  label: string;
  value: string | number;
  detail: string;
  tone?: string;
}) {
  const tones: Record<string, string> = {
    blue: 'border-[#222222]/8 bg-white text-[#222222]',
    red: 'border-[#222222]/8 bg-[#fce0ee] text-[#222222]',
    amber: 'border-[#222222]/8 bg-[#ffe9cf] text-[#222222]',
    green: 'border-[#222222]/8 bg-[#daf7ee] text-[#222222]',
    purple: 'border-[#222222]/8 bg-[#fdebf7] text-[#222222]',
  };
  return (
    <div
      className={`rounded-2xl border p-4 ${tones[tone] || tones.blue}`}
    >
      <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.025em] text-[#7a7876]">
        {label}
      </span>
      <strong className="my-1 block font-mono text-2xl font-normal text-[#222222]">{value}</strong>
      <small className="text-xs text-[#7a7876]">{detail}</small>
    </div>
  );
}

function Loading({ label = 'Loading live intelligence' }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.025em] text-[#7a7876]">
      <RefreshCw className="h-4 w-4 animate-spin text-[#c094e4]" />
      {label}
    </div>
  );
}

type ImdWarningTier = 'No Warning' | 'Watch' | 'Alert' | 'Warning';

const IMD_WARNING_CONFIG: Record<
  ImdWarningTier,
  {
    name: string;
    shortLabel: string;
    action: string;
    color: string;
    soft: string;
    badgeClass: string;
  }
> = {
  'No Warning': {
    name: 'No Warning (Nil)',
    shortLabel: 'Normal',
    action: 'No action required. Normal seasonal summer temperature.',
    color: '#2ec4b6',
    soft: '#daf7ee',
    badgeClass: 'rounded-full border border-[#222222]/8 bg-[#daf7ee] text-[#1b4332] font-mono text-[10.5px] uppercase tracking-[0.025em] px-2.5 py-0.5 shadow-none',
  },
  Watch: {
    name: 'Watch (Be Updated)',
    shortLabel: 'Watch',
    action: 'Heatwave watch. Tolerable for general public, moderate health concern for vulnerable people (infants, elderly).',
    color: '#ffb760',
    soft: '#ffe9cf',
    badgeClass: 'rounded-full border border-[#222222]/8 bg-[#ffe9cf] text-[#854d0e] font-mono text-[10.5px] uppercase tracking-[0.025em] px-2.5 py-0.5 shadow-none',
  },
  Alert: {
    name: 'Alert (Be Prepared)',
    shortLabel: 'Alert',
    action: 'Heatwave condition in isolated/some pockets. High temperature & severe heat stress. Avoid sun exposure 12:00-15:00. Mandatory shaded rest for laborers.',
    color: '#f7bbe6',
    soft: '#fce0ee',
    badgeClass: 'rounded-full border border-[#222222]/8 bg-[#fce0ee] text-[#831843] font-mono text-[10.5px] uppercase tracking-[0.025em] px-2.5 py-0.5 shadow-none',
  },
  Warning: {
    name: 'Warning (Take Action)',
    shortLabel: 'Warning',
    action: 'Severe heatwave in multiple pockets. Very high risk of heatstroke for all age groups. Emergency labor stoppage & cooling center activation.',
    color: '#c094e4',
    soft: '#fdebf7',
    badgeClass: 'rounded-full border border-[#222222]/8 bg-[#fdebf7] text-[#574853] font-mono text-[10.5px] uppercase tracking-[0.025em] px-2.5 py-0.5 shadow-none',
  },
};

const IMD_FORECAST_DAYS: Array<{
  day: 1 | 2 | 3 | 4 | 5;
  title: string;
  sub: string;
  tempOffset: number;
  rhOffset: number;
}> = [
  { day: 1, title: 'Day 1', sub: 'Today (Live)', tempOffset: 0, rhOffset: 0 },
  { day: 2, title: 'Day 2', sub: '+24h Forecast', tempOffset: 1.2, rhOffset: 2 },
  { day: 3, title: 'Day 3', sub: '+48h Forecast', tempOffset: 3.4, rhOffset: 5 },
  { day: 4, title: 'Day 4', sub: '+72h Forecast', tempOffset: 4.6, rhOffset: 4 },
  { day: 5, title: 'Day 5', sub: '+96h Forecast', tempOffset: 2.8, rhOffset: -2 },
];

function IndiaMap({
  districts,
  selected,
  onSelect,
  expanded = false,
  layerLabel = 'Live conditions',
  initialDay = 1,
}: {
  districts: District[];
  selected: District;
  onSelect: (district: District) => void;
  expanded?: boolean;
  layerLabel?: string;
  initialDay?: 1 | 2 | 3 | 4 | 5;
}) {
  const [viewMode, setViewMode] = useState<'national' | 'city'>('national');
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [forecastDay, setForecastDay] = useState<1 | 2 | 3 | 4 | 5>(initialDay);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-play through 5-day IMD horizon
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setForecastDay((prev) => ((prev % 5) + 1) as 1 | 2 | 3 | 4 | 5);
    }, 2500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const indiaLocations = indiaMap.locations as Array<{
    id: string;
    path: string;
  }>;
  const project = (lat: number, lon: number) => ({
    x: (lon - 67.7) * 20.35,
    y: (37.6 - lat) * 22.05,
  });

  const getDistrictForecast = (item: District, dayNum: 1 | 2 | 3 | 4 | 5) => {
    const config = IMD_FORECAST_DAYS[dayNum - 1];
    const temp = Number((item.temp + config.tempOffset).toFixed(1));
    const humidity = Math.min(95, Math.max(15, Math.round(item.humidity + config.rhOffset)));

    let warning: ImdWarningTier = 'No Warning';
    if (temp >= 44.5 || (temp >= 41.5 && humidity >= 50)) {
      warning = 'Warning';
    } else if (temp >= 41.5 || (temp >= 38.5 && humidity >= 55)) {
      warning = 'Alert';
    } else if (temp >= 38.0 || (temp >= 35.5 && humidity >= 60)) {
      warning = 'Watch';
    } else {
      warning = 'No Warning';
    }

    return {
      temp,
      humidity,
      warning,
      warningConfig: IMD_WARNING_CONFIG[warning],
      dayConfig: config,
    };
  };

  const getDayDateLabel = (dayNum: number) => {
    const d = new Date();
    d.setDate(d.getDate() + (dayNum - 1));
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const selectedDistrictForecast = getDistrictForecast(selected, forecastDay);
  const activeDayConfig = IMD_FORECAST_DAYS[forecastDay - 1];

  if (viewMode === 'city') {
    return (
      <div className="rounded-[1.6rem] border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <CityWardMap
          cityName={selected.district}
          baseTemp={selectedDistrictForecast.temp}
          baseHumidity={selectedDistrictForecast.humidity}
          onZoomOut={() => setViewMode('national')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* IMD 5-Day Horizon & Zoom Controller Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-3xl border border-[#0e0f10]/6 bg-white p-3 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 rounded-full border border-[#ff5065]/20 bg-[#ffe9eb] px-3 py-1 text-xs font-semibold text-[#ff5065]">
            <span className="text-sm">🇮🇳</span>
            <span>IMD Heatwave Warnings</span>
          </div>
          <a
            href={`https://mausam.imd.gov.in/responsive/districtWiseHeatwaveWarnings.php?day=Day_${forecastDay}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-[#0e0f10]/10 bg-[#f4f4f8] px-3 py-1 text-[10.5px] font-medium text-[#7a7b7c] hover:text-[#0e0f10] hover:border-[#0e0f10]/20 transition"
            title="Reference: Official IMD District-Wise Heatwave Warnings portal"
          >
            <span>Ref: IMD Day {forecastDay}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Day 1 - Day 5 Tabs */}
        <div className="flex items-center gap-1 rounded-full bg-[#f4f4f8] p-1 overflow-x-auto max-w-full">
          {IMD_FORECAST_DAYS.map((d) => {
            const isCurrent = forecastDay === d.day;
            return (
              <button
                key={d.day}
                onClick={() => {
                  setForecastDay(d.day);
                  setIsPlaying(false);
                }}
                className={`flex flex-col items-center rounded-full px-3 sm:px-3.5 py-1 text-center transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-[#ff5065] text-white font-semibold shadow-sm'
                    : 'text-[#0e0f10] hover:bg-white hover:text-[#ff5065]'
                }`}
                title={`Switch to ${d.title} forecast`}
              >
                <span className="text-[11px] font-bold leading-tight">{d.title}</span>
                <span className={`text-[8px] sm:text-[8.5px] leading-tight font-medium ${isCurrent ? 'text-white/80' : 'text-[#7a7b7c]'}`}>
                  {d.sub}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`ml-0.5 sm:ml-1 flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold transition shrink-0 ${
              isPlaying
                ? 'bg-[#0e0f10] text-white'
                : 'bg-white text-[#0e0f10] hover:bg-[#ffe9eb] border border-[#0e0f10]/10'
            }`}
            title={isPlaying ? 'Pause forecast animation' : 'Auto-play 5-day heatwave timeline'}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden md:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>

        <button
          onClick={() => setViewMode('city')}
          className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full bg-[#0e0f10] hover:bg-[#2f3133] px-4 py-2 sm:py-1.5 text-xs font-semibold text-white shadow-sm transition"
          title={`Zoom into ${selected.district} municipal wards`}
        >
          <ZoomIn className="h-3.5 w-3.5" />
          <span>Zoom into {selected.district} Wards</span>
        </button>
      </div>

      {/* Leaflet India Map */}
      <LeafletIndiaMap
        districts={districts}
        selected={selected}
        forecastDay={forecastDay}
        imdWarningConfig={IMD_WARNING_CONFIG}
        imdForecastDays={IMD_FORECAST_DAYS}
        onSelect={onSelect}
        onZoomToCity={(item) => { onSelect(item); setViewMode('city'); }}
        expanded={expanded}
      />

      {/* 5-Day Heatwave Warning Outlook Matrix for Selected District */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-slate-900">
                {selected.district} · IMD 5-Day Outlook
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${selectedDistrictForecast.warningConfig.badgeClass}`}>
                {activeDayConfig.title}: {selectedDistrictForecast.warningConfig.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any day to update national map risks and district action advisories.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://mausam.imd.gov.in/responsive/districtWiseHeatwaveWarnings.php?day=Day_${forecastDay}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900"
            >
              <span>View IMD Bulletin</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* 5-Day Cards */}
        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-5 gap-2.5 overflow-x-auto pb-1.5 sm:pb-0 snap-x">
          {IMD_FORECAST_DAYS.map((d) => {
            const status = getDistrictForecast(selected, d.day);
            const isCurrent = forecastDay === d.day;
            return (
              <button
                key={d.day}
                onClick={() => {
                  setForecastDay(d.day);
                  setIsPlaying(false);
                }}
                className={`flex flex-col text-left rounded-xl p-3 border transition min-w-[130px] sm:min-w-0 snap-start shrink-0 sm:shrink ${
                  isCurrent ? 'ring-2 ring-blue-600 bg-slate-50 shadow-xs' : 'hover:bg-slate-50/80 border-slate-200'
                }`}
                style={{ borderColor: isCurrent ? status.warningConfig.color : undefined }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-900">{d.title}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{getDayDateLabel(d.day)}</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-slate-900">{status.temp}°C</span>
                  <span className="text-[10px] text-slate-500 font-medium">({status.humidity}% RH)</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status.warningConfig.color }} />
                  <span className="text-[11px] font-bold" style={{ color: status.warningConfig.color }}>
                    {status.warningConfig.shortLabel}
                  </span>
                </div>
                <p className="mt-1.5 text-[9.5px] text-slate-600 line-clamp-2 leading-tight">
                  {status.warningConfig.action}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

export function ThermoWatchDashboard() {
  const [view, setView] = useState<View>('overview');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [districts, setDistricts] = useState<District[]>(seedDistricts);
  const [selectedName, setSelectedName] = useState('Delhi');
  const [detail, setDetail] = useState<DistrictDetail | null>(null);
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [automaticWarnings, setAutomaticWarnings] = useState<
    AutomaticWarning[]
  >([]);
  const [incidents, setIncidents] = useState<IncidentRow[]>([]);
  const [session, setSession] = useState<SessionData | null>(null);
  const [forecastMap, setForecastMap] = useState<ForecastMapData | null>(null);
  const [mapHorizon, setMapHorizon] = useState<0 | 24 | 48 | 72>(0);
  const [mapLoading, setMapLoading] = useState(false);
  const [online, setOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(true);
  const detailRequest = useRef(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [incidentType, setIncidentType] = useState('heat illness');
  const [incidentSeverity, setIncidentSeverity] = useState<Risk>('High');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [reporter, setReporter] = useState('');
  const [alertRisk, setAlertRisk] = useState<Risk>('High');
  const [alertLanguage, setAlertLanguage] = useState('en');
  const [alertChannel, setAlertChannel] = useState<AlertChannel>('browser');
  const [uiLanguage, setUiLanguage] = useState<UiLanguage>('en');
  const [readinessComplete, setReadinessComplete] = useState(false);
  const [replayCaseId, setReplayCaseId] = useState('');
  const [personalAge, setPersonalAge] = useState('adult');
  const [personalActivity, setPersonalActivity] = useState('moderate');
  const [acclimatized, setAcclimatized] = useState(false);
  const [personalResult, setPersonalResult] = useState<{
    htsi_score: number;
    risk_level: Risk;
    recommended_action: string;
  } | null>(null);

  // SIH26083 Extended State
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);

  const selected = useMemo(() => {
    const district =
      districts.find((item) => item.district === selectedName) ?? districts[0];
    return detail?.district === selectedName
      ? { ...district, ...detail.current }
      : district;
  }, [detail, districts, selectedName]);

  const [showActionChecklist, setShowActionChecklist] = useState(false);

  const selectedActionPlan = useMemo(() => {
    return (
      selected.action_plan ??
      generateThermalStressActionPlan({
        temp: selected.temp,
        humidity: selected.humidity,
        wind: selected.wind,
        solar: selected.solar,
        uv: selected.uv,
        wbgt: selected.wbgt ?? detail?.current.wbgt,
        heat_index: selected.heat_index ?? detail?.current.heat_index,
        pet: selected.pet ?? detail?.current.pet,
        htsi: selected.htsi,
        risk: selected.risk,
        district: selected.district,
      })
    );
  }, [selected, detail]);
  const copy = shellCopy[uiLanguage];
  const dateLocale =
    uiLanguage === 'hi'
      ? 'hi-IN'
      : uiLanguage === 'te'
        ? 'te-IN'
        : uiLanguage === 'kn'
          ? 'kn-IN'
          : 'en-IN';
  const canManage = session?.role === 'officer' || session?.role === 'admin';
  const hotspots = useMemo(
    () => [...districts].sort((a, b) => b.htsi - a.htsi).slice(0, 5),
    [districts],
  );
  const alphabeticalDistricts = useMemo(
    () =>
      [...districts].sort((a, b) => a.district.localeCompare(b.district, 'en')),
    [districts],
  );
  const highCount = districts.filter((item) =>
    ['High', 'Extreme', 'Emergency'].includes(item.risk),
  ).length;
  const districtReplayCases = useMemo(
    () =>
      dashboard?.validation.replay_cases.filter(
        (item) => item.district === selectedName,
      ) ?? [],
    [dashboard, selectedName],
  );
  const selectedReplay = useMemo(
    () =>
      districtReplayCases.find((item) => item.id === replayCaseId) ??
      districtReplayCases[0],
    [districtReplayCases, replayCaseId],
  );
  const mapDistricts = useMemo(
    () =>
      mapHorizon === 0
        ? districts
        : (forecastMap?.layers[String(mapHorizon) as '24' | '48' | '72'] ??
          districts),
    [districts, forecastMap, mapHorizon],
  );
  const selectedMapDistrict = useMemo(
    () =>
      mapDistricts.find((item) => item.district === selectedName) ??
      mapDistricts[0],
    [mapDistricts, selectedName],
  );
  const selectedAutomaticWarnings = useMemo(
    () =>
      automaticWarnings.filter((warning) => warning.district === selectedName),
    [automaticWarnings, selectedName],
  );

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [data, actor] = await Promise.all([
        api<DashboardData>('/api/dashboard'),
        api<SessionData>('/api/session'),
      ]);
      setDashboard(data);
      setDistricts(data.districts);
      setSession(actor);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Live dashboard unavailable',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadForecastMap = useCallback(async (refresh = false) => {
    setMapLoading(true);
    try {
      const data = await api<ForecastMapData>(
        `/api/forecast-map${refresh ? '?refresh=true' : ''}`,
      );
      setForecastMap(data);
      const warningData = await api<{ warnings: AutomaticWarning[] }>(
        '/api/warnings',
      );
      setAutomaticWarnings(warningData.warnings);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Forecast map unavailable',
      );
    } finally {
      setMapLoading(false);
    }
  }, []);

  const loadDetail = useCallback(
    async (district: string, facilities = false) => {
      const requestId = ++detailRequest.current;
      setDetailLoading(true);
      setDetail(null);
      try {
        const result = await api<DistrictDetail>(
          `/api/district?district=${encodeURIComponent(district)}${facilities ? '&facilities=true' : ''}`,
        );
        if (requestId === detailRequest.current) setDetail(result);
      } catch (requestError) {
        if (requestId !== detailRequest.current) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'District detail unavailable',
        );
      } finally {
        if (requestId === detailRequest.current) setDetailLoading(false);
      }
    },
    [],
  );

  const loadRecords = useCallback(
    async (district: string) => {
      if (!canManage) return;
      try {
        const [history, alertData, incidentData, warningData] =
          await Promise.all([
            api<HistoryData>(
              `/api/history?district=${encodeURIComponent(district)}`,
            ).catch(() => ({
              district,
              observations: [],
              predictions: [],
              counts: { observations: 0, predictions: 0 },
            })),
            api<{ alerts: AlertRow[] }>(
              `/api/alerts?district=${encodeURIComponent(district)}`,
            ).catch(() => ({ alerts: [] })),
            api<{ incidents: IncidentRow[] }>(
              `/api/incidents?district=${encodeURIComponent(district)}`,
            ).catch(() => ({ incidents: [] })),
            api<{ warnings: AutomaticWarning[] }>(
              `/api/warnings?district=${encodeURIComponent(district)}`,
            ).catch(() => ({ warnings: [] })),
          ]);
        setHistoryData(history);
        setAlerts(alertData.alerts);
        setIncidents(incidentData.incidents);
        setAutomaticWarnings(warningData.warnings);
      } catch {
        // Safe fallback - avoid popping user-facing errors
      }
    },
    [canManage],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => void loadDashboard(), 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);
  useEffect(() => {
    const timer = window.setTimeout(
      () => void loadDetail(selectedName, canManage && view === 'response'),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [selectedName, view, canManage, loadDetail]);
  useEffect(() => {
    if ((view === 'map' || (canManage && view === 'alerts')) && !forecastMap) {
      const timer = window.setTimeout(() => void loadForecastMap(), 0);
      return () => window.clearTimeout(timer);
    }
  }, [view, canManage, forecastMap, loadForecastMap]);
  useEffect(() => {
    if (canManage && ['history', 'alerts', 'response'].includes(view)) {
      const timer = window.setTimeout(
        () => void loadRecords(selectedName),
        0,
      );
      return () => window.clearTimeout(timer);
    }
  }, [canManage, view, selectedName, loadRecords]);
  useEffect(() => {
    if (error === 'Saved records could not be loaded.') {
      setError('');
    }
  }, [error]);
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    const timer = window.setTimeout(
      () => setOnline(window.navigator.onLine),
      0,
    );
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem('thermowatch-language');
      if (saved === 'hi' || saved === 'te' || saved === 'kn') {
        setUiLanguage(saved);
        setAlertLanguage(saved);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (
      !automaticWarnings.length ||
      !('Notification' in window) ||
      Notification.permission !== 'granted'
    )
      return;
    const timer = window.setTimeout(() => {
      let stored: string[] = [];
      try {
        stored = JSON.parse(
          window.localStorage.getItem('thermowatch-notified-warnings') ?? '[]',
        ) as string[];
      } catch {
        stored = [];
      }
      const notified = new Set(stored);
      const fresh = automaticWarnings.filter(
        (warning) => !notified.has(warning.id),
      );
      fresh.slice(0, 3).forEach((warning) => {
        new Notification(
          `HeatVector · ${warning.district} +${warning.horizon_hours}h`,
          {
            body: `${warning.risk} forecast risk · ${Math.round(warning.probability)}% High+ probability.`,
          },
        );
        notified.add(warning.id);
      });
      window.localStorage.setItem(
        'thermowatch-notified-warnings',
        JSON.stringify([...notified].slice(-120)),
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, [automaticWarnings]);

  function changeLanguage(language: UiLanguage) {
    setUiLanguage(language);
    setAlertLanguage(language);
    window.localStorage.setItem('thermowatch-language', language);
    document.documentElement.lang =
      language === 'hi'
        ? 'hi-IN'
        : language === 'te'
          ? 'te-IN'
          : language === 'kn'
            ? 'kn-IN'
            : 'en-IN';
  }

  function selectDistrict(item: District) {
    setSelectedName(item.district);
    setMobileNav(false);
  }
  function changeView(next: View) {
    if (officerViews.has(next) && !canManage) {
      window.location.assign('/login?next=/');
      return;
    }
    setView(next);
    setMobileNav(false);
    setNotice('');
  }

  async function signOutOfficer() {
    await fetch('/api/security-demo', { method: 'DELETE' }).catch(
      () => undefined,
    );
    setSession({
      id: null,
      email: null,
      name: null,
      role: 'public',
      signed_in: false,
    });
    setHistoryData(null);
    setAlerts([]);
    setIncidents([]);
    setView('overview');
    setNotice('Officer session ended. Public information remains available.');
  }

  async function calculatePersonal() {
    try {
      const result = await api<{
        htsi_score: number;
        risk_level: Risk;
        recommended_action: string;
      }>('/api/htsi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature_c: selected.temp,
          humidity_pct: selected.humidity,
          wind_speed_ms: selected.wind,
          uv_index: selected.uv,
          age_group: personalAge,
          activity: personalActivity,
          acclimatized,
        }),
      });
      setPersonalResult(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Screening failed',
      );
    }
  }

  async function submitIncident(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');
    try {
      const result = await api<{ id: string }>('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: selected.district,
          incident_type: incidentType,
          severity: incidentSeverity,
          description: incidentDescription,
          reporter,
        }),
      });
      setIncidentDescription('');
      setNotice(`Incident ${result.id} recorded in the authority trail.`);
      await loadRecords(selected.district);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Incident could not be saved',
      );
    }
  }

  async function sendAlert() {
    setNotice('');
    try {
      if (
        alertChannel === 'browser' &&
        'Notification' in window &&
        Notification.permission === 'default'
      )
        await Notification.requestPermission();
      if (!canManage) {
        const preview = `${alertRisk} heat-risk warning for ${selected.district}. Avoid peak-hour exposure, stay hydrated and check vulnerable people.`;
        if (
          alertChannel === 'browser' &&
          'Notification' in window &&
          Notification.permission === 'granted'
        )
          new Notification(`HeatVector demo · ${selected.district}`, {
            body: preview,
          });
        setNotice(
          `${alertChannel === 'browser' ? 'Browser' : alertChannel === 'sms' ? 'SMS' : 'WhatsApp'} demo preview generated locally. Nothing was sent or stored.`,
        );
        return;
      }
      const result = await api<{
        id: string;
        message: string;
        delivery_mode: 'live' | 'demo';
      }>('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: selected.district,
          risk: alertRisk,
          channel: alertChannel,
          language: alertLanguage,
        }),
      });
      if (
        alertChannel === 'browser' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      )
        new Notification(`HeatVector · ${selected.district}`, {
          body: result.message,
        });
      setNotice(
        result.delivery_mode === 'live'
          ? `Alert ${result.id} sent and stored.`
          : `${alertChannel === 'sms' ? 'SMS' : 'WhatsApp'} demo ${result.id} generated and stored without external delivery.`,
      );
      await loadRecords(selected.district);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Alert could not be sent',
      );
    }
  }

  async function acknowledgeAlert(id: string) {
    await api('/api/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotice(`Alert ${id} acknowledged.`);
    await loadRecords(selected.district);
  }

  async function runReadinessSimulation() {
    setReadinessComplete(false);
    setNotice('');
    try {
      await Promise.all([
        loadDashboard(),
        loadDetail(selected.district),
        loadForecastMap(true),
      ]);
      setReadinessComplete(true);
      setNotice(
        'Hackathon readiness simulation completed using live APIs, forecast layers and stored model evidence.',
      );
    } catch {
      setError('The readiness simulation could not complete every check.');
    }
  }

  const navLabel = copy.nav[view];
  const liveSource = detail?.source ?? selected.source;
  const sourceLabel =
    liveSource === 'open-meteo-live-ensemble'
      ? 'Live ensemble connected'
      : liveSource === 'met-norway-live-forecast'
        ? 'Live MET Norway connected'
        : liveSource === 'open-meteo'
          ? 'Live Open-Meteo connected'
          : 'Resilient demonstration data';
  const hasLiveWeather = liveSource !== 'resilient-fallback';

  return (
    <KannadaLocalizer enabled={uiLanguage === 'kn'}>
      <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex font-sans selection:bg-slate-900 selection:text-white">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[265px] flex flex-col border-r border-slate-200 bg-white px-3.5 py-4 text-slate-900 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Copernicus Brand Header */}
          <div className="relative flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs shadow-blue-500/20">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-slate-900 font-display">
                    HeatVector
                  </span>
                  <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-700">
                    LIVE
                  </span>
                </div>
                <span className="font-mono text-[9.5px] text-slate-400 block tracking-wider uppercase">
                  DISASTER DECISION
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="ml-auto text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-md lg:hidden"
              onClick={() => setMobileNav(false)}
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Officer Session Banner inside Drawer */}
          <div className="my-2 rounded-lg border border-slate-200 bg-slate-50/80 p-2.5">
            {canManage ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="grid h-6.5 w-6.5 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-900">
                      {session?.name ?? 'Officer'}
                    </p>
                    <p className="font-mono text-[9px] text-emerald-700 font-medium">Command Active</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    signOutOfficer();
                    setMobileNav(false);
                  }}
                  className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[9.5px] text-slate-600 hover:bg-slate-100 hover:text-slate-900 shrink-0 font-medium"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="grid h-6.5 w-6.5 shrink-0 place-items-center rounded-md bg-white text-slate-500 border border-slate-200">
                    <LockKeyhole className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800">Public Observer</p>
                    <p className="font-mono text-[9px] text-slate-400">Restricted Tools</p>
                  </div>
                </div>
                <Link
                  href="/login?next=/"
                  onClick={() => setMobileNav(false)}
                  className="rounded-md bg-slate-900 px-2.5 py-0.5 font-mono text-[10px] text-white hover:bg-slate-800 shrink-0 font-medium shadow-2xs"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          <nav
            className="flex-1 space-y-3.5 overflow-y-auto pr-1 text-xs"
            aria-label="Main navigation"
          >
            {/* 1. Core Innovations Group */}
            <div>
              <p className="px-2 pb-1 font-mono text-[9.5px] font-semibold tracking-wider text-slate-400 uppercase">
                CORE PROTOTYPE FLOW
              </p>
              <div className="space-y-0.5">
                {navigation.filter((n) => n.group === 'core').map(({ id, icon: Icon }) => {
                  const isActive = view === id;
                  return (
                    <button
                      key={id}
                      onClick={() => changeView(id)}
                      className={`group flex min-h-8.5 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900 ${
                        isActive
                          ? 'bg-slate-900 text-white font-medium shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-normal'
                      }`}
                    >
                      <span
                        className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-md transition-colors ${
                          isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="truncate">{copy.nav[id]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Officer Operations Group */}
            <div>
              <p className="px-2 pb-1 font-mono text-[9.5px] font-semibold tracking-wider text-slate-400 uppercase">
                {canManage ? 'OFFICER COMMAND ACTIVE' : 'AUTHORITY OPERATIONS'}
              </p>
              <div className="space-y-0.5">
                {navigation
                  .filter((n) => n.group === 'authority')
                  .map(({ id, icon: Icon }) => {
                    const locked = !canManage;
                    const isActive = view === id;
                    return (
                      <button
                        key={id}
                        onClick={() => changeView(id)}
                        className={`group flex min-h-8.5 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900 ${
                          isActive
                            ? 'bg-slate-900 text-white font-medium shadow-2xs'
                            : locked
                              ? 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 font-normal'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-normal'
                        }`}
                      >
                        <span
                          className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-md transition-colors ${
                            isActive ? 'text-blue-400' : locked ? 'text-slate-300' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="truncate">{copy.nav[id]}</span>
                        {locked && <LockKeyhole className="ml-auto h-3 w-3 text-slate-300" />}
                        {!locked && id === 'alerts' && (
                          <span className="ml-auto rounded-full bg-red-50 border border-red-200 text-red-700 px-1.5 py-0.2 font-mono text-[9px] font-bold">
                            {highCount} High
                          </span>
                        )}
                        {!locked && id === 'cooling-centers' && (
                          <span className="ml-auto rounded border border-slate-200 bg-slate-100 px-1.5 py-0.2 font-mono text-[9px] text-slate-600 font-medium">
                            Officer
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
              {!canManage && (
                <div className="mt-2 rounded-lg border border-dashed border-amber-200 bg-amber-50/60 p-2.5">
                  <p className="text-[10px] text-amber-800 font-medium leading-snug mb-1.5">
                    Authority tools require officer sign-in.
                  </p>
                  <Link
                    href="/login?next=/"
                    onClick={() => setMobileNav(false)}
                    className="flex w-full items-center justify-center gap-1 rounded-md bg-slate-900 py-1.5 text-[10px] font-semibold text-white hover:bg-slate-800 transition"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Officer Sign In
                  </Link>
                </div>
              )}
            </div>
          </nav>
          <div className="mt-auto pt-2.5">
            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-2.5 font-mono text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${hasLiveWeather ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}
                />
                <span className="text-slate-800 font-medium">{sourceLabel}</span>
              </div>
              <span className="mt-1 block border-t border-slate-200/80 pt-1 text-[9px] text-slate-400">
                MODEL {dashboard?.model.model_version ?? 'htsi-logit-4.0'}
              </span>
            </div>
          </div>
        </aside>
        {mobileNav && (
          <button
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation overlay"
          />
        )}

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex min-h-[56px] sm:min-h-[60px] items-center justify-between gap-2 border-b border-slate-200 bg-white/95 px-3 py-2 sm:px-6 sm:py-2.5 backdrop-blur-md lg:px-8 shadow-2xs">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 sm:h-8.5 sm:w-8.5 lg:hidden border-slate-200 rounded-lg shrink-0"
                onClick={() => setMobileNav(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-800 min-w-0 truncate">
                <span className="text-slate-400 hidden xs:inline">HeatVector</span>
                <span className="text-slate-300 hidden xs:inline">/</span>
                <span className="font-semibold text-slate-900 truncate">{navLabel}</span>
              </div>
              <div
                className="hidden xl:flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/70 px-2.5 py-0.5 text-[11px] text-blue-700"
                title="HeatVector is a human-risk and intervention decision-support layer built on top of meteorological forecasts."
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="font-medium">Human-Risk Decision Layer</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {canManage ? (
                <button
                  type="button"
                  onClick={signOutOfficer}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-medium text-white shadow-2xs transition hover:bg-slate-800"
                  title={`Signed in as ${session?.name ?? 'officer'}. Click to sign out.`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="hidden md:inline">Officer &middot; Sign out</span>
                  <span className="md:hidden text-[11px]">Officer</span>
                </button>
              ) : (
                <Link
                  href="/login?next=/"
                  className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                >
                  <LockKeyhole className="h-3.5 w-3.5 text-slate-500" />
                  <span>Officer Sign In</span>
                </Link>
              )}

              <NativeSelect
                value={uiLanguage}
                onChange={(event) =>
                  changeLanguage(event.target.value as UiLanguage)
                }
                aria-label="Interface language"
                className="h-8 w-[64px] sm:w-[76px] text-xs border-slate-200 rounded-lg px-1 sm:px-2 bg-white text-slate-700"
              >
                <NativeSelectOption value="en">EN</NativeSelectOption>
                <NativeSelectOption value="hi">हिन्दी</NativeSelectOption>
                <NativeSelectOption value="mr">मराठी</NativeSelectOption>
                <NativeSelectOption value="te">తెలుగు</NativeSelectOption>
                <NativeSelectOption value="kn">ಕನ್ನಡ</NativeSelectOption>
              </NativeSelect>

              <Button
                variant="cobalt"
                size="sm"
                onClick={() => setAssistantModalOpen(true)}
                className="h-8 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 px-3 shadow-2xs"
                title="AI Assistant"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-200 shrink-0" />
                <span className="hidden sm:inline">AI Assistant</span>
              </Button>

              <NativeSelect
                value={selected.district}
                onChange={(event) => setSelectedName(event.target.value)}
                aria-label="Select monitoring district"
                className="h-8 text-xs border-slate-200 rounded-lg max-w-[95px] xs:max-w-[125px] sm:max-w-[160px] md:max-w-[180px] bg-white text-slate-800"
              >
                {alphabeticalDistricts.map((item) => (
                  <NativeSelectOption key={item.district} value={item.district}>
                    {item.district}
                  </NativeSelectOption>
                ))}
              </NativeSelect>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 sm:px-2.5 border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700"
                onClick={loadDashboard}
                disabled={loading}
                title={copy.refresh}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </header>
          <main className="mx-auto max-w-[1540px] p-3 sm:p-6 lg:p-8 xl:px-10">
            {error && (
              <div
                role="alert"
                className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs sm:text-sm text-red-700"
              >
                <span>{error}</span>
                <button onClick={() => setError('')} aria-label="Dismiss error">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {!online && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs sm:text-sm text-slate-600">
                <CloudSun className="h-4 w-4 text-slate-500" />
                Offline mode: cached public weather and forecast views remain available. Record submission and authority actions require a connection.
              </div>
            )}
            {notice && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs sm:text-sm text-emerald-800">
                <Check className="h-4 w-4 text-emerald-600" />
                {notice}
              </div>
            )}

            {view === 'overview' && (
              <div className="space-y-6">
                {/* Copernicus & Palantir Command Hero Header */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-3.5">
                      <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-0.5 text-[11px] font-semibold text-blue-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>DISASTER MANAGEMENT · LIVE OVERVIEW</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-display">
                        Heat conditions, made actionable.
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                        See where heat is rising, who is exposed, and what response should come next. Real-time biometeorological synthesis across Indian urban centers.
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <Button
                          onClick={() => setAssistantModalOpen(true)}
                          className="bg-slate-900 text-white hover:bg-slate-800 shadow-xs h-8.5 px-4 text-xs font-medium rounded-lg"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                          Ask Heat Assistant &rarr;
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => changeView('hyperlocal-gis')}
                          className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 h-8.5 px-4 text-xs font-medium rounded-lg"
                        >
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          Inspect Ward GIS
                        </Button>
                      </div>
                    </div>

                    {/* Operational Directive HUD Card */}
                    <div className="lg:col-span-4">
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-white shadow-sm">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            HEAT DIRECTIVE
                          </span>
                          <span className="rounded bg-slate-800 border border-slate-700 text-slate-300 px-1.5 py-0.2 text-[9px]">
                            {selected.source !== 'resilient-fallback' ? 'LIVE' : 'DEMO'}
                          </span>
                        </div>
                        <div className="mt-3.5 flex items-baseline justify-between">
                          <div>
                            <span className="text-3xl font-bold tracking-tight text-white">{selected.temp}°C</span>
                            <p className="text-xs font-semibold text-slate-200 mt-0.5">{selected.district}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-amber-400 font-mono block">{selected.htsi}/100</span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">{selected.risk} Risk</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setAssistantModalOpen(true)}
                          className="mt-4 w-full rounded-lg bg-blue-600 hover:bg-blue-500 py-2 text-xs font-semibold text-white transition-colors shadow-xs"
                        >
                          View Action Plan &rarr;
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Counter Stats Row */}
                  <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-4 text-center sm:text-left">
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        50+
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                        DISTRICTS MONITORED
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        48h
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                        ENSEMBLE HORIZON
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        600+
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                        DAILY ACTIONS
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-12">
                  <div className="contents">
                    <Card className="relative border-slate-200/80 bg-white text-slate-900 shadow-sm xl:col-span-4">
                      <CardHeader className="flex-row items-start justify-between pb-2">
                        <div>
                          <p className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            CURRENT HUMAN THERMAL STRESS
                          </p>
                          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                            {selected.district}
                          </h2>
                          <p className="mt-0.5 text-xs text-slate-500 font-medium">
                            {selected.temp}°C · {selected.humidity}% humidity ·{' '}
                            {selected.source !== 'resilient-fallback'
                              ? 'live weather'
                              : 'safe fallback'}
                          </p>
                        </div>
                        <RiskBadge risk={selected.risk} />
                      </CardHeader>
                      <CardContent>
                        <div className="mt-2 flex items-baseline gap-2">
                          <strong
                            className="text-6xl font-black leading-none tracking-tight"
                            style={{ color: riskStyle[selected.risk].color }}
                          >
                            {selected.htsi}
                          </strong>
                          <span className="pb-1 text-sm font-semibold text-slate-400">
                            / 100 HTSI
                          </span>
                        </div>
                        <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-slate-100">
                          <i
                            className="block h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${selected.htsi}%`,
                              background: riskStyle[selected.risk].color,
                            }}
                          />
                        </div>
                        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
                            <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              WBGT
                            </span>
                            <b className="mt-0.5 block text-sm font-bold text-slate-800">
                              {selected.wbgt ?? detail?.current.wbgt ?? '—'}°C
                            </b>
                          </div>
                          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
                            <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              HEAT INDEX
                            </span>
                            <b className="mt-0.5 block text-sm font-bold text-slate-800">
                              {selected.heat_index ??
                                detail?.current.heat_index ??
                                '—'}
                              °C
                            </b>
                          </div>
                          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
                            <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              PET
                            </span>
                            <b className="mt-0.5 block text-sm font-bold text-slate-800">
                              {selected.pet ?? detail?.current.pet ?? '—'}°C
                            </b>
                          </div>
                        </div>

                        {/* Minimalist Multi-Condition Recommended Action Plan */}
                        <div className="mt-4 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs space-y-2.5">
                          {/* Clean Header: Label + Urgency Badge */}

                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                              <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: selectedActionPlan.urgency_color }}
                              />
                              <span className="font-mono text-[10px] tracking-wider uppercase text-slate-500">
                                RECOMMENDED ACTION
                              </span>
                            </div>
                            <span
                              className="rounded-md px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white"
                              style={{ backgroundColor: selectedActionPlan.urgency_color }}
                            >
                              {selectedActionPlan.urgency}
                            </span>
                          </div>

                          {/* High-level Synthesized Directive */}
                          <p className="text-[12px] font-semibold text-slate-800 leading-snug">
                            {selectedActionPlan.headline}
                          </p>

                          {/* 4 Condition Parameter Cards (Minimalist 2x2 Grid) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                            {/* Workers */}
                            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-2 text-[11px]">
                              <div className="flex items-center justify-between text-purple-800 font-bold text-[10.5px]">
                                <span className="flex items-center gap-1">
                                  <HardHat className="h-3 w-3 text-purple-600 shrink-0" />
                                  Outdoor Workers
                                </span>
                                <span className="font-mono text-[9px] text-slate-400 font-normal">ISO 7243</span>
                              </div>
                              <p className="mt-1 text-slate-600 text-[10.5px] leading-tight font-medium">
                                {selectedActionPlan.workers.short_action}
                              </p>
                            </div>

                            {/* Vulnerable Cohorts */}
                            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-2 text-[11px]">
                              <div className="flex items-center justify-between text-rose-800 font-bold text-[10.5px]">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3 text-rose-600 shrink-0" />
                                  Vulnerable Cohorts
                                </span>
                                <span className="font-mono text-[9px] text-slate-400 font-normal">Community</span>
                              </div>
                              <p className="mt-1 text-slate-600 text-[10.5px] leading-tight font-medium">
                                {selectedActionPlan.people.short_action}
                              </p>
                            </div>

                            {/* Environmental Climate */}
                            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-2 text-[11px]">
                              <div className="flex items-center justify-between text-amber-800 font-bold text-[10.5px]">
                                <span className="flex items-center gap-1">
                                  <Sun className="h-3 w-3 text-amber-600 shrink-0" />
                                  Climate Trigger
                                </span>
                                <span className="font-mono text-[9px] text-slate-400 font-normal">Environment</span>
                              </div>
                              <p className="mt-1 text-slate-600 text-[10.5px] leading-tight font-medium">
                                {selectedActionPlan.environmental.short_action}
                              </p>
                            </div>

                            {/* Civic & Healthcare */}
                            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-2 text-[11px]">
                              <div className="flex items-center justify-between text-teal-800 font-bold text-[10.5px]">
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3 text-teal-600 shrink-0" />
                                  Civic & Hospitals
                                </span>
                                <span className="font-mono text-[9px] text-slate-400 font-normal">Logistics</span>
                              </div>
                              <p className="mt-1 text-slate-600 text-[10.5px] leading-tight font-medium">
                                {selectedActionPlan.infrastructure.short_action}
                              </p>
                            </div>
                          </div>

                          {/* Clean Accordion for Full Protocol Details */}
                          <div className="pt-0.5 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setShowActionChecklist(!showActionChecklist)}
                              className="flex items-center justify-between w-full text-[10.5px] font-medium text-slate-500 hover:text-slate-800 transition py-0.5"
                            >
                              <span>
                                {showActionChecklist
                                  ? 'Hide detailed protocol'
                                  : `View full action protocol (${selectedActionPlan.checklist.length} items)`}
                              </span>
                              <span className="text-[9px] text-slate-400">{showActionChecklist ? '▲' : '▼'}</span>
                            </button>

                            {showActionChecklist && (
                              <div className="mt-2 space-y-2 rounded-lg border border-slate-150 bg-slate-50/70 p-2.5 text-[10.5px]">
                                <p className="text-slate-600 text-[11px] leading-relaxed pb-1.5 border-b border-slate-200/60">
                                  {selectedActionPlan.summary}
                                </p>
                                <div className="space-y-1 pt-0.5">
                                  {selectedActionPlan.checklist.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-1.5 text-slate-700 leading-tight">
                                      <span
                                        className={`rounded px-1.5 py-0.2 font-mono text-[8.5px] font-bold uppercase shrink-0 ${
                                          item.priority === 'Critical'
                                            ? 'bg-red-100 text-red-700'
                                            : item.priority === 'High'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-slate-200 text-slate-700'
                                        }`}
                                      >
                                        {item.priority}
                                      </span>
                                      <span>
                                        <strong className="text-slate-900">[{item.category}]</strong> {item.action}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>

                    </Card>
                    <Card className="xl:col-span-8">
                      <CardHeader>
                        <PanelTitle
                          eyebrow="SPATIAL VIEW"
                          title="India risk map"
                          action={
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setView('map')}
                            >
                              Explore <ChevronRight />
                            </Button>
                          }
                        />
                      </CardHeader>
                      <CardContent>
                        <IndiaMap
                          districts={districts}
                          selected={selected}
                          onSelect={selectDistrict}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="contents" data-section="risk-horizon">
                    <Card className="xl:col-span-12">
                      <CardHeader>
                        <PanelTitle
                          eyebrow="NEXT WARNING WINDOW"
                          title="Risk horizon"
                        />
                      </CardHeader>
                      <CardContent>
                        {detailLoading && !detail ? (
                          <Loading />
                        ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-start">
                            <div className="grid grid-cols-3 gap-3">
                              {(
                                detail?.horizons ??
                                [24, 48, 72].map((hours, index) => ({
                                  horizon_hours: hours,
                                  probability: Math.max(
                                    28,
                                    selected.probability - index * 12,
                                  ),
                                  predicted_class:
                                    index === 2
                                      ? ('Moderate' as Risk)
                                      : selected.risk,
                                  htsi: selected.htsi,
                                  high_risk_probability: Math.max(
                                    10,
                                    selected.probability - index * 15,
                                  ),
                                }))
                              ).map((item) => (
                                <button
                                  key={item.horizon_hours}
                                  onClick={() => setView('forecast')}
                                  className="cursor-pointer rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 space-y-1.5"
                                >
                                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    +{item.horizon_hours}h Forecast
                                  </span>
                                  <strong
                                    className="block text-3xl font-black leading-none"
                                    style={{
                                      color: riskStyle[item.predicted_class].color,
                                    }}
                                  >
                                    {item.probability}%
                                  </strong>
                                  <span className="block text-[10px] text-slate-400 font-mono">probability</span>
                                  <div className="pt-1">
                                    <RiskBadge risk={item.predicted_class} />
                                  </div>
                                  {'high_risk_probability' in item && (
                                    <span className="block text-[10px] text-slate-500 font-medium mt-0.5">
                                      High-risk: {item.high_risk_probability}%
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                            <div className="flex flex-col gap-3 lg:w-72">
                              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-blue-950 font-medium flex items-start gap-2.5">
                                <CloudSun className="h-5 w-5 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">PEAK ALERT WINDOW</span>
                                  <b className="text-sm">
                                    {detail?.peak
                                      ? new Date(detail.peak.time).toLocaleString(
                                          dateLocale,
                                          {
                                            weekday: 'short',
                                            day: 'numeric',
                                            month: 'short',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            timeZone: 'Asia/Kolkata',
                                          },
                                        )
                                      : 'Forecast unavailable'}
                                    {detail?.peak && ' IST'}
                                  </b>
                                  {detail?.source === 'resilient-fallback' && (
                                    <small className="mt-1 block text-blue-700/70">
                                      Demo estimate — live forecast unavailable.
                                    </small>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => setView('forecast')}
                                className="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition px-3.5 py-2.5 text-xs font-semibold text-slate-700 text-left flex items-center gap-2"
                              >
                                <TrendingUp className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                View full 5-day forecast
                                <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-400" />
                              </button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">

                  <Card>
                    <CardHeader>
                      <PanelTitle
                        eyebrow="PERSONALIZED SCREENING"
                        title="Adjust exposure context"
                        note="Not a medical diagnosis."
                      />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <label
                          htmlFor="personal-age"
                          className="text-[10px] font-semibold text-slate-500"
                        >
                          AGE
                          <NativeSelect
                            id="personal-age"
                            className="mt-1 w-full"
                            value={personalAge}
                            onChange={(event) =>
                              setPersonalAge(event.target.value)
                            }
                          >
                            <NativeSelectOption value="adult">
                              Adult
                            </NativeSelectOption>
                            <NativeSelectOption value="child">
                              Child
                            </NativeSelectOption>
                            <NativeSelectOption value="elderly">
                              Older adult
                            </NativeSelectOption>
                          </NativeSelect>
                        </label>
                        <label
                          htmlFor="personal-activity"
                          className="text-[10px] font-semibold text-slate-500"
                        >
                          ACTIVITY
                          <NativeSelect
                            id="personal-activity"
                            className="mt-1 w-full"
                            value={personalActivity}
                            onChange={(event) =>
                              setPersonalActivity(event.target.value)
                            }
                          >
                            <NativeSelectOption value="resting">
                              Resting
                            </NativeSelectOption>
                            <NativeSelectOption value="moderate">
                              Moderate
                            </NativeSelectOption>
                            <NativeSelectOption value="heavy">
                              Heavy work
                            </NativeSelectOption>
                          </NativeSelect>
                        </label>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={acclimatized}
                          onChange={(event) =>
                            setAcclimatized(event.target.checked)
                          }
                        />{' '}
                        Acclimatized to local heat
                      </label>
                      <Button className="w-full" onClick={calculatePersonal}>
                        <UserRound />
                        Calculate personal HTSI
                      </Button>
                      {personalResult && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              Personal HTSI
                            </span>
                            <strong
                              className="text-2xl"
                              style={{
                                color:
                                  riskStyle[personalResult.risk_level].color,
                              }}
                            >
                              {personalResult.htsi_score}
                            </strong>
                            <RiskBadge risk={personalResult.risk_level} />
                          </div>
                          <p className="mt-2 text-xs text-slate-500">
                            {personalResult.recommended_action}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <PanelTitle
                        eyebrow="AUTHORITY OPERATIONS"
                        title="Officer command center"
                        note={canManage ? `Signed in as ${session?.name ?? 'officer'} · Full access.` : 'Restricted to authorized disaster management officers.'}
                      />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {canManage ? (
                        <>
                          {[
                            { label: 'What-If Simulator', id: 'what-if' as View, icon: Sliders, color: 'text-blue-700 bg-blue-50 border-blue-200' },
                            { label: 'Hospital & Facility Response', id: 'response' as View, icon: HeartPulse, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
                            { label: 'Multichannel Alert Dispatch', id: 'alerts' as View, icon: Bell, color: 'text-red-700 bg-red-50 border-red-200' },
                            { label: 'Authority Heat Action Plan', id: 'cooling-centers' as View, icon: ShieldCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                          ].map(({ label, id: btnId, icon: Ico, color }) => (
                            <button
                              key={btnId}
                              onClick={() => changeView(btnId)}
                              className={`flex w-full items-center gap-2.5 rounded-xl border p-3 text-xs font-semibold transition hover:opacity-90 ${color}`}
                            >
                              <Ico className="h-4 w-4 shrink-0" />
                              {label}
                              <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mb-3">
                            <LockKeyhole className="h-6 w-6" />
                          </div>
                          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                            Sign in as an authorized officer to access heat action plans, multichannel alert dispatch, and hospital response coordination.
                          </p>
                          <Link
                            href="/login?next=/"
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            Officer Sign In
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {view === 'forecast' && (
              <div className="space-y-5">
                {detailLoading && !detail ? (
                  <Loading />
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {detail?.horizons.map((item) => (
                        <Stat
                          key={item.horizon_hours}
                          label={`${item.horizon_hours}-hour warning`}
                          value={`${Math.round(item.probability)}%`}
                          detail={`${item.predicted_class} confidence · ${Math.round(item.high_risk_probability)}% High+`}
                          tone={
                            item.predicted_class === 'Extreme'
                              ? 'red'
                              : item.predicted_class === 'High'
                                ? 'amber'
                                : 'blue'
                          }
                        />
                      ))}
                    </div>
                    <div className="grid gap-5 lg:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <PanelTitle
                            eyebrow="FIVE-DAY OUTLOOK"
                            title="Forecast HTSI"
                            note="Three-hour rolling thermal-stress signal."
                          />
                        </CardHeader>
                        <CardContent>
                          <ChartContainer
                            config={{
                              htsi: { label: 'HTSI', color: '#f59e0b' },
                            }}
                            className="h-[300px] w-full"
                          >
                            <AreaChart data={detail?.forecast ?? []}>
                              <CartesianGrid vertical={false} />
                              <XAxis dataKey="label" minTickGap={36} />
                              <YAxis domain={[0, 100]} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Area
                                type="monotone"
                                dataKey="htsi"
                                stroke="var(--color-htsi)"
                                fill="var(--color-htsi)"
                                fillOpacity={0.16}
                                strokeWidth={2.5}
                              />
                            </AreaChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <PanelTitle
                            eyebrow="TEMPERATURE"
                            title="Heat profile"
                            note="Colour follows predicted risk class."
                          />
                        </CardHeader>
                        <CardContent>
                          <ChartContainer
                            config={{
                              temp: {
                                label: 'Temperature °C',
                                color: '#2563eb',
                              },
                            }}
                            className="h-[300px] w-full"
                          >
                            <BarChart data={detail?.forecast ?? []}>
                              <CartesianGrid vertical={false} />
                              <XAxis dataKey="label" minTickGap={36} />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="temp" radius={[5, 5, 0, 0]}>
                                {detail?.forecast.map((item, index) => (
                                  <Cell
                                    key={index}
                                    fill={riskStyle[item.risk].color}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <PanelTitle
                          eyebrow="EXPLAINABLE PREDICTION"
                          title="Why the risk moves"
                          note="Temperature, humidity, WBGT, PET, solar load, UV, wind and time of day contribute to each class."
                        />
                      </CardHeader>
                      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {(detail?.horizons[0]?.explanation ?? []).map(
                          (item) => (
                            <div
                              key={item.feature}
                              className="rounded-xl bg-slate-50 p-3"
                            >
                              <span className="flex items-center justify-between gap-2 text-xs font-semibold">
                                {item.label}
                                <small
                                  className={
                                    item.direction === 'raises'
                                      ? 'text-red-600'
                                      : 'text-emerald-700'
                                  }
                                >
                                  {item.direction} class
                                </small>
                              </span>
                              <div className="mt-3 h-1.5 rounded-full bg-slate-200">
                                <i
                                  className="block h-full rounded-full bg-blue-700"
                                  style={{ width: `${item.contribution_pct}%` }}
                                />
                              </div>
                              <small className="mt-2 block text-[10px] text-slate-500">
                                {item.contribution_pct}% contribution · value{' '}
                                {item.value}
                              </small>
                            </div>
                          ),
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {view === 'map' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
                  <div>
                    <b className="block text-sm text-slate-900">
                      Forecast risk layer
                    </b>
                    <small className="text-slate-500">
                      ML predictions across all monitored locations
                    </small>
                  </div>
                  <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
                    {([0, 24, 48, 72] as const).map((horizon) => (
                      <button
                        key={horizon}
                        onClick={() => setMapHorizon(horizon)}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                          mapHorizon === horizon
                            ? 'bg-[#10213f] text-white shadow-sm'
                            : 'text-slate-500 hover:bg-white hover:text-slate-800'
                        }`}
                      >
                        {horizon === 0 ? 'Live' : `+${horizon}h`}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadForecastMap(true)}
                    disabled={mapLoading}
                  >
                    <RefreshCw className={mapLoading ? 'animate-spin' : ''} />
                    Refresh layers
                  </Button>
                </div>
                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <Card>
                    <CardHeader>
                      <PanelTitle
                        eyebrow="SPATIAL COMMAND"
                        title={
                          mapHorizon === 0
                            ? 'India live risk map'
                            : `India ${mapHorizon}-hour forecast map`
                        }
                        note={
                          mapHorizon === 0
                            ? 'Current model classifications across monitored districts.'
                            : 'Select a marker to inspect its predicted class and High+ probability.'
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      {mapLoading && !forecastMap && mapHorizon !== 0 ? (
                        <Loading label="Building national forecast layers" />
                      ) : (
                        <IndiaMap
                          districts={mapDistricts}
                          selected={selectedMapDistrict}
                          onSelect={selectDistrict}
                          expanded
                          layerLabel={
                            mapHorizon === 0
                              ? 'Live'
                              : `Forecast +${mapHorizon}h`
                          }
                        />
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <PanelTitle
                        eyebrow="ALL LOCATIONS"
                        title={`${mapDistricts.length} monitored districts`}
                        note={
                          mapHorizon === 0
                            ? 'Ranked by current HTSI.'
                            : 'Ranked by forecast High+ probability.'
                        }
                      />
                    </CardHeader>
                    <CardContent className="max-h-[500px] space-y-1 overflow-auto">
                      {[...mapDistricts]
                        .sort((a, b) =>
                          mapHorizon === 0
                            ? b.htsi - a.htsi
                            : (b.high_risk_probability ?? 0) -
                              (a.high_risk_probability ?? 0),
                        )
                        .map((item) => (
                          <button
                            key={item.district}
                            onClick={() => selectDistrict(item)}
                            className="grid w-full grid-cols-[1fr_auto_48px] items-center gap-3 rounded-xl p-3 text-left hover:bg-slate-50"
                          >
                            <span>
                              <b className="block text-sm">{item.district}</b>
                              <small className="text-slate-400">
                                {item.temp}°C · {item.humidity}% RH
                                {mapHorizon !== 0 && (
                                  <>
                                    {' '}
                                    ·{' '}
                                    {Math.round(
                                      item.high_risk_probability ?? 0,
                                    )}
                                    % High+
                                  </>
                                )}
                              </small>
                            </span>
                            <RiskBadge risk={item.risk} />
                            <strong
                              style={{ color: riskStyle[item.risk].color }}
                            >
                              {item.htsi}
                            </strong>
                          </button>
                        ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {view === 'model' && (
              <div className="space-y-5">
                {dashboard ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Stat
                        label="Test accuracy"
                        value={`${dashboard.model.metrics.accuracy_pct}%`}
                        detail={`${dashboard.model.test_samples} chronological holdout rows`}
                        tone="green"
                      />
                      <Stat
                        label="Macro F1"
                        value={`${dashboard.model.metrics.macro_f1_pct}%`}
                        detail="Observed-class balance"
                        tone="amber"
                      />
                      <Stat
                        label="False alarms"
                        value={dashboard.model.metrics.false_alarms}
                        detail="High+ predicted, lower actual"
                        tone="red"
                      />
                      <Stat
                        label="Missed events"
                        value={dashboard.model.metrics.missed_events}
                        detail="High+ actual, lower predicted"
                        tone="purple"
                      />
                    </div>
                    <Card>
                      <CardHeader>
                        <PanelTitle
                          eyebrow={dashboard.model.model_version}
                          title={dashboard.model.model_type}
                          note={dashboard.model.data_source}
                        />
                      </CardHeader>
                      <CardContent>
                        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                          {dashboard.model.label_note}
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          {dashboard.model.feature_importance.map((item) => (
                            <div
                              key={item.feature}
                              className="grid grid-cols-[130px_1fr_auto] items-center gap-3 rounded-xl bg-slate-50 p-3"
                            >
                              <span className="text-xs">{item.label}</span>
                              <div className="h-2 rounded-full bg-slate-200">
                                <i
                                  className="block h-full rounded-full bg-blue-700"
                                  style={{
                                    width: `${Math.min(100, item.importance_pct * 4)}%`,
                                  }}
                                />
                              </div>
                              <b className="text-[10px] text-slate-500">
                                {item.importance_pct}%
                              </b>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Loading />
                )}
              </div>
            )}

            {view === 'authority' && !canManage && (
              <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80">
                  <LockKeyhole className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 font-display">
                  Authority Command — Restricted Access
                </h3>
                <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  This dashboard contains live operational data, priority queues, and recommended interventions reserved for authorized disaster management officers.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button variant="outline" onClick={() => setView('overview')}>
                    Return to Public Overview
                  </Button>
                  <Link
                    href="/login?next=/"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Officer Sign In</span>
                  </Link>
                </div>
              </div>
            )}

            {view === 'authority' && canManage && (
              <div className="space-y-5">
                {dashboard?.authority ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Stat
                        label="Coverage"
                        value={dashboard.authority.coverage}
                        detail="districts monitored"
                      />
                      <Stat
                        label="High+ zones"
                        value={dashboard.authority.high_risk_count}
                        detail="require action"
                        tone="red"
                      />
                      <Stat
                        label="Active alerts"
                        value={dashboard.authority.active_alerts}
                        detail="awaiting acknowledgement"
                        tone="amber"
                      />
                      <Stat
                        label="Open incidents"
                        value={dashboard.authority.open_incidents}
                        detail="community field reports"
                        tone="purple"
                      />
                    </div>
                    <div className="grid gap-5 lg:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <PanelTitle
                            eyebrow="PRIORITY QUEUE"
                            title="Highest-risk locations"
                            action={
                              <Button
                                variant="outline"
                                onClick={() =>
                                  window.open('/api/export', '_blank')
                                }
                              >
                                <Download />
                                CSV brief
                              </Button>
                            }
                          />
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {dashboard.authority.highest_risk_locations.map(
                            (item) => (
                              <div
                                key={item.district}
                                className="grid grid-cols-[1fr_auto_54px_70px] items-center gap-3 rounded-xl bg-slate-50 p-3"
                              >
                                <b>{item.district}</b>
                                <RiskBadge risk={item.risk} />
                                <strong
                                  style={{ color: riskStyle[item.risk].color }}
                                >
                                  {item.htsi}
                                </strong>
                                <small className="text-right text-slate-400">
                                  {item.probability}% class confidence
                                </small>
                              </div>
                            ),
                          )}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <PanelTitle
                            eyebrow="RESPONSE PLAYBOOK"
                            title="Recommended now"
                            action={
                              <Button
                                variant="outline"
                                onClick={() => window.print()}
                              >
                                <FileText />
                                Print / PDF
                              </Button>
                            }
                          />
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {dashboard.authority.recommended_interventions.map(
                            (item) => (
                              <div
                                key={item}
                                className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900"
                              >
                                <Check className="mt-0.5 h-4 w-4 shrink-0" />
                                {item}
                              </div>
                            ),
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <Loading />
                )}
              </div>
            )}

            {view === 'response' && !canManage && (
              <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80">
                  <LockKeyhole className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 font-display">
                  Hospital & Facility Response — Restricted Access
                </h3>
                <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Hospital resource tracking, heat casualty triage management, and emergency response network coordination require verified disaster management officer credentials.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button variant="outline" onClick={() => setView('overview')}>
                    Return to Public Overview
                  </Button>
                  <Link
                    href="/login?next=/"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Officer Sign In</span>
                  </Link>
                </div>
              </div>
            )}

            {view === 'response' && canManage && (
              <div className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <PanelTitle
                        eyebrow="LIVE HEALTH & RESPONSE NETWORK"
                        title={`${selected.district} response facilities · ${detail?.facilities?.length ?? 0} active`}
                        note="Verified hospitals, trauma centers, clinics, and municipal rehydration points with direct map navigation."
                      />
                    </CardHeader>
                    <CardContent>
                      {detailLoading ? (
                        <Loading label="Finding nearby support" />
                      ) : detail?.facilities?.length ? (
                        <div className="max-h-[500px] space-y-2.5 overflow-auto pr-1">
                          {detail.facilities.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 hover:border-blue-300 hover:shadow-xs transition"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <b className="text-sm font-bold text-slate-900">{item.name}</b>
                                  {item.emergency && (
                                    <Badge variant="destructive" className="text-[10px] px-2 py-0">
                                      Emergency
                                    </Badge>
                                  )}
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                  <span className="capitalize font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                    {item.type}
                                  </span>
                                  <span>•</span>
                                  <span>{selected.district} Heat Relief Network</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                                <a
                                  href={item.map_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition flex-1 sm:flex-initial"
                                  title="View on OpenStreetMap"
                                >
                                  <span>OSM Pin</span>
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                                <a
                                  href={item.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + selected.district)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-blue-200 bg-blue-50/80 px-2.5 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100 transition flex-1 sm:flex-initial"
                                  title="View direct location on Google Maps"
                                >
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>Google Maps</span>
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty>
                          No nearby facilities were returned. OpenStreetMap
                          availability can vary; the district alert workflow
                          remains available.
                        </Empty>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <PanelTitle
                        eyebrow="COMMUNITY SIGNAL"
                        title="Report a heat incident"
                        note="Saved to the authority audit trail."
                      />
                    </CardHeader>
                    <CardContent>
                      <form
                        className="grid gap-3 sm:grid-cols-2"
                        onSubmit={submitIncident}
                      >
                        <label
                          htmlFor="incident-type"
                          className="text-[10px] font-semibold text-slate-500"
                        >
                          INCIDENT TYPE
                          <NativeSelect
                            id="incident-type"
                            className="mt-1 w-full"
                            value={incidentType}
                            onChange={(event) =>
                              setIncidentType(event.target.value)
                            }
                          >
                            <NativeSelectOption value="heat illness">
                              Heat illness
                            </NativeSelectOption>
                            <NativeSelectOption value="water shortage">
                              Water shortage
                            </NativeSelectOption>
                            <NativeSelectOption value="power outage">
                              Power outage
                            </NativeSelectOption>
                            <NativeSelectOption value="cooling centre issue">
                              Cooling centre issue
                            </NativeSelectOption>
                            <NativeSelectOption value="outdoor worker exposure">
                              Outdoor worker exposure
                            </NativeSelectOption>
                          </NativeSelect>
                        </label>
                        <label
                          htmlFor="incident-severity"
                          className="text-[10px] font-semibold text-slate-500"
                        >
                          SEVERITY
                          <NativeSelect
                            id="incident-severity"
                            className="mt-1 w-full"
                            value={incidentSeverity}
                            onChange={(event) =>
                              setIncidentSeverity(event.target.value as Risk)
                            }
                          >
                            {Object.keys(riskStyle).map((risk) => (
                              <NativeSelectOption key={risk}>
                                {risk}
                              </NativeSelectOption>
                            ))}
                          </NativeSelect>
                        </label>
                        <label
                          htmlFor="incident-reporter"
                          className="text-[10px] font-semibold text-slate-500 sm:col-span-2"
                        >
                          REPORTER
                          <Input
                            id="incident-reporter"
                            className="mt-1"
                            value={reporter}
                            onChange={(event) =>
                              setReporter(event.target.value)
                            }
                            placeholder="Name or organisation (optional)"
                          />
                        </label>
                        <label
                          htmlFor="incident-description"
                          className="text-[10px] font-semibold text-slate-500 sm:col-span-2"
                        >
                          WHAT HAPPENED?
                          <Textarea
                            id="incident-description"
                            className="mt-1 min-h-28"
                            value={incidentDescription}
                            onChange={(event) =>
                              setIncidentDescription(event.target.value)
                            }
                            placeholder="Describe the location, incident and immediate need."
                          />
                        </label>
                        <Button
                          className="sm:col-span-2"
                          type="submit"
                          disabled={incidentDescription.trim().length < 10}
                        >
                          <Send />
                          Submit incident
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <PanelTitle
                      eyebrow="RECENT REPORTS"
                      title={`${selected.district} incident log · ${incidents.length}`}
                    />
                  </CardHeader>
                  <CardContent>
                    {incidents.length ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {incidents.slice(0, 10).map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 rounded-xl border border-slate-200 p-4"
                          >
                            <RiskBadge risk={item.severity} />
                            <div className="min-w-0">
                              <b className="capitalize">{item.incident_type}</b>
                              <p className="mt-1 text-xs text-slate-500">
                                {item.description}
                              </p>
                              <small className="mt-2 block text-[10px] text-slate-400">
                                {item.reporter} ·{' '}
                                {new Date(item.created_at).toLocaleString(
                                  dateLocale,
                                )}{' '}
                                · {item.status}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty>
                        No field incidents recorded for this district.
                      </Empty>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {view === 'validation' && (
              <div className="space-y-5">
                {dashboard ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Stat
                        label="Accuracy"
                        value={`${dashboard.validation.accuracy_pct}%`}
                        detail={`${dashboard.validation.test_samples.toLocaleString(dateLocale)} held-out 2025 rows`}
                        tone="green"
                      />
                      <Stat
                        label="Precision"
                        value={`${dashboard.validation.precision_pct}%`}
                        detail="macro average"
                      />
                      <Stat
                        label="Recall"
                        value={`${dashboard.validation.recall_pct}%`}
                        detail="macro average"
                        tone="amber"
                      />
                      <Stat
                        label="Macro F1"
                        value={`${dashboard.validation.macro_f1_pct}%`}
                        detail="observed classes"
                        tone="purple"
                      />
                    </div>
                    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                      <Card>
                        <CardHeader>
                          <PanelTitle
                            eyebrow="HISTORICAL REPLAY"
                            title="Observed stress vs High+ probability"
                            note={`Untouched chronological test period · ${dashboard.validation.test_period}`}
                          />
                        </CardHeader>
                        <CardContent>
                          <ChartContainer
                            config={{
                              actual_htsi: {
                                label: 'Actual HTSI',
                                color: '#dc2626',
                              },
                              predicted_probability: {
                                label: 'Predicted probability',
                                color: '#2563eb',
                              },
                            }}
                            className="h-[300px] w-full"
                          >
                            <AreaChart data={dashboard.validation.replay}>
                              <CartesianGrid vertical={false} />
                              <XAxis dataKey="label" />
                              <YAxis domain={[0, 100]} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Area
                                type="monotone"
                                dataKey="actual_htsi"
                                stroke="var(--color-actual_htsi)"
                                fill="var(--color-actual_htsi)"
                                fillOpacity={0.08}
                              />
                              <Area
                                type="monotone"
                                dataKey="predicted_probability"
                                stroke="var(--color-predicted_probability)"
                                fill="var(--color-predicted_probability)"
                                fillOpacity={0.08}
                              />
                            </AreaChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <PanelTitle
                            eyebrow="ERROR ANALYSIS"
                            title="Confusion matrix"
                            note={`${dashboard.validation.false_alarms} false alarms · ${dashboard.validation.missed_events} missed High+ events`}
                          />
                        </CardHeader>
                        <CardContent>
                          <div
                            className="grid gap-2"
                            style={{
                              gridTemplateColumns: `repeat(${dashboard.validation.labels.length}, minmax(0, 1fr))`,
                            }}
                          >
                            {dashboard.validation.confusion_matrix.flatMap(
                              (row, rowIndex) =>
                                row.map((value, colIndex) => (
                                  <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`rounded-xl p-2 text-center ${rowIndex === colIndex ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}
                                  >
                                    <strong className="block text-lg">
                                      {value}
                                    </strong>
                                    <small className="text-[8px]">
                                      {dashboard.validation.labels[
                                        rowIndex
                                      ].slice(0, 3)}
                                      →
                                      {dashboard.validation.labels[
                                        colIndex
                                      ].slice(0, 3)}
                                    </small>
                                  </div>
                                )),
                            )}
                          </div>
                          <div className="mt-4 space-y-2">
                            {Object.entries(
                              dashboard.validation.class_support,
                            ).map(([risk, count]) => (
                              <div
                                key={risk}
                                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"
                              >
                                <span>{risk}</span>
                                <b>{count} samples</b>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    {selectedReplay && (
                      <Card>
                        <CardHeader>
                          <PanelTitle
                            eyebrow="SELECTABLE 2025 EVIDENCE"
                            title={`${selectedReplay.district} historical case`}
                            note="Choose a real held-out timestamp and inspect the weather, result and model reasoning."
                            action={
                              <NativeSelect
                                value={selectedReplay.id}
                                onChange={(event) =>
                                  setReplayCaseId(event.target.value)
                                }
                                aria-label="Select historical replay case"
                              >
                                {districtReplayCases.map((item) => (
                                  <NativeSelectOption
                                    key={item.id}
                                    value={item.id}
                                  >
                                    {new Date(item.timestamp).toLocaleString(
                                      dateLocale,
                                      {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                      },
                                    )}
                                  </NativeSelectOption>
                                ))}
                              </NativeSelect>
                            }
                          />
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                            <Stat
                              label="Observed proxy"
                              value={selectedReplay.observed.risk}
                              detail={`HTSI ${selectedReplay.observed.htsi}`}
                              tone="amber"
                            />
                            <Stat
                              label="Model result"
                              value={selectedReplay.prediction.risk}
                              detail={`${selectedReplay.prediction.confidence_pct}% confidence`}
                              tone={
                                selectedReplay.prediction.correct
                                  ? 'green'
                                  : 'red'
                              }
                            />
                            <Stat
                              label="High+ probability"
                              value={`${selectedReplay.prediction.high_risk_probability_pct}%`}
                              detail={
                                selectedReplay.prediction.correct
                                  ? 'class matched'
                                  : 'class mismatch'
                              }
                            />
                            <Stat
                              label="Temperature"
                              value={`${selectedReplay.observed.temperature_c}°C`}
                              detail={`${selectedReplay.observed.humidity_pct}% humidity`}
                            />
                            <Stat
                              label="Wind"
                              value={`${selectedReplay.observed.wind_speed_ms} m/s`}
                              detail="ERA5-Seamless"
                            />
                            <Stat
                              label="Solar load"
                              value={`${selectedReplay.observed.shortwave_radiation_wm2}`}
                              detail="W/m²"
                            />
                          </div>
                          <div>
                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                              Why the model selected{' '}
                              {selectedReplay.prediction.risk}
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {selectedReplay.prediction.explanation.map(
                                (item) => (
                                  <div
                                    key={item.feature}
                                    className="rounded-xl bg-slate-50 p-3"
                                  >
                                    <span className="flex justify-between gap-2 text-xs font-semibold">
                                      {item.label}
                                      <small className="text-slate-500">
                                        {item.contribution_pct}%
                                      </small>
                                    </span>
                                    <div className="mt-3 h-1.5 rounded-full bg-slate-200">
                                      <i
                                        className={`block h-full rounded-full ${
                                          item.direction === 'raises'
                                            ? 'bg-red-600'
                                            : 'bg-emerald-600'
                                        }`}
                                        style={{
                                          width: `${item.contribution_pct}%`,
                                        }}
                                      />
                                    </div>
                                    <small className="mt-2 block text-[10px] text-slate-500">
                                      {item.direction} this class · value{' '}
                                      {item.value}
                                    </small>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    <Card>
                      <CardHeader>
                        <PanelTitle
                          eyebrow="HACKATHON TABLETOP TEST"
                          title="Reproducible readiness simulation"
                          note="A safe substitute for unavailable field testing. It verifies the technical workflow, but does not claim real-user or authority validation."
                          action={
                            <Button
                              variant="outline"
                              onClick={runReadinessSimulation}
                              disabled={loading || mapLoading || detailLoading}
                            >
                              <RefreshCw
                                className={
                                  loading || mapLoading || detailLoading
                                    ? 'animate-spin'
                                    : ''
                                }
                              />
                              Run readiness check
                            </Button>
                          }
                        />
                      </CardHeader>
                      <CardContent>
                        {readinessComplete ? (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {[
                              {
                                label: 'Live coverage',
                                pass: districts.length >= 30,
                                detail: `${districts.length} cities loaded`,
                              },
                              {
                                label: 'Forecast workflow',
                                pass: detail?.horizons.length === 3,
                                detail: `${detail?.horizons.length ?? 0}/3 horizons`,
                              },
                              {
                                label: 'National layers',
                                pass: Boolean(
                                  forecastMap &&
                                  Object.values(forecastMap.layers).every(
                                    (layer) => layer.length >= 30,
                                  ),
                                ),
                                detail: '24h · 48h · 72h',
                              },
                              {
                                label: 'Historical evidence',
                                pass:
                                  dashboard.validation.test_samples === 58_400,
                                detail: `${dashboard.validation.test_samples.toLocaleString(dateLocale)} held-out rows`,
                              },
                              {
                                label: 'Alert readiness',
                                pass: true,
                                detail: '1 live · 2 demo channels',
                              },
                            ].map((check) => (
                              <div
                                key={check.label}
                                className={`rounded-xl border p-3 ${check.pass ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}
                              >
                                <span
                                  className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${check.pass ? 'text-emerald-700' : 'text-red-700'}`}
                                >
                                  {check.pass ? <Check /> : <X />}
                                  {check.pass ? 'Pass' : 'Check'}
                                </span>
                                <b className="mt-2 block text-xs text-slate-800">
                                  {check.label}
                                </b>
                                <small className="mt-1 block text-[10px] text-slate-500">
                                  {check.detail}
                                </small>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs leading-relaxed text-slate-600">
                            Run this before the SIH presentation to refresh the
                            live data pipeline, all forecast horizons, the
                            30-city map layers and the historical validation
                            evidence in one repeatable exercise.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                      <b className="block">Validation boundary</b>
                      {dashboard.validation.methodology}{' '}
                      {dashboard.validation.caveat} The Emergency row is
                      retained in the matrix, but its 2025 support is zero and
                      therefore no Emergency performance claim is made.
                    </div>
                  </>
                ) : (
                  <Loading />
                )}
              </div>
            )}

            {view === 'history' && canManage && (
              <div className="grid gap-5 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <PanelTitle
                      eyebrow="PERSISTENT RECORD"
                      title="Recent observations"
                      note={`${historyData?.counts.observations ?? 0} stored rows for ${selected.district}.`}
                    />
                  </CardHeader>
                  <CardContent>
                    {historyData?.observations.length ? (
                      <div className="max-h-[520px] space-y-2 overflow-auto">
                        {historyData.observations.map((row, index) => (
                          <div
                            key={`${row.id}-${index}`}
                            className="grid grid-cols-[1fr_50px_auto] items-center gap-3 rounded-xl bg-slate-50 p-3"
                          >
                            <span>
                              <b className="block text-xs">
                                {new Date(
                                  String(row.observed_at),
                                ).toLocaleString(dateLocale)}
                              </b>
                              <small className="text-slate-400">
                                {String(row.temperature)}°C ·{' '}
                                {String(row.humidity)}% RH ·{' '}
                                {weatherSourceLabel(row.source)}
                              </small>
                            </span>
                            <strong>{String(row.htsi)}</strong>
                            <RiskBadge risk={String(row.risk) as Risk} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty>
                        Refresh the command center to create persistent
                        observations.
                      </Empty>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <PanelTitle
                      eyebrow="PREDICTION TRACK"
                      title="Forecast records"
                      note={`${historyData?.counts.predictions ?? 0} stored horizons for later comparison.`}
                    />
                  </CardHeader>
                  <CardContent>
                    {historyData?.predictions.length ? (
                      <div className="max-h-[520px] space-y-2 overflow-auto">
                        {historyData.predictions.map((row, index) => (
                          <div
                            key={`${row.id}-${index}`}
                            className="grid grid-cols-[1fr_55px_auto] items-center gap-3 rounded-xl bg-slate-50 p-3"
                          >
                            <span>
                              <b className="block text-xs">
                                {new Date(
                                  String(row.predicted_at),
                                ).toLocaleString(dateLocale)}
                              </b>
                              <small className="text-slate-400">
                                {String(row.horizon_hours)}h horizon ·{' '}
                                {weatherSourceLabel(row.source)}
                              </small>
                            </span>
                            <strong>{String(row.probability)}%</strong>
                            <RiskBadge
                              risk={String(row.predicted_class) as Risk}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty>
                        Open a district forecast to create persistent
                        predictions.
                      </Empty>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {view === 'alerts' && !canManage && (
              <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80">
                  <LockKeyhole className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 font-display">
                  Multichannel Alert Dispatch — Restricted Access
                </h3>
                <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Broadcasting heatwave alerts across SMS, WhatsApp, and CAP disaster warning channels is strictly restricted to authorized disaster management officers.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button variant="outline" onClick={() => setView('overview')}>
                    Return to Public Overview
                  </Button>
                  <Link
                    href="/login?next=/"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Officer Sign In</span>
                  </Link>
                </div>
              </div>
            )}

            {view === 'alerts' && canManage && (
              <div className="space-y-5">
                <Card>
                  <CardHeader>
                    <PanelTitle
                      eyebrow="AUTOMATIC ML WATCH"
                      title={`${selectedAutomaticWarnings.length} active forecast warning${selectedAutomaticWarnings.length === 1 ? '' : 's'} for ${selected.district}`}
                      note="Created automatically when the model predicts High+ risk with at least 60% High+ probability. Duplicate forecast windows are suppressed."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadForecastMap(true)}
                          disabled={mapLoading}
                        >
                          <RefreshCw
                            className={mapLoading ? 'animate-spin' : ''}
                          />
                          Evaluate forecasts
                        </Button>
                      }
                    />
                  </CardHeader>
                  <CardContent>
                    {selectedAutomaticWarnings.length ? (
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {selectedAutomaticWarnings.map((warning) => (
                          <div
                            key={warning.id}
                            className="rounded-[1.05rem] border border-orange-100 bg-orange-50/70 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <RiskBadge risk={warning.risk} />
                              <b className="text-xs">
                                +{warning.horizon_hours}h
                              </b>
                            </div>
                            <strong className="mt-3 block text-2xl text-orange-800">
                              {Math.round(warning.probability)}% High+
                            </strong>
                            <small className="mt-1 block text-orange-900/65">
                              HTSI {warning.htsi} · valid{' '}
                              {new Date(warning.valid_at).toLocaleString(
                                dateLocale,
                              )}
                            </small>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty>
                        No automatic High+ warning is active for this district.
                        Evaluate the forecast layers to refresh the warning
                        engine.
                      </Empty>
                    )}
                  </CardContent>
                </Card>
                <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                  <Card>
                    <CardHeader>
                      <PanelTitle
                        eyebrow="MULTICHANNEL WARNING"
                        title="Alert composer"
                        note="Browser delivery is live. SMS and WhatsApp are safe hackathon previews and do not contact real recipients."
                      />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="min-h-11 border-emerald-200 bg-emerald-50 text-emerald-800"
                        onClick={() => setAlertChannel('whatsapp')}
                        aria-pressed={alertChannel === 'whatsapp'}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                          className="h-5 w-5"
                        >
                          <path d="M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.7-4.5A9 9 0 1 1 21 11.5Z" />
                          <path d="m8 7 2 3-1 1c1 2 2 3 4 4l1-1 3 2c-1 3-4 2-7-1S6 8 8 7Z" />
                        </svg>
                        WhatsApp · demo preview
                      </Button>
                      <label
                        htmlFor="alert-risk"
                        className="text-[10px] font-semibold text-slate-500"
                      >
                        RISK LEVEL
                        <NativeSelect
                          id="alert-risk"
                          className="mt-1 w-full"
                          value={alertRisk}
                          onChange={(event) =>
                            setAlertRisk(event.target.value as Risk)
                          }
                        >
                          {(['High', 'Extreme', 'Emergency'] as Risk[]).map(
                            (risk) => (
                              <NativeSelectOption key={risk}>
                                {risk}
                              </NativeSelectOption>
                            ),
                          )}
                        </NativeSelect>
                      </label>
                      <label
                        htmlFor="alert-channel"
                        className="text-[10px] font-semibold text-slate-500"
                      >
                        DELIVERY CHANNEL
                        <NativeSelect
                          id="alert-channel"
                          className="mt-1 w-full"
                          value={alertChannel}
                          onChange={(event) =>
                            setAlertChannel(event.target.value as AlertChannel)
                          }
                        >
                          <NativeSelectOption value="browser">
                            Browser notification · live
                          </NativeSelectOption>
                          <NativeSelectOption value="sms">
                            SMS · demo preview
                          </NativeSelectOption>
                          <NativeSelectOption value="whatsapp">
                            WhatsApp · demo preview
                          </NativeSelectOption>
                        </NativeSelect>
                      </label>
                      <label
                        htmlFor="alert-language"
                        className="text-[10px] font-semibold text-slate-500"
                      >
                        LANGUAGE
                        <NativeSelect
                          id="alert-language"
                          className="mt-1 w-full"
                          value={alertLanguage}
                          onChange={(event) =>
                            setAlertLanguage(event.target.value)
                          }
                        >
                          <NativeSelectOption value="en">
                            English
                          </NativeSelectOption>
                          <NativeSelectOption value="hi">
                            Hindi
                          </NativeSelectOption>
                          <NativeSelectOption value="te">
                            Telugu
                          </NativeSelectOption>
                          <NativeSelectOption value="kn">
                            Kannada
                          </NativeSelectOption>
                        </NativeSelect>
                      </label>
                      <div
                        className={`rounded-xl border p-3 text-xs ${alertChannel === 'browser' ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}
                      >
                        <b className="block">
                          {canManage && alertChannel === 'browser'
                            ? 'Browser notification · live'
                            : 'Hackathon demo preview'}
                        </b>
                        {canManage && alertChannel === 'browser'
                          ? 'Browser delivery uses this device’s notification permission and stores the alert in the audit trail.'
                          : 'This creates a realistic preview on this device. No recipient is contacted and no operational record is changed.'}
                      </div>
                      <Button className="w-full" onClick={sendAlert}>
                        <Bell />
                        {alertChannel === 'browser'
                          ? 'Send and record warning'
                          : `Generate ${alertChannel === 'sms' ? 'SMS' : 'WhatsApp'} demo`}
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <PanelTitle
                        eyebrow="AUDIT TRAIL"
                        title={`${selected.district} alert history · ${alerts.length}`}
                      />
                    </CardHeader>
                    <CardContent>
                      {alerts.length ? (
                        <div className="max-h-[520px] space-y-2 overflow-auto">
                          {alerts.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-xl border border-slate-200 p-4"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <RiskBadge risk={item.risk} />
                                <b className="text-xs">{item.id}</b>
                                <span className="ml-auto text-[10px] text-slate-400">
                                  {new Date(item.created_at).toLocaleString(
                                    dateLocale,
                                  )}
                                </span>
                              </div>
                              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                                {item.message}
                              </p>
                              <div className="mt-3 flex items-center justify-between">
                                <small className="text-slate-400">
                                  {item.channel} · {item.language} ·{' '}
                                  {item.status}
                                </small>
                                {item.status !== 'acknowledged' &&
                                  item.status !== 'demo_only' &&
                                  canManage && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => acknowledgeAlert(item.id)}
                                    >
                                      <Check />
                                      Acknowledge
                                    </Button>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty>
                          No warnings have been sent for this district.
                        </Empty>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* SIH26083 Unique Feature Views */}
            {view === 'hyperlocal-gis' && (
              <div className="space-y-4">
                {/* City Selector Bar */}
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      CITY / DISTRICT:
                    </span>
                  </div>
                  <NativeSelect
                    value={selectedName}
                    onChange={(event) => setSelectedName(event.target.value)}
                    aria-label="Select city for exposure and vulnerability analysis"
                    className="h-8 text-xs border-slate-200 rounded-lg max-w-[200px] bg-white text-slate-800"
                  >
                    {alphabeticalDistricts.map((item) => (
                      <NativeSelectOption key={item.district} value={item.district}>
                        {item.district}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-blue-700">
                    {selected.temp}°C · {selected.risk} Risk
                  </span>
                </div>
                <HyperlocalWardGis
                  currentCity={selected.district}
                  baseTemp={selected.temp}
                  baseHumidity={selected.humidity}
                />
              </div>
            )}

            {view === 'digital-twin' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs text-blue-900 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇮🇳</span>
                    <span>
                      <strong>IMD 24h / 48h / 72h Predictive Warning Trajectory:</strong> This feature is now directly embedded into the interactive heat map below with real-time Day 1 through Day 5 projections.
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setView('overview')}>
                    Return to Command Center
                  </Button>
                </div>
                <IndiaMap
                  districts={districts}
                  selected={selected}
                  onSelect={selectDistrict}
                  expanded={true}
                  initialDay={4}
                />
              </div>
            )}

            {view === 'what-if' && (
              canManage ? (
                <WhatIfSimulator
                  currentCity={selected.district}
                  currentTemp={selected.temp}
                  currentHumidity={selected.humidity}
                  currentWind={selected.wind ?? 12}
                  currentSolar={selected.solar ?? 600}
                  currentPvs={68}
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80">
                    <Sliders className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 font-display">
                    What-If Intervention Simulator
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                    The intervention simulator allows authorized officers to model the effect of cooling interventions, shade structures, and outdoor work stoppages on predicted heat-stress outcomes. Officer sign-in required.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button variant="outline" onClick={() => setView('overview')}>
                      Return to Overview
                    </Button>
                    <Link
                      href="/login?next=/"
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Officer Sign In</span>
                    </Link>
                  </div>
                </div>
              )
            )}

            {view === 'cascade' && (
              <RiskCascadeView
                locationName={`${selected.district} Metropolitan District`}
                currentTemp={selected.temp}
                currentHumidity={selected.humidity}
                currentWind={selected.wind ?? 12}
                currentSolar={selected.solar ?? 600}
              />
            )}

            {view === 'cooling-centers' && (
              canManage ? (
                <CoolingCenterView
                  currentCity={selected.district}
                  currentHtss={selected.htsi}
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80">
                    <LockKeyhole className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 font-display">
                    Authority Heat Action Plan — Restricted Access
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                    The Municipal Heat Action Plan, tactical cooling pavilion allocation, and shelter capacity deployment algorithms are restricted to authorized disaster management officers.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button variant="outline" onClick={() => setView('overview')}>
                      Return to Public Overview
                    </Button>
                    <Link
                      href="/login?next=/"
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Officer Sign In</span>
                    </Link>
                  </div>
                </div>
              )
            )}

            {view === 'hospitals' && (
              <HospitalReadinessView
                currentCity={selected.district}
                currentHtss={selected.htsi}
                forecastPeakHtss={selected.htsi + 6}
              />
            )}

            {view === 'worker-safety' && (
              <WorkerSafetyView
                currentCity={selected.district}
                currentTemp={selected.temp}
                currentHumidity={selected.humidity}
                currentWind={selected.wind ?? 10}
                currentSolar={selected.solar ?? 700}
              />
            )}

            {view === 'memory' && (
              <HeatwaveMemoryView
                currentCity={selected.district}
                currentTemp={selected.temp}
                currentHtss={selected.htsi}
                currentWbgt={selected.wbgt ?? 32}
              />
            )}

            {view === 'telemetry' && (
              <DataTelemetryView />
            )}

            <footer className="mt-10 flex flex-wrap justify-between gap-2 border-t border-slate-200 py-6 text-[10px] text-slate-400">
              <span>HeatVector · SIH26083</span>
              <span>{copy.decisionSupport}</span>
              <span className="flex flex-wrap gap-3">
                <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
                  Privacy and data use
                </Link>
                <Link href="/api/health" className="text-slate-600 hover:text-slate-900">
                  System status
                </Link>
                <a
                  href="https://open-meteo.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-slate-900"
                >
                  Open-Meteo
                </a>
                <a
                  href="https://api.met.no/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-slate-900"
                >
                  MET Norway
                </a>
              </span>
            </footer>

            {/* Copernicus Persistent Floating Operational Widget (Bottom-Left) */}
            <div className="fixed bottom-5 left-5 z-40 hidden md:flex w-[290px] flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ACTIVE DIRECTIVE</span>
                </div>
                <span className="rounded bg-slate-900 text-white px-1.5 py-0.2 font-mono text-[9px] font-semibold uppercase">LIVE</span>
              </div>
              <div className="flex items-center gap-2.5 my-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                  {selected.temp}°C
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">{selected.district}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{selected.risk} Risk · {selected.htsi} HTSI</p>
                </div>
              </div>
              <button
                onClick={() => setAssistantModalOpen(true)}
                className="mt-2.5 w-full rounded-lg bg-slate-900 hover:bg-slate-800 py-2 text-xs font-medium text-white transition-colors shadow-2xs"
              >
                Open Grounded Assistant &rarr;
              </button>
            </div>

            <LocalAssistant
              language={uiLanguage}
              context={{
                district: selected.district,
                risk: selected.risk,
                htsi: selected.htsi,
                temperature: selected.temp,
                humidity: selected.humidity,
                highRiskProbability: selected.high_risk_probability,
                forecastRisk: detail?.horizons[0]?.predicted_class,
              }}
            />
            <GroundedAssistantModal
              isOpen={assistantModalOpen}
              onClose={() => setAssistantModalOpen(false)}
              currentCity={selected.district}
              currentTemp={selected.temp}
              currentHumidity={selected.humidity}
              alertLevel={selected.risk}
            />
          </main>
        </section>
      </div>
    </KannadaLocalizer>
  );
}
