import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  inboundCeiling: number;
  onLockDispatch: () => void;
  onEmergencyOverride: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  inboundCeiling,
  onLockDispatch,
  onEmergencyOverride,
  onOpenNotifications,
  notificationCount,
}) => {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setClock(`${hours}:${minutes}:${seconds} KST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const dailyTarget = 240.0;
  const shortagePct = (((dailyTarget - inboundCeiling) / dailyTarget) * 100).toFixed(1);

  return (
    <header className="flex justify-between items-center w-full px-4 h-12 fixed top-0 left-0 right-0 z-50 bg-[#131b2e] border-b border-[#c6c6cd]/20 select-none shadow-sm">
      {/* Left Identity & Navigation */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('allocations')}>
          <div className="w-6 h-6 rounded bg-[#316bf3] flex items-center justify-center text-white font-mono text-sm shadow-sm">
            <span className="material-symbols-outlined text-[15px]" data-icon="ac_unit">ac_unit</span>
          </div>
          <span className="text-[15px] font-bold text-white tracking-wider uppercase font-inter">
            N2-AllocFlow
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-5">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`pb-1 text-[10px] font-mono tracking-wider transition-colors cursor-pointer ${
              activeTab === 'telemetry'
                ? 'border-b-2 border-[#316bf3] text-white font-bold'
                : 'text-[#7c839b] hover:text-white'
            }`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('allocations')}
            className={`pb-1 text-[10px] font-mono tracking-wider transition-colors cursor-pointer ${
              activeTab === 'allocations'
                ? 'border-b-2 border-[#316bf3] text-white font-bold'
                : 'text-[#7c839b] hover:text-white'
            }`}
          >
            Allocations
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`pb-1 text-[10px] font-mono tracking-wider transition-colors cursor-pointer ${
              activeTab === 'simulation'
                ? 'border-b-2 border-[#316bf3] text-white font-bold'
                : 'text-[#7c839b] hover:text-white'
            }`}
          >
            Simulation
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-1 text-[10px] font-mono tracking-wider transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'border-b-2 border-[#316bf3] text-white font-bold'
                : 'text-[#7c839b] hover:text-white'
            }`}
          >
            Audit Logs
          </button>
        </nav>

        {/* Pulse Alert Protocol */}
        <div className="hidden xl:flex items-center gap-2 bg-[#ba1a1a]/20 border border-[#ba1a1a]/40 px-2 py-0.5 rounded text-[#ffdad6] text-[10px] font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ba1a1a] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ba1a1a]"></span>
          </span>
          <span className="tracking-wide font-semibold text-[#ffb4ab]">
            EMERGENCY PROTOCOL ACTIVE: N2-CRYO-DEFICIT-04
          </span>
        </div>
      </div>

      {/* Center Operational Target Ribbon */}
      <div className="hidden 2xl:flex items-center gap-3 bg-[#213145]/80 px-3 py-1 rounded border border-[#c6c6cd]/30 text-xs">
        <span className="text-[#bec6e0] font-mono text-[11px]">OCT 24, 2025 • SHIFT A</span>
        <span className="h-3 w-px bg-[#c6c6cd]/40"></span>
        <div className="flex items-center gap-1.5 text-white font-mono text-[11px]">
          <span className="text-[#bec6e0]">Daily Target:</span>
          <span className="font-bold">{dailyTarget.toFixed(1)} MT</span>
          <span className="text-[#bec6e0] ml-1">Inbound Confirmed:</span>
          <span className="text-[#6ffbbe] font-bold">{inboundCeiling.toFixed(1)} MT</span>
          <span className="text-[#ffb4ab] font-bold ml-1">(-{shortagePct}% Shortage)</span>
        </div>
      </div>

      {/* Right Global Actions & Lead Operator Avatar */}
      <div className="flex items-center gap-3">
        {/* Live Time & Terminal */}
        <div className="hidden sm:flex items-center gap-2 text-[#bec6e0] font-mono text-[11px]">
          <span className="text-white font-mono tracking-tight font-semibold" id="live-clock">
            {clock || '14:42:19 KST'}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#213145] text-white text-[10px] font-mono border border-[#c6c6cd]/20">
            ULSAN PETROCHEM #2
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('simulation')}
            className="p-1.5 rounded hover:bg-[#213145] text-[#bec6e0] hover:text-white transition-colors"
            title="Schedule & Simulation Alerts"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]" data-icon="schedule">schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className="p-1.5 rounded hover:bg-[#213145] text-[#bec6e0] hover:text-white transition-colors"
            title="Diagnostic Tuning"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]" data-icon="tune">tune</span>
          </button>
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded hover:bg-[#213145] text-[#bec6e0] hover:text-white transition-colors"
            title="Active Emergency Notifications"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]" data-icon="notifications_active">notifications_active</span>
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
            )}
          </button>
        </div>

        <div className="h-4 w-px bg-[#c6c6cd]/30 mx-0.5"></div>

        {/* Global Dispatch Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLockDispatch}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#316bf3] hover:bg-[#0051d5] text-white text-[11px] font-mono font-semibold active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[13px]" data-icon="lock">lock</span>
            <span>Lock Dispatch</span>
          </button>
          <button
            onClick={onEmergencyOverride}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#ba1a1a] hover:bg-[#93000a] text-white text-[11px] font-mono font-bold active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[13px]" data-icon="warning">warning</span>
            <span>Emergency Override</span>
          </button>
        </div>

        {/* User Avatar / Dispatcher Pill */}
        <div className="flex items-center gap-2 pl-1 border-l border-[#c6c6cd]/30">
          <div
            className="w-7 h-7 rounded bg-[#dbe1ff] text-[#00174b] flex items-center justify-center font-mono font-bold text-xs shadow-inner cursor-pointer"
            title="Capt. K. Vance - Lead Quota Controller (Shift A)"
          >
            KV
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-white text-[11px] font-medium leading-none">Capt. K. Vance</span>
            <span className="text-[#bec6e0] text-[9px] font-mono tracking-tight leading-tight mt-0.5">
              Quota Controller
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
