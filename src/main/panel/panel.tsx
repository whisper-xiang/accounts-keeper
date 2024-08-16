import { StrictMode } from "react";
import { ConfigProvider } from "antd";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import LayoutWrapper from "./components/Layout/index.tsx";

const App = () => {
  return (
    <Routes>
      <Route path="/src/main/panel/panel.html" element={<LayoutWrapper />} />
      {/* <Route path="about" element={<About />} /> */}
      {/* <Route path="contact" element={<Contact />} /> */}
    </Routes>
  );
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
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
        <App />
      </ConfigProvider>
    </StrictMode>
  </BrowserRouter>
);
