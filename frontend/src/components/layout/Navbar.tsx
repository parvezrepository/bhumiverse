'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  User, 
  Building2, 
  FileCheck, 
  PhoneCall, 
  Menu, 
  X,
  ExternalLink,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function NavbarContent() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: lang === 'bn' ? 'হোম' : 'Home', href: '/' },
    { label: lang === 'bn' ? 'ডিটেকশন রুলস' : 'Detection Rules', href: '/features' },
    { label: lang === 'bn' ? 'কাজের পদ্ধতি' : 'How It Works', href: '/how-it-works' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-white">
      {/* 1. Top National Portal Strip */}
      <div className="bg-[#004D34] text-white text-[11px] py-1 px-4 sm:px-6 lg:px-8 border-b border-[#003826]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Bangladesh Government Affiliation */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {lang === 'bn' ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | ভূমি মন্ত্রণালয়' : "Government of the People's Republic of Bangladesh | Ministry of Land"}
            </span>
            <span className="hidden md:inline text-emerald-300">|</span>
            <span className="hidden md:inline text-amber-300 font-medium">
              {lang === 'bn' ? 'ল্যান্ডটেক ইনোভেশন হ্যাকাথন ২০২৬ (সমস্যা ৩)' : 'LandTech Innovation Hackathon 2026 (Problem P3)'}
            </span>
          </div>

          {/* Right: Hotline 16122 & Language Switcher */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-amber-300 font-bold bg-[#003826] px-2.5 py-0.5 rounded border border-emerald-700/60">
              <PhoneCall className="w-3 h-3 text-amber-300" />
              <span>{lang === 'bn' ? 'ভূমিসেবা হেল্পলাইন: ১৬১২২' : 'Land Helpline: 16122'}</span>
            </div>

            {/* Language Toggle: বাং | EN */}
            <div className="flex items-center bg-[#002B1D] rounded-full p-0.5 border border-emerald-600/60 text-[11px]">
              <button 
                type="button"
                onClick={() => setLang('bn')}
                className={`px-3 py-0.5 rounded-full font-bold cursor-pointer transition-all ${
                  lang === 'bn' ? 'bg-white text-[#006747] shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
                title="বাংলা ভাষায় দেখুন"
              >
                বাংলা
              </button>
              <button 
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-0.5 rounded-full font-bold cursor-pointer transition-all ${
                  lang === 'en' ? 'bg-white text-[#006747] shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
                title="Switch to English"
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Official Government Portal Header (land.gov.bd Style) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Left: Official Government Seal & Ministry Branding */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src="/bd-govt-logo.svg" 
                alt="Government of Bangladesh Seal" 
                className="w-11 h-11 object-contain" 
              />
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide leading-none">
                {lang === 'bn' ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার' : "Government of the People's Republic of Bangladesh"}
              </div>
              <div className="text-lg sm:text-xl font-black text-[#006747] tracking-tight leading-tight mt-0.5 group-hover:text-emerald-800 transition-colors">
                {lang === 'bn' ? 'ভূমি মন্ত্রণালয়' : 'Ministry of Land'}
              </div>
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                <span>BHUMIverse</span>
                <span className="text-slate-400 font-normal">•</span>
                <span className="text-slate-500 font-medium">
                  {lang === 'bn' ? 'ভূমি জালিয়াতি ও দ্বৈত বিক্রয় শনাক্তকরণ প্ল্যাটফর্ম' : 'AI-Assisted Land Fraud & Double-Selling Detection'}
                </span>
              </div>
            </div>
          </Link>

          {/* Right: Quick Action Portals */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Citizen Portal */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#006747] text-xs font-bold border border-emerald-300 transition-colors shadow-2xs"
            >
              <User className="w-4 h-4 text-[#006747]" />
              {lang === 'bn' ? 'নাগরিক সেবা কর্নার' : 'Citizen Portal'}
            </Link>

            {/* Officer Console */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-colors shadow-2xs"
            >
              <Building2 className="w-4 h-4 text-amber-700" />
              {lang === 'bn' ? 'কর্মকর্তা কনসোল' : 'Officer Console'}
            </Link>

            {/* Verify Deed CTA Button */}
            <Link
              href="/dashboard/new-verification"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#006747] hover:bg-[#004D34] text-white text-xs font-bold shadow-xs transition-all"
            >
              <FileCheck className="w-4 h-4 text-amber-300" />
              {lang === 'bn' ? 'অনলাইন দলিল যাচাই' : 'Verify Title Deed'}
            </Link>
          </div>

          {/* Mobile hamburger menu */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-700 hover:text-[#006747] p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. Official Deep Green Navigation Bar (land.gov.bd Style) */}
      <div className="bg-[#006747] text-white hidden md:block border-b border-[#004D34] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10 text-xs font-bold">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`h-10 px-4 flex items-center transition-colors ${
                    isActive
                      ? 'bg-[#004D34] text-amber-300 border-b-2 border-amber-400 font-extrabold'
                      : 'text-white hover:bg-[#00573C] hover:text-emerald-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Engine Status */}
          <div className="flex items-center gap-2 text-[11px] text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{lang === 'bn' ? 'ফাস্টএপিআই এআই ইঞ্জিন: সচল' : 'FastAPI Engine: Active'}</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
            <span className="text-xs font-bold text-slate-700">ভাষা / Language:</span>
            <div className="flex items-center bg-slate-200 rounded-full p-0.5 text-xs">
              <button 
                type="button"
                onClick={() => setLang('bn')}
                className={`px-3 py-1 rounded-full font-bold ${lang === 'bn' ? 'bg-[#006747] text-white' : 'text-slate-600'}`}
              >
                বাংলা
              </button>
              <button 
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full font-bold ${lang === 'en' ? 'bg-[#006747] text-white' : 'text-slate-600'}`}
              >
                English
              </button>
            </div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-800 hover:text-[#006747] border-b border-slate-100 font-medium"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 grid grid-cols-2 gap-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 rounded-lg bg-emerald-50 text-[#006747] text-xs font-bold border border-emerald-300"
            >
              {lang === 'bn' ? 'নাগরিক সেবা' : 'Citizen Portal'}
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 rounded-lg bg-amber-50 text-amber-900 text-xs font-bold border border-amber-300"
            >
              {lang === 'bn' ? 'কর্মকর্তা কনসোল' : 'Officer Console'}
            </Link>
          </div>

          <Link
            href="/dashboard/new-verification"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2.5 rounded-lg bg-[#006747] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2"
          >
            <FileCheck className="w-4 h-4 text-amber-300" />
            {lang === 'bn' ? 'অনলাইন দলিল যাচাই' : 'Verify Title Deed'}
          </Link>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <React.Suspense fallback={<header className="h-16 bg-white border-b border-slate-200" />}>
      <NavbarContent />
    </React.Suspense>
  );
}
