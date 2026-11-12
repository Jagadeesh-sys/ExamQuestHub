/**
 * Sample notification import datasets for Admin Bulk Import.
 * Contains authentic samples showcasing all application statuses:
 * - UPCOMING (Start date > current IST date)
 * - APPLICATION OPEN (Start date <= current IST date <= Last date)
 * - CLOSED (Last date < current IST date)
 */

export const SAMPLE_NOTIFICATIONS_JSON = JSON.stringify([
  {
    "id": "rrb-ntpc-graduate-2026",
    "title": {
      "en": "RRB NTPC Graduate Recruitment 2026 — 3,548 Vacancies",
      "te": "RRB NTPC గ్రాడ్యుయేట్ ఉద్యోగాల భర్తీ 2026"
    },
    "organization": {
      "en": "Railway Recruitment Boards (RRBs), Ministry of Railways",
      "te": "రైల్వే రిక్రూట్‌మెంట్ బోర్డులు (RRB)"
    },
    "category": "RRB and Railway",
    "region": "All India",
    "publishedAt": "2026-11-05",
    "applicationStartDate": "2026-11-20",
    "applicationLastDate": "2026-12-20",
    "examDate": "2027-02-15",
    "admitCardDate": "2027-02-05",
    "resultDate": "2027-04-10",
    "vacancies": "3,548",
    "officialUrl": "https://rrb.indianrailways.gov.in/",
    "applyUrl": "https://www.rrbapply.gov.in/",
    "pdfUrl": "https://rrbapply.gov.in",
    "summary": {
      "en": "Indian Railways invites online applications for 3,548 Graduate-level NTPC vacancies under CEN 06/2026. Posts include Goods Train Manager, Senior Clerk, and Ticket Supervisor.",
      "te": "భారతీయ రైల్వేలో CEN 06/2026 కింద 3,548 గ్రాడ్యుయేట్ స్థాయి NTPC పోస్టుల భర్తీకి దరఖాస్తులు ఆహ్వానిస్తున్నారు."
    }
  },
  {
    "id": "ap-dsc-teacher-recruitment-2026",
    "title": {
      "en": "AP DSC 2026 Teacher Recruitment (SGT, School Assistant, TGT, PGT)",
      "te": "ఆంధ్రప్రదేశ్ డీఎస్సీ (AP DSC) 2026 ఉపాధ్యాయ నియామక నోటిఫికేషన్"
    },
    "organization": {
      "en": "Department of School Education, Andhra Pradesh (AP DSC)",
      "te": "పాఠశాల విద్యాశాఖ, ఆంధ్రప్రదేశ్ ప్రభుత్వం"
    },
    "category": "Teaching",
    "region": "Andhra Pradesh",
    "notificationNo": "01/AP-DSC/2026",
    "publishedAt": "2026-11-08",
    "applicationStartDate": "2026-11-10",
    "applicationLastDate": "2026-11-30",
    "examDate": "2026-12-28",
    "admitCardDate": "2026-12-18",
    "resultDate": "2027-01-25",
    "vacancies": "16,347",
    "officialUrl": "https://apdsc.apcfss.in",
    "applyUrl": "https://apdsc.apcfss.in",
    "pdfUrl": "https://apdsc.apcfss.in",
    "summary": {
      "en": "Government of Andhra Pradesh has commenced the mega teacher recruitment process through AP DSC 2026 for 16,347 teacher vacancies.",
      "te": "ఆంధ్రప్రదేశ్ ప్రభుత్వం 16,347 టీచర్ పోస్టుల భర్తీకి మెగా డీఎస్సీ 2026 దరఖాస్తు ప్రక్రియను ప్రారంభించింది."
    }
  },
  {
    "id": "isro-ursc-2026",
    "title": {
      "en": "ISRO URSC Recruitment 2026 — 61 Technician & Driver Vacancies",
      "te": "ISRO URSC ఉద్యోగాల భర్తీ 2026 — 61 ఖాళీలు"
    },
    "organization": {
      "en": "Indian Space Research Organisation (ISRO) — U R Rao Satellite Centre",
      "te": "భారత అంతరిక్ష పరిశోధన సంస్థ (ISRO - URSC)"
    },
    "category": "GATE, ISRO, and other technical examinations",
    "region": "All India",
    "publishedAt": "2026-10-24",
    "applicationStartDate": "2026-10-28",
    "applicationLastDate": "2026-11-25",
    "examDate": "2026-12-20",
    "vacancies": "61",
    "officialUrl": "https://www.isro.gov.in/ViewAllOpportunities.html",
    "applyUrl": "https://cdn.digialm.com/EForms/configuredHtml/1258/102567/istcBOtjGQvBFFaOvU/Index.html",
    "summary": {
      "en": "ISRO U R Rao Satellite Centre invites applications for 61 vacancies under Advertisement URSC:04:2026.",
      "te": "ISRO U R Rao Satellite Centreలో URSC:04:2026 ప్రకటన కింద 61 పోస్టుల భర్తీకి దరఖాస్తులు ఆహ్వానిస్తున్నారు."
    }
  },
  {
    "id": "isro-sdsc-shar-2026",
    "title": {
      "en": "ISRO SDSC SHAR Recruitment 2026 — 97 Vacancies",
      "te": "ISRO SDSC SHAR ఉద్యోగాల భర్తీ 2026 — 97 ఖాళీలు"
    },
    "organization": {
      "en": "Indian Space Research Organisation (ISRO) — SDSC SHAR",
      "te": "భారత అంతరిక్ష పరిశోధన సంస్థ (ISRO - SDSC SHAR)"
    },
    "category": "GATE, ISRO, and other technical examinations",
    "region": "All India",
    "publishedAt": "2026-10-15",
    "applicationStartDate": "2026-10-19",
    "applicationLastDate": "2026-11-09",
    "examDate": "2026-12-10",
    "vacancies": "97",
    "officialUrl": "https://apps.shar.gov.in/Recruitment/",
    "applyUrl": "https://apps.shar.gov.in/Recruitment/",
    "summary": {
      "en": "ISRO Satish Dhawan Space Centre SHAR invites applications for 97 vacancies. Applications closed on November 9, 2026.",
      "te": "ISRO సతీష్ ధావన్ స్పేస్ సెంటర్ SHARలో 97 పోస్టుల దరఖాస్తు ప్రక్రియ ముగిసింది."
    }
  }
], null, 2);

export const SAMPLE_MINIMAL_TEMPLATE_JSON = JSON.stringify([
  {
    "title": "AP DSC 2026 Teacher Recruitment",
    "organization": "Department of School Education, Andhra Pradesh",
    "category": "Teaching",
    "region": "Andhra Pradesh",
    "notificationNo": "01/AP-DSC/2026",
    "publishedAt": "2026-11-08",
    "applicationStartDate": "2026-11-10",
    "applicationLastDate": "2026-11-30",
    "examDate": "2026-12-28",
    "admitCardDate": "2026-12-18",
    "resultDate": "2027-01-25",
    "vacancies": "16,347",
    "officialUrl": "https://apdsc.apcfss.in",
    "applyUrl": "https://apdsc.apcfss.in",
    "pdfUrl": "https://apdsc.apcfss.in",
    "summary": "Government of Andhra Pradesh mega teacher recruitment process for 16,347 teacher vacancies."
  }
], null, 2);
