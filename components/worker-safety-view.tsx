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
  Info,
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

  const riskBadgeStyles = {
    Critical: 'border-red-500/50 bg-red-500/20 text-red-300',
    'Very High': 'border-rose-500/50 bg-rose-500/20 text-rose-300',
    High: 'border-orange-500/50 bg-orange-500/20 text-orange-300',
    Moderate: 'border-amber-500/50 bg-amber-500/20 text-amber-300',
    Low: 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <HardHat className="h-6 w-6 text-amber-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Occupational Outdoor Worker Safety Mode: {currentCity}
            </h2>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
              ISO 7243 & NIOSH Standards
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Biometeorological work-rest regimens, hydration quotas, and unsafe window cutoffs calibrated for manual outdoor occupations under acute thermal stress.
          </p>
        </div>

        {/* Worker Risk Level Flag */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3.5 text-left sm:text-right w-full sm:w-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Occupational Risk Level
          </div>
          <div className={`font-mono text-xl font-black uppercase text-amber-400`}>
            {guidance.occupational_risk_level} Risk
          </div>
          <div className="text-[10px] text-slate-400">
            Outdoor WBGT: <strong>{guidance.current_wbgt}°C</strong> (Workload Adjusted)
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
              className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/10 text-white ring-2 ring-amber-500/30'
                  : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-5 w-5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="mt-1.5 text-xs font-bold truncate max-w-full">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Safety Directive Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-4 w-4 text-cyan-400" />
            Safe Working Window
          </div>
          <div className="mt-2 text-sm font-bold text-white leading-tight">
            {guidance.safe_working_window}
          </div>
          <span className="mt-1 block text-[10px] text-slate-400">Avoid midday direct solar noon</span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Flame className="h-4 w-4 text-amber-400" />
            Mandatory Rest Cycle
          </div>
          <div className="mt-2 text-sm font-bold text-amber-300 leading-tight">
            {guidance.mandatory_rest_interval}
          </div>
          <span className="mt-1 block text-[10px] text-slate-400">In shaded, ventilated shelter</span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Droplets className="h-4 w-4 text-blue-400" />
            Hourly Hydration Quota
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-cyan-300">
            {guidance.hydration_requirement_liters_per_hour} L/hour
          </div>
          <span className="mt-1 block text-[10px] text-slate-400">Drink small sips every 15-20 min</span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            Max Continuous Exposure
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-rose-400">
            {guidance.max_continuous_exposure_minutes} mins
          </div>
          <span className="mt-1 block text-[10px] text-slate-400">Before mandatory deep rest</span>
        </div>
      </div>

      {/* Grid: Protective Worksite Measures vs Medical Warning Signs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Worksite Measures */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white">
              Worksite Controls for {selectedCategory}
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            {guidance.protective_measures.map((measure, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-200"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 font-bold text-emerald-400 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{measure}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Signs */}
        <div className="rounded-xl border border-red-500/30 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="font-bold text-white">
              Critical Warning Signs Requiring Immediate Stoppage
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            {guidance.warning_signs_to_halt_work.map((sign, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-950/20 p-3 text-xs text-red-200"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-900/60 font-bold text-red-400 text-[10px]">
                  !
                </span>
                <span className="leading-relaxed">{sign}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-slate-950 p-3 text-[11px] text-slate-400">
            <strong className="text-white">Emergency Protocol:</strong> If a worker becomes disoriented, hot to touch, or collapses, move them to shaded shelter immediately, apply ice or cold water soaked cloth to armpits and neck, and dial <strong>108</strong> without delay.
          </div>
        </div>
      </div>
    </div>
  );
}
