"use client";

export default function Sidebar({ areasData, onSelect }) {
  return (
    <div className="w-full h-full bg-[#EAF7F0] border-r border-[#d1e8dc] flex flex-col">
      <div className="p-6 border-b border-[#d1e8dc] bg-[#F4FBF7]">
        <h2 className="text-xl font-extrabold text-[#113220] tracking-widest uppercase flex flex-col gap-1">
          <span className="text-emerald-600 text-sm font-semibold">Live Intelligence</span>
          Flood Insights
        </h2>
      </div>

      <div className="overflow-y-auto flex-1 p-4 space-y-3">
        {areasData.map((area, i) => (
          <div
            key={i}
            onClick={() => onSelect(area)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-l-4 shadow-sm hover:shadow-md
              ${area.risk.level === "HIGH"
                ? "bg-red-50 border-red-500 text-red-900 animate-pulse ring-1 ring-red-200"
                : area.risk.level === "MEDIUM"
                ? "bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-200"
                : "bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-200"
              }`}
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-lg opacity-90">{area.name}</h3>
              {area.risk.level === 'HIGH' && <span className="h-3 w-3 rounded-full bg-red-500 animate-ping"></span>}
            </div>
            
            <p className="text-sm font-semibold mt-1 flex items-center gap-2 opacity-80">
              Risk: <span className={`font-black uppercase tracking-wider ${
                area.risk.level === 'HIGH' ? 'text-red-600' :
                area.risk.level === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
              }`}>{area.risk.level}</span>
            </p>
          </div>
        ))}
        {areasData.length === 0 && (
          <div className="text-center text-[#113220] mt-10 animate-pulse font-semibold">
            Loading data...
          </div>
        )}
      </div>
    </div>
  );
}
