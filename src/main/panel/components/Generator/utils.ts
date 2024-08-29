import { getPwdGeneratorCache } from "@/server/configCache";

export const generatePassword = async (
  callback?: (password: string) => void
) => {
  const { length, includeNumbers, includeSymbols } =
    await getPwdGeneratorCache();

  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let characters = letters;

  if (includeNumbers) characters += numbers;
  if (includeSymbols) characters += symbols;

  let generatedPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    generatedPassword += characters[randomIndex];
  }
  if (callback) callback(generatedPassword);
  return generatedPassword;
};
