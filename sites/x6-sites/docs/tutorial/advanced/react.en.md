---
title: 使用 HTML/React 渲染
order: 4
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/advanced
---

在 SVG 中有一个特殊的 `<foreignObject>` 元素，在该元素中可以内嵌任何 XHTML 元素，所以我们可以借助该元素来渲染 HTML 元素和 React 组件到需要位置。

```html
<svg xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="120" height="50">
    <body xmlns="http://www.w3.org/1999/xhtml">
      <p>Hello World</p>
    </body>
  </foreignObject>
</svg>
```

## 渲染节点

### 渲染 HTML 节点

我们可以将节点的 `'shape'` 属性指定为 `’html‘`，就可以通过 `'html'` 属性来指定需要渲染的 HTML 元素或一个返回 HTML 元素的方法。

```ts
const source = graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  shape: 'html',
  html() {
    const wrap = document.createElement('div')
    wrap.style.width = '100%'
    wrap.style.height = '100%'
    wrap.style.background = '#f0f0f0'
    wrap.style.display = 'flex'
    wrap.style.justifyContent = 'center'
    wrap.style.alignItems = 'center'

    wrap.innerText = 'Hello'

    return wrap
  },
})

const wrap = document.createElement('div')
wrap.style.width = '100%'
wrap.style.height = '100%'
wrap.style.background = '#f0f0f0'
wrap.style.display = 'flex'
wrap.style.justifyContent = 'center'
wrap.style.alignItems = 'center'
wrap.innerText = 'World'

const target = graph.addNode({
  x: 180,
  y: 160,
  width: 100,
  height: 40,
  shape: 'html',
  html: wrap,
})
```

<iframe src="/demos/tutorial/advanced/react/html-shape"></iframe>

[[warning]]
| 需要注意的是，当 `html` 属性为 HTML 元素或函数时，将不能通过 `graph.toJSON()` 方法导出画布数据。所以我们提供了以下两种方案来解决数据导出问题。

**方案一**

使用 `Graph.registerHTMLComponent(...)` 方法将 HTML 元素或返回 HTML 元素的函数注册到系统中。

```ts
// 注册 HTML 元素
Graph.registerHTMLComponent('my-html1', elem)

// 注册返回 HTML 元素的函数
Graph.registerHTMLComponent('my-html2', (node) => {
  const data = node.getData()
  if (data.flag) {
    return document.createElement('div')
  }
  return document.createElement('p')
})
```

然后将节点的 `html` 属性指定为注册的组件名。

```ts
graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  shape: 'html',
  html: 'my-html1',
})
```

**方案二**

创建 Graph 时通过 `getHTMLComponent` 选项来动态返回节点的 HTML 元素。

```ts
const graph = new Graph({
  getHTMLComponent(node) {
    const data = node.getData()
    if (data.flag) {
      return document.createElement('div')
    }
    return document.createElement('p')
  }
})
```

### 渲染 React 节点

我们提供了一个独立的包 `@antv/x6-react-shape` 来使用 React 渲染节点。

```shell
# npm
npm install @antv/x6-react-shape

# yarn
yarn add @antv/x6-react-shape
```

安装并应用该包后，指定节点的 `'shape'` 为 `'react-shape'`，并通过 `component` 属性来指定渲染节点的 React 组件。

```ts
import '@antv/x6-react-shape'
```

```tsx
graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  shape: 'react-shape',
  component: <MyComponent text="Hello" />,
})
```

节点渲染时将自动为 React 组件注入一个名为 `'node'` 的属性，属性值为当前节点的实例。节点每次重新渲染都将触发 React 组件重新渲染，我们可以通过 `node` 属性和 `shouldComponentUpdate` 方法来决定是否需要重新渲染 React 组件。在下面示例中，仅当节点的 `data` 发生变化时才触发 `MyComponent` 组件重新渲染。
 
