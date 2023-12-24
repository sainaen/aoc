package main

import (
	"testing"
)

func TestPointStepInDir(t *testing.T) {
	dist := 3
	p := Point{0, 0}
	n := Point{-dist, 0}
	s := Point{dist, 0}
	e := Point{0, dist}
	w := Point{0, -dist}
	if p.stepInDir('N', dist) != n {
		t.Fatalf("Unexpected P on dir=N")
	}
	if p.stepInDir('S', dist) != s {
		t.Fatalf("Unexpected P on dir=S")
	}
	if p.stepInDir('E', dist) != e {
		t.Fatalf("Unexpected P on dir=E")
	}
	if p.stepInDir('W', dist) != w {
		t.Fatalf("Unexpected P on dir=w")
	}
}

func TestP2SimpleOneStepEvolution(t *testing.T) {
	sampleInput := sample(`...
.S.
...`)
	w := newWorld(sampleInput.lines)
	w.getLand(Point{0, 0}).positions[Point{1, 1}] = true
	w = w.evolve()
	if len(w.id2Hash) != 1 {
		t.Fatalf("Unexpected number of lands: %d", len(w.id2Hash))
	}
	if w.size() != 4 {
		t.Fatalf("Unexpected size: %d", w.size())
	}
}

func TestP2OneStepEvolutionAtBorderN(t *testing.T) {
	sampleInput := sample(`.S.
...
...`)
	w := newWorld(sampleInput.lines)
	w.getLand(Point{0, 0}).positions[Point{0, 1}] = true
	w = w.evolve()
	if len(w.id2Hash) != 2 {
		t.Fatalf("Unexpected number of lands: %d", len(w.id2Hash))
	}
	if w.size() != 4 {
		t.Fatalf("Unexpected size: %d", w.size())
	}
}

func TestP2OneStepEvolutionAtBorderS(t *testing.T) {
	sampleInput := sample(`...
...
.S.`)
	w := newWorld(sampleInput.lines)
	w.getLand(Point{0, 0}).positions[Point{2, 1}] = true
	w = w.evolve()
	if len(w.id2Hash) != 2 {
		t.Fatalf("Unexpected number of lands: %d", len(w.id2Hash))
	}
	if w.size() != 4 {
		t.Fatalf("Unexpected size: %d", w.size())
	}
}

func TestP2OneStepEvolutionAtBorderW(t *testing.T) {
	sampleInput := sample(`...
..S
...`)
	w := newWorld(sampleInput.lines)
	w.getLand(Point{0, 0}).positions[Point{1, 0}] = true
	w = w.evolve()
	if len(w.id2Hash) != 2 {
		t.Fatalf("Unexpected number of lands: %d", len(w.id2Hash))
	}
	if w.size() != 4 {
		t.Fatalf("Unexpected size: %d", w.size())
	}
}

func TestP2OneStepEvolutionAtBorderE(t *testing.T) {
	sampleInput := sample(`...
..S
...`)
	w := newWorld(sampleInput.lines)
	w.getLand(Point{0, 0}).positions[Point{1, 2}] = true
	w = w.evolve()
	if len(w.id2Hash) != 2 {
		t.Fatalf("Unexpected number of lands: %d", len(w.id2Hash))
	}
	if w.size() != 4 {
		t.Fatalf("Unexpected size: %d", w.size())
	}
}

func TestP2OneStepEvolutionAtCorner(t *testing.T) {
	sampleInput := sample(`S..
...
...`)
	w := newWorld(sampleInput.lines)
	w.getLand(Point{0, 0}).positions[Point{0, 0}] = true
	w = w.evolve()
	if len(w.id2Hash) != 3 {
		t.Fatalf("Unexpected number of lands: %d", len(w.id2Hash))
	}
	if w.size() != 4 {
		t.Fatalf("Unexpected size: %d", w.size())
	}
}

var puzzleSampleInput = sample(`...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`)
var puzzleSampleStart = findStart(puzzleSampleInput.lines)

func TestP2Sample6Steps(t *testing.T) {
	w := newWorld(puzzleSampleInput.lines)
	w.getLand(Point{0, 0}).positions[puzzleSampleStart] = true
	for i := 0; i < 6; i++ {
		w = w.evolve()
	}
	if w.size() != 16 {
		t.Fatalf("Unexpected size: %d", w.size())
	}
}

func TestP2Sample10Steps(t *testing.T) {
	w := newWorld(puzzleSampleInput.lines)
	w.getLand(Point{0, 0}).positions[puzzleSampleStart] = true
	for i := 0; i < 10; i++ {
		w = w.evolve()
	}
	if w.size() != 50 {
		t.Fatalf("Unexpected size: %d", w.size())
	}
}

func TestP2Sample50Steps(t *testing.T) {
	w := newWorld(puzzleSampleInput.lines)
	w.getLand(Point{0, 0}).positions[puzzleSampleStart] = true
	sw := newWorld(puzzleSampleInput.lines)
	sw.getLand(Point{0, 0}).positions[puzzleSampleStart] = true
	for i := 0; i < 50; i++ {
		w = w.evolve()
		sw = sw.slowEvolve()
		//wLen := len(w.getLand(Point{0, 0}).positions)
		//swLen := len(sw.getLand(Point{0, 0}).positions)
		//if wLen != swLen {
		//	t.Fatalf("Unexpected positions on iteration %d: expected=%d, actual=%d", i, swLen, wLen)
		//}
		if len(w.id2Hash) != len(sw.id2Hash) {
			t.Fatalf("Unexpected lands count on iteration %d: expected=%d, actual=%d", i, len(sw.id2Hash), len(w.id2Hash))
		}
		if w.size() != sw.size() {
			t.Fatalf("Unexpected size on iteration %d: expected=%d, actual=%d", i, sw.size(), w.size())
		}
	}
	if w.size() != 1594 {
		t.Fatalf("Unexpected size: %d", w.size())
	}
}

func TestP2Sample100Steps(t *testing.T) {
	w := newWorld(puzzleSampleInput.lines)
	w.getLand(Point{0, 0}).positions[puzzleSampleStart] = true
	for i := 0; i < 100; i++ {
		w = w.evolve()
	}
	if w.size() != 6536 {
		t.Fatalf("Unexpected size: %d", w.size())
	}
}

func TestP2Sample500Steps(t *testing.T) {
	w := newWorld(puzzleSampleInput.lines)
	w.getLand(Point{0, 0}).positions[puzzleSampleStart] = true
	for i := 0; i < 500; i++ {
		w = w.evolve()
	}
	if w.size() != 167004 {
		t.Fatalf("Unexpected size: %d", w.size())
	}
}

//func TestP2Sample1000Steps(t *testing.T) {
//	w := newWorld(puzzleSampleInput.lines)
//	w.getLand(Point{0, 0}).positions[puzzleSampleStart] = true
//	for i := 0; i < 1000; i++ {
//		w = w.evolve()
//	}
//	if w.size() != 668697 {
//		t.Fatalf("Unexpected size: %d", w.size())
//	}
//}
//
//func TestP2Sample5000Steps(t *testing.T) {
//	w := newWorld(puzzleSampleInput.lines)
//	w.getLand(Point{0, 0}).positions[puzzleSampleStart] = true
//	for i := 0; i < 5000; i++ {
//		w = w.evolve()
//	}
//	if w.size() != 16733044 {
//		t.Fatalf("Unexpected size: %d", w.size())
//	}
//}
