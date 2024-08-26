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
import {
  getPwdGeneratorCache,
  updatePwdGeneratorCache,
} from "../../../../server/configCache";
import { generatePassword } from "./utils";
// import

const PasswordGenerator: React.FC = () => {
  const { Header } = Layout;
  const [password, setPassword] = useState<string>("");
  const [length, setLength] = useState<number>(24);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [messageApi, messageContextHolder] = message.useMessage();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      messageApi.success("Password copied to clipboard!");
    });
  };

  useEffect(() => {
    getPwdGeneratorCache().then((configs) => {
      if (configs) {
        setLength(configs.length);
        setIncludeNumbers(configs.includeNumbers);
        setIncludeSymbols(configs.includeSymbols);
      } else {
        updatePwdGeneratorCache({
          length: 24,
          includeNumbers: true,
          includeSymbols: true,
        });
      }
    });
    generatePassword().then((password) => {
      setPassword(password);
    });
  }, []);

  return (
    <div className="password-generator-container">
      <Header className="header">
        <h1>Password Generator</h1>
      </Header>
      <Form layout="vertical" className="form-container">
        <Form.Item label="Password Length">
          <Slider
            min={6}
            max={30}
            value={length}
            onChange={async (value) => {
              await updatePwdGeneratorCache({ length: value });
              setLength(value);
              setPassword(await generatePassword());
            }}
          />
        </Form.Item>

        <Form.Item label="Include Numbers">
          <Switch
            checked={includeNumbers}
            onChange={async (value) => {
              await updatePwdGeneratorCache({ includeNumbers: value });
              setIncludeNumbers(value);
              setPassword(await generatePassword());
            }}
          />
        </Form.Item>

        <Form.Item label="Include Symbols">
          <Switch
            checked={includeSymbols}
            onChange={async (value) => {
              await updatePwdGeneratorCache({ includeSymbols: value });
              setIncludeSymbols(value);
              setPassword(await generatePassword());
            }}
          />
        </Form.Item>

        <Form.Item label="Generated Password">
          <Space.Compact style={{ width: "100%" }}>
            <Input value={password} readOnly />
            <Tooltip title="Refresh">
              <Button
                icon={<ReloadOutlined />}
                onClick={async () => setPassword(await generatePassword())}
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
