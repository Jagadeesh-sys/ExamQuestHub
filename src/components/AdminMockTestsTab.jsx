import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  BadgeCheck,
  AlertTriangle,
  X,
  Save,
  Upload
} from 'lucide-react';
import {
  deleteMockQuestion,
  getMockQuestions,
  saveMockQuestion
} from '../firebase/firestoreService.js';
import DocumentFileUploader from './DocumentFileUploader.jsx';
import ConfirmModal from './ConfirmModal.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  MOCK_CATEGORIES,
  MOCK_DIFFICULTY_LEVELS,
  MOCK_EXAM_NAMES,
  MOCK_TEST_TYPES,
  MOCK_VERIFICATION,
  findDuplicateQuestion,
  getSubjectName,
  getSubjectsForCategory,
  normalizeQuestionText,
  normalizeQuestionType,
  validateMockQuestion
} from '../constants/mockTaxonomy.js';

/** Resolves a loose category value (id, name or short name) to a taxonomy category. */
function matchCategory(value) {
  const key = String(value || '').trim().toLowerCase();
  if (!key) return null;

  return (
    MOCK_CATEGORIES.find((category) => category.id.toLowerCase() === key) ||
    MOCK_CATEGORIES.find((category) => category.name.toLowerCase() === key) ||
    MOCK_CATEGORIES.find((category) => category.shortName.toLowerCase() === key) ||
    null
  );
}

/** Resolves a loose subject value (id or name) inside a category. */
function matchSubject(categoryId, value) {
  const key = String(value || '').trim().toLowerCase();
  if (!key) return null;

  const subjects = getSubjectsForCategory(categoryId);
  return (
    subjects.find((subject) => subject.id.toLowerCase() === key) ||
    subjects.find((subject) => subject.name.toLowerCase() === key) ||
    null
  );
}

/**
 * Decides which bank an uploaded question belongs to.
 * A question only ever reaches the previous-year bank when it is explicitly
 * flagged as a PYQ; everything else stays in the important/practice banks.
 */
function detectQuestionType(item) {
  if (item?.isPyq === true) return 'PYQ';
  const raw = item?.questionType || item?.type || '';
  return normalizeQuestionType(raw);
}

function createEmptyQuestion(categoryId = MOCK_CATEGORIES[0].id) {
  return {
    categoryId,
    subjectId: getSubjectsForCategory(categoryId)[0]?.id || '',
    questionType: 'PYQ',
    difficulty: 'Medium',
    examName: '',
    examYear: '',
    source: '',
    verificationStatus: MOCK_VERIFICATION.UNVERIFIED,
    question: { en: '', te: '' },
    options: { en: ['', '', '', ''], te: ['', '', '', ''] },
    correctAnswer: 0,
    explanation: { en: '', te: '' },
    language: 'en',
    paperUrl: '',
    paperFileName: '',
    paperFileSize: ''
  };
}

/**
 * Admin console for subject-wise mock test questions
 * (Previous Year / Most Important / Practice).
 *
 * Enforces the product rules at the UI layer: PYQs need an exam name, year and
 * source before they can be verified, duplicates are rejected, and practice or
 * important questions never carry an examination attribution.
 */
