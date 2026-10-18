'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-slate-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#0B6E4F] flex items-center justify-center text-white mx-auto shadow-md">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">পাসওয়ার্ড রিসেট (Password Reset)</h1>
            <p className="text-xs text-slate-600">
              আপনার নিবন্ধিত ইমেইল দিলে আমরা একটি সুরক্ষিত পাসওয়ার্ড রিসেট লিংক পাঠাব
            </p>
          </div>

          <div className="gov-card p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {sent ? (
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="w-12 h-12 text-[#0B6E4F] mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">রিসেট লিংক পাঠানো হয়েছে!</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <b>{email}</b> ঠিকানায় পাসওয়ার্ড রিসেটের নির্দেশাবলী পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স চেক করুন।
                </p>
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-xs font-bold hover:bg-emerald-700 shadow-md transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> সাইন ইন পেজে ফিরে যান
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা (Email)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="citizen@bhumiverse.internal"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  রিসেট লিংক পাঠান <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              পাসওয়ার্ড মনে পড়েছে?{' '}
              <Link href="/auth/sign-in" className="text-[#0B6E4F] font-bold hover:underline">
                সাইন ইন / লগইন করুন
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
