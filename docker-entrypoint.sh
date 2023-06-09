#!/bin/bash

ssm_available() {
  if [ -z ${SSM_BASE_PATH+x} ]; then
    return 1
  fi

  return 0
}

get_ssm_params() {
  aws ssm get-parameters-by-path --no-paginate --path ${SSM_BASE_PATH} --with-decryption --query Parameters | \
  jq -r 'map("\(.Name | sub("'${SSM_BASE_PATH}'";""))=\(.Value)") | join("\n")'
}

exec_with_ssm_parameters() {
  for parameter in `get_ssm_params`; do
    echo "Info: Exporting parameter ${parameter%%=*}"
    export ${parameter}
  done
  exec "$@"
}

main() {
  if ssm_available; then
    echo "Info: Loading SSM Parameters" >&2
    exec_with_ssm_parameters "$@"
  fi

  # npm run migrate

  echo "Info: Starting ..." >&2
  exec "$@"
}

main "$@"
