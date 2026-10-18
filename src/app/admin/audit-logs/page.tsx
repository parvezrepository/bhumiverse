'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { AuditEvent } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { History, Lock, ShieldCheck, Search, Calendar, User, Eye, X } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { lang } = useLanguage();
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      const data = await api.getAuditLogs();
      setLogs(data);
      setLoading(false);
    }
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(l => 
    l.event_type.toLowerCase().includes(search.toLowerCase()) ||
    (l.actor_email || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.case_id || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <History className="w-6 h-6 text-[#0B6E4F]" />
          {lang === 'en' ? 'Append-Only Audit Trail & Security Logs' : 'অপরিবর্তনীয় অডিট ট্রেইল ও সিকিউরিটি লগ'}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {lang === 'en'
            ? 'Cryptographically tracked append-only log of all document uploads, OCR extractions, rule triggers, and officer reviews.'
            : 'সকল দলিল আপলোড, ফিল্ড সংশোধন, রুল শনাক্তকরণ এবং অফিসার পর্যালোচনার অপরিবর্তনীয় লগ রেকর্ড'}
        </p>
      </div>

      <div className="gov-card p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'en' ? 'Search by event type, actor email, or case ID...' : 'ইভেন্ট টাইপ, কর্মকর্তা ইমেইল বা কেস আইডি দিয়ে সার্চ করুন...'}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
          />
        </div>
        <div className="text-xs text-[#0B6E4F] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300">
          <Lock className="w-3.5 h-3.5 text-[#0B6E4F]" /> {lang === 'en' ? 'Append-Only Immutable Store' : 'অপরিবর্তনীয় লেজার'}
        </div>
      </div>

      <div className="gov-card rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {lang === 'en' ? 'Loading audit trail records...' : 'অডিট ট্রেইল লোড হচ্ছে...'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Timestamp' : 'টাইমস্ট্যাম্প'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Event Type' : 'ইভেন্ট টাইপ'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Actor' : 'ব্যবহারকারী'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'Case ID' : 'কেস আইডি'}</th>
                  <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'en' ? 'IP Address' : 'আইপি'}</th>
                  <th className="py-3.5 px-4 text-right font-bold text-slate-800">{lang === 'en' ? 'Details' : 'বিস্তারিত'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
                {filteredLogs.map(l => (
                  <tr key={l.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500">
                      {l.created_at ? l.created_at.replace('T', ' ').slice(0, 19) : 'NOW'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {l.event_type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-sans">
                      {l.actor_email}
                    </td>
                    <td className="py-3.5 px-4 text-[#0B6E4F] font-bold">
                      {l.case_id ? l.case_id.slice(0, 12) : 'SYSTEM'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {l.ip_address}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(l)}
                        className="inline-flex items-center gap-1 text-xs text-[#0B6E4F] hover:text-emerald-800 font-sans font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> {lang === 'en' ? 'Payload' : 'বিস্তারিত'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* JSON Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="gov-card w-full max-w-lg rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xl bg-white text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#0B6E4F]" /> Audit Event JSON Payload
              </span>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-50">
                <span className="text-slate-500 font-medium">Event ID:</span>
                <span className="font-mono font-bold text-slate-900">{selectedLog.id}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50">
                <span className="text-slate-500 font-medium">Actor:</span>
                <span className="font-bold text-[#0B6E4F]">{selectedLog.actor_email}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50">
                <span className="text-slate-500 font-medium">Timestamp:</span>
                <span className="font-mono text-slate-700">{selectedLog.created_at}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-700 font-bold block mb-1">Details (JSON):</span>
              <pre className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-800 overflow-x-auto max-h-60">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>

            <div className="text-[11px] text-slate-500 text-center font-medium">
              PostgreSQL RLS ensures audit records cannot be modified or deleted.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
