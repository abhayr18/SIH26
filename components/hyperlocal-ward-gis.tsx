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
    <div className="space-y-6 font-sans">
      {/* Contrast Layer Switcher Bar — Stadium Pills with Signal Coral Active */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[#0e0f10]/6 bg-white p-4 sm:p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#ff5065]" />
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#666666]">
            GIS LAYER OVERLAYS:
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {layerOptions.map((opt) => {
            const isActive = activeLayer === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveLayer(opt.id)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-150 ${
                  isActive
                    ? 'bg-[#ff5065] text-white font-bold shadow-none'
                    : 'border border-[#0e0f10]/10 bg-white text-[#0e0f10] hover:bg-[#f4f4f8] font-medium'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dataset Composition Legend */}
      <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#666666] block mb-2.5">
          DATASET COMPOSITION &middot; CATEGORICAL INDICATORS
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs text-[#0e0f10]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5065] shrink-0" />
            <span className="truncate font-medium">Thermal Stress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff7a59] shrink-0" />
            <span className="truncate font-medium">Critical Slums</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5c35] shrink-0" />
            <span className="truncate font-medium">Outdoor Workers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#0e0f10] shrink-0" />
            <span className="truncate font-medium">Canopy Shade</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5065]/50 shrink-0" />
            <span className="truncate font-medium">Cooling Centers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ffe9eb] border border-[#ff5065]/40 shrink-0" />
            <span className="truncate font-medium">Elderly Cohorts</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Ward Matrix & Detail Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Ward Selection Grid */}
        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)] lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0e0f10]/6 pb-3.5">
            <div>
              <h3 className="font-bold text-[#0e0f10] text-base tracking-tight">
                Hyperlocal Ward Matrix: {currentCity}
              </h3>
              <p className="text-xs text-[#666666] mt-0.5">
                Click any municipal ward to inspect detailed demographic and biometeorological metrics.
              </p>
            </div>
            <span className="rounded-full border border-[#0e0f10]/6 bg-[#f4f4f8] px-2.5 py-0.5 font-mono text-[10px] text-[#0e0f10] font-medium">
              India &rarr; {currentCity} &rarr; Wards
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
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-150 ${
                    isSelected
                      ? 'border-2 border-[#ff5065] bg-[#ffe9eb]/40 shadow-sm'
                      : 'border border-[#0e0f10]/6 bg-[#f4f4f8] hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-[#666666]">
                        {ward.ward_id}
                      </span>
                      <h4 className="font-bold text-[#0e0f10] text-sm leading-tight mt-0.5 tracking-tight">
                        {ward.ward_name}
                      </h4>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold border ${
                        isCritical
                          ? 'border-[#ff5065]/30 bg-[#ffe9eb] text-[#ff5065]'
                          : 'border-[#ff7a59]/30 bg-[#ff7a59]/10 text-[#ff7a59]'
                      }`}
                    >
                      {ward.vulnerability_level}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-1 border-t border-[#0e0f10]/6 pt-2.5 text-[11px]">
                    <div>
                      <span className="font-mono text-[9.5px] text-[#666666] block uppercase tracking-wider">Pop.</span>
                      <span className="font-mono font-bold text-[#0e0f10]">
                        {Math.round(ward.population / 1000)}k
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[9.5px] text-[#666666] block uppercase tracking-wider">Workers</span>
                      <span className="font-mono font-bold text-[#ff5065]">
                        {ward.outdoor_workers_pct}%
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[9.5px] text-[#666666] block uppercase tracking-wider">PVS</span>
                      <span className="font-mono font-bold text-[#0e0f10]">
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
        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)] lg:col-span-5">
          {selectedWard ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-[#0e0f10]/6 pb-3.5">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ff5065]">
                    ZONE: {selectedWard.ward_name}
                  </span>
                  <h3 className="text-base font-bold text-[#0e0f10] mt-0.5 tracking-tight">
                    Ward Risk & Exposure Profile
                  </h3>
                  <p className="text-xs text-[#666666]">
                    Density: {selectedWard.density.toLocaleString()} / km² · Slum: {selectedWard.slum_housing_pct}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] block font-medium">
                    Risk Category
                  </span>
                  <div
                    className={`font-mono text-base font-bold uppercase mt-0.5 ${
                      thermal.htss_score >= 75 ? 'text-[#ff5065]' : 'text-[#ff7a59]'
                    }`}
                  >
                    {thermal.htss_score >= 75 ? 'EXTREME' : 'WARNING'}
                  </div>
                </div>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] block">
                    HTSS Score
                  </span>
                  <strong className="font-mono text-xl font-bold text-[#ff5065]">
                    {thermal.htss_score}
                  </strong>
                  <span className="text-[#666666] text-xs font-normal"> / 100</span>
                </div>

                <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] block">
                    Dry Bulb Temp
                  </span>
                  <strong className="font-mono text-xl font-bold text-[#0e0f10]">
                    {thermal.temperature_c}°C
                  </strong>
                </div>

                <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] block">
                    Relative Humidity
                  </span>
                  <strong className="font-mono text-lg font-bold text-[#0e0f10]">
                    {thermal.humidity_pct}%
                  </strong>
                </div>

                <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] block">
                    Outdoor WBGT
                  </span>
                  <strong className="font-mono text-lg font-bold text-[#0e0f10]">
                    {thermal.wbgt_c}°C
                  </strong>
                  <span className="text-[10px] text-[#666666] block">
                    ({thermal.wbgt_category})
                  </span>
                </div>

                <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] block">
                    UTCI Bioclimate
                  </span>
                  <strong className="font-mono text-lg font-bold text-[#ff5065]">
                    {thermal.utci_c}°C
                  </strong>
                  <span className="text-[10px] text-[#666666] block">
                    ({thermal.utci_category})
                  </span>
                </div>

                <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] block">
                    72h Trend
                  </span>
                  <div className="flex items-center gap-1 font-mono text-sm font-bold text-[#ff5065]">
                    <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" />
                    ESCALATING ↑
                  </div>
                  <span className="text-[10px] text-[#666666] block">
                    +4.2 pts peak expected
                  </span>
                </div>
              </div>

              {/* Exposure Multipliers */}
              <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#666666]">Outdoor Worker Exposure:</span>
                  <strong className="text-[#ff5065] font-mono font-bold">
                    {selectedWard.outdoor_workers_pct}% (HIGH)
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#666666]">Elderly Cohort Ratio:</span>
                  <strong className="text-[#ff7a59] font-mono font-bold">
                    {selectedWard.elderly_pct}%
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#666666]">Tree Canopy Buffer:</span>
                  <strong className="text-[#0e0f10] font-mono font-bold">
                    {selectedWard.vegetation_cover_pct}% (Low shade)
                  </strong>
                </div>
                <div className="flex items-center justify-between border-t border-[#0e0f10]/6 pt-2">
                  <span className="text-[#666666]">Nearby Cooling Shelters:</span>
                  <strong className="text-[#0e0f10] font-mono font-bold">
                    {selectedWard.cooling_center_count} centers
                  </strong>
                </div>
              </div>

              {/* Primary Vulnerability Driver */}
              <div className="rounded-2xl border border-[#ff5065]/20 bg-[#ffe9eb] p-3 text-xs text-[#ff5065]">
                <strong className="font-bold">Primary Vulnerability Driver:</strong> {selectedWard.primary_driver}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center font-mono text-xs text-[#666666] uppercase tracking-wider">
              Select a ward from the matrix to view the detailed risk panel
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
