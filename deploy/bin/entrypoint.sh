#!/bin/bash

# Decode JSON-formatted secrets and set them as environment variables
if [ -n "$_SECRETS_ENV" ]; then
  echo "Parsing secrets..."

  secrets=$(echo "$_SECRETS_ENV" | jq -r 'to_entries | .[] | "\(.key) \(.value)"')
  while read -r key value; do
    # echo "$key=\"$value\""
    echo "$key=\"$value\"" > .env
    find server.js .next -type f -exec sed -i "s|%%%$key%%%|$value|g" {} +
    export $key="$value"
  done < <(echo "$secrets")

  echo "Parsing secrets...Done"
  unset _SECRETS_ENV
fi

su-exec nextjs "$@"

