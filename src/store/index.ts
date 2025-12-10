import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "./pokemonSlice";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    user: userReducer,
    feed: feedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents warnings about Timestamps
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;