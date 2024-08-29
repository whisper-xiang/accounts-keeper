export const generateRandomPassword = (length: number = 18): string => {
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;

  let password = "";

  // 确保至少包含一种大写字母、一个小写字母、一个数字和一个特殊字符
  password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
  password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
  password += numberChars[Math.floor(Math.random() * numberChars.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // 填充剩余长度的字符
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // 将密码字符打乱顺序
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
};
