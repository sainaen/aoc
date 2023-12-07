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
--------Part 1--------   -------Part 2--------
    Time   Rank  Score       Time  Rank  Score
00:42:28   4435      0   01:05:29  4260      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 7")
	inputFile := "2023/day_07/input.txt"
	sampleLines := `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	hands := make([]*hand, len(in.lines))
	for i, l := range in.lines {
		hands[i] = newHand(l)
	}
	slices.SortFunc(hands, func(a, b *hand) int {
		return a.cmp(b)
	})
	result := int64(0)
	for i, h := range hands {
		//fmt.Println(h, h.findType())
		result += int64(h.bid) * int64(i+1)
	}
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type hand struct {
	l     string
	cards []int
	bid   int
}

func newHand(s string) *hand {
	parts := strings.SplitN(s, " ", 2)
	cards := make([]int, len(parts[0]))
	cardStrength := map[int32]int{'A': 12, 'K': 11, 'Q': 10, 'J': 9, 'T': 8, '9': 7, '8': 6, '7': 5, '6': 4, '5': 3, '4': 2, '3': 1, '2': 0}
	for i, c := range parts[0] {
		var ok bool
		cards[i], ok = cardStrength[c]
		if !ok {
			log.Fatalln("Unknown card", c)
		}
	}
	return &hand{l: s, cards: cards, bid: noErr(strconv.Atoi(parts[1]))}
}

type handType = int

const fiveOfAKind handType = 6
const fourOfAKind handType = 5
const fullHouse handType = 4
const threeOfAKind handType = 3
const twoPair handType = 2
const onePair handType = 1
const highCard handType = 0

func (h *hand) findType() handType {
	card2Counts := make(map[int]int)
	cardMax := 0
	for _, c := range h.cards {
		if _, ok := card2Counts[c]; !ok {
			card2Counts[c] = 0
		}
		card2Counts[c] = card2Counts[c] + 1
		cardMax = max(cardMax, card2Counts[c])
	}
	if cardMax == 5 {
		return fiveOfAKind
	}
	if cardMax == 4 {
		return fourOfAKind
	}
	counts := make([]int, 0)
	for _, count := range card2Counts {
		counts = append(counts, count)
	}
	slices.Sort(counts)
	slices.Reverse(counts)
	if len(counts) == 2 && counts[0] == 3 && counts[1] == 2 {
		return fullHouse
	}
	if len(counts) == 3 && counts[0] == 3 && counts[1] == 1 && counts[2] == 1 {
		return threeOfAKind
	}
	if len(counts) == 3 && counts[0] == 2 && counts[1] == 2 && counts[2] == 1 {
		return twoPair
	}
	if len(counts) == 4 && counts[0] == 2 && counts[1] == 1 && counts[2] == 1 && counts[3] == 1 {
		return onePair
	}
	return highCard
}

func (h *hand) findType2() handType {
	J := 9
	card2Counts := make(map[int]int)
	cardMax := 0
	jCount := 0
	for _, c := range h.cards {
		if c == J {
			jCount += 1
			continue
		}
		if _, ok := card2Counts[c]; !ok {
			card2Counts[c] = 0
		}
		card2Counts[c] = card2Counts[c] + 1
		cardMax = max(cardMax, card2Counts[c])
	}
	if (cardMax + jCount) == 5 {
		return fiveOfAKind
	}
	if (cardMax + jCount) == 4 {
		return fourOfAKind
	}
	counts := make([]int, 0)
	for _, count := range card2Counts {
		counts = append(counts, count)
	}
	slices.Sort(counts)
	slices.Reverse(counts)
	if len(counts) == 2 && (counts[0] == 3 || counts[0]+jCount == 3) && counts[1] == 2 {
		return fullHouse
	}
	if len(counts) == 3 && (counts[0] == 3 || counts[0]+jCount == 3) && counts[1] == 1 && counts[2] == 1 {
		return threeOfAKind
	}
	if len(counts) == 3 && (counts[0] == 2 || counts[0]+jCount == 2) && counts[1] == 2 && counts[2] == 1 {
		return twoPair
	}
	if len(counts) == 4 && (counts[0] == 2 || counts[0]+jCount == 2) && counts[1] == 1 && counts[2] == 1 && counts[3] == 1 {
		return onePair
	}
	return highCard
}

func (h *hand) cmp(other *hand) int {
	ht := h.findType()
	ot := other.findType()
	if ht > ot {
		return 1
	}
	if ht < ot {
		return -1
	}
	for i, hc := range h.cards {
		oc := other.cards[i]
		if hc > oc {
			return 1
		}
		if hc < oc {
			return -1
		}
	}
	log.Fatalf("Two hands are exactly the same: %v VS %v", h, other)
	return 0
}

func (h *hand) cmp2(other *hand) int {
	J := 9
	ht := h.findType2()
	ot := other.findType2()
	if ht > ot {
		return 1
	}
	if ht < ot {
		return -1
	}
	for i, hc := range h.cards {
		if hc == J {
			hc = -1
		}
		oc := other.cards[i]
		if oc == J {
			oc = -1
		}
		if hc > oc {
			return 1
		}
		if hc < oc {
			return -1
		}
	}
	log.Fatalf("Two hands are exactly the same: %v VS %v", h, other)
	return 0
}

func part2(in input) {
	hands := make([]*hand, len(in.lines))
	for i, l := range in.lines {
		hands[i] = newHand(l)
	}
	slices.SortFunc(hands, func(a, b *hand) int {
		return a.cmp2(b)
	})
	result := int64(0)
	for i, h := range hands {
		//fmt.Println(h, h.findType2())
		result += int64(h.bid) * int64(i+1)
	}
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
