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
--------Part 1--------   -------Part 2--------
    Time   Rank  Score       Time  Rank  Score
00:26:26   9322      0   00:33:50  5156      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 4")

	fmt.Println("-------------")
	part1(sample(`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`))
	part1(fullInput())

	fmt.Println("-------------")
	part2(sample(`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`))
	part2(fullInput())
}

func part1(in input) {
	result := 0
	for _, l := range in.lines {
		winning, mine := parseCard(l)
		//fmt.Println(l)
		//fmt.Printf("Card    : %v | %v\n", winning, mine)
		//mineMap := toMap(mine)
		winningMap := toMap(winning)
		cardWorth := 0
		for _, n := range mine {
			if _, ok := winningMap[n]; ok {
				if cardWorth == 0 {
					cardWorth = 1
				} else {
					cardWorth *= 2
				}
			}
		}
		result += cardWorth
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func toMap(ns []int) map[int]bool {
	result := make(map[int]bool)
	for _, n := range ns {
		result[n] = true
	}
	return result
}

func parseCard(l string) ([]int, []int) {
	parts := strings.Split(l, ":")       // [card id, rest]
	parts = strings.Split(parts[1], "|") // [winning, mine]
	return parseArray(parts[0]), parseArray(parts[1])
}

func parseArray(s string) []int {
	nums := strings.Split(strings.TrimSpace(s), " ")
	result := make([]int, 0)
	for _, n := range nums {
		nws := strings.TrimSpace(n)
		if len(nws) > 0 {
			v, _ := strconv.Atoi(nws)
			result = append(result, v)
		}
	}
	return result
}

func part2(in input) {
	result := 0
	copies := make([]int, len(in.lines))
	for i, l := range in.lines {
		if len(strings.TrimSpace(l)) > 0 {
			copies[i] = 1
		}
	}
	for i, l := range in.lines {
		winning, mine := parseCard(l)
		winningMap := toMap(winning)
		for c := 1; c <= copies[i]; c++ {
			j := 1
			for _, n := range mine {
				if _, ok := winningMap[n]; ok {
					copies[i+j] += 1
					j += 1
				}
			}
		}
		//fmt.Printf("after card %d: %v\n", i, copies)
	}
	for _, n := range copies {
		result += n
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2023/day_04/input.txt")
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
