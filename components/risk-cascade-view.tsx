'use client';

import React from 'react';
import {
  ArrowDown,
  CloudRain,
  Activity,
  Users,
  AlertTriangle,
  Building2,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { buildHeatRiskCascade, HeatRiskCascade, CascadeStage } from '@/lib/cascade-engine';
import { calculateThermalMetrics } from '@/lib/thermal-engine';

interface RiskCascadeViewProps {
  locationName: string;
  currentTemp: number;
  currentHumidity: number;
  currentWind?: number;
  currentSolar?: number;
}

export function RiskCascadeView({
  locationName,
  currentTemp,
  currentHumidity,
  currentWind = 12,
  currentSolar = 650,
}: RiskCascadeViewProps) {
  const thermal = calculateThermalMetrics(currentTemp, currentHumidity, currentWind, currentSolar);
  const cascade: HeatRiskCascade = buildHeatRiskCascade(locationName, thermal);

  const stageIcons = [
    CloudRain,     // Meteorological
    Activity,      // Thermal stress
    Users,         // Population exposure
    AlertTriangle, // Health risk
    Building2,     // Hospital load
    ShieldCheck,   // Response action
  ];

  const stageStatusStyles = {
    critical: {
      card: 'border border-[#ff5065]/20 bg-white shadow-[0_5px_25px_rgba(38,42,62,0.06)]',
      badge: 'border border-[#ff5065]/30 bg-[#ffe9eb] text-[#ff5065]',
      icon: 'text-[#ff5065] bg-[#ffe9eb] border border-[#ff5065]/20',
      value: 'text-[#ff5065]',
      subMetricBg: 'bg-[#ffe9eb]/40 border border-[#ff5065]/15',
    },
    warning: {
      card: 'border border-[#ff7a59]/20 bg-white shadow-[0_5px_25px_rgba(38,42,62,0.06)]',
      badge: 'border border-[#ff7a59]/30 bg-[#ff7a59]/10 text-[#ff7a59]',
      icon: 'text-[#ff7a59] bg-[#ff7a59]/10 border border-[#ff7a59]/20',
      value: 'text-[#ff7a59]',
      subMetricBg: 'bg-[#ff7a59]/5 border border-[#ff7a59]/15',
    },
    watch: {
      card: 'border border-[#0e0f10]/6 bg-white shadow-[0_5px_25px_rgba(38,42,62,0.06)]',
      badge: 'border border-[#0e0f10]/10 bg-[#f4f4f8] text-[#0e0f10]',
      icon: 'text-[#0e0f10] bg-[#f4f4f8] border border-[#0e0f10]/10',
      value: 'text-[#0e0f10]',
      subMetricBg: 'bg-[#f4f4f8] border border-[#0e0f10]/6',
    },
    normal: {
      card: 'border border-[#0e0f10]/6 bg-white shadow-[0_5px_25px_rgba(38,42,62,0.06)]',
      badge: 'border border-[#0e0f10]/10 bg-[#f4f4f8] text-[#0e0f10]',
      icon: 'text-[#0e0f10] bg-[#f4f4f8] border border-[#0e0f10]/10',
      value: 'text-[#0e0f10]',
      subMetricBg: 'bg-[#f4f4f8] border border-[#0e0f10]/6',
    },
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner — Contrast Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#0e0f10]/6 bg-white p-6 sm:p-7 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffe9eb] text-[#ff5065] border border-[#ff5065]/20">
              <Activity className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0e0f10]">
              Heat Risk Cascade Architecture
            </h2>
            <span className="rounded-full border border-[#ff5065]/20 bg-[#ffe9eb] px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#ff5065] font-semibold">
              Causal Propagation Model
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Visualizing the domino chain from <span className="text-[#0e0f10] font-semibold">Atmospheric Weather</span> down to <span className="text-[#0e0f10] font-semibold">Hospital Surge & Action Protocols</span> in {locationName}.
          </p>
        </div>

        <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] px-4 py-2.5 text-right shrink-0">
          <span className="text-[9.5px] uppercase tracking-wider text-[#666666] block font-mono font-medium">
            Cascading Status
          </span>
          <div className="text-sm font-mono font-bold uppercase text-[#ff5065] mt-0.5">
            {cascade.overall_alert} Level Active
          </div>
        </div>
      </div>

      {/* Executive Takeaway */}
      <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff5065] font-mono">
          <Info className="h-4 w-4 text-[#ff5065] shrink-0" />
          Cascade Synthesis for Disaster Evaluators
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#0e0f10] font-normal">
          {cascade.executive_takeaway}
        </p>
      </div>

      {/* Vertical Flow of Stages */}
      <div className="space-y-4">
        {cascade.stages.map((stage: CascadeStage, idx: number) => {
          const Icon = stageIcons[idx] || Activity;
          const styles = stageStatusStyles[stage.status];

          return (
            <React.Fragment key={stage.stage_number}>
              <div className={`rounded-3xl p-5 sm:p-6 transition ${styles.card}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${styles.icon}`}>
                      <Icon className="h-5 w-5 stroke-[2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10.5px] font-semibold text-[#666666] uppercase tracking-wider">
                          STAGE {stage.stage_number}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider font-semibold ${styles.badge}`}>
                          {stage.badge}
                        </span>
                      </div>
                      <h3 className="mt-1 text-base font-bold text-[#0e0f10] tracking-tight">
                        {stage.stage_name}
                      </h3>
                      <p className="mt-1 text-xs text-[#666666] leading-relaxed max-w-2xl">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[9.5px] uppercase tracking-wider text-[#666666] block font-mono font-medium">
                      Primary Outcome
                    </span>
                    <div className={`font-mono text-lg font-bold mt-0.5 ${styles.value}`}>
                      {stage.value_display}
                    </div>
                  </div>
                </div>

                {/* Sub-Metrics Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#0e0f10]/6 pt-3.5 sm:grid-cols-4">
                  {Object.entries(stage.metrics).map(([key, val]) => (
                    <div key={key} className={`rounded-2xl px-3 py-2 ${styles.subMetricBg}`}>
                      <div className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666]">{key}</div>
                      <div className="mt-0.5 font-mono text-xs font-bold text-[#0e0f10]">
                        {String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Down Arrow */}
              {idx < cascade.stages.length - 1 && (
                <div className="flex justify-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#0e0f10]/10 bg-white text-[#ff5065] shadow-sm">
                    <ArrowDown className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
