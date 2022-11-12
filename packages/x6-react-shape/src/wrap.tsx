import React from 'react'
import { Graph } from '@antv/x6'
import { ReactShape } from './node'
import { shapeMaps } from './registry'

export class Wrap extends React.PureComponent<Wrap.Props, Wrap.State> {
  constructor(props: Wrap.Props) {
    super(props)
    this.state = { tick: 0 }
  }

  componentDidMount() {
    const { node } = this.props
    node.on('change:*', ({ key }) => {
      // eslint-disable-next-line react/no-access-state-in-setstate
      const content = shapeMaps[node.shape]
      if (content) {
        const { effect } = content
        if (!effect || effect.includes(key)) {
          this.setState({ tick: this.state.tick + 1 })
        }
      }
    })
  }

  clone(elem: React.ReactElement) {
    const { node, graph } = this.props
    return typeof elem.type === 'string'
      ? React.cloneElement(elem)
      : React.cloneElement(elem, { node, graph })
  }

  render() {
    const { node } = this.props
    const content = shapeMaps[node.shape]

    if (!content) {
      return null
    }

    const { component } = content
    if (React.isValidElement(component)) {
      return this.clone(component)
    }

    const FC = component as any
    return this.clone(<FC />)
  }
}

export namespace Wrap {
  export interface State {
    tick: number
  }

  export interface Props {
    node: ReactShape
    graph: Graph
  }
}
