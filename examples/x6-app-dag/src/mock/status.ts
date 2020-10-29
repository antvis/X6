import get from 'lodash/get'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'

let state = {
  idx: 0,
  running: false,
  statusRes: {
    lang: 'zh_CN',
    success: true,
    data: {
      instStatus: {
        '10571193': 'success',
        '10571194': 'success',
        '10571195': 'success',
        '10571196': 'success',
        '10571197': 'success',
      },
      execInfo: {
        '10571193': {
          jobStatus: 'success',
          defName: '读数据表',
          name: 'germany_credit_data',
          id: 10571193,
        },
        '10571194': {
          jobStatus: 'success',
          defName: '离散值特征分析',
          name: '离散值特征分析',
          id: 10571194,
        },
        '10571195': {
          jobStatus: 'success',
          defName: '分箱',
          startTime: '2020-10-19 13:28:55',
          endTime: '2020-10-19 13:30:20',
          name: '分箱',
          id: 10571195,
        },
        '10571196': {
          jobStatus: 'success',
          defName: '评分卡训练',
          startTime: '2020-10-19 13:28:55',
          endTime: '2020-10-19 13:32:02',
          name: '评分卡训练-1',
          id: 10571196,
        },
      },
      status: 'default',
    },
    Lang: 'zh_CN',
  } as any,
}

export const runGraph = async (nodes: any[]) => {
  const newState = getStatus()
  newState.data.instStatus = {}
  newState.data.execInfo = {}
  nodes.forEach((node) => {
    newState.data.instStatus[node.id] = 'default'
    newState.data.execInfo[node.id] = {
      jobStatus: 'default',
      defName: node.name,
      startTime: '2020-10-19 13:28:55',
      endTime: '2020-10-19 13:32:02',
      name: node.name,
      id: 10571196,
    }
  })
  state.running = true
  state.idx = 0
  state.statusRes = newState
  return { success: true }
}

export const stopGraphRun = () => {
  state.running = false
  state.idx = 0
  return { success: true }
}

const getStatus = () => cloneDeep(state.statusRes)

export const queryGraphStatus = async () => {
  const newState = getStatus()
  // console.log('Call Api QueryGraphStatus', state)
  if (state.running) {
    const { instStatus, execInfo } = newState.data
    const idList = Object.keys(instStatus)
    if (state.idx === idList.length) {
      state.idx = 0
      state.running = false
      idList.forEach((id) => {
        set(instStatus, id, 'success')
        set(execInfo, `${id}.jobStatus`, 'success')
        set(newState, 'data.status', 'success')
      })
      return newState
    }
    const key = get(idList, state.idx)
    set(instStatus, key, 'running')
    set(execInfo, `${key}.jobStatus`, 'running')
    set(newState, 'data.status', 'running')
    state.idx += 1
    return newState
  }
  return newState
}
