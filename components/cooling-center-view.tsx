'use client';

import React from 'react';
import {
  Building2,
  Users,
  Compass,
  Sparkles,
} from 'lucide-react';
import { optimizeCoolingCenters, CoolingCenter, CandidateCoolingSite } from '@/lib/cooling-optimizer';

interface CoolingCenterViewProps {
  currentCity: string;
  currentHtss?: number;
}

export function CoolingCenterView({
  currentCity,
  currentHtss = 78,
}: CoolingCenterViewProps) {
  const result = optimizeCoolingCenters(currentCity, currentHtss);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner — Hume AI Scientific Instrument Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#222222]/8 bg-white p-6 sm:p-7">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#daf7ee] text-[#1b4332] border border-[#222222]/8">
              <Building2 className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-medium tracking-[-0.025em] text-[#222222]">
              Smart Cooling Center Optimization: {currentCity}
            </h2>
            <span className="rounded-full border border-[#222222]/8 bg-[#fff9f3] px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">
              Spatial Allocation Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#7a7876] leading-relaxed">
            Algorithmic decision-support module that monitors active cooling shelters and calculates optimal spatial deployment for temporary misting pavilions based on <span className="text-[#222222] font-medium">Thermal Risk &times; Vulnerable Population &times; Distance Deficit</span>.
          </p>
        </div>

        {/* Capacity Summary Badge */}
        <div className="flex items-center gap-5 rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-3.5 w-full sm:w-auto justify-between sm:justify-start shrink-0">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.025em] text-[#7a7876]">Total Capacity</div>
            <div className="font-mono text-base font-medium text-[#222222]">
              {result.coverage_summary.total_capacity} persons
            </div>
          </div>
          <div className="h-7 w-px bg-[#222222]/8" />
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.025em] text-[#7a7876]">Avg. Occupancy</div>
            <div className="font-mono text-base font-medium text-[#854d0e]">
              {result.coverage_summary.avg_occupancy_pct}%
            </div>
          </div>
        </div>
      </div>

      {/* Top Optimization Recommendation Highlight Card */}
      <div className="rounded-3xl border border-[#222222]/8 bg-[#ffe9cf]/40 p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#c094e4]" />
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.025em] text-[#854d0e]">
            Top Recommended Intervention (Rank #1)
          </span>
          <span className="rounded-full border border-[#222222]/8 bg-[#ffe9cf] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.025em] text-[#854d0e]">
            Deploy Next Shelter Here
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h3 className="text-xl font-medium tracking-[-0.025em] text-[#222222]">
              {result.top_recommendation.site_name}
            </h3>
            <p className="mt-1 font-mono text-xs text-[#7a7876]">
              Location: {result.top_recommendation.ward_name} ({result.top_recommendation.city}) &middot; Facility: {result.top_recommendation.site_type}
            </p>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#222222]">
              {result.top_recommendation.rationale}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#7a7876]">
              <span className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-[#222222]" />
                Nearest: <strong className="text-[#222222] font-medium">{result.top_recommendation.nearest_existing_center_name}</strong> ({result.top_recommendation.distance_to_nearest_center_km} km away)
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#c094e4]" />
                Target capacity: <strong className="text-[#222222] font-medium">{result.top_recommendation.estimated_capacity} beds</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-2xl border border-[#222222]/8 bg-white p-5 text-center lg:col-span-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">Optimization Priority Score</span>
            <div className="font-mono text-3xl font-medium text-[#222222] my-1">
              {result.top_recommendation.optimization_score}
            </div>
            <span className="text-xs text-[#7a7876]">
              High Deficit Index (Risk &times; Pop &times; Dist)
            </span>
            <button className="mt-3.5 rounded-full bg-[#222222] hover:bg-black px-4 py-2 font-mono text-[11px] uppercase tracking-[0.025em] font-medium text-white shadow-none transition">
              Issue Deployment Order
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Existing Centers vs Ranked Candidate Pool */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Cooling Shelters */}
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-6">
          <div className="flex items-center justify-between border-b border-[#222222]/8 pb-3.5">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#222222]" />
              <h3 className="font-medium text-[#222222] tracking-[-0.025em]">Active Shelters ({result.existing_centers.length})</h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">Occupancy</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {result.existing_centers.map((center: CoolingCenter) => (
              <div
                key={center.id}
                className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4 transition hover:bg-white"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-[#222222] text-sm tracking-[-0.025em]">{center.name}</h4>
                    <p className="text-xs text-[#7a7876]">{center.ward} &middot; {center.type}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.025em] border border-[#222222]/8 ${
                    center.status === 'Operating Near Capacity'
                      ? 'bg-[#ffe9cf] text-[#854d0e]'
                      : center.status === 'Extended Hours Active'
                      ? 'bg-[#fdebf7] text-[#574853]'
                      : 'bg-[#daf7ee] text-[#1b4332]'
                  }`}>
                    {center.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#7a7876]">
                  <span>Capacity: <strong className="text-[#222222] font-mono">{center.capacity_people}</strong></span>
                  <span>Occupancy: <strong className="text-[#854d0e] font-mono">{center.current_occupancy_pct}%</strong></span>
                  <span>Hours: <strong className="text-[#222222]">{center.operating_hours}</strong></span>
                </div>

                {/* Progress bar — Iris violet fill */}
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-stone-200/60 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-[#c094e4]"
                    style={{ width: `${center.current_occupancy_pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranked Candidate Deployment Sites */}
        <div className="rounded-2xl border border-[#222222]/8 bg-white p-6">
          <div className="flex items-center justify-between border-b border-[#222222]/8 pb-3.5">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#222222]" />
              <h3 className="font-medium text-[#222222] tracking-[-0.025em]">Ranked Candidate Expansion Sites</h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.025em] text-[#7a7876]">Pipeline</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {result.ranked_recommendations.map((cand: CandidateCoolingSite) => (
              <div
                key={cand.candidate_id}
                className="rounded-2xl border border-[#222222]/8 bg-[#fff9f3] p-4 transition hover:bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#222222] font-mono text-[10px] font-medium text-white shrink-0">
                      #{cand.recommendation_rank}
                    </span>
                    <div>
                      <h4 className="font-medium text-[#222222] text-sm tracking-[-0.025em]">{cand.site_name}</h4>
                      <p className="text-xs text-[#7a7876]">{cand.ward_name} &middot; {cand.site_type}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#222222]">
                    Score: {cand.optimization_score}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#7a7876] line-clamp-2">
                  {cand.rationale}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#7a7876] border-t border-[#222222]/8 pt-2">
                  <span>Dist. to center: <strong className="text-[#222222]">{cand.distance_to_nearest_center_km} km</strong></span>
                  <span>Est. capacity: <strong className="text-[#222222]">{cand.estimated_capacity}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
