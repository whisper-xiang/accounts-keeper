import React, { useCallback, useMemo, useEffect } from "react";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { SideBarItem, SideBarProps } from "./interface";

const Accounts = React.lazy(() => import("../Accounts/index"));
const Settings = React.lazy(() => import("../Settings/index"));
const About = React.lazy(() => import("../About/index"));

const SideBar: React.FC<SideBarProps> = ({ onItemClick }) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const SideBarItems = useMemo<SideBarItem[]>(
    () => [
      {
        key: "accounts",
        label: "账号",
        icon: <HomeOutlined />,
        component: Accounts,
      },
      // {
      //   key: "password-create",
      //   label: "密码生成器",
      //   icon: <LockOutlined />,
      //   component: Accounts,
      // },
      {
        key: "settings",
        label: "设置",
        icon: <SettingOutlined />,
        component: Settings,
      },
      {
        key: "about",
        label: "关于",
        icon: <SettingOutlined />,
        component: About,
      },
    ],
    []
  );

  const handleItemClick = useCallback(
    (item: SideBarItem, index: number) => {
      setActiveIndex(index);
      onItemClick(item);
    },
    [onItemClick]
  );

  useEffect(() => {
    onItemClick(SideBarItems[0]);
  }, []);

  return (
    <div className="flex flex-col items-center h-full pt-4 pb-20 text-white">
      {SideBarItems.map((item, index) => (
        <div
          key={item.key}
          className={`flex flex-col items-center py-2 cursor-pointer ${
            activeIndex === index ? "bg-color-primary-bg" : ""
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
