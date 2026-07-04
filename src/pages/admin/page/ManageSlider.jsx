import { useState } from "react";
import { useData } from "../../../context/data/MyState";
import { Trash2, Plus, Image } from "lucide-react";

const PINK = "#E91E8C";

function ManageSlider() {
  const { sliderImages, addSliderImage, deleteSliderImage, loading } = useData();
  const [imageUrl, setImageUrl] = useState("");

  const convertUrl = (url) => {
    if (!url) return url;
    const match = url.match(/\/file\/d\/([^/]+)/);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    return url;
  };

  const handleAdd = () => {
    const converted = convertUrl(imageUrl.trim());
    if (!converted) return;
    addSliderImage(converted);
    setImageUrl("");
  };

  const inputSt = {
    background: "#FFF0F5",
    border: "1.5px solid #FFD6E7",
    color: "#2d2d2d",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-black mb-6 text-center" style={{ color: PINK }}>
        🖼 Manage Hero Slider
      </h2>

      {/* Add Image */}
      <div className="p-5 rounded-2xl mb-8"
        style={{ background: "#FFF5F7", border: "1.5px solid #FFD6E7" }}>
        <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: PINK }}>
          Add New Slide Image
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="Paste image URL or Google Drive link…"
            className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
            style={inputSt}
          />
          <button
            onClick={handleAdd}
            disabled={loading || !imageUrl.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
            <Plus size={14} /> Add
          </button>
        </div>

        {imageUrl && (
          <div className="mt-4">
            <p className="text-xs font-medium mb-2" style={{ color: "#888" }}>Preview:</p>
            <img
              src={convertUrl(imageUrl)}
              alt="preview"
              className="h-32 rounded-xl object-cover"
              onError={e => { e.target.style.display = "none"; }}
            />
          </div>
        )}
      </div>

      {/* Existing Slides */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm" style={{ color: "#2d2d2d" }}>
          Current Slides ({sliderImages.length})
        </h3>
      </div>

      {sliderImages.length === 0 ? (
        <div className="text-center py-14 rounded-2xl"
          style={{ background: "#FFF5F7", border: "1.5px dashed #FFD6E7" }}>
          <Image size={40} style={{ color: "#FFD6E7", margin: "0 auto 12px" }} />
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
                  className="w-full h-40 object-cover"
                  onError={e => { e.target.src = "https://via.placeholder.com/400x160?text=Arpa+Store"; }}
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
                  className="p-2 rounded-xl transition hover:scale-110"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                  <Trash2 size={14} />
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
