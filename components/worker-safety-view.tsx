'use client';

import React, { useState } from 'react';
import {
  HardHat,
  ShoppingBag,
  Shield,
  Bike,
  Tractor,
  User,
  Clock,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { evaluateWorkerSafety, WorkerCategory, WorkerSafetyGuidance } from '@/lib/worker-safety';
import { calculateThermalMetrics } from '@/lib/thermal-engine';

interface WorkerSafetyViewProps {
  currentCity: string;
  currentTemp: number;
  currentHumidity: number;
  currentWind?: number;
  currentSolar?: number;
}

export function WorkerSafetyView({
  currentCity,
  currentTemp,
  currentHumidity,
  currentWind = 10,
  currentSolar = 700,
}: WorkerSafetyViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<WorkerCategory>('Construction Worker');

  const thermal = calculateThermalMetrics(currentTemp, currentHumidity, currentWind, currentSolar);
  const guidance: WorkerSafetyGuidance = evaluateWorkerSafety(selectedCategory, thermal);

  const categories: Array<{ id: WorkerCategory; label: string; icon: typeof HardHat }> = [
    { id: 'Construction Worker', label: 'Construction Worker', icon: HardHat },
    { id: 'Street Vendor', label: 'Street Vendor', icon: ShoppingBag },
    { id: 'Traffic Police', label: 'Traffic Police', icon: Shield },
    { id: 'Delivery Executive', label: 'Delivery Worker', icon: Bike },
    { id: 'Agricultural Worker', label: 'Agricultural Laborer', icon: Tractor },
    { id: 'General Outdoor Worker', label: 'General Outdoor Labor', icon: User },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* Top Banner — Copernicus Command Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="space-y-1 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid h-7.5 w-7.5 place-items-center rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <HardHat className="h-4 w-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Occupational Outdoor Worker Safety: {currentCity}
            </h2>
            <span className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-blue-700">
              ISO 7243 & NIOSH Standards
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Biometeorological work-rest regimens, hydration quotas, and unsafe window cutoffs calibrated for manual outdoor occupations under acute thermal stress.
          </p>
        </div>

        {/* Worker Risk Level Flag */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-left sm:text-right w-full sm:w-auto shrink-0">
          <div className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500 font-medium">
            Occupational Risk Level
          </div>
          <div className="font-mono text-base font-bold text-slate-900 mt-0.5">
            {guidance.occupational_risk_level} Risk
          </div>
          <div className="font-mono text-[10.5px] text-slate-600 mt-0.5">
            WBGT: <strong className="text-slate-900 font-bold">{guidance.current_wbgt}°C</strong> (Adjusted)
          </div>
        </div>
      </div>

      {/* Occupational Profile Selector Bar */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all duration-150 ${
                isSelected
                  ? 'border-2 border-slate-900 bg-slate-900 text-white font-medium shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isSelected ? 'text-blue-300' : 'text-slate-500'}`} />
              <span className="mt-1.5 text-xs font-semibold truncate max-w-full">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Safety Directive Overview Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            <Clock className="h-3.5 w-3.5 text-slate-700" />
            Safe Working Window
          </div>
          <div className="mt-1.5 text-xs sm:text-sm font-bold text-slate-900 leading-snug">
            {guidance.safe_working_window}
          </div>
          <span className="mt-1 block text-[11px] text-slate-500">Avoid midday direct solar noon</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            <Flame className="h-3.5 w-3.5 text-orange-600" />
            Mandatory Rest Cycle
          </div>
          <div className="mt-1.5 text-xs sm:text-sm font-bold text-slate-900 leading-snug">
            {guidance.mandatory_rest_interval}
          </div>
          <span className="mt-1 block text-[11px] text-slate-500">In shaded, ventilated shelter</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            <Droplets className="h-3.5 w-3.5 text-blue-600" />
            Hourly Hydration Quota
          </div>
          <div className="mt-1.5 font-mono text-xl font-bold text-slate-900">
            {guidance.hydration_requirement_liters_per_hour} L/hr
          </div>
          <span className="mt-1 block text-[11px] text-slate-500">Drink small sips every 15-20 min</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
            Max Continuous Exposure
          </div>
          <div className="mt-1.5 font-mono text-xl font-bold text-slate-900">
            {guidance.max_continuous_exposure_minutes} mins
          </div>
          <span className="mt-1 block text-[11px] text-slate-500">Before mandatory deep rest</span>
        </div>
      </div>

      {/* Grid: Protective Worksite Controls vs Critical Medical Signs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Worksite Measures */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Worksite Controls for {selectedCategory}
            </h3>
          </div>

          <div className="mt-3.5 space-y-2">
            {guidance.protective_measures.map((measure, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-800"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{measure}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Signs */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Critical Signs Requiring Immediate Stoppage
            </h3>
          </div>

          <div className="mt-3.5 space-y-2">
            {guidance.warning_signs_to_halt_work.map((sign, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-red-100 bg-red-50/60 p-3 text-xs text-red-950 font-medium"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 font-mono text-[10px] font-bold text-white">
                  !
                </span>
                <span className="leading-relaxed">{sign}</span>
              </div>
            ))}
          </div>

          <div className="mt-3.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <strong className="text-slate-900 font-semibold">Emergency Protocol:</strong> If a worker becomes disoriented, hot to touch, or collapses, move them to shaded shelter immediately, apply ice or cold water soaked cloth to armpits and neck, and dial <strong className="text-slate-900 font-bold">108</strong> without delay.
          </div>
        </div>
      </div>
    </div>
  );
}
