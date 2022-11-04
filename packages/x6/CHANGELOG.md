# @antv/x6 1.0.0 (2022-11-04)


### Bug Fixes

* 🐛 'blank:click' was not triggered when rubberband is enabled ([5046487](https://github.com/antvis/x6/commit/50464871862a362df19bf2ef598892a41297ffe1)), closes [#222](https://github.com/antvis/x6/issues/222)
* 🐛 add comment, want to release new version ([1ba9b9c](https://github.com/antvis/x6/commit/1ba9b9c5036ec7914d134dfceb399ed7a540826b))
* 🐛 add default route for createLines in jumpover ([b627bdf](https://github.com/antvis/x6/commit/b627bdf9938895d5e4cfcce0bcd831865a029602))
* 🐛 add exception check for isLine and isCurve ([#1686](https://github.com/antvis/x6/issues/1686)) ([25c17b7](https://github.com/antvis/x6/commit/25c17b7679589b065c77625526ac0884fef05035))
* 🐛 add keepId for node clone ([#1254](https://github.com/antvis/x6/issues/1254)) ([cef5862](https://github.com/antvis/x6/commit/cef58628902aa97efa62f022203ebcaca3639092))
* 🐛 add onWheelGuard to prevent unwanted preventDefault ([#945](https://github.com/antvis/x6/issues/945)) ([56c812e](https://github.com/antvis/x6/commit/56c812ebbc49e8c23f595d4b708dac060c8d65d9))
* 🐛 add timeout for schedule ([#2303](https://github.com/antvis/x6/issues/2303)) ([a6a2d12](https://github.com/antvis/x6/commit/a6a2d12b07add27ef19eebbf7b5ca7cd17dde09e))
* 🐛 add ToJSONData type ([5e34da4](https://github.com/antvis/x6/commit/5e34da456afbdc64462c4ad10fb49c53d2be4a6a))
* 🐛 add toolsAddable config for interacting ([#1124](https://github.com/antvis/x6/issues/1124)) ([03f81e1](https://github.com/antvis/x6/commit/03f81e14ad0587d9c9666bd6f51fb53613c05275))
* 🐛 add updateCellId api ([#1739](https://github.com/antvis/x6/issues/1739)) ([78cdb3b](https://github.com/antvis/x6/commit/78cdb3bd56e7655ffcb2e5046d00f5d4f932cd3c))
* 🐛 add zindex for x6-widget-dne ([#1722](https://github.com/antvis/x6/issues/1722)) ([bf5b932](https://github.com/antvis/x6/commit/bf5b9329bd0d929ecba66c82af7f1ad934663669))
* 🐛 alerts on lgtm.com ([#1104](https://github.com/antvis/x6/issues/1104)) ([eb2791d](https://github.com/antvis/x6/commit/eb2791dee16440d8c8600b7819552892c2ce2c02))
* 🐛 animateAlongPath: do not rotate by default ([7343600](https://github.com/antvis/x6/commit/7343600f0274c389b2d4d05325d2fd6efdad6d44))
* 🐛 apps router ([8324eaa](https://github.com/antvis/x6/commit/8324eaa0a85cb14873f5095fe8d2695d80b5215a))
* 🐛 attr definition ([f86ab8e](https://github.com/antvis/x6/commit/f86ab8e2a7366e1d6562d510bc2ddbc58ec05f2d))
* 🐛 auto calc er router's direction ([405b703](https://github.com/antvis/x6/commit/405b703afc5f66af3ecd4bb8a29f753b39c29b0b))
* 🐛 auto extend scroller's graph with `async` mode ([cadc87c](https://github.com/antvis/x6/commit/cadc87cda66eda769af52dbca2d68ec5947d944a)), closes [#636](https://github.com/antvis/x6/issues/636)
* 🐛 auto fix node's css className on mouseenter ([#566](https://github.com/antvis/x6/issues/566)) ([efbc0ea](https://github.com/antvis/x6/commit/efbc0eae7f51f71b5129ae8aafe54d7de70a09dc)), closes [#558](https://github.com/antvis/x6/issues/558)
* 🐛 auto resize graph with flexbox ([0e4f9cf](https://github.com/antvis/x6/commit/0e4f9cf8939f377585cd2e3fddffd3f992e8c0ae))
* 🐛 auto rotate token ([fb5b6aa](https://github.com/antvis/x6/commit/fb5b6aa9e73552ca7ef1c025d9468244dca77891))
* 🐛 auto rotate token by default when animate along path ([1eb21b0](https://github.com/antvis/x6/commit/1eb21b014e407f07f03c8fecd1014e15a8f5cf7c))
* 🐛 auto scroll graph when drag magnet ([#1121](https://github.com/antvis/x6/issues/1121)) ([5b39576](https://github.com/antvis/x6/commit/5b39576c19c4f5c38ed6ffda1a94c0151a5ab17e))
* 🐛 auto scroller when selection over graph ([#1197](https://github.com/antvis/x6/issues/1197)) ([a826a7b](https://github.com/antvis/x6/commit/a826a7b03ee484bfcab9aca4c2ce966d75e46c3c))
* 🐛 auto update anchor when draggin segment ([6fb6ad6](https://github.com/antvis/x6/commit/6fb6ad6beac3bc8186f066ce8b113aa4a89487b5))
* 🐛 box-sizing style was overwrited ([8f783db](https://github.com/antvis/x6/commit/8f783db6b433837deace62959794934b582edcab))
* 🐛 break text with chinese characters(double byte character) ([14199bc](https://github.com/antvis/x6/commit/14199bc8529adddb347ef934926503a789b64980)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 can not select flat edge ([#1394](https://github.com/antvis/x6/issues/1394)) ([217a599](https://github.com/antvis/x6/commit/217a5997b4903c1da30ec277024cb57126699dde))
* 🐛 can overwirte shape when define new shape with `Node.define(...)` ([a112df3](https://github.com/antvis/x6/commit/a112df330634f880fb26aca90f61268d603938c2))
* 🐛 chang the call order of scale and translate ([66e1ce6](https://github.com/antvis/x6/commit/66e1ce66b86dde2be75600ab5f73e08efd0fb1ae))
* 🐛 change component -> render ([9239d81](https://github.com/antvis/x6/commit/9239d81a97e84cb8c82eebc5effaa98b869fc4df))
* 🐛 change jobqueue to transient ([0e39d94](https://github.com/antvis/x6/commit/0e39d9447bc8c0ba0b11c272bf9b64df9ba95a33))
* 🐛 change port cursor style when is not magnet ([daf9d8e](https://github.com/antvis/x6/commit/daf9d8eb2c474243c4906e659d24d2d41fcd89f0))
* 🐛 change rerender -> shouldComponentUpdate ([575329b](https://github.com/antvis/x6/commit/575329bce4c8df8e20d6673d9cfd27e9c0001343))
* 🐛 change startBatch to stopBatch ([#1744](https://github.com/antvis/x6/issues/1744)) ([7d9a2de](https://github.com/antvis/x6/commit/7d9a2deb4cd0d5bccc14a75af45daa9c4215b076))
* 🐛 change type of padding in ScaleContentToFitOptions ([#1203](https://github.com/antvis/x6/issues/1203)) ([1031d06](https://github.com/antvis/x6/commit/1031d0653b4641adfc27b7572b57d23fec0cc182))
* 🐛 changelog ([21dffd7](https://github.com/antvis/x6/commit/21dffd79ab3296b26678292630a299e6423fb0c2))
* 🐛 check correct magnet in validateConnection ([d507ae8](https://github.com/antvis/x6/commit/d507ae8b9111ab72abd73ca5e29d761ca45c50a5))
* 🐛 check target file before read it ([f5be30b](https://github.com/antvis/x6/commit/f5be30bd6d7167c14b47739b998e046a6e811350))
* 🐛 circular dependencies ([bfe8b85](https://github.com/antvis/x6/commit/bfe8b85b5d72d237008084534009222f612214d4))
* 🐛 copy csstype ([a06430d](https://github.com/antvis/x6/commit/a06430d5e160fb7e9ffb99abf518572009128428))
* 🐛 debounce update methords in scroller ([6e1bd9b](https://github.com/antvis/x6/commit/6e1bd9b5307b4cf17b3951168e10527d6111e5e5))
* 🐛 default transparent background for ForeignObject ([3ece3a8](https://github.com/antvis/x6/commit/3ece3a85ff01109fa29b6198647c0f7c9ea91823))
* 🐛 del getBBoxOfNeatElement ([b978482](https://github.com/antvis/x6/commit/b978482c281bb3d653a8e8309b5313b67a2c14e5))
* 🐛 disable track ([ad783f6](https://github.com/antvis/x6/commit/ad783f6dda13776e602edf80bd4be1e4d31e4090))
* 🐛 dnd events ([3e94b0b](https://github.com/antvis/x6/commit/3e94b0b1eafab8f43cff2601b088df24d1b062a4)), closes [#271](https://github.com/antvis/x6/issues/271)
* 🐛 dnd with snapline ([634b9fb](https://github.com/antvis/x6/commit/634b9fbe103b9613baec3668442e3a18e21083c7))
* 🐛 do not generate new commands on redoing/undoing ([5b3d713](https://github.com/antvis/x6/commit/5b3d7133f3a7b4841f461e67af5963ec84820741)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not render edge when any of it's terminal is not visible ([1b6c6a9](https://github.com/antvis/x6/commit/1b6c6a9b9d13a664abb7f843c5ee798eac6626b0)), closes [#300](https://github.com/antvis/x6/issues/300) [#300](https://github.com/antvis/x6/issues/300)
* 🐛 do not reset anchor when `resetAnchor` option is `false` ([dd86985](https://github.com/antvis/x6/commit/dd869853e649a7b2a8e04e6ee0d3bee4c45bbf58))
* 🐛 do not send track info when dev ([33f981c](https://github.com/antvis/x6/commit/33f981c5545e7abd4189e460f7c718e2f28bc334))
* 🐛 do not trigger cell:move event when not moved ([1bc1ac7](https://github.com/antvis/x6/commit/1bc1ac7c2298c77b334aa70de9ef327fa09af591)), closes [#355](https://github.com/antvis/x6/issues/355)
* 🐛 do not trigger change:zIndex when auto set zIndex at adding ([a99b415](https://github.com/antvis/x6/commit/a99b415ca3ec41136b46641280aa34e072be3c7f))
* 🐛 do not trigger getDropNode when drop at invalid area ([c6068ad](https://github.com/antvis/x6/commit/c6068ada6b967fa81be5c4b39c5e0d6b0402ce9c))
* 🐛 do not update pagesize automatically when set graph size ([949a42d](https://github.com/antvis/x6/commit/949a42dacfc5023d25bcabc0a3a1a7d8578f1b96)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 do not update tools when changed by tools ([73b2466](https://github.com/antvis/x6/commit/73b2466b4c2e1b514a48799c4acb925d8e52a1a2))
* 🐛 don't change cell id when setProp ([ffbb924](https://github.com/antvis/x6/commit/ffbb924b7da256542cfe9e67b15ac2425e3efa7a))
* 🐛 draw background multiple times to show the last image ([#1389](https://github.com/antvis/x6/issues/1389)) ([783705a](https://github.com/antvis/x6/commit/783705aafac0f4f1078d61e119063a9f9b7f3c40))
* 🐛 edge connection error ([b3a5d03](https://github.com/antvis/x6/commit/b3a5d032a3d75d4c094db90150c19c84b1ba787f)), closes [#245](https://github.com/antvis/x6/issues/245)
* 🐛 edge vertices can be point data array `[number, number][]` ([59cd7fb](https://github.com/antvis/x6/commit/59cd7fb0614cc918d66a86f88dbfec54820dee03))
* 🐛 equal points ([c415c1d](https://github.com/antvis/x6/commit/c415c1d6acc27678de6bdb1e1fbb2a92a810c220))
* 🐛 exclude edge on node:move event ([#593](https://github.com/antvis/x6/issues/593)) ([ffcfe5c](https://github.com/antvis/x6/commit/ffcfe5c76fb500f0320d8037751e30d14a544960))
* 🐛 filter not working when select cell by calling `select()` api or by click ([#314](https://github.com/antvis/x6/issues/314)) ([7a3e547](https://github.com/antvis/x6/commit/7a3e54731940f5dcc2a15b8d338aedf64fc63619)), closes [#305](https://github.com/antvis/x6/issues/305)
* 🐛 find dom node ([71f17ac](https://github.com/antvis/x6/commit/71f17aca11912529ac052bd95a8afffab026b997))
* 🐛 find snap view ([6f5fab2](https://github.com/antvis/x6/commit/6f5fab2f53e76133f127d47233ec7bb560057355))
* 🐛 findParent args ([ba39109](https://github.com/antvis/x6/commit/ba39109ee6ff3f570610d3ab6acb060711711153))
* 🐛 fiter nodes when rubberband ([#1408](https://github.com/antvis/x6/issues/1408)) ([f42ca0c](https://github.com/antvis/x6/commit/f42ca0c76132fbecd95f145be3e4f671346b80b3))
* 🐛 fix add tools not work ([f5d1d6a](https://github.com/antvis/x6/commit/f5d1d6a326021247ee8967675fc9490ddbb6d0aa))
* 🐛 fix alerts of lgtm ([4d99a33](https://github.com/antvis/x6/commit/4d99a33f9f28023382e4af5a65d4aef6386ee24d))
* 🐛 fix alerts on lgtm.com ([42a5afb](https://github.com/antvis/x6/commit/42a5afbc380c547229d3a985c68930bf368a3c7c))
* 🐛 fix background size when not defined, fixed [#1070](https://github.com/antvis/x6/issues/1070) ([#1072](https://github.com/antvis/x6/issues/1072)) ([29d9bc5](https://github.com/antvis/x6/commit/29d9bc590d85d4f684c866480c77e130abcd74b0))
* 🐛 fix bbox calc error in firefox ([f623d39](https://github.com/antvis/x6/commit/f623d397cd802a03fdc4d1a06da9e8918618bae2))
* 🐛 fix can not scroller by mousewheel ([c8ffd16](https://github.com/antvis/x6/commit/c8ffd1611703f742e7cb2b167ddbd8acad7e7e2c))
* 🐛 fix cellEditorOptions typo ([#1895](https://github.com/antvis/x6/issues/1895)) ([4d174d7](https://github.com/antvis/x6/commit/4d174d7807463d64ff248fe4ee1e09010bad4bfc))
* 🐛 fix demo error in x6 sites ([#1108](https://github.com/antvis/x6/issues/1108)) ([3d8b78d](https://github.com/antvis/x6/commit/3d8b78d1f207bdc042c733e40a679d5e17eee5c0))
* 🐛 fix draw background ([a2c4af2](https://github.com/antvis/x6/commit/a2c4af2317469942823a6e9fad234f0a0752653f)), closes [#466](https://github.com/antvis/x6/issues/466)
* 🐛 fix eslint errors ([052fe61](https://github.com/antvis/x6/commit/052fe61481e3d1d9372178b55b92f20aa8cc1b71))
* 🐛 fix factor calculation in mousewheel ([#855](https://github.com/antvis/x6/issues/855)) ([e2c4a2a](https://github.com/antvis/x6/commit/e2c4a2ac11a13d9b65fe915269e1bdd27e808c6a))
* 🐛 fix getBBoxByElementAttr ([af8eeb0](https://github.com/antvis/x6/commit/af8eeb0ece34760ae3c4fe76367eb18f53107cf0))
* 🐛 fix handledTranslation option passing to child node ([c4c61d4](https://github.com/antvis/x6/commit/c4c61d485b21f16babdd0abf414397f05ef7ec7e))
* 🐛 fix html rerender ([8db809c](https://github.com/antvis/x6/commit/8db809c98b42cadaae218ac64e21cb92fbd2f342))
* 🐛 fix karma can not process lodash-es ([ed9e942](https://github.com/antvis/x6/commit/ed9e94283dfe78a73e4a4aa3423ecb11e7630333))
* 🐛 fix lint error ([a73cf3f](https://github.com/antvis/x6/commit/a73cf3fb3559657189502dc434d3bef4d7174ef6))
* 🐛 fix lint error ([#1649](https://github.com/antvis/x6/issues/1649)) ([f793682](https://github.com/antvis/x6/commit/f7936826f026169ccf094cee28f54bb13d15ef9b))
* 🐛 fix marker of shadow edge ([a630a4c](https://github.com/antvis/x6/commit/a630a4ce1f9c1d3fc6aa7c9d904c8725fdda8d58))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([7638143](https://github.com/antvis/x6/commit/7638143b04c0a50a333200423753f6bd19a6ceb3))
* 🐛 fix node immovable cursor style ([679be4b](https://github.com/antvis/x6/commit/679be4bdab4eecfab033adee81beed03469d09af))
* 🐛 fix node translation with selected children ([9049aa1](https://github.com/antvis/x6/commit/9049aa1ad23cb2f652328a66317856633cdbc558))
* 🐛 fix node:move event triggered source ([36ef943](https://github.com/antvis/x6/commit/36ef943a49badcd9ed5bab0719155f807da4b79d))
* 🐛 fix not refresh after removeTool ([8b56c14](https://github.com/antvis/x6/commit/8b56c14deb29fef9838532b3b087abb25d1c3ce5))
* 🐛 fix option merge order in paste ([#1350](https://github.com/antvis/x6/issues/1350)) ([3fba6fd](https://github.com/antvis/x6/commit/3fba6fd82000c4e26e5ae6842fb86c87ac1a36bf))
* 🐛 fix return types ([5cc2174](https://github.com/antvis/x6/commit/5cc21741bf71192c3834322bce59ea04ac8c3f74))
* 🐛 fix scroller content size when not autoResize ([578db9d](https://github.com/antvis/x6/commit/578db9dc252eca30716ce15eb06f4d10f46a5823))
* 🐛 fix scroller content size when not autoResize ([#1237](https://github.com/antvis/x6/issues/1237)) ([327350e](https://github.com/antvis/x6/commit/327350e7b78fd941a0d0bde948acceba856b2592))
* 🐛 fix source graph and target graph not updating synchronously when transform in panning mode ([#1832](https://github.com/antvis/x6/issues/1832)) ([0de1f22](https://github.com/antvis/x6/commit/0de1f2227158fc8c6c6f762de64b8a50118292a9))
* 🐛 fix sourceMarker and targetMaker position ([e1b927f](https://github.com/antvis/x6/commit/e1b927fa21dab980abfb273eb8fe8ae5a1cc224e))
* 🐛 fix start pos error in mousewheel ([e9cc7ba](https://github.com/antvis/x6/commit/e9cc7ba76547ea29b71c054ffa44c18ae74e8b32))
* 🐛 fix the embedded triggered source ([80640fc](https://github.com/antvis/x6/commit/80640fcb466fdce234c2b64a0ec79e5a0258ed0c))
* 🐛 fix the interaction of arrowhead ([1319429](https://github.com/antvis/x6/commit/1319429312d9476ae8449cd00845f91601269e67))
* 🐛 fix the judgment error of dom object ([c0ee764](https://github.com/antvis/x6/commit/c0ee7648b5e706e36ffb45421fbac36356eabd26))
* 🐛 fix tools ware removed when update cell ([0f2f802](https://github.com/antvis/x6/commit/0f2f8028e8351a68d4ac91370ec1c4b08a3458a9))
* 🐛 fix type defines ([a487096](https://github.com/antvis/x6/commit/a487096047f4d430a7036fe5ec781dca11ef4da8))
* 🐛 fix type definition of node and edge registry ([eb5f0cd](https://github.com/antvis/x6/commit/eb5f0cdec2a7dab709d4baa319a26e403b22787e)), closes [#478](https://github.com/antvis/x6/issues/478)
* 🐛 fix type definitions ([1bd6d81](https://github.com/antvis/x6/commit/1bd6d815eace3b5af30c66dc84cd66bb9a77c38a))
* 🐛 fix validateEdge trigger timming ([48b72a1](https://github.com/antvis/x6/commit/48b72a1332d536a8b640fbfc6a3e4c463f5b79bc))
* 🐛 get bearing between me and the given point ([07d0c1d](https://github.com/antvis/x6/commit/07d0c1d6ba1e9362d235a1f1a85696febc65839a))
* 🐛 get children or parent delay ([#1641](https://github.com/antvis/x6/issues/1641)) ([8508b91](https://github.com/antvis/x6/commit/8508b91da297fef7819d6404854f4592466dec62))
* 🐛 get completed picture when execue toPNG ([c48a5cf](https://github.com/antvis/x6/commit/c48a5cf15da4f51641890f880a509aab7476d6ab))
* 🐛 get container size use offsetxxx ([a66ab4f](https://github.com/antvis/x6/commit/a66ab4fd5b14432437928b19883be2abb94ab70d))
* 🐛 global `process` should be replaced when build with rollup ([b459b61](https://github.com/antvis/x6/commit/b459b61a7aa966ff83bfb5992586aed2583b8a46)), closes [#324](https://github.com/antvis/x6/issues/324)
* 🐛 guard option not available ([b8ffaaf](https://github.com/antvis/x6/commit/b8ffaaf376f1b7a69d96fccde48a8de82e951660)), closes [#281](https://github.com/antvis/x6/issues/281)
* 🐛 html shape ([45c9109](https://github.com/antvis/x6/commit/45c9109c9125ce1791698d01710984e5fd71b4c3))
* 🐛 ignore magnet event when magnet attribute is 'false' ([0abeb64](https://github.com/antvis/x6/commit/0abeb64b5a31d40b9732d02930a84fd92058573e))
* 🐛 ignore null keys on toJSON ([ac14d3b](https://github.com/antvis/x6/commit/ac14d3bb4454e075c8ef7757db01c4fa78222705))
* 🐛 inherit from 'edge' by default ([11762b9](https://github.com/antvis/x6/commit/11762b9f5511a35dfb40b6d88093f06002d88911))
* 🐛 inherit from poly ([1072c4a](https://github.com/antvis/x6/commit/1072c4aae64ba89968b7c9127080b5f68f853c5e))
* 🐛 konb 和 transform 的控制旋钮,在交互时只显示正在交互的旋钮 ([1082be2](https://github.com/antvis/x6/commit/1082be247caaa322c23ad61e30368c6f48074562))
* 🐛 linear gradient along edge path ([669fc5b](https://github.com/antvis/x6/commit/669fc5bd2d57635ce9d45dc0470674dad74f4add)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([333689a](https://github.com/antvis/x6/commit/333689a880a30dbc0879705b7f655cec8d30f1df)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 lint errors ([e59ff85](https://github.com/antvis/x6/commit/e59ff851cac506609574cbf3baec1982ddb4e373))
* 🐛 lint errors ([aa541b9](https://github.com/antvis/x6/commit/aa541b9873b417c092f415ea6a83f01e01777d98))
* 🐛 lint errors ([ec9de95](https://github.com/antvis/x6/commit/ec9de956a8f8388a152a4e9d44ea8f66a78030c5))
* 🐛 listen mousedown event on scroller container ([#1642](https://github.com/antvis/x6/issues/1642)) ([7687cb2](https://github.com/antvis/x6/commit/7687cb201a7b2be38b67524f99d4226b9e3e30d1))
* 🐛 lost remove batch event when cell was removed ([2f9899c](https://github.com/antvis/x6/commit/2f9899cf98ee40e5c2c2ef6eafeb5fd8c26a545d))
* 🐛 make sure css resource is disposed  after all graph instance is disposed ([640208c](https://github.com/antvis/x6/commit/640208c4b2ebb836a3a77e665b1a5d95e5ac3e8e))
* 🐛 modifer key of panning and selecting ([8050aff](https://github.com/antvis/x6/commit/8050aff3d9980391acf558706ffc80e292e3b53c))
* 🐛 modifier keys of panning and selecting ([3e749a8](https://github.com/antvis/x6/commit/3e749a84f933d6230128effe192ed3d5009f11d3))
* 🐛 modify the font size even if the text does not change ([#1397](https://github.com/antvis/x6/issues/1397)) ([5731f76](https://github.com/antvis/x6/commit/5731f761bacb2757e6c780deedee41e05bd8049c))
* 🐛 mouse event on start dnd ([242c44c](https://github.com/antvis/x6/commit/242c44cad4e6272a0d4c0c3dec0b847cef28ea72))
* 🐛 mousewheel direction ([733fa7a](https://github.com/antvis/x6/commit/733fa7a71d9cf7a36776513131de556e83c3f4b1)), closes [#250](https://github.com/antvis/x6/issues/250)
* 🐛 node:xxx event was not triggered when interact with selection boxes ([34cd5a0](https://github.com/antvis/x6/commit/34cd5a0737b291357d398b8ef2f5c58b113a1fc3)), closes [#297](https://github.com/antvis/x6/issues/297)
* 🐛 normalize event before get clientX ([#1387](https://github.com/antvis/x6/issues/1387)) ([6b32a03](https://github.com/antvis/x6/commit/6b32a034471ebf2a85f6324eae3d2013d956ace0))
* 🐛 not clean selection when mousedown ([7774ed9](https://github.com/antvis/x6/commit/7774ed9fff6018c333de46c3be2b552d55aa133e))
* 🐛 not create label when text is empty ([#1783](https://github.com/antvis/x6/issues/1783)) ([ed1fcd1](https://github.com/antvis/x6/commit/ed1fcd1f26601150d1b7913b8eaaf329a958af53))
* 🐛 not dispose graph in minmap ([337453e](https://github.com/antvis/x6/commit/337453e1919af5c5ed1722bea4d00c729d561915))
* 🐛 not stopPropagation when mousedown ([#1305](https://github.com/antvis/x6/issues/1305)) ([bc32284](https://github.com/antvis/x6/commit/bc322846007d081a18908331852533f075941daa))
* 🐛 notify event args ([14dc8a3](https://github.com/antvis/x6/commit/14dc8a38289322cb309b3db1e0ea55ae1587d889))
* 🐛 numberic terminal id ([fd09ba3](https://github.com/antvis/x6/commit/fd09ba39d1637e29227eebc1a9335f0fdfb13614))
* 🐛 numberic terminal id ([03e75f4](https://github.com/antvis/x6/commit/03e75f4c256dbda303d182a7570b744cb9744ae5))
* 🐛 offset connection point ([fbb815f](https://github.com/antvis/x6/commit/fbb815f85bbc4a1bbfb1567143f1329eac42d467))
* 🐛 offset connection point ([75a8a83](https://github.com/antvis/x6/commit/75a8a835568e8bb5d0beb40b6b7e0791e8a47233))
* 🐛 only append SVG tool to ToolsView, HTML tools should handle manually ([44c5117](https://github.com/antvis/x6/commit/44c5117a0c22d6847e7374ab9efe7dce51de44af))
* 🐛 only delay svg attr ([4116769](https://github.com/antvis/x6/commit/4116769676d0ebbb91c062640a2e99c14181da6a))
* 🐛 optimize addTools params ([1366eac](https://github.com/antvis/x6/commit/1366eac7f554ede24db6c558c581142ecb7c1a37))
* 🐛 optimize cell remove method ([391fe8f](https://github.com/antvis/x6/commit/391fe8fd88f10d936c5860f465c7a423632f30f9))
* 🐛 optimize get child method ([#1262](https://github.com/antvis/x6/issues/1262)) ([297b4f3](https://github.com/antvis/x6/commit/297b4f38148afa40f1984b00dbd1d9d8f0e6e6ef))
* 🐛 optimize setText for edge-editor ([#1877](https://github.com/antvis/x6/issues/1877)) ([928b678](https://github.com/antvis/x6/commit/928b678f35ddf495ce73a405d0e0d1f568b6d660))
* 🐛 optimize usage of mousewheel ([37b3010](https://github.com/antvis/x6/commit/37b3010f763926fbd04d822e74238f6e206c024c))
* 🐛 passive event ([39ca4a2](https://github.com/antvis/x6/commit/39ca4a23af4287d5aa43e36b78a8de2d39ce44bd))
* 🐛 path error when rewrite prop ([913274b](https://github.com/antvis/x6/commit/913274b7526d6508105553f28bbf828170abbb63))
* 🐛 prevent handle 'delete' and 'backsapce' key triggered from input ([e977db6](https://github.com/antvis/x6/commit/e977db61b01b15496cd361c197b1be078db2dd77))
* 🐛 preventDefault on scroll ([0fa61d2](https://github.com/antvis/x6/commit/0fa61d2cc717d186ecfa3959943b4ad648c16f20))
* 🐛 preventScroll when focus graph ([#1116](https://github.com/antvis/x6/issues/1116)) ([40a18f7](https://github.com/antvis/x6/commit/40a18f7fe662bd60a07f242fbff7584e5a83e825))
* 🐛 process special attributes of text ([602426e](https://github.com/antvis/x6/commit/602426e5b248d02b49b8d0525f01ff8c95fc8d91))
* 🐛 recover the lost minimap style ([a4f6ad1](https://github.com/antvis/x6/commit/a4f6ad1e55773416700f0888b1a98455249e62e8))
* 🐛 ref should be null after clean ([f88d005](https://github.com/antvis/x6/commit/f88d0051cea6ce832abc6881aea7c003b5c1f1c0))
* 🐛 release x6 v1.28.2 ([#1654](https://github.com/antvis/x6/issues/1654)) ([745b90a](https://github.com/antvis/x6/commit/745b90ac94dbbd9443ecf1456e6a5aa9eb646594))
* 🐛 remove code tracing ([c4fa84d](https://github.com/antvis/x6/commit/c4fa84d6dfffc8d098f38f083e0bf6bcd571951a))
* 🐛 remove default pathData ([7ae5776](https://github.com/antvis/x6/commit/7ae57764ca375d62cafd6695ae75a39a09fae047))
* 🐛 remove default points attr of polygon and polyline ([ccab7a2](https://github.com/antvis/x6/commit/ccab7a2a1c30955239891149d1c1e9250160bbe5)), closes [#304](https://github.com/antvis/x6/issues/304) [#304](https://github.com/antvis/x6/issues/304)
* 🐛 remove next listeners in the previous handler ([66bd476](https://github.com/antvis/x6/commit/66bd476f8acbb0b5a3d9edab1fb4316a184b4d8b))
* 🐛 remove prop by path ([7f213d0](https://github.com/antvis/x6/commit/7f213d0020733c19d2872432f1e0666aa2e9ab91))
* 🐛 remove prop not remove attr ([#1225](https://github.com/antvis/x6/issues/1225)) ([997257f](https://github.com/antvis/x6/commit/997257ff8ce904a60133c3e445e96cb07f4c3e36))
* 🐛 remove single tool by name or index ([#565](https://github.com/antvis/x6/issues/565)) ([73d5d67](https://github.com/antvis/x6/commit/73d5d67541d4950a9c362a3bc7c7e6200640b40f)), closes [#552](https://github.com/antvis/x6/issues/552)
* 🐛 remove space ([d1e9cb9](https://github.com/antvis/x6/commit/d1e9cb95cbe55c0d3f35da7593688a015fa8ffb8))
* 🐛 render of circlePlus ([05d618a](https://github.com/antvis/x6/commit/05d618afa4467d91a7859388890289db1aae48d8))
* 🐛 resize graph ([547ce82](https://github.com/antvis/x6/commit/547ce82784724ff29f72457e9a25fbdd1a21b4d2))
* 🐛 resize scroller and graph ([2a69150](https://github.com/antvis/x6/commit/2a691501ec89f60ce61e8bab4e22483ce7ebf44a))
* 🐛 restore dom after disposed ([ef6dca8](https://github.com/antvis/x6/commit/ef6dca8eca3b6c9cfc80b1e962ff6c82090a10dc))
* 🐛 restrict unembed condition ([b492d16](https://github.com/antvis/x6/commit/b492d165e3f5b8cb9b974c5c99ab720bf7ec88ef))
* 🐛 revert delay text attr tmp ([03e7dd5](https://github.com/antvis/x6/commit/03e7dd5d70fda9c5391106b2eff3b78d280f5b3b))
* 🐛 revert fix scroller content size ([#1120](https://github.com/antvis/x6/issues/1120)) ([983ad59](https://github.com/antvis/x6/commit/983ad59c48bd2f34c878d0ac43c09edc23fce9e6))
* 🐛 revert function refactor ([b4c9f86](https://github.com/antvis/x6/commit/b4c9f863f56ae1ff8178078420a55f6afccf43e6))
* 🐛 revert getBoundingRect change ([87d714d](https://github.com/antvis/x6/commit/87d714d02f01ca9d5c5ca07b9936655fa618b510))
* 🐛 revert optimze find snap elem ([#1192](https://github.com/antvis/x6/issues/1192)) ([741beae](https://github.com/antvis/x6/commit/741beaef43a0409a760adf0ae7ab12e72647bfe2))
* 🐛 revert View.find ([0d94179](https://github.com/antvis/x6/commit/0d94179c6af7ae110232eebd3402b29e4f67df3e))
* 🐛 rotate anchor ([9684596](https://github.com/antvis/x6/commit/9684596f2d920889cd959deeb4552fd5ea4c7742))
* 🐛 round path segment points ([0a54807](https://github.com/antvis/x6/commit/0a548073de51f08c0e73caece678a3253a44d128))
* 🐛 segments tool not work ([dd7ccce](https://github.com/antvis/x6/commit/dd7ccce21654ee70ded7c9ecbfe73e4084d95f3b))
* 🐛 selection box donot disappeared when select nothing ([b59ad6d](https://github.com/antvis/x6/commit/b59ad6d0acd8104c3aaf8ce631eff83314fa6892))
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([9dded68](https://github.com/antvis/x6/commit/9dded6853d66b86e7bbeb738b2df15b51d1a8627))
* 🐛 shake of selection events triggering ([541be16](https://github.com/antvis/x6/commit/541be16366785d28882a33d1d2b07ba8aa026072))
* 🐛 share registry of node and edge ([e82bf67](https://github.com/antvis/x6/commit/e82bf67be6b6fd8d2589dc6928a332a5923018fe))
* 🐛 should apply prop hooks when update props by `prop()` method ([5c461e0](https://github.com/antvis/x6/commit/5c461e03245860d9784b2ff83a2d4e10e92e50f0))
* 🐛 should auto normalize path data when parse path from string ([b438eea](https://github.com/antvis/x6/commit/b438eeabd574487f7082f9a15a1a0ed57f5ce124))
* 🐛 should auto remove tools on cell was removed ([8194056](https://github.com/antvis/x6/commit/81940566cc3f561e27ab52d62ccfca40920b988b)), closes [#383](https://github.com/antvis/x6/issues/383)
* 🐛 should auto remove tools when removing cells ([e8d2bf0](https://github.com/antvis/x6/commit/e8d2bf0f5ccf1a36043f550cec01b079e1df8f11))
* 🐛 should auto update edge's parent when edge was added ([280a58d](https://github.com/antvis/x6/commit/280a58da8e0baeaa6aaa10df0ea8b7d892aaa4d0))
* 🐛 should auto update scroller when unfreeze ([be5f51c](https://github.com/antvis/x6/commit/be5f51cc03b873b46c08f132a3ade9f015a312c5))
* 🐛 should clean cells on destroy graph ([a17ae48](https://github.com/antvis/x6/commit/a17ae488f3db64164c68fb7de8d7af2d9d5e24cc)), closes [#600](https://github.com/antvis/x6/issues/600)
* 🐛 should clear knob on forcused node changed ([3df2bf3](https://github.com/antvis/x6/commit/3df2bf32871017dfef860b8996fe462676b8218b))
* 🐛 should copy inline style to scroller container ([f8e09c1](https://github.com/antvis/x6/commit/f8e09c10c4c78d98c61dca7d86a44351a72c62dd))
* 🐛 should deep merge attrs ([c2769f7](https://github.com/antvis/x6/commit/c2769f72f4f2a94f2876a8e4d535280ed4541ec8))
* 🐛 should not effect the model's collection on select cell ([b674bb5](https://github.com/antvis/x6/commit/b674bb50e10868cd1c2e8ef25ea1130dfac00577))
* 🐛 should not render cell when invisible ([c9535b5](https://github.com/antvis/x6/commit/c9535b5604cda94066d80df0d43c85921f0ab978)), closes [#300](https://github.com/antvis/x6/issues/300)
* 🐛 should remove selection box after cell was removed ([90e706f](https://github.com/antvis/x6/commit/90e706f9f4ad78035299e50460ab09aab2221a0f))
* 🐛 should render html tool in the graph container ([6928e94](https://github.com/antvis/x6/commit/6928e94057ce61ed9632872daab74e41db55ed00))
* 🐛 should render vertices tool with lowest z-index ([213a01f](https://github.com/antvis/x6/commit/213a01fca28b1e790ce58d228aa460ea798bb98f)), closes [#638](https://github.com/antvis/x6/issues/638)
* 🐛 should return `stop` method when calling `sendToken` ([45a3320](https://github.com/antvis/x6/commit/45a3320978ebe059e8f2016bd0e46e5ab6ed0745))
* 🐛 should stop dragging when validate node async ([02e5c2f](https://github.com/antvis/x6/commit/02e5c2fbdf6bc0cd0fb1f3b2fe3acb662dbe3268)), closes [#429](https://github.com/antvis/x6/issues/429)
* 🐛 should support multi knobs ([0d64a10](https://github.com/antvis/x6/commit/0d64a104ada08223a075d3835e37c2d8c47812a7))
* 🐛 should trigger batch event on cell ([062c58d](https://github.com/antvis/x6/commit/062c58dc7038008834ced715cfa4ff6660572543))
* 🐛 should undelegate document events on dropped ([69b2d41](https://github.com/antvis/x6/commit/69b2d41f48e1694b61ed1e1043af2bac29c2e859)), closes [#360](https://github.com/antvis/x6/issues/360)
* 🐛 should unselect previous selected cell when single selecting ([49c3ca7](https://github.com/antvis/x6/commit/49c3ca7aa1b462536eada7f78456a3c733b907fe))
* 🐛 should update inner reference when set "parent" and "children" by `prop()` ([db2b4a1](https://github.com/antvis/x6/commit/db2b4a1cc43312c7af467c911129d14c2abc8a6d))
* 🐛 sort views after async graph rendered ([37ea8bb](https://github.com/antvis/x6/commit/37ea8bbfe049018d879d5a2b6d584ef60c0aca09))
* 🐛 specify return type ([a91e84b](https://github.com/antvis/x6/commit/a91e84ba452b0fca3f992b7467f2a094f07020c1))
* 🐛 src dir included in publication ([1ef864b](https://github.com/antvis/x6/commit/1ef864b7a45e32cd23a63eec48cc4ff2fa6170e2))
* 🐛 Stencil searches are case sensitive ([#1211](https://github.com/antvis/x6/issues/1211)) ([39dcc9d](https://github.com/antvis/x6/commit/39dcc9d895f5b52524416ed1859558757d2f551b))
* 🐛 stop panning when mouseleave body ([#1741](https://github.com/antvis/x6/issues/1741)) ([d23ea46](https://github.com/antvis/x6/commit/d23ea460109e3f487dbc249db9545e8d440f0789))
* 🐛 stop propagation when enable following ([#1398](https://github.com/antvis/x6/issues/1398)) ([a256bbf](https://github.com/antvis/x6/commit/a256bbf9a281c57e1b8db4d725952e9b57f3d6c4))
* 🐛 support css var in font-size ([3f9268b](https://github.com/antvis/x6/commit/3f9268b93ae2561169389bda41248313ec4f2d41))
* 🐛 support function on interacting items ([9416048](https://github.com/antvis/x6/commit/94160481ebbbc3fb9e8c446b418214133cc07aec))
* 🐛 support register html render object ([c1813ad](https://github.com/antvis/x6/commit/c1813adc5e329fa113ced406b4f5b8d2a0efb621))
* 🐛 take the stroke-width into account when calc connection point ([9a8cb11](https://github.com/antvis/x6/commit/9a8cb11fb4c29ac04ac939403c3ace4fe574c06a))
* 🐛 text prop ([7da0139](https://github.com/antvis/x6/commit/7da013948eeaa75d123c447bdb0d9a3f53b08a59))
* 🐛 toggle visible ([87db4d1](https://github.com/antvis/x6/commit/87db4d1f9fccc3aea2970b995cf96a1f6a8da7e0))
* 🐛 tool changes should be sync render ([0d334d1](https://github.com/antvis/x6/commit/0d334d1eb675e2cc800b80c4591af26a301697f8))
* 🐛 tool changes should be sync render ([ea222f8](https://github.com/antvis/x6/commit/ea222f84fb6033e7e6219f54f3c27dddd7df4d11))
* 🐛 translateSelected nodes exclude self ([#1238](https://github.com/antvis/x6/issues/1238)) ([857fbe0](https://github.com/antvis/x6/commit/857fbe0574ba051b1fa06d4dab925c283c2721e7))
* 🐛 translateSelectionNodes is only triggered manually ([bfd52cf](https://github.com/antvis/x6/commit/bfd52cf56546ca24e667c5a70eb8024db20c4b48))
* 🐛 trigger custom event ([7389fe1](https://github.com/antvis/x6/commit/7389fe13ad277da5f430e9a177ddd254398aceb5))
* 🐛 type define ([f5fa4a9](https://github.com/antvis/x6/commit/f5fa4a94978662d5cbfe1426625061e3f79db8fe))
* 🐛 typos ([aa70a78](https://github.com/antvis/x6/commit/aa70a7821e08a754a60862ac1f6a4061e8619eac))
* 🐛 typos ([d820ef5](https://github.com/antvis/x6/commit/d820ef5603f81067e395d6be7060b0ea35a81f44))
* 🐛 typos ([8b81d09](https://github.com/antvis/x6/commit/8b81d0945f3e12452d353046ac7eb8ac531128af))
* 🐛 unexpected feedback in "vertices" edge tool ([#1680](https://github.com/antvis/x6/issues/1680)) ([307584f](https://github.com/antvis/x6/commit/307584f017cedcaf9bc4f4e5b4eefdcabcb35926)), closes [antvis/X6#1679](https://github.com/antvis/X6/issues/1679)
* 🐛 unified panning api ([#1151](https://github.com/antvis/x6/issues/1151)) ([d60e9d8](https://github.com/antvis/x6/commit/d60e9d882dfa85bf39b47ba75a6379b5cbd1a965))
* 🐛 unselect cell by clicking cell and holding on the meta key ([289ca84](https://github.com/antvis/x6/commit/289ca84a685dfcc4ffec19c8c66e26d945fdfd39))
* 🐛 unselect cell by clicking the selection box and hold on the meta key ([939b4f2](https://github.com/antvis/x6/commit/939b4f2b92899e7f1f8bd724eb541ccfc08cc216)), closes [#364](https://github.com/antvis/x6/issues/364)
* 🐛 update arrowhead on dragging ([93dcb53](https://github.com/antvis/x6/commit/93dcb53446630d55fd887915a9ba136c26841368))
* 🐛 update delay attrs async when node is not caller ([cd5aacc](https://github.com/antvis/x6/commit/cd5aacc1d546fa97e1dd3a1fa8ea9ef70178dd07))
* 🐛 update node's incomings and outgoings when edge was removed ([e6fa34c](https://github.com/antvis/x6/commit/e6fa34c872c2231ed8b2c20046f0d4ef346be010)), closes [#241](https://github.com/antvis/x6/issues/241)
* 🐛 update page size as needed when graph size changed ([#571](https://github.com/antvis/x6/issues/571)) ([14a13a8](https://github.com/antvis/x6/commit/14a13a8d63cb812a7facbc202d189654dde23211)), closes [#564](https://github.com/antvis/x6/issues/564)
* 🐛 update selection boxs on after cell view updated ([654f179](https://github.com/antvis/x6/commit/654f179fc1947e519162915159cad401555e22ff))
* 🐛 update x6 version ([#1655](https://github.com/antvis/x6/issues/1655)) ([07037be](https://github.com/antvis/x6/commit/07037beb59537d0feaa47ac1ab629d8c9b8c3a8b))
* 🐛 update x6-vector version ([#1656](https://github.com/antvis/x6/issues/1656)) ([d4d2125](https://github.com/antvis/x6/commit/d4d21251cc42d263327ea72edb8a038d7ef71c89))
* 🐛 usage of node tools ([6940868](https://github.com/antvis/x6/commit/69408681601df4fc0783868ec46f9077acf066c9))
* 🐛 used in unpkg "Uncaught ReferenceError: module is not defined" ([2863a29](https://github.com/antvis/x6/commit/2863a29da595a4a690e0b6c786669924dd8151aa)), closes [#329](https://github.com/antvis/x6/issues/329)
* 🐛 validateEdge is sync ([96d4c3d](https://github.com/antvis/x6/commit/96d4c3d29ce0aab40b90c5e0faee7a69cd7e66ea))
* 🐛 version error ([5c80d69](https://github.com/antvis/x6/commit/5c80d69f66217e131176fce89b95d30bd47e3c4c))
* 🐛 x6 version ([803cd3e](https://github.com/antvis/x6/commit/803cd3ee0bdc137ce4043e6ec8ab14b0c65fa40d))
* 🐛 x6 version ([1eb5359](https://github.com/antvis/x6/commit/1eb535924ea0358ab7d8bb3b9dab009ec3c0c04c))
* 🐛 事件队列在事件回调用被修改,应该先缓存起来 ([11ae208](https://github.com/antvis/x6/commit/11ae20861d9fe62b394de3d4afee3a0e8eb3bd64))
* add `placeholder` and `notFoundText` for stencil component ([#574](https://github.com/antvis/x6/issues/574)) ([c42464b](https://github.com/antvis/x6/commit/c42464b376835dc5c4e2139582fbe09df4183153)), closes [#555](https://github.com/antvis/x6/issues/555)
* add graph reference on model ([9f5e88d](https://github.com/antvis/x6/commit/9f5e88de0f4f571702137e050110ada83ade6c64))
* add judgment in sepcial event ([19e323f](https://github.com/antvis/x6/commit/19e323f89e3c0f0330e72567d7dc46f1aeedd761))
* add trigger point for update in scroller ([6fe3ec2](https://github.com/antvis/x6/commit/6fe3ec21b20bab39a664cace5aa4d2407ab62331))
* afterCreate hook can return nullable values ([b783246](https://github.com/antvis/x6/commit/b7832461f2aba5e0e5039542af56cb67c881ed6a))
* alerts on lgtm.com ([7e0e00f](https://github.com/antvis/x6/commit/7e0e00f535cc3a81bd5ab50d6f828bb731a6ced0))
* **anchor:** position of anchor and connection point ([f8f432a](https://github.com/antvis/x6/commit/f8f432afcef3cf5aec0c72cc351e8065c9c4559f))
* anchors not align with the center of html border ([9a5f335](https://github.com/antvis/x6/commit/9a5f3350e3bdc2ce9299a5b34eba4c6a334443dd))
* animation examples ([e439f5b](https://github.com/antvis/x6/commit/e439f5b2fa72fcca7a71f3495aa9df0b47a71aa4))
* attribute name contains ":" should not be converted to kebabCase ([bbb29e9](https://github.com/antvis/x6/commit/bbb29e9293f43a3cfd5e41b56a49af5ba45486ef))
* auto reference and update parent when create an edge ([f510dc8](https://github.com/antvis/x6/commit/f510dc8d1aab453f1b0af10d3cd0c3a8e2ccb367))
* auto reference on terminal changed ([1c42d34](https://github.com/antvis/x6/commit/1c42d343670c06e03b4f2c904bd466ec3c5f9911))
* backwards compatibility ([297aef8](https://github.com/antvis/x6/commit/297aef80a478fc58b5fd8c54ce7e2099abe1e28e))
* bump rule ([c9559f2](https://github.com/antvis/x6/commit/c9559f2f30790857ff066be7d0ce99ed8933e20c))
* camelCase attr-name of marker ([995634e](https://github.com/antvis/x6/commit/995634e42ead8280067c5ab68d2e38ce0d8cfb30))
* can disable track ([3f3a590](https://github.com/antvis/x6/commit/3f3a59046a49629b33b1f98fe5d8be02a6a00c02))
* cell's id are diff on cell's prop and cell's data ([1d9f91d](https://github.com/antvis/x6/commit/1d9f91da54209a9c2a6ec45af602c0277bb0e0d1)), closes [#178](https://github.com/antvis/x6/issues/178)
* center, fit the viewport ([7f15331](https://github.com/antvis/x6/commit/7f1533151ab4eb68d77eea860e34804235211d95))
* change $ to JQuery ([c7a41cf](https://github.com/antvis/x6/commit/c7a41cff48214c7c793a746d1c1611656e8e6665))
* change css selector foreignobject to foreignObject ([#664](https://github.com/antvis/x6/issues/664)) ([c7e56b4](https://github.com/antvis/x6/commit/c7e56b4080e50596b04c77b7bdb5865b910c5682))
* change node:resize and node:rotate event trigger times ([#505](https://github.com/antvis/x6/issues/505)) ([b1f6f20](https://github.com/antvis/x6/commit/b1f6f202a0b5f4e27d9ea19b332f067009dac5fc))
* change x6-svg-to-shape router ([3dbe306](https://github.com/antvis/x6/commit/3dbe306bd842082090c0ff4a7cbb070afe2d3178))
* circle deps ([f0b3314](https://github.com/antvis/x6/commit/f0b3314955a509bc7199f5eeb7e7270b6e22d4d3))
* circular dependencies ([53d4fd7](https://github.com/antvis/x6/commit/53d4fd7b12c9ee5598614834c61ea2e5d17be2eb))
* comment the copy style code first ([3b5abff](https://github.com/antvis/x6/commit/3b5abff3c25ba27ae64377ab607fd8dbbb521e8c))
* commit message E2BIG ([a2c5f9e](https://github.com/antvis/x6/commit/a2c5f9e943ccf1d7ae478af30cb5022dd72e2e99))
* common options for port-label-layout ([0bbe06f](https://github.com/antvis/x6/commit/0bbe06fc45a07c0cab2df24a30a1df67d67a0e56))
* container size should be specified when infinite ([2d705bc](https://github.com/antvis/x6/commit/2d705bc346582aa4992407d25e7e524647295189)), closes [#53](https://github.com/antvis/x6/issues/53)
* deal with alerts on lgtm.com ([cd6556e](https://github.com/antvis/x6/commit/cd6556ef8ad66eb9fa37b3819e9a1c929f613b1d))
* delete console.log, add no-console config ([#642](https://github.com/antvis/x6/issues/642)) ([ce45c09](https://github.com/antvis/x6/commit/ce45c0922c06284d8c0c7484360d544d2110e6d6))
* deps version ([2aff4b4](https://github.com/antvis/x6/commit/2aff4b4cd0c23660066a43e182524d4515948b0a))
* deserialize cells in localstorage on clipboard initialize ([a485699](https://github.com/antvis/x6/commit/a485699057341a2844a79714fb42541698fd8f9e))
* deserialize cells in localstorage on clipboard initialize ([c957f4c](https://github.com/antvis/x6/commit/c957f4c60c71672ceabc8527eb737ed7ee40523d))
* do not set tabindex attr when keyboard is disabled ([613d25f](https://github.com/antvis/x6/commit/613d25f8a05e21f8b8ffb9a14a18ef3845f618a4))
* edge lost reference when update graph with the exported same json ([df5a605](https://github.com/antvis/x6/commit/df5a6053e9aa9fb4192f7a09a3c0ac54326239f0)), closes [#187](https://github.com/antvis/x6/issues/187)
* ensure cell's type when defined it ([a2cf40f](https://github.com/antvis/x6/commit/a2cf40f939bab349a80482b43e30a6b3aec49752))
* export layout methods ([1ab393a](https://github.com/antvis/x6/commit/1ab393a4d878730e45979f6f3896635442f88c50))
* export polyline ([de22cf4](https://github.com/antvis/x6/commit/de22cf47bbf4861674483e61556a6a8dafaeb4c7))
* export polyline ([b364c56](https://github.com/antvis/x6/commit/b364c56ab6a17cd1942342eaa8fdabca2bd084fa))
* export some protect methods ([4ff5dfd](https://github.com/antvis/x6/commit/4ff5dfd3554a9b7baaa08d7b51a7d2e0beeae7f2)), closes [#6](https://github.com/antvis/x6/issues/6)
* fix can not connect to node in(child) an html-connectable-node ([1f44134](https://github.com/antvis/x6/commit/1f441346ebd48d29da6f7689dda7effec0677c48))
* fix canot get graph ([#573](https://github.com/antvis/x6/issues/573)) ([94fd028](https://github.com/antvis/x6/commit/94fd02856966f53a94e1ab27f31d16affcb17008))
* fix cursor error ([7fceb46](https://github.com/antvis/x6/commit/7fceb469b6740841e782252a0c869b5c0f34ad88))
* fix edge preview arrow style ([343b398](https://github.com/antvis/x6/commit/343b398ce65101ed889a2fef7e2c3e6f725b48d5))
* fix getBBox function,now support get HTMLElement ([895c02e](https://github.com/antvis/x6/commit/895c02ea20bed9cafa53e40dcfd9a0cf644b805f))
* fix html node not update when setData ([095a37a](https://github.com/antvis/x6/commit/095a37adcc996af4d62e156796771b26afb0a8c7))
* fix keyboard event not trigger ([cfd90a2](https://github.com/antvis/x6/commit/cfd90a287ac76d8e0eb88c6929af7accd39309da))
* fix mousemove event fires on first mousedown ([68edc74](https://github.com/antvis/x6/commit/68edc74d7cd5be2681156e6a20313d2e17a85c11))
* fix move event trigger error ([#643](https://github.com/antvis/x6/issues/643)) ([6bbed08](https://github.com/antvis/x6/commit/6bbed083ced9d4b840e067b82a2b19f058130c3f))
* fix size invalid on image node ([#397](https://github.com/antvis/x6/issues/397)) ([438e192](https://github.com/antvis/x6/commit/438e192585095e3e17e4fe5c1360d1deeb81e488))
* fix spelling error ([f95cc2c](https://github.com/antvis/x6/commit/f95cc2c2c88cb213e92c2b989f62c945ff419cc8))
* fix trigger multiple moved event when close movable config ([3eb9d69](https://github.com/antvis/x6/commit/3eb9d6934efc5d73f7dd830d169a166ccb7bd9ac))
* fix typo in model ([#1720](https://github.com/antvis/x6/issues/1720)) ([4119a1e](https://github.com/antvis/x6/commit/4119a1e62420e765dedac55311ca80d9c5c4441b))
* fix z-index bug when use size-sensor ([a072c03](https://github.com/antvis/x6/commit/a072c0307f74ecedc1d3991b7c14c85ba8e2195e))
* fix z-index of container when infinite ([ea0f3be](https://github.com/antvis/x6/commit/ea0f3be2b647b9939f13e3396ec7fb9feb6e0127))
* flip option of async marker ([01749b6](https://github.com/antvis/x6/commit/01749b6ec0bc5c6edad927fa202d668ac8ecd024))
* get registry first in html component ([33cbfc4](https://github.com/antvis/x6/commit/33cbfc44119f5dfcf43a0077f2f11ca5b1401a21))
* graph examples ([23fb270](https://github.com/antvis/x6/commit/23fb27093f3870afaf500e960a53c1485ccca729))
* handle async result of validateEdge ([047dff7](https://github.com/antvis/x6/commit/047dff718a74b28519fdb03269410663434c1682))
* handle warnings from lgtm.com ([93ff9cd](https://github.com/antvis/x6/commit/93ff9cd431e533dc65edc9af009b73557e9ad8ed))
* handle warnings of lgtm.com ([22c054f](https://github.com/antvis/x6/commit/22c054f185a2875059a11dbb204b6b4952593fc5))
* highlighting ([9996342](https://github.com/antvis/x6/commit/99963423edec11cd63ddd2e25784301daea292f7))
* inherit native class ([d753ee5](https://github.com/antvis/x6/commit/d753ee54a7d5c23ea6b4d8d52e563b10fca66b4f))
* interp definition ([f43254c](https://github.com/antvis/x6/commit/f43254c7149e93716254b5002482d874abe68cd8))
* is clipboard empty ([fb4c575](https://github.com/antvis/x6/commit/fb4c575699307c7dd9bbb461897662b2d6f5570a))
* live preview connection ([157e0a8](https://github.com/antvis/x6/commit/157e0a8b200a6502d46f2cb18c6bf1a620f4d752))
* marker offset ([ed0fd14](https://github.com/antvis/x6/commit/ed0fd1437170d8688cbbffc3d9e5244efad1fa54)), closes [#184](https://github.com/antvis/x6/issues/184)
* **minimap:** only render facade for minimap ([aa65629](https://github.com/antvis/x6/commit/aa65629df6e13e05d121861c7b56256be840054a))
* missing edge arg on "edge:connected" and "edge:disconnected" event ([59eb988](https://github.com/antvis/x6/commit/59eb988b7b6ada899f8864ed6d5c88b3f93a1f99)), closes [#183](https://github.com/antvis/x6/issues/183)
* native class detection failed ([75ef6f5](https://github.com/antvis/x6/commit/75ef6f58347ead07a7b457d164d77fd40159dcb1))
* node input cannot get focus when keyboard options.global is enabled ([#1754](https://github.com/antvis/x6/issues/1754)) ([61b26b7](https://github.com/antvis/x6/commit/61b26b70688164de1a794029cd877f6ecdc98fb2)), closes [Close#1753](https://github.com/Close/issues/1753)
* optimize the ModifierKey isMatch method ([78cef3f](https://github.com/antvis/x6/commit/78cef3f632ef7b2b1eb2ad4483c71bcf8d6aeac3))
* port angle ([8f117fc](https://github.com/antvis/x6/commit/8f117fcb7341850fd4c0af89099218978b013595))
* ports options ([e164f4d](https://github.com/antvis/x6/commit/e164f4dd526496eacb349a55d3ec9d131f14932b))
* properties from `applyMixins` should be inited in constructor ([5fe6665](https://github.com/antvis/x6/commit/5fe6665b8abbc1a169f199b81c28919dab65b8fd))
* refresh with no arg means refreshing the whole graph ([034ccf2](https://github.com/antvis/x6/commit/034ccf2eb2206a56ef3fcab7ffc35fc5dfffa9b6))
* registry context ([b44d699](https://github.com/antvis/x6/commit/b44d6994f6ad644185f70e5c691f909eea0ace72))
* remove background-color for grid ([5ae2667](https://github.com/antvis/x6/commit/5ae26677aae8ec392130c125c20f4624b11b4b46)), closes [#6](https://github.com/antvis/x6/issues/6)
* remove base init method ([7baa405](https://github.com/antvis/x6/commit/7baa40591669d4583effc5c6d571984d605f5794))
* remove scrollToCenter ([9888833](https://github.com/antvis/x6/commit/9888833708dd6db1cb08f7830ce8ed5c46862718))
* remove unsed variables ([b2a91fb](https://github.com/antvis/x6/commit/b2a91fb2ce37f2ccd263441fe665380755e5880c))
* remove unused labelPadding style ([8d08ba9](https://github.com/antvis/x6/commit/8d08ba9b24d033d423d581a9cb3526d5da1350a4)), closes [#36](https://github.com/antvis/x6/issues/36)
* render react component ([ad1fa2f](https://github.com/antvis/x6/commit/ad1fa2f0a4d00ee073b14e9f021fa880be6a4124))
* return an zero rectangle when polyline is empty ([66be740](https://github.com/antvis/x6/commit/66be740da4078b440a4d43f035c7da4caeaff1ab))
* return an zero rectangle when polyline is empty ([d4e739c](https://github.com/antvis/x6/commit/d4e739c04874fed3d1fb431487df9ed4c29cf9fa))
* return the right drop target ([33646d0](https://github.com/antvis/x6/commit/33646d00b94726d38bd2748d04db0ef2ec6dd90e))
* sanitize HTML ([0f5e0bb](https://github.com/antvis/x6/commit/0f5e0bbf6844224844a215ee6a87da2665dec2c7))
* segments & vertices tool add onChanged callback ([#1348](https://github.com/antvis/x6/issues/1348)) ([a70a6c9](https://github.com/antvis/x6/commit/a70a6c9a74e50aab899ce31cc092431d0496f64f))
* selection work only for cells ([6c80efe](https://github.com/antvis/x6/commit/6c80efea2c4a771edaf6189fec61fcfc4743ab0a))
* should convert delete to del for mousetrap ([8951b0a](https://github.com/antvis/x6/commit/8951b0a3b202d935c801677c2928c9d8122c96b7))
* should pre-process defaults and metadata separately ([233e958](https://github.com/antvis/x6/commit/233e958293ae91f5f7f44ce19978d82deae4c931))
* should remove attribute when attr-value is nil ([5da0e77](https://github.com/antvis/x6/commit/5da0e77aebab6b1b97c47f1743ef4e1b451dba21))
* should remove attribute when attr-value is nil ([c3cb92d](https://github.com/antvis/x6/commit/c3cb92ddea1e2ee567577d786a58e15c4c02a033))
* should restrict elemenent within node container when use `html()` ([59a39b6](https://github.com/antvis/x6/commit/59a39b6d2bab5edfcdba3441d35799c9812501b1))
* should return `this` ([69036e4](https://github.com/antvis/x6/commit/69036e4516975511b4405fc68105772254dbbed0))
* should use id in json data as cell's id ([24d4cfb](https://github.com/antvis/x6/commit/24d4cfb150f1fa2d6ace26e5b0197df6c950177f))
* snapline work with scroller ([fb159b6](https://github.com/antvis/x6/commit/fb159b6e257f4e0de5574d4a1cb296cebec7a6f8))
* support backgroundColor of grid or graph ([300cc7d](https://github.com/antvis/x6/commit/300cc7d5701cc8689898d7ff03960f9312a88873))
* test case for deepCopy ([0462a46](https://github.com/antvis/x6/commit/0462a46b854b9115da554033b1ddfef889feef44))
* test case for deepCopy ([88e0a7b](https://github.com/antvis/x6/commit/88e0a7b89004bb3dc395bdf41c16f31c6bc96d7d))
* test for matrix ([aa3b3cf](https://github.com/antvis/x6/commit/aa3b3cfa825f5d2cd0362ed521db66219c21bcce))
* the size of html shape without border ([a1073e5](https://github.com/antvis/x6/commit/a1073e554a917b631d12b1669009163d4f734212))
* the size of padding when page invisible ([337f15a](https://github.com/antvis/x6/commit/337f15af429c64eca1aa338f0c081bfe5d2459d8))
* the static creation methods ([98d756d](https://github.com/antvis/x6/commit/98d756de0db381ec6abf676e5b822a59d3b049c6))
* the static creation methods ([5ca96d8](https://github.com/antvis/x6/commit/5ca96d888176d5e67b9720483dfd98f4ac57ffed))
* toJSON should ignore default props ([ec04fa4](https://github.com/antvis/x6/commit/ec04fa4d8113700733bb111be80cb132e3c97143))
* type => tagName ([2a65714](https://github.com/antvis/x6/commit/2a65714e970d657501611987aacb32c8202f4f12))
* type => tagName ([ff31d53](https://github.com/antvis/x6/commit/ff31d538a6f55e3215fa895d34669476d71e5082))
* type define of createSegment ([e43f082](https://github.com/antvis/x6/commit/e43f08219901287059b08c7bfe6171b11fb7098e))
* type define of createSegment ([3df2e93](https://github.com/antvis/x6/commit/3df2e93244c9ad47f4fc7095827b59a200b372bc))
* type errors ([6ee7c3c](https://github.com/antvis/x6/commit/6ee7c3c615da24412c3b671bfd1e9ef71e839d6a))
* type lost after mixin, instanceof failed ([aba8879](https://github.com/antvis/x6/commit/aba88799a305a5b8afc967fcf4a93f9ac9044bff))
* typos ([0720dcc](https://github.com/antvis/x6/commit/0720dcca81398c280bf91a1350ced786242e5c3a))
* unable to pan when page is invisible ([a7995ae](https://github.com/antvis/x6/commit/a7995aeb2b62ef77f554aaafca4410c19cd2e8e7))
* update dependencies and fix type errors ([#1103](https://github.com/antvis/x6/issues/1103)) ([49d4371](https://github.com/antvis/x6/commit/49d43716ada672e609e4e6d9c6fdca3f494b6f68))
* update examples ([f80942a](https://github.com/antvis/x6/commit/f80942ae3d7c54775d39f866e308e5e4e15e887a))
* update pagebreak by methods on graph ([30bdb90](https://github.com/antvis/x6/commit/30bdb90acfd5958a1a3b81beae3d9b00dd305a24)), closes [#13](https://github.com/antvis/x6/issues/13)
* update selection box when cell:changed ([#517](https://github.com/antvis/x6/issues/517)) ([83e9d98](https://github.com/antvis/x6/commit/83e9d983798c759cd1c1ae76f355cd2b7e7867f0))
* v ([b16afef](https://github.com/antvis/x6/commit/b16afefc69cd3fdddf0fb166db0ded5de5a4a670))
* v ([7afb840](https://github.com/antvis/x6/commit/7afb84071064fadb14acc3559b13656e4485a703))
* warnings on lgtm.com ([cb859d3](https://github.com/antvis/x6/commit/cb859d3949c0385afdf8302dd3d0491b11ac9adc))
* warnings on lgtm.com ([5c67668](https://github.com/antvis/x6/commit/5c67668c456e6042daf4250e24846c0076064748))
* wranings on lgtm.com ([d0747e6](https://github.com/antvis/x6/commit/d0747e667eca3c643c63dad10ca19702100628e1))
* wranings on lgtm.com ([3f179f4](https://github.com/antvis/x6/commit/3f179f467d6169b592ae82a0f6db7c27b7b5d55e))
* x6 support ie 11 ([#585](https://github.com/antvis/x6/issues/585)) ([5df9aaa](https://github.com/antvis/x6/commit/5df9aaaa88f943402d18fed6b7e5ae0abd5ed9b9))
* xx:added event triggered twice ([161793a](https://github.com/antvis/x6/commit/161793add517e36fa7aa283fc801fc0afb97ead7))
* 先触发selectionchanged, 再做数据交互用于redo/undo ([8f187ca](https://github.com/antvis/x6/commit/8f187caab2583ab71a8ade3e1254973f2600c375))


### chore

* release beta ([b5f3cfa](https://github.com/antvis/x6/commit/b5f3cfa2042f5196a995a38a8f41f140cabdce57))


### Features

* `inherit` support Node class ([66ee95a](https://github.com/antvis/x6/commit/66ee95a89fef1b378ba717dcadce2a4e983d40ef))
* ✨  allow disable auto resize in some high performance scenario ([9bfa702](https://github.com/antvis/x6/commit/9bfa7025c05b29c0774a499d88961a9cf4394dda))
* ✨ add 'loop' and 'loose' option for connecting ([cd8e997](https://github.com/antvis/x6/commit/cd8e997619603445998d6fb68d70120729d87c51)), closes [#390](https://github.com/antvis/x6/issues/390)
* ✨ add `animate` and `animateTransform` ([8197bef](https://github.com/antvis/x6/commit/8197beff2dd3d0757f74af474cc97109562a22ea))
* ✨ add `arcTo`, `quadTo`, `drawPoints` methods for path ([4ef46d2](https://github.com/antvis/x6/commit/4ef46d2dd59b2b249822dea2bf1513e1be0cf158))
* ✨ add `position` hook for knobs ([64d3685](https://github.com/antvis/x6/commit/64d36857db56b64c5b2c48e3e9fe208e55700b97))
* ✨ add `rotate` method for geoemtrys ([fbe2bbb](https://github.com/antvis/x6/commit/fbe2bbb8d2a3f40cc71086b0d2375dbbb137bb4f))
* ✨ add allowReverse option for resizing ([d5e43d6](https://github.com/antvis/x6/commit/d5e43d60207554f60e6f4e87f3749ae3816b6093))
* ✨ add autoResize feature ([5aeae97](https://github.com/antvis/x6/commit/5aeae976cd7638b2b5c05bc12bc56b562366fe5f))
* ✨ add batch for selection ([#1399](https://github.com/antvis/x6/issues/1399)) ([a015711](https://github.com/antvis/x6/commit/a01571170cdfc1a918ffcc2f3bf452e849e2ab58))
* ✨ add cell-editor tool ([#1202](https://github.com/antvis/x6/issues/1202)) ([98e80d1](https://github.com/antvis/x6/commit/98e80d10c9bfbd0c8486944dd212db2db731a225))
* ✨ add clipboard plugin ([8107f6d](https://github.com/antvis/x6/commit/8107f6df5de52a33e1b8094a44d59ee7fd2a8042))
* ✨ add containerParent config for dnd ([fc6498f](https://github.com/antvis/x6/commit/fc6498f6e2d52d05eab6790851c3437c6c28ee2b))
* ✨ add direction option for midside node-anchor ([ee62cc0](https://github.com/antvis/x6/commit/ee62cc07ba706037e0a10e08d5440472e1ce97c9))
* ✨ add dnd plugin ([269fae9](https://github.com/antvis/x6/commit/269fae9e5eeb969c6a7884373aa3a32002c064e6))
* ✨ add dom snapshoot method ([79796cd](https://github.com/antvis/x6/commit/79796cd87e9eb13ba594bd8123fe6365a08f088a))
* ✨ add excludeHiddenNodes for manhattan router ([#1400](https://github.com/antvis/x6/issues/1400)) ([28a472a](https://github.com/antvis/x6/commit/28a472ab8e3097ffd12be0fb8909c084156e5afd))
* ✨ add html shape ([8d75504](https://github.com/antvis/x6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ add insertPort api ([#1763](https://github.com/antvis/x6/issues/1763)) ([6809dba](https://github.com/antvis/x6/commit/6809dba2d86308d0b315d0c6164f91d80e8a40ff))
* ✨ add loop line ([8326e1c](https://github.com/antvis/x6/commit/8326e1ca90edc5d19c5122581d7ea4b4b7986789)), closes [#392](https://github.com/antvis/x6/issues/392)
* ✨ add minimap plugin ([6cdecbb](https://github.com/antvis/x6/commit/6cdecbbba9a4db1f67189e23fb89f2a7ba2af99e))
* ✨ add minScale and maxScale options for mousewheel ([e474ac3](https://github.com/antvis/x6/commit/e474ac3c6a7c224ab5e9a9039c7b419f91554891)), closes [#283](https://github.com/antvis/x6/issues/283) [#283](https://github.com/antvis/x6/issues/283)
* ✨ add resizeGroup for stencil ([#1388](https://github.com/antvis/x6/issues/1388)) ([d9bec60](https://github.com/antvis/x6/commit/d9bec60ce3819f45151ac8d1336e2ae94842d3d4))
* ✨ add rubberNode and rubberEdge config ([#949](https://github.com/antvis/x6/issues/949)) ([a2f6fb3](https://github.com/antvis/x6/commit/a2f6fb38d03ecac123f006ed33b3f71da7952355))
* ✨ add selection plugin ([#2742](https://github.com/antvis/x6/issues/2742)) ([50a5dc7](https://github.com/antvis/x6/commit/50a5dc7cd8c2e39a1f8bf8359a0eb189dda8cb86))
* ✨ add snapline plugin ([294672b](https://github.com/antvis/x6/commit/294672b3066b15ab834ce2a3172facc49004c950))
* ✨ add some connecting option ([fb25aa5](https://github.com/antvis/x6/commit/fb25aa500d1554c15e9ade501523a5bbc07984ed))
* ✨ add some missing api ([1dcb3d9](https://github.com/antvis/x6/commit/1dcb3d92fd83e5dfd1a1af9670d539a99dd9f55a))
* ✨ add some ui events ([7781435](https://github.com/antvis/x6/commit/77814353097a96cc444d347f26309ce6ae8e7453)), closes [#275](https://github.com/antvis/x6/issues/275) [#273](https://github.com/antvis/x6/issues/273)
* ✨ add tool manage api on cell ([ebaee93](https://github.com/antvis/x6/commit/ebaee93eb294cacba4c82b55dfa34d90619677bf))
* ✨ add util to detect element size change ([9902202](https://github.com/antvis/x6/commit/99022021ccb351113c2b9009a62c0240d324f66d))
* ✨ add xxx classname to node when widget visible ([aa3dd12](https://github.com/antvis/x6/commit/aa3dd120a5457f189c0f09dad87d96c70b908abd)), closes [#279](https://github.com/antvis/x6/issues/279)
* ✨ add zoomTo api ([c8241ef](https://github.com/antvis/x6/commit/c8241ef7740cff2d2bb4eef701db5b372badc051))
* ✨ auto resize graph when container resized ([9c7bc9a](https://github.com/antvis/x6/commit/9c7bc9a4bb210451283663cd99a29bd6c79e2ec4)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ call and apply with explicit types ([d2f3431](https://github.com/antvis/x6/commit/d2f34310cb05724e12d3c5bc67fddde727818b8f))
* ✨ checks if the specified event is supported by the browser ([39be5be](https://github.com/antvis/x6/commit/39be5be8440c694c326cd85accf11d6acc3e0ff6))
* ✨ color utils ([4d0ff36](https://github.com/antvis/x6/commit/4d0ff3602fedcb0ef311081b3c095d4c876514cf))
* ✨ convert client/rectangle point to graph point/rectangle ([b285e96](https://github.com/antvis/x6/commit/b285e9644d1c5a9b8e671121835053f5328d689f))
* ✨ distance can be a function ([b0b251c](https://github.com/antvis/x6/commit/b0b251cecf73fa11cccf8383290eacbe0764aef2))
* ✨ draw background on scroller when scroller's backgound is null ([da9aaf4](https://github.com/antvis/x6/commit/da9aaf47574e245b4b06856496a7da165cfc3eb9))
* ✨ enhance scroller performance by avoid scoller reflow caused by changing classList ([#909](https://github.com/antvis/x6/issues/909)) ([dda19d0](https://github.com/antvis/x6/commit/dda19d0256656286f1694a00ad649d7b99c60a95))
* ✨ export common and geometry in x6 package ([#2820](https://github.com/antvis/x6/issues/2820)) ([df28200](https://github.com/antvis/x6/commit/df282000cc5e17521147c77c210e172c444c9938))
* ✨ get predecessors/successors by distance ([d18fde3](https://github.com/antvis/x6/commit/d18fde3746dd82f28b335bfa050201b76c5a31ae))
* ✨ group demo ([0d21b3a](https://github.com/antvis/x6/commit/0d21b3a1465a3fc4fdcffd80857a57d52f068b81))
* ✨ improve auto-resize feature ([40d5335](https://github.com/antvis/x6/commit/40d53355cedc0bbbeb1e26948b67254dc6a40d85))
* ✨ merge cell data by default when call `setData` ([0698d94](https://github.com/antvis/x6/commit/0698d94b1c6558aba1f6236913681be5283fc95a))
* ✨ node and edge selection ([0622b0e](https://github.com/antvis/x6/commit/0622b0e17dcff22c33126e6551fe49e853a9f98f))
* ✨ node/edge move events ([67efad9](https://github.com/antvis/x6/commit/67efad9f9dac1657c0f04de15ca80c8fd50d395e))
* ✨ optimize selection event handle ([#1115](https://github.com/antvis/x6/issues/1115)) ([04edb73](https://github.com/antvis/x6/commit/04edb734e57b035e2aee9c60fdfc74d38812288b))
* ✨ option for deep/shallow merge data and attrs ([47d133f](https://github.com/antvis/x6/commit/47d133fb25ac549a5cc04fb817f1b465211960b3))
* ✨ option of selecting cell on cell moved ([c68ffed](https://github.com/antvis/x6/commit/c68ffed8370029c2e2ce19a7d59a233ae6ffca8a))
* ✨ option of selecting cell on cell moved ([7c39f81](https://github.com/antvis/x6/commit/7c39f81603f7f767941bb3859dfa5e8621b91821))
* ✨ panning support rightMouseDown and mousehwheel ([728977c](https://github.com/antvis/x6/commit/728977c5843a9868736e7f2f3b9d0d77e8837d3c))
* ✨ parse markup from xml string ([6ccdf65](https://github.com/antvis/x6/commit/6ccdf65061ceed0e346917294ceefd2efa3c92aa))
* ✨ passive event ([74fbaf5](https://github.com/antvis/x6/commit/74fbaf5eca8d7fc654b50f88e484e555784ba5fd))
* ✨ postpone keyboard target focusing to improve dragging performance ([356c7b6](https://github.com/antvis/x6/commit/356c7b6971db6278de5c43788461b701a7a0a36d))
* ✨ remove node/edge api ([732bcf3](https://github.com/antvis/x6/commit/732bcf35b9f1d6eff876c7ac787be03921c0a8a9))
* ✨ render html/react label ([f4e6c09](https://github.com/antvis/x6/commit/f4e6c096473dd3f2e93e8585503d0528f1b41f2a))
* ✨ resetCells clearCells api ([bc904cd](https://github.com/antvis/x6/commit/bc904cdd55ad1763f4e35c6bbdacda5af57065b1))
* ✨ revert a lint fix commit ([39d8e71](https://github.com/antvis/x6/commit/39d8e71ce0d8e2c8ac5d3e47eb84a6179bd1195e))
* ✨ select/unselect cell by id ([b9fdc87](https://github.com/antvis/x6/commit/b9fdc878faab1ebce44fa2b707162ffb7e7c041f))
* ✨ start panning when mousedown on no-interactive node/edge ([7435c32](https://github.com/antvis/x6/commit/7435c32076da25aa6f60d8efc9c5f2e28f371149))
* ✨ string endpoint/connectionPoint ([ea9f1e8](https://github.com/antvis/x6/commit/ea9f1e87d4bc45b6f39786256828244bf47c1670))
* ✨ support html tool ([1a7de2d](https://github.com/antvis/x6/commit/1a7de2d752d296c81d1dd3c24aa6355d2daf8ea9))
* ✨ support minimap in normal graph ([f42160f](https://github.com/antvis/x6/commit/f42160f8259ca7cf290fe8a431a5fe1900b729a8))
* ✨ support moving when selection box is disabled ([eacd3d0](https://github.com/antvis/x6/commit/eacd3d0aa2228308228a2bb81d23c9872d1a4261))
* ✨ support panning scroller graph byrightmousedown ([6ffdb50](https://github.com/antvis/x6/commit/6ffdb5004401b30ff5852a08de9286a934780be3))
* ✨ sync modify options when draw grid ([b7d48f0](https://github.com/antvis/x6/commit/b7d48f015802bc88526415d09c44d3ef0d46f7ae))
* ✨ throw error when the container is not specified or invalid ([702a12f](https://github.com/antvis/x6/commit/702a12fe17e33142eaa3f747b6e50961bc40eeae))
* ✨ ui event for final status ([9feaafb](https://github.com/antvis/x6/commit/9feaafbff6d10ea34186959591de0bda11416c66))
* ✨ update x6 and x6-vector version ([#1659](https://github.com/antvis/x6/issues/1659)) ([a199b59](https://github.com/antvis/x6/commit/a199b590d5f108b51162e276b432fbb3737d2c14))
* ✨ use robot token ([5904d8c](https://github.com/antvis/x6/commit/5904d8c23bab4bc8e4ddada7b84fb21bfb323e04))
* ✨ validate edge on connecting ([7291dbc](https://github.com/antvis/x6/commit/7291dbc48ed0b84e2ff4c057f97664a9d0dd2573))
* ✨ 支持调节手柄,如圆柱,通过调节手柄修改圆柱椭圆面的大小 ([8f24a62](https://github.com/antvis/x6/commit/8f24a6216f9bb2967c648be12238a96215dd2f4b))
* 🎸 为定义业务数据的 data 属性提供类型定义 ([#1278](https://github.com/antvis/x6/issues/1278)) ([f1b4acf](https://github.com/antvis/x6/commit/f1b4acf3ee4745fdae62eca6cb0dc9e89e60a194))
* 🐛　support click on the non-text area without adding a new label ([#1894](https://github.com/antvis/x6/issues/1894)) ([4ae1b9e](https://github.com/antvis/x6/commit/4ae1b9ef4f43b9c9f96796c5c5fa31f968b82bdf))
* accessor for mousewheel ([4537463](https://github.com/antvis/x6/commit/4537463e12d6a20e7f221c15b62dfe7c72288064)), closes [#16](https://github.com/antvis/x6/issues/16) [#41](https://github.com/antvis/x6/issues/41)
* accessor for rubberband ([eea4f5b](https://github.com/antvis/x6/commit/eea4f5badfbd172f093ec1b3f9badf4a3d9b3012)), closes [#16](https://github.com/antvis/x6/issues/16) [#41](https://github.com/antvis/x6/issues/41)
* accessor for speed up use methdos on model, view, render, etc ([e028644](https://github.com/antvis/x6/commit/e028644273e01341871f4aec9f1f011139ba2f6b))
* accessor for tooltip ([fcead60](https://github.com/antvis/x6/commit/fcead60d8c4b4b80c16e9b1d1e13c76060d668c9)), closes [#16](https://github.com/antvis/x6/issues/16) [#41](https://github.com/antvis/x6/issues/41)
* add `init` method ([8daefe1](https://github.com/antvis/x6/commit/8daefe136ad9b67586f41d5d2759ba9893ad9e41))
* add applyMixins util ([f560a5d](https://github.com/antvis/x6/commit/f560a5d486ed59ea500ad466f5a9ecbe2297b849))
* add default key formator for shortcut ([86af678](https://github.com/antvis/x6/commit/86af678032b4af019b881b5f0c98c9038dd8e8ec))
* add demo for tranform method ([2a585f4](https://github.com/antvis/x6/commit/2a585f4fde4044f0aa9d6f720bcc996c69401471))
* add direction for smooth connector ([00f8310](https://github.com/antvis/x6/commit/00f8310f476a96c01811c90cd7b4219e5e22310c))
* add ensureValue ([97eb2d1](https://github.com/antvis/x6/commit/97eb2d1e3171bad771cab788b175743b9364f0c4))
* add following config for selection ([#687](https://github.com/antvis/x6/issues/687)) ([4de6701](https://github.com/antvis/x6/commit/4de6701c0b29f8e71293403b5b813bb64a27f3a5))
* add get set method of cell data ([794e1fc](https://github.com/antvis/x6/commit/794e1fcb60531aa33d7b4147e6bfdac48f2cd82c))
* add induction area option for Anchor ([5f0783e](https://github.com/antvis/x6/commit/5f0783e41aa7872f52ea498e478cdd9579348e64))
* add option for force redraw on data changed ([6bc927f](https://github.com/antvis/x6/commit/6bc927fd72b915808cb78135d51fd1d1db6e3cc7))
* add static method `Image.fromSvg` parsing svg string to image ([ff81d92](https://github.com/antvis/x6/commit/ff81d923752f6df5f6bb59e15c2f261b9e8f7379)), closes [#34](https://github.com/antvis/x6/issues/34)
* add string template ([b3e1b1a](https://github.com/antvis/x6/commit/b3e1b1a4425d797365446ade50eaca99fd50c037))
* add vectorizer module ([65d5d9b](https://github.com/antvis/x6/commit/65d5d9b1f19df271cfee46df31f64d2299c15f29))
* add vectorizer module ([45f8269](https://github.com/antvis/x6/commit/45f8269876fe0ee6885aed58d3dfa0d55bb6b8dc))
* add wheel accessor ([c6a0607](https://github.com/antvis/x6/commit/c6a060708da29146f1fb499b12df193ec3148755))
* add wheel handler for zoom graph ([e835338](https://github.com/antvis/x6/commit/e835338b9b8ca21693c688664d4fde82e8d7178a))
* add x6 namespace ([6c24d34](https://github.com/antvis/x6/commit/6c24d343986a5571796785c5bc89ef130f125bdd))
* add x6 namespace ([87ba363](https://github.com/antvis/x6/commit/87ba363c7e477578d4933c5edccc43dafb45ae4c))
* **addon:** export addons ([6ed1b10](https://github.com/antvis/x6/commit/6ed1b107069f2d3d4a91347919c31b7efcc2b167))
* adjust event source and package deps ([#2826](https://github.com/antvis/x6/issues/2826)) ([a1bdb18](https://github.com/antvis/x6/commit/a1bdb18b1d1e1967e8e27862fed2e4fe8787a8cb))
* anchor for edge ([e4448ed](https://github.com/antvis/x6/commit/e4448edc23f3fd5d06d0ed706012025ba4dd03d4))
* anchor registry ([0f11317](https://github.com/antvis/x6/commit/0f1131710bd879295432b3c4c330362094d770bd))
* **anchor:** auto adsorb ([16bcfd2](https://github.com/antvis/x6/commit/16bcfd225e41ff6652b5c542f2f1bc4eb2470a1a))
* **anchor:** simplify the creation of Anchor ([e703cfa](https://github.com/antvis/x6/commit/e703cfa2b57f96648e5afd2b38d9c7d0256c3deb)), closes [#28](https://github.com/antvis/x6/issues/28)
* api of graph ([fef2cfd](https://github.com/antvis/x6/commit/fef2cfd28e6929bf5b62a14e3bd7d1424093df47))
* async utils ([4b2b97b](https://github.com/antvis/x6/commit/4b2b97b7520f2e14bb36701176bfe373ca3806f6))
* attrs for markers ([d376e8b](https://github.com/antvis/x6/commit/d376e8bc0a688ecf7297195a05020547d111576a))
* auto focus the container on creating a graph instance ([de3570e](https://github.com/antvis/x6/commit/de3570e13683681461fc2cb56e8452973812d595))
* base enums ([dba5f43](https://github.com/antvis/x6/commit/dba5f43c2729f49a80fe61a3eec929901a9c5139))
* basic shapes ([da33dba](https://github.com/antvis/x6/commit/da33dbadacb4b6179b08208eff9c3797b61a7cf6))
* basic shapes ([178ef35](https://github.com/antvis/x6/commit/178ef35ae5d14294c9a4a69e7f20f6968656a1ce))
* can specify null-able geometry when create cells ([809118f](https://github.com/antvis/x6/commit/809118f0d4e2929cde56939088bf79049e42dc1e))
* case convert methods ([849bfbd](https://github.com/antvis/x6/commit/849bfbd5b9cf5b626beb26f6f67c68e6f46ac3b5))
* cell ([da3721d](https://github.com/antvis/x6/commit/da3721dd248a430284f8606fd0572d5b483b044a))
* cell ([3db329f](https://github.com/antvis/x6/commit/3db329f3bbdb041edc55c0eefbd0b694315cd0cb))
* cell data ([f89bf83](https://github.com/antvis/x6/commit/f89bf83a5d11c1d7fedeb9f3b8df0a5fd563441b))
* cell id can be numbers ([4462ea4](https://github.com/antvis/x6/commit/4462ea462d720651b9bbb280c3bd103d969f4411))
* cell view hooks ([ec584ac](https://github.com/antvis/x6/commit/ec584acc7f68d13173d69901764e74c9f4d163eb))
* class inherit method ([662da0e](https://github.com/antvis/x6/commit/662da0e926106d2750348187214bac7d0f631b17))
* class inherit method ([cbbe54b](https://github.com/antvis/x6/commit/cbbe54bbbe656533ecb4bb42e9db1400c0136db7))
* className and options for node handler ([8c2f392](https://github.com/antvis/x6/commit/8c2f392ace22cd416406719f50e970d12b369a92)), closes [#16](https://github.com/antvis/x6/issues/16) [#41](https://github.com/antvis/x6/issues/41)
* className of edgeHandler ([d99b8ab](https://github.com/antvis/x6/commit/d99b8ab6fa0208b326f2a28e87f0937935411af1))
* classNames in connection handler ([ac23c5e](https://github.com/antvis/x6/commit/ac23c5ebca6f43ce0fb9adf49e098025b362e5ca))
* common entities ([6aae444](https://github.com/antvis/x6/commit/6aae444b85f49db56697ebc417b04462b495e3a9))
* compatible with zoom in graph and scroller ([c42235f](https://github.com/antvis/x6/commit/c42235f279874a617154e524a178bf489be14303))
* compatible with zoomFit centerContent ([e983a04](https://github.com/antvis/x6/commit/e983a042b0c2be027fb5fadcbcd6f0d2cfb4f6b0))
* compatible with zoomRect zoomTo centerPoint ([6b91019](https://github.com/antvis/x6/commit/6b9101970ff24e155f1c3249e3613f3acb3ca496))
* config shape before be rendered ([35c270d](https://github.com/antvis/x6/commit/35c270db6e33d707267b2053203b9c920b45350d))
* **connection:** can disable hotspot connectting on source node ([35dc003](https://github.com/antvis/x6/commit/35dc003b1f1b404a99e17c3a9af8eba97a45293d))
* **contextmenu:** accessor for contextmenu ([8460572](https://github.com/antvis/x6/commit/84605725119dcc6197afadad91308d8402ba1cf9)), closes [#16](https://github.com/antvis/x6/issues/16) [#41](https://github.com/antvis/x6/issues/41)
* control if edge can be connected ([ebeaadb](https://github.com/antvis/x6/commit/ebeaadbea55bf80771dc6a4e7017ec7768db7d0d))
* create anchor with native shapes ([af58546](https://github.com/antvis/x6/commit/af5854667036bf66da266957f5800f39345877b2)), closes [#39](https://github.com/antvis/x6/issues/39)
* create node with specified NodeView ([1d62d3d](https://github.com/antvis/x6/commit/1d62d3d4615eeb46da562f172e688f02968e7f9c))
* create node with specified NodeView ([6bf9d8f](https://github.com/antvis/x6/commit/6bf9d8f5dfd0c17a18b8491290ba355fb01873f2))
* create node with specified NodeView ([13f7158](https://github.com/antvis/x6/commit/13f7158a10dca53e2fbda31796a7f57a7d80650c))
* create node with specified NodeView ([1ea60c9](https://github.com/antvis/x6/commit/1ea60c9f0983532194a2ff2cc4ab9a7e654f739a))
* create node with specified NodeView ([ef841d8](https://github.com/antvis/x6/commit/ef841d89731778f7bb304648cd3175563388c18c))
* create rectangle from position and size ([8d3a1e4](https://github.com/antvis/x6/commit/8d3a1e476389ebcf9b1fb664cf112138e98d8e67))
* create rectangle from size object ([6d38b56](https://github.com/antvis/x6/commit/6d38b563ef10a4488f99a5e8e5bfb11750ba9ea6))
* debug basic shapes ([75d9d1b](https://github.com/antvis/x6/commit/75d9d1ba73085d5a4109c08f14c9fad4ee20f24f))
* detect container's rezie event and auto adjust viewport ([43f4939](https://github.com/antvis/x6/commit/43f493935a896357a8d35c0cd901211902b02a3a)), closes [#22](https://github.com/antvis/x6/issues/22)
* detect vendor prefix ([85cde4d](https://github.com/antvis/x6/commit/85cde4dc2eb1c48dcac204a1ebd4c45146ee8205))
* detect whether `passive` is supported ([15dc8da](https://github.com/antvis/x6/commit/15dc8daf57becdea039c814a4882fc4dcfd345c1))
* dnd and stencil ([8eb9877](https://github.com/antvis/x6/commit/8eb98770f96f8fb1f36990a8ee4a8fa285463587))
* **dnd:** move data into options ([1513ee1](https://github.com/antvis/x6/commit/1513ee199f81ae8028d9524d64938ac513326b66))
* dynamic update react node ([58539a4](https://github.com/antvis/x6/commit/58539a48ed461c717b8278d3088eb54608e2175f))
* edge label default not movable ([d5a180e](https://github.com/antvis/x6/commit/d5a180e12cd7bcb692adafb0871e0fc554b66fff))
* er router ([89227ad](https://github.com/antvis/x6/commit/89227ad942f8e17051a47996dcbd6643aef1e076))
* **events:** more readable event names ([4621381](https://github.com/antvis/x6/commit/46213815f0a0cc9374ba2d58fad4e0ef50caf886)), closes [#54](https://github.com/antvis/x6/issues/54)
* **events:** type infer for custom events ([8cc68d8](https://github.com/antvis/x6/commit/8cc68d868e8f0acbe05072d89d9fa983bfc0b26b))
* **events:** use more readable event names ([a8bf9aa](https://github.com/antvis/x6/commit/a8bf9aa6d8b19bd4e44042d55453b9c2330b0352)), closes [#54](https://github.com/antvis/x6/issues/54)
* export command ([79ab1e0](https://github.com/antvis/x6/commit/79ab1e009341d475e83a5bd862e09acea4d8cf49))
* export difference from lodash ([2e2190b](https://github.com/antvis/x6/commit/2e2190b432570af3d3f29d705c7ce3104a6331b3))
* export globals for global config ([ec2d1a0](https://github.com/antvis/x6/commit/ec2d1a049c69e3a65252a9009847838b2bd58a47))
* export graph to images, print preview ([67304ef](https://github.com/antvis/x6/commit/67304ef21b2b4e828320ae64bbf897f05e28a2cd))
* export json util ([485bea8](https://github.com/antvis/x6/commit/485bea8f40a8dc4f9de732dd0acf20c467195b1c))
* export json util ([633cfee](https://github.com/antvis/x6/commit/633cfee59d1c260d52bfdbbe4f51bc6f6f608f16))
* export registerMarker method ([bc01133](https://github.com/antvis/x6/commit/bc011331d1ba8413efea0e597dadfd682416762c))
* export segment ([f3f14a2](https://github.com/antvis/x6/commit/f3f14a264155aa480f194202afac89a43aee06c7))
* export some api from model ([5c48b66](https://github.com/antvis/x6/commit/5c48b6616003a1eb5fefd823f825f6ee394d4335))
* export some model and view events to graph ([31652b4](https://github.com/antvis/x6/commit/31652b494b7784526783e12182e9921f19e56d4d)), closes [#54](https://github.com/antvis/x6/issues/54)
* export some scroller methods ([d653b5e](https://github.com/antvis/x6/commit/d653b5e8d7d3c547587f8bbb19354f79628148b3))
* export SVGCanvas2D ([c8f0d84](https://github.com/antvis/x6/commit/c8f0d84d44c23f9a7c6ca7290910c0982fca63ac))
* find view ([425c6af](https://github.com/antvis/x6/commit/425c6af0f0e2e16710416c365426cc0dde249234))
* force layout ([f131cc4](https://github.com/antvis/x6/commit/f131cc4fa6b567a93e97907bcd13119b262e5765))
* generic type for cell data ([602c481](https://github.com/antvis/x6/commit/602c4810b8dd18764c57eb1ca4d934f86ecdfd49))
* geometry object extends it's data structure ([024fbc9](https://github.com/antvis/x6/commit/024fbc9568b8d88f5c2d4446739dc7fa45bee060))
* get html content from `style.html` or `graph.getHtml()` ([e3922f9](https://github.com/antvis/x6/commit/e3922f9822639c709ba2b86ad7ac5ececf655e95))
* **grid:** provide "line" and "dot" grid background ([b2f29dc](https://github.com/antvis/x6/commit/b2f29dc8cd1d939a11983e95aa38b5e52a2f048d)), closes [#6](https://github.com/antvis/x6/issues/6) [#6](https://github.com/antvis/x6/issues/6)
* **grid:** support grid background-color ([cee7071](https://github.com/antvis/x6/commit/cee7071e49acf301df588c1fb63fb25ad0aa317a)), closes [#6](https://github.com/antvis/x6/issues/6)
* group by ([69c0509](https://github.com/antvis/x6/commit/69c05094512c85dc4054b283157004c6bbee734d))
* growing along different width and height ([49155ed](https://github.com/antvis/x6/commit/49155ed177be86118852c342a2f13e1575a64179))
* **guide:** ensure className and accessor for guide ([42abf49](https://github.com/antvis/x6/commit/42abf49b43adc2baad625220f341089c03278b0a)), closes [#41](https://github.com/antvis/x6/issues/41)
* html shape ([ea9db6a](https://github.com/antvis/x6/commit/ea9db6a0a0f45bc9d7faccf3341b0e25e4f6d838))
* improve hasScrollbars performace ([c782a38](https://github.com/antvis/x6/commit/c782a3843a4c6d97cb52d7b2eaa53e34e705ac9f)), closes [antvis/x6#116](https://github.com/antvis/x6/issues/116)
* init attr ([2d1afd4](https://github.com/antvis/x6/commit/2d1afd4ee89eb572be35168bc966be03ac3f5bf4))
* init routers ([762633e](https://github.com/antvis/x6/commit/762633e5ba73c6c46485a5c250bbd9c715aa25ae))
* is anchor connectable ([777237a](https://github.com/antvis/x6/commit/777237adcba9581766015f9861d2afc8af983f04))
* is point like & is point data ([1d1e2f7](https://github.com/antvis/x6/commit/1d1e2f7af6d467bfab1070d3bc42ea27dc5de51c))
* isTooltipShowing ([e7ca23f](https://github.com/antvis/x6/commit/e7ca23fd2a736f96eebd05fba071a0810e780d81))
* json util ([010ce32](https://github.com/antvis/x6/commit/010ce3236db22cbe0d2940fdfb77a1a770a35ca6))
* json util ([47b267c](https://github.com/antvis/x6/commit/47b267c14e016bc7085e5e546094ace05bb08744))
* **label:** define label in style and do not extra label from data ([2496c68](https://github.com/antvis/x6/commit/2496c68bfc26c6942bd4c15790334333aacb9fc9)), closes [fix#31](https://github.com/fix/issues/31)
* layer api ([166a728](https://github.com/antvis/x6/commit/166a7283d46e2f0c6de03559a0a8eafe212cb184))
* links default unbendable ([4677863](https://github.com/antvis/x6/commit/4677863348f6e45d459de75c755b38ac155ffa2f))
* methods for getting cells from graph ([d1102a0](https://github.com/antvis/x6/commit/d1102a047c1441d92d665098f5b7ddd9c5de2b64))
* minimap addon ([f318e69](https://github.com/antvis/x6/commit/f318e69b6d62820e25a24cce76ba8d2d2b49dd24))
* **minimap:** custom cell style by cell itself ([88c8c44](https://github.com/antvis/x6/commit/88c8c44f410d2bbd21b95cdcc8160c90cbfdab78))
* **minimap:** the rendering fineness of minimap ([98c82e3](https://github.com/antvis/x6/commit/98c82e39f9e40b03f9804851ba54efac3778a02c)), closes [#7](https://github.com/antvis/x6/issues/7)
* more readable style names ([e4bf07b](https://github.com/antvis/x6/commit/e4bf07b6a753b26c998153bce0af9bc2c9cf9bf1))
* node port ([4b7b16a](https://github.com/antvis/x6/commit/4b7b16aace73a9dad06e270dc67b4e2d7cff12c9))
* nodes default unrotatable ([fe2de60](https://github.com/antvis/x6/commit/fe2de60cdc2117439b28f21462cff7e7befa8cbc))
* normalize marker from path data ([98fadc8](https://github.com/antvis/x6/commit/98fadc86b90256cb893a28b590e4c1e196da45c6))
* normalize percentage number ([36cab24](https://github.com/antvis/x6/commit/36cab242d4b859a3fd059f3a1042a1c0773df6e1))
* normalize sides ([b6eb7d6](https://github.com/antvis/x6/commit/b6eb7d63a468d379c71a6b88c4a1ab29d5d873ff))
* nullable type ([b3877e1](https://github.com/antvis/x6/commit/b3877e196dca0d4d04658e27dffe8b402d21e786))
* option of configing changable for edge terminal ([66fcd60](https://github.com/antvis/x6/commit/66fcd609e52a768f7502da5c11ecc90e68d4f838)), closes [#29](https://github.com/antvis/x6/issues/29)
* pick ([fc50ef8](https://github.com/antvis/x6/commit/fc50ef8c410fdc5da45502f43750cbc81320f708))
* planishing options of `createCell`, `addNode`, `addEdge` ([1fef232](https://github.com/antvis/x6/commit/1fef23224f026df53988ee1215eb5be9805399e2)), closes [#10](https://github.com/antvis/x6/issues/10)
* port ([5408a92](https://github.com/antvis/x6/commit/5408a925af5265ff6172730d4b2353c011479c5f))
* prop hooks ([4c47b8d](https://github.com/antvis/x6/commit/4c47b8d3d1daea3642046b9a2ce03d55a83bfbe6))
* register shape with auto generated class name ([b61a25a](https://github.com/antvis/x6/commit/b61a25a3cd34194125d54eaebc59e9083576d761))
* register shape with auto generated class name ([c84582c](https://github.com/antvis/x6/commit/c84582c25546acb200dcb9b4ccbd211778da366a))
* register shapes ([7438aac](https://github.com/antvis/x6/commit/7438aac69cb18bdd62372256df87a52cd218955f))
* registry of connector and router ([66d463d](https://github.com/antvis/x6/commit/66d463dfb9e90adfc3526834d5de03eb4427af1e))
* remove `noEdgeStyle` ([6592f66](https://github.com/antvis/x6/commit/6592f663dd4087056225c9feb2eefdf52aa18590))
* remove backgroundImage option for Graph ([293df17](https://github.com/antvis/x6/commit/293df17f5f620040f3be6ff80a0e7cfc04de9a25)), closes [#11](https://github.com/antvis/x6/issues/11)
* remove documentMode detection ([92ba091](https://github.com/antvis/x6/commit/92ba091968b57cf0f671645d1b80bce09efd1718))
* remove unnecessary type convertions ([8c36e66](https://github.com/antvis/x6/commit/8c36e66e1f9bb401fecadde3c29b0b43b9b70292)), closes [#16](https://github.com/antvis/x6/issues/16) [#41](https://github.com/antvis/x6/issues/41)
* render nodes and edges by data ([53bad0b](https://github.com/antvis/x6/commit/53bad0b665cef237c7503c0673ad1de61593d0a7)), closes [#49](https://github.com/antvis/x6/issues/49)
* render ports ([90bef83](https://github.com/antvis/x6/commit/90bef832ff01ffb9d403891f228696a3f7643d65))
* render preview edge on decorator pane ([b34ea62](https://github.com/antvis/x6/commit/b34ea62303702713821895ee9fc2f2c82ca04e14))
* requestAnimationFrame ([e3c1456](https://github.com/antvis/x6/commit/e3c1456c6266efac359e66b03562178dee242ccb))
* requestAnimationFrame ([e5b2b56](https://github.com/antvis/x6/commit/e5b2b56f1c81a7e04d5c850050aa6c076aca9ce1))
* research ([0325a0d](https://github.com/antvis/x6/commit/0325a0d9a9e65150bcd768a8f33fe45eadcedb52))
* research next generation view ([b7b997e](https://github.com/antvis/x6/commit/b7b997e2dd1ecb9501e5642ec6df2f75d309b386))
* return value of batch update ([19da712](https://github.com/antvis/x6/commit/19da7121319967c408805519028ad747aff1e99b))
* sanitize markup ([d0e7b41](https://github.com/antvis/x6/commit/d0e7b41ff92a40f235cea93b6f5c0e0eac327f5c))
* sanitizes HTML with jQuery prevent Application from XSS attacks ([a6ab16d](https://github.com/antvis/x6/commit/a6ab16d8219ef74ce56e6120984f82f54529793b))
* shape registry ([08be328](https://github.com/antvis/x6/commit/08be3280cfc6859e45e2f1be1a2ebdbe51ef4e4f))
* shapes with standard markup ([ed4ff25](https://github.com/antvis/x6/commit/ed4ff2558b4e24f95070980bdb974b33e543543b))
* shapes with string markup ([f9e5439](https://github.com/antvis/x6/commit/f9e543990f55ec7ebcced84c613adb4d94d9bd5f))
* simplify polyline ([4f46e62](https://github.com/antvis/x6/commit/4f46e625de03c135c5367645aa44ad73e3b33191))
* specified `passive: false` when add wheel listener for zoom graph ([96549ff](https://github.com/antvis/x6/commit/96549ff701c52ebf044923b299b8f975bd11194c))
* split main module ([6616bf3](https://github.com/antvis/x6/commit/6616bf3b844e7b3f319876b53218268cc30564d9))
* split main module ([52f5e42](https://github.com/antvis/x6/commit/52f5e424986d16aa5f194eb2c38c554bdf5320e9))
* split module ([ba8ee1a](https://github.com/antvis/x6/commit/ba8ee1a241e58c6b823ef7e74316d26a93521a48))
* standard edge for default ([7c23ef5](https://github.com/antvis/x6/commit/7c23ef58f09e24ebc102d2407637a037751c7a16))
* standard shapes ([f9758b1](https://github.com/antvis/x6/commit/f9758b19911726e0a80bd26452ed42929e48c080))
* static method `equals` ([2dbfd6b](https://github.com/antvis/x6/commit/2dbfd6b6c2df22c106e6aceaa070f75b82f64f11))
* static toJSON method ([4d3afc5](https://github.com/antvis/x6/commit/4d3afc5e77245a78dc14d0f457ceb7c6749422ce))
* static toJSON method ([bd8e944](https://github.com/antvis/x6/commit/bd8e944f9dc24f2acdd7cc7f6943c5b5bbfad356))
* strict option for line layout ([ecc7242](https://github.com/antvis/x6/commit/ecc7242eaa8cba37de7ccf9bd53a72ec77034f26))
* string labels and single label ([486a839](https://github.com/antvis/x6/commit/486a839833d1716332ac459fc6b5b001693a7c3a))
* support array of port for "ports" option ([8a68895](https://github.com/antvis/x6/commit/8a68895175129e9432bcb17cad28f2f2a19fb735))
* support cell tools and some presets ([82599a8](https://github.com/antvis/x6/commit/82599a8f2c3376bdc660f8cea68f70789257683d))
* support custom style ([d630596](https://github.com/antvis/x6/commit/d6305968fd448fbc667e44c8818bae4a1c0fea25))
* support disable track ([dd4e7b7](https://github.com/antvis/x6/commit/dd4e7b7a5f50af160da248524c0357df1f3e1d1f))
* support DocumentFragment ([bfbefa0](https://github.com/antvis/x6/commit/bfbefa0b161f65fbae6721e59d92e08636f97310))
* support DocumentFragment ([bf5f02e](https://github.com/antvis/x6/commit/bf5f02e526834978a972eb911eaabad26f88ab04))
* support dropping cell into a group ([2b9348d](https://github.com/antvis/x6/commit/2b9348d0f6814090ed588bbf5ef255b4d9f7d1c5))
* support er router direction ([feab950](https://github.com/antvis/x6/commit/feab950d64eca11cfec529aa73476d9c948a303b))
* Support jsdelivr and cdnjs CDN service [#335](https://github.com/antvis/x6/issues/335) ([#336](https://github.com/antvis/x6/issues/336)) ([be37f66](https://github.com/antvis/x6/commit/be37f66e421aa999332dd2f54f711f930fc095dc))
* support mousewheel zooming and keyboard shortcuts ([4146b04](https://github.com/antvis/x6/commit/4146b04aa344765a1b2463396b39d25c78bc71d3))
* support panning on normal graph ([#352](https://github.com/antvis/x6/issues/352)) ([5c55e11](https://github.com/antvis/x6/commit/5c55e11d4a4e2c920963f713ded7ad3da7f83231)), closes [#339](https://github.com/antvis/x6/issues/339)
* support plaint args for native markers ([a2607d5](https://github.com/antvis/x6/commit/a2607d554df10750bfbd85cfa5596d36a47a687f))
* support remove mouseWheel listener ([a21e1a3](https://github.com/antvis/x6/commit/a21e1a3dbc3c505084bb9e8b5aba0b3ee10c32a1))
* support turbo ([1da55bf](https://github.com/antvis/x6/commit/1da55bfda73edaa96515998b5766e9ed5f241ee9))
* sync code from master ([#2004](https://github.com/antvis/x6/issues/2004)) ([c681405](https://github.com/antvis/x6/commit/c68140504bd21f654870f3d2fc1ad2f16f1113c8)), closes [#1974](https://github.com/antvis/x6/issues/1974) [#1977](https://github.com/antvis/x6/issues/1977) [#1985](https://github.com/antvis/x6/issues/1985) [#1988](https://github.com/antvis/x6/issues/1988) [#1991](https://github.com/antvis/x6/issues/1991) [#1989](https://github.com/antvis/x6/issues/1989)
* toJSON()导出画布功能ok ([a847ab8](https://github.com/antvis/x6/commit/a847ab8aa85aaf2861e51db79f6075279af84aad))
* tool registry and examples ([88a125a](https://github.com/antvis/x6/commit/88a125a1c1413ee3236bcd44f1e60def35177f90))
* update cell by set cell attrs ([b1335c1](https://github.com/antvis/x6/commit/b1335c14d7a3a1a64ddab77f24dffcc48690e880))
* use container's size when width or height was not specified ([e94609c](https://github.com/antvis/x6/commit/e94609c1d20c57a67f45176f2478df8577c6077b))
* use EventArgs ([fec7290](https://github.com/antvis/x6/commit/fec7290653cc085cba644785ea8ce6b6838c3c92)), closes [#47](https://github.com/antvis/x6/issues/47)
* use utility-types ([2ed89e8](https://github.com/antvis/x6/commit/2ed89e832a1d99b9d8a4e45d199858a7866fd70a))
* utility types ([9560c79](https://github.com/antvis/x6/commit/9560c79093aa6e9a441940c6f3dff0bb52247327))
* validateNode before added to graph ([5e54d4d](https://github.com/antvis/x6/commit/5e54d4d5d359c9549c006a0068176c5f62ba48b6)), closes [#182](https://github.com/antvis/x6/issues/182)
* wheel => mouseWheel, for readable ([95f5da4](https://github.com/antvis/x6/commit/95f5da477d25c544eeb7140cb56c1d7a35fba274))
* **x6:** add some convenient methods on namespace "x6" ([ab49248](https://github.com/antvis/x6/commit/ab49248409bf3f38a401a0780d816b6d23e8a91f))
* 允许用户控制节点、连线是否添加和删除 ([e64af7f](https://github.com/antvis/x6/commit/e64af7fe4dabc4a911dea99e6badb4852e83234a))
* 添加toJSON导出画布数据demo ([321e0ce](https://github.com/antvis/x6/commit/321e0ce10c9379a599f88febeb6b287b7d66d791))
* 用户编辑过程中动态生成的连线也可以被渲染 ([c09fdbd](https://github.com/antvis/x6/commit/c09fdbd09d81bd4278cc8d5b112efe491b32f110))


### Performance Improvements

* ⚡️ add bounds proprtyies for rectangle ([51b78b1](https://github.com/antvis/x6/commit/51b78b1f957976c455b55654281816d63fad90ed))
* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([ba5b22a](https://github.com/antvis/x6/commit/ba5b22a33a0af067d77735c5cc46a60a45734dca))
* ⚡️ add transition callbacks and events for animation lifecycle ([69db3cc](https://github.com/antvis/x6/commit/69db3cc8257fef6528a3ea70c78131bcdf0738ce)), closes [#419](https://github.com/antvis/x6/issues/419) [#420](https://github.com/antvis/x6/issues/420)
* ⚡️ align anchor ([b8b0d46](https://github.com/antvis/x6/commit/b8b0d465ee2096bf6d0a7d99661037c75f652925))
* ⚡️ auto scroll graph on moving node ([b2fb417](https://github.com/antvis/x6/commit/b2fb4170a0939488500c349db9006c7f11d884f7))
* ⚡️ avoid multiple times reflow when resize ([d6d17d7](https://github.com/antvis/x6/commit/d6d17d726dc6509b4ba82ce3cd413e3b654f0008))
* ⚡️ clean everything and restore dom structure on graph disposed ([a834331](https://github.com/antvis/x6/commit/a834331779e76e57ccb409d2f39040406ef732ea)), closes [#291](https://github.com/antvis/x6/issues/291) [#292](https://github.com/antvis/x6/issues/292)
* ⚡️ improve box selection performance ([#1393](https://github.com/antvis/x6/issues/1393)) ([6036b6d](https://github.com/antvis/x6/commit/6036b6d12339186f8088a4515098944a066747dc))
* ⚡️ Optimize apply and call ([#203](https://github.com/antvis/x6/issues/203)) ([0bf987b](https://github.com/antvis/x6/commit/0bf987bc598916146b3fca9a35a1f6ecc98c8cf4))
* ⚡️ optimize marker render ([da30c93](https://github.com/antvis/x6/commit/da30c9300bfff2f3b1b48ffc6e82f1afdd6d32be))
* ⚡️ optimize node render performance ([6554959](https://github.com/antvis/x6/commit/65549599d2f82f8052d16776c8d36ce7ee2fba9b))
* ⚡️ parallel line ([835655c](https://github.com/antvis/x6/commit/835655c18035717d7fd9ced283c2e0d565621a9a))
* ⚡️ reduce dom op in sortViews ([11cd5be](https://github.com/antvis/x6/commit/11cd5bec30652567c7a5aaba74d73ef430254c52))
* ⚡️ restrict on resizing ([36107bf](https://github.com/antvis/x6/commit/36107bf81871b6ce083ae02bbd9ba72deb6aa9b8)), closes [#289](https://github.com/antvis/x6/issues/289)
* ⚡️ support space modifier key ([c2be3c0](https://github.com/antvis/x6/commit/c2be3c098522df204df1a5aaf38aa4668d75fdeb))
* ⚡️ types of async function ([36fd538](https://github.com/antvis/x6/commit/36fd538205fb46a72bcc9ab3868c7c33eddef602))


### BREAKING CHANGES

* force release 2.0-beta
* 2.0-beta





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.0
* **@antv/x6-geometry:** upgraded to 1.0.0

## @antv/x6 [2.0.3](https://github.com/antvis/x6/compare/@antv/x6@2.0.2...@antv/x6@2.0.3) (2022-11-04)





### Dependencies

* **@antv/x6-common:** upgraded to 2.0.0

## @antv/x6 [2.0.2](https://github.com/antvis/x6/compare/@antv/x6@2.0.1...@antv/x6@2.0.2) (2022-11-04)





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.1

## @antv/x6 [2.0.1](https://github.com/antvis/x6/compare/@antv/x6@2.0.0...@antv/x6@2.0.1) (2022-11-04)





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.1

# @antv/x6 [2.0.0](https://github.com/antvis/x6/compare/@antv/x6@1.30.2...@antv/x6@2.0.0) (2022-11-04)


### Bug Fixes

* 🐛 add timeout for schedule ([#2303](https://github.com/antvis/x6/issues/2303)) ([a6a2d12](https://github.com/antvis/x6/commit/a6a2d12b07add27ef19eebbf7b5ca7cd17dde09e))
* 🐛 change jobqueue to transient ([0e39d94](https://github.com/antvis/x6/commit/0e39d9447bc8c0ba0b11c272bf9b64df9ba95a33))
* 🐛 debounce update methords in scroller ([6e1bd9b](https://github.com/antvis/x6/commit/6e1bd9b5307b4cf17b3951168e10527d6111e5e5))
* 🐛 fix cellEditorOptions typo ([#1895](https://github.com/antvis/x6/issues/1895)) ([4d174d7](https://github.com/antvis/x6/commit/4d174d7807463d64ff248fe4ee1e09010bad4bfc))
* bump rule ([c9559f2](https://github.com/antvis/x6/commit/c9559f2f30790857ff066be7d0ce99ed8933e20c))
* commit message E2BIG ([a2c5f9e](https://github.com/antvis/x6/commit/a2c5f9e943ccf1d7ae478af30cb5022dd72e2e99))
* deps version ([2aff4b4](https://github.com/antvis/x6/commit/2aff4b4cd0c23660066a43e182524d4515948b0a))


### chore

* release beta ([b5f3cfa](https://github.com/antvis/x6/commit/b5f3cfa2042f5196a995a38a8f41f140cabdce57))


### Features

* ✨ add autoResize feature ([5aeae97](https://github.com/antvis/x6/commit/5aeae976cd7638b2b5c05bc12bc56b562366fe5f))
* ✨ add clipboard plugin ([8107f6d](https://github.com/antvis/x6/commit/8107f6df5de52a33e1b8094a44d59ee7fd2a8042))
* ✨ add dnd plugin ([269fae9](https://github.com/antvis/x6/commit/269fae9e5eeb969c6a7884373aa3a32002c064e6))
* ✨ add html shape ([8d75504](https://github.com/antvis/x6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ add minimap plugin ([6cdecbb](https://github.com/antvis/x6/commit/6cdecbbba9a4db1f67189e23fb89f2a7ba2af99e))
* ✨ add selection plugin ([#2742](https://github.com/antvis/x6/issues/2742)) ([50a5dc7](https://github.com/antvis/x6/commit/50a5dc7cd8c2e39a1f8bf8359a0eb189dda8cb86))
* ✨ add snapline plugin ([294672b](https://github.com/antvis/x6/commit/294672b3066b15ab834ce2a3172facc49004c950))
* ✨ add some missing api ([1dcb3d9](https://github.com/antvis/x6/commit/1dcb3d92fd83e5dfd1a1af9670d539a99dd9f55a))
* ✨ export common and geometry in x6 package ([#2820](https://github.com/antvis/x6/issues/2820)) ([df28200](https://github.com/antvis/x6/commit/df282000cc5e17521147c77c210e172c444c9938))
* ✨ improve auto-resize feature ([40d5335](https://github.com/antvis/x6/commit/40d53355cedc0bbbeb1e26948b67254dc6a40d85))
* 🐛　support click on the non-text area without adding a new label ([#1894](https://github.com/antvis/x6/issues/1894)) ([4ae1b9e](https://github.com/antvis/x6/commit/4ae1b9ef4f43b9c9f96796c5c5fa31f968b82bdf))
* adjust event source and package deps ([#2826](https://github.com/antvis/x6/issues/2826)) ([a1bdb18](https://github.com/antvis/x6/commit/a1bdb18b1d1e1967e8e27862fed2e4fe8787a8cb))
* support turbo ([1da55bf](https://github.com/antvis/x6/commit/1da55bfda73edaa96515998b5766e9ed5f241ee9))
* sync code from master ([#2004](https://github.com/antvis/x6/issues/2004)) ([c681405](https://github.com/antvis/x6/commit/c68140504bd21f654870f3d2fc1ad2f16f1113c8)), closes [#1974](https://github.com/antvis/x6/issues/1974) [#1977](https://github.com/antvis/x6/issues/1977) [#1985](https://github.com/antvis/x6/issues/1985) [#1988](https://github.com/antvis/x6/issues/1988) [#1991](https://github.com/antvis/x6/issues/1991) [#1989](https://github.com/antvis/x6/issues/1989)


### BREAKING CHANGES

* force release 2.0-beta
* 2.0-beta





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.0
* **@antv/x6-geometry:** upgraded to 2.0.0

## @antv/x6 [2.0.6-beta.6](https://github.com/antvis/x6/compare/@antv/x6@2.0.6-beta.5...@antv/x6@2.0.6-beta.6) (2022-11-04)


### Bug Fixes

* bump rule ([c9559f2](https://github.com/antvis/x6/commit/c9559f2f30790857ff066be7d0ce99ed8933e20c))

## @antv/x6 [2.0.6-beta.5](https://github.com/antvis/x6/compare/@antv/x6@2.0.6-beta.4...@antv/x6@2.0.6-beta.5) (2022-11-04)





### Dependencies

* **@antv/x6-common:** upgraded to 2.0.6-beta.1
* **@antv/x6-geometry:** upgraded to 2.0.6-beta.1

## @antv/x6 [2.0.6-beta.4](https://github.com/antvis/x6/compare/@antv/x6@2.0.6-beta.3...@antv/x6@2.0.6-beta.4) (2022-11-03)


### Bug Fixes

* commit message E2BIG ([a2c5f9e](https://github.com/antvis/x6/commit/a2c5f9e943ccf1d7ae478af30cb5022dd72e2e99))





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.0-beta.1
* **@antv/x6-geometry:** upgraded to 2.0.0-beta.1

## @antv/x6 [2.0.6-beta.3](https://github.com/antvis/x6/compare/@antv/x6@2.0.6-beta.2...@antv/x6@2.0.6-beta.3) (2022-11-03)





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.0-beta.1
* **@antv/x6-geometry:** upgraded to 2.0.0-beta.1

## @antv/x6 [2.0.6-beta.2](https://github.com/antvis/x6/compare/@antv/x6@2.0.6-beta.1...@antv/x6@2.0.6-beta.2) (2022-11-03)





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.0-beta.1
* **@antv/x6-geometry:** upgraded to 2.0.0-beta.1

## @antv/x6 [2.0.6-beta.1](https://github.com/antvis/x6/compare/@antv/x6@2.0.0-beta.1...@antv/x6@2.0.6-beta.1) (2022-11-03)





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.0-beta.1
* **@antv/x6-geometry:** upgraded to 2.0.0-beta.1

# @antv/x6 [2.0.0-beta.1](https://github.com/antvis/x6/compare/@antv/x6@1.30.2...@antv/x6@2.0.0-beta.1) (2022-11-03)


### Bug Fixes

* 🐛 add timeout for schedule ([#2303](https://github.com/antvis/x6/issues/2303)) ([a6a2d12](https://github.com/antvis/x6/commit/a6a2d12b07add27ef19eebbf7b5ca7cd17dde09e))
* 🐛 change jobqueue to transient ([0e39d94](https://github.com/antvis/x6/commit/0e39d9447bc8c0ba0b11c272bf9b64df9ba95a33))
* 🐛 debounce update methords in scroller ([6e1bd9b](https://github.com/antvis/x6/commit/6e1bd9b5307b4cf17b3951168e10527d6111e5e5))
* 🐛 fix cellEditorOptions typo ([#1895](https://github.com/antvis/x6/issues/1895)) ([4d174d7](https://github.com/antvis/x6/commit/4d174d7807463d64ff248fe4ee1e09010bad4bfc))
* deps version ([2aff4b4](https://github.com/antvis/x6/commit/2aff4b4cd0c23660066a43e182524d4515948b0a))


### chore

* release beta ([b5f3cfa](https://github.com/antvis/x6/commit/b5f3cfa2042f5196a995a38a8f41f140cabdce57))


### Features

* ✨ add autoResize feature ([5aeae97](https://github.com/antvis/x6/commit/5aeae976cd7638b2b5c05bc12bc56b562366fe5f))
* ✨ add clipboard plugin ([8107f6d](https://github.com/antvis/x6/commit/8107f6df5de52a33e1b8094a44d59ee7fd2a8042))
* ✨ add dnd plugin ([269fae9](https://github.com/antvis/x6/commit/269fae9e5eeb969c6a7884373aa3a32002c064e6))
* ✨ add html shape ([8d75504](https://github.com/antvis/x6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ add minimap plugin ([6cdecbb](https://github.com/antvis/x6/commit/6cdecbbba9a4db1f67189e23fb89f2a7ba2af99e))
* ✨ add selection plugin ([#2742](https://github.com/antvis/x6/issues/2742)) ([50a5dc7](https://github.com/antvis/x6/commit/50a5dc7cd8c2e39a1f8bf8359a0eb189dda8cb86))
* ✨ add snapline plugin ([294672b](https://github.com/antvis/x6/commit/294672b3066b15ab834ce2a3172facc49004c950))
* ✨ add some missing api ([1dcb3d9](https://github.com/antvis/x6/commit/1dcb3d92fd83e5dfd1a1af9670d539a99dd9f55a))
* ✨ export common and geometry in x6 package ([#2820](https://github.com/antvis/x6/issues/2820)) ([df28200](https://github.com/antvis/x6/commit/df282000cc5e17521147c77c210e172c444c9938))
* ✨ improve auto-resize feature ([40d5335](https://github.com/antvis/x6/commit/40d53355cedc0bbbeb1e26948b67254dc6a40d85))
* 🐛　support click on the non-text area without adding a new label ([#1894](https://github.com/antvis/x6/issues/1894)) ([4ae1b9e](https://github.com/antvis/x6/commit/4ae1b9ef4f43b9c9f96796c5c5fa31f968b82bdf))
* support turbo ([1da55bf](https://github.com/antvis/x6/commit/1da55bfda73edaa96515998b5766e9ed5f241ee9))
* sync code from master ([#2004](https://github.com/antvis/x6/issues/2004)) ([c681405](https://github.com/antvis/x6/commit/c68140504bd21f654870f3d2fc1ad2f16f1113c8)), closes [#1974](https://github.com/antvis/x6/issues/1974) [#1977](https://github.com/antvis/x6/issues/1977) [#1985](https://github.com/antvis/x6/issues/1985) [#1988](https://github.com/antvis/x6/issues/1988) [#1991](https://github.com/antvis/x6/issues/1991) [#1989](https://github.com/antvis/x6/issues/1989)


### BREAKING CHANGES

* force release 2.0-beta
* 2.0-beta





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.0-beta.1
* **@antv/x6-geometry:** upgraded to 2.0.0-beta.1

# @antv/x6 [1.31.0-beta.1](https://github.com/antvis/x6/compare/@antv/x6@1.30.2...@antv/x6@1.31.0-beta.1) (2022-11-03)


### Bug Fixes

* 🐛 add timeout for schedule ([#2303](https://github.com/antvis/x6/issues/2303)) ([a6a2d12](https://github.com/antvis/x6/commit/a6a2d12b07add27ef19eebbf7b5ca7cd17dde09e))
* 🐛 change jobqueue to transient ([0e39d94](https://github.com/antvis/x6/commit/0e39d9447bc8c0ba0b11c272bf9b64df9ba95a33))
* 🐛 debounce update methords in scroller ([6e1bd9b](https://github.com/antvis/x6/commit/6e1bd9b5307b4cf17b3951168e10527d6111e5e5))
* 🐛 fix cellEditorOptions typo ([#1895](https://github.com/antvis/x6/issues/1895)) ([4d174d7](https://github.com/antvis/x6/commit/4d174d7807463d64ff248fe4ee1e09010bad4bfc))
* deps version ([2aff4b4](https://github.com/antvis/x6/commit/2aff4b4cd0c23660066a43e182524d4515948b0a))


### chore

* release beta ([b5f3cfa](https://github.com/antvis/x6/commit/b5f3cfa2042f5196a995a38a8f41f140cabdce57))


### Features

* ✨ add autoResize feature ([5aeae97](https://github.com/antvis/x6/commit/5aeae976cd7638b2b5c05bc12bc56b562366fe5f))
* ✨ add clipboard plugin ([8107f6d](https://github.com/antvis/x6/commit/8107f6df5de52a33e1b8094a44d59ee7fd2a8042))
* ✨ add dnd plugin ([269fae9](https://github.com/antvis/x6/commit/269fae9e5eeb969c6a7884373aa3a32002c064e6))
* ✨ add html shape ([8d75504](https://github.com/antvis/x6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ add minimap plugin ([6cdecbb](https://github.com/antvis/x6/commit/6cdecbbba9a4db1f67189e23fb89f2a7ba2af99e))
* ✨ add selection plugin ([#2742](https://github.com/antvis/x6/issues/2742)) ([50a5dc7](https://github.com/antvis/x6/commit/50a5dc7cd8c2e39a1f8bf8359a0eb189dda8cb86))
* ✨ add snapline plugin ([294672b](https://github.com/antvis/x6/commit/294672b3066b15ab834ce2a3172facc49004c950))
* ✨ add some missing api ([1dcb3d9](https://github.com/antvis/x6/commit/1dcb3d92fd83e5dfd1a1af9670d539a99dd9f55a))
* ✨ export common and geometry in x6 package ([#2820](https://github.com/antvis/x6/issues/2820)) ([df28200](https://github.com/antvis/x6/commit/df282000cc5e17521147c77c210e172c444c9938))
* ✨ improve auto-resize feature ([40d5335](https://github.com/antvis/x6/commit/40d53355cedc0bbbeb1e26948b67254dc6a40d85))
* 🐛　support click on the non-text area without adding a new label ([#1894](https://github.com/antvis/x6/issues/1894)) ([4ae1b9e](https://github.com/antvis/x6/commit/4ae1b9ef4f43b9c9f96796c5c5fa31f968b82bdf))
* sync code from master ([#2004](https://github.com/antvis/x6/issues/2004)) ([c681405](https://github.com/antvis/x6/commit/c68140504bd21f654870f3d2fc1ad2f16f1113c8)), closes [#1974](https://github.com/antvis/x6/issues/1974) [#1977](https://github.com/antvis/x6/issues/1977) [#1985](https://github.com/antvis/x6/issues/1985) [#1988](https://github.com/antvis/x6/issues/1988) [#1991](https://github.com/antvis/x6/issues/1991) [#1989](https://github.com/antvis/x6/issues/1989)


### BREAKING CHANGES

* 2.0-beta





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.0-beta.1
* **@antv/x6-geometry:** upgraded to 1.1.0-beta.1

# @antv/x6 [1.31.0](https://github.com/antvis/x6/compare/@antv/x6@1.30.2...@antv/x6@1.31.0) (2022-11-03)


### Bug Fixes

* 🐛 add timeout for schedule ([#2303](https://github.com/antvis/x6/issues/2303)) ([a6a2d12](https://github.com/antvis/x6/commit/a6a2d12b07add27ef19eebbf7b5ca7cd17dde09e))
* 🐛 change jobqueue to transient ([0e39d94](https://github.com/antvis/x6/commit/0e39d9447bc8c0ba0b11c272bf9b64df9ba95a33))
* 🐛 debounce update methords in scroller ([6e1bd9b](https://github.com/antvis/x6/commit/6e1bd9b5307b4cf17b3951168e10527d6111e5e5))
* 🐛 fix cellEditorOptions typo ([#1895](https://github.com/antvis/x6/issues/1895)) ([4d174d7](https://github.com/antvis/x6/commit/4d174d7807463d64ff248fe4ee1e09010bad4bfc))
* deps version ([2aff4b4](https://github.com/antvis/x6/commit/2aff4b4cd0c23660066a43e182524d4515948b0a))


### Features

* ✨ add autoResize feature ([5aeae97](https://github.com/antvis/x6/commit/5aeae976cd7638b2b5c05bc12bc56b562366fe5f))
* ✨ add clipboard plugin ([8107f6d](https://github.com/antvis/x6/commit/8107f6df5de52a33e1b8094a44d59ee7fd2a8042))
* ✨ add dnd plugin ([269fae9](https://github.com/antvis/x6/commit/269fae9e5eeb969c6a7884373aa3a32002c064e6))
* ✨ add html shape ([8d75504](https://github.com/antvis/x6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ add minimap plugin ([6cdecbb](https://github.com/antvis/x6/commit/6cdecbbba9a4db1f67189e23fb89f2a7ba2af99e))
* ✨ add selection plugin ([#2742](https://github.com/antvis/x6/issues/2742)) ([50a5dc7](https://github.com/antvis/x6/commit/50a5dc7cd8c2e39a1f8bf8359a0eb189dda8cb86))
* ✨ add snapline plugin ([294672b](https://github.com/antvis/x6/commit/294672b3066b15ab834ce2a3172facc49004c950))
* ✨ add some missing api ([1dcb3d9](https://github.com/antvis/x6/commit/1dcb3d92fd83e5dfd1a1af9670d539a99dd9f55a))
* ✨ export common and geometry in x6 package ([#2820](https://github.com/antvis/x6/issues/2820)) ([df28200](https://github.com/antvis/x6/commit/df282000cc5e17521147c77c210e172c444c9938))
* ✨ improve auto-resize feature ([40d5335](https://github.com/antvis/x6/commit/40d53355cedc0bbbeb1e26948b67254dc6a40d85))
* 🐛　support click on the non-text area without adding a new label ([#1894](https://github.com/antvis/x6/issues/1894)) ([4ae1b9e](https://github.com/antvis/x6/commit/4ae1b9ef4f43b9c9f96796c5c5fa31f968b82bdf))
* sync code from master ([#2004](https://github.com/antvis/x6/issues/2004)) ([c681405](https://github.com/antvis/x6/commit/c68140504bd21f654870f3d2fc1ad2f16f1113c8)), closes [#1974](https://github.com/antvis/x6/issues/1974) [#1977](https://github.com/antvis/x6/issues/1977) [#1985](https://github.com/antvis/x6/issues/1985) [#1988](https://github.com/antvis/x6/issues/1988) [#1991](https://github.com/antvis/x6/issues/1991) [#1989](https://github.com/antvis/x6/issues/1989)





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.0
* **@antv/x6-geometry:** upgraded to 1.1.0

# @antv/x6 [1.31.0](https://github.com/antvis/x6/compare/@antv/x6@1.30.2...@antv/x6@1.31.0) (2022-11-03)


### Bug Fixes

* 🐛 add timeout for schedule ([#2303](https://github.com/antvis/x6/issues/2303)) ([a6a2d12](https://github.com/antvis/x6/commit/a6a2d12b07add27ef19eebbf7b5ca7cd17dde09e))
* 🐛 change jobqueue to transient ([0e39d94](https://github.com/antvis/x6/commit/0e39d9447bc8c0ba0b11c272bf9b64df9ba95a33))
* 🐛 debounce update methords in scroller ([6e1bd9b](https://github.com/antvis/x6/commit/6e1bd9b5307b4cf17b3951168e10527d6111e5e5))
* 🐛 fix cellEditorOptions typo ([#1895](https://github.com/antvis/x6/issues/1895)) ([4d174d7](https://github.com/antvis/x6/commit/4d174d7807463d64ff248fe4ee1e09010bad4bfc))


### Features

* ✨ add autoResize feature ([5aeae97](https://github.com/antvis/x6/commit/5aeae976cd7638b2b5c05bc12bc56b562366fe5f))
* ✨ add clipboard plugin ([8107f6d](https://github.com/antvis/x6/commit/8107f6df5de52a33e1b8094a44d59ee7fd2a8042))
* ✨ add dnd plugin ([269fae9](https://github.com/antvis/x6/commit/269fae9e5eeb969c6a7884373aa3a32002c064e6))
* ✨ add html shape ([8d75504](https://github.com/antvis/x6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ add minimap plugin ([6cdecbb](https://github.com/antvis/x6/commit/6cdecbbba9a4db1f67189e23fb89f2a7ba2af99e))
* ✨ add selection plugin ([#2742](https://github.com/antvis/x6/issues/2742)) ([50a5dc7](https://github.com/antvis/x6/commit/50a5dc7cd8c2e39a1f8bf8359a0eb189dda8cb86))
* ✨ add snapline plugin ([294672b](https://github.com/antvis/x6/commit/294672b3066b15ab834ce2a3172facc49004c950))
* ✨ add some missing api ([1dcb3d9](https://github.com/antvis/x6/commit/1dcb3d92fd83e5dfd1a1af9670d539a99dd9f55a))
* ✨ export common and geometry in x6 package ([#2820](https://github.com/antvis/x6/issues/2820)) ([df28200](https://github.com/antvis/x6/commit/df282000cc5e17521147c77c210e172c444c9938))
* ✨ improve auto-resize feature ([40d5335](https://github.com/antvis/x6/commit/40d53355cedc0bbbeb1e26948b67254dc6a40d85))
* 🐛　support click on the non-text area without adding a new label ([#1894](https://github.com/antvis/x6/issues/1894)) ([4ae1b9e](https://github.com/antvis/x6/commit/4ae1b9ef4f43b9c9f96796c5c5fa31f968b82bdf))
* sync code from master ([#2004](https://github.com/antvis/x6/issues/2004)) ([c681405](https://github.com/antvis/x6/commit/c68140504bd21f654870f3d2fc1ad2f16f1113c8)), closes [#1974](https://github.com/antvis/x6/issues/1974) [#1977](https://github.com/antvis/x6/issues/1977) [#1985](https://github.com/antvis/x6/issues/1985) [#1988](https://github.com/antvis/x6/issues/1988) [#1991](https://github.com/antvis/x6/issues/1991) [#1989](https://github.com/antvis/x6/issues/1989)





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.0
* **@antv/x6-geometry:** upgraded to 1.1.0
