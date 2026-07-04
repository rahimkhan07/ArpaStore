import { useState } from "react";
import { useData } from "../../../context/data/MyState";
import { storage } from "../../../firebase/FirebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FiTrash2, FiPlus, FiImage, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";

const PINK = "#E91E8C";

function ManageSlider() {
  const { sliderImages, addSliderImage, deleteSliderImage, loading } = useData();

  const [activeTab, setActiveTab] = useState("upload");
  const [imageUrl,  setImageUrl]  = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);

  /* ── Upload from device ── */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Max file size is 5 MB.");

    // Save ref BEFORE async — React synthetic events are pooled and nullified
    const inputEl    = e.target;
    const fileName   = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const storageRef = ref(storage, `slider/${fileName}`);
    const task       = uploadBytesResumable(storageRef, file);

    setUploading(true);
    setProgress(0);

    task.on(
      "state_changed",
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        setProgress(pct);
      },
      (error) => {
        setUploading(false);
        setProgress(0);
        console.error("Slider upload error:", error.code, error.message);
        if (error.code === "storage/unauthorized") {
          toast.error("Permission denied — update Firebase Storage Rules.");
        } else {
          toast.error(`Upload failed: ${error.message}`);
        }
        if (inputEl) inputEl.value = "";
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          await addSliderImage(url);
          toast.success("Slide added! ✅");
        } catch (err) {
          toast.error("Upload done but URL fetch failed.");
        } finally {
          setUploading(false);
          setProgress(0);
          if (inputEl) inputEl.value = "";
        }
      }
    );
  };

  /* ── Add from URL ── */
  const convertUrl = (url) => {
    if (!url) return url;
    const match = url.match(/\/file\/d\/([^/]+)/);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    return url;
  };

  const handleAddUrl = () => {
    const converted = convertUrl(imageUrl.trim());
    if (!converted) return;
    addSliderImage(converted);
    setImageUrl("");
  };

  const inputSt = { background: "#FFF0F5", border: "1.5px solid #FFD6E7", color: "#2d2d2d" };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-black mb-6 text-center" style={{ color: PINK }}>
        🖼 Manage Hero Slider
      </h2>

      {/* Tab Toggle */}
      <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit"
        style={{ background: "rgba(233,30,140,0.07)" }}>
        {[
          { id: "upload", label: "📤 Upload File" },
          { id: "url",    label: "🔗 Paste URL" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTab === t.id ? "linear-gradient(135deg,#E91E8C,#9C27B0)" : "transparent",
              color:      activeTab === t.id ? "#fff" : "#888",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Upload Tab ── */}
      {activeTab === "upload" && (
        <div className="p-5 rounded-2xl mb-8"
          style={{ background: "#FFF5F7", border: "1.5px solid #FFD6E7" }}>
          <label
            className="flex flex-col items-center justify-center gap-3 py-12 rounded-2xl cursor-pointer transition"
            style={{
              border: `2px dashed ${uploading ? PINK : "#FFB3D9"}`,
              background: uploading ? "rgba(233,30,140,0.03)" : "#fff",
            }}>
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <FiLoader style={{ fontSize: 40, color: PINK }} className="animate-spin" />
                <p className="font-black text-2xl" style={{ color: PINK }}>{progress}%</p>
                <div className="w-56 h-3 rounded-full overflow-hidden" style={{ background: "#FFD6E7" }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg,#E91E8C,#9C27B0)",
                    }}
                  />
                </div>
                <p className="text-sm" style={{ color: "#888" }}>Uploading to Firebase Storage…</p>
              </div>
            ) : (
              <>
                <FiImage style={{ fontSize: 44, color: PINK }} />
                <div className="text-center">
                  <p className="font-bold" style={{ color: "#2d2d2d" }}>Click to choose image</p>
                  <p className="text-xs mt-1" style={{ color: "#aaa" }}>JPG, PNG, WebP — max 5 MB</p>
                </div>
                <span className="px-6 py-2.5 rounded-full text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
                  Choose File
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}

      {/* ── URL Tab ── */}
      {activeTab === "url" && (
        <div className="p-5 rounded-2xl mb-8"
          style={{ background: "#FFF5F7", border: "1.5px solid #FFD6E7" }}>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: PINK }}>
            Image URL or Google Drive link
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddUrl()}
              placeholder="https://… or Google Drive share link"
              className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
              style={inputSt}
            />
            <button
              onClick={handleAddUrl}
              disabled={!imageUrl.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
              <FiPlus style={{ fontSize: 14 }} /> Add
            </button>
          </div>
          {imageUrl && (
            <div className="mt-4">
              <p className="text-xs mb-1.5" style={{ color: "#888" }}>Preview:</p>
              <img src={convertUrl(imageUrl)} alt="preview"
                className="h-32 rounded-xl object-cover"
                onError={e => { e.target.style.display = "none"; }} />
            </div>
          )}
        </div>
      )}

      {/* ── Current Slides ── */}
      <h3 className="font-bold text-sm mb-4" style={{ color: "#2d2d2d" }}>
        Current Slides ({sliderImages.length})
      </h3>

      {sliderImages.length === 0 ? (
        <div className="text-center py-14 rounded-2xl"
          style={{ background: "#FFF5F7", border: "1.5px dashed #FFD6E7" }}>
          <FiImage style={{ fontSize: 40, color: "#FFD6E7", display: "block", margin: "0 auto 12px" }} />
          <p className="text-sm" style={{ color: "#bbb" }}>No slides yet — add one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sliderImages.map((img, idx) => (
            <div key={img.id} className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid #FFD6E7", background: "#FFF5F7" }}>
              <div className="relative">
                <img
                  src={img.imageUrl}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-44 object-cover"
                  onError={e => { e.target.src = "https://via.placeholder.com/400x176?text=ArpaStore"; }}
                />
                <span className="absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ background: PINK }}>
                  Slide {idx + 1}
                </span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between gap-2">
                <p className="text-xs truncate flex-1" style={{ color: "#888" }}>{img.imageUrl}</p>
                <button
                  onClick={() => deleteSliderImage(img.id)}
                  className="p-2 rounded-xl transition hover:scale-110 flex-shrink-0"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                  <FiTrash2 style={{ fontSize: 14 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageSlider;
