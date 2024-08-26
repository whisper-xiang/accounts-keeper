import React, { useCallback, useMemo, useEffect } from "react";
import { HomeOutlined, LockOutlined, SettingOutlined } from "@ant-design/icons";
import { SideBarItem, SideBarProps } from "./interface";

const SideBar: React.FC<SideBarProps> = ({ onItemClick }) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const SideBarItems = useMemo<SideBarItem[]>(
    () => [
      {
        key: "accounts",
        label: "Accounts",
        icon: <HomeOutlined />,
        path: "/",
      },
      {
        key: "pwd-generator",
        label: "Generator",
        icon: <LockOutlined />,
        path: "/pwd-generator",
      },
      {
        key: "settings",
        label: "Settings",
        icon: <SettingOutlined />,
        path: "/settings",
      },
      {
        key: "about",
        label: "About",
        icon: <SettingOutlined />,
        path: "/about",
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
    // onItemClick(SideBarItems[2]);
  }, []);

  return (
    <div className="flex flex-col items-center h-full pt-4 pb-20 text-white">
      {SideBarItems.map((item, index) => (
        <div
          key={item.key}
          className={`flex flex-col items-center py-2 cursor-pointer ${
            activeIndex === index ? "active-sidebar-item" : "sidebar-item"
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
