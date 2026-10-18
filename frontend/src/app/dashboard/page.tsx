'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CaseDetail } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import RiskBadge from '@/components/ui/RiskBadge';
import { 
  PlusCircle, 
  FileCheck, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardOverviewPage() {
  const { lang, t } = useLanguage();
  const [cases, setCases] = useState<CaseDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      const data = await api.getCases();
      setCases(data);
      setLoading(false);
    }
    loadCases();
  }, []);

  const totalSubmitted = cases.length;
  const processing = cases.filter(c => c.status === 'processing' || c.status === 'submitted').length;
  const awaitingReview = cases.filter(c => c.status === 'under_review').length;
  const potentialConflicts = cases.filter(c => c.risk_level === 'high' || c.findings.some(f => f.severity === 'high')).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#064E3B] via-[#0B6E4F] to-[#047857] p-6 sm:p-7 text-white shadow-md border border-emerald-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            {t('nav.citizen_portal')}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {lang === 'bn' ? 'স্বাগতম, আপনার জমির নথি যাচাই ড্যাশবোর্ড' : 'Welcome to Your Land Records Verification Dashboard'}
          </h1>
          <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed font-normal">
            {lang === 'bn'
              ? 'দলিল ও নামজারির বিরোধ যাচাইকরণ, খতিয়ান ট্র্যাকিং এবং কৃত্রিম বুদ্ধিমত্তা চালিত দ্বৈত বিক্রয় ঝুঁকি স্ক্রিনিং।'
              : 'Real-time deed vs mutation discrepancy screening, double-selling risk detection, and audit reports.'}
          </p>
        </div>

        <Link
          href="/dashboard/new-verification"
          className="relative z-10 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md whitespace-nowrap transition-all"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          {t('nav.new_verification')}
        </Link>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Submitted */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-bold">
              {lang === 'bn' ? 'মোট দাখিলকৃত কেস' : 'Total Submitted Cases'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">{totalSubmitted}</div>
        </div>

        {/* Card 2: Processing */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-bold">
              {lang === 'bn' ? 'প্রক্রিয়াকরণ চলছে' : 'Processing / OCR'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-700 tracking-tight">{processing}</div>
        </div>

        {/* Card 3: Awaiting Officer Review */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-bold">
              {lang === 'bn' ? 'অফিসার রিভিউ অপেক্ষমান' : 'Awaiting Review'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-700 tracking-tight">{awaitingReview}</div>
        </div>

        {/* Card 4: Potential Conflict Cases */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-bold">
              {lang === 'bn' ? 'সম্ভাব্য বিরোধ / ঝুঁকি' : 'High Risk Conflicts'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-700 tracking-tight">{potentialConflicts}</div>
        </div>
      </div>

      {/* Recent Cases Section */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0B6E4F]" />
              {lang === 'bn' ? 'সাম্প্রতিক যাচাইকরণ কেসসমূহ' : 'Recent Verification Cases'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'bn' ? 'আপনার দাখিলকৃত জমিসংক্রান্ত যাচাই আবেদনসমূহ' : 'Latest land record submissions and AI screening statuses'}
            </p>
          </div>
          <Link
            href="/dashboard/cases"
            className="text-xs font-bold text-[#0B6E4F] hover:text-emerald-800 inline-flex items-center gap-1 transition-colors"
          >
            {lang === 'bn' ? 'সব কেস দেখুন' : 'View All Cases'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {lang === 'bn' ? 'তথ্য লোড হচ্ছে...' : 'Loading case records...'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-slate-800">
                    {lang === 'bn' ? 'ট্র্যাকিং আইডি' : 'Tracking ID'}
                  </th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">
                    {lang === 'bn' ? 'শিরোনাম ও মৌজা' : 'Case Title & Mouza'}
                  </th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">
                    {lang === 'bn' ? 'দাগ ও খতিয়ান' : 'Plot / Dag Summary'}
                  </th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">
                    {lang === 'bn' ? 'ঝুঁকি স্তর' : 'Risk Level'}
                  </th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">
                    {lang === 'bn' ? 'অবস্থা' : 'Status'}
                  </th>
                  <th className="py-3.5 px-4 text-right font-bold text-slate-800">
                    {lang === 'bn' ? 'পদক্ষেপ' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {cases.slice(0, 8).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#0B6E4F] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] inline-block">
                        {c.tracking_id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 line-clamp-1 text-xs">{c.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {c.mouza || 'N/A'}, {c.upazila || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-700 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                        {c.plot_khatian_summary || 'Dag N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge risk={c.risk_level} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
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
