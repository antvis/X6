export enum GraphMode {
  INFO = 'INFO', // 缩略模式
  DETAIL = 'DETAIL', // 详情模式
}

export enum EntityType {
  FACT = 'FACT',
  DIM = 'DIM',
  OTHER = 'OTHER',
}

export const entityTypeDisplay = {
  [EntityType.FACT]: '事实表',
  [EntityType.DIM]: '维度表',
  [EntityType.OTHER]: '其他表',
};
