import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPokemonList } from "../api/pokeapi"; // Assuming you added this
import { cacheData, getCachedData } from "../utils/cache";

// 1. Create the async action (Thunk)
export const fetchPokemon = createAsyncThunk(
  "pokemon/fetchPokemon",
  async (_, { rejectWithValue }) => {
    // Check cache first
    const cachedList = await getCachedData("pokemonList");
    if (cachedList) {
      return cachedList; // Return cached data immediately
    }

    // If not in cache, fetch from API
    const data = await getPokemonList(0, 151);

    // Cache the fresh data
    await cacheData("pokemonList", data);

    return data;
  }
);

// 2. Update the Slice to handle the Thunk's states
const pokemonSlice = createSlice({
  // ... existing name, initialState
  initialState: {
    list: [],
    favorites: [],
    isLoading: false, // NEW: Loading state
    error: null,      // NEW: Error state
  },
  // ... existing reducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload; // Set list from cache or API
        state.error = null;
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch Pokémon";
      });
  },
});
// ... export actions and default