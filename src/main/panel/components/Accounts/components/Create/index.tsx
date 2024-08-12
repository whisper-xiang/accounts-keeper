import { Divider, Modal, Space } from "antd";

import type { FormProps, InputRef } from "antd";
import { Button, Checkbox, Form, Input, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { WebsiteItem } from "../../interface";
import { PlusOutlined } from "@ant-design/icons";

type FieldType = {
  name?: string;
  password?: string;
  remember?: string;
  remark?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

let index = 0;

const CreateAccount = ({ visible, onOk, onClose }) => {
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [items, setItems] = useState(["jack", "lucy"]);
  const [name, setName] = useState("");
  const inputRef = useRef<InputRef>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    // console.log("CreateAccount");
  }, []);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Modal
      title="Create website"
      open={visible}
      onOk={() => {
        onOk(form.getFieldsValue());
        form.resetFields();
      }}
      onCancel={onClose}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        autoComplete="off"
      >
        {/* <Form.Item label="Select">
          <Select>
            {websites.map((website) => (
              <Select.Option value={website.objectId}>
                {website.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 300 }}
            placeholder="custom dropdown render"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="Please enter item"
                    ref={inputRef}
                    value={name}
                    onChange={onNameChange}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Add item
                  </Button>
                </Space>
              </>
            )}
            options={items.map((item) => ({ label: item, value: item }))}
          />
        </Form.Item> */}

        {/* <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item> */}

        <Form.Item<FieldType>
          label="name"
          name="name"
          rules={[{ required: true, message: "Please input your website!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAccount;
