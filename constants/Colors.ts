/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    textInteractive: "#0c56d0",
    background: "#fff",
    backgroundInteractive: "#5ad8e9",
    icon: "#687076",
    placeholder: "#2f94a1",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    tint: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    textInteractive: "#fff",
    disabled: "#ccc",
    background: "#151718",
    backgroundInteractive: "#5ad8e9",
    icon: "#9BA1A6",
    placeholder: "#2f94a1",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    tint: tintColorDark,
  },
};
