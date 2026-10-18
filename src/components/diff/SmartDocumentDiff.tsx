'use client';

import React, { useState } from 'react';
import { SmartDocumentDiffResponse, DiffFieldComparison } from '@/lib/types';
import { Layers, CheckCircle2, AlertTriangle, HelpCircle, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  diff: SmartDocumentDiffResponse;
}

export default function SmartDocumentDiff({ diff }: Props) {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'conflict' | 'match' | 'missing'>('all');

  const filteredComparisons = diff.comparisons.filter((c: DiffFieldComparison) => {
    if (filter === 'conflict') return c.status === 'conflict';
    if (filter === 'match') return c.status === 'match';
    if (filter === 'missing') return c.status === 'missing';
    return true;
  });

  const getStatusBadge = (status: DiffFieldComparison['status']) => {
    switch (status) {
      case 'match':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-[#0B6E4F]" />
            {lang === 'bn' ? 'নিখুঁত মিল' : 'Exact Match'}
          </span>
        );
      case 'conflict':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-700" />
            {lang === 'bn' ? 'অমিল / বিরোধ' : 'Conflict Discrepancy'}
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <HelpCircle className="w-3 h-3 text-amber-700" />
            {lang === 'bn' ? 'অনুপস্থিত' : 'Missing Record'}
          </span>
        );
      case 'uncertain':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
            {lang === 'bn' ? 'সন্দেহজনক OCR' : 'Uncertain OCR'}
          </span>
        );
    }
  };

  const getRowBg = (status: DiffFieldComparison['status']) => {
    switch (status) {
      case 'conflict':
        return 'bg-rose-50/60 border-l-4 border-l-rose-500';
      case 'match':
        return 'bg-emerald-50/40 border-l-4 border-l-emerald-500';
      case 'missing':
        return 'bg-amber-50/40 border-l-4 border-l-amber-500';
      default:
        return 'bg-slate-50 border-l-4 border-l-blue-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="gov-card p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0B6E4F]" />
            {lang === 'bn' ? 'স্মার্ট ডকুমেন্ট ডিফারেন্স তুলনা' : 'Smart Document Diff Comparison'}
          </h3>
          <p className="text-xs text-slate-600 mt-1">{diff.summary}</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-[#0B6E4F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'bn' ? 'সকল ফিল্ড' : 'All Fields'}
          </button>
          <button
            onClick={() => setFilter('conflict')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'conflict' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            {lang === 'bn' ? 'শুধুমাত্র বিরোধ' : 'Conflicts Only'}
          </button>
          <button
            onClick={() => setFilter('match')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'match' ? 'bg-[#0B6E4F] text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {lang === 'bn' ? 'মিল রয়েছে' : 'Matches'}
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'missing' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            {lang === 'bn' ? 'অনুপস্থিত' : 'Missing'}
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="gov-card rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4 w-1/4 font-bold text-slate-800">
                  {lang === 'bn' ? 'ফিল্ডের নাম' : 'Field Name'}
                </th>
                <th className="py-3.5 px-4 w-1/4 font-bold text-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <FileText className="w-3.5 h-3.5 text-[#0B6E4F]" />
                    <span>{lang === 'bn' ? 'ডকুমেন্ট ১' : 'Document 1'} ({diff.doc1_name.slice(0, 20)})</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 w-1/4 font-bold text-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>{lang === 'bn' ? 'ডকুমেন্ট ২' : 'Document 2'} ({diff.doc2_name.slice(0, 20)})</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 w-1/4 font-bold text-slate-800">
                  {lang === 'bn' ? 'যাচাই ফলাফল ও বিশ্লেষণ' : 'Analysis Result'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredComparisons.map((row: DiffFieldComparison) => (
                <tr key={row.field_name} className={`transition-colors hover:bg-slate-50 ${getRowBg(row.status)}`}>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{lang === 'bn' ? row.label_bn : row.label_en}</div>
                    <div className="text-[10px] text-slate-500 font-mono font-medium">{row.field_name}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-mono">
                    {row.doc1_value ? (
                      <span className="font-bold text-slate-900">{row.doc1_value}</span>
                    ) : (
                      <span className="text-slate-400 italic">
                        {lang === 'bn' ? 'অনুপস্থিত' : 'Not extracted'}
                      </span>
                    )}
                    {row.confidence1 < 0.70 && row.doc1_value && (
                      <span className="text-[9px] block text-blue-600 font-bold">OCR: {Math.round(row.confidence1 * 100)}%</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-mono">
                    {row.doc2_value ? (
                      <span className="font-bold text-slate-900">{row.doc2_value}</span>
                    ) : (
                      <span className="text-slate-400 italic">
                        {lang === 'bn' ? 'অনুপস্থিত' : 'Not extracted'}
                      </span>
                    )}
                    {row.confidence2 < 0.70 && row.doc2_value && (
                      <span className="text-[9px] block text-blue-600 font-bold">OCR: {Math.round(row.confidence2 * 100)}%</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 space-y-1">
                    {getStatusBadge(row.status)}
                    {row.notes && (
                      <p className="text-[11px] text-slate-600 leading-tight mt-1">{row.notes}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
