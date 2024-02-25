import { configureStore } from "@reduxjs/toolkit";
import ticketInputReducer from "./slices/ticketInputSlice";
import ticketListReducer from "./slices/ticketListSlice";

export const store = configureStore({
  reducer: {
    ticketInput: ticketInputReducer,
    ticketList: ticketListReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
