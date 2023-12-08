package main

import (
	"fmt"
	"strings"
)

// @formatter:off
/*
--------Part 1--------   -------Part 2--------
    Time   Rank  Score       Time  Rank  Score
00:09:17   1980      0   00:50:27  3837      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 8")
	inputFile := "2023/day_08/input.txt"
	sampleLines := `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`
	sampleLines2 := `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`
	sampleLines3 := `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(sample(sampleLines2))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines3))
	part2(fullInput(inputFile))
}

func part1(in input) {
	nodes := make(map[string]*node, 0)
	for _, l := range in.lines[2:] {
		n := parseNode(l)
		nodes[n.id] = n
	}
	result := 0
	cur := "AAA"
outer:
	for i := 0; i < 1000000; i++ {
		for _, d := range in.lines[0] {
			result += 1
			if d == 'L' {
				cur = nodes[cur].left
			} else {
				cur = nodes[cur].right
			}
			if cur == "ZZZ" {
				break outer
			}
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type node struct {
	id    string
	left  string
	right string
}

func parseNode(l string) *node {
	parts := strings.Split(l, " = ")
	dirs := strings.Split(strings.TrimSpace(parts[1]), ", ")
	left := dirs[0][1:]
	right := dirs[1][0 : len(dirs[1])-1]
	return &node{id: parts[0], left: left, right: right}
}
func gcd(a, b uint64) uint64 {
	for b != 0 {
		t := b
		b = a % b
		a = t
	}
	return a
}
func lcm(a, b uint64) uint64 {
	return a * b / gcd(a, b)
}

func lcmSlice(ints []uint64) uint64 {
	result := lcm(ints[0], ints[1])
	for _, i := range ints[2:] {
		result = lcm(result, i)
	}
	return result
}

func part2(in input) {
	nodes := make(map[string]*node)
	for _, l := range in.lines[2:] {
		n := parseNode(l)
		nodes[n.id] = n
	}
	cur := make([]string, 0)
	for n := range nodes {
		if strings.HasSuffix(n, "A") {
			cur = append(cur, n)
		}
	}
	steps := make([]uint64, len(cur))
	for i, c := range cur {
	outer:
		for p := 0; p < 100000; p++ {
			if p == 100000-1 {
				fmt.Println("Too many loops")
			}
			for _, d := range in.lines[0] {
				if strings.HasSuffix(c, "Z") {
					break outer
				}
				steps[i] += 1
				//fmt.Printf("%d before %c: %v\n", result, d, cur)
				if d == 'L' {
					c = nodes[c].left
				} else {
					c = nodes[c].right
				}
				//fmt.Printf("%d after %c: %v\n", result, d, cur)
			}
		}
	}
	//fmt.Println(steps)
	result := lcmSlice(steps)
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
