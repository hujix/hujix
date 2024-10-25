{docsify-updated}

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119191919608.jpg)

`申明：本来这篇博客是综合我个人在使用fiddler的过程中的一些使用技巧和问题解决方案，一开始是打算同步更新新版和旧版，但是后来我发现，其实原理和方法都是差不多的，所以后续更新主要以最新版的Fiddler Everywhere为主。`

`目前已更新：新版 Fiddler Everywhere解决App抓包无网络。后续会持续更新~~`

## 导入

之前在研究爬虫时发现，有些网站并不能通过浏览器的后台抓取，所以我又开始演技抓包工具 **Fiddler** ，到目前为止也查过不少的坑，所以我准备将这些内容总结一下供大家查阅，同时若有不对的地方也请各位大佬不吝赐教~

---

### 软件安装

#### 旧版 Fiddler4

对于新旧版本的 **Fiddler** 可以直接去官网下载，速度也还可以，所以这里就不提供下载链接了，详情见 **[官网直达](https://www.telerik.com/fiddler)**。

> **不过这里有一点要注意：**
>
> 如果想要下载旧版的 **Fiddler** 则需要 点击：**Download Now** 下面的 **Looking for Fiddler Classic? [Download it here](https://www.telerik.com/download/fiddler)** ，否则直接下载的就是最新版的 **Fiddler Everywhere** 。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210106180212559.png)

#### 新版 Fiddler Everywhere

相对于旧版，新版的 **Fiddler** 的界面变得更简洁，相应的，去掉了一些不太常用的功能按钮：

不过缺点是，**Fiddler Everywhere**在打开后**必须登录**才可以使用，好在我有谷歌账户，可以直接登录。![](https://img-blog.csdnimg.cn/img_convert/3550582a4430b03522497ed427bd005a.png)

---

### 证书配置

#### 旧版 Fiddler4

对于旧版的 **Fiddler** ，我们下载并安装好后就可以配置证书于设置了：
![img-LByU3way-1605780378079](https://img-blog.csdnimg.cn/img_convert/3f2c19fcd50e7186a4459df63ff4528b.png)

找到菜单栏中的 **Tools** ，点击 **Options** 进入后找到 **HTTPS** 选项：
![](https://img-blog.csdnimg.cn/img_convert/cb90206a70de4931348aec7de5603234.png)
并且对于简单的抓包需求，我们还可以设置 **Rules**:![](https://img-blog.csdnimg.cn/img_convert/65417a00fbee387013096a9d9535e603.png)

到此，基本的配置就已经完成，可以尝试以下抓包了：

我们对 **[必应主页](https://cn.bing.com/)** 进行抓取可以看到以下的页面：![](https://img-blog.csdnimg.cn/img_convert/62c7c18ffa150b3705474789cf4a9852.png)

> 这里有一点需要**注意**：
> 如果你的浏览器含有一些有网络代理功能的插件或者其它的代理工具，需要将它们**全部都关闭掉**，不然的话会抓取不到任何的数据。
> 其实原因的话理解起来很简单：**Fiddler** 扮演的是一个中间商，无论什么数据请求都需要它来进行代理，都要通过它，然后它才能把这些数据都显示出来，如果你使用了第三方的代理服务的话，它就根本不知道你到底进行了怎么样的数据交换。

可以看到我们已经抓取了 **[必应主页](https://cn.bing.com/)** 的所有的数据信息。

#### 新版 Fiddler Everywhere

打开软件后进入主界面，可以直接点击右上角的设置按钮进行证书安装：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119183542667.png)
因为最新版的 **Fidler** 默认关闭抓取：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119183824587.png)
所以我们准备好后可以直接开启抓取信息，我们依旧用 **[必应主页](https://cn.bing.com/)** 来进行演示：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119184052420.png)
我们先清空所有的抓包信息，接着刷新浏览器，可以看到有很多的信息都被抓取了下来。但是有用的却不多，所以我们还可以简单的配置一下过滤器：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119184449392.png)
然后重新清空所有的已抓取信息，刷新浏览器就和我上面的图差不多了。

---

### 修改服务器返回数据

#### 旧版 Fiddler4

我们依旧用 **[必应主页](https://cn.bing.com/)** 来进行演示：
![](https://img-blog.csdnimg.cn/img_convert/5ccabea5279ff4659d59a6fc82ba50f6.png)
我们先清空所有的抓包信息，接着刷新浏览器，可以发现**必应主页**的图标是通过一个链接去请求的，那么我们是否可以换掉这个返回数据呢？

> 在这里，我找了一个**百度云盘**的图片链接：
> [https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/baiduyun@2x-e0be79e69e.png](https://img-blog.csdnimg.cn/img_convert/50473dad2c459cc5ada43f40d5a4d3bb.png) > ![](https://img-blog.csdnimg.cn/img_convert/50473dad2c459cc5ada43f40d5a4d3bb.png)

我们将需要修改的请求拖动到 **AutoResponder** 中：
![](https://img-blog.csdnimg.cn/img_convert/aa2b0e44a91d0a6ab7d89fb971537239.png)
根据返回类型的样式选择对应的规则：![](https://img-blog.csdnimg.cn/img_convert/032965996ab95506d8804f8db054ff94.png)

这里只是需要将图片重定向，所以我们选择的规则是`*redir:http://www.example.com` 或者 `http://www.example.com` ，我们只需要将链接更换为我们需要重定向的链接，然后点击 **save** 保存：![](https://img-blog.csdnimg.cn/img_convert/a1870a8ff43ed8ca4e0988084427918f.png)

到现在，我们已经编写好了修改数据库返回数据的规则，现在只需要开启规则就可以了：

![](https://img-blog.csdnimg.cn/img_convert/2fcce2e7a7328bfede46428142a1c30f.png)

接着刷新一下浏览器，就会看到以下的这种效果：![](https://img-blog.csdnimg.cn/img_convert/7f90ec112504f21b7cf53e1269b16f97.png)

> **备注:**
>
> - 1、**Enable rules**（激活规则）：勾选此选项，自动响应才会激活。
> - 2、**Unmatched requests passthrough**（跳过非匹配请求）：如果不勾选此选项,那么抓包的时候,会返回`[Fiddler] The Fiddler AutoResponder is enabled, but this request did not match any of the listed rules. Because the "Unmatched requests passthrough" option on the AutoResponder tab is not enabled, this HTTP/404 response has been generated.`
>   这句话的意思是，**Fiddler**的自动响应激活了，但是请求没匹配到任何列表中的规则。而且因为跳过非匹配请求选项没有激活，所以产生了**HTTP/404**返回结果。
> - 3、**Enable latency**（激活延迟）：勾选了这个选项,在规则里面就可以设置是立即返回响应，还是隔多少毫秒返回响应 ，

#### 新版 Fiddler Everywhere

> 在这里，我依然用**百度云盘**的图片链接来做演示：
> [https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/baiduyun@2x-e0be79e69e.png](https://img-blog.csdnimg.cn/img_convert/50473dad2c459cc5ada43f40d5a4d3bb.png) > ![](https://img-blog.csdnimg.cn/img_convert/50473dad2c459cc5ada43f40d5a4d3bb.png)

右击需要修改的请求，选择 `Add New Rule` ，可以跳转到规则详情页：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119185146260.png)
然后点击编辑，更改返回的数据：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119185814720.png)
因为我们只需要将请求连接重定向，所以选择`*redir:http://www.example.com` 或者 `http://www.example.com` 都可以。之前旧版的选择了第一种，那么这里就选用第二种吧：
将重定向的连接填写好后点击 **save** 保存：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119190148264.png)
到此，我们也编写完了替换规则，接下来就是开启抓包并打开 **Auto Responder** ，点击刷新浏览器后可以看到：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119190504960.png)

---

### APP 抓包无网络

#### 问题引入

`问题描述：fiddler证书已经配置好，网页抓包没问题，大部分App抓包没问题，某一个App显示无网络连接。`
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210111180210951.png)

对于这种情况，首先要知道为什么会出现这种情况？
**答案就是：客户端对 SSL 证书进行了检测。**

这时候就要使用**Xposed 框架**和**JustTrustMe**来绕过解决这个问题。

> - **Xposed 模块**：Xposed 框架(Xposed Framework)是一套开源的、在 Android 高权限模式下运行的框架服务，可以在不修改 APK 文件的情况下影响程序运行(修改系统)的框架服务，基于它可以制作出许多功能强大的模块，且在功能不冲突的情况下同时运作。【[Xposed 框架---百度百科](https://baike.baidu.com/item/Xposed%E6%A1%86%E6%9E%B6/16859077)】【[Xposed Module Repository](https://repo.xposed.info/)】
>   ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210106183958397.jpg)
> - **JustTrustMe**：一个 xposed 模块，用于禁用 SSL 证书检查。JustTrustMe 是将 **APP** 中所有用于校验 SSL 证书的 API 都进行了 **Hook**，从而绕过证书检查。【[JustTrustMe---GitHub](https://github.com/Fuzion24/JustTrustMe)】

#### 下载并安装配件

##### 插件环境准备

一开始，我是在我的旧手机上安装这一系列的插件时，因为 Android 的版本有点高，适配不了当前版本的框架，所以我干脆下了个夜神模拟器（Android 5）来进行安装，结果是可行的，至于模拟器的安装与配置，在这里就不再细说了。

##### 下载安装 Xposted 框架

首先进入 **[Xposed Module Repository](https://repo.xposed.info/)** 的页面，接着按照下图顺序点击并下载最新版的 **Xposed Installer**：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210111165334761.png)
打开模拟器后，直接双击刚刚下载的安装包就可以安装，安装完成后打开应用进行配置：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210111170447379.png)
打开软件以后，点击 **Version 89** ，然后点击 **Install**:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210111170850109.png)

> 在安装的过程中会提示授权 root 权限，点击授权就好。

当出现最后一张图的画面时，就说明已经安装成功了，重启模拟器后打开软件：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210111171121391.png)

##### 下载安装 JustTrustMe 模块

首先，先打开 [JustTrustMe](https://github.com/Fuzion24/JustTrustMe/releases/tag/v.2) 网页：
![在这里插入图片描述](https://img-blog.csdnimg.cn/2021011117144528.png)
找到**apk**文件，点击下载，完成后双击安装。
现在，我们所需要的东西已经全部都准备好了，接下来就开始启用模块：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210111171846718.png)
启用模块后，配置好模拟器的代理后，就可以抓包了：
![标题](https://img-blog.csdnimg.cn/20210111174527485.png)
