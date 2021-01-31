<template>
  <div
    :style="splitBoxStyle"
    :class="[
      baseCls,
      `${baseCls}-${props.split}`,
      { [`${baseCls}-disabled`]: !props.resizable },
    ]"
    ref="container"
  >
    <box
      :ref="(item) => (box1Elem = item ? item.$el : item)"
      :key="`box${props.index}`"
      :style="{
        ...props.boxStyle,
        ...(props.primary === 'first'
          ? props.primaryBoxStyle
          : props.secondBoxStyle),
      }"
      :index="1"
      :class="[
        `${baseCls}-item`,
        props.primary === 'first'
          ? `${baseCls}-item-primary`
          : `${baseCls}-item-second`,
      ]"
      :currentSize="box1Size"
      :oppositeSize="box2Size"
      :vertical="isVertical"
      :isPrimary="props.primary === 'first'"
    >
      <slot name="first" />
    </box>
    <resizer
      :ref="(item) => (resizerElem = item ? item.$el : item)"
      key="resizer"
      :style="resizerStyle"
      :class="`${baseCls}-resizer`"
      @click="$emit('resizer-click')"
      @dblclick="$emit('resizer-double-click')"
      @resizer-mouse-down="onMouseDown"
      @resizer-mouse-move="onMouseMove"
      @resizer-mouse-move-end="onMouseMoveEnd"
    />
    <box
      :ref="(item) => (box2Elem = item ? item.$el : item)"
      :key="`box${props.index}`"
      :style="{
        ...props.boxStyle,
        ...(props.primary === 'second'
          ? props.primaryBoxStyle
          : props.secondBoxStyle),
      }"
      :index="2"
      :class="[
        `${baseCls}-item`,
        props.primary === 'second'
          ? `${baseCls}-item-primary`
          : `${baseCls}-item-second`,
      ]"
      :currentSize="box2Size"
      :oppositeSize="box1Size"
      :vertical="isVertical"
      :isPrimary="props.primary === 'second'"
    >
      <slot name="second" />
    </box>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { clamp } from '../util'
import { SplitboxProps } from './splitbox'
import Resizer from './resizer.vue'
import Box from './box.vue'
import * as CSS from 'csstype'

