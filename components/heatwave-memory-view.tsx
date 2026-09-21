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
      {/* Top Banner — Hume AI Scientific Instrument Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#222222]/8 bg-white p-6 sm:p-7">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fdebf7] text-[#574853] border border-[#222222]/8">
              <History className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-medium tracking-[-0.025em] text-[#222222]">
              Institutional Heatwave Memory: {currentCity}
            </h2>
            <span className="rounded-full border border-[#222222]/8 bg-[#fff9f3] px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
              Historical Benchmark Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#7a7876] leading-relaxed">
            Compare active conditions in <span className="text-[#222222] font-medium">{currentCity}</span> against landmark modern Indian heatwaves to evaluate severity, cumulative exposure, and lessons learned.
          </p>
        </div>

        {/* Severity Percentile Badge */}
        <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4 text-left sm:text-right w-full sm:w-auto shrink-0">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876]">
            Historical Severity
          </div>
          <div className="font-mono text-2xl font-medium text-[#c094e4] mt-0.5">
            {comparison.historical_severity_percentile}th %ile
          </div>
          <div className="font-mono text-[10.5px] text-[#7a7876] mt-0.5">
            Ranked against major Indian events
          </div>
        </div>
      </div>

      {/* Benchmark Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4 sm:p-5">
        <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.025em] text-[#7a7876]">
          Historical Benchmark:
        </span>
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
          {HISTORICAL_BENCHMARKS.map((bench: HistoricalHeatEvent) => (
            <button
              key={bench.id}
              onClick={() => setSelectedBenchmarkId(bench.id)}
              className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.025em] transition-all ${
                selectedBenchmarkId === bench.id
                  ? 'bg-[#222222] text-white font-medium shadow-none'
                  : 'border border-[#222222]/10 bg-white text-[#222222] hover:bg-stone-50'
              }`}
            >
              {bench.event_name.split(' ')[0]} {bench.event_name.split(' ')[1]} ({bench.year})
            </button>
          ))}
        </div>
      </div>

      {/* Comparative Synthesis Narrative */}
      <div className="rounded-2xl border border-[#222222]/8 bg-white p-6">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.025em] text-[#574853]">
          <BookOpen className="h-4 w-4 text-[#c094e4]" />
          Comparative Analysis & Institutional Context
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#222222] font-normal">
          {comparison.comparison_narrative}
        </p>
      </div>

      {/* Detailed Side-by-Side Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-[#222222]/8 bg-white">
        <div className="border-b border-[#222222]/8 p-5">
          <h3 className="font-medium text-[#222222] text-base tracking-[-0.025em]">
            Current Scenario vs {comparison.benchmark.event_name}
          </h3>
          <p className="text-xs text-[#7a7876] mt-0.5">
            Region impacted: {comparison.benchmark.primary_regions.join(', ')} &middot; Period: {comparison.benchmark.month_span}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#222222]/8 bg-[#fff9f3] font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
              <tr>
                <th className="p-4">Metric</th>
                <th className="p-4 text-[#854d0e]">Current ({currentCity})</th>
                <th className="p-4 text-[#574853]">Historical ({comparison.benchmark.year})</th>
                <th className="p-4 text-[#222222]">Difference</th>
                <th className="p-4 text-[#7a7876]">All-Time Record</th>
                <th className="p-4">Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]/6">
              {comparison.comparison_table.map((row) => (
                <tr key={row.metric_name} className="hover:bg-[#fff9f3]/60 transition">
                  <td className="p-4 font-medium text-[#222222]">{row.metric_name}</td>
                  <td className="p-4 font-mono font-medium text-[#854d0e]">
                    {row.current_event_value}
                  </td>
                  <td className="p-4 font-mono font-medium text-[#574853]">
                    {row.benchmark_event_value}
                  </td>
                  <td className="p-4 font-mono font-medium text-[#222222]">
                    {row.difference_vs_benchmark}
                  </td>
                  <td className="p-4 text-[#7a7876]">
                    <strong className="text-[#222222] font-mono font-medium">{row.historical_max_value}</strong>
                    <div className="font-mono text-[9.5px] text-[#7a7876]">{row.historical_record_holder}</div>
                  </td>
                  <td className="p-4 text-[#7a7876]">{row.significance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Lesson Learned Box */}
      <div className="rounded-2xl border border-[#222222]/8 bg-[#fdebf7]/50 p-6">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.025em] text-[#574853]">
          <Award className="h-4 w-4 text-[#c094e4]" />
          Lesson Learned from {comparison.benchmark.event_name}
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#574853]">
          {comparison.benchmark.institutional_lessons_learned}
        </p>
        <p className="mt-2 font-mono text-[10.5px] text-[#7a7876]">
          Synoptic Trigger: {comparison.benchmark.meteorological_synoptic_cause}
        </p>
      </div>
    </div>
  );
}
