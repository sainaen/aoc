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

sol="src/solutions/Day$1.java"
cp src/solutions/Day.java.tpl "$sol"
sed -i "s#<n>#$1#g" "$sol"

echo "Code: $sol"
