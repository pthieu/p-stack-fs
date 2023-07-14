#!/bin/bash
# Cause the script to exit as soon as one command returns a non-zero
# so if anything fails, the service doesn't run and the container stops
set -e

ssm_available() {
  if [ -z "$SSM_BASE_PATH" ]; then
    return 1
  fi

  return 0
}

# Use this or the aws cli method if you don't mind a larger image
# Read: https://github.com/pthieu/go-aws-get-parameter
export_ssm_params_go() {
  eval $(./ssm_get_parameter --path ${SSM_BASE_PATH})
  exec "$@"
}

main() {
  if ssm_available; then
    echo "Info: Loading SSM Parameters" >&2
    export_ssm_params_go "$@"
  fi

  echo "Info: Starting ..." >&2
  exec "$@"
}

main "$@"
