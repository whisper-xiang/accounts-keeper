import React, { useEffect, useState, useRef } from "react";
import {
  CopyOutlined,
  EditOutlined,
  UserOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  LockOutlined,
  JavaScriptOutlined,
  LeftOutlined,
  PlusOutlined,
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
  Empty,
} from "antd";
import "./index.less";
import CreateSiteModal from "../components/Create";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/server";
import { generateRandomPassword } from "~utils";
import { AccountItem, CreateModalType, WebsiteItem } from "../interface";

const Details: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [activeWebsite, setActiveWebsite] = useState<WebsiteItem>();
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
    originalPassword?: string;
  }

  const getAccountList = async () => {
    setLoading(true);
    try {
      const websiteDetail = await api("fetchWebsiteById", websiteId);
      const initialList = websiteDetail.accounts.map(
        (item: FormAccountType) => ({
          ...item,
          originalPassword: item.password, // 保存初始密码
        })
      );
      setActiveWebsite(websiteDetail);
      setList(initialList);
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
      updatedList[index].passwordVisible = false;
      setList(updatedList);

      api("updateAccount", websiteId, accountId, values).then(() => {
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
    updatedList[index].password = updatedList[index].originalPassword as string;
    updatedList[index].isEdit = false;
    setList(updatedList);
  };

  const handleEdit = (index: number, item) => {
    const updatedList = [...list];
    updatedList[index].isEdit = true;
    updatedList[index].passwordVisible = true;
    formRefs.current[index]?.setFieldsValue(item);
    setList(updatedList);
  };

  const handleDelete = (accountId: string) => {
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
        api("deleteAccount", websiteId, accountId)
          .then(() => {
            messageApi.open({
              type: "success",
              content: "Account deleted successfully!",
            });
            const updatedList = list.filter(
              (item) => item.objectId !== accountId
            );
            setList(updatedList);
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
      // 通过 formRefs 设置表单值
      formRefs.current[index]?.setFieldsValue({
        password: newPassword,
      });

      // 更新 list 中的密码可见状态
      const updatedList = [...list];
      updatedList[index].password = newPassword;
      updatedList[index].passwordVisible = true;
      setList(updatedList);
    } else {
      messageApi.open({
        type: "error",
        content: "Failed to generate password!",
      });
    }
  };

  const createAccount = () => {
    setCreateModalType(CreateModalType.CreateAccount);
    setVisible(true);
  };

  useEffect(() => {
    getAccountList();
  }, []);

  const handlePasswordChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedList = [...list];
    updatedList[index].password = e.target.value;
    setList(updatedList);
  };

  return (
    <div className="accounts-details-container">
      <Spin spinning={loading}>
        <header>
          <h1 onClick={() => navigate(-1)} className="cursor-pointer">
            <LeftOutlined />
            <span className="ml-2">
              <Avatar
                src={
                  activeWebsite?.logo ||
                  "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                }
                size={24}
              />
            </span>
          </h1>
          <Button
            type="default"
            size="small"
            className="mr-2 header-button"
            onClick={createAccount}
            icon={<PlusOutlined />}
          ></Button>
        </header>

        {list.length === 0 ? (
          <div className="empty-container">
            <Empty description='no account found, click "+" button to create'>
              <Button
                type="default"
                className="ml-2 header-button"
                onClick={createAccount}
                icon={<PlusOutlined />}
              >
                {" "}
                create account
              </Button>
            </Empty>
          </div>
        ) : (
          list.map((item, index) => {
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
                            placeholder="input password"
                            disabled={!item.isEdit}
                            visibilityToggle={{
                              visible: item.passwordVisible,
                            }}
                            value={item.password} // 绑定到状态中的密码字段
                            onChange={(e) => handlePasswordChange(index, e)} // 更新状态
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
                                copyTextToClipboard(item.password);
                              }}
                            >
                              <CopyOutlined />
                            </Button>
                          </Tooltip>
                        </Space.Compact>
                      </Form.Item>

                      <Form.Item<FormAccountType>
                        label="Note"
                        name="note"
                        initialValue={item.note}
                      >
                        <TextArea
                          disabled={!item.isEdit}
                          // defaultValue={item.note}
                        />
                      </Form.Item>
                    </Form>
                  }
                />
              </Card>
            );
          })
        )}

        <CreateSiteModal
          visible={visible}
          type={createModalType}
          activeSite={activeWebsite}
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
