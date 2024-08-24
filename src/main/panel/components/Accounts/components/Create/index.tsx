import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Divider,
  Button,
  Space,
  Tooltip,
  message,
  Spin,
} from "antd";
import {
  CopyOutlined,
  GlobalOutlined,
  JavaScriptOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { generateRandomPassword } from "~utils";
import "./index.less";
import {
  addWebsite as addWebsiteApi,
  addAccount as addAccountApi,
} from "@/server/cloud";

type FieldType = {
  site?: string;
  username?: string;
  password?: string;
  note?: string;
};

enum CreateType {
  Website = "website",
  Account = "account",
}

const CreateAccount = ({
  visible,
  onOk,
  onClose,
  type = "website",
  siteValue,
  siteId,
}: {
  visible: boolean;
  onOk: (values: FieldType) => void;
  onClose: () => void;
  type: "account" | "website";
  siteValue?: string;
  siteId?: string;
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [password, setPassword] = useState("");
  const [site, setSite] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for the entire Modal

  const addWebsite = (site: string, note: string) => {
    return addWebsiteApi(site, note);
  };

  const addAccount = (
    websiteId: string,
    username: string,
    password: string,
    note?: string
  ) => {
    addAccountApi(websiteId, username, password, note)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Account created successfully!",
        });
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error,
        });
      });
  };

  const onOkHandler = () => {
    setLoading(true); // Start loading
    form
      .validateFields()
      .then(async (values) => {
        const { site, username, password, note } = values;

        if (type === CreateType.Website) {
          const websiteId = await addWebsite(site, note);

          if (username && password) {
            addAccount(websiteId, username, password);
          } else {
            messageApi.open({
              type: "success",
              content: "Website created successfully!",
            });
          }
        } else {
          if (siteId) {
            addAccount(siteId, username, password);
          }
        }
        onOk(values);
        onClose();
        form.resetFields();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const copyTextToClipboard = (text: string): void => {
    if (!text) {
      messageApi.open({
        type: "error",
        content: "Please input text to copy",
      });
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      messageApi.open({
        type: "success",
        content: "Text copied successfully!",
      });
    });
  };

  const handlePasswordGeneration = () => {
    const newPassword = generateRandomPassword();
    if (newPassword) {
      setPassword(newPassword); // Update the password state
      form.setFieldsValue({ password: newPassword });
    } else {
      messageApi.open({
        type: "error",
        content: "Failed to generate password!",
      });
    }
  };

  useEffect(() => {
    if (siteValue) {
      form.setFieldsValue({ site: siteValue });
      setSite(siteValue); // Update the site state
    }
  }, []);

  return (
    <Modal
      title="Create website"
      open={visible}
      onOk={onOkHandler}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onOkHandler}
          disabled={loading}
        >
          Submit
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          form={form}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Site"
            name="site"
            rules={
              type === "website"
                ? [{ required: true, message: "Please input your website!" }]
                : [
                    {
                      required: false,
                    },
                  ]
            }
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input
                disabled={type === "account"}
                placeholder="input website!"
                defaultValue={site}
                prefix={<GlobalOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              />
              <Tooltip title="copy to clipboard">
                <Button
                  type="default"
                  onClick={() => {
                    copyTextToClipboard(form.getFieldValue("site"));
                  }}
                >
                  <CopyOutlined />
                </Button>
              </Tooltip>
            </Space.Compact>
          </Form.Item>
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={
              type === "account"
                ? [{ required: true, message: "Please input your username!" }]
                : [
                    {
                      required: false,
                    },
                  ]
            }
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder="input username"
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              />
              <Tooltip title="copy to clipboard">
                <Button
                  type="default"
                  onClick={() => {
                    copyTextToClipboard(form.getFieldValue("username"));
                  }}
                  tabIndex={-1}
                >
                  <CopyOutlined />
                </Button>
              </Tooltip>
            </Space.Compact>
          </Form.Item>
          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={
              type === "account"
                ? [{ required: true, message: "Please input your password!" }]
                : [
                    {
                      required: false,
                    },
                  ]
            }
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input.Password
                placeholder="input password"
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                value={password} // Bind the password state to the input value
                onChange={(e) => setPassword(e.target.value)} // Ensure changes to the input update the state
              />
              <Tooltip title="password generator">
                <Button type="default" onClick={handlePasswordGeneration}>
                  <JavaScriptOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="copy to clipboard">
                <Button
                  type="default"
                  tabIndex={-1}
                  onClick={() => {
                    copyTextToClipboard(form.getFieldValue("password"));
                  }}
                >
                  <CopyOutlined />
                </Button>
              </Tooltip>
            </Space.Compact>
          </Form.Item>
          Make sure you're saving your current password for this site
          <Divider dashed />
          <Form.Item<FieldType>
            label={type === "account" ? "Note" : "Site note"}
            name="note"
          >
            <TextArea placeholder="input note" allowClear />
          </Form.Item>
        </Form>
      </Spin>
      {contextHolder}
    </Modal>
  );
};

export default CreateAccount;
