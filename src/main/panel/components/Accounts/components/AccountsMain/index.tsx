import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Empty, List, message, Modal, Popover } from "antd";
import "./index.less";
import { useNavigate } from "react-router-dom";
import { CreateModalType, WebsiteItem } from "../../interface";
import { api } from "@/server";
import { useState } from "react";

const AccountsMain = ({
  list = [],
  openModal = () => {},
}: {
  list: WebsiteItem[] | undefined;
  openModal: (type: CreateModalType, website?: WebsiteItem) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const navigate = useNavigate();

  const editWebsite = (website: WebsiteItem) => {
    if (!website.objectId) return;
    openModal(CreateModalType.UpdateWebsite, website);
  };

  const removeWebsite = (websiteId: string, index: number) => {
    if (!websiteId) return;

    modal.confirm({
      title: "Are you sure you want to delete this website?",
      icon: <ExclamationCircleFilled />,
      content:
        "Once deleted, the website and all its accounts cannot be recovered.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setLoading(true);
        api("deleteWebsite", websiteId)
          .then(() => {
            messageApi.open({
              type: "success",
              content: "Website deleted successfully!",
            });
            list?.splice(index, 1);
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: "Failed to delete the website. Please try again.",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
  };

  const headerBtns = (item: WebsiteItem, index: number) => (
    <div className="header-button-container">
      <Button
        type="default"
        className="ml-2 header-button"
        onClick={(e) => {
          e.stopPropagation();
          editWebsite(item);
        }}
        size="small"
        icon={<EditOutlined />}
      />
      <Button
        type="default"
        size="small"
        className="ml-2 header-button"
        onClick={(e) => {
          e.stopPropagation();
          removeWebsite(item.objectId, index);
        }}
        icon={<DeleteOutlined />}
      />
    </div>
  );

  return (
    <>
      {list.length === 0 ? (
        <div className="empty-container">
          <Empty description='no website found, click "+" button to create'>
            <Button
              type="default"
              className="ml-2 header-button"
              onClick={() => {
                openModal(CreateModalType.CreateWebsite);
              }}
              icon={<PlusOutlined />}
            >
              {" "}
              create website
            </Button>
          </Empty>
        </div>
      ) : (
        <List
          className="accounts-main-list"
          loading={loading}
          itemLayout="horizontal"
          dataSource={list}
          bordered
          renderItem={(item, index) => (
            <List.Item
              key={item.objectId}
              className="cursor-pointer"
              onClick={() => navigate(`/details/${item.objectId}`)}
              actions={[<CaretRightOutlined />]}
              extra={
                <div className="w-10 h-10">
                  <Popover content={headerBtns(item, index)} trigger="hover">
                    <div
                      className="w-full h-full flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <EllipsisOutlined className="transform rotate-90" />
                    </div>
                  </Popover>
                </div>
              }
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      item.logo ||
                      "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                    }
                    onClick={(e) => {
                      e?.stopPropagation();
                      window.open(item.url);
                    }}
                    size={28}
                  />
                }
                title={
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.url}</span>
                    <span
                      className="ml-2 text-xs text-gray-500"
                      style={{ minWidth: "26px" }}
                    >
                      ( {item?.accounts?.length} )
                    </span>
                  </div>
                }
                description={item.note}
              />
            </List.Item>
          )}
        />
      )}

      {contextHolder}
      {messageContextHolder}
    </>
  );
};

export default AccountsMain;
