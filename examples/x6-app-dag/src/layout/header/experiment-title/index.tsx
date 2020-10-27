import React from 'react'
import css from './index.less'

export interface IProps {
  experimentName?: string
}

export const ExperimentTitle: React.FC<IProps> = ({ experimentName }) => {
  return (
    <div className={css.wrap}>
      <span className={css.name}> {experimentName} </span>
    </div>
  )
}
