import { useAppDispatch, useAppSelector } from "@/redux/reduxHooks";
import {
  selectTicketList,
  selectTicketListRefreshing,
  triggerTicketListRefresh,
} from "@/redux/slices/ticketListSlice";
import { Tables } from "@/supabase/types";
import { Link } from "expo-router";
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Divider, Text } from "react-native-paper";

type Props = {};

// renders a FlatList containing the support tickets in the system
// individual tickets can be selected to see full details and respond
const TicketList = ({}: Props) => {
  const dispatch = useAppDispatch();
  const ticketData = useAppSelector(selectTicketList);
  const refreshing = useAppSelector(selectTicketListRefreshing);

  const renderItem = (info: ListRenderItemInfo<Tables<"tickets">>) => {
    return (
      <Link
        href={{
          pathname: "../modal/admin-ticket/[id]",
          params: { id: info.item.id },
        }}
        asChild
      >
        <Pressable>
          <View style={styles.itemContainer}>
            <View style={styles.info}>
              <View style={styles.label}>
                <Text numberOfLines={1} style={styles.name}>
                  {info.item.name}
                </Text>
                <Text numberOfLines={1} style={styles.email}>
                  {info.item.email}
                </Text>
              </View>
              <Text style={styles.description} numberOfLines={1}>
                {info.item.description}
              </Text>
            </View>
            <View style={styles.status}>
              <Text>{info.item.status}</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  const separator = () => {
    return <Divider />;
  };

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={ticketData}
      renderItem={renderItem}
      ItemSeparatorComponent={separator}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => dispatch(triggerTicketListRefresh())}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {},
  itemContainer: {},
  info: {},
  label: {},
  spacer: {},
  name: {},
  email: {},
  description: {},
  status: {},
});

export default TicketList;
