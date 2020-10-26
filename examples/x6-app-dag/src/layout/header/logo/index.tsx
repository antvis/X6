import React from 'react';
import { ReactComponent as BrandImage } from '@/icons/logo.icon.svg';
import css from './index.less';

interface Props {
  border?: boolean;
}

export const SimpleLogo: React.FC<Props> = ({ border }) => {
  return (
    <div className={`${css.root} `}>
      <BrandImage className={css.logo} width="30px" height="30px" />
    </div>
  );
};
