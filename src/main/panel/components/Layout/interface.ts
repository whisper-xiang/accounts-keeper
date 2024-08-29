export interface SideBarProps {
  onItemClick: (item: SideBarItem) => void; // 新增的回调函数类型
}

export interface SideBarItem {
  label: string;
  icon: string | React.ReactNode;
  key: string;
  component?: React.ComponentType<unknown> | React.ReactNode;
  link?: string;
  path?: string;
}
