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
            colorPrimary: "#1DA57A",
            // Seed Token，影响范围大
            // colorPrimary: "#00b96b",
            // borderRadius: 2,
            // // 派生变量，影响范围小
            // colorBgContainer: "#f6ffed",
          },
        }}
      >
        <Layout />
      </ConfigProvider>
    </StrictMode>
  </HashRouter>
);
