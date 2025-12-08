import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getPokemonList } from "../api/pokeapi";
import { cacheData, getCachedData } from "../utils/cache";

// 1. Create the async action (Thunk)
export const fetchPokemon = createAsyncThunk(
  "pokemon/fetchPokemon",
  async (_, { rejectWithValue }) => {
    // Check cache first
    const cachedList = await getCachedData("pokemonList");
    if (cachedList) {
      return cachedList;
    }

    // If not in cache, fetch from API
    const data = await getPokemonList(0, 151);

    // Cache the fresh data
    await cacheData("pokemonList", data);

    return data;
  }
);

// 2. The Slice
const pokemonSlice = createSlice({
  // 🛑 FIX: This 'name' property was missing!
  name: "pokemon",

  initialState: {
    list: [],
    favorites: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    // Basic reducers (if you had any synchronous ones) can go here
    setPokemonList(state, action) {
        state.list = action.payload;
    },
    addFavorite(state, action) {
        state.favorites.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch Pokémon";
      });
  },
});

// Export actions and reducer
export const { setPokemonList, addFavorite } = pokemonSlice.actions;
export default pokemonSlice.reducer;