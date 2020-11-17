import React from 'react'
import { ApartmentOutlined } from '@ant-design/icons'
import css from './index.less'

interface Props {
  border?: boolean
}

export const SimpleLogo: React.FC<Props> = ({ border }) => {
  return (
    <div className={`${css.root} `}>
      <ApartmentOutlined className={css.logo} />
    </div>
  )
}
