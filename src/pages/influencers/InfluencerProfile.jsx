import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../context/data/MyState";
import { CheckCircle, Star, Heart, MapPin, Globe, Mail, Share2, ArrowLeft, Camera, X, ChevronLeft, ChevronRight, Film, Video, BarChart2 } from "lucide-react";
import { FaInstagram, FaYoutube, FaTiktok, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";

const IG_BTN = "linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)";
const IG_GRAD = "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)";
const BG      = "#000000";
const SURFACE = "#121212";
const CARD    = "#1C1C1C";
const BORDER  = "rgba(255,255,255,0.1)";
const BORDER_SOFT = "rgba(255,255,255,0.06)";
const TX      = "#FAFAFA";
const MT      = "#737373";
const MT2     = "#A8A8A8";
const INPUT_STYLE = { background:"#262626", border:"1px solid rgba(255,255,255,0.1)", color:TX };

function StarRating({ rating, size=14, interactive=false, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size}
          fill={i <= Math.round(rating) ? "#FFDC80" : "none"}
          style={{ color: i <= Math.round(rating) ? "#FFDC80" : "#3A3A3A", cursor: interactive ? "pointer" : "default" }}
          onClick={() => interactive && onChange && onChange(i)}/>
      ))}
    </div>
  );
}

function StatCard({ label, value, color="#DD2A7B" }) {
  return (
    <div className="p-4 rounded-2xl text-center" style={{ background:CARD, border:`1px solid ${BORDER_SOFT}` }}>
      <div className="text-xl font-black" style={{ color }}>{value || "—"}</div>
      <div className="text-xs mt-1" style={{ color:MT }}>{label}</div>
    </div>
  );
}

function DemoBar({ label, pct, color="#DD2A7B" }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1" style={{ color:MT2 }}>
        <span>{label}</span>
        <span className="font-bold">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background:"rgba(255,255,255,0.06)" }}>
        <motion.div className="h-1.5 rounded-full"
          initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.8, ease:"easeOut" }}
          style={{ background: color }}/>
      </div>
    </div>
  );
}

function Lightbox({ items, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + items.length) % items.length);
  const next = () => setIdx(i => (i + 1) % items.length);
  const item = items[idx];
  useEffect(() => {
    const fn = e => { if(e.key==="ArrowLeft")prev(); if(e.key==="ArrowRight")next(); if(e.key==="Escape")onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  });
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background:"rgba(0,0,0,0.96)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="relative max-w-3xl w-full mx-4">
        <button onClick={onClose} className="absolute -top-10 right-0 text-white opacity-70 hover:opacity-100"><X size={22}/></button>
        <button onClick={prev} className="absolute left-[-44px] top-1/2 -translate-y-1/2 text-white opacity-70 hover:opacity-100 hidden sm:block"><ChevronLeft size={28}/></button>
        <button onClick={next} className="absolute right-[-44px] top-1/2 -translate-y-1/2 text-white opacity-70 hover:opacity-100 hidden sm:block"><ChevronRight size={28}/></button>
        {item?.type==="youtube"
          ? <iframe src={item.url.replace("watch?v=","embed/")} className="w-full aspect-video rounded-2xl" allowFullScreen title={item.caption}/>
          : <img src={item.url} alt={item.caption} className="w-full rounded-2xl object-contain max-h-[80vh]"/>
        }
        {item?.caption && <p className="text-white text-center text-sm mt-3 opacity-70">{item.caption}</p>}
        <div className="flex justify-center gap-1.5 mt-4">
          {items.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)}
              className="w-2 h-2 rounded-full cursor-pointer transition-all"
              style={{ background: i === idx ? "#DD2A7B" : "rgba(255,255,255,0.25)" }}/>
          ))}
        </div>
      </div>
    </div>
  );
}



const COLLAB_TYPES = [
  { key:"reel",  label:"Instagram Reel",  field:"priceReel",  icon:<Film size={14}/>,     desc:"Short-form video (15–60 sec)" },
  { key:"story", label:"Instagram Story", field:"priceStory", icon:<Camera size={14}/>,   desc:"24-hour story with swipe-up" },
  { key:"post",  label:"Feed Post",       field:"pricePost",  icon:<BarChart2 size={14}/>, desc:"Permanent feed photo/carousel" },
  { key:"ugc",   label:"UGC Content",     field:"priceUGC",   icon:<Video size={14}/>,    desc:"Brand-owned usage rights" },
];

