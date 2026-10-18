'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  FileCheck, 
  Upload, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Sparkles,
  Lock,
  UserCheck,
  Download
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NewVerificationPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [step, setStep] = useState<number>(1);
  const [docCategory, setDocCategory] = useState<string>('deed');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('bhumiverse_citizen_session');
      if (!session) {
        localStorage.setItem('bhumiverse_citizen_session', JSON.stringify({
          email: 'citizen@bhumiverse.internal',
          full_name: 'Parvez Ahmed',
          nid: 'NID-8841-XXXX',
          logged_in_at: new Date().toISOString()
        }));
      }
      setIsAuthenticated(true);
    }
  }, []);

  const handleInstantCitizenLogin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bhumiverse_citizen_session', JSON.stringify({
        email: 'citizen@bhumiverse.internal',
        full_name: 'Parvez Ahmed',
        nid: 'NID-8841-XXXX',
        logged_in_at: new Date().toISOString()
      }));
      api.setRole('citizen');
      setIsAuthenticated(true);
    }
  };

  // Metadata form
  const [title, setTitle] = useState('');
  const [district, setDistrict] = useState(lang === 'bn' ? 'ঢাকা' : 'Dhaka');
  const [upazila, setUpazila] = useState(lang === 'bn' ? 'সাভার' : 'Savar');
  const [mouza, setMouza] = useState(lang === 'bn' ? 'বাউনিয়া' : 'Baunia');
  const [khatianNo, setKhatianNo] = useState(lang === 'bn' ? '৫২০' : '520');
  const [dagNo, setDagNo] = useState(lang === 'bn' ? '১০২৫' : '1025');
  const [deedNo, setDeedNo] = useState('10482/2021');
  const [landArea, setLandArea] = useState(lang === 'bn' ? '১২' : '12');
  const [landAreaUnit, setLandAreaUnit] = useState('decimal');

  // OCR preview / correction state
  const [extractedBuyer, setExtractedBuyer] = useState(lang === 'bn' ? 'জনাব পারভেজ আলম' : 'Parvez Alim');
  const [extractedSeller, setExtractedSeller] = useState(lang === 'bn' ? 'মো: রফিক উদ্দিন' : 'Md Rofiq Uddin');
  const [ocrConfidence, setOcrConfidence] = useState(0.95);
  const [loading, setLoading] = useState(false);

  const categories = [
    { 
      id: 'deed', 
      title: lang === 'bn' ? 'সাফ কোবালা বা রেজিস্ট্রিকৃত দলিল' : 'Saf Kabala / Registered Deed', 
      desc: lang === 'bn' ? 'সাব-রেজিস্ট্রি অফিস কর্তৃক নিবন্ধিত বিক্রয় বা দানপত্র দলিল' : 'Registered conveyance or sale deed from Sub-Registry office' 
    },
    { 
      id: 'khatian_porcha', 
      title: lang === 'bn' ? 'খতিয়ান বা পর্চা' : 'Khatian / Porcha Record', 
      desc: lang === 'bn' ? 'সিএস, এসএ, আরএস বা বিএস জরিপ খতিয়ানের কপি' : 'Certified survey khatian copy (CS, SA, RS, or BS)' 
    },
    { 
      id: 'mutation_record', 
      title: lang === 'bn' ? 'নামজারি খতিয়ান বা ডিসিআর' : 'Mutation Khatian / DCR', 
      desc: lang === 'bn' ? 'সহকারী কমিশনার (ভূমি) অফিস কর্তৃক ইস্যুকৃত নামজারি' : 'Official mutation khatian issued by Assistant Commissioner (Land)' 
    },
    { 
      id: 'tax_receipt', 
      title: lang === 'bn' ? 'ভূমি উন্নয়ন কর দাখিলা' : 'LD-Tax Dakhila Receipt', 
      desc: lang === 'bn' ? 'ইউনিয়ন ভূমি অফিস কর্তৃক গৃহীত খাজনা দাখিলা' : 'Union Land Office land development tax receipt' 
    },
    { 
      id: 'other_supporting', 
      title: lang === 'bn' ? 'অন্যান্য সহায়ক নথি' : 'Other Supporting Documents', 
      desc: lang === 'bn' ? 'ওয়ারিশান সনদ, নকশা বা বায়া দলিলের কপি' : 'Inheritance certificates, cadastral maps, or chain deeds' 
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFileName(f.name);
      setFileSize(`${(f.size / (1024 * 1024)).toFixed(2)} MB`);
      if (!title) {
        setTitle(`Verification of Dag ${dagNo}, ${mouza} Mouza`);
      }
    }
  };

  const handleNextStep = () => {
    if (step === 2 && !fileName) {
      setFileName('DEED_SAMPLE_VERIFICATION.pdf');
      setFileSize('1.25 MB');
    }
    setStep(s => Math.min(s + 1, 5));
  };

  const handleSubmitCase = async () => {
    if (!isAuthenticated) {
      handleInstantCitizenLogin();
    }
    setLoading(true);
    try {
      const created = await api.createCase({
        title: title || `Verification of Dag ${dagNo}, ${mouza} (${upazila})`,
        district,
        upazila,
        mouza,
        dag_no: dagNo,
        khatian_no: khatianNo,
        deed_no: deedNo,
        land_area: parseFloat(landArea) || 12.0,
        land_area_unit: landAreaUnit
      });

      router.push(`/dashboard/cases/${created.id}`);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Consistent Demo Citizen Identity Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-300 text-emerald-900 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0B6E4F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">
                {lang === 'bn' ? 'পারভেজ আহমেদ' : 'Parvez Ahmed'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#0B6E4F] border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {lang === 'bn' ? 'নাগরিক ভেরিফাইড (ডেমো)' : 'Verified Citizen (Demo)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {lang === 'bn'
                ? 'নাগরিক আইডি: NID-8841-XXXX • আপনার প্রোফাইল দিয়ে সরাসরি নতুন জমি যাচাইকরণ আবেদন করতে পারেন।'
                : 'Citizen ID: NID-8841-XXXX • You can directly submit land verification requests with this profile.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-800 bg-white/90 px-3 py-1.5 rounded-lg border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{lang === 'bn' ? 'স্বয়ংক্রিয় এআই ইঞ্জিন সক্রিয়' : 'Automated AI Engine Active'}</span>
        </div>
      </div>

      {/* Wizard Header */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-[#0B6E4F]" />
          {lang === 'bn' ? 'নতুন জমি যাচাই আবেদন' : 'New Land Document Verification'}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {lang === 'bn'
            ? 'সহজ ধাপে আপনার জমির দলিল আপলোড করুন এবং স্বয়ংক্রিয় এআই/ওসিআর স্ক্রিনিং ফলাফল পান।'
            : 'Upload registered deeds or mutation records for automated OCR, conflict screening, and risk scoring.'}
        </p>

        {/* Stepper Indicator */}
        <div className="grid grid-cols-5 gap-2 mt-6">
          {[
            { n: 1, label: lang === 'bn' ? 'শ্রেণি নির্বাচন' : 'Category' },
            { n: 2, label: lang === 'bn' ? 'ফাইল আপলোড' : 'Upload' },
            { n: 3, label: lang === 'bn' ? 'মেটাডাটা' : 'Metadata' },
            { n: 4, label: lang === 'bn' ? 'OCR প্রিভিউ' : 'OCR Preview' },
            { n: 5, label: lang === 'bn' ? 'নিশ্চিতকরণ' : 'Confirm' },
          ].map(s => (
            <div key={s.n} className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${
                  step === s.n
                    ? 'bg-[#0B6E4F] text-white ring-4 ring-emerald-500/20'
                    : step > s.n
                    ? 'bg-emerald-100 text-[#0B6E4F] border border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {step > s.n ? <Check className="w-4 h-4" /> : s.n}
              </div>
              <span className={`text-[11px] mt-1.5 font-bold hidden sm:block ${step >= s.n ? 'text-[#0B6E4F]' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Category Selection */}
      {step === 1 && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            {lang === 'bn' ? 'ধাপ ১: নথির শ্রেণি নির্বাচন করুন' : 'Step 1: Select Document Category'}
          </h3>
          <div className="space-y-2.5">
            {categories.map(c => (
              <label
                key={c.id}
                onClick={() => setDocCategory(c.id)}
                className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                  docCategory === c.id
                    ? 'bg-emerald-50/70 border-[#0B6E4F] shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="docCategory"
                  checked={docCategory === c.id}
                  onChange={() => setDocCategory(c.id)}
                  className="mt-1 text-[#0B6E4F] focus:ring-[#0B6E4F]"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{c.title}</span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">{c.desc}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step: Upload'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: File Upload */}
      {step === 2 && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'bn' ? 'ধাপ ২: ফাইল আপলোড করুন' : 'Step 2: Upload Document File'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'bn' ? 'আপনার আসল ফাইল আপলোড করুন অথবা নিচের তৈরি করা ডামি ডাটা নির্বাচন করুন' : 'Upload your document or choose from ready-to-test dummy datasets'}
              </p>
            </div>
            {fileName && (
              <span className="text-[11px] font-bold text-[#0B6E4F] bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg">
                ✓ {fileName}
              </span>
            )}
          </div>
          
          {/* Main Upload Dropzone */}
          <div className="border-2 border-dashed border-emerald-300 hover:border-[#0B6E4F] rounded-2xl p-7 text-center space-y-3 bg-emerald-50/20 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#0B6E4F] mx-auto border border-emerald-200 shadow-2xs">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">
                {lang === 'bn' ? 'দলিল বা খতিয়ানের ফাইল টেনে আনুন অথবা ব্রাউজ করুন' : 'Drag & drop land document or browse file'}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {lang === 'bn' ? 'সমর্থিত ফরম্যাট: PDF, JPG, PNG (সর্বোচ্চ ১৫ মেগাবাইট)' : 'Supported formats: PDF, JPG, PNG (Max 15 MB)'}
              </span>
            </div>

            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload-input"
            />
            <label
              htmlFor="file-upload-input"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-sm transition-colors"
            >
              {lang === 'bn' ? 'ফাইল পছন্দ করুন' : 'Choose File'}
            </label>

            {fileName && (
              <div className="p-3 mt-2 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center justify-center gap-2 font-medium">
                <FileText className="w-4 h-4 text-[#0B6E4F]" />
                <span>{lang === 'bn' ? 'নির্বাচিত ফাইল:' : 'Selected File:'} <b>{fileName}</b> ({fileSize})</span>
              </div>
            )}
          </div>

          {/* Realistic Dummy Data & Sample Document Selection (image generate na kore dummy data) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                {lang === 'bn' ? 'টেস্ট করার জন্য নমুনা ডামি ডেটা ও ফাইল (Pre-loaded Dummy Datasets):' : 'Pre-loaded Dummy Datasets for Instant Testing:'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {lang === 'bn' ? '১-ক্লিকে ডেটা পূরণ করুন' : '1-Click Autofill'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Dummy 1: Clean Saf Kabala Deed */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#0B6E4F] transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {lang === 'bn' ? 'বৈধ সাফ কোবালা' : 'Clean Deed'}
                  </span>
                  <a
                    href="/demo-documents/SAF_KABALA_DEED_10482_SAVAR.pdf"
                    download="SAF_KABALA_DEED_10482_SAVAR.pdf"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B6E4F] hover:underline"
                    title="Download Sample PDF"
                  >
                    <Download className="w-3 h-3" />
                    {lang === 'bn' ? 'ডাউনলোড PDF' : 'Download PDF'}
                  </a>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">দলিল নং ১০৪৮২/২০২১ (সাভার)</h4>
                  <p className="text-[11px] text-slate-600">দাগ: ১০২৫ • বাউনিয়া • ১২ শতক • ক্রেতা: পারভেজ আলম</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileName('SAF_KABALA_DEED_10482_SAVAR.pdf');
                    setFileSize('1.05 MB');
                    setTitle('সাভার বাউনিয়া মৌজার জমি যাচাই (দাগ ১০২৫)');
                    setDistrict('Dhaka');
                    setUpazila('Savar');
                    setMouza('Baunia');
                    setDagNo('1025');
                    setKhatianNo('520');
                    setDeedNo('10482/2021');
                    setLandArea('12.0');
                    setExtractedBuyer('Parvez Alim');
                    setExtractedSeller('Md Rofiq Uddin');
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  {lang === 'bn' ? '✓ এই ডামি দলিলটি নির্বাচন করুন' : '✓ Select This Dummy Deed'}
                </button>
              </div>

              {/* Dummy 2: Double-Selling Conflicting Deed */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-white hover:border-rose-400 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                    {lang === 'bn' ? 'দ্বৈত বিক্রয় দলিল' : 'Double-Selling'}
                  </span>
                  <a
                    href="/demo-documents/CONFLICTING_DEED_9102_2023.pdf"
                    download="CONFLICTING_DEED_9102_2023.pdf"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:underline"
                    title="Download Sample PDF"
                  >
                    <Download className="w-3 h-3" />
                    {lang === 'bn' ? 'ডাউনলোড PDF' : 'Download PDF'}
                  </a>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">দলিল নং ৯১০২/২০২৩ (জোয়ার সাহারা)</h4>
                  <p className="text-[11px] text-slate-600">দাগ: ৪০৫ • খতিয়ান: ১০২ • ১০ শতক • ক্রেতা: তরিকুল ইসলাম</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileName('CONFLICTING_DEED_9102_2023.pdf');
                    setFileSize('1.02 MB');
                    setTitle('জোয়ার সাহারা মৌজার দ্বৈত বিক্রয় কেস (দাগ ৪০৫)');
                    setDistrict('Dhaka');
                    setUpazila('Gulshan');
                    setMouza('Joar Sahara');
                    setDagNo('405');
                    setKhatianNo('102');
                    setDeedNo('9102/2023');
                    setLandArea('10.0');
                    setExtractedBuyer('Tariqul Islam');
                    setExtractedSeller('Rafiqul Islam');
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  {lang === 'bn' ? '✓ এই দ্বৈত বিক্রয় ডামি ফাইলটি নিন' : '✓ Select Double-Selling Dummy'}
                </button>
              </div>

              {/* Dummy 3: Mutation Khatian & Porcha */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#0B6E4F] transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    {lang === 'bn' ? 'নামজারি পর্চা' : 'Mutation Porcha'}
                  </span>
                  <a
                    href="/demo-documents/MUTATION_KHATIAN_PORCHA_8842.pdf"
                    download="MUTATION_KHATIAN_PORCHA_8842.pdf"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:underline"
                    title="Download Sample PDF"
                  >
                    <Download className="w-3 h-3" />
                    {lang === 'bn' ? 'ডাউনলোড PDF' : 'Download PDF'}
                  </a>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">নামজারি খতিয়ান নং ৮৮৪২ (সাভার)</h4>
                  <p className="text-[11px] text-slate-600">সাবেক দাগ: ১০২৫ • সাবেক খতিয়ান: ৫২০ • ১২ শতক জমি</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileName('MUTATION_KHATIAN_PORCHA_8842.pdf');
                    setFileSize('524 KB');
                    setTitle('নামজারি খতিয়ান ৮৮৪২ যাচাই (দাগ ১০২৫)');
                    setDistrict('Dhaka');
                    setUpazila('Savar');
                    setMouza('Baunia');
                    setDagNo('1025');
                    setKhatianNo('8842');
                    setDeedNo('10482/2021');
                    setLandArea('12.0');
                    setExtractedBuyer('Parvez Alim');
                    setExtractedSeller('Md Rofiq Uddin');
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  {lang === 'bn' ? '✓ এই নামজারি ডামি ফাইলটি নিন' : '✓ Select Mutation Porcha Dummy'}
                </button>
              </div>

              {/* Dummy 4: Altered Photocopy Deed */}
              <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 hover:bg-white hover:border-amber-500 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                    {lang === 'bn' ? 'ট্যাম্পারড ফটোকপি' : 'Altered Photocopy'}
                  </span>
                  <a
                    href="/demo-documents/ALTERED_PHOTOCOPY_DEED_FRAUD.pdf"
                    download="ALTERED_PHOTOCOPY_DEED_FRAUD.pdf"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:underline"
                    title="Download Sample PDF"
                  >
                    <Download className="w-3 h-3" />
                    {lang === 'bn' ? 'ডাউনলোড PDF' : 'Download PDF'}
                  </a>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">দলিল নং ৭৭/২০২৪ (বিরুলিয়া)</h4>
                  <p className="text-[11px] text-slate-600">দাগ নং ৪৭ (হাতে কাটছাঁটকৃত) • ৮.৫ শতক জমি</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileName('ALTERED_PHOTOCOPY_DEED_FRAUD.pdf');
                    setFileSize('1.08 MB');
                    setTitle('বিরুলিয়া মৌজার পরিমার্জিত দলিল যাচাই (দাগ ৪৭)');
                    setDistrict('Dhaka');
                    setUpazila('Savar');
                    setMouza('Birulia');
                    setDagNo('47');
                    setKhatianNo('102');
                    setDeedNo('77/2024');
                    setLandArea('8.5');
                    setExtractedBuyer('Shamim Hossain');
                    setExtractedSeller('Abdul Barek');
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  {lang === 'bn' ? '✓ এই জাল ফটোকপি ডামি ফাইলটি নিন' : '✓ Select Altered Photocopy Dummy'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {lang === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next: Metadata'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Metadata Entry */}
      {step === 3 && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'bn' ? 'ধাপ ৩: প্লট ও দলিলের তথ্য (ঐচ্ছিক)' : 'Step 3: Plot & Deed Metadata (Optional)'}
            </h3>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {lang === 'bn'
                ? 'অজানা থাকলে খালি রাখতে পারেন; ওসিআর ইঞ্জিন স্ক্যান থেকে স্বয়ংক্রিয়ভাবে ফিল্ড পূরণ করবে।'
                : 'Leave blank if unknown; the OCR engine will automatically extract fields from the scan.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'কেসের শিরোনাম' : 'Case Title'}
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: সাভার বাউনিয়া মৌজার জমি যাচাই' : 'e.g., Verification of Dag 1025, Baunia'}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'জেলা' : 'District'}
              </label>
              <input
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'উপজেলা / সার্কেল' : 'Upazila / Circle'}
              </label>
              <input
                type="text"
                value={upazila}
                onChange={e => setUpazila(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'মৌজার নাম' : 'Mouza Name'}
              </label>
              <input
                type="text"
                value={mouza}
                onChange={e => setMouza(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'দাগ নম্বর' : 'Plot / Dag No'}
              </label>
              <input
                type="text"
                value={dagNo}
                onChange={e => setDagNo(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'খতিয়ান নম্বর' : 'Khatian No'}
              </label>
              <input
                type="text"
                value={khatianNo}
                onChange={e => setKhatianNo(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'দলিল নম্বর' : 'Deed Serial No'}
              </label>
              <input
                type="text"
                value={deedNo}
                onChange={e => setDeedNo(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'জমির পরিমাণ ও একক' : 'Land Area & Unit'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={landArea}
                  onChange={e => setLandArea(e.target.value)}
                  placeholder="12"
                  className="w-2/3 p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0B6E4F] focus:bg-white transition-colors"
                />
                <select
                  value={landAreaUnit}
                  onChange={e => setLandAreaUnit(e.target.value)}
                  className="w-1/3 p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-[#0B6E4F]"
                >
                  <option value="decimal">{lang === 'bn' ? 'শতক' : 'Decimal'}</option>
                  <option value="katha">{lang === 'bn' ? 'কাঠা' : 'Katha'}</option>
                  <option value="bigha">{lang === 'bn' ? 'বিঘা' : 'Bigha'}</option>
                  <option value="acre">{lang === 'bn' ? 'একর' : 'Acre'}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {lang === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next: OCR Preview'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: OCR Extraction & Correction */}
      {step === 4 && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0B6E4F]" />
                {lang === 'bn' ? 'ধাপ ৪: ওসিআর এক্সট্রাকশন ও তথ্য সংশোধন' : 'Step 4: OCR Extraction & Verification'}
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {lang === 'bn'
                  ? 'দলিল থেকে স্বয়ংক্রিয়ভাবে নিষ্কাশিত তথ্য নিচে প্রদর্শিত হলো।'
                  : 'Automated entity extraction values shown below; verify or correct party names if needed.'}
              </p>
            </div>
            <span className="text-xs bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 text-[#0B6E4F] font-mono font-bold">
              OCR: {Math.round(ocrConfidence * 100)}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 text-[11px] block font-medium">
                  {lang === 'bn' ? 'দলিল নম্বর:' : 'Deed No:'}
                </span>
                <span className="font-mono font-bold text-slate-900">{deedNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block font-medium">
                  {lang === 'bn' ? 'দাগ ও খতিয়ান:' : 'Dag & Khatian:'}
                </span>
                <span className="font-mono font-bold text-slate-900">Dag {dagNo}, Khatian {khatianNo}</span>
              </div>
              <div>
                <label className="text-slate-700 text-[11px] block mb-1 font-bold">
                  {lang === 'bn' ? 'দলিল গ্রহীতা / ক্রেতার নাম:' : 'Purchaser / Buyer Name:'}
                </label>
                <input
                  type="text"
                  value={extractedBuyer}
                  onChange={e => setExtractedBuyer(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
                />
              </div>
              <div>
                <label className="text-slate-700 text-[11px] block mb-1 font-bold">
                  {lang === 'bn' ? 'দলিল দাতা / বিক্রেতার নাম:' : 'Vendor / Seller Name:'}
                </label>
                <input
                  type="text"
                  value={extractedSeller}
                  onChange={e => setExtractedSeller(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {lang === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next: Confirm'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Final Confirmation & Submission */}
      {step === 5 && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            {lang === 'bn' ? 'ধাপ ৫: চূড়ান্ত পর্যালোচনা ও সাবমিশন' : 'Step 5: Final Review & Verification'}
          </h3>
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 text-slate-800">
              <div><b>{lang === 'bn' ? 'শ্রেণি:' : 'Category:'}</b> {docCategory}</div>
              <div><b>{lang === 'bn' ? 'ফাইল:' : 'File:'}</b> {fileName}</div>
              <div><b>{lang === 'bn' ? 'মৌজা ও উপজেলা:' : 'Mouza & Upazila:'}</b> {mouza}, {upazila}</div>
              <div><b>{lang === 'bn' ? 'দাগ ও খতিয়ান:' : 'Dag & Khatian:'}</b> Dag {dagNo}, Khatian {khatianNo}</div>
              <div><b>{lang === 'bn' ? 'জমির পরিমাণ:' : 'Land Area:'}</b> {landArea} {landAreaUnit}</div>
              <div><b>{lang === 'bn' ? 'ক্রেতা ও বিক্রেতা:' : 'Buyer & Seller:'}</b> {extractedBuyer} / {extractedSeller}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064E3B] text-[11px] font-medium leading-relaxed">
            {lang === 'bn'
              ? 'সাবমিট করার পর সিস্টেম স্বয়ংক্রিয়ভাবে একটি ইউনিক ট্র্যাকিং আইডি (BV-2026-XXXX) তৈরি করবে এবং ৮টি রুল ফ্রেমওয়ার্ক অনুযায়ী তাৎক্ষণিক স্ক্রিনিং সম্পন্ন করবে।'
              : 'Upon submission, a unique tracking ID (BV-2026-XXXX) will be generated and evaluated against all 8 statutory fraud detection rules.'}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {lang === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
            </button>
            <button
              onClick={handleSubmitCase}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#0B6E4F] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {loading 
                ? (lang === 'bn' ? 'প্রক্রিয়াকরণ হচ্ছে...' : 'Processing...') 
                : (lang === 'bn' ? 'কেস সাবমিট ও স্ক্রিনিং শুরু করুন' : 'Submit & Run Fraud Screening')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
