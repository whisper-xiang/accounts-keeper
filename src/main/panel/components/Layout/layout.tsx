import React, { useState } from "react";
import { Layout } from "antd";
import "./layout.less";
import Main from "./Main";
import SideBar from "./SideBar";
import { SideBarItem } from "./interface.ts";

const { Content, Sider } = Layout;

const LayoutWrapper: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<SideBarItem | null>(null);

  const handleSideBarItemClick = (item: SideBarItem) => {
    setSelectedItem(item); // 更新选中的侧边栏项
  };

  return (
    <Layout className="layout-wrapper">
      <Content>
        <Main selectedItem={selectedItem} /> {/* 将选中的项传递给 Main 组件 */}
      </Content>
      <Sider width="60px">
        <SideBar onItemClick={handleSideBarItemClick} />
      </Sider>
    </Layout>
  );
};

export default LayoutWrapper;
