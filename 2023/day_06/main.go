package main

import (
	"fmt"
	"strconv"
	"strings"
)

// @formatter:off
/*
--------Part 1--------   -------Part 2--------
    Time   Rank  Score       Time  Rank  Score
00:08:19   1852      0   00:11:28  1606      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 6")
	inputFile := "2023/day_06/input.txt"
	sampleLines := `Time:      7  15   30
Distance:  9  40  200`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	times := make([]int, 0)
	for _, v := range strings.Split(strings.TrimPrefix(in.lines[0], "Time:"), " ") {
		if len(strings.TrimSpace(v)) == 0 {
			continue
		}
		times = append(times, noErr(strconv.Atoi(v)))
	}
	dist := make([]int, 0)
	for _, v := range strings.Split(strings.TrimPrefix(in.lines[1], "Distance:"), " ") {
		if len(strings.TrimSpace(v)) == 0 {
			continue
		}
		dist = append(dist, noErr(strconv.Atoi(v)))
	}
	result := 1
	for i := 0; i < len(times); i++ {
		ways := 0
		t := times[i]
		d := dist[i]
		for hold := 1; hold < t-1; hold++ {
			if hold*(t-hold) > d {
				ways += 1
			}
		}
		result *= ways
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func part2(in input) {
	times := []int{noErr(strconv.Atoi(strings.TrimSpace(strings.ReplaceAll(strings.TrimPrefix(in.lines[0], "Time:"), " ", ""))))}
	dist := []int{noErr(strconv.Atoi(strings.TrimSpace(strings.ReplaceAll(strings.TrimPrefix(in.lines[1], "Distance:"), " ", ""))))}
	result := 1
	for i := 0; i < len(times); i++ {
		ways := 0
		t := times[i]
		d := dist[i]
		for hold := 1; hold < t-1; hold++ {
			if hold*(t-hold) > d {
				ways += 1
			}
		}
		result *= ways
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
