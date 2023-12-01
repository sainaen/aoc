#!/usr/bin/env bash
set -eu
set -o pipefail

if [ "$#" != "1" ] ; then
  echo >&2 "Expected 1 argument, got $#: <$*>"
  echo >&2 " "
  echo >&2 "Usage: ./prep.sh <day>"
  exit 1
fi

day="$1"
day_dir=$(printf "day_%02d" "$day")
mkdir -p "${day_dir}"

input_file="${day_dir}/input.txt"

echo "Input:"
curl --silent --show-error --location --cookie "session=${AOC_SESSION?}" "https://adventofcode.com/2023/day/${day}/input" -o "${input_file}"
head "${input_file}"
echo "..."
echo "(total lines: $(wc -l "${input_file}" | cut -d' ' -f1))"

sol_file="${day_dir}/main.go"
if [ ! -f "${sol_file}" ] ; then
cat <<-EOF > "${sol_file}"
package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

// @formatter:off
/*
-- put the day's stats here --
*/
// @formatter:on
func main() {
	fmt.Println("Day ${day}")

	fmt.Println("-------------")
	part1(sample(\`\`))
	part1(fullInput())

	//fmt.Println("-------------")
	//part2(sample(\`\`))
	//part2(fullInput())
}

func part1(in input) {
	result := 0
	for _, l := range in.lines {
		result += len(l)
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2023/${input_file}")
	if err != nil {
		log.Fatal("Couldn't open the input file", err)
	}
	defer file.Close()
	return input{kind: "input", lines: lines(bufio.NewScanner(file))}
}

func sample(s string) input {
	return input{kind: "sample", lines: lines(bufio.NewScanner(strings.NewReader(s)))}
}

func lines(s *bufio.Scanner) []string {
	var result []string
	for s.Scan() {
		result = append(result, strings.TrimSpace(s.Text()))
	}
	return result
}
EOF

  go fmt "${sol_file}" >/dev/null
fi

echo ""
echo "Template file: ${sol_file}"
