// Import the createSlice API from Redux Toolkit
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Tables } from "@/supabase/types";
import { isStringNotEmpty } from "@/utils/helpers";

// input slice includes all fields from the "tickets" table set on insert (excluding others)
// additionally includes data field for base64 attachment string for upload
interface TicketInputState
  extends Omit<
    Tables<"tickets">,
    "id" | "status" | "created_at" | "updated_at"
  > {
  attachment_data: string | null;
}

// This is the initial state of the slice
const initialState: TicketInputState = {
  name: "",
  email: "",
  description: "",
  attachment_url: null,
  attachment_name: null,
  attachment_data: null,
  attachment_type: null,
};

const ticketInputSlice = createSlice({
  name: "ticketInput",
  initialState,
  reducers: {
    // reset form input
    resetInput: (state) => {
      return initialState;
    },

    // update text field inputs
    handleTextInput: (
      state,
      action: PayloadAction<{
        field: keyof TicketInputState;
        input: string;
      }>
    ) => {
      const { field, input } = action.payload;

      // ensure input is for a text field, and update if so
      if (typeof state[field] === "string") {
        state[field] = input;
      }
    },

    // set data for the currently selected attachment
    // clear all attachment fields if null is passed
    setAttachmentInput: (
      state,
      action: PayloadAction<{
        name: string | null; // filename may be null
        uri: string;
        data: string;
        type: string;
      } | null>
    ) => {
      if (action.payload === null) {
        state.attachment_url = null;
        state.attachment_name = null;
        state.attachment_data = null;
        state.attachment_type = null;
      } else {
        state.attachment_url = action.payload.uri;
        state.attachment_name = action.payload.name;
        state.attachment_data = action.payload.data;
        state.attachment_type = action.payload.type;
      }
    },
  },
});

// Export all newly created actions here
export const { resetInput, handleTextInput, setAttachmentInput } =
  ticketInputSlice.actions;

// Selector for individual input fields
export const selectNameInput = (state: RootState) => state.ticketInput.name;
export const selectEmailInput = (state: RootState) => state.ticketInput.email;
export const selectDescriptionInput = (state: RootState) =>
  state.ticketInput.description;
export const selectAttachmentUrlInput = (state: RootState) =>
  state.ticketInput.attachment_url;
export const selectAttachmentNameInput = (state: RootState) =>
  state.ticketInput.attachment_name;
export const selectAttachmentTypeInput = (state: RootState) =>
  state.ticketInput.attachment_type;

// selector for whether the ticket can be submitted (non-attachment fields have values)
export const selectCanSubmitTicket = (state: RootState) => {
  let { name, email, description } = state.ticketInput;

  if (
    isStringNotEmpty(name) &&
    isStringNotEmpty(email) &&
    isStringNotEmpty(description)
  ) {
    return true;
  } else {
    return false;
  }
};

// Export the reducer function so that it can be added to the store
// TODO: add the exported reducer to the store
export default ticketInputSlice.reducer;
