import fs from 'fs';
import path from 'path';

/**
 * Generates /public/data/appscGroup2Prelims2024Full.json
 * Complete 146 physically present bilingual (English + Telugu) questions from:
 * APPSC Group-II Preliminary Exam Official Paper (Held on 25 Feb 2024 · Booklet GS/2G/200 · Series A)
 * (Note: Booklet page 11 containing Q27–Q30 of Section A is absent in the scanned source PDF;
 *  all 146 physically present questions Q1–Q26 and Q31–Q150 are preserved verbatim and separated by subject & topic.)
 *
 * Topic Segregation Structure:
 * - Section A (Q1–Q26): Indian History -> subjectId: "general-knowledge", topicId: "indian-history"
 * - Section B (Q31–Q60): Geography -> subjectId: "general-knowledge", topicId: "indian-geography"
 * - Section C (Q61–Q90): Indian Society -> subjectId: "general-knowledge", topicId: "indian-society"
 * - Section D (Q91–Q120): Current Affairs -> subjectId: "current-affairs", exact CA topicId per question
 * - Section E (Q121–Q150): Mental Ability -> separated cleanly into "reasoning" & "quantitative-aptitude" with exact syllabus topicIds
 */

const PAPER_URL = '/assets/aistudio/APPSC-Group-II-Preliminary-Exam-Official-Paper-Held-On_-25-Feb-2024_3a12a02d.pdf';
const PAPER_FILENAME = 'APPSC-Group-II-Preliminary-Exam-Official-Paper-Held-On_-25-Feb-2024.pdf';
const CREATED_AT = new Date().toISOString();

