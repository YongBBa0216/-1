import React from 'react';
import { CryoTank } from '../types';

interface TankFleetCardProps {
  tanks: CryoTank[];
  onSelectTank: (tank: CryoTank) => void;
}

export const TankFleetCard: React.FC<TankFleetCardProps> = ({ tanks, onSelectTank }) => {
  return (
    <div className="bg-white border border-[#c6c6cd]/40 rounded shadow-none overflow-hidden">
      <div className="px-3 py-2.5 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0051d5]" data-icon="propane_tank">
            propane_tank
          </span>
          <h2 className="font-semibold text-[#0b1c30] text-sm">Cryogenic Tank Fleet</h2>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#45464d]">
            {tanks.length} Vessels
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono font-semibold tracking-wider text-[#45464d] uppercase">
            SCADA LIVE
          </span>
        </div>
      </div>

      {/* Vessel List */}
      <div className="p-3 space-y-2.5">
        {tanks.map((tank) => {
          const pct = ((tank.currentMt / tank.capacityMt) * 100).toFixed(1);

          let containerStyle = 'border-[#c6c6cd]/30 bg-[#f8f9ff] hover:bg-[#eff4ff]';
          let badgeStyle = 'bg-[#e5eeff] text-[#45464d]';
          let pctTextStyle = 'text-[#0b1c30]';
          let barColor = 'bg-[#0051d5]';

          if (tank.status === 'warning') {
            containerStyle = 'border-amber-300 bg-amber-50/50 hover:bg-amber-50/80';
            badgeStyle = 'bg-amber-100 text-amber-800 font-semibold';
            pctTextStyle = 'text-amber-800';
            barColor = 'bg-amber-500';
          } else if (tank.status === 'critical') {
            containerStyle = 'border-[#ba1a1a]/50 bg-[#ffdad6]/20 hover:bg-[#ffdad6]/35';
            badgeStyle = 'bg-[#ba1a1a] text-white font-bold';
            pctTextStyle = 'text-[#ba1a1a]';
            barColor = 'bg-[#ba1a1a]';
          } else if (parseFloat(pct) > 60) {
            badgeStyle = 'bg-emerald-100 text-emerald-800 font-semibold';
            pctTextStyle = 'text-emerald-700';
            barColor = 'bg-emerald-500';
          }

          return (
            <div
              key={tank.id}
              onClick={() => onSelectTank(tank)}
              className={`p-2.5 rounded border transition-colors cursor-pointer group ${containerStyle}`}
              title="Click to view full SCADA diagnostics"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-xs font-bold ${tank.status === 'critical' ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'}`}>
                    {tank.id}
                  </span>
                  <span className="text-[11px] text-[#45464d] group-hover:text-[#0b1c30] transition-colors truncate max-w-[170px] sm:max-w-none">
                    {tank.name}
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-1 rounded ${badgeStyle}`}>
                  {tank.runoutTime}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                <span className={`font-bold ${pctTextStyle}`}>
                  {pct}%{' '}
                  <span className="font-normal text-[#45464d] text-[10px]">
                    ({tank.currentMt.toFixed(1)} MT / {tank.capacityMt} MT)
                  </span>
                </span>
                <span className="text-[#45464d]">
                  {tank.pressureBar.toFixed(1)} bar • {tank.tempCelsius.toFixed(1)}°C
                </span>
              </div>

              <div className="w-full bg-[#e5eeff] h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
