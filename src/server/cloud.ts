import AV from "./leanCloud-config";

// export default {
//   // 获取所有账号
//   getAllAccounts: async () => {
//     const websitesQuery = new AV.Query("websites");
//     const websites = await websitesQuery.find();

//     const ids = websites.map((website) => website.id);

//     const accountsQuery = new AV.Query("accounts");
//     accountsQuery.containedIn("parentId", ids);
//     const accounts = await accountsQuery.find();

//     const result = websites.map((website) => {
//       const account = accounts.filter(
//         (account) => account.get("parentId") === website.id
//       );
//       return {
//         ...website.toJSON(),
//         children: account.map((acc) => acc.toJSON()),
//       };
//     });

//     return result;
//   },

//   // 新增账号
//   addAccount: async (data) => {
//     const websiteId = data.websiteId;
//     if (websiteId) {
//       const accountObj = new AV.Object("accounts");

//       accountObj.set("username", data.username);

//       accountObj.set("password", data.password);

//       accountObj.set("parentId", websiteId);

//       await accountObj.save();

//       return accountObj.toJSON();
//     } else {
//       const website = new AV.Object("websites");
//       website.set("name", data.websiteName);
//       website.set("url", data.websiteUrl);
//       await website.save();

//       const accountObj = new AV.Object("accounts");

//       accountObj.set("username", data.username);

//       accountObj.set("password", data.password);

//       accountObj.set("parentId", website.id);

//       await accountObj.save();

//       return accountObj.toJSON();
//     }
//   },

//   // 删除账号
//   deleteAccount: async (id) => {
//     const account = AV.Object.createWithoutData("accounts", id);
//     await account.destroy();
//     return id;
//   },
// };

export async function ensureTableExists(tableName: string): Promise<void> {
  try {
    const query = new AV.Query(tableName);
    await query.first(); // 尝试查询表中的第一条记录
  } catch (error) {
    if ((error as AV.Error).code === 101) {
      // 表不存在的情况
      const Table = AV.Object.extend(tableName);
      const dummyRecord = new Table();
      await dummyRecord.save().then((record) => record.destroy()); // 创建并删除一条记录，以确保表存在但没有数据
      console.log(`${tableName} 表已创建`);
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
      accountCount: relatedAccounts.length,
      children: relatedAccounts.map((account) => account.toJSON()),
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
      children: accounts.map((account) => account.toJSON()),
    };
  } else {
    return null;
  }
}

export async function addWebsite(url: string, note: string) {
  const website = new AV.Object("Websites");
  website.set("url", url);
  website.set("note", note);
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
  console.log("addAccount", websiteId, username, password, note);

  const account = new AV.Object("Accounts");
  account.set("username", username);
  account.set("password", password);
  account.set("belong", websiteId);
  account.set("note", note);
  await account.save();
  return account.id;
}

export async function deleteAccount(accountId: string) {
  const account = AV.Object.createWithoutData("Accounts", accountId);
  await account.destroy();
  return accountId;
}

export async function updateAccount(
  accountId: string,
  data: { username?: string; password?: string; note?: string }
) {
  if (!accountId) {
    throw new Error("Account ID is required.");
  }
  const account = AV.Object.createWithoutData("Accounts", accountId);
  account.set("username", data.username);
  account.set("password", data.password);
  account.set("note", data.note);
  await account.save();
  return account.id;
}
