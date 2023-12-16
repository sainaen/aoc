package main

import (
	"fmt"
	"log"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
00:38:11   2232      0   00:48:05   2162      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 16")
	inputFile := "2023/day_16/input.txt"
	sampleLines := `.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	fmt.Printf("part 1 (%s): %v\n", in.kind, countEnergized(in.lines, &beam{x: 0, y: 0, dir: '>'}))
}

type beam struct {
	x   int
	y   int
	dir uint8
}

func countEnergized(field []string, initialBeam *beam) int {
	energized := make([][]map[uint8]bool, len(field))
	for i := range field {
		energized[i] = make([]map[uint8]bool, len(field[i]))
		for j := range energized[i] {
			energized[i][j] = make(map[uint8]bool)
		}
	}
	energized[initialBeam.x][initialBeam.y][initialBeam.dir] = true
	for step := 0; step < 10_000; step++ {
		if step == 10_000-1 {
			fmt.Println("Out of loops :(")
		}
		noMoreSteps := true
		for i := 0; i < len(energized); i += 1 {
			for j := 0; j < len(energized[i]); j += 1 {
				c := field[i][j]
				for dir := range energized[i][j] {
					nextBeams := make([]*beam, 0)
					if c == '.' {
						if dir == '>' {
							if j+1 < len(field[i]) {
								nextBeams = append(nextBeams, &beam{x: i, y: j + 1, dir: dir})
							}
						} else if dir == '<' {
							if j > 0 {
								nextBeams = append(nextBeams, &beam{x: i, y: j - 1, dir: dir})
							}
						} else if dir == '^' {
							if i > 0 {
								nextBeams = append(nextBeams, &beam{x: i - 1, y: j, dir: dir})
							}
						} else if dir == 'v' {
							if i+1 < len(field) {
								nextBeams = append(nextBeams, &beam{x: i + 1, y: j, dir: dir})
							}
						}
					} else if c == '-' {
						if dir == '>' {
							if j+1 < len(field[i]) {
								nextBeams = append(nextBeams, &beam{x: i, y: j + 1, dir: dir})
							}
						} else if dir == '<' {
							if j > 0 {
								nextBeams = append(nextBeams, &beam{x: i, y: j - 1, dir: dir})
							}
						} else if dir == '^' || dir == 'v' {
							if j > 0 {
								nextBeams = append(nextBeams, &beam{x: i, y: j - 1, dir: '<'})
							}
							if j+1 < len(field[i]) {
								nextBeams = append(nextBeams, &beam{x: i, y: j + 1, dir: '>'})
							}
						}
					} else if c == '|' {
						if dir == '>' || dir == '<' {
							if i > 0 {
								nextBeams = append(nextBeams, &beam{x: i - 1, y: j, dir: '^'})
							}
							if i+1 < len(field) {
								nextBeams = append(nextBeams, &beam{x: i + 1, y: j, dir: 'v'})
							}
						} else if dir == '^' {
							if i > 0 {
								nextBeams = append(nextBeams, &beam{x: i - 1, y: j, dir: dir})
							}
						} else if dir == 'v' {
							if i+1 < len(field) {
								nextBeams = append(nextBeams, &beam{x: i + 1, y: j, dir: dir})
							}
						}
					} else if c == '/' {
						if dir == '>' {
							if i > 0 {
								nextBeams = append(nextBeams, &beam{x: i - 1, y: j, dir: '^'})
							}
						} else if dir == '<' {
							if i+1 < len(field) {
								nextBeams = append(nextBeams, &beam{x: i + 1, y: j, dir: 'v'})
							}
						} else if dir == '^' {
							if j+1 < len(field[i]) {
								nextBeams = append(nextBeams, &beam{x: i, y: j + 1, dir: '>'})
							}
						} else if dir == 'v' {
							if j > 0 {
								nextBeams = append(nextBeams, &beam{x: i, y: j - 1, dir: '<'})
							}
						}
					} else if c == '\\' {
						if dir == '>' {
							if i+1 < len(field) {
								nextBeams = append(nextBeams, &beam{x: i + 1, y: j, dir: 'v'})
							}
						} else if dir == '<' {
							if i > 0 {
								nextBeams = append(nextBeams, &beam{x: i - 1, y: j, dir: '^'})
							}
						} else if dir == '^' {
							if j > 0 {
								nextBeams = append(nextBeams, &beam{x: i, y: j - 1, dir: '<'})
							}
						} else if dir == 'v' {
							if j+1 < len(field[i]) {
								nextBeams = append(nextBeams, &beam{x: i, y: j + 1, dir: '>'})
							}
						}
					} else {
						log.Fatalf("Unknown c=%c at [%d, %d]\n", c, i, j)
					}
					for _, nb := range nextBeams {
						if _, ok := energized[nb.x][nb.y][nb.dir]; !ok {
							noMoreSteps = false
							energized[nb.x][nb.y][nb.dir] = true
						}
					}
				}
			}
		}
		if noMoreSteps {
			break
		}
	}

	result := 0
	for _, row := range energized {
		for _, v := range row {
			if len(v) > 0 {
				result += 1
			}
		}
	}
	return result
}

func (b *beam) toString() string {
	return fmt.Sprintf("beam{x: %d, y: %d, dir: %c}", b.x, b.y, b.dir)
}

func part2(in input) {
	result := 0
	for i := 0; i < len(in.lines[0]); i += 1 {
		result = max(result, countEnergized(in.lines, &beam{x: 0, y: i, dir: 'v'}))
		result = max(result, countEnergized(in.lines, &beam{x: len(in.lines) - 1, y: i, dir: '^'}))
	}
	for i := 0; i < len(in.lines); i += 1 {
		result = max(result, countEnergized(in.lines, &beam{x: i, y: 0, dir: '>'}))
		result = max(result, countEnergized(in.lines, &beam{x: i, y: len(in.lines[0]) - 1, dir: '<'}))
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
