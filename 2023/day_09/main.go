package main

import (
	"fmt"
)

// @formatter:off
/*
--------Part 1--------   -------Part 2--------
    Time   Rank  Score       Time  Rank  Score
00:14:53   2600      0   00:17:32  2023      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 9")
	inputFile := "2023/day_09/input.txt"
	sampleLines := `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

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
		hist := parseNums(l)
		result += nextValue(hist)
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func nextValue(hist []int) int {
	hists := make([][]int, 0)
	prevHist := hist
	for i := 0; i < 100000; i++ {
		next := nextHist(prevHist)
		//fmt.Println(next)
		hists = append(hists, next)
		if isAllZeroes(next) {
			break
		}
		prevHist = next
	}
	diff := 0
	for i := len(hists) - 1; i >= 0; i -= 1 {
		curH := hists[i]
		diff = curH[len(curH)-1] + diff
	}
	return hist[len(hist)-1] + diff
}

func nextHist(hist []int) []int {
	result := make([]int, len(hist)-1)
	for i := 0; i < len(hist)-1; i += 1 {
		result[i] = hist[i+1] - hist[i]
	}
	return result
}

func isAllZeroes(hist []int) bool {
	for _, v := range hist {
		if v != 0 {
			return false
		}
	}
	return true
}

func nextValue2(hist []int) int {
	hists := make([][]int, 0)
	prevHist := hist
	for i := 0; i < 100000; i++ {
		next := nextHist(prevHist)
		//fmt.Println(next)
		hists = append(hists, next)
		if isAllZeroes(next) {
			break
		}
		prevHist = next
	}
	diff := 0
	for i := len(hists) - 1; i >= 0; i -= 1 {
		curH := hists[i]
		diff = curH[0] - diff
	}
	return hist[0] - diff
}

func part2(in input) {
	result := 0
	for _, l := range in.lines {
		hist := parseNums(l)
		result += nextValue2(hist)
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
