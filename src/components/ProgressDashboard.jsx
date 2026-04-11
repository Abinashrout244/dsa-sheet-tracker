import { useTracker } from "../context/TrackerContext";
import { useMemo } from "react";

function CircularProgress({ percentage, size = 140, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-white leading-none">{percentage}%</span>
        <span className="text-xs text-slate-400 mt-0.5 font-medium">Done</span>
      </div>
    </div>
  );
}

function StatBadge({ label, solved, total, color }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div className={`flex flex-col gap-1.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/40`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${color}`}>{label}</span>
        <span className="text-xs text-slate-400 font-mono">{pct}%</span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-xl font-black text-white leading-none">{solved}</span>
        <span className="text-slate-500 text-sm mb-0.5 font-medium">/ {total}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            label === "Easy" ? "bg-emerald-500" : label === "Medium" ? "bg-amber-500" : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ProgressDashboard() {
  const { stats } = useTracker();
  const { totalCount, solvedCount, easyCount, mediumCount, hardCount, easySolved, mediumSolved, hardSolved } = stats;
  const percentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/40 shadow-xl shadow-black/20 p-6">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Circle + main stat */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <CircularProgress percentage={percentage} />
            <div className="text-center sm:text-left">
              <p className="text-slate-400 text-sm font-medium mb-1">Overall Progress</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{solvedCount}</span>
                <span className="text-slate-500 text-lg font-medium">/ {totalCount}</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">problems solved</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                <span className="text-slate-300 text-sm font-medium">
                  {totalCount - solvedCount} remaining
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-32 bg-slate-700/50"></div>
          <div className="block lg:hidden w-full h-px bg-slate-700/50"></div>

          {/* Difficulty breakdown */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <StatBadge label="Easy" solved={easySolved} total={easyCount} color="text-emerald-400" />
            <StatBadge label="Medium" solved={mediumSolved} total={mediumCount} color="text-amber-400" />
            <StatBadge label="Hard" solved={hardSolved} total={hardCount} color="text-red-400" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-medium">Global Progress</span>
            <span className="text-slate-400 text-xs font-mono">{solvedCount} / {totalCount}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
