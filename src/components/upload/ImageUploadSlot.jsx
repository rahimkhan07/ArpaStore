/**
 * ImageUploadSlot — Cloudinary unsigned upload
 * No CORS issues, no backend needed, free tier: 25GB storage
 *
 * Setup (one-time):
 *  1. Sign up at cloudinary.com (free)
 *  2. Dashboard → Settings → Upload → Add upload preset
 *     - Preset name: arpastore_unsigned
 *     - Signing mode: Unsigned
 *     - Folder: arpastore/products
 *  3. Replace CLOUD_NAME below with your Cloudinary cloud name
 */
import { useState, useRef } from "react";
import { FiImage, FiX, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";

// ─── CLOUDINARY CONFIG ───────────────────────────────────────────
const CLOUD_NAME    = "rtfpis6i";   // ← Replace with YOUR cloud name
const UPLOAD_PRESET = "arpastore_unsigned"; // ← Your unsigned preset name
// ─────────────────────────────────────────────────────────────────

const PINK = "#E91E8C";

export default function ImageUploadSlot({ label, value, onChange, required = false }) {
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState("");
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Validate
    if (!file.type.startsWith("image/")) {
      setError("Only images allowed (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Max file size is 10 MB.");
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file",           file);
      formData.append("upload_preset",  UPLOAD_PRESET);
      formData.append("folder",         "arpastore/products");

      // Use XMLHttpRequest for progress tracking
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const pct = Math.round((evt.loaded / evt.total) * 90) + 5;
            setProgress(pct);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            onChange(data.secure_url);
            toast.success("✅ Image uploaded!");
            setError("");
            resolve();
          } else {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData?.error?.message || `HTTP ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error — check internet connection."));

        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
        xhr.send(formData);
      });

    } catch (err) {
      console.error("Cloudinary upload error:", err.message);
      let msg = err.message || "Upload failed.";

      // Common Cloudinary errors
      if (msg.includes("Invalid upload preset")) {
        msg = "Upload preset not found. Create 'arpastore_unsigned' in Cloudinary dashboard.";
      } else if (msg.includes("cloud_name")) {
        msg = "Cloud name wrong. Update CLOUD_NAME in ImageUploadSlot.jsx.";
      } else if (msg.includes("401") || msg.includes("403")) {
        msg = "Cloudinary auth error — check preset is set to Unsigned.";
      }

      setError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const reset = () => {
    onChange("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <p className="text-xs font-semibold" style={{ color: PINK }}>
        {label}
        {required && <span style={{ color: "#EF4444" }}> *</span>}
      </p>

      {value ? (
        /* ── Preview ── */
        <div className="relative inline-block w-24 h-24">
          <img
            src={value}
            alt="uploaded"
            className="w-24 h-24 rounded-2xl object-cover border-2"
            style={{ borderColor: "#FFD6E7" }}
          />
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "#10B981" }}>
            <FiCheckCircle style={{ fontSize: 12, color: "white" }} />
          </div>
          <button
            type="button"
            onClick={reset}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md"
            style={{ background: "#EF4444" }}>
            <FiX style={{ fontSize: 11 }} />
          </button>
        </div>
      ) : (
        /* ── Upload slot ── */
        <label
          style={{
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            width:          96,
            height:         96,
            borderRadius:   16,
            border:         `2px dashed ${error ? "#EF4444" : uploading ? PINK : "#FFB3D9"}`,
            background:     uploading ? "rgba(233,30,140,0.05)"
                            : error   ? "rgba(239,68,68,0.04)"
                            : "#FFF0F5",
            cursor:         uploading ? "wait" : "pointer",
            gap:            4,
          }}>

          {uploading ? (
            /* Uploading state */
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <FiLoader style={{ fontSize: 22, color: PINK }} className="animate-spin" />
              <span style={{ fontSize: 11, fontWeight: 800, color: PINK }}>{progress}%</span>
              <div style={{ width: 56, height: 5, background: "#FFD6E7", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg,#E91E8C,#9C27B0)",
                  borderRadius: 99,
                  transition: "width 0.3s ease",
                }} />
              </div>
            </div>
          ) : error ? (
            /* Error state */
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"0 4px" }}>
              <FiAlertCircle style={{ fontSize: 20, color: "#EF4444" }} />
              <span style={{ fontSize: 9, color: "#EF4444", textAlign:"center", fontWeight:600 }}>
                Retry
              </span>
            </div>
          ) : (
            /* Idle state */
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"0 4px" }}>
              <FiImage style={{ fontSize: 22, color: PINK }} />
              <span style={{ fontSize: 10, color: PINK, textAlign:"center", fontWeight:600, lineHeight:1.2 }}>
                Click to upload
              </span>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: "none" }}
            disabled={uploading}
            onChange={handleFile}
          />
        </label>
      )}

      {/* Error text */}
      {error && !uploading && (
        <p style={{ fontSize: 9, color: "#EF4444", maxWidth: 96, lineHeight: 1.3 }}>{error}</p>
      )}
    </div>
  );
}
