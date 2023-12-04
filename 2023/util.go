package main

import (
	"bufio"
	"log"
	"os"
	"strconv"
	"strings"
)

type input struct {
	kind  string
	lines []string
}

func fullInput(p string) input {
	file, err := os.Open(p)
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

func parseNums(s string) []int {
	return parseNumsWithSep(s, " ")
}

func parseNumsWithSep(s, sep string) []int {
	nums := strings.Split(strings.TrimSpace(s), sep)
	result := make([]int, 0)
	for _, n := range nums {
		nws := strings.TrimSpace(n)
		if len(nws) == 0 {
			continue
		}
		v, err := strconv.Atoi(nws)
		if err != nil {
			log.Fatalf("Couldn't parse %v as number: %v", nws, err)
		}
		result = append(result, v)
	}
	return result
}

func toMap[T comparable](ts []T) map[T]bool {
	result := make(map[T]bool)
	for _, t := range ts {
		result[t] = false
	}
	return result
}
