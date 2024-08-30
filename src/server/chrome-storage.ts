import { uuid2 } from "../main/utils/uuid";
import { decryptPassword, encryptPassword } from "./utils";

const Website_KEY = "websites";
interface Website {
  objectId: string;
  url: string;
  note: string;
  logo?: string;
  accounts: {
    objectId: string;
    username: string;
    password: string;
    note: string;
  }[];
}
export async function fetchAndAssembleData(): Promise<Website[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([Website_KEY], (result) => {
      const websites: Website[] = result[Website_KEY] || [];

      const assembledData = websites.map((website) => {
        const accounts = website.accounts.map((account) => {
          return {
            ...account,
            password: decryptPassword(account.password),
          };
        });

        return {
          ...website,
          accounts,
        };
      });

      resolve(assembledData);
    });
  });
}

export async function fetchWebsiteById(
  websiteId: string
): Promise<Website | undefined> {
  return new Promise((resolve) => {
    chrome.storage.local.get([Website_KEY], (result) => {
      const websites: Website[] = result[Website_KEY] || [];
      const website = websites.find(
        (website) => website.objectId === websiteId
      );

      if (website) {
        website.accounts = website.accounts.map((account) => ({
          ...account,
          password: decryptPassword(account.password), // 解密密码
        }));
      }

      resolve(website);
    });
  });
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
  return new Promise((resolve) => {
    chrome.storage.local.get([Website_KEY], (result) => {
      const websites = result[Website_KEY] || [];
      const website = {
        objectId: uuid2(),
        url,
        note,
        logo,
        accounts: [],
      };
      websites.push(website);
      chrome.storage.local.set({ [Website_KEY]: websites }, () => {
        resolve(website.objectId);
      });
    });
  });
}

export async function deleteWebsite(websiteId: string) {
  return new Promise((resolve) => {
    chrome.storage.local.get([Website_KEY], (result) => {
      const websites = result[Website_KEY] || [];
      const index = websites.findIndex(
        (website: Website) => website.objectId === websiteId
      );
      if (index !== -1) {
        websites.splice(index, 1);
        chrome.storage.local.set({ [Website_KEY]: websites }, () => {
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  });
}

export async function updateWebsite(
  websiteId: string,
  url: string,
  note?: string
) {
  return new Promise((resolve) => {
    chrome.storage.local.get([Website_KEY], (result) => {
      const websites = result[Website_KEY] || [];
      const index = websites.findIndex(
        (website: Website) => website.objectId === websiteId
      );
      if (index !== -1) {
        const website = websites[index];
        website.url = url;
        if (note) {
          website.note = note;
        }
        chrome.storage.local.set({ [Website_KEY]: websites }, () => {
          resolve(website.objectId);
        });
      } else {
        resolve(null);
      }
    });
  });
}

export async function addAccount(
  websiteId: string,
  username: string,
  password: string,
  note?: string
) {
  return new Promise((resolve) => {
    chrome.storage.local.get([Website_KEY], (result) => {
      const websites = result[Website_KEY] || [];
      const index = websites.findIndex(
        (website: Website) => website.objectId === websiteId
      );

      if (index !== -1) {
        const website = websites[index];
        const account = {
          objectId: uuid2(),
          username,
          password: encryptPassword(password),
          note: note || "",
        };
        website.accounts.unshift(account);
        chrome.storage.local.set({ [Website_KEY]: websites }, () => {
          resolve(account.objectId);
        });
      } else {
        resolve(null);
      }
    });
  });
}

export async function deleteAccount(websiteId: string, accountId: string) {
  return new Promise((resolve) => {
    chrome.storage.local.get([Website_KEY], (result) => {
      const websites = result[Website_KEY] || [];
      const index = websites.findIndex(
        (website: Website) => website.objectId === websiteId
      );
      if (index !== -1) {
        const website = websites[index];
        const accountIndex = website.accounts.findIndex(
          (account: { objectId: string }) => account.objectId === accountId
        );
        if (accountIndex !== -1) {
          website.accounts.splice(accountIndex, 1);
          chrome.storage.local.set({ [Website_KEY]: websites }, () => {
            resolve(true);
          });
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
}

export async function updateAccount(
  websiteId: string,
  accountId: string,
  data: { username?: string; password?: string; note?: string }
) {
  return new Promise((resolve) => {
    chrome.storage.local.get([Website_KEY], (result) => {
      const websites = result[Website_KEY] || [];
      const index = websites.findIndex(
        (website: Website) => website.objectId === websiteId
      );
      if (index !== -1) {
        const website = websites[index];
        const accountIndex = website.accounts.findIndex(
          (account: { objectId: string }) => account.objectId === accountId
        );
        if (accountIndex !== -1) {
          const account = website.accounts[accountIndex];
          if (data.username) {
            account.username = data.username;
          }
          if (data.password) {
            account.password = encryptPassword(data.password);
          }
          if (data.note) {
            account.note = data.note;
          }
          chrome.storage.local.set({ [Website_KEY]: websites }, () => {
            resolve(account);
          });
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
}
