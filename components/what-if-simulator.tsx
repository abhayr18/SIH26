'use client';

import React, { useState } from 'react';
import {
  Sliders,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Users,
  Sun,
  Droplets,
  Wind,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from 'lucide-react';
import { runWhatIfSimulation, SimulationResult } from '@/lib/simulation-engine';

interface WhatIfSimulatorProps {
  currentCity: string;
  currentTemp: number;
  currentHumidity: number;
  currentWind: number;
  currentSolar: number;
  currentPvs: number;
  totalPopulation?: number;
}

export function WhatIfSimulator({
  currentCity,
  currentTemp,
  currentHumidity,
  currentWind,
  currentSolar,
  currentPvs,
  totalPopulation = 95000,
}: WhatIfSimulatorProps) {
  const [deltaTemp, setDeltaTemp] = useState<number>(2.0);
  const [deltaHumidity, setDeltaHumidity] = useState<number>(0);
  const [deltaWind, setDeltaWind] = useState<number>(0);
  const [deltaSolar, setDeltaSolar] = useState<number>(100);
  const [workerExposure, setWorkerExposure] = useState<number>(1.2);
  const [vulnShift, setVulnShift] = useState<number>(0);

  const simulation: SimulationResult = runWhatIfSimulation({
    baseline_temp_c: currentTemp,
    baseline_humidity_pct: currentHumidity,
    baseline_wind_kmh: currentWind,
    baseline_solar_wm2: currentSolar,
    baseline_pvs_score: currentPvs,
    total_population: totalPopulation,
    delta_temp_c: deltaTemp,
    delta_humidity_pct: deltaHumidity,
    delta_wind_kmh: deltaWind,
    delta_solar_wm2: deltaSolar,
    worker_exposure_multiplier: workerExposure,
    vulnerability_shift_pct: vulnShift,
  });

  const resetDeltas = () => {
    setDeltaTemp(0);
    setDeltaHumidity(0);
    setDeltaWind(0);
    setDeltaSolar(0);
    setWorkerExposure(1.0);
    setVulnShift(0);
  };

  const alertBadgeColor = {
    green: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    yellow: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    orange: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
    red: 'border-red-500/40 bg-red-500/10 text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-6 w-6 text-amber-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              What-If? Heat Scenario Simulator
            </h2>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              Interactive Microclimate Engine
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Simulate the physiological and public health impacts of microclimatic shifts in <span className="font-semibold text-white">{currentCity}</span>. Observe real-time changes in WBGT, UTCI, HTSS, and alert thresholds.
          </p>
        </div>
        <button
          onClick={resetDeltas}
          className="flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-700/60 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Baseline
        </button>
      </div>

      {/* Main Grid: Controls vs Comparative Results */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Interactive Simulation Sliders */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-lg lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-semibold text-white">Scenario Parameters</h3>
            <span className="text-xs text-slate-400">Drag sliders to recalculate</span>
          </div>

          <div className="mt-5 space-y-5">
            {/* Temperature Delta */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Flame className="h-3.5 w-3.5 text-red-400" />
                  Temperature Shift (ΔT)
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {deltaTemp >= 0 ? `+${deltaTemp}` : deltaTemp}°C → {(currentTemp + deltaTemp).toFixed(1)}°C
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="6"
                step="0.5"
                value={deltaTemp}
                onChange={(e) => setDeltaTemp(parseFloat(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-5°C (Cold surge)</span>
                <span>0°C (Baseline)</span>
                <span>+3°C (Severe)</span>
                <span>+6°C (Extreme)</span>
              </div>
            </div>

            {/* Humidity Delta */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Droplets className="h-3.5 w-3.5 text-blue-400" />
                  Relative Humidity Shift (ΔRH)
                </span>
                <span className="font-mono font-bold text-cyan-300">
                  {deltaHumidity >= 0 ? `+${deltaHumidity}` : deltaHumidity}% → {Math.min(99, Math.max(5, currentHumidity + deltaHumidity))}%
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={deltaHumidity}
                onChange={(e) => setDeltaHumidity(parseFloat(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-30% (Dry desert air)</span>
                <span>0% (Baseline)</span>
                <span>+30% (Coastal moisture)</span>
              </div>
            </div>

            {/* Solar Radiation Delta */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  Direct Solar Load (ΔSolar)
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {deltaSolar >= 0 ? `+${deltaSolar}` : deltaSolar} W/m² → {Math.max(0, currentSolar + deltaSolar)} W/m²
                </span>
              </div>
              <input
                type="range"
                min="-300"
                max="400"
                step="50"
                value={deltaSolar}
                onChange={(e) => setDeltaSolar(parseFloat(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-300 (Cloudy)</span>
                <span>0 (Baseline)</span>
                <span>+400 (Peak solar noon)</span>
              </div>
            </div>

            {/* Wind Speed Delta */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Wind className="h-3.5 w-3.5 text-teal-400" />
                  Wind Speed Shift (ΔWind)
                </span>
                <span className="font-mono font-bold text-teal-300">
                  {deltaWind >= 0 ? `+${deltaWind}` : deltaWind} km/h → {Math.max(0, currentWind + deltaWind)} km/h
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="25"
                step="5"
                value={deltaWind}
                onChange={(e) => setDeltaWind(parseFloat(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-15 km/h (Stagnant)</span>
                <span>0 km/h</span>
                <span>+25 km/h (Breeze)</span>
              </div>
            </div>

            {/* Outdoor Worker Exposure Factor */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Users className="h-3.5 w-3.5 text-purple-400" />
                  Outdoor Worker Exposure Factor
                </span>
                <span className="font-mono font-bold text-purple-300">
                  {workerExposure.toFixed(1)}x Multiplier
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.8"
                step="0.1"
                value={workerExposure}
                onChange={(e) => setWorkerExposure(parseFloat(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.8x (Indoor/Shaded)</span>
                <span>1.0x (Standard)</span>
                <span>1.8x (Heavy unshaded labor)</span>
              </div>
            </div>

            {/* Vulnerability Shift */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                  Demographic Vulnerability Shift
                </span>
                <span className="font-mono font-bold text-rose-300">
                  {vulnShift >= 0 ? `+${vulnShift}` : vulnShift}% PVS
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="30"
                step="5"
                value={vulnShift}
                onChange={(e) => setVulnShift(parseFloat(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-20% (Cool roofs active)</span>
                <span>0% (Baseline)</span>
                <span>+30% (Dense unpiped slum)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Results & Delta Breakdown */}
        <div className="space-y-6 lg:col-span-7">
          {/* Comparison Cards: Baseline vs Scenario */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Baseline Card */}
            <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Baseline (Observed)
                </span>
                <span className={`rounded-md border px-2 py-0.5 text-xs font-bold uppercase ${alertBadgeColor[simulation.baseline.alert_color]}`}>
                  {simulation.baseline.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Dry-Bulb Temp</span>
                  <span className="font-mono text-base font-bold text-white">
                    {simulation.baseline.thermal.temperature_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Heat Index (NOAA)</span>
                  <span className="font-mono text-base font-bold text-slate-200">
                    {simulation.baseline.thermal.heat_index_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">WBGT (BoM Outdoor)</span>
                  <span className="font-mono text-base font-bold text-slate-200">
                    {simulation.baseline.thermal.wbgt_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">UTCI Bioclimate</span>
                  <span className="font-mono text-base font-bold text-slate-200">
                    {simulation.baseline.thermal.utci_c}°C
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-amber-400">Human Stress (HTSS)</span>
                  <span className="font-mono text-xl font-extrabold text-amber-400">
                    {simulation.baseline.thermal.htss_score}/100
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-slate-400">
                  <span>Exposed Population</span>
                  <span className="font-mono font-medium text-slate-300">
                    ~{simulation.baseline.affected_population.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario Card */}
            <div className={`rounded-xl border p-5 ${simulation.deltas.alert_escalated ? 'border-red-500/50 bg-red-950/20' : 'border-slate-700 bg-slate-900/80'}`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  What-If Scenario
                </span>
                <span className={`rounded-md border px-2 py-0.5 text-xs font-bold uppercase ${alertBadgeColor[simulation.scenario.alert_color]}`}>
                  {simulation.scenario.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Dry-Bulb Temp</span>
                  <span className="font-mono text-base font-bold text-amber-300">
                    {simulation.scenario.thermal.temperature_c}°C
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({simulation.deltas.delta_temp >= 0 ? `+${simulation.deltas.delta_temp}` : simulation.deltas.delta_temp})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Heat Index (NOAA)</span>
                  <span className="font-mono text-base font-bold text-slate-200">
                    {simulation.scenario.thermal.heat_index_c}°C
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({simulation.deltas.delta_heat_index >= 0 ? `+${simulation.deltas.delta_heat_index}` : simulation.deltas.delta_heat_index})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">WBGT (BoM Outdoor)</span>
                  <span className="font-mono text-base font-bold text-slate-200">
                    {simulation.scenario.thermal.wbgt_c}°C
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({simulation.deltas.delta_wbgt >= 0 ? `+${simulation.deltas.delta_wbgt}` : simulation.deltas.delta_wbgt})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">UTCI Bioclimate</span>
                  <span className="font-mono text-base font-bold text-slate-200">
                    {simulation.scenario.thermal.utci_c}°C
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({simulation.deltas.delta_utci >= 0 ? `+${simulation.deltas.delta_utci}` : simulation.deltas.delta_utci})
                    </span>
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-amber-400">Human Stress (HTSS)</span>
                  <span className="font-mono text-xl font-extrabold text-amber-400">
                    {simulation.scenario.thermal.htss_score}/100
                    <span className="ml-1.5 text-xs font-bold text-rose-400">
                      ({simulation.deltas.delta_htss >= 0 ? `+${simulation.deltas.delta_htss}` : simulation.deltas.delta_htss})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-slate-400">
                  <span>Exposed Population</span>
                  <span className="font-mono font-medium text-slate-200">
                    ~{simulation.scenario.affected_population.toLocaleString()}
                    <span className="ml-1 text-xs text-rose-400">
                      ({simulation.deltas.delta_affected_population >= 0 ? `+${simulation.deltas.delta_affected_population.toLocaleString()}` : simulation.deltas.delta_affected_population.toLocaleString()})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Escalation Alert Banner */}
          {simulation.deltas.alert_escalated && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-300">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400 animate-pulse" />
              <div>
                <h4 className="font-bold text-red-200">
                  Alert Level Escalated: {simulation.baseline.risk_category} ➔ {simulation.scenario.risk_category}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-red-300/90">
                  {simulation.narrative_summary}
                </p>
              </div>
            </div>
          )}

          {/* Policy Decision Guidance */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <ShieldAlert className="h-4 w-4" />
              Decision-Support Policy Recommendation
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              {simulation.recommended_policy_action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
