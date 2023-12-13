package main

import (
	"fmt"
	"log"
)

// @formatter:off
/*
--------Part 1--------   -------Part 2--------
    Time   Rank  Score       Time  Rank  Score
00:25:16   1657      0   00:53:02  2351      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 13")
	inputFile := "2023/day_13/input.txt"
	sampleLines := `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	//	part1(sample(`.#..#......
	//..#.#......
	//..#...#....
	//#.##...####
	//.#..#..####
	//#.#.##.####
	//###..#.#..#`))
	part1(fullInput(inputFile)) // not: 39298

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(sample(`#.#.###
..##.##
...####
##....#
##....#
...####
..##.##
#.#.###
#.#####
....##.
.#...#.
#.#####
#....##
#..##.#
#..##.#
#..#.##
#.#####`))
	part2(fullInput(inputFile))
}

func part1(in input) {
	result := 0
	pattern := make([]string, 0)
	for _, l := range in.lines {
		if len(l) == 0 {
			v := findVerticalReflection(pattern) + findHorizontalReflection(pattern)*100
			//fmt.Println("vertical", findVerticalReflection(pattern))
			//fmt.Println("horizontal", findHorizontalReflection(pattern))
			result += v
			//for j := 0; j < len(pattern); j++ {
			//	fmt.Println(pattern[j])
			//}
			//fmt.Println(v)
			//fmt.Println("--")
			pattern = make([]string, 0)
		} else {
			pattern = append(pattern, l)
		}
	}
	v := findVerticalReflection(pattern) + findHorizontalReflection(pattern)*100
	//fmt.Println("vertical", findVerticalReflection(pattern))
	//fmt.Println("horizontal", findHorizontalReflection(pattern))
	result += v
	//for j := 0; j < len(pattern); j++ {
	//	fmt.Println(pattern[j])
	//}
	//fmt.Println(v)
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func findHorizontalReflection(pattern []string) int {
	for i := 0; i < len(pattern)-1; i++ {
		if isHorizontalReflection(pattern, i) {
			return i + 1
		}
	}
	return 0
}

func findHorizontalReflectionSkip(pattern []string, skip int) int {
	for i := 0; i < len(pattern)-1; i++ {
		if skip > 0 && i == skip-1 {
			continue
		}
		if isHorizontalReflection(pattern, i) {
			return i + 1
		}
	}
	return 0
}

func isHorizontalReflection(pattern []string, pos int) bool {
	i := pos
	j := pos + 1
	for i >= 0 && j < len(pattern) {
		s1 := pattern[i]
		s2 := pattern[j]
		for c := 0; c < len(s1); c++ {
			if s1[c] != s2[c] {
				return false
			}
		}
		i -= 1
		j += 1
	}
	return true
}

func findVerticalReflection(pattern []string) int {
	for i := 0; i < len(pattern[0])-1; i++ {
		if isVerticalReflection(pattern, i) {
			return i + 1
		}
	}
	return 0
}

func findVerticalReflectionSkip(pattern []string, skip int) int {
	for i := 0; i < len(pattern[0])-1; i++ {
		if skip > 0 && i == skip-1 {
			continue
		}
		if isVerticalReflection(pattern, i) {
			return i + 1
		}
	}
	return 0
}

func isVerticalReflection(pattern []string, pos int) bool {
	for _, l := range pattern {
		i := pos
		j := pos + 1
		for i >= 0 && j < len(l) {
			if l[i] != l[j] {
				return false
			}
			i -= 1
			j += 1
		}
	}
	return true
}

func correctSmudge(pattern []string, x, y int) []string {
	result := make([]string, len(pattern))
	for i := 0; i < len(pattern); i++ {
		l := pattern[i]
		if i != x {
			result[i] = l
		} else {
			c := l[y]
			if c == '#' {
				c = '.'
			} else {
				c = '#'
			}
			if y == 0 {
				result[i] = fmt.Sprintf("%c%s", c, l[1:])
			} else if y == len(l)-1 {
				result[i] = fmt.Sprintf("%s%c", l[0:y], c)
			} else {
				result[i] = fmt.Sprintf("%s%c%s", l[0:y], c, l[y+1:])
			}
		}
	}
	return result
}

func findDifferentMirror(pattern []string) int {
	originalVReflection := findVerticalReflection(pattern)
	originalHReflection := findHorizontalReflection(pattern)
	//originalMirror := findVerticalReflection(pattern) + findHorizontalReflection(pattern)*100
	//fmt.Println("original pattern:")
	//printPattern(pattern)
	//fmt.Println("original mirror", originalVReflection, originalHReflection)
	for i := 0; i < len(pattern); i++ {
		for j := 0; j < len(pattern[i]); j++ {
			//fmt.Println("corrected pattern at", i, j)
			fixedPattern := correctSmudge(pattern, i, j)
			//printPattern(fixedPattern)
			vReflection := findVerticalReflectionSkip(fixedPattern, originalVReflection)
			hReflection := findHorizontalReflectionSkip(fixedPattern, originalHReflection)
			if hReflection == 0 && vReflection == 0 {
				continue
			}
			//fmt.Println("mirror", vReflection, 0)
			if vReflection > 0 && vReflection != originalVReflection {
				return vReflection
			}
			//fmt.Println("mirror", 0, hReflection)
			if hReflection != 0 && hReflection != originalHReflection {
				return hReflection * 100
			}
		}
	}
	printPattern(pattern)
	log.Fatalln("Couldn't find a new mirror!")
	return 0
}

func printPattern(pattern []string) {
	for _, l := range pattern {
		fmt.Println(l)
	}
}

func part2(in input) {
	result := 0
	pattern := make([]string, 0)
	for _, l := range in.lines {
		if len(l) == 0 {
			//fmt.Println("vertical", findVerticalReflection(pattern))
			//fmt.Println("horizontal", findHorizontalReflection(pattern))
			result += findDifferentMirror(pattern)
			//for j := 0; j < len(pattern); j++ {
			//	fmt.Println(pattern[j])
			//}
			//fmt.Println(v)
			//fmt.Println("--")
			pattern = make([]string, 0)
		} else {
			pattern = append(pattern, l)
		}
	}
	v := findDifferentMirror(pattern)
	//fmt.Println("vertical", findVerticalReflection(pattern))
	//fmt.Println("horizontal", findHorizontalReflection(pattern))
	result += v
	//for j := 0; j < len(pattern); j++ {
	//	fmt.Println(pattern[j])
	//}
	//fmt.Println(v)
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
