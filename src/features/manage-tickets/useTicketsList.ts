// hook providing the list data for tickets to display on the admin panel

import { useAppDispatch, useAppSelector } from "@/redux/reduxHooks";
import {
  markRefreshBegun,
  markRefreshComplete,
  selectRefreshTrigger,
  selectTicketListError,
  setRetrievalError,
  setTicketList,
} from "@/redux/slices/ticketListSlice";
import { supabase } from "@/supabase";
import { useEffect } from "react";

// retrieves tickets from the database to populate the ticket list
const useTicketsList = () => {
  const dispatch = useAppDispatch();
  const listError = useAppSelector(selectTicketListError);
  const isRefreshTriggered = useAppSelector(selectRefreshTrigger);

  // refreshes the ticket list directly from the database
  const refreshTicketList = async () => {
    dispatch(markRefreshBegun());

    // select the tickets by creation time and by status
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("status", { ascending: true })
      .order("created_at", { ascending: false });

    // flag an error if one occurs
    if (error) {
      dispatch(setRetrievalError(true));
      dispatch(markRefreshComplete());
      return;
    }

    // set the list data in state
    if (data) {
      dispatch(setTicketList(data));
      dispatch(markRefreshComplete());
      if (listError) dispatch(setRetrievalError(false)); // clear error if present
    }
  };

  // start refreshing the ticket list when the trigger is set to true
  useEffect(() => {
    if (isRefreshTriggered) refreshTicketList();
  }, [isRefreshTriggered]);

  return;
};

export default useTicketsList;
