export interface AccountItem {
  objectId: string;
  username: string;
  password: string;
  remark?: string;
  isEditing?: boolean;
  note?: string;
}

export interface WebsiteItem {
  objectId: string;
  url: string;
  accountCount: number;
  children?: AccountItem[];
  icon?: string;
  note?: string;
}

export enum CreateModalType {
  CreateWebsite = "createWebsite",
  UpdateWebsite = "updateWebsite",
  CreateAccount = "createAccount",
}
