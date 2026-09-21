'use client';

import React from 'react';
import { PlayCircle, Sparkles, Check, ChevronDown } from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario, DemoScenarioId } from '@/lib/demo-scenarios';

interface DemoScenarioBarProps {
  activeScenarioId: DemoScenarioId;
  onSelectScenario: (scenario: DemoScenario) => void;
}

export function DemoScenarioBar({
  activeScenarioId,
  onSelectScenario,
}: DemoScenarioBarProps) {
  const activeScenario =
    DEMO_SCENARIOS.find((s) => s.id === activeScenarioId) || DEMO_SCENARIOS[0];

  const badgeColorStyles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-sm">
      {/* Left indicator */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Simulation Scenario
            </span>
            <span className="text-xs font-bold text-slate-800">
              {activeScenario.name}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {activeScenario.description}
          </p>
        </div>
      </div>

      {/* Right Segmented Pills */}
      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/80 p-1">
        {DEMO_SCENARIOS.map((scen: DemoScenario) => {
          const isActive = scen.id === activeScenarioId;

          return (
            <button
              key={scen.id}
              onClick={() => onSelectScenario(scen)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/90 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>{scen.name}</span>
              <span
                className={`rounded border px-1 py-0.2 text-[9px] font-bold ${badgeColorStyles[scen.badgeColor]}`}
              >
                {scen.temp_c}°C
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