// Tuple: [qn, secNo, secName, subject, subjectId, categoryId, topicId, topic, subtopic, enQ, teQ, enOpts[4], teOpts[4], ansIdx, enExp, teExp, imageUrl?]
const RAW_QUESTIONS = [
  // ================= SECTION A: INDIAN HISTORY (Q1–Q26) =================
  [
    1, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Buddhism & Stupa Architecture',
    "'Anda, harmika and chhatri' are integral parts of which one of the following Buddhist monuments ?",
    "'అండము, హర్మిక మరియు ఛత్రము' అనేవి క్రింది బౌద్ధ స్మారక కట్టడాలలో దేనిలో అంతర్భాగం ?",
    ['Chaityas', 'Viharas', 'Stupas', 'Basadis'],
    ['చైత్యాలు', 'విహారాలు', 'స్తూపాలు', 'బసదీలు'],
    2,
    'In Buddhist architecture, a Stupa features a hemispherical dome (Anda) topped by a square balcony-like railing (Harmika) supporting a triple umbrella mast (Chhatri).',
    'బౌద్ధ వాస్తుశిల్పంలో స్తూపం అర్ధగోళాకార గోపురం (అండము), దానిపై చతురస్రాకార కంచె (హర్మిక), మరియు ఛత్రము (Chhatri) అనే భాగాలను కలిగి ఉంటుంది.'
  ],
  [
    2, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Mauryan Empire & Ashokan Inscriptions',
    'Which among the following pillar inscriptions of Ashoka states that the land revenue rate of Lumbini was reduced to one-eighth ?',
    'కింది అశోకుని స్తూప శాసనాలలో ఏది లుంబిని యొక్క భూ ఆదాయం రేటు ఎనిమిదో వంతుకు తగ్గించబడిందని పేర్కొంది ?',
    ['Maski pillar inscription', 'Rummindei pillar inscription', 'Kalsi pillar inscription', 'Vaishali pillar inscription'],
    ['మాస్కీ స్తంభ శాసనం', 'రుమ్మిందేయ్ స్తంభ శాసనం', 'కల్సి స్తంభ శాసనం', 'వైశాలి స్తంభ శాసనం'],
    1,
    'The Rummindei (Lumbini) pillar inscription records Emperor Ashoka’s visit to the Buddha’s birthplace, where he exempted Lumbini from bali tax and reduced land revenue (bhaga) to one-eighth.',
    'రుమ్మిందేయ్ స్తంభ శాసనం అశోకుడు బుద్ధుని జన్మస్థలమైన లుంబినిని సందర్శించి బలి పన్నును రద్దు చేసి భూమి శిస్తును 1/8వ వంతుకు తగ్గించినట్లు పేర్కొంటుంది.'
  ],
  [
    3, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Mughal Art & Painting',
    'Consider the following statements :\na. Humayun brought famous painters Mir Sayyid Ali and Abdus Samad from Iran to Delhi.\nb. Jahangir’s reign is considered as the ‘Golden period of the Mughal painting’.\nc. During the reign of Jahangir, European painting was introduced at the Mughal court by the Danish merchants.\nWhich of the statements given above is/are incorrect ?',
    'కింది ప్రకటనలను పరిగణించండి :\na. హుమాయున్ ప్రముఖ చిత్రకారులైన మీర్ సయ్యద్ అలీ మరియు అబ్దుస్ సమద్‌లను ఇరాన్ నుండి ఢిల్లీకి తీసుకువచ్చాడు.\nb. జహంగీర్ పాలన ‘మొఘల్ పెయింటింగ్ యొక్క స్వర్ణ యుగం’గా పరిగణించబడుతుంది.\nc. జహంగీర్ పాలనలో, డానిష్ వ్యాపారులు మొఘల్ ఆస్థానంలో యూరోపియన్ పెయింటింగ్‌ను ప్రవేశపెట్టారు.\nపైన ఇచ్చిన ప్రకటనలలో ఏది/ఏవి సరికానివి ?',
    ['Statements a and b', 'Statements b and c', 'Statement a only', 'Statement c only'],
    ['ప్రకటనలు a మరియు b', 'ప్రకటనలు b మరియు c', 'ప్రకటన a మాత్రమే', 'ప్రకటన c మాత్రమే'],
    3,
    'Statements a and b are correct. Statement c is incorrect because European painting was introduced to the Mughal court primarily by Portuguese Jesuits during Akbar’s reign (not Danish merchants under Jahangir).',
    'ప్రకటనలు a మరియు b సరైనవి. మొఘల్ ఆస్థానంలో యూరోపియన్ చిత్రకళను అక్బర్ కాలంలో పోర్చుగీసు జెస్యూట్లు పరిచయం చేశారు (డానిష్ వ్యాపారులు కాదు), కాబట్టి c మాత్రమే సరికాదు.'
  ],
  [
    4, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Mauryan Administration',
    'Which Mauryan officer was the incharge of Weights and Measures ?',
    'ఏ మౌర్య అధికారి తూనికలు మరియు కొలతలకు బాధ్యత వహించారు ?',
    ['Sulkadhyaksha', 'Samsthadhyaksha', 'Pautavadhyaksha', 'Panyadhyaksha'],
    ['శుల్కాధ్యక్ష', 'సంస్థాధ్యక్ష', 'పౌతవాధ్యక్ష', 'పాణ్యాధ్యక్ష'],
    2,
    'In Kautilya’s Arthashastra, Pautavadhyaksha was the Superintendent of Weights and Measures, whereas Sulkadhyaksha handled customs/tolls, Samsthadhyaksha supervised markets, and Panyadhyaksha supervised trade.',
    'కౌటిల్యుని అర్థశాస్త్రం ప్రకారం పౌతవాధ్యక్ష తూనికలు మరియు కొలతల శాఖాధిపతిగా వ్యవహరించారు.'
  ],
  [
    5, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Gupta Period Science & Literature',
    'Romaka Siddhanta written by Varahamihira deals with :',
    'వరాహమిహిర రచించిన రోమక సిద్ధాంతం దేనికి సంబంధించినది ?',
    ['Chemistry', 'Mathematics', 'Astronomy', 'Medicine'],
    ['రసాయన శాస్త్రం', 'గణితం', 'ఖగోళ శాస్త్రం', 'ఔషధం'],
    2,
    'Romaka Siddhanta (summarized in Varahamihira’s Pancha-Siddhantika) is an ancient Indian astronomical treatise showing Greco-Roman astronomical influence.',
    'వరాహమిహిరుని పంచసిద్ధాంతికలో భాగమైన రోమక సిద్ధాంతం ఖగోళ శాస్త్రానికి సంబంధించిన గ్రంథం.'
  ],
  [
    6, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Vardhana Dynasty & Sanskrit Literature',
    'Which one of the following books was not written by Harshavardhana ?',
    'కింది వాటిలో హర్షవర్ధనుడు వ్రాయని పుస్తకం ఏది?',
    ['Priyadarshika', 'Ratnavali', 'Nagananda', 'Kadambari'],
    ['ప్రియదర్శిక', 'రత్నావళి', 'నాగానంద', 'కాదంబరి'],
    3,
    'Harshavardhana authored the three Sanskrit plays Priyadarshika, Ratnavali, and Nagananda. Kadambari (and Harshacharita) was written by his court poet Banabhatta.',
    'ప్రియదర్శిక, రత్నావళి, నాగానంద నాటకాలను హర్షవర్ధనుడు రచించగా, కాదంబరిని బాణభట్టు రచించారు.'
  ],
  [
    7, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'British Land Revenue Systems',
    'Which of the following statements is incorrect with reference to Permanent Settlement ?',
    'పర్మనెంట్ సెటిల్‌మెంట్‌కు సంబంధించి కింది స్టేట్‌మెంట్లలో ఏది సరికానిది ?',
    [
      'It was introduced by Lord Cornwallis in Bengal, Bihar and Orissa in 1795.',
      'It declared Zamindars as the owners of the land and they were given hereditary rights.',
      'It was planned by John Shore.',
      'The amount to be paid by the landlords was fixed.'
    ],
    [
      'దీనిని లార్డ్ కార్న్వాలిస్ 1795లో బెంగాల్, బీహార్ మరియు ఒరిస్సాలో ప్రవేశపెట్టారు.',
      'ఇది జమీందార్లను భూమికి యజమానులుగా ప్రకటించింది మరియు వారసత్వ హక్కులు ఇవ్వబడింది.',
      'ఇది జాన్ షోర్ ద్వారా ప్రణాళిక చేయబడింది.',
      'భూస్వాములు చెల్లించాల్సిన మొత్తం నిర్ణయించబడింది.'
    ],
    0,
    'Lord Cornwallis introduced the Permanent Settlement in Bengal, Bihar, and Orissa in 1793 (not 1795). All other statements regarding John Shore’s planning and Zamindars’ fixed hereditary rights are correct.',
    'పర్మనెంట్ సెటిల్‌మెంట్ (శాశ్వత శిస్తు విధానం)ను లార్డ్ కార్న్వాలిస్ 1793లో ప్రవేశపెట్టారు (1795లో కాదు).'
  ],
  [
    8, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Delhi Sultanate Administration',
    'Match List I with List II and select the correct answer using the codes given below the lists :\nList I (Delhi Sultans)\na. Muhammad bin Tughlaq\nb. Alauddin Khalji\nc. Iltutmish\nd. Firuz Shah Tughlaq\nList II (Reforms)\nI. Branding of Horses\nII. Token Currency\nIII. Development of Irrigation\nIV. Introducing Silver Tankas\nCodes :',
    'జాబితా I మరియు జాబితా II లను జతపరచడం ద్వారా క్రింది ఇచ్చిన వాటిలో సరి అయిన సమాధానాన్ని గుర్తించండి :\nజాబితా I (ఢిల్లీ సుల్తాన్)\na. మహమ్మద్ బిన్ తుగ్లక్\nb. అల్లావుద్దీన్ ఖిల్జీ\nc. ఇల్తుట్మిష్\nd. ఫిరూజ్ షా తుగ్లక్\nజాబితా II (సంస్కరణలు)\nI. గుర్రాల బ్రాండ్\nII. టోకెన్ కరెన్సీ\nIII. నీటిపారుదల అభివృద్ధి\nIV. సిల్వర్ టాంకా పరిచయం\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    1,
    'Muhammad bin Tughlaq introduced Token Currency (II); Alauddin Khalji introduced Dagh / branding of horses (I); Iltutmish introduced Silver Tankas (IV); Firuz Shah Tughlaq developed canals and irrigation (III).',
    'మహమ్మద్ బిన్ తుగ్లక్: టోకెన్ కరెన్సీ (II); అల్లావుద్దీన్ ఖిల్జీ: గుర్రాల బ్రాండ్/దాగ్ (I); ఇల్తుట్మిష్: వెండి టంకా (IV); ఫిరూజ్ షా తుగ్లక్: నీటిపారుదల అభివృద్ధి (III).'
  ],
  [
    9, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Maratha Empire & Shivaji Ashtapradhans',
    'Among Ashtapradhans of Shivaji, the Sar-i-Naubat was associated with which of the following tasks ?',
    'శివాజీ యొక్క అష్టప్రధానులలో, సార్-ఇ-నౌబత్ కింది ఏ పనితో అనుబంధించబడింది ?',
    ['Finance Minister', 'Military Commander', 'Foreign Secretary', 'Revenue Minister'],
    ['ఆర్థిక మంత్రి', 'సైన్యాధ్యక్షుడు', 'విదేశాంగ కార్యదర్శి', 'రెవెన్యూ మంత్రి'],
    1,
    'In Chhatrapati Shivaji Maharaj’s council of eight ministers (Ashtapradhan), the Sar-i-Naubat (Senapati) served as the Commander-in-Chief / Military Commander.',
    'శివాజీ అష్టప్రధాన మంత్రులలో సార్-ఇ-నౌబత్ (సేనాపతి) సైన్యాధ్యక్షుడిగా బాధ్యతలు నిర్వహించేవారు.'
  ],
  [
    10, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Revolt of 1857',
    'Match List I with List II and select the correct answer using the codes given below the lists :\nList I (Leaders)\na. Kunwar Singh\nb. Hazrat Mahal\nc. Nana Saheb\nd. Bakht Khan\nList II (Revolt Centres)\nI. Kanpur\nII. Delhi\nIII. Arrah, Bihar\nIV. Lucknow\nCodes :',
    'జాబితా I మరియు జాబితా II లను జతపరచడం ద్వారా క్రింది ఇచ్చిన వాటిలో సరి అయిన సమాధానాన్ని గుర్తించండి :\nజాబితా I (నాయకులు)\na. కున్వర్ సింగ్\nb. హజ్రత్ మహల్\nc. నానా సాహెబ్\nd. భక్త్ ఖాన్\nజాబితా II (తిరుగుబాటు కేంద్రాలు)\nI. కాన్పూర్\nII. ఢిల్లీ\nIII. అర్రా, బీహార్\nIV. లక్నో\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-III, b-IV, c-I, d-II', 'a-IV, b-III, c-II, d-I'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-III, b-IV, c-I, d-II', 'a-IV, b-III, c-II, d-I'],
    2,
    'During the 1857 Revolt: Kunwar Singh led at Arrah/Jagdishpur in Bihar (III), Begum Hazrat Mahal at Lucknow (IV), Nana Saheb at Kanpur (I), and Bakht Khan at Delhi (II).',
    '1857 తిరుగుబాటులో కున్వర్ సింగ్ అర్రా/బీహార్ (III), హజ్రత్ మహల్ లక్నో (IV), నానా సాహెబ్ కాన్పూర్ (I), భక్త్ ఖాన్ ఢిల్లీ (II) ప్రాంతాలకు నాయకత్వం వహించారు.'
  ],
  [
    11, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Indian Freedom Struggle & Labour Movement',
    'The All India Trade Union Congress (AITUC) was formed in Bombay in 1920. Who presided over its first session ?',
    'ఆల్ ఇండియా ట్రేడ్ యూనియన్ కాంగ్రెస్ (AITUC) 1920లో బొంబాయిలో స్థాపించబడింది. దాని మొదటి సమావేశానికి ఎవరు అధ్యక్షత వహించారు ?',
    ['N.M. Joshi', 'Lala Lajpat Rai', 'C.R. Das', 'Subhas Chandra Bose'],
    ['ఎన్.ఎం. జోషి', 'లాలా లజపత్ రాయ్', 'సి.ఆర్. దాస్', 'సుభాస్ చంద్ర బోస్'],
    1,
    'The All India Trade Union Congress (AITUC) was founded on 31 October 1920 in Bombay, with Lala Lajpat Rai elected as its first President.',
    '1920 అక్టోబర్ 31న బొంబాయిలో స్థాపించబడిన ఆల్ ఇండియా ట్రేడ్ యూనియన్ కాంగ్రెస్ (AITUC) మొదటి సమావేశానికి లాలా లజపత్ రాయ్ అధ్యక్షత వహించారు.'
  ],
  [
    12, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Constitutional Acts under British Rule',
    'Which Act introduced the Communal Electorate System ?',
    'ఏ చట్టం మతప్రాతిపదికన ఎన్నికల వ్యవస్థను ప్రవేశపెట్టింది?',
    ['Morley-Minto Reforms', 'Montague-Chelmsford Reforms', 'Rowlatt Act, 1919', 'Government of India Act, 1935'],
    ['మోర్లే-మింటో సంస్కరణలు', 'మాంటేగ్-చెమ్స్‌ఫోర్డ్ సంస్కరణలు', 'రౌలట్ చట్టం, 1919', 'భారత ప్రభుత్వ చట్టం, 1935'],
    0,
    'The Indian Councils Act of 1909, popularly known as the Morley-Minto Reforms, introduced separate communal electorates for Muslims.',
    '1909 భారత కౌన్సిల్స్ చట్టం (మోర్లే-మింటో సంస్కరణలు) భారతదేశంలో మతప్రాతిపదికన ప్రత్యేక నియోజకవర్గాల వ్యవస్థను ప్రవేశపెట్టింది.'
  ],
  [
    13, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'European Advent & Carnatic Wars',
    'Consider the following pairs regarding Carnatic wars :\nWars — Associated Treaty\nI. First Carnatic War : Treaty of Aix-la-Chapelle\nII. Second Carnatic War : Treaty of Yandabo\nIII. Third Carnatic War : Treaty of Paris\nWhich of the pairs given above are correctly matched ?',
    'కర్నాటిక్ యుద్ధాలకు సంబంధించి కింది జతలను పరిగణించండి :\nయుద్ధాలు — అనుబంధ ఒప్పందం\nI. మొదటి కర్నాటిక్ యుద్ధం : ఐక్స్-లా-చాపెల్లె ఒప్పందం\nII. రెండవ కర్నాటిక్ యుద్ధం : యాండాబో ఒప్పందం\nIII. మూడవ కర్నాటిక్ యుద్ధం : పారిస్ ఒప్పందం\nపైన ఇచ్చిన జతలలో ఏవి సరిగ్గా సరిపోతాయి ?',
    ['I and II', 'II and III', 'I and III', 'None of the above'],
    ['I మరియు II', 'II మరియు III', 'I మరియు III', 'పైవేవీ కాదు'],
    2,
    'The First Carnatic War (1746–48) ended with the Treaty of Aix-la-Chapelle, and the Third Carnatic War (1758–63) ended with the Treaty of Paris. The Second Carnatic War ended with the Treaty of Pondicherry (1754), whereas the Treaty of Yandabo (1826) ended the First Anglo-Burmese War.',
    'మొదటి కర్నాటిక్ యుద్ధం ఐక్స్-లా-చాపెల్లె ఒప్పందంతోను, మూడవ కర్నాటిక్ యుద్ధం పారిస్ ఒప్పందంతోను ముగిశాయి. రెండవ కర్నాటిక్ యుద్ధం పాండిచ్చేరి ఒప్పందంతో ముగిసింది (యాండాబో కాదు).'
  ],
  [
    14, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Social & Temple Entry Movements',
    'The Vaikom Satyagraha which started in Kerala was associated with :',
    'కేరళలో ప్రారంభమైన వైకోమ్ సత్యాగ్రహం దేనికి సంబంధించినది :',
    ['Eradication of Child Labour', 'Temple Entry Movement', "Women's Liberation", 'Vaishnavite Movement'],
    ['బాల కార్మికుల నిర్మూలన', 'ఆలయ ప్రవేశ ఉద్యమం', 'మహిళా విముక్తి', 'వైష్ణవ ఉద్యమం'],
    1,
    'Vaikom Satyagraha (1924–1925) in Travancore, Kerala was a historic non-violent Temple Entry Movement against untouchability and caste restrictions on public roads around the Vaikom Mahadeva temple.',
    'కేరళలోని వైకోమ్ సత్యాగ్రహం (1924–25) అంటరానితనానికి వ్యతిరేకంగా జరిగిన ప్రసిద్ధ ఆలయ ప్రవేశ ఉద్యమం.'
  ],
  [
    15, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Post-Independence Integration of Territories',
    'What was the code name of the Indian armed forces operation to liberate Goa, Daman and Diu from Portuguese rule ?',
    'గోవా, డామన్ మరియు డయ్యూలను పోర్చుగీస్ పాలన నుండి విముక్తి చేయడానికి భారత సాయుధ దళాలు చేసిన ఆపరేషన్ కోడ్ పేరు ఏమిటి ?',
    ['Operation Kiran', 'Operation Vijay', 'Operation Rajiv', 'Operation Pawan'],
    ['ఆపరేషన్ కిరణ్', 'ఆపరేషన్ విజయ్', 'ఆపరేషన్ రాజీవ్', 'ఆపరేషన్ పవన్'],
    1,
    'Operation Vijay (December 1961) was the military action by India’s armed forces that ended Portuguese colonial rule in Goa, Daman, and Diu.',
    '1961 డిసెంబర్‌లో గోవా, డామన్ మరియు డయ్యూలను పోర్చుగీసు పాలన నుండి విముక్తి చేయడానికి భారత సైన్యం నిర్వహించిన ఆపరేషన్ పేరు "ఆపరేషన్ విజయ్".'
  ],
  [
    16, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Governor-Generals & Treaties',
    'Match List I with List II and select the correct answer using the codes given below the lists :\nList I (Governor-General)\na. Warren Hastings\nb. Lord Wellesley\nc. Lord Minto-I\nd. Lord Hardinge-I\nList II (Treaty)\nI. Treaty of Salbai\nII. Treaty of Bassein\nIII. Treaty of Amritsar\nIV. Treaty of Lahore\nCodes :',
    'జాబితా I మరియు జాబితా II లను జతపరచడం ద్వారా క్రింది ఇచ్చిన వాటిలో సరి అయిన సమాధానాన్ని గుర్తించండి :\nజాబితా I (గవర్నర్ జనరల్)\na. వారెన్ హేస్టింగ్స్\nb. లార్డ్ వెల్లెస్లీ\nc. లార్డ్ మింటో-I\nd. లార్డ్ హార్డింగ్-I\nజాబితా II (సంధి)\nI. సల్బాయి సంధి\nII. బస్సేన్ సంధి\nIII. అమృత్‌సర్ సంధి\nIV. లాహోర్ సంధి\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-III, b-IV, c-I, d-II', 'a-IV, b-III, c-II, d-I'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-III, b-IV, c-I, d-II', 'a-IV, b-III, c-II, d-I'],
    0,
    'Warren Hastings: Treaty of Salbai (1782); Lord Wellesley: Treaty of Bassein (1802); Lord Minto-I: Treaty of Amritsar (1809); Lord Hardinge-I: Treaty of Lahore (1846).',
    'వారెన్ హేస్టింగ్స్: సల్బాయి సంధి (1782), లార్డ్ వెల్లెస్లీ: బస్సేన్ సంధి (1802), లార్డ్ మింటో-I: అమృత్‌సర్ సంధి (1809), లార్డ్ హార్డింగ్-I: లాహోర్ సంధి (1846).'
  ],
  [
    17, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Indus Valley Civilization',
    'Which of the following is not a Harappan site ?',
    'కింది వాటిలో హరప్పా ప్రదేశం కానిది ఏది ?',
    ['Sutkagendor', 'Surkotada', 'Sohgaura', 'Rakhigarhi'],
    ['సుట్కాగెండోర్', 'సుర్కోటడ', 'సోహగౌరా', 'రాఖీగర్హి'],
    2,
    'Sutkagendor (Makran coast), Surkotada (Gujarat), and Rakhigarhi (Haryana) are Harappan sites. Sohgaura (Gorakhpur, UP) is famous for a pre-Ashokan/Mauryan copper-plate inscription.',
    'సుట్కాగెండోర్, సుర్కోటడ, రాఖీగర్హి సింధు లోయ (హరప్పా) నాగరికత ప్రదేశాలు. సోహగౌరా (ఉత్తరప్రదేశ్) మౌర్యుల కాలపు రాగి ఫలక శాసనానికి ప్రసిద్ధి చెందింది.'
  ],
  [
    18, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Vedic Age & Ancient Inscriptions',
    'Which of the following inscriptions mentions the names of Vedic Gods Indra, Varuna, Mitra and Nasatyas ?',
    'కింది వాటిలో ఏ శాసనం వేద దేవతలైన ఇంద్ర, వరుణ, మిత్ర మరియు నాసత్యుల పేర్లను పేర్కొంది ?',
    ['Mansehra', 'Shahbazgarhi', 'Boghazkoi', 'Junagarh'],
    ['మన్సెహ్రా', 'షాబాజ్‌గర్హి', 'బోఘజ్కోయ్', 'జునాగఢ్'],
    2,
    'The 1400 BCE Boghazkoi inscription found in Anatolia (Turkey) records a treaty between the Hittite and Mitanni kings invoking Vedic deities Indra, Varuna, Mitra, and Nasatyas (Ashvins).',
    'క్రీ.పూ. 1400 నాటి బోఘజ్కోయ్ (టర్కీ) శాసనం హిట్టైట్ మరియు మిటాని రాజుల మధ్య ఒప్పందంలో ఇంద్ర, వరుణ, మిత్ర, నాసత్యుల వేద దేవతల పేర్లను పేర్కొంటుంది.'
  ],
  [
    19, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Mughal Empire Battles',
    'Which one of the following pairs is not correctly matched ?',
    'కింది జతలలో ఏది సరిగ్గా సరిపోలలేదు ?',
    ['Babur – Battle of Khanwa', 'Akbar – Battle of Haldighati', 'Humayun – Battle of Bilgram', 'Jahangir – Battle of Chausa'],
    ['బాబర్ – కాన్వా యుద్ధం', 'అక్బర్ – హల్దీఘాట్ యుద్ధం', 'హుమాయున్ – బిల్గ్రామ్ యుద్ధం', 'జహంగీర్ – చౌసా యుద్ధం'],
    3,
    'The Battle of Chausa (1539 CE) was fought between Humayun and Sher Shah Suri, not Jahangir. Babur fought Khanwa (1527), Akbar fought Haldighati (1576), and Humayun fought Bilgram/Kannauj (1540).',
    'చౌసా యుద్ధం (1539) హుమాయున్ మరియు షేర్ షా సూరిల మధ్య జరిగింది (జహంగీర్ కాదు).'
  ],
  [
    20, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Indian National Movement Chronology',
    'Arrange the following events in the correct chronological sequence :\nI. Cripps Mission\nII. Gandhi-Irwin Pact\nIII. Chauri Chaura Incident\nIV. Poona Pact',
    'కింది సంఘటనలను సరైన కాలక్రమానుసారం అమర్చండి :\nI. క్రిప్స్ మిషన్\nII. గాంధీ-ఇర్విన్ ఒప్పందం\nIII. చౌరీ-చౌరా సంఘటన\nIV. పూనా ఒప్పందం',
    ['I, II, III, IV', 'III, II, IV, I', 'IV, I, III, II', 'II, IV, III, I'],
    ['I, II, III, IV', 'III, II, IV, I', 'IV, I, III, II', 'II, IV, III, I'],
    1,
    'Correct chronological sequence: Chauri Chaura Incident (Feb 1922) -> Gandhi-Irwin Pact (Mar 1931) -> Poona Pact (Sep 1932) -> Cripps Mission (Mar 1942), i.e., III, II, IV, I.',
    'సరైన కాలక్రమం: చౌరీ-చౌరా (1922) -> గాంధీ-ఇర్విన్ ఒప్పందం (1931) -> పూనా ఒప్పందం (1932) -> క్రిప్స్ మిషన్ (1942).'
  ],
  [
    21, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'British East India Company Acts',
    'By which one of the following Acts was the Governor-General of Bengal designated as the Governor-General of India ?',
    'కింది ఏ చట్టం ద్వారా గవర్నర్ జనరల్ ఆఫ్ బెంగాల్‌ను భారత గవర్నర్ జనరల్‌గా నియమించారు ?',
    ['Regulating Act of 1773', 'Charter Act of 1833', 'Government of India Act, 1858', 'Government of India Act, 1935'],
    ['రెగ్యులేటింగ్ చట్టం, 1773', 'చార్టర్ చట్టం, 1833', 'భారత ప్రభుత్వ చట్టం, 1858', 'భారత ప్రభుత్వ చట్టం, 1935'],
    1,
    'The Charter Act of 1833 re-designated the Governor-General of Bengal as the Governor-General of India, making Lord William Bentinck the first Governor-General of India.',
    '1833 చార్టర్ చట్టం ద్వారా బెంగాల్ గవర్నర్ జనరల్‌ను భారత గవర్నర్ జనరల్‌గా మార్చారు (లార్డ్ విలియం బెంటింక్ మొదటి భారత గవర్నర్ జనరల్).'
  ],
  [
    22, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Colonial Education Policy',
    "During India's colonial period, the Downward Filtration Theory was related to :",
    'భారతదేశం యొక్క వలసరాజ్యాల కాలంలో, క్రిందికి వడపోత సిద్ధాంతం దేనికి సంబంధించినది :',
    ['Railways', 'Education', 'Irrigation', 'Poverty alleviation'],
    ['రైల్వేలు', 'విద్య', 'నీటిపారుదల', 'పేదరిక నిర్మూలన'],
    1,
    'Associated with Lord Macaulay’s Minute on Education (1835), the Downward Filtration Theory proposed educating a small upper/middle class first so Western education would filter down to the masses.',
    'వలస పాలనలో మెకాలే ప్రతిపాదించిన "డౌన్‌వర్డ్ ఫిల్ట్రేషన్ థియరీ" (క్రిందికి వడపోత సిద్ధాంతం) విద్యా విధానానికి సంబంధించినది.'
  ],
  [
    23, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Colonial Education Debates',
    'Who said that “a single shelf of a good European Library was worth the whole native literature of India and Arabia” ?',
    '“ఒక మంచి యూరోపియన్ లైబ్రరీ యొక్క సింగిల్ షెల్ఫ్ భారతదేశం మరియు అరేబియాలోని మొత్తం స్థానిక సాహిత్యాని కంటే విలువైనది” అని ఎవరు చెప్పారు ?',
    ['Thomas Babington Macaulay', 'William Jones', 'Henry Colebrooke', 'James Mill'],
    ['థామస్ బాబింగ్టన్ మెకాలే', 'విలియం జోన్స్', 'హెన్రీ కోల్‌బ్రూక్', 'జేమ్స్ మిల్'],
    0,
    'Thomas Babington Macaulay made this well-known Anglicist remark in his 1835 Minute on Indian Education.',
    '1835 నాటి తన విద్యా విధాన పత్రం (మెకాలే మినిట్)లో థామస్ బాబింగ్టన్ మెకాలే ఈ వ్యాఖ్య చేశారు.'
  ],
  [
    24, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Socio-Religious Reform Movements',
    'Which of the following is not correctly matched ?\nOrganisation – Person\n(1) Seva Sadan – Behramji M. Malabari\n(2) Deva Samaj – Radhakant Deb\n(3) Seva Samiti – Pandit Hriday Nath Kunzru\n(4) Bahujan Samaj – Mukundrao Patil',
    'కింది వాటిలో ఏది సరిగ్గా సరిపోలలేదు ?\nసంస్థ – వ్యక్తి\n(1) సేవా సదన్ – బెహ్రాంజీ ఎం. మలబారి\n(2) దేవ సమాజం – రాధాకాంత దేబ్\n(3) సేవా సమితి – పండిట్ హృదయ్ నాథ్ కుంజ్రు\n(4) బహుజన సమాజం – ముకుందరావు పాటిల్',
    ['Seva Sadan – Behramji M. Malabari', 'Deva Samaj – Radhakant Deb', 'Seva Samiti – Pandit Hriday Nath Kunzru', 'Bahujan Samaj – Mukundrao Patil'],
    ['సేవా సదన్ – బెహ్రాంజీ ఎం. మలబారి', 'దేవ సమాజం – రాధాకాంత దేబ్', 'సేవా సమితి – పండిట్ హృదయ్ నాథ్ కుంజ్రు', 'బహుజన సమాజం – ముకుందరావు పాటిల్'],
    1,
    'Deva Samaj was founded in 1887 in Lahore by Shiv Narayan Agnihotri (not Radhakanta Deb, who founded Dharma Sabha). All other matches are correct.',
    'దేవ సమాజాన్ని 1887లో శివ్ నారాయణ్ అగ్నిహోత్రి స్థాపించారు (రాధాకాంత దేబ్ ధర్మసభను స్థాపించారు).'
  ],
  [
    25, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'Advent of Europeans (Portuguese)',
    'Who among the following introduced the Blue Water Policy ?',
    'కింది వారిలో బ్లూ వాటర్ పాలసీని ఎవరు ప్రవేశపెట్టారు ?',
    ['Alfonso de Albuquerque', 'Pedro Alvares Cabral', 'Francisco de Almeida', 'Nino da Cunha'],
    ['అల్ఫోన్సో డి అల్బుకెర్కీ', 'పెడ్రో అల్వారెస్ కాబ్రాల్', 'ఫ్రాన్సిస్కో డి అల్మేడా', 'నినో డా కున్హా'],
    2,
    'Francisco de Almeida, the first Portuguese Viceroy in India (1505–1509), introduced the Blue Water Policy emphasizing maritime naval supremacy over territorial forts.',
    'భారతదేశంలో మొదటి పోర్చుగీసు వైస్రాయ్ అయిన ఫ్రాన్సిస్కో డి అల్మేడా సముద్ర ఆధిపత్యంపై దృష్టి సారించే "బ్లూ వాటర్ పాలసీ"ని ప్రవేశపెట్టారు.'
  ],
  [
    26, 1, 'Indian History', 'General Knowledge', 'general-knowledge', 'gk', 'indian-history', 'Indian History',
    'British Urban Town Planning',
    'Lottery Committee (1817) of the British Rule was related to :',
    'బ్రిటిష్ పాలన యొక్క లాటరీ కమిటీ (1817) దేనికి సంబంధించినది :',
    ['Eradication of Epidemics', 'Revenue Settlement', 'Town Planning', 'Education'],
    ['అంటువ్యాధుల నిర్మూలన', 'రెవెన్యూ సెటిల్మెంట్', 'పట్టణ ప్రణాళిక', 'విద్య'],
    2,
    'The Lottery Committee (1817) raised funds through public lotteries to carry out urban town planning and road/sanitation improvements in Calcutta.',
    '1817లో బ్రిటిష్ ప్రభుత్వం ఏర్పాటు చేసిన లాటరీ కమిటీ కలకత్తా నగర పట్టణ ప్రణాళిక (Town Planning) అభివృద్ధికి సంబంధించినది.'
  ],

  // ================= SECTION B: GEOGRAPHY (Q31–Q60) =================
  // (Note: Booklet page 11 containing Q27–Q30 is missing in the attached PDF)
  [
    31, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Continental Drift Theory',
    'Consider the following statements :\nI. According to Continental Drift Theory, about 150 million years ago, Pangaea, the super continent, had split into Laurasia and Gondwanaland.\nII. About 65 million years ago, Godwanaland further broke up to give rise to other continents.\nWhich of the above statements is/are correct ?',
    'కింది ప్రకటనలను పరిగణించండి :\nI. ఖండచలన సిద్ధాంతం ప్రకారం, సుమారు 150 మిలియన్ సంవత్సరాల క్రితం, పేంజియా అనబడే మహాఖండం, లారేషియా మరియు గోండ్వానాలాండ్‌లుగా విడిపోయింది.\nII. సుమారు 65 మిలియన్ సంవత్సరాల క్రితం, గోండ్వానాలాండ్ ఇతర ఖండాల ఏర్పాటుకు దారితీసేలా మరింతగా విడిపోయింది.\nపై ప్రకటనలలో ఏది/ఏవి సరైనవి ?',
    ['Statement I only', 'Statement II only', 'Both of them', 'None of them'],
    ['ప్రకటన I మాత్రమే', 'ప్రకటన II మాత్రమే', 'రెండూ', 'ఏదీ కాదు'],
    3,
    'According to Alfred Wegener / NCERT, Pangaea began splitting around 200 million years ago (Triassic) into Laurasia and Gondwanaland (not 150 mya), and Gondwanaland broke apart earlier during the Jurassic (~180–135 mya; not 65 mya). Thus neither statement states the accurate chronological age.',
    'ఖండచలన సిద్ధాంతం ప్రకారం సుమారు 200 మిలియన్ సంవత్సరాల క్రితం పాంజియా విడిపోయింది (150 మిలియన్ కాదు), మరియు గోండ్వానాలాండ్ అంతకుముందే విభజన ప్రారంభమైంది. కాబట్టి రెండూ సరికావు.'
  ],
  [
    32, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Earthquakes & Seismology',
    'Identify the incorrect statement :',
    'సరికాని ప్రకటనను గుర్తించండి :',
    [
      'At the focus of an earthquake, the energy is released.',
      'The point on the surface nearest to the focus is called epicentre.',
      'Epicentre is the first one to experience the waves.',
      'Epicentre is a point directly below the focus.'
    ],
    [
      'భూకంపనాభి వద్ద, శక్తి విడుదల అవుతుంది.',
      'భూకంపనాభి నుండి సమీపంలోని ఉపరితలంపై ఉన్న బిందువును అధికేంద్రం అంటారు.',
      'తరంగాలు మొదటిగా అధికేంద్రంను తాకుతాయి.',
      'అధికేంద్రం అనేది భూకంపనాభికి నేరుగా దిగువన ఉండే కేంద్రం.'
    ],
    3,
    'The epicentre is the point on the Earth’s surface directly above (not below) the earthquake focus (hypocentre).',
    'అధికేంద్రం (Epicentre) అనేది భూకంపనాభికి (Focus) నేరుగా పైన భూమి ఉపరితలంపై ఉంటుంది (దిగువన కాదు).'
  ],
  [
    33, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Rocks & Minerals',
    'Granite is a/an :',
    'గ్రానైట్ అనేది :',
    ['Extrusive Igneous rock', 'Intrusive Igneous rock', 'Mechanically formed Sedimentary rock', 'Mechanically formed Metamorphic rock'],
    ['ఉద్గత అగ్నిశిల', 'అంతర్గమ అగ్నిశిల', 'యాంత్రికంగా ఏర్పడిన అవక్షేప శిల', 'యాంత్రికంగా ఏర్పడిన రూపాంతర శిల'],
    1,
    'Granite forms when magma cools slowly deep beneath the Earth’s crust, making it a coarse-grained Intrusive (Plutonic) Igneous rock.',
    'భూగర్భంలో శిలాద్రవం నెమ్మదిగా చల్లబడటం వల్ల గ్రానైట్ ఏర్పడుతుంది కాబట్టి ఇది అంతర్గమ అగ్నిశిల (Intrusive Igneous rock).'
  ],
  [
    34, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Landforms & Geomorphic Agents',
    'Match the following :\nList I (Landform)\na. Delta\nb. Cirque\nc. Cliffs\nd. Sand Dunes\nList II (Geomorphic agent)\nI. Waves and Currents\nII. Winds\nIII. Running water\nIV. Glaciers\nCodes :',
    'కింది వాటిని సరిపోల్చండి :\nజాబితా I (భూస్వరూపం)\na. డెల్టా\nb. సిర్క్\nc. క్లిఫ్స్\nd. ఇసుక దిబ్బలు\nజాబితా II (భూస్వరూప కారకం)\nI. తరంగాలు మరియు ప్రవాహాలు\nII. పవనాలు\nIII. ప్రవహించే నీరు\nIV. హిమానీనదాలు\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-III, b-I, c-IV, d-II', 'a-III, b-IV, c-I, d-II'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-III, b-I, c-IV, d-II', 'a-III, b-IV, c-I, d-II'],
    3,
    'Delta is formed by running water/rivers (III); Cirque by glaciers (IV); Sea cliffs by ocean waves and currents (I); Sand dunes by winds (II).',
    'డెల్టా - ప్రవహించే నీరు (III); సిర్క్ - హిమానీనదాలు (IV); క్లిఫ్స్ - సముద్ర తరంగాలు (I); ఇసుక దిబ్బలు - పవనాలు (II).'
  ],
  [
    35, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Structure of Atmosphere',
    'In which of the following layers of the atmosphere do meteorites burn up when they enter from the space ?',
    'ఉల్కలు అంతరిక్షం నుండి ప్రవేశించినప్పుడు కింది ఇవ్వబడిన ఏ వాతావరణ పొరలలో కాలిపోతాయి ?',
    ['Mesosphere', 'Thermosphere', 'Ionosphere', 'Exosphere'],
    ['మెసో ఆవరణం', 'థర్మో ఆవరణం', 'అయానో ఆవరణం', 'ఎక్సో ఆవరణం'],
    0,
    'Most meteoroids/meteorites entering Earth’s atmosphere burn up in the Mesosphere due to frictional heating against the denser air layer.',
    'అంతరిక్షం నుండి భూమి వాతావరణంలోకి ప్రవేశించే ఉల్కలు రాపిడి కారణంగా మెసో ఆవరణంలో కాలిపోతాయి.'
  ],
  [
    36, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Atmospheric Heating Mechanisms',
    'Match the following on heating and cooling of Atmosphere :\nList I (Process)\na. Advection\nb. Convection\nc. Insolation\nd. Conduction\nList II (Mechanism)\nI. Horizontal heating\nII. Vertical heating\nIII. Direct heating\nIV. Heating the lower layers\nCodes :',
    'వాతావరణం వేడెక్కడం మరియు చల్లబడటం పై కింది వాటిని సరిపోల్చండి :\nజాబితా I (చర్య)\na. ఉష్ణ ప్రవాహం (Advection)\nb. ఉష్ణ సంవహనం (Convection)\nc. సూర్యపుటం (Insolation)\nd. ఉష్ణ వహనం (Conduction)\nజాబితా II (విధానం)\nI. క్షితిజ సమాంతర తాపనం\nII. ఊర్ధ్వ తాపనం\nIII. ప్రత్యక్ష తాపనం\nIV. దిగువ పొరలు వేడెక్కడం\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-III, b-I, c-IV, d-II', 'a-III, b-IV, c-I, d-II'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-III, b-I, c-IV, d-II', 'a-III, b-IV, c-I, d-II'],
    0,
    'Advection transfers heat horizontally (I); Convection transfers heat vertically (II); Insolation provides direct solar radiation heating (III); Conduction heats the lower atmospheric layers in contact with Earth’s surface (IV).',
    'ఉష్ణ ప్రవాహం (Advection) క్షితిజ సమాంతరంగా, ఉష్ణ సంవహనం (Convection) నిలువుగా, సూర్యపుటం ప్రత్యక్షంగా, మరియు ఉష్ణ వహనం (Conduction) దిగువ పొరలను వేడి చేస్తాయి.'
  ],
  [
    37, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Islands & Channels of India',
    'Consider the following statements :\nI. Kavaratti is the largest city in Lakshadweep Islands.\nII. Nine Degree Channel separates Minicoy Island of Lakshadweep from Maldives.\nWhich of the above statements is/are correct ?',
    'కింది ప్రకటనలను పరిగణించండి :\nI. లక్షద్వీప్ దీవులలోనే కవరత్తి అతిపెద్ద నగరం.\nII. తొమ్మిది డిగ్రీ ఛానల్ లక్షద్వీప్‌లోని మినికాయ్ ద్వీపాన్ని మాల్దీవుల నుండి వేరు చేస్తుంది.\nపై ప్రకటనలలో ఏది/ఏవి సరైనవి ?',
    ['Statement I only', 'Statement II only', 'Both of them', 'None of them'],
    ['ప్రకటన I మాత్రమే', 'ప్రకటన II మాత్రమే', 'రెండూ', 'ఏదీ కాదు'],
    0,
    'Statement I is correct: Kavaratti is the capital and most populous/largest urban settlement (city) of Lakshadweep (though Andrott is largest by island area). Statement II is incorrect: the Eight Degree Channel (not Nine Degree) separates Minicoy from the Maldives.',
    'కవరత్తి లక్షద్వీప్ రాజధాని మరియు అతిపెద్ద నగరం (ప్రకటన I సరైనది). మినికాయ్ ద్వీపాన్ని మాల్దీవుల నుండి వేరు చేసేది 8 డిగ్రీ ఛానల్ (9 డిగ్రీ కాదు).'
  ],
  [
    38, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Oceanography & Ocean Floor Relief',
    'Match the following :\nList I (Ocean Bottom Relief)\na. Continental Shelf\nb. Continental Slope\nc. Deep Sea Plain\nd. Oceanic Deeps\nList II (Characteristic feature)\nI. Presence of canyons and trenches\nII. Associated with active volcanoes and strong earthquakes.\nIII. Presence of massive sedimentary deposits\nIV. Presence of fine-grained sediments\nCodes :',
    'కింది వాటిని సరిపోల్చండి :\nజాబితా I (సముద్ర భూతల నిమ్నోన్నతాలు)\na. ఖండతీరపు అంచు\nb. ఖండతీరపు వాలు\nc. అగాధ సముద్ర మైదానం\nd. మహాసముద్రపు అగాధం\nజాబితా II (విశేష లక్షణం)\nI. అగాధాలు మరియు అగాధ ధరుల ఉనికి\nII. క్రియాశీల అగ్నిపర్వతాలు మరియు బలమైన భూకంపాలతో సంబంధం కలిగి ఉండుట\nIII. భారీ అవక్షేప నిక్షేపాల ఉనికి\nIV. సూక్ష్మ రేణువులతో కూడిన అవక్షేపాల ఉనికి\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-III, b-I, c-IV, d-II', 'a-III, b-IV, c-I, d-II'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-III, b-I, c-IV, d-II', 'a-III, b-IV, c-I, d-II'],
    2,
    'NCERT Fundamentals of Physical Geography: Continental Shelf holds massive sedimentary deposits (III); Continental Slope has submarine canyons and trenches (I); Deep Sea Plain is covered with fine-grained sediments like clay and silt (IV); Oceanic Deeps/Trenches are associated with active volcanoes and strong earthquakes (II).',
    'ఖండతీరపు అంచు భారీ అవక్షేప నిక్షేపాలు (III), ఖండతీరపు వాలు లోయలు/కందకాలు (I), అగాధ సముద్ర మైదానం సూక్ష్మ రేణువుల అవక్షేపాలు (IV), మహాసముద్ర అగాధాలు అగ్నిపర్వతాలు/భూకంపాలతో (II) సంబంధం కలిగి ఉంటాయి.'
  ],
  [
    39, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Oceanography & Salinity of Water Bodies',
    'Identify the correct arrangement of the following water bodies as per their salinity in decreasing order :',
    'వాటి లవణీయత ప్రకారం, తగ్గుతున్న క్రమంలో కింది నీటి వనరుల సరైన అమరికను గుర్తించండి :',
    [
      'Lake Van > Dead Sea > Great Salt Lake',
      'Dead Sea > Great Salt Lake > Lake Van',
      'Great Salt Lake > Dead Sea > Lake Van',
      'Dead Sea > Lake Van > Great Salt Lake'
    ],
    [
      'లేక్ వాన్ > డెడ్ సీ > గ్రేట్ సాల్ట్ లేక్',
      'డెడ్ సీ > గ్రేట్ సాల్ట్ లేక్ > లేక్ వాన్',
      'గ్రేట్ సాల్ట్ లేక్ > డెడ్ సీ > లేక్ వాన్',
      'డెడ్ సీ > లేక్ వాన్ > గ్రేట్ సాల్ట్ లేక్'
    ],
    0,
    'NCERT values for salinity in parts per thousand (‰): Lake Van in Turkey (~330‰) > Dead Sea (~238‰) > Great Salt Lake (~220‰).',
    'లవణీయత (‰) తగ్గుతున్న క్రమంలో: లేక్ వాన్ (టర్కీ - 330‰) > డెడ్ సీ (238‰) > గ్రేట్ సాల్ట్ లేక్ (220‰).'
  ],
  [
    40, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Physiography & Mountain Systems',
    'Which of the following mountains are young fold mountains ?',
    'కింది వాటిలో ఏ పర్వతాలు నవీన ముడుత(వళి) పర్వతాలు ?',
    ['The Appalachians', 'The Aravalis', 'The Alps', 'The Urals'],
    ['అప్పలెచియన్స్', 'ఆరావళి', 'ఆల్ప్స్', 'యురల్స్'],
    2,
    'The Alps (along with the Himalayas, Rockies, and Andes) are young fold mountains, whereas the Aravalis, Appalachians, and Urals are old fold mountains.',
    'ఆల్ప్స్ పర్వతాలు నవీన ముడుత పర్వతాలు కాగా, ఆరావళి, అప్పలెచియన్స్, యురల్స్ పురాతన ముడుత పర్వతాలు.'
  ],
  [
    41, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'World Climatic Regions & Grasslands',
    'Prairies are the temperate grasslands present in :',
    'ప్రైరీలు సమశీతోష్ణ గడ్డి భూములు ఇక్కడ ఉన్నాయి :',
    [
      'The United States and Mexico',
      'The United States only',
      'The United States and Canada',
      'Canada and Alaska'
    ],
    [
      'అమెరికా సంయుక్త రాష్ట్రాలు మరియు మెక్సికో',
      'అమెరికా సంయుక్త రాష్ట్రాలు మాత్రమే',
      'అమెరికా సంయుక్త రాష్ట్రాలు మరియు కెనడా',
      'కెనడా మరియు అలస్కా'
    ],
    2,
    'The Prairies are the extensive temperate grasslands of North America stretching across the central United States and Canada.',
    'ఉత్తర అమెరికాలోని అమెరికా సంయుక్త రాష్ట్రాలు మరియు కెనడాలో ప్రైరీ సమశీతోష్ణ గడ్డి భూములు విస్తరించి ఉన్నాయి.'
  ],
  [
    42, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Himalayan Regional Divisions',
    'The part of the Himalayas between Satluj and Kali rivers is called :',
    'సట్లెజ్ మరియు కాళీ నదుల మధ్య ఉన్న హిమాలయాల భాగాన్ని ఏమని పిలుస్తారు :',
    ['Punjab Himalayas', 'Kashmir Himalayas', 'Himachal Himalayas', 'Kumaon Himalayas'],
    ['పంజాబ్ హిమాలయాలు', 'కాశ్మీర్ హిమాలయాలు', 'హిమాచల్ హిమాలయాలు', 'కుమాయోన్ హిమాలయాలు'],
    3,
    'Regional division of the Himalayas from west to east: Indus–Satluj (Punjab Himalayas), Satluj–Kali (Kumaon Himalayas), Kali–Teesta (Nepal Himalayas), and Teesta–Dihang (Assam Himalayas).',
    'సట్లెజ్ మరియు కాళీ నదుల మధ్య ఉన్న హిమాలయ ప్రాంతాన్ని కుమాయోన్ హిమాలయాలు అంటారు.'
  ],
  [
    43, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Peninsular Plateau & Eastern Ghats',
    'The Eastern Ghats stretch from :',
    'తూర్పు కనుమలు ఎక్కడ నుండి ఎక్కడి వరకు విస్తరించి ఉన్నాయి :',
    [
      'The Mahanadi valley to Seshachalam hills',
      'Mahendragiri to Seshachalam hills',
      'Mahendragiri to the Nilgiris',
      'The Mahanadi valley to the Nilgiris'
    ],
    [
      'మహానది లోయ నుండి శేషాచలం కొండల వరకు',
      'మహేంద్రగిరి నుండి శేషాచలం కొండల వరకు',
      'మహేంద్రగిరి నుండి నీలగిరి వరకు',
      'మహానది లోయ నుండి నీలగిరి వరకు'
    ],
    3,
    'As stated in NCERT Class 9 Geography, the Eastern Ghats stretch from the Mahanadi Valley (Odisha) to the Nilgiris in the south, where they meet the Western Ghats.',
    'తూర్పు కనుమలు ఒడిశాలోని మహానది లోయ నుండి దక్షిణాన నీలగిరి పర్వతాల వరకు విస్తరించి ఉన్నాయి.'
  ],
  [
    44, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Indian River Systems & Waterfalls',
    'Which of the following river forms the Dhuandhar waterfalls ?',
    'కింది వాటిలో ఏ నది ధువాంధార్ జలపాతాన్ని ఏర్పరుస్తుంది ?',
    ['The Mahanadi', 'The Narmada', 'The Indus', 'The Brahmaputra'],
    ['మహానది', 'నర్మద', 'సింధు', 'బ్రహ్మపుత్ర'],
    1,
    'The Narmada River plunges over marble rocks at Bhedaghat near Jabalpur (Madhya Pradesh) to form the famous Dhuandhar Falls.',
    'మధ్యప్రదేశ్‌లోని జబల్‌పూర్ సమీపంలో భేడాఘాట్ పాలరాతి శిలలపై నర్మదా నది ధువాంధార్ జలపాతాన్ని ఏర్పరుస్తుంది.'
  ],
  [
    45, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Monsoon & Pre-Monsoon Showers',
    'Pre-monsoon Mango Showers are common in the coastal areas of :',
    'రుతుపవనాలకు ముందు పడే మామిడి జల్లులు ఏ కోస్తా తీర ప్రాంతాల్లో సాధారణంగా కురుస్తాయి :',
    ['Karnataka', 'Tamil Nadu', 'Gujarat', 'Andhra Pradesh'],
    ['కర్ణాటక', 'తమిళనాడు', 'గుజరాత్', 'ఆంధ్రప్రదేశ్'],
    0,
    'Pre-monsoon showers occurring at the close of summer over Kerala and coastal areas of Karnataka help in the early ripening of mangoes and are called Mango Showers.',
    'కేరళ మరియు కర్ణాటక తీర ప్రాంతాల్లో వేసవి చివరలో కురిసే వర్షాలను మామిడి జల్లులు (Mango Showers) అంటారు.'
  ],
  [
    46, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Soils of India',
    'In India, very deep black soils are found in :',
    'భారతదేశంలో, చాలా లోతైన నల్ల నేలలు ఇక్కడ కనిపిస్తాయి :',
    [
      'North-Western part of the Deccan Plateau',
      'Eastern part of the Deccan Plateau',
      'Southern part of the Deccan Plateau',
      'South-Eastern part of the Deccan Plateau'
    ],
    [
      'దక్కన్ పీఠభూమి యొక్క ఉత్తర పశ్చిమ (వాయువ్య) భాగం',
      'దక్కన్ పీఠభూమి తూర్పు భాగం',
      'దక్కన్ పీఠభూమి యొక్క దక్షిణ భాగం',
      'దక్కన్ పీఠభూమి యొక్క ఆగ్నేయ భాగం'
    ],
    0,
    'Black cotton soils (Regur) formed from basaltic Deccan Trap lava are deepest in the north-western Deccan Plateau (Maharashtra, western MP, Gujarat, and parts of north Karnataka).',
    'అగ్నిపర్వత బసాల్ట్ శిలల నుండి ఏర్పడిన లోతైన నల్లరేగడి నేలలు ప్రధానంగా దక్కన్ పీఠభూమి వాయువ్య భాగంలో (మహారాష్ట్ర, మధ్యప్రదేశ్, గుజరాత్) ఉన్నాయి.'
  ],
  [
    47, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Natural Vegetation & Forests of India',
    'The most widespread forests in India are :',
    'భారతదేశంలో అత్యంత విస్తృతమైన అడవులు ఏవి :',
    ['Tropical Evergreen forests', 'Semi Evergreen forests', 'Tropical Deciduous forests', 'Temperate Deciduous forests'],
    ['ఉష్ణమండల సతత హరిత అడవులు', 'పాక్షిక సతత హరిత అడవులు', 'ఉష్ణమండల ఆకురాల్చే అడవులు', 'సమశీతోష్ణ మండల ఆకురాల్చే అడవులు'],
    2,
    'Tropical Deciduous forests (also called Monsoon forests) cover the largest forest area in India across regions receiving 70–200 cm annual rainfall.',
    'భారతదేశంలో అత్యధిక విస్తీర్ణంలో వ్యాపించి ఉన్న అడవులు "ఉష్ణమండల ఆకురాల్చే అడవులు" (రుతుపవన అడవులు).'
  ],
  [
    48, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Andhra Pradesh River Systems',
    'Match the following :\nList I (River)\na. Vamsadhara\nb. Machkund\nc. Gundlakamma\nd. Pennar\nList II (Origin)\nI. Nallamala hills\nII. Nandidurga hills\nIII. Jayapur hills\nIV. Mudugal hills\nCodes :',
    'కింది వాటిని సరిపోల్చండి :\nజాబితా I (నది)\na. వంశధార\nb. మాచ్‌కుండ్\nc. గుండ్లకమ్మ\nd. పెన్నార్\nజాబితా II (జన్మస్థలం)\nI. నల్లమల కొండలు\nII. నందిదుర్గ కొండలు\nIII. జయపూర్ కొండలు\nIV. ముదుగల్ కొండలు\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    3,
    'Vamsadhara originates in Jayapur hills of Kalahandi/Odisha (III); Machkund rises in Mudugal hills of Eastern Ghats (IV); Gundlakamma rises in Nallamala hills (I); Pennar rises in Nandidurga hills of Karnataka (II).',
    'వంశధార - జయపూర్ కొండలు (III); మాచ్‌కుండ్ - ముదుగల్ కొండలు (IV); గుండ్లకమ్మ - నల్లమల కొండలు (I); పెన్నార్ - నందిదుర్గ కొండలు (II).'
  ],
  [
    49, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Soils of Andhra Pradesh & Laterites',
    'Identify the incorrect statement :',
    'సరికాని ప్రకటనను గుర్తించండి :',
    [
      'The geographical extent of Laterite soils in Andhra Pradesh is very limited.',
      'Laterites are formed in semi arid and low rainfall regions.',
      'Laterites are less fertile and appear red and yellowish red.',
      'Laterites can be used to grow Mango, Cashewnut orchards.'
    ],
    [
      'ఆంధ్రప్రదేశ్‌లో లాటరైట్ నేలల భౌగోళిక పరిధి చాలా పరిమితం.',
      'అర్ధ శుష్క మరియు తక్కువ వర్షపాతం ఉన్న ప్రాంతాల్లో లాటరైట్లు ఏర్పడతాయి.',
      'లాటరైట్స్ తక్కువ సారవంతమైనవి మరియు ఎరుపు మరియు పసుపు ఎరుపు రంగులో కనిపిస్తాయి.',
      'మామిడి, జీడిమామిడి తోటలను పెంచడానికి లాటరైట్లను ఉపయోగించవచ్చు.'
    ],
    1,
    'Laterite soils develop under high temperature and heavy seasonal rainfall through intense leaching (not semi-arid/low rainfall regions). All other statements are true.',
    'లాటరైట్ నేలలు అధిక ఉష్ణోగ్రత మరియు అధిక వర్షపాతం గల ప్రాంతాల్లో తీవ్రమైన లీచింగ్ వల్ల ఏర్పడతాయి (తక్కువ వర్షపాతం/అర్ధ శుష్క ప్రాంతాల్లో కాదు).'
  ],
  [
    50, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Tribal Geography of India',
    'Match the following :\nList I (Scheduled Tribe)\na. Gaddis\nb. Jarawas\nc. Santhals\nd. Bhutias\nList II (State/Union Territory)\nI. Sikkim\nII. Jharkhand\nIII. Andaman and Nicobar Islands\nIV. Himachal Pradesh\nCodes :',
    'కింది వాటిని సరిపోల్చండి :\nజాబితా I (షెడ్యూల్డ్ తెగ)\na. గడ్డిస్\nb. జరావాస్\nc. సంతాల్\nd. భూటియాస్\nజాబితా II (రాష్ట్రం/కేంద్రపాలిత ప్రాంతం)\nI. సిక్కిం\nII. జార్ఖండ్\nIII. అండమాన్ మరియు నికోబార్ దీవులు\nIV. హిమాచల్ ప్రదేశ్\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    2,
    'Gaddis inhabit Himachal Pradesh (IV); Jarawas are a PVTG in the Andaman and Nicobar Islands (III); Santhals are prominent in Jharkhand (II); Bhutias inhabit Sikkim (I).',
    'గడ్డిస్ - హిమాచల్ ప్రదేశ్ (IV); జరావాస్ - అండమాన్ నికోబార్ దీవులు (III); సంతాల్స్ - జార్ఖండ్ (II); భూటియాస్ - సిక్కిం (I).'
  ],
  [
    51, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Indian Monsoon Mechanism',
    'Consider the following statements :\nI. The monsoons are primary winds.\nII. The monsoons are confined only to the tropical lands lying between 20°N and 20°S.\nIII. Distribution of rainfall received from the South-West monsoons is governed mainly by the relief of the country.\nWhich of the above statements are correct ?',
    'కింది ప్రకటనలను పరిగణించండి :\nI. రుతుపవనాలు అనేవి ప్రాథమిక పవనాలు.\nII. రుతుపవనాలు 20°N మరియు 20°S మధ్య ఉన్న ఉష్ణమండల ప్రాంతాలకు మాత్రమే పరిమితమై ఉంటాయి.\nIII. దేశంలోని నిమ్నోన్నతాలు నైరుతి రుతుపవనాల నుండి వచ్చే వర్షపాత విస్తరణను ప్రధానంగా ప్రభావితం చేస్తాయి.\nపై ప్రకటనలలో ఏది సరైనది ?',
    ['I and II', 'I and III', 'II and III', 'I, II and III'],
    ['I మరియు II', 'I మరియు III', 'II మరియు III', 'I, II మరియు III'],
    2,
    'Monsoons are seasonal/secondary winds rather than primary planetary winds (so Statement I is incorrect). NCERT Class 9 states monsoons are broadly experienced in tropical areas around 20°N–20°S, and SW monsoon rainfall distribution is strongly controlled by relief/topography (Statements II and III).',
    'రుతుపవనాలు కాలానుగుణ/ద్వితీయ పవనాలు (ప్రాథమిక పవనాలు కావు), కాబట్టి II మరియు III సరైనవి.'
  ],
  [
    52, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Human Geography & Functional Towns',
    'Match the following :\nList I (Functional classification of town)\na. Mining town\nb. Industrial town\nc. Administrative town\nd. Garrison Cantonment town\nList II (Example)\nI. Jamshedpur\nII. Ankleshwar\nIII. Udhampur\nIV. Gandhinagar\nCodes :',
    'కింది వాటిని సరిపోల్చండి :\nజాబితా I (పట్టణాల క్రియాత్మక వర్గీకరణ)\na. గనుల త్రవ్వక పట్టణం\nb. పారిశ్రామిక పట్టణం\nc. పరిపాలన పట్టణం\nd. రక్షణదళ సైనిక ప్రదేశ పట్టణం\nజాబితా II (ఉదాహరణ)\nI. జంషెడ్‌పూర్\nII. అంకలేశ్వర్\nIII. ఉధంపూర్\nIV. గాంధీనగర్\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    1,
    'Ankleshwar (Gujarat) is an oilfield/mining town (II); Jamshedpur is a classic steel industrial town (I); Gandhinagar is a state administrative capital (IV); Udhampur is a military garrison/cantonment town (III).',
    'గనుల పట్టణం: అంకలేశ్వర్ (II), పారిశ్రామిక పట్టణం: జంషెడ్‌పూర్ (I), పరిపాలన పట్టణం: గాంధీనగర్ (IV), సైనిక కంటోన్మెంట్ పట్టణం: ఉధంపూర్ (III).'
  ],
  [
    53, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Indian Agriculture & Cropping Seasons',
    "Which of the following oilseed crops is grown as 'rabi' crop only ?",
    "క్రింది నూనెగింజల పంటలలో ఏది 'రబీ' పంటగా మాత్రమే పండిస్తారు ?",
    ['Groundnut', 'Mustard', 'Sunflower', 'Sesame'],
    ['వేరుశనగ', 'ఆవాలు', 'పొద్దుతిరుగుడు', 'నువ్వులు'],
    1,
    'Mustard (along with rapeseed/linseed) is cultivated exclusively as a Rabi winter crop in India, whereas groundnut, sunflower, and sesame are grown across Kharif/Rabi/Zaid.',
    'భారతదేశంలో ఆవాలను (Mustard) రబీ పంటగా మాత్రమే పండిస్తారు.'
  ],
  [
    54, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Plantation Agriculture in India',
    'In which region in India was tea plantation started in the first half of the 19th century ?',
    '19వ శతాబ్దపు ప్రథమార్ధంలో భారతదేశంలోని ఏ ప్రాంతంలో తేయాకు తోటల పెంపకాన్ని ప్రారంభించారు ?',
    ['Brahmaputra valley', 'Darjeeling region', 'The Nilgiris', 'Cardamom hills'],
    ['బ్రహ్మపుత్ర లోయ', 'డార్జిలింగ్ ప్రాంతం', 'నీలగిరులు', 'యాలకుల కొండలు'],
    0,
    'Commercial tea plantation in India began in the 1830s in the upper Brahmaputra valley (Assam), preceding Darjeeling and South Indian plantations.',
    'భారతదేశంలో 19వ శతాబ్దపు ప్రథమార్ధంలో (1830లలో) అసోంలోని బ్రహ్మపుత్ర లోయలో తేయాకు తోటల పెంపకం ప్రారంభమైంది.'
  ],
  [
    55, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Economic Geography & Industrial Clusters of AP',
    'Match the following on industrial clusters developed by APIIC Ltd. in Andhra Pradesh :\nList I (Location of the Industrial Cluster)\na. Gandrajupalle in Chittoor region\nb. Kopparthi in Kadapa region\nc. Makavarapalem at Visakhapatnam\nd. Machilipatnam\nList II (Type of Industry)\nI. Silk and Garments\nII. Engineering\nIII. Aluminium\nIV. Jewellery\nCodes :',
    'ఆంధ్రప్రదేశ్‌లో APIIC లిమిటెడ్ అభివృద్ధి చేసిన కింది పారిశ్రామిక క్లస్టర్లను సరిపోల్చండి :\nజాబితా I (పారిశ్రామిక క్లస్టర్ ఉనికి)\na. చిత్తూరు ప్రాంతంలోని గండ్రాజుపల్లె\nb. కడప ప్రాంతంలోని కొప్పర్తి\nc. విశాఖపట్నం వద్ద మాకవరపాలెం\nd. మచిలీపట్నం\nజాబితా II (పరిశ్రమ రకం)\nI. పట్టు మరియు వస్త్రాలు\nII. ఇంజనీరింగ్\nIII. అల్యూమినియం\nIV. నగలు\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    0,
    'APIIC industrial clusters: Gandrajupalle (Chittoor) – Silk & Garments (I); Kopparthi (Kadapa) – Engineering (II); Makavarapalem (Visakhapatnam/Anakapalli) – Aluminium Park (III); Machilipatnam – Imitation Jewellery Park (IV).',
    'గండ్రాజుపల్లె (చిత్తూరు) - పట్టు/వస్త్రాలు (I), కొప్పర్తి (కడప) - ఇంజనీరింగ్ (II), మాకవరపాలెం (విశాఖ) - అల్యూమినియం (III), మచిలీపట్నం - నగలు (IV).'
  ],
  [
    56, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Industries of India',
    'In which place in India was the first cement plant set up in 1904 ?',
    'భారతదేశంలో మొదటి సిమెంట్ ప్లాంట్ 1904లో ఏ ప్రదేశంలో స్థాపించబడింది ?',
    ['Mumbai (Bombay)', 'Chennai (Madras)', 'Kolkata (Calcutta)', 'Pune (Poona)'],
    ['ముంబయి (బాంబే)', 'చెన్నై (మద్రాసు)', 'కోల్‌కతా (కలకత్తా)', 'పూణే (పూనా)'],
    1,
    'India’s first cement manufacturing plant was set up in Madras (Chennai) in 1904 using sea shells as raw material (South India Industrials Ltd.).',
    'భారతదేశంలో మొట్టమొదటి సిమెంట్ కర్మాగారం 1904లో చెన్నై (మద్రాసు)లో స్థాపించబడింది.'
  ],
  [
    57, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Energy & Pipelines of India',
    'Which one of the following states is not connected with the Hazira-Vijaipur-Jagdishpur (HVJ) gas pipeline ?',
    'కింది రాష్ట్రాలలో ఏది హజీరా-విజయ్‌పూర్-జగదీష్‌పూర్ (HVJ) గ్యాస్ పైప్‌లైన్‌తో అనుసంధానించబడలేదు ?',
    ['Uttar Pradesh', 'Madhya Pradesh', 'Gujarat', 'Maharashtra'],
    ['ఉత్తర ప్రదేశ్', 'మధ్యప్రదేశ్', 'గుజరాత్', 'మహారాష్ట్ర'],
    3,
    'The HVJ cross-country natural gas pipeline runs from Hazira (Gujarat) through Vijaipur (Madhya Pradesh) to Jagdishpur (Uttar Pradesh), with branches to Rajasthan/Haryana/Delhi; it does not pass through Maharashtra.',
    'హజీరా (గుజరాత్) - విజయ్‌పూర్ (మధ్యప్రదేశ్) - జగదీష్‌పూర్ (ఉత్తరప్రదేశ్) గ్యాస్ పైప్‌లైన్ మహారాష్ట్ర గుండా వెళ్ళదు.'
  ],
  [
    58, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Transport & Railway Zones of India',
    'Bilaspur is the headquarters of which of the following Railway zones ?',
    'కింది ఏ రైల్వే జోన్‌కు బిలాస్‌పూర్ ప్రధాన కార్యాలయం ?',
    ['South Eastern', 'East Coastal', 'East Central', 'South East Central'],
    ['ఆగ్నేయ', 'తూర్పు తీర', 'తూర్పు మధ్య', 'ఆగ్నేయ మధ్య'],
    3,
    'Bilaspur (Chhattisgarh) is the headquarters of the South East Central Railway (SECR) zone.',
    'ఛత్తీస్‌గఢ్‌లోని బిలాస్‌పూర్ "సౌత్ ఈస్ట్ సెంట్రల్ రైల్వే" (ఆగ్నేయ మధ్య రైల్వే జోన్) ప్రధాన కార్యాలయం.'
  ],
  [
    59, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Mineral Resources of Andhra Pradesh',
    'Match the following on mineral resources of Andhra Pradesh :\nList I (Mineral)\na. Manganese\nb. Bauxite\nc. Mica\nd. Limestone\nList II (Place in erstwhile districts)\nI. Forest areas of Visakhapatnam and East Godavari\nII. Garividi in Vizianagaram\nIII. Jammalamadugu and Mydukuru in Kadapa region\nIV. Nellore Region\nCodes :',
    'ఆంధ్రప్రదేశ్ ఖనిజ వనరులపై కింది వాటిని సరిపోల్చండి :\nజాబితా I (ఖనిజం)\na. మాంగనీస్\nb. బాక్సైట్\nc. మైకా\nd. సున్నపురాయి\nజాబితా II (పూర్వపు జిల్లాలలో స్థలం)\nI. విశాఖపట్నం మరియు తూర్పుగోదావరిలో అటవీ ప్రాంతాలు\nII. విజయనగరంలో గరివిడి\nIII. కడప ప్రాంతంలోని జమ్మలమడుగు మరియు మైదుకూరు\nIV. నెల్లూరు ప్రాంతం\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    1,
    'In Andhra Pradesh: Manganese – Garividi in Vizianagaram (II); Bauxite – Eastern Ghats forest tracts of Visakhapatnam & East Godavari (I); Mica – Nellore/Gudur belt (IV); Limestone – Jammalamadugu & Mydukuru in Kadapa (III).',
    'మాంగనీస్: గరివిడి (II), బాక్సైట్: విశాఖ/తూర్పుగోదావరి అటవీ ప్రాంతం (I), మైకా (అభ్రకం): నెల్లూరు (IV), సున్నపురాయి: జమ్మలమడుగు/మైదుకూరు (III).'
  ],
  [
    60, 2, 'Geography', 'General Knowledge', 'general-knowledge', 'gk', 'indian-geography', 'Indian Geography',
    'Beaches & Tourism Geography of AP',
    'Match the following tourist spots of Andhra Pradesh :\nList I (Beach)\na. Suryalanka\nb. Manginapudi\nc. Kothapatnam\nd. Perupalem\nList II (Nearest City/Town)\nI. Narasapuram\nII. Ongole\nIII. Machilipatnam\nIV. Bapatla\nCodes :',
    'ఆంధ్రప్రదేశ్‌లోని పర్యాటక ప్రదేశాలపై కింది వాటిని సరిపోల్చండి :\nజాబితా I (బీచ్)\na. సూర్యలంక\nb. మంగినపూడి\nc. కొత్తపట్నం\nd. పేరుపాలెం\nజాబితా II (సమీప నగరం/పట్టణం)\nI. నరసాపురం\nII. ఒంగోలు\nIII. మచిలీపట్నం\nIV. బాపట్ల\nసమాధానాలు :',
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    ['a-I, b-II, c-III, d-IV', 'a-II, b-I, c-IV, d-III', 'a-IV, b-III, c-II, d-I', 'a-III, b-IV, c-I, d-II'],
    2,
    'Coastal beaches of AP: Suryalanka Beach – Bapatla (IV); Manginapudi Beach – Machilipatnam (III); Kothapatnam Beach – Ongole (II); Perupalem Beach – Narasapuram (I).',
    'సూర్యలంక బీచ్ - బాపట్ల (IV), మంగినపూడి బీచ్ - మచిలీపట్నం (III), కొత్తపట్నం బీచ్ - ఒంగోలు (II), పేరుపాలెం బీచ్ - నరసాపురం (I).'
  ],

  // ================= SECTION C: INDIAN SOCIETY (Q61–Q90) =================
  [
    61, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Child Protection & Social Initiatives',
    'To eradicate child marriages, a unique data driven approach like ALIVA is adopted by :',
    'బాల్య వివాహాలను నిర్మూలించడానికి అలీవా (ALIVA) వంటి ప్రత్యేకమైన డేటా ఆధారిత విధానాన్ని ఎవరు అవలంభిస్తున్నారు :',
    [
      'Rajgarh district of Madhya Pradesh',
      'Wardha district of Maharashtra',
      'Nayagarh district of Odisha',
      'Warangal district of Telangana'
    ],
    [
      'మధ్యప్రదేశ్‌లోని రాజ్‌గఢ్ జిల్లా',
      'మహారాష్ట్రలోని వార్ధా జిల్లా',
      'ఒడిసాలోని నయాగర్ జిల్లా',
      'తెలంగాణలోని వరంగల్ జిల్లా'
    ],
    2,
    'Nayagarh district in Odisha launched the data-driven digital initiative ALIVA to track and eliminate child marriages across adolescent girl databases.',
    'ఒడిశాలోని నయాగర్ జిల్లా బాల్య వివాహాల నిర్మూలనకు "అలీవా (ALIVA)" అనే ప్రత్యేక డేటా ఆధారిత కార్యక్రమాన్ని చేపట్టింది.'
  ],
  [
    62, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Religious Communities & Cultural Practices',
    'A circular structure used by Zoroastrians for excarnation or the disposal of human dead bodies through exposure to the natural elements and scavenger animals such as vultures is called :',
    'జొరాస్ట్రియన్లు లో చనిపోయినవారి మృతదేహాలు కుళ్ళిపోవడానికి వాటిని సహజ మూలకాలు మరియు రాబందులు వంటి స్కావెంజర్ జంతువులకు బహిర్గతం చేయడం కోసం ఉపయోగించే వృత్తాకార నిర్మాణాన్ని ఏమని పిలుస్తారు :',
    ['Dakhma', 'Aparigraha', 'Sallekhana', 'Shenshai'],
    ['దఖ్మా', 'అపరిగ్రహ', 'సల్లేఖానా', 'షెన్షాయ్'],
    0,
    'A Dakhma (Tower of Silence) is the raised circular structure used in Zoroastrian/Parsi funeral practice for excarnation.',
    'పార్సీ/జొరాస్ట్రియన్ మతంలో మృతదేహాలకు అంత్యక్రియలు నిర్వహించే వృత్తాకార నిర్మాణాన్ని "దఖ్మా" (Tower of Silence) అంటారు.'
  ],
  [
    63, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Tribal Communities & Marriage Customs',
    "'Diku Andi' means :",
    "'డికు అంది' అంటే :",
    [
      'Marriage by exchange in Koya and Savara tribes',
      'Marriage by capture in Naga tribes',
      'Marriage by probation in Kuki tribe',
      'Marriage by negotiation in Ho tribes'
    ],
    [
      'కోయ మరియు సవర తెగలలో వినిమయం ద్వారా జరిగే వివాహం',
      'నాగ తెగలలో అపహరణ ద్వారా జరిగే వివాహం',
      'కుకీ తెగలో పరిశీలనా (probation) ద్వారా జరిగే వివాహం',
      'హో (Ho) తెగలలో సంప్రదింపుల ద్వారా జరిగే వివాహం'
    ],
    3,
    'Among the Ho tribe of Jharkhand/Odisha, ‘Diku Andi’ denotes marriage by negotiation/mutual agreement arranged through intermediaries.',
    'హో (Ho) గిరిజన తెగలో సంప్రదింపుల ద్వారా జరిగే వివాహాన్ని "డికు అంది" అంటారు.'
  ],
  [
    64, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Child Labour Legislation & Governance',
    'The online portal developed by the Government of India for effective enforcement of the Child and Adolescent Labour (Prohibition and Regulation) Act, 1986, (which was amended in 2016), is :',
    'బాలల మరియు కౌమార లేబర్ (నిషేధం మరియు నియంత్రణ) చట్టం 1986 (దీనిని 2016లో సవరించారు) సమర్థవంతంగా అమలు చేయడం కోసం భారత ప్రభుత్వం ఏ ఆన్‌లైన్ పోర్టల్ ను అభివృద్ధి చేసింది :',
    ['SPARC', 'SRIJAN', 'YUKTI', 'PENCIL'],
    ['స్పార్క్ (SPARC)', 'సృజన్ (SRIJAN)', 'యుక్తి (YUKTI)', 'పెన్సిల్ (PENCIL)'],
    3,
    'PENCIL (Platform for Effective Enforcement for No Child Labour) is the Ministry of Labour and Employment’s dedicated portal for enforcing child labour prohibition.',
    'బాల కార్మిక నిషేధ చట్టం సమర్థవంతమైన అమలు కోసం భారత ప్రభుత్వం "పెన్సిల్ (PENCIL)" పోర్టల్‌ను అభివృద్ధి చేసింది.'
  ],
  [
    65, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Family, Marriage & Divorce Laws',
    'Consider the following statements :\nI. W.P. Scott defined divorce as ‘an institutionalised arrangement for terminating the marriage relationship and allowing each partner the right to remarry’.\nII. The first legislation in respect of the dissolution of marriage in India was enacted in 1869, and is ‘Parsi Marriage and Divorce Act’.\nIII. The irresponsible departure from the home on the part of husband, leaving the family to fend for itself is called as ‘the poor man’s divorce’.\nWhich of the above given statements are correct ?',
    'ఈ క్రింది ప్రకటనలను పరిగణించండి :\nI. డబ్ల్యు.పి. స్కాట్ విడాకులను ‘వివాహ సంబంధాన్ని రద్దు చేయడానికి మరియు ప్రతి భాగస్వామికి పునర్వివాహం చేసుకునే హక్కును అనుమతించే సంస్థాగత ఏర్పాటు’ అని నిర్వచించాడు.\nII. భారతదేశంలో వివాహ రద్దుకు సంబంధించి 1869లో రూపొందించబడిన మొదటి చట్టం మరియు ‘పార్సీ వివాహాలు మరియు విడాకుల చట్టం’.\nIII. ఏ భర్త అయినా బాధ్యతారహితంగా ఇంటి నుండి వెళ్లిపోవడాన్ని, కుటుంబాన్ని తన కోసం వదిలేయడాన్ని ‘ద పూర్ మెన్స్ డివోర్స్’ (the poor man’s divorce) అని అంటారు.\nపైన ఇచ్చిన ప్రకటనలలో ఏవి సరైనవి ?',
    ['I and II only', 'II and III only', 'I and III only', 'All of the above'],
    ['I మరియు II మాత్రమే', 'II మరియు III మాత్రమే', 'I మరియు III మాత్రమే', 'పైవన్నీ'],
    2,
    'Statements I and III are correct. Statement II is incorrect because the Parsi Marriage and Divorce Act was enacted in 1865 (not 1869; the 1869 legislation was the Indian Divorce Act).',
    'ప్రకటనలు I మరియు III సరైనవి. పార్సీ వివాహ మరియు విడాకుల చట్టం 1865లో చేయబడింది (1869లో కాదు — 1869 నాటిది ఇండియన్ డైవోర్స్ యాక్ట్).'
  ],
  [
    66, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Kinship Systems (Consanguineous vs Affinal)',
    'Ravindra and Seema are husband and wife. Krishna and Madhavi are children of Ravindra-Seema. Madhavi is married to Harish and Jyothi is the daughter of Madhavi-Harish. Then the Consanguineous Kinship is between :',
    'రవీంద్ర మరియు సీమ భార్యాభర్తలు. కృష్ణ మరియు మాధవిలు రవీంద్ర-సీమల పిల్లలు. మాధవి హరీష్‌ను వివాహం చేసుకుంది మరియు జ్యోతి మాధవి-హరీష్‌ల కుమార్తె. అప్పుడు ఏకరక్త బంధుత్వం ఎవరి మధ్య ఉంటుంది :',
    ['Ravindra and Seema', 'Madhavi and Harish', 'Krishna and Jyothi', 'Krishna and Harish'],
    ['రవీంద్ర మరియు సీమ', 'మాధవి మరియు హరీష్', 'కృష్ణ మరియు జ్యోతి', 'కృష్ణ మరియు హరీష్'],
    2,
    'Consanguineous kinship means blood relationship (sharing common ancestry). Husband-wife pairs (Ravindra-Seema, Madhavi-Harish) and brothers-in-law (Krishna-Harish) are affinal kin; Krishna (maternal uncle) and Jyothi (niece) share a direct blood relationship.',
    'రక్తసంబంధీకుల మధ్య ఉండే బంధుత్వాన్ని ఏకరక్త బంధుత్వం (Consanguineous Kinship) అంటారు. కృష్ణ (మేనమామ) మరియు జ్యోతి (మేనకోడలు) మధ్య రక్తసంబంధం ఉంటుంది; మిగిలినవి వైవాహిక సంబంధాలు.'
  ],
  [
    67, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Religious Minorities & Sachar Committee',
    'As per the recommendations of the Sachar Committee, which among the following Muslim groups needs additional attention, similar to that of Hindu OBCs ?',
    'సచార్ కమిటీ సిఫార్సుల ప్రకారం ఈ క్రింది ఏ ముస్లిం సమూహానికి హిందూ OBCల మాదిరిగా అదనపు శ్రద్ధ అవసరం ఉంది ?',
    ['Ajlaf', 'Arzal', 'Ashraf', 'Shaikh and Syed'],
    ['అజ్లాఫ్', 'అర్జాల్', 'అష్రాఫ్', 'షేక్ మరియు సయ్యద్'],
    0,
    'The Sachar Committee classified Indian Muslims broadly into three social groups: Ashraf (upper castes), Ajlaf (occupational groups comparable to Hindu OBCs), and Arzal (comparable to Hindu Scheduled Castes).',
    'సచార్ కమిటీ ప్రకారం ముస్లిం సమాజంలోని అజ్లాఫ్ (Ajlaf) వర్గం హిందూ ఓబీసీలకు సమానమైనదిగా పరిగణించబడి ప్రత్యేక శ్రద్ధ అవసరమని పేర్కొంది.'
  ],
  [
    68, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Social Justice & Manual Scavenging Eradication',
    "In the lines of Prohibition of Employment as Manual Scavengers and their Rehabilitation Act 2013, which of the following Robots can be used to end India's manual scavenging ?",
    'మాన్యువల్ స్కావెంజర్ల ఉపాధి నిషేధం మరియు వారి పునరావాస చట్టం 2013 ప్రకారం, ఈ క్రింది వాటిలో ఏ రోబోట్‌ను ఉపయోగించి భారతదేశ మాన్యువల్ స్కావెంజింగ్ ఉపాధిని నిషేధించవచ్చు ?',
    ['Kempa', 'Vyommitra', 'Bandicoot', 'ManavSudh'],
    ['కెంపా', 'వ్యోమమిత్ర', 'బండికూట్', 'మానవ్‌సుధ్'],
    2,
    'Bandicoot, developed by Genrobotics in Kerala, is the world’s first robotic scavenger deployed across Indian municipalities to clean manholes and eliminate manual scavenging.',
    'మాన్యువల్ స్కావెంజింగ్‌ను అంతం చేయడానికి భారతదేశంలో "బండికూట్" (Bandicoot) అనే మ్యాన్‌హోల్ శుభ్రపరిచే రోబోట్‌ను ఉపయోగిస్తున్నారు.'
  ],
  [
    69, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'SC/ST Protection & Constitutional Judgements',
    'In which of the following cases is it alleged that the verdict of the Supreme Court of India diluted the stringent provisions of the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989 ?',
    'ఈ క్రింది వాటిలో ఏ కేసులో భారత సుప్రీంకోర్టు తీర్పు షెడ్యూల్డ్ కులం మరియు షెడ్యూల్డ్ తెగ (అట్రాసిటీల నిరోధక) చట్టం, 1989లోని కఠినమైన నిబంధనలను పలుచన చేసిందని ఆరోపించబడింది ?',
    [
      'K.C. Vasanth Kumar & Another vs State of Karnataka',
      'Srish Kumar Choudhury vs State of Tripura',
      'Om Prakash Mahajan vs State of Madhya Pradesh',
      'Subhash Kashinath Mahajan vs State of Maharashtra'
    ],
    [
      'కె.సి. వసంత్ కుమార్ మరియు ఇతరులు vs స్టేట్ ఆఫ్ కర్ణాటక',
      'శ్రీష్ కుమార్ చౌదరి vs స్టేట్ ఆఫ్ త్రిపుర',
      'ఓం ప్రకాష్ మహాజన్ vs స్టేట్ ఆఫ్ మధ్యప్రదేశ్',
      'సుభాష్ కాశీనాథ్ మహాజన్ vs స్టేట్ ఆఫ్ మహారాష్ట్ర'
    ],
    3,
    'In Subhash Kashinath Mahajan vs State of Maharashtra (March 2018), the Supreme Court introduced preliminary inquiry and prior sanction requirements under the SC/ST (PoA) Act, leading Parliament to amend the Act (Section 18A) in 2018.',
    'సుభాష్ కాశీనాథ్ మహాజన్ vs స్టేట్ ఆఫ్ మహారాష్ట్ర (2018) కేసులో సుప్రీంకోర్టు తీర్పు ఎస్సీ/ఎస్టీ అట్రాసిటీ చట్ట నిబంధనలను సడలించిందని విమర్శలు వచ్చాయి.'
  ],
  [
    70, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Religious Reform Movements',
    'The Shuddhi Movement to bring back the people who transformed their religion to Islam and Christianity from Hinduism was started by :',
    'హిందూ మతం నుండి తమ మతాన్ని ఇస్లాం మరియు క్రైస్తవ మతంలోకి మార్చుకున్న ప్రజలను తిరిగి హిందూ మతంలోకి తీసుకురావడానికి శుద్ధి ఉద్యమాన్ని ఎవరు ప్రారంభించారు :',
    ['Brahmo Samaj', 'Satyashodhak Samaj', 'Ramakrishna Mission', 'Arya Samaj'],
    ['బ్రహ్మ సమాజం', 'సత్యశోధక్ సమాజం', 'రామకృష్ణ మిషన్', 'ఆర్య సమాజం'],
    3,
    'The Shuddhi Movement was initiated by Swami Dayananda Saraswati’s Arya Samaj (and actively led by Swami Shraddhanand) to reconvert people back to Hinduism.',
    'హిందూ మతం నుండి ఇతర మతాలలోకి మారిన వారిని తిరిగి హిందూ మతంలోకి తీసుకురావడానికి ఆర్య సమాజం "శుద్ధి ఉద్యమాన్ని" ప్రారంభించింది.'
  ],
  [
    71, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Divyangjan Empowerment & Infrastructure',
    "India's first high-tech sports training centre for Divyangjan, ‘The Atal Bihari Vajpayee Training Centre for Disability Sports’ inaugurated on 2nd October, 2023 is located at :",
    '2వ అక్టోబర్, 2023న దివ్యాంగుల కోసం ప్రారంభించబడిన భారతదేశపు మొట్టమొదటి అత్యాధునిక క్రీడా శిక్షణా కేంద్రం, ‘ది అటల్ బిహారీ వాజ్‌పేయి ట్రైనింగ్ సెంటర్ ఫర్ డిజేబిలిటీ స్పోర్ట్స్’ ఎక్కడ నిర్మించబడింది :',
    ['Rajkot, Gujarat', 'Gwalior, Madhya Pradesh', 'Ahmedabad, Gujarat', 'Prayagraj, Uttar Pradesh'],
    ['రాజ్‌కోట్, గుజరాత్', 'గ్వాలియర్, మధ్యప్రదేశ్', 'అహ్మదాబాద్, గుజరాత్', 'ప్రయాగ్‌రాజ్, ఉత్తరప్రదేశ్'],
    1,
    'PM Narendra Modi inaugurated India’s first high-tech sports training centre for Divyangjan—the Atal Bihari Vajpayee Training Centre for Disability Sports—at Gwalior, Madhya Pradesh on 2 October 2023.',
    'దివ్యాంగుల కోసం దేశంలోనే తొలి అత్యాధునిక క్రీడా శిక్షణా కేంద్రం మధ్యప్రదేశ్‌లోని గ్వాలియర్‌లో అక్టోబర్ 2, 2023న ప్రారంభించబడింది.'
  ],
  [
    72, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Tribal Welfare Committees',
    "Under whose Chairmanship was a high-level committee on socio-economic, health and educational status of tribal communities of India set up by the Prime Minister's Office in 2013 ?",
    'భారతదేశంలోని గిరిజన వర్గాల సామాజిక-ఆర్థిక, ఆరోగ్య మరియు విద్యా స్థితిగతులపై ఉన్నత స్థాయి కమిటీని 2013లో ప్రధానమంత్రి కార్యాలయం ఎవరి అధ్యక్షతన ఏర్పాటు చేసింది ?',
    ['Dr. Joseph Bara', 'Dr. Kamal K. Misra', 'Dr. Hrusikesh Panda', 'Prof. Virginius Xaxa'],
    ['డాక్టర్ జోసెఫ్ బారా', 'డాక్టర్ కమల్ కె. మిశ్రా', 'డాక్టర్ హృషికేశ్ పాండా', 'ప్రొఫెసర్ వర్జీనియస్ క్సాక్సా'],
    3,
    'The High-Level Committee on socio-economic, health and educational status of tribal communities in India (2013) was chaired by sociologist Prof. Virginius Xaxa.',
    '2013లో గిరిజనుల సామాజిక-ఆర్థిక, ఆరోగ్య, విద్యా స్థితిగతుల అధ్యయనం కోసం ప్రొఫెసర్ వర్జీనియస్ క్సాక్సా అధ్యక్షతన ఉన్నత స్థాయి కమిటీ నియమించబడింది.'
  ],
  [
    73, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Women Empowerment & Social Thinkers',
    'Who stated that ‘I measure the progress of a community by the degree of progress which women have achieved’ ?',
    '‘మహిళలు సాధించిన ప్రగతి స్థాయిని బట్టి నేను సమాజ ప్రగతిని కొలుస్తాను’ అని ఎవరు పేర్కొన్నారు ?',
    ['Dr. Vina Mazumdar', 'Pandita Ramabai', 'Mahatma Gandhi', 'Dr. B.R. Ambedkar'],
    ['డాక్టర్ వీణా మజుందార్', 'పండిత రమాబాయి', 'మహాత్మా గాంధీ', 'డాక్టర్ బి.ఆర్. అంబేద్కర్'],
    3,
    'Dr. B.R. Ambedkar famously stated: “I measure the progress of a community by the degree of progress which women have achieved.”',
    '‘మహిళలు సాధించిన పురోగతిని బట్టి నేను ఒక సమాజ ప్రగతిని అంచనా వేస్తాను’ అని డాక్టర్ బి.ఆర్. అంబేద్కర్ పేర్కొన్నారు.'
  ],
  [
    74, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Personal Laws & Gender Justice',
    'After a landmark Judgement on Triple Talaq in 2017, which among the following methods of divorce practised in Muslim society was recently challenged in the Apex Court of India ?',
    'ట్రిపుల్ తలాక్‌పై 2017లో సంచలనాత్మకమైన తీర్పు తర్వాత, ముస్లిం సమాజంలో అనుసరించే ఏ విడాకుల పద్ధతి గురించి ఇటీవల భారతదేశంలోని అత్యున్నత న్యాయస్థానంలో సవాలు చేయబడింది ?',
    ['Talaq-e-Hasan', 'Talaq-i-Tafweez', 'Talaq-e-Ahsan', 'Lian'],
    ['తలాక్-ఇ-హసన్', 'తలాక్-ఇ-తఫ్విజ్', 'తలాక్-ఇ-అహ్సాన్', 'లియన్'],
    0,
    'Following Shayara Bano (2017) against Talaq-e-Biddat, petitions were filed before the Supreme Court challenging unilateral extra-judicial Talaq-e-Hasan.',
    '2017 ట్రిపుల్ తలాక్ తీర్పు అనంతరం తలాక్-ఇ-హసన్ విడాకుల పద్ధతి రాజ్యాంగబద్ధతను సుప్రీంకోర్టులో సవాలు చేశారు.'
  ],
  [
    75, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Anti-Human Trafficking & Law Enforcement Tech',
    'Which among the following IT initiatives by the Ministry of Home Affairs facilitates dissemination of information about significant crimes, including Human Trafficking across the country on real time basis and enables Interstate co-ordination ?',
    'దేశవ్యాప్తంగా మానవ అక్రమ రవాణాతో సహా ముఖ్యమైన నేరాల గురించిన సమాచారాన్ని ఎప్పటికప్పుడు అందించడానికి మరియు వివిధ రాష్ట్రాల మధ్య సమన్వయం చేయడానికి కేంద్ర హోం వ్యవహారాల మంత్రిత్వ శాఖ చే ప్రారంభించబడిన IT సాధనం ఏది ?',
    [
      'Investigation Tracking System for Sexual Offences (ITSSO)',
      'National Database of Sexual Offenders (NDSO)',
      'Crime Multi Agency Centre (Cri-MAC)',
      'Special Police Unit for Women and Children (SPUWAC)'
    ],
    [
      'ఇన్వెస్టిగేషన్ ట్రాకింగ్ సిస్టం ఫర్ సెక్సువల్ అఫెన్సెస్ (ITSSO)',
      'నేషనల్ డేటాబేస్ ఆఫ్ సెక్సువల్ అఫెండర్స్ (NDSO)',
      'క్రైమ్ మల్టీ ఏజెన్సీ సెంటర్ (Cri-MAC)',
      'స్పెషల్ యూనిట్ ఫర్ విమెన్ అండ్ చిల్డ్రన్ (SPUWAC)'
    ],
    2,
    'Launched by MHA/NCRB in 2020, Crime Multi Agency Centre (Cri-MAC) shares real-time alerts and information on heinous crimes and human trafficking across police stations and state agencies.',
    'మానవ అక్రమ రవాణా సహా తీవ్ర నేరాల సమాచారాన్ని రాష్ట్రాల మధ్య తక్షణమే పంచుకోవడానికి కేంద్ర హోంశాఖ "క్రైమ్ మల్టీ ఏజెన్సీ సెంటర్ (Cri-MAC)"ను ప్రారంభించింది.'
  ],
  [
    76, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Sociological Theories of Communalism',
    'Who defined ‘Communalism as the political assertiveness of a community to maintain its identity in a plural society undergoing modernization’ ?',
    '‘ఆధునికీకరణకు లోనవుతున్న బహువచన సమాజంలో తన గుర్తింపును కొనసాగించడానికి ఒక సంఘం యొక్క రాజకీయ దృఢత్వమే కమ్యూనలిజం’ అని ఎవరు నిర్వచించారు ?',
    ['Prof. Ram Ahuja', 'Bipin Chandra', 'Majumdar and Madan', 'Robert Melson and Howard Wolpe'],
    ['ప్రొఫెసర్ రామ్ అహుజా', 'బిపిన్ చంద్ర', 'మజుందార్ మరియు మదన్', 'రాబర్ట్ మెల్సన్ మరియు హోవార్డ్ వోల్ప్'],
    3,
    'Political scientists Robert Melson and Howard Wolpe formulated this widely cited sociological definition of communalism in modernizing plural societies.',
    'రాబర్ట్ మెల్సన్ మరియు హోవార్డ్ వోల్ప్ మతతత్వాన్ని (కమ్యూనలిజం) ఆధునికీకరణలో బహువచన సమాజ గుర్తింపు దృఢత్వంగా నిర్వచించారు.'
  ],
  [
    77, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Women & Social Legislation',
    'The Dowry Prohibition Act, 1961 enacted by the Government of India came into force from :',
    'భారత ప్రభుత్వం రూపొందించిన వరకట్న నిషేధ చట్టం, 1961 ఎప్పటినుండి అమలులోకి వచ్చింది :',
    ['20th May, 1961', '1st June, 1961', '20th June, 1961', '1st July, 1961'],
    ['మే 20, 1961', 'జూన్ 1, 1961', 'జూన్ 20, 1961', 'జూలై 1, 1961'],
    3,
    'The Dowry Prohibition Act, 1961 received Presidential assent on 20 May 1961 and came into force on 1st July, 1961.',
    'వరకట్న నిషేధ చట్టం 1961 మే 20న ఆమోదం పొంది, జూలై 1, 1961 నుండి అమలులోకి వచ్చింది.'
  ],
  [
    78, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Political Representation of Women',
    'Consider the following statements :\nI. In the 15th Lok Sabha the percentage of elected women members in Lok Sabha had crossed 10% of its total strength for the first time.\nII. The 17th Lok Sabha has a higher percentage of representation of elected women members than before and it is the highest ever since the independence of India.\nIII. The women members elected to the Legislative Assembly of Andhra Pradesh in General Elections 2019 was 11.74% of its total strength.\nIV. The Women’s Reservation Bill, 2023 got the assent of the President on 28th September, 2023.\nWhich among the above given statements are correct ?',
    'ఈ క్రింది ప్రకటనలను పరిగణించండి :\nI. 15వ లోక్‌సభలో ఎన్నికైన మహిళా సభ్యుల శాతం మొదటిసారిగా మొత్తం లోక్‌సభ సభ్యుల బలంలో 10% దాటింది.\nII. 17వ లోక్ సభలో ఎన్నుకోబడిన మహిళా సభ్యుల ప్రాతినిధ్యం గతంలో కంటే ఎక్కువ శాతం ఉంది మరియు భారతదేశానికి స్వాతంత్ర్యం వచ్చిన తర్వాత ఇది అత్యధికంగా ఉంది.\nIII. 2019 సార్వత్రిక ఎన్నికలలో ఆంధ్రప్రదేశ్ శాసనసభ మొత్తం బలంలో, ఎన్నికైన మహిళా సభ్యులు 11.74% ఉన్నారు.\nIV. మహిళా రిజర్వేషన్ బిల్లు 2023 సెప్టెంబర్ 28, 2023న రాష్ట్రపతి ఆమోదం పొందింది.\nపైన ఇచ్చిన స్టేట్‌మెంట్లలో ఏవి సరైనవి ?',
    ['I, II and III only', 'I, III and IV only', 'I, II and IV only', 'II, III and IV only'],
    ['I, II మరియు III మాత్రమే', 'I, III మరియు IV మాత్రమే', 'I, II మరియు IV మాత్రమే', 'II, III మరియు IV మాత్రమే'],
    2,
    'Statements I (59 women in 15th LS ≈ 10.9%), II (78 women in 17th LS ≈ 14.4%, highest ever), and IV (Nari Shakti Vandan Adhiniyam assented on 28 Sep 2023) are correct. Statement III is incorrect: 14 women out of 175 MLAs in AP 2019 = 8% (not 11.74%).',
    'ప్రకటనలు I, II మరియు IV సరైనవి. 2019 ఆంధ్రప్రదేశ్ అసెంబ్లీ ఎన్నికల్లో 175 స్థానాలకు 14 మంది మహిళలు (8%) మాత్రమే ఎన్నికయ్యారు (11.74% కాదు).'
  ],
  [
    79, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Linguistic Regionalism & State Reorganisation',
    'Under the pressure of groups interested in linguistic regionalism, the President of the Constituent Assembly of India has appointed the Linguistic Provinces Commission to report on creation of provinces of Andhra, Karnataka, Kerala and Maharashtra. In which year was this Commission appointed and who was it chaired by ?',
    'భాషా ప్రాంతీయతపై ఆసక్తి ఉన్న సమూహాల ఒత్తిడితో, భారత రాజ్యాంగ సభ అధ్యక్షులు, ఆంధ్ర, కర్ణాటక, కేరళ మరియు మహారాష్ట్ర రాష్ట్రాల ఏర్పాటుపై నివేదిక ఇవ్వడానికి లింగ్విస్టిక్ ప్రావిన్సెస్ కమీషన్‌ను నియమించారు. ఈ కమిషన్‌ను ఏ సంవత్సరంలో నియమించారు మరియు దానికి ఎవరు అధ్యక్షత వహించారు ?',
    [
      '1948, Justice Fazal Ali',
      '1949, Pattabhi Sitaramayya',
      '1950, Sardar Vallabhbhai Patel',
      '1948, Justice S.K. Dhar'
    ],
    [
      '1948, జస్టిస్ ఫజల్ అలీ',
      '1949, పట్టాభి సీతారామయ్య',
      '1950, సర్దార్ వల్లభాయ్ పటేల్',
      '1948, జస్టిస్ ఎస్.కె. ధార్'
    ],
    3,
    'In June 1948, Rajendra Prasad (President of the Constituent Assembly) appointed the Linguistic Provinces Commission chaired by Justice S.K. Dhar (Dhar Commission).',
    '1948లో రాజ్యాంగ సభ అధ్యక్షుడు డా. రాజేంద్ర ప్రసాద్ జస్టిస్ ఎస్.కె. ధార్ అధ్యక్షతన భాషా ప్రయుక్త రాష్ట్రాల కమిషన్‌ను నియమించారు.'
  ],
  [
    80, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Regional Movements & Assam Accord',
    'Consider the following statements about the Assam Movement :\nI. The Assam Movement led by All Assam Students’ Union (AASU) was started in the year 1983.\nII. The objective of the Assam Movement is to identify the migrant people, protect and provide constitutional, legislative and administrative safeguards to the Bangladeshi Migrants in Assam.\nIII. The Assam Movement was officially ended on 15th August, 1989 after coming to an understanding with the Government of India which found official expression in the Memorandum of Understanding popularly known as the Assam Accord.\nWhich of the above given statements is/are correct ?',
    'అస్సాం ఉద్యమం గురించి ఈ క్రింది ప్రకటనలను పరిగణించండి :\nI. ఆల్ అస్సాం స్టూడెంట్స్ యూనియన్ (AASU) నేతృత్వంలో అస్సాం ఉద్యమం 1983 సంవత్సరంలో ప్రారంభమైంది.\nII. అస్సాం ఉద్యమం యొక్క లక్ష్యం వలస ప్రజలను గుర్తించడం మరియు అస్సాంలోని బంగ్లాదేశ్ వలసదారులకు రాజ్యాంగ, శాసన మరియు పరిపాలనాపరమైన రక్షణలను అందించడం.\nIII. భారత ప్రభుత్వం ఉద్యమ నేతలతో ఒక అవగాహనకు వచ్చిన తర్వాత, అస్సాం అకార్డ్‌గా ప్రసిద్ధి చెందిన అధికారిక అవగాహన ఒప్పందం కుదురుకున్న తరువాత అస్సాం ఉద్యమం అధికారికంగా 15 ఆగస్ట్, 1989న ముగిసింది.\nపైన ఇచ్చిన ప్రకటనలలో ఏది/ఏవి సరైనవి ?',
    ['I and II only', 'II and III only', 'III only', 'None of the above'],
    ['I మరియు II మాత్రమే', 'II మరియు III మాత్రమే', 'III మాత్రమే', 'పైవేవీ కావు'],
    3,
    'All three statements are incorrect: the Assam Movement began in 1979 (not 1983), aimed to protect indigenous Assamese people (not Bangladeshi migrants) and deport illegal immigrants, and ended with the Assam Accord signed on 15 August 1985 (not 1989).',
    'పై మూడు ప్రకటనలు తప్పు: అస్సాం ఉద్యమం 1979లో ప్రారంభమైంది, స్థానిక అస్సామీయుల హక్కుల రక్షణ కోసం జరిగింది మరియు 15 ఆగస్టు 1985న అస్సాం ఒప్పందంతో ముగిసింది.'
  ],
  [
    81, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Social Welfare & Child Support Schemes',
    'Consider the following statements regarding the PM CARES for Children Scheme :\nI. The PM CARES for Children Scheme was launched by the Prime Minister of India on 11th March, 2020 for children who have lost their parents due to COVID-19 pandemic.\nII. The PM CARES for Children Scheme inter-alia provides support to children through convergent approach, gap funding for ensuring education, health, monthly stipend from the age of 14 years and the child receives a lump sum amount of ₹ 10 lakhs on attaining the age of 18 years.\nIII. The children who have lost their legal guardian, adoptive parents or single adoptive parent due to COVID-19 pandemic are also entitled to benefits under the scheme.\nWhich of the above given statements are incorrect ?',
    'పిఎం కేర్స్ ఫర్ చిల్డ్రన్ పథకం గురించి ఈ క్రింది ప్రకటనలను పరిగణించండి :\nI. కోవిడ్-19 మహమ్మారి కారణంగా తల్లిదండ్రులను కోల్పోయిన పిల్లల కోసం మార్చి 11, 2020న భారత ప్రధానమంత్రి పిఎం కేర్స్ ఫర్ చిల్డ్రన్ పథకాన్ని ప్రారంభించారు.\nII. పిఎం కేర్స్ ఫర్ చిల్డ్రన్ పథకం ద్వారా పిల్లల సమగ్ర సంరక్షణ మరియు రక్షణను నిరంతరాయంగా అందించడమే కాకుండా, విద్య, ఆరోగ్యం, 14 సంవత్సరాల వయస్సు నుండి నెలవారీ స్టైఫండ్‌ని మరియు 18 సంవత్సరాలు నిండిన బిడ్డకు ఏక మొత్తంలో ₹ 10 లక్షలు అందుతుంది.\nIII. కోవిడ్-19 మహమ్మారి కారణంగా వారి చట్టపరమైన సంరక్షకుడు, దత్తత తీసుకున్న తల్లిదండ్రులు లేదా ఒంటరిగా దత్తత తీసుకున్న తల్లిదండ్రులను కోల్పోయిన పిల్లలు కూడా ఈ పథకం కింద ప్రయోజనాలకు అర్హులు.\nపైన ఇచ్చిన ప్రకటనలలో ఏవి సరికానివి ?',
    ['I and II only', 'I and III only', 'II and III only', 'None of the above'],
    ['I మరియు II మాత్రమే', 'I మరియు III మాత్రమే', 'II మరియు III మాత్రమే', 'పైవేవీ కావు'],
    0,
    'Statements I and II are incorrect: PM CARES for Children was launched on 29 May 2021 (not 11 March 2020), and provides a monthly stipend from age 18–23 with a lump sum of ₹10 lakhs at age 23 (not age 14 / 18). Statement III is correct.',
    'ప్రకటనలు I మరియు II సరికానివి: ఈ పథకం 29 మే 2021న ప్రారంభించబడింది మరియు 18–23 ఏళ్ల మధ్య స్టైఫండ్, 23 ఏళ్ల వయసులో ₹10 లక్షల మొత్తం అందిస్తుంది.'
  ],
  [
    82, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Anthropology & Sociology of Religion',
    "According to whom ‘the existence of strong personal attachments and the fact of death, which of all human events is the most upsetting and disorganizing to man's calculations, are perhaps the main sources of religious belief’ ?",
    '‘బలమైన వ్యక్తిగత అనుబంధాల ఉనికి మరియు మరణం అనే వాస్తవం, మానవుని గణనకు అత్యంత కలత కలిగించే మరియు అస్తవ్యస్తంగా ఉన్న మానవ సంఘటనలు, బహుశా మత విశ్వాసానికి ప్రధాన వనరులు’ అని ఎవరు పేర్కొన్నారు ?',
    ['Talcott Parsons', 'Emile Durkheim', 'Bronislaw Malinowski', 'Simone de Beauvoir'],
    ['టాల్కాట్ పార్సన్స్', 'ఎమిల్ దర్కైమ్', 'బ్రోనిస్లావ్ మాలినోవ్స్కీ', 'సిమోన్ డి బ్యువోయిర్'],
    2,
    'Social anthropologist Bronislaw Malinowski proposed this psychological-functionalist explanation for the origin of religious belief and mortuary rituals.',
    'బలమైన వ్యక్తిగత అనుబంధాలు మరియు మరణం పట్ల ఆందోళన మత విశ్వాసానికి మూలమని ప్రముఖ మానవశాస్త్రవేత్త బ్రోనిస్లావ్ మాలినోవ్స్కీ పేర్కొన్నారు.'
  ],
  [
    83, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Constitutional Safeguards & SC/ST Reservation',
    'Which of the following Constitutional Amendments provided rights for making provisions in favour of the SCs and STs for relaxation of qualifying marks in any examination (or) lowering the standards of evaluation and for reservation in the matter of promotions to the public services of the Centre and the State ?',
    'ఏదైనా పరీక్షలో అర్హత మార్కుల సడలింపు (లేదా) మూల్యాంకన ప్రమాణాన్ని తగ్గించడం మరియు కేంద్రం మరియు రాష్ట్ర ప్రభుత్వ సేవలకు ప్రమోషన్ల విషయంలో రిజర్వేషన్ కోసం ఎస్సీ మరియు ఎస్టీలకు అనుకూలంగా నిబంధనలను రూపొందించడానికి కింది ఏ రాజ్యాంగ సవరణ హక్కును అందిస్తుంది ?',
    [
      '80th Constitutional Amendment',
      '82nd Constitutional Amendment',
      '89th Constitutional Amendment',
      '93rd Constitutional Amendment'
    ],
    [
      '80వ రాజ్యాంగ సవరణ',
      '82వ రాజ్యాంగ సవరణ',
      '89వ రాజ్యాంగ సవరణ',
      '93వ రాజ్యాంగ సవరణ'
    ],
    1,
    'The 82nd Constitutional Amendment Act, 2000 inserted a proviso into Article 335 permitting relaxation in qualifying marks and lowering evaluation standards for SCs/STs in promotional appointments.',
    '82వ రాజ్యాంగ సవరణ చట్టం (2000) అధికరణం 335కు ఒక నిబంధనను జోడించి ప్రమోషన్లలో ఎస్సీ/ఎస్టీలకు అర్హత మార్కుల సడలింపుకు అనుమతించింది.'
  ],
  [
    84, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Disability Sector International Cooperation',
    'Identify the country with which the Union Cabinet of India has approved signing of Memorandum of Understanding (MoU) for co-operation in disability sector that benefits the persons with disabilities (PwDs) ?',
    'దివ్యాంగ జనులకు (పిడబ్ల్యుడిలు) ప్రయోజనం చేకూర్చేలా, సంబంధిత రంగంలో సహకారం కోసం అవగాహన ఒప్పందం పత్రం (ఎంఒయు)పై సంతకం చేయడానికి భారత కేంద్ర మంత్రివర్గం ఆమోదించిన దేశాన్ని గుర్తించండి ?',
    ['South Africa', 'Germany', 'Japan', 'Brazil'],
    ['దక్షిణాఫ్రికా', 'జర్మనీ', 'జపాన్', 'బ్రెజిల్'],
    0,
    'In February 2023, the Union Cabinet approved the signing of an MoU between India and South Africa for cooperation in the disability sector.',
    'దివ్యాంగుల సంక్షేమ రంగంలో సహకారం కోసం భారత కేంద్ర మంత్రివర్గం దక్షిణాఫ్రికాతో ఎంఒయుపై సంతకం చేయడానికి ఆమోదం తెలిపింది.'
  ],
  [
    85, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Traditional Marriage & Matrilineal Customs',
    'A consensual and informal relationship practised in accordance to matrilineal laws of Kerala that prevailed among Namboothiris and Nairs is known as :',
    'ఈ క్రింది వాటిలో కేరళలోని నంబూతిరి మరియు నాయర్‌ల మధ్య మాతృస్వామ్య చట్టాల ప్రకారం పరస్పరం అంగీకరించబడిన మరియు అనాధికారిక సంబంధం ఏది ?',
    ['Sambandham', 'Pakulam Pathiravum', 'Pranchiyettan', 'Udakapoorvam'],
    ['సంబంధం', 'పాకులం పతిరవుం', 'ప్రాంచియెట్టన్', 'ఉదకపూర్వం'],
    0,
    'Sambandham was the traditional hypergamous/consensual relationship practised under Kerala’s matrilineal (Marumakkathayam) system between Nair women and Namboothiri or Kshatriya men.',
    'కేరళలోని నంబూతిరి మరియు నాయర్ సమాజాల మధ్య మాతృస్వామ్య పద్ధతిలో ఉండే సంప్రదాయ సంబంధాన్ని "సంబంధం" అంటారు.'
  ],
  [
    86, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Hindu Marriage Act & Sapinda Rules',
    'Recently the Delhi High Court has upheld the constitutional validity of a provision of the Hindu Marriage Act which ‘prohibits marriage between people who are related to each other through ancestors from their parent’s side unless their customs allow them to do so’. The said provision was mentioned in which Section of the Hindu Marriage Act ?',
    'ఇటీవల కాలంలో ఢిల్లీ హైకోర్టు హిందూ వివాహ చట్టం యొక్క రాజ్యాంగ చెల్లుబాటును సమర్థించింది హిందూ వివాహ చట్టంలోని నిబంధన ప్రకారం ‘తల్లిదండ్రుల వైపు నుండి పూర్వీకుల ద్వారా ఒకరికొకరు సంబంధం ఉన్న వ్యక్తుల మధ్య వారి ఆచారాలు అనుమతిస్తే తప్ప వివాహాన్ని నిషేధిస్తుంది’. హిందూ వివాహ చట్టంలోని ఏ సెక్షన్‌లో ఈ నిబంధన ప్రస్తావించబడింది ?',
    ['Section 4(a)', 'Section 5(v)', 'Section 12(1)(a)', 'Section 13(ii)'],
    ['సెక్షన్ 4(a)', 'సెక్షన్ 5(v)', 'సెక్షన్ 12(1)(a)', 'సెక్షన్ 13(ii)'],
    1,
    'Section 5(v) of the Hindu Marriage Act, 1955 prohibits marriages between persons within sapinda relationship unless local custom/usage permits it; its validity was upheld by the Delhi High Court in January 2024.',
    'హిందూ వివాహ చట్టం 1955లోని సెక్షన్ 5(v) సపిండ సంబంధాల మధ్య వివాహాన్ని నిషేధిస్తుంది (ఆచారం అనుమతిస్తే తప్ప).'
  ],
  [
    87, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Child Protection Schemes',
    'A Centrally sponsored scheme that aims to achieve the objectives of child protection, happy childhood and development under the Sustainable Development Goals (SDGs) is :',
    'సుస్థిర అభివృద్ధి లక్ష్యాల (SDG లు) కింద పిల్లల రక్షణ, సంతోషకరమైన బాల్యం మరియు అభివృద్ధి లక్ష్యాలను సాధించడం లక్ష్యంగా పెట్టుకున్న కేంద్ర ప్రాయోజిత పథకం :',
    ['Mission Laalana', 'Mission Bala Vihar', 'Mission Balsamrudhi', 'Mission Vatsalya'],
    ['మిషన్ లాలానా', 'మిషన్ బాల విహార్', 'మిషన్ బాలసమృద్ధి', 'మిషన్ వాత్సల్య'],
    3,
    'Mission Vatsalya is the Ministry of Women and Child Development’s Centrally Sponsored umbrella scheme dedicated to child protection, care, and development aligned with SDGs.',
    'పిల్లల రక్షణ, సంక్షేమం మరియు అభివృద్ధి కోసం మహిళా-శిశు అభివృద్ధి మంత్రిత్వ శాఖ అమలు చేస్తున్న కేంద్ర ప్రాయోజిత పథకం "మిషన్ వాత్సల్య".'
  ],
  [
    88, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Ancient Indian Social Customs',
    'Which of the following was the custom practised during the ancient period that allows married women to cohabit with a designated male for the sole purpose of procreating a child if her husband was impotent or had died ?',
    'పురాతన కాలంలో భర్తలో సంతానలేమి సమస్య లేదా భర్త చనిపోయి ఉంటే అటువంటి వివాహిత స్త్రీలు మరియు వితంతువులు, సంతానం పొందాలనే ఏకైక ఉద్దేశ్యంతో నియమించబడిన పురుషుడితో సహజీవనం చేయడానికి అనుమతించే ఆచారం ఏది ?',
    ['Apastamba', 'Sikata Niyavari', 'Pratigya', 'Niyoga'],
    ['ఆపస్తంబ', 'సికట నివారి', 'ప్రతిజ్ఞ', 'నియోగ'],
    3,
    'Niyoga was an ancient Vedic social practice permitting a widow or childless wife to conceive an heir through an appointed kinsman.',
    'ప్రాచీన భారతదేశంలో భర్త మరణించిన లేదా సంతానం లేని సందర్భంలో నియమించబడిన పురుషుని ద్వారా సంతానం పొందే ఆచారాన్ని "నియోగ" అనేవారు.'
  ],
  [
    89, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Constitutional Provisions for Tribal Welfare',
    'As per Article 164(1) of the Constitution of India, a minister in charge of tribal welfare who may in addition be in charge of the Scheduled Castes and backward classes is compulsory for which of the following states ?\nI. Madhya Pradesh\nII. Punjab\nIII. Uttar Pradesh\nIV. Jharkhand\nV. Odisha',
    'భారత రాజ్యాంగంలోని ఆర్టికల్ 164(1) ప్రకారం, షెడ్యూల్డ్ కులాలు మరియు వెనుకబడిన తరగతులకు అదనంగా బాధ్యత వహించే గిరిజన సంక్షేమ శాఖ మంత్రి కింది ఏ రాష్ట్రానికి తప్పనిసరి ?\nI. మధ్య ప్రదేశ్\nII. పంజాబ్\nIII. ఉత్తర ప్రదేశ్\nIV. జార్ఖండ్\nV. ఒడిశా',
    ['I, II and IV only', 'II, III and IV only', 'I, IV and V only', 'II, III and V only'],
    ['I, II మరియు IV మాత్రమే', 'II, III మరియు IV మాత్రమే', 'I, IV మరియు V మాత్రమే', 'II, III మరియు V మాత్రమే'],
    2,
    'The proviso to Article 164(1) (amended by the 94th Amendment Act, 2006) mandates a Tribal Welfare Minister in Chhattisgarh, Jharkhand, Madhya Pradesh, and Odisha.',
    'రాజ్యాంగంలోని ఆర్టికల్ 164(1) ప్రకారం మధ్యప్రదేశ్, ఛత్తీస్‌గఢ్, జార్ఖండ్ మరియు ఒడిశా రాష్ట్రాల్లో గిరిజన సంక్షేమ మంత్రి తప్పనిసరి.'
  ],
  [
    90, 3, 'Indian Society', 'General Knowledge', 'general-knowledge', 'gk', 'indian-society', 'Indian Society',
    'Gender Equality & Judicial Milestones',
    "The comment ‘Devotion cannot be subjected to gender discrimination’ was made by the Apex Court in its judgement in the Sabarimala Case and permitted women of all age groups into the Sabarimala temple. Who among the following middle aged women first entered the Sabarimala temple after the Supreme Court judgement ?",
    '‘భక్తి లింగ వివక్షకు గురికాకూడదు’ అని శబరిమల కేసులో సుప్రీం కోర్టు తన తీర్పులో వ్యాఖ్యానించి అన్ని వయస్సుల గల మహిళలను శబరిమల ఆలయంలోకి అనుమతించింది. సుప్రీంకోర్టు తీర్పు తర్వాత శబరిమల ఆలయంలోకి మొదటగా ప్రవేశించిన మధ్య వయస్కులైన స్త్రీలు ఎవరు ?',
    [
      'Bindu Ammini and Jyothi Nair',
      'Kanaka Durga and Aadhishree',
      'Bindu Ammini and Kanaka Durga',
      'Kanaka Durga and Aishwarya Melton'
    ],
    [
      'బిందు అమ్మని మరియు జ్యోతి నాయర్',
      'కనక దుర్గ మరియు ఆధిశ్రీ',
      'బిందు అమ్మని మరియు కనక దుర్గ',
      'కనక దుర్గ మరియు ఐశ్వర్య మెల్టన్'
    ],
    2,
    'Following the Supreme Court’s September 2018 Sabarimala verdict, Bindu Ammini and Kanaka Durga entered the temple on 2 January 2019.',
    'సుప్రీంకోర్టు తీర్పు తర్వాత జనవరి 2, 2019న బిందు అమ్మని మరియు కనక దుర్గ మొదటిసారిగా శబరిమల ఆలయంలోకి ప్రవేశించారు.'
  ],

  // ================= SECTION D: CURRENT AFFAIRS (Q91–Q120) =================
  [
    91, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'sports-events', 'Sports Events',
    '9th Asian Winter Games 2025',
    "Consider the following statements regarding the 9th Asian Winter Games :\nI. The 9th Asian Winter Games 2025 are set to be held at Beijing, China.\nII. The official slogan of the 9th Asian Winter Games 2025 is ‘Dream of Winter, Love Among Asia’.\nIII. The names of the two tiger mascots of the 9th Asian Winter Games 2025 are Yingying and Nini.\nIV. On January 11th, 2024 the emblem of the 9th Asian Winter Games 2025 ‘Breakthrough’ was officially announced.\nWhich of the given above statements are correct ?",
    '9వ ఆసియా శీతాకాలపు క్రీడలకు సంబంధించి ఈ క్రింది ప్రకటనలను పరిగణించండి :\nI. 9వ ఆసియా శీతాకాలపు క్రీడలు 2025 చైనాలోని బీజింగ్‌లో నిర్వహించబడతాయి.\nII. 9వ ఆసియా శీతాకాలపు క్రీడల 2025 యొక్క అధికారిక నినాదం ‘డ్రీమ్ ఆఫ్ వింటర్, లవ్ అమాంగ్ ఆసియా’ (Dream of Winter, Love Among Asia).\nIII. 9వ ఆసియా శీతాకాలపు క్రీడలు 2025 యొక్క రెండు టైగర్ మస్కట్‌ల పేర్లు యింగ్‌యింగ్ మరియు నిని.\nIV. జనవరి 11, 2024న 9వ ఆసియా శీతాకాలపు క్రీడల 2025 చిహ్నం ‘బ్రేక్‌త్రూ’ (Breakthrough) అధికారికంగా ప్రకటించబడింది.\nపైన ఇచ్చిన ప్రకటనలలో ఏవి సరైనవి ?',
    ['I and II only', 'II and III only', 'I and IV only', 'II and IV only'],
    ['I మరియు II మాత్రమే', 'II మరియు III మాత్రమే', 'I మరియు IV మాత్రమే', 'II మరియు IV మాత్రమే'],
    3,
    'The 9th Asian Winter Games 2025 were hosted in Harbin, China (not Beijing), with tiger mascots Binbin and Nini (not Yingying and Nini). Slogan “Dream of Winter, Love Among Asia” (II) and emblem “Breakthrough” (IV) are correct.',
    '9వ ఆసియా శీతాకాలపు క్రీడలు 2025 చైనాలోని హార్బిన్‌లో జరిగాయి (బీజింగ్ కాదు) మరియు మస్కట్‌ల పేర్లు బిన్‌బిన్, నిని. కాబట్టి II మరియు IV మాత్రమే సరైనవి.'
  ],
  [
    92, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'international-summits', 'International Summits',
    'WHO Public Health Certifications',
    'Which country was certified as Malaria-free by the World Health Organization (WHO) in 2024 ?',
    '2024లో ప్రపంచ ఆరోగ్య సంస్థ (WHO) మలేరియా రహిత ధ్రువీకరణ పత్రాన్ని ఏ దేశం సాధించింది ?',
    ['Morocco', 'Cabo Verde', 'United Arab Emirates', 'Mauritius'],
    ['మొరాకో', 'కాబో వెర్డే', 'యునైటెడ్ అరబ్ ఎమిరేట్స్', 'మారిషస్'],
    1,
    'In January 2024, Cabo Verde (Cape Verde) became the 43rd country overall and third in Africa (after Mauritius and Algeria) to be certified malaria-free by the WHO.',
    'జనవరి 2024లో ఆఫ్రికా ఖండంలోని కాబో వెర్డే (Cabo Verde) దేశాన్ని ప్రపంచ ఆరోగ్య సంస్థ మలేరియా రహిత దేశంగా ప్రకటించింది.'
  ],
  [
    93, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'awards-appointments', 'Awards and Appointments',
    'Padma Awards 2024',
    'Who among the following eminent personalities have been conferred with the Padma Shri Award 2024 for their contributions and achievements in the field of Arts ?\nI. Drona Bhuyan\nII. Ghulam Nabi Dar\nIII. Rajaram Jain\nIV. Dasari Kondappa\nV. Dukhu Majhi',
    'ఈ క్రింది ప్రముఖ వ్యక్తులలో ఎవరికి కళారంగంలో వారి కృషికి మరియు విజయాలకు పద్మశ్రీ అవార్డు 2024ను ప్రదానం చేశారు ?\nI. ద్రోణ భుయాన్\nII. గులాం నబీ దార్\nIII. రాజారామ్ జైన్\nIV. దాసరి కొండప్ప\nV. దుఖు మాఝీ',
    ['I, II and IV only', 'I, III and IV only', 'II, IV and V only', 'All of the above'],
    ['I, II మరియు IV మాత్రమే', 'I, III మరియు IV మాత్రమే', 'II, IV మరియు V మాత్రమే', 'పైవన్నీ'],
    0,
    'Padma Shri 2024 in Art: Drona Bhuyan (Assam, folk artist), Ghulam Nabi Dar (J&K, wood carving), and Dasari Kondappa (Telangana, Burra Veena folk artist). Rajaram Jain was awarded in Literature & Education, and Dukhu Majhi in Social Work.',
    '2024 పద్మశ్రీ కళారంగ విజేతలు: ద్రోణ భుయాన్, గులాం నబీ దార్, దాసరి కొండప్ప (రాజారామ్ జైన్ సాహిత్యం-విద్య, దుఖు మాఝీ సామాజిక సేవ).'
  ],
  [
    94, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'national-affairs', 'National Affairs',
    'Cyber Crime & INTERPOL Cases',
    'According to INTERPOL, which State police had registered one of the first cases in India of human trafficking committed to force victims to commit cyber fraud ?',
    'INTERPOL ప్రకారం, సైబర్ మోసాలకు బాధితులను బలవంతం చేయడానికి పాల్పడిన మానవ అక్రమ రవాణాకు సంబంధించి భారతదేశంలో మొదటి కేసు ఏ రాష్ట్ర పోలీసులు నమోదు చేశారు ?',
    ['Maharashtra', 'Uttar Pradesh', 'Telangana', 'Bihar'],
    ['మహారాష్ట్ర', 'ఉత్తర ప్రదేశ్', 'తెలంగాణ', 'బీహార్'],
    2,
    'Telangana Police (Rachakonda Commissionerate) registered India’s first recognized human-trafficking case involving forced overseas cyber-scamming networks cited by INTERPOL.',
    'విదేశీ సైబర్ మోసాలకు బాధితులను బలవంతం చేసే మానవ అక్రమ రవాణాపై భారతదేశంలో తొలి కేసును తెలంగాణ పోలీసులు నమోదు చేసినట్లు INTERPOL పేర్కొంది.'
  ],
  [
    95, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'sports-events', 'Sports Events',
    'National Sports & Arjuna Awards 2023',
    'Match the following List I with List II with regard to Arjuna Awards 2023 :\nList I (Name)\na. Ritu Negi\nb. Sheetal Devi\nc. Naorem Roshibina Devi\nd. Diksha Dagar\ne. Harinder Pal Singh Sandhu\nList II (Sports Discipline)\nI. Golf\nII. Kabaddi\nIII. Squash\nIV. Para-Archery\nV. Wushu\nCodes :',
    'అర్జున అవార్డ్స్ 2023కి సంబంధించి కింది జాబితా Iని జాబితా IIతో సరిపోల్చండి :\nజాబితా I (పేరు)\na. రీతు నేగి\nb. శీతల్ దేవి\nc. నౌరెమ్ రోషిబినా దేవి\nd. దీక్షా దాగర్\ne. హరీందర్ పాల్ సింగ్ సంధు\nజాబితా II (క్రీడల క్రమశిక్షణ)\nI. గోల్ఫ్\nII. కబడ్డీ\nIII. స్క్వాష్\nIV. పారా-ఆర్చరీ\nV. ఉషు\nసమాధానాలు :',
    [
      'a-III, b-IV, c-V, d-I, e-II',
      'a-II, b-V, c-IV, d-I, e-III',
      'a-II, b-IV, c-V, d-III, e-I',
      'a-II, b-IV, c-V, d-I, e-III'
    ],
    [
      'a-III, b-IV, c-V, d-I, e-II',
      'a-II, b-V, c-IV, d-I, e-III',
      'a-II, b-IV, c-V, d-III, e-I',
      'a-II, b-IV, c-V, d-I, e-III'
    ],
    3,
    'Arjuna Awards 2023 disciplines: Ritu Negi – Kabaddi (II); Sheetal Devi – Para-Archery (IV); Naorem Roshibina Devi – Wushu (V); Diksha Dagar – Golf (I); Harinder Pal Singh Sandhu – Squash (III).',
    'అర్జున అవార్డు 2023 క్రీడాకారులు: రీతు నేగి (కబడ్డీ), శీతల్ దేవి (పారా ఆర్చరీ), రోషిబినా దేవి (ఉషు), దీక్షా దాగర్ (గోల్ఫ్), హరీందర్ పాల్ సింగ్ సంధు (స్క్వాష్).'
  ],
  [
    96, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'national-affairs', 'National Affairs',
    'State Digital & Gaming Initiatives',
    'Which among the following is the initiative by the Government of Karnataka in collaboration with the All India Game Developers Forum (AIGDF) with special emphasis on gaming and social media ?',
    'గేమింగ్ మరియు సోషల్ మీడియాపై ప్రత్యేక ప్రాధాన్యతనిస్తూ ఆల్-ఇండియా గేమ్ డెవలపర్స్ ఫోరమ్ (AIGDF) సహకారంతో కర్ణాటక ప్రభుత్వం ఈ క్రింది వాటిలో ఏది ప్రారంభించింది ?',
    ['Digital Detox', 'Digital One Stop', 'Digital Smart', 'Digital Bengaluru One'],
    ['డిజిటల్ డిటాక్స్', 'డిజిటల్ వన్ స్టాప్', 'డిజిటల్ స్మార్ట్', 'డిజిటల్ బెంగళూరు వన్'],
    0,
    'The Government of Karnataka partnered with AIGDF in early 2024 to launch the Digital Detox initiative promoting responsible gaming and healthy social media habits.',
    'గేమింగ్, సోషల్ మీడియా వినియోగంపై అవగాహన కోసం కర్ణాటక ప్రభుత్వం AIGDFతో కలిసి "డిజిటల్ డిటాక్స్ (Digital Detox)" కార్యక్రమాన్ని ప్రారంభించింది.'
  ],
  [
    97, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'national-affairs', 'National Affairs',
    'International Days & Themes 2024',
    "What is the theme of ‘International Day of Education 2024’ ?",
    '‘అంతర్జాతీయ విద్యా దినోత్సవం 2024’ యొక్క నేపథ్యం (theme) ఏమిటి ?',
    [
      'Learning for people, planet, prosperity and peace',
      'To invest in people, prioritize education',
      'Learning for lasting peace',
      'Education : A key driver for inclusion and empowerment'
    ],
    [
      'లెర్నింగ్ ఫర్ పీపుల్, ప్లానెట్, ప్రాస్పరిటీ అండ్ పీస్',
      'టు ఇన్వెస్ట్ ఇన్ పీపుల్, ప్రియారిటైజ్ ఎడ్యుకేషన్',
      'లెర్నింగ్ ఫర్ లాస్టింగ్ పీస్',
      'ఎడ్యుకేషన్ : ఏ కీ డ్రైవర్ ఫర్ ఇంక్లూజన్ అండ్ ఎంపవర్‌మెంట్'
    ],
    2,
    'UNESCO observed the 6th International Day of Education on 24 January 2024 under the theme “Learning for lasting peace”.',
    '2024 జనవరి 24న జరుపుకున్న అంతర్జాతీయ విద్యా దినోత్సవం యొక్క థీమ్ "శాశ్వత శాంతి కోసం విద్య (Learning for lasting peace)".'
  ],
  [
    98, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'national-affairs', 'National Affairs',
    'National Highway & Green Infrastructure',
    'Consider the following statements :\nI. India’s first National Highway steel slag road section is on NH-66 Mumbai-Goa National Highway.\nII. Steel slag technology was developed by the Indian Green Building Council (IGBC) and Central Road Research Institute (CRRI).\nIII. JSW Steel, under the IGBC-CRRI technological guidance, has constructed a 1 km long four lane steel slag road section on NH-66 Mumbai-Goa National Highway.\nWhich of the above given statements is/are correct ?',
    'ఈ క్రింది ప్రకటనలను పరిగణించండి :\nI. భారతదేశపు మొదటి నేషనల్ హైవే స్టీల్ స్లాగ్ రోడ్ NH-66 ముంబై-గోవా జాతీయ రహదారిపై నిర్మించబడింది.\nII. స్టీల్ స్లాగ్ టెక్నాలజీని ఇండియన్ గ్రీన్ బిల్డింగ్ కౌన్సిల్ (IGBC) మరియు సెంట్రల్ రోడ్ రీసెర్చ్ ఇన్స్టిట్యూట్ (CRRI) అభివృద్ధి చేశాయి.\nIII. IGBC-CRRI సాంకేతిక మార్గదర్శకత్వంలో JSW స్టీల్, NH-66 ముంబై-గోవా జాతీయ రహదారిపై 1 కి.మీ. నాలుగు లేన్ స్టీల్ స్లాగ్ రోడ్డు ను నిర్మించింది.\nపైన ఇచ్చిన ప్రకటనలలో ఏది/ఏవి సరైనవి ?',
    ['I only', 'II only', 'I and II only', 'II and III only'],
    ['I మాత్రమే', 'II మాత్రమే', 'I మరియు II మాత్రమే', 'II మరియు III మాత్రమే'],
    0,
    'Statement I is correct: India’s first National Highway steel slag road section is on NH-66 (Mumbai-Goa). Statements II and III incorrectly credit IGBC—steel slag road technology was indigenously developed by CSIR-CRRI (sponsored by the Ministry of Steel), not IGBC.',
    'NH-66 ముంబై-గోవా రహదారిపై దేశంలోనే తొలి జాతీయ రహదారి స్టీల్ స్లాగ్ రోడ్డు నిర్మించబడింది (I మాత్రమే సరైనది). ఈ సాంకేతికతను CSIR-CRRI అభివృద్ధి చేసింది (IGBC కాదు).'
  ],
  [
    99, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'international-summits', 'International Summits',
    'Global Museums & Space Honours',
    "‘The Husavik Exploration Museum’ seen in the news recently, belongs to which country ?",
    'ఇటీవలి వార్తల్లో కనిపిస్తున్న ‘ది హుసావిక్ ఎక్స్‌ప్లోరేషన్ మ్యూజియం’ ఏ దేశానికి చెందినది ?',
    ['Poland', 'Bulgaria', 'Saint Lucia', 'Iceland'],
    ['పోలాండ్', 'బల్గేరియా', 'సెయింట్ లూసియా', 'ఐస్లాండ్'],
    3,
    'The Exploration Museum in Husavik, Iceland awarded the 2023 Leif Erikson Lunar Prize to ISRO for the Chandrayaan-3 mission.',
    'చంద్రయాన్-3 విజయానికి గాను ఇస్రోకు లీఫ్ ఎరిక్సన్ లూనార్ బహుమతిని ప్రదానం చేసిన హుసావిక్ ఎక్స్‌ప్లోరేషన్ మ్యూజియం "ఐస్లాండ్" దేశానికి చెందినది.'
  ],
  [
    100, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'defence-space', 'Defence and Space',
    'Naval Exercises (MILAN 2024)',
    'Consider the following statements about MILAN 2024 :\nI. MILAN 2024 is the 12th edition of Multilateral Naval Exercise being held from 19th to 27th February, 2024 under the aegis of Southern Naval Command.\nII. The Harbour phase of MILAN 2024 is from 19th to 25th February, 2024 and is aimed towards building upon the experience of multilateral forces operating together at sea.\nIII. The Sea phase of MILAN 2024 is being conducted from 22nd to 27th February, 2024 and provides a platform for participating navies to discuss maritime subjects of common interest and share solutions.\nWhich among the above given statements are correct ?',
    'MILAN 2024 గురించి క్రింది ప్రకటనలను పరిగణించండి :\nI. MILAN 2024 అనేది దక్షిణ నౌకాదళ కమాండ్ ఆధ్వర్యంలో 2024 ఫిబ్రవరి 19 నుండి 27 వరకు నిర్వహించబడుతున్న మల్టీ లాటరల్ నేవల్ ఎక్సర్‌సైజ్ యొక్క 12వ ఎడిషన్.\nII. MILAN 2024 యొక్క హార్బర్ దశ 2024 ఫిబ్రవరి 19 నుండి 25 వరకు ఉంటుంది మరియు సముద్రంలో కలిసి పనిచేసే బహుపాక్షిక శక్తుల అనుభవాలను పంచుకోవడం లక్ష్యంగా పెట్టుకుంది.\nIII. MILAN 2024 యొక్క సముద్ర దశ 2024 ఫిబ్రవరి 22 నుండి 27 వరకు నిర్వహించబడుతుంది మరియు ఆసక్తి ఉన్న సముద్ర విషయాలను చర్చించడానికి మరియు పరిష్కారాలను పంచుకోవడానికి పాల్గొనే నౌకాదళాలకు వేదికను అందిస్తుంది.\nపైన ఇచ్చిన ప్రకటనలలో ఏవి సరైనవి ?',
    ['I and II only', 'II and III only', 'I, II and III', 'None of the above'],
    ['I మరియు II మాత్రమే', 'II మరియు III మాత్రమే', 'I, II మరియు III', 'పైవేవీ కావు'],
    3,
    'MILAN 2024 (12th edition) was hosted at Visakhapatnam under the Eastern Naval Command (not Southern Naval Command). Its Harbour phase ran 19–24 Feb (and Sea phase 24–27 Feb), and discussions occur during the Harbour phase while joint maritime operations happen in the Sea phase (flipped in II and III). Thus none of the statements are accurate.',
    'మిలన్-2024 విశాఖపట్నంలోని తూర్పు నౌకాదళ కమాండ్ ఆధ్వర్యంలో జరిగింది (దక్షిణ కాదు). హార్బర్ దశ (ఫిబ్రవరి 19-24), సముద్ర దశ (ఫిబ్రవరి 24-27) వివరాలు కూడా తప్పుగా ఇవ్వబడ్డాయి. కాబట్టి పైవేవీ కావు.'
  ],
  [
    101, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'science-environment', 'Science and Environment',
    'Global Biodiversity & National Symbols',
    'Which country has officially declared the ‘Snow Leopard’ as its national symbol, underscoring its commitment to conservation and ecological balance ?',
    'పరిరక్షణ మరియు పర్యావరణ సమతుల్యత పట్ల నిబద్ధతను చాటిచెబుతూ ‘మంచు చిరుత’ ను తమ జాతీయ చిహ్నంగా ఏ దేశం అధికారికంగా ప్రకటించింది ?',
    ['Kazakhstan', 'Mozambique', 'Kyrgyzstan', 'Democratic Republic of the Congo'],
    ['కజకిస్తాన్', 'మొజాంబిక్', 'కిర్గిజిస్తాన్', 'డెమోక్రటిక్ రిపబ్లిక్ ఆఫ్ ద కాంగో'],
    2,
    'In January 2024, Kyrgyzstan officially declared the snow leopard as its national symbol to highlight wildlife conservation in the Tien Shan mountains.',
    'జనవరి 2024లో కిర్గిజిస్తాన్ దేశం "మంచు చిరుత" (Snow Leopard)ను తమ జాతీయ చిహ్నంగా అధికారికంగా ప్రకటించింది.'
  ],
  [
    102, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'international-summits', 'International Summits',
    'Global Biofuel Alliance (GBA)',
    'The Global Biofuel Alliance (GBA) was launched on 9th September, 2023 during the G20 Summit. Which among the following non-G20 countries are supporting the Global Biofuel Alliance (GBA) ?\nI. Paraguay\nII. Sri Lanka\nIII. Guyana\nIV. Seychelles\nV. Chile\nVI. Finland',
    'గ్లోబల్ బయో ఫ్యూయల్ అలయన్స్ (GBA) 9 సెప్టెంబర్, 2023న G20 సమ్మిట్ సందర్భంగా ప్రారంభించబడింది. క్రింది G20 యేతర దేశాలలో ఏవి గ్లోబల్ బయో ఫ్యూయల్ అలయన్స్ (GBA)కి మద్దతు ఇస్తున్నాయి ?\nI. పరాగ్వే\nII. శ్రీలంక\nIII. గయానా\nIV. సీషెల్స్\nV. చిలీ\nVI. ఫిన్లాండ్',
    [
      'I, II, III, IV and V',
      'II, III, IV, V and VI',
      'I, III, IV, V and VI',
      'I, II, III, IV and VI'
    ],
    [
      'I, II, III, IV మరియు V',
      'II, III, IV, V మరియు VI',
      'I, III, IV, V మరియు VI',
      'I, II, III, IV మరియు VI'
    ],
    3,
    'At the New Delhi G20 Summit launch of the Global Biofuel Alliance (9 Sep 2023), non-G20 supporting nations included Paraguay, Sri Lanka, Guyana, Seychelles, Finland, Iceland, Kenya, and Uganda (Chile was not among them).',
    '2023 జీ20 సదస్సులో ప్రారంభించిన గ్లోబల్ బయోఫ్యూయల్ అలయన్స్‌కు పరాగ్వే, శ్రీలంక, గయానా, సీషెల్స్ మరియు ఫిన్లాండ్ (I, II, III, IV, VI) మద్దతు ప్రకటించాయి.'
  ],
  [
    103, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'national-affairs', 'National Affairs',
    'Tourism & Defence PSUs',
    "The Government of Gujarat is set to launch the country's first Submarine tourism in collaboration with :",
    'గుజరాత్ ప్రభుత్వం ఎవరి సహకారంతో దేశంలోనే మొట్టమొదటి సబ్‌మెరైన్ టూరిజంను ప్రారంభించనుంది :',
    [
      'Huntington Ingalls Industries',
      'Daewoo Shipbuilding and Marine Engineering Co. Ltd',
      'Mazagon Dock Shipbuilders Limited',
      'General Dynamics Corporation'
    ],
    [
      'హంటింగ్టన్ ఇంగాల్స్ ఇండస్ట్రీస్',
      'దేవూ షిప్ బిల్డింగ్ మరియు మెరైన్ ఇంజనీరింగ్ కో. లిమిటెడ్',
      'మజగాన్ డాక్ షిప్‌బిల్డర్స్ లిమిటెడ్',
      'జనరల్ డైనమిక్స్ కార్పొరేషన్'
    ],
    2,
    'The Gujarat government partnered with Mazagon Dock Shipbuilders Limited (MDL) to launch India’s first underwater submarine tourism project near Bet Dwarka.',
    'ద్వారక సమీపంలో దేశంలోనే తొలి జలాంతర్గామి (సబ్‌మెరైన్) పర్యాటక ప్రాజెక్టు కోసం గుజరాత్ ప్రభుత్వం మజగాన్ డాక్ షిప్‌బిల్డర్స్ లిమిటెడ్ (MDL)తో ఒప్పందం కుదుర్చుకుంది.'
  ],
  [
    104, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'economy-banking', 'Economy and Banking',
    'Andhra Pradesh Industrial Investments & EVs',
    'A German-based company, Pepper Motion is set to invest ₹ 4,640 crores in its EV Bus and Truck manufacturing unit in 800 acres at :',
    'జర్మనీకి చెందిన కంపెనీ పెప్పర్ మోషన్ ఈవీ (EV) బస్సులు మరియు ట్రక్కుల తయారీ యూనిట్‌కి సంబంధించి ఏ ప్రాంతంలో 800 ఎకరాల్లో ₹ 4,640 కోట్లు పెట్టుబడి పెట్టనుంది :',
    [
      'Badvel, YSR Kadapa',
      'Somandepalle Mandal, Anantapur',
      'Atchutapuram, Visakhapatnam',
      'Punganur, Chittoor'
    ],
    [
      'బద్వేల్, వైఎస్ఆర్ కడప',
      'సోమందేపల్లి మండలం, అనంతపురం',
      'అచ్యుతాపురం, విశాఖపట్నం',
      'పుంగనూరు, చిత్తూరు'
    ],
    3,
    'German electric mobility firm Pepper Motion announced a ₹4,640-crore EV bus and truck manufacturing plant over 800 acres at Punganur in Chittoor district, Andhra Pradesh.',
    'జర్మనీకి చెందిన పెప్పర్ మోషన్ సంస్థ చిత్తూరు జిల్లా పుంగనూరులో 800 ఎకరాల్లో ₹4,640 కోట్లతో ఈవీ బస్సులు, ట్రక్కుల తయారీ ప్లాంట్ ఏర్పాటు చేయనుంది.'
  ],
  [
    105, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'national-affairs', 'National Affairs',
    'High Court Judgements & State Legislation',
    'In which state was the law guaranteeing 75% reservation for their local residents in the private sector struck down by the High Court stating the law is unconstitutional ?',
    'ప్రైవేట్ రంగంలో వారి స్థానిక నివాసితులకు 75% రిజర్వేషన్ హామీనిచ్చే చట్టాన్ని ఏ రాష్ట్రంలో హైకోర్టు రాజ్యాంగ విరుద్ధమని పేర్కొంటూ కొట్టివేసింది ?',
    ['Karnataka', 'Haryana', 'Jharkhand', 'Andhra Pradesh'],
    ['కర్ణాటక', 'హర్యానా', 'జార్ఖండ్', 'ఆంధ్రప్రదేశ్'],
    1,
    'In November 2023, the Punjab and Haryana High Court struck down the Haryana State Employment of Local Candidates Act, 2020 (providing 75% private sector quota) as unconstitutional under Articles 14 and 19.',
    'హర్యానాలో ప్రైవేట్ రంగ ఉద్యోగాలలో స్థానికులకు 75% రిజర్వేషన్ కల్పించే చట్టాన్ని పంజాబ్-హర్యానా హైకోర్టు రాజ్యాంగ విరుద్ధమని కొట్టివేసింది.'
  ],
  [
    106, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'science-environment', 'Science and Environment',
    'COP28 & Global River Cities Alliance',
    'Consider the following statements :\nI. The Global River Cities Alliance (GRCA) led by National Mission for Clean Ganga under the Ministry of Jal Shakti was launched at COP28 in New Delhi.\nII. The Global River Cities Alliance (GRCA) is a unique alliance covering 275+ global river cities in 11 countries.\nIII. The Global River Cities Alliance (GRCA) is the first of its kind in the world.\nWhich of the above given statements is/are correct ?',
    'ఈ క్రింది ప్రకటనలను పరిగణించండి :\nI. జల శక్తి మంత్రిత్వ శాఖ ఆధ్వర్యంలో క్లీన్ గంగా నేషనల్ మిషన్ నేతృత్వంలో గ్లోబల్ రివర్ సిటీస్ అలయన్స్ (GRCA) COP28 సదస్సు నందు న్యూఢిల్లీలో ప్రారంభించబడింది.\nII. గ్లోబల్ రివర్ సిటీస్ అలయన్స్ (GRCA) అనేది 11 దేశాలలో 275+ ప్రపంచ నది పట్టణాలను కలుపుకొనిపోయే ఒక ప్రత్యేకమైన కూటమి.\nIII. గ్లోబల్ రివర్ సిటీస్ అలయన్స్ (GRCA) ప్రపంచంలోనే మొట్టమొదటిది.\nపైన ఇచ్చిన ప్రకటనలలో ఏది/ఏవి సరైనవి ?',
    ['I and II only', 'I only', 'I and III only', 'II and III only'],
    ['I మరియు II మాత్రమే', 'I మాత్రమే', 'I మరియు III మాత్రమే', 'II మరియు III మాత్రమే'],
    3,
    'The Global River Cities Alliance (GRCA) was launched at COP28 in Dubai, UAE (not New Delhi). Statements II and III regarding 275+ river cities across 11 countries and being the first such global alliance are correct.',
    'గ్లోబల్ రివర్ సిటీస్ అలయన్స్ (GRCA) దుబాయ్‌లోని COP28 సదస్సులో ప్రారంభించబడింది (న్యూఢిల్లీలో కాదు). కాబట్టి II మరియు III మాత్రమే సరైనవి.'
  ],
  [
    107, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'government-schemes', 'Government Schemes',
    'Andhra Pradesh Welfare Schemes',
    'Which among the following is incorrectly paired ?',
    'ఈ క్రింది వాటిలో ఏది తప్పుగా జత చేయబడింది ?',
    [
      'Jagananna Chedodu : It provides a financial assistance of ₹ 10,000 per annum to Rajakas and Nayee Brahmins for better livelihood.',
      'Jagananna Thodu : It facilitates a working capital loan up to ₹ 10,000 to the eligible poor, small and petty vendors with an intention to make them financially independent.',
      'Jagananna Jeeva Kranthi Scheme : It aims to empower and provide social stability to women belonging to BC, SC and ST categories. The beneficiaries will receive sheep and goat units under this scheme.',
      'YSR Navodayam Scheme : It aims to provide self-employment opportunities to the youth of Andhra Pradesh by creating job opportunities in the transport sector.'
    ],
    [
      'జగనన్న చేదోడు : ఇది రజక మరియు నాయీబ్రాహ్మణులకు మెరుగైన జీవనోపాధి కోసం సంవత్సరానికి ₹ 10,000 ఆర్థిక సహాయం అందజేస్తుంది.',
      'జగనన్న తోడు : అర్హులైన పేద, సన్న మరియు చిన్న వ్యాపారులకు ఆర్థిక స్వాతంత్ర్యం కల్పించాలనే ఉద్దేశ్యంతో ఇది ₹ 10,000 వరకు పెట్టుబడి సహాయం కింద రుణాలను అందిస్తుంది.',
      'జగనన్న జీవ క్రాంతి పథకం : BC, SC మరియు ST వర్గాలకు చెందిన మహిళలకు సాధికారత మరియు సామాజిక స్థిరత్వాన్ని అందించడం దీని లక్ష్యం. ఈ పథకం కింద లబ్దిదారులకు గొర్రెలు మరియు మేకలు యూనిట్లు అందుతాయి.',
      'వైఎస్ఆర్ నవోదయం పథకం : రవాణా రంగంలో ఉద్యోగ అవకాశాలను సృష్టించడం ద్వారా ఆంధ్రప్రదేశ్ యువతకు స్వయం ఉపాధి అవకాశాలను కల్పించడం దీని లక్ష్యం.'
    ],
    3,
    'YSR Navodayam Scheme was launched for one-time debt restructuring of MSMEs in Andhra Pradesh, whereas self-employment/financial assistance in the transport sector (auto/taxi/maxi cab drivers) was covered under YSR Vahana Mitra.',
    'వైఎస్ఆర్ నవోదయం పథకం MSME పరిశ్రమల రుణ పునర్వ్యవస్థీకరణకు సంబంధించినది (రవాణా రంగ డ్రైవర్ల ఆర్థిక సహాయం వైఎస్ఆర్ వాహన మిత్ర కిందకు వస్తుంది).'
  ],
  [
    108, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'national-affairs', 'National Affairs',
    'Indo-Israel Agriculture Project in AP',
    'The Centre of Excellence for Vegetables and Spices under the Indo-Israel Agriculture Project was proposed to be set up in :',
    'ఇండో-ఇజ్రాయెల్ అగ్రికల్చర్ ప్రాజెక్ట్ క్రింద ‘ది సెంటర్ ఆఫ్ ఎక్సెలెన్స్ ఫర్ వెజిటెబుల్స్ అండ్ స్పైసెస్’ ను ఎక్కడ ఏర్పాటు చేయాలని ప్రతిపాదించబడింది :',
    ['Annamayya District', 'Alluri Sitharamaraju District', 'Palnadu District', 'Guntur District'],
    ['అన్నమయ్య జిల్లా', 'అల్లూరి సీతారామరాజు జిల్లా', 'పల్నాడు జిల్లా', 'గుంటూరు జిల్లా'],
    3,
    'Under the Indo-Israel Agricultural Project in Andhra Pradesh, a Centre of Excellence for Vegetables and Spices was proposed in Guntur District.',
    'ఇండో-ఇజ్రాయెల్ వ్యవసాయ ప్రాజెక్టు కింద కూరగాయలు మరియు సుగంధ ద్రవ్యాల (Vegetables & Spices) సెంటర్ ఆఫ్ ఎక్సలెన్స్‌ను గుంటూరు జిల్లాలో ఏర్పాటు చేయాలని ప్రతిపాదించారు.'
  ],
  [
    109, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'national-affairs', 'National Affairs',
    'Railway Sustainability Certifications',
    'Consider the following statements :\nI. Vijayawada Railway Station was awarded the ‘Green Railway Station’ certification with the highest rating of Platinum by Leadership in Energy and Environmental Design (LEED), USA.\nII. Vijayawada Railway Station is the first in the South-Central Railway (SCR) Zone to have bagged the Platinum ring.\nWhich among the above given statements is/are correct ?',
    'ఈ క్రింది ప్రకటనలను పరిగణించండి :\nI. విజయవాడ రైల్వే స్టేషన్‌కి లీడర్‌షిప్ ఇన్ ఎనర్జీ అండ్ ఎన్విరాన్‌మెంటల్ డిజైన్ (LEED), USA ద్వారా అత్యధిక ప్లాటినం రేటింగ్‌తో ‘గ్రీన్ రైల్వే స్టేషన్’ సర్టిఫికేషన్ లభించింది.\nII. దక్షిణ-మధ్య రైల్వే (SCR) జోన్‌లో ప్లాటినం రేటింగ్ గెలుచుకున్న మొదటి రైల్వే స్టేషన్ విజయవాడ.\nపైన ఇచ్చిన ప్రకటనలలో ఏది/ఏవి సరైనవి ?',
    ['I only', 'II only', 'I and II', 'None of the above'],
    ['I మాత్రమే', 'II మాత్రమే', 'I మరియు II', 'పైవేవీ కావు'],
    3,
    'Statement I is incorrect because Vijayawada Railway Station received its Platinum Green Railway Station certification from the Indian Green Building Council (IGBC), not LEED USA. Statement II is incorrect because Secunderabad Railway Station was the first in the SCR Zone to receive Platinum rating (in 2019).',
    'విజయవాడ రైల్వే స్టేషన్‌కు ప్లాటినం గ్రీన్ సర్టిఫికేషన్ ఇండియన్ గ్రీన్ బిల్డింగ్ కౌన్సిల్ (IGBC) ద్వారా లభించింది (LEED కాదు), మరియు SCR జోన్‌లో మొదటిది సికింద్రాబాద్. కాబట్టి పైవేవీ కావు.'
  ],
  [
    110, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'international-summits', 'International Summits',
    'BRICS Expansion 2024',
    'Which among the following countries got membership into BRICS bloc with effect from 1st January, 2024 ?\nI. Egypt\nII. Argentina\nIII. Indonesia\nIV. Ethiopia\nV. Saudi Arabia',
    'జనవరి 1, 2024 నుండి బ్రిక్స్ బ్లాక్‌లో (BRICS bloc) ఈ క్రింది దేశాలలో ఏవి సభ్యత్వాన్ని పొందాయి ?\nI. ఈజిప్ట్\nII. అర్జెంటీనా\nIII. ఇండోనేషియా\nIV. ఇథియోపియా\nV. సౌదీ అరేబియా',
    ['I, II and III', 'II, III and V', 'I, III and V', 'I, IV and V'],
    ['I, II మరియు III', 'II, III మరియు V', 'I, III మరియు V', 'I, IV మరియు V'],
    3,
    'Effective 1 January 2024, Egypt, Ethiopia, Iran, the UAE, and Saudi Arabia were admitted into the BRICS expansion list (Argentina declined in December 2023; Indonesia joined later in Jan 2025).',
    'జనవరి 1, 2024 నుండి బ్రిక్స్ కూటమి విస్తరణలో భాగంగా ఈజిప్ట్, ఇథియోపియా, సౌదీ అరేబియా (I, IV, V) సభ్యదేశాలుగా చేరాయి (అర్జెంటీనా తిరస్కరించింది).'
  ],
  [
    111, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'government-schemes', 'Government Schemes',
    'PM Vishwakarma Yojana',
    'Identify the incorrect statement regarding ‘PM Vishwakarma Yojana’ Scheme :\nI. The Government of India launched the ‘PM Vishwakarma Yojana’ Scheme to provide end-to-end support to fishermen with non-mechanized boats.\nII. ‘PM Vishwakarma Yojana’ Scheme provides collateral free enterprise development loan up to ₹ 6 lakhs in two tranches.',
    '‘పీఎం విశ్వకర్మ యోజన’ పథకానికి సంబంధించి సరికాని ప్రకటనను గుర్తించండి :\nI. నాన్-మెకనైజ్డ్ బోట్లు కలిగి ఉన్న మత్స్యకారులకు పూర్తి స్థాయి సహకారం అందించడానికి భారత ప్రభుత్వం ‘పీఎం విశ్వకర్మ యోజన’ పథకాన్ని ప్రారంభించింది.\nII. ‘పీఎం విశ్వకర్మ యోజన’ పథకం ద్వారా లబ్ధిదారులకు రెండు విడతల్లో ₹ 6 లక్షల వరకు తాకట్టు లేకుండా ఎంటర్‌ప్రైజ్ డెవలప్‌మెంట్ రుణాలను అందిస్తుంది.',
    ['I only', 'II only', 'Both I and II', 'None of the above'],
    ['I మాత్రమే', 'II మాత్రమే', 'I మరియు II రెండూ', 'పైవేవీ కావు'],
    2,
    'Both statements are incorrect: PM Vishwakarma supports 18 traditional artisan and craftsperson trades (including boat makers, not fishermen operating boats), and offers collateral-free credit support up to ₹3 lakhs in two tranches (₹1 lakh + ₹2 lakhs), not ₹6 lakhs.',
    'ప్రకటనలు I మరియు II రెండూ సరికానివి: పీఎం విశ్వకర్మ 18 సంప్రదాయ చేతివృత్తుల కళాకారులకు ఉద్దేశించబడింది మరియు ₹3 లక్షల వరకు మాత్రమే రుణం అందిస్తుంది (₹6 లక్షలు కాదు).'
  ],
  [
    112, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'awards-appointments', 'Awards and Appointments',
    'Sahitya Akademi Awards 2023 (Telugu)',
    'Consider the following statements :\nI. Dr. Tallavajhala Patanjali Sastri was conferred with Sahitya Akademi Award 2023 in Telugu Language for his poetry and poetry collections.\nII. D.K. Chaduvula Babu was conferred with the Sahitya Akademi Bal Sahitya Puraskar 2023 in Telugu Language for his short stories ‘Vajrala Vaana’.\nIII. Johny Takkedasila was conferred with the Sahitya Akademi Yuva Puraskar 2023 in Telugu Language for his book ‘Devara Kotishu’.\nWhich of the above given statements are incorrect ?',
    'ఈ క్రింది ప్రకటనలను పరిగణించండి :\nI. డా. తల్లావఝుల పతంజలి శాస్త్రిని తన కవిత్వం కవితా సంకలన విభాగంలో తెలుగు భాషలో సాహిత్య అకాడమీ అవార్డు 2023తో సత్కరించారు.\nII. డి.కె. చదువుల బాబుని తన లఘు కథలు ‘వజ్రాల వాన’కి తెలుగు భాషలో సాహిత్య అకాడమీ బాల సాహిత్య పురస్కారం 2023తో సత్కరించారు.\nIII. జానీ తక్కెడశిలని తన ‘దేవర కోటిషు’ పుస్తకానికి తెలుగు భాషలో సాహిత్య అకాడమీ యువ పురస్కారం 2023తో సత్కరించారు.\nపైన ఇచ్చిన ప్రకటనలలో ఏవి సరికానివి ?',
    ['I and II only', 'II and III only', 'I and III only', 'All of the above'],
    ['I మరియు II మాత్రమే', 'II మరియు III మాత్రమే', 'I మరియు III మాత్రమే', 'పైవన్నీ'],
    2,
    'Statements I and III are incorrect: Tallavajhula Patanjali Sastri won Sahitya Akademi Award 2023 for his short-story collection “Rameswaram Kaakulu Marikonni Kathalu” (not poetry), and Johny Takkedasila won Yuva Puraskar 2023 for literary criticism “Vivechani” (not Devara Kotishu). Statement II is correct.',
    'పతంజలి శాస్త్రికి కథా సంకలనం "రామేశ్వరం కాకులు మరికొన్ని కథలు"కు, జానీ తక్కెడశిలకు విమర్శ గ్రంథం "వివేచని"కి అవార్డులు లభించాయి. కాబట్టి I మరియు III సరికానివి.'
  ],
  [
    113, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'sports-events', 'Sports Events',
    'International Sports & Awards 2023–24',
    "Identify the incorrect statements among the following :\nI. Man Singh is the second Indian to win a gold medal at the Asian Marathon Championships.\nII. Hardik Singh was named as Men's FIH Player of the Year at the International Hockey Federation Hockey Star Awards 2023.\nIII. Indian women’s hockey captain Sushila Chanu won the FIH ‘Best Goalkeeper of the Year Award’ at the International Hockey Federation Hockey Star Awards 2023.\nIV. Shubman Gill has been selected as ‘Emerging Player of the Year’ at International Cricket Council (ICC) Awards 2023.",
    'ఈ క్రింది వాటిలో తప్పు ప్రకటనలను గుర్తించండి :\nI. మాన్ సింగ్ ఆసియా మారథాన్ ఛాంపియన్ షిప్‌లో బంగారు పతకం సాధించిన రెండవ భారతీయుడు.\nII. ఇంటర్నేషనల్ హాకీ ఫెడరేషన్ ఎఫ్‌ఐహెచ్ హాకీ స్టార్ అవార్డ్స్ 2023లో హార్దిక్ సింగ్ పురుషుల విభాగంలో ప్లేయర్ ఆఫ్ ది ఇయర్‌గా ఎంపికయ్యాడు.\nIII. భారత మహిళా హాకీ కెప్టెన్ సుశీల చాను ఇంటర్నేషనల్ హాకీ ఫెడరేషన్ (ఎఫ్‌ఐహెచ్) హాకీ స్టార్ అవార్డ్స్ 2023లో ‘బెస్ట్ గోల్ కీపర్ ఆఫ్ ది ఇయర్’ అవార్డును గెలుచుకుంది.\nIV. అంతర్జాతీయ క్రికెట్ కౌన్సిల్ (ICC) అవార్డులు 2023లో శుభ్‌మన్ గిల్ ‘ఎమర్జింగ్ ప్లేయర్ ఆఫ్ ది ఇయర్’గా ఎంపికయ్యాడు.',
    ['I and III only', 'II and III only', 'III and IV only', 'I and IV only'],
    ['I మరియు III మాత్రమే', 'II మరియు III మాత్రమే', 'III మరియు IV మాత్రమే', 'I మరియు IV మాత్రమే'],
    2,
    'Statements III and IV are incorrect: Savita Punia (not Sushila Chanu) won FIH Women’s Goalkeeper of the Year 2023, and Rachin Ravindra (not Shubman Gill) won ICC Emerging Men’s Cricketer of the Year 2023.',
    'III మరియు IV తప్పు ప్రకటనలు: FIH ఉత్తమ గోల్‌కీపర్ అవార్డును సవితా పునియా గెలుచుకోగా, ICC ఎమర్జింగ్ ప్లేయర్ అవార్డును రచిన్ రవీంద్ర గెలుచుకున్నారు.'
  ],
  [
    114, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'economy-banking', 'Economy and Banking',
    'Mining & Resources in Andhra Pradesh',
    "In which part of Andhra Pradesh is India's first largest private gold mine located ?",
    'భారతదేశంలోని మొట్టమొదటి అతిపెద్ద ప్రైవేట్ బంగారు గని ఆంధ్రప్రదేశ్‌లోని ఏ ప్రాంతంలో ఉంది ?',
    [
      'Krishnagiri Mandal of Kurnool District',
      'Aspari Mandal of Kurnool District',
      'Tuggali Mandal of Kurnool District',
      'Rudravaram Mandal of Kurnool District'
    ],
    [
      'కర్నూలు జిల్లా కృష్ణగిరి మండలం',
      'కర్నూలు జిల్లా ఆస్పరి మండలం',
      'కర్నూలు జిల్లా తుగ్గలి మండలం',
      'కర్నూలు జిల్లా రుద్రవరం మండలం'
    ],
    2,
    'The Jonnagiri Gold Project—India’s first private-sector commercial gold mine—is situated in Tuggali Mandal of Kurnool district, Andhra Pradesh.',
    'దేశంలోనే మొదటి ప్రైవేట్ బంగారు గని (జొన్నగిరి బంగారు గని) కర్నూలు జిల్లా తుగ్గలి మండలంలో ఉంది.'
  ],
  [
    115, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'awards-appointments', 'Awards and Appointments',
    'Indira Gandhi Peace Prize 2023',
    'Consider the following statements about the Indira Gandhi Prize for Peace, Disarmament and Development for 2023 :\nI. Daniel Barenboim was announced as winner of the Indira Gandhi Prize 2023 for his efforts to solve economic crisis and his contribution in the development of Sri Lanka.\nII. Ali Abu Awwad was announced as winner of the Indira Gandhi Prize 2023 for his efforts towards a non-violent resolution of the Israel-Palestine conflict.\nIII. The International Jury of the Indira Gandhi Prize for Peace, Disarmament and Development for 2023 was chaired by former Chief Justice of India, R.M. Lodha.\nWhich among the above given statements are incorrect ?',
    'శాంతి, నిరాయుధీకరణ మరియు అభివృద్ధి కోసం కృషి చేసిన వారికి ఇచ్చే ఇందిరా గాంధీ బహుమతి 2023 గురించి క్రింది ప్రకటనలను పరిగణించండి :\nI. డేనియల్ బారెన్‌బోయిమ్‌ను శ్రీలంక యొక్క ఆర్థిక సంక్షోభాన్ని పరిష్కరించడానికి మరియు శ్రీలంక అభివృద్ధిలో ఆయన చేసిన కృషికి గాను ఇందిరా గాంధీ బహుమతి 2023 విజేతగా ప్రకటించారు.\nII. ఇజ్రాయెల్-పాలస్తీనా వివాదానికి అహింసా పరిష్కారం కోసం చేసిన కృషికి గాను అలీ అబూ అవ్వాద్‌ను ఇందిరా గాంధీ బహుమతి 2023 విజేతగా ప్రకటించారు.\nIII. శాంతి, నిరాయుధీకరణ మరియు అభివృద్ధి కోసం కృషి చేసిన వారికి ఇచ్చే ఇందిరా గాంధీ బహుమతి 2023 అంతర్జాతీయ జ్యూరీకి భారత మాజీ ప్రధాన న్యాయమూర్తి ఆర్.ఎం. లోధా అధ్యక్షత వహించడం జరిగింది.\nపైన ఇచ్చిన ప్రకటనలలో ఏవి తప్పు ?',
    ['I and II only', 'II and III only', 'I and III only', 'None of the above'],
    ['I మరియు II మాత్రమే', 'II మరియు III మాత్రమే', 'I మరియు III మాత్రమే', 'పైవేవీ కావు'],
    2,
    'Statements I and III are incorrect: conductor Daniel Barenboim jointly won with Ali Abu Awwad for bridging the Israel-Palestine divide through dialogue/music (not Sri Lanka’s economic crisis), and the 2023 jury was chaired by former CJI T.S. Thakur (not R.M. Lodha).',
    'I మరియు III తప్పు ప్రకటనలు: డేనియల్ బారెన్‌బోయిమ్ మరియు అలీ అబూ అవ్వాద్ ఇజ్రాయెల్-పాలస్తీనా శాంతి కోసం అవార్డు పొందారు, జ్యూరీకి మాజీ సీజేఐ టి.ఎస్. ఠాకూర్ అధ్యక్షత వహించారు.'
  ],
  [
    116, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'science-environment', 'Science and Environment',
    'Ecological & Biological Phenomena 2024',
    'Which among the following rare natural phenomenon is going to happen in 2024, after 221 years, in the United States of America ?',
    'అమెరికాలో 221 సంవత్సరాల తర్వాత 2024వ సంవత్సరంలో ఈ క్రింది వాటిలో ఏ అరుదైన సహజ దృగ్విషయం జరగబోతోంది ?',
    ['Fire Tornadoes', 'Glow Worm Caves', "New York's Ice Volcano", 'Double Cicada Explosion'],
    ['ఫైర్ టోర్నడోస్', 'గ్లో వార్మ్ కేవ్స్ (Glow Worm Caves)', 'న్యూయార్క్ యొక్క మంచు అగ్నిపర్వతం', 'డబుల్ సికాడా ఎక్స్‌ప్లోషన్'],
    3,
    'In 2024, the United States witnessed the rare simultaneous emergence (Double Cicada Explosion) of 13-year Brood XIX and 17-year Brood XIII periodical cicadas—occurring together for the first time since 1803 (after 221 years).',
    'అమెరికాలో 221 ఏళ్ల తర్వాత (1803 తర్వాత మొదటిసారి) 2024లో రెండు కీటక సమూహాలు ఒకేసారి బయటకు వచ్చే "డబుల్ సికాడా ఎక్స్‌ప్లోషన్" సంభవించింది.'
  ],
  [
    117, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'national-affairs', 'National Affairs',
    'Swachh Survekshan Awards 2023',
    'Which among the following are incorrectly paired with regard to Swachh Survekshan Awards 2023 ?\nI. Best SafaiMitra Surakshit Sheher : Prayagraj\nII. Cleanest Ganga Town rank 2 : Varanasi\nIII. Cleanest Cantonment Board : Mhow Cantonment Board\nIV. All India Cleanest City rank 3 : Navi Mumbai',
    'స్వచ్ఛ సర్వేక్షణ్ అవార్డ్స్ 2023 కి సంబంధించి ఈ క్రింది వాటిలో ఏవి తప్పుగా జత చేయబడినవి ?\nI. ఉత్తమ సఫాయిమిత్ర సురక్షిత్ పట్టణం : ప్రయాగ్‌రాజ్\nII. క్లీనెస్ట్ గంగా పట్టణం ర్యాంక్ 2 : వారణాసి\nIII. పరిశుభ్రమైన కంటోన్మెంట్ బోర్డు : మౌ కంటోన్మెంట్ బోర్డు\nIV. ఆల్ ఇండియా క్లీనెస్ట్ సిటీ ర్యాంక్ 3 : నవీ ముంబై',
    ['I and II only', 'II and III only', 'III and IV only', 'I and IV only'],
    ['I మరియు II మాత్రమే', 'II మరియు III మాత్రమే', 'III మరియు IV మాత్రమే', 'I మరియు IV మాత్రమే'],
    0,
    'Pairs I and II are incorrect: Chandigarh won Best SafaiMitra Surakshit Sheher (not Prayagraj), and Varanasi won Rank 1 Cleanest Ganga Town while Prayagraj ranked 2nd. Pairs III (Mhow) and IV (Navi Mumbai) are correct.',
    'I మరియు II తప్పుగా జతచేయబడ్డాయి: ఉత్తమ సఫాయిమిత్ర సురక్షిత్ నగరం చండీగఢ్; గంగా పట్టణాల్లో వారణాసి 1వ స్థానం, ప్రయాగ్‌రాజ్ 2వ స్థానం.'
  ],
  [
    118, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'economy-banking', 'Economy and Banking',
    'Reports & Indices (India Skills Report 2024)',
    'Consider the following statements with regard to India Skills Report 2024 :\nI. Maharashtra, Uttar Pradesh and Kerala are the top three states with the highest availability of talent with computer skills.\nII. Karnataka is the most preferred state to work for both male and female employable talent.\nIII. Telangana has the highest concentration of employable talent in the age group of 18 to 21 years.\nIV. Andhra Pradesh is one among the states with the largest concentration of highly employable resources.\nWhich of the above given statements are correct ?',
    'ఈ క్రింది వాటిలో ఇండియా స్కిల్స్ రిపోర్ట్ 2024 కు సంబంధించిన ప్రకటనలను పరిగణించండి :\nI. కంప్యూటర్ స్కిల్స్‌తో కూడిన ప్రతిభావంతులు అత్యధికంగా అందుబాటులో ఉన్న మొదటి మూడు రాష్ట్రాల్లో మహారాష్ట్ర, ఉత్తరప్రదేశ్ మరియు కేరళ ఉన్నాయి.\nII. మగ మరియు స్త్రీ ఉపాధి యోగ్యమైన ప్రతిభావంతులు పని చేయడానికి అత్యంత ఇష్టపడే రాష్ట్రం కర్ణాటక.\nIII. తెలంగాణలో 18 నుంచి 21 ఏళ్ల మధ్య వయస్సు ఉన్న ఉపాధి యోగ్యమైన ప్రతిభావంతులు అత్యధికంగా ఉన్నారు.\nIV. అత్యధిక ఉపాధి యోగ్యమైన ప్రతిభావంతులను కలిగి ఉన్న రాష్ట్రాల్లో ఆంధ్రప్రదేశ్ ఒకటి.\nపైన పేర్కొన్న ప్రకటనలలో ఏవి సరైనవి ?',
    ['I, II and IV only', 'II, III and IV only', 'I, III and IV only', 'All of the above'],
    ['I, II మరియు IV మాత్రమే', 'II, III మరియు IV మాత్రమే', 'I, III మరియు IV మాత్రమే', 'పైవన్నీ'],
    2,
    'Statements I, III, and IV are correct as per Wheebox India Skills Report 2024. Statement II is incorrect because Kerala (not Karnataka) emerged as the most preferred state to work for both male and female employable talent.',
    'ఇండియా స్కిల్స్ రిపోర్ట్ 2024 ప్రకారం I, III, IV సరైనవి. మగ మరియు మహిళా అభ్యర్థులు ఇద్దరూ పని చేయడానికి అత్యధికంగా ఇష్టపడే రాష్ట్రం కేరళ (కర్ణాటక కాదు).'
  ],
  [
    119, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'awards-appointments', 'Awards and Appointments',
    'Global Elections & Heads of State',
    'Pick out the odd pairs with regard to newly elected Presidents of that respective country :\nI. Fernando Pérez Molina : Guatemala\nII. Abdel Fattah El-Sisi : Egypt\nIII. Felix Tshisekedi : Democratic Republic of the Congo\nIV. Sierra Leone : Liberia',
    'ఈ క్రింది వాటిలో కొత్తగా ఎన్నుకోబడిన ఆ దేశ అధ్యక్షుడికి సంబంధించి సరికాని జతలను గుర్తించండి :\nI. ఫెర్నాండో పెరెజ్ మోలీనా : గ్వాటెమాల\nII. అబ్దెల్ ఫత్తా ఎల్-సిసి : ఈజిప్ట్\nIII. ఫెలిక్స్ షిసెకెడి : డెమోక్రాటిక్ రిపబ్లిక్ ఆఫ్ కాంగో\nIV. సియెర్రా లియోన్ : లైబీరియా',
    ['I and II only', 'II and III only', 'I and III only', 'I and IV only'],
    ['I మరియు II మాత్రమే', 'II మరియు III మాత్రమే', 'I మరియు III మాత్రమే', 'I మరియు IV మాత్రమే'],
    3,
    'Pairs I and IV are incorrect/odd: Bernardo Arévalo (not Fernando Pérez Molina) was newly elected President of Guatemala, and “Sierra Leone : Liberia” lists two countries rather than a President and country. Pairs II (Sisi – Egypt) and III (Tshisekedi – DRC) are correct.',
    'I మరియు IV తప్పు జతలు: గ్వాటెమాలా అధ్యక్షుడిగా బెర్నార్డో అరెవాలో ఎన్నికయ్యారు; అలాగే సియెర్రా లియోన్ మరియు లైబీరియా రెండు దేశాల పేర్లు.'
  ],
  [
    120, 4, 'Current Affairs', 'Current Affairs', 'current-affairs', 'ca', 'international-summits', 'International Summits',
    'South Asia Social & Legal Milestones',
    'Which is the first South Asian Nation to formally register same sex marriage ?',
    'స్వలింగ వివాహాన్ని అధికారికంగా నమోదు చేసిన మొదటి దక్షిణాసియా దేశం ఏది ?',
    ['India', 'Nepal', 'Maldives', 'Bhutan'],
    ['భారతదేశం', 'నేపాల్', 'మాల్దీవులు', 'భూటాన్'],
    1,
    'In November 2023, Nepal became the first South Asian country to formally register a same-sex marriage following a Supreme Court interim directive.',
    '2023 నవంబర్‌లో స్వలింగ వివాహాన్ని అధికారికంగా నమోదు చేసిన మొదటి దక్షిణాసియా దేశంగా "నేపాల్" నిలిచింది.'
  ],

  // ================= SECTION E: MENTAL ABILITY (Q121–Q150) — REASONING & QUANT =================
  [
    121, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'alphabet-series', 'Alphabet Series',
    'Alphanumeric Symbol Series',
    'Study the following arrangement carefully :\nDE*9E$P#6+U0$H1A2D&#AS2ΩA3DS9ALM#\nWhat should be in the place of question mark (?) in the following sequence based on the above arrangement ?\nDE*   9$P   60$   A#A   ?',
    'ఈ క్రింది ఏర్పాటును జాగ్రత్తగా అధ్యయనం చేయండి :\nDE*9E$P#6+U0$H1A2D&#AS2ΩA3DS9ALM#\nపై అమరిక ఆధారంగా క్రింది క్రమంలోని ప్రశ్నార్థక గుర్తు (?) స్థానంలో ఏమి ఉండాలి ?\nDE*   9$P   60$   A#A   ?',
    ['A9A', 'AAL', 'AS9', 'ALA'],
    ['A9A', 'AAL', 'AS9', 'ALA'],
    1,
    'Between consecutive groups, the number of skipped characters increases by 1 (0, 1, 2, 3 skipped -> 4th group A#A ends at second A, skip S, 2, Ω -> next group starts at A). Inside each triplet [first, second, third], 0, 1, 2, 3, 4 characters are skipped between the 1st and 2nd elements, while the 3rd element immediately follows the 2nd. Starting at A, skipping 3, D, S, 9 gives A and L -> AAL.',
    'ప్రతి సమూహం మధ్య వదిలివేసే అక్షరాల సంఖ్య 0, 1, 2, 3 వరుసగా పెరుగుతుంది. సమూహంలోని మొదటి రెండు అక్షరాల మధ్య 0, 1, 2, 3, 4 అక్షరాలు వదిలి చివరి రెండు పక్కపక్కన ఉన్న అక్షరాలు తీసుకుంటే AAL వస్తుంది.'
  ],
  [
    122, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'coding-decoding', 'Coding and Decoding',
    'Letter-to-Number Positional Sum Coding',
    "Rajesh codes the alphabets as numbers such as a=1, b=2, c=3 and so on. Then what is the value that Rajesh gets by adding all the letters (according to the code given to that letter) in the word ‘pneumonoultramicroscopicsilicovolcanoconiosis’ ?",
    'రాజేష్ వర్ణమాలలోని అక్షరాలను a=1, b=2, c=3 మొదలైన సంఖ్యలుగా కోడ్ చేసాడు, అప్పుడు ‘pneumonoultramicroscopicsilicovolcanoconiosis’ అనే పదంలోని అన్ని అక్షరాలను జోడించడం ద్వారా (ఆ అక్షరానికి ఇచ్చిన కోడ్ ప్రకారం) రాజేష్ పొందిన విలువ ఎంత?',
    ['524', '536', '548', '560'],
    ['524', '536', '548', '560'],
    3,
    'Summing standard A=1..Z=26 values across all 45 letters of pneumonoultramicroscopicsilicovolcanoconiosis: p(16)+n(14)+e(5)+u(21)+m(13)+o(15)+n(14)+o(15)+u(21)+l(12)+t(20)+r(18)+a(1)+m(13)+i(9)+c(3)+r(18)+o(15)+s(19)+c(3)+o(15)+p(16)+i(9)+c(3)+s(19)+i(9)+l(12)+i(9)+c(3)+o(15)+v(22)+o(15)+l(12)+c(3)+a(1)+n(14)+o(15)+c(3)+o(15)+n(14)+i(9)+o(15)+s(19)+i(9)+s(19) = 560.',
    'pneumonoultramicroscopicsilicovolcanoconiosis లోని మొత్తం 45 అక్షరాల స్థానిక విలువలను (a=1..z=26) కూడగా 560 వస్తుంది.'
  ],
  [
    123, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'puzzles', 'Puzzles',
    'Team Selection & Constraint Puzzle',
    'Study the given information and answer the following question:\nYSR Kadapa team has to play cricket matches with Visakhapatnam team as a part of ‘Aadudam Andhra’. Each team must have 5 players chosen from:\nA (Batsman, ₹5,000), B (Batsman, ₹5,500), C (Batsman/Part-time WK, ₹6,500), D (Specialist WK, ₹5,500), E (Spin Bowler, ₹5,000), F (Fast Bowler, ₹6,000), G (Spin Bowler, ₹5,500), H (Fast Bowler, ₹5,500).\nConditions:\n1. B and C cannot be selected together.\n2. Wicketkeeper is a must.\n3. E and G cannot be selected together.\n4. Only two from E, F, G, H are selected.\n5. If A is selected, H must be selected.\n6. At least two batsmen and two bowlers must be in the team.\n7. C counts as both batsman and wicketkeeper.\n\nYSR Kadapa team decides to compose the team with one fast bowler and one spinner and has a budget of only ₹ 26,500 to form a team. Then who among the following is not a member of that team satisfying all the conditions ?',
    'ఇచ్చిన సమాచారం ప్రకారం వైఎస్ఆర్ కడప జట్టు 5 మంది ఆటగాళ్లను (A బ్యాట్స్‌మన్ ₹5,000, B బ్యాట్స్‌మన్ ₹5,500, C బ్యాట్స్‌మన్/వికెట్ కీపర్ ₹6,500, D స్పెషలిస్ట్ వికెట్ కీపర్ ₹5,500, E స్పిన్నర్ ₹5,000, F ఫాస్ట్ బౌలర్ ₹6,000, G స్పిన్నర్ ₹5,500, H ఫాస్ట్ బౌలర్ ₹5,500) షరతుల ప్రకారం ఎంచుకోవాలి: (1) B, C కలిసి ఉండరాదు (2) వికెట్ కీపర్ తప్పనిసరి (3) E, G కలిసి ఉండరాదు (4) బౌలర్లలో ఇద్దరు మాత్రమే (5) A ఉంటే H ఉండాలి (6) కనీసం ఇద్దరు బ్యాట్స్‌మెన్, ఇద్దరు బౌలర్లు (7) C బ్యాట్స్‌మన్ మరియు వికెట్ కీపర్.\n\nవైఎస్ఆర్ కడప జట్టు ఒక ఫాస్ట్ బౌలర్ మరియు ఒక స్పిన్నర్‌తో జట్టును ఏర్పాటు చేయాలని నిర్ణయించుకుంది మరియు జట్టును ఏర్పాటు చేయడానికి కేవలం ₹ 26,500 బడ్జెట్ మాత్రమే ఉంది. అప్పుడు అన్ని షరతులను సంతృప్తిపరిచిన యెడల ఈ క్రింది వారిలో ఎవరు ఆ బృందంలో సభ్యుడు కాదు ?',
    ['A', 'E', 'H', 'G'],
    ['A', 'E', 'H', 'G'],
    3,
    'The unique valid 5-player team costing ₹26,500 is {A (5,000), B (5,500), D (5,500), E (5,000), H (5,500)} = ₹26,500 (satisfies 2 batsmen A,B; WK D; 1 spinner E + 1 pacer H; A with H). Hence G is not a member.',
    '₹26,500 బడ్జెట్‌తో అన్ని నియమాలను సంతృప్తిపరిచే ఏకైక జట్టు {A, B, D, E, H} = ₹26,500. కాబట్టి G ఆ జట్టులో సభ్యుడు కాదు.'
  ],
  [
    124, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'puzzles', 'Puzzles',
    'Team Selection & Constraint Puzzle',
    'Based on the 8-player cricket selection table (A ₹5,000 Bat; B ₹5,500 Bat; C ₹6,500 Bat/WK; D ₹5,500 WK; E ₹5,000 Spin; F ₹6,000 Fast; G ₹5,500 Spin; H ₹5,500 Fast) and all 7 selection conditions:\nIf it is known that the stadium is favourable to spin bowling and YSR Kadapa team decided to select C and G compulsorily in the team, then what is the total amount spent by the team on selected players satisfying all the conditions ?',
    'పై 8 మంది ఆటగాళ్ల క్రికెట్ ఎంపిక నియమాల ఆధారంగా:\nస్పిన్ బౌలింగ్‌కు స్టేడియం అనుకూలమని తెలిసి వైఎస్ఆర్ కడప టీమ్ C మరియు G ని తప్పకుండా ఎంపిక చేయాలని నిర్ణయించింది, అప్పుడు అన్ని షరతులను వర్తింపజేసి ఎంపిక చేసిన ఆటగాళ్లకు జట్టు ఖర్చు చేసిన మొత్తం ఎంత ?',
    ['₹ 27,000', '₹ 27,500', '₹ 28,000', '₹ 28,500'],
    ['₹ 27,000', '₹ 27,500', '₹ 28,000', '₹ 28,500'],
    2,
    'With C (6,500) and G (5,500) compulsory: B and E are excluded. We need 1 more batsman (so A = 5,000 must be included, which forces H = 5,500 as the 2nd bowler) and the 5th slot goes to D (5,500) since only 2 bowlers are permitted. Team {A, C, D, G, H} = 5000 + 6500 + 5500 + 5500 + 5500 = ₹28,000.',
    'C మరియు G తప్పనిసరి అయితే B, E రాకూడదు; ఇద్దరు బ్యాట్స్‌మెన్ కోసం A ఉండాలి, తద్వారా H తప్పనిసరి. 5వ స్థానం Dకి వెళ్తుంది. జట్టు {A, C, D, G, H} మొత్తం ఖర్చు = ₹28,000.'
  ],
  [
    125, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'puzzles', 'Puzzles',
    'Team Selection & Constraint Puzzle',
    'Based on the 8-player cricket selection table (A ₹5,000 Bat; B ₹5,500 Bat; C ₹6,500 Bat/WK; D ₹5,500 WK; E ₹5,000 Spin; F ₹6,000 Fast; G ₹5,500 Spin; H ₹5,500 Fast) and all 7 selection conditions:\nIf it is known that the stadium is favourable to fast bowling and YSR Kadapa team decided to compose the team with two fast bowlers, then what would be the least amount that can be spent to form a team satisfying all the conditions ?',
    'పై 8 మంది ఆటగాళ్ల క్రికెట్ ఎంపిక నియమాల ఆధారంగా:\nస్టేడియం ఫాస్ట్ బౌలింగ్‌కు అనుకూలంగా ఉందని తెలిసి వైఎస్ఆర్ కడప జట్టు ఇద్దరు ఫాస్ట్ బౌలర్లతో జట్టును ఏర్పాటు చేయాలని నిర్ణయించింది, అప్పుడు అన్ని షరతులను సంతృప్తిపరిచి జట్టును ఏర్పాటు చేయడానికి ఖర్చు చేయగల తక్కువ మొత్తం ఎంత ?',
    ['₹ 26,500', '₹ 27,000', '₹ 27,500', '₹ 28,000'],
    ['₹ 26,500', '₹ 27,000', '₹ 27,500', '₹ 28,000'],
    2,
    'Two fast bowlers forces F (6,000) and H (5,500). Remaining 3 slots must come from {A, B, C, D} with a wicketkeeper and at least 2 batsmen. Cheapest valid combination: {A (5,000), B (5,500), D (5,500), F (6,000), H (5,500)} = ₹27,500.',
    'ఇద్దరు ఫాస్ట్ బౌలర్లు F (₹6,000), H (₹5,500) తప్పనిసరి. మిగిలిన ముగ్గురిలో తక్కువ ఖర్చుతో కూడిన జట్టు {A, B, D, F, H} = ₹27,500.'
  ],
  [
    126, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'direction-sense', 'Direction Sense',
    'Coded Direction Sense & Pythagoras',
    'Read the following instructions :\nA$D means ‘A is to the North of D’\nA&D means ‘A is to the East of D’\nA*D means ‘D is to the West of A’\nA%D means ‘D is to the South of A’\nA@DR means ‘A stands exactly in the middle of the horizontal line of DR’\nA!DR means ‘A stands exactly in the middle of the vertical line of DR’\nIt should be noted that ‘A6m$D’ means ‘A is 6 meters to the north of D’ and so on.\nFind the shortest distance between S and T in the following expression :\n‘B12m$S5m*R3m&J6m%K!JT’',
    'ఈ క్రింది సూచనలను చదవండి :\nA$D అంటే ‘A అనేది Dకి ఉత్తరాన ఉంది’\nA&D అంటే ‘A అనేది D కి తూర్పున ఉంది’\nA*D అంటే ‘D అనేది A కి పశ్చిమాన ఉంది’\nA%D అంటే ‘D అనేది A కి దక్షిణాన ఉంది’\nA@DR అంటే ‘A ఖచ్చితంగా DR యొక్క సమాంతర రేఖ మధ్యలో ఉంటుంది’\nA!DR అంటే ‘A ఖచ్చితంగా DR యొక్క నిలువు రేఖ మధ్యలో ఉంటుంది’\n‘A6m$D’ అంటే ‘A అనేది Dకి ఉత్తరంగా 6 మీటర్లు దూరం లో ఉంది’ అని అర్థం చేసుకోవాలి.\nఈ క్రింది వ్యక్తీకరణలో S మరియు T ల మధ్య తక్కువ దూరాన్ని కనుగొనండి :\n‘B12m$S5m*R3m&J6m%K!JT’',
    ['4√13 m', '10.23 m', '2√13 m', '3√13 m'],
    ['4√13 మీ', '10.23 మీ', '2√13 మీ', '3√13 మీ'],
    0,
    'Place J at (0, 0). R3m&J => R is 3m East of J = (3, 0). S5m*R => R is 5m West of S, so S is 5m East of R = (8, 0). J6m%K => K is 6m South of J = (0, -6). K!JT => K is midpoint of vertical segment JT, so T = (0, -12). Shortest distance ST = √(8² + 12²) = √208 = 4√13 m.',
    'J(0,0) వద్ద తీసుకుంటే R=(3,0), S=(8,0), K=(0,-6) మరియు K!JT ప్రకారం T=(0,-12) అవుతాయి. S మరియు T మధ్య కనిష్ట దూరం = √(8² + 12²) = √208 = 4√13 మీ.'
  ],
  [
    127, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'puzzles', 'Puzzles',
    'Calendar & Leap Year Cycle',
    'Ramana was born on 29th February, 2016 which happened to be a Monday. If he lives till 2099, how many birthdays would he celebrate on a Monday ?',
    'రమణ ఫిబ్రవరి 29, 2016న జన్మించాడు, అది సోమవారం. అతను 2099 వరకు జీవించి ఉంటే, అతను సోమవారం రోజున ఎన్ని పుట్టినరోజులు జరుపుకుంటాడు ?',
    ['2', '7', '4', '3'],
    ['2', '7', '4', '3'],
    0,
    'A Feb 29 date repeats its exact day of the week every 28 years within a non-century span (140 years / 7). Starting from Monday 29 Feb 2016, the subsequent Feb 29 Mondays before 2099 occur in 2044 (2016+28) and 2072 (2044+28) — giving 2 birthdays on a Monday.',
    '29 ఫిబ్రవరి 2016 (సోమవారం) తర్వాత శతాబ్దపు మినహాయింపు లేకుండా ప్రతి 28 సంవత్సరాలకు అదే రోజు వస్తుంది: 2044 మరియు 2072 లలో మాత్రమే సోమవారం వస్తుంది. కాబట్టి 2 పుట్టినరోజులు జరుపుకుంటాడు.'
  ],
  [
    128, 5, 'Mental Ability', 'Quantitative Aptitude', 'quantitative-aptitude', 'quant', 'time-speed-distance', 'Time, Speed and Distance',
    'Relative Speed & Meeting Point',
    'The speeds of Rohit and Lalith are 30 km/h and 40 km/h. Initially, Lalith is at place X and Rohit is at place Y. The distance between X and Y is 650 kms. Rohit started his journey 3 hours earlier than Lalith to meet him. If they both meet each other at a place Z somewhere between X and Y and the distance between Y and Z is P, then what is the value of P ÷ 2 ?',
    'రోహిత్ మరియు లలిత్ వేగం గంటకు 30 కి.మీ మరియు 40 కి.మీ/గం. ప్రారంభంలో లలిత్ X స్థానంలో మరియు రోహిత్ Y స్థానంలో ఉన్నారు. X మరియు Y మధ్య దూరం 650 కి.మీ. ఒకరినొకరు కలవడానికి లలిత్ కంటే 3 గంటల ముందుగానే రోహిత్ తన ప్రయాణాన్ని ప్రారంభించాడు. X మరియు Y మధ్య ఉన్న Z స్థలంలో వారిద్దరూ ఒకరినొకరు కలుసుకుంటే Y మరియు Z మధ్య దూరం P అయితే, P ÷ 2 విలువ ఎంత ?',
    ['330', '125', '220', '165'],
    ['330', '125', '220', '165'],
    3,
    'In the first 3 hours, Rohit covers 30 × 3 = 90 km. Remaining distance = 650 − 90 = 560 km. Combined relative speed = 30 + 40 = 70 km/h, so they meet after 560 ÷ 70 = 8 hours. Total distance travelled by Rohit from Y to Z = P = 30 × (3 + 8) = 330 km. Therefore P ÷ 2 = 330 ÷ 2 = 165.',
    'రోహిత్ ముందుగా 3 గంటల్లో 90 కి.మీ ప్రయాణిస్తాడు. మిగిలిన 560 కి.మీ దూరాన్ని ఇద్దరూ కలిసి (30+40=70 కి.మీ/గం) 8 గంటల్లో చేరుకుంటారు. మొత్తం రోహిత్ ప్రయాణించిన దూరం P = 30 × (3+8) = 330 కి.మీ, కాబట్టి P ÷ 2 = 165.'
  ],
  [
    129, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'coding-decoding', 'Coding and Decoding',
    'Letter-Pair Neighbour Substitution Coding',
    'If in a certain code language ‘CONSERVE’ is written as ‘BDNPMORTDFQSUWDF’, then how will ‘NUMEROUS’ be written in that code ?',
    'ఒక నిర్దిష్ట కోడ్ భాషలో ‘CONSERVE’ని ‘BDNPMORTDFQSUWDF’ అని వ్రాస్తారు, అదే కోడ్ భాషలో ‘NUMEROUS’ ఎలా వ్రాయబడుతుంది ?',
    [
      'MOTVLNEFQSNPTVRT',
      'MOTVLNFFQSOPTVRT',
      'MOTVLNDFQSNPTVRT',
      'MOTVLKDFQSNPTVRT'
    ],
    [
      'MOTVLNEFQSNPTVRT',
      'MOTVLNFFQSOPTVRT',
      'MOTVLNDFQSNPTVRT',
      'MOTVLKDFQSNPTVRT'
    ],
    2,
    'Each letter is encoded by its preceding and succeeding alphabet letters: C->BD, O->NP, N->MO, S->RT, E->DF, R->QS, V->UW, E->DF. Applying to NUMEROUS: N->MO, U->TV, M->LN, E->DF, R->QS, O->NP, U->TV, S->RT => MOTVLNDFQSNPTVRT.',
    'ప్రతి అక్షరాన్ని దాని ముందు మరియు వెనుక అక్షరాలతో కోడ్ చేశారు (C→BD, O→NP ...). దీని ప్రకారం NUMEROUS → MOTVLNDFQSNPTVRT అవుతుంది.'
  ],
  [
    130, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'puzzles', 'Puzzles',
    'Time Zone & Clock Reasoning',
    'R and S are friends. R lives in USA and S lives in India. One day R asked S that ‘if the time now in USA is T hours, then what is the time now in India’ and S replied that ‘India is 9 hours 30 minutes ahead of USA’. Then what time will it be 18 hours from now in India, if in the USA it is 4:15 AM ?',
    'R మరియు S ఇద్దరు స్నేహితులు. R USAలో మరియు S భారతదేశంలో నివసిస్తున్నారు. ఒకరోజు R Sని ‘USAలో ఇప్పుడు టైం T గంటలు మరి ఇండియాలో ఇప్పుడు టైం ఎంత’ అని అడగ్గా, ‘భారతదేశం USA కంటే 9 గంటల 30 నిమిషాల ముందుంది’ అని S సమాధానం ఇచ్చాడు. USAలో ఉదయం 4:15 అయితే ఇప్పటి నుండి 18 గంటల తరువాత ఇండియాలో సమయం ఎంత ?',
    [
      '1:45 in the afternoon',
      '7:45 in the evening',
      '1:45 the next morning',
      '7:45 the next morning'
    ],
    [
      'మధ్యాహ్నం 1:45',
      'సాయంత్రం 7:45',
      'మరుసటి ఉదయం 1:45',
      'మరుసటి ఉదయం 7:45'
    ],
    3,
    'Current time in India = 4:15 AM + 9h 30m = 1:45 PM. Adding 18 hours: 1:45 PM + 18 hours = 7:45 AM the next morning.',
    'USAలో 4:15 AM అయితే భారతదేశంలో ప్రస్తుత సమయం = 4:15 AM + 9 గం. 30 ని. = మధ్యాహ్నం 1:45 PM. దీనికి 18 గంటలు కలిపితే మరుసటి రోజు ఉదయం 7:45 అవుతుంది.'
  ],
  [
    131, 5, 'Mental Ability', 'Quantitative Aptitude', 'quantitative-aptitude', 'quant', 'algebra', 'Algebra',
    'Linear Equations (Heads & Legs)',
    'In the month of January, the students of Chaitanya Bharathi Public School visited M/s Swaminathan Farm, where they saw rabbits and pigeons. One student started counting. If the heads are counted, there are 340 heads and if legs are counted there are 1060 legs. He also observed that 3 pigeons (out of the total pigeons present there) were dead. Then how many live pigeons are there on that farm ?',
    'జనవరి నెలలో చైతన్య భారతి పబ్లిక్ స్కూల్ విద్యార్థులు M/s స్వామినాథన్ ఫారమ్ ను సందర్శించారు, అక్కడ వారు కుందేళ్ళను మరియు పావురాలను చూసారు. ఒక విద్యార్థి అక్కడున్న కుందేళ్ళు మరియు పావురాల తలలు, కాళ్ళు లెక్కించడం ప్రారంభించాడు. తలలు లెక్కిస్తే 340 తలలు, కాళ్ళు లెక్కపెడితే 1060 కాళ్ళు ఉన్నాయని గుర్తించాడు. అతను 3 పావురాలు (అక్కడ ఉన్న మొత్తం పావురాల్లో) చనిపోయాయని కూడా గమనించాడు. అప్పుడు ఎన్ని సజీవ పావురాలు ఉన్నాయి ?',
    ['177', '167', '157', '147'],
    ['177', '167', '157', '147'],
    3,
    'Let rabbits = R, total pigeons = P. R + P = 340 and 4R + 2P = 1060 => 2R + P = 530 => R = 190, total pigeons P = 150. Since 3 pigeons were dead, live pigeons = 150 − 3 = 147.',
    'కుందేళ్లు R, మొత్తం పావురాలు P అయితే R + P = 340 మరియు 4R + 2P = 1060. దీని నుండి R = 190, మొత్తం పావురాలు P = 150. 3 పావురాలు చనిపోయాయి కాబట్టి సజీవ పావురాలు = 150 - 3 = 147.'
  ],
  [
    132, 5, 'Mental Ability', 'Quantitative Aptitude', 'quantitative-aptitude', 'quant', 'ratio-proportion', 'Ratio and Proportion',
    'Problems Based on Ages',
    "The sum of the present ages of Ramu and his son Jagadeesh is 60 years. Six years ago, Ramu's age was five times the age of Jagadeesh. After 6 years, Jagadeesh's age will be :",
    'రాము మరియు అతని కుమారుడు జగదీష్‌ల ప్రస్తుత వయస్సుల మొత్తం 60 సంవత్సరాలు. ఆరేళ్ల క్రితం రాము వయసు జగదీష్ వయసు కంటే ఐదు రెట్లు ఎక్కువ. 6 సంవత్సరాల తర్వాత జగదీష్ వయస్సు ఎంత ఉంటుంది :',
    ['12 years', '14 years', '16 years', '20 years'],
    ['12 సంవత్సరాలు', '14 సంవత్సరాలు', '16 సంవత్సరాలు', '20 సంవత్సరాలు'],
    3,
    'Sum of ages 6 years ago = 60 − 12 = 48 years. Ratio 6 years ago was 5 : 1, so Jagadeesh’s age 6 years ago = 48 ÷ 6 = 8 years. Present age of Jagadeesh = 8 + 6 = 14 years. After 6 years, Jagadeesh will be 14 + 6 = 20 years old.',
    '6 సంవత్సరాల క్రితం వారి వయసుల మొత్తం = 60 - 12 = 48, నిష్పత్తి 5:1. అప్పుడు జగదీష్ వయసు = 8 ఏళ్లు. ప్రస్తుత వయసు 14 ఏళ్లు; 6 ఏళ్ల తర్వాత = 20 సంవత్సరాలు.'
  ],
  [
    133, 5, 'Mental Ability', 'Quantitative Aptitude', 'quantitative-aptitude', 'quant', 'number-system', 'Number System',
    'Divisibility & Multiplication Digits',
    'If 2×4×6×8×10×12×14×16×18 = 18579XYZ0, what is the value of X + Y + Z ?',
    '2×4×6×8×10×12×14×16×18 = 18579XYZ0 అయితే X + Y + Z విలువ ఎంత ?',
    ['12', '13', '14', '15'],
    ['12', '13', '14', '15'],
    3,
    '2×4×6×8×10×12×14×16×18 = 2⁹ × 9! = 512 × 362880 = 185,794,560. Hence X = 4, Y = 5, Z = 6, so X + Y + Z = 4 + 5 + 6 = 15.',
    '2×4×6×8×10×12×14×16×18 = 185794560. దీని ప్రకారం X=4, Y=5, Z=6 కావున X + Y + Z = 4 + 5 + 6 = 15.'
  ],
  [
    134, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'direction-sense', 'Direction Sense',
    'Coordinate Path & Shortest Distance',
    'Study the following directions for question nos. 134 and 135:\nOn the occasion of unveiling of Statue of Social Justice, the Government of Andhra Pradesh had set up exhibition and stalls at PWD grounds, Vijayawada. Raghu went to the exhibition to visit 8 stalls, Stall-1, Stall-2, Stall-3, Stall-4, Stall-5, Stall-6, Stall-7, Stall-8, but not necessarily in the same order. He started from Stall-1 and walked towards Stall-3 which is at distance of 24 m towards East. He then turned left and walked 16 m to reach Stall-5. Then he walked 57 m Southwest to visit Stall-2, which is towards the South of Stall-1, crossing the path which goes through the midpoint of the line joining Stall-1 and Stall-3. After visiting Stall-2, he walked 40 m in the East direction and reached Stall-7. He then walked 50 m left to reach Stall-8 and then 16 m right to reach Stall-4 and to reach the last stall, he walked 35 m towards the right.\n\nWhat is the shortest distance between Stall-3 and Stall-6 ?',
    'విజయవాడ పిడబ్ల్యుడి గ్రౌండ్స్‌లో 8 స్టాళ్లను రఘు సందర్శించాడు: స్టాల్-1 నుండి తూర్పుకు 24 మీ దూరంలోని స్టాల్-3కి, అక్కడి నుండి ఎడమకు 16 మీ నడిచి స్టాల్-5కి, అక్కడి నుండి స్టాల్-1, స్టాల్-3 ల మధ్య బిందువు ద్వారా స్టాల్-1 కి దక్షిణంగా ఉన్న స్టాల్-2కి 57 మీ నైరుతిలో నడిచాడు. అటుపై తూర్పుకు 40 మీ నడిచి స్టాల్-7కి, ఎడమకు 50 మీ నడిచి స్టాల్-8కి, కుడికి 16 మీ నడిచి స్టాల్-4కి, మళ్ళీ కుడికి 35 మీ నడిచి చివరి స్టాల్ (స్టాల్-6)కి చేరుకున్నాడు.\n\nస్టాల్-3 మరియు స్టాల్-6 మధ్య కనిష్ట దూరం ఎంత ?',
    ['6√87 m', '4√89 m', '4√77 m', '8√24 m'],
    ['6√87 మీ', '4√89 మీ', '4√77 మీ', '8√24 మీ'],
    1,
    'Place Stall-1 at (0, 0). Stall-3 = (24, 0), Stall-5 = (24, 16). Midpoint of S1-S3 is M(12, 0). Distance S5 to M = √(12²+16²) = 20 m, leaving 57 − 20 = 37 m from M to Stall-2 due South of S1 => √(12² + y²) = 37 => y = 35 m, so Stall-2 = (0, -35). Then Stall-7 = (40, -35), Stall-8 = (40, 15), Stall-4 = (56, 15), Stall-6 = (56, -20). Distance from Stall-3(24, 0) to Stall-6(56, -20) = √((56−24)² + (−20−0)²) = √(32² + 20²) = √1424 = 4√89 m.',
    'స్టాల్-1 = (0,0), స్టాల్-3 = (24,0), స్టాల్-5 = (24,16). మధ్య బిందువు (12,0) నుండి 37 మీ దూరంలో దక్షిణాన స్టాల్-2 = (0,-35). అటుపై స్టాల్-7(40,-35), స్టాల్-8(40,15), స్టాల్-4(56,15), స్టాల్-6(56,-20). స్టాల్-3 నుండి స్టాల్-6 దూరం = √(32² + 20²) = √1424 = 4√89 మీ.'
  ],
  [
    135, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'direction-sense', 'Direction Sense',
    'Coordinate Path & Relative Direction',
    'Based on the exhibition stalls path (Stall-1 to Stall-3 24 m East -> 16 m left to Stall-5 -> 57 m SW crossing S1-S3 midpoint to Stall-2 South of Stall-1 -> 40 m East to Stall-7 -> 50 m left to Stall-8 -> 16 m right to Stall-4 -> 35 m right to Stall-6):\nWhat is the direction of Stall-1 with respect to Stall-2 and the shortest distance between them ?',
    'పై ఎగ్జిబిషన్ స్టాళ్ల సమాచారం ఆధారంగా:\nస్టాల్-2కి సంబంధించి స్టాల్-1 ఏ దిశలో ఉంది మరియు వాటి మధ్య అతి తక్కువ దూరం ఎంత ?',
    ['North-East, 7√10 m', 'North-West, 7√10 m', 'North, 35 m', 'North, 39 m'],
    ['ఈశాన్యం, 7√10 మీ', 'వాయువ్యం, 7√10 మీ', 'ఉత్తరం, 35 మీ', 'ఉత్తరం, 39 మీ'],
    2,
    'From the path calculations, Stall-5 (24, 16) -> midpoint (12, 0) = 20 m; remaining 57 − 20 = 37 m from (12, 0) to Stall-2 on x = 0 south of Stall-1 gives y = −√(37² − 12²) = −35 m. Therefore Stall-1 (0, 0) is 35 m due North of Stall-2 (0, -35).',
    'స్టాల్-2 అనేది స్టాల్-1కి దక్షిణంగా 35 మీటర్ల దూరంలో ఉంది. కాబట్టి స్టాల్-2 నుండి చూస్తే స్టాల్-1 ఉత్తరం దిశలో 35 మీటర్ల దూరంలో ఉంది.'
  ],
  [
    136, 5, 'Mental Ability', 'Quantitative Aptitude', 'quantitative-aptitude', 'quant', 'number-system', 'Number System',
    'Cryptarithmetic & Digit Reconstruction',
    'If AB × DED = AB AB,\nAB × DEDED = AB AB AB,\nABC × DEED = ABC ABC, and\nDED + DEDED + DEED = DDFEG,\nwhere A, B, C, D, E, F and G are different digits, what is the value of F × G ?',
    'AB × DED = AB AB,\nAB × DEDED = AB AB AB,\nABC × DEED = ABC ABC, మరియు\nDED + DEDED + DEED = DDFEG,\nA, B, C, D, E, F మరియు G వేర్వేరు అంకెలు అయితే, F × G విలువ ఎంత ?',
    ['2', '4', '6', '8'],
    ['2', '4', '6', '8'],
    2,
    'AB × DED = ABAB => DED = 101 => D = 1, E = 0 (also DEED = 1001, DEDED = 10101). Adding: 101 + 10101 + 1001 = 11203 = DDFEG => F = 2, G = 3. Hence F × G = 2 × 3 = 6.',
    'AB × DED = ABAB నుండి DED = 101 (D=1, E=0). అందువల్ల 101 + 10101 + 1001 = 11203 = DDFEG => F=2, G=3. కాబట్టి F × G = 2 × 3 = 6.'
  ],
  [
    137, 5, 'Mental Ability', 'Quantitative Aptitude', 'quantitative-aptitude', 'quant', 'percentage', 'Percentage',
    'Income, Expenditure & Savings',
    'Suneetha is working as a Deputy Collector and gets a monthly salary of ₹ 74,000. She used to spend it on three heads : i.e., Personal and family expenses (P), Medical (M) and Charity (C) and rest were her savings. P was 70% of her salary, M was 20% of P and C was 15% of M. When she gets a salary hike, her salary is 60% higher than in the past. She maintained the same percentage of P, but M became 25% of P and C became 20% of M. The difference between the two savings is :',
    'సునీత డిప్యూటీ కలెక్టర్‌గా పనిచేస్తున్నారు మరియు నెలవారీ జీతం ₹ 74,000. ఆమె దానిని మూడు పద్దులలో ఖర్చు చేస్తుంది : వ్యక్తిగత మరియు కుటుంబ ఖర్చులు (P), వైద్యం (M), చారిటీ (C) మరియు మిగిలిన మొత్తం ఆమె పొదుపు. P ఆమె జీతంలో 70%, M యొక్క ఖర్చు Pలో 20% మరియు C యొక్క ఖర్చు Mలో 15%. ఆమె జీతం పెంపు పొందినప్పుడు, ఆమె జీతం గతం కంటే 60% పెరిగింది, ఆమె P యొక్క ఖర్చు అదే శాతాన్ని కొనసాగించింది, కానీ M యొక్క ఖర్చు Pలో 25% మరియు C యొక్క ఖర్చు Mలో 20% అయింది. రెండు పొదుపుల మధ్య వ్యత్యాసం ఎంత :',
    ['₹ 284', '₹ 370', '₹ 424', '₹ 474'],
    ['₹ 284', '₹ 370', '₹ 424', '₹ 474'],
    1,
    'Before hike: P = 70%, M = 20% of 70% = 14%, C = 15% of 14% = 2.1%. Total spending = 86.1% => Savings₁ = 13.9% of 74,000 = ₹10,286. After 60% hike: Salary₂ = 74,000 × 1.6 = ₹1,18,400. P = 70%, M = 25% of 70% = 17.5%, C = 20% of 17.5% = 3.5%. Total spending = 91% => Savings₂ = 9% of 1,18,400 = ₹10,656. Difference = 10,656 − 10,286 = ₹370.',
    'మొదటి పొదుపు = 74,000 లో 13.9% = ₹10,286. 60% పెరుగుదల తర్వాత కొత్త జీతం ₹1,18,400; ఖర్చులు 70% + 17.5% + 3.5% = 91%, పొదుపు = 9% = ₹10,656. వ్యత్యాసం = ₹370.'
  ],
  [
    138, 5, 'Mental Ability', 'Quantitative Aptitude', 'quantitative-aptitude', 'quant', 'interest', 'Simple and Compound Interest',
    'Compound Interest (Non-Annual Compounding)',
    'Vijay invested a sum of ₹ 8,192 at 15% per annum in State Bank of India. What is the compound interest for the sum invested by Vijay for 1¼ years, if interest is compounded 5 monthly ?',
    'విజయ్ స్టేట్ బ్యాంక్ ఆఫ్ ఇండియాలో సంవత్సరానికి 15% చొప్పున ₹ 8,192 పెట్టుబడి పెట్టాడు. ప్రతి 5 మాసాలకు వడ్డీ కలిపే పద్ధతిలో 1¼ సంవత్సరాల పాటు విజయ్ పెట్టిన పెట్టుబడికి చక్రవడ్డీ ఎంత ?',
    ['₹ 1,740', '₹ 1,735', '₹ 1,640', '₹ 1,634'],
    ['₹ 1,740', '₹ 1,735', '₹ 1,640', '₹ 1,634'],
    3,
    '1¼ years = 15 months = three 5-monthly compounding periods (n = 3). Rate per 5-month period = 15% × (5/12) = 6.25% = 1/16. Amount = 8192 × (17/16)³ = 8192 × 4913 / 4096 = 2 × 4913 = ₹9,826. Compound Interest = 9,826 − 8,192 = ₹1,634.',
    '1¼ సంవత్సరాలు = 15 నెలలు = 3 ఐదు-నెలల కాలాలు. 5 నెలల వడ్డీ రేటు = 15% × (5/12) = 6.25% = 1/16. మొత్తం = 8192 × (17/16)³ = ₹9,826. చక్రవడ్డీ = 9826 - 8192 = ₹1,634.'
  ],
  [
    139, 5, 'Mental Ability', 'Quantitative Aptitude', 'quantitative-aptitude', 'quant', 'simplification', 'Simplification',
    'Symbolic Operation Pattern',
    'Some equations are solved on the basis of a certain rule. Following the same rule find out the missing number (?) :\n2 [4] 3 = 14, 4 [6] 5 = 32, 5 [7] 6 = 44, 6 [8] 7 = ?',
    'కొన్ని సమీకరణాలు నిర్దిష్ట నియమం ఆధారంగా పరిష్కరించబడతాయి. అదే నియమాన్ని అనుసరించి ప్రశ్నార్థక (?) స్థానంలోని సంఖ్యను కనుగొనండి :\n2 [4] 3 = 14, 4 [6] 5 = 32, 5 [7] 6 = 44, 6 [8] 7 = ?',
    ['50', '54', '58', '60'],
    ['50', '54', '58', '60'],
    2,
    'Rule for a [b] c: (a × c) + 2b. Check: 2×3 + 2(4) = 14; 4×5 + 2(6) = 32; 5×6 + 2(7) = 44. Therefore 6 [8] 7 = (6 × 7) + 2(8) = 42 + 16 = 58.',
    'నియమం: a [b] c = (a × c) + 2b. దాని ప్రకారం 6 [8] 7 = (6 × 7) + 2(8) = 42 + 16 = 58.'
  ],
  [
    140, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'puzzles', 'Puzzles',
    'Visual Grid & Word-Country Puzzle',
    'Arun finds the letters to be placed in the place of ‘?’ and ‘!’ in the figure given and by combining and arranging those four letters in the figure given, he finds the name of a country. The Capital city of that country is :',
    'ఈ క్రింద ఇచ్చిన బొమ్మలోని ‘?’ మరియు ‘!’ స్థానంలో ఉండాల్సిన అక్షరాలను అరుణ్ కనుగొన్నాడు మరియు ఇచ్చిన ఆ నాలుగు అక్షరాలను కలపడం మరియు అమర్చడం ద్వారా అతను ఒక దేశం పేరును గుర్తించాడు. ఆ దేశం యొక్క రాజధాని ఏది ?',
    ['Quito', 'La Paz', 'Lima', 'Georgetown'],
    ['క్విటో', 'లా పాజ్', 'లీమా', 'జార్జ్‌టౌన్'],
    2,
    'In each square, sum the three numbers to get the alphabetical rank of the letter: Top-left: 9+5+7 = 21 → U; Top-right: 7+4+5 = 16 → P (?); Bottom-left: 2+1+2 = 5 → E; Bottom-right: 6+9+3 = 18 → R (!). Combining U, P, E, R forms PERU, whose capital city is Lima.',
    'ప్రతి చతురస్రంలోని మూడు సంఖ్యలను కూడితే వచ్చే సంఖ్య ఆంగ్ల అక్షర క్రమంలోని అక్షరాన్ని ఇస్తుంది: 9+5+7=21(U), 7+4+5=16(P), 2+1+2=5(E), 6+9+3=18(R). U, P, E, R అక్షరాలతో PERU దేశం ఏర్పడుతుంది; పెరూ రాజధాని లీమా (Lima).',
    '/assets/appsc-2024/q140-diagram.svg'
  ],
  [
    141, 5, 'Mental Ability', 'Quantitative Aptitude', 'quantitative-aptitude', 'quant', 'number-system', 'Number System',
    'Digit & Divisibility Counting',
    "Siva defines a number as ‘connected with 9’ if it is divisible by 9, or if the sum of its digits is 9, or if 9 is one of the digits of the number, and other numbers are all ‘not connected with 9’. As per his definition, the number of integers from 1 to 90 (both included) which are not connected with 9 is :",
    'ఏ సంఖ్య అయితే 9 ద్వారా భాగించబడుతుందో లేదా ఆ సంఖ్యలో అంకెల మొత్తం 9 అవుతుందో లేదా 9 ఆ సంఖ్యలో ఒక అంకె అయితే అటువంటి సంఖ్యలు 9తో అనుసంధానించబడినవి మరియు మిగిలిన సంఖ్యలు అన్నీ 9తో అనుసంధానించబడినవి కావు అని శివ నిర్వచించాడు. అతని నిర్వచనం ప్రకారం 1 నుండి 90 (1 మరియు 90 రెండూ కలుపుకొని) వరకు 9తో అనుసంధానించబడని పూర్ణాంకాల సంఖ్య ఎంత :',
    ['45', '63', '72', '81'],
    ['45', '63', '72', '81'],
    2,
    'Between 1 and 90: numbers divisible by 9 (which also include all numbers whose digit sum is 9) = 9, 18, 27, 36, 45, 54, 63, 72, 81, 90 (10 numbers). Additional numbers containing digit 9: 19, 29, 39, 49, 59, 69, 79, 89 (8 numbers). Total connected with 9 = 10 + 8 = 18. Not connected with 9 = 90 − 18 = 72.',
    '1 నుండి 90 మధ్య 9తో భాగించబడేవి/అంకెల మొత్తం 9 వచ్చేవి = 10 (9, 18, ..., 90) మరియు 9 అంకె ఉన్న ఇతర సంఖ్యలు = 8 (19, 29, ..., 89). మొత్తం 18 సంఖ్యలు 9తో అనుసంధానించబడ్డాయి; మిగిలినవి 90 - 18 = 72.'
  ],
  [
    142, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'blood-relations', 'Blood Relations',
    'Coded Blood Relations',
    'Read the following instructions :\nA3B means ‘A is the Mother of B’\nA11B means ‘A is the Brother of B’\nA9B means ‘A is the Father of B’\nA12B means ‘A is the Sister of B’\nWhich of the following expressions means that P is the maternal uncle of Q ?',
    'ఈ క్రింది సూచనలను చదవండి :\nA3B అనగా ‘A అంటే B యొక్క తల్లి’\nA11B అనగా ‘A అంటే B యొక్క సోదరుడు’\nA9B అనగా ‘A అంటే B యొక్క తండ్రి’\nA12B అనగా ‘A అంటే B యొక్క సోదరి’\nP అనువాడు Q యొక్క మేనమామగా క్రింది వ్యక్తీకరణలలో ఏది చూపుతుంది ?',
    ['Q11N3M12P', 'P3S12N11Q', 'P11M3N12Q', 'Q11S9P'],
    ['Q11N3M12P', 'P3S12N11Q', 'P11M3N12Q', 'Q11S9P'],
    2,
    'Checking P11M3N12Q: P is Brother of M (P11M), M is Mother of N (M3N), N is Sister of Q (N12Q). Thus M is also the mother of Q, and P is M’s brother—making P the maternal uncle of Q.',
    'P11M3N12Q ప్రకారం: P అనే వ్యక్తి M యొక్క సోదరుడు, M అనే ఆమె N కి తల్లి, మరియు N అనే ఆమె Q కి సోదరి. కాబట్టి M అనే ఆమె Q కి తల్లి మరియు P మేనమామ అవుతారు.'
  ],
  [
    143, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'number-series', 'Number Series',
    'Wrong Number Identification',
    'Find out the odd one in the following series :\n2, 4, 7, 11.5, 18.25, 28.375, 42.5625',
    'ఈ క్రింది వరుసలో తప్పుగా ఉన్న సంఖ్యను గుర్తించండి :\n2, 4, 7, 11.5, 18.25, 28.375, 42.5625',
    ['11.5', '7', '28.375', '42.5625'],
    ['11.5', '7', '28.375', '42.5625'],
    3,
    'The series follows T(n+1) = T(n) × 1.5 + 1: 2×1.5+1 = 4; 4×1.5+1 = 7; 7×1.5+1 = 11.5; 11.5×1.5+1 = 18.25; 18.25×1.5+1 = 28.375; 28.375×1.5+1 = 43.5625 (not 42.5625). Hence 42.5625 is the odd/wrong term.',
    'ఈ శ్రేణి × 1.5 + 1 నియమాన్ని అనుసరిస్తుంది: 28.375 × 1.5 + 1 = 43.5625 రావాలి, కానీ 42.5625 ఇచ్చారు.'
  ],
  [
    144, 5, 'Mental Ability', 'Quantitative Aptitude', 'quantitative-aptitude', 'quant', 'profit-loss', 'Profit and Loss',
    'Cost Price, Markup & Overall Loss',
    'Priyanka brought 20 plates and 12 teacups. She marked up the plates by 15% on the cost price of each and the teacups by ₹ 20 on the cost price of each. She sold 75% of the plates and 8 teacups and made a profit of ₹ 385. If the cost of a teacup is 60% the cost of a plate and she got no returns on unsold items, what was her overall profit or loss ?',
    'ప్రియాంక 20 ప్లేట్లు మరియు 12 టీకప్పులను తెచ్చింది. ఆమె ఒక్కో ప్లేట్ ధర C.P. (కొనుగోలు ధర) కంటే 15% ఎక్కువ మరియు ఒక్కో టీకప్పు ధర C.P. కంటే ₹ 20 ఎక్కువగా ప్రకటించింది. ఆమె 75% ప్లేట్లు మరియు 8 టీకప్పులను విక్రయించి ₹ 385 లాభాన్ని ఆర్జించింది. ఒక టీకప్పు ధర ఒక ప్లేట్ ఖరీదులో 60% మాత్రమే. అయితే విక్రయించని వస్తువులపై ఆమెకు ఎలాంటి రాబడి రాకపోతే, ఆమె మొత్తం లాభం లేదా నష్టం ఎంత ?',
    ['Loss of ₹ 210', 'Loss of ₹ 250', 'Loss of ₹ 355', 'Loss of ₹ 475'],
    ['₹ 210 నష్టం', '₹ 250 నష్టం', '₹ 355 నష్టం', '₹ 475 నష్టం'],
    2,
    'Let CP of 1 plate = p, then CP of 1 teacup = 0.6p. Sold items: 15 plates (profit 0.15p each) + 8 teacups (profit ₹20 each) => 15(0.15p) + 8(20) = 385 => 2.25p = 225 => p = ₹100; teacup CP = ₹60. Total CP = 20×100 + 12×60 = ₹2,720. Total SP = 15×115 + 8×80 = 1,725 + 640 = ₹2,365. Overall loss = 2,720 − 2,365 = ₹355.',
    'ఒక ప్లేట్ ఖరీదు p=₹100, టీకప్పు ₹60 అవుతుంది. మొత్తం కొనుగోలు ధర = 20×100 + 12×60 = ₹2,720. మొత్తం అమ్మకం ధర = 15×115 + 8×80 = ₹2,365. కాబట్టి నికర నష్టం = ₹355.'
  ],
  [
    145, 5, 'Mental Ability', 'Quantitative Aptitude', 'quantitative-aptitude', 'quant', 'time-work', 'Time and Work',
    'Combined Work & Relative Time',
    'Mahesh and Krishna are engaged to do a work. Mahesh working alone takes 8 hours more to complete the job than if both worked together. If Krishna worked alone, he would need 4½ hours more to complete the job than if they both worked together. How much time would they both take to do the work together ?',
    'మహేష్ మరియు కృష్ణ ఒక పని చేయడంలో నిమగ్నమై ఉన్నారు. ఇద్దరు కలిసి పనిచేసిన దానికంటే మహేష్ ఒక్కడే పని చేయడానికి 8 గంటలు ఎక్కువ పడుతుంది. కృష్ణ ఒంటరిగా పని చేస్తే, ఇద్దరూ కలిసి పనిచేసిన దానికంటే పనిని పూర్తి చేయడానికి అతనికి 4½ గంటలు ఎక్కువ కావాలి. ఇద్దరూ కలిసి పని చేయడానికి ఎంత సమయం తీసుకుంటారు ?',
    ['7.4 hours', '5 hours', '5.3 hours', '6 hours'],
    ['7.4 గంటలు', '5 గంటలు', '5.3 గంటలు', '6 గంటలు'],
    3,
    'When A takes a hours more and B takes b hours more than their combined time T, then T = √(a × b). Here T = √(8 × 4.5) = √36 = 6 hours.',
    'ఇద్దరూ కలిసి పట్టే సమయం T = √(a × b) = √(8 × 4.5) = √36 = 6 గంటలు.'
  ],
  [
    146, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'non-verbal', 'Non-Verbal Reasoning',
    'Counting Geometric Figures',
    'Find the number of triangles and squares in the following figure :',
    'ఈ క్రింది చిత్రంలో త్రిభుజాలు మరియు చతురస్రాల సంఖ్యను కనుగొనండి :',
    [
      '21 Triangles and 8 Squares',
      '20 Triangles and 8 Squares',
      '22 Triangles and 7 Squares',
      '21 Triangles and 7 Squares'
    ],
    [
      '21 త్రిభుజాలు మరియు 8 చతురస్రాలు',
      '20 త్రిభుజాలు మరియు 8 చతురస్రాలు',
      '22 త్రిభుజాలు మరియు 7 చతురస్రాలు',
      '21 త్రిభుజాలు మరియు 7 చతురస్రాలు'
    ],
    3,
    'Squares (7): 1 small top square around the apex + 5 squares in the 2×2 central grid (4 quadrants + 1 outer) + 1 inscribed diamond = 7 squares. Triangles (21): 8 inside the central diamond + 3 in the top small section + 3 up to the horizontal midline + 3 for the full outer triangle + 2 lower outer side wings + 2 upper-corner triangles = 21 triangles.',
    'చిత్రంలో మొత్తం చతురస్రాలు = 1 (పై చిన్న చతురస్రం) + 5 (2×2 గ్రిడ్) + 1 (మధ్యలో వజ్రం) = 7 చతురస్రాలు; మరియు మొత్తం త్రిభుజాలు = 21.',
    '/assets/appsc-2024/q146-diagram.svg'
  ],
  [
    147, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'non-verbal', 'Non-Verbal Reasoning',
    'Embedded Figure Identification',
    'The question below consists of a problem figure and is followed by four answer figures (1), (2), (3) and (4). Select the correct answer figure that is embedded in the question figure.',
    'ఈ దిగువన ఒక ప్రశ్న చిత్రం మరియు నాలుగు సమాధానాల చిత్రాలు (1), (2), (3) మరియు (4) కలిగి ఉన్నది. ప్రశ్న చిత్రంలో పొందుపరిచిన సరైన జవాబు చిత్రాన్ని ఎంచుకోండి.',
    ['Figure (1)', 'Figure (2)', 'Figure (3)', 'Figure (4)'],
    ['చిత్రం (1)', 'చిత్రం (2)', 'చిత్రం (3)', 'చిత్రం (4)'],
    0,
    'Answer figure (1) — forming an M-shaped polyline from the left vertical wall to the top-left corner, down to the center, up to the top-right corner, and down the right vertical wall — is directly embedded in the question figure.',
    'సమాధాన చిత్రం (1) లోని M ఆకారపు రేఖాకృతి ప్రశ్న చిత్రంలో పూర్తిగా ఇమిడి ఉన్నది.',
    '/assets/appsc-2024/q147-diagram.svg'
  ],
  [
    148, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'non-verbal', 'Non-Verbal Reasoning',
    'Mirror Image Across Horizontal Axis',
    'Choose the correct mirror image for the given figure among the four alternatives (1), (2), (3) and (4). The mirror is represented by a line AB.',
    'ఈ దిగువ ప్రశ్నలోని నాలుగు ప్రత్యామ్నాయాలు (1), (2), (3) మరియు (4) లో ఇచ్చిన చిత్రం యొక్క సరైన ప్రతిబింబాన్ని ఎంచుకోండి. అద్దం AB లైన్ ద్వారా సూచించబడుతుంది.',
    ['Figure (1)', 'Figure (2)', 'Figure (3)', 'Figure (4)'],
    ['చిత్రం (1)', 'చిత్రం (2)', 'చిత్రం (3)', 'చిత్రం (4)'],
    1,
    'With horizontal mirror AB placed at the bottom, top and bottom invert while left and right remain unchanged: the upright triangle flips downward, the left sector retains the vertically inverted letter A, the right sector stays hatched, and the bottom symbols move to the top. This matches Figure (2).',
    'అద్దం AB అడుగున క్షితిజ సమాంతరంగా ఉన్నందున, చిత్రం పైకి-కిందకు తలకిందులుగా మారుతుంది కానీ ఎడమ-కుడి భాగాలు మారవు. తలకిందులైన A ఎడమవైపు మరియు గీతల భాగం కుడివైపు ఉండే చిత్రం (2) సరైనది.',
    '/assets/appsc-2024/q148-diagram.svg'
  ],
  [
    149, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'syllogism', 'Syllogism',
    'Statement & Conclusions',
    'Statement : Two industrialists, Shyam and Manoj, have industries right next to each other. They have been working hard for their industries’ development and both of them manufacture the same product. Both spend equal amount of time, use the same materials and are equally hardworking. During the sales period, Shyam had better product sale in comparison to Manoj’s product.\nConclusion I : The quality of material used by Manoj was not good.\nConclusion II : Power cuts ruined the quality of Manoj’s product.',
    'ప్రకటన : ఇద్దరు పారిశ్రామికవేత్తలు, శ్యామ్ మరియు మనోజ్ ఇద్దరికీ పక్క పక్కనే ఒకదానిని ఆనుకొని మరొకటి పరిశ్రమలు ఉన్నాయి. వారు తమ పరిశ్రమల అభివృద్ధి కోసం కష్టపడి పనిచేస్తున్నారు మరియు ఇద్దరూ ఒకే ఉత్పత్తిని తయారు చేస్తారు. ఇద్దరూ సమాన సమయాన్ని వెచ్చిస్తారు, ఒకే పదార్థాలను ఉపయోగిస్తారు మరియు సమానంగా కష్టపడి పని చేస్తారు. విక్రయాల కాలంలో, మనోజ్ ఉత్పత్తితో పోల్చితే, శ్యామ్ మెరుగైన ఉత్పత్తి విక్రయాలను కలిగి ఉన్నాడు.\nనిర్ధారణ I : మనోజ్ ఉపయోగించిన మెటీరియల్ నాణ్యత బాగా లేదు.\nనిర్ధారణ II : పవర్ కట్‌లు మనోజ్ ఉత్పత్తి నాణ్యతను నాశనం చేశాయి.',
    [
      'Only conclusion I follows',
      'Only conclusion II follows',
      'Both conclusions I and II follow',
      'Neither conclusion I nor II follows'
    ],
    [
      'I మాత్రమే అనుసరిస్తుంది',
      'II మాత్రమే అనుసరిస్తుంది',
      'I మరియు II రెండూ అనుసరిస్తాయి',
      'I లేదా II లు అనుసరించవు'
    ],
    3,
    'Conclusion I contradicts the statement (“use the same materials”), and Conclusion II introduces power cuts which are nowhere mentioned in the statement. Thus neither conclusion follows.',
    'ప్రకటన ప్రకారం ఇద్దరూ ఒకే పదార్థాలు ఉపయోగిస్తారు కాబట్టి నిర్ధారణ I తప్పు; పవర్ కట్ల ప్రస్తావన లేదు కాబట్టి నిర్ధారణ II కూడా అనుసరించదు.',
  ],
  [
    150, 5, 'Mental Ability', 'Reasoning', 'reasoning', 'reasoning', 'syllogism', 'Syllogism',
    'Statement & Assumptions',
    'Statement : The civic authority has decided that all the factories located inside the city limits be shifted outside to reduce the level of environmental pollution in the city.\nAssumption I : The pollution level in the city in future may reduce after these factories are shifted outside the city limits.\nAssumption II : Enough usable land is available outside the city limit for these factories.\nAssumption III : Many of these factories may shift to some other smaller towns to remain profitable.',
    'ప్రకటన : నగరంలో పర్యావరణ కాలుష్యం స్థాయిని తగ్గించేందుకు నగర పరిధిలో ఉన్న అన్ని కర్మాగారాలను నగరం బయటికి తరలించాలని పౌర అధికార యంత్రాంగం నిర్ణయించింది.\nఊహ I : ఈ కర్మాగారాలను నగర సరిహద్దుల వెలుపలికి తరలించిన తర్వాత భవిష్యత్తులో నగరంలో కాలుష్య స్థాయి తగ్గవచ్చు.\nఊహ II : ఈ కర్మాగారాల కోసం నగర పరిమితి వెలుపల తగినంత భూమి అందుబాటులో ఉంది.\nఊహ III : లాభదాయకంగా ఉండటానికి ఈ కర్మాగారాల్లో చాలా వరకు ఇతర చిన్న పట్టణాలకు మారవచ్చు.',
    [
      'Only I is implicit',
      'Only I and II are implicit',
      'Only II is implicit',
      'Only II and III are implicit'
    ],
    [
      'I మాత్రమే అవ్యక్తమైనది',
      'I మరియు II మాత్రమే అవ్యక్తమైనవి',
      'II మాత్రమే అవ్యక్తమైనది',
      'II మరియు III మాత్రమే అవ్యక్తమైనవి'
    ],
    1,
    'Relocating factories outside city limits presupposes that doing so will reduce city pollution (Assumption I) and that usable land outside city limits exists to accommodate them (Assumption II). Profitability in smaller towns (III) is not implied by the civic decision.',
    'నగరం బయటకు కర్మాగారాలను తరలించడం ద్వారా కాలుష్యం తగ్గుతుందనేది (ఊహ I) మరియు బయట తగినంత భూమి ఉందనేది (ఊహ II) ఈ నిర్ణయంలో అవ్యక్తమై ఉన్నాయి.'
  ]
];

