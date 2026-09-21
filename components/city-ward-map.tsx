'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Flame,
  Users,
  HardHat,
  Home,
  Building2,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { getCitySpatialProfile, WardSpatialData } from '@/lib/city-wards';
import { calculateThermalMetrics } from '@/lib/thermal-engine';
import { LeafletWardMap } from '@/components/leaflet-ward-map';
import type { GisLayerMode } from '@/components/hyperlocal-ward-gis';

interface CityWardMapProps {
  cityName: string;
  baseTemp: number;
  baseHumidity: number;
  onZoomOut: () => void;
  onSelectWard?: (ward: WardSpatialData) => void;
}

type LayerMode = 'thermal' | 'vulnerability' | 'workers' | 'slum';

export function CityWardMap({
  cityName,
  baseTemp,
  baseHumidity,
  onZoomOut,
  onSelectWard,
}: CityWardMapProps) {
  const profile = useMemo(
    () => getCitySpatialProfile(cityName, baseTemp, baseHumidity),
    [cityName, baseTemp, baseHumidity]
  );

  const [activeLayer, setActiveLayer] = useState<LayerMode>('thermal');
  const [selectedWardId, setSelectedWardId] = useState<string>(
    profile.wards[0]?.id || ''
  );

  const selectedWard = useMemo(
    () => profile.wards.find((w) => w.id === selectedWardId) || profile.wards[0],
    [profile, selectedWardId]
  );

  const handleWardClick = (ward: WardSpatialData) => {
    setSelectedWardId(ward.id);
    if (onSelectWard) onSelectWard(ward);
  };

  // Standard scientific risk color mapper (Copernicus / IMD standard)
  const getWardFill = (ward: WardSpatialData, isHovered: boolean, isSelected: boolean) => {
    if (activeLayer === 'vulnerability') {
      if (ward.pvsScore >= 80) return isSelected ? '#ef4444' : isHovered ? '#f87171' : '#fee2e2';
      if (ward.pvsScore >= 70) return isSelected ? '#f97316' : isHovered ? '#fb923c' : '#ffedd5';
      if (ward.pvsScore >= 50) return isSelected ? '#f59e0b' : isHovered ? '#fbbf24' : '#fef3c7';
      return isSelected ? '#10b981' : isHovered ? '#34d399' : '#d1fae5';
    }

    if (activeLayer === 'workers') {
      if (ward.outdoorWorkersPct >= 60) return isSelected ? '#7c3aed' : isHovered ? '#8b5cf6' : '#ede9fe';
      if (ward.outdoorWorkersPct >= 45) return isSelected ? '#2563eb' : isHovered ? '#3b82f6' : '#dbeafe';
      return isSelected ? '#0d9488' : isHovered ? '#14b8a6' : '#ccfbf1';
    }

    if (activeLayer === 'slum') {
      if (ward.slumHousingPct >= 50) return isSelected ? '#be123c' : isHovered ? '#e11d48' : '#ffe4e6';
      if (ward.slumHousingPct >= 30) return isSelected ? '#ea580c' : isHovered ? '#f97316' : '#ffedd5';
      return isSelected ? '#64748b' : isHovered ? '#94a3b8' : '#f1f5f9';
    }

    // Default: Thermal HTSS / UHI
    const localTemp = baseTemp + ward.uhiOffsetC;
    if (localTemp >= 43 || ward.pvsScore >= 80) return isSelected ? '#dc2626' : isHovered ? '#ef4444' : '#fee2e2';
    if (localTemp >= 40 || ward.pvsScore >= 65) return isSelected ? '#ea580c' : isHovered ? '#f97316' : '#ffedd5';
    if (localTemp >= 37) return isSelected ? '#d97706' : isHovered ? '#f59e0b' : '#fef3c7';
    return isSelected ? '#059669' : isHovered ? '#10b981' : '#d1fae5';
  };

  const selectedLocalTemp = baseTemp + (selectedWard?.uhiOffsetC || 0);
  const selectedThermal = calculateThermalMetrics(
    selectedLocalTemp,
    baseHumidity,
    10,
    700
  );

  return (
    <div className="space-y-4">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onZoomOut}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition shadow-2xs"
            title="Zoom out to national India map"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>National Overview</span>
          </button>
          <span className="text-slate-300">|</span>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[9.5px] font-semibold text-blue-600 uppercase tracking-wider">
              <span>ZOOM LEVEL: CITY MUNICIPAL WARDS</span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              {profile.municipalCorporation}
            </h3>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:flex-wrap">
          <span className="font-mono text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider hidden md:inline mr-1 shrink-0">
            LAYER:
          </span>
          <button
            onClick={() => setActiveLayer('thermal')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition shrink-0 ${
              activeLayer === 'thermal'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Thermal UHI</span>
          </button>
          <button
            onClick={() => setActiveLayer('vulnerability')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition shrink-0 ${
              activeLayer === 'vulnerability'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Vulnerability (PVS)</span>
          </button>
          <button
            onClick={() => setActiveLayer('workers')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition shrink-0 ${
              activeLayer === 'workers'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium'
            }`}
          >
            <HardHat className="h-3.5 w-3.5" />
            <span>Labor Density</span>
          </button>
          <button
            onClick={() => setActiveLayer('slum')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition shrink-0 ${
              activeLayer === 'slum'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Tin Roofs</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Leaflet Map + Ward Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Leaflet Ward Map */}
        <div className="lg:col-span-8">
          <LeafletWardMap
            profile={profile}
            activeLayer={activeLayer as GisLayerMode}
            activeIndicator={null}
            selectedWardId={selectedWardId}
            baseTemp={baseTemp}
            baseHumidity={baseHumidity}
            onSelectWard={(ward) => { setSelectedWardId(ward.id); if (onSelectWard) onSelectWard(ward); }}
            isWardMatchingIndicator={() => true}
            getWardFill={getWardFill}
          />
          {/* Legend */}
          <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[10.5px] text-slate-500">
            <span className="font-semibold text-slate-900 shrink-0">Scale:</span>
            <span className="flex items-center gap-1 shrink-0"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Normal</span>
            <span className="flex items-center gap-1 shrink-0"><span className="h-2.5 w-2.5 rounded bg-amber-400" /> Watch</span>
            <span className="flex items-center gap-1 shrink-0"><span className="h-2.5 w-2.5 rounded bg-orange-500" /> Warning</span>
            <span className="flex items-center gap-1 shrink-0"><span className="h-2.5 w-2.5 rounded bg-red-500" /> Critical</span>
            {profile.riverName && (
              <span className="font-medium text-sky-600 ml-auto">{profile.riverName}</span>
            )}
          </div>
        </div>

        {/* Selected Ward Telemetry Inspector Card */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:col-span-4">
          {selectedWard ? (
            <div className="flex flex-1 flex-col justify-between space-y-3.5">
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[9.5px] font-semibold text-slate-700 border border-slate-200">
                        {selectedWard.id}
                      </span>
                      <span className="font-mono text-[9.5px] text-slate-400 uppercase tracking-wider">
                        ZONE: {selectedWard.zone}
                      </span>
                    </div>
                    <h4 className="mt-1 text-sm font-bold text-slate-900 leading-snug">
                      {selectedWard.name}
                    </h4>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[9.5px] font-semibold border ${
                      selectedWard.vulnerabilityLevel === 'Critical'
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : selectedWard.vulnerabilityLevel === 'High'
                        ? 'border-orange-200 bg-orange-50 text-orange-700'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {selectedWard.vulnerabilityLevel}
                  </span>
                </div>

                {/* Temperature & Microclimate Metric Callout */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                    <span className="block font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                      Ward Microclimate
                    </span>
                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <b className="text-lg font-bold text-slate-900">
                        {selectedLocalTemp.toFixed(1)}°C
                      </b>
                      <span className="font-mono text-[10px] font-semibold text-red-600">
                        {selectedWard.uhiOffsetC > 0
                          ? `+${selectedWard.uhiOffsetC}°C`
                          : `${selectedWard.uhiOffsetC}°C`}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                    <span className="block font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                      Vulnerability (PVS)
                    </span>
                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <b className="text-lg font-bold text-slate-900">
                        {selectedWard.pvsScore}
                      </b>
                      <span className="font-mono text-[10px] text-slate-400">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Key Vulnerability Drivers */}
                <div className="mt-2.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      Population
                    </span>
                    <span className="font-semibold text-slate-900">
                      {selectedWard.population.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <HardHat className="h-3.5 w-3.5 text-slate-500" />
                      Outdoor Labor
                    </span>
                    <span className="font-semibold text-slate-900">
                      {selectedWard.outdoorWorkersPct}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Home className="h-3.5 w-3.5 text-slate-500" />
                      Tin Roof / Informal
                    </span>
                    <span className="font-semibold text-slate-900">
                      {selectedWard.slumHousingPct}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      Cooling / Healthcare
                    </span>
                    <span className="font-semibold text-slate-900">
                      {selectedWard.coolingCenters} shelters · {selectedWard.hospitals} clinics
                    </span>
                  </div>
                </div>

                {/* Primary Risk Driver */}
                <div className="mt-2.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs">
                  <span className="block font-mono text-[9.5px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                    PRIMARY VULNERABILITY DRIVER
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-800">
                    {selectedWard.primaryDriver}
                  </p>
                </div>
              </div>

              {/* Recommended Municipal Action */}
              <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3 text-xs text-blue-950">
                <div className="flex items-center gap-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-blue-700 mb-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>AUTHORITY ACTION DIRECTIVE</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-900">
                  {selectedWard.recommendedAction}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-xs text-slate-400">
              Select a ward on the map to inspect hyperlocal metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
