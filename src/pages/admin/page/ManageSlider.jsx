import { useState } from "react";
import { useData } from "../../../context/data/MyState";
import { AiFillDelete } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";

function ManageSlider() {
  const { sliderImages, addSliderImage, deleteSliderImage, loading } = useData();
  const [imageUrl, setImageUrl] = useState("");

  // Convert Google Drive links automatically
  const convertUrl = (url) => {
    const match = url.match(/\/file\/d\/([^\/]+)/);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    return url;
  };

  const handleAdd = () => {
    const converted = convertUrl(imageUrl.trim());
    addSliderImage(converted);
    setImageUrl("");
  };

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto">
      <h1 className="text-center text-white text-2xl font-bold mb-6">
        Manage Slider Images
      </h1>

      {/* Add Image */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <label className="text-white text-sm font-semibold block mb-2">
          Image URL (direct link or Google Drive link)
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL here..."
            className="flex-1 bg-gray-600 px-3 py-2 rounded-lg text-white placeholder:text-gray-400 outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={loading || !imageUrl}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-bold px-5 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FaPlus /> Add
          </button>
        </div>

        {/* Preview */}
        {imageUrl && (
          <div className="mt-4">
            <p className="text-gray-300 text-xs mb-2">Preview:</p>
            <img
              src={convertUrl(imageUrl)}
              alt="preview"
              className="h-28 rounded-lg object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}
      </div>

      {/* Current Slider Images */}
      <h2 className="text-white font-semibold text-lg mb-4">
        Current Slider Images ({sliderImages.length})
      </h2>

      {sliderImages.length === 0 ? (
        <div className="text-center text-gray-400 py-10 bg-gray-800 rounded-xl">
          No slider images yet. Add one above.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sliderImages.map((img, idx) => (
            <div key={img.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="relative">
                <img
                  src={img.imageUrl}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x160?text=Image+Error";
                  }}
                />
                <span className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                  Slide {idx + 1}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <p className="text-gray-400 text-xs truncate flex-1">{img.imageUrl}</p>
                <button
                  onClick={() => deleteSliderImage(img.id)}
                  className="text-red-400 hover:text-red-600 text-xl transition"
                >
                  <AiFillDelete />
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