const PLATFORM_ROWS = [
  { key:"instagram", label:"Instagram", icon:<FaInstagram size={18}/>, color:"#DD2A7B", bg:"rgba(221,42,123,0.1)" },
  { key:"youtube",   label:"YouTube",   icon:<FaYoutube size={18}/>,   color:"#FF0000", bg:"rgba(255,0,0,0.08)" },
  { key:"tiktok",    label:"TikTok",    icon:<FaTiktok size={16}/>,    color:"#69C9D0", bg:"rgba(105,201,208,0.1)" },
  { key:"facebook",  label:"Facebook",  icon:<FaFacebook size={18}/>,  color:"#1877F2", bg:"rgba(24,119,242,0.1)" },
  { key:"twitter",   label:"Twitter",   icon:<FaTwitter size={18}/>,   color:"#1DA1F2", bg:"rgba(29,161,242,0.1)" },
];

/* ── Profile skeleton ── */
function ProfileSkeleton() {
  return (
    <div style={{ background:BG, minHeight:"100vh" }}>
      {/* Cover */}
      <div className="h-56 sm:h-72 shimmer" style={{ background:"#1C1C1C" }}/>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Avatar skeleton */}
            <div className="w-[138px] h-[138px] rounded-full shimmer flex-shrink-0" style={{ background:"#333" }}/>
            <div className="flex-1 pb-2 space-y-3">
              <div className="h-7 w-48 rounded-xl shimmer" style={{ background:"#333" }}/>
              <div className="h-4 w-32 rounded-xl shimmer" style={{ background:"#2a2a2a" }}/>
              <div className="h-4 w-40 rounded-xl shimmer" style={{ background:"#2a2a2a" }}/>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[0,1,2,3].map(i => (
            <div key={i} className="h-20 rounded-2xl shimmer" style={{ background:"#1C1C1C" }}/>
          ))}
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="h-10 w-24 rounded-xl shimmer" style={{ background:"#1C1C1C" }}/>
          ))}
        </div>
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-36 rounded-2xl shimmer" style={{ background:"#1C1C1C" }}/>
            <div className="h-48 rounded-2xl shimmer" style={{ background:"#1C1C1C" }}/>
          </div>
          <div className="h-64 rounded-2xl shimmer" style={{ background:"#1C1C1C" }}/>
        </div>
      </div>
    </div>
  );
}

