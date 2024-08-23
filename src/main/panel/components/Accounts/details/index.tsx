import React, { useEffect, useState } from "react";
import {
  ArrowLeftOutlined,
  CopyOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileAddOutlined,
  GlobalOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Form,
  FormProps,
  Input,
  Space,
  Tooltip,
} from "antd";
import "./index.less";
import CreateSiteModal from "../components/Create";
import { useParams } from "react-router-dom";
// import { createAccount } from "../../../../../server/storage";

const actions: React.ReactNode[] = [
  <EditOutlined key="edit" onClick={() => console.log("Edit")} />,
  <SettingOutlined key="setting" />,
  // <EllipsisOutlined key="ellipsis" />,
];

const Details: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const { id } = useParams();

  type FieldType = {
    site: string;
    username?: string;
    password?: string;
    note?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const createAccount = (data) => {
    console.log("create account", data);
    // createAccount(data).then(() => {
    //   setVisible(false);
    // });
  };

  const getAccountList = () => {};

  useEffect(() => {
    // 打印当前路径到控制台
  }, []);

  return (
    <div className="accounts-details-container">
      <header>
        <h1>
          <ArrowLeftOutlined /> Accounts Details
          <Button
            icon={<FileAddOutlined />}
            onClick={() => setVisible(true)}
            className="ml-2 header-button"
            type="primary"
          />
        </h1>
      </header>

      {[1, 2].map((item) => (
        <Card
          loading={loading}
          actions={actions}
          className="accounts-details-card"
          key={item}
        >
          <Card.Meta
            avatar={
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
            }
            // title={
            //   <span
            //     onClick={() => window.open(item.site)}
            //   >{`${item.site}`}</span>
            // }
            description={
              <Form
                name="basic"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item<FieldType> label="Site" name="site">
                  <Space.Compact style={{ width: "100%" }}>
                    <Input
                      placeholder="input website!"
                      prefix={
                        <GlobalOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                    />
                    <Tooltip title="copy to clipboard">
                      <Button
                        type="default"
                        onClick={() => {
                          // copyTextToClipboard(form.getFieldValue("site"));
                        }}
                      >
                        <CopyOutlined />
                      </Button>
                    </Tooltip>
                  </Space.Compact>
                </Form.Item>
                <Form.Item<FieldType> label="Username" name="username">
                  <Space.Compact style={{ width: "100%" }}>
                    <Input
                      placeholder="input username"
                      prefix={
                        <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                    />
                    <Tooltip title="copy to clipboard">
                      <Button
                        type="default"
                        onClick={() => {
                          // copyTextToClipboard(form.getFieldValue("username"));
                        }}
                      >
                        <CopyOutlined />
                      </Button>
                    </Tooltip>
                  </Space.Compact>
                </Form.Item>

                <Form.Item<FieldType>
                  label="Note"
                  name="note"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Form>
            }
          />
        </Card>
      ))}
      <CreateSiteModal
        visible={visible}
        type="account"
        siteValue="Facebook"
        onClose={() => setVisible(false)}
        onOk={(data) => createAccount(data)}
      />
    </div>
  );
};

export default Details;
