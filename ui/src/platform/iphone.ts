import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";

/** Keep a single viewport contract for Safari and the iOS keyboard-resized WKWebView. */
export function initializeIPhoneLayout() {
  const root = document.documentElement;
  const updateViewport = () => {
    const viewport = window.visualViewport;
    root.style.setProperty(
      "--app-height",
      `${viewport?.height ?? window.innerHeight}px`,
    );
    root.style.setProperty("--viewport-top", `${viewport?.offsetTop ?? 0}px`);
  };
  updateViewport();
  window.visualViewport?.addEventListener("resize", updateViewport);
  window.visualViewport?.addEventListener("scroll", updateViewport);
  window.addEventListener("resize", updateViewport);

  if (Capacitor.getPlatform() === "ios") {
    root.classList.add("native-ios");
    void StatusBar.setStyle({ style: Style.Light }).catch(console.error);
    void Keyboard.addListener("keyboardWillShow", () => {
      root.classList.add("keyboard-open");
    });
    void Keyboard.addListener("keyboardDidShow", updateViewport);
    void Keyboard.addListener("keyboardWillHide", () => {
      root.classList.remove("keyboard-open");
    });
    void Keyboard.addListener("keyboardDidHide", updateViewport);
  }
}
