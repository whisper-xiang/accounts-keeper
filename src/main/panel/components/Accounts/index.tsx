import React, { useState, useEffect } from "react";
import { Layout, Spin } from "antd";
import { CreateModalType, WebsiteItem } from "./interface";
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
  const [createModalType, setCreateModalType] = useState<CreateModalType>(
    CreateModalType.CreateWebsite
  );
  const [activeWebsite, setActiveWebsite] = useState<WebsiteItem>();
  const [loading, setLoading] = useState(true);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    const filtered = (list ?? []).filter((item) =>
      item.url.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const getWebsiteList = async () => {
    setLoading(true);
    try {
      const res = await fetchAndAssembleData();
      setList(res);
      setFilteredList(res);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (website: WebsiteItem, type: CreateModalType) => {
    setVisible(true);
    setCreateModalType(type);
    setActiveWebsite(website);
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
        <Spin spinning={loading}>
          <AccountsMain
            list={filteredList}
            openModal={(website, createModalType) =>
              openModal(website, createModalType)
            }
          />
        </Spin>
      </Content>
      <CreateSiteModal
        type={createModalType}
        siteValue={activeWebsite?.url}
        siteId={activeWebsite?.objectId}
        visible={visible}
        onClose={() => setVisible(false)}
        onOk={() => getWebsiteList()}
      />
    </Layout>
  );
};

export default Accounts;
