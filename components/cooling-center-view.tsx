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
      {/* Top Banner — Copernicus Geometric Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Building2 className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Smart Cooling Center Optimization: {currentCity}
            </h2>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 font-mono text-[11px] uppercase tracking-wider text-blue-700 font-semibold">
              Spatial Allocation Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Algorithmic decision-support module that monitors active cooling shelters and calculates optimal spatial deployment for temporary misting pavilions based on <span className="text-slate-900 font-semibold">Thermal Risk &times; Vulnerable Population &times; Distance Deficit</span>.
          </p>
        </div>

        {/* Capacity Summary Badge */}
        <div className="flex items-center gap-5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 w-full sm:w-auto justify-between sm:justify-start shrink-0">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-medium">Total Capacity</div>
            <div className="font-mono text-base font-bold text-slate-900">
              {result.coverage_summary.total_capacity.toLocaleString()} persons
            </div>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-medium">Avg. Occupancy</div>
            <div className="font-mono text-base font-bold text-slate-900">
              {result.coverage_summary.avg_occupancy_pct}%
            </div>
          </div>
        </div>
      </div>

      {/* Top Optimization Recommendation Highlight Card — Palantir Slate HUD */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 text-slate-100 p-6 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            Top Recommended Intervention (Rank #1)
          </span>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan-300 font-semibold">
            Deploy Next Shelter Here
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h3 className="text-xl font-bold tracking-tight text-white">
              {result.top_recommendation.site_name}
            </h3>
            <p className="mt-1 font-mono text-xs text-slate-400">
              Location: {result.top_recommendation.ward_name} ({result.top_recommendation.city}) &middot; Facility: {result.top_recommendation.site_type}
            </p>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              {result.top_recommendation.rationale}
            </p>
            <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-cyan-400" />
                Nearest: <strong className="text-white font-medium">{result.top_recommendation.nearest_existing_center_name}</strong> ({result.top_recommendation.distance_to_nearest_center_km} km away)
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-cyan-400" />
                Target capacity: <strong className="text-white font-medium">{result.top_recommendation.estimated_capacity} beds</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-xl border border-slate-800 bg-slate-900/80 p-5 text-center shadow-inner lg:col-span-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-medium">Optimization Priority Score</span>
            <div className="font-mono text-3xl font-bold text-cyan-400 my-1">
              {result.top_recommendation.optimization_score}
            </div>
            <span className="text-[11px] text-slate-400">
              High Deficit Index (Risk &times; Pop &times; Dist)
            </span>
            <button className="mt-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold shadow-xs transition-colors">
              Issue Deployment Order
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Existing Centers vs Ranked Candidate Pool */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Cooling Shelters */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 tracking-tight text-sm">Active Shelters ({result.existing_centers.length})</h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Occupancy</span>
          </div>

          <div className="mt-4 space-y-3">
            {result.existing_centers.map((center: CoolingCenter) => (
              <div
                key={center.id}
                className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4 transition-colors hover:bg-slate-50 hover:border-slate-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{center.name}</h4>
                    <p className="text-xs text-slate-500">{center.ward} &middot; {center.type}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider font-semibold border ${
                    center.status === 'Operating Near Capacity'
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : center.status === 'Extended Hours Active'
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}>
                    {center.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <span>Capacity: <strong className="text-slate-900 font-mono font-bold">{center.capacity_people}</strong></span>
                  <span>Occupancy: <strong className="text-slate-900 font-mono font-bold">{center.current_occupancy_pct}%</strong></span>
                  <span>Hours: <strong className="text-slate-900 font-medium">{center.operating_hours}</strong></span>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      center.current_occupancy_pct > 80
                        ? 'bg-rose-500'
                        : center.current_occupancy_pct > 60
                        ? 'bg-amber-500'
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${center.current_occupancy_pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranked Candidate Deployment Sites */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 tracking-tight text-sm">Ranked Candidate Expansion Sites</h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Pipeline</span>
          </div>

          <div className="mt-4 space-y-3">
            {result.ranked_recommendations.map((cand: CandidateCoolingSite) => (
              <div
                key={cand.candidate_id}
                className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4 transition-colors hover:bg-slate-50 hover:border-slate-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white shrink-0">
                      #{cand.recommendation_rank}
                    </span>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{cand.site_name}</h4>
                      <p className="text-xs text-slate-500">{cand.ward_name} &middot; {cand.site_type}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-blue-600">
                    Score: {cand.optimization_score}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                  {cand.rationale}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2">
                  <span>Dist. to center: <strong className="text-slate-900 font-medium">{cand.distance_to_nearest_center_km} km</strong></span>
                  <span>Est. capacity: <strong className="text-slate-900 font-medium">{cand.estimated_capacity}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
