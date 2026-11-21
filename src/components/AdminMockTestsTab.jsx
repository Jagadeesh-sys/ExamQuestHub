import React, { useEffect, useMemo, useState } from 'react';
import {
  Edit2,
  Trash2,
  Search,
  Loader2,
  AlertTriangle,
  X,
  Save,
  Upload,
  Download,
  FileText,
  CheckCircle2,
  RefreshCw,
  Layers,
  Award,
  Eye,
  Columns3,
  Landmark,
  BrainCircuit,
  Calculator,
  Atom,
  Cpu,
  Languages,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Newspaper,
  CheckSquare,
  Square,
  RotateCcw,
  Sparkles,
  Activity
} from 'lucide-react';
import {
  bulkSaveMockQuestions,
  deleteMockQuestion,
  getMockQuestions,
  saveMockQuestion,
  migrateOlderGraduateQuestionsTo2024
} from '../firebase/firestoreService.js';
import ConfirmModal from './ConfirmModal.jsx';
import AdminHierarchyConfigurator from './admin/AdminHierarchyConfigurator.jsx';
import AdminShiftPaperPreviewModal from './admin/AdminShiftPaperPreviewModal.jsx';
import {
  CANONICAL_SUBJECTS,
  SUBJECT_TOPIC_TREE,
  EXAM_HIERARCHY
} from '../constants/examHierarchy.js';
import {
  resolveCanonicalTopicId,
  validateMockQuestion
} from '../constants/mockTaxonomy.js';
import {
  classifyQuestionConceptually,
  getOptionTexts,
  getQuestionText
} from '../utils/questionClassifier.js';
import {
  loadBankManifest,
  loadAllShifts,
  saveLocalQuestionOverride,
  deleteLocalQuestionOverride,
  getAllShifts,
  saveShiftOverride,
  getPaperInventorySummary
} from '../services/rrbMockService.js';
import {
  computeUnifiedStats,
  saveCachedUnifiedStats,
  isImportantOrReviewQuestion
} from '../utils/questionStats.js';
import {
  safeJsonParse,
  stripDangerousKeys,
  sanitizeMediaUrl,
  sanitizeDocumentUrl
} from '../utils/security.js';

const SUBJECT_CAT_MAP = {
  'general-knowledge': 'gk',
  'current-affairs': 'ca',
  'quantitative-aptitude': 'quant',
  reasoning: 'reasoning',
  'general-science': 'general-science',
  'computer-science': 'cse',
  'english-language': 'english'
};

const ELIGIBLE_EXAM_OPTIONS = [
  { id: 'ssc-cgl', label: 'SSC CGL' },
  { id: 'ssc-chsl', label: 'SSC CHSL' },
  { id: 'ssc-mts', label: 'SSC MTS' },
  { id: 'rrb-ntpc-ug', label: 'RRB NTPC UG' },
  { id: 'rrb-ntpc-grad', label: 'RRB NTPC Grad' },
  { id: 'rrb-group-d', label: 'RRB Group D' },
  { id: 'appsc-group-2', label: 'APPSC Group 2' }
];

const QUALITY_FLAG_OPTIONS = [
  { id: 'ALL', label: 'All Quality Issues' },
  { id: 'DUPLICATE_QUESTION', label: 'Exact / Group Duplicates' },
  { id: 'SUSPECTED_TEMPLATE_REPEAT', label: 'Template Repeats' },
  { id: 'EMPTY_QUESTION_TEXT', label: 'Empty Question Stem' },
  { id: 'MISSING_OPTIONS', label: 'Missing Options (<4)' },
  { id: 'MISSING_IMAGE_ASSET', label: 'Missing Image / Diagram' },
  { id: 'DUPLICATE_OPTIONS', label: 'Duplicate Options' },
  { id: 'LOW_CONFIDENCE_CLASSIFICATION', label: 'Low Confidence (<80%)' }
];

function getCanonicalSubjectId(q) {
  if (!q) return 'general-knowledge';
  if (q.subjectId && SUBJECT_TOPIC_TREE[q.subjectId]) return q.subjectId;
  const s = String(q.subject || '').toLowerCase();
  const c = String(q.categoryId || '').toLowerCase();
  if (s.includes('affair') || c === 'ca') return 'current-affairs';
  if (s.includes('quant') || s.includes('math') || c === 'quant') return 'quantitative-aptitude';
  if (s.includes('reason') || c === 'reasoning') return 'reasoning';
  if (s.includes('science') || c === 'science' || c === 'general-science') return 'general-science';
  if (s.includes('computer') || c === 'cse') return 'computer-science';
  if (s.includes('english') || c === 'english') return 'english-language';
  return 'general-knowledge';
}

function getTierBadgeClass(tier) {
  if (tier === 'MANUAL_REVIEW') return 'bg-rose-50 text-rose-800 border border-rose-200';
  if (tier === 'REVIEW') return 'bg-amber-50 text-amber-800 border border-amber-200';
  return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
}

