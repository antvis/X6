import React from 'react'
import classNames from 'classnames'
import { ToolbarContext } from './context'

export const ToolbarGroup: React.SFC<ToolbarGroup.Props> = ({
  children,
  className,
}) => (
  <ToolbarContext.Consumer>
    {({ prefixCls }) => (
      <div className={classNames(`${prefixCls}-group`, className)}>
        {children}
      </div>
    )}
  </ToolbarContext.Consumer>
)

// eslint-disable-next-line @typescript-eslint/no-redeclare
export namespace ToolbarGroup {
  export interface Props {
    className?: string
  }
}
