import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import { useAuth } from "../../components/protector/AuthContext";
import { Search, Heart, MessageCircle, TrendingUp, Star, Filter, CheckCircle, DollarSign, Users, Eye } from "lucide-react";

export default function BusinessDashboard() {
  const { mode, influencers, inquiries, favorites, isFavorite, toggleFavorite, getFilteredInfluencers,
          filterCategory, setFilterCategory, filterCity, setFilterCity, filterVerified, setFilterVerified,
          filterMinPrice, setFilterMinPrice, filterMaxPrice, setFilterMaxPrice, resetFilters, categories } = useData();
  const { user } = useAuth();
  const bg = "#F8F7FF", cardBg="#fff";
  const border="rgba(15,32,68,0.06)";
  const textPrimary="#0F2044", textMuted="#5A6882";
  const inputStyle={background:"rgba(15,32,68,0.04)",border:`1px solid ${border}`,color:textPrimary};

  const [tab, setTab] = useState("discover");
  const [showFilters, setShowFilters] = useState(false);

  const myInquiries = inquiries.filter(i => i.email === user?.email);
  const myFavs = influencers.filter(i => isFavorite(i.id));
  const filtered = getFilteredInfluencers();

  const TABS = [
    { id:"discover", label:"Discover", icon:<Search size={14}/> },
    { id:"saved",    label:`Saved (${myFavs.length})`, icon:<Heart size={14}/> },
    { id:"inquiries",label:`Inquiries (${myInquiries.length})`, icon:<MessageCircle size={14}/> },
    { id:"analytics",label:"Analytics", icon:<TrendingUp size={14}/> },
  ];

  return (
    <div style={{background:bg,minHeight:"100vh"}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black" style={{color:textPrimary}}>Business Dashboard</h1>
          <p className="text-sm mt-1" style={{color:textMuted}}>Find, save, and contact the perfect influencers for your brand.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {icon:<Search size={18}/>,label:"Available",val:filtered.length,color:"#0F2044"},
            {icon:<Heart size={18}/>,label:"Saved",val:myFavs.length,color:"#C9A84C"},
            {icon:<MessageCircle size={18}/>,label:"Inquiries Sent",val:myInquiries.length,color:"#2D4A7A"},
            {icon:<CheckCircle size={18}/>,label:"Verified Only",val:filtered.filter(i=>i.verified).length,color:"#10B981"},
          ].map(s=>(
            <div key={s.label} className="p-5 rounded-2xl" style={{background:cardBg,border:`1px solid ${border}`}}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{background:`${s.color}20`,color:s.color}}>{s.icon}</div>
              <div className="text-2xl font-black" style={{color:s.color}}>{s.val}</div>
              <div className="text-xs mt-1" style={{color:textMuted}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto scrollbar-hide" style={{background:"rgba(15,32,68,0.04)"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
              style={{background:tab===t.id?"linear-gradient(135deg,#0F2044,#C9A84C)":"transparent",color:tab===t.id?"#fff":textMuted}}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* DISCOVER */}
        {tab==="discover"&&(
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={()=>setShowFilters(p=>!p)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{background:showFilters?"linear-gradient(135deg,#0F2044,#C9A84C)":"transparent",color:showFilters?"#fff":textMuted,border:`1px solid ${border}`}}>
                <Filter size={14}/> Filters
              </button>
              <button onClick={resetFilters} className="px-4 py-2 rounded-xl text-sm" style={{color:textMuted,border:`1px solid ${border}`}}>Reset</button>
            </div>
            {showFilters&&(
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-5 rounded-2xl" style={{background:cardBg,border:`1px solid ${border}`}}>
                <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)} className="px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle}>
                  <option value="">All Categories</option>
                  {categories.map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                </select>
                <input placeholder="City" value={filterCity} onChange={e=>setFilterCity(e.target.value)} className="px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle}/>
                <input placeholder="Min Price ₹" type="number" value={filterMinPrice} onChange={e=>setFilterMinPrice(e.target.value)} className="px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle}/>
                <input placeholder="Max Price ₹" type="number" value={filterMaxPrice} onChange={e=>setFilterMaxPrice(e.target.value)} className="px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle}/>
                <label className="flex items-center gap-2 text-sm cursor-pointer" style={{color:textMuted}}>
                  <input type="checkbox" checked={filterVerified} onChange={e=>setFilterVerified(e.target.checked)} className="accent-purple-600"/>
                  Verified only
                </label>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(inf=>(
                <motion.div key={inf.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
                  className="rounded-2xl overflow-hidden influencer-card" style={{background:cardBg,border:`1px solid ${border}`}}>
                  <div className="h-20 relative" style={{background:"linear-gradient(135deg,#4C1D95,#0F2044,#C9A84C)"}}>
                    {inf.verified&&<span className="verified-badge absolute top-2 right-2">✓ Verified</span>}
                    <button onClick={()=>toggleFavorite(inf.id)} className="absolute top-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center" style={{background:"rgba(0,0,0,0.3)"}}>
                      <Heart size={13} style={{color:isFavorite(inf.id)?"#C9A84C":"#fff"}} fill={isFavorite(inf.id)?"#C9A84C":"none"}/>
                    </button>
                  </div>
                  <div className="px-4 pb-4 -mt-6">
                    <img src={inf.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(inf.name)}&background=7C3AED&color=fff`} alt={inf.name} className="w-12 h-12 rounded-xl object-cover border-2 mb-2" style={{borderColor:cardBg}}/>
                    <h3 className="font-bold text-sm" style={{color:textPrimary}}>{inf.name}</h3>
                    <p className="text-xs mb-1" style={{color:"#C9A84C"}}>{inf.category} · {inf.city||inf.location}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <Star size={11} fill="#F59E0B" style={{color:"#F59E0B"}}/>
                      <span className="text-xs font-bold" style={{color:"#F59E0B"}}>{inf.rating||0}</span>
                      <span className="text-xs" style={{color:textMuted}}>({inf.reviewCount||0})</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                      {[{l:"Followers",v:inf.instagram?.followers||inf.followers||"—"},{l:"Engagement",v:inf.instagram?.engagement||inf.engagement||"—"},{l:"Price from",v:inf.startingPrice?`₹${Number(inf.startingPrice).toLocaleString()}`:"—"}].map(s=>(
                        <div key={s.l} className="text-center py-1.5 rounded-lg" style={{background:"rgba(15,32,68,0.04)"}}>
                          <div className="text-[10px] font-bold" style={{color:textPrimary}}>{s.v}</div>
                          <div className="text-[9px]" style={{color:textMuted}}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <Link to={`/influencer/${inf.id}`} className="btn-primary w-full py-2 rounded-xl text-xs font-semibold text-white text-center block">View Profile →</Link>
                  </div>
                </motion.div>
              ))}
              {filtered.length===0&&<div className="col-span-3 text-center py-16 text-4xl">🔍<p className="text-sm mt-3" style={{color:textMuted}}>No influencers match your filters.</p></div>}
            </div>
          </div>
        )}

        {/* SAVED */}
        {tab==="saved"&&(
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myFavs.length===0&&<div className="col-span-3 text-center py-16 text-4xl">❤️<p className="text-sm mt-3" style={{color:textMuted}}>No saved influencers yet.</p></div>}
            {myFavs.map(inf=>(
              <div key={inf.id} className="p-5 rounded-2xl flex items-center gap-4" style={{background:cardBg,border:`1px solid ${border}`}}>
                <img src={inf.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(inf.name)}&background=7C3AED&color=fff`} alt={inf.name} className="w-12 h-12 rounded-xl object-cover"/>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm" style={{color:textPrimary}}>{inf.name}</h4>
                  <p className="text-xs" style={{color:textMuted}}>{inf.category} · {inf.city||inf.location}</p>
                </div>
                <Link to={`/influencer/${inf.id}`} className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold">View</Link>
              </div>
            ))}
          </div>
        )}

        {/* INQUIRIES */}
        {tab==="inquiries"&&(
          <div className="space-y-4">
            {myInquiries.length===0&&<div className="text-center py-16 text-4xl">📬<p className="text-sm mt-3" style={{color:textMuted}}>No inquiries sent yet.</p></div>}
            {myInquiries.slice().reverse().map((inq,i)=>(
              <div key={inq.id||i} className="p-5 rounded-2xl" style={{background:cardBg,border:`1px solid ${border}`}}>
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="font-bold text-sm" style={{color:textPrimary}}>To: {inq.influencerName}</h4>
                    <p className="text-xs mt-0.5" style={{color:textMuted}}>{inq.date} · {inq.collabType||"Campaign inquiry"}</p>
                    {inq.budget&&<p className="text-xs mt-1 font-semibold" style={{color:"#0F2044"}}>Budget: ₹{Number(inq.budget).toLocaleString()}</p>}
                    <p className="text-sm mt-2" style={{color:textMuted}}>{inq.message}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{background:inq.status==="replied"?"rgba(16,185,129,0.15)":"rgba(6,182,212,0.1)",color:inq.status==="replied"?"#10B981":"#2D4A7A"}}>{inq.status||"new"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ANALYTICS */}
        {tab==="analytics"&&(
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl" style={{background:cardBg,border:`1px solid ${border}`}}>
              <h3 className="font-bold mb-4" style={{color:textPrimary}}>Campaign Overview</h3>
              {[{label:"Inquiries Sent",val:myInquiries.length,color:"#0F2044"},{label:"Replies Received",val:myInquiries.filter(i=>i.status==="replied").length,color:"#10B981"},{label:"Influencers Saved",val:myFavs.length,color:"#C9A84C"},{label:"Avg Budget Sent",val:myInquiries.length?`₹${Math.round(myInquiries.reduce((s,i)=>s+(Number(i.budget)||0),0)/myInquiries.length).toLocaleString()}`:"—",color:"#F59E0B"}].map(s=>(
                <div key={s.label} className="flex justify-between items-center py-3" style={{borderBottom:`1px solid ${border}`}}>
                  <span className="text-sm" style={{color:textMuted}}>{s.label}</span>
                  <span className="font-black" style={{color:s.color}}>{s.val}</span>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl" style={{background:cardBg,border:`1px solid ${border}`}}>
              <h3 className="font-bold mb-4" style={{color:textPrimary}}>Top Categories in Saved</h3>
              {Object.entries(myFavs.reduce((acc,i)=>{acc[i.category]=(acc[i.category]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([cat,count])=>(
                <div key={cat} className="flex justify-between items-center py-2.5" style={{borderBottom:`1px solid ${border}`}}>
                  <span className="text-sm" style={{color:textMuted}}>{cat}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:"rgba(15,32,68,0.06)",color:"#C9A84C"}}>{count}</span>
                </div>
              ))}
              {myFavs.length===0&&<p className="text-xs" style={{color:textMuted}}>Save some influencers to see analytics.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
