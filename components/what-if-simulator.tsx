'use client';

import React, { useState } from 'react';
import {
  Sliders,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
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

  const applyWorkShiftIntervention = () => {
    setWorkerExposure(0.6); // Shifts peak hours (11:00-16:00 work stoppage)
  };

  const applyCoolingCenterIntervention = () => {
    setVulnShift(-20); // Opens municipal cooling centers and misting shelters
  };

  const applyCombinedIntervention = () => {
    setWorkerExposure(0.5);
    setVulnShift(-25);
  };

  const alertBadgeColor = {
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700 font-bold',
    yellow: 'border-amber-200 bg-amber-50 text-amber-700 font-bold',
    orange: 'border-orange-200 bg-orange-50 text-orange-700 font-bold',
    red: 'border-rose-200 bg-rose-50 text-rose-700 font-bold',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              What-If? Heat Scenario & Intervention Simulator
            </h2>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              Core Differentiator
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Test policy interventions (e.g. shift work hours, open cooling centers) in <span className="font-semibold text-slate-900">{currentCity}</span> and evaluate the expected reduction in human heat risk in real time.
          </p>
        </div>
        <button
          onClick={resetDeltas}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 shadow-sm"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Baseline
        </button>
      </div>

      {/* Test Authority Interventions Bar (Core Innovation Feature) */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4.5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-block rounded bg-blue-600 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-white tracking-wider">
              Authority Intervention Presets
            </span>
            <h3 className="mt-1 text-sm font-bold text-slate-900">
              One-Click Municipal Action Testing
            </h3>
            <p className="text-xs text-slate-600">
              Click an authority action to test how rapid interventions reduce population risk:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={applyWorkShiftIntervention}
              className={`rounded-xl border px-3 py-2 sm:py-1.5 text-xs font-semibold transition-all shadow-xs text-center ${workerExposure < 1 ? 'border-amber-300 bg-amber-500 text-white font-bold' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              Shift Work Hours (11am–4pm)
            </button>
            <button
              onClick={applyCoolingCenterIntervention}
              className={`rounded-xl border px-3 py-2 sm:py-1.5 text-xs font-semibold transition-all shadow-xs text-center ${vulnShift < 0 ? 'border-emerald-300 bg-emerald-600 text-white font-bold' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              Open 25 Cooling Centers (-20%)
            </button>
            <button
              onClick={applyCombinedIntervention}
              className={`rounded-xl border px-3 py-2 sm:py-1.5 text-xs font-semibold transition-all shadow-xs text-center ${workerExposure < 1 && vulnShift < 0 ? 'border-blue-400 bg-blue-600 text-white font-bold' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              Combined Action Plan
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Comparative Results */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Interactive Simulation Sliders */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Simulation Parameters</h3>
            <span className="text-[11px] font-medium text-slate-400">Live recalculation</span>
          </div>

          <div className="mt-5 space-y-5">
            {/* Temperature Delta */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Flame className="h-3.5 w-3.5 text-rose-500" />
                  Temperature Shift (ΔT)
                </span>
                <span className="font-mono font-bold text-rose-600">
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
                className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-rose-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-5°C (Cooling)</span>
                <span>0°C (Baseline)</span>
                <span>+6°C (Severe heatwave)</span>
              </div>
            </div>

            {/* Humidity Delta */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Droplets className="h-3.5 w-3.5 text-blue-500" />
                  Relative Humidity Shift (ΔRH)
                </span>
                <span className="font-mono font-bold text-blue-600">
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
                className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-30% (Dry air)</span>
                <span>0% (Observed)</span>
                <span>+30% (High moisture)</span>
              </div>
            </div>

            {/* Solar Radiation Delta */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  Solar Radiation (ΔSolar)
                </span>
                <span className="font-mono font-bold text-amber-600">
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
                className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-300 (Cloudy)</span>
                <span>0 (Observed)</span>
                <span>+400 (Peak noon)</span>
              </div>
            </div>

            {/* Wind Speed Delta */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Wind className="h-3.5 w-3.5 text-teal-600" />
                  Wind Speed Shift (ΔWind)
                </span>
                <span className="font-mono font-bold text-teal-700">
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
                className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-15 km/h (Stagnant)</span>
                <span>0 km/h</span>
                <span>+25 km/h (Breeze)</span>
              </div>
            </div>

            {/* Outdoor Worker Exposure Factor */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Users className="h-3.5 w-3.5 text-purple-600" />
                  Outdoor Worker Exposure
                </span>
                <span className="font-mono font-bold text-purple-700">
                  {workerExposure.toFixed(1)}x Multiplier
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.1"
                value={workerExposure}
                onChange={(e) => setWorkerExposure(parseFloat(e.target.value))}
                className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.5x (Shifted hours)</span>
                <span>1.0x (Standard)</span>
                <span>1.8x (Peak exposure)</span>
              </div>
            </div>

            {/* Vulnerability Shift */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                  Socio-Demographic Vulnerability Shift
                </span>
                <span className="font-mono font-bold text-rose-700">
                  {vulnShift >= 0 ? `+${vulnShift}` : vulnShift}% PVS
                </span>
              </div>
              <input
                type="range"
                min="-25"
                max="30"
                step="5"
                value={vulnShift}
                onChange={(e) => setVulnShift(parseFloat(e.target.value))}
                className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-rose-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-25% (Shelters & Misting)</span>
                <span>0% (Baseline)</span>
                <span>+30% (Unmitigated)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Results & Delta Breakdown */}
        <div className="space-y-5 lg:col-span-7">
          {/* Comparison Cards: Baseline vs Scenario */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Baseline Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Baseline (Observed)
                </span>
                <span className={`rounded-lg border px-2 py-0.5 text-xs ${alertBadgeColor[simulation.baseline.alert_color]}`}>
                  {simulation.baseline.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">Dry-Bulb Temp</span>
                  <span className="font-mono text-base font-bold text-slate-900">
                    {simulation.baseline.thermal.temperature_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">Heat Index (NOAA)</span>
                  <span className="font-mono text-base font-bold text-slate-700">
                    {simulation.baseline.thermal.heat_index_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">WBGT (BoM Outdoor)</span>
                  <span className="font-mono text-base font-bold text-slate-700">
                    {simulation.baseline.thermal.wbgt_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">UTCI Bioclimate</span>
                  <span className="font-mono text-base font-bold text-slate-700">
                    {simulation.baseline.thermal.utci_c}°C
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-2.5 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-900">Human Thermal Stress</span>
                  <span className="font-mono text-xl font-extrabold text-blue-600">
                    {simulation.baseline.thermal.htss_score}/100
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-slate-500">
                  <span>Exposed Population</span>
                  <span className="font-mono font-semibold text-slate-700">
                    ~{simulation.baseline.affected_population.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario Card */}
            <div className={`rounded-2xl border p-5 shadow-sm ${simulation.deltas.alert_escalated ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200/80 bg-white'}`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  What-If Scenario
                </span>
                <span className={`rounded-lg border px-2 py-0.5 text-xs ${alertBadgeColor[simulation.scenario.alert_color]}`}>
                  {simulation.scenario.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">Dry-Bulb Temp</span>
                  <span className="font-mono text-base font-bold text-slate-900">
                    {simulation.scenario.thermal.temperature_c}°C
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({simulation.deltas.delta_temp >= 0 ? `+${simulation.deltas.delta_temp}` : simulation.deltas.delta_temp})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">Heat Index (NOAA)</span>
                  <span className="font-mono text-base font-bold text-slate-700">
                    {simulation.scenario.thermal.heat_index_c}°C
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({simulation.deltas.delta_heat_index >= 0 ? `+${simulation.deltas.delta_heat_index}` : simulation.deltas.delta_heat_index})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">WBGT (BoM Outdoor)</span>
                  <span className="font-mono text-base font-bold text-slate-700">
                    {simulation.scenario.thermal.wbgt_c}°C
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({simulation.deltas.delta_wbgt >= 0 ? `+${simulation.deltas.delta_wbgt}` : simulation.deltas.delta_wbgt})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">UTCI Bioclimate</span>
                  <span className="font-mono text-base font-bold text-slate-700">
                    {simulation.scenario.thermal.utci_c}°C
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({simulation.deltas.delta_utci >= 0 ? `+${simulation.deltas.delta_utci}` : simulation.deltas.delta_utci})
                    </span>
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-2.5 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-900">Human Thermal Stress</span>
                  <span className="font-mono text-xl font-extrabold text-blue-600">
                    {simulation.scenario.thermal.htss_score}/100
                    <span className={`ml-1.5 text-xs font-bold ${simulation.deltas.delta_htss > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ({simulation.deltas.delta_htss >= 0 ? `+${simulation.deltas.delta_htss}` : simulation.deltas.delta_htss})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-slate-500">
                  <span>Exposed Population</span>
                  <span className="font-mono font-semibold text-slate-900">
                    ~{simulation.scenario.affected_population.toLocaleString()}
                    <span className={`ml-1 text-xs ${simulation.deltas.delta_affected_population > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ({simulation.deltas.delta_affected_population >= 0 ? `+${simulation.deltas.delta_affected_population.toLocaleString()}` : simulation.deltas.delta_affected_population.toLocaleString()})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Escalation Alert Banner */}
          {simulation.deltas.alert_escalated && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900 shadow-sm">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
              <div>
                <h4 className="font-bold text-rose-950 text-sm">
                  Alert Level Escalated: {simulation.baseline.risk_category} ➔ {simulation.scenario.risk_category}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-rose-800">
                  {simulation.narrative_summary}
                </p>
              </div>
            </div>
          )}

          {/* Expected Risk Reduction Card */}
          {(simulation.deltas.delta_affected_population < 0 || simulation.deltas.delta_risk_score < 0) && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4.5 text-emerald-900 shadow-sm">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">
                  Expected Human Risk Reduction Achieved
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-emerald-800">
                  Targeted municipal intervention successfully reduces exposed population heat stress by{' '}
                  <strong className="text-emerald-950 font-mono font-bold">{Math.abs(simulation.deltas.delta_risk_score).toFixed(1)} risk points</strong>, shielding an estimated{' '}
                  <strong className="text-emerald-950 font-mono font-bold">~{Math.abs(simulation.deltas.delta_affected_population).toLocaleString()} citizens</strong> from acute emergency room admissions.
                </p>
              </div>
            </div>
          )}

          {/* Policy Decision Guidance */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
              <ShieldAlert className="h-4 w-4 text-blue-600" />
              Decision-Support Policy Recommendation
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-800 font-medium">
              {simulation.recommended_policy_action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
