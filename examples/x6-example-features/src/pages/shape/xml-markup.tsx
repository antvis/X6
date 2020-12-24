import React from 'react'
import { Graph, Markup, ObjectExt, Dom } from '@antv/x6'
import '../index.less'
`
      <foreignObject width="160" height="60">
        <body style="width: 100%; height: 100%; background: transparent;">
          <div style="width: 100%; height: 100%;">
            <div>#C969F1</div>
          </div>
        </body>
      </foreignObject>
`

Graph.registerNode('xml-node', {}, true)

const { markup, attrs } = Markup.xml2json(`
  <g class="rotatable">
    <g class="scalable">
      <rect class="card" ref-width="100%" ref-height="100%" rx="10" ry="10" fill="#fff" stroke="#000" stroke-width="0" pointer-events="visiblePainted"/>
      <image x="16" y="16" width="56" height="56" opacity="0.7"/>
    </g>
    <text class="rank" ref-x="0.95" ref-y="0.5" font-family="Courier New" font-size="13" text-anchor="end" text-vertical-anchor="middle"/>
    <text class="name" ref-x="0.95" ref-y="0.7" font-family="Arial" font-size="14" font-weight="600" text-anchor="end"/>
    <g class="btn add" ref-dx="-16" ref-y="16" event="node:add">
      <circle class="add" r="10" fill="transparent" stroke="#333" stroke-width="1"/>
      <text class="add" x="-5.5" y="7" font-size="20" font-weight="600" font-family="Times New Roman" stroke="#000">+</text>
    </g>
    <g class="btn del" ref-dx="-44" ref-y="16" event="node:delete">
      <circle class="del" r="10" fill="transparent" stroke="#333" stroke-width="1"/>
      <text class="del" x="-4.5" y="6" font-size="28" font-weight="600" font-family="Times New Roman" stroke="#000">-</text>
    </g>
  </g>
`)

const male =
  'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ'
const female =
  'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*f6hhT75YjkIAAAAAAAAAAAAAARQnAQ'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      panning: true,
    })

    console.log(markup, attrs)

    graph.addNode({
      x: 100,
      y: 100,
      width: 260,
      height: 88,
      shape: 'xml-node',
      markup,
      attrs: ObjectExt.merge(attrs, {
        '.card': {
          fill: '#31d0c6',
        },
        image: {
          xlinkHref: Math.random() < 0.5 ? male : female,
        },
        '.rank': {
          text: Dom.breakText('President, Ebay Global Marketplaces', {
            width: 160,
            height: 45,
          }),
        },
        '.name': {
          text: Dom.breakText('Devin Wenig', { width: 160, height: 45 }),
        },
      }),
    })

    graph.on('node:add', () => {
      alert('add click')
    })

    graph.on('node:delete', () => {
      alert('delete click')
    })

    graph.on('node:click', () => {
      alert('node click')
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
