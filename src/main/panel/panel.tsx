import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import LayoutWrapper from "./components/Layout/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerHeight: 32,
            /* 这里是你的组件 token */
          },
        },
        token: {
          // Seed Token，影响范围大
          // colorPrimary: "#00b96b",
          // borderRadius: 2,
          // // 派生变量，影响范围小
          // colorBgContainer: "#f6ffed",
        },
      }}
    >
      <LayoutWrapper />
    </ConfigProvider>
  </StrictMode>
);
