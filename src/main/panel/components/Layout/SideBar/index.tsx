import React, { useEffect, useState, useCallback, useMemo } from "react";
import { HomeOutlined, LockOutlined, SettingOutlined } from "@ant-design/icons";
import { SideBarItem, SideBarProps } from "../interface";

const Accounts = React.lazy(() => import("../../Accounts/index"));

const SideBar: React.FC<SideBarProps> = ({ onItemClick }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const SideBarItems = useMemo<SideBarItem[]>(
    () => [
      {
        key: "accounts",
        label: "账号",
        icon: <HomeOutlined />,
        component: Accounts,
      },
      {
        key: "password-create",
        label: "密码生成器",
        icon: <LockOutlined />,
        component: Accounts,
      },
      // {
      //   key: "settings",
      //   label: "设置",
      //   icon: <SettingOutlined />,
      //   component: Accounts,
      // },
      {
        key: "about",
        label: "关于",
        icon: <SettingOutlined />,
        component: Accounts,
      },
    ],
    []
  );

  // 处理点击事件
  const handleItemClick = useCallback(
    (item: SideBarItem, index: number) => {
      setActiveIndex(index);
      onItemClick(item); // 调用传入的回调函数
    },
    [onItemClick]
  );

  useEffect(() => {
    if (SideBarItems.length > 0) {
      onItemClick(SideBarItems[0]);
    }
  }, [onItemClick, SideBarItems]);

  return (
    <div className="flex flex-col items-center h-full pt-4 pb-20 text-white">
      {SideBarItems.map((item, index) => (
        <div
          key={item.key} // 使用唯一标识符作为 key
          className={`flex flex-col items-center py-2 cursor-pointer ${
            activeIndex === index ? "text-primary-500" : ""
          }`}
          onClick={() => handleItemClick(item, index)}
        >
          <span>{item.icon}</span>
          <span style={{ fontSize: "10px" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SideBar;
