package main

import (
	"fmt"
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
	inputFile := "2023/day_04/input.txt"
	sampleLines := `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

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

func parseCard(l string) ([]int, []int) {
	parts := strings.Split(l, ":")       // [card id, rest]
	parts = strings.Split(parts[1], "|") // [winning, mine]
	return parseNums(parts[0]), parseNums(parts[1])
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
