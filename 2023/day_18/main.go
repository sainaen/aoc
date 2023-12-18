package main

import (
	"fmt"
	"log"
	"math"
	"strconv"
	"strings"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
00:43:37   2480      0   15:40:55  12690      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 18")
	inputFile := "2023/day_18/input.txt"
	sampleLines := `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	//	part2(sample(`R 2 (#000000)
	//D 2 (#000000)
	//L 2 (#000000)
	//U 2 (#000000)`)) // must be: 9
	//	part2(sample(`R 2 (#000000)
	//D 3 (#000000)
	//L 1 (#000000)
	//U 1 (#000000)
	//L 1 (#000000)
	//U 1 (#000000)`)) // must be: 11
	//	part2(sample(`R 6 (#000000)
	//D 3 (#000000)
	//L 2 (#000000)
	//U 1 (#000000)
	//L 2 (#000000)
	//D 1 (#000000)
	//L 2 (#000000)
	//U 3 (#000000)`)) // must be: 27
	part2(fullInput(inputFile))
}

func part1(in input) {
	field := make([][]bool, 280)
	for i := 0; i < len(field); i += 1 {
		field[i] = make([]bool, 400)
	}
	x, y := 200, 130
	for _, l := range in.lines {
		dir, n := parseLine1(l)
		dx := 0
		dy := 0
		switch dir {
		case 'U':
			dx -= 1
		case 'D':
			dx += 1
		case 'R':
			dy += 1
		case 'L':
			dy -= 1
		default:
			log.Fatalln("Unknown direction", dir)
		}
		for i := 1; i <= n; i += 1 {
			field[x+dx*i][y+dy*i] = true
		}
		x = x + dx*n
		y = y + dy*n
	}
	m := make([][]uint8, len(field))
	for i := 0; i < len(field); i++ {
		m[i] = make([]uint8, len(field[i]))
	}
	queue := make([]*point, 1)
	queue[0] = &point{x: 0, y: 0}
	for len(queue) > 0 {
		p := queue[0]
		queue = queue[1:]
		for _, dx := range []int64{-1, 1, 0, 0} {
			for _, dy := range []int64{0, 0, -1, 1} {
				x := p.x + dx
				y := p.y + dy
				if 0 <= x && x < int64(len(field)) && 0 <= y && y < int64(len(field[x])) {
					if m[x][y] == 0 && !field[x][y] {
						m[x][y] = 'o'
						queue = append(queue, &point{x: x, y: y})
					}
				}
			}
		}
	}
	//for i := 0; i < len(field); i++ {
	//	for j := 0; j < len(field[i]); j++ {
	//		if field[i][j] || m[i][j] != 'o' {
	//			fmt.Print("#")
	//		} else {
	//			fmt.Print(" ")
	//		}
	//	}
	//	fmt.Println()
	//}
	result := 0
	for i := 0; i < len(field); i++ {
		for j := 0; j < len(field[i]); j++ {
			if field[i][j] || m[i][j] != 'o' {
				result += 1
			}
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type point struct {
	x int64
	y int64
}

func parseLine1(s string) (uint8, int) {
	parts := strings.Split(s, " ")
	dir := parts[0][0]
	n := noErr(strconv.Atoi(parts[1]))
	return dir, n
}

func parseLine2(s string) (uint8, int64) {
	parts := strings.Split(s, " ")
	color := strings.TrimSuffix(strings.TrimPrefix(parts[2], "(#"), ")")
	v := noErr(strconv.ParseInt(color[0:5], 16, 64))
	dirs := []uint8{'R', 'D', 'L', 'U'}
	return dirs[noErr(strconv.Atoi(color[5:]))], v
}

func abs(n int64) int64 {
	if n > 0 {
		return n
	}
	return -n
}

func dist(p1 *point, p2 *point) int64 {
	return abs(p2.x-p1.x) + abs(p2.y-p1.y)
}

func perimeter(coords []*point) int64 {
	result := int64(0)
	for i := range coords {
		p1 := coords[i]
		p2 := coords[(i+1)%len(coords)]
		result += dist(p1, p2)
	}
	return result
}

func shoelace(coords []*point) float64 {
	area := int64(0)
	for i := range coords {
		p1 := coords[i]
		p2 := coords[(i+1)%len(coords)]
		area += p1.x*p2.y - p2.x*p1.y
	}
	return float64(abs(area)) / 2.0
}

type step struct {
	dir uint8
	n   int64
}

func part2(in input) {
	steps := make([]*step, 0)
	for _, l := range in.lines {
		dir, n := parseLine2(l)
		steps = append(steps, &step{dir, int64(n)})
	}
	coords := make([]*point, 1)
	at := &point{x: 0, y: 0}
	coords[0] = at
	for i := range steps {
		s := steps[i]
		dx := int64(0)
		dy := int64(0)
		n := s.n
		switch s.dir {
		case 'U':
			dx = -n
		case 'D':
			dx = n
		case 'R':
			dy = n
		case 'L':
			dy = -n
		default:
			log.Fatalln("Unknown direction", s.dir)
		}
		p := &point{x: at.x + dx, y: at.y + dy}
		//fmt.Printf("from %v into %v via %v\n", at, p, s)
		coords = append(coords, p)
		at = p
	}
	// drop the last point in the cycle, it's equal to the start
	coords = coords[0 : len(coords)-1]
	area := shoelace(coords)
	//fmt.Printf("area: %v\n", area)
	p := perimeter(coords)
	//fmt.Printf("p: %v\n", p)
	result := math.Ceil(area) + float64(p)/2 + 1
	//result += shoelace(coords)
	fmt.Printf("part 2 (%s): %d\n", in.kind, int64(result))
}
