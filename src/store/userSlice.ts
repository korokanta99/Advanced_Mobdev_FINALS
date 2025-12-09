// src/store/userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// **IMPORTANT:** Ensure these functions are implemented in src/api/firebase.ts
import { loginWithEmail, signupWithEmail } from "../api/firebase"; 

// 1. Define Interfaces for Type Safety
// The structure of the full profile data returned from your firebase.ts functions
interface UserProfileData {
    uid: string;
    email: string;
    username: string; // From the database profile
    discovered: string[]; 
}

// Interface for the overall user state in Redux
interface UserProfileState {
    profile: UserProfileData | null; // Null if not authenticated
    isLoading: boolean;   // Tracks state of login/signup operation
    error: string | null; // Stores any error message
}

// 2. Initial State
const initialState: UserProfileState = {
    profile: null,
    isLoading: false,
    error: null,
};

// 3. Async Thunks (The Sign-In/Sign-Up Logic)
// These functions call the Firebase API and update state automatically.

// Thunk for Login
export const loginUser = createAsyncThunk<UserProfileData, any, { rejectValue: string }>(
    "user/loginUser",
    async ({ email, password }: any, { rejectWithValue }) => {
        try {
            // Calls the function in firebase.ts to authenticate and fetch profile
            return await loginWithEmail(email, password); 
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Login failed.");
        }
    }
);

// Thunk for Signup
export const signupUser = createAsyncThunk<UserProfileData, any, { rejectValue: string }>(
    "user/signupUser",

    async ({ email, password, username, gender }: any, { rejectWithValue }) => {
        try {
            return await signupWithEmail(email, password, username, gender);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Signup failed.");
        }
    }
);


// 4. The Redux Slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addDiscovered(state, action: PayloadAction<string>) {
            if (state.profile) {
                state.profile.discovered.push(action.payload);
            }
        },
        logout(state) {
            // Reset state upon logout
            state.profile = null;
            state.isLoading = false;
            state.error = null;
        }
    },
    // 5. Handling Async Thunks (Extra Reducers)
    extraReducers: (builder) => {
        builder
            // Match success for both LOGIN and SIGNUP
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled') && action.type.startsWith('user/'),
                (state, action: PayloadAction<UserProfileData>) => {
                    state.isLoading = false;
                    state.profile = action.payload; // Set the full profile on success
                    state.error = null;
                }
            )
            // Match pending for both LOGIN and SIGNUP
            .addMatcher(
                (action) => action.type.endsWith('/pending') && action.type.startsWith('user/'),
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            // Match failure for both LOGIN and SIGNUP
            .addMatcher(
                (action) => action.type.endsWith('/rejected') && action.type.startsWith('user/'),
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload as string || "An authentication error occurred.";
                    state.profile = null;
                }
            );
    }
});

export const { addDiscovered, logout } = userSlice.actions;
// Export the thunks so Member 2 can use them:
export { loginUser, signupUser }; 
export default userSlice.reducer;