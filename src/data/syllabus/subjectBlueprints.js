/**
 * Canonical Subject & Chapter Blueprints for Government Competitive Exams (2026).
 *
 * Every chapter includes granular subtopics/concepts and distinguishes official
 * syllabus coverage from additional recommended preparation areas (`official` vs `recommended`).
 */

export const SUBJECT_BLUEPRINTS = {
  'general-awareness': {
    id: 'general-awareness',
    name: 'General Awareness & General Knowledge',
    shortName: 'General Awareness / GK',
    code: 'GA-GK',
    description:
      'Comprehensive coverage of Indian History, Polity, Geography, Economy, General Science, Static GK, Environment, Current Affairs, and State-specific GK.',
    chapters: [
      {
        id: 'ga-ancient-history',
        title: 'Ancient Indian History',
        topicType: 'official',
        subtopics: [
          'Prehistoric Cultures: Paleolithic, Mesolithic, Neolithic & Chalcolithic Ages',
          'Indus Valley Civilization: Town planning, major sites (Harappa, Mohenjodaro, Dholavira, Lothal), trade & script',
          'Vedic Period: Rigvedic vs Later Vedic society, polity, economy, and literature (Vedas, Upanishads)',
          'Mahajanapadas, Rise of Magadha, Buddhism & Jainism (Councils, Doctrines, Sects, Literature)',
          'Mauryan Empire: Chandragupta Maurya, Ashoka’s Dhamma, Rock & Pillar Edicts, Arthashastra',
          'Post-Mauryan Kingdoms: Satavahanas, Kushanas (Kanishka), Shakas & Sangam Age',
          'Gupta Empire (Golden Age): Administration, Literature, Science (Aryabhata, Varahamihira), Art & Architecture',
          'Harshavardhana, Pallavas, Chalukyas & Temple Architecture Styles (Nagara, Dravida, Vesara)'
        ]
      },
      {
        id: 'ga-medieval-history',
        title: 'Medieval Indian History',
        topicType: 'official',
        subtopics: [
          'Tripartite Struggle: Palas, Pratiharas, and Rashtrakutas',
          'Chola Empire: Local self-government (Uttaramerur inscription), naval expeditions, bronze art',
          'Delhi Sultanate: Slave, Khilji, Tughlaq, Sayyid & Lodi dynasties; Iqta system & administrative reforms',
          'Vijayanagara & Bahmani Kingdoms: Krishnadevaraya, Ashtadiggajas, Hampi monuments',
          'Bhakti & Sufi Movements: Kabir, Nanak, Chaitanya, Mirabai, Annamacharya, Chishti & Suhrawardi orders',
          'Mughal Empire: Babur to Aurangzeb, Mansabdari & Zabti systems, Mughal architecture & painting',
          'Maratha Empire: Chhatrapati Shivaji Maharaj, Ashtapradhan, Peshwas, Third Battle of Panipat'
        ]
      },
      {
        id: 'ga-modern-history',
        title: 'Modern Indian History',
        topicType: 'official',
        subtopics: [
          'Advent of Europeans (Portuguese, Dutch, English, French) & Carnatic Wars',
          'British Expansion: Battle of Plassey (1757), Battle of Buxar (1764), Subsidiary Alliance & Doctrine of Lapse',
          'Economic Impact of British Rule: Permanent Settlement, Ryotwari, Mahalwari & Drain of Wealth Theory',
          'Socio-Religious Reform Movements: Raja Ram Mohan Roy, Ishwar Chandra Vidyasagar, Jyotiba Phule, Swami Vivekananda, Arya Samaj',
          'Revolt of 1857: Causes, Leaders, Centers, Suppression & Government of India Act 1858',
          'Tribal & Peasant Uprisings: Santhal, Munda, Indigo, Pabna, Moplah & Bardoli movements',
          'Development of Education & Press under British Rule (Wood’s Despatch, Hunter Commission, Vernacular Press Act)'
        ]
      },
      {
        id: 'ga-national-movement',
        title: 'Indian National Movement',
        topicType: 'official',
        subtopics: [
          'Formation of Indian National Congress (1885), Moderate Phase (1885–1905) & Extremist Phase (1905–1918)',
          'Partition of Bengal (1905), Swadeshi & Boycott Movement, Surat Split (1907), Home Rule League',
          'Gandhian Era: Champaran, Kheda, Ahmedabad Mill Strike, Rowlatt Act & Jallianwala Bagh (1919)',
          'Non-Cooperation Movement (1920–22), Khilafat Movement, Swaraj Party & Simon Commission (1927)',
          'Civil Disobedience Movement (1930): Dandi March, Gandhi-Irwin Pact, Round Table Conferences & Poona Pact',
          'Revolutionary Nationalism: HSRA, Bhagat Singh, Chandrashekhar Azad, Surya Sen & Subhas Chandra Bose (INA)',
          'Quit India Movement (1942), Cripps Mission, Cabinet Mission, Mountbatten Plan & Indian Independence Act 1947'
        ]
      },
      {
        id: 'ga-constitution',
        title: 'Indian Constitution',
        topicType: 'official',
        subtopics: [
          'Historical Background: Regulating Act 1773 to Government of India Act 1935',
          'Constituent Assembly: Composition, Committees, Drafting Committee & Enactment',
          'Salient Features & Sources Borrowed from Foreign Constitutions',
          'Preamble: Key ideals (Sovereign, Socialist, Secular, Democratic, Republic, Justice, Liberty, Equality, Fraternity)',
          'Schedules (1 to 12), Parts of the Constitution & Union and its Territory (Articles 1–4)',
          'Citizenship (Articles 5–11) & Citizenship Amendment Provisions',
          'Constitutional Amendments Procedure (Article 368) & Landmark Amendments (42nd, 44th, 73rd, 74th, 86th, 101st, 106th)'
        ]
      },
      {
        id: 'ga-polity',
        title: 'Indian Polity',
        topicType: 'official',
        subtopics: [
          'Federalism & Centre-State Relations: Legislative, Administrative & Financial (Finance Commission, GST Council)',
          'Emergency Provisions: National (Art. 352), State/President’s Rule (Art. 356) & Financial (Art. 360)',
          'Governor, Chief Minister, State Council of Ministers & State Legislature',
          'Panchayati Raj Institutions (73rd Amendment) & Urban Local Bodies (74th Amendment)',
          'Constitutional Bodies: Election Commission, CAG, UPSC, SPSC, NCSC, NCST, NCBC, Attorney General',
          'Non-Constitutional & Statutory Bodies: NITI Aayog, NHRC, CVC, CBI, Lokpal, Information Commission',
          'Official Languages (Part XVII), Anti-Defection Law (10th Schedule) & Special Provisions for States'
        ]
      },
      {
        id: 'ga-fundamental-rights',
        title: 'Fundamental Rights and Duties',
        topicType: 'official',
        subtopics: [
          'Fundamental Rights (Part III, Articles 12–35): Right to Equality (Art. 14–18), Freedom (Art. 19–22)',
          'Right against Exploitation (Art. 23–24), Freedom of Religion (Art. 25–28), Cultural & Educational Rights (Art. 29–30)',
          'Right to Constitutional Remedies (Art. 32) & Five Writs (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto)',
          'Directive Principles of State Policy (DPSP, Part IV, Articles 36–51): Socialistic, Gandhian & Liberal-Intellectual principles',
          'Fundamental Duties (Part IVA, Article 51A): 11 Duties, Swaran Singh Committee & 86th Amendment',
          'Basic Structure Doctrine (Kesavananda Bharati Case) & Conflict/Harmony between FRs and DPSP'
        ]
      },
      {
        id: 'ga-parliament',
        title: 'Parliament',
        topicType: 'official',
        subtopics: [
          'Composition of Parliament: President, Rajya Sabha (Council of States) & Lok Sabha (House of the People)',
          'Qualification, Disqualification, Sessions, Prorogation, Dissolution & Quorum',
          'Speaker & Deputy Speaker of Lok Sabha; Chairman & Deputy Chairman of Rajya Sabha',
          'Legislative Procedure: Ordinary Bills, Money Bills (Art. 110), Financial Bills & Joint Sitting (Art. 108)',
          'Budget in Parliament: Consolidated Fund, Contingency Fund, Public Account, Cut Motions & Grants',
          'Parliamentary Committees: Public Accounts Committee (PAC), Estimates Committee, Public Undertakings Committee',
          'Parliamentary Privileges, Question Hour, Zero Hour, Adjournment Motion & No-Confidence Motion'
        ]
      },
      {
        id: 'ga-president-vp',
        title: 'President and Vice President',
        topicType: 'official',
        subtopics: [
          'Election of President (Electoral College, Proportional Representation), Qualifications, Oath & Term (Articles 52–62)',
          'Impeachment Procedure of the President (Article 61)',
          'Powers of the President: Executive, Legislative, Financial, Judicial (Pardoning Power Art. 72), Diplomatic & Military',
          'Ordinance Making Power (Article 123) & Veto Powers (Absolute, Suspensive, Pocket Veto)',
          'Vice President of India (Articles 63–71): Election, Functions as Ex-Officio Chairman of Rajya Sabha & Vacancy Rules'
        ]
      },
      {
        id: 'ga-pm-council',
        title: 'Prime Minister and Council of Ministers',
        topicType: 'official',
        subtopics: [
          'Appointment of Prime Minister (Article 75), Powers & Role in Cabinet and Parliament',
          'Union Council of Ministers: Cabinet Ministers, Ministers of State & Deputy Ministers',
          'Collective Responsibility (Article 75(3)) vs Individual Responsibility',
          '91st Constitutional Amendment Act (15% Strength Cap on Council of Ministers)',
          'Cabinet Committees (Political Affairs, Economic Affairs, Appointments, Security) & Cabinet Secretariat'
        ]
      },
      {
        id: 'ga-supreme-high-courts',
        title: 'Supreme Court and High Courts',
        topicType: 'official',
        subtopics: [
          'Supreme Court of India (Articles 124–147): Collegium System, Appointment, Tenure & Removal of Judges',
          'Jurisdiction of Supreme Court: Original, Writ, Appellate, Advisory (Art. 143) & Court of Record',
          'Judicial Review, Judicial Activism & Public Interest Litigation (PIL)',
          'High Courts (Articles 214–231): Appointment, Transfer, Writ Jurisdiction (Art. 226) & Supervisory Power',
          'Subordinate Courts, District Judges, Lok Adalats, Gram Nyayalayas & NALSA'
        ]
      },
      {
        id: 'ga-indian-geography',
        title: 'Indian Geography',
        topicType: 'official',
        subtopics: [
          'Physiographic Divisions: Himalayas, Northern Plains, Peninsular Plateau, Coastal Plains, Deserts & Islands',
          'Drainage System: Himalayan Rivers (Indus, Ganga, Brahmaputra) & Peninsular Rivers (Godavari, Krishna, Kaveri, Narmada, Tapi)',
          'Indian Monsoon Mechanism, El Nino/La Nina, Seasons & Climatic Regions',
          'Soils of India (Alluvial, Black, Red, Laterite), Natural Vegetation & Forest Types',
          'Agriculture, Cropping Seasons (Kharif, Rabi, Zaid), Green/White/Blue Revolutions & Irrigation Projects',
          'Mineral & Energy Resources (Coal, Iron Ore, Petroleum, Atomic & Renewable Energy)',
          'Transport (National Highways, Railways, Waterways, Ports) & Census 2011 Demographic Indicators'
        ]
      },
      {
        id: 'ga-world-geography',
        title: 'World Geography',
        topicType: 'official',
        subtopics: [
          'Continents, Major Mountain Ranges (Andes, Rockies, Alps), Plateaus & Deserts',
          'Major Rivers, Lakes, Straits, Canals (Suez, Panama) & Ocean Currents',
          'World Climatic Zones, Biomes, Grasslands (Steppes, Prairies, Pampas, Savanna)',
          'International Borders, Capitals, Currencies & Strategic Chokepoints',
          'Major Industrial & Mineral Belts of the World'
        ]
      },
      {
        id: 'ga-physical-geography',
        title: 'Physical Geography',
        topicType: 'official',
        subtopics: [
          'Universe, Solar System, Earth’s Motions (Rotation, Revolution), Solstices, Equinoxes & Eclipses',
          'Interior of the Earth, Rocks (Igneous, Sedimentary, Metamorphic), Plate Tectonics, Earthquakes & Volcanoes',
          'Geomorphic Processes: Weathering, Erosion & Landforms (Fluvial, Glacial, Aeolian, Karst, Coastal)',
          'Atmosphere: Composition, Structure (Troposphere to Exosphere), Insolation, Pressure Belts, Winds & Cyclones',
          'Hydrosphere: Ocean Relief, Salinity, Tides, Waves & Coral Reefs'
        ]
      },
      {
        id: 'ga-indian-economy',
        title: 'Indian Economy',
        topicType: 'official',
        subtopics: [
          'National Income Accounting: GDP, GNP, NNP, Per Capita Income & GDP Deflator',
          'Economic Planning in India: Five-Year Plans, NITI Aayog & Economic Reforms (LPG 1991)',
          'Fiscal Policy, Union Budget, FRBM Act, Deficit Indicators & GST Structure',
          'Inflation (CPI, WPI), Poverty Estimation Committees & Unemployment Types',
          'Agriculture, MSP, PDS, Food Security & Industrial Policy / MSME Sector',
          'Balance of Payments (BoP), Foreign Trade, FDI/FPI, WTO, IMF & World Bank'
        ]
      },
      {
        id: 'ga-banking-financial',
        title: 'Banking and Financial Awareness',
        topicType: 'official',
        subtopics: [
          'Reserve Bank of India (RBI): Structure, Monetary Policy Committee (MPC), Repo, Reverse Repo, CRR, SLR, MSF, OMO',
          'Indian Banking System: Public, Private, RRBs, Co-operative, Small Finance & Payment Banks',
          'Financial Inclusion: PMJDY, UPI, NPCI, Priority Sector Lending (PSL) & Mudra Yojana',
          'Capital & Money Markets: SEBI, Stock Exchanges, Treasury Bills, Commercial Paper, Bonds & Mutual Funds',
          'Basel Norms, NPA Management, Insolvency & Bankruptcy Code (IBC), DICGC & Insurance Regulators (IRDAI, PFRDA)'
        ]
      },
      {
        id: 'ga-general-science-overview',
        title: 'General Science (Integrated)',
        topicType: 'official',
        subtopics: [
          'Scientific Laws, Instruments & Everyday Applications of Science',
          'Human Physiology, Balanced Diet, Vitamins, Deficiency & Communicable Diseases',
          'Common Chemical Compounds, Alloys, Polymers & Household Chemistry',
          'Optics, Electricity, Heat & Energy Conversions in Daily Life'
        ]
      },
      {
        id: 'ga-physics',
        title: 'Physics (General Awareness)',
        topicType: 'official',
        subtopics: [
          'SI Units, Scalars & Vectors, Newton’s Laws of Motion & Gravitation',
          'Work, Energy, Power, Surface Tension, Viscosity & Archimedes’ Principle',
          'Light (Reflection, Refraction, Mirrors, Lenses, Eye Defects), Sound Waves & Doppler Effect',
          'Heat, Thermodynamics, Electricity (Ohm’s Law, Circuits), Magnetism & Nuclear Energy'
        ]
      },
      {
        id: 'ga-chemistry',
        title: 'Chemistry (General Awareness)',
        topicType: 'official',
        subtopics: [
          'States of Matter, Atomic Structure, Isotopes, Isobars & Periodic Table Trends',
          'Acids, Bases, Salts, pH Scale & Chemical Reactions (Oxidation, Reduction)',
          'Important Metals, Ores, Alloys, Carbon Allotropes & Polymers/Plastics',
          'Fertilizers, Cement, Glass, Fuels & Everyday Industrial Chemistry'
        ]
      },
      {
        id: 'ga-biology',
        title: 'Biology (General Awareness)',
        topicType: 'official',
        subtopics: [
          'Cell Structure (Prokaryotic vs Eukaryotic), Organelles & Five-Kingdom Classification',
          'Human Systems: Digestive, Respiratory, Circulatory (Blood Groups), Excretory, Nervous & Endocrine',
          'Nutrients, Vitamins, Minerals & Deficiency Diseases; Viral, Bacterial, Protozoan & Fungal Diseases',
          'Plant Kingdom, Photosynthesis, Plant Hormones, Genetics (Mendel, DNA/RNA) & Biotechnology'
        ]
      },
      {
        id: 'ga-environment-ecology',
        title: 'Environment and Ecology',
        topicType: 'official',
        subtopics: [
          'Ecosystem Structure, Food Chains, Food Webs, Ecological Pyramids & Biogeochemical Cycles',
          'Biodiversity Hotspots, National Parks, Wildlife Sanctuaries, Tiger Reserves & Biosphere Reserves in India',
          'Ramsar Wetlands, IUCN Red List, Project Tiger, Project Elephant & Wildlife Protection Act 1972',
          'Environmental Pollution (Air, Water, Soil, E-waste), Acid Rain, Ozone Depletion & Climate Change',
          'International Conventions: UNFCCC COP Summits, Paris Agreement, CBD, CITES, Ramsar, Montreal Protocol'
        ]
      },
      {
        id: 'ga-computer-awareness',
        title: 'Computer Awareness',
        topicType: 'official',
        subtopics: [
          'History & Generations of Computers, Hardware (CPU, RAM, ROM, I/O Devices) & Software',
          'Operating Systems Basics, File Extensions, Memory Units (Bit to Petabyte) & Number Conversions',
          'MS Office Suite: Word, Excel (Formulas & Shortcuts), PowerPoint & Outlook Shortcuts',
          'Internet Protocols (HTTP/HTTPS, TCP/IP, FTP, SMTP), Browsers, Email & Network Topologies',
          'Cyber Security: Malware, Phishing, Firewall, Antivirus, Encryption & Digital India Initiatives'
        ]
      },
      {
        id: 'ga-static-gk',
        title: 'Static GK',
        topicType: 'official',
        subtopics: [
          'Classical & Folk Dances, Classical Music Gharanas, Musical Instruments & Exponents',
          'UNESCO World Heritage Sites in India, GI Tags, Temples, Forts & Caves',
          'International Organizations (UN, WHO, UNESCO, BRICS, G20, ASEAN, SCO, NATO) & Headquarters',
          'National Symbols, Firsts in India & World, Superlatives (Largest, Longest, Highest)',
          'Indian Research Institutes (ISRO, DRDO, CSIR, BARC), Atomic Power Plants & Space Centres'
        ]
      },
      {
        id: 'ga-national-ca',
        title: 'National Current Affairs',
        topicType: 'official',
        subtopics: [
          'Union Cabinet Decisions, New Bills, Acts & Constitutional/Supreme Court Judgments',
          'National Summits, Economic Survey, Union Budget Highlights & NITI Aayog Reports',
          'Major Infrastructure Projects, Railways, Expressways, Ports & Smart Cities Updates',
          'Appointments to Constitutional & Statutory Offices in India'
        ]
      },
      {
        id: 'ga-international-ca',
        title: 'International Current Affairs',
        topicType: 'official',
        subtopics: [
          'India’s Bilateral Relations, State Visits, MoUs & Strategic Partnerships',
          'G20, BRICS, Quad, SCO, UN General Assembly & Global Summits',
          'Global Indices & Rankings (HDI, Hunger Index, Innovation Index, Press Freedom, Peace Index)',
          'Major International Elections, Treaties & Geopolitical Developments'
        ]
      },
      {
        id: 'ga-awards-honours',
        title: 'Awards and Honours',
        topicType: 'official',
        subtopics: [
          'Civilian Awards: Bharat Ratna, Padma Vibhushan, Padma Bhushan, Padma Shri',
          'Gallantry Awards: Param Vir Chakra, Ashoka Chakra, Vir Chakra, Shaurya Chakra',
          'Literary & Cinema Awards: Jnanpith, Sahitya Akademi, Booker Prize, Dadasaheb Phalke, National Film Awards, Oscars',
          'Nobel Prizes, Ramon Magsaysay, Abel Prize, Templeton & Environmental Awards'
        ]
      },
      {
        id: 'ga-sports',
        title: 'Sports',
        topicType: 'official',
        subtopics: [
          'Olympics, Paralympics, Asian Games, Commonwealth Games & National Games',
          'Cricket (ICC World Cups, IPL, WPL, Ranji), Football (FIFA), Badminton, Chess, Tennis & Athletics',
          'National Sports Awards: Major Dhyan Chand Khel Ratna, Arjuna, Dronacharya Awards',
          'Sports Terminologies, Trophies, Cups, Venues & Mascots'
        ]
      },
      {
        id: 'ga-books-authors',
        title: 'Books and Authors',
        topicType: 'official',
        subtopics: [
          'Classical & Freedom Struggle Books (Arthashastra, Discovery of India, Hind Swaraj, My Experiments with Truth)',
          'Famous Indian & International Authors, Biographies & Autobiographies',
          'Newly Released Books & Prize-Winning Literature (Current Year Releases)'
        ]
      },
      {
        id: 'ga-important-days',
        title: 'Important Days',
        topicType: 'official',
        subtopics: [
          'National Important Days (Republic Day, National Science Day, Constitution Day, Engineers’ Day, Kisan Diwas)',
          'UN & International Observances (World Environment Day, International Yoga Day, Human Rights Day)',
          'Official Annual Themes of Key National & Global Days'
        ]
      },
      {
        id: 'ga-govt-schemes',
        title: 'Government Schemes',
        topicType: 'official',
        subtopics: [
          'Social Welfare & Financial Schemes: PMJDY, PMJJBY, PMSBY, Atal Pension Yojana, Sukanya Samriddhi',
          'Agriculture & Rural Schemes: PM-KISAN, PMFBY, MGNREGA, PMGSY, Jal Jeevan Mission',
          'Health, Education & Skill Schemes: Ayushman Bharat, NEP 2020, PM SHRI, Skill India, StartUp India',
          'Infrastructure & Energy Schemes: PM Gati Shakti, PM Surya Ghar Muft Bijli Yojana, Make in India, PLI Schemes'
        ]
      },
      {
        id: 'ga-science-tech',
        title: 'Science and Technology',
        topicType: 'official',
        subtopics: [
          'ISRO Space Missions: Chandrayaan, Aditya-L1, Gaganyaan, PSLV/LVM3 Launches & Satellites',
          'Defence Tech & DRDO: Missiles (Agni, Prithvi, BrahMos, Akash), Submarines & Fighter Aircraft',
          'Emerging Technologies: Artificial Intelligence, Quantum Computing, 5G/6G, Robotics & Semiconductors',
          'Biotechnology, Vaccines, CRISPR, Supercomputers in India (AIRAWAT, PARAM)'
        ]
      },
      {
        id: 'ga-defence-exercises',
        title: 'Defence Exercises',
        topicType: 'official',
        subtopics: [
          'Bilateral Army Exercises: Yudh Abhyas, Shakti, Mitra Shakti, Dharma Guardian, Surya Kiran, Vajra Prahar',
          'Naval & Maritime Exercises: Malabar, Varuna, SIMBEX, SLINEX, MILAN, Konkan',
          'Air Force Exercises: Garuda, Cope India, Tarang Shakti, Red Flag, Desert Knight',
          'Tri-Service & Coast Guard Exercises, Commands & Paramilitary Forces Overview'
        ]
      },
      {
        id: 'ga-ap-gk',
        title: 'Andhra Pradesh General Knowledge',
        topicType: 'official',
        subtopics: [
          'AP Reorganization Act 2014, 26 Districts, Boundaries, Physiography & Coastal Geography',
          'History of Andhra: Satavahanas, Ikshvakus, Eastern Chalukyas, Kakatiyas, Vijayanagara & AP Freedom Movement',
          'Rivers & Irrigation Projects: Godavari, Krishna, Penna, Polavaram, Nagarjuna Sagar, Srisailam',
          'AP Economy, Agriculture, Industrial Corridors, Ports (Visakhapatnam, Krishnapatnam, Kakinada) & Welfare Schemes',
          'AP Art, Culture, Kuchipudi, Literature, GI Tags & Current State Policies'
        ]
      },
      {
        id: 'ga-telangana-gk',
        title: 'Telangana General Knowledge',
        topicType: 'official',
        subtopics: [
          'Telangana Statehood Movement (1948–2014), Srikrishna Committee, AP Reorganization Act & 33 Districts',
          'History & Culture of Telangana: Satavahanas, Kakatiyas, Qutb Shahis, Asaf Jahis (Nizams), Telangana Armed Struggle',
          'Geography, Rivers (Godavari, Krishna, Musi, Manjeera), Kaleshwaram & Mission Kakatiya Projects',
          'Telangana Economy, IT/Pharma Hub (Hyderabad), Agriculture, Rythu Schemes & Welfare Programmes',
          'Festivals (Bathukamma, Bonalu, Sammakka Sarakka Jatara), Literature, Poets & GI Tags'
        ]
      }
    ]
  },

  'reasoning': {
    id: 'reasoning',
    name: 'General Intelligence and Reasoning',
    shortName: 'Reasoning & Mental Ability',
    code: 'GI-RS',
    description:
      'Complete verbal, analytical, logical, and non-verbal reasoning chapters for Railway, SSC, Banking, Defence, and State PSC examinations.',
    chapters: [
      { id: 'rs-analogy', title: 'Analogy', topicType: 'official', subtopics: ['Word & Semantic Analogy', 'Number & Arithmetic Analogy', 'Letter & Alphabetical Analogy', 'GK-based & Figural Analogy'] },
      { id: 'rs-classification', title: 'Classification', topicType: 'official', subtopics: ['Odd Word Out', 'Odd Number / Pair Out', 'Odd Letter Cluster Out', 'Figural Classification'] },
      { id: 'rs-number-series', title: 'Number Series', topicType: 'official', subtopics: ['Arithmetic & Geometric Progressions', 'Difference of Differences', 'Squares, Cubes & Prime Series', 'Alternating & Wrong Term Identification'] },
      { id: 'rs-alphabet-series', title: 'Alphabet Series', topicType: 'official', subtopics: ['Positional Value (EJOTY) & Opposite Pairs', 'Letter Clusters & Continuous Repeating Pattern', 'Alphanumeric-Symbol Mixed Series'] },
      { id: 'rs-coding-decoding', title: 'Coding and Decoding', topicType: 'official', subtopics: ['Letter Shifting & Reverse Coding', 'Number/Symbol Substitution Coding', 'Fictitious Language (Chinese) Coding', 'Conditional Matrix & New-Pattern Banking Coding'] },
      { id: 'rs-blood-relations', title: 'Blood Relations', topicType: 'official', subtopics: ['Family Tree Construction & Generation Mapping', 'Pointing / Photograph Based Problems', 'Coded Blood Relations (Symbol Expressions)'] },
      { id: 'rs-direction-sense', title: 'Direction Sense', topicType: 'official', subtopics: ['Cardinal & Intercardinal Directions', 'Pythagoras Shortest Distance & Angle Rotations', 'Shadow Based Problems (Sunrise/Sunset)', 'Coded Direction Sense'] },
      { id: 'rs-ranking-order', title: 'Ranking and Order', topicType: 'official', subtopics: ['Linear Position from Left/Right or Top/Bottom', 'Interchanging Positions & Minimum/Maximum Persons', 'Height, Weight, Age & Marks Comparison'] },
      { id: 'rs-syllogism', title: 'Syllogism', topicType: 'official', subtopics: ['All, Some, No, Some Not Statements', 'Possibility & Either-Or Cases', 'Only / Only a Few Statements (Banking Pattern)', 'Coded Syllogisms & Reverse Syllogism'] },
      { id: 'rs-venn-diagrams', title: 'Venn Diagrams', topicType: 'official', subtopics: ['Logical Relationship Diagrams (2 & 3 Sets)', 'Data-Based Geometric Venn Diagrams', 'Inclusion-Exclusion Counting'] },
      { id: 'rs-statement-conclusion', title: 'Statement and Conclusion', topicType: 'official', subtopics: ['Definite vs Probable Conclusions', 'Cause & Effect Analysis', 'Course of Action & Strong/Weak Arguments'] },
      { id: 'rs-statement-assumption', title: 'Statement and Assumption', topicType: 'official', subtopics: ['Implicit Assumptions vs Extrapolations', 'Inference & Critical Reasoning Passages'] },
      { id: 'rs-seating-arrangement', title: 'Seating Arrangement', topicType: 'official', subtopics: ['Single & Parallel Row Seating (North/South)', 'Circular, Square & Rectangular Arrangements (Inward/Outward)', 'Uncertain Number of Persons & Blood-Relation Seating'] },
      { id: 'rs-puzzles', title: 'Puzzles', topicType: 'official', subtopics: ['Floor & Flat Based Puzzles', 'Box, Day, Month & Year Scheduling Puzzles', 'Tabular Classification & Multi-Variable Puzzles'] },
      { id: 'rs-calendar', title: 'Calendar', topicType: 'official', subtopics: ['Odd Days Concept & Leap Year Rules (Century Divisibility)', 'Finding Day for Any Given Date', 'Repeating Calendars & Relative Day Calculations'] },
      { id: 'rs-clock', title: 'Clock', topicType: 'official', subtopics: ['Angle Between Hour & Minute Hands', 'Coinciding, Straight Line & Right Angle Timings', 'Faulty / Gaining & Losing Clocks, Mirror Time'] },
      { id: 'rs-mirror-images', title: 'Mirror Images', topicType: 'official', subtopics: ['Vertical & Horizontal Mirror Reflection of Letters/Digits', 'Mirror Image of Complex Geometric Figures'] },
      { id: 'rs-water-images', title: 'Water Images', topicType: 'official', subtopics: ['Top-Bottom Inversion Rules for Alphanumerics', 'Water Reflection of Shapes & Composite Symbols'] },
      { id: 'rs-paper-folding', title: 'Paper Folding', topicType: 'official', subtopics: ['Single & Multiple Crease Folding Predictions', 'Transparent Sheet Folding Overlays'] },
      { id: 'rs-paper-cutting', title: 'Paper Cutting', topicType: 'official', subtopics: ['Unfolding Punched Holes & Symmetric Cuts', 'Reverse Symmetry Tracing'] },
      { id: 'rs-figure-completion', title: 'Figure Completion', topicType: 'official', subtopics: ['Completing Quadrant Symmetry Patterns', 'Embedded Figures & Hidden Shapes', 'Counting Figures (Triangles, Squares, Rectangles, Straight Lines)'] },
      { id: 'rs-non-verbal', title: 'Non-Verbal Reasoning', topicType: 'official', subtopics: ['Figure Series & Matrix Completion', 'Cubes & Dice (Standard/Open Dice Unfolding)', 'Dot Situation & Rule Detection (AFCAT/SSC)'] },
      { id: 'rs-math-operations', title: 'Mathematical Operations', topicType: 'official', subtopics: ['BODMAS Symbol Substitution & Balancing Equations', 'Sign & Number Interchanging Problems', 'Inequalities (Direct & Coded Inequalities)'] },
      { id: 'rs-missing-numbers', title: 'Missing Numbers', topicType: 'official', subtopics: ['Row-Column Matrix Patterns', 'Circular, Triangular & Grid Number Puzzles'] },
      { id: 'rs-data-sufficiency', title: 'Data Sufficiency', topicType: 'official', subtopics: ['Two-Statement & Three-Statement Sufficiency', 'Logical Sufficiency Across Coding, Directions, Ranking & Blood Relations'] }
    ]
  },

  'quantitative-aptitude': {
    id: 'quantitative-aptitude',
    name: 'Quantitative Aptitude & Mathematics',
    shortName: 'Mathematics / Quant',
    code: 'QA-MATH',
    description:
      'Arithmetic, Advanced Mathematics (Algebra, Geometry, Trigonometry, Mensuration), Data Interpretation, and Statistics for Tier-1/CBT-1 & Tier-2/Mains.',
    chapters: [
      { id: 'qa-number-system', title: 'Number System', topicType: 'official', subtopics: ['Types of Numbers, Place/Face Value & Recurring Decimals', 'Divisibility Rules (2 to 19, Composite Divisors)', 'Unit Digit, Cyclicity, Trailing Zeros & Remainder Theorem (Euler/Fermat)', 'Factors, Sum/Product of Factors & AP/GP Progressions'] },
      { id: 'qa-simplification', title: 'Simplification', topicType: 'official', subtopics: ['VBODMAS Order of Operations & Fractions', 'Surds, Indices & Square/Cube Roots', 'Approximation Techniques (Banking Prelims/Mains)'] },
      { id: 'qa-lcm-hcf', title: 'LCM and HCF', topicType: 'official', subtopics: ['Prime Factorization & Division Method', 'LCM/HCF of Fractions & Decimals', 'Remainder-Based LCM/HCF Word Problems (Bells, Traffic Lights)'] },
      { id: 'qa-percentage', title: 'Percentage', topicType: 'official', subtopics: ['Fraction-to-Percentage Equivalents', 'Successive Percentage Change & Consumption-Expenditure', 'Population Growth, Elections & Marks/Pass Percentage'] },
      { id: 'qa-ratio-proportion', title: 'Ratio and Proportion', topicType: 'official', subtopics: ['Compound Ratios, Componendo-Dividendo & Proportional Sharing', 'Mean, Third & Fourth Proportional', 'Coins, Income-Expenditure & Age Problems'] },
      { id: 'qa-average', title: 'Average', topicType: 'official', subtopics: ['Weighted Average & Combined Means', 'Inclusion/Exclusion & Replacement of Observations', 'Average Speed, Consecutive Numbers & Cricket Batting/Bowling Averages'] },
      { id: 'qa-profit-loss', title: 'Profit and Loss', topicType: 'official', subtopics: ['Cost Price, Selling Price & Percentage Markup', 'Dishonest Shopkeeper (False Weights)', 'Equal SP / Equal CP Cases & Cross-Selling Profit'] },
      { id: 'qa-discount', title: 'Discount', topicType: 'official', subtopics: ['Marked Price, Net Selling Price & Single Equivalent Discount', 'Buy X Get Y Free Schemes', 'Relation between CP, MP, Discount % & Profit %'] },
      { id: 'qa-simple-interest', title: 'Simple Interest', topicType: 'official', subtopics: ['Basic SI Formula, Rate-Time Scaling & Doubling/Tripling Time', 'Split Principal Investments & Installments under SI'] },
      { id: 'qa-compound-interest', title: 'Compound Interest', topicType: 'official', subtopics: ['Annual, Half-Yearly & Quarterly Compounding', 'Difference between CI & SI for 2 and 3 Years', 'CI Tree/Ratio Method & Equal Annual Installments'] },
      { id: 'qa-time-work', title: 'Time and Work', topicType: 'official', subtopics: ['Efficiency & LCM Total Work Method', 'Man-Days-Hours (MDH) Chain Rule', 'Alternate Day Working, Leaving/Joining & Wages Distribution'] },
      { id: 'qa-pipes-cisterns', title: 'Pipes and Cisterns', topicType: 'official', subtopics: ['Inlet & Outlet (Leak) Combined Flow Rates', 'Alternate Opening & Tank Capacity Calculations'] },
      { id: 'qa-time-speed-distance', title: 'Time, Speed and Distance', topicType: 'official', subtopics: ['Average Speed & Constant Distance Inverse Ratio', 'Relative Speed, Early/Late Arrival & Stoppages', 'Circular Track Races & Head-Start Problems'] },
      { id: 'qa-trains', title: 'Trains', topicType: 'official', subtopics: ['Crossing Pole/Man vs Platform/Bridge', 'Two Trains Moving in Same & Opposite Directions'] },
      { id: 'qa-boats-streams', title: 'Boats and Streams', topicType: 'official', subtopics: ['Upstream & Downstream Speeds', 'Speed of Boat in Still Water & Stream Velocity Calculations'] },
      { id: 'qa-mixture-alligation', title: 'Mixture and Alligation', topicType: 'official', subtopics: ['Alligation Cross Method & Weighted Averages', 'Repeated Dilution / Replacement Formula', 'Alligation in Profit-Loss, SI & Speed Problems'] },
      { id: 'qa-partnership', title: 'Partnership', topicType: 'official', subtopics: ['Simple vs Compound Partnership (Investment × Time)', 'Working vs Sleeping Partner Profit Shares'] },
      { id: 'qa-algebra', title: 'Algebra', topicType: 'official', subtopics: ['Algebraic Identities (Square & Cubic Expansions)', 'Symmetric Expressions (x + 1/x Forms) & Value Putting', 'Linear Equations in Two Variables & Quadratic Equations (Roots, Discriminant)', 'Graphs of Linear Equations & Inequalities'] },
      { id: 'qa-geometry', title: 'Geometry', topicType: 'official', subtopics: ['Lines, Angles, Parallel Transversals & Polygons', 'Triangles: Congruence, Similarity, Centres (Centroid, Incentre, Circumcentre, Orthocentre) & Theorems', 'Circles: Chords, Tangents, Secants, Alternate Segment Theorem & Cyclic Quadrilaterals', 'Quadrilaterals: Parallelogram, Rhombus, Trapezium, Square & Rectangle Properties'] },
      { id: 'qa-mensuration-2d', title: 'Mensuration 2D', topicType: 'official', subtopics: ['Perimeter & Area of Triangles (Heron’s Formula), Quadrilaterals & Regular Polygons', 'Circles, Sectors, Segments, Concentric Rings & Shaded Regions'] },
      { id: 'qa-mensuration-3d', title: 'Mensuration 3D', topicType: 'official', subtopics: ['Surface Area (CSA/TSA) & Volume of Cube, Cuboid, Cylinder, Cone, Sphere & Hemisphere', 'Frustum of a Cone, Right Prisms & Pyramids', 'Melting, Recasting & Cross-Section Water Flow'] },
      { id: 'qa-trigonometry', title: 'Trigonometry', topicType: 'official', subtopics: ['Trigonometric Ratios, Standard Angles (0° to 90°) & Quadrant Signs', 'Pythagorean Identities & Complementary Angle Relations', 'Maxima/Minima of Trigonometric Expressions & Compound Angles'] },
      { id: 'qa-height-distance', title: 'Height and Distance', topicType: 'official', subtopics: ['Angle of Elevation & Angle of Depression', '30°-60°-90° & 45°-45°-90° Ratio Shortcuts', 'Double Observation Points, Towers & Shadow Problems'] },
      { id: 'qa-data-interpretation', title: 'Data Interpretation', topicType: 'official', subtopics: ['Tables, Bar Graphs, Line Graphs, Pie Charts & Histograms', 'Missing DI, Radar/Web DI & Caselet DI (Banking/SSC Tier-2)'] },
      { id: 'qa-statistics', title: 'Statistics', topicType: 'official', subtopics: ['Mean, Median, Mode & Empirical Relation', 'Range, Mean Deviation, Variance & Standard Deviation (SSC Tier-2 / RRB)'] },
      { id: 'qa-probability', title: 'Probability', topicType: 'official', subtopics: ['Permutations & Combinations (Fundamental Counting Principle)', 'Classical Probability: Coins, Dice, Playing Cards & Colored Balls', 'Conditional Probability & Independent Events (SSC Tier-2 / Banking)'] }
    ]
  },

  'english-language': {
    id: 'english-language',
    name: 'English Language and Comprehension',
    shortName: 'English Language',
    code: 'ENG',
    description:
      'Complete English grammar, vocabulary, comprehension, cloze test, voice/narration, and para-jumble syllabus for SSC, Banking, Defence, and Teaching exams.',
    chapters: [
      { id: 'en-parts-of-speech', title: 'Parts of Speech', topicType: 'official', subtopics: ['Identification & Functional Usage of All 8 Parts of Speech', 'Interchangeability of Word Forms in Sentences'] },
      { id: 'en-nouns', title: 'Nouns', topicType: 'official', subtopics: ['Countable vs Uncountable Nouns, Collective & Abstract Nouns', 'Singular/Plural Irregular Rules, Compound Nouns & Possessive Case (Apostrophe)'] },
      { id: 'en-pronouns', title: 'Pronouns', topicType: 'official', subtopics: ['Personal, Reflexive, Emphatic, Demonstrative & Indefinite Pronouns', 'Relative Pronouns (Who/Whom/Whose/Which/That) & Distributive Rules'] },
      { id: 'en-verbs', title: 'Verbs', topicType: 'official', subtopics: ['Transitive vs Intransitive, Finite vs Non-Finite (Infinitive, Gerund, Participle)', 'Modal Auxiliaries, Causative Verbs & Confusing Verb Pairs (Lie/Lay, Rise/Raise)'] },
      { id: 'en-adjectives', title: 'Adjectives', topicType: 'official', subtopics: ['Degrees of Comparison (Positive, Comparative, Superlative)', 'Order of Adjectives & Determiners (Some/Any, Little/Few, Much/Many)'] },
      { id: 'en-adverbs', title: 'Adverbs', topicType: 'official', subtopics: ['Adverbs of Manner, Time, Place, Frequency & Degree', 'Inversion Rules with Negative Adverbs (Hardly, Scarcely, Seldom, No Sooner)'] },
      { id: 'en-articles', title: 'Articles', topicType: 'official', subtopics: ['Indefinite Articles (A/An) Phonetic Rules', 'Definite Article (The) & Zero Article Omission Rules'] },
      { id: 'en-prepositions', title: 'Prepositions', topicType: 'official', subtopics: ['Prepositions of Time, Place & Direction', 'Fixed Prepositions & Phrasal Verbs'] },
      { id: 'en-conjunctions', title: 'Conjunctions', topicType: 'official', subtopics: ['Coordinating, Subordinating & Correlative Conjunctions (Either-Or, Not Only-But Also)', 'Conditional Clauses (Zero, 1st, 2nd, 3rd Conditionals)'] },
      { id: 'en-tenses', title: 'Tenses', topicType: 'official', subtopics: ['Present, Past & Future Forms (Simple, Continuous, Perfect, Perfect Continuous)', 'Sequence of Tenses & Time Clause Rules'] },
      { id: 'en-subject-verb', title: 'Subject-Verb Agreement', topicType: 'official', subtopics: ['Proximity Rule, Compound Subjects, Collective Nouns & Indefinite Pronouns', 'Special Expressions (As Well As, Along With, A Number Of vs The Number Of)'] },
      { id: 'en-voice', title: 'Active and Passive Voice', topicType: 'official', subtopics: ['Tense-Wise Transformation Rules across Assertive, Interrogative & Imperative Sentences', 'Passive of Infinitives, Modals & Double Objects'] },
      { id: 'en-narration', title: 'Direct and Indirect Speech', topicType: 'official', subtopics: ['Reporting Verb & Backshift of Tenses', 'Pronoun, Time/Place Adverbial Changes; Interrogative, Exclamatory & Optative Sentences'] },
      { id: 'en-error-detection', title: 'Error Detection', topicType: 'official', subtopics: ['Spotting Grammatical, Modifier, Parallelism & Redundancy Errors', 'Phrase-Level & Multi-Part Error Spotting'] },
      { id: 'en-sentence-improvement', title: 'Sentence Improvement', topicType: 'official', subtopics: ['Replacing Underlined Segments for Concise & Correct Grammar', 'Idiomatic & Parallel Structure Corrections'] },
      { id: 'en-sentence-rearrangement', title: 'Sentence Rearrangement', topicType: 'official', subtopics: ['PQRS Sentence Ordering & Connectors', 'Opening/Closing Sentence Identification'] },
      { id: 'en-cloze-test', title: 'Cloze Test', topicType: 'official', subtopics: ['Contextual Vocabulary & Collocation Fitting', 'Tone-Based & Grammar-Elimination Strategies'] },
      { id: 'en-comprehension', title: 'Reading Comprehension', topicType: 'official', subtopics: ['Main Idea, Author’s Tone, Inference & Title Selection', 'Fact-Based & Vocabulary-in-Context Questions (Editorial & Narrative Passages)'] },
      { id: 'en-vocabulary', title: 'Vocabulary', topicType: 'official', subtopics: ['Root Words, Prefixes, Suffixes & Contextual Word Usage', 'Homonyms, Homophones & Confusable Words'] },
      { id: 'en-synonyms', title: 'Synonyms', topicType: 'official', subtopics: ['High-Frequency Exam Synonyms & Contextual Nuance Matching'] },
      { id: 'en-antonyms', title: 'Antonyms', topicType: 'official', subtopics: ['Direct & Contextual Opposites in Academic and Everyday Prose'] },
      { id: 'en-idioms', title: 'Idioms and Phrases', topicType: 'official', subtopics: ['Standard English Idioms, Proverbs & Phrasal Expressions', 'Contextual Sentence Usage of Idioms'] },
      { id: 'en-one-word', title: 'One Word Substitution', topicType: 'official', subtopics: ['People, Professions, Phobias, Manias, Governance, Science & Literary Terms'] },
      { id: 'en-spelling', title: 'Spelling Correction', topicType: 'official', subtopics: ['Commonly Misspelt Double-Consonant, Silent-Letter & Suffix Rules'] },
      { id: 'en-para-jumbles', title: 'Para Jumbles', topicType: 'official', subtopics: ['Coherent Paragraph Reconstruction (4 to 6 Sentences)', 'Mandatory Pairs, Pronoun Antecedents & Chronological Clues'] }
    ]
  },

  'general-science': {
    id: 'general-science',
    name: 'General Science (Physics, Chemistry & Biology)',
    shortName: 'General Science',
    code: 'GS-PCB',
    description:
      'NCERT Class 6–12 standard Physics, Chemistry, and Life Sciences syllabus for Railways (ALP, Technician, Group D, NTPC, RPF), SSC, Defence, and State PSCs.',
    chapters: [
      // Physics (11)
      { id: 'gs-phy-units', title: 'Physics: Units and Measurements', topicType: 'official', subtopics: ['Fundamental & Derived Quantities, SI System', 'Dimensional Formulas, Errors, Vernier Callipers & Screw Gauge', 'Measuring Instruments & Scalars vs Vectors'] },
      { id: 'gs-phy-motion', title: 'Physics: Motion', topicType: 'official', subtopics: ['Distance, Displacement, Speed, Velocity & Acceleration', 'Equations of Uniformly Accelerated Motion, Projectile & Circular Motion'] },
      { id: 'gs-phy-force', title: 'Physics: Force and Laws of Motion', topicType: 'official', subtopics: ['Newton’s Three Laws of Motion, Inertia & Momentum', 'Impulse, Conservation of Linear Momentum, Friction & Centripetal Force'] },
      { id: 'gs-phy-work-energy', title: 'Physics: Work, Power and Energy', topicType: 'official', subtopics: ['Work Done by Constant/Variable Force, Kinetic & Potential Energy', 'Law of Conservation of Energy, Power (Watt, Horsepower) & Collisions'] },
      { id: 'gs-phy-gravitation', title: 'Physics: Gravitation', topicType: 'official', subtopics: ['Universal Law of Gravitation, Acceleration Due to Gravity (g) Variations', 'Kepler’s Laws, Escape Velocity, Satellites & Weightlessness'] },
      { id: 'gs-phy-heat', title: 'Physics: Heat and Thermodynamics', topicType: 'official', subtopics: ['Temperature Scales (Celsius, Fahrenheit, Kelvin), Thermal Expansion', 'Specific Heat, Latent Heat, Conduction, Convection, Radiation & Laws of Thermodynamics'] },
      { id: 'gs-phy-sound', title: 'Physics: Sound', topicType: 'official', subtopics: ['Longitudinal & Transverse Waves, Wavelength, Frequency & Velocity', 'Echo, Reverberation, Ultrasound, SONAR & Pitch/Loudness/Quality'] },
      { id: 'gs-phy-light', title: 'Physics: Light', topicType: 'official', subtopics: ['Reflection (Plane & Spherical Mirrors), Mirror Formula & Magnification', 'Refraction, Snell’s Law, Total Internal Reflection, Lenses & Power (Dioptre)', 'Dispersion, Scattering, Human Eye Defects (Myopia, Hypermetropia, Presbyopia)'] },
      { id: 'gs-phy-electricity', title: 'Physics: Electricity', topicType: 'official', subtopics: ['Electric Charge, Current, Potential Difference & Ohm’s Law', 'Series & Parallel Resistors, Joule’s Law of Heating, Electric Power & Household Circuits'] },
      { id: 'gs-phy-magnetism', title: 'Physics: Magnetism', topicType: 'official', subtopics: ['Magnetic Field Lines, Oersted’s Experiment, Fleming’s Left & Right Hand Rules', 'Electromagnetic Induction, Electric Motor, Generator & Transformer'] },
      { id: 'gs-phy-modern', title: 'Physics: Modern Physics', topicType: 'official', subtopics: ['Photoelectric Effect, X-Rays & Radioactivity (Alpha, Beta, Gamma)', 'Nuclear Fission, Nuclear Fusion, Semiconductors & Communication Basics'] },
      // Chemistry (9)
      { id: 'gs-chem-matter', title: 'Chemistry: Matter', topicType: 'official', subtopics: ['Physical & Chemical Classification of Matter, States & Phase Changes', 'Elements, Compounds, Mixtures, Solutions, Colloids & Separation Techniques'] },
      { id: 'gs-chem-atomic', title: 'Chemistry: Atomic Structure', topicType: 'official', subtopics: ['Dalton, Thomson, Rutherford & Bohr Models; Electron, Proton, Neutron', 'Atomic Number, Mass Number, Isotopes, Isobars, Quantum Numbers & Valency'] },
      { id: 'gs-chem-periodic', title: 'Chemistry: Periodic Table', topicType: 'official', subtopics: ['Dobereiner, Newlands, Mendeleev & Modern Periodic Law (Moseley)', 'Periodic Trends: Atomic Radius, Ionization Enthalpy, Electronegativity & Blocks (s, p, d, f)'] },
      { id: 'gs-chem-bonding', title: 'Chemistry: Chemical Bonding', topicType: 'official', subtopics: ['Ionic (Electrovalent), Covalent & Coordinate Bonds', 'Hybridization Basics, Hydrogen Bonding & Properties of Compounds'] },
      { id: 'gs-chem-acids', title: 'Chemistry: Acids, Bases and Salts', topicType: 'official', subtopics: ['Arrhenius, Bronsted-Lowry & Lewis Concepts; Indicators & pH Scale', 'Neutralization, Common Salts (Baking Soda, Washing Soda, Bleaching Powder, POP)'] },
      { id: 'gs-chem-metals', title: 'Chemistry: Metals and Non-Metals', topicType: 'official', subtopics: ['Physical & Chemical Properties, Reactivity Series & Corrosion/Rusting', 'Metallurgy, Important Ores & Alloys (Brass, Bronze, Steel, Solder)'] },
      { id: 'gs-chem-reactions', title: 'Chemistry: Chemical Reactions', topicType: 'official', subtopics: ['Combination, Decomposition, Displacement & Double Displacement Reactions', 'Oxidation, Reduction (Redox), Balancing Equations & Catalysts'] },
      { id: 'gs-chem-carbon', title: 'Chemistry: Carbon and Its Compounds', topicType: 'official', subtopics: ['Allotropes (Diamond, Graphite, Fullerene), Catenation & Hydrocarbons (Alkanes, Alkenes, Alkynes)', 'Functional Groups, Ethanol, Ethanoic Acid, Soaps & Detergents'] },
      { id: 'gs-chem-everyday', title: 'Chemistry: Everyday Chemistry', topicType: 'official', subtopics: ['Polymers, Plastics, Drugs/Medicines (Analgesics, Antibiotics, Antacids)', 'Food Preservatives, Artificial Sweeteners, Fertilizers & Fuels (LPG, CNG, Coal)'] },
      // Biology (13)
      { id: 'gs-bio-cell', title: 'Biology: Cell Biology', topicType: 'official', subtopics: ['Cell Theory, Prokaryotic vs Eukaryotic Cells, Plant vs Animal Cells', 'Cell Organelles (Mitochondria, Plastids, Ribosomes, Golgi, Lysosomes) & Mitosis/Meiosis'] },
      { id: 'gs-bio-systems', title: 'Biology: Human Body Systems', topicType: 'official', subtopics: ['Skeletal & Muscular Systems (Bones, Joints, Cartilage)', 'Endocrine Glands, Hormones & Integumentary System Overview'] },
      { id: 'gs-bio-nutrition', title: 'Biology: Nutrition', topicType: 'official', subtopics: ['Autotrophic & Heterotrophic Nutrition; Carbohydrates, Proteins, Fats, Vitamins & Minerals', 'Human Digestive Tract, Enzymes (Amylase, Pepsin, Trypsin, Lipase) & Deficiency Disorders'] },
      { id: 'gs-bio-respiration', title: 'Biology: Respiration', topicType: 'official', subtopics: ['Aerobic vs Anaerobic Respiration, Glycolysis & ATP Yield', 'Human Respiratory Organs, Breathing Mechanism & Gaseous Exchange'] },
      { id: 'gs-bio-circulation', title: 'Biology: Circulation', topicType: 'official', subtopics: ['Heart Chambers, Cardiac Cycle, Blood Vessels & Blood Pressure', 'Blood Components (RBC, WBC, Platelets, Plasma), ABO & Rh Blood Groups, Lymphatic System'] },
      { id: 'gs-bio-excretion', title: 'Biology: Excretion', topicType: 'official', subtopics: ['Human Excretory System, Kidney & Nephron Structure, Urine Formation', 'Dialysis & Excretory Products (Ammonotelic, Ureotelic, Uricotelic)'] },
      { id: 'gs-bio-nervous', title: 'Biology: Nervous System', topicType: 'official', subtopics: ['Neuron Structure, Synapse, Brain Parts (Cerebrum, Cerebellum, Medulla) & Spinal Cord', 'Reflex Action & Human Sensory Organs (Eye, Ear)'] },
      { id: 'gs-bio-reproduction', title: 'Biology: Reproduction', topicType: 'official', subtopics: ['Asexual vs Sexual Reproduction in Plants & Animals', 'Human Male & Female Reproductive Systems, Fertilization, Menstrual Cycle & Contraception'] },
      { id: 'gs-bio-genetics', title: 'Biology: Genetics', topicType: 'official', subtopics: ['Mendel’s Laws of Inheritance, Chromosomes, DNA Double Helix & RNA', 'Sex Determination in Humans & Genetic Disorders (Haemophilia, Colour Blindness, Down Syndrome)'] },
      { id: 'gs-bio-evolution', title: 'Biology: Evolution', topicType: 'official', subtopics: ['Origin of Life, Darwin’s Natural Selection, Lamarckism & Speciation', 'Homologous & Analogous Organs, Fossils & Human Evolution'] },
      { id: 'gs-bio-diseases', title: 'Biology: Diseases', topicType: 'official', subtopics: ['Bacterial, Viral, Protozoan, Fungal & Helminth Diseases (Causative Agents & Vectors)', 'Immunity, Vaccines, Antibiotics & Lifestyle Diseases (Diabetes, Hypertension, Cancer)'] },
      { id: 'gs-bio-plant-phys', title: 'Biology: Plant Physiology', topicType: 'official', subtopics: ['Photosynthesis (Light & Dark Reactions), Transpiration & Xylem/Phloem Transport', 'Plant Hormones (Auxin, Gibberellin, Cytokinin, ABA, Ethylene) & Tropisms'] },
      { id: 'gs-bio-ecology', title: 'Biology: Ecology', topicType: 'official', subtopics: ['Biotic & Abiotic Factors, Energy Flow (10% Law), Ecological Succession', 'Ozone Layer, Greenhouse Effect, Eutrophication & Biological Magnification'] }
    ]
  },

  'computer-it': {
    id: 'computer-it',
    name: 'Computer Science and Information Technology',
    shortName: 'Computer Science / IT',
    code: 'CS-IT',
    description:
      'Complete Computer Science & IT syllabus covering fundamentals, digital logic, architecture, OS, DBMS, networking, data structures, programming, web, and cyber security.',
    chapters: [
      { id: 'cs-fundamentals', title: 'Computer Fundamentals', topicType: 'official', subtopics: ['Computer Generations, Classification, Booting (BIOS/UEFI)', 'Input/Output Devices, Storage Hierarchy & Software Types'] },
      { id: 'cs-number-systems', title: 'Number Systems', topicType: 'official', subtopics: ['Binary, Octal, Decimal & Hexadecimal Conversions', '1’s & 2’s Complement, BCD, ASCII & Unicode Representations'] },
      { id: 'cs-digital-logic', title: 'Digital Logic', topicType: 'official', subtopics: ['Logic Gates (AND, OR, NOT, NAND, NOR, XOR, XNOR)', 'Combinational Circuits (Adders, Multiplexers, Decoders) & Sequential Circuits (Flip-Flops, Counters)'] },
      { id: 'cs-boolean-algebra', title: 'Boolean Algebra', topicType: 'official', subtopics: ['Boolean Laws, De Morgan’s Theorems, SOP & POS Forms', 'Karnaugh Map (K-Map) Simplification & Minimization'] },
      { id: 'cs-coa', title: 'Computer Organization and Architecture', topicType: 'official', subtopics: ['ALU, Control Unit, Registers, Instruction Cycle & Addressing Modes', 'Pipelining, Cache Memory Mapping, Virtual Memory & I/O Interfacing (DMA, Interrupts)'] },
      { id: 'cs-os', title: 'Operating Systems', topicType: 'official', subtopics: ['Process States, PCB, CPU Scheduling Algorithms (FCFS, SJF, RR, Priority)', 'Synchronization (Semaphores, Mutex), Deadlocks (Banker’s Algorithm)', 'Memory Management (Paging, Segmentation, Page Replacement) & File Systems'] },
      { id: 'cs-dbms', title: 'DBMS', topicType: 'official', subtopics: ['ER Model, Relational Algebra & Calculus, Keys (Primary, Foreign, Candidate)', 'Normalization (1NF, 2NF, 3NF, BCNF) & Functional Dependencies', 'ACID Properties, Concurrency Control (2PL), Recovery & Indexing (B/B+ Trees)'] },
      { id: 'cs-sql', title: 'SQL', topicType: 'official', subtopics: ['DDL, DML, DCL & TCL Commands', 'SELECT Queries, Joins (Inner, Left, Right, Full), Group By, Having, Subqueries & Views'] },
      { id: 'cs-networks', title: 'Computer Networks', topicType: 'official', subtopics: ['OSI 7-Layer & TCP/IP Models; Transmission Media & Switching', 'MAC Layer (CSMA/CD, Ethernet), IPv4/IPv6 Addressing, Subnetting & CIDR', 'Routing (OSPF, BGP), TCP vs UDP, Congestion Control & Application Protocols (DNS, HTTP, SMTP, DHCP)'] },
      { id: 'cs-data-structures', title: 'Data Structures', topicType: 'official', subtopics: ['Arrays, Linked Lists (Singly, Doubly, Circular), Stacks & Queues', 'Trees (Binary, BST, AVL, Heap), Tries & Graphs (BFS, DFS, Spanning Trees)'] },
      { id: 'cs-algorithms', title: 'Algorithms', topicType: 'official', subtopics: ['Asymptotic Notation (Big-O, Theta, Omega) & Recurrence Relations', 'Sorting (Merge, Quick, Heap) & Searching Algorithms', 'Greedy, Divide & Conquer, Dynamic Programming & Shortest Path (Dijkstra, Bellman-Ford)'] },
      { id: 'cs-c-programming', title: 'Programming in C', topicType: 'official', subtopics: ['Data Types, Operators, Control Flow, Functions & Recursion', 'Pointers, Arrays, Strings, Structures, Unions, Dynamic Memory & File Handling'] },
      { id: 'cs-oop', title: 'Object-Oriented Programming', topicType: 'official', subtopics: ['Classes, Objects, Encapsulation, Abstraction, Inheritance & Polymorphism', 'Method Overloading/Overriding, Interfaces, Templates & Exception Handling'] },
      { id: 'cs-java', title: 'Java', topicType: 'official', subtopics: ['JVM/JRE/JDK Architecture, Packages, Collections Framework & Generics', 'Multithreading, Streams, JDBC & Exception Hierarchy'] },
      { id: 'cs-python', title: 'Python', topicType: 'official', subtopics: ['Data Structures (List, Tuple, Set, Dict), Comprehensions & Generators', 'Functions, Decorators, OOP in Python, File I/O & Standard Libraries'] },
      { id: 'cs-software-eng', title: 'Software Engineering', topicType: 'official', subtopics: ['SDLC Models (Waterfall, Agile, Scrum, Spiral), Requirement Engineering & SRS', 'Software Design (Coupling, Cohesion), Testing (Black/White Box, Unit, Integration) & Maintenance'] },
      { id: 'cs-web-tech', title: 'Web Technologies', topicType: 'official', subtopics: ['HTML5, CSS3, JavaScript DOM & Asynchronous Programming', 'REST APIs, JSON/XML, Client-Server Architecture & Cloud Computing Basics'] },
      { id: 'cs-cyber-security', title: 'Cyber Security', topicType: 'official', subtopics: ['Threat Landscape (Malware, Ransomware, Phishing, DDoS, SQLi, XSS)', 'Network Defense (Firewalls, IDS/IPS, VPN) & IT Act 2000 Provisions'] },
      { id: 'cs-info-security', title: 'Information Security', topicType: 'official', subtopics: ['CIA Triad, Symmetric (AES, DES) & Asymmetric (RSA) Cryptography', 'Digital Signatures, PKI, Hashing (SHA) & Authentication Protocols'] },
      { id: 'cs-data-comm', title: 'Data Communication', topicType: 'official', subtopics: ['Analog/Digital Signals, Modulation (AM, FM, PM, ASK, FSK, PSK)', 'Multiplexing (FDM, TDM, WDM), Error Detection/Correction (CRC, Hamming Code) & Flow Control'] }
    ]
  },

  'teaching-pedagogy': {
    id: 'teaching-pedagogy',
    name: 'Child Development, Pedagogy & Teaching Aptitude',
    shortName: 'Pedagogy & Teaching',
    code: 'CDP-TEACH',
    description:
      'Child Development & Pedagogy, Educational Psychology, Inclusive Education, NEP 2020, and Subject Pedagogy for CTET, AP TET, TG TET, DSC, KVS, NVS, and UGC NET.',
    chapters: [
      { id: 'tp-child-dev', title: 'Child Development & Growth (Primary & Elementary)', topicType: 'official', subtopics: ['Concept of Development & its Relationship with Learning', 'Principles of Child Development, Heredity & Environment', 'Socialization Processes & Critical Perspectives of Piaget, Kohlberg & Vygotsky'] },
      { id: 'tp-inclusive', title: 'Inclusive Education & Special Needs Learners', topicType: 'official', subtopics: ['Addressing Learners from Diverse & Disadvantaged Backgrounds', 'Learning Difficulties (Dyslexia, Dyscalculia, ADHD) & Talented/Creative Learners', 'RPwD Act & Individualized Education Plans (IEP)'] },
      { id: 'tp-learning-pedagogy', title: 'Learning Theories & Pedagogical Approaches', topicType: 'official', subtopics: ['Behaviorism, Cognitivism & Constructivism (Pavlov, Skinner, Thorndike, Bruner)', 'Motivation & Learning, Formative vs Summative Assessment, CCE & Rubrics', 'NEP 2020 (5+3+3+4 Structure), NCF 2005/2023 & RTE Act 2009'] },
      { id: 'tp-ugc-research', title: 'Teaching & Research Aptitude (NET Paper 1)', topicType: 'official', subtopics: ['Teaching Levels (Memory, Understanding, Reflective), Learner Characteristics & ICT-Based Teaching (SWAYAM, MOOCs)', 'Research Types, Methods, Sampling, Thesis Writing & Research Ethics', 'Higher Education System in India, Communication & People, Development and Environment'] }
    ]
  },

  'banking-specialized': {
    id: 'banking-specialized',
    name: 'Economic & Social Issues, Finance & Management (RBI / NABARD / SO)',
    shortName: 'ESI, Finance & Management',
    code: 'FIN-MGMT',
    description:
      'Specialized Banking & Regulatory Body Phase-2 papers covering Economic & Social Issues, Finance & Management, ARD, Descriptive English, and Specialist IT/Law/Agri.',
    chapters: [
      { id: 'bk-esi', title: 'Economic & Social Issues (RBI Grade B / NABARD)', topicType: 'official', subtopics: ['Growth & Development, Measurement of Growth, Poverty Alleviation & Employment Generation', 'Indian Economy Post-1991, Monetary & Fiscal Policy, Sustainable Development & Demographics', 'Social Structure in India, Urbanization, Education, Health & Global Economic Institutions'] },
      { id: 'bk-finance', title: 'Financial System, Markets & Risk Management', topicType: 'official', subtopics: ['Regulators (RBI, SEBI, IRDAI, PFRDA), Primary & Secondary Markets (Forex, Money, Bond, Equity)', 'Financial Inclusion, FinTech, Corporate Governance & Union Budget Analysis', 'Derivatives, Basel III, Risk Management & Accounting Basics'] },
      { id: 'bk-management', title: 'Principles of Management & Organizational Behaviour', topicType: 'official', subtopics: ['Nature & Scope of Management, Leadership Theories & Motivation Theories (Maslow, Herzberg, McGregor)', 'Organizational Behaviour, Communication, Conflict & Change Management', 'Ethics at Workplace & Corporate Governance'] },
      { id: 'bk-ard', title: 'Agriculture & Rural Development (NABARD)', topicType: 'official', subtopics: ['Agronomy, Soil & Water Conservation, Cropping Systems & Horticulture', 'Animal Husbandry, Fisheries, Forestry & Agricultural Engineering', 'Rural Development Flagship Programmes, Panchayati Raj & Rural Banking Institutions'] },
      { id: 'bk-descriptive', title: 'Descriptive English (Essay, Precis & Letter Writing)', topicType: 'official', subtopics: ['Formal & Informal Letter Writing (PO/Grade B)', 'Structured Essay Writing on Socio-Economic & Banking Themes', 'Precis Writing & Reading Comprehension'] }
    ]
  },

  'upsc-gs-mains': {
    id: 'upsc-gs-mains',
    name: 'UPSC Mains GS Papers, Essay, CSAT & Ethics',
    shortName: 'UPSC GS & Ethics',
    code: 'UPSC-GS',
    description:
      'Comprehensive UPSC Civil Services Prelims (GS + CSAT) and Mains (Essay, GS I, GS II, GS III, GS IV Ethics) official syllabus breakdown.',
    chapters: [
      { id: 'up-csat', title: 'CSAT (Prelims Paper II — Qualifying 33%)', topicType: 'official', subtopics: ['Comprehension Passages & Logical Inference', 'Interpersonal Skills, Communication & Decision Making', 'Logical Reasoning, Analytical Ability & Basic Numeracy (Class X Level)', 'Data Interpretation (Charts, Graphs, Tables, Data Sufficiency)'] },
      { id: 'up-gs1', title: 'GS Paper I: Heritage, History, Society & Geography', topicType: 'official', subtopics: ['Indian Culture: Art Forms, Literature & Architecture from Ancient to Modern Times', 'Modern Indian History (1757–Present), Freedom Struggle & Post-Independence Consolidation', 'World History (18th Century Onwards): Industrial Revolution, World Wars, Colonization/Decolonization', 'Indian Society: Diversity, Women’s Role, Globalization, Urbanization & Social Empowerment', 'Physical & Human Geography of World and India, Key Natural Resources & Geophysical Phenomena'] },
      { id: 'up-gs2', title: 'GS Paper II: Governance, Constitution, Polity, Social Justice & IR', topicType: 'official', subtopics: ['Indian Constitution: Evolution, Features, Amendments, Basic Structure & Federalism', 'Parliament, State Legislatures, Executive, Judiciary & Separation of Powers', 'Welfare Schemes, Governance Transparency, E-Governance & Role of Civil Services', 'India & Its Neighbourhood, Bilateral/Regional/Global Groupings & International Institutions'] },
      { id: 'up-gs3', title: 'GS Paper III: Economy, S&T, Environment, Disaster Mgmt & Security', topicType: 'official', subtopics: ['Indian Economy, Inclusive Growth, Budgeting, Agriculture, Land Reforms & Food Processing', 'Infrastructure, Investment Models, Science & Technology Indigenization & Space/IT/Biotech', 'Conservation, Environmental Pollution, EIA & Disaster Management', 'Internal Security: Extremism, Cyber Security, Money Laundering & Border Management'] },
      { id: 'up-gs4', title: 'GS Paper IV: Ethics, Integrity and Aptitude', topicType: 'official', subtopics: ['Ethics & Human Interface, Attitude, Emotional Intelligence & Moral Thinkers', 'Public/Civil Service Values, Probity in Governance, RTI, Citizen’s Charters & Code of Conduct', 'Case Studies on Administrative Dilemmas, Conflict of Interest & Ethical Decision Making'] },
      { id: 'up-essay', title: 'Essay & Compulsory Language Papers', topicType: 'official', subtopics: ['Two Essays (Philosophical & Socio-Economic/Governance Themes)', 'Compulsory Indian Language (300 Marks Qualifying) & English Paper (300 Marks Qualifying)', 'Optional Subject Papers I & II (500 Marks Total)'] }
    ]
  },

  'state-psc-specifics': {
    id: 'state-psc-specifics',
    name: 'State PSC Governance, Society, Bifurcation & Economy',
    shortName: 'State Society & Governance',
    code: 'STATE-PSC',
    description:
      'State-specific modules for APPSC & TGPSC Group 1/2/3/4 covering AP/Telangana History, Bifurcation Act 2014, State Economy, Welfare Schemes, and Paper-specific Governance.',
    chapters: [
      { id: 'sp-ap-history-culture', title: 'History & Cultural Heritage of Andhra Pradesh', topicType: 'official', subtopics: ['Prehistoric Cultures, Satavahanas, Ikshvakus, Vishnukundins & Eastern Chalukyas', 'Kakatiyas, Reddi Kingdoms, Vijayanagara Empire & Qutb Shahis', 'Modern Andhra: Socio-Cultural Awakening (Kandukuri, Gurajada), Vandemataram, Andhra Movement & State Formation (1953/1956)'] },
      { id: 'sp-ap-economy-bifurcation', title: 'AP Economy, Planning & Reorganization Act 2014', topicType: 'official', subtopics: ['AP Reorganization Act 2014: Administrative, Financial & River Water Disputes', 'AP State GDP, Agriculture, Industrial Policy, Blue Economy & Ports', 'AP Welfare & Development Schemes, Grama/Ward Sachivalayam Governance'] },
      { id: 'sp-tg-movement', title: 'Telangana Movement & State Formation (1948–2014)', topicType: 'official', subtopics: ['The Idea of Telangana (1948–1970): Mulki Rules, Gentlemen’s Agreement, 1969 Agitation', 'Mobilization Phase (1971–1990): Six-Point Formula, Naxalite & Regional Identity Movements', 'Towards Formation (1991–2014): 2001–2014 Agitation, Political Parties, Srikrishna Committee & AP Reorganization Act 2014'] },
      { id: 'sp-tg-society-economy', title: 'Telangana Society, Culture, Economy & Schemes', topicType: 'official', subtopics: ['Telangana Society: Caste, Tribe, Women, Youth & Social Movements', 'Telangana Arts, Crafts, Festivals, Literature & Heritage Sites', 'Telangana Economy: GSDP, Agriculture, Irrigation (Kaleshwaram), IT/Industrial Corridors & Welfare Initiatives'] }
    ]
  },

  'specialized-clinical-hindi': {
    id: 'specialized-clinical-hindi',
    name: 'Specialized Domain Papers (Medical, Hindi Translation, Paramedical & Statistical)',
    shortName: 'Specialized Domain Syllabus',
    code: 'SPEC-DOM',
    description:
      'Specialized official syllabi for UPSC CMS (Medical), UPSC IES/ISS (Economics & Statistics), SSC JHT (Hindi/English Translation), and RRB Paramedical cadres.',
    chapters: [
      { id: 'sd-upsc-cms', title: 'Medical Sciences (UPSC CMS Paper I & II)', topicType: 'official', subtopics: ['General Medicine (Cardiology, Neurology, Infectious Diseases, Endocrinology, Emergency Medicine)', 'Paediatrics (Neonatology, Immunization, Growth & Developmental Disorders)', 'Surgery (General, Trauma, Urology, ENT, Ophthalmology Basics)', 'Gynaecology & Obstetrics and Preventive & Social Medicine (Epidemiology, National Health Programmes)'] },
      { id: 'sd-ssc-jht', title: 'Hindi & English Grammar + Translation (SSC JHT)', topicType: 'official', subtopics: ['General Hindi: Sandhi, Samas, Muhavare, Vilom, Paryayvachi, Shuddha-Ashuddha & Official Administrative Terminology', 'General English: Grammar, Comprehension, Idioms & Administrative Vocabulary', 'Paper II Descriptive: Two Passages (Hindi to English & English to Hindi) + Two Essays (Hindi & English)'] },
      { id: 'sd-rrb-paramedical', title: 'Professional Ability (RRB Paramedical)', topicType: 'official', subtopics: ['Nursing Superintendent: Anatomy, Physiology, Medical-Surgical Nursing, Midwifery, Community Health & Pharmacology', 'Pharmacist: Pharmaceutics, Pharmaceutical Chemistry, Pharmacology & Hospital Pharmacy', 'Lab Superintendent / Radiographer / Physiotherapist Discipline Modules'] },
      { id: 'sd-upsc-ies-iss', title: 'Economics & Statistics Core (UPSC IES / ISS)', topicType: 'official', subtopics: ['IES: Microeconomics, Macroeconomics, Econometrics, International Economics, Public Finance & Indian Economy', 'ISS: Probability, Statistical Inference, Linear Models, Sampling Theory, Design of Experiments & Official Statistics'] }
    ]
  }
};
