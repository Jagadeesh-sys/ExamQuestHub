import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Loader2, Info, Layers } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { getMockQuestions } from '../firebase/firestoreService.js';
import {
  MOCK_TEST_TYPES,
  countQuestionsBySubject,
  getCategoryById
} from '../constants/mockTaxonomy.js';

/**
 * Step 2 of Mock Tests -> Category -> Subject -> Choose Test.
 * Lists the fixed subject list for one category; each subject links onward.
 */
export default function MockCategoryPage() {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);

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
  }, [categoryId]);

  const counts = useMemo(() => countQuestionsBySubject(questions), [questions]);

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-[#12345A]">Category not found</h1>
        <p className="text-sm text-slate-500">
          The mock test category you requested does not exist.
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

  const Icon = category.icon;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Mock Tests', to: '/mocks' },
          { label: category.name }
        ]}
      />

      {/* Category header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAF2] flex flex-col sm:flex-row sm:items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${category.accent.chip}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black text-[#12345A] tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{category.tagline}</p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 bg-[#EAF3FF]/70 border border-[#2468B4]/20 rounded-2xl p-4 text-xs text-[#12345A]">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Choose a subject below. Every subject offers Previous Year Questions, Most Important
          Questions and Practice Questions. Question content is published only from verified
          sources by the ExamQuestHub admin team.
        </p>
      </div>

      {/* Subject grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#2468B4]" />
          <h2 className="text-xl font-black text-[#12345A] tracking-tight">Subjects</h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#12345A]">
            {category.subjects.length}
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-[#E3EAF2] p-12 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 text-[#2468B4] animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading subjects…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.subjects.map((subject) => {
              const stat = counts[`${category.id}::${subject.id}`] || {
                PYQ: 0,
                IMPORTANT: 0,
                PRACTICE: 0,
                total: 0
              };

              return (
                <Link
                  key={subject.id}
                  to={`/mocks/category/${category.id}/${subject.id}`}
                  className="group bg-white rounded-2xl border border-[#E3EAF2] p-5 flex flex-col justify-between gap-4 hover:border-[#2468B4] hover:shadow-md transition-all"
                >
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-[#182B45] leading-snug group-hover:text-[#12345A]">
                      {subject.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {MOCK_TEST_TYPES.map((type) => (
                        <span
                          key={type.id}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            stat[type.id] > 0
                              ? type.accent.chip
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {type.shortLabel} · {stat[type.id]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {stat.total > 0 ? `${stat.total} questions` : 'Questions coming soon'}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#12345A] group-hover:text-white text-slate-500 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
