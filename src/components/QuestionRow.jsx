import { useTracker } from "../context/TrackerContext";
import { memo, useCallback } from "react";

const difficultyConfig = {
  Easy:   { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/25", dot: "bg-emerald-400" },
  Medium: { bg: "bg-amber-500/15",   text: "text-amber-400",   border: "border-amber-500/25",   dot: "bg-amber-400"   },
  Hard:   { bg: "bg-red-500/15",     text: "text-red-400",     border: "border-red-500/25",     dot: "bg-red-400"     },
};

const QuestionRow = memo(({ question, index }) => {
  const { solvedSet, notesSet, revisionSet, toggleSolved, toggleNotes, toggleRevision } = useTracker();
  const isSolved   = solvedSet.has(question.id);
  const hasNotes   = notesSet.has(question.id);
  const isRevision = revisionSet.has(question.id);
  const diff       = difficultyConfig[question.difficulty] || difficultyConfig.Easy;

  const handleCheck    = useCallback(() => toggleSolved(question.id),   [question.id, toggleSolved]);
  const handleNotes    = useCallback(() => toggleNotes(question.id),    [question.id, toggleNotes]);
  const handleRevision = useCallback(() => toggleRevision(question.id), [question.id, toggleRevision]);

  return (
    <div
      className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200
        ${isSolved
          ? "bg-violet-500/10 border-violet-500/20"
          : "bg-[#1e293b] border-slate-700/40 hover:bg-slate-700/50 hover:border-slate-600/50"
        }`}
    >
      {/* ── LEFT SIDE ── */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Styled Checkbox */}
        <button
          onClick={handleCheck}
          aria-label={isSolved ? "Mark unsolved" : "Mark solved"}
          className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shadow-sm
            ${isSolved
              ? "bg-violet-500 border-violet-500 shadow-violet-500/30"
              : "bg-transparent border-slate-600 group-hover:border-violet-400"
            }`}
        >
          {isSolved && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Question Number */}
        <span className="flex-shrink-0 text-xs font-mono text-slate-500 w-5 text-right select-none">
          {index + 1}
        </span>

        {/* Question Title */}
        <span
          className={`text-sm font-semibold truncate transition-colors duration-200
            ${isSolved ? "text-slate-500 line-through decoration-slate-600" : "text-white group-hover:text-violet-100"}`}
        >
          {question.title}
        </span>
      </div>

      {/* ── RIGHT SIDE ── */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Difficulty Badge */}
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border
            ${diff.bg} ${diff.text} ${diff.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${diff.dot}`} />
          {question.difficulty}
        </span>

        {/* Edit / Notes Icon */}
        <button
          onClick={handleNotes}
          title={hasNotes ? "Remove note" : "Add note"}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 border
            ${hasNotes
              ? "bg-yellow-400/15 border-yellow-500/30 text-yellow-400"
              : "bg-slate-700/60 border-slate-600/30 text-slate-500 hover:text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-500/30"
            }`}
          aria-label="Toggle note"
        >
          {/* Pencil / Edit Icon */}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>

        {/* Bookmark / Revision Icon */}
        <button
          onClick={handleRevision}
          title={isRevision ? "Remove bookmark" : "Bookmark for revision"}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 border
            ${isRevision
              ? "bg-orange-400/15 border-orange-500/30 text-orange-400"
              : "bg-slate-700/60 border-slate-600/30 text-slate-500 hover:text-orange-400 hover:bg-orange-400/10 hover:border-orange-500/30"
            }`}
          aria-label="Toggle revision bookmark"
        >
          {/* Bookmark Icon */}
          <svg className="w-3.5 h-3.5" fill={isRevision ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        {/* Solve Button */}
        <a
          href={question.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/70 hover:bg-violet-500/20 border border-slate-600/40 hover:border-violet-500/40 text-slate-300 hover:text-violet-300 text-xs font-semibold transition-all duration-200"
        >
          Solve
          {/* Arrow ↗ icon */}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
});

QuestionRow.displayName = "QuestionRow";
export default QuestionRow;
