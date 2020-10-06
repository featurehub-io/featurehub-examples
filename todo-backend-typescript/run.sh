#!/bin/sh
export FEATUREHUB_ACCEPT_BAGGAGE=true
export FEATUREHUB_APP_ENV_URL=http://[featurehub-server-url]:[featurehub-edge-port]/features/[copied_sdk_url]
npm run start
