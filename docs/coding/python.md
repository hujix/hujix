# Python

## Redis 操作封装

## 同步方式

```python
from typing import Optional

from redis import ConnectionPool, Redis

class RedisClient:
    pool: Optional[ConnectionPool] = None

    def __init__(self, host: str = "localhost", password: str = "foobared", port: int = 6379, db: int = 0, timeout: int = 1):
        if RedisClient.pool is None:
            RedisClient.pool = ConnectionPool(host=host, port=port, db=db, password=password,
                                              decode_responses=True, encoding="utf-8")
        self.client: Optional[Redis] = None
        self._timeout = timeout

    def connect(self):
        self.client: Redis = Redis(connection_pool=RedisClient.pool, socket_timeout=self._timeout,
                                   socket_connect_timeout=self._timeout)

    def disconnect(self):
        if self.client is not None:
            self.client.close()

    def __enter__(self):
        self.connect()
        return self.client

    def __exit__(self, exc_type, exc, tb):
        self.disconnect()
```

**示例**：

```python
with RedisClient() as redis_client:
    redis_client.set("key", "value")
    value = redis_client.get("key")

```

## async/await （asyncio）

```python
from typing import Optional

from redis.asyncio import ConnectionPool, Redis

class RedisClient:
    pool: Optional[ConnectionPool] = None

    def __init__(self, host: str, password: str, port: int = 6379, db: int = 0, timeout: int = 1):
        if RedisClient.pool is None:
            RedisClient.pool = ConnectionPool(host=host, port=port, db=db, password=password,
                                              decode_responses=True, encoding="utf-8")
        self.client: Optional[Redis] = None
        self._timeout = timeout

    def connect(self):
        self.client: Redis = Redis(connection_pool=RedisClient.pool, socket_timeout=self._timeout,
                                   socket_connect_timeout=self._timeout)

    async def disconnect(self):
        if self.client is not None:
            await self.client.aclose()

    async def __aenter__(self):
        self.connect()
        return self.client

    async def __aexit__(self, exc_type, exc, tb):
        await self.disconnect()
```

**示例**：

```python
async with RedisClient() as redis_client:
    await redis_client.set("key", "value")
    value = await redis_client.get("key")

```

## 并发获取请求url获取html(get)

