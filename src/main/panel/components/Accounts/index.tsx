import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { WebsiteItem } from "./interface";
import CreateSiteModal from "./components/Create";
import AccountsHeader from "./components/AccountsHeader/index.tsx";
import AccountsMain from "./components/AccountsMain/index.tsx";
import { fetchAndAssembleData } from "@/server/cloud";
import "./index.less";

const Accounts = () => {
  const { Content, Header } = Layout;

  const [list, setList] = useState<WebsiteItem[]>();
  const [filteredList, setFilteredList] = useState<WebsiteItem[]>();
  const [visible, setVisible] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    const filtered = (list ?? []).filter((item) =>
      item.url.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const getWebsiteList = async () => {
    try {
      const res = await fetchAndAssembleData();

      setList(res);
      setFilteredList(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWebsiteList();
  }, []);

  return (
    <Layout className="account-list-wrapper">
      <Header className="account-list-header">
        <AccountsHeader setVisible={setVisible} onChange={onChange} />
      </Header>
      <Content className="account-list-content">
        <AccountsMain list={filteredList} />
      </Content>
      <CreateSiteModal
        type="website"
        visible={visible}
        onClose={() => setVisible(false)}
        onOk={() => getWebsiteList()}
      />
    </Layout>
  );
};

export default Accounts;
