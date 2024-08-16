# accounts-keeper

账号记录，暂定形式为chrome插件, 后续可能支持手机端app。
基于react + ant design  + tailwind + leanCloud实现。



- version: 0.1.0
  主密码经过SHA256加密，且不存储在服务器上，仅在本地浏览器中存储。
  所有账号密码经主密码AES加密后存储在
  - leanCloud中。
    - 需要注册leanCloud账号，并创建应用。
    - api_key和api_secret在插件中配置，并将保存在chrome sync本地。
  - chrome storage中。
  - chrome sync 中
