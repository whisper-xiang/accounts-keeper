import React, { Suspense } from "react";
import "./style.less";
import SideBar from "./SideBar.tsx";
import { SideBarItem } from "./interface.ts";
import { Layout } from "antd";
import { Routes, Route, useNavigate } from "react-router-dom";

import Details from "../Accounts/details/index.tsx";
import PwdGenerator from "../Generator/index.tsx";
import Settings from "../Settings/index.tsx";
import About from "../About/index.tsx";

const Accounts = React.lazy(() => import("../Accounts/index"));

const { Sider, Content } = Layout;

const LayoutWrapper: React.FC = () => {
  const navigate = useNavigate();

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
              <Route path="/details/:id" element={<Details />} />
              <Route path="/pwd-generator" element={<PwdGenerator />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
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
