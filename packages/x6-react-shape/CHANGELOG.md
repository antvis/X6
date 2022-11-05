# @antv/x6-react-shape 1.0.0 (2022-11-05)


### Bug Fixes

* 🐛 add unregister for react/vue shape ([b741a0d](https://github.com/antvis/x6/commit/b741a0d82ae4bb6e1579b8656086b4ff0173f845))
* 🐛 component was rendered twice on init ([2d230f4](https://github.com/antvis/x6/commit/2d230f47c781301fd30011441099d4c0efad1ed2))
* 🐛 do not pass `node` prop to inline component ([9deb76b](https://github.com/antvis/x6/commit/9deb76bcefb9bf1e0a053c8443e5aeb4b45bf44b))
* 🐛 global `process` should be replaced when build with rollup ([b459b61](https://github.com/antvis/x6/commit/b459b61a7aa966ff83bfb5992586aed2583b8a46)), closes [#324](https://github.com/antvis/x6/issues/324)
* 🐛 interact with input rendered in react component ([82478b1](https://github.com/antvis/x6/commit/82478b1d66e3b8b4346dab9041cb00e54fea9be1))
* 🐛 revert add unmont method ([#1125](https://github.com/antvis/x6/issues/1125)) ([0cd8a9f](https://github.com/antvis/x6/commit/0cd8a9fee5d5f2b0f4f6f7419ef41b40f9129340))
* 🐛 unmount component when node unmount ([#1118](https://github.com/antvis/x6/issues/1118)) ([e029c7a](https://github.com/antvis/x6/commit/e029c7a6d281c727167a9076ba3217fed2a4d618))
* 🐛 update x6-react-shape ([#1424](https://github.com/antvis/x6/issues/1424)) ([27810c7](https://github.com/antvis/x6/commit/27810c73e4778cd1a8f587f477cf3ff668160c9b))
* 🐛 update x6-react-shape version ([#1422](https://github.com/antvis/x6/issues/1422)) ([ed6ac13](https://github.com/antvis/x6/commit/ed6ac135a991c2474694124846b732867bf81f8f))
* 🐛 use selectors to find react's container ([f5ed04e](https://github.com/antvis/x6/commit/f5ed04ec95c07a310b32e435b2405db14a8cf4d5))
* 🐛 version error ([5c80d69](https://github.com/antvis/x6/commit/5c80d69f66217e131176fce89b95d30bd47e3c4c))
* 🐛 version error ([fd57688](https://github.com/antvis/x6/commit/fd5768861fedda32d341c774f6e80da67646426f))
* 🐛 version not found ([8166346](https://github.com/antvis/x6/commit/8166346771f11ef5997a6e1ed376987408e57cde))
* 🐛 x6 version ([f2e01c4](https://github.com/antvis/x6/commit/f2e01c44a1f1acd9390c9de0b5ade913cfd8b03b))
* **anchor:** position of anchor and connection point ([f8f432a](https://github.com/antvis/x6/commit/f8f432afcef3cf5aec0c72cc351e8065c9c4559f))
* bump rule ([c9559f2](https://github.com/antvis/x6/commit/c9559f2f30790857ff066be7d0ce99ed8933e20c))
* component function should be called on every change of the node ([3d92caf](https://github.com/antvis/x6/commit/3d92caf6a97db95fee874359b7e62691f01a77f6)), closes [#185](https://github.com/antvis/x6/issues/185)
* extends style ([04d4aab](https://github.com/antvis/x6/commit/04d4aab8d25acd3edfa0e842987c7338989d7476))
* fix type error ([c5f14c4](https://github.com/antvis/x6/commit/c5f14c419f31abd7c6fe1113bf90b55724745828))
* fix x6-react-shape typo 'getPovider' ([83be5e1](https://github.com/antvis/x6/commit/83be5e10eecc687a7d389c17141ebd49d6fcc7f2))
* **minimap:** only render facade for minimap ([aa65629](https://github.com/antvis/x6/commit/aa65629df6e13e05d121861c7b56256be840054a))
* remove x6-common and x6-geometry deps ([#2830](https://github.com/antvis/x6/issues/2830)) ([5b5f5aa](https://github.com/antvis/x6/commit/5b5f5aa7ea6fded1b15abc79b9b5a5e2281b3ab9))
* update dependencies and fix type errors ([#1103](https://github.com/antvis/x6/issues/1103)) ([49d4371](https://github.com/antvis/x6/commit/49d43716ada672e609e4e6d9c6fdca3f494b6f68))


### chore

* bump to 2.0 ([94af7fa](https://github.com/antvis/x6/commit/94af7fa7ec96e3417db9aa5d245751507ae2671e))
* bump to 2.0 ([ecffe1a](https://github.com/antvis/x6/commit/ecffe1a2a8bcf5538f027c3c54acaefc50215023))
* release beta ([b5f3cfa](https://github.com/antvis/x6/commit/b5f3cfa2042f5196a995a38a8f41f140cabdce57))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([ab6a06f](https://github.com/antvis/x6/commit/ab6a06f1fe70b71ae31acc47b0d9cb02c86097e2))
* ✨ add html shape ([8d75504](https://github.com/antvis/x6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ add usePortal react hook in x6-react-shape ([b57760e](https://github.com/antvis/x6/commit/b57760e2f778b4bc8307a6cabd4eca14e0f91279))
* ✨ dispose components when unmount ([#1745](https://github.com/antvis/x6/issues/1745)) ([2bcd45f](https://github.com/antvis/x6/commit/2bcd45f818cfad5c19011660b30bbdd602787cd7))
* ✨ dot not update peerDependencies with x6 publish ([6d13809](https://github.com/antvis/x6/commit/6d138097cfce1755164f166a5e0c44d05b399528))
* ✨ support inherit options for react-shape registry ([#2596](https://github.com/antvis/x6/issues/2596)) ([ad63046](https://github.com/antvis/x6/commit/ad63046e89fa5853b0cf15947af1ed2a7b625188))
* ✨ support react portal ([c20c0c4](https://github.com/antvis/x6/commit/c20c0c473ee311b12a09193bb43209f47e7363b9))
* add scroller plugin ([#2580](https://github.com/antvis/x6/issues/2580)) ([5e0e2ac](https://github.com/antvis/x6/commit/5e0e2acde7d7e259ea27d001983e950878d0ecc8))
* adjust event source and package deps ([#2826](https://github.com/antvis/x6/issues/2826)) ([a1bdb18](https://github.com/antvis/x6/commit/a1bdb18b1d1e1967e8e27862fed2e4fe8787a8cb))
* custom function to return a react component ([da24c84](https://github.com/antvis/x6/commit/da24c84be4716def93232de4cea740a1a1e18e9a))
* dynamic update react node ([58539a4](https://github.com/antvis/x6/commit/58539a48ed461c717b8278d3088eb54608e2175f))
* force release 2.0-beta ([6987d9c](https://github.com/antvis/x6/commit/6987d9ce64454cd76f697d33f96715dbdf56524a))
* init ([8cad113](https://github.com/antvis/x6/commit/8cad113bae4b4856905e39a791aa6ea69e7bd361))
* only export the shape ([527e501](https://github.com/antvis/x6/commit/527e5010e422dbfb0f15c8edc4d4c358bc54772b))
* react shape registry and hook ([d5fdd65](https://github.com/antvis/x6/commit/d5fdd655c3bd27f10ce3ec5ed4f52d11a66a71d4))
* **react-shape:** ✨ add throttle to size and position ([#1335](https://github.com/antvis/x6/issues/1335)) ([be0b78b](https://github.com/antvis/x6/commit/be0b78b2f6db7a73e7ff03e8dd8bff313cce9783))
* Support jsdelivr and cdnjs CDN service [#335](https://github.com/antvis/x6/issues/335) ([#336](https://github.com/antvis/x6/issues/336)) ([be37f66](https://github.com/antvis/x6/commit/be37f66e421aa999332dd2f54f711f930fc095dc))
* support mouseenter and mouseleave event ([#2559](https://github.com/antvis/x6/issues/2559)) ([ecfd426](https://github.com/antvis/x6/commit/ecfd4263b1266a128bf8651c4dd745ff8ab038b3))
* support turbo ([1da55bf](https://github.com/antvis/x6/commit/1da55bfda73edaa96515998b5766e9ed5f241ee9))
* use x6-dom-util ([28b082c](https://github.com/antvis/x6/commit/28b082c8a5a37b4c2034fedf71c6e2b01c1c2b0f))
* use x6-util ([85240e9](https://github.com/antvis/x6/commit/85240e9a1aac5387b79916ead3b309b7c1e2b7db))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))
* ⚡️ optimize node render performance ([6554959](https://github.com/antvis/x6/commit/65549599d2f82f8052d16776c8d36ce7ee2fba9b))
* do not re-render react component when shape redrawing ([7bde71d](https://github.com/antvis/x6/commit/7bde71d75da535eec944754b047066fce180cc25))


### BREAKING CHANGES

* bump to 2.0
* bump to 2.0
* force release 2.0-beta
* force release 2.0-beta
* 2.0-beta





### Dependencies

* **@antv/x6:** upgraded to 1.0.0

# @antv/x6-react-shape 1.0.0 (2022-11-04)


### Bug Fixes

* 🐛 add unregister for react/vue shape ([b741a0d](https://github.com/antvis/x6/commit/b741a0d82ae4bb6e1579b8656086b4ff0173f845))
* 🐛 component was rendered twice on init ([2d230f4](https://github.com/antvis/x6/commit/2d230f47c781301fd30011441099d4c0efad1ed2))
* 🐛 do not pass `node` prop to inline component ([9deb76b](https://github.com/antvis/x6/commit/9deb76bcefb9bf1e0a053c8443e5aeb4b45bf44b))
* 🐛 global `process` should be replaced when build with rollup ([b459b61](https://github.com/antvis/x6/commit/b459b61a7aa966ff83bfb5992586aed2583b8a46)), closes [#324](https://github.com/antvis/x6/issues/324)
* 🐛 interact with input rendered in react component ([82478b1](https://github.com/antvis/x6/commit/82478b1d66e3b8b4346dab9041cb00e54fea9be1))
* 🐛 revert add unmont method ([#1125](https://github.com/antvis/x6/issues/1125)) ([0cd8a9f](https://github.com/antvis/x6/commit/0cd8a9fee5d5f2b0f4f6f7419ef41b40f9129340))
* 🐛 unmount component when node unmount ([#1118](https://github.com/antvis/x6/issues/1118)) ([e029c7a](https://github.com/antvis/x6/commit/e029c7a6d281c727167a9076ba3217fed2a4d618))
* 🐛 update x6-react-shape ([#1424](https://github.com/antvis/x6/issues/1424)) ([27810c7](https://github.com/antvis/x6/commit/27810c73e4778cd1a8f587f477cf3ff668160c9b))
* 🐛 update x6-react-shape version ([#1422](https://github.com/antvis/x6/issues/1422)) ([ed6ac13](https://github.com/antvis/x6/commit/ed6ac135a991c2474694124846b732867bf81f8f))
* 🐛 use selectors to find react's container ([f5ed04e](https://github.com/antvis/x6/commit/f5ed04ec95c07a310b32e435b2405db14a8cf4d5))
* 🐛 version error ([5c80d69](https://github.com/antvis/x6/commit/5c80d69f66217e131176fce89b95d30bd47e3c4c))
* 🐛 version error ([fd57688](https://github.com/antvis/x6/commit/fd5768861fedda32d341c774f6e80da67646426f))
* 🐛 version not found ([8166346](https://github.com/antvis/x6/commit/8166346771f11ef5997a6e1ed376987408e57cde))
* 🐛 x6 version ([f2e01c4](https://github.com/antvis/x6/commit/f2e01c44a1f1acd9390c9de0b5ade913cfd8b03b))
* **anchor:** position of anchor and connection point ([f8f432a](https://github.com/antvis/x6/commit/f8f432afcef3cf5aec0c72cc351e8065c9c4559f))
* bump rule ([c9559f2](https://github.com/antvis/x6/commit/c9559f2f30790857ff066be7d0ce99ed8933e20c))
* component function should be called on every change of the node ([3d92caf](https://github.com/antvis/x6/commit/3d92caf6a97db95fee874359b7e62691f01a77f6)), closes [#185](https://github.com/antvis/x6/issues/185)
* extends style ([04d4aab](https://github.com/antvis/x6/commit/04d4aab8d25acd3edfa0e842987c7338989d7476))
* fix type error ([c5f14c4](https://github.com/antvis/x6/commit/c5f14c419f31abd7c6fe1113bf90b55724745828))
* fix x6-react-shape typo 'getPovider' ([83be5e1](https://github.com/antvis/x6/commit/83be5e10eecc687a7d389c17141ebd49d6fcc7f2))
* **minimap:** only render facade for minimap ([aa65629](https://github.com/antvis/x6/commit/aa65629df6e13e05d121861c7b56256be840054a))
* remove x6-common and x6-geometry deps ([#2830](https://github.com/antvis/x6/issues/2830)) ([5b5f5aa](https://github.com/antvis/x6/commit/5b5f5aa7ea6fded1b15abc79b9b5a5e2281b3ab9))
* update dependencies and fix type errors ([#1103](https://github.com/antvis/x6/issues/1103)) ([49d4371](https://github.com/antvis/x6/commit/49d43716ada672e609e4e6d9c6fdca3f494b6f68))


### chore

* release beta ([b5f3cfa](https://github.com/antvis/x6/commit/b5f3cfa2042f5196a995a38a8f41f140cabdce57))


### Features

* ✨ add `primer` and `useForeignObject` option for react-shape ([ab6a06f](https://github.com/antvis/x6/commit/ab6a06f1fe70b71ae31acc47b0d9cb02c86097e2))
* ✨ add html shape ([8d75504](https://github.com/antvis/x6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ add usePortal react hook in x6-react-shape ([b57760e](https://github.com/antvis/x6/commit/b57760e2f778b4bc8307a6cabd4eca14e0f91279))
* ✨ dispose components when unmount ([#1745](https://github.com/antvis/x6/issues/1745)) ([2bcd45f](https://github.com/antvis/x6/commit/2bcd45f818cfad5c19011660b30bbdd602787cd7))
* ✨ dot not update peerDependencies with x6 publish ([6d13809](https://github.com/antvis/x6/commit/6d138097cfce1755164f166a5e0c44d05b399528))
* ✨ support inherit options for react-shape registry ([#2596](https://github.com/antvis/x6/issues/2596)) ([ad63046](https://github.com/antvis/x6/commit/ad63046e89fa5853b0cf15947af1ed2a7b625188))
* ✨ support react portal ([c20c0c4](https://github.com/antvis/x6/commit/c20c0c473ee311b12a09193bb43209f47e7363b9))
* add scroller plugin ([#2580](https://github.com/antvis/x6/issues/2580)) ([5e0e2ac](https://github.com/antvis/x6/commit/5e0e2acde7d7e259ea27d001983e950878d0ecc8))
* adjust event source and package deps ([#2826](https://github.com/antvis/x6/issues/2826)) ([a1bdb18](https://github.com/antvis/x6/commit/a1bdb18b1d1e1967e8e27862fed2e4fe8787a8cb))
* custom function to return a react component ([da24c84](https://github.com/antvis/x6/commit/da24c84be4716def93232de4cea740a1a1e18e9a))
* dynamic update react node ([58539a4](https://github.com/antvis/x6/commit/58539a48ed461c717b8278d3088eb54608e2175f))
* force release 2.0-beta ([6987d9c](https://github.com/antvis/x6/commit/6987d9ce64454cd76f697d33f96715dbdf56524a))
* init ([8cad113](https://github.com/antvis/x6/commit/8cad113bae4b4856905e39a791aa6ea69e7bd361))
* only export the shape ([527e501](https://github.com/antvis/x6/commit/527e5010e422dbfb0f15c8edc4d4c358bc54772b))
* react shape registry and hook ([d5fdd65](https://github.com/antvis/x6/commit/d5fdd655c3bd27f10ce3ec5ed4f52d11a66a71d4))
* **react-shape:** ✨ add throttle to size and position ([#1335](https://github.com/antvis/x6/issues/1335)) ([be0b78b](https://github.com/antvis/x6/commit/be0b78b2f6db7a73e7ff03e8dd8bff313cce9783))
* Support jsdelivr and cdnjs CDN service [#335](https://github.com/antvis/x6/issues/335) ([#336](https://github.com/antvis/x6/issues/336)) ([be37f66](https://github.com/antvis/x6/commit/be37f66e421aa999332dd2f54f711f930fc095dc))
* support mouseenter and mouseleave event ([#2559](https://github.com/antvis/x6/issues/2559)) ([ecfd426](https://github.com/antvis/x6/commit/ecfd4263b1266a128bf8651c4dd745ff8ab038b3))
* support turbo ([1da55bf](https://github.com/antvis/x6/commit/1da55bfda73edaa96515998b5766e9ed5f241ee9))
* use x6-dom-util ([28b082c](https://github.com/antvis/x6/commit/28b082c8a5a37b4c2034fedf71c6e2b01c1c2b0f))
* use x6-util ([85240e9](https://github.com/antvis/x6/commit/85240e9a1aac5387b79916ead3b309b7c1e2b7db))


### Performance Improvements

* ⚡️ add simple config to remove rect and text element ([#1449](https://github.com/antvis/x6/issues/1449)) ([0b5f241](https://github.com/antvis/x6/commit/0b5f2413f0b907316784149027615ae2d09616a4))
* ⚡️ optimize node render performance ([6554959](https://github.com/antvis/x6/commit/65549599d2f82f8052d16776c8d36ce7ee2fba9b))
* do not re-render react component when shape redrawing ([7bde71d](https://github.com/antvis/x6/commit/7bde71d75da535eec944754b047066fce180cc25))


### BREAKING CHANGES

* force release 2.0-beta
* force release 2.0-beta
* 2.0-beta





### Dependencies

* **@antv/x6:** upgraded to 1.0.0

## @antv/x6-react-shape [2.0.3](https://github.com/antvis/x6/compare/@antv/x6-react-shape@2.0.2...@antv/x6-react-shape@2.0.3) (2022-11-04)

## @antv/x6-react-shape [2.0.2](https://github.com/antvis/x6/compare/@antv/x6-react-shape@2.0.1...@antv/x6-react-shape@2.0.2) (2022-11-04)


### Bug Fixes

* remove x6-common and x6-geometry deps ([#2830](https://github.com/antvis/x6/issues/2830)) ([5b5f5aa](https://github.com/antvis/x6/commit/5b5f5aa7ea6fded1b15abc79b9b5a5e2281b3ab9))

## @antv/x6-react-shape [2.0.1](https://github.com/antvis/x6/compare/@antv/x6-react-shape@2.0.0...@antv/x6-react-shape@2.0.1) (2022-11-04)





### Dependencies

* **@antv/x6-common:** upgraded to 1.0.1

# @antv/x6-react-shape [2.0.0](https://github.com/antvis/x6/compare/@antv/x6-react-shape@1.6.0...@antv/x6-react-shape@2.0.0) (2022-11-04)


### Bug Fixes

* bump rule ([c9559f2](https://github.com/antvis/x6/commit/c9559f2f30790857ff066be7d0ce99ed8933e20c))


### chore

* release beta ([b5f3cfa](https://github.com/antvis/x6/commit/b5f3cfa2042f5196a995a38a8f41f140cabdce57))


### Features

* ✨ add html shape ([8d75504](https://github.com/antvis/x6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ support inherit options for react-shape registry ([#2596](https://github.com/antvis/x6/issues/2596)) ([ad63046](https://github.com/antvis/x6/commit/ad63046e89fa5853b0cf15947af1ed2a7b625188))
* add scroller plugin ([#2580](https://github.com/antvis/x6/issues/2580)) ([5e0e2ac](https://github.com/antvis/x6/commit/5e0e2acde7d7e259ea27d001983e950878d0ecc8))
* adjust event source and package deps ([#2826](https://github.com/antvis/x6/issues/2826)) ([a1bdb18](https://github.com/antvis/x6/commit/a1bdb18b1d1e1967e8e27862fed2e4fe8787a8cb))
* force release 2.0-beta ([6987d9c](https://github.com/antvis/x6/commit/6987d9ce64454cd76f697d33f96715dbdf56524a))
* support mouseenter and mouseleave event ([#2559](https://github.com/antvis/x6/issues/2559)) ([ecfd426](https://github.com/antvis/x6/commit/ecfd4263b1266a128bf8651c4dd745ff8ab038b3))
* support turbo ([1da55bf](https://github.com/antvis/x6/commit/1da55bfda73edaa96515998b5766e9ed5f241ee9))


### BREAKING CHANGES

* force release 2.0-beta
* force release 2.0-beta
* 2.0-beta





### Dependencies

* **@antv/x6:** upgraded to 2.0.0
* **@antv/x6-common:** upgraded to 1.0.0

## @antv/x6-react-shape [2.0.6-beta.2](https://github.com/antvis/x6/compare/@antv/x6-react-shape@2.0.6-beta.1...@antv/x6-react-shape@2.0.6-beta.2) (2022-11-04)


### Bug Fixes

* bump rule ([c9559f2](https://github.com/antvis/x6/commit/c9559f2f30790857ff066be7d0ce99ed8933e20c))

## @antv/x6-react-shape [2.0.6-beta.1](https://github.com/antvis/x6/compare/@antv/x6-react-shape@2.0.0-beta.1...@antv/x6-react-shape@2.0.6-beta.1) (2022-11-04)





### Dependencies

* **@antv/x6:** upgraded to 2.0.6-beta.5
* **@antv/x6-common:** upgraded to 2.0.6-beta.1

# @antv/x6-react-shape [2.0.0-beta.1](https://github.com/antvis/x6/compare/@antv/x6-react-shape@1.6.0...@antv/x6-react-shape@2.0.0-beta.1) (2022-11-03)


### chore

* release beta ([b5f3cfa](https://github.com/antvis/x6/commit/b5f3cfa2042f5196a995a38a8f41f140cabdce57))


### Features

* ✨ add html shape ([8d75504](https://github.com/antvis/x6/commit/8d7550413f9f6f3177eab9d0f7fef14c55949fb8))
* ✨ support inherit options for react-shape registry ([#2596](https://github.com/antvis/x6/issues/2596)) ([ad63046](https://github.com/antvis/x6/commit/ad63046e89fa5853b0cf15947af1ed2a7b625188))
* add scroller plugin ([#2580](https://github.com/antvis/x6/issues/2580)) ([5e0e2ac](https://github.com/antvis/x6/commit/5e0e2acde7d7e259ea27d001983e950878d0ecc8))
* force release 2.0-beta ([6987d9c](https://github.com/antvis/x6/commit/6987d9ce64454cd76f697d33f96715dbdf56524a))
* support mouseenter and mouseleave event ([#2559](https://github.com/antvis/x6/issues/2559)) ([ecfd426](https://github.com/antvis/x6/commit/ecfd4263b1266a128bf8651c4dd745ff8ab038b3))
* support turbo ([1da55bf](https://github.com/antvis/x6/commit/1da55bfda73edaa96515998b5766e9ed5f241ee9))


### BREAKING CHANGES

* force release 2.0-beta
* force release 2.0-beta
* 2.0-beta





### Dependencies

* **@antv/x6:** upgraded to 2.0.6-beta.4
* **@antv/x6-common:** upgraded to 1.0.0-beta.1
