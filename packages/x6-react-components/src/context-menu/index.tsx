import React, { PropsWithChildren } from 'react'
import { Dropdown } from '../dropdown'

export class ContextMenu extends React.PureComponent<
  PropsWithChildren<ContextMenu.Props>
> {
  render() {
    const { children, menu, overlay, ...props } = this.props
    return (
      <Dropdown {...props} overlay={menu || overlay} trigger="contextMenu">
        {children}
      </Dropdown>
    )
  }
}

export namespace ContextMenu {
  export interface Props extends Dropdown.Props {
    menu: string | React.ReactNode
  }
}
