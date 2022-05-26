# Blossom JS Library

A JavaScript library that provides an interface to the Blossom browser extension.

## Installation

The library can be installed via npm:

```bash
npm install --save @fairdatasociety/blossom
```

## Usage

All interaction with the Blossom browser extension is established through the Blossom class:

```typescript
import { Blossom } from '@fairdatasociety/blossom'
```

An instance of the class can be configured with an address of an RPC server. By default it will use local
`fdp-contract` image listenning on port 9545. You can run such image using `docker`:

```bash
docker run -p 9545:9545 fairdatasociety/swarm-test-blockchain:1.2.0
```

> **_NOTE_:** For more information regarding the `swarm-test-blockchain` image check this repo
> [fdp-contracts](https://github.com/fairDataSociety/fdp-contracts)

You can get an enum of all supported RPC addresses:

```typescript
import { Networks } from '@fairdatasociety/blossom'
```

Th second optional parameter is the Blossom extension ID. By default it will use the extension ID of the
extension in the Chrome store. But you can provide different one if you are running your own version of the
extension.

Here is an example how to register a new user using the library:

```typescript
import { Blossom } from '@fairdatasociety/blossom'

async function registerExample() {
  const blossom = new Blossom()
  await blossom.register('new_user', 'pass123')
}

registerExample()
```

## Development

To watch for changes in the source code and recompile the library on change:

```bash
npm start
```

## Build

To build the library:

```bash
npm run build
```

## Tests

Tests use the [puppeteer](https://github.com/puppeteer/puppeteer) project to interact with the library and the
Blossom extension. Because of that, tests need web pages that are going to be interacted with. Such test web
pages are located inside the `test/webpages` directory. Each page contains elements that can be interacted
with to trigger various events, and placeholder elements that are used to show results of various operations.

Before running tests, the complete environment must be started. That means, an instance of the `fdp-contracts`
image should be running locally:

```bash
docker run -p 9545:9545 fairdatasociety/swarm-test-blockchain:1.2.0
```

Also a web server that will serve the test web pages:

```bash
npm run serve
```

Now when the environment is ready, tests are executed by running:

```bash
npm test
```
