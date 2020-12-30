<template>
  <div :class="`${prefixCls}-item ${prefixCls}-item-divider`" />
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { MenuProps, MenuProvider } from './menu'

export default defineComponent({
  name: 'X6MenuDivider',
  componentName: 'X6MenuDivider',
  setup(props: MenuProps, ctx) {
    // inject
    const rootMenu = inject<MenuProvider>('rootMenu')

    // computed
    const prefixCls = computed(() => {
      return `${rootMenu?.prefixCls.value}`
    })

    return {
      prefixCls: prefixCls,
    }
  },
})
</script>
