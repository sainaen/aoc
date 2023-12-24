package main

import (
	"fmt"
	"log"
	"maps"
)

// @formatter:off
/*
--------Part 1--------   --------Part 2--------
    Time   Rank  Score       Time   Rank  Score
00:34:24   1390      0       >24h   9414      0
*/
// @formatter:on
func main() {
	fmt.Println("Day 23")
	inputFile := "2023/day_23/input.txt"
	sampleLines := `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`

	fmt.Println("-------------")
	part1(sample(sampleLines))
	part1(fullInput(inputFile))

	fmt.Println("-------------")
	part2(sample(sampleLines))
	part2(fullInput(inputFile))
}

func part1(in input) {
	var start *Point
	for y := range in.lines[0] {
		if in.lines[0][y] == '.' {
			start = &Point{0, y}
		}
	}
	if start == nil {
		log.Fatalln("Couldn't find starting point")
		return
	}
	result := countSteps(in.lines, start, 0, make(map[Point]bool), neighboursP1)
	fmt.Printf("part 1 (%s): %v\n", in.kind, result)
}

type Point struct {
	x int
	y int
}

func countSteps(field []string, p *Point, l int, visited map[Point]bool, ns func([]string, *Point, map[Point]bool) []*Point) int {
	if p.x == len(field)-1 {
		return l
	}
	visited[*p] = true
	neighbours := ns(field, p, visited)
	for len(neighbours) == 1 {
		n := neighbours[0]
		p = n
		visited[*p] = true
		l += 1
		neighbours = ns(field, p, visited)
	}
	if p.x == len(field)-1 {
		return l
	}
	result := 0
	for _, n := range neighbours {
		result = max(result, countSteps(field, n, l+1, maps.Clone(visited), ns))
	}
	return result
}

func neighboursP1(field []string, p *Point, visited map[Point]bool) []*Point {
	var xs []int
	var ys []int
	switch field[p.x][p.y] {
	case '>':
		xs = []int{0}
		ys = []int{1}
	case 'v':
		xs = []int{1}
		ys = []int{0}
	case '.':
		xs = []int{-1, 1, 0, 0}
		ys = []int{0, 0, -1, 1}
	default:
		log.Fatalf("Unepexted c: %c at [%d, %d]\n", field[p.x][p.y], p.x, p.y)
	}
	result := make([]*Point, 0)
	for i, dx := range xs {
		dy := ys[i]
		nx := p.x + dx
		ny := p.y + dy
		if 0 <= nx && nx < len(field) && 0 <= ny && ny < len(field[nx]) {
			if field[nx][ny] == '#' {
				continue
			}
			n := Point{nx, ny}
			if visited[n] {
				continue
			}
			result = append(result, &n)
		}
	}
	return result
}

func neighboursP2(field []string, p *Point, visited map[Point]bool) []*Point {
	xs := []int{-1, 1, 0, 0}
	ys := []int{0, 0, -1, 1}
	result := make([]*Point, 0)
	for i, dx := range xs {
		dy := ys[i]
		nx := p.x + dx
		ny := p.y + dy
		if 0 <= nx && nx < len(field) && 0 <= ny && ny < len(field[nx]) {
			if field[nx][ny] == '#' {
				continue
			}
			n := Point{nx, ny}
			if visited[n] {
				continue
			}
			result = append(result, &n)
		}
	}
	return result
}

type Graph struct {
	start *Point
	end   *Point
	nodes map[Point]bool
	edges map[Point]map[Point]int
}

func (g *Graph) addNode(p Point) {
	if _, ok := g.nodes[p]; !ok {
		if p.x == 0 {
			g.start = &p
		} else if g.end == nil || p.x > g.end.x {
			g.end = &p
		}
		g.nodes[p] = true
	}
}

func (g *Graph) edgesOf(p Point) map[Point]int {
	if _, ok := g.edges[p]; !ok {
		g.edges[p] = make(map[Point]int)
	}
	return g.edges[p]
}

func (g *Graph) addEdge(p1, p2 Point, dist int) {
	g.addNode(p1)
	g.addNode(p2)
	g.edgesOf(p1)[p2] = dist
	g.edgesOf(p2)[p1] = dist
}

func (g *Graph) delEdge(p1, p2 Point) {
	p1Edges := g.edgesOf(p1)
	delete(p1Edges, p2)
	if len(p1Edges) == 0 {
		delete(g.edges, p1)
	}
	p2Edges := g.edgesOf(p2)
	delete(p2Edges, p1)
	if len(p2Edges) == 0 {
		delete(g.edges, p2)
	}
}

func keys[K comparable, V any](m map[K]V) []K {
	result := make([]K, len(m))
	i := 0
	for n := range m {
		result[i] = n
		i += 1
	}
	return result
}

func (g *Graph) shrink() {
	for step := 0; step < 100_000; step++ {
		if step == 100_000-1 {
			fmt.Println("Out of loops :(")
		}
		updated := false
		for p, edges := range g.edges {
			if len(edges) != 2 {
				continue
			}
			ns := keys(edges)
			before := ns[0]
			beforeDist := edges[before]
			after := ns[1]
			afterDist := edges[after]
			g.addEdge(before, after, beforeDist+afterDist)
			g.delEdge(p, before)
			g.delEdge(p, after)
			delete(g.nodes, p)
			updated = true
			break
		}
		if !updated {
			break
		}
	}
}

func (g *Graph) maxDistance(p *Point, l int, visited map[Point]bool) int {
	if *p == *g.end {
		return l
	}
	visited[*p] = true
	result := 0
	for n, dist := range g.edgesOf(*p) {
		if visited[n] {
			continue
		}
		result = max(result, g.maxDistance(&n, l+dist, maps.Clone(visited)))
	}
	return result
}

func part2(in input) {
	graph := &Graph{nodes: make(map[Point]bool), edges: make(map[Point]map[Point]int)}
	for i, l := range in.lines {
		for j, c := range l {
			if c != '#' {
				p := Point{i, j}
				for _, n := range neighboursP2(in.lines, &p, make(map[Point]bool)) {
					graph.addEdge(p, *n, 1)
				}
			}
		}
	}
	graph.shrink()
	result := graph.maxDistance(graph.start, 0, make(map[Point]bool))
	fmt.Printf("part 2 (%s): %v\n", in.kind, result)
}
