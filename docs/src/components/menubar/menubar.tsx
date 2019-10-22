import React from 'react'
import classnames from 'classnames'
import addEventListener from 'rc-util/lib/Dom/addEventListener'
import { MenubarItem } from './item'
import { MenubarContext } from './context'
import './menubar.less'

export class Menubar extends React.PureComponent<Menubar.Props, Menubar.State> {
  private removeDocClickEvent: (() => void) | null

  state = { active: false }

  onDocumentClick = () => {
    this.setState({ active: false })
    if (this.removeDocClickEvent) {
      this.removeDocClickEvent()
      this.removeDocClickEvent = null
    }
  }

  activeMenubar = () => {
    this.setState({ active: true })
    if (!this.removeDocClickEvent) {
      this.removeDocClickEvent = addEventListener(
        document.documentElement,
        'click',
        this.onDocumentClick,
      ).remove
    }
  }

  render() {
    const { className, children, extra } = this.props
    const ContextProvider = MenubarContext.Provider
    const contextValue: MenubarContext.Contexts = {
      activeMenubar: this.activeMenubar,
      menubarActived: this.state.active,
    }

    return (
      <div className={classnames('nb-menubar', className)}>
        <div className="nb-menubar-content">
          <div className="nb-menubar-content-inner">
            <ContextProvider value={contextValue}>
              {children}
            </ContextProvider>
          </div>
          {extra && (<div className="nb-menubar-content-extras">{extra}</div>)}
        </div>
      </div>
    )
  }
}

export namespace Menubar {
  export const Item = MenubarItem
  export const Context = MenubarContext

  export interface Props {
    className?: string
    extra?: React.ReactNode
  }

  export interface State {
    active?: boolean
  }
}
