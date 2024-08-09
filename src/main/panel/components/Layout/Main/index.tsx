import React, { Suspense, ComponentType } from "react";
import { SideBarItem } from "../interface";

interface MainProps {
  selectedItem: SideBarItem | null;
}

const Main: React.FC<MainProps> = ({ selectedItem }) => {
  // 确保 selectedItem 和 selectedItem.component 是有效的组件
  const Component = selectedItem?.component as
    | ComponentType<unknown>
    | undefined;

  return (
    <div>
      {Component ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      ) : (
        <div>请选择侧边栏中的项</div>
      )}
    </div>
  );
};

export default Main;
