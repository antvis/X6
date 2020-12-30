import { computed, ComputedRef, inject } from 'vue'
import { MenuProvider, MenuItemProps } from './menu'

export default function useMenuClass(
  props: MenuItemProps,
  extraCls?: ComputedRef<string>,
) {
  const rootMenu = inject<MenuProvider>('rootMenu')
  // computed
  const baseCls = computed(() => `${rootMenu?.prefixCls.value}-item`)

  return computed(() => {
    const { active, hidden, disabled, className } = props
    return [
      baseCls.value,
      extraCls?.value,
      {
        [`${baseCls.value}-active`]: active,
        [`${baseCls.value}-hidden`]: hidden,
        [`${baseCls.value}-disabled`]: disabled,
      },
      className,
    ]
  })
}
