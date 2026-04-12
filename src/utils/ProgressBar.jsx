export function ProgressBar({ solved, total }) {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  const done = pct === 100;
  return (
    <div className="flex items-center gap-3 ml-auto flex-shrink-0">
      <div className="w-[130px] h-[5px] rounded-full bg-[#252545] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            done
              ? "bg-gradient-to-r from-[#2cbb5d] to-[#34d399]"
              : "bg-gradient-to-r from-[#3b82f6] to-[#818cf8]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[#666688] text-xs font-medium w-[48px] text-right tabular-nums">
        <span className={solved > 0 ? "text-[#60a5fa] font-bold" : ""}>{solved}</span>
        <span className="text-[#333355]"> / {total}</span>
      </span>
    </div>
  );
}