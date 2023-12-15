package main

import (
	"fmt"
	"strconv"
	"strings"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
00:06:07   1803      0   00:40:42   3438      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 15")
	inputFile := "2023/day_15/input.txt"
	sampleLines := `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	result := 0
	for _, l := range in.lines {
		parts := strings.Split(l, ",")
		for _, p := range parts {
			result += hash(p)
		}
		result += hash(l)
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

func hash(s string) int {
	h := 0
	for _, c := range s {
		h += int(c)
		h = h * 17
		h = h % 256
	}
	return h
}

type lens struct {
	label       string
	focalLength int
}

func (l *lens) sprint() string {
	return fmt.Sprintf("%v", l)
}

type box struct {
	lenses []*lens
}

func (b *box) sprint() string {
	ls := make([]string, len(b.lenses))
	for i := 0; i < len(b.lenses); i++ {
		ls[i] = b.lenses[i].sprint()
	}
	return "[" + strings.Join(ls, ", ") + "]"
}

func (b *box) indexOf(l string) int {
	for i := 0; i < len(b.lenses); i += 1 {
		if b.lenses[i].label == l {
			return i
		}
	}
	return -1
}

func (b *box) add(l *lens) {
	idx := b.indexOf(l.label)
	if idx == -1 {
		b.lenses = append(b.lenses, l)
	} else {
		b.lenses[idx] = l
	}
}

func (b *box) remove(l string) {
	idx := b.indexOf(l)
	if idx != -1 {
		newLenses := make([]*lens, 0)
		for i := 0; i < len(b.lenses); i += 1 {
			if i == idx {
				continue
			}
			newLenses = append(newLenses, b.lenses[i])
		}
		b.lenses = newLenses
	}
}

func (b *box) powerWithin(boxIdx int) int {
	result := 0
	for i, l := range b.lenses {
		lensPower := (boxIdx + 1) * (i + 1) * l.focalLength
		//fmt.Printf("power of %s in %d: %d\n", l.label, boxIdx, lensPower)
		result = result + lensPower
	}
	return result
}
func part2(in input) {
	m := make([]*box, 256)
	for i := 0; i < len(m); i++ {
		m[i] = &box{lenses: make([]*lens, 0)}
	}
	for _, s := range in.lines {
		parts := strings.Split(s, ",")
		for _, p := range parts {
			if strings.HasSuffix(p, "-") {
				label := strings.TrimSuffix(p, "-")
				h := hash(label)
				//fmt.Printf("removing lens %s from box %d\n", label, h)
				m[h].remove(label)
				//fmt.Printf("box %d: %s\n", h, m[h].sprint())
			} else if strings.Contains(p, "=") {
				a := strings.Split(p, "=")
				h := hash(a[0])
				v := noErr(strconv.Atoi(a[1]))
				l := &lens{label: a[0], focalLength: v}
				//fmt.Printf("adding lens %s to box %d\n", l.sprint(), h)
				m[h].add(l)
				//fmt.Printf("box %d: %s\n", h, m[h].sprint())
			}
		}
	}
	result := 0
	for i := 0; i < len(m); i++ {
		result += m[i].powerWithin(i)
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
