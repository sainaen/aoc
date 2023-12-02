package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

// @formatter:off
/*
-------Part 1--------   -------Part 2--------
    Time  Rank  Score       Time  Rank  Score
00:15:32  3051      0   00:21:16  3138      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 2")

	fmt.Println("-------------")
	part1(sample(`Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
	Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
	Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
	Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
	Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`))
	part1(fullInput())

	fmt.Println("-------------")
	part2(sample(`Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
	Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
	Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
	Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
	Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`))
	part2(fullInput())
}

func parseSet(s string) []int {
	res := []int{0, 0, 0}
	components := strings.Split(s, ", ")
	for _, component := range components {
		parts := strings.Split(strings.TrimSpace(component), " ")
		n, _ := strconv.Atoi(strings.TrimSpace(parts[0]))
		switch strings.TrimSpace(parts[1]) {
		case "red":
			res[0] += n
		case "green":
			res[1] += n
		case "blue":
			res[2] += n
		}
	}
	return res
}

func part1(in input) {
	// only 12 red cubes, 13 green cubes, and 14 blue
	red := 12
	green := 13
	blue := 14
	result := 0
	for _, l := range in.lines {
		parts := strings.SplitN(l, ":", 2)
		gameId, _ := strconv.Atoi(strings.TrimPrefix(parts[0], "Game "))
		sets := strings.Split(parts[1], ";")
		isPossible := true
		for _, s := range sets {
			//fmt.Printf("%d `%s`: %v\n", gameId, s, parseSet(s))
			set := parseSet(s)
			if set[0] > red || set[1] > green || set[2] > blue {
				isPossible = false
			}
		}
		//fmt.Printf("%d %v\n", gameId, game)
		if isPossible {
			result += gameId
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func part2(in input) {
	result := 0
	for _, l := range in.lines {
		parts := strings.SplitN(l, ":", 2)
		//gameId, _ := strconv.Atoi(strings.TrimPrefix(parts[0], "Game "))
		sets := strings.Split(parts[1], ";")
		game := []int{0, 0, 0}
		for _, s := range sets {
			//fmt.Printf("%d `%s`: %v\n", gameId, s, parseSet(s))
			set := parseSet(s)
			game[0] = max(game[0], set[0])
			game[1] = max(game[1], set[1])
			game[2] = max(game[2], set[2])
		}
		gamePower := game[0] * game[1] * game[2]
		//fmt.Printf("%d %v %d\n", gameId, game, gamePower)
		result += gamePower
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2023/day_02/input.txt")
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
