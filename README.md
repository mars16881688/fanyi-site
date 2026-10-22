# 随译（原 Fanyi）介绍页

纯静态页面（`index.html` + `styles.css` + `main.js`），无构建步骤、无外部依赖、无统计脚本。GitHub Pages 从默认分支根目录发布，`.nojekyll` 需保留。

## 本地预览

```sh
python3 -m http.server 8000
```

打开 `http://localhost:8000`。

- 三种语言：`index.html`（中文）、`en/index.html`、`ja/index.html`，共用 `styles.css` 和 `main.js`，用 hreflang 互相标注。
- 首次访问根目录时，非中文浏览器按语言跳到 `en/` 或 `ja/`；点过导航里的语言切换后，记住选择（localStorage），不再跳转。
- 下载按钮固定指向 `releases/latest/download/Suiyi.zip`，安装包作为本仓库 GitHub Release 的附件发布。
- `latest.json`：App 菜单「检查更新…」读取的版本信息，发布新版时更新其中的 `version`、`url`、`notes`。
- 首屏演示的文案由页面 `#demo` 上的 `data-*` 属性提供，三种语言共用同一段脚本。
- 浅色 / 深色跟随系统 `prefers-color-scheme`。
- 首屏示意动画可暂停；开启系统「减少动态效果」后直接显示最终状态。
