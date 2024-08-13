import React, { useState } from "react";
import "./style.less";
import Main from "./Main.tsx";
import SideBar from "./SideBar.tsx";
import { SideBarItem } from "./interface.ts";

import { Layout } from "antd";

const { Header, Sider, Content } = Layout;

const LayoutWrapper: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<SideBarItem | null>(null);

  const handleSideBarItemClick = (item: SideBarItem) => {
    setSelectedItem(item); // 更新选中的侧边栏项
  };

  return (
    <Layout className="layout-wrapper">
      <Layout className="article">
        {/* <Header className="header">header</Header> */}
        <Content>
          <Main selectedItem={selectedItem} />
        </Content>
      </Layout>
      <Sider className="aside" width={60}>
        <SideBar onItemClick={handleSideBarItemClick} />
      </Sider>
    </Layout>
  );
};

export default LayoutWrapper;
