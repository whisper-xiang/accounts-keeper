import React, { useState, useEffect } from "react";
import { Divider, Form, Input, Layout, Modal, Spin } from "antd";
import { CreateModalType, WebsiteItem } from "./interface";
import CreateSiteModal from "./components/Create";
import AccountsHeader from "./components/AccountsHeader/index.tsx";
import AccountsMain from "./components/AccountsMain/index.tsx";
import { api } from "@/server";
import "./index.less";
import MasterCreateModal from "./components/MasterCreateModal";
import { getSettingsConfigs } from "../../../../server/configCache.ts";
import { useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
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
  const navigate = useNavigate();
  const [masterCreateVisible, setMasterCreateVisible] = useState(false);

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
      const res = await api.fetchAndAssembleData();
      console.log("res", res);

      setList(res);
      setFilteredList(res);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = async (type: CreateModalType, website?: WebsiteItem) => {
    const { masterPassword } = await getSettingsConfigs();

    if (!masterPassword) {
      setMasterCreateVisible(true);
      return;
    }

    setVisible(true);
    setCreateModalType(type);
    if (website) {
      setActiveWebsite(website);
    }
  };

  const onFinish = (value: string) => {};

  useEffect(() => {
    getWebsiteList();
  }, []);

  return (
    <Layout className="account-list-wrapper">
      <Header className="account-list-header header">
        <AccountsHeader
          setVisible={() => {
            setActiveWebsite(undefined);
            openModal(CreateModalType.CreateWebsite);
          }}
          onChange={onChange}
        />
      </Header>
      <Content className="account-list-content">
        <Spin spinning={loading}>
          <AccountsMain
            list={filteredList}
            openModal={(createModalType, website) =>
              openModal(createModalType, website)
            }
          />
        </Spin>
      </Content>
      <CreateSiteModal
        type={createModalType}
        activeSite={activeWebsite}
        visible={visible}
        onClose={() => setVisible(false)}
        onOk={() => getWebsiteList()}
      />
      <Modal
        open={masterCreateVisible}
        onOk={() => navigate("/settings")}
        onClose={() => setMasterCreateVisible(false)}
        onCancel={() => setMasterCreateVisible(false)}
        title="提示"
      >
        <p>需要先设置主密码，才能存储账号。</p>
        <Form
          name="createMaster"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          layout="vertical"
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item
            label="MasterPassword"
            name="masterPassword"
            rules={[
              {
                required: true,
                message: "Please input your masterPassword!",
              },
            ]}
          >
            <Input
              placeholder="input masterPassword"
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            ></Input>
          </Form.Item>
        </Form>

        <Divider />
        <strong>
          1. 请先创建主密码。所有账号密码会基于主密码进行加密存储。
        </strong>
        <br />
        <strong>
          2. 请务必牢记主密码，切勿泄露。
          <br />
          3. 主密码只存储在本地，一旦遗忘，所记录的所有账号密码将无法解密。
        </strong>
      </Modal>
      {/* <MasterCreateModal visible={masterCreateVisible} /> */}
    </Layout>
  );
};

export default Accounts;
