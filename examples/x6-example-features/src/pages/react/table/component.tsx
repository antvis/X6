import React from 'react'
import { Node } from '@antv/x6'
import './component.less'

export class Component extends React.Component<Component.Props> {
  shouldComponentUpdate() {
    const node = this.props.node
    if (node) {
      if (node.hasChanged('data')) {
        return true
      }
    }

    return false
  }

  onScroller = () => {}

  render() {
    return (
      <div className="react-table">
        <div className="inner">
          <div className="header">Table Name</div>
          <div className="body">
            <div className="body-inner" onScroll={this.onScroller}>
              <ul>
                {Array.from(Array(20).keys()).map((i) => (
                  <li key={i}>column name {i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export namespace Component {
  export interface Props {
    node?: Node
    text: string
  }
}
