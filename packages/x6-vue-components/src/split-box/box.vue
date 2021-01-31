<template>
  <div :style="boxStyle" :className="props.className">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import * as CSS from 'csstype'
import { BoxProps } from './splitbox'

export default defineComponent({
  name: 'Box',
  componentName: 'Box',
  props: {
    style: {
      type: Object,
    },
    className: {
      type: String,
    },
    currentSize: {
      type: [String, Number],
    },
    oppositeSize: {
      type: [String, Number],
    },
    index: {
      type: Number,
      validator: (val) => typeof val === 'number' && [1, 2].includes(val),
      required: true,
    },
    vertical: {
      type: Boolean,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      required: true,
    },
  },
  setup(props: BoxProps) {
    // computed
    const boxStyle = computed(() => {
      const style = {
        ...props.style,
        overflow: 'hidden',
        position: 'absolute',
        zIndex: 1,
      } as CSS.Properties
      if (props.vertical) {
        style.bottom = 0
        style.top = 0
      } else {
        style.left = 0
        style.right = 0
      }

      if (props.currentSize != null) {
        if (props.vertical) {
          style.width = props.currentSize + ''
          if (props.index === 1) {
            style.left = 0
          } else {
            style.right = 0
          }
        } else {
          style.height = props.currentSize + ''
          if (props.index === 1) {
            style.top = 0
          } else {
            style.bottom = 0
          }
        }
      } else {
        if (props.vertical) {
          if (props.index === 1) {
            style.left = 0
            style.right = props.oppositeSize + ''
          } else {
            style.left = props.oppositeSize + ''
            style.right = 0
          }
        } else {
          if (props.index === 1) {
            style.top = 0
            style.bottom = props.oppositeSize + ''
          } else {
            style.top = props.oppositeSize + ''
            style.bottom = 0
          }
        }
      }
      return style
    })
    return {
      props,
      boxStyle,
    }
  },
})
</script>
