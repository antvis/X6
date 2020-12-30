import { Ref } from 'vue'

export interface MenubarProvider {
  prefixCls: Ref<string>
  activeMenubar: () => void
  menubarActived: Ref<boolean>
}

export interface MenubarProps {
  prefixCls?: string
  className?: string
}

export interface MenubarItemProps {
  text: string
  hidden?: boolean
}
