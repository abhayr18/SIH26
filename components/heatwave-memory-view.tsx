'use client';

import React, { useState } from 'react';
import {
  History,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  HISTORICAL_BENCHMARKS,
  compareCurrentAgainstHistorical,
  HistoricalHeatEvent,
} from '@/lib/history-memory';

interface HeatwaveMemoryViewProps {
  currentCity: string;
  currentTemp: number;
  currentHtss?: number;
  currentWbgt?: number;
  currentDurationDays?: number;
}

export function HeatwaveMemoryView({
  currentCity,
  currentTemp,
  currentHtss = 86,
  currentWbgt = 32.4,
  currentDurationDays = 4,
}: HeatwaveMemoryViewProps) {
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>('HW-2024-NORTH');

  const comparison = compareCurrentAgainstHistorical(
    currentCity,
    currentTemp,
    currentHtss,
    currentWbgt,
    currentDurationDays,
    selectedBenchmarkId
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner — Copernicus Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shadow-xs">
              <History className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Institutional Heatwave Memory: {currentCity}
            </h2>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 font-mono text-[11px] uppercase tracking-wider text-blue-700 font-semibold">
              Historical Benchmark Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Compare active conditions in <span className="text-slate-900 font-semibold">{currentCity}</span> against landmark modern Indian heatwaves to evaluate severity, cumulative exposure, and lessons learned.
          </p>
        </div>

        {/* Severity Percentile Badge — Deep Palantir Slate HUD */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 text-white p-4 text-left sm:text-right w-full sm:w-auto shrink-0 shadow-md">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            Historical Severity
          </div>
          <div className="font-mono text-2xl font-bold text-cyan-400 mt-0.5">
            {comparison.historical_severity_percentile}th %ile
          </div>
          <div className="font-mono text-[11px] text-slate-300 mt-0.5">
            Ranked against major Indian events
          </div>
        </div>
      </div>

      {/* Benchmark Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-4 sm:p-5 shadow-xs">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
          Historical Benchmark:
        </span>
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
          {HISTORICAL_BENCHMARKS.map((bench: HistoricalHeatEvent) => (
            <button
              key={bench.id}
              onClick={() => setSelectedBenchmarkId(bench.id)}
              className={`rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                selectedBenchmarkId === bench.id
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-medium shadow-2xs'
              }`}
            >
              {bench.event_name.split(' ')[0]} {bench.event_name.split(' ')[1]} ({bench.year})
            </button>
          ))}
        </div>
      </div>

      {/* Comparative Synthesis Narrative */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-900 font-bold">
          <BookOpen className="h-4 w-4 text-blue-600" />
          Comparative Analysis & Institutional Context
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700">
          {comparison.comparison_narrative}
        </p>
      </div>

      {/* Detailed Side-by-Side Comparison Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
        <div className="border-b border-slate-100 p-5">
          <h3 className="font-bold text-slate-900 text-base tracking-tight">
            Current Scenario vs {comparison.benchmark.event_name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Region impacted: {comparison.benchmark.primary_regions.join(', ')} &middot; Period: {comparison.benchmark.month_span}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-mono text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4">Metric</th>
                <th className="p-4 text-slate-900">Current ({currentCity})</th>
                <th className="p-4 text-slate-500">Historical ({comparison.benchmark.year})</th>
                <th className="p-4 text-slate-900">Difference</th>
                <th className="p-4 text-slate-500">All-Time Record</th>
                <th className="p-4">Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparison.comparison_table.map((row) => (
                <tr key={row.metric_name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">{row.metric_name}</td>
                  <td className="p-4 font-mono font-bold text-slate-900">
                    {row.current_event_value}
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-500">
                    {row.benchmark_event_value}
                  </td>
                  <td className="p-4 font-mono font-bold text-blue-600">
                    {row.difference_vs_benchmark}
                  </td>
                  <td className="p-4 text-slate-600">
                    <strong className="text-slate-900 font-mono font-bold">{row.historical_max_value}</strong>
                    <div className="font-mono text-[10px] text-slate-400">{row.historical_record_holder}</div>
                  </td>
                  <td className="p-4 text-slate-600">{row.significance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Lesson Learned Box */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-6 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-900 font-bold">
          <Award className="h-4 w-4 text-blue-700" />
          Lesson Learned from {comparison.benchmark.event_name}
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700">
          {comparison.benchmark.institutional_lessons_learned}
        </p>
        <p className="mt-2 font-mono text-[11px] text-slate-500">
          Synoptic Trigger: {comparison.benchmark.meteorological_synoptic_cause}
        </p>
      </div>
    </div>
  );
}
