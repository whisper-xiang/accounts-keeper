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
} from "antd";
import "./index.less";
import CreateSiteModal from "../components/Create";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/server";
import { AccountItem } from "../interface";

const Details: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [site, setSite] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [list, setList] = useState<FormAccountType[]>([]);
  const { id: objectId } = useParams();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { TextArea } = Input;
  const navigate = useNavigate();

  interface FormAccountType extends AccountItem {
    isEdit?: boolean;
  }

  const getAccountList = async () => {
    const websiteDetail = await api.fetchWebsiteById(objectId);
    setSite(websiteDetail.url);
    setList(websiteDetail.children);
  };

  const onFinish = (values: FormAccountType, index: number) => {
    console.log("Success:", values);
    const updatedList = [...list];
    updatedList[index].isEdit = false;
    setList(updatedList);
  };

  const onCancelEdit = (index: number) => {
    const updatedList = [...list];
    updatedList[index].isEdit = false;
    setList(updatedList);
  };

  const handleEdit = (index: number) => {
    const updatedList = [...list];
    updatedList[index].isEdit = true;
    setList(updatedList);
  };

  const handleDelete = (id: number) => {
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
        const updatedList = list.filter((item) => item.id !== id);
        setList(updatedList);
        console.log("Account deleted");
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
  };

  const createAccount = (data: any) => {
    console.log("create account", data);
  };

  const formRefs = useRef<Array<FormInstance<FormAccountType> | null>>([]);

  const copyTextToClipboard = (text: string): void => {
    console.log(text);

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

  useEffect(() => {
    getAccountList();
  }, []);

  return (
    <div className="accounts-details-container">
      <header>
        <h1>
          <ArrowLeftOutlined onClick={() => navigate(-1)} />
          <span className="ml-2">{site}</span>
        </h1>
        <Button
          icon={<FileAddOutlined />}
          onClick={() => setVisible(true)}
          className="ml-2 header-button"
          type="primary"
        />
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
              <EditOutlined key="edit" onClick={() => handleEdit(index)} />,
              <DeleteOutlined
                key="delete"
                onClick={() => handleDelete(item.id)}
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
                  onFinish={(values) => onFinish(values, index)}
                  autoComplete="off"
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
                          <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
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
                        defaultValue={item.password}
                        prefix={
                          <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                        }
                      />
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
        type="account"
        siteValue={site}
        onClose={() => setVisible(false)}
        onOk={(data) => createAccount(data)}
      />
      {contextHolder}
      {messageContextHolder}
    </div>
  );
};

export default Details;
