## @antv/x6 [1.30.1](https://github.com/antvis/x6/compare/@antv/x6@1.30.0...@antv/x6@1.30.1) (2022-02-21)


### Bug Fixes

* 🐛 fix source graph and target graph not updating synchronously when transform in panning mode ([#1832](https://github.com/antvis/x6/issues/1832)) ([0de1f22](https://github.com/antvis/x6/commit/0de1f2227158fc8c6c6f762de64b8a50118292a9))

# @antv/x6 [1.30.0](https://github.com/antvis/x6/compare/@antv/x6@1.29.6...@antv/x6@1.30.0) (2022-01-22)


### Bug Fixes

* 🐛 not create label when text is empty ([#1783](https://github.com/antvis/x6/issues/1783)) ([ed1fcd1](https://github.com/antvis/x6/commit/ed1fcd1f26601150d1b7913b8eaaf329a958af53))


### Features

* ✨ add insertPort api ([#1763](https://github.com/antvis/x6/issues/1763)) ([6809dba](https://github.com/antvis/x6/commit/6809dba2d86308d0b315d0c6164f91d80e8a40ff))

## @antv/x6 [1.29.6](https://github.com/antvis/x6/compare/@antv/x6@1.29.5...@antv/x6@1.29.6) (2022-01-13)


### Bug Fixes

* node input cannot get focus when keyboard options.global is enabled ([#1754](https://github.com/antvis/x6/issues/1754)) ([61b26b7](https://github.com/antvis/x6/commit/61b26b70688164de1a794029cd877f6ecdc98fb2)), closes [Close#1753](https://github.com/Close/issues/1753)

## @antv/x6 [1.29.5](https://github.com/antvis/x6/compare/@antv/x6@1.29.4...@antv/x6@1.29.5) (2022-01-10)


### Bug Fixes

* 🐛 change startBatch to stopBatch ([#1744](https://github.com/antvis/x6/issues/1744)) ([7d9a2de](https://github.com/antvis/x6/commit/7d9a2deb4cd0d5bccc14a75af45daa9c4215b076))

## @antv/x6 [1.29.4](https://github.com/antvis/x6/compare/@antv/x6@1.29.3...@antv/x6@1.29.4) (2022-01-08)


### Bug Fixes

* 🐛 stop panning when mouseleave body ([#1741](https://github.com/antvis/x6/issues/1741)) ([d23ea46](https://github.com/antvis/x6/commit/d23ea460109e3f487dbc249db9545e8d440f0789))

## @antv/x6 [1.29.3](https://github.com/antvis/x6/compare/@antv/x6@1.29.2...@antv/x6@1.29.3) (2022-01-08)


### Bug Fixes

* 🐛 add updateCellId api ([#1739](https://github.com/antvis/x6/issues/1739)) ([78cdb3b](https://github.com/antvis/x6/commit/78cdb3bd56e7655ffcb2e5046d00f5d4f932cd3c))

## @antv/x6 [1.29.2](https://github.com/antvis/x6/compare/@antv/x6@1.29.1...@antv/x6@1.29.2) (2022-01-07)


### Bug Fixes

* 🐛 add zindex for x6-widget-dne ([#1722](https://github.com/antvis/x6/issues/1722)) ([bf5b932](https://github.com/antvis/x6/commit/bf5b9329bd0d929ecba66c82af7f1ad934663669))
* fix typo in model ([#1720](https://github.com/antvis/x6/issues/1720)) ([4119a1e](https://github.com/antvis/x6/commit/4119a1e62420e765dedac55311ca80d9c5c4441b))

## @antv/x6 [1.29.1](https://github.com/antvis/x6/compare/@antv/x6@1.29.0...@antv/x6@1.29.1) (2021-12-24)


### Bug Fixes

* 🐛 add exception check for isLine and isCurve ([#1686](https://github.com/antvis/x6/issues/1686)) ([25c17b7](https://github.com/antvis/x6/commit/25c17b7679589b065c77625526ac0884fef05035))
* 🐛 unexpected feedback in "vertices" edge tool ([#1680](https://github.com/antvis/x6/issues/1680)) ([307584f](https://github.com/antvis/x6/commit/307584f017cedcaf9bc4f4e5b4eefdcabcb35926)), closes [antvis/X6#1679](https://github.com/antvis/X6/issues/1679)

# @antv/x6 [1.29.0](https://github.com/antvis/x6/compare/@antv/x6@1.28.1...@antv/x6@1.29.0) (2021-12-17)


### Bug Fixes

* 🐛 fix lint error ([#1649](https://github.com/antvis/x6/issues/1649)) ([f793682](https://github.com/antvis/x6/commit/f7936826f026169ccf094cee28f54bb13d15ef9b))
* 🐛 get children or parent delay ([#1641](https://github.com/antvis/x6/issues/1641)) ([8508b91](https://github.com/antvis/x6/commit/8508b91da297fef7819d6404854f4592466dec62))
* 🐛 listen mousedown event on scroller container ([#1642](https://github.com/antvis/x6/issues/1642)) ([7687cb2](https://github.com/antvis/x6/commit/7687cb201a7b2be38b67524f99d4226b9e3e30d1))
* 🐛 release x6 v1.28.2 ([#1654](https://github.com/antvis/x6/issues/1654)) ([745b90a](https://github.com/antvis/x6/commit/745b90ac94dbbd9443ecf1456e6a5aa9eb646594))
* 🐛 update x6 version ([#1655](https://github.com/antvis/x6/issues/1655)) ([07037be](https://github.com/antvis/x6/commit/07037beb59537d0feaa47ac1ab629d8c9b8c3a8b))
* 🐛 update x6-vector version ([#1656](https://github.com/antvis/x6/issues/1656)) ([d4d2125](https://github.com/antvis/x6/commit/d4d21251cc42d263327ea72edb8a038d7ef71c89))


### Features

* ✨ update x6 and x6-vector version ([#1659](https://github.com/antvis/x6/issues/1659)) ([a199b59](https://github.com/antvis/x6/commit/a199b590d5f108b51162e276b432fbb3737d2c14))

## @antv/x6 [1.28.1](https://github.com/antvis/x6/compare/@antv/x6@1.28.0...@antv/x6@1.28.1) (2021-10-08)


### Bug Fixes

* 🐛 fiter nodes when rubberband ([#1408](https://github.com/antvis/x6/issues/1408)) ([35ad628](https://github.com/antvis/x6/commit/35ad628a1b51630aedbed038eb0ff05c6575ca09))

# @antv/x6 [1.28.0](https://github.com/antvis/x6/compare/@antv/x6@1.27.2...@antv/x6@1.28.0) (2021-10-02)


### Bug Fixes

* 🐛 modify the font size even if the text does not change ([#1397](https://github.com/antvis/x6/issues/1397)) ([f93c290](https://github.com/antvis/x6/commit/f93c290abd8e546e76feb914c4f0457aa6f1bbbf))
* 🐛 stop propagation when enable following ([#1398](https://github.com/antvis/x6/issues/1398)) ([59cbe44](https://github.com/antvis/x6/commit/59cbe44cf308e7b452ac0fba37dd19c86324e475))


### Features

* ✨ add batch for selection ([#1399](https://github.com/antvis/x6/issues/1399)) ([276abac](https://github.com/antvis/x6/commit/276abac2949bd6c2160e749e0d4e41d9201ae08e))
* ✨ add excludeHiddenNodes for manhattan router ([#1400](https://github.com/antvis/x6/issues/1400)) ([c57908f](https://github.com/antvis/x6/commit/c57908fc7e6183319f27a8acc0e3567e76d11e6e))

## @antv/x6 [1.27.2](https://github.com/antvis/x6/compare/@antv/x6@1.27.1...@antv/x6@1.27.2) (2021-10-01)


### Bug Fixes

* 🐛 can not select flat edge ([#1394](https://github.com/antvis/x6/issues/1394)) ([89ae2cc](https://github.com/antvis/x6/commit/89ae2ccdc02ae2dfb8d4f9a1b10dd81a77a59b10))


### Performance Improvements

* ⚡️ improve box selection performance ([#1393](https://github.com/antvis/x6/issues/1393)) ([175aa58](https://github.com/antvis/x6/commit/175aa587202fa687555815a448c9bf80926b166e))

## @antv/x6 [1.27.1](https://github.com/antvis/x6/compare/@antv/x6@1.27.0...@antv/x6@1.27.1) (2021-10-01)


### Bug Fixes

* 🐛 draw background multiple times to show the last image ([#1389](https://github.com/antvis/x6/issues/1389)) ([e44098d](https://github.com/antvis/x6/commit/e44098d04b886d9b54b752bee2dcaa57db6b5a3f))

# @antv/x6 [1.27.0](https://github.com/antvis/x6/compare/@antv/x6@1.26.3...@antv/x6@1.27.0) (2021-09-30)


### Bug Fixes

* 🐛 normalize event before get clientX ([#1387](https://github.com/antvis/x6/issues/1387)) ([ba4aedc](https://github.com/antvis/x6/commit/ba4aedc49793fa681cd73a4790ab4dc34e3cf936))


### Features

* ✨ add resizeGroup for stencil ([#1388](https://github.com/antvis/x6/issues/1388)) ([4baba33](https://github.com/antvis/x6/commit/4baba3326bc9ecbbd9c272fcfa4ee3d3c0389db3))

## @antv/x6 [1.26.3](https://github.com/antvis/x6/compare/@antv/x6@1.26.2...@antv/x6@1.26.3) (2021-09-22)


### Bug Fixes

* 🐛 fix option merge order in paste ([#1350](https://github.com/antvis/x6/issues/1350)) ([016303c](https://github.com/antvis/x6/commit/016303c936ccbc23e7bbb80c8461e4ba9fe8d14f))
* segments & vertices tool add onChanged callback ([#1348](https://github.com/antvis/x6/issues/1348)) ([502856c](https://github.com/antvis/x6/commit/502856c3b89a4613859c7152ec212253ec7919d8))

## @antv/x6 [1.26.2](https://github.com/antvis/x6/compare/@antv/x6@1.26.1...@antv/x6@1.26.2) (2021-09-13)

## @antv/x6 [1.26.1](https://github.com/antvis/x6/compare/@antv/x6@1.26.0...@antv/x6@1.26.1) (2021-08-31)


### Bug Fixes

* 🐛 not stopPropagation when mousedown ([#1305](https://github.com/antvis/x6/issues/1305)) ([6a3f96d](https://github.com/antvis/x6/commit/6a3f96d3b5754def401084e023dad466c013cc49))

# @antv/x6 [1.26.0](https://github.com/antvis/x6/compare/@antv/x6@1.25.5...@antv/x6@1.26.0) (2021-08-24)


### Features

* 🎸 为定义业务数据的 data 属性提供类型定义 ([#1278](https://github.com/antvis/x6/issues/1278)) ([412d035](https://github.com/antvis/x6/commit/412d035687c6caf235f2afb1fa23d830d2a5f002))

## @antv/x6 [1.25.5](https://github.com/antvis/x6/compare/@antv/x6@1.25.4...@antv/x6@1.25.5) (2021-08-18)


### Bug Fixes

* 🐛 optimize get child method ([#1262](https://github.com/antvis/x6/issues/1262)) ([c7212bb](https://github.com/antvis/x6/commit/c7212bb1ec059f2d2379f0b6c8ffe0e6edd52aad))

## @antv/x6 [1.25.4](https://github.com/antvis/x6/compare/@antv/x6@1.25.3...@antv/x6@1.25.4) (2021-08-17)


### Bug Fixes

* 🐛 add keepId for node clone ([#1254](https://github.com/antvis/x6/issues/1254)) ([7c51152](https://github.com/antvis/x6/commit/7c51152f03998c26b740eec640961193c29ebd34))

## @antv/x6 [1.25.3](https://github.com/antvis/x6/compare/@antv/x6@1.25.2...@antv/x6@1.25.3) (2021-08-06)


### Bug Fixes

* 🐛 translateSelected nodes exclude self ([#1238](https://github.com/antvis/x6/issues/1238)) ([31a3442](https://github.com/antvis/x6/commit/31a3442c92265e12830b28de2988b23008ca4666))

## @antv/x6 [1.25.2](https://github.com/antvis/x6/compare/@antv/x6@1.25.1...@antv/x6@1.25.2) (2021-08-06)


### Bug Fixes

* 🐛 fix scroller content size when not autoResize ([#1237](https://github.com/antvis/x6/issues/1237)) ([1010f39](https://github.com/antvis/x6/commit/1010f394e6a6390dae74ba30dfbb4493e5193ddc))

## @antv/x6 [1.25.1](https://github.com/antvis/x6/compare/@antv/x6@1.25.0...@antv/x6@1.25.1) (2021-08-03)


### Bug Fixes

* 🐛 remove prop not remove attr ([#1225](https://github.com/antvis/x6/issues/1225)) ([ba2350d](https://github.com/antvis/x6/commit/ba2350dcc930a9a4ab350862db67a5415fe41cfd))
* 🐛 Stencil searches are case sensitive ([#1211](https://github.com/antvis/x6/issues/1211)) ([c28289c](https://github.com/antvis/x6/commit/c28289c3c9f0552b14c81999542374649271e495))

# @antv/x6 [1.25.0](https://github.com/antvis/x6/compare/@antv/x6@1.24.8...@antv/x6@1.25.0) (2021-07-27)


### Bug Fixes

* 🐛 change type of padding in ScaleContentToFitOptions ([#1203](https://github.com/antvis/x6/issues/1203)) ([692ea04](https://github.com/antvis/x6/commit/692ea043854095535273e7a9ff2e4f8809faee81))


### Features

* ✨ add cell-editor tool ([#1202](https://github.com/antvis/x6/issues/1202)) ([2286097](https://github.com/antvis/x6/commit/228609783e1b3a3ff579ce9d38cf2e70dacd4931))

## @antv/x6 [1.24.8](https://github.com/antvis/x6/compare/@antv/x6@1.24.7...@antv/x6@1.24.8) (2021-07-22)


### Bug Fixes

* 🐛 auto scroller when selection over graph ([#1197](https://github.com/antvis/x6/issues/1197)) ([ffc801b](https://github.com/antvis/x6/commit/ffc801b9550fd55a03a2642051a84ef586d88ee7))

## @antv/x6 [1.24.7](https://github.com/antvis/x6/compare/@antv/x6@1.24.6...@antv/x6@1.24.7) (2021-07-21)


### Bug Fixes

* 🐛 revert optimze find snap elem ([#1192](https://github.com/antvis/x6/issues/1192)) ([c7bbc27](https://github.com/antvis/x6/commit/c7bbc2747c2851401aabc94417f8bab6fee1e8ea))

## @antv/x6 [1.24.6](https://github.com/antvis/x6/compare/@antv/x6@1.24.5...@antv/x6@1.24.6) (2021-07-21)

## @antv/x6 [1.24.5](https://github.com/antvis/x6/compare/@antv/x6@1.24.4...@antv/x6@1.24.5) (2021-07-09)


### Bug Fixes

* 🐛 unified panning api ([#1151](https://github.com/antvis/x6/issues/1151)) ([fc78817](https://github.com/antvis/x6/commit/fc7881731bfc5c7cde698ca8948dfa0c40f891fc))

## @antv/x6 [1.24.4](https://github.com/antvis/x6/compare/@antv/x6@1.24.3...@antv/x6@1.24.4) (2021-06-23)


### Bug Fixes

* 🐛 add toolsAddable config for interacting ([#1124](https://github.com/antvis/x6/issues/1124)) ([5dde09c](https://github.com/antvis/x6/commit/5dde09c4fc99e395947d8839adb67ab6c20abbe7))

## @antv/x6 [1.24.3](https://github.com/antvis/x6/compare/@antv/x6@1.24.2...@antv/x6@1.24.3) (2021-06-22)


### Bug Fixes

* 🐛 fix alerts of lgtm ([3e75128](https://github.com/antvis/x6/commit/3e75128390a0e649cc2c9e4ee86eb4f534b99f23))
* 🐛 fix type definitions ([a6922f8](https://github.com/antvis/x6/commit/a6922f81c80566877e2ca41af5261e6bb12aa4f5))

## @antv/x6 [1.24.2](https://github.com/antvis/x6/compare/@antv/x6@1.24.1...@antv/x6@1.24.2) (2021-06-21)


### Bug Fixes

* 🐛 auto scroll graph when drag magnet ([#1121](https://github.com/antvis/x6/issues/1121)) ([fde89fc](https://github.com/antvis/x6/commit/fde89fcf14e4dec9d9bf15489290cc145c29e400))

## @antv/x6 [1.24.1](https://github.com/antvis/x6/compare/@antv/x6@1.24.0...@antv/x6@1.24.1) (2021-06-21)


### Bug Fixes

* 🐛 revert fix scroller content size ([#1120](https://github.com/antvis/x6/issues/1120)) ([7546ea2](https://github.com/antvis/x6/commit/7546ea2b878d0037eec0362184464664cd797b69))

# @antv/x6 [1.24.0](https://github.com/antvis/x6/compare/@antv/x6@1.23.13...@antv/x6@1.24.0) (2021-06-19)


### Features

* ✨ optimize selection event handle ([#1115](https://github.com/antvis/x6/issues/1115)) ([41fe23b](https://github.com/antvis/x6/commit/41fe23b6b959782487c0db03215fcfcf5c821b87))

## @antv/x6 [1.23.13](https://github.com/antvis/x6/compare/@antv/x6@1.23.12...@antv/x6@1.23.13) (2021-06-19)


### Bug Fixes

* 🐛 preventScroll when focus graph ([#1116](https://github.com/antvis/x6/issues/1116)) ([9b66853](https://github.com/antvis/x6/commit/9b66853e143825de669fa5c97e1540971e835bed))

## @antv/x6 [1.23.12](https://github.com/antvis/x6/compare/@antv/x6@1.23.11...@antv/x6@1.23.12) (2021-06-17)


### Bug Fixes

* 🐛 fix demo error in x6 sites ([#1108](https://github.com/antvis/x6/issues/1108)) ([575aba0](https://github.com/antvis/x6/commit/575aba08c8901cc7753adcf7568d44b5845bc6e4))

## @antv/x6 [1.23.11](https://github.com/antvis/x6/compare/@antv/x6@1.23.10...@antv/x6@1.23.11) (2021-06-17)


### Bug Fixes

* 🐛 alerts on lgtm.com ([#1104](https://github.com/antvis/x6/issues/1104)) ([6eb34b1](https://github.com/antvis/x6/commit/6eb34b1d9a25462593ba5e4a69995cca5211bc0c))

## @antv/x6 [1.23.10](https://github.com/antvis/x6/compare/@antv/x6@1.23.9...@antv/x6@1.23.10) (2021-06-16)


### Bug Fixes

* 🐛 fix node:move event triggered source ([cca97ff](https://github.com/antvis/x6/commit/cca97ff1ed44a45ca6ef0acf9b2c2d38070cb4cb))
* 🐛 fix the embedded triggered source ([a922aa4](https://github.com/antvis/x6/commit/a922aa42b6a726fd7daf45d283d5b4a9c792e4a8))
* 🐛 optimize cell remove method ([c6fd5da](https://github.com/antvis/x6/commit/c6fd5da9e5b8b89b3eff13f1026da0298ac397e9))
* 🐛 specify return type ([cea7ae1](https://github.com/antvis/x6/commit/cea7ae11364d4bc521d41cc254d6c35484a34b8a))
* update dependencies and fix type errors ([#1103](https://github.com/antvis/x6/issues/1103)) ([056b862](https://github.com/antvis/x6/commit/056b862b4efe7dbdc559cac7194c2453996acc07))

## @antv/x6 [1.23.9](https://github.com/antvis/x6/compare/@antv/x6@1.23.8...@antv/x6@1.23.9) (2021-06-15)


### Bug Fixes

* 🐛 translateSelectionNodes is only triggered manually ([6d445da](https://github.com/antvis/x6/commit/6d445dac3a83f5e39d0ed8ce2b05e6055a6decaa))

## @antv/x6 [1.23.8](https://github.com/antvis/x6/compare/@antv/x6@1.23.7...@antv/x6@1.23.8) (2021-06-13)


### Bug Fixes

* 🐛 not clean selection when mousedown ([d6195a7](https://github.com/antvis/x6/commit/d6195a74f3765d65fcdf42dd0de7739fb8867f75))

## @antv/x6 [1.23.7](https://github.com/antvis/x6/compare/@antv/x6@1.23.6...@antv/x6@1.23.7) (2021-06-11)


### Bug Fixes

* 🐛 check target file before read it ([8e8be17](https://github.com/antvis/x6/commit/8e8be17818421042ac6c1bd3d0176d1f9b79bb20))

## @antv/x6 [1.23.6](https://github.com/antvis/x6/compare/@antv/x6@1.23.5...@antv/x6@1.23.6) (2021-06-09)

## @antv/x6 [1.23.5](https://github.com/antvis/x6/compare/@antv/x6@1.23.4...@antv/x6@1.23.5) (2021-06-09)


### Bug Fixes

* 🐛 fix background size when not defined, fixed [#1070](https://github.com/antvis/x6/issues/1070) ([#1072](https://github.com/antvis/x6/issues/1072)) ([ada59be](https://github.com/antvis/x6/commit/ada59be847cb139040c8ee8b68603756194201cd))

## @antv/x6 [1.23.4](https://github.com/antvis/x6/compare/@antv/x6@1.23.3...@antv/x6@1.23.4) (2021-06-09)

## @antv/x6 [1.23.3](https://github.com/antvis/x6/compare/@antv/x6@1.23.2...@antv/x6@1.23.3) (2021-06-07)


### Bug Fixes

* 🐛 fix scroller content size when not autoResize ([1a77b44](https://github.com/antvis/x6/commit/1a77b4464c6397c407d848adb17f8aa90131d63d))

## @antv/x6 [1.23.2](https://github.com/antvis/x6/compare/@antv/x6@1.23.1...@antv/x6@1.23.2) (2021-06-07)


### Bug Fixes

* 🐛 optimize addTools params ([9fb3a51](https://github.com/antvis/x6/commit/9fb3a514c2d34dee61d1ee5acd68416ae5bd5cfa))

## @antv/x6 [1.23.1](https://github.com/antvis/x6/compare/@antv/x6@1.23.0...@antv/x6@1.23.1) (2021-06-02)

# @antv/x6 [1.23.0](https://github.com/antvis/x6/compare/@antv/x6@1.22.1...@antv/x6@1.23.0) (2021-06-02)


### Features

* ✨ support minimap in normal graph ([3ce87d9](https://github.com/antvis/x6/commit/3ce87d91a952e9b8bf61988cba1cc8cedd39b942))

## @antv/x6 [1.22.1](https://github.com/antvis/x6/compare/@antv/x6@1.22.0...@antv/x6@1.22.1) (2021-06-01)


### Bug Fixes

* 🐛 fix bbox calc error in firefox ([328eb7e](https://github.com/antvis/x6/commit/328eb7e980fae6091ca94ce20f867f3694788446))

# @antv/x6 [1.22.0](https://github.com/antvis/x6/compare/@antv/x6@1.21.7...@antv/x6@1.22.0) (2021-05-27)


### Features

* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))

## @antv/x6 [1.21.7](https://github.com/antvis/x6/compare/@antv/x6@1.21.6...@antv/x6@1.21.7) (2021-05-18)


### Bug Fixes

* 🐛 fix handledTranslation option passing to child node ([0244e0d](https://github.com/antvis/x6/commit/0244e0d919e9a7ebdd97dede4be456290560da8a))

## @antv/x6 [1.21.6](https://github.com/antvis/x6/compare/@antv/x6@1.21.5...@antv/x6@1.21.6) (2021-05-18)


### Bug Fixes

* 🐛 fix node translation with selected children ([770d1d1](https://github.com/antvis/x6/commit/770d1d1e75575aaa7dce9f6c503af982393a076d))

## @antv/x6 [1.21.5](https://github.com/antvis/x6/compare/@antv/x6@1.21.4...@antv/x6@1.21.5) (2021-05-14)

## @antv/x6 [1.21.4](https://github.com/antvis/x6/compare/@antv/x6@1.21.3...@antv/x6@1.21.4) (2021-05-12)


### Bug Fixes

* 🐛 revert getBoundingRect change ([703eead](https://github.com/antvis/x6/commit/703eeade93332890ec8d7e4879043db2e8257a75))

## @antv/x6 [1.21.3](https://github.com/antvis/x6/compare/@antv/x6@1.21.2...@antv/x6@1.21.3) (2021-05-08)


### Bug Fixes

* 🐛 only delay svg attr ([5d804a2](https://github.com/antvis/x6/commit/5d804a253cb56b71dbf551f95a6160a079a7f6d2))

## @antv/x6 [1.21.2](https://github.com/antvis/x6/compare/@antv/x6@1.21.1...@antv/x6@1.21.2) (2021-05-07)


### Bug Fixes

* 🐛 fix getBBoxByElementAttr ([0a540da](https://github.com/antvis/x6/commit/0a540da92bfde24750ea5fd58df247d3dc2f77ce))

## @antv/x6 [1.21.1](https://github.com/antvis/x6/compare/@antv/x6@1.21.0...@antv/x6@1.21.1) (2021-05-07)


### Bug Fixes

* 🐛 support css var in font-size ([c4dde7e](https://github.com/antvis/x6/commit/c4dde7e498c5b892a181e86d9908519bc0e2c200))

# @antv/x6 [1.21.0](https://github.com/antvis/x6/compare/@antv/x6@1.20.0...@antv/x6@1.21.0) (2021-05-06)


### Bug Fixes

* 🐛 add onWheelGuard to prevent unwanted preventDefault ([#945](https://github.com/antvis/x6/issues/945)) ([3d567b1](https://github.com/antvis/x6/commit/3d567b14c3ba1da4522f94a3c8a325b5cf58012e))
* 🐛 fix can not scroller by mousewheel ([dd511f8](https://github.com/antvis/x6/commit/dd511f81a9f96da969381c064188401dd009e42e))


### Features

* ✨ add rubberNode and rubberEdge config ([#949](https://github.com/antvis/x6/issues/949)) ([b715463](https://github.com/antvis/x6/commit/b71546332a91f7a894f453c691efee006fdf4ad0))

# @antv/x6 [1.20.0](https://github.com/antvis/x6/compare/@antv/x6@1.19.6...@antv/x6@1.20.0) (2021-05-04)


### Bug Fixes

* 🐛 optimize usage of mousewheel ([a2851cd](https://github.com/antvis/x6/commit/a2851cd862c9224bb66a8f9bda3e0035259fd940))


### Features

* ✨ panning support rightMouseDown and mousehwheel ([3694cc0](https://github.com/antvis/x6/commit/3694cc080ca5d2a291ba6b2df8c25933bb39b80a))

## @antv/x6 [1.19.6](https://github.com/antvis/x6/compare/@antv/x6@1.19.5...@antv/x6@1.19.6) (2021-05-01)


### Bug Fixes

* 🐛 update delay attrs async when node is not caller ([6e253fc](https://github.com/antvis/x6/commit/6e253fc140b289811442a9a89e4484cb1a7c285c))
* 🐛 validateEdge is sync ([57a6f2b](https://github.com/antvis/x6/commit/57a6f2be0685c91dced5208103051ad30742e87f))

## @antv/x6 [1.19.5](https://github.com/antvis/x6/compare/@antv/x6@1.19.4...@antv/x6@1.19.5) (2021-05-01)


### Bug Fixes

* 🐛 revert delay text attr tmp ([bd41f0c](https://github.com/antvis/x6/commit/bd41f0cba09df2aa029c645a2bc1a8515538dcb5))

## @antv/x6 [1.19.4](https://github.com/antvis/x6/compare/@antv/x6@1.19.3...@antv/x6@1.19.4) (2021-04-30)


### Bug Fixes

* 🐛 del getBBoxOfNeatElement ([d031982](https://github.com/antvis/x6/commit/d031982c85ad1d52de1003958daeb26c4fb468c4))
* 🐛 revert View.find ([88a31d1](https://github.com/antvis/x6/commit/88a31d167de8a2d1dbe3a7acf4fd8cb71cd3a80a))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize marker render ([6e90b6b](https://github.com/antvis/x6/commit/6e90b6b308a854dad97acf7c0577900731c08d9d))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))
* ⚡️ reduce dom op in sortViews ([79800b8](https://github.com/antvis/x6/commit/79800b8c4c007513bfd57abee2c7066fdfdc678e))

## @antv/x6 [1.19.3](https://github.com/antvis/x6/compare/@antv/x6@1.19.2...@antv/x6@1.19.3) (2021-04-28)


### Bug Fixes

* 🐛 add default route for createLines in jumpover ([cb48d31](https://github.com/antvis/x6/commit/cb48d31e58041764f9bbb5f00e285849afd9058e))
* 🐛 fix validateEdge trigger timming ([8bc943d](https://github.com/antvis/x6/commit/8bc943de5ec800d3cff4f68d95bb4d0b1713449c))

## @antv/x6 [1.19.2](https://github.com/antvis/x6/compare/@antv/x6@1.19.1...@antv/x6@1.19.2) (2021-04-28)


### Bug Fixes

* 🐛 check correct magnet in validateConnection ([866c795](https://github.com/antvis/x6/commit/866c79547408e3661a10421590ee5c34f93a53e3))

## @antv/x6 [1.19.1](https://github.com/antvis/x6/compare/@antv/x6@1.19.0...@antv/x6@1.19.1) (2021-04-28)

# @antv/x6 [1.19.0](https://github.com/antvis/x6/compare/@antv/x6@1.18.5...@antv/x6@1.19.0) (2021-04-26)


### Bug Fixes

* 🐛 add comment, want to release new version ([bfeae0c](https://github.com/antvis/x6/commit/bfeae0c4958f6440a5a245a094db237c074d255b))


### Features

* ✨ enhance scroller performance by avoid scoller reflow caused by changing classList ([#909](https://github.com/antvis/x6/issues/909)) ([1346223](https://github.com/antvis/x6/commit/134622397cab7312cb8e9cfc3f78901008a7b49f))
* ✨ postpone keyboard target focusing to improve dragging performance ([f3c04ca](https://github.com/antvis/x6/commit/f3c04ca02945d14e7912a963a11fe89908e1a4c8))

## @antv/x6 [1.18.5](https://github.com/antvis/x6/compare/@antv/x6@1.18.4...@antv/x6@1.18.5) (2021-04-20)


### Bug Fixes

* 🐛 don't change cell id when setProp ([44be23e](https://github.com/antvis/x6/commit/44be23ed5500a3b219ee4774990e8caee58269c3))

## @antv/x6 [1.18.4](https://github.com/antvis/x6/compare/@antv/x6@1.18.3...@antv/x6@1.18.4) (2021-04-17)


### Bug Fixes

* 🐛 change port cursor style when is not magnet ([2a1aa21](https://github.com/antvis/x6/commit/2a1aa2167e73f0bf2992bf2ef264c0401025a3f3))
* 🐛 src dir included in publication ([d2901a8](https://github.com/antvis/x6/commit/d2901a86a065dd5b6537fdf6d7a1249ed4e10a1e))

## @antv/x6 [1.18.3](https://github.com/antvis/x6/compare/@antv/x6@1.18.2...@antv/x6@1.18.3) (2021-04-13)


### Bug Fixes

* 🐛 fix factor calculation in mousewheel ([#855](https://github.com/antvis/x6/issues/855)) ([8a3ecce](https://github.com/antvis/x6/commit/8a3eccec6856a8ff7bfb4464dfed43a0c27097a4))

## @antv/x6 [1.18.2](https://github.com/antvis/x6/compare/@antv/x6@1.18.1...@antv/x6@1.18.2) (2021-03-30)

## @antv/x6 [1.18.1](https://github.com/antvis/x6/compare/@antv/x6@1.18.0...@antv/x6@1.18.1) (2021-03-30)

# @antv/x6 [1.18.0](https://github.com/antvis/x6/compare/@antv/x6@1.17.7...@antv/x6@1.18.0) (2021-03-23)


### Features

* ✨ revert a lint fix commit ([319f30f](https://github.com/antvis/x6/commit/319f30f5e68587623d85a2759142feaf37ac46fc))

## @antv/x6 [1.17.7](https://github.com/antvis/x6/compare/@antv/x6@1.17.6...@antv/x6@1.17.7) (2021-03-23)


### Bug Fixes

* 🐛 fix eslint errors ([06ba121](https://github.com/antvis/x6/commit/06ba121e3b937c5aeebbbe2b24e6db67fc141cb9))
* 🐛 fix karma can not process lodash-es ([f7ae6b1](https://github.com/antvis/x6/commit/f7ae6b1f6b961a01c58d8827a9aaa2d5a984a6e0))

## @antv/x6 [1.17.6](https://github.com/antvis/x6/compare/@antv/x6@1.17.5...@antv/x6@1.17.6) (2021-03-20)


### Bug Fixes

* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))

## @antv/x6 [1.17.5](https://github.com/antvis/x6/compare/@antv/x6@1.17.4...@antv/x6@1.17.5) (2021-03-19)


### Bug Fixes

* 🐛 restrict unembed condition ([2f797fd](https://github.com/antvis/x6/commit/2f797fd13754e3068f321800d1973a0ad3612d4d))

## @antv/x6 [1.17.4](https://github.com/antvis/x6/compare/@antv/x6@1.17.3...@antv/x6@1.17.4) (2021-03-19)


### Bug Fixes

* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))

## @antv/x6 [1.17.3](https://github.com/antvis/x6/compare/@antv/x6@1.17.2...@antv/x6@1.17.3) (2021-03-12)


### Bug Fixes

* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))

## @antv/x6 [1.17.2](https://github.com/antvis/x6/compare/@antv/x6@1.17.1...@antv/x6@1.17.2) (2021-03-12)


### Bug Fixes

* 🐛 fix not refresh after removeTool ([9d15243](https://github.com/antvis/x6/commit/9d152433ee4050bf2311c140d74dd805cae519ba))

## @antv/x6 [1.17.1](https://github.com/antvis/x6/compare/@antv/x6@1.17.0...@antv/x6@1.17.1) (2021-03-11)


### Bug Fixes

* 🐛 add ToJSONData type ([f5ffbe2](https://github.com/antvis/x6/commit/f5ffbe2ffa50cb9585ee241aa1f37d5c069e97e5))

# @antv/x6 [1.17.0](https://github.com/antvis/x6/compare/@antv/x6@1.16.0...@antv/x6@1.17.0) (2021-03-11)


### Bug Fixes

* 🐛 make sure css resource is disposed  after all graph instance is disposed ([81fa537](https://github.com/antvis/x6/commit/81fa537282ce5cd65c2fb585b8a7649087490313))


### Features

* ✨  allow disable auto resize in some high performance scenario ([dd6681b](https://github.com/antvis/x6/commit/dd6681b53739bf48fa0a97166e16ada4a2c16896))

# @antv/x6 [1.16.0](https://github.com/antvis/x6/compare/@antv/x6@1.15.0...@antv/x6@1.16.0) (2021-03-11)


### Features

* ✨ add direction option for midside node-anchor ([b235c11](https://github.com/antvis/x6/commit/b235c1106b4041f257d4f0db5f30198e5c41c90d))

# @antv/x6 [1.15.0](https://github.com/antvis/x6/compare/@antv/x6@1.14.0...@antv/x6@1.15.0) (2021-03-10)


### Features

* ✨ add allowReverse option for resizing ([a597a75](https://github.com/antvis/x6/commit/a597a759c0a0b83f53e99e530d1970f46faf3dd2))

# @antv/x6 [1.14.0](https://github.com/antvis/x6/compare/@antv/x6@1.13.4...@antv/x6@1.14.0) (2021-03-10)


### Features

* ✨ add containerParent config for dnd ([58fb4fd](https://github.com/antvis/x6/commit/58fb4fdd6a51c672e5a473773874081fe548fe0a))

## @antv/x6 [1.13.4](https://github.com/antvis/x6/compare/@antv/x6@1.13.3...@antv/x6@1.13.4) (2021-03-03)


### Bug Fixes

* 🐛 get container size use offsetxxx ([faf3e4f](https://github.com/antvis/x6/commit/faf3e4f0b015650b04f33d7ad914c116962f317e))

## @antv/x6 [1.13.3](https://github.com/antvis/x6/compare/@antv/x6@1.13.2...@antv/x6@1.13.3) (2021-03-02)


### Bug Fixes

* 🐛 fix start pos error in mousewheel ([1077a31](https://github.com/antvis/x6/commit/1077a3196219ecadbf1ecffac31d843d542f91fb))

## @antv/x6 [1.13.2](https://github.com/antvis/x6/compare/@antv/x6@1.13.1...@antv/x6@1.13.2) (2021-03-02)


### Bug Fixes

* add judgment in sepcial event ([2732b12](https://github.com/antvis/x6/commit/2732b12b4fe9cf7e381239333497c10ca2b8e7d0))


### Performance Improvements

* ⚡️ avoid multiple times reflow when resize ([83483e9](https://github.com/antvis/x6/commit/83483e9d2af65ce2397770d35e8a7b799af8972a))

## @antv/x6 [1.13.1](https://github.com/antvis/x6/compare/@antv/x6@1.13.0...@antv/x6@1.13.1) (2021-02-23)

# @antv/x6 [1.13.0](https://github.com/antvis/x6/compare/@antv/x6@1.12.32...@antv/x6@1.13.0) (2021-02-23)


### Features

* add following config for selection ([#687](https://github.com/antvis/x6/issues/687)) ([5b52433](https://github.com/antvis/x6/commit/5b52433709089280320cc6b13e6442f31c1dcf30))

## @antv/x6 [1.12.32](https://github.com/antvis/x6/compare/@antv/x6@1.12.31...@antv/x6@1.12.32) (2021-02-20)


### Bug Fixes

* fix keyboard event not trigger ([4ea5f31](https://github.com/antvis/x6/commit/4ea5f3194e80125a68e25e71920526f5b6c86150))

## @antv/x6 [1.12.31](https://github.com/antvis/x6/compare/@antv/x6@1.12.30...@antv/x6@1.12.31) (2021-02-09)


### Bug Fixes

* fix spelling error ([2f33b99](https://github.com/antvis/x6/commit/2f33b99cae8559d3d98204fe427c1ad18ce94ac0))

## @antv/x6 [1.12.30](https://github.com/antvis/x6/compare/@antv/x6@1.12.29...@antv/x6@1.12.30) (2021-02-07)


### Bug Fixes

* change css selector foreignobject to foreignObject ([#664](https://github.com/antvis/x6/issues/664)) ([2fa99f0](https://github.com/antvis/x6/commit/2fa99f05a8692bef1e9a4c241db399cee258fbb6))

## @antv/x6 [1.12.29](https://github.com/antvis/x6/compare/@antv/x6@1.12.28...@antv/x6@1.12.29) (2021-02-05)

## @antv/x6 [1.12.28](https://github.com/antvis/x6/compare/@antv/x6@1.12.27...@antv/x6@1.12.28) (2021-02-04)


### Bug Fixes

* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)

## @antv/x6 [1.12.27](https://github.com/antvis/x6/compare/@antv/x6@1.12.26...@antv/x6@1.12.27) (2021-02-03)


### Bug Fixes

* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 should update inner reference when set "parent" and "children" by `prop()` ([f258522](https://github.com/antvis/x6/commit/f2585224689f4deb980d14f0e1f1a0c247bdcedc))

## @antv/x6 [1.12.26](https://github.com/antvis/x6/compare/@antv/x6@1.12.25...@antv/x6@1.12.26) (2021-02-02)


### Bug Fixes

* 🐛 edge vertices can be point data array `[number, number][]` ([c7b0f0d](https://github.com/antvis/x6/commit/c7b0f0d811bbceb30365b683f69124ddf9d96008))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix move event trigger error ([#643](https://github.com/antvis/x6/issues/643)) ([586fc1f](https://github.com/antvis/x6/commit/586fc1f08fff85dcc1c6c8637aef529e8bccb169))

## @antv/x6 [1.12.25](https://github.com/antvis/x6/compare/@antv/x6@1.12.24...@antv/x6@1.12.25) (2021-02-02)


### Bug Fixes

* delete console.log, add no-console config ([#642](https://github.com/antvis/x6/issues/642)) ([024c01f](https://github.com/antvis/x6/commit/024c01f000545c0c0b50259510fc886b3aa9815b))

## @antv/x6 [1.12.24](https://github.com/antvis/x6/compare/@antv/x6@1.12.23...@antv/x6@1.12.24) (2021-02-02)


### Bug Fixes

* 🐛 auto extend scroller's graph with `async` mode ([8cd3aa6](https://github.com/antvis/x6/commit/8cd3aa63e4bb6a556d4c259c3116f590f87d021c)), closes [#636](https://github.com/antvis/x6/issues/636)

## @antv/x6 [1.12.23](https://github.com/antvis/x6/compare/@antv/x6@1.12.22...@antv/x6@1.12.23) (2021-02-01)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)

## @antv/x6 [1.12.22](https://github.com/antvis/x6/compare/@antv/x6@1.12.21...@antv/x6@1.12.22) (2021-02-01)


### Bug Fixes

* 🐛 auto resize graph with flexbox ([73c1e1d](https://github.com/antvis/x6/commit/73c1e1d869b098bd341ad1c6e969222980067053))

## @antv/x6 [1.12.21](https://github.com/antvis/x6/compare/@antv/x6@1.12.20...@antv/x6@1.12.21) (2021-01-31)


### Bug Fixes

* fix trigger multiple moved event when close movable config ([f651181](https://github.com/antvis/x6/commit/f65118150178df82ee795f4fc292f5ce91c78b6b))

## @antv/x6 [1.12.20](https://github.com/antvis/x6/compare/@antv/x6@1.12.19...@antv/x6@1.12.20) (2021-01-29)


### Bug Fixes

* 🐛 should clean cells on destroy graph ([e211c1a](https://github.com/antvis/x6/commit/e211c1a0a1f79588b084a4de326fdd493e839def)), closes [#600](https://github.com/antvis/x6/issues/600)
* change x6-svg-to-shape router ([3c5d11f](https://github.com/antvis/x6/commit/3c5d11f4b46d4843150ac3f294dc4ed0cf611c43))

## @antv/x6 [1.12.19](https://github.com/antvis/x6/compare/@antv/x6@1.12.18...@antv/x6@1.12.19) (2021-01-28)


### Bug Fixes

* 🐛 fix type defines ([6b446f8](https://github.com/antvis/x6/commit/6b446f80ba96dbbfbff7257012fc6f6f8aca49fd))

## @antv/x6 [1.12.18](https://github.com/antvis/x6/compare/@antv/x6@1.12.17...@antv/x6@1.12.18) (2021-01-27)


### Bug Fixes

* 🐛 exclude edge on node:move event ([#593](https://github.com/antvis/x6/issues/593)) ([dac555e](https://github.com/antvis/x6/commit/dac555e5cf15fba6a5450ecdb335a2cd9145d339))

## @antv/x6 [1.12.17](https://github.com/antvis/x6/compare/@antv/x6@1.12.16...@antv/x6@1.12.17) (2021-01-26)


### Bug Fixes

* 🐛 should apply prop hooks when update props by `prop()` method ([0dfc09f](https://github.com/antvis/x6/commit/0dfc09f97ff4281aacb465ad74f1958930d30c8c))

## @antv/x6 [1.12.16](https://github.com/antvis/x6/compare/@antv/x6@1.12.15...@antv/x6@1.12.16) (2021-01-25)


### Bug Fixes

* 🐛 support register html render object ([e0c9e97](https://github.com/antvis/x6/commit/e0c9e970723b8c7bd6a63127edf46be79a72d7c3))

## @antv/x6 [1.12.15](https://github.com/antvis/x6/compare/@antv/x6@1.12.14...@antv/x6@1.12.15) (2021-01-25)


### Bug Fixes

* x6 support ie 11 ([#585](https://github.com/antvis/x6/issues/585)) ([8cb2f48](https://github.com/antvis/x6/commit/8cb2f489d2f913dd9fa80dab5c50e1fffe7f6939))

## @antv/x6 [1.12.14](https://github.com/antvis/x6/compare/@antv/x6@1.12.13...@antv/x6@1.12.14) (2021-01-24)

## @antv/x6 [1.12.13](https://github.com/antvis/x6/compare/@antv/x6@1.12.12...@antv/x6@1.12.13) (2021-01-23)


### Bug Fixes

* get registry first in html component ([c810821](https://github.com/antvis/x6/commit/c81082169763f4ca5432b44c94996674cd3599b1))

## @antv/x6 [1.12.12](https://github.com/antvis/x6/compare/@antv/x6@1.12.11...@antv/x6@1.12.12) (2021-01-23)

## @antv/x6 [1.12.11](https://github.com/antvis/x6/compare/@antv/x6@1.12.10...@antv/x6@1.12.11) (2021-01-22)


### Bug Fixes

* 🐛 prevent handle 'delete' and 'backsapce' key triggered from input ([429ef9a](https://github.com/antvis/x6/commit/429ef9ad45a11a49072d169a0c89146640f7e21a))

## @antv/x6 [1.12.10](https://github.com/antvis/x6/compare/@antv/x6@1.12.9...@antv/x6@1.12.10) (2021-01-22)


### Bug Fixes

* add `placeholder` and `notFoundText` for stencil component ([#574](https://github.com/antvis/x6/issues/574)) ([c9100ab](https://github.com/antvis/x6/commit/c9100abb8576eaf55c5a9b0c5496f63c1796af5a)), closes [#555](https://github.com/antvis/x6/issues/555)

## @antv/x6 [1.12.9](https://github.com/antvis/x6/compare/@antv/x6@1.12.8...@antv/x6@1.12.9) (2021-01-22)


### Bug Fixes

* fix canot get graph ([#573](https://github.com/antvis/x6/issues/573)) ([5aadc87](https://github.com/antvis/x6/commit/5aadc87467e61dbd33d385e94a94bee72e744f84))

## @antv/x6 [1.12.8](https://github.com/antvis/x6/compare/@antv/x6@1.12.7...@antv/x6@1.12.8) (2021-01-21)


### Bug Fixes

* 🐛 update page size as needed when graph size changed ([#571](https://github.com/antvis/x6/issues/571)) ([0fbab4b](https://github.com/antvis/x6/commit/0fbab4b2e932017ec60111c87a27d11cb85b2934)), closes [#564](https://github.com/antvis/x6/issues/564)

## @antv/x6 [1.12.7](https://github.com/antvis/x6/compare/@antv/x6@1.12.6...@antv/x6@1.12.7) (2021-01-21)

## @antv/x6 [1.12.6](https://github.com/antvis/x6/compare/@antv/x6@1.12.5...@antv/x6@1.12.6) (2021-01-21)

## @antv/x6 [1.12.5](https://github.com/antvis/x6/compare/@antv/x6@1.12.4...@antv/x6@1.12.5) (2021-01-21)

## @antv/x6 [1.12.4](https://github.com/antvis/x6/compare/@antv/x6@1.12.3...@antv/x6@1.12.4) (2021-01-20)


### Bug Fixes

* 🐛 auto fix node's css className on mouseenter ([#566](https://github.com/antvis/x6/issues/566)) ([6a33149](https://github.com/antvis/x6/commit/6a3314959206c1299eb916c1dc10130d49ee7de8)), closes [#558](https://github.com/antvis/x6/issues/558)

## @antv/x6 [1.12.3](https://github.com/antvis/x6/compare/@antv/x6@1.12.2...@antv/x6@1.12.3) (2021-01-20)


### Bug Fixes

* 🐛 remove single tool by name or index ([#565](https://github.com/antvis/x6/issues/565)) ([f87dc43](https://github.com/antvis/x6/commit/f87dc43e439bfd13b7afe193db096bacd456bdcd)), closes [#552](https://github.com/antvis/x6/issues/552)

## @antv/x6 [1.12.2](https://github.com/antvis/x6/compare/@antv/x6@1.12.1...@antv/x6@1.12.2) (2021-01-20)


### Bug Fixes

* change $ to JQuery ([3c4d229](https://github.com/antvis/x6/commit/3c4d22952b33d592791cdead017d860833f51608))

## @antv/x6 [1.12.1](https://github.com/antvis/x6/compare/@antv/x6@1.12.0...@antv/x6@1.12.1) (2021-01-14)


### Bug Fixes

* comment the copy style code first ([bdb01a4](https://github.com/antvis/x6/commit/bdb01a4ebac1896b4788c5c56d5fcff55bbbb663))

# @antv/x6 [1.12.0](https://github.com/antvis/x6/compare/@antv/x6@1.11.6...@antv/x6@1.12.0) (2021-01-13)


### Bug Fixes

* 🐛 should copy inline style to scroller container ([ac47a27](https://github.com/antvis/x6/commit/ac47a27f4853d84627f4394f766c34f7fa57b27c))


### Features

* ✨ add util to detect element size change ([116571c](https://github.com/antvis/x6/commit/116571c6304a66e84a85aac9c6d8cf3ac91224e3))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

## @antv/x6 [1.11.6](https://github.com/antvis/x6/compare/@antv/x6@1.11.5...@antv/x6@1.11.6) (2021-01-13)

## @antv/x6 [1.8.3](https://github.com/antvis/x6/compare/@antv/x6@1.8.2...@antv/x6@1.8.3) (2021-01-13)

## @antv/x6 [1.8.2](https://github.com/antvis/x6/compare/@antv/x6@1.8.1...@antv/x6@1.8.2) (2021-01-12)

## @antv/x6 [1.8.1](https://github.com/antvis/x6/compare/@antv/x6@1.8.0...@antv/x6@1.8.1) (2021-01-12)


### Bug Fixes

* 🐛 fix node immovable cursor style ([a91c71f](https://github.com/antvis/x6/commit/a91c71f6bc073e509530d78db904300436d80f00))

# @antv/x6 [1.8.0](https://github.com/antvis/x6/compare/@antv/x6@1.7.0...@antv/x6@1.8.0) (2021-01-11)


### Bug Fixes

* 🐛 auto calc er router's direction ([9b9a727](https://github.com/antvis/x6/commit/9b9a727c9b168af80623be448d5ae389a21a72b0))
* 🐛 box-sizing style was overwrited ([95c1329](https://github.com/antvis/x6/commit/95c132900b8881e12b73b9c7d5ab742c0154d472))
* 🐛 can overwirte shape when define new shape with `Node.define(...)` ([f47fe4c](https://github.com/antvis/x6/commit/f47fe4cdef2da7ac6bb188c3ae131dffc2192cdb))
* 🐛 change component -> render ([b90c519](https://github.com/antvis/x6/commit/b90c519c98a5adf81f111fb3ea1d8781ce7996bc))
* 🐛 change rerender -> shouldComponentUpdate ([79672e9](https://github.com/antvis/x6/commit/79672e9e097b99d4339ddb5f6fba0dafa2c648f3))
* 🐛 fix draw background ([521f99a](https://github.com/antvis/x6/commit/521f99a2942ec42284fefaf63fba3ddf77a7da3a)), closes [#466](https://github.com/antvis/x6/issues/466)
* 🐛 fix html rerender ([3412c0c](https://github.com/antvis/x6/commit/3412c0ce454b1481bdc037579819ab866bf01c14))
* 🐛 fix marker of shadow edge ([7acd9f2](https://github.com/antvis/x6/commit/7acd9f2897747a45dd442975bc326e71740eb09e))
* 🐛 fix the judgment error of dom object ([afb4f0b](https://github.com/antvis/x6/commit/afb4f0b12bc28e353e5f2e4c41822cb0b77c6f8d))
* 🐛 fix type definition of node and edge registry ([d2742a4](https://github.com/antvis/x6/commit/d2742a4a8a473e60bc47fe099fd49c27e0c2d9ae)), closes [#478](https://github.com/antvis/x6/issues/478)
* 🐛 get completed picture when execue toPNG ([6dc50e9](https://github.com/antvis/x6/commit/6dc50e91d94fae0da2bc35a056e6410cb94d07be))
* 🐛 ignore null keys on toJSON ([4462a56](https://github.com/antvis/x6/commit/4462a5698f1ccea33dad4f65e7eef3a88c7fff7c))
* 🐛 konb 和 transform 的控制旋钮,在交互时只显示正在交互的旋钮 ([73bb1e1](https://github.com/antvis/x6/commit/73bb1e16e329853ae5a47c0a3725000a65efd6a3))
* 🐛 recover the lost minimap style ([6de2ac8](https://github.com/antvis/x6/commit/6de2ac895475eda529f72a8ae774ce42a1226655))
* 🐛 remove code tracing ([bdb0db2](https://github.com/antvis/x6/commit/bdb0db2da8708d626ebd09b46da7d431102b79bf))
* 🐛 should clear knob on forcused node changed ([bf83cd8](https://github.com/antvis/x6/commit/bf83cd8760e89358846e216bc2a41c305f8a17fb))
* 🐛 should render html tool in the graph container ([ebb43a9](https://github.com/antvis/x6/commit/ebb43a9501be68196266db2ffab2cbde54b7bdb4))
* 🐛 should support multi knobs ([9fe76b9](https://github.com/antvis/x6/commit/9fe76b9c82c7e6040a4dcca00c417183a6fcb130))
* 🐛 should trigger batch event on cell ([429f4e8](https://github.com/antvis/x6/commit/429f4e8b6a394dd10412fce4775af22af583cadc))
* 🐛 support function on interacting items ([2222ab6](https://github.com/antvis/x6/commit/2222ab683abea60e7208832e8ef856ce132c8cf0))
* 🐛 update selection boxs on after cell view updated ([7e5f759](https://github.com/antvis/x6/commit/7e5f75925d98aabcc4a96baef4670beb76d6996a))
* 🐛 事件队列在事件回调用被修改,应该先缓存起来 ([d29ea43](https://github.com/antvis/x6/commit/d29ea43ea6e2b24a0caa2e861849bc01f6b4ce79))
* change node:resize and node:rotate event trigger times ([#505](https://github.com/antvis/x6/issues/505)) ([4156e57](https://github.com/antvis/x6/commit/4156e5712ec1940041e7b22863361a6e6ee820aa))
* fix cursor error ([b7d61b7](https://github.com/antvis/x6/commit/b7d61b75fbc24b36cfc384fdd9c6ed3baf2cf12a))
* fix html node not update when setData ([0020c78](https://github.com/antvis/x6/commit/0020c781c3bb4b4747220fe327ade7e926d52014))
* fix mousemove event fires on first mousedown ([2cb270e](https://github.com/antvis/x6/commit/2cb270e189361670b2479b4a9c9694b953bdb8ab))
* update selection box when cell:changed ([#517](https://github.com/antvis/x6/issues/517)) ([c8234d5](https://github.com/antvis/x6/commit/c8234d5df1c7cb7910a93d5d7314c01c7b4023b0))


### Features

* ✨ add `arcTo`, `quadTo`, `drawPoints` methods for path ([00e8fd0](https://github.com/antvis/x6/commit/00e8fd0ec06e442833dd3f6c7ce7c05aabc5b556))
* ✨ add `position` hook for knobs ([3e2f315](https://github.com/antvis/x6/commit/3e2f3154a7635f1b94176d05e6780d4b79761037))
* ✨ add `rotate` method for geoemtrys ([90a5603](https://github.com/antvis/x6/commit/90a56037b16adff6fc3fbf50660eb95d3bd6bd2d))
* ✨ convert client/rectangle point to graph point/rectangle ([1d55c62](https://github.com/antvis/x6/commit/1d55c62507d112d4a1f52e3ea6c4768017956fa0))
* ✨ support html tool ([97624f4](https://github.com/antvis/x6/commit/97624f4a9dfaacc551acd89c5557a2b301fe2d5e))
* ✨ 支持调节手柄,如圆柱,通过调节手柄修改圆柱椭圆面的大小 ([6ae70b8](https://github.com/antvis/x6/commit/6ae70b809e85db4d537e9104830eef1328c16f7a))
* add direction for smooth connector ([deec3bc](https://github.com/antvis/x6/commit/deec3bc805c5af1d2d0fc81a25c0819a6072f99e))

## @antv/x6 [1.11.2](https://github.com/antvis/x6/compare/@antv/x6@1.11.1...@antv/x6@1.11.2) (2021-01-11)


### Bug Fixes

* 🐛 ignore null keys on toJSON ([4462a56](https://github.com/antvis/x6/commit/4462a5698f1ccea33dad4f65e7eef3a88c7fff7c))

## @antv/x6 [1.11.1](https://github.com/antvis/x6/compare/@antv/x6@1.11.0...@antv/x6@1.11.1) (2021-01-11)


### Bug Fixes

* fix cursor error ([b7d61b7](https://github.com/antvis/x6/commit/b7d61b75fbc24b36cfc384fdd9c6ed3baf2cf12a))

# @antv/x6 [1.11.0](https://github.com/antvis/x6/compare/@antv/x6@1.10.2...@antv/x6@1.11.0) (2021-01-08)


### Bug Fixes

* fix mousemove event fires on first mousedown ([2cb270e](https://github.com/antvis/x6/commit/2cb270e189361670b2479b4a9c9694b953bdb8ab))


### Features

* add direction for smooth connector ([deec3bc](https://github.com/antvis/x6/commit/deec3bc805c5af1d2d0fc81a25c0819a6072f99e))

## @antv/x6 [1.10.2](https://github.com/antvis/x6/compare/@antv/x6@1.10.1...@antv/x6@1.10.2) (2021-01-08)


### Bug Fixes

* 🐛 should trigger batch event on cell ([429f4e8](https://github.com/antvis/x6/commit/429f4e8b6a394dd10412fce4775af22af583cadc))
* 🐛 update selection boxs on after cell view updated ([7e5f759](https://github.com/antvis/x6/commit/7e5f75925d98aabcc4a96baef4670beb76d6996a))

## @antv/x6 [1.10.1](https://github.com/antvis/x6/compare/@antv/x6@1.10.0...@antv/x6@1.10.1) (2021-01-08)


### Bug Fixes

* update selection box when cell:changed ([#517](https://github.com/antvis/x6/issues/517)) ([c8234d5](https://github.com/antvis/x6/commit/c8234d5df1c7cb7910a93d5d7314c01c7b4023b0))

# @antv/x6 [1.10.0](https://github.com/antvis/x6/compare/@antv/x6@1.9.3...@antv/x6@1.10.0) (2021-01-08)


### Bug Fixes

* 🐛 can overwirte shape when define new shape with `Node.define(...)` ([f47fe4c](https://github.com/antvis/x6/commit/f47fe4cdef2da7ac6bb188c3ae131dffc2192cdb))
* 🐛 should support multi knobs ([9fe76b9](https://github.com/antvis/x6/commit/9fe76b9c82c7e6040a4dcca00c417183a6fcb130))


### Features

* ✨ add `arcTo`, `quadTo`, `drawPoints` methods for path ([00e8fd0](https://github.com/antvis/x6/commit/00e8fd0ec06e442833dd3f6c7ce7c05aabc5b556))
* ✨ add `position` hook for knobs ([3e2f315](https://github.com/antvis/x6/commit/3e2f3154a7635f1b94176d05e6780d4b79761037))
* ✨ add `rotate` method for geoemtrys ([90a5603](https://github.com/antvis/x6/commit/90a56037b16adff6fc3fbf50660eb95d3bd6bd2d))

## @antv/x6 [1.9.3](https://github.com/antvis/x6/compare/@antv/x6@1.9.2...@antv/x6@1.9.3) (2021-01-05)


### Bug Fixes

* 🐛 konb 和 transform 的控制旋钮,在交互时只显示正在交互的旋钮 ([73bb1e1](https://github.com/antvis/x6/commit/73bb1e16e329853ae5a47c0a3725000a65efd6a3))
* 🐛 should clear knob on forcused node changed ([bf83cd8](https://github.com/antvis/x6/commit/bf83cd8760e89358846e216bc2a41c305f8a17fb))

## @antv/x6 [1.9.2](https://github.com/antvis/x6/compare/@antv/x6@1.9.1...@antv/x6@1.9.2) (2021-01-05)


### Bug Fixes

* change node:resize and node:rotate event trigger times ([#505](https://github.com/antvis/x6/issues/505)) ([4156e57](https://github.com/antvis/x6/commit/4156e5712ec1940041e7b22863361a6e6ee820aa))

## @antv/x6 [1.9.1](https://github.com/antvis/x6/compare/@antv/x6@1.9.0...@antv/x6@1.9.1) (2021-01-05)


### Bug Fixes

* 🐛 事件队列在事件回调用被修改,应该先缓存起来 ([d29ea43](https://github.com/antvis/x6/commit/d29ea43ea6e2b24a0caa2e861849bc01f6b4ce79))

# @antv/x6 [1.9.0](https://github.com/antvis/x6/compare/@antv/x6@1.8.0...@antv/x6@1.9.0) (2021-01-04)


### Bug Fixes

* 🐛 should render html tool in the graph container ([ebb43a9](https://github.com/antvis/x6/commit/ebb43a9501be68196266db2ffab2cbde54b7bdb4))


### Features

* ✨ convert client/rectangle point to graph point/rectangle ([1d55c62](https://github.com/antvis/x6/commit/1d55c62507d112d4a1f52e3ea6c4768017956fa0))
* ✨ 支持调节手柄,如圆柱,通过调节手柄修改圆柱椭圆面的大小 ([6ae70b8](https://github.com/antvis/x6/commit/6ae70b809e85db4d537e9104830eef1328c16f7a))

# @antv/x6 [1.8.0](https://github.com/antvis/x6/compare/@antv/x6@1.7.12...@antv/x6@1.8.0) (2021-01-04)


### Features

* ✨ support html tool ([97624f4](https://github.com/antvis/x6/commit/97624f4a9dfaacc551acd89c5557a2b301fe2d5e))

## @antv/x6 [1.7.12](https://github.com/antvis/x6/compare/@antv/x6@1.7.11...@antv/x6@1.7.12) (2020-12-31)


### Bug Fixes

* 🐛 get completed picture when execue toPNG ([6dc50e9](https://github.com/antvis/x6/commit/6dc50e91d94fae0da2bc35a056e6410cb94d07be))

## @antv/x6 [1.7.11](https://github.com/antvis/x6/compare/@antv/x6@1.7.10...@antv/x6@1.7.11) (2020-12-30)


### Bug Fixes

* 🐛 auto calc er router's direction ([9b9a727](https://github.com/antvis/x6/commit/9b9a727c9b168af80623be448d5ae389a21a72b0))

## @antv/x6 [1.7.10](https://github.com/antvis/x6/compare/@antv/x6@1.7.9...@antv/x6@1.7.10) (2020-12-29)

## @antv/x6 [1.7.9](https://github.com/antvis/x6/compare/@antv/x6@1.7.8...@antv/x6@1.7.9) (2020-12-29)


### Bug Fixes

* 🐛 fix type definition of node and edge registry ([d2742a4](https://github.com/antvis/x6/commit/d2742a4a8a473e60bc47fe099fd49c27e0c2d9ae)), closes [#478](https://github.com/antvis/x6/issues/478)

## @antv/x6 [1.7.8](https://github.com/antvis/x6/compare/@antv/x6@1.7.7...@antv/x6@1.7.8) (2020-12-28)


### Bug Fixes

* 🐛 remove code tracing ([bdb0db2](https://github.com/antvis/x6/commit/bdb0db2da8708d626ebd09b46da7d431102b79bf))

## @antv/x6 [1.7.7](https://github.com/antvis/x6/compare/@antv/x6@1.7.6...@antv/x6@1.7.7) (2020-12-26)


### Bug Fixes

* 🐛 fix the judgment error of dom object ([afb4f0b](https://github.com/antvis/x6/commit/afb4f0b12bc28e353e5f2e4c41822cb0b77c6f8d))
* 🐛 support function on interacting items ([2222ab6](https://github.com/antvis/x6/commit/2222ab683abea60e7208832e8ef856ce132c8cf0))

## @antv/x6 [1.7.6](https://github.com/antvis/x6/compare/@antv/x6@1.7.5...@antv/x6@1.7.6) (2020-12-25)


### Bug Fixes

* 🐛 fix draw background ([521f99a](https://github.com/antvis/x6/commit/521f99a2942ec42284fefaf63fba3ddf77a7da3a)), closes [#466](https://github.com/antvis/x6/issues/466)
* 🐛 recover the lost minimap style ([6de2ac8](https://github.com/antvis/x6/commit/6de2ac895475eda529f72a8ae774ce42a1226655))

## @antv/x6 [1.7.5](https://github.com/antvis/x6/compare/@antv/x6@1.7.4...@antv/x6@1.7.5) (2020-12-25)

## @antv/x6 [1.7.4](https://github.com/antvis/x6/compare/@antv/x6@1.7.3...@antv/x6@1.7.4) (2020-12-24)


### Bug Fixes

* 🐛 change component -> render ([b90c519](https://github.com/antvis/x6/commit/b90c519c98a5adf81f111fb3ea1d8781ce7996bc))
* 🐛 change rerender -> shouldComponentUpdate ([79672e9](https://github.com/antvis/x6/commit/79672e9e097b99d4339ddb5f6fba0dafa2c648f3))
* 🐛 fix html rerender ([3412c0c](https://github.com/antvis/x6/commit/3412c0ce454b1481bdc037579819ab866bf01c14))
* fix html node not update when setData ([0020c78](https://github.com/antvis/x6/commit/0020c781c3bb4b4747220fe327ade7e926d52014))

## @antv/x6 [1.7.3](https://github.com/antvis/x6/compare/@antv/x6@1.7.2...@antv/x6@1.7.3) (2020-12-24)

## @antv/x6 [1.7.2](https://github.com/antvis/x6/compare/@antv/x6@1.7.1...@antv/x6@1.7.2) (2020-12-24)

## @antv/x6 [1.7.1](https://github.com/antvis/x6/compare/@antv/x6@1.7.0...@antv/x6@1.7.1) (2020-12-24)


### Bug Fixes

* 🐛 box-sizing style was overwrited ([95c1329](https://github.com/antvis/x6/commit/95c132900b8881e12b73b9c7d5ab742c0154d472))
* 🐛 fix marker of shadow edge ([7acd9f2](https://github.com/antvis/x6/commit/7acd9f2897747a45dd442975bc326e71740eb09e))

# @antv/x6 [1.7.0](https://github.com/antvis/x6/compare/@antv/x6@1.6.4...@antv/x6@1.7.0) (2020-12-24)


### Bug Fixes

* 🐛 process special attributes of text ([e1f9abf](https://github.com/antvis/x6/commit/e1f9abfffcdd723815311ebc58ef17761ad2a063))


### Features

* ✨ parse markup from xml string ([f16e7eb](https://github.com/antvis/x6/commit/f16e7eb38ca1f0dec71f51cd41b74341fc1a0f3d))

## @antv/x6 [1.6.4](https://github.com/antvis/x6/compare/@antv/x6@1.6.3...@antv/x6@1.6.4) (2020-12-23)


### Performance Improvements

* ⚡️ add bounds proprtyies for rectangle ([c4480af](https://github.com/antvis/x6/commit/c4480af4e45b9a90746f3aefa14a4d7332b08d6a))

## @antv/x6 [1.6.3](https://github.com/antvis/x6/compare/@antv/x6@1.6.2...@antv/x6@1.6.3) (2020-12-22)


### Bug Fixes

* 🐛 default transparent background for ForeignObject ([a386f94](https://github.com/antvis/x6/commit/a386f940eb18e718998b150d432242d8cfea5f8b))
* 🐛 only append SVG tool to ToolsView, HTML tools should handle manually ([5c7b7d6](https://github.com/antvis/x6/commit/5c7b7d646c90e20a28f273d268d83a16246bb9f2))

## @antv/x6 [1.6.2](https://github.com/antvis/x6/compare/@antv/x6@1.6.1...@antv/x6@1.6.2) (2020-12-22)


### Bug Fixes

* 🐛 fix sourceMarker and targetMaker position ([d637cf6](https://github.com/antvis/x6/commit/d637cf649e0b149acdf9dee12e6561e3b4f76b17))
* 🐛 fix tools ware removed when update cell ([fac7e7a](https://github.com/antvis/x6/commit/fac7e7a4c853d75ea0ae37fcd7089bf20e56654b))
* 🐛 update arrowhead on dragging ([c9e7b5f](https://github.com/antvis/x6/commit/c9e7b5ffeb52e2fd609283d5f72b0d43ad368561))

## @antv/x6 [1.6.1](https://github.com/antvis/x6/compare/@antv/x6@1.6.0...@antv/x6@1.6.1) (2020-12-21)

# @antv/x6 [1.6.0](https://github.com/antvis/x6/compare/@antv/x6@1.5.2...@antv/x6@1.6.0) (2020-12-21)


### Bug Fixes

* 🐛 fix alerts on lgtm.com ([e9f23f0](https://github.com/antvis/x6/commit/e9f23f025944d2c1660827c495794b6afa6f9412))


### Features

* ✨ add 'loop' and 'loose' option for connecting ([bbc41d4](https://github.com/antvis/x6/commit/bbc41d48294398053e77da161f2d0e7f0602f905)), closes [#390](https://github.com/antvis/x6/issues/390)
* ✨ add some connecting option ([68f7965](https://github.com/antvis/x6/commit/68f7965699b36d6a46f25e6aba5d144fb086c9a0))

## @antv/x6 [1.5.2](https://github.com/antvis/x6/compare/@antv/x6@1.5.1...@antv/x6@1.5.2) (2020-12-18)


### Bug Fixes

* 🐛 take the stroke-width into account when calc connection point ([b21cac6](https://github.com/antvis/x6/commit/b21cac6968a548cad17c185a4219f24d135eaa8a))

## @antv/x6 [1.5.1](https://github.com/antvis/x6/compare/@antv/x6@1.5.0...@antv/x6@1.5.1) (2020-12-17)


### Bug Fixes

* 🐛 should stop dragging when validate node async ([d418e07](https://github.com/antvis/x6/commit/d418e07ef404881400faf03943c8c9ff067e4598)), closes [#429](https://github.com/antvis/x6/issues/429)

# @antv/x6 [1.5.0](https://github.com/antvis/x6/compare/@antv/x6@1.4.2...@antv/x6@1.5.0) (2020-12-17)


### Bug Fixes

* 🐛 should return `stop` method when calling `sendToken` ([21276b2](https://github.com/antvis/x6/commit/21276b2a0f396b8e8343f133fed9383142468f5d))


### Features

* ✨ add `animate` and `animateTransform` ([b2ebf69](https://github.com/antvis/x6/commit/b2ebf69f2c311b1b8056179005d8fafd0a7eb8e9))


### Performance Improvements

* ⚡️ add transition callbacks and events for animation lifecycle ([462abd0](https://github.com/antvis/x6/commit/462abd0aa06e28bbbabf96ffd0493af4a9af6e1a)), closes [#419](https://github.com/antvis/x6/issues/419) [#420](https://github.com/antvis/x6/issues/420)

## @antv/x6 [1.4.2](https://github.com/antvis/x6/compare/@antv/x6@1.4.1...@antv/x6@1.4.2) (2020-12-16)

## @antv/x6 [1.4.1](https://github.com/antvis/x6/compare/@antv/x6@1.4.0...@antv/x6@1.4.1) (2020-12-16)


### Bug Fixes

* optimize the ModifierKey isMatch method ([10c191d](https://github.com/antvis/x6/commit/10c191de7099c3305268aa36baaf5216d1684acb))

# @antv/x6 [1.4.0](https://github.com/antvis/x6/compare/@antv/x6@1.3.20...@antv/x6@1.4.0) (2020-12-16)


### Bug Fixes

* 🐛 offset connection point ([3abfb53](https://github.com/antvis/x6/commit/3abfb53a040db0cfc4964d71ea64ce5f008a63b2))
* 🐛 round path segment points ([4244439](https://github.com/antvis/x6/commit/4244439057fb20976edab3c334840fb1446ae218))
* 🐛 should auto normalize path data when parse path from string ([7441c38](https://github.com/antvis/x6/commit/7441c383336ecb148311f318075517806619941e))


### Features

* ✨ add loop line ([bfa3c67](https://github.com/antvis/x6/commit/bfa3c6743b42c22d64edfbf79f82913129a5a285)), closes [#392](https://github.com/antvis/x6/issues/392)

## @antv/x6 [1.3.20](https://github.com/antvis/x6/compare/@antv/x6@1.3.19...@antv/x6@1.3.20) (2020-12-12)


### Bug Fixes

* fix size invalid on image node ([#397](https://github.com/antvis/x6/issues/397)) ([15fd567](https://github.com/antvis/x6/commit/15fd5673e13825a94bd05ffb4f892645ee20e887))

## @antv/x6 [1.3.19](https://github.com/antvis/x6/compare/@antv/x6@1.3.18...@antv/x6@1.3.19) (2020-12-11)

## @antv/x6 [1.3.18](https://github.com/antvis/x6/compare/@antv/x6@1.3.17...@antv/x6@1.3.18) (2020-12-11)


### Bug Fixes

* 🐛 offset connection point ([3563838](https://github.com/antvis/x6/commit/3563838e2547976365afea1d495a2288d93512c8))
* 🐛 rotate anchor ([f314602](https://github.com/antvis/x6/commit/f31460212f03091be6273aa6103246186150b7b1))


### Performance Improvements

* ⚡️ align anchor ([b0a6b34](https://github.com/antvis/x6/commit/b0a6b340a20cdf989aa7d406eb938fd318c3d10a))
* ⚡️ parallel line ([b8d5431](https://github.com/antvis/x6/commit/b8d543117f06e723eadca1ecd89de915815fcbaf))

## @antv/x6 [1.3.17](https://github.com/antvis/x6/compare/@antv/x6@1.3.16...@antv/x6@1.3.17) (2020-12-10)


### Bug Fixes

* 🐛 do not reset anchor when `resetAnchor` option is `false` ([223cccc](https://github.com/antvis/x6/commit/223cccc66889abcb49284792d471bd22cf0ad61e))
* 🐛 path error when rewrite prop ([ff61eb4](https://github.com/antvis/x6/commit/ff61eb4e16752a9186ab00f96429e5dabc4bb557))
* 🐛 should deep merge attrs ([f869725](https://github.com/antvis/x6/commit/f8697256b2810ce94204a5b376891bcf5a3f4171))
* 🐛 tool changes should be sync render ([47de4cb](https://github.com/antvis/x6/commit/47de4cb5de7838b8dd9b005a974476998c9974ef))
* 🐛 tool changes should be sync render ([c3080b4](https://github.com/antvis/x6/commit/c3080b45a08050e937e872123c80b375b77ac3d6))

## @antv/x6 [1.3.16](https://github.com/antvis/x6/compare/@antv/x6@1.3.15...@antv/x6@1.3.16) (2020-12-10)

## @antv/x6 [1.3.15](https://github.com/antvis/x6/compare/@antv/x6@1.3.14...@antv/x6@1.3.15) (2020-12-09)

## @antv/x6 [1.3.14](https://github.com/antvis/x6/compare/@antv/x6@1.3.13...@antv/x6@1.3.14) (2020-12-09)


### Bug Fixes

* 🐛 modifier keys of panning and selecting ([dc97368](https://github.com/antvis/x6/commit/dc97368b52b8810f095e2bf1f771736841e8feed))
* 🐛 remove space ([a7258cd](https://github.com/antvis/x6/commit/a7258cd2db48ab63b6925101b8f98b38caa04929))

## @antv/x6 [1.3.13](https://github.com/antvis/x6/compare/@antv/x6@1.3.12...@antv/x6@1.3.13) (2020-12-09)


### Bug Fixes

* 🐛 typos ([74d03b4](https://github.com/antvis/x6/commit/74d03b401e015018661b2bb4a8689e49d829f7d8))

## @antv/x6 [1.3.12](https://github.com/antvis/x6/compare/@antv/x6@1.3.11...@antv/x6@1.3.12) (2020-12-09)


### Bug Fixes

* 🐛 inherit from 'edge' by default ([7797340](https://github.com/antvis/x6/commit/7797340406605b7e7ddfc97e0b47b1a726550660))
* 🐛 modifer key of panning and selecting ([2b7b871](https://github.com/antvis/x6/commit/2b7b87196693f6eb50851a4327f3d9bdc944beff))


### Performance Improvements

* ⚡️ support space modifier key ([25e93cb](https://github.com/antvis/x6/commit/25e93cbf5d116cef25454434832362019b81d76b))

## @antv/x6 [1.3.11](https://github.com/antvis/x6/compare/@antv/x6@1.3.10...@antv/x6@1.3.11) (2020-12-09)


### Bug Fixes

* 🐛 animateAlongPath: do not rotate by default ([ac77d51](https://github.com/antvis/x6/commit/ac77d51460f3d44254b7a0cba3b465f87879ea25))
* 🐛 segments tool not work ([86767ae](https://github.com/antvis/x6/commit/86767aebae8c653247ca47cbb54f9061d79d34d4))
* 🐛 selection box donot disappeared when select nothing ([b1c7314](https://github.com/antvis/x6/commit/b1c7314242530d962d23058a61e526b74df9cfb1))

## @antv/x6 [1.3.10](https://github.com/antvis/x6/compare/@antv/x6@1.3.9...@antv/x6@1.3.10) (2020-12-08)


### Bug Fixes

* add trigger point for update in scroller ([03b4e6a](https://github.com/antvis/x6/commit/03b4e6a76b8c4a5bb251a8707fe7b7907237fae9))

## @antv/x6 [1.3.9](https://github.com/antvis/x6/compare/@antv/x6@1.3.8...@antv/x6@1.3.9) (2020-12-08)


### Bug Fixes

* 🐛 should auto remove tools on cell was removed ([5f455f0](https://github.com/antvis/x6/commit/5f455f0cc1ff51b555ab00066ac694221537ed40)), closes [#383](https://github.com/antvis/x6/issues/383)

## @antv/x6 [1.3.8](https://github.com/antvis/x6/compare/@antv/x6@1.3.7...@antv/x6@1.3.8) (2020-12-08)


### Bug Fixes

* 🐛 fix return types ([66c6a7d](https://github.com/antvis/x6/commit/66c6a7d8dd89eedcecbf4079ac5b6e5e8f1bc2b5))
* 🐛 should auto remove tools when removing cells ([064a059](https://github.com/antvis/x6/commit/064a059daf009b5e37a80c2a7277d620ff2a70d1))

## @antv/x6 [1.3.7](https://github.com/antvis/x6/compare/@antv/x6@1.3.6...@antv/x6@1.3.7) (2020-12-08)

## @antv/x6 [1.3.6](https://github.com/antvis/x6/compare/@antv/x6@1.3.5...@antv/x6@1.3.6) (2020-12-07)


### Bug Fixes

* 🐛 should undelegate document events on dropped ([8696b45](https://github.com/antvis/x6/commit/8696b45d8ad0022af7c649ef2882cffb8dd5cc4d)), closes [#360](https://github.com/antvis/x6/issues/360)

## @antv/x6 [1.3.5](https://github.com/antvis/x6/compare/@antv/x6@1.3.4...@antv/x6@1.3.5) (2020-12-07)


### Bug Fixes

* 🐛 unselect cell by clicking cell and holding on the meta key ([41624d6](https://github.com/antvis/x6/commit/41624d6591e57274cad49a0c77032c5ce7380cb9))
* 🐛 unselect cell by clicking the selection box and hold on the meta key ([acc9c98](https://github.com/antvis/x6/commit/acc9c98aa0da9d5dd7108d2af2a955e2236e2385)), closes [#364](https://github.com/antvis/x6/issues/364)

## @antv/x6 [1.3.4](https://github.com/antvis/x6/compare/@antv/x6@1.3.3...@antv/x6@1.3.4) (2020-12-07)


### Bug Fixes

* 🐛 type define ([47e6a1c](https://github.com/antvis/x6/commit/47e6a1c4d7775b38b608e8f5fd1759b932744ee4))

## @antv/x6 [1.3.3](https://github.com/antvis/x6/compare/@antv/x6@1.3.2...@antv/x6@1.3.3) (2020-12-07)


### Bug Fixes

* 🐛 do not trigger getDropNode when drop at invalid area ([503fe7c](https://github.com/antvis/x6/commit/503fe7c3cfb3a069dc1a112f75251bd03220f407))


### Performance Improvements

* ⚡️ types of async function ([fb5168a](https://github.com/antvis/x6/commit/fb5168a08b0eb93173993c62620357f02299ef97))

## @antv/x6 [1.3.2](https://github.com/antvis/x6/compare/@antv/x6@1.3.1...@antv/x6@1.3.2) (2020-12-07)


### Bug Fixes

* 🐛 do not trigger change:zIndex when auto set zIndex at adding ([e7bd44f](https://github.com/antvis/x6/commit/e7bd44f0018b4e2d72457e56fd0947566658380c))

## @antv/x6 [1.3.1](https://github.com/antvis/x6/compare/@antv/x6@1.3.0...@antv/x6@1.3.1) (2020-12-07)


### Bug Fixes

* 🐛 auto rotate token by default when animate along path ([75d4b23](https://github.com/antvis/x6/commit/75d4b239e394629744e5a694ac9e6a18c7cee697))
* 🐛 typos ([d6eb46a](https://github.com/antvis/x6/commit/d6eb46a97c40daa3725d85f7a9ea1a7317d0afda))

# @antv/x6 [1.3.0](https://github.com/antvis/x6/compare/@antv/x6@1.2.3...@antv/x6@1.3.0) (2020-12-07)


### Bug Fixes

* 🐛 auto rotate token ([cc08ee0](https://github.com/antvis/x6/commit/cc08ee0e897e561d744a4ba3f160164f7433b7d9))
* 🐛 do not trigger cell:move event when not moved ([db58d33](https://github.com/antvis/x6/commit/db58d335ade5a976fb99178d2997be7bad206f57)), closes [#355](https://github.com/antvis/x6/issues/355)
* 🐛 lint errors ([3a1ef7f](https://github.com/antvis/x6/commit/3a1ef7f213ccc3343a1eea5479cce5e7e2be0957))
* 🐛 ref should be null after clean ([b655075](https://github.com/antvis/x6/commit/b65507550d37889bc23c0c7ab4eb8bd538a3aeda))
* 🐛 restore dom after disposed ([d8e22f1](https://github.com/antvis/x6/commit/d8e22f1ce31299ad22255c48d62bccc5cf642d44))


### Features

* ✨ add dom snapshoot method ([ad21955](https://github.com/antvis/x6/commit/ad2195522b70f3b01a6672739f3a989c35db63d0))
* add demo for tranform method ([a599300](https://github.com/antvis/x6/commit/a599300536751c3f4a360bdae36258e5014cf137))
* compatible with zoom in graph and scroller ([9e9365f](https://github.com/antvis/x6/commit/9e9365fa7090942940481a354086ae18b4b59c68))
* compatible with zoomFit centerContent ([979d207](https://github.com/antvis/x6/commit/979d207a7fd0c80af769566d09e27a6438f59491))
* compatible with zoomRect zoomTo centerPoint ([71e5cc4](https://github.com/antvis/x6/commit/71e5cc47bf677922933e944c1da808ca40f48c63))

## @antv/x6 [1.2.3](https://github.com/antvis/x6/compare/@antv/x6@1.2.2...@antv/x6@1.2.3) (2020-12-04)


### Bug Fixes

* 🐛 toggle visible ([13629d5](https://github.com/antvis/x6/commit/13629d50d894fcb7c567cc093d39b73f17c50f9d))

## @antv/x6 [1.2.2](https://github.com/antvis/x6/compare/@antv/x6@1.2.1...@antv/x6@1.2.2) (2020-12-04)


### Bug Fixes

* 🐛 find dom node ([1b2757c](https://github.com/antvis/x6/commit/1b2757c42273ab4f87e05c8d779d37bcb380ffb7))

## @antv/x6 [1.2.1](https://github.com/antvis/x6/compare/@antv/x6@1.2.0...@antv/x6@1.2.1) (2020-12-04)


### Bug Fixes

* 🐛 lint errors ([1757172](https://github.com/antvis/x6/commit/1757172237b31b1db4765251c9d3e85de5b37ec7))
* 🐛 lint errors ([9b399a3](https://github.com/antvis/x6/commit/9b399a3d68d29679144054212a003b244bebbfa0))
* 🐛 should auto update edge's parent when edge was added ([57fc8c8](https://github.com/antvis/x6/commit/57fc8c856657f0c58355e5a7fa88f71d1c76877d))

# @antv/x6 [1.2.0](https://github.com/antvis/x6/compare/@antv/x6@1.1.3...@antv/x6@1.2.0) (2020-12-02)


### Features

* support panning on normal graph ([#352](https://github.com/antvis/x6/issues/352)) ([7a50f7a](https://github.com/antvis/x6/commit/7a50f7aace64f0a657943195e5ef6b3fd7a46fbf)), closes [#339](https://github.com/antvis/x6/issues/339)

## @antv/x6 [1.1.3](https://github.com/antvis/x6/compare/@antv/x6@1.1.2...@antv/x6@1.1.3) (2020-12-02)

## @antv/x6 [1.1.2](https://github.com/antvis/x6/compare/@antv/x6@1.1.1...@antv/x6@1.1.2) (2020-12-02)


### Bug Fixes

* 🐛 inherit from poly ([97dc51f](https://github.com/antvis/x6/commit/97dc51f30a86b12a52d8b4d3cde7901616ccb490))
* 🐛 not dispose graph in minmap ([67c1428](https://github.com/antvis/x6/commit/67c142852ac9f37b7bf2e8dd3bdc295122fee4b1))
* 🐛 remove default pathData ([97950c3](https://github.com/antvis/x6/commit/97950c307680b4e22e732603aa5d037cbd56965c))
* 🐛 render of circlePlus ([252a326](https://github.com/antvis/x6/commit/252a326aff4447736cb73d888e71ff6f55b3b602))
* 🐛 text prop ([ec24e89](https://github.com/antvis/x6/commit/ec24e899902c26285f846ea39c5f9ba429c4ee7f))

## @antv/x6 [1.1.1](https://github.com/antvis/x6/compare/@antv/x6@1.1.0...@antv/x6@1.1.1) (2020-11-30)


### Bug Fixes

* 🐛 not dispose graph in minmap ([0b849cc](https://github.com/antvis/x6/commit/0b849ccdbee22a3a74e0036041c44b09f5cc0d96))

# @antv/x6 [1.1.0](https://github.com/antvis/x6/compare/@antv/x6@1.0.9...@antv/x6@1.1.0) (2020-11-27)


### Features

* Support jsdelivr and cdnjs CDN service [#335](https://github.com/antvis/x6/issues/335) ([#336](https://github.com/antvis/x6/issues/336)) ([f640235](https://github.com/antvis/x6/commit/f640235ce8f9fa0db74b35037e951d0410a7fb1f))

## @antv/x6 [1.0.9](https://github.com/antvis/x6/compare/@antv/x6@1.0.8...@antv/x6@1.0.9) (2020-11-27)

## @antv/x6 [1.0.8](https://github.com/antvis/x6/compare/@antv/x6@1.0.7...@antv/x6@1.0.8) (2020-11-25)

## @antv/x6 [1.0.7](https://github.com/antvis/x6/compare/@antv/x6@1.0.6...@antv/x6@1.0.7) (2020-11-25)


### Bug Fixes

* 🐛 used in unpkg "Uncaught ReferenceError: module is not defined" ([2863a29](https://github.com/antvis/x6/commit/2863a29da595a4a690e0b6c786669924dd8151aa)), closes [#329](https://github.com/antvis/x6/issues/329)

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
