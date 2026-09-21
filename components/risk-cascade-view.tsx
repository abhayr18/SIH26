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
      card: 'border border-[#222222]/8 bg-white',
      badge: 'border border-[#222222]/8 bg-[#fce0ee] text-[#831843]',
      icon: 'text-[#831843] bg-[#fce0ee] border border-[#222222]/8',
      value: 'text-[#831843]',
      subMetricBg: 'bg-[#fce0ee]/30 border border-[#222222]/6',
    },
    warning: {
      card: 'border border-[#222222]/8 bg-white',
      badge: 'border border-[#222222]/8 bg-[#ffe9cf] text-[#854d0e]',
      icon: 'text-[#854d0e] bg-[#ffe9cf] border border-[#222222]/8',
      value: 'text-[#854d0e]',
      subMetricBg: 'bg-[#ffe9cf]/30 border border-[#222222]/6',
    },
    watch: {
      card: 'border border-[#222222]/8 bg-white',
      badge: 'border border-[#222222]/8 bg-[#fdebf7] text-[#574853]',
      icon: 'text-[#574853] bg-[#fdebf7] border border-[#222222]/8',
      value: 'text-[#574853]',
      subMetricBg: 'bg-[#fff9f3] border border-[#222222]/6',
    },
    normal: {
      card: 'border border-[#222222]/8 bg-white',
      badge: 'border border-[#222222]/8 bg-[#daf7ee] text-[#1b4332]',
      icon: 'text-[#1b4332] bg-[#daf7ee] border border-[#222222]/8',
      value: 'text-[#1b4332]',
      subMetricBg: 'bg-[#daf7ee]/30 border border-[#222222]/6',
    },
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner — Hume AI Scientific Instrument Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#222222]/8 bg-white p-6 sm:p-7">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fdebf7] text-[#574853] border border-[#222222]/8">
              <Activity className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-medium tracking-[-0.025em] text-[#222222]">
              Heat Risk Cascade Architecture
            </h2>
            <span className="rounded-full border border-[#222222]/8 bg-[#fff9f3] px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
              Causal Propagation Model
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#7a7876] leading-relaxed">
            Visualizing the domino chain from <span className="text-[#222222] font-medium">Atmospheric Weather</span> down to <span className="text-[#222222] font-medium">Hospital Surge & Action Protocols</span> in {locationName}.
          </p>
        </div>

        <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] px-4 py-2.5 text-right shrink-0">
          <span className="text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876] block font-mono">
            Cascading Status
          </span>
          <div className="text-sm font-mono font-medium uppercase text-[#854d0e] mt-0.5">
            {cascade.overall_alert} Level Active
          </div>
        </div>
      </div>

      {/* Executive Takeaway */}
      <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.025em] text-[#574853] font-mono">
          <Info className="h-4 w-4 text-[#c094e4] shrink-0" />
          Cascade Synthesis for Disaster Evaluators
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#222222] font-normal">
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
              <div className={`rounded-2xl p-5 sm:p-6 transition ${styles.card}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${styles.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10.5px] font-medium text-[#7a7876] uppercase tracking-[0.025em]">
                          STAGE {stage.stage_number}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.025em] ${styles.badge}`}>
                          {stage.badge}
                        </span>
                      </div>
                      <h3 className="mt-1 text-base font-medium text-[#222222] tracking-[-0.025em]">
                        {stage.stage_name}
                      </h3>
                      <p className="mt-1 text-xs text-[#7a7876] leading-relaxed max-w-2xl">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876] block font-mono">
                      Primary Outcome
                    </span>
                    <div className={`font-mono text-lg font-medium mt-0.5 ${styles.value}`}>
                      {stage.value_display}
                    </div>
                  </div>
                </div>

                {/* Sub-Metrics Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#222222]/8 pt-3.5 sm:grid-cols-4">
                  {Object.entries(stage.metrics).map(([key, val]) => (
                    <div key={key} className={`rounded-xl px-3 py-2 ${styles.subMetricBg}`}>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876]">{key}</div>
                      <div className="mt-0.5 font-mono text-xs font-medium text-[#222222]">
                        {String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Down Arrow */}
              {idx < cascade.stages.length - 1 && (
                <div className="flex justify-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#222222]/8 bg-white text-[#7a7876]">
                    <ArrowDown className="h-3.5 w-3.5" />
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
