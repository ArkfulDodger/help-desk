import { useAppDispatch } from "@/redux/reduxHooks";
import { updateTicketStatusById } from "@/redux/slices/ticketListSlice";
import { supabase } from "@/supabase";
import { Tables } from "@/supabase/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Alert } from "react-native";

// an action sheet for updating the status of a specific ticket
const useTicketStatusSheet = () => {
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = (ticketId: number) => {
    const options = ["new", "in progress", "resolved", "Cancel"];
    const cancelButtonIndex = 3;

    // update the status in the database, and reflect in state on success
    const updateStatus = async (status: Tables<"tickets">["status"]) => {
      const { data, error } = await supabase
        .from("tickets")
        .update({ status: status })
        .eq("id", ticketId)
        .select("status")
        .maybeSingle();

      if (error) {
        Alert.alert("Could not update status");
      }

      if (data) {
        dispatch(updateTicketStatusById({ id: ticketId, status: data.status }));
      }
    };

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            updateStatus("new");
            break;
          case 1:
            updateStatus("in progress");
            break;
          case 2:
            updateStatus("resolved");
            break;
          case cancelButtonIndex:
            break;
        }
      }
    );
  };

  return onPress;
};

export default useTicketStatusSheet;
