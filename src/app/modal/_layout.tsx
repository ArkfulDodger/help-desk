import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";

import { Slot, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/utils/Colors";

// Modal Screen "wrapper" for displaying any of the contained screens
// if presented as a standalone screen, will apply missing safe area edges
export default function ModalScreen() {
  const isPresented = router.canGoBack();
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      edges={!isPresented || Platform.OS === "android" ? ["top", "bottom"] : []}
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        },
      ]}
    >
      <Slot />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar
        style={Platform.OS === "ios" && isPresented ? "light" : "auto"}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
