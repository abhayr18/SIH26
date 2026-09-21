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
    <div className="space-y-6 font-sans">
      {/* Top Banner — Hume AI Scientific Pastel Instrument Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#222222]/8 bg-white p-6 sm:p-7">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffe9cf] text-[#854d0e] border border-[#222222]/8">
              <HardHat className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-medium tracking-[-0.025em] text-[#222222]">
              Occupational Outdoor Worker Safety: {currentCity}
            </h2>
            <span className="rounded-full border border-[#222222]/8 bg-[#fff9f3] px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
              ISO 7243 & NIOSH Standards
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#7a7876] leading-relaxed">
            Biometeorological work-rest regimens, hydration quotas, and unsafe window cutoffs calibrated for manual outdoor occupations under acute thermal stress.
          </p>
        </div>

        {/* Worker Risk Level Flag */}
        <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4 text-left sm:text-right w-full sm:w-auto shrink-0">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876]">
            Occupational Risk Level
          </div>
          <div className="font-mono text-xl font-medium uppercase text-[#854d0e] mt-0.5">
            {guidance.occupational_risk_level} Risk
          </div>
          <div className="font-mono text-[10.5px] text-[#7a7876] mt-0.5">
            WBGT: <strong className="text-[#222222]">{guidance.current_wbgt}°C</strong> (Adjusted)
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
              className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition-all duration-150 ${
                isSelected
                  ? 'border-2 border-[#222222] bg-white text-[#222222]'
                  : 'border-[#222222]/8 bg-white/70 text-[#7a7876] hover:bg-white hover:text-[#222222]'
              }`}
            >
              <Icon className={`h-5 w-5 ${isSelected ? 'text-[#222222]' : 'text-[#7a7876]'}`} />
              <span className="mt-2 text-xs font-medium truncate max-w-full">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Safety Directive Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <Clock className="h-3.5 w-3.5 text-[#222222]" />
            Safe Working Window
          </div>
          <div className="mt-2 text-sm font-medium text-[#222222] leading-tight">
            {guidance.safe_working_window}
          </div>
          <span className="mt-1 block text-xs text-[#7a7876]">Avoid midday direct solar noon</span>
        </div>

        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <Flame className="h-3.5 w-3.5 text-[#ffb760]" />
            Mandatory Rest Cycle
          </div>
          <div className="mt-2 text-sm font-medium text-[#854d0e] leading-tight">
            {guidance.mandatory_rest_interval}
          </div>
          <span className="mt-1 block text-xs text-[#7a7876]">In shaded, ventilated shelter</span>
        </div>

        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <Droplets className="h-3.5 w-3.5 text-[#c094e4]" />
            Hourly Hydration Quota
          </div>
          <div className="mt-2 font-mono text-2xl font-normal text-[#222222]">
            {guidance.hydration_requirement_liters_per_hour} L/hr
          </div>
          <span className="mt-1 block text-xs text-[#7a7876]">Drink small sips every 15-20 min</span>
        </div>

        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <AlertTriangle className="h-3.5 w-3.5 text-[#831843]" />
            Max Continuous Exposure
          </div>
          <div className="mt-2 font-mono text-2xl font-normal text-[#831843]">
            {guidance.max_continuous_exposure_minutes} mins
          </div>
          <span className="mt-1 block text-xs text-[#7a7876]">Before mandatory deep rest</span>
        </div>
      </div>

      {/* Grid: Protective Worksite Controls vs Critical Medical Signs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Worksite Measures */}
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-6">
          <div className="flex items-center gap-2 border-b border-[#222222]/8 pb-3.5">
            <CheckCircle2 className="h-4 w-4 text-[#1b4332]" />
            <h3 className="font-medium text-[#222222] tracking-[-0.025em]">
              Worksite Controls for {selectedCategory}
            </h3>
          </div>

          <div className="mt-4 space-y-2.5">
            {guidance.protective_measures.map((measure, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-2xl border border-[#222222]/6 bg-[#daf7ee]/30 p-3.5 text-xs text-[#1b4332]"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#daf7ee] font-mono text-[10px] font-medium text-[#1b4332]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{measure}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Signs */}
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-6">
          <div className="flex items-center gap-2 border-b border-[#222222]/8 pb-3.5">
            <AlertTriangle className="h-4 w-4 text-[#831843]" />
            <h3 className="font-medium text-[#222222] tracking-[-0.025em]">
              Critical Signs Requiring Immediate Stoppage
            </h3>
          </div>

          <div className="mt-4 space-y-2.5">
            {guidance.warning_signs_to_halt_work.map((sign, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-2xl border border-[#222222]/6 bg-[#fce0ee]/40 p-3.5 text-xs text-[#831843]"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fce0ee] font-mono text-[10px] font-medium text-[#831843]">
                  !
                </span>
                <span className="leading-relaxed">{sign}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3.5 text-xs text-[#7a7876]">
            <strong className="text-[#222222] font-medium">Emergency Protocol:</strong> If a worker becomes disoriented, hot to touch, or collapses, move them to shaded shelter immediately, apply ice or cold water soaked cloth to armpits and neck, and dial <strong className="text-[#222222]">108</strong> without delay.
          </div>
        </div>
      </div>
    </div>
  );
}
