import React from 'react';
import { InboundSupplier } from '../types';

interface KpiStripProps {
  inboundCeiling: number;
  totalAssigned: number;
  suppliers: InboundSupplier[];
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  inboundCeiling,
  totalAssigned,
  suppliers,
}) => {
  const totalDemand = 245.0;
  const currentDeficit = (inboundCeiling - totalDemand).toFixed(1);
  const gapPercentage = (((totalDemand - inboundCeiling) / totalDemand) * 100).toFixed(1);

  // Dynamic SLA penalty computation based on deficit & allocation
  const basePenalty = 142500;
  const penaltyModifier = Math.max(0, (180.0 - inboundCeiling) * 1250);
  const calculatedPenalty = basePenalty + penaltyModifier;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* KPI Card 1: Bulk Inventory */}
      <div className="bg-white border border-[#c6c6cd]/40 rounded p-3 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#c6c6cd] transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-[#45464d] uppercase">
            AVAILABLE N2 BULK INVENTORY
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-[#ba1a1a] bg-[#ffdad6]/40 px-1.5 py-0.5 rounded border border-[#ba1a1a]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
            11.4h TO DRY
          </span>
        </div>

        <div className="flex items-baseline justify-between my-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-mono text-[#0b1c30] font-bold tracking-tight">85.4</span>
            <span className="text-[13px] font-mono text-[#45464d]">/ 225.0 MT</span>
          </div>
          <span className="text-[18px] font-mono font-bold text-[#0b1c30]">38.0%</span>
        </div>

        <div>
          <div className="w-full bg-[#e5eeff] h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: '38.0%' }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#45464d] mt-1.5">
            <span>Buffer Critical Point: 45.0 MT</span>
            <span className="text-amber-700 font-semibold">Low Buffer Warning</span>
          </div>
        </div>
      </div>

      {/* KPI Card 2: Inbound Quota Breakdown */}
      <div className="bg-white border border-[#c6c6cd]/40 rounded p-3 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#c6c6cd] transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-[#45464d] uppercase">
            CONFIRMED INBOUND QUOTA
          </span>
          <span className="text-[10px] font-mono font-semibold text-[#009668] bg-[#dce9ff] px-1.5 py-0.5 rounded border border-[#009668]/30">
            TRANSIT VERIFIED
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-mono text-[#0b1c30] font-bold tracking-tight">
              {inboundCeiling.toFixed(1)}
            </span>
            <span className="text-[13px] font-mono text-[#45464d]">MT MAX CEILING</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 pt-1 border-t border-[#e5eeff]">
          <div className="text-[10px] font-mono">
            <span className="block text-[#45464d] truncate">Linde Cryo</span>
            <span className="font-bold text-[#0b1c30]">
              {(suppliers[0]?.amountMt ?? 100).toFixed(0)} MT
            </span>
            <span className="block text-[9px] text-emerald-600 font-medium">On-route</span>
          </div>
          <div className="text-[10px] font-mono border-l border-[#e5eeff] pl-1">
            <span className="block text-[#45464d] truncate">Air Liquide</span>
            <span className="font-bold text-[#0b1c30]">
              {(suppliers[1]?.amountMt ?? 80).toFixed(0)} MT
            </span>
            <span className="block text-[9px] text-[#0051d5] font-medium">Docked</span>
          </div>
          <div className="text-[10px] font-mono border-l border-[#e5eeff] pl-1">
            <span className="block text-[#45464d] truncate">DIG Air Gas</span>
            <span className="font-bold text-[#ba1a1a]">0 MT</span>
            <span className="block text-[9px] text-[#ba1a1a] font-medium truncate">Force Maj.</span>
          </div>
        </div>
      </div>

      {/* KPI Card 3: Demand Deficit */}
      <div className="bg-white border border-[#c6c6cd]/40 rounded p-3 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#c6c6cd] transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-[#45464d] uppercase">
            UNFULFILLED DEMAND DEFICIT
          </span>
          <span className="text-[10px] font-mono font-semibold text-[#ba1a1a] bg-[#ffdad6]/30 px-1.5 py-0.5 rounded border border-[#ba1a1a]/20">
            -{gapPercentage}% GAP
          </span>
        </div>

        <div className="my-2 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-mono text-[#ba1a1a] font-bold tracking-tight">
              {currentDeficit}
            </span>
            <span className="text-[13px] font-mono text-[#ba1a1a]">MT</span>
          </div>
          <div className="text-right text-[11px] font-mono">
            <div className="text-[#45464d]">Demand: {totalDemand.toFixed(1)} MT</div>
            <div className="text-[#0b1c30] font-semibold">Inbound: {inboundCeiling.toFixed(1)} MT</div>
          </div>
        </div>

        <div className="text-[10px] font-mono bg-[#eff4ff] px-2 py-1 rounded text-[#45464d] flex items-center justify-between">
          <span>Priority Algorithm: Active</span>
          <span className="text-[#0051d5] font-semibold">Tier 1 Safeguarded</span>
        </div>
      </div>

      {/* KPI Card 4: Financial & Fab Penalty Risk */}
      <div className="bg-white border border-[#c6c6cd]/40 rounded p-3 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#c6c6cd] transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-[#45464d] uppercase">
            PENALTY &amp; SHUTDOWN RISK
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
            <span className="material-symbols-outlined text-[13px]" data-icon="gavel">gavel</span>
            SLA EXPOSURE
          </span>
        </div>

        <div className="my-2 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-mono text-[#0b1c30] font-bold tracking-tight">
              ${calculatedPenalty.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#ba1a1a] font-semibold">
            4 Tier-1 Fabs
          </span>
        </div>

        <div className="text-[10px] font-mono flex items-center justify-between pt-1 border-t border-[#e5eeff]">
          <span className="text-[#45464d]">Cleanroom inerting priority</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[12px]" data-icon="verified_user">verified_user</span>
            Mitigation Active
          </span>
        </div>
      </div>
    </section>
  );
};
