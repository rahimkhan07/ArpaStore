import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    addToWishlist(state, action) {
      // Prevent duplicates
      if (!state.find(i => i.id === action.payload.id)) {
        state.push(action.payload);
      }
    },
    deleteFromWishlist(state, action) {
      return state.filter(item => item.id !== action.payload.id);
    },
    clearWishlist() {
      return [];
    },
  },
});

export const { addToWishlist, deleteFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
