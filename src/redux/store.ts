import { configureStore } from "@reduxjs/toolkit";
import ticketInputReducer from "./slices/ticketInputSlice";

export const store = configureStore({
  reducer: {
    ticketInput: ticketInputReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
