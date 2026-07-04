import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./CartSlice.jsx";
import wishlistState from "./WishlistSlice.jsx";

// Safe localStorage parser
const safeLoad = (key) => {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : undefined;
  } catch { return undefined; }
};

export const store = configureStore({
  reducer: {
    cart:     cartSlice,
    wishlist: wishlistState,
  },
  preloadedState: {
    cart:     safeLoad("cart")     ?? [],
    wishlist: safeLoad("wishlist") ?? [],
  },
  devTools: import.meta.env.DEV,
});

// Persist cart + wishlist to localStorage on every state change
store.subscribe(() => {
  const { cart, wishlist } = store.getState();
  try {
    localStorage.setItem("cart",     JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  } catch { /* quota exceeded — ignore */ }
});
