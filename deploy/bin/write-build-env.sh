#!/usr/bin/env bash
set -euo pipefail

output_path="${1:?output path is required}"
request_increase_modal_env_var='NEXT_PUBLIC_BORROWER_REQUEST_INCREASE_MODAL_ENABLED'

jq -r --arg request_increase_modal_env_var "$request_increase_modal_env_var" '
  to_entries
  | map(select(.key != $request_increase_modal_env_var))
  | .[]
  | "\(.key)=\(.value)"
' > "$output_path"

if [[ "${DEPLOY_TIER:-}" == 'development' || "${DEPLOY_TIER:-}" == 'staging' ]]; then
  echo "${request_increase_modal_env_var}=true" >> "$output_path"
fi

if [[ -n "${NEXT_PUBLIC_MARKET_API_URL:-}" ]]; then
  echo "NEXT_PUBLIC_MARKET_API_URL=$NEXT_PUBLIC_MARKET_API_URL" >> "$output_path"
fi

if [[ -n "${APP_VERSION:-}" ]]; then
  echo "APP_VERSION=$APP_VERSION" >> "$output_path"
fi
