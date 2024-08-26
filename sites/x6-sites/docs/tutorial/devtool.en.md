---
title: Developer Tools
order: 6
redirect_from:
  - /en/docs
  - /en/docs/tutorial
---

We provide a plugin for inspecting page elements to help developers more easily develop applications.

### Installation

![image](https://user-images.githubusercontent.com/1826685/238003455-d341f598-1b35-4d8c-bb7c-0320cad6a4cb.png)

### Usage

First, initialize in your project code:

```javascript
// init window hook
window.__x6_instances__ = []

const graph = new Graph({ ...blablabla })

window.__x6_instances__.push(graph)
```

Then you can see the AntV X6 section in the developer panel.

![image](https://user-images.githubusercontent.com/1826685/238013980-2d6018f8-7d85-473c-a043-98b1f03b6674.png)

Here, we can inspect the graph object and the elements within the graph:

![image](https://user-images.githubusercontent.com/1826685/238014156-e65ec2b0-f719-410e-9a10-89cdb836acde.png)

It also supports modifying element properties:

![image](https://user-images.githubusercontent.com/1826685/238014353-124feb8e-2049-499d-a13d-3d26f485bab6.png)
