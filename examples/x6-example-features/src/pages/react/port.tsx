import React from 'react'
import ReactDOM from 'react-dom'
import { Graph, Dom, Shape, Node, Path } from '@antv/x6'
import { Tooltip } from 'antd'
import classnames from 'classnames'
import '@antv/x6-react-shape'
import './port.less'
import '../index.less'

Shape.Rect.define({
  shape: 'rect-port',
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
})

Graph.registerConnector(
  'pai',
  (s, t) => {
    const offset = 4
    const control = 80
    const v1 = { x: s.x, y: s.y + offset + control }
    const v2 = { x: t.x, y: t.y - offset - control }

    return Path.normalize(
      `M ${s.x} ${s.y}
       L ${s.x} ${s.y + offset}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${t.x} ${t.y - offset}
       L ${t.x} ${t.y}
      `,
    )
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      onPortRendered(args) {
        // console.log(args)
        const port = args.port
        const contentSelectors = args.contentSelectors
        const container = contentSelectors && contentSelectors.content
        if (container) {
          ReactDOM.render(
            <Tooltip title="port">
              <div
                className={classnames('my-port', {
                  connected: port.connected,
                })}
              />
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
        connector: 'pai',
        // connector: 'smooth',
        createEdge() {
          return new Shape.Edge({
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
        validateConnection({
          sourceView,
          targetView,
          sourceMagnet,
          targetMagnet,
        }) {
          // 不允许连接到自己
          if (sourceView === targetView) {
            return false
          }

          // 只能从输出链接桩创建连接
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'in'
          ) {
            return false
          }

          // 只能连接到输入链接桩
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'in'
          ) {
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
      shape: 'rect-port',
      width: 160,
      height: 30,
      x: 360,
      y: 180,
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
      shape: 'rect-port',
      width: 160,
      height: 30,
      x: 40,
      y: 40,
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
      shape: 'rect-port',
      width: 160,
      height: 30,
      x: 240,
      y: 380,
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
      // data: {
      //   connection: { in1: true },
      // },
    })

    graph.addEdge({
      source: { cell: source.id, port: 'out1' },
      target: { cell: target.id, port: 'in1' },
      attrs: {
        line: {
          stroke: '#808080',
          strokeWidth: 1,
          targetMarker: '',
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
