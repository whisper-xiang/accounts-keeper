import { uuid2 } from "../main/utils/uuid";

const Website_KEY = "websites";
interface Website {
  objectId: string;
  url: string;
  note: string;
  icon?: string;
  accounts: {
    objectId: string;
    username: string;
    password: string;
    note: string;
  };
}

export async function fetchAndAssembleData(): Promise<Website[]> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([Website_KEY], (result) => {
      resolve(result[Website_KEY] || []);
    });
  });
}

export async function fetchWebsiteById(websiteId: string) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([Website_KEY], (result) => {
      const websites = result[Website_KEY] || [];
      const website = websites.find(
        (website: Website) => website.objectId === websiteId
      );
      resolve(website);
    });
  });
}

export async function addWebsite(url: string, note: string) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([Website_KEY], (result) => {
      const websites = result[Website_KEY] || [];
      const website = {
        objectId: uuid2(),
        url,
        note,
        icon: "",
        accounts: [],
      };
      websites.push(website);
      chrome.storage.sync.set({ [Website_KEY]: websites }, () => {
        resolve(website);
      });
    });
  });
}

export async function deleteWebsite(websiteId: string) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([Website_KEY], (result) => {
      const websites = result[Website_KEY] || [];
      const index = websites.findIndex(
        (website: Website) => website.objectId === websiteId
      );
      if (index !== -1) {
        websites.splice(index, 1);
        chrome.storage.sync.set({ [Website_KEY]: websites }, () => {
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
    chrome.storage.sync.get([Website_KEY], (result) => {
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
        chrome.storage.sync.set({ [Website_KEY]: websites }, () => {
          resolve(website);
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
    chrome.storage.sync.get([Website_KEY], (result) => {
      const websites = result[Website_KEY] || [];
      const index = websites.findIndex(
        (website: Website) => website.objectId === websiteId
      );
      if (index !== -1) {
        const website = websites[index];
        const account = {
          objectId: uuid2(),
          username,
          password,
          note: note || "",
        };
        website.accounts.push(account);
        chrome.storage.sync.set({ [Website_KEY]: websites }, () => {
          resolve(account);
        });
      } else {
        resolve(null);
      }
    });
  });
}

export async function deleteAccount(websiteId: string, accountId: string) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([Website_KEY], (result) => {
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
          chrome.storage.sync.set({ [Website_KEY]: websites }, () => {
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
    chrome.storage.sync.get([Website_KEY], (result) => {
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
            account.password = data.password;
          }
          if (data.note) {
            account.note = data.note;
          }
          chrome.storage.sync.set({ [Website_KEY]: websites }, () => {
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
