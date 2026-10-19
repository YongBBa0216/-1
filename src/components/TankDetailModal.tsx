import React from 'react';
import { CryoTank } from '../types';

interface TankDetailModalProps {
  tank: CryoTank | null;
  onClose: () => void;
}

export const TankDetailModal: React.FC<TankDetailModalProps> = ({ tank, onClose }) => {
  if (!tank) return null;

  const pct = ((tank.currentMt / tank.capacityMt) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#c6c6cd] rounded p-5 max-w-lg w-full shadow-2xl space-y-4 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5eeff] pb-3">
          <div className="flex items-center gap-2 text-[#0051d5] font-bold text-base">
            <span className="material-symbols-outlined text-[20px]" data-icon="propane_tank">
              propane_tank
            </span>
            <span>
              {tank.id}: {tank.name}
            </span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-[#45464d] hover:text-[#0b1c30] p-1 rounded"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="close">
              close
            </span>
          </button>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#f8f9ff] border border-[#c6c6cd]/40 rounded space-y-1">
            <span className="text-[#76777d] text-[10px] uppercase">Storage Capacity</span>
            <div className="text-base font-bold text-[#0b1c30]">{tank.currentMt.toFixed(1)} MT</div>
            <div className="text-[11px] text-[#45464d]">Max: {tank.capacityMt} MT ({pct}%)</div>
          </div>

          <div className="p-3 bg-[#f8f9ff] border border-[#c6c6cd]/40 rounded space-y-1">
            <span className="text-[#76777d] text-[10px] uppercase">Vessel Pressure</span>
            <div className="text-base font-bold text-[#0051d5]">{tank.pressureBar.toFixed(1)} bar</div>
            <div className="text-[11px] text-[#45464d]">Safety Relief: 22.0 bar</div>
          </div>

          <div className="p-3 bg-[#f8f9ff] border border-[#c6c6cd]/40 rounded space-y-1">
            <span className="text-[#76777d] text-[10px] uppercase">Internal Cryo Temp</span>
            <div className="text-base font-bold text-[#0b1c30]">{tank.tempCelsius.toFixed(1)} °C</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Sub-cooled Liquid State</div>
          </div>

          <div className="p-3 bg-[#f8f9ff] border border-[#c6c6cd]/40 rounded space-y-1">
            <span className="text-[#76777d] text-[10px] uppercase">Calculated Runout</span>
            <div className={`text-base font-bold ${tank.status === 'critical' ? 'text-[#ba1a1a]' : 'text-emerald-700'}`}>
              {tank.runoutTime.replace('Runout: ', '')}
            </div>
            <div className="text-[11px] text-[#45464d]">Burn Rate: 1.42 MT / hr</div>
          </div>
        </div>

        {/* Physical Status */}
        <div className="bg-[#eff4ff] p-3 rounded text-xs space-y-1 border border-[#c6c6cd]/30">
          <div className="font-bold text-[#0b1c30] flex items-center justify-between">
            <span>SCADA Telemetry Status:</span>
            <span className="text-emerald-700 font-bold">100% ONLINE</span>
          </div>
          <div className="text-[11px] text-[#45464d] space-y-0.5">
            <div>• Vacuum Jacket Insulation: <strong>0.003 mbar (Hermetic)</strong></div>
            <div>• Main Cryo Vaporizer Coil: <strong>Active (Loop B)</strong></div>
            <div>• Low-Temp Level Sensor: <strong>Capacitive Dual-Redundant</strong></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#e5eeff]">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 rounded bg-[#131b2e] hover:bg-[#213145] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
