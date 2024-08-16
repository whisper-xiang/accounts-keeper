import { Button, Card, Form, Input, Radio } from "antd";
import { useState } from "react";

const Settings = () => {
  const [storageMode, setStorageMode] = useState("cloud"); // 确保默认值与 initialValues 中的值匹配

  const onFormLayoutChange = (changedValues) => {
    if (changedValues.storageMode) {
      setStorageMode(changedValues.storageMode);
    }
  };

  return (
    <>
      <Card title="存储方式" bordered={false}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onValuesChange={onFormLayoutChange}
          style={{ maxWidth: 600 }}
          initialValues={{ storageMode: "cloud" }} // 设置初始值
        >
          <Form.Item label="Form Size" name="storageMode">
            <Radio.Group>
              <Radio.Button value="cloud">cloud</Radio.Button>
              <Radio.Button value="storage">storage</Radio.Button>
              <Radio.Button value="sync">sync</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* leanCloud配置 */}
          {storageMode === "cloud" && (
            <>
              <Form.Item label="APP_ID" name="appId">
                <Input />
              </Form.Item>
              <Form.Item label="APP_KEY" name="appKey">
                <Input />
              </Form.Item>
              <Form.Item label="SERVER_URL" name="serverUrl">
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              editor
            </Button>
            <Button type="primary" htmlType="submit">
              save
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="主密码" bordered={false}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onValuesChange={onFormLayoutChange}
          style={{ maxWidth: 600 }}
          initialValues={{ storageMode: "cloud" }} // 设置初始值
        >
          <Form.Item label="SERVER_URL" name="serverUrl">
            <Input />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default Settings;
