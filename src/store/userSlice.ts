import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginWithEmail, signupWithEmail, updateUserDoc, signOutUser, saveCapturedPokemon } from "../api/firebase";

interface UserProfileData {
    uid: string;
    email: string;
    username: string;
    gender?: string;
}

interface UserState {
    profile: UserProfileData | null;
    caughtPokemonIds: number[]; // Stores IDs of caught pokemon
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    profile: null,
    caughtPokemonIds: [], // Start empty, load from DB
    isLoading: false,
    error: null,
};

// --- THUNKS ---

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async ({ email, password }: any, { rejectWithValue }) => {
        try {
            return await loginWithEmail(email, password);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Login failed.");
        }
    }
);

export const signupUser = createAsyncThunk(
    "user/signupUser",
    async ({ email, password, username, gender }: any, { rejectWithValue }) => {
        try {
            return await signupWithEmail(email, password, username, gender);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Signup failed.");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await signOutUser();
            return;
        } catch (error) {
            return rejectWithValue("Logout failed.");
        }
    }
);

// ✅ NEW: Thunk to capture pokemon and save to DB
export const capturePokemon = createAsyncThunk(
    "user/capturePokemon",
    async (pokemonId: number, { getState, rejectWithValue }) => {
        const state: any = getState();
        const uid = state.user.profile?.uid;

        if (!uid) return rejectWithValue("User not logged in");

        try {
            // 1. Save to Firestore
            await saveCapturedPokemon(uid, pokemonId);
            // 2. Return ID to update Redux
            return pokemonId;
        } catch (error) {
            return rejectWithValue("Failed to save capture");
        }
    }
);

// --- SLICE ---

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<any>) => {
            state.profile = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Handle Login Success
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.profile = action.payload;
            state.isLoading = false;
            state.error = null;
            // ✅ LOAD CAUGHT POKEMON FROM DB
            if (action.payload.discovered) {
                state.caughtPokemonIds = action.payload.discovered;
            }
        });
        builder.addCase(loginUser.pending, (state) => { state.isLoading = true; });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Handle Signup Success
        builder.addCase(signupUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.profile = action.payload;
            state.isLoading = false;
            state.caughtPokemonIds = []; // New user has 0 pokemon
        });

        // Handle Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.profile = null;
            state.caughtPokemonIds = [];
        });

        // ✅ Handle Capture Success
        builder.addCase(capturePokemon.fulfilled, (state, action) => {
            if (!state.caughtPokemonIds.includes(action.payload)) {
                state.caughtPokemonIds.push(action.payload);
            }
        });
    }
});

export const { setProfile } = userSlice.actions;
export default userSlice.reducer;