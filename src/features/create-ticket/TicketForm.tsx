import { useAppSelector } from "@/redux/reduxHooks";
import {
  selectCanSubmitTicket,
  selectTicketInput,
} from "@/redux/slices/ticketInputSlice";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { Image } from "expo-image";
import { BLURHASH } from "@/utils/constants";

type Props = {};

// the user-facing form used to submit a new ticket
const TicketForm = ({}: Props) => {
  // the input field values
  const { name, email, attachment_url, attachment_name, attachment_type } =
    useAppSelector(selectTicketInput);

  // whether the form can be submitted
  const canSubmit = useAppSelector(selectCanSubmitTicket);

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <TextInput label="Name" />
      <TextInput label="Email" />
      <>
        {attachment_url && (
          <View style={styles.row}>
            <>
              {attachment_type?.startsWith("image") ? (
                <Image
                  style={styles.image}
                  source={attachment_url}
                  placeholder={BLURHASH}
                  transition={1000}
                />
              ) : (
                <Text style={styles.title}>{attachment_name}</Text>
              )}
            </>
            <IconButton icon="close" iconColor="red" />
          </View>
        )}
        <Button>{attachment_url ? "Change" : "Add"} Attachment</Button>
      </>
      <TextInput label="Description" />
      <Button
        labelStyle={styles.submitText}
        mode="contained"
        disabled={!canSubmit}
      >
        Submit Ticket
      </Button>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {},
  title: {},
  row: {
    flexDirection: "row",
  },
  multiline: {},
  submitText: {},
});

export default TicketForm;
