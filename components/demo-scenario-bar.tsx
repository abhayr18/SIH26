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
    green: 'bg-[#ffe9eb]/40 text-[#0e0f10] border border-[#0e0f10]/6',
    yellow: 'bg-[#ff7a59]/15 text-[#0e0f10] border border-[#ff7a59]/20',
    orange: 'bg-[#ff5c35]/20 text-[#0e0f10] border border-[#ff5c35]/30',
    red: 'bg-[#ff5065]/20 text-[#ff5065] border border-[#ff5065]/30',
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#0e0f10]/6 bg-white px-4 py-2.5 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
      {/* Left indicator */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5065] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff5065]"></span>
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ff5065]">
              SIMULATION SCENARIO
            </span>
            <span className="text-xs font-bold text-[#0e0f10]">
              {activeScenario.name}
            </span>
          </div>
          <p className="text-[11px] text-[#666666]">
            {activeScenario.description}
          </p>
        </div>
      </div>

      {/* Right Segmented Pills */}
      <div className="flex items-center gap-1 rounded-full border border-[#0e0f10]/6 bg-[#f4f4f8] p-1">
        {DEMO_SCENARIOS.map((scen: DemoScenario) => {
          const isActive = scen.id === activeScenarioId;

          return (
            <button
              key={scen.id}
              onClick={() => onSelectScenario(scen)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-all ${
                isActive
                  ? 'bg-[#ff5065] text-white shadow-none font-semibold'
                  : 'text-[#666666] hover:text-[#0e0f10] hover:bg-[#0e0f10]/5 font-medium'
              }`}
            >
              <span>{scen.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 font-mono text-[9px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : badgeColorStyles[scen.badgeColor]
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
