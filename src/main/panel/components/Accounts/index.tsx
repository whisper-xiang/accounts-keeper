import { useState, useEffect } from "react";
import { Button, Space, Input, Collapse, Layout, Card } from "antd";
import {
  CaretRightOutlined,
  CopyOutlined,
  LockOutlined,
  FileAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { WebsiteItem, AccountItem } from "./interface"; // Adjust import based on actual location
import api from "@/server/api";
import "./index.less";
import CreateAccountModal from "./components/Create";
import CreateAccount from "./components/Create";

const Accounts: React.FC = () => {
  const { Search, TextArea } = Input;
  const { Header, Content } = Layout;

  const [list, setList] = useState<WebsiteItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredList, setFilteredList] = useState(list); // 筛选后的数据
  const [loading, setLoading] = useState(true); // 加载状态

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 模糊搜索
    const searchText = e.target.value;
    const filtered = list.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredList(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getAllAccounts();
        console.log(res);

        setList(res);
        setFilteredList(res);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs only once

  const removeAccount = (index: number, websiteItem: WebsiteItem) => () => {
    const newList = [...filteredList];

    websiteItem.children.splice(index, 1);

    console.log(websiteItem, index, "websiteItem");

    setFilteredList([...newList]);

    // const activeItem =
    // websiteItem? websiteItem.children[index] : filteredList[index].children[index];

    // console.log(objectId);

    // if (objectId) {
    //   const newList = [...filteredList];
    //   newList[index].children = newList[index].children.filter(
    //     (item) => item.objectId !== objectId
    //   );
    //   setFilteredList(newList);

    //   // api.removeAccount(objectId);
    // } else {
    //   // const newList = [...filteredList];
    //   // newList.splice(index, 1);
    //   // setFilteredList(newList);
    // }
  };

  const createAccount =
    (item: AccountItem, index: number, websiteId?: string) => () => {
      const newList = [...filteredList];
      newList[index].children.push(item);
      setFilteredList(newList);

      // api.createAccount({ ...item, websiteId });
    };

  const toEdit = (objectId: string, index: number) => () => {
    // TODO: 编辑账号
    const newList = [...filteredList];
    newList[index].children = newList[index].children.map((item) =>
      item.objectId === objectId ? { ...item, isEditing: true } : item
    );
    setFilteredList(newList);
  };

  const toUpdate = (accountItem: AccountItem, index: number) => () => {
    const newList = [...filteredList];
    newList[index].children = newList[index].children.map((item) =>
      item.objectId === item.objectId
        ? { ...item, ...accountItem, isEditing: false }
        : item
    );

    setFilteredList(newList);

    // api.updateAccount(item);
  };

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
                        onClick={removeAccount(i, item)}
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
                        onClick={createAccount(child, i, item.objectId)}
                      >
                        Save
                      </a>
                    </>
                  )
                }
              >
                <Space.Compact style={{ width: "100%" }} direction="horizontal">
                  <Input
                    placeholder="default size"
                    prefix={<UserOutlined />}
                    defaultValue={child.account}
                    disabled={!child.isEditing}
                  />
                  <Button type="default">
                    <CopyOutlined />
                  </Button>
                </Space.Compact>
                <Space.Compact style={{ width: "100%" }} className="mt-2">
                  <Input
                    prefix={<LockOutlined />}
                    defaultValue={child.password}
                    disabled={!child.isEditing}
                  />
                  <Button type="default">
                    <CopyOutlined />
                  </Button>
                </Space.Compact>
                <Space style={{ width: "100%" }} className="mt-2">
                  <TextArea
                    disabled={!child.isEditing}
                    defaultValue={child.remark}
                  />
                </Space>
              </Card>
            </div>
          ))}
        </div>
      ),
    }));
  };

  const genExtra = (objectId: string, index: number) => (
    <FileAddOutlined
      onClick={(event) => {
        event.stopPropagation();
        list[index].children.push({
          account: "",
          password: "",
          remark: "",
          isEditing: true,
        });
        setList([...list]);
      }}
    />
  );

  const createWebsite = (data) => {
    console.log(data, "create website");
    setVisible(false);

    // api.createWebsite(data);
    const newList = [...filteredList];
    newList.push({
      name: data.name,
      objectId: "",
      children: [],
    });
    setFilteredList(newList);

    // api.createWebsite(data);
  };

  const [visible, setVisible] = useState(false);
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
        ></Button>
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
