package main

import (
	"fmt"
	"os"
	"strings"
)

// @formatter:off
/*
--------Part 1--------   -------Part 2--------
    Time   Rank  Score       Time  Rank  Score
00:16:05    775      0   01:42:06  3530      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 5")
	inputFile := "2023/day_05/input.txt"
	sampleLines := `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	vals := parseNums(strings.TrimPrefix(in.lines[0], "seeds: "))
	var m *mapping
	for _, l := range in.lines[2:] {
		//fmt.Println(l)
		if len(l) == 0 {
			nextVals := make([]int, len(vals))
			for i, v := range vals {
				nextVals[i] = m.doMap(v)
			}
			vals = nextVals
		} else if strings.HasSuffix(l, " map:") {
			m = &mapping{ranges: make([]mapRange, 0)}
		} else {
			mr := parseNums(l)
			m.ranges = append(m.ranges, mapRange{dstStart: mr[0], srcStart: mr[1], len: mr[2]})
		}
	}
	// for the last map
	nextVals := make([]int, len(vals))
	for i, v := range vals {
		nextVals[i] = m.doMap(v)
	}
	vals = nextVals
	//fmt.Printf("%v\n", vals)
	result := 10000000000000
	for _, v := range vals {
		result = min(result, v)
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type mapping struct {
	ranges []mapRange
}

func (m *mapping) doMap(src int) int {
	for _, r := range m.ranges {
		if r.srcStart <= src && src <= (r.srcStart+r.len-1) {
			t := src - r.srcStart
			return r.dstStart + t
		}
	}
	return src
}

func (m *mapping) doMapRange(r valuesRange) []valuesRange {
	result := make([]valuesRange, 0)
	i := 0
	for r.len > 0 {
		//fmt.Println()
		//fmt.Println("vr", r)
		i += 1
		if i > 10 {
			fmt.Println("Too many loops")
			os.Exit(1)
		}
		var bestMapRange *mapRange
		for _, mr := range m.ranges {
			overlap := r.overlap(mr.srcStart, mr.len)
			if overlap != nil {
				//fmt.Println("mo", overlap)
				if bestMapRange == nil || bestMapRange.srcStart > mr.srcStart {
					// copy
					bestMapRange = &mapRange{dstStart: mr.dstStart, srcStart: mr.srcStart, len: mr.len}
				}
			}
		}
		if bestMapRange == nil {
			//fmt.Printf("r=%v, mr=%v\n", r, m.ranges)
			result = append(result, r)
			break
		}
		//fmt.Println("mr", bestMapRange)
		o := r.overlap(bestMapRange.srcStart, bestMapRange.len)
		//fmt.Println("ov", o)
		if o.start > r.start {
			// initial part of the range didn't match the map
			initialPart := valuesRange{start: r.start, len: o.start - r.start}
			//fmt.Println("ip", initialPart)
			result = append(result, initialPart)
		}
		mappedStart := (o.start - bestMapRange.srcStart) + bestMapRange.dstStart
		mappedOverlap := valuesRange{start: mappedStart, len: o.len}
		//fmt.Println("mo", mappedOverlap)
		result = append(result, mappedOverlap)
		nextStart := o.end() + 1
		nextLen := r.end() - nextStart + 1
		r = valuesRange{start: nextStart, len: nextLen}
		//fmt.Println("nr", r)
	}
	//fmt.Println("rr", result)
	return result
}

type mapRange struct {
	dstStart int
	srcStart int
	len      int
}

func (r *mapRange) srcEnd() int {
	return r.srcStart + r.len - 1
}

func (r *mapRange) dstOffset() int {
	return r.dstStart - r.srcStart
}

type valuesRange struct {
	start int
	len   int
}

func (r *valuesRange) end() int {
	return r.start + r.len - 1
}

func (r *valuesRange) overlap(start, len int) *valuesRange {
	//fmt.Println("[o]r", r)
	//fmt.Println("[o]s", start)
	//fmt.Println("[o]l", len)
	after := r.start > start+len-1
	before := r.end() < start
	//fmt.Println("[o]b", before)
	//fmt.Println("[o]a", after)
	if before || after {
		return nil
	}
	overlapStart := max(r.start, start)
	overlapEnd := min(r.end(), start+len-1)
	return &valuesRange{start: overlapStart, len: overlapEnd - overlapStart + 1}
}

func makeSeedRanges(s string) []valuesRange {
	vals := parseNums(s)
	result := make([]valuesRange, len(vals)/2)
	for i := 0; i < len(vals); i += 2 {
		result[i/2] = valuesRange{start: vals[i], len: vals[i+1]}
	}
	return result
}

func part2(in input) {
	valueRanges := makeSeedRanges(strings.TrimSpace(strings.TrimPrefix(in.lines[0], "seeds: ")))
	var m *mapping
	for _, l := range in.lines[2:] {
		//fmt.Println(l)
		if len(l) == 0 {
			nextValueRanges := make([]valuesRange, 0)
			for _, vr := range valueRanges {
				for _, nvr := range m.doMapRange(vr) {
					nextValueRanges = append(nextValueRanges, nvr)
				}
			}
			//fmt.Printf("[b] %v --> %v\n", valueRanges, m)
			valueRanges = nextValueRanges
			//fmt.Printf("[a] %v\n", valueRanges)
		} else if strings.HasSuffix(l, " map:") {
			m = &mapping{ranges: make([]mapRange, 0)}
		} else {
			mr := parseNums(l)
			m.ranges = append(m.ranges, mapRange{dstStart: mr[0], srcStart: mr[1], len: mr[2]})
		}
	}
	// for the last map
	nextValueRanges := make([]valuesRange, 0)
	for _, vr := range valueRanges {
		for _, nvr := range m.doMapRange(vr) {
			nextValueRanges = append(nextValueRanges, nvr)
		}
	}
	valueRanges = nextValueRanges
	//fmt.Printf("%v\n", valueRanges)
	result := 100000000000000
	for _, v := range valueRanges {
		result = min(result, v.start)
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
