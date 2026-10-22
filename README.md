# Ferry 渡（原 Fanyi）介绍页

纯静态页面（`index.html` + `styles.css` + `main.js`），无构建步骤、无外部依赖、无统计脚本。GitHub Pages 从默认分支根目录发布，`.nojekyll` 需保留。

## 本地预览

```sh
python3 -m http.server 8000
```

打开 `http://localhost:8000`。

- 浅色 / 深色跟随系统 `prefers-color-scheme`。
- 首屏示意动画可暂停；开启系统「减少动态效果」后直接显示最终状态。
