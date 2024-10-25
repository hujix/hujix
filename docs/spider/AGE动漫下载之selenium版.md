{docsify-updated}

# AGE 动漫下载 selenium 版

## 导入

终于放暑假了，其实都还**没有感觉**！在家都待了大半年了，完全忘记了自己之前对放假期待的那种心情~~~
不过无论怎样，都 **挡不住我自学的脚步！！！** 话不多说，马上开始这次的介绍：

此次，我采用了两种方式来完成这一次的爬虫实例：

- 1、**requests 版：** 通过浏览器的开发者工具抓包，分析 **发送的链接** 以及 **返回的数据** 来爬取。 直达：[AGE 动漫下载之 requests 版](/Python/网络爬虫/AGE动漫下载之requests版)
- 2、**selenium 版 ：** 通过驱动 **驱动浏览器** 来完成部分操作，并获取在完成 **JS 渲染后的网页源码** 来爬取。

---

## 分析

思路依旧从搜索入手！
我们以 **“约会”** 为关键词来编写**第一版**的代码：
![age-selenium](\img\age-selenium1.png)

```python
from selenium import webdriver

browser = webdriver.Chrome()
def search_get(keyword):  # 控制浏览器进行关键词搜索
    try:
        input = browser.find_element_by_xpath('//*[@id="navbarSupportedContent"]/form/div/input')
        input.send_keys(keyword)
    except:
        print("搜索时出错！！！")
        exit()

def user_ui():
    try:
        print('#' * 25 + "\tAGE动漫搜索下载\t" + '#' * 25)
        keyword = '约会' # input('请输入搜索的关键字：')
        browser.get('http://agefans.org/')
        search_get(keyword + '\n')
        print_info(browser)
    except:
        print("未知错误！！！")
    finally:
        time.sleep(5)
        browser.close()

if __name__ == '__main__':
    user_ui()
```

比起 **requests 版** ，**selenuim 版** 在打印搜索到的信息时会简单很多：

```python
vi_url = {}  # 保存搜索记录和对应链接
def print_info(browser):
    try:
        all_info = browser.find_elements_by_xpath('//*[@id="search_list"]/ul/li')
        num = 0
        for info in all_info:
            num += 1
            vi_url[num] = info.find_element_by_class_name('stretched-link-').get_attribute('href')
            print('{}'.format(num), end='')
            print('\t' + info.text + '...')
            print("*" * 50 + '\n')
    except:
        print("获取搜索列表信息失败！！！")
        exit()
```

打印结果示例：

![age-selenium](\img\age-selenium2.png)
当我们打印好全部信息后，就可以开始获取所选剧集的每一集链接：

```python
def video_urls(url):
    try:
        browser.get(url)
        browser.implicitly_wait(5)
        time.sleep(3)
        video_info = browser.find_elements_by_xpath('//*[@id="plays_list"]/ul/li')
        for info in video_info:
            video_url[info.text] = info.find_element_by_xpath('./a').get_attribute('href')
    except:
        print("获取视频链接出错！！！")
        exit()
```

用浏览器检查可以看到，视频的链接就直接显示在 **JS 渲染后** 的代码中，
所以我们要想办法获取被 **JS 渲染后** 的代码：

> html = browser.execute_script("return document.documentElement.outerHTML")
>
> ![age-selenium](\img\age-selenium3.png)

因为获取当前视频链接时可能会出错，所以我用来一个临时变量 **errow_url = list(video_url.keys())** 来作为依据，判断是否获取完所有的视频链接。

> browser.find_element_by_link_text(name).click()
>
> > name : 通过每一集的名字来查找并点击，在这里指：**第 01 话** ，**第 02 话**，，，，
>
> 目的是为了**切换集数**，获取不同集数的视频链接。

```python
def download_parsing():
    global route, piece, piecewise
    errow_url = list(video_url.keys())
    while errow_url:   # [] 代表 false, 否则为 true
        for name in errow_url:
            browser.get(video_url[name])
            browser.find_element_by_link_text(name).click() # 切换集数
            browser.implicitly_wait(5)
            time.sleep(4)
            route = browser.find_element_by_xpath('//*[@id="play"]/div[2]/div[1]/select/option').text
            html = browser.execute_script("return document.documentElement.outerHTML")
```

**但是，** 直到我获取到 **JS 渲染后** 的代码后发现，蓝色方框内的代码依然找不到。
**不过，** 我又发现在 **\<iframe>...\</iframe>** 标签中有一段类似的链接，不过好像被加密了，幸好加密不难，直接导库解密。
![age-selenium](\img\age-selenium4.png)

