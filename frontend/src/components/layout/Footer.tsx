'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="w-full bg-[#004D34] text-emerald-100 text-[11px] py-4 px-4 sm:px-6 lg:px-8 border-t-2 border-[#006747] mt-auto">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>
            {lang === 'bn' 
              ? 'কপিরাইট © ২০২৬ সর্বস্বত্ব সংরক্ষিত: ভূমি মন্ত্রণালয়, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার' 
              : "Copyright © 2026 Ministry of Land, Government of the People's Republic of Bangladesh. All Rights Reserved."}
          </span>
        </div>

        <div className="text-emerald-300 font-medium mx-auto sm:mx-0">
          {lang === 'bn' 
            ? 'কারিগরি সহায়তায়: BHUMIverse — ল্যান্ডটেক ইনোভেশন হ্যাকাথন ২০২৬ (সমস্যা ৩)' 
            : 'Technical Implementation: BHUMIverse — LandTech Innovation Hackathon 2026 (Problem P3)'}
        </div>
      </div>
    </footer>
  );
}
