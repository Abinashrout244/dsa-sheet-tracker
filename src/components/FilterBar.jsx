import { useTracker } from "../context/TrackerContext";
import { useState, useRef, useEffect, useMemo } from "react";

const DIFFICULTY_OPTIONS = ["All problems", "Easy", "Medium", "Hard"];

// ─── Highlight matching text ──────────────────────────────────────────────────
function Highlight({ text, query }) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <span className="text-[#60a5fa] font-bold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </span>
  );
}

// ─── Difficulty mini-badge ────────────────────────────────────────────────────
function MiniDiff({ difficulty }) {
  const cls = {
    Easy:   "text-[#2cbb5d] bg-[#0d2618] border-[#2cbb5d]/30",
    Medium: "text-[#f59e0b] bg-[#291e00] border-[#f59e0b]/30",
    Hard:   "text-[#f87171] bg-[#2a0808] border-[#f87171]/30",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-px rounded text-[9px] font-bold border flex-shrink-0 ${cls[difficulty] ?? cls.Easy}`}>
      {difficulty}
    </span>
  );
}

export default function FilterBar() {
  const {
    dsaData,
    activeTab, setActiveTab,
    filterDifficulty, setFilterDifficulty,
    filterStatus, setFilterStatus,
    searchQuery, setSearchQuery,
    revisionSet,
    setHighlightedQuestionId,
  } = useTracker();

  const [showDiffDropdown,    setShowDiffDropdown]    = useState(false);
  const [showStatusDropdown,  setShowStatusDropdown]  = useState(false);
  const [showSuggestions,     setShowSuggestions]     = useState(false);
  const [activeIdx,           setActiveIdx]           = useState(-1);

  const diffRef    = useRef(null);
  const statusRef  = useRef(null);
  const searchRef  = useRef(null);
  const inputRef   = useRef(null);

  // ── All questions flattened for suggestions ──────────────────────────────
  const allQuestions = useMemo(() =>
    dsaData.flatMap((section) =>
      section.subTopics.flatMap((st) =>
        st.questions.map((q) => ({
          ...q,
          sectionTopic: section.topic,
          subTopic: st.topic,
        }))
      )
    ), [dsaData]);

  // ── Filtered suggestions (max 8) ─────────────────────────────────────────
  const suggestions = useMemo(() => {
    const q = searchQuery.trim();
    if (q.length < 1) return [];
    return allQuestions
      .filter((item) => item.title.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 8);
  }, [allQuestions, searchQuery]);

  // ── Close dropdowns on outside click ─────────────────────────────────────
  useEffect(() => {
    function handleClick(e) {
      if (diffRef.current && !diffRef.current.contains(e.target))     setShowDiffDropdown(false);
      if (statusRef.current && !statusRef.current.contains(e.target)) setShowStatusDropdown(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Keyboard nav inside suggestions ──────────────────────────────────────
  function handleKeyDown(e) {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      pickSuggestion(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIdx(-1);
    }
  }

  function pickSuggestion(item) {
    setSearchQuery(item.title);
    setHighlightedQuestionId(item.id);
    setShowSuggestions(false);
    setActiveIdx(-1);
    inputRef.current?.blur();
  }

  function handleInputChange(e) {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    setActiveIdx(-1);
  }

  function handleClear() {
    setSearchQuery("");
    setShowSuggestions(false);
    setActiveIdx(-1);
    inputRef.current?.focus();
  }

  const diffLabel = filterDifficulty === "All" ? "All problems" : filterDifficulty;

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">

        {/* ── Left: Tabs ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 bg-[#060615] rounded-md p-0.5 border border-[#0f0f28]">
          <TabBtn
            id="tab-all-problems"
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            label="All Problems"
            activeClass="bg-[#3b82f6]/15 text-[#60a5fa] border-[#3b82f6]/40 shadow-[0_0_10px_rgba(59,130,246,0.25)]"
          />
          <TabBtn
            id="tab-revision"
            active={activeTab === "revision"}
            onClick={() => setActiveTab("revision")}
            label="Revision"
            badge={revisionSet.size > 0 ? revisionSet.size : null}
            activeClass="bg-[#818cf8]/15 text-[#a5b4fc] border-[#818cf8]/40 shadow-[0_0_10px_rgba(129,140,248,0.25)]"
          />
        </div>

        {/* ── Right: Controls ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Search with suggestions */}
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#333355]"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="search-input"
                ref={inputRef}
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                className="pl-8 pr-8 py-1.5 rounded-md bg-[#060615] border border-[#0f0f28] text-white text-sm placeholder:text-[#333355] focus:outline-none focus:border-[#3b82f6]/60 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all w-56"
              />
              {searchQuery && (
                <button onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#444466] hover:text-[#60a5fa] transition-colors text-base leading-none">
                  ×
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 top-full mt-1 z-[100] w-[420px] max-w-[calc(100vw-2rem)] bg-[#07071a] border border-[#1a1a38] rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden">

                {/* Header */}
                <div className="px-3 py-1.5 border-b border-[#0f0f28] flex items-center justify-between">
                  <span className="text-[#444466] text-[10px] font-bold uppercase tracking-widest">
                    {suggestions.length} result{suggestions.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-[#333355] text-[10px]">↑↓ navigate · Enter to select</span>
                </div>

                {/* Items */}
                {suggestions.map((item, idx) => (
                  <button
                    key={item.id}
                    onMouseDown={(e) => { e.preventDefault(); pickSuggestion(item); }}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-3 border-b border-[#0a0a1e] transition-colors ${
                      idx === activeIdx
                        ? "bg-[#0f1528]"
                        : "hover:bg-[#0a0a20]"
                    }`}
                  >
                    {/* Search icon */}
                    <svg className="w-3.5 h-3.5 text-[#333355] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>

                    {/* Title + section info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[#ccccee] text-sm font-medium leading-snug truncate">
                        <Highlight text={item.title} query={searchQuery} />
                      </div>
                      <div className="text-[#333355] text-[10px] mt-0.5 truncate">
                        {item.sectionTopic.replace(/^Step \d+: /, "")}
                        <span className="mx-1 text-[#222235]">›</span>
                        {item.subTopic}
                      </div>
                    </div>

                    {/* Difficulty */}
                    <MiniDiff difficulty={item.difficulty} />
                  </button>
                ))}

                {/* No-more hint */}
                {allQuestions.filter(q => q.title.toLowerCase().includes(searchQuery.toLowerCase())).length > 8 && (
                  <div className="px-3 py-2 text-center text-[#333355] text-[10px]">
                    Showing 8 of {allQuestions.filter(q => q.title.toLowerCase().includes(searchQuery.toLowerCase())).length} matches — keep typing to narrow
                  </div>
                )}
              </div>
            )}

            {/* No results */}
            {showSuggestions && searchQuery.length > 0 && suggestions.length === 0 && (
              <div className="absolute left-0 top-full mt-1 z-[100] w-[340px] bg-[#07071a] border border-[#1a1a38] rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.8)] px-4 py-4 text-center">
                <div className="text-2xl mb-1">🔍</div>
                <p className="text-[#444466] text-xs">No problems found for "<span className="text-[#7777aa]">{searchQuery}</span>"</p>
              </div>
            )}
          </div>

          {/* Difficulty dropdown */}
          <div className="relative" ref={diffRef}>
            <button
              id="difficulty-dropdown"
              onClick={() => setShowDiffDropdown((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#060615] border border-[#0f0f28] text-[#7777aa] text-sm hover:border-[#3b82f6]/40 hover:text-[#93c5fd] transition-all"
            >
              <span>{diffLabel}</span>
              <svg className="w-3 h-3 text-[#333355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showDiffDropdown && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-[#060615] border border-[#0f0f28] rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.7)] min-w-[140px] py-1">
                {DIFFICULTY_OPTIONS.map((opt) => {
                  const val = opt === "All problems" ? "All" : opt;
                  const color = val === "Easy" ? "text-[#2cbb5d]" : val === "Medium" ? "text-[#f59e0b]" : val === "Hard" ? "text-[#f87171]" : "text-[#93c5fd]";
                  return (
                    <button key={opt}
                      onClick={() => { setFilterDifficulty(val); setShowDiffDropdown(false); }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[#0a0a22] ${
                        filterDifficulty === val ? `${color} bg-[#0a0a22] font-semibold` : "text-[#7777aa]"
                      }`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status filter */}
          <div className="relative" ref={statusRef}>
            <button
              id="status-dropdown"
              onClick={() => setShowStatusDropdown((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#060615] border border-[#0f0f28] text-[#7777aa] text-sm hover:border-[#818cf8]/40 hover:text-[#a5b4fc] transition-all"
            >
              <svg className="w-3.5 h-3.5 text-[#333355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              <span>Difficulty</span>
              <svg className="w-3 h-3 text-[#333355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-[#060615] border border-[#0f0f28] rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.7)] min-w-[130px] py-1">
                {["All", "Solved", "Unsolved"].map((s) => (
                  <button key={s}
                    onClick={() => { setFilterStatus(s); setShowStatusDropdown(false); }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[#0a0a22] ${
                      filterStatus === s ? "text-[#a5b4fc] bg-[#0a0a22] font-semibold" : "text-[#7777aa]"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function TabBtn({ id, active, onClick, label, badge, activeClass }) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`px-4 py-1.5 rounded text-sm font-medium border transition-all duration-200 ${
        active
          ? activeClass
          : "border-transparent text-[#444466] hover:text-[#7777aa] hover:bg-[#ffffff02]"
      }`}
    >
      {label}
      {badge && (
        <span className="ml-1.5 bg-[#818cf8] text-white text-[9px] font-black rounded-full px-1.5 py-0.5 leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}
