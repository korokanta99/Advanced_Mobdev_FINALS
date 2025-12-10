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

const initialState: UserProfileState = {
    profile: null,
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

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addDiscovered(state, action: PayloadAction<string>) {
            if (state.profile) {
                state.profile.discovered.push(action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.profile = action.payload;
            state.error = null;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
        builder.addCase(loginUser.pending, (state) => { state.isLoading = true; });

        // Signup
        builder.addCase(signupUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.profile = action.payload;
            state.error = null;
        });
        builder.addCase(signupUser.pending, (state) => { state.isLoading = true; });

        // Update
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            if (state.profile) {
                state.profile = { ...state.profile, ...action.payload };
            }
        });

        // 🟢 LOGOUT HANDLER (Clears Data)
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.profile = null;
            state.isLoading = false;
            state.error = null;
        });
    }
});

export const { addDiscovered } = userSlice.actions;
export default userSlice.reducer;