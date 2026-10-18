import { CaseDetail, UserProfile, AuditEvent, NetworkGraphData } from './types';

export const DEMO_PROFILES: Record<string, UserProfile> = {
  citizen: {
    id: 'user-citizen-demo-01',
    email: 'citizen@bhumiverse.internal',
    full_name: 'Parvez Ahmed (Landowner / Citizen)',
    role: 'citizen',
    nid_mask: 'NID-8841-XXXX',
    phone_mask: '+880 1711-XXXXXX',
    is_verified: true,
  },
  admin: {
    id: 'admin-demo-id',
    email: 'admin@bhumiverse.internal',
    full_name: 'Senior Land Review Officer (Admin)',
    role: 'admin',
    nid_mask: 'NID-1980-XXXX',
    phone_mask: '+880 1819-XXXXXX',
    is_verified: true,
  }
};

export const INITIAL_CASES: CaseDetail[] = [
  // 1: Clean Legitimate Case
  {
    id: 'case-demo-001',
    tracking_id: 'BV-2026-0001',
    user_id: 'user-citizen-demo-01',
    title: 'Verification of Dag 1025, Baunia Mouza (Savar)',
    description: 'Clean deed and corresponding e-Namjari verification. (DEMO DATA — NOT AN OFFICIAL LAND RECORD)',
    district: 'Dhaka',
    upazila: 'Savar',
    mouza: 'Baunia',
    plot_khatian_summary: 'Dag 1025, RS Khatian 520, Mutation 8842',
    status: 'approved',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T12:00:00Z',
    documents: [
      {
        id: 'doc-001-deed',
        case_id: 'case-demo-001',
        file_name: 'SAF_KABALA_DEED_10482_2021.pdf',
        file_type: 'pdf',
        file_size_bytes: 1048576,
        file_hash_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        storage_path: '/storage/demo/deed_10482.pdf',
        doc_category: 'deed',
        ocr_status: 'completed',
        confidence_score: 0.96,
        uploaded_at: '2026-01-15T10:00:00Z',
        extracted_fields: [
          { field_name: 'deed_no', original_value: '১০৪৮২/২০২১', normalized_value: '10482/2021', confidence: 0.98 },
          { field_name: 'district', original_value: 'ঢাকা', normalized_value: 'Dhaka', confidence: 0.98 },
          { field_name: 'upazila', original_value: 'সাভার', normalized_value: 'Savar', confidence: 0.98 },
          { field_name: 'mouza', original_value: 'বাউনিয়া', normalized_value: 'Baunia', confidence: 0.98 },
          { field_name: 'dag_no', original_value: '১০২৫', normalized_value: '1025', confidence: 0.98 },
          { field_name: 'khatian_no', original_value: '৫২০', normalized_value: '520', confidence: 0.97 },
          { field_name: 'land_area', original_value: '১২ শতক', normalized_value: '12.0 decimal (5227.2 sq.ft)', confidence: 0.97 },
          { field_name: 'buyer_name', original_value: 'জনাব পারভেজ আলম', normalized_value: 'Parvez Alim (BUYER-ALIM-101)', confidence: 0.96 },
          { field_name: 'seller_name', original_value: 'মো: রফিক উদ্দিন', normalized_value: 'Md Rofiq Uddin (SELLER-ROFIQ-101)', confidence: 0.96 },
          { field_name: 'transaction_date', original_value: '১২-০৪-২০২১', normalized_value: '2021-04-12', confidence: 0.96 },
        ]
      },
      {
        id: 'doc-001-mut',
        case_id: 'case-demo-001',
        file_name: 'MUTATION_KHATIAN_8842.pdf',
        file_type: 'pdf',
        file_size_bytes: 524288,
        file_hash_sha256: 'cca99c1543666b694fc8ba92d47781b08493f0b2f6ab3ef821422731c3b12984',
        storage_path: '/storage/demo/mutation_8842.pdf',
        doc_category: 'mutation_record',
        ocr_status: 'completed',
        confidence_score: 0.95,
        uploaded_at: '2026-01-15T10:00:00Z',
        extracted_fields: [
          { field_name: 'khatian_no', original_value: '৮৮৪২', normalized_value: '8842', confidence: 0.96 },
          { field_name: 'dag_no', original_value: '১০২৫', normalized_value: '1025', confidence: 0.96 },
          { field_name: 'district', original_value: 'ঢাকা', normalized_value: 'Dhaka', confidence: 0.98 },
          { field_name: 'upazila', original_value: 'সাভার', normalized_value: 'Savar', confidence: 0.98 },
          { field_name: 'mouza', original_value: 'বাউনিয়া', normalized_value: 'Baunia', confidence: 0.98 },
          { field_name: 'land_area', original_value: '১২ শতক', normalized_value: '12.0 decimal (5227.2 sq.ft)', confidence: 0.96 },
          { field_name: 'buyer_name', original_value: 'জনাব পারভেজ আলম', normalized_value: 'Parvez Alim (BUYER-ALIM-101)', confidence: 0.95 }
        ]
      }
    ],
    land_records: [
      {
        id: 'lr-001',
        case_id: 'case-demo-001',
        district: 'Dhaka',
        upazila: 'Savar',
        mouza: 'Baunia',
        khatian_no: '520',
        dag_no: '1025',
        recorded_land_area_decimal: 12.0,
        recorded_land_area_sqft: 5227.2,
        deed_no: '10482/2021'
      }
    ],
    transactions: [
      {
        id: 'txn-001',
        case_id: 'case-demo-001',
        plot_identifier: 'DHAKA|SAVAR|BAUNIA|KH-520|DAG-1025',
        transaction_date: '2021-04-12',
        registration_date: '2021-04-15',
        mutation_date: '2021-08-20',
        deed_no: '10482/2021',
        buyer_name: 'Parvez Alim (BUYER-ALIM-101)',
        seller_name: 'Md Rofiq Uddin (SELLER-ROFIQ-101)',
        consideration_bdt: 3600000.0
      }
    ],
    findings: [],
    reviews: [
      {
        id: 'rev-001',
        case_id: 'case-demo-001',
        reviewer_name: 'Admin Reviewer (Land Officer 01)',
        action: 'approve_workflow',
        decision_reason: 'All records match precisely. Deed and mutation are in perfect harmony. No cross-case conflict found.',
        created_at: '2026-01-15T12:00:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-001-1',
        event_date: '2021-04-12',
        event_type: 'deed_executed',
        title: 'Saf Kabala Deed 10482 Executed',
        description: 'Deed executed by seller Md Rofiq Uddin to buyer Parvez Alim for 12 decimals.',
        record_type: 'Transaction'
      },
      {
        id: 'tl-001-2',
        event_date: '2021-04-15',
        event_type: 'registration',
        title: 'Sub-Registry Registration Endorsed',
        description: 'Deed 10482/2021 registered under Savar Sub-Registry volume book.',
        record_type: 'Transaction'
      },
      {
        id: 'tl-001-3',
        event_date: '2021-08-20',
        event_type: 'mutation_approved',
        title: 'AC Land Mutation Case 8842 Sanctioned',
        description: 'Mutation khatian 8842 issued without objection; dakhila updated.',
        record_type: 'Document'
      }
    ],
    radar: {
      case_id: 'case-demo-001',
      tracking_id: 'BV-2026-0001',
      overall_risk_level: 'low',
      risk_score_numeric: 5,
      findings_count: 0,
      critical_conflicts_count: 0,
      findings: [],
      recommended_checks: [
        'All primary rule checks passed without conflict. Verify physical revenue stamps before final approval.'
      ],
      disclaimer: 'This assessment is an automated risk screening aid for prioritization only. It does not constitute an official ownership certificate, legal determination, or proof of fraud.'
    }
  },

  // 2: Double-Selling High Risk Case
  {
    id: 'case-demo-002',
    tracking_id: 'BV-2026-0002',
    user_id: 'user-citizen-demo-02',
    title: 'Double-Selling Alert: Dag 405, Joar Sahara (Gulshan)',
    description: 'High-risk conflict: Same seller executed two distinct sale deeds for Dag 405 to two unrelated buyers. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Gulshan',
    mouza: 'Joar Sahara',
    plot_khatian_summary: 'Dag 405, RS Khatian 202 (8.0 decimals)',
    status: 'under_review',
    risk_level: 'high',
    is_demo: true,
    submitted_at: '2026-01-16T11:00:00Z',
    updated_at: '2026-01-16T14:00:00Z',
    documents: [
      {
        id: 'doc-002-deed-a',
        case_id: 'case-demo-002',
        file_name: 'DEED_5510_2020_KABIR.pdf',
        file_type: 'pdf',
        file_size_bytes: 1048576,
        file_hash_sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef',
        storage_path: '/storage/demo/deed_5510.pdf',
        doc_category: 'deed',
        ocr_status: 'completed',
        confidence_score: 0.94,
        uploaded_at: '2026-01-16T11:00:00Z',
        extracted_fields: [
          { field_name: 'deed_no', original_value: '৫৫১০/২০২০', normalized_value: '5510/2020', confidence: 0.96 },
          { field_name: 'district', original_value: 'ঢাকা', normalized_value: 'Dhaka', confidence: 0.98 },
          { field_name: 'upazila', original_value: 'গুলশান', normalized_value: 'Gulshan', confidence: 0.98 },
          { field_name: 'mouza', original_value: 'জোয়ার সাহারা', normalized_value: 'Joar Sahara', confidence: 0.97 },
          { field_name: 'dag_no', original_value: '৪০৫', normalized_value: '405', confidence: 0.98 },
          { field_name: 'khatian_no', original_value: '২০২', normalized_value: '202', confidence: 0.97 },
          { field_name: 'land_area', original_value: '৮ শতক', normalized_value: '8.0 decimal (3484.8 sq.ft)', confidence: 0.95 },
          { field_name: 'buyer_name', original_value: 'জনাব কবির আহমেদ', normalized_value: 'Kabir Ahmed (BUYER-KABIR)', confidence: 0.96 },
          { field_name: 'seller_name', original_value: 'মোস্তাফিজুর রহমান', normalized_value: 'Mostafizur Rahman (SELLER-MOSTAFIZ)', confidence: 0.95 },
          { field_name: 'transaction_date', original_value: '১৫-০২-২০২০', normalized_value: '2020-02-15', confidence: 0.95 },
        ]
      },
      {
        id: 'doc-002-deed-b',
        case_id: 'case-demo-002',
        file_name: 'DEED_9104_2023_TARIQ.pdf',
        file_type: 'pdf',
        file_size_bytes: 1048576,
        file_hash_sha256: 'f9e8d7c6b5a4039281726354453627181920abcdef1234567890abcdef123456',
        storage_path: '/storage/demo/deed_9104.pdf',
        doc_category: 'deed',
        ocr_status: 'completed',
        confidence_score: 0.93,
        uploaded_at: '2026-01-16T11:00:00Z',
        extracted_fields: [
          { field_name: 'deed_no', original_value: '৯১০৪/২০২৩', normalized_value: '9104/2023', confidence: 0.96 },
          { field_name: 'district', original_value: 'ঢাকা', normalized_value: 'Dhaka', confidence: 0.98 },
          { field_name: 'upazila', original_value: 'গুলশান', normalized_value: 'Gulshan', confidence: 0.98 },
          { field_name: 'mouza', original_value: 'জোয়ার সাহারা', normalized_value: 'Joar Sahara', confidence: 0.97 },
          { field_name: 'dag_no', original_value: '৪০৫', normalized_value: '405', confidence: 0.98 },
          { field_name: 'khatian_no', original_value: '২০২', normalized_value: '202', confidence: 0.97 },
          { field_name: 'land_area', original_value: '৮ শতক', normalized_value: '8.0 decimal (3484.8 sq.ft)', confidence: 0.95 },
          { field_name: 'buyer_name', original_value: 'তারিকুল ইসলাম', normalized_value: 'Tariqul Islam (BUYER-TARIQ)', confidence: 0.95 },
          { field_name: 'seller_name', original_value: 'মোস্তাফিজুর রহমান', normalized_value: 'Mostafizur Rahman (SELLER-MOSTAFIZ)', confidence: 0.95 },
          { field_name: 'transaction_date', original_value: '১০-০৫-২০২৩', normalized_value: '2023-05-10', confidence: 0.95 },
        ]
      }
    ],
    land_records: [
      {
        id: 'lr-002',
        case_id: 'case-demo-002',
        district: 'Dhaka',
        upazila: 'Gulshan',
        mouza: 'Joar Sahara',
        khatian_no: '202',
        dag_no: '405',
        recorded_land_area_decimal: 8.0,
        recorded_land_area_sqft: 3484.8,
        deed_no: '5510/2020'
      }
    ],
    transactions: [
      {
        id: 'txn-002-a',
        case_id: 'case-demo-002',
        plot_identifier: 'DHAKA|GULSHAN|JOAR SAHARA|KH-202|DAG-405',
        transaction_date: '2020-02-15',
        registration_date: '2020-02-18',
        deed_no: '5510/2020',
        buyer_name: 'Kabir Ahmed (BUYER-KABIR)',
        seller_name: 'Mostafizur Rahman (SELLER-MOSTAFIZ)',
        consideration_bdt: 4800000.0
      },
      {
        id: 'txn-002-b',
        case_id: 'case-demo-002',
        plot_identifier: 'DHAKA|GULSHAN|JOAR SAHARA|KH-202|DAG-405',
        transaction_date: '2023-05-10',
        registration_date: '2023-05-12',
        deed_no: '9104/2023',
        buyer_name: 'Tariqul Islam (BUYER-TARIQ)',
        seller_name: 'Mostafizur Rahman (SELLER-MOSTAFIZ)',
        consideration_bdt: 6200000.0
      }
    ],
    findings: [
      {
        id: 'find-002-1',
        case_id: 'case-demo-002',
        rule_id: 'RULE_B_DOUBLE_SELLING',
        finding_type: 'Potential Double-Selling Conflict',
        severity: 'high',
        title: 'Multiple Conflicting Sale Transactions on Dag 405',
        explanation: 'Plot Dag 405 (Mouza Joar Sahara, Khatian 202) appears in separate sale deeds to two distinct buyers: Kabir Ahmed (2020-02-15) and Tariqul Islam (2023-05-10). Both deeds list the same seller (Mostafizur Rahman), indicating an unverified second conveyance of the identical plot.',
        conflicting_values: {
          plot_dag: '405',
          buyer_1: 'Kabir Ahmed',
          transaction_1_date: '2020-02-15',
          deed_1: '5510/2020',
          buyer_2: 'Tariqul Islam',
          transaction_2_date: '2023-05-10',
          deed_2: '9104/2023',
        },
        recommended_action: 'Request Sub-Registrar volume book verification (বালাম বহি) and mutation record to confirm whether Deed 1 was revoked or if Plot was subdivided.',
        detected_at: '2026-01-16T11:05:00Z',
        evidence: [
          { snippet: 'Deed 5510/2020: Sold to Kabir Ahmed on 2020-02-15' },
          { snippet: 'Deed 9104/2023: Sold to Tariqul Islam on 2023-05-10' }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-002',
        case_id: 'case-demo-002',
        reviewer_name: 'Senior Land Inspector',
        action: 'escalate',
        decision_reason: 'Severe risk indicator: Deed 5510 (2020) and Deed 9104 (2023) both claim full 8 decimals on Dag 405. Escalate to District Sub-Registry for Balam verification.',
        created_at: '2026-01-16T14:00:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-002-1',
        event_date: '2020-02-15',
        event_type: 'deed_executed',
        title: 'Deed 5510/2020 Executed',
        description: 'Seller Mostafizur Rahman sold Dag 405 (8 decimals) to Kabir Ahmed.',
        record_type: 'Transaction'
      },
      {
        id: 'tl-002-2',
        event_date: '2023-05-10',
        event_type: 'deed_executed',
        title: 'Deed 9104/2023 Executed (CONFLICT)',
        description: 'Same Seller Mostafizur Rahman purported to sell the SAME Dag 405 to Tariqul Islam without revoking previous deed.',
        is_conflict: true,
        record_type: 'Transaction'
      },
      {
        id: 'tl-002-3',
        event_date: '2026-01-16',
        event_type: 'conflict_alert',
        title: 'Double-Selling Conflict Flagged',
        description: 'BHUMIVerse Rule B flagged high-severity double-conveyance risk.',
        is_conflict: true,
        record_type: 'Finding'
      }
    ],
    radar: {
      case_id: 'case-demo-002',
      tracking_id: 'BV-2026-0002',
      overall_risk_level: 'high',
      risk_score_numeric: 88,
      findings_count: 1,
      critical_conflicts_count: 1,
      findings: [],
      recommended_checks: [
        'Request Sub-Registrar volume book verification (বালাম বহি) and mutation record to confirm whether Deed 1 was revoked.'
      ],
      disclaimer: 'This assessment is an automated risk screening aid for prioritization only.'
    }
  },

  // 3: Reg-Mutation Mismatch
  {
    id: 'case-demo-003',
    tracking_id: 'BV-2026-0003',
    user_id: 'user-citizen-demo-03',
    title: 'Reg-Mutation Plot & Area Mismatch: Tejgaon',
    description: 'Registered Deed cites Dag 750 (15 decimals) but submitted Mutation record shows Dag 820 (8 decimals). (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Tejgaon',
    mouza: 'Tejgaon Industrial',
    plot_khatian_summary: 'Deed Dag 750 vs Mutation Dag 820',
    status: 'info_requested',
    risk_level: 'high',
    is_demo: true,
    submitted_at: '2026-01-17T09:30:00Z',
    updated_at: '2026-01-17T11:00:00Z',
    documents: [
      {
        id: 'doc-003-deed',
        case_id: 'case-demo-003',
        file_name: 'REGISTERED_DEED_4120_2022.pdf',
        file_type: 'pdf',
        file_size_bytes: 819200,
        file_hash_sha256: 'b8c7d6e5f4a30291827364554637281920abcdef1234567890abcdef12345678',
        storage_path: '/storage/demo/deed_4120.pdf',
        doc_category: 'deed',
        ocr_status: 'completed',
        confidence_score: 0.92,
        uploaded_at: '2026-01-17T09:30:00Z',
        extracted_fields: [
          { field_name: 'deed_no', original_value: '৪১২০/২০২২', normalized_value: '4120/2022', confidence: 0.95 },
          { field_name: 'dag_no', original_value: '৭৫০', normalized_value: '750', confidence: 0.95 },
          { field_name: 'mouza', original_value: 'তেজগাঁও শিল্প এলাকা', normalized_value: 'Tejgaon Industrial', confidence: 0.96 },
          { field_name: 'land_area', original_value: '১৫ শতক', normalized_value: '15.0 decimal', confidence: 0.93 },
          { field_name: 'buyer_name', original_value: 'ফারহানা হক', normalized_value: 'Farhana Haque', confidence: 0.94 }
        ]
      },
      {
        id: 'doc-003-mut',
        case_id: 'case-demo-003',
        file_name: 'MUTATION_PROPOSAL_DAKHILA.pdf',
        file_type: 'pdf',
        file_size_bytes: 614400,
        file_hash_sha256: 'c7d8e9f0a1b2039485761234567890abcdef1234567890abcdef1234567890ab',
        storage_path: '/storage/demo/mutation_mismatch.pdf',
        doc_category: 'mutation_record',
        ocr_status: 'completed',
        confidence_score: 0.91,
        uploaded_at: '2026-01-17T09:30:00Z',
        extracted_fields: [
          { field_name: 'dag_no', original_value: '৮২০', normalized_value: '820', confidence: 0.94 },
          { field_name: 'mouza', original_value: 'তেজগাঁও', normalized_value: 'Tejgaon Industrial', confidence: 0.96 },
          { field_name: 'land_area', original_value: '৮ শতক', normalized_value: '8.0 decimal', confidence: 0.92 }
        ]
      }
    ],
    land_records: [
      {
        id: 'lr-003',
        case_id: 'case-demo-003',
        district: 'Dhaka',
        upazila: 'Tejgaon',
        mouza: 'Tejgaon Industrial',
        khatian_no: '110',
        dag_no: '750',
        recorded_land_area_decimal: 15.0,
        deed_no: '4120/2022'
      }
    ],
    transactions: [],
    findings: [
      {
        id: 'find-003-1',
        case_id: 'case-demo-003',
        rule_id: 'RULE_C_REG_MUTATION_MISMATCH',
        finding_type: 'Plot Identifier Discrepancy',
        severity: 'high',
        title: 'Mismatched Dag Number Between Deed and Mutation',
        explanation: "Registered Deed specifies Dag '750', whereas submitted Mutation record lists Dag '820'. Mutation must directly cite the parent deed plot.",
        conflicting_values: {
          deed_dag: '750',
          mutation_dag: '820',
          deed_file: 'REGISTERED_DEED_4120_2022.pdf',
          mutation_file: 'MUTATION_PROPOSAL_DAKHILA.pdf'
        },
        recommended_action: 'Verify AC Land mutation proposal sheet (নামজারি প্রস্তাবপত্র) to verify if dag renumbering occurred.',
        detected_at: '2026-01-17T09:35:00Z'
      }
    ],
    reviews: [
      {
        id: 'rev-003',
        case_id: 'case-demo-003',
        reviewer_name: 'Compliance Officer',
        action: 'request_more_info',
        decision_reason: 'Discrepancy detected: Dag 750 on deed vs Dag 820 on mutation. Please upload AC Land namjari approval order sheet explaining plot renumbering.',
        created_at: '2026-01-17T11:00:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-003-1',
        event_date: '2022-06-18',
        event_type: 'deed_executed',
        title: 'Deed 4120 Executed on Dag 750',
        description: 'Deed executed specifying Dag 750 for 15 decimals.',
        record_type: 'Document'
      },
      {
        id: 'tl-003-2',
        event_date: '2026-01-17',
        event_type: 'conflict_alert',
        title: 'Plot Identifier Discrepancy Flagged',
        description: 'Deed mentions Dag 750 while mutation cites Dag 820.',
        is_conflict: true,
        record_type: 'Finding'
      }
    ]
  },

  // 4: Duplicate Hash Collision
  {
    id: 'case-demo-004',
    tracking_id: 'BV-2026-0004',
    user_id: 'user-citizen-demo-04',
    title: 'Cross-Case Duplicate File Submission Alert',
    description: 'Document submitted in this case has identical SHA-256 hash to previously processed Case BV-2026-0001. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Savar',
    mouza: 'Baunia',
    plot_khatian_summary: 'Dag 1025, Hash Collision',
    status: 'under_review',
    risk_level: 'medium',
    is_demo: true,
    submitted_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-01-18T10:05:00Z',
    documents: [
      {
        id: 'doc-004-a',
        case_id: 'case-demo-004',
        file_name: 'ORIGINAL_DEED_SCAN_SAVAR.pdf',
        file_type: 'pdf',
        file_size_bytes: 1048576,
        file_hash_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        storage_path: '/storage/demo/deed_10482_copy.pdf',
        doc_category: 'deed',
        ocr_status: 'completed',
        confidence_score: 0.96,
        uploaded_at: '2026-01-18T10:00:00Z',
        extracted_fields: [
          { field_name: 'deed_no', original_value: '১০৪৮২/২০২১', normalized_value: '10482/2021', confidence: 0.98 },
          { field_name: 'dag_no', original_value: '১০২৫', normalized_value: '1025', confidence: 0.98 }
        ]
      }
    ],
    land_records: [],
    transactions: [],
    findings: [
      {
        id: 'find-004-1',
        case_id: 'case-demo-004',
        rule_id: 'RULE_A_DUPLICATE_FILE',
        finding_type: 'Cross-Case Duplicate File Detected',
        severity: 'medium',
        title: 'Document Exact Match Found in Another Case',
        explanation: "Uploaded file shares exact cryptographic hash with file previously submitted under Case BV-2026-0001. Requires verification to confirm whether this is a legitimate re-submission or duplicate claim.",
        conflicting_values: {
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          matching_case: 'BV-2026-0001'
        },
        recommended_action: 'Inspect linked prior case record to ensure title has not already been processed or contested.',
        detected_at: '2026-01-18T10:05:00Z'
      }
    ],
    reviews: [],
    timeline: []
  },

  // 5 to 20: Additional 16 rich cases
  {
    id: 'case-demo-005',
    tracking_id: 'BV-2026-0005',
    user_id: 'user-citizen-demo-05',
    title: 'Land Area Discrepancy: Dag 88, Badda',
    description: 'Deed specifies 20.0 decimals while mutation dakhila specifies 12.5 decimals (variance > 37%). (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Badda',
    mouza: 'Satarkul',
    plot_khatian_summary: 'Dag 88, Khatian 304 (20 vs 12.5 dec)',
    status: 'under_review',
    risk_level: 'high',
    is_demo: true,
    submitted_at: '2026-01-19T08:00:00Z',
    updated_at: '2026-01-19T08:10:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [
      {
        id: 'find-005-1',
        case_id: 'case-demo-005',
        rule_id: 'RULE_D_AREA_DISCREPANCY',
        finding_type: 'Land Area Inconsistency',
        severity: 'high',
        title: 'Significant Area Variance (7.50 decimals / 37.5%)',
        explanation: "Land area in Registered Deed (20.0 decimals) differs from Mutation Dakhila (12.5 decimals) by 7.50 decimals. Minor survey variance allowed, but 37.5% requires field surveyor measurement verification.",
        recommended_action: 'Inspect field sketch map (নকশা) and survey register for legal deduction records.',
        detected_at: '2026-01-19T08:05:00Z'
      }
    ],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-006',
    tracking_id: 'BV-2026-0006',
    user_id: 'user-citizen-demo-06',
    title: 'Incomplete Document Metadata: Savar Plot',
    description: 'Old handwritten porcha missing Dag number and Mouza identifier. Classified as incomplete information, not fraud. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Savar',
    mouza: 'Unspecified',
    plot_khatian_summary: 'Khatian 12 (Dag missing)',
    status: 'info_requested',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:15:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [
      {
        id: 'find-006-1',
        case_id: 'case-demo-006',
        rule_id: 'RULE_E_MISSING_CRITICAL_FIELDS',
        finding_type: 'Incomplete Document Metadata',
        severity: 'low',
        title: "Critical Field(s) Unidentified in Uploaded Porcha",
        explanation: 'Document is missing essential land parcel identifiers: dag_no, mouza. Without these fields, automated matching cannot proceed. This is incomplete data, NOT fraud.',
        recommended_action: 'Use manual structured correction or re-scan schedule section of document.',
        detected_at: '2026-01-20T10:05:00Z'
      }
    ],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-007',
    tracking_id: 'BV-2026-0007',
    user_id: 'user-citizen-demo-07',
    title: 'Degraded Scan OCR Uncertainty: Mirpur',
    description: 'Faded ink and fold lines on deed produced OCR confidence scores below 0.60. Flagged for manual reading. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Mirpur',
    mouza: 'Senpara Parbata',
    plot_khatian_summary: 'Dag 314, Khatian 90',
    status: 'under_review',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-01-21T11:00:00Z',
    updated_at: '2026-01-21T11:20:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [
      {
        id: 'find-007-1',
        case_id: 'case-demo-007',
        rule_id: 'RULE_F_OCR_UNCERTAINTY',
        finding_type: 'OCR Confidence Below Threshold',
        severity: 'info',
        title: 'Low OCR Confidence on 3 Extracted Field(s)',
        explanation: 'Fields (khatian_no, land_area, dag_no) scored confidence below 70%. Degraded physical stamp paper caused ink blur. Human verification requested.',
        recommended_action: 'Confirm extracted numbers against visual document viewer before final submission.',
        detected_at: '2026-01-21T11:05:00Z'
      }
    ],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-008',
    tracking_id: 'BV-2026-0008',
    user_id: 'user-citizen-demo-08',
    title: 'Conflicting Party Names on Same Deed No 604',
    description: 'Two submitted photocopies claim to be Deed 604/2019 but have different buyer names inserted. (DEMO DATA)',
    district: 'Gazipur',
    upazila: 'Sreepur',
    mouza: 'Baraipara',
    plot_khatian_summary: 'Deed 604/2019, Dag 512',
    status: 'escalated',
    risk_level: 'high',
    is_demo: true,
    submitted_at: '2026-01-22T14:00:00Z',
    updated_at: '2026-01-22T15:00:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [
      {
        id: 'find-008-1',
        case_id: 'case-demo-008',
        rule_id: 'RULE_G_DOCUMENT_DIFFERENCES',
        finding_type: 'Altered Document Copy Discrepancy',
        severity: 'high',
        title: 'Conflicting Information in Matching Deed No 604/2019',
        explanation: "Two submitted copies purport to represent the same Deed No. 604/2019, yet specify conflicting buyer parties ('Md Alamgir' vs 'Jahidul Hasan'). Pattern suggests potentially doctored photocopy copy.",
        recommended_action: 'Submit deed copies to Forensic Document Examination and request certified copy from District Sub-Registry.',
        detected_at: '2026-01-22T14:10:00Z'
      }
    ],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-009',
    tracking_id: 'BV-2026-0009',
    user_id: 'user-citizen-demo-09',
    title: 'Timeline Anomaly: Registration Prior to Deed Execution',
    description: 'Sub-Registrar endorsement date is indexed earlier than purported execution date of deed. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Dhanmondi',
    mouza: 'Dhanmondi R/A',
    plot_khatian_summary: 'Dag 12, Khatian 5',
    status: 'under_review',
    risk_level: 'medium',
    is_demo: true,
    submitted_at: '2026-01-23T09:00:00Z',
    updated_at: '2026-01-23T09:30:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [
      {
        id: 'find-009-1',
        case_id: 'case-demo-009',
        rule_id: 'RULE_H_TIMELINE_INCONSISTENCY',
        finding_type: 'Timeline Inversion Anomaly',
        severity: 'medium',
        title: 'Registration Date Precedes Execution Date',
        explanation: 'Deed lists registration date prior to execution date. Formal registration cannot lawfully precede execution.',
        recommended_action: 'Verify Sub-Registrar endorsement seal and serial date in index book.',
        detected_at: '2026-01-23T09:05:00Z'
      }
    ],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-010',
    tracking_id: 'BV-2026-0010',
    user_id: 'user-citizen-demo-10',
    title: 'Clean Co-Ownership Transfer: Keraniganj',
    description: 'Father transferred undivided 5 decimals out of 20 decimals to daughter via legitimate Heba deed. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Keraniganj',
    mouza: 'Zinjira',
    plot_khatian_summary: 'Dag 210, Khatian 88 (5 dec Heba)',
    status: 'approved',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-01-24T12:00:00Z',
    updated_at: '2026-01-24T13:00:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-011',
    tracking_id: 'BV-2026-0011',
    user_id: 'user-citizen-demo-11',
    title: 'Distinct Identity Verification: Md Rafiq vs Rafiqul Islam Khan',
    description: 'Validates that similar name tokens are not erroneously merged into the same persona. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Uttara',
    mouza: 'Faydabad',
    plot_khatian_summary: 'Dag 94, Khatian 114',
    status: 'approved',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:30:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-012',
    tracking_id: 'BV-2026-0012',
    user_id: 'user-citizen-demo-12',
    title: 'Routine Porcha Verification: Savar Dag 55',
    description: 'RS Porcha record matches land revenue database. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Savar',
    mouza: 'Ashulia',
    plot_khatian_summary: 'Dag 55, Khatian 22',
    status: 'approved',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-01-26T09:00:00Z',
    updated_at: '2026-01-26T09:30:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-013',
    tracking_id: 'BV-2026-0013',
    user_id: 'user-citizen-demo-13',
    title: 'Missing Mutation Reference: Kaliakair',
    description: 'Deed registered in 2024 but mutation not yet completed. Status marked Insufficient Data. (DEMO DATA)',
    district: 'Gazipur',
    upazila: 'Kaliakair',
    mouza: 'Mouchak',
    plot_khatian_summary: 'Dag 190, Khatian 81',
    status: 'info_requested',
    risk_level: 'insufficient_data',
    is_demo: true,
    submitted_at: '2026-01-27T10:00:00Z',
    updated_at: '2026-01-27T10:15:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [
      {
        id: 'find-013-1',
        case_id: 'case-demo-013',
        rule_id: 'RULE_C_REG_MUTATION_MISMATCH',
        finding_type: 'Insufficient Records for Cross-Verification',
        severity: 'info',
        title: 'Mutation Record or Registered Deed Pending Submission',
        explanation: 'Mutation Dakhila has not yet been submitted. Status is marked Insufficient Data rather than declaring title violation.',
        recommended_action: 'Submit e-Namjari receipt when issued by AC Land.',
        detected_at: '2026-01-27T10:05:00Z'
      }
    ],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-014',
    tracking_id: 'BV-2026-0014',
    user_id: 'user-citizen-demo-14',
    title: 'Double-Conveyance Risk: Tongi Dag 60',
    description: 'Conflicting sale contracts recorded on same parcel in 2022 and 2025. (DEMO DATA)',
    district: 'Gazipur',
    upazila: 'Tongi',
    mouza: 'Tongi BSCIC',
    plot_khatian_summary: 'Dag 60, Khatian 45',
    status: 'under_review',
    risk_level: 'high',
    is_demo: true,
    submitted_at: '2026-01-28T11:00:00Z',
    updated_at: '2026-01-28T11:30:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [
      {
        id: 'find-014-1',
        case_id: 'case-demo-014',
        rule_id: 'RULE_B_DOUBLE_SELLING',
        finding_type: 'Potential Double-Selling Conflict',
        severity: 'high',
        title: 'Multiple Conflicting Conveyances on Dag 60',
        explanation: 'Parcel was conveyed to Salim Khan in 2022, yet another deed in 2025 by same transferor lists Nurul Haque.',
        recommended_action: 'Verify Sub-Registry volume book 1.',
        detected_at: '2026-01-28T11:05:00Z'
      }
    ],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-015',
    tracking_id: 'BV-2026-0015',
    user_id: 'user-citizen-demo-15',
    title: 'Standard Commercial Lease Verification',
    description: 'Clean 99-year government commercial lease deed. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Tejgaon',
    mouza: 'Tejgaon',
    plot_khatian_summary: 'Dag 100, Khatian 1',
    status: 'approved',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-01-29T10:00:00Z',
    updated_at: '2026-01-29T10:30:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-016',
    tracking_id: 'BV-2026-0016',
    user_id: 'user-citizen-demo-16',
    title: 'Land Area Unit Conversion Check (Katha to Decimal)',
    description: 'Tests multi-unit normalization: 6 Katha converted precisely to 9.9 Decimals. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Mirpur',
    mouza: 'Rupnagar',
    plot_khatian_summary: 'Dag 402, Khatian 16 (6 Katha)',
    status: 'approved',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-01-30T14:00:00Z',
    updated_at: '2026-01-30T14:30:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-017',
    tracking_id: 'BV-2026-0017',
    user_id: 'user-citizen-demo-17',
    title: 'Inheritance Successor Warishan Title Review',
    description: 'Clear succession chain with registered warishan distribution deed. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Dhamrai',
    mouza: 'Kushura',
    plot_khatian_summary: 'Dag 810, Khatian 330',
    status: 'approved',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-01-31T09:00:00Z',
    updated_at: '2026-01-31T09:30:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-018',
    tracking_id: 'BV-2026-0018',
    user_id: 'user-citizen-demo-18',
    title: 'Agricultural Land Development Tax Verification',
    description: 'Clean LD-Tax (খাজনা দাখিলা) clearance for fiscal year 2025-26. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Savar',
    mouza: 'Vakurta',
    plot_khatian_summary: 'Dag 119, Khatian 75',
    status: 'approved',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:30:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-019',
    tracking_id: 'BV-2026-019',
    user_id: 'user-citizen-demo-19',
    title: 'Subdivision Dag Suffix Verification (Dag 205/1)',
    description: 'Subdivision recorded under AC Land survey order sheet. (DEMO DATA)',
    district: 'Narayanganj',
    upazila: 'Rupganj',
    mouza: 'Murapara',
    plot_khatian_summary: 'Dag 205/1, Khatian 120',
    status: 'approved',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-02-02T11:00:00Z',
    updated_at: '2026-02-02T11:30:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [],
    reviews: [],
    timeline: []
  },
  {
    id: 'case-demo-020',
    tracking_id: 'BV-2026-0020',
    user_id: 'user-citizen-demo-20',
    title: 'Clean Khatian Porcha Title Screen: Gulshan',
    description: 'City Survey (BS) Khatian verified against land records repository. (DEMO DATA)',
    district: 'Dhaka',
    upazila: 'Gulshan',
    mouza: 'Baridhara',
    plot_khatian_summary: 'Dag 10, Khatian 4',
    status: 'approved',
    risk_level: 'low',
    is_demo: true,
    submitted_at: '2026-02-03T14:00:00Z',
    updated_at: '2026-02-03T14:30:00Z',
    documents: [],
    land_records: [],
    transactions: [],
    findings: [],
    reviews: [],
    timeline: []
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'audit-001',
    case_id: 'case-demo-002',
    actor_email: 'admin@bhumiverse.internal',
    event_type: 'ADMIN_CASE_REVIEW_ACTION',
    details: { action: 'escalate', reason: 'High risk double-selling conflict detected on Dag 405.' },
    ip_address: '127.0.0.1',
    created_at: '2026-01-16T14:00:00Z'
  },
  {
    id: 'audit-002',
    case_id: 'case-demo-002',
    actor_email: 'system@bhumiverse.internal',
    event_type: 'RULE_FINDING_DETECTED',
    details: { rule_id: 'RULE_B_DOUBLE_SELLING', severity: 'high', plot_dag: '405' },
    ip_address: '127.0.0.1',
    created_at: '2026-01-16T11:05:00Z'
  },
  {
    id: 'audit-003',
    case_id: 'case-demo-001',
    actor_email: 'admin@bhumiverse.internal',
    event_type: 'ADMIN_CASE_REVIEW_ACTION',
    details: { action: 'approve_workflow', reason: 'All deed and mutation records align without discrepancies.' },
    ip_address: '127.0.0.1',
    created_at: '2026-01-15T12:00:00Z'
  },
  {
    id: 'audit-004',
    case_id: 'case-demo-001',
    actor_email: 'citizen@bhumiverse.internal',
    event_type: 'DOCUMENT_UPLOADED',
    details: { document_name: 'SAF_KABALA_DEED_10482_2021.pdf', sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    ip_address: '127.0.0.1',
    created_at: '2026-01-15T10:00:00Z'
  }
];
