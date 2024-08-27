import { StorageMode } from "../main/panel/components/Settings/types";
import { getSettingsConfigs, setSettingsConfigs } from "./configCache";

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

async function initializeAPI() {
  try {
    const { storageMode } =
      (await getSettingsConfigs()) ||
      (await setSettingsConfigs({
        storageMode: StorageMode.ChromeStorageLocal,
      }));
    api = await loadAPI(storageMode);
    return api;
  } catch (error) {
    console.error("Failed to load API:", error);
    throw error;
  }
}

await initializeAPI();

export { initializeAPI, api };
