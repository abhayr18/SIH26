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
      {/* Top Banner — DICE Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <History className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-[0.06em] uppercase text-[#000000]">
              Institutional Heatwave Memory: {currentCity}
            </h2>
            <span className="rounded-full border border-black bg-black px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white font-semibold">
              Historical Benchmark Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#595959] leading-relaxed tracking-[0.02em]">
            Compare active conditions in <span className="text-[#000000] font-semibold">{currentCity}</span> against landmark modern Indian heatwaves to evaluate severity, cumulative exposure, and lessons learned.
          </p>
        </div>

        {/* Severity Percentile Badge */}
        <div className="rounded-lg border border-black bg-black text-white p-4 text-left sm:text-right w-full sm:w-auto shrink-0 shadow-none">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-neutral-400 font-medium">
            Historical Severity
          </div>
          <div className="font-mono text-2xl font-bold text-[#7ffeb1] mt-0.5">
            {comparison.historical_severity_percentile}th %ile
          </div>
          <div className="font-mono text-[10.5px] text-neutral-300 mt-0.5">
            Ranked against major Indian events
          </div>
        </div>
      </div>

      {/* Benchmark Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4 sm:p-5 shadow-none">
        <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.06em] text-black">
          Historical Benchmark:
        </span>
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
          {HISTORICAL_BENCHMARKS.map((bench: HistoricalHeatEvent) => (
            <button
              key={bench.id}
              onClick={() => setSelectedBenchmarkId(bench.id)}
              className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] transition-all ${
                selectedBenchmarkId === bench.id
                  ? 'bg-black text-white font-bold shadow-none'
                  : 'border border-black bg-white text-black hover:bg-neutral-100 font-medium'
              }`}
            >
              {bench.event_name.split(' ')[0]} {bench.event_name.split(' ')[1]} ({bench.year})
            </button>
          ))}
        </div>
      </div>

      {/* Comparative Synthesis Narrative */}
      <div className="rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-black font-bold">
          <BookOpen className="h-4 w-4 text-black" />
          Comparative Analysis & Institutional Context
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#000000] font-normal tracking-[0.02em]">
          {comparison.comparison_narrative}
        </p>
      </div>

      {/* Detailed Side-by-Side Comparison Table */}
      <div className="overflow-hidden rounded-lg border border-[#d9d9d9] bg-white shadow-none">
        <div className="border-b border-[#d9d9d9] p-5">
          <h3 className="font-bold text-[#000000] text-base tracking-[0.06em] uppercase">
            Current Scenario vs {comparison.benchmark.event_name}
          </h3>
          <p className="text-xs text-[#595959] mt-0.5 tracking-[0.02em]">
            Region impacted: {comparison.benchmark.primary_regions.join(', ')} &middot; Period: {comparison.benchmark.month_span}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#d9d9d9] bg-[#eeeeee] font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
              <tr>
                <th className="p-4">Metric</th>
                <th className="p-4 text-black">Current ({currentCity})</th>
                <th className="p-4 text-[#595959]">Historical ({comparison.benchmark.year})</th>
                <th className="p-4 text-black">Difference</th>
                <th className="p-4 text-[#595959]">All-Time Record</th>
                <th className="p-4">Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9d9d9]">
              {comparison.comparison_table.map((row) => (
                <tr key={row.metric_name} className="hover:bg-[#eeeeee] transition-colors">
                  <td className="p-4 font-bold text-[#000000] tracking-[0.02em]">{row.metric_name}</td>
                  <td className="p-4 font-mono font-bold text-black">
                    {row.current_event_value}
                  </td>
                  <td className="p-4 font-mono font-medium text-[#595959]">
                    {row.benchmark_event_value}
                  </td>
                  <td className="p-4 font-mono font-bold text-black">
                    {row.difference_vs_benchmark}
                  </td>
                  <td className="p-4 text-[#595959]">
                    <strong className="text-black font-mono font-bold">{row.historical_max_value}</strong>
                    <div className="font-mono text-[9.5px] text-[#595959]">{row.historical_record_holder}</div>
                  </td>
                  <td className="p-4 text-[#595959]">{row.significance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Lesson Learned Box */}
      <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-6 shadow-none">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-black font-bold">
          <Award className="h-4 w-4 text-black" />
          Lesson Learned from {comparison.benchmark.event_name}
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#000000] tracking-[0.02em]">
          {comparison.benchmark.institutional_lessons_learned}
        </p>
        <p className="mt-2 font-mono text-[10.5px] text-[#595959]">
          Synoptic Trigger: {comparison.benchmark.meteorological_synoptic_cause}
        </p>
      </div>
    </div>
  );
}
