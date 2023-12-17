package main

import (
	"fmt"
	"slices"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
01:29:22   2137      0   01:44:42   1922      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 17")
	inputFile := "2023/day_17/input.txt"
	sampleLines := `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(sample(`111111111111
999999999991
999999999991
999999999991
999999999991`))
	part2(fullInput(inputFile)) // got too high: 1105, too low: 1097, and then just guessed 1101 ¯\_(ツ)_/¯
}

func part1(in input) {
	ts := make([][]map[uint8][]*t, len(in.lines))
	correctPath := make([][]uint8, len(in.lines))
	for i := 0; i < len(ts); i++ {
		ts[i] = make([]map[uint8][]*t, len(in.lines[0]))
		correctPath[i] = make([]uint8, len(in.lines[0]))
		for j := 0; j < len(ts[i]); j++ {
			ts[i][j] = make(map[uint8][]*t)
			for _, dir := range []uint8{'>', '<', '^', 'v'} {
				ts[i][j][dir] = make([]*t, 4)
			}
		}
	}
	f := make([]*t, 1)
	f[0] = &t{x: 0, y: 0, dir: '>', straightSteps: 0, loss: 0}
	ts[0][0]['>'][0] = f[0]
	correctPath[0][0] = '>'
	correctPath[0][1] = '>'
	correctPath[0][2] = '>'
	correctPath[1][2] = 'v'
	correctPath[1][3] = '>'
	correctPath[1][4] = '>'
	correctPath[1][5] = '>'
	correctPath[0][5] = '^'
	correctPath[0][6] = '>'
	correctPath[0][7] = '>'
	correctPath[0][8] = '>'
	correctPath[1][8] = 'v'
	correctPath[2][8] = 'v'
	correctPath[2][9] = '>'
	correctPath[2][10] = '>'
	correctPath[3][10] = 'v'
	correctPath[4][10] = 'v'
	correctPath[4][11] = '>'
	correctPath[5][11] = 'v'
	correctPath[6][11] = 'v'
	correctPath[7][11] = 'v'
	correctPath[7][12] = '>'
	correctPath[8][12] = 'v'
	correctPath[9][12] = 'v'
	correctPath[10][12] = 'v'
	correctPath[10][11] = '<'
	correctPath[11][11] = 'v'
	correctPath[12][11] = 'v'
	correctPath[12][12] = '>'
	for step := 0; step < 10_000; step++ {
		if step == 10_000-1 {
			//if step == 6 {
			fmt.Println("Out of loops! :)")
			break
		}
		nf := make([]*t, 0)
		for i := 0; i < len(f); i++ {
			ct := f[i]
			onPath := false && correctPath[ct.x][ct.y] == ct.dir
			if onPath {
				fmt.Printf("[%02d] considering %s\n", step, ct.sprint())
			}
			nDirs := make([]uint8, 0)
			switch ct.dir {
			case '>':
				fallthrough
			case '<':
				nDirs = append(nDirs, 'v')
				nDirs = append(nDirs, '^')
			case 'v':
				fallthrough
			case '^':
				nDirs = append(nDirs, '<')
				nDirs = append(nDirs, '>')
			}
			if ct.straightSteps < 2 {
				nDirs = append(nDirs, ct.dir)
			}
			if onPath {
				fmt.Printf("[%02d] can go: %s\n", step, nDirs)
			}
			for _, d := range nDirs {
				x := ct.x
				y := ct.y
				switch d {
				case '>':
					y += 1
				case '<':
					y -= 1
				case 'v':
					x += 1
				case '^':
					x -= 1
				}
				straightSteps := 0
				if ct.dir == d {
					straightSteps = ct.straightSteps + 1
				}
				if 0 <= x && x < len(in.lines) && 0 <= y && y < len(in.lines[0]) {
					nl := int(in.lines[x][y] - '0')
					cbt, ok := ts[x][y][d]
					nt := &t{x: x, y: y, loss: ct.loss + nl, straightSteps: straightSteps, dir: d, prev: ct}
					if onPath {
						fmt.Printf("[%02d] considering going from %v to %v\n", step, ct.sprint(), nt.sprint())
					}
					if !ok || cbt[straightSteps] == nil || cbt[straightSteps].loss > nt.loss {
						if onPath {
							if cbt[straightSteps] != nil {
								fmt.Printf("[%02d]     will replace %v\n", step, cbt[straightSteps].sprint())
							}
							fmt.Printf("[%02d] going\n", step)
						}
						ts[x][y][d][straightSteps] = nt
						nf = append(nf, nt)
					}
				}
			}
		}
		if len(nf) == 0 {
			//fmt.Printf("finished in %d steps\n", step)
			break
		}
		f = nf
	}
	result := 1000_000_000
	//var bestPath *t
	for _, cts := range ts[len(in.lines)-1][len(in.lines[0])-1] {
		for i := range cts {
			ct := cts[i]
			if ct == nil {
				continue
			}
			nresult := min(result, ct.loss)
			if nresult < result {
				result = nresult
				//bestPath = ct
			}
		}
	}
	//path := make([]string, 0)
	//for bestPath != nil {
	//	path = append(path, bestPath.sprint())
	//	bestPath = bestPath.prev
	//}
	//slices.Reverse(path)
	//for _, ct := range path {
	//	fmt.Println(ct)
	//}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type t struct {
	x             int
	y             int
	loss          int
	straightSteps int
	dir           uint8
	prev          *t
}

func (ct *t) sprint() string {
	return fmt.Sprintf("{[x=%02d, y=%02d] loss=%d, str=%d, dir=%c}", ct.x, ct.y, ct.loss, ct.straightSteps, ct.dir)
}

func part2(in input) {
	ts := make([][]map[uint8][]*t, len(in.lines))
	correctPath := make([][]uint8, len(in.lines))
	for i := 0; i < len(ts); i++ {
		ts[i] = make([]map[uint8][]*t, len(in.lines[0]))
		correctPath[i] = make([]uint8, len(in.lines[0]))
		for j := 0; j < len(ts[i]); j++ {
			ts[i][j] = make(map[uint8][]*t)
			for _, dir := range []uint8{'>', '<', '^', 'v'} {
				ts[i][j][dir] = make([]*t, 11)
			}
		}
	}
	f := make([]*t, 1)
	f[0] = &t{x: 0, y: 0, dir: '>', straightSteps: 0, loss: 0}
	ts[0][0]['>'][0] = f[0]
	for step := 0; step < 10_000; step++ {
		if step == 10_000-1 {
			//if step == 6 {
			fmt.Println("Out of loops! :)")
			break
		}
		nf := make([]*t, 0)
		for i := 0; i < len(f); i++ {
			ct := f[i]
			onPath := false
			if onPath {
				fmt.Printf("[%02d] considering %s\n", step, ct.sprint())
			}
			nDirs := make([]uint8, 0)
			if ct.straightSteps < 3 {
				nDirs = append(nDirs, ct.dir)
			} else {
				switch ct.dir {
				case '>':
					fallthrough
				case '<':
					nDirs = append(nDirs, 'v')
					nDirs = append(nDirs, '^')
				case 'v':
					fallthrough
				case '^':
					nDirs = append(nDirs, '<')
					nDirs = append(nDirs, '>')
				}
				if ct.straightSteps < 10 {
					nDirs = append(nDirs, ct.dir)
				}
			}
			if onPath {
				fmt.Printf("[%02d] can go: %s\n", step, nDirs)
			}
			for _, d := range nDirs {
				x := ct.x
				y := ct.y
				switch d {
				case '>':
					y += 1
				case '<':
					y -= 1
				case 'v':
					x += 1
				case '^':
					x -= 1
				}
				straightSteps := 0
				if ct.dir == d {
					straightSteps = ct.straightSteps + 1
				}
				if 0 <= x && x < len(in.lines) && 0 <= y && y < len(in.lines[0]) {
					nl := int(in.lines[x][y] - '0')
					cbt, ok := ts[x][y][d]
					nt := &t{x: x, y: y, loss: ct.loss + nl, straightSteps: straightSteps, dir: d, prev: ct}
					if onPath {
						fmt.Printf("[%02d] considering going from %v to %v\n", step, ct.sprint(), nt.sprint())
					}
					if !ok || cbt[straightSteps] == nil || cbt[straightSteps].loss > nt.loss {
						if onPath {
							if cbt[straightSteps] != nil {
								fmt.Printf("[%02d]     will replace %v\n", step, cbt[straightSteps].sprint())
							}
							fmt.Printf("[%02d] going\n", step)
						}
						ts[x][y][d][straightSteps] = nt
						nf = append(nf, nt)
					}
				}
			}
		}
		if len(nf) == 0 {
			//fmt.Printf("finished in %d steps\n", step)
			break
		}
		f = nf
	}
	result := 1000_000_000
	var bestPath *t
	for _, cts := range ts[len(in.lines)-1][len(in.lines[0])-1] {
		for i := range cts {
			ct := cts[i]
			if ct == nil || i < 3 {
				continue
			}
			nresult := min(result, ct.loss)
			if nresult < result {
				result = nresult
				bestPath = ct
			}
		}
	}
	path := make([]string, 0)
	for bestPath != nil {
		path = append(path, bestPath.sprint())
		bestPath = bestPath.prev
	}
	slices.Reverse(path)
	//for _, ct := range path {
	//fmt.Println(ct)
	//}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
