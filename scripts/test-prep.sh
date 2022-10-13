#!/bin/bash

LIBRARY_PATH="library/build/"

# build library if doesn't exist
if [ -d $LIBRARY_PATH ] && [ -n "$(ls -A $LIBRARY_PATH)" ];
  then
    echo "Library already exists"
  else
    echo "Building library..."
    npm run build --prefix library
fi

# copy library to test pages
cp -r -T "$LIBRARY_PATH/index.js" test/dapps/fdp-storage/blossom.js

POSTAGE_BATCH_ID=$1
# if postage batch id is not provided, create one
if [ -z "$POSTAGE_BATCH_ID" ];
  then
  echo "No postage batch provided. You can provide one by adding '--batch=...' script parameter"
  echo "Creating postage batch..."
  POSTAGE_BATCH_ID=$(curl -s -XPOST http://localhost:1635/stamps/10000000/18 | cut -c 13-76)

  if [ -z "$POSTAGE_BATCH_ID" ]; then
    echo "Couldn't create postage batch"
    exit -1
  fi

  echo "Created postage batch $POSTAGE_BATCH_ID"
  sleep 200
  else
    echo "Provided postage batch $POSTAGE_BATCH_ID"
fi

# upload test pages
echo "Uploading test pages..."

# TODO this might be extracted into a function
cd test/dapps/fdp-storage
tar -cf ../fdp-storage.tar.gz *
cd -

FDP_STORAGE_PAGE_REFERENCE=$(curl \
  -X POST \
  -H "Content-Type: application/x-tar" \
  -H "Swarm-Index-Document: index.html" \
  -H "Swarm-Error-Document: index.html" \
  -H "Swarm-Collection: true" \
  -H "Swarm-Postage-Batch-Id: $POSTAGE_BATCH_ID" \
  --data-binary @test/dapps/fdp-storage.tar.gz http://localhost:1633/bzz | cut -c 15-78)

echo "fdp-storage page reference $FDP_STORAGE_PAGE_REFERENCE"

# export env vars
export BLOSSOM_POSTAGE_BATCH_ID=$POSTAGE_BATCH_ID
export BLOSSOM_FDP_STORAGE_PAGE_REFERENCE=$FDP_STORAGE_PAGE_REFERENCE





