package main

import (
	"fmt"
	"log"
)

// @formatter:off
/*
--------Part 1--------   -------Part 2--------
    Time   Rank  Score       Time  Rank  Score
01:34:51   6521      0   02:51:40  3916      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 10")
	inputFile := "2023/day_10/input.txt"
	sampleLines := `.....
.S-7.
.|.|.
.L-J.
.....`
	sampleLines2 := `-L|F7
	7S-7|
	L|7||
	-L-J|
	L|-JF`
	sampleLines3 := `..F7.
	.FJ|.
	SJ.L7
	|F--J
	LJ...`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(sample(sampleLines2))
	part1(sample(sampleLines3))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	//	sampleLines4 := `...........
	//.S-------7.
	//.|F-----7|.
	//.||.....||.
	//.||.....||.
	//.|L-7.F-J|.
	//.|..|.|..|.
	//.L--J.L--J.
	//...........`
	//	part2(sample(sampleLines4))
	//	sampleLines5 := `.F----7F7F7F7F-7....
	//.|F--7||||||||FJ....
	//.||.FJ||||||||L7....
	//FJL7L7LJLJ||LJ.L-7..
	//L--J.L7...LJS7F-7L7.
	//....F-J..F7FJ|L7L7L7
	//....L7.F7||L7|.L7L7|
	//.....|FJLJ|FJ|F7|.LJ
	//....FJL-7.||.||||...
	//....L---J.LJ.LJLJ...`
	//	part2(sample(sampleLines5))
	//	sampleLines6 := `FF7FSF7F7F7F7F7F---7
	//L|LJ||||||||||||F--J
	//FL-7LJLJ||||||LJL-77
	//F--JF--7||LJLJ7F7FJ-
	//L---JF-JLJ.||-FJLJJ7
	//|F|F-JF---7F7-L7L|7|
	//|FFJF7L7F-JF7|JL---7
	//7-L-JL7||F7|L7F-7F7|
	//L.L7LFJ|||||FJL7||LJ
	//L7JLJL-JLJLJL--JLJ.L`
	//	part2(sample(sampleLines6))
	part2(fullInput(inputFile))
}

func part1(in input) {
	start := findStart(in.lines)
	costs := make([][]int64, len(in.lines))
	visited := make([][]bool, len(in.lines))
	for i := range in.lines {
		costs[i] = make([]int64, len(in.lines[i]))
		visited[i] = make([]bool, len(in.lines[i]))
	}
	visited[start.x][start.y] = true
	stack := make([]*p, 0)
	dxs := []int{-1, 0, 0, 1}
	dys := []int{0, -1, 1, 0}
	for i, dx := range dxs {
		dy := dys[i]
		nx := start.x + dx
		ny := start.y + dy
		if nx < 0 || len(in.lines) <= nx || ny < 0 || len(in.lines[0]) <= ny {
			continue
		}
		nc := in.lines[nx][ny]
		if nc == '.' {
			continue
		}
		if dx == -1 && nc != '|' && nc != 'F' && nc != '7' {
			// non viable
			continue
		}
		if dx == 1 && nc != '|' && nc != 'L' && nc != 'J' {
			// non viable
			continue
		}
		if dy == -1 && nc != '-' && nc != 'L' && nc != 'F' {
			// non viable
			continue
		}
		if dy == -1 && nc != '-' && nc != 'L' && nc != 'F' {
			// non viable
			continue
		}
		if dy == 1 && nc != '-' && nc != '7' && nc != 'J' {
			// non viable
			continue
		}
		var d int
		if dx == -1 {
			d = '^'
		} else if dx == 1 {
			d = 'v'
		} else if dy == 1 {
			d = '>'
		} else {
			d = '<'
		}
		np := &p{x: nx, y: ny, dir: d, c: in.lines[nx][ny]}
		costs[nx][ny] = 1
		stack = append(stack, np)
	}
	for i := 0; i < 100_000; i++ {
		if i == 100_000-1 {
			fmt.Println("Out of loops")
		}
		if len(stack) == 0 {
			break
		}
		nextStack := make([]*p, 0)
		for _, cur := range stack {
			visited[cur.x][cur.y] = true
			//fmt.Printf("visiting %v\n", cur.ToString())
			np := cur.next(in.lines)
			if np == nil {
				//fmt.Printf("No viable move out of %v\n", cur.ToString())
				continue
			}
			if np.c == '.' {
				//fmt.Printf("Neighbor %v is a dot\n", np.ToString())
				continue
			}
			if !visited[np.x][np.y] {
				costs[np.x][np.y] = costs[cur.x][cur.y] + 1
				nextStack = append(nextStack, np)
				//fmt.Printf("Adding %v to stack\n", np.ToString())
			} else {
				costs[np.x][np.y] = min(costs[np.x][np.y], costs[cur.x][cur.y]+1)
				//fmt.Printf("Skipping %v because it's already visited\n", np.ToString())
			}
		}
		stack = nextStack
	}

	result := int64(0)
	for _, cs := range costs {
		for _, c := range cs {
			result = max(result, c)
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type p struct {
	x   int
	y   int
	c   uint8
	dir int
}

func (self *p) ToString() string {
	return fmt.Sprintf("[%d, %d]: %c (dir=%c)", self.x, self.y, self.c, self.dir)
}

func (self *p) next(field []string) *p {
	nx := self.x
	ny := self.y
	nd := int('-')
	switch true {
	case self.c == '|' && self.dir == '^':
		{
			nd = self.dir
			nx -= 1
		}
	case self.c == '|' && self.dir == 'v':
		{
			nd = self.dir
			nx += 1
		}
	case self.c == '-' && self.dir == '>':
		{
			nd = self.dir
			ny += 1
		}
	case self.c == '-' && self.dir == '<':
		{
			nd = self.dir
			ny -= 1
		}
	case self.c == 'L' && self.dir == '<':
		{
			nd = '^'
			nx -= 1
		}
	case self.c == 'L' && self.dir == 'v':
		{
			nd = '>'
			ny += 1
		}
	case self.c == 'J' && self.dir == 'v':
		{
			nd = '<'
			ny -= 1
		}
	case self.c == 'J' && self.dir == '>':
		{
			nd = '^'
			nx -= 1
		}
	case self.c == '7' && self.dir == '>':
		{
			nd = 'v'
			nx += 1
		}
	case self.c == '7' && self.dir == '^':
		{
			nd = '<'
			ny -= 1
		}
	case self.c == 'F' && self.dir == '^':
		{
			nd = '>'
			ny += 1
		}
	case self.c == 'F' && self.dir == '<':
		{
			nd = 'v'
			nx += 1
		}
	default:
		fmt.Printf("No viable move out of %v\n", self.ToString())
		return nil
	}
	return &p{x: nx, y: ny, c: field[nx][ny], dir: nd}
}

func findStart(field []string) *p {
	for row, s := range field {
		for col, c := range s {
			if c == 'S' {
				return &p{x: row, y: col}
			}
		}
	}
	log.Fatalln("Couldn't find a start in", field)
	return nil
}

func part2(in input) {
	start := findStart(in.lines)
	costs := make([][]int64, len(in.lines))
	visited := make([][]bool, len(in.lines))
	for i := range in.lines {
		costs[i] = make([]int64, len(in.lines[i]))
		visited[i] = make([]bool, len(in.lines[i]))
	}
	visited[start.x][start.y] = true
	stack := make([]*p, 0)
	dxs := []int{-1, 0, 0, 1}
	dys := []int{0, -1, 1, 0}
	for i, dx := range dxs {
		dy := dys[i]
		nx := start.x + dx
		ny := start.y + dy
		if nx < 0 || len(in.lines) <= nx || ny < 0 || len(in.lines[0]) <= ny {
			continue
		}
		nc := in.lines[nx][ny]
		if nc == '.' {
			continue
		}
		if dx == -1 && nc != '|' && nc != 'F' && nc != '7' {
			// non viable
			continue
		}
		if dx == 1 && nc != '|' && nc != 'L' && nc != 'J' {
			// non viable
			continue
		}
		if dy == -1 && nc != '-' && nc != 'L' && nc != 'F' {
			// non viable
			continue
		}
		if dy == -1 && nc != '-' && nc != 'L' && nc != 'F' {
			// non viable
			continue
		}
		if dy == 1 && nc != '-' && nc != '7' && nc != 'J' {
			// non viable
			continue
		}
		var d int
		if dx == -1 {
			d = '^'
		} else if dx == 1 {
			d = 'v'
		} else if dy == 1 {
			d = '>'
		} else {
			d = '<'
		}
		np := &p{x: nx, y: ny, dir: d, c: in.lines[nx][ny]}
		costs[nx][ny] = 1
		stack = append(stack, np)
	}
	for i := 0; i < 100_000; i++ {
		if i == 100_000-1 {
			fmt.Println("Out of loops")
		}
		if len(stack) == 0 {
			break
		}
		nextStack := make([]*p, 0)
		for _, cur := range stack {
			visited[cur.x][cur.y] = true
			//fmt.Printf("visiting %v\n", cur.ToString())
			np := cur.next(in.lines)
			if np == nil {
				//fmt.Printf("No viable move out of %v\n", cur.ToString())
				continue
			}
			if np.c == '.' {
				//fmt.Printf("Neighbor %v is a dot\n", np.ToString())
				continue
			}
			if !visited[np.x][np.y] {
				costs[np.x][np.y] = costs[cur.x][cur.y] + 1
				nextStack = append(nextStack, np)
				//fmt.Printf("Adding %v to stack\n", np.ToString())
			} else {
				costs[np.x][np.y] = min(costs[np.x][np.y], costs[cur.x][cur.y]+1)
				//fmt.Printf("Skipping %v because it's already visited\n", np.ToString())
			}
		}
		stack = nextStack
	}

	result := 0
	costs[start.x][start.y] = -1
	ascii := map[int]int{'-': '─', '|': '│', 'F': '┌', '7': '┐', 'L': '└', 'J': '┘'}
	for x, cs := range costs {
		end := len(cs) - 1
		for end >= 0 && cs[end] == 0 {
			end -= 1
		}
		inside := false
		openWall := int('-')
		for y, c := range cs[0 : end+1] {
			if c != 0 {
				pc := int(in.lines[x][y])
				if pc == 'S' {
					fmt.Printf("%c\x1b[7m", pc)
				} else {
					fmt.Printf("%c", ascii[pc])
				}
				if pc == '-' {
					// never changes the state
					continue
				}
				if pc == '|' {
					// always changes the state
					inside = !inside
					continue
				}
				if pc == 'L' || pc == 'F' {
					openWall = pc
					continue
				}
				if openWall == 'L' && pc == 'J' {
					// no change
					continue
				}
				if openWall == 'F' && pc == '7' {
					// no change
					continue
				}
				inside = !inside
			} else {
				if inside {
					result += 1
					fmt.Print("•")
				} else {
					fmt.Print(".")
				}
			}
		}
		fmt.Print("\x1b[0m\n")
	}
	fmt.Println("⚠️ Given the diagram above, manually adjust the result for missing/added points because of S (its line is highlighted) ⚠️")
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
