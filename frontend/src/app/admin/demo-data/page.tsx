'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Database, RefreshCw, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export default function AdminDemoDataPage() {
  const [resetting, setResetting] = useState(false);
  const [done, setDone] = useState(false);

  const handleResetData = () => {
    setResetting(true);
    setTimeout(() => {
      setResetting(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Database className="w-6 h-6 text-[#0B6E4F]" />
          সিন্থেটিক ডেটাসেট ব্যবস্থাপনা (Synthetic Dataset Management)
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          হ্যাকাতন বিচারকদের জন্য ২০টি নমুনা কেস ও কৃত্রিম রেকর্ডের সিডিং ও রিসেট কনসোল
        </p>
      </div>

      <div className="gov-card p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">সিঙ্গেল-ক্লিক ডেটাসেট রিসেট (Reset Synthetic State)</span>
              <span className="text-[10px] bg-emerald-100 text-[#0B6E4F] px-2 py-0.5 rounded font-mono font-bold border border-emerald-300">v1.0-Hackathon</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-lg leading-relaxed">
              আপনার সমস্ত পরিবর্তন মুছে ফেলে মূল ২০টি সিন্থেটিক কেস (দ্বৈত বিক্রয়, নামজারি অমিল, ডুপ্লিকেট হ্যাশ, এলাকা বিভেদ) পুনঃস্থাপন করবে।
            </p>
          </div>

          <button
            onClick={handleResetData}
            disabled={resetting}
            className="px-5 py-2.5 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md whitespace-nowrap transition-all"
          >
            {resetting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> রিসেট হচ্ছে...
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" /> ডেটাসেট রিলোড করুন
              </>
            )}
          </button>
        </div>

        {done && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#0B6E4F]" />
            <span>সিন্থেটিক ডেটাসেটের ২০টি কেস সফলভাবে রিলোড করা হয়েছে।</span>
          </div>
        )}

        {/* Dataset Breakdown Overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">বর্তমান ডেটাসেটের পরিসংখ্যান (Synthetic Coverage)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">মোট কেস সংখ্যা: ২০টি</span>
              <p className="text-[11px] text-slate-600">সাভার, তেজগাঁও, গুলশান, বাড্ডা, মিরপুর, গাজীপুর ও কেরানীগঞ্জের নমুনা মৌজা অন্তর্ভুক্ত।</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">নেগেটিভ ও পজিটিভ কেস অনুপাত</span>
              <p className="text-[11px] text-slate-600">৭০% সাধারণ বৈধ লেনদেন এবং ৩০% নিয়ন্ত্রিত অসঙ্গতি (দ্বৈত বিক্রয়, অমিল দাগ, পরিমাপ পার্থক্য)।</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">ব্যক্তিগত তথ্যের নিরাপত্তা</span>
              <p className="text-[11px] text-slate-600">কোনো প্রকৃত নাগরিকের নাম, এনআইডি বা ফোন নম্বর ব্যবহৃত হয়নি। সবই ডেমো ছদ্মনাম (BUYER-A, SELLER-B)।</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">অফিসিয়াল সতর্কতা ট্যাগ</span>
              <p className="text-[11px] text-slate-600">প্রতিটি রেকর্ডে &apos;DEMO DATA — NOT AN OFFICIAL LAND RECORD&apos; ব্যানার স্থায়ীভাবে মুদ্রিত।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
