import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MobileBottomNav from './components/MobileBottomNav.jsx';
import RouteSeo from './components/RouteSeo.jsx';

import HomePage from './pages/HomePage.jsx';

// Route-level code splitting keeps the initial download small so mobile devices
// on slow connections still render content instead of staying on a blank screen.
const JobsPage = lazy(() => import('./pages/JobsPage.jsx'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage.jsx'));
const AdmitCardsPage = lazy(() => import('./pages/AdmitCardsPage.jsx'));
const ResultsPage = lazy(() => import('./pages/ResultsPage.jsx'));
const CurrentAffairsPage = lazy(() => import('./pages/CurrentAffairsPage.jsx'));
const CurrentAffairDetailPage = lazy(() => import('./pages/CurrentAffairDetailPage.jsx'));
const GKPracticePage = lazy(() => import('./pages/GKPracticePage.jsx'));
const PreviousPapersPage = lazy(() => import('./pages/PreviousPapersPage.jsx'));
const StudyMaterialPage = lazy(() => import('./pages/StudyMaterialPage.jsx'));
const MockTestsHubPage = lazy(() => import('./pages/MockTestsHubPage.jsx'));
const MockTestEnginePage = lazy(() => import('./pages/MockTestEnginePage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

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
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-3 py-16 px-4">
      <div className="w-9 h-9 rounded-full border-[3px] border-[#E3EAF2] border-t-[#12345A] animate-spin" />
      <p className="text-xs font-semibold text-slate-500">Loading…</p>
    </div>
  );
}

export default function App() {
  // React has committed its first render — remove the document-level boot overlay
  // defined in index.html so users never sit on a blank or endless loading screen.
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.__EQH_BOOT_DONE === 'function') {
      window.__EQH_BOOT_DONE();
    }
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <RouteSeo />
          <div className="min-h-screen flex flex-col bg-[#F6F8FC] text-[#182B45] selection:bg-[#EAF3FF] selection:text-[#12345A] overflow-x-hidden w-full">
            <Header />
            <main className="flex-1 pb-16 lg:pb-0">
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
                  <Route path="/mocks/:mockId" element={<MockTestEnginePage />} />
                  <Route path="/previous-papers" element={<PreviousPapersPage />} />
                  <Route path="/study-material" element={<StudyMaterialPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
