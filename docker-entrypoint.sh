#!/bin/bash
# Cause the script to exit as soon as one command returns a non-zero
# so if anything fails, the service doesn't run and the container stops
set -e

ssm_available() {
  if [ -z ${SSM_BASE_PATH+x} ]; then
    return 1
  fi

  return 0
}

get_ssm_params() {
  aws ssm get-parameters-by-path --no-paginate --path "${SSM_BASE_PATH}" --with-decryption --query Parameters | \
  jq -r 'map("\(.Name | sub("'"${SSM_BASE_PATH}"'";""))=\(.Value | @sh)") | join("\n")'
}

exec_with_ssm_parameters() {
  local params=$(get_ssm_params)

  if [ -z "$params" ]; then
    echo "Error: No SSM parameters found"
    exit 1
  fi

  while IFS= read -r parameter; do
    echo "Info: Exporting parameter ${parameter%%=*}"
    export "${parameter}"
  done < <(printf '%s\n' "$params")

  exec "$@"
}

main() {
  if ssm_available; then
    echo "Info: Loading SSM Parameters" >&2
    exec_with_ssm_parameters "$@"
  fi

  echo "Info: Starting ..." >&2
  exec "$@"
}

main "$@"
