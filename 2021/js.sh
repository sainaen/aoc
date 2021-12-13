#!/usr/bin/env bash
set -eu

if [ "$#" != "1" ] ; then
  echo >&2 "Expected 1 argument, got $#: <$*>"
  echo >&2 " "
  echo >&2 "Usage: ./js.sh <day|file>"
  exit 1
fi

if [ -f "$1" ] ; then
  sol_js="$1"
else
  sol_js="src/solutions/Day$1.js"
  if [ ! -f "$sol_js" ] ; then
    echo >&2 "File: ${sol_js} doesn't exist"
    exit 1
  fi
fi

function run() {
  echo " "
  ./"${sol_js}" || true
  echo "***"
  echo " "
}

run
while true ; do
  inotifywait -qq --event modify "$sol_js" "src/utils/utils.js"
  sleep 0.1 # solves weird '/usr/bin/env: bad interpreter: Text file busy' error
  run
done
