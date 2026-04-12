import { useEffect } from "react";
import {useTracker} from "../context/TrackerContext"
import { useRef } from "react";
import {IconArticle, IconYoutube,IconCirclePlus,IconStar} from "./Icon"
import { DiffBadge } from "./Badge";
import { getPlatform } from "./PlatFormDetection";

const COLS = "52px minmax(0,1fr) 80px 110px 84px 64px 72px 100px";
const MIN_W = 780;

export function QuestionRow({ q, isSolved, hasNote, inRevision, onToggleSolved, onToggleNote, onToggleRevision }) {
  const { highlightedQuestionId, setHighlightedQuestionId } = useTracker();
  const rowRef  = useRef(null);
  const isMatch = q.id === highlightedQuestionId;

  // Scroll into view and flash when this row is the highlighted target
  useEffect(() => {
    if (!isMatch || !rowRef.current) return;
    const el = rowRef.current;
    // Small delay so the sections finish opening first
    const scrollTimer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 320);
    // Clear highlight after 2.5 s
    const clearTimer = setTimeout(() => setHighlightedQuestionId(null), 2500);
    return () => { clearTimeout(scrollTimer); clearTimeout(clearTimer); };
  }, [isMatch]);  // eslint-disable-line
  return (
    <div
      ref={rowRef}
      className={`grid items-center px-5 py-[13px] border-t transition-all duration-150 group
        ${ isMatch
          ? "border-t-transparent border-l-[3px] border-l-[#3b82f6] bg-[#071828] shadow-[inset_0_0_30px_rgba(59,130,246,0.12)] animate-pulse-once"
          : isSolved
            ? "border-[#0c0c1c] bg-[#06080f] hover:bg-[#080c18]"
            : "border-[#0c0c1c] hover:bg-[#ffffff04] hover:border-l-[3px] hover:border-l-[#3b82f6]/50"
        }
      `}
      style={{ gridTemplateColumns: COLS, minWidth: MIN_W }}
    >
      {/* Checkbox */}
      <div>
        <input
          type="checkbox"
          checked={isSolved}
          onChange={() => onToggleSolved(q.id)}
          className="w-4 h-4 cursor-pointer accent-[#3b82f6] rounded-sm"
        />
      </div>

      {/* Problem */}
      <div className="min-w-0 pr-3">
        <span className={`text-sm font-semibold leading-snug transition-colors ${
          isSolved ? "line-through text-[#33334a]" : "text-[#e2e2ff] group-hover:text-white"
        }`}>
          {q.title}
        </span>
      </div>

      {/* Solve link */}
      <div className="flex justify-center">
        <a
          href={q.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#60a5fa] text-sm font-bold hover:text-[#93c5fd] hover:underline underline-offset-2 transition-colors"
        >
          Solve
        </a>
      </div>


      {/* Resource — article + youtube */}
      <div className="flex justify-center items-center gap-2.5">
        {q.articleLink
          ? <a href={q.articleLink} target="_blank" rel="noopener noreferrer"
              className="text-[#444466] hover:text-[#93c5fd] transition-colors" title="Article">
              <IconArticle />
            </a>
          : <span className="text-[#1e1e30]"><IconArticle /></span>
        }
        {q.youtubeLink
          ? <a href={q.youtubeLink} target="_blank" rel="noopener noreferrer"
              className="text-[#883333] hover:text-[#fc5050] transition-colors" title="Video">
              <IconYoutube />
            </a>
          : <span className="text-[#1e1e30]"><IconYoutube /></span>
        }
      </div>

     {/* Practice (Logo + Click + Custom Tooltip) */}
<div className="flex justify-center">
  {(() => {
    const platform = getPlatform(q.link);

    if (!platform) {
      return (
        <span className="text-[#2a2a45] text-sm font-medium tracking-widest">
          ---
        </span>
      );
    }

    return (
      <div className="relative group">
        {/* Clickable Logo */}
        <a
          href={q.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={platform.img}
            alt={platform.name}
            className="w-6 h-6 p-1 rounded-full bg-[#0a0a1a] border border-[#222244] 
                       hover:scale-110 hover:border-[#3b82f6] transition-all duration-200"
            onError={(e) => {
              if (e.target.src !== platform.fallbackImg) {
                e.target.src = platform.fallbackImg;
              } else {
                e.target.style.display = "none";
              }
            }}
          />
        </a>

        {/* Custom Tooltip */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                     px-2 py-1 rounded-md text-[10px] font-semibold
                     bg-[#0f172a] text-white border border-[#1e293b]
                     opacity-0 group-hover:opacity-100
                     translate-y-1 group-hover:translate-y-0
                     transition-all duration-200 pointer-events-none
                     shadow-lg"
        >
          {platform.name}
        </div>
      </div>
    );
  })()}
</div>

      {/* Note */}
      <div className="flex justify-center">
        <button
          onClick={() => onToggleNote(q.id)}
          title={hasNote ? "Remove note" : "Add note"}
          className={`transition-all duration-200 ${
            hasNote
              ? "text-[#60a5fa] drop-shadow-[0_0_4px_rgba(96,165,250,0.7)]"
              : "text-[#333355] hover:text-[#60a5fa] hover:drop-shadow-[0_0_4px_rgba(96,165,250,0.4)]"
          }`}
        >
          <IconCirclePlus />
        </button>
      </div>

      {/* Revision */}
      <div className="flex justify-center">
        <button
          onClick={() => onToggleRevision(q.id)}
          title={inRevision ? "Remove revision" : "Mark for revision"}
          className={`transition-all duration-200 ${
            inRevision
              ? "text-[#818cf8] drop-shadow-[0_0_5px_rgba(129,140,248,0.7)]"
              : "text-[#333355] hover:text-[#818cf8] hover:drop-shadow-[0_0_4px_rgba(129,140,248,0.4)]"
          }`}
        >
          <IconStar filled={inRevision} />
        </button>
      </div>

      {/* Difficulty */}
      <div className="flex justify-center">
        <DiffBadge difficulty={q.difficulty} />
      </div>
    </div>
  );
}