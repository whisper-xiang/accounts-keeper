import { CaretRightOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd"; // Ensure Empty is imported
import { useEffect, useState } from "react";
import "./index.less";
import { Link } from "react-router-dom";

interface DataType {
  id: string;
  icon?: string;
  site: string;
  note: string;
  accountCount: number;
}

const listData = [
  {
    id: "1",
    icon: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
    site: "Google",
    note: "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    accountCount: 4,
  },
  {
    id: "2",
    icon: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
    note: "Work",
    accountCount: 2,
    site: "Facebook",
  },
  {
    id: "3",
    icon: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
    note: "Personal",
    accountCount: 1,
    site: "Facebook",
  },
];

const AccountsMain = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState<DataType[]>([]);

  useEffect(() => {
    setInitLoading(false);
    setList(listData);
  }, []);

  return (
    <List
      className="accounts-main-list mt-4"
      loading={initLoading}
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item: DataType) => (
        <Link to={`/details/${item.id}`} key={item.id}>
          <List.Item actions={[<CaretRightOutlined />]}>
            <List.Item.Meta
              avatar={<Avatar src={item.icon} />}
              title={
                <div className="flex  items-center">
                  <span
                    onClick={() => window.open(item.site)}
                  >{`${item.site}`}</span>
                  <div className="ml-2 text-xs text-gray-500">4 accounts</div>
                </div>
              }
              description={<>{item.note}</>}
            />
          </List.Item>
        </Link>
      )}
    />
  );
};

export default AccountsMain;
