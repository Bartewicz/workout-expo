import {
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/view/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useWorkoutContext } from "@/store/workout/context";
import { useRouter } from "expo-router";
import { useCallback } from "react";

export default function PlannerScreen() {
  const theme = useColorScheme() ?? "light";
  const { actions, plan } = useWorkoutContext();
  const router = useRouter();

  const disabled = Object.values(plan).some((value) => !value);

  const onPressProceed = useCallback(() => {
    if (!disabled) {
      router.push("/workout");
    }
  }, [disabled]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      header={
        <View style={styles.titleContainer}>
          <ThemedText type="title">Zaplanuj swój trening 📝</ThemedText>
          <HelloWave />
        </View>
      }
    >
      <View style={styles.stepContainer}>
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          1. Ćwiczenia na ilość powtórzeń:
        </ThemedText>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
              width: "30%",
            }}
          >
            <ThemedText type="defaultSemiBold">Ile ćwiczeń</ThemedText>
            <TextInput
              keyboardType="numeric"
              maxLength={2}
              onChangeText={actions.setRepetitionExercisesCount}
              placeholder="1"
              placeholderTextColor={Colors.light.placeholder}
              selectionColor={
                theme === "light" ? Colors.dark.tint : Colors.light.tint
              }
              style={[
                styles.numericInput,
                theme === "light"
                  ? styles.numericInputBgLight
                  : styles.numericInputBgDark,
              ]}
            />
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "30%",
            }}
          >
            <ThemedText type="defaultSemiBold">Ile serii</ThemedText>
            <TextInput
              keyboardType="numeric"
              maxLength={2}
              onChangeText={actions.setRepetitionExerciseSetsCount}
              placeholder="1"
              placeholderTextColor={Colors.light.placeholder}
              selectionColor={
                theme === "light" ? Colors.dark.tint : Colors.light.tint
              }
              style={[
                styles.numericInput,
                theme === "light"
                  ? styles.numericInputBgLight
                  : styles.numericInputBgDark,
              ]}
            />
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "30%",
            }}
          >
            <ThemedText type="defaultSemiBold">Ile powtórzeń</ThemedText>
            <TextInput
              keyboardType="numeric"
              maxLength={2}
              onChangeText={actions.setRepetitionExerciseRepetitionsCount}
              placeholder="1"
              placeholderTextColor={Colors.light.placeholder}
              selectionColor={
                theme === "light" ? Colors.dark.tint : Colors.light.tint
              }
              style={[
                styles.numericInput,
                theme === "light"
                  ? styles.numericInputBgLight
                  : styles.numericInputBgDark,
              ]}
            />
          </View>
        </View>
      </View>
      <View style={styles.stepContainer}>
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          2. Ćwiczenia na czas:
        </ThemedText>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "30%",
            }}
          >
            <ThemedText type="defaultSemiBold">Ile ćwiczeń</ThemedText>
            <TextInput
              keyboardType="numeric"
              maxLength={2}
              onChangeText={actions.setTimedExercisesCount}
              placeholder="10"
              placeholderTextColor={Colors.light.placeholder}
              selectionColor={
                theme === "light" ? Colors.dark.tint : Colors.light.tint
              }
              style={[
                styles.numericInput,
                theme === "light"
                  ? styles.numericInputBgLight
                  : styles.numericInputBgDark,
              ]}
            />
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "30%",
            }}
          >
            <ThemedText type="defaultSemiBold">Ile serii</ThemedText>
            <TextInput
              keyboardType="numeric"
              maxLength={2}
              onChangeText={actions.setTimedExerciseSetsCount}
              placeholder="1"
              placeholderTextColor={Colors.light.placeholder}
              selectionColor={
                theme === "light" ? Colors.dark.tint : Colors.light.tint
              }
              style={[
                styles.numericInput,
                theme === "light"
                  ? styles.numericInputBgLight
                  : styles.numericInputBgDark,
              ]}
            />
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "30%",
            }}
          >
            <ThemedText type="defaultSemiBold">Czas trwania serii</ThemedText>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                position: "relative",
              }}
            >
              <TextInput
                keyboardType="numeric"
                maxLength={3}
                onChangeText={actions.setTimedExerciseDuration}
                placeholder="45"
                placeholderTextColor={Colors.light.placeholder}
                selectionColor={
                  theme === "light" ? Colors.dark.tint : Colors.light.tint
                }
                style={[
                  styles.numericInput,
                  theme === "light"
                    ? styles.numericInputBgLight
                    : styles.numericInputBgDark,
                ]}
              />
              <ThemedText
                type="defaultSemiBold"
                style={{
                  position: "absolute",
                  fontSize: 32,
                  lineHeight: 32,
                  left: 65,
                }}
              >
                sek.
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.stepContainer}>
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          3. Wybierz czas przerw
        </ThemedText>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "45%",
            }}
          >
            <ThemedText type="defaultSemiBold">Między ćwiczeniami:</ThemedText>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                position: "relative",
              }}
            >
              <TextInput
                keyboardType="numeric"
                maxLength={2}
                onChangeText={actions.setExercisesBreakDuration}
                placeholder="90"
                placeholderTextColor={Colors.dark.placeholder}
                selectionColor={
                  theme === "light" ? Colors.dark.tint : Colors.light.tint
                }
                style={[
                  styles.numericInput,
                  theme === "light"
                    ? styles.numericInputBgLight
                    : styles.numericInputBgDark,
                ]}
              />
              <ThemedText
                type="defaultSemiBold"
                style={{
                  position: "absolute",
                  fontSize: 32,
                  lineHeight: 32,
                  left: 65,
                }}
              >
                sek.
              </ThemedText>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "45%",
            }}
          >
            <ThemedText type="defaultSemiBold">Między seriami:</ThemedText>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                position: "relative",
              }}
            >
              <TextInput
                keyboardType="numeric"
                maxLength={2}
                onChangeText={actions.setSetsBreakDuration}
                placeholder="45"
                placeholderTextColor={Colors.dark.placeholder}
                selectionColor={
                  theme === "light" ? Colors.dark.tint : Colors.light.tint
                }
                style={[
                  styles.numericInput,
                  theme === "light"
                    ? styles.numericInputBgLight
                    : styles.numericInputBgDark,
                ]}
              />
              <ThemedText
                type="defaultSemiBold"
                style={{
                  position: "absolute",
                  fontSize: 32,
                  lineHeight: 32,
                  left: 65,
                }}
              >
                sek.
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <Pressable
          onPress={onPressProceed}
          disabled={disabled}
          style={{ width: "50%" }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.forwardButton,
              disabled && {
                backgroundColor: Colors.dark.placeholder,
                color: Colors.dark.disabled,
              },
            ]}
          >
            DALEJ
          </ThemedText>
        </Pressable>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  numericInput: {
    paddingVertical: 7,
    borderRadius: 2,
    width: 60,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "600",
  },
  numericInputBgDark: {
    backgroundColor: Colors.dark.backgroundInteractive,
  },
  numericInputBgLight: {
    backgroundColor: Colors.light.backgroundInteractive,
  },
  forwardButton: {
    backgroundColor: Colors.dark.backgroundInteractive,
    color: Colors.dark.textInteractive,
    width: "100%",
    fontSize: 24,
    borderRadius: 2,
    textAlign: "center",
    padding: 10,
    marginTop: 25,
  },
});
