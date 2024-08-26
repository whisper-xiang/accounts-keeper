export enum StorageMode {
  Cloud = "cloud",
  ChromeStorage = "chromeStorage",
  ChromeSync = "chromeSync",
}

export interface SettingsConfigs {
  masterPassword: string;
  storageMode: StorageMode;
  APP_ID?: string;
  APP_KEY?: string;
  SERVER_URL?: string;
}
