'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CaseDetail } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import RiskBadge from '@/components/ui/RiskBadge';
import { 
  FileCheck, 
  Search, 
  ArrowRight, 
  PlusCircle,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MyCasesPage() {
  const { lang, t } = useLanguage();
  const [cases, setCases] = useState<CaseDetail[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      setLoading(true);
      const data = await api.getCases({
        search: search || undefined,
        status: statusFilter || undefined,
        risk_level: riskFilter || undefined
      });
      setCases(data);
      setLoading(false);
    }
    loadCases();
  }, [search, statusFilter, riskFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#0B6E4F]" />
            {lang === 'bn' ? 'আমার জমিসংক্রান্ত যাচাই কেসসমূহ' : 'My Land Verification Cases'}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {lang === 'bn'
              ? 'দাখিলকৃত সকল আবেদন, এআই স্ক্রিনিং ফলাফল ও বর্তমান স্ট্যাটাস'
              : 'All submitted verification cases, automated screening statuses, and risk levels'}
          </p>
        </div>

        <Link
          href="/dashboard/new-verification"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          {t('nav.new_verification')}
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center gap-3 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('common.search_placeholder')}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs outline-none cursor-pointer focus:border-[#0B6E4F]"
          >
            <option value="">{lang === 'bn' ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
            <option value="submitted">{lang === 'bn' ? 'দাখিলকৃত' : 'Submitted'}</option>
            <option value="under_review">{lang === 'bn' ? 'রিভিউ চলমান' : 'Under Review'}</option>
            <option value="approved">{lang === 'bn' ? 'অনুমোদিত' : 'Approved'}</option>
            <option value="escalated">{lang === 'bn' ? 'উচ্চ পর্যায়ে প্রেরণ' : 'Escalated'}</option>
          </select>

          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs outline-none cursor-pointer focus:border-[#0B6E4F]"
          >
            <option value="">{lang === 'bn' ? 'সকল ঝুঁকি স্তর' : 'All Risk Levels'}</option>
            <option value="low">{lang === 'bn' ? 'কম ঝুঁকি (বৈধ)' : 'Low Risk (Clean)'}</option>
            <option value="medium">{lang === 'bn' ? 'মাঝারি ঝুঁকি' : 'Medium Risk'}</option>
            <option value="high">{lang === 'bn' ? 'উচ্চ ঝুঁকি (বিরোধ)' : 'High Risk (Conflict)'}</option>
          </select>
        </div>
      </div>

      {/* Case List Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {lang === 'bn' ? 'কেস তালিকা লোড হচ্ছে...' : 'Loading case records...'}
          </div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <p>{lang === 'bn' ? 'কোনো কেস পাওয়া যায়নি।' : 'No matching cases found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'ট্র্যাকিং আইডি' : 'Tracking ID'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'কেসের নাম ও মৌজা' : 'Title & Mouza'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'দাগ ও খতিয়ান' : 'Plot Summary'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'ঝুঁকি স্তর' : 'Risk Level'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'অবস্থা' : 'Status'}</th>
                  <th className="py-3.5 px-4 text-right font-bold text-slate-800">{lang === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#0B6E4F] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] inline-block">
                        {c.tracking_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">{c.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {c.mouza || 'N/A'}, {c.upazila || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                        {c.plot_khatian_summary || 'Dag N/A'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge risk={c.risk_level} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/dashboard/cases/${c.id}`}
                        className="inline-flex items-center gap-1 text-[#0B6E4F] hover:text-emerald-800 font-bold text-xs bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded transition-colors"
                      >
                        {t('common.view_details')} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