export default function AdminMockTestsTab({
  initialQuestions = null,
  gkQuestionsCount = 0,
  onQuestionsChanged,
  onNotify
}) {
  // 7 Sub-Tabs:
  // 'overview' | 'questionBank' | 'reviewQueue' | 'shiftsConfig' | 'quality' | 'hierarchy' | 'bulkJson'
  const [subTab, setSubTab] = useState('overview');

  // Manifest fast-path + loaded questions state
  const [manifest, setManifest] = useState(null);
  const [rrbQuestions, setRrbQuestions] = useState(() =>
    Array.isArray(initialQuestions) && initialQuestions.length > 0 ? initialQuestions : []
  );
  const [shifts, setShifts] = useState(() => getAllShifts());
  const [paperInventory, setPaperInventory] = useState(() => getPaperInventorySummary());
  const [rrbLoading, setRrbLoading] = useState(
    !(Array.isArray(initialQuestions) && initialQuestions.length > 0)
  );

  // Filters & Pagination for Question Bank
  const [rrbSubjectFilter, setRrbSubjectFilter] = useState('All');
  const [rrbTopicFilter, setRrbTopicFilter] = useState('All');
  const [rrbShiftFilter, setRrbShiftFilter] = useState('All');
  const [rrbExamFilter, setRrbExamFilter] = useState('All');
  const [rrbEligibleFilter, setRrbEligibleFilter] = useState('All');
  const [rrbTierFilter, setRrbTierFilter] = useState('All');
  const [rrbQualityFilter, setRrbQualityFilter] = useState('All');
  const [rrbStatusFilter, setRrbStatusFilter] = useState('All');
  const [rrbSearch, setRrbSearch] = useState('');
  const [rrbPage, setRrbPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [pageInputVal, setPageInputVal] = useState('1');

  // Multi-select & Bulk Reassign State
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [bulkSubjectId, setBulkSubjectId] = useState('general-knowledge');
  const [bulkTopicId, setBulkTopicId] = useState('indian-history');
  const [bulkSubtopic, setBulkSubtopic] = useState('');
  const [bulkStatus, setBulkStatus] = useState('NO_CHANGE');
  const [bulkEligibleExams, setBulkEligibleExams] = useState([]);
  const [bulkSaving, setBulkSaving] = useState(false);

  // Review Queue State
  const [reviewTierFilter, setReviewTierFilter] = useState('MANUAL_REVIEW'); // 'MANUAL_REVIEW' | 'REVIEW' | 'ALL_PENDING'
  const [reviewPage, setReviewPage] = useState(1);

  // Duplicates & Quality Validator State
  const [qualityFlagFilter, setQualityFlagFilter] = useState('ALL');
  const [qualityGroupDuplicates, setQualityGroupDuplicates] = useState(false);
  const [qualityPage, setQualityPage] = useState(1);

  // Shifts & PYP Paper Manager State
  const [shiftExamFilter, setShiftExamFilter] = useState('All');
  const [shiftSearch, setShiftSearch] = useState('');
  const [previewShift, setPreviewShift] = useState(null);
  const [bulkShiftTarget, setBulkShiftTarget] = useState(null);
  const [bulkShiftSubjectId, setBulkShiftSubjectId] = useState('NO_CHANGE');
  const [bulkShiftEligibleExam, setBulkShiftEligibleExam] = useState('NO_CHANGE');

  // Question Edit Modal State
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [savingQuestion, setSavingQuestion] = useState(false);

  // Shift Edit Modal State
  const [editingShift, setEditingShift] = useState(null);
  const [shiftFormData, setShiftFormData] = useState(null);

  // Bank Refresh & Firestore Seeding State
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedProgress, setSeedProgress] = useState(0);
  const [seedLog, setSeedLog] = useState('');

  // Delete Confirmation State (manual single question delete only)
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Bulk JSON Import/Export + Pre-Import Validator State
  const [bulkJson, setBulkJson] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkPreview, setBulkPreview] = useState(null);
  const [bulkSummary, setBulkSummary] = useState(null);

  // Overview toggles
  const [showTopicGrid, setShowTopicGrid] = useState(false);
  const [showInventoryDetails, setShowInventoryDetails] = useState(true);

  useEffect(() => {
    setPageInputVal(String(rrbPage));
  }, [rrbPage]);

  // Sync subject -> first topic default in Bulk Reassign bar
  useEffect(() => {
    const list = SUBJECT_TOPIC_TREE[bulkSubjectId] || [];
    if (list.length > 0 && !list.some((t) => t.id === bulkTopicId)) {
      setBulkTopicId(list[0].id);
    }
  }, [bulkSubjectId, bulkTopicId]);

  // Keep synced if parent passes updated questions on initial load
  useEffect(() => {
    if (Array.isArray(initialQuestions) && initialQuestions.length > 0 && rrbQuestions.length === 0) {
      setRrbQuestions(initialQuestions);
      setRrbLoading(false);
    }
  }, [initialQuestions, rrbQuestions.length]);

  const syncStatsAndParent = (nextQuestions, activeShifts = shifts) => {
    const unified = computeUnifiedStats(nextQuestions, activeShifts, { gkQuestionsCount });
    saveCachedUnifiedStats(unified);
    if (typeof onQuestionsChanged === 'function') {
      onQuestionsChanged(nextQuestions);
    }
  };

  const loadRrbData = async (forceRefresh = false) => {
    setRrbLoading(true);
    try {
      const [manifestData, qList] = await Promise.all([
        loadBankManifest(forceRefresh).catch(() => null),
        getMockQuestions(forceRefresh)
      ]);
      if (manifestData) setManifest(manifestData);
      await loadAllShifts();
      const loadedShifts = getAllShifts();
      setRrbQuestions(qList);
      setShifts(loadedShifts);
      setPaperInventory(getPaperInventorySummary());
      syncStatsAndParent(qList, loadedShifts);
    } catch (err) {
      console.error('Failed to load unified mock data:', err);
    } finally {
      setRrbLoading(false);
    }
  };

  useEffect(() => {
    loadBankManifest(false)
      .then((m) => {
        if (m) setManifest(m);
      })
      .catch(() => {});

    if (!Array.isArray(initialQuestions) || initialQuestions.length === 0) {
      loadRrbData(false);
    } else {
      loadAllShifts()
        .then(() => {
          setShifts(getAllShifts());
          setPaperInventory(getPaperInventorySummary());
        })
        .catch(() => {});
      setRrbLoading(false);
    }
  }, []);

  // Canonical Statistics
  const rrbStats = useMemo(
    () => computeUnifiedStats(rrbQuestions, shifts, { gkQuestionsCount }),
    [rrbQuestions, shifts, gkQuestionsCount]
  );

  // Live confidence & quality breakdown (falls back to manifest before full bank finishes loading)
  const auditBreakdown = useMemo(() => {
    if (rrbQuestions.length === 0 && manifest) {
      return {
        tiers: manifest.confidenceTiers || { HIGH: 0, REVIEW: 0, MANUAL_REVIEW: 0 },
        flags: manifest.qualityFlagsBreakdown || {},
        pendingReviewCount:
          (manifest.confidenceTiers?.MANUAL_REVIEW || 0) + (manifest.confidenceTiers?.REVIEW || 0),
        qualityIssueCount: Object.values(manifest.qualityFlagsBreakdown || {}).reduce(
          (a, b) => a + (Number(b) || 0),
          0
        )
      };
    }

    const tiers = { HIGH: 0, REVIEW: 0, MANUAL_REVIEW: 0 };
    const flags = {};
    let pendingReviewCount = 0;
    let qualityIssueCount = 0;

    for (const q of rrbQuestions) {
      const tier = q.classificationTier || 'HIGH';
      tiers[tier] = (tiers[tier] || 0) + 1;
      if (tier !== 'HIGH' && q.classificationStatus !== 'ADMIN_VERIFIED') {
        pendingReviewCount++;
      }
      const qFlags = Array.isArray(q.qualityFlags) ? q.qualityFlags : [];
      if (qFlags.length > 0) {
        qualityIssueCount++;
        for (const f of qFlags) {
          flags[f] = (flags[f] || 0) + 1;
        }
      }
    }

    return { tiers, flags, pendingReviewCount, qualityIssueCount };
  }, [rrbQuestions, manifest]);

  // Unique Canonical Topics + Legacy Subtopics for active subject filter
  const availableTopicsForFilter = useMemo(() => {
    if (rrbSubjectFilter !== 'All') {
      const subMeta = CANONICAL_SUBJECTS.find((s) => s.name === rrbSubjectFilter || s.id === rrbSubjectFilter);
      const treeTopics = subMeta ? SUBJECT_TOPIC_TREE[subMeta.id] || [] : [];
      const set = new Map(treeTopics.map((t) => [t.id, t.name]));
      for (const q of rrbQuestions) {
        if (getCanonicalSubjectId(q) === subMeta?.id && q.topicId && q.topic) {
          if (!set.has(q.topicId)) set.set(q.topicId, q.topic);
        }
      }
      return Array.from(set.entries()).map(([id, name]) => ({ id, name }));
    }
    return CANONICAL_SUBJECTS.flatMap((s) =>
      (SUBJECT_TOPIC_TREE[s.id] || []).map((t) => ({ id: t.id, name: `${t.name} (${s.shortName})` }))
    );
  }, [rrbQuestions, rrbSubjectFilter]);

  // Filtered Questions for Sub-Tab 2 (Question Bank)
  const filteredRrbQuestions = useMemo(() => {
    return rrbQuestions.filter((q) => {
      if (rrbSubjectFilter !== 'All') {
        const subMeta = CANONICAL_SUBJECTS.find((s) => s.name === rrbSubjectFilter || s.id === rrbSubjectFilter);
        if (subMeta && getCanonicalSubjectId(q) !== subMeta.id) return false;
      }

      if (rrbTopicFilter !== 'All') {
        const canonicalTarget = resolveCanonicalTopicId(rrbTopicFilter);
        const qTopic = resolveCanonicalTopicId(q.topicId || '');
        const matchTopic =
          q.topicId === rrbTopicFilter ||
          qTopic === canonicalTarget ||
          q.subtopic === rrbTopicFilter ||
          q.topic === rrbTopicFilter;
        if (!matchTopic) return false;
      }

      if (rrbExamFilter !== 'All') {
        if (rrbExamFilter === 'APPSC Group II') {
          if (q.examType !== 'APPSC Group II' && !String(q.id || '').includes('appsc')) return false;
        } else if (rrbExamFilter === 'Group D 2025') {
          if (q.examType !== 'RRB Group D' && !String(q.id || '').includes('group-d')) return false;
        } else if (rrbExamFilter === 'SSC CGL') {
          const isSsc = q.examType === 'SSC CGL' || (q.examLevel || '').includes('CGL') || String(q.id || '').startsWith('ssc-cgl');
          if (!isSsc) return false;
        } else if (rrbExamFilter === 'Graduate 2026') {
          if (q.examType === 'SSC CGL' || q.examType === 'APPSC Group II' || (q.examLevel || '') !== 'Graduate') return false;
          const is2026 = q.examYear === '2026' || String(q.id || '').includes('2026') || (q.examDate && q.examDate.includes('2026'));
          if (!is2026) return false;
        } else if (rrbExamFilter === 'Graduate 2024') {
          if (q.examType === 'SSC CGL' || q.examType === 'APPSC Group II' || (q.examLevel || '') !== 'Graduate') return false;
          const is2024 = q.examYear === '2024' || (q.examDate && (q.examDate.includes('2025') || q.examDate.includes('05/06/2025'))) || String(q.id || '').includes('2025');
          if (!is2024) return false;
        } else if (rrbExamFilter === 'Under Graduate') {
          if (
            q.examType === 'SSC CGL' ||
            q.examType === 'RRB Group D' ||
            q.examType === 'APPSC Group II' ||
            String(q.id || '').includes('group-d') ||
            String(q.id || '').includes('appsc') ||
            (q.examLevel || 'Under Graduate') !== 'Under Graduate'
          ) {
            return false;
          }
        }
      }

      if (rrbEligibleFilter !== 'All') {
        const eligible = Array.isArray(q.eligibleExams) ? q.eligibleExams : [];
        if (!eligible.includes(rrbEligibleFilter)) return false;
      }

      if (rrbTierFilter !== 'All') {
        if ((q.classificationTier || 'HIGH') !== rrbTierFilter) return false;
      }

      if (rrbQualityFilter !== 'All') {
        const qFlags = Array.isArray(q.qualityFlags) ? q.qualityFlags : [];
        if (!qFlags.includes(rrbQualityFilter)) return false;
      }

      if (rrbShiftFilter !== 'All') {
        const targetShiftNum = parseInt(rrbShiftFilter, 10);
        if (q.shiftNumber !== targetShiftNum && q.setNumber !== targetShiftNum) {
          return false;
        }
      }

      if (rrbStatusFilter !== 'All') {
        const isUnv = isImportantOrReviewQuestion(q);
        if (rrbStatusFilter === 'Published' && isUnv) return false;
        if (rrbStatusFilter === 'Needs Review' && !isUnv) return false;
      }

      if (rrbSearch.trim()) {
        const query = rrbSearch.toLowerCase().trim();
        const matchQ = getQuestionText(q).toLowerCase().includes(query);
        const matchOpts = getOptionTexts(q).some((opt) => opt.toLowerCase().includes(query));
        const matchSubtopic = (q.subtopic || '').toLowerCase().includes(query);
        const matchTopic = (q.topic || '').toLowerCase().includes(query);
        const matchSubject = (q.subject || '').toLowerCase().includes(query);
        const matchId = (q.id || '').toLowerCase().includes(query);
        return matchQ || matchOpts || matchSubtopic || matchTopic || matchSubject || matchId;
      }

      return true;
    });
  }, [
    rrbQuestions,
    rrbSubjectFilter,
    rrbTopicFilter,
    rrbShiftFilter,
    rrbExamFilter,
    rrbEligibleFilter,
    rrbTierFilter,
    rrbQualityFilter,
    rrbStatusFilter,
    rrbSearch
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRrbQuestions.length / itemsPerPage));
  const paginatedQuestions = useMemo(() => {
    const safePage = Math.min(rrbPage, totalPages);
    const start = (safePage - 1) * itemsPerPage;
    return filteredRrbQuestions.slice(start, start + itemsPerPage);
  }, [filteredRrbQuestions, rrbPage, itemsPerPage, totalPages]);

  // Review Queue list (Sub-Tab 3)
  const reviewQueueQuestions = useMemo(() => {
    return rrbQuestions.filter((q) => {
      const tier = q.classificationTier || 'HIGH';
      const status = q.classificationStatus || 'AUTO_VERIFIED';
      if (status === 'ADMIN_VERIFIED') return false;
      if (reviewTierFilter === 'MANUAL_REVIEW') return tier === 'MANUAL_REVIEW';
      if (reviewTierFilter === 'REVIEW') return tier === 'REVIEW';
      return tier === 'MANUAL_REVIEW' || tier === 'REVIEW';
    });
  }, [rrbQuestions, reviewTierFilter]);

  const reviewTotalPages = Math.max(1, Math.ceil(reviewQueueQuestions.length / 25));
  const paginatedReviewQuestions = useMemo(() => {
    const start = (Math.min(reviewPage, reviewTotalPages) - 1) * 25;
    return reviewQueueQuestions.slice(start, start + 25);
  }, [reviewQueueQuestions, reviewPage, reviewTotalPages]);

  // Quality & Duplicates list (Sub-Tab 5)
  const qualityQuestions = useMemo(() => {
    const filtered = rrbQuestions.filter((q) => {
      const flags = Array.isArray(q.qualityFlags) ? q.qualityFlags : [];
      if (flags.length === 0) return false;
      if (qualityFlagFilter === 'ALL') return true;
      return flags.includes(qualityFlagFilter);
    });
    if (qualityGroupDuplicates) {
      return [...filtered].sort((a, b) =>
        String(a.duplicateGroupId || 'zzz').localeCompare(String(b.duplicateGroupId || 'zzz'))
      );
    }
    return filtered;
  }, [rrbQuestions, qualityFlagFilter, qualityGroupDuplicates]);

  const qualityTotalPages = Math.max(1, Math.ceil(qualityQuestions.length / 25));
  const paginatedQualityQuestions = useMemo(() => {
    const start = (Math.min(qualityPage, qualityTotalPages) - 1) * 25;
    return qualityQuestions.slice(start, start + 25);
  }, [qualityQuestions, qualityPage, qualityTotalPages]);

  // Merged Shifts (combining `shifts` with `manifest.shifts` per-paper breakdown)
  const mergedShifts = useMemo(() => {
    const manifestMap = new Map((manifest?.shifts || []).map((ms) => [ms.id, ms]));
    return shifts.map((s) => {
      const ms = manifestMap.get(s.id);
      return ms
        ? {
            ...s,
            questionCount: ms.questionCount ?? s.questionCount,
            incompleteCount: ms.incompleteCount ?? 0,
            subjectBreakdown: ms.subjectBreakdown || {}
          }
        : s;
    });
  }, [shifts, manifest]);

  const filteredShifts = useMemo(() => {
    return mergedShifts.filter((shift) => {
      const sId = String(shift.id || '').toLowerCase();
      const examType = String(shift.examType || '');
      if (shiftExamFilter !== 'All') {
        if (shiftExamFilter === 'APPSC' && examType !== 'APPSC Group II' && !sId.includes('appsc')) return false;
        if (shiftExamFilter === 'Group D' && examType !== 'RRB Group D' && !sId.includes('group-d')) return false;
        if (shiftExamFilter === 'SSC CGL' && examType !== 'SSC CGL' && !sId.includes('ssc')) return false;
        if (shiftExamFilter === 'NTPC Grad' && (shift.examLevel !== 'Graduate' || sId.includes('ssc'))) return false;
        if (shiftExamFilter === 'NTPC UG' && (shift.examLevel === 'Graduate' || sId.includes('ssc') || sId.includes('group-d') || sId.includes('appsc'))) return false;
      }
      if (shiftSearch.trim()) {
        const q = shiftSearch.toLowerCase().trim();
        const hay = `${shift.title || ''} ${shift.id || ''} ${shift.examDate || ''} ${shift.examName || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [mergedShifts, shiftExamFilter, shiftSearch]);

  const handleJumpToPage = (targetPage) => {
    const pageNum = parseInt(targetPage, 10);
    if (isNaN(pageNum)) return;
    const clamped = Math.max(1, Math.min(totalPages, pageNum));
    setRrbPage(clamped);
    setPageInputVal(String(clamped));
    try {
      const container = document.getElementById('admin-questions-list-top');
      if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      // ignore
    }
  };

  const renderPagination = (position = 'bottom') => {
    if (totalPages <= 1) return null;
    const middlePage = Math.max(1, Math.ceil(totalPages / 2));
    const startIdx = (rrbPage - 1) * itemsPerPage + 1;
    const endIdx = Math.min(rrbPage * itemsPerPage, filteredRrbQuestions.length);

    const pageNumbers = [];
    for (let i = Math.max(1, rrbPage - 2); i <= Math.min(totalPages, rrbPage + 2); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className={`flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white rounded-2xl p-3 sm:p-4 border border-[#E3EAF2] text-xs shadow-xs ${position === 'top' ? 'mb-2' : 'mt-4'}`}>
        <div className="flex items-center gap-2 flex-wrap text-slate-600">
          <span className="font-medium">
            Showing <strong className="text-[#12345A]">{startIdx.toLocaleString()}</strong> to{' '}
            <strong className="text-[#12345A]">{endIdx.toLocaleString()}</strong> of{' '}
            <strong className="text-[#12345A]">{filteredRrbQuestions.length.toLocaleString()}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-[#12345A]">
            Page {rrbPage} of {totalPages}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#F6F8FC] p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              disabled={rrbPage === 1}
              onClick={() => handleJumpToPage(1)}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-white hover:text-[#12345A] disabled:opacity-40 cursor-pointer"
            >
              First (1)
            </button>
            <button
              type="button"
              disabled={rrbPage === middlePage}
              onClick={() => handleJumpToPage(middlePage)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                rrbPage === middlePage ? 'bg-[#12345A] text-white' : 'text-slate-700 hover:bg-white'
              }`}
            >
              Mid ({middlePage})
            </button>
            <button
              type="button"
              disabled={rrbPage === totalPages}
              onClick={() => handleJumpToPage(totalPages)}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-white hover:text-[#12345A] disabled:opacity-40 cursor-pointer"
            >
              Last ({totalPages})
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={rrbPage <= 1}
              onClick={() => handleJumpToPage(rrbPage - 1)}
              className="px-2.5 py-1.5 rounded-lg border border-[#E3EAF2] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Prev
            </button>
            {pageNumbers.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleJumpToPage(num)}
                className={`w-7 h-7 rounded-lg font-bold text-[11px] cursor-pointer ${
                  rrbPage === num ? 'bg-[#12345A] text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              disabled={rrbPage >= totalPages}
              onClick={() => handleJumpToPage(rrbPage + 1)}
              className="px-2.5 py-1.5 rounded-lg border border-[#E3EAF2] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleJumpToPage(pageInputVal);
            }}
            className="flex items-center gap-1.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl px-2 py-1"
          >
            <label htmlFor={`jump-page-${position}`} className="text-slate-500 font-semibold text-[11px]">
              Go:
            </label>
            <input
              id={`jump-page-${position}`}
              type="number"
              min="1"
              max={totalPages}
              value={pageInputVal}
              onChange={(e) => setPageInputVal(e.target.value)}
              className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded-md text-center font-bold text-slate-800 text-xs"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-[#12345A] text-white font-bold text-[11px] cursor-pointer"
            >
              Go
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Helper to record classification history snapshot safely without overwriting id or correctAnswer
  const buildClassificationPatch = (q, patch, actionLabel) => {
    const nowIso = new Date().toISOString();
    const prevSnapshot = {
      subject: q.subject,
      subjectId: q.subjectId,
      categoryId: q.categoryId,
      topic: q.topic,
      topicId: q.topicId,
      subtopic: q.subtopic,
      eligibleExams: q.eligibleExams || [],
      status: q.status,
      classificationConfidence: q.classificationConfidence,
      classificationTier: q.classificationTier,
      classificationStatus: q.classificationStatus
    };
    const historyEntry = {
      timestamp: nowIso,
      action: actionLabel,
      previous: prevSnapshot
    };
    return {
      ...q,
      ...patch,
      id: q.id,
      correctAnswer: q.correctAnswer,
      correctLetter: q.correctLetter,
      classificationHistory: [...(Array.isArray(q.classificationHistory) ? q.classificationHistory : []), historyEntry].slice(-10),
      updatedAt: nowIso
    };
  };

  // Multi-select toggles
  const toggleSelectQuestion = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllOnPage = () => {
    const pageIds = paginatedQuestions.map((q) => q.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Bulk Reassign selected questions (preserves original id & correctAnswer)
  const handleBulkReassign = async () => {
    if (selectedIds.size === 0 || bulkSaving) return;
    setBulkSaving(true);
    try {
      const subMeta = CANONICAL_SUBJECTS.find((s) => s.id === bulkSubjectId);
      const topicMeta = (SUBJECT_TOPIC_TREE[bulkSubjectId] || []).find((t) => t.id === bulkTopicId);
      const catId = SUBJECT_CAT_MAP[bulkSubjectId] || 'gk';
      const updatedMap = new Map();

      for (const q of rrbQuestions) {
        if (!selectedIds.has(q.id)) continue;
        const nextStatus = bulkStatus === 'NO_CHANGE' ? q.status || 'Published' : bulkStatus;
        const isVer = nextStatus === 'Published';
        const patched = buildClassificationPatch(
          q,
          {
            subjectId: bulkSubjectId,
            subject: subMeta?.name || q.subject,
            categoryId: catId,
            topicId: bulkTopicId,
            topic: topicMeta?.name || q.topic,
            subtopic: bulkSubtopic.trim() || topicMeta?.name || q.subtopic,
            eligibleExams: bulkEligibleExams.length > 0 ? bulkEligibleExams : (q.eligibleExams || []),
            manualClassificationOverride: true,
            classificationConfidence: 100,
            classificationTier: 'HIGH',
            classificationStatus: 'ADMIN_VERIFIED',
            status: nextStatus,
            verificationStatus: isVer ? 'VERIFIED' : 'UNVERIFIED',
            isVerified: isVer
          },
          'BULK_REASSIGN'
        );
        saveLocalQuestionOverride(patched);
        updatedMap.set(q.id, patched);
      }

      const nextQuestions = rrbQuestions.map((q) => updatedMap.get(q.id) || q);
      setRrbQuestions(nextQuestions);
      syncStatsAndParent(nextQuestions);
      bulkSaveMockQuestions(Array.from(updatedMap.values())).catch(() => {});

      const count = updatedMap.size;
      setSelectedIds(new Set());
      if (onNotify) {
        onNotify(`Reassigned ${count} questions to ${subMeta?.name} → ${topicMeta?.name || bulkTopicId}.`, 'success');
      }
    } finally {
      setBulkSaving(false);
    }
  };

  // Review Queue: Approve Suggestion
  const handleApproveSuggestion = async (q) => {
    const sug = q.suggestedClassification || classifyQuestionConceptually(q);
    const subId = sug.subjectId || getCanonicalSubjectId(q);
    const subMeta = CANONICAL_SUBJECTS.find((s) => s.id === subId);
    const patched = buildClassificationPatch(
      q,
      {
        subjectId: subId,
        subject: sug.subjectName || subMeta?.name || q.subject,
        categoryId: SUBJECT_CAT_MAP[subId] || q.categoryId || 'gk',
        topicId: sug.topicId || q.topicId,
        topic: sug.topicName || q.topic,
        subtopic: sug.subtopic || sug.topicName || q.subtopic,
        manualClassificationOverride: true,
        classificationConfidence: Math.max(95, Number(sug.confidence || 95)),
        classificationTier: 'HIGH',
        classificationStatus: 'ADMIN_VERIFIED',
        status: 'Published',
        verificationStatus: 'VERIFIED',
        isVerified: true
      },
      'APPROVE_SUGGESTION'
    );
    saveLocalQuestionOverride(patched);
    saveMockQuestion(patched).catch(() => {});
    const nextQuestions = rrbQuestions.map((item) => (item.id === q.id ? patched : item));
    setRrbQuestions(nextQuestions);
    syncStatsAndParent(nextQuestions);
    if (onNotify) onNotify(`Approved classification for Q#${q.questionNumber || q.id}.`, 'success');
  };

  // Review Queue: Revert last classification change
  const handleRevertClassification = async (q) => {
    const history = Array.isArray(q.classificationHistory) ? q.classificationHistory : [];
    if (history.length === 0) return;
    const lastEntry = history[history.length - 1];
    const prev = lastEntry?.previous;
    if (!prev) return;
    const reverted = {
      ...q,
      ...prev,
      id: q.id,
      correctAnswer: q.correctAnswer,
      correctLetter: q.correctLetter,
      manualClassificationOverride: false,
      classificationHistory: history.slice(0, -1),
      updatedAt: new Date().toISOString()
    };
    saveLocalQuestionOverride(reverted);
    saveMockQuestion(reverted).catch(() => {});
    const nextQuestions = rrbQuestions.map((item) => (item.id === q.id ? reverted : item));
    setRrbQuestions(nextQuestions);
    syncStatsAndParent(nextQuestions);
    if (onNotify) onNotify(`Reverted Q#${q.questionNumber || q.id} to previous classification.`, 'info');
  };

  // Non-destructive Duplicate / Quality Validator action
  const handleMarkDuplicateOrVerify = async (q, mode) => {
    const nowIso = new Date().toISOString();
    const existingFlags = Array.isArray(q.qualityFlags) ? q.qualityFlags : [];
    const patched =
      mode === 'duplicate'
        ? {
            ...q,
            status: 'Needs Review',
            verificationStatus: 'UNVERIFIED',
            isVerified: false,
            qualityFlags: existingFlags.includes('DUPLICATE_QUESTION')
              ? existingFlags
              : [...existingFlags, 'DUPLICATE_QUESTION'],
            updatedAt: nowIso
          }
        : {
            ...q,
            status: 'Published',
            verificationStatus: 'VERIFIED',
            isVerified: true,
            classificationStatus: 'ADMIN_VERIFIED',
            classificationTier: 'HIGH',
            qualityFlags: existingFlags.filter((f) => f !== 'LOW_CONFIDENCE_CLASSIFICATION'),
            updatedAt: nowIso
          };
    saveLocalQuestionOverride(patched);
    saveMockQuestion(patched).catch(() => {});
    const nextQuestions = rrbQuestions.map((item) => (item.id === q.id ? patched : item));
    setRrbQuestions(nextQuestions);
    syncStatsAndParent(nextQuestions);
    if (onNotify) {
      onNotify(
        mode === 'duplicate'
          ? `Question ${q.id} flagged as Duplicate (Needs Review) non-destructively.`
          : `Question ${q.id} verified & cleared for mocks.`,
        'success'
      );
    }
  };

  // Fast 1-Click Verification Handler
  const handleQuickVerify = async (q) => {
    const updatedQuestion = {
      ...q,
      status: 'Published',
      verificationStatus: 'VERIFIED',
      questionType: q.questionType === 'IMPORTANT' ? 'PYQ' : (q.questionType || 'PYQ'),
      isVerified: true,
      classificationStatus: 'ADMIN_VERIFIED',
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveLocalQuestionOverride(updatedQuestion);
    saveMockQuestion(updatedQuestion).catch(() => {});
    const nextQuestions = rrbQuestions.map((item) => (item.id === q.id ? updatedQuestion : item));
    setRrbQuestions(nextQuestions);
    syncStatsAndParent(nextQuestions);
    if (onNotify) onNotify(`Question #${q.questionNumber || q.id} marked as Verified!`, 'success');
  };

  const handleQuickVerifyAllFiltered = async () => {
    const unverifiedList = filteredRrbQuestions.filter((q) => isImportantOrReviewQuestion(q));
    if (unverifiedList.length === 0) {
      if (onNotify) onNotify('No Needs Review questions in active filter.', 'info');
      return;
    }
    const updatedIds = new Set(unverifiedList.map((q) => q.id));
    const nowIso = new Date().toISOString();
    const updatedItems = [];

    for (const q of unverifiedList) {
      const updated = {
        ...q,
        status: 'Published',
        verificationStatus: 'VERIFIED',
        questionType: q.questionType === 'IMPORTANT' ? 'PYQ' : (q.questionType || 'PYQ'),
        isVerified: true,
        classificationStatus: 'ADMIN_VERIFIED',
        verifiedAt: nowIso,
        updatedAt: nowIso
      };
      saveLocalQuestionOverride(updated);
      updatedItems.push(updated);
    }

    const nextQuestions = rrbQuestions.map((item) => {
      if (!updatedIds.has(item.id)) return item;
      return {
        ...item,
        status: 'Published',
        verificationStatus: 'VERIFIED',
        questionType: item.questionType === 'IMPORTANT' ? 'PYQ' : (item.questionType || 'PYQ'),
        isVerified: true,
        classificationStatus: 'ADMIN_VERIFIED',
        verifiedAt: nowIso,
        updatedAt: nowIso
      };
    });

    setRrbQuestions(nextQuestions);
    syncStatsAndParent(nextQuestions);
    bulkSaveMockQuestions(updatedItems).catch(() => {});
    if (onNotify) onNotify(`Fast-verified ${unverifiedList.length} questions!`, 'success');
  };

  // Bulk Reclassify entire Shift
  const handleBulkReclassifyShift = async () => {
    if (!bulkShiftTarget) return;
    const sNum = bulkShiftTarget.shiftNumber;
    const isAppsc = bulkShiftTarget.examType === 'APPSC Group II' || String(bulkShiftTarget.id || '').includes('appsc');
    const matchesShift = (q) => {
      if (isAppsc) {
        if (bulkShiftTarget.paperNumber === 0) return q.paperNumber === 0 || String(q.id).includes('2024-prelims');
        if (bulkShiftTarget.paperNumber === 1) return q.paperNumber === 1 || String(q.id).includes('-p1-');
        return (q.examType === 'APPSC Group II' || String(q.id).includes('appsc')) && q.paperNumber !== 0 && q.paperNumber !== 1;
      }
      return (q.shiftNumber === sNum || q.setNumber === sNum) &&
        (!bulkShiftTarget.examType || q.examType === bulkShiftTarget.examType || String(q.id).toLowerCase().includes(String(bulkShiftTarget.examType).toLowerCase().split(' ')[0]));
    };

    const updatedItems = [];
    const nextQuestions = rrbQuestions.map((q) => {
      if (!matchesShift(q)) return q;
      const nextSubId = bulkShiftSubjectId === 'NO_CHANGE' ? getCanonicalSubjectId(q) : bulkShiftSubjectId;
      const subMeta = CANONICAL_SUBJECTS.find((s) => s.id === nextSubId);
      const nextEligible =
        bulkShiftEligibleExam === 'NO_CHANGE'
          ? (q.eligibleExams || [])
          : Array.from(new Set([...(q.eligibleExams || []), bulkShiftEligibleExam]));
      const patched = buildClassificationPatch(
        q,
        {
          subjectId: nextSubId,
          subject: subMeta?.name || q.subject,
          categoryId: SUBJECT_CAT_MAP[nextSubId] || q.categoryId,
          eligibleExams: nextEligible,
          manualClassificationOverride: bulkShiftSubjectId !== 'NO_CHANGE' ? true : q.manualClassificationOverride
        },
        'BULK_SHIFT_RECLASSIFY'
      );
      saveLocalQuestionOverride(patched);
      updatedItems.push(patched);
      return patched;
    });

    setRrbQuestions(nextQuestions);
    syncStatsAndParent(nextQuestions);
    if (updatedItems.length > 0) bulkSaveMockQuestions(updatedItems).catch(() => {});
    setBulkShiftTarget(null);
    if (onNotify) onNotify(`Updated ${updatedItems.length} questions in ${bulkShiftTarget.title}.`, 'success');
  };

  // Open Edit Modal for a question
  const handleOpenEdit = (q) => {
    const subId = getCanonicalSubjectId(q);
    const topics = SUBJECT_TOPIC_TREE[subId] || [];
    const topicId = q.topicId && topics.some((t) => t.id === q.topicId) ? q.topicId : (topics[0]?.id || 'static-gk');
    setEditingQuestion(q);
    setEditFormData({
      id: q.id,
      shiftNumber: q.shiftNumber,
      questionNumber: q.questionNumber,
      examName: q.examName || 'Official CBT Paper',
      examYear: q.examYear || '2025',
      subjectId: subId,
      subject: q.subject || CANONICAL_SUBJECTS.find((s) => s.id === subId)?.name || 'General Knowledge',
      topicId,
      subtopic: q.subtopic || '',
      eligibleExams: Array.isArray(q.eligibleExams) ? q.eligibleExams : [],
      questionEn: q.question?.en || (typeof q.question === 'string' ? q.question : ''),
      questionTe: q.question?.te || '',
      optionAEn: q.options?.en?.[0] || '',
      optionBEn: q.options?.en?.[1] || '',
      optionCEn: q.options?.en?.[2] || '',
      optionDEn: q.options?.en?.[3] || '',
      optionATe: q.options?.te?.[0] || '',
      optionBTe: q.options?.te?.[1] || '',
      optionCTe: q.options?.te?.[2] || '',
      optionDTe: q.options?.te?.[3] || '',
      correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
      explanationEn: q.explanation?.en || '',
      explanationTe: q.explanation?.te || '',
      status: q.status || 'Published'
    });
  };

  // Save Question
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!editFormData || !editingQuestion) return;
    setSavingQuestion(true);

    const letters = ['A', 'B', 'C', 'D'];
    const isVerified = editFormData.status === 'Published';
    const subMeta = CANONICAL_SUBJECTS.find((s) => s.id === editFormData.subjectId);
    const topicMeta = (SUBJECT_TOPIC_TREE[editFormData.subjectId] || []).find((t) => t.id === editFormData.topicId);
    const ansIdx = parseInt(editFormData.correctAnswer, 10);

    const updatedQuestion = buildClassificationPatch(
      editingQuestion,
      {
        subjectId: editFormData.subjectId,
        subject: subMeta?.name || editFormData.subject,
        categoryId: SUBJECT_CAT_MAP[editFormData.subjectId] || 'gk',
        topicId: editFormData.topicId,
        topic: topicMeta?.name || editFormData.subtopic || editingQuestion.topic,
        subtopic: editFormData.subtopic || topicMeta?.name || '',
        eligibleExams: editFormData.eligibleExams,
        manualClassificationOverride: true,
        classificationConfidence: 100,
        classificationTier: 'HIGH',
        classificationStatus: 'ADMIN_VERIFIED',
        question: { en: editFormData.questionEn, te: editFormData.questionTe },
        options: {
          en: [editFormData.optionAEn, editFormData.optionBEn, editFormData.optionCEn, editFormData.optionDEn],
          te: [editFormData.optionATe, editFormData.optionBTe, editFormData.optionCTe, editFormData.optionDTe]
        },
        correctAnswer: Number.isInteger(ansIdx) ? ansIdx : 0,
        correctLetter: letters[Number.isInteger(ansIdx) ? ansIdx : 0] || 'A',
        explanation: { en: editFormData.explanationEn, te: editFormData.explanationTe },
        status: editFormData.status,
        verificationStatus: isVerified ? 'VERIFIED' : 'UNVERIFIED',
        questionType: isVerified ? (editingQuestion.questionType === 'IMPORTANT' ? 'PYQ' : (editingQuestion.questionType || 'PYQ')) : 'IMPORTANT',
        isVerified
      },
      'ADMIN_EDIT'
    );

    saveLocalQuestionOverride(updatedQuestion);
    try {
      await saveMockQuestion(updatedQuestion);
    } catch (err) {
      console.warn('Firestore mock question save notice:', err.message);
    }

    const nextQuestions = rrbQuestions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q));
    setRrbQuestions(nextQuestions);
    syncStatsAndParent(nextQuestions);

    setSavingQuestion(false);
    setEditingQuestion(null);
    setEditFormData(null);
    if (onNotify) onNotify('Question updated and saved!', 'success');
  };

  // Server Seeding Handlers
  const handleSeedToFirestore = async () => {
    if (isSeeding || rrbQuestions.length === 0) return;
    setIsSeeding(true);
    setSeedProgress(0);
    setSeedLog('Preparing official examination questions...');
    try {
      try {
        await migrateOlderGraduateQuestionsTo2024((done, total) => {
          setSeedLog(`Relabeled ${done} of ${total} older graduate questions to 2024...`);
        });
      } catch {
        // ignore migration notice
      }
      const saved = await bulkSaveMockQuestions(rrbQuestions, (done, total) => {
        setSeedProgress(Math.round((done / total) * 100));
        setSeedLog(`Uploading ${done} of ${total} deduplicated questions to server...`);
      });
      setSeedProgress(100);
      setSeedLog(`${saved} questions stored on server.`);
      if (onNotify) onNotify(`Successfully stored ${saved} questions on server!`, 'success');
      await loadRrbData(true);
    } catch (err) {
      const msg = err?.message || 'Upload failed.';
      setSeedLog(`Server upload blocked: ${msg}.`);
      if (onNotify) onNotify(`Server upload failed: ${msg}`, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSeedGroupDToFirestore = async () => {
    const groupDList = rrbQuestions.filter(
      (q) => q.examType === 'RRB Group D' || String(q.id || '').includes('group-d')
    );
    if (isSeeding || groupDList.length === 0) return;
    setIsSeeding(true);
    setSeedProgress(0);
    setSeedLog(`Uploading ${groupDList.length.toLocaleString()} RRB Group D questions...`);
    try {
      const saved = await bulkSaveMockQuestions(groupDList, (done, total) => {
        setSeedProgress(Math.round((done / total) * 100));
        setSeedLog(`Uploading Group D: ${done.toLocaleString()} / ${total.toLocaleString()}...`);
      });
      setSeedProgress(100);
      setSeedLog(`Stored ${saved.toLocaleString()} RRB Group D questions.`);
      if (onNotify) onNotify(`Uploaded ${saved.toLocaleString()} RRB Group D questions!`, 'success');
      await loadRrbData();
    } catch (err) {
      const msg = err?.message || 'Upload failed.';
      setSeedLog(`Group D upload failed: ${msg}`);
      if (onNotify) onNotify(`Group D upload failed: ${msg}`, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSeedAppscPrelims2024ToFirestore = async () => {
    const appsc2024List = rrbQuestions.filter(
      (q) =>
        (q.examType === 'APPSC Group II' || String(q.id || '').includes('appsc')) &&
        (q.paperNumber === 0 || q.examYear === '2024' || String(q.id || '').includes('2024-prelims'))
    );
    if (appsc2024List.length === 0) {
      setSubTab('bulkJson');
      if (onNotify) onNotify('APPSC Prelims 2024 JSON not loaded — import here.', 'info');
      return;
    }
    if (isSeeding) return;
    setIsSeeding(true);
    setSeedProgress(0);
    setSeedLog(`Uploading ${appsc2024List.length} APPSC Prelims 2024 questions...`);
    try {
      const saved = await bulkSaveMockQuestions(appsc2024List, (done, total) => {
        setSeedProgress(Math.round((done / total) * 100));
        setSeedLog(`Uploading APPSC 2024: ${done} / ${total}...`);
      });
      setSeedProgress(100);
      setSeedLog(`Stored ${saved} APPSC 2024 Prelims questions.`);
      if (onNotify) onNotify(`Uploaded ${saved} APPSC 2024 Prelims questions!`, 'success');
      await loadRrbData(true);
    } catch (err) {
      const msg = err?.message || 'Upload failed.';
      setSeedLog(`APPSC upload failed: ${msg}`);
      if (onNotify) onNotify(`APPSC upload failed: ${msg}`, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Manual Single Question Delete
  const confirmDeleteQuestion = async () => {
    if (!deleteTarget) return;
    deleteLocalQuestionOverride(deleteTarget.id);
    try {
      await deleteMockQuestion(deleteTarget.id);
    } catch {
      // ignore local-only fallback notice
    }
    const nextQuestions = rrbQuestions.filter((q) => q.id !== deleteTarget.id);
    setRrbQuestions(nextQuestions);
    syncStatsAndParent(nextQuestions);
    setDeleteTarget(null);
    if (onNotify) onNotify('Question removed.', 'info');
  };

  // Shift Edit Handlers
  const handleOpenEditShift = (shift) => {
    setEditingShift(shift);
    setShiftFormData({
      title: shift.title,
      examDate: shift.examDate,
      shiftTiming: shift.shiftTiming,
      durationMinutes: shift.durationMinutes || 90,
      totalMarks: shift.totalMarks || 100,
      negativeMarking: shift.negativeMarking ?? 0.33,
      status: shift.status || 'Published'
    });
  };

  const handleSaveShift = (e) => {
    e.preventDefault();
    if (!editingShift || !shiftFormData) return;
    saveShiftOverride(editingShift.id, shiftFormData);
    setShifts((prev) => prev.map((s) => (s.id === editingShift.id ? { ...s, ...shiftFormData } : s)));
    setEditingShift(null);
    setShiftFormData(null);
    if (onNotify) onNotify(`Shift ${editingShift.shiftNumber} settings updated!`, 'success');
  };

  const handleTriggerReExtract = async () => {
    if (isExtracting) return;
    setIsExtracting(true);
    try {
      const [manifestData, qList] = await Promise.all([
        loadBankManifest(true).catch(() => null),
        getMockQuestions(true)
      ]);
      if (manifestData) setManifest(manifestData);
      await loadAllShifts();
      const loadedShifts = getAllShifts();
      setRrbQuestions(qList);
      setShifts(loadedShifts);
      setPaperInventory(getPaperInventorySummary());
      const refreshedStats = computeUnifiedStats(qList, loadedShifts, { gkQuestionsCount });
      saveCachedUnifiedStats(refreshedStats);
      if (typeof onQuestionsChanged === 'function') onQuestionsChanged(qList);
      if (onNotify) {
        onNotify(
          `Reloaded ${refreshedStats.totalQuestions.toLocaleString()} questions across ${refreshedStats.totalShifts} shifts.`,
          'success'
        );
      }
    } catch (err) {
      if (onNotify) onNotify(`Reload failed: ${err.message}`, 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleExportJson = (subset = null, label = 'Full-Bank') => {
    const list = Array.isArray(subset) ? subset : rrbQuestions;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(list, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `ExamQuestHub-${label}-${list.length}-Questions.json`);
    dlAnchor.click();
    dlAnchor.remove();
    if (onNotify) onNotify(`Exported ${list.length.toLocaleString()} questions to JSON!`, 'success');
  };

  // Pre-Import Validation & Conceptual Preview
  const handleValidateImportPreview = () => {
    setBulkSummary(null);
    setBulkPreview(null);
    try {
      const parsed = safeJsonParse(bulkJson, null, 6 * 1024 * 1024);
      if (!parsed) throw new Error('Invalid JSON syntax or payload exceeds 6 MB safety limit');
      const items = Array.isArray(parsed) ? parsed : (parsed.questions || []);
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Expected non-empty JSON array of question objects');
      }
      if (items.length > 5000) {
        throw new Error('Bulk import is capped at 5,000 questions per batch');
      }

      const existingIds = new Set(rrbQuestions.map((q) => q.id));
      const subjectBreakdown = {};
      const validItems = [];
      const warnings = [];
      let lowConfCount = 0;
      let duplicateIds = 0;

      for (let i = 0; i < items.length; i++) {
        const raw = stripDangerousKeys(items[i]);
        if (!raw || typeof raw !== 'object') continue;
        const conceptual = classifyQuestionConceptually(raw);
        const normalized = {
          _sourceOrigin: 'uploaded',
          ...raw,
          id: raw.id || `custom-q-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          subjectId: raw.subjectId || conceptual.subjectId,
          subject: raw.subject || conceptual.subjectName,
          categoryId: raw.categoryId || conceptual.categoryId,
          topicId: raw.topicId || conceptual.topicId,
          topic: raw.topic || conceptual.topicName,
          subtopic: raw.subtopic || conceptual.subtopic,
          eligibleExams: Array.isArray(raw.eligibleExams) && raw.eligibleExams.length > 0 ? raw.eligibleExams : conceptual.eligibleExams,
          classificationConfidence: conceptual.confidence,
          classificationTier: conceptual.confidenceTier,
          classificationStatus: conceptual.confidenceTier === 'MANUAL_REVIEW' ? 'MANUAL_REVIEW' : conceptual.classificationStatus,
          suggestedClassification: conceptual,
          qualityFlags: conceptual.qualityFlags,
          imageUrl: raw.imageUrl ? sanitizeMediaUrl(raw.imageUrl, '') : undefined,
          paperUrl: raw.paperUrl ? sanitizeDocumentUrl(raw.paperUrl, '') : undefined,
          status:
            conceptual.confidenceTier === 'MANUAL_REVIEW'
              ? 'Needs Review'
              : (raw.status || 'Published'),
          verificationStatus:
            conceptual.confidenceTier === 'MANUAL_REVIEW'
              ? 'UNVERIFIED'
              : (raw.verificationStatus || 'VERIFIED')
        };

        const vErrs = validateMockQuestion({
          ...normalized,
          categoryId: normalized.categoryId || 'gk',
          subjectId: normalized.subjectId || 'general-knowledge'
        });

        if (existingIds.has(normalized.id)) duplicateIds++;
        if (conceptual.confidence < 80) lowConfCount++;
        if (vErrs.length > 0 && warnings.length < 10) {
          warnings.push(`#${i + 1} (${normalized.id}): ${vErrs[0]}`);
        }
        subjectBreakdown[normalized.subject] = (subjectBreakdown[normalized.subject] || 0) + 1;
        validItems.push(normalized);
      }

      setBulkPreview({
        totalParsed: items.length,
        validCount: validItems.length,
        duplicateIds,
        lowConfCount,
        subjectBreakdown,
        warnings,
        normalizedItems: validItems
      });
    } catch (err) {
      if (onNotify) onNotify(`Validation failed: ${err.message}`, 'error');
    }
  };

  const handleConfirmImportPreview = async () => {
    if (!bulkPreview || !Array.isArray(bulkPreview.normalizedItems) || bulkPreview.normalizedItems.length === 0) return;
    setBulkBusy(true);
    try {
      const currentIds = new Set(rrbQuestions.map((q) => q.id));
      let added = 0;
      let updated = 0;
      for (const item of bulkPreview.normalizedItems) {
        saveLocalQuestionOverride(item);
        if (currentIds.has(item.id)) updated++;
        else added++;
      }

      let firestoreSaved = 0;
      try {
        firestoreSaved = await bulkSaveMockQuestions(bulkPreview.normalizedItems);
      } catch {
        // local override already saved
      }

      setBulkSummary({ total: bulkPreview.normalizedItems.length, added, updated, firestoreSaved });
      setBulkPreview(null);
      setBulkJson('');
      await loadRrbData(false);
      if (onNotify) {
        onNotify(
          `Imported ${bulkPreview.normalizedItems.length.toLocaleString()} questions (${bulkPreview.lowConfCount} flagged for Review Queue).`,
          'success'
        );
      }
    } finally {
      setBulkBusy(false);
    }
  };

  // Display totals prefer live computed stats when loaded, else instant manifest stats
  const displayTotal = rrbQuestions.length > 0 ? rrbStats.total : (manifest?.stats?.totalQuestions || 0);
  const displayVerified = rrbQuestions.length > 0 ? rrbStats.verifiedQuestions : (manifest?.stats?.verifiedQuestions || 0);
  const displayImportant = rrbQuestions.length > 0 ? rrbStats.importantQuestions : (manifest?.stats?.importantQuestions || 0);
  const displayShifts = rrbQuestions.length > 0 ? rrbStats.totalShifts : (manifest?.stats?.totalShifts || shifts.length);

  return (
    <div className="space-y-6">
      {/* Top Studio Header & 7 Sub-Tab Navigation */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3EAF2] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#12345A] text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5 text-[#2468B4]" />
              <span>Official CBT Examination Studio · Conceptual Taxonomy &amp; Audit</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A]">
              Question Bank, Classification &amp; Exam Hierarchy Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {displayTotal.toLocaleString()} unique bank questions ({displayVerified.toLocaleString()} Verified · {displayImportant.toLocaleString()} Review) across {displayShifts} CBT shifts &amp; {Object.keys(SUBJECT_TOPIC_TREE).length} canonical subjects.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F6F8FC] p-1.5 rounded-2xl border border-[#E3EAF2] overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Health', icon: Activity },
            { id: 'questionBank', label: `Question Bank (${displayTotal.toLocaleString()})`, icon: Award },
            { id: 'reviewQueue', label: `Review Queue (${auditBreakdown.pendingReviewCount.toLocaleString()})`, icon: Sparkles },
            { id: 'shiftsConfig', label: `PYP Papers (${mergedShifts.length})`, icon: Columns3 },
            { id: 'quality', label: `Quality & Duplicates (${auditBreakdown.qualityIssueCount.toLocaleString()})`, icon: AlertTriangle },
            { id: 'hierarchy', label: `Exam Hierarchy (${EXAM_HIERARCHY.length})`, icon: Layers },
            { id: 'bulkJson', label: 'Import / Export', icon: Download }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  active ? 'bg-[#12345A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: OVERVIEW & BANK HEALTH */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1E4E8C] text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-wider text-[#F2BE4F] uppercase">
                  Unified Bank Health · Manifest Fast-Path + Live Audit
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#F2BE4F]" />
                  <span>{displayTotal.toLocaleString()} Total Questions</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                  APPSC: {(rrbQuestions.length > 0 ? rrbStats.appscGroup2 : manifest?.stats?.appscGroup2 || 0).toLocaleString()} · Group D: {(rrbQuestions.length > 0 ? rrbStats.groupD2025 : manifest?.stats?.groupD2025 || 0).toLocaleString()} · UG: {(rrbQuestions.length > 0 ? rrbStats.underGraduate : manifest?.stats?.underGraduate || 0).toLocaleString()} · Grad: {(rrbQuestions.length > 0 ? rrbStats.graduate : manifest?.stats?.graduate || 0).toLocaleString()} · SSC CGL: {(rrbQuestions.length > 0 ? rrbStats.sscCgl : manifest?.stats?.sscCgl || 0).toLocaleString()}.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleTriggerReExtract}
                  disabled={isExtracting}
                  className="px-4 py-2 rounded-full bg-[#F2BE4F] hover:bg-[#e0ac39] text-[#0B1F3A] font-black text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isExtracting ? 'animate-spin' : ''}`} />
                  <span>{isExtracting ? 'Reloading...' : 'Refresh Bank'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportJson()}
                  disabled={rrbQuestions.length === 0}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition border border-white/20 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  type="button"
                  onClick={handleSeedAppscPrelims2024ToFirestore}
                  disabled={isSeeding || rrbLoading}
                  className="px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload APPSC 2024</span>
                </button>
                <button
                  type="button"
                  onClick={handleSeedGroupDToFirestore}
                  disabled={isSeeding || rrbLoading || rrbStats.groupD2025 === 0}
                  className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Group D</span>
                </button>
                <button
                  type="button"
                  onClick={handleSeedToFirestore}
                  disabled={isSeeding || rrbLoading || rrbQuestions.length === 0}
                  className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isSeeding ? 'Uploading...' : 'Store All on Server'}</span>
                </button>
              </div>
            </div>

            {(isSeeding || seedLog) && (
              <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-200 gap-2">
                  <span>{seedLog}</span>
                  {isSeeding && <span>{seedProgress}%</span>}
                </div>
                {isSeeding && (
                  <progress value={seedProgress} max={100} className="w-full h-2 rounded-full overflow-hidden accent-emerald-400" />
                )}
              </div>
            )}

            {/* Confidence Tiers & Audit Drill-Down */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSubTab('questionBank')}
                className="text-left bg-white/10 hover:bg-white/15 transition rounded-2xl p-3 border border-white/10 cursor-pointer"
              >
                <div className="text-xl font-black text-emerald-300">
                  {(auditBreakdown.tiers.HIGH || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-200 font-semibold">High Confidence (95%+)</div>
              </button>
              <button
                type="button"
                onClick={() => { setReviewTierFilter('REVIEW'); setSubTab('reviewQueue'); }}
                className="text-left bg-white/10 hover:bg-amber-500/20 transition rounded-2xl p-3 border border-amber-400/30 cursor-pointer"
              >
                <div className="text-xl font-black text-amber-300">
                  {(auditBreakdown.tiers.REVIEW || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-amber-100 font-semibold">Suggested Review (80-94%)</div>
              </button>
              <button
                type="button"
                onClick={() => { setReviewTierFilter('MANUAL_REVIEW'); setSubTab('reviewQueue'); }}
                className="text-left bg-white/10 hover:bg-rose-500/25 transition rounded-2xl p-3 border border-rose-400/40 cursor-pointer"
              >
                <div className="text-xl font-black text-rose-300">
                  {(auditBreakdown.tiers.MANUAL_REVIEW || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-rose-100 font-semibold">Manual Review (&lt;80%)</div>
              </button>
              <button
                type="button"
                onClick={() => { setQualityFlagFilter('EMPTY_QUESTION_TEXT'); setSubTab('quality'); }}
                className="text-left bg-white/10 hover:bg-white/15 transition rounded-2xl p-3 border border-white/10 cursor-pointer"
              >
                <div className="text-xl font-black text-orange-300">
                  {(auditBreakdown.flags.EMPTY_QUESTION_TEXT || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-200 font-semibold">Empty / Diagram Stems</div>
              </button>
              <button
                type="button"
                onClick={() => { setQualityFlagFilter('MISSING_OPTIONS'); setSubTab('quality'); }}
                className="text-left bg-white/10 hover:bg-white/15 transition rounded-2xl p-3 border border-white/10 cursor-pointer"
              >
                <div className="text-xl font-black text-sky-300">
                  {(auditBreakdown.flags.MISSING_OPTIONS || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-200 font-semibold">Missing Options</div>
              </button>
              <button
                type="button"
                onClick={() => setSubTab('shiftsConfig')}
                className="text-left bg-white/10 hover:bg-white/15 transition rounded-2xl p-3 border border-white/10 cursor-pointer"
              >
                <div className="text-xl font-black text-violet-300">{displayShifts}</div>
                <div className="text-[11px] text-slate-200 font-semibold">CBT Shift Papers</div>
              </button>
            </div>

            {/* Paper Inventory Breakdown */}
            {paperInventory && (
              <div className="bg-black/20 rounded-2xl p-3.5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F2BE4F]">
                    Paper Inventory Audit ({paperInventory.rawPaperTotal?.toLocaleString()} raw → {paperInventory.uniqueStaticTotal?.toLocaleString()} unique static Qs)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowInventoryDetails((v) => !v)}
                    className="text-slate-300 hover:text-white font-semibold cursor-pointer"
                  >
                    {showInventoryDetails ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showInventoryDetails && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-[11px]">
                    {(paperInventory.fileBreakdown || []).map((f) => (
                      <div key={f.fileName} className="px-2.5 py-2 rounded-xl border bg-white/5 border-white/10 text-slate-200">
                        <div className="font-bold truncate">{f.fileName.replace('Full.json', '')}</div>
                        <div className="text-[10px] text-slate-300 mt-0.5">
                          {f.uniqueCount.toLocaleString()} unique / {f.rawCount.toLocaleString()} raw ({f.shiftsCount} shifts)
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Subject Matrix */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-200 font-bold">
                <span>Canonical Subject Matrix (Click any subject to inspect in Question Bank)</span>
                <button
                  type="button"
                  onClick={() => setShowTopicGrid((v) => !v)}
                  className="text-[#F2BE4F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{showTopicGrid ? 'Hide Topics' : `Show Topic Counts (${Object.keys(rrbStats.byTopic).length})`}</span>
                  {showTopicGrid ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {CANONICAL_SUBJECTS.map((sub) => {
                  const count = rrbQuestions.length > 0
                    ? (rrbStats.bySubject[sub.name] || rrbStats.subjectCounts[sub.id] || 0)
                    : (manifest?.stats?.subjectCounts?.[sub.id] || 0);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        setRrbSubjectFilter(sub.name);
                        setRrbTopicFilter('All');
                        setRrbPage(1);
                        setSubTab('questionBank');
                      }}
                      className="text-left p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer"
                    >
                      <div className="text-[11px] font-bold text-slate-200 truncate">{sub.shortName}</div>
                      <div className="text-xl font-black text-white mt-0.5">{count.toLocaleString()}</div>
                    </button>
                  );
                })}
              </div>

              {showTopicGrid && (
                <div className="bg-black/25 rounded-2xl p-4 border border-white/10 flex flex-wrap gap-1.5">
                  {Object.entries(rrbStats.byTopic)
                    .sort((a, b) => b[1] - a[1])
                    .map(([topicName, count]) => (
                      <button
                        key={topicName}
                        type="button"
                        onClick={() => {
                          setRrbTopicFilter(topicName);
                          setRrbPage(1);
                          setSubTab('questionBank');
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-white hover:bg-[#F2BE4F] hover:text-[#0B1F3A] transition cursor-pointer"
                      >
                        {topicName} ({count})
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: QUESTION BANK & BULK EDITOR */}
      {subTab === 'questionBank' && (
        <div className="space-y-4">
          {/* Filters Toolbar */}
          <div className="bg-white rounded-3xl p-5 border border-[#E3EAF2] shadow-xs space-y-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => { setRrbSubjectFilter('All'); setRrbTopicFilter('All'); setRrbPage(1); }}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap cursor-pointer ${
                  rrbSubjectFilter === 'All' ? 'bg-[#12345A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({rrbStats.total.toLocaleString()})
              </button>
              {CANONICAL_SUBJECTS.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => { setRrbSubjectFilter(sub.name); setRrbTopicFilter('All'); setRrbPage(1); }}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap cursor-pointer ${
                    rrbSubjectFilter === sub.name ? 'bg-[#12345A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sub.shortName} ({(rrbStats.bySubject[sub.name] || 0).toLocaleString()})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <select
                value={rrbTopicFilter}
                onChange={(e) => { setRrbTopicFilter(e.target.value); setRrbPage(1); }}
                className="px-3 py-2 rounded-xl bg-[#EAF3FF] border border-[#2468B4]/30 font-bold text-[#12345A]"
              >
                <option value="All">All Canonical Topics</option>
                {availableTopicsForFilter.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              <select
                value={rrbExamFilter}
                onChange={(e) => { setRrbExamFilter(e.target.value); setRrbPage(1); }}
                className="px-3 py-2 rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] font-semibold text-slate-700"
              >
                <option value="All">All Source Exams</option>
                <option value="APPSC Group II">APPSC Group-2</option>
                <option value="Group D 2025">RRB Group D 2025-26</option>
                <option value="Graduate 2026">RRB NTPC Grad 2025-26</option>
                <option value="Graduate 2024">RRB NTPC Grad 2024</option>
                <option value="Under Graduate">RRB NTPC UG 2024-25</option>
                <option value="SSC CGL">SSC CGL Tier-I</option>
              </select>

              <select
                value={rrbEligibleFilter}
                onChange={(e) => { setRrbEligibleFilter(e.target.value); setRrbPage(1); }}
                className="px-3 py-2 rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] font-semibold text-slate-700"
              >
                <option value="All">All Exam Eligibilities</option>
                {ELIGIBLE_EXAM_OPTIONS.map((ex) => (
                  <option key={ex.id} value={ex.id}>Eligible: {ex.label}</option>
                ))}
              </select>

              <select
                value={rrbTierFilter}
                onChange={(e) => { setRrbTierFilter(e.target.value); setRrbPage(1); }}
                className="px-3 py-2 rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] font-semibold text-slate-700"
              >
                <option value="All">All Confidence Tiers</option>
                <option value="HIGH">HIGH (95–100%)</option>
                <option value="REVIEW">REVIEW (80–94%)</option>
                <option value="MANUAL_REVIEW">MANUAL REVIEW (&lt;80%)</option>
              </select>

              <select
                value={rrbQualityFilter}
                onChange={(e) => { setRrbQualityFilter(e.target.value); setRrbPage(1); }}
                className="px-3 py-2 rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] font-semibold text-slate-700"
              >
                <option value="All">All Quality Flags</option>
                {QUALITY_FLAG_OPTIONS.filter((f) => f.id !== 'ALL').map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>

              <select
                value={rrbStatusFilter}
                onChange={(e) => { setRrbStatusFilter(e.target.value); setRrbPage(1); }}
                className="px-3 py-2 rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] font-semibold text-slate-700"
              >
                <option value="All">All Statuses ({rrbStats.total.toLocaleString()})</option>
                <option value="Published">Published / Verified ({rrbStats.verifiedQuestions.toLocaleString()})</option>
                <option value="Needs Review">Needs Review ({rrbStats.importantQuestions.toLocaleString()})</option>
              </select>

              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(parseInt(e.target.value, 10) || 25); setRrbPage(1); }}
                className="px-3 py-2 rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] font-semibold text-slate-700"
              >
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={rrbSearch}
                  onChange={(e) => { setRrbSearch(e.target.value); setRrbPage(1); }}
                  placeholder="Search stem, topic, or ID..."
                  className="w-full pl-8 pr-3 py-2 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:outline-hidden focus:border-[#2468B4] focus:bg-white"
                />
              </div>
            </div>

            {/* Bulk Reassign Bar */}
            <div className="p-3.5 rounded-2xl bg-[#F6F8FC] border border-[#E3EAF2] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleSelectAllOnPage}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-[#12345A] flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Select Page ({paginatedQuestions.length})</span>
                  </button>
                  {selectedIds.size > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedIds(new Set())}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold cursor-pointer"
                    >
                      Clear ({selectedIds.size})
                    </button>
                  )}
                  <span className="font-bold text-[#12345A]">
                    {selectedIds.size} selected for Bulk Reassign
                  </span>
                </div>

                {rrbStatusFilter === 'Needs Review' && (
                  <button
                    type="button"
                    onClick={handleQuickVerifyAllFiltered}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fast Verify Filtered ({filteredRrbQuestions.length})</span>
                  </button>
                )}
              </div>

              {selectedIds.size > 0 && (
                <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs items-end">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Reassign Subject</label>
                    <select
                      value={bulkSubjectId}
                      onChange={(e) => setBulkSubjectId(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white border border-slate-300 font-semibold"
                    >
                      {CANONICAL_SUBJECTS.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Canonical Topic</label>
                    <select
                      value={bulkTopicId}
                      onChange={(e) => setBulkTopicId(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white border border-slate-300 font-semibold"
                    >
                      {(SUBJECT_TOPIC_TREE[bulkSubjectId] || []).map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Subtopic (Optional)</label>
                    <input
                      type="text"
                      value={bulkSubtopic}
                      onChange={(e) => setBulkSubtopic(e.target.value)}
                      placeholder="Specific subtopic"
                      className="w-full p-2 rounded-xl bg-white border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Status</label>
                    <select
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white border border-slate-300 font-semibold"
                    >
                      <option value="NO_CHANGE">Keep Existing Status</option>
                      <option value="Published">Published (Verified)</option>
                      <option value="Needs Review">Needs Review</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    disabled={bulkSaving}
                    onClick={handleBulkReassign}
                    className="px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#1E4E8C] text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    {bulkSaving ? 'Applying...' : `Apply to ${selectedIds.size} Selected`}
                  </button>

                  <div className="sm:col-span-2 lg:col-span-5 flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-600 mr-1">Set Exam Eligibility (optional):</span>
                    {ELIGIBLE_EXAM_OPTIONS.map((ex) => {
                      const active = bulkEligibleExams.includes(ex.id);
                      return (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() =>
                            setBulkEligibleExams((prev) =>
                              active ? prev.filter((id) => id !== ex.id) : [...prev, ex.id]
                            )
                          }
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold cursor-pointer border ${
                            active
                              ? 'bg-[#12345A] text-white border-[#12345A]'
                              : 'bg-white text-slate-600 border-slate-300'
                          }`}
                        >
                          {ex.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!rrbLoading && filteredRrbQuestions.length > 0 && renderPagination('top')}

          <div id="admin-questions-list-top" className="space-y-3">
            {rrbLoading ? (
              <div className="text-center py-16 space-y-2">
                <Loader2 className="w-8 h-8 text-[#2468B4] animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">Loading full question bank...</p>
              </div>
            ) : filteredRrbQuestions.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E3EAF2] text-slate-500 text-sm space-y-2">
                <p>No questions matched your filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setRrbSearch('');
                    setRrbSubjectFilter('All');
                    setRrbTopicFilter('All');
                    setRrbExamFilter('All');
                    setRrbEligibleFilter('All');
                    setRrbTierFilter('All');
                    setRrbQualityFilter('All');
                    setRrbStatusFilter('All');
                    setRrbShiftFilter('All');
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#12345A] text-white text-xs font-bold cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              paginatedQuestions.map((q) => {
                const letters = ['A', 'B', 'C', 'D'];
                const correctLetter = letters[q.correctAnswer] || q.correctLetter || 'A';
                const isUnv = isImportantOrReviewQuestion(q);
                const isSelected = selectedIds.has(q.id);
                const tier = q.classificationTier || 'HIGH';
                const qFlags = Array.isArray(q.qualityFlags) ? q.qualityFlags : [];

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-2xl p-4 sm:p-5 border transition shadow-xs space-y-3 ${
                      isSelected
                        ? 'border-[#2468B4] ring-2 ring-[#2468B4]/20'
                        : isUnv
                        ? 'border-amber-300'
                        : 'border-[#E3EAF2] hover:border-[#2468B4]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <button
                          type="button"
                          onClick={() => toggleSelectQuestion(q.id)}
                          className="p-1 text-slate-500 hover:text-[#12345A] cursor-pointer"
                          title="Select for bulk reassign"
                        >
                          {isSelected ? <CheckSquare className="w-4 h-4 text-[#2468B4]" /> : <Square className="w-4 h-4" />}
                        </button>
                        <span className="px-2 py-0.5 rounded-md bg-[#12345A] text-white font-black text-[11px]">
                          Q{q.questionNumber || '-'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#EAF3FF] text-[#12345A] font-bold text-[11px]">
                          {q.examName || 'Official Bank'} {q.shiftNumber ? `· S${q.shiftNumber}` : ''}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {q.subject}
                        </span>
                        {q.topic && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 font-semibold text-[11px]">
                            {q.topic}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${getTierBadgeClass(tier)}`}>
                          {tier} ({q.classificationConfidence ?? 90}%)
                        </span>
                        {qFlags.map((flag) => (
                          <span key={flag} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[10px]">
                            {flag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isUnv && (
                          <button
                            type="button"
                            onClick={() => handleQuickVerify(q)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verify</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(q)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#EAF3FF] text-slate-600 hover:text-[#12345A] cursor-pointer"
                          title="Edit Question"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(q)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-slate-900 leading-relaxed">
                      {getQuestionText(q) || '(Empty stem — needs extraction repair)'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {['A', 'B', 'C', 'D'].map((letter, optIdx) => {
                        const isCorrect = optIdx === q.correctAnswer || letter === correctLetter;
                        return (
                          <div
                            key={letter}
                            className={`p-2 rounded-xl border flex items-start gap-2 ${
                              isCorrect ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900 font-bold' : 'bg-[#F6F8FC] border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px] font-black ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {letter}
                            </span>
                            <span className="flex-1">{q.options?.en?.[optIdx] || '(Empty)'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {renderPagination('bottom')}
        </div>
      )}

      {/* SUB-TAB 3: CLASSIFICATION REVIEW QUEUE */}
      {subTab === 'reviewQueue' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#E3EAF2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-[#12345A]">Classification Review Queue</h3>
              <p className="text-xs text-slate-500">
                Inspect &lt;80% Manual Review and 80–94% Suggested Review questions. Approve suggested taxonomy, apply custom overrides, or revert via audit history.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {[
                { id: 'MANUAL_REVIEW', label: `Manual Review (<80% · ${auditBreakdown.tiers.MANUAL_REVIEW || 0})` },
                { id: 'REVIEW', label: `Suggested Review (80-94% · ${auditBreakdown.tiers.REVIEW || 0})` },
                { id: 'ALL_PENDING', label: `All Pending (${reviewQueueQuestions.length})` }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { setReviewTierFilter(opt.id); setReviewPage(1); }}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                    reviewTierFilter === opt.id ? 'bg-[#12345A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {paginatedReviewQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E3EAF2] text-sm text-slate-500">
              All items in this review tier are verified!
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedReviewQuestions.map((q) => {
                const sug = q.suggestedClassification || classifyQuestionConceptually(q);
                const hasHistory = Array.isArray(q.classificationHistory) && q.classificationHistory.length > 0;
                return (
                  <div key={q.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#12345A] text-white font-black text-[11px]">{q.id}</span>
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${getTierBadgeClass(q.classificationTier || 'REVIEW')}`}>
                          {q.classificationTier} · {q.classificationConfidence ?? sug.confidence}%
                        </span>
                        <span className="text-slate-500">{q.examName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApproveSuggestion(q)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Suggestion</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(q)}
                          className="px-3 py-1.5 rounded-xl bg-[#EAF3FF] hover:bg-[#DCEBFF] text-[#12345A] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Custom Override</span>
                        </button>
                        {hasHistory && (
                          <button
                            type="button"
                            onClick={() => handleRevertClassification(q)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Revert</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm font-bold text-slate-900">
                      {getQuestionText(q) || '(Empty stem — inspect source PDF)'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F6F8FC] p-3 rounded-xl border border-[#E3EAF2]">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Current Classification</span>
                        <span className="font-bold text-slate-800">{q.subject} → {q.topic || q.subtopic}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#2468B4] block">Conceptual Suggestion ({sug.confidence}%)</span>
                        <span className="font-bold text-[#12345A]">{sug.subjectName} → {sug.topicName} ({sug.subtopic})</span>
                        {sug.reasoning && <p className="text-[11px] text-slate-500 mt-0.5">{sug.reasoning}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {reviewTotalPages > 1 && (
                <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#E3EAF2] text-xs">
                  <span className="text-slate-600">Page {reviewPage} of {reviewTotalPages} ({reviewQueueQuestions.length} items)</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      disabled={reviewPage <= 1}
                      onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold disabled:opacity-40 cursor-pointer"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      disabled={reviewPage >= reviewTotalPages}
                      onClick={() => setReviewPage((p) => Math.min(reviewTotalPages, p + 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold disabled:opacity-40 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: PYP PAPERS & SHIFTS MANAGER */}
      {subTab === 'shiftsConfig' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#E3EAF2] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-[#12345A]">
                PYP Papers &amp; Shift Manager ({filteredShifts.length} of {mergedShifts.length})
              </h3>
              <p className="text-xs text-slate-500">
                Inspect full ordered 1..N PYP shifts, subject distributions, incomplete slots, marking rules, and bulk shift reclassification.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={shiftExamFilter}
                onChange={(e) => setShiftExamFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] font-semibold"
              >
                <option value="All">All Exams</option>
                <option value="NTPC UG">RRB NTPC UG</option>
                <option value="NTPC Grad">RRB NTPC Graduate</option>
                <option value="Group D">RRB Group D</option>
                <option value="SSC CGL">SSC CGL</option>
                <option value="APPSC">APPSC Group II</option>
              </select>
              <input
                type="text"
                value={shiftSearch}
                onChange={(e) => setShiftSearch(e.target.value)}
                placeholder="Search shift title or date..."
                className="px-3 py-2 rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] w-48"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShifts.map((shift) => {
              const breakdown = shift.subjectBreakdown || {};
              return (
                <div
                  key={shift.id}
                  className="bg-white rounded-2xl border border-[#E3EAF2] p-5 flex flex-col justify-between gap-3 shadow-2xs hover:border-[#2468B4] transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-[#12345A] text-white">
                        {shift.code || `Shift ${shift.shiftNumber}`}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {shift.incompleteCount > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {shift.incompleteCount} incomplete
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          shift.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {shift.status}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-black text-[#12345A] text-sm">{shift.title}</h4>

                    <div className="space-y-1 text-xs text-slate-600 bg-[#F6F8FC] p-2.5 rounded-xl border border-slate-100">
                      <div className="flex justify-between"><span>Date:</span><strong className="text-slate-800">{shift.examDate}</strong></div>
                      <div className="flex justify-between"><span>Questions:</span><strong className="text-slate-800">{shift.questionCount || 100}</strong></div>
                      <div className="flex justify-between"><span>Duration / Marks:</span><strong className="text-slate-800">{shift.durationMinutes || 90}m · {shift.totalMarks || 100}M</strong></div>
                    </div>

                    {Object.keys(breakdown).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(breakdown).map(([sid, cnt]) => (
                          <span key={sid} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {sid.replace('quantitative-aptitude', 'Quant').replace('general-knowledge', 'GK').replace('general-science', 'Sci').replace('english-language', 'Eng').replace('computer-science', 'CS')}: {cnt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewShift(shift)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#12345A] text-white font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview 1..N</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditShift(shift)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#EAF3FF] text-[#12345A] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBulkShiftTarget(shift);
                        setBulkShiftSubjectId('NO_CHANGE');
                        setBulkShiftEligibleExam('NO_CHANGE');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold cursor-pointer"
                    >
                      Bulk Map
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newStatus = shift.status === 'Published' ? 'Draft' : 'Published';
                        saveShiftOverride(shift.id, { status: newStatus });
                        setShifts((prev) => prev.map((s) => (s.id === shift.id ? { ...s, status: newStatus } : s)));
                        if (onNotify) onNotify(`${shift.title} set to ${newStatus}`, 'info');
                      }}
                      className="font-bold text-slate-600 hover:text-[#12345A] cursor-pointer"
                    >
                      {shift.status === 'Published' ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: DUPLICATES & QUALITY VALIDATOR (NON-DESTRUCTIVE) */}
      {subTab === 'quality' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#E3EAF2] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-[#12345A]">Duplicates &amp; Quality Validator</h3>
              <p className="text-xs text-slate-500">
                Non-destructive quality inspection ({qualityQuestions.length.toLocaleString()} flagged items). Questions are never auto-deleted.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={qualityFlagFilter}
                onChange={(e) => { setQualityFlagFilter(e.target.value); setQualityPage(1); }}
                className="px-3 py-2 rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] font-semibold"
              >
                {QUALITY_FLAG_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label} {f.id !== 'ALL' ? `(${auditBreakdown.flags[f.id] || 0})` : ''}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setQualityGroupDuplicates((v) => !v)}
                className={`px-3 py-2 rounded-xl font-bold border cursor-pointer ${
                  qualityGroupDuplicates ? 'bg-[#12345A] text-white border-[#12345A]' : 'bg-[#F6F8FC] text-slate-700 border-[#E3EAF2]'
                }`}
              >
                {qualityGroupDuplicates ? 'Grouped by Duplicate ID ✓' : 'Group by Duplicate ID'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {paginatedQualityQuestions.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E3EAF2] text-sm text-slate-500">
                No quality issues found for this filter.
              </div>
            ) : (
              paginatedQualityQuestions.map((q) => (
                <div key={q.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-200 shadow-xs space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#12345A] text-white font-black text-[11px]">{q.id}</span>
                      {q.duplicateGroupId && (
                        <span className="px-2 py-0.5 rounded bg-violet-50 text-violet-800 border border-violet-200 font-mono text-[10px]">
                          Group: {q.duplicateGroupId}
                        </span>
                      )}
                      {(q.qualityFlags || []).map((flag) => (
                        <span key={flag} className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[10px]">
                          {flag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMarkDuplicateOrVerify(q, 'duplicate')}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold cursor-pointer"
                      >
                        Flag Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkDuplicateOrVerify(q, 'verify')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                      >
                        Mark Verified
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(q)}
                        className="px-2.5 py-1 rounded-lg bg-[#EAF3FF] text-[#12345A] font-bold cursor-pointer"
                      >
                        Repair / Edit
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {getQuestionText(q) || '(Empty stem — needs diagram/fraction repair)'}
                  </p>
                </div>
              ))
            )}

            {qualityTotalPages > 1 && (
              <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#E3EAF2] text-xs">
                <span className="text-slate-600">Page {qualityPage} of {qualityTotalPages} ({qualityQuestions.length} items)</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    disabled={qualityPage <= 1}
                    onClick={() => setQualityPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold disabled:opacity-40 cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={qualityPage >= qualityTotalPages}
                    onClick={() => setQualityPage((p) => Math.min(qualityTotalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold disabled:opacity-40 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: EXAM HIERARCHY & PATTERNS CONFIGURATOR */}
      {subTab === 'hierarchy' && (
        <AdminHierarchyConfigurator onNotify={onNotify} />
      )}

      {/* SUB-TAB 7: VALIDATED IMPORT / EXPORT */}
      {subTab === 'bulkJson' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAF2] shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#12345A]">Validated JSON Import &amp; Export</h3>
            <p className="text-xs text-slate-500">
              Export the full bank or active filtered slice, or validate + conceptually classify JSON before importing. Items below 80% confidence are automatically routed to the Review Queue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F6F8FC] p-5 rounded-2xl border border-[#E3EAF2] space-y-3">
              <h4 className="font-black text-sm text-[#12345A] flex items-center gap-2">
                <Download className="w-4 h-4 text-[#2468B4]" />
                <span>Export Question Bank</span>
              </h4>
              <p className="text-xs text-slate-600">
                Download all {rrbQuestions.length.toLocaleString()} questions or the {filteredRrbQuestions.length.toLocaleString()} questions currently matched in Question Bank filters.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleExportJson(rrbQuestions, 'Full-Bank')}
                  className="px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#1E4E8C] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export All ({rrbQuestions.length.toLocaleString()})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportJson(filteredRrbQuestions, 'Filtered')}
                  className="px-4 py-2 rounded-xl bg-white border border-[#12345A] text-[#12345A] text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Filtered ({filteredRrbQuestions.length.toLocaleString()})</span>
                </button>
              </div>
            </div>

            <div className="bg-[#F6F8FC] p-5 rounded-2xl border border-[#E3EAF2] space-y-3">
              <h4 className="font-black text-sm text-[#12345A] flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#2468B4]" />
                <span>Validated JSON Import</span>
              </h4>
              <textarea
                value={bulkJson}
                onChange={(e) => { setBulkJson(e.target.value); setBulkPreview(null); }}
                placeholder="Paste JSON questions array here..."
                rows={4}
                className="w-full p-3 text-xs bg-white border border-[#E3EAF2] rounded-xl font-mono focus:outline-hidden focus:border-[#2468B4]"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleValidateImportPreview}
                  disabled={!bulkJson.trim()}
                  className="px-4 py-2 rounded-xl bg-[#2468B4] hover:bg-[#1E4E8C] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  1. Validate &amp; Classify Preview
                </button>
                {bulkPreview && (
                  <button
                    type="button"
                    onClick={handleConfirmImportPreview}
                    disabled={bulkBusy}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {bulkBusy ? 'Importing...' : `2. Confirm Import (${bulkPreview.validCount})`}
                  </button>
                )}
              </div>

              {bulkPreview && (
                <div className="bg-white p-3.5 rounded-xl border border-[#E3EAF2] space-y-2 text-xs">
                  <div className="font-bold text-[#12345A]">
                    Preview: {bulkPreview.validCount} valid · {bulkPreview.duplicateIds} matching existing IDs · {bulkPreview.lowConfCount} flagged &lt;80% for Review Queue
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(bulkPreview.subjectBreakdown).map(([s, cnt]) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-[#EAF3FF] text-[#12345A] font-semibold text-[11px]">
                        {s}: {cnt}
                      </span>
                    ))}
                  </div>
                  {bulkPreview.warnings.length > 0 && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      {bulkPreview.warnings.slice(0, 4).join(' · ')}
                    </div>
                  )}
                </div>
              )}

              {bulkSummary && (
                <div className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  Imported {bulkSummary.total} items ({bulkSummary.added} added, {bulkSummary.updated} updated).
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUESTION EDIT MODAL */}
      {editingQuestion && editFormData && (
        <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8 border border-[#E3EAF2]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Edit Question {editFormData.questionNumber || editFormData.id}
                </span>
                <h3 className="text-lg font-black text-[#12345A]">Canonical Question Editor</h3>
              </div>
              <button
                type="button"
                onClick={() => { setEditingQuestion(null); setEditFormData(null); }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Canonical Subject</label>
                  <select
                    value={editFormData.subjectId}
                    onChange={(e) => {
                      const nextSub = e.target.value;
                      const firstTopic = SUBJECT_TOPIC_TREE[nextSub]?.[0]?.id || 'static-gk';
                      setEditFormData({
                        ...editFormData,
                        subjectId: nextSub,
                        subject: CANONICAL_SUBJECTS.find((s) => s.id === nextSub)?.name || nextSub,
                        topicId: firstTopic
                      });
                    }}
                    className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl font-semibold"
                  >
                    {CANONICAL_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Canonical Topic</label>
                  <select
                    value={editFormData.topicId}
                    onChange={(e) => setEditFormData({ ...editFormData, topicId: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl font-semibold"
                  >
                    {(SUBJECT_TOPIC_TREE[editFormData.subjectId] || []).map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subtopic</label>
                  <input
                    type="text"
                    value={editFormData.subtopic}
                    onChange={(e) => setEditFormData({ ...editFormData, subtopic: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl font-semibold"
                  >
                    <option value="Published">Published</option>
                    <option value="Needs Review">Needs Review</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-700 mr-1">Eligible Exams:</span>
                {ELIGIBLE_EXAM_OPTIONS.map((ex) => {
                  const active = (editFormData.eligibleExams || []).includes(ex.id);
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() =>
                        setEditFormData((prev) => ({
                          ...prev,
                          eligibleExams: active
                            ? prev.eligibleExams.filter((id) => id !== ex.id)
                            : [...prev.eligibleExams, ex.id]
                        }))
                      }
                      className={`px-2.5 py-1 rounded-lg font-bold border cursor-pointer ${
                        active ? 'bg-[#12345A] text-white border-[#12345A]' : 'bg-[#F6F8FC] text-slate-600 border-slate-200'
                      }`}
                    >
                      {ex.label}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Text (English) *</label>
                <textarea
                  required
                  rows={3}
                  value={editFormData.questionEn}
                  onChange={(e) => setEditFormData({ ...editFormData, questionEn: e.target.value })}
                  className="w-full p-3 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Text (Telugu - Optional)</label>
                <textarea
                  rows={2}
                  value={editFormData.questionTe}
                  onChange={(e) => setEditFormData({ ...editFormData, questionTe: e.target.value })}
                  className="w-full p-3 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'A', field: 'optionAEn', teField: 'optionATe', idx: 0 },
                  { key: 'B', field: 'optionBEn', teField: 'optionBTe', idx: 1 },
                  { key: 'C', field: 'optionCEn', teField: 'optionCTe', idx: 2 },
                  { key: 'D', field: 'optionDEn', teField: 'optionDTe', idx: 3 }
                ].map(({ key, field, teField, idx }) => (
                  <div
                    key={key}
                    className={`p-3 rounded-2xl border space-y-1.5 ${
                      parseInt(editFormData.correctAnswer, 10) === idx ? 'bg-emerald-50/70 border-emerald-300' : 'bg-[#F6F8FC] border-slate-200'
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={parseInt(editFormData.correctAnswer, 10) === idx}
                        onChange={() => setEditFormData({ ...editFormData, correctAnswer: idx })}
                      />
                      <span>Option {key} (Correct Key)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData[field]}
                      onChange={(e) => setEditFormData({ ...editFormData, [field]: e.target.value })}
                      className="w-full p-2 text-xs bg-white border border-[#E3EAF2] rounded-lg"
                    />
                    <input
                      type="text"
                      value={editFormData[teField]}
                      onChange={(e) => setEditFormData({ ...editFormData, [teField]: e.target.value })}
                      placeholder="Telugu (optional)"
                      className="w-full p-2 text-xs bg-white border border-[#E3EAF2] rounded-lg"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Explanation (English)</label>
                  <textarea
                    rows={2}
                    value={editFormData.explanationEn}
                    onChange={(e) => setEditFormData({ ...editFormData, explanationEn: e.target.value })}
                    className="w-full p-2.5 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Explanation (Telugu - Optional)</label>
                  <textarea
                    rows={2}
                    value={editFormData.explanationTe}
                    onChange={(e) => setEditFormData({ ...editFormData, explanationTe: e.target.value })}
                    className="w-full p-2.5 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setEditingQuestion(null); setEditFormData(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingQuestion}
                  className="px-5 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#1E4E8C] text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingQuestion ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHIFT EDIT MODAL */}
      {editingShift && shiftFormData && (
        <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#E3EAF2]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-[#12345A]">Edit Shift {editingShift.shiftNumber}</h3>
              <button
                type="button"
                onClick={() => { setEditingShift(null); setShiftFormData(null); }}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveShift} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Shift Title</label>
                <input
                  type="text"
                  required
                  value={shiftFormData.title}
                  onChange={(e) => setShiftFormData({ ...shiftFormData, title: e.target.value })}
                  className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="text"
                    required
                    value={shiftFormData.examDate}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, examDate: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift Timing</label>
                  <input
                    type="text"
                    required
                    value={shiftFormData.shiftTiming}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, shiftTiming: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    required
                    value={shiftFormData.durationMinutes}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, durationMinutes: parseInt(e.target.value, 10) })}
                    className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    required
                    value={shiftFormData.totalMarks}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, totalMarks: parseInt(e.target.value, 10) })}
                    className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={shiftFormData.status}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, status: e.target.value })}
                    className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl font-semibold"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setEditingShift(null); setShiftFormData(null); }}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#12345A] text-white font-bold cursor-pointer">
                  Save Shift Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK RECLASSIFY SHIFT MODAL */}
      {bulkShiftTarget && (
        <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E3EAF2] text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-[#12345A]">Bulk Map Shift Questions</h3>
              <button type="button" onClick={() => setBulkShiftTarget(null)} className="p-1 text-slate-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-600 font-semibold">{bulkShiftTarget.title}</p>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Override Subject (Optional)</label>
              <select
                value={bulkShiftSubjectId}
                onChange={(e) => setBulkShiftSubjectId(e.target.value)}
                className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl font-semibold"
              >
                <option value="NO_CHANGE">Keep Conceptual Subjects</option>
                {CANONICAL_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Add Exam Eligibility Tag (Optional)</label>
              <select
                value={bulkShiftEligibleExam}
                onChange={(e) => setBulkShiftEligibleExam(e.target.value)}
                className="w-full p-2.5 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl font-semibold"
              >
                <option value="NO_CHANGE">No Additional Tag</option>
                {ELIGIBLE_EXAM_OPTIONS.map((ex) => (
                  <option key={ex.id} value={ex.id}>{ex.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBulkShiftTarget(null)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkReclassifyShift}
                className="px-4 py-2 rounded-xl bg-[#12345A] text-white font-bold cursor-pointer"
              >
                Apply to Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDERED 1..N PAPER PREVIEW MODAL */}
      {previewShift && (
        <AdminShiftPaperPreviewModal
          shift={previewShift}
          onClose={() => setPreviewShift(null)}
          onEditQuestion={(q) => {
            setPreviewShift(null);
            handleOpenEdit(q);
          }}
        />
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          title="Delete Question"
          message={`Are you sure you want to delete Question ${deleteTarget.questionNumber || deleteTarget.id}? This action cannot be undone.`}
          confirmLabel="Delete Question"
          onConfirm={confirmDeleteQuestion}
          onCancel={() => setDeleteTarget(null)}
          confirmVariant="danger"
        />
      )}
    </div>
  );
}
