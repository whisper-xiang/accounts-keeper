import AV from "leancloud-storage";

import { getSettingsConfigs } from "./configCache";
import { message } from "antd";
import { decryptPassword, encryptPassword } from "./utils";

export async function initLeanCloud() {
  const { appId, appKey, serverURL } = await getSettingsConfigs();

  try {
    AV.init({
      appId: appId || "",
      appKey: appKey || "",
      serverURL,
    });
  } catch (e: any) {
    message.error("LeanCloud init error: " + e.message);
    console.error("LeanCloud init error", e);
  }
}

export async function ensureTableExists(tableName: string): Promise<void> {
  try {
    const query = new AV.Query(tableName);
    await query.first(); // 尝试查询表中的第一条记录
  } catch (error) {
    if ((error as AV.Error).code === 101) {
      // 表不存在的情况
      const Table = await AV.Object.extend(tableName);
      const dummyRecord = new Table();
      await dummyRecord.save().then((record) => record.destroy()); // 创建并删除一条记录，以确保表存在但没有数据
      console.info(`${tableName} 表已创建`);
    } else {
      throw error; // 其他错误，抛出异常
    }
  }
}

export async function fetchAndAssembleData() {
  // 确保 Websites 和 Accounts 表存在
  await ensureTableExists("Websites");
  await ensureTableExists("Accounts");

  // 查找 Websites 表中的所有数据
  const websitesQuery = new AV.Query("Websites");
  websitesQuery.descending("createdAt");
  const websites = await websitesQuery.find();

  // 查找 Accounts 表中的所有数据
  const accountsQuery = new AV.Query("Accounts");
  websitesQuery.descending("createdAt");
  const accounts = await accountsQuery.find();

  // 数据拼装
  const websitesData = websites.map((website) => {
    const websiteId = website.id;

    // 查找与此 website 相关的 accounts
    const relatedAccounts = accounts.filter((account) => {
      return account.get("belong") === websiteId;
    });

    return {
      ...website.toJSON(),
      accounts: (relatedAccounts || []).map((account) => {
        const item = account.toJSON();
        return {
          ...item,
          password: decryptPassword(item?.password),
        };
      }),
    };
  });

  return websitesData;
}

export async function fetchWebsiteById(websiteId: string) {
  const websiteQuery = new AV.Query("Websites");
  websiteQuery.equalTo("objectId", websiteId);
  const website = await websiteQuery.first();
  if (website) {
    const accountQuery = new AV.Query("Accounts");
    accountQuery.equalTo("belong", websiteId).descending("createdAt");
    const accounts = await accountQuery.find();
    return {
      ...website.toJSON(),
      accounts: accounts.map((account) => {
        const item = account.toJSON();
        return {
          ...item,
          password: decryptPassword(item.password),
        };
      }),
    };
  } else {
    return null;
  }
}

export async function addWebsite({
  url,
  note,
  logo,
}: {
  url: string;
  note: string;
  logo: string;
}) {
  const website = new AV.Object("Websites");
  website.set("url", url);
  website.set("note", note);
  website.set("logo", logo);
  await website.save();
  return website.id;
}

export async function deleteWebsite(websiteId: string) {
  const website = AV.Object.createWithoutData("Websites", websiteId);
  await website.destroy();

  // 删除与此网站相关的 accounts
  const accountQuery = new AV.Query("Accounts");
  accountQuery.equalTo("belong", websiteId);
  const accounts = await accountQuery.find();
  accounts.forEach((account) => account.destroy());

  return websiteId;
}

export async function updateWebsite(
  websiteId: string,
  url: string,
  note?: string
) {
  if (!websiteId) {
    throw new Error("Website ID is required.");
  }
  const website = AV.Object.createWithoutData("Websites", websiteId);
  website.set("url", url);
  website.set("note", note);
  await website.save();
  return website.id;
}

export async function addAccount(
  websiteId: string,
  username: string,
  password: string,
  note?: string
) {
  if (!websiteId) {
    throw new Error("Website ID is required.");
  }
  const account = new AV.Object("Accounts");
  account.set("username", username);
  account.set("password", encryptPassword(password));
  account.set("belong", websiteId);
  account.set("note", note);
  await account.save();
  return account.id;
}

export async function deleteAccount(websiteId: string, accountId: string) {
  const account = AV.Object.createWithoutData("Accounts", accountId);
  await account.destroy();
  return accountId;
}

export async function updateAccount(
  websiteId: string,
  accountId: string,
  data: { username?: string; password?: string; note?: string }
) {
  if (!accountId) {
    throw new Error("Account ID is required.");
  }
  const account = AV.Object.createWithoutData("Accounts", accountId);
  data?.username && account.set("username", data.username);
  data?.password && account.set("password", encryptPassword(data.password));
  data?.note && account.set("note", data.note);
  await account.save();
  return account.id;
}
