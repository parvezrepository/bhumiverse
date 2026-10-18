'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CaseDetail, ExplainableFraudRadar, SmartDocumentDiffResponse, NetworkGraphData } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import RiskBadge from '@/components/ui/RiskBadge';
import ExplainableRadar from '@/components/radar/ExplainableRadar';
import SmartDocumentDiff from '@/components/diff/SmartDocumentDiff';
import FraudNetworkGraph from '@/components/graph/FraudNetworkGraph';
import TransactionTimeline from '@/components/timeline/TransactionTimeline';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  Layers, 
  Network, 
  FolderLock, 
  AlertTriangle, 
  Lock, 
  FileText
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function CaseDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { lang, t } = useLanguage();

  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [radar, setRadar] = useState<ExplainableFraudRadar | null>(null);
  const [diff, setDiff] = useState<SmartDocumentDiffResponse | null>(null);
  const [graph, setGraph] = useState<NetworkGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'radar' | 'diff' | 'graph' | 'timeline' | 'evidence'>('radar');

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      setLoading(true);
      const [c, r, d, g] = await Promise.all([
        api.getCase(id),
        api.getRadar(id),
        api.getDiff(id),
        api.getNetworkGraph(id)
      ]);

      setCaseData(c);
      setRadar(r);
      setDiff(d);
      setGraph(g);
      setLoading(false);
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500 text-xs">
        <Clock className="w-8 h-8 text-[#0B6E4F] animate-spin mx-auto mb-3" />
        {lang === 'bn' ? 'কেসের বিশদ বিশ্লেষণ ও দলিল তথ্য লোড হচ্ছে...' : 'Loading case records & multi-rule analysis...'}
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">
          {lang === 'bn' ? 'কেস রেকর্ড পাওয়া যায়নি' : 'Case Record Not Found'}
        </h2>
        <Link
          href="/dashboard/cases"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B6E4F] text-white text-xs font-bold"
        >
          {lang === 'bn' ? 'কেস তালিকায় ফিরে যান' : 'Back to Case Vault'}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/cases"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0B6E4F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {lang === 'bn' ? 'কেস তালিকায় ফিরে যান' : 'Back to Cases'}
        </Link>

        {/* Download PDF Report Button */}
        <a
          href={`http://localhost:8000/api/cases/${caseData.id}/report/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          {lang === 'bn' ? 'ডাউনলোড PDF রিপোর্ট' : 'Download PDF Report'}
        </a>
      </div>

      {/* Case Header Card */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0B6E4F] px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
              {caseData.tracking_id}
            </span>
            <StatusBadge status={caseData.status} />
            <RiskBadge risk={caseData.risk_level} />
            {caseData.is_demo && (
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono border border-slate-200 font-semibold">
                DEMO RECORD
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {lang === 'bn' ? 'দাখিল:' : 'Submitted:'} {caseData.submitted_at?.split('T')[0]}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">{caseData.title}</h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">{caseData.description}</p>
        </div>

        {/* Metadata Details Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 text-[11px] block font-medium">
              {lang === 'bn' ? 'অবস্থান (মৌজা):' : 'Location (Mouza):'}
            </span>
            <span className="font-bold text-slate-800">
              {caseData.mouza || 'N/A'}, {caseData.upazila || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block font-medium">
              {lang === 'bn' ? 'জেলা:' : 'District:'}
            </span>
            <span className="font-bold text-slate-800">{caseData.district || 'Dhaka'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block font-medium">
              {lang === 'bn' ? 'প্লট ও খতিয়ান:' : 'Plot & Khatian:'}
            </span>
            <span className="font-bold font-mono text-[#0B6E4F]">
              {caseData.plot_khatian_summary || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block font-medium">
              {lang === 'bn' ? 'আপলোডকৃত নথি:' : 'Attached Documents:'}
            </span>
            <span className="font-bold text-slate-800">
              {caseData.documents.length} {lang === 'bn' ? 'টি ফাইল' : 'files'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Feature Tabs Navigation */}
      <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs text-xs gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'radar'
              ? 'bg-[#0B6E4F] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0B6E4F] hover:bg-emerald-50/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          {lang === 'bn' ? 'ফ্রড রাডার' : 'Explainable Radar'}
        </button>

        <button
          onClick={() => setActiveTab('diff')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'diff'
              ? 'bg-[#0B6E4F] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0B6E4F] hover:bg-emerald-50/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          {lang === 'bn' ? 'স্মার্ট ডিফারেন্স' : 'Smart Document Diff'}
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'graph'
              ? 'bg-[#0B6E4F] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0B6E4F] hover:bg-emerald-50/60'
          }`}
        >
          <Network className="w-4 h-4" />
          {lang === 'bn' ? 'নেটওয়ার্ক গ্রাফ' : 'Fraud Network Graph'}
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-[#0B6E4F] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0B6E4F] hover:bg-emerald-50/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          {lang === 'bn' ? 'টাইমলাইন' : 'Transaction Timeline'}
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'evidence'
              ? 'bg-[#0B6E4F] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0B6E4F] hover:bg-emerald-50/60'
          }`}
        >
          <FolderLock className="w-4 h-4" />
          {lang === 'bn' ? 'ক্রিপ্টোগ্রাফিক এভিডেন্স' : 'Evidence Vault & Hashes'}
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'radar' && radar && (
          <ExplainableRadar radar={radar} caseId={caseData.id} />
        )}

        {activeTab === 'diff' && diff && (
          <SmartDocumentDiff diff={diff} />
        )}

        {activeTab === 'graph' && graph && (
          <FraudNetworkGraph graphData={graph} />
        )}

        {activeTab === 'timeline' && (
          <TransactionTimeline events={caseData.timeline} />
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-6">
            {/* Documents with SHA-256 Hashes */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0B6E4F]" />
                {lang === 'bn' ? 'সংরক্ষিত প্রমাণাদি ও ক্রিপ্টোগ্রাফিক হ্যাশ' : 'Cryptographic File Fingerprints (SHA-256)'}
              </h3>
              <p className="text-xs text-slate-600">
                {lang === 'bn'
                  ? 'প্রতিটি আপলোডকৃত ফাইলের অনন্য SHA-256 ফিঙ্গারপ্রিন্ট যা ভবিষ্যতে ফাইল পরিবর্তনের যে কোনো প্রচেষ্টা তাৎক্ষণিকভাবে প্রকাশ করে।'
                  : 'Immutable cryptographic hashes generated upon file upload ensure permanent document integrity and tamper verification.'}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'ফাইলের নাম' : 'File Name'}</th>
                      <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'শ্রেণি' : 'Category'}</th>
                      <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'SHA-256 হ্যাশ' : 'SHA-256 Hash'}</th>
                      <th className="py-3.5 px-4 font-bold text-slate-800">{lang === 'bn' ? 'ওসিআর স্কোর' : 'OCR Score'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {caseData.documents.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#0B6E4F]" />
                            <span className="font-bold text-slate-900">{doc.file_name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 capitalize font-medium">{doc.doc_category.replace('_', ' ')}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                          {doc.file_hash_sha256}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-emerald-100 text-[#0B6E4F] border border-emerald-200">
                            {Math.round(doc.confidence_score * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Extracted Fields Table */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'bn' ? 'নিষ্কাশিত ফিল্ড ডাটা' : 'Normalized Extracted Fields'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {caseData.documents.flatMap(d => d.extracted_fields).map((f, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 font-mono text-[10px] block uppercase font-bold">{f.field_name}</span>
                    <span className="font-bold text-slate-900 block mt-1">{f.normalized_value || f.original_value || 'N/A'}</span>
                    {f.is_manually_corrected && (
                      <span className="text-[10px] text-[#0B6E4F] block mt-1 font-bold">✓ Manually Verified</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CaseDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-16 text-center text-slate-500 text-xs">Loading case data...</div>}>
      <CaseDetailContent />
    </React.Suspense>
  );
}
