---
title: 引脚编辑器
order: 12
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

:::info{title=在本章节中主要介绍引脚编辑器插件相关的知识，通过阅读，你可以了解到}

- 如何在画布上交互式地添加、删除引脚
- 引脚如何复用 X6 的端口（port）体系，从而天然支持连线与导出
- 如何配置引脚落点、编号与连线样式

:::

## 使用

X6 的端口是一份**声明式数据**：位置、样式、所属分组都由使用者在创建节点时写好，运行期只有
`node.addPort` / `node.removePort` 这类程序化接口。引脚编辑器 `PortEditor` 补上的是**编辑动作**：
让"在哪里加一个引脚"由人在画布上直接点出来。

```ts
import { Graph, PortEditor } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container')!,
})

const portEditor = new PortEditor({
  group: 'pin',
  outlineSelector: '.x6-node-body',
})

graph.use(portEditor)

// 进入"添加引脚"模式：鼠标划过元件轮廓时出现落点预览，点击即在该处生成引脚
document.getElementById('add-pin')!.addEventListener('click', () => {
  portEditor.toggleAdding()
})
```

引脚落在**轮廓上的最近点**：插件会对元件 markup 中的几何图形（`rect` / `circle` /
`ellipse` / `path` / `polygon` / `polyline`）按弧长采样，再把鼠标位置投影到最近的一条边上，
因此异形元件（六边形、圆形、变压器符号…）也能贴边落点，而不是落在包围盒的四个角上。
投影全程走 SVG CTM 链，画布平移、缩放以及元件自身的旋转都不需要特判。

生成的引脚就是一个普通的端口：可以直接从它拖拽连线，也会随 `graph.toJSON()` 一起导出、
并能通过 `graph.fromJSON()` 原样还原。

## 配置

```ts
interface PortEditorOptions {
  // 引脚使用的端口分组，节点上没有该分组时自动创建
  group?: string
  // 生成引脚 id 的前缀：pin-1、pin-2 ...
  idPrefix?: string
  // 'local' 存节点局部坐标（像素，缩放元件时保持像素偏移）
  // 'percent' 存节点尺寸的百分比（缩放元件时保持相对位置）
  positionUnit?: 'local' | 'percent'
  // 轮廓选择器；缺省用 markup 中所有几何图形，取最近的一个
  outlineSelector?: string
  // 每条轮廓的最大采样点数
  sampleCount?: number
  // 节点缺少端口分组时是否自动创建
  autoCreateGroup?: boolean
  // 自动创建时使用的分组定义
  groupConfig?: Record<string, any>
  // 悬停已有引脚时是否显示删除角标
  deleteBadge?: boolean
  // 放好一个引脚后是否自动退出添加模式
  stopAfterAdd?: boolean
  // 添加模式下禁止拖动元件（默认 true）
  blockNodeMove?: boolean
  // 添加模式下禁用画布平移（默认 true）
  blockPanning?: boolean
}
```

`blockNodeMove` 与 `blockPanning` 默认开启，因为"按下元件本体加引脚"这个动作在 X6 中同时是
元件拖动与画布平移的起手式：不屏蔽就会变成拖元件或拖画布。这两个开关只在添加模式内生效，
退出时会**逐项还原**，不会在你的图配置里留下痕迹。

## API

```ts
// 模式
portEditor.startAdding(): this
portEditor.stopAdding(): this
portEditor.toggleAdding(): this
portEditor.isAdding(): boolean

// 引脚
portEditor.addPin(node: Node, local: Point): string | null
portEditor.addPinAtClient(node: Node, clientX: number, clientY: number): string | null
portEditor.addPinFromDrop(clientX: number, clientY: number, node?: Node): string | null
portEditor.removePin(node: Node, portId: string): this
portEditor.clearPins(node: Node): this
portEditor.getPins(node: Node): Port[]

// 拖拽落点（配合 Dnd 插件使用）
portEditor.createDndDropValidator(options?: { isPinTemplate?: (node: Node) => boolean }): (
  droppingNode: Node,
  ctx?: { targetGraph?: Graph },
) => boolean

// 命中测试
portEditor.findNodeAtClient(clientX: number, clientY: number): Node | null

portEditor.dispose(): void
```

## 与其它插件的配合

- **Selection**：选中元件后，选择框默认会覆盖元件轮廓，而引脚正好也落在轮廓上。请把选择框
  设为不接收指针事件，否则在选中态下按下轮廓无法生成引脚、也无法从引脚起线：

  ```ts
  graph.use(
    new Selection({
      showNodeSelectionBox: true,
      pointerEvents: 'none',
    }),
  )
  ```

- **Dnd**：把「引脚模板」拖到元件上生成引脚，并阻止模板节点本身落地：

  ```ts
  graph.use(
    new Dnd({
      target: graph,
      validateNode: portEditor.createDndDropValidator(),
    }),
  )
  ```

  默认把 `node.getData().pinTemplate === true` 或 `shape === 'pin-dot'` 的节点视为引脚模板。

- **History**：引脚的新增与删除都包在 `model.startBatch/stopBatch` 中，一次操作对应一步撤销。
