#!/bin/bash
SCRIPTS_DIR=$( dirname "$0" )

cd "$SCRIPTS_DIR/.."

rm -r swarm-extension

# E2E not merged yet
git clone -b feature/e2e-api https://github.com/ethersphere/swarm-extension.git

cd swarm-extension

npm ci

npm run compile
