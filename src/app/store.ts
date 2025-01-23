import { configureStore } from "@reduxjs/toolkit";
import arenaReducer from "../arena/slice";

export const store = configureStore({
  reducer: {
    arena: arenaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
