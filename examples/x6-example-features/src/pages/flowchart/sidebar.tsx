import React from 'react'
import classNames from 'classnames'
import { Icon } from '@antv/x6-components'
import { Graph, Dnd } from '@antv/x6'
import { data, DataItem, isGroup } from './data'
import { addNode } from './util'

export class Sidebar extends React.Component<Sidebar.Props> {
  private container: HTMLDivElement

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  componentDidMount() {
    this.container.childNodes.forEach((elem: HTMLElement) => {
      const type = elem.getAttribute('data-type') || ''
      const itemData = data.map[type]

      const dnd = new Dnd<DataItem>(elem, {
        data: itemData,
        getGraph: () => this.props.graph,
        getTargetCell: ({ graph, graphX, graphY }) => {
          const cell = graph.getCellAt(graphX, graphY)
          if (cell != null && cell.data != null && isGroup(cell.data.type)) {
            return cell
          }
          return null
        },
        createDragElement: ({ element }) => {
          const elem = document.createElement('div') as HTMLDivElement
          const w = element.offsetWidth
          const h = element.offsetHeight
          elem.style.width = `${w}px`
          elem.style.height = `${h}px`
          elem.style.border = '1px dashed #000'
          elem.style.cursor = 'move'
          return elem
        },
        createPreviewElement: ({ graph, element }) => {
          const elem = document.createElement('div') as HTMLDivElement
          const w = element.offsetWidth
          const h = element.offsetHeight
          const s = graph.view.scale
          elem.style.width = `${w * s}px`
          elem.style.height = `${h * s}px`
          elem.style.border = '1px dashed #000'
          elem.style.cursor = 'move'
          return elem
        },
      })

      dnd.on('dragPrepare', ({ dragElement }) => {
        dragElement.style.margin = '0'
      })

      dnd.on('drop', ({ data, graph, targetCell, targetPosition }) => {
        if (data != null) {
          const group = isGroup(data.data.type)
          const parent = targetCell || undefined
          let x = targetPosition.x
          let y = targetPosition.y
          // relative parent position
          if (parent != null) {
            const geom = parent.getGeometry()!
            x -= geom.bounds.x
            y -= geom.bounds.y
          }

          const cell = addNode(
            graph,
            data,
            x,
            y,
            group ? 200 : null,
            group ? 160 : null,
            null,
            parent,
          )

          graph.selectCell(cell)
        }
      })
    })
  }

  render() {
    return (
      <div className="flowchart-source-nodes" ref={this.refContainer}>
        {data.items.map(({ data, width, height }) => (
          <div
            key={data.type}
            data-type={data.type}
            style={{ width, height }}
            className={classNames('flowchart-node-wrap', data.type)}
          >
            <div className={classNames('flowchart-node', data.type)}>
              {data.icon && <Icon type={data.icon} svg={true} />}
              <span className="text">{data.title}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export namespace Sidebar {
  export interface Props {
    graph: Graph
  }
}
