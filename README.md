# Blossom

Browser Extension based on Fair Data Protocol

## Configuration

Before running the extension, it should be configured so it can be properly built and executed.

All configuration is stored inside the `.env` file. The configuration properties are:

- **ENVIRONMENT** - It can be set to `production` or `development` and determines how the project will be built.
- **SWARM_EXTENSION_ID** - This ID is used to establish communication with the Swarm extension in development mode. In production mode, this property is ignored.
- **ETH_GATEWAY** - Ethereum RPC gateway address
- **ENS_DOMAIN** - ENS domain which is used to generate user subdomains
- **ENS_REGISTRY_ADDRESS** - ENS Registry smart contract address
- **ENS_SUBDOMAIN_REGISTRAR_ADDRESS** - ENS Subdomain registrar smart contract address
- **ENS_PUBLIC_RESOLVER_ADDRESS** - ENS Public resolver smart contract address

## Installation

The extension is built by running these commands:

```sh
npm install
npm run build
```

All compiled files will be generated in the `dist` directory.

To load the extension in Chrome browser:

- Open a new tab, type `chrome://extensions` in address bar and go to that page
- Click on the `Load unpacked` button and select the `dist` folder
- The extension should appear in the list of installed extensions

> **_NOTE_:** At the moment, only Chrome browser is supported

### Development

**Running fdp-contracts**

For development, an ethereum development environment is needed with required smart contracts already deployed. For that purpose it's best to use [fdp-contracts](https://github.com/fairDataSociety/fdp-contracts).

Checkout the `fdp-contracts` repository, install dependencies, and run the local node:

```bash
git checkout https://github.com/fairDataSociety/fdp-contracts
cd fdp-contracts
npm install
npx hardhat node
```

In a separate terminal, compile and deploy the contracts:

```bash
npx hardhat compile
npm run deploy
```

The script will output addresses of `PublicResolver`, `SubdomainRegistrar` and `ENSRegistry`. Copy each value and set as values of `ENS_PUBLIC_RESOLVER_ADDRESS`, `ENS_SUBDOMAIN_REGISTRAR_ADDRESS` and `ENS_REGISTRY_ADDRESS` in the `.env` file, respectively.

Also set the address of the local node `http://127.0.0.1:8545/` to `ETH_GATEWAY` property in the `.env` file. The `ENS_DOMAIN` property can be any `.eth` subdomain.

> **_NOTE_:** The extension must be rebuilt to reflect changes in the .env file

**Running the extension**

To start the project in development mode execute this command:

```sh
npm start
```

This process will watch for changes in source files and compile files on every change.

### Tests

Tests are executed by running this command:

```sh
npm test
```

Tests include both unit and integration tests.

Unit test folder structure replicate source folder structure. For example, if there is a file in `src` folder with the path `src/a/b/c.ts` its unit test will be in the path `test/a/b/c.spec.ts`.

Integration tests are located directly in the `test` directory. These tests use [Puppeteer](https://github.com/puppeteer/puppeteer) library to test the extension in a real browser.

## Architecture

There are three different environments in which the code is executed:

- **Content scripts** \
  Located inside the `src/content` directory. This code is injected into web pages and can access various page's resources such as DOM, window object, etc.
- **Service worker** \
  All the other code is bundled into one script and executed as a service worker script. That code sets listeners that respond to various events.
- **UI pages** \
  All UI pages are located inside the `src/ui` directory. For each directory there, a separete HTML and JavaScript file is generated, except for the `common` directory. Those HTML/JS files are used as UI components inside the extension.
