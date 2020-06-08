import React from 'react'
import { ReactShape } from './node'

export class Wrap extends React.PureComponent<Wrap.Props, Wrap.State> {
  state = { tick: 0 }

  componentDidMount() {
    this.props.node.on('change:*', () => {
      this.setState({ tick: this.state.tick + 1 })
    })
  }

  render() {
    const child = React.Children.only(this.props.children)
    return React.isValidElement(child)
      ? React.cloneElement(child, { node: this.props.node })
      : child
  }
}

export namespace Wrap {
  export interface State {
    tick: number
  }

  export interface Props {
    node: ReactShape
  }
}
