import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { lazyWithRetry } from './utils/lazyWithRetry.js';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MobileBottomNav from './components/MobileBottomNav.jsx';
import PWAInstallBanner from './components/PWAInstallBanner.jsx';
import RouteSeo from './components/RouteSeo.jsx';
import LoadingIndicator from './components/LoadingIndicator.jsx';
import SplashOnboarding, { ONBOARDING_STORAGE_KEY } from './components/SplashOnboarding.jsx';

import HomePage from './pages/HomePage.jsx';

// Resilient code-splitting with automatic recovery on stale chunk deployment errors
const JobsPage = lazyWithRetry(() => import('./pages/JobsPage.jsx'), 'JobsPage');
const JobDetailPage = lazyWithRetry(() => import('./pages/JobDetailPage.jsx'), 'JobDetailPage');
const AdmitCardsPage = lazyWithRetry(() => import('./pages/AdmitCardsPage.jsx'), 'AdmitCardsPage');
const ResultsPage = lazyWithRetry(() => import('./pages/ResultsPage.jsx'), 'ResultsPage');
const CurrentAffairsPage = lazyWithRetry(() => import('./pages/CurrentAffairsPage.jsx'), 'CurrentAffairsPage');
const CurrentAffairDetailPage = lazyWithRetry(() => import('./pages/CurrentAffairDetailPage.jsx'), 'CurrentAffairDetailPage');
const GKPracticePage = lazyWithRetry(() => import('./pages/GKPracticePage.jsx'), 'GKPracticePage');
const PreviousPapersPage = lazyWithRetry(() => import('./pages/PreviousPapersPage.jsx'), 'PreviousPapersPage');
const StudyMaterialPage = lazyWithRetry(() => import('./pages/StudyMaterialPage.jsx'), 'StudyMaterialPage');
const SyllabusHubPage = lazyWithRetry(() => import('./pages/SyllabusHubPage.jsx'), 'SyllabusHubPage');
const SyllabusDetailPage = lazyWithRetry(() => import('./pages/SyllabusDetailPage.jsx'), 'SyllabusDetailPage');
const MockTestsHubPage = lazyWithRetry(() => import('./pages/MockTestsHubPage.jsx'), 'MockTestsHubPage');
const MockCategoryPage = lazyWithRetry(() => import('./pages/MockCategoryPage.jsx'), 'MockCategoryPage');
const MockSubjectPage = lazyWithRetry(() => import('./pages/MockSubjectPage.jsx'), 'MockSubjectPage');
const TestSeriesPage = lazyWithRetry(() => import('./pages/TestSeriesPage.jsx'), 'TestSeriesPage');
const MockTestEnginePage = lazyWithRetry(() => import('./pages/MockTestEnginePage.jsx'), 'MockTestEnginePage');
const AdminPage = lazyWithRetry(() => import('./pages/AdminPage.jsx'), 'AdminPage');
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage.jsx'), 'NotFoundPage');

// Scroll to top upon route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Fallback shown while a lazily loaded route chunk is being fetched.
function RouteLoadingFallback() {
  return <LoadingIndicator variant="route" label="Loading verified exams & alerts…" />;
}

function AppLayout({ children, introOpen }) {
  const { pathname } = useLocation();

  // Test engine / Agree & Continue page is /mocks/:mockId
  // Exclude hub pages: /mocks, /mocks/category/*, /mocks/series/*
  const isMockEngine =
    pathname.startsWith('/mocks/') &&
    !pathname.startsWith('/mocks/category') &&
    !pathname.startsWith('/mocks/series');

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] text-[#182B45] selection:bg-[#EAF3FF] selection:text-[#12345A] overflow-x-hidden w-full">
      {!isMockEngine && <Header />}
      <main className={`flex-1 ${!isMockEngine ? 'pb-16 lg:pb-0' : ''}`}>
        {children}
      </main>
      {!isMockEngine && <Footer />}
      {!isMockEngine && !introOpen && <PWAInstallBanner />}
      {!isMockEngine && <MobileBottomNav />}
    </div>
  );
}

export default function App() {
  const [introState, setIntroState] = useState(() => {
    if (typeof window === 'undefined') {
      return { open: false, showOnboarding: false };
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('skipSplash') === '1') {
      return { open: false, showOnboarding: false };
    }
    const forceTour = params.get('tour') === '1' || params.get('onboarding') === '1';
    const isMockDirectLink =
      window.location.pathname.startsWith('/mocks/') &&
      !window.location.pathname.startsWith('/mocks/category') &&
      !window.location.pathname.startsWith('/mocks/series');

    if (forceTour) {
      return { open: true, showOnboarding: true };
    }
    if (isMockDirectLink) {
      return { open: false, showOnboarding: false };
    }

    let onboardingDone = false;
    try {
      onboardingDone = localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
    } catch {
      onboardingDone = false;
    }

    return {
      open: true,
      showOnboarding: !onboardingDone
    };
  });

  // React has committed its first render — remove the document-level boot overlay
  // defined in index.html so users never sit on a blank or endless loading screen.
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.__EQH_BOOT_DONE === 'function') {
      window.__EQH_BOOT_DONE();
    }
  }, []);

  // Allow Header/Footer "Welcome Tour" actions to replay Splash + Onboarding 1 & 2
  useEffect(() => {
    const handleReplay = () => {
      setIntroState({ open: true, showOnboarding: true });
    };
    window.addEventListener('eqh:replay-onboarding', handleReplay);
    return () => window.removeEventListener('eqh:replay-onboarding', handleReplay);
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <RouteSeo />
          <SplashOnboarding
            isOpen={introState.open}
            showOnboardingAfterSplash={introState.showOnboarding}
            onComplete={() => setIntroState({ open: false, showOnboarding: false })}
          />
          <AppLayout introOpen={introState.open}>
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:slug" element={<JobDetailPage />} />
                <Route path="/admit-cards" element={<AdmitCardsPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/current-affairs" element={<CurrentAffairsPage />} />
                <Route path="/current-affairs/:id" element={<CurrentAffairDetailPage />} />
                <Route path="/gk-practice" element={<GKPracticePage />} />
                <Route path="/mocks" element={<MockTestsHubPage />} />
                {/* Browse routes must be declared before the engine's single
                    dynamic segment, otherwise "category" is read as a test id. */}
                <Route path="/mocks/category/:categoryId" element={<MockCategoryPage />} />
                <Route
                  path="/mocks/category/:categoryId/:subjectId"
                  element={<MockSubjectPage />}
                />
                <Route path="/mocks/series/:seriesId" element={<TestSeriesPage />} />
                <Route path="/mocks/:mockId" element={<MockTestEnginePage />} />
                <Route path="/previous-papers" element={<PreviousPapersPage />} />
                <Route path="/study-material" element={<StudyMaterialPage />} />
                <Route path="/syllabus" element={<SyllabusHubPage />} />
                <Route path="/syllabus/:examId" element={<SyllabusDetailPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </AppLayout>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
