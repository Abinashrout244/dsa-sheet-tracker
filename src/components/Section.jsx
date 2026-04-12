import { useState, useMemo, useEffect, useRef } from "react";
import { useTracker } from "../context/TrackerContext";
import { Chevron } from "../utils/Icon";
import { ProgressBar } from "../utils/ProgressBar";
import{SubTopic} from "./Subtopic";

export default function Section({ section }) {
  const [open, setOpen] = useState(false);
  const { solvedSet, filterDifficulty, filterStatus, searchQuery, activeTab, revisionSet, highlightedQuestionId } = useTracker();

  const allQuestions = section.subTopics.flatMap((st) => st.questions);

  // Auto-open when a highlighted question lives in this section
  useEffect(() => {
    if (highlightedQuestionId && allQuestions.some((q) => q.id === highlightedQuestionId)) {
      setOpen(true);
    }
  }, [highlightedQuestionId]);  // eslint-disable-line
  const solvedCount  = allQuestions.filter((q) => solvedSet.has(q.id)).length;
  const total        = allQuestions.length;
  const allDone     = solvedCount === total;

  const hasVisible = section.subTopics.some((st) =>
    st.questions.some((q) => {
      if (filterDifficulty !== "All" && q.difficulty !== filterDifficulty) return false;
      if (filterStatus === "Solved"   && !solvedSet.has(q.id))            return false;
      if (filterStatus === "Unsolved" &&  solvedSet.has(q.id))            return false;
      if (activeTab === "revision"    && !revisionSet.has(q.id))          return false;
      if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
  );
  if (!hasVisible) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4">
      {/* Step header — blue accent when open */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-2 py-[14px] transition-all duration-150 text-left border-b border-l-[3px] ${
          open
            ? "border-b-[#0e0e20] border-l-[#3b82f6] bg-[#07071a]"
            : "border-b-[#111120] border-l-transparent hover:border-l-[#3b82f6]/50 hover:bg-[#ffffff02]"
        }`}
      >
        <Chevron open={open} color="text-[#3b82f6]" />
        <span className={`text-[15px] font-bold flex-1 truncate transition-colors ${
          open ? "text-white" : "text-[#9999bb] hover:text-white"
        }`}>
          {section.topic}
        </span>

        {/* Progress pill */}
        {solvedCount > 0 && (
          <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 ${
            allDone
              ? "bg-[#0a2a14] text-[#2cbb5d] border border-[#2cbb5d]/40"
              : "bg-[#071428] text-[#60a5fa] border border-[#3b82f6]/40"
          }`}>
            {allDone ? "✓ Complete" : `${solvedCount} done`}
          </span>
        )}

        <ProgressBar solved={solvedCount} total={total} />
      </button>

      {/* SubTopics */}
      {open && (
        <div className="border-b border-[#0e0e20] border-l-[3px] border-l-[#3b82f6]/20">
          {section.subTopics.map((st) => (
            <SubTopic key={st.id} subTopic={st} />
          ))}
        </div>
      )}
    </div>
  );
}