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
--------Part 1---------   --------Part 2---------
    Time    Rank  Score       Time    Rank  Score
    >24h  156207      0       >24h  154618      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 6")

	fmt.Println("-------------")
	part1(sample(`mjqjpqmgbljsphdztnvjfqwrcgsmlb`))    // 7
	part1(sample(`bvwbjplbgvbhsrlpgdmjqwftvncz`))      // 5
	part1(sample(`nppdvjthqldpwncqszvftbrmjlhg`))      // 6
	part1(sample(`nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`)) // 10
	part1(sample(`zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`))  // 11
	part1(fullInput())

	fmt.Println("-------------")
	part2(sample(`mjqjpqmgbljsphdztnvjfqwrcgsmlb`))    // 19
	part2(sample(`bvwbjplbgvbhsrlpgdmjqwftvncz`))      // 23
	part2(sample(`nppdvjthqldpwncqszvftbrmjlhg`))      // 23
	part2(sample(`nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`)) // 29
	part2(sample(`zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`))  // 26
	part2(fullInput())
}

func part1(in input) {
	result := 0
	l := in.lines[0]
	for i := 4; i < len(l); i++ {
		if isStartMarker(l[i-4 : i]) {
			result = i
			break
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func isStartMarker(cs string) bool {
	set := make(map[int32]bool)
	for _, c := range cs {
		set[c] = true
	}
	return len(set) == len(cs)
}

func part2(in input) {
	result := 0
	l := in.lines[0]
	for i := 14; i < len(l); i++ {
		if isStartMarker(l[i-14 : i]) {
			result = i
			break
		}
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2022/day_06/input.txt")
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
