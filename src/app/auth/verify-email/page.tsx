'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MailCheck, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleSimulateVerification = () => {
    setLoading(true);
    setTimeout(() => {
      setVerified(true);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-slate-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-[#0B6E4F] mx-auto shadow-md">
            {verified ? <CheckCircle2 className="w-8 h-8 text-[#0B6E4F]" /> : <MailCheck className="w-8 h-8 text-amber-600" />}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {verified ? 'ইমেইল সফলভাবে ভেরিফাইড!' : 'ইমেইল ভেরিফিকেশন অপেক্ষারত'}
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              {verified
                ? 'আপনার ইমেইল ঠিকানা নিশ্চিত করা হয়েছে। আপনি এখন সম্পূর্ণ সুরক্ষিত নাগরিক ড্যাশবোর্ড ব্যবহার করতে পারেন।'
                : 'আমরা আপনার নিবন্ধিত ইমেইলে একটি ভেরিফিকেশন লিংক পাঠিয়েছি। সংবেদনশীল ভূমি তথ্য প্রক্রিয়াকরণের পূর্বে ইমেইল ভেরিফিকেশন বাধ্যতামূলক।'}
            </p>
          </div>

          <div className="gov-card p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            {verified ? (
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                সিটিজেন ড্যাশবোর্ডে প্রবেশ করুন <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleSimulateVerification}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> যাচাইকরণ পরীক্ষা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> ভেরিফিকেশন স্ট্যাটাস রিফ্রেশ করুন
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500">
                  ইমেইল পাননি? স্প্যাম ফোল্ডার চেক করুন অথবা নতুন লিংক পাঠানোর অনুরোধ করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
