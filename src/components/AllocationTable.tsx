import React, { useState, useMemo } from 'react';
import { CustomerQuota, Tier } from '../types';

interface AllocationTableProps {
  customers: CustomerQuota[];
  inboundCeiling: number;
  totalAssigned: number;
  onUpdateRatio: (id: string, ratioPct: number) => void;
  onSelectCustomerDetail?: (customer: CustomerQuota) => void;
}

export const AllocationTable: React.FC<AllocationTableProps> = ({
  customers,
  inboundCeiling,
  totalAssigned,
  onUpdateRatio,
  onSelectCustomerDetail,
}) => {
  const [filterTier, setFilterTier] = useState<'all' | Tier>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const counts = useMemo(() => {
    return {
      all: customers.length,
      'tier-1': customers.filter((c) => c.tier === 'tier-1').length,
      'tier-2': customers.filter((c) => c.tier === 'tier-2').length,
      'tier-3': customers.filter((c) => c.tier === 'tier-3').length,
    };
  }, [customers]);

  // Filtered and searched list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesTier = filterTier === 'all' || c.tier === filterTier;
      const matchesSearch =
        searchQuery.trim() === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.plant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.sector.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTier && matchesSearch;
    });
  }, [customers, filterTier, searchQuery]);

  return (
    <div className="space-y-3">
      {/* Table Toolbar & Filter Tabs */}
      <div className="bg-white border border-[#c6c6cd]/40 rounded p-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-none">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0" id="filter-tabs">
          <button
            onClick={() => setFilterTier('all')}
            className={`tab-btn px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
              filterTier === 'all'
                ? 'bg-[#131b2e] text-white font-bold'
                : 'text-[#45464d] hover:bg-[#e5eeff] font-medium'
            }`}
          >
            All Customers ({counts.all})
          </button>
          <button
            onClick={() => setFilterTier('tier-1')}
            className={`tab-btn px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
              filterTier === 'tier-1'
                ? 'bg-[#131b2e] text-white font-bold'
                : 'text-[#45464d] hover:bg-[#e5eeff] font-medium'
            }`}
          >
            Tier 1: Mission Critical ({counts['tier-1']})
          </button>
          <button
            onClick={() => setFilterTier('tier-2')}
            className={`tab-btn px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
              filterTier === 'tier-2'
                ? 'bg-[#131b2e] text-white font-bold'
                : 'text-[#45464d] hover:bg-[#e5eeff] font-medium'
            }`}
          >
            Tier 2: Controlled Reduction ({counts['tier-2']})
          </button>
          <button
            onClick={() => setFilterTier('tier-3')}
            className={`tab-btn px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
              filterTier === 'tier-3'
                ? 'bg-[#131b2e] text-white font-bold'
                : 'text-[#45464d] hover:bg-[#e5eeff] font-medium'
            }`}
          >
            Tier 3: Deferred ({counts['tier-3']})
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[220px]">
          <span
            className="material-symbols-outlined absolute left-2 top-2 text-[#76777d] text-[16px]"
            data-icon="search"
          >
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter plant, account or fab..."
            className="w-full pl-7 pr-7 py-1 text-xs rounded border border-[#c6c6cd] bg-[#f8f9ff] focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5] outline-none font-inter text-[#0b1c30]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-[#76777d] hover:text-[#0b1c30]"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulation Quota Status Banner */}
      <div className="bg-[#eff4ff] border border-[#316bf3]/30 px-3 py-2 rounded flex flex-wrap items-center justify-between text-xs text-[#0b1c30] gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0051d5] text-[16px]" data-icon="info">
            info
          </span>
          <span>
            Allocated: <strong className="font-mono text-[#0b1c30]">{totalAssigned.toFixed(1)} MT</strong>{' '}
            / Current Inbound Ceiling:{' '}
            <strong className="font-mono text-[#0b1c30]">{inboundCeiling.toFixed(1)} MT</strong>
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#0051d5] font-bold tracking-wider">
          SLIDERS DYNAMICALLY UPDATE FREE BUFFER
        </span>
      </div>

      {/* High-Density Allocation Table */}
      <div className="bg-white border border-[#c6c6cd]/40 rounded overflow-hidden shadow-none">
        <div className="overflow-x-auto custom-scrollbar max-h-[640px]">
          <table className="w-full text-left border-collapse" id="allocation-table">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#f8f9ff] border-b border-[#c6c6cd]/40 text-[10px] font-mono tracking-wider font-semibold text-[#45464d] h-8">
                <th className="py-1 px-2.5 text-center w-10">#</th>
                <th className="py-1 px-3">CUSTOMER &amp; PLANT</th>
                <th className="py-1 px-2 text-right">REQ</th>
                <th className="py-1 px-3 text-center">
                  <span
                    className="cursor-help border-b border-dotted border-[#76777d]"
                    title="Priority Formula: (0.35 * Margin) + (0.35 * Penalty) + (0.20 * Shutdown) - (0.10 * Safety)"
                  >
                    SCORE
                  </span>
                </th>
                <th className="py-1 px-2 text-right">ALLOC</th>
                <th className="py-1 px-4 min-w-[200px]">DISPATCH RATIO &amp; SLIDER OVERRIDE</th>
                <th className="py-1 px-3 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff] text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#45464d] font-mono">
                    No matching customer accounts found for "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const allocated = (cust.reqMt * (cust.ratioPct / 100)).toFixed(1);

                  // Score styling
                  let scoreStyle = 'text-[#45464d]';
                  if (cust.score >= 90) scoreStyle = 'text-emerald-700 font-bold';
                  else if (cust.score >= 70) scoreStyle = 'text-[#0051d5] font-bold';

                  // Row highlight if Hanwha or critical state
                  let rowExtra = '';
                  if (cust.name.includes('Hanwha')) {
                    rowExtra = 'bg-[#ffdad6]/10 border-l-2 border-l-[#ba1a1a]';
                  } else if (cust.ratioPct === 0) {
                    rowExtra = 'opacity-85';
                  }

                  // Badge status computation
                  let badge = (
                    <span className="inline-block text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                      TIER 1 LOCKED
                    </span>
                  );

                  if (cust.tier === 'tier-3' || cust.ratioPct === 0) {
                    badge = (
                      <span className="inline-block text-[10px] font-mono font-medium text-[#45464d] bg-[#dce9ff] px-2 py-0.5 rounded">
                        DEFERRED (TIER 3)
                      </span>
                    );
                  } else if (cust.ratioPct < 40) {
                    badge = (
                      <span className="inline-block text-[10px] font-mono font-bold text-[#45464d] bg-[#e5eeff] border border-[#c6c6cd] px-2 py-0.5 rounded">
                        CONTROLLED THROTTLE
                      </span>
                    );
                  } else if (cust.ratioPct < 100) {
                    badge = (
                      <span className="inline-block text-[10px] font-mono font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                        APPROVED (REDUCED)
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={cust.id}
                      className={`hover:bg-[#f8f9ff] transition-colors ${rowExtra}`}
                    >
                      <td className="py-2 px-2.5 text-center font-mono text-[11px] font-bold text-[#0b1c30]">
                        {cust.rank}
                      </td>
                      <td
                        className="py-2 px-3 cursor-pointer group"
                        onClick={() => onSelectCustomerDetail?.(cust)}
                        title="Click to view SLA and cleanroom risk details"
                      >
                        <div className="font-semibold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors">
                          {cust.name}
                        </div>
                        <div className="text-[11px] font-mono text-[#45464d]">
                          {cust.plant} • {cust.sector}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-right font-mono text-xs text-[#0b1c30]">
                        {cust.reqMt.toFixed(1)} MT
                      </td>
                      <td className={`py-2 px-3 text-center font-mono text-xs ${scoreStyle}`}>
                        {cust.score.toFixed(1)}
                      </td>
                      <td className="py-2 px-2 text-right font-mono text-xs font-bold text-[#0b1c30]">
                        {allocated} MT
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={cust.ratioPct}
                            onChange={(e) =>
                              onUpdateRatio(cust.id, parseInt(e.target.value, 10))
                            }
                            className="w-full h-1 bg-[#e5eeff] rounded cursor-pointer alloc-slider accent-[#0051d5]"
                          />
                          <span className="text-[11px] font-mono text-[#45464d] w-10 text-right">
                            {cust.ratioPct}%
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center whitespace-nowrap">{badge}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
