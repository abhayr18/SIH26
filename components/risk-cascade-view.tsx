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
      card: 'border-red-200 bg-white shadow-2xs',
      badge: 'border border-red-200 bg-red-50 text-red-700',
      icon: 'text-red-600 bg-red-50 border border-red-200',
      value: 'text-red-700',
      subMetricBg: 'bg-red-50/40 border border-red-100/80',
    },
    warning: {
      card: 'border-orange-200 bg-white shadow-2xs',
      badge: 'border border-orange-200 bg-orange-50 text-orange-800',
      icon: 'text-orange-600 bg-orange-50 border border-orange-200',
      value: 'text-orange-800',
      subMetricBg: 'bg-orange-50/40 border border-orange-100/80',
    },
    watch: {
      card: 'border-amber-200 bg-white shadow-2xs',
      badge: 'border border-amber-200 bg-amber-50 text-amber-800',
      icon: 'text-amber-600 bg-amber-50 border border-amber-200',
      value: 'text-amber-800',
      subMetricBg: 'bg-amber-50/40 border border-amber-100/80',
    },
    normal: {
      card: 'border-emerald-200 bg-white shadow-2xs',
      badge: 'border border-emerald-200 bg-emerald-50 text-emerald-800',
      icon: 'text-emerald-600 bg-emerald-50 border border-emerald-200',
      value: 'text-emerald-700',
      subMetricBg: 'bg-emerald-50/40 border border-emerald-100/80',
    },
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <Activity className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Heat Risk Cascade Architecture
            </h2>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              Causal Propagation Model
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-3xl">
            Visualizing the complete domino chain from <strong className="text-slate-800 font-semibold">Atmospheric Weather</strong> down to <strong className="text-slate-800 font-semibold">Hospital Surge & Action Protocols</strong> in {locationName}.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-right shadow-2xs shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
            Cascading Status
          </span>
          <div className="text-sm font-black uppercase text-amber-700 mt-0.5">
            {cascade.overall_alert} Level Active
          </div>
        </div>
      </div>

      {/* Executive Takeaway */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800 font-mono">
          <Info className="h-4 w-4 text-blue-600 shrink-0" />
          Cascade Synthesis for Disaster Evaluators
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 font-medium">
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
              <div className={`rounded-2xl border p-5 sm:p-6 transition ${styles.card}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          STAGE {stage.stage_number}
                        </span>
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${styles.badge}`}>
                          {stage.badge}
                        </span>
                      </div>
                      <h3 className="mt-1 text-base font-bold text-slate-900">
                        {stage.stage_name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-2xl">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                      Primary Outcome
                    </span>
                    <div className={`font-mono text-lg font-black mt-0.5 ${styles.value}`}>
                      {stage.value_display}
                    </div>
                  </div>
                </div>

                {/* Sub-Metrics Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3.5 sm:grid-cols-4">
                  {Object.entries(stage.metrics).map(([key, val]) => (
                    <div key={key} className={`rounded-xl px-3 py-2 ${styles.subMetricBg}`}>
                      <div className="text-[10px] text-slate-500 font-medium">{key}</div>
                      <div className="mt-0.5 font-mono text-xs font-bold text-slate-800">
                        {String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Down Arrow */}
              {idx < cascade.stages.length - 1 && (
                <div className="flex justify-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-2xs">
                    <ArrowDown className="h-3.5 w-3.5 text-slate-400" />
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
