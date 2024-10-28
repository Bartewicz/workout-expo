import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/view/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/view/ThemedView";
import { Colors } from "@/constants/Colors";

export default function WorkoutScreen() {
  const theme = useColorScheme() ?? "light";

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      header={
        <View style={styles.titleContainer}>
          <ThemedText type="title">Rozpocznij trening!</ThemedText>
          <HelloWave />
        </View>
      }
    >
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          1. Ćwiczenia na ilość powtórzeń:
        </ThemedText>
        <ThemedView
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <ThemedView
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
          </ThemedView>
          <ThemedView
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
          </ThemedView>
          <ThemedView
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
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          2. Ćwiczenia na czas:
        </ThemedText>
        <ThemedView
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <ThemedView
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "45%",
            }}
          >
            <ThemedText type="defaultSemiBold">Ile ćwiczeń</ThemedText>
            <TextInput
              keyboardType="numeric"
              maxLength={2}
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
          </ThemedView>
          <ThemedView
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "45%",
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
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          3. Wybierz czas przerw
        </ThemedText>
        <ThemedView
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <ThemedView
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
          </ThemedView>
          <ThemedView
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
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <View style={{ width: "50%", alignSelf: "center", height: 100 }}>
        <Pressable style={{ width: "100%" }}>
          <ThemedText type="defaultSemiBold" style={styles.forwardButton}>
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
    width: "100%",
    fontSize: 24,
    backgroundColor: Colors.dark.backgroundInteractive,
    borderRadius: 2,
    color: Colors.dark.textInteractive,
    textAlign: "center",
    paddingVertical: 10,
    marginTop: 25,
  },
});
