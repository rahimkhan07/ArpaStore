import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, firebaseDB } from "../../firebase/FirebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useData } from "../../context/data/MyState";
import Loader from "../../components/loader/Loader";
import { MdEmail, MdLock } from "react-icons/md";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const IG_BTN = "linear-gradient(135deg, #E91E8C 0%, #9C27B0 100%)";

export default function Login() {
  const navigate = useNavigate();
  const { loading, setLoading } = useData();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email.trim())    return toast.warning("Please enter your email.");
    if (!form.password.trim()) return toast.warning("Please enter your password.");
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, form.email, form.password);
      localStorage.setItem("user", JSON.stringify(result));
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const c = err.code;
      if (c === "auth/user-not-found" || c === "auth/wrong-password" || c === "auth/invalid-credential")
        toast.error("Invalid email or password.");
      else if (c === "auth/too-many-requests")
        toast.error("Too many attempts. Try again later.");
      else
        toast.error("Login failed. Please try again.");
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem("user", JSON.stringify(result));
      const q = query(collection(firebaseDB, "users"), where("uid", "==", result.user.uid));
      const snap = await getDocs(q);
      if (snap.empty) {
        await addDoc(collection(firebaseDB, "users"), {
          name: result.user.displayName, uid: result.user.uid,
          email: result.user.email, role: "brand",
          avatar: result.user.photoURL, signedupAt: new Date().toISOString(),
        });
      }
      toast.success("Welcome, " + result.user.displayName + "!");
      navigate("/");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") toast.error("Google sign-in failed.");
    } finally { setLoading(false); }
  }

  return (
    <>
      {loading && <Loader />}

      {/* Full-screen dark background with IG radial glows */}
      <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
        style={{ background: "#000000" }}>

        {/* Background glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position:"absolute", top:"15%", left:"10%", width:320, height:320,
            borderRadius:"50%", background:"rgba(245,133,41,0.08)", filter:"blur(80px)" }}/>
          <div style={{ position:"absolute", bottom:"15%", right:"10%", width:280, height:280,
            borderRadius:"50%", background:"rgba(129,52,175,0.12)", filter:"blur(80px)" }}/>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            width:400, height:400, borderRadius:"50%",
            background:"rgba(221,42,123,0.06)", filter:"blur(100px)" }}/>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative w-full max-w-sm"
        >
          {/* Card */}
          <div className="rounded-3xl overflow-hidden"
            style={{ background:"#1C1C1C", border:"1px solid rgba(255,255,255,0.1)",
              boxShadow:"0 24px 64px rgba(0,0,0,0.7)" }}>

            {/* IG gradient top bar */}
            <div className="h-[3px] w-full" style={{ background: IG_BTN }}/>

            <div className="p-8">
              {/* Logo */}
              <div className="flex flex-col items-center mb-8">
                <div className="mb-4 text-5xl">🎀</div>
                <h1 className="text-2xl font-black tracking-tight" style={{ color:"#FAFAFA" }}>ArpaStore</h1>
                <p className="text-sm mt-1" style={{ color:"#737373" }}>Sign in to your account</p>
              </div>

              {/* Google */}
              <button onClick={handleGoogle} type="button"
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold mb-5 transition-all hover:scale-[1.02] active:scale-95"
                style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#FAFAFA" }}>
                <FcGoogle size={20}/> Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.1)" }}/>
                <span className="text-xs" style={{ color:"#737373" }}>or</span>
                <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.1)" }}/>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Email */}
                <div>
                  <div className="relative">
                    <MdEmail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color:"#737373" }}/>
                    <input type="email" name="email" placeholder="Email" value={form.email}
                      onChange={handleChange} autoComplete="email"
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background:"#262626", border:"1px solid rgba(255,255,255,0.1)",
                        color:"#FAFAFA" }}
                      onFocus={e => e.target.style.borderColor = "#DD2A7B"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <MdLock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color:"#737373" }}/>
                    <input type={showPw ? "text" : "password"} name="password"
                      placeholder="Password" value={form.password}
                      onChange={handleChange} autoComplete="current-password"
                      className="w-full pl-9 pr-11 py-3 rounded-xl text-sm outline-none"
                      style={{ background:"#262626", border:"1px solid rgba(255,255,255,0.1)",
                        color:"#FAFAFA" }}
                      onFocus={e => e.target.style.borderColor = "#DD2A7B"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color:"#737373" }}>
                      {showPw ? <HiEyeOff size={17}/> : <HiEye size={17}/>}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 mt-1"
                  style={{ background: IG_BTN, opacity: loading ? 0.7 : 1,
                    boxShadow:"0 4px 16px rgba(221,42,123,0.35)" }}>
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm mt-6" style={{ color:"#737373" }}>
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="font-bold" style={{ color:"#DD2A7B" }}>
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* App store strip */}
          <p className="text-center text-xs mt-6" style={{ color:"#737373" }}>
            By continuing you agree to our{" "}
            <span className="font-semibold" style={{ color:"#A8A8A8" }}>Terms</span>{" "}
            and{" "}
            <span className="font-semibold" style={{ color:"#A8A8A8" }}>Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </>
  );
}
