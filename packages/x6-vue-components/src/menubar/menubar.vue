<template>
  <div :class="[baseCls, props.className]">
    <div :class="`${baseCls}-content`">
      <div :class="`${baseCls}-content-inner`">
        <slot />
      </div>
      <div :class="`${baseCls}-content-extras`">
        <slot name="extra" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, provide } from 'vue'
import { MenubarProvider, MenubarProps } from './menubar'
import useActive from './useActive'

export default defineComponent({
  name: 'X6Menubar',
  componentName: 'X6Menubar',
  props: {
    className: {
      type: String,
    },
    prefixCls: {
      type: String,
      default: 'x6',
    },
  },
  setup(props: MenubarProps) {
    // data
    const {
      actived: menubarActived,
      activeComponent: activeMenubar,
    } = useActive()

    // computed
    const baseCls = computed(() => {
      return `${props.prefixCls}-menubar`
    })

    // methods
    provide<MenubarProvider>('rootMenubar', {
      prefixCls: baseCls,
      activeMenubar,
      menubarActived,
    })

    return {
      baseCls,
      props,
    }
  },
})
</script>
