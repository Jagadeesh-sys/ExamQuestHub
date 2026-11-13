import fs from 'fs';
import path from 'path';

const EXAM_META = {
  generatedAt: '2026-11-13T01:45:00.000Z',
  examName: 'APPSC Group-2 Paper-2 (2025)',
  examType: 'APPSC Group II',
  examLevel: 'Group II',
  examLevelLabel: 'APPSC Group-II Paper-II (2025)',
  examCode: '2G/202 · Series (C)',
  examYear: '2025',
  totalShifts: 1,
  totalQuestions: 150,
  totalVerified: 150,
  subjectCounts: {
    'General Knowledge': 75,
    'General Science': 75
  },
  subjects: ['General Knowledge', 'General Science'],
  source: 'APPSC Group-2 Paper-2 (2025) Official Question Paper · Booklet 2G/202 (C)',
  paperUrl: '/assets/aistudio/Group-2-_-Prelims-Exam-Question-Paper-2-2025_copy_f6e37955.pdf',
  paperFileName: 'Group-2-_-Prelims-Exam-Question-Paper-2-2025.pdf'
};

const SHIFT_META = {
  id: 'appsc-group2-2025-paper2-shift-1',
  code: 'APPSC-G2-2025-P2',
  examType: 'APPSC Group II',
  examLevel: 'Group II',
  examLevelLabel: 'APPSC Group-II Paper-II (2025)',
  shiftNumber: 1,
  setNumber: 1,
  title: 'APPSC Group-2 Paper-2 (2025) – Full Official Paper',
  subtitle: '23 Feb 2025 · 150 Qs (Indian & AP Economy + Science & Technology)',
  examName: 'APPSC Group-2 Paper-2 (2025)',
  examYear: '2025',
  examDate: '23 Feb 2025',
  shiftTiming: 'Paper-II · 150 Mins',
  durationMinutes: 150,
  totalMarks: 150,
  negativeMarking: 0.33,
  totalQuestions: 150,
  questionsCount: 150,
  subjectCounts: {
    'General Knowledge': 75,
    'General Science': 75
  },
  pdfUrl: '/assets/aistudio/Group-2-_-Prelims-Exam-Question-Paper-2-2025_copy_f6e37955.pdf',
  pdfFileName: 'Group-2-_-Prelims-Exam-Question-Paper-2-2025.pdf',
  status: 'Published'
};

const LETTERS = ['A', 'B', 'C', 'D'];

