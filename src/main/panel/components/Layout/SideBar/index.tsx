import React, { useEffect, useState, useCallback, useMemo } from "react";
import { HomeOutlined } from "@ant-design/icons";
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
      // 可以添加更多项
    ],
    [] // Empty dependency array ensures this is only created once
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
    <div className="flex flex-col items-center h-full">
      {SideBarItems.map((item, index) => (
        <div
          key={item.key} // 使用唯一标识符作为 key
          className={`flex flex-col items-center py-4 cursor-pointer ${
            activeIndex === index ? "text-white" : ""
          }`}
          onClick={() => handleItemClick(item, index)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SideBar;
