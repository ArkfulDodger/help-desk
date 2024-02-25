import { Alert, Linking, StyleSheet, View, useColorScheme } from "react-native";

import {
  Button,
  Divider,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHooks";
import {
  selectTicketById,
  updateTicketStatusById,
} from "@/redux/slices/ticketListSlice";
import useTicketStatusSheet from "./useTicketStatusSheet";
import Colors from "@/utils/Colors";
import { useState } from "react";
import { isStringNotEmpty } from "@/utils/helpers";
import { router } from "expo-router";

type Params = {
  ticketId: number;
};

const AdminTicketView = ({ ticketId }: Params) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const ticket = useAppSelector((state) => selectTicketById(state, ticketId));
  const [responseInput, setResponseInput] = useState("");

  // if back navigation is possible, back nav. Otherwise, navigate to root
  const onBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("../");
    }
  };

  const onStatusPress = useTicketStatusSheet();

  // if the attachment is selected, open in an external browser
  const onAttachmentPress = () => {
    if (!ticket?.attachment_url) return;
    Linking.openURL(ticket.attachment_url);
  };

  // console response if response sent, update status to in-progress if new
  const onSendPress = () => {
    if (!isStringNotEmpty(responseInput)) return;

    console.log("Would normally send email here with body:", responseInput);
    Alert.alert("Would normally send email here with body:", responseInput);

    setResponseInput("");
    if (ticket?.status === "new") {
      dispatch(updateTicketStatusById({ id: ticketId, status: "in progress" }));
    }
  };

  // return an error message if there is no ticket available for the passed id
  if (!ticket)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>This Ticket could not be retrieved</Text>
      </View>
    );

  return (
    <>
      <View style={styles.header}>
        <View style={styles.row}>
          <IconButton icon="chevron-left" onPress={onBackPress} />
          <Text style={[styles.title]}>Manage Ticket</Text>
        </View>
        <Button mode="contained" onPress={() => onStatusPress(ticketId)}>
          {ticket.status}
        </Button>
      </View>
      <Divider />
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.info}>
            <Text>
              <Text style={styles.title}>Name:</Text> {ticket.name}
            </Text>
            <Text numberOfLines={1}>
              <Text style={styles.title}>Email:</Text> {ticket.email}
            </Text>
          </View>
          <Button disabled={!ticket.attachment_url} onPress={onAttachmentPress}>
            {ticket.attachment_url ? "View" : "No"} Attachment
          </Button>
          <View>
            <Text style={styles.title}>Description:</Text>
            <View
              style={[
                styles.descriptionContainer,
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? Colors.dark.offBackground
                      : Colors.light.offBackground,
                },
              ]}
            >
              <Text>{ticket.description}</Text>
            </View>
          </View>
          <Divider style={styles.separator} />
          <Text style={styles.instructions}>
            Write your response to the patient in the field below
          </Text>
          <TextInput
            label={"Response"}
            multiline
            contentStyle={styles.input}
            value={responseInput}
            onChangeText={setResponseInput}
          />
          <Button
            mode={"contained"}
            onPress={onSendPress}
            disabled={!isStringNotEmpty(responseInput)}
          >
            Send Response
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  contentContainer: { marginVertical: 15, rowGap: 15, marginBottom: 100 },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  errorText: { color: "gray" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingRight: 20,
    paddingLeft: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: { fontSize: 18, fontWeight: "bold" },
  info: { rowGap: 5 },
  title: { fontSize: 18, fontWeight: "bold" },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
    alignSelf: "center",
  },
  descriptionContainer: {
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    borderRadius: 10,
    minHeight: 50,
    marginTop: 5,
  },
  instructions: { color: "gray", marginHorizontal: 40, textAlign: "center" },
  input: { minHeight: 100 },
});

export default AdminTicketView;
