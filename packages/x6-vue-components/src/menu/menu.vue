<template>
  <div
    :class="[
      baseCls,
      { [`${baseCls}-has-icon`]: props.hasIcon },
      props.className,
    ]"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, provide, PropType } from 'vue'
import { MenuProps, MenuProvider } from './menu'

export default defineComponent({
  name: 'X6Menu',
  componentName: 'X6Menu',
  props: {
    prefixCls: {
      type: String,
      default: 'x6',
    },
    className: {
      type: String,
    },
    hasIcon: {
      type: Boolean,
      default: false,
    },
    // 考虑 emit
    registerHotkey: {
      type: Function as PropType<(hotkey: string, handler: () => any) => void>,
    },
    unregisterHotkey: {
      type: Function as PropType<(hotkey: string, handler: () => any) => void>,
    },
  },
  emits: ['click'],
  setup(props: MenuProps, ctx) {
    // computed
    const baseCls = computed(() => {
      return `${props.prefixCls}-menu`
    })

    // methods
    const onClick = (name: string, e?: MouseEvent) => {
      if (props.stopPropagation && e != null) {
        e.stopPropagation()
      }
      ctx.emit('click', name)
    }

    const registerHotkey = (hotkey: string, handler: () => any) => {
      if (props.registerHotkey) {
        props.registerHotkey(hotkey, handler)
      }
    }

    const unregisterHotkey = (hotkey: string, handler: () => any) => {
      if (props.unregisterHotkey) {
        props.unregisterHotkey(hotkey, handler)
      }
    }

    provide<MenuProvider>(`rootMenu`, {
      prefixCls: baseCls,
      onClick: onClick,
      registerHotkey: registerHotkey,
      unregisterHotkey: unregisterHotkey,
    })

    return {
      baseCls,
      props,
    }
  },
})
</script>
