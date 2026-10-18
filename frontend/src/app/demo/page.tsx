'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CaseDetail, ExplainableFraudRadar, SmartDocumentDiffResponse, NetworkGraphData } from '@/lib/types';
import RiskBadge from '@/components/ui/RiskBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import ExplainableRadar from '@/components/radar/ExplainableRadar';
import SmartDocumentDiff from '@/components/diff/SmartDocumentDiff';
import FraudNetworkGraph from '@/components/graph/FraudNetworkGraph';
import TransactionTimeline from '@/components/timeline/TransactionTimeline';
import { 
  ShieldAlert, 
  Layers, 
  Network, 
  Clock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DemoPage() {
  const { lang, t } = useLanguage();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-demo-002');
  const [currentCase, setCurrentCase] = useState<CaseDetail | null>(null);
  const [radar, setRadar] = useState<ExplainableFraudRadar | null>(null);
  const [diff, setDiff] = useState<SmartDocumentDiffResponse | null>(null);
  const [graph, setGraph] = useState<NetworkGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'radar' | 'diff' | 'graph' | 'timeline'>('radar');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [c, r, d, g] = await Promise.all([
        api.getCase(selectedCaseId),
        api.getRadar(selectedCaseId),
        api.getDiff(selectedCaseId),
        api.getNetworkGraph(selectedCaseId)
      ]);
      setCurrentCase(c);
      setRadar(r);
      setDiff(d);
      setGraph(g);
      setLoading(false);
    }
    loadData();
  }, [selectedCaseId]);

  const demoScenarios = [
    { 
      id: 'case-demo-002', 
      label: lang === 'bn' ? '১. দ্বৈত বিক্রয় ঝুঁকি (দাগ ৪০৫, জোয়ার সাহারা)' : '1. Double-Selling Conflict (Dag 405, Joar Sahara)', 
      badge: lang === 'bn' ? 'উচ্চ ঝুঁকি' : 'HIGH RISK', 
      border: 'border-rose-400 bg-rose-50 text-rose-950' 
    },
    { 
      id: 'case-demo-001', 
      label: lang === 'bn' ? '২. বৈধ ও নির্ভেজাল রেকর্ড (দাগ ১০২৫, বাউনিয়া)' : '2. Clean Legitimate Title (Dag 1025, Baunia)', 
      badge: lang === 'bn' ? 'ঝুঁকিমুক্ত' : 'CLEAN', 
      border: 'border-emerald-400 bg-emerald-50 text-emerald-950' 
    },
    { 
      id: 'case-demo-003', 
      label: lang === 'bn' ? '৩. দলিল-নামজারি অমিল (দাগ ৭৫০ বনাম ৮২০)' : '3. Reg-Mutation Mismatch (Dag 750 vs 820)', 
      badge: lang === 'bn' ? 'উচ্চ ঝুঁকি' : 'HIGH RISK', 
      border: 'border-rose-400 bg-rose-50 text-rose-950' 
    },
    { 
      id: 'case-demo-004', 
      label: lang === 'bn' ? '৪. ডুপ্লিকেট ফাইল হ্যাশ (SHA-256 ম্যাচ)' : '4. Duplicate File Upload (SHA-256 Collision)', 
      badge: lang === 'bn' ? 'মাঝারি ঝুঁকি' : 'MEDIUM RISK', 
      border: 'border-amber-400 bg-amber-50 text-amber-950' 
    },
    { 
      id: 'case-demo-005', 
      label: lang === 'bn' ? '৫. জমির পরিমাপে অসঙ্গতি (৩৭.৫% অমিল)' : '5. Land Area Variance (37.5% Discrepancy)', 
      badge: lang === 'bn' ? 'উচ্চ ঝুঁকি' : 'HIGH RISK', 
      border: 'border-rose-400 bg-rose-50 text-rose-950' 
    },
    { 
      id: 'case-demo-008', 
      label: lang === 'bn' ? '৬. জাল বা পরিমার্জিত কপি (Altered Photocopy)' : '6. Altered Photocopy Fraud', 
      badge: lang === 'bn' ? 'উচ্চ ঝুঁকি' : 'HIGH RISK', 
      border: 'border-rose-400 bg-rose-50 text-rose-950' 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#064E3B] via-[#0B6E4F] to-[#047857] p-6 sm:p-7 text-white shadow-md border border-emerald-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold border border-amber-300/30">
                {lang === 'bn' ? 'বিচারক ও মূল্যায়ন স্যান্ডবক্স' : 'JUDGES & EVALUATION DEMO'}
              </span>
              <span className="text-[11px] text-emerald-200 font-mono">DEMO DATA — NOT OFFICIAL LAND RECORD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t('demo.title')}
            </h1>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              {t('demo.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              {lang === 'bn' ? 'নাগরিক ড্যাশবোর্ড দেখুন' : 'Citizen Dashboard'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 1-Click Scenario Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            {t('demo.select_scenario')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {demoScenarios.map((sc) => {
              const isSelected = selectedCaseId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedCaseId(sc.id)}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? `bg-white border-[#0B6E4F] ring-2 ring-[#0B6E4F]/30 shadow-md`
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      {sc.id.toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${sc.border}`}>
                      {sc.badge}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{sc.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Case Header */}
        {currentCase && (
          <div className="gov-card p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-[#0B6E4F] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {currentCase.tracking_id}
                </span>
                <StatusBadge status={currentCase.status} />
                <RiskBadge risk={currentCase.risk_level} />
              </div>
              <h2 className="text-base font-bold text-slate-900">{currentCase.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{currentCase.description}</p>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs gap-1">
              <button
                onClick={() => setActiveTab('radar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'radar' ? 'bg-[#0B6E4F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> {t('demo.tab_radar')}
              </button>
              <button
                onClick={() => setActiveTab('diff')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'diff' ? 'bg-[#0B6E4F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> {t('demo.tab_diff')}
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'graph' ? 'bg-[#0B6E4F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Network className="w-3.5 h-3.5" /> {t('demo.tab_graph')}
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'timeline' ? 'bg-[#0B6E4F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> {t('demo.tab_timeline')}
              </button>
            </div>
          </div>
        )}

        {/* Tab Content Display */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            {lang === 'bn' ? 'যাচাই তথ্য লোড হচ্ছে...' : 'Loading screening details...'}
          </div>
        ) : (
          <div className="transition-all">
            {activeTab === 'radar' && radar && (
              <ExplainableRadar radar={radar} caseId={selectedCaseId} />
            )}

            {activeTab === 'diff' && diff && (
              <SmartDocumentDiff diff={diff} />
            )}

            {activeTab === 'graph' && graph && (
              <FraudNetworkGraph graphData={graph} />
            )}

            {activeTab === 'timeline' && currentCase && (
              <TransactionTimeline events={currentCase.timeline} />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
