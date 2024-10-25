# Typora

## 方式一：修改脚本激活判断（推荐）

1. 打开并格式化脚本：`<Typora>/resources/page-dist/static/js/LicenseIndex.**.**.chunk.js`
2. 全局搜索：`e.hasActivated`
3. 修改脚本为以下的内容：

```javascript
return (
  window.location.search
    .substr(1)
    .split("&")
    .forEach(function (t) {
      e[t.split("=")[0]] = t.split("=")[1];
    }),
  // (e.hasActivated = "true" == e.hasActivated)  原内容
  (e.hasActivated = true), // 修改后的内容
  (e.index = isNaN(e.index - 0) ? 0 : e.index - 0),
  e
);
```

## 方式二：修改试用时间（无限试用）

1. 打开并格式化脚本：`<Typora>/resources/page-dist/static/js/LicenseIndex.**.**.chunk.js`
2. 全局搜索：`e.dayRemains`

3. 修改返回值的试用期限：

```javascript
y = function (e) {
  e.dayRemains = 9999999; // 新增的内容
  var t = e.dayRemains,
    n = e.quitOnClose,
    a = e.needLicense,
    i = Object(u.a)(e, ["dayRemains", "quitOnClose", "needLicense"]),
    c = r.a.useState(i.index),
    // ......
}
```
