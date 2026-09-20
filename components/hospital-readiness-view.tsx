'use client';

import React from 'react';
import {
  HeartPulse,
  BedDouble,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  Activity,
  CheckCircle2,
  PhoneCall,
  Info,
} from 'lucide-react';
import { assessHospitalReadiness, HealthcareReadinessAssessment, HospitalFacility } from '@/lib/hospital-readiness';

interface HospitalReadinessViewProps {
  currentCity: string;
  currentHtss?: number;
  forecastPeakHtss?: number;
}

export function HospitalReadinessView({
  currentCity,
  currentHtss = 82,
  forecastPeakHtss = 88,
}: HospitalReadinessViewProps) {
  const assessment: HealthcareReadinessAssessment = assessHospitalReadiness(
    currentCity,
    currentHtss,
    forecastPeakHtss
  );

  const levelColorStyles = {
    CRITICAL: {
      border: 'border-red-500/50 bg-red-950/20',
      badge: 'border-red-500/50 bg-red-500/20 text-red-300',
      headline: 'text-red-400',
    },
    'HIGH ALERT': {
      border: 'border-orange-500/50 bg-orange-950/20',
      badge: 'border-orange-500/50 bg-orange-500/20 text-orange-300',
      headline: 'text-orange-400',
    },
    PREPARE: {
      border: 'border-amber-500/50 bg-amber-950/20',
      badge: 'border-amber-500/50 bg-amber-500/20 text-amber-300',
      headline: 'text-amber-400',
    },
    NORMAL: {
      border: 'border-emerald-500/50 bg-emerald-950/20',
      badge: 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300',
      headline: 'text-emerald-400',
    },
  };

  const style = levelColorStyles[assessment.readiness_level];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-rose-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Healthcare Surge Readiness Dashboard: {currentCity}
            </h2>
            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-300">
              Disaster Decision Support
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Real-time emergency department bed availability, ice-immersion cooling readiness, and oral rehydration salt buffers across monitored district hospitals.
          </p>
        </div>

        {/* Readiness Status Flag */}
        <div className={`rounded-xl border p-4 text-right ${style.border}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            District Readiness Level
          </div>
          <div className={`font-mono text-2xl font-black uppercase ${style.headline}`}>
            {assessment.readiness_level}
          </div>
          <div className="text-[11px] text-slate-300">
            Projected Surge Factor: <strong>{assessment.surge_factor_index}x</strong> normal ER load
          </div>
        </div>
      </div>

      {/* Critical Disclaimer Notice */}
      <div className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-900/90 p-4 text-xs text-slate-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
        <p>
          <strong className="text-white">Institutional Disclaimer:</strong> This module is a municipal disaster preparedness and resource-allocation decision-support tool. It is <strong>NOT a clinical diagnostic or patient triage system</strong>. Hospital data represents aggregated district emergency reserves and demo capacities.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <BedDouble className="h-4 w-4 text-cyan-400" />
            Dedicated Heat Beds
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-white">
            {assessment.total_dedicated_beds}
          </div>
          <span className="text-[10px] text-slate-400">Across {assessment.facilities.length} monitored facilities</span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Activity className="h-4 w-4 text-emerald-400" />
            Available Cooling Beds
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-emerald-400">
            {assessment.available_dedicated_beds}
          </div>
          <span className="text-[10px] text-slate-400">Immediate cold-saline / ice immersion</span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Droplets className="h-4 w-4 text-amber-400" />
            ORS Stock Buffer
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-amber-300">
            {assessment.facilities.reduce((sum, h) => sum + h.ors_stock_packets, 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Pre-staged packets</span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            24h Surge Projection
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-rose-400">
            ~{assessment.admissions_surge_projection_24h}
          </div>
          <span className="text-[10px] text-slate-400">Anticipated heatstroke/exhaustion admissions</span>
        </div>
      </div>

      {/* Grid: Facility Status Cards & Directive Checklists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Hospital Facilities Table */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-lg lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white">District Hospital Facility Telemetry</h3>
            <span className="text-xs text-slate-400">Real-time status</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {assessment.facilities.map((h: HospitalFacility) => (
              <div
                key={h.id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">{h.name}</h4>
                    <p className="text-xs text-slate-400">{h.type}</p>
                  </div>
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${
                    h.status === 'Critical Surge Capacity'
                      ? 'border-red-500/40 bg-red-500/10 text-red-400'
                      : h.status === 'Surge Triage Active'
                      ? 'border-orange-500/40 bg-orange-500/10 text-orange-400'
                      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {h.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-300">
                  <div className="rounded bg-slate-900 px-2 py-1">
                    <span className="text-[10px] text-slate-400 block">Heat Beds</span>
                    <strong className="text-white">{h.available_cooling_beds}</strong> / {h.dedicated_heatstroke_beds} avail.
                  </div>
                  <div className="rounded bg-slate-900 px-2 py-1">
                    <span className="text-[10px] text-slate-400 block">ORS Reserves</span>
                    <strong className="text-amber-300">{h.ors_stock_packets.toLocaleString()}</strong> units
                  </div>
                  <div className="rounded bg-slate-900 px-2 py-1">
                    <span className="text-[10px] text-slate-400 block">Cold Saline</span>
                    <strong className="text-cyan-300">{h.iv_fluid_saline_units}</strong> bags
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className={`h-3 w-3 ${h.ice_bath_equipment_ready ? 'text-emerald-400' : 'text-slate-600'}`} />
                    Ice-bath tubs ready
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className={`h-3 w-3 ${h.backup_generator_tested ? 'text-emerald-400' : 'text-slate-600'}`} />
                    Generator tested
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Directives */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-lg lg:col-span-5">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <h3 className="font-bold text-white">Clinical Preparedness Directives</h3>
            </div>

            <div className="mt-4 space-y-3">
              {assessment.recommended_hospital_actions.map((act: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 font-bold text-cyan-400 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <PhoneCall className="h-4 w-4" />
              108 Emergency Ambulance Protocol
            </div>
            <p className="mt-1 text-xs text-slate-300">
              All ambulances in {currentCity} dispatched on active patrol with air-conditioning running and cool saline packs pre-chilled in mobile coolers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
