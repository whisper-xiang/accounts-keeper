import AV from "./leanCloud-config";

export default {
  // 获取所有账号
  getAllAccounts: async () => {
    const websitesQuery = new AV.Query("websites");
    const websites = await websitesQuery.find();

    const ids = websites.map((website) => website.id);

    const accountsQuery = new AV.Query("accounts");
    accountsQuery.containedIn("parentId", ids);
    const accounts = await accountsQuery.find();

    const result = websites.map((website) => {
      const account = accounts.filter(
        (account) => account.get("parentId") === website.id
      );
      return {
        ...website.toJSON(),
        children: account.map((acc) => acc.toJSON()),
      };
    });

    return result;
  },

  // 新增账号
  addAccount: async (data) => {
    const websiteId = data.websiteId;
    if (websiteId) {
      const accountObj = new AV.Object("accounts");

      accountObj.set("username", data.username);

      accountObj.set("password", data.password);

      accountObj.set("parentId", websiteId);

      await accountObj.save();

      return accountObj.toJSON();
    } else {
      const website = new AV.Object("websites");
      website.set("name", data.websiteName);
      website.set("url", data.websiteUrl);
      await website.save();

      const accountObj = new AV.Object("accounts");

      accountObj.set("username", data.username);

      accountObj.set("password", data.password);

      accountObj.set("parentId", website.id);

      await accountObj.save();

      return accountObj.toJSON();
    }
  },

  // 删除账号
  deleteAccount: async (id) => {
    const account = AV.Object.createWithoutData("accounts", id);
    await account.destroy();
    return id;
  },
};
