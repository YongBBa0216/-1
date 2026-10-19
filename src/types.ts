export type Tier = 'tier-1' | 'tier-2' | 'tier-3';

export interface CustomerQuota {
  id: string;
  rank: number;
  name: string;
  plant: string;
  sector: string;
  reqMt: number;
  score: number;
  ratioPct: number;
  tier: Tier;
  criticalityNote?: string;
  cleanroomRiskLevel?: 'Extreme' | 'High' | 'Moderate' | 'Low';
  slaPenaltyPerHrUsd?: number;
}

export interface CryoTank {
  id: string;
  name: string;
  type: string;
  runoutTime: string;
  runoutHours: number;
  capacityMt: number;
  currentMt: number;
  pressureBar: number;
  tempCelsius: number;
  status: 'nominal' | 'warning' | 'critical';
}

export interface InboundSupplier {
  name: string;
  amountMt: number;
  nominalMt: number;
  status: 'On-route' | 'Docked' | 'Force Maj.' | 'Delayed';
  statusColor: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  details: string;
  hash: string;
  severity: 'info' | 'warning' | 'critical';
}

export type ActiveTab = 'allocations' | 'telemetry' | 'simulation' | 'audit';
