import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize, KeyboardStyle } from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: "com.flints.companion",
  appName: "Flints",
  webDir: "dist",
  backgroundColor: "#FAFAF9",
  loggingBehavior: "debug",
  ios: {
    contentInset: "never",
    backgroundColor: "#FAFAF9",
    preferredContentMode: "mobile",
  },
  plugins: {
    Keyboard: { resize: KeyboardResize.Native, style: KeyboardStyle.Light },
    StatusBar: { style: "LIGHT" },
  },
};

export default config;
