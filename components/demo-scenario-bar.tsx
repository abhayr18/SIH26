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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#d9d9d9] bg-white px-4 py-3 shadow-none">
      {/* Left indicator */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#000000]">
              SIMULATION SCENARIO:
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#000000]">
              {activeScenario.name}
            </span>
          </div>
          <p className="text-[11px] text-[#595959] tracking-[0.06em]">
            {activeScenario.description}
          </p>
        </div>
      </div>

      {/* Right Segmented Pills */}
      <div className="flex items-center gap-1.5 rounded-full border border-[#d9d9d9] bg-[#eeeeee] p-1">
        {DEMO_SCENARIOS.map((scen: DemoScenario) => {
          const isActive = scen.id === activeScenarioId;

          return (
            <button
              key={scen.id}
              onClick={() => onSelectScenario(scen)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs uppercase tracking-[0.06em] transition-all ${
                isActive
                  ? 'bg-black text-white font-bold shadow-none'
                  : 'text-[#595959] hover:text-black font-normal'
              }`}
            >
              <span>{scen.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 font-mono text-[9px] font-bold ${
                  isActive
                    ? 'bg-white text-black'
                    : 'bg-white border border-[#d9d9d9] text-black'
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
