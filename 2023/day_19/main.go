package main

import (
	"fmt"
	"log"
	"slices"
	"strconv"
	"strings"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
00:29:09   1536      0   15:33:26  11777      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 19")
	inputFile := "2023/day_19/input.txt"
	sampleLines := `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	collectingWorkflows := true
	workflows := make(map[string]*workflow)
	result := 0
	for _, l := range in.lines {
		if len(l) == 0 {
			collectingWorkflows = false
			continue
		}
		if collectingWorkflows {
			w := parseWorkflow(l)
			workflows[w.id] = w
		} else {
			p := parsePart(l)
			if test(workflows, p) {
				result += p.sum()
			}
		}
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func parseWorkflow(l string) *workflow {
	parts := strings.Split(l, "{")
	id := parts[0]
	rulesS := strings.Split(strings.TrimSuffix(parts[1], "}"), ",")
	rules := make([]*rule, len(rulesS))
	for i := 0; i < len(rulesS); i++ {
		rules[i] = parseRule(rulesS[i])
	}
	return &workflow{id: id, rules: rules}
}

func accept(*part) bool {
	return true
}

func parseRule(l string) *rule {
	if strings.Contains(l, ":") {
		parts := strings.Split(l, ":")
		var field int
		switch parts[0][0] {
		case 'x':
			field = 0
		case 'm':
			field = 1
		case 'a':
			field = 2
		case 's':
			field = 3
		}
		cond := parts[0][1]
		n := noErr(strconv.Atoi(parts[0][2:]))
		return &rule{
			action:  parts[1],
			condRaw: parts[0],
			op:      cond,
			field:   field,
			n:       n,
			cond: func(p *part) bool {
				v := p.fields[field]
				if cond == '>' {
					return v > n
				}
				return v < n
			},
		}
	}
	return &rule{action: l, op: '!', cond: accept, condRaw: "always accept"}
}

type workflow struct {
	id    string
	rules []*rule
}

func (w *workflow) sprint() string {
	rules := make([]string, len(w.rules))
	for i := 0; i < len(w.rules); i++ {
		rules[i] = w.rules[i].sprint()
	}
	return fmt.Sprintf("w{%s, rules=[%s]}", w.id, strings.Join(rules, ","))
}

type rule struct {
	action  string
	condRaw string
	op      uint8
	field   int
	n       int
	cond    func(*part) bool
}

func (r *rule) sprint() string {
	return fmt.Sprintf("r{%s, if=%s}", r.action, r.condRaw)
}

func (r *rule) invert() *rule {
	var nop uint8
	var nn int
	switch r.op {
	case '>':
		nop = '<'
		nn = r.n + 1
	case '<':
		nop = '>'
		nn = r.n - 1
	case '!':
		nop = '!'
		nn = r.n
	default:
		log.Fatalf("Unknown op: %c (%s)\n", r.op, r.sprint())
	}
	return &rule{
		action:  "stay",
		condRaw: fmt.Sprintf("!(%s)", r.condRaw),
		op:      nop,
		field:   r.field,
		n:       nn,
		cond: func(p *part) bool {
			return !r.cond(p)
		},
	}
}

func parsePart(l string) *part {
	fields := make([]int, 4)
	for _, f := range strings.Split(l[1:len(l)-1], ",") {
		v := noErr(strconv.Atoi(f[2:]))
		switch f[0] {
		case 'x':
			fields[0] = v
		case 'm':
			fields[1] = v
		case 'a':
			fields[2] = v
		case 's':
			fields[3] = v
		}
	}
	return &part{fields}
}

type part struct {
	fields []int
}

func (p *part) sum() int {
	result := 0
	for _, v := range p.fields {
		result += v
	}
	return result
}

func accepted(ws map[string]*workflow, id string, rs []*rule) []*workflow {
	w, ok := ws[id]
	if !ok {
		log.Fatalf("Can't find workflow %s\n", id)
	}
	result := make([]*workflow, 0)
	negs := make([]*rule, 0)
	for _, r := range w.rules {
		if r.action == "A" {
			wrs := slices.Clone(rs)
			wrs = append(wrs, negs...)
			wrs = append(wrs, r)
			result = append(result, &workflow{rules: wrs})
		} else if r.action != "R" {
			nrs := slices.Clone(rs)
			nrs = append(nrs, negs...)
			nrs = append(nrs, r)
			for _, nw := range accepted(ws, r.action, nrs) {
				result = append(result, nw)
			}
		}
		negs = append(negs, r.invert())
	}
	return result
}

type FieldRange struct {
	min int
	max int
}

func (f *FieldRange) sprint() string {
	return fmt.Sprintf("[%4d, %4d]", f.min, f.max)
}

func (f *FieldRange) size() int {
	return f.max - f.min + 1
}

func (f *FieldRange) overlap(o *FieldRange) bool {
	return o.min <= f.min && f.min <= o.max ||
		o.min <= f.max && f.max <= o.max ||
		f.min <= o.min && o.min <= f.max ||
		f.min <= o.max && o.max <= f.max
}

func (f *FieldRange) distinct(o *FieldRange) (*FieldRange, *FieldRange, *FieldRange) {
	insideStart := max(min(f.min, o.max), min(f.max, o.min))
	insideEnd := min(max(f.min, o.max), max(f.max, o.min))
	inside := &FieldRange{min: insideStart, max: insideEnd}
	var before *FieldRange
	if o.min < insideStart {
		before = &FieldRange{min: o.min, max: insideStart - 1}
	}
	var after *FieldRange
	if o.max > insideEnd {
		after = &FieldRange{min: insideEnd + 1, max: o.max}
	}
	return before, inside, after
}

type PartRange struct {
	fRanges []*FieldRange
}

func NewPartRange(w *workflow) *PartRange {
	defMin, defMax := 1, 4000
	result := &PartRange{
		fRanges: []*FieldRange{
			{defMin, defMax},
			{defMin, defMax},
			{defMin, defMax},
			{defMin, defMax},
		},
	}
	for j := 0; j < len(w.rules); j++ {
		r := w.rules[j]
		if r.op == '!' {
			// always accept
			continue
		}
		fRange := result.getFieldRange(r.field)
		if r.op == '<' {
			fRange.max = min(r.n-1, fRange.max)
		} else if r.op == '>' {
			fRange.min = max(r.n+1, fRange.min)
		}
	}
	return result
}

func (r *PartRange) sprint() string {
	return fmt.Sprintf("{x=%s, m=%s, a=%s, s=%s}", r.fRanges[0].sprint(), r.fRanges[1].sprint(), r.fRanges[2].sprint(), r.fRanges[3].sprint())
}

func (r *PartRange) size() int {
	return r.fRanges[0].size() * r.fRanges[1].size() * r.fRanges[2].size() * r.fRanges[3].size()
}

func (r *PartRange) getFieldRange(field int) *FieldRange {
	return r.fRanges[field]
}

func (r *PartRange) distinct(o *PartRange) []*PartRange {
	hasOverlap := true
	for i, fr := range r.fRanges {
		ofr := o.fRanges[i]
		hasOverlap = hasOverlap && fr.overlap(ofr)
		if !hasOverlap {
			break
		}
	}
	if !hasOverlap {
		return []*PartRange{o}
	}
	result := make([]*PartRange, 0)
	xBefore, xInside, xAfter := r.fRanges[0].distinct(o.fRanges[0])
	if xBefore != nil {
		result = append(result, &PartRange{fRanges: []*FieldRange{xBefore, o.fRanges[1], o.fRanges[2], o.fRanges[3]}})
	}
	if xAfter != nil {
		result = append(result, &PartRange{fRanges: []*FieldRange{xAfter, o.fRanges[1], o.fRanges[2], o.fRanges[3]}})
	}
	mBefore, mInside, mAfter := r.fRanges[1].distinct(o.fRanges[1])
	if mBefore != nil {
		result = append(result, &PartRange{fRanges: []*FieldRange{xInside, mBefore, o.fRanges[2], o.fRanges[3]}})
	}
	if mAfter != nil {
		result = append(result, &PartRange{fRanges: []*FieldRange{xInside, mAfter, o.fRanges[2], o.fRanges[3]}})
	}
	aBefore, aInside, aAfter := r.fRanges[2].distinct(o.fRanges[2])
	if aBefore != nil {
		result = append(result, &PartRange{fRanges: []*FieldRange{xInside, mInside, aBefore, o.fRanges[3]}})
	}
	if aAfter != nil {
		result = append(result, &PartRange{fRanges: []*FieldRange{xInside, mInside, aAfter, o.fRanges[3]}})
	}
	sBefore, _, sAfter := r.fRanges[3].distinct(o.fRanges[3])
	if sBefore != nil {
		result = append(result, &PartRange{fRanges: []*FieldRange{xInside, mInside, aInside, sBefore}})
	}
	if sAfter != nil {
		result = append(result, &PartRange{fRanges: []*FieldRange{xInside, mInside, aInside, sAfter}})
	}
	return result
}

func (r *PartRange) boundaryParts() []*part {
	result := make([]*part, 0)
	for _, x := range []int{r.fRanges[0].min, r.fRanges[0].max} {
		for _, m := range []int{r.fRanges[1].min, r.fRanges[1].max} {
			for _, a := range []int{r.fRanges[2].min, r.fRanges[2].max} {
				for _, s := range []int{r.fRanges[3].min, r.fRanges[3].max} {
					result = append(result, &part{fields: []int{x, m, a, s}})
				}
			}
		}
	}
	return result
}

func test(ws map[string]*workflow, p *part) bool {
	action := "in"
	for action != "A" && action != "R" {
		w, ok := ws[action]
		if !ok {
			log.Fatalf("No workflow %s for part %v\n", action, p)
		}
		//fmt.Printf("matching %v with %v (%s)\n", p, w, action)
		for _, r := range w.rules {
			if r.cond(p) {
				action = r.action
				break
			}
		}
	}
	return action == "A"
}

func (r *PartRange) test(ws map[string]*workflow) bool {
	for _, p := range r.boundaryParts() {
		if !test(ws, p) {
			return false
		}
	}
	return true
}

func part2(in input) {
	workflows := make(map[string]*workflow)
	for _, l := range in.lines {
		if len(l) == 0 {
			break
		}
		w := parseWorkflow(l)
		workflows[w.id] = w
	}
	acceptances := accepted(workflows, "in", make([]*rule, 0))
	allTheRanges := make([]*PartRange, len(acceptances))
	for i := 0; i < len(acceptances); i++ {
		allTheRanges[i] = NewPartRange(acceptances[i])
	}
	distinctRanges := make([]*PartRange, 1)
	distinctRanges[0] = allTheRanges[0]
	for _, r := range allTheRanges[1:] {
		sr := []*PartRange{r}
		for _, dr := range distinctRanges {
			nsr := make([]*PartRange, 0)
			for _, pr := range sr {
				nsr = append(nsr, dr.distinct(pr)...)
			}
			sr = nsr
		}
		distinctRanges = append(distinctRanges, sr...)
	}
	for _, r := range distinctRanges {
		if !r.test(workflows) {
			log.Fatalln("One of the ranges is incorrect", r.sprint())
		}
	}
	result := 0
	for _, r := range distinctRanges {
		result += r.size()
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
