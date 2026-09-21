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
    green: 'bg-[#daf7ee] text-[#222222] border border-[#222222]/8',
    yellow: 'bg-[#ffe9cf] text-[#222222] border border-[#222222]/8',
    orange: 'bg-[#fce0ee] text-[#222222] border border-[#222222]/8',
    red: 'bg-[#fdebf7] text-[#222222] border border-[#222222]/8',
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#222222]/8 bg-white px-4 py-2.5 shadow-none">
      {/* Left indicator */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c094e4] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c094e4]"></span>
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.025em] text-[#7a7876]">
              SIMULATION SCENARIO
            </span>
            <span className="text-xs font-medium text-[#222222]">
              {activeScenario.name}
            </span>
          </div>
          <p className="text-[11px] text-[#7a7876]">
            {activeScenario.description}
          </p>
        </div>
      </div>

      {/* Right Segmented Pills */}
      <div className="flex items-center gap-1 rounded-full border border-[#222222]/8 bg-[#fff9f3] p-1">
        {DEMO_SCENARIOS.map((scen: DemoScenario) => {
          const isActive = scen.id === activeScenarioId;

          return (
            <button
              key={scen.id}
              onClick={() => onSelectScenario(scen)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#222222] text-white shadow-none font-medium'
                  : 'text-[#7a7876] hover:text-[#222222] hover:bg-[#222222]/5'
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
