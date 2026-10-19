import React, { useState } from 'react';

interface ProtocolModalProps {
  type: 'recalibrate' | 'runout' | 'hazard' | null;
  onClose: () => void;
  onApplyRecalibration?: (weights: { margin: number; penalty: number; shutdown: number; safety: number }) => void;
}

export const ProtocolModals: React.FC<ProtocolModalProps> = ({
  type,
  onClose,
  onApplyRecalibration,
}) => {
  const [weights, setWeights] = useState({
    margin: 35,
    penalty: 35,
    shutdown: 20,
    safety: 10,
  });

  if (!type) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#c6c6cd] rounded p-5 max-w-lg w-full shadow-2xl space-y-4 font-mono text-xs">
        {type === 'recalibrate' && (
          <>
            <div className="flex items-center justify-between border-b border-[#e5eeff] pb-2">
              <div className="flex items-center gap-2 text-[#0051d5] font-bold text-sm">
                <span className="material-symbols-outlined">tune</span>
                <span>Recalibrate Priority Allocation Formula</span>
              </div>
              <button onClick={onClose} className="text-[#45464d] hover:text-[#0b1c30]">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <p className="text-[#45464d] font-inter">
              Adjust algorithmic weighting parameters for dynamic quota prioritization score:
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between">
                  <span>Economic Margin Weight: {weights.margin}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={weights.margin}
                  onChange={(e) => setWeights({ ...weights, margin: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#0051d5]"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Contract SLA Penalty Weight: {weights.penalty}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={weights.penalty}
                  onChange={(e) => setWeights({ ...weights, penalty: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#0051d5]"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Cleanroom Shutdown Danger: {weights.shutdown}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={weights.shutdown}
                  onChange={(e) => setWeights({ ...weights, shutdown: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#0051d5]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#e5eeff]">
              <button onClick={onClose} className="px-3 py-1.5 border border-[#c6c6cd] rounded">
                Cancel
              </button>
              <button
                onClick={() => {
                  onApplyRecalibration?.(weights);
                  onClose();
                }}
                className="px-4 py-1.5 bg-[#0051d5] text-white font-bold rounded"
              >
                Apply &amp; Recompute
              </button>
            </div>
          </>
        )}

        {type === 'runout' && (
          <>
            <div className="flex items-center justify-between border-b border-[#e5eeff] pb-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <span className="material-symbols-outlined">hourglass_empty</span>
                <span>Cryogenic Runout Emergency Contingency</span>
              </div>
              <button onClick={onClose} className="text-[#45464d] hover:text-[#0b1c30]">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="space-y-2 text-[#0b1c30] font-inter">
              <p>
                Under Protocol <strong>N2-CRYO-DEFICIT-04</strong>, runout estimates are computed using real-time mass flow decanting:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[11px] font-mono text-[#45464d]">
                <li><strong>TK-104:</strong> 4h 50m remaining (Vaporizer reservoir starvation threshold)</li>
                <li><strong>TK-102:</strong> 8h 15m remaining (Secondary liquid vessel)</li>
                <li><strong>TK-101:</strong> 14h 20m remaining (Main sphere storage)</li>
              </ul>
              <div className="bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-900 text-xs">
                Contingency: Satellite cross-pumping triggers automatically if TK-104 drops below 15.0% capacity.
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#e5eeff]">
              <button onClick={onClose} className="px-4 py-1.5 bg-[#131b2e] text-white font-bold rounded">
                Acknowledge
              </button>
            </div>
          </>
        )}

        {type === 'hazard' && (
          <>
            <div className="flex items-center justify-between border-b border-[#e5eeff] pb-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <span className="material-symbols-outlined">verified_user</span>
                <span>High-Pressure Cryogenic Hazard Compliance</span>
              </div>
              <button onClick={onClose} className="text-[#45464d] hover:text-[#0b1c30]">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="space-y-2 text-[#0b1c30] font-inter">
              <p>
                All cryogenic vessel decanting and pipeline telemetry complies with certified industrial gas hazard protocols:
              </p>
              <div className="bg-[#f8f9ff] p-2.5 rounded border border-[#c6c6cd]/40 space-y-1 font-mono text-[11px]">
                <div>• <strong>KGS AC111:</strong> High Pressure Gas Safety Act Compliance (Korea)</div>
                <div>• <strong>ASME Section VIII Div 1:</strong> Cryogenic Pressure Vessel Code</div>
                <div>• <strong>CGA P-12:</strong> Safe Handling of Cryogenic Liquids (Compressed Gas Assoc)</div>
                <div>• <strong>NFPA 55:</strong> Compressed Gases and Cryogenic Fluids Code</div>
              </div>
              <p className="text-[11px] text-[#45464d]">
                Atmospheric oxygen deficiency monitors in cleanrooms (O2 &gt; 19.5%) monitored continuously.
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#e5eeff]">
              <button onClick={onClose} className="px-4 py-1.5 bg-[#131b2e] text-white font-bold rounded">
                Close Certificate
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
