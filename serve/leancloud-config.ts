import AV from "leancloud-storage";

const APP_ID = "uNgUW5s9tuppzTh9jg4WM2NN-gzGzoHsz";
const APP_KEY = "r1S4Iq3tXZ0obhZsnGggjDEb";
const SERVER_URL = "https://avoscloud.com";

AV.init({
  appId: APP_ID,
  appKey: APP_KEY,
  serverURL: SERVER_URL,
});

export default AV;
