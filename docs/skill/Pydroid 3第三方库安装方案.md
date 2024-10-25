# Pydroid 3 第三方库安装方案

---

## 引入

> 某些时候，我们可能会有一些类似与以下的某些需求：
>
> 1.  需要**随身携带**我们已经写好的 Python 代码并且可以运行出结果。
> 2.  需要随时可以写一点比较小的 Python 程序，并且能够运行
> 3.  ...

那么我们可能就会想到将**Python**的**IDE**安装到手机上。（如果你没有想到，那现在总该想到了吧 😎）
根据我 **不官方，不权威** 的统计：就目前来说，**Pydroid 3** 的**功能比较全，能安装 jupyter、pygame、lxml 等第三方库，能写爬虫程序，拥有功能齐全的终端仿真器...**

> 如果你还没有安装，你可以通过我提供的链接来下载安装：
> 你可以直接[点击链接](https://m.apkpure.com/cn/search?q=pydroid+3&t=app)来下载安装最新版。

**但是**，我们在安装一些第三方库（比如 parsel、lxml 等等）的时候可能会失败，但这并不代表不能使用，所以，接下来我会告诉大家两种解决方案。**（推荐第二种）**

---

## 解决方案

### 一：通过 PyPi 的官网进行安装

第一种方案就是通过在 [pypi 官网](https://pypi.org/) 上下载你所需要的某个第三方库。
**具体步骤如下：**
我们以安装第三方库 **lxml** 作为例子来演示：

1. 在官网上搜索 **lxml** :

![Pydroid3第三方库](\img\Pydroid3第三方库.png ":size=50%")

2. 进入下载页面选择**合适**的版本：

![Pydroid3第三方库](\img\Pydroid3第三方库1.png)

**whl** 文件那么多，应该下载哪一个呢？
这就要看 **Pydroid 3** 中 **pip** 支持什么类型（平台)的了。
**如何查看呢**：我在各大平台搜索了几个小时，可道是：皇天不负有心人啊，终于让我找到了可行的查看方法：

如下：
**进入 Pydroid3 点击左上角，进入 interpreter：**
如果你和我的软件版本（**3.11_arm64**）一样的话，可以直接参考我的数据：

```python
>>>import pip._internal.pep425tags
>>>print(pip._internal.pep425tags.get_supported())
[('cp37','cp37m','linux_aarch64'),('cp37','abi3','linux_aarch64'),('cp37','none','linux_aarch64'),('cp36','abi3','linux_aarch64'),
('cp35','abi3','linux_aarch64'),('cp34','abi3','linux_aarch64'),('cp33','abi3','linux_aarch64'),('cp32','abi3','linux_aarch64'),
('py3','none','linux_aarch64'),('cp37','none','any'),('cp3','none','any'),('py37','none','any'),('py3','none','any'),
('py36','none','any'),('py35','none','any'),('py34','none','any'),('py33','none','any'),('py32','none','any'),
('py31','none','any'),('py30','none','any')]
>>>
```

**因为下载页中有以 'cp37' 字段的 whl 文件，但是并不包含字段 'linux_aarch64'，所以在上面列表中找 any，比如以（'cp37', 'none', 'any') 为例，找到以下文件：**

**lxml** 下载链接: [点击下载](https://files.pythonhosted.org/packages/85/9e/93e2c3af278c7c8b6826666bbcb145af2829bd761c3b329e51cd6343836c/lxml-4.5.0-cp37-cp37m-manylinux1_x86_64.whl)

下载完成后，将该文件改名为：**lxml-4.5.0-cp37-none-any**（文件格式不变）
![Pydroid3第三方库](\img\Pydroid3第三方库2.png ":size=50%")

安装 **whl** 文件：用 **ES 文件浏览器** 长按 **选中文件** 点击右下角的**更多**，在**属性**中，**复制全路径**。
![Pydroid3第三方库](\img\Pydroid3第三方库3.png ":size=50%")

**进入 Pydroid3 点击左上角，进入 terminal：** 输入 **pip install** 后 **Paste** 刚刚复制的全路径： 回车即可安装。

```bash
/storage/emulated/0 $ pip install /storage/emulated/0/Download/Browser/lxml-4.5.0-cp37-none-any.whl
Processing ./Download/Browser/lxml-4.5.0-cp37-none-any.whl
Installing collected packages: lxml
Successfully installed lxml-4.5.0
/storage/emulated/0 $
```

### 二：通过 Pydroid 3 原作者提供的存储库插件进行安装

Pydroid 存储库插件提供了一个带有预构建软件包的快速安装存储库，其中包含本机库。
你也可以直接 [点击下载最新版](https://m.apkpure.com/cn/pydroid-repository-plugin/ru.iiec.pydroid3.quickinstallrepo)（需要梯子） 进行安装。
**或者：** [直接下载我上传的全部文件](https://download.csdn.net/download/qq_44700693/12675324)（最近一次上传：2020/7/31）

> 不过你会发现，下载的并不是单纯的 **apk** 文件，而是 **xapk** 格式的文件。至于安装，你可以下载可以解析 **xapk** 文件的安装器就好。你也可以直接下载 刚才的下载地址下载安装 **APKPure 客户端** 进行解析安装，完事可以卸载。

> [!TIP]
> 如果你是在别的地方找到这个储存库插件的，那么你就一定要注意，这个软件大约 **100 多兆**，是包含数据包的。
> 而某些下载链接所下载的只有一两兆左右，这只是一个安装包，而且进入软件下载数据包时，会出现找不到数据源的错误提示。
> 所以还是建议你下载包含数据包的安装文件。
