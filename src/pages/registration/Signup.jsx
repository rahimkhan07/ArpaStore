import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, firebaseDB } from "../../firebase/FirebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useData } from "../../context/data/MyState";
import Loader from "../../components/loader/Loader";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const GRAD = "linear-gradient(135deg, #E91E8C 0%, #9C27B0 100%)";

export default function Signup() {
  const navigate = useNavigate();
  const { loading, setLoading } = useData();
  const [form, setForm]   = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim())        return toast.warning("Please enter your name.");
    if (!form.email.trim())       return toast.warning("Please enter your email.");
    if (form.password.length < 6) return toast.warning("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await addDoc(collection(firebaseDB, "users"), {
        name: form.name,
        uid:  res.user.uid,
        email: res.user.email,
        role: "customer",
        signedupAt: new Date().toISOString(),
      });
      toast.success("Account created! Please sign in 🎀");
      navigate("/login");
    } catch (err) {
      const c = err.code;
      if (c === "auth/email-already-in-use") toast.error("Email already registered.");
      else if (c === "auth/invalid-email")   toast.error("Invalid email address.");
      else                                   toast.error("Registration failed. Please try again.");
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
          name: result.user.displayName,
          uid:  result.user.uid,
          email: result.user.email,
          role: "customer",
          avatar: result.user.photoURL,
          signedupAt: new Date().toISOString(),
        });
      }
      toast.success("Welcome, " + result.user.displayName + "! 🎀");
      navigate("/");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") toast.error("Google sign-up failed.");
    } finally { setLoading(false); }
  }

  const inputSt = {
    background: "#262626",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#FAFAFA",
  };
  const onFocus = e => (e.target.style.borderColor = "#E91E8C");
  const onBlur  = e => (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
        style={{ background: "#1a0a14" }}>

        {/* Glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position:"absolute", top:"10%", right:"10%", width:300, height:300,
            borderRadius:"50%", background:"rgba(233,30,140,0.1)", filter:"blur(80px)" }}/>
          <div style={{ position:"absolute", bottom:"10%", left:"10%", width:280, height:280,
            borderRadius:"50%", background:"rgba(156,39,176,0.12)", filter:"blur(80px)" }}/>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative w-full max-w-sm"
        >
          <div className="rounded-3xl overflow-hidden"
            style={{ background:"#2d1a26", border:"1px solid rgba(233,30,140,0.2)",
              boxShadow:"0 24px 64px rgba(233,30,140,0.15)" }}>

            {/* Top gradient bar */}
            <div className="h-1 w-full" style={{ background: GRAD }}/>

            <div className="p-8">
              {/* Logo */}
              <div className="flex flex-col items-center mb-7">
                <div className="text-5xl mb-3">🎀</div>
                <h1 className="text-2xl font-black" style={{ color:"#FAFAFA" }}>Join ArpaStore</h1>
                <p className="text-sm mt-1" style={{ color:"#c0a0b0" }}>Create your free account</p>
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
                <span className="text-xs" style={{ color:"#c0a0b0" }}>or</span>
                <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.1)" }}/>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name */}
                <div className="relative">
                  <MdPerson size={17} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color:"#c0a0b0" }}/>
                  <input type="text" name="name" placeholder="Full Name"
                    value={form.name} onChange={handleChange} autoComplete="name"
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none"
                    style={inputSt} onFocus={onFocus} onBlur={onBlur}/>
                </div>

                {/* Email */}
                <div className="relative">
                  <MdEmail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color:"#c0a0b0" }}/>
                  <input type="email" name="email" placeholder="Email"
                    value={form.email} onChange={handleChange} autoComplete="email"
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none"
                    style={inputSt} onFocus={onFocus} onBlur={onBlur}/>
                </div>

                {/* Password */}
                <div className="relative">
                  <MdLock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color:"#c0a0b0" }}/>
                  <input type={showPw ? "text" : "password"} name="password"
                    placeholder="Password (min. 6 chars)"
                    value={form.password} onChange={handleChange} autoComplete="new-password"
                    className="w-full pl-9 pr-11 py-3 rounded-xl text-sm outline-none"
                    style={inputSt} onFocus={onFocus} onBlur={onBlur}/>
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color:"#c0a0b0" }}>
                    {showPw ? <HiEyeOff size={17}/> : <HiEye size={17}/>}
                  </button>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: GRAD, opacity: loading ? 0.7 : 1,
                    boxShadow:"0 4px 16px rgba(233,30,140,0.35)" }}>
                  {loading ? "Creating account…" : "🎀 Create Account"}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color:"#c0a0b0" }}>
                Already have an account?{" "}
                <Link to="/login" className="font-bold" style={{ color:"#E91E8C" }}>Sign in</Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs mt-5" style={{ color:"#c0a0b0" }}>
            By signing up you agree to our{" "}
            <span className="font-semibold" style={{ color:"#E91E8C" }}>Terms</span>{" "}
            &amp;{" "}
            <span className="font-semibold" style={{ color:"#E91E8C" }}>Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </>
  );
}
