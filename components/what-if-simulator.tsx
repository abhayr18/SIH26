'use client';

import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Users,
  Sun,
  Droplets,
  Wind,
  Flame,
  AlertTriangle,
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

  const alertBadgeColor: Record<string, string> = {
    green: 'rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 font-bold',
    yellow: 'rounded-full border border-amber-200 bg-amber-50 text-amber-700 font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 font-bold',
    orange: 'rounded-full border border-orange-200 bg-orange-50 text-orange-700 font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 font-bold',
    red: 'rounded-full border border-rose-200 bg-rose-50 text-rose-700 font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 font-bold',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner — Copernicus Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Sliders className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              What-If? Heat Scenario & Intervention Simulator
            </h2>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 font-mono text-[11px] uppercase tracking-wider text-blue-700 font-semibold">
              Core Differentiator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Test policy interventions (shift work hours, activate misting centers) in <span className="text-slate-900 font-semibold">{currentCity}</span> and evaluate the reduction in human heat risk in real time.
          </p>
        </div>
        <button
          onClick={resetDeltas}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs uppercase tracking-wider font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400 shadow-2xs shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Baseline
        </button>
      </div>

      {/* Authority Interventions Preset Bar */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-medium block">
              Authority Intervention Presets
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5 tracking-tight">
              One-Click Municipal Action Testing
            </h3>
            <p className="text-xs text-slate-600">
              Click an authority action to test how rapid interventions mitigate population risk:
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={applyWorkShiftIntervention}
              className={`rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                workerExposure < 1
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-medium shadow-2xs'
              }`}
            >
              Shift Work (11am–4pm)
            </button>
            <button
              onClick={applyCoolingCenterIntervention}
              className={`rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                vulnShift < 0
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-medium shadow-2xs'
              }`}
            >
              Open 25 Shelters (-20%)
            </button>
            <button
              onClick={applyCombinedIntervention}
              className={`rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                workerExposure < 1 && vulnShift < 0
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-medium shadow-2xs'
              }`}
            >
              Combined Action Plan
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Comparative Results */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Interactive Simulation Sliders */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">Simulation Parameters</h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Live Recalculation</span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Temperature Delta */}
            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Flame className="h-3.5 w-3.5 text-rose-500" />
                  Temperature Shift (&Delta;T)
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {deltaTemp >= 0 ? `+${deltaTemp}` : deltaTemp}°C &rarr; {(currentTemp + deltaTemp).toFixed(1)}°C
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="6"
                step="0.5"
                value={deltaTemp}
                onChange={(e) => setDeltaTemp(parseFloat(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-500 mt-1.5">
                <span>-5°C (Cooling)</span>
                <span>0°C (Baseline)</span>
                <span>+6°C (Severe)</span>
              </div>
            </div>

            {/* Humidity Delta */}
            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Droplets className="h-3.5 w-3.5 text-blue-500" />
                  Relative Humidity Shift (&Delta;RH)
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {deltaHumidity >= 0 ? `+${deltaHumidity}` : deltaHumidity}% &rarr; {Math.min(99, Math.max(5, currentHumidity + deltaHumidity))}%
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={deltaHumidity}
                onChange={(e) => setDeltaHumidity(parseFloat(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-500 mt-1.5">
                <span>-30% (Dry)</span>
                <span>0% (Observed)</span>
                <span>+30% (Moist)</span>
              </div>
            </div>

            {/* Solar Radiation Delta */}
            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  Solar Radiation (&Delta;Solar)
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {deltaSolar >= 0 ? `+${deltaSolar}` : deltaSolar} W/m² &rarr; {Math.max(0, currentSolar + deltaSolar)} W/m²
                </span>
              </div>
              <input
                type="range"
                min="-300"
                max="400"
                step="50"
                value={deltaSolar}
                onChange={(e) => setDeltaSolar(parseFloat(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-500 mt-1.5">
                <span>-300 (Cloudy)</span>
                <span>0 (Observed)</span>
                <span>+400 (Peak noon)</span>
              </div>
            </div>

            {/* Wind Speed Delta */}
            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Wind className="h-3.5 w-3.5 text-teal-600" />
                  Wind Speed Shift (&Delta;Wind)
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {deltaWind >= 0 ? `+${deltaWind}` : deltaWind} km/h &rarr; {Math.max(0, currentWind + deltaWind)} km/h
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="25"
                step="5"
                value={deltaWind}
                onChange={(e) => setDeltaWind(parseFloat(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-500 mt-1.5">
                <span>-15 km/h (Stagnant)</span>
                <span>0 km/h</span>
                <span>+25 km/h (Breeze)</span>
              </div>
            </div>

            {/* Worker Exposure Factor */}
            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                  Outdoor Worker Exposure
                </span>
                <span className="font-mono font-bold text-slate-900">
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
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-500 mt-1.5">
                <span>0.5x (Shifted)</span>
                <span>1.0x (Standard)</span>
                <span>1.8x (Peak)</span>
              </div>
            </div>

            {/* Vulnerability Shift */}
            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                  Demographic Vulnerability Shift
                </span>
                <span className="font-mono font-bold text-slate-900">
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
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-500 mt-1.5">
                <span>-25% (Shelters)</span>
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
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  Baseline (Observed)
                </span>
                <span className={alertBadgeColor[simulation.baseline.alert_color] || alertBadgeColor.green}>
                  {simulation.baseline.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Dry-Bulb Temp</span>
                  <span className="font-mono text-base font-bold text-slate-900">
                    {simulation.baseline.thermal.temperature_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Heat Index (NOAA)</span>
                  <span className="font-mono text-base font-bold text-slate-900">
                    {simulation.baseline.thermal.heat_index_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">WBGT (Outdoor)</span>
                  <span className="font-mono text-base font-bold text-slate-900">
                    {simulation.baseline.thermal.wbgt_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">UTCI Bioclimate</span>
                  <span className="font-mono text-base font-bold text-slate-900">
                    {simulation.baseline.thermal.utci_c}°C
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-2.5 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-slate-900">Human Thermal Stress</span>
                  <span className="font-mono text-xl font-bold text-slate-900">
                    {simulation.baseline.thermal.htss_score}/100
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-slate-500">
                  <span>Exposed Population</span>
                  <span className="font-mono font-bold text-slate-900">
                    ~{simulation.baseline.affected_population.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario Card */}
            <div className={`rounded-xl border p-5 shadow-xs ${
              simulation.deltas.alert_escalated 
                ? 'border-slate-800 bg-slate-950 text-slate-100 shadow-md' 
                : 'border-slate-200/80 bg-white'
            }`}>
              <div className={`flex items-center justify-between border-b pb-3 ${
                simulation.deltas.alert_escalated ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <span className={`font-mono text-[10px] uppercase tracking-wider font-bold ${
                  simulation.deltas.alert_escalated ? 'text-cyan-400' : 'text-slate-900'
                }`}>
                  What-If Scenario
                </span>
                <span className={alertBadgeColor[simulation.scenario.alert_color] || alertBadgeColor.green}>
                  {simulation.scenario.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className={`text-xs ${simulation.deltas.alert_escalated ? 'text-slate-400' : 'text-slate-500'}`}>Dry-Bulb Temp</span>
                  <span className={`font-mono text-base font-bold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-slate-900'}`}>
                    {simulation.scenario.thermal.temperature_c}°C
                    <span className={`ml-1 text-xs font-normal ${simulation.deltas.alert_escalated ? 'text-slate-400' : 'text-slate-500'}`}>
                      ({simulation.deltas.delta_temp >= 0 ? `+${simulation.deltas.delta_temp}` : simulation.deltas.delta_temp})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-xs ${simulation.deltas.alert_escalated ? 'text-slate-400' : 'text-slate-500'}`}>Heat Index (NOAA)</span>
                  <span className={`font-mono text-base font-bold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-slate-900'}`}>
                    {simulation.scenario.thermal.heat_index_c}°C
                    <span className={`ml-1 text-xs font-normal ${simulation.deltas.alert_escalated ? 'text-slate-400' : 'text-slate-500'}`}>
                      ({simulation.deltas.delta_heat_index >= 0 ? `+${simulation.deltas.delta_heat_index}` : simulation.deltas.delta_heat_index})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-xs ${simulation.deltas.alert_escalated ? 'text-slate-400' : 'text-slate-500'}`}>WBGT (Outdoor)</span>
                  <span className={`font-mono text-base font-bold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-slate-900'}`}>
                    {simulation.scenario.thermal.wbgt_c}°C
                    <span className={`ml-1 text-xs font-normal ${simulation.deltas.alert_escalated ? 'text-slate-400' : 'text-slate-500'}`}>
                      ({simulation.deltas.delta_wbgt >= 0 ? `+${simulation.deltas.delta_wbgt}` : simulation.deltas.delta_wbgt})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-xs ${simulation.deltas.alert_escalated ? 'text-slate-400' : 'text-slate-500'}`}>UTCI Bioclimate</span>
                  <span className={`font-mono text-base font-bold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-slate-900'}`}>
                    {simulation.scenario.thermal.utci_c}°C
                    <span className={`ml-1 text-xs font-normal ${simulation.deltas.alert_escalated ? 'text-slate-400' : 'text-slate-500'}`}>
                      ({simulation.deltas.delta_utci >= 0 ? `+${simulation.deltas.delta_utci}` : simulation.deltas.delta_utci})
                    </span>
                  </span>
                </div>
                <div className={`border-t pt-2.5 flex items-baseline justify-between ${simulation.deltas.alert_escalated ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className={`text-xs font-semibold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-slate-900'}`}>Human Thermal Stress</span>
                  <span className={`font-mono text-xl font-bold ${simulation.deltas.alert_escalated ? 'text-cyan-400' : 'text-slate-900'}`}>
                    {simulation.scenario.thermal.htss_score}/100
                    <span className={`ml-1.5 text-xs font-mono font-bold ${
                      simulation.deltas.delta_htss > 0 
                        ? (simulation.deltas.alert_escalated ? 'text-rose-400' : 'text-rose-600') 
                        : 'text-emerald-500'
                    }`}>
                      ({simulation.deltas.delta_htss >= 0 ? `+${simulation.deltas.delta_htss}` : simulation.deltas.delta_htss})
                    </span>
                  </span>
                </div>
                <div className={`flex items-baseline justify-between text-xs ${simulation.deltas.alert_escalated ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>Exposed Population</span>
                  <span className={`font-mono font-bold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-slate-900'}`}>
                    ~{simulation.scenario.affected_population.toLocaleString()}
                    <span className="ml-1 text-xs font-mono">
                      ({simulation.deltas.delta_affected_population >= 0 ? `+${simulation.deltas.delta_affected_population.toLocaleString()}` : simulation.deltas.delta_affected_population.toLocaleString()})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Escalation Alert Banner */}
          {simulation.deltas.alert_escalated && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-5 text-rose-950 shadow-xs">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <div>
                <h4 className="font-bold text-rose-900 text-sm tracking-tight">
                  Alert Level Escalated: {simulation.baseline.risk_category} &rarr; {simulation.scenario.risk_category}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-rose-700">
                  {simulation.narrative_summary}
                </p>
              </div>
            </div>
          )}

          {/* Expected Risk Reduction Card */}
          {(simulation.deltas.delta_affected_population < 0 || simulation.deltas.delta_risk_score < 0) && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-950 shadow-xs">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <h4 className="font-bold text-emerald-900 text-sm tracking-tight">
                  Expected Human Risk Reduction Achieved
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-emerald-700">
                  Targeted municipal intervention successfully reduces exposed population heat stress by{' '}
                  <strong className="font-mono font-bold text-emerald-900">{Math.abs(simulation.deltas.delta_risk_score).toFixed(1)} risk points</strong>, shielding an estimated{' '}
                  <strong className="font-mono font-bold text-emerald-900">~{Math.abs(simulation.deltas.delta_affected_population).toLocaleString()} citizens</strong> from acute emergency admissions.
                </p>
              </div>
            </div>
          )}

          {/* Policy Decision Guidance */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-900 font-bold">
              <ShieldAlert className="h-4 w-4 text-blue-600" />
              Decision-Support Policy Recommendation
            </div>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700">
              {simulation.recommended_policy_action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
