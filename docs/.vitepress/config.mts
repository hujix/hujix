import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  outDir: "../../dist",
  title: "Coding Notebook",
  //   description: "My blog",
  lang: "zh-CN",
  appearance: "dark",
  lastUpdated: true,
  useWebFonts: false,
  markdown: {
    lineNumbers: true,
  },
  head: [
    ["link", { rel: "shortcut icon", href: "/logo.svg" }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: "deep",
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    returnToTopLabel: "返回顶部",
    outlineTitle: "导航栏",
    darkModeSwitchLabel: "外观",
    sidebarMenuLabel: "归档",
    lastUpdatedText: "上次更新于",
    nav: [
      {
        text: "⭐ 资源推荐",
        link: "/share",
      },
    ],
    sidebar: {
      "/install/": [
        {
          text: "软件破解",
          collapsed: false,
          items: [
            { text: "Termius", link: "/install/termius" },
            { text: "Typora", link: "/install/typora" },
          ],
        },
      ],
      "/coding": [
        {
          text: "常用命令",
          collapsed: false,
          link: "/coding/command",
        },
        {
          text: "常用方法/脚本",
          collapsed: false,
          items: [
            { text: "Python", link: "/coding/python" },
            { text: "Typora", link: "/install/typora" },
          ],
        },
      ],
      "/spider/": [
        {
          text: "网站案例",
          collapsed: false,
          items: [
            { text: "AcFun 弹幕视频网", link: "/spider/acfun" },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/hujix",
      },
    ],
  },
});
