#!/usr/bin/env bash
set -euo pipefail

output_path="${1:?output path is required}"

jq -r '
  to_entries
  | map(select(.key != "NEXT_PUBLIC_BORROWER_REQUEST_INCREASE_MODAL_ENABLED"))
  | .[]
  | "\(.key)=\(.value)"
' > "$output_path"

if [[ -n "${NEXT_PUBLIC_MARKET_API_URL:-}" ]]; then
  echo "NEXT_PUBLIC_MARKET_API_URL=$NEXT_PUBLIC_MARKET_API_URL" >> "$output_path"
fi

if [[ -n "${APP_VERSION:-}" ]]; then
  echo "APP_VERSION=$APP_VERSION" >> "$output_path"
fi