// Raw question tuples: [qNo, section, subtopic, qEn, optsEn, qTe, optsTe, ansIdx, expEn, expTe]
const RAW_QUESTIONS = [
  // ================= SECTION A: INDIAN AND AP ECONOMY (Q1 - Q75) =================
  [
    1, 'economy', 'External Sector & BoP',
    'What was the primary reason for the current account surplus in Q4:2023-24 ?',
    ['Increase in merchandise exports', 'Surge in services exports', 'Decrease in imports', 'Higher remittances'],
    '2023-24 Q4 లో కరెంట్ అకౌంట్ ఖాతా మిగులుకు ప్రాథమిక కారణం ఏమిటి ?',
    ['సరుకుల ఎగుమతుల్లో పెరుగుదల', 'సేవల ఎగుమతుల్లో పెరుగుదల', 'దిగుమతుల్లో తగ్గుదల', 'అధిక చెల్లింపులు'],
    1,
    'India recorded a current account surplus in Q4 FY2023-24 primarily due to a surge in net services exports alongside lower merchandise trade deficit.',
    '2023-24 Q4 లో భారతదేశం కరెంట్ అకౌంట్ మిగులును సాధించడానికి ప్రధాన కారణం సేవల ఎగుమతులలో భారీ పెరుగుదల.'
  ],
  [
    2, 'economy', 'Foreign Exchange Market',
    'When currency is bought at a lower price at one place in the foreign exchange market and at the same time sold at a higher price at another place, this process is called',
    ['Arbitrage', 'Rationalization', 'Annuity', 'Semi Bombla'],
    'విదేశీ మారకపు విపణి (మార్కెట్)లో ఒకచోట తక్కువ ధరకు కరెన్సీని కొనుగోలు చేసి, అదే సమయంలో మరొక చోట ఎక్కువ ధరకు విక్రయించినప్పుడు దానిని ఈ ప్రక్రియ అంటారు.',
    ['మధ్యవర్తిత్వం (ఆర్బిట్రేజ్)', 'హేతుబద్ధీకరణ', 'వర్షాశనము (యాన్యుటీ)', 'సెమి బాంబ్లా'],
    0,
    'Arbitrage is the simultaneous purchase and sale of a currency in different markets to profit from price differentials.',
    'విదేశీ మారకపు మార్కెట్లలో ధర వ్యత్యాసాల నుండి లాభం పొందేందుకు ఒకే సమయంలో కొనుగోలు మరియు అమ్మకం చేయడాన్ని ఆర్బిట్రేజ్ అంటారు.'
  ],
  [
    3, 'economy', 'Monetary Policy & RBI',
    'Statement A : The RBI announced a temporary I-CRR of 10 per cent on 10 August 2023.\nStatement B : This action impounded about Rs. 1.1 lakh crores from the banking system.',
    ['Only statement A is correct', 'Only statement B is correct', 'Both statements A and B are correct', 'Both statements A and B are incorrect'],
    'వ్యాఖ్యానం A : RBI 10 ఆగస్టు 2023 న 10 శాతం తాత్కాలిక I-CRR ని ప్రకటించింది.\nవ్యాఖ్యానం B : ఈ చర్య బ్యాంకింగ్ వ్యవస్థ నుండి సుమారు ₹ 1.1 లక్ష కోట్లను స్వాధీనం చేసుకున్నది.',
    ['వ్యాఖ్యానం A మాత్రమే సరైనది', 'వ్యాఖ్యానం B మాత్రమే సరైనది', 'వ్యాఖ్యానాలు A మరియు B రెండూ సరైనవి', 'వ్యాఖ్యానాలు A మరియు B రెండూ సరైనవి కావు'],
    2,
    'On 10 August 2023, RBI introduced a temporary 10% Incremental Cash Reserve Ratio (I-CRR) on incremental NDTL, absorbing roughly Rs. 1.1 lakh crore of excess liquidity.',
    'ఆగస్టు 10, 2023న RBI ప్రకటించిన 10% తాత్కాలిక I-CRR ద్వారా బ్యాంకింగ్ వ్యవస్థ నుండి సుమారు ₹ 1.1 లక్ష కోట్ల అదనపు ద్రవ్యత్వం ఉపసంహరించబడింది.'
  ],
  [
    4, 'economy', 'Public Finance & Constitution',
    'Which Article of the Indian Constitution empowers the Central Government to extend loans to State Governments ?',
    ['Article 292', 'Article 293', 'Article 294', 'Article 295'],
    'కేంద్ర ప్రభుత్వానికి రాష్ట్ర ప్రభుత్వాలకు రుణాలు మంజూరు చేసే అధికారం భారత రాజ్యాంగంలోని ఏ అధికరణం ద్వారా ఉంది ?',
    ['ఆర్టికల్ 292', 'ఆర్టికల్ 293', 'ఆర్టికల్ 294', 'ఆర్టికల్ 295'],
    1,
    'Article 293(2) of the Constitution empowers the Government of India to make loans to any State or give guarantees in respect of State loans.',
    'భారత రాజ్యాంగంలోని ఆర్టికల్ 293(2) ప్రకారం కేంద్ర ప్రభుత్వం రాష్ట్రాలకు రుణాలు మంజూరు చేయవచ్చు.'
  ],
  [
    5, 'economy', 'AP Economy & Public Finance',
    'Statement A : In AP, capital expenditure constituted less than 15 per cent in the total Government expenditure during 2016-21.\nStatement B : Capital expenditure reflects the State\'s commitment towards infrastructure creation.',
    ['A is true, but B is false', 'A is false, but B is true', 'Both A and B are true', 'Both A and B are false'],
    'ప్రకటన A : ఆంధ్రప్రదేశ్‌లో 2016-21 మధ్య కాలంలో మొత్తం ప్రభుత్వ వ్యయంలో మూలధన వ్యయం వాటా 15 శాతం కంటే తక్కువగా ఉంది.\nప్రకటన B : మూలధన వ్యయం మౌలిక సదుపాయాల కల్పన పట్ల రాష్ట్ర నిబద్ధతను ప్రతిబింబిస్తుంది.',
    ['A నిజం, కానీ B తప్పు', 'A తప్పు, కానీ B నిజం', 'A మరియు B రెండూ నిజం', 'A మరియు B రెండూ తప్పు'],
    2,
    'During 2016–21, capital outlay remained below 15% of AP total expenditure; capital expenditure directly builds long-term infrastructure assets.',
    '2016-21 మధ్య AP మొత్తం ప్రభుత్వ వ్యయంలో మూలధన వ్యయం 15% కంటే తక్కువగా ఉంది మరియు ఇది మౌలిక సదుపాయాల కల్పనను సూచిస్తుంది.'
  ],
  [
    6, 'economy', 'AP Agriculture & Irrigation',
    'Which external funding agency is supporting the Andhra Pradesh Integrated Irrigation and Agriculture Transformation Project ?',
    ['IMF', 'World Bank', 'Asian Development Bank', 'European Commission'],
    'ఆంధ్రప్రదేశ్ ఇంటిగ్రేటెడ్ ఇరిగేషన్ మరియు వ్యవసాయ పరివర్తన ప్రాజెక్ట్‌కు మద్దతిచ్చే బాహ్య నిధుల ఏజెన్సీ పేరు',
    ['IMF', 'ప్రపంచ బ్యాంకు', 'ఆసియా అభివృద్ధి బ్యాంకు', 'యూరోపియన్ కమిషన్'],
    1,
    'The Andhra Pradesh Integrated Irrigation and Agriculture Transformation Project (APIIATP) is supported by the World Bank (IBRD).',
    'ఆంధ్రప్రదేశ్ ఇంటిగ్రేటెడ్ ఇరిగేషన్ మరియు వ్యవసాయ పరివర్తన ప్రాజెక్ట్‌కు ప్రపంచ బ్యాంకు ఆర్థిక సహాయం అందిస్తోంది.'
  ],
  [
    7, 'economy', 'Economic Policies',
    'Match List – I with List – II and choose correct answer.\nList – I\na. Monetary Policy\nb. Trade Policy\nc. Credit Policy\nd. Fiscal Policy\n\nList – II\ni. Tax Rate\nii. Margin\niii. Imports and Exports\niv. Bank Rate\n\nCodes (a b c d) :',
    ['iv  iii  ii  i', 'iv  ii  iii  i', 'iii  ii  i  iv', 'ii  i  iv  iii'],
    'జాబితా – I ని జాబితా – II తో జతపరచి సరైన సమాధానాన్ని ఎంచుకోండి.\nజాబితా – I\na. ద్రవ్య విధానం\nb. ట్రేడ్ పాలసీ\nc. క్రెడిట్ పాలసీ\nd. ఆర్థిక విధానం\n\nజాబితా – II\ni. పన్ను రేటు\nii. మార్జిన్\niii. దిగుమతులు మరియు ఎగుమతులు\niv. బ్యాంక్ రేట్\n\nకోడ్‌లు (a b c d) :',
    ['iv  iii  ii  i', 'iv  ii  iii  i', 'iii  ii  i  iv', 'ii  i  iv  iii'],
    0,
    'Monetary Policy deals with Bank Rate (iv), Trade Policy with Imports & Exports (iii), Credit Policy with Margin requirements (ii), and Fiscal Policy with Tax Rate (i).',
    'ద్రవ్య విధానం-బ్యాంక్ రేట్ (iv), ట్రేడ్ పాలసీ-దిగుమతులు & ఎగుమతులు (iii), క్రెడిట్ పాలసీ-మార్జిన్ (ii), ఆర్థిక విధానం-పన్ను రేటు (i).'
  ],
  [
    8, 'economy', 'Agriculture & Environment Economy',
    'Which of the following statements accurately describe the environmental impacts associated with agricultural practices ?\nI. The application of synthetic fertilizers and pesticides may result in soil and water contamination.\nII. Sustainable agriculture focuses on preserving soil health and protecting biodiversity.\nIII. Modern agricultural practices are unrelated to the depletion of freshwater resources.\nIV. Expanding monoculture farming supports overall ecosystem stability.',
    ['II and IV', 'III and IV', 'I and III', 'I and II'],
    'వ్యవసాయ పద్ధతులతో ముడిపడి ఉన్న పర్యావరణ ప్రభావాలను కింది వాటిలో ఏ ప్రకటనలు ఖచ్చితంగా వివరిస్తాయి ?\nI. సింథటిక్ ఎరువులు మరియు పురుగుమందుల వాడకం నేల మరియు నీరు కలుషితానికి దారితీయవచ్చు.\nII. సుస్థిర వ్యవసాయం నేల ఆరోగ్యాన్ని సంరక్షించడం మరియు జీవవైవిధ్యాన్ని రక్షించడంపై దృష్టి సారిస్తుంది.\nIII. ఆధునిక వ్యవసాయ పద్ధతులకు మంచినీటి వనరుల క్షీణతకు సంబంధం లేదు.\nIV. మోనోకల్చర్ వ్యవసాయాన్ని విస్తరించడం మొత్తం పర్యావరణ వ్యవస్థ స్థిరత్వానికి సహాయపడుతుంది.',
    ['II మరియు IV', 'III మరియు IV', 'I మరియు III', 'I మరియు II'],
    3,
    'Statements I and II are accurate. Intensive modern farming depletes groundwater, and monoculture reduces rather than supports ecosystem stability.',
    'ప్రకటనలు I మరియు II సరైనవి. ఆధునిక వ్యవసాయం భూగర్భ జలాలను క్షీణింపజేస్తుంది మరియు మోనోకల్చర్ జీవవైవిధ్యాన్ని తగ్గిస్తుంది.'
  ],
  [
    9, 'economy', 'Indian Economy & Growth',
    'Assertion (A) : The Indian economy demonstrated resilience despite global geopolitical challenges.\nReason (R) : India\'s fiscal and monetary policies ensured economic and financial stability post-COVID.',
    ['Both (A) and (R) are true and (R) is the correct explanation of (A)', 'Both (A) and (R) are true, but (R) is not the correct explanation of (A)', '(A) is true, but (R) is false', '(A) is false, but (R) is true'],
    'ప్రకటన (A) : ప్రపంచ భౌగోళిక రాజకీయ సవాళ్లు ఉన్నప్పటికీ భారత ఆర్థిక వ్యవస్థ స్థితిస్థాపకతను ప్రదర్శించింది.\nకారణం (R) : భారతదేశం యొక్క ఆర్థిక మరియు ద్రవ్య విధానాలు కోవిడ్ తర్వాత ఆర్థిక మరియు ద్రవ్య స్థిరత్వాన్ని నిర్ధారించాయి.',
    ['(A) మరియు (R) రెండూ సరైనవి మరియు (R) అనేది (A) యొక్క సరైన వివరణ', '(A) మరియు (R) రెండూ సరైనవి, కానీ (R) అనేది (A) యొక్క సరైన వివరణ కాదు', '(A) సరి, కానీ (R) తప్పు', '(A) తప్పు, కానీ (R) సరి'],
    0,
    'Prudent calibrated fiscal and monetary policy responses post-COVID anchored macroeconomic stability and resilience despite global headwinds.',
    'కోవిడ్ తర్వాత సమర్థవంతమైన ఆర్థిక మరియు ద్రవ్య విధానాలు భారత ఆర్థిక వ్యవస్థ స్థితిస్థాపకతకు మరియు స్థిరత్వానికి కారణమయ్యాయి.'
  ],
  [
    10, 'economy', 'International Institutions',
    'Special Drawing Rights is the currency of International Monetary Fund. This is in the form of',
    ['Paper currency', 'Gold', 'Silver and gold both', 'Book keeping entry only'],
    'స్పెషల్ డ్రాయింగ్ రైట్స్ (Special Drawing Rights) అంటే అంతర్జాతీయ ద్రవ్య నిధి (IMF) యొక్క ద్రవ్యం (కరెన్సీ). ఇది ఏ రూపంలో ఉంటుంది ?',
    ['కాగితపు కరెన్సీ', 'బంగారం', 'వెండి, బంగారం రెండూ', 'చిట్టా పద్దుల నమోదు (బుక్ కీపింగ్ ఎంట్రీ) మాత్రమే'],
    3,
    'SDRs are supplementary international reserve assets created by the IMF and exist purely as book-keeping entries ("paper gold") without physical notes.',
    'SDR అనేది భౌతిక కరెన్సీ కాదు; ఇది IMF ఖాతాలలో చిట్టా పద్దుల నమోదు (బుక్ కీపింగ్ ఎంట్రీ) రూపంలో ఉండే రిజర్వ్ ఆస్తి.'
  ],
  [
    11, 'economy', 'Indian Economy Indices',
    'India\'s rank in World Bank\'s Logistic Performance Index in 2023',
    ['15', '27', '38', '49'],
    '2023 లో ప్రపంచ బ్యాంక్ సరుకు రవాణా పనితీరు సూచీ (లాజిస్టిక్ పెర్ఫార్మెన్స్ ఇండెక్స్) లో భారతదేశం ర్యాంక్',
    ['15', '27', '38', '49'],
    2,
    'India improved six places to rank 38th out of 139 countries in the World Bank\'s Logistics Performance Index (LPI) 2023.',
    '2023 ప్రపంచ బ్యాంక్ లాజిస్టిక్ పెర్ఫార్మెన్స్ ఇండెక్స్ (LPI)లో భారతదేశం 38వ ర్యాంక్ సాధించింది.'
  ],
  [
    12, 'economy', 'National Income Accounting',
    'Assertion (A): Transfer earnings are not to be included in the estimation of National Income.\nReason (R) : Transfer earnings are not payments for factor services.',
    ['Both (A) and (R) are correct and (R) is the correct explanation of (A)', 'Both (A) and (R) are correct and (R) is not the correct explanation of (A)', '(A) is correct, but (R) is not correct', '(R) is correct, but (A) is not correct'],
    'వాదన (A) : జాతీయ ఆదాయం అంచనాలో బదిలీ ఆదాయాలు చేర్చబడవు.\nకారణం (R) : బదిలీ ఆదాయాలు ఫ్యాక్టర్ సేవలకు చెల్లింపులు కావు.',
    ['(A) మరియు (R) రెండూ సరైనవి మరియు (R) అనేది (A) యొక్క సరైన వివరణ', '(A) మరియు (R) రెండూ సరైనవి మరియు (R), (A) యొక్క సరైన వివరణ కాదు', '(A) సరైనది, కానీ (R) సరైనది కాదు', '(R) సరైనది, కానీ (A) సరైనది కాదు'],
    0,
    'Transfer payments (pensions, scholarships, subsidies) involve no corresponding production of goods or factor services, hence are excluded from National Income.',
    'బదిలీ ఆదాయాలు ఉత్పాదక కారక సేవలకు ప్రతిఫలం కానందున వాటిని జాతీయ ఆదాయంలో చేర్చరు.'
  ],
  [
    13, 'economy', 'International Trade',
    'The situation where a country simultaneously imports and exports the same product is called',
    ['International reciprocal trade', 'Internal reciprocal trade', 'Factor reversal trade', 'Intra-industry trade'],
    'ఒక దేశం ఏకకాలంలో ఒకే ఉత్పత్తిని దిగుమతి చేసుకునే మరియు ఎగుమతి చేసే పరిస్థితిని ఈ క్రింది వాటిలో దేన్ని అంటారు ?',
    ['అంతర్జాతీయ పరస్పర వాణిజ్యం', 'అంతర్గత పరస్పర వాణిజ్యం', 'ఫ్యాక్టర్ రివర్సల్ ట్రేడ్', 'ఇంట్రా-ఇండస్ట్రీ ట్రేడ్'],
    3,
    'Intra-industry trade occurs when a country simultaneously exports and imports goods belonging to the same industry category (e.g., automobiles).',
    'ఒక దేశం ఒకే పరిశ్రమ వర్గానికి చెందిన వస్తువులను ఏకకాలంలో ఎగుమతి మరియు దిగుమతి చేయడాన్ని ఇంట్రా-ఇండస్ట్రీ ట్రేడ్ అంటారు.'
  ],
  [
    14, 'economy', 'Taxation & GST',
    'Which of the following statement(s) is/are incorrect regarding the GST Council (GSTC) ?\nI. The GST Council is a constitutional body established under Article 269A of the Indian Constitution.\nII. The GST Council is responsible for making recommendations on issues related to the Goods and Services Tax.\nIII. Every state does not have an equal vote in the GST Council.\nIV. Decisions of the GST Council require a three-fourths majority of the weighted votes of the members present and voting.',
    ['I and IV', 'II and III', 'I and III', 'Only IV'],
    'GST కౌన్సిల్ (GSTC) కి సంబంధించి కింది స్టేట్‌మెంట్లలో ఏది/ఏవి తప్పు ?\nI. GST కౌన్సిల్ అనేది భారత రాజ్యాంగంలోని ఆర్టికల్ 269A ప్రకారం స్థాపించబడిన ఒక రాజ్యాంగ సంస్థ.\nII. GST కౌన్సిల్ బాధ్యత వస్తువులు మరియు సేవల పన్నుకు సంబంధించిన సమస్యలపై సిఫార్సులు చేయడం.\nIII. GST కౌన్సిల్‌లో ప్రతి రాష్ట్రానికి సమాన ఓటు ఉండదు.\nIV. GST కౌన్సిల్ యొక్క నిర్ణయాలకు హాజరైన మరియు ఓటింగ్ చేస్తున్న సభ్యుల వెయిటెడ్ ఓట్లలో నాలుగింట మూడు వంతుల మెజారిటీ అవసరం.',
    ['I మరియు IV', 'II మరియు III', 'I మరియు III', 'IV మాత్రమే'],
    2,
    'GST Council is constituted under Article 279A (not 269A), and every State has an equal single vote within the States\' two-thirds voting weightage. Thus I and III are incorrect.',
    'GST కౌన్సిల్ ఆర్టికల్ 279A ప్రకారం ఏర్పాటైంది (269A కాదు) మరియు ప్రతి రాష్ట్రానికి సమాన ఓటు ఉంటుంది. కనుక I మరియు III తప్పు.'
  ],
  [
    15, 'economy', 'Foreign Trade & RBI',
    'What is the significance of the new payment settlement framework introduced by the RBI in the context of the Foreign Trade Policy 2023 ?',
    ['It discourages the use of the Indian currency in cross-border trade', 'It aims to encourage the use of the Indian currency in cross-border trade', 'It eliminates the need for foreign exchange reserves', 'It increases transaction costs for exporters'],
    'విదేశీ వాణిజ్య విధానం 2023 సందర్భంలో RBI ప్రవేశపెట్టిన కొత్త చెల్లింపు పరిష్కార నిర్మాణం (సెటిల్‌మెంట్ ఫ్రేమ్‌వర్క్) యొక్క ప్రాముఖ్యత ఏమిటి ?',
    ['ఇది సరిహద్దు వాణిజ్యంలో భారతీయ కరెన్సీని (ద్రవ్యం/డబ్బు) ఉపయోగించడాన్ని నిరుత్సాహపరుస్తుంది', 'సరిహద్దు వాణిజ్యంలో భారతీయ కరెన్సీని ఉపయోగించడాన్ని ప్రోత్సహించడం దీని లక్ష్యం', 'ఇది విదేశీ మారక నిల్వల అవసరాన్ని తొలగిస్తుంది', 'ఇది ఎగుమతిదారులకు లావాదేవీ ఖర్చులను పెంచుతుంది'],
    1,
    'The RBI\'s rupee trade settlement mechanism under FTP 2023 promotes invoicing, payment, and settlement of international trade in Indian Rupees (INR).',
    'విదేశీ వాణిజ్య విధానం 2023 ప్రకారం సరిహద్దు వాణిజ్యంలో భారతీయ రూపాయి వినియోగాన్ని ప్రోత్సహించడం ఈ కొత్త చెల్లింపు విధానం యొక్క ప్రధాన ఉద్దేశ్యం.'
  ],
  [
    16, 'economy', 'Agriculture Economy',
    'Statement A : India is the largest producer of milk.\nStatement B : India is the second largest producer of fruits, vegetables and sugar.',
    ['Only statement A is correct', 'Only statement B is correct', 'Both statements A and B are correct', 'Both statements A and B are incorrect'],
    'వ్యాఖ్యానం A : భారతదేశం అతిపెద్ద పాల ఉత్పత్తిదారు.\nవ్యాఖ్యానం B : భారతదేశం రెండవ అతి పెద్ద పండ్లు, కూరగాయలు మరియు చక్కెర ఉత్పత్తిదారు.',
    ['వ్యాఖ్యానం A మాత్రమే సరైనది', 'వ్యాఖ్యానం B మాత్రమే సరైనది', 'రెండు వ్యాఖ్యానాలు A మరియు B సరైనవి', 'రెండు వ్యాఖ్యానాలు A మరియు B సరైనవి కావు'],
    2,
    'According to Economic Survey / FAO data referenced in 2023-24, India ranks 1st globally in milk production and 2nd in fruits, vegetables, and sugar production.',
    'భారతదేశం ప్రపంచంలోనే అతిపెద్ద పాల ఉత్పత్తిదారుగా ప్రథమ స్థానంలో మరియు పండ్లు, కూరగాయలు, చక్కెర ఉత్పత్తిలో ద్వితీయ స్థానంలో ఉంది.'
  ],
  [
    17, 'economy', 'Energy & External Sector',
    'What challenges does India face in managing its oil consumption ?',
    ['Lack of domestic energy demand', 'Consistent global oil prices', 'Supply chain disruptions and fluctuating global oil prices', 'Abundant oil reserves'],
    'చమురు వినియోగాన్ని నిర్వహించడంలో భారతదేశం ఎలాంటి సవాళ్లను ఎదుర్కొంటుంది ?',
    ['దేశీయ ఇంధన డిమాండ్ లేకపోవడం', 'స్థిరమైన అంతర్జాతీయ చమురు ధరలు', 'సరఫరా గొలుసు (సప్లై చైన్) అంతరాయాలు మరియు అంతర్జాతీయ చమురు ధరల హెచ్చుతగ్గులు', 'పుష్కలంగా చమురు నిల్వలు'],
    2,
    'As a major net importer of crude oil (>85% import dependence), India faces vulnerability to global oil price volatility and geopolitical supply chain disruptions.',
    'ముడి చమురు దిగుమతులపై ఎక్కువగా ఆధారపడే భారతదేశం సరఫరా గొలుసు అంతరాయాలు మరియు అంతర్జాతీయ ధరల హెచ్చుతగ్గుల సవాళ్లను ఎదుర్కొంటుంది.'
  ],
  [
    18, 'economy', 'National Income & Inflation',
    'What impact does an increase in the GNP deflator have on the purchasing power of money ?',
    ['Increases purchasing power', 'Decreases purchasing power', 'No impact on purchasing power', 'Enhances the value of currency'],
    'GNP డిఫ్లేటర్ పెరుగుదల డబ్బు కొనుగోలు శక్తిపై ఎలాంటి ప్రభావం చూపుతుంది ?',
    ['కొనుగోలు శక్తిని పెంచుతుంది', 'కొనుగోలు శక్తిని తగ్గిస్తుంది', 'కొనుగోలు శక్తిపై ప్రభావం ఉండదు', 'కరెన్సీ విలువను పెంచుతుంది'],
    1,
    'An increase in the GNP deflator reflects an overall rise in the general price level (inflation), which erodes the purchasing power of money.',
    'GNP డిఫ్లేటర్ పెరుగుదల సాధారణ ధరల స్థాయి (ద్రవ్యోల్బణం) పెరుగుదలను సూచిస్తుంది, తద్వారా డబ్బు కొనుగోలు శక్తి తగ్గుతుంది.'
  ],
  [
    19, 'economy', 'AP Industrial Corridors',
    'In the Union Budget 2024-25, the GOI has promised funds to the following industrial nodes as part of the development of the Vishakhapatnam-Chennai and Bangalore-Hyderabad industrial corridors',
    ['Kopparthi and Orvakal', 'Chittoor and Donakonda', 'Orvakal and Donakonda', 'Kopparthi and Chittoor'],
    'కేంద్ర బడ్జెట్ 2024-25 లో, విశాఖపట్నం-చెన్నై మరియు బెంగళూరు-హైదరాబాద్ పారిశ్రామిక నడవాల (కారిడార్ల) అభివృద్ధిలో భాగమైన ఏ పారిశ్రామిక వాడలకు, భారత ప్రభుత్వం ఆర్థిక సహాయం అందిస్తుంది ?',
    ['కొప్పర్తి మరియు ఓర్వకల్', 'చిత్తూరు మరియు దొనకొండ', 'ఓర్వకల్ మరియు దొనకొండ', 'కొప్పర్తి మరియు చిత్తూరు'],
    0,
    'Union Budget 2024-25 committed central support for developing the Kopparthi node (VCIC) in Kadapa and Orvakal node (HBIC) in Kurnool.',
    'కేంద్ర బడ్జెట్ 2024-25లో VCICలోని కొప్పర్తి మరియు HBICలోని ఓర్వకల్ పారిశ్రామిక వాడలకు ఆర్థిక సహాయం ప్రకటించారు.'
  ],
  [
    20, 'economy', 'Government Schemes & Budget',
    'Which of the following statements are correct regarding PURVODAYA scheme introduced by the Government of India in 2024 ?\nI. The PURVODAYA scheme aims to improve infrastructure in the eastern part of India.\nII. It deals with Buxar-Bhagalpur Expressway.\nIII. New Delhi-Kolkata Industrial Corridor is being developed as part of the PURVODAYA scheme.\nIV. The primary goal of this scheme is the development of Gujarat State.',
    ['I, II only', 'I, II, III only', 'II, III, IV only', 'I, II, III, IV'],
    '2024 లో భారత ప్రభుత్వం ప్రవేశపెట్టిన పూర్వోదయ పథకానికి సంబంధించిన క్రింది ప్రకటనలలో సరియైనవి ఏవి ?\nI. పూర్వోదయ పథకం భారతదేశంలోని తూర్పు ప్రాంతంలో మౌలిక సదుపాయాలను మెరుగుపరచడం లక్ష్యంగా పెట్టుకుంది.\nII. ఇది బక్సర్-భాగల్పూర్ ఎక్స్‌ప్రెస్‌వేకు సంబంధించింది.\nIII. న్యూఢిల్లీ-కోల్‌కతా పారిశ్రామిక కారిడార్ అభివృద్ధి పూర్వోదయ పథకంలో భాగం.\nIV. గుజరాత్ రాష్ట్రం అభివృద్ధి దీని ప్రధాన లక్ష్యం.',
    ['I, II మాత్రమే', 'I, II, III మాత్రమే', 'II, III, IV మాత్రమే', 'I, II, III, IV'],
    0,
    'Purvodaya covers eastern states (Bihar, Jharkhand, West Bengal, Odisha, AP) including Buxar-Bhagalpur Expressway and the Amritsar-Kolkata Industrial Corridor (not New Delhi-Kolkata or Gujarat).',
    'పూర్వోదయ పథకం తూర్పు భారతదేశ మౌలిక సదుపాయాల అభివృద్ధి మరియు బక్సర్-భాగల్పూర్ ఎక్స్‌ప్రెస్‌వేకు సంబంధించింది. అందువల్ల I మరియు II మాత్రమే సరైనవి.'
  ],
  [
    21, 'economy', 'Monetary Policy & RBI',
    'What was the purpose of the 49 fine-tuning operations conducted by the RBI during FY 2024 ?',
    ['To tighten liquidity conditions', 'To ease liquidity conditions', 'To maintain liquidity conditions in alignment with the monetary policy stance', 'To increase the money supply'],
    'FY 2024 లో RBI చే నిర్వహించబడిన 49 ఫైన్ ట్యూనింగ్ ఆపరేషన్ల ఉద్దేశ్యం ఏమిటి ?',
    ['ద్రవ్యత్వ పరిస్థితులను కఠినతరం చేయడానికి', 'ద్రవ్యత్వ పరిస్థితులను సులభతరం చేయడానికి', 'ద్రవ్యత్వ విధాన వైఖరికి అనుగుణంగా ద్రవ్యత్వ పరిస్థితులను నిర్వహించడానికి', 'డబ్బు సరఫరాను పెంచడానికి'],
    2,
    'The 49 fine-tuning VRR/VRRR operations in FY24 were undertaken by RBI to keep systemic liquidity aligned with its monetary policy stance.',
    'FY 2024 లో RBI నిర్వహించిన 49 ఫైన్ ట్యూనింగ్ ఆపరేషన్లు ద్రవ్య విధాన వైఖరికి అనుగుణంగా ద్రవ్యత్వాన్ని నిర్వహించడానికి ఉద్దేశించినవి.'
  ],
  [
    22, 'economy', 'Foreign Exchange Reserves',
    'Which of the following are included in the Reserve Bank of India\'s Foreign Exchange Reserves (FER) ?\na. Foreign Currency Assets (FCA)   b. Gold\nc. Special Drawing Rights (SDR)   d. Reserve Tranche Position',
    ['a and b only', 'b, c and d only', 'a, b and c only', 'All the above'],
    'రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా విదేశీ మారక ద్రవ్య నిల్వలలో (ఫారిన్ ఎక్స్ఛేంజ్ రిజర్వ్) (FER) కింది వాటిలో ఏవి చేర్చబడ్డాయి ?\na. విదేశీ కరెన్సీ ఆస్తులు (FCA)   b. బంగారం\nc. ప్రత్యేక డ్రాయింగు హక్కులు (SDR)   d. రిజర్వ్ ట్రాంచ్ స్థానం',
    ['a మరియు b మాత్రమే', 'b, c మరియు d మాత్రమే', 'a, b మరియు c మాత్రమే', 'పైవన్నీ'],
    3,
    'India\'s Foreign Exchange Reserves comprise four components: Foreign Currency Assets (FCA), Gold, Special Drawing Rights (SDRs), and Reserve Tranche Position (RTP) with the IMF.',
    'భారతదేశ విదేశీ మారక నిల్వలలో విదేశీ కరెన్సీ ఆస్తులు (FCA), బంగారం, SDRలు మరియు IMF వద్ద ఉన్న రిజర్వ్ ట్రాంచ్ స్థానం అన్నీ ఉంటాయి.'
  ],
  [
    23, 'economy', 'Poverty & Human Development',
    'Which Indian organization is responsible for estimating the National Multidimensional Poverty Index (MPI) ?',
    ['Planning Commission', 'NITI Aayog', 'Reserve Bank of India', 'Ministry of Finance'],
    'నేషనల్ మల్టీడైమెన్షనల్ పావర్టీ ఇండెక్స్ (MPI)ని అంచనా వేయడానికి ఏ భారతీయ సంస్థ బాధ్యతవహిస్తుంది ?',
    ['ప్రణాళిక సంఘం', 'NITI ఆయోగ్', 'రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా', 'ఆర్థిక మంత్రిత్వ శాఖ'],
    1,
    'NITI Aayog is the nodal agency responsible for compiling and publishing the National Multidimensional Poverty Index (MPI) in India.',
    'భారతదేశంలో జాతీయ మల్టీడైమెన్షనల్ పావర్టీ ఇండెక్స్ (MPI)ను NITI ఆయోగ్ విడుదల చేస్తుంది.'
  ],
  [
    24, 'economy', 'Economic Reforms 1991',
    'The severe balance of payments crisis, faced by India in 1991 was characterized by',
    ['High inflation, low foreign exchange reserves and a large fiscal deficit', 'Rapid industrial growth, increased foreign exchange reserves and a trade surplus', 'Low inflation, high foreign exchange reserves and a balanced fiscal budget', 'Strong foreign investment inflows, low inflation and fiscal deficit'],
    '1991లో, భారతదేశం ఎదుర్కొన్న తీవ్రమైన బ్యాలెన్స్ ఆఫ్ పేమెంట్స్ సంక్షోభం క్రింది విధంగా వ్యక్తమైంది.',
    ['అధిక ద్రవ్యోల్బణం, తక్కువ విదేశీ మారక నిల్వలు మరియు పెద్ద ద్రవ్య లోటు', 'వేగవంతమైన పారిశ్రామిక వృద్ధి, పెరిగిన విదేశీ మారక నిల్వలు మరియు వాణిజ్య మిగులు', 'తక్కువ ద్రవ్యోల్బణం, అధిక విదేశీ మారక నిల్వలు మరియు సమతుల్య ఆర్థిక బడ్జెట్', 'బలమైన విదేశీ పెట్టుబడుల ప్రవాహం, తక్కువ ద్రవ్యోల్బణం మరియు ఆర్థిక లోటు'],
    0,
    'The 1991 BoP crisis saw forex reserves drop to less than 2 weeks of imports alongside double-digit inflation and a high fiscal deficit (~8.4% of GDP).',
    '1991 చెల్లింపుల సంక్షోభం సమయంలో భారతదేశం అధిక ద్రవ్యోల్బణం, అతి తక్కువ విదేశీ మారక నిల్వలు మరియు పెద్ద ద్రవ్య లోటును ఎదుర్కొంది.'
  ],
  [
    25, 'economy', 'Industrial Policy 1991',
    'Under the Industrial Policy of 1991',
    ['The mandatory convertible clause is applicable to all term loans', 'The mandatory convertible clause is applicable to term loans of more than 10 years', 'The mandatory convertible clause is applicable to term loans of less than 10 years', 'The mandatory convertible clause is no longer applicable'],
    '1991 పారిశ్రామిక విధానం ప్రకారం',
    ['తప్పనిసరి కన్వర్టిబుల్ నిబంధన అన్ని టర్మ్ లోన్లకు వర్తిస్తుంది', 'తప్పనిసరి కన్వర్టిబుల్ నిబంధన 10 సంవత్సరాల కంటే ఎక్కువ టర్మ్ లోన్లకు వర్తిస్తుంది', 'తప్పనిసరి కన్వర్టిబుల్ నిబంధన 10 సంవత్సరాల కంటే తక్కువ టర్మ్ లోన్లకు వర్తిస్తుంది', 'తప్పనిసరి కన్వర్టిబుల్ నిబంధన ఇకపై వర్తించదు'],
    3,
    'Under the New Industrial Policy of 1991, financial institutions removed the mandatory convertibility clause requiring conversion of term loans into equity.',
    '1991 పారిశ్రామిక విధానం ప్రకారం ఆర్థిక సంస్థల రుణాలను ఈక్విటీగా మార్చే తప్పనిసరి కన్వర్టిబుల్ నిబంధన రద్దు చేయబడింది.'
  ],
  [
    26, 'economy', 'Government Schemes & Food Security',
    'At what subsidized price per Kg did the Government introduce “Bharat Rice” for selling through NAFED, NCCF and Kendriya Bhandar ?',
    ['Rs. 2', 'Rs. 29', 'Re. 1', 'Rs. 12'],
    'NAFED, NCCF మరియు కేంద్రీయ భండార్ ద్వారా విక్రయించడానికి ప్రభుత్వం \'భారత్ రైస్\' ని కిలోకి ఏ సబ్సిడీ ధరతో ప్రవేశపెట్టింది ?',
    ['Rs. 2', 'Rs. 29', 'Re. 1', 'Rs. 12'],
    1,
    'In February 2024, the Union Government launched subsidized Bharat Rice at Rs. 29 per kg through NAFED, NCCF, and Kendriya Bhandar to tame food inflation.',
    'కేంద్ర ప్రభుత్వం 2024లో NAFED, NCCF మరియు కేంద్రీయ భండార్ ద్వారా కిలో రూ. 29 ధరకు భారత్ రైస్‌ను అందుబాటులోకి తెచ్చింది.'
  ],
  [
    27, 'economy', 'Agriculture & Allied Economy',
    'Which organization launched the Credit Guarantee Scheme for the Livestock Sector ?',
    ['Ministry of Finance', 'NABARD', 'RBI', 'Department of Animal Husbandry and Dairying'],
    'పశువుల రంగానికి క్రెడిట్ గ్యారెంటీ పథకాన్ని ఏ సంస్థ ప్రవేశపెట్టింది ?',
    ['ఆర్థిక మంత్రిత్వ శాఖ', 'నాబార్డ్', 'RBI', 'పశు సంవర్ధక మరియు పాడిపరిశ్రమ శాఖ'],
    3,
    'The Department of Animal Husbandry and Dairying (DAHD) launched the first-ever Credit Guarantee Scheme under the Animal Husbandry Infrastructure Development Fund (AHIDF).',
    'పశు సంవర్ధక మరియు పాడిపరిశ్రమ శాఖ (DAHD) పశువుల రంగానికి క్రెడిట్ గ్యారెంటీ పథకాన్ని ప్రారంభించింది.'
  ],
  [
    28, 'economy', 'Government Schemes',
    'Which initiative was launched to provide a tap water connection to every rural household by 2024 ?',
    ['Jal Jeevan Mission (JJM)', 'Swachh Bharat Mission (SBM)', 'PM Poshan', 'AMRUT'],
    'ప్రతి గ్రామీణ ఇంటికి 2024 నాటికి కుళాయి నీటి కనెక్షన్ అందించడానికి ఏ కార్యక్రమం ప్రారంభించబడింది ?',
    ['జల జీవన్ మిషన్ (JJM)', 'స్వచ్ఛ భారత్ మిషన్ (SBM)', 'PM పోషణ్', 'AMRUT (అమృత్)'],
    0,
    'Jal Jeevan Mission (Har Ghar Jal), launched in August 2019, aimed to provide Functional Household Tap Connections (FHTCs) to every rural household by 2024.',
    '2024 నాటికి ప్రతి గ్రామీణ ఇంటికి కుళాయి ద్వారా తాగునీరు అందించడానికి జల జీవన్ మిషన్ (JJM) ప్రారంభించబడింది.'
  ],
  [
    29, 'economy', 'Economic Reforms',
    'Post-economic reforms, the Indian economy saw a shift towards',
    ['Increased government control', 'Reduced foreign trade', 'Enhanced global integration', 'Decline in private sector growth'],
    'ఆర్థిక సంస్కరణల అనంతర కాలంలో, భారత ఆర్థిక వ్యవస్థ క్రింది వైపుకు మళ్ళింది',
    ['ప్రభుత్వ నియంత్రణ పెరిగింది', 'విదేశీ వాణిజ్యం తగ్గింది', 'మెరుగైన ప్రపంచీకరణ (గ్లోబల్ ఇంటిగ్రేషన్)', 'ప్రైవేట్‌రంగ వృద్ధిలో క్షీణత'],
    2,
    'The 1991 LPG reforms opened India\'s economy, dismantling trade barriers, welcoming FDI, and accelerating global economic integration.',
    '1991 ఆర్థిక సంస్కరణల తర్వాత భారతదేశం ప్రపంచ ఆర్థిక వ్యవస్థతో మరింత బలంగా అనుసంధానించబడింది.'
  ],
  [
    30, 'economy', 'Indian Economy & Growth',
    'Assertion (A) : India\'s real Gross Domestic Product (GDP) grew by 8.2% in FY24 despite global and external challenges.\nReason (R) : The focus on maintaining macroeconomic stability ensured that these challenges had minimal impact on India\'s economy.',
    ['Both (A) and (R) are true and (R) is the correct explanation of (A)', 'Both (A) and (R) are true, but (R) is not the correct explanation of (A)', '(A) is true, but (R) is false', '(A) is false, but (R) is true'],
    'ప్రకటన (A) : ప్రపంచ మరియు బాహ్య సవాళ్లు ఉన్నప్పటికీ FY24 లో భారతదేశ వాస్తవ GDP 8.2% పెరిగింది.\nకారణం (R) : స్థూల ఆర్థిక స్థిరత్వాన్ని కొనసాగించడం పై దృష్టి కేంద్రీకరించడం వల్ల ఈ సవాళ్లు భారత ఆర్థిక వ్యవస్థపై తక్కువ ప్రభావాన్ని చూపాయి.',
    ['(A) మరియు (R) రెండూ నిజం మరియు (A) కు (R) సరైన వివరణ', '(A) మరియు (R) రెండూ నిజం, కానీ (A) కు (R) సరైన వివరణ కాదు', '(A) నిజం, కానీ (R) తప్పు', '(A) తప్పు, కానీ (R) నిజం'],
    0,
    'As noted in the Economic Survey 2023-24, India\'s real GDP grew 8.2% in FY24 largely because calibrated policy focus on macroeconomic stability cushioned external shocks.',
    'స్థూల ఆర్థిక స్థిరత్వంపై దృష్టి పెట్టడం వల్ల ప్రపంచ సవాళ్లు ఉన్నప్పటికీ FY24 లో భారతదేశ వాస్తవ GDP 8.2% వృద్ధిని సాధించింది.'
  ],
  [
    31, 'economy', 'Macroeconomics & Inflation',
    'Which of the following factors could potentially contribute to stagflation in the Indian economy ?\na. High inflationary pressures due to increased Government spending.\nb. Decline in industrial production and sluggish economic growth.\nc. Decrease in aggregate demand and consumer spending.\nd. Appreciation of the domestic currency leading to reduction of export competitiveness.',
    ['a and b only', 'b and c only', 'a, c and d only', 'All the above'],
    'క్రింది వాటిలో ఏ కారకాలు భారత ఆర్థిక వ్యవస్థలో స్తబ్దతకు (స్టాగ్‌ఫ్లేషన్) దోహదం చేయగలవు ?\na. పెరిగిన ప్రభుత్వ వ్యయం కారణంగా అధిక ద్రవ్యోల్బణ ఒత్తిడి.\nb. పారిశ్రామిక ఉత్పత్తిలో క్షీణత మరియు మందగించిన ఆర్థిక వృద్ధి.\nc. మొత్తం డిమాండ్ మరియు వినియోగదారుల వ్యయంలో తగ్గుదల.\nd. ఎగుమతి పోటీతత్వాన్ని తగ్గించడానికి దారితీసిన దేశీయ కరెన్సీ విలువ పెరుగుదల.',
    ['a మరియు b మాత్రమే', 'b మరియు c మాత్రమే', 'a, c మరియు d మాత్రమే', 'పైవన్నీ'],
    0,
    'Stagflation is the simultaneous occurrence of high inflation (a) and economic stagnation/declining output (b).',
    'అధిక ద్రవ్యోల్బణం (a) మరియు మందగించిన ఆర్థిక వృద్ధి/పారిశ్రామిక ఉత్పత్తి క్షీణత (b) కలయికను స్టాగ్‌ఫ్లేషన్ అంటారు.'
  ],
  [
    32, 'economy', 'Financial Markets & RBI',
    'Which of the following statements is/are correct about Foreign Portfolio Investments (FPI) in 2024-25 ?\nI. The Indian Rupee (INR) moved in a narrow range with low volatility despite FPI outflows.\nII. RBI set investment limits for FPIs in debt instruments and Credit Default Swaps.\nIII. FPI investment limits in government securities and corporate bonds remained unchanged.\nIV. RBI issued an operation framework for reclassification of FPI investments beyond permitted limits.',
    ['I and II only', 'III and IV only', 'All the above', 'None of the above'],
    '2024-25 లో విదేశీ పోర్ట్‌ఫోలియో ఇన్వెస్ట్‌మెంట్ (FPI) గురించి క్రింది ప్రకటనలలో ఏది(వి) సరైనది(వి) ?\nI. FPI బాహ్య తరలింపులు (అవుట్‌ఫ్లోలు) ఉన్నప్పటికీ భారత రూపాయి (INR) తక్కువ అస్థిరతతో ఇరుకైన శ్రేణిలో కదిలింది.\nII. రుణ సాధనాలు మరియు రుణ చెల్లింపు బదిలీ (క్రెడిట్ డిఫాల్ట్ స్వాప్)లలో FPIల కోసం పెట్టుబడి పరిమితులను RBI నిర్ణయించింది.\nIII. ప్రభుత్వ సెక్యూరిటీలలో మరియు కార్పొరేట్ బాండ్లలో FPI పెట్టుబడి పరిమితులు మారలేదు.\nIV. అనుమతించిన పరిమితులకు మించిన FPI పెట్టుబడులను తిరిగి వర్గీకరించడానికి RBI ఒక కార్యాచరణ వ్యూహం (ఆపరేషన్ ఫ్రేమ్ వర్క్)ను జారీ చేసింది.',
    ['I మరియు II మాత్రమే', 'III మరియు IV మాత్రమే', 'పైవన్నీ', 'పైవేవీ కాదు'],
    2,
    'All four statements align with RBI notifications and Economic Survey observations regarding FPI norms, G-Sec/corporate bond VRR limits, and reclassification operational framework in 2024-25.',
    '2024-25లో FPI నిబంధనలు, INR స్థిరత్వం, రుణ పరిమితులు మరియు RBI పునర్వర్గీకరణ కార్యాచరణపై నాలుగు ప్రకటనలూ సరైనవి.'
  ],
  [
    33, 'economy', 'AP Economy & GVA',
    'Match the sectors given in Column – A with their corresponding Gross Value Added (GVA) Growth Rates given in Column – B (Andhra Pradesh Advance Estimates of 2023-24).\nColumn – A\na. Agriculture and allied activities\nb. Industry\nc. Services\n\nColumn – B\nA. 5.21%\nB. 8.02%\nC. 1.69%\n\nCodes (a b c) :',
    ['C  B  A', 'A  B  C', 'B  A  C', 'C  A  B'],
    'ఎడమ కాలంలోని సెక్టార్లను, కుడి కాలమ్‌లో వాటి సంబంధిత (ఆంధ్రప్రదేశ్ 2023-24 ముందస్తు అంచనాల ప్రకారం) GVA వృద్ధి రేట్లతో సరిపోల్చండి.\nకాలం – A\na. వ్యవసాయం మరియు అనుబంధ కార్యకలాపాలు\nb. పరిశ్రమ\nc. సేవల రంగం\n\nకాలం – B\nA. 5.21%\nB. 8.02%\nC. 1.69%\n\nకోడ్‌లు (a b c) :',
    ['C  B  A', 'A  B  C', 'B  A  C', 'C  A  B'],
    0,
    'Per AP Advance Estimates 2023-24 (constant prices): Agriculture & allied grew 1.69% (C), Industry grew 8.02% (B), and Services grew 5.21% (A).',
    'ఆంధ్రప్రదేశ్ 2023-24 ముందస్తు అంచనాల ప్రకారం వ్యవసాయం-1.69% (C), పరిశ్రమ-8.02% (B), సేవల రంగం-5.21% (A).'
  ],
  [
    34, 'economy', 'Monetary Policy & Exchange Rate',
    'Which of the following mechanisms is NOT primarily followed by the Reserve Bank of India (RBI) to manage exchange rate volatility ?',
    ['Fiscal Policy Adjustments', 'Foreign Exchange Reserves', 'Market Intervention', 'Liberalized Exchange Rate Management System'],
    'క్రింది విధానాలలో మార్పిడి రేటు అస్థిరతను నిర్వహించడానికి రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా (RBI) ప్రధానంగా దేనిని అనుసరించదు ?',
    ['ఆర్థిక విధాన సర్దుబాట్లు', 'విదేశీ మారక నిల్వలు', 'మార్కెట్ జోక్యం', 'సరళీకృత మారకపు రేటు నిర్వహణ పద్ధతి'],
    0,
    'Fiscal Policy Adjustments are the domain of the Central Government (Ministry of Finance), whereas RBI uses forex reserves, market intervention, and LERMS.',
    'ఆర్థిక విధాన సర్దుబాట్లు కేంద్ర ప్రభుత్వం పరిధిలోనివి; మార్పిడి రేటు నిర్వహణకు RBI విదేశీ మారక నిల్వలు, మార్కెట్ జోక్యం మరియు LERMSలను ఉపయోగిస్తుంది.'
  ],
  [
    35, 'economy', 'AP Economy & Public Debt',
    'As per the Budget estimates of 2024-25, the percentage of public debt in the GSDP of Andhra Pradesh in FY 2024-25 is estimated as',
    ['31.46%', '34.14%', '33.71%', '32.60%'],
    'ఆంధ్రప్రదేశ్ బడ్జెట్ 2024-25 ప్రకారం, 2024-25 ఆర్థిక సంవత్సరంలో ఆంధ్రప్రదేశ్ GSDP లో ప్రభుత్వ రుణ శాతం ఇలా అంచనా వేయబడింది.',
    ['31.46%', '34.14%', '33.71%', '32.60%'],
    2,
    'As per the AP State Budget 2024-25, public debt (outstanding liabilities) as a percentage of GSDP for FY 2024-25 BE is estimated at 33.71%.',
    'ఆంధ్రప్రదేశ్ 2024-25 బడ్జెట్ అంచనాల ప్రకారం GSDP లో ప్రభుత్వ రుణ వాటా 33.71% గా ఉంది.'
  ],
  [
    36, 'economy', 'Money Supply & Banking',
    'Which of the following are used for measuring of the high-power money supply (H) by RBI in India ?',
    ['Currency held by the public + Other deposits with the RBI', 'Cash reserves of the commercial banks + Other deposits with the RBI', 'Currency held by the public + Cash reserves of the commercial banks + Other deposits with the RBI', 'Currency held by the public + Cash reserves of the commercial banks + Time deposits of the commercial banks + Other deposits with the RBI'],
    'భారతదేశంలో అధిక-పవర్ మనీ సప్లై (H) యొక్క కొలతలో RBI దేనిని ఉపయోగిస్తుంది ?',
    ['ప్రజల వద్ద ఉన్న కరెన్సీ + RBI వద్ద ఉన్న ఇతర డిపాజిట్లు', 'వాణిజ్య బ్యాంకుల నగదు నిల్వలు + RBI వద్ద ఉన్న ఇతర డిపాజిట్లు', 'ప్రజల వద్ద ఉన్న కరెన్సీ + వాణిజ్య బ్యాంకుల నగదు నిల్వలు + RBI వద్ద ఉన్న ఇతర డిపాజిట్లు', 'ప్రజల వద్ద ఉన్న కరెన్సీ + వాణిజ్య బ్యాంకుల నగదు నిల్వలు + వాణిజ్య బ్యాంకుల సమయ డిపాజిట్లు + RBI వద్ద ఉన్న ఇతర డిపాజిట్లు'],
    2,
    'Reserve Money / High-Powered Money (M0 or H) = Currency in circulation (public) + Bankers\' deposits/cash reserves with RBI + Other deposits with the RBI.',
    'హై-పవర్డ్ మనీ (H / M0) = ప్రజల వద్ద ఉన్న కరెన్సీ + వాణిజ్య బ్యాంకుల నగదు నిల్వలు + RBI వద్ద ఉన్న ఇతర డిపాజిట్లు.'
  ],
  [
    37, 'economy', 'National Income Accounting',
    'Which of the following is not a method of measurement of National Income ?',
    ['Value added method', 'Income method', 'Expenditure method', 'Cost and Accounting method'],
    'క్రింది వాటిలో జాతీయ ఆదాయాన్ని కొలిచే పద్ధతి కానిది ఏది ?',
    ['విలువ జోడించిన పద్ధతి', 'ఆదాయ పద్ధతి', 'వ్యయ పద్ధతి', 'ఖర్చు మరియు అకౌంటింగ్ పద్ధతి'],
    3,
    'The three standard methods of measuring National Income are Value Added (Product), Income, and Expenditure methods—not Cost and Accounting method.',
    'జాతీయ ఆదాయాన్ని కొలిచే మూడు ప్రామాణిక పద్ధతులు: ఉత్పత్తి/విలువ జోడింపు, ఆదాయ మరియు వ్యయ పద్ధతులు.'
  ],
  [
    38, 'economy', 'Taxation & GST',
    'There is no GST on which of the following ?\ni. Petrol and Diesel\nii. Liquor\niii. Electricity supply to consumers\niv. Services of Charitable entities',
    ['i, ii only', 'i, ii, iii only', 'i, ii, iv only', 'All of the above'],
    'క్రింది వాటిలో వేటిపై GST లేదు ?\ni. పెట్రోలు మరియు డీజిల్\nii. లిక్కర్/మద్యము\niii. వినియోగదారులకు విద్యుత్ సరఫరా\niv. దాతృత్వ సంస్థల సేవలు',
    ['i, ii మాత్రమే', 'i, ii, iii మాత్రమే', 'i, ii, iv మాత్రమే', 'పైవన్నీ'],
    3,
    'Petrol/diesel and alcohol for human consumption remain outside GST ambit, while supply of electricity and charitable activities under Sec 12AA are exempted from GST.',
    'పెట్రోల్-డీజిల్, మద్యం GST పరిధిలో లేవు; వినియోగదారులకు విద్యుత్ సరఫరా మరియు దాతృత్వ సంస్థల సేవలకు GST నుండి మినహాయింపు ఉంది.'
  ],
  [
    39, 'economy', 'FDI & Economic Survey',
    'As per the Economic Survey, 2023, which of the following statements correctly describe(s) the trend of Foreign Direct Investment in India ?\na. It has decreased due to less participation of the private sector.\nb. It has increased compared to the prepandemic levels.\nc. It has increased rapidly without decreasing in any Financial Year after the telecom sector was entirely reformed.\nd. It has decreased due to a weak global economic situation.',
    ['a and c only', 'b and d only', 'a, b and c only', 'd only'],
    'ఎకనామిక్ సర్వే, 2023, ప్రకారం, భారతదేశంలో విదేశీ ప్రత్యక్ష పెట్టుబడుల ట్రెండ్‌ను క్రింది వాటిలో ఏ ప్రకటన(లు) వివరిస్తుంది/వివరిస్తున్నాయి ?\na. ప్రైవేట్ రంగం భాగస్వామ్యం తక్కువగా ఉండటంతో ఇది తగ్గింది.\nb. ప్రీపాండెమిక్ స్థాయిలతో పోలిస్తే ఇది పెరిగింది.\nc. టెలికాం రంగం పూర్తిగా సంస్కరించబడిన తర్వాత ఏ ఆర్థిక సంవత్సరంలోనూ తగ్గకుండా వేగంగా పెరిగింది.\nd. బలహీనమైన ప్రపంచ ఆర్థిక పరిస్థితి కారణంగా ఇది తగ్గింది.',
    ['a మరియు c మాత్రమే', 'b మరియు d మాత్రమే', 'a, b మరియు c మాత్రమే', 'd మాత్రమే'],
    1,
    'Economic Survey 2022-23 highlighted that overall FDI remained well above pre-pandemic levels (b) even though inflows moderated in H1 FY23 due to weak global economic conditions (d).',
    'ఎకనామిక్ సర్వే 2023 ప్రకారం FDI ప్రీ-పాండెమిక్ స్థాయిల కంటే పెరిగింది (b), అయితే బలహీన ప్రపంచ ఆర్థిక పరిస్థితుల వల్ల స్వల్పంగా తగ్గింది (d).'
  ],
  [
    40, 'economy', 'Balance of Payments',
    'Which among the following statements is correct ?',
    ['Balance of payments includes current account and capital account', 'Balance of payments includes only capital account', 'Balance of payments includes only current account', 'Balance of payments includes only export and import account'],
    'ఈ క్రింది ప్రకటనలలో ఏది సరైనది ?',
    ['చెల్లింపు బ్యాలెన్స్‌లో కరెంట్ ఖాతా మరియు మూలధన ఖాతా ఉంటాయి', 'చెల్లింపు బ్యాలెన్స్‌లో మూలధన ఖాతా మాత్రమే ఉంటుంది', 'చెల్లింపు బ్యాలెన్స్‌లో కరెంట్ ఖాతా మాత్రమే ఉంటుంది', 'చెల్లింపు బ్యాలెన్స్‌లో ఎగుమతి మరియు దిగుమతి ఖాతా మాత్రమే ఉంటుంది'],
    0,
    'The Balance of Payments (BoP) systematically records all international transactions of a country, primarily divided into the Current Account and the Capital (and Financial) Account.',
    'చెల్లింపుల బ్యాలెన్స్ (BoP) లో ప్రధానంగా కరెంట్ ఖాతా మరియు మూలధన ఖాతా ఉంటాయి.'
  ],
  [
    41, 'economy', 'Capital Markets & SEBI',
    'What is/are the goal(s) of SEBI\'s new move to introduce T+0 settlement ?\nI. To enhance liquidity and reduce settlement risk in the stock market.\nII. To minimize counter party risk and enhance market efficiency.\nIII. Potentially reduce the impact of market volatility on settlement.\nIV. To increase operational expenses for market participants.',
    ['I only', 'I, II only', 'I, II, III only', 'All the above'],
    'SEBI కొత్తగా ప్రవేశపెట్టిన T+0 సెటిల్‌మెంట్ యొక్క ప్రధాన లక్ష్యం ఏమిటి ?\nI. (లిక్విడిటీ) ద్రవ్యలబ్ధిని పెంచడం మరియు స్టాక్ మార్కెట్‌లో (సెటిల్‌మెంట్ రిస్క్) పరిష్కార ప్రమాదాన్ని తగ్గించడం.\nII. ఆర్థిక లావాదేవీలోని ఇతర పార్టీ (కౌంటర్‌పార్టీ) ప్రమాదాన్ని తగ్గించడం మరియు మార్కెట్ సామర్థ్యాన్ని పెంచడం.\nIII. పరిష్కారంపై మార్కెట్ అస్థిరత ప్రభావాన్ని సంభావ్యంగా తగ్గించడం.\nIV. మార్కెట్ భాగస్వాములకు (పార్టిసిపెంట్లు) కార్యాచరణ ఖర్చులను పెంచడం.',
    ['I మాత్రమే', 'I, II మాత్రమే', 'I, II, III మాత్రమే', 'పైవన్నీ'],
    2,
    'SEBI\'s same-day (T+0) settlement cycle boosts market liquidity, reduces counterparty and settlement risk, and limits exposure to volatility—it does not aim to raise expenses.',
    'SEBI యొక్క T+0 సెటిల్‌మెంట్ లక్ష్యాలు లిక్విడిటీ పెంచడం, సెటిల్‌మెంట్/కౌంటర్-పార్టీ రిస్క్ మరియు మార్కెట్ అస్థిరత ప్రభావాన్ని తగ్గించడం (I, II, III).'
  ],
  [
    42, 'economy', 'AP Economy & Per Capita Income',
    'Statement A : All India Per Capita Income for the year 2023-24 (PE) is estimated at Rs.1,84,205.\nStatement B : All India Per Capita Income given above is lower than the Andhra Pradesh Per Capita Income for the year 2023-24 (AE) (at current prices from 2014-15 to 2023-24).',
    ['Only statement A is correct', 'Only statement B is correct', 'Both statements A and B are correct', 'Both statements A and B are incorrect'],
    'వ్యాఖ్యానం A : 2023-24 సంవత్సరానికి (PE) మొత్తం భారతదేశం యొక్క తలసరి ఆదాయం రూ. 1,84,205 గా అంచనా వేయబడింది.\nవ్యాఖ్యానం B : పై మొత్తం భారతదేశం తలసరి ఆదాయం, ఆంధ్రప్రదేశ్ 2023-24 (AE) తలసరి ఆదాయం కంటే తక్కువ (2014-15 నుండి 2023-24 వరకు ప్రస్తుత ధరల ప్రకారం).',
    ['వ్యాఖ్యానం A మాత్రమే సరైనది', 'వ్యాఖ్యానం B మాత్రమే సరైనది', 'రెండు వ్యాఖ్యానాలు A మరియు B సరైనవి', 'రెండు వ్యాఖ్యానాలు A మరియు B సరైనవి కావు'],
    2,
    'All-India Per Capita NNI at current prices for 2023-24 (PE) was Rs. 1,84,205, whereas AP\'s Per Capita Income for 2023-24 (AE) was higher at Rs. 2,42,479.',
    '2023-24 లో భారత తలసరి ఆదాయం రూ. 1,84,205 కాగా, ఆంధ్రప్రదేశ్ తలసరి ఆదాయం (రూ. 2,42,479) కంటే తక్కువగా ఉంది. కనుక A, B రెండూ సరైనవి.'
  ],
  [
    43, 'economy', 'AP Reorganization Act 2014',
    'Match the following Central Institutes established under the A. P. State Reorganization Act, 2014 with their locations.\na. Indian Institute of Technology   i. Kurnool\nb. Indian Institute of Management   ii. Tirupati\nc. All India Institute of Medical Sciences   iii. Vizianagaram\nd. Indian Institute of Information Technology   iv. Vijayawada\ne. Tribal University   v. Vishakhapatnam\n\nCodes (a b c d e) :',
    ['i  ii  iii  iv  v', 'ii  v  iv  i  iii', 'i  iv  iii  v  ii', 'ii  iv  v  iii  i'],
    'ఆంధ్రప్రదేశ్ రాష్ట్ర పునర్వ్యవస్థీకరణ చట్టం, 2014 క్రింద ఏర్పాటుచేసిన ఈ క్రింది కేంద్రీయ సంస్థలను వాటి స్థానాలతో సరిపోల్చండి.\na. ఇండియన్ ఇన్‌స్టిట్యూట్ ఆఫ్ టెక్నాలజీ   i. కర్నూలు\nb. ఇండియన్ ఇన్‌స్టిట్యూట్ ఆఫ్ మేనేజ్‌మెంట్   ii. తిరుపతి\nc. ఆల్ ఇండియా ఇన్‌స్టిట్యూట్ ఆఫ్ మెడికల్ సైన్సెస్   iii. విజయనగరం\nd. ఇండియన్ ఇన్‌స్టిట్యూట్ ఆఫ్ ఇన్ఫర్మేషన్ టెక్నాలజీ   iv. విజయవాడ\ne. గిరిజన విశ్వవిద్యాలయం   v. విశాఖపట్నం\n\nకోడ్‌లు (a b c d e) :',
    ['i  ii  iii  iv  v', 'ii  v  iv  i  iii', 'i  iv  iii  v  ii', 'ii  iv  v  iii  i'],
    1,
    'IIT Tirupati (ii), IIM Visakhapatnam (v), AIIMS Mangalagiri/Vijayawada region (iv), IIITDM Kurnool (i), and Central Tribal University Vizianagaram (iii).',
    'IIT తిరుపతి (ii), IIM విశాఖపట్నం (v), AIIMS విజయవాడ ప్రాంతం (iv), IIIT కర్నూలు (i), గిరిజన విశ్వవిద్యాలయం విజయనగరం (iii).'
  ],
  [
    44, 'economy', 'Balance of Payments',
    'Which of the following measures is NOT typically used to correct a disequilibrium in the Balance of Payments (BOP) ?',
    ['Devaluation of currency', 'Increasing import tariffs', 'Reducing government spending on domestic projects', 'Encouraging Foreign Direct Investment (FDI)'],
    'చెల్లింపుల బ్యాలెన్స్ (BOP) లో అసమతుల్యతను సరిచేయడానికి క్రింది వాటిలో ఏది సాధారణంగా ఉపయోగించబడదు ?',
    ['కరెన్సీ విలువ తగ్గింపు', 'దిగుమతి సుంకాలను పెంచడం', 'దేశీయ ప్రాజెక్టులపై ప్రభుత్వ వ్యయాన్ని తగ్గించడం', 'విదేశీ ప్రత్యక్ష పెట్టుబడులను (FDI) ప్రోత్సహించడం'],
    2,
    'BoP disequilibrium is directly addressed using exchange rate adjustment, tariffs/import controls, export promotion, and attracting foreign capital (FDI), rather than cutting domestic infrastructure projects directly.',
    'BoP అసమతుల్యతను సరిచేయడానికి సాధారణంగా దేశీయ ప్రాజెక్టులపై ప్రభుత్వ వ్యయాన్ని తగ్గించడాన్ని ప్రధాన సాధనంగా ఉపయోగించరు.'
  ],
  [
    45, 'economy', 'Monetary Policy & RBI',
    'How does the introduction of the Standing Deposit Facility (SDF) enhance the Reserve Bank of India\'s (RBI) liquidity management framework ?',
    ['By increasing the overall liquidity in the banking system', 'By absorbing surplus liquidity without the need for collateral', 'By keeping the cost of liquidity for commercial banks constant', 'By providing long-term loans to banks at lower interest rates'],
    'స్టాండింగ్ డిపాజిట్ ఫెసిలిటీ (SDF) ప్రవేశపెట్టబడటం భారతీయ రిజర్వ్ బ్యాంక్ (RBI) ద్రవ్య లభ్యత నిర్వహణ సహాయక నిర్మాణంను (లిక్విడిటీ మేనేజ్‌మెంట్ ఫ్రేమ్‌వర్క్) ఎలా మెరుగుపరుస్తుంది ?',
    ['బ్యాంకింగ్ వ్యవస్థలో మొత్తం ద్రవ్య లభ్యతను (లిక్విడిటీ) పెంచడం ద్వారా', '(అనుషంగిక) హామీ/తనఖా (collateral) అవసరం లేకుండా మిగులు లిక్విడిటీని గ్రహించడం ద్వారా', 'వాణిజ్య బ్యాంకుల లిక్విడిటీ ఖర్చును స్థిరంగా ఉంచడం ద్వారా', 'బ్యాంకులకు తక్కువ వడ్డీ రేట్లకు దీర్ఘకాలిక రుణాలను అందించడం ద్వారా'],
    1,
    'Introduced in April 2022, SDF replaced fixed-rate reverse repo as the floor of the LAF corridor, allowing RBI to absorb excess liquidity without offering government securities as collateral.',
    'ఏప్రిల్ 2022లో ప్రవేశపెట్టిన SDF ద్వారా ఎలాంటి తనఖా (కొల్లాటరల్) లేకుండానే RBI మిగులు ద్రవ్యత్వాన్ని గ్రహించగలుగుతుంది.'
  ],
  [
    46, 'economy', 'AP Infrastructure & Economy',
    'Which of the following is not correct regarding the railway project under Central Assistance approved by the Union Cabinet for Amaravati in Andhra Pradesh ?',
    ['The proposed railway line is between Errupalem and Nambur', 'The cost of the project is Rs. 2,245 crores for 57 km', 'The line passes through NTR and Guntur Districts in Andhra Pradesh and Khammam District in Telangana', 'The proposed time line of the project is 6 years'],
    'ఆంధ్రప్రదేశ్‌లోని అమరావతి కోసం కేంద్ర మంత్రివర్గం ఆమోదించిన కేంద్ర సహాయం క్రింద రైల్వే ప్రాజెక్టుకు సంబంధించి ఈ క్రింది వాటిలో ఏది సరైన ప్రకటన కాదు ?',
    ['ప్రతిపాదిత రైల్వే లైన్ ఎర్రుపాలెం మరియు నంబూరు మధ్య ఉంది', 'ఈ ప్రాజెక్టు వ్యయం 57 కిలోమీటర్లకు రూ. 2,245 కోట్లు', 'ఈ రైల్వే లైన్ ఆంధ్రప్రదేశ్‌లోని ఎన్టీఆర్ మరియు గుంటూరు జిల్లాల మీదుగా మరియు తెలంగాణలోని ఖమ్మం జిల్లా గుండా వెళుతుంది', 'ప్రాజెక్టు ప్రతిపాదిత కాలపరిమితి 6 సంవత్సరాలు'],
    3,
    'The Union Cabinet approved the 57-km Errupalem–Amaravati–Nambur line at Rs. 2,245 crore across Khammam, NTR, and Guntur districts with a 4-year completion timeline (not 6 years).',
    'అమరావతి-ఎర్రుపాలెం-నంబూరు 57 కి.మీ. రైల్వే లైన్ ప్రాజెక్టు (రూ. 2,245 కోట్లు) పూర్తి కాలపరిమితి 4 సంవత్సరాలుగా ఆమోదించబడింది (6 సంవత్సరాలు కాదు).'
  ],
  [
    47, 'economy', 'Economic Reforms',
    'Which of the following reforms have contributed to the improvement of the Ease of Doing Business in India ?',
    ['The introduction of GST (Goods and Services Tax)', 'Removal of all foreign ownership restrictions in Indian companies', 'Nationalization of all private banks', 'Expansion of public sector enterprises into new sectors'],
    'భారతదేశంలో వ్యాపారం చేయడం సులభతరం చేయడానికి క్రింది సంస్కరణల్లో ఏది దోహదపడింది ?',
    ['GST (వస్తువులు మరియు సేవల పన్ను) ప్రవేశ పెట్టబడుట', 'భారతీయ కంపెనీలలో అన్ని విదేశీ యాజమాన్య పరిమితులను తొలగించడం', 'అన్ని ప్రైవేట్ బ్యాంకుల జాతీయీకరణ', 'ప్రభుత్వరంగ సంస్థలను కొత్త రంగాల్లోకి విస్తరించడం'],
    0,
    'Introducing GST created a unified national market, simplified indirect tax compliance, and eliminated cascading taxes, boosting Ease of Doing Business.',
    'GST ప్రవేశపెట్టడం వలన ఒకే దేశం-ఒకే పన్ను విధానం ఏర్పడి వ్యాపార నిర్వహణ సులభతరమైంది.'
  ],
  [
    48, 'economy', 'Employment & Unemployment',
    'Which among the following classifications of unemployment is predominantly correlated with the agricultural sector ?',
    ['Cyclical unemployment', 'Seasonal unemployment', 'Structural unemployment', 'Frictional unemployment'],
    'నిరుద్యోగం యొక్క క్రింది వర్గీకరణలలో ఏది ప్రధానంగా వ్యవసాయ రంగంతో సంబంధం కలిగి ఉంది ?',
    ['చక్రీయ నిరుద్యోగం', 'కాలానుగుణ నిరుద్యోగం', 'నిర్మాణాత్మక నిరుద్యోగం', 'ఘర్షణ/సంఘర్షణ నిరుద్యోగం'],
    1,
    'Agriculture is strongly dependent on monsoon and crop cycles, leading predominantly to seasonal (and disguised) unemployment during off-seasons.',
    'వ్యవసాయ రంగం రుతుపవనాలు మరియు పంట కాలాలపై ఆధారపడి ఉండటం వలన కాలానుగుణ నిరుద్యోగం ప్రధానంగా కనిపిస్తుంది.'
  ],
  [
    49, 'economy', 'National Income & Inflation',
    'GDP deflator is the most comprehensive measure of inflation as it is the ratio of',
    ['GDP at National prices to Local prices', 'Real GDP to Nominal GDP', 'GDP at Low prices to High prices', 'GDP at Current prices to Constant prices'],
    'GDP డిఫ్లేటర్ అనేది క్రింది వాటి నిష్పత్తి కనుక అది ద్రవ్యోల్బణం యొక్క అత్యంత సమగ్రమైన కొలత',
    ['జాతీయ ధరల వద్ద మరియు స్థానిక ధరల వద్ద GDP కి', 'వాస్తవ GDP కి మరియు నామమాత్ర GDP కి', 'తక్కువ ధరల వద్ద మరియు అధిక ధరల వద్ద GDP కి', 'ప్రస్తుత ధరల వద్ద మరియు స్థిరమైన ధరల వద్ద GDP కి'],
    3,
    'GDP Deflator = (Nominal GDP / Real GDP) × 100, which equals the ratio of GDP at Current prices to GDP at Constant prices.',
    'GDP డిఫ్లేటర్ = ప్రస్తుత ధరల వద్ద GDP (నామమాత్రపు) / స్థిర ధరల వద్ద GDP (వాస్తవ) × 100.'
  ],
  [
    50, 'economy', 'AP Agriculture & Allied',
    'Chadalawada village where a Cattle Breeding farm is established under Gokul Gram Project under Rashtriya Gokula Mission belongs to which District ?',
    ['Guntur', 'Prakasam', 'Nellore', 'Srikakulam'],
    'రాష్ట్రీయ గోకుల మిషన్‌లోని గోకుల్ గ్రామ్ ప్రాజెక్ట్ క్రింద పశు ఉత్పత్తి క్షేత్రం (క్యాటిల్ బ్రీడింగ్ ఫారం) ఏర్పాటు చేయబడిన చదలవాడ గ్రామం ఏ జిల్లాకు చెందినది ?',
    ['గుంటూరు', 'ప్రకాశం', 'నెల్లూరు', 'శ్రీకాకుళం'],
    1,
    'Chadalawada in Naguluppalapadu mandal (famous for Ongole cattle breed preservation under Rashtriya Gokul Mission) lies in Prakasam District, Andhra Pradesh.',
    'రాష్ట్రీయ గోకుల మిషన్ క్రింద గోకుల్ గ్రామ్ ప్రాజెక్ట్‌తో కూడిన చదలవాడ గ్రామం ప్రకాశం జిల్లాలో ఉంది.'
  ],
  [
    51, 'economy', 'Globalization & Trade',
    'Which of the following is not true about globalization and its impact on India ?',
    ['It has expanded trade in goods and services', 'It has led to greater flow of Foreign Direct Investment', 'Increase in exports is greater than increase in imports', 'Increased India\'s access to foreign technology and investment'],
    'ప్రపంచీకరణ మరియు భారతదేశంపై దాని ప్రభావం గురించి కింది వాటిలో ఏది నిజం కాదు ?',
    ['ఇది వస్తువులు మరియు సేవలలో వాణిజ్యాన్ని విస్తరించింది', 'ఇది విదేశీ ప్రత్యక్ష పెట్టుబడుల అధిక ప్రవాహానికి దారితీసింది', 'దిగుమతుల పెరుగుదల కంటే ఎగుమతుల పెరుగుదల ఎక్కువ', 'భారతదేశానికి విదేశీ సాంకేతికత మరియు పెట్టుబడుల అందుబాటును పెంచింది'],
    2,
    'Post-liberalization India expanded merchandise and service trade, but import growth has consistently exceeded merchandise export growth, leaving a merchandise trade deficit.',
    'ప్రపంచీకరణ తర్వాత భారతదేశంలో దిగుమతుల పెరుగుదల ఎగుమతుల కంటే ఎక్కువగా ఉంది కాబట్టి (3) సరైనది కాదు.'
  ],
  [
    52, 'economy', 'AP Agriculture & Marketing',
    'Which is not a correct statement regarding Rytu Bazaars in Andhra Pradesh ?',
    ['Rytu Bazaars were established in the year 1999', 'District Collector is the Co-ordinating officer of Rytu Bazaars', 'Rytu Bazaar is managed by an Estate Officer', 'The prices in Rytu Bazaar are fixed aiming to be around 25% above wholesale prices and 25% below the local retail prices'],
    'ఆంధ్రప్రదేశ్‌లోని రైతు బజార్లకు సంబంధించి క్రింది వాటిలో ఏది సరైన ప్రకటన కాదు ?',
    ['రైతు బజార్లు 1999 లో స్థాపించబడ్డాయి', 'రైతు బజార్ల సమన్వయ అధికారి జిల్లా కలెక్టర్', 'రైతు బజార్‌ను ఎస్టేట్ అధికారి నిర్వహిస్తారు', 'రైతు బజార్‌లోని ధరలు టోకు ధరల కంటే 25% ఎక్కువ మరియు స్థానిక రిటైల్ ధరల కంటే 25% తక్కువగా ఉండే లక్ష్యంతో నిర్ణయించబడతాయి'],
    3,
    'Rytu Bazaars fix prices roughly around wholesale prices (marginally above farmers\' wholesale cost) and ~25% below local retail prices—not 25% above wholesale prices.',
    'రైతు బజార్లలో ధరలు టోకు ధరల కంటే 25% ఎక్కువగా కాకుండా స్థానిక రిటైల్ ధరల కంటే సుమారు 25% తక్కువగా నిర్ణయించబడతాయి.'
  ],
  [
    53, 'economy', 'Employment & Statistics',
    'Which principal methodology is employed by the National Statistical Office (NSO) as the standard mechanism for assessing and quantifying the unemployment rate within the Indian economy ?',
    ['Quarterly Employment Survey (QES)', 'Annual Economic Survey', 'Labour Bureau Employment-Unemployment Survey', 'Periodic Labour Force Survey (PLFS)'],
    'భారత ఆర్థిక వ్యవస్థలో నిరుద్యోగిత స్థాయిని అంచనా వేయడానికి మరియు లెక్కించడానికి జాతీయ గణాంక కార్యాలయం (NSO) ఏ ప్రధాన పద్ధతిని ప్రామాణిక యంత్రాంగంగా ఉపయోగిస్తుంది ?',
    ['త్రైమాసిక ఉపాధి సర్వే (అవలోకన) (QES)', 'వార్షిక ఆర్థిక సర్వే', 'లేబర్ బ్యూరో ఎంప్లాయ్‌మెంట్-నిరుద్యోగ సర్వే', 'పీరియాడిక్ లేబర్ ఫోర్స్ సర్వే (PLFS) (సమయోచిత కార్మిక శక్తి అవలోకన)'],
    3,
    'Since 2017-18, NSO conducts the Periodic Labour Force Survey (PLFS) as the official national mechanism for measuring labour force participation and unemployment rates.',
    'భారతదేశంలో నిరుద్యోగిత మరియు కార్మిక శక్తిని కొలవడానికి NSO ప్రధానంగా పీరియాడిక్ లేబర్ ఫోర్స్ సర్వే (PLFS)ను నిర్వహిస్తుంది.'
  ],
  [
    54, 'economy', 'Public Finance & Budgeting',
    'A budgeting process which demands each manager to justify his entire budget in detail from beginning is',
    ['Functional budgeting', 'Master budgeting', 'Zero-base budgeting', 'None of the above'],
    'ప్రతి మేనేజర్‌ను తన మొత్తం బడ్జెట్‌ను మొదటి నుండి వివరంగా సమర్థించమని కోరే బడ్జెట్ ప్రక్రియ',
    ['ఫంక్షనల్ బడ్జెటింగ్', 'మాస్టర్ బడ్జెటింగ్', 'జీరో-బేస్ బడ్జెటింగ్', 'పైవేవీ కాదు'],
    2,
    'Zero-Base Budgeting (ZBB) requires every program or department to justify all expenditures anew starting from a zero base in each budget cycle.',
    'జీరో-బేస్ బడ్జెటింగ్‌లో ప్రతి వ్యయాన్ని గత బడ్జెట్‌తో సంబంధం లేకుండా సున్నా ఆధారంగా మొదటి నుండి సమర్థించాల్సి ఉంటుంది.'
  ],
  [
    55, 'economy', 'AP SEZs & Industry',
    'Match the following Special Economic Zone Production Units in (List-I) with their locations (List-II).\nList – I\na. Divi\'s Laboratories Limited-Pharmaceuticals\nb. Parry Infrastructure Company-Food Processing\nc. White Field Paper Mills Ltd.-Writing and Printing Paper\nd. Indian Farmers Fertilizers Co-operative Ltd. (IFFCO)-Multi Products\n\nList – II\ni. Nellore\nii. Kovvur\niii. Kakinada\niv. Visakhapatnam\n\nCodes (a b c d) :',
    ['iv  iii  i  ii', 'iv  iii  ii  i', 'i  ii  iv  iii', 'i  ii  iii  iv'],
    'క్రింది ప్రత్యేక ఆర్థిక మండలాలలోని ఉత్పత్తి కేంద్రాలను (జాబితా-I) అవి ఉన్న ప్రదేశాలతో (జాబితా-II) సరిపోల్చండి.\nజాబితా – I\na. దివిస్ లేబొరేటరీస్ లిమిటెడ్ ఫార్మాస్యూటికల్స్\nb. ప్యారీ ఇన్‌ఫ్రాస్ట్రక్చర్ కంపెనీ-ఫుడ్ ప్రాసెసింగ్\nc. వైట్‌ఫీల్డ్ పేపర్ మిల్స్ లిమిటెడ్-రైటింగ్ మరియు ప్రింటింగ్ పేపర్\nd. ఇండియన్ ఫార్మర్స్ ఫెర్టిలైజర్స్ కో-ఆపరేటివ్ లిమిటెడ్. (IFFCO)-బహుళ ఉత్పత్తులు\n\nజాబితా – II\ni. నెల్లూరు\nii. కొవ్వూరు\niii. కాకినాడ\niv. విశాఖపట్నం\n\nకోడ్‌లు (a b c d) :',
    ['iv  iii  i  ii', 'iv  iii  ii  i', 'i  ii  iv  iii', 'i  ii  iii  iv'],
    1,
    'Divi\'s Labs SEZ is at Visakhapatnam (iv), Parry Infrastructure Food Processing SEZ at Kakinada (iii), White Field Paper Mills at Kovvur (ii), and IFFCO Multi-Product SEZ at Nellore (i).',
    'దివిస్-విశాఖపట్నం (iv), ప్యారీ-కాకినాడ (iii), వైట్‌ఫీల్డ్-కొవ్వూరు (ii), IFFCO-నెల్లూరు (i).'
  ],
  [
    56, 'economy', 'Public Finance & Expenditure',
    'Which of the following statements about non-plan expenditures of the Central Government is correct ?',
    ['The expenditure is on interest payments', 'The expenditure is on science and technology', 'The expenditure is on agriculture', 'None of the above'],
    'కేంద్ర ప్రభుత్వం యొక్క ప్రణాళికేతర (non-plan) ఖర్చుల గురించి క్రింది ప్రకటనలలో ఏది సరైనది ?',
    ['ఈ ఖర్చు వడ్డీ చెల్లింపులపై', 'ఈ ఖర్చు సైన్స్ అండ్ టెక్నాలజీపై', 'ఈ ఖర్చు వ్యవసాయం పై', 'పైవేవీ కాదు'],
    0,
    'Historically (prior to Plan/Non-Plan merger), Non-Plan Expenditure of the Central Government comprised committed items led predominantly by interest payments, defence, and subsidies.',
    'కేంద్ర ప్రభుత్వ ప్రణాళికేతర వ్యయంలో వడ్డీ చెల్లింపులు అతిపెద్ద వాటాను కలిగి ఉంటాయి.'
  ],
  [
    57, 'economy', 'AP Minerals & Resources Economy',
    'Match the following minerals (List – I) with the erstwhile districts (List – II) where they are predominantly available.\nList – I\na. Apatite\nb. Asbestos\nc. Ball Clay\nd. Mica\n\nList – II\ni. West Godavari\nii. Nellore\niii. Visakhapatnam\niv. Kadapa\n\nCodes (a b c d) :',
    ['iii  iv  i  ii', 'iii  iv  ii  i', 'ii  i  iii  iv', 'ii  i  iv  iii'],
    'క్రింది ఖనిజాలను (జాబితా – I) అవి ప్రధానంగా లభించే పాత జిల్లాలతో (జాబితా – II) సరిపోల్చండి.\nజాబితా – I\na. అపటైట్\nb. ఆస్బెస్టాస్\nc. బాల్ క్లే\nd. మైకా\n\nజాబితా – II\ni. పశ్చిమ గోదావరి\nii. నెల్లూరు\niii. విశాఖపట్నం\niv. కడప\n\nకోడ్‌లు (a b c d) :',
    ['iii  iv  i  ii', 'iii  iv  ii  i', 'ii  i  iii  iv', 'ii  i  iv  iii'],
    0,
    'In Andhra Pradesh: Apatite is found at Kasipatnam in erstwhile Visakhapatnam (iii), Asbestos in Pulivendula/Kadapa (iv), Ball Clay in Dwaraka Tirumala/West Godavari (i), and Mica in Gudur/Nellore (ii).',
    'అపటైట్-విశాఖపట్నం (iii), ఆస్బెస్టాస్-కడప (iv), బాల్ క్లే-పశ్చిమ గోదావరి (i), మైకా-నెల్లూరు (ii).'
  ],
  [
    58, 'economy', 'AP Agriculture & Horticulture',
    'Statement A : Andhra Pradesh ranks 1st in the productivity of Oil palm in India.\nStatement B : Andhra Pradesh ranks 2nd in the productivity of Mango in India.',
    ['Only statement A is correct', 'Only statement B is correct', 'Both statements A and B are correct', 'Both statements A and B are incorrect'],
    'వ్యాఖ్యానం A : భారతదేశంలో ఆయిల్ పామ్ ఉత్పాదకతలో ఆంధ్రప్రదేశ్ రాష్ట్రం 1 వ స్థానంలో ఉంది.\nవ్యాఖ్యానం B : భారతదేశంలో మామిడి పండ్ల ఉత్పాదకతలో ఆంధ్రప్రదేశ్ రాష్ట్రం 2 వ స్థానంలో ఉంది.',
    ['వ్యాఖ్యానం A మాత్రమే సరైనది', 'వ్యాఖ్యానం B మాత్రమే సరైనది', 'రెండు వ్యాఖ్యానాలు A మరియు B సరైనవి', 'రెండు వ్యాఖ్యానాలు A మరియు B సరైనవి కావు'],
    2,
    'Per AP Socio-Economic Survey data, Andhra Pradesh ranks 1st in the country in oil palm productivity and 2nd in mango productivity.',
    'భారతదేశంలో ఆయిల్ పామ్ ఉత్పాదకతలో AP 1వ స్థానంలో మరియు మామిడి ఉత్పాదకతలో 2వ స్థానంలో ఉంది.'
  ],
  [
    59, 'economy', 'AP Industrial Policy 4.0',
    'One of the following is not the standard incentive to the industries offered by Government of AP based on the AP Industrial Policy (4.0), 2024-29.',
    ['Decarbonisation subsidy up to 6%', '100% stamp duty reimbursement on purchase of land and lease of land/shed/buildings', 'Reimbursement of 100% fee charged for land conversion', 'Maximum capital subsidy of 15% of Foreign capital investment'],
    'AP పారిశ్రామిక విధానం (4.0), 2024-29 ప్రకారం క్రింది వాటిలో ఏది AP ప్రభుత్వం పరిశ్రమలకు అందించే ప్రామాణిక ప్రోత్సాహకం కాదు ?',
    ['డీకార్బనైజేషన్ సబ్సిడీ 6% వరకు', 'భూమి కొనుగోలు మరియు భూమి/షెడ్డు/భవనాల లీజుపై 100% స్టాంప్ డ్యూటీ తిరిగి చెల్లింపు', 'భూమి మార్పిడి పై విధించబడిన రుసుము 100% తిరిగి చెల్లింపు', 'విదేశీ మూలధన పెట్టుబడిలో గరిష్టంగా 15% మూలధన సబ్సిడీ'],
    3,
    'Under AP Industrial Development Policy (4.0) 2024-29, capital subsidy is linked to Fixed Capital Investment (FCI) for sub-large/medium categories—not "Foreign capital investment".',
    'AP పారిశ్రామిక విధానం 4.0 ప్రకారం మూలధన సబ్సిడీ స్థిర మూలధన పెట్టుబడి (FCI)పై ఉంటుంది కానీ విదేశీ మూలధన పెట్టుబడిపై కాదు.'
  ],
  [
    60, 'economy', 'Union Budget & Fiscal Deficit',
    'Statement A : The GoI fiscal deficit R E for 2024-25 is 4.8% of GDP.\nStatement B : It is higher than the Fiscal Deficit B E for 2025 – 2026.',
    ['Statement A only is correct', 'Statement B only is correct', 'Both Statements are correct', 'Neither A nor B is correct'],
    'ప్రకటన A : భారత ప్రభుత్వ R E 2024-25 ఆర్థిక లోటు GDPలో 4.8%.\nప్రకటన B : ఇది 2025 – 2026 B E ఆర్థిక లోటు అంచనా కన్నా ఎక్కువ.',
    ['ప్రకటన A మాత్రమే సరైనది', 'ప్రకటన B మాత్రమే సరైనది', 'రెండు ప్రకటనలు సరైనవి', 'A మరియు B రెండూ సరి కావు'],
    2,
    'In the Union Budget 2025-26, fiscal deficit for FY 2024-25 (RE) was revised down to 4.8% of GDP, which is higher than the FY 2025-26 (BE) target of 4.4% of GDP.',
    'కేంద్ర బడ్జెట్ ప్రకారం 2024-25 RE ఆర్థిక లోటు GDPలో 4.8% కాగా, 2025-26 BE లక్ష్యం 4.4% కంటే ఎక్కువ. కనుక రెండూ సరైనవి.'
  ],
  [
    61, 'economy', 'Labour Laws & Industry',
    'A person who has ultimate control over the affairs of a factory under Factories Act, 1948 is called',
    ['Occupier', 'Manager', 'Chairman', 'Managing Director'],
    'ఫ్యాక్టరీల చట్టం, 1948 ప్రకారం కర్మాగార వ్యవహారాలపై అంతిమ నియంత్రణ కలిగి ఉన్న వ్యక్తిని ఇలా పిలుస్తారు ?',
    ['ఆక్యుపెయర్', 'మేనేజర్', 'చైర్మన్', 'మేనేజింగ్ డైరెక్టర్'],
    0,
    'Section 2(n) of the Factories Act, 1948 defines an "Occupier" of a factory as the person who has ultimate control over the affairs of the factory.',
    'ఫ్యాక్టరీల చట్టం 1948 సెక్షన్ 2(n) ప్రకారం కర్మాగార వ్యవహారాలపై అంతిమ నియంత్రణ ఉన్న వ్యక్తిని ఆక్యుపెయర్ అంటారు.'
  ],
  [
    62, 'economy', 'AP Irrigation Economy',
    'Match the following irrigation projects (List – I) with the rivers on which they are located (List – II).\nList – I\na. Somasila reservoir\nb. Thotapally project\nc. Annamayya project\nd. Rallapadu\n\nList – II\ni. Cheyyeru\nii. Penna\niii. Manneru\niv. Nagavali\n\nCodes (a b c d) :',
    ['i  ii  iii  iv', 'i  iv  iii  ii', 'ii  iv  i  iii', 'ii  iv  iii  i'],
    'క్రింది నీటిపారుదల ప్రాజెక్టులను (జాబితా – I) వాటికి సంబంధించిన నదులతో (జాబితా – II) సరిపోల్చండి.\nజాబితా – I\na. సోమశిల రిజర్వాయర్\nb. తోటపల్లి ప్రాజెక్ట్\nc. అన్నమయ్య ప్రాజెక్ట్\nd. రాళ్ళపాడు\n\nజాబితా – II\ni. చెయ్యేరు\nii. పెన్నా\niii. మన్నేరు\niv. నాగావళి\n\nకోడ్‌లు (a b c d) :',
    ['i  ii  iii  iv', 'i  iv  iii  ii', 'ii  iv  i  iii', 'ii  iv  iii  i'],
    2,
    'Somasila is on River Penna (ii), Thotapally on Nagavali (iv), Annamayya on Cheyyeru (i), and Rallapadu on Manneru (iii).',
    'సోమశిల-పెన్నా (ii), తోటపల్లి-నాగావళి (iv), అన్నమయ్య-చెయ్యేరు (i), రాళ్ళపాడు-మన్నేరు (iii).'
  ],
  [
    63, 'economy', 'Sustainable Development Goals',
    'Which of the following statements is/are correct ?\na. India\'s overall SDG score has improved to 71 in 2023-24. Uttarakhand shares the top spot with Kerala, both scored above India\'s overall SDG score.\nb. In the latest SDG India Index 2023-24, Andhra Pradesh is placed in the "Front Runner" category.\nc. Arunachal Pradesh and Meghalaya, each with scores above 75, are placed in the "Achiever" category.\nd. In the 2023-2024 SDG Index, Lakshadweep and Uttar Pradesh scored significantly above the national average, demonstrating notable progress compared to other states.',
    ['a, b only correct', 'b, c only correct', 'c, d only correct', 'a, d only correct'],
    'క్రింది ప్రకటనలో సరైనది(వి) ఏది(వి) ?\na. భారతదేశం యొక్క మొత్తం SDG స్కోర్ 2023-24 లో 71 కి మెరుగుపడింది. ఉత్తరాఖండ్ కేరళతో అగ్రస్థానాన్ని పంచుకుంది, రెండూ భారతదేశం యొక్క మొత్తం SDG స్కోర్ కంటే ఎక్కువ స్కోర్ చేశాయి.\nb. తాజా SDG ఇండియా ఇండెక్స్ 2023-24 లో, ఆంధ్రప్రదేశ్ “ఫ్రంట్-రన్నర్” కేటగిరీలో ఉంచబడింది.\nc. అరుణాచల్ ప్రదేశ్ మరియు మేఘాలయ, ఒక్కొక్కటి 75 కంటే ఎక్కువ స్కోర్‌లతో “అచీవర్” విభాగంలో ఉంచబడ్డాయి.\nd. 2023-2024 SDG ఇండెక్స్‌లో, లక్షద్వీప్ మరియు ఉత్తర ప్రదేశ్ జాతీయ సగటు కంటే గణనీయంగా ఎక్కువగా స్కోర్ చేశాయి, ఇతర రాష్ట్రాలతో పోలిస్తే చెప్పుకోదగ్గ పురోగతిని ప్రదర్శించాయి.',
    ['a, b మాత్రమే సరైనవి', 'b, c మాత్రమే సరైనవి', 'c, d మాత్రమే సరైనవి', 'a, d మాత్రమే సరైనవి'],
    0,
    'In NITI Aayog\'s SDG India Index 2023-24, India\'s score improved to 71; Uttarakhand & Kerala topped jointly with 79, and AP (74) is a Front Runner. No state/UT reached Achiever (100).',
    'SDG ఇండియా ఇండెక్స్ 2023-24లో భారత స్కోరు 71, ఉత్తరాఖండ్-కేరళ అగ్రస్థానంలో ఉన్నాయి (a) మరియు ఆంధ్రప్రదేశ్ ఫ్రంట్-రన్నర్ కేటగిరీలో ఉంది (b).'
  ],
  [
    64, 'economy', 'AP Agriculture & Institutions',
    'How many Rythu Bharosa Kendralu (RBKs) has the Government of Andhra Pradesh established according to Socio-Economic Survey of Andhra Pradesh 2023-24 ?',
    ['10,778', '1,104', '33,120', '53,580'],
    'సోషియో ఎకనమిక్ సర్వే 2023-24 ప్రకారం ఆంధ్రప్రదేశ్ ప్రభుత్వం ఎన్ని రైతు భరోసా కేంద్రాలను (RBKలు) ఏర్పాటు చేసింది ?',
    ['10,778', '1,104', '33,120', '53,580'],
    0,
    'According to the Andhra Pradesh Socio-Economic Survey 2023-24, 10,778 Rythu Bharosa Kendralu (RBKs) were established across the state.',
    'AP సోషియో-ఎకనమిక్ సర్వే 2023-24 ప్రకారం రాష్ట్రవ్యాప్తంగా 10,778 రైతు భరోసా కేంద్రాలు (RBKలు) ఏర్పాటు చేయబడ్డాయి.'
  ],
  [
    65, 'economy', 'National Income Accounting',
    'What item(s) account for the differences between GDP at factor cost and GDP at market prices ?',
    ['Direct taxes and subsidies', 'Direct taxes net of subsidies', 'Indirect taxes and subsidies', 'Direct taxes and depreciation'],
    'ఫ్యాక్టర్ కాస్ట్ వద్ద GDP మరియు మార్కెట్ ధరల వద్ద GDP ల మధ్య వ్యత్యాసాలకు ఏ అంశం(లు) కారణం ?',
    ['ప్రత్యక్ష పన్నులు మరియు సబ్సిడీలు', 'నికర సబ్సిడీల ప్రత్యక్ష పన్నులు', 'పరోక్ష పన్నులు మరియు సబ్సిడీలు', 'ప్రత్యక్ష పన్నులు మరియు తరుగుదల'],
    2,
    'GDP at Market Prices = GDP at Factor Cost + Net Indirect Taxes (Indirect Taxes minus Subsidies).',
    'మార్కెట్ ధరల వద్ద GDP = ఫ్యాక్టర్ కాస్ట్ వద్ద GDP + పరోక్ష పన్నులు − సబ్సిడీలు.'
  ],
  [
    66, 'economy', 'AP Economy & EAC-PM Report',
    'According to the report on Relative Economic Performance of Indian States (1960-61 to 2023-24), prepared by Economic Advisory Council to the PM, what are the individual shares of Andhra Pradesh and Telangana in the National GDP in FY 2023-24 ?',
    ['A.P.-4.7 and Telangana-4.9', 'A.P.-4.9 and Telangana-4.7', 'A.P.-4.5 and Telangana-5.1', 'A.P.-5.1 and Telangana-4.5'],
    'ప్రధానమంత్రి ఆర్థిక సలహా మండలి తయారు చేసిన రిలేటివ్ ఎకనామిక్ పెర్ఫార్మెన్స్ ఆఫ్ ఇండియన్ స్టేట్స్ (1960-61 నుండి 2023-24) నివేదిక ప్రకారం 2023-24 ఆర్థిక సంవత్సరంలో జాతీయ జిడిపిలో ఆంధ్రప్రదేశ్ మరియు తెలంగాణ రాష్ట్రాల వ్యక్తిగత వాటా శాతం ఎంత ?',
    ['ఆంధ్రప్రదేశ్-4.7 మరియు తెలంగాణ-4.9', 'ఆంధ్రప్రదేశ్-4.9 మరియు తెలంగాణ-4.7', 'ఆంధ్రప్రదేశ్-4.5 మరియు తెలంగాణ-5.1', 'ఆంధ్రప్రదేశ్-5.1 మరియు తెలంగాణ-4.5'],
    0,
    'Per the EAC-PM Working Paper (September 2024), in FY 2023-24, Andhra Pradesh accounted for 4.7% and Telangana for 4.9% of India\'s national GDP.',
    'EAC-PM నివేదిక ప్రకారం 2023-24 లో జాతీయ GDPలో ఆంధ్రప్రదేశ్ వాటా 4.7% మరియు తెలంగాణ వాటా 4.9%.'
  ],
  [
    67, 'economy', 'AP MSME Policy 4.0',
    'According to AP Industrial Policy (4.0), 2024-29 one of the following statements is not correct with regard to MSME sector in Andhra Pradesh.',
    ['AP accounts for 9 lakh registered MSMEs as on February 2024 according to Udyam data base', 'Majority of the MSMEs are concentrated in service sector accounting for 79%', 'There are 28 exclusive MSME parks in AP', 'The MSME sector is contributing 33.5% of GSDP in AP'],
    'AP పారిశ్రామిక విధానం (4.0), 2024-29 ప్రకారం ఆంధ్రప్రదేశ్‌లోని MSME రంగానికి సంబంధించి క్రింది ప్రకటనలలో ఏది సరైనది కాదు ?',
    ['ఉద్యమ్ డేటాబేస్ ప్రకారం ఫిబ్రవరి 2024 నాటికి AP లో 9 లక్షల నమోదిత MSME లు ఉన్నాయి', 'MSME లలో ఎక్కువ భాగం (79%) సేవారంగంలో కేంద్రీకృతమై ఉన్నాయి', 'AP లో 28 ప్రత్యేక MSME పార్కులు ఉన్నాయి', 'AP GSDP లో MSME రంగం అందించే వాటా 33.5%'],
    3,
    'The MSME & Entrepreneurship Development Policy (4.0) 2024-29 notes ~9.3 lakh Udyam MSMEs, 79% in services, and 28 exclusive MSME parks, whereas 33.5% is not its AP GSDP share.',
    'AP లోని MSME విధానం 4.0 ప్రకారం Udyam MSMEలు ~9 లక్షలు, 79% సేవారంగం మరియు 28 పార్కులు ఉన్నాయి, కానీ GSDP వాటా 33.5% అనేది సరైన ప్రకటన కాదు.'
  ],
  [
    68, 'economy', 'Foreign Exchange Market',
    'Which of the following statements is False ?',
    ['Exchange rate is the rate at which the currency of one country exchanges for the currency of another country', 'A direct quote is the number of units of a foreign currency exchangeable for one unit of home currency', 'An exchange rate regime is the system by which a country manages its currency with respect to foreign currencies', 'There are two major types of exchange rate regime : floating exchange rate and fixed exchange rate'],
    'క్రింది ప్రకటనలలో ఏది తప్పు ?',
    ['మారక రేటు అంటే ఒక దేశం యొక్క కరెన్సీ మరొక దేశం యొక్క కరెన్సీకి మారే రేటు', 'డైరెక్ట్ కోట్ అనేది ఒక యూనిట్ హోమ్ కరెన్సీకి మార్పిడి చేయగల విదేశీ కరెన్సీ యొక్క యూనిట్ల సంఖ్య', 'విదేశీ కరెన్సీలకు సంబంధించి దేశం తన కరెన్సీని నిర్వహించే వ్యవస్థను మారకపు రేటు పాలన అంటారు', 'మారకపు రేటు పాలనలో రెండు ప్రధాన రకాలు ఉన్నాయి : ఫ్లోటింగ్ మారకపు రేటు మరియు స్థిర మారకం రేటు'],
    1,
    'A direct quote states how much domestic (home) currency is needed to buy one unit of foreign currency (e.g., ₹84 = $1). Foreign currency per unit of home currency is an indirect quote.',
    'ఒక యూనిట్ విదేశీ కరెన్సీకి చెల్లించాల్సిన స్వదేశీ కరెన్సీ విలువను డైరెక్ట్ కోట్ అంటారు; ఆప్షన్ (2) ఇన్‌డైరెక్ట్ కోట్‌ను వివరిస్తుంది కాబట్టి అది తప్పు.'
  ],
  [
    69, 'economy', 'Balance of Trade & Devaluation',
    'Assertion (A): Devaluation will lead to improvement in balance of trade.\nReason (R) : Devaluation will lead to increase in price of exports.',
    ['Both (A) and (R) are true and (R) is the correct explanation of (A)', 'Both (A) and (R) are true and (R) is not the correct explanation of (A)', '(A) is true and (R) is false', '(A) is false and (R) is true'],
    'నిరూపణ (A) : ద్రవ్య విలువ తగ్గింపు వాణిజ్య సమతుల్యత మెరుగుదలకు దారితీస్తుంది.\nకారణం (R) : ద్రవ్య విలువ తగ్గింపు ఎగుమతుల ధరల పెరుగుదలకు దారితీస్తుంది.',
    ['(A) మరియు (R) రెండూ నిజం, మరియు (R) అనేది (A) యొక్క సరైన వివరణ', '(A) మరియు (R) రెండూ నిజం, మరియు (R) అనేది (A) యొక్క సరైన వివరణ కాదు', '(A) నిజం మరియు (R) తప్పు', '(A) తప్పు మరియు (R) నిజం'],
    2,
    'Devaluation improves the trade balance (subject to Marshall-Lerner condition) precisely because it makes domestic exports cheaper (not costlier) to foreign buyers.',
    'ద్రవ్య విలువ తగ్గింపు ఎగుమతుల ధరలను తగ్గిస్తుంది (పెంచదు) మరియు వాణిజ్య సమతుల్యతను మెరుగుపరుస్తుంది. అందువల్ల A నిజం మరియు R తప్పు.'
  ],
  [
    70, 'economy', 'AP Electronics Policy 4.0',
    'Which of the following is not the target of AP Electronics Manufacturing Policy (4.0), 2024-29 ?',
    ['Increase production in the State to USD 50 Billion', 'Attract investments worth USD 10 Billion', 'First time employment creation of 5 lakhs', 'First time entrepreneurship creation of 2 lakhs'],
    'క్రింది వాటిలో ఏది AP ఎలక్ట్రానిక్స్ మాన్యుఫ్యాక్చరింగ్ పాలసీ (4.0), 2024-29 లక్ష్యం కాదు ?',
    ['రాష్ట్రంలో ఉత్పత్తిని USD 50 బిలియన్లకు పెంచడం', 'USD 10 బిలియన్ల విలువైన పెట్టుబడులను ఆకర్షించడం', 'తొలిసారిగా 5 లక్షల మందికి ఉపాధి కల్పన', 'తొలిసారిగా 2 లక్షల వ్యవస్థాపకత సృష్టి'],
    3,
    'AP Electronics Manufacturing Policy (4.0) 2024-29 targets USD 50 Billion production, USD 10 Billion investment, and 5 lakh employment generation—not 2 lakh entrepreneurs.',
    'AP ఎలక్ట్రానిక్స్ పాలసీ (4.0) 2024-29 లక్ష్యాలలో USD 50B ఉత్పత్తి, USD 10B పెట్టుబడి మరియు 5 లక్షల ఉద్యోగాలు ఉన్నాయి; 2 లక్షల వ్యవస్థాపకత సృష్టి ఇందులో లేదు.'
  ],
  [
    71, 'economy', 'Macroeconomics & Investment',
    'The part of investment (Increase or Decrease) which takes place due to change in the level of national income is termed as',
    ['Gross investment', 'Net investment', 'Induced investment', 'Autonomous investment'],
    'జాతీయాదాయ స్థాయిలో మార్పు కారణంగా జరిగే పెట్టుబడి భాగాన్ని (పెరుగుదల లేదా తగ్గుదల) ఏమని అంటారు ?',
    ['స్థూల పెట్టుబడి', 'నికర పెట్టుబడి', 'ప్రేరేపిత పెట్టుబడి', 'స్వయం ప్రతిపత్తి పెట్టుబడి'],
    2,
    'Induced investment varies directly with changes in national income and aggregate demand, unlike income-inelastic autonomous investment.',
    'జాతీయ ఆదాయ స్థాయిలో మార్పుల కారణంగా మారే పెట్టుబడిని ప్రేరేపిత పెట్టుబడి (Induced investment) అంటారు.'
  ],
  [
    72, 'economy', 'AP Agriculture & Insurance',
    'Assertion (A) : In Andhra Pradesh, the coverage of farmers under Pradhan Mantri Fasal Bima Yojana has been increasing over the years.\nReason (R) : In Andhra Pradesh, significant crop losses occurred to farmers due to extreme weather events in recent years including floods, droughts and cyclones.',
    ['(A) is true, but (R) is false', '(A) is false, but (R) is true', 'Both (A) and (R) are true, but (R) is not the correct explanation of (A)', 'Both (A) and (R) are true and (R) is the correct explanation of (A)'],
    'వాదన (A) : ఆంధ్రప్రదేశ్‌లో ప్రధానమంత్రి ఫసల్ బీమా యోజన క్రింద రైతుల కవరేజీ సంవత్సరాలుగా పెరుగుతూ వస్తోంది.\nకారణం (R) : ఆంధ్రప్రదేశ్‌లో ఇటీవలి సంవత్సరాలలో వరదలు, కరువులు మరియు తుఫానులు వంటి విపరీత వాతావరణ సంఘటనల కారణంగా రైతులకు గణనీయమైన పంట నష్టాలు సంభవించాయి.',
    ['(A) నిజం, కానీ (R) తప్పు', '(A) తప్పు, కానీ (R) నిజం', '(A) మరియు (R) రెండూ నిజం, కానీ (R) అనేది (A) కి సరైన వివరణ కాదు', '(A) మరియు (R) రెండూ నిజం, మరియు (R) అనేది (A) యొక్క సరైన వివరణ'],
    3,
    'Frequent extreme weather events like cyclones, floods, and droughts highlight crop risk and drive rising farmer insurance coverage under PMFBY in Andhra Pradesh.',
    'వరదలు, తుఫానులు వంటి విపరీత వాతావరణ సంఘటనల వల్ల పంట నష్టాలు సంభవించడం PMFBY క్రింద రైతుల కవరేజీ పెరగడానికి కారణమవుతోంది.'
  ],
  [
    73, 'economy', 'AP Economy & GVA',
    'As per the second advanced estimates of National Statistical Office (NSO), MoSPI, GOI, what is the sector wise contribution of GVA at current prices for the year 2022-23 for Andhra Pradesh ?',
    ['Agriculture-36.19%, Industry-23.36% and Services-40.45%', 'Agriculture-23.36%, Industry-36.19% and Services-40.45%', 'Agriculture-40.45%, Industry-23.36% and Services-36.19%', 'Agriculture-26.19%, Industry-33.36% and Services-40.45%'],
    'భారత ప్రభుత్వ జాతీయ గణాంక కార్యాలయం (NSO), MoSPI రెండవ ముందస్తు అంచనాల ప్రకారం 2022-23 సంవత్సరానికి ప్రస్తుత ధరల వద్ద ఆంధ్రప్రదేశ్ GVA లో వివిధ రంగాల భాగం ఎంత ?',
    ['వ్యవసాయం-36.19%, పరిశ్రమ-23.36% మరియు సేవలు-40.45%', 'వ్యవసాయం-23.36%, పరిశ్రమ-36.19% మరియు సేవలు-40.45%', 'వ్యవసాయం-40.45%, పరిశ్రమ-23.36% మరియు సేవలు-36.19%', 'వ్యవసాయం-26.19%, పరిశ్రమ-33.36% మరియు సేవలు-40.45%'],
    0,
    'According to NSO MoSPI 2nd Advance Estimates (2022-23 at current prices), Andhra Pradesh\'s GVA shares were Agriculture 36.19%, Industry 23.36%, and Services 40.45%.',
    'NSO రెండవ ముందస్తు అంచనాల ప్రకారం 2022-23లో AP GVA లో వ్యవసాయం-36.19%, పరిశ్రమ-23.36%, సేవలు-40.45%.'
  ],
  [
    74, 'economy', 'AP Infrastructure & Economy',
    'Which International funding agencies committed to fund the Amaravati Capital City Phase-I Development in Andhra Pradesh ?',
    ['World Bank and IMF', 'World Bank and Asian Development Bank', 'World Bank and JICA', 'World Bank and European Commission'],
    'ఆంధ్రప్రదేశ్‌లో అమరావతి క్యాపిటల్ సిటీ ఫేజ్-I కి నిధులు సమకూర్చడానికి అంగీకరించిన అంతర్జాతీయ నిధుల ఏజెన్సీలు ఏవి ?',
    ['ప్రపంచ బ్యాంకు మరియు ఐఎంఎఫ్', 'ప్రపంచ బ్యాంకు మరియు ఆసియా అభివృద్ధి బ్యాంకు', 'ప్రపంచ బ్యాంకు మరియు జైకా', 'ప్రపంచ బ్యాంకు మరియు యూరోపియన్ కమిషన్'],
    1,
    'The World Bank and the Asian Development Bank (ADB) jointly committed USD 800 million each (~Rs. 13,600 crore total) for Amaravati Capital City Phase-I Development.',
    'అమరావతి క్యాపిటల్ సిటీ ఫేజ్-I అభివృద్ధికి ప్రపంచ బ్యాంకు మరియు ఆసియా అభివృద్ధి బ్యాంకు (ADB) నిధులు సమకూర్చడానికి అంగీకరించాయి.'
  ],
  [
    75, 'economy', 'Industrial Policy 1956',
    'Which of the following are the major provisions of the Industrial Policy Resolution 1956 ?\nI. Provision of licencing.\nII. Expansion of public sector.\nIII. Emphasis on small industries.',
    ['I and II only', 'II and III only', 'I and III only', 'I, II, III'],
    'పారిశ్రామిక విధాన తీర్మానం 1956లోని ప్రధాన నిబంధనలు ఏవి ?\nI. లైసెన్సింగ్ యొక్క నిబంధన.\nII. ప్రభుత్వరంగ విస్తరణ.\nIII. చిన్న పరిశ్రమలకు ప్రాధాన్యత.',
    ['I మరియు II మాత్రమే', 'II మరియు III మాత్రమే', 'I మరియు III మాత్రమే', 'I, II, III'],
    3,
    'The Industrial Policy Resolution of 1956 (the "Economic Constitution of India") incorporated industrial licensing, major expansion of the public sector, and encouragement to small-scale/cottage industries.',
    '1956 పారిశ్రామిక విధాన తీర్మానంలో లైసెన్సింగ్ విధానం, ప్రభుత్వ రంగ విస్తరణ మరియు చిన్న పరిశ్రమలకు ప్రాధాన్యత అనే మూడు నిబంధనలూ ఉన్నాయి.'
  ],

  // ================= SECTION B: SCIENCE AND TECHNOLOGY (Q76 - Q150) =================
  [
    76, 'science', 'Environment & Climate Change',
    'What is the key characteristic of black carbon that accelerates global warming ?',
    ['It is a type of methane', 'It is a short-lived pollutant produced by incomplete combustion', 'It is released by CFCs', 'It directly depletes the ozone layer'],
    'బ్లాక్ కార్బన్ యొక్క ఏ ముఖ్య లక్షణం గ్లోబల్ వార్మింగ్‌ను వేగవంతం చేస్తుంది ?',
    ['ఇది ఒక రకమైన మీథేన్', 'ఇది అసంపూర్ణ దహనం ద్వారా ఉత్పత్తి చేయబడిన స్వల్పకాలిక కాలుష్యం', 'ఇది CFCల ద్వారా విడుదల చేయబడుతుంది', 'ఇది నేరుగా ఓజోన్ పొరను క్షీణింపజేస్తుంది'],
    1,
    'Black carbon (soot) is a short-lived climate pollutant formed by incomplete combustion of fossil fuels and biomass; it strongly absorbs solar radiation and accelerates snow/ice melt.',
    'బ్లాక్ కార్బన్ అసంపూర్ణ దహనం వల్ల ఏర్పడే స్వల్పకాలిక కాలుష్యకారి, ఇది సౌర వికిరణాన్ని గ్రహించి భూతాపాన్ని వేగవంతం చేస్తుంది.'
  ],
  [
    77, 'science', 'Defence & Space Technology',
    'BrahMos supersonic cruise missile is developed by the joint efforts of',
    ['India and USA', 'India and Russia', 'India and France', 'India and Japan'],
    'బ్రహ్మోస్ సూపర్‌సోనిక్ క్రూయిజ్ క్షిపణి వీటి సంయుక్త కృషితో అభివృద్ధి చేసారు.',
    ['భారతదేశం మరియు యు.ఎస్.ఎ.', 'భారతదేశం మరియు రష్యా', 'భారతదేశం మరియు ఫ్రాన్స్', 'భారతదేశం మరియు జపాన్'],
    1,
    'BrahMos is a joint venture between India\'s DRDO and Russia\'s NPO Mashinostroyenia (named after Brahmaputra and Moskva rivers).',
    'బ్రహ్మోస్ క్షిపణిని భారతదేశంలోని DRDO మరియు రష్యాలోని NPO మషినోస్ట్రోయెనియా సంయుక్తంగా అభివృద్ధి చేశాయి.'
  ],
  [
    78, 'science', 'Biology & Human Diseases',
    'Disease transmitting vector is not a Mosquito for which disease ?',
    ['Chikungunya', 'Leishmaniasis', 'Dengue', 'Malaria'],
    'క్రింది వాటిలో దోమ ద్వారా వ్యాప్తి కాని వ్యాధి ఏది ?',
    ['చికున్‌గున్యా', 'లీష్మానియాసిస్', 'డెంగ్యూ', 'మలేరియా'],
    1,
    'Leishmaniasis (Kala-azar) is transmitted by infected female phlebotomine sandflies, whereas Chikungunya, Dengue, and Malaria are mosquito-borne.',
    'లీష్మానియాసిస్ (కాలా అజర్) ఇసుక ఈగల (శాండ్‌ఫ్లై) ద్వారా వ్యాపిస్తుంది; మిగిలిన మూడు దోమల ద్వారా వ్యాపిస్తాయి.'
  ],
  [
    79, 'science', 'Biotechnology & Regulation',
    'Which Organization regulates Genetically Modified Organisms (GMOs) in India ?',
    ['Food Safety and Standards Authority of India (FSSAI)', 'Genetic Engineering Appraisal Committee (GEAC)', 'Central Pollution Control Board (CPCB)', 'Indian Council of Agricultural Research (ICAR)'],
    'భారతదేశంలో జన్యుపరంగా మార్పు చెందిన జీవులను (GMOలు) ఏ సంస్థ నియంత్రిస్తుంది ?',
    ['ఫుడ్ సేఫ్టీ అండ్ స్టాండర్డ్స్ అథారిటీ ఆఫ్ ఇండియా (FSSAI)', 'జెనెటిక్ ఇంజనీరింగ్ అప్రైజల్ కమిటీ (GEAC)', 'కేంద్ర కాలుష్య నియంత్రణ మండలి (CPCB)', 'ఇండియన్ కౌన్సిల్ ఆఫ్ అగ్రికల్చరల్ రీసెర్చ్ (ICAR)'],
    1,
    'The Genetic Engineering Appraisal Committee (GEAC) under the Ministry of Environment, Forest and Climate Change regulates GMOs under the Environment Protection Act, 1986.',
    'భారతదేశంలో జన్యు మార్పిడి జీవులను (GMOలు) పర్యావరణ మంత్రిత్వ శాఖ పరిధిలోని GEAC నియంత్రిస్తుంది.'
  ],
  [
    80, 'science', 'Ecology & Biodiversity',
    'Forests that are located in mid latitude areas between tropics and polar region',
    ['Temperate deciduous forests', 'Coniferous forests', 'Grass lands', 'Scrub jungles'],
    'ఉష్ణమండల మరియు ధ్రువ ప్రాంతాల మధ్య గల మధ్య అక్షాంశ ప్రాంతాలలో ఉన్న అడవులు',
    ['సమశీతోష్ణ ఆకురాల్చే అడవులు', 'శంఖాకార అడవులు', 'గడ్డి భూములు', 'స్క్రబ్ అడవులు'],
    0,
    'Temperate deciduous forests occur in the mid-latitude regions lying between the tropics and the polar circles.',
    'ఉష్ణమండల మరియు ధ్రువ ప్రాంతాల మధ్య అక్షాంశాలలో సమశీతోష్ణ ఆకురాల్చే అడవులు (Temperate deciduous forests) కనిపిస్తాయి.'
  ],
  [
    81, 'science', 'Space Technology & ISRO',
    'Geosynchronous Satellite Launch Vehicle (GSLV) launchers have',
    ['One solid rocket motor stage, one earth storable liquid stage and one cryogenic stage', 'First and third stage solid rocket motors and second and fourth stages liquid rocket motors', 'Three liquid stage motors and one solid stage motors', 'One liquid stage motor and three solid stage motors'],
    'జియోసింక్రోనస్ సాటిలైట్ లాంచ్ వెహికల్ (GSLV) లాంచర్లు ఏమి కలిగి ఉంటాయి ?',
    ['ఒక ఘన రాకెట్ మోటార్ దశ, ఒక ఎర్త్ స్టోరబుల్ ద్రవ దశ మరియు ఒక క్రయోజనిక్ దశ', 'మొదటి మరియు మూడవ దశ ఘన రాకెట్ మోటార్లు మరియు రెండవ మరియు నాల్గవ దశ ద్రవ రాకెట్ మోటార్లు', 'మూడు ద్రవ దశ మోటార్లు మరియు ఒక ఘన దశ మోటార్లు', 'ఒక ద్రవ దశ మోటారు మరియు మూడు ఘన దశ మోటార్లు'],
    0,
    'ISRO\'s GSLV is a three-stage launcher featuring a solid first stage (S139), an earth-storable liquid second stage (Vikas), and a cryogenic upper third stage.',
    'GSLV మూడు దశల రాకెట్: మొదటి దశ ఘన ఇంధనం, రెండవ దశ ద్రవ ఇంధనం మరియు మూడవ దశ క్రయోజనిక్ దశ కలిగి ఉంటుంది.'
  ],
  [
    82, 'science', 'Environment & Pollution',
    'Match the pollution type with its major source.\nPollution Type\na. Air Pollution\nb. Water Pollution\nc. Soil Pollution\nd. Noise Pollution\n\nMajor Source\nI. Sewage\nII. Industrial emissions\nIII. Use of chemical fertilizers\nIV. Construction activities\n\nCodes (a b c d) :',
    ['I  II  IV  III', 'II  I  III  IV', 'I  II  III  IV', 'IV  II  I  III'],
    'కాలుష్య రకాన్ని దాని ప్రధాన మూలంతో సరిపోల్చండి.\nకాలుష్య రకం\na. వాయు కాలుష్యం\nb. నీటి కాలుష్యం\nc. నేల కాలుష్యం\nd. శబ్ద కాలుష్యం\n\nప్రధాన మూలం\nI. మురుగు నీరు (సీవేజ్)\nII. పారిశ్రామిక ఉద్గారాలు\nIII. రసాయన ఎరువుల వాడకం\nIV. నిర్మాణ కార్యకలాపాలు\n\nకోడ్‌లు (a b c d) :',
    ['I  II  IV  III', 'II  I  III  IV', 'I  II  III  IV', 'IV  II  I  III'],
    1,
    'Air Pollution matches Industrial emissions (II), Water Pollution with Sewage (I), Soil Pollution with Chemical fertilizers (III), and Noise Pollution with Construction activities (IV).',
    'వాయు కాలుష్యం-పారిశ్రామిక ఉద్గారాలు (II), నీటి కాలుష్యం-మురుగునీరు (I), నేల కాలుష్యం-రసాయన ఎరువులు (III), శబ్ద కాలుష్యం-నిర్మాణ కార్యకలాపాలు (IV).'
  ],
  [
    83, 'science', 'Climate Change & Missions',
    'How many core missions are included in India\'s National Action Plan on Climate Change (NAPCC) ?',
    ['5', '8', '12', '10'],
    'వాతావరణ మార్పుపై భారతదేశ జాతీయ కార్యాచరణ ప్రణాళిక (NAPCC) లో ఎన్ని ప్రధాన నియోగాలు (మిషన్లు) చేర్చబడ్డాయి ?',
    ['5', '8', '12', '10'],
    1,
    'Launched in 2008, India\'s National Action Plan on Climate Change (NAPCC) outlines 8 core national missions.',
    'భారతదేశ జాతీయ వాతావరణ మార్పు కార్యాచరణ ప్రణాళిక (NAPCC) లో మొత్తం 8 ప్రధాన మిషన్లు ఉన్నాయి.'
  ],
  [
    84, 'science', 'Ecology & Population',
    'Population density is generally expressed as',
    ['The total number of individuals in a population', 'The number of individuals per unit area', 'The geographic distribution of the population', 'The number of individuals within a sample area'],
    'జనాభా సాంద్రత సాధారణంగా ఇలా వ్యక్తీకరించబడుతుంది',
    ['జనాభాలో మొత్తం వ్యక్తుల సంఖ్య', 'యూనిట్ ప్రాంతంలోని వ్యక్తుల సంఖ్య', 'జనాభా యొక్క భౌగోళిక పంపిణీ', 'నమూనా ప్రాంతంలోని వ్యక్తుల సంఖ్య'],
    1,
    'Population density is defined as the number of individuals of a species living per unit area (e.g., per square kilometer).',
    'యూనిట్ విస్తీర్ణంలో నివసించే వ్యక్తుల సంఖ్యను జనాభా సాంద్రత అంటారు.'
  ],
  [
    85, 'science', 'Biotechnology & Environment',
    'What is the primary environmental concern associated with Genetically Modified (GM) crops ?',
    ['Cross-pollination with non-GM crops', 'Reduced pesticide use', 'Increased yield', 'Soil degradation'],
    'జన్యుపరంగా మార్పు చెందిన (GM) పంటలకు సంబంధించిన ప్రాథమిక పర్యావరణ ఆందోళన ఏమిటి ?',
    ['GM కాని పంటలతో పర-పరాగసంపర్కం', 'పురుగుమందుల వాడకం తగ్గడం', 'దిగుబడి పెరగడం', 'నేల క్షీణత'],
    0,
    'A key ecological concern with GM crops is gene flow via cross-pollination to wild relatives or non-GM varieties, potentially creating herbicide-resistant superweeds.',
    'GM పంటలు GM కాని పంటలు లేదా కలుపు మొక్కలతో పర-పరాగసంపర్కం చెందడం ద్వారా జన్యు బదిలీ జరగడం ప్రధాన పర్యావరణ ఆందోళన.'
  ],
  [
    86, 'science', 'Ecology & Biodiversity',
    'Match List – I with List – II and choose the correct answer using the codes given below.\nList – I (Biotic factor)\na. Humans\nb. Saprotrophs\nc. Reptiles\nd. Camel\n\nList – II (Characteristic feature)\nI. Recycling nutrients\nII. Top order heterotrophs in food chain\nIII. Less urinating animal\nIV. Stenothermal\n\nCodes (a b c d) :',
    ['IV  III  I  II', 'II  I  III  IV', 'II  I  IV  III', 'IV  III  II  I'],
    'జాబితా – I తో జాబితా – II ను సరిపోల్చి క్రింద యిచ్చిన కోడ్లను ఉపయోగించి సరైన సమాధానాన్ని ఎంచుకోండి.\nజాబితా – I (బయోటిక్ ఫ్యాక్టర్)\na. మానవులు\nb. సప్రోట్రోఫ్స్\nc. సరీసృపాలు (Reptiles)\nd. ఒంటె\n\nజాబితా – II (గుర్తు లక్షణం)\nI. పోషకాలను రీసైక్లింగ్ చేయడం\nII. ఆహార గొలుసులో టాప్ ఆర్డర్ హెటెరోట్రోఫ్లు\nIII. తక్కువ మూత్ర విసర్జన చేసే జంతువు\nIV. స్టెనోథర్మల్\n\nకోడ్‌లు (a b c d) :',
    ['IV  III  I  II', 'II  I  III  IV', 'II  I  IV  III', 'IV  III  II  I'],
    2,
    'Humans are top-order heterotrophs (II), Saprotrophs recycle nutrients (I), Reptiles are stenothermal cold-blooded animals (IV), and Camel is adapted as a less-urinating desert animal (III).',
    'మానవులు-టాప్ ఆర్డర్ హెటెరోట్రోఫ్లు (II), సప్రోట్రోఫ్స్-పోషకాల రీసైక్లింగ్ (I), సరీసృపాలు-స్టెనోథర్మల్ (IV), ఒంటె-తక్కువ మూత్ర విసర్జన (III).'
  ],
  [
    87, 'science', 'Environmental Laws & Institutions',
    'National Green Tribunal (NGT) was established to',
    ['Monitor industrial pollution levels', 'Enforce emission standards for vehicles', 'Handle cases related to environmental protection and pollution control', 'Regulate water quality in rivers'],
    'నేషనల్ గ్రీన్ ట్రిబ్యునల్ (NGT) కర్తవ్యం',
    ['పారిశ్రామిక కాలుష్య స్థాయిలను పర్యవేక్షించడం', 'వాహనాలకు ఉద్గార ప్రమాణాలను అమలు చేయడం', 'పర్యావరణ పరిరక్షణ మరియు కాలుష్య నియంత్రణకు సంబంధించిన కేసులను పరిష్కరించడం', 'నదులలో నీటి నాణ్యతను నియంత్రించడం'],
    2,
    'Established under the NGT Act 2010, the National Green Tribunal provides speedy and specialized adjudication of cases relating to environmental protection and forest/natural resource conservation.',
    'పర్యావరణ పరిరక్షణ, అడవుల సంరక్షణ మరియు కాలుష్య నియంత్రణకు సంబంధించిన కేసులను వేగంగా పరిష్కరించడానికి NGT స్థాపించబడింది.'
  ],
  [
    88, 'science', 'Climate Change & Missions',
    'India\'s National Action Plan on Climate Change (NAPCC) aims to address',
    ['Only greenhouse gas emissions', 'Mitigation and adaptation strategies for climate change', 'Biodiversity conservation', 'Air pollution control'],
    'వాతావరణ మార్పులపై భారతదేశం యొక్క జాతీయ కార్యాచరణ ప్రణాళిక (NAPCC) వీటిని పరిష్కరించడం లక్ష్యంగా పెట్టుకుంది',
    ['గ్రీన్‌హౌస్ వాయు ఉద్గారాలు మాత్రమే', 'వాతావరణ మార్పుల కోసం ఉపశమన మరియు అనుసరణ వ్యూహాలు', 'జీవవైవిధ్య పరిరక్షణ', 'వాయు కాలుష్య నియంత్రణ'],
    1,
    'NAPCC balances climate change mitigation (solar, energy efficiency) and adaptation strategies (sustainable agriculture, water, Himalayan ecosystem) alongside sustainable development.',
    'వాతావరణ మార్పుల ఉపశమన (మిటిగేషన్) మరియు అనుసరణ (అడాప్టేషన్) వ్యూహాలను రూపొందించడం NAPCC ప్రధాన లక్ష్యం.'
  ],
  [
    89, 'science', 'Information & Cyber Technology',
    'The terms ‘Petya’ and ‘WannaCry’ are related to',
    ['Mobile apps', 'Ransomware', 'Virtual reality', 'Mini Satellites'],
    '\'పెట్యా\' మరియు \'వాన్నాక్రై\' అనే పదాలు దీనికి సంబంధించినది.',
    ['మొబైల్ ఆప్‌లు', 'రాన్సమ్‌వేర్', 'వర్చువల్ రియాలిటి', 'మిని సాటిలైట్స్'],
    1,
    'Petya and WannaCry (2017) are infamous global ransomware cyberattacks that encrypted victims\' systems and demanded cryptocurrency payments.',
    'పెట్యా మరియు వాన్నాక్రై అనేవి ప్రపంచవ్యాప్తంగా కంప్యూటర్లను ప్రభావితం చేసిన ప్రముఖ రాన్సమ్‌వేర్ (Ransomware) సైబర్ దాడులు.'
  ],
  [
    90, 'science', 'Digital Health & Science',
    'Subject that is not associated with Ayushman Bharat Digital Mission',
    ['Arogya Mitra', 'Health ID', 'Sand Box', 'Healthcare Professionals Registry'],
    'ఆయుష్మాన్ భారత్ డిజిటల్ మిషన్‌తో సంబంధం లేని విషయం',
    ['ఆరోగ్య మిత్ర', 'ఆరోగ్య ID', 'సాండ్ బాక్స్', 'ఆరోగ్య సంరక్షణ నిపుణుల రిజిస్ట్రీ'],
    0,
    'ABHA/Health ID, Healthcare Professionals Registry (HPR), and ABDM Sandbox are core digital pillars of ABDM, whereas Arogya Mitra refers to hospital facilitators under AB-PMJAY.',
    'ఆరోగ్య ID, సాండ్ బాక్స్ మరియు ఆరోగ్య సంరక్షణ నిపుణుల రిజిస్ట్రీ ABDMలో భాగాలు కాగా, ఆరోగ్య మిత్ర అనేది AB-PMJAY పథకానికి సంబంధించినది.'
  ],
  [
    91, 'science', 'Biotechnology & Waste Management',
    'Which of the following is NOT an example of a bioremediation technique ?',
    ['Oil spill clean-up using bacteria', 'Using plants to absorb pollutants', 'Burning contaminated soil', 'Composting organic waste'],
    'క్రింది వాటిలో ఏది బయోరెమిడియేషన్ పద్ధతికి ఉదాహరణ కాదు ?',
    ['బ్యాక్టీరియాను ఉపయోగించి చిందిన చమురుని శుభ్రపరచడం', 'కాలుష్య కారకాలను తొలగించడానికి మొక్కలను ఉపయోగించడం', 'కలుషితమైన మట్టిని కాల్చడం', 'సేంద్రీయ వ్యర్థాలను కంపోస్ట్ చేయడం'],
    2,
    'Bioremediation uses living organisms (microbes, fungi, plants) to degrade pollutants; thermal burning/incineration of contaminated soil is a physical/thermal method.',
    'బయోరెమిడియేషన్‌లో సూక్ష్మజీవులు లేదా మొక్కలను ఉపయోగిస్తారు; కలుషితమైన మట్టిని కాల్చడం ఉష్ణ/భౌతిక పద్ధతి, బయోరెమిడియేషన్ కాదు.'
  ],
  [
    92, 'science', 'Bioremediation & Ecology',
    'How does In-situ bioremediation differ from ex-situ bioremediation ?',
    ['It is more expensive and involves transport of contaminants', 'It treats contaminated material directly at the site', 'It uses chemicals instead of micro-organisms', 'It requires more excavation'],
    'ఇన్-సిటు బయోరెమిడియేషన్, ఎక్స్-సిటు బయోరెమిడియేషన్ నుండి భిన్నంగా ఎలా ఉంటుంది ?',
    ['ఇది చాలా ఖరీదైనది మరియు కలుషితాల రవాణాను కలిగి ఉంటుంది', 'ఇది నేరుగా ప్రదేశము (సైటు) వద్ద కలుషితమైన పదార్థాన్ని బాగుచేస్తుంది', 'ఇది సూక్ష్మజీవులకు బదులుగా రసాయనాలను ఉపయోగిస్తుంది', 'దీనికి మరింత తవ్వకం అవసరం'],
    1,
    'In-situ bioremediation treats soil or groundwater directly at the original contamination site without excavating and transporting material elsewhere.',
    'ఇన్-సిటు బయోరెమిడియేషన్ కలుషిత పదార్థాలను ఎక్కడికీ తరలించకుండా అక్కడికక్కడే శుద్ధి చేస్తుంది.'
  ],
  [
    93, 'science', 'Climate Change Agreements',
    'Which of the following countries is/are legally bound by the emissions reduction targets set by the Paris Agreement ?',
    ['United States and China', 'India', 'European Union', 'None of these'],
    'పారిస్ ఒప్పందం ద్వారా నిర్దేశించబడిన ఉద్గారాల తగ్గింపు లక్ష్యాలకు క్రింది దేశాల్లో ఏది(వి) చట్టబద్ధంగా కట్టుబడి ఉంది (ఉన్నాయి) ?',
    ['యునైటెడ్ స్టేట్స్ మరియు చైనా', 'భారతదేశం', 'యూరోపియన్ యూనియన్', 'వీటిలో ఏవీ లేవు'],
    3,
    'Under the 2015 Paris Agreement, Nationally Determined Contributions (NDCs) are submitted voluntarily and are NOT legally binding targets on individual parties.',
    'పారిస్ ఒప్పందంలోని ఉద్గార తగ్గింపు లక్ష్యాలు (NDCలు) ఏ దేశానికీ చట్టబద్ధంగా కట్టుబడి ఉండేవి కావు.'
  ],
  [
    94, 'science', 'Renewable Energy',
    'India has the ___________ largest installed wind power capacity in the world.',
    ['Fourth', 'Second', 'Eighth', 'Sixth'],
    'ప్రపంచంలోకెల్లా భారతదేశం ___________ అతి పెద్ద స్థాపించబడిన పవనశక్తిని కలిగి ఉంది.',
    ['నాలుగవ', 'రెండవ', 'ఎనిమిదవ', 'ఆరవ'],
    0,
    'India holds the 4th largest installed wind power capacity globally (after China, the USA, and Germany).',
    'ప్రపంచంలో అత్యధిక స్థాపిత పవన విద్యుత్ సామర్థ్యం కలిగిన దేశాలలో భారతదేశం నాలుగవ స్థానంలో ఉంది.'
  ],
  [
    95, 'science', 'Energy & Environment',
    'What is the primary goal of India\'s National Clean Energy Fund (NCEF) ?',
    ['Promote coal-based power generation', 'Promote renewable energy technologies and reduce carbon emissions', 'Increase consumption of fossil fuels', 'Improve forest conservation practices'],
    'భారతదేశ జాతీయ క్లీన్ ఎనర్జీ ఫండ్ (NCEF) యొక్క ప్రాథమిక లక్ష్యం ఏమిటి ?',
    ['బొగ్గు ఆధారిత విద్యుత్ ఉత్పత్తిని ప్రోత్సహించడం', 'పునరుత్పాదక ఇంధన సాంకేతికతలను ప్రోత్సహించడం మరియు కార్బన్ ఉద్గారాలను తగ్గించడం', 'శిలాజ ఇంధనాల వినియోగాన్ని పెంచడం', 'అటవీ సంరక్షణ పద్ధతులను మెరుగుపరచడం'],
    1,
    'The National Clean Energy Fund (NCEF), funded via a clean energy cess on coal, was created to finance clean/renewable energy research and innovative green projects.',
    'పునరుత్పాదక ఇంధన సాంకేతికతలను ప్రోత్సహించడం మరియు కార్బన్ ఉద్గారాలను తగ్గించడం NCEF ప్రధాన లక్ష్యం.'
  ],
  [
    96, 'science', 'Environmental Conventions',
    'Which International Agreement does not focus on reducing greenhouse gas emissions to combat climate change ?',
    ['Montreal Protocol', 'Kyoto Protocol', 'Paris Agreement', 'Basel Convention'],
    'ఏ అంతర్జాతీయ ఒప్పందం వాతావరణ మార్పులను ఎదుర్కోవడానికి గ్రీన్‌హౌస్ వాయు ఉద్గారాలను తగ్గించడంపై దృష్టి సారించదు ?',
    ['మాంట్రియల్ ప్రోటోకాల్', 'క్యోటో ప్రోటోకాల్', 'పారిస్ ఒప్పందం', 'బాసెల్ కన్వెన్షన్'],
    3,
    'The Basel Convention regulates transboundary movements and disposal of hazardous wastes; Kyoto, Paris, and Montreal (via Kigali Amendment on HFCs) address climate/atmospheric gases.',
    'బాసెల్ కన్వెన్షన్ ప్రమాదకర వ్యర్థాల సరిహద్దు తరలింపు నియంత్రణకు సంబంధించినది; గ్రీన్‌హౌస్ వాయువుల తగ్గింపుపై కాదు.'
  ],
  [
    97, 'science', 'Sustainable Development',
    'How many Sustainable Development Goals (SDGs) has the United Nations established ?',
    ['17', '10', '12', '20'],
    'ఐక్యరాజ్యసమితి ఎన్ని సుస్థిర అభివృద్ధి లక్ష్యాలను (సస్టైనబుల్ డెవలప్‌మెంట్ గోల్స్) (SDGలు) ఏర్పాటు చేసింది ?',
    ['17', '10', '12', '20'],
    0,
    'The UN 2030 Agenda for Sustainable Development comprises 17 Sustainable Development Goals (SDGs) and 169 targets.',
    'ఐక్యరాజ్యసమితి 2030 ఎజెండాలో మొత్తం 17 సుస్థిర అభివృద్ధి లక్ష్యాలు (SDGs) ఉన్నాయి.'
  ],
  [
    98, 'science', 'Biodiversity & Treaties',
    'CITES (Convention on International Trade in Endangered Species of Wild Fauna and Flora) is also known as',
    ['Geneva Convention', 'Kyoto Protocol', 'Washington Convention', 'Paris Agreement'],
    'CITES ని (అంతరించిపోతున్న జంతుజాలం మరియు పక్షి జాతులలో అంతర్జాతీయ వాణిజ్యం పై సమావేశం) ఇలా కూడా అంటారు.',
    ['జెనీవా సమావేశం', 'క్యోటో ప్రోటోకాల్', 'వాషింగ్టన్ సమావేశం', 'పారిస్ ఒప్పందం'],
    2,
    'CITES was adopted in Washington, D.C. on 3 March 1973 and is widely known as the Washington Convention.',
    'CITES ను వాషింగ్టన్ కన్వెన్షన్ (Washington Convention) అని కూడా పిలుస్తారు.'
  ],
  [
    99, 'science', 'Sustainable Agriculture',
    'Which of the following is an example of an environmentally friendly technology used in agriculture ?',
    ['Genetically modified crops', 'Organic farming', 'Pesticide spraying', 'Chemical fertilizers'],
    'క్రింది వాటిలో వ్యవసాయంలో ఉపయోగించే పర్యావరణ అనుకూల సాంకేతికతకు ఏది ఉదాహరణ ?',
    ['జన్యుపరంగా మార్పు చెందిన పంటలు', 'సేంద్రీయ వ్యవసాయం', 'పురుగుమందుల పిచికారీ', 'రసాయన ఎరువులు'],
    1,
    'Organic farming avoids synthetic fertilizers and chemical pesticides, maintaining soil fertility and ecological balance sustainably.',
    'రసాయన ఎరువులు మరియు పురుగుమందులు లేకుండా చేసే సేంద్రీయ వ్యవసాయం పర్యావరణ అనుకూల పద్ధతికి ఉదాహరణ.'
  ],
  [
    100, 'science', 'Waste Management & Treaties',
    'What is a global issue associated with the trans-boundary movement of waste ?',
    ['Reduction in greenhouse gas emissions', 'Sustainable waste management', 'Physical transfer of hazardous waste for reprocessing or storage', 'Elimination of deforestation and desertification'],
    'వ్యర్థాల సరిహద్దు ఆవల తరలింపుతో ముడిపడి ఉన్న ప్రపంచ సమస్య ఏమిటి ?',
    ['గ్రీన్‌హౌస్ వాయు విసర్జనాల తగ్గింపు', 'సుస్థిరమైన వ్యర్థాల నిర్వహణ', 'రీప్రాసెసింగ్ లేదా నిల్వ కోసం ప్రమాదకరమైన వ్యర్థాలను భౌతికంగా బదిలీ చేయడం', 'అటవీ నాశనం మరియు ఎడారీకరణం నిర్మూలన'],
    2,
    'Transboundary movement of hazardous and toxic waste from developed to developing countries poses severe environmental and health risks, prompting treaties like the Basel Convention.',
    'ప్రమాదకర వ్యర్థాలను రీప్రాసెసింగ్ లేదా నిల్వ కోసం ఇతర దేశాలకు భౌతికంగా బదిలీ చేయడం ప్రధాన ప్రపంచ సమస్య.'
  ],
  [
    101, 'science', 'Solid Waste Management',
    'Which of the following methods is used for solid waste disposal in urban areas of India ?',
    ['Composting', 'Incineration', 'Landfilling', 'All the above'],
    'భారతదేశంలోని పట్టణ ప్రాంతాల్లో ఘన వ్యర్థాలను పారవేసేందుకు (డిస్పోజల్) క్రింది వాటిలో ఉపయోగించే పద్ధతి ఏది/ఏవి ?',
    ['కంపోస్టింగ్ (పదార్థములను కప్పి ఎరువు తయారు చేయుట)', 'దహనం', 'ల్యాండ్‌ఫిల్లింగ్ (వ్యర్థాలను గుంటలలో పూడ్చడం)', 'పైవన్నీ'],
    3,
    'Urban local bodies in India employ composting for biodegradable waste, incineration/waste-to-energy plants, and engineered/sanitary landfilling.',
    'భారతదేశ పట్టణ ప్రాంతాలలో ఘన వ్యర్థాల నిర్వహణకు కంపోస్టింగ్, దహనం మరియు ల్యాండ్‌ఫిల్లింగ్ అన్నింటినీ ఉపయోగిస్తారు.'
  ],
  [
    102, 'science', 'Ecology & Food Chains',
    'Assertion (A) : Grazing food chain begins with dead leaves via herbivores to carnivores.\nReason (R) : In grazing food chain autotrophs capture energy and transfer to herbivores.',
    ['(A) and (R) are correct and (R) is the correct explanation of (A)', '(A) and (R) are correct but (R) is not the correct explanation of (A)', '(A) is correct but (R) is not correct', '(A) is not correct but (R) is correct'],
    'వాదన (A) : మేత ఆహార గొలుసు (గ్రేజింగ్ ఫుడ్ చైన్) చనిపోయిన ఆకులతో ప్రారంభమై శాకాహారుల నుండి మాంసాహారులకు చేరుతుంది.\nకారణం (R) : మేత ఆహార గొలుసులో ఆటోట్రోఫ్‌లు శక్తిని సంగ్రహించి శాకాహారులకు బదిలీ చేస్తాయి.',
    ['(A) మరియు (R) సరైనవి మరియు (A) కి (R) సరైన వివరణ', '(A) మరియు (R) సరైనవి కానీ (A) కి (R) సరైన వివరణ కాదు', '(A) సరైనది కానీ (R) సరైనది కాదు', '(A) సరైనది కాదు కానీ (R) సరైనది'],
    3,
    'A grazing food chain begins with living green plants (autotrophs), whereas dead organic matter/leaves starts the detritus food chain. Thus (A) is incorrect and (R) is correct.',
    'గ్రేజింగ్ ఫుడ్ చైన్ ఆకుపచ్చ మొక్కలతో (ఆటోట్రోఫ్‌లతో) ప్రారంభమవుతుంది, చనిపోయిన ఆకులతో కాదు (డిట్రిటస్ చైన్). కనుక A తప్పు, R సరైనది.'
  ],
  [
    103, 'science', 'Pollution Control & Tech',
    'Which of the following is NOT an alternative to conventional pollution control methods ?',
    ['Green technology', 'Bioremediation', 'Carbon capture and storage', 'Incineration of waste'],
    'కింది వాటిలో ఏది సాంప్రదాయ కాలుష్య నియంత్రణ పద్ధతులకు ప్రత్యామ్నాయం కాదు ?',
    ['గ్రీన్ టెక్నాలజీ', 'బయోరెమిడియేషన్', 'కార్బన్ సంగ్రహణ మరియు నిల్వ', 'వ్యర్థాలను కాల్చడం'],
    3,
    'Incineration of waste is a conventional thermal disposal technique rather than an eco-friendly/modern alternative like green tech, bioremediation, or CCS.',
    'వ్యర్థాలను కాల్చడం (ఇన్సినరేషన్) సాంప్రదాయ పద్ధతి, ఇది ఆధునిక ప్రత్యామ్నాయ కాలుష్య నియంత్రణ పద్ధతి కాదు.'
  ],
  [
    104, 'science', 'Public Health in India',
    'What is the "dual burden" India faces in public health ?',
    ['Rising rates of both infectious and non-communicable diseases', 'Overburdened doctors and healthcare infrastructure', 'Lack of insurance and financial access', 'High rates of both obesity and malnutrition'],
    'ప్రజారోగ్యంలో భారతదేశం ఎదుర్కొంటున్న “ద్వంద్వ భారం” ఏమిటి ?',
    ['అంటు మరియు సంక్రమించని (నాన్-కమ్యూనికేబుల్) వ్యాధుల పెరుగుదల రేట్లు', 'అధిక భారం ఉన్న వైద్యులు మరియు ఆరోగ్య సంరక్షణ మౌలిక సదుపాయాలు', 'బీమా మరియు ఆర్థిక అందుబాటు (యాక్సెస్) లేకపోవడం', 'ఊబకాయం మరియు పోషకాహార లోపం రెండింటి యొక్క అధిక రేట్లు'],
    0,
    'India\'s epidemiological transition presents a "dual burden" of disease—continuing prevalence of communicable/infectious diseases alongside rapidly rising non-communicable diseases (NCDs).',
    'భారతదేశంలో అంటువ్యాధులు మరియు సంక్రమించని వ్యాధులు (NCDలు) రెండూ పెరగడాన్ని ప్రజారోగ్యంలో ద్వంద్వ భారం అంటారు.'
  ],
  [
    105, 'science', 'Agricultural Technology',
    'Which technology can reduce the environmental impact of traditional farming, especially in water scarce regions ?',
    ['Drip irrigation', 'Chemical pesticides', 'Flood irrigation', 'Monocropping'],
    'పర్యావరణంపై సాంప్రదాయ వ్యవసాయం యొక్క ప్రభావాన్ని (ముఖ్యంగా నీటి కొరత ఉన్న ప్రాంతాలలో) తగ్గించగల సాంకేతికత ఏది ?',
    ['బిందు సేద్యం', 'రసాయన పురుగుమందులు', 'వరద నీటిపారుదల', 'ఏటా ఒకే పంటను ఒకే భూమిలో పండించుట (మోనోక్రాపింగ్)'],
    0,
    'Drip irrigation (micro-irrigation) delivers water directly to plant roots, saving up to 40–70% water compared to flood irrigation and preventing soil salinity/leaching.',
    'బిందు సేద్యం (డ్రిప్ ఇరిగేషన్) నీటిని నేరుగా మొక్కల వేర్లకు అందించి నీటి కొరత ప్రాంతాల్లో నీటి వృథాను గణనీయంగా తగ్గిస్తుంది.'
  ],
  [
    106, 'science', 'Waste Management Rules',
    'Which of the following is the primary goal of India\'s “Municipal Solid Waste Management and Handling Rules, 2000” ?',
    ['Promoting waste segregation', 'Increasing waste generation', 'Reducing waste recycling', 'Supporting landfilling'],
    'భారతదేశం యొక్క “మునిసిపల్ సాలిడ్ వేస్ట్ మేనేజ్‌మెంట్ మరియు హ్యాండ్లింగ్ రూల్స్, 2000” యొక్క ప్రాథమిక లక్ష్యం క్రింది వాటిలో ఏది ?',
    ['వ్యర్థాల విభజనను ప్రోత్సహించడం', 'వ్యర్థాల ఉత్పత్తిని పెంచడం', 'వ్యర్థాల పునర్ వినియోగాన్ని (రీసైక్లింగ్) తగ్గించడం', 'ల్యాండ్‌ఫిల్లింగ్‌ను ప్రోత్సహించడం'],
    0,
    'The Municipal Solid Wastes (Management and Handling) Rules, 2000 mandated municipal authorities to ensure segregation at source, collection, processing, and scientific disposal.',
    'MSW రూల్స్ 2000 ప్రకారం వ్యర్థాల విభజన (సెగ్రిగేషన్), సేకరణ మరియు శాస్త్రీయ నిర్వహణను ప్రోత్సహించడం ప్రధాన లక్ష్యం.'
  ],
  [
    107, 'science', 'Ecology & Population Biology',
    'Statement A : Natality refers to the birth of individuals in a population.\nStatement B : Natality rate is expressed as the number of individuals produced per female per unit time.',
    ['Both statements A and B are true', 'Both statements A and B are false', 'Statement A is true, but statement B is false', 'Statement A is false, but statement B is true'],
    'వ్యాఖ్యానం A : జననత్వం అనేది జనాభాలో వ్యక్తుల పుట్టుకను సూచిస్తుంది.\nవ్యాఖ్యానం B : ఒక యూనిట్ సమయంలో ఒక స్త్రీ నుండి ఉత్పత్తి చేయబడిన వ్యక్తుల సంఖ్యగా జననత్వ రేటు వ్యక్తీకరించబడుతుంది.',
    ['రెండు వ్యాఖ్యానాలు A మరియు B సరైనవి', 'రెండు వ్యాఖ్యానాలు A మరియు B తప్పు', 'వ్యాఖ్యానం A సరైనది, కానీ వ్యాఖ్యానం B తప్పు', 'వ్యాఖ్యానం A తప్పు, కానీ వ్యాఖ్యానం B సరైనది'],
    0,
    'In population ecology, natality refers to births adding to a population, and specific natality rate is expressed as offspring produced per female (or per capita) per unit time.',
    'జీవావరణ శాస్త్రంలో జననత్వం (Natality) మరియు జననత్వ రేటు గురించిన A మరియు B ప్రకటనలు రెండూ సరైనవి.'
  ],
  [
    108, 'science', 'Environment & Atmosphere',
    'The “ozone hole” is primarily caused by the release of',
    ['Carbon dioxide', 'Chlorofluorocarbons (CFCs)', 'Nitrous oxide', 'Methane'],
    '“ఓజోన్ రంధ్రం” ప్రధానంగా దీని విడుదల వలన ఏర్పడుతుంది ?',
    ['కార్బన్ డయాక్సైడ్', 'క్లోరోఫ్లోరో కార్బన్‌లు (CFCలు)', 'నైట్రస్ ఆక్సైడ్', 'మీథేన్'],
    1,
    'Stratospheric ozone depletion ("ozone hole") is mainly caused by chlorine and bromine radicals released from Chlorofluorocarbons (CFCs) and halons.',
    'ఓజోన్ పొర క్షీణతకు (ఓజోన్ రంధ్రం) ప్రధాన కారణం క్లోరోఫ్లోరో కార్బన్లు (CFCలు).'
  ],
  [
    109, 'science', 'Environmental Science',
    'Which of these is not a biodegradable waste ?',
    ['Vegetable peels', 'Fruits', 'Wool', 'Tin'],
    'వీటిలో ఏది బాక్టీరియాతో నశింపజేసే (బయోడిగ్రేడబుల్) వ్యర్థం కాదు ?',
    ['కూరగాయ తొక్కలు', 'పండ్లు', 'ఉన్ని', 'తగరం (టిన్)'],
    3,
    'Tin is a metallic/inorganic material that cannot be broken down naturally by decomposers, unlike vegetable peels, fruits, and wool.',
    'కూరగాయ తొక్కలు, పండ్లు మరియు ఉన్ని బయోడిగ్రేడబుల్ కాగా, తగరం (టిన్) జీవ విచ్ఛిన్నం కాని (నాన్-బయోడిగ్రేడబుల్) వ్యర్థం.'
  ],
  [
    110, 'science', 'Sustainable Development',
    'The concept of sustainable development was first popularized by which report ?',
    ['UNDP Report 1992', 'World Bank Report 1985', 'Brundtland Commission Report 1987', 'Rio Declaration 1992'],
    'సుస్థిర అభివృద్ధి భావన మొదట ఏ నివేదిక ద్వారా ప్రాచుర్యం పొందింది ?',
    ['UNDP నివేదిక 1992', 'ప్రపంచ బ్యాంకు నివేదిక 1985', 'బ్రంట్‌ల్యాండ్ కమిషన్ నివేదిక 1987', 'రియో డిక్లరేషన్ 1992'],
    2,
    'The Brundtland Commission Report ("Our Common Future", 1987) gave the classic definition and popularized sustainable development.',
    '1987 నాటి బ్రంట్‌ల్యాండ్ కమిషన్ నివేదిక ("Our Common Future") సుస్థిర అభివృద్ధి భావనకు ప్రాచుర్యం కల్పించింది.'
  ],
  [
    111, 'science', 'Sustainable Agriculture',
    'What is the main advantage of organic farming over conventional farming ?',
    ['Increased pesticide use', 'Higher crop yields in all conditions', 'Reduced chemical input and improved soil health', 'Increased greenhouse gas emissions'],
    'సాంప్రదాయ వ్యవసాయం కంటే సేంద్రీయ వ్యవసాయం యొక్క ప్రధాన ప్రయోజనం ఏమిటి ?',
    ['పురుగుమందుల వాడకం పెరుగుదల', 'అన్ని పరిస్థితులలో అధిక పంట దిగుబడి', 'రసాయన వాడకం తగ్గటం మరియు నేల ఆరోగ్యం మెరుగుపడటం', 'గ్రీన్‌హౌస్ వాయు ఉద్గారాలు పెరగడం'],
    2,
    'Organic farming eliminates synthetic chemicals and builds soil organic matter, microbial diversity, and long-term soil health.',
    'రసాయన ఎరువులు-పురుగుమందుల వాడకాన్ని తగ్గించి నేల ఆరోగ్యాన్ని మెరుగుపరచడం సేంద్రీయ వ్యవసాయం యొక్క ప్రధాన ప్రయోజనం.'
  ],
  [
    112, 'science', 'Biogeochemical Cycles',
    'Biogeochemical cycle in which the main reservoir is not the soil',
    ['Sulphur cycle', 'Nitrogen cycle', 'Phosphorous cycle', 'Calcium cycle'],
    'ఏ బయోజెయోకెమికల్ చక్రంలో నేల ప్రధాన రిజర్వాయర్ కాదు ?',
    ['సల్ఫర్ చక్రం', 'నైట్రోజన్ చక్రం', 'భాస్వరం చక్రం', 'కాల్షియం చక్రం'],
    1,
    'The Nitrogen cycle is a gaseous biogeochemical cycle whose primary reservoir is the atmosphere (~78% N2), whereas P, S, and Ca are sedimentary cycles.',
    'నైట్రోజన్ చక్రం వాయు చక్రం కావున దీని ప్రధాన రిజర్వాయర్ వాతావరణం (నేల కాదు).'
  ],
  [
    113, 'science', 'Sustainable Development',
    'What is a key goal of sustainable development ?',
    ['Economic growth with no concern for environmental impacts', 'Ensuring social equity, economic growth and environmental protection', 'Limiting global population growth', 'Promoting environmental conservation over all else'],
    'సుస్థిర అభివృద్ధి యొక్క కీలక లక్ష్యం ఏమిటి ?',
    ['పర్యావరణ ప్రభావాల పట్ల ఎలాంటి పట్టింపులేని ఆర్థిక వృద్ధి', 'సామాజిక సమానత్వం, ఆర్థిక వృద్ధి మరియు పర్యావరణ పరిరక్షణకు భరోసా', 'ప్రపంచ జనాభా పెరుగుదలను పరిమితం చేయడం', 'అన్నిటికంటే పర్యావరణ పరిరక్షణను ప్రోత్సహించడం'],
    1,
    'Sustainable development rests on balancing three interconnected pillars: social equity, economic growth, and environmental protection.',
    'సామాజిక సమానత్వం, ఆర్థిక వృద్ధి మరియు పర్యావరణ పరిరక్షణ మధ్య సమతుల్యత సాధించడం సుస్థిర అభివృద్ధి కీలక లక్ష్యం.'
  ],
  [
    114, 'science', 'Solid Waste Management',
    'State that produces highest solid waste in India',
    ['Maharashtra', 'Andhra Pradesh', 'Uttar Pradesh', 'West Bengal'],
    'భారతదేశంలో అత్యధిక ఘన వ్యర్థాలను ఉత్పత్తి చేసే రాష్ట్రం',
    ['మహారాష్ట్ర', 'ఆంధ్రప్రదేశ్', 'ఉత్తర ప్రదేశ్', 'పశ్చిమ బెంగాల్'],
    0,
    'According to CPCB / MoHUA data, Maharashtra generates the highest quantity of municipal solid waste in India (followed by Uttar Pradesh and Tamil Nadu).',
    'CPCB నివేదికల ప్రకారం భారతదేశంలో అత్యధిక ఘన వ్యర్థాలను ఉత్పత్తి చేసే రాష్ట్రం మహారాష్ట్ర.'
  ],
  [
    115, 'science', 'Air Pollution',
    'What is the primary source of air pollution in Indian cities ?',
    ['Industrial emissions', 'Agricultural practices', 'Residential waste burning', 'Automobile emissions'],
    'భారతీయ నగరాల్లో వాయు కాలుష్యానికి ప్రధాన మూలం ఏమిటి ?',
    ['పారిశ్రామిక ఉద్గారాలు', 'వ్యవసాయ పద్ధతులు', 'నివాస వ్యర్థాలను కాల్చడం', 'వాహనాల (ఆటోమొబైల్) ఉద్గారాలు'],
    3,
    'Vehicular/automobile exhaust emissions (PM2.5, NOx, CO, hydrocarbons) constitute the single largest urban contributor to air pollution across Indian cities.',
    'భారతీయ నగరాల్లో వాయు కాలుష్యానికి వాహనాల (ఆటోమొబైల్) ఉద్గారాలు ప్రధాన మూలంగా ఉన్నాయి.'
  ],
  [
    116, 'science', 'Chemistry & Industrial Disasters',
    'Which of the following chemicals was released in the Bhopal disaster of 1984 ?',
    ['Chlorine', 'Methyl-Isocyanate (MIC)', 'Ammonia', 'Hydrogen Sulphide'],
    'ఈ క్రింది రసాయనాలలో 1984 లో భోపాల్ విపత్తులో విడుదల అయినది ఏది ?',
    ['క్లోరిన్', 'మిథైల్ ఐసోసైనేట్ (MIC)', 'అమ్మోనియా', 'హైడ్రోజన్ సల్ఫైడ్'],
    1,
    'The December 1984 Bhopal gas tragedy at the Union Carbide pesticide plant involved a massive leak of Methyl Isocyanate (MIC) gas.',
    '1984 భోపాల్ గ్యాస్ విషాదంలో యూనియన్ కార్బైడ్ కర్మాగారం నుండి మిథైల్ ఐసోసైనేట్ (MIC) వాయువు విడుదలైంది.'
  ],
  [
    117, 'science', 'Sustainable Development',
    'Which of the following is not one of the three pillars of sustainability ?',
    ['Environmental sustainability', 'Economic sustainability', 'Social sustainability', 'Political sustainability'],
    'క్రింది వాటిలో ఏది సుస్థిరత యొక్క మూడు స్థంభాలలో ఒకటి కాదు ?',
    ['పర్యావరణ సుస్థిరత', 'ఆర్థిక సుస్థిరత', 'సామాజిక సుస్థిరత', 'రాజకీయ సుస్థిరత'],
    3,
    'The three universally recognized pillars of sustainability (the 3Es / Triple Bottom Line) are Environmental, Economic, and Social sustainability.',
    'సుస్థిరత యొక్క మూడు ప్రధాన స్తంభాలు పర్యావరణ, ఆర్థిక మరియు సామాజిక సుస్థిరత; రాజకీయ సుస్థిరత ఇందులో భాగం కాదు.'
  ],
  [
    118, 'science', 'Bioremediation',
    'What is the primary application of bioremediation ?',
    ['Air pollution', 'Soil contamination', 'Noise pollution', 'Waterborne diseases'],
    'బయోరెమిడియేషన్ యొక్క ప్రాథమిక వినియోగం దేనికి ?',
    ['వాయు కాలుష్యం', 'నేల కాలుష్యం', 'శబ్ద కాలుష్యం', 'నీటి ద్వారా వచ్చే వ్యాధులు'],
    1,
    'Bioremediation is most widely applied to remediate contaminated soils and groundwater by degrading hydrocarbons, pesticides, and heavy metals biologically.',
    'కలుషితమైన నేల (మరియు భూగర్భ జలాలు) శుద్ధి చేయడానికి బయోరెమిడియేషన్ ప్రధానంగా ఉపయోగించబడుతుంది.'
  ],
  [
    119, 'science', 'Biodiversity & IUCN',
    'CR in IUCN red list refers to',
    ['Extinct in the wild', 'Critically extinct', 'Endangered', 'Critically endangered'],
    'IUCN ఎరుపు జాబితాలో CR దేనిని సూచిస్తుంది ?',
    ['అడవిలో అంతరించిపోయింది', 'క్రిటికల్‌గా అంతరించిపోయింది', 'అంతరించిపోతున్నాయి', 'తీవ్ర ప్రమాదంలో ఉంది'],
    3,
    'In the IUCN Red List of Threatened Species, "CR" stands for Critically Endangered—the highest risk category for wild species before Extinction.',
    'IUCN రెడ్ లిస్ట్‌లో CR అంటే "క్రిటికల్లీ ఎండేంజర్డ్" (తీవ్ర ప్రమాదంలో ఉన్న జాతులు).'
  ],
  [
    120, 'science', 'Climate Change',
    'Which of the following is a potential tipping point of global climate change ?',
    ['Loss of Arctic ice', 'Reduction in CO2 emissions', 'Increased deforestation', 'Decrease in solar radiation'],
    'క్రింది వాటిలో ప్రపంచ వాతావరణ మార్పు (గ్లోబల్ క్లైమేట్ చేంజ్) యొక్క టిప్పింగ్ పాయింట్ ఏది ?',
    ['ఆర్కిటిక్ మంచు నష్టం', 'CO2 ఉద్గారాల తగ్గింపు', 'పెరిగిన అటవీ నిర్మూలన', 'సౌర వికిరణంలో తగ్గుదల'],
    0,
    'Loss of Arctic sea ice (which reduces surface albedo and triggers irreversible warming feedback loops) is recognized by the IPCC as a major climate tipping point.',
    'ఆర్కిటిక్ మంచు కరగడం (అల్బెడో ప్రభావాన్ని తగ్గించి వేడిని పెంచే ప్రక్రియ) గ్లోబల్ క్లైమేట్ చేంజ్ యొక్క ప్రధాన టిప్పింగ్ పాయింట్.'
  ],
  [
    121, 'science', 'Renewable Energy & MNRE',
    'The mission of the Ministry of New and Renewable Energy (MNRE) is\na. Energy Security\nb. Increase in the share of clean power\nc. Energy availability and access\nd. Energy affordability\ne. Energy equity',
    ['Only a, b and d', 'Only a, c, d and e', 'All of the above', 'None of the above'],
    'కొత్త మరియు పునరుత్పాదక ఇంధన మంత్రిత్వ శాఖ (MNRE) యొక్క లక్ష్యం\na. శక్తి భద్రత\nb. స్వచ్ఛ (క్లీన్) పవర్ వాటాలో పెరుగుదల\nc. శక్తి లభ్యత మరియు అందుబాటు\nd. శక్తి స్థోమత\ne. శక్తి సమానత్వం',
    ['a, b మరియు d మాత్రమే', 'a, c, d మరియు e మాత్రమే', 'పైవన్నీ', 'పైవేవీ కావు'],
    2,
    'The official mission of MNRE spans Energy Security, increasing clean power share, Energy Availability & Access, Energy Affordability, and Energy Equity.',
    'MNRE యొక్క అధికారిక లక్ష్యంలో శక్తి భద్రత, క్లీన్ పవర్ వాటా పెరుగుదల, లభ్యత, స్థోమత మరియు సమానత్వం అన్నీ భాగమే.'
  ],
  [
    122, 'science', 'Solar Energy & International Initiatives',
    'Project that is not associated with International Solar Alliance (ISA).',
    ['ITEC', 'ISTARC', 'OSOWOG', 'KUSUM'],
    'ఇంటర్నేషనల్ సోలార్ అలయన్స్ (ISA) తో సంబంధం లేని ప్రాజెక్ట్',
    ['ITEC', 'ISTARC', 'OSOWOG', 'KUSUM'],
    3,
    'ITEC (solar training fellowships), STAR-C/ISTARC, and OSOWOG (One Sun One World One Grid) are ISA-linked global programs, whereas PM-KUSUM is a domestic Indian MNRE farmer solar scheme.',
    'ITEC, ISTARC (STAR-C) మరియు OSOWOGలు ISAతో ముడిపడి ఉండగా, KUSUM అనేది దేశీయ MNRE వ్యవసాయ సౌర పథకం.'
  ],
  [
    123, 'science', 'Environmental Legislation',
    'What was the primary purpose of the Air (Prevention and Control of Pollution) Act, 1981 ?',
    ['Control air quality standards', 'Regulate vehicle emissions', 'Promote renewable energy sources', 'Reduce use of chemical fertilisers'],
    'వాయు (కాలుష్య నివారణ మరియు నియంత్రణ) చట్టం, 1981 యొక్క ప్రాథమిక ఉద్దేశ్యం ఏమిటి ?',
    ['గాలి నాణ్యత ప్రమాణాలను నియంత్రించడం', 'వాహన ఉద్గారాలను నియంత్రించడం', 'పునరుత్పాదక ఇంధన వనరులను ప్రోత్సహించడం', 'రసాయన ఎరువుల వాడకం తగ్గించడం'],
    0,
    'The Air (Prevention and Control of Pollution) Act, 1981 was enacted to preserve air quality and prevent, control, and abate air pollution across India.',
    'గాలి నాణ్యత ప్రమాణాలను కాపాడటం మరియు వాయు కాలుష్యాన్ని నియంత్రించడం 1981 వాయు చట్టం యొక్క ప్రాథమిక ఉద్దేశ్యం.'
  ],
  [
    124, 'science', 'Waste Management Technologies',
    'Match the List – I with List – II and choose the correct answer using the codes given below.\nList – I (Type of Solid Waste Management)\na. Incineration\nb. Pyrolysis\nc. Plasma gasification\nd. Composting\n\nList – II (Function)\nI. Conversion of recyclable waste to carbon based fuels\nII. Process of burning waste\nIII. Exposing waste to extremely high temperature\nIV. Process of decaying organic waste biologically\n\nCodes (a b c d) :',
    ['IV  III  I  II', 'II  I  III  IV', 'II  III  I  IV', 'IV  III  II  I'],
    'జాబితా – I తో జాబితా – II ను సరిపోల్చి క్రింద యిచ్చిన కోడ్లను ఉపయోగించి సరైన సమాధానాన్ని ఎంచుకోండి.\nజాబితా – I (సాలిడ్ వేస్ట్ నిర్వహణ రకం)\na. దహనం\nb. పైరోలిసిస్\nc. ప్లాస్మా గ్యాసిఫికేషన్\nd. కంపోస్టింగ్\n\nజాబితా – II (ఫంక్షన్)\nI. పునర్వినియోగపరచదగిన వ్యర్థాలను కార్బన్ ఆధారిత ఇంధనాలుగా మార్చడం\nII. వ్యర్థాలను కాల్చే ప్రక్రియ\nIII. వ్యర్థాలను అత్యధిక ఉష్ణోగ్రతకు గురిచేయడం\nIV. సేంద్రీయ వ్యర్థాలను జీవశాస్త్రపరంగా క్షీణింపచేసే ప్రక్రియ\n\nకోడ్‌లు (a b c d) :',
    ['IV  III  I  II', 'II  I  III  IV', 'II  III  I  IV', 'IV  III  II  I'],
    1,
    'Incineration = burning waste (II); Pyrolysis = thermal conversion without oxygen to carbon fuels (I); Plasma gasification = exposing waste to extreme plasma temperatures (III); Composting = biological decay (IV).',
    'దహనం-(II), పైరోలిసిస్-(I), ప్లాస్మా గ్యాసిఫికేషన్-(III), కంపోస్టింగ్-(IV).'
  ],
  [
    125, 'science', 'Bioremediation',
    'Which of the following bioremediation techniques is used to treat oil spills ?',
    ['Phytoremediation', 'Bioaugmentation', 'Bioventing', 'Mycoremediation'],
    'చమురు చిందటాలను శుద్ధి చేయడానికి క్రింది వాటిలో ఏ బయోరెమిడియేషన్ పద్ధతిని ఉపయోగిస్తారు ?',
    ['ఫైటోరెమిడియేషన్', 'బయోఆగ్మెంటేషన్', 'బయోవెంటింగ్', 'మైకోరెమిడియేషన్'],
    1,
    'Bioaugmentation introduces specialized hydrocarbon-degrading bacteria (like Oilzapper / Pseudomonas) directly to oil spills to break down petroleum rapidly.',
    'చమురు తెట్టులను త్వరగా విచ్ఛిన్నం చేయడానికి ప్రత్యేక సూక్ష్మజీవులను (బ్యాక్టీరియాను) చేర్చే బయోఆగ్మెంటేషన్ పద్ధతిని ఉపయోగిస్తారు.'
  ],
  [
    126, 'science', 'AP Renewable Energy',
    'Match List – I with List – II and choose the correct answer using the codes given below.\nList – I (Solar Park)\na. Hybrid Solar Wind Park Ramagiri\nb. Ananthapuram-I Solar Park\nc. Kurnool Solar Park\nd. Ananthapuram-II Solar Park\n\nList – II (Capacity in MW)\nI. 1000\nII. 160\nIII. 1500\nIV. 500\n\nCodes (a b c d) :',
    ['II  III  IV  I', 'I  II  III  IV', 'IV  II  III  I', 'II  III  I  IV'],
    'జాబితా – I ని జాబితా – II తో సరిపోల్చండి మరియు క్రింద ఇచ్చిన కోడ్‌లను ఉపయోగించి సరైన సమాధానాన్ని ఎంచుకోండి.\nజాబితా – I (సోలార్ పార్క్)\na. రామగిరి హైబ్రిడ్ సోలార్ విండ్ పార్క్\nb. అనంతపురం-I సోలార్ పార్క్\nc. కర్నూలు సోలార్ పార్క్\nd. అనంతపురం-II సోలార్ పార్క్\n\nజాబితా – II (మెగావాట్లలో సామర్థ్యం)\nI. 1000\nII. 160\nIII. 1500\nIV. 500\n\nకోడ్‌లు (a b c d) :',
    ['II  III  IV  I', 'I  II  III  IV', 'IV  II  III  I', 'II  III  I  IV'],
    3,
    'In AP: Ramagiri Hybrid Solar Wind Park = 160 MW (II), Ananthapuram-I (NP Kunta) = 1500 MW (III), Kurnool Ultra Mega Solar Park = 1000 MW (I), Ananthapuram-II (Galiveedu) = 500 MW (IV).',
    'రామగిరి హైబ్రిడ్-160 MW (II), అనంతపురం-I-1500 MW (III), కర్నూలు-1000 MW (I), అనంతపురం-II-500 MW (IV).'
  ],
  [
    127, 'science', 'Circular Economy & Sustainability',
    'Which of the following is true about the “Circular Economy” ?',
    ['It focuses on reducing the use of fossil fuels', 'It promotes the reuse, recycling and repair of materials to reduce waste', 'It encourages linear economic growth', 'It focuses exclusively on reducing carbon emissions'],
    'వృత్తాకార ఆర్థిక వ్యవస్థ (సర్క్యులర్ ఎకానమీ) సంబంధించి క్రింది వాటిలో ఏది నిజం ?',
    ['ఇది శిలాజ ఇంధనాల వినియోగాన్ని తగ్గించడంపై దృష్టి పెడుతుంది', 'ఇది వ్యర్థాలను తగ్గించడానికి పదార్థాల పునర్ వాడకం, పునర్వినియోగం (రీసైక్లింగ్) మరియు మరమ్మత్తులను ప్రోత్సహిస్తుంది', 'ఇది సరళ రేఖామార్గ (లీనియర్) ఆర్థిక వృద్ధిని ప్రోత్సహిస్తుంది', 'ఇది కార్బన్ ఉద్గారాలను తగ్గించడంపైనే ప్రత్యేకంగా దృష్టిసారిస్తుంది'],
    1,
    'A circular economy moves away from "take-make-waste" linear production by keeping materials in circulation via sharing, repairing, refurbishing, and recycling.',
    'వ్యర్థాలను కనిష్ఠంగా ఉంచడానికి వస్తువుల పునర్వినియోగం, రీసైక్లింగ్ మరియు మరమ్మత్తులను సర్క్యులర్ ఎకానమీ ప్రోత్సహిస్తుంది.'
  ],
  [
    128, 'science', 'Environment & Government Initiatives',
    'Which of the following government initiatives aims to control industrial emissions in India ?',
    ['Swachh Bharat Mission', 'National Clean Air Programme (NCAP)', 'Pradhan Mantri Ujjwala Yojana', 'Atal Mission for Rejuvenation and Urban Transformation (AMRUT)'],
    'భారతదేశంలోని ఈ క్రింది ప్రభుత్వ కార్యక్రమాలలో ఏది పారిశ్రామిక ఉద్గారాలను నియంత్రించడానికి ఉద్దేశించబడింది ?',
    ['స్వచ్ఛ భారత్ మిషన్', 'నేషనల్ క్లీన్ ఎయిర్ ప్రోగ్రామ్ (NCAP)', 'ప్రధానమంత్రి ఉజ్వల యోజన', 'పునరుజ్జీవనం మరియు పట్టణ పరివర్తన కోసం అటల్ మిషన్ (అమృత్)'],
    1,
    'The National Clean Air Programme (NCAP, launched 2019) sets city-specific air quality targets and mandates strict controls on vehicular, dust, and industrial emissions.',
    'పట్టణాలు మరియు పారిశ్రామిక ప్రాంతాలలో వాయు కాలుష్యం మరియు ఉద్గారాలను నియంత్రించడానికి నేషనల్ క్లీన్ ఎయిర్ ప్రోగ్రామ్ (NCAP) రూపొందించబడింది.'
  ],
  [
    129, 'science', 'Ecology & Ecosystems',
    'Choose the correct statement.',
    ['Producers in an aquatic ecosystem are green plants', 'Archea are a type of producers who use energy from chemical compounds', 'Consumers are heterotrophs able to produce their food', 'The stability of ecosystem depends on consumers'],
    'సరైన ప్రకటన ఎంచుకోండి.',
    ['నీటి పర్యావరణ వ్యవస్థలో ఆకుపచ్చ మొక్కలు ఉత్పత్తిదారులు', 'ఆర్కియా అనేది రసాయన సమ్మేళనాల నుండి శక్తిని ఉపయోగించే ఒక రకమైన ఉత్పత్తిదారులు', 'వినియోగదారులు తమ ఆహారాన్ని ఉత్పత్తి చేయగల హెటెరోట్రోఫ్‌లు', 'పర్యావరణ వ్యవస్థ యొక్క స్థిరత్వం వినియోగదారులపై ఆధారపడి ఉంటుంది'],
    1,
    'Chemosynthetic Archaea are autotrophic producers (chemoautotrophs) that synthesize organic food using chemical energy (e.g., H2S/methane). Aquatic ecosystems are led primarily by phytoplankton, not higher green plants.',
    'ఆర్కియా వంటి కీమోఆటోట్రోఫ్‌లు రసాయన సమ్మేళనాల శక్తిని ఉపయోగించి ఆహారాన్ని ఉత్పత్తి చేసే ఉత్పత్తిదారులు.'
  ],
  [
    130, 'science', 'Air Pollution',
    'What can be considered a natural source of air pollution ?',
    ['Factory emissions', 'Power station smoke', 'Forest fires', 'Automobile emissions'],
    'వాయు కాలుష్యం యొక్క సహజ మూలం అని దేనిని అనవచ్చు ?',
    ['ఫ్యాక్టరీ విసర్జకాలు', 'పవర్ స్టేషన్ పొగ', 'అడవి మంటలు', 'వాహన ఉద్గారాలు'],
    2,
    'Natural air pollution sources include wildfires/forest fires, volcanic eruptions, and dust storms; factory, power station, and automobile emissions are anthropogenic.',
    'అడవి మంటలు (కార్చిచ్చు) వాయు కాలుష్యానికి సహజ మూలం కాగా మిగిలినవి మానవ నిర్మిత కాలుష్యాలు.'
  ],
  [
    131, 'science', 'Waste Management',
    'Match the following :\nWaste Type\na. Organic Waste\nb. E-waste\nc. Hazardous Waste\nd. Broken glass pieces\n\nAppropriate Disposal Method\nI. Incineration\nII. Composting\nIII. Landfilling\nIV. Recycling\n\nCodes (a b c d) :',
    ['II  IV  I  III', 'IV  II  III  I', 'II  IV  III  I', 'IV  II  I  III'],
    'వ్యర్థ రకాన్ని దాని సరైన తొలగించే (disposal) పద్ధతితో సరిపోల్చండి.\nవ్యర్థ రకం\na. సేంద్రీయ వ్యర్థాలు\nb. ఈ-వేస్ట్\nc. ప్రమాదకర వ్యర్థాలు\nd. పగిలిన గాజు ముక్కలు\n\nతొలగించే (డిస్పోజల్) పద్ధతి\nI. దహనం\nII. పదార్థములను కప్పి ఎరువు తయారు చేయుట (కంపోస్టింగ్)\nIII. వ్యర్థాలను గుంటలలో పూడ్చడం (ల్యాండ్‌ఫిల్లింగ్)\nIV. పునర్ వినియోగం (రీసైక్లింగ్)\n\nకోడ్‌లు (a b c d) :',
    ['II  IV  I  III', 'IV  II  III  I', 'II  IV  III  I', 'IV  II  I  III'],
    0,
    'Organic waste -> Composting (II); E-waste -> Recycling (IV); Hazardous waste -> controlled high-temp Incineration (I); Inert broken glass -> Landfilling (III).',
    'సేంద్రీయ వ్యర్థాలు-కంపోస్టింగ్ (II), ఈ-వేస్ట్-రీసైక్లింగ్ (IV), ప్రమాదకర వ్యర్థాలు-దహనం (I), పగిలిన గాజు-ల్యాండ్‌ఫిల్లింగ్ (III).'
  ],
  [
    132, 'science', 'Public Health & Welfare',
    'Ayushman Bharat primarily aims to provide healthcare coverage to which group ?',
    ['Urban middle-class families', 'Rural and poor populations', 'Senior citizens', 'Private healthcare providers'],
    'ఆయుష్మాన్ భారత్ ప్రాథమికంగా ఏ వర్గానికి ఆరోగ్య సంరక్షణను అందించడం లక్ష్యంగా పెట్టుకుంది ?',
    ['పట్టణ మధ్య-తరగతి కుటుంబాలు', 'గ్రామీణ మరియు పేద జనాభా', 'వయోవృద్ధులు (సీనియర్ సిటిజన్లు)', 'ప్రభుత్వంతో సంబంధం లేని ఆరోగ్య సంరక్షణ ప్రదాతలు (ప్రైవేట్ హెల్త్‌కేర్ ప్రొవైడర్లు)'],
    1,
    'Ayushman Bharat PM-JAY targets the bottom 40% economically vulnerable rural and urban poor households identified from SECC data (expanded recently to seniors 70+).',
    'ఆయుష్మాన్ భారత్ (PM-JAY) ప్రాథమికంగా గ్రామీణ మరియు పట్టణ పేద, ఆర్థికంగా బలహీనమైన కుటుంబాలకు ఆరోగ్య బీమా కల్పించడం లక్ష్యంగా పెట్టుకుంది.'
  ],
  [
    133, 'science', 'Climate Change & Chemistry',
    'Assertion (A) : CFCs are greenhouse gases that contribute to climate change and increase UV radiation on earth.\nReason (R) : Chloroflourocarbons (CFCs) are man made gases used in refrigerators, air conditioners and aerosol sprays.',
    ['(A) and (R) are correct and (R) is the correct explanation of (A)', '(A) and (R) are correct but (R) is not the correct explanation of (A)', '(A) is correct but (R) is not correct', '(A) is not correct but (R) is correct'],
    'వాదన (A) : CFCలు గ్రీన్‌హౌస్ వాయువులు. ఇవి వాతావరణ మార్పులకు దోహదం చేస్తాయి మరియు భూమి పై UV రేడియేషన్‌ను పెంచుతాయి.\nకారణం (R) : క్లోరోఫ్లోరోకార్బన్లు (CFCలు) రిఫ్రిజిరేటర్లు, ఎయిర్ కండీషనర్లు మరియు ఏరోసోల్ స్ప్రేలలో ఉపయోగించే మానవ నిర్మిత వాయువులు.',
    ['(A) మరియు (R) సరైనవి మరియు (A) కి (R) సరైన వివరణ', '(A) మరియు (R) సరైనవి కానీ (A) కి (R) సరైన వివరణ కాదు', '(A) సరైనది కానీ (R) సరైనది కాదు', '(A) సరైనది కాదు కానీ (R) సరైనది'],
    1,
    'Both (A) and (R) are individually true, but (R) only describes commercial uses of CFCs rather than explaining the atmospheric chemistry mechanism by which CFCs trap heat and destroy ozone.',
    'A మరియు R రెండూ వ్యక్తిగతంగా సరైనవి, కానీ R అనేది CFCల ఉపయోగాలను మాత్రమే తెలుపుతుంది కాబట్టి A కి సరైన వివరణ కాదు.'
  ],
  [
    134, 'science', 'Biofuels & Science Policy',
    'Assertion (A) : National Biofuel Coordination Committee needs to approve use of surplus food grains for production of ethanol for blending with petrol.\nReason (R) : Farmers are at risk of not getting appropriate price for their produce during the surplus production phase.',
    ['(A) and (R) are correct and (R) is the correct explanation of (A)', '(A) and (R) are correct but (R) is not the correct explanation of (A)', '(A) is correct but (R) is not correct', '(A) is not correct but (R) is correct'],
    'వాదన (A) : పెట్రోలుతో కలపడానికి ఇథనాల్ ఉత్పత్తికి మిగులు ఆహార ధాన్యాల వినియోగాన్ని జాతీయ జీవ ఇంధన సమన్వయ కమిటీ ఆమోదించాలి.\nకారణం (R) : మిగులు ఉత్పత్తి దశలో రైతులకు తమ ఉత్పత్తులకు సరైన ధర లభించని ప్రమాదం ఉంది.',
    ['(A) మరియు (R) సరైనవి మరియు (A) కి (R) సరైన వివరణ', '(A) మరియు (R) సరైనవి కానీ (A) కి (R) సరైన వివరణ కాదు', '(A) సరైనది కానీ (R) సరైనది కాదు', '(A) సరైనది కాదు కానీ (R) సరైనది'],
    0,
    'Under the National Policy on Biofuels (2018), NBCC approves diverting surplus food grains to ethanol production to stabilize farmer prices during surplus harvests while ensuring food security.',
    'మిగులు ఆహార ధాన్యాల సమయంలో రైతులకు గిట్టుబాటు ధర లభించేలా చేసేందుకు జాతీయ జీవ ఇంధన సమన్వయ కమిటీ ఇథనాల్ తయారీకి ఆమోదం ఇస్తుంది.'
  ],
  [
    135, 'science', 'Global Environmental Summits',
    'Which global summit led to the adoption of the “Agenda 21” and the “Rio Declaration” ?',
    ['Kyoto Protocol', 'Earth Summit 1992', 'UN Climate Change Conference 2015', 'World Health Assembly 2000'],
    'ఏ ప్రపంచ శిఖరాగ్ర సమావేశం (గ్లోబల్ సమ్మిట్) “అజెండా (కార్యక్రమ పట్టిక) 21” మరియు “రియో డిక్లరేషన్” (రియో ప్రకటన) ఆమోదించడానికి దారితీసింది ?',
    ['క్యోటో ప్రోటోకాల్', 'ఎర్త్ సమ్మిట్ 1992', 'UN క్లైమేట్ చేంజ్ కాన్ఫరెన్స్ 2015', 'వరల్డ్ హెల్త్ అసెంబ్లీ 2000'],
    1,
    'The 1992 UN Conference on Environment and Development (UNCED / Rio Earth Summit) adopted the Rio Declaration on Environment and Development and Agenda 21.',
    '1992 లో రియో డి జనీరోలో జరిగిన ఎర్త్ సమ్మిట్ (UNCED) లో అజెండా 21 మరియు రియో డిక్లరేషన్ ఆమోదించబడ్డాయి.'
  ],
  [
    136, 'science', 'Chemistry & Air Pollution',
    'Pollutant produced by vehicles that reduces the Oxygen carrying capacity of Blood',
    ['Sulphur gas', 'Carbon dioxide', 'Nitrogen oxides', 'Carbon monoxide'],
    'వాహనాల ద్వారా ఉత్పత్తి చేయబడిన ఏ కాలుష్య కారకం రక్తం యొక్క ఆక్సిజన్ మోసే సామర్థ్యాన్ని తగ్గిస్తుంది ?',
    ['సల్ఫర్ వాయువు', 'కార్బన్ డయాక్సైడ్', 'నైట్రోజన్ ఆక్సైడ్లు', 'కార్బన్ మోనాక్సైడ్'],
    3,
    'Carbon monoxide (CO) binds to haemoglobin with over 200 times greater affinity than oxygen, forming carboxyhaemoglobin and severely reducing blood oxygen transport.',
    'కార్బన్ మోనాక్సైడ్ (CO) హిమోగ్లోబిన్‌తో వేగంగా కలిసిపోయి కార్బాక్సీహిమోగ్లోబిన్‌గా మారి రక్తం ఆక్సిజన్ మోసే సామర్థ్యాన్ని తగ్గిస్తుంది.'
  ],
  [
    137, 'science', 'Biotechnology Institutions',
    'Autonomous institute under the Department of Biotechnology (DBT)',
    ['Central Food Technological Research Institute', 'Central Glass Ceramic Research Institute', 'Centre for Innovative and Applied Bioprocessing', 'Centre for Cellular and Molecular Biology'],
    'డిపార్ట్‌మెంట్ ఆఫ్ బయోటెక్నాలజీ (DBT) క్రింద స్వయం ప్రతిపత్తి గల సంస్థ (అటానమస్ ఇన్‌స్టిట్యూట్)',
    ['సెంట్రల్ ఫుడ్ టెక్నలాజికల్ రీసెర్చ్ ఇన్‌స్టిట్యూట్', 'సెంట్రల్ గ్లాస్ సెరామిక్ రీసెర్చ్ ఇన్‌స్టిట్యూట్', 'సెంటర్ ఫర్ ఇన్నోవేటివ్ అండ్ అప్లైడ్ బయోప్రాసెసింగ్', 'సెంటర్ ఫర్ సెల్యులార్ అండ్ మాలిక్యులర్ బయాలజీ'],
    2,
    'Centre for Innovative and Applied Bioprocessing (CIAB, Mohali) is an autonomous institute under the Department of Biotechnology (DBT), whereas CFTRI, CGCRI, and CCMB operate under CSIR.',
    'సెంటర్ ఫర్ ఇన్నోవేటివ్ అండ్ అప్లైడ్ బయోప్రాసెసింగ్ (CIAB, మొహాలీ) DBT ఆధీనంలోని స్వయంప్రతిపత్తి సంస్థ; మిగిలినవి CSIR క్రింద పనిచేస్తాయి.'
  ],
  [
    138, 'science', 'Environment & Toxicology',
    'Match List – I with List – II and choose the correct answer using the codes given below.\nList – I (Pollution)\na. Marble Cancer\nb. Biomagnification\nc. Green house effect\nd. Lung cancer\n\nList – II (Pollutant)\nI. Methane\nII. Nickel\nIII. Sulphur dioxide and nitrogen dioxide\nIV. Chlorohydrocarbons\n\nCodes (a b c d) :',
    ['III  IV  I  II', 'III  I  IV  II', 'II  III  I  IV', 'IV  III  II  I'],
    'జాబితా – I తో జాబితా – II ను సరిపోల్చి క్రింద యిచ్చిన కోడ్లను ఉపయోగించి సరైన సమాధానాన్ని ఎంచుకోండి.\nజాబితా – I (కాలుష్యం)\na. మార్బుల్ క్యాన్సర్\nb. బయోమాగ్నిఫికేషన్\nc. గ్రీన్ హౌస్ ప్రభావం\nd. ఊపిరితిత్తుల క్యాన్సర్\n\nజాబితా – II (కాలుష్య కారకం)\nI. మీథేన్\nII. నికెల్\nIII. సల్ఫర్ డయాక్సైడ్ మరియు నైట్రోజన్ డయాక్సైడ్\nIV. క్లోరోహైడ్రోకార్బన్లు\n\nకోడ్‌లు (a b c d) :',
    ['III  IV  I  II', 'III  I  IV  II', 'II  III  I  IV', 'IV  III  II  I'],
    0,
    'Marble Cancer (acid rain on monuments) = SO2 & NO2 (III); Biomagnification = Chlorohydrocarbons like DDT (IV); Greenhouse effect = Methane (I); Lung cancer occupational carcinogen = Nickel (II).',
    'మార్బుల్ క్యాన్సర్-SO2 & NO2 (III), బయోమాగ్నిఫికేషన్-క్లోరోహైడ్రోకార్బన్లు (IV), గ్రీన్ హౌస్ ప్రభావం-మీథేన్ (I), ఊపిరితిత్తుల క్యాన్సర్-నికెల్ (II).'
  ],
  [
    139, 'science', 'Public Health & Sanitation',
    'Which of the following public health campaigns was launched to improve sanitation in India ?',
    ['Swachh Bharat Abhiyan', 'Pradhan Mantri Jan Arogya Yojana', 'National Tuberculosis Elimination Program', 'Mission Indradhanush'],
    'భారతదేశంలో క్రింది వాటిలో ఏ ప్రజారోగ్య ప్రచారాన్ని పారిశుద్ధ్యాన్ని మెరుగుపరచడానికి ప్రారంభించారు ?',
    ['స్వచ్ఛ భారత్ అభియాన్', 'ప్రధాన మంత్రి జన్ ఆరోగ్య యోజన', 'జాతీయ క్షయ నిర్మూలన కార్యక్రమం', 'మిషన్ ఇంద్రధనుష్'],
    0,
    'Swachh Bharat Abhiyan (launched on 2 October 2014) is India\'s flagship nationwide sanitation and cleanliness campaign.',
    'భారతదేశంలో పారిశుద్ధ్యం మరియు స్వచ్ఛతను మెరుగుపరచడానికి స్వచ్ఛ భారత్ అభియాన్ ప్రారంభించబడింది.'
  ],
  [
    140, 'science', 'Public Health & Nutrition',
    'Anganwadi worker is a functionary of which scheme ?',
    ['ANM', 'MMU', 'ICDS', 'NHM'],
    'అంగన్‌వాడి కార్యకర్తకు సంబంధించిన పథకం ఏది ?',
    ['ANM', 'MMU', 'ICDS', 'NHM'],
    2,
    'Anganwadi workers serve as community-level grassroots functionaries under the Integrated Child Development Services (ICDS) scheme.',
    'అంగన్‌వాడీ కార్యకర్తలు సమగ్ర శిశు అభివృద్ధి పథకం (ICDS) క్రింద పనిచేస్తారు.'
  ],
  [
    141, 'science', 'Climate Change',
    'Reason for the melting of Gangothri glaciers of Himalayas',
    ['Global warming', 'Chloroflourocarbons', 'Particulated dust', 'Green house gases'],
    'హిమాలయాలలోని గంగోత్రి హిమానీనదాలు కరిగిపోవడానికి కారణం',
    ['ప్రపంచ తాపం (గ్లోబల్ వార్మింగ్)', 'క్లోరోఫ్లోరో కార్బన్లు', 'పార్టిక్యులేటెడ్ దుమ్ము', 'గ్రీన్ హౌస్ వాయువులు'],
    0,
    'Rising average temperatures driven by global warming are the primary driver of accelerated retreat and melting of Himalayan glaciers including Gangotri.',
    'గ్లోబల్ వార్మింగ్ (ప్రపంచ తాపం) పెరగడం వల్ల హిమాలయాలలోని గంగోత్రి హిమానీనదాలు వేగంగా కరిగిపోతున్నాయి.'
  ],
  [
    142, 'science', 'Waste Management',
    'Match the following :\nWaste Disposal Method\na. Landfilling\nb. Incineration\nc. Composting\nd. Recycling\n\nPros/Cons\nI. Low-cost, but has long-term environmental impact\nII. Reduces volume of waste, but emits pollutants\nIII. Produces useful by-products like biogas, but requires land\nIV. Conserves resources, but needs infrastructure\n\nCodes (a b c d) :',
    ['II  IV  I  III', 'IV  II  III  I', 'I  II  III  IV', 'IV  II  I  III'],
    'వ్యర్థాలను పారవేసే పద్ధతిని దాని లాభాలు లేదా నష్టాలతో సరిపోల్చండి.\nపారవేయు (డిస్పోజల్) పద్ధతి\na. ల్యాండ్‌ఫిల్లింగ్\nb. దహనం\nc. కంపోస్టింగ్\nd. రీసైక్లింగ్\n\nలాభాలు/నష్టాలు\nI. తక్కువ ధర, కానీ దీర్ఘకాలిక పర్యావరణ ప్రభావాన్ని కలిగి ఉంటుంది\nII. వ్యర్థాల పరిమాణాన్ని తగ్గిస్తుంది, కానీ కాలుష్య కారకాలను విడుదల చేస్తుంది\nIII. బయోగ్యాస్ వంటి ఉపయోగకరమైన ఉపఉత్పత్తులను ఉత్పత్తి చేస్తుంది, కానీ భూమి అవసరం\nIV. వనరులను సంరక్షిస్తుంది, కానీ మౌలిక సదుపాయాలు అవసరం\n\nకోడ్‌లు (a b c d) :',
    ['II  IV  I  III', 'IV  II  III  I', 'I  II  III  IV', 'IV  II  I  III'],
    2,
    'Landfilling matches I (low cost, long-term impact); Incineration matches II (reduces volume, emits pollutants); Composting matches III (useful by-products, needs land); Recycling matches IV (conserves resources, needs infrastructure).',
    'ల్యాండ్‌ఫిల్లింగ్-(I), దహనం-(II), కంపోస్టింగ్-(III), రీసైక్లింగ్-(IV).'
  ],
  [
    143, 'science', 'Nuclear Science & Technology',
    'Assertion (A) : DHRUVA is India\'s largest nuclear research reactor.\nReason (R) : Advanced Heavy Water Reactor envisages large scale utilization of plutonium bearing spent fuel.',
    ['(A) and (R) are correct and (R) is the correct explanation of (A)', '(A) and (R) are correct but (R) is not the correct explanation of (A)', '(A) is correct but (R) is not correct', '(A) is not correct but (R) is correct'],
    'వాదన (A) : DHRUVA అనేది భారతదేశపు అతి పెద్ద అణు పరిశోధన రియాక్టర్.\nకారణం (R) : అధునాతన హెవీ వాటర్ రియాక్టర్ ప్లుటోనియం ఉన్న ఖర్చు చేసిన ఇంధనాన్ని పెద్ద ఎత్తున వినియోగిస్తుంది.',
    ['(A) మరియు (R) సరైనవి మరియు (A) కి (R) సరైన వివరణ', '(A) మరియు (R) సరైనవి కానీ (A) కి (R) సరైన వివరణ కాదు', '(A) సరైనది కానీ (R) సరైనది కాదు', '(A) సరైనది కాదు కానీ (R) సరైనది'],
    1,
    'Both statements are factual (Dhruva at BARC Trombay is India\'s largest 100 MWth research reactor, and AHWR is designed for thorium/plutonium-bearing fuel), though R describes AHWR rather than explaining Dhruva.',
    'DHRUVA మరియు అధునాతన హెవీ వాటర్ రియాక్టర్ (AHWR) గురించిన రెండు ప్రకటనలు సరైనవి, కానీ R అనేది A కి సరైన వివరణ కాదు.'
  ],
  [
    144, 'science', 'Cyber Security & ICT',
    'What is Digital arrest ?',
    ['Arrest made by police when the accused is in foreign countries', 'Arrest made by police when the accused cannot be arrested physically', 'Arrest made by police when the accused is granted anticipatory bail by courts', 'Term used by cyber criminals to scare victims'],
    'డిజిటల్ అరెస్ట్ అనగా ఏమి ?',
    ['నిందితుడు విదేశాలలో ఉన్నప్పుడు పోలీసులు చేసే అరెస్ట్', 'నిందితుడిని భౌతికంగా అరెస్ట్ చేయలేనప్పుడు పోలీసులు చేసే అరెస్ట్', 'నిందితుడికి కోర్టులు ముందస్తు బెయిల్ ఇచ్చినప్పుడు పోలీసులు చేసే అరెస్ట్', 'సైబర్ నేరగాళ్ళు బాధితులను భయ పెట్టేందుకు వాడే పదం'],
    3,
    '"Digital arrest" has no legal basis in Indian law; it is a scam tactic used by cyber fraudsters posing as law enforcement via video calls to extort victims.',
    'భారత చట్టంలో డిజిటల్ అరెస్ట్ అనే నిబంధన లేదు; సైబర్ నేరగాళ్ళు బాధితులను బెదిరించి డబ్బు కాజేసేందుకు వాడే మోసపూరిత పదం.'
  ],
  [
    145, 'science', 'Renewable Energy in India',
    'State which is the largest producer of wind energy in India',
    ['Andhra Pradesh', 'Gujarat', 'Tamil Nadu', 'Karnataka'],
    'భారతదేశంలో అత్యధిక పవన శక్తిని ఉత్పత్తి చేసే రాష్ట్రం ఏది ?',
    ['ఆంధ్రప్రదేశ్', 'గుజరాత్', 'తమిళనాడు', 'కర్ణాటక'],
    1,
    'As per recent MNRE wind power data, Gujarat leads India in installed wind energy capacity and production, followed closely by Tamil Nadu and Karnataka.',
    'తాజా MNRE గణాంకాల ప్రకారం భారతదేశంలో అత్యధిక పవన శక్తిని ఉత్పత్తి చేసే రాష్ట్రంగా గుజరాత్ అగ్రస్థానంలో ఉంది.'
  ],
  [
    146, 'science', 'Emerging Technologies',
    'Match List – I with List – II and choose the correct answer using the codes given below.\nList – I (Emerging Technology)\na. Artificial Intelligence\nb. Open-AI\nc. Internet of Things (IoT)\nd. Augmented reality\n\nList – II (Scientist)\nI. Kevin Ashton\nII. Sam Altman\nIII. Thomas P. Caudell\nIV. Alan Turing\n\nCodes (a b c d) :',
    ['I  III  IV  II', 'IV  II  I  III', 'IV  II  III  I', 'II  IV  III  I'],
    'జాబితా – I ని జాబితా – II తో సరిపోల్చండి మరియు క్రింద ఇచ్చిన కోడ్‌లను ఉపయోగించి సరైన సమాధానాన్ని ఎంచుకోండి.\nజాబితా – I (ఎమర్జింగ్ టెక్నాలజీ)\na. కృత్రిమ మేధస్సు\nb. ఓపెన్ AI (Open-AI)\nc. ఇంటర్నెట్ ఆఫ్ థింగ్స్ (IoT)\nd. ఆగ్మెంటెడ్ రియాలిటీ\n\nజాబితా – II (శాస్త్రవేత్త)\nI. కెవిన్ ఆష్టన్\nII. సామ్ ఆల్ట్‌మాన్\nIII. థామస్ పి. కౌడెల్\nIV. అలాన్ ట్యూరింగ్\n\nకోడ్‌లు (a b c d) :',
    ['I  III  IV  II', 'IV  II  I  III', 'IV  II  III  I', 'II  IV  III  I'],
    1,
    'Artificial Intelligence -> Alan Turing (IV); Open-AI -> Sam Altman (II); IoT -> Kevin Ashton (I); Augmented Reality -> Thomas P. Caudell (III).',
    'కృత్రిమ మేధస్సు-అలాన్ ట్యూరింగ్ (IV), ఓపెన్ AI-సామ్ ఆల్ట్‌మాన్ (II), IoT-కెవిన్ ఆష్టన్ (I), ఆగ్మెంటెడ్ రియాలిటీ-థామస్ పి. కౌడెల్ (III).'
  ],
  [
    147, 'science', 'Solid Waste Management',
    'Which Indian city is recognized for adopting zero waste concept in solid waste management ?',
    ['Mumbai', 'Delhi', 'Pune', 'Indore'],
    'ఘన వ్యర్థ నిర్వహణలో (సాలిడ్ వేస్ట్ మేనేజ్‌మెంట్) సున్నా వ్యర్థాల విధానాన్ని (జీరో వేస్ట్ కాన్సెప్ట్) అనుసరించినందుకుగానూ ఏ భారతీయ నగరం గుర్తింపు పొందింది ?',
    ['ముంబై', 'ఢిల్లీ', 'పూణే', 'ఇందోర్'],
    3,
    'Indore (Madhya Pradesh), repeatedly ranked India\'s cleanest city under Swachh Survekshan, is widely recognized as a pioneer of 100% source segregation and the zero-waste landfill model.',
    'ఘన వ్యర్థాల నిర్వహణలో 100% విభజన మరియు జీరో వేస్ట్ విధానాన్ని విజయవంతంగా అమలు చేసినందుకు ఇందోర్ గుర్తింపు పొందింది.'
  ],
  [
    148, 'science', 'Environment & Ecology',
    'Choose the incorrect statement.',
    ['CO2 is continuously being released because of human activities', 'Deforestation is decreasing the amount of CO2', 'Oil spillage causes oxygen depletion and distress to aquatic animals', 'Burning of plastic reduces the germination of seeds in crop fields'],
    'తప్పు ప్రకటనను ఎంచుకోండి.',
    ['మానవ కార్యకలాపాల కారణంగా CO2 నిరంతరం విడుదల చేయబడుతోంది', 'అటవీ నిర్మూలన CO2 మొత్తాన్ని తగ్గిస్తుంది', 'చమురు చిందటం వలన ఆక్సిజన్ తగ్గి జలచరాలకు ఇబ్బంది కలుగుతుంది', 'ప్లాస్టిక్‌ను కాల్చడం వల్ల పంట పొలాల్లో విత్తనాలు మొలకెత్తడం తగ్గుతుంది'],
    1,
    'Deforestation removes carbon-absorbing trees and releases stored carbon, which increases—not decreases—atmospheric CO2.',
    'అటవీ నిర్మూలన వలన వాతావరణంలో CO2 పరిమాణం పెరుగుతుంది కానీ తగ్గదు. కనుక (2) తప్పు ప్రకటన.'
  ],
  [
    149, 'science', 'Space & Astronomy in India',
    'Radio Astronomy center is located in',
    ['Trombay', 'Ahmedabad', 'Dhanbad', 'Ooty'],
    'రేడియో ఖగోళ శాస్త్ర కేంద్రం ఎక్కడ ఉంది ?',
    ['ట్రాంబే', 'అహ్మదాబాద్', 'ధన్‌బాద్', 'ఊటీ'],
    3,
    'The Radio Astronomy Centre (RAC) of TIFR-NCRA, housing the Ooty Radio Telescope (ORT), is located at Ooty (Udhagamandalam), Tamil Nadu.',
    'టాటా ఇన్‌స్టిట్యూట్ ఆఫ్ ఫండమెంటల్ రీసెర్చ్ ఆధ్వర్యంలోని రేడియో ఖగోళ శాస్త్ర కేంద్రం (RAC) ఊటీలో ఉంది.'
  ],
  [
    150, 'science', 'Public Health & Nutrition',
    'Which of the following factors contributed most to the burden of malnutrition in India ?',
    ['Lack of access to clean water', 'Poor dietary habits and food insecurity', 'Overconsumption of processed foods', 'Increase in environmental pollution'],
    'భారతదేశంలో పోషకాహార లోప భారం పెరగడానికి క్రింది అంశాలలో ఏది ఎక్కువగా దోహదపడింది ?',
    ['స్వచ్ఛమైన నీరు అందుబాటులో లేకపోవడం', 'నాణ్యత లేని ఆహారపు అలవాట్లు మరియు ఆహార అభద్రత', 'ప్రక్రియ ద్వారా తయారు చేసిన (ప్రాసెస్) చేసిన ఆహార పదార్థాలను అధికంగా తీసుకోవడం', 'పర్యావరణ కాలుష్యం పెరుగుదల'],
    1,
    'Poor dietary diversity/quality, nutrient-deficient food habits, and household food insecurity are the primary drivers of undernutrition and micronutrient malnutrition in India.',
    'నాణ్యత లేని ఆహారపు అలవాట్లు మరియు ఆహార అభద్రత భారతదేశంలో పోషకాహార లోప భారానికి ప్రధాన కారణాలు.'
  ]
];

