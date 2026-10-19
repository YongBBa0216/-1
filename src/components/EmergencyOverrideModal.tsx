import React, { useState } from 'react';

interface EmergencyOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOverride: (action: string) => void;
}

export const EmergencyOverrideModal: React.FC<EmergencyOverrideModalProps> = ({
  isOpen,
  onClose,
  onConfirmOverride,
}) => {
  const [selectedAction, setSelectedAction] = useState('unlock_all');
  const [overrideKey, setOverrideKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleExecute = () => {
    if (overrideKey.trim().toUpperCase() !== 'OVERRIDE-A1') {
      setErrorMsg('Invalid Safety Interlock Key. Enter "OVERRIDE-A1" to authorize.');
      return;
    }
    setErrorMsg('');
    onConfirmOverride(selectedAction);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#ba1a1a]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#ba1a1a] rounded p-5 max-w-lg w-full shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ffdad6] pb-3">
          <div className="flex items-center gap-2 text-[#ba1a1a] font-bold text-base">
            <span className="material-symbols-outlined text-[22px]" data-icon="warning">
              warning
            </span>
            <span>CRITICAL EMERGENCY OVERRIDE INTERLOCK</span>
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

        <div className="bg-[#ffdad6]/40 border border-[#ba1a1a]/40 p-3 rounded text-xs font-mono text-[#ba1a1a] space-y-1">
          <div className="font-bold">CAUTION: OPERATIONAL SAFETY LEVEL 4 BREACH</div>
          <div>
            Executing an override bypasses automated SCADA safeguarding formulas and unlocks Tier 1 mission-critical guarantees. This action will be recorded in the cryptographic tamper-evident audit ledger.
          </div>
        </div>

        {/* Action choice */}
        <div className="space-y-2 text-xs font-mono">
          <span className="text-[10px] font-semibold text-[#45464d] uppercase">
            Select Emergency Protocol Override:
          </span>
          <label className="flex items-start gap-2 p-2 rounded border border-[#c6c6cd] hover:bg-[#f8f9ff] cursor-pointer">
            <input
              type="radio"
              name="override-type"
              checked={selectedAction === 'unlock_all'}
              onChange={() => setSelectedAction('unlock_all')}
              className="mt-0.5 accent-[#ba1a1a]"
            />
            <div>
              <div className="font-bold text-[#0b1c30]">Unlock All Sliders (Manual Quota Redistribution)</div>
              <div className="text-[#45464d] text-[11px]">
                Allows throttling Tier 1 fabs below 100% to save auxiliary vaporizers or reallocate to petrochem crackers.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2 p-2 rounded border border-[#c6c6cd] hover:bg-[#f8f9ff] cursor-pointer">
            <input
              type="radio"
              name="override-type"
              checked={selectedAction === 'buffer_purge'}
              onChange={() => setSelectedAction('buffer_purge')}
              className="mt-0.5 accent-[#ba1a1a]"
            />
            <div>
              <div className="font-bold text-[#0b1c30]">Emergency Buffer Flush to Vaporizer TK-104</div>
              <div className="text-[#45464d] text-[11px]">
                Transfers 10.0 MT from TK-103 satellite buffer directly to auxiliary vaporizer to extend critical runout.
              </div>
            </div>
          </label>
        </div>

        {/* Key input */}
        <div className="space-y-1 text-xs font-mono">
          <label className="text-[10px] font-semibold text-[#45464d] uppercase">
            Enter Controller Interlock Code (Type "OVERRIDE-A1"):
          </label>
          <input
            type="text"
            value={overrideKey}
            onChange={(e) => setOverrideKey(e.target.value)}
            placeholder="OVERRIDE-A1"
            className="w-full p-2 border border-[#ba1a1a]/60 rounded uppercase font-mono font-bold tracking-widest text-[#0b1c30] bg-[#fff8f7] outline-none"
          />
          {errorMsg && <p className="text-[#ba1a1a] text-[11px] font-semibold">{errorMsg}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 border-t border-[#e5eeff] pt-3">
          <button
            onClick={onClose}
            type="button"
            className="px-3 py-1.5 rounded border border-[#c6c6cd] text-xs font-mono text-[#0b1c30] hover:bg-[#e5eeff]"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            type="button"
            className="px-4 py-1.5 rounded bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-mono font-bold shadow-sm transition-colors cursor-pointer"
          >
            Authorize Override
          </button>
        </div>
      </div>
    </div>
  );
};
