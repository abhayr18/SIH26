'use client';

import React from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Data Source Health & Telemetry Monitor
            </h2>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
              Operational Transparency
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Real-time pipeline monitoring, data freshness metrics, input completeness audits, and scientific attribution adhering to MoES/NCMRWF data integrity standards.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/80 p-3.5">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">System Health</div>
            <div className="font-mono text-xl font-bold text-emerald-400">
              {telemetry.overall_system_health_pct}%
            </div>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Last Telemetry Sync</div>
            <div className="font-mono text-xs font-medium text-slate-200">
              {telemetry.last_sync_timestamp}
            </div>
          </div>
        </div>
      </div>

      {/* Model & Data Quality Audit KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Cpu className="h-4 w-4 text-cyan-400" />
            Model Confidence
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-cyan-400">
            {audit.prediction_confidence_pct}%
          </div>
          <span className="text-[10px] text-slate-400">Platt temperature scaled</span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <FileCheck className="h-4 w-4 text-emerald-400" />
            Input Completeness
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-emerald-400">
            {audit.input_completeness_pct}%
          </div>
          <span className="text-[10px] text-slate-400">All key meteorological variables present</span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-4 w-4 text-amber-400" />
            Weather Telemetry Age
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-amber-300">
            {audit.weather_data_age_minutes} mins
          </div>
          <span className="text-[10px] text-slate-400">Fresh within 15-min SLA</span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            Model Version
          </div>
          <div className="mt-1 font-mono text-base font-bold text-purple-300 truncate">
            {audit.model_id}
          </div>
          <span className="text-[10px] text-slate-400">F1: {audit.validation_f1_score} on hold-out</span>
        </div>
      </div>

      {/* Live Data Source Telemetry Table */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="border-b border-slate-800 p-4">
          <h3 className="font-bold text-white">Integrated Data Services & API Endpoints</h3>
          <p className="text-xs text-slate-400">Continuous ping health, round-trip latency, and licensing attribution</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Service Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Latency</th>
                <th className="p-3.5">Data Mode</th>
                <th className="p-3.5">License / Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {telemetry.sources.map((src: DataSourceTelemetry) => (
                <tr key={src.source_id} className="hover:bg-slate-850/50 transition">
                  <td className="p-3.5">
                    <span className="text-base" title={src.status}>
                      {src.status_indicator}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-200">{src.source_name}</div>
                    <div className="text-[11px] text-slate-400">{src.notes}</div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-300">{src.category}</td>
                  <td className="p-3.5 font-mono text-slate-300">{src.latency_ms} ms</td>
                  <td className="p-3.5">
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${
                      src.is_live
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                    }`}>
                      {src.is_live ? 'LIVE API' : 'SYNTHETIC / ESTIMATED'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">{src.license_badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Scientific Disclaimer Notice */}
      <div className="rounded-xl border border-slate-700 bg-slate-850 p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <Info className="h-4 w-4" />
          Mandatory Scientific & Legal Protocol
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          This system strictly differentiates official public meteorological forecasts (Open-Meteo IFS/GFS) from experimental prototype scoring models (HTSS). In compliance with SIH26083 regulations, synthetic or proxy health admissions datasets are explicitly identified with <span className="font-mono text-amber-400">DEMO / SYNTHETIC DATA</span> badges. Under no circumstances are simulated casualty figures represented as actual Ministry of Health statistical returns.
        </p>
      </div>
    </div>
  );
}
