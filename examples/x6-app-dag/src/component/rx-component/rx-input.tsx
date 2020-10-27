import React from 'react'
import { Observable } from 'rxjs'
import { Input, ConfigProvider } from 'antd'
import { InputProps } from 'antd/es/input'
import { useObservableState } from '@/common/hooks/useObservableState'
import { ANT_PREFIX } from '@/constants/global'

interface RxInputProps extends Omit<InputProps, 'value'> {
  value: Observable<string>
}

export const RxInput: React.FC<RxInputProps> = (props) => {
  const { value, ...otherProps } = props
  const [realValue] = useObservableState(() => value)
  return (
    <ConfigProvider prefixCls={ANT_PREFIX}>
      <Input value={realValue} {...otherProps} />
    </ConfigProvider>
  )
}
