import { useTracker } from "../context/TrackerContext";

export default function ProgressDashboard() {
  const { stats } = useTracker();
  const { totalCount, solvedCount, easyCount, mediumCount, hardCount, easySolved, mediumSolved, hardSolved } = stats;
  const percentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const size = 82, stroke = 7;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percentage / 100) * circ;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-3">
      <div className="bg-[#07071a] border border-[#0f0f28] rounded-lg p-4 flex items-center gap-6 flex-wrap shadow-[0_0_30px_rgba(59,130,246,0.06)]">

        {/* Circular progress */}
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="rotate-[-90deg]">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
            <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#0d0d22" strokeWidth={stroke} />
            <circle
              cx={size/2} cy={size/2} r={radius}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)", filter: "drop-shadow(0 0 5px #3b82f6aa)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white font-black text-lg leading-none">{percentage}%</span>
            <span className="text-[#60a5fa] text-[9px] font-bold mt-0.5">{solvedCount}</span>
          </div>
        </div>

        {/* Label */}
        <div className="flex-shrink-0">
          <p className="text-[#444466] text-xs font-medium">Overall Progress</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-white font-black text-2xl">{solvedCount}</span>
            <span className="text-[#333355] text-sm">/ {totalCount}</span>
          </div>
        </div>

        <div className="hidden sm:block w-px h-10 bg-[#0f0f28]" />

        {/* Difficulty stats */}
        <div className="flex items-center gap-5 flex-wrap">
          <DiffStat label="Easy"   solved={easySolved}   total={easyCount}   dotColor="bg-[#2cbb5d]" textColor="text-[#2cbb5d]" glow="shadow-[0_0_8px_rgba(44,187,93,0.55)]" />
          <DiffStat label="Medium" solved={mediumSolved} total={mediumCount} dotColor="bg-[#f59e0b]" textColor="text-[#f59e0b]" glow="shadow-[0_0_8px_rgba(245,158,11,0.55)]" />
          <DiffStat label="Hard"   solved={hardSolved}   total={hardCount}   dotColor="bg-[#f87171]" textColor="text-[#f87171]" glow="shadow-[0_0_8px_rgba(248,113,113,0.55)]" />
        </div>
      </div>
    </div>
  );
}

function DiffStat({ label, solved, total, dotColor, textColor, glow }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor} ${glow}`} />
      <span className={`text-sm font-bold ${textColor}`}>{label}</span>
      <span className="text-white font-semibold text-sm tabular-nums">{solved}</span>
      <span className="text-[#333355] text-sm">/ {total}</span>
    </div>
  );
}
