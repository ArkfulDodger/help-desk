import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import { Slot, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Modal Screen "wrapper" for displaying any of the contained screens
// if presented as a standalone screen, will apply missing safe area edges
export default function ModalScreen() {
  const isPresented = router.canGoBack();

  return (
    <SafeAreaView
      edges={isPresented ? [] : ["top", "bottom"]}
      style={styles.container}
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
