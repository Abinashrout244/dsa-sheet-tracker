import { useTracker } from "../context/TrackerContext";
import { useState, useRef } from "react";

export default function Header() {
  const { resetProgress, importProgress, exportProgress } = useTracker();
  const [showConfirm, setShowConfirm] = useState(false);
  const fileRef = useRef(null);

  const handleReset = () => {
    if (showConfirm) { resetProgress(); setShowConfirm(false); }
    else setShowConfirm(true);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try { importProgress(JSON.parse(ev.target.result)); }
      catch { alert("Invalid JSON file."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(exportProgress(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "dsa_progress.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#050510]/95 backdrop-blur-md border-b border-[#0f0f28] shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
      {/* Blue → indigo accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#1d4ed8] via-[#818cf8] to-[#1d4ed8]" />

      <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Title */}
        <div>
          <h1 className="font-bold text-lg leading-tight">
            <span className="bg-gradient-to-r from-[#60a5fa] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
             Abinash’s DSA Blueprint 
            </span>
            <span className="text-[#3b82f6]"> — </span>
            <span className="text-white">From Zero to Pro</span>
          </h1>
          <p className="text-[#444466] text-xs mt-0.5">
            A personal DSA tracker inspired by{" "}
            <a href="https://takeuforward.org/" target="_blank" rel="noopener noreferrer"
              className="text-[#60a5fa] hover:text-[#93c5fd] hover:underline transition-colors font-semibold">
              TakeUForward
            </a>
            {" "}· Built by <span className="text-[#a5b4fc] font-semibold">Abinash</span> to track the A2Z DSA journey 🚀
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="header-reset-btn"
            onClick={handleReset}
            onBlur={() => setTimeout(() => setShowConfirm(false), 200)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-200 ${
              showConfirm
                ? "bg-red-500/15 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.25)]"
                : "bg-[#0a0a1e] border-[#1a1a30] text-[#7777aa] hover:border-[#3b82f6]/50 hover:text-[#60a5fa] hover:bg-[#07071e]"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {showConfirm ? "Confirm?" : "Reset"}
          </button>

          <button
            id="header-import-btn"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-[#0a0a1e] border border-[#1a1a30] text-[#7777aa] hover:border-[#818cf8]/50 hover:text-[#a5b4fc] hover:bg-[#07071e] transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Import
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          <span className="text-[#333355] text-xs border border-[#0f0f28] rounded-md px-2.5 py-1.5 bg-[#060615]">
            Last updated :{" "}
            <span className="text-[#555577] font-medium">December 13, 2025</span>
          </span>
        </div>
      </div>
    </header>
  );
}
