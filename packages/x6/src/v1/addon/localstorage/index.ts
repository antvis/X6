import { StringExt, FunctionExt } from '../../../util'
import { Globals } from '../../core/globals'

export namespace LocalStorage {
  const prefix = `${Globals.prefixCls}.storage`

  export function insert<T>(collection: string, doc: T, cb: Callback) {
    const id = (doc as any).id || StringExt.uniqueId('doc-')
    const index = loadIndex(collection)

    index.keys.push(id)

    setItem(docKey(collection, id), doc)
    setItem(indexKey(collection), index)
    callback(cb, null, { ...doc, id })
  }

  export function find<T>(collection: string, query: Query, cb: Callback) {
    const index = loadIndex(collection)
    const docs: T[] = []

    if (query == null) {
      index.keys.forEach(id => {
        const doc = getItem<T>(docKey(collection, id))
        if (!doc) {
          callback(
            cb,
            new Error(`No document found for an ID '${id}' from index.`),
          )
        } else {
          docs.push(doc)
        }
      })

      callback(cb, null, docs)
    } else if (query.id) {
      const doc = getItem(docKey(collection, query.id))
      callback(cb, null, doc ? [doc] : [])
    } else {
      callback(cb, null, [])
    }
  }

  export function remove(collection: string, query: Query, cb: Callback) {
    const index = loadIndex(collection)

    if (query == null) {
      index.keys.forEach(id => {
        localStorage.removeItem(docKey(collection, id))
      })

      localStorage.removeItem(indexKey(collection))
      callback(cb, null)
    } else if (query.id) {
      const idx = index.keys.indexOf(query.id)
      if (idx >= 0) {
        index.keys.splice(idx, 1)
      }
      localStorage.removeItem(docKey(collection, query.id))
      setItem(indexKey(collection), index)
      callback(cb, null)
    }
  }

  // util
  // ----
  function callback<T>(cb: Callback, err: Error | null, ret?: T) {
    if (cb) {
      FunctionExt.defer(() => {
        cb(err, ret)
      })
    }
  }

  function setItem<T>(key: string, item: T) {
    localStorage.setItem(key, JSON.stringify(item))
  }

  function getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }

  function loadIndex(collection: string) {
    const index = getItem<Index>(indexKey(collection))
    if (index) {
      if (index.keys == null) {
        index.keys = []
      }
      return index
    }
    return { keys: [] }
  }

  function docKey(collection: string, id: string) {
    return `${prefix}.${collection}.docs.${id}`
  }

  function indexKey(collection: string) {
    return `${prefix}.${collection}.index`
  }
}

interface Index {
  keys: string[]
}

type Callback = <T>(err: Error | null, ret?: T) => any

type Query = { id: string } | null | undefined
