import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import LayoutWrapper from "./components/Layout/layout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider>
      <LayoutWrapper />
    </ConfigProvider>
  </StrictMode>
);
