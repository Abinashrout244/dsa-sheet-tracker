import { useState, useMemo, useEffect } from "react";
import { useTracker } from "../context/TrackerContext";
import { Chevron } from "../utils/Icon";
import { ProgressBar } from "../utils/ProgressBar";
import { TableHeader } from "../utils/Table";
import { QuestionRow } from "../utils/Questions";

export function SubTopic({ subTopic }) {
  const [open, setOpen] = useState(false);

  const {
    solvedSet, notesSet, revisionSet,
    toggleSolved, toggleNotes, toggleRevision,
    filterDifficulty, filterStatus, searchQuery, activeTab,
    highlightedQuestionId,
  } = useTracker();

  // Auto-open when a highlighted question lives in this subtopic
  useEffect(() => {
    if (highlightedQuestionId && subTopic.questions.some((q) => q.id === highlightedQuestionId)) {
      setOpen(true);
    }
  }, [highlightedQuestionId]);  // eslint-disable-line

  const filteredQuestions = useMemo(() => {
    return subTopic.questions.filter((q) => {
      if (filterDifficulty !== "All" && q.difficulty !== filterDifficulty) return false;
      if (filterStatus === "Solved"   && !solvedSet.has(q.id))            return false;
      if (filterStatus === "Unsolved" &&  solvedSet.has(q.id))            return false;
      if (activeTab === "revision"    && !revisionSet.has(q.id))          return false;
      if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [subTopic.questions, filterDifficulty, filterStatus, searchQuery, solvedSet, revisionSet, activeTab]);

  const isFiltering = filterDifficulty !== "All" || filterStatus !== "All" || searchQuery || activeTab === "revision";
  if (filteredQuestions.length === 0 && isFiltering) return null;

  const solvedCount = subTopic.questions.filter((q) => solvedSet.has(q.id)).length;
  const total       = subTopic.questions.length;
  const allDone    = solvedCount === total;

  return (
    <div>
      {/* SubTopic header — indigo accent when open */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-6 py-[11px] transition-all duration-150 text-left border-l-[3px] ${
          open
            ? "border-l-[#818cf8] bg-[#09091a]"
            : "border-l-transparent hover:border-l-[#818cf8]/40 hover:bg-[#ffffff02]"
        }`}
      >
        <Chevron open={open} color="text-[#818cf8]" />
        <span className={`text-sm font-medium flex-1 truncate transition-colors ${
          open ? "text-[#c7d2fe]" : "text-[#7777aa] hover:text-[#aaaacc]"
        }`}>
          {subTopic.topic}
        </span>
        <ProgressBar solved={solvedCount} total={total} />
      </button>

      {/* Table card */}
      {open && (
        <div className={`mx-6 mb-4 rounded-lg border overflow-x-auto ${
          allDone
            ? "border-[#2cbb5d]/25 shadow-[0_0_24px_rgba(44,187,93,0.07)]"
            : "border-[#3b82f6]/20 shadow-[0_0_24px_rgba(59,130,246,0.08)]"
        } bg-[#07071a]`}>
          <TableHeader />
          <div>
            {filteredQuestions.map((q) => (
              <QuestionRow
                key={q.id}
                q={q}
                isSolved={solvedSet.has(q.id)}
                hasNote={notesSet.has(q.id)}
                inRevision={revisionSet.has(q.id)}
                onToggleSolved={toggleSolved}
                onToggleNote={toggleNotes}
                onToggleRevision={toggleRevision}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}