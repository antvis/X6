import React from 'react'
import classnames from 'classnames'
import { Menu } from './components/menu'
import { Toolbar } from './components/toolbar'
import { Content } from './components/content'
import { DropOverlay } from './components/drop'
import './index.less'

export default class App extends React.Component<App.Props, App.State> {
  state: App.State = {
    file: null,
    tab: 'graph',
    menuVisible: true,
  }

  onToggleMenu = () => {
    this.setState((prevState) => ({
      menuVisible: !prevState.menuVisible,
    }))
  }

  onHideMenu = () => {
    if (this.state.file == null) {
      return
    }
    this.setState({ menuVisible: false })
  }

  onFileChanged = (file: App.File) => {
    this.setState({ file }, this.onHideMenu)
  }

  onTabChanged = (tab: App.Tab) => {
    this.setState({ tab })
  }

  render() {
    return (
      <div className={classnames('app', { dim: this.state.file == null })}>
        <Menu
          visible={this.state.menuVisible}
          onHideMenu={this.onHideMenu}
          onFileChanged={this.onFileChanged}
        />
        <Toolbar
          tab={this.state.tab}
          visible={this.state.file != null}
          onToggleMenu={this.onToggleMenu}
          onTabChanged={this.onTabChanged}
        />
        <Content tab={this.state.tab} file={this.state.file} />
        <DropOverlay onFileChanged={this.onFileChanged} />
      </div>
    )
  }
}

export namespace App {
  export interface File {
    data: string
    name: string
  }

  export type Tab = 'graph' | 'code'

  export interface Props {}

  export interface State {
    file: File | null
    tab: Tab
    menuVisible: boolean
  }
}
