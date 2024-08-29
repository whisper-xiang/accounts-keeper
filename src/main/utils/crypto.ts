import CryptoJS from "crypto-js";

// 加密方法
export function encrypt(secretKey: string, text: string): string {
  const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, "0").slice(0, 32)); // 密钥处理
  const iv = CryptoJS.enc.Utf8.parse(secretKey.padEnd(16, "0").slice(0, 16)); // IV处理
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });
  return encrypted.toString(); // 返回密文
}

// 解密方法
export function decrypt(secretKey: string, encryptedText: string): string {
  const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, "0").slice(0, 32)); // 密钥处理
  const iv = CryptoJS.enc.Utf8.parse(secretKey.padEnd(16, "0").slice(0, 16)); // IV处理
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8); // 返回明文
}
