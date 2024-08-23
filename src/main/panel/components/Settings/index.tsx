import { Card, Divider, Form, Input, Layout, Radio, message } from "antd";
import { useState } from "react";
import "./index.less";
import { CloseOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";

const Settings = () => {
  const [storageMode, setStorageMode] = useState("cloud"); // 确保默认值与 initialValues 中的值匹配
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm(); // 使用 form 实例来管理表单状态
  const { Header } = Layout;
  const [messageApi, messageContextHolder] = message.useMessage();

  const [initialValues, setInitialValues] = useState({
    storageMode: "cloud",
    appId: "",
    appKey: "",
    serverUrl: "",
    master: "",
  });

  const onFormLayoutChange = (changedValues) => {
    if (changedValues.storageMode) {
      setStorageMode(changedValues.storageMode);
    }
  };

  const onCancelEdit = () => {
    form.setFieldsValue(initialValues); // 重置表单数据到初始值
    setIsEdit(false); // 退出编辑状态
  };

  const handleEdit = () => {
    setIsEdit(true); // 进入编辑状态
  };

  const onSave = async () => {
    form.validateFields().then(async (values) => {
      // 发送保存请求到接口
      await saveSettings(values);
      messageApi.success("Settings saved successfully!");
      setInitialValues(values); // 更新初始值
      setIsEdit(false); // 退出编辑状态
    }); // 校验并获取表单数据
  };

  const saveSettings = async (values) => {
    // 模拟 API 调用
    return new Promise((resolve) => {
      setTimeout(() => resolve(values), 1000);
    });
  };

  const actions: React.ReactNode[] = isEdit
    ? [
        <SaveOutlined key="save" onClick={onSave} />,
        <CloseOutlined key="cancel" onClick={onCancelEdit} />,
      ]
    : [<EditOutlined key="edit" onClick={handleEdit} />];

  return (
    <div className="settings-container">
      <Header className="header">
        <h1>Settings</h1>
      </Header>
      <Card bordered={false} actions={actions}>
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onValuesChange={onFormLayoutChange}
          initialValues={initialValues} // 设置初始值
        >
          <Form.Item label="storage mode" name="storageMode">
            <Radio.Group disabled={!isEdit}>
              <Radio.Button value="cloud">cloud</Radio.Button>
              <Radio.Button value="storage">storage</Radio.Button>
              <Radio.Button value="sync">sync</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {storageMode === "cloud" && (
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
          <Divider dashed />
          <Form.Item
            label="master password"
            name="master"
            rules={[
              { required: true, message: "Please input master password!" },
            ]}
          >
            <Input disabled={!isEdit} />
          </Form.Item>
          All passwords will be encrypted by the master password
          <Divider dashed />
        </Form>
      </Card>
      {messageContextHolder}
    </div>
  );
};

export default Settings;
