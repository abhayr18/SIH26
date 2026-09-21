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
      {/* Top Banner — Contrast Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#0e0f10]/6 bg-white p-6 sm:p-7 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffe9eb] text-[#ff5065] border border-[#ff5065]/20">
              <Building2 className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0e0f10]">
              Smart Cooling Center Optimization: {currentCity}
            </h2>
            <span className="rounded-full border border-[#ff5065]/20 bg-[#ffe9eb] px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#ff5065] font-semibold">
              Spatial Allocation Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Algorithmic decision-support module that monitors active cooling shelters and calculates optimal spatial deployment for temporary misting pavilions based on <span className="text-[#0e0f10] font-semibold">Thermal Risk &times; Vulnerable Population &times; Distance Deficit</span>.
          </p>
        </div>

        {/* Capacity Summary Badge */}
        <div className="flex items-center gap-5 rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-3.5 w-full sm:w-auto justify-between sm:justify-start shrink-0">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#666666] font-medium">Total Capacity</div>
            <div className="font-mono text-base font-bold text-[#0e0f10]">
              {result.coverage_summary.total_capacity} persons
            </div>
          </div>
          <div className="h-7 w-px bg-[#0e0f10]/10" />
          <div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#666666] font-medium">Avg. Occupancy</div>
            <div className="font-mono text-base font-bold text-[#ff5065]">
              {result.coverage_summary.avg_occupancy_pct}%
            </div>
          </div>
        </div>
      </div>

      {/* Top Optimization Recommendation Highlight Card */}
      <div className="rounded-3xl border border-[#ff5065]/20 bg-[#ffe9eb]/40 p-6 sm:p-7 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#ff5065]" />
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#ff5065]">
            Top Recommended Intervention (Rank #1)
          </span>
          <span className="rounded-full border border-[#ff5065]/30 bg-white px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#ff5065] font-semibold">
            Deploy Next Shelter Here
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h3 className="text-xl font-bold tracking-tight text-[#0e0f10]">
              {result.top_recommendation.site_name}
            </h3>
            <p className="mt-1 font-mono text-xs text-[#666666]">
              Location: {result.top_recommendation.ward_name} ({result.top_recommendation.city}) &middot; Facility: {result.top_recommendation.site_type}
            </p>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#0e0f10]">
              {result.top_recommendation.rationale}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#666666]">
              <span className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-[#0e0f10]" />
                Nearest: <strong className="text-[#0e0f10] font-semibold">{result.top_recommendation.nearest_existing_center_name}</strong> ({result.top_recommendation.distance_to_nearest_center_km} km away)
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#ff5065]" />
                Target capacity: <strong className="text-[#0e0f10] font-semibold">{result.top_recommendation.estimated_capacity} beds</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-2xl border border-[#0e0f10]/6 bg-white p-5 text-center shadow-sm lg:col-span-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] font-medium">Optimization Priority Score</span>
            <div className="font-mono text-3xl font-bold text-[#ff5065] my-1">
              {result.top_recommendation.optimization_score}
            </div>
            <span className="text-xs text-[#666666]">
              High Deficit Index (Risk &times; Pop &times; Dist)
            </span>
            <button className="mt-3.5 rounded-full bg-[#ff5065] hover:bg-[#ff3850] px-4 py-2 font-mono text-[11px] uppercase tracking-wider font-bold text-white shadow-none transition">
              Issue Deployment Order
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Existing Centers vs Ranked Candidate Pool */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Cooling Shelters */}
        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-6 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
          <div className="flex items-center justify-between border-b border-[#0e0f10]/6 pb-3.5">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#ff5065]" />
              <h3 className="font-bold text-[#0e0f10] tracking-tight">Active Shelters ({result.existing_centers.length})</h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666]">Occupancy</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {result.existing_centers.map((center: CoolingCenter) => (
              <div
                key={center.id}
                className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4 transition hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-[#0e0f10] text-sm tracking-tight">{center.name}</h4>
                    <p className="text-xs text-[#666666]">{center.ward} &middot; {center.type}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold border ${
                    center.status === 'Operating Near Capacity'
                      ? 'border-[#ff5065]/30 bg-[#ffe9eb] text-[#ff5065]'
                      : center.status === 'Extended Hours Active'
                      ? 'border-[#ff7a59]/30 bg-[#ff7a59]/10 text-[#ff7a59]'
                      : 'border-[#0e0f10]/10 bg-white text-[#0e0f10]'
                  }`}>
                    {center.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#666666]">
                  <span>Capacity: <strong className="text-[#0e0f10] font-mono font-bold">{center.capacity_people}</strong></span>
                  <span>Occupancy: <strong className="text-[#ff5065] font-mono font-bold">{center.current_occupancy_pct}%</strong></span>
                  <span>Hours: <strong className="text-[#0e0f10] font-semibold">{center.operating_hours}</strong></span>
                </div>

                {/* Progress bar — Signal Coral fill */}
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-[#ff5065]"
                    style={{ width: `${center.current_occupancy_pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranked Candidate Deployment Sites */}
        <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-6 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
          <div className="flex items-center justify-between border-b border-[#0e0f10]/6 pb-3.5">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#ff5065]" />
              <h3 className="font-bold text-[#0e0f10] tracking-tight">Ranked Candidate Expansion Sites</h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666]">Pipeline</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {result.ranked_recommendations.map((cand: CandidateCoolingSite) => (
              <div
                key={cand.candidate_id}
                className="rounded-2xl border border-[#0e0f10]/6 bg-[#f4f4f8] p-4 transition hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0e0f10] font-mono text-[10px] font-bold text-white shrink-0">
                      #{cand.recommendation_rank}
                    </span>
                    <div>
                      <h4 className="font-bold text-[#0e0f10] text-sm tracking-tight">{cand.site_name}</h4>
                      <p className="text-xs text-[#666666]">{cand.ward_name} &middot; {cand.site_type}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#ff5065]">
                    Score: {cand.optimization_score}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#666666] line-clamp-2">
                  {cand.rationale}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#666666] border-t border-[#0e0f10]/6 pt-2">
                  <span>Dist. to center: <strong className="text-[#0e0f10] font-semibold">{cand.distance_to_nearest_center_km} km</strong></span>
                  <span>Est. capacity: <strong className="text-[#0e0f10] font-semibold">{cand.estimated_capacity}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
