---
title: 开发者工具
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
---

我们提供了一个对页面元素进行审查的插件来帮助开发者更方便的开发应用。

### 安装

![image](https://user-images.githubusercontent.com/1826685/238003455-d341f598-1b35-4d8c-bb7c-0320cad6a4cb.png)

### 使用

首先在项目代码中初始化：

```javascript
// init window hook
window.__x6_instances__ = []

const graph = new Graph({ ...blablabla })

window.__x6_instances__.push(graph)
```

然后就可以在开发者面板看到 AntV X6 这一栏。

![image](https://user-images.githubusercontent.com/1826685/238013980-2d6018f8-7d85-473c-a043-98b1f03b6674.png)

我们在这里可以审查图对象以及图内元素：

![image](https://user-images.githubusercontent.com/1826685/238014156-e65ec2b0-f719-410e-9a10-89cdb836acde.png)

同时还支持修改元素属性：

![image](https://user-images.githubusercontent.com/1826685/238014353-124feb8e-2049-499d-a13d-3d26f485bab6.png)