export default function InfluencerProfile() {
  const { id } = useParams();
  const { influencers, influencersLoaded, reviews, submitInquiry, submitReview, loading, isFavorite, toggleFavorite, incrementProfileView } = useData();
  const [activeTab, setActiveTab] = useState("overview");
  const [showInquiry, setShowInquiry] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({ name:"", email:"", company:"", budget:"", collabType:"reel", message:"" });
  const [reviewForm, setReviewForm] = useState({ name:"", company:"", rating:5, text:"" });

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  useEffect(() => {
    if (id && influencersLoaded) incrementProfileView(id);
  }, [id, influencersLoaded]);

  const approved = influencers.filter(i => i.status === "approved");
  const inf = approved.find(i => i.id === id) || null;
  const infReviews = reviews.filter(r => r.influencerId === id);
  const isFav = isFavorite(id);

  // Show skeleton while Firestore hasn't responded yet
  if (!influencersLoaded) return <ProfileSkeleton />;

  // Show not found after Firestore loaded but influencer doesn't exist
  if (!inf) {
    return (
      <div style={{ background:BG, minHeight:"100vh" }} className="flex flex-col items-center justify-center gap-4 py-32">
        <div style={{ color:"#DD2A7B" }}><Search size={48} strokeWidth={1.5}/></div>
        <p className="font-semibold text-lg" style={{ color:"#FAFAFA" }}>Influencer not found</p>
        <p className="text-sm" style={{ color:MT }}>This profile may have been removed or is pending approval.</p>
        <Link to="/influencers" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold">Browse Influencers</Link>
      </div>
    );
  }

  const handleInquiry = async e => {
    e.preventDefault();
    if(!inquiryForm.name || !inquiryForm.email || !inquiryForm.message) return toast.warning("Please fill required fields.");
    const ok = await submitInquiry({ ...inquiryForm, influencerId:id, influencerName:inf.name });
    if(ok) { setInquiryForm({ name:"", email:"", company:"", budget:"", collabType:"reel", message:"" }); setShowInquiry(false); }
  };
  const handleReview = async e => {
    e.preventDefault();
    if(!reviewForm.name || !reviewForm.text) return toast.warning("Please fill all fields.");
    const ok = await submitReview({ ...reviewForm, influencerId:id, influencerName:inf.name });
    if(ok) setReviewForm({ name:"", company:"", rating:5, text:"" });
  };

  const TABS = [
    { id:"overview",  label:"Overview" },
    { id:"pricing",   label:"Pricing" },
    { id:"portfolio", label:"Portfolio" },
    { id:"audience",  label:"Audience" },
    { id:"reviews",   label:`Reviews (${infReviews.length})` },
  ];

  return (
    <div style={{ background:BG, minHeight:"100vh" }}>

      {/* Cover */}
      <div className="relative h-44 sm:h-56 lg:h-72"
        style={{ background: inf.cover ? `url(${inf.cover}) center/cover no-repeat` : IG_GRAD }}>
        <div className="absolute inset-0" style={{ background:"rgba(0,0,0,0.4)" }}/>
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
          <Link to="/influencers"
            className="flex items-center gap-1.5 text-white text-xs sm:text-sm px-3 py-1.5 rounded-xl"
            style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(10px)" }}>
            <ArrowLeft size={13}/> Back
          </Link>
        </div>
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2">
          <button onClick={() => toggleFavorite(id)} aria-label="Save"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(10px)", color: isFav ? "#ED4956" : "#fff" }}>
            <Heart size={15} fill={isFav ? "#ED4956" : "none"}/>
          </button>
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied!"); }}
            aria-label="Share"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white"
            style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(10px)" }}>
            <Share2 size={15}/>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8">

        {/* Profile Header */}
        <div className="relative -mt-12 sm:-mt-16 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">

            {/* Avatar with IG ring */}
            <div className="relative flex-shrink-0">
              <div className="ig-avatar-ring" style={{ width:96, height:96, padding:2.5 }}>
                <img
                  src={inf.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(inf.name)}&background=DD2A7B&color=fff&size=128`}
                  alt={inf.name}
                  style={{ width:91, height:91, objectFit:"cover", borderRadius:"50%", border:"2.5px solid #000" }}
                />
              </div>
              {inf.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: IG_BTN }}>
                  <CheckCircle size={14} className="text-white"/>
                </div>
              )}
            </div>

            {/* Name & meta */}
            <div className="flex-1 pb-1 sm:pb-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black" style={{ color:TX }}>{inf.name}</h1>
                {inf.verified && <span className="verified-badge shrink-0">✓ Verified</span>}
                {inf.featured && <span className="badge-purple shrink-0"><Star size={9} fill="#C77DFF" style={{color:"#C77DFF"}}/> Featured</span>}
              </div>
              {inf.instagram?.username && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FaInstagram size={13} style={{ color:"#DD2A7B" }}/>
                  <span className="text-xs sm:text-sm font-semibold" style={{ color:"#DD2A7B" }}>{inf.instagram.username}</span>
                  {inf.instagram.followers && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full hidden sm:inline"
                      style={{ background:"rgba(221,42,123,0.15)", color:"#F48FB1" }}>
                      {inf.instagram.followers} followers
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm mb-2" style={{ color:MT2 }}>
                {(inf.city || inf.location) && <span className="flex items-center gap-1"><MapPin size={12}/>{inf.city || inf.location}</span>}
                {inf.languages && <span className="flex items-center gap-1 hidden sm:flex"><Globe size={12}/>{Array.isArray(inf.languages) ? inf.languages.join(", ") : inf.languages}</span>}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(Array.isArray(inf.categories) ? inf.categories : [inf.category]).filter(Boolean).map(cat => (
                  <span key={cat} className="badge-purple text-[10px] sm:text-xs">{cat}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={inf.rating || 0}/>
                <span className="text-xs sm:text-sm font-bold" style={{ color:"#FFDC80" }}>{inf.rating || 0}</span>
                <span className="text-xs" style={{ color:MT }}>({inf.reviewCount || infReviews.length})</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2 pb-1 sm:pb-2 flex-wrap">
              {inf.whatsapp && (
                <a href={`https://wa.me/${inf.whatsapp}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white"
                  style={{ background:"#25D366" }}>
                  <FaWhatsapp size={14}/> <span className="hidden sm:inline">WhatsApp</span>
                </a>
              )}
              <button onClick={() => setShowInquiry(true)}
                className="btn-primary flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white">
                <Mail size={13}/> Contact
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <StatCard label="Instagram Followers" value={inf.instagram?.followers || inf.followers} color="#DD2A7B"/>
          <StatCard label="Engagement Rate" value={inf.instagram?.engagement || inf.engagement} color="#FAFAFA"/>
          <StatCard label="Campaigns Done" value={inf.completedCampaigns} color="#1DB954"/>
          <StatCard label="Rating" value={inf.rating ? `${inf.rating} ★` : "—"} color="#FFDC80"/>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-4 sm:mb-6 overflow-x-auto scrollbar-hide"
          style={{ background:SURFACE, border:`1px solid ${BORDER_SOFT}` }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap"
              style={{
                background: activeTab === t.id ? IG_BTN : "transparent",
                color: activeTab === t.id ? "#fff" : MT2,
                boxShadow: activeTab === t.id ? "0 4px 12px rgba(221,42,123,0.3)" : "none",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pb-20 sm:pb-16">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">

                <div className="p-4 sm:p-6 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER_SOFT}` }}>
                  <h3 className="font-bold mb-2 sm:mb-3" style={{ color:TX }}>About</h3>
                  <p className="text-sm leading-relaxed" style={{ color:MT2 }}>{inf.bio}</p>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER_SOFT}` }}>
                  <h3 className="font-bold mb-3 sm:mb-4" style={{ color:TX }}>Social Media Stats</h3>
                  <div className="space-y-3">
                    {PLATFORM_ROWS.filter(p => (inf.platforms || []).includes(p.key) || inf[p.key]).map(p => (
                      <div key={p.key} className="flex items-center justify-between p-3 rounded-xl flex-wrap gap-2"
                        style={{ background:p.bg }}>
                        <div className="flex items-center gap-3">
                          <span style={{ color:p.color }}>{p.icon}</span>
                          <span className="font-semibold text-sm" style={{ color:TX }}>{p.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs" style={{ color:MT2 }}>
                          {p.key==="instagram" && inf.instagram && <><span>{inf.instagram.followers} followers</span><span>{inf.instagram.engagement} engagement</span>{inf.instagram.avgReach && <span className="hidden sm:inline">{inf.instagram.avgReach} avg reach</span>}</>}
                          {p.key==="youtube"   && inf.youtube   && <><span>{inf.youtube.subscribers} subs</span><span>{inf.youtube.avgViews} avg views</span></>}
                          {p.key==="tiktok"    && inf.tiktok    && <><span>{inf.tiktok.followers} followers</span><span>{inf.tiktok.avgReach} avg reach</span></>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="p-4 sm:p-5 rounded-2xl lg:sticky lg:top-20" style={{ background:CARD, border:`1px solid ${BORDER_SOFT}` }}>
                  <h3 className="font-bold mb-3 sm:mb-4" style={{ color:TX }}>Collaboration Rates</h3>
                  <div className="space-y-2 mb-4 sm:mb-5">
                    {COLLAB_TYPES.map(ct => (
                      <div key={ct.key} className="flex justify-between items-center text-sm py-2.5 px-3 rounded-xl"
                        style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${BORDER_SOFT}` }}>
                        <div className="flex items-center gap-2" style={{ color:MT2 }}>
                          <span style={{ color:"#DD2A7B" }}>{ct.icon}</span>
                          <span className="text-xs sm:text-sm">{ct.label}</span>
                        </div>
                        <span className="font-bold text-xs sm:text-sm" style={{ color:TX }}>
                          {inf[ct.field] ? `₹${Number(inf[ct.field]).toLocaleString()}` : "Custom"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowInquiry(true)}
                    className="btn-primary w-full py-3 rounded-xl text-sm font-semibold text-white">
                    Get a Quote
                  </button>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {inf.whatsapp && (
                      <a href={`https://wa.me/${inf.whatsapp}`} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white"
                        style={{ background:"#25D366" }}>
                        <FaWhatsapp/> WhatsApp
                      </a>
                    )}
                    {inf.email && (
                      <a href={`mailto:${inf.email}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold"
                        style={{ background:"rgba(255,255,255,0.06)", color:TX, border:`1px solid ${BORDER}` }}>
                        <Mail size={12}/> Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PRICING ── */}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER_SOFT}` }}>
                <h3 className="font-bold mb-2" style={{ color:TX }}>Collaboration Pricing</h3>
                <p className="text-xs mb-5" style={{ color:MT }}>All prices are starting rates. Final pricing may vary based on campaign scope.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {COLLAB_TYPES.map((ct, i) => (
                    <motion.div key={ct.key} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
                      className="p-5 rounded-2xl flex items-center justify-between"
                      style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${BORDER_SOFT}` }}>
                      <div>
                        <div className="flex items-center gap-2 mb-1" style={{ color:TX }}>
                          <span style={{ color:"#DD2A7B" }}>{ct.icon}</span>
                          <span className="font-semibold text-sm">{ct.label}</span>
                        </div>
                        <p className="text-xs" style={{ color:MT }}>{ct.desc}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-lg gradient-text">
                          {inf[ct.field] ? `₹${Number(inf[ct.field]).toLocaleString()}` : "Custom"}
                        </div>
                        <button onClick={() => { setInquiryForm(p => ({...p, collabType:ct.key})); setShowInquiry(true); }}
                          className="text-xs font-semibold mt-1" style={{ color:"#DD2A7B" }}>
                          Book →
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="p-5 rounded-2xl" style={{ background:"rgba(221,42,123,0.06)", border:`1px solid rgba(221,42,123,0.15)` }}>
                <p className="text-xs text-center" style={{ color:MT2 }}>
                  <Zap size={11} style={{ display:"inline", color:"#DD2A7B", marginRight:4 }}/>
                  Need a custom package?{" "}
                  <button onClick={() => setShowInquiry(true)} className="font-semibold" style={{ color:"#DD2A7B" }}>
                    Send an inquiry
                  </button>{" "}
                  and we&apos;ll tailor a plan for you.
                </p>
              </div>
            </div>
          )}

          {/* ── PORTFOLIO ── */}
          {activeTab === "portfolio" && (
            <div>
              {(inf.portfolio || []).length === 0
                ? <div className="text-center py-16">
                    <Camera size={48} strokeWidth={1.2} style={{ color:"#DD2A7B", margin:"0 auto 12px" }}/>
                    <p className="text-sm" style={{ color:MT }}>No portfolio items yet.</p>
                  </div>
                : <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-1.5">
                    {(inf.portfolio || []).map((item, i) => (
                      <motion.div key={i} initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.05 }}
                        className="relative overflow-hidden group cursor-pointer aspect-square"
                        onClick={() => setLightbox({ items:inf.portfolio, startIndex:i })}>
                        <img src={item.url} alt={item.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center"
                          style={{ background:"rgba(0,0,0,0.6)" }}>
                          <span className="text-white text-sm font-semibold">View</span>
                          {item.caption && <span className="text-white text-xs mt-1 opacity-70 px-2 text-center line-clamp-2">{item.caption}</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* ── AUDIENCE ── */}
          {activeTab === "audience" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER_SOFT}` }}>
                <h3 className="font-bold mb-4" style={{ color:TX }}>Age Distribution</h3>
                {(inf.demographics?.ageGroups || [{label:"18–24",pct:38},{label:"25–34",pct:42},{label:"35–44",pct:14},{label:"45+",pct:6}]).map(a => (
                  <DemoBar key={a.label} label={a.label} pct={a.pct} color="linear-gradient(90deg,#F58529,#DD2A7B)"/>
                ))}
              </div>
              <div className="p-6 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER_SOFT}` }}>
                <h3 className="font-bold mb-4" style={{ color:TX }}>Gender Split</h3>
                {(inf.demographics?.genders || [{label:"Female",pct:72},{label:"Male",pct:28}]).map((g, i) => (
                  <DemoBar key={g.label} label={g.label} pct={g.pct} color={i===0 ? "#DD2A7B" : "#8134AF"}/>
                ))}
                <div className="flex gap-3 mt-4">
                  {(inf.demographics?.genders || [{label:"Female",pct:72},{label:"Male",pct:28}]).map((g, i) => (
                    <div key={g.label} className="flex-1 p-3 rounded-xl text-center"
                      style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${BORDER_SOFT}` }}>
                      <div className="font-black text-lg" style={{ color:i===0?"#DD2A7B":"#8134AF" }}>{g.pct}%</div>
                      <div className="text-xs" style={{ color:MT }}>{g.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER_SOFT}` }}>
                <h3 className="font-bold mb-4" style={{ color:TX }}>Top Cities</h3>
                <div className="flex flex-wrap gap-2">
                  {(inf.demographics?.topCities || ["Mumbai","Delhi","Bangalore","Pune","Hyderabad"]).map(city => (
                    <span key={city} className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
                      style={{ background:"rgba(221,42,123,0.1)", color:"#F48FB1", border:"1px solid rgba(221,42,123,0.2)" }}>
                      <MapPin size={10}/>{city}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER_SOFT}` }}>
                <h3 className="font-bold mb-4" style={{ color:TX }}>Top Countries</h3>
                <div className="flex flex-wrap gap-2">
                  {(inf.demographics?.topCountries || ["India","UAE","USA","UK"]).map(c => (
                    <span key={c} className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
                      style={{ background:"rgba(129,52,175,0.1)", color:"#C77DFF", border:"1px solid rgba(129,52,175,0.2)" }}>
                      <Globe size={10}/> {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {infReviews.length === 0 && (
                  <div className="text-center py-12">
                    <Star size={44} strokeWidth={1.2} style={{ color:"#FFDC80", margin:"0 auto 12px" }}/>
                    <p className="text-sm" style={{ color:MT }}>No reviews yet. Be the first!</p>
                  </div>
                )}
                {infReviews.map((r, i) => (
                  <motion.div key={r.id || i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                    className="p-5 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER_SOFT}` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                        style={{ background: IG_BTN }}>
                        {r.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color:TX }}>{r.name}</p>
                        <p className="text-xs" style={{ color:MT }}>{r.company && `${r.company} · `}{r.date}</p>
                      </div>
                      <StarRating rating={r.rating}/>
                    </div>
                    <p className="text-sm" style={{ color:MT2 }}>{r.text}</p>
                  </motion.div>
                ))}
              </div>

              {/* Review form */}
              <div>
                <form onSubmit={handleReview} className="p-5 rounded-2xl"
                  style={{ background:CARD, border:`1px solid ${BORDER_SOFT}` }}>
                  <h3 className="font-bold mb-4" style={{ color:TX }}>Write a Review</h3>
                  {[{name:"name",ph:"Your Name *",type:"text"},{name:"company",ph:"Company",type:"text"}].map(f => (
                    <input key={f.name} type={f.type} placeholder={f.ph} value={reviewForm[f.name]}
                      onChange={e => setReviewForm(p => ({...p, [f.name]:e.target.value}))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none mb-3 input-base" style={INPUT_STYLE}/>
                  ))}
                  <div className="mb-3">
                    <p className="text-xs mb-1.5" style={{ color:MT }}>Rating</p>
                    <StarRating rating={reviewForm.rating} size={22} interactive onChange={v => setReviewForm(p => ({...p, rating:v}))}/>
                  </div>
                  <textarea placeholder="Your review *" value={reviewForm.text}
                    onChange={e => setReviewForm(p => ({...p, text:e.target.value}))}
                    rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none mb-3 resize-none input-base" style={INPUT_STYLE}/>
                  <button type="submit" disabled={loading}
                    className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold text-white">
                    {loading ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Lightbox */}
      {lightbox && <Lightbox items={lightbox.items} startIndex={lightbox.startIndex} onClose={() => setLightbox(null)}/>}

      {/* Inquiry Modal */}
      {showInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)" }}>
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            className="w-full max-w-md rounded-2xl p-6 overflow-y-auto max-h-[90vh]"
            style={{ background:CARD, border:`1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color:TX }}>Contact {inf.name}</h3>
              <button onClick={() => setShowInquiry(false)} style={{ color:MT }}><X size={20}/></button>
            </div>
            <form onSubmit={handleInquiry} className="space-y-3">
              {[
                {name:"name",    ph:"Your Name *",             type:"text"},
                {name:"email",   ph:"Email *",                 type:"email"},
                {name:"company", ph:"Company Name",            type:"text"},
                {name:"budget",  ph:"Campaign Budget (₹)",     type:"number"},
              ].map(f => (
                <input key={f.name} type={f.type} placeholder={f.ph} value={inquiryForm[f.name]}
                  onChange={e => setInquiryForm(p => ({...p, [f.name]:e.target.value}))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none input-base" style={INPUT_STYLE}/>
              ))}
              <select value={inquiryForm.collabType}
                onChange={e => setInquiryForm(p => ({...p, collabType:e.target.value}))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none input-base" style={INPUT_STYLE}>
                {COLLAB_TYPES.map(ct => <option key={ct.key} value={ct.key}>{ct.label}</option>)}
                <option value="custom">Custom Package</option>
              </select>
              <textarea placeholder="Describe your campaign requirements *" value={inquiryForm.message}
                onChange={e => setInquiryForm(p => ({...p, message:e.target.value}))}
                rows={4} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none input-base" style={INPUT_STYLE}/>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowInquiry(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ border:`1px solid ${BORDER}`, color:MT2, background:"transparent" }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="btn-primary flex-1 py-3 rounded-xl text-sm font-semibold text-white">
                  {loading ? "Sending…" : "Send Inquiry"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
