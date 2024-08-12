import React, { useState, useEffect } from "react";
import { Button, Input, Space, Collapse, Layout, Card } from "antd";
import {
  CaretRightOutlined,
  CopyOutlined,
  LockOutlined,
  FileAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { WebsiteItem, AccountItem } from "./interface";
import api from "@/server/api";
import "./index.less";
import CreateAccountModal from "./components/Create";
import {
  getDatabase,
  createWebsite as createWebsiteStorage,
  createAccount as createAccountStorage,
  removeAccount as removeAccountStorage,
} from "@/server/storage";

const Accounts: React.FC = () => {
  const { Search, TextArea } = Input;
  const { Header, Content } = Layout;

  const [list, setList] = useState<WebsiteItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredList, setFilteredList] = useState<WebsiteItem[]>(list);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    const filtered = list.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredList(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDatabase().finally(() => setLoading(false));
        console.log(res);

        setList(res);
        setFilteredList(res);
      } catch (error) {
        setError(error?.message);
      }
    };

    fetchData();
  }, []);

  const removeAccount =
    (index: number, websiteItem: WebsiteItem, accountId?: string) => () => {
      const newList = [...filteredList];
      websiteItem.children.splice(index, 1);
      setFilteredList([...newList]);

      console.log(accountId, "accountId");

      if (accountId) {
        removeAccountStorage({ websiteId: websiteItem.objectId, accountId });
      }
    };

  const createAccount = (account: AccountItem, websiteId?: string) => () => {
    createAccountStorage({ websiteId, account });
  };

  const toEdit = (objectId: string, index: number) => () => {
    const newList = [...filteredList];
    newList[index].children = newList[index].children.map((item) =>
      item.objectId === objectId ? { ...item, isEditing: true } : item
    );
    setFilteredList(newList);
  };

  const toUpdate = (accountItem: AccountItem, index: number) => () => {
    const newList = [...filteredList];
    newList[index].children = newList[index].children.map((item) =>
      item.objectId === accountItem.objectId
        ? { ...item, ...accountItem, isEditing: false }
        : item
    );
    setFilteredList(newList);
  };

  const genExtra = (objectId: string, index: number) => (
    <FileAddOutlined
      onClick={(event) => {
        event.stopPropagation();
        const newList = [...filteredList];
        newList[index].children.push({
          account: "",
          password: "",
          remark: "",
          isEditing: true,
        });
        setFilteredList(newList);
      }}
    />
  );

  const getItems = () => {
    return filteredList.map((item: WebsiteItem, index) => ({
      key: index + item.name,
      label: item.name,
      extra: genExtra(item.objectId as string, index),
      children: (
        <div>
          {item.children.map((child: AccountItem, i) => (
            <div key={i + child.account}>
              <Card
                type="inner"
                extra={
                  child.objectId ? (
                    <>
                      {child.isEditing ? (
                        <a
                          href="#"
                          className="ml-2"
                          onClick={toUpdate(child, i)}
                        >
                          Save
                        </a>
                      ) : (
                        <a href="#" onClick={toEdit(child.objectId, i)}>
                          Edit
                        </a>
                      )}

                      <a
                        href="#"
                        className="ml-2"
                        onClick={removeAccount(i, item, child.objectId)}
                      >
                        Remove
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href="#"
                        className="ml-2"
                        onClick={removeAccount(i, item)}
                      >
                        Remove
                      </a>
                      <a
                        href="#"
                        className="ml-2"
                        onClick={createAccount(child, item.objectId)}
                      >
                        Save
                      </a>
                    </>
                  )
                }
              >
                <Space.Compact style={{ width: "100%" }} direction="horizontal">
                  <Input
                    placeholder="Account"
                    prefix={<UserOutlined />}
                    value={child.account}
                    onChange={(e) => {
                      const newList = [...filteredList];
                      newList[index].children[i].account = e.target.value;
                      setFilteredList(newList);
                    }}
                    disabled={!child.isEditing}
                  />
                  <Button type="default">
                    <CopyOutlined />
                  </Button>
                </Space.Compact>
                <Space.Compact style={{ width: "100%" }} className="mt-2">
                  <Input
                    prefix={<LockOutlined />}
                    value={child.password}
                    onChange={(e) => {
                      const newList = [...filteredList];
                      newList[index].children[i].password = e.target.value;
                      setFilteredList(newList);
                    }}
                    disabled={!child.isEditing}
                  />
                  <Button type="default">
                    <CopyOutlined />
                  </Button>
                </Space.Compact>
                <Space style={{ width: "100%" }} className="mt-2">
                  <TextArea
                    value={child.remark}
                    onChange={(e) => {
                      const newList = [...filteredList];
                      newList[index].children[i].remark = e.target.value;
                      setFilteredList(newList);
                    }}
                    disabled={!child.isEditing}
                  />
                </Space>
              </Card>
            </div>
          ))}
        </div>
      ),
    }));
  };

  const createWebsite = async (data) => {
    setVisible(false);
    const result = await createWebsiteStorage(data);

    const newList = [...filteredList];
    newList.push(result);
    setFilteredList(newList);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout className="account-list-wrapper">
      <Header className="account-list-header">
        <Search
          placeholder="Input search text"
          allowClear
          onChange={onChange}
        />
        <Button
          icon={<FileAddOutlined />}
          onClick={() => setVisible(true)}
          className="ml-2"
          type="primary"
        />
      </Header>
      <Content>
        {error && <div className="error">{error}</div>}
        <Collapse
          bordered={false}
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          style={{ background: "#fff" }}
          items={getItems()}
        />
      </Content>
      <CreateAccountModal
        visible={visible}
        onClose={() => setVisible(false)}
        onOk={(data) => createWebsite(data)}
      />
    </Layout>
  );
};

export default Accounts;
