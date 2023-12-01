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
-------Part 1--------   -------Part 2--------
    Time  Rank  Score       Time  Rank  Score
00:20:57  8400      0   01:36:38  9800      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 1")

	fmt.Println("-------------")
	part1(sample(`1abc2
		pqr3stu8vwx
		a1b2c3d4e5f
		treb7uchet`))
	part1(fullInput())

	fmt.Println("-------------")
	part2(sample(`two1nine
		eightwothree
		abcone2threexyz
		xtwone3four
		4nineeightseven2
		zoneight234
		7pqrstsixteen`))
	part2(fullInput())
}

func part1(in input) {
	result := 0
	for _, l := range in.lines {
		var first int
		for j := 0; j < len(l); j++ {
			if d := digitAt(l, j, false); d > -1 {
				first = d
				break
			}
		}
		var last int
		for j := len(l) - 1; j >= 0; j-- {
			if d := digitAt(l, j, false); d > -1 {
				last = d
				break
			}
		}
		n := first*10 + last
		//fmt.Printf("%v %d\n", l, n)
		result += n
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func digitAt(l string, i int, part2 bool) int {
	if '0' <= l[i] && l[i] <= '9' {
		return int(l[i] - '0')
	}
	if !part2 {
		return -1
	}
	s := l[i:]
	for j, d := range []string{"one", "two", "three", "four", "five", "six", "seven", "eight", "nine"} {
		if strings.HasPrefix(s, d) {
			return j + 1
		}
	}
	return -1
}

func part2(in input) {
	result := 0
	for _, l := range in.lines {
		var first int
		for j := 0; j < len(l); j++ {
			if d := digitAt(l, j, true); d > -1 {
				first = d
				break
			}
		}
		var last int
		for j := len(l) - 1; j >= 0; j-- {
			if d := digitAt(l, j, true); d > -1 {
				last = d
				break
			}
		}
		n := first*10 + last
		//fmt.Printf("%v: %d\n", l, n)
		result += n
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2023/day_01/input.txt")
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
