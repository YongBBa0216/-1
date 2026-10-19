import React, { useState } from 'react';
import { CustomerQuota } from '../types';

interface SimulationViewProps {
  customers: CustomerQuota[];
  inboundCeiling: number;
  shockFactor: number;
  onSetShock: (shock: number) => void;
}

export const SimulationView: React.FC<SimulationViewProps> = ({
  customers,
  inboundCeiling,
  shockFactor,
  onSetShock,
}) => {
  const [pipelineScenario, setPipelineScenario] = useState('ulsan_main');
  const [ambientTemp, setAmbientTemp] = useState(28);

  const totalDemand = 245.0;
  const currentDeficit = totalDemand - inboundCeiling;

  return (
    <div className="space-y-4 font-mono">
      {/* Simulation Banner */}
      <div className="bg-white border border-[#c6c6cd]/40 p-3.5 rounded flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5]">troubleshoot</span>
            Cryogenic Supply Shock &amp; Pipeline Failure Triage Bench
          </h2>
          <p className="text-xs text-[#45464d] font-inter mt-0.5">
            Evaluate synthetic disruptions against fab cleanroom inerting SLAs, boil-off vapor loss, and emergency tanker routing.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-[#131b2e] text-white font-bold">
            Model: Monte-Carlo Triage v4.9
          </span>
        </div>
      </div>

      {/* Control Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-[#c6c6cd]/40 rounded p-3 space-y-2 text-xs">
          <span className="font-bold text-[#0b1c30] uppercase text-[11px] block">
            Pipeline Failure Scenario
          </span>
          <select
            value={pipelineScenario}
            onChange={(e) => setPipelineScenario(e.target.value)}
            className="w-full p-2 border border-[#c6c6cd] rounded bg-[#f8f9ff] text-[#0b1c30] outline-none"
          >
            <option value="ulsan_main">DIG Air Gas Feedline Depressurization (-65 MT)</option>
            <option value="linde_delay">Linde Inbound Tanker Convoy Traffic Stoppage (-30 MT)</option>
            <option value="double_fault">Dual Supplier Cascade Failure (-95 MT)</option>
          </select>
          <p className="text-[11px] text-[#76777d]">
            Simulates rupture at Ulsan-Pohang industrial gas trunkline at 120 bar.
          </p>
        </div>

        <div className="bg-white border border-[#c6c6cd]/40 rounded p-3 space-y-2 text-xs">
          <span className="font-bold text-[#0b1c30] uppercase text-[11px] block">
            Upstream Supply Shock Level
          </span>
          <div className="grid grid-cols-4 gap-1">
            {[0, 10, 20, 30].map((v) => (
              <button
                key={v}
                onClick={() => onSetShock(v)}
                className={`p-1.5 rounded font-bold text-[11px] border cursor-pointer transition-all ${
                  shockFactor === v
                    ? 'bg-[#0051d5] text-white border-[#0051d5]'
                    : 'bg-[#f8f9ff] text-[#0b1c30] border-[#c6c6cd]'
                }`}
              >
                {v === 0 ? 'Nominal' : `-${v}%`}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#76777d]">
            Ceiling adjusted to: <strong className="text-[#0051d5]">{inboundCeiling.toFixed(1)} MT</strong>
          </p>
        </div>

        <div className="bg-white border border-[#c6c6cd]/40 rounded p-3 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#0b1c30] uppercase text-[11px]">
              Ambient Weather Boil-Off Rate
            </span>
            <span className="font-bold text-[#0051d5]">{ambientTemp} °C</span>
          </div>
          <input
            type="range"
            min="10"
            max="45"
            value={ambientTemp}
            onChange={(e) => setAmbientTemp(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-[#e5eeff] rounded cursor-pointer accent-[#0051d5]"
          />
          <p className="text-[11px] text-[#76777d]">
            Estimated daily boil-off vent loss:{' '}
            <strong className="text-[#ba1a1a]">{(ambientTemp * 0.04).toFixed(2)} MT/day</strong>
          </p>
        </div>
      </div>

      {/* Impact Evaluation Breakdown */}
      <div className="bg-white border border-[#c6c6cd]/40 rounded p-4 space-y-3">
        <h3 className="font-bold text-sm text-[#0b1c30] flex items-center justify-between">
          <span>Projected Impact on Tier 1 Fab Cleanrooms &amp; Chemical Plants</span>
          <span className="text-xs text-[#ba1a1a]">Total Deficit: -{currentDeficit.toFixed(1)} MT</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded space-y-1">
            <div className="font-bold text-emerald-900">Tier 1: Mission-Critical Fabs</div>
            <div className="text-[11px] text-emerald-800">
              Samsung Pyeongtaek Fab 3, SK Hynix M16, DB HiTek
            </div>
            <div className="text-[11px] font-bold text-emerald-900 pt-1">
              STATUS: 100% PROTECTED (Cleanroom inerting atmosphere guaranteed)
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded space-y-1">
            <div className="font-bold text-amber-900">Tier 2: Controlled Reduction</div>
            <div className="text-[11px] text-amber-800">
              LG Display OLED, Hanwha Daesan, Hyundai Hydrogen
            </div>
            <div className="text-[11px] font-bold text-amber-900 pt-1">
              STATUS: 24% - 80% ALLOCATED (Non-essential purges throttled)
            </div>
          </div>

          <div className="p-3 bg-[#e5eeff] border border-[#316bf3]/30 rounded space-y-1">
            <div className="font-bold text-[#0051d5]">Tier 3: Food &amp; Beverage Deferral</div>
            <div className="text-[11px] text-[#45464d]">
              CJ CheilJedang, Nongshim, Ottogi Cryo Grinding
            </div>
            <div className="text-[11px] font-bold text-[#0051d5] pt-1">
              STATUS: 0% DEFERRED (Postponed until grid equilibrium restored)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
