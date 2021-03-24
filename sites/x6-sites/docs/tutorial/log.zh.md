---
title: 更新日志
order: 10
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
---

## 1.18.x

- 1.18.0
  - 修复画布坐标错乱问题 ([319f30f](https://github.com/antvis/x6/commit/319f30f5e68587623d85a2759142feaf37ac46fc))

## 1.17.x

- 1.17.7
  * 🐛 解决 `eslint` 报错 ([06ba121](https://github.com/antvis/x6/commit/06ba121e3b937c5aeebbbe2b24e6db67fc141cb9))
  * 🐛 解决测试用例运行失败问题 ([f7ae6b1](https://github.com/antvis/x6/commit/f7ae6b1f6b961a01c58d8827a9aaa2d5a984a6e0))

- 1.17.6
  - 🐛 解决 `model:updated model:reseted model:sort` 触发两次问题 ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))

- 1.17.5
  - 🐛 增加 `unembed` 的限制条件 ([2f797fd](https://github.com/antvis/x6/commit/2f797fd13754e3068f321800d1973a0ad3612d4d))

- 1.17.4
  - 🐛 解决 `async` 模式下开启小地图页面无响应问题 ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))

- 1.17.3
  - 🐛 解决添加工具失效问题 ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))

- 1.17.2
  - 🐛 解决 `removeTool` 后工具不刷新问题 ([9d15243](https://github.com/antvis/x6/commit/9d152433ee4050bf2311c140d74dd805cae519ba))

- 1.17.1
  - 🐛 增加 `ToJSONData` 类型 ([f5ffbe2](https://github.com/antvis/x6/commit/f5ffbe2ffa50cb9585ee241aa1f37d5c069e97e5))


- 1.17.0
  - 🐛 画布销毁后保证清除全部 css 资源 ([81fa537](https://github.com/antvis/x6/commit/81fa537282ce5cd65c2fb585b8a7649087490313))
  - ✨ 支持开启和关闭 `autoResize` 配置 ([dd6681b](https://github.com/antvis/x6/commit/dd6681b53739bf48fa0a97166e16ada4a2c16896))

## 1.16.x

- 1.16.0
  - ✨ `node-anchor midSide` 上增加 `direction` 配置 ([b235c11](https://github.com/antvis/x6/commit/b235c1106b4041f257d4f0db5f30198e5c41c90d))

## 1.15.x

- 1.15.0
  - ✨ `resizing` 中增加 `allowReverse` 配置 ([a597a75](https://github.com/antvis/x6/commit/a597a759c0a0b83f53e99e530d1970f46faf3dd2))

## 1.14.x

- 1.14.0
  - ✨ `Dnd` 中增加 `containerParent` 配置 ([58fb4fd](https://github.com/antvis/x6/commit/58fb4fdd6a51c672e5a473773874081fe548fe0a))

## 1.13.x

- 1.13.4
  - 🐛 解决同时开启 `scroller` 和 `autoResize` 后画布一直缩小问题 ([faf3e4f](https://github.com/antvis/x6/commit/faf3e4f0b015650b04f33d7ad914c116962f317e))

- 1.13.3
  - 🐛 解决滚轮滚动多次后位置不正确问题 ([1077a31](https://github.com/antvis/x6/commit/1077a3196219ecadbf1ecffac31d843d542f91fb))

- 1.13.2
  - 🐛 增加 `special` 事件的兼容性判断 ([2732b12](https://github.com/antvis/x6/commit/2732b12b4fe9cf7e381239333497c10ca2b8e7d0))
  - ⚡️ 缓存容器尺寸，避免多次计算导致性能问题 ([83483e9](https://github.com/antvis/x6/commit/83483e9d2af65ce2397770d35e8a7b799af8972a))

- 1.13.0
  - ✨ `selection` 中增加 `following` 配置 ([#687](https://github.com/antvis/x6/issues/687)) ([5b52433](https://github.com/antvis/x6/commit/5b52433709089280320cc6b13e6442f31c1dcf30))

## 1.12.x

- 1.12.32
  - 🐛 解决无法触发键盘事件问题 ([4ea5f31](https://github.com/antvis/x6/commit/4ea5f3194e80125a68e25e71920526f5b6c86150))

- 1.12.31
  - 🐛 解决拼写错误 ([2f33b99](https://github.com/antvis/x6/commit/2f33b99cae8559d3d98204fe427c1ad18ce94ac0))

- 1.12.30
  - 🐛 在 css 中将 `foreignobject` 修改为 `foreignObject`来兼容 firefox ([#664](https://github.com/antvis/x6/issues/664)) ([2fa99f0](https://github.com/antvis/x6/commit/2fa99f05a8692bef1e9a4c241db399cee258fbb6))

- 1.12.28
  - 🐛 优化自动扩展画布的逻辑 ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)

- 1.12.27
  - 🐛 在撤销重做过程中不会插入新的命令 ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
  * 🐛 使用 `prop` 修改 `parent` 或者 `children` 时，需要修改节点之间引用 ([f258522](https://github.com/antvis/x6/commit/f2585224689f4deb980d14f0e1f1a0c247bdcedc))

- 1.12.26
  - 🐛 Edge 的 `vertices` 支持 `[[100, 100], [20, 20]]` 这种结构数据 ([c7b0f0d](https://github.com/antvis/x6/commit/c7b0f0d811bbceb30365b683f69124ddf9d96008))
  - 🐛 解决边上渐变色问题 ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
  - 🐛 `vertices` 在最低层级渲染 ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
  - 🐛 `selection` 下批量拖动节点触发 `node:move` 的逻辑优化 ([#643](https://github.com/antvis/x6/issues/643)) ([586fc1f](https://github.com/antvis/x6/commit/586fc1f08fff85dcc1c6c8637aef529e8bccb169))

- 1.12.25
  - 删除代码中的打印语句 ([#642](https://github.com/antvis/x6/issues/642)) ([024c01f](https://github.com/antvis/x6/commit/024c01f000545c0c0b50259510fc886b3aa9815b))

- 1.12.23
  - 🐛 解决中英文混排长度计算问题 ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)

- 1.12.22
  - 🐛 `autoResize` 只有在 `flex` 的容器上初始化画布才有效 ([73c1e1d](https://github.com/antvis/x6/commit/73c1e1d869b098bd341ad1c6e969222980067053))

- 1.12.21
  - 🐛 解决关闭 `selection` 的 `movable` 配置也会触发框选节点的 `node:move` 事件 ([f651181](https://github.com/antvis/x6/commit/f65118150178df82ee795f4fc292f5ce91c78b6b))

- 1.12.20
  - 🐛 销毁画布之前清除节点 ([e211c1a](https://github.com/antvis/x6/commit/e211c1a0a1f79588b084a4de326fdd493e839def)), closes [#600](https://github.com/antvis/x6/issues/600)

- 1.12.19
  - 🐛 修复内部的类型定义 ([6b446f8](https://github.com/antvis/x6/commit/6b446f80ba96dbbfbff7257012fc6f6f8aca49fd))

- 1.12.18
  - 🐛 解决边也会触发 `node:move` 事件问题 ([#593](https://github.com/antvis/x6/issues/593)) ([dac555e](https://github.com/antvis/x6/commit/dac555e5cf15fba6a5450ecdb335a2cd9145d339))

- 1.12.17
  - 🐛 执行 `setProp` 之前需要执行 `propHooks` ([0dfc09f](https://github.com/antvis/x6/commit/0dfc09f97ff4281aacb465ad74f1958930d30c8c))

- 1.12.16
  - 🐛 修复 html 节点注册无效问题 ([e0c9e97](https://github.com/antvis/x6/commit/e0c9e970723b8c7bd6a63127edf46be79a72d7c3))

- 1.12.15
  - 🐛 解决 IE11 下报错问题 ([#585](https://github.com/antvis/x6/issues/585)) ([8cb2f48](https://github.com/antvis/x6/commit/8cb2f489d2f913dd9fa80dab5c50e1fffe7f6939))

- 1.12.13
  - 🐛 解决 `registerHtmlComponent` 不支持注册 `render` 对象问题 ([c810821](https://github.com/antvis/x6/commit/c81082169763f4ca5432b44c94996674cd3599b1))

- 1.12.11
  - 🐛 在节点内部的 `input` 上键入 `delete` 或者 `backspace` 时，不会触发键盘事件 ([429ef9a](https://github.com/antvis/x6/commit/429ef9ad45a11a49072d169a0c89146640f7e21a))

- 1.12.10 
  - 🐛 `stencil` 增加 `placeholder` 和 `notFoundText` 两个选项 ([#574](https://github.com/antvis/x6/issues/574)) ([c9100ab](https://github.com/antvis/x6/commit/c9100abb8576eaf55c5a9b0c5496f63c1796af5a)), closes [#555]

- 1.12.9
  - 🐛 解决 `get graph of undefined` 报错问题 ([#573](https://github.com/antvis/x6/issues/573)) ([5aadc87](https://github.com/antvis/x6/commit/5aadc87467e61dbd33d385e94a94bee72e744f84))

- 1.12.4
  - 🐛 根据可交互能力修改节点鼠标悬浮样式 ([#566](https://github.com/antvis/x6/issues/566)) ([6a33149](https://github.com/antvis/x6/commit/6a3314959206c1299eb916c1dc10130d49ee7de8)), closes [#558](https://github.com/antvis/x6/issues/558)

- 1.12.3
  - 🐛 增加 `hasTool` 和 `removeTool` 方法 ([#565](https://github.com/antvis/x6/issues/565)) ([f87dc43](https://github.com/antvis/x6/commit/f87dc43e439bfd13b7afe193db096bacd456bdcd)), closes [#552](https://github.com/antvis/x6/issues/552)

- 1.12.0
  - ✨ 增加 `autoResize` 选项，是否自动根据容器大小自动更新画布大小 ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

## 1.11.x

- 1.11.1
  - 🐛 修改 `double-edge` 和 `shadow-edge` 模式鼠标悬浮样式为手型 ([b7d61b7](https://github.com/antvis/x6/commit/b7d61b75fbc24b36cfc384fdd9c6ed3baf2cf12a))

- 1.11.0
  - ✨ 平滑路由增加方向配置 ([deec3bc](https://github.com/antvis/x6/commit/deec3bc805c5af1d2d0fc81a25c0819a6072f99e))
  - 🐛 解决 `windows` 下页面第一次未聚焦情况下点击事件失效问题 ([2cb270e](https://github.com/antvis/x6/commit/2cb270e189361670b2479b4a9c9694b953bdb8ab))

## 1.10.x

- 1.10.2
  - 🐛`model.startBatch` 方法之前触发 `batch:start` 事件 ([429f4e8](https://github.com/antvis/x6/commit/429f4e8b6a394dd10412fce4775af22af583cadc))

- 1.10.1
  - 🐛 在 `cell:changed` 之后修改选择框大小，解决 `size` 方法执行后选择框大小不变问题 ([#517](https://github.com/antvis/x6/issues/517)) ([c8234d5](https://github.com/antvis/x6/commit/c8234d5df1c7cb7910a93d5d7314c01c7b4023b0))

- 1.10.0
  - 🐛 `Node.define(...)` 支持 `overwrite` 配置 ([f47fe4c](https://github.com/antvis/x6/commit/f47fe4cdef2da7ac6bb188c3ae131dffc2192cdb))
  - 🐛 支持多个 `knobs` ([9fe76b9](https://github.com/antvis/x6/commit/9fe76b9c82c7e6040a4dcca00c417183a6fcb130))
  - ✨ 添加 `arcTo`, `quadTo`, `drawPoints` 方法 ([00e8fd0](https://github.com/antvis/x6/commit/00e8fd0ec06e442833dd3f6c7ce7c05aabc5b556))
  - ✨ 为 `knobs` 添加 `position` 钩子 ([3e2f315](https://github.com/antvis/x6/commit/3e2f3154a7635f1b94176d05e6780d4b79761037))
  - ✨ 为 `geometry` 增加 `rotate` 方法 ([90a5603](https://github.com/antvis/x6/commit/90a56037b16adff6fc3fbf50660eb95d3bd6bd2d))

## 1.9.x

- 1.9.3
  - 🐛 `konb` 和 `transform` 的控制旋钮,在交互时只显示正在交互的旋钮 ([73bb1e1](https://github.com/antvis/x6/commit/73bb1e16e329853ae5a47c0a3725000a65efd6a3))
  - 🐛 `node` 改变时需要清除 `knob` ([bf83cd8](https://github.com/antvis/x6/commit/bf83cd8760e89358846e216bc2a41c305f8a17fb))

- 1.9.2
  - 🐛 `mousemove` 之后再触发 `node:resize` 和 `node:rotate` 事件 ([#505](https://github.com/antvis/x6/issues/505)) ([4156e57](https://github.com/antvis/x6/commit/4156e5712ec1940041e7b22863361a6e6ee820aa))

- 1.9.1
  - 🐛 事件队列在事件回调用被修改,应该先缓存起来 ([d29ea43](https://github.com/antvis/x6/commit/d29ea43ea6e2b24a0caa2e861849bc01f6b4ce79))

- 1.9.0
  - 🐛 需要在在画布容器中渲染 `html` 工具 ([ebb43a9](https://github.com/antvis/x6/commit/ebb43a9501be68196266db2ffab2cbde54b7bdb4))
  - ✨ 增加 `clientToGraph` 方法 ([1d55c62](https://github.com/antvis/x6/commit/1d55c62507d112d4a1f52e3ea6c4768017956fa0))
  - ✨ 支持调节手柄,如圆柱,通过调节手柄修改圆柱椭圆面的大小 ([6ae70b8](https://github.com/antvis/x6/commit/6ae70b809e85db4d537e9104830eef1328c16f7a))

## 1.8.x

- 1.8.0
  - ✨ 支持 `html` 工具 ([97624f4](https://github.com/antvis/x6/commit/97624f4a9dfaacc551acd89c5557a2b301fe2d5e))

## 1.7.x

- 1.7.12
  - 🐛 解决 `toPNG` 下载图片不完整问题 ([6dc50e9](https://github.com/antvis/x6/commit/6dc50e91d94fae0da2bc35a056e6410cb94d07be))

- 1.7.11
  - 🐛 自动计算 `ER` 路由的方向 ([9b9a727](https://github.com/antvis/x6/commit/9b9a727c9b168af80623be448d5ae389a21a72b0))

- 1.7.9
  - 🐛 修正节点和边的类型定义([d2742a4](https://github.com/antvis/x6/commit/d2742a4a8a473e60bc47fe099fd49c27e0c2d9ae)), closes [#478](https://github.com/antvis/x6/issues/478)

- 1.7.8
  - 🐛 默认关闭代码追踪([bdb0db2](https://github.com/antvis/x6/commit/bdb0db2da8708d626ebd09b46da7d431102b79bf))

- 1.7.7
  - 🐛 解决 `html` 节点 `html` 属性设置为 dom 对象时不显示问题([afb4f0b](https://github.com/antvis/x6/commit/afb4f0b12bc28e353e5f2e4c41822cb0b77c6f8d))
  - 🐛 `interacting` 配置中每一个交互规则支持函数判断([2222ab6](https://github.com/antvis/x6/commit/2222ab683abea60e7208832e8ef856ce132c8cf0))

- 1.7.6
  - 🐛 解决在 `scroller` 模式下 `drawBackground` 导致背景消失问题([521f99a](https://github.com/antvis/x6/commit/521f99a2942ec42284fefaf63fba3ddf77a7da3a)), closes [#466](https://github.com/antvis/x6/issues/466)
  - 🐛 恢复 `minmap` 的样式([6de2ac8](https://github.com/antvis/x6/commit/6de2ac895475eda529f72a8ae774ce42a1226655))

- 1.7.4
  - 🐛 `html` 节点支持自定义重新渲染方法([0020c78](https://github.com/antvis/x6/commit/0020c781c3bb4b4747220fe327ade7e926d52014))

- 1.7.1
  - 🐛 解决样式被覆盖问题([95c1329](https://github.com/antvis/x6/commit/95c132900b8881e12b73b9c7d5ab742c0154d472))
  - 🐛 修正 `shadow-edge` 的箭头([7acd9f2](https://github.com/antvis/x6/commit/7acd9f2897747a45dd442975bc326e71740eb09e))

- 1.7.0
  - ✨ 支持 `xml` 格式 `markup`([f16e7eb](https://github.com/antvis/x6/commit/f16e7eb38ca1f0dec71f51cd41b74341fc1a0f3d))
  - 🐛 text标签支持一些特殊属性([e1f9abf](https://github.com/antvis/x6/commit/e1f9abfffcdd723815311ebc58ef17761ad2a063))

## 1.6.x

- 1.6.4
  - ⚡️ `rectangle` 中增加 `bounds` 属性([c4480af](https://github.com/antvis/x6/commit/c4480af4e45b9a90746f3aefa14a4d7332b08d6a))

- 1.6.3
  - 🐛 `ForeignObject` 的默认背景设置为透明([a386f94](https://github.com/antvis/x6/commit/a386f940eb18e718998b150d432242d8cfea5f8b))
  - 🐛 只添加 `SVG tool` 到 `ToolsView`, `HTML tools` 需要手动处理([5c7b7d6](https://github.com/antvis/x6/commit/5c7b7d646c90e20a28f273d268d83a16246bb9f2))

- 1.6.2
  - 🐛 修正开始箭头和结束箭头的位置([d637cf6](https://github.com/antvis/x6/commit/d637cf649e0b149acdf9dee12e6561e3b4f76b17))
  - 🐛 更新 `cell` 的时候需要删除 `tool` ([fac7e7a](https://github.com/antvis/x6/commit/fac7e7a4c853d75ea0ae37fcd7089bf20e56654b))
  - 🐛 拖动边的时候更新箭头([c9e7b5f](https://github.com/antvis/x6/commit/c9e7b5ffeb52e2fd609283d5f72b0d43ad368561))

- 1.6.0
  - ✨ 增加 `allowBlank`、`allowMulti`、`allowLoop`、`allowNode`、`allowEdge`、`allowPort` 六个连线规则([68f7965](https://github.com/antvis/x6/commit/68f7965699b36d6a46f25e6aba5d144fb086c9a0))

## 1.5.x

- 1.5.2
  - 🐛 校正箭头位置([b21cac6](https://github.com/antvis/x6/commit/b21cac6968a548cad17c185a4219f24d135eaa8a))

- 1.5.1
  - 🐛 修复 dnd: 拖拽节点到画布，进行异步验证时，应该停止拖拽，并优化拖拽 DEMO，支持异步验证时 loading 效果([d418e07](https://github.com/antvis/x6/commit/d418e07ef404881400faf03943c8c9ff067e4598)) ([#429](https://github.com/antvis/x6/issues/429))

- 1.5.0
  - 🐛 调用 `sendToken` 方法时，返回停止动画的方法([21276b2](https://github.com/antvis/x6/commit/21276b2a0f396b8e8343f133fed9383142468f5d))，[文档](https://x6.antv.vision/zh/docs/tutorial/advanced/animation#%E5%BC%80%E5%A7%8B)
  - ✨ 添加 `animate` 和 `animateTransform` 方法([b2ebf69](https://github.com/antvis/x6/commit/b2ebf69f2c311b1b8056179005d8fafd0a7eb8e9))，[文档](https://x6.antv.vision/zh/docs/api/view/cellview#animate)
  - ⚡️ `transition` 方法添加一系列生命周期方法和事件([462abd0](https://github.com/antvis/x6/commit/462abd0aa06e28bbbabf96ffd0493af4a9af6e1a))（[#419](https://github.com/antvis/x6/issues/419) [#420](https://github.com/antvis/x6/issues/420)），[文档](https://x6.antv.vision/zh/docs/api/model/cell#%E5%8A%A8%E7%94%BB-transition)

## 1.4.x

- 1.4.0
  - ✨ 增加循环连线 ([bfa3c67](https://github.com/antvis/x6/commit/bfa3c6743b42c22d64edfbf79f82913129a5a285))，[demo](https://github.com/antvis/X6/blob/master/examples/x6-example-features/src/pages/edge/loop.tsx)

## 1.3.x

- 1.3.20
  - 🐛 解决图片节点上设置宽高无效问题([15fd567](https://github.com/antvis/x6/commit/15fd5673e13825a94bd05ffb4f892645ee20e887)) ([#397](https://github.com/antvis/x6/issues/397))

- 1.3.14
  - 🐛 删除空格修饰键 ([a7258cd](https://github.com/antvis/x6/commit/a7258cd2db48ab63b6925101b8f98b38caa04929))

## 更早

更早的日志可以去 [Github](https://github.com/antvis/X6/blob/master/packages/x6/CHANGELOG.md) 查看