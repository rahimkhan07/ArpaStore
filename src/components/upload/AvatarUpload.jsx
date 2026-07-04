import { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/FirebaseConfig";
import { Camera, Upload, X, Loader } from "lucide-react";

/**
 * AvatarUpload – shows current photo, clicking opens gallery picker.
 * Props:
 *   value      – current URL (string)
 *   onChange   – called with new URL after upload
 *   dark       – bool
 *   name       – display name for fallback initials
 *   storagePath – e.g. "avatars/userId"
 */
export default function AvatarUpload({ value, onChange, name = "", storagePath = "avatars/unknown" }) {
  const dark = false;
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null); // 0-100 while uploading
  const [preview, setPreview]   = useState(null); // local blob preview
  const [error, setError]       = useState("");

  const border  = "rgba(15,32,68,0.12)";
  const cardBg  = "rgba(15,32,68,0.03)";

  const MAX_MB = 5;

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // validation
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > MAX_MB * 1024 * 1024) { setError(`Max file size is ${MAX_MB} MB.`); return; }
    setError("");

    // local preview immediately
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    // upload to Firebase Storage
    const storageRef = ref(storage, `${storagePath}_${Date.now()}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      err  => { setError("Upload failed: " + err.message); setProgress(null); setPreview(null); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onChange(url);
        setProgress(null);
        setPreview(null); // now the real URL is in `value`
      }
    );
  }

  function clearPhoto() {
    onChange("");
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const displaySrc = preview || value;
  const initials   = name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circle preview */}
      <div className="relative group">
        <div
          className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer transition-all"
          style={{ background: displaySrc ? "transparent" : "linear-gradient(135deg,#0F2044,#C9A84C)", border: `2px solid ${border}` }}
          onClick={() => progress === null && inputRef.current?.click()}
        >
          {displaySrc ? (
            <img src={displaySrc} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-2xl font-black">{initials}</span>
          )}

          {/* hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 rounded-2xl"
            style={{ background: "rgba(0,0,0,0.55)" }}>
            <Camera size={18} className="text-white" />
            <span className="text-white text-[10px] font-semibold">Change</span>
          </div>

          {/* upload progress ring */}
          {progress !== null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
              style={{ background: "rgba(0,0,0,0.65)" }}>
              <Loader size={20} className="text-white animate-spin mb-1" />
              <span className="text-white text-[10px] font-bold">{progress}%</span>
            </div>
          )}
        </div>

        {/* remove button */}
        {displaySrc && progress === null && (
          <button type="button" onClick={clearPhoto}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "#EF4444", color: "#fff" }}>
            <X size={10} />
          </button>
        )}
      </div>

      {/* Upload / Change button */}
      <button type="button" disabled={progress !== null}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
        style={{
          background: "rgba(15,32,68,0.05)",
          border: `1.5px solid ${border}`,
          color: "#C9A84C",
          opacity: progress !== null ? 0.6 : 1,
        }}>
        <Upload size={13} />
        {progress !== null ? `Uploading ${progress}%…` : displaySrc ? "Change Photo" : "Upload Photo"}
      </button>

      <p className="text-[10px] text-center" style={{ color: "#5A6882" }}>
        JPG, PNG or WEBP · Max {MAX_MB} MB
      </p>

      {error && <p className="text-[11px] text-red-400 text-center">{error}</p>}

      {/* Hidden file input */}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={handleFileChange} />
    </div>
  );
}
