package main

import (
	"slices"
	"testing"
)

func TestP1Sample(t *testing.T) {
	sampleInput := sample(`1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`)
	assertCorrectEssentials(t, sampleInput, []string{"2", "3", "4", "5", "7"})
}

func TestP1Hat(t *testing.T) {
	sampleInput := sample(`1,0,3~1,0,5
1,5,4~1,5,8
1,0,10~1,5,10`)
	assertCorrectEssentials(t, sampleInput, []string{"1", "3"})
}

func TestP1HatRev(t *testing.T) {
	sampleInput := sample(`1,0,3~1,0,8
1,5,4~1,5,8
1,0,10~1,5,10`)
	assertCorrectEssentials(t, sampleInput, []string{"2", "3"})
}

func TestP1Floor(t *testing.T) {
	sampleInput := sample(`1,0,1~1,5,1
1,1,4~1,1,8
1,5,4~1,5,8
1,0,10~1,0,11`)
	assertCorrectEssentials(t, sampleInput, []string{"2", "3", "4"})
}

func TestP1Singleton(t *testing.T) {
	sampleInput := sample(`1,0,1~1,5,1`)
	assertCorrectEssentials(t, sampleInput, []string{"1"})
}

func TestP1Pair(t *testing.T) {
	sampleInput := sample(`1,0,1~1,0,2
1,0,3~1,0,4`)
	assertCorrectEssentials(t, sampleInput, []string{"2"})
}

func TestP1PairRev(t *testing.T) {
	sampleInput := sample(`1,0,10~1,0,12
1,0,3~1,0,4`)
	assertCorrectEssentials(t, sampleInput, []string{"1"})
}

func TestP1Corner(t *testing.T) {
	sampleInput := sample(`0,0,1~1,0,1
1,0,2~1,1,2`)
	assertCorrectEssentials(t, sampleInput, []string{"2"})
}

func TestP1StairsShort(t *testing.T) {
	sampleInput := sample(`0,0,1~1,0,1
1,0,2~1,1,2
0,1,3~1,1,3
0,0,4~0,1,4`)
	assertCorrectEssentials(t, sampleInput, []string{"4"})
}

func TestP1Stairs(t *testing.T) {
	sampleInput := sample(`0,0,1~1,0,1
1,0,2~1,1,2
0,1,3~1,1,3
0,0,4~0,1,4
0,0,5~1,0,5
1,0,6~1,1,6
0,1,7~1,1,7
0,0,8~0,1,8
0,0,9~1,0,9
1,0,10~1,1,10
0,1,11~1,1,11
0,0,12~0,1,12
`)
	assertCorrectEssentials(t, sampleInput, []string{"12"})
}

func TestP1In3D(t *testing.T) {
	sampleInput := sample(`1,0,1~1,0,2
2,0,3~2,0,4`)
	assertCorrectEssentials(t, sampleInput, []string{"1", "2"})
}

func assertCorrectEssentials(t *testing.T, in input, expectedNonEssential []string) {
	nonEssential := part1_debug(in)
	if !slices.Equal(nonEssential, expectedNonEssential) {
		t.Fatalf("Non-essentials are wrong: expected=%v, actual=%v\n", expectedNonEssential, nonEssential)
	}
}

func TestP2Singleton(t *testing.T) {
	sampleInput := sample(`1,0,1~1,5,1`)
	expected := 0
	actual := part2_debug(sampleInput)
	if expected != actual {
		t.Fatalf("Expected=%v, actual=%v\n", expected, actual)
	}
}

func TestP2Pair(t *testing.T) {
	sampleInput := sample(`1,0,1~1,5,1
1,0,2~1,1,2`)
	expected := 1
	actual := part2_debug(sampleInput)
	if expected != actual {
		t.Fatalf("Expected=%v, actual=%v\n", expected, actual)
	}
}

func TestP2StairsShort(t *testing.T) {
	sampleInput := sample(`0,0,1~1,0,1
1,0,2~1,1,2
0,1,3~1,1,3
0,0,4~0,1,4`)
	expected := 3 + 2 + 1
	actual := part2_debug(sampleInput)
	if expected != actual {
		t.Fatalf("Expected=%v, actual=%v\n", expected, actual)
	}
}

func TestP2Sample(t *testing.T) {
	sampleInput := sample(`1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`)
	expected := 6 + 1
	actual := part2_debug(sampleInput)
	if expected != actual {
		t.Fatalf("Expected=%v, actual=%v\n", expected, actual)
	}
}
