# Termius

1. 安装`asar`

```powershell
npm install -g asar
```

2. 打开`app.asar`文件

```powershell
asar e app.asar app
# 留个备份，或者直接rm
mv app.asar app.asar.bak
# 防止自动更新
rm app-update.yml
```

3. 修改脚本

打开`<termius>/Resources/app/js/background-process.js`文件并编辑：

搜索 `await this.api.bulkAccount`，将 `const e=await this.api.bulkAccount();` 修改为 `var e=await this.api.bulkAccount()`;

然后在这个`var e=await this.api.bulkAccount();`语句后面加入

```javascript
e.account.pro_mode = true;
e.account.need_to_update_subscription = false;
e.account.current_period = {
  from: "2022-01-01T00:00:00",
  until: "2099-01-01T00:00:00"
};
e.account.plan_type = "Premium";
e.account.user_type = "Premium";
e.student = null;
e.trial = null;
e.account.authorized_features.show_trial_section = false;
e.account.authorized_features.show_subscription_section = true;
e.account.authorized_features.show_github_account_section = false;
e.account.expired_screen_type = null;
e.personal_subscription = {
  now: new Date().toISOString().slice(0, -5),
  status: "SUCCESS",
  platform: "stripe",
  current_period: { from: "2022-01-01T00:00:00", until: "2099-01-01T00:00:00" },
  revokable: true,
  refunded: false,
  cancelable: true,
  reactivatable: false,
  currency: "usd",
  created_at: "2022-01-01T00:00:00",
  updated_at: new Date().toISOString().slice(0, -5),
  valid_until: "2099-01-01T00:00:00",
  auto_renew: true,
  price: 12.0,
  verbose_plan_name: "Termius Pro Monthly",
  plan_type: "SINGLE",
  is_expired: false
};
e.access_objects = [
  {
    period: { start: "2022-01-01T00:00:00", end: "2099-01-01T00:00:00" },
    title: "Pro"
  }
];
```
