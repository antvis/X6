import React from 'react'
import ReactDOM from 'react-dom'
import insertCss from 'insert-css'
import { Tooltip } from 'antd'
import { Graph, Node, Path, Dom } from '@antv/x6'

// https://codesandbox.io/s/x6-pai-edge-nq3hl

// 定义节点
Graph.registerNode(
  'algo-node',
  {
    inherit: 'rect',
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: '#108ee9',
        fill: '#fff',
        rx: 15,
        ry: 15,
      },
    },
    portMarkup: [
      {
        tagName: 'foreignObject',
        selector: 'fo',
        attrs: {
          width: 10,
          height: 10,
          x: -5,
          y: -5,
          magnet: 'true',
        },
        children: [
          {
            ns: Dom.ns.xhtml,
            tagName: 'body',
            selector: 'foBody',
            attrs: {
              xmlns: Dom.ns.xhtml,
            },
            style: {
              width: '100%',
              height: '100%',
            },
            children: [
              {
                tagName: 'div',
                selector: 'content',
                style: {
                  width: '100%',
                  height: '100%',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  true,
)

// 定义边
Graph.registerConnector(
  'algo-edge',
  (source, target) => {
    const offset = 4
    const control = 80
    const v1 = { x: source.x, y: source.y + offset + control }
    const v2 = { x: target.x, y: target.y - offset - control }

    return Path.normalize(
      `M ${source.x} ${source.y}
       L ${source.x} ${source.y + offset}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${target.x} ${target.y - offset}
       L ${target.x} ${target.y}
      `,
    )
  },
  true,
)

// 初始化画布
const graph = new Graph({
  grid: true,
  container: document.getElementById('container'),
  onPortRendered(args) {
    // console.log(args)
    const port = args.port
    const contentSelectors = args.contentSelectors
    const container = contentSelectors && contentSelectors.content
    if (container) {
      ReactDOM.render(
        <Tooltip title="port">
          <div className={`my-port${port.connected ? ' connected' : ''}`} />
        </Tooltip>,
        container,
      )
    }
  },
  highlighting: {
    nodeAvailable: {
      name: 'className',
      args: {
        className: 'available',
      },
    },
    magnetAvailable: {
      name: 'className',
      args: {
        className: 'available',
      },
    },
    magnetAdsorbed: {
      name: 'className',
      args: {
        className: 'adsorbed',
      },
    },
  },
  connecting: {
    snap: true,
    dangling: false,
    highlight: true,
    sourceAnchor: 'bottom',
    targetAnchor: 'center',
    connectionPoint: 'anchor',
    connector: 'algo-edge',
    createEdge() {
      return graph.createEdge({
        attrs: {
          line: {
            strokeDasharray: '5 5',
            stroke: '#808080',
            strokeWidth: 1,
            targetMarker: {
              name: 'block',
              args: {
                size: '6',
              },
            },
          },
        },
      })
    },
    validateMagnet({ magnet }) {
      return magnet.getAttribute('port-group') !== 'in'
    },
    validateConnection({ sourceView, targetView, sourceMagnet, targetMagnet }) {
      // 不允许连接到自己
      if (sourceView === targetView) {
        return false
      }

      // 只能从输出链接桩创建连接
      if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
        return false
      }

      // 只能连接到输入链接桩
      if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
        return false
      }

      // 判断目标链接桩是否可连接
      const portId = targetMagnet.getAttribute('port')!
      const node = targetView.cell as Node
      const port = node.getPort(portId)
      if (port && port.connected) {
        return false
      }

      return true
    },
  },
})

graph.on('edge:connected', (args) => {
  const edge = args.edge
  const node = args.currentCell as Node
  const elem = args.currentMagnet as HTMLElement
  const portId = elem.getAttribute('port') as string

  // 触发 port 重新渲染
  node.setPortProp(portId, 'connected', true)

  // 更新连线样式
  edge.attr({
    line: {
      strokeDasharray: '',
      targetMarker: '',
    },
  })
})

graph.addNode({
  x: 380,
  y: 180,
  width: 160,
  height: 30,
  shape: 'algo-node',
  label: '归一化',
  ports: {
    items: [
      { group: 'in', id: 'in1' },
      { group: 'in', id: 'in2' },
      { group: 'out', id: 'out1' },
      { group: 'out', id: 'out2' },
    ],
    groups: {
      in: {
        position: { name: 'top' },
        zIndex: 1,
      },
      out: {
        position: { name: 'bottom' },
        zIndex: 1,
      },
    },
  },
})

const source = graph.addNode({
  x: 200,
  y: 50,
  width: 160,
  height: 30,
  shape: 'algo-node',
  label: 'SQL',
  ports: {
    items: [
      { group: 'in', id: 'in1' },
      { group: 'in', id: 'in2' },
      { group: 'out', id: 'out1' },
    ],
    groups: {
      in: {
        position: { name: 'top' },
        zIndex: 1,
      },
      out: {
        position: { name: 'bottom' },
        zIndex: 1,
      },
    },
  },
})

const target = graph.addNode({
  x: 120,
  y: 260,
  width: 160,
  height: 30,
  shape: 'algo-node',
  label: '序列化',
  ports: {
    items: [
      { group: 'in', id: 'in1', connected: true },
      { group: 'in', id: 'in2' },
      { group: 'out', id: 'out1' },
    ],
    groups: {
      in: {
        position: { name: 'top' },
        zIndex: 1,
      },
      out: {
        position: { name: 'bottom' },
        zIndex: 1,
      },
    },
  },
})

graph.addEdge({
  source: { cell: source, port: 'out1' },
  target: { cell: target, port: 'in1' },
  attrs: {
    line: {
      stroke: '#808080',
      strokeWidth: 1,
      targetMarker: '',
    },
  },
})

// 引入样式
insertCss(`
.x6-node [magnet="true"] {
  cursor: crosshair;
  transition: none;
}

.x6-node [magnet="true"]:hover {
  opacity: 1;
}

.x6-node [magnet="true"][port-group="in"] {
  cursor: move;
}

.my-port {
  width: 100%;
  height: 100%;
  border: 1px solid #808080;
  border-radius: 100%;
  background: #eee;
}

.my-port.connected {
  width: 0;
  height: 0;
  margin-top: 5px;
  margin-left: 1px;
  border-width: 5px 4px 0;
  border-style: solid;
  border-color: #808080 transparent transparent;
  border-radius: 0;
  background-color: transparent;
}

.x6-port-body.available {
  overflow: visible;
}

.x6-port-body.available body {
  overflow: visible;
}

.x6-port-body.available body > div::before {
  content: " ";
  float: left;
  width: 20px;
  height: 20px;
  margin-top: -5px;
  margin-left: -5px;
  border-radius: 50%;
  background-color: rgba(57, 202, 116, 0.6);
  box-sizing: border-box;
}

.x6-port-body.available body > div::after {
  content: " ";
  float: left;
  clear: both;
  width: 10px;
  height: 10px;
  margin-top: -15px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #39ca74;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

.x6-port-body.adsorbed {
  overflow: visible;
}

.x6-port-body.adsorbed body {
  overflow: visible;
}

.x6-port-body.adsorbed body > div::before {
  content: " ";
  float: left;
  width: 28px;
  height: 28px;
  margin-top: -9px;
  margin-left: -9px;
  border-radius: 50%;
  background-color: rgba(57, 202, 116, 0.6);
  box-sizing: border-box;
}

.x6-port-body.adsorbed body > div::after {
  content: " ";
  float: left;
  clear: both;
  width: 10px;
  height: 10px;
  margin-top: -19px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #39ca74;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}
`)
