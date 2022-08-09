
APP_DIR=$(pwd)

docker build -t puppeteer -f "test/ci/Dockerfile" .

docker run --rm --net="host" -v "$APP_DIR":"/app"  puppeteer:latest  npm run test
