import React, { useState } from 'react';
import { CustomerQuota } from '../types';

interface SmsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: CustomerQuota[];
  inboundCeiling: number;
}

export const SmsPreviewModal: React.FC<SmsPreviewModalProps> = ({
  isOpen,
  onClose,
  customers,
  inboundCeiling,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || 'cust-1');
  const [sentToast, setSentToast] = useState(false);

  if (!isOpen) return null;

  const currentCust = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const allocated = currentCust ? (currentCust.reqMt * (currentCust.ratioPct / 100)).toFixed(1) : '0.0';

  const handleSendTestSms = () => {
    setSentToast(true);
    setTimeout(() => setSentToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#c6c6cd] rounded p-5 max-w-xl w-full shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5eeff] pb-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
            <span className="material-symbols-outlined text-[20px]" data-icon="sms">
              sms
            </span>
            <span>Automated Emergency Dispatch Broadcast Preview</span>
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

        {/* Customer Select */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-semibold tracking-wider text-[#45464d] uppercase">
            Target Account / Cleanroom Director:
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full text-xs font-mono p-1.5 rounded border border-[#c6c6cd] bg-[#f8f9ff] text-[#0b1c30] outline-none focus:border-[#0051d5]"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.rank}. {c.name} - {c.plant} ({c.tier.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Smartphone Chat Bubble Preview */}
        <div className="bg-[#eff4ff] border border-[#c6c6cd]/40 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#c6c6cd]/30 pb-2 text-[10px] font-mono text-[#76777d]">
            <span>KAKAO BIZ / KOREA TELECOM SMS GATEWAY</span>
            <span>ENCRYPTED PROTOCOL</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-[#c6c6cd]/40 shadow-xs space-y-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold border-b border-amber-100 pb-1">
              <span className="material-symbols-outlined text-[15px]" data-icon="warning">warning</span>
              <span>[N2-ALLOCFLOW] 긴급 액화질소 할당 통보</span>
            </div>
            <p className="text-[#0b1c30] leading-relaxed">
              수신: <strong>{currentCust.name}</strong> ({currentCust.plant} 시설통제실)
              <br />
              현재 울산 석유화학 2단지 인바운드 제한({inboundCeiling.toFixed(1)} MT)으로 인해 비상 배분 알고리즘이 적용되었습니다.
            </p>
            <div className="bg-[#f8f9ff] p-2 rounded border border-[#e5eeff] space-y-0.5 text-[11px]">
              <div>• 신청 물량: <strong>{currentCust.reqMt.toFixed(1)} MT</strong></div>
              <div>• 확정 배정 물량: <strong className="text-[#0051d5]">{allocated} MT ({currentCust.ratioPct}%)</strong></div>
              <div>• 관제 우선순위: <strong>Tier {currentCust.tier.replace('tier-', '')} ({currentCust.score.toFixed(1)} pts)</strong></div>
              <div>• 암호화 출차 패스: <strong>QR-SEC-{8820 + currentCust.rank}</strong></div>
            </div>
            <p className="text-[11px] text-[#76777d]">
              인서트 및 벤트 조절 절차를 즉시 수행해 주시기 바랍니다. 문의: 종합관제센터 052-240-9900 (Capt. K. Vance)
            </p>
          </div>
        </div>

        {sentToast && (
          <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono rounded flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Dispatched test alert to {currentCust.name} on-call controller phone!</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-[#e5eeff] pt-3">
          <button
            onClick={handleSendTestSms}
            type="button"
            className="px-3 py-1.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-900 text-xs font-mono font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
          >
            Dispatch Test Ping (SMS Gateway)
          </button>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 rounded bg-[#131b2e] hover:bg-[#213145] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
