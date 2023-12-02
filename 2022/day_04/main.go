package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

// @formatter:off
/*
--------Part 1---------   --------Part 2---------
    Time    Rank  Score       Time    Rank  Score
    >24h  186357      0       >24h  182678      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 4")

	fmt.Println("-------------")
	part1(sample(`2-4,6-8
	2-3,4-5
	5-7,7-9
	2-8,3-7
	6-6,4-6
	2-6,4-8`))
	part1(fullInput())

	fmt.Println("-------------")
	part2(sample(`2-4,6-8
	2-3,4-5
	5-7,7-9
	2-8,3-7
	6-6,4-6
	2-6,4-8`))
	part2(fullInput())
}

func part1(in input) {
	result := 0
	for _, l := range in.lines {
		pair := strings.Split(l, ",")
		a1 := assignment(pair[0])
		a2 := assignment(pair[1])
		//fmt.Printf("%v U %v = %v\n", a1, a2, fullyOverlap(a1, a2))
		if fullyOverlap(a1, a2) {
			result += 1
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func fullyOverlap(a1, a2 []int) bool {
	return a1[0] <= a2[0] && a2[1] <= a1[1] ||
		a2[0] <= a1[0] && a1[1] <= a2[1]
}

func overlap(a1, a2 []int) bool {
	return a2[0] <= a1[0] && a1[0] <= a2[1] ||
		a1[0] <= a2[0] && a2[0] <= a1[1]
}

func assignment(s string) []int {
	a := strings.Split(s, "-")
	l, _ := strconv.Atoi(a[0])
	r, _ := strconv.Atoi(a[1])
	return []int{l, r}
}

func part2(in input) {
	result := 0
	for _, l := range in.lines {
		pair := strings.Split(l, ",")
		a1 := assignment(pair[0])
		a2 := assignment(pair[1])
		//fmt.Printf("%v U %v = %v\n", a1, a2, overlap(a1, a2))
		if overlap(a1, a2) {
			result += 1
		}
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2022/day_04/input.txt")
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
