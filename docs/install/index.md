---
layout: doc
---

# 软件安装

## WSL2 安装 Ubuntu-22.04

1. 安装适用于Linux的Windows子系统

```powershell
wsl --update
# 设置wsl默认版本
wsl --set-default-version 2
# 列出所有可用的版本
wsl --list --online
# 安装指定的版本
wsl --install Ubuntu-22.04
# 默认root账户登录后，修改root账户密码(输入两次)
passwd root
```

2. 移动系统文件到其他盘

```powershell
# 关闭wsl
wsl --shutdown
# 导出到指定的备份文件
wsl --export Ubuntu-22.04 D:\Ubuntu.tar
# 注销原有的系统
wsl --unregister Ubuntu-22.04
# 重新注册（之后删掉Ubuntu.tar）
wsl --import Ubuntu-22.04 D:\Ubuntu-22.04 D:\Ubuntu.tar
```

3. 设置默认的用户

Ububtu-2204 -> Ubuntu2204 其他同理

```powershell
Ubuntu2204 config --default-user <username>
```

4. 限制wsl2暂用过多内存

在用户目录打开CMD ， 输入`code .wslconfig` （vscode的命令，手动创建可能会失效）

```text
[wsl2]
processors=3
memory=4GB
swap=3GB
```

5. 修改wsl2的默认网段

````powershell
# 修改wsl2的默认网段
netsh interface ipv4 set address "vEthernet (WSL)" static 192.168.1.1 255.255.255.0 192.168.1.1
# 修改wsl2的默认网关

修改完成之后需要重启wsl2才能生效

5. 定期释放cache内存

Linux内核中有一个参数`/proc/sys/vm/drop_caches`，是可以用来手动释放Linux中的cache缓存，如果发现wsl2的cache过大影响到宿主机正常运行了，可以手动执行以下命令来释放cache：

```text
echo 3 > /proc/sys/vm/drop_caches
````

当然也可以设置成定时任务，每隔一段时间释放一次。

---

## Ubuntu 安装 Docker

1. Docker官网安装教程：[Install using the apt repository](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)

```shell
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

---

# Docker 容器安装

## Portainer

```shell
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer-ee:latest
```

## MySQL

```shell
docker run -itd -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=root mysql:latest
```

## Redis

```shell
docker run -itd -p 6379:6379 --name redis redis:latest --requirepass root
```

## zookeeper

```shell
docker run -itd --name zookeeper -p 2181:2181 zookeeper
```

## kafka

```shell
docker run  -d --name kafka -p 9092:9092 -e KAFKA_BROKER_ID=0 -e KAFKA_ZOOKEEPER_CONNECT=[zookeeper的IP地址]:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://[宿主机的IP地址]:9092 -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 -t wurstmeister/kafka
```
