import React from 'react'
import classnames from 'classnames'
import addEventListener from 'rc-util/lib/Dom/addEventListener'
import { MenubarContext } from './context'

export class MenubarItem extends React.PureComponent<MenubarItem.Props, MenubarItem.State> {
  private popupClassName = 'nb-menubar-item-dropdown'
  private removeDocClickEvent: (() => void) | null

  state = { active: false }

  onDocumentClick = () => {
    this.deactive()
  }

  onClick = (e: React.MouseEvent) => {
    this.context.activeMenubar()
    this.removeDeactive(e.currentTarget.parentElement)
    this.active()
  }

  isPrevMenuHiddening(e: React.MouseEvent): boolean {
    const toElement = (e.nativeEvent as any).toElement
    if (toElement && toElement.className === this.popupClassName) {
      return true
    }

    const currentTarget = e.currentTarget as HTMLDivElement
    const childNodes = currentTarget.parentElement!.childNodes
    for (let i = 0, l = childNodes.length; i < l; i += 1) {
      const child = childNodes[i] as HTMLDivElement
      const popupElem = child.querySelector(`.${this.popupClassName}`)!
      if (popupElem.contains(toElement)) {
        return true
      }
    }

    return false
  }

  onMouseEnter = (e: React.MouseEvent) => {
    if (this.context.menubarActived && !this.state.active && !this.isPrevMenuHiddening(e)) {
      const currentTarget = e.currentTarget as HTMLDivElement
      const childNodes = currentTarget.parentElement!.childNodes

      childNodes.forEach((child) => {
        if (child === currentTarget) {
          this.removeDeactive(child)
        } else {
          this.callDeactive(child)
        }
      })

      this.active()
    }
  }

  onMouseLeave = (e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget
    const currentTarget = e.currentTarget as HTMLDivElement

    if (this.context.menubarActived && this.state.active && !this.isPrevMenuHiddening(e)) {
      const childNodes = currentTarget.parentElement!.childNodes
      let shoudDeactive = false
      if (relatedTarget !== window) {
        for (let i = 0, l = childNodes.length; i < l; i += 1) {
          const child = childNodes[i]
          if (child === relatedTarget || child.contains(relatedTarget as HTMLDivElement)) {
            shoudDeactive = true
            break
          }
        }
      }

      if (shoudDeactive) {
        this.deactive()
      } else {
        // 缓存一下，当再次 hover 到其他菜单时被调用
        this.cacheDeactive(currentTarget)
      }
    }
  }

  cacheDeactive(elem: any) {
    elem.DEACTIVE = this.deactive
  }

  callDeactive(elem: any) {
    if (elem.DEACTIVE) {
      elem.DEACTIVE()
      delete elem.DEACTIVE
    }
  }

  removeDeactive(elem: any) {
    delete elem.DEACTIVE
  }

  active = () => {
    this.setState({ active: true })
    if (!this.removeDocClickEvent) {
      this.removeDocClickEvent = addEventListener(
        document.documentElement,
        'click',
        this.onDocumentClick,
      ).remove
    }
  }

  deactive = () => {
    this.setState({ active: false })
    if (this.removeDocClickEvent) {
      this.removeDocClickEvent()
      this.removeDocClickEvent = null
    }
  }

  render() {
    const { text, children, hidden } = this.props
    const { menubarActived } = this.context
    const currentMenuActived = menubarActived && this.state.active

    return (
      <div
        className={classnames('nb-menubar-item', {
          'nb-menubar-item-hidden': hidden,
          'nb-menubar-item-hover': menubarActived,
          'nb-menubar-item-active': currentMenuActived,
        })}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div
          className={classnames('nb-menubar-item-text', {
            'nb-menubar-item-text-active': currentMenuActived,
          })}
          onClick={this.onClick}
        >
          {text}
        </div>
        <div className={this.popupClassName}>
          {children}
        </div>
      </div>
    )
  }
}

export namespace MenubarItem {
  export const contextType = MenubarContext

  export interface Props {
    text: string
    hidden?: boolean
  }

  export interface State {
    active?: boolean
  }
}
