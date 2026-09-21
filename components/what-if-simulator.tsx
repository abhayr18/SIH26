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
    green: 'rounded-full border border-[#7ffeb1] bg-[#7ffeb1] text-black font-mono text-[10px] uppercase tracking-[0.06em] px-2.5 py-0.5 font-bold',
    yellow: 'rounded-full border border-[#d9d9d9] bg-[#eeeeee] text-black font-mono text-[10px] uppercase tracking-[0.06em] px-2.5 py-0.5 font-semibold',
    orange: 'rounded-full border border-black bg-white text-black font-mono text-[10px] uppercase tracking-[0.06em] px-2.5 py-0.5 font-bold',
    red: 'rounded-full border border-black bg-black text-white font-mono text-[10px] uppercase tracking-[0.06em] px-2.5 py-0.5 font-bold',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner — DICE Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <Sliders className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-[0.06em] uppercase text-[#000000]">
              What-If? Heat Scenario & Intervention Simulator
            </h2>
            <span className="rounded-full border border-black bg-black px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white font-semibold">
              Core Differentiator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#595959] leading-relaxed tracking-[0.02em]">
            Test policy interventions (shift work hours, activate misting centers) in <span className="text-[#000000] font-semibold">{currentCity}</span> and evaluate the reduction in human heat risk in real time.
          </p>
        </div>
        <button
          onClick={resetDeltas}
          className="flex items-center gap-1.5 rounded-full border border-black bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.06em] font-bold text-black transition hover:bg-black hover:text-white shadow-none shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Baseline
        </button>
      </div>

      {/* Authority Interventions Preset Bar */}
      <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-5 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959] font-medium block">
              Authority Intervention Presets
            </span>
            <h3 className="text-sm font-bold text-[#000000] mt-0.5 tracking-[0.04em] uppercase">
              One-Click Municipal Action Testing
            </h3>
            <p className="text-xs text-[#595959]">
              Click an authority action to test how rapid interventions mitigate population risk:
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={applyWorkShiftIntervention}
              className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.06em] transition-all ${
                workerExposure < 1
                  ? 'bg-black text-white font-bold shadow-none'
                  : 'border border-black bg-white text-black hover:bg-neutral-100 font-bold'
              }`}
            >
              Shift Work (11am–4pm)
            </button>
            <button
              onClick={applyCoolingCenterIntervention}
              className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.06em] transition-all ${
                vulnShift < 0
                  ? 'bg-black text-white font-bold shadow-none'
                  : 'border border-black bg-white text-black hover:bg-neutral-100 font-bold'
              }`}
            >
              Open 25 Shelters (-20%)
            </button>
            <button
              onClick={applyCombinedIntervention}
              className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.06em] transition-all ${
                workerExposure < 1 && vulnShift < 0
                  ? 'bg-black text-[#7ffeb1] font-bold shadow-none'
                  : 'border border-black bg-white text-black hover:bg-neutral-100 font-bold'
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
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none lg:col-span-5">
          <div className="flex items-center justify-between border-b border-[#d9d9d9] pb-3.5">
            <h3 className="font-bold text-[#000000] text-sm tracking-[0.06em] uppercase">Simulation Parameters</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">Live Recalculation</span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Temperature Delta */}
            <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#000000] uppercase tracking-[0.02em]">
                  <Flame className="h-3.5 w-3.5 text-black" />
                  Temperature Shift (&Delta;T)
                </span>
                <span className="font-mono font-bold text-[#000000]">
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
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#d9d9d9] accent-black"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.06em] text-[#595959] mt-1.5">
                <span>-5°C (Cooling)</span>
                <span>0°C (Baseline)</span>
                <span>+6°C (Severe)</span>
              </div>
            </div>

            {/* Humidity Delta */}
            <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#000000] uppercase tracking-[0.02em]">
                  <Droplets className="h-3.5 w-3.5 text-black" />
                  Relative Humidity Shift (&Delta;RH)
                </span>
                <span className="font-mono font-bold text-[#000000]">
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
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#d9d9d9] accent-black"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.06em] text-[#595959] mt-1.5">
                <span>-30% (Dry)</span>
                <span>0% (Observed)</span>
                <span>+30% (Moist)</span>
              </div>
            </div>

            {/* Solar Radiation Delta */}
            <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#000000] uppercase tracking-[0.02em]">
                  <Sun className="h-3.5 w-3.5 text-black" />
                  Solar Radiation (&Delta;Solar)
                </span>
                <span className="font-mono font-bold text-[#000000]">
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
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#d9d9d9] accent-black"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.06em] text-[#595959] mt-1.5">
                <span>-300 (Cloudy)</span>
                <span>0 (Observed)</span>
                <span>+400 (Peak noon)</span>
              </div>
            </div>

            {/* Wind Speed Delta */}
            <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#000000] uppercase tracking-[0.02em]">
                  <Wind className="h-3.5 w-3.5 text-black" />
                  Wind Speed Shift (&Delta;Wind)
                </span>
                <span className="font-mono font-bold text-[#000000]">
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
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#d9d9d9] accent-black"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.06em] text-[#595959] mt-1.5">
                <span>-15 km/h (Stagnant)</span>
                <span>0 km/h</span>
                <span>+25 km/h (Breeze)</span>
              </div>
            </div>

            {/* Worker Exposure Factor */}
            <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#000000] uppercase tracking-[0.02em]">
                  <Users className="h-3.5 w-3.5 text-black" />
                  Outdoor Worker Exposure
                </span>
                <span className="font-mono font-bold text-[#000000]">
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
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#d9d9d9] accent-black"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.06em] text-[#595959] mt-1.5">
                <span>0.5x (Shifted)</span>
                <span>1.0x (Standard)</span>
                <span>1.8x (Peak)</span>
              </div>
            </div>

            {/* Vulnerability Shift */}
            <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#000000] uppercase tracking-[0.02em]">
                  <ShieldAlert className="h-3.5 w-3.5 text-black" />
                  Demographic Vulnerability Shift
                </span>
                <span className="font-mono font-bold text-[#000000]">
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
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#d9d9d9] accent-black"
              />
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.06em] text-[#595959] mt-1.5">
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
            <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
              <div className="flex items-center justify-between border-b border-[#d9d9d9] pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959] font-medium">
                  Baseline (Observed)
                </span>
                <span className={alertBadgeColor[simulation.baseline.alert_color]}>
                  {simulation.baseline.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#595959]">Dry-Bulb Temp</span>
                  <span className="font-mono text-base font-bold text-[#000000]">
                    {simulation.baseline.thermal.temperature_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#595959]">Heat Index (NOAA)</span>
                  <span className="font-mono text-base font-bold text-[#000000]">
                    {simulation.baseline.thermal.heat_index_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#595959]">WBGT (Outdoor)</span>
                  <span className="font-mono text-base font-bold text-[#000000]">
                    {simulation.baseline.thermal.wbgt_c}°C
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#595959]">UTCI Bioclimate</span>
                  <span className="font-mono text-base font-bold text-[#000000]">
                    {simulation.baseline.thermal.utci_c}°C
                  </span>
                </div>
                <div className="border-t border-[#d9d9d9] pt-2.5 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-[#000000]">Human Thermal Stress</span>
                  <span className="font-mono text-xl font-bold text-[#000000]">
                    {simulation.baseline.thermal.htss_score}/100
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-[#595959]">
                  <span>Exposed Population</span>
                  <span className="font-mono font-bold text-[#000000]">
                    ~{simulation.baseline.affected_population.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario Card */}
            <div className={`rounded-lg border p-5 shadow-none ${simulation.deltas.alert_escalated ? 'border-black bg-black text-white' : 'border-[#d9d9d9] bg-white'}`}>
              <div className={`flex items-center justify-between border-b pb-3 ${simulation.deltas.alert_escalated ? 'border-neutral-800' : 'border-[#d9d9d9]'}`}>
                <span className={`font-mono text-[10px] uppercase tracking-[0.06em] font-bold ${simulation.deltas.alert_escalated ? 'text-[#7ffeb1]' : 'text-black'}`}>
                  What-If Scenario
                </span>
                <span className={alertBadgeColor[simulation.scenario.alert_color]}>
                  {simulation.scenario.risk_category}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className={`text-xs ${simulation.deltas.alert_escalated ? 'text-neutral-400' : 'text-[#595959]'}`}>Dry-Bulb Temp</span>
                  <span className={`font-mono text-base font-bold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-[#000000]'}`}>
                    {simulation.scenario.thermal.temperature_c}°C
                    <span className={`ml-1 text-xs font-normal ${simulation.deltas.alert_escalated ? 'text-neutral-400' : 'text-[#595959]'}`}>
                      ({simulation.deltas.delta_temp >= 0 ? `+${simulation.deltas.delta_temp}` : simulation.deltas.delta_temp})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-xs ${simulation.deltas.alert_escalated ? 'text-neutral-400' : 'text-[#595959]'}`}>Heat Index (NOAA)</span>
                  <span className={`font-mono text-base font-bold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-[#000000]'}`}>
                    {simulation.scenario.thermal.heat_index_c}°C
                    <span className={`ml-1 text-xs font-normal ${simulation.deltas.alert_escalated ? 'text-neutral-400' : 'text-[#595959]'}`}>
                      ({simulation.deltas.delta_heat_index >= 0 ? `+${simulation.deltas.delta_heat_index}` : simulation.deltas.delta_heat_index})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-xs ${simulation.deltas.alert_escalated ? 'text-neutral-400' : 'text-[#595959]'}`}>WBGT (Outdoor)</span>
                  <span className={`font-mono text-base font-bold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-[#000000]'}`}>
                    {simulation.scenario.thermal.wbgt_c}°C
                    <span className={`ml-1 text-xs font-normal ${simulation.deltas.alert_escalated ? 'text-neutral-400' : 'text-[#595959]'}`}>
                      ({simulation.deltas.delta_wbgt >= 0 ? `+${simulation.deltas.delta_wbgt}` : simulation.deltas.delta_wbgt})
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-xs ${simulation.deltas.alert_escalated ? 'text-neutral-400' : 'text-[#595959]'}`}>UTCI Bioclimate</span>
                  <span className={`font-mono text-base font-bold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-[#000000]'}`}>
                    {simulation.scenario.thermal.utci_c}°C
                    <span className={`ml-1 text-xs font-normal ${simulation.deltas.alert_escalated ? 'text-neutral-400' : 'text-[#595959]'}`}>
                      ({simulation.deltas.delta_utci >= 0 ? `+${simulation.deltas.delta_utci}` : simulation.deltas.delta_utci})
                    </span>
                  </span>
                </div>
                <div className={`border-t pt-2.5 flex items-baseline justify-between ${simulation.deltas.alert_escalated ? 'border-neutral-800' : 'border-[#d9d9d9]'}`}>
                  <span className={`text-xs font-bold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-[#000000]'}`}>Human Thermal Stress</span>
                  <span className={`font-mono text-xl font-bold ${simulation.deltas.alert_escalated ? 'text-[#7ffeb1]' : 'text-[#000000]'}`}>
                    {simulation.scenario.thermal.htss_score}/100
                    <span className={`ml-1.5 text-xs font-mono font-bold ${simulation.deltas.delta_htss > 0 ? (simulation.deltas.alert_escalated ? 'text-[#7ffeb1]' : 'text-black') : 'text-neutral-400'}`}>
                      ({simulation.deltas.delta_htss >= 0 ? `+${simulation.deltas.delta_htss}` : simulation.deltas.delta_htss})
                    </span>
                  </span>
                </div>
                <div className={`flex items-baseline justify-between text-xs ${simulation.deltas.alert_escalated ? 'text-neutral-400' : 'text-[#595959]'}`}>
                  <span>Exposed Population</span>
                  <span className={`font-mono font-bold ${simulation.deltas.alert_escalated ? 'text-white' : 'text-[#000000]'}`}>
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
            <div className="flex items-start gap-3 rounded-lg border border-black bg-black p-5 text-white shadow-none">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#7ffeb1]" />
              <div>
                <h4 className="font-bold text-white text-sm tracking-[0.04em] uppercase">
                  Alert Level Escalated: {simulation.baseline.risk_category} &rarr; {simulation.scenario.risk_category}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-neutral-300">
                  {simulation.narrative_summary}
                </p>
              </div>
            </div>
          )}

          {/* Expected Risk Reduction Card */}
          {(simulation.deltas.delta_affected_population < 0 || simulation.deltas.delta_risk_score < 0) && (
            <div className="flex items-start gap-3 rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-5 text-black shadow-none">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-black" />
              <div>
                <h4 className="font-bold text-[#000000] text-sm tracking-[0.04em] uppercase">
                  Expected Human Risk Reduction Achieved
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#595959]">
                  Targeted municipal intervention successfully reduces exposed population heat stress by{' '}
                  <strong className="font-mono font-bold text-black">{Math.abs(simulation.deltas.delta_risk_score).toFixed(1)} risk points</strong>, shielding an estimated{' '}
                  <strong className="font-mono font-bold text-black">~{Math.abs(simulation.deltas.delta_affected_population).toLocaleString()} citizens</strong> from acute emergency admissions.
                </p>
              </div>
            </div>
          )}

          {/* Policy Decision Guidance */}
          <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-black font-bold">
              <ShieldAlert className="h-4 w-4 text-black" />
              Decision-Support Policy Recommendation
            </div>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#000000] font-normal tracking-[0.02em]">
              {simulation.recommended_policy_action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
