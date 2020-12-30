<template>
  <div :class="classNames">
    <button :class="`${baseCls}-button`" @click="onClick">
      <span
        v-if="props.iconClass"
        :class="[`${baseCls}-icon`, props.iconClass]"
      />
      <span :class="`${baseCls}-text`">
        {{ props.text }}
        <slot v-if="!props.text" />
      </span>
      <span v-if="props.hotkey" :class="`${baseCls}-hotkey`">{{
        props.hotkey
      }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  PropType,
  VNode,
  inject,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { MenuItemProps, MenuProvider } from './menu'
import useMenuClass from './useMenuClass'

export default defineComponent({
  name: 'X6MenuItem',
  componentName: 'X6MenuItem',
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
      return `${rootMenu?.prefixCls.value}-item`
    })
    const classNames = useMenuClass(props)

    // methods
    function triggerHandler(e?: MouseEvent) {
      if (!props.disabled && !props.hidden) {
        if (props.name) {
          rootMenu?.onClick(props.name, e)
        }
        ctx.emit('click')
      }
    }

    const onHotkey = () => {
      triggerHandler()
    }

    const onClick = (e: MouseEvent) => {
      triggerHandler(e)
    }

    // lifecycle
    onMounted(() => {
      const { hotkey } = props
      if (hotkey) {
        rootMenu?.registerHotkey(hotkey, onHotkey)
      }
    })

    onBeforeUnmount(() => {
      const { hotkey } = props
      if (hotkey) {
        rootMenu?.unregisterHotkey(hotkey, onHotkey)
      }
    })

    return {
      classNames,
      onClick,
      baseCls,
      props,
    }
  },
})
</script>
