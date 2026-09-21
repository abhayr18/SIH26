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
      card: 'border-rose-200/80 bg-white shadow-xs',
      badge: 'border-rose-200 bg-rose-50 text-rose-700',
      icon: 'text-rose-600 bg-rose-50 border border-rose-200',
      value: 'text-rose-700 font-bold',
      subMetricBg: 'bg-slate-50 border border-slate-200/70',
    },
    warning: {
      card: 'border-amber-200/80 bg-white shadow-xs',
      badge: 'border-amber-200 bg-amber-50 text-amber-700',
      icon: 'text-amber-600 bg-amber-50 border border-amber-200',
      value: 'text-amber-700 font-bold',
      subMetricBg: 'bg-slate-50 border border-slate-200/70',
    },
    watch: {
      card: 'border-blue-200/80 bg-white shadow-xs',
      badge: 'border-blue-200 bg-blue-50 text-blue-700',
      icon: 'text-blue-600 bg-blue-50 border border-blue-200',
      value: 'text-blue-700 font-bold',
      subMetricBg: 'bg-slate-50 border border-slate-200/70',
    },
    normal: {
      card: 'border-emerald-200/80 bg-white shadow-xs',
      badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      icon: 'text-emerald-600 bg-emerald-50 border border-emerald-200',
      value: 'text-emerald-700 font-bold',
      subMetricBg: 'bg-slate-50 border border-slate-200/70',
    },
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner — Copernicus Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Activity className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Heat Risk Cascade Architecture
            </h2>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 font-mono text-[11px] uppercase tracking-wider text-blue-700 font-bold">
              Causal Propagation Model
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Visualizing the domino chain from <span className="text-slate-900 font-semibold">Atmospheric Weather</span> down to <span className="text-slate-900 font-semibold">Hospital Surge & Action Protocols</span> in {locationName}.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-right shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-mono font-medium">
            Cascading Status
          </span>
          <div className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 mt-0.5">
            {cascade.overall_alert} Level Active
          </div>
        </div>
      </div>

      {/* Executive Takeaway */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
          <Info className="h-4 w-4 text-blue-600 shrink-0" />
          Cascade Synthesis for Disaster Evaluators
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700">
          {cascade.executive_takeaway}
        </p>
      </div>

      {/* Vertical Flow of Stages */}
      <div className="space-y-4">
        {cascade.stages.map((stage: CascadeStage, idx: number) => {
          const Icon = stageIcons[idx] || Activity;
          const styles = stageStatusStyles[stage.status] || stageStatusStyles.normal;

          return (
            <React.Fragment key={stage.stage_number}>
              <div className={`rounded-xl border p-5 sm:p-6 transition-all ${styles.card}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-2xs ${styles.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          STAGE {stage.stage_number}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider font-semibold border ${styles.badge}`}>
                          {stage.badge}
                        </span>
                      </div>
                      <h3 className="mt-1 text-base font-bold tracking-tight text-slate-900">
                        {stage.stage_name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-2xl">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-mono font-medium">
                      Primary Outcome
                    </span>
                    <div className={`font-mono text-lg mt-0.5 ${styles.value}`}>
                      {stage.value_display}
                    </div>
                  </div>
                </div>

                {/* Sub-Metrics Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3.5 sm:grid-cols-4">
                  {Object.entries(stage.metrics).map(([key, val]) => (
                    <div key={key} className={`rounded-lg p-2.5 ${styles.subMetricBg}`}>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-slate-500">{key}</div>
                      <div className="mt-0.5 font-mono text-xs font-bold text-slate-900">
                        {String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Down Arrow */}
              {idx < cascade.stages.length - 1 && (
                <div className="flex justify-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-2xs">
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
