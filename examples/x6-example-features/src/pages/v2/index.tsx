import React, { useState } from 'react'
import GraphV1 from './graph-v1'
import GraphV2 from './graph-v2'
import Clock from './clock'
import { Input, Radio, Checkbox } from 'antd'
import './index.less'

export default () => {
  const [value, setValue] = useState('')
  const [version, setVersion] = useState('v1')
  const [enableTextWrap, setEnableTextWrap] = useState(false)
  const [enableVirtualRender, setEnableVirtualRender] = useState(false)

  const onChangeVersion = (val: string) => {
    setValue('')
    setVersion(val)
  }

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
        <Radio.Group
          onChange={(e) => onChangeVersion(e.target.value)}
          value={version}
        >
          <Radio value={'v1'}>V1</Radio>
          <Radio value={'v2'}>V2</Radio>
        </Radio.Group>
        <Checkbox onChange={(e) => setEnableTextWrap(e.target.checked)}>
          文本截断
        </Checkbox>
        <Checkbox onChange={(e) => setEnableVirtualRender(e.target.checked)}>
          可视区域渲染
        </Checkbox>
      </div>
      {version === 'v1' ? (
        <GraphV1 enableTextWrap={enableTextWrap} length={value.length} />
      ) : (
        <GraphV2
          enableTextWrap={enableTextWrap}
          enableVirtualRender={enableVirtualRender}
          length={value.length}
        />
      )}
      <Clock />
    </div>
  )
}
