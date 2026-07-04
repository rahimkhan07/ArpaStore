import { useData } from "../../../context/data/MyState";

const PINK = "#E91E8C";

const HAIR_SIZES = ["XS", "S", "M", "L", "XL", "One Size"];
const HAIR_CATEGORIES = ["scrunchies","bows","clips","pins","headbands","ties","sets"];

function AddProduct() {
  const { products, setProducts, addProduct, loading } = useData();

  const convertGDrive = (url) => {
    if (!url) return url;
    const m = url.match(/\/file\/d\/([^/]+)/);
    if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
    return url;
  };

  const handleSizeToggle = (size) => {
    const current = products.sizes || [];
    setProducts({
      ...products,
      sizes: current.includes(size) ? current.filter(s => s !== size) : [...current, size],
    });
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl outline-none text-sm";
  const inputSt  = { background: "#FFF0F5", border: "1.5px solid #FFD6E7", color: "#2d2d2d" };

  return (
    <div className="p-6">
      <h2 className="text-xl font-black mb-6 text-center" style={{ color: PINK }}>➕ Add New Product</h2>

      <div className="max-w-lg mx-auto space-y-4">
        {/* Title */}
        <input type="text" placeholder="Product title *"
          className={inputCls} style={inputSt}
          value={products.title}
          onChange={e => setProducts({ ...products, title: e.target.value })} />

        {/* Price */}
        <input type="number" placeholder="Price (₹) *"
          className={inputCls} style={inputSt}
          value={products.price}
          onChange={e => setProducts({ ...products, price: e.target.value })} />

        {/* Stock */}
        <input type="number" placeholder="Stock quantity"
          className={inputCls} style={inputSt}
          value={products.stock || ""}
          onChange={e => setProducts({ ...products, stock: e.target.value })} />

        {/* Images */}
        {[
          { field: "imageUrl",  label: "Main Image URL *" },
          { field: "imageUrl2", label: "Image 2 (optional)" },
          { field: "imageUrl3", label: "Image 3 (optional)" },
          { field: "imageUrl4", label: "Image 4 (optional)" },
        ].map(({ field, label }) => (
          <div key={field}>
            <input type="text" placeholder={`${label} (Google Drive link supported)`}
              className={inputCls} style={inputSt}
              value={products[field] || ""}
              onChange={e => setProducts({ ...products, [field]: convertGDrive(e.target.value) })} />
            {products[field] && (
              <img src={products[field]} alt="preview"
                className="mt-1.5 w-16 h-16 rounded-xl object-cover"
                onError={e => { e.target.style.display = "none"; }} />
            )}
          </div>
        ))}

        {/* Category */}
        <select className={inputCls} style={inputSt}
          value={products.category || "scrunchies"}
          onChange={e => setProducts({ ...products, category: e.target.value })}>
          {HAIR_CATEGORIES.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>

        {/* Type */}
        <input type="text" placeholder="Product type (e.g. Velvet Scrunchie)"
          className={inputCls} style={inputSt}
          value={products.type || ""}
          onChange={e => setProducts({ ...products, type: e.target.value })} />

        {/* Description */}
        <textarea rows={4} placeholder="Product description"
          className={inputCls} style={inputSt}
          value={products.description || ""}
          onChange={e => setProducts({ ...products, description: e.target.value })} />

        {/* Sizes */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: PINK }}>
            Sizes (optional)
          </p>
          <div className="flex gap-2 flex-wrap">
            {HAIR_SIZES.map(size => (
              <button key={size} type="button"
                onClick={() => handleSizeToggle(size)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition"
                style={{
                  background: (products.sizes || []).includes(size) ? PINK : "#FFF0F5",
                  color: (products.sizes || []).includes(size) ? "#fff" : PINK,
                  borderColor: PINK,
                }}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={products.featured || false}
            onChange={e => setProducts({ ...products, featured: e.target.checked })}
            className="w-4 h-4 accent-pink-500" />
          <span className="text-sm font-semibold" style={{ color: "#2d2d2d" }}>
            ⭐ Mark as Featured / Bestseller
          </span>
        </label>

        {/* Submit */}
        <button onClick={addProduct} disabled={loading}
          className="w-full py-3.5 rounded-2xl font-bold text-white transition hover:opacity-90 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#E91E8C,#9C27B0)" }}>
          {loading ? "Adding…" : "🎀 Add Product"}
        </button>
      </div>
    </div>
  );
}

export default AddProduct;