const letters = ['A', 'B', 'C', 'D'];

const formattedQuestions = RAW_QUESTIONS.map(
  ([qn, secNo, secName, subject, subjectId, categoryId, topicId, topic, subtopic, enQ, teQ, enOpts, teOpts, ansIdx, enExp, teExp, imageUrl]) => {
    const qObj = {
      id: `appsc-group2-2024-prelims-q${qn}`,
      examType: 'APPSC Group II',
      examLevel: 'Group II Prelims',
      examLevelLabel: 'APPSC Group-II Prelims (2024)',
      examCode: 'GS/2G/200 (A)',
      paperNumber: 0,
      shiftNumber: 1,
      setNumber: 1,
      examName: 'APPSC Group-2 Prelims (2024)',
      examYear: '2024',
      examDate: '25 Feb 2024',
      shiftTiming: 'Screening Test · 150 Mins',
      questionNumber: qn,
      sectionNumber: secNo,
      sectionName: secName,
      subject,
      subjectId,
      categoryId,
      topicId,
      topic,
      subtopic,
      pdfSubtopic: subtopic,
      question: {
        en: enQ,
        te: teQ
      },
      options: {
        en: enOpts,
        te: teOpts
      },
      correctAnswer: ansIdx,
      correctLetter: letters[ansIdx],
      explanation: {
        en: `${enExp} (APPSC Group-2 Prelims 25 Feb 2024 · Section ${['', 'A: Indian History', 'B: Geography', 'C: Indian Society', 'D: Current Affairs', 'E: Mental Ability'][secNo]} · Q${qn})`,
        te: `${teExp} (APPSC గ్రూప్-2 ప్రిలిమ్స్ 25 ఫిబ్రవరి 2024 · Q${qn})`
      },
      status: 'Published',
      verificationStatus: 'VERIFIED',
      questionType: 'PYQ',
      isPyq: true,
      difficulty: 'Medium',
      source: `APPSC Group-2 Prelims Official Question Paper (25 Feb 2024) · Booklet GS/2G/200 Series (A) · Q${qn}`,
      paperUrl: PAPER_URL,
      paperFileName: PAPER_FILENAME,
      createdAt: CREATED_AT
    };

    if (imageUrl) {
      qObj.imageUrl = imageUrl;
    }
    return qObj;
  }
);

