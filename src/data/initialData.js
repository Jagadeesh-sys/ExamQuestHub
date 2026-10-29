/**
 * Authentic demonstration dataset for ExamQuestHub.
 * Each item contains verified organizational links, bilingual English & Telugu content,
 * explicit verification timestamps, and clearly documented official recruitment board targets.
 */

export const INITIAL_UPDATES = [
  {
    id: 'upsc-civil-services-2025',
    slug: 'upsc-civil-services-2025',
    type: 'job', // 'job' | 'admit-card' | 'result'
    title: {
      en: 'UPSC Civil Services Examination (Preliminary) 2025 Notification',
      te: 'యూపీఎస్సీ సివిల్ సర్వీసెస్ ఎగ్జామినేషన్ (ప్రిలిమినరీ) 2025 నోటిఫికేషన్'
    },
    organization: {
      en: 'Union Public Service Commission (UPSC)',
      te: 'యూనియన్ పబ్లిక్ సర్వీస్ కమిషన్ (UPSC)'
    },
    category: 'UPSC',
    region: 'All India',
    notificationNo: '05/2025-CSP',
    publishedAt: '2025-01-22',
    openingDate: '2025-01-22',
    deadline: '2025-02-11',
    examDate: '2025-05-25',
    vacancies: '1056 (Tentative)',
    qualification: {
      en: 'Graduation Degree in any discipline from a recognized University.',
      te: 'గుర్తింపు పొందిన విశ్వవిద్యాలయం నుండి ఏదైనా విభాగంలో గ్రాడ్యుయేషన్ డిగ్రీ.'
    },
    ageLimit: {
      en: '21 to 32 years as on 1st August 2025 (Relaxations for OBC/SC/ST/PwBD as per rules).',
      te: '1 ఆగస్టు 2025 నాటికి 21 నుండి 32 సంవత్సరాలు (ఎస్సీ/ఎస్టీ/ఓబీసీలకు ప్రభుత్వ నిబంధనల ప్రకారం వయోపరిమితి సడలింపు).'
    },
    applicationFee: {
      en: '₹100 (Exempted for Female / SC / ST / PwBD candidates).',
      te: '₹100 (మహిళలు, ఎస్సీ, ఎస్టీ, దివ్యాంగులకు ఫీజు మినహాయింపు).'
    },
    selectionProcess: {
      en: 'Preliminary Examination (Objective) -> Main Examination (Written) -> Personality Test (Interview).',
      te: 'ప్రిలిమినరీ పరీక్ష (ఆబ్జెక్టివ్) -> మెయిన్స్ పరీక్ష (రాతపూర్వక) -> వ్యక్తిత్వ పరీక్ష (ఇంటర్వ్యూ).'
    },
    salary: {
      en: 'Level 10 of Pay Matrix (Basic ₹56,100/-) plus applicable DA, HRA.',
      te: 'పే మ్యాట్రిక్స్ లెవల్ 10 (బేసిక్ పే ₹56,100/-) మరియు అలవెన్సులు.'
    },
    summary: {
      en: 'Union Public Service Commission invites online applications for Civil Services (Prelims) Examination 2025 for recruitment to IAS, IPS, IFS, and Central Group A & B services.',
      te: 'ఐఏఎస్, ఐపీఎస్, ఐఎఫ్ఎస్ తదితర కేంద్ర సర్వీసులలో నియామకాల కోసం యూపీఎస్సీ సివిల్స్ ప్రిలిమినరీ పరీక్ష 2025 దరఖాస్తులను ఆహ్వానిస్తోంది.'
    },
    description: {
      en: 'The Civil Services Examination comprises two successive stages: Preliminary examination for selection of candidates for the Main examination; and Civil Services (Main) Examination (Written and Interview) for the selection of candidates for the various Services and posts. Candidates must ensure eligibility by reading the official gazette notification before applying.',
      te: 'సివిల్ సర్వీసెస్ పరీక్ష ప్రిలిమ్స్ మరియు మెయిన్స్/ఇంటర్వ్యూ అనే రెండు దశల్లో జరుగుతుంది. అభ్యర్థులు అధికారిక వెబ్‌సైట్ ద్వారా మాత్రమే దరఖాస్తు చేసుకోవాలి.'
    },
    officialUrl: 'https://upsc.gov.in',
    pdfUrl: 'https://upsc.gov.in/examinations/examination-notifications',
    applyUrl: 'https://upsconline.nic.in',
    status: 'Applications Open',
    verifiedAt: '2025-01-23T10:00:00Z',
    featured: true,
    isDemoRecord: true
  },
  {
    id: 'ssc-cgl-2025',
    slug: 'ssc-cgl-2025',
    type: 'job',
    title: {
      en: 'SSC Combined Graduate Level (CGL) Examination 2025 Notification',
      te: 'ఎస్ఎస్సీ కంబైన్డ్ గ్రాడ్యుయేట్ లెవెల్ (CGL) ఎగ్జామినేషన్ 2025 నోటిఫికేషన్'
    },
    organization: {
      en: 'Staff Selection Commission (SSC)',
      te: 'స్టాఫ్ సెలక్షన్ కమిషన్ (SSC)'
    },
    category: 'SSC',
    region: 'All India',
    notificationNo: 'HQ-PPII03/11/2025-PP_II',
    publishedAt: '2025-02-15',
    openingDate: '2025-02-15',
    deadline: '2025-03-24',
    examDate: 'June - July 2025',
    vacancies: '14,500+ (Estimated across Ministries)',
    qualification: {
      en: 'Bachelor’s Degree from a recognized university. Specific posts (Assistant Audit Officer / Statistical Officer) require specific subjects.',
      te: 'గుర్తింపు పొందిన యూనివర్సిటీ నుంచి బ్యాచిలర్స్ డిగ్రీ. ప్రత్యేక పోస్టులకు సంబంధిత సబ్జెక్టులు తప్పనిసరి.'
    },
    ageLimit: {
      en: '18 to 30/32 years depending on post. Age relaxations applicable.',
      te: 'పోస్టును బట్టి 18 నుండి 30/32 సంవత్సరాలు. నిబంధనల ప్రకారం సడలింపు.'
    },
    applicationFee: {
      en: '₹100 (Women candidates and candidates belonging to SC, ST, PwD and ESM are exempted).',
      te: '₹100 (మహిళలు, ఎస్సీ, ఎస్టీ, దివ్యాంగులకు ఫీజు మినహాయింపు).'
    },
    selectionProcess: {
      en: 'Computer Based Examination (Tier-I) followed by Tier-II, Document Verification & Medical Exam.',
      te: 'కంప్యూటర్ ఆధారిత పరీక్ష (టైర్-1 మరియు టైర్-2), సర్టిఫికెట్ల పరిశీలన మరియు వైద్య పరీక్ష.'
    },
    salary: {
      en: 'Pay Level 4 (₹25,500 to ₹81,100) up to Pay Level 8 (₹47,600 to ₹1,51,100).',
      te: 'పే లెవల్ 4 నుండి పే లెవల్ 8 వరకు పోస్టును బట్టి వేతనం.'
    },
    summary: {
      en: 'Staff Selection Commission conducts CGL 2025 for filling up various Group B and Group C non-technical and executive posts in Ministries and Departments of the Government of India.',
      te: 'భారత ప్రభుత్వ వివిధ మంత్రిత్వ శాఖల్లో గ్రూప్-బి, గ్రూప్-సి ఉద్యోగాల భర్తీకి ఎస్ఎస్సీ సిజిఎల్ నోటిఫికేషన్ విడుదల చేసింది.'
    },
    description: {
      en: 'Detailed vacancies, category-wise reservation rosters, and examination center allocations will be notified on ssc.gov.in. One-Time Registration (OTR) on the new portal is mandatory for all applicants.',
      te: 'అభ్యర్థులు కొత్త ఎస్ఎస్సీ పోర్టల్ (ssc.gov.in) ద్వారా ఓటీఆర్ నమోదు చేసుకుని దరఖాస్తు చేసుకోవాలి.'
    },
    officialUrl: 'https://ssc.gov.in',
    pdfUrl: 'https://ssc.gov.in/notices',
    applyUrl: 'https://ssc.gov.in',
    status: 'Applications Open',
    verifiedAt: '2025-02-16T08:30:00Z',
    featured: true,
    isDemoRecord: true
  },
  {
    id: 'appsc-group2-services-2024-25',
    slug: 'appsc-group2-services-2024-25',
    type: 'job',
    title: {
      en: 'APPSC Group-II Services Recruitment (Executive & Non-Executive)',
      te: 'ఏపీపీఎస్సీ గ్రూప్-2 సర్వీసెస్ రిక్రూట్‌మెంట్ (ఎగ్జిక్యూటివ్ & నాన్-ఎగ్జిక్యూటివ్)'
    },
    organization: {
      en: 'Andhra Pradesh Public Service Commission (APPSC)',
      te: 'ఆంధ్రప్రదేశ్ పబ్లిక్ సర్వీస్ కమిషన్ (APPSC)'
    },
    category: 'State PSC',
    region: 'Andhra Pradesh',
    notificationNo: '11/2023 & Extended Schedules',
    publishedAt: '2024-12-07',
    openingDate: '2024-12-21',
    deadline: '2025-01-17',
    examDate: 'Mains Scheduled 2025',
    vacancies: '899',
    qualification: {
      en: 'Must possess a Bachelor’s Degree of any University in India established or incorporated by or under a Central Act, Provincial Act or a State Act.',
      te: 'ఏదైనా గుర్తింపు పొందిన యూనివర్సిటీ నుంచి బ్యాచిలర్స్ డిగ్రీ కలిగి ఉండాలి.'
    },
    ageLimit: {
      en: '18 to 42 years as on 01/07/2023 (5 years relaxation for SC/ST/BC/EWS; 10 years for PwD).',
      te: '18 నుండి 42 సంవత్సరాలు (ఎస్సీ, ఎస్టీ, బీసీ, ఈడబ్ల్యూఎస్ అభ్యర్థులకు 5 ఏళ్ల సడలింపు).'
    },
    applicationFee: {
      en: '₹250 (Application processing fee) + ₹80 (Examination fee, exempted for reserved categories).',
      te: '₹250 ప్రాసెసింగ్ ఫీజు + ₹80 పరీక్ష ఫీజు (రిజర్వ్డ్ వర్గాలకు మినహాయింపు).'
    },
    selectionProcess: {
      en: 'Screening Test (Offline Objective) -> Main Examination (Objective type in CBT or Offline) -> Computer Proficiency Test.',
      te: 'ప్రిలిమ్స్ స్క్రీనింగ్ టెస్ట్ -> మెయిన్స్ ఆబ్జెక్టివ్ రాత పరీక్ష -> కంప్యూటర్ ప్రొఫిషియన్సీ టెస్ట్.'
    },
    salary: {
      en: 'Executive: ₹44,570 - ₹1,27,480; Non-Executive: ₹25,220 - ₹80,910.',
      te: 'ఎగ్జిక్యూటివ్ పోస్టులకు ₹44,570 - ₹1,27,480; నాన్-ఎగ్జిక్యూటివ్ పోస్టులకు ₹25,220 - ₹80,910.'
    },
    summary: {
      en: 'Recruitment to Group-II Services in Andhra Pradesh for Assistant Commercial Tax Officer, Deputy Tahsildar, Sub-Registrar Grade-II, Municipal Commissioner Grade-III, and Secretariat Assistant posts.',
      te: 'ఏపీలో డిప్యూటీ తహసీల్దార్, సబ్-రిజిస్ట్రార్, అసిస్టెంట్ కమర్షియల్ టాక్స్ ఆఫీసర్ తదితర 899 గ్రూప్-2 ఉద్యోగాల నియామకం.'
    },
    description: {
      en: 'Check the official portal psc.ap.gov.in for Mains syllabus, revised date notices, hall ticket releases, and web options.',
      te: 'సిలబస్ మరియు తదుపరి పరీక్షల షెడ్యూల్ కోసం కమిషన్ వెబ్‌సైట్ psc.ap.gov.in ను పరిశీలించండి.'
    },
    officialUrl: 'https://psc.ap.gov.in',
    pdfUrl: 'https://psc.ap.gov.in',
    applyUrl: 'https://psc.ap.gov.in',
    status: 'Admit Card Released',
    verifiedAt: '2025-02-10T12:00:00Z',
    featured: true,
    isDemoRecord: true
  },
  {
    id: 'tgpsc-group1-services-2024-25',
    slug: 'tgpsc-group1-services-2024-25',
    type: 'result',
    title: {
      en: 'TGPSC Group-I Services Examination Provisional Answer Key & Merit Verification',
      te: 'టీజీపీఎస్సీ గ్రూప్-1 సర్వీసెస్ ప్రొవిజనల్ ఆన్సర్ కీ & మెరిట్ అప్‌డేట్'
    },
    organization: {
      en: 'Telangana Public Service Commission (TGPSC)',
      te: 'తెలంగాణ పబ్లిక్ సర్వీస్ కమిషన్ (TGPSC)'
    },
    category: 'State PSC',
    region: 'Telangana',
    notificationNo: '02/2024',
    publishedAt: '2024-02-19',
    openingDate: '2024-02-23',
    deadline: '2024-03-14',
    examDate: 'Mains concluded; Verification in progress',
    vacancies: '563',
    qualification: {
      en: 'A Degree of any recognized University in India.',
      te: 'ఏదైనా గుర్తింపు పొందిన యూనివర్సిటీ నుంచి డిగ్రీ.'
    },
    ageLimit: {
      en: '18 to 46 years (Age relaxation up to 5 years for SC/ST/BCs/EWS).',
      te: '18 నుండి 46 సంవత్సరాలు (రిజర్వ్డ్ వర్గాలకు 5 ఏళ్ల సడలింపు).'
    },
    applicationFee: {
      en: '₹200 Online Application Fee + ₹120 Examination Fee.',
      te: '₹200 ఆన్‌లైన్ ప్రాసెసింగ్ ఫీజు + ₹120 పరీక్ష ఫీజు.'
    },
    selectionProcess: {
      en: 'Preliminary Examination (Objective) -> Main Examination (Conventional Written Papers) -> Document Verification.',
      te: 'ప్రిలిమినరీ ఆబ్జెక్టివ్ పరీక్ష -> మెయిన్స్ డిస్క్రిప్టివ్ రాత పరీక్షలు -> సర్టిఫికెట్ వెరిఫికేషన్.'
    },
    salary: {
      en: '₹54,220 - ₹1,33,630 (Depending on Post Cadre).',
      te: 'పోస్టు కేడర్‌ను బట్టి ₹54,220 - ₹1,33,630 వరకు.'
    },
    summary: {
      en: 'Telangana PSC Group 1 recruitment for Deputy Collector, DSP, Commercial Tax Officer, RDO, and Municipal Commissioner Grade-I.',
      te: 'తెలంగాణలో డిప్యూటీ కలెక్టర్, డీఎస్పీ, ఆర్డీవో తదితర 563 పోస్టుల గ్రూప్-1 పరీక్షల ఫలితాలు మరియు వెరిఫికేషన్ వివరాలు.'
    },
    description: {
      en: 'Candidates can inspect their evaluated responses, dispute resolution matrices, and category-wise provisional rosters on tgpsc.gov.in.',
      te: 'అభ్యర్థులు తమ ఫలితాలు, ప్రాథమిక కీలు మరియు సర్టిఫికెట్ల పరిశీలన సమాచారాన్ని అధికారిక వెబ్‌సైట్ tgpsc.gov.in లో చూడవచ్చు.'
    },
    officialUrl: 'https://tgpsc.gov.in',
    pdfUrl: 'https://tgpsc.gov.in',
    applyUrl: 'https://tgpsc.gov.in',
    status: 'Result Released',
    verifiedAt: '2025-02-18T14:20:00Z',
    featured: true,
    isDemoRecord: true
  },
  {
    id: 'rrb-alp-technician-2025',
    slug: 'rrb-alp-technician-2025',
    type: 'admit-card',
    title: {
      en: 'RRB Assistant Loco Pilot (ALP) & Technician CBT-2 City Slip & Admit Card',
      te: 'రైల్వే అసిస్టెంట్ లోకో పైలట్ (ALP) సీబీటీ-2 సిటీ స్లిప్ & అడ్మిట్ కార్డ్'
    },
    organization: {
      en: 'Railway Recruitment Boards (RRB)',
      te: 'రైల్వే రిక్రూట్‌మెంట్ బోర్డు (RRB)'
    },
    category: 'RRB and Railway',
    region: 'All India',
    notificationNo: 'CEN 01/2024 & CEN 02/2024',
    publishedAt: '2025-01-10',
    openingDate: '2025-01-20',
    deadline: '2025-02-19',
    examDate: 'Stage 2 CBT Dates Announced',
    vacancies: '18,799 (Revised)',
    qualification: {
      en: 'Matriculation / SSLC plus ITI from recognized institutions of NCVT/SCVT in trade, or Diploma/Degree in Engineering.',
      te: 'పదవ తరగతి తో పాటు సంబంధిత ట్రేడులో ఐటీఐ (ITI) లేదా ఇంజనీరింగ్ డిప్లొమా/డిగ్రీ.'
    },
    ageLimit: {
      en: '18 to 33 years with statutory Covid/Central age concessions.',
      te: '18 నుండి 33 సంవత్సరాలు (వయోపరిమితి సడలింపులు వర్తిస్తాయి).'
    },
    applicationFee: {
      en: '₹500 (Refundable ₹400 upon CBT appearance) / ₹250 for reserved/female.',
      te: '₹500 (సీబీటీకి హాజరైతే ₹400 వాపస్) / ₹250 రిజర్వ్డ్ వర్గాలకు.'
    },
    selectionProcess: {
      en: 'CBT 1 -> CBT 2 (Part A & Part B) -> Computer Based Aptitude Test (CBAT for ALP) -> Document Verification & Medical.',
      te: 'సీబీటీ 1 -> సీబీటీ 2 -> ఆప్టిట్యూడ్ టెస్ట్ (CBAT) -> సర్టిఫికెట్ల వెరిఫికేషన్ & మెడికల్.'
    },
    salary: {
      en: 'Level 2 of 7th CPC (Initial Pay ₹19,900/- plus running allowance).',
      te: '7వ పే కమిషన్ లెవల్ 2 (ప్రారంభ వేతనం ₹19,900/- మరియు రన్నింగ్ అలవెన్సులు).'
    },
    summary: {
      en: 'Indian Railways RRB issues City Intimation Slip and E-Call Letter download links for eligible candidates across all 21 railway regional zones.',
      te: 'భారతీయ రైల్వేలోని 18,799 అసిస్టెంట్ లోకో పైలట్ పోస్టుల సీబీటీ-2 పరీక్ష కోసం సిటీ స్లిప్ మరియు హాల్ టికెట్లు అందుబాటులోకి వచ్చాయి.'
    },
    description: {
      en: 'Candidates must log in with their Registration Number and User Password (Date of Birth) on their respective regional RRB portal (e.g. RRB Secunderabad, Chennai, Mumbai). Bring original Aadhaar Card for biometric authentication.',
      te: 'అభ్యర్థులు తమ రిజిస్ట్రేషన్ నంబర్ మరియు పుట్టిన తేదీతో లాగిన్ అయి ఈ-కాల్ లెటర్ డౌన్‌లోడ్ చేసుకోవాలి. ఆధార్ కార్డు తప్పనిసరి.'
    },
    officialUrl: 'https://rrbcdg.gov.in',
    pdfUrl: 'https://rrbapply.gov.in',
    applyUrl: 'https://rrbapply.gov.in',
    status: 'Admit Card Released',
    verifiedAt: '2025-02-14T09:15:00Z',
    featured: false,
    isDemoRecord: true
  },
  {
    id: 'ibps-po-cwe-xv-2025',
    slug: 'ibps-po-cwe-xv-2025',
    type: 'job',
    title: {
      en: 'IBPS Probationary Officers / Management Trainees (PO/MT-XV) 2025-26',
      te: 'ఐబీపీఎస్ ప్రొబేషనరీ ఆఫీసర్స్ (PO/MT-XV) 2025-26 నియామక ప్రక్రియ'
    },
    organization: {
      en: 'Institute of Banking Personnel Selection (IBPS)',
      te: 'ఇన్‌స్టిట్యూట్ ఆఫ్ బ్యాంకింగ్ పర్సనల్ సెలక్షన్ (IBPS)'
    },
    category: 'Banking',
    region: 'All India',
    notificationNo: 'CRP PO/MT-XV',
    publishedAt: '2025-02-01',
    openingDate: '2025-02-05',
    deadline: '2025-02-28',
    examDate: 'Prelims August 2025; Mains November 2025',
    vacancies: '4,455+ across 11 Participating Public Sector Banks',
    qualification: {
      en: 'A Degree (Graduation) in any discipline from a recognized University or equivalent qualification recognized by the Central Government.',
      te: 'గుర్తింపు పొందిన యూనివర్సిటీ నుంచి ఏదైనా విభాగంలో గ్రాడ్యుయేషన్ డిగ్రీ.'
    },
    ageLimit: {
      en: '20 to 30 years (Relaxations: 5 yrs SC/ST, 3 yrs OBC non-creamy layer, 10 yrs PwD).',
      te: '20 నుండి 30 సంవత్సరాలు (ఎస్సీ/ఎస్టీలకు 5 ఏళ్లు, ఓబీసీలకు 3 ఏళ్లు సడలింపు).'
    },
    applicationFee: {
      en: '₹175 for SC/ST/PwBD candidates; ₹850 for all other candidates.',
      te: 'ఎస్సీ/ఎస్టీ/దివ్యాంగులకు ₹175; ఇతరులకు ₹850.'
    },
    selectionProcess: {
      en: 'Online Preliminary Examination -> Online Main Examination -> Common Interview conducted by Participating Banks & Nodal Bank.',
      te: 'ఆన్‌లైన్ ప్రిలిమ్స్ -> ఆన్‌లైన్ మెయిన్స్ -> కామన్ ఇంటర్వ్యూ.'
    },
    salary: {
      en: 'Scale I Officer: Basic Pay ₹36,000/- (under 12th BPS revised scales, CTC approx ₹7.5-9.5 LPA).',
      te: 'స్కేల్-1 ఆఫీసర్: బేసిక్ పే ₹36,000/- మరియు బ్యాంకింగ్ నిబంధనల ప్రకారం అలవెన్సులు.'
    },
    summary: {
      en: 'Recruitment of Probationary Officers in participating Public Sector Banks including Bank of Baroda, Canara Bank, PNB, Indian Bank, and Union Bank of India.',
      te: 'కెనరా బ్యాంక్, పీఎన్‌బీ, ఇండియన్ బ్యాంక్, యూనియన్ బ్యాంక్ తదితర 11 ప్రభుత్వ రంగ బ్యాంకుల్లో పీవో ఉద్యోగాలు.'
    },
    description: {
      en: 'Applicants must register online on ibps.in, upload scanned photograph, signature, left thumb impression, and handwritten declaration.',
      te: 'దరఖాస్తుదారులు ibps.in వెబ్‌సైట్ ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోవాలి.'
    },
    officialUrl: 'https://ibps.in',
    pdfUrl: 'https://ibps.in',
    applyUrl: 'https://ibps.in',
    status: 'Applications Open',
    verifiedAt: '2025-02-02T11:45:00Z',
    featured: false,
    isDemoRecord: true
  },
  {
    id: 'isro-scientist-engineer-sc-2025',
    slug: 'isro-scientist-engineer-sc-2025',
    type: 'job',
    title: {
      en: 'ISRO ICRB Scientist/Engineer \'SC\' (Electronics, Mechanical, Computer Science)',
      te: 'ఇస్రో సైంటిస్ట్/ఇంజనీర్ \'SC\' రిక్రూట్‌మెంట్ (ఎలక్ట్రానిక్స్, మెకానికల్, కంప్యూటర్ సైన్స్)'
    },
    organization: {
      en: 'Indian Space Research Organisation (ISRO / ICRB)',
      te: 'భారత అంతరిక్ష పరిశోధన సంస్థ (ISRO)'
    },
    category: 'GATE, ISRO, and other technical examinations',
    region: 'All India',
    notificationNo: 'ISRO:ICRB:02(EMC):2025',
    publishedAt: '2025-01-28',
    openingDate: '2025-02-01',
    deadline: '2025-02-22',
    examDate: 'Written Test Scheduled May 2025',
    vacancies: '320',
    qualification: {
      en: 'BE/B.Tech or equivalent in First Class with an aggregate minimum of 65% marks or CGPA 6.84/10 in relevant engineering discipline.',
      te: 'సంబంధిత బ్రాంచిలో కనీసం 65% మార్కులు లేదా 6.84 సీజీపీఏతో ఫస్ట్ క్లాస్ బి.ఇ/బి.టెక్ ఉత్తీర్ణత.'
    },
    ageLimit: {
      en: '28 years as on last date of application (Relaxations applicable for reserved categories).',
      te: 'దరఖాస్తు ముగింపు నాటికి 28 సంవత్సరాలు (రిజర్వేషన్ల ప్రకారం సడలింపు).'
    },
    applicationFee: {
      en: '₹250 application fee per post + ₹750 internet processing charge (refundable upon attending written test).',
      te: '₹250 ప్రాసెసింగ్ ఫీజు + రాత పరీక్షకు హాజరైన వారికి రీఫండబుల్ మొత్తం.'
    },
    selectionProcess: {
      en: 'Written Test (80 Objective questions in discipline + 20 General Aptitude) followed by Technical Interview (1:5 ratio).',
      te: 'రాత పరీక్ష (టెక్నికల్ + ఆప్టిట్యూడ్) మరియు పర్సనల్ ఇంటర్వ్యూ.'
    },
    salary: {
      en: 'Level 10 of Pay Matrix (Basic ₹56,100/- p.m. + DA, HRA, Medical facilities in ISRO centers).',
      te: 'పే లెవల్ 10 (బేసిక్ ₹56,100/- నెలకు + అలవెన్సులు మరియు వైద్య సౌకర్యాలు).'
    },
    summary: {
      en: 'Prestigious technical careers at ISRO centers including VSSC, URSC, SAC, SDSC SHAR Sriharikota, and NRSC Hyderabad.',
      te: 'శ్రీహరికోట, హైదరాబాద్ ఎన్‌ఆర్‌ఎస్‌సీ, తిరువనంతపురం వీఎస్‌ఎస్‌సీలలో అంతరిక్ష పరిశోధన ఇంజనీర్ ఉద్యోగాలు.'
    },
    description: {
      en: 'The written test syllabus strictly conforms to GATE curriculum with questions assessing core engineering fundamentals.',
      te: 'పరీక్ష గేట్ సిలబస్ ఆధారంగా ఉంటుంది. పూర్తి వివరాలు isro.gov.in లో చూడండి.'
    },
    officialUrl: 'https://isro.gov.in',
    pdfUrl: 'https://isro.gov.in/Careers.html',
    applyUrl: 'https://apps.isac.gov.in',
    status: 'Closing Soon',
    verifiedAt: '2025-02-15T16:00:00Z',
    featured: false,
    isDemoRecord: true
  },
  {
    id: 'defence-cds-examination-i-2025',
    slug: 'defence-cds-examination-i-2025',
    type: 'admit-card',
    title: {
      en: 'UPSC Combined Defence Services (CDS-I) 2025 Examination E-Admit Card',
      te: 'యూపీఎస్సీ కంబైన్డ్ డిఫెన్స్ సర్వీసెస్ (CDS-I) 2025 పరీక్ష ఈ-అడ్మిట్ కార్డ్'
    },
    organization: {
      en: 'Union Public Service Commission & Ministry of Defence',
      te: 'యూనియన్ పబ్లిక్ సర్వీస్ కమిషన్ (రక్షణ మంత్రిత్వ శాఖ)'
    },
    category: 'Defence',
    region: 'All India',
    notificationNo: '02/2025-CDS-I',
    publishedAt: '2024-12-11',
    openingDate: '2024-12-11',
    deadline: '2025-01-09',
    examDate: '2025-04-13',
    vacancies: '457 (IMA, INA, AFA, OTA)',
    qualification: {
      en: 'For IMA/OTA: Degree of recognized University; For INA: Degree in Engineering; For AFA: Degree with Physics & Math at 10+2 or Bachelor of Engineering.',
      te: 'ఐఎంఏ/ఓటీఏ కు డిగ్రీ; ఐఎన్‌ఏ కు ఇంజనీరింగ్ డిగ్రీ; ఏఎఫ్‌ఏ కు ఇంటర్‌లో ఫిజిక్స్/మ్యాథ్స్ లేదా ఇంజనీరింగ్.'
    },
    ageLimit: {
      en: '19 to 24/25 years as per academy criteria (Unmarried male and female candidates).',
      te: 'అకాడమీ నిబంధనల ప్రకారం 19 నుండి 24/25 సంవత్సరాలు.'
    },
    applicationFee: {
      en: '₹200 (Female/SC/ST exempted).',
      te: '₹200 (మహిళలు, ఎస్సీ, ఎస్టీలకు మినహాయింపు).'
    },
    selectionProcess: {
      en: 'Written Examination (English, GK, Elementary Math) -> SSB Interview (Intelligence & Personality Test) -> Medical Examination.',
      te: 'రాత పరీక్ష -> 5 రోజుల ఎస్‌ఎస్‌బీ (SSB) ఇంటర్వ్యూ -> మెడికల్ బోర్డ్.'
    },
    salary: {
      en: 'Stipend ₹56,100/- p.m. during training, Lieutenant rank upon commissioning.',
      te: 'ట్రైనింగ్ కాలంలో ₹56,100/- గౌరవ వేతనం, లెఫ్టినెంట్ హోదాతో శాశ్వత కమిషన్.'
    },
    summary: {
      en: 'E-Admit cards for CDS-I 2025 are live. Eligible aspirants must download and verify their venue code and reporting instructions.',
      te: 'ఆర్మీ, నేవీ, ఎయిర్‌ఫోర్స్ మరియు ఆఫీసర్స్ ట్రైనింగ్ అకాడమీ పరీక్ష హాల్ టికెట్లు యూపీఎస్సీ విడుదల చేసింది.'
    },
    description: {
      en: 'Carry 3 identical passport photos if photo is unclear on admit card. Entry closes 30 minutes before commencement of each session.',
      te: 'పరీక్షా కేంద్రానికి ఆధార్ లేదా అధికారిక ఫోటో గుర్తింపు కార్డు వెంట తీసుకురావాలి.'
    },
    officialUrl: 'https://upsc.gov.in',
    pdfUrl: 'https://upsconline.nic.in/eadmitcard/subreg2.php',
    applyUrl: 'https://upsconline.nic.in',
    status: 'Admit Card Released',
    verifiedAt: '2025-02-12T13:00:00Z',
    featured: false,
    isDemoRecord: true
  }
];

