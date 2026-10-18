'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { DocumentItem } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { FolderLock, FileText, Lock, ArrowRight, Download, Search } from 'lucide-react';

export default function MyDocumentsPage() {
  const { lang } = useLanguage();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocs() {
      const cases = await api.getCases();
      const allDocs: DocumentItem[] = [];
      cases.forEach(c => {
        if (c.documents) allDocs.push(...c.documents);
      });
      setDocuments(allDocs);
      setLoading(false);
    }
    loadDocs();
  }, []);

  const filteredDocs = documents.filter(d => 
    d.file_name.toLowerCase().includes(search.toLowerCase()) ||
    d.doc_category.toLowerCase().includes(search.toLowerCase()) ||
    d.file_hash_sha256.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <FolderLock className="w-6 h-6 text-[#0B6E4F]" />
          {lang === 'en' ? 'Secure Document & Deed Vault' : 'সংরক্ষিত দলিল ও নথি ভল্ট'}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {lang === 'en'
            ? 'Cryptographic SHA-256 fingerprints, OCR text extraction confidence, and parcel associations for all verified deeds.'
            : 'আপনার আপলোডকৃত সকল ফাইলের ক্রিপ্টোগ্রাফিক ফিঙ্গারপ্রিন্ট ও ওসিআর স্থিতি'}
        </p>
      </div>

      <div className="gov-card p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'en' ? 'Search by file name, category, or SHA-256 hash...' : 'ফাইলের নাম, শ্রেণি বা হ্যাশ দিয়ে খুঁজুন...'}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="gov-card rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {lang === 'en' ? 'Loading documents...' : 'ডকুমেন্ট তালিকা লোড হচ্ছে...'}
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {lang === 'en' ? 'No documents found.' : 'কোনো দলিল পাওয়া যায়নি।'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'File Name' : 'ফাইলের নাম'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Category' : 'শ্রেণি'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'SHA-256 Hash' : 'SHA-256 হ্যাশ'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Size' : 'সাইজ'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'OCR Score' : 'ওসিআর স্কোর'}</th>
                  <th className="py-3.5 px-4 text-right font-bold text-slate-800">{lang === 'en' ? 'Case Reference' : 'কেস রেফারেন্স'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredDocs.map((doc, idx) => (
                  <tr key={doc.id || idx} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0B6E4F] flex-shrink-0" />
                        <span className="font-bold text-slate-900 truncate max-w-xs">{doc.file_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 capitalize font-medium">
                      {doc.doc_category.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {doc.file_hash_sha256 ? `${doc.file_hash_sha256.slice(0, 16)}...` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {(doc.file_size_bytes / 1024).toFixed(0)} KB
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-emerald-100 text-[#0B6E4F] border border-emerald-200">
                        {Math.round((doc.confidence_score || 0.95) * 100)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/demo-documents/${doc.file_name}`}
                          download={doc.file_name}
                          className="inline-flex items-center gap-1 text-slate-700 hover:text-[#0B6E4F] font-bold text-xs bg-slate-100 hover:bg-emerald-50 border border-slate-200 px-2 py-1 rounded transition-colors"
                          title={lang === 'en' ? 'Download Document' : 'ডকুমেন্ট ডাউনলোড'}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          href={`/dashboard/cases/${doc.case_id}`}
                          className="inline-flex items-center gap-1 text-[#0B6E4F] hover:text-emerald-800 font-bold text-xs bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded transition-colors"
                        >
                          {lang === 'en' ? 'View Case' : 'কেস দেখুন'} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
