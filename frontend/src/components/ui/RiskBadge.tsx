'use client';

import React from 'react';
import { RiskLevel } from '@/lib/types';
import { ShieldCheck, ShieldAlert, ShieldX, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  risk: RiskLevel | string;
  className?: string;
  showIcon?: boolean;
}

export default function RiskBadge({ risk, className = '', showIcon = true }: Props) {
  const { lang } = useLanguage();
  const norm = risk?.toLowerCase() || 'insufficient_data';

  switch (norm) {
    case 'high':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs ${className}`}>
          {showIcon && <ShieldX className="w-3.5 h-3.5 text-rose-600" />}
          {lang === 'bn' ? 'উচ্চ ঝুঁকি' : 'High Risk'}
        </span>
      );
    case 'medium':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs ${className}`}>
          {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />}
          {lang === 'bn' ? 'মাঝারি ঝুঁকি' : 'Medium Risk'}
        </span>
      );
    case 'low':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs ${className}`}>
          {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />}
          {lang === 'bn' ? 'কম ঝুঁকি (বৈধ)' : 'Low Risk (Clean)'}
        </span>
      );
    case 'insufficient_data':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs ${className}`}>
          {showIcon && <HelpCircle className="w-3.5 h-3.5 text-slate-500" />}
          {lang === 'bn' ? 'অপর্যাপ্ত তথ্য' : 'Insufficient Data'}
        </span>
      );
  }
}
