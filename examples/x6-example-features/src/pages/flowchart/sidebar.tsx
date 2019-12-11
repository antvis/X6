import React from 'react'
import classNames from 'classnames'
import { Icon } from '@antv/x6-components'
import { util, Dnd, Graph } from '@antv/x6'
import { data, isGroup } from './data'
import { addNode } from './util'

export class Sidebar extends React.Component<Sidebar.Props> {
  private container: HTMLDivElement

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  componentDidMount() {
    this.container.childNodes.forEach(elem => {
      const instance = new Dnd({
        fully: true,
        element: elem as HTMLElement,
        preview: () => document.createElement('div'),
        containers: () => [this.props.graph.container],
      })

      instance.on(Dnd.events.prepare, this.onPrepare)
      instance.on(Dnd.events.dragEnd, this.onDragEnd)
      instance.on(Dnd.events.drop, this.onDrop)
    })
  }

  onPrepare = (state: Dnd.State) => {
    const type = state.element.getAttribute('data-type') || ''
    const itemData = data.map[type]
    if (itemData) {
      state.data = itemData

      const preview = state.preview
      preview.style.position = 'absolute'
      preview.style.zIndex = '9999'
      preview.style.border = '1px dashed #000'
      preview.style.width = `${itemData.width}px`
      preview.style.height = `${itemData.height}px`
      preview.style.cursor = 'move'

      document.body.appendChild(preview)
    }
  }

  onDragEnd = (state: Dnd.State) => {
    if (state.preview.parentNode) {
      state.preview.parentNode.removeChild(state.preview)
    }
  }

  onDrop = (state: Dnd.State) => {
    this.onDragEnd(state)
    const graph = this.props.graph
    if (state.activeContainer === graph.container && state.data != null) {
      const pos = util.clientToGraph(graph.container, state.pageX, state.pageY)
      const translate = graph.view.translate
      const group = isGroup(state.data.data.type)
      // console.log(state, group, pos, translate)
      addNode(
        this.props.graph,
        state.data,
        pos.x - translate.x - state.diffX,
        pos.y - translate.y - state.diffY,
        group ? 200 : null,
        group ? 160 : null,
      )
    }
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
