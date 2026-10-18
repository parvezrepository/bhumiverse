'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CaseDetail } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import RiskBadge from '@/components/ui/RiskBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { Download, FileText, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { generateAndDownloadReport } from '@/lib/reportGenerator';

export default function ReportsPage() {
  const { lang } = useLanguage();
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Download className="w-6 h-6 text-[#0B6E4F]" />
          {lang === 'en' ? 'Downloadable Risk Audit Reports' : 'ডাউনলোডযোগ্য ঝুঁকি রিপোর্ট ভল্ট'}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {lang === 'en'
            ? 'Official court-ready and land registry audit certificates with cryptographic hashes and rule evidence.'
            : 'আপনার সংরক্ষিত যাচাইকরণ ফলাফলের প্রমাণভিত্তিক PDF অডিট রিপোর্টসমূহ'}
        </p>
      </div>

      <div className="gov-card rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {lang === 'en' ? 'Loading report list...' : 'রিপোর্ট তালিকা লোড হচ্ছে...'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Tracking ID' : 'ট্র্যাকিং আইডি'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Case Title' : 'কেসের নাম'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Risk Level' : 'ঝুঁকি স্তর'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Status' : 'স্ট্যাটাস'}</th>
                  <th className="py-3.5 px-4 text-right font-bold text-slate-800">{lang === 'en' ? 'Export' : 'ডাউনলোড'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#0B6E4F] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] inline-block">
                        {c.tracking_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge risk={c.risk_level} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => generateAndDownloadReport(c, lang)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B6E4F] hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> {lang === 'en' ? 'PDF Certificate' : 'PDF রিপোর্ট'}
                      </button>
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
