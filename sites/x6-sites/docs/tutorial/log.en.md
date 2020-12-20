---
title: 更新日志
order: 9
redirect_from:
  - /en/docs
  - /en/docs/tutorial
---

## 1.5.2

* 🐛 校正箭头位置([b21cac6](https://github.com/antvis/x6/commit/b21cac6968a548cad17c185a4219f24d135eaa8a))

## 1.5.1

* 🐛 修复 dnd: 拖拽节点到画布，进行异步验证时，应该停止拖拽，并优化拖拽 DEMO，支持异步验证时 loading 效果([d418e07](https://github.com/antvis/x6/commit/d418e07ef404881400faf03943c8c9ff067e4598)) ([#429](https://github.com/antvis/x6/issues/429))

## 1.5.0

* 🐛 调用 `sendToken` 方法时，返回停止动画的方法([21276b2](https://github.com/antvis/x6/commit/21276b2a0f396b8e8343f133fed9383142468f5d))，[文档](https://x6.antv.vision/zh/docs/tutorial/advanced/animation#%E5%BC%80%E5%A7%8B)
* ✨ 添加 `animate` 和 `animateTransform` 方法([b2ebf69](https://github.com/antvis/x6/commit/b2ebf69f2c311b1b8056179005d8fafd0a7eb8e9))，[文档](https://x6.antv.vision/zh/docs/api/view/cellview#animate)
* ⚡️ `transition` 方法添加一系列生命周期方法和事件([462abd0](https://github.com/antvis/x6/commit/462abd0aa06e28bbbabf96ffd0493af4a9af6e1a))（[#419](https://github.com/antvis/x6/issues/419) [#420](https://github.com/antvis/x6/issues/420)），[文档](https://x6.antv.vision/zh/docs/api/model/cell#%E5%8A%A8%E7%94%BB-transition)

## 1.4.0

* ✨ 增加循环连线 ([bfa3c67](https://github.com/antvis/x6/commit/bfa3c6743b42c22d64edfbf79f82913129a5a285))，[demo](https://github.com/antvis/X6/blob/master/examples/x6-example-features/src/pages/edge/loop.tsx)

## 1.3.20

* 🐛 解决图片节点上设置宽高无效问题([15fd567](https://github.com/antvis/x6/commit/15fd5673e13825a94bd05ffb4f892645ee20e887)) ([#397](https://github.com/antvis/x6/issues/397))

## 1.3.14
* 🐛 删除空格修饰键 ([a7258cd](https://github.com/antvis/x6/commit/a7258cd2db48ab63b6925101b8f98b38caa04929))

## 更早

更早的日志可以去 [Github](https://github.com/antvis/X6/blob/master/packages/x6/CHANGELOG.md) 查看