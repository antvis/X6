<template>
  <div :class="classNames">
    <button :class="`${itemBaseCls}-button`" @click="onClick">
      <span
        v-if="props.iconClass"
        :class="[`${itemBaseCls}-icon`, props.iconClass]"
      />
      <span :class="`${itemBaseCls}-text`">
        {{ props.text }}
        <slot v-if="!props.text" />
      </span>
      <span v-if="props.hotkey" :class="`${itemBaseCls}-hotkey`">{{
        props.hotkey
      }}</span>
      <span :class="`${baseCls}-arrow`" />
    </button>
    <div :class="`${baseCls}-menu`">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, VNode, inject } from 'vue'
import { MenuItemProps, MenuProvider } from './menu'
import useMenuClass from './useMenuClass'

export default defineComponent({
  name: 'X6SubmenuItem',
  componentName: 'X6SubmenuItem',
  props: {
    className: {
      type: String,
    },
    name: {
      type: String,
    },
    iconClass: {
      type: String,
    },
    text: {
      type: [String, Object] as PropType<string | VNode>,
    },
    hotkey: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup(props: MenuItemProps, ctx) {
    // inject
    const rootMenu = inject<MenuProvider>('rootMenu')

    // computed
    const baseCls = computed(() => {
      return `${rootMenu?.prefixCls.value}-submenu`
    })
    const itemBaseCls = computed(() => {
      return `${rootMenu?.prefixCls.value}-item`
    })
    const classNames = useMenuClass(props, baseCls)

    // methods
    function triggerHandler(e?: MouseEvent) {
      if (!props.disabled && !props.hidden) {
        ctx.emit('click')
      }
    }

    const onClick = (e: MouseEvent) => {
      triggerHandler(e)
    }

    return {
      classNames,
      onClick,
      baseCls,
      itemBaseCls,
      props,
    }
  },
})
</script>
