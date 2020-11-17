import {
  EntityProperty,
  EntityCanvasModel,
  RelationCanvasModel,
} from './interface';

export const mockProperties: EntityProperty[] = [
  {
    propertyId: 'propertyId1',
    name: '业务日期',
    propertyType: 'string',
    isPK: true,
  },
  {
    propertyId: 'propertyId2',
    name: '支付宝交易号1',
    propertyType: 'bigint',
    isFK: true,
  },
  {
    propertyId: 'propertyId3',
    name: '最长显示的表单名最长显示的表单名',
    propertyType: 'string',
  },
  {
    propertyId: 'propertyId4',
    name: '交易支付外键',
    propertyType: 'string',
  },
  {
    propertyId: 'propertyId5',
    name: '卖家支付日期',
    propertyType: 'string',
  },
  {
    propertyId: 'propertyId6',
    name: '网商银行',
    propertyType: 'string',
  },
  {
    propertyId: 'propertyId7',
    name: '业务日期',
    propertyType: 'string',
  },
  {
    propertyId: 'propertyId8',
    name: '业务日期111',
    propertyType: 'string',
  },
  {
    propertyId: 'propertyId9',
    name: '业务日期222',
    propertyType: 'string',
  },
  {
    propertyId: 'propertyId10',
    name: '业务日期333',
    propertyType: 'string',
  },
];

export const mockEntityData: EntityCanvasModel[] = [
  {
    entityId: 'fact_1',
    name: '事实表',
    entityType: 'FACT',
    properties: mockProperties,
    x: 550,
    y: 400,
    width: 214,
    height: 248,
  },
  {
    entityId: 'fact_up',
    name: '事实表',
    entityType: 'FACT',
    properties: mockProperties,
    x: 100,
    y: 100,
    width: 214,
    height: 248,
  },
  {
    entityId: 'dim_up',
    name: '维度表',
    entityType: 'DIM',
    properties: mockProperties,
    x: 100,
    y: 400,
    width: 214,
    height: 248,
  },
  {
    entityId: 'other_up',
    name: '其他表',
    entityType: 'OTHER',
    properties: mockProperties,
    x: 100,
    y: 700,
    width: 214,
    height: 248,
  },
  {
    entityId: 'other_down',
    name: '其他表',
    entityType: 'OTHER',
    properties: mockProperties,
    x: 900,
    y: 0,
    width: 214,
    height: 248,
  },
  {
    entityId: 'fact_down1',
    name: '事实表',
    entityType: 'FACT',
    properties: mockProperties,
    x: 900,
    y: 280,
    width: 214,
    height: 248,
  },
  {
    entityId: 'dim_down',
    name: '维度表',
    entityType: 'DIM',
    properties: mockProperties,
    x: 900,
    y: 580,
    width: 214,
    height: 248,
  },
  {
    entityId: 'fact_down2',
    name: '事实表',
    entityType: 'FACT',
    properties: mockProperties,
    x: 900,
    y: 860,
    width: 214,
    height: 248,
  },
];

export const mockRelationData: RelationCanvasModel[] = [
  {
    relationId: 'relationId_1',
    sourceEntityId: 'fact_up',
    targetEntityId: 'fact_1',
  },
  {
    relationId: 'relationId_2',
    sourceEntityId: 'fact_1',
    targetEntityId: 'fact_up',
  },
  {
    relationId: 'relationId_1_loop',
    sourceEntityId: 'fact_1',
    targetEntityId: 'fact_1',
  },
  {
    relationId: 'relationId_2',
    sourceEntityId: 'dim_up',
    targetEntityId: 'fact_1',
  },
  {
    relationId: 'relationId_3',
    sourceEntityId: 'other_up',
    targetEntityId: 'fact_1',
  },
  {
    relationId: 'relationId_4',
    sourceEntityId: 'fact_1',
    targetEntityId: 'other_down',
  },
  {
    relationId: 'relationId_5',
    sourceEntityId: 'fact_1',
    targetEntityId: 'fact_down1',
  },
  {
    relationId: 'relationId_6',
    sourceEntityId: 'fact_1',
    targetEntityId: 'dim_down',
  },
  {
    relationId: 'relationId_7',
    sourceEntityId: 'fact_1',
    targetEntityId: 'fact_down2',
  },
];
