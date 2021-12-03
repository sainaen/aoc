#!/usr/bin/env bash
set -eu

if [ "$#" != "1" ] ; then
  echo >&2 "Expected 1 argument, got $#: <$*>"
  echo >&2 " "
  echo >&2 "Usage: ./js.sh <day>"
  exit 1
fi

sol_js="src/solutions/Day$1.js"

function run() {
  echo " "
  ./"${sol_js}" || true
  echo "***"
  echo " "
}

while true ; do
  inotifywait -qq --event modify "$sol_js" "src/utils/utils.js"
  sleep 0.1 # solves weird '/usr/bin/env: bad interpreter: Text file busy' error
  run
done
