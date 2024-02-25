import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import Colors from "@/utils/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import useTicketsList from "@/features/manage-tickets/useTicketsList";

// used to display tab bar icons of appropriate size and placement
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// the root layout for the main tabs: user/admin
export default function TabLayout() {
  const colorScheme = useColorScheme();
  useTicketsList();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Create a Ticket",
          tabBarLabel: "User Panel",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Ticket List",
          tabBarLabel: "Admin Panel",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="th-list" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
