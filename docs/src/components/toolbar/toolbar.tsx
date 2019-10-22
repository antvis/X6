import React from 'react'
import classnames from 'classnames'
import { ToolbarItem } from './item'
import { ToolbarGroup } from './group'
import { ToolbarContext } from './context'
import './toolbar.less'

export class Toolbar extends React.PureComponent<Toolbar.Props>{
  onClick = (key: string, value?: any) => {
    if (this.props.onClick) {
      this.props.onClick(key, value)
    }
  }

  render() {
    const { className, children, extra, size, hoverEffect } = this.props
    const ContextProvider = ToolbarContext.Provider
    const contextValue: ToolbarContext.Contexts = {
      onClick: this.onClick,
    }

    return (
      <div
        className={classnames('nb-toolbar', className, {
          [`nb-toolbar-${size}`]: size,
          ['nb-toolbar-hover-effect']: hoverEffect,
        })}
      >
        <div className="nb-toolbar-content">
          <div className="nb-toolbar-content-inner">
            <ContextProvider value={contextValue}>
              {children}
            </ContextProvider>
          </div>
          {extra && (<div className="nb-toolbar-content-extras">{extra}</div>)}
        </div>
      </div>
    )
  }
}

export namespace Toolbar {
  export const Item = ToolbarItem
  export const Group = ToolbarGroup
  export const Context = ToolbarContext

  export interface Props {
    className?: string
    extra?: React.ReactNode
    size?: 'small' | 'mini'
    hoverEffect?: boolean
    onClick?: (name: string, value?: any) => void
  }
}
