SCRIPTS_DIR=$( dirname "$0" )

cd "$SCRIPTS_DIR/.."

git clone https://github.com/ethersphere/swarm-extension.git

cd swarm-extension

npm ci

npm run compile
