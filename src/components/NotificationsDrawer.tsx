import React from 'react';

interface NotificationItem {
  id: string;
  time: string;
  title: string;
  desc: string;
  level: 'critical' | 'warning' | 'info';
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications: NotificationItem[] = [
    {
      id: 'N-1',
      time: '14:41 KST',
      title: 'FORCE MAJEURE: DIG Air Gas Pipeline',
      desc: 'Main feeder line pressure dropped to 0 bar. Inbound reduced from 245 MT target to 180 MT ceiling.',
      level: 'critical',
    },
    {
      id: 'N-2',
      time: '14:38 KST',
      title: 'TK-104 Vaporizer Critical Warning',
      desc: 'Level reached 19.8% (6.9 MT). 4h 50m remaining before auxiliary vapor starvation.',
      level: 'critical',
    },
    {
      id: 'N-3',
      time: '14:35 KST',
      title: 'Tier 1 Cleanroom Safeguard Active',
      desc: 'Samsung Pyeongtaek Fab 3 and SK Hynix M16 allocation quotas auto-locked at 100%.',
      level: 'warning',
    },
    {
      id: 'N-4',
      time: '14:20 KST',
      title: 'SAP S/4HANA Sync Confirmed',
      desc: 'Logistics manifest block #892 verified via TLS 1.3 cryptographic handshake.',
      level: 'info',
    },
  ];

  return (
    <div className="fixed inset-0 bg-[#000000]/40 z-50 flex justify-end">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-[#c6c6cd]">
        {/* Header */}
        <div className="p-4 bg-[#131b2e] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffdad6]" data-icon="notifications_active">
              notifications_active
            </span>
            <span className="font-bold text-sm font-mono">SCADA Incident Feed</span>
          </div>
          <button onClick={onClose} className="text-[#bec6e0] hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 font-mono">
          {notifications.map((n) => {
            let bg = 'bg-[#f8f9ff] border-[#c6c6cd]/40';
            let dot = 'bg-[#0051d5]';
            if (n.level === 'critical') {
              bg = 'bg-[#ffdad6]/30 border-[#ba1a1a]/40 text-[#ba1a1a]';
              dot = 'bg-[#ba1a1a] animate-ping';
            } else if (n.level === 'warning') {
              bg = 'bg-amber-50 border-amber-200 text-amber-900';
              dot = 'bg-amber-500';
            }

            return (
              <div key={n.id} className={`p-3 rounded border ${bg} text-xs space-y-1`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dot}`}></span>
                    {n.title}
                  </span>
                  <span className="text-[10px] text-[#76777d]">{n.time}</span>
                </div>
                <p className="text-[11px] text-[#45464d] leading-normal">{n.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#e5eeff] bg-[#f8f9ff] flex justify-between items-center text-xs font-mono">
          <span className="text-[#76777d]">Incident Log Ref: #SCADA-N2-04</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-[#131b2e] text-white text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