```python
def download_parsing():
    #
    #  不进行任何改动
    #
            route = browser.find_element_by_xpath('//*[@id="play"]/div[2]/div[1]/select/option').text
            html = browser.execute_script("return document.documentElement.outerHTML")
            URL = unquote(BeautifulSoup(html, 'html.parser').find('iframe').attrs['src'].split('=', 1)[-1])
            episodes_url[name] = URL
```

## 优化结构

到目前为止，确实能够获取当前视频的全部下载链接，但是，只能加载这一个算什么，我在后期尝试后发现，当视频的加载线路是 **‘A’** 的话， **\<iframe>...\</iframe>** 标签中的链接比真实的视频链接多了 **&t=mp4** 的后缀。
![age-selenium](\img\age-selenium5.png)
所以我进行了一点点小优化：

```python
def download_parsing():
    #
    #  不进行任何改动
    #
            route = browser.find_element_by_xpath('//*[@id="play"]/div[2]/div[1]/select/option').text
            html = browser.execute_script("return document.documentElement.outerHTML")
            URL = unquote(BeautifulSoup(html, 'html.parser').find('iframe').attrs['src'].split('=', 1)[-1])
            if 'A' in route:  # name 是第几集的名称
                episodes_url[name] = URL.replace('&t=mp4', '')
            else:
                episodes_url[name] = URL
```

解决了线路导致的链接问题，接下来就该解决某些视频有分段的情况：
![age-selenium](\img\age-selenium6.png)
![age-selenium](\img\age-selenium7.png)
基本思路如下：

**检索**是否有分段信息：

- **若没有，则 加载源码 ---> 判断线路 ---> 分情况保存视频**。
- **若有，则通过 for pie in piecewise: 遍历分段信息，并通过 pie.click()** 来进行分段视频的选择后 ，进行 加载源码 ---> 判断线路 ---> 分情况保存视频的操作。

