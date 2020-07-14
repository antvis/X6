---
title: 连接桩 Port
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

链接桩是节点上的固定连接点，很多图应用都有链接桩，并且有些应用还将链接桩分为**输入链接桩**和**输出连接桩**。


## 快速开始

创建节点时我们可以通过 `ports` 选项来配置链接桩，像下面这样：

```ts
const node = new Node({
  ports: {
    groups: { ... },
    items: [ ... ],
  }
})
```

完整的配置项稍微有点复杂，后面将详细介绍。我们先基于系统的默认选项，来快速添加几个链接桩：

```ts
graph.addNode({
  x: 60,
  y: 60,
  width: 160,
  height: 80,
  label: 'Rect With Ports',
  ports: {
    items: [
      { id: 'port1' }, 
      { id: 'port2' }, 
      { id: 'port3' },
    ],
  },
})
```

<iframe
     src="https://codesandbox.io/embed/x6-port-defaults-np6g8?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:250px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-port-defaults"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

左侧的三个圆就是我们添加的链接桩，这里使用了 [`portMarkup`](../../api/model/node#portmarkup) 指定的默认的链接桩：

```ts
{
  tagName: 'circle',
  selector: 'circle',
  attrs: {
    r: 10,
    fill: '#fff',
    stroke: '#000',
  },
}
```

知道了链接桩的 DOM 结构，我们就可以来定制链接桩的样式：

```ts
graph.addNode({
  x: 60,
  y: 60,
  width: 160,
  height: 80,
  label: 'Rect With Ports',
  ports: {
    items: [
      {
        id: 'port1',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      {
        id: 'port2',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      {
        id: 'port3',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    ],
  },
})
```

<iframe
     src="https://codesandbox.io/embed/x6-port-defaults-style-i4knb?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:250px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-port-defaults-style"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

值得注意的是，我们给 `circle` 指定了 [`magnet: true`](../../api/registry/attr#magnet) 这个特殊属性，使链接桩在连线交互时可以被连接上。

上面代码中每个链接桩的样式都一样，显得有点冗长，我们可以通过 `group` 选项来设置链接桩分组，使该组中的链接桩具有相同的行为和样式。

看下面如何使用链接桩分组来定义链接桩样式：

```ts
graph.addNode({
  x: 60,
  y: 60,
  width: 160,
  height: 80,
  label: 'Rect With Ports',
  ports: {
    groups: {
      group1: { 
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
    items: [
      {
        id: 'port1',
        group: 'group1', // 指定分组名称
      },
      {
        id: 'port2',
        group: 'group1', // 指定分组名称
      },
      {
        id: 'port3',
        group: 'group1', // 指定分组名称
      },
    ],
  },
})
```

有了链接桩之后，我们就可以为边指定连接的链接桩：

```ts
graph.addEdge({
  source: { x: 40, y: 100 },
  target: { cell: rect, port: 'port1' },
})

graph.addEdge({
  source: { x: 40, y: 100 },
  target: { cell: rect, port: 'port2' },
})

graph.addEdge({
  source: { x: 40, y: 100 },
  target: { cell: rect, port: 'port3' },
})
```

<iframe
     src="https://codesandbox.io/embed/x6-port-defaults-edge-d5gcl?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:250px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-port-defaults-edge"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


上面我们快速了解了如何创建和使用链接桩，接下来我们将详细介绍一下 `ports` 选项中的 `items` 和 `groups` 两个配置项。 

## 选项介绍

首先，`items` 是一个数组 `PortmMetadata[]`，数组的每一项表示一个链接桩，链接桩支持的选项如下：

```ts
interface PortmMetadata {
  /**
   *  链接桩唯一 ID，默认自动生成。
   */ 
  id?: string   
  
  /**
   * 分组名称，指定分组后将继承分组中的链接桩选项。
   */
  group?: string
  
  /**
   * 为群组中指定的链接桩布局算法提供参数。
   * 我们不能为单个链接桩指定布局算法，但可以为群组中指定的布局算法提供不同的参数。
   */
  args?: object

  /**
   * 链接桩的 DOM 结构定义。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  markup?: Markup
  
  /**
   * 元素的属性样式。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  attrs?: Attr.CellAttrs
  
  /**
   * 链接桩的 DOM 层级，值越大层级越高。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  zIndex?: number | 'auto'

  /**
   * 链接桩的标签。指定该选项后将覆盖 `group` 指代的群组提供的默认选项。
   */
  label?: {
    markup?: Markup // 标签 DOM 结构
    position?: {    // 标签位置
      name: string  // 标签位置计算方法的名称
      args?: object // 标签位置计算方法的参数
    }
  }
}
```

然后，通常我们将具有相同行为和外观的链接桩归为同一组，并通过 `groups` 选项来设置分组，该选项是一个对象 `{ [groupName: string]: PortGroupMetadata }`，组名为键，值为每组链接桩的默认选项，支持的选项如下：

```ts
interface PortGroupMetadata {
  /**
   * 链接桩 DOM 结构定义。
   */
  markup?: Markup
  
  /**
   * 属性和样式。
   */
  attrs?: Attr.CellAttrs
  
  /**
   * 链接桩的 DOM 层级，值越大层级越高。
   */
  zIndex?: number | 'auto'

  /**
   * 群组中链接桩的布局。
   */
  position?: 
    | [number, number] // 绝对定位
    | string           // 链接桩布局方法的名称
    | {                // 链接桩布局方法的名称和参数
        name: string
        args?: object
      }
  
  /**
   * 链接桩标签。
   */
  label?: {
    markup?: Markup
    position?: {    // 链接桩标签布局
      name: string  // 布局名称
      args?: object // 布局参数
    }
  }
}
```


例如：

```ts
const node = new Node({
  ports: {
    group: { 
      group1: { 
        markup: {
          tagName: 'circle',
          selector: 'circle',
          attrs: {
            r: 10,
            fill: '#fff',
            stroke: '#000',
          },
        },
        attrs: { 
          circle: {
            r: 6,
          },
        },
        zIndex: 1,
        position: {
          name: 'top',
          args: {},
        },
        label: { 
          markup: {
            tagName: 'text',
            selector: 'text',
            attrs: {
              fill: '#000',
            },
          },
        },
      },
      group2: { ... },
      group3: { ... },
    },
    items: [
      { id: 'port1', group: 'group1', ... },
      { id: 'port2', group: 'group1', ... },
      { id: 'port3', group: 'group2', ... },
    ],
  }
})
```

## 使用布局

- absolute
- ellipse
- ellipseSpread
- line
- left
- right
- top
- bottom
