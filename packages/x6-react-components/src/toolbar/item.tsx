import React from 'react'
import classNames from 'classnames'
import { Tooltip } from 'antd'
import { TooltipProps } from 'antd/es/tooltip'
import { Menu } from '../menu'
import { Dropdown } from '../dropdown'
import { ToolbarContext } from './context'

class ToolbarItemInner extends React.PureComponent<ToolbarItemInner.Props> {
  handleClick = () => {
    this.processClick()
  }

  handleDropdownItemClick = (name?: string) => {
    this.processClick(name, false)
  }

  processClick(name = this.props.name, dropdown = this.props.dropdown) {
    if (!this.props.disabled && !dropdown) {
      if (name) {
        this.props.context.onClick(name)
      }

      if (this.props.onClick) {
        this.props.onClick(name)
      }
    }
  }

  renderButton() {
    const {
      className,
      hidden,
      disabled,
      active,
      icon,
      text,
      dropdown,
      dropdownArrow,
      tooltip,
      tooltipProps,
      tooltipAsTitle,
      children,
    } = this.props
    const { prefixCls } = this.props.context

    const baseCls = `${prefixCls}-item`
    const props: any = {
      onClick: this.handleClick,
      className: classNames(
        baseCls,
        {
          [`${baseCls}-hidden`]: hidden,
          [`${baseCls}-active`]: active,
          [`${baseCls}-disabled`]: disabled,
          [`${baseCls}-dropdown`]: dropdown,
        },
        className,
      ),
    }

    if (tooltip && tooltipAsTitle) {
      props.title = tooltip
    }

    const button = (
      <button type="button" {...props}>
        {icon && React.isValidElement(icon) && (
          <span className={`${baseCls}-icon`}>{icon}</span>
        )}
        {(text || children) && (
          <span className={`${baseCls}-text`}>{text || children}</span>
        )}
        {dropdown && dropdownArrow && (
          <span className={`${baseCls}-dropdown-arrow`} />
        )}
      </button>
    )

    if (tooltip && !tooltipAsTitle && !disabled) {
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

    if (dropdown != null && !disabled) {
      const overlay = (
        <div>
          {dropdown.type === Menu
            ? React.cloneElement(dropdown, {
                onClick: this.handleDropdownItemClick,
              })
            : dropdown}
        </div>
      )

      const props = {
        trigger: ['click'],
        ...dropdownProps,
        disabled,
        overlay,
      } as Dropdown.Props

      return <Dropdown {...props}>{content}</Dropdown>
    }

    return content
  }
}

namespace ToolbarItemInner {
  export interface Props extends ToolbarItem.Props {
    context: ToolbarContext.Contexts
  }
}

export const ToolbarItem: React.SFC<ToolbarItem.Props> = (props) => (
  <ToolbarContext.Consumer>
    {(context) => <ToolbarItemInner context={context} {...props} />}
  </ToolbarContext.Consumer>
)

ToolbarItem.defaultProps = {
  dropdownArrow: true,
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export namespace ToolbarItem {
  export interface Props {
    className?: string
    name?: string
    icon?: React.ReactNode
    text?: string | React.ReactNode
    hidden?: boolean
    disabled?: boolean
    active?: boolean
    children?: React.ReactNode
    tooltip?: string
    tooltipProps?: TooltipProps
    tooltipAsTitle?: boolean
    dropdown?: any
    dropdownArrow?: boolean
    dropdownProps?: Dropdown.Props
    onClick?: (name?: string) => void
  }
}
