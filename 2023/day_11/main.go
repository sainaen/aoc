package main

import (
	"fmt"
)

// @formatter:off
/*
--------Part 1--------   -------Part 2--------
    Time   Rank  Score       Time  Rank  Score
00:18:59   1884      0   00:20:52  1052      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 11")
	inputFile := "2023/day_11/input.txt"
	sampleLines := `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	emptyRows := make([]int, len(in.lines))
	emptyCols := make([]int, len(in.lines[0]))
	for i, s := range in.lines {
		emptyRows[i] = 1
		for j, c := range s {
			if emptyCols[j] == 0 {
				emptyCols[j] = 1
			}
			if c != '.' {
				emptyRows[i] = -1
				emptyCols[j] = -1
			}
		}
	}
	universe := make([]*galaxy, 0)
	dx := 0
	for i, s := range in.lines {
		if emptyRows[i] == 1 {
			dx += 1
			continue
		}
		dy := 0
		for j, c := range s {
			if emptyCols[j] == 1 {
				dy += 1
				continue
			}
			if c == '#' {
				universe = append(universe, &galaxy{x: i + dx, y: j + dy})
			}
		}
	}
	result := 0
	for i := 0; i < len(universe)-1; i++ {
		g := universe[i]
		for j := i + 1; j < len(universe); j++ {
			result += g.dist(universe[j])
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type galaxy struct {
	x, y int
}

func (g galaxy) dist(other *galaxy) int {
	xdist := max(other.x, g.x) - min(other.x, g.x)
	ydist := max(other.y, g.y) - min(other.y, g.y)
	return xdist + ydist
}

func part2(in input) {
	emptyRows := make([]int, len(in.lines))
	emptyCols := make([]int, len(in.lines[0]))
	for i, s := range in.lines {
		emptyRows[i] = 1
		for j, c := range s {
			if emptyCols[j] == 0 {
				emptyCols[j] = 1
			}
			if c != '.' {
				emptyRows[i] = -1
				emptyCols[j] = -1
			}
		}
	}
	universe := make([]*galaxy, 0)
	dx := 0
	for i, s := range in.lines {
		if emptyRows[i] == 1 {
			dx += 1000_000 - 1
			continue
		}
		dy := 0
		for j, c := range s {
			if emptyCols[j] == 1 {
				dy += 1000_000 - 1
				continue
			}
			if c == '#' {
				universe = append(universe, &galaxy{x: i + dx, y: j + dy})
			}
		}
	}
	result := 0
	for i := 0; i < len(universe)-1; i++ {
		g := universe[i]
		for j := i + 1; j < len(universe); j++ {
			result += g.dist(universe[j])
		}
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
