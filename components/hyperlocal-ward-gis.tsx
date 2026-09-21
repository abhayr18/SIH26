'use client';

import React, { useState } from 'react';
import {
  Layers,
  Users,
  HardHat,
  TrendingUp,
} from 'lucide-react';
import { HYPERLOCAL_WARDS, WardVulnerability } from '@/lib/vulnerability-engine';
import { calculateThermalMetrics } from '@/lib/thermal-engine';

interface HyperlocalWardGisProps {
  currentCity: string;
  baseTemp: number;
  baseHumidity: number;
  onSelectWard?: (ward: WardVulnerability) => void;
}

export type GisLayerMode =
  | 'htss-risk'
  | 'vulnerability'
  | 'outdoor-workers'
  | 'cooling-centers'
  | 'healthcare';

export function HyperlocalWardGis({
  currentCity,
  baseTemp,
  baseHumidity,
  onSelectWard,
}: HyperlocalWardGisProps) {
  const [selectedWard, setSelectedWard] = useState<WardVulnerability | null>(
    HYPERLOCAL_WARDS.find((w) => w.city.toLowerCase() === currentCity.toLowerCase()) || HYPERLOCAL_WARDS[0]
  );
  const [activeLayer, setActiveLayer] = useState<GisLayerMode>('htss-risk');

  // Filter wards for the active city or show all if city not matched
  const cityWards = HYPERLOCAL_WARDS.filter(
    (w) => w.city.toLowerCase() === currentCity.toLowerCase()
  );
  const displayedWards = cityWards.length > 0 ? cityWards : HYPERLOCAL_WARDS;

  const handleSelectWard = (ward: WardVulnerability) => {
    setSelectedWard(ward);
    if (onSelectWard) onSelectWard(ward);
  };

  const thermal = selectedWard
    ? calculateThermalMetrics(
        baseTemp + (selectedWard.slum_housing_pct > 40 ? 1.4 : 0),
        baseHumidity,
        10,
        650
      )
    : calculateThermalMetrics(baseTemp, baseHumidity);

  const layerOptions: Array<{ id: GisLayerMode; label: string }> = [
    { id: 'htss-risk', label: 'Thermal Stress (HTSS)' },
    { id: 'vulnerability', label: 'Vulnerability Index (PVS)' },
    { id: 'outdoor-workers', label: 'Outdoor Workers' },
    { id: 'cooling-centers', label: 'Cooling Centers' },
    { id: 'healthcare', label: 'Hospitals & Clinics' },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* Layer Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-600" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            GIS LAYER OVERLAYS:
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {layerOptions.map((opt) => {
            const isActive = activeLayer === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveLayer(opt.id)}
                className={`rounded-lg px-3 py-1 text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dataset Composition Legend */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
        <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
          DATASET COMPOSITION &middot; CATEGORICAL INDICATORS
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
            <span className="truncate font-medium">Thermal Stress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shrink-0" />
            <span className="truncate font-medium">Critical Slums</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-600 shrink-0" />
            <span className="truncate font-medium">Outdoor Workers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate font-medium">Canopy Shade</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shrink-0" />
            <span className="truncate font-medium">Cooling Centers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="truncate font-medium">Elderly Cohorts</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Ward Matrix & Detail Panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Ward Selection Grid */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                Hyperlocal Ward Matrix: {currentCity}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any municipal ward to inspect detailed demographic and biometeorological metrics.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[9.5px] text-slate-600 font-semibold">
              India &rarr; {currentCity} &rarr; Wards
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {displayedWards.map((ward) => {
              const isSelected = selectedWard?.ward_id === ward.ward_id;
              const isCritical = ward.pvs_score >= 75;

              return (
                <div
                  key={ward.ward_id}
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
                        {ward.ward_id}
                      </span>
                      <h4 className="font-semibold text-slate-900 text-xs leading-tight mt-0.5">
                        {ward.ward_name}
                      </h4>
                    </div>
                    <span
                      className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-bold border ${
                        isCritical
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-slate-200 bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ward.vulnerability_level}
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
                      <span className="font-mono text-[9px] text-slate-400 block uppercase">Workers</span>
                      <span className="font-mono font-bold text-slate-900">
                        {ward.outdoor_workers_pct}%
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-slate-400 block uppercase">PVS</span>
                      <span className="font-mono font-bold text-slate-900">
                        {ward.pvs_score}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Ward Detailed Risk Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:col-span-5">
          {selectedWard ? (
            <div className="space-y-3.5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
                    ZONE: {selectedWard.ward_name}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    Ward Risk & Exposure Profile
                  </h3>
                  <p className="text-xs text-slate-500">
                    Density: {selectedWard.density.toLocaleString()} / km² · Slum: {selectedWard.slum_housing_pct}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Risk Category
                  </span>
                  <div
                    className="font-mono text-xs font-bold uppercase mt-0.5 text-red-600"
                  >
                    {thermal.htss_score >= 75 ? 'CRITICAL' : 'WARNING'}
                  </div>
                </div>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">
                    HTSS Score
                  </span>
                  <strong className="font-mono text-lg font-bold text-slate-900">
                    {thermal.htss_score}
                  </strong>
                  <span className="text-slate-400 text-[11px] font-normal"> / 100</span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">
                    Dry Bulb Temp
                  </span>
                  <strong className="font-mono text-lg font-bold text-slate-900">
                    {thermal.temperature_c}°C
                  </strong>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">
                    Relative Humidity
                  </span>
                  <strong className="font-mono text-base font-bold text-slate-900">
                    {thermal.humidity_pct}%
                  </strong>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">
                    Outdoor WBGT
                  </span>
                  <strong className="font-mono text-base font-bold text-slate-900">
                    {thermal.wbgt_c}°C
                  </strong>
                  <span className="text-[9.5px] text-slate-500 block">
                    ({thermal.wbgt_category})
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">
                    UTCI Bioclimate
                  </span>
                  <strong className="font-mono text-base font-bold text-slate-900">
                    {thermal.utci_c}°C
                  </strong>
                  <span className="text-[9.5px] text-slate-500 block">
                    ({thermal.utci_category})
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">
                    72h Trend
                  </span>
                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-red-600">
                    <TrendingUp className="h-3 w-3 stroke-[2.5]" />
                    ESCALATING ↑
                  </div>
                  <span className="text-[9.5px] text-slate-400 block">
                    +4.2 pts peak expected
                  </span>
                </div>
              </div>

              {/* Exposure Multipliers */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Outdoor Worker Exposure:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    {selectedWard.outdoor_workers_pct}% (HIGH)
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Elderly Cohort Ratio:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    {selectedWard.elderly_pct}%
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tree Canopy Buffer:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    {selectedWard.vegetation_cover_pct}% (Low shade)
                  </strong>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/80 pt-1.5">
                  <span className="text-slate-500">Nearby Cooling Shelters:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    {selectedWard.cooling_center_count} centers
                  </strong>
                </div>
              </div>

              {/* Primary Vulnerability Driver */}
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800">
                <strong className="font-semibold text-slate-900">Primary Vulnerability Driver:</strong> {selectedWard.primary_driver}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center font-mono text-xs text-slate-400">
              Select a ward from the matrix to view the detailed risk panel
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
