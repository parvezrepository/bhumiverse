'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { 
  FileSearch, 
  Layers, 
  CheckCircle2, 
  Upload, 
  ShieldCheck, 
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorksPage() {
  const { lang, t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: lang === 'bn' ? 'দলিল স্ক্যান ও নিরাপদ হ্যাশ ভল্ট' : 'Document Ingestion & Cryptographic Hashing',
      tag: 'SHA-256 Hasher',
      icon: <Upload className="w-5 h-5 text-[#0B6E4F]" />,
      desc: lang === 'bn'
        ? 'সাফ কোবালা দলিল, খতিয়ান বা নামজারি প্রস্তাবপত্রের স্ক্যান (PDF, JPG, PNG) আপলোড করা হয়। সার্ভার স্বয়ংক্রিয়ভাবে এক্সটেনশন ও কন্টেন্ট ভ্যালিডেশন করে প্রাইভেট সুরক্ষিত স্টোরেজে সংরক্ষণ করে এবং অপরিবর্তনীয় SHA-256 বিট হ্যাশ তৈরি করে।'
        : 'Uploaded deeds, khatians, and mutation schedules (PDF, JPG, PNG) undergo cryptographic hashing via SHA-256, generating tamper-proof digital fingerprints and indexing plot entities.'
    },
    {
      num: '02',
      title: lang === 'bn' ? 'এআই ও অপটিক্যাল ক্যারেক্টার রিকগনিশন' : 'Bilingual OCR & Unit Normalization',
      tag: 'Bengali/English Normalizer',
      icon: <FileSearch className="w-5 h-5 text-teal-700" />,
      desc: lang === 'bn'
        ? 'ওসিআর ইঞ্জিন দলিলের পাতা থেকে দলিল নং, দাগ নং, খতিয়ান নং, মৌজা, জমির পরিমাণ ও ক্রেতা-বিক্রেতার নাম নিষ্কাশন করে। বাংলা সংখ্যা (০-৯) এবং জমির এককসমূহকে (কাঠা/বিঘা/শতক) আদর্শ মানে কনভার্ট করা হয়।'
        : 'OCR extracts deed numbers, dag/khatian numbers, mouza, land area, and party names. Bengali numerals (০-৯) and regional land units (decimals, katha, bigha, acres) are standardized.'
    },
    {
      num: '03',
      title: lang === 'bn' ? 'ক্রস-ডকুমেন্ট ও বালাম রেকর্ড তুলনা' : 'Multi-Rule Cross-Screening Engine',
      tag: 'Rules A through H',
      icon: <Layers className="w-5 h-5 text-blue-700" />,
      desc: lang === 'bn'
        ? 'একই মৌজার দাগ ও খতিয়ানের পূর্ববর্তী রেকর্ড এবং জমা দেওয়া মিউটেশন রেকর্ডের সাথে স্বয়ংক্রিয় তুলনা করা হয়। একই দাগে ভিন্ন ক্রেতার হস্তান্তর বা দলিলের দাগ ও নামজারির দাগে অমিল থাকলে অ্যালার্ট তৈরি হয়।'
        : 'The screening engine cross-examines incoming records against existing system files. Conflicting conveyances on identical plots, area variances exceeding 3%, and duplicate files generate deterministic risk flags.'
    },
    {
      num: '04',
      title: lang === 'bn' ? 'ব্যাখ্যাযোগ্য ফ্রড রাডার ও কর্মকর্তা পর্যালোচনা' : 'Explainable Radar & Officer Review',
      tag: 'Human-in-the-Loop Workflow',
      icon: <CheckCircle2 className="w-5 h-5 text-amber-700" />,
      desc: lang === 'bn'
        ? 'অনুমোদিত পর্যালোচক রাডার ও ডকুমেন্ট ডিফের মাধ্যমে অমিল পর্যবেক্ষণ করেন। অফিসার Mark Reviewed, Approve, Reject, Request More Info, বা Escalate সিদ্ধান্ত গ্রহণ করেন এবং সিস্টেম অফিসিয়াল অডিট রিপোর্ট জেনারেট করে।'
        : 'Authorized land officers examine the Explainable Radar, Smart Diff, and Conflict Graph. Review decisions (Approve, Reject, Escalate, Request Info) are immutably logged with downloadable PDF risk reports.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-bold text-[#0B6E4F]">
            <ShieldCheck className="w-4 h-4 text-[#0B6E4F]" />
            {lang === 'bn' ? 'আর্কিটেকচার পাইপলাইন' : 'Pipeline Architecture'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'bn' ? 'যাচাইকরণ প্রক্রিয়ার পূর্ণাঙ্গ কার্যপ্রণালী' : 'How the BHUMIverse Verification Pipeline Works'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            {lang === 'bn'
              ? 'দলিল আপলোড থেকে শুরু করে ক্রিপ্টোগ্রাফিক হ্যাশ তৈরি, ওসিআর রূপান্তর ও রুল বিশ্লেষণ হয়ে কর্মকর্তা পর্যালোচনার ৪টি সুনির্দিষ্ট ধাপ।'
              : 'From raw paper deed upload to cryptographic hashing, OCR normalization, rule-based conflict detection, and human-in-the-loop officer review.'}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#0B6E4F] font-mono">{st.num}</span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {st.tag}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                  {st.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{st.desc}</p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <Link
            href="/dashboard/new-verification"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0B6E4F] hover:bg-[#075E43] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            {lang === 'bn' ? 'দলিল যাচাই শুরু করুন' : 'Start Verification Now'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
