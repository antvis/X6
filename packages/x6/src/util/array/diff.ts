export function diff<T extends { [key: string]: any }>(
  oldList: T[],
  newList: T[],
  key: string,
) {
  const oldMap = makeKeyIndexAndFree(oldList, key)
  const newMap = makeKeyIndexAndFree(newList, key)

  const newFree = newMap.free

  const oldKeyIndex = oldMap.keyIndex
  const newKeyIndex = newMap.keyIndex

  const moves: { index: number; type: number; item: any }[] = []

  const children = []
  let i = 0
  let item
  let itemKey
  let freeIndex = 0

  while (i < oldList.length) {
    item = oldList[i]
    itemKey = item[key]
    if (itemKey) {
      // eslint-disable-next-line
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null)
      } else {
        const newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    } else {
      freeIndex += 1
      const freeItem = newFree[freeIndex]
      children.push(freeItem || null)
    }
    i += 1
  }

  const simulateList = children.slice(0)

  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)
      removeSimulate(i)
    } else {
      i += 1
    }
  }

  let j = (i = 0)
  while (i < newList.length) {
    item = newList[i]
    itemKey = item[key]

    const simulateItem = simulateList[j]
    if (simulateItem) {
      const simulateItemKey = simulateItem[key]
      if (itemKey === simulateItemKey) {
        j += 1
      } else {
        // eslint-disable-next-line
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        } else {
          const nextSimulateItem = simulateList[j + 1]
          if (nextSimulateItem) {
            const nextItemKey = nextSimulateItem[key]
            if (nextItemKey === itemKey) {
              remove(i)
              removeSimulate(j)
              j += 1
            } else {
              insert(i, item)
            }
          }
        }
      }
    } else {
      insert(i, item)
    }

    i += 1
  }

  let k = simulateList.length - j
  while ((j += 1) < simulateList.length) {
    k -= 1
    remove(k + i)
  }

  function remove(index: number) {
    const move = { index, type: 0, item: null }
    moves.push(move)
  }

  function insert(index: number, item: T) {
    const move = { index, item, type: 1 }
    moves.push(move)
  }

  function removeSimulate(index: number) {
    simulateList.splice(index, 1)
  }

  return {
    moves,
  }
}

function makeKeyIndexAndFree<T extends { [key: string]: any }>(
  list: T[],
  key: string,
) {
  const keyIndex: { [key: string]: number } = {}
  const free = []
  for (let i = 0, len = list.length; i < len; i += 1) {
    const item = list[i]
    const itemKey = item[key]
    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
    }
  }
  return {
    keyIndex,
    free,
  }
}
