import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import TicketForm from "@/features/create-ticket/TicketForm";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <TicketForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
