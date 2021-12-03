#!/usr/bin/env bash
set -eu

if [ "$#" != "1" ] ; then
  echo >&2 "Expected 1 argument, got $#: <$*>"
  echo >&2 " "
  echo >&2 "Usage: ./prep.sh <day>"
  exit 1
fi

echo "Input:"
curl --silent --show-error --location --cookie "session=${AOC_SESSION}" "https://adventofcode.com/2021/day/$1/input" | \
  tee "inputs/day$1.txt" | \
  wc

sol_java="src/solutions/Day$1.java"
cp src/tpl/Day.java.tpl "$sol_java"
sed -i "s#<n>#$1#g" "$sol_java"

sol_js="src/solutions/Day$1.js"
cp src/tpl/Day.js.tpl "$sol_js"
sed -i "s#<n>#$1#g" "$sol_js"
chmod +x "$sol_js"

echo "Code: "
echo "  * $sol_java"
echo "  * $sol_js"
