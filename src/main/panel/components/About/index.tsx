import React from "react";
import { Collapse, Layout } from "antd";
import type { CollapseProps } from "antd";
import "./index.less";

// Content text
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

// Collapse items definition
const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "Master Password (主密码)",
    children: (
      <p>
        主密码经过 SHA256 加密存储在 <strong>本地缓存</strong>{" "}
        中。所有账号密码经主密码 AES 加密后存储在{" "}
        <strong>LeanCloud | Chrome Storage</strong> 中。
        <br />
        如因某些原因导致本地存储丢失，可重新设置。
        <br />
        请勿忘记主密码。
      </p>
    ),
  },
  {
    key: "8",
    label: "数据存在哪儿？",
    children: (
      <p>
        Accounts Keeper 支持三种存储方法：
        <ul>
          <li>
            LeanCloud: Serverless 云服务，提供数据存储和查询，
            <strong>免费提供 500MB</strong> 存储空间。您可自行免费注册，通过
            app_key 等配置连接，并将数据（经加密后）存于其中。
          </li>
          <li>Chrome Storage (local 和 sync)：用于在本地浏览器存储数据。</li>
        </ul>
      </p>
    ),
  },
  {
    key: "0",
    label: "LeanCloud 注册流程",
    children: (
      <ol>
        <li>注册 LeanCloud 账号，并创建应用。</li>
        <li>配置 API Key 和 API Secret。</li>
        <li>登录 LeanCloud，创建表格，添加表格字段。</li>
        <li>登录 Chrome，安装插件。</li>
        <li>输入主密码，点击保存。</li>
        <li>输入账号密码，点击保存。</li>
      </ol>
    ),
  },
  {
    key: "3",
    label: "如何获取 API Key 和 API Secret",
    children: <p>{text}</p>,
  },
  {
    key: "9",
    label: "菜单说明",
    children: <p>Accounts Keeper 的主要功能和选项说明。</p>,
  },
  {
    key: "4",
    label: "Why English?",
    children: (
      <p>
        <del>老子乐意~</del> 最近在学英语。
      </p>
    ),
  },
];

// Component definition
const About: React.FC = () => {
  const handleCollapseChange = (key: string | string[]) => {
    console.log("Collapse changed:", key);
  };

  return (
    <div className="about-container">
      <Layout.Header className="header">
        <h1>About</h1>
      </Layout.Header>
      <Collapse items={items} onChange={handleCollapseChange} />
    </div>
  );
};

export default About;
