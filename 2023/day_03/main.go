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
--------Part 1--------   -------Part 2--------
    Time   Rank  Score       Time  Rank  Score
01:40:15  10491      0   02:00:08  8872      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 3")

	fmt.Println("-------------")
	part1(sample(`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`))
	part1(fullInput()) // not 506273, and not 503362 (numbers with signs), and not 322449 (unique part numbers) ; mistake: missed the numbers at the end of the line

	fmt.Println("-------------")
	part2(sample(`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`))
	part2(fullInput())
}

func part1(in input) {
	result := 0
	//highlight := make([][]bool, len(in.lines))
	//for x, l := range in.lines {
	//	highlight[x] = make([]bool, len(l))
	//}
	for x, l := range in.lines {
		//fmt.Printf("[%02d] ", x)
		hasNeighbors := false
		num := 0
		for y, c := range l {
			if '0' <= c && c <= '9' {
				d := int(c - '0')
				num = num*10 + d
				nx, ny := getNeighbor(in.lines, x, y)
				if nx != -1 && ny != -1 {
					//highlight[nx][ny] = true
					//highlight[x][y] = true
					hasNeighbors = true
				}
			} else if num > 0 {
				if hasNeighbors {
					result += num
					//fmt.Printf("%v ", num)
					//for i := 1; int(math.Pow10(i)) <= num*10; i++ {
					//	highlight[x][y-i] = true
					//}
				}
				hasNeighbors = false
				num = 0
			}
		}
		if hasNeighbors && num > 0 {
			result += num
			//fmt.Printf("%v ", num)
			//for i := 1; int(math.Pow10(i)) <= num*10; i++ {
			//	highlight[x][len(l)-i] = true
			//}
		}
		//fmt.Printf("\n")
	}
	//for x, l := range in.lines {
	//	fmt.Printf("[%02d] ", x)
	//	for y, c := range l {
	//		if highlight[x][y] {
	//			if '0' <= c && c <= '9' {
	//				fmt.Printf("\x1b[7m%c\x1b[0m", c)
	//				//fmt.Printf("%c", c)
	//			} else {
	//				fmt.Printf("\x1b[34m%c\x1b[0m", c)
	//			}
	//		} else {
	//			if '0' <= c && c <= '9' {
	//				//fmt.Printf("\x1b[7m%c\x1b[0m", c)
	//				fmt.Printf("%c", c)
	//			} else if c != '.' {
	//				fmt.Printf("\x1b[41m%c\x1b[0m", c)
	//			} else {
	//				fmt.Printf(" ")
	//			}
	//		}
	//	}
	//	fmt.Printf("\n")
	//}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func getNeighbor(field []string, x, y int) (int, int) {
	pos := [][]int{
		{-1, -1},
		{-1, 0},
		{-1, 1},
		{0, -1},
		{0, 1},
		{1, -1},
		{1, 0},
		{1, 1},
	}
	for _, p := range pos {
		nx := p[0] + x
		ny := p[1] + y
		if nx >= 0 && nx < len(field) && ny >= 0 && ny < len(field[x]) {
			n := field[nx][ny]
			if n != '.' && (n < '0' || '9' < n) {
				return nx, ny
			}
		}
	}
	return -1, -1
}

func part2(in input) {
	result := 0
	gears := make([][][]int, len(in.lines))
	for x, l := range in.lines {
		gears[x] = make([][]int, len(l))
		for y := range l {
			gears[x][y] = make([]int, 0)
		}
	}
	for x, l := range in.lines {
		neighborGears := make([][]int, 0)
		num := 0
		registeredNum := false
		for y, c := range l {
			if '0' <= c && c <= '9' {
				d := int(c - '0')
				num = num*10 + d
				nx, ny := getNeighbor(in.lines, x, y)
				if nx != -1 && ny != -1 {
					s := in.lines[nx][ny]
					if s == '*' && !registeredNum {
						neighborGears = append(neighborGears, []int{nx, ny})
						registeredNum = true
					}
				}
			} else if num > 0 {
				for _, neighborGear := range neighborGears {
					gx := neighborGear[0]
					gy := neighborGear[1]
					gears[gx][gy] = append(gears[gx][gy], num)
				}
				neighborGears = make([][]int, 0)
				num = 0
				registeredNum = false
			}
		}
		for _, neighborGear := range neighborGears {
			gx := neighborGear[0]
			gy := neighborGear[1]
			gears[gx][gy] = append(gears[gx][gy], num)
		}
	}
	for _, l := range gears {
		for _, ns := range l {
			if len(ns) == 2 {
				result += ns[0] * ns[1]
			}
		}
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2023/day_03/input.txt")
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
