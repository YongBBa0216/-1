import React, { useState } from 'react';

interface ShockSimulationCardProps {
  shockFactor: number;
  onSelectShock: (pct: number) => void;
  onRefreshSap: () => void;
  isSapSyncing: boolean;
  lastSapSyncTime: string;
}

export const ShockSimulationCard: React.FC<ShockSimulationCardProps> = ({
  shockFactor,
  onSelectShock,
  onRefreshSap,
  isSapSyncing,
  lastSapSyncTime,
}) => {
  const shockLevels = [
    { label: 'Nominal', value: 0, desc: 'Normal pipeline operation (180.0 MT)' },
    { label: '-10% Shock', value: 10, desc: 'Minor feedline delay (-18.0 MT)' },
    { label: '-20% Shock', value: 20, desc: 'Major supplier freeze-up (-36.0 MT)' },
    { label: '-30% Crash', value: 30, desc: 'Catastrophic pipeline rupture (-54.0 MT)' },
  ];

  return (
    <div className="space-y-3">
      {/* Shock Simulation Widget */}
      <div className="bg-white border border-[#c6c6cd]/40 rounded p-3 shadow-none">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-[#45464d] uppercase">
            INBOUND SUPPLY SHOCK SIMULATION
          </span>
          <span
            className="material-symbols-outlined text-[#0051d5] cursor-pointer hover:scale-110 transition-transform"
            data-icon="troubleshoot"
            title="Simulate upstream cryogenic pipeline disruption"
          >
            troubleshoot
          </span>
        </div>

        <p className="text-xs text-[#45464d] mb-2.5">
          Inject synthetic supply pipeline failure to evaluate SLA triage algorithms:
        </p>

        <div className="grid grid-cols-4 gap-1.5" id="shock-toggles">
          {shockLevels.map((lvl) => {
            const isSelected = shockFactor === lvl.value;
            let activeStyle = '';

            if (isSelected) {
              if (lvl.value === 30) {
                activeStyle = 'bg-[#ba1a1a] text-white border-[#ba1a1a] shadow-sm';
              } else if (lvl.value > 0) {
                activeStyle = 'bg-[#213145] text-white border-[#213145] shadow-sm';
              } else {
                activeStyle = 'bg-[#131b2e] text-white border-[#131b2e] shadow-sm';
              }
            } else {
              if (lvl.value === 30) {
                activeStyle =
                  'bg-[#f8f9ff] text-[#ba1a1a] border-[#ba1a1a]/30 hover:bg-[#ffdad6]/30';
              } else {
                activeStyle =
                  'bg-[#f8f9ff] text-[#0b1c30] border-[#c6c6cd]/40 hover:bg-[#e5eeff]';
              }
            }

            return (
              <button
                key={lvl.value}
                onClick={() => onSelectShock(lvl.value)}
                title={lvl.desc}
                type="button"
                className={`shock-btn px-2 py-1.5 rounded text-[11px] font-mono transition-all cursor-pointer font-bold border ${activeStyle}`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manifest Synchronization Bar */}
      <div className="bg-[#eff4ff] border border-[#c6c6cd]/30 rounded p-2.5 flex items-center justify-between shadow-none">
        <div className="flex items-center gap-2">
          <span
            className={`material-symbols-outlined text-[#45464d] ${
              isSapSyncing ? 'animate-spin text-[#0051d5]' : ''
            }`}
            data-icon="cloud_sync"
          >
            cloud_sync
          </span>
          <div className="text-[11px] font-mono">
            <span className="block text-[#0b1c30] font-semibold">SAP S/4HANA Sync</span>
            <span className="text-[#45464d] text-[10px]">
              {isSapSyncing ? 'Syncing cryptographic manifest...' : `Manifest verified ${lastSapSyncTime}`}
            </span>
          </div>
        </div>

        <button
          onClick={onRefreshSap}
          disabled={isSapSyncing}
          type="button"
          className="px-2.5 py-1 rounded bg-white border border-[#c6c6cd] text-[11px] font-mono font-medium hover:bg-[#e5eeff] text-[#0b1c30] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
        >
          {isSapSyncing ? 'Syncing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
};
