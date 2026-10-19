import React from 'react';

interface BottomFooterProps {
  totalAssigned: number;
  inboundCeiling: number;
  onRerunAlgorithm: () => void;
  onPreviewSms: () => void;
  onLockDispatch: () => void;
  onOpenRecalibrate: () => void;
  onOpenRunoutProtocol: () => void;
  onOpenHazardCompliance: () => void;
}

export const BottomFooter: React.FC<BottomFooterProps> = ({
  totalAssigned,
  inboundCeiling,
  onRerunAlgorithm,
  onPreviewSms,
  onLockDispatch,
  onOpenRecalibrate,
  onOpenRunoutProtocol,
  onOpenHazardCompliance,
}) => {
  const freeBuffer = (inboundCeiling - totalAssigned).toFixed(1);
  const usagePct = ((totalAssigned / (inboundCeiling || 1)) * 100).toFixed(1);
  const isOverrun = parseFloat(freeBuffer) < 0;

  return (
    <footer className="fixed bottom-0 left-0 w-full h-14 z-40 flex items-center justify-between px-4 sm:px-6 bg-white border-t border-[#c6c6cd]/40 select-none shadow-[0_-2px_6px_rgba(0,0,0,0.03)]">
      {/* Live Gauge & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0051d5] text-[18px]" data-icon="tune">
            tune
          </span>
          <div className="text-[11px] font-mono leading-tight">
            <span className="font-bold text-[#0b1c30]">
              Total Assigned: {totalAssigned.toFixed(1)} / {inboundCeiling.toFixed(1)} MT ({usagePct}%)
            </span>
            <span className="text-[#45464d] ml-2">
              Remaining Buffer:{' '}
              {isOverrun ? (
                <strong className="text-[#ba1a1a] font-bold animate-pulse">
                  {freeBuffer} MT (DEFICIT OVERRUN)
                </strong>
              ) : (
                <strong className="text-emerald-700 font-bold">
                  {freeBuffer} MT
                </strong>
              )}
            </span>
          </div>
        </div>

        <div className="hidden 2xl:block text-[10px] font-mono text-[#76777d] border-l border-[#c6c6cd]/40 pl-4">
          N2-AllocFlow Industrial Gas Dispatch Console • Active Quota Grid: Nominal Buffer Delta
        </div>
      </div>

      {/* Diagnostic Links */}
      <div className="hidden xl:flex items-center gap-4 text-xs font-mono">
        <button
          onClick={onOpenRecalibrate}
          type="button"
          className="text-[#45464d] hover:text-[#0b1c30] text-[10px] font-mono font-semibold tracking-wider uppercase transition-colors cursor-pointer"
        >
          Recalibrate Model
        </button>
        <button
          onClick={onOpenRunoutProtocol}
          type="button"
          className="text-[#45464d] hover:text-[#0b1c30] text-[10px] font-mono font-semibold tracking-wider uppercase transition-colors cursor-pointer"
        >
          Runout Protocol
        </button>
        <button
          onClick={onOpenHazardCompliance}
          type="button"
          className="text-[#45464d] hover:text-[#0b1c30] text-[10px] font-mono font-semibold tracking-wider uppercase transition-colors cursor-pointer"
        >
          Hazard Compliance
        </button>
      </div>

      {/* Command Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRerunAlgorithm}
          type="button"
          id="re-run-btn"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-[#c6c6cd] text-[11px] font-mono font-semibold text-[#0b1c30] hover:bg-[#e5eeff] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          title="Rebalance customer quotas according to SLA priority score"
        >
          <span className="material-symbols-outlined text-[14px]" data-icon="sync">
            sync
          </span>
          <span className="hidden sm:inline">Re-run Allocation Algorithm</span>
          <span className="sm:hidden">Re-run</span>
        </button>

        <button
          onClick={onPreviewSms}
          type="button"
          id="preview-sms-btn"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/40 text-[11px] font-mono font-semibold text-amber-900 hover:bg-amber-500/20 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          title="View automated alert notifications sent to plant managers"
        >
          <span className="material-symbols-outlined text-[14px]" data-icon="sms">
            sms
          </span>
          <span>Automated Dispatch SMS Preview</span>
        </button>

        <button
          onClick={onLockDispatch}
          type="button"
          id="lock-dispatch-btn"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#316bf3] hover:bg-[#0051d5] text-white text-[11px] font-mono font-bold shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          title="Seal quota grid and generate encrypted QR manifest tokens"
        >
          <span className="material-symbols-outlined text-[14px]" data-icon="lock">
            lock
          </span>
          <span>Lock Quotas &amp; Issue Dispatch QR</span>
        </button>
      </div>
    </footer>
  );
};
