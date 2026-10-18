'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Lock, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call API to register in Backend and Supabase
      const profile = await api.signUp({
        email,
        full_name: fullName,
        password
      });

      api.setRole('citizen');
      if (typeof window !== 'undefined') {
        localStorage.setItem('bhumiverse_citizen_session', JSON.stringify({
          id: profile.id,
          email,
          full_name: fullName,
          logged_in_at: new Date().toISOString()
        }));
      }
      setSuccess(true);
    } catch (err: any) {
      console.error('Sign-up failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-slate-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 flex items-center justify-center mx-auto">
              <img src="/logo.png" alt="BHUMIverse Logo" className="w-14 h-14 object-contain drop-shadow-md" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">নাগরিক অ্যাকাউন্ট নিবন্ধন (Sign Up)</h1>
            <p className="text-xs text-slate-600">
              BHUMIverse এ জমির দলিল ও খতিয়ান যাচাই শুরু করার জন্য অ্যাকাউন্ট খুলুন
            </p>
          </div>

          <div className="gov-card p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {success ? (
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="w-12 h-12 text-[#0B6E4F] mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">নিবন্ধন সফল হয়েছে!</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  আপনার নাগরিক অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে। আপনি এখন সরাসরি ড্যাশবোর্ডে প্রবেশ করতে পারেন।
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0B6E4F] text-white font-bold text-xs shadow-md"
                >
                  ড্যাশবোর্ডে প্রবেশ করুন <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম (Full Name)</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="মোঃ পারভেজ হোসেন"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা (Email)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your.email@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড (Password)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="কমপক্ষে ৮ অক্ষর"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed font-medium">
                  নিবন্ধন করার মাধ্যমে আপনি BHUMIverse সেবা শর্তাবলী ও সরকারি জমি যাচাই নীতিমালার সাথে একমত পোষণ করছেন।
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? 'নিবন্ধন হচ্ছে...' : 'অ্যাকাউন্ট নিবন্ধন করুন'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {!success && (
              <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <Link href="/auth/sign-in" className="text-[#0B6E4F] font-bold hover:underline">
                  সাইন ইন / লগইন করুন
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
