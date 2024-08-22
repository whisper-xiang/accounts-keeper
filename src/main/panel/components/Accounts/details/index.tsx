import React, { useEffect, useState } from "react";
import {
  ArrowLeftOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
  FormProps,
  Input,
  Space,
} from "antd";
import { useLocation } from "react-router-dom";
import "./index.less";

const actions: React.ReactNode[] = [
  <EditOutlined key="edit" onClick={() => console.log("Edit")} />,
  <SettingOutlined key="setting" />,
  <EllipsisOutlined key="ellipsis" />,
];

const Details: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const location = useLocation();

  useEffect(() => {
    // 打印当前路径到控制台
    console.log("Current route:", location.pathname, window.location.href);
  }, [location]);

  return (
    <div className="accounts-details">
      <header>
        <h1>
          <ArrowLeftOutlined /> Accounts Details
          <Button>+</Button>
        </h1>
      </header>
      <Flex
        gap="middle"
        align="start"
        vertical
        className="accounts-details-card"
      >
        {[1, 2, 3].map((item) => (
          <Card loading={loading} actions={actions} style={{ minWidth: 300 }}>
            <Card.Meta
              avatar={
                <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
              }
              title="google"
              description={
                <Form
                  style={{ width: "100%" }}
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Flex wrap gap="small">
                    <Form.Item<FieldType>
                      label="Username"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                      label="Sites"
                      name="Sites"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Space.Compact block>
                      <Form.Item<FieldType>
                        label="Note"
                        name="Note"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Space.Compact>
                  </Flex>
                </Form>
              }
            />
          </Card>
        ))}
      </Flex>
    </div>
  );
};

export default Details;
