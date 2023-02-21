---
title: Stencil
order: 8
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/plugins
---

:::info{title=通过阅读本章节，你可以了解到：}

- 如何通过 stencil 插件，进一步增强 dnd 能力
  :::

## 使用

Stencil 是在 Dnd 基础上的进一步封装，提供了一个类似侧边栏的 UI 组件，并支持分组、折叠、搜索等能力。我们提供了一个独立的插件包 `@antv/x6-plugin-stencil` 来使用这个功能。

```shell
# npm
$ npm install @antv/x6-plugin-stencil --save

# yarn
$ yarn add @antv/x6-plugin-stencil
```

然后我们在代码中这样使用：

```ts
import { Stencil } from "@antv/x6-plugin-stencil";

const graph = new Graph({
  background: {
    color: "#F2F7FA",
  },
});

const stencil = new Stencil({
  target: graph,
  groups: [
    {
      name: "group1",
    },
    {
      name: "group2",
    },
  ],
});

const rect1 = graph.createNode({
  shape: "rect",
  width: 100,
  height: 40,
});
const rect2 = rect1.clone();

// 需要一个容纳 stencil 的 Dom 容器 stencilContainer
stencilContainer.appendChild(stencil.container);
stencil.load([rect1, rect2], "group1");
```

## 演示

<code id="plugin-stencil" src="@/src/tutorial/plugins/stencil/index.tsx"></code>

## 配置

| 选项                | 类型                                                        | 必选 | 默认值               | 说明                                    |
| ------------------- | ----------------------------------------------------------- | :--: | -------------------- | --------------------------------------- |
| title               | string                                                      |      | `'Stencil'`          | 标题。                                  |
| groups              | Group[]                                                     |  ✓️  | -                    | 分组信息。                              |
| search              | Filter                                                      |      | `false`              | 搜索选项。                              |
| placeholder         | string                                                      |      | `'Search'`           | 搜索文本框的 placeholder 文本。         |
| notFoundText        | string                                                      |      | `'No matches found'` | 未匹配到搜索结果时的提示文本。          |
| collapsable         | boolean                                                     |      | `false`              | 是否显示全局折叠/展开按钮。             |
| layout              | (this: Stencil, model: Model, group?: Group \| null) => any |      | 网格布局             | 模板画布中节点的布局方法。              |
| layoutOptions       | any                                                         |      | -                    | 布局选项。                              |
| stencilGraphWidth   | number                                                      |      | `200`                | 模板画布宽度。                          |
| stencilGraphHeight  | number                                                      |      | `800`                | 模板画布高度。设置为 0 时高度会自适应。 |
| stencilGraphPadding | number                                                      |      | `10`                 | 模板画布边距。                          |
| stencilGraphOptions | Graph.Options                                               |      | -                    | 模板画布选项。                          |

:::info{title=提示：}
除了上面的配置，Stencil 还继承了 Dnd 的所有配置。
:::

### 分组

初始化时，按照 `groups` 提供的分组，在每个分组中会渲染一个模板画布。分组的类型定义如下：

```ts
export interface Group {
  name: string; // 分组名称
  title?: string; // 分组标题，缺省时使用 `name`
  collapsable?: boolean; // 分组是否可折叠，默认为 true
  collapsed?: boolean; // 初始状态是否为折叠状态
  graphWidth?: number; // 模板画布宽度
  graphHeight?: number; // 模板画布高度
  graphPadding?: number; // 模板画布边距
  graphOptions?: Graph.Options; // 模板画布选项
  layout?: (this: Stencil, model: Model, group?: Group | null) => any;
  layoutOptions?: any; // 布局选项
}
```

可以看到分组内的一些配置和外层的配置有重合，比如 `graphWidth` 和 `stencilGraphHeight`，分组内的配置优先级比较高。

### 布局

添加节点时，使用分组或全局的 `layout` 和 `layoutOptions` 来对节点进行自动布局，默认使用网格布局方法来布局模板节点，支持的布局选项有：

| 选项        | 类型                          | 默认值   | 说明                                                                                  |
| ----------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------- |
| columns     | number                        | `2`      | 网格布局的列数，默认为 `2`。行数根据节点数自动计算。                                  |
| columnWidth | number \| 'auto' \| 'compact' | `'auto'` | 列宽。auto: 所有节点中最宽节点的宽度作为列宽，compact: 该列中最宽节点的宽度作为列宽。 |
| rowHeight   | number \| 'auto' \| 'compact' | `'auto'` | 行高。auto: 所有节点中最高节点的高度作为行高，compact: 该行中最高节点的高度作为行高。 |
| dx          | number                        | `10`     | 单元格在 X 轴的偏移量，默认为 `10`。                                                  |
| dy          | number                        | `10`     | 单元格在 Y 轴的偏移量，默认为 `10`。                                                  |
| marginX     | number                        | `0`      | 单元格在 X 轴的边距，默认为 `0`。                                                     |
| marginY     | number                        | `0`      | 单元格在 Y 轴的边距，默认为 `0`。                                                     |
| center      | boolean                       | `true`   | 节点是否与网格居中对齐，默认为 `true`。                                               |
| resizeToFit | boolean                       | `false`  | 是否自动调整节点的大小来适应网格大小，默认为 `false`。                                |

也可以按照 `(this: Stencil, model: Model, group?: Group | null) => any` 签名进行自定义布局。

### 搜索

Stencil 还提供了搜索能力。

```ts
// 只搜索 rect 节点
const stencil = new Stencil({
  search: (cell, keyword, groupName, stencil) => {
    if (keyword) {
      return cell.shape === "rect";
    }
    return true;
  },
});

// 搜索 text 包含关键字的 rect 节点
const stencil = new Addon.Stencil({
  search: (cell, keyword, groupName, stencil) => {
    if (keyword) {
      return cell.shape === "rect" && cell.attr("text/text").includes(keyword);
    }
    return true;
  },
});
```
