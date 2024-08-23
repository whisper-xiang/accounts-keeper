import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Form,
  Space,
  Tooltip,
  Slider,
  Switch,
  Layout,
  message,
} from "antd";
import { ReloadOutlined, CopyOutlined } from "@ant-design/icons";
import "./index.less";

const PasswordGenerator: React.FC = () => {
  const { Header } = Layout;
  const [password, setPassword] = useState<string>("");
  const [length, setLength] = useState<number>(24);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [messageApi, messageContextHolder] = message.useMessage();

  const generatePassword = () => {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let characters = letters;

    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedPassword += characters[randomIndex];
    }
    setPassword(generatedPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      messageApi.success("Password copied to clipboard!");
    });
  };

  useEffect(() => {
    generatePassword();
  }, []);

  return (
    <div className="password-generator-container">
      <Header className="header">
        <h1>Password Generator</h1>
      </Header>
      <Form layout="vertical" className="form-container">
        <Form.Item label="Password Length">
          <Slider min={6} max={30} value={length} onChange={setLength} />
        </Form.Item>

        <Form.Item label="Include Numbers">
          <Switch checked={includeNumbers} onChange={setIncludeNumbers} />
        </Form.Item>

        <Form.Item label="Include Symbols">
          <Switch checked={includeSymbols} onChange={setIncludeSymbols} />
        </Form.Item>

        <Form.Item label="Generated Password">
          <Space.Compact style={{ width: "100%" }}>
            <Input value={password} readOnly />
            <Tooltip title="Refresh">
              <Button
                icon={<ReloadOutlined />}
                onClick={generatePassword}
                type="primary"
              />
            </Tooltip>
            <Tooltip title="Copy to clipboard">
              <Button icon={<CopyOutlined />} onClick={copyToClipboard} />
            </Tooltip>
          </Space.Compact>
        </Form.Item>
      </Form>
      {messageContextHolder}
    </div>
  );
};

export default PasswordGenerator;
