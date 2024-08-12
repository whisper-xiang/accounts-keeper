const BASE_NAME = "websites";
import { uuid2 } from "./uuid";

interface AccountItem {
  objectId?: string;
  account: string;
  password: string;
  remark?: string;
  isEditing?: boolean;
}

interface WebsiteItem {
  objectId?: string;
  name: string;
  children: AccountItem[];
}

export const getDatabase: () => Promise<WebsiteItem[]> = async () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([BASE_NAME], (result) => {
      resolve(result[BASE_NAME] || []);
    });
  });
};

export const createWebsite = async (website: WebsiteItem) => {
  const data = await getDatabase();
  const newWebsite = {
    name: website.name,
    children: [],
    objectId: uuid2(),
  };
  const newDatabase = [...data, newWebsite];
  await setStorage(newDatabase);
  return newWebsite;
};

export const setStorage = async (value: WebsiteItem[]) => {
  return chrome.storage.sync.set({ [BASE_NAME]: value });
};

export const createAccount = async ({
  websiteId,
  account,
}: {
  websiteId: string;
  account: AccountItem;
}) => {
  console.log(websiteId, account);

  const dataBase = await getDatabase();

  const website = dataBase.find((item) => item.objectId === websiteId);

  if (website) {
    console.log(website, "website");

    Object.assign(website, {
      ...website,
      children: [
        ...(website?.children || []),
        { ...account, objectId: uuid2() },
      ],
    });
  }
  return setStorage([...dataBase]);
};

export const updateAccount = async ({
  websiteId,
  account,
}: {
  websiteId: string;
  account: AccountItem;
}) => {
  const dataBase = await getDatabase();

  const website = dataBase.find((item) => item.objectId === websiteId);

  if (website) {
    const preAccount = website.children.find(
      (item) => item.objectId === account.objectId
    );

    if (preAccount) {
      Object.assign(preAccount, account);
    }
  }

  return setStorage([...dataBase]);
};

export const removeAccount = async ({
  websiteId,
  accountId,
}: {
  websiteId: string;
  accountId: string;
}) => {
  const dataBase: WebsiteItem[] = await getDatabase();

  const website = dataBase.find((item) => item.objectId === websiteId);

  if (website) {
    const index = website.children.findIndex(
      (item) => item.objectId === accountId
    );

    if (index !== -1) {
      website.children.splice(index, 1);
    }
  }
  return setStorage(dataBase);
};
