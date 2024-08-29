import { StorageMode } from "../main/panel/components/Settings/types";
import { getSettingsConfigs, setSettingsConfigs } from "./configCache";
import { initializeMasterPassword } from "./utils";

let api: any = null;

async function loadAPI(storageMode: StorageMode) {
  switch (storageMode) {
    case StorageMode.Cloud:
      return import("./cloud");
    case StorageMode.ChromeStorageSync:
      return import("./chrome-sync");
    default:
      return import("./chrome-storage");
  }
}

export async function initializeAPI() {
  try {
    const { storageMode } =
      (await getSettingsConfigs()) ||
      (await setSettingsConfigs({
        storageMode: StorageMode.ChromeStorageLocal,
      }));
    api = await loadAPI(storageMode);
    initializeMasterPassword();
    return api;
  } catch (error) {
    console.error("Failed to load API:", error);
    throw error;
  }
}

// 初始化 API，并导出初始化的 Promise
const apiReady = initializeAPI();

export const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${domain}`;
  } catch (e: any) {
    return e;
  }
};

// 导出已经初始化的 API 和 `apiReady` Promise
export { api, apiReady };
