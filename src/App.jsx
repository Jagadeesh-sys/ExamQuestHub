import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MobileBottomNav from './components/MobileBottomNav.jsx';

import HomePage from './pages/HomePage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import JobDetailPage from './pages/JobDetailPage.jsx';
import AdmitCardsPage from './pages/AdmitCardsPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import CurrentAffairsPage from './pages/CurrentAffairsPage.jsx';
import CurrentAffairDetailPage from './pages/CurrentAffairDetailPage.jsx';
import GKPracticePage from './pages/GKPracticePage.jsx';
import PreviousPapersPage from './pages/PreviousPapersPage.jsx';
import StudyMaterialPage from './pages/StudyMaterialPage.jsx';
import MockTestsHubPage from './pages/MockTestsHubPage.jsx';
import MockTestEnginePage from './pages/MockTestEnginePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Scroll to top upon route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#F6F8FC] text-[#182B45] selection:bg-[#EAF3FF] selection:text-[#12345A] overflow-x-hidden w-full">
            <Header />
            <main className="flex-1 pb-16 lg:pb-0">
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
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