const questions = RAW_QUESTIONS.map(([qNo, sec, subtopic, qEn, optsEn, qTe, optsTe, ansIdx, expEn, expTe]) => {
  const isEcon = sec === 'economy';
  const sectionName = isEcon ? 'Indian and AP Economy' : 'Science and Technology';
  const subject = isEcon ? 'General Knowledge' : 'General Science';
  const subjectId = isEcon ? 'general-knowledge' : 'general-science';
  const categoryId = isEcon ? 'gk' : 'general-science';
  const topicId = isEcon ? 'indian-economy' : 'science-technology';
  const topic = isEcon ? 'Indian Economy' : 'Science & Technology';

  return {
    id: `appsc-group2-2025-p2-q${qNo}`,
    examType: 'APPSC Group II',
    examLevel: 'Group II',
    examLevelLabel: 'APPSC Group-II Paper-II (2025)',
    examCode: '2G/202 (C)',
    shiftNumber: 1,
    setNumber: 1,
    examName: 'APPSC Group-2 Paper-2 (2025)',
    examYear: '2025',
    examDate: '23 Feb 2025',
    shiftTiming: 'Paper-II · 150 Mins',
    questionNumber: qNo,
    sectionNumber: isEcon ? 1 : 2,
    sectionName,
    subject,
    subjectId,
    categoryId,
    topicId,
    topic,
    subtopic,
    pdfSubtopic: subtopic,
    question: {
      en: qEn,
      te: qTe
    },
    options: {
      en: optsEn,
      te: optsTe
    },
    correctAnswer: ansIdx,
    correctLetter: LETTERS[ansIdx],
    explanation: {
      en: `${expEn} (APPSC Group-2 Paper-2 2025 · Section ${isEcon ? 'A: Indian & AP Economy' : 'B: Science & Technology'} · Q${qNo})`,
      te: `${expTe} (APPSC గ్రూప్-2 పేపర్-2 2025 · Q${qNo})`
    },
    status: 'Published',
    verificationStatus: 'VERIFIED',
    questionType: 'PYQ',
    isPyq: true,
    difficulty: 'Medium',
    source: `APPSC Group-2 Paper-2 (2025) Official Question Paper · Series (C) · Q${qNo}`,
    paperUrl: '/assets/aistudio/Group-2-_-Prelims-Exam-Question-Paper-2-2025_copy_f6e37955.pdf',
    paperFileName: 'Group-2-_-Prelims-Exam-Question-Paper-2-2025.pdf',
    createdAt: '2026-11-13T01:45:00.000Z'
  };
});

