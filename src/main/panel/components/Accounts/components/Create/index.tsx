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
import { CreateModalType } from "../../interface";

import { api } from "@/server";

type FieldType = {
  site?: string;
  username?: string;
  password?: string;
  note?: string;
};

const CreateAccount = ({
  visible,
  onOk,
  onClose,
  type = CreateModalType.CreateWebsite,
  siteValue,
  siteId,
}: {
  visible: boolean;
  onOk: (values: FieldType) => void;
  onClose: () => void;
  type: CreateModalType;
  siteValue?: string;
  siteId?: string;
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for the entire Modal

  const addWebsite = (site: string, note: string) => {
    return api.addWebsite(site, note);
  };

  const addAccount = (
    websiteId: string,
    username: string,
    password: string,
    note?: string
  ) => {
    api
      .addAccount(websiteId, username, password, note)
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

        if (type === CreateModalType.CreateWebsite) {
          const websiteId = await addWebsite(site, note);

          if (username && password) {
            addAccount(websiteId, username, password);
          } else {
            messageApi.open({
              type: "success",
              content: "CreateWebsite created successfully!",
            });
          }
        } else if (type === CreateModalType.CreateAccount) {
          if (siteId) {
            addAccount(siteId, username, password, note);
          }
        } else if (type === CreateModalType.UpdateWebsite) {
          if (siteId) {
            await api.updateWebsite(siteId, site, note);
            messageApi.open({
              type: "success",
              content: "Website updated successfully!",
            });
          }
        }
        onOk(values);
        form.resetFields();
        setPassword("");
        onClose();
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
    if (!visible) {
      return;
    }
    if (siteValue) {
      form.setFieldsValue({ site: siteValue });
    }
  }, [visible, siteValue, form]);

  return (
    <Modal
      getContainer={false}
      title={
        type === CreateModalType.CreateWebsite
          ? "Create a new website"
          : type === CreateModalType.CreateAccount
          ? `Create a new account for ${siteValue}`
          : `Update website: ${siteValue}`
      }
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
              [
                CreateModalType.CreateWebsite,
                CreateModalType.UpdateWebsite,
              ].includes(type)
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
                defaultValue={siteValue}
                disabled={type === CreateModalType.CreateAccount}
                placeholder="input website!"
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
          {type !== CreateModalType.UpdateWebsite && (
            <>
              <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={
                  type === CreateModalType.CreateAccount
                    ? [
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]
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
                    prefix={
                      <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
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
                  type === CreateModalType.CreateAccount
                    ? [
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]
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
                    prefix={
                      <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
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
            </>
          )}
          <Form.Item<FieldType>
            label={
              [
                CreateModalType.CreateWebsite,
                CreateModalType.UpdateWebsite,
              ].includes(type)
                ? "Note"
                : "Site note"
            }
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