```tsx
import { ReactShape } from '@antv/x6-react-shape'

export class MyComponent extends React.Component<{ node?: ReactShape; text: string }> {
  shouldComponentUpdate() {
    const node = this.props.node
    if (node) {
      if (node.hasChanged('data')) {
        return true
      }
    }

    return false
  }

  render() {
    return (<div>{this.props.text}</div>)
  }
}
```


另外 `component` 也可以是一个返回 React 组件的方法 `(this:Graph, node: ReactShape) => React.Component`，每次重新渲染都会调用该方法来获取最新的组件。

```tsx
graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  shape: 'react-shape',
  component(node) {
    const data = node.getData()
    return (<div>{data.text}</div>)
  },
})
```

<iframe src="/demos/tutorial/advanced/react/react-shape"></iframe>

[[warning]]
| 需要注意的是，当 `component` 为 React 组件或函数时，将不能通过 `graph.toJSON()` 方法导出画布数据。所以我们提供了以下两种方案来解决数据导出问题。

**方案一**

使用 `Graph.registerReactComponent(...)` 方法将 React 组件或返回 React 组件的函数注册到系统中。

```ts
// 注册 React 组件
Graph.registerReactComponent('my-component1', <MyComponent text="Hello" />)

// 注册返回 React 组件的函数
Graph.registerReactComponent('my-component2', (node) => {
  const data = node.getData()
  return (<div>{data.text}</div>)
})
```

然后将节点的 `component` 属性指定为注册的组件名。

```ts
graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  shape: 'react-shape',
  component: 'my-component1',
})
```

**方案二**

创建 Graph 时通过 `getReactComponent` 选项来动态返回节点的 React 组件。

```ts
const graph = new Graph({
  getReactComponent(node: ReactShape) {
    const data = node.getData()
    if (data.flag) {
      return (<div>{data.text}</div>)
    }

    return (<MyComponent text="Hello" />)
  }
})
```

## 渲染标签

在创建 Graph 时，我们可以定义一个 `onEdgeLabelRendered` 钩子来自定义边 Label 的渲染行为。

```ts
export interface OnEdgeLabelRenderedArgs {
  edge: Edge         // 边
  label: Edge.Label  // Label 数据
  container: Element // Label 容器
  selectors: Markup.Selectors // Label Markup 定义的选择器和对应的元素
}

new Graph({
  onEdgeLabelRendered(args: OnEdgeLabelRenderedArgs) { }
})
```

在 `onEdgeLabelRendered` 钩子中我们可以通过 `args` 参数拿到当前 Label 的各种信息，比如 `container` 和 `selectors`，这样我们就可以对 Label 做进一步渲染。

```ts
const graph = new Graph({
  container: this.container,
  onEdgeLabelRendered(args) {
    const { label, container, selectors } = args
    const data = label.data
    
    if (data) {
      // 在 Label 容器中渲染一个 foreignObject 来承载 HTML 元素和 React 组件
      const content = this.appendForeignObject(container)

      if (data === 1) {
        // 渲染一个 Div 元素
        const txt = document.createTextNode('text node')
        content.style.border = '1px solid #f0f0f0'
        content.style.borderRadius = '4px'
        content.appendChild(txt)
      } else if (data === 2) {
        // 渲染一个 HTML 按钮
        const btn = document.createElement('button')
        btn.appendChild(document.createTextNode('HTML Button'))
        btn.style.height = '30px'
        btn.style.lineHeight = '1'
        btn.addEventListener('click', () => {
          alert('clicked')
        })
        content.appendChild(btn)
      } else if (data === 3) {
        // 渲染一个 Atnd 的按钮
        ReactDOM.render(<Button size="small">Antd Button</Button>, content)
      }
    }
  },
})

graph.addEdge({
  source: { x: 40, y: 40 },
  target: { x: 480, y: 40 },
  label: { attrs: { text: { text: 'Hello' } } },
})

graph.addEdge({
  source: { x: 40, y: 40 },
  target: { x: 480, y: 40 },
  label: { position: 0.25, data: 1 },
})

graph.addEdge({
  source: { x: 40, y: 160 },
  target: { x: 480, y: 160 },
  labels: [
    { position: 0.25, data: 2 },
    { position: 0.75, data: 3 },
  ],
})
```

