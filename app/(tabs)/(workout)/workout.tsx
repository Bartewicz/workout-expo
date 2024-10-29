import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/view/ParallaxScrollView";
import { useWorkoutContext } from "@/store/workout/context";
import { StyleSheet, View } from "react-native";

export default function WorkoutScreen() {
  const { state } = useWorkoutContext();

  console.log("state from Workout Screen", state);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      header={
        <View style={styles.titleContainer}>
          <ThemedText type="title">Rozpocznij trening!</ThemedText>
        </View>
      }
    >
      <ThemedText>Hello, let's kick it off!</ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
