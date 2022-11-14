import React, { PropsWithChildren } from 'react'
import classnames from 'classnames'
import addEventListener from 'rc-util/lib/Dom/addEventListener'
import { MenubarItem } from './item'
import { MenubarContext } from './context'

export class Menubar extends React.PureComponent<
  PropsWithChildren<Menubar.Props>,
  Menubar.State
> {
  private removeDocClickEvent: (() => void) | null

  constructor(props: Menubar.Props) {
    super(props)
    this.state = { active: false }
  }

  componentWillUnmount() {
    this.unbindDocEvent()
  }

  onDocumentClick = () => {
    this.setState({ active: false })
    this.unbindDocEvent()
  }

  unbindDocEvent() {
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
    const { prefixCls, className, children, extra } = this.props
    const baseCls = `${prefixCls}-menubar`
    const contextValue: MenubarContext.Contexts = {
      prefixCls: baseCls,
      activeMenubar: this.activeMenubar,
      menubarActived: this.state.active === true,
    }

    return (
      <div className={classnames(baseCls, className)}>
        <div className={`${baseCls}-content`}>
          <div className={`${baseCls}-content-inner`}>
            <MenubarContext.Provider value={contextValue}>
              {children}
            </MenubarContext.Provider>
          </div>
          {extra && <div className={`${baseCls}-content-extras`}>{extra}</div>}
        </div>
      </div>
    )
  }
}

export namespace Menubar {
  export const Item = MenubarItem

  export interface Props {
    prefixCls?: string
    className?: string
    extra?: React.ReactNode
  }

  export interface State {
    active?: boolean
  }

  export const defaultProps: Props = {
    prefixCls: 'x6',
  }
}
