'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Layers, 
  Network, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Fingerprint
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FeaturesPage() {
  const { lang, t } = useLanguage();

  const rules = [
    {
      id: 'RULE_A',
      title: lang === 'bn' ? 'রুল A: ডুপ্লিকেট ফাইল হ্যাশ ডিটেকশন' : 'Rule A: Duplicate File Hash Detection',
      tag: 'Cryptographic SHA-256',
      desc: lang === 'bn' 
        ? 'আপলোডকৃত দলিলের বিট-লেভেল ক্রিপ্টোগ্রাফিক হ্যাশ যাচাই করে ডুপ্লিকেট সাবমিশন চিহ্নিত করে। গুরুত্বপূর্ণ: হুবহু ফাইল হ্যাশ প্রতারণার প্রমাণ নয়, বরং অতিরিক্ত বা রিডানড্যান্ট আবেদন নির্দেশ করে।'
        : 'Verifies bit-level cryptographic hashes of uploaded documents to detect identical submissions. Flags redundant cases without falsely accusing citizens of fraud.',
      benefit: lang === 'bn' ? 'রিডানড্যান্ট বা ডুপ্লিকেট আবেদন প্রতিরোধ' : 'Redundant claim & duplicate record prevention'
    },
    {
      id: 'RULE_B',
      title: lang === 'bn' ? 'রুল B: দ্বৈত বিক্রয় ঝুঁকি (Double-Selling)' : 'Rule B: Potential Double-Selling Risk',
      tag: 'Critical Conflict Flag',
      desc: lang === 'bn'
        ? 'একই প্লট (জেলা, উপজেলা, মৌজা, খতিয়ান, দাগ) একাধিক পৃথক বিক্রয় দলিলে বিভিন্ন ব্যক্তির কাছে হস্তান্তরের বিরোধ যাচাই করে। নামজারি হালনাগাদ হওয়ার আগেই দ্বিতীয় অননুমোদিত হস্তান্তর হলে উচ্চ সতর্কবার্তা দেয়।'
        : 'Detects conflicting active sale deeds executed to different buyers for the identical normalized plot before mutation records update.',
      benefit: lang === 'bn' ? 'একই জমি একাধিক বিক্রির প্রতারণা প্রতিরোধ' : 'Guarantees protection against fraudulent secondary plot sales'
    },
    {
      id: 'RULE_C',
      title: lang === 'bn' ? 'রুল C: দলিল-নামজারি অসঙ্গতি' : 'Rule C: Registration-Mutation Mismatch',
      tag: 'Sub-Registry vs AC Land Cross-Check',
      desc: lang === 'bn'
        ? 'সাব-রেজিস্ট্রারের সাফ কোবালা দলিল এবং এসিল্যান্ডের নামজারি খতিয়ানের দাগ ও জমির পরিমাণ তুলনা করে। কোনো একটি নথি অনুপস্থিত থাকলে ভুল রায় না দিয়ে "Insufficient Data" প্রদর্শন করে।'
        : 'Compares registered deed plot/khatian/area against mutation records. Safely returns "Insufficient Data" when one document is missing instead of producing false alarms.',
      benefit: lang === 'bn' ? 'নামজারি দলিল অনুসরণ করছে কি না তা নিশ্চিতকরণ' : 'Ensures mutation strictly traces registered deed schedule'
    },
    {
      id: 'RULE_D',
      title: lang === 'bn' ? 'রুল D: জমির পরিমাপে অসঙ্গতি (Area Variance)' : 'Rule D: Conflicting Land Area Variance',
      tag: 'Unit Normalization (শতক, কাঠা, বিঘা)',
      desc: lang === 'bn'
        ? 'কাঠা, শতক ও একরকে সমন্বিত দশমিকে রূপান্তর করে দলিলের জমির পরিমাপের বিচ্যুতি যাচাই করে। ৩% সহনশীলতার অধিক তফাত থাকলে ফিল্ড সার্ভেয়ার ও আমিন দিয়ে মাপার সুপারিশ করে।'
        : 'Normalizes decimals, katha, bigha, and acres into square footage; flags discrepancies exceeding 3% tolerance for surveyor ground measurement.',
      benefit: lang === 'bn' ? 'অতিরঞ্জিত দাবি ও অনথিভুক্ত রাস্তা কর্তন শনাক্ত' : 'Catches unrecorded road deductions or inflated plot claims'
    },
    {
      id: 'RULE_E',
      title: lang === 'bn' ? 'রুল E: অপরিহার্য তথ্যের অনুপস্থিতি' : 'Rule E: Missing Critical Metadata',
      tag: 'Incomplete Information Guard',
      desc: lang === 'bn'
        ? 'দাগ, খতিয়ান বা মৌজার মতো অপরিহার্য ফিল্ড স্ক্যানে অস্পষ্ট বা অনুপস্থিত থাকলে তা চিহ্নিত করে। সিস্টেম এটিকে জালিয়াতি না বলে "অসম্পূর্ণ তথ্য" হিসেবে চিহ্নিত করে।'
        : 'Identifies unreadable or missing essential fields (Dag, Khatian, Mouza). Classifies cases as Incomplete Information rather than fraud.',
      benefit: lang === 'bn' ? 'অস্পষ্ট দলিলের কারণে মিথ্যা জালিয়াতি অভিযোগ রোধ' : 'Prevents false fraud accusations caused by damaged stamp paper'
    },
    {
      id: 'RULE_F',
      title: lang === 'bn' ? 'রুল F: লো ওসিআর কনফিডেন্স অ্যালার্ট' : 'Rule F: Low OCR Confidence Alert',
      tag: 'Digit Confidence Verification',
      desc: lang === 'bn'
        ? 'বাংলা বা ইংরেজি অক্ষরের স্ক্যান মান ৭০% এর নিচে নামলে স্বয়ংক্রিয়ভাবে মানবিক পর্যালোচকের ভেরিফিকেশন রিকোয়েস্ট পাঠায় এবং ম্যানুয়াল কারেকশন সংরক্ষণ করে।'
        : 'Flags scanned fields with confidence score under 70% for manual human review while permanently preserving the original scanned values.',
      benefit: lang === 'bn' ? 'স্বয়ংক্রিয় ভুলের বদলে অফিসার ম্যানুয়াল চেক নিশ্চিত' : 'Enforces human-in-the-loop review for blurry or faded scans'
    },
    {
      id: 'RULE_G',
      title: lang === 'bn' ? 'রুল G: জাল বা পরিমার্জিত ফটোকপি' : 'Rule G: Altered Document Photocopy',
      tag: 'Tampering Screener',
      desc: lang === 'bn'
        ? 'একই দলিল নম্বরে দুটি ভিন্ন কপিতে গ্রহীতার নাম বা হস্তান্তরের বিবরণে পরিবর্তন থাকলে সম্ভাব্য জালিয়াতি হিসেবে চিহ্নিত করে বালাম বহির তল্লাশির সুপারিশ করে।'
        : 'Compares matching deed serial numbers across versions with divergent buyer names, dates, or consideration amounts.',
      benefit: lang === 'bn' ? 'ক্রেতাদের নিকট উপস্থাপন করা ভুয়া ফটোকপি শনাক্ত' : 'Catches manipulated xerox copies presented to unsuspecting buyers'
    },
    {
      id: 'RULE_H',
      title: lang === 'bn' ? 'রুল H: অসঙ্গতিপূর্ণ লেনদেন টাইমলাইন' : 'Rule H: Inconsistent Transaction Timeline',
      tag: 'Chronological Sequence Engine',
      desc: lang === 'bn'
        ? 'দলিল সম্পাদন এবং সাব-রেজিস্ট্রি রেজিস্ট্রেশনের কালক্রমিক ধারাবাহিকতা বিশ্লেষণ করে। কার্য সম্পাদনের পূর্বেই নিবন্ধন বা বিচ্ছিন্ন ওয়ারিশ হস্তান্তর শনাক্ত করে।'
        : 'Analyzes chronological sequence of execution, registration, and mutation. Flags registrations preceding execution or unlinked succession.',
      benefit: lang === 'bn' ? 'ভুল তারিখ ও ভুয়া ব্যাকডেটেড দলিল শনাক্তকরণ' : 'Identifies backdated deeds and inverted transaction sequences'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#064E3B] border border-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {lang === 'bn' ? 'স্বচ্ছ ৮টি নিয়মের ডিটেকশন ফ্রেমওয়ার্ক' : 'Deterministic 8-Rule Detection Framework'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'bn' ? 'রুল-ভিত্তিক জালিয়াতি শনাক্তকরণ ইঞ্জিন' : 'Rule-Based Land Fraud Detection Engine'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {lang === 'bn'
              ? 'BHUMIverse কোনো অস্পষ্ট ব্ল্যাক-বক্স নয়। প্রতিটি ঝুঁকি আইনি নিয়মের (Rules A through H) সুস্পষ্ট কারণ, রেফারেন্স ও প্রমাণের উপর ভিত্তি করে স্কোর প্রদান করে।'
              : 'BHUMIverse operates strictly on transparent, testable rules rather than opaque black-box probability. Every flag provides explicit statutory grounds, comparative values, and cryptographic evidence.'}
          </p>
        </div>

        {/* 8 Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rules.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-[#064E3B] border border-emerald-200">
                    {r.id}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {r.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{r.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{r.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-[#0B6E4F] font-semibold">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{r.benefit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action CTA Card */}
        <div className="rounded-2xl bg-gradient-to-r from-[#064E3B] to-[#047857] p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              {lang === 'bn' ? 'লাইভ স্যান্ডবক্সে রুলসমূহ পরীক্ষা করুন' : 'Test All 8 Rules in the Live Sandbox'}
            </h3>
            <p className="text-xs text-emerald-100 mt-1">
              {lang === 'bn' ? '২০টি বাস্তবসম্মত সিন্থেটিক কেসে রুল ইঞ্জিনের ফলাফল মুহূর্তেই দেখুন।' : 'Experience real-time evaluation with 20+ realistic seeded Bangladeshi land cases.'}
            </p>
          </div>
          <Link
            href="/demo"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {lang === 'bn' ? 'স্যান্ডবক্স ওপেন করুন' : 'Open Demo Sandbox'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
