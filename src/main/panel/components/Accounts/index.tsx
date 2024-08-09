import { useState, useEffect } from "react";
import { Button, Space, Input, Collapse, Layout, Divider } from "antd";
import {
  CaretRightOutlined,
  CopyOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { WebsiteItem, AccountItem } from "./interface"; // Adjust import based on actual location
import api from "@/server/api";
import "./index.less";

const Accounts: React.FC = () => {
  const { Search } = Input;
  const { Header, Content } = Layout;

  const [list, setList] = useState<WebsiteItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getAllAccounts();
        console.log(res);

        setList(res);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs only once

  // Generate items for Collapse component
  const getItems = () => {
    return list.map((item) => ({
      key: item.id,
      label: item.name,
      children: (
        <div>
          {item.children.map((child: AccountItem) => (
            <div key={child.id}>
              <Space.Compact style={{ width: "100%" }} direction="horizontal">
                <Input
                  placeholder="default size"
                  prefix={<UserOutlined />}
                  readOnly
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
                  readOnly
                />
                <Button type="default">
                  <CopyOutlined />
                </Button>
              </Space.Compact>
              <Divider />
            </div>
          ))}
        </div>
      ),
    }));
  };

  return (
    <Layout className="account-list-wrapper">
      <Header className="account-list-header">
        <Search
          placeholder="Input search text"
          allowClear
          onChange={onChange}
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
    </Layout>
  );
};

export default Accounts;
