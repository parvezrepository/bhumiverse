'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  PlusCircle, 
  FolderLock, 
  FileCheck, 
  Download, 
  Settings, 
  LogOut, 
  User, 
  Home,
  Menu,
  X,
  Building2
} from 'lucide-react';
import { api } from '@/lib/api';
import { UserProfile } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

function DashboardNavContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const u = await api.getCurrentUser();
      setUser(u);
    }
    loadUser();
  }, []);

  const navItems = [
    { label: t('nav.overview'), href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: t('nav.new_verification'), href: '/dashboard/new-verification', icon: <PlusCircle className="w-4 h-4 text-emerald-600" /> },
    { label: t('nav.my_cases'), href: '/dashboard/cases', icon: <FileCheck className="w-4 h-4" /> },
    { label: t('nav.documents'), href: '/dashboard/documents', icon: <FolderLock className="w-4 h-4" /> },
    { label: t('nav.reports'), href: '/dashboard/reports', icon: <Download className="w-4 h-4" /> },
    { label: t('nav.settings'), href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSignOut = () => {
    api.setRole('citizen');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6F8] text-slate-800">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white p-4 flex-shrink-0 shadow-2xs">
        {/* Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-3 px-2 py-3 border-b border-slate-200 mb-3 hover:bg-emerald-50/70 rounded-xl transition-all group"
          title={lang === 'bn' ? 'হোমপেজে ফিরে যান' : 'Return to Home'}
        >
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="BHUMIverse Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-slate-900 group-hover:text-[#0B6E4F] transition-colors">
              BHUMI<span className="text-[#0B6E4F]">verse</span>
            </span>
            <span className="text-[10px] block text-[#0B6E4F] font-bold">
              {t('nav.citizen_portal')}
            </span>
          </div>
        </Link>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-4 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold text-xs transition-all"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? '← মূল হোমপেজ' : '← Return Home'}</span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0B6E4F] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-[#0B6E4F]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Sign Out */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0B6E4F] text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-900 block truncate">{user?.full_name || 'Parvez Ahmed'}</span>
              <span className="text-[10px] text-[#0B6E4F] font-mono flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {lang === 'bn' ? 'নাগরিক ভেরিফাইড' : 'Verified Citizen'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <Link
              href="/admin"
              className="text-purple-700 hover:text-purple-900 flex items-center gap-1 font-semibold"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('nav.officer_portal')}</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> {t('nav.sign_out')}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0B6E4F] text-white shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="BHUMIverse" className="w-6 h-6 object-contain" />
          <span className="font-bold text-base text-white">BHUMIverse</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#064E3B] rounded-full p-0.5 text-[10px]">
            <button 
              onClick={() => setLang('bn')}
              className={`px-2 py-0.5 rounded-full font-bold ${lang === 'bn' ? 'bg-white text-[#0B6E4F]' : 'text-emerald-100'}`}
            >
              বাং
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-full font-bold ${lang === 'en' ? 'bg-white text-[#0B6E4F]' : 'text-emerald-100'}`}
            >
              EN
            </button>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 rounded bg-emerald-800 text-white"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white p-4 border-b border-slate-200 space-y-2 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-[#0B6E4F] bg-emerald-50 border border-emerald-200 mb-2"
          >
            <Home className="w-4 h-4 text-[#0B6E4F]" />
            <span>{lang === 'bn' ? '← মূল হোমপেজে ফিরে যান' : '← Return Home'}</span>
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#0B6E4F]"
            >
              {item.icon} {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileNavOpen(false)}
              className="text-purple-700 text-xs font-bold"
            >
              {t('nav.officer_portal')}
            </Link>
            <button
              onClick={handleSignOut}
              className="text-xs text-rose-600 font-bold"
            >
              {t('nav.sign_out')}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area with Top Bar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Strip inside Dashboard */}
        <header className="hidden md:flex items-center justify-between h-14 px-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('nav.citizen_portal')}</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-800">
              {navItems.find(i => i.href === pathname)?.label || t('nav.overview')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle: বাং | EN */}
            <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200 text-xs">
              <button 
                type="button"
                onClick={() => setLang('bn')}
                className={`px-3 py-1 rounded-full font-bold cursor-pointer transition-all ${
                  lang === 'bn' ? 'bg-[#0B6E4F] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
              <button 
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full font-bold cursor-pointer transition-all ${
                  lang === 'en' ? 'bg-[#0B6E4F] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>

            {/* Officer Switch Link */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              {t('nav.officer_portal')}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center text-slate-500 text-xs">Loading...</div>}>
      <DashboardNavContent>{children}</DashboardNavContent>
    </React.Suspense>
  );
}
