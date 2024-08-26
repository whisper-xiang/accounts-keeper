import { Card, Divider, Form, Input, Layout, Radio, message } from "antd";
import { useEffect, useState } from "react";
import "./index.less";
import { CloseOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import {
  getSettingsConfigs,
  updateSettingConfigs,
} from "../../../../server/configCache";
import { SettingsConfigs, StorageMode } from "./types";

const Settings = () => {
  const [storageMode, setStorageMode] = useState(StorageMode.Cloud);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const { Header } = Layout;
  const [messageApi, messageContextHolder] = message.useMessage();

  const [initialValues, setInitialValues] = useState<SettingsConfigs>({
    storageMode: StorageMode.Cloud,
    APP_ID: "",
    APP_KEY: "",
    SERVER_URL: "",
    masterPassword: "",
  });

  const onFormLayoutChange = (changedValues) => {
    if (changedValues.storageMode) {
      setStorageMode(changedValues.storageMode);
    }
  };

  const onCancelEdit = () => {
    form.setFieldsValue(initialValues); // 重置表单数据到初始值
    setStorageMode(initialValues.storageMode); // 重置 storageMode 状态
    setIsEdit(false);
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const onSave = async () => {
    form.validateFields().then(async (values) => {
      // 发送保存请求到接口
      await updateSettingConfigs(values);
      messageApi.success("Settings saved successfully!");
      setInitialValues(values);
      setIsEdit(false);
    });
  };

  const actions: React.ReactNode[] = isEdit
    ? [
        <SaveOutlined key="save" onClick={onSave} />,
        <CloseOutlined key="cancel" onClick={onCancelEdit} />,
      ]
    : [<EditOutlined key="edit" onClick={handleEdit} />];

  useEffect(() => {
    getSettingsConfigs().then((configs) => {
      if (configs) {
        setInitialValues(configs); // 更新 state 中的初始值
        form.setFieldsValue(configs); // 手动更新表单值
        setStorageMode(configs.storageMode);
      }
    });
  }, []);

  return (
    <div className="settings-container">
      <Header className="header">
        <h1>Settings</h1>
      </Header>
      <Card bordered={false} actions={actions}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          onValuesChange={onFormLayoutChange}
          initialValues={initialValues} // 设置初始值
        >
          <strong>
            Note: All of the Settings below will be stored only in the chrome
            cache!
          </strong>
          <Divider dashed />
          <Form.Item
            label="Master password"
            name="masterPassword"
            rules={[
              { required: true, message: "Please input master password!" },
            ]}
          >
            <Input.Password disabled={!isEdit} />
          </Form.Item>
          All passwords will be encrypted by the master password
          <Divider dashed />
          <Form.Item label="Storage mode" name="storageMode">
            <Radio.Group disabled={!isEdit}>
              <Radio.Button value={StorageMode.Cloud}>cloud</Radio.Button>
              <Radio.Button value={StorageMode.ChromeStorage}>
                storage
              </Radio.Button>
              <Radio.Button value={StorageMode.ChromeSync}>sync</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <small className="mb-2 d-block">
            {storageMode === StorageMode.Cloud
              ? "All passwords will be encrypted and stored in the cloud."
              : storageMode === StorageMode.ChromeStorage
              ? "All passwords will be encrypted and stored in the local storage."
              : storageMode === StorageMode.ChromeSync
              ? "All passwords will be encrypted and stored in the sync storage."
              : ""}
          </small>
          {storageMode === StorageMode.Cloud && (
            <>
              <Form.Item
                label="APP_ID"
                name="appId"
                rules={[{ required: true, message: "Please input APP_ID!" }]}
              >
                <Input disabled={!isEdit} />
              </Form.Item>
              <Form.Item
                label="APP_KEY"
                name="appKey"
                rules={[{ required: true, message: "Please input APP_KEY!" }]}
              >
                <Input disabled={!isEdit} />
              </Form.Item>
              <Form.Item label="SERVER_URL" name="serverUrl">
                <Input disabled={!isEdit} />
              </Form.Item>
            </>
          )}
        </Form>
      </Card>
      {messageContextHolder}
    </div>
  );
};

export default Settings;
