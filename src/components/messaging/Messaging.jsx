import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, onSnapshot, query, orderBy, where, Timestamp, doc, updateDoc } from "firebase/firestore";
import { firebaseDB } from "../../firebase/FirebaseConfig";
import { useAuth } from "../protector/AuthContext";
import { useData } from "../../context/data/MyState";
import { Send, X, MessageCircle, ChevronDown } from "lucide-react";

export default function Messaging({ recipientId, recipientName, recipientAvatar, onClose }) {
  const { user } = useAuth();
  const { mode } = useData();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(true);
  const bottomRef = useRef(null);

  const cardBg  = "#fff";
  const border  = "rgba(15,32,68,0.08)";
  const textPri = "#0F2044";
  const textMut = "#5A6882";
  const inputBg = "rgba(15,32,68,0.03)";

  // Stable chat room id – always same for the two participants
  const roomId = [user?.uid, recipientId].sort().join("_");

  useEffect(() => {
    if (!user || !recipientId) return;
    const q = query(
      collection(firebaseDB, "messages"),
      where("roomId", "==", roomId),
      orderBy("time", "asc")
    );
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      // mark received messages as read
      snap.docs.forEach(d => {
        if (d.data().to === user.uid && !d.data().read) {
          updateDoc(doc(firebaseDB, "messages", d.id), { read: true });
        }
      });
    });
    return unsub;
  }, [user, recipientId, roomId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!text.trim() || !user) return;
    await addDoc(collection(firebaseDB, "messages"), {
      roomId, from: user.uid, to: recipientId,
      fromName: user.displayName || user.email,
      text: text.trim(), read: false,
      time: Timestamp.now(),
    });
    setText("");
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96" style={{ fontFamily: "inherit" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 rounded-t-2xl cursor-pointer"
        style={{ background: "linear-gradient(135deg,#0F2044,#C9A84C)" }}
        onClick={() => setOpen(p => !p)}>
        <div className="flex items-center gap-2.5">
          {recipientAvatar
            ? <img src={recipientAvatar} alt={recipientName} className="w-8 h-8 rounded-full object-cover"/>
            : <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 text-white text-sm font-bold">{recipientName?.[0]}</div>}
          <div>
            <p className="text-white text-sm font-semibold leading-tight">{recipientName}</p>
            <p className="text-white/70 text-[10px]">Real-time chat</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ChevronDown size={16} className="text-white/80" style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.2s" }}/>
          {onClose && <button onClick={e => { e.stopPropagation(); onClose(); }} className="text-white/80 hover:text-white"><X size={16}/></button>}
        </div>
      </div>

      {/* Body */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden rounded-b-2xl" style={{ background: cardBg, border: `1px solid ${border}`, borderTop: "none" }}>
            {/* Messages */}
            <div className="h-72 overflow-y-auto p-3 space-y-2 scrollbar-hide">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full">
                  <MessageCircle size={28} style={{ color: textMut }} className="mb-2 opacity-40"/>
                  <p className="text-xs" style={{ color: textMut }}>No messages yet. Say hi! 👋</p>
                </div>
              )}
              {messages.map(m => {
                const isMine = m.from === user.uid;
                return (
                  <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed"
                      style={{
                        background: isMine ? "linear-gradient(135deg,#0F2044,#C9A84C)" : ("rgba(124,58,237,0.07)"),
                        color: isMine ? "#fff" : textPri,
                        borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      }}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}/>
            </div>
            {/* Input */}
            <div className="flex items-center gap-2 p-3" style={{ borderTop: `1px solid ${border}` }}>
              <input
                type="text" placeholder="Type a message…" value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
                style={{ background: inputBg, border: `1px solid ${border}`, color: textPri }}
              />
              <button onClick={send} disabled={!text.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 transition-opacity"
                style={{ background: "linear-gradient(135deg,#0F2044,#C9A84C)", opacity: text.trim() ? 1 : 0.5 }}>
                <Send size={13}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
