---
title: 快速上手
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

# 安装

:::info{title="前提条件"}

- 熟悉命令行
- 已安装 18.0 或更高版本的 Node.js

:::

## 通过包管理器

```bash [NPM]
# 使用 npm
$ npm install @antv/xflow --save

#  使用yarn
$ yarn add @antv/xflow

# 使用pnpm
$ pnpm add @antv/xflow
```

## 通过 CDN

你可以借助 script 标签直接通过 CDN 来使用 XFlow：

```html
<script src="https://unpkg.com/@antv/xflow/dist/index.umd.js"></script>
```

这里我们使用了 [unpkg](https://unpkg.com/@antv/xflow/dist/index.umd.js)，但你也可以使用任何提供 npm 包服务的 CDN，例如 [jsdelivr](https://cdn.jsdelivr.net/npm/@antv/xflow/dist/index.umd.js)。当然你也可以下载此文件并自行提供服务。

对于生产环境, 我们推荐使用一个明确的版本号, 以避免新版本升级造成不可预期的破坏, 例如：

- <https://unpkg.com/@antv/xflow@1.0.0/dist/index.umd.js>

- <https://cdn.jsdelivr.net/npm/@antv/xflow@1.0.0/dist/index.umd.js>

# 基础使用

接下来我们就一起使用 XFlow 来构建一个简单的图形应用，来体验一下 XFlow 的魅力吧。

<code id="xflow-guide" src="@/src/xflow/guide/index.tsx"></code>