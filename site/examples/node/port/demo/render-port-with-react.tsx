import { Graph, Markup } from '@antv/x6'
import { Tooltip } from 'antd'
import insertCss from 'insert-css'
import React from 'react'
import { createRoot } from 'react-dom/client'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  // https://x6.antv.vision/zh/docs/tutorial/advanced/react#%E6%B8%B2%E6%9F%93%E9%93%BE%E6%8E%A5%E6%A1%A9
  onPortRendered(args) {
    const selectors = args.contentSelectors
    const container = selectors && selectors.foContent
    if (container) {
      createRoot(container as HTMLElement).render(
        (
          <Tooltip title="port">
            <div className="my-port" />
          </Tooltip>
        ) as any,
      )
    }
  },
})

graph.addNode({
  x: 100,
  y: 60,
  width: 280,
  height: 120,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  portMarkup: [Markup.getForeignObjectMarkup()],
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
        attrs: {
          fo: {
            width: 12,
            height: 12,
            x: -6,
            y: -6,
            magnet: 'true',
          },
        },
        zIndex: 1,
      },
      out: {
        position: { name: 'bottom' },
        attrs: {
          fo: {
            width: 12,
            height: 12,
            x: -6,
            y: -6,
            magnet: 'true',
          },
        },
        zIndex: 1,
      },
    },
  },
})

insertCss(`
  .my-port {
    width: 100%;
    height: 100%;
    border: 2px solid #31d0c6;
    border-radius: 100%;
    background: #fff;
  }
`)
