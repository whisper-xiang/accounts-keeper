export enum StorageMode {
  Cloud = "cloud",
  ChromeStorageLocal = "chromeStorageLocal",
  ChromeStorageSync = "chromeStorageSync",
}

export interface SettingsConfigs {
  masterPassword?: string;
  storageMode: StorageMode;
  appId?: string;
  appKey?: string;
  serverURL?: string;
}
