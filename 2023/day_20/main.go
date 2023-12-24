package main

import (
	"fmt"
	"log"
	"strings"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
00:44:14    731      0       >24h  15177      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 20")
	inputFile := "2023/day_20/input.txt"
	sampleLines := `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(sample(`broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	//part2(sample(sampleLines))
	part2(fullInput(inputFile)) // 540192285360: too low
}

func part1(in input) {
	comps := make(map[string]*component)
	for _, l := range in.lines {
		c := parse(l)
		comps[c.id] = c
	}
	for _, c := range comps {
		for _, ct := range c.targets {
			t, ok := comps[ct]
			if !ok {
				//log.Fatalf("Can't find a target %s for %v\n", ct, c)
				t = &component{id: ct, typ: '?', targets: make([]string, 0)}
				comps[t.id] = t
			}
			if t.typ == '&' {
				t.conjState[c.id] = false
			}
		}
	}
	totalHigh, totalLow := 0, 0
	for i := 0; i < 1000; i += 1 {
		high, low := pressButton(comps)
		totalHigh += high
		totalLow += low
	}
	result := totalHigh * totalLow
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func pressButton(comps map[string]*component) (int, int) {
	q := &pulseQueue{pulses: make([]*pulse, 500)}
	q.push(&pulse{target: "broadcaster", high: false})
	highPulses := 0
	lowPulses := 0
	for !q.isEmpty() {
		p := q.pop()
		//fmt.Println(p)
		if p.high {
			highPulses += 1
		} else {
			lowPulses += 1
		}
		c, ok := comps[p.target]
		if !ok {
			log.Fatalln("Unknown pulse target", p.target)
		}
		c.process(p, q)
	}
	return highPulses, lowPulses
}

func parse(l string) *component {
	if strings.HasPrefix(l, "broadcaster") {
		targets := strings.Split(strings.TrimPrefix(l, "broadcaster -> "), ", ")
		return &component{id: "broadcaster", typ: 'b', targets: targets}
	}
	switch l[0] {
	case '%':
		parts := strings.Split(l[1:], " -> ")
		targets := strings.Split(parts[1], ", ")
		return &component{id: parts[0], typ: '%', targets: targets, flipFlopState: false, flipFlopTarget: 0}
	case '&':
		parts := strings.Split(l[1:], " -> ")
		targets := strings.Split(parts[1], ", ")
		return &component{id: parts[0], typ: '&', targets: targets, conjState: make(map[string]bool)}
	default:
		parts := strings.Split(l, " -> ")
		targets := strings.Split(parts[1], ", ")
		return &component{id: parts[0], typ: '?', targets: targets}
	}
}

type pulseQueue struct {
	pulses []*pulse
	start  int
	end    int
}

func (q *pulseQueue) push(p *pulse) {
	q.pulses[q.end] = p
	q.end += 1
}
func (q *pulseQueue) pop() *pulse {
	p := q.pulses[q.start]
	q.start += 1
	return p
}

func (q *pulseQueue) isEmpty() bool {
	return q.end == q.start
}

type component struct {
	id             string
	typ            uint8
	targets        []string
	flipFlopTarget int
	flipFlopCount  int
	flipFlopState  bool
	conjState      map[string]bool
}

func (c *component) pulseForAllTargets(high bool, q *pulseQueue) {
	for _, t := range c.targets {
		q.push(&pulse{src: c.id, target: t, high: high})
	}
}

func pow(base, power int) int {
	result := 1
	for i := 1; i <= power; i++ {
		result *= base
	}
	return result
}

func (c *component) process(p *pulse, q *pulseQueue) {
	if c.typ == 'b' {
		c.pulseForAllTargets(p.high, q)
	} else if c.typ == '%' {
		if p.high {
			return
		}
		// ready to flip?
		c.flipFlopCount = (c.flipFlopCount + 1) % pow(2, c.flipFlopTarget)
		if c.flipFlopCount == 0 {
			// yup
			if !c.flipFlopState {
				c.flipFlopState = true
				c.pulseForAllTargets(true, q)
			} else {
				c.flipFlopState = false
				c.pulseForAllTargets(false, q)
			}
		}
	} else if c.typ == '&' {
		c.conjState[p.src] = p.high
		allHigh := true
		for _, h := range c.conjState {
			allHigh = allHigh && h
		}
		if allHigh {
			c.pulseForAllTargets(false, q)
		} else {
			c.pulseForAllTargets(true, q)
		}
	}
}

type pulse struct {
	src    string
	target string
	high   bool
}

func pressButton2(comps map[string]*component, subPartIsHigh map[string]bool) {
	q := &pulseQueue{pulses: make([]*pulse, 500)}
	q.push(&pulse{target: "broadcaster", high: false})
	for !q.isEmpty() {
		p := q.pop()
		//fmt.Println(p)
		if _, ok := subPartIsHigh[p.src]; ok && p.high {
			subPartIsHigh[p.src] = true
		}
		c, ok := comps[p.target]
		if !ok {
			log.Fatalln("Unknown pulse target", p.target)
		}
		c.process(p, q)
	}
}

func part2(in input) {
	comps := make(map[string]*component)
	for _, l := range in.lines {
		c := parse(l)
		comps[c.id] = c
	}
	for _, c := range comps {
		for _, ct := range c.targets {
			t, ok := comps[ct]
			if !ok {
				//log.Fatalf("Can't find a target %s for %v\n", ct, c)
				t = &component{id: ct, typ: '?', targets: make([]string, 0)}
				comps[t.id] = t
			}
			if t.typ == '&' {
				t.conjState[c.id] = false
			}
		}
	}
	rev := make(map[string][]string)
	for _, c := range comps {
		for _, ct := range c.targets {
			if _, ok := rev[ct]; !ok {
				rev[ct] = make([]string, 0)
			}
			rev[ct] = append(rev[ct], c.id)
		}
	}
	//for step := 0; step < 100_000; step += 1 {
	//	if step == 100_000-1 {
	//		fmt.Println("Out of loops! :(")
	//	}
	//	merged := false
	//	for _, c := range comps {
	//		if c.typ == '%' && len(c.targets) == 1 {
	//			t := c.targets[0]
	//			tc := comps[t]
	//			tsrc := rev[t]
	//			if tc.typ != '%' || len(tsrc) > 1 {
	//				continue
	//			}
	//			merged = true
	//			// merge!
	//			fmt.Printf("merging: %s into %s\n", t, c.id)
	//			c.targets = tc.targets
	//			for _, dt := range tc.targets {
	//				idx := slices.Index(rev[dt], tc.id)
	//				rev[dt][idx] = c.id
	//				if comps[dt].typ == '&' {
	//					delete(comps[dt].conjState, t)
	//					comps[dt].conjState[c.id] = false
	//				}
	//			}
	//			c.flipFlopTarget += 1
	//			delete(rev, t)
	//			delete(comps, t)
	//		}
	//	}
	//	if !merged {
	//		break
	//	}
	//}
	//fmt.Println("--- diag ---")
	//fmt.Println("flowchart TD")
	//for _, c := range comps {
	//	fmt.Printf("  %s[%c%s fp=%d]\n", c.id, c.typ, c.id, c.flipFlopTarget)
	//	for _, t := range c.targets {
	//		fmt.Printf("  %s --> %s\n", c.id, t)
	//	}
	//}
	//fmt.Println("--- diag ---")
	if len(rev["rx"]) != 1 {
		log.Fatalln("rx has more than one input!")
	}
	invOutput := comps[rev["rx"][0]]
	if invOutput.typ != '&' {
		log.Fatalln("rx's input is not a & module!")
	}
	subPartCycles := make(map[string]int)
	subPartCycleStarts := make(map[string]int)
	for _, c := range rev[invOutput.id] {
		subPartCycles[c] = -1
		subPartCycleStarts[c] = -1
	}
	for step := 0; step < 1_000_000; step += 1 {
		subPartIsHigh := make(map[string]bool)
		for _, c := range rev[invOutput.id] {
			subPartIsHigh[c] = false
		}
		if step == 1_000_000-1 {
			fmt.Println("Out of steps :(")
		}
		pressButton2(comps, subPartIsHigh)
		allFound := true
		for subPart, isHigh := range subPartIsHigh {
			if isHigh {
				if subPartCycleStarts[subPart] == -1 {
					subPartCycleStarts[subPart] = step
				} else if subPartCycles[subPart] == -1 {
					subPartCycles[subPart] = step - subPartCycleStarts[subPart]
				}
			}
			allFound = allFound && subPartCycles[subPart] != -1
		}
		if allFound {
			break
		}
	}
	fmt.Println(subPartCycles)
	cycles := make([]int64, 0)
	for _, cycle := range subPartCycles {
		cycles = append(cycles, int64(cycle))
	}
	result := lcm(cycles...)
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
