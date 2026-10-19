import React from 'react';
import { CryoTank } from '../types';

interface TelemetryViewProps {
  tanks: CryoTank[];
  onSelectTank: (tank: CryoTank) => void;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ tanks, onSelectTank }) => {
  return (
    <div className="space-y-4 font-mono">
      {/* Title banner */}
      <div className="bg-white border border-[#c6c6cd]/40 p-3.5 rounded flex flex-wrap items-center justify-between gap-3 shadow-none">
        <div>
          <h2 className="text-base font-bold text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5]">sensors</span>
            Cryogenic Storage &amp; Vaporization Telemetry Array
          </h2>
          <p className="text-xs text-[#45464d] font-inter mt-0.5">
            Real-time SCADA sensor arrays: Pressure transducers (PT-101 to PT-104), Differential capacitance level transmitters (LT-201 to LT-204), and Cryo RTD sensors (-200°C to +50°C).
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
            Sampling: 100ms
          </span>
          <span className="px-2 py-1 rounded bg-[#e5eeff] text-[#0051d5] border border-[#316bf3]/30 font-bold">
            Sensor Health: 99.8%
          </span>
        </div>
      </div>

      {/* 4 Detailed Vessel Telemetry Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tanks.map((tank) => {
          const pct = ((tank.currentMt / tank.capacityMt) * 100).toFixed(1);
          const isCritical = tank.status === 'critical';
          const isWarning = tank.status === 'warning';

          return (
            <div
              key={tank.id}
              onClick={() => onSelectTank(tank)}
              className="bg-white border border-[#c6c6cd]/40 hover:border-[#0051d5] rounded p-4 cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#e5eeff] pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isCritical
                        ? 'bg-[#ba1a1a] animate-ping'
                        : isWarning
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  ></div>
                  <span className="text-sm font-bold text-[#0b1c30]">{tank.id}</span>
                  <span className="text-xs text-[#45464d]">({tank.name})</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    isCritical
                      ? 'bg-[#ba1a1a] text-white'
                      : isWarning
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {tank.runoutTime}
                </span>
              </div>

              {/* Tank Visualization Graphic */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#76777d] uppercase">Mass Inventory</span>
                  <div className="text-lg font-bold text-[#0b1c30]">
                    {tank.currentMt.toFixed(1)} MT
                  </div>
                  <div className="text-[10px] text-[#45464d]">
                    Cap: {tank.capacityMt} MT ({pct}%)
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#76777d] uppercase">Head Pressure</span>
                  <div className="text-lg font-bold text-[#0051d5]">
                    {tank.pressureBar.toFixed(1)} bar
                  </div>
                  <div className="text-[10px] text-[#45464d]">Regulated: 15.0 bar</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#76777d] uppercase">Vessel Temp</span>
                  <div className="text-lg font-bold text-[#0b1c30]">
                    {tank.tempCelsius.toFixed(1)} °C
                  </div>
                  <div className="text-[10px] text-emerald-600">Sub-cooled Liquid</div>
                </div>
              </div>

              {/* Fill Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#45464d]">Vessel Liquid Fill Ratio</span>
                  <span className="font-bold text-[#0b1c30]">{pct}%</span>
                </div>
                <div className="w-full bg-[#e5eeff] h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCritical
                        ? 'bg-[#ba1a1a]'
                        : isWarning
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#45464d] pt-1 border-t border-[#e5eeff]">
                <span>Vacuum Jacket: <strong>0.003 mbar</strong></span>
                <span>Relief Valve: <strong className="text-emerald-600">Closed (Normal)</strong></span>
                <span className="text-[#0051d5] font-bold">View Diagnostics →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upstream Cryogenic Truck Loading Bay Status */}
      <div className="bg-white border border-[#c6c6cd]/40 rounded p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b1c30] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0051d5]">local_shipping</span>
          Loading Gate Terminal Telematics (Ulsan Petrochem Hub Bay 1 - 4)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#f8f9ff] border border-[#c6c6cd]/30 rounded space-y-1">
            <div className="flex justify-between">
              <span className="font-bold">Bay #1 (Linde Cryo)</span>
              <span className="text-emerald-700 font-bold">ACTIVE DECANTER</span>
            </div>
            <div className="text-[#45464d] text-[11px]">Trailer: TR-8812 • Flow: 32.4 MT/hr</div>
            <div className="text-[#76777d] text-[10px]">Depot Transfer: 68.2 / 100 MT</div>
          </div>

          <div className="p-3 bg-[#f8f9ff] border border-[#c6c6cd]/30 rounded space-y-1">
            <div className="flex justify-between">
              <span className="font-bold">Bay #2 (Air Liquide)</span>
              <span className="text-[#0051d5] font-bold">DOCKED &amp; HOOKED</span>
            </div>
            <div className="text-[#45464d] text-[11px]">Trailer: AL-9041 • Purging Manifold</div>
            <div className="text-[#76777d] text-[10px]">Batch Ready: 80.0 MT</div>
          </div>

          <div className="p-3 bg-[#ffdad6]/20 border border-[#ba1a1a]/40 rounded space-y-1 text-[#ba1a1a]">
            <div className="flex justify-between">
              <span className="font-bold">Bay #3 (DIG Air Gas)</span>
              <span className="font-bold">FEEDLINE SHUTDOWN</span>
            </div>
            <div className="text-[11px]">Pipeline ruptured at kilometer 4.2</div>
            <div className="text-[10px]">Force Majeure declared: 0 MT available</div>
          </div>

          <div className="p-3 bg-[#f8f9ff] border border-[#c6c6cd]/30 rounded space-y-1">
            <div className="flex justify-between">
              <span className="font-bold">Bay #4 (Reserve Rack)</span>
              <span className="text-[#76777d] font-bold">STANDBY</span>
            </div>
            <div className="text-[#45464d] text-[11px]">ISO-Container Intermodal Dock</div>
            <div className="text-[#76777d] text-[10px]">Ready for emergency ISO-tainers</div>
          </div>
        </div>
      </div>
    </div>
  );
};
