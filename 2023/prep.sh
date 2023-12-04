#!/usr/bin/env bash
set -eu
set -o pipefail

# shellcheck disable=SC1090
source ~/.config/aoc/auth.sh

if [ "$#" != "1" ] ; then
  echo >&2 "Expected 1 argument, got $#: <$*>"
  echo >&2 " "
  echo >&2 "Usage: ./prep.sh <day>"
  exit 1
fi

day="$1"
day_dir="2023/$(printf "day_%02d" "$day")"
input_file="${day_dir}/input.txt"

mkdir -p "${day_dir}"

echo "Input:"
curl --silent --show-error --location --cookie "session=${AOC_SESSION?}" "https://adventofcode.com/2023/day/${day}/input" -o "${input_file}"
head "${input_file}"
echo "..."
echo "(total lines: $(wc -l "${input_file}" | cut -d' ' -f1))"

sol_file="${day_dir}/main.go"
if [ ! -f "${sol_file}" ] ; then
  cp "2023/util.go" "${day_dir}"

  cat <<-EOF > "${sol_file}"
package main

import (
	"fmt"
)

// @formatter:off
/*
-- put the day's stats here --
*/
// @formatter:on
func main() {
	fmt.Println("Day ${day}")
	inputFile := "${input_file}"
	sampleLines := \`\`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	result := 0
	for _, l := range in.lines {
		result += len(l)
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func part2(in input) {
	result := 0
	for _, l := range in.lines {
		result += len(l)
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
EOF

  go fmt "${sol_file}" >/dev/null
fi

echo ""
echo "Template file: ${sol_file}"
