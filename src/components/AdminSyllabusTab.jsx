import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Database,
  Upload,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Loader2,
  Download
} from 'lucide-react';
import ConfirmModal from './ConfirmModal.jsx';
import DocumentFileUploader from './DocumentFileUploader.jsx';
import {
  getExamCategories,
  getExamSyllabi,
  saveExamSyllabus,
  deleteExamSyllabus,
  togglePublishExamSyllabus,
  bumpAnnualSyllabusVersion,
  importSyllabiFromJson,
  seedSyllabusLibraryToFirestore
} from '../services/syllabusService.js';
import {
  SUBJECT_BLUEPRINTS,
  ENGINEERING_BLUEPRINTS,
  examMatchesCategory,
  getExamChapterCount
} from '../data/syllabus/syllabusRegistry.js';
import { buildExamSyllabus } from '../data/syllabus/exams/examBuilder.js';

const ALL_BLUEPRINT_OPTIONS = [
  ...Object.values(SUBJECT_BLUEPRINTS),
  ...Object.values(ENGINEERING_BLUEPRINTS)
];

const SAMPLE_SYLLABUS_JSON = JSON.stringify(
  [
    {
      id: 'sample-central-officer-2026',
      examCode: 'SAMPLE-OFF-2026',
      name: 'Sample Central Officer Examination 2026',
      shortName: 'Sample Officer Exam',
      categoryId: 'other-central',
      scope: 'Central',
      authority: 'Central Recruitment Board',
      introduction: 'Recruitment for Group B Officer posts across central ministries.',
      qualification: 'Bachelor’s Degree in any discipline from a recognized University.',
      selectionProcess: 'CBT Stage-1 → Mains Written → Interview',
      stages: [
        { name: 'Prelims CBT', mode: 'Computer Based Test', qualifyingOnly: true, description: '100 Qs / 100 Marks in 60 mins.' }
      ],
      examPattern: [
        {
          stageName: 'Prelims CBT (100 Qs · 100 Marks · 60 Mins)',
          sections: [
            { subject: 'General Awareness', questions: 25, marks: 25 },
            { subject: 'Reasoning', questions: 25, marks: 25 },
            { subject: 'Quantitative Aptitude', questions: 25, marks: 25 },
            { subject: 'English', questions: 25, marks: 25 }
          ]
        }
      ],
      totalQuestions: '100 Questions',
      totalMarks: '100 Marks',
      duration: '60 Minutes',
      negativeMarking: '0.25 marks per wrong answer',
      languages: ['English', 'Hindi'],
      officialNotificationRef: 'Official Notice 01/2026',
      officialWebsiteUrl: 'https://ssc.gov.in',
      notificationYear: 2026,
      verificationStatus: 'Verified 2026',
      status: 'Published',
      subjects: []
    }
  ],
  null,
  2
);

function createEmptyExam() {
  return buildExamSyllabus({
    id: '',
    examCode: '',
    name: '',
    shortName: '',
    categoryId: 'rrb',
    secondaryCategoryIds: [],
    scope: 'Central',
    state: '',
    popular: false,
    authority: '',
    introduction: '',
    qualification: '',
    ageLimit: '',
    selectionProcess: '',
    stages: [{ name: 'Stage 1 (CBT / Written)', mode: 'Computer Based Test', qualifyingOnly: false, description: '' }],
    examPattern: [
      {
        stageName: 'Written / CBT Exam Pattern',
        sections: [{ subject: 'General Awareness', questions: 25, marks: 25 }]
      }
    ],
    totalQuestions: '',
    totalMarks: '',
    duration: '',
    negativeMarking: '',
    subjects: [],
    practicalTechnicalTopics: [],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: '',
    interviewDetails: '',
    officialNotificationRef: '',
    officialWebsiteUrl: '',
    officialSyllabusPdfUrl: '',
    syllabusPdfLabel: 'Official Syllabus PDF',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026',
    status: 'Published'
  });
}

