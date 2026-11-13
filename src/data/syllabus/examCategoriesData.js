/**
 * 12 Canonical Government Exam Categories for ExamQuestHub Syllabus Library (2026)
 */

export const EXAM_CATEGORIES = [
  {
    id: 'rrb',
    name: 'Railway Recruitment Board (RRB)',
    shortName: 'Railways (RRB & RPF)',
    code: 'RRB',
    scope: 'Central',
    authority: 'Railway Recruitment Boards (Ministry of Railways) & RPF',
    officialPortal: 'https://rrbcdg.gov.in',
    description:
      'NTPC Graduate & UG, Group D (Level-1), ALP, Technician Grade 1 & 3, Junior Engineer (JE), Section Controller, Station Master, Ministerial & Paramedical, RPF SI & Constable.',
    order: 1
  },
  {
    id: 'ssc',
    name: 'Staff Selection Commission (SSC)',
    shortName: 'SSC Examinations',
    code: 'SSC',
    scope: 'Central',
    authority: 'Staff Selection Commission (ssc.gov.in)',
    officialPortal: 'https://ssc.gov.in',
    description:
      'CGL, CHSL, MTS, GD Constable, CPO, JE (Civil/Mech/Elec), Stenographer C & D, Selection Post, JHT, Scientific Assistant IMD, Delhi Police Constable & Head Constable.',
    order: 2
  },
  {
    id: 'appsc',
    name: 'Andhra Pradesh Public Service Commission (APPSC)',
    shortName: 'APPSC (Andhra Pradesh)',
    code: 'APPSC',
    scope: 'State',
    state: 'Andhra Pradesh',
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    officialPortal: 'https://psc.ap.gov.in',
    description:
      'APPSC Group 1, Group 2, Group 3, Group 4, Degree/Junior/Polytechnic Lecturers, Assistant Engineer, AEE, Forest Range Officer, DyEO, and Technical Assistant.',
    order: 3
  },
  {
    id: 'tgpsc',
    name: 'Telangana Public Service Commission (TGPSC)',
    shortName: 'TGPSC & Telangana Exams',
    code: 'TGPSC',
    scope: 'State',
    state: 'Telangana',
    authority: 'TGPSC, TGLPRB & Telangana School Education',
    officialPortal: 'https://www.tgpsc.gov.in',
    description:
      'TGPSC Group 1, Group 2, Group 3, Group 4, JL, DL, Polytechnic Lecturer, Telangana Police SI & Constable, Telangana DSC, Forest Department, and Assistant Engineer.',
    order: 4
  },
  {
    id: 'upsc',
    name: 'Union Public Service Commission (UPSC)',
    shortName: 'UPSC Examinations',
    code: 'UPSC',
    scope: 'Central',
    authority: 'Union Public Service Commission (upsc.gov.in)',
    officialPortal: 'https://upsc.gov.in',
    description:
      'Civil Services (IAS/IPS/IFS), CDS, NDA, CAPF AC, Engineering Services (ESE), Indian Forest Service (IFoS), CMS, EPFO, Combined Geo-Scientist, and IES/ISS.',
    order: 5
  },
  {
    id: 'banking',
    name: 'Banking Examinations',
    shortName: 'Banking & Regulatory',
    code: 'BANK',
    scope: 'Central',
    authority: 'IBPS, SBI, RBI, and NABARD',
    officialPortal: 'https://www.ibps.in',
    description:
      'IBPS PO, Clerk, SO, IBPS RRB Scale I/II/III & Office Assistant, SBI PO, Clerk, SO, RBI Grade B & Assistant, NABARD Grade A & Grade B.',
    order: 6
  },
  {
    id: 'defence',
    name: 'Defence Examinations',
    shortName: 'Defence & Armed Forces',
    code: 'DEF',
    scope: 'Central',
    authority: 'UPSC, IAF (AFCAT), Indian Army, Indian Navy & Indian Coast Guard',
    officialPortal: 'https://joinindianarmy.nic.in',
    description:
      'NDA, CDS, AFCAT, Indian Navy SSR/MR/Agniveer, IAF Agniveervayu, Indian Army Agniveer, Coast Guard Navik & Yantrik, and CAPF AC.',
    order: 7
  },
  {
    id: 'police',
    name: 'Police and Paramilitary Examinations',
    shortName: 'Police & CAPF',
    code: 'POLICE',
    scope: 'Central & State',
    authority: 'SSC, CAPFs (CRPF, BSF, CISF, ITBP, SSB), AP SLPRB & TGLPRB',
    officialPortal: 'https://ssc.gov.in',
    description:
      'SSC GD, CRPF/BSF/CISF/ITBP/SSB Constable, CRPF/BSF SI, CISF ASI, State Police SI & Constable, AP Police & Telangana Police recruitments.',
    order: 8
  },
  {
    id: 'engineering',
    name: 'Engineering Government Examinations',
    shortName: 'Engineering Govt',
    code: 'ENGG',
    scope: 'Central & State',
    authority: 'IITs (GATE), UPSC, SSC, RRBs & State PSCs',
    officialPortal: 'https://gate2026.iitg.ac.in',
    description:
      'SSC JE (CE/ME/EE), RRB JE (CE/ME/EE/EC), GATE, UPSC Engineering Services (ESE), State AE/AEE, and State Junior Engineer examinations.',
    order: 9
  },
  {
    id: 'teaching',
    name: 'Teaching Examinations',
    shortName: 'Teaching & NET/TET',
    code: 'TEACH',
    scope: 'Central & State',
    authority: 'CBSE (CTET), NTA (UGC/CSIR NET), KVS, NVS, AP & Telangana Education',
    officialPortal: 'https://ctet.nic.in',
    description:
      'CTET Paper 1 & 2, AP TET, TG TET, AP DSC, Telangana DSC, KVS PRT/TGT/PGT, NVS TGT/PGT, UGC NET, and CSIR NET.',
    order: 10
  },
  {
    id: 'state-govt',
    name: 'State Government Examinations',
    shortName: 'State Govt Exams',
    code: 'STATE',
    scope: 'State',
    authority: 'State Recruitment Boards, Sachivalayam & State PSCs',
    officialPortal: 'https://psc.ap.gov.in',
    description:
      'AP Grama/Ward Sachivalayam, Telangana TREIRB Gurukul, AP & Telangana State recruitments, and major State PSC Combined Civil Services.',
    order: 11
  },
  {
    id: 'other-central',
    name: 'Other Central Government Examinations',
    shortName: 'Central & PSU / Research',
    code: 'CENTRAL',
    scope: 'Central',
    authority: 'ISRO, DRDO, IB (MHA), FCI, LIC, ESIC & BARC',
    officialPortal: 'https://www.isro.gov.in',
    description:
      'Intelligence Bureau ACIO Grade II, ISRO Scientist/Engineer, DRDO CEPTAM, FCI Manager & AG-III, LIC AAO, ESIC SSO/UDC, and BARC OCES.',
    order: 12
  }
];
