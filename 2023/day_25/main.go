package main

import (
	"fmt"
	"strings"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
01:21:43   1847      0   01:21:50   1582      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 25")
	inputFile := "2023/day_25/input.txt"
	//	sampleLines := `jqt: rhn xhk nvd
	//rsh: frs pzl lsr
	//xhk: hfx
	//cmg: qnr nvd lhk bvb
	//rhn: xhk bvb hfx
	//bvb: xhk hfx
	//pzl: lsr hfx nvd
	//qnr: nvd
	//ntq: jqt hfx bvb xhk
	//nvd: lhk
	//lsr: lhk
	//rzs: qnr cmg lsr rsh
	//frs: qnr lhk lsr`

	fmt.Println("-------------")
	//part1(sample(sampleLines))
	part1(fullInput(inputFile))

	//fmt.Println("-------------")
	//part2(sample(sampleLines))
	//part2(fullInput(inputFile))
}

func part1(in input) {
	cons := make(map[string]map[string]bool)
	for _, l := range in.lines {
		parts := strings.Split(l, ": ")
		id := parts[0]
		if _, ok := cons[id]; !ok {
			cons[id] = make(map[string]bool)
		}
		for _, oId := range strings.Split(parts[1], " ") {
			if _, ok := cons[oId]; !ok {
				cons[oId] = make(map[string]bool)
			}
			cons[id][oId] = true
			cons[oId][id] = true
		}
	}
	//fname := "/tmp/aoc2023d25"
	//f := noErr(os.Create(fname))
	//defer f.Close()
	//fmt.Printf("diag: %s\n", fname)
	//fmt.Fprintln(f, "graph {")
	//pairs := make(map[string]bool)
	//for c, os := range cons {
	//	for o := range os {
	//		p1 := fmt.Sprintf("%s%s", c, o)
	//		p2 := fmt.Sprintf("%s%s", o, c)
	//		saw := pairs[p1] || pairs[p2]
	//		pairs[p1] = true
	//		pairs[p2] = true
	//		if saw {
	//			break
	//		}
	//		fmt.Fprintf(f, "  %s -- %s\n", c, o)
	//	}
	//}
	//fmt.Fprintln(f, "}")
	//fmt.Println("Use the following command to visualize the two components:")
	//fmt.Println("dot -Tsvg /tmp/aoc2023d25 -Kneato > /tmp/aoc2023d25.svg")
	dcons := map[string]string{
		"kkp": "vtv",
		"vtv": "kkp",
		"cmj": "qhd",
		"qhd": "cmj",
		"jll": "lnf",
		"lnf": "jll",
	}
	n := split(cons, "kkp", dcons)
	result := n * (len(cons) - n)
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func split(cons map[string]map[string]bool, root string, dcons map[string]string) int {
	result := make(map[string]bool)
	queue := make([]string, 1)
	queue[0] = root
	for len(queue) > 0 {
		c := queue[0]
		result[c] = true
		queue = queue[1:]
		op, hasOp := dcons[c]
		for o := range cons[c] {
			if hasOp && op == o {
				continue
			}
			if _, visited := result[o]; visited {
				continue
			}
			queue = append(queue, o)
		}
	}
	return len(result)
}

func part2(in input) {
	result := 0
	for _, l := range in.lines {
		result += len(l)
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
