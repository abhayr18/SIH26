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
      {/* Top Banner — Contrast Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#0e0f10]/6 bg-white p-6 sm:p-7 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffe9eb] text-[#ff5065] border border-[#ff5065]/20">
              <History className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0e0f10]">
              Institutional Heatwave Memory: {currentCity}
            </h2>
            <span className="rounded-full border border-[#ff5065]/20 bg-[#ffe9eb] px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#ff5065] font-semibold">
              Historical Benchmark Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Compare active conditions in <span className="text-[#0e0f10] font-semibold">{currentCity}</span> against landmark modern Indian heatwaves to evaluate severity, cumulative exposure, and lessons learned.
          </p>
        </div>

        {/* Severity Percentile Badge */}
        <div className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4 text-left sm:text-right w-full sm:w-auto shrink-0">
          <div className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] font-medium">
            Historical Severity
          </div>
          <div className="font-mono text-2xl font-bold text-[#ff5065] mt-0.5">
            {comparison.historical_severity_percentile}th %ile
          </div>
          <div className="font-mono text-[10.5px] text-[#666666] mt-0.5">
            Ranked against major Indian events
          </div>
        </div>
      </div>

      {/* Benchmark Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4 sm:p-5 shadow-[0_5px_25px_rgba(38,42,62,0.04)]">
        <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#666666]">
          Historical Benchmark:
        </span>
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
          {HISTORICAL_BENCHMARKS.map((bench: HistoricalHeatEvent) => (
            <button
              key={bench.id}
              onClick={() => setSelectedBenchmarkId(bench.id)}
              className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
                selectedBenchmarkId === bench.id
                  ? 'bg-[#ff5065] text-white font-bold shadow-none'
                  : 'border border-[#0e0f10]/10 bg-white text-[#0e0f10] hover:bg-neutral-100 font-medium'
              }`}
            >
              {bench.event_name.split(' ')[0]} {bench.event_name.split(' ')[1]} ({bench.year})
            </button>
          ))}
        </div>
      </div>

      {/* Comparative Synthesis Narrative */}
      <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-6 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#ff5065] font-bold">
          <BookOpen className="h-4 w-4 text-[#ff5065]" />
          Comparative Analysis & Institutional Context
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#0e0f10] font-normal">
          {comparison.comparison_narrative}
        </p>
      </div>

      {/* Detailed Side-by-Side Comparison Table */}
      <div className="overflow-hidden rounded-3xl border border-[#0e0f10]/6 bg-white shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="border-b border-[#0e0f10]/6 p-5">
          <h3 className="font-bold text-[#0e0f10] text-base tracking-tight">
            Current Scenario vs {comparison.benchmark.event_name}
          </h3>
          <p className="text-xs text-[#666666] mt-0.5">
            Region impacted: {comparison.benchmark.primary_regions.join(', ')} &middot; Period: {comparison.benchmark.month_span}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#0e0f10]/6 bg-[#f4f4f8] font-mono text-[10px] uppercase tracking-wider text-[#666666]">
              <tr>
                <th className="p-4">Metric</th>
                <th className="p-4 text-[#ff5065]">Current ({currentCity})</th>
                <th className="p-4 text-[#0e0f10]">Historical ({comparison.benchmark.year})</th>
                <th className="p-4 text-[#0e0f10]">Difference</th>
                <th className="p-4 text-[#666666]">All-Time Record</th>
                <th className="p-4">Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0e0f10]/6">
              {comparison.comparison_table.map((row) => (
                <tr key={row.metric_name} className="hover:bg-[#f4f4f8]/60 transition">
                  <td className="p-4 font-bold text-[#0e0f10]">{row.metric_name}</td>
                  <td className="p-4 font-mono font-bold text-[#ff5065]">
                    {row.current_event_value}
                  </td>
                  <td className="p-4 font-mono font-medium text-[#0e0f10]">
                    {row.benchmark_event_value}
                  </td>
                  <td className="p-4 font-mono font-bold text-[#0e0f10]">
                    {row.difference_vs_benchmark}
                  </td>
                  <td className="p-4 text-[#666666]">
                    <strong className="text-[#0e0f10] font-mono font-bold">{row.historical_max_value}</strong>
                    <div className="font-mono text-[9.5px] text-[#666666]">{row.historical_record_holder}</div>
                  </td>
                  <td className="p-4 text-[#666666]">{row.significance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Lesson Learned Box */}
      <div className="rounded-3xl border border-[#ff5065]/20 bg-[#ffe9eb]/40 p-6 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#ff5065] font-bold">
          <Award className="h-4 w-4 text-[#ff5065]" />
          Lesson Learned from {comparison.benchmark.event_name}
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#0e0f10]">
          {comparison.benchmark.institutional_lessons_learned}
        </p>
        <p className="mt-2 font-mono text-[10.5px] text-[#666666]">
          Synoptic Trigger: {comparison.benchmark.meteorological_synoptic_cause}
        </p>
      </div>
    </div>
  );
}