export const INITIAL_CURRENT_AFFAIRS = [
  {
    id: 'ca-simbex-2026-visakhapatnam',
    slug: 'simbex-2026-maritime-exercise-visakhapatnam',
    headline: {
      en: 'SIMBEX-2026 Maritime Exercise Concludes at Visakhapatnam',
      te: 'విశాఖపట్నంలో ముగిసిన సింబెక్స్-2026 సముద్ర ద్వైపాక్షిక విన్యాసాలు'
    },
    eventDate: '2026-10-27',
    publishedAt: '2026-10-27',
    topic: 'Andhra Pradesh current affairs',
    sourceUrl: 'https://pib.gov.in',
    sourceName: 'Ministry of Defence / PIB',
    verifiedAt: '2026-10-27T18:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    examRelevance: ['UPSC', 'APPSC', 'CDS'],
    summary: {
      en: 'The 33rd edition of the Singapore India Maritime Bilateral Exercise (SIMBEX-2026), hosted by the Indian Navy at Visakhapatnam, concluded on 28 October 2026. The exercise involved harbour activities and maritime operations in the Bay of Bengal. It strengthens interoperability between the navies.',
      te: 'భారత నావికాదళం విశాఖపట్నంలో నిర్వహించిన సింగపూర్-భారత్ సముద్ర ద్వైపాక్షిక విన్యాసాల 33వ ఎడిషన్ (సింబెక్స్-2026) విజయవంతంగా ముగిసింది. బంగాళాఖాతంలో నావికా భద్రతను ఇది మరింత బలోపేతం చేస్తుంది.'
    },
    content: {
      en: 'SIMBEX-2026 witnessed complex naval manoeuvres including anti-submarine warfare firing drills, tactical surface strikes, and helicopter cross-deck operations. Key participants included INS Shivalik, INS Sahyadri, and RSS Formidable.',
      te: 'యాంటీ సబ్‌మెరైన్ వార్‌ఫేర్ మరియు వ్యూహాత్మక డ్రిల్స్‌తో సాగిన ఈ విన్యాసాలలో ఇరు దేశాల యుద్ధ నౌకలు విశేష ప్రతిభ చూపాయి.'
    },
    tags: ['SIMBEX', 'Defence', 'Navy', 'APPSC', 'UPSC Prelims']
  },
  {
    id: 'ca-pm-viksit-gram-swaraj-2026',
    slug: 'cabinet-approves-pradhan-mantri-viksit-gram-swaraj-yojana',
    headline: {
      en: 'Cabinet Approves Pradhan Mantri Viksit Gram Swaraj Yojana',
      te: 'ప్రధాన మంత్రి వికసిత్ గ్రామ స్వరాజ్ యోజనకు కేంద్ర కేబినెట్ ఆమోదం'
    },
    eventDate: '2026-10-28',
    publishedAt: '2026-10-28',
    topic: 'Government schemes',
    sourceUrl: 'https://pib.gov.in',
    sourceName: 'Press Information Bureau',
    verifiedAt: '2026-10-28T14:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    examRelevance: ['UPSC', 'SSC', 'BANK'],
    summary: {
      en: 'The Union Cabinet approved the Pradhan Mantri Viksit Gram Swaraj Yojana as a Centrally Sponsored Scheme for 2026-27 to 2030-31. The scheme has a total outlay of ₹97,395.55 crore, comprising a central share of ₹64,499.48 crore and a state share of ₹32,896.07 crore.',
      te: '2026-27 నుండి 2030-31 వరకు అమలు చేయనున్న ప్రధాన మంత్రి వికసిత్ గ్రామ స్వరాజ్ యోజనకు కేంద్ర కేబినెట్ ఆమోదం తెలిపింది. మొత్తం వ్యయం రూ.97,395.55 కోట్లు కాగా, ఇందులో కేంద్ర వాటా రూ.64,499.48 కోట్లు.'
    },
    content: {
      en: 'The initiative targets saturation of basic rural amenities, 100% digital panchayat connectivity, community solar irrigation, and village enterprise incubation clusters across backward blocks.',
      te: 'గ్రామీణ ప్రాంతాలలో డిజిటల్ పంచాయతీలు, సోలార్ సాగునీరు, మౌలిక వసతుల కల్పన లక్ష్యంగా ఈ పథకం రూపొందించబడింది.'
    },
    tags: ['Rural Development', 'Cabinet Decisions', 'Government Schemes', 'UPSC GS-2']
  },
  {
    id: 'ca-science-defense-economics-reforms',
    slug: 'science-and-defense-economics-committee-reforms',
    headline: {
      en: 'Science and Defense Economics Committee Reforms',
      te: 'సైన్స్ అండ్ డిఫెన్స్ ఎకనామిక్స్ కమిటీ సంస్కరణల నివేదిక'
    },
    eventDate: '2026-10-28',
    publishedAt: '2026-10-28',
    topic: 'National news',
    sourceUrl: 'https://pib.gov.in',
    sourceName: 'Ministry of Defence / PIB',
    verifiedAt: '2026-10-28T16:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
    examRelevance: ['BANK', 'SSC', 'TGPSC'],
    summary: {
      en: 'The high-level joint committee on Defense Economics submitted structural recommendations to stimulate private capital induction in aerospace research, domestic micro-sensor fabrication, and defense procurement transparency.',
      te: 'రక్షణ ఆర్థిక రంగంలో ప్రైవేట్ భాగస్వామ్యం, స్వదేశీ ఏరోస్పేస్ రీసెర్చ్ మరియు మైక్రో సెన్సార్ల తయారీకి ప్రత్యేక ప్రోత్సాహకాలను సిఫార్సు చేస్తూ ఉన్నత స్థాయి కమిటీ నివేదిక సమర్పించింది.'
    },
    content: {
      en: 'Key proposals include dedicated defense manufacturing innovation funds, single-window patent clearances for DRDO-academic consortia, and duty exemptions on dual-use aerospace materials.',
      te: 'డీఆర్‌డీఓ పరిశోధనలకు పేటెంట్ అనుమతులు సులభతరం చేయడం, విదేశీ ముడిసరుకులపై పన్ను మినహాయింపులు ఇందులో ప్రధానాంశాలు.'
    },
    tags: ['Defence Economics', 'Science & Tech', 'DRDO', 'Banking Exams']
  },
  {
    id: 'ca-andaman-coastal-surveillance-station',
    slug: 'andaman-source-unit-cantonment-coastal-surveillance',
    headline: {
      en: 'Andaman Source Unit in Cantonment for Coastal Surveillance',
      te: 'తీరప్రాంత నిఘా కోసం అండమాన్‌లో ఆధునిక నిఘా కేంద్రం ఏర్పాటు'
    },
    eventDate: '2026-10-29',
    publishedAt: '2026-10-29',
    topic: 'National news',
    sourceUrl: 'https://pib.gov.in',
    sourceName: 'APPSC / PIB',
    verifiedAt: '2026-10-29T10:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    examRelevance: ['BANK', 'SSC', 'TGPSC'],
    summary: {
      en: 'Armed forces established an upgraded coastal radar monitoring command in the Andaman & Nicobar archipelago to ensure round-the-clock automatic identification and maritime choke point safety.',
      te: 'హిందూ మహాసముద్రం మరియు మలక్కా జలసంధి సమీపంలో సముద్ర భద్రతను పర్యవేక్షించేందుకు అండమాన్ నికోబార్ కమాండ్‌లో నూతన నిఘా విభాగాన్ని ప్రారంభించారు.'
    },
    content: {
      en: 'Integrated with high-frequency coastal radars and optical day/night surveillance domes, the station provides real-time situational awareness across the Malacca Strait approach lanes.',
      te: 'అత్యాధునిక రాడార్లు మరియు ఉపగ్రహ సమాచార వ్యవస్థతో తీరప్రాంతంలో అనుమానాస్పద కదలికలను ఈ కేంద్రం గుర్తిస్తుంది.'
    },
    tags: ['Coastal Security', 'Andaman', 'Strategic Affairs', 'SSC']
  },
  {
    id: 'ca-tpd-depth-urban-sanitation-index',
    slug: 'tpd-depth-urban-sanitation-index-reforms',
    headline: {
      en: 'TPD Depth on Other Colonies: Urban Sanitation Index',
      te: 'పట్టణ పారిశుధ్య సూచీలో మార్పులు: నగరాల వ్యర్థాల నిర్వహణ మార్గదర్శకాలు'
    },
    eventDate: '2026-10-28',
    publishedAt: '2026-10-28',
    topic: 'National news',
    sourceUrl: 'https://pib.gov.in',
    sourceName: 'Press Information Bureau',
    verifiedAt: '2026-10-28T12:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    examRelevance: ['UPSC', 'APPSC', 'SSC'],
    summary: {
      en: 'The Ministry of Housing and Urban Affairs rolled out new parameters under Swachh Survekshan evaluating circular sanitation models, fecal sludge remediation, and greywater recycling in suburban extensions.',
      te: 'స్వచ్ఛ సర్వేక్షణ్ కింద పట్టణ శివారు ప్రాంతాలలో డ్రైనేజీ నిర్వహణ మరియు రీసైక్లింగ్ ప్రక్రియలకు ప్రభుత్వం నూతన మార్గదర్శకాలను విడుదల చేసింది.'
    },
    content: {
      en: 'Municipal councils achieving above 90% in circular water reuse will receive priority grant disbursements under the AMRUT 2.0 national mission.',
      te: 'మురుగునీటి శుద్ధిలో 90 శాతం లక్ష్యాలను చేరుకున్న మున్సిపాలిటీలకు కేంద్ర అమృత్ పథకంలో అదనపు ప్రోత్సాహకాలు అందనున్నాయి.'
    },
    tags: ['Urban Governance', 'Sanitation', 'Swachh Bharat', 'UPSC GS-2']
  },
  {
    id: 'ca-isro-gaganyaan-tv-d2',
    slug: 'isro-gaganyaan-tv-d2-abort-mission-milestone',
    headline: {
      en: 'ISRO Successfully Validates Crew Escape Sequence in Gaganyaan TV-D2 Test',
      te: 'గగన్‌యాన్ టీవీ-డీ2 టెస్ట్‌లో క్రూ ఎస్కేప్ సిస్టమ్‌ను విజయవంతంగా పరీక్షించిన ఇస్రో'
    },
    eventDate: '2026-10-27',
    publishedAt: '2026-10-27',
    topic: 'Science and technology',
    sourceUrl: 'https://pib.gov.in',
    sourceName: 'Press Information Bureau (PIB) / ISRO Official Release',
    verifiedAt: '2026-10-27T18:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1517976487502-d216f9f6e632?auto=format&fit=crop&w=600&q=80',
    examRelevance: ['UPSC', 'APPSC', 'TGPSC'],
    summary: {
      en: 'Indian Space Research Organisation carried out the second test vehicle mission (TV-D2) confirming aerodynamic separation and high-altitude drogue parachute deployment of the Gaganyaan crew module off the coast of Sriharikota.',
      te: 'శ్రీహరికోటలోని సతీష్ ధావన్ అంతరిక్ష కేంద్రం నుంచి ఇస్రో మానవ సహిత అంతరిక్ష యాత్ర \'గగన్‌యాన్\' రెండో టెస్ట్ వెహికల్ ప్రయోగాన్ని విజయవంతంగా పూర్తి చేసింది.'
    },
    content: {
      en: 'The mission objective was to demonstrate the Crew Escape System (CES) performance under transonic flight conditions resembling emergency ascent abort. The crew module safely splashed down in the Bay of Bengal and was retrieved by the Indian Navy diving team.',
      te: 'రాకెట్ ప్రయాణంలో అత్యవసర పరిస్థితులు ఎదురైతే వ్యోమగాములను సురక్షితంగా తప్పించే వ్యవస్థను ఈ ప్రయోగంలో విజయవంతంగా పరిశీలించారు. బంగాళాఖాతంలో పడిన క్రూ మాడ్యూల్‌ను భారత నావికాదళం వెలికితీసింది.'
    },
    tags: ['ISRO', 'Gaganyaan', 'Space Tech', 'UPSC Prelims', 'General Science']
  },
  {
    id: 'ca-rbi-monetary-policy-feb-2025',
    slug: 'rbi-mpc-decision-repo-rate-inflation-outlook',
    headline: {
      en: 'RBI Monetary Policy Committee Maintains Repo Rate at 6.50% with Neutral Stance',
      te: 'రెపో రేటును 6.50 శాతంగా యథాతథంగా కొనసాగించిన ఆర్బీఐ ద్రవ్య విధాన కమిటీ'
    },
    eventDate: '2026-10-26',
    publishedAt: '2026-10-26',
    topic: 'Economy',
    sourceUrl: 'https://rbi.org.in',
    sourceName: 'Reserve Bank of India Monetary Policy Statement',
    verifiedAt: '2026-10-26T12:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    examRelevance: ['UPSC', 'BANK', 'SSC'],
    summary: {
      en: 'The six-member Monetary Policy Committee (MPC) voted unanimously to retain the policy repo rate at 6.50% while projecting real GDP growth for FY 2026-27 at 6.8% and headline CPI inflation at 4.4%.',
      te: 'రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా మానిటరీ పాలసీ కమిటీ రెపో రేటును 6.50 శాతంగా ఉంచుతూ నిర్ణయం తీసుకుంది. దేశ జీడీపీ వృద్ధి రేటును 6.8 శాతంగా అంచనా వేసింది.'
    },
    content: {
      en: 'The Governor emphasized vigilant monitoring of food supply chains and volatile crude markets, noting that transmission of previous policy rate hikes continues across bank lending and deposit rates.',
      te: 'ద్రవ్యోల్బణాన్ని నియంత్రణలో ఉంచడం మరియు దేశ ఆర్థిక స్థిరత్వాన్ని కాపాడటం ప్రధాన లక్ష్యమని ఆర్బీఐ గవర్నర్ స్పష్టం చేశారు.'
    },
    tags: ['RBI', 'Economy', 'Repo Rate', 'Banking Exams', 'UPSC GS-3']
  },
  {
    id: 'ca-ap-polavaram-project-budget-central-aid',
    slug: 'central-cabinet-approves-additional-funds-polavaram-phase-1',
    headline: {
      en: 'Union Cabinet Sanctions ₹12,157 Crore Special Assistance for Polavaram Phase-1',
      te: 'పోలవరం మొదటి దశ పనుల కోసం ₹12,157 కోట్ల ఆర్థిక సాయానికి కేంద్ర కేబినెట్ ఆమోదం'
    },
    eventDate: '2026-10-25',
    publishedAt: '2026-10-25',
    topic: 'Andhra Pradesh current affairs',
    sourceUrl: 'https://pib.gov.in',
    sourceName: 'PIB New Delhi Cabinet Communique',
    verifiedAt: '2026-10-25T20:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    examRelevance: ['APPSC', 'UPSC', 'TGPSC'],
    summary: {
      en: 'The Union Cabinet chaired by the Prime Minister approved revised financial provisions of ₹12,157.53 crore to complete Phase-1 of the Polavaram National Irrigation Project in Andhra Pradesh up to 41.15-meter water level.',
      te: 'ఆంధ్రప్రదేశ్ జీవనాడి అయిన పోలవరం జాతీయ సాగునీటి ప్రాజెక్టు మొదటి దశ (41.15 మీటర్ల కాంటూర్) పూర్తి చేయడానికి కేంద్ర ప్రభుత్వం రూ.12,157 కోట్లను మంజూరు చేసింది.'
    },
    content: {
      en: 'Funds will directly cover rehabilitation and resettlement (R&R) packages for affected tribal villages in Alluri Sitarama Raju and Eluru districts alongside completing diaphragm wall rectification works.',
      te: 'ఈ నిధులతో పునరావాసం (R&R), డయాఫ్రమ్ వాల్ మరమ్మతులు మరియు ప్రధాన ఆనకట్ట నిర్మాణ పనులు వేగవంతం కానున్నాయి.'
    },
    tags: ['Andhra Pradesh', 'Polavaram', 'APPSC Group 1 & 2', 'Irrigation']
  }
];

