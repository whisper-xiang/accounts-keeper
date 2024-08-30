import CryptoJS from "crypto-js";

/**
 * Encrypts a given string using a secret key.
 *
 * @param {string} plaintext - The string to be encrypted.
 * @param {string} secretKey - The secret key used for encryption.
 * @returns {string} The encrypted string.
 */
export function encrypt(secretKey: string, plaintext: string): string {
  const encrypted = CryptoJS.AES.encrypt(plaintext, secretKey).toString();
  return encrypted;
}

/**
 * Decrypts a given encrypted string using a secret key.
 *
 * @param {string} ciphertext - The encrypted string to be decrypted.
 * @param {string} secretKey - The secret key used for decryption.
 * @returns {string} The decrypted string.
 */
export function decrypt(secretKey: string, ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);

  // Convert decrypted data to a UTF-8 string
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  // Check for empty result
  if (!decrypted) {
    return "";
  }

  return decrypted;
}
