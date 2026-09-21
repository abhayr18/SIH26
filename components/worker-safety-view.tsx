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
      {/* Top Banner — DICE Monochromatic Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#d9d9d9] bg-white p-6 sm:p-7 shadow-none">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <HardHat className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold uppercase tracking-[0.06em] text-[#000000]">
              Occupational Outdoor Worker Safety: {currentCity}
            </h2>
            <span className="rounded-full border border-black bg-black px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white font-bold">
              ISO 7243 & NIOSH Standards
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#595959] leading-relaxed tracking-[0.06em]">
            Biometeorological work-rest regimens, hydration quotas, and unsafe window cutoffs calibrated for manual outdoor occupations under acute thermal stress.
          </p>
        </div>

        {/* Worker Risk Level Flag */}
        <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4 text-left sm:text-right w-full sm:w-auto shrink-0">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[#595959] font-bold">
            Occupational Risk Level
          </div>
          <div className="font-mono text-xl font-bold uppercase text-[#000000] mt-0.5">
            {guidance.occupational_risk_level} Risk
          </div>
          <div className="font-mono text-[10.5px] text-[#595959] mt-0.5">
            WBGT: <strong className="text-[#000000] font-bold">{guidance.current_wbgt}°C</strong> (Adjusted)
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
              className={`flex flex-col items-center justify-center rounded-lg border p-3.5 text-center transition-all duration-150 ${
                isSelected
                  ? 'border-2 border-black bg-[#eeeeee] text-[#000000] font-bold shadow-none'
                  : 'border-[#d9d9d9] bg-white text-[#595959] hover:border-black hover:text-[#000000]'
              }`}
            >
              <Icon className={`h-5 w-5 ${isSelected ? 'text-black' : 'text-[#808080]'}`} />
              <span className="mt-2 text-xs font-bold uppercase tracking-[0.06em] truncate max-w-full">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Safety Directive Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <Clock className="h-3.5 w-3.5 text-[#000000]" />
            Safe Working Window
          </div>
          <div className="mt-2 text-sm font-bold uppercase tracking-[0.06em] text-[#000000] leading-tight">
            {guidance.safe_working_window}
          </div>
          <span className="mt-1 block text-xs text-[#595959] tracking-[0.06em]">Avoid midday direct solar noon</span>
        </div>

        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <Flame className="h-3.5 w-3.5 text-[#000000]" />
            Mandatory Rest Cycle
          </div>
          <div className="mt-2 text-sm font-bold uppercase tracking-[0.06em] text-[#000000] leading-tight">
            {guidance.mandatory_rest_interval}
          </div>
          <span className="mt-1 block text-xs text-[#595959] tracking-[0.06em]">In shaded, ventilated shelter</span>
        </div>

        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <Droplets className="h-3.5 w-3.5 text-[#000000]" />
            Hourly Hydration Quota
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#000000]">
            {guidance.hydration_requirement_liters_per_hour} L/hr
          </div>
          <span className="mt-1 block text-xs text-[#595959] tracking-[0.06em]">Drink small sips every 15-20 min</span>
        </div>

        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <AlertTriangle className="h-3.5 w-3.5 text-[#000000]" />
            Max Continuous Exposure
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#000000]">
            {guidance.max_continuous_exposure_minutes} mins
          </div>
          <span className="mt-1 block text-xs text-[#595959] tracking-[0.06em]">Before mandatory deep rest</span>
        </div>
      </div>

      {/* Grid: Protective Worksite Controls vs Critical Medical Signs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Worksite Measures */}
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none">
          <div className="flex items-center gap-2 border-b border-[#d9d9d9] pb-3.5">
            <CheckCircle2 className="h-4 w-4 text-black" />
            <h3 className="font-bold text-[#000000] uppercase tracking-[0.06em]">
              Worksite Controls for {selectedCategory}
            </h3>
          </div>

          <div className="mt-4 space-y-2.5">
            {guidance.protective_measures.map((measure, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3.5 text-xs text-[#000000] tracking-[0.06em]"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black font-mono text-[10px] font-bold text-white">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{measure}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Signs */}
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none">
          <div className="flex items-center gap-2 border-b border-[#d9d9d9] pb-3.5">
            <AlertTriangle className="h-4 w-4 text-black" />
            <h3 className="font-bold text-[#000000] uppercase tracking-[0.06em]">
              Critical Signs Requiring Immediate Stoppage
            </h3>
          </div>

          <div className="mt-4 space-y-2.5">
            {guidance.warning_signs_to_halt_work.map((sign, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-[#000000] bg-[#eeeeee] p-3.5 text-xs text-[#000000] font-bold tracking-[0.06em]"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black font-mono text-[10px] font-bold text-white">
                  !
                </span>
                <span className="leading-relaxed">{sign}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[#d9d9d9] bg-white p-3.5 text-xs text-[#595959] tracking-[0.06em]">
            <strong className="text-[#000000] font-bold">Emergency Protocol:</strong> If a worker becomes disoriented, hot to touch, or collapses, move them to shaded shelter immediately, apply ice or cold water soaked cloth to armpits and neck, and dial <strong className="text-black font-bold">108</strong> without delay.
          </div>
        </div>
      </div>
    </div>
  );
}
