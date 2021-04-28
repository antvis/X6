---
title: 性能测试报告
order: 8
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
---

## 测试环境说明

* 机器：MacBook Pro (16-inch, 2019)
* 处理器：2.6 GHz 六核Intel Core i7
* 内存：16 GB 2667 MHz DDR4
* 系统：macOS Catalina (10.15.7)
* 浏览器：Google Chrome (88.0.4324.96)
* X6 版本：1.12.27

## 测试数据说明

### 普通节点、边、连接桩的配置

节点配置(包括 4 个连接桩)

```ts
Node.registry.register(
  'performance_normal_node',
  {
    inherit: 'circle',
    size: {
      width: 24,
      height: 24,
    },
    attrs: {
      body: {
        fill: '#855af2',
        stroke: 'transparent',
      },
      text: {
        fill: '#fff'
      }
    },
    ports: {
      groups: {
        top: {
          position: 'top',
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
        right: {
          position: 'right',
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
        bottom: {
          position: 'bottom',
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
        left: {
          position: 'left',
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
          group: 'top',
        },
        {
          group: 'right',
        },
        {
          group: 'bottom',
        },
        {
          group: 'left',
        }
      ]
    },
  },
  true,
)
```

边的配置

```ts
Edge.registry.register(
  'performance_normal_edge',
  {
    attrs: {
      line: {
        stroke: '#ccc',
        strokeWidth: 1,
        targetMarker: null,
      },
    },
  },
  true,
)
```

### React 节点、连接桩的配置

React 节点组件内容：

```ts
class MyComponent extends React.Component<{ node?: Node; text: string }> {
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
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          borderRadius: 12,
          backgroundColor: '#855af2'
        }}
      >
        {this.props.text}
      </div>
    )
  }
}
```

连接桩渲染内容：

```ts
onPortRendered(args) {
  const selectors = args.contentSelectors
  const container = selectors && selectors.foContent
  if (container) {
    ReactDOM.render(
      (
        <div style={{
          width: '100%',
          height: '100%',
          border: '1px solid #808080',
          borderRadius: '100%',
          background: '#eee',
        }} />
      ),
      container as HTMLElement,
    )
  }
},
```

## 测试结果

[测试代码以及结果数据](https://github.com/antvis/X6/tree/master/examples/x6-example-features/src/pages/performance/report)

### 普通渲染

#### 节点

只渲染节点，节点个数和完成渲染时间的关系如下图，其中 [sync](/zh/docs/api/graph/view/#async) 是同步渲染结果， [async](/zh/docs/api/graph/view/#async) 是异步渲染结果。

<image width="800" height="400" alt="performance" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*gVWMRIUaoGwAAAAAAAAAAAAAARQnAQ"/>

#### 带连接桩节点

在上面基础上每个节点上增加四个连接桩，节点点个数和完成渲染时间的关系如下图：

<image width="800" height="400" alt="performance" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*TZ5QRqrkUk8AAAAAAAAAAAAAARQnAQ"/>

#### 边

在节点之前新增边，边的条数和完成渲染时间的关系如下图：

<image width="800" height="400" alt="performance" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*v1SLT6-ZXwgAAAAAAAAAAAAAARQnAQ"/>

### React 渲染

#### 节点

只渲染 React 节点，节点个数和完成渲染时间的关系如下图：

<image width="800" height="400" alt="performance" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*j2XcSIdA2xYAAAAAAAAAAAAAARQnAQ"/>

#### 带连接桩节点

在普通节点上，每个节点增加四个 React 渲染的连接桩，节点个数和完成渲染时间的关系如下图：

<image width="800" height="400" alt="performance" src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*xK4jR5GLUL8AAAAAAAAAAAAAARQnAQ"/>