// Import the createSlice API from Redux Toolkit
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface TicketInputState {
  exampleProperty: boolean;
}

// This is the initial state of the slice
const initialState: TicketInputState = {
  exampleProperty: false,
};

const ticketInputSlice = createSlice({
  name: "ticketInput",
  initialState,
  reducers: {
    // example of a simple action without a payload
    simpleAction: (state) => {
      state.exampleProperty = true;
    },

    // example of an action with a payload
    payloadAction: (state, action: PayloadAction<boolean>) => {
      state.exampleProperty = action.payload;
    },
  },
});

// Export all newly created actions here
export const { simpleAction, payloadAction } = ticketInputSlice.actions;

// Create selectors here, or in their own files if needed
export const selectExampleProperty = (state: RootState) =>
  state.ticketInput.exampleProperty;

// Export the reducer function so that it can be added to the store
// TODO: add the exported reducer to the store
export default ticketInputSlice.reducer;
