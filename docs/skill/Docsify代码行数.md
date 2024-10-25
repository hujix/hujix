<div align='center'>
  <!-- <img src="Docsify/img/docsify-logo.svg" alt="dicsify"> -->
</div>

# Docsify 添加代码行数

## 简介

得益于 Docsify 的开放性，在文档上可以安装很多的插件，并且还可以自定义插件。
在这里，将总结出一些以供参考。

---

## 添加代码行数

原生 Docsify 的代码块并不支持显示代码行数，总觉得怪怪的，所以在这里记录一下我的实现方案。
并且修改了部分代码的高亮。

> [!NOTE]
> 灵感来源于[highlight.js](https://highlightjs.org/)添加代码行数的思想。

## 定义插件 JS 代码

根据 Docsify 官网的介绍，docsify 提供了一套插件机制，其中提供的钩子（hook）支持处理异步逻辑，可以很方便的扩展功能。【[点击查看](https://docsify.js.org/#/zh-cn/write-a-plugin?id=%e8%87%aa%e5%ae%9a%e4%b9%89%e6%8f%92%e4%bb%b6)】

首先，要显示行数，就必须知道代码的行数是多少，而且必须在显示之前计算出来，根据我们的需求，最终选定了 `hook.afterEach(function(html, next) {}` 来作为我们插件的入口。根据官网的介绍，这个钩子函数是在**解析成 html 后调用**，而且**异步处理完成后调用 next(html) 返回结果**。

在 `index.html` 中添加如下代码：

```javascript
<script>
  window.$docsify = {
    plugins: [
      // 添加代码行数
      function (hook, vm) {
        hook.afterEach(function (html, next) {
          let doc = new DOMParser().parseFromString(html, "text/html");
          let preNodes = doc.querySelectorAll("pre");
          for (let preNode of preNodes) {
            let codeNode = preNode.querySelector("code");
            let preUl = doc.createElement("ul");
            preUl.classList.add("pre-number");
            let codeLength = codeNode.innerText.split("\n").length;
            for (let i = 1; i < codeLength + 1; i++) {
              let li = doc.createElement("li");
              li.appendChild(doc.createTextNode(i));
              preUl.appendChild(li);
            }
            preNode.appendChild(preUl);
          }
          next(doc.body.outerHTML);
        });
      },
    ],
  }
</script>
```

## 修改代码行数的样式

加上如下的 CSS ，来调整行数的样式。

```css
/* 代码块 */
.markdown-section pre > code {
  margin-left: 15px; /* 代码行数过百防重叠 */
}

.markdown-section pre {
  position: relative;
}

/* 代码行数 */
.pre-number {
  position: absolute;
  top: -6px;
  left: 0;
  margin-left: -15px;
  text-align: right;
  padding-right: 5px;
  border-right: 1px solid #c3ccd0;
  color: #aaa;
}

.pre-number > li {
  list-style: none;
  font-size: 15px !important;
  line-height: 1.5 !important;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

```

整体效果如上所示！

> [!TIP]
> 这里只给出了有关代码行数的样式，其他的都去掉了。

## 结合 Tabs 插件

如果使用了 Tabs 插件（[docsify-tabs](https://jhildenbiddle.github.io/docsify-tabs)），同样能够做到显示行数：

**自行体验：**

<!-- tabs:start -->

<!-- tab:第一个tab -->

第一个 tab 示例文本行

```java
public class HelloWorld{
	public static void main(String[] args) {
		System.out.println("Hello World!");
	}
}
```

<!-- tab:第二个tab -->

第二个 tab 示例文本行

```java
public class HelloWorld{
	public static void main(String[] args) {
		System.out.println("Hello World!");
	}
}
```

<!-- tab:第三个tab -->

第三个 tab 示例文本行

```java
public class HelloWorld{
	public static void main(String[] args) {
		System.out.println("Hello World!");
	}
}
```

<!-- tabs:end -->
