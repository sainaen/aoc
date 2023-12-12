package main

import (
	"fmt"
	"log"
	"slices"
	"strings"
)

// @formatter:off
/*
--------Part 1--------   -------Part 2--------
    Time   Rank  Score       Time  Rank  Score
01:15:39   5066      0   01:23:38  1551      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 12")
	inputFile := "2023/day_12/input.txt"
	sampleLines := `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	//part1(sample(`??.?? 2,1`))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	result := 0
	for _, l := range in.lines {
		parts := strings.Split(l, " ")
		r := &rec{m: parts[0], damaged: parseNumsWithSep(parts[1], ","), cache: map[string]int{}}
		c := r.countArrangements(0, 0, make([]uint8, 0))
		//fmt.Printf("%s | %v: %d\n", r.m, r.damaged, c)
		result += c
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type rec struct {
	m       string
	damaged []int
	cache   map[string]int
}

func (r *rec) countArrangements(mpos, dpos int, s []uint8) int {
	key := fmt.Sprintf("%d,%d", mpos, dpos)
	if _, ok := r.cache[key]; ok {
		return r.cache[key]
	}
	r.cache[key] = r.countArrangementsInner(mpos, dpos, s)
	return r.cache[key]
}

func (r *rec) countArrangementsInner(mpos, dpos int, s []uint8) int {
	if mpos >= len(r.m) {
		if dpos >= len(r.damaged) {
			//fmt.Printf("found: %s\n", s)
			return 1
		} else {
			// didn't match
			return 0
		}
	}
	s = slices.Clone(s)
	//fmt.Printf("count: %s, %v\n", r.m[mpos:], r.damaged[dpos:])
	if r.m[mpos] == '.' {
		//fmt.Println("just consume")
		return r.countArrangements(mpos+1, dpos, append(s, '.'))
	}
	if r.m[mpos] == '#' {
		if dpos == len(r.damaged) {
			//fmt.Println("found damaged when we shouldn't")
			return 0
		}
		// it definitely consumes one of the damaged groups + 1 safe after
		expectedLen := r.damaged[dpos]
		if mpos+expectedLen > len(r.m) {
			//fmt.Println("not enough length")
			return 0
		}
		for i := 0; i < expectedLen; i++ {
			if r.m[mpos+i] == '.' {
				//fmt.Println("found safe where it shouldn't be", expectedLen, i)
				return 0
			}
		}
		if mpos+expectedLen < len(r.m)-1 && r.m[mpos+expectedLen] == '#' {
			//fmt.Println("must end with safe")
			return 0
		}
		for i := 0; i < expectedLen; i++ {
			s = append(s, '#')
		}
		if mpos+expectedLen < len(r.m) {
			s = append(s, '.')
		}
		// continue consuming
		return r.countArrangements(mpos+expectedLen+1, dpos+1, s)
	}
	if r.m[mpos] != '?' {
		log.Fatalf("Something's wrong, got to unexpected ? at mpos=%d, dpos=%d in: %v\n", mpos, dpos, r)
	}
	// if ? means safe
	ifSafe := r.countArrangements(mpos+1, dpos, append(slices.Clone(s), '.'))
	if dpos == len(r.damaged) {
		return ifSafe
	}
	// if ? means damaged
	expectedLen := r.damaged[dpos]
	fit := mpos+expectedLen <= len(r.m)
	if mpos+expectedLen < len(r.m) {
		//fmt.Println("must end with safe")
		fit = r.m[mpos+expectedLen] != '#'
	}
	if fit {
		for i := 0; i < expectedLen; i++ {
			if r.m[mpos+i] == '.' {
				fit = false
				break
			}
		}
	}
	if fit {
		for i := 0; i < expectedLen; i++ {
			s = append(s, '#')
		}
		if mpos+expectedLen < len(r.m) {
			s = append(s, '.')
		}
		return ifSafe + r.countArrangements(mpos+expectedLen+1, dpos+1, s)
	} else {
		return ifSafe
	}
}

func (r *rec) unfold() *rec {
	newM := strings.Join([]string{r.m, r.m, r.m, r.m, r.m}, "?")
	newDamaged := make([]int, len(r.damaged)*5)
	i := 0
	for i < len(newDamaged) {
		for j := 0; j < len(r.damaged); j++ {
			newDamaged[i] = r.damaged[j]
			i += 1
		}
	}
	return &rec{m: newM, damaged: newDamaged, cache: make(map[string]int)}
}

func part2(in input) {
	result := 0
	for _, l := range in.lines {
		parts := strings.Split(l, " ")
		r := &rec{m: parts[0], damaged: parseNumsWithSep(parts[1], ","), cache: map[string]int{}}
		//fmt.Println(r)
		//fmt.Println(r.unfold())
		c := r.unfold().countArrangements(0, 0, make([]uint8, 0))
		//fmt.Printf("%s | %v: %d\n", r.m, r.damaged, c)
		result += c
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
