// settings缓存放入 chrome sync中
const SETTINGS_NAME = "settings";
const GENERATOR_NAME = "generator";

import { SettingsConfigs } from "../main/panel/components/Settings/types";
import { PasswordGenerator } from "../main/panel/components/Generator/types";

export const getSettingsConfigs: () => Promise<SettingsConfigs> = async () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([SETTINGS_NAME], (result) => {
      resolve(result[SETTINGS_NAME]);
    });
  });
};

export const setSettingsConfigs: (
  configs: SettingsConfigs
) => Promise<void> = async (configs) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [SETTINGS_NAME]: configs }, () => {
      resolve();
    });
  });
};

export const clearSettingsCache: () => Promise<void> = async () => {
  return new Promise((resolve) => {
    chrome.storage.sync.remove([SETTINGS_NAME], () => {
      resolve();
    });
  });
};

export const updateSettingConfigs: (
  configs: Partial<SettingsConfigs>
) => Promise<void> = async (configs) => {
  const currentConfigs = await getSettingsConfigs();
  const newConfigs = { ...currentConfigs, ...configs };
  return setSettingsConfigs(newConfigs);
};

// 密码生成器缓存
export const getPwdGeneratorCache: () => Promise<PasswordGenerator> =
  async () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([GENERATOR_NAME], (result) => {
        resolve(result[GENERATOR_NAME]);
      });
    });
  };

export const setPwdGeneratorCache: (
  generator: PasswordGenerator
) => Promise<void> = async (generator) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [GENERATOR_NAME]: generator }, () => {
      resolve();
    });
  });
};

export const updatePwdGeneratorCache: (
  generator: Partial<PasswordGenerator>
) => Promise<void> = async (generator) => {
  const currentGenerator = await getPwdGeneratorCache();
  const newGenerator = { ...currentGenerator, ...generator };
  return setPwdGeneratorCache(newGenerator);
};
