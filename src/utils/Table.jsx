const COLS = "52px minmax(0,1fr) 80px 110px 84px 64px 72px 100px";
const MIN_W = 780;

export function TableHeader() {
  return (
    <div
      className="grid items-center px-5 py-2.5 text-[#4444aa] text-[10px] font-bold tracking-widest uppercase border-b border-[#0d0d22] bg-[#05050f]"
      style={{ gridTemplateColumns: COLS, minWidth: MIN_W }}
    >
      <div>Status</div>
      <div>Problem</div>
      <div className="flex justify-center">
        <span className="bg-gradient-to-r from-[#3b82f6] to-[#818cf8] text-white text-[9px] font-bold px-1.5 py-[3px] rounded-[3px] shadow-[0_0_6px_rgba(59,130,246,0.5)] tracking-normal normal-case">
          Plus
        </span>
      </div>
      <div className="text-center">Resource</div>
      <div className="text-center">Practice</div>
      <div className="text-center">Note</div>
      <div className="text-center">Revision</div>
      <div className="text-center">Difficulty</div>
    </div>
  );
}