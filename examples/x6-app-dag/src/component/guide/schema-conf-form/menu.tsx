import React, { useCallback } from 'react';
import styles from './menu.less';

interface MenuData {
  key: string;
  name: string;
  icon?: string;
}

interface Props {
  menus: MenuData[];
  onChangeMenu: (key: string) => void;
}

export const Menu: React.FC<Props> = (props) => {
  const { menus, onChangeMenu } = props;

  const onChange = useCallback(
    (key: string) => () => {
      onChangeMenu(key);
    },
    [onChangeMenu],
  );

  return (
    <ul className={styles.menu}>
      {menus.map((menu) => {
        const { name, key } = menu;
        return (
          <li className={styles.menuItem} onClick={onChange(key)}>
            {name}
          </li>
        );
      })}
    </ul>
  );
};
