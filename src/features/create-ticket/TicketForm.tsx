import { useAppDispatch, useAppSelector } from "@/redux/reduxHooks";
import {
  handleTextInput,
  selectCanSubmitTicket,
  selectTicketInput,
} from "@/redux/slices/ticketInputSlice";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { Image } from "expo-image";
import { BLURHASH } from "@/utils/constants";
import useTicketAttachment from "./useTicketAttachment";

type Props = {};

// the user-facing form used to submit a new ticket
const TicketForm = ({}: Props) => {
  const dispatch = useAppDispatch();

  // the input field values
  const {
    name,
    email,
    description,
    attachment_url,
    attachment_name,
    attachment_type,
  } = useAppSelector(selectTicketInput);

  // whether the form can be submitted
  const canSubmit = useAppSelector(selectCanSubmitTicket);

  const { pickAttachment, removeAttachment } = useTicketAttachment();

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Name"
        value={name}
        textContentType="name"
        onChangeText={(text) =>
          dispatch(handleTextInput({ field: "name", input: text }))
        }
      />
      <TextInput
        label="Email"
        value={email}
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) =>
          dispatch(handleTextInput({ field: "email", input: text }))
        }
      />
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
            <IconButton
              icon="close"
              iconColor="red"
              onPress={removeAttachment}
            />
          </View>
        )}
        <Button onPress={pickAttachment}>
          {attachment_url ? "Change" : "Add"} Attachment
        </Button>
      </>
      <TextInput
        label="Description"
        value={description}
        contentStyle={styles.multiline}
        multiline
        onChangeText={(text) =>
          dispatch(handleTextInput({ field: "description", input: text }))
        }
      />
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
  image: {
    width: 100,
    height: 100,
  },
  title: {},
  row: {
    flexDirection: "row",
  },
  multiline: {},
  submitText: {},
});

export default TicketForm;
