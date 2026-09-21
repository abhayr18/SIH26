'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Flame,
  Users,
  HardHat,
  Home,
  Building2,
  HeartPulse,
  Info,
  Layers,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { getCitySpatialProfile, WardSpatialData } from '@/lib/city-wards';
import { calculateThermalMetrics } from '@/lib/thermal-engine';

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
  const [hoveredWardId, setHoveredWardId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectedWard = useMemo(
    () => profile.wards.find((w) => w.id === selectedWardId) || profile.wards[0],
    [profile, selectedWardId]
  );

  const handleWardClick = (ward: WardSpatialData) => {
    setSelectedWardId(ward.id);
    if (onSelectWard) onSelectWard(ward);
  };

  // Color mapper based on active layer
  const getWardFill = (ward: WardSpatialData, isHovered: boolean, isSelected: boolean) => {
    if (activeLayer === 'vulnerability') {
      if (ward.pvsScore >= 80) return isSelected ? '#ef4444' : isHovered ? '#f87171' : '#fca5a5';
      if (ward.pvsScore >= 70) return isSelected ? '#f97316' : isHovered ? '#fb923c' : '#fdba74';
      if (ward.pvsScore >= 50) return isSelected ? '#f59e0b' : isHovered ? '#fbbf24' : '#fde68a';
      return isSelected ? '#10b981' : isHovered ? '#34d399' : '#a7f3d0';
    }

    if (activeLayer === 'workers') {
      if (ward.outdoorWorkersPct >= 60) return isSelected ? '#7c3aed' : isHovered ? '#8b5cf6' : '#c4b5fd';
      if (ward.outdoorWorkersPct >= 45) return isSelected ? '#2563eb' : isHovered ? '#3b82f6' : '#93c5fd';
      return isSelected ? '#0d9488' : isHovered ? '#14b8a6' : '#99f6e4';
    }

    if (activeLayer === 'slum') {
      if (ward.slumHousingPct >= 50) return isSelected ? '#be123c' : isHovered ? '#e11d48' : '#fda4af';
      if (ward.slumHousingPct >= 30) return isSelected ? '#ea580c' : isHovered ? '#f97316' : '#fdba74';
      return isSelected ? '#64748b' : isHovered ? '#94a3b8' : '#cbd5e1';
    }

    // Default: Thermal HTSS
    const localTemp = baseTemp + ward.uhiOffsetC;
    if (localTemp >= 43 || ward.pvsScore >= 80) return isSelected ? '#dc2626' : isHovered ? '#ef4444' : '#fca5a5';
    if (localTemp >= 40 || ward.pvsScore >= 65) return isSelected ? '#ea580c' : isHovered ? '#f97316' : '#fdba74';
    if (localTemp >= 37) return isSelected ? '#d97706' : isHovered ? '#f59e0b' : '#fde68a';
    return isSelected ? '#059669' : isHovered ? '#10b981' : '#a7f3d0';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl border border-[#0e0f10]/6 bg-white p-4 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onZoomOut}
            className="flex items-center gap-1.5 rounded-full border border-[#0e0f10]/10 bg-[#f4f4f8] hover:bg-[#ffe9eb] hover:text-[#ff5065] px-3.5 py-1.5 text-xs font-semibold text-[#0e0f10] transition-all shadow-none"
            title="Zoom out to national India map"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>← National Map</span>
          </button>
          <span className="text-[#0e0f10]/20">|</span>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#ff5065] uppercase tracking-wider">
              <span>ZOOM LEVEL: CITY MUNICIPAL WARDS</span>
            </div>
            <h3 className="text-sm font-bold text-[#0e0f10] leading-tight">
              {profile.municipalCorporation}
            </h3>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:flex-wrap">
          <span className="font-mono text-[10px] font-bold text-[#666666] uppercase tracking-wider hidden md:inline mr-1 shrink-0">
            LAYER:
          </span>
          <button
            onClick={() => setActiveLayer('thermal')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs transition shrink-0 ${
              activeLayer === 'thermal'
                ? 'bg-[#ff5065] text-white font-bold shadow-none'
                : 'text-[#666666] hover:text-[#0e0f10] hover:bg-[#0e0f10]/5 font-medium'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Thermal UHI</span>
          </button>
          <button
            onClick={() => setActiveLayer('vulnerability')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs transition shrink-0 ${
              activeLayer === 'vulnerability'
                ? 'bg-[#ff5065] text-white font-bold shadow-none'
                : 'text-[#666666] hover:text-[#0e0f10] hover:bg-[#0e0f10]/5 font-medium'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Vulnerability (PVS)</span>
          </button>
          <button
            onClick={() => setActiveLayer('workers')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs transition shrink-0 ${
              activeLayer === 'workers'
                ? 'bg-[#ff5065] text-white font-bold shadow-none'
                : 'text-[#666666] hover:text-[#0e0f10] hover:bg-[#0e0f10]/5 font-medium'
            }`}
          >
            <HardHat className="h-3.5 w-3.5" />
            <span>Labor Density</span>
          </button>
          <button
            onClick={() => setActiveLayer('slum')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs transition shrink-0 ${
              activeLayer === 'slum'
                ? 'bg-[#ff5065] text-white font-bold shadow-none'
                : 'text-[#666666] hover:text-[#0e0f10] hover:bg-[#0e0f10]/5 font-medium'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Tin Roofs</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map Visualizer & Ward Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive SVG Ward Map Canvas */}
        <div className="relative rounded-3xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-2.5 sm:p-3 shadow-inner lg:col-span-8 overflow-hidden min-h-[320px] sm:min-h-[380px]">
          {/* Map Top Badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-[#0e0f10]/6 bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-sm text-xs max-w-[calc(100%-80px)] truncate">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff5065] animate-pulse" />
            <span className="font-bold text-[#0e0f10] truncate">{profile.wards.length} Wards Active</span>
            <span className="text-[#0e0f10]/20 hidden sm:inline">·</span>
            <span className="text-[#666666] font-medium hidden sm:inline">Click any ward to inspect</span>
          </div>

          {/* Map Zoom Controls */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col gap-1 rounded-2xl border border-[#0e0f10]/6 bg-white p-1 shadow-sm">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1.5 rounded-lg hover:bg-neutral-100 text-[#0e0f10]"
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="p-1.5 rounded-lg hover:bg-neutral-100 text-[#0e0f10]"
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg hover:bg-neutral-100 text-[#0e0f10]"
              title="Reset zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* SVG Map */}
          <svg
            viewBox="0 0 510 360"
            className="w-full h-[300px] sm:h-[400px] transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <defs>
              <filter id="ward-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* Background Grid Lines */}
            <g stroke="#0e0f10" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.1">
              {[60, 120, 180, 240, 300].map((y) => (
                <line key={`h-${y}`} x1="10" y1={y} x2="500" y2={y} />
              ))}
              {[100, 200, 300, 400].map((x) => (
                <line key={`v-${x}`} x1={x} y1="10" x2={x} y2="350" />
              ))}
            </g>

            {/* Natural River Feature (if applicable) */}
            {profile.riverPath && (
              <g>
                <path
                  d={profile.riverPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="14"
                  strokeLinecap="round"
                  opacity="0.35"
                />
                <path
                  d={profile.riverPath}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                  opacity="0.6"
                />
              </g>
            )}

            {/* Municipal Wards Polygons */}
            {profile.wards.map((ward) => {
              const isSelected = selectedWard?.id === ward.id;
              const isHovered = hoveredWardId === ward.id;
              const fillColor = getWardFill(ward, isHovered, isSelected);

              return (
                <g
                  key={ward.id}
                  className="cursor-pointer transition-all duration-150"
                  onClick={() => handleWardClick(ward)}
                  onMouseEnter={() => setHoveredWardId(ward.id)}
                  onMouseLeave={() => setHoveredWardId(null)}
                >
                  {/* Ward Polygon */}
                  <polygon
                    points={ward.polygon}
                    fill={fillColor}
                    stroke={isSelected ? '#ff5065' : isHovered ? '#0e0f10' : '#0e0f10'/20}
                    strokeWidth={isSelected ? '3.5' : isHovered ? '2' : '1.2'}
                    filter={isSelected || isHovered ? 'url(#ward-glow)' : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Ward Center Label */}
                  <g pointerEvents="none" transform={`translate(${ward.center.x}, ${ward.center.y})`}>
                    <rect
                      x="-28"
                      y="-16"
                      width="56"
                      height="26"
                      rx="6"
                      fill={isSelected ? '#0e0f10' : '#ffffff'}
                      fillOpacity={isSelected ? 0.95 : 0.92}
                      stroke={isSelected ? '#ff5065' : '#0e0f10'/10}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-4"
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="700"
                      fill={isSelected ? '#ff5065' : '#666666'}
                      fontFamily="monospace"
                    >
                      W-{String(ward.wardNumber).padStart(2, '0')}
                    </text>
                    <text
                      x="0"
                      y="7"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="800"
                      fill={isSelected ? '#ffffff' : '#0e0f10'}
                    >
                      {(baseTemp + ward.uhiOffsetC).toFixed(1)}°C
                    </text>
                  </g>
                </g>
              );
            })}

            {/* City Landmarks Pins */}
            {profile.landmarks.map((lm) => (
              <g key={lm.name} transform={`translate(${lm.x}, ${lm.y})`} pointerEvents="none">
                <circle r="4" fill="#0e0f10" stroke="#ffffff" strokeWidth="1.5" />
                <text
                  y="12"
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="600"
                  fill="#666666"
                >
                  {lm.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Map Bottom Legend */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#0e0f10]/6 pt-2 text-[10px] text-[#666666]">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-full">
              <span className="font-bold text-[#0e0f10] shrink-0">Scale:</span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="h-2.5 w-2.5 rounded bg-emerald-400" /> Normal
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="h-2.5 w-2.5 rounded bg-amber-400" /> High
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="h-2.5 w-2.5 rounded bg-orange-500" /> Very High
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="h-2.5 w-2.5 rounded bg-[#ff5065]" /> Critical
              </span>
            </div>
            {profile.riverName && (
              <span className="font-semibold text-sky-600 text-[10px] sm:text-xs shrink-0">
                Natural feature: {profile.riverName}
              </span>
            )}
          </div>
        </div>

        {/* Selected Ward Telemetry Inspector Card */}
        <div className="flex flex-col rounded-3xl border border-[#0e0f10]/6 bg-white p-4 sm:p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)] lg:col-span-4">
          {selectedWard ? (
            <div className="flex flex-1 flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-[#0e0f10]/6 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-[#f4f4f8] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0e0f10] border border-[#0e0f10]/10">
                        {selectedWard.id}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666]">
                        ZONE: {selectedWard.zone}
                      </span>
                    </div>
                    <h4 className="mt-1 text-base font-bold text-[#0e0f10] leading-snug">
                      {selectedWard.name}
                    </h4>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border ${
                      selectedWard.vulnerabilityLevel === 'Critical'
                        ? 'border-[#ff5065]/30 bg-[#ffe9eb] text-[#ff5065]'
                        : selectedWard.vulnerabilityLevel === 'Very High'
                        ? 'border-[#ff7a59]/30 bg-[#ff7a59]/10 text-[#ff7a59]'
                        : selectedWard.vulnerabilityLevel === 'High'
                        ? 'border-[#ff5c35]/30 bg-[#ff5c35]/10 text-[#ff5c35]'
                        : 'border-[#0e0f10]/10 bg-[#f4f4f8] text-[#0e0f10]'
                    }`}
                  >
                    {selectedWard.vulnerabilityLevel}
                  </span>
                </div>

                {/* Temperature & Microclimate Metric Callout */}
                <div className="mt-3.5 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3">
                    <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-[#666666]">
                      Ward Microclimate
                    </span>
                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <b className="text-xl font-bold text-[#0e0f10]">
                        {selectedLocalTemp.toFixed(1)}°C
                      </b>
                      <span
                        className={`font-mono text-[10px] font-bold ${
                          selectedWard.uhiOffsetC > 0 ? 'text-[#ff5065]' : 'text-[#666666]'
                        }`}
                      >
                        {selectedWard.uhiOffsetC > 0
                          ? `+${selectedWard.uhiOffsetC}°C`
                          : `${selectedWard.uhiOffsetC}°C`}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3">
                    <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-[#666666]">
                      Vulnerability (PVS)
                    </span>
                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <b className="text-xl font-bold text-[#ff5065]">
                        {selectedWard.pvsScore}
                      </b>
                      <span className="font-mono text-[10px] text-[#666666]">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Key Vulnerability Drivers */}
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-2.5">
                    <span className="flex items-center gap-1.5 text-[#666666]">
                      <Users className="h-3.5 w-3.5 text-[#0e0f10]" />
                      Population
                    </span>
                    <span className="font-bold text-[#0e0f10]">
                      {selectedWard.population.toLocaleString()} residents
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-2.5">
                    <span className="flex items-center gap-1.5 text-[#666666]">
                      <HardHat className="h-3.5 w-3.5 text-[#ff5065]" />
                      Outdoor Labor Ratio
                    </span>
                    <span className="font-bold text-[#ff5065]">
                      {selectedWard.outdoorWorkersPct}% of workforce
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-2.5">
                    <span className="flex items-center gap-1.5 text-[#666666]">
                      <Home className="h-3.5 w-3.5 text-[#ff7a59]" />
                      Tin Roof / Informal
                    </span>
                    <span className="font-bold text-[#0e0f10]">
                      {selectedWard.slumHousingPct}% housing
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-2.5">
                    <span className="flex items-center gap-1.5 text-[#666666]">
                      <Building2 className="h-3.5 w-3.5 text-[#0e0f10]" />
                      Cooling & Healthcare
                    </span>
                    <span className="font-bold text-[#0e0f10]">
                      {selectedWard.coolingCenters} misting · {selectedWard.hospitals} clinics
                    </span>
                  </div>
                </div>

                {/* Primary Risk Driver */}
                <div className="mt-3 rounded-2xl border border-[#ff5065]/20 bg-[#ffe9eb] p-3 text-xs text-[#ff5065]">
                  <b className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#ff5065] mb-1">
                    PRIMARY VULNERABILITY DRIVER
                  </b>
                  <p className="text-[11px] leading-relaxed text-[#0e0f10]">
                    {selectedWard.primaryDriver}
                  </p>
                </div>
              </div>

              {/* Recommended Municipal Action */}
              <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3.5 text-xs text-[#0e0f10]">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#ff5065] mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#ff5065]" />
                  <span>AUTHORITY ACTION DIRECTIVE</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#0e0f10]">
                  {selectedWard.recommendedAction}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-xs text-[#666666]">
              Select a ward on the map to inspect hyperlocal metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
