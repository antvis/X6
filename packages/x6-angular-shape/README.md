# @antv/x6-angular-shape

## 渲染节点

我们提供了一个独立的包 `@antv/x6-angular-shape` 以支持将 Angular 的组件/模板作为节点进行渲染。

### Component 渲染

```ts
@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements AfterViewInit, OnChanges {
  @Input() value: string;
}
```

```ts
import { register } from "@antv/x6-angular-shape";

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
    });

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
    });
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
import { register } from "@antv/x6-angular-shape";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('template') template: TemplateRef<{}>;

  ngAfterViewInit(): void {
    register({
      shape: 'custom-angular-template-node',
      width: 120,
      height: 20,
      content: this.template,
      injector: this.injector,
    });

    this.graph.addNode({
      shape: 'custom-angular-template-node',
      x: 100,
      y: 100,
      data: {
        ngArguments: {
          value: '魔法怎么失灵啦',
        },
      },
    });
  }
}

```

## 更新节点

无论是使用 Component 还是 TemplateRef, 都是一样的更新方式.
```ts
node.setData({
  ngArguments: {
    value: '晚风中闪过 几帧从前啊',
  },
});
```

## 有 demo 吗?

有的, 因为X6渲染节点部分与框架是解耦的. 因此 `x6-angular-shape` 包并非是直接在源代码里改的, 而是在一个单独的Angular环境中开发的. 该 demo 还提供了多种节点类型的性能测试, 详情请参考[Eve-Sama/x6-angular-shape](https://github.com/Eve-Sama/x6-angular-shape)、[X6与G6的性能对比, 以及X6多节点类型下的FPS临界点讨论](https://github.com/antvis/X6/issues/3266)

## FAQ

### 为什么输入属性不能直接放在 data 中而需要放在 ngArguments 中? 且为什么不叫 ngInput?

因为并非所有 `node.data` 中的属性都是输入属性, 所以遍历 `data` 中的所有属性进行赋值是不合适的. 至于为什么叫 `ngArguments` 主要是有两点考虑.
 - 1.x版本中已经这么用了, 沿用该API可以降低用户升级成本
 - `Input` 的概念其实是来自 `Component`, 而 `TemplateRef` 中是 `context`, 在二者的基础上抽象一个 `Arguments` 的概念更通用些

### 2.x版本的 x6-angular-shape 相比较1.x版本有什么新特性吗?

实现思路其实和之前是差不多的. 但是确实有几个点值得一提.

#### demo更聚焦

1.x版本的 demo 除了渲染组件外, 还写了连线、清除等一系列案例. 看似扩展, 实则眼花缭乱. 作为 `x6-angular-shape`的 demo, 2.x版本更加聚焦, 更加聚焦于shape的使用与性能测试等, 与插件无关的内容请查看X6官网.

#### 功能更稳定

在1.x版本中, 虽然实现了功能, 但是使用场景的思考不够全面. 比如`ngArguments`的变化, 对 `TemplateRef`的场景并不生效. 虽然对`Component`生效但是无法触发`ngOnChanges`. 而在新版本中, 这些问题都将不复存在.

### 版本要求

你的Angular版本至少在14及以上才可以. 14以下需要用 hack 的方式实现一些特性, 比较麻烦. 暂时不提供, 如有需要可提issue, 我再专门介绍下如何实现.
