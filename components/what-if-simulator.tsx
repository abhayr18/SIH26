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

  const alertBadgeColor = {
    green: 'rounded-full border border-[#0e0f10]/10 bg-[#f4f4f8] text-[#0e0f10] font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 font-semibold',
    yellow: 'rounded-full border border-[#ff7a59]/30 bg-[#ff7a59]/10 text-[#ff7a59] font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 font-semibold',
    orange: 'rounded-full border border-[#ff5c35]/30 bg-[#ff5c35]/15 text-[#ff5c35] font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 font-semibold',
    red: 'rounded-full border border-[#ff5065]/30 bg-[#ffe9eb] text-[#ff5065] font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 font-semibold',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner — Contrast Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#0e0f10]/6 bg-white p-6 sm:p-7 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffe9eb] text-[#ff5065] border border-[#ff5065]/20">
              <Sliders className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0e0f10]">
              What-If? Heat Scenario & Intervention Simulator
            </h2>
            <span className="rounded-full border border-[#ff5065]/20 bg-[#ffe9eb] px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#ff5065] font-semibold">
              Core Differentiator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Test policy interventions (shift work hours, activate misting centers) in <span className="text-[#0e0f10] font-semibold">{currentCity}</span> and evaluate the reduction in human heat risk in real time.
          </p>
        </div>
        <button
          onClick={resetDeltas}
          className="flex items-center gap-1.5 rounded-full border border-[#0e0f10]/10 bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-wider font-semibold text-[#0e0f10] transition hover:bg-[#f4f4f8] shadow-none shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5 text-[#ff5065]" />
          Reset Baseline
        </button>
      </div>

      {/* Authority Interventions Preset Bar */}
      <div className="rounded-3xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-5 shadow-[0_5px_25px_rgba(38,42,62,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] font-medium block">
              Authority Intervention Presets
            </span>
            <h3 className="text-sm font-bold text-[#0e0f10] mt-0.5 tracking-tight">
              One-Click Municipal Action Testing
            </h3>
            <p className="text-xs text-[#666666]">
              Click an authority action to test how rapid interventions mitigate population risk:
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={applyWorkShiftIntervention}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
                workerExposure < 1
                  ? 'bg-[#ff5065] text-white font-bold shadow-none'
                  : 'border border-[#0e0f10]/10 bg-white text-[#0e0f10] hover:bg-neutral-100 font-medium'
              }`}
            >
              Shift Work (11am–4pm)
            </button>
            <button
              onClick={applyCoolingCenterIntervention}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
                vulnShift < 0
                  ? 'bg-[#ff5065] text-white font-bold shadow-none'
                  : 'border border-[#0e0f10]/10 bg-white text-[#0e0f10] hover:bg-neutral-100 font-medium'
              }`}
            >
              Open 25 Shelters (-20%)
            </button>
            <button
              onClick={applyCombinedIntervention}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
                workerExposure < 1 && vulnShift < 0
                  ? 'bg-[#ff5065] text-white font-bold shadow-none'
                  : 'border border-[#0e0f10]/10 bg-white text-[#0e0f10] hover:bg-neutral-100 font-medium'
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
        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-6 shadow-[0_5px_25px_rgba(38,42,62,0.06)] lg:col-span-5">
          <div className="flex items-center justify-between border-b border-[#0e0f10]/6 pb-3.5">
            <h3 className="font-bold text-[#0e0f10] text-sm tracking-tight">Simulation Parameters</h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666]">Live Recalculation</span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Temperature Delta */}
            <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#0e0f10]">
                  <Flame className="h-3.5 w-3.5 text-[#ff7a59]" />
                  Temperature Shift (&Delta;T)
                </span>
                <span className="font-mono font-bold text-[#ff5065]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-300 accent-[#ff5065]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-[#666666] mt-1.5">
                <span>-5°C (Cooling)</span>
                <span>0°C (Baseline)</span>
                <span>+6°C (Severe)</span>
              </div>
            </div>

            {/* Humidity Delta */}
            <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#0e0f10]">
                  <Droplets className="h-3.5 w-3.5 text-[#ff5065]" />
                  Relative Humidity Shift (&Delta;RH)
                </span>
                <span className="font-mono font-bold text-[#0e0f10]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-300 accent-[#ff5065]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-[#666666] mt-1.5">
                <span>-30% (Dry)</span>
                <span>0% (Observed)</span>
                <span>+30% (Moist)</span>
              </div>
            </div>

            {/* Solar Radiation Delta */}
            <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#0e0f10]">
                  <Sun className="h-3.5 w-3.5 text-[#ff7a59]" />
                  Solar Radiation (&Delta;Solar)
                </span>
                <span className="font-mono font-bold text-[#0e0f10]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-300 accent-[#ff5065]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-[#666666] mt-1.5">
                <span>-300 (Cloudy)</span>
                <span>0 (Observed)</span>
                <span>+400 (Peak noon)</span>
              </div>
            </div>

            {/* Wind Speed Delta */}
            <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#0e0f10]">
                  <Wind className="h-3.5 w-3.5 text-[#0e0f10]" />
                  Wind Speed Shift (&Delta;Wind)
                </span>
                <span className="font-mono font-bold text-[#0e0f10]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-300 accent-[#ff5065]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-[#666666] mt-1.5">
                <span>-15 km/h (Stagnant)</span>
                <span>0 km/h</span>
                <span>+25 km/h (Breeze)</span>
              </div>
            </div>

            {/* Worker Exposure Factor */}
            <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#0e0f10]">
                  <Users className="h-3.5 w-3.5 text-[#ff5065]" />
                  Outdoor Worker Exposure
                </span>
                <span className="font-mono font-bold text-[#ff5065]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-300 accent-[#ff5065]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-[#666666] mt-1.5">
                <span>0.5x (Shifted)</span>
                <span>1.0x (Standard)</span>
                <span>1.8x (Peak)</span>
              </div>
            </div>

            {/* Vulnerability Shift */}
            <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#0e0f10]">
                  <ShieldAlert className="h-3.5 w-3.5 text-[#ff5065]" />
                  Demographic Vulnerability Shift
                </span>
                <span className="font-mono font-bold text-[#ff5065]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-300 accent-[#ff5065]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-[#666666] mt-1.5">
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
            <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
              <div className="flex items-center justify-between border-b border-[#0e0f10]/6 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] font-medium">
                  Baseline (Observed)
                </span>
                <span className={alertBadgeColor[simulation.baseline.alert_color]}>
                  {simulation.baseline.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#666666]">Dry-Bulb Temp</span>
                  <span className="font-mono text-base font-bold text-[#0e0f10]">
                    {simulation.baseline.thermal.temperature_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#666666]">Heat Index (NOAA)</span>
                  <span className="font-mono text-base font-bold text-[#0e0f10]">
                    {simulation.baseline.thermal.heat_index_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#666666]">WBGT (Outdoor)</span>
                  <span className="font-mono text-base font-bold text-[#0e0f10]">
                    {simulation.baseline.thermal.wbgt_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#666666]">UTCI Bioclimate</span>
                  <span className="font-mono text-base font-bold text-[#0e0f10]">
                    {simulation.baseline.thermal.utci_c}°C
                  </span>
                </div>
                <div className="border-t border-[#0e0f10]/6 pt-2.5 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-[#0e0f10]">Human Thermal Stress</span>
                  <span className="font-mono text-xl font-bold text-[#ff5065]">
                    {simulation.baseline.thermal.htss_score}/100
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-[#666666]">
                  <span>Exposed Population</span>
                  <span className="font-mono font-bold text-[#0e0f10]">
                    ~{simulation.baseline.affected_population.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario Card */}
            <div className={`rounded-3xl border p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)] ${simulation.deltas.alert_escalated ? 'border-[#ff5065]/30 bg-[#ffe9eb]' : 'border-[#0e0f10]/6 bg-white'}`}>
              <div className="flex items-center justify-between border-b border-[#0e0f10]/6 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#0e0f10] font-bold">
                  What-If Scenario
                </span>
                <span className={alertBadgeColor[simulation.scenario.alert_color]}>
                  {simulation.scenario.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#666666]">Dry-Bulb Temp</span>
                  <span className="font-mono text-base font-bold text-[#0e0f10]">
                    {simulation.scenario.thermal.temperature_c}°C
                    <span className="ml-1 text-xs font-normal text-[#666666]">
                      ({simulation.deltas.delta_temp >= 0 ? `+${simulation.deltas.delta_temp}` : simulation.deltas.delta_temp})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#666666]">Heat Index (NOAA)</span>
                  <span className="font-mono text-base font-bold text-[#0e0f10]">
                    {simulation.scenario.thermal.heat_index_c}°C
                    <span className="ml-1 text-xs font-normal text-[#666666]">
                      ({simulation.deltas.delta_heat_index >= 0 ? `+${simulation.deltas.delta_heat_index}` : simulation.deltas.delta_heat_index})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#666666]">WBGT (Outdoor)</span>
                  <span className="font-mono text-base font-bold text-[#0e0f10]">
                    {simulation.scenario.thermal.wbgt_c}°C
                    <span className="ml-1 text-xs font-normal text-[#666666]">
                      ({simulation.deltas.delta_wbgt >= 0 ? `+${simulation.deltas.delta_wbgt}` : simulation.deltas.delta_wbgt})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#666666]">UTCI Bioclimate</span>
                  <span className="font-mono text-base font-bold text-[#0e0f10]">
                    {simulation.scenario.thermal.utci_c}°C
                    <span className="ml-1 text-xs font-normal text-[#666666]">
                      ({simulation.deltas.delta_utci >= 0 ? `+${simulation.deltas.delta_utci}` : simulation.deltas.delta_utci})
                    </span>
                  </span>
                </div>
                <div className="border-t border-[#0e0f10]/6 pt-2.5 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-[#0e0f10]">Human Thermal Stress</span>
                  <span className="font-mono text-xl font-bold text-[#ff5065]">
                    {simulation.scenario.thermal.htss_score}/100
                    <span className={`ml-1.5 text-xs font-mono font-bold ${simulation.deltas.delta_htss > 0 ? 'text-[#ff5065]' : 'text-[#0e0f10]'}`}>
                      ({simulation.deltas.delta_htss >= 0 ? `+${simulation.deltas.delta_htss}` : simulation.deltas.delta_htss})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-[#666666]">
                  <span>Exposed Population</span>
                  <span className="font-mono font-bold text-[#0e0f10]">
                    ~{simulation.scenario.affected_population.toLocaleString()}
                    <span className={`ml-1 text-xs font-mono ${simulation.deltas.delta_affected_population > 0 ? 'text-[#ff5065]' : 'text-[#0e0f10]'}`}>
                      ({simulation.deltas.delta_affected_population >= 0 ? `+${simulation.deltas.delta_affected_population.toLocaleString()}` : simulation.deltas.delta_affected_population.toLocaleString()})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Escalation Alert Banner */}
          {simulation.deltas.alert_escalated && (
            <div className="flex items-start gap-3 rounded-3xl border border-[#ff5065]/30 bg-[#ffe9eb] p-5 text-[#ff5065] shadow-[0_5px_25px_rgba(255,80,101,0.08)]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5065]" />
              <div>
                <h4 className="font-bold text-[#ff5065] text-sm tracking-tight">
                  Alert Level Escalated: {simulation.baseline.risk_category} &rarr; {simulation.scenario.risk_category}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#ff5065]/90">
                  {simulation.narrative_summary}
                </p>
              </div>
            </div>
          )}

          {/* Expected Risk Reduction Card */}
          {(simulation.deltas.delta_affected_population < 0 || simulation.deltas.delta_risk_score < 0) && (
            <div className="flex items-start gap-3 rounded-3xl border border-[#0e0f10]/10 bg-[#f4f4f8] p-5 text-[#0e0f10] shadow-sm">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5065]" />
              <div>
                <h4 className="font-bold text-[#0e0f10] text-sm tracking-tight">
                  Expected Human Risk Reduction Achieved
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#666666]">
                  Targeted municipal intervention successfully reduces exposed population heat stress by{' '}
                  <strong className="font-mono font-bold text-[#ff5065]">{Math.abs(simulation.deltas.delta_risk_score).toFixed(1)} risk points</strong>, shielding an estimated{' '}
                  <strong className="font-mono font-bold text-[#0e0f10]">~{Math.abs(simulation.deltas.delta_affected_population).toLocaleString()} citizens</strong> from acute emergency admissions.
                </p>
              </div>
            </div>
          )}

          {/* Policy Decision Guidance */}
          <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#ff5065] font-bold">
              <ShieldAlert className="h-4 w-4 text-[#ff5065]" />
              Decision-Support Policy Recommendation
            </div>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#0e0f10] font-normal">
              {simulation.recommended_policy_action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
