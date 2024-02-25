import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import AdminTicketView from "@/features/manage-tickets/AdminTicketView";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

type Params = {
  id: string; // number
};

export default function AdminTicketModal() {
  const params = useLocalSearchParams<Params>();
  const ticketId = useMemo(() => parseInt(params.id), [params.id]);

  return (
    <View style={styles.container}>
      <AdminTicketView ticketId={ticketId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
