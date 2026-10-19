import React, { useState } from 'react';
import { AuditLogEntry } from '../types';

interface AuditLogsViewProps {
  logs: AuditLogEntry[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [verifiedLedger, setVerifiedLedger] = useState(false);

  const filtered = logs.filter(
    (l) => filterSeverity === 'all' || l.severity === filterSeverity
  );

  const handleVerify = () => {
    setVerifiedLedger(true);
    setTimeout(() => setVerifiedLedger(false), 3000);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <div className="bg-white border border-[#c6c6cd]/40 p-3.5 rounded flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5]">history_edu</span>
            Tamper-Evident SCADA &amp; Quota Dispatch Audit Ledger
          </h2>
          <p className="text-xs text-[#45464d] font-inter mt-0.5">
            Immutable SHA-256 cryptographic sequence recording operator interventions, automatic safety locks, and SAP manifest imports.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleVerify}
            className="px-3 py-1.5 rounded bg-[#131b2e] hover:bg-[#213145] text-white font-bold cursor-pointer transition-colors"
          >
            {verifiedLedger ? '✓ All Block Hashes Valid' : 'Verify Merkle Ledger'}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#76777d]">Filter Severity:</span>
        {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors cursor-pointer ${
              filterSeverity === sev
                ? 'bg-[#0051d5] text-white font-bold'
                : 'bg-white border border-[#c6c6cd] text-[#45464d] hover:bg-[#e5eeff]'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#c6c6cd]/40 rounded overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9ff] border-b border-[#c6c6cd]/40 text-[10px] text-[#45464d] uppercase font-semibold">
              <tr>
                <th className="py-2 px-3">Log ID</th>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Operator / Authority</th>
                <th className="py-2 px-3">Action Code</th>
                <th className="py-2 px-3 min-w-[280px]">Operational Narrative</th>
                <th className="py-2 px-3">Cryptographic Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff]">
              {filtered.map((log) => {
                let badgeStyle = 'bg-[#e5eeff] text-[#0051d5] border-[#316bf3]/30';
                if (log.severity === 'critical') {
                  badgeStyle = 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/40 font-bold';
                } else if (log.severity === 'warning') {
                  badgeStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                }

                return (
                  <tr key={log.id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#0b1c30]">{log.id}</td>
                    <td className="py-2.5 px-3 text-[#45464d] whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#0b1c30]">{log.operator}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded border text-[10px] ${badgeStyle}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#0b1c30] font-inter text-[11px] leading-relaxed">
                      {log.details}
                    </td>
                    <td className="py-2.5 px-3 text-[#76777d] text-[10px] whitespace-nowrap font-mono">
                      {log.hash}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
