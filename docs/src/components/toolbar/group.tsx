import React from 'react'
import classnames from 'classnames'

export const ToolbarGroup: React.SFC<ToolbarGroup.Props> = (
  { children, className },
) => (
    <div className={classnames('nb-toolbar-group', className)}>
      {children}
    </div>
  )

export namespace ToolbarGroup {
  export interface Props {
    className?: string
  }
}
