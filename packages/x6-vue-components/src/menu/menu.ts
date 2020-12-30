import { VNode, ComputedRef } from 'vue'

export interface MenuProps {
  prefixCls?: string
  className?: string
  hasIcon?: boolean
  stopPropagation?: boolean
  registerHotkey?: (hotkey: string, handler: () => void) => void
  unregisterHotkey?: (hotkey: string, handler: () => void) => void
}
export interface MenuItemProps {
  className?: string
  name?: string
  iconClass?: string
  text?: string | VNode
  hotkey?: string
  active?: boolean
  hidden?: boolean
  disabled?: boolean
}

export interface MenuProvider {
  prefixCls: ComputedRef<string>
  onClick: (name: string, e?: MouseEvent) => void
  registerHotkey: (hotkey: string, handler: () => any) => void
  unregisterHotkey: (hotkey: string, handler: () => any) => void
}
