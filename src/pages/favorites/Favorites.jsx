import { Link } from "react-router-dom";
import { useData } from "../../context/data/MyState";
import { Heart, ArrowRight, MapPin, Users, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

const IG_BTN = "linear-gradient(45deg,#F58529 0%,#DD2A7B 50%,#8134AF 100%)";

export default function Favorites() {
  const { influencers, favorites, toggleFavorite } = useData();

  const approved = influencers.filter(i => i.status === "approved");
  const favInfluencers = approved.filter(i => favorites.includes(i.id));

  return (
    <div style={{ background:"#000", minHeight:"100vh" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 sm:pb-12">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: IG_BTN }}>
            <Heart size={18} className="text-white" fill="white"/>
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color:"#FAFAFA" }}>Saved Influencers</h1>
            <p className="text-sm" style={{ color:"#737373" }}>{favInfluencers.length} saved</p>
          </div>
        </div>

        {/* Empty state */}
        {favInfluencers.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <Heart size={64} strokeWidth={1.2} style={{ color:"#DD2A7B" }}/>
            <h3 className="text-lg font-bold" style={{ color:"#FAFAFA" }}>No saved influencers yet</h3>
            <p className="text-sm" style={{ color:"#737373" }}>Browse influencers and tap the heart icon to save them.</p>
            <Link to="/influencers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white mt-2"
              style={{ background: IG_BTN }}>
              Find Influencers <ArrowRight size={14}/>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {favInfluencers.map((inf, i) => (
              <motion.div key={inf.id}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                className="rounded-2xl overflow-hidden"
                style={{ background:"#1C1C1C", border:"1px solid rgba(255,255,255,0.08)" }}>

                {/* Cover */}
                <div className="h-16 relative" style={{ background:"linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)" }}>
                  <button onClick={() => toggleFavorite(inf.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background:"rgba(0,0,0,0.4)" }}>
                    <Heart size={13} fill="#ED4956" style={{ color:"#ED4956" }}/>
                  </button>
                </div>

                <div className="px-4 pb-4">
                  {/* Avatar */}
                  <div className="flex items-end justify-between -mt-5 mb-2.5">
                    <div style={{ padding:2, borderRadius:"50%", background:IG_BTN, flexShrink:0 }}>
                      <img src={inf.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(inf.name)}&background=DD2A7B&color=fff&size=80`}
                        alt={inf.name}
                        style={{ width:42, height:42, borderRadius:"50%", objectFit:"cover", border:"2px solid #1C1C1C", display:"block" }}
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(inf.name)}&background=DD2A7B&color=fff&size=80`; }}
                      />
                    </div>
                    {inf.rating > 0 && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background:"rgba(255,220,128,0.1)", color:"#FFDC80" }}>
                        ★ {inf.rating}
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-sm truncate mb-0.5" style={{ color:"#FAFAFA" }}>{inf.name}</h3>
                  {inf.category && (
                    <p className="text-xs font-semibold mb-0.5"
                      style={{ background:"linear-gradient(45deg,#F58529,#DD2A7B)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                      {inf.category}
                    </p>
                  )}
                  {(inf.city || inf.location) && (
                    <p className="text-[11px] flex items-center gap-1 mb-3" style={{ color:"#737373" }}>
                      <MapPin size={9}/>{inf.city || inf.location}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="p-2 rounded-xl text-center"
                      style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.07)" }}>
                      <div className="font-bold" style={{ color:"#FAFAFA" }}>{inf.instagram?.followers || inf.followers || "—"}</div>
                      <div style={{ color:"#737373" }}>Followers</div>
                    </div>
                    <div className="p-2 rounded-xl text-center"
                      style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.07)" }}>
                      <div className="font-bold" style={{ color:"#FAFAFA" }}>{inf.instagram?.engagement || inf.engagement || "—"}</div>
                      <div style={{ color:"#737373" }}>Engagement</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black" style={{ color:"#FAFAFA" }}>
                      {inf.startingPrice ? `₹${Number(inf.startingPrice).toLocaleString()}` : "Custom"}
                    </span>
                    <Link to={`/influencer/${inf.id}`}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold text-white"
                      style={{ background: IG_BTN }}>
                      View Profile
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
