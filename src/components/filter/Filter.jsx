import { useData } from "../../context/data/MyState";
import { Search, X } from "lucide-react";

const PINK = "#E91E8C";

function Filter() {
  const {
    mode,
    searchkey, setSearchkey,
    filterType, setFilterType,
    product,
    resetFilter,
    hairCategories,
  } = useData();

  const bg   = mode === "dark" ? "#2d1a26" : "#FFF5F7";
  const card = mode === "dark" ? "#3d1a2e" : "#fff";
  const text = mode === "dark" ? "#FAFAFA" : "#2d2d2d";

  return (
    <div className="container mx-auto px-4 mt-5 md:hidden">
      <div className="p-4 rounded-2xl"
        style={{ background: card, border: "1.5px solid #FFD6E7" }}>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: PINK }} />
          <input
            type="text"
            value={searchkey}
            onChange={e => setSearchkey(e.target.value)}
            placeholder="Search accessories…"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: bg, border: "1.5px solid #FFD6E7", color: text }}
          />
          {searchkey && (
            <button onClick={() => setSearchkey("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#bbb" }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category select */}
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: bg, border: "1.5px solid #FFD6E7", color: text }}>
            <option value="">All Categories</option>
            {(hairCategories || []).slice(1).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
            ))}
          </select>

          <button
            onClick={resetFilter}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: PINK }}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filter;
