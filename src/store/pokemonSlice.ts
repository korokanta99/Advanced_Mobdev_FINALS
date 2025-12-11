import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getPokemonList } from "../api/pokeapi";
import { cacheData, getCachedData } from "../utils/cache";

export const fetchPokemon = createAsyncThunk(
  "pokemon/fetchPokemon",
  async (_, { rejectWithValue }) => {
    const cachedList = await getCachedData("pokemonList_v2");
    if (cachedList) return cachedList;

    const data = await getPokemonList(0, 151);
    await cacheData("pokemonList_v2", data);
    return data;
  }
);

interface PokemonState {
    list: any[];
    wildSpawns: any[]; // ✅ Store map spawns here
    isLoading: boolean;
    error: string | null;
}

const initialState: PokemonState = {
    list: [],
    wildSpawns: [],
    isLoading: false,
    error: null,
};

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    // ✅ Action to add new spawns without deleting old ones
    addWildSpawns(state, action: PayloadAction<any[]>) {
        // Option A: Append (Keep history)
        // state.wildSpawns = [...state.wildSpawns, ...action.payload];
        
        // Option B: Merge (Keep persistent set, prevent duplicates if needed)
        state.wildSpawns = [...state.wildSpawns, ...action.payload];
    },
    // Optional: Clear spawns if map gets too cluttered
    clearWildSpawns(state) {
        state.wildSpawns = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed";
      });
  },
});

export const { addWildSpawns, clearWildSpawns } = pokemonSlice.actions;
export default pokemonSlice.reducer;