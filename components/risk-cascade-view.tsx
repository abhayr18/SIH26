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
      card: 'border border-black bg-white shadow-none',
      badge: 'border border-black bg-black text-white',
      icon: 'text-white bg-black border border-black',
      value: 'text-[#000000]',
      subMetricBg: 'bg-[#eeeeee] border border-[#d9d9d9]',
    },
    warning: {
      card: 'border border-[#d9d9d9] bg-white shadow-none',
      badge: 'border border-[#d9d9d9] bg-[#eeeeee] text-[#000000]',
      icon: 'text-black bg-[#eeeeee] border border-[#d9d9d9]',
      value: 'text-[#000000]',
      subMetricBg: 'bg-[#eeeeee] border border-[#d9d9d9]',
    },
    watch: {
      card: 'border border-[#d9d9d9] bg-white shadow-none',
      badge: 'border border-[#d9d9d9] bg-[#eeeeee] text-[#000000]',
      icon: 'text-black bg-[#eeeeee] border border-[#d9d9d9]',
      value: 'text-[#000000]',
      subMetricBg: 'bg-[#eeeeee] border border-[#d9d9d9]',
    },
    normal: {
      card: 'border border-[#d9d9d9] bg-white shadow-none',
      badge: 'border border-[#d9d9d9] bg-[#eeeeee] text-[#000000]',
      icon: 'text-black bg-[#eeeeee] border border-[#d9d9d9]',
      value: 'text-[#000000]',
      subMetricBg: 'bg-[#eeeeee] border border-[#d9d9d9]',
    },
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner — DICE Monochromatic Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#d9d9d9] bg-white p-6 sm:p-7 shadow-none">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <Activity className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold uppercase tracking-[0.06em] text-[#000000]">
              Heat Risk Cascade Architecture
            </h2>
            <span className="rounded-full border border-black bg-black px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white font-bold">
              Causal Propagation Model
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#595959] leading-relaxed tracking-[0.06em]">
            Visualizing the domino chain from <span className="text-[#000000] font-bold">Atmospheric Weather</span> down to <span className="text-[#000000] font-bold">Hospital Surge & Action Protocols</span> in {locationName}.
          </p>
        </div>

        <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] px-4 py-2.5 text-right shrink-0">
          <span className="text-[9.5px] uppercase tracking-[0.06em] text-[#595959] block font-mono font-bold">
            Cascading Status
          </span>
          <div className="text-sm font-mono font-bold uppercase tracking-[0.06em] text-[#000000] mt-0.5">
            {cascade.overall_alert} Level Active
          </div>
        </div>
      </div>

      {/* Executive Takeaway */}
      <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-[#000000] font-mono">
          <Info className="h-4 w-4 text-black shrink-0" />
          Cascade Synthesis for Disaster Evaluators
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#000000] font-normal tracking-[0.06em]">
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
              <div className={`rounded-lg p-5 sm:p-6 transition ${styles.card}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${styles.icon}`}>
                      <Icon className="h-5 w-5 stroke-[2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10.5px] font-bold text-[#595959] uppercase tracking-[0.06em]">
                          STAGE {stage.stage_number}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.06em] font-bold ${styles.badge}`}>
                          {stage.badge}
                        </span>
                      </div>
                      <h3 className="mt-1 text-base font-bold uppercase tracking-[0.06em] text-[#000000]">
                        {stage.stage_name}
                      </h3>
                      <p className="mt-1 text-xs text-[#595959] leading-relaxed max-w-2xl tracking-[0.06em]">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[9.5px] uppercase tracking-[0.06em] text-[#595959] block font-mono font-bold">
                      Primary Outcome
                    </span>
                    <div className={`font-mono text-lg font-bold mt-0.5 ${styles.value}`}>
                      {stage.value_display}
                    </div>
                  </div>
                </div>

                {/* Sub-Metrics Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#d9d9d9] pt-3.5 sm:grid-cols-4">
                  {Object.entries(stage.metrics).map(([key, val]) => (
                    <div key={key} className={`rounded-md px-3 py-2 ${styles.subMetricBg}`}>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[#595959]">{key}</div>
                      <div className="mt-0.5 font-mono text-xs font-bold text-[#000000]">
                        {String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Down Arrow */}
              {idx < cascade.stages.length - 1 && (
                <div className="flex justify-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#000000] bg-white text-black shadow-none">
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
