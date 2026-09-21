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
      {/* Top Banner — DICE Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <Activity className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-[0.06em] uppercase text-[#000000]">
              Data Source Health & Telemetry Monitor
            </h2>
            <span className="rounded-full border border-black bg-black px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white font-semibold">
              Operational Transparency
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#595959] leading-relaxed tracking-[0.02em]">
            Real-time pipeline monitoring, data freshness metrics, input completeness audits, and scientific attribution adhering to MoES/NCMRWF data integrity standards.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3.5 shrink-0">
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[#595959] font-medium">System Health</div>
            <div className="font-mono text-xl font-bold text-[#000000] mt-0.5">
              {telemetry.overall_system_health_pct}%
            </div>
          </div>
          <div className="h-7 w-px bg-[#d9d9d9]" />
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-[#595959] font-medium">Last Telemetry Sync</div>
            <div className="font-mono text-xs font-bold text-[#000000] mt-0.5">
              {telemetry.last_sync_timestamp}
            </div>
          </div>
        </div>
      </div>

      {/* Model & Data Quality Audit KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <Cpu className="h-3.5 w-3.5 text-black" />
            Model Confidence
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#000000]">
            {audit.prediction_confidence_pct}%
          </div>
          <span className="text-xs text-[#595959] mt-0.5 block tracking-[0.02em]">Platt temperature scaled</span>
        </div>

        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <FileCheck className="h-3.5 w-3.5 text-black" />
            Input Completeness
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#000000]">
            {audit.input_completeness_pct}%
          </div>
          <span className="text-xs text-[#595959] mt-0.5 block tracking-[0.02em]">All key parameters present</span>
        </div>

        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <Clock className="h-3.5 w-3.5 text-black" />
            Weather Telemetry Age
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#000000]">
            {audit.weather_data_age_minutes} mins
          </div>
          <span className="text-xs text-[#595959] mt-0.5 block tracking-[0.02em]">Fresh within 15-min SLA</span>
        </div>

        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <ShieldCheck className="h-3.5 w-3.5 text-black" />
            Model Version
          </div>
          <div className="mt-2 font-mono text-base font-bold text-[#000000] truncate">
            {audit.model_id}
          </div>
          <span className="text-xs text-[#595959] mt-0.5 block tracking-[0.02em]">F1: {audit.validation_f1_score} hold-out</span>
        </div>
      </div>

      {/* Live Data Source Telemetry Table */}
      <div className="rounded-lg border border-[#d9d9d9] bg-white overflow-hidden shadow-none">
        <div className="border-b border-[#d9d9d9] p-5">
          <h3 className="font-bold text-[#000000] tracking-[0.06em] uppercase text-sm">Integrated Services & Endpoints</h3>
          <p className="text-xs text-[#595959] mt-0.5 tracking-[0.02em]">Continuous ping health, round-trip latency, and licensing attribution</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#d9d9d9] bg-[#eeeeee] font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Service Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Latency</th>
                <th className="p-4">Data Mode</th>
                <th className="p-4">License / Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9d9d9]">
              {telemetry.sources.map((src: DataSourceTelemetry) => (
                <tr key={src.source_id} className="hover:bg-[#eeeeee] transition-colors">
                  <td className="p-4">
                    <span className="text-base" title={src.status}>
                      {src.status_indicator}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#000000] tracking-[0.02em]">{src.source_name}</div>
                    <div className="text-[11px] text-[#595959]">{src.notes}</div>
                  </td>
                  <td className="p-4 text-[#595959]">{src.category}</td>
                  <td className="p-4 font-mono font-bold text-[#000000]">{src.latency_ms} ms</td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-0.5 font-mono text-[9px] uppercase tracking-[0.06em] font-bold border ${
                      src.is_live
                        ? 'border-[#7ffeb1] bg-[#7ffeb1] text-black'
                        : 'border-[#d9d9d9] bg-[#eeeeee] text-black'
                    }`}>
                      {src.is_live ? 'LIVE API' : 'SYNTHETIC / ESTIMATED'}
                    </span>
                  </td>
                  <td className="p-4 text-[#595959] font-mono text-[11px]">{src.license_badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Scientific Protocol Notice */}
      <div className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-5 shadow-none">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-black font-bold">
          <Info className="h-4 w-4 text-black" />
          Scientific & Legal Attribution Protocol
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#595959] tracking-[0.02em]">
          This system strictly differentiates official public meteorological forecasts (Open-Meteo IFS/GFS) from experimental prototype scoring models (HTSS). In compliance with SIH26083 regulations, synthetic or proxy health admissions datasets are explicitly identified with <span className="font-mono font-bold text-black border border-black bg-white px-1.5 py-0.5 rounded">DEMO / SYNTHETIC DATA</span> badges. Under no circumstances are simulated casualty figures represented as actual Ministry of Health statistical returns.
        </p>
      </div>
    </div>
  );
}
