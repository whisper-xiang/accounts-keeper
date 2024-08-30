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
import { CreateModalType, WebsiteItem } from "../../interface";

import { api, getFaviconUrl } from "@/server";

type FieldType = {
  site?: string;
  username?: string;
  password?: string;
  note?: string;
  logo?: string;
};

const CreateAccount = ({
  visible,
  onOk,
  onClose,
  type = CreateModalType.CreateWebsite,
  activeSite,
}: {
  visible: boolean;
  onOk: () => void;
  onClose: () => void;
  type?: CreateModalType;
  activeSite?: WebsiteItem;
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [password, setPassword] = useState("");
  const [site, setSite] = useState("");
  const [loading, setLoading] = useState(false);
  const [defaultSite, setDefaultSite] = useState<string | undefined>();

  const addWebsite = (site: string, note: string) => {
    const logo = getFaviconUrl(site) || "";
    return api("addWebsite", {
      url: site,
      note,
      logo,
    });
  };

  const addAccount = async (
    websiteId: string,
    username: string,
    password: string,
    note?: string
  ) => {
    await api("addAccount", websiteId, username, password, note)
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
    setLoading(true);
    form.setFieldValue(
      "site",
      form.getFieldValue("site")?.trim() || defaultSite
    );
    form
      .validateFields()
      .then(async (values) => {
        const { site, username, password, note } = values;

        if (type === CreateModalType.CreateWebsite) {
          const websiteId = await addWebsite(site, note);

          if (username && password) {
            await addAccount(websiteId, username, password);
          } else {
            messageApi.open({
              type: "success",
              content: "CreateWebsite created successfully!",
            });
          }
        } else if (type === CreateModalType.CreateAccount) {
          if (activeSite?.objectId) {
            await addAccount(activeSite?.objectId, username, password, note);
          }
        } else if (type === CreateModalType.UpdateWebsite) {
          if (activeSite?.objectId) {
            await api("updateWebsite", activeSite?.objectId, site, note);
            messageApi.open({
              type: "success",
              content: "Website updated successfully!",
            });
          }
        }
        onOk();
        handleResetAndClose();
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
      setPassword(newPassword);
      form.setFieldsValue({ password: newPassword });
    } else {
      messageApi.open({
        type: "error",
        content: "Failed to generate password!",
      });
    }
  };
  const handleResetAndClose = () => {
    setPassword("");
    setSite("");
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    // 获取当前活动标签页的 URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      const currentUrl = currentTab.url;
      setDefaultSite(currentUrl);
    });
    if (!visible) {
      return;
    }
    if (activeSite?.url) {
      form.setFieldsValue({ site: activeSite.url, note: activeSite.note });
      setSite(activeSite.url);
    }
  }, [visible, activeSite, form]);

  const UrlDiv = () => {
    return <div className="truncate">{activeSite?.url}</div>;
  };
  return (
    <Modal
      getContainer={false}
      title={
        type === CreateModalType.CreateWebsite ? (
          "Create a new website"
        ) : type === CreateModalType.CreateAccount ? (
          <>
            Create a new account for <UrlDiv />
          </>
        ) : (
          <>
            Update website: <UrlDiv />
          </>
        )
      }
      open={visible}
      onOk={onOkHandler}
      onCancel={handleResetAndClose}
      footer={[
        <Button key="cancel" onClick={handleResetAndClose} disabled={loading}>
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
                value={site}
                onChange={(e) => setSite(e.target.value)}
                disabled={type === CreateModalType.CreateAccount}
                placeholder={defaultSite}
                prefix={
                  activeSite?.logo ? (
                    <img
                      src={activeSite.logo}
                      alt={activeSite.logo}
                      width="16"
                      height="16"
                    />
                  ) : (
                    <GlobalOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                  )
                }
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
                    : []
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
                    : []
                }
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Input.Password
                    placeholder="input password"
                    prefix={
                      <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Tooltip title="password generator">
                    <Button
                      type="default"
                      onClick={handlePasswordGeneration}
                      tabIndex={-1}
                    >
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
