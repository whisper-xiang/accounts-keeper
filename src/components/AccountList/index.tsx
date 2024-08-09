import {
  Button,
  Space,
  message,
  Input,
  Col,
  Row,
  Collapse,
  Flex,
  Layout,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

import "./style.less";

import api from "@api";
import { useEffect, useState } from "react";

const AccountList = () => {
  const { Search } = Input;
  const { Header, Footer, Content } = Layout;

  const [list, setList] = useState([]);

  // 使用 useEffect 来在组件加载时获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        api.getAllAccounts().then((res) => {
          console.log(res, "res");

          setList(res);
        });
      } catch (error) {
        // setError(error.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []); // 空数组意味着这个 effect 只在组件挂载时运行一次

  const panelStyle = {
    marginBottom: 24,
    background: "#fcfcfc",
    borderRadius: 5,
    border: "none",
  };

  const onChange = (key) => {
    console.log(key);
  };

  const getItems = () => {
    return list.map((item) => {
      return {
        key: item.id,
        label: item.name,
        children: (
          <div>
            {item.children.map((child) => {
              return (
                <>
                  <Space direction="horizontal">
                    <Input value={child.account} />
                    <Button style={{ width: 80 }}>copy</Button>
                  </Space>
                  <Space direction="horizontal">
                    <Input.Password value={item.password} />
                    <Button style={{ width: 80 }}>copy</Button>
                  </Space>
                </>
              );
            })}
          </div>
        ),
        style: panelStyle,
      };
    });
  };

  return (
    <Layout className="account-list-wrapper">
      <Header className="account-list-header">
        <Row>
          <Col span={16}>
            <Search
              placeholder="input search text"
              allowClear
              onChange={onChange}
            />
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              className="ml-2"
              onClick={() => message.success("Add account")}
            >
              {" "}
              +{" "}
            </Button>
          </Col>
        </Row>
      </Header>
      <Content>
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
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default AccountList;
