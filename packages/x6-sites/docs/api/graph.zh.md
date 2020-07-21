---
title: Graph
order: 0
redirect_from:
  - /zh/docs/api
---

## constructor

```ts
const graph = new Graph()
```

## prototype

### 事务 Batch

事务指包含多个变更的操作的集合，

#### startBatch(...)

```sign
startBatch(name: string, data?: KeyValue): this
```

开始一个指定名称事务。开始和结束事务必须成对使用，一个事务结束前的所有变更都归属于该事务。

<span class="tag-param">参数<span>

| 名称 | 类型     | 必选 | 默认值 | 描述                           |
|------|----------|:----:|--------|------------------------------|
| name | string   |  ✔️  |        | 事务名称。                      |
| data | KeyValue |      |        | 额外的数据，供事件回调函数使用。 |

#### stopBatch(...)

```sign
stopBatch(name: string, data?: KeyValue): this
```

结束指定名称事务。事开始和结束事务必须成对使用，一个事务结束前的所有变更都归属于该事务。

<span class="tag-param">参数<span>

| 名称 | 类型     | 必选 | 默认值 | 描述                           |
|------|----------|:----:|--------|------------------------------|
| name | string   |  ✔️  |        | 事务名称。                      |
| data | KeyValue |      |        | 额外的数据，供事件回调函数使用。 |

<span class="tag-example">用法</span>

```ts
graph.startBatch('rename')

rect.prop('zIndex', 10)
rect.attr('label/text', 'hello')
rect.attr('label/fill', '#ff0000')

graph.stopBatch('rename')
```

#### batchUpdate(...)

```sign
batchUpdate<T>(name: string, execute: () => T, data?: KeyValue): T
```

执行一个成对的事务。

<span class="tag-param">参数<span>

| 名称    | 类型     | 必选 | 默认值 | 描述                           |
|---------|----------|:----:|--------|------------------------------|
| name    | string   |  ✔️  |        | 事务名称。                      |
| execute | () => T  |  ✔️  |        | 事务执行的函数。                |
| data    | KeyValue |      |        | 额外的数据，供事件回调函数使用。 |

<span class="tag-example">用法</span>

```ts
graph.batchUpdate('rename', () => {
  rect.prop('zIndex', 10)
  rect.attr('label/text', 'hello')
  rect.attr('label/fill', '#ff0000')  
})
```
