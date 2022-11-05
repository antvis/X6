## @antv/x6-example-features [1.0.1](https://github.com/antvis/X6/compare/@antv/x6-example-features@1.0.0...@antv/x6-example-features@1.0.1) (2022-11-05)


### chore

* bump to 2.0 ([a02ca20](https://github.com/antvis/X6/commit/a02ca20f054d2eada7806f76b0abe5ae51fb18d1))


### BREAKING CHANGES

* bump to 2.0





### Dependencies

* **@antv/x6:** upgraded to 1.1.1
* **@antv/x6-plugin-clipboard:** upgraded to 1.0.3
* **@antv/x6-plugin-dnd:** upgraded to 1.0.3
* **@antv/x6-plugin-history:** upgraded to 1.0.3
* **@antv/x6-plugin-keyboard:** upgraded to 1.0.3
* **@antv/x6-plugin-minimap:** upgraded to 1.0.3
* **@antv/x6-plugin-scroller:** upgraded to 1.1.1
* **@antv/x6-plugin-selection:** upgraded to 1.0.3
* **@antv/x6-plugin-snapline:** upgraded to 1.0.3
* **@antv/x6-plugin-stencil:** upgraded to 1.0.3
* **@antv/x6-plugin-transform:** upgraded to 1.0.3
* **@antv/x6-plugin-export:** upgraded to 1.0.3
* **@antv/x6-react-components:** upgraded to 1.1.1
* **@antv/x6-react-shape:** upgraded to 1.0.3

# @antv/x6-example-features 1.0.0 (2022-11-05)


### Bug Fixes

* 🐛 'blank:click' was not triggered when rubberband is enabled ([5046487](https://github.com/antvis/X6/commit/50464871862a362df19bf2ef598892a41297ffe1)), closes [#222](https://github.com/antvis/X6/issues/222)
* 🐛 add return value for autoScroller in scroller plugin ([5e102a3](https://github.com/antvis/X6/commit/5e102a39c5bd14a478edd4f36c4264997027c2a9))
* 🐛 add timeout for schedule ([#2303](https://github.com/antvis/X6/issues/2303)) ([a6a2d12](https://github.com/antvis/X6/commit/a6a2d12b07add27ef19eebbf7b5ca7cd17dde09e))
* 🐛 alerts on LGTM.com ([87d8140](https://github.com/antvis/X6/commit/87d81405d65e9947319a525616f276244202a543))
* 🐛 auto rotate token ([fb5b6aa](https://github.com/antvis/X6/commit/fb5b6aa9e73552ca7ef1c025d9468244dca77891))
* 🐛 break text with chinese characters(double byte character) ([14199bc](https://github.com/antvis/X6/commit/14199bc8529adddb347ef934926503a789b64980)), closes [#596](https://github.com/antvis/X6/issues/596)
* 🐛 cell view in minimap ([8bc9978](https://github.com/antvis/X6/commit/8bc99787af1c80d4e8ede878ae02474e929b9582))
* 🐛 change component -> render ([9239d81](https://github.com/antvis/X6/commit/9239d81a97e84cb8c82eebc5effaa98b869fc4df))
* 🐛 change jobqueue to transient ([0e39d94](https://github.com/antvis/X6/commit/0e39d9447bc8c0ba0b11c272bf9b64df9ba95a33))
* 🐛 change rerender -> shouldComponentUpdate ([575329b](https://github.com/antvis/X6/commit/575329bce4c8df8e20d6673d9cfd27e9c0001343))
* 🐛 dnd events ([3e94b0b](https://github.com/antvis/X6/commit/3e94b0b1eafab8f43cff2601b088df24d1b062a4)), closes [#271](https://github.com/antvis/X6/issues/271)
* 🐛 dnd node style ([ff21a54](https://github.com/antvis/X6/commit/ff21a5459d21487649bd497148604bc0f7a38481))
* 🐛 do not generate new commands on redoing/undoing ([5b3d713](https://github.com/antvis/X6/commit/5b3d7133f3a7b4841f461e67af5963ec84820741)), closes [#627](https://github.com/antvis/X6/issues/627)
* 🐛 do not trigger getDropNode when drop at invalid area ([c6068ad](https://github.com/antvis/X6/commit/c6068ada6b967fa81be5c4b39c5e0d6b0402ce9c))
* 🐛 do not update pagesize automatically when set graph size ([949a42d](https://github.com/antvis/X6/commit/949a42dacfc5023d25bcabc0a3a1a7d8578f1b96)), closes [#644](https://github.com/antvis/X6/issues/644) [#564](https://github.com/antvis/X6/issues/564)
* 🐛 edge connection error ([b3a5d03](https://github.com/antvis/X6/commit/b3a5d032a3d75d4c094db90150c19c84b1ba787f)), closes [#245](https://github.com/antvis/X6/issues/245)
* 🐛 filter not working when select cell by calling `select()` api or by click ([#314](https://github.com/antvis/X6/issues/314)) ([7a3e547](https://github.com/antvis/X6/commit/7a3e54731940f5dcc2a15b8d338aedf64fc63619)), closes [#305](https://github.com/antvis/X6/issues/305)
* 🐛 findParent args ([ba39109](https://github.com/antvis/X6/commit/ba39109ee6ff3f570610d3ab6acb060711711153))
* 🐛 fix add tools not work ([f5d1d6a](https://github.com/antvis/X6/commit/f5d1d6a326021247ee8967675fc9490ddbb6d0aa))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/X6/issues/789)) ([7638143](https://github.com/antvis/X6/commit/7638143b04c0a50a333200423753f6bd19a6ceb3))
* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/X6/issues/1111)) ([d5c854f](https://github.com/antvis/X6/commit/d5c854f644e4926dba2913a216870bdbaafd425a))
* 🐛 fix sourceMarker and targetMaker position ([e1b927f](https://github.com/antvis/X6/commit/e1b927fa21dab980abfb273eb8fe8ae5a1cc224e))
* 🐛 fix the error in selected nodes position when snapline enabled ([#2797](https://github.com/antvis/X6/issues/2797)) ([1e7f132](https://github.com/antvis/X6/commit/1e7f132bed15006cc5535f1294f0b8a545dd6441))
* 🐛 fix the interaction of arrowhead ([1319429](https://github.com/antvis/X6/commit/1319429312d9476ae8449cd00845f91601269e67))
* 🐛 fix type definition of node and edge registry ([eb5f0cd](https://github.com/antvis/X6/commit/eb5f0cdec2a7dab709d4baa319a26e403b22787e)), closes [#478](https://github.com/antvis/X6/issues/478)
* 🐛 fix type error ([30ca7a9](https://github.com/antvis/X6/commit/30ca7a92817d28e58589413e36d3d2931360b8ae))
* 🐛 fix x6-react-components version in demo ([709cdae](https://github.com/antvis/X6/commit/709cdae33d13acfd77af11e8bb5fb4f493dd5bd5))
* 🐛 get completed picture when execue toPNG ([c48a5cf](https://github.com/antvis/X6/commit/c48a5cf15da4f51641890f880a509aab7476d6ab))
* 🐛 html shape ([45c9109](https://github.com/antvis/X6/commit/45c9109c9125ce1791698d01710984e5fd71b4c3))
* 🐛 interact with input rendered in react component ([82478b1](https://github.com/antvis/X6/commit/82478b1d66e3b8b4346dab9041cb00e54fea9be1))
* 🐛 jump over ([eb812f5](https://github.com/antvis/X6/commit/eb812f5fcd375319a34d70cd58e5228ebf8f3458))
* 🐛 linear gradient along edge path ([669fc5b](https://github.com/antvis/X6/commit/669fc5bd2d57635ce9d45dc0470674dad74f4add)), closes [#635](https://github.com/antvis/X6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([333689a](https://github.com/antvis/X6/commit/333689a880a30dbc0879705b7f655cec8d30f1df)), closes [#635](https://github.com/antvis/X6/issues/635)
* 🐛 lost remove batch event when cell was removed ([2f9899c](https://github.com/antvis/X6/commit/2f9899cf98ee40e5c2c2ef6eafeb5fd8c26a545d))
* 🐛 modifer key of panning and selecting ([8050aff](https://github.com/antvis/X6/commit/8050aff3d9980391acf558706ffc80e292e3b53c))
* 🐛 modifier keys of panning and selecting ([3e749a8](https://github.com/antvis/X6/commit/3e749a84f933d6230128effe192ed3d5009f11d3))
* 🐛 mouse event on start dnd ([242c44c](https://github.com/antvis/X6/commit/242c44cad4e6272a0d4c0c3dec0b847cef28ea72))
* 🐛 node:xxx event was not triggered when interact with selection boxes ([34cd5a0](https://github.com/antvis/X6/commit/34cd5a0737b291357d398b8ef2f5c58b113a1fc3)), closes [#297](https://github.com/antvis/X6/issues/297)
* 🐛 optimize cell remove method ([391fe8f](https://github.com/antvis/X6/commit/391fe8fd88f10d936c5860f465c7a423632f30f9))
* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/X6/issues/1391)) ([cc01fdf](https://github.com/antvis/X6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 optimize params for edge:connected event ([f27c840](https://github.com/antvis/X6/commit/f27c840c425ff701e2ea2e46b84f142e5aae5940))
* 🐛 registry ([effadf0](https://github.com/antvis/X6/commit/effadf00646e4eecca24676c7336eec1be11951e))
* 🐛 registry ([f93b790](https://github.com/antvis/X6/commit/f93b790449bd7da83793d321a732c2cf2e5eded4))
* 🐛 registry ([9cb1e9d](https://github.com/antvis/X6/commit/9cb1e9d14540ac65c4850e220771588400c0533f))
* 🐛 registry ([5c942a3](https://github.com/antvis/X6/commit/5c942a32463c744bb78c6ca266a97013e5734a1b))
* 🐛 remove default points attr of polygon and polyline ([ccab7a2](https://github.com/antvis/X6/commit/ccab7a2a1c30955239891149d1c1e9250160bbe5)), closes [#304](https://github.com/antvis/X6/issues/304) [#304](https://github.com/antvis/X6/issues/304)
* 🐛 reset dragging status ([d274b5d](https://github.com/antvis/X6/commit/d274b5d8fd2352a2447a0006ee0d90b02b71688b))
* 🐛 resize scroller and graph ([2a69150](https://github.com/antvis/X6/commit/2a691501ec89f60ce61e8bab4e22483ce7ebf44a))
* 🐛 save iframe size ([061e871](https://github.com/antvis/X6/commit/061e8714eabdf325a1680d687a2af7360f9a0e3a))
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([9dded68](https://github.com/antvis/X6/commit/9dded6853d66b86e7bbeb738b2df15b51d1a8627))
* 🐛 should auto normalize path data when parse path from string ([b438eea](https://github.com/antvis/X6/commit/b438eeabd574487f7082f9a15a1a0ed57f5ce124))
* 🐛 should auto remove tools on cell was removed ([8194056](https://github.com/antvis/X6/commit/81940566cc3f561e27ab52d62ccfca40920b988b)), closes [#383](https://github.com/antvis/X6/issues/383)
* 🐛 should auto remove tools when removing cells ([e8d2bf0](https://github.com/antvis/X6/commit/e8d2bf0f5ccf1a36043f550cec01b079e1df8f11))
* 🐛 should auto update scroller when unfreeze ([be5f51c](https://github.com/antvis/X6/commit/be5f51cc03b873b46c08f132a3ade9f015a312c5))
* 🐛 should remove selection box after cell was removed ([90e706f](https://github.com/antvis/X6/commit/90e706f9f4ad78035299e50460ab09aab2221a0f))
* 🐛 should render vertices tool with lowest z-index ([213a01f](https://github.com/antvis/X6/commit/213a01fca28b1e790ce58d228aa460ea798bb98f)), closes [#638](https://github.com/antvis/X6/issues/638)
* 🐛 should return `stop` method when calling `sendToken` ([45a3320](https://github.com/antvis/X6/commit/45a3320978ebe059e8f2016bd0e46e5ab6ed0745))
* 🐛 should stop dragging when validate node async ([02e5c2f](https://github.com/antvis/X6/commit/02e5c2fbdf6bc0cd0fb1f3b2fe3acb662dbe3268)), closes [#429](https://github.com/antvis/X6/issues/429)
* 🐛 should unselect previous selected cell when single selecting ([49c3ca7](https://github.com/antvis/X6/commit/49c3ca7aa1b462536eada7f78456a3c733b907fe))
* 🐛 sort views after async graph rendered ([37ea8bb](https://github.com/antvis/X6/commit/37ea8bbfe049018d879d5a2b6d584ef60c0aca09))
* 🐛 take the stroke-width into account when calc connection point ([9a8cb11](https://github.com/antvis/X6/commit/9a8cb11fb4c29ac04ac939403c3ace4fe574c06a))
* 🐛 typos ([8b81d09](https://github.com/antvis/X6/commit/8b81d0945f3e12452d353046ac7eb8ac531128af))
* 🐛 unselect cell by clicking cell and holding on the meta key ([289ca84](https://github.com/antvis/X6/commit/289ca84a685dfcc4ffec19c8c66e26d945fdfd39))
* 🐛 update node's incomings and outgoings when edge was removed ([e6fa34c](https://github.com/antvis/X6/commit/e6fa34c872c2231ed8b2c20046f0d4ef346be010)), closes [#241](https://github.com/antvis/X6/issues/241)
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/X6/issues/1425)) ([4208846](https://github.com/antvis/X6/commit/4208846337326d8983f1662faa8da67efd8568b4))
* 🐛 use `graph.createNode` to create node ([405e2d6](https://github.com/antvis/X6/commit/405e2d6a6a6be3fc912f553fd395b995d815c032))
* 🐛 used in unpkg "Uncaught ReferenceError: module is not defined" ([2863a29](https://github.com/antvis/X6/commit/2863a29da595a4a690e0b6c786669924dd8151aa)), closes [#329](https://github.com/antvis/X6/issues/329)
* 🐛 version error ([5c80d69](https://github.com/antvis/X6/commit/5c80d69f66217e131176fce89b95d30bd47e3c4c))
* 🐛 version error ([fd57688](https://github.com/antvis/X6/commit/fd5768861fedda32d341c774f6e80da67646426f))
* 🐛 version not found ([8166346](https://github.com/antvis/X6/commit/8166346771f11ef5997a6e1ed376987408e57cde))
* 🐛 x6 version ([f2e01c4](https://github.com/antvis/X6/commit/f2e01c44a1f1acd9390c9de0b5ade913cfd8b03b))
* 🐛 x6-react-shape version ([9426a89](https://github.com/antvis/X6/commit/9426a898003f041c22da55439f6b9715731f69f6))
* 🐛 x6-react-shape version ([482ce10](https://github.com/antvis/X6/commit/482ce10f1daeee1a154757c6009295d03363df56))
* alert on lgtm.com ([31b713e](https://github.com/antvis/X6/commit/31b713eeaaeb05321c3d19b0df71892adfed11f6))
* alerts on lgtm.com ([0dbf4b5](https://github.com/antvis/X6/commit/0dbf4b56075ae7956207969b227379598c4b3a29))
* animation examples ([e439f5b](https://github.com/antvis/X6/commit/e439f5b2fa72fcca7a71f3495aa9df0b47a71aa4))
* cell's id are diff on cell's prop and cell's data ([1d9f91d](https://github.com/antvis/X6/commit/1d9f91da54209a9c2a6ec45af602c0277bb0e0d1)), closes [#178](https://github.com/antvis/X6/issues/178)
* circle deps ([f0b3314](https://github.com/antvis/X6/commit/f0b3314955a509bc7199f5eeb7e7270b6e22d4d3))
* deal with alerts on lgtm.com ([cd6556e](https://github.com/antvis/X6/commit/cd6556ef8ad66eb9fa37b3819e9a1c929f613b1d))
* demos ([7ae21d2](https://github.com/antvis/X6/commit/7ae21d24abd5ee17f26c9759383c76abe33cb1ab))
* do not set tabindex attr when keyboard is disabled ([613d25f](https://github.com/antvis/X6/commit/613d25f8a05e21f8b8ffb9a14a18ef3845f618a4))
* edge lost reference when update graph with the exported same json ([df5a605](https://github.com/antvis/X6/commit/df5a6053e9aa9fb4192f7a09a3c0ac54326239f0)), closes [#187](https://github.com/antvis/X6/issues/187)
* ensure cell's type when defined it ([a2cf40f](https://github.com/antvis/X6/commit/a2cf40f939bab349a80482b43e30a6b3aec49752))
* **events:** update event names ([0ad8013](https://github.com/antvis/X6/commit/0ad8013d04542a448e9f418ec57dfc8c6ae001c1))
* export layout methods ([1ab393a](https://github.com/antvis/X6/commit/1ab393a4d878730e45979f6f3896635442f88c50))
* fix contextmenu show multiple times ([5d437ce](https://github.com/antvis/X6/commit/5d437cef07427bf9f2cbae9b2e08dd4a6544ff70))
* fix demo import path error ([2ebf581](https://github.com/antvis/X6/commit/2ebf581dc1ec9c5ee4501917a7cbddbbb4b69c0f))
* fix examples ([3c4fe7b](https://github.com/antvis/X6/commit/3c4fe7b2a3cadb64e3b315f6651f771e4ac3c47c))
* fix examples after graph refactor ([8212ff4](https://github.com/antvis/X6/commit/8212ff459cde670b04ad1abb7fd38676180a9eac)), closes [#12](https://github.com/antvis/X6/issues/12)
* fix path error in custom router demo ([#620](https://github.com/antvis/X6/issues/620)) ([7cd3a7e](https://github.com/antvis/X6/commit/7cd3a7e57d772481ad33949ee832a36aab59ef3a))
* fix size invalid on image node ([#397](https://github.com/antvis/X6/issues/397)) ([438e192](https://github.com/antvis/X6/commit/438e192585095e3e17e4fe5c1360d1deeb81e488))
* fix warnings from lgtm.com ([580832e](https://github.com/antvis/X6/commit/580832eb9ca7f861fbeb1cc9fbeafda97d65b427))
* fix x6-react-shape typo 'getPovider' ([83be5e1](https://github.com/antvis/X6/commit/83be5e10eecc687a7d389c17141ebd49d6fcc7f2))
* graph examples ([23fb270](https://github.com/antvis/X6/commit/23fb27093f3870afaf500e960a53c1485ccca729))
* handle alert on lgtm.com ([1764317](https://github.com/antvis/X6/commit/1764317e429223eb6747a557edeb910c5ee72bad))
* highlighting ([9996342](https://github.com/antvis/X6/commit/99963423edec11cd63ddd2e25784301daea292f7))
* live preview connection ([157e0a8](https://github.com/antvis/X6/commit/157e0a8b200a6502d46f2cb18c6bf1a620f4d752))
* marker offset ([ed0fd14](https://github.com/antvis/X6/commit/ed0fd1437170d8688cbbffc3d9e5244efad1fa54)), closes [#184](https://github.com/antvis/X6/issues/184)
* refactor example ([#2831](https://github.com/antvis/X6/issues/2831)) ([3d8f005](https://github.com/antvis/X6/commit/3d8f005696021f1d9f91a96812ebadce179f2d73))
* registry context ([b44d699](https://github.com/antvis/X6/commit/b44d6994f6ad644185f70e5c691f909eea0ace72))
* remove background image demo ([5db9db0](https://github.com/antvis/X6/commit/5db9db060d993b8be442ced7083f418c503957be)), closes [#11](https://github.com/antvis/X6/issues/11)
* remove background image of container ([4c39e17](https://github.com/antvis/X6/commit/4c39e17ceb6e0a12afb324508f43c7c2713cc80f)), closes [#6](https://github.com/antvis/X6/issues/6)
* remove unused labelPadding style ([8d08ba9](https://github.com/antvis/X6/commit/8d08ba9b24d033d423d581a9cb3526d5da1350a4)), closes [#36](https://github.com/antvis/X6/issues/36)
* remove x6-common and x6-geometry deps ([#2830](https://github.com/antvis/X6/issues/2830)) ([5b5f5aa](https://github.com/antvis/X6/commit/5b5f5aa7ea6fded1b15abc79b9b5a5e2281b3ab9))
* render react component ([ad1fa2f](https://github.com/antvis/X6/commit/ad1fa2f0a4d00ee073b14e9f021fa880be6a4124))
* selection work only for cells ([6c80efe](https://github.com/antvis/X6/commit/6c80efea2c4a771edaf6189fec61fcfc4743ab0a))
* shoule handle `Delete` key in Windows ([5499014](https://github.com/antvis/X6/commit/549901402c15851e4aced51e01b5b69f54054294))
* snapline work with scroller ([fb159b6](https://github.com/antvis/X6/commit/fb159b6e257f4e0de5574d4a1cb296cebec7a6f8))
* support backgroundColor of grid or graph ([300cc7d](https://github.com/antvis/X6/commit/300cc7d5701cc8689898d7ff03960f9312a88873))
* update custom shapes ([f922640](https://github.com/antvis/X6/commit/f922640a6f6b144d589afbbdb70662a22f4228b2))
* update demo for minimap ([ca2b5d1](https://github.com/antvis/X6/commit/ca2b5d1c9b8521001877ea2269338e557614b068))
* update dependencies and fix type errors ([#1103](https://github.com/antvis/X6/issues/1103)) ([49d4371](https://github.com/antvis/X6/commit/49d43716ada672e609e4e6d9c6fdca3f494b6f68))
* update example after refactor ([40e7ded](https://github.com/antvis/X6/commit/40e7dedf4a22d3877c9bc7a5678d4d856b8d97d1))
* update example for react-shape ([af04b38](https://github.com/antvis/X6/commit/af04b38666852118feca6d582a9c5a5afbbb52e4))
* update examples ([f80942a](https://github.com/antvis/X6/commit/f80942ae3d7c54775d39f866e308e5e4e15e887a))
* update examples ([0dfc95f](https://github.com/antvis/X6/commit/0dfc95f1da9c10a8007fb725993dafd8f1fd22eb))
* usage of graph.render ([627a48b](https://github.com/antvis/X6/commit/627a48bf7ef2bb879e92156a3eb1d3620a044ebd))
* **wip:** 🐛 click event of contextmenu was not triggered ([2c9363e](https://github.com/antvis/X6/commit/2c9363e46904979901d4b467995d289c094d329a))


### chore

* release beta ([b5f3cfa](https://github.com/antvis/X6/commit/b5f3cfa2042f5196a995a38a8f41f140cabdce57))


### Features

* ✨ add 'loop' and 'loose' option for connecting ([cd8e997](https://github.com/antvis/X6/commit/cd8e997619603445998d6fb68d70120729d87c51)), closes [#390](https://github.com/antvis/X6/issues/390)
* ✨ add `primer` and `useForeignObject` option for react-shape ([ab6a06f](https://github.com/antvis/X6/commit/ab6a06f1fe70b71ae31acc47b0d9cb02c86097e2))
* ✨ add autoResize feature ([5aeae97](https://github.com/antvis/X6/commit/5aeae976cd7638b2b5c05bc12bc56b562366fe5f))
* ✨ add clipboard plugin ([8107f6d](https://github.com/antvis/X6/commit/8107f6df5de52a33e1b8094a44d59ee7fd2a8042))
* ✨ add connector demos ([2adb463](https://github.com/antvis/X6/commit/2adb4636621ffb7afa37a5c75a38ea005bc30a23))
* ✨ add dnd plugin ([269fae9](https://github.com/antvis/X6/commit/269fae9e5eeb969c6a7884373aa3a32002c064e6))
* ✨ add flowchart shapes ([a7c6477](https://github.com/antvis/X6/commit/a7c6477f5e71f3393fc09f87772f8a61486aaa8b))
* ✨ add history plugin ([#2819](https://github.com/antvis/X6/issues/2819)) ([fd8d384](https://github.com/antvis/X6/commit/fd8d384a29d0f2e02bf066efd19ed3f92614c524))
* ✨ add html shape ([8d75504](https://github.com/antvis/X6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ add keyboard plugin ([#2665](https://github.com/antvis/X6/issues/2665)) ([bf53677](https://github.com/antvis/X6/commit/bf536778ca7ee3229390dfcfcb085ec55edd9fb2))
* ✨ add library for manipulating and animating SVG ([c07a177](https://github.com/antvis/X6/commit/c07a17785fc99372baaa66ea2525acf1d332fa11))
* ✨ add loading for demo ([4c7f285](https://github.com/antvis/X6/commit/4c7f285412e0574709f230dd1109930b378418d9))
* ✨ add loop line ([8326e1c](https://github.com/antvis/X6/commit/8326e1ca90edc5d19c5122581d7ea4b4b7986789)), closes [#392](https://github.com/antvis/X6/issues/392)
* ✨ add minimap plugin ([6cdecbb](https://github.com/antvis/X6/commit/6cdecbbba9a4db1f67189e23fb89f2a7ba2af99e))
* ✨ add minScale and maxScale options for mousewheel ([e474ac3](https://github.com/antvis/X6/commit/e474ac3c6a7c224ab5e9a9039c7b419f91554891)), closes [#283](https://github.com/antvis/X6/issues/283) [#283](https://github.com/antvis/X6/issues/283)
* ✨ add panning and mousewheel module ([#2243](https://github.com/antvis/X6/issues/2243)) ([55d36e4](https://github.com/antvis/X6/commit/55d36e46808a4c79b086d7798bce396d5211a1dc))
* ✨ add scroller api ([12173bf](https://github.com/antvis/X6/commit/12173bf500624f197ed56cf6a797499587178cba))
* ✨ add selection plugin ([#2742](https://github.com/antvis/X6/issues/2742)) ([50a5dc7](https://github.com/antvis/X6/commit/50a5dc7cd8c2e39a1f8bf8359a0eb189dda8cb86))
* ✨ add snapline plugin ([294672b](https://github.com/antvis/X6/commit/294672b3066b15ab834ce2a3172facc49004c950))
* ✨ add some connecting option ([fb25aa5](https://github.com/antvis/X6/commit/fb25aa500d1554c15e9ade501523a5bbc07984ed))
* ✨ add some missing api ([1dcb3d9](https://github.com/antvis/X6/commit/1dcb3d92fd83e5dfd1a1af9670d539a99dd9f55a))
* ✨ add some ui events ([7781435](https://github.com/antvis/X6/commit/77814353097a96cc444d347f26309ce6ae8e7453)), closes [#275](https://github.com/antvis/X6/issues/275) [#273](https://github.com/antvis/X6/issues/273)
* ✨ add stencil plugin ([#2815](https://github.com/antvis/X6/issues/2815)) ([4e1fb7b](https://github.com/antvis/X6/commit/4e1fb7bef8ff5548edf2529eb27be0a66a600996))
* ✨ add switch demo with animation ([2c5399d](https://github.com/antvis/X6/commit/2c5399d97078c2cae27a7e61b2954834003b4711))
* ✨ add tool manage api on cell ([ebaee93](https://github.com/antvis/X6/commit/ebaee93eb294cacba4c82b55dfa34d90619677bf))
* ✨ add transform plugin ([#2818](https://github.com/antvis/X6/issues/2818)) ([660e2d7](https://github.com/antvis/X6/commit/660e2d7689bfa59a0f4a4a5e3c0ace70dec21e9e))
* ✨ add virtual render feature ([#2198](https://github.com/antvis/X6/issues/2198)) ([fcba5e1](https://github.com/antvis/X6/commit/fcba5e14808d44c80b658c090cc2a4ebcdc64f6d))
* ✨ add xmind demo ([adb2c98](https://github.com/antvis/X6/commit/adb2c98e23e93b7084fd20f05801f2595d4ac990))
* ✨ add zoomTo api ([c8241ef](https://github.com/antvis/X6/commit/c8241ef7740cff2d2bb4eef701db5b372badc051))
* ✨ angle measurement ([c435878](https://github.com/antvis/X6/commit/c435878c563047641bc9acb2a702c036fc9815a5))
* ✨ auto resize graph when container resized ([9c7bc9a](https://github.com/antvis/X6/commit/9c7bc9a4bb210451283663cd99a29bd6c79e2ec4)), closes [#531](https://github.com/antvis/X6/issues/531)
* ✨ collapsable tree ([491d151](https://github.com/antvis/X6/commit/491d151f1aab8fb28cf7789ee28ce0d767031f09))
* ✨ connect to scollable ports ([3d6de21](https://github.com/antvis/X6/commit/3d6de21d06dee68cfa85061b90ce1b4b3d44e1db))
* ✨ distance measurement ([9acc7a7](https://github.com/antvis/X6/commit/9acc7a77e1a0de1fbe02d6df2b70fb214f936c2e))
* ✨ dnd example ([1bf6d57](https://github.com/antvis/X6/commit/1bf6d5790878a2d741b16860861dccc0432c18c0))
* ✨ draw background on scroller when scroller's backgound is null ([da9aaf4](https://github.com/antvis/X6/commit/da9aaf47574e245b4b06856496a7da165cfc3eb9))
* ✨ export common and geometry in x6 package ([#2820](https://github.com/antvis/X6/issues/2820)) ([df28200](https://github.com/antvis/X6/commit/df282000cc5e17521147c77c210e172c444c9938))
* ✨ expose the selection api ([#2756](https://github.com/antvis/X6/issues/2756)) ([f3edbbc](https://github.com/antvis/X6/commit/f3edbbc95d2038a61116fa71bb0c3016f1c92d5e))
* ✨ get predecessors/successors by distance ([d18fde3](https://github.com/antvis/X6/commit/d18fde3746dd82f28b335bfa050201b76c5a31ae))
* ✨ group demo ([0d21b3a](https://github.com/antvis/X6/commit/0d21b3a1465a3fc4fdcffd80857a57d52f068b81))
* ✨ improve auto-resize feature ([40d5335](https://github.com/antvis/X6/commit/40d53355cedc0bbbeb1e26948b67254dc6a40d85))
* ✨ multi smooth edges ([44b3e95](https://github.com/antvis/X6/commit/44b3e95bf94d8c26d9c99aeed37d69067e104ebd))
* ✨ node and edge selection ([0622b0e](https://github.com/antvis/X6/commit/0622b0e17dcff22c33126e6551fe49e853a9f98f))
* ✨ node/edge move events ([67efad9](https://github.com/antvis/X6/commit/67efad9f9dac1657c0f04de15ca80c8fd50d395e))
* ✨ option of selecting cell on cell moved ([c68ffed](https://github.com/antvis/X6/commit/c68ffed8370029c2e2ce19a7d59a233ae6ffca8a))
* ✨ option of selecting cell on cell moved ([7c39f81](https://github.com/antvis/X6/commit/7c39f81603f7f767941bb3859dfa5e8621b91821))
* ✨ parse markup from xml string ([6ccdf65](https://github.com/antvis/X6/commit/6ccdf65061ceed0e346917294ceefd2efa3c92aa))
* ✨ passive event ([74fbaf5](https://github.com/antvis/X6/commit/74fbaf5eca8d7fc654b50f88e484e555784ba5fd))
* ✨ random path demo ([38ec683](https://github.com/antvis/X6/commit/38ec683673e2da64296521f23a91f951a442adc0))
* ✨ react table demo ([b353832](https://github.com/antvis/X6/commit/b353832b4f55007faa010df100210372e2bf494b))
* ✨ render html/react label ([f4e6c09](https://github.com/antvis/X6/commit/f4e6c096473dd3f2e93e8585503d0528f1b41f2a))
* ✨ select cell on start ([a2933d5](https://github.com/antvis/X6/commit/a2933d586ea5333f8ec7100ce37bde603d483b5d))
* ✨ start panning when mousedown on no-interactive node/edge ([7435c32](https://github.com/antvis/X6/commit/7435c32076da25aa6f60d8efc9c5f2e28f371149))
* ✨ support inherit options for react-shape registry ([#2596](https://github.com/antvis/X6/issues/2596)) ([ad63046](https://github.com/antvis/X6/commit/ad63046e89fa5853b0cf15947af1ed2a7b625188))
* ✨ support moving when selection box is disabled ([eacd3d0](https://github.com/antvis/X6/commit/eacd3d0aa2228308228a2bb81d23c9872d1a4261))
* ✨ support panning scroller graph byrightmousedown ([6ffdb50](https://github.com/antvis/X6/commit/6ffdb5004401b30ff5852a08de9286a934780be3))
* ✨ support react portal ([c20c0c4](https://github.com/antvis/X6/commit/c20c0c473ee311b12a09193bb43209f47e7363b9))
* ✨ ui event for final status ([9feaafb](https://github.com/antvis/X6/commit/9feaafbff6d10ea34186959591de0bda11416c66))
* ✨ 支持调节手柄,如圆柱,通过调节手柄修改圆柱椭圆面的大小 ([8f24a62](https://github.com/antvis/X6/commit/8f24a6216f9bb2967c648be12238a96215dd2f4b))
* add demo for tranform method ([2a585f4](https://github.com/antvis/X6/commit/2a585f4fde4044f0aa9d6f720bcc996c69401471))
* add example for group ([4d43adb](https://github.com/antvis/X6/commit/4d43adb3167c04627976293275197e90588e8bba))
* add scroller plugin ([#2580](https://github.com/antvis/X6/issues/2580)) ([5e0e2ac](https://github.com/antvis/X6/commit/5e0e2acde7d7e259ea27d001983e950878d0ecc8))
* **anchor:** simplify the creation of Anchor ([e703cfa](https://github.com/antvis/X6/commit/e703cfa2b57f96648e5afd2b38d9c7d0256c3deb)), closes [#28](https://github.com/antvis/X6/issues/28)
* cell view hooks ([ec584ac](https://github.com/antvis/X6/commit/ec584acc7f68d13173d69901764e74c9f4d163eb))
* custom render for react components ([eee8dca](https://github.com/antvis/X6/commit/eee8dca6bb161103dd19f82ef6747e13373dbf47))
* dnd and stencil ([8eb9877](https://github.com/antvis/X6/commit/8eb98770f96f8fb1f36990a8ee4a8fa285463587))
* **dnd:** update example for dnd ([e3451ea](https://github.com/antvis/X6/commit/e3451ead5fdcbe83f2c5c22cf4733ee99ca2eb96))
* dynamic update react node ([58539a4](https://github.com/antvis/X6/commit/58539a48ed461c717b8278d3088eb54608e2175f))
* er router ([89227ad](https://github.com/antvis/X6/commit/89227ad942f8e17051a47996dcbd6643aef1e076))
* example for basic shapes ([8d1cf6b](https://github.com/antvis/X6/commit/8d1cf6b468fedc19246af7dc85cacc5dc0aa042b))
* example for minimap ([dbd53f4](https://github.com/antvis/X6/commit/dbd53f43490f812335faa1925689832bb8630843))
* examples ([1afbdc9](https://github.com/antvis/X6/commit/1afbdc9243c50f09244c77771d55d4fd8778e1a8))
* examples for rendering react component with a shape ([b013dbe](https://github.com/antvis/X6/commit/b013dbe4c83ab1887aae7874a09f34793201b1f9))
* fix demo bug and optimize the x6-example-draw ([#224](https://github.com/antvis/X6/issues/224)) ([7a52c31](https://github.com/antvis/X6/commit/7a52c31da4429f5fdf8798ab8da5700ab875c068))
* flowchart render, dnd, settings ([0c95345](https://github.com/antvis/X6/commit/0c953455f89b45540e43b0f84e2303bc488fac3a))
* force release 2.0-beta ([6987d9c](https://github.com/antvis/X6/commit/6987d9ce64454cd76f697d33f96715dbdf56524a))
* generate random color ([afe58ac](https://github.com/antvis/X6/commit/afe58aca4bb01a7e66c9f5fdc436a31809e92cb4))
* infinite canvas example ([21c780a](https://github.com/antvis/X6/commit/21c780a5828ba742e5a38d9cca97a5a47cc5395f))
* infinite canvas example ([e048d91](https://github.com/antvis/X6/commit/e048d918da57d9c28dbb845db2616ecc597bc6c3))
* **label:** update examples that have labels ([49522f3](https://github.com/antvis/X6/commit/49522f3dc27495b79118ce8619493ce992776fda)), closes [#31](https://github.com/antvis/X6/issues/31)
* **minimap:** examples for minimap ([eed4b66](https://github.com/antvis/X6/commit/eed4b66f0b6308e770ce37aa0ce64f86b26f502f))
* prop hooks ([4c47b8d](https://github.com/antvis/X6/commit/4c47b8d3d1daea3642046b9a2ce03d55a83bfbe6))
* remove unused variable ([befefb4](https://github.com/antvis/X6/commit/befefb40709ab28a76942a37219908bde19a7437))
* render 400 shapes with react component ([1a89c01](https://github.com/antvis/X6/commit/1a89c0163703a9ee7d18b20afde2bc0c9bc2128e))
* research ([0325a0d](https://github.com/antvis/X6/commit/0325a0d9a9e65150bcd768a8f33fe45eadcedb52))
* support dropping cell into a group ([2b9348d](https://github.com/antvis/X6/commit/2b9348d0f6814090ed588bbf5ef255b4d9f7d1c5))
* support mouseenter and mouseleave event ([#2559](https://github.com/antvis/X6/issues/2559)) ([ecfd426](https://github.com/antvis/X6/commit/ecfd4263b1266a128bf8651c4dd745ff8ab038b3))
* support mousewheel zooming and keyboard shortcuts ([4146b04](https://github.com/antvis/X6/commit/4146b04aa344765a1b2463396b39d25c78bc71d3))
* support panning on normal graph ([#352](https://github.com/antvis/X6/issues/352)) ([5c55e11](https://github.com/antvis/X6/commit/5c55e11d4a4e2c920963f713ded7ad3da7f83231)), closes [#339](https://github.com/antvis/X6/issues/339)
* sync code from master ([#2004](https://github.com/antvis/X6/issues/2004)) ([c681405](https://github.com/antvis/X6/commit/c68140504bd21f654870f3d2fc1ad2f16f1113c8)), closes [#1974](https://github.com/antvis/X6/issues/1974) [#1977](https://github.com/antvis/X6/issues/1977) [#1985](https://github.com/antvis/X6/issues/1985) [#1988](https://github.com/antvis/X6/issues/1988) [#1991](https://github.com/antvis/X6/issues/1991) [#1989](https://github.com/antvis/X6/issues/1989)
* toJSON()导出画布功能ok ([a847ab8](https://github.com/antvis/X6/commit/a847ab8aa85aaf2861e51db79f6075279af84aad))
* tool registry and examples ([88a125a](https://github.com/antvis/X6/commit/88a125a1c1413ee3236bcd44f1e60def35177f90))
* update anchor examples ([9784add](https://github.com/antvis/X6/commit/9784add45ec4cfb39f85b5e84099047a28ff0b0e))
* update examples for [#10](https://github.com/antvis/X6/issues/10) ([0b89eb2](https://github.com/antvis/X6/commit/0b89eb2a153cb8fd109131f095724a7c089f5c5a))
* upgrade react to 18 in react-components ([#2836](https://github.com/antvis/X6/issues/2836)) ([5138562](https://github.com/antvis/X6/commit/5138562515ddbd3975adc9d93514f21d6fc2bb3e))
* 添加toJSON导出画布数据demo ([321e0ce](https://github.com/antvis/X6/commit/321e0ce10c9379a599f88febeb6b287b7d66d791))
* 用户编辑过程中动态生成的连线也可以被渲染 ([c09fdbd](https://github.com/antvis/X6/commit/c09fdbd09d81bd4278cc8d5b112efe491b32f110))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([ba5b22a](https://github.com/antvis/X6/commit/ba5b22a33a0af067d77735c5cc46a60a45734dca))
* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/X6/issues/1449)) ([0b5f241](https://github.com/antvis/X6/commit/0b5f2413f0b907316784149027615ae2d09616a4))
* ⚡️ add transition callbacks and events for animation lifecycle ([69db3cc](https://github.com/antvis/X6/commit/69db3cc8257fef6528a3ea70c78131bcdf0738ce)), closes [#419](https://github.com/antvis/X6/issues/419) [#420](https://github.com/antvis/X6/issues/420)
* ⚡️ check whether label existed in port ([#2063](https://github.com/antvis/X6/issues/2063)) ([5ae7271](https://github.com/antvis/X6/commit/5ae7271a25e804a9321aa80e31dcf6e43144728b))
* ⚡️ optimize breakText for a high performance version ([#2242](https://github.com/antvis/X6/issues/2242)) ([0aced58](https://github.com/antvis/X6/commit/0aced58056d908ec092bca1889b5ef367a94fe68))
* ⚡️ optimize node render performance ([6554959](https://github.com/antvis/X6/commit/65549599d2f82f8052d16776c8d36ce7ee2fba9b))
* ⚡️ repalce getTransformToElement and getBBox to improve performance ([#2177](https://github.com/antvis/X6/issues/2177)) ([1436586](https://github.com/antvis/X6/commit/1436586f85cc2e2f6ec71548f6d6c232be793154))
* ⚡️ restrict on resizing ([36107bf](https://github.com/antvis/X6/commit/36107bf81871b6ce083ae02bbd9ba72deb6aa9b8)), closes [#289](https://github.com/antvis/X6/issues/289)


### BREAKING CHANGES

* force release 2.0-beta
* 2.0-beta





### Dependencies

* **@antv/x6:** upgraded to 1.0.0
* **@antv/x6-plugin-clipboard:** upgraded to 1.0.0
* **@antv/x6-plugin-dnd:** upgraded to 1.0.0
* **@antv/x6-plugin-history:** upgraded to 1.0.0
* **@antv/x6-plugin-keyboard:** upgraded to 1.0.0
* **@antv/x6-plugin-minimap:** upgraded to 1.0.0
* **@antv/x6-plugin-scroller:** upgraded to 1.0.0
* **@antv/x6-plugin-selection:** upgraded to 1.0.0
* **@antv/x6-plugin-snapline:** upgraded to 1.0.0
* **@antv/x6-plugin-stencil:** upgraded to 1.0.0
* **@antv/x6-plugin-transform:** upgraded to 1.0.0
* **@antv/x6-plugin-export:** upgraded to 1.0.0
* **@antv/x6-react-components:** upgraded to 1.0.0
* **@antv/x6-react-shape:** upgraded to 1.0.0

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-03-10)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6:** upgraded to 1.30.2

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-03-07)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-02-26)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-02-26)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-02-23)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-02-21)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-02-21)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6:** upgraded to 1.30.1

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-02-20)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-02-12)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-02-08)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-02-08)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-02-08)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-22)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-22)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6:** upgraded to 1.30.0

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-14)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-13)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6:** upgraded to 1.29.6

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-12)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-11)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6-react-shape:** upgraded to 1.6.0

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-10)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6:** upgraded to 1.29.5

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-08)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6:** upgraded to 1.29.4

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-08)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6:** upgraded to 1.29.3

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-07)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-07)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2022-01-07)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6:** upgraded to 1.29.2

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-12-30)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-12-28)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-12-28)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-12-24)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6:** upgraded to 1.29.1

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-12-20)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-12-18)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6-vector:** upgraded to 1.3.0

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-12-17)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([cc01fdf](https://github.com/antvis/x6/commit/cc01fdf208f4fbd283a6ce3d7a106716e8e10300))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([4208846](https://github.com/antvis/x6/commit/4208846337326d8983f1662faa8da67efd8568b4))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))





### Dependencies

* **@antv/x6:** upgraded to 1.29.0
* **@antv/x6-vector:** upgraded to 1.3.0

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-11-08)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([65e6923](https://github.com/antvis/x6/commit/65e6923b99d48641542203b549d5703a6a1f4be3))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([4452563](https://github.com/antvis/x6/commit/4452563876a48fd90664c633e7e0e2debd750816))





### Dependencies

* **@antv/x6-vector:** upgraded to 1.2.4

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-11-08)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([65e6923](https://github.com/antvis/x6/commit/65e6923b99d48641542203b549d5703a6a1f4be3))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([4452563](https://github.com/antvis/x6/commit/4452563876a48fd90664c633e7e0e2debd750816))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-11-07)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([65e6923](https://github.com/antvis/x6/commit/65e6923b99d48641542203b549d5703a6a1f4be3))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([4452563](https://github.com/antvis/x6/commit/4452563876a48fd90664c633e7e0e2debd750816))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-11-05)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([65e6923](https://github.com/antvis/x6/commit/65e6923b99d48641542203b549d5703a6a1f4be3))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([4452563](https://github.com/antvis/x6/commit/4452563876a48fd90664c633e7e0e2debd750816))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-11-03)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([65e6923](https://github.com/antvis/x6/commit/65e6923b99d48641542203b549d5703a6a1f4be3))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([4452563](https://github.com/antvis/x6/commit/4452563876a48fd90664c633e7e0e2debd750816))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-11-01)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([65e6923](https://github.com/antvis/x6/commit/65e6923b99d48641542203b549d5703a6a1f4be3))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([4452563](https://github.com/antvis/x6/commit/4452563876a48fd90664c633e7e0e2debd750816))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-10-22)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([65e6923](https://github.com/antvis/x6/commit/65e6923b99d48641542203b549d5703a6a1f4be3))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([4452563](https://github.com/antvis/x6/commit/4452563876a48fd90664c633e7e0e2debd750816))





### Dependencies

* **@antv/x6-react-shape:** upgraded to 1.5.2

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-10-19)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([65e6923](https://github.com/antvis/x6/commit/65e6923b99d48641542203b549d5703a6a1f4be3))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-10-12)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([65e6923](https://github.com/antvis/x6/commit/65e6923b99d48641542203b549d5703a6a1f4be3))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-10-12)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))
* 🐛 update x6-react-shape version ([#1425](https://github.com/antvis/x6/issues/1425)) ([65e6923](https://github.com/antvis/x6/commit/65e6923b99d48641542203b549d5703a6a1f4be3))





### Dependencies

* **@antv/x6-react-shape:** upgraded to 1.5.1

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-10-08)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))





### Dependencies

* **@antv/x6:** upgraded to 1.28.1

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-10-02)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))





### Dependencies

* **@antv/x6:** upgraded to 1.28.0

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-10-02)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-10-01)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))





### Dependencies

* **@antv/x6:** upgraded to 1.27.2

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-10-01)


### Bug Fixes

* 🐛 optimize contextmenu tools ([#1391](https://github.com/antvis/x6/issues/1391)) ([4d0b1e8](https://github.com/antvis/x6/commit/4d0b1e8e413d2f9a8dec30ca48ca04e1a560a060))

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-10-01)

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-10-01)





### Dependencies

* **@antv/x6:** upgraded to 1.27.1

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-09-30)





### Dependencies

* **@antv/x6:** upgraded to 1.27.0

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-09-22)





### Dependencies

* **@antv/x6:** upgraded to 1.26.3
* **@antv/x6-vector:** upgraded to 1.2.3
* **@antv/x6-react-shape:** upgraded to 1.5.0

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-09-13)





### Dependencies

* **@antv/x6:** upgraded to 1.26.2
* **@antv/x6-vector:** upgraded to 1.2.3
* **@antv/x6-react-components:** upgraded to 1.1.14
* **@antv/x6-react-shape:** upgraded to 1.4.6

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-08-31)





### Dependencies

* **@antv/x6:** upgraded to 1.26.1

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-08-24)





### Dependencies

* **@antv/x6:** upgraded to 1.26.0

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-08-18)

## @antv/x6-example-features [1.2.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.2...@antv/x6-example-features@1.2.3) (2021-08-18)





### Dependencies

* **@antv/x6:** upgraded to 1.25.5

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-08-17)





### Dependencies

* **@antv/x6:** upgraded to 1.25.4

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-08-16)

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-08-06)





### Dependencies

* **@antv/x6:** upgraded to 1.25.3

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-08-06)





### Dependencies

* **@antv/x6:** upgraded to 1.25.2

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-08-03)





### Dependencies

* **@antv/x6:** upgraded to 1.25.1

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-07-27)





### Dependencies

* **@antv/x6:** upgraded to 1.25.0

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-07-22)





### Dependencies

* **@antv/x6:** upgraded to 1.24.8

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-07-21)





### Dependencies

* **@antv/x6:** upgraded to 1.24.7

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-07-21)





### Dependencies

* **@antv/x6:** upgraded to 1.24.6

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-07-10)

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-07-09)





### Dependencies

* **@antv/x6:** upgraded to 1.24.5

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-07-05)


### Bug Fixes

* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/x6/issues/1111)) ([a9256b0](https://github.com/antvis/x6/commit/a9256b03ddc64fa64ef5336542429f7b34dfce0f))





### Dependencies

* **@antv/x6-vector:** upgraded to 1.2.2

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-23)


### Bug Fixes

* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/x6/issues/1111)) ([a9256b0](https://github.com/antvis/x6/commit/a9256b03ddc64fa64ef5336542429f7b34dfce0f))

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-23)


### Bug Fixes

* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/x6/issues/1111)) ([a9256b0](https://github.com/antvis/x6/commit/a9256b03ddc64fa64ef5336542429f7b34dfce0f))





### Dependencies

* **@antv/x6:** upgraded to 1.24.4

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-22)


### Bug Fixes

* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/x6/issues/1111)) ([a9256b0](https://github.com/antvis/x6/commit/a9256b03ddc64fa64ef5336542429f7b34dfce0f))





### Dependencies

* **@antv/x6:** upgraded to 1.24.3

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-21)


### Bug Fixes

* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/x6/issues/1111)) ([a9256b0](https://github.com/antvis/x6/commit/a9256b03ddc64fa64ef5336542429f7b34dfce0f))





### Dependencies

* **@antv/x6-react-shape:** upgraded to 1.4.5

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-21)


### Bug Fixes

* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/x6/issues/1111)) ([a9256b0](https://github.com/antvis/x6/commit/a9256b03ddc64fa64ef5336542429f7b34dfce0f))





### Dependencies

* **@antv/x6:** upgraded to 1.24.2

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-21)


### Bug Fixes

* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/x6/issues/1111)) ([a9256b0](https://github.com/antvis/x6/commit/a9256b03ddc64fa64ef5336542429f7b34dfce0f))

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-21)


### Bug Fixes

* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/x6/issues/1111)) ([a9256b0](https://github.com/antvis/x6/commit/a9256b03ddc64fa64ef5336542429f7b34dfce0f))





### Dependencies

* **@antv/x6:** upgraded to 1.24.1

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-06-20)





### Dependencies

* **@antv/x6-react-shape:** upgraded to 1.4.4

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-19)


### Bug Fixes

* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/x6/issues/1111)) ([a9256b0](https://github.com/antvis/x6/commit/a9256b03ddc64fa64ef5336542429f7b34dfce0f))





### Dependencies

* **@antv/x6:** upgraded to 1.24.0

## @antv/x6-example-features [1.2.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.2.2) (2021-06-19)





### Dependencies

* **@antv/x6:** upgraded to 1.23.13

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-18)


### Bug Fixes

* 🐛 fix running error of x6-example-demo ([#1111](https://github.com/antvis/x6/issues/1111)) ([a9256b0](https://github.com/antvis/x6/commit/a9256b03ddc64fa64ef5336542429f7b34dfce0f))





### Dependencies

* **@antv/x6-vector:** upgraded to 1.2.1

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-17)





### Dependencies

* **@antv/x6-vector:** upgraded to 1.2.1

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-17)





### Dependencies

* **@antv/x6:** upgraded to 1.23.12

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-17)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 optimize cell remove method ([c6fd5da](https://github.com/antvis/x6/commit/c6fd5da9e5b8b89b3eff13f1026da0298ac397e9))
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* update dependencies and fix type errors ([#1103](https://github.com/antvis/x6/issues/1103)) ([056b862](https://github.com/antvis/x6/commit/056b862b4efe7dbdc559cac7194c2453996acc07))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.23.11
* **@antv/x6-vector:** upgraded to 1.2.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-16)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 optimize cell remove method ([c6fd5da](https://github.com/antvis/x6/commit/c6fd5da9e5b8b89b3eff13f1026da0298ac397e9))
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* update dependencies and fix type errors ([#1103](https://github.com/antvis/x6/issues/1103)) ([056b862](https://github.com/antvis/x6/commit/056b862b4efe7dbdc559cac7194c2453996acc07))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.23.10
* **@antv/x6-vector:** upgraded to 1.2.0
* **@antv/x6-react-components:** upgraded to 1.1.13
* **@antv/x6-react-shape:** upgraded to 1.4.3

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-15)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6-vector:** upgraded to 1.1.2

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-15)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.23.9
* **@antv/x6-vector:** upgraded to 1.1.1

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-13)





### Dependencies

* **@antv/x6:** upgraded to 1.23.8

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-11)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.23.7
* **@antv/x6-vector:** upgraded to 1.1.1
* **@antv/x6-react-components:** upgraded to 1.1.12
* **@antv/x6-react-shape:** upgraded to 1.4.2

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-06-09)





### Dependencies

* **@antv/x6:** upgraded to 1.23.6

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-09)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.23.5
* **@antv/x6-vector:** upgraded to 1.1.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-09)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.23.4
* **@antv/x6-vector:** upgraded to 1.1.0
* **@antv/x6-react-components:** upgraded to 1.1.11

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-07)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.23.3

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-07)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.23.2

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-02)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.23.1

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-02)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.23.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-06-01)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.22.1

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-31)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-31)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-31)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-30)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6-react-components:** upgraded to 1.1.10

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-30)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-30)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-27)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))
* ✨ support panning scroller graph byrightmousedown ([2ceca37](https://github.com/antvis/x6/commit/2ceca3724e792dc0247398bf8790909597c50f31))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.22.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-18)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.21.7

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-18)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.21.6

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-05-14)





### Dependencies

* **@antv/x6:** upgraded to 1.21.5

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-12)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.21.4

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-08)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.21.3

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-07)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.21.2

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-07)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.21.1

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-06)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.21.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-04)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.20.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-01)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.19.6

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-05-01)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.19.5

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-04-30)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 fix x6-react-components version in demo ([085ffab](https://github.com/antvis/x6/commit/085ffabe84e89e12bf47c3c8680c5cf1eb929593))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))


### Performance Improvements

* ⚡️ add getMatrixByElementAttr and getBBoxByElementAttr to reduce reflow ([a5a83d3](https://github.com/antvis/x6/commit/a5a83d341646fdc83b2e9a300010e5e60bc75831))
* ⚡️ optimize node render performance ([433d25f](https://github.com/antvis/x6/commit/433d25ff4a8cb6bab662f1a2317f59c1d41aa7bd))





### Dependencies

* **@antv/x6:** upgraded to 1.19.4
* **@antv/x6-react-shape:** upgraded to 1.4.1

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-04-30)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-04-30)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-04-28)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.19.3

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-04-28)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.19.2

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-04-28)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.19.1
* **@antv/x6-react-shape:** upgraded to 1.4.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-04-26)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.19.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-04-21)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-04-20)





### Dependencies

* **@antv/x6:** upgraded to 1.18.5

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-04-17)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.18.4

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-04-13)


### Bug Fixes

* 🐛 fix type error ([62a15bd](https://github.com/antvis/x6/commit/62a15bdf4929134eb87bfa736db1271be0a76613))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-04-13)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.18.3

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-04-01)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6-vector:** upgraded to 1.0.3
* **@antv/x6-react-components:** upgraded to 1.1.9

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-03-30)





### Dependencies

* **@antv/x6-vector:** upgraded to 1.0.3

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-30)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.18.2
* **@antv/x6-vector:** upgraded to 1.0.2
* **@antv/x6-react-components:** upgraded to 1.1.8
* **@antv/x6-react-shape:** upgraded to 1.3.5

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-30)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.18.1
* **@antv/x6-vector:** upgraded to 1.0.2
* **@antv/x6-react-components:** upgraded to 1.1.7

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-29)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6-react-components:** upgraded to 1.1.6
* **@antv/x6-react-shape:** upgraded to 1.3.4

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-28)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6-vector:** upgraded to 1.0.1

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-25)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6-vector:** upgraded to 1.0.1

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-24)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6-react-components:** upgraded to 1.1.5

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-24)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-24)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6-react-components:** upgraded to 1.1.4

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-24)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6-vector:** upgraded to 1.0.0
* **@antv/x6-react-components:** upgraded to 1.1.3
* **@antv/x6-react-shape:** upgraded to 1.3.3

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-23)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6-vector:** upgraded to 1.0.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-23)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.18.0
* **@antv/x6-vector:** upgraded to 1.0.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-23)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6-vector:** upgraded to 1.0.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-23)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add library for manipulating and animating SVG ([a67b4d2](https://github.com/antvis/x6/commit/a67b4d2e44395d9422664760afa0adaa2635813d))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.17.7
* **@antv/x6-vector:** upgraded to 1.0.0
* **@antv/x6-react-components:** upgraded to 1.1.2
* **@antv/x6-react-shape:** upgraded to 1.3.2

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-20)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 fix model event trigger twice ([#789](https://github.com/antvis/x6/issues/789)) ([5520bc3](https://github.com/antvis/x6/commit/5520bc38ab4106287e6591c73aff8c6f96f675da))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.17.6

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-19)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.17.5

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-19)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 set the async of minimapGraph to be the same as sourceGraph ([474d93c](https://github.com/antvis/x6/commit/474d93c9bc54cb469d75b72e6cd956c9671afcd2))
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.17.4

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-16)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-15)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-15)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-12)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-12)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-12)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 fix add tools not work ([191eab3](https://github.com/antvis/x6/commit/191eab3d02bdea32755009d865a2929a131cb9e2))
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.17.3

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-12)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.17.2

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-11)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.17.1

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-11)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.17.0

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-03-11)





### Dependencies

* **@antv/x6:** upgraded to 1.16.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-10)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.15.0

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-03-10)





### Dependencies

* **@antv/x6:** upgraded to 1.14.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-07)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-04)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-03)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.13.4

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-02)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.13.3

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-02)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-03-02)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ add xmind demo ([03078ea](https://github.com/antvis/x6/commit/03078ea435563ebbd154b22ec23ffc288f3f6f9f))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-23)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.13.1

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-23)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))





### Dependencies

* **@antv/x6:** upgraded to 1.13.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-22)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)
* ✨ random path demo ([1c3ff13](https://github.com/antvis/x6/commit/1c3ff13fc6a3c3cbdb478908e5596d8c067a6afd))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-20)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.32

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-09)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.31

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-07)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-07)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.30
* **@antv/x6-react-shape:** upgraded to 1.3.1

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-02-05)


### Bug Fixes

* fix demo import path error ([f7817cc](https://github.com/antvis/x6/commit/f7817cc2111ce3f6838e0658a9b777529a7015a7))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-05)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.29

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-05)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-04)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 do not update pagesize automatically when set graph size ([fcb5f11](https://github.com/antvis/x6/commit/fcb5f11195c9e0418091ad55bb684294b189979e)), closes [#644](https://github.com/antvis/x6/issues/644) [#564](https://github.com/antvis/x6/issues/564)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.28

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-03)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-03)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-03)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 do not generate new commands on redoing/undoing ([1696f51](https://github.com/antvis/x6/commit/1696f519056a2cd57189b19532a758b24af3fe2a)), closes [#627](https://github.com/antvis/x6/issues/627)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.27

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-02)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* 🐛 linear gradient along edge path ([39619d3](https://github.com/antvis/x6/commit/39619d3baaab1af79cb0d2ecc08bb8859ef44065)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 liner gradient not available on horizontal and vertical edges ([1817298](https://github.com/antvis/x6/commit/1817298f7788d0b5475cf53c516a0a9b177bfdd0)), closes [#635](https://github.com/antvis/x6/issues/635)
* 🐛 should render vertices tool with lowest z-index ([da9ddf5](https://github.com/antvis/x6/commit/da9ddf5f068f84fbe1b359aad459252d49feab34)), closes [#638](https://github.com/antvis/x6/issues/638)
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.26

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-02)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.25

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-02)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.24

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-02)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)
* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-02-01)


### Bug Fixes

* 🐛 break text with chinese characters(double byte character) ([7f37319](https://github.com/antvis/x6/commit/7f373194d9a3722aab403319aa2a843a00a18825)), closes [#596](https://github.com/antvis/x6/issues/596)





### Dependencies

* **@antv/x6:** upgraded to 1.12.23

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-01)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.22

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-02-01)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-31)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-31)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.21

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-30)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* fix contextmenu show multiple times ([50ef056](https://github.com/antvis/x6/commit/50ef0562b0036dbfa43ed7ffbff1fade2f06d272))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-30)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* fix path error in custom router demo ([#620](https://github.com/antvis/x6/issues/620)) ([15c1e05](https://github.com/antvis/x6/commit/15c1e05d56e38d2c3f456845ed81e21375e67e22))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-30)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-29)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.20

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-28)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.19

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-27)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.18

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-26)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([eca8186](https://github.com/antvis/x6/commit/eca818687662a5f84a6300944819220853bc1964))
* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6-react-shape:** upgraded to 1.3.0

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-26)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.17

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-01-25)





### Dependencies

* **@antv/x6:** upgraded to 1.12.16

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-25)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.15

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-25)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-24)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.14

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-01-23)





### Dependencies

* **@antv/x6:** upgraded to 1.12.13

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-23)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.12

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-22)


### Bug Fixes

* 🐛 interact with input rendered in react component ([6eaec74](https://github.com/antvis/x6/commit/6eaec7412dd9826b331fc4bfb822e874ace939e1))
* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.11
* **@antv/x6-react-shape:** upgraded to 1.2.5

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-22)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-22)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.10

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-22)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.9

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-21)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.8

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-21)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-01-21)





### Dependencies

* **@antv/x6:** upgraded to 1.12.7

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-21)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.6

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-21)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.5

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-20)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.4

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-20)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.3

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-20)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.2

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-19)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-19)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-18)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-15)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2021-01-14)


### Bug Fixes

* **wip:** 🐛 click event of contextmenu was not triggered ([fc3ff9e](https://github.com/antvis/x6/commit/fc3ff9e38de9b051bfed9043f70920d870b3b9f9))

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-14)


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.1

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-13)


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.2.0) (2021-01-13)


### Features

* ✨ auto resize graph when container resized ([ff6e2b6](https://github.com/antvis/x6/commit/ff6e2b63bce78992cdb1892c84d7bf2ce6c2bbc3)), closes [#531](https://github.com/antvis/x6/issues/531)





### Dependencies

* **@antv/x6:** upgraded to 1.12.0

## @antv/x6-example-features [1.1.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.1.3) (2021-01-13)





### Dependencies

* **@antv/x6:** upgraded to 1.11.6

## @antv/x6-example-features [1.1.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.0...@antv/x6-example-features@1.1.1) (2021-01-13)





### Dependencies

* **@antv/x6:** upgraded to 1.8.3
* **@antv/x6-react-components:** upgraded to 1.0.3
* **@antv/x6-react-shape:** upgraded to 1.2.2

# @antv/x6-example-features [1.1.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.0...@antv/x6-example-features@1.1.0) (2021-01-12)


### Bug Fixes

* 🐛 auto rotate token ([cc08ee0](https://github.com/antvis/x6/commit/cc08ee0e897e561d744a4ba3f160164f7433b7d9))
* 🐛 change component -> render ([b90c519](https://github.com/antvis/x6/commit/b90c519c98a5adf81f111fb3ea1d8781ce7996bc))
* 🐛 change rerender -> shouldComponentUpdate ([79672e9](https://github.com/antvis/x6/commit/79672e9e097b99d4339ddb5f6fba0dafa2c648f3))
* 🐛 dnd node style ([17ae1f9](https://github.com/antvis/x6/commit/17ae1f9492c1f77e93ffa0a4cc1fb10614350547))
* 🐛 do not trigger getDropNode when drop at invalid area ([503fe7c](https://github.com/antvis/x6/commit/503fe7c3cfb3a069dc1a112f75251bd03220f407))
* 🐛 filter not working when select cell by calling `select()` api or by click ([#314](https://github.com/antvis/x6/issues/314)) ([7a3e547](https://github.com/antvis/x6/commit/7a3e54731940f5dcc2a15b8d338aedf64fc63619)), closes [#305](https://github.com/antvis/x6/issues/305)
* 🐛 fix sourceMarker and targetMaker position ([d637cf6](https://github.com/antvis/x6/commit/d637cf649e0b149acdf9dee12e6561e3b4f76b17))
* 🐛 fix type definition of node and edge registry ([d2742a4](https://github.com/antvis/x6/commit/d2742a4a8a473e60bc47fe099fd49c27e0c2d9ae)), closes [#478](https://github.com/antvis/x6/issues/478)
* 🐛 get completed picture when execue toPNG ([6dc50e9](https://github.com/antvis/x6/commit/6dc50e91d94fae0da2bc35a056e6410cb94d07be))
* 🐛 modifer key of panning and selecting ([2b7b871](https://github.com/antvis/x6/commit/2b7b87196693f6eb50851a4327f3d9bdc944beff))
* 🐛 modifier keys of panning and selecting ([dc97368](https://github.com/antvis/x6/commit/dc97368b52b8810f095e2bf1f771736841e8feed))
* 🐛 node:xxx event was not triggered when interact with selection boxes ([34cd5a0](https://github.com/antvis/x6/commit/34cd5a0737b291357d398b8ef2f5c58b113a1fc3)), closes [#297](https://github.com/antvis/x6/issues/297)
* 🐛 optimize params for edge:connected event ([55a72d0](https://github.com/antvis/x6/commit/55a72d0a0dd20d328576db9b81f7be5385ede29e))
* 🐛 registry ([0464e5e](https://github.com/antvis/x6/commit/0464e5ea7c7feb8a340dd8e48104696343afbdc0))
* 🐛 registry ([7487cd4](https://github.com/antvis/x6/commit/7487cd478482748fb5fea05806474c9a622f9a2f))
* 🐛 registry ([26fbbc3](https://github.com/antvis/x6/commit/26fbbc3b868650a7f908d0e097c33bb2c9f2370f))
* 🐛 registry ([e30583a](https://github.com/antvis/x6/commit/e30583a65102fc297db882e393b4f96e9ff924cf))
* 🐛 remove default points attr of polygon and polyline ([ccab7a2](https://github.com/antvis/x6/commit/ccab7a2a1c30955239891149d1c1e9250160bbe5)), closes [#304](https://github.com/antvis/x6/issues/304) [#304](https://github.com/antvis/x6/issues/304)
* 🐛 reset dragging status ([e1d9fe5](https://github.com/antvis/x6/commit/e1d9fe5e0a9503be4e62c759ef5364d5b4b29856))
* 🐛 should auto normalize path data when parse path from string ([7441c38](https://github.com/antvis/x6/commit/7441c383336ecb148311f318075517806619941e))
* 🐛 should auto remove tools on cell was removed ([5f455f0](https://github.com/antvis/x6/commit/5f455f0cc1ff51b555ab00066ac694221537ed40)), closes [#383](https://github.com/antvis/x6/issues/383)
* 🐛 should auto remove tools when removing cells ([064a059](https://github.com/antvis/x6/commit/064a059daf009b5e37a80c2a7277d620ff2a70d1))
* 🐛 should return `stop` method when calling `sendToken` ([21276b2](https://github.com/antvis/x6/commit/21276b2a0f396b8e8343f133fed9383142468f5d))
* 🐛 should stop dragging when validate node async ([d418e07](https://github.com/antvis/x6/commit/d418e07ef404881400faf03943c8c9ff067e4598)), closes [#429](https://github.com/antvis/x6/issues/429)
* 🐛 take the stroke-width into account when calc connection point ([b21cac6](https://github.com/antvis/x6/commit/b21cac6968a548cad17c185a4219f24d135eaa8a))
* 🐛 unselect cell by clicking cell and holding on the meta key ([41624d6](https://github.com/antvis/x6/commit/41624d6591e57274cad49a0c77032c5ce7380cb9))
* 🐛 use `graph.createNode` to create node ([9e38fdf](https://github.com/antvis/x6/commit/9e38fdf1b1f04bedf1d029037ed1a43a33fcfa15))
* 🐛 used in unpkg "Uncaught ReferenceError: module is not defined" ([2863a29](https://github.com/antvis/x6/commit/2863a29da595a4a690e0b6c786669924dd8151aa)), closes [#329](https://github.com/antvis/x6/issues/329)
* fix size invalid on image node ([#397](https://github.com/antvis/x6/issues/397)) ([15fd567](https://github.com/antvis/x6/commit/15fd5673e13825a94bd05ffb4f892645ee20e887))


### Features

* ✨ add 'loop' and 'loose' option for connecting ([bbc41d4](https://github.com/antvis/x6/commit/bbc41d48294398053e77da161f2d0e7f0602f905)), closes [#390](https://github.com/antvis/x6/issues/390)
* ✨ add connector demos ([929b691](https://github.com/antvis/x6/commit/929b6913dfd2637844ed4c133c8cb30efc2d4177))
* ✨ add flowchart shapes ([92430a2](https://github.com/antvis/x6/commit/92430a2efd41076af65da527f6e9c5093003154e))
* ✨ add loop line ([bfa3c67](https://github.com/antvis/x6/commit/bfa3c6743b42c22d64edfbf79f82913129a5a285)), closes [#392](https://github.com/antvis/x6/issues/392)
* ✨ add some connecting option ([68f7965](https://github.com/antvis/x6/commit/68f7965699b36d6a46f25e6aba5d144fb086c9a0))
* ✨ add switch demo with animation ([84042ef](https://github.com/antvis/x6/commit/84042efb16168e44268e6993289df51fb2a4ef49))
* ✨ angle measurement ([c777712](https://github.com/antvis/x6/commit/c7777120b0b332c618972b3683804ad108464a69))
* ✨ connect to scollable ports ([cf76c31](https://github.com/antvis/x6/commit/cf76c3183407399838ddca4a48d5a62a265b06b4))
* ✨ distance measurement ([ede8f75](https://github.com/antvis/x6/commit/ede8f755ef40c37f6b0b851fcb32a135dd59fb20))
* ✨ parse markup from xml string ([f16e7eb](https://github.com/antvis/x6/commit/f16e7eb38ca1f0dec71f51cd41b74341fc1a0f3d))
* ✨ react table demo ([3c2d10a](https://github.com/antvis/x6/commit/3c2d10acc0c8f2bf403def7aa1b44ef3769dc248))
* ✨ 支持调节手柄,如圆柱,通过调节手柄修改圆柱椭圆面的大小 ([6ae70b8](https://github.com/antvis/x6/commit/6ae70b809e85db4d537e9104830eef1328c16f7a))
* add demo for tranform method ([a599300](https://github.com/antvis/x6/commit/a599300536751c3f4a360bdae36258e5014cf137))
* support panning on normal graph ([#352](https://github.com/antvis/x6/issues/352)) ([7a50f7a](https://github.com/antvis/x6/commit/7a50f7aace64f0a657943195e5ef6b3fd7a46fbf)), closes [#339](https://github.com/antvis/x6/issues/339)


### Performance Improvements

* ⚡️ add transition callbacks and events for animation lifecycle ([462abd0](https://github.com/antvis/x6/commit/462abd0aa06e28bbbabf96ffd0493af4a9af6e1a)), closes [#419](https://github.com/antvis/x6/issues/419) [#420](https://github.com/antvis/x6/issues/420)
* ⚡️ restrict on resizing ([36107bf](https://github.com/antvis/x6/commit/36107bf81871b6ce083ae02bbd9ba72deb6aa9b8)), closes [#289](https://github.com/antvis/x6/issues/289)





### Dependencies

* **@antv/x6:** upgraded to 1.8.2
* **@antv/x6-react-components:** upgraded to 1.0.2
* **@antv/x6-react-shape:** upgraded to 1.2.1

## @antv/x6-example-features [1.1.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.0...@antv/x6-example-features@1.1.1) (2021-01-12)





### Dependencies

* **@antv/x6:** upgraded to 1.8.1

# @antv/x6-example-features [1.1.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.0...@antv/x6-example-features@1.1.0) (2021-01-11)


### Bug Fixes

* 🐛 auto rotate token ([cc08ee0](https://github.com/antvis/x6/commit/cc08ee0e897e561d744a4ba3f160164f7433b7d9))
* 🐛 change component -> render ([b90c519](https://github.com/antvis/x6/commit/b90c519c98a5adf81f111fb3ea1d8781ce7996bc))
* 🐛 change rerender -> shouldComponentUpdate ([79672e9](https://github.com/antvis/x6/commit/79672e9e097b99d4339ddb5f6fba0dafa2c648f3))
* 🐛 dnd node style ([17ae1f9](https://github.com/antvis/x6/commit/17ae1f9492c1f77e93ffa0a4cc1fb10614350547))
* 🐛 do not trigger getDropNode when drop at invalid area ([503fe7c](https://github.com/antvis/x6/commit/503fe7c3cfb3a069dc1a112f75251bd03220f407))
* 🐛 filter not working when select cell by calling `select()` api or by click ([#314](https://github.com/antvis/x6/issues/314)) ([7a3e547](https://github.com/antvis/x6/commit/7a3e54731940f5dcc2a15b8d338aedf64fc63619)), closes [#305](https://github.com/antvis/x6/issues/305)
* 🐛 fix sourceMarker and targetMaker position ([d637cf6](https://github.com/antvis/x6/commit/d637cf649e0b149acdf9dee12e6561e3b4f76b17))
* 🐛 fix type definition of node and edge registry ([d2742a4](https://github.com/antvis/x6/commit/d2742a4a8a473e60bc47fe099fd49c27e0c2d9ae)), closes [#478](https://github.com/antvis/x6/issues/478)
* 🐛 get completed picture when execue toPNG ([6dc50e9](https://github.com/antvis/x6/commit/6dc50e91d94fae0da2bc35a056e6410cb94d07be))
* 🐛 modifer key of panning and selecting ([2b7b871](https://github.com/antvis/x6/commit/2b7b87196693f6eb50851a4327f3d9bdc944beff))
* 🐛 modifier keys of panning and selecting ([dc97368](https://github.com/antvis/x6/commit/dc97368b52b8810f095e2bf1f771736841e8feed))
* 🐛 node:xxx event was not triggered when interact with selection boxes ([34cd5a0](https://github.com/antvis/x6/commit/34cd5a0737b291357d398b8ef2f5c58b113a1fc3)), closes [#297](https://github.com/antvis/x6/issues/297)
* 🐛 optimize params for edge:connected event ([55a72d0](https://github.com/antvis/x6/commit/55a72d0a0dd20d328576db9b81f7be5385ede29e))
* 🐛 registry ([0464e5e](https://github.com/antvis/x6/commit/0464e5ea7c7feb8a340dd8e48104696343afbdc0))
* 🐛 registry ([7487cd4](https://github.com/antvis/x6/commit/7487cd478482748fb5fea05806474c9a622f9a2f))
* 🐛 registry ([26fbbc3](https://github.com/antvis/x6/commit/26fbbc3b868650a7f908d0e097c33bb2c9f2370f))
* 🐛 registry ([e30583a](https://github.com/antvis/x6/commit/e30583a65102fc297db882e393b4f96e9ff924cf))
* 🐛 remove default points attr of polygon and polyline ([ccab7a2](https://github.com/antvis/x6/commit/ccab7a2a1c30955239891149d1c1e9250160bbe5)), closes [#304](https://github.com/antvis/x6/issues/304) [#304](https://github.com/antvis/x6/issues/304)
* 🐛 reset dragging status ([e1d9fe5](https://github.com/antvis/x6/commit/e1d9fe5e0a9503be4e62c759ef5364d5b4b29856))
* 🐛 should auto normalize path data when parse path from string ([7441c38](https://github.com/antvis/x6/commit/7441c383336ecb148311f318075517806619941e))
* 🐛 should auto remove tools on cell was removed ([5f455f0](https://github.com/antvis/x6/commit/5f455f0cc1ff51b555ab00066ac694221537ed40)), closes [#383](https://github.com/antvis/x6/issues/383)
* 🐛 should auto remove tools when removing cells ([064a059](https://github.com/antvis/x6/commit/064a059daf009b5e37a80c2a7277d620ff2a70d1))
* 🐛 should return `stop` method when calling `sendToken` ([21276b2](https://github.com/antvis/x6/commit/21276b2a0f396b8e8343f133fed9383142468f5d))
* 🐛 should stop dragging when validate node async ([d418e07](https://github.com/antvis/x6/commit/d418e07ef404881400faf03943c8c9ff067e4598)), closes [#429](https://github.com/antvis/x6/issues/429)
* 🐛 take the stroke-width into account when calc connection point ([b21cac6](https://github.com/antvis/x6/commit/b21cac6968a548cad17c185a4219f24d135eaa8a))
* 🐛 unselect cell by clicking cell and holding on the meta key ([41624d6](https://github.com/antvis/x6/commit/41624d6591e57274cad49a0c77032c5ce7380cb9))
* 🐛 use `graph.createNode` to create node ([9e38fdf](https://github.com/antvis/x6/commit/9e38fdf1b1f04bedf1d029037ed1a43a33fcfa15))
* 🐛 used in unpkg "Uncaught ReferenceError: module is not defined" ([2863a29](https://github.com/antvis/x6/commit/2863a29da595a4a690e0b6c786669924dd8151aa)), closes [#329](https://github.com/antvis/x6/issues/329)
* fix size invalid on image node ([#397](https://github.com/antvis/x6/issues/397)) ([15fd567](https://github.com/antvis/x6/commit/15fd5673e13825a94bd05ffb4f892645ee20e887))


### Features

* ✨ add 'loop' and 'loose' option for connecting ([bbc41d4](https://github.com/antvis/x6/commit/bbc41d48294398053e77da161f2d0e7f0602f905)), closes [#390](https://github.com/antvis/x6/issues/390)
* ✨ add connector demos ([929b691](https://github.com/antvis/x6/commit/929b6913dfd2637844ed4c133c8cb30efc2d4177))
* ✨ add flowchart shapes ([92430a2](https://github.com/antvis/x6/commit/92430a2efd41076af65da527f6e9c5093003154e))
* ✨ add loop line ([bfa3c67](https://github.com/antvis/x6/commit/bfa3c6743b42c22d64edfbf79f82913129a5a285)), closes [#392](https://github.com/antvis/x6/issues/392)
* ✨ add some connecting option ([68f7965](https://github.com/antvis/x6/commit/68f7965699b36d6a46f25e6aba5d144fb086c9a0))
* ✨ add switch demo with animation ([84042ef](https://github.com/antvis/x6/commit/84042efb16168e44268e6993289df51fb2a4ef49))
* ✨ angle measurement ([c777712](https://github.com/antvis/x6/commit/c7777120b0b332c618972b3683804ad108464a69))
* ✨ connect to scollable ports ([cf76c31](https://github.com/antvis/x6/commit/cf76c3183407399838ddca4a48d5a62a265b06b4))
* ✨ distance measurement ([ede8f75](https://github.com/antvis/x6/commit/ede8f755ef40c37f6b0b851fcb32a135dd59fb20))
* ✨ parse markup from xml string ([f16e7eb](https://github.com/antvis/x6/commit/f16e7eb38ca1f0dec71f51cd41b74341fc1a0f3d))
* ✨ react table demo ([3c2d10a](https://github.com/antvis/x6/commit/3c2d10acc0c8f2bf403def7aa1b44ef3769dc248))
* ✨ 支持调节手柄,如圆柱,通过调节手柄修改圆柱椭圆面的大小 ([6ae70b8](https://github.com/antvis/x6/commit/6ae70b809e85db4d537e9104830eef1328c16f7a))
* add demo for tranform method ([a599300](https://github.com/antvis/x6/commit/a599300536751c3f4a360bdae36258e5014cf137))
* support panning on normal graph ([#352](https://github.com/antvis/x6/issues/352)) ([7a50f7a](https://github.com/antvis/x6/commit/7a50f7aace64f0a657943195e5ef6b3fd7a46fbf)), closes [#339](https://github.com/antvis/x6/issues/339)


### Performance Improvements

* ⚡️ add transition callbacks and events for animation lifecycle ([462abd0](https://github.com/antvis/x6/commit/462abd0aa06e28bbbabf96ffd0493af4a9af6e1a)), closes [#419](https://github.com/antvis/x6/issues/419) [#420](https://github.com/antvis/x6/issues/420)
* ⚡️ restrict on resizing ([36107bf](https://github.com/antvis/x6/commit/36107bf81871b6ce083ae02bbd9ba72deb6aa9b8)), closes [#289](https://github.com/antvis/x6/issues/289)





### Dependencies

* **@antv/x6:** upgraded to 1.8.0
* **@antv/x6-react-components:** upgraded to 1.0.1
* **@antv/x6-react-shape:** upgraded to 1.2.0

## @antv/x6-example-features [1.12.5](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.12.4...@antv/x6-example-features@1.12.5) (2021-01-11)





### Dependencies

* **@antv/x6:** upgraded to 1.11.2

## @antv/x6-example-features [1.12.4](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.12.3...@antv/x6-example-features@1.12.4) (2021-01-11)





### Dependencies

* **@antv/x6:** upgraded to 1.11.1
* **@antv/x6-react-shape:** upgraded to 1.2.2

## @antv/x6-example-features [1.12.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.12.2...@antv/x6-example-features@1.12.3) (2021-01-08)





### Dependencies

* **@antv/x6:** upgraded to 1.11.0
* **@antv/x6-react-shape:** upgraded to 1.2.1

## @antv/x6-example-features [1.12.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.12.1...@antv/x6-example-features@1.12.2) (2021-01-08)





### Dependencies

* **@antv/x6:** upgraded to 1.10.2
* **@antv/x6-react-shape:** upgraded to 1.2.0

## @antv/x6-example-features [1.12.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.12.0...@antv/x6-example-features@1.12.1) (2021-01-08)





### Dependencies

* **@antv/x6:** upgraded to 1.10.1
* **@antv/x6-react-shape:** upgraded to 1.1.60

# @antv/x6-example-features [1.12.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.11.3...@antv/x6-example-features@1.12.0) (2021-01-08)


### Features

* ✨ add flowchart shapes ([92430a2](https://github.com/antvis/x6/commit/92430a2efd41076af65da527f6e9c5093003154e))





### Dependencies

* **@antv/x6:** upgraded to 1.10.0
* **@antv/x6-react-shape:** upgraded to 1.1.59

## @antv/x6-example-features [1.11.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.11.2...@antv/x6-example-features@1.11.3) (2021-01-05)





### Dependencies

* **@antv/x6:** upgraded to 1.9.3
* **@antv/x6-react-shape:** upgraded to 1.1.58

## @antv/x6-example-features [1.11.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.11.1...@antv/x6-example-features@1.11.2) (2021-01-05)





### Dependencies

* **@antv/x6:** upgraded to 1.9.2
* **@antv/x6-react-shape:** upgraded to 1.1.57

## @antv/x6-example-features [1.11.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.11.0...@antv/x6-example-features@1.11.1) (2021-01-05)





### Dependencies

* **@antv/x6:** upgraded to 1.9.1
* **@antv/x6-react-shape:** upgraded to 1.1.56

# @antv/x6-example-features [1.11.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.15...@antv/x6-example-features@1.11.0) (2021-01-04)


### Features

* ✨ 支持调节手柄,如圆柱,通过调节手柄修改圆柱椭圆面的大小 ([6ae70b8](https://github.com/antvis/x6/commit/6ae70b809e85db4d537e9104830eef1328c16f7a))





### Dependencies

* **@antv/x6:** upgraded to 1.9.0
* **@antv/x6-react-shape:** upgraded to 1.1.55

## @antv/x6-example-features [1.10.15](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.14...@antv/x6-example-features@1.10.15) (2021-01-04)





### Dependencies

* **@antv/x6:** upgraded to 1.8.0
* **@antv/x6-react-shape:** upgraded to 1.1.54

## @antv/x6-example-features [1.10.14](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.13...@antv/x6-example-features@1.10.14) (2021-01-04)





### Dependencies

* **@antv/x6-react-shape:** upgraded to 1.1.53

## @antv/x6-example-features [1.10.13](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.12...@antv/x6-example-features@1.10.13) (2020-12-31)


### Bug Fixes

* 🐛 get completed picture when execue toPNG ([6dc50e9](https://github.com/antvis/x6/commit/6dc50e91d94fae0da2bc35a056e6410cb94d07be))





### Dependencies

* **@antv/x6:** upgraded to 1.7.12
* **@antv/x6-react-shape:** upgraded to 1.1.52

## @antv/x6-example-features [1.10.12](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.11...@antv/x6-example-features@1.10.12) (2020-12-30)





### Dependencies

* **@antv/x6:** upgraded to 1.7.11
* **@antv/x6-react-shape:** upgraded to 1.1.51

## @antv/x6-example-features [1.10.11](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.10...@antv/x6-example-features@1.10.11) (2020-12-29)





### Dependencies

* **@antv/x6:** upgraded to 1.7.10
* **@antv/x6-react-shape:** upgraded to 1.1.50

## @antv/x6-example-features [1.10.10](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.9...@antv/x6-example-features@1.10.10) (2020-12-29)


### Bug Fixes

* 🐛 fix type definition of node and edge registry ([d2742a4](https://github.com/antvis/x6/commit/d2742a4a8a473e60bc47fe099fd49c27e0c2d9ae)), closes [#478](https://github.com/antvis/x6/issues/478)





### Dependencies

* **@antv/x6:** upgraded to 1.7.9
* **@antv/x6-react-shape:** upgraded to 1.1.49

## @antv/x6-example-features [1.10.9](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.8...@antv/x6-example-features@1.10.9) (2020-12-28)





### Dependencies

* **@antv/x6:** upgraded to 1.7.8
* **@antv/x6-react-shape:** upgraded to 1.1.48

## @antv/x6-example-features [1.10.8](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.7...@antv/x6-example-features@1.10.8) (2020-12-28)





### Dependencies

* **@antv/x6-react-components:** upgraded to 1.0.4

## @antv/x6-example-features [1.10.7](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.6...@antv/x6-example-features@1.10.7) (2020-12-26)





### Dependencies

* **@antv/x6:** upgraded to 1.7.7
* **@antv/x6-react-shape:** upgraded to 1.1.47

## @antv/x6-example-features [1.10.6](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.5...@antv/x6-example-features@1.10.6) (2020-12-25)





### Dependencies

* **@antv/x6:** upgraded to 1.7.6
* **@antv/x6-react-shape:** upgraded to 1.1.46

## @antv/x6-example-features [1.10.5](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.4...@antv/x6-example-features@1.10.5) (2020-12-25)





### Dependencies

* **@antv/x6:** upgraded to 1.7.5
* **@antv/x6-react-shape:** upgraded to 1.1.45

## @antv/x6-example-features [1.10.4](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.3...@antv/x6-example-features@1.10.4) (2020-12-24)


### Bug Fixes

* 🐛 change component -> render ([b90c519](https://github.com/antvis/x6/commit/b90c519c98a5adf81f111fb3ea1d8781ce7996bc))
* 🐛 change rerender -> shouldComponentUpdate ([79672e9](https://github.com/antvis/x6/commit/79672e9e097b99d4339ddb5f6fba0dafa2c648f3))





### Dependencies

* **@antv/x6:** upgraded to 1.7.4
* **@antv/x6-react-shape:** upgraded to 1.1.44

## @antv/x6-example-features [1.10.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.2...@antv/x6-example-features@1.10.3) (2020-12-24)





### Dependencies

* **@antv/x6:** upgraded to 1.7.3
* **@antv/x6-react-shape:** upgraded to 1.1.43

## @antv/x6-example-features [1.10.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.1...@antv/x6-example-features@1.10.2) (2020-12-24)


### Bug Fixes

* 🐛 reset dragging status ([e1d9fe5](https://github.com/antvis/x6/commit/e1d9fe5e0a9503be4e62c759ef5364d5b4b29856))





### Dependencies

* **@antv/x6:** upgraded to 1.7.2
* **@antv/x6-react-shape:** upgraded to 1.1.42

## @antv/x6-example-features [1.10.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.10.0...@antv/x6-example-features@1.10.1) (2020-12-24)





### Dependencies

* **@antv/x6:** upgraded to 1.7.1
* **@antv/x6-react-shape:** upgraded to 1.1.41

# @antv/x6-example-features [1.10.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.9.4...@antv/x6-example-features@1.10.0) (2020-12-24)


### Features

* ✨ parse markup from xml string ([f16e7eb](https://github.com/antvis/x6/commit/f16e7eb38ca1f0dec71f51cd41b74341fc1a0f3d))





### Dependencies

* **@antv/x6:** upgraded to 1.7.0
* **@antv/x6-react-shape:** upgraded to 1.1.40

## @antv/x6-example-features [1.9.4](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.9.3...@antv/x6-example-features@1.9.4) (2020-12-23)





### Dependencies

* **@antv/x6:** upgraded to 1.6.4
* **@antv/x6-react-shape:** upgraded to 1.1.39

## @antv/x6-example-features [1.9.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.9.2...@antv/x6-example-features@1.9.3) (2020-12-22)





### Dependencies

* **@antv/x6:** upgraded to 1.6.3
* **@antv/x6-react-shape:** upgraded to 1.1.38

## @antv/x6-example-features [1.9.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.9.1...@antv/x6-example-features@1.9.2) (2020-12-22)


### Bug Fixes

* 🐛 fix sourceMarker and targetMaker position ([d637cf6](https://github.com/antvis/x6/commit/d637cf649e0b149acdf9dee12e6561e3b4f76b17))





### Dependencies

* **@antv/x6:** upgraded to 1.6.2
* **@antv/x6-react-shape:** upgraded to 1.1.37

## @antv/x6-example-features [1.9.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.9.0...@antv/x6-example-features@1.9.1) (2020-12-21)





### Dependencies

* **@antv/x6:** upgraded to 1.6.1
* **@antv/x6-react-components:** upgraded to 1.0.3
* **@antv/x6-react-shape:** upgraded to 1.1.36

# @antv/x6-example-features [1.9.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.8.6...@antv/x6-example-features@1.9.0) (2020-12-21)


### Features

* ✨ add 'loop' and 'loose' option for connecting ([bbc41d4](https://github.com/antvis/x6/commit/bbc41d48294398053e77da161f2d0e7f0602f905)), closes [#390](https://github.com/antvis/x6/issues/390)
* ✨ add some connecting option ([68f7965](https://github.com/antvis/x6/commit/68f7965699b36d6a46f25e6aba5d144fb086c9a0))





### Dependencies

* **@antv/x6:** upgraded to 1.6.0
* **@antv/x6-react-shape:** upgraded to 1.1.35

## @antv/x6-example-features [1.8.6](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.8.5...@antv/x6-example-features@1.8.6) (2020-12-18)


### Bug Fixes

* 🐛 take the stroke-width into account when calc connection point ([b21cac6](https://github.com/antvis/x6/commit/b21cac6968a548cad17c185a4219f24d135eaa8a))





### Dependencies

* **@antv/x6:** upgraded to 1.5.2
* **@antv/x6-react-shape:** upgraded to 1.1.34

## @antv/x6-example-features [1.8.5](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.8.4...@antv/x6-example-features@1.8.5) (2020-12-17)


### Bug Fixes

* 🐛 should stop dragging when validate node async ([d418e07](https://github.com/antvis/x6/commit/d418e07ef404881400faf03943c8c9ff067e4598)), closes [#429](https://github.com/antvis/x6/issues/429)





### Dependencies

* **@antv/x6:** upgraded to 1.5.1
* **@antv/x6-react-shape:** upgraded to 1.1.33

## @antv/x6-example-features [1.8.4](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.8.3...@antv/x6-example-features@1.8.4) (2020-12-17)


### Bug Fixes

* 🐛 should return `stop` method when calling `sendToken` ([21276b2](https://github.com/antvis/x6/commit/21276b2a0f396b8e8343f133fed9383142468f5d))


### Performance Improvements

* ⚡️ add transition callbacks and events for animation lifecycle ([462abd0](https://github.com/antvis/x6/commit/462abd0aa06e28bbbabf96ffd0493af4a9af6e1a)), closes [#419](https://github.com/antvis/x6/issues/419) [#420](https://github.com/antvis/x6/issues/420)





### Dependencies

* **@antv/x6:** upgraded to 1.5.0
* **@antv/x6-react-shape:** upgraded to 1.1.32

## @antv/x6-example-features [1.8.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.8.2...@antv/x6-example-features@1.8.3) (2020-12-17)


### Bug Fixes

* 🐛 dnd node style ([17ae1f9](https://github.com/antvis/x6/commit/17ae1f9492c1f77e93ffa0a4cc1fb10614350547))
* 🐛 use `graph.createNode` to create node ([9e38fdf](https://github.com/antvis/x6/commit/9e38fdf1b1f04bedf1d029037ed1a43a33fcfa15))

## @antv/x6-example-features [1.8.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.8.1...@antv/x6-example-features@1.8.2) (2020-12-16)





### Dependencies

* **@antv/x6:** upgraded to 1.4.2
* **@antv/x6-react-shape:** upgraded to 1.1.31

## @antv/x6-example-features [1.8.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.8.0...@antv/x6-example-features@1.8.1) (2020-12-16)





### Dependencies

* **@antv/x6:** upgraded to 1.4.1
* **@antv/x6-react-shape:** upgraded to 1.1.30

# @antv/x6-example-features [1.8.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.7.3...@antv/x6-example-features@1.8.0) (2020-12-16)


### Bug Fixes

* 🐛 should auto normalize path data when parse path from string ([7441c38](https://github.com/antvis/x6/commit/7441c383336ecb148311f318075517806619941e))


### Features

* ✨ add loop line ([bfa3c67](https://github.com/antvis/x6/commit/bfa3c6743b42c22d64edfbf79f82913129a5a285)), closes [#392](https://github.com/antvis/x6/issues/392)





### Dependencies

* **@antv/x6:** upgraded to 1.4.0
* **@antv/x6-react-shape:** upgraded to 1.1.29

## @antv/x6-example-features [1.7.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.7.2...@antv/x6-example-features@1.7.3) (2020-12-13)





### Dependencies

* **@antv/x6-react-components:** upgraded to 1.0.2

## @antv/x6-example-features [1.7.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.7.1...@antv/x6-example-features@1.7.2) (2020-12-12)


### Bug Fixes

* fix size invalid on image node ([#397](https://github.com/antvis/x6/issues/397)) ([15fd567](https://github.com/antvis/x6/commit/15fd5673e13825a94bd05ffb4f892645ee20e887))





### Dependencies

* **@antv/x6:** upgraded to 1.3.20
* **@antv/x6-react-shape:** upgraded to 1.1.28

## @antv/x6-example-features [1.7.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.7.0...@antv/x6-example-features@1.7.1) (2020-12-11)





### Dependencies

* **@antv/x6:** upgraded to 1.3.19
* **@antv/x6-react-shape:** upgraded to 1.1.27

# @antv/x6-example-features [1.7.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.6.0...@antv/x6-example-features@1.7.0) (2020-12-11)


### Features

* ✨ distance measurement ([ede8f75](https://github.com/antvis/x6/commit/ede8f755ef40c37f6b0b851fcb32a135dd59fb20))





### Dependencies

* **@antv/x6:** upgraded to 1.3.18
* **@antv/x6-react-shape:** upgraded to 1.1.26

# @antv/x6-example-features [1.6.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.16...@antv/x6-example-features@1.6.0) (2020-12-10)


### Features

* ✨ angle measurement ([c777712](https://github.com/antvis/x6/commit/c7777120b0b332c618972b3683804ad108464a69))





### Dependencies

* **@antv/x6:** upgraded to 1.3.17
* **@antv/x6-react-shape:** upgraded to 1.1.25

## @antv/x6-example-features [1.5.16](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.15...@antv/x6-example-features@1.5.16) (2020-12-10)





### Dependencies

* **@antv/x6:** upgraded to 1.3.16
* **@antv/x6-react-shape:** upgraded to 1.1.24

## @antv/x6-example-features [1.5.15](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.14...@antv/x6-example-features@1.5.15) (2020-12-09)





### Dependencies

* **@antv/x6:** upgraded to 1.3.15
* **@antv/x6-react-shape:** upgraded to 1.1.23

## @antv/x6-example-features [1.5.14](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.13...@antv/x6-example-features@1.5.14) (2020-12-09)


### Bug Fixes

* 🐛 modifier keys of panning and selecting ([dc97368](https://github.com/antvis/x6/commit/dc97368b52b8810f095e2bf1f771736841e8feed))





### Dependencies

* **@antv/x6:** upgraded to 1.3.14
* **@antv/x6-react-shape:** upgraded to 1.1.22

## @antv/x6-example-features [1.5.13](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.12...@antv/x6-example-features@1.5.13) (2020-12-09)





### Dependencies

* **@antv/x6:** upgraded to 1.3.13
* **@antv/x6-react-shape:** upgraded to 1.1.21

## @antv/x6-example-features [1.5.12](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.11...@antv/x6-example-features@1.5.12) (2020-12-09)


### Bug Fixes

* 🐛 modifer key of panning and selecting ([2b7b871](https://github.com/antvis/x6/commit/2b7b87196693f6eb50851a4327f3d9bdc944beff))





### Dependencies

* **@antv/x6:** upgraded to 1.3.12
* **@antv/x6-react-shape:** upgraded to 1.1.20

## @antv/x6-example-features [1.5.11](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.10...@antv/x6-example-features@1.5.11) (2020-12-09)





### Dependencies

* **@antv/x6:** upgraded to 1.3.11
* **@antv/x6-react-shape:** upgraded to 1.1.19

## @antv/x6-example-features [1.5.10](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.9...@antv/x6-example-features@1.5.10) (2020-12-08)





### Dependencies

* **@antv/x6:** upgraded to 1.3.10
* **@antv/x6-react-shape:** upgraded to 1.1.18

## @antv/x6-example-features [1.5.9](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.8...@antv/x6-example-features@1.5.9) (2020-12-08)


### Bug Fixes

* 🐛 should auto remove tools on cell was removed ([5f455f0](https://github.com/antvis/x6/commit/5f455f0cc1ff51b555ab00066ac694221537ed40)), closes [#383](https://github.com/antvis/x6/issues/383)





### Dependencies

* **@antv/x6:** upgraded to 1.3.9
* **@antv/x6-react-shape:** upgraded to 1.1.17

## @antv/x6-example-features [1.5.8](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.7...@antv/x6-example-features@1.5.8) (2020-12-08)


### Bug Fixes

* 🐛 should auto remove tools when removing cells ([064a059](https://github.com/antvis/x6/commit/064a059daf009b5e37a80c2a7277d620ff2a70d1))





### Dependencies

* **@antv/x6:** upgraded to 1.3.8
* **@antv/x6-react-shape:** upgraded to 1.1.16

## @antv/x6-example-features [1.5.7](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.6...@antv/x6-example-features@1.5.7) (2020-12-08)





### Dependencies

* **@antv/x6:** upgraded to 1.3.7
* **@antv/x6-react-shape:** upgraded to 1.1.15

## @antv/x6-example-features [1.5.6](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.5...@antv/x6-example-features@1.5.6) (2020-12-07)


### Bug Fixes

* 🐛 registry ([0464e5e](https://github.com/antvis/x6/commit/0464e5ea7c7feb8a340dd8e48104696343afbdc0))
* 🐛 registry ([7487cd4](https://github.com/antvis/x6/commit/7487cd478482748fb5fea05806474c9a622f9a2f))





### Dependencies

* **@antv/x6:** upgraded to 1.3.6
* **@antv/x6-react-shape:** upgraded to 1.1.14

## @antv/x6-example-features [1.5.5](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.4...@antv/x6-example-features@1.5.5) (2020-12-07)


### Bug Fixes

* 🐛 registry ([26fbbc3](https://github.com/antvis/x6/commit/26fbbc3b868650a7f908d0e097c33bb2c9f2370f))
* 🐛 registry ([e30583a](https://github.com/antvis/x6/commit/e30583a65102fc297db882e393b4f96e9ff924cf))
* 🐛 unselect cell by clicking cell and holding on the meta key ([41624d6](https://github.com/antvis/x6/commit/41624d6591e57274cad49a0c77032c5ce7380cb9))





### Dependencies

* **@antv/x6:** upgraded to 1.3.5
* **@antv/x6-react-shape:** upgraded to 1.1.13

## @antv/x6-example-features [1.5.4](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.3...@antv/x6-example-features@1.5.4) (2020-12-07)





### Dependencies

* **@antv/x6:** upgraded to 1.3.4
* **@antv/x6-react-components:** upgraded to 1.0.1
* **@antv/x6-react-shape:** upgraded to 1.1.12

## @antv/x6-example-features [1.5.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.2...@antv/x6-example-features@1.5.3) (2020-12-07)


### Bug Fixes

* 🐛 do not trigger getDropNode when drop at invalid area ([503fe7c](https://github.com/antvis/x6/commit/503fe7c3cfb3a069dc1a112f75251bd03220f407))





### Dependencies

* **@antv/x6:** upgraded to 1.3.3
* **@antv/x6-react-shape:** upgraded to 1.1.11

## @antv/x6-example-features [1.5.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.1...@antv/x6-example-features@1.5.2) (2020-12-07)





### Dependencies

* **@antv/x6:** upgraded to 1.3.2
* **@antv/x6-react-shape:** upgraded to 1.1.10

## @antv/x6-example-features [1.5.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.5.0...@antv/x6-example-features@1.5.1) (2020-12-07)





### Dependencies

* **@antv/x6:** upgraded to 1.3.1
* **@antv/x6-react-shape:** upgraded to 1.1.9

# @antv/x6-example-features [1.5.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.4.1...@antv/x6-example-features@1.5.0) (2020-12-07)


### Bug Fixes

* 🐛 auto rotate token ([cc08ee0](https://github.com/antvis/x6/commit/cc08ee0e897e561d744a4ba3f160164f7433b7d9))


### Features

* add demo for tranform method ([a599300](https://github.com/antvis/x6/commit/a599300536751c3f4a360bdae36258e5014cf137))





### Dependencies

* **@antv/x6:** upgraded to 1.3.0
* **@antv/x6-react-shape:** upgraded to 1.1.8

## @antv/x6-example-features [1.4.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.4.0...@antv/x6-example-features@1.4.1) (2020-12-04)





### Dependencies

* **@antv/x6:** upgraded to 1.2.3
* **@antv/x6-react-shape:** upgraded to 1.1.7

# @antv/x6-example-features [1.4.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.3.1...@antv/x6-example-features@1.4.0) (2020-12-04)


### Features

* ✨ connect to scollable ports ([cf76c31](https://github.com/antvis/x6/commit/cf76c3183407399838ddca4a48d5a62a265b06b4))





### Dependencies

* **@antv/x6:** upgraded to 1.2.2
* **@antv/x6-react-shape:** upgraded to 1.1.6

## @antv/x6-example-features [1.3.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.3.0...@antv/x6-example-features@1.3.1) (2020-12-04)





### Dependencies

* **@antv/x6:** upgraded to 1.2.1
* **@antv/x6-react-shape:** upgraded to 1.1.5

# @antv/x6-example-features [1.3.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.1...@antv/x6-example-features@1.3.0) (2020-12-02)


### Features

* support panning on normal graph ([#352](https://github.com/antvis/x6/issues/352)) ([7a50f7a](https://github.com/antvis/x6/commit/7a50f7aace64f0a657943195e5ef6b3fd7a46fbf)), closes [#339](https://github.com/antvis/x6/issues/339)





### Dependencies

* **@antv/x6:** upgraded to 1.2.0
* **@antv/x6-react-shape:** upgraded to 1.1.4

## @antv/x6-example-features [1.2.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.2.0...@antv/x6-example-features@1.2.1) (2020-12-02)





### Dependencies

* **@antv/x6:** upgraded to 1.1.3
* **@antv/x6-react-shape:** upgraded to 1.1.3

# @antv/x6-example-features [1.2.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.3...@antv/x6-example-features@1.2.0) (2020-12-02)


### Bug Fixes

* 🐛 optimize params for edge:connected event ([55a72d0](https://github.com/antvis/x6/commit/55a72d0a0dd20d328576db9b81f7be5385ede29e))


### Features

* ✨ add connector demos ([929b691](https://github.com/antvis/x6/commit/929b6913dfd2637844ed4c133c8cb30efc2d4177))
* ✨ react table demo ([3c2d10a](https://github.com/antvis/x6/commit/3c2d10acc0c8f2bf403def7aa1b44ef3769dc248))





### Dependencies

* **@antv/x6:** upgraded to 1.1.2
* **@antv/x6-react-shape:** upgraded to 1.1.2

## @antv/x6-example-features [1.1.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.2...@antv/x6-example-features@1.1.3) (2020-11-30)


### Bug Fixes

* 🐛 optimize params for edge:connected event ([20aca93](https://github.com/antvis/x6/commit/20aca935635c3acaadd7beef28fea65e14e1bf9b))





### Dependencies

* **@antv/x6:** upgraded to 1.1.1
* **@antv/x6-react-shape:** upgraded to 1.1.1

## @antv/x6-example-features [1.1.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.1...@antv/x6-example-features@1.1.2) (2020-11-27)





### Dependencies

* **@antv/x6:** upgraded to 1.1.0
* **@antv/x6-react-shape:** upgraded to 1.1.0

## @antv/x6-example-features [1.1.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.1.0...@antv/x6-example-features@1.1.1) (2020-11-27)





### Dependencies

* **@antv/x6:** upgraded to 1.0.9
* **@antv/x6-react-shape:** upgraded to 1.0.9

# @antv/x6-example-features [1.1.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.10...@antv/x6-example-features@1.1.0) (2020-11-25)


### Features

* ✨ add switch demo with animation ([84042ef](https://github.com/antvis/x6/commit/84042efb16168e44268e6993289df51fb2a4ef49))





### Dependencies

* **@antv/x6:** upgraded to 1.0.8
* **@antv/x6-react-shape:** upgraded to 1.0.8

## @antv/x6-example-features [1.0.10](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.9...@antv/x6-example-features@1.0.10) (2020-11-25)


### Bug Fixes

* 🐛 used in unpkg "Uncaught ReferenceError: module is not defined" ([2863a29](https://github.com/antvis/x6/commit/2863a29da595a4a690e0b6c786669924dd8151aa)), closes [#329](https://github.com/antvis/x6/issues/329)





### Dependencies

* **@antv/x6:** upgraded to 1.0.7
* **@antv/x6-react-shape:** upgraded to 1.0.7

## @antv/x6-example-features [1.0.9](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.8...@antv/x6-example-features@1.0.9) (2020-11-24)





### Dependencies

* **@antv/x6:** upgraded to 1.0.6
* **@antv/x6-react-shape:** upgraded to 1.0.6

## @antv/x6-example-features [1.0.8](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.7...@antv/x6-example-features@1.0.8) (2020-11-24)





### Dependencies

* **@antv/x6:** upgraded to 1.0.5
* **@antv/x6-react-shape:** upgraded to 1.0.5

## @antv/x6-example-features [1.0.7](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.6...@antv/x6-example-features@1.0.7) (2020-11-24)


### Bug Fixes

* 🐛 node:xxx event was not triggered when interact with selection boxes ([34cd5a0](https://github.com/antvis/x6/commit/34cd5a0737b291357d398b8ef2f5c58b113a1fc3)), closes [#297](https://github.com/antvis/x6/issues/297)





### Dependencies

* **@antv/x6:** upgraded to 1.0.4
* **@antv/x6-react-shape:** upgraded to 1.0.4

## @antv/x6-example-features [1.0.6](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.5...@antv/x6-example-features@1.0.6) (2020-11-20)





### Dependencies

* **@antv/x6:** upgraded to 1.0.3
* **@antv/x6-react-shape:** upgraded to 1.0.3

## @antv/x6-example-features [1.0.5](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.4...@antv/x6-example-features@1.0.5) (2020-11-19)


### Bug Fixes

* 🐛 filter not working when select cell by calling `select()` api or by click ([#314](https://github.com/antvis/x6/issues/314)) ([7a3e547](https://github.com/antvis/x6/commit/7a3e54731940f5dcc2a15b8d338aedf64fc63619)), closes [#305](https://github.com/antvis/x6/issues/305)





### Dependencies

* **@antv/x6:** upgraded to 1.0.2
* **@antv/x6-react-shape:** upgraded to 1.0.2

## @antv/x6-example-features [1.0.4](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.3...@antv/x6-example-features@1.0.4) (2020-11-19)

## @antv/x6-example-features [1.0.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.2...@antv/x6-example-features@1.0.3) (2020-11-19)

## @antv/x6-example-features [1.0.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.1...@antv/x6-example-features@1.0.2) (2020-11-18)

## @antv/x6-example-features [1.0.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.0...@antv/x6-example-features@1.0.1) (2020-11-18)


### Bug Fixes

* 🐛 remove default points attr of polygon and polyline ([ccab7a2](https://github.com/antvis/x6/commit/ccab7a2a1c30955239891149d1c1e9250160bbe5)), closes [#304](https://github.com/antvis/x6/issues/304) [#304](https://github.com/antvis/x6/issues/304)


### Performance Improvements

* ⚡️ restrict on resizing ([36107bf](https://github.com/antvis/x6/commit/36107bf81871b6ce083ae02bbd9ba72deb6aa9b8)), closes [#289](https://github.com/antvis/x6/issues/289)





### Dependencies

* **@antv/x6:** upgraded to 1.0.1
* **@antv/x6-react-shape:** upgraded to 1.0.1

## @antv/x6-example-features [0.12.8](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.12.7...@antv/x6-example-features@0.12.8) (2020-11-17)


### Bug Fixes

* 🐛 version error ([fd57688](https://github.com/antvis/x6/commit/fd5768861fedda32d341c774f6e80da67646426f))
* 🐛 version not found ([8166346](https://github.com/antvis/x6/commit/8166346771f11ef5997a6e1ed376987408e57cde))
* 🐛 x6 version ([f2e01c4](https://github.com/antvis/x6/commit/f2e01c44a1f1acd9390c9de0b5ade913cfd8b03b))
* 🐛 x6-react-shape version ([9426a89](https://github.com/antvis/x6/commit/9426a898003f041c22da55439f6b9715731f69f6))
* 🐛 x6-react-shape version ([482ce10](https://github.com/antvis/x6/commit/482ce10f1daeee1a154757c6009295d03363df56))





### Dependencies

* **@antv/x6:** upgraded to 0.13.7
* **@antv/x6-react-components:** upgraded to 0.10.20
* **@antv/x6-react-shape:** upgraded to 0.10.35

# @antv/x6-example-features [1.0.0-beta.5](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.0-beta.4...@antv/x6-example-features@1.0.0-beta.5) (2020-11-17)


### Bug Fixes

* 🐛 dnd events ([3e94b0b](https://github.com/antvis/x6/commit/3e94b0b1eafab8f43cff2601b088df24d1b062a4)), closes [#271](https://github.com/antvis/x6/issues/271)


### Features

* ✨ add minScale and maxScale options for mousewheel ([e474ac3](https://github.com/antvis/x6/commit/e474ac3c6a7c224ab5e9a9039c7b419f91554891)), closes [#283](https://github.com/antvis/x6/issues/283) [#283](https://github.com/antvis/x6/issues/283)
* ✨ add some ui events ([7781435](https://github.com/antvis/x6/commit/77814353097a96cc444d347f26309ce6ae8e7453)), closes [#275](https://github.com/antvis/x6/issues/275) [#273](https://github.com/antvis/x6/issues/273)
* ✨ node/edge move events ([67efad9](https://github.com/antvis/x6/commit/67efad9f9dac1657c0f04de15ca80c8fd50d395e))





### Dependencies

* **@antv/x6:** upgraded to 1.0.0-beta.5
* **@antv/x6-react-components:** upgraded to 0.10.20-beta.1
* **@antv/x6-react-shape:** upgraded to 1.0.0-beta.5

# @antv/x6-example-features [1.0.0-beta.4](https://github.com/antvis/x6/compare/@antv/x6-example-features@1.0.0-beta.3...@antv/x6-example-features@1.0.0-beta.4) (2020-11-05)
## @antv/x6-example-features [0.12.7](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.12.6...@antv/x6-example-features@0.12.7) (2020-11-17)





### Dependencies

* **@antv/x6:** upgraded to 0.13.6
* **@antv/x6-react-shape:** upgraded to 0.10.34

## @antv/x6-example-features [0.12.6](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.12.5...@antv/x6-example-features@0.12.6) (2020-11-17)





### Dependencies

* **@antv/x6:** upgraded to 0.13.5
* **@antv/x6-react-shape:** upgraded to 0.10.33

## @antv/x6-example-features [0.12.5](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.12.4...@antv/x6-example-features@0.12.5) (2020-11-13)





### Dependencies

* **@antv/x6:** upgraded to 0.13.4
* **@antv/x6-react-shape:** upgraded to 0.10.32

## @antv/x6-example-features [0.12.4](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.12.3...@antv/x6-example-features@0.12.4) (2020-11-12)





### Dependencies

* **@antv/x6:** upgraded to 0.13.3
* **@antv/x6-react-shape:** upgraded to 0.10.31

## @antv/x6-example-features [0.12.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.12.2...@antv/x6-example-features@0.12.3) (2020-11-12)





### Dependencies

* **@antv/x6:** upgraded to 0.13.2
* **@antv/x6-react-shape:** upgraded to 0.10.30

## @antv/x6-example-features [0.12.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.12.1...@antv/x6-example-features@0.12.2) (2020-11-11)





### Dependencies

* **@antv/x6:** upgraded to 0.13.1
* **@antv/x6-react-shape:** upgraded to 0.10.29

## @antv/x6-example-features [0.12.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.12.0...@antv/x6-example-features@0.12.1) (2020-11-10)





### Dependencies

* **@antv/x6-react-components:** upgraded to 0.10.19

# @antv/x6-example-features [0.12.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.11.4...@antv/x6-example-features@0.12.0) (2020-11-10)


### Features

* ✨ add minScale and maxScale options for mousewheel ([e474ac3](https://github.com/antvis/x6/commit/e474ac3c6a7c224ab5e9a9039c7b419f91554891)), closes [#283](https://github.com/antvis/x6/issues/283) [#283](https://github.com/antvis/x6/issues/283)





### Dependencies

* **@antv/x6:** upgraded to 0.13.0
* **@antv/x6-react-shape:** upgraded to 0.10.28

## @antv/x6-example-features [0.11.4](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.11.3...@antv/x6-example-features@0.11.4) (2020-11-10)





### Dependencies

* **@antv/x6:** upgraded to 0.12.1
* **@antv/x6-react-shape:** upgraded to 0.10.27

## @antv/x6-example-features [0.11.3](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.11.2...@antv/x6-example-features@0.11.3) (2020-11-09)





### Dependencies

* **@antv/x6:** upgraded to 0.12.0
* **@antv/x6-react-shape:** upgraded to 0.10.26

## @antv/x6-example-features [0.11.2](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.11.1...@antv/x6-example-features@0.11.2) (2020-11-09)





### Dependencies

* **@antv/x6:** upgraded to 0.11.2
* **@antv/x6-react-components:** upgraded to 0.10.18
* **@antv/x6-react-shape:** upgraded to 0.10.25

## @antv/x6-example-features [0.11.1](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.11.0...@antv/x6-example-features@0.11.1) (2020-11-09)





### Dependencies

* **@antv/x6:** upgraded to 0.11.1
* **@antv/x6-react-shape:** upgraded to 0.10.24

# @antv/x6-example-features [0.11.0](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.10.83...@antv/x6-example-features@0.11.0) (2020-11-09)


### Features

* ✨ add some ui events ([7781435](https://github.com/antvis/x6/commit/77814353097a96cc444d347f26309ce6ae8e7453)), closes [#275](https://github.com/antvis/x6/issues/275) [#273](https://github.com/antvis/x6/issues/273)
* ✨ node/edge move events ([67efad9](https://github.com/antvis/x6/commit/67efad9f9dac1657c0f04de15ca80c8fd50d395e))





### Dependencies

* **@antv/x6:** upgraded to 0.11.0
* **@antv/x6-react-shape:** upgraded to 0.10.23

## @antv/x6-example-features [0.10.83](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.10.82...@antv/x6-example-features@0.10.83) (2020-11-09)





### Dependencies

* **@antv/x6:** upgraded to 0.10.81
* **@antv/x6-react-shape:** upgraded to 0.10.22

## @antv/x6-example-features [0.10.82](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.10.81...@antv/x6-example-features@0.10.82) (2020-11-06)


### Bug Fixes

* 🐛 dnd events ([3e94b0b](https://github.com/antvis/x6/commit/3e94b0b1eafab8f43cff2601b088df24d1b062a4)), closes [#271](https://github.com/antvis/x6/issues/271)





### Dependencies

* **@antv/x6:** upgraded to 0.10.80
* **@antv/x6-react-shape:** upgraded to 0.10.21

## @antv/x6-example-features [0.10.81](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.10.80...@antv/x6-example-features@0.10.81) (2020-11-05)





### Dependencies

* **@antv/x6:** upgraded to 0.10.79
* **@antv/x6-react-shape:** upgraded to 0.10.20

## @antv/x6-example-features [0.10.79](https://github.com/antvis/x6/compare/@antv/x6-example-features@0.10.78...@antv/x6-example-features@0.10.79) (2020-11-05)


### Bug Fixes

* 🐛 version error ([5c80d69](https://github.com/antvis/x6/commit/5c80d69f66217e131176fce89b95d30bd47e3c4c))
* fix x6-react-shape typo 'getPovider' ([83be5e1](https://github.com/antvis/x6/commit/83be5e10eecc687a7d389c17141ebd49d6fcc7f2))





### Dependencies

* **@antv/x6:** upgraded to 1.0.0-beta.4
* **@antv/x6-react-shape:** upgraded to 1.0.0-beta.4
