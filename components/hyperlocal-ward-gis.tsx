'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Users,
  HardHat,
  HeartPulse,
  Flame,
  ShieldAlert,
  MapPin,
  Sparkles,
  X,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { getCitySpatialProfile, WardSpatialData } from '@/lib/city-wards';
import { calculateThermalMetrics } from '@/lib/thermal-engine';
import { LeafletWardMap } from '@/components/leaflet-ward-map';

export interface HyperlocalWardGisProps {
  currentCity: string;
  baseTemp: number;
  baseHumidity: number;
  onSelectWard?: (ward: WardSpatialData) => void;
}

export type GisLayerMode =
  | 'htss-risk'
  | 'vulnerability'
  | 'outdoor-workers'
  | 'cooling-centers'
  | 'healthcare';

export type CategoricalIndicator =
  | 'thermal'
  | 'slum'
  | 'workers'
  | 'shade'
  | 'cooling'
  | 'elderly';

export function HyperlocalWardGis({
  currentCity,
  baseTemp,
  baseHumidity,
  onSelectWard,
}: HyperlocalWardGisProps) {
  // 1. Fetch authentic municipal spatial profile
  const profile = useMemo(
    () => getCitySpatialProfile(currentCity, baseTemp, baseHumidity),
    [currentCity, baseTemp, baseHumidity]
  );

  // 2. State
  const [activeLayer, setActiveLayer] = useState<GisLayerMode>('htss-risk');
  const [activeIndicator, setActiveIndicator] = useState<CategoricalIndicator | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<string>(
    profile.wards[0]?.id || ''
  );


  // Currently selected ward
  const selectedWard = useMemo(
    () => profile.wards.find((w) => w.id === selectedWardId) || profile.wards[0],
    [profile, selectedWardId]
  );

  // Filtered wards based on active categorical indicator
  const isWardMatchingIndicator = (ward: WardSpatialData, indicator: CategoricalIndicator): boolean => {
    const localTemp = baseTemp + ward.uhiOffsetC;
    switch (indicator) {
      case 'thermal':
        return localTemp >= 40.5 || ward.pvsScore >= 75;
      case 'slum':
        return ward.slumHousingPct >= 35;
      case 'workers':
        return ward.outdoorWorkersPct >= 45;
      case 'shade':
        return ward.vegetationCoverPct <= 12;
      case 'cooling':
        return ward.coolingCenters === 0;
      case 'elderly':
        return ward.pvsScore >= 70 || ward.slumHousingPct >= 40;
      default:
        return true;
    }
  };

  // Counts of matching wards for each indicator
  const indicatorCounts = useMemo(() => {
    const counts: Record<CategoricalIndicator, number> = {
      thermal: 0,
      slum: 0,
      workers: 0,
      shade: 0,
      cooling: 0,
      elderly: 0,
    };
    for (const w of profile.wards) {
      if (isWardMatchingIndicator(w, 'thermal')) counts.thermal++;
      if (isWardMatchingIndicator(w, 'slum')) counts.slum++;
      if (isWardMatchingIndicator(w, 'workers')) counts.workers++;
      if (isWardMatchingIndicator(w, 'shade')) counts.shade++;
      if (isWardMatchingIndicator(w, 'cooling')) counts.cooling++;
      if (isWardMatchingIndicator(w, 'elderly')) counts.elderly++;
    }
    return counts;
  }, [profile.wards, baseTemp]);

  const displayedWards = useMemo(() => {
    if (!activeIndicator) return profile.wards;
    return profile.wards.filter((w) => isWardMatchingIndicator(w, activeIndicator));
  }, [profile.wards, activeIndicator, baseTemp]);

  const handleSelectWard = (ward: WardSpatialData) => {
    setSelectedWardId(ward.id);
    if (onSelectWard) onSelectWard(ward);
  };

  const handleIndicatorClick = (indicator: CategoricalIndicator) => {
    setActiveIndicator((prev) => (prev === indicator ? null : indicator));
  };

  // Calculate biometeorological thermal metrics for selected ward
  const selectedLocalTemp = baseTemp + (selectedWard?.uhiOffsetC || 0);
  const selectedThermal = calculateThermalMetrics(
    selectedLocalTemp,
    baseHumidity,
    10,
    650
  );

  // Dynamic Fill Color based on activeLayer
  const getWardFill = (ward: WardSpatialData, isHovered: boolean, isSelected: boolean) => {
    const matchesFilter = !activeIndicator || isWardMatchingIndicator(ward, activeIndicator);
    const opacitySuffix = !matchesFilter ? '40' : '';

    if (activeLayer === 'vulnerability') {
      if (ward.pvsScore >= 80) return isSelected ? '#dc2626' : isHovered ? '#ef4444' : `#fee2e2${opacitySuffix}`;
      if (ward.pvsScore >= 70) return isSelected ? '#ea580c' : isHovered ? '#f97316' : `#ffedd5${opacitySuffix}`;
      if (ward.pvsScore >= 50) return isSelected ? '#d97706' : isHovered ? '#f59e0b' : `#fef3c7${opacitySuffix}`;
      return isSelected ? '#059669' : isHovered ? '#10b981' : `#d1fae5${opacitySuffix}`;
    }

    if (activeLayer === 'outdoor-workers') {
      if (ward.outdoorWorkersPct >= 55) return isSelected ? '#7c3aed' : isHovered ? '#8b5cf6' : `#ede9fe${opacitySuffix}`;
      if (ward.outdoorWorkersPct >= 40) return isSelected ? '#2563eb' : isHovered ? '#3b82f6' : `#dbeafe${opacitySuffix}`;
      return isSelected ? '#0d9488' : isHovered ? '#14b8a6' : `#ccfbf1${opacitySuffix}`;
    }

    if (activeLayer === 'cooling-centers') {
      if (ward.coolingCenters === 0) return isSelected ? '#ea580c' : isHovered ? '#f97316' : `#ffedd5${opacitySuffix}`;
      return isSelected ? '#0284c7' : isHovered ? '#0ea5e9' : `#e0f2fe${opacitySuffix}`;
    }

    if (activeLayer === 'healthcare') {
      if (ward.hospitals >= 2) return isSelected ? '#16a34a' : isHovered ? '#22c55e' : `#dcfce7${opacitySuffix}`;
      if (ward.hospitals === 1) return isSelected ? '#2563eb' : isHovered ? '#3b82f6' : `#dbeafe${opacitySuffix}`;
      return isSelected ? '#e11d48' : isHovered ? '#f43f5e' : `#ffe4e6${opacitySuffix}`;
    }

    // Default: 'htss-risk' (Thermal Microclimate HTSS)
    const localTemp = baseTemp + ward.uhiOffsetC;
    if (localTemp >= 42 || ward.pvsScore >= 80) return isSelected ? '#dc2626' : isHovered ? '#ef4444' : `#fee2e2${opacitySuffix}`;
    if (localTemp >= 39.5 || ward.pvsScore >= 65) return isSelected ? '#ea580c' : isHovered ? '#f97316' : `#ffedd5${opacitySuffix}`;
    if (localTemp >= 37) return isSelected ? '#d97706' : isHovered ? '#f59e0b' : `#fef3c7${opacitySuffix}`;
    return isSelected ? '#059669' : isHovered ? '#10b981' : `#d1fae5${opacitySuffix}`;
  };

  // Layer description metadata
  const layerMeta: Record<GisLayerMode, { title: string; desc: string; badge: string }> = {
    'htss-risk': {
      title: 'Thermal Stress & Microclimate UHI Heat Islands',
      desc: 'Visualizes ambient temperature plus built-environment Urban Heat Island (UHI) offsets (+0.5°C to +2.5°C) from asphalt, concrete, and tin roofs.',
      badge: 'Metric: Dry Bulb + UHI Offset (°C) & WBGT',
    },
    'vulnerability': {
      title: 'Population Vulnerability Score (PVS 0–100)',
      desc: 'Synthesizes informal settlement density, elderly ratios, daily-wage outdoor exposure, and healthcare distance into a unified vulnerability ranking.',
      badge: 'Metric: Standardized PVS (Census & NFHS-5 Calibrated)',
    },
    'outdoor-workers': {
      title: 'Outdoor Worker Occupational Exposure Density',
      desc: 'Pinpoints municipal zones with high concentration of street vendors, construction workers, and delivery couriers who require mandatory shift rest.',
      badge: 'Metric: % Outdoor Workforce in Ward',
    },
    'cooling-centers': {
      title: 'Cooling Center Coverage & Spatial Deficits',
      desc: 'Maps active air-cooled shelters and hydration pavilions. Wards with 0 centers are flagged as critical municipal relief deficits.',
      badge: 'Metric: Shelters Available vs Population Deficit',
    },
    'healthcare': {
      title: 'Hospitals, Clinics & Emergency Triage Access',
      desc: 'Displays healthcare facility distribution. Identifies wards requiring mobile medical ambulances or oral rehydration salt (ORS) depots.',
      badge: 'Metric: Verified Health Facilities in Ward',
    },
  };

  const layerOptions: Array<{ id: GisLayerMode; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'htss-risk', label: 'Thermal Stress (HTSS)', icon: Flame },
    { id: 'vulnerability', label: 'Vulnerability Index (PVS)', icon: Users },
    { id: 'outdoor-workers', label: 'Outdoor Workers', icon: HardHat },
    { id: 'cooling-centers', label: 'Cooling Centers', icon: ShieldAlert },
    { id: 'healthcare', label: 'Hospitals & Clinics', icon: HeartPulse },
  ];

  const indicatorsList: Array<{
    id: CategoricalIndicator;
    label: string;
    color: string;
    activeBorder: string;
    activeBg: string;
    textColor: string;
    filterDesc: string;
  }> = [
    {
      id: 'thermal',
      label: 'Thermal Stress',
      color: 'bg-red-500',
      activeBorder: 'border-red-400',
      activeBg: 'bg-red-50',
      textColor: 'text-red-700',
      filterDesc: 'Local Temp ≥ 40.5°C or PVS ≥ 75',
    },
    {
      id: 'slum',
      label: 'Critical Slums',
      color: 'bg-orange-500',
      activeBorder: 'border-orange-400',
      activeBg: 'bg-orange-50',
      textColor: 'text-orange-700',
      filterDesc: 'Informal / Tin-Roof Housing ≥ 35%',
    },
    {
      id: 'workers',
      label: 'Outdoor Workers',
      color: 'bg-purple-600',
      activeBorder: 'border-purple-400',
      activeBg: 'bg-purple-50',
      textColor: 'text-purple-700',
      filterDesc: 'Outdoor Workforce Density ≥ 45%',
    },
    {
      id: 'shade',
      label: 'Canopy Shade Deficit',
      color: 'bg-emerald-600',
      activeBorder: 'border-emerald-400',
      activeBg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      filterDesc: 'Vegetation & Tree Canopy ≤ 12%',
    },
    {
      id: 'cooling',
      label: 'Cooling Deficit',
      color: 'bg-blue-600',
      activeBorder: 'border-blue-400',
      activeBg: 'bg-blue-50',
      textColor: 'text-blue-700',
      filterDesc: 'Zero Municipal Cooling Shelters (0)',
    },
    {
      id: 'elderly',
      label: 'Elderly Cohorts',
      color: 'bg-amber-600',
      activeBorder: 'border-amber-400',
      activeBg: 'bg-amber-50',
      textColor: 'text-amber-700',
      filterDesc: 'Compounding Age Vulnerability (PVS ≥ 70)',
    },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* 1. GIS Layer Switcher Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              GIS LAYER OVERLAYS:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {layerOptions.map((opt) => {
              const isActive = activeLayer === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActiveLayer(opt.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs ring-1 ring-slate-900'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Layer Intelligence Bar */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-slate-50 border border-slate-200/80 p-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-slate-900 shrink-0">
              {layerMeta[activeLayer].title}:
            </span>
            <span className="truncate text-slate-600">
              {layerMeta[activeLayer].desc}
            </span>
          </div>
          <span className="shrink-0 rounded bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700 border border-slate-200">
            {layerMeta[activeLayer].badge}
          </span>
        </div>
      </div>

      {/* 2. Interactive Categorical Indicators (Click to filter / spotlight) */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
              DATASET COMPOSITION &middot; CATEGORICAL INDICATORS (CLICK TO FILTER):
            </span>
          </div>
          {activeIndicator && (
            <button
              onClick={() => setActiveIndicator(null)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700 transition cursor-pointer"
            >
              <X className="h-3 w-3" />
              Clear Filter ({displayedWards.length} of {profile.wards.length} shown)
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {indicatorsList.map((ind) => {
            const isFilterActive = activeIndicator === ind.id;
            const count = indicatorCounts[ind.id];

            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => handleIndicatorClick(ind.id)}
                className={`flex items-center justify-between gap-1.5 rounded-lg border p-2 text-xs text-left transition-all cursor-pointer ${
                  isFilterActive
                    ? `${ind.activeBorder} ${ind.activeBg} ${ind.textColor} font-bold ring-2 ring-slate-900/10 shadow-2xs`
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 text-slate-700 font-medium'
                }`}
                title={`Filter wards by: ${ind.filterDesc}`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`h-2.5 w-2.5 rounded-full ${ind.color} shrink-0`} />
                  <span className="truncate">{ind.label}</span>
                </div>
                <span className={`font-mono text-[10px] rounded px-1.5 py-0.2 shrink-0 ${
                  isFilterActive ? 'bg-white font-bold shadow-2xs' : 'bg-slate-200/70 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter explanation alert if active */}
        {activeIndicator && (
          <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-xs text-blue-900">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>
                <strong>Active Demographic Filter:</strong> Showing {displayedWards.length} wards matching{' '}
                <em>{indicatorsList.find((i) => i.id === activeIndicator)?.filterDesc}</em>.
              </span>
            </div>
            <button
              onClick={() => setActiveIndicator(null)}
              className="text-blue-700 hover:text-blue-900 font-semibold underline text-[11px] cursor-pointer"
            >
              Reset view
            </button>
          </div>
        )}
      </div>

      {/* 3. Main Display: Leaflet Real Map + Selected Ward Telemetry */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Leaflet OSM Map Canvas */}
        <div className="lg:col-span-7">
          <LeafletWardMap
            profile={profile}
            activeLayer={activeLayer}
            activeIndicator={activeIndicator}
            selectedWardId={selectedWardId}
            baseTemp={baseTemp}
            baseHumidity={baseHumidity}
            onSelectWard={handleSelectWard}
            isWardMatchingIndicator={isWardMatchingIndicator}
            getWardFill={getWardFill}
          />

          {/* Map Scale Legend */}
          <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[10.5px] text-slate-500">
            <span className="font-semibold text-slate-900 shrink-0">Scale:</span>
            <span className="flex items-center gap-1 shrink-0"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Safe / Low</span>
            <span className="flex items-center gap-1 shrink-0"><span className="h-2.5 w-2.5 rounded bg-amber-400" /> Watch</span>
            <span className="flex items-center gap-1 shrink-0"><span className="h-2.5 w-2.5 rounded bg-orange-500" /> Warning</span>
            <span className="flex items-center gap-1 shrink-0"><span className="h-2.5 w-2.5 rounded bg-red-600" /> Critical</span>
            <span className="font-mono text-[9.5px] text-slate-400 ml-auto">Click ward to inspect</span>
          </div>
        </div>

        {/* Right: Selected Ward Telemetry Detail Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs lg:col-span-5">
          {selectedWard ? (
            <div className="space-y-3.5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
                    MUNICIPAL ZONE: {selectedWard.zone}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedWard.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Population: {selectedWard.population.toLocaleString()} &middot; Density: {Math.round(selectedWard.population / 4).toLocaleString()} / km²
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Risk Category
                  </span>
                  <div
                    className={`font-mono text-xs font-bold uppercase mt-0.5 ${
                      selectedWard.vulnerabilityLevel === 'Critical'
                        ? 'text-red-600'
                        : selectedWard.vulnerabilityLevel === 'Very High'
                          ? 'text-orange-600'
                          : 'text-amber-600'
                    }`}
                  >
                    {selectedWard.vulnerabilityLevel}
                  </div>
                </div>
              </div>

              {/* Core Biometeorological Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">
                    HTSS Score
                  </span>
                  <strong className="font-mono text-lg font-bold text-slate-900">
                    {selectedThermal.htss_score}
                  </strong>
                  <span className="text-slate-400 text-[11px] font-normal"> / 100</span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">
                    Microclimate Temp
                  </span>
                  <strong className="font-mono text-lg font-bold text-slate-900">
                    {selectedLocalTemp.toFixed(1)}°C
                  </strong>
                  <span className="font-mono text-[10px] text-amber-600 block">
                    ({selectedWard.uhiOffsetC >= 0 ? `+${selectedWard.uhiOffsetC}` : selectedWard.uhiOffsetC}°C UHI Offset)
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">
                    Outdoor WBGT
                  </span>
                  <strong className="font-mono text-base font-bold text-slate-900">
                    {selectedThermal.wbgt_c}°C
                  </strong>
                  <span className="text-[9.5px] text-slate-500 block">
                    ({selectedThermal.wbgt_category})
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">
                    PVS Vulnerability
                  </span>
                  <strong className="font-mono text-base font-bold text-slate-900">
                    {selectedWard.pvsScore}
                  </strong>
                  <span className="text-[9.5px] text-slate-400 block">
                    / 100 Demographic Index
                  </span>
                </div>
              </div>

              {/* Exposure Multipliers */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Outdoor Worker Ratio:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    {selectedWard.outdoorWorkersPct}% ({selectedWard.outdoorWorkersPct >= 50 ? 'HIGH' : 'MODERATE'})
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Slum / Tin-Roof Housing:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    {selectedWard.slumHousingPct}%
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Vegetation Canopy Cover:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    {selectedWard.vegetationCoverPct}% ({selectedWard.vegetationCoverPct <= 12 ? 'Low Shade' : 'Adequate'})
                  </strong>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/80 pt-1.5">
                  <span className="text-slate-500">Active Cooling Pavilions:</span>
                  <strong className={`font-mono font-bold ${selectedWard.coolingCenters === 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    {selectedWard.coolingCenters} {selectedWard.coolingCenters === 0 ? '(DEFICIT)' : 'centers'}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Nearby Hospitals / PHCs:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    {selectedWard.hospitals} verified facilities
                  </strong>
                </div>
              </div>

              {/* Primary Vulnerability Driver */}
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800">
                <strong className="font-semibold text-slate-900">Primary Vulnerability Driver:</strong>{' '}
                {selectedWard.primaryDriver}
              </div>

              {/* Recommended Action */}
              <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-2.5 text-xs text-blue-950">
                <strong className="font-semibold text-blue-900 flex items-center gap-1 mb-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  Targeted Administrative Intervention:
                </strong>
                {selectedWard.recommendedAction}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center font-mono text-xs text-slate-400">
              Select a ward on the map to inspect its risk telemetry
            </div>
          )}
        </div>
      </div>

      {/* 4. Comparative Ward Matrix Cards (Filtered dynamically) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">
              Municipal Ward Comparison Matrix: {currentCity}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any card to focus and view detailed biometeorological analytics.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[9.5px] text-slate-600 font-semibold">
            {displayedWards.length} of {profile.wards.length} Wards Active
          </span>
        </div>

        <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {displayedWards.map((ward) => {
            const isSelected = selectedWard?.id === ward.id;
            const isCritical = ward.pvsScore >= 75 || (baseTemp + ward.uhiOffsetC) >= 42;

            // Highlight value based on active layer
            let activeMetricLabel = 'Microclimate Temp';
            let activeMetricVal = `${(baseTemp + ward.uhiOffsetC).toFixed(1)}°C`;
            if (activeLayer === 'vulnerability') {
              activeMetricLabel = 'PVS Score';
              activeMetricVal = `${ward.pvsScore}`;
            } else if (activeLayer === 'outdoor-workers') {
              activeMetricLabel = 'Outdoor Labor';
              activeMetricVal = `${ward.outdoorWorkersPct}%`;
            } else if (activeLayer === 'cooling-centers') {
              activeMetricLabel = 'Cooling Pavilions';
              activeMetricVal = `${ward.coolingCenters} Active`;
            } else if (activeLayer === 'healthcare') {
              activeMetricLabel = 'Hospitals';
              activeMetricVal = `${ward.hospitals} Facilities`;
            }

            return (
              <div
                key={ward.id}
                onClick={() => handleSelectWard(ward)}
                className={`cursor-pointer rounded-lg p-3 transition-all duration-150 ${
                  isSelected
                    ? 'border-2 border-slate-900 bg-slate-50 shadow-2xs'
                    : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[9.5px] text-slate-400">
                      {ward.id}
                    </span>
                    <h4 className="font-semibold text-slate-900 text-xs leading-tight mt-0.5">
                      {ward.name}
                    </h4>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-bold border ${
                      isCritical
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-slate-200 bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ward.vulnerabilityLevel}
                  </span>
                </div>

                <div className="mt-2.5 grid grid-cols-3 gap-1 border-t border-slate-100 pt-2 text-[11px]">
                  <div>
                    <span className="font-mono text-[9px] text-slate-400 block uppercase">Pop.</span>
                    <span className="font-mono font-bold text-slate-900">
                      {Math.round(ward.population / 1000)}k
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-slate-400 block uppercase">PVS</span>
                    <span className="font-mono font-bold text-slate-900">
                      {ward.pvsScore}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-slate-400 block uppercase">
                      {activeMetricLabel.split(' ')[0]}
                    </span>
                    <span className={`font-mono font-bold ${isCritical ? 'text-red-600' : 'text-slate-900'}`}>
                      {activeMetricVal}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
