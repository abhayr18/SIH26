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
    green: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    yellow: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    orange: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
    red: 'border-red-500/40 bg-red-500/10 text-red-300',
  };

  return (
    <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 px-4 py-2.5 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/20 text-amber-400">
            <PlayCircle className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                Live Demo Scenarios
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-1.5 py-0.2 text-[9px] font-bold text-slate-300">
                Hackathon Evaluator Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Active: <strong className="text-white">{activeScenario.name}</strong> • {activeScenario.description}
            </p>
          </div>
        </div>

        {/* Right Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {DEMO_SCENARIOS.map((scen: DemoScenario) => {
            const isActive = scen.id === activeScenarioId;

            return (
              <button
                key={scen.id}
                onClick={() => onSelectScenario(scen)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                  isActive
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow ring-1 ring-amber-400/40'
                    : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {isActive && <Check className="h-3 w-3 text-amber-400" />}
                <span>{scen.name}</span>
                <span
                  className={`rounded border px-1 py-0.1 text-[9px] font-bold uppercase ${badgeColorStyles[scen.badgeColor]}`}
                >
                  {scen.temp_c}°C
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
