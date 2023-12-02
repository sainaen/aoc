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
    >24h  209384      0       >24h  198078      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 3")

	fmt.Println("-------------")
	part1(sample(`vJrwpWtwJgWrhcsFMMfFFhFp
	jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
	PmmdzqPrVvPwwTWBwg
	wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
	ttgJtRGJQctTZtZT
	CrZsJsPPZsGzwwsLwLmpwMDw`))
	part1(fullInput())

	fmt.Println("-------------")
	part2(sample(`vJrwpWtwJgWrhcsFMMfFFhFp
	jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
	PmmdzqPrVvPwwTWBwg
	wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
	ttgJtRGJQctTZtZT
	CrZsJsPPZsGzwwsLwLmpwMDw`))
	part2(fullInput())
}

func part1(in input) {
	result := 0
	for _, l := range in.lines {
		compSize := len(l) / 2
		r1 := parseRucksack(l[0:compSize])
		r2 := parseRucksack(l[compSize:])
		//fmt.Printf("%v VS %v: %v\n", r1, r2, findOverlap(r1, r2))
		for _, v := range findOverlap(r1, r2) {
			//fmt.Printf("%v\n", v)
			result += v
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func itemValue(p int32) int {
	if 'A' <= p && p <= 'Z' {
		return int(p-'A') + 27
	}
	return int(p-'a') + 1
}

func parseRucksack(s string) []int {
	res := make([]int, len(s))
	for i, c := range s {
		res[i] = itemValue(c)
	}
	return res
}

func findOverlap(a, b []int) []int {
	m := make(map[int]bool)
	for _, v := range a {
		m[v] = false
	}
	for _, v := range b {
		if _, ok := m[v]; ok {
			m[v] = true
		}
	}
	keys := make([]int, 0)
	for k, v := range m {
		if v {
			keys = append(keys, k)
		}
	}
	return keys
}

func part2(in input) {
	result := 0
	var group []int
	for i, l := range in.lines {
		if i%3 == 0 && len(group) > 0 {
			result += group[0]
		}
		if i%3 == 0 {
			group = parseRucksack(l)
		} else {
			group = findOverlap(group, parseRucksack(l))
		}
		//fmt.Printf("%v\n", group)
	}
	result += group[0]
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2022/day_03/input.txt")
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
