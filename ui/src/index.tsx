import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./index.css";
import "./iphone.css";
import { initializeIPhoneLayout } from "./platform/iphone";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { lazy, Suspense } from "react";

const DesignSystem = lazy(() =>
  import("./design-system/DesignSystem").then((module) => ({
    default: module.DesignSystem,
  })),
);

initializeIPhoneLayout();

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  const isDesignSystem =
    window.location.pathname.replace(/\/$/, "") === "/design-system";
  root.render(
    isDesignSystem ? (
      <Suspense
        fallback={<div className="p-8 text-primary">Loading UI library…</div>}
      >
        <DesignSystem />
      </Suspense>
    ) : (
      <App />
    ),
  );
}