```python
"""
安装环境：
pip install --upgrade async-timeout orjson playwright pydantic redis

安装依赖：
playwright install-deps && playwright install chromium

"""
import asyncio
import json
import os.path
import random
import socket
from abc import abstractmethod, ABC
from asyncio import Semaphore
from datetime import datetime
from typing import Optional, List
from uuid import uuid4

import aiohttp
import async_timeout
import orjson
from aiohttp import ClientSession
from fake_useragent import UserAgent
from loguru import logger
from playwright.async_api import async_playwright, Request, Route, Playwright, Browser, BrowserContext
from pydantic import BaseModel
from redis.asyncio import ConnectionPool, Redis

class CrawlerResult(BaseModel):
    url: str
    html: str
    reason: Optional[str] = None

class BaseCrawler(ABC):
    @abstractmethod
    async def crawl(self, urls: List[str]) -> CrawlerResult:
        """
        爬取网页内容
        """
        raise NotImplementedError

    @abstractmethod
    async def initialize(self) -> None:
        """
        爬取网页内容
        """
        raise NotImplementedError

    @abstractmethod
    async def close(self) -> None:
        """
        关闭资源
        """
        raise NotImplementedError

class RequestCrawler(BaseCrawler):
    def __init__(self, timeout: int = 5, concurrent: int = 10):
        super().__init__()
        self._base_header = {
            "Accept": "*/*",
            # "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "Cache-Control": "no-cache",
        }
        self.session: Optional[ClientSession] = None
        self.semaphore = Semaphore(concurrent)
        self._timeout = timeout

    async def close(self) -> None:
        if self.session is not None:
            await self.session.close()
        self.session = None

    async def initialize(self) -> None:
        if self.session is not None:
            return None
        connector = aiohttp.TCPConnector(ssl=False)
        client_timeout = aiohttp.ClientTimeout(total=self._timeout)
        self.session = aiohttp.ClientSession(timeout=client_timeout, connector=connector)

    async def _create_header(self, url: str) -> dict:
        current_header = self._base_header.copy()
        current_header.update({
            # "Host": host,
            # "Referer": homepage,
            "User-Agent": UserAgent().random
        })
        return current_header

    async def _fetch(self, url: str) -> CrawlerResult:
        async with self.semaphore:
            async with self.session.get(url, headers=await self._create_header(url)) as response:
                if response.status not in [200, 301, 302, 307, 401, 403]:
                    response.raise_for_status()
                html = await response.text()

                return CrawlerResult(
                    url=url,
                    html=html,
                    reason=""
                )

    async def crawl(self, urls: List[str]) -> List[CrawlerResult]:
        pass

class PlaywrightCrawler(BaseCrawler):
    def __init__(self, page_count: int = 3, timeout: int = 5, headless: bool = True) -> None:
        super().__init__()

        self.browser: Optional[Browser] = None
        self.browser_ctx: Optional[BrowserContext] = None
        self.semaphore = Semaphore(page_count)
        self.playwright: Optional[Playwright] = None

        self.timeout = timeout * 1000
        self.headless = headless

    async def close(self) -> None:
        if self.browser_ctx is not None:
            await self.browser_ctx.close()
            self.browser_ctx = None

        if self.browser is not None:
            await self.browser.close()
            self.browser = None

        if self.playwright is not None:
            await self.playwright.stop()
            self.playwright = None

    async def initialize(self) -> None:
        if self.playwright is None:
            self.playwright = await async_playwright().start()

        if self.browser is None:
            self.browser = await self.playwright.chromium.launch(headless=self.headless)

        if self.browser_ctx is None:
            self.browser_ctx = await self.browser.new_context(ignore_https_errors=True, bypass_csp=True)

    async def restart(self):
        if random.random() < 0.05:
            logger.warning("Restarting browser...")
            await self.close()
            await self.initialize()
            logger.info("Restarted browser success!")

    async def _fetch(self, url: str) -> CrawlerResult:
        async with self.semaphore:
            page = await self.browser_ctx.new_page()
            try:
                async with async_timeout.timeout(self.timeout / 1000):
                    # 开启请求拦截
                    await page.route("**/*",
                                     lambda route, request: asyncio.create_task(self._intercept(route, request)))
                    await page.goto(url, timeout=self.timeout, wait_until="domcontentloaded")

                    html = await page.content()
                    return CrawlerResult(url=url, html=html.strip())
            except asyncio.TimeoutError as e:
                logger.error(f"Crawl timeout : {url}")
                return CrawlerResult(url=url, html="", reason="timeout")
            except Exception as e:
                logger.error(f"Crawl error : {e}")
                return CrawlerResult(url=url, html="", reason=f"error:{e}")
            finally:
                await page.close()

    async def crawl(self, urls: List[str]) -> List[CrawlerResult]:
        await self.restart()
        tasks = [self._fetch(url) for url in urls]
        return list(await asyncio.gather(*tasks))

    @classmethod
    async def _intercept(cls, route: Route, request: Request):
        # 获取请求的资源类型
        resource_type = request.resource_type

        # 允许加载页面和 JavaScript
        if resource_type in ["stylesheet", "image", "media", "font", "manifest"]:
            await route.abort()
        else:
            await route.continue_()

async def main(base_folder: str):
    current_hash = str(uuid4()).split('-')[-1]

    browser = PlaywrightCrawler(timeout=10, page_count=5, headless=True)
    await browser.initialize()
    logger.info("Browser init success!")
    result_fw = open(os.path.join(base_folder, f"data-{address}-{current_hash}.jsonl"), "a", encoding="utf-8")

    async with RedisClient() as redis_client:
        logger.info("Started listen task from redis...")
        while True:
            try:
                channel, value = await redis_client.blpop(["retry"], timeout=0)

                urls = orjson.loads(value)
                logger.info(f"New task: {channel} : {len(urls)}")
                results = await browser.crawl(urls)
                result_fw.writelines([result.model_dump_json() + "\n" for result in results])
                result_fw.flush()
            except Exception as e:
                logger.error(f"Crawl error : {e}")
                import traceback
                traceback.print_exc()
    result_fw.close()

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())

```
