<template>
  <div
    :style="props.style"
    :className="props.className"
    @mouseDown="onMouseDown"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount } from 'vue'
import { MouseMoveTracker } from '../util/dom/MouseMoveTracker'
import { ResizerProps } from './splitbox'

export default defineComponent({
  name: 'Resizer',
  componentName: 'Resizer',
  props: {
    className: {
      type: String,
    },
    style: {
      type: Object,
    },
  },
  emits: ['resizer-mouse-move-end', 'resizer-mouse-move', 'resizer-mouse-down'],
  setup(props: ResizerProps, ctx) {
    // data
    let mouseMoveTracker: MouseMoveTracker
    // methods
    const onMouseMoveEnd = () => {
      mouseMoveTracker.release()
      ctx.emit('resizer-mouse-move-end')
    }

    const onMouseDown = (e: MouseEvent) => {
      mouseMoveTracker.capture(e)
      ctx.emit('resizer-mouse-down', e)
    }

    const onMouseMove = (
      deltaX: number,
      deltaY: number,
      pos?: MouseMoveTracker.ClientPosition,
    ) => {
      ctx.emit('resizer-mouse-move', deltaX, deltaY, pos)
    }
    mouseMoveTracker = new MouseMoveTracker({
      onMouseMove,
      onMouseMoveEnd,
    })

    // lifecycle
    onBeforeUnmount(() => {
      mouseMoveTracker.release()
    })

    return {
      props,
      onMouseDown,
    }
  },
})
</script>
