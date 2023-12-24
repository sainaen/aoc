package main

import (
	"crypto/md5"
	"fmt"
	"log"
	"maps"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
00:32:11   3071      0       >24h  11105      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 21")
	inputFile := "2023/day_21/input.txt"
	sampleLines := `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	//part2(sample(sampleLines))
	part2(fullInput(inputFile)) // 10246883430145513751: your answer is too high :(
}

func part1(in input) {
	q := make(map[Point]bool)
outer:
	for i, l := range in.lines {
		for j, c := range l {
			if c == 'S' {
				q[Point{i, j}] = true
				break outer
			}
		}
	}
	for i := 0; i < 64; i++ {
		//fmt.Printf("round %02d\n", i)
		q = round1(in.lines, q)
	}
	result := len(q)
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

var xs = []int{-1, 1, 0, 0}
var ys = []int{0, 0, -1, 1}

func round1(field []string, q map[Point]bool) map[Point]bool {
	nq := make(map[Point]bool)
	for c := range q {
		for j, dx := range xs {
			dy := ys[j]
			nx := c.x + dx
			ny := c.y + dy
			if 0 <= nx && nx < len(field) && 0 <= ny && ny < len(field[nx]) {
				if field[nx][ny] == '#' {
					continue
				}
				n := Point{nx, ny}
				if _, ok := nq[n]; !ok {
					//fmt.Println(nx, ny)
					nq[n] = true
				}
			}
		}
	}
	return nq
}

type Point struct {
	x int
	y int
}

func (p Point) stepInDir(dir uint8, dist int) Point {
	switch dir {
	case 'N':
		return Point{x: p.x - dist, y: p.y}
	case 'S':
		return Point{x: p.x + dist, y: p.y}
	case 'E':
		return Point{x: p.x, y: p.y + dist}
	case 'W':
		return Point{x: p.x, y: p.y - dist}
	case '_':
		return p
	default:
		log.Fatalf("unknown direction: %c (for %v)\n", dir, p)
	}
	return Point{}
}

type Land struct {
	size      int
	positions map[Point]bool
}

func newLand(size int) *Land {
	return &Land{size: size, positions: make(map[Point]bool)}
}

func (l *Land) hash() string {
	b := byte(0)
	i := 0
	bs := make([]byte, 0)
	for x := 0; x < l.size; x += 1 {
		for y := 0; y < l.size; y += 1 {
			if i == 8 {
				bs = append(bs, b)
				b = 0
				i = 0
			}
			var d byte
			if l.positions[Point{x, y}] {
				d = 1
			}
			b = (b << 1) + d
			i += 1
		}
	}
	bs = append(bs, b)
	h := md5.New()
	h.Write(bs)
	result := make([]byte, 0)
	return string(h.Sum(result))
}

func (l *Land) evolve(field []string) (*Land, map[uint8]*Land) {
	neighbourLands := make(map[uint8]*Land)
	neighbourLands['N'] = newLand(l.size)
	neighbourLands['S'] = newLand(l.size)
	neighbourLands['E'] = newLand(l.size)
	neighbourLands['W'] = newLand(l.size)
	for _, c := range []uint8{'N', 'S', 'E', 'W'} {
		neighbourLands[c] = newLand(l.size)
	}
	newPositions := make(map[Point]bool)
	for p := range l.positions {
		for i, dx := range xs {
			dy := ys[i]
			nx := p.x + dx
			ny := p.y + dy
			nnx, nny, dir := normalizeCoords(l.size, nx, ny)
			if field[nnx][nny] == '#' {
				continue
			}
			np := Point{nnx, nny}
			if dir == '_' {
				newPositions[np] = true
			} else {
				neighbourLands[dir].positions[np] = true
			}
		}
	}
	for _, c := range []uint8{'N', 'S', 'E', 'W'} {
		if len(neighbourLands[c].positions) == 0 {
			delete(neighbourLands, c)
		}
	}
	result := newLand(l.size)
	result.positions = newPositions
	return result, neighbourLands
}
func (l *Land) update(o *Land) {
	maps.Copy(l.positions, o.positions)
}

func (l *Land) mergeIn(o *Land) *Land {
	result := newLand(l.size)
	maps.Copy(result.positions, l.positions)
	maps.Copy(result.positions, o.positions)
	return result
}

type World struct {
	field     []string
	id2Hash   map[Point]string
	hash2Id   map[string]map[Point]bool
	hash2Land map[string]*Land
}

func newWorld(field []string) *World {
	return &World{
		field:     field,
		id2Hash:   make(map[Point]string),
		hash2Land: make(map[string]*Land),
		hash2Id:   make(map[string]map[Point]bool),
	}
}

func (w *World) getLand(p Point) *Land {
	if _, exists := w.id2Hash[p]; !exists {
		l := newLand(len(w.field))
		w.addLand(l, map[Point]bool{p: true})
		return l
	}
	return w.hash2Land[w.id2Hash[p]]
}

func (w *World) addLand(l *Land, ids map[Point]bool) {
	w.addLandWithHash(l, l.hash(), ids)
}

func (w *World) addLandWithHash(l *Land, k string, ids map[Point]bool) {
	if _, knownHash := w.hash2Id[k]; !knownHash {
		w.hash2Id[k] = make(map[Point]bool)
		w.hash2Land[k] = l
	}
	for p := range ids {
		w.id2Hash[p] = k
		w.hash2Id[k][p] = true
	}
}

func (w *World) evolve() *World {
	l := len(w.field)
	nw := newWorld(w.field)
	neighbourAffects := make(map[Point]*Land)
	for hash, land := range w.hash2Land {
		eLand, neighbourLands := land.evolve(w.field)
		eHash := eLand.hash()
		nw.addLandWithHash(eLand, eHash, w.hash2Id[hash])
		for dir, nLand := range neighbourLands {
			for id := range w.hash2Id[hash] {
				nId := id.stepInDir(dir, l)
				if _, ok := neighbourAffects[nId]; !ok {
					neighbourAffects[nId] = newLand(l)
				}
				neighbourAffects[nId].update(nLand)
			}
		}
	}
	fw := newWorld(w.field)
	for id, landUpd := range neighbourAffects {
		if hash, ok := nw.id2Hash[id]; ok {
			land := nw.hash2Land[hash]
			delete(nw.hash2Id[hash], id)
			delete(nw.id2Hash, id)
			if len(nw.hash2Id[hash]) == 0 {
				delete(nw.hash2Id, hash)
				delete(nw.hash2Land, hash)
			}
			land = land.mergeIn(landUpd)
			fw.addLand(land, map[Point]bool{id: true})
		} else {
			fw.addLand(landUpd, map[Point]bool{id: true})
		}
	}
	for hash, land := range nw.hash2Land {
		fw.addLandWithHash(land, hash, nw.hash2Id[hash])
	}
	return fw
}

func (w *World) slowEvolve() *World {
	l := len(w.field)
	nw := newWorld(w.field)
	neighbourAffects := make(map[Point]*Land)
	for hash, land := range w.hash2Land {
		eLand, neighbourLands := land.evolve(w.field)
		nw.addLand(eLand, w.hash2Id[hash])
		for dir, nLand := range neighbourLands {
			if len(nLand.positions) == 0 {
				continue
			}
			for id := range w.hash2Id[hash] {
				nId := id.stepInDir(dir, l)
				if _, ok := neighbourAffects[nId]; !ok {
					neighbourAffects[nId] = newLand(l)
				}
				neighbourAffects[nId].update(nLand)
			}
		}
	}
	fw := newWorld(w.field)
	//for id, landUpd := range neighbourAffects {
	//	if hash, ok := nw.id2Hash[id]; ok {
	//		land := nw.hash2Land[hash]
	//		delete(nw.hash2Id[hash], id)
	//		delete(nw.id2Hash, id)
	//		if len(nw.hash2Id[hash]) == 0 {
	//			delete(nw.hash2Id, hash)
	//			delete(nw.hash2Land, hash)
	//		}
	//		land.mergeIn(landUpd)
	//		fw.addLand(land, map[Point]bool{id: true})
	//	} else {
	//		fw.addLand(landUpd, map[Point]bool{id: true})
	//	}
	//}
	//for hash, land := range nw.hash2Land {
	//	fw.addLand(land, nw.hash2Id[hash])
	//}
	for hash, land := range nw.hash2Land {
		keepAsIs := make(map[Point]bool)
		for id := range nw.hash2Id[hash] {
			if _, ok := neighbourAffects[id]; !ok {
				keepAsIs[id] = true
			} else {
				ul := newLand(l)
				ul.positions = maps.Clone(land.positions)
				for p := range neighbourAffects[id].positions {
					ul.positions[p] = true
				}
				fw.addLand(ul, map[Point]bool{id: true})
				delete(neighbourAffects, id)
			}
		}
		fw.addLand(land, keepAsIs)
	}
	for id, land := range neighbourAffects {
		fw.addLand(land, map[Point]bool{id: true})
	}
	//fmt.Printf("ulands: %d\tlands: %d\r", len(fw.hash2Land), len(w.id2Hash))
	return fw
}

func (w *World) size() int {
	result := 0
	for hash, land := range w.hash2Land {
		result += len(land.positions) * len(w.hash2Id[hash])
	}
	return result
}

func normalizeCoords(l, x, y int) (int, int, uint8) {
	if x < 0 {
		return x + l, y, 'N'
	} else if x >= l {
		return x - l, y, 'S'
	} else if y < 0 {
		return x, y + l, 'W'
	} else if y >= l {
		return x, y - l, 'E'
	} else {
		return x, y, '_'
	}
}

func findStart(field []string) Point {
	for i, l := range field {
		for j, c := range l {
			if c == 'S' {
				return Point{i, j}
			}
		}
	}
	log.Fatalf("Couldn't find a starting point")
	return Point{}
}

func part2(in input) {
	start := findStart(in.lines)
	//fmt.Println(start)
	//world := newWorld(in.lines)
	//world.getLand(Point{0, 0}).positions[start] = true
	//steps := make([]int, 0)
	//for i := 0; i < 500; i++ {
	//	//fmt.Printf("%d,%d\n", i, world.size())
	//	if (i-start.x)%len(in.lines) == 0 {
	//		steps = append(steps, world.size())
	//		if len(steps) == 4 {
	//			break
	//		}
	//	}
	//	world = world.evolve()
	//}
	steps := []int{3691, 32975, 91439, 179083} // “cached” result of commented out thing above :)
	//fmt.Println(steps)
	d1 := uint64(steps[1] - steps[0])
	d2 := uint64(steps[2]-steps[1]) - d1
	//fmt.Println(d1, d2)
	target := 26501365
	n := uint64(target-start.x) / uint64(len(in.lines))
	result := (d2/2)*n*n + (d1-d2/2)*n + uint64(steps[0])
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
