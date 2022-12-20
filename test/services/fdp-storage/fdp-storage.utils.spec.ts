import { dappUrlToId } from '../../../src/services/fdp-storage/fdp-storage.utils'

describe('fdp-storage.utils.ts tests', () => {
  test('dappUrlToId function should extract ENS names', () => {
    const cases: { url: string; beeUrl: string; dappId: string }[] = [
      {
        url: 'http://localhost:1633/bzz/random-dapp/123',
        beeUrl: 'http://localhost:1633',
        dappId: 'random-dapp',
      },
      {
        url: 'http://localhost:1633/bzz/random-dapp/123',
        beeUrl: 'http://localhost:1633/',
        dappId: 'random-dapp',
      },
      {
        url: 'http://localhost:1633/bee/path/bzz/random-dapp',
        beeUrl: 'http://localhost:1633/bee/path',
        dappId: 'random-dapp',
      },
      {
        url: 'http://localhost:1633/bee/path/bzz/random-dapp/123',
        beeUrl: 'http://localhost:1633/bee/path',
        dappId: 'random-dapp',
      },
      {
        url: 'http://localhost:1633/bee/path/bzz/random-dapp/123',
        beeUrl: 'http://localhost:1633/bee/path/',
        dappId: 'random-dapp',
      },
      {
        url: 'http://random-dapp.swarm.localhost:1633',
        beeUrl: 'http://localhost:1633',
        dappId: 'random-dapp',
      },
      {
        url: 'http://random-dapp.swarm.localhost:1633',
        beeUrl: 'http://localhost:1633/',
        dappId: 'random-dapp',
      },
    ]

    cases.forEach(({ url, beeUrl, dappId }) => {
      expect(dappUrlToId(url, beeUrl)).toEqual(dappId)
    })
  })

  test("dappUrlToId function shouldn't extract ENS names", () => {
    const cases: { url: string; beeUrl: string; dappId: string }[] = [
      {
        url: 'http://localhost:1633/bzz/random-dapp/123',
        beeUrl: 'http://localhost:1634',
        dappId: null,
      },
      {
        url: 'http://localhost:1633/bzz/random-dapp/123',
        beeUrl: 'http://localhost.eth:1633/',
        dappId: null,
      },
      {
        url: 'http://random-dapp.localhost:1633',
        beeUrl: 'http://localhost:1633',
        dappId: null,
      },
      {
        url: 'https://random-dapp.swarm.localhost:1633',
        beeUrl: 'http://localhost:1633/',
        dappId: null,
      },
    ]

    let count = 0

    cases.forEach(({ url, beeUrl }) => {
      try {
        dappUrlToId(url, beeUrl)
      } catch (error) {
        count += 1
        expect(error.toString()).toEqual('Error: Invalid dApp URL')
      }
    })

    expect(count).toEqual(cases.length)
  })
})
