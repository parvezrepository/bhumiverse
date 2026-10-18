'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CaseDetail } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import RiskBadge from '@/components/ui/RiskBadge';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Layers, 
  HelpCircle, 
  FileCheck, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileQuestion,
  ChevronRight,
  X,
  MapPin,
  Network
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminOverviewPage() {
  const { lang, t } = useLanguage();
  const [metrics, setMetrics] = useState<any>(null);
  const [cases, setCases] = useState<CaseDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeCase, setActiveCase] = useState<CaseDetail | null>(null);
  const [reviewAction, setReviewAction] = useState<string>('mark_reviewed');
  const [reviewReason, setReviewReason] = useState<string>('');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      const m = await api.getAdminMetrics();
      setMetrics(m);
      const c = await api.getCases();
      setCases(c);
      setLoading(false);
    }
    loadAdminData();
  }, []);

  const openReviewModal = (c: CaseDetail) => {
    setActiveCase(c);
    setReviewAction(c.risk_level === 'high' ? 'escalate' : 'mark_reviewed');
    setReviewReason(
      c.risk_level === 'high'
        ? (lang === 'bn' ? 'উচ্চ মাত্রার প্লট বিরোধ চিহ্নিত; সাব-রেজিস্ট্রি বালাম বই তল্লাশি প্রয়োজন।' : 'High severity plot conflict detected; requires District Sub-Registry balam inspection.')
        : (lang === 'bn' ? 'নিষ্কাশিত দলিল ও নামজারি রেকর্ড পর্যবেক্ষণ সম্পন্ন।' : 'Reviewed extracted deed and mutation records.')
    );
    setReviewNotes('');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;
    setReviewSubmitting(true);

    try {
      await api.adminReviewCase(activeCase.id, reviewAction, reviewReason, reviewNotes);
      const updated = await api.getCases();
      setCases(updated);
      const m = await api.getAdminMetrics();
      setMetrics(m);
      setReviewModalOpen(false);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const highPriorityCases = cases.filter(
    c => c.risk_level === 'high' || c.status === 'under_review' || c.status === 'escalated'
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Admin Header */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 p-6 sm:p-7 text-white shadow-md border border-purple-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            {t('nav.officer_portal')}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
            {lang === 'bn' ? 'ভূমি রেকর্ড জালিয়াতি ও বিরোধ অনুসন্ধান কনসোল' : 'Land Records Fraud & Conflict Review Console'}
          </h1>
          <p className="text-xs text-purple-200 mt-1 max-w-2xl leading-relaxed font-normal">
            {lang === 'bn'
              ? 'দ্বৈত বিক্রয়, দলিল-নামজারি অসঙ্গতি এবং সন্দেহজনক রেকর্ডের কেন্দ্রীয় প্রশাসনিক পর্যালোচনা ও অডিট ট্রেইল।'
              : 'Central administrative screening for multiple conveyances, deed-mutation discrepancies, and audit logging.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/graph"
            className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Network className="w-4 h-4" />
            {lang === 'bn' ? 'গ্লোবাল ফ্রড গ্রাফ' : 'Global Fraud Graph'}
          </Link>
        </div>
      </div>

      {/* 6 Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
          <span className="text-slate-600 text-[10px] uppercase font-bold block">
            {lang === 'bn' ? 'মোট কেস' : 'Total Cases'}
          </span>
          <span className="text-2xl font-black text-slate-900">{metrics?.total_cases ?? 20}</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
          <span className="text-amber-700 text-[10px] uppercase font-bold block">
            {lang === 'bn' ? 'রিভিউ অপেক্ষমান' : 'Pending Review'}
          </span>
          <span className="text-2xl font-black text-amber-700">{metrics?.pending_reviews ?? 4}</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
          <span className="text-rose-700 text-[10px] uppercase font-bold block">
            {lang === 'bn' ? 'দ্বৈত বিক্রয় বিরোধ' : 'Double Selling'}
          </span>
          <span className="text-2xl font-black text-rose-700">{metrics?.double_selling_conflicts ?? 2}</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
          <span className="text-purple-700 text-[10px] uppercase font-bold block">
            {lang === 'bn' ? 'রেজি-নামজারি অমিল' : 'Reg-Mutation Mismatch'}
          </span>
          <span className="text-2xl font-black text-purple-700">{metrics?.reg_mutation_mismatches ?? 1}</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
          <span className="text-blue-700 text-[10px] uppercase font-bold block">
            {lang === 'bn' ? 'অসম্পূর্ণ তথ্য' : 'Incomplete Data'}
          </span>
          <span className="text-2xl font-black text-blue-700">{metrics?.incomplete_data_cases ?? 1}</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
          <span className="text-[#0B6E4F] text-[10px] uppercase font-bold block">
            {lang === 'bn' ? 'অনুমোদিত কেস' : 'Approved Cases'}
          </span>
          <span className="text-2xl font-black text-[#0B6E4F]">{metrics?.approved_cases ?? 14}</span>
        </div>
      </div>

      {/* High-Priority Review Queue */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              {lang === 'bn' ? 'জরুরি পর্যালোচনা ও বিরোধ কিউ' : 'High-Priority Review Queue'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'bn'
                ? 'যে সকল কেসে দ্বৈত হস্তান্তর, নামজারি অমিল বা উচ্চ ঝুঁকির সংকেত পরিলক্ষিত হয়েছে'
                : 'Cases flagged with multiple conveyances, area variances, or altered records'}
            </p>
          </div>
          <span className="text-xs text-rose-800 font-bold bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
            {highPriorityCases.length} {lang === 'bn' ? 'টি কেস অ্যাকশন প্রয়োজন' : 'Cases Requiring Action'}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {lang === 'bn' ? 'কিউ ডাটা লোড হচ্ছে...' : 'Loading queue data...'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'ট্র্যাকিং আইডি' : 'Tracking ID'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'কেসের নাম ও মৌজা' : 'Title & Mouza'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'শনাক্তকৃত প্রধান অসঙ্গতি' : 'Flagged Conflict Summary'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'ঝুঁকি স্তর' : 'Risk Level'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'বর্তমান স্ট্যাটাস' : 'Status'}</th>
                  <th className="py-3.5 px-4 text-right font-bold text-slate-800">{lang === 'bn' ? 'অফিসার অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {highPriorityCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded text-[11px] inline-block">
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
                    <td className="py-3.5 px-4 text-slate-700">
                      {c.findings[0]?.title || (lang === 'bn' ? 'মাল্টি-কনভেয়েন্স ঝুঁকি বিশ্লেষণ সম্পন্ন' : 'Multi-conveyance risk analysis completed')}
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge risk={c.risk_level} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openReviewModal(c)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                      >
                        {lang === 'bn' ? 'রিভিউ করুন' : 'Review'}
                      </button>
                      <Link
                        href={`/dashboard/cases/${c.id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors border border-slate-200"
                      >
                        {t('common.view_details')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Officer Decision Action Modal */}
      {reviewModalOpen && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xl bg-white text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {lang === 'bn' ? 'অফিসার রিভিউ সিদ্ধান্ত:' : 'Officer Review Action:'} {activeCase.tracking_id}
                </h3>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">{activeCase.title}</div>
              <div className="text-slate-500">{activeCase.mouza}, Dag {activeCase.plot_khatian_summary}</div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'রিভিউ সিদ্ধান্ত' : 'Decision Action'}
                </label>
                <select
                  value={reviewAction}
                  onChange={e => setReviewAction(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 outline-none cursor-pointer focus:border-purple-700"
                >
                  <option value="mark_reviewed">{lang === 'bn' ? 'পর্যালোচনা চলমান (Mark as Reviewed)' : 'Mark as Reviewed'}</option>
                  <option value="approve_workflow">{lang === 'bn' ? 'ওয়ার্কফ্লো অনুমোদন (Approve Workflow)' : 'Approve Workflow'}</option>
                  <option value="reject_workflow">{lang === 'bn' ? 'আবেদন নাকচ (Reject Workflow)' : 'Reject Workflow'}</option>
                  <option value="request_more_info">{lang === 'bn' ? 'অতিরিক্ত নথি তলব (Request More Info)' : 'Request More Info'}</option>
                  <option value="escalate">{lang === 'bn' ? 'উর্ধ্বতন মহলে প্রেরণ (Escalate for Inquiry)' : 'Escalate for Higher Inquiry'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'সিদ্ধান্তের কারণ *' : 'Statutory Reason *'}
                </label>
                <textarea
                  value={reviewReason}
                  onChange={e => setReviewReason(e.target.value)}
                  required
                  rows={3}
                  placeholder={lang === 'bn' ? 'সিদ্ধান্তের সুনির্দিষ্ট আইনি বা রেকর্ড সংক্রান্ত কারণ লিখুন...' : 'Specify grounds for decision...'}
                  className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-purple-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'অভ্যন্তরীণ নোট (ঐচ্ছিক)' : 'Internal Notes (Optional)'}
                </label>
                <input
                  type="text"
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder={lang === 'bn' ? 'রেজিস্ট্রি ভলিউম বই তল্লাশির নোট...' : 'Sub-Registry volume cross-check note...'}
                  className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-purple-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md transition-all cursor-pointer"
                >
                  {reviewSubmitting 
                    ? (lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') 
                    : (lang === 'bn' ? 'সিদ্ধান্ত সেভ করুন' : 'Save Review Decision')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