export default function AdminMockTestsTab({ onNotify }) {
  const { getLocalized } = useLanguage();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [formErrors, setFormErrors] = useState([]);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkSummary, setBulkSummary] = useState(null);

  const loadQuestions = async () => {
    setLoading(true);
    const data = await getMockQuestions();
    setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const subjectOptions = useMemo(
    () => (categoryFilter === 'All' ? [] : getSubjectsForCategory(categoryFilter)),
    [categoryFilter]
  );

  const filtered = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();

    return questions.filter((question) => {
      if (categoryFilter !== 'All' && question.categoryId !== categoryFilter) return false;
      if (subjectFilter !== 'All' && question.subjectId !== subjectFilter) return false;
      if (typeFilter !== 'All' && normalizeQuestionType(question.questionType) !== typeFilter) {
        return false;
      }
      if (!needle) return true;

      return (
        String(question.question?.en || '').toLowerCase().includes(needle) ||
        String(question.examName || '').toLowerCase().includes(needle) ||
        String(question.source || '').toLowerCase().includes(needle)
      );
    });
  }, [questions, categoryFilter, subjectFilter, typeFilter, searchQuery]);

  const openCreate = () => {
    setDraft(createEmptyQuestion());
    setFormErrors([]);
    setFormOpen(true);
  };

  const openEdit = (question) => {
    setDraft({
      ...createEmptyQuestion(question.categoryId),
      ...question,
      question: { en: '', te: '', ...question.question },
      explanation: { en: '', te: '', ...question.explanation },
      options: {
        en: [...(question.options?.en || ['', '', '', ''])].slice(0, 4),
        te: [...(question.options?.te || ['', '', '', ''])].slice(0, 4)
      }
    });
    setFormErrors([]);
    setFormOpen(true);
  };

  const handleCategoryChange = (categoryId) => {
    setDraft((prev) => ({
      ...prev,
      categoryId,
      subjectId: getSubjectsForCategory(categoryId)[0]?.id || ''
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!draft) return;

    const type = normalizeQuestionType(draft.questionType);
    const teluguPresent = Boolean(
      draft.question?.te?.trim() ||
        draft.options?.te?.some((option) => String(option || '').trim()) ||
        draft.explanation?.te?.trim()
    );

    // Practice and Important questions are never given an examination
    // attribution or a verified marker.
    const candidate = {
      ...draft,
      questionType: type,
      examName: type === 'PYQ' ? String(draft.examName || '').trim() : '',
      examYear: type === 'PYQ' ? String(draft.examYear || '').trim() : '',
      verificationStatus:
        type === 'PYQ' ? draft.verificationStatus : MOCK_VERIFICATION.UNVERIFIED,
      language: teluguPresent ? 'en+te' : 'en'
    };

    const errors = validateMockQuestion(candidate);
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const duplicate = findDuplicateQuestion(candidate, questions);
    if (duplicate) {
      setFormErrors([
        `Duplicate question: this text already exists in ${getSubjectName(
          duplicate.categoryId,
          duplicate.subjectId
        )}.`
      ]);
      return;
    }

    setFormErrors([]);
    setSaving(true);
    try {
      await saveMockQuestion(candidate);
      await loadQuestions();
      setFormOpen(false);
      setDraft(null);
      onNotify?.('Mock question saved and synced to Firestore.');
    } catch (err) {
      onNotify?.(`Question not saved: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMockQuestion(deleteTarget.id);
      setQuestions((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      onNotify?.('Mock question deleted.');
    } catch (err) {
      onNotify?.(`Delete failed: ${err.message}`, 'error');
    }
    setDeleteTarget(null);
  };

  const openBulk = () => {
    setBulkJson('');
    setBulkSummary(null);
    setBulkOpen(true);
  };

  /**
   * Bulk JSON import with automatic bank separation.
   *
   * Each uploaded question is classified on its own: a question is routed to the
   * Previous Year bank only when it is explicitly flagged as a PYQ (and then it
   * must carry an exam name, year and — to be marked verified — a source).
   * Every other question goes to the Important or Practice bank with no
   * examination attribution, exactly as `handleSave` enforces.
   */
  const handleBulkImport = async () => {
    setBulkSummary(null);

    let parsed;
    try {
      parsed = JSON.parse(bulkJson);
    } catch (err) {
      setBulkSummary({
        ok: 0,
        failed: 0,
        byType: { PYQ: 0, IMPORTANT: 0, PRACTICE: 0 },
        errors: [`Invalid JSON: ${err.message}`],
        duplicates: []
      });
      return;
    }

    const items = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.questions)
        ? parsed.questions
        : null;

    if (!items || items.length === 0) {
      setBulkSummary({
        ok: 0,
        failed: 0,
        byType: { PYQ: 0, IMPORTANT: 0, PRACTICE: 0 },
        errors: ['Provide a JSON array of questions, or an object shaped { "questions": [ ... ] }.'],
        duplicates: []
      });
      return;
    }

    setBulkBusy(true);

    const errors = [];
    const duplicates = [];
    const byType = { PYQ: 0, IMPORTANT: 0, PRACTICE: 0 };
    const dbKeys = new Set(
      questions.map(
        (q) =>
          `${q.categoryId}::${q.subjectId}::${normalizeQuestionText(q.question?.en)}`
      )
    );
    const payloadKeys = new Set();
    let ok = 0;

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i] || {};
      const label = item?.question?.en || item?.id || `item ${i + 1}`;

      const category = matchCategory(item.categoryId || item.category);
      if (!category) {
        errors.push(
          `${label} — unknown category "${item.categoryId || item.category || ''}". Use one of: ${MOCK_CATEGORIES.map((c) => c.id).join(', ')}.`
        );
        continue;
      }

      const subject = matchSubject(category.id, item.subjectId || item.subject);
      if (!subject) {
        errors.push(
          `${label} — unknown subject "${item.subjectId || item.subject || ''}" under ${category.name}.`
        );
        continue;
      }

      const type = detectQuestionType(item);
      const enOptions = Array.isArray(item.options?.en) ? item.options.en : [];
      const teOptions = Array.isArray(item.options?.te) ? item.options.te : [];

      let correctAnswer = item.correctAnswer;
      if (typeof correctAnswer === 'string') {
        const letter = correctAnswer.trim().toUpperCase();
        correctAnswer = /^[A-D]$/.test(letter)
          ? letter.charCodeAt(0) - 65
          : parseInt(correctAnswer, 10);
      }

      const teluguPresent = Boolean(
        String(item.question?.te || '').trim() ||
          teOptions.some((option) => String(option || '').trim()) ||
          String(item.explanation?.te || '').trim()
      );

      const candidate = {
        categoryId: category.id,
        subjectId: subject.id,
        questionType: type,
        difficulty: MOCK_DIFFICULTY_LEVELS.includes(item.difficulty) ? item.difficulty : 'Medium',
        examName: type === 'PYQ' ? String(item.examName || '').trim() : '',
        examYear:
          type === 'PYQ' ? String(item.examYear || '').replace(/[^0-9]/g, '').slice(0, 4) : '',
        source: type === 'PYQ' ? String(item.source || '').trim() : '',
        verificationStatus:
          type === 'PYQ' &&
          String(item.verificationStatus || '').toUpperCase() === MOCK_VERIFICATION.VERIFIED
            ? MOCK_VERIFICATION.VERIFIED
            : MOCK_VERIFICATION.UNVERIFIED,
        question: {
          en: String(item.question?.en || '').trim(),
          te: String(item.question?.te || '').trim()
        },
        options: {
          en: enOptions.slice(0, 4).map((option) => String(option || '').trim()),
          te: [0, 1, 2, 3].map((idx) => String(teOptions[idx] || '').trim())
        },
        correctAnswer: Number.isInteger(correctAnswer) ? correctAnswer : -1,
        explanation: {
          en: String(item.explanation?.en || '').trim(),
          te: String(item.explanation?.te || '').trim()
        },
        language: teluguPresent ? 'en+te' : 'en',
        paperUrl: item.paperUrl || '',
        paperFileName: item.paperFileName || '',
        paperFileSize: item.paperFileSize || ''
      };

      const validationErrors = validateMockQuestion(candidate);
      if (validationErrors.length > 0) {
        errors.push(`${label} — ${validationErrors.join(' ')}`);
        continue;
      }

      const key = `${category.id}::${subject.id}::${normalizeQuestionText(candidate.question.en)}`;
      if (dbKeys.has(key)) {
        duplicates.push(`${label} — already exists in the database`);
        continue;
      }
      if (payloadKeys.has(key)) {
        duplicates.push(`${label} — repeated earlier in this import`);
        continue;
      }
      payloadKeys.add(key);

      try {
        // Sequential on purpose: surfaces the first real Firestore error
        // (e.g. permission-denied) instead of firing N failing writes at once.
        // eslint-disable-next-line no-await-in-loop
        await saveMockQuestion(candidate);
        ok += 1;
        byType[type] += 1;
      } catch (err) {
        errors.push(`${label} — ${err.message}`);
      }
    }

    setBulkBusy(false);
    setBulkSummary({ ok, failed: errors.length, byType, errors, duplicates });

    if (ok > 0) {
      await loadQuestions();
      onNotify?.(
        `Imported ${ok} question${ok === 1 ? '' : 's'} — ${byType.PYQ} to Previous Year, ${byType.IMPORTANT} to Most Important, ${byType.PRACTICE} to Practice.`
      );
    }
  };

  const isPyq = normalizeQuestionType(draft?.questionType) === 'PYQ';

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E3EAF2] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading font-bold text-lg text-[#182B45]">
            Manage Mock Test Questions
          </h2>
          <p className="text-xs text-slate-500">
            Add previous year, most important and practice questions. Published questions appear
            automatically under the matching category and subject.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={openBulk}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#C9D8E8] hover:bg-[#F6F8FC] text-[#12345A] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Import</span>
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-[#F6F8FC] p-3 rounded-2xl border border-[#E3EAF2]">
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setSubjectFilter('All');
          }}
          className="p-2 bg-white border rounded-lg text-xs"
        >
          <option value="All">All categories</option>
          {MOCK_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          disabled={categoryFilter === 'All'}
          className="p-2 bg-white border rounded-lg text-xs disabled:opacity-50"
        >
          <option value="All">All subjects</option>
          {subjectOptions.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 bg-white border rounded-lg text-xs"
        >
          <option value="All">All test types</option>
          {MOCK_TEST_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search question, exam or source..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-lg"
          />
        </div>

        <span className="text-[11px] font-bold text-slate-500 shrink-0">
          {filtered.length} of {questions.length}
        </span>
      </div>

      {/* Question list */}
      {loading ? (
        <div className="p-8 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading questions…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500">
          {questions.length === 0
            ? 'No mock questions yet. Use “Add Question” to publish the first one.'
            : 'No questions match the current filters.'}
        </div>
      ) : (
        <div className="divide-y divide-slate-100 text-xs">
          {filtered.map((question, idx) => {
            const type = normalizeQuestionType(question.questionType);
            const verified =
              type === 'PYQ' &&
              String(question.verificationStatus || '').toUpperCase() === MOCK_VERIFICATION.VERIFIED;

            return (
              <div key={question.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-1 max-w-2xl min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[#12345A]">Q{idx + 1}.</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {getSubjectName(question.categoryId, question.subjectId)}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#EAF3FF] text-[#12345A] text-[10px] font-bold">
                      {MOCK_TEST_TYPES.find((t) => t.id === type)?.shortLabel || type}
                    </span>
                    {question.difficulty && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {question.difficulty}
                      </span>
                    )}
                    {type === 'PYQ' && question.examName && (
                      <span className="px-2 py-0.5 rounded bg-[#FDF0E6] text-[#9A3412] text-[10px] font-semibold">
                        {question.examName}
                        {question.examYear ? ` · ${question.examYear}` : ''}
                      </span>
                    )}
                    {verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="font-medium text-[#182B45]">{getLocalized(question.question)}</p>

                  <p className="text-[11px] text-emerald-700 font-semibold">
                    Key: Option {String.fromCharCode(65 + Number(question.correctAnswer || 0))}
                  </p>

                  {question.source && (
                    <p className="text-[10px] text-slate-500 truncate">Source: {question.source}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 mt-1">
                  <button
                    type="button"
                    onClick={() => openEdit(question)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-[#12345A] hover:bg-slate-100"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(question)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / edit modal */}
      {formOpen && draft && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#182B45]">
                  {draft.id ? 'Edit Mock Question' : 'Add Mock Question'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Questions are published immediately to the matching category and subject.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setDraft(null);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-1">
                {formErrors.map((error) => (
                  <p key={error} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
                    <span>{error}</span>
                  </p>
                ))}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={draft.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                  >
                    {MOCK_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                  <select
                    value={draft.subjectId}
                    onChange={(e) => setDraft({ ...draft, subjectId: e.target.value })}
                    className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                  >
                    {getSubjectsForCategory(draft.categoryId).map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Test Type *</label>
                  <select
                    value={normalizeQuestionType(draft.questionType)}
                    onChange={(e) => setDraft({ ...draft, questionType: e.target.value })}
                    className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                  >
                    {MOCK_TEST_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={draft.difficulty}
                    onChange={(e) => setDraft({ ...draft, difficulty: e.target.value })}
                    className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                  >
                    {MOCK_DIFFICULTY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isPyq ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-[#EAF3FF]/60 border border-[#2468B4]/20">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Exam Name *
                    </label>
                    <select
                      value={draft.examName}
                      onChange={(e) => setDraft({ ...draft, examName: e.target.value })}
                      className="w-full p-2 bg-white border rounded-lg"
                    >
                      <option value="">Select examination…</option>
                      {MOCK_EXAM_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Exam Year *</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 2023"
                      value={draft.examYear}
                      onChange={(e) =>
                        setDraft({ ...draft, examYear: e.target.value.replace(/[^0-9]/g, '').slice(0, 4) })
                      }
                      className="w-full p-2 bg-white border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Verification Status
                    </label>
                    <select
                      value={draft.verificationStatus}
                      onChange={(e) => setDraft({ ...draft, verificationStatus: e.target.value })}
                      className="w-full p-2 bg-white border rounded-lg"
                    >
                      <option value={MOCK_VERIFICATION.UNVERIFIED}>Unverified</option>
                      <option value={MOCK_VERIFICATION.VERIFIED}>Verified</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Source / Reference (required to mark verified)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SSC CGL 2023 Tier-I official question paper, Q.42"
                      value={draft.source}
                      onChange={(e) => setDraft({ ...draft, source: e.target.value })}
                      className="w-full p-2 bg-white border rounded-lg"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Only record a source you have actually seen. Never label a question as a PYQ
                      without one.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-px text-amber-500" />
                  <p className="leading-relaxed">
                    {normalizeQuestionType(draft.questionType) === 'IMPORTANT'
                      ? 'Most Important Questions are syllabus-mapped and never carry an examination attribution.'
                      : 'Practice Questions are labelled as practice and are never presented as previous year questions.'}
                  </p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Question (English) *
                </label>
                <textarea
                  rows={2}
                  value={draft.question?.en || ''}
                  onChange={(e) =>
                    setDraft({ ...draft, question: { ...draft.question, en: e.target.value } })
                  }
                  className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Question (Telugu)
                </label>
                <textarea
                  rows={2}
                  value={draft.question?.te || ''}
                  onChange={(e) =>
                    setDraft({ ...draft, question: { ...draft.question, te: e.target.value } })
                  }
                  className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    4 Options (English) *
                  </label>
                  <div className="space-y-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        value={draft.options?.en?.[idx] || ''}
                        onChange={(e) => {
                          const next = [...(draft.options?.en || ['', '', '', ''])];
                          next[idx] = e.target.value;
                          setDraft({ ...draft, options: { ...draft.options, en: next } });
                        }}
                        className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    4 Options (Telugu)
                  </label>
                  <div className="space-y-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`ఎంపిక ${String.fromCharCode(65 + idx)}`}
                        value={draft.options?.te?.[idx] || ''}
                        onChange={(e) => {
                          const next = [...(draft.options?.te || ['', '', '', ''])];
                          next[idx] = e.target.value;
                          setDraft({ ...draft, options: { ...draft.options, te: next } });
                        }}
                        className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correct Answer *</label>
                <select
                  value={Number(draft.correctAnswer) || 0}
                  onChange={(e) =>
                    setDraft({ ...draft, correctAnswer: parseInt(e.target.value, 10) })
                  }
                  className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Explanation (English) *
                </label>
                <textarea
                  rows={2}
                  value={draft.explanation?.en || ''}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      explanation: { ...draft.explanation, en: e.target.value }
                    })
                  }
                  className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Explanation (Telugu)
                </label>
                <textarea
                  rows={2}
                  value={draft.explanation?.te || ''}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      explanation: { ...draft.explanation, te: e.target.value }
                    })
                  }
                  className="w-full p-2 bg-[#F6F8FC] border rounded-lg focus:bg-white"
                />
              </div>

              <DocumentFileUploader
                value={draft.paperUrl}
                onChange={(url) => setDraft({ ...draft, paperUrl: url })}
                onFileSizeChange={(size) => setDraft({ ...draft, paperFileSize: size })}
                onFileNameChange={(name) => setDraft({ ...draft, paperFileName: name })}
                currentFileSize={draft.paperFileSize}
                label="Question Paper (optional) — attached to this question"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setDraft(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white font-semibold disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{saving ? 'Saving to Firestore...' : 'Save Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk import modal */}
      {bulkOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#182B45] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#2468B4]" />
                  Bulk Import Mock Questions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Every question is filed into its own bank automatically — nothing is queued for
                  manual sorting.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBulkOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[#EAF3FF]/60 border border-[#2468B4]/20 text-[11px] space-y-1.5">
              <p className="font-bold text-[#12345A]">Automatic bank routing</p>
              <p className="text-slate-600 leading-relaxed">
                <span className="font-semibold text-[#12345A]">Previous Year bank</span> — only
                questions explicitly flagged as a PYQ (<code>questionType: "PYQ"</code> or{' '}
                <code>isPyq: true</code>). These must carry <code>examName</code> and{' '}
                <code>examYear</code>, plus a <code>source</code> before they can be marked{' '}
                <code>VERIFIED</code>.
              </p>
              <p className="text-slate-600 leading-relaxed">
                <span className="font-semibold text-[#9A3412]">Most Important bank</span> —{' '}
                <code>questionType: "IMPORTANT"</code>. Syllabus-mapped, no exam attribution.
              </p>
              <p className="text-slate-600 leading-relaxed">
                <span className="font-semibold text-[#065F46]">Practice bank</span> — anything else
                (<code>questionType: "PRACTICE"</code> or omitted). Never presented as a previous
                year question.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#F6F8FC] border border-[#E3EAF2] text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-[#12345A]">Field reference</p>
              <p>
                <span className="text-red-600">Required:</span> categoryId, subjectId, question.en,
                options.en (exactly 4), correctAnswer (0-3 or "A"-"D"), explanation.en
              </p>
              <p>
                <span className="text-amber-600">PYQ only:</span> examName, examYear, source (source
                needed only when verificationStatus is "VERIFIED")
              </p>
              <p>
                <span className="text-slate-500">Optional:</span> difficulty (Easy/Medium/Hard),
                question.te, options.te, explanation.te, paperUrl, paperFileName
              </p>
              <p className="text-slate-500">
                Valid categoryIds: {MOCK_CATEGORIES.map((c) => c.id).join(', ')}
              </p>
            </div>

            <textarea
              rows={12}
              spellCheck={false}
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              placeholder={`[
  {
    "categoryId": "gk",
    "subjectId": "indian-polity",
    "questionType": "PYQ",
    "difficulty": "Medium",
    "examName": "SSC CGL",
    "examYear": "2023",
    "source": "SSC CGL 2023 Tier-I official paper, Q.42",
    "verificationStatus": "VERIFIED",
    "question": { "en": "Which Article of the Constitution guarantees equality before the law?" },
    "options": { "en": ["Article 12", "Article 14", "Article 19", "Article 21"] },
    "correctAnswer": 1,
    "explanation": { "en": "Article 14 guarantees equality before the law and equal protection of the laws." }
  },
  {
    "categoryId": "gk",
    "subjectId": "indian-polity",
    "questionType": "PRACTICE",
    "difficulty": "Easy",
    "question": { "en": "The Preamble of the Constitution declares India a ..." },
    "options": { "en": ["Monarchy", "Sovereign Democratic Republic", "Military state", "Unitary state"] },
    "correctAnswer": "B",
    "explanation": { "en": "The Preamble declares India a Sovereign, Socialist, Secular, Democratic Republic." }
  }
]`}
              className="w-full p-3 font-mono text-[11px] bg-[#F6F8FC] border rounded-2xl focus:bg-white"
            />

            {bulkSummary && (
              <div className="space-y-2 text-[11px]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <p className="font-bold text-emerald-800 text-sm">{bulkSummary.ok}</p>
                    <p className="text-emerald-700">Imported</p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#EAF3FF] border border-[#2468B4]/20 text-center">
                    <p className="font-bold text-[#12345A] text-sm">{bulkSummary.byType.PYQ}</p>
                    <p className="text-[#12345A]">Previous Year</p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FDF0E6] border border-[#EA580C]/20 text-center">
                    <p className="font-bold text-[#9A3412] text-sm">{bulkSummary.byType.IMPORTANT}</p>
                    <p className="text-[#9A3412]">Most Important</p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#E7F7ED] border border-[#047857]/20 text-center">
                    <p className="font-bold text-[#065F46] text-sm">{bulkSummary.byType.PRACTICE}</p>
                    <p className="text-[#065F46]">Practice</p>
                  </div>
                </div>

                {(bulkSummary.errors.length > 0 || bulkSummary.duplicates.length > 0) && (
                  <div className="max-h-52 overflow-y-auto p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 space-y-1">
                    {bulkSummary.duplicates.map((message) => (
                      <p key={`dup-${message}`} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px text-amber-500" />
                        <span>{message}</span>
                      </p>
                    ))}
                    {bulkSummary.errors.map((message) => (
                      <p key={`err-${message}`} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
                        <span>{message}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setBulkOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                disabled={bulkBusy || !bulkJson.trim()}
                className="px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white font-semibold disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {bulkBusy ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{bulkBusy ? 'Importing to Firestore...' : 'Import Questions'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Mock Question"
        message={`Delete this question from ${getSubjectName(
          deleteTarget?.categoryId,
          deleteTarget?.subjectId
        )}? This cannot be undone.`}
        confirmLabel="Delete Question"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
