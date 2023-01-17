## @antv/x6-example-features [2.0.2](https://github.com/antvis/X6/compare/@antv/x6-example-features@2.0.1...@antv/x6-example-features@2.0.2) (2023-01-17)


### Bug Fixes

* **mindmap demo:** can not find target id when create edge ([#3144](https://github.com/antvis/X6/issues/3144)) ([bfc8d7f](https://github.com/antvis/X6/commit/bfc8d7f17ac900f70b696c1fa7a3f3f3a389103f))

## @antv/x6-example-features [2.0.1](https://github.com/antvis/X6/compare/@antv/x6-example-features@2.0.0...@antv/x6-example-features@2.0.1) (2022-12-16)


### Bug Fixes

* make resizing options take effect ([#3014](https://github.com/antvis/X6/issues/3014)) ([604c024](https://github.com/antvis/X6/commit/604c0244cd71ec8e911754dfe524f12c04e4e9ad))

# @antv/x6-example-features [2.0.0](https://github.com/antvis/X6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@2.0.0) (2022-11-24)


### Bug Fixes

* 🐛 add return value for autoScroller in scroller plugin ([5e102a3](https://github.com/antvis/X6/commit/5e102a39c5bd14a478edd4f36c4264997027c2a9))
* 🐛 add timeout for schedule ([#2303](https://github.com/antvis/X6/issues/2303)) ([a6a2d12](https://github.com/antvis/X6/commit/a6a2d12b07add27ef19eebbf7b5ca7cd17dde09e))
* 🐛 break text with chinese characters(double byte character) ([14199bc](https://github.com/antvis/X6/commit/14199bc8529adddb347ef934926503a789b64980)), closes [#596](https://github.com/antvis/X6/issues/596)
* 🐛 change jobqueue to transient ([0e39d94](https://github.com/antvis/X6/commit/0e39d9447bc8c0ba0b11c272bf9b64df9ba95a33))
* 🐛 do not generate new commands on redoing/undoing ([5b3d713](https://github.com/antvis/X6/commit/5b3d7133f3a7b4841f461e67af5963ec84820741)), closes [#627](https://github.com/antvis/X6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([949a42d](https://github.com/antvis/X6/commit/949a42dacfc5023d25bcabc0a3a1a7d8578f1b96)), closes [#644](https://github.com/antvis/X6/issues/644) [#564](https://github.com/antvis/X6/issues/564)
* 🐛 fix add tools not work ([f5d1d6a](https://github.com/antvis/X6/commit/f5d1d6a326021247ee8967675fc9490ddbb6d0aa))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/X6/issues/789)) ([7638143](https://github.com/antvis/X6/commit/7638143b04c0a50a333200423753f6bd19a6ceb3))
* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/X6/issues/1111)) ([d5c854f](https://github.com/antvis/X6/commit/d5c854f644e4926dba2913a216870bdbaafd425a))
* 🐛 fix the error in selected nodes position when snapline enabled ([#2797](https://github.com/antvis/X6/issues/2797)) ([1e7f132](https://github.com/antvis/X6/commit/1e7f132bed15006cc5535f1294f0b8a545dd6441))
* 🐛 fix type error ([30ca7a9](https://github.com/antvis/X6/commit/30ca7a92817d28e58589413e36d3d2931360b8ae))
* 🐛 fix x6-react-components version in demo ([709cdae](https://github.com/antvis/X6/commit/709cdae33d13acfd77af11e8bb5fb4f493dd5bd5))
* 🐛 interact with input rendered in react component ([82478b1](https://github.com/antvis/X6/commit/82478b1d66e3b8b4346dab9041cb00e54fea9be1))
* 🐛 linear gradient along edge path ([669fc5b](https://github.com/antvis/X6/commit/669fc5bd2d57635ce9d45dc0470674dad74f4add)), closes [#635](https://github.com/antvis/X6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([333689a](https://github.com/antvis/X6/commit/333689a880a30dbc0879705b7f655cec8d30f1df)), closes [#635](https://github.com/antvis/X6/issues/635)
* 🐛 optimize cell remove method ([391fe8f](https://github.com/antvis/X6/commit/391fe8fd88f10d936c5860f465c7a423632f30f9))
* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/X6/issues/1391)) ([cc01fdf](https://github.com/antvis/X6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([9dded68](https://github.com/antvis/X6/commit/9dded6853d66b86e7bbeb738b2df15b51d1a8627))
* 🐛 should render vertices tool with lowest z-index ([213a01f](https://github.com/antvis/X6/commit/213a01fca28b1e790ce58d228aa460ea798bb98f)), closes [#638](https://github.com/antvis/X6/issues/638)
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/X6/issues/1425)) ([4208846](https://github.com/antvis/X6/commit/4208846337326d8983f1662faa8da67efd8568b4))
* fix contextmenu show multiple times ([5d437ce](https://github.com/antvis/X6/commit/5d437cef07427bf9f2cbae9b2e08dd4a6544ff70))
* fix demo import path error ([2ebf581](https://github.com/antvis/X6/commit/2ebf581dc1ec9c5ee4501917a7cbddbbb4b69c0f))
* fix path error in custom router demo ([#620](https://github.com/antvis/X6/issues/620)) ([7cd3a7e](https://github.com/antvis/X6/commit/7cd3a7e57d772481ad33949ee832a36aab59ef3a))
* refactor example ([#2831](https://github.com/antvis/X6/issues/2831)) ([3d8f005](https://github.com/antvis/X6/commit/3d8f005696021f1d9f91a96812ebadce179f2d73))
* remove x6-common and x6-geometry deps ([#2830](https://github.com/antvis/X6/issues/2830)) ([5b5f5aa](https://github.com/antvis/X6/commit/5b5f5aa7ea6fded1b15abc79b9b5a5e2281b3ab9))
* update dependencies and fix type errors ([#1103](https://github.com/antvis/X6/issues/1103)) ([49d4371](https://github.com/antvis/X6/commit/49d43716ada672e609e4e6d9c6fdca3f494b6f68))
* **wip:** 🐛 click event of contextmenu was not triggered ([2c9363e](https://github.com/antvis/X6/commit/2c9363e46904979901d4b467995d289c094d329a))


### chore

* release beta ([b5f3cfa](https://github.com/antvis/X6/commit/b5f3cfa2042f5196a995a38a8f41f140cabdce57))


### Documentation

* refresh changelogs ([44f89a1](https://github.com/antvis/X6/commit/44f89a1e1a85513a9bf548be87be38e3cdc82574))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([ab6a06f](https://github.com/antvis/X6/commit/ab6a06f1fe70b71ae31acc47b0d9cb02c86097e2))
* ✨ add autoResize feature ([5aeae97](https://github.com/antvis/X6/commit/5aeae976cd7638b2b5c05bc12bc56b562366fe5f))
* ✨ add clipboard plugin ([8107f6d](https://github.com/antvis/X6/commit/8107f6df5de52a33e1b8094a44d59ee7fd2a8042))
* ✨ add dnd plugin ([269fae9](https://github.com/antvis/X6/commit/269fae9e5eeb969c6a7884373aa3a32002c064e6))
* ✨ add history plugin ([#2819](https://github.com/antvis/X6/issues/2819)) ([fd8d384](https://github.com/antvis/X6/commit/fd8d384a29d0f2e02bf066efd19ed3f92614c524))
* ✨ add html shape ([8d75504](https://github.com/antvis/X6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ add keyboard plugin ([#2665](https://github.com/antvis/X6/issues/2665)) ([bf53677](https://github.com/antvis/X6/commit/bf536778ca7ee3229390dfcfcb085ec55edd9fb2))
* ✨ add library for manipulating and animating SVG ([c07a177](https://github.com/antvis/X6/commit/c07a17785fc99372baaa66ea2525acf1d332fa11))
* ✨ add minimap plugin ([6cdecbb](https://github.com/antvis/X6/commit/6cdecbbba9a4db1f67189e23fb89f2a7ba2af99e))
* ✨ add panning and mousewheel module ([#2243](https://github.com/antvis/X6/issues/2243)) ([55d36e4](https://github.com/antvis/X6/commit/55d36e46808a4c79b086d7798bce396d5211a1dc))
* ✨ add scroller api ([12173bf](https://github.com/antvis/X6/commit/12173bf500624f197ed56cf6a797499587178cba))
* ✨ add selection plugin ([#2742](https://github.com/antvis/X6/issues/2742)) ([50a5dc7](https://github.com/antvis/X6/commit/50a5dc7cd8c2e39a1f8bf8359a0eb189dda8cb86))
* ✨ add snapline plugin ([294672b](https://github.com/antvis/X6/commit/294672b3066b15ab834ce2a3172facc49004c950))
* ✨ add some missing api ([1dcb3d9](https://github.com/antvis/X6/commit/1dcb3d92fd83e5dfd1a1af9670d539a99dd9f55a))
* ✨ add stencil plugin ([#2815](https://github.com/antvis/X6/issues/2815)) ([4e1fb7b](https://github.com/antvis/X6/commit/4e1fb7bef8ff5548edf2529eb27be0a66a600996))
* ✨ add transform plugin ([#2818](https://github.com/antvis/X6/issues/2818)) ([660e2d7](https://github.com/antvis/X6/commit/660e2d7689bfa59a0f4a4a5e3c0ace70dec21e9e))
* ✨ add virtual render feature ([#2198](https://github.com/antvis/X6/issues/2198)) ([fcba5e1](https://github.com/antvis/X6/commit/fcba5e14808d44c80b658c090cc2a4ebcdc64f6d))
* ✨ add xmind demo ([adb2c98](https://github.com/antvis/X6/commit/adb2c98e23e93b7084fd20f05801f2595d4ac990))
* ✨ auto resize graph when container resized ([9c7bc9a](https://github.com/antvis/X6/commit/9c7bc9a4bb210451283663cd99a29bd6c79e2ec4)), closes [#531](https://github.com/antvis/X6/issues/531)
* ✨ export common and geometry in x6 package ([#2820](https://github.com/antvis/X6/issues/2820)) ([df28200](https://github.com/antvis/X6/commit/df282000cc5e17521147c77c210e172c444c9938))
* ✨ expose the selection api ([#2756](https://github.com/antvis/X6/issues/2756)) ([f3edbbc](https://github.com/antvis/X6/commit/f3edbbc95d2038a61116fa71bb0c3016f1c92d5e))
* ✨ improve auto-resize feature ([40d5335](https://github.com/antvis/X6/commit/40d53355cedc0bbbeb1e26948b67254dc6a40d85))
* ✨ random path demo ([38ec683](https://github.com/antvis/X6/commit/38ec683673e2da64296521f23a91f951a442adc0))
* ✨ support inherit options for react-shape registry ([#2596](https://github.com/antvis/X6/issues/2596)) ([ad63046](https://github.com/antvis/X6/commit/ad63046e89fa5853b0cf15947af1ed2a7b625188))
* ✨ support panning scroller graph byrightmousedown ([6ffdb50](https://github.com/antvis/X6/commit/6ffdb5004401b30ff5852a08de9286a934780be3))
* add scroller plugin ([#2580](https://github.com/antvis/X6/issues/2580)) ([5e0e2ac](https://github.com/antvis/X6/commit/5e0e2acde7d7e259ea27d001983e950878d0ecc8))
* attach plugin api and events to grpah instance ([#2864](https://github.com/antvis/X6/issues/2864)) ([774f547](https://github.com/antvis/X6/commit/774f547b85522eb2411dca949d36ecfe535503f3))
* force release 2.0-beta ([6987d9c](https://github.com/antvis/X6/commit/6987d9ce64454cd76f697d33f96715dbdf56524a))
* support mouseenter and mouseleave event ([#2559](https://github.com/antvis/X6/issues/2559)) ([ecfd426](https://github.com/antvis/X6/commit/ecfd4263b1266a128bf8651c4dd745ff8ab038b3))
* sync code from master ([#2004](https://github.com/antvis/X6/issues/2004)) ([c681405](https://github.com/antvis/X6/commit/c68140504bd21f654870f3d2fc1ad2f16f1113c8)), closes [#1974](https://github.com/antvis/X6/issues/1974) [#1977](https://github.com/antvis/X6/issues/1977) [#1985](https://github.com/antvis/X6/issues/1985) [#1988](https://github.com/antvis/X6/issues/1988) [#1991](https://github.com/antvis/X6/issues/1991) [#1989](https://github.com/antvis/X6/issues/1989)
* upgrade react to 18 in react-components ([#2836](https://github.com/antvis/X6/issues/2836)) ([5138562](https://github.com/antvis/X6/commit/5138562515ddbd3975adc9d93514f21d6fc2bb3e))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([ba5b22a](https://github.com/antvis/X6/commit/ba5b22a33a0af067d77735c5cc46a60a45734dca))
* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/X6/issues/1449)) ([0b5f241](https://github.com/antvis/X6/commit/0b5f2413f0b907316784149027615ae2d09616a4))
* ⚡️ check whether label existed in port ([#2063](https://github.com/antvis/X6/issues/2063)) ([5ae7271](https://github.com/antvis/X6/commit/5ae7271a25e804a9321aa80e31dcf6e43144728b))
* ⚡️ optimize breakText for a high performance version ([#2242](https://github.com/antvis/X6/issues/2242)) ([0aced58](https://github.com/antvis/X6/commit/0aced58056d908ec092bca1889b5ef367a94fe68))
* ⚡️ optimize node render performance ([6554959](https://github.com/antvis/X6/commit/65549599d2f82f8052d16776c8d36ce7ee2fba9b))
* ⚡️ repalce getTransformToElement and getBBox to improve performance ([#2177](https://github.com/antvis/X6/issues/2177)) ([1436586](https://github.com/antvis/X6/commit/1436586f85cc2e2f6ec71548f6d6c232be793154))


### BREAKING CHANGES

* dump to 2.0
* force release 2.0-beta
* 2.0-beta
