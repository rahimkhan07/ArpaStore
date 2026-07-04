import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useData } from "../../context/data/MyState";
import { useAuth } from "../../components/protector/AuthContext";
import { toast } from "react-toastify";
import {
  Eye, MessageCircle, Star, TrendingUp, Edit3, Plus, X,
  CheckCircle, Upload, Mail, AlertTriangle, Image as ImageIcon,
} from "lucide-react";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import AvatarUpload from "../../components/upload/AvatarUpload";

const IG_BTN  = "linear-gradient(45deg,#F58529 0%,#DD2A7B 50%,#8134AF 100%)";
const BG      = "#000000";
const CARD    = "#1C1C1C";
const SURFACE = "#121212";
const BORDER  = "rgba(255,255,255,0.08)";
const TX      = "#FAFAFA";
const MT      = "#A8A8A8";
const INPUT   = { background:"#262626", border:"1px solid rgba(255,255,255,0.1)", color:TX };

const CATEGORIES = ["Fashion","Beauty","Technology","Gaming","Travel","Food","Fitness","Lifestyle","Education","Finance","Business","Entertainment","Health","Parenting"];
const PLATFORMS  = ["instagram","youtube","tiktok","facebook","twitter"];

export default function InfluencerDashboard() {
  const {
    influencers, addInfluencer, updateInfluencer,
    inquiries, updateInquiryStatus,
    addPortfolioItem, removePortfolioItem,
    loading,
  } = useData();
  const { user } = useAuth();

  const [tab, setTab] = useState("overview");
  const [form, setForm] = useState({
    name:"", username:"", bio:"", category:"", location:"", country:"India", city:"",
    languages:"", avatar:"", cover:"", startingPrice:"", email:"", whatsapp:"",
    platforms:[], instagram:{username:"",followers:"",engagement:""},
    youtube:{subscribers:"",avgViews:""}, tiktok:{followers:"",avgReach:""},
    services:[{name:"",price:""}],
    portfolio:[{url:"",caption:"",type:"image"}],
  });
  const [newPortItem, setNewPortItem] = useState({url:"",caption:"",type:"image"});

  const myProfile   = influencers.find(i => i.ownerEmail === user?.email);
  const myInquiries = inquiries.filter(i => i.influencerId === myProfile?.id);
  const myPortfolio = myProfile?.portfolio || [];

  useEffect(() => {
    if (myProfile) {
      setForm(p => ({
        ...p, ...myProfile,
        services:  myProfile.services  || [{name:"",price:""}],
        portfolio: myProfile.portfolio || [{url:"",caption:"",type:"image"}],
        instagram: myProfile.instagram || {username:"",followers:"",engagement:""},
        youtube:   myProfile.youtube   || {subscribers:"",avgViews:""},
        tiktok:    myProfile.tiktok    || {followers:"",avgReach:""},
        platforms: myProfile.platforms || [],
      }));
    }
  }, [myProfile]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.category) return toast.warning("Name and category are required.");
    const ok = myProfile
      ? await updateInfluencer(myProfile.id, { ...form, ownerEmail: user?.email })
      : await addInfluencer({ ...form, ownerEmail: user?.email });
    if (ok) setEditing(false);
  };

  const [editing, setEditing] = useState(false);
  const addService    = () => setForm(p => ({ ...p, services:[...p.services,{name:"",price:""}] }));
  const removeService = i  => setForm(p => ({ ...p, services:p.services.filter((_,idx)=>idx!==i) }));
  const updateService = (i,f,v) => setForm(p => ({ ...p, services:p.services.map((s,idx)=>idx===i?{...s,[f]:v}:s) }));
  const togglePlatform = pl => setForm(p => ({
    ...p, platforms: p.platforms.includes(pl) ? p.platforms.filter(x=>x!==pl) : [...p.platforms,pl]
  }));

  const cls = "w-full px-3 py-2.5 rounded-xl text-sm outline-none";

  const TABS = [
    { id:"overview",  label:"Overview" },
    { id:"profile",   label:"My Profile" },
    { id:"inquiries", label:`Inquiries (${myInquiries.length})` },
    { id:"pricing",   label:"Services" },
    { id:"portfolio", label:"Portfolio" },
  ];

  const statusColor = {
    approved: { bg:"rgba(29,185,84,0.12)", border:"rgba(29,185,84,0.3)", color:"#1DB954" },
    rejected:  { bg:"rgba(237,73,86,0.12)", border:"rgba(237,73,86,0.3)",  color:"#ED4956" },
    pending:   { bg:"rgba(255,220,128,0.1)", border:"rgba(255,220,128,0.3)", color:"#FFDC80" },
  }[myProfile?.status || "pending"];

  return (
    <div style={{ background:BG, minHeight:"100vh" }}>
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-24 sm:pb-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black" style={{ color:TX }}>Influencer Dashboard</h1>
            <p className="text-xs sm:text-sm mt-0.5" style={{ color:MT }}>Manage your profile, services, and inquiries</p>
          </div>
          <button onClick={() => { setTab("profile"); setEditing(true); }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white flex-shrink-0"
            style={{ background:IG_BTN }}>
            <Edit3 size={13}/> {myProfile ? "Edit" : "Create Profile"}
          </button>
        </div>

        {/* Status banner */}
        {myProfile && (
          <div className="mb-5 p-3 sm:p-4 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold"
            style={{ background:statusColor.bg, border:`1px solid ${statusColor.border}`, color:statusColor.color }}>
            <CheckCircle size={14}/>
            Status: {(myProfile.status||"pending").charAt(0).toUpperCase()+(myProfile.status||"pending").slice(1)}
            {myProfile.status==="pending" && " — Under review"}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-5 overflow-x-auto scrollbar-hide"
          style={{ background:SURFACE, border:`1px solid rgba(255,255,255,0.06)` }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap"
              style={{
                background: tab===t.id ? IG_BTN : "transparent",
                color: tab===t.id ? "#fff" : MT,
                boxShadow: tab===t.id ? "0 4px 12px rgba(221,42,123,0.3)" : "none",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon:<Eye size={18}/>,          label:"Profile Views", val:myProfile?.profileViews||0,           color:"#DD2A7B" },
                { icon:<MessageCircle size={18}/>, label:"Inquiries",     val:myInquiries.length,                   color:"#F58529" },
                { icon:<Star size={18}/>,          label:"Rating",        val:myProfile?.rating||"—",               color:"#FFDC80" },
                { icon:<TrendingUp size={18}/>,    label:"Campaigns",     val:myProfile?.completedCampaigns||0,     color:"#1DB954" },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER}` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5"
                    style={{ background:`${s.color}20`, color:s.color }}>
                    {s.icon}
                  </div>
                  <div className="text-xl font-black" style={{ color:s.color }}>{s.val}</div>
                  <div className="text-[11px] mt-0.5" style={{ color:MT }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { name:"Free",    price:"₹0",      period:"Forever",   features:["Basic Profile","Limited Portfolio","Standard Listing"],                                        color:"#A8A8A8", popular:false },
                { name:"Premium", price:"₹999",    period:"per month", features:["Verified Badge","Featured Placement","Unlimited Portfolio","Priority Support","Analytics"],    color:"#DD2A7B", popular:true  },
                { name:"Agency",  price:"₹2,999",  period:"per month", features:["Multiple Profiles","Advanced Analytics","Campaign Management","Dedicated Support"],            color:"#8134AF", popular:false },
              ].map(plan => (
                <div key={plan.name} className="p-5 rounded-2xl relative"
                  style={{ background:CARD, border:`2px solid ${plan.popular?plan.color:BORDER}` }}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black text-white whitespace-nowrap"
                      style={{ background:IG_BTN }}>
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-bold text-sm mb-1" style={{ color:TX }}>{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-xl font-black" style={{ color:plan.color }}>{plan.price}</span>
                    <span className="text-[10px] mb-0.5" style={{ color:MT }}>/{plan.period}</span>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-1.5 text-xs" style={{ color:MT }}>
                        <CheckCircle size={11} style={{ color:plan.color, flexShrink:0 }}/>{f}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background:plan.popular?IG_BTN:"transparent", color:plan.popular?"#fff":plan.color, border:`1px solid ${plan.color}` }}>
                    {plan.popular?"Upgrade Now":"Get Started"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab === "profile" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER}` }}>
              <h3 className="font-bold text-sm mb-4" style={{ color:TX }}>Basic Information</h3>
              <div className="flex justify-center mb-5">
                <AvatarUpload
                  value={form.avatar||""} onChange={url=>setForm(p=>({...p,avatar:url}))}
                  dark={true} name={form.name} storagePath={`avatars/${user?.uid||"user"}`}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {name:"name",ph:"Full Name *"},{name:"username",ph:"@handle"},
                  {name:"email",ph:"Email"},{name:"whatsapp",ph:"WhatsApp"},
                  {name:"location",ph:"Location"},{name:"city",ph:"City"},
                ].map(f => (
                  <input key={f.name} placeholder={f.ph} value={form[f.name]||""}
                    onChange={e=>setForm(p=>({...p,[f.name]:e.target.value}))}
                    className={cls} style={INPUT}/>
                ))}
                <select value={form.category||""} onChange={e=>setForm(p=>({...p,category:e.target.value}))}
                  className={cls} style={INPUT}>
                  <option value="">Select Category *</option>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Starting Price (₹)" type="number" value={form.startingPrice||""}
                  onChange={e=>setForm(p=>({...p,startingPrice:e.target.value}))} className={cls} style={INPUT}/>
                <input placeholder="Languages (comma separated)" value={form.languages||""}
                  onChange={e=>setForm(p=>({...p,languages:e.target.value}))}
                  className={`${cls} sm:col-span-2`} style={INPUT}/>
              </div>
              <textarea placeholder="Bio / About You" value={form.bio||""}
                onChange={e=>setForm(p=>({...p,bio:e.target.value}))}
                rows={3} className={`${cls} mt-3 resize-none`} style={INPUT}/>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER}` }}>
              <h3 className="font-bold text-sm mb-3" style={{ color:TX }}>Platforms</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {PLATFORMS.map(p => (
                  <button key={p} type="button" onClick={()=>togglePlatform(p)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
                    style={{
                      background: form.platforms.includes(p) ? IG_BTN : "rgba(255,255,255,0.06)",
                      color: form.platforms.includes(p) ? "#fff" : MT,
                      border: `1px solid ${BORDER}`,
                    }}>
                    {p}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color:"#DD2A7B" }}><FaInstagram className="inline mr-1"/>Instagram</p>
                  {[{f:"username",ph:"@username"},{f:"followers",ph:"Followers"},{f:"engagement",ph:"Engagement %"}].map(x=>(
                    <input key={x.f} placeholder={x.ph} value={form.instagram?.[x.f]||""}
                      onChange={e=>setForm(p=>({...p,instagram:{...p.instagram,[x.f]:e.target.value}}))}
                      className={`${cls} mb-2`} style={INPUT}/>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color:"#FF0000" }}><FaYoutube className="inline mr-1"/>YouTube</p>
                  {[{f:"subscribers",ph:"Subscribers"},{f:"avgViews",ph:"Avg Views"}].map(x=>(
                    <input key={x.f} placeholder={x.ph} value={form.youtube?.[x.f]||""}
                      onChange={e=>setForm(p=>({...p,youtube:{...p.youtube,[x.f]:e.target.value}}))}
                      className={`${cls} mb-2`} style={INPUT}/>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color:"#69C9D0" }}><FaTiktok className="inline mr-1"/>TikTok</p>
                  {[{f:"followers",ph:"Followers"},{f:"avgReach",ph:"Avg Reach"}].map(x=>(
                    <input key={x.f} placeholder={x.ph} value={form.tiktok?.[x.f]||""}
                      onChange={e=>setForm(p=>({...p,tiktok:{...p.tiktok,[x.f]:e.target.value}}))}
                      className={`${cls} mb-2`} style={INPUT}/>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background:IG_BTN, opacity:loading?0.7:1 }}>
              {loading?"Saving…": myProfile?"Update Profile":"Submit for Review"}
            </button>
          </form>
        )}

        {/* ── INQUIRIES ── */}
        {tab === "inquiries" && (
          <div className="space-y-3">
            {myInquiries.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center gap-3">
                <Mail size={44} strokeWidth={1.2} style={{ color:"#DD2A7B" }}/>
                <p className="text-sm" style={{ color:MT }}>No inquiries yet</p>
              </div>
            ) : myInquiries.slice().reverse().map((inq,i) => (
              <div key={inq.id||i} className="p-4 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER}` }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-bold text-sm" style={{ color:TX }}>{inq.name}</h4>
                      {inq.company && <span className="text-xs" style={{ color:MT }}>— {inq.company}</span>}
                      <span className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: inq.status==="replied"?"rgba(29,185,84,0.15)":"rgba(245,133,41,0.12)",
                          color: inq.status==="replied"?"#1DB954":"#F58529",
                        }}>
                        {inq.status||"new"}
                      </span>
                    </div>
                    <p className="text-xs mb-1.5 flex items-center gap-1" style={{ color:MT }}>
                      <Mail size={10}/> {inq.email} · {inq.date}
                    </p>
                    {inq.budget && (
                      <p className="text-xs mb-1.5 font-semibold flex items-center gap-1" style={{ color:"#FFDC80" }}>
                        Budget: ₹{Number(inq.budget).toLocaleString()}
                      </p>
                    )}
                    <p className="text-xs leading-relaxed" style={{ color:MT }}>{inq.message}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <select value={inq.status||"new"} onChange={e=>updateInquiryStatus(inq.id,e.target.value)}
                      className="px-2 py-1.5 rounded-lg text-xs outline-none" style={INPUT}>
                      {["new","read","replied","closed"].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    {inq.email && (
                      <a href={`mailto:${inq.email}?subject=Re: Your Inquiry`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-center"
                        style={{ background:"rgba(221,42,123,0.12)", color:"#DD2A7B" }}>
                        Reply
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SERVICES ── */}
        {tab === "pricing" && (
          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-5 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm" style={{ color:TX }}>My Services & Pricing</h3>
                <button type="button" onClick={addService}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background:IG_BTN }}>
                  <Plus size={12}/> Add
                </button>
              </div>
              {form.services.map((s,i) => (
                <div key={i} className="flex gap-2 mb-2.5 items-center">
                  <input placeholder="Service name" value={s.name}
                    onChange={e=>updateService(i,"name",e.target.value)}
                    className={`${cls} flex-1`} style={INPUT}/>
                  <input placeholder="Price ₹" type="number" value={s.price}
                    onChange={e=>updateService(i,"price",e.target.value)}
                    className={`${cls} w-28`} style={INPUT}/>
                  <button type="button" onClick={()=>removeService(i)} style={{ color:"#ED4956", flexShrink:0 }}>
                    <X size={15}/>
                  </button>
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background:IG_BTN, opacity:loading?0.7:1 }}>
                {loading?"Saving…":"Save Services"}
              </button>
            </div>
          </form>
        )}

        {/* ── PORTFOLIO ── */}
        {tab === "portfolio" && (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl" style={{ background:CARD, border:`1px solid ${BORDER}` }}>
              <h3 className="font-bold text-sm mb-3" style={{ color:TX }}>Add Portfolio Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input placeholder="Image / Video URL *" value={newPortItem.url}
                  onChange={e=>setNewPortItem(p=>({...p,url:e.target.value}))}
                  className={`${cls} sm:col-span-2`} style={INPUT}/>
                <select value={newPortItem.type}
                  onChange={e=>setNewPortItem(p=>({...p,type:e.target.value}))}
                  className={cls} style={INPUT}>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="youtube">YouTube</option>
                  <option value="reel">Reel</option>
                </select>
                <input placeholder="Caption / Brand Name" value={newPortItem.caption}
                  onChange={e=>setNewPortItem(p=>({...p,caption:e.target.value}))}
                  className={`${cls} sm:col-span-2`} style={INPUT}/>
                <button type="button" disabled={loading||!myProfile}
                  onClick={async()=>{
                    if(!myProfile) return toast.warning("Create your profile first.");
                    const ok=await addPortfolioItem(myProfile.id,newPortItem,myPortfolio);
                    if(ok) setNewPortItem({url:"",caption:"",type:"image"});
                  }}
                  className="py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background:IG_BTN, opacity:loading?0.7:1 }}>
                  <Upload size={13}/> Add
                </button>
              </div>
              {!myProfile && (
                <p className="text-xs mt-2 flex items-center gap-1.5" style={{ color:"#FFDC80" }}>
                  <AlertTriangle size={11}/> Create your profile first before adding portfolio items.
                </p>
              )}
            </div>

            {myPortfolio.length === 0 ? (
              <div className="text-center py-14 flex flex-col items-center gap-3">
                <ImageIcon size={44} strokeWidth={1.2} style={{ color:"#DD2A7B" }}/>
                <p className="text-sm" style={{ color:MT }}>No portfolio items yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {myPortfolio.map((item,i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ background:CARD, border:`1px solid ${BORDER}` }}>
                    <div className="relative aspect-video" style={{ background:"#111" }}>
                      {item.type==="youtube"
                        ? <iframe src={item.url.replace("watch?v=","embed/")} className="w-full h-full" allowFullScreen title={item.caption}/>
                        : <img src={item.url} alt={item.caption} className="w-full h-full object-cover"/>
                      }
                      <button onClick={()=>myProfile&&removePortfolioItem(myProfile.id,i,myPortfolio)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background:"rgba(237,73,86,0.85)", color:"#fff" }}>
                        <X size={11}/>
                      </button>
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold capitalize"
                        style={{ background:"rgba(0,0,0,0.6)", color:"#FAFAFA" }}>
                        {item.type}
                      </span>
                    </div>
                    {item.caption && (
                      <div className="px-2.5 py-2">
                        <p className="text-[11px] font-medium truncate" style={{ color:TX }}>{item.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
