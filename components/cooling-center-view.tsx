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
      {/* Top Banner — DICE Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <Building2 className="h-4 w-4 stroke-[2.5]" />
            </span>
            <h2 className="text-xl font-bold tracking-[0.06em] uppercase text-[#000000]">
              Smart Cooling Center Optimization: {currentCity}
            </h2>
            <span className="rounded-full border border-black bg-black px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white font-semibold">
              Spatial Allocation Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#595959] leading-relaxed tracking-[0.02em]">
            Algorithmic decision-support module that monitors active cooling shelters and calculates optimal spatial deployment for temporary misting pavilions based on <span className="text-[#000000] font-semibold">Thermal Risk &times; Vulnerable Population &times; Distance Deficit</span>.
          </p>
        </div>

        {/* Capacity Summary Badge */}
        <div className="flex items-center gap-5 rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3.5 w-full sm:w-auto justify-between sm:justify-start shrink-0">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.06em] text-[#595959] font-medium">Total Capacity</div>
            <div className="font-mono text-base font-bold text-[#000000]">
              {result.coverage_summary.total_capacity} persons
            </div>
          </div>
          <div className="h-7 w-px bg-[#d9d9d9]" />
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.06em] text-[#595959] font-medium">Avg. Occupancy</div>
            <div className="font-mono text-base font-bold text-[#000000]">
              {result.coverage_summary.avg_occupancy_pct}%
            </div>
          </div>
        </div>
      </div>

      {/* Top Optimization Recommendation Highlight Card */}
      <div className="rounded-lg border border-black bg-[#000000] text-white p-6 shadow-none">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#7ffeb1]" />
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.06em] text-[#7ffeb1]">
            Top Recommended Intervention (Rank #1)
          </span>
          <span className="rounded-full border border-[#7ffeb1] bg-[#7ffeb1] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.06em] text-black font-semibold">
            Deploy Next Shelter Here
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h3 className="text-xl font-bold tracking-[0.04em] uppercase text-white">
              {result.top_recommendation.site_name}
            </h3>
            <p className="mt-1 font-mono text-xs text-[#d9d9d9] tracking-[0.02em]">
              Location: {result.top_recommendation.ward_name} ({result.top_recommendation.city}) &middot; Facility: {result.top_recommendation.site_type}
            </p>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-200">
              {result.top_recommendation.rationale}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-[#7ffeb1]" />
                Nearest: <strong className="text-white font-semibold">{result.top_recommendation.nearest_existing_center_name}</strong> ({result.top_recommendation.distance_to_nearest_center_km} km away)
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#7ffeb1]" />
                Target capacity: <strong className="text-white font-semibold">{result.top_recommendation.estimated_capacity} beds</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-lg border border-neutral-700 bg-[#111111] p-5 text-center shadow-none lg:col-span-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-neutral-400 font-medium">Optimization Priority Score</span>
            <div className="font-mono text-3xl font-bold text-[#7ffeb1] my-1">
              {result.top_recommendation.optimization_score}
            </div>
            <span className="text-xs text-neutral-400">
              High Deficit Index (Risk &times; Pop &times; Dist)
            </span>
            <button className="mt-3.5 rounded-full bg-[#7ffeb1] hover:bg-white text-black px-4 py-2 font-mono text-[11px] uppercase tracking-[0.06em] font-bold shadow-none transition">
              Issue Deployment Order
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Existing Centers vs Ranked Candidate Pool */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Cooling Shelters */}
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none">
          <div className="flex items-center justify-between border-b border-[#d9d9d9] pb-3.5">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-black" />
              <h3 className="font-bold text-[#000000] tracking-[0.06em] uppercase text-sm">Active Shelters ({result.existing_centers.length})</h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">Occupancy</span>
          </div>

          <div className="mt-4 space-y-3">
            {result.existing_centers.map((center: CoolingCenter) => (
              <div
                key={center.id}
                className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-[#000000] text-sm tracking-[0.02em]">{center.name}</h4>
                    <p className="text-xs text-[#595959]">{center.ward} &middot; {center.type}</p>
                  </div>
                  <span className={`rounded-full px-3 py-0.5 font-mono text-[9px] uppercase tracking-[0.06em] font-semibold border ${
                    center.status === 'Operating Near Capacity'
                      ? 'border-black bg-black text-white'
                      : center.status === 'Extended Hours Active'
                      ? 'border-black bg-white text-black'
                      : 'border-[#d9d9d9] bg-[#7ffeb1] text-black'
                  }`}>
                    {center.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#595959]">
                  <span>Capacity: <strong className="text-[#000000] font-mono font-bold">{center.capacity_people}</strong></span>
                  <span>Occupancy: <strong className="text-[#000000] font-mono font-bold">{center.current_occupancy_pct}%</strong></span>
                  <span>Hours: <strong className="text-[#000000] font-semibold">{center.operating_hours}</strong></span>
                </div>

                {/* Progress bar — Pitch Black fill */}
                <div className="mt-2.5 h-2 w-full rounded-full bg-[#d9d9d9] overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-black"
                    style={{ width: `${center.current_occupancy_pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranked Candidate Deployment Sites */}
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-none">
          <div className="flex items-center justify-between border-b border-[#d9d9d9] pb-3.5">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-black" />
              <h3 className="font-bold text-[#000000] tracking-[0.06em] uppercase text-sm">Ranked Candidate Expansion Sites</h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#595959]">Pipeline</span>
          </div>

          <div className="mt-4 space-y-3">
            {result.ranked_recommendations.map((cand: CandidateCoolingSite) => (
              <div
                key={cand.candidate_id}
                className="rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-4 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black font-mono text-[10px] font-bold text-white shrink-0">
                      #{cand.recommendation_rank}
                    </span>
                    <div>
                      <h4 className="font-bold text-[#000000] text-sm tracking-[0.02em]">{cand.site_name}</h4>
                      <p className="text-xs text-[#595959]">{cand.ward_name} &middot; {cand.site_type}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#000000]">
                    Score: {cand.optimization_score}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#595959] line-clamp-2">
                  {cand.rationale}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#595959] border-t border-[#d9d9d9] pt-2">
                  <span>Dist. to center: <strong className="text-[#000000] font-semibold">{cand.distance_to_nearest_center_km} km</strong></span>
                  <span>Est. capacity: <strong className="text-[#000000] font-semibold">{cand.estimated_capacity}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
