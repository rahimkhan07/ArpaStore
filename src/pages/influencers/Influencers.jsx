import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../../context/data/MyState";
import {
  Search, SlidersHorizontal, CheckCircle, Star, Heart,
  X, Filter, ChevronDown, Users, Grid3X3, List, MapPin, BarChart2,
} from "lucide-react";
import { FaInstagram, FaYoutube, FaTiktok, FaFacebook } from "react-icons/fa";

const SAMPLE = [
  { id: "s1", name: "Priya Sharma", category: "Fashion", location: "Mumbai", country: "India", city: "Mumbai", followers: "2.4M", engagement: "4.8%", startingPrice: 5000, verified: true, rating: 4.9, platforms: ["instagram", "youtube"], avatar: "https://randomuser.me/api/portraits/women/44.jpg", completedCampaigns: 142, status: "approved" },
  { id: "s2", name: "Rahul Verma", category: "Technology", location: "Bangalore", country: "India", city: "Bangalore", followers: "1.8M", engagement: "5.2%", startingPrice: 8000, verified: true, rating: 4.8, platforms: ["youtube"], avatar: "https://randomuser.me/api/portraits/men/32.jpg", completedCampaigns: 98, status: "approved" },
  { id: "s3", name: "Sneha Kapoor", category: "Beauty", location: "Delhi", country: "India", city: "Delhi", followers: "3.1M", engagement: "6.1%", startingPrice: 3000, verified: true, rating: 4.9, platforms: ["instagram", "tiktok"], avatar: "https://randomuser.me/api/portraits/women/68.jpg", completedCampaigns: 215, status: "approved" },
  { id: "s4", name: "Arjun Singh", category: "Gaming", location: "Hyderabad", country: "India", city: "Hyderabad", followers: "5.2M", engagement: "7.3%", startingPrice: 10000, verified: false, rating: 4.7, platforms: ["youtube"], avatar: "https://randomuser.me/api/portraits/men/57.jpg", completedCampaigns: 76, status: "approved" },
  { id: "s5", name: "Meera Joshi", category: "Travel", location: "Goa", country: "India", city: "Goa", followers: "890K", engagement: "8.5%", startingPrice: 2500, verified: true, rating: 5.0, platforms: ["instagram", "youtube"], avatar: "https://randomuser.me/api/portraits/women/21.jpg", completedCampaigns: 63, status: "approved" },
  { id: "s6", name: "Karan Mehta", category: "Fitness", location: "Pune", country: "India", city: "Pune", followers: "1.2M", engagement: "9.1%", startingPrice: 4000, verified: true, rating: 4.8, platforms: ["instagram", "tiktok"], avatar: "https://randomuser.me/api/portraits/men/14.jpg", completedCampaigns: 120, status: "approved" },
  { id: "s7", name: "Divya Nair", category: "Lifestyle", location: "Chennai", country: "India", city: "Chennai", followers: "670K", engagement: "11.2%", startingPrice: 1500, verified: false, rating: 4.6, platforms: ["instagram"], avatar: "https://randomuser.me/api/portraits/women/55.jpg", completedCampaigns: 45, status: "approved" },
  { id: "s8", name: "Saurabh Tiwari", category: "Food", location: "Lucknow", country: "India", city: "Lucknow", followers: "420K", engagement: "12.4%", startingPrice: 1200, verified: true, rating: 4.7, platforms: ["instagram", "youtube"], avatar: "https://randomuser.me/api/portraits/men/78.jpg", completedCampaigns: 88, status: "approved" },
  { id: "s9", name: "Ananya Roy", category: "Education", location: "Kolkata", country: "India", city: "Kolkata", followers: "2.8M", engagement: "3.9%", startingPrice: 6000, verified: true, rating: 4.9, platforms: ["youtube"], avatar: "https://randomuser.me/api/portraits/women/31.jpg", completedCampaigns: 55, status: "approved" },
];

const PLATFORM_ICONS = {
  instagram: <FaInstagram style={{ color: "#E1306C" }} />,
  youtube: <FaYoutube style={{ color: "#FF0000" }} />,
  tiktok: <FaTiktok />,
  facebook: <FaFacebook style={{ color: "#1877F2" }} />,
};

const CATEGORIES = ["Fashion","Beauty","Technology","Gaming","Travel","Food","Fitness","Lifestyle","Education","Finance","Business","Entertainment","Health","Parenting"];
const PLATFORMS = ["instagram","youtube","tiktok","facebook","twitter"];

