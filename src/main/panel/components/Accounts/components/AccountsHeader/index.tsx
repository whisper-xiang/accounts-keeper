import { Button, Input } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import "./index.less";

const AccountsHeader = ({ onChange, setVisible }) => {
  return (
    <div className="accounts-header">
      <Input
        placeholder="Input search text"
        allowClear
        onChange={onChange}
        className="header-input"
      />
      <Button
        icon={<FileAddOutlined />}
        onClick={() => setVisible(true)}
        className="ml-2 header-button"
        type="primary"
      />
    </div>
  );
};

export default AccountsHeader;
