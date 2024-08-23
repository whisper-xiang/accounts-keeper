// const About = () => {
//   return (
//     <>
//       关于我 主密码经过SHA256加密，且不存储在服务器上，仅在本地浏览器中存储。
//       所有账号密码经主密码AES加密后存储在 - leanCloud中。 -
//       需要注册leanCloud账号，并创建应用。 -
//       api_key和api_secret在插件中配置，并将保存在chrome sync本地。 - chrome
//       storage中。 - chrome sync 中
//     </>
//   );
// };

// export default About;
import React from "react";
import type { CollapseProps } from "antd";
import { Collapse, Layout } from "antd";
import "./index.less";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps["items"] = [
  {
    key: "0",
    label: "使用流程",
    children: (
      <p>
        1. 注册 leanCloud账号 ，并创建应用。
        <br />
        2. 配置api_key和api_secret。
        <br />
        3. 登录leanCloud，创建表格，添加表格字段。
        <br />
        4. 登录chrome，安装插件。
        <br /> 5. 输入主密码，点击保存。
        <br /> 6. 输入账号密码，点击保存。
      </p>
    ),
  },
  {
    key: "1",
    label: "master password",
    children: (
      <p>
        主密码， 经过SHA256加密存储在<strong>本地缓存</strong>中。
        所有账号密码经主密码AES加密后存储在{" "}
        <strong>leanCloud | chrome storage</strong>中。
      </p>
    ),
  },
  {
    key: "2",
    label: "leanCloud 是什么",
    children: (
      <p>
        Serverless云服务，提供数据存储和查询，重点是
        <strong>免费提供500MB</strong>存储空间。
      </p>
    ),
  },
  {
    key: "3",
    label: "如何获取api_key和api_secret",
    children: <p>{text}</p>,
  },
  {
    key: "4",
    label: "why english",
    children: (
      <p>
        <del>老子乐意~</del>最近在学英语
      </p>
    ),
  },
];

const { Header } = Layout;
const About: React.FC = () => {
  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return (
    <div className="about-container">
      <Header className="header">
        <h1>About</h1>
      </Header>
      <Collapse items={items} onChange={onChange} />
    </div>
  );
};

export default About;
