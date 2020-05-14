import { KeyValue } from '../types'

interface Metadata {
  prefixCls: string
  useCSSSelector: boolean
  trackable: boolean
  trackInfo: KeyValue
}

export const Config: Metadata = {
  prefixCls: 'x6',
  trackable: true,
  trackInfo: {},
  useCSSSelector: true,
}
