import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'
import { ToolbarItem } from './item'
import { ToolbarGroup } from './group'
import { ToolbarContext } from './context'

export class Toolbar extends React.PureComponent<
  PropsWithChildren<Toolbar.Props>
> {
  onClick = (key: string, value?: any) => {
    if (this.props.onClick) {
      this.props.onClick(key, value)
    }
  }

  render() {
    const { prefixCls, className, children, extra, size, align, hoverEffect } =
      this.props

    const baseCls = `${prefixCls}-toolbar`
    return (
      <div
        className={classNames(baseCls, className, {
          [`${baseCls}-${size}`]: size,
          [`${baseCls}-align-right`]: align === 'right',
          [`${baseCls}-hover-effect`]: hoverEffect,
        })}
      >
        <div className={`${baseCls}-content`}>
          <div className={`${baseCls}-content-inner`}>
            <ToolbarContext.Provider
              value={{
                prefixCls: baseCls,
                onClick: this.onClick,
              }}
            >
              {children}
            </ToolbarContext.Provider>
          </div>
          {extra && <div className={`${baseCls}-content-extras`}>{extra}</div>}
        </div>
      </div>
    )
  }
}

export namespace Toolbar {
  export const Item = ToolbarItem
  export const Group = ToolbarGroup

  export interface Props {
    prefixCls?: string
    className?: string
    extra?: React.ReactNode
    size?: 'small' | 'big'
    hoverEffect?: boolean
    align?: 'left' | 'right'
    onClick?: (name: string, value?: any) => void
  }

  export const defaultProps: Props = {
    prefixCls: 'x6',
    hoverEffect: false,
  }
}
