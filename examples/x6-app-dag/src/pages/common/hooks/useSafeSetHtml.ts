import { useEffect, MutableRefObject } from 'react'
import DOMPurify from 'dompurify'

export const useSafeSetHTML = (
  ref: MutableRefObject<Element | null>,
  htmlStr: string = '',
) => {
  useEffect(() => {
    if (ref?.current instanceof Element && typeof htmlStr === 'string') {
      // eslint-disable-next-line no-param-reassign
      ref.current.innerHTML = DOMPurify.sanitize(htmlStr)
    }
  }, [htmlStr])
}