<iframe src="/demos/tutorial/advanced/react/react-label-base"></iframe>

另外，我们也可以在定义 Label 的 Markup 时添加 `<foreignObject>` 元素来支持 HTML 和 React 的渲染能力。

```ts
const graph = new Graph({
  container: this.container,
  onEdgeLabelRendered: (args) => {
    const { selectors } = args
    const content = selectors.foContent as HTMLDivElement

    if (content) {
      content.style.display = 'flex'
      content.style.alignItems = 'center'
      content.style.justifyContent = 'center'
      ReactDOM.render(<Button size="small">Antd Button</Button>, content)
    }
  },
})

graph.addEdge({
  source: { x: 40, y: 40 },
  target: { x: 480, y: 40 },
  label: {
    markup: Markup.getForeignObjectMarkup(),
    attrs: {
      fo: {
        width: 120,
        height: 30,
        x: -60,
        y: -15,
      },
    },
  },
})

graph.addEdge({
  source: { x: 40, y: 120 },
  target: { x: 480, y: 120 },
  defaultLabel: {
    markup: Markup.getForeignObjectMarkup(),
    attrs: {
      fo: {
        width: 120,
        height: 30,
        x: -60,
        y: -15,
      },
    },
  },
  label: { position: 0.25 },
})
```

<iframe src="/demos/tutorial/advanced/react/react-label-markup"></iframe>

## 渲染链接桩

在创建 Graph 时，我们可以定义一个 `onPortRendered` 钩子来自定义链接桩的渲染行为。

```ts
  export interface OnPortRenderedArgs {
    node: Node             // 节点                
    port: PortManager.Port // 链接桩
    container: Element           // 链接桩容器
    selectors?: Markup.Selectors // 链接桩的选择器和对应的元素
    labelContainer: Element             // 链接桩标签容器
    labelSelectors?: Markup.Selectors   // 链接桩标签 Markup 定义的选择器和对应元素
    contentContainer: Element           // 链接桩内容容器
    contentSelectors?: Markup.Selectors // 链接桩内容 Markup 定义的选择器和对应元素
  }

new Graph({
  onPortRendered(args: OnPortRenderedArgs) { }
})
```

在 `OnPortRenderedArgs` 钩子中我们可以通过 `args` 参数拿到当前链接桩的各种信息，比如 `container` 和 `selectors`，这样我们就可以对链接桩做进一步渲染。

```ts
const graph = new Graph({
  container: this.container,
  onPortRendered(args) {
    const selectors = args.contentSelectors
    const container = selectors && selectors.foContent
    if (container) {
      ReactDOM.render(
        <Tooltip title="port">
          <div className="my-port" />
        </Tooltip>,
        container,
      )
    }
  },
})

graph.addNode({
  x: 40,
  y: 35,
  width: 160,
  height: 30,
  label: 'Hello',
  portMarkup: [Markup.getForeignObjectMarkup()],
  ports: {
    groups: {
      in: {
        position: { name: 'top' },
        attrs: {
          fo: {
            width: 10,
            height: 10,
            x: -5,
            y: -5,
            magnet: 'true',
          },
        },
        zIndex: 1,
      },
      out: {
        position: { name: 'bottom' },
        attrs: {
          fo: {
            width: 10,
            height: 10,
            x: -5,
            y: -5,
            magnet: 'true',
          },
        },
        zIndex: 1,
      },
    },
    items: [
      { group: 'in', id: 'in1' },
      { group: 'in', id: 'in2' },
      { group: 'out', id: 'out1' },
      { group: 'out', id: 'out2' },
    ],
  },
})
```

<iframe src="/demos/tutorial/advanced/react/react-port"></iframe>
