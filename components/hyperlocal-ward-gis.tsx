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
      {/* Hume AI Layer Switcher Bar — Lab Tabs with Stadium Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#222222]/8 bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#222222]" />
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.025em] text-[#7a7876]">
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
                className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.025em] transition-all duration-150 ${
                  isActive
                    ? 'bg-[#222222] text-white font-medium shadow-none'
                    : 'border border-[#222222]/10 bg-white text-[#222222] hover:bg-[#fff9f3]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dataset Composition Legend (Hume AI Scientific Swatch Pattern) */}
      <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.025em] text-[#7a7876] block mb-2.5">
          DATASET COMPOSITION &middot; CATEGORICAL INDICATORS
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs text-[#222222]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#c094e4] shrink-0" />
            <span className="truncate">Thermal Stress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#f7bbe6] shrink-0" />
            <span className="truncate">Critical Slums</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ffb760] shrink-0" />
            <span className="truncate">Outdoor Workers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#daf7ee] shrink-0" />
            <span className="truncate">Canopy Shade</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#cef1e1] shrink-0" />
            <span className="truncate">Cooling Centers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#fce0ee] shrink-0" />
            <span className="truncate">Elderly Cohorts</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Ward Matrix & Detail Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Ward Selection Grid */}
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222222]/8 pb-3.5">
            <div>
              <h3 className="font-medium text-[#222222] text-base tracking-[-0.025em]">
                Hyperlocal Ward Matrix: {currentCity}
              </h3>
              <p className="text-xs text-[#7a7876] mt-0.5">
                Click any municipal ward to inspect detailed demographic and biometeorological metrics.
              </p>
            </div>
            <span className="rounded-full border border-[#222222]/8 bg-[#fff9f3] px-2.5 py-0.5 font-mono text-[10px] text-[#222222]">
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
                      ? 'border-2 border-[#222222] bg-[#fff9f3]'
                      : 'border border-[#222222]/8 bg-white hover:bg-[#fff9f3]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-[#7a7876]">
                        {ward.ward_id}
                      </span>
                      <h4 className="font-medium text-[#222222] text-sm leading-tight mt-0.5 tracking-[-0.025em]">
                        {ward.ward_name}
                      </h4>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.025em] border border-[#222222]/8 ${
                        isCritical
                          ? 'bg-[#fce0ee] text-[#831843]'
                          : 'bg-[#ffe9cf] text-[#854d0e]'
                      }`}
                    >
                      {ward.vulnerability_level}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-1 border-t border-[#222222]/8 pt-2.5 text-[11px]">
                    <div>
                      <span className="font-mono text-[9.5px] text-[#7a7876] block uppercase tracking-[0.025em]">Pop.</span>
                      <span className="font-mono font-medium text-[#222222]">
                        {Math.round(ward.population / 1000)}k
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[9.5px] text-[#7a7876] block uppercase tracking-[0.025em]">Workers</span>
                      <span className="font-mono font-medium text-[#c094e4]">
                        {ward.outdoor_workers_pct}%
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[9.5px] text-[#7a7876] block uppercase tracking-[0.025em]">PVS</span>
                      <span className="font-mono font-medium text-[#222222]">
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
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5 lg:col-span-5">
          {selectedWard ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-[#222222]/8 pb-3.5">
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.025em] text-[#7a7876]">
                    ZONE: {selectedWard.ward_name}
                  </span>
                  <h3 className="text-base font-medium text-[#222222] mt-0.5 tracking-[-0.025em]">
                    Ward Risk & Exposure Profile
                  </h3>
                  <p className="text-xs text-[#7a7876]">
                    Density: {selectedWard.density.toLocaleString()} / km² · Slum: {selectedWard.slum_housing_pct}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876] block">
                    Risk Category
                  </span>
                  <div
                    className={`font-mono text-base font-medium uppercase mt-0.5 ${
                      thermal.htss_score >= 75 ? 'text-[#831843]' : 'text-[#854d0e]'
                    }`}
                  >
                    {thermal.htss_score >= 75 ? 'EXTREME' : 'WARNING'}
                  </div>
                </div>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876] block">
                    HTSS Score
                  </span>
                  <strong className="font-mono text-xl font-normal text-[#222222]">
                    {thermal.htss_score}
                  </strong>
                  <span className="text-[#7a7876] text-xs font-normal"> / 100</span>
                </div>

                <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876] block">
                    Dry Bulb Temp
                  </span>
                  <strong className="font-mono text-xl font-normal text-[#222222]">
                    {thermal.temperature_c}°C
                  </strong>
                </div>

                <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876] block">
                    Relative Humidity
                  </span>
                  <strong className="font-mono text-lg font-normal text-[#222222]">
                    {thermal.humidity_pct}%
                  </strong>
                </div>

                <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876] block">
                    Outdoor WBGT
                  </span>
                  <strong className="font-mono text-lg font-normal text-[#222222]">
                    {thermal.wbgt_c}°C
                  </strong>
                  <span className="text-[10px] text-[#7a7876] block">
                    ({thermal.wbgt_category})
                  </span>
                </div>

                <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876] block">
                    UTCI Bioclimate
                  </span>
                  <strong className="font-mono text-lg font-normal text-[#c094e4]">
                    {thermal.utci_c}°C
                  </strong>
                  <span className="text-[10px] text-[#7a7876] block">
                    ({thermal.utci_category})
                  </span>
                </div>

                <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876] block">
                    72h Trend
                  </span>
                  <div className="flex items-center gap-1 font-mono text-sm font-medium text-[#831843]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    ESCALATING ↑
                  </div>
                  <span className="text-[10px] text-[#7a7876] block">
                    +4.2 pts peak expected
                  </span>
                </div>
              </div>

              {/* Exposure Multipliers */}
              <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#7a7876]">Outdoor Worker Exposure:</span>
                  <strong className="text-[#c094e4] font-mono font-medium">
                    {selectedWard.outdoor_workers_pct}% (HIGH)
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7a7876]">Elderly Cohort Ratio:</span>
                  <strong className="text-[#831843] font-mono font-medium">
                    {selectedWard.elderly_pct}%
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7a7876]">Tree Canopy Buffer:</span>
                  <strong className="text-[#1b4332] font-mono font-medium">
                    {selectedWard.vegetation_cover_pct}% (Low shade)
                  </strong>
                </div>
                <div className="flex items-center justify-between border-t border-[#222222]/8 pt-2">
                  <span className="text-[#7a7876]">Nearby Cooling Shelters:</span>
                  <strong className="text-[#222222] font-mono font-medium">
                    {selectedWard.cooling_center_count} centers
                  </strong>
                </div>
              </div>

              {/* Primary Vulnerability Driver */}
              <div className="rounded-2xl border border-[#222222]/8 bg-[#ffe9cf] p-3 text-xs text-[#854d0e]">
                <strong className="font-medium">Primary Vulnerability Driver:</strong> {selectedWard.primary_driver}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center font-mono text-xs text-[#7a7876] uppercase tracking-[0.025em]">
              Select a ward from the matrix to view the detailed risk panel
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
