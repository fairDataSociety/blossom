# Blossom JS Library

A JavaScript library that provides an interface to the Blossom browser extension.

## Installation

The library can be installed via npm:

```bash
npm install --save @fairdatasociety/blossom
```

## Usage

### Blossom class

All interaction with the Blossom browser extension is established through the Blossom class:

```typescript
import { Blossom } from '@fairdatasociety/blossom'
```

By default the class will connect to the Blossom browser extension using its ID from the Google store. If you
are running your version of the extension the class can be configured with a different extension ID.

```typescript
const blossom = new Blossom() // Using the default Blossom ID from the Google store
```

```typescript
const blossom = new Blossom('Blossom Extension ID...') // Using custom Blossom ID
```

Each dApp should be executed from a BZZ link (e.g. http://127.0.0.1:1633/bzz/dApp-ens-name/). In that case
dApp's ID is available as `blossom.dappId` property.

To test if connection with the Blossom extension is established, call the `echo` method:

```typescript
const text = await blossom.echo<string>('test')
console.log(text) // 'test'
```

### FDP Storage

If the user is logged in, dApp can access its own pod. Each dApp can have only one pod and its name must be
the same as the `blossom.dappId` property.

To check if dApp's pod is already created:

```typescript
const podIsCreated = await blossom.fdpStorage.personalStorage.isDappPodCreated()
```

If not created, then it can be created calling:

```typescript
const pod = await blossom.fdpStorage.personalStorage.create(blossom.dappId)
```

Afterwards, dApp can execute various operations on that pod, like creating, reading files and directories,
etc.

For example, to create a directory:

```typescript
const directory = await blossom.fdpStorage.directory.create(blossom.dappId, '/example')
```

Then, to upload a file there:

```typescript
const file = await blossom.fdpStorage.file.uploadData(blossom.dappId, '/example/new-file.txt', 'File content')
```

And to download the same file:

```typescript
const content = await blossom.fdpStorage.file.downloadData(blossom.dappId, '/example/new-file.txt')
console.log(content.text()) // 'File content'
```

> **_NOTE_:** For more available methods, check the
> [fdp-storage repo](https://github.com/fairDataSociety/fdp-storage#usage)

### Terminating connection

Once when the instance of the Blossom class is not needed anymore, connection with the extension should be
terminated to avoid memory leaking.

```typescript
blossom.closeConnection()
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

Before running tests, the complete environment must be started. To start the environment and the extension
check the [extension's readme](../README.md#setting-up-the-environment).

To run a web server that will serve the test web pages, execute:

```bash
npm run serve
```

The Blossom extension and the Swarm extension must be compiled. For that, check the readme file of the root
project.

Now when the environment is ready, tests are executed by running:

```bash
npm test
```
