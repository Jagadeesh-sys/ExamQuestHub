# ExamQuestHub — Premium Government Exam Portal

> **Tagline:** *Your Exam. Your Next Step.*

ExamQuestHub is a production-oriented, mobile-first web portal for government job aspirants in India. It provides verified recruitment notifications, direct official application links, admit cards, exam schedules, results, bilingual current affairs (English & Telugu), daily GK practice quizzes, syllabi, and authentic previous-year question papers.

---

## 🌟 Key Features

1. **Verified Notification Directory (`/jobs`)**
   - Detailed job breakdowns: Qualification, age limits, application fees, vacancy breakdown, selection process, and salary scale.
   - Separate confirmed facts from editorial summaries.
   - Direct official board application and PDF gazette links.
   - Filter by Board (UPSC, SSC, State PSC, Banking, Railway RRB, Defence, Teaching, Technical/ISRO), Region (All India, AP, TS), and Status.

2. **Admit Cards & Schedules (`/admit-cards`)**
   - Direct download links for hall tickets, city slips, and exam shift timings.

3. **Results & Merit Lists (`/results`)**
   - Official result PDFs, provisional keys, and cut-off announcements.

4. **Bilingual Current Affairs (`/current-affairs`)**
   - Daily verified news summaries cross-checked with PIB, RBI, and Gazette notifications.
   - English and Telugu side-by-side localization.

5. **Interactive Daily GK Practice (`/gk-practice`)**
   - Topic-wise MCQs with instant answer revelation, detailed explanations, and score tracking.
   - Distinct labeling separating official Previous-Year Questions (PYQ) from original self-assessment questions.

6. **Previous-Year Question Papers & Syllabi (`/previous-papers`, `/study-material`)**
   - Authentic past question papers with solutions and stage-wise exam syllabus breakdowns.

7. **Protected Admin Dashboard (`/admin`)**
   - Role-based Firebase Authentication.
   - Real database counters (Published, Drafts, Needs Verification, Closed).
   - Full CRUD management for notifications, current affairs, GK questions, and study materials.

---

## 🛠 Technology Stack

- **Frontend:** React 18+ (JavaScript & JSX only), Vite
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Styling:** Tailwind CSS v4 with custom brand tokens:
  - Primary Navy: `#12345A`
  - Deep Navy: `#0B1F3A`
  - Primary Blue: `#2468B4`
  - Sky Blue: `#EAF3FF`
  - Accent Gold: `#F2BE4F`
  - Background: `#F6F8FC`
  - Card Background: `#FFFFFF`
- **Database & Auth:** Firebase Authentication & Cloud Firestore (with automated offline/demo persistence fallback)
- **Deployment Target:** Vercel / Cloud Run

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/examquesthub.git
cd examquesthub
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Firebase Web App configuration:
```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-id"
VITE_FIREBASE_APP_ID="your-app-id"
```
*(Note: If Firebase credentials are not provided initially, ExamQuestHub gracefully runs in persistent local demonstration mode with verified sample records.)*

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🔒 Creating the First Admin & Deploying Security Rules

1. In the [Firebase Console](https://console.firebase.google.com):
   - Enable **Email/Password** under **Authentication > Sign-in method**.
   - Create your administrator user account (e.g. `admin@examquesthub.com`).
2. Go to **Firestore Database** and create a collection named `admins`.
3. Create a document where the Document ID is the admin's `UID`, containing:
   ```json
   {
     "email": "admin@examquesthub.com",
     "role": "SuperAdmin",
     "createdAt": "2025-01-01T00:00:00Z"
   }
   ```
4. Deploy the security rules from `firestore.rules`:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project in your [Vercel Dashboard](https://vercel.com).
3. The included `vercel.json` automatically configures SPA client-side routing rewrites (`/* -> /index.html`).
4. Add your `VITE_FIREBASE_*` environment variables in the Vercel Project Settings.
5. In the Firebase Console under **Authentication > Settings > Authorized domains**, add your Vercel deployment domain (e.g. `examquesthub.vercel.app`).
6. Deploy!

---

## ⚖️ Statutory Disclaimer

> **ExamQuestHub is an independent educational information platform. It is not affiliated with any government organization.** All job vacancy details, eligibility criteria, examination schedules, and fees must be verified directly from the respective official recruitment board gazettes.
