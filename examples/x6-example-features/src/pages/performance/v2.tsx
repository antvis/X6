import React from 'react'
import { Graph, Color } from '@antv/x6'
import '@antv/x6-react-shape'
import { Button } from 'antd'
import '../index.less'

Graph.registerNode(
  'org-node',
  {
    width: 260,
    height: 88,
    markup: [
      {
        tagName: 'rect',
        attrs: {
          class: 'card',
        },
      },
      {
        tagName: 'image',
        attrs: {
          class: 'image',
        },
      },
      {
        tagName: 'text',
        attrs: {
          class: 'rank',
        },
      },
      {
        tagName: 'text',
        attrs: {
          class: 'name',
        },
      },
      {
        tagName: 'g',
        attrs: {
          class: 'btn add',
        },
        children: [
          {
            tagName: 'circle',
            attrs: {
              class: 'add',
            },
          },
          {
            tagName: 'text',
            attrs: {
              class: 'add',
            },
          },
        ],
      },
      {
        tagName: 'g',
        attrs: {
          class: 'btn del',
        },
        children: [
          {
            tagName: 'circle',
            attrs: {
              class: 'del',
            },
          },
          {
            tagName: 'text',
            attrs: {
              class: 'del',
            },
          },
        ],
      },
    ],
    attrs: {
      '.card': {
        rx: 10,
        ry: 10,
        refWidth: '100%',
        refHeight: '100%',
        fill: '#FFF',
        stroke: '#000',
        strokeWidth: 0,
        pointerEvents: 'visiblePainted',
      },
      '.image': {
        x: 16,
        y: 16,
        width: 56,
        height: 56,
        opacity: 0.7,
      },
      '.rank': {
        refX: 0.95,
        refY: 0.5,
        fontFamily: 'Courier New',
        fontSize: 13,
        textAnchor: 'end',
        textVerticalAnchor: 'middle',
      },
      '.name': {
        refX: 0.95,
        refY: 0.7,
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: '600',
        textAnchor: 'end',
      },
      '.btn.add': {
        refDx: -16,
        refY: 16,
        event: 'node:add',
      },
      '.btn.del': {
        refDx: -44,
        refY: 16,
        event: 'node:delete',
      },
      '.btn > circle': {
        r: 10,
        fill: 'transparent',
        stroke: '#333',
        strokeWidth: 1,
      },
      '.btn.add > text': {
        fontSize: 20,
        fontWeight: 800,
        stroke: '#000',
        x: -5.5,
        y: 7,
        fontFamily: 'Times New Roman',
        text: '+',
      },
      '.btn.del > text': {
        fontSize: 28,
        fontWeight: 500,
        stroke: '#000',
        x: -4.5,
        y: 6,
        fontFamily: 'Times New Roman',
        text: '-',
      },
    },
  },
  true,
)

