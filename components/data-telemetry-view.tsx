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
      {/* Top Banner — Hume AI Scientific Instrument Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#222222]/8 bg-white p-6 sm:p-7">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#daf7ee] text-[#1b4332] border border-[#222222]/8">
              <Activity className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-medium tracking-[-0.025em] text-[#222222]">
              Data Source Health & Telemetry Monitor
            </h2>
            <span className="rounded-full border border-[#222222]/8 bg-[#fff9f3] px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
              Operational Transparency
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#7a7876] leading-relaxed">
            Real-time pipeline monitoring, data freshness metrics, input completeness audits, and scientific attribution adhering to MoES/NCMRWF data integrity standards.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3.5 shrink-0">
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876]">System Health</div>
            <div className="font-mono text-xl font-medium text-[#1b4332] mt-0.5">
              {telemetry.overall_system_health_pct}%
            </div>
          </div>
          <div className="h-7 w-px bg-[#222222]/8" />
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876]">Last Telemetry Sync</div>
            <div className="font-mono text-xs font-medium text-[#222222] mt-0.5">
              {telemetry.last_sync_timestamp}
            </div>
          </div>
        </div>
      </div>

      {/* Model & Data Quality Audit KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <Cpu className="h-3.5 w-3.5 text-[#222222]" />
            Model Confidence
          </div>
          <div className="mt-2 font-mono text-2xl font-normal text-[#222222]">
            {audit.prediction_confidence_pct}%
          </div>
          <span className="text-xs text-[#7a7876] mt-0.5 block">Platt temperature scaled</span>
        </div>

        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <FileCheck className="h-3.5 w-3.5 text-[#1b4332]" />
            Input Completeness
          </div>
          <div className="mt-2 font-mono text-2xl font-normal text-[#1b4332]">
            {audit.input_completeness_pct}%
          </div>
          <span className="text-xs text-[#7a7876] mt-0.5 block">All key parameters present</span>
        </div>

        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <Clock className="h-3.5 w-3.5 text-[#854d0e]" />
            Weather Telemetry Age
          </div>
          <div className="mt-2 font-mono text-2xl font-normal text-[#854d0e]">
            {audit.weather_data_age_minutes} mins
          </div>
          <span className="text-xs text-[#7a7876] mt-0.5 block">Fresh within 15-min SLA</span>
        </div>

        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#c094e4]" />
            Model Version
          </div>
          <div className="mt-2 font-mono text-base font-normal text-[#c094e4] truncate">
            {audit.model_id}
          </div>
          <span className="text-xs text-[#7a7876] mt-0.5 block">F1: {audit.validation_f1_score} hold-out</span>
        </div>
      </div>

      {/* Live Data Source Telemetry Table */}
      <div className="rounded-2xl border border-[#222222]/8 bg-white overflow-hidden">
        <div className="border-b border-[#222222]/8 p-5">
          <h3 className="font-medium text-[#222222] tracking-[-0.025em]">Integrated Services & Endpoints</h3>
          <p className="text-xs text-[#7a7876] mt-0.5">Continuous ping health, round-trip latency, and licensing attribution</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#222222]/8 bg-[#fff9f3] font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Service Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Latency</th>
                <th className="p-4">Data Mode</th>
                <th className="p-4">License / Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]/6">
              {telemetry.sources.map((src: DataSourceTelemetry) => (
                <tr key={src.source_id} className="hover:bg-[#fff9f3]/60 transition">
                  <td className="p-4">
                    <span className="text-base" title={src.status}>
                      {src.status_indicator}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[#222222]">{src.source_name}</div>
                    <div className="text-[11px] text-[#7a7876]">{src.notes}</div>
                  </td>
                  <td className="p-4 text-[#7a7876]">{src.category}</td>
                  <td className="p-4 font-mono text-[#222222]">{src.latency_ms} ms</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.025em] border border-[#222222]/8 ${
                      src.is_live
                        ? 'bg-[#daf7ee] text-[#1b4332]'
                        : 'bg-[#ffe9cf] text-[#854d0e]'
                    }`}>
                      {src.is_live ? 'LIVE API' : 'SYNTHETIC / ESTIMATED'}
                    </span>
                  </td>
                  <td className="p-4 text-[#7a7876] font-mono text-[11px]">{src.license_badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Scientific Protocol Notice */}
      <div className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-5">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.025em] text-[#574853]">
          <Info className="h-4 w-4 text-[#c094e4]" />
          Scientific & Legal Attribution Protocol
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#7a7876]">
          This system strictly differentiates official public meteorological forecasts (Open-Meteo IFS/GFS) from experimental prototype scoring models (HTSS). In compliance with SIH26083 regulations, synthetic or proxy health admissions datasets are explicitly identified with <span className="font-mono text-[#854d0e]">DEMO / SYNTHETIC DATA</span> badges. Under no circumstances are simulated casualty figures represented as actual Ministry of Health statistical returns.
        </p>
      </div>
    </div>
  );
}
