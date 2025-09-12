import React from 'react'
import { register } from '@antv/x6-react-shape'
import { Node } from '@antv/x6'
import { generateData, parsePorts } from './data'
import './component.less'

export class Component extends React.Component<Component.Props> {
  private container: HTMLDivElement

  get node() {
    return this.props.node!
  }

  get data() {
    return this.node.getData<ReturnType<typeof generateData>>()
  }

  get ports() {
    return parsePorts(this.data)
  }

  shouldComponentUpdate() {
    const node = this.props.node
    if (node) {
      if (node.hasChanged('data')) {
        return true
      }
    }

    return false
  }

  componentDidMount() {
    this.renderPorts(0)
  }

  getContainerOffsetTop() {
    let offset = this.container.offsetTop
    let parent = this.container.offsetParent as HTMLElement
    while (parent && parent.tagName !== 'body') {
      offset += parent.offsetTop || 0
      parent = parent.offsetParent as HTMLElement
    }
    return offset
  }

  getVisiblePorts(scrollTop: number) {
    const portSize = 12
    const itemHeight = 40
    const ports = this.ports.filter(({ index }) => {
      const top = itemHeight * index + (itemHeight - portSize) / 2
      const bottom = top + portSize
      return top > scrollTop && bottom < scrollTop + this.container.clientHeight
    })

    const offsetBase = this.getContainerOffsetTop()
    ports.forEach((port) => {
      port.args = {
        offset:
          offsetBase + port.index * itemHeight + itemHeight / 2 - scrollTop,
      }
    })

    return ports
  }

  getRenderPorts(scrollTop: number) {
    const allInPorts = this.ports.filter((port) => port.group === 'in')
    const allOutPorts = this.ports.filter((port) => port.group === 'out')
    const visiblePorts = this.getVisiblePorts(scrollTop)
    const offsetBase = this.getContainerOffsetTop()
    const visibleInPorts = visiblePorts.filter((port) => port.group === 'in')
    const visibleOutPorts = visiblePorts.filter((port) => port.group === 'out')
    if (visibleInPorts.length < allInPorts.length) {
      visibleInPorts.unshift({
        id: 'port-in-root',
        group: 'in',
        index: -1,
        args: {
          // dx: -8,
          offset: Math.round(offsetBase / 2),
        },
      })
    }

    if (visibleOutPorts.length < allOutPorts.length) {
      visibleOutPorts.unshift({
        id: 'port-out-root',
        group: 'out',
        index: -1,
        args: {
          offset: 23,
        },
      })
    }

    return [...visibleInPorts, ...visibleOutPorts]
  }

  onScroller = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLDivElement
    this.renderPorts(target.scrollTop)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  renderPorts(scrollTop: number) {
    const ports = this.getRenderPorts(scrollTop)
    this.node.removePorts({ silent: true })
    this.node.addPorts(ports)
  }

  render() {
    return (
      <div className="react-table">
        <div className="inner">
          <div className="header">Table Name</div>
          <div className="body">
            <div
              className="body-inner"
              ref={this.refContainer}
              onScroll={this.onScroller}
            >
              <ul>
                {this.data.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// eslint-disable-next-line
export namespace Component {
  export interface Props {
    node?: Node
    text: string
  }
}

register({
  shape: 'react-table-shape',
  component: Component,
  view: 'table-node-view',
})
