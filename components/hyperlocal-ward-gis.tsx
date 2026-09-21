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
      {/* DICE Layer Switcher Bar — Stadium Pills with Pitch Black Active */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#d9d9d9] bg-white p-4 sm:p-5 shadow-none">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-black" />
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.06em] text-[#595959]">
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
                className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] transition-all duration-150 ${
                  isActive
                    ? 'bg-black text-white font-bold shadow-none'
                    : 'border border-[#d9d9d9] bg-white text-[#000000] hover:bg-[#eeeeee] font-medium'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dataset Composition Legend */}
      <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#595959] block mb-2.5">
          DATASET COMPOSITION &middot; CATEGORICAL INDICATORS
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs text-[#000000] tracking-[0.06em]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-black shrink-0" />
            <span className="truncate font-bold">Thermal Stress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#333333] shrink-0" />
            <span className="truncate font-bold">Critical Slums</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#595959] shrink-0" />
            <span className="truncate font-bold">Outdoor Workers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#808080] shrink-0" />
            <span className="truncate font-bold">Canopy Shade</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-black/60 shrink-0" />
            <span className="truncate font-bold">Cooling Centers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-white border border-black shrink-0" />
            <span className="truncate font-bold">Elderly Cohorts</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Ward Matrix & Detail Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Ward Selection Grid */}
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d9d9d9] pb-3.5">
            <div>
              <h3 className="font-bold text-[#000000] text-base tracking-[0.06em] uppercase">
                Hyperlocal Ward Matrix: {currentCity}
              </h3>
              <p className="text-xs text-[#595959] mt-0.5 tracking-[0.06em]">
                Click any municipal ward to inspect detailed demographic and biometeorological metrics.
              </p>
            </div>
            <span className="rounded-full border border-[#d9d9d9] bg-[#eeeeee] px-2.5 py-0.5 font-mono text-[10px] text-[#000000] font-bold uppercase tracking-[0.06em]">
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
                  className={`cursor-pointer rounded-lg p-4 transition-all duration-150 ${
                    isSelected
                      ? 'border-2 border-black bg-[#eeeeee] shadow-none'
                      : 'border border-[#d9d9d9] bg-white hover:border-black'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-[#595959]">
                        {ward.ward_id}
                      </span>
                      <h4 className="font-bold text-[#000000] text-sm leading-tight mt-0.5 tracking-[0.06em] uppercase">
                        {ward.ward_name}
                      </h4>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.06em] font-bold border ${
                        isCritical
                          ? 'border-black bg-black text-white'
                          : 'border-[#d9d9d9] bg-[#eeeeee] text-[#000000]'
                      }`}
                    >
                      {ward.vulnerability_level}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-1 border-t border-[#d9d9d9] pt-2.5 text-[11px]">
                    <div>
                      <span className="font-mono text-[9.5px] text-[#595959] block uppercase tracking-[0.06em]">Pop.</span>
                      <span className="font-mono font-bold text-[#000000]">
                        {Math.round(ward.population / 1000)}k
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[9.5px] text-[#595959] block uppercase tracking-[0.06em]">Workers</span>
                      <span className="font-mono font-bold text-[#000000]">
                        {ward.outdoor_workers_pct}%
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[9.5px] text-[#595959] block uppercase tracking-[0.06em]">PVS</span>
                      <span className="font-mono font-bold text-[#000000]">
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
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none lg:col-span-5">
          {selectedWard ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-[#d9d9d9] pb-3.5">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#000000]">
                    ZONE: {selectedWard.ward_name}
                  </span>
                  <h3 className="text-base font-bold text-[#000000] mt-0.5 tracking-[0.06em] uppercase">
                    Ward Risk & Exposure Profile
                  </h3>
                  <p className="text-xs text-[#595959] tracking-[0.06em]">
                    Density: {selectedWard.density.toLocaleString()} / km² · Slum: {selectedWard.slum_housing_pct}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[#595959] block font-bold">
                    Risk Category
                  </span>
                  <div
                    className="font-mono text-base font-bold uppercase mt-0.5 text-[#000000]"
                  >
                    {thermal.htss_score >= 75 ? 'EXTREME' : 'WARNING'}
                  </div>
                </div>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[#595959] block">
                    HTSS Score
                  </span>
                  <strong className="font-mono text-xl font-bold text-[#000000]">
                    {thermal.htss_score}
                  </strong>
                  <span className="text-[#595959] text-xs font-normal"> / 100</span>
                </div>

                <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[#595959] block">
                    Dry Bulb Temp
                  </span>
                  <strong className="font-mono text-xl font-bold text-[#000000]">
                    {thermal.temperature_c}°C
                  </strong>
                </div>

                <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[#595959] block">
                    Relative Humidity
                  </span>
                  <strong className="font-mono text-lg font-bold text-[#000000]">
                    {thermal.humidity_pct}%
                  </strong>
                </div>

                <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[#595959] block">
                    Outdoor WBGT
                  </span>
                  <strong className="font-mono text-lg font-bold text-[#000000]">
                    {thermal.wbgt_c}°C
                  </strong>
                  <span className="text-[10px] text-[#595959] block">
                    ({thermal.wbgt_category})
                  </span>
                </div>

                <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[#595959] block">
                    UTCI Bioclimate
                  </span>
                  <strong className="font-mono text-lg font-bold text-[#000000]">
                    {thermal.utci_c}°C
                  </strong>
                  <span className="text-[10px] text-[#595959] block">
                    ({thermal.utci_category})
                  </span>
                </div>

                <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[#595959] block">
                    72h Trend
                  </span>
                  <div className="flex items-center gap-1 font-mono text-sm font-bold text-[#000000]">
                    <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" />
                    ESCALATING ↑
                  </div>
                  <span className="text-[10px] text-[#595959] block">
                    +4.2 pts peak expected
                  </span>
                </div>
              </div>

              {/* Exposure Multipliers */}
              <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#595959]">Outdoor Worker Exposure:</span>
                  <strong className="text-black font-mono font-bold">
                    {selectedWard.outdoor_workers_pct}% (HIGH)
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#595959]">Elderly Cohort Ratio:</span>
                  <strong className="text-black font-mono font-bold">
                    {selectedWard.elderly_pct}%
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#595959]">Tree Canopy Buffer:</span>
                  <strong className="text-[#000000] font-mono font-bold">
                    {selectedWard.vegetation_cover_pct}% (Low shade)
                  </strong>
                </div>
                <div className="flex items-center justify-between border-t border-[#d9d9d9] pt-2">
                  <span className="text-[#595959]">Nearby Cooling Shelters:</span>
                  <strong className="text-[#000000] font-mono font-bold">
                    {selectedWard.cooling_center_count} centers
                  </strong>
                </div>
              </div>

              {/* Primary Vulnerability Driver */}
              <div className="rounded-lg border border-[#000000] bg-white p-3 text-xs text-[#000000]">
                <strong className="font-bold uppercase tracking-[0.06em]">Primary Vulnerability Driver:</strong> {selectedWard.primary_driver}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center font-mono text-xs text-[#595959] uppercase tracking-[0.06em]">
              Select a ward from the matrix to view the detailed risk panel
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
