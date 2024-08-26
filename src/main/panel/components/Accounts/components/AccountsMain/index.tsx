import { CaretRightOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";
import "./index.less";
import { Link } from "react-router-dom";
import { WebsiteItem } from "../../interface";

const AccountsMain = ({ list }: { list: WebsiteItem[] | undefined }) => {
  return (
    <List
      className="accounts-main-list"
      loading={!list}
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item: WebsiteItem) => (
        <Link to={`/details/${item.objectId}`} key={item.objectId}>
          <List.Item actions={[<CaretRightOutlined />]}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={
                    item.icon ||
                    "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                  }
                />
              }
              title={
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => window.open(item.url)}
                  >{`${item.url}`}</span>
                  <div className="ml-2 text-xs text-gray-500">
                    {item.accountCount} accounts{" "}
                  </div>
                </div>
              }
              description={item.note}
            />
          </List.Item>
        </Link>
      )}
    />
  );
};

export default AccountsMain;
