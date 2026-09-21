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
    Normal: 'rounded-full border border-[#222222]/8 bg-[#daf7ee] text-[#1b4332] font-mono text-[9px] uppercase tracking-[0.025em] px-2 py-0.5',
    Watch: 'rounded-full border border-[#222222]/8 bg-[#ffe9cf] text-[#854d0e] font-mono text-[9px] uppercase tracking-[0.025em] px-2 py-0.5',
    Warning: 'rounded-full border border-[#222222]/8 bg-[#fce0ee] text-[#831843] font-mono text-[9px] uppercase tracking-[0.025em] px-2 py-0.5',
    Extreme: 'rounded-full border border-[#222222]/8 bg-[#fdebf7] text-[#574853] font-mono text-[9px] uppercase tracking-[0.025em] px-2 py-0.5',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner — Hume AI Scientific Instrument Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#222222]/8 bg-white p-6 sm:p-7">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fdebf7] text-[#574853] border border-[#222222]/8">
              <Clock className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-medium tracking-[-0.025em] text-[#222222]">
              Heat Risk Digital Twin: {currentCity}
            </h2>
            <span className="rounded-full border border-[#222222]/8 bg-[#fff9f3] px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
              120h Evolution Model
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#7a7876] leading-relaxed">
            Simulating biometeorological conditions across a 120-hour forecast trajectory for <span className="text-[#222222] font-medium">{wardName}</span>. Early warning lead-time enables preventative deployment before peak distress occurs.
          </p>
        </div>

        {/* Lead-Time Metric Badge */}
        <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4 text-left sm:text-right w-full sm:w-auto shrink-0">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876]">
            Early Warning Lead-Time
          </div>
          <div className="font-mono text-2xl font-medium text-[#222222] mt-0.5">
            T-{twin.lead_time_hours_to_peak}h
          </div>
          <div className="font-mono text-[10.5px] text-[#7a7876] mt-0.5">
            Peak: {twin.peak_horizon_label} (HTSS <strong className="text-[#222222]">{twin.peak_htss}</strong>/100)
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
                  ? 'border-2 border-[#222222] bg-[#fff9f3]'
                  : 'border-[#222222]/8 bg-white hover:bg-[#fff9f3]'
              }`}
            >
              {isPeak && (
                <span className="absolute -top-2 right-2 rounded-full border border-[#222222]/8 bg-[#c094e4] px-2 py-0.5 font-mono text-[8.5px] font-medium uppercase text-white">
                  Peak
                </span>
              )}
              <span className="font-mono text-[10px] text-[#7a7876] uppercase tracking-[0.025em]">{step.relative_time}</span>
              <span className="mt-0.5 text-xs font-medium text-[#222222] truncate max-w-full">
                {step.horizon_label}
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-medium text-[#222222]">{step.temperature_c}°</span>
                <span className="text-xs text-[#7a7876]">{step.humidity_pct}%</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-[#c094e4]">
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
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between border-b border-[#222222]/8 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#222222]/8 bg-[#fff9f3] px-2.5 py-0.5 font-mono text-xs text-[#222222]">
                  {selectedStep.relative_time}
                </span>
                <h3 className="text-lg font-medium text-[#222222] tracking-[-0.025em]">{selectedStep.horizon_label}</h3>
                <span className={alertBadgeColor[selectedStep.alert_level]}>
                  {selectedStep.alert_level}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#7a7876]">
                Timestamp: {selectedStep.timestamp_ist} IST &middot; Key trigger: {selectedStep.key_event}
              </p>
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876]">Human Thermal Stress Score</span>
              <div className="font-mono text-3xl font-medium text-[#c094e4]">
                {selectedStep.htss_score}
                <span className="text-sm font-normal text-[#7a7876]">/100</span>
              </div>
            </div>
          </div>

          {/* Key Metric Blocks */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
                <Flame className="h-3.5 w-3.5 text-[#ffb760]" />
                Dry Bulb Temp
              </div>
              <div className="mt-1 font-mono text-xl font-medium text-[#222222]">
                {selectedStep.temperature_c}°C
              </div>
              <span className="text-[10px] text-[#7a7876]">Ambient Air</span>
            </div>

            <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
                <Droplets className="h-3.5 w-3.5 text-[#c094e4]" />
                Relative Humidity
              </div>
              <div className="mt-1 font-mono text-xl font-medium text-[#222222]">
                {selectedStep.humidity_pct}%
              </div>
              <span className="text-[10px] text-[#7a7876]">Moisture Content</span>
            </div>

            <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
                <Activity className="h-3.5 w-3.5 text-[#ffb760]" />
                WBGT (Outdoor)
              </div>
              <div className="mt-1 font-mono text-xl font-medium text-[#854d0e]">
                {selectedStep.wbgt_c}°C
              </div>
              <span className="text-[10px] text-[#7a7876]">Labor Threshold</span>
            </div>

            <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
                <Shield className="h-3.5 w-3.5 text-[#574853]" />
                UTCI Index
              </div>
              <div className="mt-1 font-mono text-xl font-medium text-[#574853]">
                {selectedStep.utci_c}°C
              </div>
              <span className="text-[10px] text-[#7a7876]">Biometeorology</span>
            </div>
          </div>

          {/* Action Checklist for this specific horizon */}
          <div className="mt-6 rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4">
            <h4 className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.025em] text-[#574853]">
              <Sparkles className="h-3.5 w-3.5 text-[#c094e4]" />
              Horizon Preparedness Directive
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#222222]">
              {selectedStep.recommended_escalation}
            </p>
          </div>
        </div>

        {/* Narrative & Digital Twin Summary */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#222222]/8 bg-white p-6 lg:col-span-4">
          <div>
            <h3 className="font-medium text-[#222222] tracking-[-0.025em]">Digital Twin Intelligence</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#7a7876]">
              {twin.evolution_summary}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4">
            <div className="font-mono text-[10px] font-medium uppercase tracking-[0.025em] text-[#7a7876]">
              Why Track Evolution?
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#222222]">
              Heatwaves are not single-hour events. Continuous physiological strain accumulates across consecutive hot days and warm nights. The digital twin prevents premature de-escalation while nocturnal thermal loads remain elevated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
