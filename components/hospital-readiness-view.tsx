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
      border: 'border-[#ff5065]/30 bg-[#ffe9eb]',
      badge: 'border border-[#ff5065]/30 bg-[#ffe9eb] text-[#ff5065]',
      headline: 'text-[#ff5065]',
    },
    'HIGH ALERT': {
      border: 'border-[#ff7a59]/30 bg-[#ff7a59]/10',
      badge: 'border border-[#ff7a59]/30 bg-[#ff7a59]/10 text-[#ff7a59]',
      headline: 'text-[#ff7a59]',
    },
    PREPARE: {
      border: 'border-[#0e0f10]/10 bg-[#f4f4f8]',
      badge: 'border border-[#0e0f10]/10 bg-[#f4f4f8] text-[#0e0f10]',
      headline: 'text-[#0e0f10]',
    },
    NORMAL: {
      border: 'border-[#0e0f10]/10 bg-[#f4f4f8]',
      badge: 'border border-[#0e0f10]/10 bg-[#f4f4f8] text-[#0e0f10]',
      headline: 'text-[#0e0f10]',
    },
  };

  const style = levelColorStyles[assessment.readiness_level];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner — Contrast Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#0e0f10]/6 bg-white p-6 sm:p-7 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffe9eb] text-[#ff5065] border border-[#ff5065]/20">
              <HeartPulse className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0e0f10]">
              Healthcare Surge Readiness: {currentCity}
            </h2>
            <span className="rounded-full border border-[#ff5065]/20 bg-[#ffe9eb] px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#ff5065] font-semibold">
              Disaster Decision Support
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Real-time emergency department bed availability, ice-immersion cooling readiness, and oral rehydration salt buffers across monitored district hospitals.
          </p>
        </div>

        {/* Readiness Status Flag */}
        <div className={`rounded-2xl border p-4 text-left sm:text-right ${style.border} shrink-0`}>
          <div className="font-mono text-[9.5px] uppercase tracking-wider text-[#666666] font-medium">
            District Readiness Level
          </div>
          <div className={`font-mono text-xl font-bold uppercase mt-0.5 ${style.headline}`}>
            {assessment.readiness_level}
          </div>
          <div className="font-mono text-[10.5px] text-[#666666] mt-0.5">
            Surge Factor: <strong className="text-[#0e0f10] font-bold">{assessment.surge_factor_index}x</strong> normal ER load
          </div>
        </div>
      </div>

      {/* Institutional Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4 text-xs text-[#666666]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5065]" />
        <p>
          <strong className="text-[#0e0f10] font-bold">Institutional Disclaimer:</strong> This module is a municipal disaster preparedness and resource-allocation decision-support tool. It is <strong className="text-[#0e0f10]">not a clinical diagnostic or patient triage system</strong>. Hospital data represents aggregated district emergency reserves and demo capacities.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
            <BedDouble className="h-3.5 w-3.5 text-[#0e0f10]" />
            Dedicated Heat Beds
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#0e0f10]">
            {assessment.total_dedicated_beds}
          </div>
          <span className="text-xs text-[#666666] mt-0.5 block">Across {assessment.facilities.length} monitored facilities</span>
        </div>

        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
            <Activity className="h-3.5 w-3.5 text-[#ff5065]" />
            Available Cooling Beds
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#ff5065]">
            {assessment.available_dedicated_beds}
          </div>
          <span className="text-xs text-[#666666] mt-0.5 block">Cold-saline / immersion ready</span>
        </div>

        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
            <Droplets className="h-3.5 w-3.5 text-[#ff7a59]" />
            ORS Stock Buffer
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#ff7a59]">
            {assessment.facilities.reduce((sum, h) => sum + h.ors_stock_packets, 0).toLocaleString()}
          </div>
          <span className="text-xs text-[#666666] mt-0.5 block">Pre-staged packets</span>
        </div>

        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666666]">
            <AlertTriangle className="h-3.5 w-3.5 text-[#ff5065]" />
            24h Surge Projection
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#ff5065]">
            ~{assessment.admissions_surge_projection_24h}
          </div>
          <span className="text-xs text-[#666666] mt-0.5 block">Anticipated admissions</span>
        </div>
      </div>

      {/* Grid: Facility Status Cards & Directive Checklists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Hospital Facilities Table */}
        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-6 shadow-[0_5px_25px_rgba(38,42,62,0.06)] lg:col-span-7">
          <div className="flex items-center justify-between border-b border-[#0e0f10]/6 pb-3.5">
            <h3 className="font-bold text-[#0e0f10] tracking-tight">District Hospital Telemetry</h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666]">Live Status</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {assessment.facilities.map((h: HospitalFacility) => (
              <div
                key={h.id}
                className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4 transition hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-[#0e0f10] text-sm tracking-tight">{h.name}</h4>
                    <p className="text-xs text-[#666666]">{h.type}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold border ${
                    h.status === 'Critical Surge Capacity'
                      ? 'border-[#ff5065]/30 bg-[#ffe9eb] text-[#ff5065]'
                      : h.status === 'Surge Triage Active'
                      ? 'border-[#ff7a59]/30 bg-[#ff7a59]/10 text-[#ff7a59]'
                      : 'border-[#0e0f10]/10 bg-white text-[#0e0f10]'
                  }`}>
                    {h.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl border border-[#0e0f10]/6 bg-white p-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#666666] block">Heat Beds</span>
                    <strong className="text-[#0e0f10] font-mono font-bold">{h.available_cooling_beds}</strong> / {h.dedicated_heatstroke_beds} avail.
                  </div>
                  <div className="rounded-xl border border-[#0e0f10]/6 bg-white p-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#666666] block">ORS Reserves</span>
                    <strong className="text-[#ff7a59] font-mono font-bold">{h.ors_stock_packets.toLocaleString()}</strong> units
                  </div>
                  <div className="rounded-xl border border-[#0e0f10]/6 bg-white p-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#666666] block">Cold Saline</span>
                    <strong className="text-[#ff5065] font-mono font-bold">{h.iv_fluid_saline_units}</strong> bags
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-[#666666]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${h.ice_bath_equipment_ready ? 'text-[#ff5065]' : 'text-stone-300'}`} />
                    Ice-bath tubs ready
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${h.backup_generator_tested ? 'text-[#ff5065]' : 'text-stone-300'}`} />
                    Generator tested
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Directives */}
        <div className="flex flex-col justify-between rounded-3xl border border-[#0e0f10]/6 bg-white p-6 shadow-[0_5px_25px_rgba(38,42,62,0.06)] lg:col-span-5">
          <div>
            <div className="flex items-center gap-2 border-b border-[#0e0f10]/6 pb-3.5">
              <ShieldAlert className="h-4 w-4 text-[#ff5065]" />
              <h3 className="font-bold text-[#0e0f10] tracking-tight">Clinical Directives</h3>
            </div>

            <div className="mt-4 space-y-2.5">
              {assessment.recommended_hospital_actions.map((act: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3 text-xs text-[#0e0f10]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ffe9eb] font-mono text-[10px] font-bold text-[#ff5065]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#ff5065] font-bold">
              <PhoneCall className="h-3.5 w-3.5" />
              108 Ambulance Protocol
            </div>
            <p className="mt-1 text-xs text-[#666666] leading-relaxed">
              All ambulances in {currentCity} dispatched on active patrol with air-conditioning running and cool saline packs pre-chilled in mobile coolers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
