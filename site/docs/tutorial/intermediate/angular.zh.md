---
title: Angular 节点
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

:::info{title="在本章节中主要介绍 Angular 节点相关的知识，通过阅读，你可以了解到"}

- 如何使用 Angular 来渲染节点内容
- 如何更新节点内容
- FAQ

:::

## 渲染节点

我们提供一个独立的包 `@antv/x6-angular-shape`，用于将 Angular 组件/模板渲染为节点。

:::warning{title=注意}
版本兼容关系：X6 3.x 须使用 x6-angular-shape 3.x 版本。
:::

### Component 渲染

```ts
@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements AfterViewInit, OnChanges {
  @Input() value: string
}
```

```ts
import { register } from '@antv/x6-angular-shape'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    register({
      shape: 'custom-angular-component-node',
      width: 120,
      height: 20,
      content: NodeComponent,
      injector: this.injector,
    })

    this.graph.addNode({
      shape: 'custom-angular-component-node',
      x: 100,
      y: 100,
      data: {
        // Input 的参数必须放在这里
        ngArguments: {
          value: '糟糕糟糕 Oh my god',
        },
      },
    })
  }
}
```

### TemplateRef 渲染

```html
<ng-template #template let-data="ngArguments">
  <section class="template-container">
    <span class="value">{{ data.value }}</span>
  </section>
</ng-template>
```

```ts
import { register } from '@antv/x6-angular-shape'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('template') template: TemplateRef<{}>

  ngAfterViewInit(): void {
    register({
      shape: 'custom-angular-template-node',
      width: 120,
      height: 20,
      content: this.template,
      injector: this.injector,
    })

    this.graph.addNode({
      shape: 'custom-angular-template-node',
      x: 100,
      y: 100,
      data: {
        ngArguments: {
          value: '魔法怎么失灵啦',
        },
      },
    })
  }
}
```

## 更新节点

无论使用 Component 还是 TemplateRef，更新方式相同。

```ts
node.setData({
  ngArguments: {
    value: '晚风中闪过 几帧从前啊',
  },
})
```

## 有 demo 吗？

有的。由于 X6 的节点渲染与框架解耦，因此 `x6-angular-shape` 包并非直接在源代码中修改，而是在独立的 Angular 环境中开发。该 demo 还提供多种节点类型的性能测试，详情请参考 [Eve-Sama/x6-angular-shape](https://github.com/Eve-Sama/x6-angular-shape) 和 [X6 与 G6 的性能对比，以及 X6 多节点类型下的 FPS 临界点讨论](https://github.com/antvis/X6/issues/3266)。

## FAQ

### 为什么输入属性不能直接放在 data 中而需要放在 ngArguments 中？且为什么不叫 ngInput？

因为并非所有 `node.data` 中的属性都是输入属性，所以遍历 `data` 中的所有属性进行赋值并不合适。至于为什么叫 `ngArguments`，主要有两点考虑：

- 1.x 版本中已采用该命名，沿用可降低用户升级成本。
- `Input` 的概念来自 `Component`，而在 `TemplateRef` 中是 `context`，在二者基础上抽象出更通用的 `Arguments` 概念。

### 2.x 版本的 x6-angular-shape 相比较 1.x 版本有什么新特性吗？

实现思路与之前基本一致，但有几点值得一提。

#### Demo 更聚焦

1.x 版本的 demo 除了渲染组件外，还包含连线、清除等一系列案例。看似扩展，实则冗杂。作为 `x6-angular-shape` 的 demo，2.x 版本更聚焦于 shape 的使用与性能测试等。与插件无关的内容请查看 X6 官网。

#### 功能更稳定

在 1.x 版本中，虽然实现了功能，但对使用场景的考虑不够全面。比如 `ngArguments` 的变化在 `TemplateRef` 场景不生效；对 `Component` 生效但无法触发 `ngOnChanges`。在新版本中，这些问题已被修复。

### 版本要求

Angular 版本需至少 14 及以上。14 以下需通过 hack 的方式实现部分特性，较为麻烦，暂不提供支持。如有需要可提 Issue，我们将说明实现方式。
