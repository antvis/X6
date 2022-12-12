import React from 'react'
import { Graph, Dom } from '@antv/x6'
import { Settings, State } from './settings'
import styles from './index.less'

Graph.registerNode(
  'custom-group-node',
  {
    inherit: 'rect',
    width: 80,
    height: 40,
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: '#fff',
        rx: 6,
        ry: 6,
      },
    },
  },
  true,
)
export default class Example extends React.Component {
  private container: HTMLDivElement
  private embedPadding: number = 20

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      embedding: {
        enabled: true,
      },
    })

    const source = graph.addNode({
      shape: 'custom-group-node',
      x: 80,
      y: 100,
      width: 80,
      height: 40,
      label: 'Child',
      zIndex: 2,
    })

    const target = graph.addNode({
      shape: 'custom-group-node',
      x: 280,
      y: 80,
      label: 'Child',
      zIndex: 2,
    })

    const parent = graph.addNode({
      shape: 'custom-group-node',
      x: 40,
      y: 40,
      width: 360,
      height: 160,
      zIndex: 1,
      label: 'Parent',
    })

    parent.addChild(source)
    parent.addChild(target)

    let ctrlPressed = false

    graph.on('node:embedding', ({ e }: { e: Dom.MouseMoveEvent }) => {
      ctrlPressed = e.metaKey || e.ctrlKey
    })

    graph.on('node:embedded', () => {
      ctrlPressed = false
    })

    graph.on('node:change:size', ({ node, options }) => {
      if (options.skipParentHandler) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originSize', node.getSize())
      }
    })

    graph.on('node:change:position', ({ node, options }) => {
      if (options.skipParentHandler || ctrlPressed) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originPosition', node.getPosition())
      }

      const parent = node.getParent()
      if (parent && parent.isNode()) {
        let originSize = parent.prop('originSize')
        if (originSize == null) {
          originSize = parent.getSize()
          parent.prop('originSize', originSize)
        }

        let originPosition = parent.prop('originPosition')
        if (originPosition == null) {
          originPosition = parent.getPosition()
          parent.prop('originPosition', originPosition)
        }

        let x = originPosition.x
        let y = originPosition.y
        let cornerX = originPosition.x + originSize.width
        let cornerY = originPosition.y + originSize.height
        let hasChange = false

        const children = parent.getChildren()
        if (children) {
          children.forEach((child) => {
            const bbox = child.getBBox().inflate(this.embedPadding)
            const corner = bbox.getCorner()

            if (bbox.x < x) {
              x = bbox.x
              hasChange = true
            }

            if (bbox.y < y) {
              y = bbox.y
              hasChange = true
            }

            if (corner.x > cornerX) {
              cornerX = corner.x
              hasChange = true
            }

            if (corner.y > cornerY) {
              cornerY = corner.y
              hasChange = true
            }
          })
        }

        if (hasChange) {
          parent.prop(
            {
              position: { x, y },
              size: { width: cornerX - x, height: cornerY - y },
            },
            // Note that we also pass a flag so that we know we shouldn't
            // adjust the `originPosition` and `originSize` in our handlers.
            { skipParentHandler: true },
          )
        }
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onSettingsChanged = (state: State) => {
    this.embedPadding = state.padding
  }

  render() {
    return (
      <div className={styles.app}>
        <div className={styles['app-side']}>
          <Settings onChange={this.onSettingsChanged} />
        </div>
        <div className={styles['app-content']} ref={this.refContainer} />
      </div>
    )
  }
}
