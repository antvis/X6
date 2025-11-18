# @antv/x6

## 2.19.2 (2025-11-17)

### Fixes

- 修复非有限 `SVGMatrix` 导致缩放/平移异常，加入安全兜底（#4892） `packages/x6/src/graph/transform.ts:50`
- 修复平移时光标状态与行为不一致的问题（#4671） `packages/x6/src/graph/panning.ts:101`
- 修复跳线在交点与端点重合时产生异常的问题（#4279） `packages/x6/src/registry/connector/jumpover.ts:79`
- 修复节点不可见时锚点计算错误（#4313） `packages/x6/src/view/edge.ts:78`
- 移除重复导出，统一 `shape` 入口（#4404） `packages/x6/src/shape/index.ts:1`

### Features

- 节点移动后若与其他节点重叠，支持自动错位（开启 `translating.autoOffset`）（#4625） `packages/x6/src/graph/options.ts:252` `packages/x6/src/view/node.ts:1108` `packages/x6/src/view/node.ts:1163`

## 2.11.3

### Patch Changes

- fix visual render error
