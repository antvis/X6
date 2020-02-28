import { KeyValue } from '../../types'

const prefixCls = 'x6'

export interface GlobalConfig {
  prefixCls: string
  useCSSSelector: boolean
  trackable: boolean
  trackInfo: KeyValue
  className: KeyValue<string>
}

// tslint:disable-next-line
export const Globals: GlobalConfig = {
  prefixCls,
  trackable: true,
  trackInfo: {},
  useCSSSelector: true,
  className: {
    node: `${prefixCls}-node`,
  },
}
