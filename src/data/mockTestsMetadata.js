/**
 * Lightweight mock-test catalogue metadata.
 *
 * This is intentionally kept in its own module (separate from `mockTestsData.js`)
 * so that pages which only need the mock list — HomePage, MockTestsHubPage — do
 * not pull the entire question bank (~7600 lines) into the initial bundle.
 * The heavy `MOCK_QUESTIONS_DATABASE` is only loaded by the lazy MockTestEnginePage.
 */

export const MOCK_TESTS_METADATA = [
  {
    "id": "ca-mock-01",
    "code": "CA-MOCK-01",
    "month": "December 2025",
    "title": "Dec 2025 Full Mock (76 Qs)",
    "subtitle": "Complete monthly current affairs for UPSC, SSC, Banking & RRB",
    "questionsCount": 76,
    "timeMinutes": 60,
    "marks": 76,
    "badgeText": "76Q",
    "tags": [
      "76 MCQs",
      "60 Mins",
      "Practice Mode",
      "Solutions"
    ],
    "cardBg": "bg-[#FDF0E6]",
    "cardBorder": "border-[#F8D8C2]",
    "badgeBg": "bg-[#1F2937]",
    "badgeTextCol": "text-white",
    "pillBg": "bg-white",
    "pdfUrl": "/assets/aistudio/December_2025_Current_Affairs_MCQs_fea0a8ff.pdf",
    "pdfFileName": "December_2025_Current_Affairs_MCQs.pdf",
    "difficultyStats": {
      "easy": 26,
      "medium": 28,
      "hard": 22
    }
  },
  {
    "id": "ca-mock-02",
    "code": "CA-MOCK-02",
    "month": "November 2025",
    "title": "Nov 2025 Full Mock (94 Qs)",
    "subtitle": "Comprehensive 94 questions set with Easy, Medium, Hard breakdown",
    "questionsCount": 94,
    "timeMinutes": 70,
    "marks": 94,
    "badgeText": "94Q",
    "tags": [
      "94 MCQs",
      "70 Mins",
      "Practice Mode",
      "Solutions",
      "Easy · 31Q",
      "Med · 37Q",
      "Hard · 26Q"
    ],
    "cardBg": "bg-[#E7F7ED]",
    "cardBorder": "border-[#C6EFD5]",
    "badgeBg": "bg-[#D1FAE5]",
    "badgeTextCol": "text-[#065F46]",
    "pillBg": "bg-white",
    "pdfUrl": "/assets/aistudio/November_2025_Current_Affairs_MCQs_106d2ab4.pdf",
    "pdfFileName": "November_2025_Current_Affairs_MCQs.pdf",
    "difficultyStats": {
      "easy": 31,
      "medium": 37,
      "hard": 26
    }
  },
  {
    "id": "ca-mock-03",
    "code": "CA-MOCK-03",
    "month": "October 2025",
    "title": "Oct 2025 Full Mock (80 Qs)",
    "subtitle": "Nobel prizes, polity amendments, defence milestones & sports awards",
    "questionsCount": 80,
    "timeMinutes": 60,
    "marks": 80,
    "badgeText": "80Q",
    "tags": [
      "80 MCQs",
      "60 Mins",
      "Practice Mode",
      "Solutions"
    ],
    "cardBg": "bg-[#EFEAFF]",
    "cardBorder": "border-[#DCD2FD]",
    "badgeBg": "bg-[#F43F5E]",
    "badgeTextCol": "text-white",
    "pillBg": "bg-white",
    "pdfUrl": "/assets/aistudio/October_2025_Current_Affairs_MCQs_9e8d634c.pdf",
    "pdfFileName": "October_2025_Current_Affairs_MCQs.pdf",
    "difficultyStats": {
      "easy": 28,
      "medium": 32,
      "hard": 20
    }
  },
  {
    "id": "ca-mock-04",
    "code": "CA-MOCK-04",
    "month": "November 2025",
    "title": "Nov 2025 Set 1 (51 Qs)",
    "subtitle": "Fast-paced revision set targeting high-frequency examination topics",
    "questionsCount": 51,
    "timeMinutes": 40,
    "marks": 51,
    "badgeText": "51Q",
    "tags": [
      "51 MCQs",
      "40 Mins",
      "Practice Mode",
      "Solutions",
      "Easy · 19Q",
      "Med · 19Q",
      "Hard · 13Q"
    ],
    "cardBg": "bg-[#E8F4FD]",
    "cardBorder": "border-[#C9E6FB]",
    "badgeBg": "bg-[#0284C7]",
    "badgeTextCol": "text-white",
    "pillBg": "bg-white",
    "pdfUrl": "/assets/aistudio/November_2025_Current_Affairs_MCQs_106d2ab4.pdf",
    "pdfFileName": "November_2025_Current_Affairs_Set1.pdf",
    "difficultyStats": {
      "easy": 19,
      "medium": 19,
      "hard": 13
    }
  },
  {
    "id": "ca-mock-05",
    "code": "CA-MOCK-05",
    "month": "Oct, Nov & Dec 2025",
    "title": "Oct, Nov & Dec 2025 Mega Grand Mock",
    "subtitle": "100 curated high-yield questions spanning Q4 2025 national & global affairs",
    "questionsCount": 100,
    "timeMinutes": 80,
    "marks": 100,
    "badgeText": "100Q",
    "tags": [
      "100 MCQs",
      "80 Mins",
      "Practice Mode",
      "Solutions",
      "High-Yield",
      "All Subjects"
    ],
    "cardBg": "bg-[#FCE7F3]",
    "cardBorder": "border-[#FBCFE8]",
    "badgeBg": "bg-[#C026D3]",
    "badgeTextCol": "text-white",
    "pillBg": "bg-white",
    "pdfUrl": "/assets/aistudio/December_2025_Current_Affairs_MCQs_fea0a8ff.pdf",
    "pdfFileName": "Q4_2025_Mega_Grand_Mock.pdf",
    "difficultyStats": {
      "easy": 35,
      "medium": 45,
      "hard": 20
    }
  },
  {
    "id": "ca-mock-06",
    "code": "CA-MOCK-06",
    "month": "January 2026",
    "title": "Jan 2026 Full Mock (94 Qs)",
    "subtitle": "77th Republic Day parade themes, economic surveys, appointments & defence drills",
    "questionsCount": 94,
    "timeMinutes": 70,
    "marks": 94,
    "badgeText": "94Q",
    "tags": [
      "94 MCQs",
      "70 Mins",
      "Practice Mode",
      "Solutions",
      "77th Republic Day",
      "Budget Eve"
    ],
    "cardBg": "bg-[#FEF9C3]",
    "cardBorder": "border-[#FDE68A]",
    "badgeBg": "bg-[#D97706]",
    "badgeTextCol": "text-white",
    "pillBg": "bg-white",
    "pdfUrl": "/assets/aistudio/January_2026_Current_Affairs_MCQ_31a6a736.pdf",
    "pdfFileName": "January_2026_Current_Affairs_MCQ.pdf",
    "difficultyStats": {
      "easy": 32,
      "medium": 40,
      "hard": 22
    }
  }
];

export default MOCK_TESTS_METADATA;
