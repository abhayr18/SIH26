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
      border: 'border-rose-200 bg-rose-50/80 text-rose-950',
      badge: 'border border-rose-200 bg-rose-600 text-white',
      headline: 'text-rose-900',
    },
    'HIGH ALERT': {
      border: 'border-amber-200 bg-amber-50/80 text-amber-950',
      badge: 'border border-amber-300 bg-amber-500 text-white',
      headline: 'text-amber-900',
    },
    PREPARE: {
      border: 'border-blue-200 bg-blue-50/80 text-blue-950',
      badge: 'border border-blue-200 bg-blue-600 text-white',
      headline: 'text-blue-900',
    },
    NORMAL: {
      border: 'border-emerald-200 bg-emerald-50/80 text-emerald-950',
      badge: 'border border-emerald-200 bg-emerald-600 text-white',
      headline: 'text-emerald-900',
    },
  };

  const style = levelColorStyles[assessment.readiness_level] || levelColorStyles.NORMAL;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner — Copernicus Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shadow-xs">
              <HeartPulse className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Healthcare Surge Readiness: {currentCity}
            </h2>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 font-mono text-[11px] uppercase tracking-wider text-blue-700 font-semibold">
              Disaster Decision Support
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Real-time emergency department bed availability, ice-immersion cooling readiness, and oral rehydration salt buffers across monitored district hospitals.
          </p>
        </div>

        {/* Readiness Status Flag */}
        <div className={`rounded-xl border p-4 text-left sm:text-right ${style.border} shrink-0`}>
          <div className="font-mono text-[10px] uppercase tracking-wider opacity-80 font-medium">
            District Readiness Level
          </div>
          <div className={`font-mono text-xl font-bold uppercase mt-0.5 ${style.headline}`}>
            {assessment.readiness_level}
          </div>
          <div className="font-mono text-[11px] opacity-80 mt-0.5">
            Surge Factor: <strong className="font-bold">{assessment.surge_factor_index}x</strong> normal ER load
          </div>
        </div>
      </div>

      {/* Institutional Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <p>
          <strong className="text-slate-900 font-semibold">Institutional Disclaimer:</strong> This module is a municipal disaster preparedness and resource-allocation decision-support tool. It is <strong className="text-slate-900 font-semibold">not a clinical diagnostic or patient triage system</strong>. Hospital data represents aggregated district emergency reserves and demo capacities.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 font-medium">
            <BedDouble className="h-3.5 w-3.5 text-blue-600" />
            Dedicated Heat Beds
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-slate-900">
            {assessment.total_dedicated_beds}
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">Across {assessment.facilities.length} monitored facilities</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 font-medium">
            <Activity className="h-3.5 w-3.5 text-blue-600" />
            Available Cooling Beds
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-slate-900">
            {assessment.available_dedicated_beds}
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">Cold-saline / immersion ready</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 font-medium">
            <Droplets className="h-3.5 w-3.5 text-blue-600" />
            ORS Stock Buffer
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-slate-900">
            {assessment.facilities.reduce((sum, h) => sum + h.ors_stock_packets, 0).toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">Pre-staged packets</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 font-medium">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            24h Surge Projection
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-slate-900">
            ~{assessment.admissions_surge_projection_24h}
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">Anticipated admissions</span>
        </div>
      </div>

      {/* Grid: Facility Status Cards & Directive Checklists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Hospital Facilities Table */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <h3 className="font-bold text-slate-900 tracking-tight text-sm">District Hospital Telemetry</h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Live Status</span>
          </div>

          <div className="mt-4 space-y-3">
            {assessment.facilities.map((h: HospitalFacility) => (
              <div
                key={h.id}
                className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4 transition-colors hover:bg-slate-50 hover:border-slate-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{h.name}</h4>
                    <p className="text-xs text-slate-500">{h.type}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider font-semibold border ${
                    h.status === 'Critical Surge Capacity'
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : h.status === 'Surge Triage Active'
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}>
                    {h.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg border border-slate-200/60 bg-white p-2.5 shadow-2xs">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">Heat Beds</span>
                    <strong className="text-slate-900 font-mono font-bold">{h.available_cooling_beds}</strong> / {h.dedicated_heatstroke_beds} avail.
                  </div>
                  <div className="rounded-lg border border-slate-200/60 bg-white p-2.5 shadow-2xs">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">ORS Reserves</span>
                    <strong className="text-slate-900 font-mono font-bold">{h.ors_stock_packets.toLocaleString()}</strong> units
                  </div>
                  <div className="rounded-lg border border-slate-200/60 bg-white p-2.5 shadow-2xs">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">Cold Saline</span>
                    <strong className="text-slate-900 font-mono font-bold">{h.iv_fluid_saline_units}</strong> bags
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-4 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${h.ice_bath_equipment_ready ? 'text-emerald-600' : 'text-slate-300'}`} />
                    Ice-bath tubs ready
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${h.backup_generator_tested ? 'text-emerald-600' : 'text-slate-300'}`} />
                    Generator tested
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Directives */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-5">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5">
              <ShieldAlert className="h-4 w-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 tracking-tight text-sm">Clinical Directives</h3>
            </div>

            <div className="mt-4 space-y-2.5">
              {assessment.recommended_hospital_actions.map((act: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-lg border border-slate-200/70 bg-slate-50/70 p-3 text-xs text-slate-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-900 font-bold">
              <PhoneCall className="h-3.5 w-3.5 text-blue-700" />
              108 Ambulance Protocol
            </div>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              All ambulances in {currentCity} dispatched on active patrol with air-conditioning running and cool saline packs pre-chilled in mobile coolers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
