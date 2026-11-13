/**
 * Engineering Discipline Blueprints (2026)
 * Separate, comprehensive syllabi for Civil, Mechanical, Electrical, Electronics,
 * Computer Science, and Information Technology including Engineering Mathematics,
 * core discipline subjects, and practical/lab topics.
 */

export const ENGINEERING_BLUEPRINTS = {
  'eng-civil': {
    id: 'eng-civil',
    name: 'Civil Engineering (Technical & Engineering Mathematics)',
    shortName: 'Civil Engineering',
    code: 'CE',
    description:
      'Complete technical syllabus for SSC JE Civil, RRB JE Civil, GATE CE, UPSC ESE Civil, and State AE/AEE/JE examinations.',
    chapters: [
      {
        id: 'ce-eng-math',
        title: 'Engineering Mathematics (Civil)',
        topicType: 'official',
        subtopics: [
          'Linear Algebra: Matrix algebra, systems of linear equations, eigenvalues and eigenvectors',
          'Calculus: Functions of single variable, limit, continuity, differentiability, partial derivatives, maxima/minima, multiple integrals',
          'Differential Equations: First-order linear/non-linear, higher-order linear ODEs, Cauchy-Euler equations, PDEs (wave, heat, Laplace)',
          'Probability & Statistics: Mean, median, mode, standard deviation, Binomial, Poisson & Normal distributions',
          'Numerical Methods: Newton-Raphson, Trapezoidal & Simpson’s rules, Runge-Kutta method'
        ]
      },
      {
        id: 'ce-building-materials',
        title: 'Building Materials & Construction Technology',
        topicType: 'official',
        subtopics: [
          'Stone, Bricks, Tiles, Lime, Timber & Paints: Physical/chemical properties and IS standard tests',
          'Cement: Portland cement composition, hydration, setting time, soundness & grades (OPC 33/43/53, PPC)',
          'Concrete Technology: Aggregates, water-cement ratio, workability (slump, compaction factor), mix design, curing & NDT',
          'Estimating, Costing & Valuation: Specifications, rate analysis, bar bending schedule, depreciation & tender process'
        ]
      },
      {
        id: 'ce-som-structures',
        title: 'Strength of Materials & Structural Analysis',
        topicType: 'official',
        subtopics: [
          'Stress-Strain Relations, Elastic Constants, Principal Stresses & Mohr’s Circle',
          'SFD & BMD for Determinate Beams, Bending & Shear Stress Distribution, Torsion of Circular Shafts',
          'Deflection of Beams (Macaulay, Moment-Area, Conjugate Beam) & Columns (Euler & Rankine formulas)',
          'Indeterminate Structures: Force & Displacement Methods, Slope-Deflection, Moment Distribution, Influence Line Diagrams & Arches'
        ]
      },
      {
        id: 'ce-rcc-steel',
        title: 'Design of Concrete (RCC) & Steel Structures',
        topicType: 'official',
        subtopics: [
          'RCC (IS 456:2000): Working Stress & Limit State Methods, Singly/Doubly Reinforced Beams, T-Beams',
          'Shear, Bond, Development Length, Torsion, One-Way/Two-Way Slabs, Columns & Footings, Prestressed Concrete',
          'Steel Structures (IS 800:2007): Riveted, Bolted & Welded Connections, Tension/Compression Members, Plate Girders & Plastic Analysis'
        ]
      },
      {
        id: 'ce-geotech',
        title: 'Soil Mechanics & Foundation Engineering',
        topicType: 'official',
        subtopics: [
          'Three-Phase Soil System, Index Properties, Atterberg Limits & Soil Classification',
          'Permeability (Darcy’s Law), Seepage, Flow Nets, Effective Stress & Capillarity',
          'Compaction (Proctor Test), Terzaghi’s Consolidation Theory & Shear Strength (Mohr-Coulomb, Triaxial, Direct Shear)',
          'Earth Pressure Theories (Rankine, Coulomb), Slope Stability, Bearing Capacity (Terzaghi) & Shallow/Pile Foundations'
        ]
      },
      {
        id: 'ce-fluid-hydraulics',
        title: 'Fluid Mechanics, Hydraulics & Irrigation Engineering',
        topicType: 'official',
        subtopics: [
          'Fluid Properties, Hydrostatic Pressure, Buoyancy & Kinematics/Dynamics (Bernoulli, Euler, Venturimeter)',
          'Laminar & Turbulent Flow in Pipes, Moody’s Chart, Boundary Layer, Dimensional Analysis & Hydraulic Turbines/Pumps',
          'Open Channel Flow: Uniform Flow (Manning, Chezy), Specific Energy, Hydraulic Jump & GVF Profiles',
          'Hydrology & Irrigation: Precipitation, Runoff, Hydrographs, Crop Water Requirement, Canal Design (Kennedy/Lacey) & Dams/Spillways'
        ]
      },
      {
        id: 'ce-env-trans-survey',
        title: 'Environmental, Transportation & Surveying Engineering',
        topicType: 'official',
        subtopics: [
          'Water Supply: Demand forecasting, quality parameters, coagulation, filtration, disinfection & distribution networks',
          'Wastewater & Solid Waste: BOD/COD, activated sludge process, trickling filters, air/noise pollution & EIA',
          'Highway & Railway Engineering: Geometric design (SSD, OSD, Superelevation), Pavement design (CBR, Westergaard), Traffic engineering & Track geometry',
          'Surveying: Chain, Compass, Levelling, Theodolite, Tachometry, Curves, Total Station & GIS/GPS Basics'
        ]
      },
      {
        id: 'ce-practical-lab',
        title: 'Practical, AutoCAD & Field Testing Topics',
        topicType: 'recommended',
        subtopics: [
          'Lab Testing Procedures: Triaxial Shear, Slump Cone, Cube Compression, Los Angeles Abrasion & Marshall Stability',
          'IS Codes Quick Reference (IS 456, IS 800, IS 1893, IRC 37) & AutoCAD Structural Drafting Standards'
        ]
      }
    ]
  },

  'eng-mechanical': {
    id: 'eng-mechanical',
    name: 'Mechanical Engineering (Technical & Engineering Mathematics)',
    shortName: 'Mechanical Engineering',
    code: 'ME',
    description:
      'Complete technical syllabus for SSC JE Mechanical, RRB JE Mechanical, GATE ME, UPSC ESE Mechanical, and State AE/AEE/JE examinations.',
    chapters: [
      {
        id: 'me-eng-math',
        title: 'Engineering Mathematics (Mechanical)',
        topicType: 'official',
        subtopics: [
          'Linear Algebra, Calculus, Vector Calculus (Gradient, Divergence, Curl, Stokes/Gauss Theorems)',
          'Ordinary & Partial Differential Equations, Laplace Transforms & Complex Variables',
          'Probability, Statistics & Numerical Methods'
        ]
      },
      {
        id: 'me-mechanics-som',
        title: 'Engineering Mechanics & Strength of Materials',
        topicType: 'official',
        subtopics: [
          'Free-Body Diagrams, Equilibrium, Friction, Trusses, Virtual Work, Kinematics & Kinetics of Rigid Bodies',
          'Stress & Strain, Mohr’s Circle, Thermal Stresses, Shear Force & Bending Moment Diagrams',
          'Bending/Shear Stresses in Beams, Deflection, Torsion, Thin Cylinders & Buckling of Columns'
        ]
      },
      {
        id: 'me-tom-design',
        title: 'Theory of Machines & Machine Design',
        topicType: 'official',
        subtopics: [
          'Planar Mechanisms, Inversion, Velocity & Acceleration Analysis (Instantaneous Centres)',
          'Gears & Gear Trains (Involute Profile, Interference), Cams, Flywheels, Governors & Balancing',
          'Free & Forced Vibrations (1-DOF, Damping, Critical Speed)',
          'Machine Design: Static/Fatigue Failure Theories (Goodman, Soderberg), Bolted/Riveted/Welded Joints, Shafts, Keys, Bearings & Clutches'
        ]
      },
      {
        id: 'me-thermo-power',
        title: 'Thermodynamics, IC Engines, Power Plant & RAC',
        topicType: 'official',
        subtopics: [
          'Zeroth, First & Second Laws of Thermodynamics; Entropy, Exergy, Pure Substances & Steam Tables',
          'Gas & Vapour Power Cycles: Carnot, Otto, Diesel, Dual, Brayton & Rankine Cycles',
          'IC Engines: Spark & Compression Ignition, Detonation, Octane/Cetane Numbers, Emissions & Performance',
          'Steam Boilers, Nozzles, Steam Turbines, Compressors & Refrigeration/Air Conditioning (VCR, Psychrometry)'
        ]
      },
      {
        id: 'me-fluid-heat',
        title: 'Fluid Mechanics, Hydraulic Machines & Heat Transfer',
        topicType: 'official',
        subtopics: [
          'Fluid Statics, Kinematics, Bernoulli’s Equation, Viscous Flow (Hagen-Poiseuille), Pipe Losses & Boundary Layer',
          'Hydraulic Turbines (Pelton, Francis, Kaplan) & Centrifugal Pumps (Specific Speed, Cavitation)',
          'Heat Transfer: Conduction (Fourier, Fins), Convection (Nusselt, Reynolds, Prandtl), Heat Exchangers (LMTD, NTU) & Radiation'
        ]
      },
      {
        id: 'me-manufacturing-ie',
        title: 'Manufacturing Science, Metrology & Industrial Engineering',
        topicType: 'official',
        subtopics: [
          'Engineering Materials, Iron-Carbon Phase Diagram, Heat Treatment (Annealing, Normalizing, Tempering)',
          'Casting, Forming (Forging, Rolling, Extrusion), Welding (Arc, TIG, MIG, Gas, Resistance) & Powder Metallurgy',
          'Machining & Machine Tools: Merchant’s Circle, Tool Life (Taylor’s Equation), CNC/NC Programming & Non-Traditional Machining',
          'Metrology (Limits, Fits, Tolerances, Comparators) & Industrial Engineering (PERT/CPM, Inventory EOQ, LPP, Queuing)'
        ]
      },
      {
        id: 'me-practical-lab',
        title: 'Workshop Practice, CAD/CAM & Testing Topics',
        topicType: 'recommended',
        subtopics: [
          'Boiler Mountings/Accessories Inspection, CNC G-Code/M-Code Basics & Hardness Testing (Brinell, Rockwell, Vickers)',
          'Engineering Drawing Projections, GD&T Symbols & Boiler/Turbine Safety Standards'
        ]
      }
    ]
  },

  'eng-electrical': {
    id: 'eng-electrical',
    name: 'Electrical Engineering (Technical & Engineering Mathematics)',
    shortName: 'Electrical Engineering',
    code: 'EE',
    description:
      'Complete technical syllabus for SSC JE Electrical, RRB JE Electrical, GATE EE, UPSC ESE Electrical, and State AE/AEE/DISCOM examinations.',
    chapters: [
      {
        id: 'ee-eng-math',
        title: 'Engineering Mathematics (Electrical)',
        topicType: 'official',
        subtopics: [
          'Linear Algebra, Calculus, Differential Equations & Complex Variables',
          'Laplace, Fourier & Z-Transforms; Probability, Statistics & Numerical Methods'
        ]
      },
      {
        id: 'ee-circuits-fields',
        title: 'Electric Circuits & Electromagnetic Fields',
        topicType: 'official',
        subtopics: [
          'KCL, KVL, Mesh & Nodal Analysis; Network Theorems (Thevenin, Norton, Superposition, Maximum Power)',
          'Transient Response of RL, RC & RLC Circuits; Sinusoidal Steady-State, Phasors, Resonance & 3-Phase Balanced/Unbalanced Circuits',
          'Two-Port Networks (Z, Y, ABCD, h-parameters) & Graph Theory',
          'Electrostatics, Magnetostatics, Gauss/Ampere/Faraday Laws, Maxwell’s Equations & Inductance/Capacitance Calculations'
        ]
      },
      {
        id: 'ee-machines',
        title: 'Electrical Machines',
        topicType: 'official',
        subtopics: [
          'Single-Phase & Three-Phase Transformers: Equivalent Circuit, OC/SC Tests, Efficiency, Regulation, Auto-Transformer & Vector Groups',
          'DC Machines: Construction, Armature Reaction, Commutation, Characteristics & Speed Control of DC Motors',
          'Three-Phase & Single-Phase Induction Motors: Torque-Slip Characteristics, Starting, Speed Control & Equivalent Circuit',
          'Synchronous Generators & Motors: Regulation (EMF, MMF, ZPF), V-Curves, Hunting & Fractional kW Motors'
        ]
      },
      {
        id: 'ee-power-systems',
        title: 'Power Systems & Protection',
        topicType: 'official',
        subtopics: [
          'Generation Concepts (Thermal, Hydro, Nuclear, Solar, Wind), Economic Load Dispatch & Load Factor',
          'Transmission Line Parameters (R, L, C), ABCD Parameters, Ferranti Effect, Corona, Sag & Insulators',
          'Per-Unit System, Load Flow Studies (Gauss-Seidel, Newton-Raphson), Symmetrical & Unsymmetrical Faults (Sequence Networks)',
          'Power System Stability (Swing Equation, Equal Area Criterion) & Switchgear/Protection (Relays, Circuit Breakers)'
        ]
      },
      {
        id: 'ee-control-measurements',
        title: 'Control Systems & Electrical Measurements',
        topicType: 'official',
        subtopics: [
          'Block Diagrams, Signal Flow Graphs (Mason’s Gain), Time-Domain Analysis & Routh-Hurwitz Criterion',
          'Root Locus, Bode Plots, Nyquist Criterion, Compensators (Lead/Lag) & State-Space Analysis',
          'Measurement of Voltage, Current, Power (2-Wattmeter Method), Energy Meters, Bridges (Wheatstone, Maxwell, Schering, Hay)',
          'CTs, PTs, CRO/DSO, Error Analysis & Transducers'
        ]
      },
      {
        id: 'ee-electronics-utilization',
        title: 'Analog/Digital Electronics, Power Electronics & Utilization',
        topicType: 'official',
        subtopics: [
          'Diodes, BJT, MOSFET, Op-Amps, Oscillators, Combinational/Sequential Logic & Microprocessor 8085/8086 Basics',
          'Power Semiconductor Devices (SCR, IGBT, MOSFET), Controlled Rectifiers, Choppers, Inverters & Drives',
          'Utilization of Electrical Energy: Illumination, Electric Heating, Welding, Traction & Estimating/Costing (SSC JE)'
        ]
      },
      {
        id: 'ee-practical-lab',
        title: 'Practical Wiring, IE Rules & Substation Topics',
        topicType: 'recommended',
        subtopics: [
          'Indian Electricity Rules (1956), Earthing Practices, Megger Testing & Transformer Oil Breakdown Testing',
          'Single-Line Diagrams (SLD) of 33/11 kV & 132 kV Substations'
        ]
      }
    ]
  },

  'eng-electronics': {
    id: 'eng-electronics',
    name: 'Electronics & Communication Engineering (ECE)',
    shortName: 'Electronics Engineering',
    code: 'ECE',
    description:
      'Complete technical syllabus for RRB JE Electronics, UPSC ESE E&T, GATE EC, ISRO, DRDO, and State Technical examinations.',
    chapters: [
      {
        id: 'ec-eng-math',
        title: 'Engineering Mathematics (ECE)',
        topicType: 'official',
        subtopics: [
          'Linear Algebra, Calculus, Vector Calculus, Differential Equations',
          'Complex Analysis, Probability & Random Processes, Numerical Methods'
        ]
      },
      {
        id: 'ec-networks-signals',
        title: 'Network Theory & Signals and Systems',
        topicType: 'official',
        subtopics: [
          'Network Theorems, Transient & Steady-State Analysis, Two-Port Networks & Network Synthesis',
          'Continuous & Discrete Signals, LTI Systems, Convolution, Fourier Series/Transform, Laplace & Z-Transform, Sampling Theorem'
        ]
      },
      {
        id: 'ec-edc-analog',
        title: 'Electronic Devices & Analog Circuits',
        topicType: 'official',
        subtopics: [
          'Semiconductor Physics, Energy Bands, Drift/Diffusion, PN Junction, Zener, Tunnel & LED/Photodiodes',
          'BJT, JFET, MOSFET Device Physics & Fabrication Basics',
          'Small-Signal & High-Frequency Amplifiers, Feedback Topologies, Oscillators, Op-Amps, 555 Timer & Active Filters'
        ]
      },
      {
        id: 'ec-digital-micro',
        title: 'Digital Circuits, Microprocessors & Microcontrollers',
        topicType: 'official',
        subtopics: [
          'Number Systems, Boolean Algebra, Logic Families (TTL, CMOS), Combinational & Sequential Circuits (FSMs)',
          'ADC/DAC Converters, Semiconductor Memories (RAM, ROM, EEPROM)',
          '8085/8086 Microprocessors & 8051/ARM Microcontroller Architecture, Interrupts & Assembly Interfacing'
        ]
      },
      {
        id: 'ec-comm-emft',
        title: 'Communication Systems, Control & Electromagnetics',
        topicType: 'official',
        subtopics: [
          'Analog Modulation (AM, FM, PM), Superheterodyne Receiver, Noise & SNR',
          'Digital Modulation (PCM, ASK, PSK, FSK, QAM), Information Theory (Entropy, Shannon Limit) & Error Control Coding',
          'EMFT: Maxwell’s Equations, Wave Propagation, Transmission Lines (Smith Chart), Waveguides, Antennas & Optical Fiber',
          'Control Systems: Transfer Functions, Stability, Frequency Response & State Variables'
        ]
      },
      {
        id: 'ec-practical-lab',
        title: 'PCB Design, Instrumentation & RF Lab Topics',
        topicType: 'recommended',
        subtopics: [
          'Oscilloscope Signal Diagnostics, Spectrum Analyzer, Embedded C Interfacing (UART, SPI, I2C)',
          'Verilog/VHDL Hardware Description Basics & Satellite/Radar Link Budgets'
        ]
      }
    ]
  },

  'eng-cse': {
    id: 'eng-cse',
    name: 'Computer Science Engineering (CSE)',
    shortName: 'Computer Science Engg',
    code: 'CSE',
    description:
      'Complete engineering-level Computer Science syllabus for GATE CS, ISRO Scientist CS, NIC, SSC JE CS (if notified), and State AE/Lecturer CS.',
    chapters: [
      {
        id: 'cse-eng-math',
        title: 'Engineering & Discrete Mathematics',
        topicType: 'official',
        subtopics: [
          'Propositional & First-Order Logic, Sets, Relations, Functions, Partial Orders & Lattices',
          'Combinatorics, Counting, Recurrence Relations & Generating Functions',
          'Graph Theory: Connectivity, Matching, Coloring & Planar Graphs',
          'Linear Algebra, Calculus & Probability/Statistics'
        ]
      },
      {
        id: 'cse-digital-coa',
        title: 'Digital Logic & Computer Organization',
        topicType: 'official',
        subtopics: [
          'Boolean Algebra, Minimization, Combinational & Sequential Circuits, Number Representation & IEEE 754 Floating Point',
          'Machine Instructions, Addressing Modes, ALU, Control Design, Instruction Pipelining & Hazards',
          'Memory Hierarchy (Cache, Main, Secondary), Virtual Memory & I/O Interface'
        ]
      },
      {
        id: 'cse-ds-algo',
        title: 'Programming, Data Structures & Algorithms',
        topicType: 'official',
        subtopics: [
          'C Programming, Recursion, Pointers, Abstract Data Types (Stacks, Queues, Linked Lists, Trees, Binary Heaps, Graphs)',
          'Asymptotic Time/Space Complexity, Searching, Sorting & Hashing',
          'Algorithm Design Techniques: Greedy, Dynamic Programming, Divide & Conquer, Graph Traversals & NP-Completeness'
        ]
      },
      {
        id: 'cse-toc-compiler',
        title: 'Theory of Computation & Compiler Design',
        topicType: 'official',
        subtopics: [
          'Regular Expressions, Finite Automata (DFA/NFA), Pumping Lemma & Context-Free Grammars / Pushdown Automata',
          'Turing Machines, Undecidability & Decidability',
          'Lexical Analysis, Parsing (LL, LR, SLR, LALR), Syntax-Directed Translation, Intermediate Code & Optimization'
        ]
      },
      {
        id: 'cse-os-dbms-cn',
        title: 'Operating Systems, DBMS & Computer Networks',
        topicType: 'official',
        subtopics: [
          'OS: System Calls, Processes, Threads, IPC, Concurrency, Deadlocks, CPU Scheduling, Paging & Disk Scheduling',
          'DBMS: ER Model, Relational Algebra, Tuple Calculus, SQL, Normal Forms, Transactions, Concurrency Control & Indexing',
          'CN: Framing, Error Detection, MAC, Routing Algorithms, IPv4/CIDR, TCP/UDP, Flow/Congestion Control & Application Protocols'
        ]
      },
      {
        id: 'cse-practical-lab',
        title: 'Systems Programming, Distributed Systems & Security',
        topicType: 'recommended',
        subtopics: [
          'Linux Shell Scripting, Socket Programming, Git Version Control & Containerization Basics',
          'Cloud Architecture, Cryptography & Secure Coding Practices'
        ]
      }
    ]
  },

  'eng-it': {
    id: 'eng-it',
    name: 'Information Technology (IT)',
    shortName: 'Information Technology',
    code: 'IT',
    description:
      'Complete Information Technology syllabus for GATE/CS-IT, IBPS SO IT, NIC Scientist-B, State IT Officer, and PSU IT recruitments.',
    chapters: [
      {
        id: 'it-eng-math',
        title: 'Discrete Structures & Engineering Mathematics',
        topicType: 'official',
        subtopics: [
          'Set Theory, Graph Theory, Mathematical Logic & Algebraic Structures',
          'Matrices, Calculus & Probability Distributions'
        ]
      },
      {
        id: 'it-programming-se',
        title: 'Object-Oriented Systems, Java/Python & Software Engineering',
        topicType: 'official',
        subtopics: [
          'OOP Concepts (Inheritance, Polymorphism, Design Patterns), C++/Java/Python Frameworks',
          'SDLC, Agile/DevOps, Effort Estimation (COCOMO), UML Diagrams & Software Testing/QA'
        ]
      },
      {
        id: 'it-dbms-warehousing',
        title: 'Database Systems, SQL & Data Warehousing',
        topicType: 'official',
        subtopics: [
          'Relational Schema Design, Normalization, PL/SQL, Triggers & Query Optimization',
          'NoSQL Databases, Data Warehousing (OLAP, Star/Snowflake Schema) & Data Mining Basics'
        ]
      },
      {
        id: 'it-networks-web-cloud',
        title: 'Networking, Web Technologies & Cloud Computing',
        topicType: 'official',
        subtopics: [
          'TCP/IP Suite, Routing/Switching, Wireless Networks & Network Management (SNMP)',
          'HTML5, CSS3, JavaScript, XML, JSON, RESTful Web Services & Client-Server Security',
          'Cloud Models (IaaS, PaaS, SaaS), Virtualization & Microservices'
        ]
      },
      {
        id: 'it-security-audit',
        title: 'Information Security, Cyber Forensics & IT Governance',
        topicType: 'official',
        subtopics: [
          'Symmetric/Asymmetric Encryption, PKI, SSL/TLS, Kerberos & Access Control (RBAC)',
          'OWASP Top 10 Vulnerabilities, Firewalls, Intrusion Detection & Disaster Recovery / BCP'
        ]
      }
    ]
  }
};
