'use client';

import React, { useState } from 'react';
import {
  History,
  Calendar,
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Shield,
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Institutional Heatwave Memory & Historical Benchmarking
            </h2>
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
              Disaster Risk Memory
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Compare active conditions in <span className="font-semibold text-white">{currentCity}</span> against landmark modern Indian heatwaves to evaluate severity, cumulative exposure, and lessons learned.
          </p>
        </div>

        {/* Severity Percentile Badge */}
        <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-3.5 text-left sm:text-right w-full sm:w-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
            Historical Severity Percentile
          </div>
          <div className="font-mono text-2xl font-black text-indigo-400">
            {comparison.historical_severity_percentile}th %ile
          </div>
          <div className="text-[10px] text-slate-300">
            Ranked against major Indian heatwaves
          </div>
        </div>
      </div>

      {/* Benchmark Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Select Historical Benchmark Event:
        </span>
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
          {HISTORICAL_BENCHMARKS.map((bench: HistoricalHeatEvent) => (
            <button
              key={bench.id}
              onClick={() => setSelectedBenchmarkId(bench.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                selectedBenchmarkId === bench.id
                  ? 'border-indigo-400 bg-indigo-500/20 text-white shadow'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
              }`}
            >
              {bench.event_name.split(' ')[0]} {bench.event_name.split(' ')[1]} ({bench.year})
            </button>
          ))}
        </div>
      </div>

      {/* Comparative Synthesis Narrative */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <BookOpen className="h-4 w-4" />
          Comparative Analysis & Institutional Context
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">
          {comparison.comparison_narrative}
        </p>
      </div>

      {/* Detailed Side-by-Side Comparison Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/90 shadow-xl">
        <div className="border-b border-slate-800 p-4">
          <h3 className="font-bold text-white">
            Current Scenario vs {comparison.benchmark.event_name}
          </h3>
          <p className="text-xs text-slate-400">
            Region impacted: {comparison.benchmark.primary_regions.join(', ')} • Period: {comparison.benchmark.month_span}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-3.5">Metric</th>
                <th className="p-3.5 text-amber-400">Current Observation ({currentCity})</th>
                <th className="p-3.5 text-indigo-300">Historical Benchmark ({comparison.benchmark.year})</th>
                <th className="p-3.5 text-slate-300">Difference</th>
                <th className="p-3.5 text-slate-300">All-Time Indian Record</th>
                <th className="p-3.5">Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {comparison.comparison_table.map((row) => (
                <tr key={row.metric_name} className="hover:bg-slate-850/50 transition">
                  <td className="p-3.5 font-bold text-white">{row.metric_name}</td>
                  <td className="p-3.5 font-mono font-black text-amber-300">
                    {row.current_event_value}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-indigo-200">
                    {row.benchmark_event_value}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-200">
                    {row.difference_vs_benchmark}
                  </td>
                  <td className="p-3.5 text-slate-400">
                    <strong className="text-slate-200">{row.historical_max_value}</strong>
                    <div className="text-[10px] text-slate-500">{row.historical_record_holder}</div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-300">{row.significance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Lesson Learned Box */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
          <Award className="h-4 w-4" />
          Lesson Learned from {comparison.benchmark.event_name}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-indigo-200">
          {comparison.benchmark.institutional_lessons_learned}
        </p>
        <p className="mt-2 text-[11px] text-slate-400">
          Synoptic Trigger: {comparison.benchmark.meteorological_synoptic_cause}
        </p>
      </div>
    </div>
  );
}
