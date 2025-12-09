// src/store/pokemonSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getPokemonList } from "../api/pokeapi";
import { cacheData, getCachedData } from "../utils/cache";

// 1. Create the async action (Thunk)
export const fetchPokemon = createAsyncThunk(
  "pokemon/fetchPokemon",
  async (_, { rejectWithValue }) => {
    // 🛑 KEY UPDATED: Use "pokemonList_v2" to force a fresh download
    const cachedList = await getCachedData("pokemonList_v2");

    if (cachedList) {
      console.log("Loaded Pokemon from cache");
      return cachedList;
    }

    console.log("Fetching Pokemon from API...");
    // If not in cache, fetch from API (now gets full details)
    const data = await getPokemonList(0, 151);

    // Cache the fresh data with the new key
    await cacheData("pokemonList_v2", data);

    return data;
  }
);

// 2. The Slice
const pokemonSlice = createSlice({
  name: "pokemon",

  initialState: {
    list: [],
    favorites: [],
    isLoading: false,
    error: null,
  },
  reducers: {
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

export const { setPokemonList, addFavorite } = pokemonSlice.actions;
export default pokemonSlice.reducer;