'use client';

import React, { useState } from 'react';
import {
  Clock,
  Flame,
  Droplets,
  Shield,
  Activity,
  Sparkles,
} from 'lucide-react';
import { buildHeatRiskDigitalTwin, CityDigitalTwin, DigitalTwinHorizonStep } from '@/lib/digital-twin';

interface DigitalTwinViewProps {
  currentCity: string;
  currentTemp: number;
  currentHumidity: number;
  currentPvs?: number;
  wardName?: string;
}

export function DigitalTwinView({
  currentCity,
  currentTemp,
  currentHumidity,
  currentPvs = 68,
  wardName = 'Shivajinagar (Ward 12)',
}: DigitalTwinViewProps) {
  const twin: CityDigitalTwin = buildHeatRiskDigitalTwin(
    currentCity,
    currentTemp,
    currentHumidity,
    currentPvs,
    wardName
  );

  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(twin.peak_step_index);
  const selectedStep: DigitalTwinHorizonStep = twin.steps[selectedStepIdx];

  const alertBadgeColor: Record<string, string> = {
    Normal: 'rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold',
    Watch: 'rounded-full border border-amber-200 bg-amber-50 text-amber-700 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold',
    Warning: 'rounded-full border border-orange-200 bg-orange-50 text-orange-700 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold',
    Extreme: 'rounded-full border border-rose-200 bg-rose-50 text-rose-700 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner — Copernicus Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Clock className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Heat Risk Digital Twin: {currentCity}
            </h2>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 font-mono text-[11px] uppercase tracking-wider text-blue-700 font-semibold">
              120h Evolution Model
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Simulating biometeorological conditions across a 120-hour forecast trajectory for <span className="text-slate-900 font-semibold">{wardName}</span>. Early warning lead-time enables preventative deployment before peak distress occurs.
          </p>
        </div>

        {/* Lead-Time Metric Badge — Deep Palantir Slate HUD */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 text-white p-4 text-left sm:text-right w-full sm:w-auto shrink-0 shadow-md">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            Early Warning Lead-Time
          </div>
          <div className="font-mono text-2xl font-bold text-cyan-400 mt-0.5">
            T-{twin.lead_time_hours_to_peak}h
          </div>
          <div className="font-mono text-[11px] text-slate-300 mt-0.5">
            Peak: {twin.peak_horizon_label} (HTSS <strong className="text-white font-bold">{twin.peak_htss}</strong>/100)
          </div>
        </div>
      </div>

      {/* Horizontal Horizon Timeline Stepper */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
        {twin.steps.map((step, idx) => {
          const isSelected = selectedStepIdx === idx;
          const isPeak = idx === twin.peak_step_index;

          return (
            <button
              key={step.relative_time}
              onClick={() => setSelectedStepIdx(idx)}
              className={`relative flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/20'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50 shadow-2xs hover:border-slate-300'
              }`}
            >
              {isPeak && (
                <span className="absolute -top-2 right-2 rounded-full bg-rose-600 border border-rose-500 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                  Peak
                </span>
              )}
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{step.relative_time}</span>
              <span className="mt-0.5 text-xs font-bold text-slate-900 truncate max-w-full">
                {step.horizon_label}
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-bold text-slate-900">{step.temperature_c}°</span>
                <span className="text-xs text-slate-500">{step.humidity_pct}%</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-700">
                HTSS {step.htss_score}
              </div>
              <span className={`mt-2 inline-block ${alertBadgeColor[step.alert_level] || alertBadgeColor.Normal}`}>
                {step.alert_level}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Step Detail Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Step Deep Dive */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-slate-900 bg-slate-900 px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                  {selectedStep.relative_time}
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{selectedStep.horizon_label}</h3>
                <span className={alertBadgeColor[selectedStep.alert_level] || alertBadgeColor.Normal}>
                  {selectedStep.alert_level}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Timestamp: {selectedStep.timestamp_ist} IST &middot; Key trigger: {selectedStep.key_event}
              </p>
            </div>

            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-medium">Human Thermal Stress Score</span>
              <div className="font-mono text-3xl font-bold text-slate-900">
                {selectedStep.htss_score}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </div>
            </div>
          </div>

          {/* Key Metric Blocks */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                <Flame className="h-3.5 w-3.5 text-rose-500" />
                Dry Bulb Temp
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900">
                {selectedStep.temperature_c}°C
              </div>
              <span className="text-[10px] text-slate-500">Ambient Air</span>
            </div>

            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                <Droplets className="h-3.5 w-3.5 text-blue-500" />
                Relative Humidity
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900">
                {selectedStep.humidity_pct}%
              </div>
              <span className="text-[10px] text-slate-500">Moisture Content</span>
            </div>

            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                <Activity className="h-3.5 w-3.5 text-amber-500" />
                WBGT (Outdoor)
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900">
                {selectedStep.wbgt_c}°C
              </div>
              <span className="text-[10px] text-slate-500">Labor Threshold</span>
            </div>

            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                <Shield className="h-3.5 w-3.5 text-teal-600" />
                UTCI Index
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900">
                {selectedStep.utci_c}°C
              </div>
              <span className="text-[10px] text-slate-500">Biometeorology</span>
            </div>
          </div>

          {/* Action Checklist for this specific horizon */}
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
            <h4 className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-blue-900 font-bold">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Horizon Preparedness Directive
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-700">
              {selectedStep.recommended_escalation}
            </p>
          </div>
        </div>

        {/* Narrative & Digital Twin Summary */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-4">
          <div>
            <h3 className="font-bold text-slate-900 tracking-tight text-sm">Digital Twin Intelligence</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              {twin.evolution_summary}
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-900">
              Why Track Evolution?
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Heatwaves are not single-hour events. Continuous physiological strain accumulates across consecutive hot days and warm nights. The digital twin prevents premature de-escalation while nocturnal thermal loads remain elevated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
