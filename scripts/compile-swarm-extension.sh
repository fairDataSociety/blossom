#!/bin/bash
SCRIPTS_DIR=$( dirname "$0" )

cd "$SCRIPTS_DIR/.."

rm -rf swarm-extension

git clone https://github.com/ethersphere/swarm-extension.git

cd swarm-extension

npm ci

npm run compile
