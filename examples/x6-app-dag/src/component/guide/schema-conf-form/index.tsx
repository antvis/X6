import React from 'react';
import styles from './index.less';

interface Props {
  schema: any;
  formValues: any;
}

export const SchemaConfForm: React.FC<Props> = () => {
  return <div className={styles.schemaConfForm}>Schema Conf Form</div>;
};