> 注意： 在进行选择分段信息时：
>
> - 我的第一版是这样写的：browser.find_element_by_link_text(pie.text).click()
>   但是我发现，无论我再怎么调试，都出现这类提示：
>
>   **<class 'selenium.common.exceptions.NoSuchElementException'>Message: no such element: Unable to locate element: {"method":"link text","selector":"分段 1"}**
>
> **原因：** 根据 **_selenium_** 的 [官方文档](https://selenium-python-zh.readthedocs.io/en/latest/index.html) 可以看到，被查找的链接文本在 **\<a>...\</a>** 标签内，说明： **.find_element_by_link_text()** 和 **.find_element_by_partial_link_text()** 只能查找 **\<a>...\</a>** 标签内的链接文本。
> ![age-selenium](\img\age-selenium8.png)

```python
def download_parsing():
    global route, piece, piecewise
    errow_url = list(video_url.keys())
    while errow_url:
        for name in errow_url:
            browser.get(video_url[name])
            browser.find_element_by_link_text(name).click()
            browser.implicitly_wait(5)
            time.sleep(4)
            try:
                piece = browser.find_element_by_xpath('/html/body/div[3]/div[1]/div[1]/span[1]').text
                piecewise = browser.find_elements_by_xpath('//span[@class="current_item_parts"]/button')
            except Exception as e:
                print("Error" + ': ' + str(type(e)) + str(e))
                print('该视频无分段！！！')
            try:
                if '请自行切换分段' not in piece:
                    route = browser.find_element_by_xpath('//*[@id="play"]/div[2]/div[1]/select/option').text
                    html = browser.execute_script("return document.documentElement.outerHTML")
                    URL = unquote(BeautifulSoup(html, 'html.parser').find('iframe').attrs['src'].split('=', 1)[-1])
                    if 'A' in route:
                        episodes_url[name] = URL.replace('&t=mp4', '')
                    else:
                        episodes_url[name] = URL
                else:
                    for pie in piecewise:  # 分段视频
                        try:
                            pie.click()
                        except Exception as e:
                            print(name + ": Error 001" + ': ' + str(type(e)) + str(e))
                        route = browser.find_element_by_xpath('//*[@id="play"]/div[2]/div[1]/select/option').text
                        html = browser.execute_script("return document.documentElement.outerHTML")
                        URL = unquote(BeautifulSoup(html, 'html.parser').find('iframe').attrs['src'].split('=', 1)[-1])
                        if 'A' in route:
                            episodes_urls.setdefault(name, []).append(URL.replace('&t=mp4', ''))
                        else:
                            episodes_urls.setdefault(name, []).append(URL)
                        time.sleep(1)
                errow_url.remove(name)  # 清除已完成加载的集数
            except Exception as e:
                print("Error" + ': ' + str(type(e)) + str(e))
                print('获取{}的视频下载链接失败！！！'.format(name))
```

### 提示

> 对 episodes_urls.setdefault(name, []).append(URL) 的解释：
> 1、**episodes_urls** ：一个**空字典。**
> 2、**name** ：获取到的**集数名。**
> 3、**dict.setdefault(key, default=None)**
>
> > - **参数:** <br> > > **key** -- 查找的键值。<br> > > **default** -- 键不存在时，设置的默认键值。
> > - **返回值:**
> >   如果字典中包含有给定键，则返回该键 **对应的值**，否则返回为该键 **设置的值。**
>
> 4、**episodes_urls.setdefault(key, []).append(value)** ：向 **episodes_urls** 字典中 **key** **对应的值**(已设置为**列表**类型)中追加值 **value**。

## 视频下载

到目前为止，已经成功获取了所有的视频链接，因为某一个剧集中，可能同时含有未分段和分段的视频，所以需要判断是否需要对两个字典遍历，若为分段视频，则需要判断是否存在当前集数的视频，若存在则在集数后加上一个 **“1”** 。

> 1、**episodes_url** ：保存着没有分段的视频（无列表）。<br>
> 2、**episodes_urls** ：保存着有分段的视频（有列表）。

```python
def video_download():
    global rel_path
    proxies = {'HTTP': random.choice(proxy)}
    if episodes_url:   # 下载没有分段的视频
        for name in tqdm(episodes_url, desc='正在下载: '):
            r = requests.get(episodes_url[name], proxies=proxies)
            with open(rel_path + '/' + name + '.mp4', 'wb') as f:
                f.write(r.content)
    if episodes_urls:  # 下载含有分段的视频
        for name in tqdm(episodes_urls, desc='正在下载: '):
            for epi_url in episodes_urls[name]:
                if os.path.exists(rel_path + '/' + name + '.mp4'):
                    r = requests.get(epi_url, proxies=proxies)
                    with open(rel_path + '/' + name + '1.mp4', 'wb') as f:
                        f.write(r.content)
                else:
                    r = requests.get(epi_url, proxies=proxies)
                    with open(rel_path + '/' + name + '.mp4', 'wb') as f:
                        f.write(r.content)
```

---

## 遗留问题

**问题描述**：在**有列表**的情况下，遍历下载时，起初我想用我之前写的一个方法(详情请见：[Python 爬虫用最普通的方法爬取 ts 文件并合成为 mp4 格式](/Python/网络爬虫/用最普通的方法爬取ts文件并合成为mp4格式))将分段视频合并，起初我的代码如下：改动的部分我用 **“#”** 隔出来了。

```python
def video_download():
    global rel_path
    proxies = {'HTTP': random.choice(proxy)}
    if episodes_url:
        for name in tqdm(episodes_url, desc='正在下载: '):
            r = requests.get(episodes_url[name], proxies=proxies)
            with open(rel_path + '/' + name + '.mp4', 'wb') as f:
                f.write(r.content)
    if episodes_urls:
        for name in tqdm(episodes_urls, desc='正在下载: '):
            for epi_url in episodes_urls[name]:
                if os.path.exists(rel_path + '/' + name + '.mp4'):
                    r = requests.get(epi_url, proxies=proxies)
                    ##########################################################
                    with open(rel_path + '/' + name + '.mp4', 'ab') as f:
                    ##########################################################
                        f.write(r.content)
                else:
                    r = requests.get(epi_url, proxies=proxies)
                    with open(rel_path + '/' + name + '.mp4', 'wb') as f:
                        f.write(r.content)
```

但是这样到的结果是：视频的 **大小改变了**，但是播放时还是 **只有第一段视频的时间长度！** 到这里我就突然**迷茫**了~~~

---

## 参考代码

```python
import os
import time
import random
import requests
from tqdm import tqdm
from bs4 import BeautifulSoup
from selenium import webdriver
from urllib.parse import unquote

proxy = ['HTTP://125.108.84.103:9000', 'HTTP://118.126.107.41:8118', 'HTTP://113.194.23.84:9999',
         'HTTP://113.194.50.99:9999', 'HTTP://58.253.155.244:9999', 'HTTP://182.32.251.183:9999',
         'HTTP://120.83.104.120:9999', 'HTTP://113.121.67.66:9999', 'HTTP://114.239.172.17:9999',
         'HTTP://139.155.41.15:8118', 'HTTP://183.166.111.164:9999', 'HTTP://123.55.98.4:9999',
         'HTTP://123.169.166.127:9999', 'HTTP://110.243.26.86:9999', 'HTTP://118.212.107.10:9999',
         'HTTP://58.211.134.98:38480']

path = './Spider'
video_url = {}  # 搜索到的视频信息
episodes_url = {}  # 视频下载地址
episodes_urls = {}  # 分段视频链接
browser = webdriver.Chrome()

def search_get(keyword):
    try:
        input = browser.find_element_by_xpath('//*[@id="navbarSupportedContent"]/form/div/input')
        input.send_keys(keyword)
    except:
        print("搜索时出错！！！")
        exit()

vi_url = {}
def print_info(browser):
    try:
        all_info = browser.find_elements_by_xpath('//*[@id="search_list"]/ul/li')
        num = 0
        for info in all_info:
            num += 1
            vi_url[num] = info.find_element_by_class_name('stretched-link-').get_attribute('href')
            print('{}'.format(num), end='')
            print('\t' + info.text + '...')
            print("*" * 50 + '\n')
    except:
        print("获取搜索列表信息失败！！！")
        exit()

def video_urls(url):
    global rel_path
    try:
        browser.get(url)
        browser.implicitly_wait(5)
        time.sleep(3)
        video_info = browser.find_elements_by_xpath('//*[@id="plays_list"]/ul/li')
        name = browser.find_element_by_xpath('//*[@id="play"]/div[2]/div[2]/a/h5').text
        rel_path = path + '/' + str(name)
        if os.path.exists(rel_path):
            pass
        else:
            os.makedirs(rel_path)
        for info in video_info:
            video_url[info.text] = info.find_element_by_xpath('./a').get_attribute('href')
    except:
        print("获取视频链接出错！！！")
        exit()

def download_parsing():
    global route, piece, piecewise
    errow_url = list(video_url.keys())
    while errow_url:
        for name in errow_url:
            browser.get(video_url[name])
            browser.find_element_by_link_text(name).click()
            browser.implicitly_wait(5)
            time.sleep(4)
            try:
                piece = browser.find_element_by_xpath('/html/body/div[3]/div[1]/div[1]/span[1]').text
                piecewise = browser.find_elements_by_xpath('//span[@class="current_item_parts"]/button')
            except Exception as e:
                print("Error" + ': ' + str(type(e)) + str(e))
                print('该视频无分段！！！')
            try:
                if '请自行切换分段' not in piece:
                    route = browser.find_element_by_xpath('//*[@id="play"]/div[2]/div[1]/select/option').text
                    html = browser.execute_script("return document.documentElement.outerHTML")
                    URL = unquote(BeautifulSoup(html, 'html.parser').find('iframe').attrs['src'].split('=', 1)[-1])
                    if 'A' in route:
                        episodes_url[name] = URL.replace('&t=mp4', '')
                    else:
                        episodes_url[name] = URL
                else:
                    for pie in piecewise:  # 分段视频
                        try:
                            pie.click()
                        except Exception as e:
                            print(name + ": Error 001" + ': ' + str(type(e)) + str(e))
                        route = browser.find_element_by_xpath('//*[@id="play"]/div[2]/div[1]/select/option').text
                        html = browser.execute_script("return document.documentElement.outerHTML")
                        URL = unquote(BeautifulSoup(html, 'html.parser').find('iframe').attrs['src'].split('=', 1)[-1])
                        if 'A' in route:
                            episodes_urls.setdefault(name, []).append(URL.replace('&t=mp4', ''))
                        else:
                            episodes_urls.setdefault(name, []).append(URL)
                        time.sleep(1)
                errow_url.remove(name)
            except Exception as e:
                print("Error" + ': ' + str(type(e)) + str(e))
                print('获取{}的视频下载链接失败！！！'.format(name))

def video_download():
    global rel_path
    proxies = {'HTTP': random.choice(proxy)}
    if episodes_url:   # 下载没有分段的视频
        for name in tqdm(episodes_url, desc='正在下载: '):
            r = requests.get(episodes_url[name], proxies=proxies)
            with open(rel_path + '/' + name + '.mp4', 'wb') as f:
                f.write(r.content)
    if episodes_urls:  # 下载含有分段的视频
        for name in tqdm(episodes_urls, desc='正在下载: '):
            for epi_url in episodes_urls[name]:
                if os.path.exists(rel_path + '/' + name + '.mp4'):
                    r = requests.get(epi_url, proxies=proxies)
                    with open(rel_path + '/' + name + '1.mp4', 'wb') as f:
                        f.write(r.content)
                else:
                    r = requests.get(epi_url, proxies=proxies)
                    with open(rel_path + '/' + name + '.mp4', 'wb') as f:
                        f.write(r.content)

def user_ui():
    try:
        print('#' * 25 + "\tAGE动漫搜索下载\t" + '#' * 25)
        browser.get('http://agefans.org/')
        keyword = '某科学' # input('请输入搜索的关键字：')
        search_get(keyword + '\n')
        print_info(browser)
        choise = int(input('请输入序号选择：'))
        name = list(vi_url.keys())[choise - 1]
        video_urls(vi_url[name])
        download_parsing()
    except:
        print("未知错误！！！")
    finally:
        time.sleep(5)
        browser.close()

if __name__ == '__main__':
    user_ui()
    video_download()
```

## 结果及下载情况

![age-selenium](\img\age-selenium9.png)

---
