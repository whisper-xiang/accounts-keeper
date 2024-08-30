import { StorageMode } from "../main/panel/components/Settings/types";
import { initLeanCloud } from "./cloud";
import { getSettingsConfigs, setSettingsConfigs } from "./configCache";
import { initializeMasterPassword } from "./utils";

let apiOrigin: any = null;

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
    apiOrigin = await loadAPI(storageMode);
    initializeMasterPassword();
    if (storageMode === StorageMode.Cloud) {
      await initLeanCloud();
    }
    return apiOrigin;
  } catch (error) {
    console.error("Failed to load API:", error);
    throw error;
  }
}

const apiReady = initializeAPI();

export const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${domain}`;
  } catch (e: any) {
    console.error(e);
    return "";
  }
};

async function api(methodName: string, ...args: any[]) {
  await apiReady; // 确保 API 已经初始化
  if (!apiOrigin || !apiOrigin[methodName]) {
    throw new Error(`API method ${methodName} not found.`);
  }
  return apiOrigin[methodName](...args);
}

export { api, apiReady };
