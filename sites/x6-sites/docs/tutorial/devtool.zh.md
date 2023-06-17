---
title: 开发者工具
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
---

## X6 开发者工具

为了帮助开发者更方便的开发 x6 项目，提供了一个对页面元素进行审查的插件

### 从应用市场安装

![image](https://user-images.githubusercontent.com/1826685/238003455-d341f598-1b35-4d8c-bb7c-0320cad6a4cb.png)

### 连接到调试工具

#### X6 项目代码

```javascript
// init window hook
window.__x6_instances__ = []

var graph = new Graph({ ...blablabla })

window.__x6_instances__.push(graph)
```

#### 插件使用

![image](https://user-images.githubusercontent.com/1826685/238013980-2d6018f8-7d85-473c-a043-98b1f03b6674.png)

### 特性

#### 审查 X6 图对象以及图内元素

![image](https://user-images.githubusercontent.com/1826685/238014156-e65ec2b0-f719-410e-9a10-89cdb836acde.png)

#### 查看以及更改元素属性

![image](https://user-images.githubusercontent.com/1826685/238014353-124feb8e-2049-499d-a13d-3d26f485bab6.png)
