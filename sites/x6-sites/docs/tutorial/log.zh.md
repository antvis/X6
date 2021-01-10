---
title: 更新日志
order: 9
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
---

## 1.11.0

* ✨ 平滑路由增加方向配置 ([deec3bc](https://github.com/antvis/x6/commit/deec3bc805c5af1d2d0fc81a25c0819a6072f99e))
* 🐛 解决 `windows` 下页面第一次未聚焦情况下点击事件失效问题 ([2cb270e](https://github.com/antvis/x6/commit/2cb270e189361670b2479b4a9c9694b953bdb8ab))

## 1.10.2

* 🐛`model.startBatch` 方法之前触发 `batch:start` 事件 ([429f4e8](https://github.com/antvis/x6/commit/429f4e8b6a394dd10412fce4775af22af583cadc))

## 1.10.1

* 🐛 在 `cell:changed` 之后修改选择框大小，解决 `size` 方法执行后选择框大小不变问题 ([#517](https://github.com/antvis/x6/issues/517)) ([c8234d5](https://github.com/antvis/x6/commit/c8234d5df1c7cb7910a93d5d7314c01c7b4023b0))

## 1.10.0

* 🐛 `Node.define(...)` 支持 `overwrite` 配置 ([f47fe4c](https://github.com/antvis/x6/commit/f47fe4cdef2da7ac6bb188c3ae131dffc2192cdb))
* 🐛 支持多个 `knobs` ([9fe76b9](https://github.com/antvis/x6/commit/9fe76b9c82c7e6040a4dcca00c417183a6fcb130))
* ✨ 添加 `arcTo`, `quadTo`, `drawPoints` 方法 ([00e8fd0](https://github.com/antvis/x6/commit/00e8fd0ec06e442833dd3f6c7ce7c05aabc5b556))
* ✨ 为 `knobs` 添加 `position` 钩子 ([3e2f315](https://github.com/antvis/x6/commit/3e2f3154a7635f1b94176d05e6780d4b79761037))
* ✨ 为 `geometry` 增加 `rotate` 方法 ([90a5603](https://github.com/antvis/x6/commit/90a56037b16adff6fc3fbf50660eb95d3bd6bd2d))

## 1.9.3

* 🐛 `konb` 和 `transform` 的控制旋钮,在交互时只显示正在交互的旋钮 ([73bb1e1](https://github.com/antvis/x6/commit/73bb1e16e329853ae5a47c0a3725000a65efd6a3))
* 🐛 `node` 改变时需要清除 `knob` ([bf83cd8](https://github.com/antvis/x6/commit/bf83cd8760e89358846e216bc2a41c305f8a17fb))

## 1.9.2

* 🐛 `mousemove` 之后再触发 `node:resize` 和 `node:rotate` 事件 ([#505](https://github.com/antvis/x6/issues/505)) ([4156e57](https://github.com/antvis/x6/commit/4156e5712ec1940041e7b22863361a6e6ee820aa))

## 1.9.1

* 🐛 事件队列在事件回调用被修改,应该先缓存起来 ([d29ea43](https://github.com/antvis/x6/commit/d29ea43ea6e2b24a0caa2e861849bc01f6b4ce79))

## 1.9.0

* 🐛 需要在在画布容器中渲染 `html` 工具 ([ebb43a9](https://github.com/antvis/x6/commit/ebb43a9501be68196266db2ffab2cbde54b7bdb4))
* ✨ 增加 `clientToGraph` 方法 ([1d55c62](https://github.com/antvis/x6/commit/1d55c62507d112d4a1f52e3ea6c4768017956fa0))
* ✨ 支持调节手柄,如圆柱,通过调节手柄修改圆柱椭圆面的大小 ([6ae70b8](https://github.com/antvis/x6/commit/6ae70b809e85db4d537e9104830eef1328c16f7a))

## 1.8.0

* ✨ 支持 `html` 工具 ([97624f4](https://github.com/antvis/x6/commit/97624f4a9dfaacc551acd89c5557a2b301fe2d5e))

## 1.7.12

* 🐛 解决 `toPNG` 下载图片不完整问题 ([6dc50e9](https://github.com/antvis/x6/commit/6dc50e91d94fae0da2bc35a056e6410cb94d07be))

## 1.7.11

* 🐛 自动计算 `ER` 路由的方向 ([9b9a727](https://github.com/antvis/x6/commit/9b9a727c9b168af80623be448d5ae389a21a72b0))

## 1.7.9

* 🐛 修正节点和边的类型定义([d2742a4](https://github.com/antvis/x6/commit/d2742a4a8a473e60bc47fe099fd49c27e0c2d9ae)), closes [#478](https://github.com/antvis/x6/issues/478)

## 1.7.8

* 🐛 默认关闭代码追踪([bdb0db2](https://github.com/antvis/x6/commit/bdb0db2da8708d626ebd09b46da7d431102b79bf))

## 1.7.7

* 🐛 解决 `html` 节点 `html` 属性设置为 dom 对象时不显示问题([afb4f0b](https://github.com/antvis/x6/commit/afb4f0b12bc28e353e5f2e4c41822cb0b77c6f8d))
* 🐛 `interacting` 配置中每一个交互规则支持函数判断([2222ab6](https://github.com/antvis/x6/commit/2222ab683abea60e7208832e8ef856ce132c8cf0))

## 1.7.6

* 🐛 解决在 `scroller` 模式下 `drawBackground` 导致背景消失问题([521f99a](https://github.com/antvis/x6/commit/521f99a2942ec42284fefaf63fba3ddf77a7da3a)), closes [#466](https://github.com/antvis/x6/issues/466)
* 🐛 恢复 `minmap` 的样式([6de2ac8](https://github.com/antvis/x6/commit/6de2ac895475eda529f72a8ae774ce42a1226655))

## 1.7.4

* 🐛 `html` 节点支持自定义重新渲染方法([0020c78](https://github.com/antvis/x6/commit/0020c781c3bb4b4747220fe327ade7e926d52014))

## 1.7.1

* 🐛 解决样式被覆盖问题([95c1329](https://github.com/antvis/x6/commit/95c132900b8881e12b73b9c7d5ab742c0154d472))
* 🐛 修正 `shadow-edge` 的箭头([7acd9f2](https://github.com/antvis/x6/commit/7acd9f2897747a45dd442975bc326e71740eb09e))

## 1.7.0

* ✨ 支持 `xml` 格式 `markup`([f16e7eb](https://github.com/antvis/x6/commit/f16e7eb38ca1f0dec71f51cd41b74341fc1a0f3d))
* 🐛 text标签支持一些特殊属性([e1f9abf](https://github.com/antvis/x6/commit/e1f9abfffcdd723815311ebc58ef17761ad2a063))

## 1.6.4

* ⚡️ `rectangle` 中增加 `bounds` 属性([c4480af](https://github.com/antvis/x6/commit/c4480af4e45b9a90746f3aefa14a4d7332b08d6a))

## 1.6.3

* 🐛 `ForeignObject` 的默认背景设置为透明([a386f94](https://github.com/antvis/x6/commit/a386f940eb18e718998b150d432242d8cfea5f8b))
* 🐛 只添加 `SVG tool` 到 `ToolsView`, `HTML tools` 需要手动处理([5c7b7d6](https://github.com/antvis/x6/commit/5c7b7d646c90e20a28f273d268d83a16246bb9f2))

## 1.6.2

* 🐛 修正开始箭头和结束箭头的位置([d637cf6](https://github.com/antvis/x6/commit/d637cf649e0b149acdf9dee12e6561e3b4f76b17))
* 🐛 更新 `cell` 的时候需要删除 `tool` ([fac7e7a](https://github.com/antvis/x6/commit/fac7e7a4c853d75ea0ae37fcd7089bf20e56654b))
* 🐛 拖动边的时候更新箭头([c9e7b5f](https://github.com/antvis/x6/commit/c9e7b5ffeb52e2fd609283d5f72b0d43ad368561))

## 1.6.0

* ✨ 增加 `allowBlank`、`allowMulti`、`allowLoop`、`allowNode`、`allowEdge`、`allowPort` 六个连线规则([68f7965](https://github.com/antvis/x6/commit/68f7965699b36d6a46f25e6aba5d144fb086c9a0))

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