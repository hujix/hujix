import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  title: "HuJix",
  titleTemplate: "Hu.Sir",
  appearance: "dark",
  // head: [["link", { rel: "icon", href: "/logo/sw.png" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // logo: "/logo/sw.png",
    nav: [
      { text: "主页", link: "/envs" },
      // {
      //   text: "Dropdown Menu",
      //   items: [
      //     { text: "Item A", link: "/item-1" },
      //     { text: "Item B", link: "/item-2" },
      //     { text: "Item C", link: "/item-3" },
      //   ],
      // },
      { text: "关于", link: "/base/about" },
    ],
    sidebar: [
      // {
      //   text: "项目概要",
      //   items: [
      //     { text: "介绍", link: "/base/get-start" },
      //     { text: "为什么", link: "/base/project-structure" },
      //   ],
      // },
      // {
      //   text: "预设场景",
      //   items: [
      //     {
      //       text: "MyBatis使用",
      //       items: [
      //         { text: "基础使用", link: "/scenario/mybatis" },
      //         { text: "Mybatis-Plus", link: "/scenario/mybatis-plus" },
      //         { text: "Mybatis-Flex", link: "/scenario/mybatis-flex" },
      //       ],
      //     },
      //     { text: "RabbitMQ", link: "/scenario/rabbitmq" },
      //     { text: "Elasticsearch", link: "/scenario/elasticsearch" },
      //     { text: "扫码登录", link: "/scenario/scan2login" },
      //     { text: "接口优化", link: "/scenario/interface-optimization" },
      //   ],
      // },
      // {
      //   text: "问题反馈",
      //   items: [{ text: "介绍", link: "/base/why" }],
      // },
    ],
    search: {
      provider: "local",
    },
    outline: {
      label: "目录",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/hujix" },
    ],
  },
  markdown: {
    lineNumbers: true,
    // container: {
    //   tipLabel: "提示",
    //   warningLabel: "警告",
    //   dangerLabel: "危险",
    //   infoLabel: "信息",
    //   detailsLabel: "详细信息",
    // },
  },
});
