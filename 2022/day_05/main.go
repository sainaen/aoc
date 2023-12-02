package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"
)

// @formatter:off
/*
--------Part 1---------   --------Part 2---------
    Time    Rank  Score       Time    Rank  Score
    >24h  159097      0       >24h  156014      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 5")

	fmt.Println("-------------")
	part1(3, 3, sample(`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`))
	part1(9, 8, fullInput())

	fmt.Println("-------------")
	part2(3, 3, sample(`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`))
	part2(9, 8, fullInput())
}

func part1(width, height int, in input) {
	stacks := make([][]uint8, width)
	for i := 0; i < width; i++ {
		stacks[i] = make([]uint8, 0)
	}
	for i := 0; i < height; i++ {
		l := in.lines[height-i-1]
		for j := 0; j < width; j++ {
			if l[1+j*4] != ' ' {
				stacks[j] = append(stacks[j], l[1+j*4])
			}
		}
	}
	//printStacks(stacks)
	r := regexp.MustCompile(`move (\d+) from (\d) to (\d)`)
	for i := height + 2; i < len(in.lines); i++ {
		m := r.FindAllStringSubmatch(in.lines[i], -1)
		qty, _ := strconv.Atoi(m[0][1])
		from, _ := strconv.Atoi(m[0][2])
		to, _ := strconv.Atoi(m[0][3])
		//fmt.Printf("moving %d of cargo from %d to %d\n", qty, from, to)
		move(stacks, from-1, to-1, qty, true)
		//printStacks(stacks)
	}
	result := make([]uint8, width)
	for i, s := range stacks {
		result[i] = s[len(s)-1]
	}
	fmt.Printf("part 1 (%s): %s\n", in.kind, result)
}

func printStacks(stacks [][]uint8) {
	height := -1
	for i, s := range stacks {
		height = max(height, len(s))
		fmt.Printf(" %d ", i+1)
		if i < len(stacks)-1 {
			fmt.Printf(" ")
		}
	}
	fmt.Printf("\n")
	for i := 0; i < height; i++ {
		for j := 0; j < len(stacks); j++ {
			if len(stacks[j]) <= i {
				fmt.Printf("   ")
			} else {
				fmt.Printf("[%c]", stacks[j][i])
			}
			if j < len(stacks)-1 {
				fmt.Printf(" ")
			}
		}
		fmt.Printf("\n")
	}
}

func move(stacks [][]uint8, from, to, qty int, rev bool) {
	t := stacks[from][len(stacks[from])-qty:]
	if rev {
		r := make([]uint8, len(t))
		for i := len(t) - 1; i >= 0; i-- {
			r[len(t)-i-1] = t[i]
		}
		t = r
	}
	//fmt.Printf("moving: t=%s\n", t)
	stacks[from] = stacks[from][0 : len(stacks[from])-qty]
	stacks[to] = append(stacks[to], t...)
}

func part2(width, height int, in input) {
	stacks := make([][]uint8, width)
	for i := 0; i < width; i++ {
		stacks[i] = make([]uint8, 0)
	}
	for i := 0; i < height; i++ {
		l := in.lines[height-i-1]
		for j := 0; j < width; j++ {
			if l[1+j*4] != ' ' {
				stacks[j] = append(stacks[j], l[1+j*4])
			}
		}
	}
	//printStacks(stacks)
	r := regexp.MustCompile(`move (\d+) from (\d) to (\d)`)
	for i := height + 2; i < len(in.lines); i++ {
		m := r.FindAllStringSubmatch(in.lines[i], -1)
		qty, _ := strconv.Atoi(m[0][1])
		from, _ := strconv.Atoi(m[0][2])
		to, _ := strconv.Atoi(m[0][3])
		//fmt.Printf("moving %d of cargo from %d to %d\n", qty, from, to)
		move(stacks, from-1, to-1, qty, false)
		//printStacks(stacks)
	}
	result := make([]uint8, width)
	for i, s := range stacks {
		result[i] = s[len(s)-1]
	}
	fmt.Printf("part 2 (%s): %s\n", in.kind, result)
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2022/day_05/input.txt")
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
		result = append(result, s.Text())
	}
	return result
}
