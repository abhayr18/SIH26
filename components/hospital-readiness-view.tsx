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
      border: 'border-[#222222]/8 bg-[#fce0ee]',
      badge: 'border border-[#222222]/8 bg-[#fce0ee] text-[#831843]',
      headline: 'text-[#831843]',
    },
    'HIGH ALERT': {
      border: 'border-[#222222]/8 bg-[#ffe9cf]',
      badge: 'border border-[#222222]/8 bg-[#ffe9cf] text-[#854d0e]',
      headline: 'text-[#854d0e]',
    },
    PREPARE: {
      border: 'border-[#222222]/8 bg-[#fff9f3]',
      badge: 'border border-[#222222]/8 bg-[#fdebf7] text-[#574853]',
      headline: 'text-[#574853]',
    },
    NORMAL: {
      border: 'border-[#222222]/8 bg-[#daf7ee]',
      badge: 'border border-[#222222]/8 bg-[#daf7ee] text-[#1b4332]',
      headline: 'text-[#1b4332]',
    },
  };

  const style = levelColorStyles[assessment.readiness_level];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner — Hume AI Scientific Instrument Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#222222]/8 bg-white p-6 sm:p-7">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fdebf7] text-[#574853] border border-[#222222]/8">
              <HeartPulse className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-medium tracking-[-0.025em] text-[#222222]">
              Healthcare Surge Readiness: {currentCity}
            </h2>
            <span className="rounded-full border border-[#222222]/8 bg-[#fff9f3] px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
              Disaster Decision Support
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#7a7876] leading-relaxed">
            Real-time emergency department bed availability, ice-immersion cooling readiness, and oral rehydration salt buffers across monitored district hospitals.
          </p>
        </div>

        {/* Readiness Status Flag */}
        <div className={`rounded-2xl border p-4 text-left sm:text-right ${style.border} shrink-0`}>
          <div className="font-mono text-[9.5px] uppercase tracking-[0.025em] text-[#7a7876]">
            District Readiness Level
          </div>
          <div className={`font-mono text-xl font-medium uppercase mt-0.5 ${style.headline}`}>
            {assessment.readiness_level}
          </div>
          <div className="font-mono text-[10.5px] text-[#7a7876] mt-0.5">
            Surge Factor: <strong className="text-[#222222]">{assessment.surge_factor_index}x</strong> normal ER load
          </div>
        </div>
      </div>

      {/* Institutional Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4 text-xs text-[#7a7876]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#c094e4]" />
        <p>
          <strong className="text-[#222222] font-medium">Institutional Disclaimer:</strong> This module is a municipal disaster preparedness and resource-allocation decision-support tool. It is <strong className="text-[#222222]">not a clinical diagnostic or patient triage system</strong>. Hospital data represents aggregated district emergency reserves and demo capacities.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <BedDouble className="h-3.5 w-3.5 text-[#222222]" />
            Dedicated Heat Beds
          </div>
          <div className="mt-2 font-mono text-2xl font-normal text-[#222222]">
            {assessment.total_dedicated_beds}
          </div>
          <span className="text-xs text-[#7a7876] mt-0.5 block">Across {assessment.facilities.length} monitored facilities</span>
        </div>

        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <Activity className="h-3.5 w-3.5 text-[#1b4332]" />
            Available Cooling Beds
          </div>
          <div className="mt-2 font-mono text-2xl font-normal text-[#1b4332]">
            {assessment.available_dedicated_beds}
          </div>
          <span className="text-xs text-[#7a7876] mt-0.5 block">Cold-saline / immersion ready</span>
        </div>

        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <Droplets className="h-3.5 w-3.5 text-[#ffb760]" />
            ORS Stock Buffer
          </div>
          <div className="mt-2 font-mono text-2xl font-normal text-[#854d0e]">
            {assessment.facilities.reduce((sum, h) => sum + h.ors_stock_packets, 0).toLocaleString()}
          </div>
          <span className="text-xs text-[#7a7876] mt-0.5 block">Pre-staged packets</span>
        </div>

        <div className="rounded-2xl border border-[#222222]/8 bg-white p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
            <AlertTriangle className="h-3.5 w-3.5 text-[#831843]" />
            24h Surge Projection
          </div>
          <div className="mt-2 font-mono text-2xl font-normal text-[#831843]">
            ~{assessment.admissions_surge_projection_24h}
          </div>
          <span className="text-xs text-[#7a7876] mt-0.5 block">Anticipated admissions</span>
        </div>
      </div>

      {/* Grid: Facility Status Cards & Directive Checklists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Hospital Facilities Table */}
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-[#222222]/8 pb-3.5">
            <h3 className="font-medium text-[#222222] tracking-[-0.025em]">District Hospital Telemetry</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">Live Status</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {assessment.facilities.map((h: HospitalFacility) => (
              <div
                key={h.id}
                className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4 transition hover:bg-white"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-[#222222] text-sm tracking-[-0.025em]">{h.name}</h4>
                    <p className="text-xs text-[#7a7876]">{h.type}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.025em] border border-[#222222]/8 ${
                    h.status === 'Critical Surge Capacity'
                      ? 'bg-[#fce0ee] text-[#831843]'
                      : h.status === 'Surge Triage Active'
                      ? 'bg-[#ffe9cf] text-[#854d0e]'
                      : 'bg-[#daf7ee] text-[#1b4332]'
                  }`}>
                    {h.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl border border-[#222222]/6 bg-white p-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.025em] text-[#7a7876] block">Heat Beds</span>
                    <strong className="text-[#222222] font-mono">{h.available_cooling_beds}</strong> / {h.dedicated_heatstroke_beds} avail.
                  </div>
                  <div className="rounded-xl border border-[#222222]/6 bg-white p-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.025em] text-[#7a7876] block">ORS Reserves</span>
                    <strong className="text-[#854d0e] font-mono">{h.ors_stock_packets.toLocaleString()}</strong> units
                  </div>
                  <div className="rounded-xl border border-[#222222]/6 bg-white p-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.025em] text-[#7a7876] block">Cold Saline</span>
                    <strong className="text-[#c094e4] font-mono">{h.iv_fluid_saline_units}</strong> bags
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-[#7a7876]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${h.ice_bath_equipment_ready ? 'text-[#1b4332]' : 'text-stone-300'}`} />
                    Ice-bath tubs ready
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${h.backup_generator_tested ? 'text-[#1b4332]' : 'text-stone-300'}`} />
                    Generator tested
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Directives */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#222222]/8 bg-white p-6 lg:col-span-5">
          <div>
            <div className="flex items-center gap-2 border-b border-[#222222]/8 pb-3.5">
              <ShieldAlert className="h-4 w-4 text-[#c094e4]" />
              <h3 className="font-medium text-[#222222] tracking-[-0.025em]">Clinical Directives</h3>
            </div>

            <div className="mt-4 space-y-2.5">
              {assessment.recommended_hospital_actions.map((act: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-2xl border border-[#222222]/6 bg-[#fdebf7]/30 p-3 text-xs text-[#574853]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fdebf7] font-mono text-[10px] font-medium text-[#574853]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.025em] text-[#854d0e]">
              <PhoneCall className="h-3.5 w-3.5" />
              108 Ambulance Protocol
            </div>
            <p className="mt-1 text-xs text-[#7a7876] leading-relaxed">
              All ambulances in {currentCity} dispatched on active patrol with air-conditioning running and cool saline packs pre-chilled in mobile coolers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
