#!/bin/bash

ROOT_PATH=$(dirname "$0")
ROOT_PATH=$( cd "$ROOT_PATH/.." && pwd )

echo "Creating a zip file..."

npm run zip

echo "Fetching an access token..."

STORE_ACCESS_TOKEN=$(curl "https://accounts.google.com/o/oauth2/token" -d "client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&code=$CODE&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | grep -Po  'access_token"\s?:\s?"\K.*?(?=")')

echo "Uploading the zip file..."

curl \
-H "Authorization: Bearer $STORE_ACCESS_TOKEN"  \
-H "x-goog-api-version: 2" \
-X PUT \
-T "$ROOT_PATH/extension.zip" \
-v \
https://www.googleapis.com/upload/chromewebstore/v1.1/items/$EXTENSION_ID


echo "Publishing new version.."

curl \
-H "Authorization: Bearer $STORE_ACCESS_TOKEN"  \
-H "x-goog-api-version: 2" \
-H "Content-Length: 0" \
-X POST \
-v \
https://www.googleapis.com/chromewebstore/v1.1/items/$EXTENSION_ID/publish

echo "New version has been published."
