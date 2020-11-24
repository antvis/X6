## @antv/x6 [1.0.6](https://github.com/antvis/x6/compare/@antv/x6@1.0.5...@antv/x6@1.0.6) (2020-11-24)

## @antv/x6 [1.0.5](https://github.com/antvis/x6/compare/@antv/x6@1.0.4...@antv/x6@1.0.5) (2020-11-24)


### Bug Fixes

* 🐛 chang the call order of scale and translate ([66e1ce6](https://github.com/antvis/x6/commit/66e1ce66b86dde2be75600ab5f73e08efd0fb1ae))

## @antv/x6 [1.0.4](https://github.com/antvis/x6/compare/@antv/x6@1.0.3...@antv/x6@1.0.4) (2020-11-24)


### Bug Fixes

* 🐛 global `process` should be replaced when build with rollup ([b459b61](https://github.com/antvis/x6/commit/b459b61a7aa966ff83bfb5992586aed2583b8a46)), closes [#324](https://github.com/antvis/x6/issues/324)
* 🐛 node:xxx event was not triggered when interact with selection boxes ([34cd5a0](https://github.com/antvis/x6/commit/34cd5a0737b291357d398b8ef2f5c58b113a1fc3)), closes [#297](https://github.com/antvis/x6/issues/297)
* 🐛 shake of selection events triggering ([541be16](https://github.com/antvis/x6/commit/541be16366785d28882a33d1d2b07ba8aa026072))

## @antv/x6 [1.0.3](https://github.com/antvis/x6/compare/@antv/x6@1.0.2...@antv/x6@1.0.3) (2020-11-20)


### Bug Fixes

* 🐛 fix lint error ([a73cf3f](https://github.com/antvis/x6/commit/a73cf3fb3559657189502dc434d3bef4d7174ef6))

## @antv/x6 [1.0.2](https://github.com/antvis/x6/compare/@antv/x6@1.0.1...@antv/x6@1.0.2) (2020-11-19)


### Bug Fixes

* 🐛 filter not working when select cell by calling `select()` api or by click ([#314](https://github.com/antvis/x6/issues/314)) ([7a3e547](https://github.com/antvis/x6/commit/7a3e54731940f5dcc2a15b8d338aedf64fc63619)), closes [#305](https://github.com/antvis/x6/issues/305)

## @antv/x6 [1.0.1](https://github.com/antvis/x6/compare/@antv/x6@1.0.0...@antv/x6@1.0.1) (2020-11-18)


### Bug Fixes

* 🐛 remove default points attr of polygon and polyline ([ccab7a2](https://github.com/antvis/x6/commit/ccab7a2a1c30955239891149d1c1e9250160bbe5)), closes [#304](https://github.com/antvis/x6/issues/304) [#304](https://github.com/antvis/x6/issues/304)


### Performance Improvements

* ⚡️ auto scroll graph on moving node ([b2fb417](https://github.com/antvis/x6/commit/b2fb4170a0939488500c349db9006c7f11d884f7))
* ⚡️ clean everything and restore dom structure on graph disposed ([a834331](https://github.com/antvis/x6/commit/a834331779e76e57ccb409d2f39040406ef732ea)), closes [#291](https://github.com/antvis/x6/issues/291) [#292](https://github.com/antvis/x6/issues/292)
* ⚡️ restrict on resizing ([36107bf](https://github.com/antvis/x6/commit/36107bf81871b6ce083ae02bbd9ba72deb6aa9b8)), closes [#289](https://github.com/antvis/x6/issues/289)

## @antv/x6 [0.13.7](https://github.com/antvis/x6/compare/@antv/x6@0.13.6...@antv/x6@0.13.7) (2020-11-17)


### Bug Fixes

* 🐛 x6 version ([803cd3e](https://github.com/antvis/x6/commit/803cd3ee0bdc137ce4043e6ec8ab14b0c65fa40d))
* 🐛 x6 version ([1eb5359](https://github.com/antvis/x6/commit/1eb535924ea0358ab7d8bb3b9dab009ec3c0c04c))

# @antv/x6 [1.0.0-beta.5](https://github.com/antvis/x6/compare/@antv/x6@1.0.0-beta.4...@antv/x6@1.0.0-beta.5) (2020-11-17)


### Bug Fixes

* 🐛 apps router ([8324eaa](https://github.com/antvis/x6/commit/8324eaa0a85cb14873f5095fe8d2695d80b5215a))
* 🐛 dnd events ([3e94b0b](https://github.com/antvis/x6/commit/3e94b0b1eafab8f43cff2601b088df24d1b062a4)), closes [#271](https://github.com/antvis/x6/issues/271)
* 🐛 do not render edge when any of it's terminal is not visible ([1b6c6a9](https://github.com/antvis/x6/commit/1b6c6a9b9d13a664abb7f843c5ee798eac6626b0)), closes [#300](https://github.com/antvis/x6/issues/300) [#300](https://github.com/antvis/x6/issues/300)
* 🐛 equal points ([c415c1d](https://github.com/antvis/x6/commit/c415c1d6acc27678de6bdb1e1fbb2a92a810c220))
* 🐛 get bearing between me and the given point ([07d0c1d](https://github.com/antvis/x6/commit/07d0c1d6ba1e9362d235a1f1a85696febc65839a))
* 🐛 guard option not available ([b8ffaaf](https://github.com/antvis/x6/commit/b8ffaaf376f1b7a69d96fccde48a8de82e951660)), closes [#281](https://github.com/antvis/x6/issues/281)
* 🐛 should not render cell when invisible ([c9535b5](https://github.com/antvis/x6/commit/c9535b5604cda94066d80df0d43c85921f0ab978)), closes [#300](https://github.com/antvis/x6/issues/300)


### Features

* ✨ add minScale and maxScale options for mousewheel ([e474ac3](https://github.com/antvis/x6/commit/e474ac3c6a7c224ab5e9a9039c7b419f91554891)), closes [#283](https://github.com/antvis/x6/issues/283) [#283](https://github.com/antvis/x6/issues/283)
* ✨ add some ui events ([7781435](https://github.com/antvis/x6/commit/77814353097a96cc444d347f26309ce6ae8e7453)), closes [#275](https://github.com/antvis/x6/issues/275) [#273](https://github.com/antvis/x6/issues/273)
* ✨ add xxx classname to node when widget visible ([aa3dd12](https://github.com/antvis/x6/commit/aa3dd120a5457f189c0f09dad87d96c70b908abd)), closes [#279](https://github.com/antvis/x6/issues/279)
* ✨ node/edge move events ([67efad9](https://github.com/antvis/x6/commit/67efad9f9dac1657c0f04de15ca80c8fd50d395e))

# @antv/x6 [1.0.0-beta.4](https://github.com/antvis/x6/compare/@antv/x6@1.0.0-beta.3...@antv/x6@1.0.0-beta.4) (2020-11-05)
## @antv/x6 [0.13.6](https://github.com/antvis/x6/compare/@antv/x6@0.13.5...@antv/x6@0.13.6) (2020-11-17)


### Bug Fixes

* 🐛 version error ([5c80d69](https://github.com/antvis/x6/commit/5c80d69f66217e131176fce89b95d30bd47e3c4c))
* 🐛 do not render edge when any of it's terminal is not visible ([1b6c6a9](https://github.com/antvis/x6/commit/1b6c6a9b9d13a664abb7f843c5ee798eac6626b0)), closes [#300](https://github.com/antvis/x6/issues/300) [#300](https://github.com/antvis/x6/issues/300)

## @antv/x6 [0.13.5](https://github.com/antvis/x6/compare/@antv/x6@0.13.4...@antv/x6@0.13.5) (2020-11-17)


### Bug Fixes

* 🐛 should not render cell when invisible ([c9535b5](https://github.com/antvis/x6/commit/c9535b5604cda94066d80df0d43c85921f0ab978)), closes [#300](https://github.com/antvis/x6/issues/300)

## @antv/x6 [0.13.4](https://github.com/antvis/x6/compare/@antv/x6@0.13.3...@antv/x6@0.13.4) (2020-11-13)

## @antv/x6 [0.13.3](https://github.com/antvis/x6/compare/@antv/x6@0.13.2...@antv/x6@0.13.3) (2020-11-12)

## @antv/x6 [0.13.2](https://github.com/antvis/x6/compare/@antv/x6@0.13.1...@antv/x6@0.13.2) (2020-11-12)

## @antv/x6 [0.13.1](https://github.com/antvis/x6/compare/@antv/x6@0.13.0...@antv/x6@0.13.1) (2020-11-11)


### Bug Fixes

* 🐛 equal points ([c415c1d](https://github.com/antvis/x6/commit/c415c1d6acc27678de6bdb1e1fbb2a92a810c220))
* 🐛 get bearing between me and the given point ([07d0c1d](https://github.com/antvis/x6/commit/07d0c1d6ba1e9362d235a1f1a85696febc65839a))

# @antv/x6 [0.13.0](https://github.com/antvis/x6/compare/@antv/x6@0.12.1...@antv/x6@0.13.0) (2020-11-10)


### Features

* ✨ add minScale and maxScale options for mousewheel ([e474ac3](https://github.com/antvis/x6/commit/e474ac3c6a7c224ab5e9a9039c7b419f91554891)), closes [#283](https://github.com/antvis/x6/issues/283) [#283](https://github.com/antvis/x6/issues/283)

## @antv/x6 [0.12.1](https://github.com/antvis/x6/compare/@antv/x6@0.12.0...@antv/x6@0.12.1) (2020-11-10)


### Bug Fixes

* 🐛 guard option not available ([b8ffaaf](https://github.com/antvis/x6/commit/b8ffaaf376f1b7a69d96fccde48a8de82e951660)), closes [#281](https://github.com/antvis/x6/issues/281)

# @antv/x6 [0.12.0](https://github.com/antvis/x6/compare/@antv/x6@0.11.2...@antv/x6@0.12.0) (2020-11-09)


### Features

* ✨ add xxx classname to node when widget visible ([aa3dd12](https://github.com/antvis/x6/commit/aa3dd120a5457f189c0f09dad87d96c70b908abd)), closes [#279](https://github.com/antvis/x6/issues/279)

## @antv/x6 [0.11.2](https://github.com/antvis/x6/compare/@antv/x6@0.11.1...@antv/x6@0.11.2) (2020-11-09)

## @antv/x6 [0.11.1](https://github.com/antvis/x6/compare/@antv/x6@0.11.0...@antv/x6@0.11.1) (2020-11-09)

# @antv/x6 [0.11.0](https://github.com/antvis/x6/compare/@antv/x6@0.10.81...@antv/x6@0.11.0) (2020-11-09)


### Features

* ✨ add some ui events ([7781435](https://github.com/antvis/x6/commit/77814353097a96cc444d347f26309ce6ae8e7453)), closes [#275](https://github.com/antvis/x6/issues/275) [#273](https://github.com/antvis/x6/issues/273)
* ✨ node/edge move events ([67efad9](https://github.com/antvis/x6/commit/67efad9f9dac1657c0f04de15ca80c8fd50d395e))

## @antv/x6 [0.10.81](https://github.com/antvis/x6/compare/@antv/x6@0.10.80...@antv/x6@0.10.81) (2020-11-09)

## @antv/x6 [0.10.80](https://github.com/antvis/x6/compare/@antv/x6@0.10.79...@antv/x6@0.10.80) (2020-11-06)


### Bug Fixes

* 🐛 dnd events ([3e94b0b](https://github.com/antvis/x6/commit/3e94b0b1eafab8f43cff2601b088df24d1b062a4)), closes [#271](https://github.com/antvis/x6/issues/271)

## @antv/x6 [0.10.79](https://github.com/antvis/x6/compare/@antv/x6@0.10.78...@antv/x6@0.10.79) (2020-11-05)


### Bug Fixes

* 🐛 apps router ([8324eaa](https://github.com/antvis/x6/commit/8324eaa0a85cb14873f5095fe8d2695d80b5215a))