// Strict validation
if (questions.length !== 150) {
  throw new Error(`Expected 150 questions, got ${questions.length}`);
}

const seenNums = new Set();
for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  if (q.questionNumber !== i + 1) {
    throw new Error(`Question number mismatch at index ${i}: got ${q.questionNumber}`);
  }
  if (seenNums.has(q.questionNumber)) {
    throw new Error(`Duplicate questionNumber: ${q.questionNumber}`);
  }
  seenNums.add(q.questionNumber);
  if (!q.question.en.trim() || !q.question.te.trim()) {
    throw new Error(`Missing question text on Q${q.questionNumber}`);
  }
  if (!Array.isArray(q.options.en) || q.options.en.length !== 4 || q.options.en.some((o) => !String(o).trim())) {
    throw new Error(`Invalid English options on Q${q.questionNumber}`);
  }
  if (!Array.isArray(q.options.te) || q.options.te.length !== 4 || q.options.te.some((o) => !String(o).trim())) {
    throw new Error(`Invalid Telugu options on Q${q.questionNumber}`);
  }
  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
    throw new Error(`Invalid correctAnswer on Q${q.questionNumber}`);
  }
}

const payload = {
  metadata: EXAM_META,
  shifts: [SHIFT_META],
  questions
};

const outPath = path.resolve(process.cwd(), 'public/data/appscGroup2Paper22025Full.json');
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf-8');
console.log(`Successfully generated ${outPath} with ${questions.length} bilingual (EN + TE) questions.`);
