'use client';

import React from 'react';
import { TimelineEvent } from '@/lib/types';
import { Clock, AlertTriangle, FileText, CheckCircle2, Award, Calendar } from 'lucide-react';

interface Props {
  events: TimelineEvent[];
}

export default function TransactionTimeline({ events }: Props) {
  if (!events || events.length === 0) {
    return (
      <div className="gov-card p-8 rounded-2xl text-center border border-slate-200 bg-white shadow-xs">
        <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-900">কোনো টাইমলাইন তথ্য পাওয়া যায়নি</h4>
        <p className="text-xs text-slate-500 mt-1">জমা দেওয়া দলিলের সাথে কোনো সময়ানুক্রমিক রেকর্ড যুক্ত নেই।</p>
      </div>
    );
  }

  const getEventIcon = (event: TimelineEvent) => {
    if (event.is_conflict) {
      return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    }
    switch (event.event_type) {
      case 'mutation_approved':
        return <Award className="w-4 h-4 text-[#0B6E4F]" />;
      case 'registration':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'deed_executed':
      default:
        return <FileText className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="gov-card p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0B6E4F]" />
              জমি হস্তান্তর ও মিউটেশন টাইমলাইন (Transaction Timeline)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              ঐতিহাসিক হস্তান্তরের সময়ানুক্রমিক সিকোয়েন্স এবং মধ্যবর্তী সম্ভাব্য গ্যাপসমূহ
            </p>
          </div>
          <span className="text-xs bg-slate-100 font-bold px-3 py-1 rounded-full text-slate-700 border border-slate-200">
            {events.length} Historical Milestone(s)
          </span>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {events.map((ev, index) => (
            <div key={ev.id || index} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center border transition-transform group-hover:scale-110 shadow-2xs ${
                  ev.is_conflict
                    ? 'bg-rose-100 border-rose-300'
                    : 'bg-white border-slate-300'
                }`}
              >
                {getEventIcon(ev)}
              </div>

              {/* Event Content Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  ev.is_conflict
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{ev.title}</span>
                    {ev.is_conflict && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                        Conflict Alert
                      </span>
                    )}
                  </div>

                  {ev.event_date && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded font-semibold">
                      <Calendar className="w-3 h-3 text-slate-400" /> {ev.event_date}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">{ev.description}</p>
                <span className="text-[10px] text-slate-500 mt-2 block font-semibold">Record Type: {ev.record_type}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Notice on Timeline Gaps */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <b>টাইমলাইন সতর্কতা:</b> এই টাইমলাইন শুধুমাত্র দাখিলকৃত দলিলের তারিখের উপর ভিত্তি করে সাজানো হয়েছে। এটি সরকারি বালাম বহির পূর্ণাঙ্গ অবিচ্ছিন্ন চেইন (Complete Title Chain) নয়। মধ্যবর্তী বায়া দলিল (Via deeds) অথবা ওয়ারিশান অনুপস্থিত থাকতে পারে।
          </p>
        </div>
      </div>
    </div>
  );
}