export const INITIAL_QUESTIONS = [
  {
    id: 'gk-q1-polity',
    topic: 'Polity',
    category: 'General Studies',
    isPyq: true,
    examSource: 'UPSC Civil Services Prelims 2023',
    question: {
      en: 'Which Article of the Constitution of India safeguards one\'s right to marry the person of one\'s choice?',
      te: 'భారత రాజ్యాంగంలోని ఏ అధికరణం ఒక వ్యక్తి తనకిష్టమైన వ్యక్తిని వివాహం చేసుకునే హక్కును ప్రాథమిక హక్కుగా రక్షిస్తుంది?'
    },
    options: {
      en: ['Article 19', 'Article 21', 'Article 25', 'Article 29'],
      te: ['అధికరణ 19', 'అధికరణ 21', 'అధికరణ 25', 'అధికరణ 29']
    },
    correctAnswer: 1, // 0-indexed: Article 21
    explanation: {
      en: 'In the landmark Shafin Jahan v. Asokan K.M. (Hadiya case, 2018), the Supreme Court of India held that the right to marry a person of one\'s choice is integral to Article 21 (Protection of life and personal liberty) of the Constitution.',
      te: '2018 నాటి హదియా కేసు (షఫీన్ జహాన్ వర్సెస్ అశోకన్) తీర్పులో భారత సుప్రీంకోర్టు, నచ్చిన వ్యక్తిని వివాహం చేసుకునే స్వేచ్ఛ రాజ్యాంగంలోని అధికరణ 21 (జీవించే హక్కు మరియు వ్యక్తిగత స్వేచ్ఛ) పరిధిలోకి వస్తుందని స్పష్టం చేసింది.'
    }
  },
  {
    id: 'gk-q2-economy',
    topic: 'Economy',
    category: 'Banking & Finance',
    isPyq: false,
    examSource: 'ExamQuestHub Practice Module',
    question: {
      en: 'What is the primary objective of the "Open Market Operations" (OMO) conducted by the Reserve Bank of India?',
      te: 'భారత రిజర్వ్ బ్యాంక్ (RBI) నిర్వహించే "ఓపెన్ మార్కెట్ ఆపరేషన్స్" (OMO) యొక్క ముఖ్య ఉద్దేశ్యం ఏమిటి?'
    },
    options: {
      en: [
        'To supervise commercial bank balance sheets directly',
        'To regulate the liquidity and money supply in the banking system',
        'To fix the foreign currency exchange rates permanently',
        'To collect corporate income tax on behalf of the Central Government'
      ],
      te: [
        'వాణిజ్య బ్యాంకుల బ్యాలెన్స్ షీట్లను నేరుగా తనిఖీ చేయడం',
        'బ్యాంకింగ్ వ్యవస్థలో ద్రవ్య లభ్యత (లిక్విడిటీ) మరియు నగదు సరఫరాను నియంత్రించడం',
        'విదేశీ మారక ద్రవ్యం విలువను శాశ్వతంగా నిర్ధారించడం',
        'కేంద్ర ప్రభుత్వం తరపున కార్పొరేట్ పన్నులను వసూలు చేయడం'
      ]
    },
    correctAnswer: 1,
    explanation: {
      en: 'Open Market Operations refer to the sale and purchase of government securities (G-Secs) by the RBI in the open market to absorb or inject liquidity into the economy, thereby aligning short-term interest rates with policy targets.',
      te: 'ఓపెన్ మార్కెట్ ఆపరేషన్స్ (OMO) అనగా ఆర్బీఐ బహిరంగ మార్కెట్లో ప్రభుత్వ సెక్యూరిటీలను కొనడం లేదా అమ్మడం ద్వారా మార్కెట్లో ద్రవ్య సరఫరాను మరియు వడ్డీ రేట్లను సమతుల్యం చేస్తుంది.'
    }
  },
  {
    id: 'gk-q3-science',
    topic: 'Science',
    category: 'Space & Tech',
    isPyq: true,
    examSource: 'SSC CGL Tier-1 2024',
    question: {
      en: 'Which indigenously developed navigation satellite system of India provides accurate Position, Velocity, and Timing (PVT) services across the Indian landmass and 1,500 km around it?',
      te: 'భారత భూభాగంతో పాటు సరిహద్దుల నుండి 1500 కిలోమీటర్ల పరిధి వరకు ఖచ్చితమైన స్థానాన్ని అందించే స్వదేశీ నావిగేషన్ వ్యవస్థ ఏది?'
    },
    options: {
      en: ['GAGAN', 'NavIC (IRNSS)', 'BHUVAN', 'SARAL'],
      te: ['గగన్ (GAGAN)', 'నావిక్ - NavIC (IRNSS)', 'భువన్ (BHUVAN)', 'సరళ్ (SARAL)']
    },
    correctAnswer: 1,
    explanation: {
      en: 'NavIC (Navigation with Indian Constellation), formerly known as the Indian Regional Navigation Satellite System (IRNSS), is an autonomous regional satellite navigation system operated by ISRO.',
      te: 'నావిక్ (NavIC - భారతీయ ప్రాంతీయ నావిగేషన్ ఉపగ్రహ వ్యవస్థ) అనేది ఇస్రో రూపొందించిన స్వదేశీ జీపీఎస్ తరహా నావిగేషన్ వ్యవస్థ.'
    }
  },
  {
    id: 'gk-q4-ap-special',
    topic: 'Andhra Pradesh Special',
    category: 'State PSC',
    isPyq: true,
    examSource: 'APPSC Group-2 Prelims 2024',
    question: {
      en: 'Under the Andhra Pradesh Reorganisation Act, 2014, how many mandals of Khammam district were transferred to Andhra Pradesh to facilitate the Polavaram irrigation project?',
      te: 'ఆంధ్రప్రదేశ్ పునర్వ్యవస్థీకరణ చట్టం, 2014 ప్రకారం పోలవరం ప్రాజెక్టు నిర్మాణం కోసం ఖమ్మం జిల్లాలోని ఎన్ని మండలాలను ఆంధ్రప్రదేశ్‌లో కలిపారు?'
    },
    options: {
      en: ['5 Mandals', '7 Mandals', '9 Mandals', '12 Mandals'],
      te: ['5 మండలాలు', '7 మండలాలు', '9 మండలాలు', '12 మండలాలు']
    },
    correctAnswer: 1,
    explanation: {
      en: 'Under Section 3 of the AP Reorganisation (Amendment) Act, 2014, seven mandals (6 fully and 1 partially divided across Kukunoor, Velairpadu, Chintoor, VR Puram, Kunavaram, Bhadrachalam rural, and Burgampadu) were transferred to AP.',
      te: 'పోలవరం ప్రాజెక్టు ముంపు ప్రాంతాల సమన్వయం కోసం ఖమ్మం జిల్లాలోని 7 ముంపు మండలాలను ఆంధ్రప్రదేశ్‌లోని ఉభయ గోదావరి జిల్లాల్లో విలీనం చేశారు.'
    }
  },
  {
    id: 'gk-q5-ts-special',
    topic: 'Telangana Special',
    category: 'State PSC',
    isPyq: true,
    examSource: 'TGPSC Group-1 Prelims 2024',
    question: {
      en: 'Which historic reservoir in Hyderabad, built in 1920 across the Musi river following the devastating flood of 1908, was designed under the guidance of Sir Mokshagundam Visvesvaraya?',
      te: '1908 నాటి మూసీ నది వరదల విపత్తు అనంతరం సర్ మోక్షగుండం విశ్వేశ్వరయ్య సలహాల మేరకు 1920లో హైదరాబాద్‌లో నిర్మించిన చారిత్రక జలాశయం ఏది?'
    },
    options: {
      en: ['Himayat Sagar', 'Osman Sagar (Gandipet)', 'Hussain Sagar', 'Shamirpet Lake'],
      te: ['హిమాయత్ సాగర్', 'ఉస్మాన్ సాగర్ (గండిపేట)', 'హుస్సేన్ సాగర్', 'శామీర్‌పేట చెరువు']
    },
    correctAnswer: 1,
    explanation: {
      en: 'Osman Sagar, popularly called Gandipet, was constructed on the Musi River during the reign of the 7th Nizam, Mir Osman Ali Khan, designed by Sir M. Visvesvaraya to protect Hyderabad from floods and provide drinking water.',
      te: 'ఏడవ నిజాం మీర్ ఉస్మాన్ అలీ ఖాన్ హయాంలో ఇంజనీర్ సర్ ఎం. విశ్వేశ్వరయ్య ప్రణాళికతో వరద నివారణ కోసం 1920లో ఉస్మాన్ సాగర్ (గండిపేట) నిర్మాణం పూర్తయింది.'
    }
  }
];