export default function AdminSyllabusTab({ onNotify }) {
  const [categories, setCategories] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Published' | 'Draft' | 'Provisional'

  // Seed / Sync state
  const [syncBusy, setSyncBusy] = useState(false);
  const [syncProgress, setSyncProgress] = useState(null);

  // Edit/Create modal state
  const [editingExam, setEditingExam] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('basic'); // 'basic' | 'pattern' | 'subjects' | 'pdf'
  const [blueprintToAdd, setBlueprintToAdd] = useState(ALL_BLUEPRINT_OPTIONS[0]?.id || 'general-awareness');
  const [expandedSubjectIdx, setExpandedSubjectIdx] = useState(0);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // PDF quick modal
  const [pdfModalExam, setPdfModalExam] = useState(null);
  const [quickPdfUrl, setQuickPdfUrl] = useState('');
  const [quickPdfLabel, setQuickPdfLabel] = useState('');
  const [pdfSaving, setPdfSaving] = useState(false);

  // JSON import modal
  const [importOpen, setImportOpen] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importBusy, setImportBusy] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  // Annual version modal
  const [annualModalExam, setAnnualModalExam] = useState(null);
  const [annualYear, setAnnualYear] = useState(2027);
  const [annualNotes, setAnnualNotes] = useState('');
  const [annualBusy, setAnnualBusy] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, list] = await Promise.all([getExamCategories(), getExamSyllabi(true)]);
      setCategories(cats);
      setSyllabi(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filteredSyllabi = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return syllabi.filter((exam) => {
      if (!examMatchesCategory(exam, catFilter)) return false;
      if (statusFilter === 'Published' && exam.status === 'Draft') return false;
      if (statusFilter === 'Draft' && exam.status !== 'Draft') return false;
      if (statusFilter === 'Provisional' && !String(exam.verificationStatus || '').toLowerCase().includes('provisional')) return false;
      if (q) {
        const hay = `${exam.name} ${exam.examCode} ${exam.authority} ${exam.shortName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [syllabi, catFilter, statusFilter, searchQuery]);

  const handleSeedFirestore = async () => {
    setSyncBusy(true);
    setSyncProgress({ completed: 0, total: 1 });
    try {
      const res = await seedSyllabusLibraryToFirestore((p) => setSyncProgress(p));
      onNotify?.(
        `Synced ${res.categories} categories, ${res.syllabi} exam syllabi, ${res.subjects} subjects & ${res.topics} topics to Firestore.`
      );
    } catch (err) {
      onNotify?.(`Firestore syllabus sync failed: ${err.message}`, 'error');
    } finally {
      setSyncBusy(false);
      setSyncProgress(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingExam(createEmptyExam());
    setModalTab('basic');
    setExpandedSubjectIdx(0);
    setFormError('');
    setEditModalOpen(true);
  };

  const handleOpenEdit = (exam) => {
    setEditingExam(JSON.parse(JSON.stringify(exam)));
    setModalTab('basic');
    setExpandedSubjectIdx(0);
    setFormError('');
    setEditModalOpen(true);
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();
    if (!editingExam) return;
    setFormError('');
    setSaving(true);
    try {
      const saved = await saveExamSyllabus(editingExam, syllabi);
      await loadData();
      setEditModalOpen(false);
      onNotify?.(
        saved._firestoreSynced === false
          ? `"${saved.shortName}" saved locally (Firestore sync pending: ${saved._syncError || 'offline'}).`
          : `"${saved.shortName}" saved and synced to Firestore.`
      );
    } catch (err) {
      setFormError(err.message || 'Failed to save exam syllabus.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (exam) => {
    try {
      const updated = await togglePublishExamSyllabus(exam);
      await loadData();
      onNotify?.(`"${updated.shortName}" marked as ${updated.status}.`);
    } catch (err) {
      onNotify?.(`Failed to toggle status: ${err.message}`, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExamSyllabus(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
      onNotify?.(`Deleted "${deleteTarget.shortName}" from syllabus library.`);
    } catch (err) {
      onNotify?.(`Delete failed: ${err.message}`, 'error');
    }
  };

  const handleSavePdfQuick = async () => {
    if (!pdfModalExam) return;
    setPdfSaving(true);
    try {
      await saveExamSyllabus(
        {
          ...pdfModalExam,
          officialSyllabusPdfUrl: quickPdfUrl,
          syllabusPdfLabel: quickPdfLabel || 'Official Syllabus PDF'
        },
        syllabi
      );
      setPdfModalExam(null);
      await loadData();
      onNotify?.(`Updated official syllabus PDF for ${pdfModalExam.shortName}.`);
    } catch (err) {
      onNotify?.(err.message, 'error');
    } finally {
      setPdfSaving(false);
    }
  };

  const handleBulkImport = async () => {
    setImportBusy(true);
    setImportSummary(null);
    try {
      const summary = await importSyllabiFromJson(importJson);
      setImportSummary(summary);
      if (summary.ok > 0) {
        await loadData();
        onNotify?.(`Imported ${summary.ok} exam syllabi (${summary.skipped} duplicates skipped).`);
      }
    } finally {
      setImportBusy(false);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_SYLLABUS_JSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'examquesthub-syllabus-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAnnualBump = async (e) => {
    e.preventDefault();
    if (!annualModalExam) return;
    setAnnualBusy(true);
    try {
      await bumpAnnualSyllabusVersion(annualModalExam, annualYear, annualNotes);
      setAnnualModalExam(null);
      await loadData();
      onNotify?.(`Updated "${annualModalExam.shortName}" to ${annualYear} cycle (history preserved).`);
    } catch (err) {
      onNotify?.(err.message, 'error');
    } finally {
      setAnnualBusy(false);
    }
  };

  // Nested Subject / Chapter editor mutations inside editingExam
  const addBlueprintSubjectToExam = () => {
    if (!editingExam) return;
    const bp = ALL_BLUEPRINT_OPTIONS.find((b) => b.id === blueprintToAdd);
    if (!bp) return;
    const exists = (editingExam.subjects || []).some((s) => s.id === bp.id);
    const nextSubject = {
      id: exists ? `${bp.id}-${Date.now()}` : bp.id,
      name: bp.name,
      shortName: bp.shortName,
      code: bp.code,
      stageTag: 'All Stages',
      description: bp.description,
      chapters: JSON.parse(JSON.stringify(bp.chapters || []))
    };
    const nextSubjects = [...(editingExam.subjects || []), nextSubject];
    setEditingExam({ ...editingExam, subjects: nextSubjects });
    setExpandedSubjectIdx(nextSubjects.length - 1);
  };

  const addCustomSubjectToExam = () => {
    if (!editingExam) return;
    const nextSubjects = [
      ...(editingExam.subjects || []),
      {
        id: `subj-${Date.now()}`,
        name: 'New Custom Subject',
        shortName: 'Custom Subject',
        stageTag: 'All Stages',
        chapters: [
          {
            id: `ch-${Date.now()}`,
            title: 'Chapter 1',
            topicType: 'official',
            subtopics: ['Topic 1']
          }
        ]
      }
    ];
    setEditingExam({ ...editingExam, subjects: nextSubjects });
    setExpandedSubjectIdx(nextSubjects.length - 1);
  };

  const removeSubjectAt = (sIdx) => {
    const nextSubjects = (editingExam.subjects || []).filter((_, i) => i !== sIdx);
    setEditingExam({ ...editingExam, subjects: nextSubjects });
  };

  const addChapterToSubject = (sIdx) => {
    const nextSubjects = [...(editingExam.subjects || [])];
    const target = { ...nextSubjects[sIdx] };
    target.chapters = [
      ...(target.chapters || []),
      {
        id: `ch-${Date.now()}`,
        title: `Chapter ${(target.chapters || []).length + 1}`,
        topicType: 'official',
        subtopics: ['Key Concept 1']
      }
    ];
    nextSubjects[sIdx] = target;
    setEditingExam({ ...editingExam, subjects: nextSubjects });
  };

  const updateChapterField = (sIdx, cIdx, patch) => {
    const nextSubjects = [...(editingExam.subjects || [])];
    const chapters = [...(nextSubjects[sIdx].chapters || [])];
    chapters[cIdx] = { ...chapters[cIdx], ...patch };
    nextSubjects[sIdx] = { ...nextSubjects[sIdx], chapters };
    setEditingExam({ ...editingExam, subjects: nextSubjects });
  };

  const removeChapterAt = (sIdx, cIdx) => {
    const nextSubjects = [...(editingExam.subjects || [])];
    nextSubjects[sIdx] = {
      ...nextSubjects[sIdx],
      chapters: (nextSubjects[sIdx].chapters || []).filter((_, i) => i !== cIdx)
    };
    setEditingExam({ ...editingExam, subjects: nextSubjects });
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E3EAF2] space-y-5">
      {/* Header & Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading font-bold text-base sm:text-lg text-[#182B45]">
            Manage Government Exams Syllabus Library ({syllabi.length})
          </h2>
          <p className="text-xs text-slate-500">
            Create/edit 20-point exam patterns, chapters, subtopics, official PDFs, JSON bulk imports, and annual syllabus versions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={syncBusy}
            onClick={handleSeedFirestore}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
          >
            {syncBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            <span>
              {syncBusy && syncProgress
                ? `Syncing ${syncProgress.completed}/${syncProgress.total}...`
                : 'Sync Library to Firestore'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setImportJson('');
              setImportSummary(null);
              setImportOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#12345A]/20 text-[#12345A] hover:bg-[#EAF3FF] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Import JSON</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Exam</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[#F6F8FC] border border-[#E3EAF2] rounded-2xl p-3 flex flex-col md:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exams by name, code, or conducting authority..."
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-[#2468B4]"
          />
        </div>

        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#182B45]"
        >
          <option value="all">All 12 Categories ({syllabi.length})</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.shortName || cat.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#182B45]"
        >
          <option value="all">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Provisional">Provisional / Verify Notice</option>
        </select>
      </div>

      {/* Exam Syllabi List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading syllabus catalog...</div>
      ) : filteredSyllabi.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500">
          No exam syllabi matched your filter.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 text-xs">
          {filteredSyllabi.map((exam) => {
            const cat = categoryMap.get(exam.categoryId);
            const chaptersCount = getExamChapterCount(exam);
            const isProvisional = String(exam.verificationStatus || '').toLowerCase().includes('provisional');

            return (
              <div
                key={exam.id}
                className="py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-[11px] font-semibold text-slate-500">
                    <span className="text-[#2468B4] font-bold">{cat?.code || exam.categoryId.toUpperCase()}</span>
                    <span>·</span>
                    <span className="tabular-nums">{exam.examCode}</span>
                    <span>·</span>
                    <span className="tabular-nums">
                      {(exam.stages || []).length} Stages · {(exam.subjects || []).length} Subjects · {chaptersCount} Chapters
                    </span>
                    <span>·</span>
                    <span className={isProvisional ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                      {exam.syllabusVersion} ({exam.notificationYear})
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-[#182B45] truncate">
                    {exam.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{exam.authority}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(exam)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer ${
                      exam.status === 'Draft'
                        ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {exam.status === 'Draft' ? 'Draft · Publish' : 'Published'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPdfModalExam(exam);
                      setQuickPdfUrl(exam.officialSyllabusPdfUrl || '');
                      setQuickPdfLabel(exam.syllabusPdfLabel || 'Official Syllabus PDF');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    title="Attach or upload official syllabus PDF"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAnnualModalExam(exam);
                      setAnnualYear(Number(exam.notificationYear || 2026) + 1);
                      setAnnualNotes(`Updated syllabus & exam pattern for ${Number(exam.notificationYear || 2026) + 1} notification.`);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#12345A] hover:bg-blue-100 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    title="Update syllabus for new year preserving history"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Annual Update</span>
                  </button>

                  <a
                    href={`/syllabus/${exam.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#2468B4] hover:bg-slate-100"
                    title="Preview public syllabus page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(exam)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-[#12345A] hover:bg-slate-100 cursor-pointer"
                    title="Edit full exam syllabus"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(exam)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete exam syllabus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CREATE / EDIT FULL 20-POINT SYLLABUS */}
      {editModalOpen && editingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full p-6 shadow-2xl my-6 space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#182B45]">
                  {editingExam.id ? `Edit Syllabus: ${editingExam.shortName || editingExam.name}` : 'Create New Exam Syllabus'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  All 20 official fields + nested subjects, chapters & official vs recommended topic tags.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Modal Section Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 shrink-0 overflow-x-auto">
              {[
                { id: 'basic', label: '1. Basic Info & Eligibility' },
                { id: 'pattern', label: '2. Stages, Pattern & Physical' },
                { id: 'subjects', label: `3. Subjects & Chapters (${(editingExam.subjects || []).length})` },
                { id: 'pdf', label: '4. Official Links, PDF & Version' }
              ].map((mt) => (
                <button
                  key={mt.id}
                  type="button"
                  onClick={() => setModalTab(mt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                    modalTab === mt.id
                      ? 'bg-[#12345A] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {mt.label}
                </button>
              ))}
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 shrink-0">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveExam} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
              {modalTab === 'basic' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Full Examination Name *</label>
                      <input
                        type="text"
                        required
                        value={editingExam.name || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, name: e.target.value })}
                        placeholder="e.g. SSC CGL (Combined Graduate Level)"
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Unique Exam Code *</label>
                      <input
                        type="text"
                        required
                        value={editingExam.examCode || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, examCode: e.target.value.toUpperCase() })}
                        placeholder="e.g. SSC-CGL"
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Short Display Name</label>
                      <input
                        type="text"
                        value={editingExam.shortName || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, shortName: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Primary Category *</label>
                      <select
                        value={editingExam.categoryId || 'rrb'}
                        onChange={(e) => setEditingExam({ ...editingExam, categoryId: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Scope</label>
                      <select
                        value={editingExam.scope || 'Central'}
                        onChange={(e) => setEditingExam({ ...editingExam, scope: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      >
                        <option value="Central">Central</option>
                        <option value="State">State</option>
                        <option value="Central & State">Central & State</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Conducting Authority *</label>
                      <input
                        type="text"
                        required
                        value={editingExam.authority || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, authority: e.target.value })}
                        placeholder="e.g. Staff Selection Commission (ssc.gov.in)"
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">State (if State exam)</label>
                      <input
                        type="text"
                        value={editingExam.state || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, state: e.target.value })}
                        placeholder="e.g. Andhra Pradesh / Telangana"
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Exam Introduction *</label>
                    <textarea
                      rows={2}
                      required
                      value={editingExam.introduction || ''}
                      onChange={(e) => setEditingExam({ ...editingExam, introduction: e.target.value })}
                      className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Qualification / Eligibility</label>
                      <textarea
                        rows={2}
                        value={editingExam.qualification || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, qualification: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Age Limit</label>
                      <textarea
                        rows={2}
                        value={editingExam.ageLimit || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, ageLimit: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-1">
                    <label className="inline-flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingExam.popular)}
                        onChange={(e) => setEditingExam({ ...editingExam, popular: e.target.checked })}
                      />
                      <span>Feature in Popular Exams</span>
                    </label>
                    <label className="inline-flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingExam.status !== 'Draft'}
                        onChange={(e) =>
                          setEditingExam({ ...editingExam, status: e.target.checked ? 'Published' : 'Draft' })
                        }
                      />
                      <span>Published on Public Portal</span>
                    </label>
                  </div>
                </div>
              )}

              {modalTab === 'pattern' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Selection Process Summary</label>
                    <input
                      type="text"
                      value={editingExam.selectionProcess || ''}
                      onChange={(e) => setEditingExam({ ...editingExam, selectionProcess: e.target.value })}
                      className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Number of Questions</label>
                      <input
                        type="text"
                        value={editingExam.totalQuestions || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, totalQuestions: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Total Marks</label>
                      <input
                        type="text"
                        value={editingExam.totalMarks || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, totalMarks: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Examination Duration</label>
                      <input
                        type="text"
                        value={editingExam.duration || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, duration: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Negative Marking</label>
                      <input
                        type="text"
                        value={editingExam.negativeMarking || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, negativeMarking: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Skill / Typing / CBAT Details</label>
                      <textarea
                        rows={2}
                        value={editingExam.skillTestDetails || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, skillTestDetails: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Interview Details</label>
                      <textarea
                        rows={2}
                        value={editingExam.interviewDetails || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, interviewDetails: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Language Options (comma-separated)</label>
                    <input
                      type="text"
                      value={(editingExam.languages || []).join(', ')}
                      onChange={(e) =>
                        setEditingExam({
                          ...editingExam,
                          languages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        })
                      }
                      className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {modalTab === 'subjects' && (
                <div className="space-y-4">
                  {/* Quick Blueprint Importer + Custom Subject */}
                  <div className="p-3 rounded-2xl bg-[#F6F8FC] border border-[#E3EAF2] flex flex-col sm:flex-row sm:items-center gap-2">
                    <select
                      value={blueprintToAdd}
                      onChange={(e) => setBlueprintToAdd(e.target.value)}
                      className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      {ALL_BLUEPRINT_OPTIONS.map((bp) => (
                        <option key={bp.id} value={bp.id}>
                          {bp.name} ({(bp.chapters || []).length} chapters)
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addBlueprintSubjectToExam}
                      className="px-3 py-2 rounded-xl bg-[#12345A] text-white font-bold hover:bg-[#0B1F3A] cursor-pointer whitespace-nowrap"
                    >
                      + Attach Blueprint Subject
                    </button>
                    <button
                      type="button"
                      onClick={addCustomSubjectToExam}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                    >
                      + Blank Subject
                    </button>
                  </div>

                  {(editingExam.subjects || []).length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-slate-300 rounded-2xl text-slate-500">
                      No subjects attached yet. Select a subject blueprint above or add a custom subject.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(editingExam.subjects || []).map((subj, sIdx) => {
                        const isOpen = expandedSubjectIdx === sIdx;
                        return (
                          <div key={subj.id || sIdx} className="border border-slate-200 rounded-2xl overflow-hidden">
                            <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => setExpandedSubjectIdx(isOpen ? -1 : sIdx)}
                                className="flex items-center gap-2 font-bold text-[#12345A] text-left flex-1 cursor-pointer"
                              >
                                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                <span>{subj.name}</span>
                                <span className="text-[11px] font-normal text-slate-500">
                                  ({(subj.chapters || []).length} chapters · {subj.stageTag || 'All Stages'})
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSubjectAt(sIdx)}
                                className="text-red-600 hover:underline text-[11px] font-semibold cursor-pointer"
                              >
                                Remove Subject
                              </button>
                            </div>

                            {isOpen && (
                              <div className="p-4 space-y-3 bg-white">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  <input
                                    type="text"
                                    value={subj.name || ''}
                                    onChange={(e) => {
                                      const next = [...editingExam.subjects];
                                      next[sIdx] = { ...subj, name: e.target.value };
                                      setEditingExam({ ...editingExam, subjects: next });
                                    }}
                                    placeholder="Subject Name"
                                    className="p-2 bg-[#F6F8FC] border border-slate-200 rounded-lg"
                                  />
                                  <input
                                    type="text"
                                    value={subj.stageTag || ''}
                                    onChange={(e) => {
                                      const next = [...editingExam.subjects];
                                      next[sIdx] = { ...subj, stageTag: e.target.value };
                                      setEditingExam({ ...editingExam, subjects: next });
                                    }}
                                    placeholder="Stage Tag (e.g., Tier-I & Tier-II)"
                                    className="p-2 bg-[#F6F8FC] border border-slate-200 rounded-lg"
                                  />
                                </div>

                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                  {(subj.chapters || []).map((ch, cIdx) => (
                                    <div key={ch.id || cIdx} className="p-2.5 rounded-xl bg-[#F6F8FC] border border-slate-200 space-y-2">
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={ch.title || ''}
                                          onChange={(e) => updateChapterField(sIdx, cIdx, { title: e.target.value })}
                                          placeholder="Chapter Title"
                                          className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                                        />
                                        <select
                                          value={ch.topicType || 'official'}
                                          onChange={(e) => updateChapterField(sIdx, cIdx, { topicType: e.target.value })}
                                          className="p-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                                        >
                                          <option value="official">Official</option>
                                          <option value="recommended">Recommended</option>
                                        </select>
                                        <button
                                          type="button"
                                          onClick={() => removeChapterAt(sIdx, cIdx)}
                                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                                          title="Delete Chapter"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                      <textarea
                                        rows={2}
                                        value={(ch.subtopics || []).join('\n')}
                                        onChange={(e) =>
                                          updateChapterField(sIdx, cIdx, {
                                            subtopics: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
                                          })
                                        }
                                        placeholder="Subtopics (one per line)"
                                        className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-[11px]"
                                      />
                                    </div>
                                  ))}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => addChapterToSubject(sIdx)}
                                  className="px-3 py-1.5 rounded-lg bg-[#EAF3FF] text-[#12345A] font-bold hover:bg-[#dcebff] cursor-pointer"
                                >
                                  + Add Chapter to {subj.shortName || subj.name}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {modalTab === 'pdf' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Official Notification Reference</label>
                      <input
                        type="text"
                        value={editingExam.officialNotificationRef || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, officialNotificationRef: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Official Website / Portal URL</label>
                      <input
                        type="url"
                        value={editingExam.officialWebsiteUrl || ''}
                        onChange={(e) => setEditingExam({ ...editingExam, officialWebsiteUrl: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Notification Year</label>
                      <input
                        type="number"
                        value={editingExam.notificationYear || 2026}
                        onChange={(e) => setEditingExam({ ...editingExam, notificationYear: Number(e.target.value) })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Verification Status</label>
                      <select
                        value={editingExam.verificationStatus || 'Verified 2026'}
                        onChange={(e) => setEditingExam({ ...editingExam, verificationStatus: e.target.value })}
                        className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl focus:bg-white"
                      >
                        <option value="Verified 2026">Verified 2026</option>
                        <option value="Latest Official (2025)">Latest Official (2025)</option>
                        <option value="Latest Official (2024)">Latest Official (2024)</option>
                        <option value="Provisional — Verify Notification">Provisional — Verify Notification</option>
                      </select>
                    </div>
                  </div>

                  <DocumentFileUploader
                    label="Official Syllabus PDF Upload or Link"
                    value={editingExam.officialSyllabusPdfUrl || ''}
                    onChange={(url) => setEditingExam({ ...editingExam, officialSyllabusPdfUrl: url })}
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Syllabus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUICK PDF UPLOAD / LINK */}
      {pdfModalExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-[#182B45]">
                Upload Official Syllabus PDF — {pdfModalExam.shortName}
              </h3>
              <button type="button" onClick={() => setPdfModalExam(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">PDF Button Label</label>
                <input
                  type="text"
                  value={quickPdfLabel}
                  onChange={(e) => setQuickPdfLabel(e.target.value)}
                  className="w-full p-2 bg-[#F6F8FC] border border-slate-200 rounded-xl"
                />
              </div>
              <DocumentFileUploader
                label="Official Syllabus PDF"
                value={quickPdfUrl}
                onChange={setQuickPdfUrl}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPdfModalExam(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pdfSaving}
                onClick={handleSavePdfQuick}
                className="px-4 py-2 rounded-xl bg-[#12345A] text-white text-xs font-bold hover:bg-[#0B1F3A] cursor-pointer"
              >
                {pdfSaving ? 'Saving...' : 'Save PDF Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: JSON BULK IMPORT */}
      {importOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-[#182B45]">
                Bulk Import Exam Syllabi (JSON)
              </h3>
              <button type="button" onClick={() => setImportOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              <p className="text-slate-500">
                Paste JSON array of exam syllabi. Duplicates by examCode or name are automatically skipped.
              </p>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EAF3FF] text-[#12345A] font-bold shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Sample JSON</span>
              </button>
            </div>

            <textarea
              rows={9}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='[{"name": "...", "examCode": "...", "categoryId": "ssc", "authority": "...", ...}]'
              className="w-full p-3 rounded-xl bg-[#F6F8FC] border border-slate-200 font-mono text-[11px] focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
            />

            {importSummary && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-[#12345A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Imported: {importSummary.ok} · Skipped Duplicates: {importSummary.skipped} · Errors: {importSummary.errors.length}
                  </span>
                </div>
                {importSummary.errors.slice(0, 4).map((err, i) => (
                  <p key={i} className="text-red-700 text-[11px]">{err}</p>
                ))}
                {importSummary.duplicates.slice(0, 4).map((dup, i) => (
                  <p key={i} className="text-amber-700 text-[11px]">{dup}</p>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setImportOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                disabled={importBusy || !importJson.trim()}
                onClick={handleBulkImport}
                className="px-4 py-2 rounded-xl bg-[#12345A] text-white text-xs font-bold hover:bg-[#0B1F3A] disabled:opacity-50 cursor-pointer"
              >
                {importBusy ? 'Importing...' : 'Run JSON Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ANNUAL VERSION UPDATE (PRESERVES HISTORICAL VERSIONS) */}
      {annualModalExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form onSubmit={handleAnnualBump} className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-[#182B45]">
                Annual Syllabus Update
              </h3>
              <button type="button" onClick={() => setAnnualModalExam(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-600">
              Publish a new annual cycle version for <strong>{annualModalExam.name}</strong> while preserving previous year archives ({annualModalExam.syllabusVersion}).
            </p>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Notification Year</label>
              <input
                type="number"
                required
                value={annualYear}
                onChange={(e) => setAnnualYear(Number(e.target.value))}
                className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Changelog / Version Notes</label>
              <textarea
                rows={3}
                required
                value={annualNotes}
                onChange={(e) => setAnnualNotes(e.target.value)}
                className="w-full p-2.5 bg-[#F6F8FC] border border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAnnualModalExam(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={annualBusy}
                className="px-4 py-2 rounded-xl bg-[#12345A] text-white font-bold hover:bg-[#0B1F3A] cursor-pointer"
              >
                {annualBusy ? 'Updating...' : 'Publish New Cycle Version'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Exam Syllabus?"
        message={`Are you sure you want to delete "${deleteTarget?.name || ''}"? Existing student progress references will no longer link to this exam.`}
        confirmLabel="Delete Syllabus"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
