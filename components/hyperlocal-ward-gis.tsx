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

  return (
    <div className="space-y-5 font-sans">
      {/* Layer Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-600" />
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
            GIS LAYER OVERLAYS:
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveLayer('htss-risk')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              activeLayer === 'htss-risk'
                ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-2xs font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Thermal Stress (HTSS)
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('vulnerability')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              activeLayer === 'vulnerability'
                ? 'border-rose-400 bg-rose-50 text-rose-900 shadow-2xs font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Vulnerability Index (PVS)
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('outdoor-workers')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              activeLayer === 'outdoor-workers'
                ? 'border-purple-400 bg-purple-50 text-purple-900 shadow-2xs font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Outdoor Worker Exposure
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('cooling-centers')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              activeLayer === 'cooling-centers'
                ? 'border-teal-400 bg-teal-50 text-teal-900 shadow-2xs font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Cooling Centers
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('healthcare')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              activeLayer === 'healthcare'
                ? 'border-blue-400 bg-blue-50 text-blue-900 shadow-2xs font-bold'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Hospitals & Clinics
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Ward Matrix & Detail Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Ward Selection Grid */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Hyperlocal Ward Matrix: {currentCity}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any municipal ward to inspect detailed demographic and biometeorological metrics.
              </p>
            </div>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
              India → {currentCity} → Wards
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {displayedWards.map((ward) => {
              const isSelected = selectedWard?.ward_id === ward.ward_id;
              const isCritical = ward.pvs_score >= 75;

              return (
                <div
                  key={ward.ward_id}
                  onClick={() => handleSelectWard(ward)}
                  className={`cursor-pointer rounded-xl p-3.5 transition ${
                    isSelected
                      ? 'border-2 border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-500/20'
                      : 'border border-slate-200/80 bg-slate-50/60 hover:border-slate-300 hover:bg-white shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        {ward.ward_id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight mt-0.5">
                        {ward.ward_name}
                      </h4>
                    </div>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        isCritical
                          ? 'border border-red-200 bg-red-50 text-red-700'
                          : 'border border-amber-200 bg-amber-50 text-amber-800'
                      }`}
                    >
                      {ward.vulnerability_level}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-1 border-t border-slate-200/70 pt-2 text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Pop.</span>
                      <span className="font-mono font-semibold text-slate-700">
                        {Math.round(ward.population / 1000)}k
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Workers</span>
                      <span className="font-mono font-bold text-purple-700">
                        {ward.outdoor_workers_pct}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">PVS</span>
                      <span className="font-mono font-bold text-amber-700">
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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs lg:col-span-5">
          {selectedWard ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-blue-600">
                    ZONE: {selectedWard.ward_name}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Ward Risk & Exposure Profile
                  </h3>
                  <p className="text-xs text-slate-500">
                    Density: {selectedWard.density.toLocaleString()} / km² · Slum Housing: {selectedWard.slum_housing_pct}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                    Risk Category
                  </span>
                  <div
                    className={`font-mono text-lg font-black uppercase ${
                      thermal.htss_score >= 75 ? 'text-red-600' : 'text-amber-600'
                    }`}
                  >
                    {thermal.htss_score >= 75 ? 'EXTREME' : 'WARNING'}
                  </div>
                </div>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                    HTSS Score
                  </span>
                  <strong className="font-mono text-xl font-black text-amber-600">
                    {thermal.htss_score}
                  </strong>
                  <span className="text-slate-400 text-xs font-medium"> / 100</span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                    Dry Bulb Temp
                  </span>
                  <strong className="font-mono text-xl font-bold text-slate-900">
                    {thermal.temperature_c}°C
                  </strong>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                    Relative Humidity
                  </span>
                  <strong className="font-mono text-lg font-bold text-blue-700">
                    {thermal.humidity_pct}%
                  </strong>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                    Outdoor WBGT
                  </span>
                  <strong className="font-mono text-lg font-bold text-amber-700">
                    {thermal.wbgt_c}°C
                  </strong>
                  <span className="text-[10px] text-slate-500 block font-medium">
                    ({thermal.wbgt_category})
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                    UTCI Bioclimate
                  </span>
                  <strong className="font-mono text-lg font-bold text-purple-700">
                    {thermal.utci_c}°C
                  </strong>
                  <span className="text-[10px] text-slate-500 block font-medium">
                    ({thermal.utci_category})
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                    72h Trend
                  </span>
                  <div className="flex items-center gap-1 font-mono text-base font-bold text-rose-600">
                    <TrendingUp className="h-4 w-4" />
                    ESCALATING ↑
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    +4.2 pts peak expected
                  </span>
                </div>
              </div>

              {/* Exposure Multipliers */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Outdoor Worker Exposure:</span>
                  <strong className="text-purple-700 font-mono font-bold">
                    {selectedWard.outdoor_workers_pct}% (HIGH)
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Elderly Cohort Ratio:</span>
                  <strong className="text-rose-700 font-mono font-bold">
                    {selectedWard.elderly_pct}%
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Tree Canopy Buffer:</span>
                  <strong className="text-emerald-700 font-mono font-bold">
                    {selectedWard.vegetation_cover_pct}% (Low shade)
                  </strong>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/70 pt-2">
                  <span className="text-slate-600 font-medium">Nearby Cooling Shelters:</span>
                  <strong className="text-slate-900 font-mono font-bold">
                    {selectedWard.cooling_center_count} centers
                  </strong>
                </div>
              </div>

              {/* Primary Vulnerability Driver */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 font-medium">
                <strong className="font-bold">Primary Vulnerability Driver:</strong> {selectedWard.primary_driver}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-xs text-slate-500">
              Select a ward from the matrix to view the detailed risk panel
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
