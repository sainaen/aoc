package main

import (
	"fmt"
	"log"
	"slices"
	"strings"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
    >24h  12976      0       >24h  11997      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 22")
	inputFile := "2023/day_22/input.txt"
	sampleLines := `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile)) // 1381: too high, 1379: too high, 1300: too high

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	nonEssential := part1_debug(in)
	result := len(nonEssential)
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func part1_debug(in input) []string {
	bricks := make([]*Brick, len(in.lines))
	for i, l := range in.lines {
		bricks[i] = newBrick(l, fmt.Sprintf("%d", i+1))
	}
	slices.SortFunc(bricks, func(a, b *Brick) int {
		return min(a.start.z, a.end.z) - min(b.start.z, b.end.z)
	})
	levels := make([][]*Brick, 1000)
	heightField := make([][]int, len(levels))
	for i := 0; i < len(levels); i++ {
		levels[i] = make([]*Brick, 0)
		heightField[i] = make([]int, len(levels))
	}
	for _, b := range bricks {
		height := 0
		for x := min(b.start.x, b.end.x); x <= max(b.start.x, b.end.x); x += 1 {
			for y := min(b.start.y, b.end.y); y <= max(b.start.y, b.end.y); y += 1 {
				height = max(height, heightField[x][y])
			}
		}
		levels[height+1] = append(levels[height+1], b)
		for x := min(b.start.x, b.end.x); x <= max(b.start.x, b.end.x); x += 1 {
			for y := min(b.start.y, b.end.y); y <= max(b.start.y, b.end.y); y += 1 {
				heightField[x][y] = height + b.height()
			}
		}
	}
	supports := make(map[string][]string)
	supportedBy := make(map[string][]string)
	for i, lvl := range levels {
		//fmt.Printf("%02d: ", i)
		for _, b := range lvl {
			supports[b.id] = make([]string, 0)
			for _, o := range levels[i+b.height()] {
				if _, ok := supportedBy[o.id]; !ok {
					supportedBy[o.id] = make([]string, 0)
				}
				if o.isSupportedBy(b) {
					//fmt.Printf("%v is supported by %v\n", o, b)
					supports[b.id] = append(supports[b.id], o.id)
					//fmt.Printf("%v: supports=%v\n", b.id, supports[b.id])
					supportedBy[o.id] = append(supportedBy[o.id], b.id)
					//fmt.Printf("%v: supportedBy=%v\n", o.id, supportedBy[o.id])
				}
			}
		}
	}
	//fmt.Println(supports["B<0001>"])
	//fmt.Println(supportedBy["A<0000>"])
	//fmt.Println(supportedBy["C<0002>"])
	//fmt.Println(supportedBy["C<0002>"])
	nonEssential := make([]string, 0)
	for _, b := range bricks {
		essential := false
		for _, oId := range supports[b.id] {
			if len(supportedBy[oId]) == 1 {
				essential = true
				break
			}
		}
		if !essential {
			//fmt.Println(b)
			nonEssential = append(nonEssential, b.id)
		}
	}
	return nonEssential
}

type Point struct {
	x int
	y int
	z int
}

func newPoint(l string) Point {
	coords := parseNumsWithSep(l, ",")
	return Point{x: coords[0], y: coords[1], z: coords[2]}
}

type Brick struct {
	id    string
	start Point
	end   Point
}

func newBrick(l string, id string) *Brick {
	ends := strings.Split(l, "~")
	return &Brick{id: id, start: newPoint(ends[0]), end: newPoint(ends[1])}
}

func (b *Brick) isSupportedBy(o *Brick) bool {
	//if min(b.start.z, b.end.z) < max(o.start.z, o.end.z) {
	//	return false
	//}
	intersectX := b.start.x <= o.start.x && o.start.x <= b.end.x ||
		b.start.x <= o.end.x && o.end.x <= b.end.x ||
		o.start.x <= b.start.x && b.start.x <= o.end.x ||
		o.start.x <= b.end.x && b.end.x <= o.end.x
	if !intersectX {
		return false
	}
	intersectY := b.start.y <= o.start.y && o.start.y <= b.end.y ||
		b.start.y <= o.end.y && o.end.y <= b.end.y ||
		o.start.y <= b.start.y && b.start.y <= o.end.y ||
		o.start.y <= b.end.y && b.end.y <= o.end.y
	if !intersectY {
		return false
	}
	if min(b.start.z, b.end.z) == max(o.start.z, o.end.z) {
		log.Fatalf("Unpexpected same Z coord of %v and %v\n", b, o)
	}
	return true
}

func (b *Brick) height() int {
	return max(b.start.z, b.end.z) - min(b.start.z, b.end.z) + 1
}

func part2(in input) {
	fmt.Printf("part 2 (%s): %v\n", in.kind, part2_debug(in))
}

func part2_debug(in input) int {
	bricks := make([]*Brick, len(in.lines))
	for i, l := range in.lines {
		bricks[i] = newBrick(l, fmt.Sprintf("%d", i+1))
	}
	slices.SortFunc(bricks, func(a, b *Brick) int {
		return min(a.start.z, a.end.z) - min(b.start.z, b.end.z)
	})
	levels := make([][]*Brick, 1000)
	heightField := make([][]int, len(levels))
	for i := 0; i < len(levels); i++ {
		levels[i] = make([]*Brick, 0)
		heightField[i] = make([]int, len(levels))
	}
	for _, b := range bricks {
		height := 0
		for x := min(b.start.x, b.end.x); x <= max(b.start.x, b.end.x); x += 1 {
			for y := min(b.start.y, b.end.y); y <= max(b.start.y, b.end.y); y += 1 {
				height = max(height, heightField[x][y])
			}
		}
		levels[height+1] = append(levels[height+1], b)
		for x := min(b.start.x, b.end.x); x <= max(b.start.x, b.end.x); x += 1 {
			for y := min(b.start.y, b.end.y); y <= max(b.start.y, b.end.y); y += 1 {
				heightField[x][y] = height + b.height()
			}
		}
	}
	supports := make(map[string][]string)
	supportedBy := make(map[string][]string)
	for i, lvl := range levels {
		//fmt.Printf("%02d: ", i)
		for _, b := range lvl {
			supports[b.id] = make([]string, 0)
			for _, o := range levels[i+b.height()] {
				if _, ok := supportedBy[o.id]; !ok {
					supportedBy[o.id] = make([]string, 0)
				}
				if o.isSupportedBy(b) {
					//fmt.Printf("%v is supported by %v\n", o, b)
					supports[b.id] = append(supports[b.id], o.id)
					//fmt.Printf("%v: supports=%v\n", b.id, supports[b.id])
					supportedBy[o.id] = append(supportedBy[o.id], b.id)
					//fmt.Printf("%v: supportedBy=%v\n", o.id, supportedBy[o.id])
				}
			}
		}
	}
	result := 0
	for _, b := range bricks {
		result += countFalls(b.id, supports, supportedBy, map[string]bool{})
	}
	return result
}

func countFalls(bId string, supports map[string][]string, supportedBy map[string][]string, falling map[string]bool) int {
	for _, oId := range supports[bId] {
		oSupportedByCount := len(supportedBy[oId])
		for _, oSupport := range supportedBy[oId] {
			if falling[oSupport] {
				oSupportedByCount -= 1
			} else if oSupport == bId {
				oSupportedByCount -= 1
			}
		}
		if oSupportedByCount == 0 {
			falling[oId] = true
			countFalls(oId, supports, supportedBy, falling)
		}
	}
	return len(falling)
}
