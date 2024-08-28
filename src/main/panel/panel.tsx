import { StrictMode } from "react";
import { ConfigProvider } from "antd";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import Layout from "./components/Layout/index.tsx";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <StrictMode>
      <ConfigProvider
        theme={{
          components: {
            Card: {
              headerHeight: 32,
            },
          },
          token: {
            colorPrimary: "rgba(37, 131, 131, 0.4)",
          },
        }}
      >
        <Layout />
      </ConfigProvider>
    </StrictMode>
  </HashRouter>
);
