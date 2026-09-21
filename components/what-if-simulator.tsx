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
    green: 'rounded-full border border-[#222222]/8 bg-[#daf7ee] text-[#1b4332] font-mono text-[10px] uppercase tracking-[0.025em] px-2.5 py-0.5 shadow-none',
    yellow: 'rounded-full border border-[#222222]/8 bg-[#ffe9cf] text-[#854d0e] font-mono text-[10px] uppercase tracking-[0.025em] px-2.5 py-0.5 shadow-none',
    orange: 'rounded-full border border-[#222222]/8 bg-[#fce0ee] text-[#831843] font-mono text-[10px] uppercase tracking-[0.025em] px-2.5 py-0.5 shadow-none',
    red: 'rounded-full border border-[#222222]/8 bg-[#fdebf7] text-[#574853] font-mono text-[10px] uppercase tracking-[0.025em] px-2.5 py-0.5 shadow-none',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner — Hume AI Scientific Instrument Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#222222]/8 bg-white p-6 sm:p-7">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fdebf7] text-[#574853] border border-[#222222]/8">
              <Sliders className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-medium tracking-[-0.025em] text-[#222222]">
              What-If? Heat Scenario & Intervention Simulator
            </h2>
            <span className="rounded-full border border-[#222222]/8 bg-[#fff9f3] px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
              Core Differentiator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#7a7876] leading-relaxed">
            Test policy interventions (shift work hours, activate misting centers) in <span className="text-[#222222] font-medium">{currentCity}</span> and evaluate the reduction in human heat risk in real time.
          </p>
        </div>
        <button
          onClick={resetDeltas}
          className="flex items-center gap-1.5 rounded-full border border-[#222222]/10 bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.025em] font-medium text-[#222222] transition hover:bg-[#fff9f3] shadow-none shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5 text-[#7a7876]" />
          Reset Baseline
        </button>
      </div>

      {/* Authority Interventions Preset Bar */}
      <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876] block">
              Authority Intervention Presets
            </span>
            <h3 className="text-sm font-medium text-[#222222] mt-0.5 tracking-[-0.025em]">
              One-Click Municipal Action Testing
            </h3>
            <p className="text-xs text-[#7a7876]">
              Click an authority action to test how rapid interventions mitigate population risk:
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={applyWorkShiftIntervention}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.025em] transition-all ${
                workerExposure < 1
                  ? 'bg-[#222222] text-white font-medium'
                  : 'border border-[#222222]/10 bg-white text-[#222222] hover:bg-[#fff9f3]'
              }`}
            >
              Shift Work (11am–4pm)
            </button>
            <button
              onClick={applyCoolingCenterIntervention}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.025em] transition-all ${
                vulnShift < 0
                  ? 'bg-[#222222] text-white font-medium'
                  : 'border border-[#222222]/10 bg-white text-[#222222] hover:bg-[#fff9f3]'
              }`}
            >
              Open 25 Shelters (-20%)
            </button>
            <button
              onClick={applyCombinedIntervention}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.025em] transition-all ${
                workerExposure < 1 && vulnShift < 0
                  ? 'bg-[#222222] text-white font-medium'
                  : 'border border-[#222222]/10 bg-white text-[#222222] hover:bg-[#fff9f3]'
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
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-6 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-[#222222]/8 pb-3.5">
            <h3 className="font-medium text-[#222222] text-sm tracking-[-0.025em]">Simulation Parameters</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">Live Recalculation</span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Temperature Delta */}
            <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[#222222]">
                  <Flame className="h-3.5 w-3.5 text-[#ffb760]" />
                  Temperature Shift (&Delta;T)
                </span>
                <span className="font-mono font-medium text-[#222222]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-[#222222]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.025em] text-[#7a7876] mt-1.5">
                <span>-5°C (Cooling)</span>
                <span>0°C (Baseline)</span>
                <span>+6°C (Severe)</span>
              </div>
            </div>

            {/* Humidity Delta */}
            <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[#222222]">
                  <Droplets className="h-3.5 w-3.5 text-[#c094e4]" />
                  Relative Humidity Shift (&Delta;RH)
                </span>
                <span className="font-mono font-medium text-[#222222]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-[#222222]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.025em] text-[#7a7876] mt-1.5">
                <span>-30% (Dry)</span>
                <span>0% (Observed)</span>
                <span>+30% (Moist)</span>
              </div>
            </div>

            {/* Solar Radiation Delta */}
            <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[#222222]">
                  <Sun className="h-3.5 w-3.5 text-[#ffb760]" />
                  Solar Radiation (&Delta;Solar)
                </span>
                <span className="font-mono font-medium text-[#222222]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-[#222222]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.025em] text-[#7a7876] mt-1.5">
                <span>-300 (Cloudy)</span>
                <span>0 (Observed)</span>
                <span>+400 (Peak noon)</span>
              </div>
            </div>

            {/* Wind Speed Delta */}
            <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[#222222]">
                  <Wind className="h-3.5 w-3.5 text-[#1b4332]" />
                  Wind Speed Shift (&Delta;Wind)
                </span>
                <span className="font-mono font-medium text-[#222222]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-[#222222]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.025em] text-[#7a7876] mt-1.5">
                <span>-15 km/h (Stagnant)</span>
                <span>0 km/h</span>
                <span>+25 km/h (Breeze)</span>
              </div>
            </div>

            {/* Worker Exposure Factor */}
            <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[#222222]">
                  <Users className="h-3.5 w-3.5 text-[#c094e4]" />
                  Outdoor Worker Exposure
                </span>
                <span className="font-mono font-medium text-[#c094e4]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-[#222222]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.025em] text-[#7a7876] mt-1.5">
                <span>0.5x (Shifted)</span>
                <span>1.0x (Standard)</span>
                <span>1.8x (Peak)</span>
              </div>
            </div>

            {/* Vulnerability Shift */}
            <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[#222222]">
                  <ShieldAlert className="h-3.5 w-3.5 text-[#831843]" />
                  Demographic Vulnerability Shift
                </span>
                <span className="font-mono font-medium text-[#831843]">
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
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-[#222222]"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.025em] text-[#7a7876] mt-1.5">
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
            <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
              <div className="flex items-center justify-between border-b border-[#222222]/8 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
                  Baseline (Observed)
                </span>
                <span className={alertBadgeColor[simulation.baseline.alert_color]}>
                  {simulation.baseline.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#7a7876]">Dry-Bulb Temp</span>
                  <span className="font-mono text-base font-medium text-[#222222]">
                    {simulation.baseline.thermal.temperature_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#7a7876]">Heat Index (NOAA)</span>
                  <span className="font-mono text-base font-medium text-[#222222]">
                    {simulation.baseline.thermal.heat_index_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#7a7876]">WBGT (Outdoor)</span>
                  <span className="font-mono text-base font-medium text-[#222222]">
                    {simulation.baseline.thermal.wbgt_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#7a7876]">UTCI Bioclimate</span>
                  <span className="font-mono text-base font-medium text-[#222222]">
                    {simulation.baseline.thermal.utci_c}°C
                  </span>
                </div>
                <div className="border-t border-[#222222]/8 pt-2.5 flex items-baseline justify-between">
                  <span className="text-xs font-medium text-[#222222]">Human Thermal Stress</span>
                  <span className="font-mono text-xl font-medium text-[#c094e4]">
                    {simulation.baseline.thermal.htss_score}/100
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-[#7a7876]">
                  <span>Exposed Population</span>
                  <span className="font-mono font-medium text-[#222222]">
                    ~{simulation.baseline.affected_population.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario Card */}
            <div className={`rounded-2xl border p-5 ${simulation.deltas.alert_escalated ? 'border-[#222222]/8 bg-[#fce0ee]' : 'border-[#222222]/8 bg-white'}`}>
              <div className="flex items-center justify-between border-b border-[#222222]/8 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.025em] text-[#222222]">
                  What-If Scenario
                </span>
                <span className={alertBadgeColor[simulation.scenario.alert_color]}>
                  {simulation.scenario.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#7a7876]">Dry-Bulb Temp</span>
                  <span className="font-mono text-base font-medium text-[#222222]">
                    {simulation.scenario.thermal.temperature_c}°C
                    <span className="ml-1 text-xs font-normal text-[#7a7876]">
                      ({simulation.deltas.delta_temp >= 0 ? `+${simulation.deltas.delta_temp}` : simulation.deltas.delta_temp})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#7a7876]">Heat Index (NOAA)</span>
                  <span className="font-mono text-base font-medium text-[#222222]">
                    {simulation.scenario.thermal.heat_index_c}°C
                    <span className="ml-1 text-xs font-normal text-[#7a7876]">
                      ({simulation.deltas.delta_heat_index >= 0 ? `+${simulation.deltas.delta_heat_index}` : simulation.deltas.delta_heat_index})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#7a7876]">WBGT (Outdoor)</span>
                  <span className="font-mono text-base font-medium text-[#222222]">
                    {simulation.scenario.thermal.wbgt_c}°C
                    <span className="ml-1 text-xs font-normal text-[#7a7876]">
                      ({simulation.deltas.delta_wbgt >= 0 ? `+${simulation.deltas.delta_wbgt}` : simulation.deltas.delta_wbgt})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#7a7876]">UTCI Bioclimate</span>
                  <span className="font-mono text-base font-medium text-[#222222]">
                    {simulation.scenario.thermal.utci_c}°C
                    <span className="ml-1 text-xs font-normal text-[#7a7876]">
                      ({simulation.deltas.delta_utci >= 0 ? `+${simulation.deltas.delta_utci}` : simulation.deltas.delta_utci})
                    </span>
                  </span>
                </div>
                <div className="border-t border-[#222222]/8 pt-2.5 flex items-baseline justify-between">
                  <span className="text-xs font-medium text-[#222222]">Human Thermal Stress</span>
                  <span className="font-mono text-xl font-medium text-[#c094e4]">
                    {simulation.scenario.thermal.htss_score}/100
                    <span className={`ml-1.5 text-xs font-mono font-medium ${simulation.deltas.delta_htss > 0 ? 'text-[#831843]' : 'text-[#1b4332]'}`}>
                      ({simulation.deltas.delta_htss >= 0 ? `+${simulation.deltas.delta_htss}` : simulation.deltas.delta_htss})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-[#7a7876]">
                  <span>Exposed Population</span>
                  <span className="font-mono font-medium text-[#222222]">
                    ~{simulation.scenario.affected_population.toLocaleString()}
                    <span className={`ml-1 text-xs font-mono ${simulation.deltas.delta_affected_population > 0 ? 'text-[#831843]' : 'text-[#1b4332]'}`}>
                      ({simulation.deltas.delta_affected_population >= 0 ? `+${simulation.deltas.delta_affected_population.toLocaleString()}` : simulation.deltas.delta_affected_population.toLocaleString()})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Escalation Alert Banner */}
          {simulation.deltas.alert_escalated && (
            <div className="flex items-start gap-3 rounded-2xl border border-[#222222]/8 bg-[#fce0ee] p-5 text-[#831843]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#831843]" />
              <div>
                <h4 className="font-medium text-[#831843] text-sm tracking-[-0.025em]">
                  Alert Level Escalated: {simulation.baseline.risk_category} &rarr; {simulation.scenario.risk_category}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#831843]/90">
                  {simulation.narrative_summary}
                </p>
              </div>
            </div>
          )}

          {/* Expected Risk Reduction Card */}
          {(simulation.deltas.delta_affected_population < 0 || simulation.deltas.delta_risk_score < 0) && (
            <div className="flex items-start gap-3 rounded-2xl border border-[#222222]/8 bg-[#daf7ee] p-5 text-[#1b4332]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1b4332]" />
              <div>
                <h4 className="font-medium text-[#1b4332] text-sm tracking-[-0.025em]">
                  Expected Human Risk Reduction Achieved
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#1b4332]/90">
                  Targeted municipal intervention successfully reduces exposed population heat stress by{' '}
                  <strong className="font-mono font-medium">{Math.abs(simulation.deltas.delta_risk_score).toFixed(1)} risk points</strong>, shielding an estimated{' '}
                  <strong className="font-mono font-medium">~{Math.abs(simulation.deltas.delta_affected_population).toLocaleString()} citizens</strong> from acute emergency admissions.
                </p>
              </div>
            </div>
          )}

          {/* Policy Decision Guidance */}
          <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.025em] text-[#574853]">
              <ShieldAlert className="h-4 w-4 text-[#c094e4]" />
              Decision-Support Policy Recommendation
            </div>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#222222] font-normal">
              {simulation.recommended_policy_action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
