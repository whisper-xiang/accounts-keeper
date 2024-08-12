export interface AccountItem {
  objectId?: string;
  account: string;
  password: string;
  remark?: string;
  isEditing?: boolean;
}

export interface WebsiteItem {
  objectId?: string;
  name: string;
  children: AccountItem[];
}
