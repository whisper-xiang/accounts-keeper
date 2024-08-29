import React from "react";
import { Collapse, Layout } from "antd";
import type { CollapseProps } from "antd";
import "./index.less";

// Collapse items definition
const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "Master Password (主密码)",
    children: (
      <div>
        <p>
          1. 主密码存储在
          <strong> Chrome本地缓存 </strong>中。用于加密所有记录账号的密码。
        </p>
        <p>2. 如因某些原因导致本地存储丢失，可重新设置。</p>
        <p>
          3.
          请务必牢记主密码。如若丢失，所有记录的账号密码将永远成为一堆无法解密的乱码。
        </p>
      </div>
    ),
  },
  {
    key: "2",
    label: "数据存在哪儿？",
    children: (
      <div>
        <strong>Accounts Keeper 支持三种存储方法：</strong>
        <ul className="pl-4 mt-2">
          <li>
            1. LeanCloud: Serverless 云服务。
            {/* ， */}
          </li>
          <li>2. Chrome Storage local：在本地浏览器存储数据。</li>
          <li>
            3. Chrome Storage
            sync：用于在本地浏览器存储数据，但数据会同步到所有chrome账号。(需要在chrome开启同步功能)
          </li>
        </ul>
      </div>
    ),
  },
  {
    key: "3",
    label: "LeanCloud 使用说明",
    children: (
      <div className="pl-4 mt-2">
        <ol>
          <li>
            LeanCloud 提供数据存储和查询，
            <strong>免费提供 500MB</strong> 存储空间。
          </li>
          <li className="mt-2">
            1. 注册{" "}
            <a
              href="https://www.leancloud.cn/"
              target="_blank"
              className="link text-blue-500"
            >
              LeanCloud
            </a>{" "}
            账号。登录后点击左上角"创建应用"按钮，填写 “任意名” 创建应用。
            <img src="/public/cloud0.png" alt="" />
            <img src="/public/cloud1.jpg" alt="" />
          </li>
          <li className="mt-2">
            2. 进入设置-应用凭证，复制 AppId 和 AppKey 到 Accounts Keeper 的
            Settings 页面。
            <img src="/public/cloud2.jpg" alt="" />
          </li>
          <li className="mt-2">
            3. Accounts Keeper 会自动连接 LeanCloud 并在首页初始化时分别建立
            Websites、Accounts 两张表，用于存储数据。
            <img src="/public/cloud3.jpg" alt="" />
            <br />
            (经测试，经 api
            建立的表有延时，需要等待一段时间。如果不愿等可以自行手动建表。)
            <img src="/public/createClass.png" alt="" />
            <ol>
              <li>Websites</li>
              <li>Accounts</li>
            </ol>
          </li>
          <li className="mt-2">
            4. 所有数据经<strong>主密码加密</strong>后存于 LeanCloud 云端。
          </li>
        </ol>
      </div>
    ),
  },
  {
    key: "4",
    label: "菜单说明",
    children: (
      <div className="pl-4 mt-2">
        <p>1. Accounts: 账号管理。</p>
        <p>
          2. Generator: 密码生成器。其设置会缓存到本地，应用于 `Accounts` 页
        </p>
        <p>3. Settings: 设置 `主密码` 和 `存储位置`。</p>
        <p>4. About: 关于页面。</p>
      </div>
    ),
  },
  {
    key: "5",
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
  return (
    <div className="about-container">
      <Layout.Header className="header">
        <h1>About</h1>
      </Layout.Header>
      <Collapse items={items} />
    </div>
  );
};

export default About;
