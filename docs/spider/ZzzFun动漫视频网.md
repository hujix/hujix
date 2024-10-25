{docsify-updated}

# ZzzFun 动漫视频网

## 前言

我们都知道，再编写爬虫时免不了会遇到一些反扒机制，如：

> - 1、**headers and referer 反爬机制**
> - 2、**IP 限制**
> - 3、**UA 限制**
> - 4、**验证码反爬虫或者模拟登陆**
>   ...

而今天呢，我又将会给大家介绍另一种反爬的情况：[ZzzFun 动漫视频网 - (￣﹃￣)~zZZ](http://www.zzzfun.com/)

---

## 分析

针对这个网站会有一个不同于其他网站的特性：
![zzzfun](\img\zzzfun1.gif)
不知道各位有没有发现什么，没错！那就是该网站某些页面 **无法调试**，否则会 **直接跳转到网站首页**！这是因为在网页的某一请求资源下含有以下的 **JS 源码**：

```javascript
// debug调试时跳转页面
const element = new Image();
Object.defineProperty(element, "id", {
  get() {
    window.location.href = "http://www.zzzfun.com";
  },
});
console.log(element);
```

先不要管这段代码从哪里来，我后面会说明

针对这样的网站，像以前单纯的用浏览器抓包已经满足不了我们了，所以就需要用一点特殊的手段，使用第三方的工具 **Fiddler** 来进行抓包。

> 关于 **Fiddler** 的内容就在我之前的一篇文章里，我还会**持续更新**用法的~~
> [Fiddler 新旧版抓包相关总结](/Python/奇淫技巧/Fiddler新旧版抓包相关总结.md)

说干就干，我这次使用的是最新版的 **Fiddler Everywhere** ，毕竟界面简洁干净嘛~

我们还是打开某一动漫的详情介绍页面后打开 **Fiddler Everywhere** 开始抓取请求：
![zzzfun](\img\zzzfun2.gif)

> 当页面全部加载完成后，我们就可以关闭 **Fiddler Everywhere** 了，避免我们的误操作会造成多余的抓取信息。

当浏览器加载完成后我们就可以开始挨个儿查看所抓取到的信息：

![zzzfun](\img\zzzfun3.png)
当我们挨个儿查看时发现，在某一次与当前剧集链接相同的请求时，点击 **Preview** ，会发现当前页面的所有信息都已经加载完成了，除了视频信息~~ 那么视频信息就有可能是 **AJAX** 或者其他方式来进行的界面局部更新。

我们知道了视频的加载方式，那么接下来就可以开始寻找视频的来源到底时什么了~~
![zzzfun](\img\zzzfun4.png)
在第一遍大概浏览的时候我发现，在上图的位置，浏览器请求了一个 **m3u8** 文件，而这估计就是视频的信息了。
那么反过来说，这是一个**m3u8** 文件的请求链接，那么在这之前，就肯定会有一个地方对这个链接进行了参数生成然后开始请求，并且我发现同一个视频，链接会发生变化，并且每一条链接的时效性很短很短！！！

综合现有的信息我一开始猜测可能是用 **JS** 实现的参数生成，结果并不是，不信你继续往下看~~
既然知道了这一次请求的链接参数，那么我们就开始寻找参数生成的位置：我又挨个儿的对返回数据进行查找，终于让我找到了链接来源：
![zzzfun](\img\zzzfun5.png)
在这里就还可以顺便把我之前埋的坑给填了：
![zzzfun](\img\zzzfun6.png)

---

### 获取 m3u8 文件链接

而且是完全拼接好的链接，那这就简单很多了，我们可以直接从该链接下手进行抓取，然后通过正则表达式来进行链接的提取：
根据抓包信息来破解反爬：

```python
def user_ui():
    main_headers = {
        'Host': 'www.zzzfun.com',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 Edg/86.0.622.69',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Referer': "http://www.zzzfun.com/vod-detail-id-1934.html",
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
    }
    video_urls = 'http://www.zzzfun.com/static/danmu/bed-bofang.php?1934/01.m3u8'
    r = requests.get(video_urls, proxies=proxy, headers=main_headers)
    m3u8_url = re.findall("video.src = '(.*?)';", r.text)[0]
    print(m3u8_url)
```

> 得到以下链接：
> [http://service-agbhuggw-1259251677.gz.apigw.tencentcs.com/pay/hlsjiami/1606222851/8a4dcc584f6a406890cb0551f2753082/1934/01.m3u8](http://service-agbhuggw-1259251677.gz.apigw.tencentcs.com/pay/hlsjiami/1606222851/8a4dcc584f6a406890cb0551f2753082/1934/01.m3u8)

获取了某一集的视频信息，接下来就要开始分析这个新的请求链接的参数：
通过对多集链接的查看可以很明了的看出参数的构造，不信你看：

> **同动漫不同集**：
> 第一集：http://www.zzzfun.com/static/danmu/bed-bofang.php?**1934/01**.m3u8 <br>
> 第二集：http://www.zzzfun.com/static/danmu/bed-bofang.php?**1934/02**.m3u8 <br>
> 第二集：http://www.zzzfun.com/static/danmu/bed-bofang.php?**1934/03**.m3u8
>
> ---
>
> **不同动漫**：
> 动漫一：http://www.zzzfun.com/vod-detail-id-**1916**.html <br>
> 动漫二：http://www.zzzfun.com/vod-detail-id-**1929**.html <br>
> 动漫三：http://www.zzzfun.com/vod-detail-id-**1913**.html

根据以上的信息我们可以很快的看出参数的构造，所以我们就可以写出如何爬取不同的集数了，但是总不能爬取每一个动漫都要输入下载的集数吧，所以这就体现出视频详情页的重要性了，我们可以从视频详情页找到每一集的信息，并且顺手获取了动漫的名字：

```python
def user_ui(videos_url):
    """
    :param videos_url: 视频的详情页链接
    :return:
    """
    main_headers = {
        'Host': 'www.zzzfun.com',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 Edg/86.0.622.69',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Referer': videos_url,
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
    }
    r = requests.get(videos_url, headers=main_headers)
    video_name = re.findall("<title>(.*?)详情介绍-.*?</title>", r.text)[0].replace(" ", '')
    video_nums = len(parsel.Selector(r.text).xpath('//div[@class="episode-wrap"]/ul[1]/li'))
    video_id = videos_url.split("-")[-1].split('.')[0]
    video_urls = ['http://www.zzzfun.com/static/danmu/bed-bofang.php?{}/{:0>2d}.m3u8'.format(video_id, num) for num in
                  range(1, video_nums + 1)]
    rel_path = path + video_name
    if os.path.exists(rel_path):
        pass
    else:
        os.makedirs(rel_path)
    for url in video_urls:
        r = requests.get(url, proxies=proxy, headers=main_headers)
        m3u8_url = re.findall("video.src = '(.*?)';", r.text)[0]
        name = "第" + url.split('/')[-1].split('.')[0] + "话"
        print(name + " ---> " + m3u8_url)

if __name__ == '__main__':
	print("""
	CSDN ：高智商白痴
    CSDN个人主页：https://blog.csdn.net/qq_44700693
	""")
    videos_url = input("请输入视频的详情页链接: ")
    user_ui(videos_url)
```

![zzzfun](\img\zzzfun7.png)

---

### 下载 m3u8 文件

到此我们已经获取了一个动漫所需的信息以及下载的链接，接下来就可以开始研究如何下载的。

> 我在之前的几篇文章中都提到过 **m3u8 文件** 的下载方式：如最近的这篇：[AcFun 弹幕视频网](/Python/网络爬虫/AcFun弹幕视频网)
>
> 核心思想都是 ：[用最普通的方法爬取 ts 文件并合成为 mp4 格式](/Python/网络爬虫/用最普通的方法爬取ts文件并合成为mp4格式)

不过在这个例子中会有一点点的修改：

- 1、对于下载 **m3u8** 文件视频信息时头文件有所不同。
- 2、视频信息链接中没有 **.ts** 字段。

```python
class Download:
    urls = []
    m3u8_headers = {
        'Host': 'service-agbhuggw-1259251677.gz.apigw.tencentcs.com',
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 Edg/86.0.622.69',
        'Accept': '*/*',
        'Origin': 'null',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
    }

    def __init__(self, name, m3u8_url, download_path):
        """
        :param name: 视频名
        :param m3u8_url: 视频的 m3u8文件 地址
        :param path: 下载地址
        """
        self.video_name = name
        self.path = download_path
        self.f_url = m3u8_url
        with open(self.path + '/{}.m3u8'.format(self.video_name), 'wb')as f:
            f.write(requests.get(m3u8_url, headers=self.m3u8_headers).content)

    def get_ts_urls(self):
        with open(self.path + '/{}.m3u8'.format(self.video_name), "r") as file:
            lines = file.readlines()
            for line in lines:
                if 'pgc-image' in line:
                    self.urls.append(line.replace('\n', ''))

    def start_download(self):
        self.get_ts_urls()
        for url in tqdm(self.urls, desc="正在下载 {} ".format(self.video_name)):
            video_headers = {
                'Host': re.findall("https://(.*?)/obj/", str(url))[0],
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 Edg/86.0.622.69',
                'Accept': '*/*',
                'Origin': 'http://www.zzzfun.com',
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
            }
            movie = requests.get(url, headers=video_headers)
            with open(self.path + '/{}.flv'.format(self.video_name), 'ab')as f:
                f.write(movie.content)
        os.remove(self.path + '/{}.m3u8'.format(self.video_name))
```

## 源码及结果

```python
import os
import re
import parsel
import requests
from tqdm import tqdm

path = './'

class Download:
    urls = []
    m3u8_headers = {
        'Host': 'service-agbhuggw-1259251677.gz.apigw.tencentcs.com',
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 Edg/86.0.622.69',
        'Accept': '*/*',
        'Origin': 'null',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
    }

    def __init__(self, name, m3u8_url, download_path):
        """
        :param name: 视频名
        :param m3u8_url: 视频的 m3u8文件 地址
        :param path: 下载地址
        """
        self.video_name = name
        self.path = download_path
        self.f_url = m3u8_url
        with open(self.path + '/{}.m3u8'.format(self.video_name), 'wb')as f:
            f.write(requests.get(m3u8_url, headers=self.m3u8_headers).content)

    def get_ts_urls(self):
        with open(self.path + '/{}.m3u8'.format(self.video_name), "r") as file:
            lines = file.readlines()
            for line in lines:
                if 'pgc-image' in line:
                    self.urls.append(line.replace('\n', ''))

    def start_download(self):
        self.get_ts_urls()
        for url in tqdm(self.urls, desc="正在下载 {} ".format(self.video_name)):
            video_headers = {
                'Host': re.findall("https://(.*?)/obj/", str(url))[0],
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 Edg/86.0.622.69',
                'Accept': '*/*',
                'Origin': 'http://www.zzzfun.com',
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
            }
            movie = requests.get(url, headers=video_headers)
            with open(self.path + '/{}.flv'.format(self.video_name), 'ab')as f:
                f.write(movie.content)
        os.remove(self.path + '/{}.m3u8'.format(self.video_name))

def user_ui(videos_url):
    """
    :param videos_url: 视频的详情页链接
    :return:
    """
    main_headers = {
        'Host': 'www.zzzfun.com',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 Edg/86.0.622.69',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Referer': videos_url,
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
    }
    r = requests.get(videos_url, headers=main_headers)
    video_name = re.findall("<title>(.*?)详情介绍-.*?</title>", r.text)[0].replace(" ", '')
    video_nums = len(parsel.Selector(r.text).xpath('//div[@class="episode-wrap"]/ul[1]/li'))
    video_id = videos_url.split("-")[-1].split('.')[0]
    video_urls = ['http://www.zzzfun.com/static/danmu/bed-bofang.php?{}/{:0>2d}.m3u8'.format(video_id, num) for num in
                  range(1, video_nums + 1)]
    rel_path = path + video_name
    if os.path.exists(rel_path):
        pass
    else:
        os.makedirs(rel_path)
    for url in video_urls:
        r = requests.get(url, headers=main_headers)
        m3u8_url = re.findall("video.src = '(.*?)';", r.text)[0]
        name = "第" + url.split('/')[-1].split('.')[0] + "话"
        Download(name, m3u8_url, rel_path).start_download()

if __name__ == '__main__':
	print("""
	CSDN ：高智商白痴
    CSDN个人主页：https://blog.csdn.net/qq_44700693
	""")
    videos_url = input("请输入视频的详情页链接: ")
    user_ui(videos_url)
```

结果：
![zzzfun](\img\zzzfun8.png)

---

## 最后

**最后给个小提醒：**
如果你出现了这个错误提醒：`IndexError: list index out of range`
那么你就该检查下你的浏览器打开该网页时是不是这样的：
![zzzfun](\img\zzzfun9.png)

解决方法很简单，就是手动点开它就好了，然后再次运行代码~~
