'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'bn' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    // Top Ribbon
    'gov.date': 'রবিবার, ৩ কার্তিক ১৪৩৩ ১৮ অক্টোবর ২০২৬',
    'gov.sub_header': 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | ভূমি মন্ত্রণালয়',
    'gov.hackathon': 'LandTech Innovation Hackathon 2026',
    'gov.p3': 'Problem P3: ভূমি জালিয়াতি ও দ্বৈত বিক্রয় শনাক্তকরণ',

    // Branding
    'brand.title': 'BHUMIverse',
    'brand.tagline': 'জমি জালিয়াতি ও দ্বৈত বিক্রয় শনাক্তকরণ প্ল্যাটফর্ম',
    'brand.sub': 'কৃত্রিম বুদ্ধিমত্তা ও রুল-ভিত্তিক ভূমি নথি যাচাই প্ল্যাটফর্ম',
    'brand.badge': 'ভূমিভার্স AI',

    // Top Nav
    'nav.home': 'হোম',
    'nav.features': 'ডিটেকশন রুলস',
    'nav.how_it_works': 'কাজের পদ্ধতি',
    'nav.demo': 'লাইভ ডেমো',
    'nav.case_vault': 'কেস তালিকা',
    'nav.login': 'লগইন',
    'nav.citizen_portal': 'নাগরিক কর্নার',
    'nav.officer_portal': 'অফিসার কনসোল',
    'nav.btn_new_verify': 'দলিল যাচাই করুন',
    'nav.btn_admin_review': 'অফিসার ড্যাশবোর্ড',
    'nav.engine_online': 'FastAPI ইঞ্জিন সচল',
    'nav.demo_active': 'ডেমো মোড সক্রিয়',

    // Sidebar Items
    'nav.overview': 'ওভারভিউ',
    'nav.new_verification': 'নতুন যাচাই',
    'nav.my_cases': 'আমার কেসসমূহ',
    'nav.documents': 'সংরক্ষিত দলিল',
    'nav.reports': 'ঝুঁকি রিপোর্ট',
    'nav.settings': 'প্রোফাইল সেটিংস',
    'nav.all_cases': 'সকল কেস রিভিউ',
    'nav.global_graph': 'ফ্রড নেটওয়ার্ক গ্রাফ',
    'nav.audit_logs': 'অডিট লগ ট্রেইল',
    'nav.demo_data': 'সিন্থেটিক ডেটা',
    'nav.sign_out': 'লগআউট',

    // Hero Section
    'hero.badge': 'LandTech Hackathon 2026 — Problem Statement P3',
    'hero.title_p1': 'ভূমি জালিয়াতি ও দ্বৈত বিক্রয়',
    'hero.title_p2': 'শনাক্তকরণের এআই প্ল্যাটফর্ম',
    'hero.subtitle': 'মুহূর্তেই সাফ কোবালা দলিল, নামজারি ও পর্চা স্বয়ংক্রিয় স্ক্রিনিং করুন। একই জমির গোপন দ্বৈত বিক্রয়, দলিল-নামজারি অসঙ্গতি এবং পরিমার্জিত জালিয়াতি শনাক্ত করুন সম্পূর্ণ ব্যাখ্যাযোগ্য প্রমাণের সাহায্যে।',
    'hero.start_verify': 'দলিল যাচাই শুরু করুন',
    'hero.demo_cases': 'লাইভ ডেমো পরীক্ষা করুন',

    // Hero Live Radar Card
    'hero.radar_title': 'লাইভ জালিয়াতি শনাক্তকরণ প্রিভিউ',
    'hero.radar_case': 'কেস BV-2026-0002',
    'hero.radar_risk': 'উচ্চ ঝুঁকি (স্কোর ৮৮/১০০)',
    'hero.radar_conflict': 'দ্বৈত বিক্রয় ঝুঁকি শনাক্ত (Rule B Flag)',
    'hero.radar_conflict_desc': 'প্লট দাগ ৪০৫ (মৌজা জোয়ার সাহারা) একই বিক্রেতা কর্তৃক ২০২০ ও ২০২৩ সালে পৃথক দুই ব্যক্তির কাছে বিক্রির দলিল শনাক্ত হয়েছে।',
    'hero.radar_view_case': 'সম্পূর্ণ কেস রিপোর্ট দেখুন',

    // 4 Focused Pillars
    'pillars.heading': 'মূল জালিয়াতি শনাক্তকরণ সুবিধাসমূহ',
    'pillars.subheading': 'আইনি ও স্বচ্ছ ৮টি সুনির্দিষ্ট নিয়মে (Rules A to H) দলিল ও খতিয়ান বিশ্লেষণ',
    'pillar1.title': 'দ্বৈত বিক্রয় শনাক্তকরণ (Rule B)',
    'pillar1.desc': 'নামজারি হালনাগাদ হওয়ার আগেই একই প্লটের জমি গোপনে একাধিক ক্রেতার নিকট বিক্রির চেষ্টা স্বয়ংক্রিয়ভাবে শনাক্ত করে।',
    'pillar2.title': 'দলিল ও নামজারি অসঙ্গতি (Rule C & D)',
    'pillar2.desc': 'সাব-রেজিস্ট্রি দলিল এবং নামজারি খতিয়ানের মধ্যে দাগ, খতিয়ান নম্বর বা জমির পরিমাপে ৩% এর বেশি পার্থক্য বের করে।',
    'pillar3.title': 'জাল কপি ও ডুপ্লিকেট ফাইল (Rule A & G)',
    'pillar3.desc': 'ক্রিপ্টোগ্রাফিক SHA-256 হ্যাশ দিয়ে ডুপ্লিকেট ফাইল এবং দলিলের নম্বর এক রেখে ক্রেতার নাম পরিবর্তনের কারসাজি ধরে ফেলে।',
    'pillar4.title': 'টাইমলাইন ও সিন্ডিকেট গ্রাফ (Rule H)',
    'pillar4.desc': 'লেনদেনের কালক্রমিক অসঙ্গতি চিহ্নিত করে এবং একাধিক বিতর্কিত জমির সাথে জড়িত ভূমিদস্যু সিন্ডিকেটের নেটওয়ার্ক উন্মোচন করে।',

    // 3-Step Workflow
    'workflow.heading': 'কীভাবে কাজ করে BHUMIverse?',
    'workflow.subheading': 'কাগজের স্ক্যান কপি থেকে মুহূর্তেই প্রমাণভিত্তিক ফলাফল',
    'workflow.step1_title': '১. দলিল ও পর্চা আপলোড',
    'workflow.step1_desc': 'সাফ কোবালা, নামজারি প্রস্তাবপত্র বা খতিয়ানের স্ক্যান কপি (PDF, JPG, PNG) আপলোড করুন।',
    'workflow.step2_title': '২. স্বয়ংক্রিয় ওসিআর ও রূপান্তর',
    'workflow.step2_desc': 'বাংলা সংখ্যা, খতিয়ান, দাগ ও পরিমাপের একক (শতক, কাঠা) স্বয়ংক্রিয়ভাবে এক্সট্রাক্ট ও নরমালাইজ হয়।',
    'workflow.step3_title': '৩. ঝুঁকি রাডার ও অডিট রিপোর্ট',
    'workflow.step3_desc': '৮টি নিয়মে ক্রস-চেক করে ব্যাখ্যাযোগ্য রিস্ক স্কোর ও ডাউনলোডযোগ্য PDF অডিট রিপোর্ট প্রদান করে।',

    // Pre-seeded Scenarios
    'scenarios.heading': 'প্রস্তুতকৃত ৬টি হ্যাকাথন টেস্ট সিনারিও',
    'scenarios.subheading': 'যেকোনো সিনারিও নির্বাচন করে সরাসরি সিস্টেমের কার্যকারিতা পরীক্ষা করুন',
    'scenarios.case1_title': 'দ্বৈত বিক্রয় ঝুঁকি (দাগ ৪০৫, জোয়ার সাহারা)',
    'scenarios.case1_badge': 'উচ্চ ঝুঁকি (Score 88)',
    'scenarios.case2_title': 'বৈধ ও নির্ভেজাল রেকর্ড (দাগ ১০২৫, বাউনিয়া)',
    'scenarios.case2_badge': 'ঝুঁকিমুক্ত (Score 5)',
    'scenarios.case3_title': 'দলিল-নামজারি অসঙ্গতি (দাগ ৭৫০ বনাম ৮২০)',
    'scenarios.case3_badge': 'উচ্চ ঝুঁকি (Score 82)',
    'scenarios.case4_title': 'ডুপ্লিকেট ফাইল আপলোড (SHA-256 ম্যাচ)',
    'scenarios.case4_badge': 'মাঝারি ঝুঁকি (Score 65)',
    'scenarios.case5_title': 'জমির পরিমাপে ৩৭.৫% অমিল',
    'scenarios.case5_badge': 'উচ্চ ঝুঁকি (Score 78)',
    'scenarios.case6_title': 'জাল বা পরিমার্জিত ফটোকপি',
    'scenarios.case6_badge': 'উচ্চ ঝুঁকি (Score 85)',

    // Common Buttons, Badges & Labels
    'common.download_pdf': 'ডাউনলোড PDF রিপোর্ট',
    'common.view_details': 'বিস্তারিত দেখুন',
    'common.risk_score': 'ঝুঁকি স্কোর',
    'common.overall_risk': 'সামগ্রিক ঝুঁকি',
    'common.status': 'অবস্থা',
    'common.findings': 'শনাক্তকৃত অসঙ্গতিসমূহ',
    'common.recommended_actions': 'প্রস্তাবিত পদক্ষেপ',
    'common.deed_data': 'সাব-রেজিস্ট্রি দলিল',
    'common.mutation_data': 'এসিল্যান্ড নামজারি',
    'common.variance': 'পার্থক্য',
    'common.timeline': 'লেনদেন টাইমলাইন',
    'common.graph': 'সম্পর্কিত নেটওয়ার্ক',
    'common.diff': 'স্মার্ট ডকুমেন্ট ডিফারেন্স',
    'common.radar': 'এক্সপ্লেইনেবল রাডার',
    'common.search_placeholder': 'ট্র্যাকিং আইডি, দাগ বা খতিয়ান দিয়ে খুঁজুন...',
    'common.reset_data': 'ডেমো ডেটা রিসেট',
    'common.disclaimer': 'দায়বদ্ধতা অস্বীকৃতি: এটি একটি সহায়ক ঝুঁকি যাচাইকরণ স্ক্রিনিং অ্যালগরিদম। চূড়ান্ত আইনি সিদ্ধান্ত অনুমোদিত কর্মকর্তা দ্বারা গৃহীত হবে। ডেটাসেটের সকল তথ্য হ্যাকাথনের জন্য কৃত্রিমভাবে তৈরি (DEMO DATA — NOT OFFICIAL RECORD)।',
    'common.copyright': '© ২০২৬ BHUMIverse — LandTech Innovation Hackathon 2026',

    // Demo Page
    'demo.title': 'লাইভ স্ক্রিনিং স্যান্ডবক্স (Evaluation Sandbox)',
    'demo.subtitle': 'বাস্তবধর্মী সিন্থেটিক কেস নির্বাচন করে রুল ইঞ্জিন, স্মার্ট ডিফারেন্স ও ফ্রড গ্রাফ সরাসরি পরীক্ষা করুন।',
    'demo.select_scenario': 'যাচাই করার জন্য টেস্ট সিনারিও নির্বাচন করুন:',
    'demo.tab_radar': 'ফ্রড রাডার (Radar)',
    'demo.tab_diff': 'স্মার্ট ডিফারেন্স (Diff)',
    'demo.tab_graph': 'নেটওয়ার্ক গ্রাফ (Graph)',
    'demo.tab_timeline': 'টাইমলাইন (Timeline)',
  },

  en: {
    // Top Ribbon
    'gov.date': 'Sunday, 18 October 2026',
    'gov.sub_header': "Government of the People's Republic of Bangladesh | Ministry of Land",
    'gov.hackathon': 'LandTech Innovation Hackathon 2026',
    'gov.p3': 'Problem P3: Land Fraud & Double-Selling Risk Detection',

    // Branding
    'brand.title': 'BHUMIverse',
    'brand.tagline': 'AI-Assisted Land Fraud & Double-Selling Prevention',
    'brand.sub': 'Deterministic Rule-Based Land Document Screening Platform',
    'brand.badge': 'BHUMIverse AI',

    // Top Nav
    'nav.home': 'Home',
    'nav.features': 'Detection Rules',
    'nav.how_it_works': 'How It Works',
    'nav.demo': 'Live Demo',
    'nav.case_vault': 'Case Vault',
    'nav.login': 'Sign In',
    'nav.citizen_portal': 'Citizen Portal',
    'nav.officer_portal': 'Officer Console',
    'nav.btn_new_verify': 'Verify Land Record',
    'nav.btn_admin_review': 'Officer Dashboard',
    'nav.engine_online': 'FastAPI Engine Online',
    'nav.demo_active': 'Demo Mode Active',

    // Sidebar Items
    'nav.overview': 'Overview',
    'nav.new_verification': 'New Verification',
    'nav.my_cases': 'My Cases',
    'nav.documents': 'Stored Documents',
    'nav.reports': 'Risk Reports',
    'nav.settings': 'Profile Settings',
    'nav.all_cases': 'Review All Cases',
    'nav.global_graph': 'Global Fraud Graph',
    'nav.audit_logs': 'Audit Logs Trail',
    'nav.demo_data': 'Synthetic Dataset',
    'nav.sign_out': 'Sign Out',

    // Hero Section
    'hero.badge': 'LandTech Hackathon 2026 — Problem Statement P3',
    'hero.title_p1': 'AI-Assisted Land Fraud &',
    'hero.title_p2': 'Double-Selling Risk Analysis',
    'hero.subtitle': 'Screen registered deeds, mutation records, and porchas in seconds. Detect conflicting double sales on identical plots, area variances, altered copies, and unlinked chain of title with 100% explainable evidence.',
    'hero.start_verify': 'Start Document Verification',
    'hero.demo_cases': 'Explore Live Demo Scenarios',

    // Hero Live Radar Card
    'hero.radar_title': 'Live Conflict Detection Preview',
    'hero.radar_case': 'Case BV-2026-0002',
    'hero.radar_risk': 'High Risk (Score 88/100)',
    'hero.radar_conflict': 'Double-Selling Risk Detected (Rule B Flag)',
    'hero.radar_conflict_desc': 'Plot Dag 405 (Mouza Joar Sahara) was conveyed by the same vendor in both 2020 and 2023 to two different purchasers.',
    'hero.radar_view_case': 'View Full Case Report',

    // 4 Focused Pillars
    'pillars.heading': 'Core Fraud Detection Capabilities',
    'pillars.subheading': 'Deterministic, transparent, rule-based screening engine (Rules A through H)',
    'pillar1.title': 'Double-Selling Detection (Rule B)',
    'pillar1.desc': 'Detects multiple active sale deeds executed to different buyers for the identical normalized plot before mutation records update.',
    'pillar2.title': 'Deed vs. Mutation Diff (Rule C & D)',
    'pillar2.desc': 'Cross-examines Sub-Registry deeds against AC Land mutation schedules, highlighting discrepancies in dag, khatian, and area.',
    'pillar3.title': 'Altered Document & Duplicate Hash (Rule A & G)',
    'pillar3.desc': 'Uses cryptographic SHA-256 hashes to flag duplicated uploads and catches altered buyer names or deed serial discrepancies.',
    'pillar4.title': 'Timeline & Syndicate Graph (Rule H)',
    'pillar4.desc': 'Analyzes sequential transaction history, flagging registrations preceding deed execution and mapping repeat-offender sellers.',

    // 3-Step Workflow
    'workflow.heading': 'How Does BHUMIverse Work?',
    'workflow.subheading': 'From raw document scan to actionable legal risk intelligence in 3 steps',
    'workflow.step1_title': '1. Upload Documents',
    'workflow.step1_desc': 'Upload Saf Kabala deeds, mutation khatian, or porcha scans (PDF, JPG, PNG).',
    'workflow.step2_title': '2. Automated OCR & Extraction',
    'workflow.step2_desc': 'Converts Bengali numerals, normalizes land units (decimals, katha), and resolves plot keys.',
    'workflow.step3_title': '3. Multi-Rule Risk Analysis',
    'workflow.step3_desc': 'Evaluates Rules A to H, scores risk from 0-100, and generates an official PDF audit report.',

    // Pre-seeded Scenarios
    'scenarios.heading': '6 Pre-Seeded Hackathon Test Scenarios',
    'scenarios.subheading': 'Select any scenario below to immediately test the platform live in the sandbox',
    'scenarios.case1_title': 'Double-Selling Conflict (Dag 405, Joar Sahara)',
    'scenarios.case1_badge': 'High Risk (Score 88)',
    'scenarios.case2_title': 'Clean Legitimate Title (Dag 1025, Baunia)',
    'scenarios.case2_badge': 'Clean Title (Score 5)',
    'scenarios.case3_title': 'Reg-Mutation Mismatch (Dag 750 vs Dag 820)',
    'scenarios.case3_badge': 'High Risk (Score 82)',
    'scenarios.case4_title': 'Duplicate File Upload (SHA-256 Collision)',
    'scenarios.case4_badge': 'Medium Risk (Score 65)',
    'scenarios.case5_title': 'Land Area Variance (37.5% Discrepancy)',
    'scenarios.case5_badge': 'High Risk (Score 78)',
    'scenarios.case6_title': 'Altered Document Photocopy Fraud',
    'scenarios.case6_badge': 'High Risk (Score 85)',

    // Common Buttons, Badges & Labels
    'common.download_pdf': 'Download PDF Report',
    'common.view_details': 'View Details',
    'common.risk_score': 'Risk Score',
    'common.overall_risk': 'Overall Risk',
    'common.status': 'Status',
    'common.findings': 'Identified Discrepancies',
    'common.recommended_actions': 'Recommended Actions',
    'common.deed_data': 'Sub-Registry Deed',
    'common.mutation_data': 'AC Land Mutation',
    'common.variance': 'Discrepancy',
    'common.timeline': 'Transaction Timeline',
    'common.graph': 'Conflict Network',
    'common.diff': 'Smart Document Diff',
    'common.radar': 'Explainable Radar',
    'common.search_placeholder': 'Search by Tracking ID, Dag, or Khatian...',
    'common.reset_data': 'Reset Demo Data',
    'common.disclaimer': 'Legal Disclaimer: This software platform is an automated risk screening aid for prioritization only. Final legal determination requires review by an authorized land official. All displayed datasets are synthetic test records for Hackathon evaluation (DEMO DATA — NOT OFFICIAL RECORD).',
    'common.copyright': '© 2026 BHUMIverse — LandTech Innovation Hackathon 2026',

    // Demo Page
    'demo.title': 'Live Screening Sandbox (Evaluation Sandbox)',
    'demo.subtitle': 'Select realistic synthetic land cases to test the deterministic rule engine, smart diff, and network graph.',
    'demo.select_scenario': 'Select a Hackathon Test Scenario:',
    'demo.tab_radar': 'Fraud Radar',
    'demo.tab_diff': 'Smart Diff',
    'demo.tab_graph': 'Network Graph',
    'demo.tab_timeline': 'Timeline',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'bn',
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('bn');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('bhumiverse_lang') as Language;
      if (savedLang === 'bn' || savedLang === 'en') {
        setLangState(savedLang);
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bhumiverse_lang', newLang);
    }
  };

  const t = (key: string): string => {
    const currentDict = translations[lang];
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    // Fallback to English
    if (translations.en[key]) {
      return translations.en[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
