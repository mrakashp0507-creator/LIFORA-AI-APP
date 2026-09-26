import { VaultState, User, Nominee, AccessPolicy, AuditLog, Language } from '../types';

const STORAGE_KEY = 'lifora_ai_mobile_vault_v2_zero_data';

export const DEFAULT_ACCESS_POLICY: AccessPolicy = {
  allow_financial_summary: true,
  allow_loans: true,
  allow_emi: true,
  allow_insurance: true,
  allow_bank_accounts: true,
  allow_property: true,
  allow_vehicles: true,
  allow_valuable_assets: true,
  allow_documents: true,
  allow_important_info: true,
  allow_personal_diary: false, // 🔒 STRICTLY FALSE BY DEFAULT!
  allow_financial_diary: true,
};

export const getEmptyVaultState = (): VaultState => ({
  user: null,
  token: null,
  accounts: [],
  loans: [],
  emis: [],
  insurance: [],
  commitments: [],
  moneyGiven: [],
  moneyBorrowed: [],
  properties: [],
  valuableAssets: [],
  vehicles: [],
  documents: [],
  personalDiary: [],
  financialDiary: [],
  importantInfo: [],
  nominees: [],
  safetyCheckin: null,
  emergencySession: null,
  auditLogs: [],
  language: 'en',
});

class StorageService {
  private state: VaultState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): VaultState {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        // Ensure all arrays are present and no corrupted nulls
        return {
          ...getEmptyVaultState(),
          ...parsed,
          accounts: parsed.accounts || [],
          loans: parsed.loans || [],
          emis: parsed.emis || [],
          insurance: parsed.insurance || [],
          commitments: parsed.commitments || [],
          moneyGiven: parsed.moneyGiven || [],
          moneyBorrowed: parsed.moneyBorrowed || [],
          properties: parsed.properties || [],
          valuableAssets: parsed.valuableAssets || [],
          vehicles: parsed.vehicles || [],
          documents: parsed.documents || [],
          personalDiary: parsed.personalDiary || [],
          financialDiary: parsed.financialDiary || [],
          importantInfo: parsed.importantInfo || [],
          nominees: parsed.nominees || [],
          auditLogs: parsed.auditLogs || [],
        };
      }
    } catch (e) {
      console.warn('Failed to parse stored vault', e);
    }
    // STRICT ZERO PREFILLED DATA
    const fresh = getEmptyVaultState();
    this.saveState(fresh);
    return fresh;
  }

  private saveState(state: VaultState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save vault state to local storage', e);
    }
  }

  public getState(): VaultState {
    return this.state;
  }

  public updateState(updater: (prev: VaultState) => VaultState): void {
    this.state = updater(this.state);
    this.saveState(this.state);
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error(err);
      }
    });
  }

  public logAudit(action: string, actor: string, details: string, severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO'): void {
    const entry: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      actor,
      details,
      timestamp: new Date().toISOString(),
      severity,
    };
    this.updateState((prev) => ({
      ...prev,
      auditLogs: [entry, ...prev.auditLogs],
    }));
  }

  public resetAllData(): void {
    const fresh = getEmptyVaultState();
    this.state = fresh;
    this.saveState(fresh);
    this.notify();
  }
}

export const storageService = new StorageService();
