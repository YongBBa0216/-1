import React, { useState } from 'react';
import { CustomerQuota } from '../types';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: CustomerQuota[];
  totalAssigned: number;
  inboundCeiling: number;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  customers,
  totalAssigned,
  inboundCeiling,
}) => {
  const [selectedTokenIdx, setSelectedTokenIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeAllocated = customers.filter(
    (c) => (c.reqMt * (c.ratioPct / 100)) > 0
  );

  const currentToken = activeAllocated[selectedTokenIdx] || activeAllocated[0];
  const allocatedMt = currentToken ? (currentToken.reqMt * (currentToken.ratioPct / 100)).toFixed(1) : '0.0';
  const tokenHash = currentToken
    ? `QR-SEC-${8820 + currentToken.rank}-${currentToken.name.substring(0, 3).toUpperCase()}`
    : 'QR-SEC-8821';

  const handleCopyManifest = () => {
    navigator.clipboard?.writeText(
      `DISPATCH MANIFEST AUTHENTICATED\nTotal: ${totalAssigned.toFixed(1)} MT\nCeiling: ${inboundCeiling.toFixed(1)} MT\nLead Token: ${tokenHash}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#c6c6cd] rounded p-5 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e5eeff] pb-3">
          <div className="flex items-center gap-2 text-[#0051d5] font-bold text-base">
            <span className="material-symbols-outlined text-[20px]" data-icon="qr_code_2">
              qr_code_2
            </span>
            <span>Cryptographic Dispatch Authorization Passes</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-[#45464d] hover:text-[#0b1c30] p-1 rounded hover:bg-[#e5eeff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="close">
              close
            </span>
          </button>
        </div>

        <p className="text-xs text-[#0b1c30]">
          Quota grid locked. {activeAllocated.length} encrypted cryptographic QR manifest passes generated
          for cryogenic tanker terminal loading gates:
        </p>

        {/* Highlighted Pass Card */}
        {currentToken && (
          <div className="bg-[#f8f9ff] border border-[#316bf3]/40 rounded p-4 flex flex-col md:flex-row items-center gap-4">
            {/* Synthetic Vector QR Code */}
            <div className="w-28 h-28 bg-white border border-[#c6c6cd] p-2 rounded flex flex-col justify-between items-center shadow-xs shrink-0">
              <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-white">
                <div className="bg-[#0b1c30] rounded-xs col-span-2 row-span-2"></div>
                <div className="bg-[#0b1c30] rounded-xs"></div>
                <div className="bg-[#0b1c30] rounded-xs col-span-2 row-span-2"></div>
                <div className="bg-[#0b1c30] rounded-xs"></div>
                <div className="bg-[#0051d5] rounded-xs"></div>
                <div className="bg-[#0b1c30] rounded-xs"></div>
                <div className="bg-[#0b1c30] rounded-xs col-span-2 row-span-2"></div>
                <div className="bg-[#0051d5] rounded-xs"></div>
                <div className="bg-[#0b1c30] rounded-xs"></div>
              </div>
              <span className="text-[9px] font-mono text-[#0051d5] font-bold mt-1">
                {tokenHash}
              </span>
            </div>

            {/* Token Metadata */}
            <div className="space-y-1.5 flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#0b1c30]">{currentToken.name}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  {currentToken.tier.toUpperCase()} VERIFIED
                </span>
              </div>
              <div className="font-mono text-[11px] text-[#45464d]">
                Destination: {currentToken.plant} ({currentToken.sector})
              </div>
              <div className="flex items-center gap-4 text-xs font-mono pt-1">
                <div>
                  <span className="text-[#76777d]">Allocated: </span>
                  <strong className="text-[#0051d5] text-sm">{allocatedMt} MT</strong>
                </div>
                <div>
                  <span className="text-[#76777d]">Fulfillment: </span>
                  <strong className="text-emerald-700">{currentToken.ratioPct}%</strong>
                </div>
                <div>
                  <span className="text-[#76777d]">Gate Berth: </span>
                  <strong className="text-[#0b1c30]">Bay B-0{currentToken.rank}</strong>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#76777d] truncate">
                ECC-256 Sig: a4f8e...79c13b • Issuer: Ulsan Petrochem SCADA Engine #2
              </div>
            </div>
          </div>
        )}

        {/* Token Selector Pills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-[#45464d] uppercase">
            Active Loading Terminal Manifests:
          </span>
          <div className="bg-[#eff4ff] p-2.5 rounded font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
            {activeAllocated.slice(0, 10).map((c, idx) => {
              const amt = (c.reqMt * (c.ratioPct / 100)).toFixed(1);
              const isSelected = selectedTokenIdx === idx;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedTokenIdx(idx)}
                  className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                    isSelected ? 'bg-white border border-[#316bf3]' : 'hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        c.tier === 'tier-1' ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      • QR-SEC-{8820 + c.rank}: {c.name}
                    </span>
                    <span className="text-[#76777d] text-[11px]">({c.plant})</span>
                  </div>
                  <span className="font-bold text-[#0b1c30]">[{amt} MT]</span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-[#45464d] flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-[14px] text-emerald-600" data-icon="check_circle">
              check_circle
            </span>
            Real-time broadcast dispatched to KakaoTalk Biz, Tanker Telematics, &amp; SMS gateways.
          </p>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between border-t border-[#e5eeff] pt-3">
          <button
            onClick={handleCopyManifest}
            type="button"
            className="px-3 py-1.5 rounded border border-[#c6c6cd] text-xs font-mono font-semibold text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
          >
            {copied ? '✓ Manifest Copied' : 'Copy Manifest JSON'}
          </button>

          <button
            onClick={onClose}
            type="button"
            id="confirm-modal"
            className="px-4 py-1.5 rounded bg-[#131b2e] hover:bg-[#213145] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
