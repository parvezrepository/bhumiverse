'use client';

import React, { useState, useEffect } from 'react';
import FraudNetworkGraph from '@/components/graph/FraudNetworkGraph';
import { api } from '@/lib/api';
import { NetworkGraphData } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { Network, Info, RefreshCw } from 'lucide-react';

export default function AdminGlobalGraphPage() {
  const { lang } = useLanguage();
  const [graphData, setGraphData] = useState<NetworkGraphData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGraph() {
      setLoading(true);
      // Fetch global graph
      const g = await api.getNetworkGraph('case-demo-002');
      setGraphData(g);
      setLoading(false);
    }
    loadGraph();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Network className="w-6 h-6 text-[#0B6E4F]" />
            {lang === 'en' ? 'Cross-Case Entity Fraud Graph' : 'ক্রস-কেস ফ্রড নেটওয়ার্ক গ্রাফ'}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {lang === 'en'
              ? 'Multi-case relationship graph mapping land plots, deeds, sellers, buyers, and unauthorized title transfers.'
              : 'একাধিক কেসের প্লট, দলিল, দাতা এবং গ্রহীতাদের মধ্যকার সম্পর্ক এবং অননুমোদিত হস্তান্তরের সংকেত'}
          </p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5 font-medium">
        <Info className="w-4 h-4 text-[#0B6E4F] flex-shrink-0 mt-0.5" />
        <p>
          {lang === 'en'
            ? 'Red dashed edges indicate conflicting claims by separate buyers for the same plot. Click any node to open its property inspector drawer.'
            : 'লাল ড্যাশযুক্ত রেখাগুলো একই দাগে পৃথক ক্রেতার পরস্পরবিরোধী দাবি নির্দেশ করে। কোনো নোডে ক্লিক করে তার বিস্তারিত প্রোপার্টি ড্রয়ার দেখুন।'}
        </p>
      </div>

      {loading || !graphData ? (
        <div className="p-16 text-center text-xs text-slate-500">
          {lang === 'en' ? 'Generating fraud network graph...' : 'গ্রাফ নেটওয়ার্ক তৈরি হচ্ছে...'}
        </div>
      ) : (
        <FraudNetworkGraph graphData={graphData} />
      )}
    </div>
  );
}
