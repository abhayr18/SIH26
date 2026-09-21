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

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs">
      {/* Left indicator */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              SIMULATION SCENARIO:
            </span>
            <span className="text-xs font-semibold text-slate-900">
              {activeScenario.name}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {activeScenario.description}
          </p>
        </div>
      </div>

      {/* Right Segmented Pills */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/80 p-1">
        {DEMO_SCENARIOS.map((scen: DemoScenario) => {
          const isActive = scen.id === activeScenarioId;

          return (
            <button
              key={scen.id}
              onClick={() => onSelectScenario(scen)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all ${
                isActive
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <span>{scen.name}</span>
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
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
