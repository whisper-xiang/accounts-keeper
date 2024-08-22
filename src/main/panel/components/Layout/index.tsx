import React, { Suspense, useState } from "react";
import "./style.less";
import SideBar from "./SideBar.tsx";
import { SideBarItem } from "./interface.ts";
import { Layout } from "antd";
import { Routes, Route, useNavigate } from "react-router-dom";

import Details from "../Accounts/details/index.tsx";
import PwdGenerator from "../Generator/index.tsx";
import Settings from "../Settings/index.tsx";

const Accounts = React.lazy(() => import("../Accounts/index"));

const { Header, Sider, Content } = Layout;

const LayoutWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<SideBarItem | null>(null);

  const handleSideBarItemClick = (item: SideBarItem) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <Layout className="layout-wrapper">
      <Layout className="article">
        <Content>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Accounts />} />
              <Route path="/details" element={<Details />} />
              <Route path="/pwd-generator" element={<PwdGenerator />} />
              <Route path="/settings" element={<Settings />} />
              {/* 其他路由 */}
            </Routes>
          </Suspense>
        </Content>
      </Layout>
      <Sider className="aside" width={60}>
        <SideBar onItemClick={handleSideBarItemClick} />
      </Sider>
    </Layout>
  );
};

export default LayoutWrapper;
