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
--------Part 1---------   --------Part 2---------
    Time    Rank  Score       Time    Rank  Score
    >24h  242794      0       >24h  230550      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 2")

	fmt.Println("-------------")
	part1(sample(`A Y
	B X
	C Z`))
	part1(fullInput())

	fmt.Println("-------------")
	part2(sample(`A Y
	B X
	C Z`))
	part2(fullInput())
}

const elfRock = "A"
const elfPaper = "B"
const elfScissors = "C"
const myRock = "X"
const myPaper = "Y"
const myScissors = "Z"
const rock = 0
const paper = 1
const scissors = 2

const won = 6
const draw = 3
const lost = 0

func part1(in input) {
	result := 0
	for _, l := range in.lines {
		cols := strings.Split(l, " ")
		elfMove := parseElfMove(cols[0])
		myMove := parseMyMove(cols[1])
		result += (myMove + 1) + roundScore(elfMove, myMove)
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func parseElfMove(m string) int {
	switch m {
	case elfRock:
		return rock
	case elfPaper:
		return paper
	case elfScissors:
		return scissors
	}
	return -1
}

func parseMyMove(m string) int {
	switch m {
	case myRock:
		return rock
	case myPaper:
		return paper
	case myScissors:
		return scissors
	}
	return -1
}

func roundScore(elfMove, myMove int) int {
	if elfMove == myMove {
		return draw
	}
	if elfMove == paper && myMove == scissors ||
		elfMove == rock && myMove == paper ||
		elfMove == scissors && myMove == rock {
		return won
	}
	return lost
}

const mustLose = "X"
const mustDraw = "Y"
const mustWin = "Z"

func parseGameResult(res string) int {
	switch res {
	case mustLose:
		return lost
	case mustDraw:
		return draw
	case mustWin:
		return won
	}
	return -1
}

func selectMyMove(elfMove int, gameResult int) int {
	toWin := map[int]int{rock: paper, paper: scissors, scissors: rock}
	toLose := map[int]int{rock: scissors, paper: rock, scissors: paper}
	if gameResult == draw {
		return elfMove
	}
	if gameResult == won {
		return toWin[elfMove]
	}
	return toLose[elfMove]
}

func part2(in input) {
	result := 0
	for _, l := range in.lines {
		cols := strings.Split(l, " ")
		elfMove := parseElfMove(cols[0])
		gameResult := parseGameResult(cols[1])
		myMove := selectMyMove(elfMove, gameResult)
		result += (myMove + 1) + gameResult
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}

type input struct {
	kind  string
	lines []string
}

func fullInput() input {
	file, err := os.Open("2022/day_02/input.txt")
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
