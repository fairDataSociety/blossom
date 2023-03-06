# Changelog

## [0.2.2](https://github.com/fairDataSociety/blossom/compare/blossom-ext-v0.2.1...blossom-ext-v0.2.2) (2023-03-01)


### Bug Fixes

* buffer serialization ([#114](https://github.com/fairDataSociety/blossom/issues/114)) ([1616fd1](https://github.com/fairDataSociety/blossom/commit/1616fd1a06ed8fdb2bd44f4eabd8d8357fe437d7))

## [0.2.1](https://github.com/fairDataSociety/blossom/compare/blossom-ext-v0.2.0...blossom-ext-v0.2.1) (2023-02-23)


### Bug Fixes

* compatibility with new fdp-storage ([#111](https://github.com/fairDataSociety/blossom/issues/111)) ([055581d](https://github.com/fairDataSociety/blossom/commit/055581dff51ba8b5a15bc758b73faa23c6f3efa5))

## [0.2.0](https://github.com/fairDataSociety/blossom/compare/blossom-ext-v0.1.1...blossom-ext-v0.2.0) (2023-01-16)


### Features

* add disclaimer ([#102](https://github.com/fairDataSociety/blossom/issues/102)) ([4b9d537](https://github.com/fairDataSociety/blossom/commit/4b9d537e4d9d90091638c4494e0adcff92f4d12a))
* add signer ([#91](https://github.com/fairDataSociety/blossom/issues/91)) ([17d5acc](https://github.com/fairDataSociety/blossom/commit/17d5acc20755756a127258e3166948241ff80f2d))
* pod permissions ([#103](https://github.com/fairDataSociety/blossom/issues/103)) ([66c33fb](https://github.com/fairDataSociety/blossom/commit/66c33fbe872159e88a20a8b8c1bf5d0c089acd34))


### Bug Fixes

* duplicate words in mnemonic ([#95](https://github.com/fairDataSociety/blossom/issues/95)) ([#97](https://github.com/fairDataSociety/blossom/issues/97)) ([0d2ab27](https://github.com/fairDataSociety/blossom/commit/0d2ab273700a589eaba4526d538885f937a905c0))
* library release ([#84](https://github.com/fairDataSociety/blossom/issues/84)) ([#89](https://github.com/fairDataSociety/blossom/issues/89)) ([6e45990](https://github.com/fairDataSociety/blossom/commit/6e45990fd6b1aebaaca27e0ddc2ca8823cf133c2))
* loader-utils vulnerability ([#96](https://github.com/fairDataSociety/blossom/issues/96)) ([5d3ce11](https://github.com/fairDataSociety/blossom/commit/5d3ce11cec4652750a2437bfb74405333c092c49))
* swarm api ([#99](https://github.com/fairDataSociety/blossom/issues/99)) ([b2d46de](https://github.com/fairDataSociety/blossom/commit/b2d46dea9b1186d170661b9e926a59fc81f308fd))

## [0.1.1](https://github.com/fairDataSociety/blossom/compare/blossom-ext-v0.1.0...blossom-ext-v0.1.1) (2022-09-21)


### Bug Fixes

* **build:** bee-js ky ([#82](https://github.com/fairDataSociety/blossom/issues/82)) ([620fdd1](https://github.com/fairDataSociety/blossom/commit/620fdd1882ebeef282c94e61f2c9a811c7338573))
* fix race condition ([#79](https://github.com/fairDataSociety/blossom/issues/79)) ([#80](https://github.com/fairDataSociety/blossom/issues/80)) ([2f13a7f](https://github.com/fairDataSociety/blossom/commit/2f13a7fb42aa0353a3af339d61b9b67d96a1fb09))

## 0.1.0 (2022-08-31)


First Version of the Blossom!

The extension is capable of handling [FDS Account](https://github.com/fairDataSociety/FIPs/blob/master/text/0013-iaas.md) with its corresponding Personal Storage. 
Users can register portable FDS accounts on Görli testnet or on [FDP Play](https://github.com/fairDataSociety/fdp-play/) that allows to log in to the FDS account from any other device easily.

Additionally, it provides an API for dApps to interact with the active FDS account of the user.
Employing this feature in dApps, users do not have to share their FDS credentials and dApps don't have to implement Bee client connection configuration and FDS account handling within their application logic.

### Features

* add option to check if pod exists from library ([#72](https://github.com/fairDataSociety/blossom/issues/72)) ([aa917db](https://github.com/fairDataSociety/blossom/commit/aa917db701cbf6f4d7771d7cc7adbf014790a479))
* fdp storage ([#53](https://github.com/fairDataSociety/blossom/issues/53)) ([04eaa25](https://github.com/fairDataSociety/blossom/commit/04eaa250ed2823067001f8a923d3db74c10f426d))
* init ([#1](https://github.com/fairDataSociety/blossom/issues/1)) ([c645777](https://github.com/fairDataSociety/blossom/commit/c645777ec52a3003c9fe5fdf6ae76279fc74becb))
* login ([#9](https://github.com/fairDataSociety/blossom/issues/9)) ([8cc7514](https://github.com/fairDataSociety/blossom/commit/8cc75140e38bc341d2c6edaa7bf4203500d35e22))
* register existing account ([#17](https://github.com/fairDataSociety/blossom/issues/17)) ([8511911](https://github.com/fairDataSociety/blossom/commit/8511911ee5a1ea206bbbbb6da060dd9d86ae08ca))
* settings ([#22](https://github.com/fairDataSociety/blossom/issues/22)) ([efa2452](https://github.com/fairDataSociety/blossom/commit/efa245205f647375e8a08235eafc86d9b504b566))
* upgrade fdp-storage library ([#55](https://github.com/fairDataSociety/blossom/issues/55)) ([49d37a0](https://github.com/fairDataSociety/blossom/commit/49d37a0036eda15d2a9fc234a1b4c8d10ad99ba8))
* upgrade fdp-storage to 0.5.1 ([#63](https://github.com/fairDataSociety/blossom/issues/63)) ([09ba61a](https://github.com/fairDataSociety/blossom/commit/09ba61aee9681c27daa44871f3d5bc413e70e3fc))


### Bug Fixes

* fetch postage batches ([#69](https://github.com/fairDataSociety/blossom/issues/69)) ([0ad27a4](https://github.com/fairDataSociety/blossom/commit/0ad27a40a020b43d1a4b36049808381f00f3a48c))
* fix types ([#20](https://github.com/fairDataSociety/blossom/issues/20)) ([2079a79](https://github.com/fairDataSociety/blossom/commit/2079a7996f1f171e24d97aef95f625b8dffa402a))
* several library fixes ([#56](https://github.com/fairDataSociety/blossom/issues/56), [#57](https://github.com/fairDataSociety/blossom/issues/57)) ([#62](https://github.com/fairDataSociety/blossom/issues/62)) ([fe66aac](https://github.com/fairDataSociety/blossom/commit/fe66aac75528684017fd7e74a735af5011d07f91))


### Miscellaneous Chores

* release 0.1.0 ([24372f3](https://github.com/fairDataSociety/blossom/commit/24372f31cf9237902129ca9ed2e0588423e0cb9e))
* release 0.1.0 ([e8b2b0c](https://github.com/fairDataSociety/blossom/commit/e8b2b0cfa96becd2c1986ab872bfa46904fc58ff))
