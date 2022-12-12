---
title: 简介
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
---

X6 是基于 HTML 和 SVG 的图编辑引擎，提供低成本的定制能力和开箱即用的内置扩展，方便我们快速搭建 DAG 图、ER 图、流程图、血缘图等应用。

如果你还没有使用过 X6， 建议通过 [快速上手](/zh/docs/tutorial/getting-started) 抢先体验 X6 的魅力。

<p align="left">
<a href="https://github.com/antvis/X6/actions/workflows/ci.yml"><img alt="build" src="https://img.shields.io/github/workflow/status/antvis/x6/%F0%9F%91%B7%E3%80%80CI/master?logo=github&style=flat-square"></a>
<a href="https://app.codecov.io/gh/antvis/X6"><img alt="coverage" src="https://img.shields.io/codecov/c/gh/antvis/x6?logo=codecov&style=flat-square&token=15CO54WYUV"></a>
<a href="https://lgtm.com/projects/g/antvis/x6/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/antvis/x6.svg?logo=lgtm&style=flat-square"></a>
<a href="https://www.npmjs.com/package/@antv/x6"><img alt="NPM Package" src="https://img.shields.io/npm/v/@antv/x6.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/@antv/x6"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@antv/x6?logo=npm&style=flat-square"></a>
</p>

<p align="left">
<a href="/LICENSE"><img src="https://img.shields.io/github/license/antvis/x6?style=flat-square" alt="MIT License"></a>
<a href="https://www.typescriptlang.org"><img alt="Language" src="https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square"></a>
<a href="https://github.com/antvis/x6/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square"></a>
<a href="https://x6.antv.antgroup.com"><img alt="website" src="https://img.shields.io/static/v1?label=&labelColor=505050&message=website&color=0076D6&style=flat-square&logo=google-chrome&logoColor=0076D6"></a>
</p>

## ✨ 特性

- 🌱 　极易定制：支持使用 SVG/HTML/React/Vue 定制节点样式和交互；
- 🚀 　开箱即用：内置 10+ 图编辑配套扩展，如框选、对齐线、小地图等；
- 🧲 　数据驱动：基于 MVC 架构，用户更加专注于数据逻辑和业务逻辑；
- 💯 　事件驱动：可以监听图表内发生的任何事件。

## 🍉 使用文档

- [快速上手](/zh/docs/tutorial/getting-started)
- [基础](/zh/docs/tutorial/basic/graph)
- [进阶](/zh/docs/tutorial/intermediate/connection-point)
- [插件](/zh/docs/tutorial/plugins/transform)
- [API](/zh/docs/api/graph/graph)

## ❤️ 如何交流

如果您有任何的问题、建议、反馈或者交流意愿，可以通过如下方式联系我们：

- 官方推荐: [GitHub issues](https://github.com/antvis/X6/issues/new/choose)
- 邮件：[antv@antfin.com](mailto:antv@antfin.com)
- 语雀专栏：[https://www.yuque.com/antv/blog](https://www.yuque.com/antv/blog)

<img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*nFa5TaWsSOoAAAAAAAAAAAAAARQnAQ" alt="X6 图可视化交流群4" width="375" />

## 🤝 参与贡献

### Bugs

如果您在使用的过程中碰到问题，可以先通过 [issues](https://github.com/antvis/x6/issues) 看看有没有类似的 bug 或者建议。在你报告一个 bug 之前，请先确保已经搜索过已有的 issue 和阅读了我们的[常见问题](https://www.yuque.com/antv/x6/tox1ukbz5cw57qfy)。

### 行为准则

我们有一份[行为准则](https://github.com/antvis/X6/blob/master/CONTRIBUTING.zh-CN.md)，希望所有的贡献者都能遵守，请花时间阅读一遍全文以确保你能明白哪些是可以做的，哪些是不可以做的。

### 加入社区

还可以参考下面的贡献指南，一步一步成为 X6 的贡献者吧：

- [如何参与到 X6 开源开发](https://www.yuque.com/antv/x6/gcinvi)
- [如何优雅地在 github 上贡献代码](https://segmentfault.com/a/1190000000736629?u_atoken=b71f69b7-7d74-4e6c-a373-76e0a36e2c87&u_asession=01aGvG2P10Vrjamv5BFM7yX0X2_OcJ_XmHlitgQC_BVnNLlRLdwpnHYH8ma1b1UKRaX0KNBwm7Lovlpxjd_P_q4JsKWYrT3W_NKPr8w6oU7K93NVUbout2zcDySUWFprtJUe3R9QHfzEvknA4dzJmVTGBkFo3NEHBv0PZUm6pbxQU&u_asig=05FBplinh079EhmRTHTDgrLXp5aawipV_A-9VAsAs841tY8QeTTaaTvFKcH6odRhI4VX2pBdH5ae6FY2MiL2X_4yTqZp2jK-_nBOl2nesFZDM2RmF5JkBT_JWpU60Z6lY1hzgqVxFxj_uE1HnffLBmwa5Sl9NkdZ4_S8RH_A-AooP9JS7q8ZD7Xtz2Ly-b0kmuyAKRFSVJkkdwVUnyHAIJzZMNY1otqX6vcbPyd-A-Ld3WE-pEMt_G6ZtWjng8eWoZH_8T8uYGNepqxdb-gLe1IO3h9VXwMyh6PgyDIVSG1W-dzbV77H9pFSh5eWBVfcZZYGYDqHeX90h_yD6KfDquy8GWlAwW_v4wTa3IAdocwA0iaDksczFnALAG-4HaicdUmWspDxyAEEo4kbsryBKb9Q&u_aref=SU72jL%2FvYl46xrVouxNG%2FiEj5e0%3D)

<a href="https://github.com/antvis/x6/graphs/contributors">
  <img src="https://raw.githubusercontent.com/antvis/X6/master/CONTRIBUTORS.svg" alt="Contributors" />
</a>
