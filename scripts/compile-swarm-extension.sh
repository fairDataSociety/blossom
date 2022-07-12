#!/bin/bash
SCRIPTS_DIR=$( dirname "$0" )

cd "$SCRIPTS_DIR/.."

rm -r swarm-extension

git clone https://github.com/ethersphere/swarm-extension.git

cd swarm-extension

npm ci

npm run compile
