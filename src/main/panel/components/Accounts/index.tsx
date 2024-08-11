import { useState, useEffect } from "react";
import { Button, Space, Input, Collapse, Layout, Divider, Card } from "antd";
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

  // Generate items for Collapse component
  const getItems = () => {
    return filteredList.map((item: WebsiteItem, index) => ({
      key: index,
      label: item.name,
      // extra: genExtra(item.objectId as string, index),
      children: (
        <div>
          {item.children.map((child: AccountItem) => (
            <div key={index + child.account}>
              <Card
                type="inner"
                extra={
                  child.objectId ? (
                    <>
                      <a href="#" onClick={() => {}}>
                        Edit
                      </a>
                      <a href="#" className="ml-2">
                        Remove
                      </a>
                    </>
                  ) : (
                    <>
                      <a href="#" className="ml-2">
                        Remove
                      </a>
                      <a href="#" className="ml-2">
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
                    disabled
                    value={child.account}
                  />
                  <Button type="default">
                    <CopyOutlined />
                  </Button>
                </Space.Compact>
                <Space.Compact style={{ width: "100%" }} className="mt-2">
                  <Input
                    prefix={<LockOutlined />}
                    defaultValue="Combine input and button"
                    value={child.password}
                    disabled
                  />
                  <Button type="default">
                    <CopyOutlined />
                  </Button>
                </Space.Compact>
                <Space style={{ width: "100%" }} className="mt-2">
                  <TextArea
                    defaultValue="Combine input and button"
                    value={child.remark}
                    readOnly
                  />
                </Space>
              </Card>
            </div>
          ))}
        </div>
      ),
    }));
  };

  const genExtra = (objectId: string, index: number) => ({});
  // <FileAddOutlined
  //   onClick={(event) => {
  //     event.stopPropagation();

  //     list[index].children.push({
  //       account: "",
  //       password: "",
  //       remark: "",
  //     });
  //     setList([...list]);
  //   }}
  // />

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
        <Button icon={<FileAddOutlined />} onClick={() => setVisible(true)}>
          {" "}
        </Button>
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
        onOk={() => {}}
      />
    </Layout>
  );
};

export default Accounts;
