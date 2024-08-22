import { CaretRightOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd"; // Ensure Empty is imported
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
    name: { title: "Mr.", first: "John", last: "Doe" },
  },
  {
    name: { title: "Ms.", first: "Jane", last: "Smith" },
  },
  {
    name: { title: "Dr.", first: "Alice", last: "Johnson" },
  },
  {
    name: { title: "Prof.", first: "Bob", last: "Brown" },
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
        <Link to="/details" key={index}>
          <List.Item actions={[<CaretRightOutlined />]}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                />
              }
              title={
                <div className="flex  items-center">
                  <span
                    onClick={() => window.open(`https://www.google.com`)}
                  >{`${item.name.title} ${item.name.first} ${item.name.last}`}</span>
                  <div className="ml-2 text-xs text-gray-500">4 accounts</div>
                </div>
              }
              description={
                <>
                  Ant Design, a design language for background applications, is
                  refined by Ant UED Team.
                </>
              }
            />
          </List.Item>
        </Link>
      )}
    />
  );
};

export default AccountsMain;
