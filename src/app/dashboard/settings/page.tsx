'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { UserProfile } from '@/lib/types';
import { Settings, User, ShieldCheck, Mail, Phone, Lock, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const u = await api.getCurrentUser();
      setUser(u);
    }
    loadUser();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#0B6E4F]" />
          প্রোফাইল ও নিরাপত্তা সেটিংস (Profile & Security)
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          আপনার সংরক্ষিত নাগরিক পরিচয় ও নোটিফিকেশন অগ্রাধিকার
        </p>
      </div>

      <div className="gov-card p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-6">
        {saved && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#0B6E4F]" />
            <span>প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে।</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">পূর্ণ নাম (Full Name)</label>
            <input
              type="text"
              defaultValue={user?.full_name || 'Parvez Ahmed'}
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ইমেইল ঠিকানা (Email Address)</label>
            <input
              type="email"
              disabled
              defaultValue={user?.email || 'citizen@bhumiverse.internal'}
              className="w-full p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-mono cursor-not-allowed text-xs"
            />
            <span className="text-[11px] text-[#0B6E4F] font-semibold flex items-center gap-1 mt-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> ইমেইল ভেরিফাইড (Official Account Verified)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">জাতীয় পরিচয়পত্র মাস্ক (NID Mask)</label>
              <input
                type="text"
                disabled
                defaultValue={user?.nid_mask || 'NID-XXXX-XXXX'}
                className="w-full p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-mono cursor-not-allowed text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">মোবাইল মাস্ক (Phone Mask)</label>
              <input
                type="text"
                disabled
                defaultValue={user?.phone_mask || '+880 1XXX-XXXXXX'}
                className="w-full p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-mono cursor-not-allowed text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Save className="w-3.5 h-3.5" /> সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
