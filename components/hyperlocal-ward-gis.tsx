'use client';

import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  Flame,
  Droplets,
  Users,
  Building2,
  HeartPulse,
  HardHat,
  TrendingUp,
  X,
  Compass,
  Sparkles,
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

  const getWardColor = (ward: WardVulnerability) => {
    if (activeLayer === 'vulnerability') {
      if (ward.pvs_score > 75) return 'fill-red-500/70 stroke-red-400';
      if (ward.pvs_score > 55) return 'fill-orange-500/70 stroke-orange-400';
      if (ward.pvs_score > 40) return 'fill-amber-500/70 stroke-amber-400';
      return 'fill-emerald-500/70 stroke-emerald-400';
    }

    if (activeLayer === 'outdoor-workers') {
      if (ward.outdoor_workers_pct > 50) return 'fill-purple-500/70 stroke-purple-400';
      if (ward.outdoor_workers_pct > 35) return 'fill-blue-500/70 stroke-blue-400';
      return 'fill-teal-500/70 stroke-teal-400';
    }

    // Default HTSS Risk
    if (ward.pvs_score > 70 || baseTemp >= 42) return 'fill-red-600/80 stroke-red-400';
    if (ward.pvs_score > 50 || baseTemp >= 38) return 'fill-orange-500/80 stroke-orange-400';
    return 'fill-amber-500/80 stroke-amber-400';
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
    <div className="space-y-4">
      {/* Layer Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            GIS Layer Overlays:
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveLayer('htss-risk')}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
              activeLayer === 'htss-risk'
                ? 'border-amber-400 bg-amber-500/20 text-white shadow'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            Thermal Stress (HTSS)
          </button>
          <button
            onClick={() => setActiveLayer('vulnerability')}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
              activeLayer === 'vulnerability'
                ? 'border-rose-400 bg-rose-500/20 text-white shadow'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            Vulnerability Index (PVS)
          </button>
          <button
            onClick={() => setActiveLayer('outdoor-workers')}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
              activeLayer === 'outdoor-workers'
                ? 'border-purple-400 bg-purple-500/20 text-white shadow'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            Outdoor Worker Exposure
          </button>
          <button
            onClick={() => setActiveLayer('cooling-centers')}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
              activeLayer === 'cooling-centers'
                ? 'border-teal-400 bg-teal-500/20 text-white shadow'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            Cooling Centers
          </button>
          <button
            onClick={() => setActiveLayer('healthcare')}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
              activeLayer === 'healthcare'
                ? 'border-blue-400 bg-blue-500/20 text-white shadow'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            Hospitals & Clinics
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Choropleth Matrix & Detail Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Ward Selection Grid / Interactive Choropleth */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-xl lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white">
                Hyperlocal Ward Matrix: {currentCity}
              </h3>
              <p className="text-xs text-slate-400">
                Click any municipal ward to inspect detailed demographic and biometeorological metrics.
              </p>
            </div>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
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
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-800/90 ring-2 ring-cyan-500/30 shadow-lg'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        {ward.ward_id}
                      </span>
                      <h4 className="font-bold text-white text-sm leading-tight mt-0.5">
                        {ward.ward_name}
                      </h4>
                    </div>
                    <span className={`rounded border px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                      isCritical
                        ? 'border-red-500/40 bg-red-500/10 text-red-400'
                        : 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                    }`}>
                      {ward.vulnerability_level}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-1 border-t border-slate-800/80 pt-2 text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Pop.</span>
                      <span className="font-mono font-semibold text-slate-200">{Math.round(ward.population / 1000)}k</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Workers</span>
                      <span className="font-mono font-semibold text-purple-300">{ward.outdoor_workers_pct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">PVS</span>
                      <span className="font-mono font-bold text-amber-400">{ward.pvs_score}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Ward Detailed Risk Panel */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-xl lg:col-span-5">
          {selectedWard ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    ZONE: {selectedWard.ward_name}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Ward Risk & Exposure Profile
                  </h3>
                  <p className="text-xs text-slate-400">
                    Density: {selectedWard.density.toLocaleString()} / km² • Slum Housing: {selectedWard.slum_housing_pct}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Risk Category</span>
                  <div className="font-mono text-xl font-black uppercase text-red-400">
                    {thermal.htss_score >= 75 ? 'EXTREME' : 'WARNING'}
                  </div>
                </div>
              </div>

              {/* Exact Example Metrics requested in Master Brief */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-slate-950 p-3">
                  <span className="text-[10px] text-slate-400 block">HTSS Score</span>
                  <strong className="font-mono text-lg font-black text-amber-400">
                    {thermal.htss_score}
                  </strong>
                  <span className="text-slate-500 font-normal"> / 100</span>
                </div>

                <div className="rounded-lg bg-slate-950 p-3">
                  <span className="text-[10px] text-slate-400 block">Dry Bulb Temp</span>
                  <strong className="font-mono text-lg font-bold text-white">
                    {thermal.temperature_c}°C
                  </strong>
                </div>

                <div className="rounded-lg bg-slate-950 p-3">
                  <span className="text-[10px] text-slate-400 block">Relative Humidity</span>
                  <strong className="font-mono text-base font-bold text-cyan-300">
                    {thermal.humidity_pct}%
                  </strong>
                </div>

                <div className="rounded-lg bg-slate-950 p-3">
                  <span className="text-[10px] text-slate-400 block">Outdoor WBGT</span>
                  <strong className="font-mono text-base font-bold text-amber-300">
                    {thermal.wbgt_c}°C
                  </strong>
                  <span className="text-[10px] text-slate-400 block">({thermal.wbgt_category})</span>
                </div>

                <div className="rounded-lg bg-slate-950 p-3">
                  <span className="text-[10px] text-slate-400 block">UTCI Bioclimate</span>
                  <strong className="font-mono text-base font-bold text-purple-300">
                    {thermal.utci_c}°C
                  </strong>
                  <span className="text-[10px] text-slate-400 block">({thermal.utci_category})</span>
                </div>

                <div className="rounded-lg bg-slate-950 p-3">
                  <span className="text-[10px] text-slate-400 block">72h Trend</span>
                  <div className="flex items-center gap-1 font-mono text-base font-bold text-rose-400">
                    <TrendingUp className="h-4 w-4" />
                    ESCALATING ↑
                  </div>
                  <span className="text-[10px] text-slate-400 block">+4.2 pts peak expected</span>
                </div>
              </div>

              {/* Exposure Multipliers */}
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Outdoor Worker Exposure:</span>
                  <strong className="text-purple-300 font-mono font-bold">{selectedWard.outdoor_workers_pct}% (HIGH)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Elderly Cohort Ratio:</span>
                  <strong className="text-rose-300 font-mono font-bold">{selectedWard.elderly_pct}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tree Canopy Buffer:</span>
                  <strong className="text-emerald-400 font-mono font-bold">{selectedWard.vegetation_cover_pct}% (Low shade)</strong>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400">Nearby Cooling Shelters:</span>
                  <strong className="text-white font-mono">{selectedWard.cooling_center_count} centers</strong>
                </div>
              </div>

              {/* Primary Vulnerability Driver */}
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">
                <strong>Primary Vulnerability Driver:</strong> {selectedWard.primary_driver}
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
