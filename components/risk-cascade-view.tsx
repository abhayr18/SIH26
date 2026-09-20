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
      border: 'border-red-500/50 bg-red-950/20',
      badge: 'border-red-500/40 bg-red-500/10 text-red-400',
      icon: 'text-red-400 bg-red-500/10 border-red-500/30',
      value: 'text-red-400',
    },
    warning: {
      border: 'border-orange-500/50 bg-orange-950/20',
      badge: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
      icon: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      value: 'text-orange-300',
    },
    watch: {
      border: 'border-amber-500/50 bg-amber-950/20',
      badge: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      icon: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      value: 'text-amber-300',
    },
    normal: {
      border: 'border-emerald-500/50 bg-emerald-950/20',
      badge: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      value: 'text-emerald-400',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-rose-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Heat Risk Cascade Architecture
            </h2>
            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-300">
              Causal Propagation Model
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Visualizing the complete domino chain from <span className="font-semibold text-white">Atmospheric Weather</span> down to <span className="font-semibold text-white">Hospital Surge & Action Protocols</span> in {locationName}.
          </p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cascading Status</span>
          <div className="text-sm font-black uppercase text-amber-400">
            {cascade.overall_alert} Level Active
          </div>
        </div>
      </div>

      {/* Executive Takeaway */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <Info className="h-4 w-4" />
          Cascade Synthesis for Disaster Evaluators
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">
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
              <div className={`rounded-xl border p-5 shadow-md transition ${styles.border}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          STAGE {stage.stage_number}
                        </span>
                        <span className={`rounded border px-2 py-0.2 text-[10px] font-bold uppercase ${styles.badge}`}>
                          {stage.badge}
                        </span>
                      </div>
                      <h3 className="mt-0.5 text-base font-bold text-white">
                        {stage.stage_name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-300">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Primary Outcome
                    </span>
                    <div className={`font-mono text-base font-extrabold ${styles.value}`}>
                      {stage.value_display}
                    </div>
                  </div>
                </div>

                {/* Sub-Metrics Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-3 sm:grid-cols-4">
                  {Object.entries(stage.metrics).map(([key, val]) => (
                    <div key={key} className="rounded-lg bg-slate-950/50 px-3 py-2">
                      <div className="text-[10px] text-slate-400">{key}</div>
                      <div className="mt-0.5 font-mono text-xs font-bold text-slate-200">
                        {String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Down Arrow */}
              {idx < cascade.stages.length - 1 && (
                <div className="flex justify-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-850 text-slate-400 shadow">
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
