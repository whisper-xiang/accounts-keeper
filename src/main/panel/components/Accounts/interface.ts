export interface AccountItem {
  id: string;
  account: string;
  password: string;
  remark?: string;
}

export interface WebsiteItem {
  id: string;
  name: string;
  children: AccountItem[];
}
