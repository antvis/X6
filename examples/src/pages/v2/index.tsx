import React, { useState } from 'react'
import { Input, Checkbox } from 'antd'
import GraphV2 from './graph'
import Clock from './clock'
import './index.less'

export default () => {
  const [value, setValue] = useState('')
  const [enableTextWrap, setEnableTextWrap] = useState(false)
  const [enableVirtualRender, setEnableVirtualRender] = useState(false)

  return (
    <div>
      <div className={'tools'}>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={20}
        />
        <p>
          {value.length > 10
            ? `1000 节点 ${(value.length - 10) * 100} 边`
            : `${value.length * 100} 节点`}
        </p>
        <Checkbox onChange={(e) => setEnableTextWrap(e.target.checked)}>
          文本截断
        </Checkbox>
        <Checkbox onChange={(e) => setEnableVirtualRender(e.target.checked)}>
          可视区域渲染
        </Checkbox>
      </div>
      <GraphV2
        enableTextWrap={enableTextWrap}
        enableVirtualRender={enableVirtualRender}
        length={value.length}
      />
      <Clock />
    </div>
  )
}
