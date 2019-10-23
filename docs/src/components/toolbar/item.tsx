import React from 'react'
import classnames from 'classnames'
import { Tooltip } from 'antd'
import { TooltipProps } from 'antd/lib/tooltip'
import { Icon } from '../icon'
import { Menu } from '../menu'
import { Dropdown } from '../dropdown'
import { ToolbarContext } from './context'

export class ToolbarItem extends React.PureComponent<ToolbarItem.Props>{
  handleClick = () => {
    if (!this.props.disabled && !this.props.dropdown) {
      this.context.onClick(this.props.name)
      if (this.props.onClick) {
        this.props.onClick(this.props.name as string)
      }
    }
  }

  handleDropdownItemClick = (name: string) => {
    this.context.onClick(name)
    if (this.props.onClick) {
      this.props.onClick(name)
    }
  }

  renderButton() {
    const {
      className, hidden, disabled, active, icon, text, children,
      dropdown, tooltip, tooltipProps, tooltipAsTitle,
    } = this.props

    const props: any = {
      onClick: this.handleClick,
      className: classnames(
        'x6-toolbar-item',
        {
          'x6-toolbar-item-hidden': hidden,
          'x6-toolbar-item-active': active,
          'x6-toolbar-item-disabled': disabled,
          'x6-toolbar-item-dropdown': dropdown,
        },
        className,
      ),
    }

    if (tooltip && tooltipAsTitle) {
      props.title = tooltip
    }

    const button = (
      <button {...props}>
        {
          icon && (
            <span className="x6-toolbar-item-icon">
              {
                typeof icon === 'string'
                  ? (<Icon icon={icon as string} />)
                  : (icon)
              }
            </span>
          )
        }
        {
          (text || children) && (
            <span className="x6-toolbar-item-text">
              {text || children}
            </span>
          )
        }
      </button>
    )

    if (tooltip && !tooltipAsTitle) {
      return (
        <Tooltip
          title={tooltip}
          placement="bottom"
          mouseEnterDelay={0}
          mouseLeaveDelay={0}
          {...tooltipProps}
        >
          {button}
        </Tooltip>
      )
    }

    return button
  }

  render() {
    const { dropdown, dropdownProps, disabled } = this.props
    const content = this.renderButton()

    if (dropdown && !disabled) {
      const props = {
        trigger: ['click'],
        ...dropdownProps,
        disabled,
        overlay: (dropdown && dropdown.type === Menu)
          ? React.cloneElement(dropdown, { onClick: this.handleDropdownItemClick })
          : dropdown,
      } as Dropdown.Props

      return (
        <Dropdown {...props}>
          {content}
        </Dropdown>
      )
    }

    return content
  }
}

export namespace ToolbarItem {
  export const contextType = ToolbarContext

  export interface Props {
    name?: string
    icon?: string | React.ReactNode
    text?: string | React.ReactNode
    hidden?: boolean
    disabled?: boolean
    active?: boolean
    className?: string
    children?: React.ReactNode
    tooltip?: string
    tooltipProps?: TooltipProps
    tooltipAsTitle?: boolean
    dropdown?: any
    dropdownProps?: Dropdown.Props
    onClick?: (name: string) => void
  }
}
