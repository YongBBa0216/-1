/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CustomerQuota, CryoTank, InboundSupplier, AuditLogEntry, ActiveTab } from './types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_TANKS,
  INITIAL_SUPPLIERS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import { Header } from './components/Header';
import { KpiStrip } from './components/KpiStrip';
import { TankFleetCard } from './components/TankFleetCard';
import { ShockSimulationCard } from './components/ShockSimulationCard';
import { AllocationTable } from './components/AllocationTable';
import { BottomFooter } from './components/BottomFooter';
import { DispatchModal } from './components/DispatchModal';
import { SmsPreviewModal } from './components/SmsPreviewModal';
import { EmergencyOverrideModal } from './components/EmergencyOverrideModal';
import { TankDetailModal } from './components/TankDetailModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { TelemetryView } from './components/TelemetryView';
import { SimulationView } from './components/SimulationView';
import { AuditLogsView } from './components/AuditLogsView';
import { ProtocolModals } from './components/ProtocolModals';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('allocations');
  const [customers, setCustomers] = useState<CustomerQuota[]>(INITIAL_CUSTOMERS);
  const [tanks, setTanks] = useState<CryoTank[]>(INITIAL_TANKS);
  const [suppliers, setSuppliers] = useState<InboundSupplier[]>(INITIAL_SUPPLIERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [shockFactor, setShockFactor] = useState<number>(0);
  const [isSapSyncing, setIsSapSyncing] = useState<boolean>(false);
  const [lastSapSyncTime, setLastSapSyncTime] = useState<string>('3 mins ago');

  // Modals state
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isEmergencyOverrideOpen, setIsEmergencyOverrideOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedTank, setSelectedTank] = useState<CryoTank | null>(null);
  const [protocolModalType, setProtocolModalType] = useState<'recalibrate' | 'runout' | 'hazard' | null>(null);

  // Computations
  const baseCeiling = 180.0;
  const inboundCeiling = useMemo(() => {
    return parseFloat((baseCeiling * (1 - shockFactor / 100)).toFixed(1));
  }, [baseCeiling, shockFactor]);

  const totalAssigned = useMemo(() => {
    return parseFloat(
      customers
        .reduce((sum, c) => sum + c.reqMt * (c.ratioPct / 100), 0)
        .toFixed(1)
    );
  }, [customers]);

  // Update customer ratio
  const handleUpdateRatio = (id: string, ratioPct: number) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ratioPct } : c))
    );
  };

  // Shock simulation
  const handleSelectShock = (factor: number) => {
    setShockFactor(factor);
    setSuppliers((prev) =>
      prev.map((s, idx) => {
        if (idx === 0) {
          // Linde
          return { ...s, amountMt: factor === 30 ? 70 : factor === 20 ? 80 : 100 };
        }
        if (idx === 1) {
          // Air Liquide
          return { ...s, amountMt: factor === 30 ? 56 : factor === 20 ? 64 : 80 };
        }
        return s;
      })
    );

    // Append to audit log
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} KST`;

    setAuditLogs((prev) => [
      {
        id: `LOG-${8842 + prev.length}`,
        timestamp: timeStr,
        operator: 'Capt. K. Vance (ID: OP-9912)',
        action: `SHOCK_INJECTION_${factor}PCT`,
        details: `Simulated inbound cryogenic shock level set to -${factor}%. Ceilings updated to ${(
          baseCeiling *
          (1 - factor / 100)
        ).toFixed(1)} MT.`,
        hash: `SHA256: ${Math.random().toString(36).substring(2, 10)}...${Math.random()
          .toString(36)
          .substring(2, 6)}`,
        severity: factor >= 20 ? 'critical' : factor > 0 ? 'warning' : 'info',
      },
      ...prev,
    ]);
  };

  // Algorithm Rebalance (Re-run Allocation Algorithm)
  const handleRerunAlgorithm = () => {
    // Exact initial percentages from design:
    // Samsung: 100%, SK Hynix: 100%, LG Display: 80%, Hanwha: 65%, Hyundai: 70%, POSCO: 24%, CJ: 0%
    // If shock is active, scale Tier 2 down proportionally to preserve Tier 1!
    const shockMultiplier = 1 - shockFactor / 100;

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.tier === 'tier-1') {
          return { ...c, ratioPct: 100 };
        }
        if (c.id === 'cust-3') return { ...c, ratioPct: Math.round(80 * shockMultiplier) };
        if (c.id === 'cust-4') return { ...c, ratioPct: Math.round(65 * shockMultiplier) };
        if (c.id === 'cust-5') return { ...c, ratioPct: Math.round(70 * shockMultiplier) };
        if (c.id === 'cust-6') return { ...c, ratioPct: Math.round(24 * shockMultiplier) };
        if (c.tier === 'tier-2') {
          return { ...c, ratioPct: Math.max(10, Math.round(35 * shockMultiplier)) };
        }
        return { ...c, ratioPct: 0 };
      })
    );

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} KST`;

    setAuditLogs((prev) => [
      {
        id: `LOG-${8842 + prev.length}`,
        timestamp: timeStr,
        operator: 'SCADA_OPTIMIZER_ENGINE',
        action: 'ALGORITHM_REBALANCE',
        details: `Recomputed customer quotas to fit inbound ceiling (${inboundCeiling.toFixed(
          1
        )} MT). Safeguarded all 8 Tier 1 semiconductor fabs.`,
        hash: `SHA256: ${Math.random().toString(36).substring(2, 10)}...${Math.random()
          .toString(36)
          .substring(2, 6)}`,
        severity: 'info',
      },
      ...prev,
    ]);
  };

  // SAP S/4HANA Sync
  const handleRefreshSap = () => {
    setIsSapSyncing(true);
    setTimeout(() => {
      setIsSapSyncing(false);
      setLastSapSyncTime('just now');
    }, 1200);
  };

  // Emergency Override Execution
  const handleConfirmOverride = (action: string) => {
    if (action === 'buffer_purge') {
      // Transfer mass from TK-103 to TK-104
      setTanks((prev) =>
        prev.map((t) => {
          if (t.id === 'TK-103') {
            return { ...t, currentMt: Math.max(5, t.currentMt - 10) };
          }
          if (t.id === 'TK-104') {
            return {
              ...t,
              currentMt: t.currentMt + 10,
              runoutTime: 'Runout: 11h 40m',
              status: 'nominal',
            };
          }
          return t;
        })
      );
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} KST`;

    setAuditLogs((prev) => [
      {
        id: `LOG-${8842 + prev.length}`,
        timestamp: timeStr,
        operator: 'Capt. K. Vance (KEY: OVERRIDE-A1)',
        action: 'CRITICAL_SAFETY_OVERRIDE',
        details: `Emergency protocol override triggered: ${action}. SCADA safety interlock bypassed.`,
        hash: `SHA256: 0000${Math.random().toString(36).substring(2, 10)}...ffff`,
        severity: 'critical',
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased selection:bg-[#316bf3] selection:text-white pb-20 font-inter">
      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inboundCeiling={inboundCeiling}
        onLockDispatch={() => setIsDispatchModalOpen(true)}
        onEmergencyOverride={() => setIsEmergencyOverrideOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        notificationCount={2}
      />

      {/* Main Viewport Container */}
      <main className="mt-12 px-4 py-4 max-w-[1920px] mx-auto space-y-4">
        {/* Top KPI Telemetry Strip (Always visible across tabs for operational situational awareness) */}
        <KpiStrip
          inboundCeiling={inboundCeiling}
          totalAssigned={totalAssigned}
          suppliers={suppliers}
        />

        {/* Tab 1: Allocations (Main View from Screenshot) */}
        {activeTab === 'allocations' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
            {/* Left Column (35% on desktop): Storage Vessel Telemetry & Inbound Shock Sim */}
            <div className="lg:col-span-4 space-y-3">
              <TankFleetCard
                tanks={tanks}
                onSelectTank={(tank) => setSelectedTank(tank)}
              />
              <ShockSimulationCard
                shockFactor={shockFactor}
                onSelectShock={handleSelectShock}
                onRefreshSap={handleRefreshSap}
                isSapSyncing={isSapSyncing}
                lastSapSyncTime={lastSapSyncTime}
              />
            </div>

            {/* Right Column (65% on desktop): Dynamic Customer Quota Allocation Engine */}
            <div className="lg:col-span-8 space-y-3">
              <AllocationTable
                customers={customers}
                inboundCeiling={inboundCeiling}
                totalAssigned={totalAssigned}
                onUpdateRatio={handleUpdateRatio}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Telemetry */}
        {activeTab === 'telemetry' && (
          <TelemetryView
            tanks={tanks}
            onSelectTank={(tank) => setSelectedTank(tank)}
          />
        )}

        {/* Tab 3: Simulation */}
        {activeTab === 'simulation' && (
          <SimulationView
            customers={customers}
            inboundCeiling={inboundCeiling}
            shockFactor={shockFactor}
            onSetShock={handleSelectShock}
          />
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'audit' && <AuditLogsView logs={auditLogs} />}
      </main>

      {/* Sticky Bottom Command Footer */}
      <BottomFooter
        totalAssigned={totalAssigned}
        inboundCeiling={inboundCeiling}
        onRerunAlgorithm={handleRerunAlgorithm}
        onPreviewSms={() => setIsSmsModalOpen(true)}
        onLockDispatch={() => setIsDispatchModalOpen(true)}
        onOpenRecalibrate={() => setProtocolModalType('recalibrate')}
        onOpenRunoutProtocol={() => setProtocolModalType('runout')}
        onOpenHazardCompliance={() => setProtocolModalType('hazard')}
      />

      {/* Interactive Modals */}
      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        customers={customers}
        totalAssigned={totalAssigned}
        inboundCeiling={inboundCeiling}
      />

      <SmsPreviewModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        customers={customers}
        inboundCeiling={inboundCeiling}
      />

      <EmergencyOverrideModal
        isOpen={isEmergencyOverrideOpen}
        onClose={() => setIsEmergencyOverrideOpen(false)}
        onConfirmOverride={handleConfirmOverride}
      />

      <TankDetailModal
        tank={selectedTank}
        onClose={() => setSelectedTank(null)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <ProtocolModals
        type={protocolModalType}
        onClose={() => setProtocolModalType(null)}
      />
    </div>
  );
}
