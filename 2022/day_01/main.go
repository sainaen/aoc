package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"sort"
	"strconv"
	"strings"
)

// @formatter:off
/*
--------Part 1---------   --------Part 2---------
    Time    Rank  Score       Time    Rank  Score
    >24h  292922      0       >24h  278022      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 1")

	fmt.Println("-------------")
	part1(sample(`1000
	2000
	3000

	4000

	5000
	6000

	7000
	8000
	9000

	10000`))
	part1(fullInput())

	fmt.Println("-------------")
	part2(sample(`1000
	2000
	3000

	4000

	5000
	6000

	7000
	8000
	9000

	10000`))
	part2(fullInput())
}

func part1(in input) {
	result := -1
	curElf := 0
	for _, l := range in.lines {
		if len(l) == 0 {
			if curElf > result {
				result = curElf
			}
			curElf = 0
		}
		d, _ := strconv.Atoi(l)
		curElf += d
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func part2(in input) {
	var result []int
	curElf := 0
	for _, l := range in.lines {
		if len(l) == 0 {
			result = append(result, curElf)
			curElf = 0
		}
		d, _ := strconv.Atoi(l)
		curElf += d
	}
	sort.Sort(sort.Reverse(sort.IntSlice(result)))
	fmt.Printf("part 1 (%s): %v\n", in.kind, result[0]+result[1]+result[2])
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2022/day_01/input.txt")
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
