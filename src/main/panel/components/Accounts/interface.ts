export interface AccountItem {
  objectId?: string;
  account: string;
  password: string;
  remark?: string;
}

export interface WebsiteItem {
  objectId?: string;
  name: string;
  children: AccountItem[];
}
