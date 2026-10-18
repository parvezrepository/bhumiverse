'use client';

import React from 'react';
import { CaseStatus } from '@/lib/types';
import { CheckCircle2, Clock, AlertTriangle, AlertCircle, HelpCircle, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  status: CaseStatus | string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: Props) {
  const { lang } = useLanguage();
  const norm = status?.toLowerCase() || 'submitted';

  switch (norm) {
    case 'approved':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          {lang === 'bn' ? 'অনুমোদিত' : 'Approved'}
        </span>
      );
    case 'under_review':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs ${className}`}>
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          {lang === 'bn' ? 'পর্যালোচনাধীন' : 'Under Review'}
        </span>
      );
    case 'escalated':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs ${className}`}>
          <AlertCircle className="w-3.5 h-3.5 text-purple-700" />
          {lang === 'bn' ? 'উচ্চ পর্যায়ে প্রেরণ' : 'Escalated'}
        </span>
      );
    case 'info_requested':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs ${className}`}>
          <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
          {lang === 'bn' ? 'তথ্য চাওয়া হয়েছে' : 'Info Requested'}
        </span>
      );
    case 'rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
          {lang === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected'}
        </span>
      );
    case 'submitted':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs ${className}`}>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />
          {lang === 'bn' ? 'জমা দেওয়া হয়েছে' : 'Submitted'}
        </span>
      );
  }
}
