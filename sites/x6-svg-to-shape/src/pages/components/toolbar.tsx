import React from 'react'
import classnames from 'classnames'
import { App } from '../index'
import './toolbar.less'

export class Toolbar extends React.Component<Toolbar.Props, Toolbar.State> {
  render() {
    const tool = this.props.tab
    return (
      <div className={classnames('toolbar', { hidden: !this.props.visible })}>
        <div className="toggle" onClick={this.props.onToggleMenu}>
          <svg viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
        </div>
        <ul>
          <li
            className={classnames({ active: tool === 'graph' })}
            onClick={() => this.props.onTabChanged('graph')}
          >
            Graph
          </li>
          <li
            className={classnames({ active: tool === 'code' })}
            onClick={() => this.props.onTabChanged('code')}
          >
            Code
          </li>
        </ul>
      </div>
    )
  }
}

export namespace Toolbar {
  export interface Props {
    tab: App.Tab
    visible: boolean
    onToggleMenu: () => void
    onTabChanged: (tab: App.Tab) => void
  }

  export interface State {}
}
