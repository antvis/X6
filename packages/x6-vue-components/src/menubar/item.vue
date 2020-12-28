<template>
  <div
    :class="[
      baseCls,
      {
        [`${baseCls}-hidden`]: props.hidden,
        [`${baseCls}-hover`]: rootMenubar.menubarActived.value,
        [`${baseCls}-active`]: currentMenuActived,
      },
    ]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div
      :class="[
        `${baseCls}-text`,
        {
          [`${baseCls}-text-active`]: currentMenuActived,
        },
      ]"
      @click="onClick"
    >
      {{ props.text }}
    </div>
    <div :class="popupClassName">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, inject } from 'vue'
import { MenubarProvider, MenubarItemProps } from './menubar'
import useActive from './useActive'

const cacheDeactiveMap = new WeakMap()

export default defineComponent({
  name: 'X6MenubarItem',
  componentName: 'X6MenubarItem',
  props: {
    hidden: {
      type: Boolean,
    },
    text: {
      type: String,
      default: '',
    },
  },
  setup(props: MenubarItemProps) {
    const {
      actived: itemActived,
      activeComponent: activeItem,
      deactive,
    } = useActive()

    const rootMenubar = inject<MenubarProvider>('rootMenubar')

    // computed
    const popupClassName = computed(() => {
      return `${rootMenubar?.prefixCls.value}-item-dropdown`
    })
    const baseCls = computed(() => {
      return `${rootMenubar?.prefixCls.value}-item`
    })
    const currentMenuActived = computed(() => {
      return rootMenubar?.menubarActived.value && itemActived.value
    })

    // methods
    const onClick = (e: Event) => {
      rootMenubar?.activeMenubar()
      removeDeactive((e as any).currentTarget.parentElement)
      activeItem()
    }

    const onMouseEnter = (e: MouseEvent) => {
      if (rootMenubar?.menubarActived.value && !itemActived.value) {
        const currentTarget = e.currentTarget as HTMLDivElement
        const childNodes = currentTarget.parentElement!.childNodes
        childNodes.forEach((child) => {
          if (child !== currentTarget) {
            callDeactive(child)
          }
        })
        activeItem()
      }
    }

    const onMouseLeave = (e: MouseEvent) => {
      const currentTarget = e.currentTarget as HTMLDivElement
      cacheDeactive(currentTarget)
    }

    const cacheDeactive = (elem: Node) => {
      if (!cacheDeactiveMap.has(elem)) {
        cacheDeactiveMap.set(elem, deactive)
      }
    }

    const callDeactive = (elem: Node) => {
      if (cacheDeactiveMap.has(elem)) {
        cacheDeactiveMap.get(elem)()
        cacheDeactiveMap.delete(elem)
      }
    }

    const removeDeactive = (elem: Node) => {
      cacheDeactiveMap.delete(elem)
    }

    return {
      baseCls,
      rootMenubar,
      onMouseEnter,
      onMouseLeave,
      currentMenuActived,
      onClick,
      popupClassName,
      props,
    }
  },
})
</script>
