import React, { useState, useEffect } from "react";
import { Divider, Form, Input, Layout, Modal, Spin } from "antd";
import { CreateModalType, WebsiteItem } from "./interface";
import CreateSiteModal from "./components/Create";
import AccountsHeader from "./components/AccountsHeader/index.tsx";
import AccountsMain from "./components/AccountsMain/index.tsx";
import { api, apiReady } from "@/server";
import "./index.less";
import {
  getSettingsConfigs,
  updateSettingConfigs,
} from "@/server/configCache.ts";
import { LockOutlined } from "@ant-design/icons";
import { initializeMasterPassword } from "@/server/utils.ts";
const Accounts = () => {
  const { Content, Header } = Layout;

  const [list, setList] = useState<WebsiteItem[]>();
  const [filteredList, setFilteredList] = useState<WebsiteItem[]>();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [createModalType, setCreateModalType] = useState<CreateModalType>(
    CreateModalType.CreateWebsite
  );
  const [activeWebsite, setActiveWebsite] = useState<WebsiteItem>();
  const [loading, setLoading] = useState(true);
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
      await apiReady;
      const res = await api("fetchAndAssembleData");
      setList(res);
      setFilteredList(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      await updateSettingConfigs({
        masterPassword: values.masterPassword,
      });
      await initializeMasterPassword();
      setMasterCreateVisible(false);
      setVisible(true);
    });
  };

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
        onOk={onFinish}
        onClose={() => setMasterCreateVisible(false)}
        onCancel={() => setMasterCreateVisible(false)}
        title="提示"
      >
        <p>需要先设置主密码，才能存储账号。</p>
        <Form
          form={form}
          name="createMaster"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
        >
          <Form.Item
            label="Master Password"
            name="masterPassword"
            rules={[
              {
                required: true,
                message: "Please input your master Password!",
              },
            ]}
          >
            <Input.Password
              placeholder="input masterPassword"
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            ></Input.Password>
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
          3. 主密码只存储在本地，一旦丢失，所记录的所有账号密码将无法解密。
        </strong>
      </Modal>
    </Layout>
  );
};

export default Accounts;
