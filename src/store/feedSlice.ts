import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { submitPost } from "../api/firebase"; // Removed getFeed

// 🟢 UPDATE THUNK SIGNATURE
export const addPost = createAsyncThunk(
    "feed/addPost",
    // Accept 'gender' in the arguments
    async ({ uid, username, content, gender }: { uid: string, username: string, content: string, gender: string }, { rejectWithValue }) => {
        try {
            // Pass gender to API
            await submitPost(uid, username, content, gender);
            return;
        } catch (error) {
            return rejectWithValue("Failed to post message.");
        }
    }
);

const feedSlice = createSlice({
    name: "feed",
    initialState: {
        posts: [],
        isLoading: true, // Start loading by default
        error: null,
    },
    reducers: {
        // 🟢 NEW ACTION: Called whenever real-time data arrives
        setPosts(state, action: PayloadAction<any[]>) {
            state.posts = action.payload;
            state.isLoading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addPost.pending, (state) => {
            // Optional: You could set a 'sending' flag here
        });
        builder.addCase(addPost.rejected, (state, action) => {
            state.error = action.payload as string;
        });
    },
});

export const { setPosts, setLoading } = feedSlice.actions;
export default feedSlice.reducer;