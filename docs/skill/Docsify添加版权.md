<div align='center'>
  <!-- <img src="Docsify/img/docsify-logo.svg" alt="dicsify"> -->
</div>

# Docsify 复制添加版权

## 简介

现在大多数的博客网站在复制内容时都会在末尾追加上响应的版权信息及作者或本文连接，而插件[docsify-copy-code](https://github.com/jperasmus/docsify-copy-code)并不支持这样的功能，但是又挺方便。所以我有进行了一些修改。

## 实现

在 `index.html` 中添加如下的 JS 代码：

```javascript
<script>
  window.$docsify = {
    copyCode: {
      buttonText: "📋复制",
      errorText: "⚠️错误",
      successText: "✔️复制成功",
    }
  }

  // 复制文本添加版权
  document.oncopy = function (e) {
    let selObj = window.getSelection();
    if (typeof selObj == "undefined") {
      return false;
    }
    let clipboardData = e.clipboardData || window.clipboardData;
    let selectedText = selObj + "";
    let copytext;
    // 默认超过150个字符才添加版权
    if (selectedText.length < 150) {
      copytext = selectedText;
    } else {
      copytext = selectedText +
        `\n————————————————\n版权声明：本文为博主「Hu.Sir」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。\n原文链接：` +
      location.href.split("?")[0];
    }
    clipboardData.setData("text/plain", copytext);
    return false;
  };
</script>
<!-- 复制 -->
<script src="//cdn.jsdelivr.net/npm/docsify-copy-code/dist/docsify-copy-code.min.js"></script>
```

效果如下：
![复制添加版权](/img/copyText.gif)
