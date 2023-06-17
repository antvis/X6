---
title: 连接桩
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

:::info{title=在本章节中主要介绍连接桩相关的知识,通过阅读,你可以了解到}

- 如何在节点中配置连接桩
- 连接桩的增、删、改
- 如何配置连接桩的位置
- 如何配置连接桩上标签的位置 :::

## 配置连接桩

首先我们将具有相同行为和外观的连接桩归为同一组，并通过 `groups` 选项来设置分组，该选项是一个对象 `{ [groupName: string]: PortGroupMetadata }`，组名为键，值为每组连接桩的默认选项，支持的选项如下：

```ts
interface PortGroupMetadata {
  markup?: Markup // 连接桩 DOM 结构定义。
  attrs?: Attr.CellAttrs // 属性和样式。
  zIndex?: number | 'auto' // 连接桩的 DOM 层级，值越大层级越高。
  // 群组中连接桩的布局。
  position?: [number, number] | string | { name: string; args?: object }
  label?: {
    // 连接桩标签
    markup?: Markup
    position?: {
      // 连接桩标签布局
      name: string // 布局名称
      args?: object // 布局参数
    }
  }
}
```

然后我们配置 `items`，`items` 是一个数组 `PortMetadata[]`，数组的每一项表示一个连接桩，连接桩支持的选项如下：

```ts
interface PortMetadata {
  id?: string // 连接桩唯一 ID，默认自动生成。
  group?: string // 分组名称，指定分组后将继承分组中的连接桩选项。
  args?: object // 为群组中指定的连接桩布局算法提供参数, 我们不能为单个连接桩指定布局算法，但可以为群组中指定的布局算法提供不同的参数。
  markup?: Markup // 连接桩的 DOM 结构定义。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
  attrs?: Attr.CellAttrs // 元素的属性样式。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
  zIndex?: number | 'auto' // 连接桩的 DOM 层级，值越大层级越高。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
  label?: {
    // 连接桩的标签。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
    markup?: Markup // 标签 DOM 结构
    position?: {
      // 标签位置
      name: string // 标签位置计算方法的名称
      args?: object // 标签位置计算方法的参数
    }
  }
}
```

从下面例子代码中可以清晰看到连接桩的定义方式。

<code id="port-config" src="@/src/tutorial/basic/ports/config/index.tsx"></code>

## 修改连接桩

节点上有丰富的 [API](/zh/docs/api/model/node#连接桩-ports) 对连接桩进行增、删、改操作。

```ts
// 添加连接桩
node.addPort({
  group: 'top',
  attrs: {
    text: {
      text: 'xx',
    },
  },
})

// 删除连接桩
node.removePort(portId)

// 更新连接桩
node.portProp(portId, 'attrs/circle/stroke', color)
```

<code id="port-prop" src="@/src/tutorial/basic/ports/dynamic/index.tsx"></code>

## 连接桩位置

连接桩布局算法只能通过 `groups` 中的 `position` 选项来指定，因为布局算法在计算连接桩位置时需要考虑到群组中的所有连接桩，我们在单个连接桩中可以通过 `args` 选项来影响该连接桩的布局结果。

我们默认提供了下面几种连接桩布局算法，同时支持[自定义连接桩布局算法并注册使用](/zh/docs/api/registry/port-layout#registry)，点击下面的链接可以了解每种布局算法的使用方法。

- [`absolute`](/zh/docs/api/registry/port-layout#absolute) 绝对定位。
- [`left`](/zh/docs/api/registry/port-layout#left-right-top-bottom) 矩形节点左侧均匀分布。
- [`right`](/zh/docs/api/registry/port-layout#left-right-top-bottom) 矩形节点右侧均匀分布。
- [`top`](/zh/docs/api/registry/port-layout#left-right-top-bottom) 矩形节点顶部均匀分布。
- [`bottom`](/zh/docs/api/registry/port-layout#left-right-top-bottom) 矩形节点底部均匀分布。
- [`line`](/zh/docs/api/registry/port-layout#line) 沿指定的线均匀分布。
- [`ellipse`](/zh/docs/api/registry/port-layout#ellipse) 沿椭圆圆弧分布。
- [`ellipseSpread`](/zh/docs/api/registry/port-layout#ellipsespread) 沿椭圆均匀分布。

## 连接桩标签位置

在 `groups` 的 `label.position` 选项和节点的 `items.label.position` 选项中都可以指定标签的位置。

我们默认提供了下面几种标签位置，也支持[自定义标签位置并注册使用](/zh/docs/api/registry/port-label-layout#registry)，点击下面的链接了解每种标签位置的使用方法。

- [`left`](/zh/docs/api/registry/port-label-layout#side) 标签位于连接桩左侧。
- [`right`](/zh/docs/api/registry/port-label-layout#side) 标签位于连接桩右侧。
- [`top`](/zh/docs/api/registry/port-label-layout#side) 标签位于连接桩上方。
- [`bottom`](/zh/docs/api/registry/port-label-layout#side) 标签位于连接桩下方。
- [`inside`](/zh/docs/api/registry/port-label-layout#insideoutside) 标签位于节点内围（靠近边线的内侧）。
- [`outside`](/zh/docs/api/registry/port-label-layout#insideoutside) 标签位于节点外围（靠近边线的外侧）。
- [`insideOriented`](/zh/docs/api/registry/port-label-layout#insideoutside) 标签位于节点内围，而且根据所在方位自动调整文本的方向。
- [`outsideOriented`](/zh/docs/api/registry/port-label-layout#insideoutside) 标签位于节点外围，而且根据所在方位自动调整文本的方向。
- [`radial`](/zh/docs/api/registry/port-label-layout#radial) 标签位于圆形或椭圆形节点的外围。
- [`radialOriented`](/zh/docs/api/registry/port-label-layout#radial) 标签位于圆形或椭圆形节点的外围，并使标签文本自动沿圆弧方向旋转。
