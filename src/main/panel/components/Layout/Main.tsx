import React, { Suspense, ComponentType } from "react";
import { SideBarItem } from "./interface";

interface MainProps {
  selectedItem: SideBarItem | null;
}

const Main: React.FC<MainProps> = ({ selectedItem }) => {
  const Component = selectedItem?.component as
    | ComponentType<unknown>
    | undefined;

  return (
    <div>
      {Component ? (
        <Suspense fallback={<div>加载中...</div>}>
          <Component />
        </Suspense>
      ) : (
        <div>请选择侧边栏中的项</div>
      )}
    </div>
  );
};

export default Main;
