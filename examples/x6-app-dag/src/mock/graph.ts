import random from 'lodash/random'

interface NodeParams {
  name: string
  x: number
  y: number
}

export const copyNode = ({ name, x, y }: NodeParams) => {
  const id = `${Date.now()}`
  return {
    id,
    name,
    inPorts: [
      {
        tableName: 'germany_credit_data',
        sequence: 1,
        description: '输入1',
        id: id + 100000,
      },
      {
        tableName: 'germany_credit_data',
        sequence: 2,
        description: '输入2',
        id: id + 200000,
      },
    ],
    outPorts: [
      {
        tableName: 'germany_credit_data',
        sequence: 1,
        description: '输出表1',
        id: id + 300000,
      },
      {
        tableName: 'germany_credit_data',
        sequence: 2,
        description: '输出表2',
        id: id + 400000,
      },
    ],
    positionX: x + 200 + random(20, false),
    positionY: y + random(10, false),
    codeName: 'source_11111',
    catId: 1,
    nodeDefId: 111111,
    category: 'source',
    status: 3,
    groupId: 0,
  }
}
export const addNode = ({ name, x, y }: NodeParams) => {
  const id = `${Date.now()}`
  return {
    id,
    name,
    inPorts: [
      {
        tableName: 'germany_credit_data',
        sequence: 1,
        description: '输入1',
        id: id + '_in_1',
      },
      {
        tableName: 'germany_credit_data',
        sequence: 2,
        description: '输入2',
        id: id + '_in_2',
      },
    ],
    outPorts: [
      {
        tableName: 'germany_credit_data',
        sequence: 1,
        description: '输出表1',
        id: id + '_out_1',
      },
      {
        tableName: 'germany_credit_data',
        sequence: 2,
        description: '输出表2',
        id: id + '_out_2',
      },
    ],
    positionX: x,
    positionY: y,
    codeName: 'source_11111',
    catId: 1,
    nodeDefId: 111111,
    category: 'source',
    status: 3,
    groupId: 0,
  }
}

export const queryGraph = (id: string) => {
  return {
    lang: 'zh_CN',
    success: true,
    data: initData,
    Lang: 'zh_CN',
  }
}

export const addNodeGroup = async (groupName: string) => {
  return {
    success: true,
    data: {
      group: {
        name: groupName,
        id: Date.now(),
      },
    },
  }
}

const initData = {
  nodes: [
    {
      id: '1603716783816',
      name: '算法组件1',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716783816_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716783816_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716783816_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716783816_out_2',
        },
      ],
      positionX: -200,
      positionY: -300,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716786205',
      name: '算法组件2',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716786205_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716786205_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716786205_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716786205_out_2',
        },
      ],
      positionX: -369,
      positionY: -161,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716788394',
      name: '算法组件2',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716788394_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716788394_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716788394_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716788394_out_2',
        },
      ],
      positionX: -154,
      positionY: -161,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716792826',
      name: '算法组件3',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716792826_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716792826_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716792826_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716792826_out_2',
        },
      ],
      positionX: -520,
      positionY: -30,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716795011',
      name: '算法组件2',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716795011_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716795011_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716795011_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716795011_out_2',
        },
      ],
      positionX: 74,
      positionY: -160,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716814719',
      name: '算法组件3',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716814719_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716814719_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716814719_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716814719_out_2',
        },
      ],
      positionX: -310,
      positionY: -30,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716822805',
      name: '算法组件3',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716822805_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716822805_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716822805_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716822805_out_2',
        },
      ],
      positionX: -50,
      positionY: -30,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716828657',
      name: '算法组件3',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716828657_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716828657_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716828657_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716828657_out_2',
        },
      ],
      positionX: 160,
      positionY: -30,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716834901',
      name: '算法组件2',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716834901_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716834901_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716834901_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716834901_out_2',
        },
      ],
      positionX: -390,
      positionY: 90,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716844054',
      name: '算法组件2',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716844054_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716844054_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716844054_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716844054_out_2',
        },
      ],
      positionX: -170,
      positionY: 90,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716854368',
      name: '算法组件2',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716854368_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716854368_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716854368_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716854368_out_2',
        },
      ],
      positionX: 40,
      positionY: 90,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716858435',
      name: '算法组件3',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716858435_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716858435_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716858435_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716858435_out_2',
        },
      ],
      positionX: -310,
      positionY: 230,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
    {
      id: '1603716868041',
      name: '算法组件2',
      inPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输入1',
          id: '1603716868041_in_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输入2',
          id: '1603716868041_in_2',
        },
      ],
      outPorts: [
        {
          tableName: 'germany_credit_data',
          sequence: 1,
          description: '输出表1',
          id: '1603716868041_out_1',
        },
        {
          tableName: 'germany_credit_data',
          sequence: 2,
          description: '输出表2',
          id: '1603716868041_out_2',
        },
      ],
      positionX: -100,
      positionY: 230,
      codeName: 'source_11111',
      catId: 1,
      nodeDefId: 111111,
      category: 'source',
      status: 3,
      groupId: 0,
    },
  ],
  links: [
    {
      source: '1603716783816',
      target: '1603716786205',
      outputPortId: '1603716783816_out_1',
      inputPortId: '1603716786205_in_1',
    },
    {
      source: '1603716783816',
      target: '1603716788394',
      outputPortId: '1603716783816_out_2',
      inputPortId: '1603716788394_in_1',
    },
    {
      source: '1603716783816',
      target: '1603716795011',
      outputPortId: '1603716783816_out_2',
      inputPortId: '1603716795011_in_1',
    },
    {
      source: '1603716786205',
      target: '1603716792826',
      outputPortId: '1603716786205_out_1',
      inputPortId: '1603716792826_in_1',
    },
    {
      source: '1603716788394',
      target: '1603716814719',
      outputPortId: '1603716788394_out_1',
      inputPortId: '1603716814719_in_1',
    },
    {
      source: '1603716795011',
      target: '1603716822805',
      outputPortId: '1603716795011_out_1',
      inputPortId: '1603716822805_in_1',
    },
    {
      source: '1603716795011',
      target: '1603716828657',
      outputPortId: '1603716795011_out_2',
      inputPortId: '1603716828657_in_2',
    },
    {
      source: '1603716792826',
      target: '1603716834901',
      outputPortId: '1603716792826_out_1',
      inputPortId: '1603716834901_in_1',
    },
    {
      source: '1603716814719',
      target: '1603716844054',
      outputPortId: '1603716814719_out_1',
      inputPortId: '1603716844054_in_1',
    },
    {
      source: '1603716822805',
      target: '1603716854368',
      outputPortId: '1603716822805_out_1',
      inputPortId: '1603716854368_in_1',
    },
    {
      source: '1603716834901',
      target: '1603716858435',
      outputPortId: '1603716834901_out_1',
      inputPortId: '1603716858435_in_1',
    },
    {
      source: '1603716844054',
      target: '1603716858435',
      outputPortId: '1603716844054_out_1',
      inputPortId: '1603716858435_in_2',
    },
    {
      source: '1603716854368',
      target: '1603716868041',
      outputPortId: '1603716854368_out_1',
      inputPortId: '1603716868041_in_1',
    },
  ],
}
