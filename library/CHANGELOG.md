# Changelog

## [0.2.3](https://github.com/fairDataSociety/blossom/compare/blossom-lib-v0.2.2...blossom-lib-v0.2.3) (2023-04-25)


### Bug Fixes

* serialization [#130](https://github.com/fairDataSociety/blossom/issues/130) ([#131](https://github.com/fairDataSociety/blossom/issues/131)) ([12dfca3](https://github.com/fairDataSociety/blossom/commit/12dfca3b8176f3ba3bacfe28a4bd61fb22715550))

## [0.2.2](https://github.com/fairDataSociety/blossom/compare/blossom-lib-v0.2.1...blossom-lib-v0.2.2) (2023-03-01)


### Bug Fixes

* buffer serialization ([#114](https://github.com/fairDataSociety/blossom/issues/114)) ([1616fd1](https://github.com/fairDataSociety/blossom/commit/1616fd1a06ed8fdb2bd44f4eabd8d8357fe437d7))

## [0.2.1](https://github.com/fairDataSociety/blossom/compare/blossom-lib-v0.2.0...blossom-lib-v0.2.1) (2023-02-23)


### Bug Fixes

* compatibility with new fdp-storage ([#111](https://github.com/fairDataSociety/blossom/issues/111)) ([055581d](https://github.com/fairDataSociety/blossom/commit/055581dff51ba8b5a15bc758b73faa23c6f3efa5))

## [0.2.0](https://github.com/fairDataSociety/blossom/compare/blossom-lib-v0.1.0...blossom-lib-v0.2.0) (2023-01-16)

Each dApp can now access any pod as long as the user grants access. dApp permissions can be seen and managed
in the extension's settings. Users can withdraw permissions at any time.

dApps can request signing of data with their pod private key.

### Features

- add signer ([#91](https://github.com/fairDataSociety/blossom/issues/91))
  ([17d5acc](https://github.com/fairDataSociety/blossom/commit/17d5acc20755756a127258e3166948241ff80f2d))
- pod permissions ([#103](https://github.com/fairDataSociety/blossom/issues/103))
  ([66c33fb](https://github.com/fairDataSociety/blossom/commit/66c33fbe872159e88a20a8b8c1bf5d0c089acd34))

### Bug Fixes

- swarm api ([#99](https://github.com/fairDataSociety/blossom/issues/99))
  ([b2d46de](https://github.com/fairDataSociety/blossom/commit/b2d46dea9b1186d170661b9e926a59fc81f308fd))

## 0.1.0 (2022-09-01)

This is the first version of JS library of Blossom!

The library knows all required DOM events to communicate with Blossom that supports already

- defining dApp ID # this is the identification of the dApp in Blossom; this ID is the key for the Context
  within which dApps can perform Blossom actions.
- use fdp-storage functionalities # the FDP Storage Object is a
  [Proxy Object underneath](https://github.com/fairDataSociety/blossom/issues/19) that only communicates with
  Blossom to retreive FDP Storage responses.
- can ping the extension # to check whether the user has Blossom extension in the browser.
- close connection # if there is no need for the Blossom functionalities for the dApp anymore.

### Features

- add option to check if pod exists from library ([#72](https://github.com/fairDataSociety/blossom/issues/72))
  ([aa917db](https://github.com/fairDataSociety/blossom/commit/aa917db701cbf6f4d7771d7cc7adbf014790a479))
- fdp storage ([#53](https://github.com/fairDataSociety/blossom/issues/53))
  ([04eaa25](https://github.com/fairDataSociety/blossom/commit/04eaa250ed2823067001f8a923d3db74c10f426d))
- login ([#9](https://github.com/fairDataSociety/blossom/issues/9))
  ([8cc7514](https://github.com/fairDataSociety/blossom/commit/8cc75140e38bc341d2c6edaa7bf4203500d35e22))

### Bug Fixes

- several library fixes ([#56](https://github.com/fairDataSociety/blossom/issues/56),
  [#57](https://github.com/fairDataSociety/blossom/issues/57))
  ([#62](https://github.com/fairDataSociety/blossom/issues/62))
  ([fe66aac](https://github.com/fairDataSociety/blossom/commit/fe66aac75528684017fd7e74a735af5011d07f91))

### Miscellaneous Chores

- release 0.1.0
  ([24372f3](https://github.com/fairDataSociety/blossom/commit/24372f31cf9237902129ca9ed2e0588423e0cb9e))
