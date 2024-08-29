import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
        className="ml-2 header-button"
        type="default"
      ></Button>
    </div>
  );
};

export default AccountsHeader;
