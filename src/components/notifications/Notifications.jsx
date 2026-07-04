import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, query, where, orderBy, updateDoc, doc, Timestamp, addDoc } from "firebase/firestore";
import { firebaseDB } from "../../firebase/FirebaseConfig";
import { useAuth } from "../protector/AuthContext";
import { useData } from "../../context/data/MyState";
import { Bell, X, Check, CheckCheck } from "lucide-react";

// Call this helper from anywhere to push a notification
export async function pushNotification({ toUid, title, body, link = "/" }) {
  if (!toUid) return;
  await addDoc(collection(firebaseDB, "notifications"), {
    toUid, title, body, link, read: false,
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
  });
}

export default function Notifications() {
  const { user } = useAuth();
  const { mode } = useData();
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const cardBg = "#fff";
  const border = "rgba(15,32,68,0.08)";
  const textPri = "#0F2044";
  const textMut = "#5A6882";

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(firebaseDB, "notifications"),
      where("toUid", "==", user.uid),
      orderBy("time", "desc")
    );
    return onSnapshot(q, snap => setNotifs(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [user]);

  // close on outside click
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const unread = notifs.filter(n => !n.read).length;

  const markRead = async id => {
    await updateDoc(doc(firebaseDB, "notifications", id), { read: true });
  };

  const markAll = async () => {
    notifs.filter(n => !n.read).forEach(n => markRead(n.id));
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(p => !p)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center btn-ghost"
        style={{ color: "#0F2044" }} aria-label="Notifications">
        <Bell size={17} strokeWidth={2}/>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg,#0F2044,#C9A84C)" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden z-50 shadow-2xl"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${border}` }}>
              <p className="font-bold text-sm" style={{ color: textPri }}>Notifications {unread > 0 && <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(15,32,68,0.08)", color: "#C9A84C" }}>{unread} new</span>}</p>
              {unread > 0 && (
                <button onClick={markAll} className="flex items-center gap-1 text-xs font-medium" style={{ color: "#C9A84C" }}>
                  <CheckCheck size={13}/> Mark all read
                </button>
              )}
            </div>
            {/* List */}
            <div className="max-h-80 overflow-y-auto scrollbar-hide">
              {notifs.length === 0 && (
                <div className="py-10 text-center">
                  <Bell size={28} className="mx-auto mb-2 opacity-30" style={{ color: textMut }}/>
                  <p className="text-xs" style={{ color: textMut }}>No notifications yet</p>
                </div>
              )}
              {notifs.map(n => (
                <div key={n.id} onClick={() => markRead(n.id)}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
                  style={{ background: n.read ? "transparent" : ("rgba(15,32,68,0.03)"), borderBottom: `1px solid ${border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(15,32,68,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : ("rgba(15,32,68,0.03)")}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: n.read ? ("rgba(15,32,68,0.05)") : "linear-gradient(135deg,#0F2044,#C9A84C)" }}>
                    <Bell size={13} className="text-white"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: textPri }}>{n.title}</p>
                    <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: textMut }}>{n.body}</p>
                    <p className="text-[10px] mt-1" style={{ color: "#C9A84C" }}>{n.date}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#0F2044" }}/>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
