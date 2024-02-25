// Import the createSlice API from Redux Toolkit
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Tables } from "@/supabase/types";

// Define a type for the slice state
interface TicketListState {
  tickets: Tables<"tickets">[];
  isRetrievalError: boolean; // list could not be retrieved
  isRefreshTriggered: boolean; // a list refresh has been called
  refreshing: boolean; // the list is in process of refreshing
}

// This is the initial state of the slice
const initialState: TicketListState = {
  tickets: [],
  isRetrievalError: false,
  isRefreshTriggered: true,
  refreshing: false,
};

const ticketListSlice = createSlice({
  name: "ticketList",
  initialState,
  reducers: {
    // clear the tickets list
    clearList: (state) => {
      state.tickets = [];
    },

    // freshly set the tickets list
    setTicketList: (state, action: PayloadAction<Tables<"tickets">[]>) => {
      state.tickets = action.payload;
    },

    // add a new ticket to the top of the list
    addNewTicket: (state, action: PayloadAction<Tables<"tickets">>) => {
      const ticketListItem: Tables<"tickets"> = action.payload;
      state.tickets = [ticketListItem, ...state.tickets];
    },

    // set error flag on/off
    setRetrievalError: (state, action: PayloadAction<boolean>) => {
      state.isRetrievalError = action.payload;
    },

    // trigger a refresh of the list (if not currently refreshing)
    triggerTicketListRefresh: (state) => {
      if (!state.refreshing) state.isRefreshTriggered = true;
      // do not set refreshing to true here, must be false initially to trigger behavior
    },

    // mark refresh as begun, turn off the trigger
    markRefreshBegun: (state) => {
      state.refreshing = true;
      state.isRefreshTriggered = false;
    },

    // mark refresh as complete
    markRefreshComplete: (state) => {
      state.refreshing = false;
    },

    // update status for specific ticket
    updateTicketStatusById: (
      state,
      action: PayloadAction<{ id: Number; status: Tables<"tickets">["status"] }>
    ) => {
      state.tickets = state.tickets.map((ticket) =>
        ticket.id === action.payload.id
          ? { ...ticket, status: action.payload.status }
          : ticket
      );
    },
  },
});

// Export all newly created actions here
export const {
  clearList,
  setTicketList,
  addNewTicket,
  setRetrievalError,
  triggerTicketListRefresh,
  markRefreshBegun,
  markRefreshComplete,
  updateTicketStatusById,
} = ticketListSlice.actions;

// Create selectors here, or in their own files if needed
export const selectTicketList = (state: RootState) => state.ticketList.tickets;
export const selectTicketListError = (state: RootState) =>
  state.ticketList.isRetrievalError;
export const selectRefreshTrigger = (state: RootState) =>
  state.ticketList.isRefreshTriggered;
export const selectTicketListRefreshing = (state: RootState) =>
  state.ticketList.refreshing;
export const selectTicketById = (state: RootState, id: number) =>
  state.ticketList.tickets.find((ticket) => ticket.id === id);

// Export the reducer function so that it can be added to the store
// TODO: add the exported reducer to the store
export default ticketListSlice.reducer;
