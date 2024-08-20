import { CaretRightOutlined } from "@ant-design/icons";
import { Avatar, Button, List, Skeleton } from "antd";
import { useEffect, useState } from "react";
import "./index.less";
import { Link } from "react-router-dom";

interface DataType {
  gender?: string;
  name: {
    title?: string;
    first?: string;
    last?: string;
  };
  email?: string;
  picture: {
    large?: string;
    medium?: string;
    thumbnail?: string;
  };
  nat?: string;
  loading: boolean;
}

const data = [
  {
    name: "Ant Design Title 1",
  },
  {
    name: "Ant Design Title 2",
  },
  {
    name: "Ant Design Title 3",
  },
  {
    name: "Ant Design Title 4",
  },
];

const AccountsMain = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState<DataType[]>([]);

  useEffect(() => {
    setInitLoading(false);
    setList(data);
  }, []);

  return (
    <List
      className="accounts-main-list mt-4"
      loading={initLoading}
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item: DataType, index: number) => (
        <List.Item
          actions={[
            <Link to="/details">
              <CaretRightOutlined />
            </Link>,
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
              />
            }
            title={<a href="https://ant.design">{item.name}</a>}
            description={
              <a href="https://ant.design">
                {" "}
                Ant Design, a design language for background applications, is
                refined by Ant UED Team"
              </a>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default AccountsMain;
