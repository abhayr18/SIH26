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

  const alertBadgeColor = {
    Normal: 'rounded-full border border-[#0e0f10]/10 bg-[#f4f4f8] text-[#0e0f10] font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 font-semibold',
    Watch: 'rounded-full border border-[#ff7a59]/30 bg-[#ff7a59]/10 text-[#ff7a59] font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 font-semibold',
    Warning: 'rounded-full border border-[#ff5c35]/30 bg-[#ff5c35]/15 text-[#ff5c35] font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 font-semibold',
    Extreme: 'rounded-full border border-[#ff5065]/30 bg-[#ffe9eb] text-[#ff5065] font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 font-semibold',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner — Contrast Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#0e0f10]/6 bg-white p-6 sm:p-7 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffe9eb] text-[#ff5065] border border-[#ff5065]/20">
              <Clock className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0e0f10]">
              Heat Risk Digital Twin: {currentCity}
            </h2>
            <span className="rounded-full border border-[#ff5065]/20 bg-[#ffe9eb] px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#ff5065] font-semibold">
              120h Evolution Model
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Simulating biometeorological conditions across a 120-hour forecast trajectory for <span className="text-[#0e0f10] font-semibold">{wardName}</span>. Early warning lead-time enables preventative deployment before peak distress occurs.
          </p>
        </div>

        {/* Lead-Time Metric Badge */}
        <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4 text-left sm:text-right w-full sm:w-auto shrink-0">
          <div className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] font-medium">
            Early Warning Lead-Time
          </div>
          <div className="font-mono text-2xl font-bold text-[#ff5065] mt-0.5">
            T-{twin.lead_time_hours_to_peak}h
          </div>
          <div className="font-mono text-[10.5px] text-[#666666] mt-0.5">
            Peak: {twin.peak_horizon_label} (HTSS <strong className="text-[#0e0f10] font-bold">{twin.peak_htss}</strong>/100)
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
              className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-150 ${
                isSelected
                  ? 'border-2 border-[#ff5065] bg-[#ffe9eb]/40 shadow-sm'
                  : 'border-[#0e0f10]/6 bg-white hover:bg-[#f4f4f8] shadow-[0_5px_25px_rgba(38,42,62,0.04)]'
              }`}
            >
              {isPeak && (
                <span className="absolute -top-2 right-2 rounded-full bg-[#ff5065] px-2 py-0.5 font-mono text-[8.5px] font-bold uppercase text-white shadow-sm">
                  Peak
                </span>
              )}
              <span className="font-mono text-[10px] text-[#666666] uppercase tracking-wider font-semibold">{step.relative_time}</span>
              <span className="mt-0.5 text-xs font-bold text-[#0e0f10] truncate max-w-full">
                {step.horizon_label}
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-bold text-[#0e0f10]">{step.temperature_c}°</span>
                <span className="text-xs text-[#666666]">{step.humidity_pct}%</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#ff5065]">
                HTSS {step.htss_score}
              </div>
              <span className={`mt-2 inline-block ${alertBadgeColor[step.alert_level]}`}>
                {step.alert_level}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Step Detail Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Step Deep Dive */}
        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-6 shadow-[0_5px_25px_rgba(38,42,62,0.06)] lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between border-b border-[#0e0f10]/6 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#0e0f10]/6 bg-[#f4f4f8] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0e0f10]">
                  {selectedStep.relative_time}
                </span>
                <h3 className="text-lg font-bold text-[#0e0f10] tracking-tight">{selectedStep.horizon_label}</h3>
                <span className={alertBadgeColor[selectedStep.alert_level]}>
                  {selectedStep.alert_level}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#666666]">
                Timestamp: {selectedStep.timestamp_ist} IST &middot; Key trigger: {selectedStep.key_event}
              </p>
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] font-medium">Human Thermal Stress Score</span>
              <div className="font-mono text-3xl font-bold text-[#ff5065]">
                {selectedStep.htss_score}
                <span className="text-sm font-normal text-[#666666]">/100</span>
              </div>
            </div>
          </div>

          {/* Key Metric Blocks */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
                <Flame className="h-3.5 w-3.5 text-[#ff7a59]" />
                Dry Bulb Temp
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#0e0f10]">
                {selectedStep.temperature_c}°C
              </div>
              <span className="text-[10px] text-[#666666]">Ambient Air</span>
            </div>

            <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
                <Droplets className="h-3.5 w-3.5 text-[#ff5065]" />
                Relative Humidity
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#0e0f10]">
                {selectedStep.humidity_pct}%
              </div>
              <span className="text-[10px] text-[#666666]">Moisture Content</span>
            </div>

            <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
                <Activity className="h-3.5 w-3.5 text-[#ff7a59]" />
                WBGT (Outdoor)
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#ff7a59]">
                {selectedStep.wbgt_c}°C
              </div>
              <span className="text-[10px] text-[#666666]">Labor Threshold</span>
            </div>

            <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
                <Shield className="h-3.5 w-3.5 text-[#0e0f10]" />
                UTCI Index
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#0e0f10]">
                {selectedStep.utci_c}°C
              </div>
              <span className="text-[10px] text-[#666666]">Biometeorology</span>
            </div>
          </div>

          {/* Action Checklist for this specific horizon */}
          <div className="mt-6 rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4">
            <h4 className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#ff5065] font-bold">
              <Sparkles className="h-3.5 w-3.5 text-[#ff5065]" />
              Horizon Preparedness Directive
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#0e0f10]">
              {selectedStep.recommended_escalation}
            </p>
          </div>
        </div>

        {/* Narrative & Digital Twin Summary */}
        <div className="flex flex-col justify-between rounded-3xl border border-[#0e0f10]/6 bg-white p-6 shadow-[0_5px_25px_rgba(38,42,62,0.06)] lg:col-span-4">
          <div>
            <h3 className="font-bold text-[#0e0f10] tracking-tight">Digital Twin Intelligence</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#666666]">
              {twin.evolution_summary}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ff5065]">
              Why Track Evolution?
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#0e0f10]">
              Heatwaves are not single-hour events. Continuous physiological strain accumulates across consecutive hot days and warm nights. The digital twin prevents premature de-escalation while nocturnal thermal loads remain elevated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
