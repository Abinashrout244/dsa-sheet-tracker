export function DiffBadge({ difficulty }) {
  const cls = {
    Easy:   "bg-[#0d2618] text-[#2cbb5d] border border-[#2cbb5d]/50 shadow-[0_0_8px_rgba(44,187,93,0.18)]",
    Medium: "bg-[#291e00] text-[#f59e0b] border border-[#f59e0b]/50 shadow-[0_0_8px_rgba(245,158,11,0.18)]",
    Hard:   "bg-[#2a0808] text-[#f87171] border border-[#f87171]/50 shadow-[0_0_8px_rgba(248,113,113,0.18)]",
  };
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded text-xs font-bold tracking-wide ${cls[difficulty] ?? cls.Easy}`}>
      {difficulty}
    </span>
  );
}