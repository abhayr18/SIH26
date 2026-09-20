'use client';

import React from 'react';
import {
  Building2,
  MapPin,
  Users,
  Compass,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Droplets,
  Shield,
  Thermometer,
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-teal-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Smart Cooling Center Optimization: {currentCity}
            </h2>
            <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-300">
              Spatial Allocation Engine
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Algorithmic decision-support module that monitors active cooling shelters and calculates the optimal spatial deployment for temporary misting pavilions based on <span className="font-semibold text-white">Thermal Risk × Vulnerable Population × Distance to Nearest Center</span>.
          </p>
        </div>

        {/* Capacity Summary Badge */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/80 p-3.5">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Total Capacity</div>
            <div className="font-mono text-lg font-bold text-white">
              {result.coverage_summary.total_capacity} persons
            </div>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Avg. Occupancy</div>
            <div className="font-mono text-lg font-bold text-amber-400">
              {result.coverage_summary.avg_occupancy_pct}%
            </div>
          </div>
        </div>
      </div>

      {/* Top Optimization Recommendation Highlight Card */}
      <div className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Top Recommended Intervention (Rank #1)
          </span>
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
            Deploy Next Shelter Here
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h3 className="text-xl font-bold text-white">
              {result.top_recommendation.site_name}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Location: {result.top_recommendation.ward_name} ({result.top_recommendation.city}) • Facility Type: {result.top_recommendation.site_type}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">
              {result.top_recommendation.rationale}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <span className="flex items-center gap-1 text-slate-300">
                <Compass className="h-4 w-4 text-cyan-400" />
                Nearest center: <strong className="text-white">{result.top_recommendation.nearest_existing_center_name}</strong> ({result.top_recommendation.distance_to_nearest_center_km} km away)
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <Users className="h-4 w-4 text-purple-400" />
                Target capacity: <strong className="text-white">{result.top_recommendation.estimated_capacity} beds</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-xl border border-amber-500/30 bg-slate-950/70 p-4 text-center lg:col-span-4">
            <span className="text-[11px] font-semibold text-slate-400">Optimization Priority Score</span>
            <div className="font-mono text-3xl font-black text-amber-400">
              {result.top_recommendation.optimization_score}
            </div>
            <span className="mt-1 text-[10px] text-slate-400">
              High Deficit Index (Risk × Pop × Dist)
            </span>
            <button className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-200 transition hover:bg-amber-500/30">
              Issue Deployment Order
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Existing Centers vs Ranked Candidate Pool */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Cooling Shelters */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-cyan-400" />
              <h3 className="font-bold text-white">Active Cooling Shelters ({result.existing_centers.length})</h3>
            </div>
            <span className="text-xs text-slate-400">Real-time occupancy</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {result.existing_centers.map((center: CoolingCenter) => (
              <div
                key={center.id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 transition hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">{center.name}</h4>
                    <p className="text-xs text-slate-400">{center.ward} • {center.type}</p>
                  </div>
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${
                    center.status === 'Operating Near Capacity'
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                      : center.status === 'Extended Hours Active'
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {center.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Capacity: <strong className="text-slate-200">{center.capacity_people}</strong></span>
                  <span>Occupancy: <strong className="text-amber-400">{center.current_occupancy_pct}%</strong></span>
                  <span>Hours: <strong className="text-slate-300">{center.operating_hours}</strong></span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
                  <div
                    className={`h-1.5 rounded-full ${
                      center.current_occupancy_pct > 80
                        ? 'bg-red-500'
                        : center.current_occupancy_pct > 60
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${center.current_occupancy_pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranked Candidate Deployment Sites */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-amber-400" />
              <h3 className="font-bold text-white">Ranked Candidate Expansion Sites</h3>
            </div>
            <span className="text-xs text-slate-400">Optimization pipeline</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {result.ranked_recommendations.map((cand: CandidateCoolingSite) => (
              <div
                key={cand.candidate_id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 transition hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-amber-400">
                      #{cand.recommendation_rank}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{cand.site_name}</h4>
                      <p className="text-xs text-slate-400">{cand.ward_name} • {cand.site_type}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    Score: {cand.optimization_score}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-300 line-clamp-2">
                  {cand.rationale}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>Dist. to center: <strong className="text-slate-300">{cand.distance_to_nearest_center_km} km</strong></span>
                  <span>Est. capacity: <strong className="text-slate-300">{cand.estimated_capacity}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
