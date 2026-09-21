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

      {/* Main Grid: Interactive Map Visualizer & Ward Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive SVG Ward Map Canvas */}
        <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:p-3 shadow-2xs lg:col-span-8 overflow-hidden min-h-[320px] sm:min-h-[380px]">
          {/* Map Top Badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1 shadow-xs text-xs max-w-[calc(100%-80px)] truncate backdrop-blur-xs">
            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-semibold text-slate-900 truncate">{profile.wards.length} Wards Active</span>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <span className="text-slate-500 hidden sm:inline">Click any ward to inspect</span>
          </div>

          {/* Map Zoom Controls */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700"
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700"
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700"
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
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Background Grid Lines */}
            <g stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2">
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
                    stroke={isSelected ? '#0f172a' : isHovered ? '#334155' : 'rgba(148, 163, 184, 0.5)'}
                    strokeWidth={isSelected ? '2.5' : isHovered ? '1.8' : '1'}
                    filter={isSelected || isHovered ? 'url(#ward-glow)' : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Ward Center Label */}
                  <g pointerEvents="none" transform={`translate(${ward.center.x}, ${ward.center.y})`}>
                    <rect
                      x="-26"
                      y="-14"
                      width="52"
                      height="24"
                      rx="6"
                      fill={isSelected ? '#0f172a' : '#ffffff'}
                      fillOpacity={isSelected ? 0.95 : 0.9}
                      stroke={isSelected ? '#3b82f6' : 'rgba(226, 232, 240, 0.8)'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-3"
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="600"
                      fill={isSelected ? '#93c5fd' : '#64748b'}
                      fontFamily="monospace"
                    >
                      W-{String(ward.wardNumber).padStart(2, '0')}
                    </text>
                    <text
                      x="0"
                      y="7"
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="700"
                      fill={isSelected ? '#ffffff' : '#0f172a'}
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
                <circle r="3.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                <text
                  y="11"
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="600"
                  fill="#475569"
                >
                  {lm.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Map Bottom Legend */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2 text-[10.5px] text-slate-500">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-full">
              <span className="font-semibold text-slate-900 shrink-0">Scale:</span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Normal
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="h-2.5 w-2.5 rounded bg-amber-400" /> Watch
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="h-2.5 w-2.5 rounded bg-orange-500" /> Warning
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="h-2.5 w-2.5 rounded bg-red-500" /> Critical
              </span>
            </div>
            {profile.riverName && (
              <span className="font-medium text-sky-600 text-[10px] sm:text-xs shrink-0">
                Natural feature: {profile.riverName}
              </span>
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
