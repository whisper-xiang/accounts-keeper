import React, { useEffect, useState } from "react";
import "./style.less";
import Main from "./Main.tsx";
import SideBar from "./SideBar.tsx";
import { SideBarItem } from "./interface.ts";
import { Layout } from "antd";

import { Routes, Route, useNavigate } from "react-router-dom";
import Details from "../Accounts/details/index.tsx";

const Accounts = React.lazy(() => import("../Accounts/index"));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Accounts />} />
      <Route path="/details" element={<Details />} />
      {/* <Route path="contact" element={<Contact />} /> */}
    </Routes>
  );
};

const { Header, Sider, Content } = Layout;

const LayoutWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<SideBarItem | null>(null);

  const handleSideBarItemClick = (item: SideBarItem) => {
    console.log(212);

    // setSelectedItem(item); // 更新选中的侧边栏项
    navigate("/details"); // 跳转到对应的页面
  };

  return (
    <Layout className="layout-wrapper">
      <Layout className="article">
        {/* <Header className="header">header</Header> */}
        <Content>
          {/* <Main selectedItem={selectedItem} /> */}
          <App />
        </Content>
      </Layout>
      <Sider className="aside" width={60}>
        <SideBar onItemClick={handleSideBarItemClick} />
      </Sider>
    </Layout>
  );
};

export default LayoutWrapper;
