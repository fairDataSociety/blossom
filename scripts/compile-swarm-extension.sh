#!/bin/bash
# Compiles the swarm extension.
# Parameters:
# CI - boolean, specifies which configuration to use

SCRIPTS_DIR=$( dirname "$0" )

cd "$SCRIPTS_DIR/.."

CI=$1

rm -rf swarm-extension

git clone https://github.com/ethersphere/swarm-extension.git

cd swarm-extension

npm ci

if [[ $CI = "true" ]]
then
  sed -i 's/127.0.0.1/172.18.0.1/g' src/background/constants/addresses.ts
fi

npm run compile
