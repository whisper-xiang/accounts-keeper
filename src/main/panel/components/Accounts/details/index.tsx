import React, { useEffect, useState, useRef } from "react";
import {
  ArrowLeftOutlined,
  CopyOutlined,
  EditOutlined,
  FileAddOutlined,
  UserOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  LockOutlined,
  JavaScriptOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Form,
  FormInstance,
  Input,
  Space,
  Tooltip,
  Modal,
  message,
  Spin,
} from "antd";
import "./index.less";
import CreateSiteModal from "../components/Create";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/server";
import { generateRandomPassword } from "~utils";
import { AccountItem, CreateModalType } from "../interface";

const Details: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [site, setSite] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state for the entire page
  const [visible, setVisible] = useState<boolean>(false);
  const [list, setList] = useState<FormAccountType[]>([]);
  const { id: websiteId } = useParams();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { TextArea } = Input;
  const [createModalType, setCreateModalType] = useState<CreateModalType>(
    CreateModalType.CreateWebsite
  );
  const navigate = useNavigate();

  interface FormAccountType extends AccountItem {
    isEdit?: boolean;
    passwordVisible?: boolean;
  }

  const getAccountList = async () => {
    setLoading(true); // Start loading
    try {
      const websiteDetail = await api.fetchWebsiteById(websiteId);
      setSite(websiteDetail.url);
      setList(websiteDetail.children);
    } catch (error) {
      console.error("Failed to fetch account list:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const onFinish = (
    accountId: string,
    values: FormAccountType,
    index: number
  ) => {
    setLoading(true);
    try {
      const updatedList = [...list];
      updatedList[index].isEdit = false;
      setList(updatedList);

      api.updateAccount(accountId, values).then(() => {
        messageApi.open({
          type: "success",
          content: "Account updated successfully!",
        });
      });
    } catch (error) {
      console.error("Failed to update account:", error);
    } finally {
      setLoading(false);
    }
  };

  const onCancelEdit = (index: number) => {
    const updatedList = [...list];
    formRefs.current[index]?.resetFields();
    updatedList[index].isEdit = false;
    setList(updatedList);
  };

  const handleEdit = (index: number, item) => {
    const updatedList = [...list];
    updatedList[index].isEdit = true;
    formRefs.current[index]?.setFieldsValue(item);
    setList(updatedList);
  };

  const handleDelete = (id: string) => {
    modal.confirm({
      style: {
        top: "30%",
      },
      title: "Are you sure delete this account?",
      icon: <ExclamationCircleFilled />,
      content: "Once deleted, the account cannot be recovered.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setLoading(true); // Start loading for delete operation
        api
          .deleteAccount(id)
          .then(() => {
            messageApi.open({
              type: "success",
              content: "Account deleted successfully!",
            });
            const updatedList = list.filter((item) => item.objectId !== id);
            setList(updatedList);
            console.log("Account deleted");
          })
          .finally(() => {
            setLoading(false);
          });
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
  };

  const formRefs = useRef<Array<FormInstance<FormAccountType> | null>>([]);

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

  const handlePasswordGeneration = (index: number) => {
    const newPassword = generateRandomPassword();
    if (newPassword) {
      formRefs.current[index]?.setFieldsValue({
        password: newPassword,
      });
      // const updatedList = [...list];
      // updatedList[index].passwordVisible = true;
      // setList(updatedList);
    } else {
      messageApi.open({
        type: "error",
        content: "Failed to generate password!",
      });
    }
  };

  const editWebsite = () => {
    setCreateModalType(CreateModalType.UpdateWebsite);
    setVisible(true);
  };

  const removeWebsite = () => {
    modal.confirm({
      title: "Are you sure delete this website?",
      icon: <ExclamationCircleFilled />,
      content:
        "Once deleted, the website and all its accounts cannot be recovered.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setLoading(true); // Start loading for delete operation
        api
          .deleteWebsite(websiteId)
          .then(() => {
            messageApi.open({
              type: "success",
              content: "Website deleted successfully!",
            });
            navigate(-1);
          })
          .finally(() => {
            setLoading(false);
          });
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
  };

  const createAccount = () => {
    setCreateModalType(CreateModalType.CreateAccount);
    setVisible(true);
  };

  useEffect(() => {
    getAccountList();
  }, []);

  return (
    <div className="accounts-details-container">
      <Spin spinning={loading}>
        <header>
          <h1>
            <ArrowLeftOutlined onClick={() => navigate(-1)} />
            <span className="ml-2">{site}</span>
          </h1>
          <div>
            <FileAddOutlined
              onClick={createAccount}
              className="ml-2 header-button"
              type="primary"
            />
            <EditOutlined
              onClick={editWebsite}
              className="ml-2 header-button"
              type="primary"
            />
            <DeleteOutlined
              onClick={removeWebsite}
              className="ml-2 header-button"
              type="primary"
            />
          </div>
        </header>

        {list.map((item, index) => {
          formRefs.current[index] = formRefs.current[index] || null;

          const actions: React.ReactNode[] = item.isEdit
            ? [
                <SaveOutlined
                  key="save"
                  onClick={() => formRefs.current[index]?.submit()}
                />,
                <CloseOutlined
                  key="cancel"
                  onClick={() => onCancelEdit(index)}
                />,
              ]
            : [
                <EditOutlined
                  key="edit"
                  onClick={() => handleEdit(index, item)}
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDelete(item.objectId)}
                />,
              ];

          return (
            <Card
              loading={loading}
              actions={actions}
              className="accounts-details-card"
              key={item.objectId}
            >
              <Card.Meta
                avatar={
                  <Avatar src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
                }
                description={
                  <Form
                    ref={(el) =>
                      (formRefs.current[index] =
                        el as FormInstance<FormAccountType> | null)
                    }
                    name={`form_${item.objectId}`}
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    layout="vertical"
                    onFinish={(values) =>
                      onFinish(item.objectId, values, index)
                    }
                  >
                    <Form.Item<FormAccountType>
                      label="Username"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Space.Compact style={{ width: "100%" }}>
                        <Input
                          defaultValue={item.username}
                          placeholder="input username"
                          disabled={!item.isEdit}
                          prefix={
                            <UserOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                        />
                        <Tooltip title="copy to clipboard">
                          <Button
                            type="default"
                            onClick={() => {
                              copyTextToClipboard(
                                formRefs.current[index]?.getFieldValue(
                                  "username"
                                ) || item.username
                              );
                            }}
                          >
                            <CopyOutlined />
                          </Button>
                        </Tooltip>
                      </Space.Compact>
                    </Form.Item>

                    <Form.Item<FormAccountType>
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Space.Compact style={{ width: "100%" }}>
                        <Input.Password
                          placeholder="input website!"
                          disabled={!item.isEdit}
                          visibilityToggle={{
                            visible: item.passwordVisible,
                          }}
                          value={
                            formRefs.current[index]?.getFieldValue(
                              "password"
                            ) || item.password
                          }
                          prefix={
                            <LockOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                        />
                        <Tooltip title="password generator">
                          <Button
                            type="default"
                            disabled={!item.isEdit}
                            onClick={() => handlePasswordGeneration(index)}
                          >
                            <JavaScriptOutlined />
                          </Button>
                        </Tooltip>
                        <Tooltip title="copy to clipboard">
                          <Button
                            type="default"
                            onClick={() => {
                              copyTextToClipboard(
                                formRefs.current[index]?.getFieldValue(
                                  "password"
                                ) || item.password
                              );
                            }}
                          >
                            <CopyOutlined />
                          </Button>
                        </Tooltip>
                      </Space.Compact>
                    </Form.Item>

                    <Form.Item<FormAccountType> label="Note" name="note">
                      <TextArea
                        disabled={!item.isEdit}
                        defaultValue={item.note}
                      />
                    </Form.Item>
                  </Form>
                }
              />
            </Card>
          );
        })}
        <CreateSiteModal
          visible={visible}
          type={createModalType}
          siteValue={site}
          siteId={websiteId}
          onClose={() => setVisible(false)}
          onOk={getAccountList}
        />
        {contextHolder}
        {messageContextHolder}
      </Spin>
    </div>
  );
};

export default Details;