const subjectCounts = {};
const topicCounts = {};
for (const q of formattedQuestions) {
  subjectCounts[q.subjectId] = (subjectCounts[q.subjectId] || 0) + 1;
  const tKey = `${q.subjectId}::${q.topicId}`;
  topicCounts[tKey] = (topicCounts[tKey] || 0) + 1;
}

const shiftMetadata = {
  id: 'appsc-group2-2024-prelims-shift-1',
  code: 'APPSC-G2-2024-PRELIMS',
  title: 'APPSC Group-2 Prelims (25 Feb 2024) – Screening Test (Official Bilingual)',
  examType: 'APPSC Group II',
  examLevel: 'Group II Prelims',
  examCode: 'GS/2G/200 (A)',
  paperNumber: 0,
  shiftNumber: 1,
  setNumber: 1,
  examName: 'APPSC Group-2 Prelims (2024)',
  examYear: '2024',
  examDate: '25 Feb 2024',
  shiftTiming: 'Screening Test · 150 Mins',
  questionsCount: formattedQuestions.length,
  durationMinutes: 150,
  totalMarks: 150,
  negativeMarking: 0.33,
  languages: ['English', 'Telugu'],
  pdfUrl: PAPER_URL,
  pdfFileName: PAPER_FILENAME,
  notes: 'Source PDF omits booklet page 11 (Q27–Q30); all 146 physically present official questions (Q1–Q26, Q31–Q150) are included and segregated by subject & topic.',
  subjects: [
    { name: 'Indian History', count: 26 },
    { name: 'Geography', count: 30 },
    { name: 'Indian Society', count: 30 },
    { name: 'Current Affairs', count: 30 },
    { name: 'Mental Ability (Reasoning & Quant)', count: 30 }
  ]
};

const output = {
  metadata: {
    examName: 'APPSC Group-2 Prelims (25 Feb 2024)',
    bookletCode: 'GS/2G/200 Series A',
    totalExtracted: formattedQuestions.length,
    omittedSourceQuestions: [27, 28, 29, 30],
    subjectCounts,
    topicCounts,
    generatedAt: CREATED_AT
  },
  shifts: [shiftMetadata],
  questions: formattedQuestions
};

const outPath = path.resolve(process.cwd(), 'public/data/appscGroup2Prelims2024Full.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Generated ${outPath}: ${output.shifts.length} shift, ${output.questions.length} questions.`);
console.log('Subject Breakdown:', subjectCounts);
console.log('Topic Breakdown:', topicCounts);
