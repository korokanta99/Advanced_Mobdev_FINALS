import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "./pokemonSlice";
import userReducer from "./userSlice";

export const store = configureStore({
reducer: {
pokemon: pokemonReducer,
user: userReducer,
},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
