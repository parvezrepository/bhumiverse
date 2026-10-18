'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldAlert, Lock, Mail, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Set citizen authenticated session
      api.setRole('citizen');
      if (typeof window !== 'undefined') {
        localStorage.setItem('bhumiverse_citizen_session', JSON.stringify({
          email: email || 'citizen@bhumiverse.internal',
          logged_in_at: new Date().toISOString()
        }));
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'সাইন ইন ব্যর্থ হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCitizenLogin = () => {
    api.setRole('citizen');
    if (typeof window !== 'undefined') {
      localStorage.setItem('bhumiverse_citizen_session', JSON.stringify({
        email: 'parvez.citizen@bhumiverse.gov.bd',
        logged_in_at: new Date().toISOString()
      }));
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-slate-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header Card */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 flex items-center justify-center mx-auto">
              <img src="/logo.png" alt="BHUMIverse Logo" className="w-14 h-14 object-contain drop-shadow-md" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">নাগরিক সাইন ইন / লগইন (Sign In / Login)</h1>
            <p className="text-xs text-slate-600">
              আপনার সংরক্ষিত জমি যাচাই ও স্ক্রিনিং ড্যাশবোর্ডে প্রবেশ করুন
            </p>
          </div>

          {/* Quick Demo Citizen Login Button */}
          <div className="gov-card p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B6E4F] block">
              দ্রুত ডেমো লগইন (1-Click Citizen Access):
            </span>
            <button
              type="button"
              onClick={handleQuickCitizenLogin}
              className="w-full p-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#0B6E4F] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <User className="w-4 h-4 text-[#0B6E4F]" /> ডেমো নাগরিক হিসেবে সরাসরি প্রবেশ করুন (One-Click)
            </button>
          </div>

          {/* Form Card */}
          <div className="gov-card p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {error && (
              <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {error}
              </div>
            )}

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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">পাসওয়ার্ড (Password)</label>
                  <Link href="/auth/forgot-password" className="text-[11px] text-[#0B6E4F] font-bold hover:underline">
                    পাসওয়ার্ড ভুলে গেছেন?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'লগইন হচ্ছে...' : 'সাইন ইন / লগইন করুন (Sign In)'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              অ্যাকাউন্ট নেই?{' '}
              <Link href="/auth/sign-up" className="text-[#0B6E4F] font-bold hover:underline">
                নতুন অ্যাকাউন্ট নিবন্ধন করুন (Sign Up)
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