Graph.registerReactComponent(
  'custom',
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #1890ff',
      backgroundColor: 'rgba(227,244,255,.9)',
      boxShadow: '0 0 3px 3px rgb(64 169 255 / 20%)',
      borderRadius: '16px',
    }}
  >
    <div>
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.636 1c.133 0 .26.053.355.147l3.362 3.364a.5.5 0 01.147.353V14.5a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5v-13A.5.5 0 013 1h6.636zM8.42 9.2c-1.032.048-1.572.593-1.621 1.637.039.93.583 1.465 1.48 1.61l.554.753.902-.273-.613-.61.138-.057c.572-.274.752-.869.738-1.423-.026-1.036-.594-1.58-1.578-1.637zm-3.546-.4c-.786.043-1.211.56-1.274 1.125-.021.524.32 1.02.959 1.155.236.04.495.105.692.184.252.101.34.215.33.4-.02.267-.2.416-.534.431-.357.017-.582-.204-.645-.677l-.802.108c.168.76.467 1.259 1.43 1.274.88.013 1.335-.51 1.366-1.166-.01-.37-.114-.642-.471-.862a3.35 3.35 0 00-.818-.324c-.425-.11-.634-.263-.613-.447.02-.205.15-.393.455-.4.303-.007.476.093.644.415l.806-.214C6.264 9.145 5.703 8.78 4.875 8.8zm6.351.4H10.4v3.2h2.4v-.76h-1.574V9.2zm-2.834.705c.448 0 .821.254.842.934-.02.69-.37.901-.842.901-.452 0-.836-.231-.856-.9.03-.67.42-.935.856-.935zm1.014-7.752v2.94h2.94l-2.94-2.94z"
          fill="#1890FF"
          fillRule="nonzero"
        ></path>
      </svg>
    </div>
    <div>SCQL脚本-1</div>
  </div>,
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1600,
      height: 1000,
      grid: true,
      async: false,
    })
    this.graph = graph
  }

  addNodes = () => {
    const nodes = []
    for (let i = 0; i < 500; i++) {
      nodes.push({
        id: i + '',
        x: Math.floor(Math.random() * 1600),
        y: Math.floor(Math.random() * 1000),
        shape: 'org-node',
        attrs: {
          '.card': { fill: Color.randomHex() },
          '.image': {
            xlinkHref:
              'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ',
          },
          '.rank': {
            fill: '#31d0c6',
            text: `${i}`,
          },
          '.name': {
            fill: '#000',
            text: `${i}`,
          },
          '.btn > circle': { stroke: '#000' },
          '.btn > text': { fill: '#000', stroke: '#000' },
        },
      })
    }
    const start = performance.now()
    this.graph.addNodes(nodes)
    console.log('addNodes', performance.now() - start)
  }

  addEdges = () => {
    const edges = []
    for (let i = 0; i < 500; i++) {
      edges.push({
        source: Math.floor(Math.random() * 500) + '',
        target: Math.floor(Math.random() * 500) + '',
      })
    }
    const start = performance.now()
    this.graph.addEdges(edges)
    console.log('addEdges', performance.now() - start)
  }

  addNodesAndEdges = () => {
    this.addNodes()
    this.addEdges()
  }

  addNodesWithPorts = () => {
    const nodes = []
    for (let i = 0; i < 3; i++) {
      nodes.push({
        id: i + '',
        x: Math.floor(Math.random() * 1600),
        y: Math.floor(Math.random() * 1000),
        shape: 'org-node',
        attrs: {
          '.card': { fill: '#31d0c6' },
          '.image': {
            xlinkHref:
              'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ',
          },
          '.rank': {
            fill: '#31d0c6',
            text: '123',
          },
          '.name': {
            fill: '#000',
            text: 'abc',
          },
          '.btn > circle': { stroke: '#000' },
          '.btn > text': { fill: '#000', stroke: '#000' },
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
              id: i + `_port_top`,
            },
            {
              group: 'right',
              id: i + `_port_right`,
            },
            {
              group: 'bottom',
              id: i + `_port_bottom`,
            },
            {
              group: 'left',
              id: i + `_port_left`,
            },
          ],
        },
      })
    }
    const start = performance.now()
    this.graph.addNodes(nodes)
    console.log('addNodesWithPorts', performance.now() - start)
  }

  addReactNodes = () => {
    const nodes = []
    for (let i = 0; i < 500; i++) {
      nodes.push({
        id: i + '',
        x: Math.floor(Math.random() * 1600),
        y: Math.floor(Math.random() * 1000),
        shape: 'react-shape',
        component: 'custom',
        width: 160,
        height: 30,
      })
    }
    const start = performance.now()
    this.graph.addNodes(nodes)
    console.log('addReactNodes', performance.now() - start)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
        <Button onClick={this.addNodes}>addNodes</Button>
        <Button onClick={this.addEdges}>addEdges</Button>
        <Button onClick={this.addNodesAndEdges}>addNodesAndEdges</Button>
        <Button onClick={this.addNodesWithPorts}>addNodesWithPorts</Button>
        <Button onClick={this.addReactNodes}>addReactNodes</Button>
      </div>
    )
  }
}
