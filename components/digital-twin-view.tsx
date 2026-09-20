'use client';

import React, { useState } from 'react';
import {
  Clock,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Flame,
  Droplets,
  Wind,
  Shield,
  Activity,
  ArrowRight,
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

  const alertBadgeColor = {
    Normal: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    Watch: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    Warning: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
    Extreme: 'border-red-500/40 bg-red-500/10 text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-cyan-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Heat Risk Digital Twin: {currentCity}
            </h2>
            <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
              5-Day Evolution Model
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Simulating biometeorological conditions across a 120-hour forecast trajectory for <span className="font-semibold text-white">{wardName}</span>. Early warning lead-time enables preventative deployment before peak physiological distress occurs.
          </p>
        </div>

        {/* Lead-Time Metric Badge */}
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-right">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
            Early Warning Lead-Time
          </div>
          <div className="font-mono text-2xl font-black text-amber-400">
            T-{twin.lead_time_hours_to_peak}h
          </div>
          <div className="text-[10px] text-slate-300">
            Peak forecast: {twin.peak_horizon_label} (HTSS {twin.peak_htss}/100)
          </div>
        </div>
      </div>

      {/* Horizontal Horizon Timeline Stepper */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
        {twin.steps.map((step, idx) => {
          const isSelected = selectedStepIdx === idx;
          const isPeak = idx === twin.peak_step_index;

          return (
            <button
              key={step.relative_time}
              onClick={() => setSelectedStepIdx(idx)}
              className={`relative flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                isSelected
                  ? 'border-cyan-400 bg-slate-800 ring-2 ring-cyan-500/30'
                  : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {isPeak && (
                <span className="absolute -top-2 right-2 rounded-full border border-red-500 bg-red-600 px-1.5 py-0.2 text-[9px] font-black uppercase text-white shadow">
                  Peak
                </span>
              )}
              <span className="text-[10px] font-bold text-slate-400">{step.relative_time}</span>
              <span className="mt-0.5 text-xs font-bold text-white truncate max-w-full">
                {step.horizon_label}
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-lg font-black text-white">{step.temperature_c}°</span>
                <span className="text-[11px] text-slate-400">{step.humidity_pct}%</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-amber-400">HTSS {step.htss_score}</span>
              </div>
              <span className={`mt-2 inline-block rounded border px-1.5 py-0.2 text-[9px] font-bold uppercase ${alertBadgeColor[step.alert_level]}`}>
                {step.alert_level}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Step Detail Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Step Deep Dive */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300">
                  {selectedStep.relative_time}
                </span>
                <h3 className="text-lg font-bold text-white">{selectedStep.horizon_label}</h3>
                <span className={`rounded border px-2 py-0.5 text-xs font-bold uppercase ${alertBadgeColor[selectedStep.alert_level]}`}>
                  {selectedStep.alert_level}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Timestamp: {selectedStep.timestamp_ist} IST • Synoptic forcing: {selectedStep.key_event}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Human Thermal Stress Score</span>
              <div className="font-mono text-3xl font-black text-amber-400">
                {selectedStep.htss_score}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </div>
            </div>
          </div>

          {/* Key Metric Blocks */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Flame className="h-3.5 w-3.5 text-red-400" />
                Dry Bulb Temp
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-white">
                {selectedStep.temperature_c}°C
              </div>
              <span className="text-[10px] text-slate-400">Ambient Air</span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Droplets className="h-3.5 w-3.5 text-blue-400" />
                Relative Humidity
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-cyan-300">
                {selectedStep.humidity_pct}%
              </div>
              <span className="text-[10px] text-slate-400">Moisture Content</span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Activity className="h-3.5 w-3.5 text-amber-400" />
                WBGT (Outdoor)
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-amber-300">
                {selectedStep.wbgt_c}°C
              </div>
              <span className="text-[10px] text-slate-400">Labor Threshold</span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Shield className="h-3.5 w-3.5 text-purple-400" />
                UTCI Index
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-purple-300">
                {selectedStep.utci_c}°C
              </div>
              <span className="text-[10px] text-slate-400">Biometeorology</span>
            </div>
          </div>

          {/* Action Checklist for this specific horizon */}
          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-850/60 p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Sparkles className="h-4 w-4" />
              Horizon Preparedness Directive
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
              {selectedStep.recommended_escalation}
            </p>
          </div>
        </div>

        {/* Narrative & Digital Twin Summary */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl lg:col-span-4">
          <div>
            <h3 className="font-bold text-white">Digital Twin Intelligence</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {twin.evolution_summary}
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Why Track Evolution?
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              Heatwaves are not single-hour events. Continuous physiological strain accumulates across consecutive hot days and warm nights. The digital twin prevents premature de-escalation while nocturnal thermal loads remain elevated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
