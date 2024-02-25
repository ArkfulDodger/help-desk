import { useAppDispatch, useAppSelector } from "@/redux/reduxHooks";
import {
  resetInput,
  selectCanSubmitTicket,
  selectTicketInput,
  setSubmitting,
} from "@/redux/slices/ticketInputSlice";
import { addNewTicket } from "@/redux/slices/ticketListSlice";
import { supabase } from "@/supabase";
import { TablesInsert } from "@/supabase/types";
import { Alert } from "react-native";
import { decode } from "base64-arraybuffer";

// logic for submitting a ticket, returning a callback to execute
// Inserts the ticket record, then uploads an attachment (if present) and updates the record with the url
const useSubmitTicket = () => {
  const dispatch = useAppDispatch();
  const {
    name,
    email,
    description,
    attachment_url,
    attachment_data,
    attachment_type,
    attachment_name,
  } = useAppSelector(selectTicketInput);
  const canSumbitTicket = useAppSelector(selectCanSubmitTicket);

  // Alert the user that the ticket could not be submitted
  const notifyError = () => {
    Alert.alert(
      "Oops!",
      "Something went wrong. Please email us directly at helpdesk@healthdesk.com so we can assist you as quickly as possible."
    );
  };

  // Alert the user that the ticket was submitted without the attachment
  const notifyAttachmentError = () => {
    Alert.alert(
      "Attachment Not Sent",
      "Something went wrong attaching your file, and your ticket has been submitted without it. We will reach out to you directly if the attachment is necessary for us to assist you."
    );
  };

  // upload attachment to supabase storage and return public url
  const uploadAttachment = async (ticketId: number) => {
    if (!attachment_data || !attachment_type) return; // escape if missing necessary data

    // upload the file to supabase storage
    const { data, error } = await supabase.storage
      .from("ticket-attachments")
      .upload(
        `${ticketId}-${attachment_name || "NONAME"}`, // name with id to gurarantee uniqueness
        decode(attachment_data), // use the base64 data for file content
        {
          contentType: attachment_type,
        }
      );

    // escape/notify the user if upload failed
    if (error || !data) return notifyAttachmentError();

    // get the public url for the uploaded file using the returned path
    const { data: urlData } = supabase.storage
      .from("ticket-attachments")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  // insert new record into the tickets table, returning the new record
  const insertTicket = async (ticketData: TablesInsert<"tickets">) => {
    try {
      // insert the new record into the table
      const { data, error } = await supabase
        .from("tickets")
        .insert(ticketData)
        .select()
        .maybeSingle();

      // escape/notify user if submission failed
      if (error) return notifyError();

      return data;
    } catch (error) {
      return notifyError();
    }
  };

  // update the attachment fields for the given ticket record
  const updateAttachmentRecord = async (ticketId: number, url: string) => {
    const { error } = await supabase
      .from("tickets")
      .update({
        attachment_url: url,
        attachment_name: attachment_name,
        attachment_type: attachment_type,
      })
      .eq("id", ticketId);
    if (error) {
      console.error(
        `An attachment was uploaded for ticket ${ticketId}, but a url could not be retrieved. As of yet, this error is unhandled`
      );
      notifyAttachmentError();
      return false;
    }
    return true;
  };

  // Callback to Sumbit a Ticket
  const submitTicket = async () => {
    // escape if the current ticket input cannot be submitted
    if (!canSumbitTicket) return;

    dispatch(setSubmitting(true));

    // create the base insertable ticket object
    const ticketData: TablesInsert<"tickets"> = {
      name: name,
      email: email,
      description: description,
    };

    // insert the ticket into the database and receive the new ticket record
    let returnedTicket = await insertTicket(ticketData);

    if (returnedTicket) {
      // if the new ticket has an attachment, upload it and attach it to the record
      if (attachment_url) {
        const attachment_online_url = await uploadAttachment(returnedTicket.id);
        if (attachment_online_url) {
          await updateAttachmentRecord(
            returnedTicket.id,
            attachment_online_url
          );

          // update the returned ticket with attachment data to be stored in state
          returnedTicket = {
            ...returnedTicket,
            attachment_name: attachment_name,
            attachment_type: attachment_type,
            attachment_url: attachment_online_url,
          };
        }
      } else {
        dispatch(setSubmitting(false));
        return notifyError();
      }

      dispatch(addNewTicket(returnedTicket));
      dispatch(resetInput());
      Alert.alert("Success", "Ticket Submitted");
    } else {
      dispatch(setSubmitting(false));
      return notifyError();
    }
  };

  return submitTicket;
};

export default useSubmitTicket;
