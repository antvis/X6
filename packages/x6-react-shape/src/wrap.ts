import React from 'react'
import { Graph, FunctionExt } from '@antv/x6'
import { ReactShape } from './node'
import { Definition } from './registry'

export class Wrap extends React.PureComponent<Wrap.Props, Wrap.State> {
  constructor(props: Wrap.Props) {
    super(props)
    this.state = { tick: 0 }
  }

  componentDidMount() {
    this.props.node.on('change:*', () => {
      // eslint-disable-next-line react/no-access-state-in-setstate
      this.setState({ tick: this.state.tick + 1 })
    })
  }

  clone(elem: React.ReactElement) {
    const { node } = this.props
    return typeof elem.type === 'string'
      ? React.cloneElement(elem)
      : React.cloneElement(elem, { node })
  }

  render() {
    const { graph, node, component } = this.props
    if (React.isValidElement(component)) {
      return this.clone(component)
    }

    if (typeof component === 'function') {
      // Calling the component function on every change of the node.
      const ret = FunctionExt.call(component, graph, node)
      if (React.isValidElement(ret)) {
        return this.clone(ret as React.ReactElement)
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
