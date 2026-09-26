import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  Lock, 
  Landmark, 
  CreditCard, 
  Building, 
  FileText, 
  LogOut,
  Calendar
} from 'lucide-react';
import { VaultState, Nominee } from '../../types';

interface MobileNomineePortalProps {
  state: VaultState;
  activeNominee: Nominee;
  ownerEfid: string;
  onLogout: () => void;
}

export const MobileNomineePortal: React.FC<MobileNomineePortalProps> = ({
  state,
  activeNominee,
  ownerEfid,
  onLogout
}) => {
  const policy = activeNominee.access_policy;
  const owner = state.user;

  const [selectedCategory, setSelectedCategory] = useState<string>('SUMMARY');
  const totalMonthlyEmi = state.loans.reduce((acc, l) => acc + (l.emi_amount || 0), 0);

  return (
    <div className="p-4 space-y-4">
      {/* Session Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block">
                Nominee Portal
              </span>
              <h2 className="text-sm font-bold text-stone-900">
                Welcome, {activeNominee.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="py-1 px-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <div>
            <span className="text-stone-400 block text-[10px]">OWNER E-FID:</span>
            <span className="font-mono font-bold text-stone-900">{ownerEfid}</span>
          </div>
          <div className="text-right">
            <span className="text-stone-400 block text-[10px]">ACCESS MODE:</span>
            <span className="font-semibold text-emerald-800">Controlled Grant</span>
          </div>
        </div>
      </div>

      {/* Permission Categories Filter Buttons */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        <button
          onClick={() => setSelectedCategory('SUMMARY')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'SUMMARY'
              ? 'bg-stone-900 text-white shadow-xs font-bold'
              : 'bg-white border border-stone-200 text-stone-600'
          }`}
        >
          Summary
        </button>

        {policy.allow_bank_accounts && (
          <button
            onClick={() => setSelectedCategory('ACCOUNTS')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'ACCOUNTS'
                ? 'bg-stone-900 text-white shadow-xs font-bold'
                : 'bg-white border border-stone-200 text-stone-600'
            }`}
          >
            Accounts ({state.accounts.length})
          </button>
        )}

        {policy.allow_loans && (
          <button
            onClick={() => setSelectedCategory('LOANS')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'LOANS'
                ? 'bg-stone-900 text-white shadow-xs font-bold'
                : 'bg-white border border-stone-200 text-stone-600'
            }`}
          >
            Loans & EMI ({state.loans.length})
          </button>
        )}

        {policy.allow_insurance && (
          <button
            onClick={() => setSelectedCategory('INSURANCE')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'INSURANCE'
                ? 'bg-stone-900 text-white shadow-xs font-bold'
                : 'bg-white border border-stone-200 text-stone-600'
            }`}
          >
            Insurance ({state.insurance.length})
          </button>
        )}

        {policy.allow_property && (
          <button
            onClick={() => setSelectedCategory('PROPERTY')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'PROPERTY'
                ? 'bg-stone-900 text-white shadow-xs font-bold'
                : 'bg-white border border-stone-200 text-stone-600'
            }`}
          >
            Properties ({state.properties.length})
          </button>
        )}

        {policy.allow_documents && (
          <button
            onClick={() => setSelectedCategory('DOCUMENTS')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'DOCUMENTS'
                ? 'bg-stone-900 text-white shadow-xs font-bold'
                : 'bg-white border border-stone-200 text-stone-600'
            }`}
          >
            Documents ({state.documents.length})
          </button>
        )}

        {policy.allow_financial_diary && (
          <button
            onClick={() => setSelectedCategory('DIRECTIVES')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'DIRECTIVES'
                ? 'bg-stone-900 text-white shadow-xs font-bold'
                : 'bg-white border border-stone-200 text-stone-600'
            }`}
          >
            Directives ({state.financialDiary.length})
          </button>
        )}
      </div>

      {/* SUMMARY */}
      {selectedCategory === 'SUMMARY' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Authorized Information Dossier
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Below are the verified continuity records granted to your nominee profile by {owner?.full_name || 'the vault owner'}.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase block font-medium">Bank Accounts</span>
                <span className="text-sm font-bold text-stone-900">
                  {policy.allow_bank_accounts ? `${state.accounts.length} Available` : 'Restricted'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase block font-medium">Loans & EMI</span>
                <span className="text-sm font-bold text-stone-900">
                  {policy.allow_loans ? `₹${totalMonthlyEmi.toLocaleString('en-IN')}/mo` : 'Restricted'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase block font-medium">Insurance</span>
                <span className="text-sm font-bold text-stone-900">
                  {policy.allow_insurance ? `${state.insurance.length} Policies` : 'Restricted'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase block font-medium">Document Vault</span>
                <span className="text-sm font-bold text-stone-900">
                  {policy.allow_documents ? `${state.documents.length} Deeds` : 'Restricted'}
                </span>
              </div>
            </div>
          </div>

          {!policy.allow_personal_diary && (
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between text-xs shadow-xs">
              <div className="flex items-center gap-2 text-stone-600">
                <Lock className="w-4 h-4 text-stone-400" />
                <span>Personal Diary & Private Notes</span>
              </div>
              <span className="text-[10px] font-semibold text-stone-400 uppercase">
                Access Restricted
              </span>
            </div>
          )}
        </div>
      )}

      {/* ACCOUNTS */}
      {selectedCategory === 'ACCOUNTS' && policy.allow_bank_accounts && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Bank Accounts
          </h3>
          {state.accounts.map((acc) => (
            <div key={acc.id} className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs shadow-xs">
              <h4 className="font-bold text-stone-900">{acc.bank_name}</h4>
              <p className="font-mono text-stone-700 font-semibold mt-0.5">
                Account: •••• {acc.masked_account_number.slice(-4)}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
                <span>{acc.account_type}</span>
                {acc.ifsc_code && <span>· IFSC: {acc.ifsc_code}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOANS */}
      {selectedCategory === 'LOANS' && policy.allow_loans && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Loans & EMI Commitments
          </h3>
          {state.loans.map((loan) => (
            <div key={loan.id} className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs shadow-xs">
              <h4 className="font-bold text-stone-900">{loan.provider}</h4>
              <p className="font-mono font-bold text-stone-900 text-sm mt-0.5">
                ₹{loan.emi_amount.toLocaleString('en-IN')}/mo EMI
              </p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
                <span>Due Date: {loan.due_date}</span>
                <span>· Outstanding: ₹{loan.outstanding_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INSURANCE */}
      {selectedCategory === 'INSURANCE' && policy.allow_insurance && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Insurance Policies
          </h3>
          {state.insurance.map((ins) => (
            <div key={ins.id} className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs shadow-xs">
              <h4 className="font-bold text-stone-900">{ins.provider} ({ins.insurance_type})</h4>
              <p className="font-mono font-bold text-emerald-800 mt-0.5">
                Coverage: ₹{ins.coverage_amount.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-stone-500 mt-1">
                Policy No: •••• {ins.policy_number_masked.slice(-4)} · Renewal: {ins.renewal_date}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* DOCUMENTS */}
      {selectedCategory === 'DOCUMENTS' && policy.allow_documents && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Documents & Deeds
          </h3>
          {state.documents.map((doc) => (
            <div key={doc.id} className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs space-y-1 shadow-xs">
              <h4 className="font-bold text-stone-900">{doc.title}</h4>
              <p className="text-[11px] text-stone-600">{doc.extracted_summary || doc.notes}</p>
              <div className="text-[10px] text-stone-500 font-mono">
                Category: {doc.category}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DIRECTIVES */}
      {selectedCategory === 'DIRECTIVES' && policy.allow_financial_diary && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Owner's Financial Directives
          </h3>
          {state.financialDiary.map((item) => (
            <div key={item.id} className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs space-y-1 shadow-xs">
              <h4 className="font-bold text-stone-900">{item.title}</h4>
              <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">{item.instructions}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
