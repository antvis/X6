---
title: Data Transform
order: 10
redirect_from:
- /zh/docs
- /zh/docs/tutorial
- /zh/docs/tutorial/plugins
---

:::info{title=通过阅读本章节，你可以了解到：}

- 如何通过插件隐式调整fromJSON和toJSON需要的数据格式
  :::

## 使用

我们经常需要将业务数据和X6的dsl进行数据转换，所以为了简便用户转换。我们提供了一个独立的插件包 `@antv/x6-plugin-dataTransform` 来使用这个功能。

```shell
# npm
$ npm install @antv/x6-plugin-dataTransform --save

# yarn
$ yarn add @antv/x6-plugin-dataTransform
```

然后我们在代码中这样使用：

```ts
import { DataTransform } from "@antv/x6-plugin-dataTransform";

const graph = new Graph({
  background: {
    color: "#F2F7FA",
  },
});

const dataTransform = new DataTransform({
  toJsonTransform(dsl) {
      return dsl;
  },
  fromJSONTransform(dsl) { 
      return dsl;
  },
});

console.log(dataTransform.toJson())
```

## 配置

| 选项                 | 类型                                                                                | 必选 | 默认值 | 说明                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------- | :--: | ------ | -------------------------------------------------------------------------------------------------------- |
| toJsonTransform    | (dsl: Modal: FromJSONData) => T                                                                                 |  ✓️  |        | toJSON的转换。                                                                                               |
| fromJSONTransform  | (dsl: F) => Modal: FromJSONData                             |      |        | fromJSON的转换。                                          | |      |    `document.body`   | 自定义拖拽画布容器。 |

## API

### graph.toJSONTransform()

```sign
toJSONTransform<T>(data: Model.ToJSONOptions): T
```

返回通过插件进行数据转换后的数据

### graph.fromJSONTransform()

```sign
fromJSONTransform<F>(
  data: F
  options: Model.FromJSONOptions = {},
)
```

将通过插件转换后的数据传给X6

## 常见问题
