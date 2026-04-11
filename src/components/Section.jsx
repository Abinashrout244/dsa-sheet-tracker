import { useState, useMemo } from "react";
import { useTracker } from "../context/TrackerContext";
import QuestionRow from "./QuestionRow";

export default function Section({ section }) {
  const [isOpen, setIsOpen] = useState(true);
  const { solvedSet, filterDifficulty, filterStatus, searchQuery } = useTracker();

  // Apply filters
  const filteredQuestions = useMemo(() => {
    return section.questions.filter((q) => {
      if (filterDifficulty !== "All" && q.difficulty !== filterDifficulty) return false;
      if (filterStatus === "Solved"   && !solvedSet.has(q.id)) return false;
      if (filterStatus === "Unsolved" &&  solvedSet.has(q.id)) return false;
      if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [section.questions, filterDifficulty, filterStatus, searchQuery, solvedSet]);

  // Hide whole section when no matches under active filter
  if (filteredQuestions.length === 0 && (filterDifficulty !== "All" || filterStatus !== "All" || searchQuery)) {
    return null;
  }

  const solvedInSection = section.questions.filter((q) => solvedSet.has(q.id)).length;
  const totalInSection  = section.questions.length;
  const pct             = totalInSection > 0 ? Math.round((solvedInSection / totalInSection) * 100) : 0;
  const isComplete      = pct === 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
      {/* ── SECTION CARD ── */}
      <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 shadow-lg shadow-black/20 overflow-hidden">

        {/* Card Header — clickable to collapse */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-700/30 transition-colors duration-200 text-left"
        >
          {/* Step Icon */}
          <span className="text-xl select-none flex-shrink-0">{section.icon}</span>

          {/* Title + progress */}
          <div className="flex-1 min-w-0">
            {/* Row: title + badge */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-white font-bold text-[15px] leading-snug truncate">
                {section.topic}
              </h2>

              {/* Total questions badge */}
              <span className="flex-shrink-0 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-700 border border-slate-600/50 text-slate-300 text-xs font-semibold min-w-[28px]">
                {totalInSection}
              </span>
            </div>

            {/* Progress bar + text */}
            <div className="mt-2.5 flex items-center gap-3">
              {/* Bar */}
              <div className="flex-1 h-1.5 rounded-full bg-slate-700/80">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isComplete
                      ? "bg-emerald-500"
                      : "bg-gradient-to-r from-violet-500 to-indigo-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Progress text */}
              <span className="flex-shrink-0 text-xs font-mono text-slate-400">
                {solvedInSection} / {totalInSection}
              </span>

              {/* Complete badge */}
              {isComplete && (
                <span className="flex-shrink-0 inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Done!
                </span>
              )}
            </div>
          </div>

          {/* Chevron */}
          <svg
            className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* ── QUESTION ROWS ── */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: isOpen ? "9999px" : "0px" }}
        >
          <div className="px-4 pb-4 flex flex-col gap-1.5">
            {filteredQuestions.map((question, idx) => (
              <QuestionRow key={question.id} question={question} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
