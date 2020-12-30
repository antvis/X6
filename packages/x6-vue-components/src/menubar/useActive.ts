import { ref, onUnmounted } from 'vue'
import addEventListener from '../util/addEventListener'

export default function useActive() {
  let removeDocClickEvent: (() => void) | null = null
  const actived = ref(false)

  const unbindDocEvent = () => {
    if (removeDocClickEvent) {
      removeDocClickEvent()
      removeDocClickEvent = null
    }
  }

  const deactive = () => {
    actived.value = false
    unbindDocEvent()
  }

  const activeComponent = () => {
    actived.value = true
    if (!removeDocClickEvent) {
      removeDocClickEvent = addEventListener(
        document.documentElement,
        'click',
        deactive,
        { capture: true },
      ).remove
    }
  }
  onUnmounted(() => {
    unbindDocEvent()
  })

  return {
    actived,
    activeComponent,
    deactive,
  }
}