export default defineComponent({
  name: 'X6Splitbox',
  componentName: 'X6Splitbox',
  components: {
    Resizer,
    Box,
  },
  props: {
    split: {
      validator: (val) =>
        typeof val === 'string' && ['vertical', 'horizontal'].includes(val),
      default: 'vertical',
    },
    primary: {
      validator: (val) =>
        typeof val === 'string' && ['first', 'second'].includes(val),
      default: 'first',
    },
    resizable: {
      type: Boolean,
      default: true,
    },
    refresh: {
      type: Boolean,
    },
    size: {
      type: [String, Number],
    },
    minSize: {
      type: Number,
    },
    maxSize: {
      type: Number,
    },
    defaultSize: {
      type: [String, Number],
      default: '25%',
    },
    step: {
      type: Number,
    },
    prefixCls: {
      type: String,
      default: 'x6',
    },
    style: {
      type: Object,
    },
    boxStyle: {
      type: Object,
    },
    primaryBoxStyle: {
      type: Object,
    },
    secondBoxStyle: {
      type: Object,
    },
    resizerStyle: {
      type: Object,
    },
  },
  emits: [
    'resize-start',
    'resizing',
    'resize-end',
    'resizer-click',
    'resizer-double-click',
  ],
  setup(props: SplitboxProps, ctx) {
    //data
    const container = ref<null | HTMLDivElement>(null)
    const box1Elem = ref<null | HTMLDivElement>(null)
    const box2Elem = ref<null | HTMLDivElement>(null)
    let maskElem = ref<null | HTMLDivElement>(null)
    const resizerElem = ref<null | HTMLDivElement>(null)

    let minSize: number
    let maxSize: number
    let curSize: number
    let rawSize: number
    let resizing: boolean

    // computed
    const isPrimaryFirst = computed(() => {
      return props.primary === 'first'
    })
    const isVertical = computed(() => {
      return props.split === 'vertical'
    })
    const box1Size = computed(() => {
      const { size, defaultSize } = props
      let initialSize =
        size != null ? size : defaultSize != null ? defaultSize : '25%'
      if (typeof initialSize === 'number') {
        initialSize = initialSize + 'px'
      }

      const needRefresh = typeof curSize !== 'undefined' && props.refresh
      const resultSize = needRefresh ? curSize : initialSize
      return isPrimaryFirst.value ? resultSize : undefined
    })
    const box2Size = computed(() => {
      const { size, defaultSize } = props
      const initialSize =
        size != null ? size : defaultSize != null ? defaultSize : '25%'
      const needRefresh = typeof curSize !== 'undefined' && props.refresh
      const resultSize = needRefresh ? curSize : initialSize
      return !isPrimaryFirst.value ? resultSize : undefined
    })

    const splitBoxStyle = computed(() => {
      return {
        ...props.style,
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%',
      }
    })
    const baseCls = computed(() => {
      return `${props.prefixCls}-split-box`
    })

    const resizerStyle = computed(() => {
      const style: CSS.Properties = {
        ...props.resizerStyle,
      }

      style.position = 'absolute'
      style.zIndex = 2
      if (isVertical.value) {
        style.top = 0
        style.bottom = 0

        if (props.resizable === true) {
          style.cursor = 'col-resize'
        }

        if (isPrimaryFirst.value) {
          style.left = box1Size.value + ''
        } else {
          style.right = box2Size.value + ''
        }
      } else {
        style.left = 0
        style.right = 0

        if (props.resizable === true) {
          style.cursor = 'row-resize'
        }

        if (isPrimaryFirst.value) {
          style.top = box1Size.value + ''
        } else {
          style.bottom = box2Size.value + ''
        }
      }
      return style
    })

    //methods
    const getDelta = (deltaX: number, deltaY: number) => {
      const { step } = props

      let delta = isVertical.value ? deltaX : deltaY
      if (delta === 0) {
        return 0
      }

      if (step && Math.abs(delta) >= step) {
        delta = ~~(delta / step) * step
      }

      delta = isPrimaryFirst.value ? -delta : delta

      const primaryBox = isPrimaryFirst.value ? box1Elem.value : box2Elem.value
      const secondBox = isPrimaryFirst.value ? box2Elem.value : box1Elem.value
      const box1Order = parseInt(
        window.getComputedStyle(primaryBox!).order!,
        10,
      )
      const box2Order = parseInt(window.getComputedStyle(secondBox!).order!, 10)
      if (box1Order > box2Order) {
        delta = -delta
      }
      return delta
    }

    const getRange = () => {
      const { maxSize, minSize } = props
      const containerRect = container.value?.getBoundingClientRect() as DOMRect
      const containerSize = isVertical.value
        ? containerRect.width
        : containerRect.height

      let newMinSize = minSize !== undefined ? minSize : 0
      let newMaxSize = maxSize !== undefined ? maxSize : 0

      while (newMinSize < 0) {
        newMinSize = containerSize + newMinSize
      }

      while (newMaxSize <= 0) {
        newMaxSize = containerSize + newMaxSize
      }

      return {
        minSize: clamp(newMinSize, 0, containerSize),
        maxSize: clamp(newMaxSize, 0, containerSize),
      }
    }

    const getPrimarySize = () => {
      const primaryBox = isPrimaryFirst.value ? box1Elem.value : box2Elem.value
      return isVertical.value
        ? primaryBox!.getBoundingClientRect().width
        : primaryBox!.getBoundingClientRect().height
    }

    const setPrimarySize = (size: number) => {
      const primaryBox = (isPrimaryFirst.value
        ? box1Elem.value
        : box2Elem.value) as HTMLDivElement
      const secondBox = (isPrimaryFirst.value
        ? box2Elem.value
        : box1Elem.value) as HTMLDivElement
      const resizerElemValue = resizerElem.value as HTMLDivElement

      const value = `${size}px`
      if (isVertical.value) {
        primaryBox.style.width = value
        if (isPrimaryFirst.value) {
          secondBox.style.left = value
          resizerElemValue.style.left = value
        } else {
          secondBox.style.right = value
          resizerElemValue.style.right = value
        }
      } else {
        primaryBox.style.height = value
        if (isPrimaryFirst.value) {
          secondBox.style.top = value
          resizerElemValue.style.top = value
        } else {
          secondBox.style.bottom = value
          resizerElemValue.style.bottom = value
        }
      }
    }

    const updateCursor = (size: number, minSize: number, maxSize: number) => {
      let cursor = ''
      if (isVertical.value) {
        if (size === minSize) {
          cursor = isPrimaryFirst.value ? 'e-resize' : 'w-resize'
        } else if (size === maxSize) {
          cursor = isPrimaryFirst.value ? 'w-resize' : 'e-resize'
        } else {
          cursor = 'col-resize'
        }
      } else {
        if (size === minSize) {
          cursor = isPrimaryFirst.value ? 's-resize' : 'n-resize'
        } else if (size === maxSize) {
          cursor = isPrimaryFirst.value ? 'n-resize' : 's-resize'
        } else {
          cursor = 'row-resize'
        }
      }

      maskElem.value!.style.cursor = cursor
    }

    const createMask = () => {
      const mask = document.createElement('div')
      mask.style.position = 'absolute'
      mask.style.top = '0'
      mask.style.right = '0'
      mask.style.bottom = '0'
      mask.style.left = '0'
      mask.style.zIndex = '9999'
      // document.body.appendChild(mask)
      maskElem = ref(mask)
    }

    const removeMask = () => {
      if (maskElem.value && maskElem.value.parentNode) {
        maskElem.value.parentNode.removeChild(maskElem.value)
      }
    }

    const onMouseDown = () => {
      ;({ maxSize, minSize } = getRange())
      curSize = getPrimarySize()
      rawSize = curSize
      ctx.emit('resize-start')
      resizing = true
      createMask()
      updateCursor(curSize, minSize, maxSize)
    }

    const onMouseMove = (deltaX: number, deltaY: number) => {
      if (props.resizable && resizing) {
        const delta = getDelta(deltaX, deltaY)
        if (delta === 0) {
          return
        }

        if (rawSize < minSize || rawSize > maxSize) {
          rawSize -= delta
          return
        }

        rawSize -= delta
        curSize = rawSize
        curSize = clamp(curSize, minSize, maxSize)

        setPrimarySize(curSize)
        updateCursor(curSize, minSize, maxSize)
        ctx.emit('resizing')
      }
    }

    const onMouseMoveEnd = () => {
      if (props.resizable && resizing) {
        ctx.emit('resize-end', curSize)
        resizing = false
        removeMask()
      }
    }
    return {
      props,
      splitBoxStyle,
      baseCls,
      box1Size,
      box2Size,
      isVertical,
      resizerStyle,
      onMouseMove,
      onMouseMoveEnd,
      onMouseDown,
      container,
      box1Elem,
      box2Elem,
      maskElem,
      resizerElem,
    }
  },
})
</script>
