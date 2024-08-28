import { encrypt, decrypt } from "~utils";
import { getSettingsConfigs } from "./configCache";

let masterPassword: string | undefined;

export const initializeMasterPassword = async () => {
  masterPassword = (await getSettingsConfigs()).masterPassword;
};

export const encryptPassword = (password: string) => {
  if (!masterPassword) {
    throw new Error("Master password is not set");
  }
  return encrypt(masterPassword, password);
};

export const decryptPassword = (encryptedPassword: string) => {
  if (!masterPassword) {
    throw new Error("Master password is not set");
  }
  return decrypt(masterPassword, encryptedPassword);
};
