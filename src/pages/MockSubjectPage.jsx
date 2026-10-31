import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  Info,
  Play,
  ListChecks,
  BadgeCheck,
  AlertTriangle
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { getMockQuestions } from '../firebase/firestoreService.js';
import {
  MOCK_TEST_TYPES,
  MOCK_VERIFICATION,
  buildTestId,
  getCategoryById,
  getSubjectById,
  normalizeQuestionType
} from '../constants/mockTaxonomy.js';

/**
 * Step 3 of Mock Tests -> Category -> Subject -> Choose Test.
 * Offers the three test types for one subject and starts the CBT engine.
 */
export default function MockSubjectPage() {
  const { categoryId, subjectId } = useParams();
  const category = getCategoryById(categoryId);
  const subject = getSubjectById(categoryId, subjectId);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    (async () => {
      const data = await getMockQuestions();
      if (active) {
        setQuestions(data);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [categoryId, subjectId]);

  // Only this subject's questions matter here.
  const subjectQuestions = useMemo(
    () =>
      (questions || []).filter(
        (question) => question.categoryId === categoryId && question.subjectId === subjectId
      ),
    [questions, categoryId, subjectId]
  );

  const tests = useMemo(() => {
    return MOCK_TEST_TYPES.map((type) => {
      const bucket = subjectQuestions.filter(
        (question) => normalizeQuestionType(question.questionType) === type.id
      );

      const verifiedCount = bucket.filter(
        (question) =>
          String(question.verificationStatus || '').toUpperCase() === MOCK_VERIFICATION.VERIFIED
      ).length;

      // Exam + year coverage, only for real PYQ records that carry both fields.
      const coverage = Array.from(
        new Set(
          bucket
            .filter((question) => question.examName && question.examYear)
            .map((question) => `${question.examName} · ${question.examYear}`)
        )
      ).slice(0, 6);

      return { type, total: bucket.length, verifiedCount, coverage };
    });
  }, [subjectQuestions]);

  if (!category || !subject) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-[#12345A]">Subject not found</h1>
        <p className="text-sm text-slate-500">
          The subject you requested is not part of this mock test category.
        </p>
        <Link
          to="/mocks"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#12345A] text-white rounded-full font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mock Tests</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Mock Tests', to: '/mocks' },
          { label: category.name, to: `/mocks/category/${category.id}` },
          { label: subject.name }
        ]}
      />

      {/* Subject header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAF2] space-y-2">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${category.accent.chip}`}>
          {category.name}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#12345A] tracking-tight">
          {subject.name}
        </h1>
        <p className="text-sm text-slate-500">Choose a test type to begin.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-[#E3EAF2] p-12 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-[#2468B4] animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading tests…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {tests.map(({ type, total, verifiedCount, coverage }) => {
            const testId = buildTestId(category.id, subject.id, type.id);
            const available = total > 0;

            return (
              <div
                key={type.id}
                className="bg-white rounded-3xl border border-[#E3EAF2] p-6 flex flex-col gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${type.accent.chip}`}>
                      {type.shortLabel}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {total} {total === 1 ? 'question' : 'questions'}
                    </span>
                  </div>

                  <h2 className="text-lg font-black text-[#12345A] leading-snug">{type.label}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{type.description}</p>
                </div>

                {/* Test-type specific honesty cues */}
                {type.id === 'PYQ' && (
                  <div className="flex items-start gap-2 bg-[#EAF3FF]/70 border border-[#2468B4]/20 rounded-2xl p-3 text-[11px] text-[#12345A]">
                    <BadgeCheck className="w-4 h-4 shrink-0 mt-px" />
                    <p className="leading-relaxed">
                      {total > 0
                        ? `${verifiedCount} of ${total} questions carry a verified source reference.`
                        : 'Only genuine, sourced question papers are published here.'}
                    </p>
                  </div>
                )}

                {type.id === 'PRACTICE' && (
                  <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] text-slate-600">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-px text-amber-500" />
                    <p className="leading-relaxed">
                      These are practice questions, not previous-year questions.
                    </p>
                  </div>
                )}

                {type.id === 'PYQ' && coverage.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {coverage.map((label) => (
                      <span
                        key={label}
                        className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-semibold text-slate-600"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-2 space-y-2">
                  {available ? (
                    <>
                      <Link
                        to={`/mocks/${testId}?mode=cbt`}
                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-bold transition ${type.accent.button}`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Timed Test</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/mocks/${testId}?mode=practice`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#E3EAF2] hover:bg-slate-50 text-slate-700 text-[11px] font-bold transition"
                        >
                          <ListChecks className="w-3.5 h-3.5" />
                          <span>Practice</span>
                        </Link>
                        <Link
                          to={`/mocks/${testId}?mode=solutions`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#E3EAF2] hover:bg-slate-50 text-slate-700 text-[11px] font-bold transition"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Solutions</span>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="w-full text-center px-4 py-3 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-[11px] font-bold text-slate-500">
                      Questions coming soon
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-start gap-2.5 bg-white border border-[#E3EAF2] rounded-2xl p-4 text-xs text-slate-600">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#2468B4]" />
        <p className="leading-relaxed">
          Questions are published from the ExamQuestHub admin console. Previous year questions
          always display the examination name, year and source, and are marked verified only when a
          reliable source is recorded.
        </p>
      </div>
    </div>
  );
}