export const INITIAL_RESOURCES = [
  {
    id: 'pyq-upsc-prelims-gs1-2024',
    title: {
      en: 'UPSC Civil Services Preliminary 2024 Question Paper (General Studies - Paper I)',
      te: 'యూపీఎస్సీ సివిల్ సర్వీసెస్ ప్రిలిమ్స్ 2024 ప్రశ్నాపత్రం (జనరల్ స్టడీస్ - పేపర్ 1)'
    },
    category: 'Previous-Year Papers',
    examBoard: 'UPSC',
    year: '2024',
    type: 'Question Paper + Official Key',
    fileSize: '2.4 MB PDF',
    downloadUrl: '/assets/aistudio/October_2025_Current_Affairs_MCQs_9e8d634c.pdf',
    officialSource: 'https://upsc.gov.in',
    description: {
      en: 'Official bilingual Question Paper Series A with key questions on History, Polity, Geography, Economy, Environment, and Science.',
      te: 'యూపీఎస్సీ విడుదల చేసిన ప్రామాణిక ప్రిలిమ్స్ పేపర్-1 ప్రశ్నలు.'
    }
  },
  {
    id: 'pyq-ssc-cgl-tier1-2024',
    title: {
      en: 'SSC CGL Tier-I 2024 All Shifts Consolidated Memory & Model Master Paper',
      te: 'ఎస్ఎస్సీ సిజిఎల్ టైర్-1 2024 సమగ్ర మోడల్ మరియు గత ప్రశ్నాపత్రాల సంకలనం'
    },
    category: 'Previous-Year Papers',
    examBoard: 'SSC',
    year: '2024',
    type: 'Solved Question Paper',
    fileSize: '3.8 MB PDF',
    downloadUrl: '/assets/aistudio/November_2025_Current_Affairs_MCQs_106d2ab4.pdf',
    officialSource: 'https://ssc.gov.in',
    description: {
      en: 'Covers Quantitative Aptitude, English Comprehension, Reasoning, and General Awareness sections with step-by-step shortcuts.',
      te: 'రీజనింగ్, అర్థమెటిక్, ఇంగ్లీష్ మరియు జీకే విభాగాల పరిష్కారాలతో కూడిన ప్రశ్నాపత్రం.'
    }
  },
  {
    id: 'syllabus-appsc-group2-revised',
    title: {
      en: 'APPSC Group-II Services Comprehensive Revised Syllabus & Exam Pattern PDF',
      te: 'ఏపీపీఎస్సీ గ్రూప్-2 సర్వీసెస్ సమగ్ర నూతన సిలబస్ & పరీక్షా విధానం'
    },
    category: 'Syllabus & Exam Pattern',
    examBoard: 'APPSC',
    year: '2024-25',
    type: 'Official Syllabus Breakdown',
    fileSize: '1.2 MB PDF',
    downloadUrl: '/assets/aistudio/December_2025_Current_Affairs_MCQs_fea0a8ff.pdf',
    officialSource: 'https://psc.ap.gov.in',
    description: {
      en: 'Detailed topic-wise syllabus for Prelims (Screening) and Mains Paper I (Social History of AP & Constitution) and Paper II (Indian & AP Economy, Science & Tech).',
      te: 'ప్రిలిమ్స్ మరియు మెయిన్స్ పేపర్ల వారీగా పూర్తి సిలబస్ వివరాలు.'
    }
  },
  {
    id: 'syllabus-tgpsc-group1-mains',
    title: {
      en: 'TGPSC Group-I Services Scheme of Examination and Complete Detailed Syllabus',
      te: 'టీజీపీఎస్సీ గ్రూప్-1 సర్వీసెస్ మెయిన్స్ పరీక్షా విధానం మరియు పూర్తి సిలబస్'
    },
    category: 'Syllabus & Exam Pattern',
    examBoard: 'TGPSC',
    year: '2024-25',
    type: 'Official Syllabus Breakdown',
    fileSize: '1.5 MB PDF',
    downloadUrl: '/assets/aistudio/October_2025_Current_Affairs_MCQs_9e8d634c.pdf',
    officialSource: 'https://tgpsc.gov.in',
    description: {
      en: 'Covers General English qualifying paper and 6 descriptive papers including Telangana Movement and State Formation.',
      te: 'తెలంగాణ ఉద్యమం, రాష్ట్ర ఆవిర్భావం మరియు జనరల్ స్టడీస్ పేపర్ల సిలబస్.'
    }
  },
  {
    id: 'notes-monthly-current-affairs-jan-2025',
    title: {
      en: 'ExamQuestHub Monthly Current Affairs Digest — January 2026 (Bilingual)',
      te: 'ఎగ్జామ్‌క్వెస్ట్ హబ్ నెలవారీ కరెంట్ అఫైర్స్ డైజెస్ట్ — జనవరి 2026 (ద్విభాష)'
    },
    category: 'General Knowledge notes',
    examBoard: 'All Competitive Exams',
    year: '2026',
    type: 'Revision Capsule',
    fileSize: '4.1 MB PDF',
    downloadUrl: '/assets/aistudio/January_2026_Current_Affairs_MCQ_31a6a736.pdf',
    officialSource: 'https://pib.gov.in',
    description: {
      en: 'Categorized quick-revision notes for National, International, AP, Telangana, Sports, and Science news with 100 revision MCQs.',
      te: 'అన్ని పోటీ పరీక్షల కోసం జనవరి నెల పూర్తి కరెంట్ అఫైర్స్ సంక్షిప్త నోట్స్ మరియు ప్రాక్టీస్ ప్రశ్నలు.'
    }
  }
];
