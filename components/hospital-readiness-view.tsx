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
      border: 'border-[#000000] bg-[#000000] text-white',
      badge: 'border border-black bg-black text-[#7ffeb1]',
      headline: 'text-white',
    },
    'HIGH ALERT': {
      border: 'border-[#000000] bg-[#eeeeee] text-[#000000]',
      badge: 'border border-[#000000] bg-black text-white',
      headline: 'text-[#000000]',
    },
    PREPARE: {
      border: 'border-[#d9d9d9] bg-[#eeeeee] text-[#000000]',
      badge: 'border border-[#d9d9d9] bg-white text-[#000000]',
      headline: 'text-[#000000]',
    },
    NORMAL: {
      border: 'border-[#d9d9d9] bg-[#eeeeee] text-[#000000]',
      badge: 'border border-[#7ffeb1] bg-[#7ffeb1] text-[#000000]',
      headline: 'text-[#000000]',
    },
  };

  const style = levelColorStyles[assessment.readiness_level];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner — DICE Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <HeartPulse className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-[0.06em] uppercase text-[#000000]">
              Healthcare Surge Readiness: {currentCity}
            </h2>
            <span className="rounded-full border border-[#000000] bg-black px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white font-semibold">
              Disaster Decision Support
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#595959] leading-relaxed tracking-[0.02em]">
            Real-time emergency department bed availability, ice-immersion cooling readiness, and oral rehydration salt buffers across monitored district hospitals.
          </p>
        </div>

        {/* Readiness Status Flag */}
        <div className={`rounded-lg border p-4 text-left sm:text-right ${style.border} shrink-0`}>
          <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] opacity-80 font-medium">
            District Readiness Level
          </div>
          <div className={`font-mono text-xl font-bold uppercase mt-0.5 ${style.headline}`}>
            {assessment.readiness_level}
          </div>
          <div className="font-mono text-[10.5px] opacity-80 mt-0.5">
            Surge Factor: <strong className="font-bold">{assessment.surge_factor_index}x</strong> normal ER load
          </div>
        </div>
      </div>

      {/* Institutional Notice */}
      <div className="flex items-start gap-3 rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4 text-xs text-[#595959]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#000000]" />
        <p>
          <strong className="text-[#000000] font-bold">Institutional Disclaimer:</strong> This module is a municipal disaster preparedness and resource-allocation decision-support tool. It is <strong className="text-[#000000]">not a clinical diagnostic or patient triage system</strong>. Hospital data represents aggregated district emergency reserves and demo capacities.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <BedDouble className="h-3.5 w-3.5 text-[#000000]" />
            Dedicated Heat Beds
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#000000]">
            {assessment.total_dedicated_beds}
          </div>
          <span className="text-xs text-[#595959] mt-0.5 block tracking-[0.02em]">Across {assessment.facilities.length} monitored facilities</span>
        </div>

        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <Activity className="h-3.5 w-3.5 text-[#000000]" />
            Available Cooling Beds
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#000000]">
            {assessment.available_dedicated_beds}
          </div>
          <span className="text-xs text-[#595959] mt-0.5 block tracking-[0.02em]">Cold-saline / immersion ready</span>
        </div>

        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <Droplets className="h-3.5 w-3.5 text-[#000000]" />
            ORS Stock Buffer
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#000000]">
            {assessment.facilities.reduce((sum, h) => sum + h.ors_stock_packets, 0).toLocaleString()}
          </div>
          <span className="text-xs text-[#595959] mt-0.5 block tracking-[0.02em]">Pre-staged packets</span>
        </div>

        <div className="rounded-lg border border-[#d9d9d9] bg-white p-5 shadow-none">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">
            <AlertTriangle className="h-3.5 w-3.5 text-[#000000]" />
            24h Surge Projection
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-[#000000]">
            ~{assessment.admissions_surge_projection_24h}
          </div>
          <span className="text-xs text-[#595959] mt-0.5 block tracking-[0.02em]">Anticipated admissions</span>
        </div>
      </div>

      {/* Grid: Facility Status Cards & Directive Checklists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Hospital Facilities Table */}
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none lg:col-span-7">
          <div className="flex items-center justify-between border-b border-[#d9d9d9] pb-3.5">
            <h3 className="font-bold text-[#000000] tracking-[0.06em] uppercase text-sm">District Hospital Telemetry</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">Live Status</span>
          </div>

          <div className="mt-4 space-y-3">
            {assessment.facilities.map((h: HospitalFacility) => (
              <div
                key={h.id}
                className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-[#000000] text-sm tracking-[0.02em]">{h.name}</h4>
                    <p className="text-xs text-[#595959]">{h.type}</p>
                  </div>
                  <span className={`rounded-full px-3 py-0.5 font-mono text-[9px] uppercase tracking-[0.06em] font-semibold border ${
                    h.status === 'Critical Surge Capacity'
                      ? 'border-black bg-black text-white'
                      : h.status === 'Surge Triage Active'
                      ? 'border-[#000000] bg-white text-[#000000]'
                      : 'border-[#d9d9d9] bg-[#7ffeb1] text-[#000000]'
                  }`}>
                    {h.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg border border-[#d9d9d9] bg-white p-2.5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-[#595959] block">Heat Beds</span>
                    <strong className="text-[#000000] font-mono font-bold">{h.available_cooling_beds}</strong> / {h.dedicated_heatstroke_beds} avail.
                  </div>
                  <div className="rounded-lg border border-[#d9d9d9] bg-white p-2.5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-[#595959] block">ORS Reserves</span>
                    <strong className="text-[#000000] font-mono font-bold">{h.ors_stock_packets.toLocaleString()}</strong> units
                  </div>
                  <div className="rounded-lg border border-[#d9d9d9] bg-white p-2.5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-[#595959] block">Cold Saline</span>
                    <strong className="text-[#000000] font-mono font-bold">{h.iv_fluid_saline_units}</strong> bags
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-[#595959]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${h.ice_bath_equipment_ready ? 'text-[#000000]' : 'text-stone-400'}`} />
                    Ice-bath tubs ready
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${h.backup_generator_tested ? 'text-[#000000]' : 'text-stone-400'}`} />
                    Generator tested
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Directives */}
        <div className="flex flex-col justify-between rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none lg:col-span-5">
          <div>
            <div className="flex items-center gap-2 border-b border-[#d9d9d9] pb-3.5">
              <ShieldAlert className="h-4 w-4 text-[#000000]" />
              <h3 className="font-bold text-[#000000] tracking-[0.06em] uppercase text-sm">Clinical Directives</h3>
            </div>

            <div className="mt-4 space-y-2.5">
              {assessment.recommended_hospital_actions.map((act: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3 text-xs text-[#000000]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black font-mono text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-[#000000] font-bold">
              <PhoneCall className="h-3.5 w-3.5" />
              108 Ambulance Protocol
            </div>
            <p className="mt-1 text-xs text-[#595959] leading-relaxed">
              All ambulances in {currentCity} dispatched on active patrol with air-conditioning running and cool saline packs pre-chilled in mobile coolers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
