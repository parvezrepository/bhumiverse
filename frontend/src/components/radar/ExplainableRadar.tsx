'use client';

import React from 'react';
import { ExplainableFraudRadar, Finding } from '@/lib/types';
import RiskBadge from '@/components/ui/RiskBadge';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { generateAndDownloadReport } from '@/lib/reportGenerator';

interface Props {
  radar: ExplainableFraudRadar;
  caseId: string;
}

export default function ExplainableRadar({ radar, caseId }: Props) {
  const { lang, t } = useLanguage();

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'high':
        return 'bg-rose-50/90 border-rose-200 text-rose-950 shadow-xs';
      case 'medium':
        return 'bg-amber-50/90 border-amber-200 text-amber-950 shadow-xs';
      case 'low':
        return 'bg-emerald-50/90 border-emerald-200 text-emerald-950 shadow-xs';
      default:
        return 'bg-blue-50/90 border-blue-200 text-blue-950 shadow-xs';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-rose-700 border-rose-500';
    if (score >= 35) return 'text-amber-700 border-amber-500';
    return 'text-[#0B6E4F] border-[#0B6E4F]';
  };

  return (
    <div className="space-y-6">
      {/* Top Radar Overview Card */}
      <div className="gov-card p-6 rounded-2xl border border-slate-200 bg-white shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Circular Radar Visual Meter */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Concentric Radar Rings */}
              <div className="absolute inset-0 rounded-full border border-slate-200"></div>
              <div className="absolute inset-4 rounded-full border border-slate-200"></div>
              <div className="absolute inset-10 rounded-full border border-slate-200"></div>
              <div className="absolute inset-16 rounded-full border border-emerald-300"></div>

              {/* Radar Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px] bg-slate-200"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-[1px] bg-slate-200"></div>
              </div>

              {/* Animated Radar Sweep */}
              <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none">
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-tl-full origin-bottom-right"></div>
              </div>

              {/* Center Gauge Score */}
              <div className={`relative z-10 w-24 h-24 rounded-full bg-white border-4 flex flex-col items-center justify-center shadow-lg ${getScoreColor(radar.risk_score_numeric)}`}>
                <span className="text-3xl font-black">{radar.risk_score_numeric}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                  {lang === 'bn' ? 'ঝুঁকি স্কোর' : 'Risk Score'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2 text-center font-medium">
              {lang === 'bn' ? 'স্বয়ংক্রিয় স্ক্রিনিং ইনডেক্স (০-১০০)' : 'Automated Screening Index (0-100)'}
            </p>
          </div>

          {/* Overview Metrics & Level */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                  {lang === 'bn' ? 'সার্বিক ঝুঁকি মূল্যায়ন' : 'Overall Risk Evaluation'}
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <RiskBadge risk={radar.overall_risk_level} className="text-sm px-3.5 py-1" />
                  <span className="text-xs font-mono font-bold text-slate-500">({radar.tracking_id})</span>
                </div>
              </div>

              {/* Download PDF Risk Report */}
              <button
                type="button"
                onClick={async () => {
                  try {
                    const c = await api.getCase(caseId);
                    if (c) {
                      generateAndDownloadReport(c, lang);
                      return;
                    }
                  } catch (e) {}
                  generateAndDownloadReport({
                    id: caseId,
                    tracking_id: radar.tracking_id,
                    user_id: 'citizen',
                    title: `Verification of ${radar.tracking_id}`,
                    description: 'BHUMIverse Automated Fraud Screening',
                    district: 'Dhaka',
                    upazila: 'Savar',
                    mouza: 'Baunia',
                    plot_khatian_summary: 'Dag 1025, Khatian 520',
                    status: 'submitted',
                    risk_level: radar.overall_risk_level,
                    is_demo: true,
                    submitted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    documents: [],
                    land_records: [],
                    transactions: [],
                    findings: radar.findings,
                    reviews: [],
                    timeline: [],
                    radar
                  }, lang);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'ডাউনলোড PDF রিপোর্ট' : 'Download PDF Report'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-600 font-medium block">
                  {lang === 'bn' ? 'শনাক্তকৃত অসঙ্গতি' : 'Identified Findings'}
                </span>
                <span className="text-xl font-black text-slate-900">
                  {radar.findings_count} {lang === 'bn' ? 'টি' : ''}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-600 font-medium block">
                  {lang === 'bn' ? 'গুরুতর দ্বন্দ্ব' : 'Critical Conflicts'}
                </span>
                <span className={`text-xl font-black ${radar.critical_conflicts_count > 0 ? 'text-rose-700' : 'text-[#0B6E4F]'}`}>
                  {radar.critical_conflicts_count} {lang === 'bn' ? 'টি' : ''}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-600 font-medium block">
                  {lang === 'bn' ? 'মূল্যায়ন রুলস' : 'Evaluation Rules'}
                </span>
                <span className="text-xl font-black text-slate-800">Rules A to H</span>
              </div>
            </div>

            {/* Disclaimer strip */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
              <p className="leading-relaxed">
                <b>{lang === 'bn' ? 'জরুরি নোটিশ:' : 'Notice:'}</b> {radar.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Checks for Human Reviewer */}
      {radar.recommended_checks && radar.recommended_checks.length > 0 && (
        <div className="gov-card p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-[#0B6E4F]" />
            {lang === 'bn' ? 'পর্যালোচকের জন্য প্রস্তাবিত পদক্ষেপ:' : 'Recommended Steps for Officer Review:'}
          </h4>
          <ul className="space-y-2">
            {radar.recommended_checks.map((chk, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                <ArrowRight className="w-3.5 h-3.5 text-[#0B6E4F] flex-shrink-0 mt-0.5" />
                <span>{chk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Rule-Based Findings List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#0B6E4F]" />
          {lang === 'bn' ? 'রুল-ভিত্তিক বিশদ প্রমাণ ও ফলাফল:' : 'Rule-Based Findings & Evidence Trail:'}
        </h3>

        {radar.findings.length === 0 ? (
          <div className="gov-card p-8 rounded-2xl text-center border border-slate-200 bg-white shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-[#0B6E4F] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900">
              {lang === 'bn' ? 'কোনো অসঙ্গতি বা বিরোধ শনাক্ত হয়নি' : 'No Conflicts or Discrepancies Detected'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {lang === 'bn'
                ? 'জমা দেওয়া দলিল ও নামজারি খতিয়ানের দাগ, মৌজা এবং জমির পরিমাপে কোনো দ্বন্দ্ব পাওয়া যায়নি।'
                : 'Deed and mutation schedules match precisely across plot numbers, mouza boundaries, and land acreage.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {radar.findings.map((f) => (
              <div
                key={f.id}
                className={`p-5 rounded-2xl border transition-all ${getSeverityStyle(f.severity)}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-white border border-slate-300 text-slate-900">
                      {f.rule_id}
                    </span>
                    <span className="text-xs uppercase tracking-wide font-bold opacity-90">
                      {f.finding_type}
                    </span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-white border border-slate-300">
                    {f.severity} SEVERITY
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-2">{f.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed mb-3 font-normal">
                  {f.explanation}
                </p>

                {/* Conflicting Values Comparison Grid */}
                {f.conflicting_values && Object.keys(f.conflicting_values).length > 0 && (
                  <div className="my-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-2">
                      {lang === 'bn' ? 'পরস্পরবিরোধী মানসমূহ:' : 'Conflicting Values Comparison:'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(f.conflicting_values).map(([k, v]) => (
                        <div key={k} className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-600 font-mono text-[11px] font-medium">{k}:</span>
                          <span className="font-bold text-slate-900">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Review Action */}
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-start gap-2 text-xs">
                  <span className="font-bold text-slate-900 flex-shrink-0">
                    {lang === 'bn' ? 'করণীয়:' : 'Action Required:'}
                  </span>
                  <span className="text-slate-700">{f.recommended_action}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
