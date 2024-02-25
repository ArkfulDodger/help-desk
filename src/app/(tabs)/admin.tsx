import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import TicketList from "@/features/manage-tickets/TicketList";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <TicketList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
