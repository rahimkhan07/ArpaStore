import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart(state, action) {
      state.push(action.payload);
    },
    // Match by id AND selectedSize so different size variants coexist
    deleteFromCart(state, action) {
      const { id, selectedSize } = action.payload;
      const idx = state.findIndex(
        item => item.id === id && (item.selectedSize ?? null) === (selectedSize ?? null)
      );
      if (idx !== -1) state.splice(idx, 1);
    },
    clearCart() {
      return [];
    },
  },
});

export const { addToCart, deleteFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
