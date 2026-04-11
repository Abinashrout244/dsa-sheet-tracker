import { useTracker } from "../context/TrackerContext";
import { useState, useRef } from "react";

export default function Header() {
  const { resetProgress, importProgress, exportProgress } = useTracker();
  const [showConfirm, setShowConfirm] = useState(false);
  const fileRef = useRef(null);

  const handleReset = () => {
    if (showConfirm) {
      resetProgress();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        importProgress(data);
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dsa_progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-violet-500/30">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight tracking-tight">
              DSA Sheet Tracker
            </h1>
            <p className="text-xs text-slate-400 font-medium">Striver A2Z Style · {new Date().getFullYear()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200 border border-slate-600/40 hover:border-slate-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>

          {/* Import */}
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200 border border-slate-600/40 hover:border-slate-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Import JSON
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          {/* Reset */}
          <button
            onClick={handleReset}
            onBlur={() => setTimeout(() => setShowConfirm(false), 200)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
              ${showConfirm
                ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                : "bg-slate-700/60 border-slate-600/40 text-slate-300 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {showConfirm ? "Confirm Reset?" : "Reset Progress"}
          </button>
        </div>
      </div>
    </header>
  );
}