function InfluencerCard({ inf, dark, view, onFavorite, isFav }) {
  if (view === "list") {
    return (
      <motion.div whileHover={{ x: 4 }} className="flex items-center gap-4 p-4 rounded-2xl"
        style={{ background: "#fff", border: `1px solid ${"rgba(15,32,68,0.06)"}` }}>
        <img src={inf.avatar} alt={inf.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm" style={{ color: "#0F2044" }}>{inf.name}</h3>
            {inf.verified && <CheckCircle size={12} className="text-green-500" />}
          </div>
          <p className="text-xs" style={{ color: "#C9A84C" }}>{inf.category} • {inf.location}</p>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-xs" style={{ color: "#5A6882" }}>
          <span className="flex items-center gap-1"><Users size={10}/> {inf.followers}</span>
          <span className="flex items-center gap-1"><BarChart2 size={10}/> {inf.engagement}</span>
          <span className="flex items-center gap-1"><Star size={10} fill="#F59E0B" style={{ color: "#F59E0B" }} /> {inf.rating}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-bold text-sm" style={{ color: "#0F2044" }}>₹{Number(inf.startingPrice || 0).toLocaleString()}</span>
          <button onClick={() => onFavorite(inf.id)} style={{ color: isFav ? "#C9A84C" : "#5A6882" }}>
            <Heart size={16} fill={isFav ? "#C9A84C" : "none"} />
          </button>
          <Link to={`/influencer/${inf.id}`} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #0F2044, #C9A84C)" }}>
            View
          </Link>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "#fff", border: `1px solid ${"rgba(15,32,68,0.06)"}` }}>
      <div className="h-20 relative" style={{ background: "linear-gradient(135deg, #0F2044, #C9A84C, #2D4A7A)" }}>
        {inf.verified && (
          <span className="absolute top-2 right-2 verified-badge text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle size={8} /> Verified
          </span>
        )}
        <button onClick={() => onFavorite(inf.id)} className="absolute top-2 left-2" style={{ color: isFav ? "#C9A84C" : "rgba(255,255,255,0.7)" }}>
          <Heart size={16} fill={isFav ? "#C9A84C" : "none"} />
        </button>
      </div>
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-6 mb-2">
          <img src={inf.avatar} alt={inf.name} className="w-12 h-12 rounded-xl border-3 object-cover shadow-lg" style={{ borderColor: "#fff", border: `3px solid ${"#fff"}` }} />
          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#F59E0B" }}>
            <Star size={11} fill="#F59E0B" /> {inf.rating}
          </div>
        </div>
        <h3 className="font-bold text-sm" style={{ color: "#0F2044" }}>{inf.name}</h3>
        <p className="text-xs" style={{ color: "#C9A84C" }}>{inf.category}</p>
        <p className="text-xs mb-2 flex items-center gap-1" style={{ color: "#5A6882" }}><MapPin size={10}/> {inf.location}</p>
        <div className="flex gap-2 mb-3">
          {(inf.platforms || []).slice(0, 3).map(p => (
            <span key={p} className="text-sm">{PLATFORM_ICONS[p] || p}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-3 text-xs">
          <div className="p-1.5 rounded-lg text-center" style={{ background: "rgba(15,32,68,0.04)" }}>
            <div className="font-bold" style={{ color: "#0F2044" }}>{inf.followers}</div>
            <div style={{ color: "#5A6882" }}>Followers</div>
          </div>
          <div className="p-1.5 rounded-lg text-center" style={{ background: "rgba(15,32,68,0.04)" }}>
            <div className="font-bold" style={{ color: "#0F2044" }}>{inf.engagement}</div>
            <div style={{ color: "#5A6882" }}>Engagement</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold" style={{ color: "#0F2044" }}>₹{Number(inf.startingPrice || 0).toLocaleString()}</span>
          <Link to={`/influencer/${inf.id}`} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #0F2044, #C9A84C)" }}>
            View Profile
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Influencers() {
  const { mode, influencers, isFavorite, toggleFavorite,
    searchKey, setSearchKey, filterCategory, setFilterCategory,
    filterPlatform, setFilterPlatform, filterVerified, setFilterVerified,
    filterTopRated, setFilterTopRated, filterMinPrice, setFilterMinPrice,
    filterMaxPrice, setFilterMaxPrice, resetFilters } = useData();
  const dark = false;

  const [searchParams] = useSearchParams();
  const [view, setView] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  const bg = "#F8F7FF";
  const cardBg = "#fff";
  const border = "rgba(15,32,68,0.06)";
  const textPrimary = "#0F2044";
  const textMuted = "#5A6882";

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    if (q) setSearchKey(q);
    if (cat) setFilterCategory(cat);
  }, [searchParams]);

  const approvedFromDB = influencers.filter(i => i.status === "approved");
  const base = approvedFromDB.length > 0 ? approvedFromDB : SAMPLE;

  const filtered = base.filter(inf => {
    if (searchKey && !`${inf.name} ${inf.category} ${inf.location}`.toLowerCase().includes(searchKey.toLowerCase())) return false;
    if (filterCategory && (inf.category || "").toLowerCase() !== filterCategory.toLowerCase()) return false;
    if (filterPlatform && !(inf.platforms || []).includes(filterPlatform)) return false;
    if (filterMinPrice && (inf.startingPrice || 0) < parseInt(filterMinPrice)) return false;
    if (filterMaxPrice && (inf.startingPrice || 0) > parseInt(filterMaxPrice)) return false;
    if (filterVerified && !inf.verified) return false;
    if (filterTopRated && (inf.rating || 0) < 4) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "price_low") return (a.startingPrice || 0) - (b.startingPrice || 0);
    if (sortBy === "price_high") return (b.startingPrice || 0) - (a.startingPrice || 0);
    if (sortBy === "campaigns") return (b.completedCampaigns || 0) - (a.completedCampaigns || 0);
    return 0;
  });

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      {/* Header */}
      <div className="py-12 text-center" style={{ background: "linear-gradient(135deg, rgba(15,32,68,0.04), rgba(236,72,153,0.03))" }}>
        <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: textPrimary }}>
          Discover <span className="gradient-text">Influencers</span>
        </h1>
        <p className="text-sm mb-8" style={{ color: textMuted }}>
          {sorted.length} creators found matching your criteria
        </p>
        <div className="flex items-center gap-3 max-w-xl mx-auto px-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#C9A84C" }} />
            <input type="text" placeholder="Search influencers..." value={searchKey} onChange={e => setSearchKey(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl outline-none text-sm"
              style={{ background: "#fff", border: `1px solid ${border}`, color: textPrimary }} />
          </div>
          <button onClick={() => setShowFilters(p => !p)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: showFilters ? "linear-gradient(135deg, #0F2044, #C9A84C)" : ("rgba(15,32,68,0.05)"), color: showFilters ? "#fff" : "#0F2044", border: `1px solid ${border}` }}>
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-6 rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: textMuted }}>Category</label>
                  <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "rgba(15,32,68,0.04)", border: `1px solid ${border}`, color: textPrimary }}>
                    <option value="">All</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: textMuted }}>Platform</label>
                  <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "rgba(15,32,68,0.04)", border: `1px solid ${border}`, color: textPrimary }}>
                    <option value="">All</option>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: textMuted }}>Min Price ₹</label>
                  <input type="number" placeholder="0" value={filterMinPrice} onChange={e => setFilterMinPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "rgba(15,32,68,0.04)", border: `1px solid ${border}`, color: textPrimary }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: textMuted }}>Max Price ₹</label>
                  <input type="number" placeholder="∞" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "rgba(15,32,68,0.04)", border: `1px solid ${border}`, color: textPrimary }} />
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: textPrimary }}>
                    <input type="checkbox" checked={filterVerified} onChange={e => setFilterVerified(e.target.checked)} className="rounded" />
                    Verified Only
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: textPrimary }}>
                    <input type="checkbox" checked={filterTopRated} onChange={e => setFilterTopRated(e.target.checked)} className="rounded" />
                    Top Rated (4+)
                  </label>
                </div>
                <div className="flex items-end">
                  <button onClick={resetFilters} className="w-full px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <X size={14} /> Reset
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <p className="text-sm" style={{ color: textMuted }}>{sorted.length} influencers found</p>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "rgba(15,32,68,0.04)", border: `1px solid ${border}`, color: textPrimary }}>
              <option value="rating">Sort: Top Rated</option>
              <option value="campaigns">Most Campaigns</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(15,32,68,0.04)", border: `1px solid ${border}` }}>
              {[{ v: "grid", ic: <Grid3X3 size={14} /> }, { v: "list", ic: <List size={14} /> }].map(({ v, ic }) => (
                <button key={v} onClick={() => setView(v)} className="p-1.5 rounded-md transition-all"
                  style={{ background: view === v ? "linear-gradient(135deg, #0F2044, #C9A84C)" : "transparent", color: view === v ? "#fff" : textMuted }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <Search size={52} strokeWidth={1.2} style={{ color:"#C9A84C", margin:"0 auto 16px" }}/>
            <h3 className="text-lg font-bold mb-2" style={{ color: textPrimary }}>No influencers found</h3>
            <p className="text-sm mb-4" style={{ color: textMuted }}>Try adjusting your filters</p>
            <button onClick={resetFilters} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #0F2044, #C9A84C)" }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-3"}>
            {sorted.map((inf, i) => (
              <motion.div key={inf.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <InfluencerCard inf={inf} dark={dark} view={view} onFavorite={toggleFavorite} isFav={isFavorite(inf.id)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
