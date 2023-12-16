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
	fmt.Printf("part 1 (%s): %v\n", in.kind, countEnergized(in.lines, 0, 0, '>'))
}

type energizedField struct {
	beamsField        [][]map[uint8]bool
	processedAllBeams [][]bool
}

func newEnergizedField(height, width int) *energizedField {
	beams := make([][]map[uint8]bool, height)
	processedAllBeams := make([][]bool, height)
	for i := range beams {
		processedAllBeams[i] = make([]bool, width)
		beams[i] = make([]map[uint8]bool, width)
		for j := range beams[i] {
			processedAllBeams[i][j] = true
			beams[i][j] = make(map[uint8]bool)
		}
	}
	return &energizedField{beamsField: beams, processedAllBeams: processedAllBeams}
}

func (e *energizedField) addBeam(x, y int, dir uint8) {
	e.processedAllBeams[x][y] = false
	e.beamsField[x][y][dir] = false
}
func (e *energizedField) hasBeam(x, y int, dir uint8) bool {
	_, ok := e.beamsField[x][y][dir]
	return ok
}

func (e *energizedField) moveBeam(x, y int, dir uint8) bool {
	switch dir {
	case '^':
		x -= 1
	case 'v':
		x += 1
	case '>':
		y += 1
	case '<':
		y -= 1
	default:
		log.Fatalf("Unknown direction %c for beam at x=%d, y=%d\n", dir, x, y)
	}
	if 0 <= x && x < len(e.beamsField) && 0 <= y && y < len(e.beamsField[0]) {
		if !e.hasBeam(x, y, dir) {
			e.addBeam(x, y, dir)
			return true
		}
	}
	return false
}

func newDir(c, dir uint8) []uint8 {
	if c == '.' {
		return []uint8{dir}
	}
	if c == '-' {
		if dir == '>' || dir == '<' {
			return []uint8{dir}
		}
		return []uint8{'<', '>'}
	}
	if c == '|' {
		if dir == '^' || dir == 'v' {
			return []uint8{dir}
		}
		return []uint8{'^', 'v'}
	}
	if c == '/' {
		switch dir {
		case '>':
			return []uint8{'^'}
		case '<':
			return []uint8{'v'}
		case '^':
			return []uint8{'>'}
		case 'v':
			return []uint8{'<'}
		}
	}
	if c == '\\' {
		switch dir {
		case '>':
			return []uint8{'v'}
		case '<':
			return []uint8{'^'}
		case '^':
			return []uint8{'<'}
		case 'v':
			return []uint8{'>'}
		}
	}
	log.Fatalf("No new direction for %c hitting %c!\n", dir, c)
	return nil
}

func (e *energizedField) updateBeams(field []string) bool {
	updated := false
	for i := 0; i < len(e.beamsField); i += 1 {
		for j := 0; j < len(e.beamsField[i]); j += 1 {
			if e.processedAllBeams[i][j] {
				continue
			}
			for dir, isProcessed := range e.beamsField[i][j] {
				if isProcessed {
					continue
				}
				for _, ndir := range newDir(field[i][j], dir) {
					updated = e.moveBeam(i, j, ndir) || updated
				}
				e.beamsField[i][j][dir] = true
			}
			e.processedAllBeams[i][j] = true
		}
	}
	return updated
}

func (e *energizedField) count() int {
	result := 0
	for _, row := range e.beamsField {
		for _, v := range row {
			if len(v) > 0 {
				result += 1
			}
		}
	}
	return result
}

func countEnergized(field []string, x, y int, dir uint8) int {
	eField := newEnergizedField(len(field), len(field[0]))
	eField.addBeam(x, y, dir)
	for step := 0; step < 10_000; step++ {
		if step == 10_000-1 {
			fmt.Println("Out of loops :(")
		}
		if !eField.updateBeams(field) {
			return eField.count()
		}
	}
	return -1
}

func part2(in input) {
	result := 0
	for i := 0; i < len(in.lines[0]); i += 1 {
		result = max(result, countEnergized(in.lines, 0, i, 'v'))
		result = max(result, countEnergized(in.lines, len(in.lines)-1, i, '^'))
	}
	for i := 0; i < len(in.lines); i += 1 {
		result = max(result, countEnergized(in.lines, i, 0, '>'))
		result = max(result, countEnergized(in.lines, i, len(in.lines[0])-1, '<'))
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
