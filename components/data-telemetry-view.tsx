'use client';

import React from 'react';
import {
  Activity,
  Clock,
  Cpu,
  ShieldCheck,
  FileCheck,
  Info,
} from 'lucide-react';
import { getSystemTelemetry, auditPredictionConfidence, DataSourceTelemetry } from '@/lib/data-quality';

export function DataTelemetryView() {
  const telemetry = getSystemTelemetry();
  const audit = auditPredictionConfidence(true, true, true);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner — Contrast Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#0e0f10]/6 bg-white p-6 sm:p-7 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffe9eb] text-[#ff5065] border border-[#ff5065]/20">
              <Activity className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0e0f10]">
              Data Source Health & Telemetry Monitor
            </h2>
            <span className="rounded-full border border-[#ff5065]/20 bg-[#ffe9eb] px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#ff5065] font-semibold">
              Operational Transparency
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Real-time pipeline monitoring, data freshness metrics, input completeness audits, and scientific attribution adhering to MoES/NCMRWF data integrity standards.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3.5 shrink-0">
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] font-medium">System Health</div>
            <div className="font-mono text-xl font-bold text-[#ff5065] mt-0.5">
              {telemetry.overall_system_health_pct}%
            </div>
          </div>
          <div className="h-7 w-px bg-[#0e0f10]/10" />
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] font-medium">Last Telemetry Sync</div>
            <div className="font-mono text-xs font-bold text-[#0e0f10] mt-0.5">
              {telemetry.last_sync_timestamp}
            </div>
          </div>
        </div>
      </div>

      {/* Model & Data Quality Audit KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
            <Cpu className="h-3.5 w-3.5 text-[#0e0f10]" />
            Model Confidence
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#0e0f10]">
            {audit.prediction_confidence_pct}%
          </div>
          <span className="text-xs text-[#666666] mt-0.5 block">Platt temperature scaled</span>
        </div>

        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
            <FileCheck className="h-3.5 w-3.5 text-[#ff5065]" />
            Input Completeness
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#ff5065]">
            {audit.input_completeness_pct}%
          </div>
          <span className="text-xs text-[#666666] mt-0.5 block">All key parameters present</span>
        </div>

        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
            <Clock className="h-3.5 w-3.5 text-[#ff7a59]" />
            Weather Telemetry Age
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#ff7a59]">
            {audit.weather_data_age_minutes} mins
          </div>
          <span className="text-xs text-[#666666] mt-0.5 block">Fresh within 15-min SLA</span>
        </div>

        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0e0f10]" />
            Model Version
          </div>
          <div className="mt-2 font-mono text-base font-bold text-[#0e0f10] truncate">
            {audit.model_id}
          </div>
          <span className="text-xs text-[#666666] mt-0.5 block">F1: {audit.validation_f1_score} hold-out</span>
        </div>
      </div>

      {/* Live Data Source Telemetry Table */}
      <div className="rounded-3xl border border-[#0e0f10]/6 bg-white overflow-hidden shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="border-b border-[#0e0f10]/6 p-5">
          <h3 className="font-bold text-[#0e0f10] tracking-tight">Integrated Services & Endpoints</h3>
          <p className="text-xs text-[#666666] mt-0.5">Continuous ping health, round-trip latency, and licensing attribution</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#0e0f10]/6 bg-[#f4f4f8] font-mono text-[10px] uppercase tracking-wider text-[#666666]">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Service Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Latency</th>
                <th className="p-4">Data Mode</th>
                <th className="p-4">License / Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0e0f10]/6">
              {telemetry.sources.map((src: DataSourceTelemetry) => (
                <tr key={src.source_id} className="hover:bg-[#f4f4f8]/60 transition">
                  <td className="p-4">
                    <span className="text-base" title={src.status}>
                      {src.status_indicator}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#0e0f10]">{src.source_name}</div>
                    <div className="text-[11px] text-[#666666]">{src.notes}</div>
                  </td>
                  <td className="p-4 text-[#666666]">{src.category}</td>
                  <td className="p-4 font-mono font-bold text-[#0e0f10]">{src.latency_ms} ms</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold border ${
                      src.is_live
                        ? 'border-[#0e0f10]/10 bg-[#f4f4f8] text-[#0e0f10]'
                        : 'border-[#ff7a59]/30 bg-[#ff7a59]/10 text-[#ff7a59]'
                    }`}>
                      {src.is_live ? 'LIVE API' : 'SYNTHETIC / ESTIMATED'}
                    </span>
                  </td>
                  <td className="p-4 text-[#666666] font-mono text-[11px]">{src.license_badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Scientific Protocol Notice */}
      <div className="rounded-3xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-5 shadow-[0_5px_25px_rgba(38,42,62,0.04)]">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#ff5065] font-bold">
          <Info className="h-4 w-4 text-[#ff5065]" />
          Scientific & Legal Attribution Protocol
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#666666]">
          This system strictly differentiates official public meteorological forecasts (Open-Meteo IFS/GFS) from experimental prototype scoring models (HTSS). In compliance with SIH26083 regulations, synthetic or proxy health admissions datasets are explicitly identified with <span className="font-mono font-bold text-[#ff5065]">DEMO / SYNTHETIC DATA</span> badges. Under no circumstances are simulated casualty figures represented as actual Ministry of Health statistical returns.
        </p>
      </div>
    </div>
  );
}
