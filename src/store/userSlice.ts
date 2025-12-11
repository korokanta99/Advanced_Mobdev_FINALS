import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// 🟢 IMPORT signOutUser
import { loginWithEmail, signupWithEmail, updateUserDoc, signOutUser } from "../api/firebase";

interface UserProfileData {
    uid: string;
    email: string;
    username: string;
    discovered: string[];
    gender?: string; // Added gender to interface
}

interface UserProfileState {
    profile: UserProfileData | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
  profile: { name: 'Trainer', gender: 'male' },
  caughtPokemonIds: [1, 4, 7], // Starters pre-caught for testing
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

export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async ({ uid, data }: { uid: string, data: any }, { rejectWithValue }) => {
        try {
            await updateUserDoc(uid, data);
            return data;
        } catch (error) {
            return rejectWithValue("Failed to update profile.");
        }
    }
);

// 🟢 LOGOUT THUNK
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

// --- SLICE ---
interface UserState {
  profile: {
    name: string;
    gender: string;
  };
  caughtPokemonIds: number[]; // Store IDs of caught pokemon
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    // ✅ NEW: Action to capture a pokemon
    addCaughtPokemon: (state, action: PayloadAction<number>) => {
      if (!state.caughtPokemonIds.includes(action.payload)) {
        state.caughtPokemonIds.push(action.payload);
      }
    },
  },
});

export const { setProfile, addCaughtPokemon } = userSlice.actions;
export default userSlice.reducer;