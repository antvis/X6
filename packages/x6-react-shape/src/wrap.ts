import React from 'react'
import { ReactShape } from './node'
import { Definition } from './registry'
import { Graph, FunctionExt } from '@antv/x6'

export class Wrap extends React.PureComponent<Wrap.Props, Wrap.State> {
  state = { tick: 0 }

  componentDidMount() {
    this.props.node.on('change:*', () => {
      this.setState({ tick: this.state.tick + 1 })
    })
  }

  render() {
    const { graph, node, component } = this.props
    if (React.isValidElement(component)) {
      return React.cloneElement(component, { node })
    }

    if (typeof component === 'function') {
      // Calling the component function on every change of the node.
      const ret = FunctionExt.call(component, graph, node)
      if (React.isValidElement(ret)) {
        return React.cloneElement(ret as React.ReactElement, { node })
      }
    }

    return component
  }
}

export namespace Wrap {
  export interface State {
    tick: number
  }

  export interface Props {
    node: ReactShape
    graph: Graph
    component: Definition
  }
}
