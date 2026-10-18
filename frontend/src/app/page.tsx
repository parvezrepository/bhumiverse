'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RiskBadge from '@/components/ui/RiskBadge';
import { 
  ShieldAlert, 
  ShieldCheck, 
  FileSearch, 
  Layers, 
  Network, 
  Clock, 
  ArrowRight, 
  FileCheck, 
  Sparkles,
  PlayCircle,
  AlertTriangle,
  ChevronRight,
  Fingerprint,
  FileText,
  Search,
  CheckCircle2,
  ExternalLink,
  Building2,
  Scale,
  BellRing
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LandingPage() {
  const { lang, t } = useLanguage();
  const [quickSearch, setQuickSearch] = useState('');

  const preSeededCases = [
    {
      id: 'case-demo-002',
      tracking_id: 'BV-2026-0002',
      title: lang === 'bn' ? 'দ্বৈত বিক্রয় ঝুঁকি (দাগ ৪০৫, জোয়ার সাহারা)' : 'Double-Selling Conflict (Dag 405, Joar Sahara)',
      summary: lang === 'bn' ? 'একই বিক্রেতা কর্তৃক ২০২০ এবং ২০২৩ সালে পৃথক দুই ক্রেতার নিকট সাফ কোবালা দলিল শনাক্ত।' : 'Same seller conveyed plot 405 to Kabir Ahmed (2020) and Tariqul Islam (2023).',
      risk: 'high',
      score: 88,
      rule: 'Rule B Flag',
      href: '/dashboard/cases/case-demo-002'
    },
    {
      id: 'case-demo-001',
      tracking_id: 'BV-2026-0001',
      title: lang === 'bn' ? 'বৈধ ও নির্ভেজাল রেকর্ড (দাগ ১০২৫, বাউনিয়া)' : 'Clean Legitimate Title (Dag 1025, Baunia)',
      summary: lang === 'bn' ? 'দলিল ও নামজারির দাগ, খতিয়ান ও ১২ শতক জমির শতভাগ নির্ভুল সামঞ্জস্য।' : 'Deed and AC Land mutation records align perfectly with zero variance.',
      risk: 'low',
      score: 5,
      rule: 'Clean Title',
      href: '/dashboard/cases/case-demo-001'
    },
    {
      id: 'case-demo-003',
      tracking_id: 'BV-2026-0003',
      title: lang === 'bn' ? 'দলিল-নামজারি অসঙ্গতি (দাগ ৭৫০ বনাম ৮২০)' : 'Reg-Mutation Mismatch (Dag 750 vs 820)',
      summary: lang === 'bn' ? 'সাব-রেজিস্ট্রি দলিলের দাগ ও নামজারি প্রস্তাবের দাগ এবং খতিয়ানে গরমিল।' : 'Registered deed plot 750 diverges from AC Land mutation application plot 820.',
      risk: 'high',
      score: 82,
      rule: 'Rule C Flag',
      href: '/dashboard/cases/case-demo-003'
    },
    {
      id: 'case-demo-004',
      tracking_id: 'BV-2026-0004',
      title: lang === 'bn' ? 'ডুপ্লিকেট ফাইল আপলোড (SHA-256 ম্যাচ)' : 'Duplicate File Upload (SHA-256 Collision)',
      summary: lang === 'bn' ? 'পূর্ববর্তী কেস BV-0001 এর সাথে হুবহু ক্রিপ্টোগ্রাফিক ফাইল হ্যাশ মিলে গেছে।' : 'Cryptographic SHA-256 collision identical to existing file in Case BV-0001.',
      risk: 'medium',
      score: 65,
      rule: 'Rule A Flag',
      href: '/dashboard/cases/case-demo-004'
    },
    {
      id: 'case-demo-005',
      tracking_id: 'BV-2026-0005',
      title: lang === 'bn' ? 'জমির পরিমাপে ৩৭.৫% অসংগতি' : 'Land Area Variance (37.5% Discrepancy)',
      summary: lang === 'bn' ? 'দলিল ২০ শতক বনাম নামজারিতে মাত্র ১২.৫ শতক রেকর্ড।' : 'Deed records 20.0 decimals but mutation application claims only 12.5 decimals.',
      risk: 'high',
      score: 78,
      rule: 'Rule D Flag',
      href: '/dashboard/cases/case-demo-005'
    },
    {
      id: 'case-demo-008',
      tracking_id: 'BV-2026-0008',
      title: lang === 'bn' ? 'জাল বা পরিমার্জিত ফটোকপি' : 'Altered Document Photocopy Fraud',
      summary: lang === 'bn' ? 'দলিল নম্বর একই রেখে ক্রেতার নাম ও তারিখ কাটছাঁটের অসংগতি চিহ্নিত।' : 'Matching deed serial number with tampered purchaser name on photocopy.',
      risk: 'high',
      score: 85,
      rule: 'Rule G Flag',
      href: '/dashboard/cases/case-demo-008'
    }
  ];

  const govServices = [
    {
      icon: ShieldAlert,
      title: lang === 'bn' ? 'দ্বৈত বিক্রয় অনুসন্ধান ও যাচাই' : 'Double-Selling Conflict Check',
      desc: lang === 'bn' ? 'একই দাগ ও খতিয়ানে গোপন বা পূর্ববর্তী রেজিস্ট্রিকৃত দলিলের অস্তিত্ব স্বয়ংক্রিয়ভাবে চিহ্নিতকরণ।' : 'Detects hidden or prior registered deeds conveying the same parcel to multiple buyers.',
      tag: 'Rule B Flag',
      href: '/dashboard/cases/case-demo-002',
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      icon: Layers,
      title: lang === 'bn' ? 'দলিল বনাম নামজারি খতিয়ান তুলনা' : 'Smart Deed vs Mutation Diff',
      desc: lang === 'bn' ? 'সাব-রেজিস্ট্রি দলিল এবং সহকারী কমিশনার (ভূমি) নামজারির দাগ, খতিয়ান ও পরিমাপের গরমিল চিহ্নিতকরণ।' : 'Visual side-by-side reconciliation highlighting plot, khatian, and area mismatches.',
      tag: 'Rules C & D',
      href: '/dashboard/cases/case-demo-003',
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      icon: Scale,
      title: lang === 'bn' ? 'ব্যাখ্যাযোগ্য ফ্রড রাডার স্কোর' : 'Explainable Fraud Radar',
      desc: lang === 'bn' ? '৮টি আইনি ও গাণিতিক রুলের ভিত্তিতে ০ থেকে ১০০ স্কেলে পূর্ণাঙ্গ ব্যাখ্যাযোগ্য ঝুঁকি পরিমাপ।' : 'Deterministic risk quantification with legal evidence citations across 8 verified rules.',
      tag: 'Rules A-H Metric',
      href: '/demo',
      color: 'text-[#006747] bg-emerald-50 border-emerald-200'
    },
    {
      icon: Network,
      title: lang === 'bn' ? 'জালিয়াত চক্র ও সিন্ডিকেট গ্রাফ' : 'Cross-Case Fraud Network Graph',
      desc: lang === 'bn' ? 'দাগ, ক্রেতা-বিক্রেতা, দলিল ও খতিয়ানের আন্তঃসম্পর্ক বিশ্লেষণ করে সংঘবদ্ধ জালিয়াত চক্র ম্যাপিং।' : 'Multi-case entity mapping revealing syndicate networks, proxy buyers, and plot disputes.',
      tag: 'Rule H Graph',
      href: '/admin/graph',
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      icon: Fingerprint,
      title: lang === 'bn' ? 'নকল ও পরিমার্জিত স্ক্যান ফিল্টার' : 'Altered & Duplicate Scan Filter',
      desc: lang === 'bn' ? 'ক্রিপ্টোগ্রাফিক SHA-256 হ্যাশ এবং টেক্সট টেম্পারিং ডিটেকশনের মাধ্যমে পরিমার্জিত স্ক্যান শনাক্ত।' : 'Cryptographic SHA-256 collision detection and photocopy tampering detection.',
      tag: 'Rules A & G',
      href: '/dashboard/cases/case-demo-004',
      color: 'text-purple-700 bg-purple-50 border-purple-200'
    },
    {
      icon: FileCheck,
      title: lang === 'bn' ? 'আদালতগ্রাহ্য ডিজিটাল অডিট সার্টিফিকেট' : 'Court-Ready Audit Certificate',
      desc: lang === 'bn' ? 'অপরিবর্তনীয় অডিট ট্রেইল ও সুনির্দিষ্ট ঝুঁকি বিশ্লেষণের ভিত্তিতে ডাউনলোডযোগ্য প্রাতিষ্ঠানিক PDF রিপোর্ট।' : 'Downloadable official PDF report complete with cryptographic hash, rule breakdown, and audit ledger.',
      tag: 'Official Report',
      href: '/dashboard/reports',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-slate-800">
      <Navbar />

      {/* 1. Official Government Notice Ticker (land.gov.bd Style) */}
      <div className="bg-[#FEF3C7] border-b border-amber-300 py-2 px-4 sm:px-6 lg:px-8 text-xs text-amber-950 font-medium">
        <div className="max-w-7xl mx-auto flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 bg-[#D97706] text-white px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide flex-shrink-0">
            <BellRing className="w-3 h-3" />
            {lang === 'bn' ? 'ভূমিসেবা বিজ্ঞপ্তি' : 'Notice'}
          </span>
          <p className="truncate">
            {lang === 'bn'
              ? 'ল্যান্ডটেক ইনোভেশন হ্যাকাথন ২০২৬ (সমস্যা ৩): সাব-রেজিস্ট্রার সাফ কোবালা দলিল ও নামজারি খতিয়ান স্বয়ংক্রিয় স্ক্রিনিং ব্যবস্থা। একই জমির গোপন দ্বৈত বিক্রয় ও জাল স্ক্যান চিহ্নিত করতে অনলাইন আবেদন করুন।'
              : 'LandTech Innovation Hackathon 2026 (Problem P3): Automated title deed and mutation screening engine detecting double-selling conflicts and fraudulent alterations.'}
          </p>
        </div>
      </div>

      {/* 2. Official Portal Hero Section (land.gov.bd Style) */}
      <section className="bg-white border-b border-slate-200 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Official Heading & Purpose */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-50 text-[#006747] border border-emerald-300 text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#006747]"></span>
                <span>{lang === 'bn' ? 'স্মার্ট ভূমি রেকর্ড ভেরিফিকেশন ও জালিয়াতি প্রতিরোধ | BHUMIverse' : 'Smart Land Record Verification & Fraud Prevention | BHUMIverse'}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                {lang === 'bn' ? (
                  <>
                    ভূমি জালিয়াতি ও দ্বৈত বিক্রয় <br />
                    <span className="text-[#006747]">প্রতিরোধ ও স্বয়ংক্রিয় যাচাইকরণ সিস্টেম</span>
                  </>
                ) : (
                  <>
                    AI-Assisted Land Fraud & <br />
                    <span className="text-[#006747]">Double-Selling Prevention Platform</span>
                  </>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {lang === 'bn'
                  ? 'কৃত্রিম বুদ্ধিমত্তা ও রুল-ভিত্তিক অ্যালগরিদমের মাধ্যমে জমির সাফ কোবালা দলিল, নামজারি খতিয়ান ও পর্চা স্বয়ংক্রিয়ভাবে যাচাই করুন। একই দাগের গোপন দ্বৈত বিক্রয়, দলিল-খতিয়ান গরমিল এবং পরিমার্জিত জালিয়াতি চিহ্নিত করুন সম্পূর্ণ ব্যাখ্যাযোগ্য প্রমাণের সাহায্যে।'
                  : 'Automated screening of registered deeds, mutation khatians, and survey records to uncover hidden double-selling, acreage discrepancies, and tampered documents with deterministic, explainable evidence.'}
              </p>

              {/* Action Buttons in Official Gov Green */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/dashboard/new-verification"
                  className="px-5 py-3 rounded-lg bg-[#006747] hover:bg-[#004D34] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4 text-amber-300" />
                  {lang === 'bn' ? 'অনলাইনে দলিল যাচাই করুন' : 'Verify Title Deed Online'}
                </Link>
                <Link
                  href="/demo"
                  className="px-5 py-3 rounded-lg bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4 text-amber-700" />
                  {lang === 'bn' ? 'বাস্তব কেস ডেমো পরীক্ষা করুন' : 'Test Live Case Trials'}
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-5 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006747]" />
                  {lang === 'bn' ? '৮টি নির্ধারিত রুল অ্যালগরিদম' : '8 Deterministic Rules'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006747]" />
                  {lang === 'bn' ? '১০০% ব্যাখ্যাযোগ্য রাডার' : '100% Explainable Radar'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006747]" />
                  {lang === 'bn' ? 'SHA-256 ফাইল অডিট ট্রেইল' : 'SHA-256 File Auditing'}
                </span>
              </div>
            </div>

            {/* Right Column: Official Inspection Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 rounded-xl border-2 border-slate-300 p-5 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {lang === 'bn' ? 'দ্বৈত বিক্রয় সংকেত প্রিভিউ' : 'Double-Selling Conflict Alert'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                    BV-2026-0002
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {lang === 'bn' ? 'জমির দাগ ও মৌজা:' : 'Plot & Mouza:'}
                    </span>
                    <span className="text-xs font-bold text-slate-900">দাগ ৪০৫ • মৌজা: জোয়ার সাহারা</span>
                  </div>
                  <RiskBadge risk="high" />
                </div>

                {/* Conflicting Deeds Summary */}
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded bg-white border border-rose-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">দলিল নং ৪৮২১ (২০২০)</span>
                      <span className="text-[11px] text-slate-500">ক্রেতা: কবীর আহমেদ • ১০ শতক</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">১ম বিক্রয়</span>
                  </div>

                  <div className="p-2.5 rounded bg-rose-50 border border-rose-300 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-rose-900 block">দলিল নং ৯১০২ (২০২৩)</span>
                      <span className="text-[11px] text-rose-700">ক্রেতা: তরিকুল ইসলাম • ১০ শতক (একই দাগ)</span>
                    </div>
                    <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">গোপন ২য় বিক্রয়</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] font-bold">Rule B Triggered</span>
                  <Link 
                    href="/dashboard/cases/case-demo-002" 
                    className="text-[#006747] hover:text-[#004D34] font-bold inline-flex items-center gap-1"
                  >
                    {lang === 'bn' ? 'সম্পূর্ণ তদন্ত দেখুন' : 'Inspect Conflict'} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Official Land Services Grid (land.gov.bd Style "ভূমি সংক্রান্ত সেবাসমূহ") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
          <div className="inline-block px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-[#006747] text-xs font-bold uppercase tracking-wider mb-1">
            {lang === 'bn' ? 'ডিজিটাল ভূমিসেবা মডিউল' : 'Digital Land Service Modules'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {lang === 'bn' ? 'ভূমি সংক্রান্ত ফ্রড ডিটেকশন সেবাসমূহ' : 'Land Fraud Prevention Services'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'bn' 
              ? 'নাগরিক ও ভূমি কর্মকর্তাদের সহায়তায় তৈরি ৬টি কেন্দ্রীয় স্ক্রিনিং ও অ্যানালাইসিস সেবা' 
              : 'Six core verification pillars designed for citizens, AC Land, and Sub-Registrar offices'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {govServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Link
                key={idx}
                href={service.href}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-[#006747] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-11 h-11 rounded-lg border flex items-center justify-center mb-3.5 ${service.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#006747] transition-colors mb-1.5">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {service.tag}
                  </span>
                  <span className="text-[#006747] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 font-bold">
                    {lang === 'bn' ? 'সেবা নিন' : 'Access'} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Pre-Seeded Hackathon Test Scenarios (Official Registry Table) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold text-[#006747] uppercase tracking-wider">
                {lang === 'bn' ? 'বাস্তবধর্মী সিন্থেটিক ডেটাসেট' : 'Synthetic Hackathon Dataset'}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {lang === 'bn' ? 'পরীক্ষামূলক কেস ট্রায়াল (৬টি সিনারিও)' : 'Evaluation Test Cases (6 Scenarios)'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'bn' ? 'যেকোনো একটি কেসে ক্লিক করে তাৎক্ষণিক সম্পূর্ণ রুল ব্যাখ্যা ও ডিফারেন্স ফলাফল দেখুন' : 'Click any pre-seeded scenario to evaluate the rule engine and diff report'}
              </p>
            </div>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-[#006747] hover:bg-emerald-100 text-xs font-bold border border-emerald-300 transition-colors self-start sm:self-auto"
            >
              <PlayCircle className="w-4 h-4" />
              {lang === 'bn' ? 'সম্পূর্ণ স্যান্ডবক্স ওপেন করুন' : 'Open Complete Sandbox'}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {preSeededCases.map((c) => (
              <Link
                key={c.id}
                href={c.href}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#006747] hover:shadow-xs transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {c.tracking_id}
                    </span>
                    <RiskBadge risk={c.risk as any} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#006747] transition-colors mb-1.5">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.summary}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="text-[10px] font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {c.rule}
                  </span>
                  <span className="text-[#006747] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 font-bold">
                    {lang === 'bn' ? 'তদন্ত রিপোর্ট' : 'Report'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 3-Step Simple Government Verification Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="bg-[#004D34] text-white rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {lang === 'bn' ? 'অনলাইন দলিল যাচাইকরণের ৩টি সহজ ধাপ' : '3-Step Verification Process'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              {lang === 'bn' ? 'স্বয়ংক্রিয় এআই ইঞ্জিন ও সাব-রেজিস্ট্রি ডাটাবেজ যাচাইকরণ পদ্ধতি' : 'Automated AI document ingestion, cross-matching, and audit certificate'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-lg bg-[#003826] border border-emerald-700/60 space-y-2">
              <span className="text-2xl font-black text-amber-300 block font-mono">০১</span>
              <h3 className="text-sm font-bold text-white">
                {lang === 'bn' ? 'দলিল ও খতিয়ান আপলোড' : '1. Upload Deed & Record'}
              </h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                {lang === 'bn' 
                  ? 'সাফ কোবালা দলিল বা নামজারি আবেদন কপি আপলোড করুন। স্বয়ংক্রিয় ওসিআর ফিল্ডগুলো বের করবে।' 
                  : 'Upload title deed PDF/image or mutation copy. Deterministic OCR extracts names, plots, and dates.'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#003826] border border-emerald-700/60 space-y-2">
              <span className="text-2xl font-black text-amber-300 block font-mono">০২</span>
              <h3 className="text-sm font-bold text-white">
                {lang === 'bn' ? 'এআই ক্রস-ম্যাচ ও ফ্রড স্ক্রিনিং' : '2. Automated Cross-Matching'}
              </h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                {lang === 'bn' 
                  ? '৮টি রুলের সাহায্যে একই দাগের পূর্ববর্তী বিক্রি, নামজারির গরমিল ও জাল ফটোকপি স্ক্যান করা হয়।' 
                  : '8 deterministic rules inspect prior sales, discrepancy percentages, and photocopy tampering.'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#003826] border border-emerald-700/60 space-y-2">
              <span className="text-2xl font-black text-amber-300 block font-mono">০৩</span>
              <h3 className="text-sm font-bold text-white">
                {lang === 'bn' ? 'অডিট সার্টিফিকেট ও সিদ্ধান্ত' : '3. Audit Certificate & Decision'}
              </h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                {lang === 'bn' 
                  ? 'ব্যাখ্যাযোগ্য প্রমাণসহ পিডিএফ রিপোর্ট তৈরি হয় এবং কর্মকর্তা বা নাগরিককে সঠিক সিদ্ধান্ত নিতে সাহায্য করে।' 
                  : 'Generate a cryptographic audit certificate with radar score, diff table, and court-ready citations.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Responsible AI Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-xs leading-relaxed flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <p>
            <strong>{lang === 'bn' ? 'দায়বদ্ধতা সংক্রান্ত বিজ্ঞপ্তি:' : 'Disclaimer:'}</strong>{' '}
            {lang === 'bn'
              ? 'BHUMIverse প্ল্যাটফর্মের সকল ফলাফল নিয়ম-ভিত্তিক স্ক্রিনিং সহকারী হিসেবে প্রদত্ত। চূড়ান্ত আইনি সিদ্ধান্ত ক্ষমতাপ্রাপ্ত ভূমি কর্মকর্তা (এসিল্যান্ড/সাব-রেজিস্ট্রার) দ্বারা সম্পাদিত হবে।'
              : 'BHUMIverse serves as a deterministic risk screening assistant. Final administrative and title decisions rest with authorized Land Officers (AC Land / Sub-Registrars).'}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
