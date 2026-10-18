'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CaseDetail } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import StatusBadge from '@/components/ui/StatusBadge';
import RiskBadge from '@/components/ui/RiskBadge';
import { FileCheck, Search, Filter, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminAllCasesPage() {
  const { lang } = useLanguage();
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
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-[#0B6E4F]" />
          {lang === 'en' ? 'Registered Land Case Database' : 'সকল রেজিস্ট্রিকৃত কেস ডাটাবেজ'}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {lang === 'en'
            ? 'Complete repository of citizen submissions, verification logs, and synthetic test cases.'
            : 'সিস্টেমের অন্তর্ভুক্ত সকল নাগরিক আবেদন ও সিন্থেটিক ডেটাসেট রেকর্ড'}
        </p>
      </div>

      <div className="gov-card p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'en' ? 'Search by Case ID, Plot number, or Applicant...' : 'কেস আইডি, দাগ নম্বর, বা আবেদনকারীর তথ্য খুঁজুন...'}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs outline-none cursor-pointer focus:border-[#0B6E4F]"
        >
          <option value="">{lang === 'en' ? 'All Statuses' : 'সকল স্ট্যাটাস'}</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="info_requested">Info Requested</option>
          <option value="escalated">Escalated</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value)}
          className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs outline-none cursor-pointer focus:border-[#0B6E4F]"
        >
          <option value="">{lang === 'en' ? 'All Risk Levels' : 'সকল ঝুঁকি স্তর'}</option>
          <option value="high">{lang === 'en' ? 'High Risk Conflict' : 'উচ্চ ঝুঁকি (কনফ্লিক্ট)'}</option>
          <option value="medium">{lang === 'en' ? 'Medium Risk Discrepancy' : 'মাঝারি ঝুঁকি (অসঙ্গতি)'}</option>
          <option value="low">{lang === 'en' ? 'Low Risk (Clean)' : 'নিম্ন ঝুঁকি (স্বচ্ছ)'}</option>
          <option value="insufficient_data">{lang === 'en' ? 'Insufficient Data' : 'অপর্যাপ্ত তথ্য'}</option>
        </select>
      </div>

      <div className="gov-card rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {lang === 'en' ? 'Loading case registry...' : 'কেস রেজিস্ট্রি লোড হচ্ছে...'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Tracking ID' : 'ট্র্যাকিং আইডি'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Case Title' : 'কেসের নাম'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Plot & Khatian' : 'দাগ ও খতিয়ান'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Risk Level' : 'ঝুঁকি স্তর'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Status' : 'স্ট্যাটাস'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Reviews' : 'রিভিউ'}</th>
                  <th className="py-3.5 px-4 text-right font-bold text-slate-800">{lang === 'en' ? 'Action' : 'পদক্ষেপ'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {cases.map(c => (
                  <tr key={c.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded text-[11px] inline-block">
                        {c.tracking_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.title}</div>
                      <div className="text-[11px] text-slate-500">{c.mouza || 'N/A'}, {c.upazila || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono">
                      {c.plot_khatian_summary || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge risk={c.risk_level} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {lang === 'en' ? `${c.reviews.length} reviews` : `${c.reviews.length} টি সিদ্ধান্ত`}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/dashboard/cases/${c.id}`}
                        className="inline-flex items-center gap-1 text-[#0B6E4F] hover:text-emerald-800 font-bold text-xs bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded transition-colors"
                      >
                        {lang === 'en' ? 'View Analysis' : 'বিস্তারিত'} <ArrowRight className="w-3.5 h-3.5" />
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
