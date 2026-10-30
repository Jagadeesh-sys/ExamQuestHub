import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  ExternalLink,
  RotateCcw,
  BookOpen,
  Globe2,
  HelpCircle,
  Eye,
  X,
  Layers,
  Database,
  Image as ImageIcon,
  Clipboard,
  Activity,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  getUpdates,
  saveUpdate,
  deleteUpdate,
  getCurrentAffairs,
  saveCurrentAffair,
  deleteCurrentAffair,
  getQuestions,
  saveQuestion,
  deleteQuestion,
  getResources,
  saveResource,
  deleteResource,
  resetDemonstrationData,
  getSyncState,
  subscribeToSyncState
} from '../firebase/firestoreService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import FirebaseBanner from '../components/FirebaseBanner.jsx';
import ImagePasteUploader from '../components/ImagePasteUploader.jsx';
import DocumentFileUploader from '../components/DocumentFileUploader.jsx';
import AdminDiagnosticsTab from '../components/AdminDiagnosticsTab.jsx';
import { CURRENT_AFFAIR_TOPICS, topicMatches } from '../constants/currentAffairs.js';

export default function AdminPage() {
  const { currentUser, isAdmin, loading: authLoading, loginWithGoogle, loginWithEmail, logoutAdmin, authError, isFirebaseConfigured } = useAuth();
  const { t, getLocalized } = useLanguage();

  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active admin tab: 'overview' | 'notifications' | 'currentAffairs' | 'questions' | 'resources'
  const [activeTab, setActiveTab] = useState('overview');

  // Datasets
  const [updates, setUpdates] = useState([]);
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search inside Admin
  const [searchQuery, setSearchQuery] = useState('');
  const [caTopicFilter, setCaTopicFilter] = useState('All');
  const [caSearchQuery, setCaSearchQuery] = useState('');

  // Modals state
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState(''); // 'update' | 'ca' | 'gk' | 'resource'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, type: null, title: '' });
  const [successToast, setSuccessToast] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  // Verified live-sync state (only ever set from real Firestore responses).
  const [syncState, setSyncState] = useState(getSyncState);

  // Quick image modal state for Current Affairs
  const [imageModalItem, setImageModalItem] = useState(null);
  const [quickImageUrl, setQuickImageUrl] = useState('');
  const [imageSaving, setImageSaving] = useState(false);

  // Quick document upload modal state for Study Materials & Previous Papers
  const [documentModalItem, setDocumentModalItem] = useState(null);
  const [quickDocUrl, setQuickDocUrl] = useState('');
  const [quickDocSize, setQuickDocSize] = useState('');
  const [docSaving, setDocSaving] = useState(false);

  // Bulk JSON import for notifications
  const [importOpen, setImportOpen] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importBusy, setImportBusy] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [up, ca, gk, res] = await Promise.all([
        getUpdates(true), // include drafts
        getCurrentAffairs(true),
        getQuestions(),
        getResources()
      ]);
      setUpdates(up);
      setCurrentAffairs(ca);
      setQuestions(gk);
      setResources(res);
    } catch (e) {
      console.error('Error loading admin dataset:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (item, type = 'update') => {
    try {
      if (type === 'update') {
        const newStatus = item.status === 'Draft' ? 'Applications Open' : 'Draft';
        await saveUpdate({ ...item, status: newStatus });
        triggerToast(`Notification marked as ${newStatus}`);
      } else if (type === 'ca') {
        const newStatus = item.status === 'Draft' ? 'Published' : 'Draft';
        await saveCurrentAffair({ ...item, status: newStatus });
        triggerToast(`Current Affair marked as ${newStatus}`);
      }
      await loadAllAdminData();
    } catch (err) {
      triggerToast(`Failed to update status: ${err.message}`);
    }
  };

  useEffect(() => {
    if (currentUser && isAdmin) {
      loadAllAdminData();
    }
  }, [currentUser, isAdmin]);

  // Track verified Firestore sync health for the dashboard banner + diagnostics.
  useEffect(() => subscribeToSyncState(setSyncState), []);

  const triggerToast = (msg, type = 'success') => {
    setToastType(type);
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), type === 'error' ? 5000 : 3000);
  };

  const handleBulkImport = async () => {
    setImportSummary(null);

    let parsed;
    try {
      parsed = JSON.parse(importJson);
    } catch (e) {
      setImportSummary({ ok: 0, failed: 0, errors: [`Invalid JSON: ${e.message}`] });
      return;
    }

    const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.updates) ? parsed.updates : null;
    if (!items || items.length === 0) {
      setImportSummary({ ok: 0, failed: 0, errors: ['Expected a non-empty array of notifications.'] });
      return;
    }

    setImportBusy(true);
    const errors = [];
    let ok = 0;

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const label = item?.title?.en || item?.id || `item ${i + 1}`;

      if (!item?.title?.en || !item?.organization?.en || !item?.officialUrl || !item?.summary?.en) {
        errors.push(`${label} — missing required field (title.en, organization.en, officialUrl, summary.en)`);
        continue;
      }

      try {
        // Sequential on purpose: keeps ordering predictable and surfaces the first real
        // Firestore error (e.g. permission-denied) instead of firing N failing writes.
        // eslint-disable-next-line no-await-in-loop
        await saveUpdate(item);
        ok += 1;
      } catch (err) {
        errors.push(`${label} — ${err.message}`);
      }
    }

    setImportBusy(false);
    setImportSummary({ ok, failed: errors.length, errors });

    if (ok > 0) {
      await loadAllAdminData();
      triggerToast(`Imported ${ok} notification${ok === 1 ? '' : 's'}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    await loginWithEmail(emailInput, passwordInput);
    setLoginLoading(false);
  };

  const handleDemoLogin = async () => {
    setLoginLoading(true);
    await loginWithEmail('admin@examquesthub.com', 'AdminPass123!');
    setLoginLoading(false);
  };

  // Metric counts calculated from real data
  const totalPublished = updates.filter(u => u.status !== 'Draft').length;
  const totalDrafts = updates.filter(u => u.status === 'Draft').length;
  const needsVerification = updates.filter(u => !u.verifiedAt && u.status !== 'Draft').length;
  const totalClosed = updates.filter(u => u.status === 'Closed').length;

  // Delete handler
  const confirmDeleteAction = async () => {
    const { id, type } = deleteConfirm;
    if (!id || !type) return;

    try {
      if (type === 'update') {
        await deleteUpdate(id);
        setUpdates(prev => prev.filter(i => i.id !== id));
        triggerToast('Notification deleted successfully.');
      } else if (type === 'ca') {
        await deleteCurrentAffair(id);
        setCurrentAffairs(prev => prev.filter(i => i.id !== id));
        triggerToast('Current affairs item removed.');
      } else if (type === 'gk') {
        await deleteQuestion(id);
        setQuestions(prev => prev.filter(i => i.id !== id));
        triggerToast('GK Question deleted.');
      } else if (type === 'resource') {
        await deleteResource(id);
        setResources(prev => prev.filter(i => i.id !== id));
        triggerToast('Study resource deleted.');
      }
    } catch (err) {
      triggerToast(`Delete failed: ${err.message}`);
    }
    setDeleteConfirm({ isOpen: false, id: null, type: null, title: '' });
  };

  // Reset demo data handler
  const handleResetData = () => {
    resetDemonstrationData();
    loadAllAdminData();
    triggerToast('Demonstration records restored to initial state.');
  };

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#12345A] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#12345A]">Checking admin session...</p>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 1. RENDER LOGIN SCREEN IF NOT AUTHENTICATED OR NOT ADMIN
  // -----------------------------------------------------------------
  if (!currentUser || !isAdmin) {
    return (
      <div className="max-w-[480px] mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 border border-[#E3EAF2] shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <img
              src="/assets/aistudio/file_000000006a4881f4be54dc3e116f9bc0_65b76b0e.png"
              alt="ExamQuestHub Logo"
              className="w-16 h-16 object-contain mx-auto drop-shadow-sm"
            />
            <h1 className="font-heading font-extrabold text-2xl text-[#182B45]">
              {t('adminLogin')}
            </h1>
            <p className="text-xs text-slate-500">
              {t('adminLoginDesc')}
            </p>
          </div>

          <FirebaseBanner forceShow={false} />

          {authError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          {isFirebaseConfigured && (
            <div className="space-y-3">
              <button
                type="button"
                disabled={loginLoading}
                onClick={async () => {
                  setLoginLoading(true);
                  await loginWithGoogle();
                  setLoginLoading(false);
                }}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{loginLoading ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>

              <div className="relative flex items-center justify-center py-1">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[11px] text-slate-400 uppercase font-semibold">Or with Email</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('email')}
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="editor@examquesthub.com"
                className="w-full px-3.5 py-2.5 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('password')}
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {loginLoading ? 'Verifying...' : t('loginButton')}
            </button>
          </form>

          {!isFirebaseConfigured && (
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 mb-2">
              Firebase is not connected. Local preview login only:
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              Log in as Demo Administrator
            </button>
          </div>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // -----------------------------------------------------------------
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#E3EAF2] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/file_000000006a4881f4be54dc3e116f9bc0_65b76b0e.png"
            alt="ExamQuestHub Logo"
            className="w-12 h-12 object-contain rounded-full shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#182B45]">
                {t('adminDashboard')}
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                Authorized
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Signed in as <strong className="text-slate-700">{currentUser.email}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isFirebaseConfigured && (
          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 hover:text-[#12345A] hover:bg-slate-100 text-xs font-semibold transition-colors"
            title="Reset demonstration data to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
          )}

          <button
            type="button"
            onClick={logoutAdmin}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Firebase Status Banner */}
      <FirebaseBanner forceShow={false} />

      {/* Success Toast */}
      {successToast && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150 border ${
            toastType === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {toastType === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{successToast}</span>
        </div>
      )}

      {/* Real Summary Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E3EAF2]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {t('totalPublished')}
          </span>
          <div className="text-2xl font-extrabold text-[#12345A] mt-1">
            {totalPublished}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">
            Active on public portal
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E3EAF2]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {t('draftsCount')}
          </span>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">
            {totalDrafts}
          </div>
          <span className="text-[10px] text-amber-700 font-medium">
            Hidden from public
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E3EAF2]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {t('needsVerification')}
          </span>
          <div className="text-2xl font-extrabold text-[#2468B4] mt-1">
            {needsVerification}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Requires gazette check
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E3EAF2]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {t('closedCount')}
          </span>
          <div className="text-2xl font-extrabold text-slate-600 mt-1">
            {totalClosed}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Past application window
          </span>
        </div>
      </div>

      {/* Verified sync health — never claims success unless Firestore actually answered */}
      {!syncState.live && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs sm:text-sm font-bold text-red-800">
              Live Firebase sync is not active
            </p>
            <p className="text-[11px] sm:text-xs text-red-700 leading-relaxed break-words">
              {syncState.configured
                ? 'Firestore has not answered yet. Anything you publish now is stored only in this browser and will NOT reach other devices.'
                : 'Firebase is not configured in this build. Changes stay local to this browser only.'}
              {syncState.lastError ? ` (${syncState.lastError})` : ''}
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('diagnostics')}
              className="text-[11px] font-bold text-red-800 underline underline-offset-2 cursor-pointer"
            >
              Open diagnostics to see the exact cause
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-[#E3EAF2] flex items-center gap-1 overflow-x-auto text-xs font-semibold no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Notifications ({updates.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('currentAffairs')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'currentAffairs'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Current Affairs ({currentAffairs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'questions'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          GK Questions ({questions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'resources'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Study Resources ({resources.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'diagnostics'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#F2BE4F]" />
          <span>System Diagnostics</span>
        </button>
      </div>

      {/* -------------------------------------------------------------
          TAB 1: NOTIFICATIONS MANAGER
         ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E3EAF2] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-[#182B45]">
                Manage Exam Notifications
              </h2>
              <p className="text-xs text-slate-500">
                Create, verify, publish, edit deadlines, or mark status as closed.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingItem({
                  title: { en: '', te: '' },
                  organization: { en: '', te: '' },
                  category: 'State PSC',
                  region: 'All India',
                  notificationNo: '',
                  publishedAt: new Date().toISOString().split('T')[0],
                  deadline: '',
                  vacancies: '',
                  qualification: { en: '', te: '' },
                  ageLimit: { en: '', te: '' },
                  applicationFee: { en: '', te: '' },
                  summary: { en: '', te: '' },
                  officialUrl: '',
                  applyUrl: '',
                  pdfUrl: '',
                  status: 'Applications Open',
                  featured: false
                });
                setEditType('update');
                setIsFormOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition-colors shadow-xs w-full sm:w-auto active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewUpdate')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setImportJson('');
                setImportSummary(null);
                setImportOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-[#12345A] text-[#12345A] hover:bg-[#EAF3FF] text-xs font-bold rounded-xl transition-colors shadow-xs w-full sm:w-auto active:scale-95"
            >
              <Clipboard className="w-4 h-4" />
              <span>Bulk Import</span>
            </button>
          </div>

          {/* Mobile Card View (md:hidden) */}
          <div className="space-y-3 md:hidden">
            {updates.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-[#F6F8FC] space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-[#2468B4] uppercase tracking-wider block">
                      {getLocalized(item.organization)}
                    </span>
                    <h4 className="font-heading font-bold text-xs text-[#182B45] line-clamp-2">
                      {getLocalized(item.title)}
                    </h4>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                    {item.category}
                  </span>
                  <span>{item.region}</span>
                  {item.deadline && (
                    <span className="text-amber-800 font-medium">Last Date: {item.deadline}</span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(item, 'update')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      item.status === 'Draft'
                        ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {item.status === 'Draft' ? 'Draft • Publish' : 'Published'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setEditType('update');
                        setFormError('');
                        setIsFormOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 active:bg-slate-100 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#12345A]" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirm({
                          isOpen: true,
                          id: item.id,
                          type: 'update',
                          title: getLocalized(item.title)
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-1 active:bg-red-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (hidden md:block) */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-3">Title & Organization</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Region</th>
                  <th className="py-3 px-3">Dates</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {updates.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#182B45] line-clamp-1 max-w-[280px]">
                        {getLocalized(item.title)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {getLocalized(item.organization)}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {item.region}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      <div>Pub: {item.publishedAt}</div>
                      {item.deadline && <div className="text-amber-800">End: {item.deadline}</div>}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item, 'update')}
                          className="text-[10px] font-semibold text-slate-500 hover:text-[#12345A] underline cursor-pointer"
                        >
                          {item.status === 'Draft' ? 'Publish' : 'Unpublish'}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item);
                            setEditType('update');
                            setFormError('');
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#12345A] hover:bg-slate-100 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirm({
                              isOpen: true,
                              id: item.id,
                              type: 'update',
                              title: getLocalized(item.title)
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: CURRENT AFFAIRS MANAGER
         ------------------------------------------------------------- */}
      {activeTab === 'currentAffairs' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E3EAF2] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold text-lg text-[#182B45]">
                Manage Current Affairs Articles
              </h2>
              <p className="text-xs text-slate-500">
                Add factual exam summaries with primary official sources and featured images (direct clipboard copy-paste supported).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingItem({
                  headline: { en: '', te: '' },
                  summary: { en: '', te: '' },
                  content: { en: '', te: '' },
                  topic: 'National news',
                  eventDate: new Date().toISOString().split('T')[0],
                  publishedAt: new Date().toISOString().split('T')[0],
                  sourceName: 'PIB New Delhi',
                  sourceUrl: 'https://pib.gov.in',
                  imageUrl: '',
                  status: 'Published',
                  createdAt: new Date().toISOString(),
                  examRelevance: ['UPSC', 'APPSC', 'SSC'],
                  tags: ['Current Affairs']
                });
                setEditType('ca');
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewCA')}</span>
            </button>
          </div>

          {/* Current Affairs Topic Filter & Search Bar */}
          <div className="bg-[#F8FAFC] border border-[#E3EAF2] rounded-2xl p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Filter Topic:</label>
              <select
                value={caTopicFilter}
                onChange={(e) => setCaTopicFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#2468B4]"
              >
                <option value="All">All Topics ({currentAffairs.length})</option>
                {CURRENT_AFFAIR_TOPICS.map((topicName) => (
                  <option key={topicName} value={topicName}>
                    {topicName} ({currentAffairs.filter((c) => topicMatches(c.topic, topicName)).length})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={caSearchQuery}
                  onChange={(e) => setCaSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:border-[#2468B4]"
                />
              </div>
              {(caTopicFilter !== 'All' || caSearchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setCaTopicFilter('All');
                    setCaSearchQuery('');
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-semibold hover:bg-slate-200/60"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {currentAffairs
              .filter((ca) => {
                const matchesTopic = topicMatches(ca.topic, caTopicFilter);
                const text = ((ca.headline?.en || '') + ' ' + (ca.headline?.te || '') + ' ' + (ca.summary?.en || '')).toLowerCase();
                const matchesSearch = !caSearchQuery || text.includes(caSearchQuery.toLowerCase());
                return matchesTopic && matchesSearch;
              })
              .map((ca) => (
              <div key={ca.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Thumbnail & Quick Paste Trigger */}
                  <div className="relative group shrink-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={ca.imageUrl || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'}
                        alt={getLocalized(ca.headline)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageModalItem(ca);
                        setQuickImageUrl(ca.imageUrl || '');
                      }}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-xl text-[9px] font-bold"
                      title="Paste or change image"
                    >
                      <Clipboard className="w-3.5 h-3.5 mb-0.5" />
                      <span>Paste</span>
                    </button>
                  </div>

                  {/* Headline & Metadata */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-100">
                        {ca.topic}
                      </span>
                      {ca.examRelevance && (
                        <div className="flex items-center gap-1">
                          {ca.examRelevance.map((r, i) => (
                            <span key={i} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-medium">
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-[#182B45] text-sm leading-snug line-clamp-2">
                      {getLocalized(ca.headline)}
                    </h4>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>Event Date: {ca.eventDate}</span>
                      <span>•</span>
                      <span>Source: {ca.sourceName}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Quick Publish, Image Paste, Edit, Delete */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(ca, 'ca')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      ca.status === 'Draft'
                        ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {ca.status === 'Draft' ? 'Draft • Publish' : 'Published'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImageModalItem(ca);
                      setQuickImageUrl(ca.imageUrl || '');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#12345A] hover:bg-blue-100 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy-paste or upload image"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#2468B4]" />
                    <span>Paste Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem({
                        ...ca,
                        imageUrl: ca.imageUrl || '',
                        status: ca.status || 'Published',
                        examRelevance: ca.examRelevance || ['UPSC', 'APPSC', 'SSC']
                      });
                      setEditType('ca');
                      setFormError('');
                      setIsFormOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-[#12345A] hover:bg-slate-100 cursor-pointer"
                    title="Edit full article"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirm({
                        isOpen: true,
                        id: ca.id,
                        type: 'ca',
                        title: getLocalized(ca.headline)
                      });
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {currentAffairs.filter((ca) => {
              const matchesTopic = topicMatches(ca.topic, caTopicFilter);
              const text = ((ca.headline?.en || '') + ' ' + (ca.headline?.te || '') + ' ' + (ca.summary?.en || '')).toLowerCase();
              return matchesTopic && (!caSearchQuery || text.includes(caSearchQuery.toLowerCase()));
            }).length === 0 && (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-sm text-slate-700">No articles found under &ldquo;{caTopicFilter}&rdquo;</p>
                <p className="text-xs text-slate-400">Click &quot;Add New CA&quot; to publish a current affair article for this topic.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: GK QUESTIONS MANAGER
         ------------------------------------------------------------- */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E3EAF2] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold text-lg text-[#182B45]">
                Manage GK Practice Questions
              </h2>
              <p className="text-xs text-slate-500">
                Add bilingual questions with options, verified answer keys, and explanations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingItem({
                  topic: 'Polity',
                  isPyq: false,
                  examSource: 'ExamQuestHub Practice',
                  question: { en: '', te: '' },
                  options: {
                    en: ['', '', '', ''],
                    te: ['', '', '', '']
                  },
                  correctAnswer: 0,
                  explanation: { en: '', te: '' }
                });
                setEditType('gk');
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewGK')}</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {questions.map((q, idx) => (
              <div key={q.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#12345A]">Q{idx + 1}.</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {q.topic}
                    </span>
                    {q.isPyq && (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                        PYQ: {q.examSource}
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-[#182B45]">
                    {getLocalized(q.question)}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    Key: Option {String.fromCharCode(65 + q.correctAnswer)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(q);
                      setEditType('gk');
                      setIsFormOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-[#12345A] hover:bg-slate-100"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirm({
                        isOpen: true,
                        id: q.id,
                        type: 'gk',
                        title: getLocalized(q.question)
                      });
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 4: STUDY RESOURCES & PREVIOUS PAPERS MANAGER
         ------------------------------------------------------------- */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E3EAF2] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold text-lg text-[#182B45]">
                Manage Study Resources & Previous Papers
              </h2>
              <p className="text-xs text-slate-500">
                Upload official question papers, model test keys, and syllabus documents (PDF, DOC).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingItem({
                  title: { en: '', te: '' },
                  category: 'Previous-Year Papers',
                  examBoard: 'UPSC',
                  year: '2025',
                  fileSize: '2.0 MB PDF',
                  downloadUrl: '',
                  officialSource: '',
                  description: { en: '', te: '' }
                });
                setEditType('resource');
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewResource')}</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {resources.map((res) => (
              <div key={res.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Document Format Badge */}
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex flex-col items-center justify-center shrink-0 border border-purple-200">
                    <FileText className="w-4 h-4" />
                    <span className="text-[8px] font-bold uppercase">
                      {res.fileSize?.includes('DOC') ? 'DOC' : 'PDF'}
                    </span>
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px] font-semibold border border-purple-100">
                        {res.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {res.examBoard} {res.year ? `(${res.year})` : ''}
                      </span>
                      {res.downloadUrl && (
                        <span className="px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200 flex items-center gap-1">
                          <span>✓ File Attached</span>
                          {res.fileSize && <span>• {res.fileSize}</span>}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-[#182B45] text-sm leading-snug">
                      {getLocalized(res.title)}
                    </h4>
                  </div>
                </div>

                {/* Actions: Quick Document Upload, Edit, Delete */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      setDocumentModalItem(res);
                      setQuickDocUrl(res.downloadUrl || '');
                      setQuickDocSize(res.fileSize || '');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    title="Upload or change document file"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    <span>Upload Doc</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(res);
                      setEditType('resource');
                      setIsFormOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-[#12345A] hover:bg-slate-100"
                    title="Edit resource"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirm({
                        isOpen: true,
                        id: res.id,
                        type: 'resource',
                        title: getLocalized(res.title)
                      });
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 5: SYSTEM DIAGNOSTICS & TELEMETRY
         ------------------------------------------------------------- */}
      {activeTab === 'diagnostics' && (
        <AdminDiagnosticsTab
          currentUser={currentUser}
          lastSyncTime={syncState.lastSyncAt}
          onRefreshData={loadAllAdminData}
        />
      )}

      {/* -------------------------------------------------------------
          MODAL: EDIT / CREATE MODAL
         ------------------------------------------------------------- */}
      {isFormOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 space-y-5 animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-lg text-[#182B45]">
                {editingItem.id ? 'Edit Entry' : 'Create New Entry'} ({editType.toUpperCase()})
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM FOR NOTIFICATIONS */}
            {editType === 'update' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFormError('');
                  setIsSaving(true);
                  try {
                    if (!editingItem.title?.en?.trim()) {
                      throw new Error('Title (English) is required.');
                    }
                    if (!editingItem.organization?.en?.trim()) {
                      throw new Error('Organization (English) is required.');
                    }
                    if (!editingItem.officialUrl?.trim()) {
                      throw new Error('Official Portal URL is required.');
                    }
                    const duplicate = updates.find((existing) =>
                      existing.id !== editingItem.id &&
                      (existing.title?.en || '').trim().toLowerCase() === editingItem.title.en.trim().toLowerCase() &&
                      (existing.organization?.en || '').trim().toLowerCase() === (editingItem.organization?.en || '').trim().toLowerCase()
                    );
                    if (duplicate) {
                      throw new Error('A notification with this title and organization already exists.');
                    }
                    await saveUpdate(editingItem);
                    await loadAllAdminData();
                    setIsFormOpen(false);
                    triggerToast('Notification saved and permanently synced to Firestore database.');
                  } catch (err) {
                    setFormError(err.message || 'Failed to save to Firestore.');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="space-y-4 text-xs"
              >
                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Title (English) *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.title?.en || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title: { ...editingItem.title, en: e.target.value } })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Title (Telugu)</label>
                    <input
                      type="text"
                      value={editingItem.title?.te || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title: { ...editingItem.title, te: e.target.value } })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Organization (English) *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.organization?.en || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, organization: { ...editingItem.organization, en: e.target.value } })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={editingItem.category || 'State PSC'}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    >
                      <option value="UPSC">UPSC</option>
                      <option value="SSC">SSC</option>
                      <option value="State PSC">State PSC</option>
                      <option value="Banking">Banking</option>
                      <option value="RRB and Railway">RRB & Railway</option>
                      <option value="Defence">Defence</option>
                      <option value="Teaching">Teaching</option>
                      <option value="GATE, ISRO, and other technical examinations">Technical / ISRO / GATE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Region *</label>
                    <select
                      value={editingItem.region || 'All India'}
                      onChange={(e) => setEditingItem({ ...editingItem, region: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    >
                      <option value="All India">All India</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Published Date</label>
                    <input
                      type="date"
                      value={editingItem.publishedAt || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, publishedAt: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Deadline / Last Date</label>
                    <input
                      type="date"
                      value={editingItem.deadline || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, deadline: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status *</label>
                    <select
                      value={editingItem.status || 'Applications Open'}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    >
                      <option value="Applications Open">Applications Open</option>
                      <option value="Closing Soon">Closing Soon</option>
                      <option value="Admit Card Released">Admit Card Released</option>
                      <option value="Result Released">Result Released</option>
                      <option value="Closed">Closed</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Confirmed Vacancy Count</label>
                    <input
                      type="text"
                      placeholder="e.g. 1056 (leave empty if unconfirmed)"
                      value={editingItem.vacancies || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, vacancies: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Portal URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={editingItem.officialUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, officialUrl: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Apply / Download URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editingItem.applyUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, applyUrl: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Summary (English) *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingItem.summary?.en || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, summary: { ...editingItem.summary, en: e.target.value } })}
                    className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Summary (Telugu)</label>
                  <textarea
                    rows={2}
                    value={editingItem.summary?.te || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, summary: { ...editingItem.summary, te: e.target.value } })}
                    className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                  />
                </div>

                <DocumentFileUploader
                  value={editingItem.pdfUrl || ''}
                  onChange={(url) => setEditingItem({ ...editingItem, pdfUrl: url })}
                  currentFileSize={editingItem.pdfSize || ''}
                  onFileSizeChange={(size) => setEditingItem({ ...editingItem, pdfSize: size })}
                  label="Official Notification PDF (URL preferred)"
                />

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSaving ? 'Saving to Firestore...' : 'Save Notification'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* FORM FOR CURRENT AFFAIRS */}
            {editType === 'ca' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFormError('');
                  setIsSaving(true);
                  try {
                    if (!editingItem.headline?.en?.trim()) {
                      throw new Error('Headline (English) is required.');
                    }
                    if (!editingItem.sourceUrl?.trim()) {
                      throw new Error('Source URL is required.');
                    }
                    if (!editingItem.summary?.en?.trim()) {
                      throw new Error('Summary (English) is required.');
                    }
                    const duplicateCa = currentAffairs.find((existing) =>
                      existing.id !== editingItem.id &&
                      (existing.headline?.en || '').trim().toLowerCase() === editingItem.headline.en.trim().toLowerCase()
                    );
                    if (duplicateCa) {
                      throw new Error('A current affairs article with this English headline already exists.');
                    }
                    await saveCurrentAffair(editingItem);
                    await loadAllAdminData();
                    setIsFormOpen(false);
                    triggerToast('Current affairs article saved and synced to Firestore database.');
                  } catch (err) {
                    setFormError(err.message || 'Failed to save current affairs article.');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="space-y-4 text-xs"
              >
                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Headline (English) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Union Cabinet Approves New Initiative"
                      value={editingItem.headline?.en || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, headline: { ...editingItem.headline, en: e.target.value } })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Headline (Telugu)</label>
                    <input
                      type="text"
                      placeholder="తెలుగు శీర్షిక..."
                      value={editingItem.headline?.te || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, headline: { ...editingItem.headline, te: e.target.value } })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category / Topic *</label>
                    <select
                      value={editingItem.topic || 'National Affairs'}
                      onChange={(e) => setEditingItem({ ...editingItem, topic: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    >
                      {CURRENT_AFFAIR_TOPICS.map((topicName) => (
                        <option key={topicName} value={topicName}>{topicName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Published Status *</label>
                    <select
                      value={editingItem.status || 'Published'}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    >
                      <option value="Published">Published (Live)</option>
                      <option value="Draft">Draft (Hidden)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Important / Event Date *</label>
                    <input
                      type="date"
                      required
                      value={editingItem.eventDate || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, eventDate: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Primary Source / Reference *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Press Information Bureau / Ministry of Finance"
                      value={editingItem.sourceName || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, sourceName: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Source URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://pib.gov.in/..."
                      value={editingItem.sourceUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, sourceUrl: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description / Summary (English) *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Concise exam-targeted summary..."
                      value={editingItem.summary?.en || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, summary: { ...editingItem.summary, en: e.target.value } })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description / Summary (Telugu)</label>
                    <textarea
                      rows={3}
                      placeholder="పరీక్షలకు ముఖ్యమైన సారాంశం..."
                      value={editingItem.summary?.te || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, summary: { ...editingItem.summary, te: e.target.value } })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Detailed Explanation (English)</label>
                    <textarea
                      rows={3}
                      placeholder="In-depth factual points, key figures, and background context..."
                      value={editingItem.content?.en || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, content: { ...editingItem.content, en: e.target.value } })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Detailed Explanation (Telugu)</label>
                    <textarea
                      rows={3}
                      placeholder="వివరణాత్మక పాయింట్లు మరియు విశ్లేషణ..."
                      value={editingItem.content?.te || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, content: { ...editingItem.content, te: e.target.value } })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                {/* IMAGE UPLOAD & CLIPBOARD PASTE COMPONENT */}
                <ImagePasteUploader
                  value={editingItem.imageUrl || ''}
                  onChange={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                  label="Featured Image (Clipboard Copy-Paste, File Upload, or URL)"
                />

                {/* EXAM RELEVANCE TAGS */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Exam Relevance Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['UPSC', 'APPSC', 'TGPSC', 'SSC', 'BANK', 'RAILWAYS', 'CDS', 'DEFENCE'].map((exam) => {
                      const currentTags = editingItem.examRelevance || [];
                      const isSelected = currentTags.includes(exam);
                      return (
                        <button
                          key={exam}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setEditingItem({
                                ...editingItem,
                                examRelevance: currentTags.filter(t => t !== exam)
                              });
                            } else {
                              setEditingItem({
                                ...editingItem,
                                examRelevance: [...currentTags, exam]
                              });
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#12345A] text-white border-[#12345A] shadow-xs'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? `✓ ${exam}` : `+ ${exam}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSaving ? 'Saving to Firestore...' : 'Save Article'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* FORM FOR GK QUESTIONS */}
            {editType === 'gk' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSaving(true);
                  try {
                    if (!editingItem.question?.en?.trim()) {
                      throw new Error('Question (English) is required.');
                    }
                    await saveQuestion(editingItem);
                    await loadAllAdminData();
                    setIsFormOpen(false);
                    triggerToast('GK Question saved and synced to Firestore.');
                  } catch (err) {
                    triggerToast(`Question not saved: ${err.message}`, 'error');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Topic *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.topic || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, topic: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Exam Source / Attribution</label>
                    <input
                      type="text"
                      placeholder="e.g. UPSC CSE 2024 or Original Practice"
                      value={editingItem.examSource || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, examSource: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Question (English) *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingItem.question?.en || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, question: { ...editingItem.question, en: e.target.value } })}
                    className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Question (Telugu)</label>
                  <textarea
                    rows={2}
                    value={editingItem.question?.te || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, question: { ...editingItem.question, te: e.target.value } })}
                    className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">4 Options (English) *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        required
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        value={editingItem.options?.en?.[idx] || ''}
                        onChange={(e) => {
                          const newOpts = [...(editingItem.options?.en || ['', '', '', ''])];
                          newOpts[idx] = e.target.value;
                          setEditingItem({
                            ...editingItem,
                            options: { ...editingItem.options, en: newOpts }
                          });
                        }}
                        className="p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correct Answer *</label>
                  <select
                    value={editingItem.correctAnswer || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, correctAnswer: parseInt(e.target.value, 10) })}
                    className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Explanation (English) *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingItem.explanation?.en || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, explanation: { ...editingItem.explanation, en: e.target.value } })}
                    className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white font-semibold disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSaving ? 'Saving to Firestore...' : 'Save Question'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* FORM FOR STUDY RESOURCES */}
            {editType === 'resource' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSaving(true);
                  try {
                    if (!editingItem.title?.en?.trim()) {
                      throw new Error('Title (English) is required.');
                    }
                    await saveResource(editingItem);
                    await loadAllAdminData();
                    setIsFormOpen(false);
                    triggerToast('Study resource saved and synced to Firestore.');
                  } catch (err) {
                    triggerToast(`Resource not saved: ${err.message}`, 'error');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title?.en || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: { ...editingItem.title, en: e.target.value } })}
                    className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={editingItem.category || 'Previous-Year Papers'}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    >
                      <option value="Previous-Year Papers">Previous-Year Papers</option>
                      <option value="Syllabus & Exam Pattern">Syllabus & Exam Pattern</option>
                      <option value="General Knowledge notes">GK Notes / Capsules</option>
                      <option value="Model Question Papers">Model Question Papers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Exam Board *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. UPSC, SSC, APPSC, TGPSC"
                      value={editingItem.examBoard || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, examBoard: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Year / Edition</label>
                    <input
                      type="text"
                      placeholder="e.g. 2025"
                      value={editingItem.year || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                      className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                {/* DOCUMENT UPLOADER COMPONENT */}
                <DocumentFileUploader
                  value={editingItem.downloadUrl || ''}
                  onChange={(url) => setEditingItem({ ...editingItem, downloadUrl: url })}
                  currentFileSize={editingItem.fileSize || ''}
                  onFileSizeChange={(size) => setEditingItem(prev => ({ ...prev, fileSize: size }))}
                  label="Document File (Upload PDF, DOC, or Select Official Compendium)"
                />
                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white font-semibold disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSaving ? 'Saving to Firestore...' : 'Save Resource'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Bulk Import Modal — Notifications */}
      {importOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#182B45] flex items-center gap-1.5">
                  <Clipboard className="w-4 h-4 text-[#2468B4]" />
                  Bulk Import Notifications
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paste a JSON array below. Each item is written to Firestore and is editable here afterwards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setImportOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] p-3 text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">Required per item</p>
              <p>
                <code>title.en</code>, <code>organization.en</code>, <code>officialUrl</code>, <code>summary.en</code>
              </p>
              <p className="font-semibold text-slate-700 pt-1">Optional</p>
              <p>
                <code>id</code>, <code>title.te</code>, <code>summary.te</code>, <code>category</code>, <code>region</code>,{' '}
                <code>publishedAt</code> / <code>deadline</code> (YYYY-MM-DD), <code>status</code>,{' '}
                <code>vacancies</code>, <code>applyUrl</code>, <code>pdfUrl</code>
              </p>
            </div>

            <textarea
              rows={12}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              spellCheck={false}
              placeholder='[ { "title": { "en": "...", "te": "..." }, "organization": { "en": "..." } } ]'
              className="w-full p-3 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white font-mono text-[11px] leading-relaxed"
            />

            {importSummary && (
              <div
                className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                  importSummary.ok > 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                <p className="font-bold">
                  {importSummary.ok} imported
                  {importSummary.failed > 0 ? `, ${importSummary.failed} failed` : ''}
                </p>
                {importSummary.errors.length > 0 && (
                  <ul className="space-y-0.5 max-h-40 overflow-y-auto font-mono text-[11px]">
                    {importSummary.errors.map((msg, i) => (
                      <li key={i} className="break-words">
                        • {msg}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setImportOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                disabled={importBusy || !importJson.trim()}
                onClick={handleBulkImport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white font-bold disabled:opacity-50 cursor-pointer"
              >
                {importBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {importBusy ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Image Paste & Update Modal for Current Affairs */}
      {imageModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#182B45] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#2468B4]" />
                  <span>Update Current Affair Image</span>
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {getLocalized(imageModalItem.headline)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setImageModalItem(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ImagePasteUploader
              value={quickImageUrl}
              onChange={setQuickImageUrl}
              label="Article Image (Click & press Ctrl+V, use button, or select preset)"
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setImageModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={imageSaving}
                onClick={async () => {
                  setImageSaving(true);
                  try {
                    await saveCurrentAffair({
                      ...imageModalItem,
                      imageUrl: quickImageUrl
                    });
                    await loadAllAdminData();
                    setImageModalItem(null);
                    triggerToast('Current affair image updated successfully!');
                  } catch (err) {
                    triggerToast(`Image not saved: ${err.message}`, 'error');
                  } finally {
                    setImageSaving(false);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition-all shadow-xs"
              >
                {imageSaving ? 'Saving...' : 'Save Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Document Upload Modal for Study Materials & Previous Papers */}
      {documentModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#182B45] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Upload Document / Previous Paper</span>
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {getLocalized(documentModalItem.title)} ({documentModalItem.examBoard} {documentModalItem.year})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDocumentModalItem(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DocumentFileUploader
              value={quickDocUrl}
              onChange={setQuickDocUrl}
              currentFileSize={quickDocSize}
              onFileSizeChange={setQuickDocSize}
              label="Document File (PDF, DOC, or Select Official Compendium)"
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDocumentModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={docSaving}
                onClick={async () => {
                  setDocSaving(true);
                  try {
                    await saveResource({
                      ...documentModalItem,
                      downloadUrl: quickDocUrl,
                      fileSize: quickDocSize || documentModalItem.fileSize || 'PDF Document'
                    });
                    await loadAllAdminData();
                    setDocumentModalItem(null);
                    triggerToast('Document attached and saved successfully!');
                  } catch (err) {
                    triggerToast(`Document not saved: ${err.message}`, 'error');
                  } finally {
                    setDocSaving(false);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition-all shadow-xs"
              >
                {docSaving ? 'Saving...' : 'Save Document'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteConfirm.title}"? This action will permanently remove the record from the database.`}
        confirmLabel="Delete Permanently"
        confirmVariant="danger"
        onConfirm={confirmDeleteAction}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, type: null, title: '' })}
      />

    </div>
  );
}
